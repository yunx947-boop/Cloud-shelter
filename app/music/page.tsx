import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'

/** 音乐库页面：本地音频播放器（留声机） */
export default function MusicPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pt-10">
      {/* 顶部返回 + 板块标题 */}
      <Reveal className="mb-8">
        <Link href="/clouds" className="text-sm font-light text-ink-sub transition-colors hover:text-ink">
          ← 单行道
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-light tracking-wide text-ink">留声机</h1>
          <p className="mt-3 text-sm font-light text-ink-sub">声音是另一种云</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <AudioPlayer />
      </Reveal>

      <Footer />
    </main>
  )
}
