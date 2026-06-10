import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { caseStudies } from '@/lib/data/case-studies'
import { awards } from '@/lib/data/awards'

// ─── Static generation ───

export async function generateStaticParams() {
  return caseStudies.map(item => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = caseStudies.find(c => c.slug === slug)
  if (!item) return { title: '案例未找到' }

  return {
    title: `${item.title} | DesignMatch 成功案例`,
    description: item.description,
    openGraph: {
      title: `${item.title} — DesignMatch`,
      description: item.description,
    },
  }
}

// ─── Page ───

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = caseStudies.find(c => c.slug === slug)
  if (!item) notFound()

  const awardedAwards = item.awards
    .map(aw => ({ ...aw, award: awards.find(a => a.slug === aw.awardSlug) }))
    .filter(aw => aw.award)

  return (
    <div className="container-tight py-12 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <Link href="/case-studies" className="hover:text-[var(--text-primary)] transition-colors">成功案例</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">{item.title}</span>
      </div>

      {/* Back link */}
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        返回全部案例
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold tracking-tight">{item.designer[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-2">
              {item.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {item.designer} · {item.role} · {item.location}
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span key={tag} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Results summary */}
      <div className="border border-[var(--border)] bg-white p-6 mb-8">
        <h2 className="font-bold text-sm mb-4">成果概览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {item.results.map(r => (
            <div key={r.label} className="text-center">
              <div className="text-2xl font-bold mb-1">{r.value}</div>
              <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase">{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards won */}
      {awardedAwards.length > 0 && (
        <div className="border border-[var(--border)] bg-white p-6 mb-8">
          <h2 className="font-bold text-sm mb-3">获奖奖项</h2>
          <div className="flex flex-wrap gap-2">
            {awardedAwards.map(aw => aw.award && (
              <Link
                key={aw.awardSlug}
                href={`/awards/${aw.awardSlug}`}
                className="inline-flex items-center gap-1 border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                {aw.label}
                <ExternalLink className="h-3 w-3 text-[var(--text-tertiary)] group-hover:text-black transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Story content */}
      <article className="mb-10">
        {item.content.map((paragraph, i) => (
          <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </article>

      {/* CTA */}
      <div className="text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">和{item.designer}一样，找到属于你的奖项</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          免费评估你的作品，AI 智能匹配最适合的奖项
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
  )
}
