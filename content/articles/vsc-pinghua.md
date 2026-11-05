---
title: "让滚动和光标更顺滑"
desc: "三行 settings.json，滚动手感和光标动画立刻不一样"
date: "2026-11-04"
tags: [造物手记]
hidden: true
---

> **本系列三篇**（建议按顺序看，也可以单看）：
> ① [中文乱码](/article/vsc-zhongwen-luanma) · ② [Ctrl+F5 弹出独立终端](/article/vsc-zhongduan) · ③ 平滑滚动/光标动画（本篇）
>
> **适用环境**：Windows + VS Code，第一次用 VS Code 的同学（不需要装编译器，纯界面设置）。
> **本篇配套文件**：`03-settings.json`
> 📖 总目录与使用说明：[README](/article/vsc)

---

## 0. 一句话结论

> 把几行设置写进 VS Code 的 **`settings.json`**（用户设置或项目 `.vscode/settings.json`），就能让滚动“滑”起来、光标移动带一点动画。

效果包含：

- 鼠标滚轮滚代码时是**平滑滑动**，不再一格一卡；
- 侧边栏、文件列表滚动也是平滑的；
- 底部集成终端输出滚动更柔和；
- 光标移动有短促动画，闪烁变成**渐隐渐现**。

---

## 1. 先搞懂：VS Code 的设置其实都保存在 JSON 里

VS Code 的设置有两种“作用范围”：

| 类型 | 作用范围 | 文件在哪 |
|---|---|---|
| **用户设置** | 所有项目都生效（推荐新手用） | `C:\Users\你的用户名\AppData\Roaming\Code\User\settings.json` |
| **工作区设置** | 只对当前打开的文件夹生效 | 项目根目录的 `.vscode\settings.json` |

两种都可以用，写法完全一样。**新手建议直接用“用户设置”**，一次配置，以后所有项目都顺滑。

### 1.1 怎么打开用户设置 JSON（最简单的方法）

1. 按 `Ctrl+Shift+P` 打开命令面板（所有 VS Code 命令都能在这里搜到）；
2. 输入 `Open User Settings (JSON)`；
   - 中文界面的名字是：**首选项: 打开用户设置(JSON)**；
3. 回车，就会打开 `settings.json` 文件。

> 也可以点左下角齿轮 ⚙ → “设置” → 设置页面右上角的 **`{}` 图标**，效果一样。

### 1.2 工作区设置（项目专属）

如果希望“只有这个项目顺滑”，就先 **文件 → 打开文件夹** 打开项目，再在项目根目录新建 `.vscode\settings.json`：

1. 左侧资源管理器空白处右键 → 新建文件夹 → 输入 `.vscode`；
2. 右键 `.vscode` → 新建文件 → 输入 `settings.json`；
3. 粘贴内容，`Ctrl+S` 保存。

> 注意：和工作区设置相比，**工作区设置的优先级更高**（同一个设置项两边都写了，以工作区为准）。

---

## 2. 动手配置（两种方式任选其一）

### 方式 A：用户设置（推荐）

1. `Ctrl+Shift+P` → `Open User Settings (JSON)`；
2. 打开后里面可能已经有内容。把本教程配套的 `03-settings.json` 里的几行**加进最外层大括号 `{ }` 里面**；
   - 如果原来最后一项没有逗号，新增的内容前要补一个英文逗号；
   - 如果文件原本是空的 `{}`，直接粘贴进去即可。
3. `Ctrl+S` 保存。

### 方式 B：工作区设置

1. 先“打开文件夹”；
2. 新建 `.vscode\settings.json`；
3. 粘贴 `03-settings.json` 的内容；
4. `Ctrl+S` 保存。

---

## 3. 每项设置的作用

```json
{
  "editor.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  "terminal.integrated.smoothScrolling": true,
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.cursorBlinking": "smooth"
}
```

| 设置项 | 作用 | 可填的值 |
|---|---|---|
| `editor.smoothScrolling` | **编辑器里**用鼠标滚轮滚动时平滑滑动 | `true` / `false` |
| `workbench.list.smoothScrolling` | **列表类界面**（资源管理器、设置页、命令面板等）平滑滚动 | `true` / `false` |
| `terminal.integrated.smoothScrolling` | **集成终端**里滚动平滑 | `true` / `false` |
| `editor.cursorSmoothCaretAnimation` | **光标移动**时带一点过渡动画 | `"on"` / `"off"` / `"explicit"` |
| `editor.cursorBlinking` | **光标闪烁**的方式 | `"blink"` 普通 / `"smooth"` 平滑渐隐 / `"phase"` 呼吸 / `"expand"` 展开 / `"solid"` 不闪 |

