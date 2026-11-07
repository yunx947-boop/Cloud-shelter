'use client'

import Link from 'next/link'
import { usePlayer } from '@/components/player/PlayerProvider'
import type { Track } from '@/lib/tracks'

/** 主页留声机卡：显示封面曲，可就地播放，也可跳去完整播放器 */
export default function FeaturedTrack({ track }: { track?: Track }) {
  const { tracks, index: activeIndex, playing, toggle, goTo } = usePlayer()
  if (!track) return null

  const index = tracks.findIndex((t) => t.src === track.src)
  // 当前选中的是不是这首
  const isCurrent = activeIndex === index

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrent) toggle()
    else goTo(index, true)
  }

  return (
    <Link href="/music" className="group block w-full min-w-0">
      <div className="flex w-full min-w-0 items-center gap-3">
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-amber-soft">
          {track.cover ? (
            <img src={track.cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-base text-ink-faint">♪</span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-ink">{track.title}</span>
          <span className="block truncate text-xs font-light text-ink-sub">
            {track.artist || '未知艺术家'}
          </span>
        </span>

        <button
          type="button"
          onClick={onToggle}
          aria-label={isCurrent && playing ? '暂停' : '播放'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-strong"
        >
          <span className="text-xs">{isCurrent && playing ? '❚❚' : '▶'}</span>
        </button>
      </div>

      <span className="mt-4 inline-block text-xs font-light text-ink-mute transition-colors group-hover:text-ink">
        进入留声机 →
      </span>
    </Link>
  )
}
