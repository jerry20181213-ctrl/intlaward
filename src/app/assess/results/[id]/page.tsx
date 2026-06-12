'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { AwardCard } from '@/components/results/AwardCard'
import { ComparisonTable } from '@/components/results/ComparisonTable'
import { DownloadReport } from '@/components/results/DownloadReport'
import { MatchResult, QualityGateResult, StrategySummary } from '@/lib/types'
import { Table, LayoutGrid, AlertCircle, RotateCcw, Download, Lightbulb, AlertTriangle } from 'lucide-react'
import { WeChatShare } from '@/components/ui/WeChatShare'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [results, setResults] = useState<MatchResult[]>([])
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [qualityGate, setQualityGate] = useState<QualityGateResult | null>(null)
  const [strategy, setStrategy] = useState<StrategySummary | null>(null)

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch(`/api/assess?assessmentId=${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.message || '加载失败')
          return
        }

        setResults(data.results || [])
        setProjectName(data.projectName || '')
        setQualityGate(data.qualityGate || null)
        setStrategy(data.strategy || null)
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
        <Button onClick={() => router.push('/assess')}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          重新评估
        </Button>
      </div>
    )
  }

  const tierIcons: Record<string, React.ReactNode> = {
    'top-tier': '🏆',
    combo: '🎯',
    experience: '📈',
    improve: '💡',
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

      {/* 质量警告：置信度偏低但仍在可接受范围 */}
      {qualityGate && qualityGate.pass && qualityGate.confidence < 0.55 && (
        <div className="mb-6 border border-yellow-300 bg-yellow-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">匹配结果仅供参考</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              您提供的描述信息较简略（置信度 {Math.round(qualityGate.confidence * 100)}%），
              建议返回补充更多设计细节以获得更精准的推荐。
            </p>
          </div>
        </div>
      )}

      {/* 策略总结 */}
      {strategy && strategy.tier !== 'none' && (
        <div className="mb-6 border border-[var(--border)] bg-white">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
                推荐策略
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{tierIcons[strategy.tier] || '💡'}</span>
              <div>
                <h3 className="font-bold text-base mb-1">{strategy.tierLabel}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {strategy.tierDescription}
                </p>
                {strategy.safeBetCount > 1 && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    {strategy.safeBetCount} 个奖项可作为稳妥选择
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <WeChatShare url={typeof window !== 'undefined' ? window.location.href : ''} variant="default" />
          </Button>
          <Button size="sm" onClick={() => setShowDownload(true)}>
            <Download className="h-3.5 w-3.5 mr-1" />
            下载报告
          </Button>
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
        <h3 className="font-bold text-sm mb-2">获取完整评估报告</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          下载 PDF 报告，包含详细的奖项匹配分析和优化建议
        </p>
        <Button onClick={() => setShowDownload(true)}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          下载 PDF 报告
        </Button>
      </div>

      {/* Download report modal */}
      <DownloadReport
        results={results}
        projectName={projectName}
        isOpen={showDownload}
        onClose={() => setShowDownload(false)}
      />
    </div>
  )
}
