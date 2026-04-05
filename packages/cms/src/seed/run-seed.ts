import type { Payload } from 'payload'
import { seedAdmin } from './seed-admin.ts'
import { seedMedia } from './seed-media.ts'
import { seedWorks } from './seed-works.ts'
import { seedWorksGroups } from './seed-works-groups.ts'
import { seedTeam } from './seed-team.ts'
import { seedPress } from './seed-press.ts'
import { seedSiteConfig } from './seed-site-config.ts'
import { seedNavigation } from './seed-navigation.ts'
import { seedPages } from './seed-pages.ts'

export async function runSeed(payload: Payload): Promise<void> {
  console.log('[seed] Starting full seed...')
  await seedAdmin(payload)
  const mediaMap = await seedMedia(payload)
  await seedWorks(payload, mediaMap)
  await seedWorksGroups(payload)
  await seedTeam(payload, mediaMap)
  await seedPress(payload)
  await seedSiteConfig(payload)
  await seedNavigation(payload)
  await seedPages(payload)
  console.log('[seed] Full seed complete.')
}
