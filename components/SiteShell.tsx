'use client'

import { usePathname } from 'next/navigation'
import Sidebar, { type SearchDoc, type TagItem } from '@/components/Sidebar'
import PlayerBar from '@/components/PlayerBar'

/** 站点外壳：桌面端为内容让出左栏宽度，主页保持全屏不加栏 */
export default function SiteShell({
  docs,
  tags,
  children,
}: {
  docs: SearchDoc[]
  tags: TagItem[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <Sidebar docs={docs} tags={tags} hidden={isHome} />

      {/* 右侧对称边栏：暂时只做背景，不放内容 */}
      {!isHome && (
        <aside
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-72 border-l border-white/40 xl:block"
        >
          <div className="absolute inset-0 bg-[url('/images/clouds-banner.jpg')] bg-cover bg-[position:48%_center]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/45 to-white/60" />
        </aside>
      )}

      <div className={isHome ? undefined : 'lg:pl-72 xl:pr-72'}>
        {/* 移动端给左上角的汉堡按钮留出高度，避免和页面的返回链接重叠 */}
        <div className={isHome ? undefined : 'pt-14 lg:pt-0'}>{children}</div>
      </div>

      <PlayerBar />
    </>
  )
}
