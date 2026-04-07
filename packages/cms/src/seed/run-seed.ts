import type { Payload } from 'payload'
import { seedAdmin } from './seed-admin.ts'
import { seedMedia } from './seed-media.ts'
import { seedWorks } from './seed-works.ts'
import { seedWorksGroups } from './seed-works-groups.ts'
import { seedTeam } from './seed-team.ts'
import { seedPress } from './seed-press.ts'
import { seedSiteConfig } from './seed-site-config.ts'
import { seedNavigation } from './seed-navigation.ts'
import { seedForms } from './seed-forms.ts'
import { seedPages } from './seed-pages.ts'
import { revalidateFrontend } from '../utilities/revalidateFrontend.ts'

export type SeedLogLevel = 'log' | 'warn' | 'error'
export type SeedLogLine = { ts: string; level: SeedLogLevel; text: string }
export type OnSeedLog = (line: SeedLogLine) => void

function createLogger(onLog?: OnSeedLog) {
  const lines: SeedLogLine[] = []
  const stamp = () => new Date().toISOString().slice(11, 19)

  const emit = (level: SeedLogLevel, args: unknown[]) => {
    const text = args
      .map((a) => {
        if (a instanceof Error) return a.stack || a.message
        if (typeof a === 'object' && a !== null) {
          try { return JSON.stringify(a) } catch { return String(a) }
        }
        return String(a)
      })
      .join(' ')
    const line: SeedLogLine = { ts: stamp(), level, text }
    lines.push(line)
    onLog?.(line)
  }

  return {
    log: (...args: unknown[]) => emit('log', args),
    warn: (...args: unknown[]) => emit('warn', args),
    error: (...args: unknown[]) => emit('error', args),
    getLines: () => lines,
  }
}

export type RunSeedResult = { logs: string[] }

export async function runSeed(
  payload: Payload,
  opts?: { onLog?: OnSeedLog },
): Promise<RunSeedResult> {
  const logger = createLogger(opts?.onLog)
  logger.log('[seed] Starting full seed...')

  try {
    const prodMigrations = (payload.db as Record<string, unknown>).prodMigrations as
      | Parameters<typeof payload.db.migrate>[0]['migrations']
      | undefined
    if (prodMigrations?.length) {
      logger.log('[seed] Running pending DB migrations...')
      await payload.db.migrate({ migrations: prodMigrations })
    }
    await seedAdmin(payload)
    const mediaMap = await seedMedia(payload)
    await seedWorks(payload, mediaMap)
    await seedWorksGroups(payload)
    await seedTeam(payload, mediaMap)
    await seedPress(payload)
    await seedSiteConfig(payload)
    await seedNavigation(payload)
    const { contactFormId } = await seedForms(payload)
    await seedPages(payload, { contactFormId, mediaMap })
    logger.log('[seed] Full seed complete.')
    await revalidateFrontend({ collection: 'pages', slug: 'home' })
    await revalidateFrontend({ collection: 'pages', slug: 'contact' })
    return { logs: logger.getLines().map((l) => `${l.ts} [${l.level}] ${l.text}`) }
  } catch (e) {
    logger.error('[seed] Failed:', e)
    const logs = logger.getLines().map((l) => `${l.ts} [${l.level}] ${l.text}`)
    throw Object.assign(e instanceof Error ? e : new Error(String(e)), { logs })
  }
}
