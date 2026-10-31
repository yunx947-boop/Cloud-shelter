import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import AudioPlayer from '@/components/AudioPlayer'
import ChatInterface from '@/components/ChatInterface'
import { getTracks } from '@/lib/tracks'

/** 主页：全屏横幅 → 留声机 → 树洞 */
export default async function HomePage() {
  const tracks = await getTracks()

  return (
    <main>
      <Hero />

      <section className="mx-auto w-full max-w-4xl px-6 pt-20">
        <Reveal>
          <h2 className="text-center font-serif text-xl font-medium tracking-wide text-ink">留声机</h2>
          <p className="mt-2 text-center text-sm font-light text-ink-sub">声音是另一种云</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <AudioPlayer tracks={tracks} />
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 pt-20">
        <Reveal>
          <h2 className="text-center font-serif text-xl font-medium tracking-wide text-ink">树洞</h2>
          <p className="mt-2 text-center text-sm font-light text-ink-sub">说点什么，云在听</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <div className="flex h-[70vh] min-h-[480px] flex-col">
            <ChatInterface />
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}
