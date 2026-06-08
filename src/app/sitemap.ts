import { MetadataRoute } from 'next'
import { awards } from '@/lib/data/awards'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://intlaward.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${baseUrl}/awards`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/assess`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const awardPages = awards.map(award => ({
    url: `${baseUrl}/awards/${award.slug}`,
    lastModified: new Date(award.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...awardPages]
}
