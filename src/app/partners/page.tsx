'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Partner } from '@/lib/types'
import { Building2, Phone, ChevronRight, Send } from 'lucide-react'
import Link from 'next/link'

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
    const token = localStorage.getItem('da_token')
    if (!form.name || !form.contact) return

    await fetch('/api/partners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
        <div className="section-label justify-center mb-4">合作</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">合作申报机构</h1>
        <p className="text-sm text-[var(--text-secondary)]">通过我们合作的代理机构，获得专业的奖项申报服务</p>
      </div>

      {!selectedPartner ? (
        <div className="grid gap-3 max-w-2xl mx-auto">
          {partners.map(partner => (
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
          ))}
        </div>
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
        <div className="max-w-md mx-auto border border-[var(--border)] bg-white p-6">
          <button className="text-xs text-[var(--text-secondary)] mb-4 hover:text-[var(--text-primary)] transition-colors" onClick={() => setSelectedPartner(null)}>
            ← 返回列表
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{selectedPartner.name}</h3>
              <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <Phone className="h-3 w-3" />
                {selectedPartner.contactPhone}
              </div>
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
      )}

      <div className="mt-14 max-w-2xl mx-auto text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="font-bold text-sm mb-2">成为合作机构</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">如果您是奖项申报代理机构，欢迎与我们合作</p>
        <Link href="/admin">
          <Button variant="outline">联系我们</Button>
        </Link>
      </div>
    </div>
  )
}
