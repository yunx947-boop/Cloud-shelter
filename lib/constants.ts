/** 云岛卡片数据类型 */
export interface CloudIsland {
  icon: string
  title: string
  desc: string
  href: string
  /** 标记为“还在路上”的占位入口（不可点击） */
  comingSoon?: boolean
}

/** 站点元信息 */
export const siteTitle = '云端庇护所'
export const siteDescription = '单行道上，云在飘，你在走。'

/** 首页云岛导航数据（可在此增删条目） */
export const cloudIslands: CloudIsland[] = [
  { icon: '🪶', title: '迷途集', desc: '一些没想完的话', href: '/mituji' },
  { icon: '📖', title: '单向书', desc: '在单行道上写的信', href: '/danxiangshu' },
  { icon: '🎧', title: '留声机', desc: '声音是另一种云', href: '/music' },
  { icon: '🌙', title: '树洞', desc: '说点什么，云在听', href: '/chat' },
  { icon: '🌫️', title: '关于', desc: '单向·追云', href: '/about' },
  { icon: '✦', title: '预留', desc: '更多可能', href: '#', comingSoon: true },
]

/** 页脚文案 */
export const footerLines = [
  '来处已不可考。',
  '去处亦不必知。',
  '唯行路本身，尚在脚下。',
  '唯云，依旧可追。',
  '唯你我，尚有余裕温柔。',
]

/** 页脚落款 */
export const footerMeta = '云层于 2026.09 翻新'

/**
 * 本地音频（留声机）
 * 把音频文件放进 public/audio/ 目录，再把文件名填进 audioSrc。
 * 支持 mp3 / flac / wav / ogg / m4a 等浏览器可解码的格式。
 */
export const audioSrc = '/audio/with-you-around.mp3'
export const audioTitle = 'With You Around'
export const audioCover = '/images/with-you-around-cover.jpg'

/** 《单向·追云》理念全文段落 */
export const aboutParagraphs: string[] = [
  '云从不停下来等谁。它们只是慢慢地走，把影子投在湖面、屋顶，和你偶尔抬起的肩上。',
  '我们总想抓住点什么——一句话、一个念头、一段没说完的告别。可有些东西生来就是单向的，像云，像风，像我们望向天空时，那一点说不清的想念。',
  '所以这里不想教你什么。这里只留一盏灯，和一把椅子。你来了，可以坐着，也可以只站一会儿。',
  '声音是另一种云。心事也是。它们飘过来，被听见，然后轻轻散开。',
  '你不必成为更轻盈的人。你可以很重，可以慢，可以偶尔停下来，抬头看看天。',
  '云端庇护所，收留所有飘过的心事，也收留每一个，还在追云的你。',
]
