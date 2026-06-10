'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="container-tight py-20 text-center">
      <div className="text-8xl font-bold text-black/[0.04] select-none mb-6">500</div>
      <h1 className="text-2xl font-bold mb-3">出错了</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xs mx-auto">
        页面加载异常，请稍后重试。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center bg-black text-white px-6 py-2.5 text-sm hover:bg-[#1a1a1a] transition-colors"
      >
        重新加载
      </button>
    </div>
  )
}
