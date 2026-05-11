<div align="center">

# 🛠️ GitAutoManageBoard

**A lightweight, browser-based Git management dashboard — no installation required.**

一个轻量级、基于浏览器的 Git 可视化管理面板，无需安装，开箱即用。

[![Python](https://img.shields.io/badge/Python-3.6%2B-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/github/license/waynewgl1987/GitAutoManageBoard)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)]()

[English](#english) · [中文](#中文)

</div>

---

## English

### What is this?

**GitAutoManageBoard** is a single-file Python script that launches a local web server and opens a full-featured Git dashboard in your browser. It wraps common `git` commands into an intuitive UI — perfect for developers who want a faster, visual alternative to the command line for daily Git operations.

No frameworks, no npm, no Docker. Just Python 3 and a modern browser.

---

### ✨ Features at a Glance

| Tab | What you can do |
|-----|----------------|
| **Commit** | Stage / unstage files, view inline diffs, write commit messages, commit with one click |
| **Branches** | View local & remote branches, create branches, switch branches, fuzzy search, pagination |
| **Commit Log** | Browse history, search by hash / author / message, search code inside diffs |
| **Conflicts** | Side-by-side visual conflict resolution — pick ours, theirs, or write custom content |
| **Stash** | List, inspect, pop, or drop stash entries |
| **Remote** | Fetch, Pull (merge / rebase / fast-forward), Push — all with live streaming output |

---

### 🚀 Quick Start

#### Prerequisites

- Python 3.6 or later
- Git installed and available in your `PATH`
- A terminal opened **inside the repository** you want to manage

#### Run

```bash
# Navigate to the target git repository first
cd /path/to/your/git/repo

# Then run the tool
python3 /path/to/git_commit_tool.py
```

The browser will open automatically at `http://127.0.0.1:8989`.  
If port `8989` is busy, the tool auto-increments to the next available port.

---

### 📖 Detailed Feature Guide

#### 1 · Commit Tab

The default landing page. Shows all **unstaged and staged changes** in your working tree.

- Each changed file is displayed as a collapsible card with a **colored diff** (green = additions, red = deletions).
- **Check / uncheck** individual files to include or exclude them from the commit.
- **Select All / Deselect All** checkbox for bulk operations.
- Type your commit message in the text field and click **Confirm Commit**.
- ⚠️ **Protected Branch Warning** — if you are on `main`, `master`, `develop`, or `release`, a confirmation dialog will appear before the commit is executed, preventing accidental direct commits to shared branches.

#### 2 · Branches Tab

Manage all local and remote branches in one place.

- **Local branches** are listed first, sorted by the most recent commit date. The current branch is highlighted in blue.
- **Remote branches** are paginated (10 / 20 / 50 / 100 / 200 / 300 per page, or load all).
- **Create Branch** — type a name and optionally base it on another branch.
- **Switch Branch** — click any branch name. If you have uncommitted changes, a modal will prompt you to **stash** them first, then switch.
- **Fuzzy Search** — type to filter branches by name. Quick-filter buttons for `develop`, `release`, `feature`, and `hotfix` prefixes are included.

#### 3 · Commit Log Tab

Explore the full commit history of the current branch.

- **Search bar** filters commits by hash, author name, or commit message simultaneously.
- **Code diff search** — search for a regex pattern inside actual diff content (uses `git log -G`). Matching commits are highlighted.
- **Pagination** — 1 / 5 / 10 / 20 / 50 / 100 / 300 per page, or load all.
- **Sort order** — toggle ascending / descending by timestamp.
- **Per-commit actions:**
  - 📋 **View diff** — see the full file diff of that commit.
  - 🔁 **Revert** — create a new commit that undoes the selected commit (history preserved).
  - ↩️ **Soft Reset** — move HEAD back to that commit, keep changes staged.
  - 💥 **Hard Reset** — move HEAD back and discard all subsequent changes.
  - 📂 **Restore file** — browse which files changed in a commit and restore any single file to that version.
- **Squash** — check 2 or more commits, enter a new message, and merge them into one (`git reset --soft` + new commit). A protected-branch warning also applies here.

#### 4 · Conflicts Tab

Triggered automatically when a merge, rebase, or cherry-pick produces conflicts.

- Lists every conflicted file.
- Expand a file to see **side-by-side panels**: *Ours* (current branch) vs *Theirs* (incoming).
- Each conflict block can be resolved independently:
  - ✅ **Keep Ours** — accept the current branch version.
  - ✅ **Keep Theirs** — accept the incoming version.
  - ✏️ **Edit manually** — write a custom resolution in a textarea.
- A **jump bar** helps navigate between multiple conflict blocks inside the same file.
- After resolving all blocks, click **Mark Resolved** to `git add` the file.
- **Reset Conflict State** button aborts any ongoing merge / rebase / cherry-pick and returns to the last clean commit.

#### 5 · Stash Tab

- Lists all stash entries with index, message, and a **diff preview**.
- **Pop** — apply the stash back and remove it from the stack.
- **Drop** — permanently delete a stash entry.
- Pagination for repositories with many stash entries.

#### 6 · Remote Operations (top bar)

Three buttons always visible at the top:

| Button | Underlying Command | Description |
|--------|-------------------|-------------|
| ⬇ **Fetch** | `git fetch --all --prune` | Download remote refs without merging |
| 🔄 **Pull** | `git pull` (merge / rebase / ff-only) | Sync remote commits to local branch |
| 🚀 **Push** | `git push --verbose --progress` | Send local commits to remote with live streaming log |

- Pull supports three strategies selectable in-app: **merge**, **rebase**, and **fast-forward only**.
- Push **streams output** line-by-line so you can watch progress in real time.
- If the remote branch does not exist yet, a one-click **"Push to origin"** button sets the upstream automatically.
- If authentication fails during push, the UI prompts for **username / password** and retries transparently.

#### 7 · Language Support

Click the **EN / 中文** selector in the top-right corner to switch the entire UI between English and Chinese instantly. The preference is saved in `localStorage`.

#### 8 · Message Log

All operation results (commits, pulls, pushes, resets, …) are stored in an in-session log. Click **View Log** in the sub-header to browse the full history of operations during the current session. Logs can be cleared with one click.

---

### ⌨️ Keyboard & UX Tips

- Press **Enter** in the commit message field to trigger commit.
- The global spinner in the top-center indicates any in-progress API call.
- Toast notifications (top-right) confirm success or failure for every action.
- All diff blocks support horizontal scrolling for long lines.

---

### 🔒 Security Notes

- The server **binds to `127.0.0.1` only** — it is never exposed to your network.
- Git credentials entered in the push dialog are passed via a temporary shell script and deleted immediately after use.
- Interactive Git prompts are disabled (`GIT_TERMINAL_PROMPT=0`) to prevent subprocesses from hanging.

---

### 🗂️ Project Structure

```
GitAutoManageBoard/
└── git_commit_tool.py   # Single-file app: HTTP server + Git API + embedded HTML/CSS/JS
```

The entire application — backend logic, HTML, CSS, and JavaScript — lives in one file for maximum portability.

---

### 📋 Requirements

- Python ≥ 3.6 (standard library only — `http.server`, `subprocess`, `json`, `socket`, `threading`)
- Git ≥ 2.x

No third-party packages required.

---

### 📄 License

[MIT](LICENSE)

---

---

## 中文

### 这是什么？

**GitAutoManageBoard** 是一个单文件 Python 脚本，运行后会在本地启动一个 Web 服务器，并自动在浏览器中打开一个功能完整的 Git 可视化管理面板。它将常用的 `git` 命令封装成直观的 UI 界面，特别适合希望在日常 Git 操作中获得更快、更直观体验的开发者。

无需任何框架、无需 npm、无需 Docker。只需 Python 3 和一个现代浏览器。

---

### ✨ 功能一览

| 标签页 | 你可以做的事 |
|--------|------------|
| **提交 (Commit)** | 暂存/取消暂存文件、查看内联 diff、填写提交信息、一键提交 |
| **分支 (Branches)** | 查看本地和远端分支、创建分支、切换分支、模糊搜索、分页 |
| **提交日志 (Commit Log)** | 浏览历史记录，按 hash / 作者 / 消息搜索，搜索 diff 内部代码 |
| **冲突 (Conflicts)** | 左右对比可视化冲突解决 — 选择我方、他方或手动编辑 |
| **暂存 (Stash)** | 列出、查看、pop 或删除 stash 条目 |
| **远端 (Remote)** | Fetch、Pull（merge / rebase / fast-forward）、Push — 全部支持实时流式输出 |

---

### 🚀 快速开始

#### 前置条件

- Python 3.6 或更高版本
- 已安装 Git 并配置在 `PATH` 中
- 终端已**切换到你想管理的 Git 仓库目录**

#### 运行

```bash
# 先切换到目标 git 仓库目录
cd /path/to/your/git/repo

# 然后运行工具
python3 /path/to/git_commit_tool.py
```

浏览器会自动打开 `http://127.0.0.1:8989`。  
如果 `8989` 端口被占用，工具会自动递增到下一个可用端口。

---

### 📖 详细功能说明

#### 1 · 提交 (Commit) 标签页

默认首页，展示工作区中所有**未暂存和已暂存的变更**。

- 每个改动文件以可折叠卡片形式显示，带有**彩色 diff**（绿色 = 新增，红色 = 删除）。
- 通过**勾选/取消勾选**单个文件来控制哪些文件加入本次提交。
- **全选 / 取消全选**复选框用于批量操作。
- 在文本框中填写提交信息，点击**确认 Commit** 按钮即可提交。
- ⚠️ **重要分支警告** — 如果你当前在 `main`、`master`、`develop` 或 `release` 分支上，提交前会弹出确认对话框，防止误向共享分支直接提交。

#### 2 · 分支 (Branches) 标签页

在一个页面管理所有本地和远端分支。

- **本地分支**优先展示，按最近提交时间排序，当前分支以蓝色高亮。
- **远端分支**支持分页（每页 10 / 20 / 50 / 100 / 200 / 300 条，或加载全部）。
- **新建分支** — 输入名称，可选择基于某个分支创建。
- **切换分支** — 点击任意分支名即可切换。如果有未提交的改动，会弹出模态框提示先 **stash** 再切换。
- **模糊搜索** — 实时输入过滤分支名称。内置 `develop`、`release`、`feature`、`hotfix` 前缀快捷筛选按钮。

#### 3 · 提交日志 (Commit Log) 标签页

浏览当前分支的完整提交历史。

- **搜索框**同时支持按 hash、作者名、提交消息过滤。
- **代码 diff 搜索** — 在实际 diff 内容中搜索正则表达式（使用 `git log -G`），匹配的提交高亮显示。
- **分页** — 每页 1 / 5 / 10 / 20 / 50 / 100 / 300 条，或加载全部。
- **排序** — 可切换时间戳升序 / 降序。
- **每条提交的操作：**
  - 📋 **查看 diff** — 展开该提交的完整文件变更。
  - 🔁 **Revert** — 创建一个新的提交来撤销指定提交（保留历史记录）。
  - ↩️ **Soft Reset** — 将 HEAD 移回该提交，改动保留在暂存区。
  - 💥 **Hard Reset** — 将 HEAD 移回并丢弃之后的所有改动。
  - 📂 **还原文件** — 浏览该提交中变更的文件，将任意单个文件还原到该版本。
- **Squash（合并提交）** — 勾选 2 个或以上提交，输入新消息，将它们合并为一个提交（`git reset --soft` + 新提交）。重要分支警告同样适用。

#### 4 · 冲突 (Conflicts) 标签页

当 merge、rebase 或 cherry-pick 产生冲突时自动触发。

- 列出所有冲突文件。
- 展开文件可查看**左右对比面板**：*我方 (Ours)* — 当前分支内容 vs *他方 (Theirs)* — 传入内容。
- 每个冲突块可独立解决：
  - ✅ **保留我方** — 接受当前分支版本。
  - ✅ **保留他方** — 接受传入版本。
  - ✏️ **手动编辑** — 在文本框中填写自定义内容。
- **跳转栏**帮助在同一文件的多个冲突块之间导航。
- 解决所有块后，点击**标记为已解决**执行 `git add`。
- **重置冲突状态**按钮可中止当前的 merge / rebase / cherry-pick，回到最后一次干净的提交状态。

#### 5 · Stash 标签页

- 列出所有 stash 条目，包含索引、说明和 **diff 预览**。
- **Pop** — 将 stash 应用回工作区并从堆栈中移除。
- **Drop** — 永久删除一条 stash 记录。
- 支持分页，适合 stash 条目较多的仓库。

#### 6 · 远端操作（顶部工具栏）

顶部始终可见的三个按钮：

| 按钮 | 底层命令 | 说明 |
|------|---------|------|
| ⬇ **Fetch** | `git fetch --all --prune` | 下载远端引用，不进行合并 |
| 🔄 **Pull** | `git pull`（merge / rebase / ff-only） | 将远端提交同步到本地分支 |
| 🚀 **Push** | `git push --verbose --progress` | 将本地提交推送到远端，实时流式日志 |

- Pull 支持三种策略：**merge（合并）**、**rebase（变基）**、**fast-forward only（仅快进）**。
- Push **逐行流式输出**，可实时查看推送进度。
- 如果远端分支不存在，界面会提供一键**推送到远端**按钮，自动设置 upstream。
- 如果 Push 时认证失败，UI 会弹出提示框输入**用户名 / 密码**并自动重试。

#### 7 · 语言支持

点击右上角的 **EN / 中文** 选择器，可随时切换整个 UI 的语言。偏好设置保存在 `localStorage` 中，刷新页面后依然生效。

#### 8 · 消息日志

所有操作结果（提交、拉取、推送、重置等）都会在会话内存中保存。点击顶部的**查看日志**链接，可浏览本次会话中所有操作的完整历史记录，支持一键清空。

---

### ⌨️ 操作技巧

- 在提交信息输入框中按 **Enter** 可直接触发提交。
- 页面顶部中央的全局加载动画表示有 API 请求正在进行。
- 右上角的 Toast 通知会确认每个操作的成功或失败。
- 所有 diff 块支持横向滚动，方便查看长行代码。

---

### 🔒 安全说明

- 服务器**仅绑定 `127.0.0.1`**，不会暴露到局域网。
- Push 时输入的 Git 凭据通过临时 shell 脚本传递，使用完毕后立即删除。
- 已禁用 Git 交互式提示（`GIT_TERMINAL_PROMPT=0`），防止子进程挂起。

---

### 🗂️ 项目结构

```
GitAutoManageBoard/
└── git_commit_tool.py   # 单文件应用：HTTP 服务器 + Git API + 内嵌 HTML/CSS/JS
```

整个应用——后端逻辑、HTML、CSS 和 JavaScript——都集中在一个文件中，便于携带和部署。

---

### 📋 环境要求

- Python ≥ 3.6（仅使用标准库：`http.server`、`subprocess`、`json`、`socket`、`threading`）
- Git ≥ 2.x

**无需安装任何第三方依赖包。**

---

### 📄 开源协议

[MIT](LICENSE)
