'use client'

import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ScoreBar({ score, size = 'md', showLabel = true }: ScoreBarProps) {
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' }
  const colors = score >= 80 ? 'bg-black' : score >= 60 ? 'bg-[#555]' : score >= 40 ? 'bg-[#999]' : 'bg-[#d4d4d4]'

  return (
    <div className="flex items-center gap-3">
      <div className={cn('flex-1 bg-[var(--bg-tertiary)]', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out', colors)}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          'font-semibold font-sans',
          size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs'
        )}>
          {score}
          <span className="text-[var(--text-tertiary)] font-normal">%</span>
        </span>
      )}
    </div>
  )
}
