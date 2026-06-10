import { ImageResponse } from 'next/og'

export const alt = 'DesignMatch — AI 设计奖项匹配工具'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            background: '#000',
            borderRadius: 6,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            DM
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#000',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          AI 设计奖项匹配
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: '#666',
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          iF · Red Dot · G-Mark · A' Design · D&AD · 30+
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 32,
            color: '#999',
            fontSize: 16,
          }}
        >
          <span>免费使用</span>
          <span>·</span>
          <span>AI 智能匹配</span>
          <span>·</span>
          <span>无需注册</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
