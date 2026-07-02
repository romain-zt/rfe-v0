'use client'

import { getImageProps, type ImageProps } from 'next/image'
import { forwardRef, type CSSProperties } from 'react'

export type ImageFit = 'cover' | 'contain'

type Props = {
  desktopSrc: string
  mobileSrc: string
  hasMobileVariant: boolean
  desktopPosition: string
  mobilePosition: string
  desktopFit?: ImageFit
  mobileFit?: ImageFit
  alt: string
  priority?: boolean
  quality?: number
  desktopWidth?: number
  desktopHeight?: number
  mobileWidth?: number
  mobileHeight?: number
  className?: string
  style?: CSSProperties
  onError?: () => void
}

/**
 * Art-direction responsive hero image.
 *
 * Renders a `<picture>` with one `<source>` per breakpoint:
 *   - desktop (>= 640px) → `desktopSrc`
 *   - mobile (< 640px)   → `mobileSrc` (or `desktopSrc` if no mobile variant)
 *
 * Both URLs are passed through Next/Image's `getImageProps()` so we keep srcset
 * / format optimization where it's enabled. With `images.unoptimized = true`,
 * we fall back to the plain `src` so the `<source>` always has a value.
 *
 * `objectPosition` switches per breakpoint via CSS custom properties consumed
 * by the `[data-rhp-img]` rule in `globals.css`. This keeps the styling deterministic
 * and avoids any styled-jsx hydration quirks.
 *
 * The `<img>` is absolutely positioned to fill its parent (`object-fit: cover`),
 * so wrap it in any container with `position: relative | absolute | fixed`.
 */
export const ResponsiveHeroPicture = forwardRef<HTMLImageElement, Props>(
  function ResponsiveHeroPicture(
    {
      desktopSrc,
      mobileSrc,
      hasMobileVariant,
      desktopPosition,
      mobilePosition,
      desktopFit = 'cover',
      mobileFit,
      alt,
      priority = true,
      quality = 85,
      desktopWidth = 1920,
      desktopHeight = 1080,
      mobileWidth = 828,
      mobileHeight = 1472,
      className,
      style,
      onError,
    },
    ref,
  ) {
    const resolvedMobileFit: ImageFit = mobileFit ?? desktopFit
    const commonImageProps = {
      alt,
      sizes: '100vw',
      priority,
      quality,
    } satisfies Partial<ImageProps>

    const { props: desktop } = getImageProps({
      ...commonImageProps,
      src: desktopSrc,
      width: desktopWidth,
      height: desktopHeight,
    })

    const { props: mobile } = getImageProps({
      ...commonImageProps,
      src: mobileSrc,
      width: hasMobileVariant ? mobileWidth : desktopWidth,
      height: hasMobileVariant ? mobileHeight : desktopHeight,
    })

    const desktopSrcSet = desktop.srcSet || desktop.src
    const mobileSrcSet = mobile.srcSet || mobile.src

    const cssVars: CSSProperties = {
      ['--rhp-desktop-pos' as string]: desktopPosition,
      ['--rhp-mobile-pos' as string]: mobilePosition,
      ['--rhp-desktop-fit' as string]: desktopFit,
      ['--rhp-mobile-fit' as string]: resolvedMobileFit,
    }

    return (
      <picture>
        <source
          media="(min-width: 640px)"
          srcSet={desktopSrcSet}
          sizes={desktop.sizes}
        />
        <source
          media="(max-width: 639px)"
          srcSet={mobileSrcSet}
          sizes={mobile.sizes}
        />
        <img
          ref={ref}
          {...mobile}
          alt={alt}
          onError={onError}
          className={className}
          data-rhp-img=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            ...cssVars,
            ...style,
          }}
        />
      </picture>
    )
  },
)
