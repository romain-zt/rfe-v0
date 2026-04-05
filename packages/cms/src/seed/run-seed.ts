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

function attachLogCapture(): () => string[] {
  const lines: string[] = []
  const stamp = () => new Date().toISOString().slice(11, 19)

  const push = (level: string, args: unknown[]) => {
    const text = args
      .map((a) => {
        if (a instanceof Error) return a.stack || a.message
        if (typeof a === 'object' && a !== null) {
          try {
            return JSON.stringify(a)
          } catch {
            return String(a)
          }
        }
        return String(a)
      })
      .join(' ')
    lines.push(`${stamp()} [${level}] ${text}`)
  }

  const origLog = console.log.bind(console)
  const origWarn = console.warn.bind(console)
  const origErr = console.error.bind(console)

  console.log = (...args: unknown[]) => {
    push('log', args)
    origLog(...args)
  }
  console.warn = (...args: unknown[]) => {
    push('warn', args)
    origWarn(...args)
  }
  console.error = (...args: unknown[]) => {
    push('error', args)
    origErr(...args)
  }

  return () => {
    console.log = origLog
    console.warn = origWarn
    console.error = origErr
    return lines
  }
}

export type RunSeedResult = { logs: string[] }

export async function runSeed(payload: Payload): Promise<RunSeedResult> {
  const detach = attachLogCapture()
  console.log('[seed] Starting full seed...')
  try {
    await seedAdmin(payload)
    const mediaMap = await seedMedia(payload)
    await seedWorks(payload, mediaMap)
    await seedWorksGroups(payload)
    await seedTeam(payload, mediaMap)
    await seedPress(payload)
    await seedSiteConfig(payload)
    await seedNavigation(payload)
    const { contactFormId } = await seedForms(payload)
    await seedPages(payload, { contactFormId })
    console.log('[seed] Full seed complete.')
    await revalidateFrontend({ collection: 'pages', slug: 'home' })
    await revalidateFrontend({ collection: 'pages', slug: 'contact' })
    return { logs: detach() }
  } catch (e) {
    console.error('[seed] Failed:', e)
    const logs = detach()
    throw Object.assign(e instanceof Error ? e : new Error(String(e)), { logs })
  }
}
