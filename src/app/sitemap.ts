import { MetadataRoute } from 'next'
import { awards } from '@/lib/data/awards'
import { articles } from '@/lib/data/articles'
import { caseStudies } from '@/lib/data/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://intlaward.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${baseUrl}/awards`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/awards/deadlines`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/assess`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/saved`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const blogPages = articles.map(article => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const awardPages = awards.map(award => ({
    url: `${baseUrl}/awards/${award.slug}`,
    lastModified: new Date(award.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const caseStudyPages = caseStudies.map(item => ({
    url: `${baseUrl}/case-studies/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...blogPages, ...awardPages, ...caseStudyPages]
}
