import Link from 'next/link'
import CoverArt from '@/components/CoverArt'
import type { Article } from '@/lib/articles'

/** 文章卡片：封面 + 日期 + 标题 + 摘要。单行道时间线与标签页共用 */
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group glass glass-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5"
    >
      <span className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sand/30 sm:h-[112px] sm:w-[180px]">
        {article.cover ? (
          <img
            src={article.cover}
            alt=""
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverArt
            seed={article.slug}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-mono text-xs tracking-wide text-ink-faint">
          {article.date.replace(/-/g, '.')}
          {article.minutes >= 3 && <span className="ml-2">· {article.minutes} 分钟</span>}
        </span>
        <span className="mt-2 block font-serif text-xl font-normal tracking-wide text-ink transition-colors duration-200 group-hover:text-link">
          {article.title}
        </span>
        <span className="mt-2 block text-[15px] font-light leading-relaxed text-ink-sub">
          {article.desc}
        </span>
        {article.tags.length > 0 && (
          <span className="mt-3 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-amber-soft px-2.5 py-0.5 text-[11px] font-light text-ink-sub">
                {t}
              </span>
            ))}
          </span>
        )}
      </span>
    </Link>
  )
}
