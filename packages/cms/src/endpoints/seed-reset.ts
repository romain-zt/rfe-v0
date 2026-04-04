import type { Endpoint } from 'payload'
import { runSeed } from '../seed/run-seed'

export const seedResetEndpoint: Endpoint = {
  path: '/seed/reset',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      await runSeed(req.payload)
      return Response.json({ success: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('[seed/reset] Error:', message)
      return Response.json({ success: false, error: message }, { status: 500 })
    }
  },
}
