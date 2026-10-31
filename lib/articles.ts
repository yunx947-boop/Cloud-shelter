import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/** 板块目录名，同时也是 URL 前缀 */
export type Island = 'mituji' | 'danxiangshu'

export interface Article {
  slug: string
  title: string
  desc: string
  /** 发布日期 YYYY-MM-DD；frontmatter 没写则为空字符串 */
  date: string
  /** 预计阅读分钟数 */
  minutes: number
  body: string
}

/** 带上所属板块的文章，用于跨板块按时间排开 */
export interface ArticleWithIsland extends Article {
  island: Island
}

const contentRoot = path.join(process.cwd(), 'content')
const islands: Island[] = ['mituji', 'danxiangshu']

/**
 * frontmatter 里的日期可能是字符串，也可能被 YAML 解析成 Date 对象，
 * 统一成 YYYY-MM-DD；无法识别时返回空字符串（排序时排到最后）。
 */
function normalizeDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) return `${m[1]}-${m[2]}-${m[3]}`
  }
  return ''
}

/** 中文按 350 字/分钟、英文按 200 词/分钟估算，最少 1 分钟 */
function readingMinutes(body: string) {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const words = (body.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length
  return Math.max(1, Math.round(cjk / 350 + words / 200))
}

/** 读取某个云岛目录下的所有文章（未排序） */
function readIsland(island: Island): Article[] {
  const dir = path.join(contentRoot, island)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/i, '')
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      const { data, content } = matter(raw)
      const body = content.trim()
      return {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        desc: typeof data.desc === 'string' ? data.desc : '',
        date: normalizeDate(data.date),
        minutes: readingMinutes(body),
        body,
      }
    })
}

/** 时间倒序（新文章在前）；同一天按 slug 升序，保证顺序稳定 */
function newestFirst(a: Article, b: Article) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.slug.localeCompare(b.slug)
}

/** 某个云岛的文章：按发布时间倒序 */
export function getArticles(island: Island): Article[] {
  return readIsland(island).sort(newestFirst)
}

/** 按 slug 取单篇文章 */
export function getArticle(island: Island, slug: string): Article | undefined {
  return readIsland(island).find((a) => a.slug === slug)
}

/** 所有板块的文章合成一条时间线：正序（早 → 晚），像一条路 */
export function getAllArticles(): ArticleWithIsland[] {
  return islands
    .flatMap((island) => readIsland(island).map((a) => ({ ...a, island })))
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1
      return a.slug.localeCompare(b.slug)
    })
}

/** 时间上的上一篇（更早）与下一篇（更晚），仅在同一板块内 */
export function getAdjacent(island: Island, slug: string): { prev?: Article; next?: Article } {
  const list = getAllArticles().filter((a) => a.island === island)
  const i = list.findIndex((a) => a.slug === slug)
  if (i < 0) return {}
  return { prev: list[i - 1], next: list[i + 1] }
}
