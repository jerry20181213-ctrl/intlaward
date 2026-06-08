'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MatchResult } from '@/lib/types'
import { X, Download } from 'lucide-react'

interface DownloadReportProps {
  results: MatchResult[]
  projectName: string
  isOpen: boolean
  onClose: () => void
}

export function DownloadReport({ results, projectName, isOpen, onClose }: DownloadReportProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'generating' | 'done'>('form')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const formatPhone = (value: string) => value.replace(/\D/g, '').slice(0, 11)

  const handleSubmit = async () => {
    setError('')
    if (!name.trim()) { setError('请输入姓名'); return }
    if (phone.length < 11) { setError('请输入完整的手机号'); return }

    setLoading(true)
    setStep('generating')

    try {
      // 1. Submit lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, projectName }),
      })

      // 2. Generate PDF
      await generatePDF()

      setStep('done')
    } catch {
      setError('生成失败，请重试')
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    // Build a temporary element for the report
    const el = document.createElement('div')
    el.style.cssText = 'position:fixed;top:0;left:0;width:794px;background:#fff;padding:0;z-index:-9999;pointer-events:none'
    el.innerHTML = buildReportHTML()
    document.body.appendChild(el)

    try {
      // Capture the full report with html2canvas
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        height: el.scrollHeight,
        width: 794,
        windowHeight: el.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      let remainingHeight = canvas.height
      let srcY = 0
      let page = 0

      while (remainingHeight > 0) {
        if (page > 0) pdf.addPage()
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = Math.min(canvas.height - srcY, canvas.width * 1.414)
        const ctx = pageCanvas.getContext('2d')!
        ctx.drawImage(canvas, 0, srcY, canvas.width, pageCanvas.height, 0, 0, canvas.width, pageCanvas.height)
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.9)
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, (pageCanvas.height * pdfWidth) / canvas.width)
        srcY += pageCanvas.height
        remainingHeight -= pageCanvas.height
        page++
      }

      pdf.save(`${projectName || '评估报告'}-奖项匹配报告.pdf`)
    } finally {
      document.body.removeChild(el)
    }
  }

  const buildReportHTML = (): string => {
    const now = new Date().toLocaleDateString('zh-CN')

    const awardCards = results.map((r, i) => {
      const { award, score, reason, optimizationTip } = r
      const rank = i + 1
      return `
        <div style="border:1px solid #e5e5e5;padding:24px;margin-bottom:16px;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:16px;">
              <span style="font-size:32px;font-weight:700;color:#a3a3a3;">${String(rank).padStart(2, '0')}</span>
              <div>
                <h3 style="margin:0;font-size:18px;font-weight:700;">${award.nameCn}</h3>
                <p style="margin:4px 0 0;font-size:13px;color:#737373;">${award.name}</p>
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:28px;font-weight:700;">${score}</span>
              <span style="font-size:14px;color:#a3a3a3;">%</span>
            </div>
          </div>
          <div style="height:6px;background:#f0f0f0;border-radius:3px;margin-bottom:16px;">
            <div style="height:100%;width:${score}%;background:#000;border-radius:3px;"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;color:#525252;margin-bottom:12px;">
            <div>💰 报名费：¥${award.fee.professional} 起</div>
            <div>📅 ${award.deadlines.regular || '时间待定'} 截止</div>
            <div>🏆 获奖率：${award.winRate || '-'}%</div>
            <div>📊 难度：${'★'.repeat(award.difficulty).padEnd(3, '☆')}</div>
          </div>
          <div style="background:#fafafa;padding:12px;border-left:3px solid #000;font-size:13px;color:#525252;margin-bottom:8px;">
            ${reason}
          </div>
          ${optimizationTip ? `
            <div style="background:#fff;padding:12px;border:1px solid #e5e5e5;font-size:13px;color:#525252;">
              <strong>优化建议：</strong>${optimizationTip}
            </div>
          ` : ''}
        </div>
      `
    }).join('')

    return `
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,'PingFang SC','Noto Sans SC',sans-serif;color:#000;">
        <!-- Cover -->
        <div style="height:297mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border-bottom:1px solid #e5e5e5;">
          <div style="width:48px;height:48px;background:#000;display:flex;align-items:center;justify-content:center;margin-bottom:32px;">
            <span style="color:#fff;font-size:20px;font-weight:700;">A</span>
          </div>
          <h1 style="font-size:36px;font-weight:800;margin:0 0 16px;letter-spacing:-0.02em;">奖项匹配报告</h1>
          <p style="font-size:18px;color:#525252;margin:0 0 48px;">${projectName || '设计作品'}</p>
          <div style="width:64px;height:2px;background:#000;margin-bottom:48px;"></div>
          <p style="font-size:14px;color:#a3a3a3;margin:0;">${now}</p>
        </div>

        <!-- Summary -->
        <div style="padding:48px 40px;border-bottom:1px solid #e5e5e5;">
          <h2 style="font-size:24px;font-weight:700;margin:0 0 24px;">匹配总览</h2>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
            <div style="border:1px solid #e5e5e5;padding:24px;text-align:center;">
              <div style="font-size:36px;font-weight:700;">${results.length}</div>
              <div style="font-size:13px;color:#737373;margin-top:4px;">匹配奖项</div>
            </div>
            <div style="border:1px solid #e5e5e5;padding:24px;text-align:center;">
              <div style="font-size:36px;font-weight:700;">${Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)}</div>
              <div style="font-size:13px;color:#737373;margin-top:4px;">平均匹配度</div>
            </div>
            <div style="border:1px solid #e5e5e5;padding:24px;text-align:center;">
              <div style="font-size:36px;font-weight:700;">${results.filter(r => r.score >= 70).length}</div>
              <div style="font-size:13px;color:#737373;margin-top:4px;">高匹配推荐</div>
            </div>
          </div>
        </div>

        <!-- Awards -->
        <div style="padding:48px 40px;">
          <h2 style="font-size:24px;font-weight:700;margin:0 0 24px;">详细匹配结果</h2>
          ${awardCards}
        </div>

        <!-- Footer -->
        <div style="padding:32px 40px;text-align:center;border-top:1px solid #e5e5e5;">
          <p style="font-size:12px;color:#a3a3a3;margin:0;">
            由 DesignMatch 生成 · AI 智能匹配仅供参考，最终结果以奖项官方评审为准
          </p>
        </div>
      </div>
    `
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setError('')
    setStep('form')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleClose}>
      <div className="bg-white w-full max-w-sm mx-4 relative" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button
          className="absolute top-4 right-4 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>

        {step === 'form' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-10 h-10 bg-black flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-mono font-bold">PDF</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight">下载完整报告</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                填写手机号即可获取 PDF 评估报告
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 border border-[var(--border)] text-xs text-[var(--text-secondary)]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="姓名"
                placeholder="请输入您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="手机号"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                type="tel"
                maxLength={11}
              />
              <Button className="w-full" onClick={handleSubmit} loading={loading}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                下载报告
              </Button>
              <p className="text-[10px] text-[var(--text-tertiary)] text-center">
                提交后自动下载 PDF 报告
              </p>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin rounded-full mx-auto mb-4" />
            <p className="text-sm text-[var(--text-tertiary)]">正在生成报告...</p>
          </div>
        )}

        {step === 'done' && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center mx-auto mb-4">
              <Download className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-2">下载完成</h2>
            <p className="text-xs text-[var(--text-tertiary)] mb-6">
              报告已保存到您的设备
            </p>
            <Button variant="outline" onClick={handleClose}>关闭</Button>
          </div>
        )}
      </div>
    </div>
  )
}
