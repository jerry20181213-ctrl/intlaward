import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AwardCompare } from '@/components/compare/AwardCompare'

export const metadata = {
  title: '奖项对比 | DesignMatch',
  description: '国际设计奖项对比工具 — 对比红点奖、iF设计奖、G-Mark、A\' Design等30+奖项的费用、截止日期、难度和评审标准，帮你选择最合适的奖项。',
  openGraph: {
    title: '奖项对比 — DesignMatch',
    description: '在线对比30+国际设计奖项的费用、截止日期、难度和评审标准',
  },
}

export default function ComparePage() {
  return (
    <div className="container-tight py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">奖项对比</span>
      </div>

      {/* Back link */}
      <Link
        href="/awards"
        className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        返回全部奖项
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          奖项对比
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          并排对比国际设计奖项的费用、截止日期、难度和评审标准，帮你找到最适合申报的奖项组合。
        </p>
      </header>

      {/* Compare tool — needs Suspense because it uses useSearchParams */}
      <Suspense fallback={<div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-tertiary)]">加载中…</div>}>
        <AwardCompare />
      </Suspense>
    </div>
  )
}
