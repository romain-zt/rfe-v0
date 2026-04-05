'use client'

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ConversationSummary = {
  id: string
  title: string
  updatedAt: string
}

const SUGGESTIONS = [
  'How do I create a new page?',
  'Where do I edit the homepage?',
  'How do I add a new team member?',
  'Create a new draft page called "Test"',
  'List all works in the database',
]

const OPEN_KEY = 'rfe-ai-chat-open'
const CONV_KEY = 'rfe-ai-conv-id'

// ---------------------------------------------------------------------------
// Hook — manages conversations via Payload REST API
// ---------------------------------------------------------------------------

function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(() => {
    try { return sessionStorage.getItem(CONV_KEY) || null } catch { return null }
  })
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    try {
      if (conversationId) sessionStorage.setItem(CONV_KEY, conversationId)
      else sessionStorage.removeItem(CONV_KEY)
    } catch { /* ignore */ }
  }, [conversationId])

  const fetchConversations = useCallback(async () => {
    setIsLoadingList(true)
    try {
      const res = await fetch(
        '/api/ai-conversations?sort=-updatedAt&limit=50&depth=0',
        { credentials: 'include' },
      )
      if (res.ok) {
        const data = await res.json()
        setConversations(
          (data.docs ?? []).map((d: Record<string, unknown>) => ({
            id: d.id as string,
            title: d.title as string,
            updatedAt: d.updatedAt as string,
          })),
        )
      }
    } catch { /* ignore */ }
    setIsLoadingList(false)
  }, [])

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/ai-conversations/${id}?depth=0`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(Array.isArray(data.messages) ? data.messages : [])
        setConversationId(id)
      }
    } catch { /* ignore */ }
  }, [])

  const restoreActiveConversation = useCallback(async () => {
    const stored = conversationId
    if (stored) {
      await loadConversation(stored)
    }
  }, [conversationId, loadConversation])

  const newConversation = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setConversationId(null)
    setIsLoading(false)
  }, [])

  const saveConversation = useCallback(
    async (msgs: Message[], existingId: string | null): Promise<string | null> => {
      const title = msgs.find((m) => m.role === 'user')?.content.slice(0, 120) || 'New chat'
      try {
        if (existingId) {
          await fetch(`/api/ai-conversations/${existingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, messages: msgs }),
          })
          return existingId
        } else {
          const res = await fetch('/api/ai-conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, messages: msgs }),
          })
          if (res.ok) {
            const data = await res.json()
            return data.doc?.id ?? null
          }
        }
      } catch { /* ignore */ }
      return existingId
    },
    [],
  )

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/ai-conversations/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      } catch { /* ignore */ }
      if (conversationId === id) {
        setMessages([])
        setConversationId(null)
      }
      setConversations((prev) => prev.filter((c) => c.id !== id))
    },
    [conversationId],
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
      const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }

      const newMessages = [...messages, userMsg]
      setMessages([...newMessages, assistantMsg])
      setIsLoading(true)

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!res.ok) {
          const errText = await res.text()
          const final = [...newMessages, { ...assistantMsg, content: `Error: ${errText || res.statusText}` }]
          setMessages(final)
          setIsLoading(false)
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          const final = [...newMessages, { ...assistantMsg, content: 'Error: no response stream' }]
          setMessages(final)
          setIsLoading(false)
          return
        }

        const decoder = new TextDecoder()
        let content = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          content += decoder.decode(value, { stream: true })
          setMessages([...newMessages, { ...assistantMsg, content }])
        }

        const final = [...newMessages, { ...assistantMsg, content }]
        setMessages(final)
        const newId = await saveConversation(final, conversationId)
        if (newId) setConversationId(newId)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          const final = [...newMessages, { ...assistantMsg, content: `Error: ${(err as Error).message}` }]
          setMessages(final)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages, conversationId, saveConversation],
  )

  return {
    messages,
    conversationId,
    conversations,
    isLoading,
    isLoadingList,
    sendMessage,
    newConversation,
    fetchConversations,
    loadConversation,
    deleteConversation,
    restoreActiveConversation,
  }
}

