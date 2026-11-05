---
title: "让 Ctrl+F5 弹出独立终端跑 C++"
desc: "用 launch.json 把输出从集成终端换成真正的黑窗口，方便看结果也给程序输入"
date: "2026-11-03"
tags: [造物手记]
hidden: true
---

> **本系列三篇**（建议按顺序看，也可以单看）：
> ① [中文乱码](/article/vsc-zhongwen-luanma) · ② Ctrl+F5 弹出独立终端（本篇） · ③ [平滑滚动/光标动画](/article/vsc-pinghua)
>
> **适用环境**：Windows + VS Code + MinGW-w64（g++ / gdb），第一次用 VS Code 写 C++ 的同学。
> **本篇配套文件**：`02-launch.json`（复制到项目 `.vscode` 文件夹并改名为 `launch.json`）
> 📖 总目录与使用说明：[README](/article/vsc)
> **前置条件**：需要第一篇的 `01-tasks.json`（编译任务），因为“运行”之前得先“编译”。

---

## 0. 一句话结论

> 在项目根目录的 `.vscode` 文件夹里放一个 **`launch.json`**，把 `"externalConsole"` 设为 **`true`**，之后按 **`Ctrl+F5`**（或点右上角 **▶**）就会弹出独立的 cmd 黑窗口运行程序。

---

## 1. 先搞清楚：VS Code 里程序输出到底有哪几个地方？

新手最容易晕的就是“我的输出去哪了”。VS Code 里其实有 **3 个**显示程序输出的地方：

| 位置 | 长什么样 | 能键盘输入吗 | 什么时候用 |
|---|---|---|---|
| **集成终端**（底部终端） | VS Code 底部面板里的 PowerShell | ✅ 能 | 手动敲命令、普通运行 |
| **调试控制台** | 底部面板里叫“调试控制台”的标签 | ❌ 不能 | 调试时看变量/信息 |
| **外部控制台**（独立窗口） | 一个单独的 **cmd 黑窗口** | ✅ 能 | 想看得清楚、程序要输入、运行完窗口不关 |

`launch.json` 里的 `"externalConsole"` 就是用来选“程序跑在哪”的：

- `"externalConsole": true` → **弹独立黑窗口**（本篇想要的）
- `"externalConsole": false` → 在 VS Code **内部**运行（调试控制台/集成终端）

---

## 2. 为什么默认按 Ctrl+F5 弹不出黑窗口？

- `Ctrl+F5` 在 VS Code 里的名字叫 **“运行但不调试”（Run Without Debugging）**，它需要一个**启动配置**——也就是 `launch.json`；
- 没有 `launch.json` 时，VS Code 要么让你“选择调试配置”，要么把输出放进调试控制台；
- 如果**没有用“打开文件夹”打开项目**（只打开了单个文件），`.vscode` 里的配置根本不会被读取（第一篇讲过这个坑）。

**典型症状**（中一个就说明没配好）：

- 按 `Ctrl+F5` 弹出一个配置列表让你选；
- 每次运行都要重新选一遍；
- 程序跑完什么窗口都没有，输出在“调试控制台”里；
- 想要黑窗口但就是出不来。

---

## 3. 动手配置（跟着做，约 5 分钟）

### 3.0 前提：已经用「打开文件夹」打开了项目

菜单 **文件 → 打开文件夹**（`Ctrl+K` 然后 `Ctrl+O`），选择你的代码文件夹。
判断：左侧资源管理器是文件夹树、窗口标题有文件夹名。

### 3.1 先准备编译任务（第一篇的 `tasks.json`）

本篇的 `launch.json` 会在运行前调用一个**编译任务**。如果你还没配，先看第一篇，在 `.vscode` 里建好 `tasks.json`。

本系列用到的编译任务名字是：

```text
编译当前C++文件 (g++)
```

（这个名字要记住，后面要和 `launch.json` 里的 `preLaunchTask` **一字不差**。）

### 3.2 新建 `.vscode` 文件夹（已有就跳过）

在左侧资源管理器空白处 → 右键 → **新建文件夹** → 输入 `.vscode`。

### 3.3 新建 `launch.json`

1. 右键 `.vscode` 文件夹 → **新建文件** → 输入文件名 `launch.json`；
2. 打开本教程配套的 `02-launch.json`，把**全部内容**复制进去；
3. `Ctrl+S` 保存。

### 3.4 gdb 需要填路径吗？（一般不用）

本教程的 `launch.json` **没有写死 gdb 路径**：只要 gdb 已经加进系统 PATH（在终端输入 `gdb --version` 能看到版本号就说明在），VS Code 会自动找到它。

**万一启动时提示找不到 gdb**：在终端执行 `where.exe gdb` 查到完整路径，然后在 `launch.json` 里 `"MIMode": "gdb",` 这一行的**后面**加一行：

```text
"miDebuggerPath": "C:\\mingw64\\bin\\gdb.exe",
```

注意：JSON 里反斜杠要写两个（`C:\mingw64\bin\gdb.exe` → `C:\\mingw64\\bin\\gdb.exe`）；加完别忘了给上一行末尾补一个英文逗号。

### 3.5 试一下

打开任意一个 `.cpp` 文件，然后：

- 按 **`Ctrl+F5`**；或
- 点编辑器右上角的 **▶**（运行 C/C++ 文件）。

**预期效果**：先编译（可以在底部看到编译过程），然后**弹出一个独立的 cmd 黑窗口**运行你的程序；程序结束后窗口不会消失，会停在 `C:\你的路径>` 提示符，输入 `exit` 回车即可关闭。

---

