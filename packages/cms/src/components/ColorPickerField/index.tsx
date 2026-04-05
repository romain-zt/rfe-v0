'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const VALID_HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export const ColorPickerField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const hex = typeof value === 'string' ? value : ''
  const safeHex = VALID_HEX.test(hex) ? hex : '#000000'
  const label = typeof field?.label === 'string' ? field.label : field?.name ?? ''

  return (
    <div style={{ marginBottom: 0 }}>
      <label
        htmlFor={`field-${path}`}
        style={{ display: 'block', marginBottom: 6, fontSize: '0.8125rem', fontWeight: 500 }}
      >
        {label}
        {field?.required && <span style={{ color: 'var(--theme-error-500)' }}> *</span>}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <input
          id={`field-${path}`}
          type="text"
          value={hex}
          onChange={(e) => setValue(e.target.value)}
          readOnly={readOnly}
          placeholder="#000000"
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
        <input
          type="color"
          value={safeHex}
          onChange={(e) => setValue(e.target.value)}
          disabled={readOnly}
          aria-label={`${label} color picker`}
          style={{
            width: 38,
            height: 'auto',
            padding: 3,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            cursor: readOnly ? 'default' : 'pointer',
            background: 'transparent',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
