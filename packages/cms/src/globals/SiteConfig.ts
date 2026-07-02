import type { Field, GlobalBeforeChangeHook, GlobalConfig } from 'payload'
import { isAuthenticatedAdmin } from '../access/isAuthenticatedAdmin.ts'
import { isSmtpConfigComplete } from '../utilities/emailConfig.ts'
import { revalidateSiteGlobalAfterChange } from '../utilities/cmsRevalidationHooks.ts'
import { normalizeOptionalEmail, optionalEmail } from '../utilities/validators.ts'
import {
  EMAIL_PROVIDER_PRESETS,
  isPresetEmailProvider,
  type EmailProvider,
} from '../utilities/emailProviderPresets.ts'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLOR_FIELD_COMPONENT = '@rfe/cms/fields/client#ColorPickerField'
const EMAIL_SETTINGS_FIELD = '@rfe/cms/components/EmailSettingsField#EmailSettingsField'

type EmailSettingsData = {
  email?: {
    provider?: EmailProvider
    smtpHost?: string
    smtpPort?: number
    secure?: boolean
    recipientEmail?: string
    username?: string
    smtpPassword?: string
    fromEmail?: string
    fromName?: string
    replyTo?: string
    enabled?: boolean
  }
  contact?: {
    email?: string
  }
}

const applyEmailProviderDefaults: GlobalBeforeChangeHook = ({ data, originalDoc }) => {
  const nextData = data as EmailSettingsData
  const email = nextData.email
  const previousEmail =
    originalDoc && typeof originalDoc === 'object' && 'email' in originalDoc
      ? (originalDoc.email as EmailSettingsData['email'])
      : undefined

  if (!email) return nextData

  const provider = email.provider

  if (!provider || provider === 'none') {
    return {
      ...nextData,
      email: {
        ...email,
        enabled: false,
      },
    }
  }

  let nextEmail = { ...email }

  const trimmedPassword = email.smtpPassword?.trim()
  const preservedPassword = previousEmail?.smtpPassword?.trim()

  nextEmail = {
    ...nextEmail,
    recipientEmail: normalizeOptionalEmail(nextEmail.recipientEmail),
    fromEmail: normalizeOptionalEmail(nextEmail.fromEmail),
    replyTo: normalizeOptionalEmail(nextEmail.replyTo),
    username: nextEmail.username?.trim() || undefined,
    smtpPassword: trimmedPassword || preservedPassword || undefined,
  }

  if (provider === 'custom') {
    nextEmail = {
      ...nextEmail,
      enabled: isSmtpConfigComplete(nextEmail, nextData.contact?.email),
    }
  } else if (isPresetEmailProvider(provider)) {
    const preset = EMAIL_PROVIDER_PRESETS[provider]
    nextEmail = {
      ...nextEmail,
      smtpHost: preset.smtpHost,
      smtpPort: preset.smtpPort,
      secure: preset.secure,
      enabled: isSmtpConfigComplete(
        {
          ...nextEmail,
          smtpHost: preset.smtpHost,
          smtpPort: preset.smtpPort,
          secure: preset.secure,
        },
        nextData.contact?.email,
      ),
    }
  }

  return {
    ...nextData,
    email: nextEmail,
  }
}

function colorField(name: string, label: string, defaultValue: string, width?: string): Field {
  return {
    name,
    type: 'text' as const,
    label,
    defaultValue,
    admin: {
      ...(width ? { width } : {}),
      components: { Field: COLOR_FIELD_COMPONENT },
    },
  }
}

function fontOptions(fonts: string[]) {
  return fonts.map((f) => ({ label: f, value: f }))
}

const DISPLAY_FONTS = [
  'Sackers Gothic',
  'Cinzel',
  'Playfair Display',
  'Cormorant Garamond',
  'Bodoni Moda',
  'DM Serif Display',
  'Josefin Sans',
  'Italiana',
  'Marcellus',
  'Tenor Sans',
  'Poiret One',
]

const SANS_FONTS = [
  'Inter',
  'DM Sans',
  'Plus Jakarta Sans',
  'Outfit',
  'Space Grotesk',
  'Montserrat',
  'Poppins',
  'Nunito Sans',
  'Raleway',
  'Open Sans',
  'Lato',
  'Roboto',
  'Work Sans',
  'Source Sans 3',
  'Figtree',
]

const SERIF_FONTS = [
  'Fraunces',
  'Lora',
  'Merriweather',
  'EB Garamond',
  'Libre Baskerville',
  'Crimson Pro',
  'Bitter',
  'Playfair Display',
  'Cormorant Garamond',
  'Noto Serif',
  'Source Serif 4',
  'IBM Plex Serif',
]

