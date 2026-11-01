# 读懂这个项目需要什么

> 一份给未来的自己（或接手的人）的知识地图：需要会什么、按什么顺序读代码、怎么验证自己真的读懂了。

---

## 一、项目全貌

```text
规模      约 2500 行代码（不含 node_modules）
语言      TypeScript（tsconfig strict: true）
框架      Next.js 15 App Router + React 19
样式      Tailwind CSS 3.4 + CSS 变量（设计令牌）
内容      Markdown + frontmatter，构建期用 fs 读盘
依赖      只有 7 个：next / react / react-dom / gray-matter /
          music-metadata / react-markdown / remark-gfm
部署      Vercel（站点）+ Cloudflare R2（音频）
```

没有数据库、没有登录、没有测试、没有状态库。**复杂度几乎全部集中在 Next.js 的"服务端组件 / 客户端组件"这一条分界线上。**

---

## 二、知识点分层

### 1. 必备地基（不懂就动不了）

| 技能 | 在项目里用在哪 |
| --- | --- |
| HTML + CSS | 全部视觉层；重点 Flex/Grid、绝对定位、`backdrop-filter`、渐变 |
| 现代 JavaScript | ES 模块、`async/await`、解构、可选链、`map/filter/sort/flatMap` |
| TypeScript | `strict: true`；`interface`、联合类型、可选属性、类型收窄 |
| React 核心 | 组件、props、`useState`/`useEffect`/`useRef`/`useMemo`、列表 key、事件 |

### 2. Next.js App Router（占总理解成本的一半以上）

- **目录即路由**：`app/clouds/page.tsx` → `/clouds`
- **动态路由**：`app/article/[slug]/page.tsx`，参数要自己 `decodeURIComponent`
- **`generateStaticParams`**：构建期把 6 篇文章预渲染成静态页
- **layout 嵌套**：根布局套住所有页面，所以侧栏与播放器能常驻
- **服务端 / 客户端组件分界**（最重要）：
  - 服务端：能 `fs` 读文件、能 `await`
  - 客户端：能 `useState`、能挂事件，文件顶部要写 `'use client'`
- **构建期 vs 请求期**：`/clouds` 是 `○ Static`，`/chat` 是 `ƒ Dynamic`（因为读 `searchParams`）
- **`next.config.js` 的 `redirects`**：旧路径 308 跳转在这一层

### 3. 内容管线

| 知识点 | 用在哪 |
| --- | --- |
| Markdown + frontmatter | 文章就是 `.md` + YAML 头 |
| gray-matter | 解析 frontmatter |
| Node `fs` | 构建期扫目录、读文件 |
| music-metadata | 读音频 ID3 标签与内嵌封面 |
| 正则 / 字符串 | 日期归一化、阅读时长估算、slug 生成 |
| 手写 SVG | `CoverArt.tsx` 程序化封面（渐变 + 种子随机） |

### 4. 运行时细节（看着简单，坑最多）

- **`<audio>` API**：`play()` 返回 Promise、`currentTime`、`duration`、`ended`/`canplay` 事件
- **浏览器自动播放策略**：必须先有一次用户点击
- **SSE 流式响应**：树洞转发 DeepSeek 的 `text/event-stream`，前端用 `ReadableStream` 逐块解析
- **`IntersectionObserver`**：`Reveal` 组件的滚动淡入

### 5. 样式体系

- **Tailwind 工具类 + 任意值**：`text-[15px]`、`bg-[url('…')]`、`bg-[position:22%_center]`
- **CSS 变量做设计令牌**：定义在 `app/globals.css` 的 `:root`，Tailwind 里映射成 `bg-accent` 等
- **响应式断点**：`sm/``lg/``xl:`，侧栏宽度随断点变化

### 6. 工程与运维

- Git：add / commit / push / 撤销
- Vercel：从 git 构建，环境变量 `DEEPSEEK_API_KEY`
- 对象存储与 CDN：R2 的 S3 协议、key 前缀、自定义域、公共访问
- HTTP：`200 / 206 Partial Content / 308 / 403 / 404`、`Accept-Ranges`、缓存头

### 不需要学的

数据库、用户系统、Redux（只用 React Context）、测试框架、后端框架（只有一个 route handler）、Webpack 配置。

---

## 三、最短学习路径（约 4 周，每天 2 小时）

```text
第 1 周  HTML/CSS(Flex+Grid) + JS 现代语法
第 2 周  React 基础（组件 / state / hooks）
第 3 周  Next.js App Router（重点：服务端与客户端的分界）
第 4 周  TypeScript 基础 + 把本项目按下面的顺序读一遍
```

