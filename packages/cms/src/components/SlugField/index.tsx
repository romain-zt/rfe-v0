'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FieldLabel, TextInput, useField, useFormFields, useDocumentInfo } from '@payloadcms/ui'
import { toSlug } from '../../utilities/toSlug.ts'

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

  const [autoGenerate, setAutoGenerate] = useState(isNew)

  useEffect(() => {
    if (autoGenerate && title) {
      setValue(toSlug(title))
    }
  }, [title, autoGenerate, setValue])

  const handleToggleAutoGenerate = useCallback(() => {
    setAutoGenerate((prev) => {
      const next = !prev
      if (next && title) {
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
            onChange={setValue}
            path={path}
            readOnly={autoGenerate}
            showError={showError}
            value={typeof value === 'string' ? value : ''}
            style={{ marginBottom: 0 }}
          />
        </div>
        <button
          type="button"
          onClick={handleToggleAutoGenerate}
          title={autoGenerate ? 'Edit slug manually' : 'Auto-generate from title'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            minHeight: 38,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s, 4px)',
            background: autoGenerate ? 'var(--theme-elevation-100)' : 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
            color: 'var(--theme-text)',
            fontSize: 16,
          }}
        >
          {autoGenerate ? '⟳' : '✎'}
        </button>
      </div>
      {autoGenerate && (
        <p style={{ marginTop: 4, fontSize: 11, color: 'var(--theme-elevation-500)' }}>
          Auto-generating from title — click ✎ to edit manually
        </p>
      )}
    </div>
  )
}
