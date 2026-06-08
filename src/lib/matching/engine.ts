import { Award, ProjectAssessment, MatchResult } from '@/lib/types'
import { awards } from '@/lib/data/awards'
import { analyzeProject } from './deepseek'

/**
 * Matching engine: analyzes a project and returns ranked award matches.
 *
 * Scoring breakdown:
 * - 40%: Criteria fit (how well project aligns with award's judging criteria)
 * - 30%: Style fit (match between project style and award's preferences)
 * - 15%: Budget fit (can user afford the entry fee?)
 * - 15%: Deadline fit (is there still time to submit?)
 */

export async function matchProject(project: ProjectAssessment): Promise<MatchResult[]> {
  // Step 1: Analyze project via DeepSeek
  const analysis = await analyzeProject(project.description, project.type)

  // Step 2: Score each award
  const results: (MatchResult | null)[] = awards.map(award => {
    // Required filter: category must match (skip if project has a type)
    if (project.type && !award.categories.includes(project.type)) {
      return null
    }

    // Calculate criteria fit (cosine similarity between project and award)
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

    // Style fit (Jaccard similarity between project style tags and award preferences)
    const styleFit = jaccardSimilarity(
      analysis.styleTags,
      award.stylePreferences || []
    )

    // Budget fit
    const budgetValue = parseBudget(project.budget)
    const budgetFit = budgetValue >= award.fee.professional ? 1 : 0.3

    // Deadline fit
    const deadlineFit = getDeadlineFit(award)

    // Final weighted score
    const finalScore =
      criteriaFit * 0.4 +
      styleFit * 0.3 +
      budgetFit * 0.15 +
      deadlineFit * 0.15

    // Generate reason and optimization tip
    const reason = generateReason(award, criteriaFit, styleFit, budgetFit, deadlineFit)
    const optimizationTip = generateOptimizationTip(award, styleFit, criteriaFit)

    return {
      awardId: award.id,
      award,
      score: Math.round(finalScore * 100),
      categoryMatch: true,
      criteriaFit: Math.round(criteriaFit * 100),
      styleFit: Math.round(styleFit * 100),
      budgetFit: Math.round(budgetFit * 100),
      deadlineFit: Math.round(deadlineFit * 100),
      reason,
      optimizationTip,
    }
  })

  // Filter out nulls (incompatible awards), sort by score descending, top 5
  return results
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

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

  if (dates.length === 0) return 0.5 // No deadline info

  const nearestFuture = dates
    .filter(d => d > now)
    .sort((a, b) => a.getTime() - b.getTime())[0]

  if (!nearestFuture) return -0.5 // All deadlines passed

  const daysUntilDeadline = (nearestFuture.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (daysUntilDeadline > 90) return 0.8    // Plenty of time
  if (daysUntilDeadline > 30) return 1.0    // Good timing
  if (daysUntilDeadline > 14) return 0.7    // Soon
  if (daysUntilDeadline > 7) return 0.5     // Very soon
  return 0.3                                 // Urgent
}

function generateReason(
  award: Award,
  criteriaFit: number,
  styleFit: number,
  budgetFit: number,
  deadlineFit: number
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

function generateOptimizationTip(award: Award, styleFit: number, criteriaFit: number): string {
  if (styleFit < 0.4 && criteriaFit < 0.5) {
    return '建议调整作品风格以更契合该奖项的评审偏好，参考往届获奖作品可提高匹配度。'
  }
  if (styleFit < 0.4) {
    return '该奖项偏好' + (award.stylePreferences?.join('、') || '多样化') + '风格，可在设计说明中突出这些元素。'
  }
  if (criteriaFit < 0.5) {
    const weakAreas = Object.entries(award.judgingCriteria)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([key]) => ({ innovation: '创新性', aesthetics: '美学', functionality: '功能性', craftsmanship: '工艺', socialImpact: '社会影响', commercial: '商业价值' }[key] || key))
    return `该奖项特别看重${weakAreas.join('和')}，建议在作品说明中对此重点阐述。`
  }
  return ''
}

/**
 * Quick match: simplified text-only matching without LLM call.
 * Used when DeepSeek is unavailable or for preview.
 */
export function quickMatch(project: ProjectAssessment): MatchResult[] {
  // Simplified matching using only text patterns
  const analysis = getDefaultForType(project.type)
  const testProject = { ...project }

  // Run same algorithm but without API call
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
    const budgetValue = parseBudget(project.budget)
    const budgetFit = budgetValue >= award.fee.professional ? 1 : 0.3
    const deadlineFit = getDeadlineFit(award)
    const finalScore = criteriaFit * 0.4 + styleFit * 0.3 + budgetFit * 0.15 + deadlineFit * 0.15

    return {
      awardId: award.id,
      award,
      score: Math.round(finalScore * 100),
      categoryMatch: true,
      criteriaFit: Math.round(criteriaFit * 100),
      styleFit: Math.round(styleFit * 100),
      budgetFit: Math.round(budgetFit * 100),
      deadlineFit: Math.round(deadlineFit * 100),
      reason: generateReason(award, criteriaFit, styleFit, budgetFit, deadlineFit),
      optimizationTip: generateOptimizationTip(award, styleFit, criteriaFit),
    }
  })

  return results
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

// Make analysis accessible for matching
export { analyzeProject }

function getDefaultForType(type: string) {
  const defaults: Record<string, { styleTags: string[]; innovationScore: number; aestheticsScore: number; functionalityScore: number }> = {
    product: { styleTags: ['functional', 'minimal'], innovationScore: 55, aestheticsScore: 55, functionalityScore: 65 },
    visual: { styleTags: ['creative', 'bold'], innovationScore: 55, aestheticsScore: 70, functionalityScore: 45 },
    space: { styleTags: ['spatial', 'minimal'], innovationScore: 50, aestheticsScore: 60, functionalityScore: 50 },
    interaction: { styleTags: ['innovative', 'user-centric'], innovationScore: 65, aestheticsScore: 50, functionalityScore: 60 },
    fashion: { styleTags: ['creative', 'bold'], innovationScore: 55, aestheticsScore: 70, functionalityScore: 40 },
    service: { styleTags: ['holistic', 'user-centric'], innovationScore: 60, aestheticsScore: 45, functionalityScore: 60 },
    concept: { styleTags: ['visionary', 'bold'], innovationScore: 70, aestheticsScore: 50, functionalityScore: 40 },
  }
  return defaults[type] || { styleTags: ['creative'], innovationScore: 50, aestheticsScore: 50, functionalityScore: 50 }
}
