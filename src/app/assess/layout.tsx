import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 评估作品 | DesignMatch — 免费设计奖项匹配',
  description: '上传你的设计作品，AI 智能分析并免费推荐最匹配的国际设计奖项。支持 iF、Red Dot、G-Mark、A\' Design 等 30+ 奖项。',
  alternates: {
    canonical: '/assess',
  },
}

export default function AssessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
