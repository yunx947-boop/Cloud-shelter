import Link from 'next/link'
import Footer from '@/components/Footer'
import Markdown from '@/components/Markdown'
import Reveal from '@/components/Reveal'
import type { Article } from '@/lib/articles'

interface ArticleContentProps {
  article: Article
  backHref: string
  backLabel: string
  /** 时间上的上一篇（更早） */
  prev?: Article
  /** 时间上的下一篇（更晚） */
  next?: Article
}

/** 文章详情：返回链接 + 标题 + 日期与时长 + Markdown 正文 + 上下篇 */
export default function ArticleContent({
  article,
  backHref,
  backLabel,
  prev,
  next,
}: ArticleContentProps) {
  const meta = [article.date.replace(/-/g, '.'), article.minutes ? `约 ${article.minutes} 分钟` : '']
    .filter(Boolean)
    .join(' · ')

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-10">
      <Reveal className="mb-10">
        <Link href={backHref} className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← {backLabel}
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-light tracking-wide text-ink">{article.title}</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">{article.desc}</p>
          {meta && <p className="mt-2 text-xs font-light tracking-wide text-ink-faint">{meta}</p>}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <article className="glass p-8 sm:p-10">
          <Markdown>{article.body}</Markdown>
        </article>
      </Reveal>

      {(prev || next) && (
        <Reveal className="mt-12">
          <nav className="grid grid-cols-2 gap-4 text-sm">
            <div>
              {prev && (
                <Link
                  href={`/article/${prev.slug}`}
                  className="block text-ink-sub transition-colors hover:text-ink"
                >
                  <span className="text-xs font-light text-ink-faint">← 上一篇</span>
                  <span className="mt-1 block font-light">{prev.title}</span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link
                  href={`/article/${next.slug}`}
                  className="block text-ink-sub transition-colors hover:text-ink"
                >
                  <span className="text-xs font-light text-ink-faint">下一篇 →</span>
                  <span className="mt-1 block font-light">{next.title}</span>
                </Link>
              )}
            </div>
          </nav>
        </Reveal>
      )}

      <Footer />
    </main>
  )
}
