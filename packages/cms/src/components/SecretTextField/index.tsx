'use client'

import React, { useState } from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import { PasswordVisibilityToggle } from '../PasswordVisibilityToggle/index.tsx'

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
    <div style={{ marginBottom: 20, width: '100%' }}>
      <div style={{ marginBottom: 6 }}>
        {Label ?? <FieldLabel path={path} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8, alignItems: 'stretch', width: '100%' }}>
        <input
          id={`field-${path}`}
          type={visible ? 'text' : 'password'}
          value={text}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Leave empty to use environment variable"
          autoComplete="off"
          style={{
            width: '100%',
            minWidth: 0,
            minHeight: 40,
            padding: '10px 12px',
            fontSize: '0.8125rem',
            fontFamily: 'var(--font-mono, monospace)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            background: 'var(--theme-input-bg, var(--theme-elevation-0))',
            color: 'var(--theme-text)',
            outline: 'none',
          }}
        />
        <PasswordVisibilityToggle
          visible={visible}
          onToggle={() => setVisible((current) => !current)}
        />
      </div>
    </div>
  )
}
