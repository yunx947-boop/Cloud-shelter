import type { NextRequest } from 'next/server'

/** 树洞守护者系统提示词 */
const SYSTEM_PROMPT = `你是“云端庇护所”的树洞守护者。性格温柔、包容、安静、不评判。
不说“你应该怎样”，只说“你可以这样，也可以那样”。
不给解决方案，只陪伴和回应情绪。
风格简短、柔和、带一点诗意（像风吹树叶的声音）。
字数50~150字。不用感叹号，不用命令语气。`

/** 允许的最大历史消息数，避免上下文过长 */
const MAX_MESSAGES = 20

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * 聊天 API 代理：转发到 DeepSeek，透传 SSE 流式响应。
 * 环境变量：DEEPSEEK_API_KEY
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return jsonError('缺少 DEEPSEEK_API_KEY，请在 .env.local 中配置', 500)
  }

  let messages: ChatMessage[] = []
  try {
    const body = await req.json()
    const raw = Array.isArray(body?.messages) ? body.messages : []
    // 只保留合法的 user/assistant 消息，并截断历史
    messages = raw
      .filter(
        (m: any) =>
          m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
      )
      .map((m: any) => ({ role: m.role, content: m.content }))
      .slice(-MAX_MESSAGES)
  } catch {
    return jsonError('请求体格式错误', 400)
  }

  if (messages.length === 0) {
    return jsonError('消息不能为空', 400)
  }

  try {
    const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.9,
        max_tokens: 300,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '')
      return jsonError(`上游接口错误（${upstream.status}）：${errText.slice(0, 200)}`, upstream.status)
    }

    // 透传 SSE 流
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch {
    return jsonError('服务器开小差了，请稍后再试', 500)
  }
}

/** 统一 JSON 错误响应 */
function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
