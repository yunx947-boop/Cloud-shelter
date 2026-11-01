/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 云端庇护所 调色板（严格色值，对应 v0 原设计）
        cream: '#f5f0eb', // 背景起点
        sand: '#d9d0c5', // 装饰线起点
        ink: '#4a4a4a', // 正文
        'ink-sub': '#6e6e6e', // 辅助文字 / 描述（对比度 ≥ 4.5:1）
        'ink-mute': '#9c9c9c', // 有含义但轻的文字：小标题、页脚寄语
        'ink-faint': '#b5b5b5', // 纯装饰：版权、占位、指示
        // 语义色：值定义在 app/globals.css 的 :root，改那里即全站生效
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
          soft: 'var(--accent-soft)',
        },
        'amber-soft': 'var(--amber-soft)',
        'band-cool': 'var(--band-cool)',
        'band-warm': 'var(--band-warm)',
        amber: 'var(--amber)',
        link: 'var(--link)',
        'ink-hero': 'var(--ink-hero)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Songti SC', 'STSong', 'SimSun', 'serif'],
        // 日期、时长、序号等数字信息用等宽，观感更利落
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
