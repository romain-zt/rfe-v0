'use client'

import React, { useState } from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'

export const SecretTextField: React.FC<any> = () => {
  const {
    customComponents: { Label } = {},
    path,
    setValue,
    value,
  } = useField()

  const [visible, setVisible] = useState(false)
  const text = typeof value === 'string' ? value : ''

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 6 }}>
        {Label ?? <FieldLabel path={path} />}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <input
          id={`field-${path}`}
          type={visible ? 'text' : 'password'}
          value={text}
          onChange={(e) => setValue(e.target.value)}
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
            background: 'var(--theme-input-bg, var(--theme-elevation-0))',
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
    </div>
  )
}
