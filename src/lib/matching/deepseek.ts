// DeepSeek API client for text analysis
// MVP uses text-only analysis (no image analysis)

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface AnalysisResult {
  styleTags: string[]
  maturityLevel: number // 0-1
  marketTilt: string
  innovationScore: number
  aestheticsScore: number
  functionalityScore: number
  summary: string
}

export async function analyzeProject(description: string, type: string): Promise<AnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    // Fallback: return default scores when no API key configured
    console.warn('DEEPSEEK_API_KEY not configured, using default scores')
    return getDefaultAnalysis(type)
  }

  const prompt = `你是一个专业的设计奖项评审顾问。请分析以下设计项目的描述，并输出项目的风格特征、成熟度、市场倾向和评分。

项目类型：${type || '未指定'}
项目描述：${description}

请以JSON格式输出：
{
  "styleTags": ["风格标签1", "风格标签2", ...],
  "maturityLevel": 0.0-1.0 (0=概念, 1=高度成熟),
  "marketTilt": "国内"/"欧美"/"全球"/"不限",
  "innovationScore": 0-100,
  "aestheticsScore": 0-100,
  "functionalityScore": 0-100,
  "summary": "一句话总结"
}

只输出JSON，不要额外文字。`

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      styleTags: parsed.styleTags || [],
      maturityLevel: parsed.maturityLevel || 0.5,
      marketTilt: parsed.marketTilt || '不限',
      innovationScore: parsed.innovationScore || 50,
      aestheticsScore: parsed.aestheticsScore || 50,
      functionalityScore: parsed.functionalityScore || 50,
      summary: parsed.summary || '',
    }
  } catch (error) {
    console.error('DeepSeek analysis failed:', error)
    return getDefaultAnalysis(type)
  }
}

function getDefaultAnalysis(type: string): AnalysisResult {
  const defaults: Record<string, Partial<AnalysisResult>> = {
    product: { styleTags: ['functional', 'minimal'], innovationScore: 60, aestheticsScore: 55, functionalityScore: 70 },
    visual: { styleTags: ['creative', 'bold'], innovationScore: 55, aestheticsScore: 75, functionalityScore: 45 },
    space: { styleTags: ['spatial', 'organic'], innovationScore: 55, aestheticsScore: 65, functionalityScore: 55 },
    interaction: { styleTags: ['innovative', 'user-centric'], innovationScore: 65, aestheticsScore: 55, functionalityScore: 65 },
    fashion: { styleTags: ['creative', 'bold'], innovationScore: 60, aestheticsScore: 70, functionalityScore: 40 },
    service: { styleTags: ['holistic', 'user-centric'], innovationScore: 65, aestheticsScore: 45, functionalityScore: 65 },
    concept: { styleTags: ['visionary', 'bold'], innovationScore: 75, aestheticsScore: 50, functionalityScore: 40 },
  }

  const base = defaults[type] || { styleTags: ['creative'], innovationScore: 55, aestheticsScore: 55, functionalityScore: 55 }

  return {
    styleTags: base.styleTags || [],
    maturityLevel: 0.5,
    marketTilt: '不限',
    innovationScore: base.innovationScore || 50,
    aestheticsScore: base.aestheticsScore || 50,
    functionalityScore: base.functionalityScore || 50,
    summary: '',
  }
}
