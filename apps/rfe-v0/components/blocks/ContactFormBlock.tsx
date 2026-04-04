'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

type Props = {
  title?: string
  subtitle?: string
  recipientEmail?: string
  nameLabel?: string
  emailLabel?: string
  messageLabel?: string
  submitLabel?: string
}

export function ContactFormComponent({ title, subtitle, recipientEmail, nameLabel = 'Name', emailLabel = 'Email', messageLabel = 'Message', submitLabel = 'Send' }: Props) {
  const { content } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const toEmail = recipientEmail || content?.contactInfo?.email || ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`
  }

  return (
    <div>
      {title && <h2 className="text-2xl lg:text-3xl font-light tracking-wide mb-2">{title}</h2>}
      {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cf-name" className="block text-sm tracking-wide mb-2">{nameLabel}</label>
          <input type="text" id="cf-name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm" />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm tracking-wide mb-2">{emailLabel}</label>
          <input type="email" id="cf-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm" />
        </div>
        <div>
          <label htmlFor="cf-message" className="block text-sm tracking-wide mb-2">{messageLabel}</label>
          <textarea id="cf-message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm resize-none" />
        </div>
        <button type="submit" className="w-full text-sm tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-500">
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
