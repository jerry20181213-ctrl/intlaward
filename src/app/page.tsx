import Link from 'next/link'
import { ArrowRight, Upload, Zap, Award, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    icon: Upload,
    number: '01',
    title: '上传作品',
    desc: '上传 1-5 张作品照片，填写项目信息。一分钟即可完成。',
  },
  {
    icon: Zap,
    number: '02',
    title: 'AI 智能分析',
    desc: 'DeepSeek AI 深度分析作品风格、创新性与功能性，精准匹配 30+ 奖项标准。',
  },
  {
    icon: Award,
    number: '03',
    title: '获取推荐',
    desc: 'Top 5 匹配结果，含评分、费用明细、截止日期与优化建议。',
  },
]

const AWARDS = [
  'iF 设计奖', '红点奖', 'G-Mark', "A' Design", 'D&AD',
  'IDA', 'Golden Pin', 'Red Star', 'Dezeen', 'DFA',
  'Core77', 'SPARK', 'Muse', 'DNA Paris', 'DIA',
]

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden border-b border-[var(--border)]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />

        <div className="container-tight relative z-10 w-full py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Kicker */}
            <div className="section-label justify-center mb-6">
              设计奖项匹配引擎
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              上传你的作品
              <br />
              <span className="text-[var(--text-secondary)]">找到最值得申报的设计奖</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
              覆盖 iF、Red Dot、G-Mark、A&apos; Design 等 30+ 国际奖项。
              <br className="hidden sm:block" />
              智能匹配，免费评估，让每件作品找到最合适的舞台。
            </p>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/assess"
                className="inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-3.5 rounded-none hover:bg-[#1a1a1a] transition-colors text-sm tracking-wide"
              >
                开始免费评估
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 border-2 border-black text-black font-semibold px-8 py-3.5 rounded-none hover:bg-black hover:text-white transition-colors text-sm tracking-wide"
              >
                合作机构
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-8 text-xs text-[var(--text-tertiary)] tracking-wider">
              已帮助 1,000+ 设计师找到匹配奖项 · 覆盖产品 / 视觉 / 空间 / 交互
            </p>
          </div>
        </div>

        {/* Decorative geometric element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]" />
      </section>

      {/* ─── How it works ─── */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="container-tight">
          <div className="section-label mb-4">流程</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-16">
            三步获得精准推荐
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <div className="step-number mb-4">{step.number}</div>
                <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mb-5">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Awards preview (inverted / dark) ─── */}
      <section className="section bg-black text-white">
        <div className="container-tight">
          <div className="section-label text-white/40 before:bg-white/20 after:bg-white/20 mb-4">
            覆盖奖项
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            30+ 国际设计大奖
          </h2>
          <p className="text-sm text-white/40 mb-12 max-w-md">
            从国际顶级到地区知名，覆盖主要设计领域与地区市场
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {AWARDS.map((name, i) => (
              <div
                key={i}
                className="border border-white/10 px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section">
        <div className="container-tight text-center">
          <div className="max-w-2xl mx-auto">
            <div className="section-label justify-center mb-4">开始使用</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              免费使用，每月 5 次评估
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
              登录后即可使用，无需任何费用。还可查看历史评估记录和优化建议。
            </p>
            <Link
              href="/assess"
              className="inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-3.5 rounded-none hover:bg-[#1a1a1a] transition-colors text-sm tracking-wide"
            >
              开始评估
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
