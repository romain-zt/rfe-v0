import { registerRevalidator } from '@rfe/cms/utilities/revalidateFrontend'

registerRevalidator(async () => {
  const { revalidateSitePaths } = await import('./revalidate-paths')
  await revalidateSitePaths()
})
