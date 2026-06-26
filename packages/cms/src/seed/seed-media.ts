import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Next/Vercel bundles this file under `.next/server/chunks`; __dirname is not `packages/cms/src/seed`. */
function resolvePublicRoot(): string {
  const fromEnv = process.env.RFE_SEED_PUBLIC_DIR
  if (fromEnv) return path.resolve(fromEnv)

  const cwdPublic = path.join(process.cwd(), 'public')
  if (fs.existsSync(path.join(cwdPublic, 'assets'))) return cwdPublic

  const monorepoPublic = path.resolve(__dirname, '../../../../apps/rfe-v0/public')
  if (fs.existsSync(path.join(monorepoPublic, 'assets'))) return monorepoPublic

  return cwdPublic
}

const ASSETS_BASE = resolvePublicRoot()

const IMAGE_PATHS = [
  '/assets/works/out-for-love.png',
  '/assets/works/ruby-falls.png',
  '/assets/works/sisters-daughter.png',
  '/assets/works/passing-love.png',
  '/assets/works/by-midnight.png',
  '/assets/works/double-dealer.png',
  '/assets/works/weekend-guests.png',
  '/assets/works/a-love-like-the-sun.png',
  '/assets/works/sunshine-sisters.png',
  '/assets/posters/TransElectric2.png',
  '/assets/works/rescue-of-jerusalem.png',
  '/assets/works/matador.png',
  '/assets/posters/HusbandFatherKiller.jpeg',
  '/assets/works/feather.png',
  '/assets/works/1-better.png',
  '/assets/works/high-life.png',
  '/assets/works/icky.png',
  '/assets/team/kara-lis.jpg',
  '/assets/team/kara-and-elisabeth.webp',
  '/assets/team/kara-and-elisabeth.jpg',
  '/assets/works/the-dating-app-killer.jpg',
  '/assets/works/murder-your-darlings.jpg',
  '/assets/works/if-you-tell.png',
  '/assets/works/if-anything-happens-to-me.png',
  '/assets/works/sleeping-angel.png',
  '/assets/works/in-not-so-loving-memory.png',
  '/assets/works/play-dead.png',
  '/assets/works/wife-stalker.png',
  '/assets/works/darkness-falls.png',
  '/assets/works/booth-pi.png',
  '/assets/works/iron-man.png',
  '/assets/posters/SusanPowell.jpg',
  '/assets/posters/a-dentist-to-die-for.png',
  '/assets/works/margret-stevie.png',
  '/assets/posters/Feather_Farah.png',
  '/assets/works/flower-girl.png',
  '/assets/posters/murder-in-law.png',
  '/assets/posters/GirlsCantPlayPool.jpg',
  '/assets/posters/Undefeated.jpg',
  '/assets/works/diamonds-and-deadlines.png',
  '/assets/works/twos-company.png',
  '/assets/posters/KoreanEspionage.png',
  '/assets/works/lobotomist-wife.png',
  '/assets/posters/relentless.png',
  '/assets/works/silent-echo.png',
  '/assets/posters/CallMeMadam.png',
  '/assets/posters/swap.png',
  '/assets/posters/LastDay_ReidBrothers.webp',
  '/assets/works/lie-detector.png',
  '/assets/posters/SouthernGothic.png',
  '/assets/posters/dispatch.png',
  '/assets/posters/horseplay.png',
  '/assets/posters/Nookietown.jpg',
  '/assets/team/liz-rohm-hero.png',
  '/assets/team/kara.png',
  '/assets/team/elisabeth-rohm-3.jpg',
  '/assets/portfolio-medias/elisabeth-1.png',
  '/assets/portfolio-medias/tournage-1.jpg',
  '/assets/portfolio-medias/tournage-2.jpg',
  '/assets/portfolio-medias/tournage-3.jpg',
  '/assets/portfolio-medias/tournage-4.jpg',
  '/assets/works/blade.png',
  '/assets/works/sick-puppy.png',
  '/assets/works/bombsquad.png',
  '/assets/works/the-chase-josephine-wentzel-story.png',
  '/assets/works/nasty-business.png',
  '/assets/works/flying-sideways.png',
  '/assets/works/blackwater-bayou.png',
  '/assets/works/the-correspondent.png',
  '/assets/works/augusta.jpg',
  '/assets/works/cuesta.png',
  '/assets/works/intent.png',
  '/assets/works/american-serial.png',
  '/assets/works/wife-on-the-edge.jpg',
  '/assets/works/icon.png',
  '/assets/works/ravenwood.png',
  '/assets/works/girl-in-the-bubble.png',
  '/assets/works/marrying-a-murderer.jpg',
  '/assets/works/butch-cassidys-millions.png',
  '/assets/works/justice-for-tupac.png',
  '/assets/works/trans-electric.png',
  '/assets/works/the-lobotomists-wife.png',
  '/assets/logos/channels/lifetime.png',
  '/assets/logos/channels/tf1-america.png',
  '/assets/logos/channels/ae-global-media.png',
  '/assets/logos/channels/fox.png',
  '/assets/logos/channels/disney-plus.png',
  '/assets/logos/channels/law-and-crime.png',
  '/assets/logos/channels/mattel.png',
  '/assets/logos/channels/nbc.png',
]

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  }
  return map[ext.toLowerCase()] || 'application/octet-stream'
}

export async function seedMedia(payload: Payload): Promise<Map<string, number>> {
  console.log('[seed-media] Starting media upload...')
  const mediaMap = new Map<string, number>()

  for (const imgPath of IMAGE_PATHS) {
    const fullPath = path.join(ASSETS_BASE, imgPath)

    if (!fs.existsSync(fullPath)) {
      console.warn(`[seed-media] Skipping missing file: ${imgPath}`)
      continue
    }

    const filename = path.basename(imgPath)
    const ext = path.extname(filename)

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]!
      mediaMap.set(imgPath, doc.id as number)
      console.log(`[seed-media] Already exists: ${filename}`)
      continue
    }

    const fileBuffer = fs.readFileSync(fullPath)
    try {
      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        },
        file: {
          data: fileBuffer,
          name: filename,
          mimetype: getMimeType(ext),
          size: fileBuffer.length,
        },
      })

      mediaMap.set(imgPath, doc.id as number)
      console.log(`[seed-media] Uploaded: ${filename}`)
    } catch (err) {
      console.error(`[seed-media] Failed to upload ${filename}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`[seed-media] Done. ${mediaMap.size} media items available.`)
  return mediaMap
}
