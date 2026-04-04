import type { Payload } from 'payload'
import { seedAdmin } from './seed-admin'
import { seedMedia } from './seed-media'
import { seedWorks } from './seed-works'
import { seedTeam } from './seed-team'
import { seedPress } from './seed-press'
import { seedSiteConfig } from './seed-site-config'
import { seedNavigation } from './seed-navigation'

export async function runSeed(payload: Payload): Promise<void> {
  console.log('[seed] Starting full seed...')
  await seedAdmin(payload)
  const mediaMap = await seedMedia(payload)
  await seedWorks(payload, mediaMap)
  await seedTeam(payload, mediaMap)
  await seedPress(payload)
  await seedSiteConfig(payload)
  await seedNavigation(payload)
  console.log('[seed] Full seed complete.')
}
