import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/client'
import { matchProject } from '@/lib/matching/engine'
import { ProjectAssessment } from '@/lib/types'

// In-memory assessment cache
const assessmentCache = new Map<string, any>()

// Clean cache every hour
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const oneHourAgo = Date.now() - 3600000
    for (const [key, val] of assessmentCache.entries()) {
      if (val.timestamp < oneHourAgo) assessmentCache.delete(key)
    }
  }, 3600000)
}

const DEV_USER_ID = 'dev-user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project: ProjectAssessment = {
      name: body.name || '',
      type: body.type || '',
      industry: body.industry || '',
      market: body.market || '',
      stage: body.stage || '',
      budget: body.budget || '',
      description: body.description || '',
      imageCount: body.imageCount || 0,
    }

    if (!project.name || !project.description) {
      return NextResponse.json({ message: '请填写必填字段' }, { status: 400 })
    }

    // Run matching
    const results = await matchProject(project)

    // Store assessment
    const svc = getServiceSupabase()
    const assessmentId = crypto.randomUUID()

    if (svc) {
      const { error: dbError } = await svc.from('assessments').insert({
        id: assessmentId,
        user_id: DEV_USER_ID,
        project_name: project.name,
        project_type: project.type,
        industry: project.industry,
        target_market: project.market,
        project_stage: project.stage,
        budget_range: project.budget,
        description: project.description,
        image_count: project.imageCount,
        results: results,
      })
      if (dbError) console.error('DB insert error:', dbError)
    }

    // Cache for GET lookup
    assessmentCache.set(assessmentId, {
      results,
      projectName: project.name,
      timestamp: Date.now(),
    })

    return NextResponse.json({ id: assessmentId, results })
  } catch (error) {
    console.error('Assess error:', error)
    return NextResponse.json({ message: '评估失败，请重试' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')

    if (assessmentId) {
      // Try cache first
      const cached = assessmentCache.get(assessmentId)
      if (cached) {
        return NextResponse.json({
          id: assessmentId,
          results: cached.results,
          projectName: cached.projectName,
        })
      }

      // Try DB
      const svc = getServiceSupabase()
      if (svc) {
        const { data } = await svc
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single()

        if (data) {
          return NextResponse.json({
            id: data.id,
            results: data.results,
            projectName: data.project_name,
          })
        }
      }

      return NextResponse.json({ message: '评估记录不存在' }, { status: 404 })
    }

    return NextResponse.json({ message: '缺少评估ID' }, { status: 400 })
  } catch (error) {
    console.error('Assess GET error:', error)
    return NextResponse.json({ message: '加载失败' }, { status: 500 })
  }
}
