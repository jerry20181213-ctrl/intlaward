import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { awards, getAwardById } from '@/lib/data/awards'
import { Award } from '@/lib/types'
import { formatCurrency, daysUntil } from '@/lib/utils'

// ─── Static generation ───

export async function generateStaticParams() {
  return awards.map((award) => ({
    slug: award.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const award = awards.find(a => a.slug === slug)
  if (!award) return { title: '奖项未找到' }

  return {
    title: `${award.nameCn} (${award.name}) — 奖项详情 | DesignMatch`,
    description: `${award.nameCn}申报指南：费用${award.fee.professional}元起，获奖率${award.winRate}%，难度${'★'.repeat(award.difficulty)}。${award.description.slice(0, 80)}`,
    openGraph: {
      title: `${award.nameCn} — DesignMatch`,
      description: award.description.slice(0, 120),
    },
  }
}

// ─── Category labels ───

const CATEGORY_MAP: Record<string, string> = {
  product: '产品设计',
  visual: '视觉传达',
  space: '空间设计',
  interaction: '交互设计',
  service: '服务设计',
  fashion: '时尚设计',
  concept: '概念设计',
}

const DIM_LABELS: Record<string, string> = {
  innovation: '创新性',
  aesthetics: '美学',
  functionality: '功能性',
  craftsmanship: '工艺',
  socialImpact: '社会影响',
  commercial: '商业价值',
}

// ─── Page ───

export default async function AwardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const award = awards.find(a => a.slug === slug)
  if (!award) notFound()

  const days = award.deadlines.regular ? daysUntil(award.deadlines.regular) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: award.nameCn,
    description: award.description,
    startDate: award.deadlines.regular,
    offers: {
      '@type': 'Offer',
      price: award.fee.professional,
      priceCurrency: 'CNY',
    },
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-tight py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/awards" className="hover:text-[var(--text-primary)] transition-colors">奖项</Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{award.nameCn}</span>
        </div>

        {/* Back link */}
        <Link href="/awards" className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
          <ArrowLeft className="h-3 w-3" />
          返回全部奖项
        </Link>

        {/* Header */}
        <div className="border border-[var(--border)] bg-white p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{award.nameCn}</h1>
                <a
                  href={award.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mt-1"
                >
                  官网 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{award.name}</p>
            </div>
            <div className="flex items-center gap-4 text-center flex-shrink-0">
              <div>
                <div className="text-2xl font-bold">{award.winRate}%</div>
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mt-0.5">获奖率</div>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div>
                <div className="text-2xl font-bold">{'★'.repeat(award.difficulty)}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mt-0.5">难度</div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {award.description}
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-light)] mb-6">
          <InfoCard label="报名费" value={award.fee.student !== undefined ? `专业 ${formatCurrency(award.fee.professional)} / 学生 ${formatCurrency(award.fee.student)}` : `${formatCurrency(award.fee.professional)} 起`} />
          <InfoCard label="截止日期" value={award.deadlines.regular ? `${award.deadlines.regular} (${days !== null ? `${days}天后` : '已截止'})` : '待定'} urgent={days !== null && days < 30} />
          <InfoCard label="适用类别" value={award.categories.map(c => CATEGORY_MAP[c] || c).join('、')} />
          <InfoCard label="学生通道" value={award.studentTrack ? '支持学生参赛' : '仅限专业组'} />
        </div>

        {award.deadlines.early && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border-light)] mb-6">
            <InfoCard label="早鸟截止" value={award.deadlines.early || '-'} />
            <InfoCard label="常规截止" value={award.deadlines.regular || '-'} />
            <InfoCard label="晚鸟截止" value={award.deadlines.late || '-'} />
          </div>
        )}

        {/* Judging criteria */}
        <div className="border border-[var(--border)] bg-white p-6 mb-6">
          <h2 className="font-bold text-sm mb-4">评审标准权重</h2>
          <div className="space-y-3">
            {(Object.entries(award.judgingCriteria) as [string, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([key, weight]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)]">{DIM_LABELS[key] || key}</span>
                    <span className="font-semibold">{Math.round(weight * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-tertiary)]">
                    <div className="h-full bg-black" style={{ width: `${weight * 100}%` }} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Style preferences */}
        {award.stylePreferences && award.stylePreferences.length > 0 && (
          <div className="border border-[var(--border)] bg-white p-6 mb-6">
            <h2 className="font-bold text-sm mb-3">风格偏好</h2>
            <div className="flex flex-wrap gap-2">
              {award.stylePreferences.map(style => (
                <span key={style} className="text-[11px] border border-[var(--border)] px-2.5 py-1 text-[var(--text-secondary)]">
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fee details */}
        {award.fee.lateSurcharge && (
          <div className="border border-[var(--border)] bg-white p-6 mb-6">
            <h2 className="font-bold text-sm mb-2">费用说明</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              晚鸟附加费：{formatCurrency(award.fee.lateSurcharge)}
              {award.fee.awardPackage ? ` · 获奖者权益包：${formatCurrency(award.fee.awardPackage)}` : ''}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
          <h2 className="font-bold text-sm mb-2">想知道你的作品是否适合 {award.nameCn}？</h2>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            AI 智能分析作品风格与奖项偏好，免费获取匹配度评分
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

function InfoCard({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className="bg-white p-4">
      <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-1">{label}</div>
      <div className={`text-sm font-medium ${urgent ? 'text-black' : ''}`}>{value}</div>
    </div>
  )
}
