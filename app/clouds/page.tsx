import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CloudCard from '@/components/CloudCard'
import CoverArt from '@/components/CoverArt'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { cloudIslands } from '@/lib/constants'
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
            <span aria-hidden="true">←</span> 回到主页
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
              <Link
                href={`/article/${a.slug}`}
                className="glass glass-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5"
              >
                <span className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-sand/30 sm:h-[112px] sm:w-[180px]">
                  {a.cover ? (
                    <img
                      src={a.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <CoverArt
                      seed={a.slug}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-xs tracking-wide text-ink-faint">
                    {a.date.replace(/-/g, '.')}
                    {a.minutes >= 3 && <span className="ml-2">· {a.minutes} 分钟</span>}
                  </span>
                  <span className="mt-2 block font-serif text-xl font-normal tracking-wide text-ink transition-colors duration-200 group-hover:text-link">
                    {a.title}
                  </span>
                  <span className="mt-2 block text-[15px] font-light leading-relaxed text-ink-sub">
                    {a.desc}
                  </span>
                </span>
              </Link>
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

      {/* 功能入口 */}
      <div className="pt-14 pb-12">
        <section className="px-6 lg:px-[60px]">
          <ul className="mx-auto grid w-full max-w-2xl list-none grid-cols-1 gap-5 sm:grid-cols-3">
            {cloudIslands.map((island, i) => (
              <Reveal key={island.title} as="li" delay={i * 0.08} className="w-full">
                <CloudCard island={island} newTab />
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  )
}
