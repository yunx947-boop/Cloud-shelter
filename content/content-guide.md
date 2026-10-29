# 内容维护指南

> 一句话规则：**加文章 = 丢一个 .md 文件；加歌 = 一条命令生成条目 + 传 R2 + 粘一条 JSON。**
> 本文档只写"怎么操作"，不解释实现细节。改代码请另开分支。

---

## 0. 命令速查

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览，<http://localhost:3000> |
| `npm run build` | 生产构建（改完内容建议跑一次） |
| `npm run lint:md` | 检查 Markdown 格式 |
| `npm run new-track -- "<音频路径>" <slug>` | 读标签 + 导出封面 + 生成歌单条目 |

---

## 1. 新增文章

### 1.1 放在哪个目录

| 板块 | 目录 | 首页云岛 |
| --- | --- | --- |
| 迷途集 | `content/mituji/` | 🪶 一些没想完的话 |
| 单向书 | `content/danxiangshu/` | 📖 迷惘中的知识碎片 |

只有这两个目录会被读取，放别的地方不会出现。

### 1.2 文件名就是 URL

`content/mituji/zoudiu.md` → `/mituji/zoudiu`

- **建议**：小写拼音 + 连字符，如 `tingzai-lukou.md`
- 中文文件名能用，但 URL 会被转义成 `%E4%B8%AD...`，又长又难记
- 改了文件名 = 改了 URL，旧链接会失效

### 1.3 frontmatter 必须写

```markdown
---
title: 走丢
desc: 走丢本身，也是一种抵达
---
正文从这里开始……
```

| 字段 | 必填 | 用途 |
| --- | --- | --- |
| `title` | 是 | 目录卡片标题 + 详情页大标题 |
| `desc` | 是 | 目录卡片摘要 + 详情页副标题 |

漏了 `title` 会把 slug 当标题显示，漏了 `desc` 则摘要为空。

### 1.4 排序规则

按**文件名**升序（`localeCompare`）。想让某篇排前面，加数字前缀：

```text
01-xiang-qian.md
02-tingzai-lukou.md
03-zoudiu.md
```

⚠️ 前缀会进入 URL（`/mituji/01-xiang-qian`），介意的话就别用。

### 1.5 正文支持什么

GFM：标题、粗斜体、列表、引用、链接、表格、行内代码、删除线。

样式已由 `app/globals.css` 的 `.markdown` 统一控制，**正文里不要写行内 style 或 HTML**。

### 1.6 改板块副标题要同步三处

这是历史上最容易漏的地方：

1. `lib/constants.ts` → `cloudIslands` 里对应条目的 `desc`
2. 板块页面的 `metadata.description`（如 `app/mituji/page.tsx`）
3. 该页面传给 `<ArticleCatalog subtitle="..." />` 的值

三处不一致，同一个副标题会在线上和首页显示成两种样子。

### 1.7 提交前跑一次 lint

```powershell
npm run lint:md
```

配置文件是 `.markdownlint.json`。常见报错：标题前后缺空行、列表前后缺空行、代码块没标注语言。

### 1.8 新增一个全新板块（少见）

1. `lib/articles.ts` 里 `island` 的联合类型加上新名字
2. 新建 `app/<板块名>/page.tsx` 和 `app/<板块名>/[slug]/page.tsx`
3. `lib/constants.ts` 的 `cloudIslands` 加一条导航（原来的"预留"正好可以换上）
4. `content/<板块名>/` 建目录

---

## 2. 新增歌曲

### 2.1 音频放哪儿

**不要放进仓库**。`public/audio/` 已被 `.gitignore` 忽略，放进去也不会被提交。

建议统一暂存在仓库外，例如：

```text
F:\shelter-audio\          ← 本地暂存/母带区
```

### 2.2 起一个 slug

slug 就是文件在 R2 上的名字，**只用小写字母、数字、连字符**：

```text
buckethead-the-left-panel.mp3
ji-xinan-lin-lu-xing.flac
```

中文名一定要手动指定 slug，否则 URL 会带转义字符。

### 2.3 一条命令生成条目和封面

```powershell
npm run new-track -- "F:\shelter-audio\新歌.mp3" xin-ge
```

脚本会做三件事：

1. 读音频标签 → 标题 / 艺术家 / 专辑 / 时长
2. 把内嵌封面导出到 `public/images/covers/xin-ge.jpg`
3. 打印一条可直接粘进 `content/tracks.json` 的 JSON，以及配套的 rclone 上传命令

如果文件没有内嵌封面，会提示警告，条目里就不带 `cover`（播放器退化成黑胶圆盘，不报错）。

### 2.4 上传到 R2

先配置凭据（每个新开的窗口都要重设一次）：

```powershell
$env:RCLONE_CONFIG_R2_TYPE="s3"
$env:RCLONE_CONFIG_R2_PROVIDER="Cloudflare"
$env:RCLONE_CONFIG_R2_ACCESS_KEY_ID="访问密钥 ID"
$env:RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="机密访问密钥"
$env:RCLONE_CONFIG_R2_ENDPOINT="https://<AccountID>.r2.cloudflarestorage.com"
$env:RCLONE_CONFIG_R2_ACL="private"
$env:RCLONE_CONFIG_R2_REGION="auto"
$rclone = "F:\tools\rclone-v1.75.2-windows-amd64\rclone.exe"
```

然后上传（脚本已经把这条命令打印好了，直接复制）：

