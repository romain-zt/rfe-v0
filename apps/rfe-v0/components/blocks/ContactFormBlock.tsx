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
    <div data-ai-element="contact-form">
      {title && <h2 data-ai-field="contactForm.title" className="text-2xl lg:text-3xl font-light tracking-wide mb-2">{title}</h2>}
      {subtitle && <p data-ai-field="contactForm.subtitle" className="text-muted-foreground mb-8">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-6" data-ai-element="form">
        <div>
          <label htmlFor="cf-name" className="block text-sm tracking-wide mb-2">{nameLabel}</label>
          <input type="text" id="cf-name" data-ai-field="contactForm.name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm" />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm tracking-wide mb-2">{emailLabel}</label>
          <input type="email" id="cf-email" data-ai-field="contactForm.email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm" />
        </div>
        <div>
          <label htmlFor="cf-message" className="block text-sm tracking-wide mb-2">{messageLabel}</label>
          <textarea id="cf-message" data-ai-field="contactForm.message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm resize-none" />
        </div>
        <button type="submit" data-ai-element="submit-button" className="w-full text-sm tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-500">
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
