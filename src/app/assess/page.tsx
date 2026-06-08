'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FileUpload } from '@/components/assess/FileUpload'
import { StepForm } from '@/components/assess/StepForm'

const CATEGORY_OPTIONS = [
  { value: '', label: '请选择作品类型' },
  { value: 'product', label: '产品设计' },
  { value: 'visual', label: '视觉传达' },
  { value: 'space', label: '空间设计' },
  { value: 'interaction', label: '交互设计' },
  { value: 'service', label: '服务设计' },
  { value: 'fashion', label: '时尚设计' },
  { value: 'concept', label: '概念设计' },
]

const MARKET_OPTIONS = [
  { value: '', label: '请选择目标市场' },
  { value: '国内', label: '国内' },
  { value: '欧美', label: '欧美' },
  { value: '全球', label: '全球' },
  { value: '不限', label: '不限' },
]

const STAGE_OPTIONS = [
  { value: '', label: '请选择作品状态' },
  { value: '概念阶段', label: '概念阶段' },
  { value: '量产上市', label: '量产上市' },
  { value: '已展出', label: '已展出' },
]

const BUDGET_OPTIONS = [
  { value: '', label: '请选择预算范围' },
  { value: '¥1000以下', label: '¥1000以下' },
  { value: '¥1000-3000', label: '¥1000-3000' },
  { value: '¥3000-5000', label: '¥3000-5000' },
  { value: '不限', label: '不限' },
]

const STEPS = [
  { title: '上传照片', description: '作品图片' },
  { title: '项目信息', description: '详细描述' },
  { title: '提交', description: '开始匹配' },
]

export default function AssessPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [filesInfo, setFilesInfo] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: '',
    industry: '',
    market: '',
    stage: '',
    budget: '',
    description: '',
  })
  const router = useRouter()

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = async () => {
    setError('')

    if (currentStep === 2) {
      // Submit
      setLoading(true)
      try {
        const formData = {
          name: form.name,
          type: form.type,
          industry: form.industry,
          market: form.market,
          stage: form.stage,
          budget: form.budget,
          description: form.description,
          imageCount: files.length,
        }

        const res = await fetch('/api/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message || '评估失败，请重试')
          return
        }

        router.push(`/assess/results/${data.id}`)
      } catch {
        setError('网络错误，请重试')
      } finally {
        setLoading(false)
      }
      return
    }

    if (currentStep === 1) {
      if (!form.name) { setError('请输入作品名称'); return }
      if (!form.type) { setError('请选择作品类型'); return }
      if (!form.description) { setError('请输入设计说明'); return }
    }

    if (currentStep === 2 && files.length < 3) {
      setError('请至少上传 3 张作品照片')
      return
    }

    setCurrentStep(prev => Math.min(prev + 1, 2))
  }

  const handlePrev = () => {
    setError('')
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="container-tight py-16">
      <div className="text-center mb-12">
        <div className="section-label justify-center mb-4">评估</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">作品评估</h1>
        <p className="text-sm text-[var(--text-secondary)]">上传作品信息，AI 为你匹配合适的设计奖项</p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-3 border border-[var(--border)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
          {error}
        </div>
      )}

      <StepForm
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        isFirst={currentStep === 0}
        isLast={currentStep === 2}
        loading={loading}
      >
        {currentStep === 0 && (
          <FileUpload
            files={files}
            onFilesChange={setFiles}
            filesInfo={filesInfo}
            onFilesInfoChange={setFilesInfo}
            minFiles={3}
            maxFiles={5}
            maxSizeMB={5}
          />
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <Input
              label="作品名称 *"
              placeholder="例：智能健康水杯"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
            <Select
              label="作品类型 *"
              options={CATEGORY_OPTIONS}
              value={form.type}
              onChange={(e) => updateForm('type', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="行业领域"
                placeholder="例：消费电子"
                value={form.industry}
                onChange={(e) => updateForm('industry', e.target.value)}
              />
              <Select
                label="目标市场"
                options={MARKET_OPTIONS}
                value={form.market}
                onChange={(e) => updateForm('market', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="作品状态"
                options={STAGE_OPTIONS}
                value={form.stage}
                onChange={(e) => updateForm('stage', e.target.value)}
              />
              <Select
                label="预算范围"
                options={BUDGET_OPTIONS}
                value={form.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
              />
            </div>
            <Textarea
              label="设计说明 *"
              placeholder="请描述作品的设计理念、创新点、功能特点等（200字以内）"
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              maxLength={200}
            />
            <p className="text-[11px] text-[var(--text-tertiary)] text-right">{form.description.length}/200</p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8 space-y-5">
            <div className="w-14 h-14 border border-[var(--border)] flex items-center justify-center mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">确认提交</h3>
            <div className="border border-[var(--border)] p-4 text-left text-sm space-y-2">
              <p><span className="text-[var(--text-tertiary)]">作品名称：</span>{form.name}</p>
              <p><span className="text-[var(--text-tertiary)]">作品类型：</span>{CATEGORY_OPTIONS.find(o => o.value === form.type)?.label}</p>
              <p><span className="text-[var(--text-tertiary)]">图片数量：</span>{files.length} 张</p>
              {form.industry && <p><span className="text-[var(--text-tertiary)]">行业领域：</span>{form.industry}</p>}
              {form.market && <p><span className="text-[var(--text-tertiary)]">目标市场：</span>{form.market}</p>}
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              AI 将分析你的作品并与 30+ 奖项进行匹配
            </p>
          </div>
        )}
      </StepForm>
    </div>
  )
}
