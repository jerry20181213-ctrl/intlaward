import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-[var(--border)]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />

        {/* Decorative — large number */}
        <div className="absolute top-12 right-12 text-[180px] sm:text-[280px] font-bold text-black/[0.02] select-none leading-none pointer-events-none font-sans">
          30+
        </div>

        <div className="container-tight relative z-10 w-full py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 mb-8">
              <span className="w-1.5 h-1.5 bg-black" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
                AI 设计奖项匹配工具
              </span>
            </div>

            {/* Main heading — large, impactful */}
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.05] tracking-tight mb-6">
              上传作品
              <br />
              <span className="text-[var(--text-secondary)]">找到最匹配的设计奖</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
              覆盖 iF、Red Dot、G-Mark、A&apos; Design 等 30+ 国际奖项。
              <br />
              AI 智能分析你的作品风格与水准，免费推荐最适合的奖项。
            </p>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/assess"
                className="group inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-3.5 text-sm tracking-wide hover:bg-[#1a1a1a] transition-all"
              >
                开始免费评估
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/awards"
                className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text-primary)] font-medium px-8 py-3.5 text-sm tracking-wide hover:border-black transition-colors"
              >
                浏览奖项
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12 text-center">
              <div>
                <div className="text-2xl font-bold">30+</div>
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase mt-1">奖项覆盖</div>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase mt-1">设计领域</div>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase mt-1">免费次数/月</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]" />
      </section>

      {/* ─── How it works ─── */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="section-label justify-center mb-4">流程</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              三步获得推荐
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-4xl mx-auto">
            {[
              { num: '01', label: '上传作品', desc: '上传 3-5 张作品照片，填写项目信息。一分钟即可完成。' },
              { num: '02', label: 'AI 智能分析', desc: 'DeepSeek AI 深度分析作品风格、创新性与功能性，精准匹配 30+ 奖项标准。' },
              { num: '03', label: '获取推荐', desc: 'Top 5 匹配结果，含评分、费用明细、截止日期与优化建议。' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="step-number mb-4">{step.num}</div>
                <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mx-auto mb-5 bg-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />}
                    {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />}
                    {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />}
                  </svg>
                </div>
                <h3 className="text-base font-bold mb-2">{step.label}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Awards grid (dark) ─── */}
      <section className="section bg-black text-white">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-white" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/40">
                覆盖奖项
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              全球主要设计大奖
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              从国际顶级到地区知名，覆盖主要设计领域与市场
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white/[0.06]">
            {[
              'iF 设计奖', '红点奖', 'G-Mark', "A' Design", 'D&AD',
              'IDA', 'Golden Pin', 'Red Star', 'Dezeen', 'DFA',
              'Core77', 'SPARK', 'Muse', 'DNA Paris', 'DIA',
            ].map((name, i) => (
              <div
                key={i}
                className="bg-black px-4 py-4 text-sm font-medium text-white/50 hover:bg-white/[0.03] hover:text-white transition-colors"
              >
                {name}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/awards"
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors tracking-wider uppercase"
            >
              查看全部奖项
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why use this ─── */}
      <section className="section">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="section-label justify-center mb-4">为什么选择</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              更聪明的奖项策略
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: '30+ 奖项数据库', desc: '覆盖产品、视觉、空间、交互等 6 大领域，每项含评审标准、费用、截止日期、获奖率数据。' },
              { title: 'AI 精准匹配', desc: '分析你的作品风格、创新性与功能性，与每个奖项的评审偏好进行多维度匹配。' },
              { title: '免费使用', desc: '每月 5 次免费评估，零成本获取数据驱动的奖项推荐策略。' },
              { title: '优化建议', desc: '每个推荐结果附带针对性优化建议，告诉你如何调整呈现方式来提高获奖概率。' },
            ].map((item, i) => (
              <div key={i} className="border border-[var(--border)] p-6 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="w-7 h-7 border border-[var(--border)] flex items-center justify-center mb-4">
                  <span className="text-[10px] font-mono font-bold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section bg-black text-white">
        <div className="container-tight text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-white" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/40">
                开始使用
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              免费使用，每月 5 次评估
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto">
              登录后即可使用，查看历史评估记录和优化建议。
            </p>
            <Link
              href="/assess"
              className="group inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 text-sm tracking-wide hover:bg-[#e5e5e5] transition-all"
            >
              开始评估
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
