'use client'

import { useEffect, useRef, useState } from 'react'

/** 单条对话消息 */
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * 树洞聊天界面
 * - 对话仅保存在当前会话内存中（刷新即清空）
 * - 通过 /api/chat 走 SSE 流式响应
 */
export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false) // 是否显示「正在输入」三点动画

  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 消息或输入状态变化时，自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  /** 发送消息并接收流式回复 */
  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const history = [...messages, userMessage]

    setMessages(history)
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    // 中断上一次未完成的请求（防止快速连续发送）
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`请求失败（${response.status}）`)
      }

      // 解析 SSE 流
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assistantContent = ''
      let started = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue

          const payload = trimmed.slice(5).trim()
          if (payload === '[DONE]') continue

          try {
            const json = JSON.parse(payload)
            const delta: string = json.choices?.[0]?.delta?.content ?? ''
            if (!delta) continue

            // 首个内容片段到达：结束「正在输入」，插入 AI 气泡
            if (!started) {
              started = true
              setIsTyping(false)
              setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
            }
            assistantContent += delta
            setMessages((prev) => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', content: assistantContent }
              return next
            })
          } catch {
            // 忽略无法解析的片段
          }
        }
      }
    } catch (err) {
      // 用户主动中断不算错误
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '风把这句话吹散了，再试一次好吗。' },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      abortRef.current = null
    }
  }

  /** 表单提交（回车发送） */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  return (
    <div className="glass flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {/* 空状态 */}
        {messages.length === 0 && !isTyping && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-faint">
            <span className="text-4xl" aria-hidden="true">
              ☁️
            </span>
            <p className="font-light">说点什么，云在听。</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Bubble key={i} message={msg} />
        ))}

        {/* 「正在输入…」三点跳动 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* 底部输入框 */}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-white/40 p-4">
        <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="把心事交给风…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-ink px-4 py-1.5 text-sm text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  )
}

/** 单条气泡：用户靠右，AI 靠左，均为毛玻璃 */
function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`glass max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'rounded-br-md bg-white/60' : 'rounded-bl-md bg-white/40'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
