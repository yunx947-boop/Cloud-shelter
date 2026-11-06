import Link from 'next/link'
import ChatInterface from '@/components/ChatInterface'

/** 聊天 AI 页面：树洞对话（无页脚，保持类 App 的全屏高度） */
export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>
}) {
  // 主页那一行输入会带着草稿跳过来，这里接住它
  const { draft } = await searchParams
  return (
    <main className="flex h-[calc(100dvh-3.5rem)] flex-col px-4 pt-4 pb-4 sm:px-6 lg:h-dvh lg:pt-5 lg:pb-5">
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
      <ChatInterface initialInput={draft} />
    </main>
  )
}
