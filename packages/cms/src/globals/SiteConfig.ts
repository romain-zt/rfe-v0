import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '../utilities/revalidateFrontend.ts'

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
      name: 'brand',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true, defaultValue: 'RFE' },
        { name: 'tagline', type: 'text', defaultValue: 'True Crime. Real Drama.' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'favicon', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'background', type: 'text', defaultValue: '#070708' },
        { name: 'foreground', type: 'text', defaultValue: '#F5F0EB' },
        { name: 'rfeRed', type: 'text', defaultValue: '#8B1A1A' },
        { name: 'rfeRose', type: 'text', defaultValue: '#C4A0A0' },
        { name: 'rfeGold', type: 'text', defaultValue: '#B5975A' },
      ],
    },
    {
      name: 'sectionTones',
      type: 'group',
      fields: [
        { name: 'deep', type: 'text', defaultValue: '#050506' },
        { name: 'charcoal', type: 'text', defaultValue: '#0a0a0c' },
        { name: 'slate', type: 'text', defaultValue: '#0c0d10' },
        { name: 'warm', type: 'text', defaultValue: '#0b0908' },
        { name: 'cool', type: 'text', defaultValue: '#080a0d' },
        { name: 'ember', type: 'text', defaultValue: '#0d0907' },
        { name: 'dusk', type: 'text', defaultValue: '#090810' },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        { name: 'brandFont', type: 'text', defaultValue: 'Sackers Gothic' },
        { name: 'sansFont', type: 'text', defaultValue: 'Inter' },
        { name: 'serifFont', type: 'text', defaultValue: 'Fraunces' },
        { name: 'radiusBase', type: 'text', defaultValue: '0.25rem' },
      ],
    },
    {
      name: 'easings',
      type: 'group',
      fields: [
        { name: 'emerge', type: 'text', defaultValue: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        { name: 'quiet', type: 'text', defaultValue: 'cubic-bezier(0.87, 0, 0.13, 1)' },
        { name: 'sharp', type: 'text', defaultValue: 'cubic-bezier(0.76, 0, 0.24, 1)' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text', defaultValue: '%s | RFE' },
        { name: 'defaultTitle', type: 'text', defaultValue: 'RFE — a cinematic female gaze studio' },
        { name: 'defaultDescription', type: 'textarea', defaultValue: 'stories that refuse to stay quiet.' },
        { name: 'keywords', type: 'text', defaultValue: 'female gaze cinema, feminist film production, independent film studio, female director, women in film' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        { name: 'siteUrl', type: 'text', defaultValue: 'https://www.rohmfeiferentertainment.com' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'elisabeth@rohmfeiferentertainment.com' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'text', defaultValue: 'Los Angeles, California' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/elisabethrohm/' },
        { name: 'linkedin', type: 'text' },
        { name: 'vimeo', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'imdb', type: 'text', defaultValue: 'https://www.imdb.com/name/nm0738400/' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'heroHeadline', type: 'text', defaultValue: "There's always more to the story." },
        { name: 'heroSubheadline', type: 'text', defaultValue: 'True Crime / Real Drama' },
        {
          name: 'heroParagraph',
          type: 'textarea',
          defaultValue: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
        },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Legal notice' },
        { name: 'subtitle', type: 'text', defaultValue: 'Publisher information, hosting, and terms of use.' },
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
}
