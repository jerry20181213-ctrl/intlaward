'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Partner } from '@/lib/types'
import { Building2, ChevronRight, Send, ArrowLeft, ArrowRight } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => setPartners(data.partners || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (partnerId: string) => {
    if (!form.name || !form.contact) return

    await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId, ...form }),
    })

    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-sm text-[var(--text-tertiary)]">加载中...</p>
      </div>
    )
  }

  return (
    <div className="container-tight py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-black" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
            合作
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">合作申报机构</h1>
        <p className="text-sm text-[var(--text-secondary)]">通过合作机构获得专业的奖项申报服务</p>
      </div>

      {!selectedPartner ? (
        <><div className="max-w-2xl mx-auto mb-8">
          <Link
            href="/services"
            className="flex items-center justify-between border border-[var(--border)] bg-white p-4 hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <div>
              <div className="font-bold text-sm mb-0.5 group-hover:underline">增值服务</div>
              <p className="text-[10px] text-[var(--text-tertiary)]">查看代申报、翻译、材料优化等配套服务</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-black transition-colors" />
          </Link>
        </div>

        <div className="max-w-2xl mx-auto space-y-px">
          {partners.length === 0 ? (
            <div className="border border-[var(--border)] p-12 text-center">
              <Building2 className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-tertiary)]">暂无合作机构</p>
            </div>
          ) : (
            partners.map(partner => (
              <div
                key={partner.id}
                className="border border-[var(--border)] bg-white p-5 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{partner.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)]">{partner.description?.slice(0, 80)}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(partner.serviceScope || []).map((s, i) => (
                    <span key={i} className="text-[10px] border border-[var(--border)] text-[var(--text-secondary)] px-2 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        </>
      ) : submitted ? (
        <div className="max-w-md mx-auto border border-[var(--border)] bg-white p-8 text-center">
          <div className="w-12 h-12 border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
            <Send className="h-5 w-5" />
          </div>
          <h3 className="font-bold mb-2">提交成功！</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">{selectedPartner.name} 将尽快与您联系。</p>
          <Button variant="outline" onClick={() => { setSelectedPartner(null); setSubmitted(false); setForm({ name: '', contact: '', message: '' }) }}>
            返回列表
          </Button>
        </div>
      ) : (
        <div className="max-w-md mx-auto border border-[var(--border)] bg-white">
          <div className="p-6">
            <button className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-4 hover:text-[var(--text-primary)] transition-colors" onClick={() => setSelectedPartner(null)}>
              <ArrowLeft className="h-3 w-3" />
              返回列表
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center">
                <Building2 className="h-5 w-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{selectedPartner.name}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">{selectedPartner.contactPhone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="您的姓名"
                placeholder="请输入姓名"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="联系方式"
                placeholder="手机号或微信号"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              <Textarea
                label="备注信息"
                placeholder="描述您的需求和作品情况（选填）"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button
                className="w-full"
                onClick={() => handleSubmit(selectedPartner.id)}
                disabled={!form.name || !form.contact}
              >
                提交咨询
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
