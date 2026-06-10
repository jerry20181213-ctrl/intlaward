'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { awards } from '@/lib/data/awards'
import { daysUntil } from '@/lib/utils'
import type { AwardCategory } from '@/lib/types'

const CATEGORY_MAP: Record<string, string> = {
  product: '产品设计',
  visual: '视觉传达',
  space: '空间设计',
  interaction: '交互设计',
  service: '服务设计',
  fashion: '时尚设计',
  concept: '概念设计',
}

type DeadlineTab = 'urgent' | 'upcoming' | 'future' | 'expired'

const TAB_LABELS: Record<DeadlineTab, string> = {
  urgent: '紧急（30天内）',
  upcoming: '即将截止（90天内）',
  future: '未来截止',
  expired: '已截止',
}

interface AwardWithDays {
  award: (typeof awards)[number]
  days: number
  deadlineDate: string
  deadlineType: string
}

export function DeadlineTimeline() {
  const [activeTab, setActiveTab] = useState<DeadlineTab>('urgent')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Gather all deadlines
  const allDeadlines = useMemo(() => {
    const list: AwardWithDays[] = []
    for (const award of awards) {
      const types: [string, string | undefined][] = [
        ['早鸟', award.deadlines.early],
        ['常规', award.deadlines.regular],
        ['晚鸟', award.deadlines.late],
      ]
      for (const [label, date] of types) {
        if (!date) continue
        list.push({
          award,
          days: daysUntil(date),
          deadlineDate: date,
          deadlineType: label,
        })
      }
    }
    return list
  }, [])

  // Filter by tab
  const filtered = useMemo(() => {
    const catFiltered = categoryFilter === 'all'
      ? allDeadlines
      : allDeadlines.filter(d => d.award.categories.includes(categoryFilter as AwardCategory))

    switch (activeTab) {
      case 'urgent':
        return catFiltered.filter(d => d.days >= 0 && d.days <= 30).sort((a, b) => a.days - b.days)
      case 'upcoming':
        return catFiltered.filter(d => d.days > 30 && d.days <= 90).sort((a, b) => a.days - b.days)
      case 'future':
        return catFiltered.filter(d => d.days > 90).sort((a, b) => a.days - b.days)
      case 'expired':
        return catFiltered.filter(d => d.days < 0).sort((a, b) => b.days - a.days)
    }
  }, [activeTab, categoryFilter, allDeadlines])

  // Unique categories for filter
  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    awards.forEach(a => a.categories.forEach(c => cats.add(c)))
    return Array.from(cats)
  }, [])

  // Count per tab
  const counts = useMemo(() => {
    const getCount = (tab: DeadlineTab) => {
      const cat = categoryFilter === 'all' ? allDeadlines : allDeadlines.filter(d => d.award.categories.includes(categoryFilter as AwardCategory))
      switch (tab) {
        case 'urgent': return cat.filter(d => d.days >= 0 && d.days <= 30).length
        case 'upcoming': return cat.filter(d => d.days > 30 && d.days <= 90).length
        case 'future': return cat.filter(d => d.days > 90).length
        case 'expired': return cat.filter(d => d.days < 0).length
      }
    }
    return { urgent: getCount('urgent'), upcoming: getCount('upcoming'), future: getCount('future'), expired: getCount('expired') } as Record<DeadlineTab, number>
  }, [categoryFilter, allDeadlines])

  return (
    <div>
      {/* Category filter */}
      <div className="border border-[var(--border)] bg-white p-4 mb-6">
        <label className="block text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-2">
          类别筛选
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-[10px] px-2 py-1 border transition-colors ${
              categoryFilter === 'all'
                ? 'border-black bg-black text-white'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-black'
            }`}
          >
            全部
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[10px] px-2 py-1 border transition-colors ${
                categoryFilter === cat
                  ? 'border-black bg-black text-white'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-black'
              }`}
            >
              {CATEGORY_MAP[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {(Object.keys(TAB_LABELS) as DeadlineTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[11px] px-3 py-1.5 border transition-colors ${
              activeTab === tab
                ? 'border-black bg-black text-white'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-black'
            } ${counts[tab] === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={counts[tab] === 0}
          >
            {TAB_LABELS[tab]}
            <span className="ml-1.5 text-[10px] opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-[var(--border)] bg-[var(--bg-secondary)]">
          <Calendar className="h-6 w-6 mx-auto mb-2 text-[var(--text-tertiary)]" />
          <p className="text-sm text-[var(--text-secondary)]">当前筛选条件下没有截止日期</p>
        </div>
      ) : (
        <div className="space-y-px bg-[var(--border-light)]">
          {filtered.map((item, i) => {
            const urgency = item.days === 0 ? '今天截止！' : item.days < 0 ? `已过去 ${Math.abs(item.days)} 天` : `${item.days} 天后截止`
            return (
              <div key={`${item.award.id}-${item.deadlineType}-${i}`} className="bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Days indicator */}
                <div className={`flex-shrink-0 w-14 h-14 flex flex-col items-center justify-center border ${
                  item.days >= 0 && item.days <= 7
                    ? 'border-red-200 bg-red-50'
                    : item.days < 0
                      ? 'border-[var(--border)] bg-[var(--bg-tertiary)]'
                      : 'border-[var(--border)]'
                }`}>
                  <span className={`text-lg font-bold leading-none ${item.days >= 0 && item.days <= 7 ? 'text-red-600' : item.days < 0 ? 'text-[var(--text-tertiary)]' : ''}`}>
                    {item.days > 0 ? item.days : item.days < 0 ? Math.abs(item.days) : '!'}
                  </span>
                  <span className="text-[8px] text-[var(--text-tertiary)] tracking-wider uppercase mt-0.5">
                    {item.days > 0 ? '天' : item.days < 0 ? '天前' : ''}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] px-1 py-0.5 border ${
                      item.deadlineType === '常规' ? 'border-black text-black' : 'border-[var(--border)] text-[var(--text-tertiary)]'
                    }`}>
                      {item.deadlineType}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">{item.deadlineDate}</span>
                  </div>
                  <Link
                    href={`/awards/${item.award.slug}`}
                    className="font-bold text-sm hover:underline leading-snug"
                  >
                    {item.award.nameCn}
                  </Link>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5 line-clamp-1">
                    {item.award.name} · 报名费 {item.award.fee.professional.toLocaleString()} 元
                  </p>
                </div>

                {/* Urgency badge */}
                <div className="flex-shrink-0 text-right">
                  <span className={`text-[10px] ${
                    item.days < 0 ? 'text-[var(--text-tertiary)]' : item.days <= 7 ? 'text-red-600 font-semibold' : 'text-[var(--text-secondary)]'
                  }`}>
                    {urgency}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA */}
      {filtered.length > 0 && (
        <div className="mt-8 text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="font-bold text-sm mb-1">不确定选哪个？</h2>
          <p className="text-xs text-[var(--text-tertiary)] mb-3">让 AI 帮你匹配合适的奖项</p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 bg-black text-white font-semibold px-5 py-2 text-xs tracking-wide hover:bg-[#1a1a1a] transition-colors"
          >
            开始免费评估
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
