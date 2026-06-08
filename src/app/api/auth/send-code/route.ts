import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationCode } from '@/lib/auth/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, message: '请输入手机号' }, { status: 400 })
    }

    const result = await sendVerificationCode(phone)

    // Dev mode: include code in response for debugging
    const devMode = !process.env.NEXT_PUBLIC_SUPABASE_URL
    if (devMode && result.code) {
      return NextResponse.json({ ...result, devCode: result.code })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json({ success: false, message: '发送失败，请重试' }, { status: 500 })
  }
}
