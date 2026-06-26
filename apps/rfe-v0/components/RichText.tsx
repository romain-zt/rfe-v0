'use client'

import React from 'react'

type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
  style?: string
}

type LexicalElementNode = {
  type: string
  tag?: string
  listType?: string
  url?: string
  children?: LexicalAnyNode[]
  direction?: string
  indent?: number
  format?: string | number
  version?: number
}

type LexicalAnyNode = LexicalTextNode | LexicalElementNode

type LexicalRoot = {
  root: LexicalElementNode
}

function renderNode(node: LexicalAnyNode, key: number | string): React.ReactNode {
  if (node.type === 'text') {
    const t = node as LexicalTextNode
    if (!t.text) return null
    const format = typeof t.format === 'number' ? t.format : 0
    let el: React.ReactNode = t.text
    // Lexical format bitmask: bold=1, italic=2, strikethrough=4, underline=8, code=16
    if (format & 16) el = <code key={key} className="font-mono text-xs bg-foreground/10 px-1 rounded">{el}</code>
    if (format & 1) el = <strong key={key} className="font-semibold text-foreground/90">{el}</strong>
    if (format & 2) el = <em key={key}>{el}</em>
    if (format & 8) el = <u key={key}>{el}</u>
    if (format & 4) el = <s key={key}>{el}</s>
    return el
  }

  const el = node as LexicalElementNode
  const children = el.children?.map((c, i) => renderNode(c, i)) ?? null

  switch (el.type) {
    case 'root':
      return <>{children}</>

    case 'paragraph':
      return (
        <p key={key} className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed mb-4 last:mb-0">
          {children}
        </p>
      )

    case 'heading': {
      const tag = el.tag || 'h3'
      const headingClasses = 'font-serif font-light tracking-wide mb-3 mt-6 first:mt-0'
      if (tag === 'h1') return <h1 key={key} className={`text-xl sm:text-2xl ${headingClasses}`}>{children}</h1>
      if (tag === 'h2') return <h2 key={key} className={`text-lg sm:text-xl ${headingClasses}`}>{children}</h2>
      if (tag === 'h4') return <h4 key={key} className={`text-sm sm:text-base ${headingClasses}`}>{children}</h4>
      return <h3 key={key} className={`text-base sm:text-lg ${headingClasses}`}>{children}</h3>
    }

    case 'list': {
      const ordered = el.listType === 'number'
      const listClass = `text-sm sm:text-base text-muted-foreground/80 space-y-1 mb-4 pl-5 ${ordered ? 'list-decimal' : 'list-disc'}`
      return ordered
        ? <ol key={key} className={listClass}>{children}</ol>
        : <ul key={key} className={listClass}>{children}</ul>
    }

    case 'listitem':
      return <li key={key}>{children}</li>

    case 'link': {
      const href = (el as LexicalElementNode & { url?: string }).url ?? '#'
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground/70 transition-colors"
        >
          {children}
        </a>
      )
    }

    case 'linebreak':
      return <br key={key} />

    case 'quote':
      return (
        <blockquote key={key} className="border-l-2 border-foreground/20 pl-4 italic text-muted-foreground/70 mb-4">
          {children}
        </blockquote>
      )

    default:
      return children ? <span key={key}>{children}</span> : null
  }
}

type RichTextProps = {
  content: unknown
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content || typeof content !== 'object') return null

  const doc = content as LexicalRoot | LexicalElementNode
  const root = ('root' in doc) ? (doc as LexicalRoot).root : (doc as LexicalElementNode)
  if (!root?.children?.length) return null

  return (
    <div className={className}>
      {root.children.map((child, i) => renderNode(child, i))}
    </div>
  )
}
