'use client'

import { useState } from 'react'
import { GuideModal } from './GuideModal'

interface GuideCTAProps {
  title: string
  guideId: string
  description?: string
}

export function GuideCTA({ title, guideId, description }: GuideCTAProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mt-12 border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        {description && (
          <p className="text-xs text-[var(--text-tertiary)] mb-3">{description}</p>
        )}
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-black text-white font-semibold px-5 py-2 text-xs tracking-wide hover:bg-[#1a1a1a] transition-colors"
        >
          免费下载
        </button>
      </div>

      <GuideModal
        title={title}
        pdfPath={`/api/guides/download?id=${guideId}`}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
