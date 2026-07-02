'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useField, useForm, useFormFields } from '@payloadcms/ui'
import {
  EMAIL_PROVIDER_GUIDES,
  EMAIL_PROVIDER_OPTIONS,
  formatSecureConnection,
  getProviderPreset,
  isPresetEmailProvider,
  type EmailProvider,
} from '../../utilities/emailProviderPresets.ts'
import { PasswordVisibilityToggle } from '../PasswordVisibilityToggle/index.tsx'

type EmailFormValues = {
  enabled: boolean
  provider: EmailProvider
  smtpHost: string
  smtpPort: number
  secure: boolean
  recipientEmail: string
  fromName: string
  fromEmail: string
  username: string
  smtpPassword: string
  replyTo: string
}

function readFieldValue(fields: Record<string, { value?: unknown }>, path: string): unknown {
  return fields[path]?.value
}

function readString(fields: Record<string, { value?: unknown }>, path: string, fallback = ''): string {
  const value = readFieldValue(fields, path)
  return typeof value === 'string' ? value : fallback
}

function readBoolean(fields: Record<string, { value?: unknown }>, path: string, fallback = false): boolean {
  const value = readFieldValue(fields, path)
  return typeof value === 'boolean' ? value : fallback
}

function readNumber(fields: Record<string, { value?: unknown }>, path: string, fallback = 0): number {
  const value = readFieldValue(fields, path)
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

const fieldShell: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--theme-text)',
}

const helpStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.75rem',
  lineHeight: 1.5,
  color: 'var(--theme-elevation-500)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 42,
  padding: '10px 12px',
  fontSize: '0.875rem',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m, 6px)',
  background: 'var(--theme-input-bg, var(--theme-elevation-0))',
  color: 'var(--theme-text)',
  outline: 'none',
}

const readOnlyBoxStyle: React.CSSProperties = {
  ...inputStyle,
  background: 'var(--theme-elevation-50)',
  color: 'var(--theme-elevation-800)',
}

function FieldBlock({
  label,
  help,
  children,
}: {
  label: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <div style={fieldShell}>
      <label style={labelStyle}>{label}</label>
      {children}
      {help ? <p style={helpStyle}>{help}</p> : null}
    </div>
  )
}

