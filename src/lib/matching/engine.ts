/**
 * Matching Engine — 匹配引擎
 *
 * 5 维加权评分体系 + 质量门禁 + 策略总结
 *
 * 评分维度：
 * - 评审标准匹配 (criteriaFit)  30% — 作品评分与奖项权重向量的余弦相似度
 * - 风格匹配 (styleFit)         20% — 作品风格标签与奖项偏好的 Jaccard 相似度
 * - 难度适配 (difficultyFit)    15% — 作品成熟度与奖项难度的匹配曲线（NEW）
 * - 预算匹配 (budgetFit)        15% — 报名费是否在预算内
 * - 时间可行 (deadlineFit)      20% — 截止日期紧迫度
 *
 * 数据驱动：评分逻辑不依赖具体奖项数量，新增奖项自动参与匹配计算。
 */

import { Award, ProjectAssessment, MatchResult, QualityGateResult, StrategySummary } from '@/lib/types'
import { awards } from '@/lib/data/awards'
import { analyzeProject } from './deepseek'
import { checkQualityGate } from './qualityGate'
import { generateStrategy } from './strategy'

// ============================================================
// 公开接口
// ============================================================

export interface AssessResult {
  qualityGate: QualityGateResult
  results: MatchResult[]
  strategy: StrategySummary
}

/**
 * 完整评估流水线：质量门禁 → 作品分析 → 多维评分 → 策略总结
 *
 * 质量门禁置信度 < 0.35 时熔断返回，不执行匹配。
 */
export async function assessProject(project: ProjectAssessment): Promise<AssessResult> {
  // Step 1: 质量门禁
  const gate = checkQualityGate(project)

  // Step 2: 置信度低于熔断阈值 → 提前返回
  if (gate.confidence < 0.35) {
    return {
      qualityGate: gate,
      results: [],
      strategy: generateStrategy([]),
    }
  }

  // Step 3: 执行匹配
  const results = await matchProject(project)

  // Step 4: 策略总结
  const strategy = generateStrategy(results)

  return { qualityGate: gate, results, strategy }
}

// ============================================================
// 匹配核心（内部使用）
// ============================================================

async function matchProject(project: ProjectAssessment): Promise<MatchResult[]> {
  const analysis = await analyzeProject(project.description, project.type)

  const results: (MatchResult | null)[] = awards.map(award => {
    // 类别硬过滤（跨类别申报可能性低，但保留软惩罚分值供后续优化）
    if (project.type && !award.categories.includes(project.type)) {
      return null
    }

    // ---- 5 维评分 ----

    // 1. 评审标准匹配 (30%) — 余弦相似度
    const projectVector = [
      analysis.innovationScore,
      analysis.aestheticsScore,
      analysis.functionalityScore,
      50, // default craftsmanship
      50, // default social impact
      50, // default commercial
    ]
    const awardVector = [
      award.judgingCriteria.innovation * 100,
      award.judgingCriteria.aesthetics * 100,
      award.judgingCriteria.functionality * 100,
      award.judgingCriteria.craftsmanship * 100,
      award.judgingCriteria.socialImpact * 100,
      award.judgingCriteria.commercial * 100,
    ]
    const criteriaFit = cosineSimilarity(projectVector, awardVector)

    // 2. 风格匹配 (20%) — Jaccard 相似度
    const styleFit = jaccardSimilarity(
      analysis.styleTags,
      award.stylePreferences || [],
    )

    // 3. 难度适配 (15%) — 作品成熟度 vs 奖项难度 (NEW)
    const difficultyFit = calculateDifficultyFit(analysis.maturityLevel, award.difficulty)

    // 4. 预算匹配 (15%)
    const budgetValue = parseBudget(project.budget)
    const budgetFit = budgetValue >= award.fee.professional ? 1 : 0.3

    // 5. 时间可行 (20%)
    const deadlineFit = getDeadlineFit(award)

    // 综合加权得分 (0-100)
    const finalScore =
      criteriaFit * 0.30 +
      styleFit * 0.20 +
      difficultyFit * 0.15 +
      budgetFit * 0.15 +
      deadlineFit * 0.20

    const reason = generateReason(award, criteriaFit, styleFit, difficultyFit, budgetFit, deadlineFit)
    const optimizationTip = generateOptimizationTip(award, styleFit, criteriaFit, difficultyFit)

    return {
      awardId: award.id,
      award,
      score: Math.round(finalScore * 100),
      categoryMatch: true,
      criteriaFit: Math.round(criteriaFit * 100),
      styleFit: Math.round(styleFit * 100),
      budgetFit: Math.round(budgetFit * 100),
      deadlineFit: Math.round(deadlineFit * 100),
      difficultyFit: Math.round(difficultyFit * 100),
      reason,
      optimizationTip,
    }
  })

  return results
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

// ============================================================
// 难度适配计算
// ============================================================

/**
 * 计算作品成熟度与奖项难度的匹配度
 *
 * 核心思路：低成熟度作品匹配低难度奖项，高成熟度作品匹配高难度奖项。
 * 使用高斯型曲线：在最佳难度处达到峰值，两侧平滑衰减。
 *
 * award.difficulty: 1=入门, 2=中等, 3=精英
 * maturityLevel: 0(概念) → 0.5(原型/样品) → 1.0(量产/成熟)
 */
function calculateDifficultyFit(maturityLevel: number, awardDifficulty: 1 | 2 | 3): number {
  // 将奖项难度映射到成熟度坐标系
  const difficultyMap: Record<number, number> = { 1: 0.25, 2: 0.50, 3: 0.85 }
  const targetDifficulty = difficultyMap[awardDifficulty] ?? 0.5

  // 高斯核：(maturity - target)^2 越小越匹配
  // 乘以缩放因子使得分分布在 0.2-1.0 范围
  const diff = maturityLevel - targetDifficulty
  // 灵活区间：允许 ±0.2 的浮动
  const sigma = 0.25
  const fit = Math.exp(-(diff * diff) / (2 * sigma * sigma))

  // 最低 0.1（完全不匹配也不到 0，保留可能性）
  return Math.max(0.1, Math.min(1, fit))
}

// ============================================================
// 工具函数（保留原逻辑）
// ============================================================

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  if (magA === 0 || magB === 0) return 0
  return dotProduct / (magA * magB)
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0.5
  const setA = new Set(a.map(s => s.toLowerCase()))
  const setB = new Set(b.map(s => s.toLowerCase()))
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  if (union.size === 0) return 0.5
  return intersection.size / union.size
}

