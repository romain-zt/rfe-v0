import type { Endpoint } from 'payload'
import { runSeed, type SeedLogLine } from '../seed/run-seed.ts'

export const seedResetEndpoint: Endpoint = {
  path: '/seed/reset',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const push = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
        }

        const onLog = (line: SeedLogLine) => {
          push({ type: 'log', ...line })
        }

        runSeed(req.payload, { onLog })
          .then(({ logs }) => {
            push({ type: 'done', success: true, total: logs.length })
            controller.close()
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : String(error)
            push({ type: 'done', success: false, error: message })
            controller.close()
          })
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  },
}
