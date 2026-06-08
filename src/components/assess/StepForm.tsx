'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  title: string
  description: string
}

interface StepFormProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  isFirst?: boolean
  isLast?: boolean
  loading?: boolean
}

export function StepForm({
  steps,
  currentStep,
  children,
  onNext,
  onPrev,
  isFirst,
  isLast,
  loading,
}: StepFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-7 h-7 flex items-center justify-center text-[10px] font-semibold transition-colors',
                    index <= currentStep
                      ? 'bg-black text-white'
                      : 'border border-[var(--border)] text-[var(--text-tertiary)] bg-white'
                  )}
                >
                  {index < currentStep ? '→' : index + 1}
                </div>
                <div className="hidden sm:block">
                  <p className={cn(
                    'text-[11px] font-medium',
                    index <= currentStep ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-4',
                  index < currentStep ? 'bg-black' : 'bg-[var(--border)]'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="border border-[var(--border)] bg-white">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-[11px] font-medium tracking-wider uppercase transition-colors',
            isFirst
              ? 'text-[var(--text-tertiary)] cursor-not-allowed'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          <ChevronLeft className="h-3 w-3" />
          上一步
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className={cn(
            'flex items-center gap-1 px-6 py-2.5 text-[11px] font-semibold tracking-wider uppercase transition-colors',
            loading
              ? 'bg-[var(--text-tertiary)] text-white cursor-wait'
              : 'bg-black text-white hover:bg-[#1a1a1a]'
          )}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              分析中...
            </>
          ) : (
            <>
              {isLast ? '提交评估' : '下一步'}
              <ChevronRight className="h-3 w-3" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
