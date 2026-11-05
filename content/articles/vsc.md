---
title: "VS Code 写 C++：三个新手坑"
desc: "中文乱码、终端不弹出、滚动卡顿——三篇避坑笔记的入口"
date: "2026-11-05"
tags: [造物手记]
---

第一次用 VS Code 写 C++，最先卡住的往往不是语法，是环境。下面是三部笔记的索引，每篇都能单独看。

## 三篇避坑笔记

### ① [C++ 输出中文乱码？加一个编译参数就好](/article/vsc-zhongwen-luanma)

代码里写 `std::cout << "你好"`，控制台却是一堆乱码。不用改系统、不用动编码，只给 g++ 加一个 `-fexec-charset=GBK`。

### ② [让 Ctrl+F5 弹出独立终端跑 C++](/article/vsc-zhongduan)

VS Code 默认把结果输出在集成终端里，看着挤，也没法给程序输入。用 `launch.json` 换成真正的黑窗口。

### ③ [让滚动和光标更顺滑](/article/vsc-pinghua)

三行 `settings.json`，滚动手感和光标动画立刻不一样——属于用过就回不去的那类设置。

## 环境

三篇都基于 **Windows + VS Code + MinGW-w64（g++ / gdb）**，配置文件直接写在正文里，复制即可。

> 问题各不相同，不必按顺序读——哪篇对症就看哪篇。