// ---------------------------------------------------------------------------
// Inline markdown renderer (links, bold, code, lists)
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''

    if (line.startsWith('### ')) {
      nodes.push(
        <strong key={i} style={{ display: 'block', margin: '8px 0 4px', fontSize: 13 }}>
          {renderInline(line.slice(4))}
        </strong>,
      )
    } else if (line.startsWith('## ')) {
      nodes.push(
        <strong key={i} style={{ display: 'block', margin: '10px 0 4px', fontSize: 14 }}>
          {renderInline(line.slice(3))}
        </strong>,
      )
    } else if (/^[-*] /.test(line)) {
      nodes.push(
        <div key={i} style={{ paddingLeft: 12, margin: '2px 0' }}>
          {'• '}
          {renderInline(line.replace(/^[-*] /, ''))}
        </div>,
      )
    } else if (/^\d+\. /.test(line)) {
      const match = line.match(/^(\d+)\. (.*)/)
      if (match) {
        nodes.push(
          <div key={i} style={{ paddingLeft: 12, margin: '2px 0' }}>
            {match[1]}. {renderInline(match[2] ?? '')}
          </div>,
        )
      }
    } else if (line.trim() === '') {
      nodes.push(<div key={i} style={{ height: 6 }} />)
    } else {
      nodes.push(
        <div key={i} style={{ margin: '2px 0' }}>
          {renderInline(line)}
        </div>,
      )
    }
  }

  return nodes
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1] && match[2]) {
      const href = match[2]
      const isInternal = href.startsWith('/admin')
      parts.push(
        <a
          key={`${match.index}-link`}
          href={href}
          style={{
            color: 'var(--theme-success-500, #B5975A)',
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
          {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {match[1]}
        </a>,
      )
    } else if (match[3]) {
      parts.push(<strong key={`${match.index}-bold`}>{match[3]}</strong>)
    } else if (match[4]) {
      parts.push(
        <code
          key={`${match.index}-code`}
          style={{
            background: 'var(--theme-elevation-100, #f0efed)',
            padding: '1px 5px',
            borderRadius: 3,
            fontSize: '0.9em',
          }}
        >
          {match[4]}
        </code>,
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

function AIChatWidget() {
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem(OPEN_KEY) === '1' } catch { return false }
  })
  const [view, setView] = useState<'chat' | 'list'>('chat')
  const {
    messages,
    conversationId,
    conversations,
    isLoading,
    isLoadingList,
    sendMessage,
    newConversation,
    fetchConversations,
    loadConversation,
    deleteConversation,
    restoreActiveConversation,
  } = useAIChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const restoredRef = useRef(false)

  useEffect(() => {
    try { sessionStorage.setItem(OPEN_KEY, open ? '1' : '0') } catch { /* ignore */ }
  }, [open])

  useEffect(() => {
    if (open && !restoredRef.current) {
      restoredRef.current = true
      restoreActiveConversation()
    }
  }, [open, restoreActiveConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open && view === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, view])

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        if (view === 'list') setView('chat')
        else setOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, view])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestion = (text: string) => {
    setInput('')
    sendMessage(text)
  }

  const openHistory = () => {
    fetchConversations()
    setView('list')
  }

  const selectConversation = (id: string) => {
    loadConversation(id)
    setView('chat')
  }

  const handleNewChat = () => {
    newConversation()
    setView('chat')
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  // -- Collapsed FAB --------------------------------------------------------

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={S.fab}
        aria-label="Open AI assistant"
        title="AI Assistant"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z" />
          <path d="M9 22h6" />
          <path d="M10 2v1" />
          <path d="M14 2v1" />
        </svg>
      </button>
    )
  }

  // -- Conversation List View -----------------------------------------------

  if (view === 'list') {
    return (
      <div style={S.panel}>
        <div style={S.header}>
          <div style={S.headerTitle}>
            <button type="button" onClick={() => setView('chat')} style={S.headerBtn} title="Back to chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Conversations</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} style={S.headerBtn} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={S.listBody}>
          <button type="button" onClick={handleNewChat} style={S.newChatBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            New chat
          </button>

          {isLoadingList && (
            <div style={S.listEmpty}>Loading...</div>
          )}

          {!isLoadingList && conversations.length === 0 && (
            <div style={S.listEmpty}>No past conversations yet.</div>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              role="button"
              tabIndex={0}
              onClick={() => selectConversation(conv.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') selectConversation(conv.id) }}
              style={{
                ...S.convItem,
                ...(conv.id === conversationId ? S.convItemActive : {}),
              }}
            >
              <div style={S.convTitle}>{conv.title}</div>
              <div style={S.convMeta}>
                <span>{timeAgo(conv.updatedAt)}</span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, conv.id)}
                  style={S.convDeleteBtn}
                  title="Delete conversation"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // -- Chat View ------------------------------------------------------------

  return (
    <div style={S.panel}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z" />
            <path d="M9 22h6" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 13 }}>AI Assistant</span>
          <span style={S.betaBadge}>Beta</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" onClick={openHistory} style={S.headerBtn} title="Conversation history">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          <button type="button" onClick={handleNewChat} style={S.headerBtn} title="New chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
          <button type="button" onClick={() => setOpen(false)} style={S.headerBtn} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={S.messages}>
        {messages.length === 0 && (
          <div style={S.empty}>
            <p style={S.emptyTitle}>How can I help?</p>
            <p style={S.emptySubtitle}>
              Ask me anything about managing your content, or ask me to create and edit content for you.
            </p>
            <div style={S.betaNotice}>
              <strong>Beta</strong> — AI assistant with $50/mo usage included in your plan.
              Responses may be imperfect. Always review AI-created content before publishing.
            </div>
            <div style={S.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => handleSuggestion(s)} style={S.suggestion}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={msg.role === 'user' ? S.userBubble : S.assistantBubble}>
            {msg.role === 'assistant' ? (
              <div style={S.assistantContent}>
                {msg.content
                  ? renderMarkdown(msg.content)
                  : (
                      <span style={S.typingDots}>
                        <span style={S.dot} />
                        <span style={{ ...S.dot, animationDelay: '0.15s' }} />
                        <span style={{ ...S.dot, animationDelay: '0.3s' }} />
                      </span>
                    )}
              </div>
            ) : (
              <span>{msg.content}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={S.inputArea}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={1}
          style={S.textarea}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{ ...S.sendBtn, opacity: !input.trim() || isLoading ? 0.4 : 1 }}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Provider (registered in admin.components.providers)
// ---------------------------------------------------------------------------

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const cfgRes = await fetch('/api/globals/site-config?depth=0', {
          credentials: 'include',
        })
        if (!cfgRes.ok) return
        const cfg = await cfgRes.json()
        if (!cfg?.admin?.aiAssistantEnabled) return

        const headRes = await fetch('/api/ai/chat', {
          method: 'HEAD',
          credentials: 'include',
        })
        if (headRes.status === 403) return

        setEnabled(true)
      } catch { /* disabled */ }
    })()
  }, [])

  return (
    <>
      {children}
      {enabled && <AIChatWidget />}
    </>
  )
}

// ---------------------------------------------------------------------------
// Styles — light theme compatible
// ---------------------------------------------------------------------------

const S: Record<string, React.CSSProperties> = {
  fab: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 99999,
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1px solid var(--theme-elevation-200, #e0e0e0)',
    background: 'var(--theme-elevation-50, #fafaf9)',
    color: 'var(--theme-text, #1a1a1a)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  panel: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 99999,
    width: 380,
    maxWidth: 'calc(100vw - 40px)',
    height: 520,
    maxHeight: 'calc(100vh - 40px)',
    borderRadius: 12,
    border: '1px solid var(--theme-elevation-150, #e0e0e0)',
    background: 'var(--theme-elevation-0, #ffffff)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderBottom: '1px solid var(--theme-elevation-100, #eee)',
    background: 'var(--theme-elevation-50, #fafaf9)',
    flexShrink: 0,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--theme-text, #1a1a1a)',
  },
  headerBtn: {
    padding: 6,
    border: 'none',
    background: 'transparent',
    color: 'var(--theme-elevation-500, #666)',
    cursor: 'pointer',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  betaBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: '#8a6e2f',
    background: '#f8f1e0',
    borderRadius: 4,
    border: '1px solid #e8d9b4',
    lineHeight: '16px',
    textTransform: 'uppercase' as const,
  },

  // -- Chat view --
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px 14px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    gap: 6,
    padding: '0 12px',
  },
  emptyTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--theme-text, #1a1a1a)',
  },
  emptySubtitle: {
    margin: 0,
    fontSize: 12,
    color: 'var(--theme-elevation-500, #666)',
  },
  betaNotice: {
    margin: '10px 0 4px',
    padding: '8px 12px',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#7a6530',
    background: '#fdf8ee',
    border: '1px solid #ecdcb0',
    borderRadius: 8,
    textAlign: 'left' as const,
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 12,
    width: '100%',
  },
  suggestion: {
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--theme-text, #1a1a1a)',
    background: 'var(--theme-elevation-50, #fafaf9)',
    border: '1px solid var(--theme-elevation-150, #e0e0e0)',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.1s',
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    padding: '8px 12px',
    borderRadius: '12px 12px 4px 12px',
    background: 'var(--theme-elevation-100, #f0efed)',
    color: 'var(--theme-text, #1a1a1a)',
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: 'break-word' as const,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
    padding: '8px 12px',
    borderRadius: '12px 12px 12px 4px',
    background: 'var(--theme-elevation-50, #fafaf9)',
    border: '1px solid var(--theme-elevation-100, #eee)',
    color: 'var(--theme-text, #1a1a1a)',
    fontSize: 13,
    lineHeight: 1.55,
    wordBreak: 'break-word' as const,
  },
  assistantContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  typingDots: {
    display: 'inline-flex',
    gap: 4,
    padding: '4px 0',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--theme-elevation-300, #ccc)',
    animation: 'ai-dot-pulse 1s ease-in-out infinite',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    padding: '10px 14px',
    borderTop: '1px solid var(--theme-elevation-100, #eee)',
    background: 'var(--theme-elevation-50, #fafaf9)',
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    padding: '8px 12px',
    fontSize: 13,
    lineHeight: 1.4,
    color: 'var(--theme-text, #1a1a1a)',
    background: 'var(--theme-elevation-0, #ffffff)',
    border: '1px solid var(--theme-elevation-200, #ddd)',
    borderRadius: 8,
    resize: 'none' as const,
    outline: 'none',
    fontFamily: 'inherit',
    maxHeight: 100,
  },
  sendBtn: {
    width: 34,
    height: 34,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: 8,
    background: 'var(--theme-elevation-150, #e6e5e3)',
    color: 'var(--theme-text, #1a1a1a)',
    cursor: 'pointer',
    transition: 'opacity 0.1s',
  },

  // -- List view --
  listBody: {
    flex: 1,
    overflowY: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  listEmpty: {
    padding: '24px 12px',
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--theme-elevation-500, #666)',
  },
  newChatBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--theme-text, #1a1a1a)',
    background: 'var(--theme-elevation-100, #f0efed)',
    border: '1px solid var(--theme-elevation-150, #e0e0e0)',
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: 6,
  },
  convItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '8px 12px',
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    background: 'transparent',
    textAlign: 'left',
    color: 'var(--theme-text, #1a1a1a)',
    transition: 'background 0.1s',
  },
  convItemActive: {
    background: 'var(--theme-elevation-50, #fafaf9)',
    border: '1px solid var(--theme-elevation-150, #e0e0e0)',
  },
  convTitle: {
    fontSize: 13,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  convMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--theme-elevation-500, #666)',
  },
  convDeleteBtn: {
    padding: 4,
    border: 'none',
    background: 'transparent',
    color: 'var(--theme-elevation-500, #666)',
    cursor: 'pointer',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    opacity: 0.5,
    transition: 'opacity 0.1s',
  },
}

if (typeof document !== 'undefined' && !document.getElementById('ai-chat-keyframes')) {
  const style = document.createElement('style')
  style.id = 'ai-chat-keyframes'
  style.textContent = `
    @keyframes ai-dot-pulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); }
    }
  `
  document.head.appendChild(style)
}
