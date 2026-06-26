import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidateFrontend } from './revalidateFrontend.ts'

async function scheduleSiteRevalidation() {
  try {
    const { after } = await import('next/server')
    after(async () => {
      await revalidateFrontend({ scope: 'site' })
    })
  } catch {
    await revalidateFrontend({ scope: 'site' })
  }
}

/** Full-site revalidation after any CMS write — keeps frontend in sync with admin edits. */
export const revalidateSiteAfterChange: CollectionAfterChangeHook = async () => {
  await scheduleSiteRevalidation()
}

export const revalidateSiteAfterDelete: CollectionAfterDeleteHook = async () => {
  await scheduleSiteRevalidation()
}

export const revalidateSiteGlobalAfterChange: GlobalAfterChangeHook = async () => {
  await scheduleSiteRevalidation()
}
