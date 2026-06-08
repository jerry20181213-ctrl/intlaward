'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShieldCheck, LogOut, Plus } from 'lucide-react'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [awards, setAwards] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [tab, setTab] = useState<'awards' | 'partners'>('partners')
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [showAddPartner, setShowAddPartner] = useState(false)

  const handleLogin = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
      setAuthenticated(true)
      setError('')
      localStorage.setItem('da_admin', 'true')
    } else {
      setError('密码错误')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('da_admin') === 'true') {
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm border border-[var(--border)] bg-white p-6">
          <div className="text-center mb-6">
            <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <h1 className="font-bold">管理后台</h1>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              label="管理员密码"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-[11px] text-[var(--text-secondary)]">{error}</p>}
            <Button className="w-full" onClick={handleLogin}>登录</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-tight py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-label mb-2">管理</div>
          <h1 className="text-2xl font-bold tracking-tight">管理后台</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border border-[var(--border)]">
            <button
              onClick={() => setTab('partners')}
              className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${tab === 'partners' ? 'bg-black text-white' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              合作机构
            </button>
            <button
              onClick={() => setTab('awards')}
              className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${tab === 'awards' ? 'bg-black text-white' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              奖项管理
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { localStorage.removeItem('da_admin'); setAuthenticated(false) }}
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            退出
          </Button>
        </div>
      </div>

      {tab === 'partners' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold">合作机构列表</h2>
            <Button size="sm" onClick={() => { setShowAddPartner(true); setEditingPartner({ name: '', contactPhone: '', serviceScope: [] }) }}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              添加机构
            </Button>
          </div>

          <div className="border border-[var(--border)] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <th className="text-left p-3 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">名称</th>
                  <th className="text-left p-3 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">联系方式</th>
                  <th className="text-left p-3 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">服务范围</th>
                  <th className="text-center p-3 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">状态</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p: any) => (
                  <tr key={p.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3 font-medium text-sm">{p.name}</td>
                    <td className="p-3 text-xs text-[var(--text-secondary)]">{p.contactPhone}</td>
                    <td className="p-3 text-xs text-[var(--text-secondary)]">{(p.serviceScope || []).join(', ')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-medium border ${
                        p.isActive
                          ? 'border-black bg-white text-black'
                          : 'border-[var(--border)] text-[var(--text-tertiary)]'
                      }`}>
                        {p.isActive ? '启用' : '停用'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {partners.length === 0 && (
              <div className="text-center py-10 text-xs text-[var(--text-tertiary)]">
                暂无数据，API 返回的机构数据会显示在这里
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'awards' && (
        <div className="border border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--text-secondary)]">
          <p>奖项数据以静态文件维护</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            编辑 <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[10px]">src/lib/data/awards.ts</code> 修改奖项信息，修改后需重新部署
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">当前共 30 个奖项</p>
        </div>
      )}
    </div>
  )
}
