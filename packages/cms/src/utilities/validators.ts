import type { Validate } from 'payload'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Allows blank optional email fields — Payload's built-in email type rejects empty strings. */
export const optionalEmail: Validate<string | null | undefined> = (value) => {
  if (value === undefined || value === null) {
    return true
  }

  const trimmed = String(value).trim()
  if (!trimmed) {
    return true
  }

  return EMAIL_PATTERN.test(trimmed) || 'Please enter a valid email address'
}

export function normalizeOptionalEmail(value: string | null | undefined): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed || undefined
}
