export type EmailConfigShape = {
  enabled?: boolean | null
  provider?: string | null
  smtpHost?: string | null
  smtpPort?: number | null
  secure?: boolean | null
  recipientEmail?: string | null
  username?: string | null
  smtpPassword?: string | null
  fromEmail?: string | null
  fromName?: string | null
  replyTo?: string | null
}

export function resolveContactRecipient(
  emailConfig: EmailConfigShape | null | undefined,
  contactEmail?: string | null,
  overrideRecipient?: string,
): string {
  return (
    overrideRecipient?.trim() ||
    emailConfig?.recipientEmail?.trim() ||
    contactEmail?.trim() ||
    ''
  )
}

export function resolveSmtpPassword(
  emailConfig: EmailConfigShape | null | undefined,
): string {
  const fromConfig = emailConfig?.smtpPassword?.trim()
  if (fromConfig) return fromConfig

  const fromEnv = process.env.SMTP_PASSWORD?.trim()
  return fromEnv ?? ''
}

export function isSmtpConfigComplete(
  emailConfig: EmailConfigShape | null | undefined,
  contactEmail?: string | null,
  overrideRecipient?: string,
): boolean {
  if (!emailConfig) return false

  const smtpPassword = resolveSmtpPassword(emailConfig)

  return Boolean(
    emailConfig.provider &&
      emailConfig.provider !== 'none' &&
      emailConfig.smtpHost?.trim() &&
      Number.isFinite(emailConfig.smtpPort) &&
      emailConfig.username?.trim() &&
      smtpPassword &&
      emailConfig.fromEmail?.trim() &&
      emailConfig.fromName?.trim() &&
      resolveContactRecipient(emailConfig, contactEmail, overrideRecipient),
  )
}
