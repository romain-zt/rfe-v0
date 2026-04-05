'use client'

import React, { useMemo, useState } from 'react'

type FormFieldRow = {
  blockType?: string
  name?: string
  label?: string | null
  required?: boolean | null
}

type FormDoc = {
  id?: number
  title?: string | null
  submitButtonLabel?: string | null
  confirmationType?: 'message' | 'redirect' | null
  fields?: FormFieldRow[] | null
}

type Props = {
  title?: string
  subtitle?: string
  form?: number | FormDoc | null
}

export function EmbeddedFormBlock({ title, subtitle, form }: Props) {
  const resolved = useMemo(() => {
    if (form == null) return null
    if (typeof form === 'number') return null
    return form
  }, [form])

  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!resolved?.id || !resolved.fields?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Form is not available. Run the seed script or check the form relationship in the admin.
      </div>
    )
  }

  const formId = resolved.id
  const buttonLabel = resolved.submitButtonLabel?.trim() || 'Send'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const submissionData = resolved.fields!
      .filter((f) => f.name && ['text', 'email', 'textarea', 'checkbox', 'number'].includes(f.blockType || ''))
      .map((f) => ({
        field: f.name!,
        value: f.blockType === 'checkbox' ? (values[f.name!] ? 'true' : 'false') : (values[f.name!] ?? ''),
      }))

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ form: formId, submissionData }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { errors?: { message?: string }[]; message?: string }
        const msg =
          data.message ||
          data.errors?.map((x) => x.message).filter(Boolean).join(', ') ||
          `Request failed (${res.status})`
        throw new Error(msg)
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div>
        {title && <h2 className="text-2xl lg:text-3xl font-light tracking-wide mb-2">{title}</h2>}
        <p className="text-muted-foreground">Thank you for reaching out. We will get back to you shortly.</p>
      </div>
    )
  }

  return (
    <div>
      {title && <h2 className="text-2xl lg:text-3xl font-light tracking-wide mb-2">{title}</h2>}
      {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {resolved.fields.map((field, i) => {
          if (!field.name || !field.blockType) return null
          const id = `emb-form-${formId}-${field.name}-${i}`
          const label = field.label || field.name

          if (field.blockType === 'message') {
            return null
          }

          if (field.blockType === 'textarea') {
            return (
              <div key={id}>
                <label htmlFor={id} className="block text-sm tracking-wide mb-2">
                  {label}
                </label>
                <textarea
                  id={id}
                  rows={6}
                  required={!!field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name!]: e.target.value }))}
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm resize-none"
                />
              </div>
            )
          }

          if (field.blockType === 'checkbox') {
            return (
              <div key={id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={id}
                  checked={values[field.name] === 'true'}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name!]: e.target.checked ? 'true' : '' }))}
                  className="h-4 w-4"
                />
                <label htmlFor={id} className="text-sm tracking-wide">
                  {label}
                </label>
              </div>
            )
          }

          const inputType =
            field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'

          return (
            <div key={id}>
              <label htmlFor={id} className="block text-sm tracking-wide mb-2">
                {label}
              </label>
              <input
                type={inputType}
                id={id}
                required={!!field.required}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.name!]: e.target.value }))}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm"
              />
            </div>
          )
        })}

        {status === 'error' && <p className="text-sm text-red-400">{errorMessage}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full text-sm tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-500 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending…' : buttonLabel}
        </button>
      </form>
    </div>
  )
}
