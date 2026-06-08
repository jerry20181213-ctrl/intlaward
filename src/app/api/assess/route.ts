import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken, checkQuota, incrementUsage } from '@/lib/auth/auth'
import { getServiceSupabase } from '@/lib/supabase/client'
import { matchProject } from '@/lib/matching/engine'
import { ProjectAssessment } from '@/lib/types'

// In-memory assessment cache (for matching results)
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

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: '请先登录' }, { status: 401 })
    }

    const userId = await getUserIdFromToken(token)
    if (!userId) {
      return NextResponse.json({ message: '登录已过期，请重新登录' }, { status: 401 })
    }

    // Check quota
    const quota = await checkQuota(userId)
    if (!quota.withinQuota) {
      return NextResponse.json({
        message: `本月免费评估次数已用完（${quota.limit}次），下月重置`,
      }, { status: 429 })
    }

    // Parse project data
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

    // Store assessment (in-memory for dev, Supabase for prod)
    const svc = getServiceSupabase()
    const assessmentId = crypto.randomUUID()

    if (svc) {
      const { error: dbError } = await svc.from('assessments').insert({
        id: assessmentId,
        user_id: userId,
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
    } else {
      console.log('[Dev] Supabase not configured, assessment stored in memory only')
    }

    // Increment usage
    await incrementUsage(userId)

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
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: '请先登录' }, { status: 401 })
    }

    const userId = await getUserIdFromToken(token)
    if (!userId) {
      return NextResponse.json({ message: '登录已过期' }, { status: 401 })
    }

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
          .eq('user_id', userId)
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

    // List all assessments for user
    const svc = getServiceSupabase()
    const { data: assessments } = await svc
      .from('assessments')
      .select('id, project_name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({ assessments: assessments || [] })
  } catch (error) {
    console.error('Assess GET error:', error)
    return NextResponse.json({ message: '加载失败' }, { status: 500 })
  }
}
