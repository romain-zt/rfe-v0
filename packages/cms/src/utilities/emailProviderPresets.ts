export type EmailProvider =
  | 'none'
  | 'gmail'
  | 'google-workspace'
  | 'outlook'
  | 'brevo'
  | 'sendgrid'
  | 'mailgun'
  | 'custom'

export type EmailSmtpPreset = {
  smtpHost: string
  smtpPort: number
  secure: boolean
}

export type EmailProviderGuide = {
  title: string
  steps: string[]
  usernameLabel: string
  passwordLabel: string
  usernameHelp: string
  passwordHelp: string
}

export const EMAIL_PROVIDER_OPTIONS: { label: string; value: EmailProvider }[] = [
  { label: '— Mailto only (open email app) —', value: 'none' },
  { label: 'Google / Gmail', value: 'gmail' },
  { label: 'Google Workspace', value: 'google-workspace' },
  { label: 'Microsoft Outlook / Office 365', value: 'outlook' },
  { label: 'Brevo', value: 'brevo' },
  { label: 'SendGrid', value: 'sendgrid' },
  { label: 'Mailgun', value: 'mailgun' },
  { label: 'Custom SMTP', value: 'custom' },
]

export const EMAIL_PROVIDER_PRESETS: Record<Exclude<EmailProvider, 'none' | 'custom'>, EmailSmtpPreset> = {
  gmail: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    secure: true,
  },
  'google-workspace': {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    secure: true,
  },
  outlook: {
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    secure: false,
  },
  brevo: {
    smtpHost: 'smtp-relay.brevo.com',
    smtpPort: 587,
    secure: false,
  },
  sendgrid: {
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    secure: false,
  },
  mailgun: {
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    secure: false,
  },
}

export const EMAIL_PROVIDER_GUIDES: Record<Exclude<EmailProvider, 'none'>, EmailProviderGuide> = {
  gmail: {
    title: 'Gmail setup',
    steps: [
      'Enable 2-Step Verification on your Google account.',
      'Create an App Password (Google Account → Security → App passwords).',
      'Use your full Gmail address as the username and the app password below.',
    ],
    usernameLabel: 'Gmail address',
    passwordLabel: 'Gmail app password',
    usernameHelp: 'Usually your @gmail.com address.',
    passwordHelp: 'Use a Google App Password — not your regular account password.',
  },
  'google-workspace': {
    title: 'Google Workspace setup',
    steps: [
      'Ask your admin to allow SMTP for the sending account if needed.',
      'Enable 2-Step Verification and create an App Password for the mailbox.',
      'Use the Workspace email address as username and the app password below.',
    ],
    usernameLabel: 'Workspace email',
    passwordLabel: 'App password',
    usernameHelp: 'The Google Workspace address used to send mail.',
    passwordHelp: 'Use a Google App Password when MFA is enabled.',
  },
  outlook: {
    title: 'Microsoft Outlook / Office 365 setup',
    steps: [
      'SMTP must be enabled for the mailbox (often on by default for Microsoft 365).',
      'If MFA is active, create an app password in your Microsoft account security settings.',
      'Use your Outlook address as username and the app password below.',
    ],
    usernameLabel: 'Microsoft address',
    passwordLabel: 'Microsoft password',
    usernameHelp: 'Usually your @outlook.com or Microsoft 365 address.',
    passwordHelp: 'Use an app password if multi-factor authentication is enabled.',
  },
  brevo: {
    title: 'Brevo setup',
    steps: [
      'Log in to Brevo and open SMTP & API settings.',
      'Copy your SMTP login and SMTP key from the dashboard.',
      'Paste them in the fields below.',
    ],
    usernameLabel: 'Brevo SMTP login',
    passwordLabel: 'Brevo SMTP key',
    usernameHelp: 'Found in Brevo → SMTP & API.',
    passwordHelp: 'Use the SMTP key, not your Brevo account password.',
  },
  sendgrid: {
    title: 'SendGrid setup',
    steps: [
      'Create an API key with Mail Send permissions in SendGrid.',
      'Use the literal username `apikey` and the API key as the password.',
      'Verify your sender identity in SendGrid before sending.',
    ],
    usernameLabel: 'SendGrid username',
    passwordLabel: 'SendGrid API key',
    usernameHelp: 'Always use `apikey` as the SMTP username.',
    passwordHelp: 'Paste your SendGrid API key with Mail Send permission.',
  },
  mailgun: {
    title: 'Mailgun setup',
    steps: [
      'Open Mailgun → Sending → Domain settings → SMTP credentials.',
      'Create or copy SMTP credentials for your domain.',
      'Use those credentials in the fields below.',
    ],
    usernameLabel: 'Mailgun SMTP user',
    passwordLabel: 'Mailgun SMTP password',
    usernameHelp: 'From your Mailgun domain SMTP settings.',
    passwordHelp: 'SMTP password generated in Mailgun.',
  },
  custom: {
    title: 'Custom SMTP setup',
    steps: [
      'Enter the SMTP host, port, and security mode provided by your email host.',
      'Use the credentials supplied by your provider.',
      'Test by submitting the contact form after saving.',
    ],
    usernameLabel: 'SMTP username',
    passwordLabel: 'SMTP password',
    usernameHelp: 'Login provided by your SMTP host.',
    passwordHelp: 'Password or API key for SMTP authentication.',
  },
}

export function isPresetEmailProvider(
  provider: EmailProvider | undefined | null,
): provider is Exclude<EmailProvider, 'none' | 'custom'> {
  return Boolean(provider && provider in EMAIL_PROVIDER_PRESETS)
}

export function formatSecureConnection(secure: boolean, port: number): string {
  if (secure && port === 465) return 'Yes (implicit TLS)'
  if (!secure && port === 587) return 'Yes (STARTTLS)'
  return secure ? 'Yes (TLS)' : 'No'
}

export function getProviderPreset(provider: EmailProvider | undefined | null): EmailSmtpPreset | null {
  if (!isPresetEmailProvider(provider)) return null
  return EMAIL_PROVIDER_PRESETS[provider]
}
