/**
 * Export all pages from a Canva design when Download is blocked.
 *
 * Extracts the active slide HTML + downloads img src from media.canva.com
 * (screenshots fail — Canva renders lazy-loaded cross-origin images in DOM).
 *
 * Usage (from apps/rfe-v0):
 *   pnpm canva:login
 *   pnpm canva:export
 *   pnpm canva:export -- --pages 72 --start 1 --force
 *
 * Output per page:
 *   public/assets/canva-deck/page-001/slide.html
 *   public/assets/canva-deck/page-001/meta.json
 *   public/assets/canva-deck/page-001/images/01.png …
 */

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { chromium, type APIRequestContext, type Page } from 'playwright'

const DESIGN_ID = 'DAGoLwZHr7E'
const VIEW_KEY = 'VCsMvNc-DXZFQ9SipdycpQ'
const VIEW_URL = `https://www.canva.com/design/${DESIGN_ID}/${VIEW_KEY}/view`
const EDIT_URL = `https://www.canva.com/design/${DESIGN_ID}/edit`

const OUTPUT_DIR = path.join(process.cwd(), 'public/assets/canva-deck')
const PROFILE_DIR = path.join(process.cwd(), '.canva-browser-profile')

type CliOptions = {
  pages: number
  start: number
  headed: boolean
  force: boolean
  login: boolean
  mode: 'view' | 'edit'
  delayMs: number
}

type SlideImage = {
  src: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  elementId: string | null
}

type SlideExtract = {
  html: string
  ariaLabel: string | null
  images: SlideImage[]
  textBlocks: string[]
}

type PageMeta = {
  page: number
  ariaLabel: string | null
  title: string | null
  textBlocks: string[]
  images: Array<{
    file: string
    originalUrl: string
    width: number
    height: number
    bytes: number
  }>
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const getFlag = (name: string) => args.includes(`--${name}`)
  const getValue = (name: string, fallback: string) => {
    const idx = args.indexOf(`--${name}`)
    return idx >= 0 && args[idx + 1] ? args[idx + 1]! : fallback
  }

  return {
    pages: Number(getValue('pages', '72')),
    start: Number(getValue('start', '1')),
    headed: getFlag('headed') || getFlag('login'),
    force: getFlag('force'),
    login: getFlag('login'),
    mode: getValue('mode', 'view') === 'edit' ? 'edit' : 'view',
    delayMs: Number(getValue('delay', '3000')),
  }
}

function waitForEnter(message: string): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(message, () => {
      rl.close()
      resolve()
    })
  })
}

function padPage(n: number): string {
  return String(n).padStart(3, '0')
}

function pageDir(pageNum: number): string {
  return path.join(OUTPUT_DIR, `page-${padPage(pageNum)}`)
}

function pageIsExported(pageNum: number): boolean {
  return fs.existsSync(path.join(pageDir(pageNum), 'slide.html'))
}

function canvaQualityScore(url: string): number {
  if (url.includes('micro_thumbnail')) return 1
  if (url.includes('screen_2x')) return 2
  if (url.includes('screen_3x')) return 3
  if (url.includes('quality:100')) return 2
  return 1
}

function canvaAssetUri(url: string): string {
  const match = url.match(/uri:([^/?]+)/)
  return match ? decodeURIComponent(match[1]!) : url
}

/** Keep the best-quality src per Canva asset URI. */
function dedupeImages(images: SlideImage[]): SlideImage[] {
  const best = new Map<string, SlideImage>()

  for (const img of images) {
    if (!img.src.includes('media.canva.com')) continue
    const key = canvaAssetUri(img.src)
    const existing = best.get(key)
    if (!existing || canvaQualityScore(img.src) > canvaQualityScore(existing.src)) {
      best.set(key, img)
    }
  }

  return [...best.values()]
}

function guessTitle(textBlocks: string[]): string | null {
  if (textBlocks.length === 0) return null
  const first = textBlocks[0]!
  const line = first.split('\n')[0]?.trim()
  return line && line.length < 120 ? line : null
}

function extFromUrl(url: string): string {
  const formatMatch = url.match(/format:([A-Za-z]+)/)
  if (formatMatch) return formatMatch[1]!.toLowerCase() === 'jpeg' ? 'jpg' : formatMatch[1]!.toLowerCase()
  if (url.includes('.jpg') || url.includes('format:JPG')) return 'jpg'
  if (url.includes('.webp')) return 'webp'
  return 'png'
}