---

## 四、读代码的顺序（按数据流，不是按目录）

| 顺序 | 文件 | 目的 |
| --- | --- | --- |
| 1 | `lib/articles.ts` | 数据从哪来，最简单，先建立信心 |
| 2 | `app/layout.tsx` | 全局壳：侧栏、播放器、每页注入的数据 |
| 3 | `app/clouds/page.tsx` | 一个完整页面：读数据 → 渲染列表 |
| 4 | `components/ArticleCard.tsx` + `CoverArt.tsx` | 组件与程序化封面 |
| 5 | `app/article/[slug]/page.tsx` → `ArticleContent.tsx` | 动态路由与文章排版 |
| 6 | `components/player/PlayerProvider.tsx` → `AudioPlayer.tsx` → `PlayerBar.tsx` | 最难的部分，放最后 |
| 7 | `app/api/chat/route.ts` + `ChatInterface.tsx` | 流式响应 |

---

## 五、自测：能答上这 8 题就算真读懂了

### 1. 为什么 `/clouds` 是 `○ Static` 而 `/chat` 是 `ƒ Dynamic`？

前者只在构建期读文件（`fs`），没有动态 API；后者 `await searchParams` 拿 `?draft=`，只能在请求期渲染。

### 2. `AudioPlayer` 为什么不再自己持有 `<audio>`？

组件随路由卸载，`<audio>` 会被销毁、声音中断。所以把 `<audio>` 提到根布局的 `PlayerProvider`，界面组件只读写这份全局状态。

### 3. `content/tracks.json` 存在时，`getTracks()` 为什么提前返回？

`readPlaylist()` 读到非空列表就直接返回，跳过"扫描 `public/audio/` + 解析 ID3"的老路径——那套逻辑只在没有清单时兜底。

### 4. 访问旧地址 `/mituji/zoudiu` 会发生什么？

`next.config.js` 里的 `redirects` 在服务端返回 **308**，跳到 `/article/zoudiu`。

### 5. 为什么 `CoverArt` 不需要 `'use client'`？

它是纯函数：输入 slug，输出内联 SVG。没有 state、没有事件，可以在服务端渲染。

### 6. 文章页的"上一篇/下一篇"依据什么排序？跨不跨板块？

按 `date` 正序、同日按 slug；`getAllArticles()` 是**全局**的——板块概念已经删掉了。

### 7. `Reveal` 组件上为什么不能直接加 `hover:-translate-y-1`？

`Reveal` 用 CSS `transform` 做淡入上移，再加 hover 的 transform 会互相覆盖，动画直接失效。要么改用透明度/颜色做 hover，要么把 hover 加在内层元素上。

### 8. 加歌之后为什么必须把封面 jpg 一起 `git add`？

有 `tracks.json` 时不再走构建期 ID3 提取，封面只能来自仓库里的文件；漏了就线上没图。

---

## 六、这个项目真实踩过的坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面突然 500 | `npm run build` 和 `npm run dev` 抢同一个 `.next` | 构建前先停 dev |
| `/tags/迷惘` 404 | 动态路由参数是百分号编码，没解码 | 页面里 `decodeURIComponent` |
| 封面在线上消失 | 有 `tracks.json` 后不再构建期提取封面 | 封面 jpg 随库入库 |
| 加歌后进度条拖不动 | 上传时缺 `Accept-Ranges` | 用 `curl -I` 检查 206 |
| 搜索框是空的却占了首屏 | 客户端组件塞进静态页 | 检查 `'use client'` 边界 |
| 首页播放器换页就停 | `<audio>` 长在页面组件里 | 提到根布局 |
| 编辑文件报 `ReplaceFileW EIO` | Windows 下文件被 dev server 监听占用 | 用 sed 或稍后重试 |

---

## 七、术语对照

| 术语 | 在这个项目里的意思 |
| --- | --- |
| Server Component | 默认；能读文件、能 await，不能有交互 |
| Client Component | 文件顶部写 `'use client'`；能交互，不能直接读文件 |
| SSG / Static | 构建期生成 HTML，如 `/clouds` |
| Dynamic | 每次请求渲染，如 `/chat` |
| frontmatter | `.md` 开头 `---` 之间的 YAML 元数据 |
| Range 请求 | HTTP 206，音频拖进度条依赖它 |
| SSE | Server-Sent Events，树洞的流式输出 |
| 设计令牌 | `globals.css` 里的 CSS 变量，改一处全站生效 |
