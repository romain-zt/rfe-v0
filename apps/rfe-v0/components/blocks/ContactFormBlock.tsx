'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

type ContactDeliveryResponse =
  | { delivery: 'smtp'; message: string }
  | { delivery: 'mailto'; mailtoUrl: string }

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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const toEmail = recipientEmail || content?.contactInfo?.email || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          recipientEmail: recipientEmail || undefined,
        }),
      })

      const result = (await response.json().catch(() => null)) as ContactDeliveryResponse | { error: string } | null

      if (!response.ok || !result) {
        throw new Error(result && 'error' in result ? result.error : 'Unable to send the message.')
      }

      if ('error' in result) {
        throw new Error(result.error)
      }

      if (result.delivery === 'mailto') {
        window.location.href = result.mailtoUrl
        setStatus('idle')
        return
      }

      setStatus('success')
      setFeedback('Message sent successfully. We will get back to you shortly.')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to send the message.')
      if (toEmail) {
        const subject = encodeURIComponent(`Contact from ${name}`)
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`
      }
    }
  }

  return (
    <div
      data-ai-element="contact-form"
      className="rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm lg:p-8"
    >
      {title && <h2 data-ai-field="contactForm.title" className="text-2xl font-light tracking-wide lg:text-3xl">{title}</h2>}
      {subtitle && <p data-ai-field="contactForm.subtitle" className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-ai-element="form">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-2 block text-sm tracking-wide text-foreground/85">{nameLabel}</label>
            <input
              type="text"
              id="cf-name"
              data-ai-field="contactForm.name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'submitting'}
              className="w-full rounded-xl border border-border/80 bg-background/40 px-4 py-3 text-sm outline-none transition-[border-color,box-shadow,background-color] focus:border-foreground focus:bg-background/70 focus:shadow-[0_0_0_3px_rgba(245,240,235,0.08)] disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-2 block text-sm tracking-wide text-foreground/85">{emailLabel}</label>
            <input
              type="email"
              id="cf-email"
              data-ai-field="contactForm.email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'submitting'}
              className="w-full rounded-xl border border-border/80 bg-background/40 px-4 py-3 text-sm outline-none transition-[border-color,box-shadow,background-color] focus:border-foreground focus:bg-background/70 focus:shadow-[0_0_0_3px_rgba(245,240,235,0.08)] disabled:opacity-60"
            />
          </div>
        </div>
        <div>
          <label htmlFor="cf-message" className="mb-2 block text-sm tracking-wide text-foreground/85">{messageLabel}</label>
          <textarea
            id="cf-message"
            data-ai-field="contactForm.message"
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={status === 'submitting'}
            className="w-full resize-none rounded-xl border border-border/80 bg-background/40 px-4 py-3 text-sm outline-none transition-[border-color,box-shadow,background-color] focus:border-foreground focus:bg-background/70 focus:shadow-[0_0_0_3px_rgba(245,240,235,0.08)] disabled:opacity-60"
          />
        </div>

        {feedback && (
          <p className={status === 'error' ? 'text-sm text-red-300' : 'text-sm text-emerald-300'}>
            {feedback}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            If SMTP is configured and complete, this form sends directly. Otherwise it falls back to your email app.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting'}
            data-ai-element="submit-button"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-foreground px-8 py-3 text-sm uppercase tracking-[0.18em] transition-colors duration-500 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
