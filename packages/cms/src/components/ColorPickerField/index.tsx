'use client'

import React from 'react'
import { FieldLabel, TextInput, useField } from '@payloadcms/ui'

const VALID_HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export const ColorPickerField: React.FC<any> = () => {
  const {
    customComponents: { AfterInput, BeforeInput, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField()

  const hex = typeof value === 'string' ? value : ''
  const safeHex = VALID_HEX.test(hex) ? hex : '#000000'

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 6 }}>
        {Label ?? <FieldLabel path={path} />}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            AfterInput={AfterInput}
            BeforeInput={BeforeInput}
            Error={errorMessage}
            onChange={setValue}
            path={path}
            showError={showError}
            value={value}
            style={{ marginBottom: 0 }}
          />
        </div>
        <input
          type="color"
          value={safeHex}
          onChange={(e) => setValue(e.target.value)}
          aria-label="color picker"
          style={{
            width: 38,
            minHeight: 38,
            padding: 3,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            cursor: 'pointer',
            background: 'transparent',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
