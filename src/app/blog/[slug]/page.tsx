import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { articles } from '@/lib/data/articles'
import { awards } from '@/lib/data/awards'
import { formatDate } from '@/lib/utils'

// ─── Static generation ───

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) return { title: '文章未找到' }

  return {
    title: `${article.title} | DesignMatch`,
    description: article.description,
    openGraph: {
      title: `${article.title} — DesignMatch`,
      description: article.description,
    },
  }
}

// ─── Page ───

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  const relatedAwardsList = article.relatedAwards
    ?.map(slug => awards.find(a => a.slug === slug))
    .filter(Boolean) ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'DesignMatch',
    },
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-tight py-12 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">博客</Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{article.title}</span>
        </div>

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          返回博客列表
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)] uppercase tracking-wider">
              {article.categoryLabel}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {formatDate(article.publishedAt)}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {article.readingTime} 分钟阅读
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-4">
            {article.title}
          </h1>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {article.description}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {article.tags.map(tag => (
                <span key={tag} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article content */}
        <article className="prose-custom">
          {article.content.map((section, i) => (
            <section key={i} className="mb-8">
              {section.title && (
                <h2 className="text-lg font-bold tracking-tight mb-3 mt-8 first:mt-0">
                  {section.title}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {section.list && section.list.length > 0 && (
                <ul className="space-y-2 my-3">
                  {section.list.map((item, k) => (
                    <li key={k} className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 relative">
                      <span className="absolute left-0 top-0 text-[var(--text-tertiary)]">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.afterList && section.afterList.length > 0 && section.afterList.map((p, j) => (
                <p key={`after-${j}`} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* Related awards */}
        {relatedAwardsList.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h3 className="font-bold text-sm mb-4">相关奖项</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedAwardsList.map(award => award && (
                <Link
                  key={award.id}
                  href={`/awards/${award.slug}`}
                  className="border border-[var(--border)] p-4 hover:bg-[var(--bg-secondary)] transition-colors group"
                >
                  <div className="font-bold text-sm mb-1 group-hover:underline">{award.nameCn}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">{award.name}</div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--text-tertiary)]">
                    <span>¥{award.fee.professional} 起</span>
                    <span className="w-px h-2.5 bg-[var(--border)]" />
                    <span>难度 {'★'.repeat(award.difficulty)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
          <h2 className="font-bold text-sm mb-2">找到心仪的奖项了？</h2>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            上传你的作品，AI 智能匹配最适合的奖项
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-2.5 text-xs tracking-wide hover:bg-[#1a1a1a] transition-colors"
          >
            开始免费评估
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </>
  )
}
