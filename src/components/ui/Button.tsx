'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-[#1a1a1a] active:bg-[#333]',
      secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[#e8e8e8] active:bg-[#d4d4d4]',
      outline: 'border-2 border-black text-black hover:bg-black hover:text-white active:bg-[#1a1a1a]',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-[11px]',
      md: 'px-4 py-2 text-xs',
      lg: 'px-6 py-3 text-sm',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
