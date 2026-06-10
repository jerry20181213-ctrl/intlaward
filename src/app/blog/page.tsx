import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { articles } from '@/lib/data/articles'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: '设计奖博客 | DesignMatch — 申报指南与行业资讯',
  description: '国际设计奖项申报指南、对比分析、费用汇总与行业资讯。覆盖 iF、Red Dot、G-Mark、A\' Design 等 30+ 奖项的深度内容。',
}

export default function BlogPage() {
  const categories = Array.from(new Set(articles.map(a => a.categoryLabel)))

  return (
    <div className="container-tight py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-black" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
            博客
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          设计奖项指南
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          申报攻略、对比分析、行业干货 — 助你做出更明智的奖项选择
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map(cat => (
          <span key={cat} className="tag text-[10px]">{cat}</span>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)]">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group bg-white p-6 hover:bg-[var(--bg-secondary)] transition-colors flex flex-col"
          >
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)] uppercase tracking-wider">
                {article.categoryLabel}
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)]">{article.readingTime} 分钟阅读</span>
            </div>

            {/* Title */}
            <h2 className="font-bold text-sm group-hover:underline mb-2 leading-snug flex-shrink-0">
              {article.title}
            </h2>

            {/* Description */}
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 flex-1 line-clamp-3">
              {article.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-light)]">
              <span className="text-[10px] text-[var(--text-tertiary)]">
                {formatDate(article.publishedAt)}
              </span>
              <ArrowRight className="h-3 w-3 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">不确定哪个奖项适合你？</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          上传作品，AI 智能匹配最适合的奖项
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
