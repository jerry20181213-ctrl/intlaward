'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { awards } from '@/lib/data/awards'

const STORAGE_KEY = 'designmatch-saved'

export default function SavedPage() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setSavedSlugs(raw ? JSON.parse(raw) : [])
    } catch {
      setSavedSlugs([])
    }
  }, [])

  const savedAwards = awards.filter(a => savedSlugs.includes(a.slug))

  function remove(slug: string) {
    const next = savedSlugs.filter(s => s !== slug)
    setSavedSlugs(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  if (!mounted) {
    return (
      <div className="container-tight py-12">
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
          <p className="text-sm text-[var(--text-tertiary)]">加载中…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-tight py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">收藏的奖项</span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          收藏的奖项
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          保存在本地的奖项列表，随时查看截止日期和详情。
        </p>
      </header>

      {/* List */}
      {savedAwards.length === 0 ? (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
          <Heart className="h-8 w-8 mx-auto mb-3 text-[var(--text-tertiary)]" />
          <p className="text-sm text-[var(--text-secondary)] mb-1">还没有收藏任何奖项</p>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            在奖项详情页点击「收藏」按钮，即可将奖项保存到此处
          </p>
          <Link
            href="/awards"
            className="inline-flex items-center gap-1 border border-black text-black font-medium px-4 py-2 text-xs hover:bg-black hover:text-white transition-colors"
          >
            浏览全部奖项
            <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="space-y-px bg-[var(--border-light)]">
          {savedAwards.map(award => (
            <div key={award.id} className="bg-white p-4 sm:p-5 flex items-center gap-4">
              <Link
                href={`/awards/${award.slug}`}
                className="flex-1 min-w-0 group"
              >
                <div className="font-bold text-sm mb-0.5 group-hover:underline">{award.nameCn}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] mb-1">{award.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  <span>¥{award.fee.professional.toLocaleString()} 起</span>
                  <span className="w-px h-2.5 bg-[var(--border)]" />
                  <span>难度 {'★'.repeat(award.difficulty)}</span>
                  <span className="w-px h-2.5 bg-[var(--border)]" />
                  <span>获奖率 {award.winRate}%</span>
                </div>
                {award.deadlines.regular && (
                  <div className="text-[10px] text-[var(--text-tertiary)] mt-1">
                    常规截止：{award.deadlines.regular}
                  </div>
                )}
              </Link>
              <button
                onClick={() => remove(award.slug)}
                className="flex-shrink-0 p-2 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                aria-label="取消收藏"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {savedAwards.length > 0 && (
        <div className="mt-6 text-center text-[10px] text-[var(--text-tertiary)]">
          已收藏 {savedAwards.length} 个奖项 · 数据存储在本地浏览器
        </div>
      )}
    </div>
  )
}
