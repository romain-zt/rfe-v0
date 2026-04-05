import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function seed() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@/payload.config')
  const { runSeed } = await import('@rfe/cms/seed')

  const payload = await getPayload({ config })
  const { logs } = await runSeed(payload)
  console.log(`Done (${logs.length} log lines).`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
