import type { Payload } from 'payload'

export async function seedAdmin(payload: Payload): Promise<void> {
  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;

  if (!email || !password) {
    console.info('No admin user to seed. Skipping...')
    return;
  }

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
