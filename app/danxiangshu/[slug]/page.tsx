import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleContent from '@/components/ArticleContent'
import { getArticle, getArticles } from '@/lib/articles'

export function generateStaticParams() {
  return getArticles('danxiangshu').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle('danxiangshu', slug)
  return {
    title: article ? `${article.title} · 单向书` : '单向书',
    description: article?.desc,
  }
}

/** 单向书 · 信详情（读取 content/danxiangshu/<slug>.md） */
export default async function DanxiangshuArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle('danxiangshu', slug)
  if (!article) notFound()
  return <ArticleContent article={article} backHref="/danxiangshu" backLabel="单向书" />
}
