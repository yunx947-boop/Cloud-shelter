interface CoverArtProps {
  /** 用 slug 或标题做种子，同一篇文章永远得到同一张 */
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
 * 程序化封面：冷灰蓝的天 + 层层叠压的云 + 云缝里漏下的一团暖光。
 * 纯内联 SVG，零外部资源；同一 seed 永远输出同一张。
 * 这是「没自己配图时」的兜底，不是设计主体。
 */
export default function CoverArt({ seed, className = '' }: CoverArtProps) {
  const id = hashSeed(seed)
  const rand = makeRandom(id)
  const between = (min: number, max: number) => min + rand() * (max - min)

  // 四层云：两层压暗、两层提亮，交替叠出体积
  const layers = Array.from({ length: 4 }, (_, i) => ({
    cy: between(48, 168),
    rx: between(150, 250),
    ry: between(22, 42),
    tone: i % 2 === 0 ? 'shade' : 'light',
    opacity: (0.5 + rand() * 0.3).toFixed(2),
  }))

  const glow = {
    cx: between(90, 230),
    cy: between(120, 176),
    rx: between(90, 150),
    ry: between(46, 74),
  }

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9d9e3" />
          <stop offset="55%" stopColor="#e2ebf0" />
          <stop offset="100%" stopColor="#f6efe6" />
        </linearGradient>
        <radialGradient id={`shade-${id}`}>
          <stop offset="45%" stopColor="#a8bfcc" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a8bfcc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`light-${id}`}>
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0%" stopColor="#efb887" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#efb887" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="200" fill={`url(#sky-${id})`} />

      {/* 云缝暖光：先铺光，再让云压上去 */}
      <ellipse cx={glow.cx} cy={glow.cy} rx={glow.rx} ry={glow.ry} fill={`url(#glow-${id})`} />

      {layers.map((l, i) => (
        <ellipse
          key={i}
          cx={between(60, 260).toFixed(0)}
          cy={l.cy.toFixed(0)}
          rx={l.rx.toFixed(0)}
          ry={l.ry.toFixed(0)}
          fill={`url(#${l.tone}-${id})`}
          opacity={l.opacity}
        />
      ))}
    </svg>
  )
}
