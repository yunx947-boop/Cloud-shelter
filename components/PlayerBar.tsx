'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/components/player/PlayerProvider'

/** 底部常驻播放条：离开 /music 后继续显示，保证换页不断音 */
export default function PlayerBar() {
  const { track, playing, started, toggle, step } = usePlayer()
  const pathname = usePathname()

  if (!track || !started || pathname === '/music') return null

  return (
    <>
      {/* 占位，避免遮住页面底部内容 */}
      <div aria-hidden="true" className="h-16" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-amber-soft">
            {track.cover ? (
              <img src={track.cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] text-ink-faint">
                ♪
              </span>
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs text-ink">{track.title}</span>
            <span className="block truncate text-[11px] font-light text-ink-faint">
              {track.artist || '未知艺术家'}
            </span>
          </span>

          <button type="button" onClick={() => step(-1)} aria-label="上一首" className="px-1.5 text-sm text-ink-sub transition-colors hover:text-ink">
            ⏮
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? '暂停' : '播放'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] text-white transition-colors hover:bg-accent-strong"
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button type="button" onClick={() => step(1)} aria-label="下一首" className="px-1.5 text-sm text-ink-sub transition-colors hover:text-ink">
            ⏭
          </button>

          <Link
            href="/music"
            className="ml-1 hidden shrink-0 text-[11px] font-light text-ink-sub transition-colors hover:text-ink sm:inline"
          >
            留声机 →
          </Link>
        </div>
      </div>
    </>
  )
}
