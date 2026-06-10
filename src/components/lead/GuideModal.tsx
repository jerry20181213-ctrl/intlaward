'use client'

import { useState, FormEvent } from 'react'
import { X, Download, Check, Loader } from 'lucide-react'

interface GuideModalProps {
  /** Guide title shown in modal header */
  title: string
  /** Path to the PDF guide file */
  pdfPath: string
  /** Whether modal is open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
}

export function GuideModal({ title, pdfPath, isOpen, onClose }: GuideModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !phone.trim()) {
      setError('请填写姓名和手机号')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          source: 'guide',
          note: `下载指南: ${title}`,
        }),
      })

      if (!res.ok) throw new Error('提交失败')

      setSubmitted(true)

      // Trigger download after a brief moment
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = pdfPath
        link.download = pdfPath.split('/').pop() || 'guide.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 500)
    } catch {
      setError('提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white border border-[var(--border)] w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm">下载「{title}」</h3>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="text-center py-6">
            <Check className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <p className="font-bold text-sm mb-1">提交成功！</p>
            <p className="text-xs text-[var(--text-tertiary)] mb-4">
              指南正在下载中…
            </p>
            <button
              onClick={onClose}
              className="text-[11px] text-[var(--text-secondary)] underline hover:text-black transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-[var(--text-tertiary)] mb-2">
              填写以下信息即可免费下载完整指南
            </p>

            <div>
              <label className="block text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-1">
                姓名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="你的姓名"
                className="w-full border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-1">
                手机号 <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="你的手机号"
                className="w-full border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase mb-1">
                邮箱（选填）
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold px-4 py-2.5 text-xs tracking-wide hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                  提交中…
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  免费下载
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
