import Link from 'next/link'
import type { CloudIsland } from '@/lib/constants'

interface CloudCardProps {
  island: CloudIsland
}

/** 云岛导航卡片：毛玻璃 + hover 上浮；筹备中条目不可点击 */
export default function CloudCard({ island }: CloudCardProps) {
  const inner = (
    <>
      {/* 图标 32px */}
      <span className="block text-[32px] leading-none" aria-hidden="true">
        {island.icon}
      </span>
      {/* 标题 16px / 400 / #4A4A4A */}
      <span className="mt-3 block text-base font-normal leading-relaxed text-ink">
        {island.title}
      </span>
      {/* 描述 14px / 300 / #8A8A8A */}
      <span className="mt-1 block text-sm font-light leading-relaxed text-ink-sub">
        {island.desc}
      </span>
    </>
  )

  // 还在路上：渲染不可点击的占位卡片
  if (island.comingSoon) {
    return (
      <div className="glass relative block h-full px-4 py-5 text-center opacity-60">
        {inner}
        <span className="absolute right-3 top-3 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-light text-ink-faint">
          还在路上
        </span>
      </div>
    )
  }

  return (
    <Link href={island.href} className="glass glass-hover block h-full px-4 py-5 text-center">
      {inner}
    </Link>
  )
}
