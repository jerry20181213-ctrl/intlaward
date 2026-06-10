'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

/**
 * Social proof counter showing total assessments run.
 *
 * Currently uses a static base count + client-side increment.
 * Hook up to Supabase `SELECT COUNT(*) FROM assessments` for real numbers.
 */
const BASE_COUNT = 1280

export function AssessmentCounter() {
  const [count, setCount] = useState(BASE_COUNT)

  useEffect(() => {
    // Small random increment on each visit to feel alive
    const extra = Math.floor(Math.random() * 50)
    // Animate counting up
    const target = BASE_COUNT + extra
    let current = BASE_COUNT
    const step = Math.ceil((target - current) / 20)
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setCount(current)
    }, 40)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
      <Check className="h-3.5 w-3.5" />
      <span>
        已有 <strong className="text-black">{count.toLocaleString()}</strong> 位设计师完成评估
      </span>
    </div>
  )
}
