import Link from 'next/link'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { getAllArticles, type Island } from '@/lib/articles'

const islandLabel: Record<Island, string> = {
  mituji: '迷途集',
  danxiangshu: '单向书',
}

/** 首页：整屏落地横幅 + 最近三步（最新三篇文章） */
export default function HomePage() {
  const latest = getAllArticles().slice(-3).reverse()

  return (
    <main>
      <Hero />

      {latest.length > 0 && (
        <section className="mx-auto w-full max-w-3xl px-6 pb-10 pt-20">
          <Reveal>
            <h2 className="text-center font-serif text-xl font-medium tracking-wide text-ink">最近三步</h2>
            <p className="mt-2 text-center text-sm font-light text-ink-sub">路上新留下的脚印</p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {latest.map((a, i) => (
              <Reveal as="li" key={`${a.island}/${a.slug}`} delay={i * 0.08}>
                <Link href={`/${a.island}/${a.slug}`} className="glass glass-hover block px-5 py-4">
                  <span className="text-xs font-light tracking-wide text-ink-faint">
                    {a.date.replace(/-/g, '.')} · {islandLabel[a.island]}
                  </span>
                  <span className="mt-1 block font-serif text-base font-normal text-ink">{a.title}</span>
                  <span className="mt-1 block text-sm font-light leading-relaxed text-ink-sub">{a.desc}</span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-8 text-center">
            <Link href="/road" className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
              看整条路 →
            </Link>
          </Reveal>
        </section>
      )}

      <Footer />
    </main>
  )
}
