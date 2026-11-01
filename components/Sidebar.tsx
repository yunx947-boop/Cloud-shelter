'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface SearchDoc {
  slug: string
  title: string
  desc: string
  body: string
}

export interface TagItem {
  name: string
  count: number
}

const navItems = [
  { href: '/', label: '首页' },
  { href: '/clouds', label: '单行道' },
  { href: '/music', label: '留声机' },
  { href: '/chat', label: '树洞' },
  { href: '/about', label: '关于' },
]

/** 左侧导航栏：头像、站名、搜索、分区、内容分类 */
export default function Sidebar({
  docs,
  tags,
  hidden,
}: {
  docs: SearchDoc[]
  tags: TagItem[]
  hidden?: boolean
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [roadOpen, setRoadOpen] = useState(
    () => pathname === '/clouds' || pathname.startsWith('/tags'),
  )
  const inputRef = useRef<HTMLInputElement>(null)

  // 换页时收起抽屉、清空搜索
  useEffect(() => {
    setOpen(false)
    setQ('')
    // 进到单行道或标签页时，自动展开它下面的分类
    if (pathname === '/clouds' || pathname.startsWith('/tags')) setRoadOpen(true)
  }, [pathname])

  // Ctrl/Cmd + K 唤起搜索，Esc 清空
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        window.setTimeout(() => inputRef.current?.focus(), 60)
      }
      if (e.key === 'Escape') setQ('')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return docs
      .filter((d) => `${d.title} ${d.desc} ${d.body}`.toLowerCase().includes(term))
      .slice(0, 5)
  }, [q, docs])

  if (hidden) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* 移动端唤起按钮 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开导航"
        className="fixed left-4 top-4 z-40 rounded-full border border-white/50 bg-white/70 px-3 py-2 text-sm text-ink shadow-sm backdrop-blur-md lg:hidden"
      >
        ☰
      </button>

      {/* 抽屉遮罩 */}
      {open && (
        <button
          type="button"
          aria-label="关闭导航"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-hidden border-r border-white/40 transition-transform duration-300 lg:w-80 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 背景：单行道原图 + 半透明白色蒙版 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/images/clouds-banner.jpg')] bg-cover bg-[position:35%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/45 to-white/60"
        />
        <div className="relative z-10 h-full overflow-y-auto px-6 py-8">
        {/* 头像 + 站名 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/about-cat.jpg"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
          <span>
            <span className="block font-serif text-lg font-normal tracking-wide text-ink">云端庇护所</span>
            <span className="mt-1 block text-xs font-light leading-relaxed text-ink-mute">
              单行道上，云在飘
            </span>
          </span>
        </Link>

        {/* 搜索 */}
        <div className="relative mt-6">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索文章"
            className="w-full rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5 pr-16 text-[15px] text-ink backdrop-blur-sm placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-sand/60 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
            Ctrl K
          </kbd>

          {q.trim() !== '' && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-white/60 bg-white/95 shadow-lg backdrop-blur">
              {results.length > 0 ? (
                <ul>
                  {results.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/article/${r.slug}`}
                        onClick={() => setQ('')}
                        className="block px-3 py-2 text-sm text-ink transition-colors hover:bg-amber-soft"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-xs font-light text-ink-faint">没有匹配的文章</p>
              )}
            </div>
          )}
        </div>

        {/* 分区导航：单行道带可折叠的分类子菜单 */}
        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            if (item.href !== '/clouds') {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3.5 py-2.5 text-[15px] backdrop-blur-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/85 font-normal text-ink'
                      : 'bg-white/40 font-light text-ink-sub hover:bg-white/70 hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }

            const roadActive = pathname === '/clouds' || pathname.startsWith('/tags')
            return (
              <div key={item.href}>
                <div
                  className={`flex items-center rounded-xl backdrop-blur-sm transition-colors ${
                    isActive(item.href) ? 'bg-white/85' : 'bg-white/40 hover:bg-white/70'
                  }`}
                >
                  <Link
                    href={item.href}
                    className={`flex-1 rounded-xl px-3.5 py-2.5 text-[15px] transition-colors ${
                      roadActive ? 'font-normal text-ink' : 'font-light text-ink-sub'
                    }`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRoadOpen((v) => !v)}
                    aria-label={roadOpen ? '收起分类' : '展开分类'}
                    aria-expanded={roadOpen}
                    className="px-3 py-2.5 text-xs text-ink-faint transition-colors hover:text-ink"
                  >
                    <span className={`inline-block transition-transform duration-200 ${roadOpen ? 'rotate-90' : ''}`}>
                      ▸
                    </span>
                  </button>
                </div>

                {roadOpen && (
                  <div className="ml-3.5 mt-1.5 space-y-0.5 border-l border-sand/70 pl-3.5">
                    <Link
                      href="/clouds"
                      className={`block rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                        pathname === '/clouds'
                          ? 'bg-white/70 font-normal text-ink'
                          : 'bg-white/30 font-light text-ink-sub hover:bg-white/60 hover:text-ink'
                      }`}
                    >
                      全部
                    </Link>
                    {tags.map((t) => {
                      const tagPath = `/tags/${encodeURIComponent(t.name)}`
                      const tagActive = pathname === tagPath
                      return (
                        <Link
                          key={t.name}
                          href={tagPath}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                            tagActive
                              ? 'bg-white/70 font-normal text-ink'
                              : 'bg-white/30 font-light text-ink-sub hover:bg-white/60 hover:text-ink'
                          }`}
                        >
                          <span>{t.name}</span>
                          <span className="font-mono text-[11px] text-ink-faint">{t.count}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        </div>
      </aside>
    </>
  )
}
