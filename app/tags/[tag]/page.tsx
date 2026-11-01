import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { getAllTags, getArticlesByTag } from '@/lib/articles'

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: raw } = await params
  let tag = raw
  try {
    tag = decodeURIComponent(raw)
  } catch {
    tag = raw
  }
  return { title: `${tag} · 云端庇护所`, description: `标签「${tag}」下的全部文章` }
}

/** 标签页：某个内容分类下的文章 */
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: raw } = await params
  // 动态段可能是百分号编码（中文标签），先解码再匹配
  let tag = raw
  try {
    tag = decodeURIComponent(raw)
  } catch {
    tag = raw
  }
  const articles = getArticlesByTag(tag)
  if (articles.length === 0) notFound()

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pt-12">
      <Reveal className="mb-10">
        <Link href="/clouds" className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← 单行道
        </Link>
        <div className="mt-8 text-center">
          <h1 className="font-serif text-2xl font-normal tracking-wide text-ink">{tag}</h1>
          <p className="mt-2 font-mono text-xs tracking-wide text-ink-faint">{articles.length} 篇</p>
        </div>
      </Reveal>

      <ul className="space-y-5 pb-16">
        {articles.map((a, i) => (
          <Reveal as="li" key={a.slug} delay={i * 0.05}>
            <ArticleCard article={a} />
          </Reveal>
        ))}
      </ul>

      <Footer />
    </main>
  )
}
