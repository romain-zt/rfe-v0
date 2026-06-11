'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FieldLabel, TextInput, useField, useFormFields, useDocumentInfo } from '@payloadcms/ui'

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const SlugField: React.FC = () => {
  const { id } = useDocumentInfo()
  const isNew = !id

  const {
    customComponents: { AfterInput, BeforeInput, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField<string>()

  const title = useFormFields(([fields]) => {
    const f = fields['title']
    return typeof f?.value === 'string' ? f.value : ''
  })

  const [isLocked, setIsLocked] = useState(!isNew)

  useEffect(() => {
    if (!isLocked && title) {
      setValue(toSlug(title))
    }
  }, [title, isLocked, setValue])

  const handleToggleLock = useCallback(() => {
    setIsLocked((prev) => {
      const next = !prev
      if (!next && title) {
        setValue(toSlug(title))
      }
      return next
    })
  }, [title, setValue])

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 6 }}>
        {Label ?? <FieldLabel path={path} />}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            AfterInput={AfterInput}
            BeforeInput={BeforeInput}
            Error={errorMessage}
            onChange={isLocked ? setValue : undefined}
            path={path}
            readOnly={!isLocked}
            showError={showError}
            value={typeof value === 'string' ? value : ''}
            style={{ marginBottom: 0 }}
          />
        </div>
        <button
          type="button"
          onClick={handleToggleLock}
          title={isLocked ? 'Auto-generate from title' : 'Edit manually'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            minHeight: 38,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            background: isLocked ? 'transparent' : 'var(--theme-elevation-100)',
            cursor: 'pointer',
            flexShrink: 0,
            color: 'var(--theme-text)',
            fontSize: 16,
          }}
        >
          {isLocked ? '✎' : '⟳'}
        </button>
      </div>
      {!isLocked && (
        <p style={{ marginTop: 4, fontSize: 11, color: 'var(--theme-elevation-500)' }}>
          Auto-generating from title — click ⟳ to edit manually
        </p>
      )}
    </div>
  )
}
