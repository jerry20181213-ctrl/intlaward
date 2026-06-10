import { MatchResult } from '@/lib/types'
import { formatCurrency, daysUntil } from '@/lib/utils'

interface ComparisonTableProps {
  results: MatchResult[]
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">#</th>
            <th className="text-left py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">奖项</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">匹配</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">费用</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">截止</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">难度</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">获奖率</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const days = r.award.deadlines.regular ? daysUntil(r.award.deadlines.regular) : null
            return (
              <tr key={r.awardId} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-3 px-2 font-mono text-[var(--text-tertiary)] text-xs">
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td className="py-3 px-2">
                  <span className="font-medium text-sm">{r.award.nameCn}</span>
                  <span className="text-[11px] text-[var(--text-tertiary)] ml-1.5">{r.award.name}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="font-mono font-bold text-sm">{r.score}<span className="text-[var(--text-tertiary)]">%</span></span>
                </td>
                <td className="py-3 px-2 text-center text-xs text-[var(--text-secondary)]">
                  {formatCurrency(r.award.fee.professional)}
                </td>
                <td className="py-3 px-2 text-center text-xs">
                  {days !== null ? (
                    <span className={days < 30 ? 'text-black font-medium' : 'text-[var(--text-secondary)]'}>
                      {days}天
                    </span>
                  ) : (
                    <span className="text-[var(--text-tertiary)]">-</span>
                  )}
                </td>
                <td className="py-3 px-2 text-center text-xs text-[var(--text-tertiary)]">
                  {'●'.repeat(r.award.difficulty).padEnd(3, '○')}
                </td>
                <td className="py-3 px-2 text-center text-xs text-[var(--text-secondary)]">
                  {r.award.winRate}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
