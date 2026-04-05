# Spec 09: Admin AI Widget

## Context

The RFE admin panel (Payload CMS 3.81, Next.js 16) currently has a white-labeled UI with custom branding, a content reset button, and live preview with breakpoints. Content editors need an in-admin AI assistant that helps them:

1. **Get help** — ask "how do I do X?" and receive guidance + deep links to the right admin panel section
2. **Perform actions** — ask the AI to do things on their behalf (create pages, update fields, modify content)
3. **Edit from live preview** — right-click elements in the live preview iframe and ask AI to change the underlying form data, with instant visual feedback

### Current admin customization

- `admin.components.graphics`: Icon, Logo
- `admin.components.beforeLogin`: BeforeLogin splash
- `admin.components.afterDashboard`: ResetContentButton
- `admin.livePreview`: configured with breakpoints for Pages collection
- Custom admin components live in `packages/cms/src/components/`
- Admin theme CSS in `packages/cms/src/styles/admin.css`
- No existing AI packages or API routes for AI

### Stack choices

- **AI SDK**: Vercel AI SDK (`ai` + `@ai-sdk/openai` or `@ai-sdk/anthropic`) — streaming, tool calling, React hooks
- **Model**: Configurable via env (default: GPT-4o or Claude Sonnet)
- **Admin integration**: Payload custom `providers` array for the floating widget + custom admin components

## Acceptance Criteria

### Phase 1 — AI Help Chat Widget
- [ ] Floating chat widget appears in the admin panel (bottom-right corner)
- [ ] Widget is collapsible/expandable, persists across admin navigation
- [ ] User can type natural language questions
- [ ] AI responds with contextual help about the RFE admin panel
- [ ] AI responses include clickable deep links to admin sections (e.g., "Go to Pages → home")
- [ ] AI knows the Payload schema (collections, globals, fields) from a system prompt
- [ ] Streaming responses (token-by-token rendering)
- [ ] Chat history persists in the session (cleared on page refresh is fine)
- [ ] Widget uses Payload admin theme variables for consistent styling

### Phase 2 — AI Actions (Agent Mode)
- [ ] User can ask the AI to perform CMS operations (create, update, delete content)
- [ ] AI uses tool calling to execute Payload Local API operations server-side
- [ ] Actions require explicit user confirmation before execution ("I'll update the hero title to X. Confirm?")
- [ ] Action results are displayed in the chat (success/failure with details)
- [ ] Available tools: create page, update page field, update global field, upload media, list content
- [ ] After action completion, relevant admin views refresh automatically

### Phase 3 — Live Preview AI Editing
- [ ] In live preview mode, user can right-click on rendered elements
- [ ] Context menu shows "Ask AI to edit this" option
- [ ] Clicking opens the AI chat pre-filled with context about the clicked element
- [ ] AI can identify which Payload field corresponds to the selected element
- [ ] AI modifies form field values through the Payload admin form API
- [ ] Changes appear instantly in the live preview (via existing autosave + live preview mechanism)
- [ ] Works for text fields, rich text, image uploads (field identification via data attributes)

## Architecture

### Component Hierarchy

```
PayloadAdminRoot
├── AIChatProvider (custom provider — wraps admin)
│   ├── AIChatWidget (floating UI)
│   │   ├── ChatMessages
│   │   ├── ChatInput
│   │   └── ActionConfirmation
│   └── children (rest of admin)
└── LivePreviewAIBridge (injected into live preview iframe)
```

### API Routes

```
app/api/ai/
├── chat/route.ts          ← POST: streaming chat completion (Vercel AI SDK)
├── actions/route.ts       ← POST: execute confirmed AI actions via Payload Local API
└── schema/route.ts        ← GET: returns Payload schema summary for AI context
```

### Data Flow

```
1. HELP MODE:
   User types question → POST /api/ai/chat → AI responds with markdown + links

2. ACTION MODE:
   User asks AI to do something
   → AI proposes action (tool call) → displays confirmation UI
   → User confirms → POST /api/ai/actions → Payload Local API executes
   → Result streamed back → admin view refreshed

3. LIVE PREVIEW MODE:
   User right-clicks element in preview iframe
   → postMessage to parent with element path + current text
   → AI chat opens with pre-filled context
   → AI modifies form values via Payload useForm/useField hooks
   → Autosave triggers → live preview updates
```

### System Prompt Strategy

The AI system prompt will include:
- The Payload schema (collections, globals, field names/types) — generated at build time or fetched via `/api/ai/schema`
- Admin panel URL patterns (so it can generate deep links)
- Available actions and their parameters
- Tone: helpful, concise, RFE-brand-aware

### Live Preview Element Mapping

For Phase 3, frontend components need `data-payload-field` attributes:

```tsx
<h1 data-payload-field="hero.heading">{hero.heading}</h1>
<p data-payload-field="hero.subHeading">{hero.subHeading}</p>
```

The live preview bridge script reads these attributes on right-click to identify which form field to target.

## API / Interface Contracts

### Chat API

