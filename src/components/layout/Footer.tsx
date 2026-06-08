import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-light)] bg-white">
      <div className="container-tight py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 bg-black flex items-center justify-center">
                <span className="text-white text-[8px] font-mono font-bold">A</span>
              </span>
              <span className="text-sm font-bold">奖项匹配</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              AI 驱动的设计奖项匹配引擎。<br />帮助设计师找到最合适的国际奖项。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] mb-4">
              服务
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/assess" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">免费评估</Link>
              <Link href="/partners" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">合作机构</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] mb-4">
              账户
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/login" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">登录</Link>
              <Link href="/admin" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">管理</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] mb-4">
              关于
            </h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-[var(--text-tertiary)]">覆盖 30+ 奖项</span>
              <span className="text-xs text-[var(--text-tertiary)]">AI 智能匹配</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--text-tertiary)] tracking-wider">
            © {new Date().getFullYear()} 设计奖项匹配引擎
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)] tracking-wider">
            黑白之间 · 设计至简
          </p>
        </div>
      </div>
    </footer>
  )
}
