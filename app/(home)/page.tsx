import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import MiniPlayer from '@/components/MiniPlayer'
import ChatTeaser from '@/components/ChatTeaser'
import { getTracks } from '@/lib/tracks'
import { footerLines } from '@/lib/constants'

/** 主页：全屏横幅 → 呼吸带 → 留声机入口 → 树洞入口。
 *  完整功能分别在 /music 与 /chat，主页只负责邀请。 */
export default async function HomePage() {
  const tracks = await getTracks()

  return (
    <main>
      <Hero />

      {/* 呼吸带：从照片过渡到内容，先给一句安静的话 */}
      <section className="bg-band-cool px-6 py-24 text-center">
        <Reveal>
          <p className="font-serif text-[15px] font-light leading-loose tracking-[0.08em] text-ink-sub">
            {footerLines[2]}
          </p>
        </Reveal>
      </section>

      {/* 留声机入口 */}
      <section className="bg-band-warm px-6 py-24">
        <Reveal>
          <h2 className="text-center font-serif text-xl font-normal tracking-wide text-ink">留声机</h2>
          <p className="mt-2 text-center text-sm font-light text-ink-sub">声音是另一种云</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <MiniPlayer track={tracks[0]} />
        </Reveal>
      </section>

      {/* 树洞入口 */}
      <section className="bg-band-cool px-6 py-24">
        <Reveal>
          <h2 className="text-center font-serif text-xl font-normal tracking-wide text-ink">树洞</h2>
          <p className="mt-2 text-center text-sm font-light text-ink-sub">说点什么，云在听</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <ChatTeaser />
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}
