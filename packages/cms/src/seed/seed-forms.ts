import type { Payload } from 'payload'

function lexicalText(text: string) {
  return { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function lexicalParagraphNode(text: string) {
  return {
    children: [lexicalText(text)],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function lexicalRoot(children: ReturnType<typeof lexicalParagraphNode>[]) {
  return {
    root: {
      children,
      direction: 'ltr' as const,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

const CONTACT_FORM_TITLE = 'RFE Contact'

export type SeedFormsResult = { contactFormId: number | null }

export async function seedForms(payload: Payload): Promise<SeedFormsResult> {
  console.log('[seed-forms] Seeding form builder forms...')

  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: CONTACT_FORM_TITLE } },
    limit: 1,
  })

  const confirmationMessage = lexicalRoot([
    lexicalParagraphNode('Thank you for reaching out. We will get back to you shortly.'),
  ])

  const data = {
    title: CONTACT_FORM_TITLE,
    submitButtonLabel: 'Send',
    confirmationType: 'message' as const,
    confirmationMessage,
    fields: [
      {
        blockType: 'text' as const,
        name: 'name',
        label: 'Name',
        required: true,
        width: 100,
      },
      {
        blockType: 'email' as const,
        name: 'email',
        label: 'Email',
        required: true,
        width: 100,
      },
      {
        blockType: 'textarea' as const,
        name: 'message',
        label: 'Message',
        required: true,
        width: 100,
      },
    ],
  }

  if (existing.docs.length > 0) {
    const id = existing.docs[0]!.id as number
    await payload.update({
      collection: 'forms',
      id,
      data,
    })
    console.log(`[seed-forms] Updated form: ${CONTACT_FORM_TITLE} (id ${id})`)
    return { contactFormId: id }
  }

  const doc = await payload.create({
    collection: 'forms',
    data,
  })
  const id = doc.id as number
  console.log(`[seed-forms] Created form: ${CONTACT_FORM_TITLE} (id ${id})`)
  return { contactFormId: id }
}