export const EmailSettingsField: React.FC = () => {
  const { path } = useField()
  const basePath =
    typeof path === 'string' && path.includes('.')
      ? path.slice(0, path.lastIndexOf('.'))
      : typeof path === 'string'
        ? path
        : 'email'
  const { dispatchFields, setModified } = useForm()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const values = useFormFields(([fields]) => {
    const fieldMap = fields as Record<string, { value?: unknown }>
    const provider = readString(fieldMap, `${basePath}.provider`, 'none') as EmailProvider

    return {
      enabled: readBoolean(fieldMap, `${basePath}.enabled`, false),
      provider,
      smtpHost: readString(fieldMap, `${basePath}.smtpHost`, 'smtp.gmail.com'),
      smtpPort: readNumber(fieldMap, `${basePath}.smtpPort`, 465),
      secure: readBoolean(fieldMap, `${basePath}.secure`, true),
      recipientEmail: readString(fieldMap, `${basePath}.recipientEmail`),
      fromName: readString(fieldMap, `${basePath}.fromName`, 'RFE'),
      fromEmail: readString(fieldMap, `${basePath}.fromEmail`),
      username: readString(fieldMap, `${basePath}.username`),
      smtpPassword: readString(fieldMap, `${basePath}.smtpPassword`),
      replyTo: readString(fieldMap, `${basePath}.replyTo`),
    } satisfies EmailFormValues
  })

  const updateField = useCallback(
    (name: keyof EmailFormValues, value: string | number | boolean) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${basePath}.${name}`,
        value,
      })
      setModified(true)
    },
    [basePath, dispatchFields, setModified],
  )

  const applyProviderPreset = useCallback(
    (provider: EmailProvider) => {
      if (provider === 'none') {
        updateField('enabled', false)
        return
      }

      if (isPresetEmailProvider(provider)) {
        const preset = getProviderPreset(provider)
        if (!preset) return
        updateField('smtpHost', preset.smtpHost)
        updateField('smtpPort', preset.smtpPort)
        updateField('secure', preset.secure)
      }
    },
    [updateField],
  )

  useEffect(() => {
    if (values.provider === 'none') return
    if (values.provider === 'custom') return

    const preset = getProviderPreset(values.provider)
    if (!preset) return

    const needsSync =
      values.smtpHost !== preset.smtpHost ||
      values.smtpPort !== preset.smtpPort ||
      values.secure !== preset.secure

    if (needsSync) {
      applyProviderPreset(values.provider)
    }
  }, [applyProviderPreset, values.provider, values.secure, values.smtpHost, values.smtpPort])

  const guide = values.provider !== 'none' ? EMAIL_PROVIDER_GUIDES[values.provider] : null
  const showSmtpFields = values.provider !== 'none'
  const isCustom = values.provider === 'custom'

  const secureLabel = useMemo(
    () => formatSecureConnection(values.secure, values.smtpPort),
    [values.secure, values.smtpPort],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 920 }}>
      <p style={{ ...helpStyle, fontSize: '0.8125rem', color: 'var(--theme-elevation-600)' }}>
        Configure where contact form messages are delivered. Pick your email provider, fill in a few
        fields — no technical knowledge required. If settings are incomplete, the contact page falls
        back to opening the visitor&apos;s email app.
      </p>

      <FieldBlock
        label="Email provider"
        help="Choose the service that hosts your mailbox. Leave on “Mailto only” to keep the simple “open email app” behavior on the contact form."
      >
        <select
          value={values.provider}
          onChange={(event) => {
            const nextProvider = event.target.value as EmailProvider
            updateField('provider', nextProvider)
            applyProviderPreset(nextProvider)
          }}
          style={inputStyle}
        >
          {EMAIL_PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldBlock>

      {showSmtpFields && guide ? (
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-m, 6px)',
            background: 'var(--theme-elevation-50)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div>
            <p style={{ ...labelStyle, marginBottom: 10 }}>{guide.title}</p>
            <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {guide.steps.map((step) => (
                <li key={step} style={{ ...helpStyle, color: 'var(--theme-elevation-700)' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isCustom ? '1fr 120px 160px' : '1.4fr 0.6fr 0.8fr',
              gap: 12,
            }}
          >
            <FieldBlock label={isCustom ? 'SMTP server' : 'Server (automatic)'}>
              {isCustom ? (
                <input
                  type="text"
                  value={values.smtpHost}
                  onChange={(event) => updateField('smtpHost', event.target.value)}
                  style={inputStyle}
                />
              ) : (
                <div style={readOnlyBoxStyle}>{values.smtpHost}</div>
              )}
            </FieldBlock>

            <FieldBlock label="Port">
              {isCustom ? (
                <input
                  type="number"
                  value={values.smtpPort}
                  onChange={(event) => updateField('smtpPort', Number(event.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <div style={readOnlyBoxStyle}>{values.smtpPort}</div>
              )}
            </FieldBlock>

            <FieldBlock label="Secure connection">
              {isCustom ? (
                <label
                  style={{
                    ...readOnlyBoxStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minHeight: 42,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={values.secure}
                    onChange={(event) => updateField('secure', event.target.checked)}
                  />
                  <span style={{ fontSize: '0.8125rem' }}>Implicit TLS (port 465)</span>
                </label>
              ) : (
                <div style={readOnlyBoxStyle}>{secureLabel}</div>
              )}
            </FieldBlock>
          </div>
        </div>
      ) : null}

      {showSmtpFields ? (
        <>
          <FieldBlock
            label="Inbox for contact messages"
            help="Contact form submissions will be delivered to this address."
          >
            <input
              type="email"
              value={values.recipientEmail}
              onChange={(event) => updateField('recipientEmail', event.target.value)}
              placeholder="contact@yourdomain.com"
              style={inputStyle}
            />
          </FieldBlock>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FieldBlock
              label="Display name"
              help="Name shown to recipients when the site sends an email."
            >
              <input
                type="text"
                value={values.fromName}
                onChange={(event) => updateField('fromName', event.target.value)}
                style={inputStyle}
              />
            </FieldBlock>

            <FieldBlock
              label="Sender address"
              help="Must be an address your provider allows for SMTP sending."
            >
              <input
                type="email"
                value={values.fromEmail}
                onChange={(event) => updateField('fromEmail', event.target.value)}
                placeholder="no-reply@yourdomain.com"
                style={inputStyle}
              />
            </FieldBlock>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FieldBlock label={guide?.usernameLabel ?? 'SMTP username'} help={guide?.usernameHelp}>
              <input
                type="text"
                value={values.username}
                onChange={(event) => updateField('username', event.target.value)}
                autoComplete="off"
                style={inputStyle}
              />
            </FieldBlock>

            <FieldBlock label={guide?.passwordLabel ?? 'SMTP password'} help={guide?.passwordHelp}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8 }}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={values.smtpPassword}
                  onChange={(event) => updateField('smtpPassword', event.target.value)}
                  autoComplete="new-password"
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono, monospace)' }}
                />
                <PasswordVisibilityToggle
                  visible={passwordVisible}
                  onToggle={() => setPasswordVisible((current) => !current)}
                />
              </div>
            </FieldBlock>
          </div>

          <FieldBlock
            label="Reply-to (optional)"
            help="If empty, replies go to the visitor's email when they filled in an email field."
          >
            <input
              type="email"
              value={values.replyTo}
              onChange={(event) => updateField('replyTo', event.target.value)}
              placeholder="Optional reply-to address"
              style={inputStyle}
            />
          </FieldBlock>
        </>
      ) : null}
    </div>
  )
}