function parseBudget(budget: string): number {
  const map: Record<string, number> = {
    '¥1000以下': 500,
    '¥1000-3000': 2000,
    '¥3000-5000': 4000,
    '不限': 99999,
  }
  return map[budget] || 500
}

function getDeadlineFit(award: Award): number {
  const now = new Date()
  const dates = [award.deadlines.early, award.deadlines.regular, award.deadlines.late]
    .filter((d): d is string => !!d)
    .map(d => new Date(d))

  if (dates.length === 0) return 0.5

  const nearestFuture = dates
    .filter(d => d > now)
    .sort((a, b) => a.getTime() - b.getTime())[0]

  if (!nearestFuture) return 0.2 // 已过截止（但不归零，保留可能性）

  const daysUntilDeadline = (nearestFuture.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (daysUntilDeadline > 90) return 0.8
  if (daysUntilDeadline > 30) return 1.0
  if (daysUntilDeadline > 14) return 0.7
  if (daysUntilDeadline > 7) return 0.5
  return 0.3
}

// ============================================================
// 推荐理由生成
// ============================================================

function generateReason(
  award: Award,
  criteriaFit: number,
  styleFit: number,
  difficultyFit: number,
  budgetFit: number,
  deadlineFit: number,
): string {
  const parts: string[] = []

  if (criteriaFit > 0.7) {
    parts.push('评审标准匹配度高')
  } else if (criteriaFit > 0.5) {
    parts.push('评审标准有一定匹配')
  }

  if (styleFit > 0.5) {
    parts.push('风格偏好高度契合')
  } else if (styleFit > 0.3) {
    parts.push('风格偏好部分匹配')
  }

  // 新增：难度适配提示
  if (difficultyFit > 0.8) {
    parts.push('作品成熟度与奖项难度层次匹配理想')
  } else if (difficultyFit < 0.4) {
    if (award.difficulty === 3) {
      parts.push('作品目前成熟度较低，建议考虑难度更适中的奖项')
    }
  }

  if (budgetFit > 0.5) {
    parts.push('报名费用在预算范围内')
  } else {
    parts.push('报名费用超出预算')
  }

  if (deadlineFit > 0.5) {
    parts.push('截止日期充裕')
  } else if (deadlineFit > 0) {
    parts.push('截止日期较近，请抓紧时间')
  } else {
    parts.push('已错过常规截止日期，可考虑晚鸟报名')
  }

  return parts.join('；') + '。'
}

function generateOptimizationTip(
  award: Award,
  styleFit: number,
  criteriaFit: number,
  difficultyFit: number,
): string {
  const tips: string[] = []

  if (styleFit < 0.4 && criteriaFit < 0.5) {
    tips.push('建议调整作品风格以更契合该奖项的评审偏好，参考往届获奖作品可提高匹配度')
  } else if (styleFit < 0.4) {
    tips.push(`该奖项偏好${award.stylePreferences?.join('、') || '多样化'}风格，可在设计说明中突出这些元素`)
  } else if (criteriaFit < 0.5) {
    const criteriaKeyMap: Record<string, string> = {
      innovation: '创新性', aesthetics: '美学', functionality: '功能性',
      craftsmanship: '工艺', socialImpact: '社会影响', commercial: '商业价值',
    }
    const weakAreas = Object.entries(award.judgingCriteria)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([key]) => criteriaKeyMap[key] || key)
    tips.push(`该奖项特别看重${weakAreas.join('和')}，建议在作品说明中对此重点阐述`)
  }

  // 新增：难度适配建议
  if (difficultyFit < 0.4 && award.difficulty === 3) {
    tips.push('该奖项属最高难度级别，建议作品达到量产/成熟阶段后再申报')
  } else if (difficultyFit < 0.4 && award.difficulty === 1 && tips.length === 0) {
    tips.push('你的作品成熟度较高，该奖项难度偏低，建议同时考虑更具挑战性的奖项')
  }

  return tips.join('；')
}