说明：

- 前三个是开关，打开就是平滑；
- 后两个是“动画风格”，按喜好调；
- 如果觉得光标动画太“飘”，把 `editor.cursorSmoothCaretAnimation` 改成 `"off"` 即可。

---

## 4. 立即看效果（不需要重启）

保存设置后：

1. 打开一个长一点的 `.cpp` 文件；
2. 用鼠标滚轮上下滚 → 应该是平滑滑动；
3. 用方向键上下移动光标 → 光标会有一点动画；
4. 打开底部终端 → 滚动输出也变顺滑。

如果没反应：`Ctrl+Shift+P` → `Developer: Reload Window` 重载一次窗口。

---

## 5. JSON 语法小白提醒（最容易踩的坑）

新手改坏配置文件，基本都是这几个原因：

1. **必须用英文双引号**，不能用中文引号 `“ ”`；
2. **每项之间用英文逗号 `,` 分隔**，但**最后一项后面不能加逗号**；
3. **`true` / `false` 是小写，且不加引号**；字符串（比如 `"on"`）才加引号；
4. **不能有中文标点**（逗号、括号都不行）；
5. 合并到已有设置时，**别把原来的内容删掉**——新增的内容插在原来最后一项后面，前面补逗号；
6. 保存后如果右下角或行号旁出现**红色波浪线**，说明 JSON 格式错了，把鼠标悬停上去会提示哪里错。

一个“安全”的写法示例（已有设置 + 新设置合并）：

```json
{
  "files.autoSave": "afterDelay",
  "editor.fontSize": 16,
  "editor.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  "terminal.integrated.smoothScrolling": true,
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.cursorBlinking": "smooth"
}
```

> 注意上一行 `"editor.fontSize": 16` 后面有逗号，最后一行没有逗号。

---

## 6. 进阶（可选）：窗口透明效果

如果你还想要“编辑区半透明”的效果，需要额外安装扩展（本篇不展开，小白可以先跳过）：

1. 左侧“扩展”图标 → 搜索 `vscode-translucent` → 安装；
2. 在 `settings.json` 里加下面几行（注意：这是要“合并”进已有大括号里的属性，不是完整文件；数值按喜好调，`0.4` 越小越透）：

   ```text
   "vscode-translucent.effect": "none",
   "vscode-translucent.opacity": 0,
   "vscode-translucent.editorContainerBackgroundOpacity": 0.4,
   "vscode-translucent.leftSidebarContainerBackgroundOpacity": 1,
   "vscode-translucent.activityBarContainerBackgroundOpacity": 1
   ```

3. `Ctrl+Shift+P` → 输入 `Translucent: Enable` → 回车；
4. `Ctrl+Shift+P` → `Developer: Reload Window` 重载窗口。

> 提醒：透明效果会影响可读性和性能，建议先把基础设置玩熟再折腾。

---

## 7. 常见问题（FAQ）

**Q1：设置改了没反应？**

- 文件保存了吗（`Ctrl+S`）？
- JSON 格式对不对（看有没有红色波浪线）？
- `Ctrl+Shift+P` → `Developer: Reload Window` 重载一次。

**Q2：我不小心把原来的设置删了怎么办？**
VS Code 不会自动备份。如果只是加了本篇这几行，把这几行删掉就能恢复默认；重要设置建议平时截图或备份 `settings.json`。

**Q3：用户设置和工作区设置都写了同一个设置，用哪个？**
工作区（项目 `.vscode/settings.json`）优先。

**Q4：想恢复某一项默认？**
把那一行删掉，或把 `true` 改成 `false`。

**Q5：设置文件的路径到底在哪？**

- 用户设置：`Ctrl+Shift+P` → `Open User Settings (JSON)` 打开后，VS Code 标题栏/文件路径会显示实际位置；Windows 下通常是
  `C:\Users\你的用户名\AppData\Roaming\Code\User\settings.json`；
- 工作区设置：项目根目录 `.vscode\settings.json`（必须先“打开文件夹”才会被读取）。

**Q6：这些设置会让 VS Code 变卡吗？**
不会，这几项都是界面动画开关，开销很小；如果觉得不顺眼，随时改回 `false` / `"off"`。

---

## 8. 小结

> 平滑效果 = 5 行 `settings.json`；
> 用户设置一次配好全局生效，改坏了按提示改回来即可。

**本系列到此结束：**

- ① [中文乱码](/article/vsc-zhongwen-luanma)
- ② [Ctrl+F5 弹出独立终端](/article/vsc-zhongduan)
- ③ 平滑滚动/光标动画（本篇）
