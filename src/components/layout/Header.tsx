'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: '评估' },
    { href: '/awards', label: '奖项' },
    { href: '/compare', label: '对比' },
    { href: '/blog', label: '指南' },
    { href: '/case-studies', label: '案例' },
    { href: '/faq', label: 'FAQ' },
    { href: '/partners', label: '合作' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--border-light)]">
      <div className="container-tight h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 bg-black flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white text-[11px] font-bold tracking-tight">DM</span>
          </span>
          <span className="hidden sm:inline text-sm font-medium tracking-tight text-[var(--text-primary)]">
            DesignMatch
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-medium tracking-wider uppercase transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/assess"
            className="text-[11px] font-semibold tracking-wider uppercase bg-black text-white px-4 py-1.5 hover:bg-[#1a1a1a] transition-colors"
          >
            免费评估
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-light)] bg-white px-4 py-4 space-y-3">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-xs font-medium tracking-wider uppercase text-[var(--text-secondary)] py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
