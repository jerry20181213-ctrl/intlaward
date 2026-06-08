'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[11px] font-medium tracking-wider uppercase text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors',
            'focus:border-black focus:outline-none',
            error && 'border-black',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
