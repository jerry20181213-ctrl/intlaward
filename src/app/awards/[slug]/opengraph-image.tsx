import { ImageResponse } from 'next/og'
import { awards } from '@/lib/data/awards'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const award = awards.find((a) => a.slug === slug)

  const nameCn = award?.nameCn ?? '设计奖项'
  const nameEn = award?.name ?? ''
  const desc = award?.description?.slice(0, 80) ?? ''
  const difficulty = award?.difficulty ?? 1
  const winRate = award?.winRate ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
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

        {/* Top label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: '#000',
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: 14, color: '#999', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            设计奖项
          </span>
        </div>

        {/* Award name */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#000',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {nameCn}
        </h1>

        {nameEn && (
          <p
            style={{
              fontSize: 28,
              color: '#666',
              margin: '8px 0 0 0',
            }}
          >
            {nameEn}
          </p>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: 20,
            color: '#888',
            marginTop: 16,
            marginBottom: 0,
            lineHeight: 1.4,
          }}
        >
          {desc}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid #eee',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>难度</span>
            <span style={{ fontSize: 20, color: '#000' }}>{'★'.repeat(difficulty)}{'☆'.repeat(3 - difficulty)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>获奖率</span>
            <span style={{ fontSize: 20, color: '#000' }}>{winRate}%</span>
          </div>
        </div>

        {/* Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: '#000',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>DM</span>
          </div>
          <span style={{ fontSize: 14, color: '#bbb' }}>DesignMatch</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
