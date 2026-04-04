import { redirect } from 'next/navigation'
import type { Language } from '@/lib/i18n/types'

type Props = {
  params: Promise<{ locale: Language }>
}

export default async function OurTeamPage({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}/about`)
}
