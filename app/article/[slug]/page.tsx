import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleContent from '@/components/ArticleContent'
import { getAdjacent, getArticle, getAllArticles } from '@/lib/articles'

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  return {
    title: article ? `${article.title} · 云端庇护所` : '云端庇护所',
    description: article?.desc,
  }
}

/** 文章详情：读取 content/articles/<slug>.md */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const { prev, next } = getAdjacent(slug)
  return (
    <ArticleContent article={article} backHref="/clouds" backLabel="单行道" prev={prev} next={next} />
  )
}
