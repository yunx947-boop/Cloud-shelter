# 内容维护指南

> 覆盖「写文章」和「加音乐」两条完整流程。所有命令都可在 PowerShell 里直接粘贴运行。
> Markdown 语法细节见 `content/markdown-guide.md`，这里只讲**怎么发布**。

---

## 0. 站点结构速览

```text
云端 /            全屏横幅 → 一句诗 → 留声机 / 树洞 两张入口卡
单行道 /clouds    横幅 → 文章时间线（早 → 晚）→ 页脚
文章 /article/…   正文 + 日期/时长 + 上一篇/下一篇
标签 /tags/…      某个分类下的文章
留声机 /music     完整播放器（黑胶 + 歌单 + 进度条）
树洞 /chat        AI 对话
关于 /about       理念全文

左侧栏：头像 · 搜索(Ctrl+K) · 云端/单行道(含分类)/留声机/树洞/关于
```

数据都在两个地方：**`content/articles/` 放文章**，**`content/tracks.json` 放歌单**。

---

## 一、写文章

### 1.1 放哪里

```text
content/articles/<slug>.md
```

只有这个目录会被发布。放 `content/` 根目录的笔记不会出现在站点上，可以当草稿区。

### 1.2 文件名就是 URL

| 文件 | 网址 |
| --- | --- |
| `content/articles/zoudiu.md` | `/article/zoudiu` |
| `content/articles/tingzai-lukou.md` | `/article/tingzai-lukou` |

- 用小写拼音 + 连字符
- 中文文件名能用，但 URL 会变成 `%E4%B8%AD...`，又长又难记
- **改文件名 = 改 URL**，旧链接失效（旧板块路径 `/mituji/…` 有跳转，但新文章没有）

### 1.3 frontmatter（五个字段）

```markdown
---
title: 风的去向
desc: 走着走着，方向就长出来了
date: '2026-09-01'
cover: /images/clouds-banner.jpg
tags: [迷惘, 深夜]
---
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 卡片标题、详情页大标题、浏览器标签 |
| `desc` | 是 | 卡片摘要、详情页副标题 |
| `date` | 是 | `'YYYY-MM-DD'`，**决定排序位置**。日期务必加引号 |
| `cover` | 否 | 封面图：`/images/xxx.jpg` 或完整外链。**不填会自动生成一张程序化封面** |
| `tags` | 否 | 分类数组，如 `[迷惘, 深夜]`，会出现在侧栏「单行道」下面 |

漏写 `date` 的文章会排到时间线最后。

### 1.4 排序规则

- **单行道页 `/clouds`**：时间**正序**（早 → 晚），像一条从过去走到今天的路
- **上一篇 / 下一篇**：同一条时间线上相邻的两篇
- 同一天的多篇：按文件名升序

### 1.5 分类怎么生效

`tags` 写什么，侧栏「单行道」展开后就出现什么；点进去是 `/tags/<标签>`，只列该标签的文章。

- 建议全站控制在 **3–6 个标签**，否则侧栏会变成一团
- 新标签不需要改代码，写进 frontmatter 就自动出现
- 中文标签无需转义，链接会自动编码

### 1.6 封面

| 情况 | 结果 |
| --- | --- |
| 写了 `cover` | 卡片缩略图 + 文章页顶部横幅都用你的图 |
| 没写 `cover` | 自动生成一张程序化封面（冷灰蓝 + 云层 + 暖光，用 slug 做种子，同篇永远同一张），**只在列表里显示**，文章页不放 |

自定义图放进 `public/images/`，然后写 `cover: /images/文件名.jpg`。建议 16:9，宽度 1200px 左右。

### 1.7 本地预览

```powershell
cd F:\shelter-in-cloud
npm run dev
```

打开 <http://localhost:3000/clouds>，新文章立刻出现在时间线上。改 md 保存后刷新即可，不用重启。

### 1.8 提交前自检

```powershell
npm run lint:md
```

检查 Markdown 格式（标题空格、代码块语言、裸 URL 等）。常见报错见 `markdown-guide.md` 第 7 节。

### 1.9 发布

```powershell
git add content/articles/你的-slug.md
git commit -m "新增文章：标题"
git push origin master
```

Vercel 会自动部署，1–3 分钟后线上可见。

---

## 二、加音乐

整条链路：**本地音频 → 脚本生成条目和封面 → 上传 R2 → 写进 tracks.json → 提交推送**。

### 2.1 音频放哪里

**不要放进仓库**。`public/audio/` 已在 `.gitignore` 里，放进去也不会被提交。

建议统一暂存在仓库外：

```text
F:\shelter-audio\
```

### 2.2 起一个 slug

slug 就是文件在 R2 上的名字，**只用小写字母、数字、连字符**：

```text
ji-xinan-lin-lu-xing.flac
with-you-around.mp3
```

中文名一定要手动指定 slug，否则 URL 里会塞满百分号编码。

### 2.3 一条命令生成条目和封面

```powershell
npm run new-track -- "F:\shelter-audio\新歌.mp3" xin-ge
```

脚本会做三件事：

1. 读音频标签 → 标题 / 艺术家 / 专辑 / 时长
2. 把内嵌封面导出到 `public/images/covers/xin-ge.jpg`
3. 打印一条可粘进 `content/tracks.json` 的 JSON + 一条现成的 rclone 上传命令

如果音频没有内嵌封面，会给出警告，条目里就不带 `cover`（播放器退化成黑胶圆盘）。

### 2.4 上传到 R2

**每个新开的 PowerShell 窗口都要先配置一次**：

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

密钥在 Cloudflare → R2 → **Manage R2 API Tokens** 里创建，权限选 Object Read & Write、只勾 `shelter-audio` 桶。**用完记得删掉令牌。**

上传（脚本已经打印好这条命令）：

```powershell
& $rclone copyto "F:\shelter-audio\新歌.mp3" r2:shelter-audio/audio/xin-ge.mp3 -P --s3-no-check-bucket
```

要点：

- key **必须带 `audio/` 前缀**，`tracks.json` 里的地址就是按这个拼的
- 大文件加 `--s3-chunk-size 64M --s3-upload-concurrency 4` 走分块，更稳
- rclone 幂等，重复执行会跳过已完成文件；但**被 Ctrl+C 掐断的大文件会从头重传**
- 传完核对：

```powershell
& $rclone lsf r2:shelter-audio/audio --s3-no-check-bucket --format "sp"
```

### 2.5 写进 `content/tracks.json`

```json
{
  "src": "https://cdn.cloud-shelter.top/audio/xin-ge.mp3",
  "title": "歌名",
  "artist": "艺术家",
  "album": "专辑",
  "cover": "/images/covers/xin-ge.jpg",
  "duration": 233
}
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `src` | 是 | 完整地址。**缺了这条会被整条跳过** |
| `title` | 否 | 缺省用 slug 美化后的名字 |
| `artist` | 否 | 缺省为空 |
| `album` | 否 | 仅展示 |
| `cover` | 否 | `/images/covers/xxx.jpg`（随仓库走）或完整外链 |
| `duration` | 否 | 秒。缺了播放器会自己读出来 |

