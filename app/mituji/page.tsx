import type { Metadata } from 'next'
import ArticleCatalog from '@/components/ArticleCatalog'
import { getArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: '迷途集 · 云端庇护所',
  description: '一些没想完的话',
}

/** 迷途集：云岛 → 文章目录（自动读取 content/mituji/ 下的 .md 文件） */
export default function MitujiPage() {
  const articles = getArticles('mituji')
  return (
    <ArticleCatalog
      title="迷途集"
      subtitle="一些没想完的话"
      icon="🪶"
      articles={articles}
      basePath="/mituji"
    />
  )
}
