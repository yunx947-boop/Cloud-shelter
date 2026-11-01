'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Track } from '@/lib/tracks'

export type PlayMode = 'order' | 'shuffle'

interface PlayerApi {
  tracks: Track[]
  track?: Track
  total: number
  index: number
  mode: PlayMode
  playing: boolean
  /** 是否已经开播过；未开播时不显示底部播放条 */
  started: boolean
  current: number
  duration: number
  failed: boolean
  goTo: (i: number, autoplay: boolean) => void
  step: (dir: 1 | -1) => void
  toggle: () => void
  toggleMode: () => void
  seekTo: (seconds: number) => void
}

const PlayerContext = createContext<PlayerApi | null>(null)

export function usePlayer() {
  const api = useContext(PlayerContext)
  if (!api) throw new Error('usePlayer 必须放在 PlayerProvider 内')
  return api
}

/**
 * 全站播放器：<audio> 挂在根布局上，换页不会被卸载，
 * 所以看文章时音乐可以一直放。
 */
export default function PlayerProvider({
  tracks,
  children,
}: {
  tracks: Track[]
  children: React.ReactNode
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoPlayNext = useRef(false)

  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<PlayMode>('order')
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)

  const total = tracks.length
  const track = total > 0 ? tracks[Math.min(index, total - 1)] : undefined

  // 换源后重新加载
  useEffect(() => {
    audioRef.current?.load()
  }, [index])

  const syncDuration = () => {
    const audio = audioRef.current
    if (!audio) return
    if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration)
  }

  const play = () => {
    audioRef.current?.play().catch(() => setFailed(true))
  }

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
    setIndex(i)
  }

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

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || failed || !track) return
    if (audio.paused) audio.play().catch(() => setFailed(true))
    else audio.pause()
  }

  const toggleMode = () => setMode((m) => (m === 'order' ? 'shuffle' : 'order'))

  const seekTo = (seconds: number) => {
    const audio = audioRef.current
    if (audio && Number.isFinite(seconds)) audio.currentTime = seconds
  }

  const handleEnded = () => {
    setPlaying(false)
    if (total <= 1) return
    goTo(mode === 'shuffle' ? randomIndex() : (index + 1) % total, true)
  }

  const api = useMemo<PlayerApi>(
    () => ({
      tracks,
      track,
      total,
      index,
      mode,
      playing,
      started,
      current,
      duration,
      failed,
      goTo,
      step,
      toggle,
      toggleMode,
      seekTo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracks, track, total, index, mode, playing, started, current, duration, failed],
  )

  return (
    <PlayerContext.Provider value={api}>
      {children}
      {track && (
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          className="hidden"
          onPlay={() => {
            setPlaying(true)
            setStarted(true)
          }}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          onLoadedMetadata={syncDuration}
          onDurationChange={syncDuration}
          onCanPlay={() => {
            syncDuration()
            if (autoPlayNext.current) {
              autoPlayNext.current = false
              play()
            }
          }}
          onPlaying={syncDuration}
          onTimeUpdate={() => {
            setCurrent(audioRef.current?.currentTime ?? 0)
            syncDuration()
          }}
          onError={() => setFailed(true)}
        />
      )}
    </PlayerContext.Provider>
  )
}
