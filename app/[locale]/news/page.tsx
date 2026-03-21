import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
// import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
// import NewsContent from './NewsContent'
import { redirect } from 'next/navigation'

export const metadata = generatePageMetadata('news')

export default function NewsPage() {
  redirect('/')

  // return (
  //   <>
  //     <WebPageJsonLd page="news" url={`${SITE_CONFIG.url}/news`} />
  //     <BreadcrumbJsonLd
  //       items={[
  //         { name: 'Home', url: SITE_CONFIG.url },
  //         { name: 'News', url: `${SITE_CONFIG.url}/news` },
  //       ]}
  //     />
  //     <NewsContent />
  //   </>
  // )
}