**数组顺序就是歌单顺序。**

### 2.6 封面曲（首页展示哪首）

首页留声机卡和 `/music` 的默认选中曲，由 `app/layout.tsx` 这一行决定：

```tsx
<PlayerProvider tracks={tracks} defaultId="with-you-around">
```

把 `defaultId` 改成新歌的 slug（即文件名去掉扩展名）即可换封面曲。

### 2.7 提交上线

```powershell
git add content/tracks.json public/images/covers/xin-ge.jpg
git commit -m "新增歌曲：歌名"
git push origin master
```

> **封面那张 jpg 一定要一起 add**。音频在 CDN 上，构建时无法自动提取封面；漏了它线上就没有封面图。

### 2.8 验证

```powershell
# 外部能不能拿到，支不支持拖进度条
curl.exe -sI https://cdn.cloud-shelter.top/audio/xin-ge.mp3
```

期望：`200`、`Content-Length` 与本地一致、`Accept-Ranges: bytes`。

---

## 三、命令速查

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览 <http://localhost:3000> |
| `npm run build` | 生产构建（提交前建议跑一次） |
| `npm run lint:md` | 检查 Markdown 格式 |
| `npm run new-track -- "<音频路径>" <slug>` | 生成封面与歌单条目 |

⚠️ **`npm run dev` 和 `npm run build` 会抢同一个 `.next` 目录**。构建前先停掉 dev，否则页面会 500。

---

## 四、发布检查清单

- [ ] `npm run lint:md` 通过
- [ ] `npm run build` 通过
- [ ] 新文章：`title` / `desc` / `date` 都写了，日期带引号
- [ ] 新歌曲：`rclone lsf` 能看到，字节数对得上
- [ ] 新歌曲：封面 jpg 已 `git add`
- [ ] `tracks.json` 里的 `src` 以 `https://cdn.cloud-shelter.top/audio/` 开头
- [ ] `git status` 里没有意外的大文件（音频永远不该出现在里面）

---

## 五、常见问题

**文章没出现**

1. 文件在 `content/articles/` 吗
2. 扩展名是 `.md` 吗
3. `date` 是不是写成了别的格式

**页面 500 / 白屏**

多半是 `npm run build` 和 `npm run dev` 同时跑，抢 `.tmp`/`.next` 的产物。停掉 dev 重启即可。

**歌点了没声音**

F12 → Network 看那条音频：

| 状态码 | 原因 |
| --- | --- |
| 404 | key 拼错，或 `tracks.json` 里的 `src` 写错（R2 区分大小写） |
| 403 | 桶的公共访问没开 |
| 200 但卡住 | 检查响应头有没有 `Accept-Ranges: bytes` |

**换页音乐会不会断**

不会。播放器挂在根布局（`PlayerProvider`），离开 `/music` 后底部会出现常驻播放条。

**封面不显示**

1. `public/images/covers/` 里有那张文件吗
2. 有没有 `git add`（没提交等于线上没有）
3. `tracks.json` 里的 `cover` 路径对不对

**页面还是旧的**

1. 浏览器 `Ctrl+F5` 强刷
2. Vercel → Deployments 看新部署是否 Ready
3. Cloudflare → Caching → Purge Cache

**`git push` 没报错但没推上去**

本机 `GIT_TERMINAL_PROMPT=0` 会掐掉凭据管理器，导致静默失败。显式覆盖：

```powershell
$env:GIT_TERMINAL_PROMPT = "1"
git push origin master
```

---

## 六、不要做的事

1. **不要把音频提交进仓库**。`public/audio/` 已忽略；硬塞进去会让 `git clone` 变得极慢。
2. **不要把 R2 密钥写进文件**。只放在当前 PowerShell 会话的环境变量里。
3. **不要删掉 `content/tracks.json`** 而指望自动扫描——`public/audio/` 现在是空的，歌单会直接变空。
4. **不要在音频没传 R2 之前改 `tracks.json` 并部署**，线上会立刻 404。
5. **不要一次性加七八个标签**，侧栏会被撑爆。
