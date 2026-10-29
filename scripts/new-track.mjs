#!/usr/bin/env node
/**
 * 把一首新歌整理成可直接用的歌单条目：
 *   1. 读音频标签（标题 / 艺术家 / 专辑 / 时长）
 *   2. 把内嵌封面导出到 public/images/covers/
 *   3. 打印一条可粘进 content/tracks.json 的 JSON，并给出上传 R2 的命令
 *
 * 用法：npm run new-track -- "F:\路径\新歌.mp3" [slug]
 *   slug 是文件在 R2 上的英文名，不填就从文件名自动转（中文名请手动指定）
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseFile } from 'music-metadata'

const audioExts = ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.opus', '.webm']
const coverDir = path.join(process.cwd(), 'public', 'images', 'covers')
const CDN = 'https://cdn.cloud-shelter.top'
const BUCKET = 'shelter-audio'

const [, , inputArg, slugArg] = process.argv
if (!inputArg) {
  console.error('用法: npm run new-track -- "<音频文件路径>" [slug]')
  process.exit(1)
}

const abs = path.resolve(inputArg)
if (!fs.existsSync(abs)) {
  console.error(`找不到文件: ${abs}`)
  process.exit(1)
}

const ext = path.extname(abs).toLowerCase()
if (!audioExts.includes(ext)) {
  console.error(`不支持的音频格式: ${ext}`)
  process.exit(1)
}

const base = path.basename(abs, path.extname(abs))
const ascii = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const slug = (slugArg || ascii || base).trim()

const meta = await parseFile(abs)
const pic = meta.common.picture?.[0]

let cover
if (pic?.data?.length) {
  fs.mkdirSync(coverDir, { recursive: true })
  const imgName = `${slug}.${pic.format === 'image/png' ? 'png' : 'jpg'}`
  fs.writeFileSync(path.join(coverDir, imgName), pic.data)
  cover = `/images/covers/${encodeURIComponent(imgName)}`
  console.log(`✅ 封面已导出: public/images/covers/${imgName}`)
} else {
  console.warn('⚠️  这个文件没有内嵌封面，条目里不会带 cover')
}

const fileName = encodeURIComponent(slug + ext)
const entry = {
  src: `${CDN}/audio/${fileName}`,
  title: meta.common.title || base,
  artist: meta.common.artist || meta.common.artists?.join('、') || '',
  album: meta.common.album,
  cover,
  duration: Math.round(meta.format.duration || 0),
}

console.log('\n把下面这条加到 content/tracks.json 的数组里：\n')
console.log(JSON.stringify(entry, null, 2))
console.log(`\n然后上传音频（文件名必须是 ${slug}${ext}）：\n`)
console.log(`  & rclone copyto "${abs}" r2:${BUCKET}/audio/${slug}${ext} -P --s3-no-check-bucket`)
console.log('\n最后 git add 封面和 tracks.json，commit 后 push。')
