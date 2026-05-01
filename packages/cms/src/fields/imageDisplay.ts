import type { Field } from 'payload'

/**
 * Standard 9-position grid for `object-position` (matches CSS keywords).
 * Editors pick a preset; the frontend converts it to a CSS string.
 *
 * Convention used across WordPress, Webflow, Squarespace.
 */
export type ImagePositionPreset =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

export const IMAGE_POSITION_OPTIONS: { label: string; value: ImagePositionPreset }[] = [
  { label: 'Top left', value: 'top-left' },
  { label: 'Top center', value: 'top' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Middle left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Middle right', value: 'right' },
  { label: 'Bottom left', value: 'bottom-left' },
  { label: 'Bottom center', value: 'bottom' },
  { label: 'Bottom right', value: 'bottom-right' },
]

const PRESET_TO_CSS: Record<ImagePositionPreset, string> = {
  'top-left': 'left top',
  top: 'center top',
  'top-right': 'right top',
  left: 'left center',
  center: 'center center',
  right: 'right center',
  'bottom-left': 'left bottom',
  bottom: 'center bottom',
  'bottom-right': 'right bottom',
}

/**
 * Convert an `ImagePositionPreset` (or unknown value) to a CSS `object-position` string.
 * Falls back to `center center` when the value is missing or invalid.
 */
export function imagePositionToCss(preset: ImagePositionPreset | string | null | undefined): string {
  if (preset && preset in PRESET_TO_CSS) {
    return PRESET_TO_CSS[preset as ImagePositionPreset]
  }
  return 'center center'
}

export type ImageFit = 'cover' | 'contain'

export const IMAGE_FIT_OPTIONS: { label: string; value: ImageFit }[] = [
  { label: 'Cover — fills the container (may crop)', value: 'cover' },
  { label: 'Contain — whole image visible (may letterbox)', value: 'contain' },
]

type ImageDisplayFieldsOptions = {
  /** Whether the desktop image group is required (e.g. media block) or optional (e.g. minimal hero). */
  containerLabel?: string
  /** Optional condition applied to every generated field (used by hero to hide for `minimal` type). */
  condition?: (data: Record<string, unknown>, siblingData: Record<string, unknown>) => boolean
}

/**
 * Build the standard desktop + mobile image-display field group:
 *   - desktop: image fit + image position (side-by-side row)
 *   - mobile : collapsible "Mobile override" with mobile media + fit + position
 *
 * The caller is responsible for the `media` upload field that owns this group.
 */
export function imageDisplayFields(opts: ImageDisplayFieldsOptions = {}): Field[] {
  const { condition } = opts

  const withCondition = <F extends Field>(field: F): F => {
    if (!condition) return field
    return {
      ...field,
      admin: { ...(field as { admin?: Record<string, unknown> }).admin, condition },
    } as F
  }

  return [
    withCondition({
      type: 'row',
      fields: [
        {
          name: 'imageFit',
          type: 'select',
          defaultValue: 'cover',
          options: IMAGE_FIT_OPTIONS,
          admin: {
            width: '50%',
            description: 'How the image fits its container.',
          },
        },
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'center',
          options: IMAGE_POSITION_OPTIONS,
          admin: {
            width: '50%',
            description: 'Where to anchor the image when cropped.',
          },
        },
      ],
    }),
    withCondition({
      type: 'collapsible',
      label: 'Mobile override (optional)',
      admin: {
        initCollapsed: true,
        description: 'Override desktop image and display for screens < 640px. Leave empty to inherit.',
      },
      fields: [
        {
          name: 'mediaMobile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional portrait image for < 640px. Inherits the desktop image if empty.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'imageFitMobile',
              type: 'select',
              options: IMAGE_FIT_OPTIONS,
              admin: {
                width: '50%',
                description: 'Leave empty to inherit desktop.',
              },
            },
            {
              name: 'imagePositionMobile',
              type: 'select',
              options: IMAGE_POSITION_OPTIONS,
              admin: {
                width: '50%',
                description: 'Leave empty to inherit desktop.',
              },
            },
          ],
        },
      ],
    }),
  ]
}
