import fs from 'node:fs'
import path from 'node:path'
import { parseFile } from 'music-metadata'
import type { IPicture } from 'music-metadata'
import { trackMeta } from './constants'

/** 一首歌 */
export interface Track {
  /** 唯一标识（文件名去掉扩展名，或 content/tracks.json 里显式给的 id） */
  id: string
  /** 浏览器可访问的音频地址：本地 /audio/xxx.mp3，或外部 CDN 的绝对地址 */
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
/** 外部托管歌单清单：存在时优先使用，不再扫描 public/audio */
const playlistFile = path.join(process.cwd(), 'content', 'tracks.json')

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

/** 从地址里取出文件名（去扩展名）当 id */
function idFromSrc(src: string) {
  const last = src.split('/').pop() ?? src
  const name = (last.split('?')[0] ?? last).replace(/\.[^.]+$/, '')
  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}

/** content/tracks.json 里的一条 */
interface PlaylistEntry {
  id?: string
  src: string
  title?: string
  artist?: string
  album?: string
  cover?: string
  duration?: number
}

/**
 * 读取外部歌单清单（content/tracks.json）。
 * 音频托管到对象存储 / CDN 后，把清单写在这里，public/audio 就可以清空。
 * 清单不存在或为空时返回 undefined，调用方回落到本地扫描。
 */
function readPlaylist(): Track[] | undefined {
  if (!fs.existsSync(playlistFile)) return undefined

  let parsed: unknown
  try {
    parsed = JSON.parse(fs.readFileSync(playlistFile, 'utf8'))
  } catch {
    return undefined
  }
  if (!Array.isArray(parsed)) return undefined

  const list: Track[] = []
  for (const [i, raw] of parsed.entries()) {
    if (!raw || typeof raw !== 'object') continue
    const e = raw as PlaylistEntry
    // 缺 src 的条目（如说明项）直接跳过
    if (typeof e.src !== 'string' || e.src === '') continue
    const id = typeof e.id === 'string' && e.id ? e.id : idFromSrc(e.src) || `track-${i + 1}`
    list.push({
      id,
      src: e.src,
      title: typeof e.title === 'string' ? e.title : titleFromName(id),
      artist: typeof e.artist === 'string' ? e.artist : '',
      album: typeof e.album === 'string' ? e.album : undefined,
      cover: typeof e.cover === 'string' ? e.cover : undefined,
      duration: typeof e.duration === 'number' ? e.duration : undefined,
    })
  }
  return list.length > 0 ? list : undefined
}

/**
 * 把内嵌封面导出到 public/images/covers/，返回可访问地址。
 * 已存在且比音频文件新时直接复用，避免重复写盘。
 * 写盘失败（只读文件系统 / 无权限）时内联成 data URI，封面不会因此静默消失。
 */
function coverUrl(id: string, pic: IPicture | undefined, audioMtimeMs: number) {
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
    return `/images/covers/${encodeURIComponent(fileName)}`
  } catch {
    return `data:${pic.format || 'image/jpeg'};base64,${Buffer.from(pic.data).toString('base64')}`
  }
}

/**
 * 读取歌单。
 * 优先 content/tracks.json（音频托管在外部）；否则扫描 public/audio/ 并解析 ID3 标签。
 * 优先级：trackMeta 覆盖 > ID3 标签 > 文件名美化。
 */
export async function getTracks(): Promise<Track[]> {
  const playlist = readPlaylist()
  if (playlist) return playlist

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
      // 标签解析失败就走文件名兜底
    }

    const stat = fs.statSync(abs)
    list.push({
      id: base,
      src: `/audio/${encodeURIComponent(f)}`,
      title: override.title ?? tagged.title ?? titleFromName(base),
      artist: override.artist ?? tagged.artist ?? '',
      album: tagged.album,
      cover: override.cover ?? coverUrl(base, tagged.pic, stat.mtimeMs),
      duration: tagged.duration,
    })
  }
  return list
}
