'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** 主页的树洞入口：一行输入，发送后带着草稿进 /chat */
export default function ChatTeaser() {
  const router = useRouter()
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const draft = text.trim()
    router.push(draft ? `/chat?draft=${encodeURIComponent(draft)}` : '/chat')
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-md items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 backdrop-blur-sm"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="说点什么，云在听…"
        aria-label="对树洞说点什么"
        className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-1.5 text-xs font-normal text-white transition-colors hover:bg-accent-strong"
      >
        发送
      </button>
    </form>
  )
}
