import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: '单行道 · 云端庇护所',
  description: '所有文章按时间排开，只能往前走。',
}

/** 单行道页：横幅 + 文章时间线（早 → 晚）+ 功能入口 */
export default function CloudsPage() {
  const articles = getAllArticles()

  return (
    <main>
      {/* 全宽横幅 + 悬浮返回 */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        <Image
          src="/images/clouds-banner.jpg"
          alt="云端之上"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute left-5 top-5 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/45 px-3 py-1 text-sm font-light text-ink backdrop-blur-md transition-colors hover:bg-white/60 hover:text-ink-sub"
          >
            <span aria-hidden="true">←</span> 回到云端
          </Link>
        </div>
      </div>

      <Reveal>
        <div className="px-6 pt-10 text-center">
          <h1 className="font-serif text-2xl font-normal tracking-wide text-ink">单行道</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">所有文章按时间排开，只能往前走</p>
        </div>
      </Reveal>

      {/* 文章时间线：早 → 晚 */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-10">
        <ol className="relative ml-1 border-l-2 border-dashed border-amber pl-7">
          {articles.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 0.05} className="group relative pb-7">
              <span
                aria-hidden="true"
                className="absolute -left-[2.1rem] top-8 h-3 w-3 rounded-full border-2 border-amber bg-cream transition-colors duration-200 group-hover:border-accent"
              />
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </ol>
        {articles.length === 0 && (
          <p className="text-center text-sm font-light text-ink-faint">路上还没有脚印。</p>
        )}
        <Reveal className="pt-2">
          <p className="text-center font-serif text-sm font-light text-ink-mute">路还长，慢慢走。</p>
        </Reveal>
      </section>

      <div className="pb-12" />

      <Footer />
    </main>
  )
}
