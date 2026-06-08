import type { Payload } from 'payload'

type CollectionSlug = 'works' | 'works-groups' | 'forms'

function extractRelationshipId(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value)
  if (typeof value === 'object' && 'id' in value) {
    return extractRelationshipId((value as { id: unknown }).id)
  }
  return null
}

function normalizeHasMany(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value
    .map(extractRelationshipId)
    .filter((id): id is number => id != null)
}

function normalizeSingle(value: unknown): number | null {
  return extractRelationshipId(value)
}

async function getExistingIds(
  payload: Payload,
  collection: CollectionSlug,
  ids: number[],
): Promise<Set<number>> {
  if (ids.length === 0) return new Set()

  const result = await payload.find({
    collection,
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    pagination: false,
  })

  return new Set(result.docs.map((doc) => doc.id as number))
}

function collectRelationshipIds(fields: Record<string, unknown>, buckets: {
  workIds: Set<number>
  groupIds: Set<number>
  formIds: Set<number>
}) {
  const blockType = fields.blockType

  if (blockType === 'worksGrid' || blockType === 'worksScroll') {
    if (fields.sourceType === 'pick') {
      for (const id of normalizeHasMany(fields.selectedWorks)) buckets.workIds.add(id)
    }
    if (fields.sourceType === 'group') {
      const id = normalizeSingle(fields.worksGroup)
      if (id != null) buckets.groupIds.add(id)
    }
  }

  if (blockType === 'worksScroll' && Array.isArray(fields.items)) {
    for (const item of fields.items) {
      if (!item || typeof item !== 'object') continue
      const id = normalizeSingle((item as Record<string, unknown>).work)
      if (id != null) buckets.workIds.add(id)
    }
  }

  if (blockType === 'featuredWork') {
    const id = normalizeSingle(fields.work)
    if (id != null) buckets.workIds.add(id)
  }

  if (blockType === 'embeddedForm') {
    const id = normalizeSingle(fields.form)
    if (id != null) buckets.formIds.add(id)
  }
}

function sanitizeLexicalBlockFields(
  fields: Record<string, unknown>,
  existingWorkIds: Set<number>,
  existingGroupIds: Set<number>,
  existingFormIds: Set<number>,
) {
  const blockType = fields.blockType

  if (blockType === 'worksGrid' || blockType === 'worksScroll') {
    if (fields.sourceType === 'pick' && fields.selectedWorks != null) {
      fields.selectedWorks = normalizeHasMany(fields.selectedWorks).filter((id) =>
        existingWorkIds.has(id),
      )
    }

    if (fields.sourceType === 'group' && fields.worksGroup != null) {
      const id = normalizeSingle(fields.worksGroup)
      fields.worksGroup = id != null && existingGroupIds.has(id) ? id : null
    }
  }

  if (blockType === 'worksScroll' && Array.isArray(fields.items)) {
    for (const item of fields.items) {
      if (!item || typeof item !== 'object') continue
      const record = item as Record<string, unknown>
      const id = normalizeSingle(record.work)
      record.work = id != null && existingWorkIds.has(id) ? id : null
    }
  }

  if (blockType === 'featuredWork' && fields.work != null) {
    const id = normalizeSingle(fields.work)
    fields.work = id != null && existingWorkIds.has(id) ? id : null
  }

  if (blockType === 'embeddedForm' && fields.form != null) {
    const id = normalizeSingle(fields.form)
    fields.form = id != null && existingFormIds.has(id) ? id : null
  }
}

function walkRichTextChildren(
  children: unknown,
  visitor: (fields: Record<string, unknown>) => void,
) {
  if (!Array.isArray(children)) return

  for (const child of children) {
    if (!child || typeof child !== 'object') continue
    const node = child as Record<string, unknown>
    if (node.type !== 'block' || !node.fields || typeof node.fields !== 'object') continue
    visitor(node.fields as Record<string, unknown>)
  }
}

function walkLayoutForCollection(
  layout: unknown,
  visitor: (fields: Record<string, unknown>) => void,
) {
  if (!Array.isArray(layout)) return

  for (const block of layout) {
    if (!block || typeof block !== 'object') continue
    const record = block as Record<string, unknown>
    if (record.blockType !== 'content' || !Array.isArray(record.columns)) continue

    for (const column of record.columns) {
      if (!column || typeof column !== 'object') continue
      const richText = (column as Record<string, unknown>).richText as
        | { root?: { children?: unknown } }
        | undefined
      walkRichTextChildren(richText?.root?.children, visitor)
    }
  }
}

/**
 * Normalizes relationship fields inside lexical inline blocks to numeric IDs
 * and removes references to deleted documents (common cause of save validation errors).
 */
export async function sanitizePageLayout(layout: unknown, payload: Payload): Promise<unknown> {
  if (!Array.isArray(layout)) return layout

  const buckets = {
    workIds: new Set<number>(),
    groupIds: new Set<number>(),
    formIds: new Set<number>(),
  }

  walkLayoutForCollection(layout, (fields) => collectRelationshipIds(fields, buckets))

  const [existingWorkIds, existingGroupIds, existingFormIds] = await Promise.all([
    getExistingIds(payload, 'works', [...buckets.workIds]),
    getExistingIds(payload, 'works-groups', [...buckets.groupIds]),
    getExistingIds(payload, 'forms', [...buckets.formIds]),
  ])

  const nextLayout = structuredClone(layout) as unknown[]
  walkLayoutForCollection(nextLayout, (fields) =>
    sanitizeLexicalBlockFields(fields, existingWorkIds, existingGroupIds, existingFormIds),
  )

  return nextLayout
}
