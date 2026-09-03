'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** 进入视口后延迟出现的秒数 */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
  /** 只触发一次后保持显示 */
  once?: boolean
}

/**
 * 通用淡入上浮容器：进入视口时显现。
 * 首屏元素用 delay 做依次淡入，卡片用递增 delay 做 stagger。
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const Tag = as as 'div'

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  )
}
