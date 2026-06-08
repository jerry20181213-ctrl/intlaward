'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const codeInputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 11)
  }

  const handleSendCode = async () => {
    if (phone.length < 11) {
      setError('请输入完整的手机号')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || '发送失败')
      } else {
        // Dev mode: show code on screen since no SMS gateway is configured
        if (data.devCode) {
          setMessage(`${data.message}（开发模式验证码：${data.devCode}）`)
        } else {
          setMessage(data.message)
        }
        setStep('code')
        setTimeout(() => codeInputs.current[0]?.focus(), 100)
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length < 6) {
      setError('请输入完整的验证码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: fullCode }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || '验证失败')
      } else {
        localStorage.setItem('da_token', data.token)
        localStorage.setItem('da_user', JSON.stringify(data.user))
        router.push('/assess')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('da_token')
    if (token) router.push('/assess')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-[var(--border)] bg-white p-8">
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-black flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-sm font-mono font-bold">⊕</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">登录 / 注册</h1>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">输入手机号，接收验证码即可使用</p>
          </div>

          {message && (
            <div className="mb-4 p-3 border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <div className="space-y-4">
              <Input
                label="手机号"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                maxLength={11}
                type="tel"
              />
              <Button onClick={handleSendCode} loading={loading} className="w-full">
                发送验证码
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xs text-[var(--text-tertiary)]">验证码已发送至</p>
                <p className="text-sm font-medium">{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</p>
              </div>

              <div className="flex justify-center gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { codeInputs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono border border-[var(--border)] focus:border-black focus:outline-none"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setStep('phone'); setCode(['','','','','','']); setMessage('') }} className="flex-1">
                  更换号码
                </Button>
                <Button onClick={handleVerify} loading={loading} className="flex-1">
                  验证
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-4 tracking-wider">
          登录即表示同意服务条款和隐私政策
        </p>
      </div>
    </div>
  )
}
