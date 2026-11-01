'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import type { Track } from '@/lib/tracks'

/** 主页卡片里的迷你播放行：只负责「邀请」，歌单与完整控制都在 /music */
export default function MiniPlayer({ track }: { track?: Track }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  if (!track) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand/40">
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
          onClick={toggle}
          aria-label={playing ? '暂停' : '播放'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-strong"
        >
          <span className="text-xs">{playing ? '❚❚' : '▶'}</span>
        </button>
      </div>

      <Link
        href="/music"
        className="mt-4 inline-block text-xs font-light text-ink-mute transition-colors hover:text-ink"
      >
        去留声机 →
      </Link>

      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  )
}
