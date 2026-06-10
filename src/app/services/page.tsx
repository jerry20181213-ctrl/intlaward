import Link from 'next/link'
import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { partners } from '@/lib/data/partners'

export const metadata = {
  title: '增值服务 | DesignMatch',
  description: '国际设计奖项申报配套服务 — 材料翻译、作品文案、代申报、获奖推广等一站式解决方案。',
  openGraph: {
    title: '增值服务 — DesignMatch',
    description: '设计奖项申报配套服务，专业团队助你提高获奖概率',
  },
}

const SERVICES = [
  {
    title: '奖项评估与策略',
    description: '由资深设计师对作品进行专业评估，制定最优奖项申报组合策略。',
    features: ['作品风格与奖项匹配度分析', '个人定制申报策略', '竞争力评估报告', '竞争对手分析'],
    price: '免费 — ¥999',
    note: '基础评估免费，深度分析收费',
  },
  {
    title: '申报材料优化',
    description: '专业团队协助优化作品描述、设计说明和申报文案。',
    features: ['中文/英文项目描述撰写', '设计理念提炼与包装', '申报表格填写指导', '材料格式审核与优化'],
    price: '¥1,500 起',
    note: '按项目复杂度定价',
  },
  {
    title: '翻译服务',
    description: '母语级翻译服务，确保申报材料的语言质量。',
    features: ['中译英 / 英译中', '专业设计术语准确', '母语审校润色', '免费修改至满意'],
    price: '¥0.8 — 2.0 / 字',
    note: '根据字数和技术难度定价',
  },
  {
    title: '代申报服务',
    description: '全流程代申报，从注册到提交全程托管。',
    features: ['账号注册与资料填写', '材料上传与格式转换', '费用代缴', '进度追踪与提醒'],
    price: '¥800 起 / 项',
    note: '不含报名费',
  },
  {
    title: '获奖推广包',
    description: '获奖后最大化奖项价值，提升品牌影响力。',
    features: ['新闻稿撰写与发布', '社交媒体推广', '官网/作品集更新建议', '颁奖典礼行程协助'],
    price: '¥3,000 起',
    note: '按推广渠道数量定价',
  },
  {
    title: 'VIP全程陪跑',
    description: '从评估到获奖的全流程一站式服务，含不限次优化。',
    features: ['不限次材料优化', '无限申报策略咨询', '全部材料翻译', '获奖推广全套', '专属项目经理'],
    price: '¥8,800 / 年',
    note: '年度会员制',
  },
]

export default function ServicesPage() {
  const activePartners = partners.filter(p => p.isActive)

  return (
    <div className="container-tight py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] mb-8">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">首页</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">增值服务</span>
      </div>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          增值服务
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          从评估策略到获奖推广，专业团队助你走好奖项申报的每一步。所有服务由我们的合作机构提供。
        </p>
      </header>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)] mb-12">
        {SERVICES.map(service => (
          <div key={service.title} className="bg-white p-6 flex flex-col">
            <div className="flex-1">
              <h2 className="font-bold text-sm mb-2">{service.title}</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="space-y-1.5 mb-6">
                {service.features.map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-[11px] text-[var(--text-tertiary)]">
                    <Check className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-[var(--border-light)]">
              <div className="font-bold text-base mb-0.5">{service.price}</div>
              {service.note && (
                <div className="text-[10px] text-[var(--text-tertiary)]">{service.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Partners section */}
      {activePartners.length > 0 && (
        <div className="mb-12">
          <h2 className="font-bold text-sm mb-4">合作机构</h2>
          <div className="space-y-px bg-[var(--border-light)]">
            {activePartners.map(partner => (
              <div key={partner.id} className="bg-white p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{partner.name}</h3>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                    {partner.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.serviceScope.map(s => (
                      <span key={s} className="text-[9px] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-[10px] text-[var(--text-tertiary)]">
                  📞 {partner.contactPhone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <h2 className="font-bold text-sm mb-2">需要定制服务方案？</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          联系我们的合作机构，获取一对一咨询服务
        </p>
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-2.5 text-xs tracking-wide hover:bg-[#1a1a1a] transition-colors"
        >
          查看合作机构
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
