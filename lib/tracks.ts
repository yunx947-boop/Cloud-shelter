import fs from 'node:fs'
import path from 'node:path'
import { parseFile } from 'music-metadata'
import type { IPicture } from 'music-metadata'
import { trackMeta } from './constants'

/** 一首歌 */
export interface Track {
  /** 唯一标识（文件名去掉扩展名） */
  id: string
  /** 浏览器可访问的音频地址 */
  src: string
  title: string
  artist: string
  album?: string
  cover?: string
  /** 时长（秒），解析失败时为 undefined */
  duration?: number
}

const audioDir = path.join(process.cwd(), 'public', 'audio')
const coverDir = path.join(process.cwd(), 'public', 'images', 'covers')

/** 浏览器可解码的音频格式 */
const audioExts = ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.opus', '.webm']

/** 文件名 → 歌名：`with-you-around` → `With You Around` */
function titleFromName(name: string) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)\S/g, (m) => m.toUpperCase())
}

/**
 * 把 MP3 内嵌的封面导出到 public/images/covers/，返回可访问的图片地址。
 * 已存在且比音频文件新时直接复用，避免每次请求重复写盘。
 */
function extractCover(id: string, pic: IPicture | undefined, audioMtimeMs: number) {
  if (!pic?.data?.length) return undefined
  const ext = pic.format === 'image/png' ? 'png' : 'jpg'
  const fileName = `${id}.${ext}`
  const abs = path.join(coverDir, fileName)
  try {
    fs.mkdirSync(coverDir, { recursive: true })
    const st = fs.existsSync(abs) ? fs.statSync(abs) : undefined
    if (!st || st.size === 0 || st.mtimeMs < audioMtimeMs) {
      fs.writeFileSync(abs, pic.data)
    }
  } catch {
    return undefined
  }
  return `/images/covers/${encodeURIComponent(fileName)}`
}

/**
 * 读取 public/audio/ 下的音频文件生成歌单。
 * 歌名 / 艺术家 / 专辑 / 封面 / 时长 优先取文件自带的 ID3 等标签；
 * trackMeta 里登记的内容可以覆盖自动结果。
 */
export async function getTracks(): Promise<Track[]> {
  if (!fs.existsSync(audioDir)) return []

  const files = fs
    .readdirSync(audioDir)
    .filter((f) => audioExts.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))

  const list: Track[] = []
  for (const f of files) {
    const abs = path.join(audioDir, f)
    const base = f.replace(/\.[^.]+$/, '')
    const override = trackMeta[f] ?? {}

    let tagged: { title?: string; artist?: string; album?: string; duration?: number; pic?: IPicture } = {}
    try {
      const m = await parseFile(abs)
      tagged = {
        title: m.common.title,
        artist: m.common.artist ?? m.common.artists?.join('、'),
        album: m.common.album,
        duration: m.format.duration,
        pic: m.common.picture?.[0],
      }
    } catch {
      // 标签损坏或格式不支持时退回文件名
    }

    const stat = fs.statSync(abs)
    list.push({
      id: base,
      src: `/audio/${encodeURIComponent(f)}`,
      title: override.title ?? tagged.title ?? titleFromName(base),
      artist: override.artist ?? tagged.artist ?? '',
      album: tagged.album,
      cover: override.cover ?? extractCover(base, tagged.pic, stat.mtimeMs),
      duration: tagged.duration,
    })
  }
  return list
}
