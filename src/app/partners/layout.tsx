import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '合作申报机构 | DesignMatch — 专业奖项申报服务',
  description: '联系我们的合作机构，获得专业的国际设计奖项申报服务。覆盖 iF、Red Dot、G-Mark、A\' Design 等 30+ 奖项。',
  alternates: {
    canonical: '/partners',
  },
}

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
