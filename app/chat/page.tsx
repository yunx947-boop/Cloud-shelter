import Link from 'next/link'
import ChatInterface from '@/components/ChatInterface'

/** 聊天 AI 页面：树洞对话（无页脚，保持类 App 的全屏高度） */
export default function ChatPage() {
  return (
    <main className="flex h-dvh flex-col px-4 pt-5 pb-5 sm:px-6">
      {/* 顶部返回 + 标题（紧凑） */}
      <header className="relative mb-4 flex shrink-0 items-center justify-center">
        <Link
          href="/clouds"
          className="absolute left-0 text-sm font-light text-ink-sub transition-colors hover:text-ink"
        >
          ← 单行道
        </Link>
        <h1 className="text-lg font-light text-ink">树洞</h1>
      </header>

      {/* 聊天界面：填充剩余高度 */}
      <ChatInterface />
    </main>
  )
}
