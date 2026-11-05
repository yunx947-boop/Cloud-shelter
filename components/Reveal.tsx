import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** 进入视口后延迟出现的秒数 */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}

/** Content stays visible in server-rendered HTML; delay is kept for caller compatibility. */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: RevealProps) {
  const Tag = as as 'div'

  return (
    <Tag
      data-visible="true"
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  )
}
