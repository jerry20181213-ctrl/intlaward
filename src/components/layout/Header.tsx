'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ phone: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('da_token')
    if (token) {
      const storedUser = localStorage.getItem('da_user')
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch {}
      }
    }
  }, [pathname])

  const links = [
    { href: '/', label: '首页' },
    { href: '/assess', label: '评估' },
    { href: '/partners', label: '机构' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border-light)]">
      <div className="container-tight h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <span className="w-6 h-6 bg-black flex items-center justify-center">
            <span className="text-white text-[10px] font-mono font-bold">A</span>
          </span>
          <span className="hidden sm:inline text-[var(--text-primary)]">奖项匹配</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium tracking-wider uppercase transition-colors ${
                isActive(link.href)
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <span className="text-xs text-[var(--text-secondary)]">
              {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </span>
          ) : (
            <Link
              href="/login"
              className="text-xs font-medium tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              登录
            </Link>
          )}
          <Link
            href="/assess"
            className="text-xs font-semibold tracking-wider uppercase bg-black text-white px-4 py-2 hover:bg-[#1a1a1a] transition-colors"
          >
            免费评估
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
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
          <div className="pt-2 border-t border-[var(--border-light)]">
            {user ? (
              <span className="text-xs text-[var(--text-secondary)]">{user.phone}</span>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-primary)]">
                  登录
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
