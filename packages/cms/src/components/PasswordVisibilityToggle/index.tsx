'use client'

import React from 'react'

type Props = {
  visible: boolean
  onToggle: () => void
  size?: number
}

function EyeOpenIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeClosedIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <path d="M3 12h18" />
    </svg>
  )
}

const toggleButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  minWidth: 42,
  minHeight: 42,
  padding: 0,
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m, 6px)',
  background: 'var(--theme-elevation-50)',
  color: 'var(--theme-elevation-600)',
  cursor: 'pointer',
  flexShrink: 0,
}

export function PasswordVisibilityToggle({ visible, onToggle, size = 18 }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      title={visible ? 'Hide password' : 'Show password'}
      style={toggleButtonStyle}
    >
      {visible ? <EyeOpenIcon size={size} /> : <EyeClosedIcon size={size} />}
    </button>
  )
}
