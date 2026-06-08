import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/auth/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ success: false, message: '参数不完整' }, { status: 400 })
    }

    const result = await verifyCode(phone, code)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json({ success: false, message: '验证失败' }, { status: 500 })
  }
}
