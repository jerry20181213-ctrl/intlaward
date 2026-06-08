'use server'

import { getSupabase, getServiceSupabase } from '@/lib/supabase/client'
import { User } from '@/lib/types'

const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days
const FREE_MONTHLY_QUOTA = 5

// In-memory stores (used when Supabase is not configured)
const codeStore = new Map<string, { code: string; expiresAt: number }>()
const sessionStore = new Map<string, { userId: string; expiresAt: number }>()
const aiUserStore = new Map<string, User>() // In-memory user store (dev mode)

// Clean expired entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of codeStore.entries()) { if (val.expiresAt < now) codeStore.delete(key) }
    for (const [key, val] of sessionStore.entries()) { if (val.expiresAt < now) sessionStore.delete(key) }
  }, 5 * 60 * 1000)
}

function db() {
  return getServiceSupabase()
}

// === Verification codes ===

export async function sendVerificationCode(phone: string): Promise<{ success: boolean; message: string; code?: string }> {
  if (!phone || phone.length < 10) {
    return { success: false, message: '请输入正确的手机号' }
  }

  const code = String(100000 + Math.floor(Math.random() * 900000))
  codeStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 })

  // In dev: log to console; in prod: send SMS via Aliyun/Twilio
  console.log(`[SMS] ${phone} → ${code}`)

  return {
    success: true,
    code,
    message: `验证码已发送到 ${phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
  }
}

// === Auth (verify code + create/find user) ===

export async function verifyCode(
  phone: string,
  code: string
): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
  const stored = codeStore.get(phone)
  if (!stored) return { success: false, message: '验证码已过期，请重新获取' }
  if (stored.code !== code) return { success: false, message: '验证码错误，请重试' }
  if (stored.expiresAt < Date.now()) { codeStore.delete(phone); return { success: false, message: '验证码已过期' } }

  codeStore.delete(phone)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const svc = db()

  let user: User

  if (svc) {
    // Supabase mode
    const { data: existing } = await svc.from('users').select('*').eq('phone', phone).single()
    if (existing) {
      user = existing as User
      if (user.quotaMonth !== currentMonth) {
        const { data: updated } = await svc.from('users').update({ monthly_assessments: 0, quota_month: currentMonth }).eq('id', user.id).select().single()
        if (updated) user = updated as User
      }
    } else {
      const { data: newUser } = await svc.from('users').insert({ phone, monthly_assessments: 0, quota_month: currentMonth }).select().single()
      if (!newUser) return { success: false, message: '创建用户失败' }
      user = newUser as User
    }
  } else {
    // In-memory mode (dev)
    const existing = Array.from(aiUserStore.values()).find(u => u.phone === phone)
    if (existing) {
      user = existing
      if (user.quotaMonth !== currentMonth) {
        user.monthlyAssessments = 0
        user.quotaMonth = currentMonth
        aiUserStore.set(user.id, user)
      }
    } else {
      user = {
        id: crypto.randomUUID(),
        phone,
        monthlyAssessments: 0,
        quotaMonth: currentMonth,
        createdAt: new Date().toISOString(),
      }
      aiUserStore.set(user.id, user)
    }
  }

  const token = crypto.randomUUID()
  sessionStore.set(token, { userId: user.id, expiresAt: Date.now() + SESSION_EXPIRY })

  return { success: true, user, token }
}

// === Session ===

export async function getSession(token: string): Promise<{ user?: User; error?: string }> {
  const session = sessionStore.get(token)
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionStore.delete(token)
    return { error: '未登录或会话已过期' }
  }

  const svc = db()
  if (svc) {
    const { data: user } = await svc.from('users').select('*').eq('id', session.userId).single()
    if (!user) return { error: '用户不存在' }
    return { user: user as User }
  }

  const user = aiUserStore.get(session.userId)
  if (!user) return { error: '用户不存在' }
  return { user }
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  const session = sessionStore.get(token)
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionStore.delete(token)
    return null
  }
  return session.userId
}

// === Quota ===

export async function checkQuota(userId: string): Promise<{ withinQuota: boolean; count: number; limit: number }> {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const svc = db()

  if (svc) {
    const { data: user } = await svc.from('users').select('monthly_assessments, quota_month').eq('id', userId).single()
    if (!user || user.quota_month !== currentMonth) return { withinQuota: true, count: 0, limit: FREE_MONTHLY_QUOTA }
    return { withinQuota: user.monthly_assessments < FREE_MONTHLY_QUOTA, count: user.monthly_assessments, limit: FREE_MONTHLY_QUOTA }
  }

  const user = aiUserStore.get(userId)
  if (!user || user.quotaMonth !== currentMonth) return { withinQuota: true, count: 0, limit: FREE_MONTHLY_QUOTA }
  return { withinQuota: user.monthlyAssessments < FREE_MONTHLY_QUOTA, count: user.monthlyAssessments, limit: FREE_MONTHLY_QUOTA }
}

export async function incrementUsage(userId: string): Promise<void> {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const svc = db()

  if (svc) {
    const { data: user } = await svc.from('users').select('monthly_assessments, quota_month').eq('id', userId).single()
    const current = user?.quota_month === currentMonth ? (user.monthly_assessments ?? 0) : 0
    await svc.from('users').update({ monthly_assessments: current + 1, quota_month: currentMonth }).eq('id', userId)
    return
  }

  const user = aiUserStore.get(userId)
  if (user) {
    if (user.quotaMonth === currentMonth) {
      user.monthlyAssessments++
    } else {
      user.monthlyAssessments = 1
      user.quotaMonth = currentMonth
    }
  }
}
