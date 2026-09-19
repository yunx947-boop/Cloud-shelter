'use client'

import { useEffect, useRef, useState } from 'react'
import type { Track } from '@/lib/tracks'

type PlayMode = 'order' | 'shuffle'

/** 正在播放时跳动的声波条 */
function Eq({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      <span className={`eq-bar ${playing ? 'is-on' : ''}`} style={{ animationDelay: '0ms' }} />
      <span className={`eq-bar ${playing ? 'is-on' : ''}`} style={{ animationDelay: '180ms' }} />
      <span className={`eq-bar ${playing ? 'is-on' : ''}`} style={{ animationDelay: '360ms' }} />
    </span>
  )
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/**
 * 留声机：仿播放器外壳。
 * 菜单栏（顶栏）/ 中间黑胶 / 底部播放条（歌名在最底部）/ 点击展开全部歌曲并显示时长。
 */
export default function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  // 切歌后是否需要自动播
  const autoPlayNext = useRef(false)

  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<PlayMode>('order')
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)
  // 拖动进度条时临时接管显示值，避免与播放位置互相拉扯
  const [scrub, setScrub] = useState<number | null>(null)
  // 歌单展开 / 收起
  const [open, setOpen] = useState(false)

  const total = tracks.length
  const track: Track | undefined = tracks[Math.min(index, total - 1)]

  // 切换音源后重新加载
  useEffect(() => {
    audioRef.current?.load()
  }, [index])


  const play = () => {
    audioRef.current?.play().catch(() => setFailed(true))
  }

  /** 跳到第 i 首；autoplay=false 时只切换不播放 */
  const goTo = (i: number, autoplay: boolean) => {
    if (i < 0 || i >= total) return
    if (i === index) {
      if (autoplay) play()
      return
    }
    autoPlayNext.current = autoplay
    setFailed(false)
    setCurrent(0)
    setDuration(0)
    setScrub(null)
    setIndex(i)
  }

  /** 随机模式下取一个和当前不同的下标 */
  const randomIndex = () => {
    if (total <= 1) return 0
    let n = index
    while (n === index) n = Math.floor(Math.random() * total)
    return n
  }

  const step = (dir: 1 | -1) => {
    if (total <= 1) return
    if (mode === 'shuffle') goTo(randomIndex(), true)
    else goTo((index + dir + total) % total, true)
  }

  const handleEnded = () => {
    setPlaying(false)
    if (total <= 1) return
    goTo(mode === 'shuffle' ? randomIndex() : (index + 1) % total, true)
  }

  const toggleMode = () => setMode((m) => (m === 'order' ? 'shuffle' : 'order'))

  const toggle = () => {
    const a = audioRef.current
    if (!a || failed || !track) return
    if (a.paused) a.play().catch(() => setFailed(true))
    else a.pause()
  }

  // 浏览器可能在多个时机才给出真实时长，这里统一捕获（只接受有限正数）
  const syncDuration = () => {
    const a = audioRef.current
    if (!a) return
    const d = a.duration
    if (Number.isFinite(d) && d > 0) setDuration(d)
  }

  if (!track) {
    return (
      <div className="glass px-6 py-9 text-center">
        <p className="text-sm font-light text-ink-sub">歌单还是空的。</p>
        <p className="mt-2 text-xs font-light leading-relaxed text-ink-faint">
          把 mp3 / flac / wav 等音频文件放进 <span className="font-mono">public/audio/</span> 目录，
          刷新页面就会出现在这里。
        </p>
      </div>
    )
  }

  const shown = scrub ?? current
  const max = duration > 0 ? duration : 1
  const fillPct = duration > 0 ? Math.min((shown / duration) * 100, 100) : 0

  const iconBtn =
    'flex h-9 w-9 items-center justify-center rounded-full text-ink-sub transition-colors hover:bg-white/60 hover:text-ink'

  return (
    <div className="glass flex flex-col overflow-hidden">
      {/* ===== 菜单栏 ===== */}
      <header className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-2.5">
        <p className="flex items-center gap-1.5 text-[11px] font-light text-ink-mute">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M9 18V6.5l10-2V16" />
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="16" cy="16" r="2.5" />
          </svg>
          共 {total} 首
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMode}
            disabled={total <= 1}
            aria-label={mode === 'order' ? '当前顺序播放，点击切换随机播放' : '当前随机播放，点击切换顺序播放'}
            className="flex items-center gap-1.5 rounded-full border border-sand/60 px-3 py-1 text-[11px] font-light text-ink-sub transition-colors hover:border-[#e8d5c4] hover:text-ink disabled:opacity-40"
          >
            {mode === 'order' ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7h11" />
                <path d="M15 4l3 3-3 3" />
                <path d="M4 17h7" />
                <path d="M11 14l-3 3 3 3" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
              </svg>
            )}
            <span>{mode === 'order' ? '顺序播放' : '随机播放'}</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? '收起播放列表' : '展开播放列表'}
            className={`rounded-full border px-3 py-1 text-[11px] font-light tabular-nums transition-colors ${
              open
                ? 'border-[#9c8fd0] bg-[#9c8fd0]/10 text-[#9c8fd0]'
                : 'border-sand/60 text-ink-sub hover:border-[#e8d5c4] hover:text-ink'
            }`}
          >
            {open ? '收起' : '歌单'}
          </button>
        </div>
      </header>

      {/* ===== 中间：黑胶唱片 ===== */}
      <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center px-6 py-8">
        <div className={`vinyl ${playing ? 'is-spinning' : ''}`} aria-hidden="true">
          {track.cover && <img className="vinyl-art" src={track.cover} alt="" />}
        </div>
      </div>

      {/* ===== 展开的全部歌曲（歌名后面显示时长） ===== */}
      <div
        className={`overflow-hidden border-t border-black/5 transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="playlist-scroll max-h-[300px] overflow-y-auto px-3 py-2">
          {tracks.map((t, i) => {
            const active = i === index
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => goTo(i, true)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                    active ? 'bg-white/70' : 'hover:bg-white/45'
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[11px] font-light tabular-nums text-ink-faint">
                    {active ? <Eq playing={playing} /> : i + 1}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm font-light ${
                      active ? 'text-ink' : 'text-ink-sub'
                    }`}
                  >
                    {t.title}
                    {t.artist && (
                      <span className="ml-2 text-[11px] text-ink-faint">{t.artist}</span>
                    )}
                  </span>
                  {/* 歌曲时间 */}
                  <span className="shrink-0 text-[11px] font-light tabular-nums text-ink-faint">
                    {t.duration !== undefined ? fmt(t.duration) : '--:--'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ===== 底部播放条：歌曲名称在最底部 ===== */}
      <footer className="border-t border-black/5 bg-white/40 px-5 py-3">
        {/* 进度条 */}
        <input
          type="range"
          aria-label="播放进度"
          min={0}
          max={max}
          step={0.1}
          value={Math.min(shown, max)}
          disabled={failed}
          className="progress-input mb-2 w-full"
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

        <div className="flex items-center gap-3">
          {/* 封面缩略图 */}
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#e8d5c4]/40"
            aria-hidden="true"
          >
            {track.cover ? (
              <img src={track.cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] text-ink-faint">
                ♪
              </span>
            )}
          </div>

          {/* 歌名 + 歌手 + 时间 */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-light text-ink">{track.title}</p>
            <p className="mt-0.5 truncate text-[11px] font-light text-ink-faint">
              {track.artist ? `${track.artist} · ` : ''}
              <span className="tabular-nums">
                {fmt(shown)} /{' '}
                {duration > 0 ? fmt(duration) : track.duration !== undefined ? fmt(track.duration) : '--:--'}
              </span>
            </p>
          </div>

          {/* 控制区 */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={total <= 1}
              aria-label="上一首"
              className={`${iconBtn} disabled:opacity-30 disabled:hover:bg-transparent`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="5" width="2.5" height="14" rx="1.2" />
                <path d="M20 5.5v13a1 1 0 0 1-1.6.8l-9-6.5a1 1 0 0 1 0-1.6l9-6.5A1 1 0 0 1 20 5.5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? '暂停' : '播放'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#9c8fd0] text-white shadow-sm transition-colors hover:bg-[#8b7dc4]"
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="5.5" y="4.5" width="4.5" height="15" rx="1.5" />
                  <rect x="14" y="4.5" width="4.5" height="15" rx="1.5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              disabled={total <= 1}
              aria-label="下一首"
              className={`${iconBtn} disabled:opacity-30 disabled:hover:bg-transparent`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="16.5" y="5" width="2.5" height="14" rx="1.2" />
                <path d="M4 5.5v13a1 1 0 0 0 1.6.8l9-6.5a1 1 0 0 0 0-1.6l-9-6.5A1 1 0 0 0 4 5.5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? '收起播放列表' : '展开播放列表'}
              className={iconBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h10" />
              </svg>
            </button>
          </div>
        </div>

        {failed && (
          <p className="mt-3 text-center text-xs font-light leading-relaxed text-ink-faint">
            音频加载失败，请确认 public/audio/ 下的文件是完整可播放的 mp3 / flac。
          </p>
        )}
      </footer>

      {/* 隐藏的音频元素：多事件同步时长 */}
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onLoadedMetadata={syncDuration}
        onDurationChange={syncDuration}
        onCanPlay={(e) => {
          syncDuration()
          if (autoPlayNext.current) {
            autoPlayNext.current = false
            e.currentTarget.play().catch(() => setFailed(true))
          }
        }}
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