```typescript
// POST /api/ai/chat
// Request: Vercel AI SDK compatible
{
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  context?: {
    currentPath?: string      // admin panel path user is on
    currentCollection?: string // collection being edited
    currentDocId?: string      // document ID being edited
    selectedElement?: {        // from live preview right-click
      fieldPath: string
      currentValue: string
      elementTag: string
    }
  }
}
// Response: ReadableStream (Vercel AI SDK streaming format)

// POST /api/ai/actions
{
  action: 'createPage' | 'updateField' | 'updateGlobal' | 'uploadMedia' | 'listContent'
  params: Record<string, unknown>
}
// Response: { success: boolean; result?: unknown; error?: string }

// GET /api/ai/schema
// Response: { collections: CollectionSummary[]; globals: GlobalSummary[] }
```

### Admin Components

```typescript
// Provider — registered in payload config admin.components.providers
export const AIChatProvider: React.FC<{ children: React.ReactNode }>

// Floating widget — rendered by provider
export const AIChatWidget: React.FC

// Live preview bridge — injected via admin.components.afterDocument or custom hook
export const LivePreviewAIBridge: React.FC
```

### Package exports (addition to @rfe/cms)

```json
{
  "./components/AIChatProvider": "...",
  "./components/AIChatWidget": "...",
  "./components/LivePreviewAIBridge": "..."
}
```

## File Structure

```
packages/cms/src/
├── components/
│   ├── AIChat/
│   │   ├── index.tsx              ← AIChatProvider (registered as admin provider)
│   │   ├── AIChatWidget.tsx       ← floating chat UI
│   │   ├── ChatMessages.tsx       ← message list with markdown rendering
│   │   ├── ChatInput.tsx          ← input + send button
│   │   ├── ActionConfirmation.tsx ← confirmation dialog for AI actions
│   │   ├── useAIChat.ts           ← hook wrapping Vercel AI SDK useChat
│   │   ├── types.ts               ← shared types
│   │   └── styles.ts              ← inline styles (same pattern as ResetContentButton)
│   ├── LivePreviewAI/
│   │   ├── index.tsx              ← LivePreviewAIBridge component
│   │   └── previewScript.ts       ← script injected into preview iframe
│   └── ... (existing components)

apps/rfe-v0/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── chat/route.ts      ← streaming chat endpoint
│   │       ├── actions/route.ts   ← action execution endpoint
│   │       └── schema/route.ts    ← schema introspection endpoint
│   └── ...
├── components/
│   └── ... (add data-payload-field attributes to block components)
```

## Environment Variables

```env
# AI Configuration
AI_PROVIDER=openai              # or "anthropic"
OPENAI_API_KEY=sk-...           # if using OpenAI
ANTHROPIC_API_KEY=sk-ant-...    # if using Anthropic
AI_MODEL=gpt-4o                 # model identifier
AI_ENABLED=true                 # feature flag to disable AI widget
```

## Dependencies (new)

```
ai                    ← Vercel AI SDK core
@ai-sdk/openai        ← OpenAI provider (or @ai-sdk/anthropic)
react-markdown        ← render AI responses as markdown in chat
```

## Implementation Phases

### Phase 1: Help Chat (MVP) — ~2 days
1. Install AI SDK dependencies
2. Create `/api/ai/chat` route with streaming
3. Create `/api/ai/schema` route (introspect Payload config)
4. Build system prompt with schema context + admin URL patterns
5. Build `AIChatWidget` component (floating UI)
6. Build `AIChatProvider` and register in Payload admin config
7. Style widget with Payload admin theme variables
8. Test: ask questions, verify deep links work

### Phase 2: AI Actions — ~2 days
1. Define tool schemas for Vercel AI SDK tool calling
2. Create `/api/ai/actions` route with Payload Local API execution
3. Add confirmation UI in chat widget
4. Implement tools: createPage, updateField, updateGlobal, listContent
5. Add post-action admin refresh logic
6. Test: ask AI to create/update content, verify confirmation flow

### Phase 3: Live Preview AI Editing — ~3 days
1. Add `data-payload-field` attributes to frontend block components
2. Create `LivePreviewAIBridge` component
3. Inject right-click handler into live preview iframe via postMessage
4. Connect right-click context to AI chat widget
5. Implement form field modification via Payload admin form hooks
6. Test: right-click in preview → AI edits field → preview updates

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| AI hallucinating admin URLs | Generate links from actual Payload config, not AI text |
| AI performing destructive actions | Mandatory confirmation step + action allowlist |
| Live preview iframe CORS issues | Same-origin (both admin + preview on localhost:3000) |
| Field mapping inaccuracy | Use explicit `data-payload-field` attributes, not DOM heuristics |
| API key exposure | Keys stay server-side only (API routes), never sent to client |
| Cost management | Rate limit AI requests per session, model configurable via env |

## Verification Checklist

- [ ] `pnpm build` succeeds with all new components
- [ ] AI chat widget renders in admin panel
- [ ] Chat persists across admin navigation
- [ ] Deep links in AI responses navigate correctly
- [ ] AI actions execute and show results
- [ ] Action confirmation prevents accidental mutations
- [ ] Live preview right-click triggers AI context menu
- [ ] Form field updates propagate to live preview
- [ ] Widget respects `AI_ENABLED=false` flag
- [ ] No API keys leaked to client bundle
- [ ] Mobile admin breakpoint: widget is usable
