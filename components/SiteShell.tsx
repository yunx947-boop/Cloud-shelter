'use client'

import { usePathname } from 'next/navigation'
import Sidebar, { type SearchDoc, type TagItem } from '@/components/Sidebar'

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
      <div className={isHome ? undefined : 'lg:pl-64'}>{children}</div>
    </>
  )
}
