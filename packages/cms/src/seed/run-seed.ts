import type { Payload } from 'payload'
import { seedAdmin } from './seed-admin'

export async function runSeed(payload: Payload): Promise<void> {
  console.log('Seeding...')
  await seedAdmin(payload)
  console.log('Seed complete.')
}
