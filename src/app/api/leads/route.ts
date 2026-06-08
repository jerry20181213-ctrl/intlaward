import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/client'

// In-memory store for dev mode
const leadStore: Array<{ name: string; phone: string; projectName: string; createdAt: string }> = []

export async function POST(request: NextRequest) {
  try {
    const { name, phone, projectName } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: '请填写姓名和手机号' }, { status: 400 })
    }

    if (phone.length < 10) {
      return NextResponse.json({ success: false, message: '请输入正确的手机号' }, { status: 400 })
    }

    const entry = {
      name,
      phone,
      projectName: projectName || '',
      createdAt: new Date().toISOString(),
    }

    // Try Supabase first
    const svc = getServiceSupabase()
    if (svc) {
      const { error } = await svc.from('leads').insert(entry)
      if (error) {
        console.error('Lead insert error:', error)
        // Fallback to in-memory
        leadStore.push(entry)
      }
    } else {
      leadStore.push(entry)
      console.log('[Lead]', entry)
    }

    return NextResponse.json({ success: true, message: '提交成功' })
  } catch (error) {
    console.error('Lead error:', error)
    return NextResponse.json({ success: false, message: '提交失败' }, { status: 500 })
  }
}
