export type PayloadResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export type PayloadClient = {
  find: <T = Record<string, unknown>>(
    collection: string,
    query?: Record<string, string>
  ) => Promise<PayloadResponse<T>>
  findBySlug: <T = Record<string, unknown>>(
    collection: string,
    slug: string
  ) => Promise<T | null>
  findGlobal: <T = Record<string, unknown>>(slug: string) => Promise<T>
}

export function createPayloadClient(baseUrl: string): PayloadClient {
  const headers = { 'Content-Type': 'application/json' }

  return {
    find: async <T = Record<string, unknown>>(
      collection: string,
      query: Record<string, string> = {}
    ): Promise<PayloadResponse<T>> => {
      const params = new URLSearchParams(query)
      const res = await fetch(`${baseUrl}/api/${collection}?${params}`, {
        headers,
        next: { revalidate: 60 },
      })
      if (!res.ok) throw new Error(`Failed to fetch ${collection}: ${res.status}`)
      return res.json()
    },

    findBySlug: async <T = Record<string, unknown>>(
      collection: string,
      slug: string
    ): Promise<T | null> => {
      const params = new URLSearchParams({
        'where[slug][equals]': slug,
        limit: '1',
      })
      const res = await fetch(`${baseUrl}/api/${collection}?${params}`, {
        headers,
        next: { revalidate: 60 },
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.docs?.[0] ?? null
    },

    findGlobal: async <T = Record<string, unknown>>(slug: string): Promise<T> => {
      const res = await fetch(`${baseUrl}/api/globals/${slug}`, {
        headers,
        next: { revalidate: 60 },
      })
      if (!res.ok) throw new Error(`Failed to fetch global ${slug}: ${res.status}`)
      return res.json()
    },
  }
}
