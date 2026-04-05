'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const SecretTextField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const [visible, setVisible] = useState(false)
  const text = typeof value === 'string' ? value : ''
  const label = typeof field?.label === 'string' ? field.label : field?.name ?? ''
  const description =
    field?.admin && 'description' in field.admin && typeof field.admin.description === 'string'
      ? field.admin.description
      : null

  return (
    <div style={{ marginBottom: 0 }}>
      <label
        htmlFor={`field-${path}`}
        style={{ display: 'block', marginBottom: 6, fontSize: '0.8125rem', fontWeight: 500 }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <input
          id={`field-${path}`}
          type={visible ? 'text' : 'password'}
          value={text}
          onChange={(e) => setValue(e.target.value)}
          readOnly={readOnly}
          placeholder="Leave empty to use environment variable"
          autoComplete="off"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px 10px',
            fontSize: '0.8125rem',
            fontFamily: 'var(--font-mono, monospace)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            background: readOnly
              ? 'var(--theme-elevation-50)'
              : 'var(--theme-input-bg, var(--theme-elevation-0))',
            color: 'var(--theme-text)',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-elevation-500)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {description && (
        <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--theme-elevation-500)', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
  )
}
