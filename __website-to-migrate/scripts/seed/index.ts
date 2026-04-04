import { getPayload } from 'payload'
import config from '@/payload.config'
import { seedAdmin } from './seed-admin'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding…')
  await seedAdmin(payload)
  console.log('Seed complete.')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
