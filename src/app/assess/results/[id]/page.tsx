'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { AwardCard } from '@/components/results/AwardCard'
import { ComparisonTable } from '@/components/results/ComparisonTable'
import { MatchResult } from '@/lib/types'
import { Share2, Table, LayoutGrid, AlertCircle, RotateCcw } from 'lucide-react'

export default function ResultsPage() {
  const params = useParams()
  const [results, setResults] = useState<MatchResult[]>([])
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    async function loadResults() {
      try {
        const token = localStorage.getItem('da_token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        const res = await fetch(`/api/assess?assessmentId=${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) {
          setError(data.message || '加载失败')
          return
        }

        setResults(data.results || [])
        setProjectName(data.projectName || '')
      } catch {
        setError('加载失败，请重新评估')
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-tertiary)]">正在加载评估结果...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-tight py-20 text-center">
        <AlertCircle className="h-10 w-10 text-[var(--text-tertiary)] mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">加载失败</h2>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">{error}</p>
        <Link href="/assess">
          <Button>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            重新评估
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-tight py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-4">结果</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">评估结果</h1>
        {projectName && (
          <p className="text-sm text-[var(--text-secondary)]">
            「{projectName}」的匹配结果，共分析 {results.length} 个适配奖项
          </p>
        )}
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center border border-[var(--border)]">
          <button
            onClick={() => setShowTable(false)}
            className={`p-2 transition-colors ${!showTable ? 'bg-black text-white' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowTable(true)}
            className={`p-2 transition-colors ${showTable ? 'bg-black text-white' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
          >
            <Table className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}>
            <Share2 className="h-3.5 w-3.5 mr-1" />
            分享
          </Button>
          <Link href="/partners">
            <Button size="sm">联系申报机构</Button>
          </Link>
        </div>
      </div>

      {/* Results */}
      {showTable ? (
        <div className="border border-[var(--border)] bg-white p-4">
          <ComparisonTable results={results} />
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => (
            <AwardCard key={result.awardId} result={result} rank={index} />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
        <h3 className="font-bold text-sm mb-2">需要专业申报服务？</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          我们的合作机构提供代报名、材料整理、翻译等一站式服务
        </p>
        <Link href="/partners">
          <Button>查看合作机构</Button>
        </Link>
      </div>
    </div>
  )
}
