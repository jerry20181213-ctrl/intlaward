import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { faqItems } from '@/lib/data/faq'

export const metadata = {
  title: '常见问题 | DesignMatch — AI 设计奖项匹配工具',
  description: '关于 DesignMatch AI 设计奖项匹配工具的常见问题解答，涵盖使用方法、奖项数据、匹配准确率等问题。',
}

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="container-tight py-16 max-w-3xl mx-auto">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-black" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
            FAQ
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          常见问题
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          关于 DesignMatch 的常见疑问解答
        </p>
      </div>

      {/* FAQ items */}
      <div className="space-y-px bg-[var(--border-light)]">
        {faqItems.map((item) => (
          <details
            key={item.id}
            className="group bg-white [&[open]]:bg-[var(--bg-secondary)] transition-colors"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[var(--bg-secondary)] transition-colors">
              <span className="text-sm font-medium pr-4">{item.question}</span>
              <span className="text-[var(--text-tertiary)] text-lg leading-none transition-transform group-open:rotate-45 flex-shrink-0">
                +
              </span>
            </summary>
            <div className="px-5 pb-5">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">还有其他问题？</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          试用 AI 匹配工具，体验一下
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
