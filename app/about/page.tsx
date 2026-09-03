import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { aboutParagraphs } from '@/lib/constants'

/** 关于页面：理念全文 + 白发猫耳娘插画 */
export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-10">
      {/* 顶部返回 + 板块标题 */}
      <Reveal className="mb-10">
        <Link href="/clouds" className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← 单行道
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-light tracking-wide text-ink">关于此间</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">单向 · 追云</p>
        </div>
      </Reveal>

      {/* 理念全文（毛玻璃卡片，排版宽松） */}
      <Reveal delay={0.15}>
        <article className="glass p-8 sm:p-10">
          <h2 className="mb-8 text-center text-xl font-light tracking-wide text-ink">单向 · 追云</h2>
          <div className="space-y-6">
            {aboutParagraphs.map((p, i) => (
              <p key={i} className="text-base font-light leading-loose text-ink">
                {p}
              </p>
            ))}
          </div>
        </article>
      </Reveal>

      {/* 白发猫耳娘 插画 */}
      <Reveal delay={0.3} className="mt-12 text-center">
        <figure>
          {/* 白发猫耳娘插画 */}
          <Image
            src="/images/about-cat.jpg"
            alt="在云端回眸微笑的白发猫耳姑娘"
            width={1024}
            height={1024}
            className="mx-auto h-56 w-56 rounded-[24px] object-cover sm:h-64 sm:w-64"
          />
        </figure>
      </Reveal>

      <Footer />
    </main>
  )
}
