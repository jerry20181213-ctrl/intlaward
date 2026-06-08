import { NextRequest, NextResponse } from 'next/server'
import { awards } from '@/lib/data/awards'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Authorization')
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ awards })
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get('Authorization')
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // For MVP, admin edits are not persisted across deploys
  // This would require a database or GitHub API integration
  return NextResponse.json({
    message: '奖项数据以静态文件维护。请直接编辑 src/lib/data/awards.ts 文件并重新部署。',
  })
}
