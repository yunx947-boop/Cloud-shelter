import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CloudCard from '@/components/CloudCard'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { cloudIslands } from '@/lib/constants'

export const metadata: Metadata = {
  title: '云岛 · 云端庇护所',
  description: '这里没有方向，只有方向上的你。',
}

/** 云岛页：全宽横幅 + 单行道上的六座云岛 */
export default function CloudsPage() {
  return (
    <main>
      {/* 全宽横幅（贴屏边，降低高度），返回链接悬浮其上 */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <Image
          src="/images/clouds-banner.jpg"
          alt="云端之上"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* 悬浮返回链接（毛玻璃小胶囊，保证在图上可读） */}
        <div className="absolute left-5 top-5 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/45 px-3 py-1 text-sm font-light text-ink backdrop-blur-md transition-colors hover:bg-white/60 hover:text-ink-sub"
          >
            <span aria-hidden="true">←</span> 回到云端
          </Link>
        </div>
      </div>

      {/* 引言（紧凑，尽量留在第一屏） */}
      <Reveal>
        <p className="px-6 pt-6 text-center font-serif text-[15px] font-light leading-[2] text-ink-sub">
          这里没有方向，只有方向上的你。
        </p>
      </Reveal>

      {/* 云岛卡片：桌面端单行 */}
      <div className="pt-5 pb-12">
        <section className="px-6 lg:px-[60px]">
          <ul className="mx-auto grid w-full max-w-6xl list-none grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {cloudIslands.map((island, i) => (
              <Reveal key={island.title} as="li" delay={i * 0.08} className="w-full">
                <CloudCard island={island} />
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      {/* 收束语 */}
      <div className="px-6 pb-14 lg:px-[60px]">
        <Reveal>
          <p className="text-center font-serif text-[15px] font-light leading-[2] text-ink-sub">
            迷路也没关系——云端庇护所，随时欢迎你坐下歇歇。
          </p>
        </Reveal>
      </div>

      <Footer />
    </main>
  )
}
