import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { caseStudies } from '@/lib/data/case-studies'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: '成功案例 | DesignMatch',
  description: '看看设计师们如何通过 DesignMatch 找到最适合的奖项，从红点奖到 G-Mark，真实获奖者的故事。',
  openGraph: {
    title: '成功案例 — DesignMatch',
    description: '真实设计师的奖项申报故事和获奖经验分享',
  },
}

export default function CaseStudiesPage() {
  return (
    <div className="container-tight py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">成功案例</span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          成功案例
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          真实设计师和设计团队的故事——看他们如何通过 DesignMatch 找到最适合的奖项，获得国际认可。
        </p>
      </header>

      {/* Grid */}
      <div className="space-y-px bg-[var(--border-light)]">
        {caseStudies.map(item => (
          <Link
            key={item.id}
            href={`/case-studies/${item.slug}`}
            className="block bg-white p-6 sm:p-8 hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              {/* Avatar placeholder */}
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg-tertiary)] flex items-center justify-center">
                <span className="text-lg font-bold tracking-tight">{item.designer[0]}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base mb-1 group-hover:underline">{item.title}</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  {item.designer} · {item.role} · {item.location}
                </p>
                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Result chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.results.map(r => (
                    <span key={r.label} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-secondary)]">
                      {r.label}: {r.value}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">你也想成为下一个成功案例？</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          免费评估你的作品，找到最适合的奖项
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
