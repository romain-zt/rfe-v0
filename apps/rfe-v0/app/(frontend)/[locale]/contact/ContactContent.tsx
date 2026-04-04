'use client'

import React from 'react'
import { useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

export default function ContactContent() {
  const { t, content } = useLanguage()
  const { contactInfo } = content
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {t.contactPage.title}
          </h1>
          <p className="text-muted-foreground">{t.contactPage.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm tracking-wide mb-2">
                {t.contactPage.name}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm tracking-wide mb-2">
                {t.contactPage.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm tracking-wide mb-2">
                {t.contactPage.message}
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full text-sm tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-500"
            >
              {t.contactPage.send}
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm tracking-wide uppercase mb-3">
                {t.contactPage.address}
              </h3>
              <p className="text-muted-foreground text-sm">
                {contactInfo.address}
              </p>
            </div>

            <div>
              <h3 className="text-sm tracking-wide uppercase mb-3">
                {t.contactPage.email}
              </h3>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>

            <div>
              <h3 className="text-sm tracking-wide uppercase mb-3">
                {t.contactPage.phone}
              </h3>
              <p className="text-muted-foreground text-sm">
                {contactInfo.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