```powershell
& $rclone copyto "F:\shelter-audio\新歌.mp3" r2:shelter-audio/audio/xin-ge.mp3 -P --s3-no-check-bucket
```

要点：

- **必须带 `audio/` 前缀**，track 的 `src` 就是按这个拼的
- 大文件加 `--s3-chunk-size 64M --s3-upload-concurrency 4` 走分块，更稳
- rclone 是幂等的，重复执行只会跳过已完成的文件
- 传到一半被 Ctrl+C 掐掉，这个文件会从头重传（不跨进程续传）

API 令牌用完记得去控制台删掉：

> Cloudflare → R2 → Manage R2 API Tokens → 删除

### 2.5 写进 `content/tracks.json`

数组，一条一首。字段含义：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `src` | **是** | 音频完整地址，如 `https://cdn.cloud-shelter.top/audio/xin-ge.mp3`。缺了这条会被跳过 |
| `title` | 否 | 缺省用 slug 美化后的名字 |
| `artist` | 否 | 缺省为空 |
| `album` | 否 | 仅用于展示 |
| `cover` | 否 | 本地路径 `/images/covers/xin-ge.jpg`，或任意绝对 URL |
| `duration` | 否 | 秒。缺了播放器会在加载后自己读出来 |

**数组顺序就是歌单顺序。**

### 2.6 提交上线

```powershell
git add content/tracks.json public/images/covers/xin-ge.jpg
git commit -m "新增歌曲：xxx"
git push origin master
```

Vercel 会自动重新部署，1–3 分钟后上线。

⚠️ **封面那张 jpg 一定要一起 add**。音频在 CDN 上，构建时无法再自动提取封面；漏了它，线上就没有封面图。

### 2.7 验证

```powershell
# 桶里有没有（字节数要对）
& $rclone lsf r2:shelter-audio/audio --s3-no-check-bucket --format "sp"

# 外部能不能拿到，能不能拖进度条
curl.exe -sI https://cdn.cloud-shelter.top/audio/xin-ge.mp3
```

期望：`200`、`Content-Length` 和本地一致、`Accept-Ranges: bytes`。

---

## 3. 存储现状（为什么这样设计）

| 项 | 位置 |
| --- | --- |
| 音频文件 | Cloudflare R2 桶 `shelter-audio`，路径 `audio/` |
| 对外域名 | `https://cdn.cloud-shelter.top`（绑定在该桶上的自定义域） |
| 封面 | 仓库内 `public/images/covers/`，随代码部署 |
| 歌单清单 | `content/tracks.json` |
| 本地暂存 | `F:\shelter-audio\`（不进仓库） |

免费额度：存储 10 GB、出网流量免费。当前用量约 0.6 GB。

R2 单个对象上限 5 TiB，单次 PUT 上限 5 GiB，控制台上传建议只用于 100 MB 以下的文件。

---

## 4. 提交前自检清单

- [ ] `npm run lint:md` 通过
- [ ] `npm run build` 通过
- [ ] 新文章：frontmatter 的 `title` / `desc` 都写了
- [ ] 新歌曲：音频已在 R2（`rclone lsf` 能看到且字节数对）
- [ ] 新歌曲：封面 jpg 已 `git add`
- [ ] `content/tracks.json` 里 `src` 用的是 `https://cdn.cloud-shelter.top/audio/...`
- [ ] `git status` 里没有意外的大文件

---

## 5. 常见问题

**歌点了没声音**

按 `F12` → Network 看那条音频请求：

| 状态码 | 原因 |
| --- | --- |
| 404 | R2 上没有这个 key，或 `tracks.json` 里 `src` 拼错（大小写敏感） |
| 403 | 桶的公共访问没开，或自定义域没绑上 |
| 200 但一直转 | 检查响应头有没有 `Accept-Ranges: bytes` |

**能播但拖不动进度条**

看响应头缺不缺 `Accept-Ranges: bytes`；R2 正常都支持，缺了通常是中间层缓存改写了响应。

**封面不显示**

1. `public/images/covers/` 里有那张文件吗
2. `git add` 了吗（没提交就部署 = 线上没有）
3. `tracks.json` 里 `cover` 路径对不对

**页面还是旧的**

1. 浏览器按 `Ctrl+F5` 强刷（本机会缓存 HTML）
2. Vercel → Deployments 看新部署是否 Ready
3. Cloudflare 缓存：Caching → Purge Cache

**`git push` 没报错但没推上去**

本机 `GIT_TERMINAL_PROMPT=0` 会掐掉凭据管理器，导致静默失败（退出码 128 但无输出）。显式覆盖再推：

```powershell
$env:GIT_TERMINAL_PROMPT = "1"
git push origin master
```

**`git push` 报连接超时**

确认网络能到 `github.com`（不是 `api.github.com`）。沙箱/受限网络环境常见。

---

## 6. 不要做的事

1. **不要把音频提交进仓库**。`public/audio/` 已忽略；硬塞进去会让 `git clone` 变得极慢。
2. **不要把密钥写进文件**。R2 凭据只放在当前 PowerShell 会话的环境变量里。
3. **不要手改 `public/images/covers/` 之外的位置当封面**。构建产物目录 `.next/`、`public/audio/` 都是临时或忽略的。
4. **不要删掉 `content/tracks.json`** 而指望自动扫描：没有它代码会回落到扫描 `public/audio/`，而那个目录现在是空的。
5. **不要在没传 R2 的情况下改 `tracks.json`** 并部署——线上会立刻 404。
