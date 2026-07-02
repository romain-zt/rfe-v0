import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { z } from 'zod'
import {
  isSmtpConfigComplete,
  resolveContactRecipient,
  resolveSmtpPassword,
} from '@rfe/cms/utilities/emailConfig'
import config from '@/payload.config'
import type { SiteConfig } from '@/payload-types'

const ContactRequestSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(1),
  recipientEmail: z.string().trim().email().optional(),
})

type ContactRequestData = z.infer<typeof ContactRequestSchema>

type ContactResponse =
  | { delivery: 'smtp'; message: string }
  | { delivery: 'mailto'; mailtoUrl: string }

function buildMailtoUrl(data: ContactRequestData, fallbackEmail: string): string {
  const subject = encodeURIComponent(`Contact from ${data.name}`)
  const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)
  return `mailto:${fallbackEmail}?subject=${subject}&body=${body}`
}

function resolveRecipient(siteConfig: SiteConfig, recipientEmail?: string): string {
  return resolveContactRecipient(siteConfig.email, siteConfig.contact?.email, recipientEmail)
}

function hasUsableSmtpConfig(siteConfig: SiteConfig): boolean {
  return isSmtpConfigComplete(siteConfig.email, siteConfig.contact?.email)
}

function buildTextBody(data: ContactRequestData): string {
  return [
    'New contact form submission',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    '',
    'Message:',
    data.message,
  ].join('\n')
}

function buildHtmlBody(data: ContactRequestData): string {
  const escapedName = data.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const escapedEmail = data.email.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const escapedMessage = data.message
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br />')

  return [
    '<h2>New contact form submission</h2>',
    `<p><strong>Name:</strong> ${escapedName}</p>`,
    `<p><strong>Email:</strong> ${escapedEmail}</p>`,
    '<p><strong>Message:</strong></p>',
    `<p>${escapedMessage}</p>`,
  ].join('')
}

async function getSiteConfigWithEmail(): Promise<SiteConfig> {
  const payload = await getPayload({ config })

  return payload.findGlobal({
    slug: 'site-config',
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
  })
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse | { error: string }>> {
  const json = await request.json()
  const parsed = ContactRequestSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid contact request.' }, { status: 400 })
  }

  const data = parsed.data
  const siteConfig = await getSiteConfigWithEmail()
  const recipient = resolveRecipient(siteConfig, data.recipientEmail)

  if (!recipient) {
    return NextResponse.json({ error: 'No contact recipient is configured.' }, { status: 500 })
  }

  if (!hasUsableSmtpConfig(siteConfig)) {
    return NextResponse.json({
      delivery: 'mailto',
      mailtoUrl: buildMailtoUrl(data, recipient),
    })
  }

  const emailConfig = siteConfig.email
  if (!emailConfig) {
    return NextResponse.json({
      delivery: 'mailto',
      mailtoUrl: buildMailtoUrl(data, recipient),
    })
  }

  const smtpPassword = resolveSmtpPassword(emailConfig)
  const smtpHost = emailConfig.smtpHost?.trim()
  const smtpPort = emailConfig.smtpPort
  const smtpUser = emailConfig.username?.trim()

  if (!smtpHost || smtpPort == null || !Number.isFinite(smtpPort) || !smtpUser) {
    return NextResponse.json({
      delivery: 'mailto',
      mailtoUrl: buildMailtoUrl(data, recipient),
    })
  }

  const transportOptions: SMTPTransport.Options = {
    host: smtpHost,
    port: smtpPort,
    secure: Boolean(emailConfig.secure),
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  }
  const transporter = nodemailer.createTransport(transportOptions)

  try {
    const replyToHeader = emailConfig.replyTo?.trim()
      ? emailConfig.replyTo.trim()
      : `"${data.name}" <${data.email}>`

    await transporter.sendMail({
      to: recipient,
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      replyTo: replyToHeader,
      subject: `Contact from ${data.name}`,
      text: buildTextBody(data),
      html: buildHtmlBody(data),
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to send email via SMTP.'
    console.error('[contact] SMTP send failed:', message)
    return NextResponse.json({ error: 'Unable to send the message right now. Please try again later.' }, { status: 502 })
  }

  return NextResponse.json({
    delivery: 'smtp',
    message: 'Message sent successfully.',
  })
}
