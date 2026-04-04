import { getPayload } from 'payload'
import config from '@/payload.config'
import { runSeed } from '@rfe/cms/seed'

async function seed() {
  const payload = await getPayload({ config })
  await runSeed(payload)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
