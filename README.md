<div align="center">

# 🛠️ GitAutoManageBoard

**A lightweight, browser-based Git management dashboard — no installation required.**

一个轻量级、基于浏览器的 Git 可视化管理面板，无需安装，开箱即用。

[![Python](https://img.shields.io/badge/Python-3.6%2B-blue?logo=python)](https://python.org)
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
| **Commit** | Stage / unstage files, view inline diffs, write commit messages, commit with one click. Manage `.gitignore` entries. |
| **Branches** | View local & remote branches, create branches, switch branches, fuzzy search, pagination. Sort by name or date. |
| **Compare** | Side-by-side branch comparison — visual diff, file-by-file navigation, swap branches, one-click merge. |
| **Merge** | Squash-merge any branch into the current branch with a custom commit message and conflict warnings. |
| **Commit Log** | Browse full history. Search by hash / author / message / code-in-diffs. Soft/Hard reset, revert, squash commits. Restore individual files to any historical version. |
| **Conflicts** | Side-by-side visual conflict resolution — pick ours, theirs, manual edit, or raw file edit. Jump between conflict blocks. Auto-complete merge after resolution. |
| **Stash** | List, inspect, pop, or drop stash entries. Pagination support. |
| **Remote** | Fetch, Pull (merge / rebase / fast-forward), Push — all with live streaming output. Force push with `--force-with-lease`. Auto SSH/HTTPS switching. |

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
- Type your commit message and click **Confirm Commit**.
- After a successful commit, a modal offers to **push to remote** immediately.
- ⚠️ **Protected Branch Warning** — committing directly to `main`, `master`, `develop`, or `release` triggers a confirmation dialog to prevent accidental commits to shared branches.

**Gitignore Management:**
- Click the **📋 Gitignore** button at the bottom toolbar to view and manage entries in `.gitignore`.
- Each file card has an **Ignore** button to quickly add a file pattern to `.gitignore`.
- In the Gitignore modal, click **+ Re-add** on any entry to remove it from `.gitignore` and resume tracking.

**Pull before commit workflow:** If there are uncommitted changes when pulling, the UI offers three options:
- **📦 Stash & Pull** — stash changes, pull, then manually restore from Stash tab.
- **⬇️ Pull Anyway** — pull without touching local changes (may cause conflicts).
- **Cancel** — do nothing.

#### 2 · Branches Tab

Manage all local and remote branches in one place.

- **Local branches** listed first, sorted by most recent commit date. Current branch highlighted in blue gradient.
- **Remote branches** paginated (10 / 20 / 50 / 100 / 200 / 300 per page, or load all).
- **Column sort** — click **Name** or **Last Commit** header to sort ascending/descending.
- **Create Branch** — type a name and optionally base it on another branch. After creation, a modal offers to **push to remote** immediately.
- **Switch Branch** — click any branch name. If uncommitted changes exist, a modal prompts to **stash** them first, then switch. After switching with stash, you can choose to **apply stash** to the new branch or keep it for later.
- **Fuzzy Search** — type to filter branches by name. Quick-filter tags for `develop`, `release`, `feature`, and `hotfix` prefixes.
- Per-branch action buttons on each non-current branch:
  - ⚖️ **Compare** — opens the Compare page with this branch as Branch A.
  - ⚡ **Merge** — squash-merge this branch into the current branch.
  - ✅ **Checkout** — switch to this branch.

#### 3 · Compare Page

Side-by-side comparison of any two branches — local or remote.

- Select **Branch A** and **Branch B** from dropdowns, each toggleable between **Remote** and **Local** sources.
- **⇄ Swap** button exchanges Branch A and Branch B instantly.
- **Summary bar** shows file count, total additions/deletions, and unique commit count for Branch A.
- **Left sidebar** — clickable file list with +/- stats. Click any file to scroll to its diff.
- **Right panel** — per-file diffs with collapsible sections, colored additions/removals.
- **Raw command & cwd** displayed at the bottom for transparency (`$ git diff head...base`).
- If branches are identical, a clear "no unique changes" message is shown.
- **⚡ Merge** button — merges Branch A into Branch B. If needed, auto-checks-out Branch B first.

#### 4 · Merge (from any branch)

Accessible from the **Branches** or **Compare** page via the ⚡ Merge button.

- Opens a detailed warning modal explaining:
  - Which branch is merging into which.
  - All commits from the source branch will be **squashed into one commit**.
  - Conflicts will need to be resolved in the Conflicts tab.
  - Ensure local changes are committed or stashed.
- Enter a **custom commit message** (required).
- Click **Merge Now** — the tool performs a squash-merge (`git merge --squash`) and commits.
- On success, offers to **push** to remote immediately.
- If conflicts occur, redirects to the Conflicts tab for resolution.

#### 5 · Commit Log Tab

Explore the full commit history of the current branch.

- **Search bar** filters commits by hash, author name, or commit message simultaneously.
- **Code diff search** — search for a regex pattern inside actual diff content (uses `git log -G`). Matching commits are highlighted.
- **Pagination** — 1 / 5 / 10 / 20 / 50 / 100 / 300 per page, or load all.
- **Sort order** — toggle ascending / descending by timestamp (click the Date column header).
- **Root commit** indicators — initial commits are flagged so you know which ones cannot be squashed.

**Per-commit actions:**
  - Click a commit row to **expand/collapse** its full file diff.
  - Click the hash to toggle between short (7-char) and full 40-char SHA.
  - 🔁 **Revert** — create a new commit that undoes the selected commit (history preserved).
  - ↩️ **Soft Reset** — move HEAD back to that commit, keep changes staged.
  - 💥 **Hard Reset** — move HEAD back and discard all subsequent changes.
  - 📂 **Restore file** — opens the Restore File page for any file changed in that commit.

**Squash (merge commits):**
  - Check 2+ commit checkboxes to enable the **Squash** bar.
  - Enter a new commit message and click **Squash** to merge them into one (`git reset --soft` + new commit).
  - Root commits cannot be squashed (they have no parent to reset to).
  - ⚠️ Protected branch warning applies when squashing on shared branches.
  - After a successful squash on a protected branch, a **Force Push** option is offered.

**Reset Conflict State:**
  - Click **Reset Conflict State** to abort any ongoing merge / rebase / cherry-pick and return to the last clean commit.

#### 6 · Restore File Page

Accessible from the Commit Log — restore any file to a specific historical version.

- Displays the target file path and commit version.
- Browse the file's **commit history** (paginated), with per-commit diffs showing only that file's changes.
- Click **Restore to this** on any commit to overwrite the current working copy with that version.
- A confirmation modal warns before proceeding.

#### 7 · Conflicts Tab

Triggered automatically when a merge, rebase, or cherry-pick produces conflicts.  
The **Conflicts** tab badge shows the current conflict count in red.

- Lists every conflicted file.
- **Auto-expand** the first file on load.
- Expand a file to see **conflict zone rendering**:
  - **Ours** (current branch, green panel) vs **Theirs** (incoming, blue panel).
  - **Normal context blocks** (non-conflict code) shown as collapsible sections.
- Each conflict block can be resolved independently:
  - ✅ **Use Ours** — accept the current branch version.
  - 🔵 **Use Theirs** — accept the incoming version.
  - ✏️ **Edit manually** — write a custom resolution in a textarea. Click **Save this block** to apply.
- A **jump bar** (◀ Prev / Next ▶) navigates between multiple conflict blocks in the same file.
- **💾 Save & Resolve File** — writes all resolved blocks back to the file and runs `git add`.
- **📝 Edit raw file** — open the entire file in a raw text editor for manual resolution.
- **Auto-complete merge** — when the last conflict file is resolved, the tool automatically runs `git commit --no-edit` (or `git rebase --continue` / `git cherry-pick --continue`) to complete the merge. No manual CLI step needed.

#### 8 · Stash Tab

- Lists all stash entries with index, message, and a **diff preview**.
- **Pop** — apply the stash back and remove it from the stack.
- **Drop** — permanently delete a stash entry (with confirmation modal).
- Pagination for repositories with many stash entries (1 / 5 / 10 / 20 / 50 / 100 / 300 per page, or all).

#### 9 · Remote Operations (Top Bar)

Three buttons always visible at the top:

| Button | Command | Description |
|--------|---------|-------------|
| ⬇ **Fetch** | `git fetch --all --prune --verbose` | Download remote refs without merging |
| 🔄 **Pull** | `git pull --rebase --verbose` (default) | Sync remote commits to local branch |
| 🚀 **Push** | `git push --verbose --progress` | Send local commits to remote with live streaming log |

**Pull features:**
- Supports three strategies: **merge**, **rebase**, and **fast-forward only**.
- Auto-detects stale upstream and offers a one-click fix.
- If remote branch doesn't exist, prompts to push first.
- Handles divergent branches with inline strategy selector (merge / rebase / ff-only).
- When local file changes block the pull, offers **Stash & Retry** or manual fix.
- After a successful pull that follows a stash, reminds you to restore from the Stash tab.

**Push features:**
- **Live streaming output** — watch progress line-by-line in a terminal-styled modal.
- **Auto-retry on no-upstream** — if the branch has no upstream tracking, retries with `git push origin HEAD:<branch>`.
- **Authentication handling:**
  - If HTTPS push fails with authentication error, three options appear:
    - **Switch to SSH & Retry** — auto-converts `origin` remote URL from HTTPS to SSH and retries.
    - **Enter Credentials** — opens a modal for username + password/token input.
    - **Close** — cancels the push.
- **Force Push** (`--force-with-lease`):
  - When push is rejected (non-fast-forward), the UI offers:
    - **Force Push** — with a detailed warning about overwriting remote history.
    - **Pull & Retry Push** — pull first, then retry push.
  - Also accessible manually via the top-right menu or after a squash on a protected branch.

#### 10 · Language Support

Click the **EN / 中文** selector in the top-right corner to switch the entire UI between English and Chinese instantly. The preference is saved in `localStorage`.

#### 11 · Message Log

All operation results (commits, pulls, pushes, resets, merges, …) are stored in an in-session memory log.
- Messages appear in the **message area** below the top bar and can be dismissed individually.
- Click **View Log** to browse the full history of operations with timestamps and type badges (success / error / info).
- **Clear All Messages** removes the entire log.

---

### ⌨️ Keyboard & UX Tips

- Press **Enter** in the commit message field to trigger commit.
- The global spinner in the top-center indicates any in-progress API call.
- Toast notifications (top-right) confirm success or failure for every action.
- All diff blocks support horizontal scrolling for long lines.
- The last active tab is **persisted** in `localStorage` and restored on page reload.
- Hover over **Fetch / Pull / Push** buttons for descriptions.

---

### 🔒 Security Notes

- The server **binds to `127.0.0.1` only** — it is never exposed to your network.
- Git credentials entered in the push dialog are passed via a temporary shell script and deleted immediately after use.
- Interactive Git prompts are disabled (`GIT_TERMINAL_PROMPT=0`) to prevent subprocesses from hanging.

---

### 🗂️ Project Structure

```
GitAutoManageBoard/
├── git_commit_tool.py   # Single-file app: HTTP server + Git API + embedded HTML/CSS/JS
└── README.md
```

The entire application — backend logic, HTML, CSS, and JavaScript — lives in one file for maximum portability.

---

### 📋 Requirements

- Python ≥ 3.6 (standard library only — `http.server`, `subprocess`, `json`, `socket`, `threading`, `os`)
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
| **提交 (Commit)** | 暂存/取消暂存文件、查看内联 diff、填写提交信息、一键提交。管理 `.gitignore` 条目。 |
| **分支 (Branches)** | 查看本地和远端分支、创建分支、切换分支、模糊搜索、分页。按名称或日期排序。 |
| **对比 (Compare)** | 左右对比任意两个分支 — 可视化 diff、逐文件导航、交换分支、一键合并。 |
| **合并 (Merge)** | 将任意分支 Squash-merge 到当前分支，支持自定义提交信息和冲突警告。 |
| **提交日志 (Commit Log)** | 浏览完整历史。按 hash / 作者 / 消息 / 代码内容搜索。Soft/Hard Reset、Revert、Squash 合并提交。将单个文件还原到任意历史版本。 |
| **冲突 (Conflicts)** | 左右对比可视化冲突解决 — 选择我方、他方、手动编辑或原始文件编辑。冲突块之间跳转导航。解决完毕后自动完成 merge。 |
| **暂存 (Stash)** | 列出、查看、Pop 或删除 stash 条目。支持分页。 |
| **远端 (Remote)** | Fetch、Pull（merge / rebase / fast-forward）、Push — 全部支持实时流式输出。Force Push (`--force-with-lease`)。自动 SSH/HTTPS 切换。 |

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
- 填写提交信息，点击**确认 Commit** 即可提交。
- 提交成功后弹出模态框，可选择**立即推送到远端**。
- ⚠️ **重要分支警告** — 在 `main`、`master`、`develop` 或 `release` 分支上直接提交会弹出确认对话框，防止误向共享分支提交。

**Gitignore 管理：**
- 点击底部工具栏的 **📋 Gitignore** 按钮查看和管理 `.gitignore` 中的条目。
- 每个文件卡片都有 **Ignore** 按钮，可快速将文件添加到 `.gitignore`。
- 在 Gitignore 模态框中，点击任意条目的 **+ Re-add** 按钮将其从 `.gitignore` 中移除，恢复追踪。

**拉取前的工作区处理：** Pull 时如检测到未提交的本地改动，提供三种选择：
- **📦 Stash & Pull** — 暂存改动 → 拉取 → 手动从 Stash 页恢复。
- **⬇️ Pull Anyway** — 直接拉取，不改动本地文件（可能冲突）。
- **Cancel** — 取消操作。

#### 2 · 分支 (Branches) 标签页

在一个页面管理所有本地和远端分支。

- **本地分支**优先展示，按最近提交时间排序，当前分支以蓝紫渐变高亮。
- **远端分支**支持分页（每页 10 / 20 / 50 / 100 / 200 / 300 条，或加载全部）。
- **列排序** — 点击 **Name** 或 **Last Commit** 表头可按名称或日期升序/降序排列。
- **新建分支** — 输入名称，可选择基于当前分支创建。创建后弹出模态框可选择**立即推送到远端**。
- **切换分支** — 点击任意非当前分支的 **✅ Checkout** 按钮。如有未提交改动，会提示**先 stash 再切换**。切换后可选择将 stash **应用到新分支**或保留备用。
- **模糊搜索** — 实时输入过滤分支名称。内置 `develop`、`release`、`feature`、`hotfix` 前缀快捷筛选标签。
- 每个非当前分支的操作按钮：
  - ⚖️ **Compare** — 打开对比页面，该分支作为 Branch A。
  - ⚡ **Merge** — 将该分支 Squash-merge 到当前分支。
  - ✅ **Checkout** — 切换到该分支。

#### 3 · 对比 (Compare) 页面

任意两个分支的左右对比 — 支持本地和远端分支。

- 从下拉菜单选择 **Branch A** 和 **Branch B**，各自可切换 **Remote（远端）** / **Local（本地）** 来源。
- **⇄ Swap** 按钮一键交换 Branch A 和 Branch B。
- **摘要栏**显示文件数量、总增删行数、Branch A 独有的 commit 数量。
- **左侧边栏** — 可点击的文件列表，显示 +/- 统计。点击任意文件滚动到对应 diff。
- **右侧面板** — 逐文件 diff，可折叠区块，彩色增删标记。
- 底部显示**原始命令和工作目录**（`$ git diff head...base`），便于调试。
- 分支完全相同时显示"无独有变更"提示。
- **⚡ Merge** 按钮 — 将 Branch A 合并到 Branch B（如需要会自动先 Checkout B）。

#### 4 · 合并 (Merge) 任意分支

从**分支**页面或**对比**页面的 ⚡ Merge 按钮触发。

- 打开详细警告模态框，说明：
  - 源分支和目标分支。
  - 源分支的所有 commit 将**合并为一个 commit**（Squash）。
  - 如有冲突需要在 Conflicts 页面解决。
  - 确保本地改动已提交或暂存。
- 填写**自定义提交信息**（必填）。
- 点击 **Merge Now** — 执行 squash-merge（`git merge --squash`）并提交。
- 成功后弹出选项**立即推送到远端**。
- 如发生冲突，自动导向 Conflicts 页面。

#### 5 · 提交日志 (Commit Log) 标签页

浏览当前分支的完整提交历史。

- **搜索框**同时支持按 hash、作者名、提交消息过滤。
- **代码 diff 搜索** — 在实际 diff 内容中搜索正则表达式（使用 `git log -G`），匹配的提交高亮显示。
- **分页** — 每页 1 / 5 / 10 / 20 / 50 / 100 / 300 条，或加载全部。
- **排序** — 点击 Date 列标题切换时间戳升序 / 降序。
- **根提交**标识 — 初始 commit 会被标记，提示无法被 Squash。

**每条提交的操作：**
  - 点击提交行可**展开/折叠**该提交的完整文件 diff。
  - 点击 hash 可在短格式（7位）和完整 40 位 SHA 之间切换。
  - 🔁 **Revert** — 创建一个新 commit 撤销该提交（保留历史）。
  - ↩️ **Soft Reset** — 将 HEAD 移回该 commit，改动保留在暂存区。
  - 💥 **Hard Reset** — 将 HEAD 移回并丢弃之后的所有改动。
  - 📂 **还原文件** — 对该提交中变更的任意文件打开还原页面。

**Squash（合并提交）：**
  - 勾选 2 个或以上 commit 的复选框启用 **Squash** 工具栏。
  - 输入新提交信息，点击 **Squash** 合并为一个提交（`git reset --soft` + 新提交）。
  - 根提交不可 Squash（没有父节点可 reset）。
  - ⚠️ 在重要分支上 Squash 会触发保护警告。
  - 在重要分支上 Squash 成功后，提供 **Force Push** 选项。

**重置冲突状态：**
  - 点击 **Reset Conflict State** 中止当前 merge / rebase / cherry-pick，回到最后干净状态。

#### 6 · 还原文件 (Restore File) 页面

从提交日志进入 — 将任意文件还原到指定的历史版本。

- 显示目标文件路径和 commit 版本。
- 浏览该文件的**提交历史**（分页），每次提交的 diff 仅显示该文件的变更。
- 点击任意 commit 的 **Restore to this** 按钮，将当前工作区文件覆盖为该版本。
- 执行前弹出确认模态框。

#### 7 · 冲突 (Conflicts) 标签页

当 merge、rebase 或 cherry-pick 产生冲突时自动触发。  
**Conflicts** 标签页徽章以红色显示当前冲突数量。

- 列出所有冲突文件。
- 页面加载时**自动展开**第一个文件。
- 展开文件可查看**冲突区域渲染**：
  - **我方 (Ours)**（绿色面板，当前分支）vs **他方 (Theirs)**（蓝色面板，传入版本）。
  - **正常上下文块**（非冲突代码）以可折叠区域显示。
- 每个冲突块可独立解决：
  - ✅ **Use Ours** — 接受当前分支版本。
  - 🔵 **Use Theirs** — 接受传入版本。
  - ✏️ **Edit manually** — 在文本框中填写自定义内容。点击 **Save this block** 生效。
- **跳转栏**（◀ Prev / Next ▶）在同一文件的多个冲突块之间导航。
- **💾 Save & Resolve File** — 将所有已解决块写回文件并执行 `git add`。
- **📝 Edit raw file** — 在原始文本编辑器中打开整个文件，手动编辑解决。
- **自动完成 merge** — 当最后一个冲突文件被解决后，工具自动执行 `git commit --no-edit`（或 `git rebase --continue` / `git cherry-pick --continue`）完成合并。无需手动命令行操作。

#### 8 · Stash 标签页

- 列出所有 stash 条目，包含索引、说明和 **diff 预览**。
- **Pop** — 将 stash 应用回工作区并从堆栈中移除。
- **Drop** — 永久删除一条 stash 记录（含确认模态框）。
- 支持分页（每页 1 / 5 / 10 / 20 / 50 / 100 / 300 条，或全部）。

#### 9 · 远端操作（顶部工具栏）

顶部始终可见的三个按钮：

| 按钮 | 命令 | 说明 |
|------|------|------|
| ⬇ **Fetch** | `git fetch --all --prune --verbose` | 下载远端引用，不进行合并 |
| 🔄 **Pull** | `git pull --rebase --verbose`（默认） | 将远端提交同步到本地分支 |
| 🚀 **Push** | `git push --verbose --progress` | 将本地提交推送到远端，实时流式日志 |

**Pull 功能：**
- 支持三种策略：**merge（合并）**、**rebase（变基）**、**fast-forward only（仅快进）**。
- 自动检测过期的 upstream 配置，提供一键修复。
- 远端分支不存在时，提示先推送。
- 分支分叉时提供内联策略选择器（merge / rebase / ff-only）。
- 本地文件改动阻止拉取时，提供 **Stash & Retry** 或手动修复选项。
- Stash 后再 Pull 成功后，提醒从 Stash 页恢复改动。

**Push 功能：**
- **实时流式输出** — 在终端风格模态框中逐行查看推送进度。
- **自动重试** — 分支无 upstream 时自动重试 `git push origin HEAD:<branch>`。
- **认证处理：**
  - HTTPS 推送认证失败时提供三种选择：
    - **Switch to SSH & Retry** — 自动将 `origin` 远端 URL 从 HTTPS 转换为 SSH 并重试。
    - **Enter Credentials** — 弹出模态框输入用户名 + 密码/token。
    - **Close** — 关闭取消。
- **Force Push**（`--force-with-lease`）：
  - 推送被拒绝（non-fast-forward）时，提供：
    - **Force Push** — 带有详细警告（会覆盖远端历史）。
    - **Pull & Retry Push** — 先拉取再重试推送。
  - 也可在重要分支上 Squash 后手动触发。

#### 10 · 语言支持

点击右上角的 **EN / 中文** 选择器，可随时切换整个 UI 的语言。偏好设置保存在 `localStorage` 中，刷新页面后依然生效。

#### 11 · 消息日志

所有操作结果（提交、拉取、推送、重置、合并等）都会在会话内存中保存。
- 消息显示在顶部工具栏下方的**消息区域**，可逐条关闭。
- 点击 **View Log（查看日志）** 可浏览本次会话中所有操作的完整历史，带时间戳和类型徽章（成功 / 错误 / 信息）。
- **Clear All Messages（清空日志）**一键清除全部记录。

---

### ⌨️ 操作技巧

- 在提交信息输入框中按 **Enter** 可直接触发提交。
- 页面顶部中央的全局加载动画表示有 API 请求正在进行。
- 右上角的 Toast 通知会确认每个操作的成功或失败。
- 所有 diff 块支持横向滚动，方便查看长行代码。
- 上次激活的标签页会被**记忆**在 `localStorage` 中，页面刷新后自动恢复。
- 鼠标悬停在 **Fetch / Pull / Push** 按钮上可查看功能描述。

---

### 🔒 安全说明

- 服务器**仅绑定 `127.0.0.1`**，不会暴露到局域网。
- Push 时输入的 Git 凭据通过临时 shell 脚本传递，使用完毕后立即删除。
- 已禁用 Git 交互式提示（`GIT_TERMINAL_PROMPT=0`），防止子进程挂起。

---

### 🗂️ 项目结构

```
GitAutoManageBoard/
├── git_commit_tool.py   # 单文件应用：HTTP 服务器 + Git API + 内嵌 HTML/CSS/JS
└── README.md
```

整个应用——后端逻辑、HTML、CSS 和 JavaScript——都集中在一个文件中，便于携带和部署。

---

### 📋 环境要求

- Python ≥ 3.6（仅使用标准库：`http.server`、`subprocess`、`json`、`socket`、`threading`、`os`）
- Git ≥ 2.x

**无需安装任何第三方依赖包。**

---

### 📄 开源协议

[MIT](LICENSE)
