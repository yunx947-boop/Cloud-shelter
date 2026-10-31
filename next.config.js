/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // 旧的板块目录页 → 单行道页
      { source: '/mituji', destination: '/clouds', permanent: true },
      { source: '/danxiangshu', destination: '/clouds', permanent: true },
      // 旧的文章路径 → 新的统一路径
      { source: '/mituji/:slug', destination: '/article/:slug', permanent: true },
      { source: '/danxiangshu/:slug', destination: '/article/:slug', permanent: true },
      // 时间线已并入单行道页
      { source: '/road', destination: '/clouds', permanent: true },
    ]
  },
}

module.exports = nextConfig
