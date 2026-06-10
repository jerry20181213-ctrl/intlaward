'use client'

import { useCallback, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'designmatch-saved'

function getSaved(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function SaveButton({ slug, label }: { slug: string; label?: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(getSaved().includes(slug))
  }, [slug])

  const toggle = useCallback(() => {
    const current = getSaved()
    const next = current.includes(slug)
      ? current.filter(s => s !== slug)
      : [...current, slug]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(!saved)
  }, [slug, saved])

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-xs border px-3 py-1.5 transition-all ${
        saved
          ? 'border-black bg-black text-white'
          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-black hover:text-black'
      }`}
      aria-label={saved ? '取消收藏' : '收藏'}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-all ${saved ? 'fill-white' : ''}`}
      />
      {saved ? '已收藏' : label || '收藏'}
    </button>
  )
}
