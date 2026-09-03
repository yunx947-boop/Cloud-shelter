import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'

/** 首屏：整屏日落插画横幅 + 左侧毛玻璃文案区 + 紫色按钮 */
export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full overflow-hidden">
      {/* 背景插画：黄昏云海 + 回眸微笑的白发猫耳娘（整屏铺满） */}
      <Image
        src="/images/hero-sunset.png"
        alt="黄昏云海之上，回眸微笑的白发猫耳姑娘"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 左侧文案区：毛玻璃面板，保证在亮背景上可读 */}
      <div className="relative z-10 flex min-h-dvh items-center px-5 sm:px-8 lg:px-16">
        <Reveal delay={0.1} className="w-full max-w-md">
          <div className="rounded-[28px] border border-white/40 bg-white/35 p-7 shadow-sm backdrop-blur-md sm:p-9">
            <h1 className="font-serif text-[42px] font-medium leading-[1.3] tracking-wide text-[#4d4266] sm:text-[54px]">
              云端庇护所
            </h1>
            <p className="mt-5 font-serif text-base font-normal leading-[1.9] text-[#6f5b95] sm:text-[17px]">
              单行道上，云在飘，你在走。
            </p>
            <Link
              href="/clouds"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#9c8fd0] px-7 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8b7dc4]"
            >
              进入单行道
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
