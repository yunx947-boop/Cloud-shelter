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
  { icon: '📖', title: '单向书', desc: '迷惘中的知识碎片', href: '/danxiangshu' },
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
 * 留声机歌单
 * 把音频文件放进 public/audio/ 目录，就会自动出现在歌单里，无需改其他代码。
 * 歌名 / 艺术家 / 专辑 / 封面 / 时长默认读文件自带的 ID3 标签；下面这个文件用来「覆盖」自动结果。
 */
export interface TrackMeta {
  /** 覆盖标签里的歌名 */
  title?: string
  /** 覆盖标签里的艺术家 */
  artist?: string
  /** 指定封面，放进 public/images/ 后填 '/images/xxx.jpg'；不填则用文件内嵌封面 */
  cover?: string
}

/** 键 = public/audio/ 下的完整文件名（含扩展名）。不登记则完全使用标签内容。 */
export const trackMeta: Record<string, TrackMeta> = {
  // 示例：想把太长的标签歌名缩短、或换成另一张封面时再登记
  // 'with-you-around.mp3': { title: 'With You Around', cover: '/images/with-you-around-cover.jpg' },
}

/** 《单向·追云》理念全文段落 */
export const aboutParagraphs: string[] = [
  '云从不停下来等谁。它们只是慢慢地走，把影子投在湖面、屋顶，和你偶尔抬起的肩上。',
  '我们总想抓住点什么——一句话、一个念头、一段没说完的告别。可有些东西生来就是单向的，像云，像风，像我们望向天空时，那一点说不清的想念。',
  '所以这里不想教你什么。这里只留一盏灯，和一把椅子。你来了，可以坐着，也可以只站一会儿。',
  '声音是另一种云。心事也是。它们飘过来，被听见，然后轻轻散开。',
  '你不必成为更轻盈的人。你可以很重，可以慢，可以偶尔停下来，抬头看看天。',
  '云端庇护所，收留所有飘过的心事，也收留每一个，还在追云的你。',
]
