interface CoverArtProps {
  /** 用 slug 或标题做种子，同一篇文章永远得到同一张图 */
  seed: string
  className?: string
}

/** 简单字符哈希，保证同一 seed 稳定出图 */
function hashSeed(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32：轻量可复现伪随机 */
function makeRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 程序化封面：冷灰蓝底 + 半透明重叠云层 + 云缝一线暖光。
 * 纯 SVG 内联，不加载任何外部资源；同一 seed 永远输出同一张。
 * 这是「没自己配图时」的兜底，不是设计主体。
 */
export default function CoverArt({ seed, className = '' }: CoverArtProps) {
  const id = hashSeed(seed)
  const rand = makeRandom(id)
  const pick = (min: number, max: number) => min + rand() * (max - min)

  const blobs = Array.from({ length: 3 }, (_, i) => ({
    cx: pick(40, 280),
    cy: pick(30, 170),
    rx: pick(70, 130),
    ry: pick(40, 80),
    fill: i === 1 ? 'warm' : 'cool',
    opacity: pick(0.35, 0.6).toFixed(2),
  }))
  const seamY = pick(70, 150).toFixed(0)

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde6ea" />
          <stop offset="100%" stopColor="#f4ece2" />
        </linearGradient>
        <radialGradient id={`cool-${id}`}>
          <stop offset="0%" stopColor="#b7c9d3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#b7c9d3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`warm-${id}`}>
          <stop offset="0%" stopColor="#e8d5c4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e8d5c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="200" fill={`url(#bg-${id})`} />

      {blobs.map((b, i) => (
        <ellipse
          key={i}
          cx={b.cx.toFixed(0)}
          cy={b.cy.toFixed(0)}
          rx={b.rx.toFixed(0)}
          ry={b.ry.toFixed(0)}
          fill={`url(#${b.fill}-${id})`}
          opacity={b.opacity}
        />
      ))}

      {/* 云缝里漏下的一线暖光 */}
      <rect x="0" y={seamY} width="320" height="1.5" fill="#e8b98a" opacity="0.45" />
    </svg>
  )
}
