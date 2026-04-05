import type { GlobalConfig, Field } from 'payload'
import { revalidateFrontend } from '../utilities/revalidateFrontend.ts'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLOR_FIELD_COMPONENT = '@rfe/cms/components/ColorPickerField#ColorPickerField'
const SECRET_FIELD_COMPONENT = '@rfe/cms/components/SecretTextField#SecretTextField'

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
  },
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [
      () => { revalidateFrontend({ global: 'site-config' }) },
    ],
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
                  defaultValue: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
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

        // ---------------------------------------------------------------
        // TAB: Admin Panel
        // ---------------------------------------------------------------
        {
          label: 'Admin',
          description: 'Admin panel settings and AI assistant configuration.',
          fields: [
            {
              name: 'admin',
              type: 'group',
              label: 'Admin Panel',
              fields: [
                {
                  name: 'aiAssistantEnabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Enable AI Assistant',
                  admin: {
                    description: 'Show the AI chat widget in the admin panel.',
                  },
                },
                {
                  name: 'openaiApiKey',
                  type: 'text',
                  label: 'OpenAI API Key',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.aiAssistantEnabled === true,
                    description: 'Paste your OpenAI API key here. Leave empty to use the key from environment variables (OPENAI_API_KEY).',
                    components: {
                      Field: SECRET_FIELD_COMPONENT,
                    },
                  },
                },
                {
                  name: 'aiModel',
                  type: 'select',
                  label: 'AI Model',
                  defaultValue: 'gpt-4o',
                  options: [
                    { label: 'GPT-4o (recommended)', value: 'gpt-4o' },
                    { label: 'GPT-4o Mini (faster, cheaper)', value: 'gpt-4o-mini' },
                    { label: 'GPT-4.1', value: 'gpt-4.1' },
                    { label: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
                    { label: 'GPT-4.1 Nano (fastest)', value: 'gpt-4.1-nano' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.aiAssistantEnabled === true,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