function rewriteHtmlWithLocalImages(html: string, srcToLocal: Map<string, string>): string {
  let out = html
  for (const [src, local] of srcToLocal) {
    out = out.split(src).join(local)
  }
  return out
}

async function dismissOverlays(page: Page): Promise<void> {
  const dismissSelectors = [
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    'button:has-text("Close")',
    'button[aria-label="Close"]',
  ]

  for (const selector of dismissSelectors) {
    const btn = page.locator(selector).first()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {})
      await page.waitForTimeout(300)
    }
  }
}

async function goToPage(page: Page, pageNum: number, mode: 'view' | 'edit'): Promise<void> {
  if (mode === 'view') {
    await page.goto(`${VIEW_URL}#${pageNum}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    return
  }

  if (!page.url().includes(DESIGN_ID)) {
    await page.goto(EDIT_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.waitForTimeout(3000)
  }

  const thumb = page.locator('[data-page-index]').nth(pageNum - 1)
  if (await thumb.count()) {
    await thumb.click()
    await page.waitForTimeout(1500)
    return
  }

  await page.goto(`${VIEW_URL}#${pageNum}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
}

async function waitForActiveSlide(page: Page, pageNum: number, delayMs: number): Promise<void> {
  await page.waitForSelector('.fMSICA[aria-hidden="false"], .fMSICA.h517IA', { timeout: 30_000 })

  await page
    .waitForFunction(
      (expected) => {
        const active = document.querySelector('.fMSICA[aria-hidden="false"]') as HTMLElement | null
        if (!active) return false
        const label = active.querySelector('[aria-label*="Page"]')?.getAttribute('aria-label') ?? ''
        const normalized = label.replace(/\u00a0/g, ' ')
        return normalized.includes(`Page ${expected}`) || normalized.includes(`Page\u00a0${expected}`)
      },
      pageNum,
      { timeout: 12_000 },
    )
    .catch(() => {
      // label format varies — continue anyway
    })

  await page.waitForTimeout(delayMs)

  await page
    .waitForFunction(() => {
      const slide = document.querySelector('.fMSICA[aria-hidden="false"]') as HTMLElement | null
      if (!slide) return false
      const imgs = slide.querySelectorAll('img[src*="media.canva.com"]')
      if (imgs.length === 0) return true
      return [...imgs].every((img) => {
        const el = img as HTMLImageElement
        return el.complete && el.naturalWidth > 0
      })
    }, undefined, { timeout: 15_000 })
    .catch(() => {})
}

async function extractActiveSlide(page: Page): Promise<SlideExtract | null> {
  return page.evaluate(() => {
    const slide =
      (document.querySelector('.fMSICA[aria-hidden="false"]') as HTMLElement | null) ??
      (document.querySelector('.fMSICA.h517IA') as HTMLElement | null)

    if (!slide) return null

    const imgs = Array.from(slide.querySelectorAll('img[src*="media.canva.com"]'))
    const images = imgs
      .map((img) => {
        const el = img as HTMLImageElement
        return {
          src: el.getAttribute('src') ?? '',
          alt: el.getAttribute('alt') ?? '',
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          elementId: el.closest('[id]')?.id ?? null,
        }
      })
      .filter((img) => img.src.length > 0)

    const a11yRegion = slide.querySelector('[role="region"]')
    const textFromA11y = a11yRegion
      ? Array.from(a11yRegion.querySelectorAll('p'))
          .map((p) => p.textContent?.trim() ?? '')
          .filter(Boolean)
      : []

    const textFromVisual = Array.from(slide.querySelectorAll('p._28USrA'))
      .map((p) => p.textContent?.trim() ?? '')
      .filter(Boolean)

    const textBlocks = textFromA11y.length > 0 ? textFromA11y : textFromVisual

    const ariaLabel =
      slide.querySelector('[aria-label*="Page"]')?.getAttribute('aria-label') ??
      a11yRegion?.querySelector('[aria-label*="Page"]')?.getAttribute('aria-label') ??
      null

    const contentRoot = (slide.querySelector('.GDnEHQ') as HTMLElement | null) ?? slide

    return {
      html: contentRoot.innerHTML,
      ariaLabel,
      images,
      textBlocks,
    }
  })
}

async function downloadImage(
  request: APIRequestContext,
  url: string,
  dest: string,
): Promise<number> {
  const response = await request.get(url, {
    headers: {
      Referer: 'https://www.canva.com/',
      Accept: 'image/*',
    },
  })

  if (!response.ok()) {
    throw new Error(`HTTP ${response.status()} for ${url.slice(0, 80)}…`)
  }

  const buffer = Buffer.from(await response.body())
  fs.writeFileSync(dest, buffer)
  return buffer.length
}

async function exportPage(
  page: Page,
  request: APIRequestContext,
  pageNum: number,
  force: boolean,
): Promise<PageMeta> {
  const dir = pageDir(pageNum)
  const htmlPath = path.join(dir, 'slide.html')
  const metaPath = path.join(dir, 'meta.json')
  const imagesDir = path.join(dir, 'images')

  if (pageIsExported(pageNum) && !force) {
    const existing = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as PageMeta
    console.log(`[canva] Skip page-${padPage(pageNum)} (exists)`)
    return existing
  }

  fs.mkdirSync(imagesDir, { recursive: true })

  const extract = await extractActiveSlide(page)
  if (!extract) {
    throw new Error(`No active slide found on page ${pageNum}`)
  }

  const uniqueImages = dedupeImages(extract.images)
  const uriToLocal = new Map<string, string>()
  const metaImages: PageMeta['images'] = []

  for (let i = 0; i < uniqueImages.length; i++) {
    const img = uniqueImages[i]!
    const ext = extFromUrl(img.src)
    const filename = `${String(i + 1).padStart(2, '0')}.${ext}`
    const localRel = `./images/${filename}`
    const localAbs = path.join(imagesDir, filename)

    const bytes = await downloadImage(request, img.src, localAbs)
    uriToLocal.set(canvaAssetUri(img.src), localRel)

    metaImages.push({
      file: `images/${filename}`,
      originalUrl: img.src,
      width: img.naturalWidth,
      height: img.naturalHeight,
      bytes,
    })

    console.log(`[canva]   img ${filename} (${Math.round(bytes / 1024)} KB)`)
  }

  const srcToLocal = new Map<string, string>()
  for (const img of extract.images) {
    const local = uriToLocal.get(canvaAssetUri(img.src))
    if (local) srcToLocal.set(img.src, local)
  }

  const html = rewriteHtmlWithLocalImages(extract.html, srcToLocal)
  fs.writeFileSync(htmlPath, html, 'utf8')

  const meta: PageMeta = {
    page: pageNum,
    ariaLabel: extract.ariaLabel,
    title: guessTitle(extract.textBlocks),
    textBlocks: extract.textBlocks,
    images: metaImages,
  }

  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')
  console.log(
    `[canva] page-${padPage(pageNum)} — ${metaImages.length} image(s), ${extract.textBlocks.length} text block(s)` +
      (meta.title ? ` — "${meta.title}"` : ''),
  )

  return meta
}

async function main(): Promise<void> {
  const opts = parseArgs()

  if (!Number.isFinite(opts.pages) || opts.pages < 1) {
    throw new Error('--pages must be a positive number')
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.mkdirSync(PROFILE_DIR, { recursive: true })

  console.log(`[canva] Profile: ${PROFILE_DIR}`)
  console.log(`[canva] Output:  ${OUTPUT_DIR}`)
  console.log(`[canva] Pages:   ${opts.start} → ${opts.start + opts.pages - 1} (${opts.mode} mode)`)

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: !opts.headed,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    args: ['--disable-blink-features=AutomationControlled'],
  })

  const page = context.pages()[0] ?? (await context.newPage())
  const request = context.request

  await page.goto('https://www.canva.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await dismissOverlays(page)

  if (opts.login) {
    console.log('\n[canva] Log in to Canva in the browser window.')
    console.log('[canva] Open the design if needed, then press Enter here to save the session.\n')
    await waitForEnter('Press Enter when logged in… ')
    if (opts.login && !opts.force) {
      await context.close()
      console.log('[canva] Session saved. Run: pnpm canva:export')
      return
    }
  }

  const manifest: PageMeta[] = []

  for (let pageNum = opts.start; pageNum < opts.start + opts.pages; pageNum++) {
    console.log(`[canva] Page ${pageNum}/${opts.start + opts.pages - 1}…`)

    await goToPage(page, pageNum, opts.mode)
    await dismissOverlays(page)
    await waitForActiveSlide(page, pageNum, opts.delayMs)

    const meta = await exportPage(page, request, pageNum, opts.force)
    manifest.push(meta)
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(manifest, null, 2), 'utf8')

  await context.close()

  console.log(`\n[canva] Done — ${manifest.length} pages → ${OUTPUT_DIR}`)
}

main().catch((err) => {
  console.error('[canva] Failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
