'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** 主页卡片里的树洞入口：一行输入，发送后带着草稿进 /chat */
export default function ChatTeaser() {
  const router = useRouter()
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const draft = text.trim()
    router.push(draft ? `/chat?draft=${encodeURIComponent(draft)}` : '/chat')
  }

  return (
    <form onSubmit={submit}>
      <div className="flex w-full min-w-0 items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-2 sm:px-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="说点什么…"
          aria-label="对树洞说点什么"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-3.5 py-1.5 text-xs text-white transition-colors hover:bg-accent-strong"
        >
          发送
        </button>
      </div>
      <p className="mt-4 text-xs font-light text-ink-mute">说出口的，云都会听见</p>
    </form>
  )
}
