'use client'

import { useState, useCallback } from 'react'
import { Share2, X, Copy, Check } from 'lucide-react'

interface WeChatShareProps {
  /** URL to share — defaults to current page */
  url?: string
  /** Optional button label override */
  label?: string
  /** Optional button size variant */
  variant?: 'default' | 'icon'
}

export function WeChatShare({ url, label, variant = 'default' }: WeChatShareProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [shareUrl])

  return (
    <>
      {/* Trigger button */}
      {variant === 'icon' ? (
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="分享"
        >
          <Share2 className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs border border-[var(--border)] px-3 py-1.5 text-[var(--text-secondary)] hover:border-black hover:text-black transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          {label || '分享'}
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white border border-[var(--border)] w-full max-w-xs mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">分享</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* QR Code */}
            <div className="text-center mb-4">
              <div className="w-[180px] h-[180px] mx-auto border border-[var(--border)] bg-white flex items-center justify-center">
                <img
                  src={qrSrc}
                  alt="微信扫码分享"
                  className="w-[160px] h-[160px]"
                  onError={(e) => {
                    // Fallback if QR API fails
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-2">
                微信扫码分享此页面
              </p>
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 border border-[var(--border)] p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-[10px] text-[var(--text-secondary)] bg-transparent outline-none truncate"
              />
              <button
                onClick={copyLink}
                className="flex-shrink-0 text-[10px] text-[var(--text-tertiary)] hover:text-black transition-colors px-1"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
