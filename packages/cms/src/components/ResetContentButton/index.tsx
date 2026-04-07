'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const SEED_LOGS_KEY = 'rfe-seed-logs'

type State = 'idle' | 'confirm' | 'loading' | 'success' | 'error'
type LogLine = { ts: string; level: string; text: string }

export const ResetContentButton: React.FC = () => {
  const [state, setState] = useState<State>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [logs, setLogs] = useState<LogLine[]>([])
  const [logPanelOpen, setLogPanelOpen] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SEED_LOGS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) setLogs(parsed)
      }
    } catch { /* ignore */ }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const persistLogs = useCallback((next: LogLine[]) => {
    try { sessionStorage.setItem(SEED_LOGS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState('idle')
    setErrorMessage('')
  }, [])

  const handleFirstClick = useCallback(() => {
    setState('confirm')
    timeoutRef.current = setTimeout(() => setState('idle'), 15_000)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState('loading')
    setErrorMessage('')
    setLogs([])
    setLogPanelOpen(true)

    try {
      const res = await fetch('/api/seed/reset', {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok && !res.body) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      const accumulated: LogLine[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const raw of lines) {
          if (!raw.trim()) continue
          try {
            const parsed = JSON.parse(raw) as Record<string, unknown>
            if (parsed.type === 'log') {
              const line: LogLine = {
                ts: String(parsed.ts ?? ''),
                level: String(parsed.level ?? 'log'),
                text: String(parsed.text ?? ''),
              }
              accumulated.push(line)
              setLogs([...accumulated])
            } else if (parsed.type === 'done') {
              if (parsed.success) {
                setState('success')
              } else {
                setErrorMessage(String(parsed.error || 'Unknown error'))
                setState('error')
              }
            }
          } catch { /* skip malformed lines */ }
        }
      }

      persistLogs(accumulated)
      if (state === 'loading') setState('success')
      timeoutRef.current = setTimeout(() => setState('idle'), 12_000)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
      setLogPanelOpen(true)
      timeoutRef.current = setTimeout(() => setState('idle'), 12_000)
    }
  }, [persistLogs])

  const levelColor = (level: string) => {
    if (level === 'error') return '#ef4444'
    if (level === 'warn') return '#eab308'
    return 'var(--theme-elevation-800, #ccc)'
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.divider} />
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.titleRow}>
            <svg
              style={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            <h4 style={styles.title}>Content Reset</h4>
          </div>
          <p style={styles.description}>
            Reset all content to the default seed data. All seeds are idempotent — safe to run
            anytime.
          </p>
        </div>

        {logs.length > 0 && (
          <div style={styles.logSection}>
            <button
              type="button"
              onClick={() => setLogPanelOpen((o) => !o)}
              style={styles.logToggle}
            >
              {logPanelOpen ? '\u25BC' : '\u25B6'} Seed log ({logs.length} lines)
            </button>
            {logPanelOpen && (
              <pre style={styles.logPre}>
                {logs.map((l, i) => (
                  <div key={i} style={{ color: levelColor(l.level) }}>
                    <span style={{ opacity: 0.5 }}>{l.ts}</span>{' '}
                    <span style={{ fontWeight: l.level !== 'log' ? 600 : 400 }}>[{l.level}]</span>{' '}
                    {l.text}
                  </div>
                ))}
                <div ref={logEndRef} />
              </pre>
            )}
          </div>
        )}

        {state === 'idle' && (
          <button type="button" onClick={handleFirstClick} style={styles.button}>
            Reset Content
          </button>
        )}

        {state === 'confirm' && (
          <div style={styles.confirmZone}>
            <p style={styles.warning}>
              This will overwrite all collections and globals with seed data. Any manual edits will
              be lost.
            </p>
            <div style={styles.buttonRow}>
              <button type="button" onClick={handleConfirm} style={styles.dangerButton}>
                Yes, reset everything
              </button>
              <button type="button" onClick={reset} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {state === 'loading' && (
          <div style={styles.feedback}>
            <div style={styles.spinner} />
            <span style={styles.feedbackText}>Seeding in progress…</span>
          </div>
        )}

        {state === 'success' && (
          <div style={{ ...styles.feedback, ...styles.successFeedback }}>
            <span style={styles.feedbackText}>Content reset successfully.</span>
          </div>
        )}

        {state === 'error' && (
          <div style={{ ...styles.feedback, ...styles.errorFeedback }}>
            <span style={styles.feedbackText}>{errorMessage}</span>
            <button type="button" onClick={reset} style={styles.cancelButton}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    paddingTop: 40,
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    background: 'var(--theme-elevation-100, #2a2a3e)',
    marginBottom: 40,
  },
  card: {
    background: 'var(--theme-elevation-50, #1a1a2e)',
    border: '1px solid var(--theme-elevation-100, #2a2a3e)',
    borderRadius: 8,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 18,
    height: 18,
    color: 'var(--theme-text, #fff)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--theme-text, #fff)',
  },
  description: {
    margin: 0,
    fontSize: 13,
    color: 'var(--theme-elevation-400, #999)',
    lineHeight: 1.5,
  },
  logSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  logToggle: {
    alignSelf: 'flex-start',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--theme-text, #fff)',
    background: 'var(--theme-elevation-100, #2a2a3e)',
    border: '1px solid var(--theme-elevation-200, #3a3a4e)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  logPre: {
    margin: 0,
    maxHeight: 360,
    overflow: 'auto',
    padding: 12,
    fontSize: 11,
    lineHeight: 1.55,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    color: 'var(--theme-elevation-800, #ccc)',
    background: 'var(--theme-elevation-0, #0f0f18)',
    border: '1px solid var(--theme-elevation-100, #2a2a3e)',
    borderRadius: 6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  button: {
    alignSelf: 'flex-start',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--theme-text, #fff)',
    background: 'var(--theme-elevation-100, #2a2a3e)',
    border: '1px solid var(--theme-elevation-200, #3a3a4e)',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  confirmZone: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    background: 'rgba(var(--theme-error-500-rgb, 239, 68, 68), 0.05)',
    border: '1px solid rgba(var(--theme-error-500-rgb, 239, 68, 68), 0.2)',
    borderRadius: 6,
  },
  warning: {
    margin: 0,
    fontSize: 13,
    color: 'var(--theme-error-500, #ef4444)',
    lineHeight: 1.5,
  },
  buttonRow: {
    display: 'flex',
    gap: 8,
  },
  dangerButton: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    background: 'var(--theme-error-500, #ef4444)',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--theme-text, #fff)',
    background: 'transparent',
    border: '1px solid var(--theme-elevation-200, #3a3a4e)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  feedback: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 6,
    background: 'var(--theme-elevation-100, #2a2a3e)',
  },
  successFeedback: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  errorFeedback: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  feedbackText: {
    fontSize: 13,
    color: 'var(--theme-text, #fff)',
    flex: 1,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid var(--theme-elevation-200, #3a3a4e)',
    borderTopColor: 'var(--theme-text, #fff)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
}

if (typeof document !== 'undefined' && !document.getElementById('rfe-reset-spin')) {
  const style = document.createElement('style')
  style.id = 'rfe-reset-spin'
  style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
  document.head.appendChild(style)
}
