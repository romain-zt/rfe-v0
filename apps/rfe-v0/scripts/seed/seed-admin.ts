import type { Payload } from 'payload'

export async function seedAdmin(payload: Payload): Promise<void> {
  const email = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@rfe.dev'
  const password = process.env.PAYLOAD_ADMIN_PASSWORD || 'admin123'

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password },
  })

  console.log(`Admin user created: ${email}`)
}
