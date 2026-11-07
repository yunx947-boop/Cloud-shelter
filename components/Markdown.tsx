'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Markdown 正文渲染（支持 GFM：列表、表格、删除线、链接等） */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 宽表格包一层横向滚动容器，避免撑破页面
          table: ({ node: _node, ...props }) => (
            <div className="md-table-scroll">
              <table {...props} />
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
