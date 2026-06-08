import Link from 'next/link'
import { awards } from '@/lib/data/awards'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: '全部奖项 | DesignMatch — AI 设计奖项匹配工具',
  description: '浏览 iF、Red Dot、G-Mark 等 30+ 国际设计奖项，查看评审标准、费用、截止日期等详细信息。',
}

export default function AwardsPage() {
  // Group awards by category
  const categories = [
    { key: 'product', label: '产品设计' },
    { key: 'visual', label: '视觉传达' },
    { key: 'space', label: '空间设计' },
    { key: 'interaction', label: '交互设计' },
    { key: 'service', label: '服务设计' },
    { key: 'fashion', label: '时尚设计' },
    { key: 'concept', label: '概念设计' },
  ]

  return (
    <div className="container-tight py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-black" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
            奖项
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          全部设计奖项
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          覆盖 {awards.length} 个国际设计大奖，数据持续更新
        </p>
      </div>

      {/* Awards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)]">
        {awards.map((award) => (
          <Link
            key={award.id}
            href={`/awards/${award.slug}`}
            className="group bg-white p-5 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm group-hover:underline">{award.nameCn}</h3>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{award.name}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
              {award.description}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
              <span>¥{award.fee.professional} 起</span>
              <span className="w-px h-3 bg-[var(--border)]" />
              <span>难度 {'★'.repeat(award.difficulty)}</span>
              <span className="w-px h-3 bg-[var(--border)]" />
              <span>获奖率 {award.winRate}%</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {award.categories.map(cat => {
                const label = categories.find(c => c.key === cat)?.label || cat
                return (
                  <span key={cat} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
                    {label}
                  </span>
                )
              })}
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">不确定哪个奖项适合你？</h2>
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
  )
}
