'use client'

import { cn } from '@/lib/utils'
import { MatchResult } from '@/lib/types'
import { ScoreBar } from './ScoreBar'
import { formatCurrency, daysUntil } from '@/lib/utils'
import { Calendar, DollarSign, TrendingUp, Award } from 'lucide-react'

interface AwardCardProps {
  result: MatchResult
  rank: number
}

export function AwardCard({ result, rank }: AwardCardProps) {
  const { award, score, reason, optimizationTip } = result
  const days = award.deadlines.regular ? daysUntil(award.deadlines.regular) : null

  return (
    <div className="border border-[var(--border)] bg-white p-6 hover:bg-[var(--bg-secondary)] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] font-bold text-[var(--text-tertiary)] tracking-wider">
            {String(rank + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-bold text-sm">{award.nameCn}</h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">{award.name}</p>
          </div>
        </div>
        <span className="font-mono font-bold text-lg">{score}<span className="text-[var(--text-tertiary)] text-sm">%</span></span>
      </div>

      <ScoreBar score={score} size="sm" showLabel={false} />

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{formatCurrency(award.fee.professional)} 起</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Calendar className="h-3.5 w-3.5" />
          <span className={days !== null && days < 30 ? 'text-black font-medium' : ''}>
            {days !== null ? `${days}天后截止` : '时间待定'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Award className="h-3.5 w-3.5" />
          <span>{'●'.repeat(award.difficulty).padEnd(3, '○')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>获奖率 {award.winRate}%</span>
        </div>
      </div>

      {/* Reason */}
      <p className="mt-4 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-3 leading-relaxed border-l-2 border-black">
        {reason}
      </p>

      {/* Optimization tip */}
      {optimizationTip && (
        <div className="mt-2 text-xs text-[var(--text-secondary)] p-3 leading-relaxed border border-[var(--border)]">
          <span className="font-semibold text-[var(--text-primary)]">优化建议：</span>
          {optimizationTip}
        </div>
      )}

      {/* Link */}
      <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
        <a
          href={award.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[var(--text-primary)] hover:underline"
        >
          查看官网 →
        </a>
      </div>
    </div>
  )
}
