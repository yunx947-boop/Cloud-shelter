import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif_SC } from 'next/font/google'
import SiteShell from '@/components/SiteShell'
import PlayerProvider from '@/components/player/PlayerProvider'
import { getTracks } from '@/lib/tracks'
import { getAllArticles, getAllTags } from '@/lib/articles'
import './globals.css'

// 站点字体：Inter（细字重，营造轻盈的云气质）
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

// 标题 / 诗性文字：思源宋体（衬线，书卷气；preload 关闭以适配中文字体体积）
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: '云端庇护所 · Cloud Shelter',
  description: '迷路也没关系，这里可以坐下歇歇。',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f0eb',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 左侧栏的搜索索引与分类都在构建期生成，不额外请求
  const docs = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    desc: a.desc,
    body: a.body,
  }))
  const tags = getAllTags()
  // 歌单在根布局取一次，播放器换页不断
  const tracks = await getTracks()

  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSerifSC.variable} bg-cream`}>
      <body className="min-h-dvh font-sans text-ink antialiased">
        <PlayerProvider tracks={tracks}>
          <SiteShell docs={docs} tags={tags}>
            {children}
          </SiteShell>
        </PlayerProvider>
      </body>
    </html>
  )
}
