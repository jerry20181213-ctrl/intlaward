import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DeadlineTimeline } from '@/components/awards/DeadlineTimeline'

export const metadata = {
  title: '设计奖截止日期日历 | DesignMatch',
  description: '国际设计奖项截止日期一览 — 查看红点奖、iF设计奖、G-Mark、A\' Design等30+奖项的早鸟、常规和晚鸟截止日期，按紧急程度排序。',
  openGraph: {
    title: '设计奖截止日期日历 — DesignMatch',
    description: '查看30+国际设计奖项的最新截止日期，按紧急程度筛选，不再错过申报时机。',
  },
}

export default function DeadlinesPage() {
  return (
    <div className="container-tight py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <Link href="/awards" className="hover:text-[var(--text-primary)] transition-colors">奖项</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">截止日期</span>
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
          截止日期日历
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          按紧急程度浏览所有国际设计奖项的截止日期，帮你合理规划申报时间，不错过任何重要截点。
        </p>
      </header>

      <Suspense fallback={<div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-tertiary)]">加载中…</div>}>
        <DeadlineTimeline />
      </Suspense>
    </div>
  )
}
