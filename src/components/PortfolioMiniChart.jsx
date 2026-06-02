import React from 'react'

export default function PortfolioMiniChart({ holdings = [], size = 120 }) {
  const total = holdings.reduce((s, h) => s + (h.value || 0), 0) || 1
  let angle = -90
  const r = Math.floor(size * 0.33)
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`translate(${size/2},${size/2})`}>
        {holdings.map((h, i) => {
          const portion = (h.value || 0) / total
          const a = portion * 360
          const large = a > 180 ? 1 : 0
          const start = (angle * Math.PI) / 180
          const end = ((angle + a) * Math.PI) / 180
          const x1 = Math.cos(start) * r
          const y1 = Math.sin(start) * r
          const x2 = Math.cos(end) * r
          const y2 = Math.sin(end) * r
          const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
          angle += a
          return <path key={i} d={path} fill={h.color || '#888'} stroke="#0f0e0b" strokeWidth="0.5" />
        })}
        <circle r={Math.floor(r * 0.45)} fill="#0f0e0b" />
      </g>
    </svg>
  )
}
