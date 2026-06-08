import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/lib/auth/auth'
import { getServiceSupabase } from '@/lib/supabase/client'

const MOCK_PARTNERS = [
  {
    id: 'partner-1',
    name: '设计奖项申报中心',
    description: '专业国际设计奖项代申报机构，服务覆盖 iF、Red Dot、G-Mark 等全球主流奖项。',
    contactPhone: '400-888-0001',
    serviceScope: ['代报名', '材料翻译', '作品排版', '全程跟进'],
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'partner-2',
    name: '佳创设计咨询',
    description: '专注华人设计师国际奖项申报，累计帮助 200+ 设计师获得国际奖项。',
    contactPhone: '400-888-0002',
    serviceScope: ['奖项策略', '作品包装', '申报材料', '获奖推广'],
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'partner-3',
    name: '红点直通车',
    description: '国内最早从事 Red Dot 代申报的机构之一，近几年获奖率行业领先。',
    contactPhone: '400-888-0003',
    serviceScope: ['Red Dot 专项', 'iF 专项', 'G-Mark 专项', '紧急申报'],
    isActive: true,
    createdAt: '2026-01-01',
  },
]

export async function GET() {
  // TODO: Read from Supabase partners table
  // For MVP, return hardcoded partners
  return NextResponse.json({ partners: MOCK_PARTNERS })
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: '请先登录' }, { status: 401 })
    }

    const userId = await getUserIdFromToken(token)
    if (!userId) {
      return NextResponse.json({ message: '登录已过期' }, { status: 401 })
    }

    const { partnerId, name, contact, message } = await request.json()

    if (!partnerId || !name || !contact) {
      return NextResponse.json({ message: '请填写必填字段' }, { status: 400 })
    }

    // TODO: Store to Supabase partner_leads table
    const svc = getServiceSupabase()
    await svc.from('partner_leads').insert({
      partner_id: partnerId,
      user_id: userId,
      user_name: name,
      user_contact: contact,
      message: message || '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Partner lead error:', error)
    return NextResponse.json({ success: false, message: '提交失败' }, { status: 500 })
  }
}
