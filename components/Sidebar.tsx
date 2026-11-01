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
        className={`fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-white/50 bg-white/75 px-5 py-7 backdrop-blur-md transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 头像 + 站名 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/about-cat.jpg"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span>
            <span className="block font-serif text-base font-normal text-ink">云端庇护所</span>
            <span className="mt-0.5 block text-[11px] font-light leading-relaxed text-ink-mute">
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
            className="w-full rounded-xl border border-white/60 bg-white/60 px-3 py-2 pr-16 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent"
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
        <nav className="mt-7 space-y-1">
          {navItems.map((item) => {
            if (item.href !== '/clouds') {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-amber-soft font-normal text-ink'
                      : 'font-light text-ink-sub hover:bg-white/60 hover:text-ink'
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
                  className={`flex items-center rounded-lg transition-colors ${
                    isActive(item.href) ? 'bg-amber-soft' : 'hover:bg-white/60'
                  }`}
                >
                  <Link
                    href={item.href}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
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
                    className="px-2.5 py-2 text-[10px] text-ink-faint transition-colors hover:text-ink"
                  >
                    <span className={`inline-block transition-transform duration-200 ${roadOpen ? 'rotate-90' : ''}`}>
                      ▸
                    </span>
                  </button>
                </div>

                {roadOpen && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l border-sand/70 pl-3">
                    <Link
                      href="/clouds"
                      className={`block rounded px-2 py-1 text-xs transition-colors ${
                        pathname === '/clouds'
                          ? 'font-normal text-ink'
                          : 'font-light text-ink-sub hover:text-ink'
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
                          className={`flex items-center justify-between rounded px-2 py-1 text-xs transition-colors ${
                            tagActive
                              ? 'font-normal text-ink'
                              : 'font-light text-ink-sub hover:text-ink'
                          }`}
                        >
                          <span>{t.name}</span>
                          <span className="font-mono text-[10px] text-ink-faint">{t.count}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

      </aside>
    </>
  )
}
