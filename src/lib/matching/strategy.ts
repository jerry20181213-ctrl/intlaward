/**
 * 策略总结 — 根据匹配结果生成可操作的申报策略建议
 *
 * 基于 top1 匹配度分 4 档，直接引导用户下一步行动。
 * 逻辑独立于奖项数量，新增奖项后自动参与策略计算。
 */

import { MatchResult, StrategySummary } from '@/lib/types'

/**
 * 根据匹配结果生成策略总结
 * @param results 排序后的匹配结果数组
 * @returns StrategySummary
 */
export function generateStrategy(results: MatchResult[]): StrategySummary {
  if (results.length === 0) {
    return {
      tier: 'none',
      tierLabel: '暂无推荐',
      tierDescription: '当前没有匹配度合适的奖项。建议补充更多作品描述后重新评估，或调整作品类型选择。',
      topAwardName: '',
      safeBetCount: 0,
    }
  }

  const topScore = results[0].score
  const topAwardName = results[0].award.nameCn

  // 获奖概率 > 30% 且匹配度 >= 60 的稳妥选择
  const safeBets = results.filter(r => (r.award.winRate || 0) > 30 && r.score >= 60)
  const safeBetCount = safeBets.length

  if (topScore >= 85 && safeBetCount >= 1) {
    const safeNames = safeBets.slice(0, 2).map(r => r.award.nameCn).join('」、「')
    return {
      tier: 'top-tier',
      tierLabel: '冲击顶级奖项',
      tierDescription: safeBetCount >= 2
        ? `你的作品有潜力冲击顶级设计奖项！「${topAwardName}」匹配度极高，建议重点准备申报材料。同时「${safeNames}」也可作为稳妥选择。建议采用「冲顶 + 保底」组合策略。`
        : `你的作品与「${topAwardName}」匹配度极高，有潜力冲击顶级奖项。建议重点准备申报材料，突出作品的创新性和设计价值。`,
      topAwardName,
      safeBetCount,
    }
  }

  if (topScore >= 70) {
    const safeNames = safeBets.length >= 1 ? `「${safeBets[0].award.nameCn}」` : '1-2 个匹配度较高的奖项'
    return {
      tier: 'combo',
      tierLabel: '组合策略',
      tierDescription: `推荐采用组合申报策略：主攻「${topAwardName}」冲击更高荣誉，同时选择 ${safeNames} 保底，提高整体获奖概率。`,
      topAwardName,
      safeBetCount,
    }
  }

  if (topScore >= 55) {
    return {
      tier: 'experience',
      tierLabel: '积累经验',
      tierDescription: `建议先选择「${topAwardName}」等难度适中的奖项积累申报经验。通过首次申报了解评审流程和标准后，再冲击更高级别奖项。`,
      topAwardName,
      safeBetCount,
    }
  }

  return {
    tier: 'improve',
    tierLabel: '先优化作品',
    tierDescription: `当前最高匹配度为 ${topScore}%，建议先参考「${topAwardName}」的评审标准和往届获奖作品优化设计方向，或补充更详细的作品描述后重新评估。`,
    topAwardName,
    safeBetCount,
  }
}
