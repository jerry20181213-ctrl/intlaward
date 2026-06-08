'use client'

import { useEffect, useState } from 'react'

interface RadarChartProps {
  /** Award weights (0-100) for each dimension */
  awardWeights: {
    innovation: number
    aesthetics: number
    functionality: number
    craftsmanship: number
    socialImpact: number
    commercial: number
  }
  /** Project scores (0-100) for each dimension */
  projectScores?: {
    innovation: number
    aesthetics: number
    functionality: number
    craftsmanship: number
    socialImpact: number
    commercial: number
  }
  size?: number
}

const LABELS: Record<string, string> = {
  innovation: '创新性',
  aesthetics: '美学',
  functionality: '功能性',
  craftsmanship: '工艺',
  socialImpact: '社会影响',
  commercial: '商业价值',
}

const DIMS = ['innovation', 'aesthetics', 'functionality', 'craftsmanship', 'socialImpact', 'commercial'] as const

export function RadarChart({
  awardWeights,
  projectScores,
  size = 180,
}: RadarChartProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const labelRadius = size * 0.46

  const toRad = (deg: number) => (deg * Math.PI) / 180
  // Start from top (270° = -90°), step 60° clockwise
  const getPoint = (value: number, index: number) => {
    const angle = -90 + index * 60
    const r = (value / 100) * radius
    return {
      x: cx + r * Math.cos(toRad(angle)),
      y: cy + r * Math.sin(toRad(angle)),
    }
  }

  const getLabelPos = (index: number) => {
    const angle = -90 + index * 60
    const r = labelRadius
    // Offset labels from the exact point
    const offset = 14
    let x = cx + r * Math.cos(toRad(angle))
    let y = cy + r * Math.sin(toRad(angle))

    // Adjust for better positioning
    if (index === 0) { y -= offset }
    else if (index === 1) { x += offset; y -= offset * 0.6 }
    else if (index === 2) { x += offset; y += offset * 0.3 }
    else if (index === 3) { y += offset }
    else if (index === 4) { x -= offset; y += offset * 0.3 }
    else if (index === 5) { x -= offset; y -= offset * 0.6 }

    return { x, y }
  }

  // Build polygon points string from values
  const getPolygon = (values: number[], animating: boolean) => {
    const pts = values.map((v, i) => {
      const p = getPoint(animating ? v : 0, i)
      return `${p.x},${p.y}`
    })
    return pts.join(' ')
  }

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid levels */}
      {gridLevels.map((level) => {
        const pts = DIMS.map((_, i) => {
          const p = getPoint(level, i)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Axis lines */}
      {DIMS.map((_, i) => {
        const p = getPoint(100, i)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#e5e5e5"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Project scores (inner polygon) */}
      {projectScores && (
        <polygon
          points={getPolygon(
            DIMS.map((d) => projectScores[d]),
            animate
          )}
          fill="rgba(0,0,0,0.06)"
          stroke="#737373"
          strokeWidth={1.5}
          strokeDasharray="4,3"
          className="transition-all duration-700 ease-out"
        />
      )}

      {/* Award weights (outer polygon) */}
      <polygon
        points={getPolygon(
          DIMS.map((d) => awardWeights[d] * 100),
          animate
        )}
        fill="rgba(0,0,0,0.04)"
        stroke="#000000"
        strokeWidth={1.5}
        className="transition-all duration-700 ease-out"
      />

      {/* Points on award polygon */}
      {DIMS.map((d, i) => {
        const p = getPoint(awardWeights[d] * 100, i)
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="#000000"
            className="transition-all duration-700 ease-out"
          />
        )
      })}

      {/* Labels */}
      {DIMS.map((d, i) => {
        const pos = getLabelPos(i)
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[9px] fill-[#737373]"
            style={{ fontSize: '9px', fontFamily: 'inherit' }}
          >
            {LABELS[d]}
          </text>
        )
      })}
    </svg>
  )
}
