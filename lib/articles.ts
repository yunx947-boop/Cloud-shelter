import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface Article {
  slug: string
  title: string
  desc: string
  /** 发布日期 YYYY-MM-DD；frontmatter 没写则为空字符串 */
  date: string
  /** 封面图：/images/xxx.jpg 或完整外链；没写则用程序化封面 */
  cover?: string
  /** 预计阅读分钟数 */
  minutes: number
  body: string
}

const articlesDir = path.join(process.cwd(), 'content', 'articles')

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

/** 时间正序（早 → 晚）；同一天按 slug 升序，保证顺序稳定 */
function oldestFirst(a: Article, b: Article) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1
  return a.slug.localeCompare(b.slug)
}

/** 读取 content/articles 下的全部文章，按时间正序 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/i, '')
      const raw = fs.readFileSync(path.join(articlesDir, f), 'utf8')
      const { data, content } = matter(raw)
      const body = content.trim()
      return {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        desc: typeof data.desc === 'string' ? data.desc : '',
        date: normalizeDate(data.date),
        cover: typeof data.cover === 'string' && data.cover.trim() ? data.cover.trim() : undefined,
        minutes: readingMinutes(body),
        body,
      }
    })
    .sort(oldestFirst)
}

/** 时间倒序（新文章在前），用于列表展示 */
export function getArticles(): Article[] {
  return [...getAllArticles()].reverse()
}

/** 按 slug 取单篇文章 */
export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug)
}

/** 时间上的上一篇（更早）与下一篇（更晚） */
export function getAdjacent(slug: string): { prev?: Article; next?: Article } {
  const list = getAllArticles()
  const i = list.findIndex((a) => a.slug === slug)
  if (i < 0) return {}
  return { prev: list[i - 1], next: list[i + 1] }
}
