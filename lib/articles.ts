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
  /** 内容分类：云与心事、造物手记或沿途日常 */
  tags: string[]
  /** 预计阅读分钟数 */
  minutes: number
  /** true = 不进时间线/标签/搜索，只能通过链接直达 */
  hidden: boolean
  body: string
}

export const articleCategories = ['云与心事', '造物手记', '沿途日常'] as const

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

/** frontmatter 的 tags 可能是数组也可能是逗号分隔字符串，统一成去空的字符串数组 */
function normalizeTags(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return raw
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter((t) => t.length > 0)
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

/** 读取 content/articles 下的全部文件（含隐藏），按时间正序 */
function readAllArticles(): Article[] {
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
        tags: normalizeTags(data.tags),
        hidden: data.hidden === true,
        minutes: readingMinutes(body),
        body,
      }
    })
    .sort(oldestFirst)
}

/** 可列出的文章：隐藏的不进时间线、标签与搜索 */
export function getAllArticles(): Article[] {
  return readAllArticles().filter((a) => !a.hidden)
}

/** 全部 slug（含隐藏），用于构建期生成静态页 */
export function getAllSlugs(): string[] {
  return readAllArticles().map((a) => a.slug)
}

/** 时间倒序（新文章在前），用于列表展示 */
export function getArticles(): Article[] {
  return [...getAllArticles()].reverse()
}

/** 按 slug 取单篇文章 */
export function getArticle(slug: string): Article | undefined {
  return readAllArticles().find((a) => a.slug === slug)
}

/** 三个固定分类及文章数 */
export function getAllTags(): { name: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const category of articleCategories) counts.set(category, 0)
  for (const a of getAllArticles()) {
    for (const t of a.tags) {
      if (counts.has(t)) counts.set(t, counts.get(t)! + 1)
    }
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }))
}

/** 某个标签下的文章（时间倒序） */
export function getArticlesByTag(tag: string): Article[] {
  return getArticles().filter((a) => a.tags.includes(tag))
}

/** 时间上的上一篇（更早）与下一篇（更晚） */
export function getAdjacent(slug: string): { prev?: Article; next?: Article } {
  const list = getAllArticles()
  const i = list.findIndex((a) => a.slug === slug)
  if (i < 0) return {}
  return { prev: list[i - 1], next: list[i + 1] }
}
