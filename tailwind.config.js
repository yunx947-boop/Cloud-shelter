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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Songti SC', 'STSong', 'SimSun', 'serif'],
      },
    },
  },
  plugins: [],
}
