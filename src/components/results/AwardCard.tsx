'use client'

import { useState } from 'react'
import { MatchResult } from '@/lib/types'
import { ScoreBar } from './ScoreBar'
import { RadarChart } from './RadarChart'
import { formatCurrency, daysUntil } from '@/lib/utils'
import { Calendar, DollarSign, TrendingUp, Award, Maximize2, Minimize2 } from 'lucide-react'

interface AwardCardProps {
  result: MatchResult
  rank: number
}

export function AwardCard({ result, rank }: AwardCardProps) {
  const { award, score, reason, optimizationTip, criteriaFit, styleFit } = result
  const days = award.deadlines.regular ? daysUntil(award.deadlines.regular) : null
  const [showChart, setShowChart] = useState(false)

  // Derive project dimension scores from available match data
  // The award.judgingCriteria already captures what the award values
  // We project the match quality onto each dimension
  const projectScores = {
    innovation: Math.round((award.judgingCriteria.innovation * 100) * (criteriaFit / 100) * 100) / 100,
    aesthetics: Math.round((award.judgingCriteria.aesthetics * 100) * (criteriaFit / 100) * 100) / 100,
    functionality: Math.round((award.judgingCriteria.functionality * 100) * (criteriaFit / 100) * 100) / 100,
    craftsmanship: Math.round((award.judgingCriteria.craftsmanship * 100) * (criteriaFit / 100) * 100) / 100,
    socialImpact: Math.round((award.judgingCriteria.socialImpact * 100) * (criteriaFit / 100) * 100) / 100,
    commercial: Math.round((award.judgingCriteria.commercial * 100) * (criteriaFit / 100) * 100) / 100,
  }

  // Build legend data for the chart
  const topCriterion = Object.entries(award.judgingCriteria)
    .sort(([, a], [, b]) => b - a)[0]

  const criterionLabels: Record<string, string> = {
    innovation: '创新性',
    aesthetics: '美学',
    functionality: '功能性',
    craftsmanship: '工艺',
    socialImpact: '社会影响',
    commercial: '商业价值',
  }

  return (
    <div className="border border-[var(--border)] bg-white transition-colors">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-bold text-[var(--text-tertiary)] tracking-wider">
              {String(rank + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-bold text-sm">{award.nameCn}</h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">{award.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg leading-none">{score}<span className="text-[var(--text-tertiary)] text-sm">%</span></div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">匹配度</div>
          </div>
        </div>

        <div className="mt-3">
          <ScoreBar score={score} size="sm" showLabel={false} />
        </div>
      </div>

      {/* Body: two-column layout with info + radar chart */}
      <div className="border-t border-[var(--border-light)]">
        {/* Info row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border-light)]">
          <div className="bg-white p-3 text-center">
            <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-0.5">费用起</div>
            <div className="text-xs font-medium">{formatCurrency(award.fee.professional)}</div>
          </div>
          <div className="bg-white p-3 text-center">
            <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-0.5">截止</div>
            <div className={`text-xs font-medium ${days !== null && days < 30 ? 'text-black' : ''}`}>
              {days !== null ? `${days}天` : '-'}
            </div>
          </div>
          <div className="bg-white p-3 text-center">
            <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-0.5">难度</div>
            <div className="text-xs font-medium">{'★'.repeat(award.difficulty).padEnd(3, '☆')}</div>
          </div>
          <div className="bg-white p-3 text-center">
            <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-0.5">获奖率</div>
            <div className="text-xs font-medium">{award.winRate}%</div>
          </div>
        </div>

        {/* Radar chart toggle */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase hover:bg-[var(--bg-secondary)] transition-colors"
          onClick={() => setShowChart(!showChart)}
        >
          <span>评审维度分析</span>
          {showChart ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </button>

        {showChart && (
          <div className="px-4 pb-4">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <RadarChart
                  awardWeights={award.judgingCriteria}
                  projectScores={projectScores}
                  size={160}
                />
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <div className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-2">维度匹配</div>
                <div className="space-y-1.5">
                  {DIM_ORDER.map(d => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-secondary)] w-12 flex-shrink-0">{criterionLabels[d]}</span>
                      <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] overflow-hidden">
                        <div
                          className="h-full bg-black transition-all"
                          style={{ width: `${Math.round(projectScores[d])}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-tertiary)] w-6 text-right">
                        {Math.round(projectScores[d])}
                      </span>
                    </div>
                  ))}
                </div>
                {topCriterion && (
                  <p className="mt-3 text-[10px] text-[var(--text-tertiary)]">
                    该奖项最看重 <span className="text-black font-medium">{criterionLabels[topCriterion[0]]}</span>
                    （权重 {Math.round(topCriterion[1] * 100)}%）
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reason */}
      <div className="px-6 pb-4">
        <p className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-3 leading-relaxed border-l-2 border-black mt-4">
          {reason}
        </p>

        {/* Optimization tip */}
        {optimizationTip && (
          <div className="mt-2 text-xs text-[var(--text-secondary)] p-3 leading-relaxed border border-[var(--border)]">
            <span className="font-semibold text-[var(--text-primary)]">优化建议：</span>
            {optimizationTip}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-light)] px-6 py-3 flex items-center justify-between">
        <a
          href={award.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          查看官网 →
        </a>
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-tertiary)]">
          <span>评审标准</span>
          {DIM_ORDER.map(d => (
            <span key={d} className="hidden sm:inline">
              {criterionLabels[d]}: {Math.round(award.judgingCriteria[d] * 100)}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const DIM_ORDER = ['innovation', 'aesthetics', 'functionality', 'craftsmanship', 'socialImpact', 'commercial'] as const
const criterionLabels: Record<string, string> = {
  innovation: '创新性',
  aesthetics: '美学',
  functionality: '功能性',
  craftsmanship: '工艺',
  socialImpact: '社会影响',
  commercial: '商业价值',
}