## 4. 配置文件逐项说明

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "C++ 运行（弹出终端）",
      "type": "cppdbg",
      "request": "launch",
      "program": "${fileDirname}\\${fileBasenameNoExtension}.exe",
      "args": [],
      "stopAtEntry": false,
      "cwd": "${fileDirname}",
      "environment": [],
      "externalConsole": true,
      "MIMode": "gdb",
      "setupCommands": [
        { "description": "为 gdb 启用整齐打印（pretty-printing）", "text": "-enable-pretty-printing", "ignoreFailures": true }
      ],
      "preLaunchTask": "编译当前C++文件 (g++)"
    }
  ]
}
```

| 字段 | 含义 |
|---|---|
| `version` | 固定 `0.2.0` |
| `name` | 配置名称，会显示在“运行和调试”下拉框里，随便起 |
| `type` | C/C++ 用 `cppdbg`（Windows 下的 MinGW/GDB） |
| `request` | `launch` 表示“启动程序”，固定写这个 |
| `program` | 要运行的程序：源文件同目录、同名的 `.exe` |
| `args` | 命令行参数，没有就留空数组 |
| `stopAtEntry` | 是否在程序入口停住，`false` 表示直接运行 |
| `cwd` | 程序运行的“工作目录”，设成源文件目录（读写文件时有用） |
| `environment` | 环境变量，留空即可 |
| **`externalConsole`** | **`true` = 弹独立黑窗口；改成 `false` 就在 VS Code 内部运行** |
| `MIMode` | 用 gdb 调试，固定 `gdb` |
| `miDebuggerPath` | （可选）gdb 的路径；不写时自动在 PATH 里找，找不到才需要填 |
| `setupCommands` | gdb 初始化命令，保持默认即可 |
| **`preLaunchTask`** | 运行前先执行的编译任务名，**必须和 `tasks.json` 里的 `label` 完全一致** |

---

## 5. 为什么我点 ▶ 每次都要“选择调试配置”？

这是新手最常见的困惑，原因一般有三个：

1. **没有用“打开文件夹”打开项目** → `.vscode` 没被加载；
2. **没有默认构建任务** → 扩展不知道用哪个；
3. 配置文件写好了，但 `launch.json` 的 `preLaunchTask` 和 `tasks.json` 的 `label` 不一致。

本系列的配置能避免这个问题：

- `tasks.json` 里有 `"group": { "kind": "build", "isDefault": true }`（默认构建任务）；
- `launch.json` 的 `preLaunchTask` 与它的 `label` 一字不差。

这样 C/C++ 扩展会把这份配置当成**默认配置**，点 ▶ / Ctrl+F5 直接运行，不再弹列表。

> 如果还是弹：`Ctrl+Shift+P` → 输入 `Developer: Reload Window` → 回车，让 VS Code 重新加载配置。

---

## 6. 验证

1. 新建 `test.cpp`：

   ```cpp
   #include <iostream>
   int main() {
       int n = 0;
       std::cout << "请输入一个数字：";
       std::cin >> n;
       std::cout << "你输入的是：" << n << std::endl;
       return 0;
   }
   ```

2. 打开它，按 `Ctrl+F5`；
3. 预期：
   - 弹出一个独立的 cmd 窗口；
   - 窗口里提示“请输入一个数字：”，**可以正常键盘输入**；
   - 输入后显示“你输入的是：xxx”；
   - 程序结束后窗口停住，不会一闪而过。

> 如果中文显示乱码，去第一篇加 `-fexec-charset=GBK`。

---

## 7. 常见问题（FAQ）

**Q1：窗口一闪就没了？**
先确认你按的是 **`Ctrl+F5`**（运行但不调试）或点 ▶，而不是 **`F5`**（调试）。`F5` 是调试模式，程序结束时会关闭外部控制台；想用 `F5` 又要看输出，可以在 `main` 最后加一句 `getchar();` 或 `system("pause");`。用 `Ctrl+F5` 则窗口会一直停着。

**Q2：我就是想让它显示在 VS Code 底部终端，不想弹窗？**
把 `launch.json` 里的 `"externalConsole": true` 改成 `false`，保存即可。

**Q3：运行报错“找不到任务：编译当前C++文件 (g++)”？**
说明 `launch.json` 的 `preLaunchTask` 和 `tasks.json` 的 `label` 不一致（多一个空格、括号全角半角不同都不行），或者 `tasks.json` 没放在 `.vscode` 里。

**Q4：启动时报“找不到 gdb” / 和 `miDebuggerPath` 有关？**
说明 gdb 不在 PATH 里，或者路径写错了。终端里 `where.exe gdb` 查到真实路径，按 3.4 加一行 `"miDebuggerPath"`；注意 JSON 反斜杠写两个。

**Q5：弹窗口了但中文乱码？**
看第一篇，在编译参数里加 `-fexec-charset=GBK`。

**Q6：以后换了项目还要再配一遍吗？**
`.vscode` 是“按文件夹”生效的，换项目需要把 `.vscode` 文件夹复制过去（或者把配置放到用户级别，属于进阶用法）。

**Q7：为什么弹出来的窗口标题看着像 `cmd.exe` 的路径？**
正常，那就是新开的控制台窗口；程序输出都在里面。

---

## 8. 小结

> **`launch.json` 是“怎么运行”的配置：`externalConsole: true` 就弹独立窗口；
> 它的 `preLaunchTask` 指向 `tasks.json` 里的编译任务，名字必须一致。**

下一篇：[③ 让 VS Code 更顺滑：平滑滚动 + 光标动画](/article/vsc-pinghua)
