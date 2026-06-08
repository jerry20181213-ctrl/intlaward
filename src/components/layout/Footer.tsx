import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-light)] bg-white">
      <div className="container-tight py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-black flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">DM</span>
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              DesignMatch
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/assess" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">评估</Link>
            <Link href="/partners" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">合作</Link>
            <Link href="/login" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">登录</Link>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-[var(--text-tertiary)] tracking-wider">
            © {new Date().getFullYear()} DesignMatch
          </p>
        </div>
      </div>
    </footer>
  )
}
