# Spec 05: Works Groups (Gallery Picker UX)

## Context

The `worksGrid` block currently has no direct relationship to specific works. The layout fetches ALL works into React context, and `WorksGridBlock` does client-side filtering by `category`/`!category`. The admin has no way to curate which works appear on which page — it's all-or-nothing with runtime filters.

A new `WorksGroup` collection gives admins a gallery-picker experience: create named, ordered lists of works, then reference them from blocks.

## Acceptance Criteria

- [ ] `works-groups` collection exists with `name`, `slug`, and `items` (hasMany relationship to `works`)
- [ ] `worksGrid` block has an optional `worksGroup` relationship field
- [ ] `worksScroll` block has an optional `worksGroup` relationship field
- [ ] When a block references a group, it displays those works in order
- [ ] When no group is set, current fallback behavior is preserved
- [ ] Seed script creates default groups: "Our Work", "Development", "Home Featured"
- [ ] Seed is idempotent
- [ ] Admin panel shows the collection and allows drag-to-reorder
- [ ] Build passes

## API / Interface Contracts

### Collection: `works-groups`
```typescript
{
  slug: 'works-groups',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'items', type: 'relationship', relationTo: 'works', hasMany: true },
  ]
}
```

### Block changes
- `worksGrid.worksGroup`: `relationship` → `works-groups` (optional)
- `worksScroll.worksGroup`: `relationship` → `works-groups` (optional)

### CMS client addition
```typescript
export async function getWorksGroup(slug: string): Promise<WorksGroupData | null>
```

## File Structure

```
packages/cms/src/collections/WorksGroups.ts  ← new
packages/cms/src/seed/seed-works-groups.ts    ← new
```

## Verification Checklist

- [ ] Build passes
- [ ] Seed runs and is idempotent
- [ ] Admin shows WorksGroups collection with relationship picker
- [ ] WorksGrid block renders from group when set
- [ ] WorksScroll block renders from group when set
- [ ] Fallback behavior unchanged when no group is set
- [ ] Pages render correctly at mobile and desktop
