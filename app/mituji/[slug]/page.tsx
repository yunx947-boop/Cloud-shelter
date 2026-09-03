import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleContent from '@/components/ArticleContent'
import { getArticle, getArticles } from '@/lib/articles'

export function generateStaticParams() {
  return getArticles('mituji').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle('mituji', slug)
  return {
    title: article ? `${article.title} · 迷途集` : '迷途集',
    description: article?.desc,
  }
}

/** 迷途集 · 文章详情（读取 content/mituji/<slug>.md） */
export default async function MitujiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle('mituji', slug)
  if (!article) notFound()
  return <ArticleContent article={article} backHref="/mituji" backLabel="迷途集" />
}
