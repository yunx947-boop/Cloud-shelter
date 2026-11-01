import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import ChatTeaser from '@/components/ChatTeaser'
import { getTracks } from '@/lib/tracks'
import { footerLines } from '@/lib/constants'

/** 主页：全屏横幅 → 一句诗 → 两张并排的入口卡。
 *  完整播放器与聊天面板分别在 /music 与 /chat，主页只负责邀请。 */
export default async function HomePage() {
  const tracks = await getTracks()

  return (
    <main>
      <Hero />

      {/* 呼吸：一句诗，不加任何色块 */}
      <section className="px-6 pb-16 pt-20 text-center">
        <Reveal>
          <p className="font-serif text-[15px] font-light leading-loose tracking-[0.08em] text-ink-sub">
            {footerLines[2]}
          </p>
        </Reveal>
      </section>

      {/* 两张并排的入口卡 */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="glass flex h-full flex-col p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">留声机</p>
              <p className="mt-2 font-serif text-lg font-normal tracking-wide text-ink">
                声音是另一种云
              </p>
              <div className="mt-auto pt-7">
                <p className="truncate text-sm text-ink">{tracks[0]?.title ?? '还没有曲目'}</p>
                <p className="mt-0.5 truncate text-xs font-light text-ink-sub">
                  {tracks[0]?.artist || '去留声机挑一首'}
                </p>
                <Link
                  href="/music"
                  className="mt-4 inline-block text-xs font-light text-ink-mute transition-colors hover:text-ink"
                >
                  进入留声机 →（换页也能继续听）
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="glass flex h-full flex-col p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">树洞</p>
              <p className="mt-2 font-serif text-lg font-normal tracking-wide text-ink">
                说点什么，云在听
              </p>
              <div className="mt-auto pt-7">
                <ChatTeaser />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
