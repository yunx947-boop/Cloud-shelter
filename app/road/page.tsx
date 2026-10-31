import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { getAllArticles, type Island } from '@/lib/articles'

export const metadata: Metadata = {
  title: '单行道 · 云端庇护所',
  description: '所有文章按时间排开的一条路，只能往前走。',
}

const islandLabel: Record<Island, string> = {
  mituji: '迷途集',
  danxiangshu: '单向书',
}

/** 单行道：把两个板块的文章按时间正序排成一条路，从最早走到今天 */
export default function RoadPage() {
  const articles = getAllArticles()

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-10">
      <Reveal className="mb-12">
        <Link href="/clouds" className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← 回到云端
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-light tracking-wide text-ink">单行道</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">所有文章按时间排开，只能往前走</p>
        </div>
      </Reveal>

      <ol className="relative ml-1 border-l-2 border-dashed border-[#e8d5c4] pl-7">
        {articles.map((a, i) => (
          <Reveal as="li" key={`${a.island}/${a.slug}`} delay={i * 0.05} className="relative pb-9">
            {/* 路面上的里程桩 */}
            <span
              aria-hidden="true"
              className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-[#e8d5c4] bg-cream"
            />
            <p className="text-xs font-light tracking-wide text-ink-faint">
              {a.date.replace(/-/g, '.')} · {islandLabel[a.island]}
            </p>
            <Link
              href={`/${a.island}/${a.slug}`}
              className="mt-1 block font-serif text-lg font-normal text-ink transition-colors hover:text-[#6f5b95]"
            >
              {a.title}
            </Link>
            <p className="mt-1 text-sm font-light leading-relaxed text-ink-sub">{a.desc}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-4">
        <p className="text-center font-serif text-sm font-light text-ink-mute">路还长，慢慢走。</p>
      </Reveal>

      <Footer />
    </main>
  )
}
