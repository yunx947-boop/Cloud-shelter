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
  const inputRef = useRef<HTMLInputElement>(null)

  // 换页时收起抽屉、清空搜索
  useEffect(() => {
    setOpen(false)
    setQ('')
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

        {/* 分区导航 */}
        <nav className="mt-7 space-y-1">
          {navItems.map((item) => (
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
          ))}
        </nav>

        {/* 内容分类 */}
        {tags.length > 0 && (
          <>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">分类</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.name}
                  href={`/tags/${encodeURIComponent(t.name)}`}
                  className="rounded-full bg-white/60 px-2.5 py-1 text-[11px] font-light text-ink-sub transition-colors hover:bg-amber-soft hover:text-ink"
                >
                  {t.name}
                  <span className="ml-1 font-mono text-[10px] text-ink-faint">{t.count}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
