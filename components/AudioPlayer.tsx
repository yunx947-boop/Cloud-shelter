'use client'

import { useRef, useState } from 'react'
import { audioSrc, audioTitle, audioCover } from '@/lib/constants'

/** 本地音频播放器：黑胶唱片 + 原生 range 进度条 + 播放控制 */
export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)
  // 拖动进度条时临时接管显示值，避免与播放位置互相拉扯
  const [scrub, setScrub] = useState<number | null>(null)

  // 播放 / 暂停
  const toggle = () => {
    const a = audioRef.current
    if (!a || failed) return
    if (a.paused) {
      a.play().catch(() => setFailed(true))
    } else {
      a.pause()
    }
  }

  // 浏览器可能在多个时机才给出真实时长，这里统一捕获（只接受有限正数）
  const syncDuration = () => {
    const a = audioRef.current
    if (!a) return
    const d = a.duration
    if (Number.isFinite(d) && d > 0) setDuration(d)
  }

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const shown = scrub ?? current
  const max = duration > 0 ? duration : 1
  const fillPct = duration > 0 ? Math.min((shown / duration) * 100, 100) : 0

  return (
    <div className="glass flex flex-col items-center px-6 py-9 sm:py-11">
      {/* 黑胶唱片：播放时缓缓转动 */}
      <div className={`vinyl ${playing ? 'is-spinning' : ''}`} aria-hidden="true">
        <img className="vinyl-cover" src={audioCover} alt="" />
      </div>

      {/* 歌名 */}
      <p className="mt-6 font-serif text-lg font-normal text-ink">{audioTitle}</p>

      {/* 进度条：原生 range，点按 / 拖动 / 触摸 / 键盘都可用 */}
      <input
        type="range"
        aria-label="播放进度"
        min={0}
        max={max}
        step={0.1}
        value={Math.min(shown, max)}
        disabled={failed}
        className="progress-input mt-6 w-full max-w-sm"
        style={{ '--fill': `${fillPct}%` } as React.CSSProperties}
        onPointerDown={() => duration > 0 && setScrub(current)}
        onPointerUp={() => setScrub(null)}
        onPointerCancel={() => setScrub(null)}
        onKeyUp={() => setScrub(null)}
        onChange={(e) => {
          const v = Number(e.currentTarget.value)
          setScrub(v)
          const a = audioRef.current
          if (a && duration > 0) a.currentTime = v
        }}
      />
      <p className="mt-1 text-xs font-light tabular-nums text-ink-faint">
        {fmt(shown)} / {duration > 0 ? fmt(duration) : '--:--'}
      </p>

      {/* 播放 / 暂停 */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? '暂停' : '播放'}
        className="mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#9c8fd0] text-white shadow-sm transition-colors hover:bg-[#8b7dc4]"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="5.5" y="4.5" width="4.5" height="15" rx="1.5" />
            <rect x="14" y="4.5" width="4.5" height="15" rx="1.5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {failed && (
        <p className="mt-4 max-w-sm text-center text-xs font-light leading-relaxed text-ink-faint">
          音频加载失败，请确认 public/audio/ 下的文件是完整可播放的 mp3 / flac。
        </p>
      )}

      {/* 隐藏的音频元素：多事件同步时长 */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={syncDuration}
        onDurationChange={syncDuration}
        onCanPlay={syncDuration}
        onPlaying={syncDuration}
        onTimeUpdate={(e) => {
          setCurrent(e.currentTarget.currentTime)
          syncDuration()
        }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
