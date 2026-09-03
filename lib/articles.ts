import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface Article {
  slug: string
  title: string
  desc: string
  body: string
}

const contentRoot = path.join(process.cwd(), 'content')

/**
 * 读取某个云岛目录下的所有文章。
 * 每个 .md 文件名就是 slug；frontmatter 里的 title / desc 作为标题与摘要；正文为 Markdown。
 * 以后新增文章 = 往对应目录丢一个新的 .md 文件即可，无需改代码。
 */
export function getArticles(island: 'mituji' | 'danxiangshu'): Article[] {
  const dir = path.join(contentRoot, island)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/i, '')
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        desc: typeof data.desc === 'string' ? data.desc : '',
        body: content.trim(),
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

/** 按 slug 取单篇文章；不存在返回 undefined */
export function getArticle(island: 'mituji' | 'danxiangshu', slug: string): Article | undefined {
  return getArticles(island).find((a) => a.slug === slug)
}