// ============================================================
// 快速匹配（无 LLM 回退），仅供预览 / 内部使用
// 未集成策略总结，建议对外使用 assessProject
// ============================================================

export function quickMatch(project: ProjectAssessment): MatchResult[] {
  const analysis = getDefaultForType(project.type)

  const results: (MatchResult | null)[] = awards.map(award => {
    if (project.type && !award.categories.includes(project.type)) return null

    const projectVector = [
      analysis.innovationScore,
      analysis.aestheticsScore,
      analysis.functionalityScore,
      50, 50, 50,
    ]
    const awardVector = [
      award.judgingCriteria.innovation * 100,
      award.judgingCriteria.aesthetics * 100,
      award.judgingCriteria.functionality * 100,
      award.judgingCriteria.craftsmanship * 100,
      award.judgingCriteria.socialImpact * 100,
      award.judgingCriteria.commercial * 100,
    ]

    const criteriaFit = cosineSimilarity(projectVector, awardVector)
    const styleFit = jaccardSimilarity(analysis.styleTags, award.stylePreferences || [])
    const difficultyFit = calculateDifficultyFit(analysis.maturityLevel, award.difficulty)
    const budgetValue = parseBudget(project.budget)
    const budgetFit = budgetValue >= award.fee.professional ? 1 : 0.3
    const deadlineFit = getDeadlineFit(award)

    const finalScore =
      criteriaFit * 0.30 +
      styleFit * 0.20 +
      difficultyFit * 0.15 +
      budgetFit * 0.15 +
      deadlineFit * 0.20

    return {
      awardId: award.id,
      award,
      score: Math.round(finalScore * 100),
      categoryMatch: true,
      criteriaFit: Math.round(criteriaFit * 100),
      styleFit: Math.round(styleFit * 100),
      budgetFit: Math.round(budgetFit * 100),
      deadlineFit: Math.round(deadlineFit * 100),
      difficultyFit: Math.round(difficultyFit * 100),
      reason: generateReason(award, criteriaFit, styleFit, difficultyFit, budgetFit, deadlineFit),
      optimizationTip: generateOptimizationTip(award, styleFit, criteriaFit, difficultyFit),
    }
  })

  return results
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export { analyzeProject }

function getDefaultForType(type: string) {
  const defaults: Record<string, { styleTags: string[]; innovationScore: number; aestheticsScore: number; functionalityScore: number; maturityLevel: number }> = {
    product: { styleTags: ['functional', 'minimal'], innovationScore: 55, aestheticsScore: 55, functionalityScore: 65, maturityLevel: 0.5 },
    visual: { styleTags: ['creative', 'bold'], innovationScore: 55, aestheticsScore: 70, functionalityScore: 45, maturityLevel: 0.55 },
    space: { styleTags: ['spatial', 'minimal'], innovationScore: 50, aestheticsScore: 60, functionalityScore: 50, maturityLevel: 0.5 },
    interaction: { styleTags: ['innovative', 'user-centric'], innovationScore: 65, aestheticsScore: 50, functionalityScore: 60, maturityLevel: 0.45 },
    fashion: { styleTags: ['creative', 'bold'], innovationScore: 55, aestheticsScore: 70, functionalityScore: 40, maturityLevel: 0.5 },
    service: { styleTags: ['holistic', 'user-centric'], innovationScore: 60, aestheticsScore: 45, functionalityScore: 60, maturityLevel: 0.5 },
    concept: { styleTags: ['visionary', 'bold'], innovationScore: 70, aestheticsScore: 50, functionalityScore: 40, maturityLevel: 0.3 },
  }
  return defaults[type] || { styleTags: ['creative'], innovationScore: 50, aestheticsScore: 50, functionalityScore: 50, maturityLevel: 0.5 }
}
