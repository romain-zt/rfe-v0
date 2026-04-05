import type { Endpoint } from 'payload'
import { runSeed } from '../seed/run-seed.ts'

export const seedResetEndpoint: Endpoint = {
  path: '/seed/reset',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { logs } = await runSeed(req.payload)
      return Response.json({ success: true, logs })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const logs =
        error && typeof error === 'object' && 'logs' in error && Array.isArray((error as { logs: unknown }).logs)
          ? ((error as { logs: string[] }).logs as string[])
          : []
      console.error('[seed/reset] Error:', message)
      return Response.json({ success: false, error: message, logs }, { status: 500 })
    }
  },
}
