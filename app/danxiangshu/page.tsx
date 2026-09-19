import type { Metadata } from 'next'
import ArticleCatalog from '@/components/ArticleCatalog'
import { getArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: '单向书 · 云端庇护所',
  description: '迷惘中的知识碎片',
}

/** 单向书：云岛 → 信索引（自动读取 content/danxiangshu/ 下的 .md 文件） */
export default function DanxiangshuPage() {
  const articles = getArticles('danxiangshu')
  return (
    <ArticleCatalog
      title="单向书"
      subtitle="迷惘中的知识碎片"
      icon="📖"
      articles={articles}
      basePath="/danxiangshu"
    />
  )
}
