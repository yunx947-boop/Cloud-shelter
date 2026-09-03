import Link from 'next/link'
import Footer from '@/components/Footer'
import Markdown from '@/components/Markdown'
import Reveal from '@/components/Reveal'
import type { Article } from '@/lib/articles'

interface ArticleContentProps {
  article: Article
  backHref: string
  backLabel: string
}

/** 文章详情页面的通用排版：返回链接 + 标题 + Markdown 正文 */
export default function ArticleContent({ article, backHref, backLabel }: ArticleContentProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-10">
      <Reveal className="mb-10">
        <Link href={backHref} className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← {backLabel}
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-light tracking-wide text-ink">{article.title}</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">{article.desc}</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <article className="glass p-8 sm:p-10">
          <Markdown>{article.body}</Markdown>
        </article>
      </Reveal>

      <Footer />
    </main>
  )
}
