import { streamText, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getPayload } from 'payload'
import { z } from 'zod'
import type { Tool, ToolSet } from 'ai'
import config from '@/payload.config'

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the RFE Admin Assistant, an AI helper embedded in the Payload CMS admin panel for RFE (Rohm Feifer Entertainment), a woman-owned film & TV production company.

## What you can do

### Help & Navigate
- Answer questions about the admin panel
- Explain collections, globals, fields, and blocks
- Provide deep links to admin sections

### Read Content
- List documents from any collection
- Read specific documents by ID
- Search content by field values
- Get content statistics (counts)
- Read global settings

### Create & Edit Content
- Create new documents in any collection (pages, works, team members, press items, etc.)
- Update existing documents by ID
- You operate on behalf of the authenticated admin user

## CMS Schema

### Collections
- **Pages** (\`pages\`): Website pages with hero sections and block-based layouts. Fields: title, slug, hero (cinematic/page/minimal type, headline, subtitle, label, media, imagePosition), layout (blocks array), SEO meta, publishedAt. Supports drafts + autosave + scheduled publishing. [Go to Pages](/admin/collections/pages)
- **Works** (\`works\`): Film & TV productions. Fields: title, slug, year, poster (image upload), tags (Drama/Thriller/True Crime/Unscripted), description, videoUrl, category (film/series/unscripted), subcategory, seo, sortOrder. [Go to Works](/admin/collections/works)
- **Works Groups** (\`works-groups\`): Curated ordered collections of works. Fields: name, slug, items (ordered relationship to works). [Go to Works Groups](/admin/collections/works-groups)
- **Team Members** (\`team-members\`): Team bios. Fields: name, role, bio, photo (image upload), sortOrder. [Go to Team](/admin/collections/team-members)
- **Press Items** (\`press-items\`): Press coverage & awards. Fields: title, source, date, url, description, sortOrder. [Go to Press](/admin/collections/press-items)
- **Media** (\`media\`): Image library (image/* only). Auto-generates sizes: thumbnail (400w), poster (800w), hero (1920w), og (1200×630). Localized alt text. [Go to Media](/admin/collections/media)
- **Users** (\`users\`): Admin users (read-only for you). [Go to Users](/admin/collections/users)
- **Forms** (\`forms\`): Form builder forms. [Go to Forms](/admin/collections/forms)
- **Form Submissions** (\`form-submissions\`): Submitted form data. [Go to Submissions](/admin/collections/form-submissions)

### Globals
- **Site Configuration** (\`site-config\`): Brand settings, color palette, section tones, typography, easings, SEO defaults, contact info, social links, about page content, legal content, admin settings. [Go to Site Config](/admin/globals/site-config)
- **Navigation** (\`navigation\`): Header nav items and footer settings. [Go to Navigation](/admin/globals/navigation)

### Page Blocks (available in page layout field)
content, worksScroll, worksGrid, featuredWork, teamShowcase, pressList, cta, mediaBlock, contactForm, contactInfo, twoColumnLayout, legalSections, embeddedForm

### Hero Types
1. **Cinematic**: Full-bleed background image with headline, subtitle, label overlay
2. **Page**: Standard page hero with headline, subtitle, label, background image
3. **Minimal**: Text-only hero, no background image

## Admin Navigation
- Dashboard: [/admin](/admin)
- Pages: [/admin/collections/pages](/admin/collections/pages)
- Works: [/admin/collections/works](/admin/collections/works)
- Works Groups: [/admin/collections/works-groups](/admin/collections/works-groups)
- Team: [/admin/collections/team-members](/admin/collections/team-members)
- Press: [/admin/collections/press-items](/admin/collections/press-items)
- Media: [/admin/collections/media](/admin/collections/media)
- Users: [/admin/collections/users](/admin/collections/users)
- Site Config: [/admin/globals/site-config](/admin/globals/site-config)
- Navigation: [/admin/globals/navigation](/admin/globals/navigation)

## Tool Usage Guidelines
- Use \`listContent\` to browse collections before making changes
- Use \`readDocument\` to check current values before updating
- Use \`createDocument\` to create new content — always set required fields
- Use \`updateDocument\` to modify existing content — only send fields you want to change
- Use \`readGlobal\` to check global settings
- Use \`getStats\` to get an overview of content counts
- When creating pages, set at minimum: title, slug, hero.type
- When creating works, set at minimum: title, slug, year, category
- For draft content, set _status: "draft" (default). For publishing, set _status: "published"
- Always confirm with the user before creating or modifying content

## Response Guidelines
- Be concise and direct
- Use markdown links to admin sections: [text](/admin/path)
- After creating/updating content, provide a link to the document in admin
- Reference specific field names from the schema
- If asked about something outside the CMS, politely redirect`

// ---------------------------------------------------------------------------
// Collection slugs
// ---------------------------------------------------------------------------

const ALL_COLLECTIONS = [
  'pages', 'works', 'works-groups', 'team-members',
  'press-items', 'media', 'users', 'forms', 'form-submissions',
] as const

const WRITABLE_COLLECTIONS = [
  'pages', 'works', 'works-groups', 'team-members',
  'press-items', 'media',
] as const

const READABLE_GLOBALS = ['site-config', 'navigation'] as const

const SEARCHABLE_COLLECTIONS = [
  'pages', 'works', 'team-members', 'press-items',
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toRecord(doc: unknown): Record<string, unknown> {
  return doc as Record<string, unknown>
}

function summarizeDoc(doc: unknown): Record<string, unknown> {
  const d = toRecord(doc)
  const summary: Record<string, unknown> = { id: d.id }
  for (const key of ['title', 'name', 'slug', 'filename', 'email', 'category', 'year', 'role', '_status', 'createdAt', 'updatedAt']) {
    if (d[key] !== undefined) summary[key] = d[key]
  }
  return summary
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

function buildTools(payload: Awaited<ReturnType<typeof getPayload>>): ToolSet {
  const tools: Record<string, Tool<any, any>> = {
    listContent: {
      description: 'List documents from a collection. Returns titles, IDs, and key fields.',
      inputSchema: z.object({
        collection: z.enum(ALL_COLLECTIONS).describe('The collection slug to query'),
        limit: z.number().min(1).max(50).default(10).describe('Max documents to return'),
        page: z.number().min(1).default(1).describe('Page number for pagination'),
        sort: z.string().optional().describe('Sort field, prefix with - for descending (e.g. "-createdAt")'),
      }),
      execute: async (params: { collection: string; limit: number; page: number; sort?: string }) => {
        const result = await payload.find({
          collection: params.collection as (typeof ALL_COLLECTIONS)[number],
          limit: params.limit,
          page: params.page,
          sort: params.sort || '-createdAt',
          depth: 0,
        })
        return {
          docs: result.docs.map(summarizeDoc),
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
          page: result.page,
          hasNextPage: result.hasNextPage,
        }
      },
    },

    readDocument: {
      description: 'Read a single document by ID from a collection. Returns all fields.',
      inputSchema: z.object({
        collection: z.enum(ALL_COLLECTIONS).describe('The collection slug'),
        id: z.string().describe('The document ID'),
      }),
      execute: async (params: { collection: string; id: string }) => {
        const doc = await payload.findByID({
          collection: params.collection as (typeof ALL_COLLECTIONS)[number],
          id: params.id,
          depth: 1,
        })
        return toRecord(doc)
      },
    },

    createDocument: {
      description: 'Create a new document in a collection. Returns the created document ID and admin link.',
      inputSchema: z.object({
        collection: z.enum(WRITABLE_COLLECTIONS).describe('The collection to create in'),
        data: z.record(z.unknown()).describe(
          'The document data. Pages: title, slug, hero.type. Works: title, slug, year, category.',
        ),
        draft: z.boolean().default(true).describe('Create as draft (true) or published (false)'),
      }),
      execute: async (params: { collection: string; data: Record<string, unknown>; draft: boolean }) => {
        const doc = await payload.create({
          collection: params.collection as (typeof WRITABLE_COLLECTIONS)[number],
          data: params.data,
          draft: params.draft,
        })
        const r = toRecord(doc)
        return {
          id: r.id,
          message: `Created ${params.collection} document`,
          adminUrl: `/admin/collections/${params.collection}/${r.id}`,
        }
      },
    },

    updateDocument: {
      description: 'Update an existing document by ID. Only send the fields you want to change.',
      inputSchema: z.object({
        collection: z.enum(WRITABLE_COLLECTIONS).describe('The collection slug'),
        id: z.string().describe('The document ID to update'),
        data: z.record(z.unknown()).describe('Fields to update (partial — only changed fields needed)'),
        draft: z.boolean().optional().describe('Set to false to publish, true to keep as draft'),
      }),
      execute: async (params: { collection: string; id: string; data: Record<string, unknown>; draft?: boolean }) => {
        const doc = await payload.update({
          collection: params.collection as (typeof WRITABLE_COLLECTIONS)[number],
          id: params.id,
          data: params.data,
          draft: params.draft,
        })
        const r = toRecord(doc)
        return {
          id: r.id,
          message: `Updated ${params.collection} document`,
          adminUrl: `/admin/collections/${params.collection}/${r.id}`,
        }
      },
    },

    readGlobal: {
      description: 'Read a global configuration object (site settings, navigation, etc.).',
      inputSchema: z.object({
        slug: z.enum(READABLE_GLOBALS).describe('The global slug'),
      }),
      execute: async (params: { slug: string }) => {
        const doc = await payload.findGlobal({
          slug: params.slug as (typeof READABLE_GLOBALS)[number],
          depth: 1,
        })
        return toRecord(doc)
      },
    },

    updateGlobal: {
      description: 'Update a global configuration. Only send the fields you want to change.',
      inputSchema: z.object({
        slug: z.enum(READABLE_GLOBALS).describe('The global slug'),
        data: z.record(z.unknown()).describe('Fields to update (partial update)'),
      }),
      execute: async (params: { slug: string; data: Record<string, unknown> }) => {
        await payload.updateGlobal({
          slug: params.slug as (typeof READABLE_GLOBALS)[number],
          data: params.data,
        })
        return {
          message: `Updated global: ${params.slug}`,
          adminUrl: `/admin/globals/${params.slug}`,
        }
      },
    },

    getStats: {
      description: 'Get content statistics — document counts per collection.',
      inputSchema: z.object({
        _unused: z.string().optional().describe('No input needed — just call this tool'),
      }),
      execute: async () => {
        const counts: Record<string, number> = {}
        await Promise.all(
          ALL_COLLECTIONS.map(async (slug) => {
            const result = await payload.count({ collection: slug })
            counts[slug] = result.totalDocs
          }),
        )
        return counts
      },
    },

    searchContent: {
      description: 'Search across a collection by text query. Searches title/name fields.',
      inputSchema: z.object({
        collection: z.enum(SEARCHABLE_COLLECTIONS).describe('Collection to search in'),
        query: z.string().describe('Text to search for'),
        limit: z.number().min(1).max(20).default(10),
      }),
      execute: async (params: { collection: string; query: string; limit: number }) => {
        const coll = params.collection as (typeof SEARCHABLE_COLLECTIONS)[number]
        const searchField = coll === 'team-members' ? 'name' : 'title'
        const result = await payload.find({
          collection: coll,
          limit: params.limit,
          where: { [searchField]: { contains: params.query } },
          depth: 0,
        })
        return {
          docs: result.docs.map((doc) => {
            const d = toRecord(doc)
            return { id: d.id, [searchField]: d[searchField], slug: d.slug, updatedAt: d.updatedAt }
          }),
          totalDocs: result.totalDocs,
        }
      },
    },
  }

  return tools
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

export async function HEAD() {
  if (process.env.AI_ENABLED === 'false') {
    return new Response(null, { status: 403 })
  }
  return new Response(null, { status: 200 })
}

export async function POST(req: Request) {
  if (process.env.AI_ENABLED === 'false') {
    return new Response('AI assistant is disabled', { status: 403 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { messages } = body as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  const tools = buildTools(payload)

  const result = streamText({
    model: openai(process.env.AI_MODEL || 'gpt-4o'),
    system: SYSTEM_PROMPT,
    messages,
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toTextStreamResponse()
}
