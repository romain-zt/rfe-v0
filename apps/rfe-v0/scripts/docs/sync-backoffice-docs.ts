/**
 * Sync back-office guide to public/ and optionally export a PDF.
 *
 * Usage (from apps/rfe-v0):
 *   pnpm docs:backoffice          # sync to public/docs/backoffice/
 *   pnpm docs:backoffice:pdf      # sync + generate PDF
 *
 * Public URL after deploy:
 *   https://www.rohmfeiferentertainment.net/docs/backoffice/
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../../..')
const SRC = path.join(ROOT, 'docs/backoffice')
const DEST = path.join(ROOT, 'apps/rfe-v0/public/docs/backoffice')
const PDF_NAME = 'backoffice-guide.pdf'
const PUBLIC_URL = 'https://www.rohmfeiferentertainment.net/docs/backoffice/'

const COPY_NAMES = ['index.html', 'screenshots']

function syncToPublic() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`Source not found: ${SRC}`)
  }

  fs.mkdirSync(DEST, { recursive: true })

  for (const name of COPY_NAMES) {
    const from = path.join(SRC, name)
    const to = path.join(DEST, name)

    if (!fs.existsSync(from)) {
      console.warn(`Skipping missing: ${from}`)
      continue
    }

    fs.cpSync(from, to, { recursive: true, force: true })
    console.log(`Copied ${name}`)
  }

  const pdfSrc = path.join(SRC, PDF_NAME)
  if (fs.existsSync(pdfSrc)) {
    fs.copyFileSync(pdfSrc, path.join(DEST, PDF_NAME))
    console.log(`Copied ${PDF_NAME}`)
  }
}

async function generatePdf() {
  const htmlPath = path.join(DEST, 'index.html')
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Run sync first — missing ${htmlPath}`)
  }

  const pdfDest = path.join(SRC, PDF_NAME)
  const pdfPublic = path.join(DEST, PDF_NAME)

  console.log('Generating PDF (this may take a minute — large screenshots)...')

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' })
  await page.pdf({
    path: pdfDest,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' },
  })
  await browser.close()

  fs.copyFileSync(pdfDest, pdfPublic)
  console.log(`PDF: ${pdfDest}`)
  console.log(`PDF (public): ${pdfPublic}`)
}

async function main() {
  const withPdf = process.argv.includes('--pdf')

  syncToPublic()
  console.log(`\nLive URL: ${PUBLIC_URL}`)

  if (withPdf) {
    await generatePdf()
    console.log(`PDF URL: ${PUBLIC_URL}${PDF_NAME}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
