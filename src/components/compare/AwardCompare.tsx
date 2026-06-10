'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { X, ExternalLink, Plus } from 'lucide-react'
import { awards } from '@/lib/data/awards'
import type { Award } from '@/lib/types'
import { formatCurrency, daysUntil } from '@/lib/utils'

const CATEGORY_MAP: Record<string, string> = {
  product: '产品设计',
  visual: '视觉传达',
  space: '空间设计',
  interaction: '交互设计',
  service: '服务设计',
  fashion: '时尚设计',
  concept: '概念设计',
}

const DIM_LABELS: Record<string, string> = {
  innovation: '创新性',
  aesthetics: '美学',
  functionality: '功能性',
  craftsmanship: '工艺',
  socialImpact: '社会影响',
  commercial: '商业价值',
}

export function AwardCompare() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedSlugs = searchParams.getAll('a')
  const selected = useMemo(
    () => selectedSlugs.map(slug => awards.find(a => a.slug === slug)).filter(Boolean) as Award[],
    [selectedSlugs],
  )

  const available = awards.filter(a => !selectedSlugs.includes(a.slug))

  function addAward(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.append('a', slug)
    router.replace(`/compare?${params.toString()}`)
  }

  function removeAward(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    const all = params.getAll('a').filter(s => s !== slug)
    params.delete('a')
    all.forEach(s => params.append('a', s))
    router.replace(`/compare?${params.toString()}`)
  }

  return (
    <div>
      {/* Selector */}
      <div className="border border-[var(--border)] bg-white p-4 mb-6">
        <label className="block text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-2">
          添加奖项对比（2-4 个）
        </label>
        {selected.length >= 4 ? (
          <p className="text-xs text-[var(--text-secondary)]">最多对比 4 个奖项</p>
        ) : (
          <div className="relative">
            <select
              className="w-full border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] appearance-none cursor-pointer focus:outline-none focus:border-black"
              value=""
              onChange={e => { if (e.target.value) addAward(e.target.value) }}
            >
              <option value="" disabled>选择奖项…</option>
              {available.map(a => (
                <option key={a.id} value={a.slug}>
                  {a.nameCn} ({a.name})
                </option>
              ))}
            </select>
            <Plus className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)] pointer-events-none" />
          </div>
        )}
      </div>

      {/* Selection chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {selected.map(a => (
            <span
              key={a.id}
              className="inline-flex items-center gap-1.5 border border-black bg-black text-white px-3 py-1 text-xs"
            >
              {a.nameCn}
              <button onClick={() => removeAward(a.slug)} className="hover:opacity-70 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase pb-3 pr-4 w-32 align-top">
                  奖项
                </th>
                {selected.map(a => (
                  <th key={a.id} className="pb-3 px-3 align-top min-w-[200px]">
                    <Link
                      href={`/awards/${a.slug}`}
                      className="group block border border-[var(--border)] p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <div className="font-bold text-sm mb-0.5 group-hover:underline">{a.nameCn}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">{a.name}</div>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2">
                        {a.description}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Fee */}
              <CompareRow label="报名费">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <span className="font-medium">¥{a.fee.professional.toLocaleString()}</span>
                    {a.fee.student !== undefined && (
                      <span className="text-[10px] text-[var(--text-tertiary)] ml-1">
                        / 学生 ¥{a.fee.student.toLocaleString()}
                      </span>
                    )}
                    {a.fee.lateSurcharge && (
                      <span className="block text-[10px] text-[var(--text-tertiary)] mt-0.5">
                        晚鸟附加费：{formatCurrency(a.fee.lateSurcharge)}
                      </span>
                    )}
                  </Cell>
                ))}
              </CompareRow>

              {/* Difficulty */}
              <CompareRow label="难度">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <span>{'★'.repeat(a.difficulty)}{'☆'.repeat(3 - a.difficulty)}</span>
                  </Cell>
                ))}
              </CompareRow>

              {/* Win rate */}
              <CompareRow label="获奖率">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <span className={`font-semibold ${(a.winRate ?? 0) >= 30 ? 'text-black' : 'text-[var(--text-secondary)]'}`}>
                      {a.winRate}%
                    </span>
                  </Cell>
                ))}
              </CompareRow>

              {/* Student track */}
              <CompareRow label="学生通道">
                {selected.map(a => (
                  <Cell key={a.id}>
                    {a.studentTrack ? (
                      <span className="text-[10px] text-green-700">支持</span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-tertiary)]">仅专业组</span>
                    )}
                  </Cell>
                ))}
              </CompareRow>

              {/* Deadlines */}
              <CompareRow label="截止日期">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <DeadlineLine label="早鸟" date={a.deadlines.early} />
                    <DeadlineLine label="常规" date={a.deadlines.regular} urgent />
                    <DeadlineLine label="晚鸟" date={a.deadlines.late} />
                    <DeadlineLine label="结果" date={a.deadlines.result} />
                  </Cell>
                ))}
              </CompareRow>

              {/* Categories */}
              <CompareRow label="适用类别">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <div className="flex flex-wrap gap-1">
                      {a.categories.map(c => (
                        <span key={c} className="text-[10px] border border-[var(--border)] px-1.5 py-0.5">
                          {CATEGORY_MAP[c] || c}
                        </span>
                      ))}
                    </div>
                  </Cell>
                ))}
              </CompareRow>

              {/* Style preferences */}
              <CompareRow label="风格偏好">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <div className="flex flex-wrap gap-1">
                      {a.stylePreferences?.map(s => (
                        <span key={s} className="text-[10px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-secondary)]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Cell>
                ))}
              </CompareRow>

              {/* Judging criteria */}
              <CompareRow label="评审标准">
                {selected.map(a => (
                  <Cell key={a.id}>
                    <div className="space-y-2">
                      {(Object.entries(a.judgingCriteria) as [string, number][])
                        .sort(([, va], [, vb]) => vb - va)
                        .map(([key, weight]) => (
                          <div key={key}>
                            <div className="flex items-center justify-between text-[10px] mb-0.5">
                              <span className="text-[var(--text-secondary)]">{DIM_LABELS[key] || key}</span>
                              <span className="font-medium">{Math.round(weight * 100)}%</span>
                            </div>
                            <div className="h-1 bg-[var(--bg-tertiary)]">
                              <div
                                className="h-full bg-black"
                                style={{ width: `${weight * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </Cell>
                ))}
              </CompareRow>
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="text-center py-16 border border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)] mb-1">选择 2-4 个奖项进行对比</p>
          <p className="text-xs text-[var(--text-tertiary)]">
            从上方下拉菜单中选择奖项开始
          </p>
        </div>
      )}

      {/* Single award hint */}
      {selected.length === 1 && (
        <div className="text-center py-12 border border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">
            再选择 {selected.length === 1 ? '1-3' : ''} 个奖项即可开始对比
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-[var(--border-light)]">
      <td className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase py-3 pr-4 align-top whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  )
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="py-3 px-3 align-top">{children}</td>
}

function DeadlineLine({ label, date, urgent }: { label: string; date?: string; urgent?: boolean }) {
  if (!date) return null
  const days = daysUntil(date)
  const isOverdue = days < 0
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] mb-0.5 last:mb-0">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className={`${isOverdue ? 'text-red-500' : urgent && days > 0 && days < 30 ? 'font-medium' : ''}`}>
        {date}
        {days > 0 && !isOverdue && (
          <span className="text-[10px] text-[var(--text-tertiary)] ml-1">({days}天)</span>
        )}
        {isOverdue && <span className="text-[10px] text-red-400 ml-1">(已截止)</span>}
      </span>
    </div>
  )
}
