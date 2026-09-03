import Link from 'next/link'
import CloudCard from '@/components/CloudCard'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import type { Article } from '@/lib/articles'
import type { CloudIsland } from '@/lib/constants'

interface ArticleCatalogProps {
  title: string
  subtitle: string
  icon: string
  articles: Article[]
  basePath: string
}

/** 云岛内的"目录"页：一张张云朵小卡，点击进入文章详情 */
export default function ArticleCatalog({
  title,
  subtitle,
  icon,
  articles,
  basePath,
}: ArticleCatalogProps) {
  const cards: CloudIsland[] = articles.map((a) => ({
    icon,
    title: a.title,
    desc: a.desc,
    href: `${basePath}/${a.slug}`,
  }))

  return (
    <main>
      {/* 顶部返回 */}
      <div className="px-6 pt-6 lg:px-[60px]">
        <Reveal>
          <Link
            href="/clouds"
            className="inline-flex items-center gap-2 text-sm font-light text-ink-sub transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> 单行道
          </Link>
        </Reveal>
      </div>

      {/* 标题 */}
      <Reveal className="mt-8 text-center">
        <h1 className="text-3xl font-light tracking-wide text-ink">{title}</h1>
        <p className="mt-3 text-sm font-light text-ink-sub">{subtitle} · 目录</p>
      </Reveal>

      {/* 文章小卡：目录 */}
      <div className="pt-10 pb-20">
        <section className="px-6 lg:px-[60px]">
          <ul className="mx-auto grid w-full max-w-3xl list-none grid-cols-1 gap-6 sm:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.title} as="li" delay={i * 0.06} className="w-full">
                <CloudCard island={c} />
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  )
}
