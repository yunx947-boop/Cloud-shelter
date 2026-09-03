import Reveal from '@/components/Reveal'
import { footerLines, footerMeta } from '@/lib/constants'

/** 页脚组件：三段文案 + 落款 */
export default function Footer() {
  return (
    <footer className="px-6 pb-16 lg:px-[60px]">
      <Reveal>
        {/* 页脚文字：13px / 300 / 有含义淡色 / 衬线 / 行高 2 */}
        <div className="text-center font-serif text-[13px] font-light leading-[2] text-ink-mute">
          {footerLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-4 text-center text-[13px] font-light leading-[2] text-ink-faint opacity-70">
          {footerMeta}
        </p>
      </Reveal>
    </footer>
  )
}