// ---------------------------------------------------------------------------
// Global
// ---------------------------------------------------------------------------

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  access: {
    read: () => true,
    update: isAuthenticatedAdmin,
  },
  admin: {
    group: 'Settings',
  },
  hooks: {
    beforeChange: [applyEmailProviderDefaults],
    afterChange: [revalidateSiteGlobalAfterChange],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ---------------------------------------------------------------
        // TAB: Brand & Identity
        // ---------------------------------------------------------------
        {
          label: 'Brand',
          description: 'Company identity, name, tagline, and logos.',
          fields: [
            {
              name: 'brand',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, defaultValue: 'RFE', admin: { width: '50%' } },
                    { name: 'tagline', type: 'text', defaultValue: 'True Crime. Real Drama.', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                    { name: 'favicon', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------------------------------------------------------
        // TAB: Design System
        // ---------------------------------------------------------------
        {
          label: 'Design',
          description: 'Colors, typography, and animation easings.',
          fields: [
            {
              name: 'colors',
              type: 'group',
              label: 'Main Colors',
              admin: { description: 'Primary brand palette.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    colorField('background', 'Background', '#070708', '50%'),
                    colorField('foreground', 'Foreground', '#F5F0EB', '50%'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    colorField('rfeRed', 'RFE Red', '#8B1A1A', '33%'),
                    colorField('rfeRose', 'RFE Rose', '#C4A0A0', '33%'),
                    colorField('rfeGold', 'RFE Gold', '#B5975A', '34%'),
                  ],
                },
              ],
            },
            {
              name: 'sectionTones',
              type: 'group',
              label: 'Section Tones',
              admin: { description: 'Near-black variants used as section backgrounds.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    colorField('deep', 'Deep', '#050506', '25%'),
                    colorField('charcoal', 'Charcoal', '#0a0a0c', '25%'),
                    colorField('slate', 'Slate', '#0c0d10', '25%'),
                    colorField('warm', 'Warm', '#0b0908', '25%'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    colorField('cool', 'Cool', '#080a0d', '33%'),
                    colorField('ember', 'Ember', '#0d0907', '33%'),
                    colorField('dusk', 'Dusk', '#090810', '34%'),
                  ],
                },
              ],
            },
            {
              name: 'typography',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'brandFont',
                      type: 'select',
                      defaultValue: 'Sackers Gothic',
                      options: fontOptions(DISPLAY_FONTS),
                      admin: {
                        width: '33%',
                        description: '"Sackers Gothic" is a custom local font. Other options load from Google Fonts.',
                      },
                    },
                    {
                      name: 'sansFont',
                      type: 'select',
                      defaultValue: 'Inter',
                      options: fontOptions(SANS_FONTS),
                      admin: { width: '33%' },
                    },
                    {
                      name: 'serifFont',
                      type: 'select',
                      defaultValue: 'Fraunces',
                      options: fontOptions(SERIF_FONTS),
                      admin: { width: '34%' },
                    },
                  ],
                },
                { name: 'radiusBase', type: 'text', defaultValue: '0.25rem', label: 'Border radius base' },
              ],
            },
            {
              name: 'easings',
              type: 'group',
              label: 'Animation Easings',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'emerge', type: 'text', defaultValue: 'cubic-bezier(0.16, 1, 0.3, 1)', admin: { width: '33%' } },
                    { name: 'quiet', type: 'text', defaultValue: 'cubic-bezier(0.87, 0, 0.13, 1)', admin: { width: '33%' } },
                    { name: 'sharp', type: 'text', defaultValue: 'cubic-bezier(0.76, 0, 0.24, 1)', admin: { width: '34%' } },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------------------------------------------------------
        // TAB: Content
        // ---------------------------------------------------------------
        {
          label: 'Content',
          description: 'About page, UI labels, and legal sections.',
          fields: [
            {
              name: 'about',
              type: 'group',
              fields: [
                { name: 'heroHeadline', type: 'text', defaultValue: "There's always more to the story." },
                { name: 'heroSubheadline', type: 'text', defaultValue: 'True Crime / Real Drama' },
                {
                  name: 'heroParagraph',
                  type: 'textarea',
                  defaultValue: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds. RFE is a production company dedicated to developing bold, elevated content with a focus on empowering voices and complex characters, especially those of women.',
                },
                {
                  name: 'paragraphs',
                  type: 'array',
                  fields: [{ name: 'text', type: 'textarea', required: true }],
                },
              ],
            },
            {
              name: 'ui',
              type: 'group',
              label: 'UI Labels',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'workView', type: 'text', defaultValue: 'View', admin: { width: '25%' } },
                    { name: 'developmentFilms', type: 'text', defaultValue: 'Films', admin: { width: '25%' } },
                    { name: 'developmentSeries', type: 'text', defaultValue: 'Series', admin: { width: '25%' } },
                    { name: 'developmentUnscripted', type: 'text', defaultValue: 'Unscripted', admin: { width: '25%' } },
                  ],
                },
              ],
            },
            {
              name: 'legal',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', defaultValue: 'Legal notice', admin: { width: '50%' } },
                    { name: 'subtitle', type: 'text', defaultValue: 'Publisher information, hosting, and terms of use.', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'sections',
                  type: 'array',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                      name: 'paragraphs',
                      type: 'array',
                      fields: [{ name: 'text', type: 'textarea', required: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------------------------------------------------------
        // TAB: Email
        // ---------------------------------------------------------------
        {
          label: 'Email',
          description: 'Configure contact form email delivery with provider presets.',
          fields: [
            {
              name: 'email',
              type: 'group',
              fields: [
                {
                  name: 'emailSettingsUi',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: EMAIL_SETTINGS_FIELD,
                    },
                  },
                },
                { name: 'enabled', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
                {
                  name: 'provider',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'Mailto only', value: 'none' },
                    { label: 'Google / Gmail', value: 'gmail' },
                    { label: 'Google Workspace', value: 'google-workspace' },
                    { label: 'Outlook / Microsoft 365', value: 'outlook' },
                    { label: 'Brevo', value: 'brevo' },
                    { label: 'SendGrid', value: 'sendgrid' },
                    { label: 'Mailgun', value: 'mailgun' },
                    { label: 'Custom SMTP', value: 'custom' },
                  ],
                  admin: { hidden: true },
                },
                { name: 'smtpHost', type: 'text', defaultValue: 'smtp.gmail.com', admin: { hidden: true } },
                { name: 'smtpPort', type: 'number', defaultValue: 465, admin: { hidden: true } },
                { name: 'secure', type: 'checkbox', defaultValue: true, admin: { hidden: true } },
                { name: 'recipientEmail', type: 'text', validate: optionalEmail, admin: { hidden: true } },
                { name: 'username', type: 'text', admin: { hidden: true } },
                {
                  name: 'smtpPassword',
                  type: 'text',
                  access: { read: isAuthenticatedAdmin },
                  admin: { hidden: true },
                },
                { name: 'fromEmail', type: 'text', validate: optionalEmail, admin: { hidden: true } },
                { name: 'fromName', type: 'text', defaultValue: 'RFE', admin: { hidden: true } },
                { name: 'replyTo', type: 'text', validate: optionalEmail, admin: { hidden: true } },
              ],
            },
          ],
        },

        // ---------------------------------------------------------------
        // TAB: SEO & Contact
        // ---------------------------------------------------------------
        {
          label: 'SEO & Contact',
          description: 'Search engine defaults, contact details, and social links.',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'titleTemplate', type: 'text', defaultValue: '%s | RFE', admin: { width: '50%' } },
                    { name: 'defaultTitle', type: 'text', defaultValue: 'RFE — a cinematic female gaze studio', admin: { width: '50%' } },
                  ],
                },
                { name: 'defaultDescription', type: 'textarea', defaultValue: 'stories that refuse to stay quiet.' },
                { name: 'keywords', type: 'text', defaultValue: 'female gaze cinema, feminist film production, independent film studio, female director, women in film' },
                {
                  type: 'row',
                  fields: [
                    { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                    { name: 'siteUrl', type: 'text', defaultValue: 'https://www.rohmfeiferentertainment.com', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'email', type: 'email', defaultValue: 'elisabeth@rohmfeiferentertainment.com', admin: { width: '50%' } },
                    { name: 'secondaryEmail', type: 'email', defaultValue: 'kara@rohmfeiferentertainment.com', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'phone', type: 'text', admin: { width: '50%' } },
                  ],
                },
                { name: 'address', type: 'text', defaultValue: 'Los Angeles, California' },
              ],
            },
            {
              name: 'social',
              type: 'group',
              label: 'Social Links',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/elisabethrohm/', admin: { width: '50%' } },
                    { name: 'imdb', type: 'text', defaultValue: 'https://www.imdb.com/name/nm0738400/', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'linkedin', type: 'text', admin: { width: '33%' } },
                    { name: 'vimeo', type: 'text', admin: { width: '33%' } },
                    { name: 'tiktok', type: 'text', admin: { width: '34%' } },
                  ],
                },
              ],
            },
          ],
        },

      ],
    },
  ],
}
