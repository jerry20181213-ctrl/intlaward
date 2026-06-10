import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-tight py-20 text-center">
      <div className="text-8xl font-bold text-black/[0.04] select-none mb-6">404</div>
      <h1 className="text-2xl font-bold mb-3">页面未找到</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xs mx-auto">
        该页面不存在或已被移除。
      </p>
      <Link
        href="/"
        className="inline-flex items-center bg-black text-white px-6 py-2.5 text-sm hover:bg-[#1a1a1a] transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}
