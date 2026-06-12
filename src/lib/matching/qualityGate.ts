/**
 * Quality Gate — 输入质量门禁
 *
 * 在进入匹配引擎之前检查用户输入质量，防止"随便写两个字"时
 * 系统仍然输出看起来专业的推荐结果。
 *
 * 数据驱动设计：关键词列表集中在 CONFIG 对象中，
 * 未来增加奖项时只需扩展设计领域和关键词即可。
 */

import { ProjectAssessment } from '@/lib/types'

export interface QualityGateResult {
  pass: boolean
  confidence: number
  issues: string[]
  details: {
    charCount: number
    fillerRatio: number
    hasDomain: boolean
    designKeywords: number
    specificity: number
  }
}

// ============================================================
// 可配置数据 — 奖项库扩展时只需在此补充关键词
// ============================================================

const CONFIG = {
  /** 套话/通用词 — 这些词多为空泛修饰，高比例意味着描述缺乏实质 */
  fillerWords: [
    // 中文通用套话
    '设计', '好看', '美观', '创新', '大气', '时尚', '简约',
    '漂亮', '优雅', '现代', '经典', '好看', '舒服', '精致',
    '华丽', '高端', '奢华', '简洁', '创意', '独特', '个性',
    '前卫', '潮流', '别致', '完美', '极致', '顶级', '非凡',
    '出色', '优秀', '卓越', ' nice', 'good', 'beautiful',
    'great', 'amazing', 'wonderful',
  ],

  /** 设计领域关键词 — 用于判断输入是否与设计领域相关 */
  designDomains: [
    '产品', '工业', '家具', '消费电子', '家电', '家居',
    '视觉', '平面', '品牌', '包装', '海报', 'VI', 'logo',
    '空间', '室内', '建筑', '展览', '展厅', '商业空间',
    '交互', 'UI', 'UX', '界面', 'APP', '应用', '数字',
    '服务', '用户体验', '用户研究', '服务设计',
    '时尚', '服装', '配饰', '珠宝', '箱包',
    '概念', '未来', '前瞻', '概念设计',
  ],

  /** 设计关键词 — 判断描述是否涉及设计思维 */
  designKeywords: [
    '功能', '材料', '工艺', '结构', '人体工学', '可持续',
    '色彩', '造型', '比例', '质感', '纹理', '表面处理',
    '用户', '场景', '体验', '流程', '交互', '界面',
    '创新', '专利', '技术', '研发', '解决方案',
    '市场', '用户需求', '痛点', '使用方式',
    '环保', '绿色', '节能', '低碳', '循环',
  ],

  /** 实质性内容指示器 — 参数/规格/具体技术细节 */
  substantiveIndicators: [
    // 尺寸与规格
    'mm', 'cm', 'm', 'kg', 'g', '度',
    '尺寸', '重量', '材质', '厚度', '直径', '长度',
    '宽度', '高度', '容积', '容量',
    // 材料
    '不锈钢', '塑料', '木材', '陶瓷', '玻璃', '布料',
    '皮革', '金属', '合金', '硅胶', '亚克力', '树脂',
    '碳纤维', '铝合金', 'ABS', 'PC', 'PP', 'TPU',
    // 工艺
    '注塑', '冲压', '3D打印', 'CNC', '压铸', '锻造',
    '焊接', '打磨', '抛光', '电镀', '喷涂', '丝印',
    // 技术
    '电池', '充电', '续航', '功率', '容量',
    '传感器', '芯片', '蓝牙', 'WiFi', 'APP',
    '电机', '发热', '散热', '防水', '防尘',
    // 认证
    '专利', '认证', '检测', '标准', 'CE', 'ROHS',
    'FDA', '3C', 'ISO',
  ],
}

/**
 * 检查输入质量
 * @returns QualityGateResult
 *
 * 置信度阈值：
 *   < 0.35 → 熔断：不返回奖项推荐，只输出改进引导
 *   < 0.55 → 警告：正常匹配但追加"可靠性提示"
 *   >= 0.55 → 正常匹配
 */
export function checkQualityGate(project: ProjectAssessment): QualityGateResult {
  const text = project.description || ''
  const title = project.name || ''
  const issues: string[] = []

  // ==========================================================
  // 闸1：信息量检查 — 长度、套话比例、是否重复标题
  // ==========================================================
  const charCount = text.length

  const fillerMatches = CONFIG.fillerWords.filter(w => text.includes(w))
  const fillerRatio = charCount > 0
    ? fillerMatches.length / Math.max(text.split(/[\s,，。.、！？?；;：:]/).length, 1)
    : 0

  const repeatsTitle = title.length > 3 && text.includes(title)

  if (charCount < 30) {
    issues.push('描述过短（少于30字），无法有效分析作品特征')
  } else if (charCount < 60) {
    issues.push('描述偏短，建议补充更多作品细节以提高匹配准确度')
  }

  if (fillerRatio > 0.6) {
    issues.push('描述中通用套话较多，缺乏针对作品的具体描述')
  }

  if (repeatsTitle) {
    issues.push('描述基本重复了作品名称，建议补充额外设计信息')
  }

  // ==========================================================
  // 闸2：设计相关性 — 是否提及设计领域和专业关键词
  // ==========================================================
  const domainTags = CONFIG.designDomains.filter(d => text.includes(d))
  const hasDomain = domainTags.length > 0 || project.type !== ''

  const designKeywordCount = CONFIG.designKeywords.filter(k => text.includes(k)).length

  if (!hasDomain) {
    issues.push('未明确提及设计领域（如产品设计、视觉传达、空间设计等）')
  }

  if (designKeywordCount === 0) {
    issues.push('缺少设计相关关键词描述')
  } else if (designKeywordCount < 3) {
    issues.push('设计关键词较少，建议从功能、材料、用户等角度补充描述')
  }

  // ==========================================================
  // 闸3：实质性内容 — 工艺参数、技术指标、具体规格
  // ==========================================================
  const substantiveMatches = CONFIG.substantiveIndicators.filter(s => text.includes(s))
  const hasSpecifics = substantiveMatches.length >= 2

  if (!hasSpecifics && charCount >= 30) {
    issues.push('缺乏工艺、材料或技术等具体参数，建议补充尺寸、材质、功能等细节')
  }

  // ==========================================================
  // 置信度计算 — 独立于奖项数量，纯基于输入质量
  // ==========================================================
  const lengthFactor = Math.min(charCount / 150, 0.25)
  const domainFactor = hasDomain ? 0.15 : 0
  const keywordFactor = Math.min(designKeywordCount * 0.05, 0.20)
  const substantiveFactor = (hasSpecifics ? 0.15 : 0) + (substantiveMatches.length >= 4 ? 0.05 : 0)
  const completionBonus = project.type !== '' ? 0.05 : 0

  const confidence = Math.min(
    0.25 + lengthFactor + domainFactor + keywordFactor + substantiveFactor + completionBonus,
    1.0,
  )

  const pass = confidence >= 0.35

  return {
    pass,
    confidence: Math.round(confidence * 100) / 100,
    issues,
    details: {
      charCount,
      fillerRatio: Math.round(fillerRatio * 100) / 100,
      hasDomain,
      designKeywords: designKeywordCount,
      specificity: hasSpecifics ? 1 : 0,
    },
  }
}

/**
 * 将质量门禁问题列表转为用户友好的提示文本
 * 展示在表单错误区域
 */
export function formatQualityIssues(issues: string[]): string {
  if (issues.length === 0) return ''
  return '请优化作品描述：\n• ' + issues.join('\n• ')
}
