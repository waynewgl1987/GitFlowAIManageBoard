// ═══════════ i18n ═══════════
var L = (localStorage.getItem('git_tool_lang') || 'en');
var T = {
  app_tab_title: {en:'Git Manage AI Board', zh:'Git 管理 AI 看板'},
  select_all: {en:'Select / Deselect All', zh:'全选 / 取消全选'},
  confirm_commit: {en:'Confirm Commit', zh:'确认 Commit'},
  deselect_all: {en:'Deselect All', zh:'全部取消'},
  refresh: {en:'Refresh', zh:'刷新'},
  back: {en:'Back', zh:'返回'},
  branches_title: {en:'Branches', zh:'分支列表'},
  stash_title: {en:'Stash List', zh:'Stash 列表'},
  conflicts_title: {en:'Conflict Resolution', zh:'冲突解决'},
  log_title: {en:'Commits History', zh:'提交历史'},
  prs_title: {en:'Pull Requests', zh:'拉取请求'},
  msglog_title: {en:'Message Log', zh:'消息日志'},
  abort_conflict: {en:'Reset Conflict State', zh:'重置冲突状态'},
  msg_count: {en:'Messages: {n}', zh:'消息: {n} 条'},
  view_log: {en:'View Log', zh:'查看日志'},
  clear_msglog: {en:'Clear All Messages', zh:'清空日志'},
  no_files: {en:'No files to commit!', zh:'没有需要提交的文件！'},
  files_pending: {en:'{n} file(s) pending', zh:'共 {n} 个文件待提交'},
  lines: {en:'lines', zh:'行'},
  git_added: {en:'git add done', zh:'已 git add'},
  git_reset: {en:'git reset done', zh:'已 git reset'},
  op_failed: {en:'Operation failed', zh:'操作失败'},
  commit_msg_empty: {en:'Commit message cannot be empty!', zh:'提交信息不能为空！'},
  select_at_least_one: {en:'Please select at least one file!', zh:'请至少勾选一个文件！'},
  stash_select_files: {en:'Please select at least one file to stash.', zh:'请先勾选至少一个文件才能 Stash。'},
  commit_ok: {en:'Commit successful!', zh:'提交成功！'},
  commit_fail: {en:'Commit failed', zh:'提交失败'},
  loading_failed: {en:'Failed to load: ', zh:'加载失败: '},
  network_err: {en:'Network error: ', zh:'网络请求失败: '},
  pulling: {en:'Pulling latest...', zh:'正在拉取最新代码...'},
  pull_ok: {en:'Pull successful: ', zh:'拉取成功: '},
  pull_conflict: {en:'Conflict detected! Go to Conflicts page.', zh:'拉取出现冲突，请到 Conflicts 页面解决'},
  pull_fail: {en:'Pull failed: ', zh:'拉取失败: '},
  switch_to_branch: {en:'Switched to branch: ', zh:'已切换到分支: '},
  switch_fail: {en:'Checkout failed: ', zh:'切换失败: '},
  stash_switched: {en:'Stash & Switch', zh:'Stash 并切换'},
  stash_prompt: {en:'You have uncommitted changes. Stash before switching to ', zh:'当前有未提交的改动。是否 stash 再切换到 '},
  no_stash: {en:'No stashed changes', zh:'暂无 stash'},
  no_conflict: {en:'No conflicts!', zh:'没有冲突！'},
  no_match: {en:'No matching commits', zh:'无匹配的 commit'},
  msg_expand: {en:'Expand', zh:'展开'},
  msg_collapse: {en:'Collapse', zh:'收起'},
  release_in: {en:'Release:', zh:'发布分支:'},
  release_more: {en:'+{n} more', zh:'另 {n} 个'},
  branch_no_upstream: {en:'Branch has no upstream. Click fix button to configure.', zh:'分支未设置 upstream，点击修复按钮自动配置'},
  fix_upstream: {en:'Fix: set upstream', zh:'修复: 设置 upstream'},
  branch_no_remote: {en:'Remote branch not found. Push to origin?', zh:'远端没有该分支，点击推送到远端'},
  push_to_origin: {en:'Push to origin', zh:'推送到远端'},
  fetch_ok: {en:'Fetch successful', zh:'Fetch 成功'},
  fetch_fail: {en:'Fetch failed: ', zh:'Fetch 失败: '},
  msg_cleared: {en:'Message log cleared', zh:'消息日志已清空'},
  confirm_clear_msg: {en:'Clear all message logs?', zh:'确定清空所有消息日志？'},
  reset_soft: {en:'Soft Reset', zh:'软重置'},
  reset_hard: {en:'Hard Reset', zh:'硬重置'},
  reset_desc: {en:'<b>Soft Reset</b>: Keeps working tree changes, moves commits back to staging.<br><b>Hard Reset</b>: Discards ALL changes back to that commit.', zh:'<b>Soft Reset</b>: 保留工作区改动，commit 回到暂存区。<br><b>Hard Reset</b>: 丢弃所有改动，直接回到该commit状态。'},
  reset_hard_push_title: {en:'⚠️ Hard Reset Completed', zh:'⚠️ Hard Reset 已完成'},
  reset_hard_push_desc: {en:'<b>Hard Reset rewrote local history.</b><br>If this branch was already pushed, your next push should use <b>Force Push</b>.<br><br>Push to remote now?', zh:'<b>Hard Reset 已改写本地历史。</b><br>如果此分支之前已推送到远端，下一步应使用 <b>Force Push</b>。<br><br>现在推送到远端吗？'},
  reset_hard_force_btn: {en:'Force Push to Remote', zh:'Force Push 到远端'},
  revert_title: {en:'Revert', zh:'撤销'},
  revert_desc: {en:'Creates a new commit that undoes this commit. History is preserved.', zh:'创建一个新commit撤销该commit，不丢失历史。'},
  drop_title: {en:'Drop Commit', zh:'删除 Commit'},
  drop_desc: {en:'Permanently removes this commit from history. Requires force push if already pushed to remote.', zh:'永久从历史中删除该commit，不产生新commit。若已推送远端需要 force push。'},
  revert_or_drop_desc: {en:'<b>Revert</b>: Creates a new commit that undoes this commit. History is preserved. Safe for shared branches.<br><br><b>Drop</b>: Permanently removes this commit from history. No trace left. Requires force push if already pushed.', zh:'<b>Revert</b>: 创建新commit来撤销该commit，历史保留，适合共享分支。<br><br><b>Drop</b>: 永久从历史中删除该commit，不留痕迹。若已推送需要 force push。'},
  squash_confirm: {en:'Squash {n} commits into one?', zh:'将 {n} 个commit合并为1个？'},
  squash_ok: {en:'Squash successful!', zh:'Squash 成功！'},
  squash_fail: {en:'Squash failed: ', zh:'Squash 失败: '},
  reset_ok: {en:'Reset ({mode}) successful', zh:'Reset ({mode}) 成功'},
  reset_fail: {en:'Reset failed: ', zh:'Reset 失败: '},
  revert_ok: {en:'Revert successful', zh:'Revert 成功'},
  revert_fail: {en:'Revert failed: ', zh:'Revert 失败: '},
  drop_ok: {en:'Commit dropped successfully', zh:'Commit 已删除'},
  drop_fail: {en:'Drop failed: ', zh:'Drop 失败: '},
  conflict_reset_title: {en:'Reset Conflict State', zh:'重置冲突状态'},
  conflict_reset_desc: {en:'Abort current merge/rebase/cherry-pick, revert to latest commit. Working changes are kept.', zh:'中止当前 merge/rebase/cherry-pick，还原到最新commit。工作区改动保留。'},
  conflict_reset_ok: {en:'Conflict state reset', zh:'冲突状态已重置'},
  all_selected: {en:'All selected & git add done', zh:'已全选并 git add'},
  all_deselected: {en:'All deselected', zh:'已全部取消'},
  partial_fail: {en:'Partial operation failed', zh:'部分操作失败'},
  upstream_set_ok: {en:'Upstream set, retrying pull...', zh:'Upstream 已设置，重试 pull...'},
  upstream_set_fail: {en:'Upstream set failed: ', zh:'设置失败: '},
  push_ok: {en:'Push successful, retrying pull...', zh:'Push 成功，重试 pull...'},
  push_fail: {en:'Push failed: ', zh:'Push 失败: '},
  current_branch_label: {en:'Current Branch:', zh:'当前分支: '},
  op_failed_err: {en:"Failed: ", zh:"操作失败: "},
  ignored_file: {en:'Ignored: ', zh:'已忽略: '},
  ignore_failed: {en:'Ignore failed: ', zh:'忽略失败: '},
  push_to: {en:'Pushing to origin/', zh:'正在推送到 origin/'},
  push_failed: {en:'Push failed: ', zh:'推送失败: '},
  fetching: {en:'Fetching...', zh:'正在拉取...'},
  pull_merge_ok: {en:'Pull (merge) OK', zh:'Pull (合并) 成功'},
  pull_rebase_ok: {en:'Pull (rebase) OK', zh:'Pull (变基) 成功'},
  pull_ff_ok: {en:'Pull (ff-only) OK', zh:'Pull (快进) 成功'},
  stash_pop_ok: {en:'Stash pop OK', zh:'Stash pop 成功'},
  stash_pop_fail: {en:'Stash pop failed: ', zh:'Stash pop 失败: '},
  stash_deleted: {en:'Stash deleted', zh:'Stash 已删除'},
  delete_failed: {en:'Delete failed: ', zh:'删除失败: '},
  file_restored: {en:'File restored: ', zh:'文件已还原: '},
  restore_failed: {en:'Restore failed: ', zh:'还原失败: '},
  select_2_commits: {en:'Select 2+ commits', zh:'请选择至少2个commit'},
  enter_squash_msg: {en:'Enter squash message', zh:'请输入合并后的message'},
  no_conflict_abort: {en:'No conflict or abort failed: ', zh:'无冲突或中止失败: '},
  conflict_resolved: {en:'Conflict resolved with ', zh:'冲突已解决: '},
  conflict_resolved_ok: {en:'Conflict resolved', zh:'冲突已解决'},
  merge_all_resolved_title: {en:'All Conflicts Resolved!', zh:'所有冲突已解决！'},
  merge_all_resolved_desc: {en:'All conflict files have been resolved. Do you want to commit this merge now?', zh:'所有冲突文件已解决。是否立即提交本次合并？'},
  commit_msg_label: {en:'Commit Message', zh:'提交消息'},
  commit_now_btn: {en:'Commit Now', zh:'立即提交'},
  enter_commit_msg_err: {en:'Please enter a commit message', zh:'请输入提交消息'},
  merge_commit_ok: {en:'Merge committed successfully', zh:'合并已成功提交'},
  merge_commit_fail: {en:'Commit failed: ', zh:'提交失败: '},
  push_after_merge_title: {en:'Push to Remote?', zh:'是否推送到远端？'},
  push_after_merge_desc: {en:'Merge committed! Push <b>{branch}</b> to remote now?', zh:'合并已提交！是否立即将 <b>{branch}</b> 推送到远端？'},
  push_now_btn: {en:'Push Now', zh:'立即推送'},
  push_later_btn: {en:'Cancel (Push Manually)', zh:'取消（手动推送）'},
  rebase_now_btn: {en:'Rebase Now', zh:'立即 Rebase'},
  rebase_progress: {en:'🔀 Rebasing onto ', zh:'🔀 正在 Rebase 到 '},
  rebase_ok: {en:'✅ Rebase succeeded — history is now linear', zh:'✅ Rebase 成功 — 历史已线性化'},
  rebase_ok_title: {en:'✅ Rebase Succeeded', zh:'✅ Rebase 成功'},
  rebase_up_to_date: {en:'ℹ️ Already up to date — nothing to rebase', zh:'ℹ️ 已是最新 — 无需 Rebase'},
  rebase_conflict_title: {en:'⚠️ Rebase Conflicts!', zh:'⚠️ Rebase 冲突！'},
  rebase_fail_title: {en:'❌ Rebase Failed', zh:'❌ Rebase 失败'},
  rebase_push_desc: {en:'Rebase rewrites history. Force push <b>{branch}</b> to remote now?', zh:'Rebase 改写了历史，是否立即 Force Push <b>{branch}</b> 到远端？'},
  merge_op_title: {en:'Merge / Rebase', zh:'Merge / Rebase'},
  mrh_title: {en:'Merge vs Rebase — What\'s the difference?', zh:'Merge vs Rebase — 有什么区别？'},
  stash_failed: {en:'Stash failed: ', zh:'Stash 失败: '},
  pull_ok_pop: {en:'Pull OK, popping stash...', zh:'Pull 成功，恢复 stash...'},
  stash_conflict: {en:'Stash pop conflict! Resolve in Conflicts tab.', zh:'Stash pop 冲突！请在 Conflicts 页面解决。'},
  pushing: {en:'Pushing...', zh:'正在推送...'},
  push_ok: {en:'Push OK: ', zh:'推送成功: '},
  branch_created: {en:'Branch created: ', zh:'分支已创建: '},
  create_failed: {en:'Create failed: ', zh:'创建失败: '},
  branch_push_title: {en:'🎉 Branch Created!', zh:'🎉 分支已创建！'},
  branch_push_desc: {en:'Branch <b>{name}</b> was created locally.<br><br>Push it to remote now so others can see it?', zh:'分支 <b>{name}</b> 已在本地创建。<br><br>是否立即推送到远端，让团队成员可以看到？'},
  branch_push_btn: {en:'Push to Remote', zh:'推送到远端'},
  branch_push_later: {en:'Later', zh:'稍后推送'},
  enter_branch_name: {en:'Enter a branch name', zh:'请输入分支名'},
  confirm_commit_title: {en:'Confirm Commit', zh:'确认提交'},
  stashing_pulling: {en:'Stashing & pulling...', zh:'正在暂存并拉取...'},
  all_mode_slow: {en:'⚠️ Loading all may be slow', zh:'⚠️ All 模式可能加载缓慢'},
  worktree_create_hint: {en:'Creates a new worktree directory linked to this repo. Use an absolute path like <code>~/projects/my-feature</code> or <code>../my-hotfix</code>.', zh:'创建一个链接到当前仓库的新工作树目录。请使用绝对路径，如 <code>~/projects/my-feature</code> 或 <code>../my-hotfix</code>。'},
  wtp_header: {en:'🌲 Worktrees', zh:'🌲 工作树'},
  wtp_help_tooltip: {en:'What are worktrees?', zh:'什么是工作树？'},
  wtp_help_title: {en:'What are Git Worktrees?', zh:'什么是 Git 工作树？'},
  wtp_help_intro: {en:'Worktrees let you check out <b>multiple branches</b> from the same repo into separate directories — without cloning again. Each worktree has its own working directory but shares the same <code>.git</code> history.', zh:'工作树允许你从同一个仓库中<b>同时检出多个分支</b>到不同的目录 — 无需再次克隆。每个工作树拥有独立的工作目录，但共享同一个 <code>.git</code> 历史。'},
  wtp_help_uses_title: {en:'📌 Common uses:', zh:'📌 常见用途：'},
  wtp_help_use_1: {en:'⚡ <b>Hotfix</b> a bug on <code>main</code> while working on <code>feature/xxx</code>', zh:'⚡ <b>紧急修复</b> <code>main</code> 上的 bug，同时继续开发 <code>feature/xxx</code>'},
  wtp_help_use_2: {en:'🔀 <b>Review PRs</b> by checking out branches side-by-side', zh:'🔀 同时检出多个分支，<b>并行审查 PR</b>'},
  wtp_help_use_3: {en:'🧪 <b>Test</b> changes in an isolated directory without affecting your main workspace', zh:'🧪 在隔离目录中<b>测试</b>变更，不影响主工作区'},
  wtp_help_use_4: {en:'🏗️ <b>Build</b> or run CI tasks in parallel on different branches', zh:'🏗️ 在不同分支上<b>并行构建</b>或运行 CI 任务'},
  wtp_help_note: {en:'⚠️ Note: Each branch can only be in <b>one worktree</b> at a time. The list below shows which branches are occupied.', zh:'⚠️ 注意：每个分支只能存在于<b>一个工作树</b>中。下方列表会显示哪些分支已被占用。'},
  wtp_create_title: {en:'➕ New Worktree', zh:'➕ 新建工作树'},
  wtp_branch_placeholder: {en:'Branch name (e.g. feature/xxx)', zh:'分支名（如 feature/xxx）'},
  wtp_path_placeholder: {en:'Worktree path (e.g. ~/projects/my-feature)', zh:'工作树路径（如 ~/projects/my-feature）'},
  wtp_create_btn: {en:'Create', zh:'创建'},
  wtp_list_label: {en:'📋 Active Worktrees', zh:'📋 当前工作树'},
  wtp_loading: {en:'Loading…', zh:'加载中…'},
  wtp_load_fail: {en:'⚠️ Failed to load', zh:'⚠️ 加载失败'},
  wtp_empty: {en:'No worktrees found. Create one above.', zh:'暂无工作树，请在上方创建。'},
  wtp_detached_head: {en:'(detached HEAD)', zh:'（游离 HEAD）'},
  wtp_bare: {en:'(bare)', zh:'（裸仓库）'},
  wtp_tag_current: {en:'current', zh:'当前'},
  wtp_tag_detached: {en:'detached', zh:'游离'},
  wtp_tag_main: {en:'main', zh:'主'},
  wtp_switch_btn: {en:'🔄 Switch', zh:'🔄 切换'},
  wtp_active_label: {en:'✓ Active', zh:'✓ 当前'},
  wtp_enter_branch: {en:'Please enter a branch name', zh:'请输入分支名'},
  wtp_enter_path: {en:'Please enter a worktree path', zh:'请输入工作树路径'},
  wtp_branch_occupied: {en:'Branch "{branch}" is already checked out in another worktree. Use a different branch.', zh:'分支 "{branch}" 已在其他工作树中检出，请使用其他分支。'},
  wtp_creating: {en:'Creating worktree...', zh:'正在创建工作树...'},
  wtp_created: {en:'Worktree created successfully', zh:'工作树创建成功'},
  wtp_create_failed: {en:'Create failed: ', zh:'创建失败: '},
  wtp_switching: {en:'Switching worktree...', zh:'正在切换工作树...'},
  wtp_switch_failed: {en:'Switch failed: ', zh:'切换失败: '},
  wtp_remove_title: {en:'Remove Worktree?', zh:'删除工作树？'},
  wtp_remove_desc: {en:'This will remove the worktree at:<br><code style="font-size:11px;word-break:break-all">{path}</code><br><br>Files on disk will remain but the git link will be removed.', zh:'将删除以下位置的工作树：<br><code style="font-size:11px;word-break:break-all">{path}</code><br><br>磁盘上的文件将保留，但 git 链接会被移除。'},
  wtp_remove_btn: {en:'Remove', zh:'删除'},
  wtp_force_remove_title: {en:'⚠️ Force Remove Worktree?', zh:'⚠️ 强制删除工作树？'},
  wtp_force_remove_desc: {en:'This worktree has <b>uncommitted changes</b> that will be <b>lost forever</b>.<br><br>Path: <code style="font-size:11px;word-break:break-all">{path}</code><br><br>Force delete anyway?', zh:'该工作树有<b>未提交的更改</b>，强制删除将<b>永久丢失</b>这些更改。<br><br>路径：<code style="font-size:11px;word-break:break-all">{path}</code><br><br>确定强制删除？'},
  wtp_force_remove_btn: {en:'⚠️ Force Delete', zh:'⚠️ 强制删除'},
  wtp_removing: {en:'Removing worktree...', zh:'正在删除工作树...'},
  wtp_removed: {en:'Worktree removed', zh:'工作树已删除'},
  wtp_remove_failed: {en:'Remove failed: ', zh:'删除失败: '},
  wtp_btn_label: {en:'🌲 Worktrees', zh:'🌲 工作树'},
  wtp_occupied_prefix: {en:'⚠️ Branches already in use: ', zh:'⚠️ 已被占用的分支: '},
  ai_wt_title: {en:'🤖 AI Create Worktree', zh:'🤖 AI 创建工作树'},
  ai_wt_input_label: {en:'Enter branch name for new worktree:', zh:'请输入新工作树的分支名：'},
  ai_wt_placeholder: {en:'e.g. feature/my-feature', zh:'例如 feature/my-feature'},
  ai_wt_cancel: {en:'Cancel', zh:'取消'},
  ai_wt_confirm: {en:'Create', zh:'创建'},

  // ── AI Panel ───────────────────────────────────────────────────
  ai_title: {en:'🤖 AI Git Assistant', zh:'🤖 AI Git 助手'},
  ai_close: {en:'Close', zh:'关闭'},
  ai_tab_chat: {en:'💬 Chat', zh:'💬 聊天'},
  ai_tab_diff: {en:'📊 Diff', zh:'📊 差异'},
  ai_width_tooltip: {en:'Panel width in pixels', zh:'面板宽度（像素）'},
  ai_width_px: {en:'Panel width (px)', zh:'面板宽度 (px)'},
  ai_settings: {en:'⚙️ Settings', zh:'⚙️ 设置'},
  ai_configure_provider: {en:'Configure AI Provider', zh:'配置 AI 服务商'},
  ai_show_model_name: {en:'Show full model name', zh:'显示完整模型名'},
  ai_section_conflict: {en:'🔀 Conflict Resolution', zh:'🔀 冲突解决'},
  ai_btn_analyze_conflicts: {en:'🔍 Analyze Conflicts', zh:'🔍 分析冲突'},
  ai_btn_accept_ours: {en:'⬅️ Accept All Ours', zh:'⬅️ 全部接受本地'},
  ai_btn_accept_theirs: {en:'➡️ Accept All Theirs', zh:'➡️ 全部接受传入'},
  ai_btn_accept_both: {en:'🔀 Accept Both', zh:'🔀 双方保留'},
  ai_btn_abort_merge: {en:'🛑 Abort Merge', zh:'🛑 中止合并'},
  ai_section_general: {en:'🔧 General Git', zh:'🔧 通用 Git'},
  ai_btn_git_status: {en:'📊 Git Status', zh:'📊 Git 状态'},
  ai_btn_suggest_commit: {en:'💬 Suggest Commit', zh:'💬 建议提交信息'},
  ai_btn_explain_changes: {en:'🔀 Explain Changes', zh:'🔀 解释变更'},
  ai_btn_recent_commits: {en:'📜 Recent Commits', zh:'📜 最近提交'},
  ai_btn_analyze_branch: {en:'🌿 Analyze Branch', zh:'🌿 分析分支'},
  ai_btn_stash_help: {en:'📦 Stash Help', zh:'📦 Stash 帮助'},
  ai_btn_clean_suggestions: {en:'🧹 Clean Suggestions', zh:'🧹 清理建议'},
  ai_section_commit: {en:'📊 Commit Analysis', zh:'📊 提交分析'},
  ai_btn_analyze_latest: {en:'🔍 Analyze Latest Commit', zh:'🔍 分析最新提交'},
  ai_btn_analyze_specific: {en:'📋 Analyze Specific Commit', zh:'📋 分析指定提交'},
  ai_input_placeholder: {en:'Ask anything about your git repo… (Enter to send, Shift+Enter for newline)', zh:'询问 Git 仓库相关问题…（回车发送，Shift+回车换行）'},
  ai_send: {en:'Send', zh:'发送'},
  ai_diff_loading: {en:'Loading commit info…', zh:'正在加载提交信息…'},
  ai_diff_refresh: {en:'🔄 Refresh', zh:'🔄 刷新'},
  ai_diff_light: {en:'☀️ Light', zh:'☀️ 浅色'},
  ai_diff_dark: {en:'🌙 Dark', zh:'🌙 深色'},
  ai_diff_analyze_all: {en:'🤖 Analyze All', zh:'🤖 全部分析'},
  ai_diff_empty: {en:'No commit diff loaded. Click 🔄 Refresh.', zh:'未加载提交差异。点击 🔄 刷新。'},
  ai_diff_analysis_title: {en:'🤖 AI Analysis', zh:'🤖 AI 分析'},
  ai_diff_analysis_empty: {en:'Select a file and click 🤖 Analyze to see AI insights here.', zh:'选择文件并点击 🤖 Analyze 查看 AI 分析结果。'},
  ai_fab_title: {en:'🤖 AI Git Assistant', zh:'🤖 AI Git 助手'},
  ai_fab_desc: {en:'Smart code analysis · Git Q&A<br>Commit / Conflicts / Branches', zh:'智能分析代码 · 解答 Git 问题<br>处理 Commit / 冲突 / 分支'},
  ai_fab_cta: {en:'Try Now →', zh:'立即体验 →'},
  ai_fab_tooltip: {en:'AI Git Assistant — Click to chat', zh:'AI Git 助手 — 点击对话'},
  ai_model_title: {en:'🤖 Current AI Model', zh:'🤖 当前 AI 模型'},
  ai_provider_label: {en:'Provider:', zh:'服务商:'},
  ai_model_label: {en:'Model:', zh:'模型:'},
  ai_thinking: {en:'Thinking…', zh:'思考中…'},
  ai_testing: {en:'🔄 Testing…', zh:'🔄 测试中…'},
  ai_connected: {en:'✅ Connected', zh:'✅ 连接成功'},
  ai_provider_saved: {en:'✅ Provider saved: ', zh:'✅ 服务商已保存: '},
  ai_error: {en:'❌ Error: ', zh:'❌ 错误: '},
  ai_unknown_error: {en:'Unknown error', zh:'未知错误'},
  ai_network_error: {en:'❌ Network error: ', zh:'❌ 网络错误: '},
  ai_llm_failed: {en:'LLM call failed', zh:'LLM 调用失败'},
  ai_key_required: {en:'❌ API key required for ', zh:'❌ 需要 API key: '},
  ai_base_url_required: {en:'❌ Base URL required for Custom provider', zh:'❌ 自定义服务商需要填写 Base URL'},
  ai_no_conflicts: {en:'✅ No conflicts found in the current repository.', zh:'✅ 当前仓库没有冲突。'},
  ai_no_conflicts_resolve: {en:'✅ No conflicts to resolve.', zh:'✅ 没有需要解决的冲突。'},
  ai_clean_tree: {en:'✅ Working tree is clean — no uncommitted changes.', zh:'✅ 工作区干净 — 没有未提交的更改。'},
  ai_no_commits: {en:'ℹ️ No commits found on this branch.', zh:'ℹ️ 该分支没有提交记录。'},
  ai_stash_empty: {en:'ℹ️ Your stash is empty — no stashed changes.', zh:'ℹ️ 暂存区为空 — 没有暂存的更改。'},
  ai_resolving: {en:'⏳ Resolving {n} file(s) using ', zh:'⏳ 正在使用 '},
  ai_resolved: {en:'✅ Resolved {ok}/{total} file(s)', zh:'✅ 已解决 {ok}/{total} 个文件'},
  ai_skipped: {en:' ({skip} skipped/failed)', zh:'（{skip} 个跳过/失败）'},
  ai_merge_aborted: {en:'✅ Merge/rebase aborted. Returned to previous state.', zh:'✅ 合并/变基已中止。已恢复到之前的状态。'},
  ai_abort_failed: {en:'❌ Abort failed: ', zh:'❌ 中止失败: '},
  ai_no_merge: {en:'No merge in progress?', zh:'没有进行中的合并？'},
  ai_conflict_not_loaded: {en:'⚠️ Conflict data not loaded. Please expand the file first.', zh:'⚠️ 冲突数据未加载。请先展开文件。'},
  ai_conflict_block_not_found: {en:'⚠️ Conflict block #{idx} not found.', zh:'⚠️ 未找到第 {idx} 个冲突块。'},
  ai_diff_fetching: {en:'Fetching diff…', zh:'正在获取差异…'},
  ai_diff_fail_load: {en:'Failed to load diff', zh:'加载差异失败'},
  ai_diff_network_error: {en:'Network error', zh:'网络错误'},
  ai_diff_empty_commit: {en:'No file changes found in this commit.', zh:'该提交中没有文件变更。'},
  ai_no_history: {en:'No history yet', zh:'暂无历史'},
  ai_diff_files_count: {en:'{n} file(s)', zh:'{n} 个文件'},
  ai_analyze_btn: {en:'🤖 Analyze', zh:'🤖 分析'},
  ai_re_analyze: {en:'🔄 Re-analyze', zh:'🔄 重新分析'},
  ai_tab_btn: {en:'↗ Tab', zh:'↗ 标签'},
  err_copy_prompt: {en:'Copy Prompt', zh:'复制提示词'},
  err_copied: {en:'Copied!', zh:'已复制！'},
  err_retry: {en:'Retry', zh:'重试'},
  ai_confirm_yes: {en:'✅ Yes, Proceed', zh:'✅ 确认执行'},
  ai_provider_api_key: {en:'API Key', zh:'API Key'},
  ai_provider_key_placeholder: {en:'Paste your API key…', zh:'粘贴你的 API key…'},
  ai_provider_base_url: {en:'Base URL', zh:'Base URL'},
  ai_provider_model_label: {en:'Model', zh:'模型'},
  ai_provider_custom_model: {en:'Or enter a custom model name…', zh:'或输入自定义模型名…'},
  ai_model_default_option: {en:'— Select from default models —', zh:'— 从默认模型中选择 —'},
  ai_google_hint: {en:'🔑 Use your Google AI Studio API key. Base URL defaults to Gemini OpenAI-compatible endpoint.', zh:'🔑 使用你的 Google AI Studio API Key。Base URL 默认指向 Gemini 的 OpenAI 兼容接口。'},
  ai_google_http400_hint: {en:'(Google returned HTTP 400. Check model name and ensure Base URL is Google OpenAI-compatible endpoint.)', zh:'（Google 返回 HTTP 400，请检查模型名，并确认 Base URL 是 Google OpenAI 兼容端点。）'},
  ai_provider_test: {en:'🔌 Test Connection', zh:'🔌 测试连接'},
  ai_provider_save: {en:'💾 Save', zh:'💾 保存'},
  ai_provider_cancel: {en:'Cancel', zh:'取消'},
  ai_provider_title: {en:'🤖 AI Provider Settings', zh:'🤖 AI 服务商设置'},
  ai_commit_picker_title: {en:'📋 Select a Commit to Analyze', zh:'📋 选择要分析的提交'},
  ai_commit_picker_subtitle: {en:'Compares the selected commit against the latest HEAD', zh:'将选中的提交与最新 HEAD 对比'},
  ai_commit_picker_search: {en:'🔍 Search hash / author / message...', zh:'🔍 搜索 hash / 作者 / 消息...'},
  ai_commit_picker_loading: {en:'Loading…', zh:'加载中…'},

  squash_root_error: {en:'Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.', zh:'无法 Squash：选中的最旧提交是初始 commit（没有父节点），请取消勾选它。'},
  force_push_title: {en:'🎉 Squash Successful!', zh:'🎉 Squash 成功！'},
  force_push_desc: {en:'Squash rewrites commit history. To update the remote branch you must <b>force push</b> (<code>--force-with-lease</code>).<br><br>Force push now?', zh:'Squash 会改写提交历史，远端分支需要使用 <b>force push</b>（<code>--force-with-lease</code>）才能更新。<br><br>现在立即执行吗？'},
  force_push_btn: {en:'Force Push Now', zh:'立即 Force Push'},
  force_push_later: {en:'Later', zh:'稍后手动操作'},
  squash_tip: {en:'💡 Tip: Check 2 or more commit checkboxes to merge them into one commit (Squash)', zh:'💡 提示：勾选 2 个或以上 commit 的 checkbox，可将它们合并为一个新 commit（Squash）'},
  squash_panel_title: {en:'Squash Commits', zh:'Squash 合并'},
  squash_nonadj_note: {en:'Non-adjacent commits selected — they will be grouped at the oldest position via interactive rebase. Only these commits are squashed; others are NOT affected.', zh:'所选 commit 不相邻，将通过 interactive rebase 把它们集中后再合并，其余 commit 顺序不变、不受影响。'},
  create_branch_btn: {en:'+ Create Branch', zh:'+ 新建分支'},
  new_branch_placeholder: {en:'New branch name...', zh:'新分支名...'},
  branch_search_placeholder: {en:'Search branches (fuzzy)...', zh:'搜索分支（模糊匹配）...'},
  log_search_placeholder: {en:'Search hash / author / message...', zh:'搜索 hash / 作者 / 消息...'},
  code_search_placeholder: {en:'Search code in diffs...', zh:'搜索代码变更...'},
  squash_msg_placeholder: {en:'New commit message...', zh:'合并后的新 commit 消息...'},
  restore_page_title: {en:'Restore File to Commit', zh:'还原文件到指定 Commit'},
  restore_page_desc: {en:'Select a commit below to restore this file to that version. This will overwrite your current working copy.', zh:'选择一个 commit，将当前文件还原到该版本（会覆盖当前工作区文件）。'},
  back_to_log: {en:'← Back to Commits History', zh:'← 返回提交历史'},
  tab_commit: {en:'Commit', zh:'提交'},
  tab_branches: {en:'Branches', zh:'分支'},
  tab_log: {en:'Commits History', zh:'提交历史'},
  tab_prs: {en:'Pull Requests', zh:'拉取请求'},
  prs_tab_in_review: {en:'In Review', zh:'评审中'},
  prs_tab_merged: {en:'Merged', zh:'已合并'},
  prs_tab_closed: {en:'Closed', zh:'已关闭'},
  prs_search_placeholder: {en:'Search PR # / author / title...', zh:'搜索 PR 编号 / 作者 / 标题...'},
  prs_no_match: {en:'No matching pull requests', zh:'无匹配的拉取请求'},
  prs_open: {en:'In Review', zh:'评审中'},
  prs_merged: {en:'Merged', zh:'已合并'},
  prs_closed: {en:'Closed', zh:'已关闭'},
  prs_draft: {en:'Draft', zh:'草稿'},
  prs_view: {en:'View', zh:'查看'},
  tab_conflicts: {en:'Conflicts', zh:'冲突'},
  tab_stash: {en:'Stash', zh:'暂存'},
  tab_graph: {en:'Graph 🌳', zh:'图谱 🌳'},
  tab_worktree: {en:'Worktrees', zh:'工作树'},
  tab_fetch: {en:'Fetch', zh:'Fetch'},
  tab_fetch_title: {en:'Fetch from remote (download only)', zh:'从远端拉取最新信息（仅下载，不合并）'},
  tab_pull: {en:'Pull', zh:'Pull'},
  tab_pull_title: {en:'Pull & rebase from remote', zh:'从远端拉取并 rebase 到当前分支'},
  tab_push: {en:'Push', zh:'Push'},
  tab_push_title: {en:'Push local commits to remote', zh:'推送本地 commit 到远端'},
  fetch_desc: {en:'Check remote for new commits', zh:'检查远端是否有新 commit'},
  pull_desc: {en:'Sync remote commits to local', zh:'将远端 commit 同步到本地'},
  push_desc: {en:'Send local commits to remote', zh:'将本地 commit 推送到远端'},
  protected_branch_title: {en:'⚠️ Protected Branch Warning', zh:'⚠️ 重要分支警告'},
  protected_branch_commit: {en:'You are about to <b>commit</b> directly to <b style="color:#dc2626">{branch}</b>.<br><br><b>This is a protected branch.</b> Direct commits to <code>develop</code> / <code>release</code> / <code>main</code> / <code>master</code> may break the team workflow.<br><br>Are you sure you want to continue?', zh:'你即将直接向 <b style="color:#dc2626">{branch}</b> 提交 commit。<br><br><b>这是重要分支。</b>直接向 <code>develop</code> / <code>release</code> / <code>main</code> / <code>master</code> 提交可能破坏团队工作流程。<br><br>确定要继续吗？'},
  protected_branch_squash: {en:'You are about to <b>squash commits</b> directly on <b style="color:#dc2626">{branch}</b>.<br><br><b>This is a protected branch.</b> Squashing rewrites history and may affect other team members.<br><br>Are you sure you want to continue?', zh:'你即将在 <b style="color:#dc2626">{branch}</b> 上直接执行 Squash（合并 commit）。<br><br><b>这是重要分支。</b>Squash 会重写历史记录，可能影响其他团队成员。<br><br>确定要继续吗？'},
  proceed_anyway: {en:'Proceed Anyway', zh:'仍然继续'},
  stash_btn: {en:'📦 Stash', zh:'📦 Stash 暂存'},
  stash_dialog_title: {en:'📦 Stash Current Changes', zh:'📦 Stash 当前改动'},
  stash_dialog_desc: {en:'Save your current changes to the stash so you can switch contexts or apply them later from the Stash tab.', zh:'将当前改动保存到 Stash，稍后可在 Stash 页面恢复。'},
  stash_msg_placeholder: {en:'Stash message (optional)...', zh:'Stash 备注（选填）...'},
  do_stash: {en:'Stash', zh:'确认 Stash'},
  stash_ok: {en:'Changes stashed successfully', zh:'改动已成功 Stash'},
  nothing_to_stash: {en:'Nothing to stash — no local changes detected.', zh:'没有需要 Stash 的改动。'},
  merge_blocked_title: {en:'⚠️ Merge Blocked — Unstaged Changes', zh:'⚠️ Merge 被阻止 — 存在未暂存改动'},
  merge_blocked_desc: {en:'Git cannot merge because your local changes would be overwritten.<br><br>Stash your changes first, then the merge will be retried automatically.', zh:'Git 无法合并，因为本地的改动会被覆盖。<br><br>请先将改动 Stash，之后将自动重试合并。'},
  stash_and_retry: {en:'Stash & Retry Merge', zh:'Stash 并重试合并'},
  // Commit picker modal
  commit_picker_title: {en:'📋 Select a Commit to Analyze', zh:'📋 选择要分析的 Commit'},
  commit_picker_subtitle: {en:'Compares the selected commit against the latest HEAD', zh:'选中后将对比与最新 HEAD 的差异'},
  commit_picker_search_ph: {en:'🔍 Search hash / author / message...', zh:'🔍 搜索 hash / 作者 / 消息...'},
  commit_picker_loading: {en:'Loading…', zh:'加载中…'},
  commit_picker_empty: {en:'No commits found', zh:'暂无 Commit 记录'},
  commit_picker_load_fail: {en:'Load failed: ', zh:'加载失败: '},
  commit_picker_total: {en:'Total {n} records', zh:'共 {n} 条记录'},
  commit_picker_analyze_btn: {en:'Analyze →', zh:'分析 →'},
  commit_picker_cancel: {en:'Cancel', zh:'取消'},
  commit_picker_expand_pages: {en:'… +{n} more', zh:'… 展开 +{n} 页'},
  commit_picker_collapse: {en:'Collapse', zh:'收起'},
  // Error actions
  err_copy_prompt: {en:'📋 Copy Prompt', zh:'📋 复制提问'},
  err_copied: {en:'✅ Copied', zh:'✅ 已复制'},
  err_retry: {en:'🔄 Retry', zh:'🔄 重新发送'},
  // Compare mode
  diff_compare_mode: {en:'Compare Mode', zh:'比较模式'},
  diff_compare_from: {en:'From: ', zh:'From: '},
  // Pagination
  pag_expand: {en:'… +{n} more', zh:'… +{n} 页'},
  pag_collapse: {en:'Collapse', zh:'收起'},

  // Git Settings
  git_settings_title: {en:'⚙️ Git Network Settings', zh:'⚙️ Git 网络设置'},
  git_settings_tooltip: {en:'Git Network Settings', zh:'Git 网络设置'},
  git_timeout_label: {en:'Network Timeout (seconds)', zh:'网络超时时间（秒）'},
  git_timeout_unit: {en:'sec', zh:'秒'},
  git_timeout_hint: {en:'Applies to push, pull, and fetch operations. Default: 120 seconds.', zh:'适用于 push、pull、fetch 操作。默认值：120 秒。'},
  git_timeout_saved: {en:'✅ Timeout saved: {n}s', zh:'✅ 超时时间已保存：{n} 秒'},
  git_timeout_save_fail: {en:'❌ Save failed: ', zh:'❌ 保存失败：'},

  // Branch rename
  rename_branch_btn: {en:'✏️ Rename', zh:'✏️ 重命名'},
  rename_branch_title: {en:'✏️ Rename Branch', zh:'✏️ 重命名分支'},
  rename_branch_label: {en:'New branch name:', zh:'新分支名：'},
  rename_branch_placeholder: {en:'Enter new branch name…', zh:'输入新分支名…'},
  rename_branch_confirm: {en:'Rename', zh:'确认重命名'},
  rename_branch_ok: {en:'Branch renamed: ', zh:'分支已重命名: '},
  rename_branch_fail: {en:'Rename failed: ', zh:'重命名失败: '},
  rename_remote_title: {en:'🎉 Branch Renamed!', zh:'🎉 分支已重命名！'},
  rename_remote_desc: {en:'Branch renamed from <b>{old}</b> to <b>{new}</b>.<br><br>Update the remote branch too? The old remote branch will be deleted and the new name pushed.', zh:'分支已从 <b>{old}</b> 重命名为 <b>{new}</b>。<br><br>是否同步更新远端分支？旧的远端分支将被删除，新名称将被推送。'},
  rename_push_btn: {en:'Push & Update Remote', zh:'推送并更新远端'},
  rename_later_btn: {en:'Keep Local Only', zh:'仅本地重命名'},

  // Push to selectable remote branch
  push_remote_branch_label: {en:'Push to remote branch:', zh:'推送到远端分支：'},
  push_remote_branch_placeholder: {en:'Remote branch name…', zh:'远端分支名…'},
  push_remote_branch_default: {en:'(same as local)', zh:'（与本地同名）'},
  push_remote_select_title: {en:'🚀 Push to Remote', zh:'🚀 推送到远端'},

  // Rebase quick actions
  rebase_actions_title: {en:'⚡ Rebase Quick Actions', zh:'⚡ Rebase 快速操作'},
  rebase_actions_hint: {en:'Choose an action to handle this rebase state:', zh:'选择一个操作来处理当前 Rebase 状态：'},
  rebase_abort_btn: {en:'🛑 Abort Rebase', zh:'🛑 中止 Rebase'},
  rebase_abort_confirm_title: {en:'🛑 Abort Rebase?', zh:'🛑 确认中止 Rebase？'},
  rebase_abort_confirm_desc: {en:'This will <b>undo all rebase progress</b> and restore your branch exactly to its state before the rebase started.<br><br>✅ Your working tree changes are preserved.<br>⚠️ Any commits applied during this rebase will be lost.', zh:'这将<b>撤销所有 Rebase 进度</b>，将分支恢复到 Rebase 开始前的状态。<br><br>✅ 工作区的改动会被保留。<br>⚠️ Rebase 过程中已应用的提交将丢失。'},
  rebase_abort_ok: {en:'✅ Rebase aborted — branch restored to pre-rebase state', zh:'✅ Rebase 已中止 — 分支已恢复到 Rebase 前的状态'},
  rebase_abort_fail: {en:'Abort failed: ', zh:'中止失败: '},
  rebase_skip_btn: {en:'⏭️ Skip Commit', zh:'⏭️ 跳过当前提交'},
  rebase_skip_confirm_title: {en:'⏭️ Skip Current Commit?', zh:'⏭️ 跳过当前提交？'},
  rebase_skip_confirm_desc: {en:'This will <b>skip the current conflicting commit</b> and continue rebasing with the next commit.<br><br>⚠️ <b>Warning:</b> The changes from the skipped commit will be <b>permanently lost</b>. Use this only if you intentionally want to discard this commit.', zh:'这将<b>跳过当前冲突的提交</b>，继续处理下一个提交。<br><br>⚠️ <b>警告：</b>被跳过的提交中的改动将<b>永久丢失</b>。仅在你确定不需要该提交时使用此操作。'},
  rebase_skip_ok: {en:'✅ Commit skipped — rebase continuing with next commit', zh:'✅ 提交已跳过 — Rebase 继续处理下一个提交'},
  rebase_skip_fail: {en:'Skip failed: ', zh:'跳过失败: '},
  rebase_continue_btn: {en:'▶️ Continue Rebase', zh:'▶️ 继续 Rebase'},
  rebase_continue_confirm_title: {en:'▶️ Continue Rebase?', zh:'▶️ 继续 Rebase？'},
  rebase_continue_confirm_desc: {en:'This will <b>continue the rebase</b> applying the next commit.<br><br>⚠️ <b>Make sure all conflicts are resolved first!</b><br>Go to the <b>Conflicts tab</b>, resolve each file, and use <code>git add</code> to stage them — then click Continue.', zh:'这将<b>继续 Rebase</b>，应用下一个提交。<br><br>⚠️ <b>请先确保所有冲突都已解决！</b><br>前往 <b>Conflicts 标签页</b>，解决每个文件的冲突，并通过 <code>git add</code> 暂存它们 — 然后再点击继续。'},
  rebase_continue_ok: {en:'✅ Rebase continuing — check Conflicts tab if new conflicts appear', zh:'✅ Rebase 继续中 — 如有新冲突请检查 Conflicts 标签页'},
  rebase_continue_fail: {en:'Continue failed: ', zh:'继续失败: '},
  rebase_confirm_btn: {en:'Confirm', zh:'确认'},
  ai_fix_btn: {en:'🤖 AI Fix', zh:'🤖 AI 修复'},
  ai_fix_starting: {en:'Starting AI fix...', zh:'正在启动 AI 修复...'},
  ai_fix_progress: {en:'AI is fixing git error...', zh:'AI 正在修复 Git 错误...'},
  ai_fix_plan_title: {en:'🤖 AI Fix Plan', zh:'🤖 AI 修复方案'},
  ai_fix_plan_desc: {en:'AI generated the following fix commands. Apply now?', zh:'AI 已生成以下修复命令，是否现在执行？'},
  ai_fix_apply_confirm: {en:'Apply Fix', zh:'执行修复'},
  ai_fix_apply_cancel: {en:'Cancel', zh:'取消'},
  ai_fix_failed: {en:'AI fix failed: ', zh:'AI 修复失败: '},
  ai_fix_done: {en:'AI fix completed.', zh:'AI 修复完成。'},
  ai_fix_canceled: {en:'AI fix canceled.', zh:'AI 修复已取消。'},
  ai_fix_retry_title: {en:'Retry original git operation?', zh:'是否重试原 Git 操作？'},
  ai_fix_retry_desc: {en:'Fix is applied. Continue the previous git operation now?', zh:'修复已执行，是否继续刚才的 Git 操作？'},
  ai_fix_retry_confirm: {en:'Retry Operation', zh:'重试操作'},
  ai_fix_retry_cancel: {en:'Later', zh:'稍后'},
  ai_fix_no_config: {en:'AI provider/model is not configured.', zh:'AI 服务商或模型未配置。'},
  ai_fix_need_api_key: {en:'AI API key is required for current provider.', zh:'当前 AI 服务商需要 API Key。'},
  ai_fix_need_base_url: {en:'Base URL is required for custom AI provider.', zh:'自定义 AI 服务商需要 Base URL。'},
  ai_fix_error_detail_fallback: {en:'Unknown failure. Please check AI settings and server logs.', zh:'未知失败，请检查 AI 配置和服务端日志。'},
  ai_fix_log_expand: {en:'Show more logs', zh:'展开日志'},
  ai_fix_log_collapse: {en:'Collapse logs', zh:'收起日志'},
  ai_fix_no_retry: {en:'No retry action found for this operation.', zh:'当前操作未记录可重试动作。'},
};

function t(key, lang) {
  lang = lang || L;
  var entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}

function tf(key, lang, replacements) {
  var s = t(key, lang);
  if (replacements) {
    for (var k in replacements) s = s.replace('{'+k+'}', replacements[k]);
  }
  return s;
}

// ── Shared smart pagination helpers ──────────────────────────────────────────
var _pagData = {};     // section -> { totalPages, cur, loadFn, infoHtml }
var _pagExpanded = {}; // section -> bool

function _buildSmartPageNums(totalPages, cur) {
  var EDGE = 2, WIN = 2;
  var visible = {};
  for (var e = 1; e <= Math.min(EDGE, totalPages); e++) visible[e] = 1;
  for (var e = Math.max(1, totalPages - EDGE + 1); e <= totalPages; e++) visible[e] = 1;
  for (var w = Math.max(1, cur - WIN); w <= Math.min(totalPages, cur + WIN); w++) visible[w] = 1;
  var nums = Object.keys(visible).map(Number).sort(function(a,b){return a-b;});
  var result = [];
  for (var i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] - nums[i-1] > 1) result.push('...');
    result.push(nums[i]);
  }
  return result;
}

function _renderSmartPaginationHTML(section) {
  var d = _pagData[section];
  if (!d || d.totalPages <= 1) return '';
  var expanded = !!_pagExpanded[section];
  var showAll = d.totalPages <= 20 || expanded;
  var pageNums;
  if (showAll) {
    pageNums = [];
    for (var i = 1; i <= d.totalPages; i++) pageNums.push(i);
  } else {
    pageNums = _buildSmartPageNums(d.totalPages, d.cur);
  }
  var html = d.infoHtml || '';
  pageNums.forEach(function(n) {
    if (n === '...') {
      html += '<span class="page-dots">…</span>';
    } else {
      var cls = (n === d.cur) ? 'page-num active' : 'page-num';
      html += '<span class="'+cls+'" onclick="'+d.loadFn+'('+n+')">'+n+'</span>';
    }
  });
  if (d.totalPages > 20) {
    if (expanded) {
      html += '<span class="page-num page-expand" onclick="_togglePagExpand(\''+section+'\')">'+t('pag_collapse')+'</span>';
    } else {
      html += '<span class="page-num page-expand" onclick="_togglePagExpand(\''+section+'\')">'+tf('pag_expand', L, {n: d.totalPages - 7})+'</span>';
    }
  }
  return html;
}

function _togglePagExpand(section) {
  _pagExpanded[section] = !_pagExpanded[section];
  var pag = document.getElementById(section+'-pagination');
  if (pag) pag.innerHTML = _renderSmartPaginationHTML(section);
}

function _setSmartPagination(section, totalPages, cur, loadFn, totalItems) {
  _pagData[section] = {
    totalPages: totalPages, cur: cur, loadFn: loadFn,
    infoHtml: totalItems ? '<span class="page-info">Total '+totalItems+'</span>' : ''
  };
  if (_pagExpanded[section] === undefined) _pagExpanded[section] = false;
  var pag = document.getElementById(section+'-pagination');
  if (!pag) return;
  if (totalPages <= 1) { pag.innerHTML = ''; return; }
  pag.innerHTML = _renderSmartPaginationHTML(section);
}
// ─────────────────────────────────────────────────────────────────────────────

function switchLang(lang) {
  L = lang;
  localStorage.setItem('git_tool_lang', lang);
  var sel = document.getElementById('lang-sel');
  if (sel) sel.value = lang;
  applyI18n();
  var helpPanel = document.getElementById('wtp-help-panel');
  if (helpPanel) { helpPanel._rendered = false; if (helpPanel.classList.contains('show')) _renderHelpPanel(); }
  var active = document.querySelector('.page.active');
  if (active) {
    var id = active.id;
    if (id === 'page-main') loadFiles();
    else if (id === 'page-branches') loadBranches(1);
    else if (id === 'page-stash') loadStash();
    else if (id === 'page-conflicts') loadConflicts();
    else if (id === 'page-log') loadLog(1);
    else if (id === 'page-prs') loadPullRequests(1);
    else if (id === 'page-msglog') loadMsgLog(1);
  }
}

function applyI18n() {
  document.title = t('app_tab_title');
  var els = document.querySelectorAll('[data-i18n]');
  for (var i=0; i<els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  }
  var htmlEls = document.querySelectorAll('[data-i18n-html]');
  for (var i=0; i<htmlEls.length; i++) {
    var el = htmlEls[i];
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  }
  var phEls = document.querySelectorAll('[data-i18n-placeholder]');
  for (var i=0; i<phEls.length; i++) {
    phEls[i].placeholder = t(phEls[i].getAttribute('data-i18n-placeholder'));
  }
  var titleEls = document.querySelectorAll('[data-i18n-title]');
  for (var i=0; i<titleEls.length; i++) {
    titleEls[i].title = t(titleEls[i].getAttribute('data-i18n-title'));
  }
  var cntSpan = document.querySelector('.msg-log-bar span[data-i18n="msg_count"]');
  if (cntSpan) cntSpan.textContent = tf('msg_count', L, {n: msgLog.length});
}

var msgLog = [];
var msgId = 0;
var _MSGLOG_STORAGE_KEY='git_tool_msg_log_v1';
var _MSGLOG_MAX_ENTRIES=3000;

function _saveMsgLogToStorage(){
  try{
    if(msgLog.length>_MSGLOG_MAX_ENTRIES){
      msgLog=msgLog.slice(msgLog.length-_MSGLOG_MAX_ENTRIES);
    }
    localStorage.setItem(_MSGLOG_STORAGE_KEY, JSON.stringify(msgLog));
  }catch(e){}
}

function _loadMsgLogFromStorage(){
  try{
    var raw=localStorage.getItem(_MSGLOG_STORAGE_KEY);
    if(!raw)return;
    var arr=JSON.parse(raw);
    if(Array.isArray(arr)){
      msgLog=arr.filter(function(it){
        return it && typeof it.time==='string' && typeof it.type==='string' && typeof it.text==='string';
      });
      if(msgLog.length>_MSGLOG_MAX_ENTRIES){
        msgLog=msgLog.slice(msgLog.length-_MSGLOG_MAX_ENTRIES);
      }
    }
  }catch(e){}
}

// Init
(function(){
  try {
    _loadMsgLogFromStorage();
    var sel = document.getElementById('lang-sel');
    if (sel) sel.value = L;
    applyI18n();
    updateMsgCount();
  } catch(e) {
    document.body.insertAdjacentHTML('afterbegin','<div style="background:#fee2e2;color:#991b1b;padding:10px;margin:10px;border-radius:8px">JS Error: '+e.message+'</div>');
  }
})();

var API_BASE = window.location.origin;
var checkedPaths = {};
var expandedPaths = {};
var modalCallback = null;
var resolvedConflicts = {};
var squashSelected = {};
var squashCommitCache = {};  // hash → full commit data, persists across page turns
var currentLogData = null;
var logUnsignedFilter = false;
var _lastGitOpCtx = null;
var _aiFixActive = false;
var _aiFixLogs = {};

// ── Commit log local cache ────────────────────────────────────────────────────
var _logCache = {
  branch: null, headHash: null, total: 0, perPage: 10, order: 'desc', pages: {}
};

function _logCacheStorageKey(branch, perPage, order) {
  return 'gitboard_log_' + (branch||'') + '_' + perPage + '_' + order;
}

function _saveLogCache() {
  try {
    var key = _logCacheStorageKey(_logCache.branch, _logCache.perPage, _logCache.order);
    localStorage.setItem(key, JSON.stringify(_logCache));
  } catch(e) {}
}

function _tryRestoreLogCache(branch, perPage, order) {
  try {
    // If branch is known, try direct key first
    if (branch) {
      var key = _logCacheStorageKey(branch, perPage, order);
      var raw = localStorage.getItem(key);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.perPage == perPage && d.order === order) {
          _logCache = d;
          return true;
        }
      }
    }
    // Branch unknown (first load): scan localStorage for any matching entry
    var prefix = 'gitboard_log_';
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        var d2 = JSON.parse(localStorage.getItem(k));
        if (d2 && d2.perPage == perPage && d2.order === order && d2.pages) {
          _logCache = d2;
          return true;
        }
      }
    }
  } catch(e) {}
  return false;
}

function _invalidateLogCache() {
  _logCache.pages = {};
  _logCache.headHash = null;
  _saveLogCache();
}

// Use after any git mutation (commit/squash/push/rebase/reset/revert/drop)
function _reloadLog(page) {
  _invalidateLogCache();
  loadLog(page || 1);
}
// ─────────────────────────────────────────────────────────────────────────────

function _rememberGitOp(name, retryFn){
  _lastGitOpCtx = {name:name||'', retry:typeof retryFn==='function'?retryFn:null, ts:Date.now()};
}

function _getAICfgSafe(){
  try{
    if(typeof getAIConfig==='function') return getAIConfig() || null;
  }catch(e){}
  return null;
}

function _getAIProviderDefSafe(provider){
  try{
    if(typeof AI_PROVIDERS==='object' && AI_PROVIDERS && AI_PROVIDERS[provider]) return AI_PROVIDERS[provider];
  }catch(e){}
  return null;
}

function _validateAIFixConfig(cfg){
  if(!cfg||!cfg.provider||!cfg.model) return t('ai_fix_no_config');
  var p=_getAIProviderDefSafe(cfg.provider);
  if(p && p.needsKey && !String(cfg.api_key||'').trim()) return t('ai_fix_need_api_key');
  if(cfg.provider==='custom' && !String(cfg.base_url||'').trim()) return t('ai_fix_need_base_url');
  return '';
}

function _formatAIFixError(data, fallback){
  var parts=[];
  if(data){
    if(data.error) parts.push(String(data.error).trim());
    if(!parts.length && data.message) parts.push(String(data.message).trim());
    if(data.phase) parts.push('phase='+data.phase);
    if(data.raw) parts.push('raw='+String(data.raw).slice(0,400));
    if(Array.isArray(data.apply_logs) && data.apply_logs.length){
      for(var i=data.apply_logs.length-1;i>=0;i--){
        var it=data.apply_logs[i]||{};
        if(it.ok===false){
          var seg=['cmd='+(it.cmd||'')];
          if(it.stderr) seg.push('stderr='+(it.stderr||'').slice(0,400));
          else if(it.stdout) seg.push('stdout='+(it.stdout||'').slice(0,400));
          parts.push(seg.join(' | '));
          break;
        }
      }
    }
  }
  var detail=parts.filter(function(x){return !!x;}).join('\n');
  if(!detail) detail=fallback||t('ai_fix_error_detail_fallback');
  return detail;
}

// ═══════════ Utils ═══════════
var _spinnerCount=0;
function _showSpinner(msg){
  _spinnerCount++;
  var s=document.getElementById('global-spinner');
  if(s){document.getElementById('spinner-msg').textContent=msg||'Loading...';s.classList.add('show')}
}
function _hideSpinner(){
  _spinnerCount=Math.max(0,_spinnerCount-1);
  if(!_spinnerCount){var s=document.getElementById('global-spinner');if(s)s.classList.remove('show')}
}
function showToast(msg, type, duration) {
  type=type||'info'; duration=duration||3500;
  var t=document.getElementById('toast');
  t.textContent=msg;
  t.className='show '+(type==='ok'?'ok':type==='err'?'err':'info');
  setTimeout(function(){t.classList.remove('show')},duration);
}
function onPerPageChange(sel, section){
  var isAll=sel.value==='0';
  var warnId=section+'-all-warn';
  var warn=document.getElementById(warnId);
  if(warn)warn.style.display=isAll?'inline-block':'none';
  if(section==='branches')renderBranchPage(1);  // use cache; no network call needed
  else if(section==='log')loadLog(1);
  else if(section==='prs')loadPullRequests(1);
  else if(section==='stash')loadStash(1);
}

function escapeHtml(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escapeAttr(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escapeJS(s){return escapeAttr(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}

function addMsg(msg, cls, opts) {
  cls=cls||'info';
  opts=opts||{};
  var maxLines = opts.maxLines || 0; // 0 = no limit
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  _saveMsgLogToStorage();
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  var lines = msg.split('\n');
  var needScroll = maxLines > 0 && lines.length > maxLines;
  var extraActions = Array.isArray(opts.actions) ? opts.actions.slice() : [];
  if (cls === 'error' && !opts.disableAiFix && !_aiFixActive) {
    extraActions.push({
      label: t('ai_fix_btn'),
      className: 'btn-primary',
      onClick: function(){ _startAIFixFlow(msg, opts.gitOp || _lastGitOpCtx || null); }
    });
  }
  var actionsHtml = '';
  if (extraActions.length) {
    actionsHtml = '<div class="msg-actions"></div>';
  }
  if (needScroll) {
    div.innerHTML='<div class="msg-main"><span class="msg-text msg-text-scroll" style="display:block;max-height:'+(maxLines*1.6)+'em;overflow-y:auto;white-space:pre-wrap;font-family:monospace;font-size:12px;line-height:1.6">'+escapeHtml(msg)+'</span><span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span></div>'+actionsHtml;
  } else {
    div.innerHTML='<div class="msg-main"><span class="msg-text">'+escapeHtml(msg)+'</span><span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span></div>'+actionsHtml;
  }
  if (extraActions.length) {
    var actionWrap = div.querySelector('.msg-actions');
    extraActions.forEach(function(a){
      var b = document.createElement('button');
      b.className = 'btn btn-sm ' + (a.className || 'btn-secondary');
      b.textContent = a.label || 'Action';
      b.onclick = function(){ if(typeof a.onClick==='function') a.onClick(); };
      actionWrap.appendChild(b);
    });
  }
  area.appendChild(div);
  return id;
}

function addMsgWithAction(msg, cls, actions) {
  cls=cls||'info';
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  _saveMsgLogToStorage();
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  div.innerHTML='<div class="msg-main"><span class="msg-text">'+escapeHtml(msg)+'</span><span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span></div><div class="msg-actions"></div>';
  var actionWrap = div.querySelector('.msg-actions');
  (actions||[]).forEach(function(a){
    var b=document.createElement('button');
    b.className='btn btn-sm btn-primary';
    b.textContent=a.label;
    b.onclick=function(){dismissMsg(id);if(typeof a.onClick==='function')a.onClick();};
    actionWrap.appendChild(b);
  });
  if (cls === 'error' && !_aiFixActive) {
    var aiBtn=document.createElement('button');
    aiBtn.className='btn btn-sm btn-primary';
    aiBtn.textContent=t('ai_fix_btn');
    aiBtn.onclick=function(){_startAIFixFlow(msg,_lastGitOpCtx||null);};
    actionWrap.appendChild(aiBtn);
  }
  area.appendChild(div);
}

function updateMsgCount(){
  var el = document.querySelector('.msg-log-bar span[data-i18n="msg_count"]');
  if (el) el.textContent = tf('msg_count', L, {n: msgLog.length});
}
function dismissMsg(id){var el=document.getElementById(id);if(el)el.remove()}

// Detect when msg-sticky-wrap is stuck to top, add shadow
(function(){
  var wrap = document.querySelector('.msg-sticky-wrap');
  if (!wrap || !window.IntersectionObserver) return;
  // Sentinel: a 1px element just above the wrap
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none';
  wrap.parentNode.insertBefore(sentinel, wrap);
  new IntersectionObserver(function(entries){
    wrap.classList.toggle('is-stuck', !entries[0].isIntersecting);
  }, {threshold: 1}).observe(sentinel);
})();

function safeApiGet(path,cb){
  fetch(API_BASE+path).then(function(r){return r.json()}).then(cb).catch(function(e){console.error(e);if(typeof addMsg==='function')addMsg(t('network_err')+e.message,'error')});
}
function safeApiPost(path,body,cb){
  fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){return r.json()}).then(cb).catch(function(e){console.error(e);if(typeof addMsg==='function')addMsg(t('network_err')+e.message,'error')});
}

// ═══════════ Msg Log page ═══════════
var msgLogPage = 1;
function loadMsgLog(page) {
  page=page||1; msgLogPage=page;
  switchPage('msglog');
  var perPage=10;
  var total=msgLog.length;
  var totalPages=Math.max(1,Math.ceil(total/perPage));
  var start=(page-1)*perPage;
  var newestFirst=msgLog.slice().reverse();
  var items=newestFirst.slice(start,start+perPage);
  var container=document.getElementById('msglog-content');
  if(!items.length){container.innerHTML='<div class="empty">No messages</div>';return}
  var html='<table class="log-table"><thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead><tbody>';
  items.forEach(function(m){
    var cls=m.type==='error'?'color:#dc2626':m.type==='success'?'color:#059664':'color:#6b7280';
    html+='<tr><td style="font-size:12px;color:#9ca3af;white-space:nowrap">'+escapeHtml(m.time)+'</td><td style="'+cls+'">'+m.type+'</td><td style="font-size:13px">'+escapeHtml(m.text)+'</td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  _setSmartPagination('msglog', totalPages, page, 'loadMsgLog', total);
}

function clearMsgLog() {
  showModal(t('confirm_clear_msg'), t('confirm_clear_msg'), 'Clear', function(){
    msgLog=[];
    _saveMsgLogToStorage();
    updateMsgCount();
    addMsg(t('msg_cleared'),'success');
    loadMsgLog(1);
  });
}

function showConfirmDialog(opts){
  opts=opts||{};
  var title=opts.title||'';
  var msg=opts.message||'';
  var confirmText=opts.confirmText||'OK';
  var cancelText=opts.cancelText||'Cancel';
  var confirmClass=opts.confirmClass||'btn-warning';
  var onConfirm=opts.onConfirm;
  var onCancel=opts.onCancel;
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var cancelBtn=document.createElement('button');
  cancelBtn.className='btn btn-secondary';
  cancelBtn.textContent=cancelText;
  cancelBtn.onclick=function(){closeModal();if(typeof onCancel==='function')onCancel();};
  var confirmBtn=document.createElement('button');
  confirmBtn.className='btn '+confirmClass;
  confirmBtn.textContent=confirmText;
  confirmBtn.onclick=function(){closeModal();if(typeof onConfirm==='function')onConfirm();};
  btnsDiv.appendChild(cancelBtn);
  btnsDiv.appendChild(confirmBtn);
  document.getElementById('modal-bg').classList.add('show');
}

function showModal(title, msg, confirmLabel, cb) {
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var cancelBtn=document.createElement('button');
  cancelBtn.className='btn btn-secondary';
  cancelBtn.textContent='Cancel';
  cancelBtn.onclick=function(){closeModal();};
  btnsDiv.appendChild(cancelBtn);
  if(confirmLabel){
    var confirmBtn=document.createElement('button');
    confirmBtn.className='btn btn-warning';
    confirmBtn.textContent=confirmLabel;
    confirmBtn.onclick=function(){var c=cb;closeModal();if(c)c();};
    btnsDiv.appendChild(confirmBtn);
  }
  document.getElementById('modal-bg').classList.add('show');
}

var _modalRestoreFn = null;
function _setModalLayout(stylePatch){
  var bg=document.getElementById('modal-bg');
  var box=bg?bg.querySelector('.modal-box'):null;
  if(!box)return;
  var prev={
    maxWidth: box.style.maxWidth||'',
    width: box.style.width||'',
    maxHeight: box.style.maxHeight||'',
    overflowY: box.style.overflowY||'',
    padding: box.style.padding||''
  };
  if(stylePatch.maxWidth!=null) box.style.maxWidth=stylePatch.maxWidth;
  if(stylePatch.width!=null) box.style.width=stylePatch.width;
  if(stylePatch.maxHeight!=null) box.style.maxHeight=stylePatch.maxHeight;
  if(stylePatch.overflowY!=null) box.style.overflowY=stylePatch.overflowY;
  if(stylePatch.padding!=null) box.style.padding=stylePatch.padding;
  _modalRestoreFn=function(){
    box.style.maxWidth=prev.maxWidth;
    box.style.width=prev.width;
    box.style.maxHeight=prev.maxHeight;
    box.style.overflowY=prev.overflowY;
    box.style.padding=prev.padding;
    _modalRestoreFn=null;
  };
}

function closeModal() {
  if(_modalRestoreFn)_modalRestoreFn();
  document.getElementById('modal-bg').classList.remove('show');
  modalCallback=null;
}

function _ensureAIFixProgressUI(msgId){
  var host=document.getElementById(msgId);
  if(!host) return null;
  var box=host.querySelector('.msg-ai-fix-progress');
  if(!box){
    box=document.createElement('div');
    box.className='msg-ai-fix-progress';
    box.innerHTML=
      '<div class="msg-ai-fix-meta"><span class="msg-ai-fix-text"></span><span class="msg-ai-fix-percent">0%</span></div>'
      +'<div class="msg-ai-fix-bar"><div class="msg-ai-fix-fill"></div></div>'
      +'<div class="msg-ai-fix-log-wrap">'
      +'<button class="msg-ai-fix-log-toggle" style="display:none" onclick="_toggleAIFixLog(\''+msgId+'\')"></button>'
      +'<pre class="msg-ai-fix-log"></pre>'
      +'</div>';
    box.dataset.logExpanded='0';
    host.appendChild(box);
  }
  return box;
}

function _toggleAIFixLog(msgId){
  var box=_ensureAIFixProgressUI(msgId);
  if(!box) return;
  box.dataset.logExpanded = box.dataset.logExpanded==='1' ? '0' : '1';
  _renderAIFixLog(msgId, _aiFixLogs[msgId]||[]);
}

function _renderAIFixLog(msgId, lines){
  var box=_ensureAIFixProgressUI(msgId);
  if(!box) return;
  lines=Array.isArray(lines)?lines:[];
  _aiFixLogs[msgId]=lines;
  var pre=box.querySelector('.msg-ai-fix-log');
  var btn=box.querySelector('.msg-ai-fix-log-toggle');
  if(!pre||!btn) return;
  var expanded=box.dataset.logExpanded==='1';
  var limit=expanded?10:3;
  var shown=lines.slice(-limit);
  pre.textContent=shown.join('\n');
  pre.style.maxHeight=expanded?'15.5em':'4.9em';
  pre.style.overflowY=lines.length>limit?'auto':'hidden';
  if(lines.length<=3){
    btn.style.display='none';
  }else{
    btn.style.display='inline-block';
    btn.textContent=expanded?t('ai_fix_log_collapse'):t('ai_fix_log_expand');
  }
}

function _collectAIFixLogs(job, state){
  state=state||{};
  state.logs=state.logs||[];
  state._lastMsgKey=state._lastMsgKey||'';
  var phase=job.phase||'';
  var progress=(job.progress==null?0:job.progress);
  var msg=(job.message||'').trim();
  var key=phase+'|'+progress+'|'+msg;
  if(key!==state._lastMsgKey){
    state._lastMsgKey=key;
    var line=(phase?('['+phase+'] '):'')+(msg||'...');
    if(progress||progress===0) line+=' ('+progress+'%)';
    if(!state.logs.length||state.logs[state.logs.length-1]!==line){
      state.logs.push(line);
    }
  }
  var applyLogs=Array.isArray(job.apply_logs)?job.apply_logs:[];
  var startIdx=state._lastApplyLogCount||0;
  for(var i=startIdx;i<applyLogs.length;i++){
    var it=applyLogs[i]||{};
    var prefix=it.ok?'[apply-ok] ':'[apply-fail] ';
    var line=prefix+(it.cmd||'git ?');
    if(!it.ok&&it.stderr) line+=' | '+String(it.stderr).split('\n')[0];
    if(!it.ok&&!it.stderr&&it.stdout) line+=' | '+String(it.stdout).split('\n')[0];
    state.logs.push(line);
  }
  state._lastApplyLogCount=applyLogs.length;
  return state.logs;
}

function _updateAIFixProgress(msgId, percent, text){
  var box=_ensureAIFixProgressUI(msgId);
  if(!box) return;
  var p=Math.max(0,Math.min(100,parseInt(percent||0)));
  var fill=box.querySelector('.msg-ai-fix-fill');
  var txt=box.querySelector('.msg-ai-fix-text');
  var pe=box.querySelector('.msg-ai-fix-percent');
  if(fill) fill.style.width=p+'%';
  if(txt) txt.textContent=text||t('ai_fix_progress');
  if(pe) pe.textContent=p+'%';
}

function _renderAIFixPlanHtml(status){
  var commands=status.commands||[];
  var html='<div style="font-size:13px;line-height:1.7">';
  html+='<div style="margin-bottom:8px">'+escapeHtml(t('ai_fix_plan_desc'))+'</div>';
  if(status.summary){
    html+='<div style="margin-bottom:8px;padding:8px 10px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">'
      +escapeHtml(status.summary)+'</div>';
  }
  html+='<div style="max-height:260px;overflow:auto;border:1px solid #e5e7eb;border-radius:8px;background:#0f172a;color:#e2e8f0;padding:10px;font-family:monospace;font-size:12px">';
  for(var i=0;i<commands.length;i++){
    var c=commands[i]||{};
    html+='<div style="margin-bottom:9px"><div style="color:#67e8f9">$ '+escapeHtml(c.cmd||'')+'</div>';
    if(c.reason) html+='<div style="color:#94a3b8"># '+escapeHtml(c.reason)+'</div>';
    html+='</div>';
  }
  html+='</div></div>';
  return html;
}

function _finalizeAIFixWithRetry(gitOpCtx){
  showConfirmDialog({
    title:t('ai_fix_retry_title'),
    message:'<div style="font-size:14px;line-height:1.7">'+escapeHtml(t('ai_fix_retry_desc'))+'</div>',
    confirmText:t('ai_fix_retry_confirm'),
    cancelText:t('ai_fix_retry_cancel'),
    confirmClass:'btn-primary',
    onConfirm:function(){
      if(gitOpCtx&&typeof gitOpCtx.retry==='function'){
        gitOpCtx.retry();
      }else{
        addMsg(t('ai_fix_no_retry'),'info',{disableAiFix:true});
      }
    }
  });
}

function _pollAIFixStatus(jobId, msgId, gitOpCtx, state){
  state=state||{};
  fetch('/api/ai/git-autofix-status?jobId='+encodeURIComponent(jobId))
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.ok || !data.job){
        _aiFixActive=false;
        addMsg(t('ai_fix_failed')+_formatAIFixError(data),'error',{maxLines:14,gitOp:gitOpCtx||_lastGitOpCtx||null});
        return;
      }
      var job=data.job||{};
      _updateAIFixProgress(msgId, job.progress||0, job.message||t('ai_fix_progress'));
      _renderAIFixLog(msgId, _collectAIFixLogs(job, state));
      if(!job.done){
        setTimeout(function(){_pollAIFixStatus(jobId,msgId,gitOpCtx,state);},700);
        return;
      }
      if(job.phase==='await_confirm'){
        if(state.planShown) return;
        state.planShown=true;
        _aiFixActive=false;
        showConfirmDialog({
          title:t('ai_fix_plan_title'),
          message:_renderAIFixPlanHtml(job),
          confirmText:t('ai_fix_apply_confirm'),
          cancelText:t('ai_fix_apply_cancel'),
          confirmClass:'btn-warning',
          onConfirm:function(){
            _aiFixActive=true;
            _updateAIFixProgress(msgId, 8, t('ai_fix_progress'));
            fetch('/api/ai/git-autofix-apply',{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({jobId:jobId})
            }).then(function(r){return r.json();}).then(function(d){
              if(!d.ok){
                _aiFixActive=false;
                addMsg(t('ai_fix_failed')+_formatAIFixError(d),'error',{maxLines:14,gitOp:gitOpCtx||_lastGitOpCtx||null});
                return;
              }
              setTimeout(function(){_pollAIFixStatus(jobId,msgId,gitOpCtx,state);},500);
            }).catch(function(e){
              _aiFixActive=false;
              addMsg(t('network_err')+e.message,'error',{gitOp:gitOpCtx||_lastGitOpCtx||null});
            });
          },
          onCancel:function(){ addMsg(t('ai_fix_canceled'),'info',{disableAiFix:true}); }
        });
        return;
      }
      _aiFixActive=false;
      if(job.ok && job.phase==='applied'){
        _updateAIFixProgress(msgId, 100, t('ai_fix_done'));
        addMsg(t('ai_fix_done'),'success',{disableAiFix:true});
        _finalizeAIFixWithRetry(gitOpCtx);
      }else{
        addMsg(t('ai_fix_failed')+_formatAIFixError(job),'error',{maxLines:14,gitOp:gitOpCtx||_lastGitOpCtx||null});
      }
    })
    .catch(function(e){
      _aiFixActive=false;
      addMsg(t('network_err')+e.message,'error',{gitOp:gitOpCtx||_lastGitOpCtx||null});
    });
}

function _startAIFixFlow(errorText, gitOpCtx){
  if(_aiFixActive) return;
  var cfg=_getAICfgSafe();
  var cfgErr=_validateAIFixConfig(cfg);
  if(cfgErr){
    addMsg(t('ai_fix_failed')+cfgErr,'error',{maxLines:8,gitOp:gitOpCtx||_lastGitOpCtx||null});
    return;
  }
  _aiFixActive=true;
  var opName=(gitOpCtx&&gitOpCtx.name)||'git-operation';
  var msgId=addMsg('🤖 '+t('ai_fix_starting'),'success',{disableAiFix:true});
  _updateAIFixProgress(msgId, 3, t('ai_fix_starting'));
  fetch('/api/ai/git-autofix-start',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      provider:cfg.provider,
      api_key:cfg.api_key||'',
      base_url:cfg.base_url||'',
      model:cfg.model||'',
      lang:L||'en',
      operation:opName,
      error:errorText||''
    })
  }).then(function(r){return r.json();}).then(function(data){
    if(!data.ok||!data.jobId){
      _aiFixActive=false;
      addMsg(t('ai_fix_failed')+_formatAIFixError(data),'error',{maxLines:14,gitOp:gitOpCtx||_lastGitOpCtx||null});
      return;
    }
    _pollAIFixStatus(data.jobId,msgId,gitOpCtx||null,{planShown:false});
  }).catch(function(e){
    _aiFixActive=false;
    addMsg(t('network_err')+e.message,'error',{disableAiFix:true});
  });
}

function toggleHelp(id) {
  var el=document.getElementById(id);
  el.classList.toggle('show');
}

function switchPage(name) {
  var pages=document.querySelectorAll('.page');
  for(var i=0;i<pages.length;i++)pages[i].classList.remove('active');
  var target=document.getElementById('page-'+name);
  if(target)target.classList.add('active');
  var tabs=document.querySelectorAll('.btn-tab');
  for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('active');
  var tabMap={main:'commit',branches:'branches',stash:'stash',conflicts:'conflicts',log:'log',prs:'prs',msglog:'log',restore:'log'};
  var tabId='tab-'+(tabMap[name]||name);
  var activeTab=document.getElementById(tabId);
  if(activeTab)activeTab.classList.add('active');
  var graphBtn = document.getElementById('btn-graph-toggle');
  var graphPanel = document.getElementById('graph-panel');
  if (graphBtn && graphPanel && graphPanel.classList.contains('open')) graphBtn.classList.add('active');
  if(name==='main'){ loadFiles(); _startFilesPoller(); } else { _stopFilesPoller(); }
  // Persist tab so refresh restores same page
  try{localStorage.setItem('git_tool_active_tab',name);}catch(e){}
}

function apiGet(path,cb,opts){
  if(!opts||!opts.silent)_showSpinner();
  fetch(API_BASE+path).then(function(r){return r.json()}).then(function(d){if(!opts||!opts.silent)_hideSpinner();cb(d)}).catch(function(e){if(!opts||!opts.silent)_hideSpinner();addMsg(t('network_err')+e.message,'error')})
}
function apiPost(path,body,cb){
  _showSpinner();
  fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){return r.json()}).then(function(d){_hideSpinner();cb(d)}).catch(function(e){_hideSpinner();addMsg(t('network_err')+e.message,'error')});
}

// ═══════════ Diff highlight ═══════════
function highlightDiff(text) {
  if(!text)return'';
  var lines=text.split('\n');
  var html='<table class="diff-table"><tbody>';
  for(var i=0;i<lines.length;i++){
    var line=lines[i],cls='diff-content',prefix='';
    var escaped=escapeHtml(line);
    if(line.charAt(0)==='+'){cls+=' diff-add';prefix='+'}
    else if(line.charAt(0)==='-'){cls+=' diff-rem';prefix='-'}
    else if(line.charAt(0)==='\\'||/^(diff|index|@@) /.test(line)){cls+=' diff-meta'}
    html+='<tr><td class="diff-prefix">'+prefix+'</td><td class="'+cls+'">'+escaped+'</td></tr>';
  }
  html+='</tbody></table>';
  return html;
}

// ═══════════ Main page ═══════════
function renderFiles(files) {
  var list=document.getElementById('file-list');
  var allBar=document.getElementById('select-all-bar');
  if(!files.length){
    list.innerHTML='<div class="empty">🎉 '+t('no_files')+'</div>';
    document.getElementById('toolbar').style.display='none';
    allBar.style.display='none';
    return;
  }
  document.getElementById('toolbar').style.display='flex';
  allBar.style.display='block';
  var allCb=document.getElementById('select-all-cb');
  var allChecked=files.every(function(f){return checkedPaths[f.path]});
  allCb.checked=allChecked;
  var html='';
  files.forEach(function(f,idx){
    var safePath=escapeHtml(f.path),attrPath=escapeAttr(f.path);
    var diffHtml=highlightDiff(f.diff);
    var checked=checkedPaths[f.path]?' checked':'';
    var expanded=expandedPaths[f.path];
    var toggleCls=expanded?' file-toggle open':' file-toggle';
    var bodyCls=expanded?' file-body expanded':' file-body';
    var lineCount=f.diff?f.diff.split('\n').length:0;
    var isLargeDiff = lineCount > 80;
    html+='<div class="file-card" data-index="'+idx+'"><div class="file-header">';
    html+='<span class="cb-wrap"><input type="checkbox" data-path="'+attrPath+'" class="file-cb"'+checked+'></span>';
    html+='<span class="'+toggleCls+'">▶</span>';
    html+='<span class="file-path">'+safePath+'</span>';
    html+='<span style="color:#9ca3af;font-size:12px">('+lineCount+' '+t('lines')+')</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();ignoreFile(\''+attrPath+'\')" title="Discard changes for this file">Ignore</button>';
    html+='</div>';
    if(diffHtml){
      var blockId='diff-block-'+idx;
      html+='<div class="'+bodyCls+'">';
      html+='<div class="diff-block" id="'+blockId+'">'+diffHtml+'</div>';
      if(isLargeDiff){
        html+='<div style="text-align:center;padding:4px 0 8px">'
          +'<button class="btn btn-sm btn-secondary" style="font-size:11px" onclick="toggleDiffExpand(\''+blockId+'\',this)">⇕ Show full diff ('+lineCount+' lines)</button>'
          +'</div>';
      }
      html+='</div>';
    }
    html+='</div>';
  });
  list.innerHTML=html;
}

var _filesPollInterval = (function() {
  try { var v = parseFloat(localStorage.getItem('git_poll_interval')); if (v >= 0) return v * 1000; } catch(e) {}
  return 2500; // default 2.5s
})();

var _filesPollTimer = null;
var _filesLastJson = '';

function loadFiles(silent){
  apiGet('/api/files', function(data) {
    var json = JSON.stringify(data.files);
    if (json !== _filesLastJson) {
      _filesLastJson = json;
      renderFiles(data.files);
    }
  }, silent ? {silent:true} : null);
}

function _startFilesPoller() {
  _stopFilesPoller();
  if (_filesPollInterval <= 0) return; // disabled
  _filesPollTimer = setInterval(function() {
    var page = document.getElementById('page-main');
    if (page && page.classList.contains('active') && !document.hidden) {
      loadFiles(true); // silent: no spinner on auto-refresh
    }
  }, _filesPollInterval);
}

function _stopFilesPoller() {
  if (_filesPollTimer) { clearInterval(_filesPollTimer); _filesPollTimer = null; }
}

// Start polling when page is visible, pause when hidden (saves requests)
document.addEventListener('visibilitychange', function() {
  var page = document.getElementById('page-main');
  if (page && page.classList.contains('active')) {
    document.hidden ? _stopFilesPoller() : _startFilesPoller();
  }
});

function toggleDiffExpand(blockId, btn) {
  var block = document.getElementById(blockId);
  if (!block) return;
  var expanded = block.classList.toggle('expanded-full');
  btn.textContent = expanded ? '⇕ Collapse diff' : '⇕ Show full diff';
}

function ignoreFile(filePath){
  showModal(
    '🚫 Add to .gitignore?',
    '<b>'+escapeHtml(filePath)+'</b> will be added to <code>.gitignore</code>.<br><br>'
    +'Git will stop tracking this file/directory. It will disappear from the change list.<br>'
    +'<span style="font-size:12px;color:#6b7280">You can remove it from gitignore later via the 📋 Gitignore button.</span>',
    'Ignore',
    function(){
      apiPost('/api/ignore',{path:filePath},function(data){
        if(data.ok){addMsg('🚫 Ignored: '+filePath,'success');loadFiles();}
        else addMsg('Ignore failed: '+(data.error||''),'error');
      });
    }
  );
}

function loadIgnored(){
  apiGet('/api/ignored-list',function(data){
    var entries=data.entries||[];
    var html='';
    if(!entries.length){
      html='<div style="color:#6b7280;padding:12px 0;text-align:center">No entries in .gitignore yet.</div>';
    }else{
      html='<div style="font-size:12px;color:#6b7280;margin-bottom:8px">'
        +entries.length+' entries in <code>.gitignore</code></div>'
        +'<div style="max-height:320px;overflow-y:auto">';
      entries.forEach(function(e){
        html+='<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:6px;background:#f9fafb;margin-bottom:4px">'
          +'<span style="flex:1;font-family:monospace;font-size:13px;color:#374151">'+escapeHtml(e)+'</span>'
          +'<button class="btn btn-sm" style="background:#22c55e;color:#fff;border:none;border-radius:6px;padding:3px 10px;font-size:12px;cursor:pointer" '
          +'onclick="unignoreEntry(\''+escapeAttr(e)+'\')">+ Re-add</button>'
          +'</div>';
      });
      html+='</div>';
    }
    showModal('📋 .gitignore Entries', html, 'Close', null);
  });
}

function unignoreEntry(entry){
  apiPost('/api/unignore',{entry:entry},function(data){
    if(data.ok){
      addMsg('✅ Removed from .gitignore: '+entry,'success');
      closeModal();
      setTimeout(loadIgnored, 100);
      loadFiles();
    }else{
      addMsg('Failed to remove: '+(data.error||''),'error');
    }
  });
}
function loadCurrentBranch(){apiGet('/api/current-branch',function(data){
  var el = document.getElementById('branch-name');
  if (el) el.textContent = data.branch;
})}

function loadProjectName(){
  apiGet('/api/project-name',function(data){
    var nameEl=document.getElementById('project-banner-name');
    var remoteEl=document.getElementById('project-banner-remote');
    if(nameEl) nameEl.textContent=data.dir||'Unknown Project';
    if(remoteEl){
      if(data.remote) remoteEl.textContent='⎇  '+data.remote;
      else remoteEl.textContent='';
    }
    // Update top-right app title from config
    var titleName=document.getElementById('app-title-name');
    var titleVer=document.getElementById('app-title-version');
    if(titleName&&data.app_name) titleName.textContent=data.app_name;
    if(titleVer&&data.app_version) titleVer.textContent=data.app_version;
  });
}

// ═══════════ Project Switcher ═══════════
var PROJECT_HISTORY_KEY = 'git-projects-history';

function _getProjectHistory(){
  try { return JSON.parse(localStorage.getItem(PROJECT_HISTORY_KEY)||'[]'); } catch(e) { return []; }
}
function _saveProjectHistory(list){
  try { localStorage.setItem(PROJECT_HISTORY_KEY, JSON.stringify(list)); } catch(e) {}
}

function toggleProjectSwitcher(){
  var popup = document.getElementById('project-switcher-popup');
  if (!popup) return;
  if (popup.style.display === 'none' || !popup.style.display){
    var btn = document.querySelector('.project-switcher-btn');
    if (btn) {
      var rect = btn.getBoundingClientRect();
      popup.style.top = (rect.bottom + 8) + 'px';
      popup.style.left = Math.max(8, rect.left) + 'px';
    }
    popup.style.display = 'block';
    _renderProjectSwitcher();
  } else {
    popup.style.display = 'none';
  }
}

function _renderProjectSwitcher(){
  apiGet('/api/project-path', function(d){
    if (d && d.path) {
      document.getElementById('psp-current-path').textContent = d.path;
    }
  });
  var hist = _getProjectHistory();
  // Normalize and deduplicate
  var seen = {}, clean = [];
  for (var i = 0; i < hist.length; i++) {
    if (typeof hist[i] === 'string') hist[i] = {path: hist[i], ts: 0};
    if (!seen[hist[i].path]) {
      seen[hist[i].path] = true;
      clean.push(hist[i]);
    }
  }
  if (clean.length !== hist.length) _saveProjectHistory(clean);
  hist = clean;
  var histEl = document.getElementById('psp-history');
  if (!hist.length) {
    histEl.innerHTML = '<div style="font-size:12px;color:#9ca3af;text-align:center;padding:20px 0">No project history yet — click Browse to add</div>';
    return;
  }
  var html = '<div class="psp-history-label">Recent Projects</div>';
  hist.forEach(function(entry, i){
    var path = typeof entry === 'string' ? entry : entry.path;
    var ts = typeof entry === 'string' ? 0 : (entry.ts || 0);
    var timeStr = ts ? new Date(ts).toLocaleString() : '';
    html += '<div class="psp-hist-item" onclick="switchToProject(\'' + escapeJS(path) + '\')">';
    html += '<span class="psp-hist-item-icon">📁</span>';
    html += '<span class="psp-hist-item-info">';
    html += '<div class="psp-hist-item-path">' + escapeHtml(path) + '</div>';
    if (timeStr) html += '<div class="psp-hist-item-time">Last opened: ' + timeStr + '</div>';
    html += '</span>';
    html += '<button class="psp-hist-item-del" onclick="event.stopPropagation();removeProjectHistory(' + i + ')" title="Remove">✕</button>';
    html += '</div>';
  });
  histEl.innerHTML = html;
}

function addToProjectHistory(path){
  var hist = _getProjectHistory();
  // Normalize old format entries
  for (var i = 0; i < hist.length; i++) {
    if (typeof hist[i] === 'string') hist[i] = {path: hist[i], ts: 0};
  }
  // Deduplicate — remove existing entry for this path
  hist = hist.filter(function(e){ return e.path !== path; });
  // Add to front
  hist.unshift({path: path, ts: Date.now()});
  // Keep max 15
  if (hist.length > 15) hist.pop();
  _saveProjectHistory(hist);
}

function removeProjectHistory(i){
  var hist = _getProjectHistory();
  hist.splice(i, 1);
  _saveProjectHistory(hist);
  _renderProjectSwitcher();
}

function switchToProject(path){
  var popup = document.getElementById('project-switcher-popup');
  if (popup) popup.style.display = 'none';
  _showSpinner('Switching project...');
  fetch(API_BASE+'/api/switch-project',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:path})})
    .then(function(r){return r.json()})
    .then(function(d){
      _hideSpinner();
      if (d.ok) {
        addToProjectHistory(d.path);
        setTimeout(function(){ window.location.reload(); }, 300);
      } else {
        addMsg('❌ Project switch failed: ' + (d.error||'unknown'), 'error');
      }
    })
    .catch(function(e){
      _hideSpinner();
      addMsg('❌ Project switch failed: ' + (e.message||'network error'), 'error');
    });
}

function browseProjectFolder(){
  _showSpinner('Opening folder picker…');
  fetch(API_BASE+'/api/browse-project', {method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})
    .then(function(r){return r.json()})
    .then(function(d){
      _hideSpinner();
      if (d.path) {
        switchToProject(d.path);
      }
    })
    .catch(function(){ _hideSpinner(); });
}

// Close popup on outside click
document.addEventListener('click', function(e){
  var popup = document.getElementById('project-switcher-popup');
  var btn = document.querySelector('.project-switcher-btn');
  if (popup && popup.style.display !== 'none' && !popup.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
    popup.style.display = 'none';
  }
  // Also close worktree popup on outside click
  var wtp = document.getElementById('worktree-popup');
  var wtpBtn = document.getElementById('tab-worktree');
  if (wtp && wtp.style.display !== 'none' && !wtp.contains(e.target) && e.target !== wtpBtn && !wtpBtn.contains(e.target)) {
    wtp.style.display = 'none';
  }
});

// ── Worktree Management ──────────────────────────────────────────────────

function _renderHelpPanel(){
  var panel = document.getElementById('wtp-help-panel');
  if (panel._rendered) return;
  panel._rendered = true;
  var html = '<b>' + t('wtp_help_title') + '</b><br>' +
    t('wtp_help_intro') + '<br><br>' +
    '<b>' + t('wtp_help_uses_title') + '</b>' +
    '<ul><li>' + t('wtp_help_use_1') + '</li>' +
    '<li>' + t('wtp_help_use_2') + '</li>' +
    '<li>' + t('wtp_help_use_3') + '</li>' +
    '<li>' + t('wtp_help_use_4') + '</li></ul>' +
    '<b>' + t('wtp_help_note') + '</b>';
  panel.innerHTML = html;
}

function toggleWorktreePopup(){
  var popup = document.getElementById('worktree-popup');
  if (!popup) return;
  if (popup.style.display === 'none' || !popup.style.display){
    var btn = document.getElementById('tab-worktree');
    if (btn) {
      var rect = btn.getBoundingClientRect();
      var popupH = Math.min(530, window.innerHeight * 0.85);
      var spaceBelow = window.innerHeight - rect.bottom - 16;
      if (spaceBelow < 280) {
        popup.style.top = Math.max(8, rect.top - popupH - 8) + 'px';
        popup.style.maxHeight = Math.min(popupH, rect.top - 16) + 'px';
      } else {
        popup.style.top = (rect.bottom + 8) + 'px';
        popup.style.maxHeight = Math.min(popupH, spaceBelow) + 'px';
      }
      popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 546)) + 'px';
    }
    popup.style.display = 'block';
    document.getElementById('wtp-help-panel').classList.remove('show');
    _loadWorktreeList();
  } else {
    popup.style.display = 'none';
  }
}

function toggleWorktreeHelp(){
  var panel = document.getElementById('wtp-help-panel');
  _renderHelpPanel();
  panel.classList.toggle('show');
}

function _loadWorktreeList(){
  var listEl = document.getElementById('wtp-list');
  listEl.innerHTML = '<div class="loading-bar"><span class="spinner"></span>' + t('wtp_loading') + '</div>';
  apiGet('/api/worktrees', function(d){
    if (!d || !d.ok) {
      listEl.innerHTML = '<div class="wtp-empty">' + t('wtp_load_fail') + '</div>';
      return;
    }
    _renderWorktreeList(d.worktrees || []);
  });
}

function _renderWorktreeList(worktrees){
  var listEl = document.getElementById('wtp-list');
  if (!worktrees.length) {
    listEl.innerHTML = '<div class="wtp-empty">' + t('wtp_empty') + '</div>';
    return;
  }
  var html = '';
  worktrees.forEach(function(wt){
    var isCurrent = wt.is_current;
    var itemClass = isCurrent ? 'wtp-item wtp-item--current' : 'wtp-item';
    var branchDisplay = wt.branch ? wt.branch.replace('refs/heads/', '') : (wt.detached ? t('wtp_detached_head') : t('wtp_bare'));
    var shortPath = wt.path;
    var parts = wt.path.split('/');
    if (parts.length > 3) shortPath = '…/' + parts.slice(-2).join('/');
    
    html += '<div class="' + itemClass + '">';
    html += '<span class="wtp-item-icon">' + (isCurrent ? '📍' : '🌿') + '</span>';
    html += '<div class="wtp-item-info">';
    html += '<div class="wtp-item-branch">' + escapeHtml(branchDisplay);
    if (isCurrent) html += '<span class="wtp-item-tag wtp-item-tag--current">' + t('wtp_tag_current') + '</span>';
    else if (wt.detached) html += '<span class="wtp-item-tag wtp-item-tag--detached">' + t('wtp_tag_detached') + '</span>';
    if (wt.is_main) html += '<span class="wtp-item-tag wtp-item-tag--main">' + t('wtp_tag_main') + '</span>';
    html += '</div>';
    html += '<div class="wtp-item-path" title="' + escapeHtml(wt.path) + '">' + escapeHtml(shortPath) + '</div>';
    html += '</div>';
    html += '<div class="wtp-item-actions">';
    if (!isCurrent) {
      html += '<button class="wtp-btn wtp-btn-switch" onclick="switchToWorktree(\'' + escapeJS(wt.path) + '\')">' + t('wtp_switch_btn') + '</button>';
    } else {
      html += '<span style="font-size:10px;color:#22c55e;font-weight:700;padding:4px 8px">' + t('wtp_active_label') + '</span>';
    }
    if (!isCurrent && !wt.is_main) {
      html += '<button class="wtp-btn wtp-btn-delete" onclick="removeWorktree(\'' + escapeJS(wt.path) + '\')">🗑</button>';
    }
    html += '</div>';
    html += '</div>';
  });
  listEl.innerHTML = html;
  
  var occupied = [];
  worktrees.forEach(function(wt){
    if (wt.branch) occupied.push(wt.branch.replace('refs/heads/', ''));
  });
  var hintEl = document.getElementById('wtp-occupied-hint');
  if (occupied.length && hintEl) {
    hintEl.style.display = 'block';
    hintEl.innerHTML = t('wtp_occupied_prefix') + '<b>' + occupied.join(', ') + '</b>';
  } else if (hintEl) {
    hintEl.style.display = 'none';
  }
  
  var currentWt = null;
  for (var i = 0; i < worktrees.length; i++) {
    if (worktrees[i].is_current) { currentWt = worktrees[i]; break; }
  }
  var label = document.getElementById('worktree-btn-label');
  if (label && currentWt && currentWt.branch) {
    var shortBranch = currentWt.branch.replace('refs/heads/', '');
    label.textContent = '🌲 ' + (shortBranch.length > 16 ? shortBranch.substring(0,15) + '…' : shortBranch);
  } else if (label) {
    label.textContent = t('wtp_btn_label');
  }
}

function createWorktree(){
  var branch = document.getElementById('wtp-branch-input').value.trim();
  var path = document.getElementById('wtp-path-input').value.trim();
  if (!branch) { showToast(t('wtp_enter_branch'), 'error', 3000); return; }
  if (!path) { showToast(t('wtp_enter_path'), 'error', 3000); return; }
  
  var occupiedHint = document.getElementById('wtp-occupied-hint');
  if (occupiedHint && occupiedHint.style.display !== 'none') {
    var text = occupiedHint.textContent || '';
    var prefix = t('wtp_occupied_prefix').replace(/<[^>]*>/g, '');
    var branches = text.replace(prefix, '').split(',').map(function(s){return s.trim();});
    if (branches.indexOf(branch) >= 0) {
      showToast(tf('wtp_branch_occupied', null, {branch: branch}), 'error', 5000);
      return;
    }
  }
  
  _showSpinner(t('wtp_creating'));
  apiPost('/api/worktree-add', {branch: branch, path: path}, function(d){
    _hideSpinner();
    if (d.ok) {
      showToast(t('wtp_created'));
      document.getElementById('wtp-branch-input').value = '';
      document.getElementById('wtp-path-input').value = '';
      _loadWorktreeList();
    } else {
      showToast(t('wtp_create_failed') + (d.error || 'unknown'), 'error', 5000);
    }
  });
}

function switchToWorktree(path){
  var popup = document.getElementById('worktree-popup');
  if (popup) popup.style.display = 'none';
  _showSpinner(t('wtp_switching'));
  apiPost('/api/worktree-switch', {path: path}, function(d){
    _hideSpinner();
    if (d.ok) {
      setTimeout(function(){ window.location.reload(); }, 300);
    } else {
      showToast(t('wtp_switch_failed') + (d.error || 'unknown'), 'error', 5000);
    }
  });
}

function removeWorktree(path){
  _doRemoveWorktree(path, false);
}

function _doRemoveWorktree(path, force){
  showModal(
    force ? t('wtp_force_remove_title') : t('wtp_remove_title'),
    force ? tf('wtp_force_remove_desc', null, {path: escapeHtml(path)}) : tf('wtp_remove_desc', null, {path: escapeHtml(path)}),
    force ? t('wtp_force_remove_btn') : t('wtp_remove_btn'),
    function(){
      _showSpinner(t('wtp_removing'));
      var body = {path: path};
      if (force) body.force = true;
      apiPost('/api/worktree-remove', body, function(d){
        _hideSpinner();
        if (d.ok) {
          showToast(t('wtp_removed'));
          _loadWorktreeList();
        } else {
          var err = d.error || '';
          if (!force && (err.indexOf('modified or untracked') >= 0 || err.indexOf('--force') >= 0)) {
            _doRemoveWorktree(path, true);
          } else {
            showToast(t('wtp_remove_failed') + (d.error || 'unknown'), 'error', 5000);
          }
        }
      });
    }
  );
}

function loadWorktreeLabel(){
  apiGet('/api/worktrees', function(d){
    if (d && d.ok && d.worktrees) {
      _renderWorktreeList(d.worktrees);
    }
  });
}

function _updateConflictTabBadge(count){
  var tab=document.getElementById('tab-conflicts');
  if(!tab) return;
  if(count>0){
    tab.textContent='Conflicts ('+count+')';
    tab.style.background='#fee2e2';tab.style.color='#991b1b';
  }else{
    tab.textContent='Conflicts';
    tab.style.background='';tab.style.color='';
  }
}
function checkConflicts(){
  fetch(API_BASE+'/api/conflicts',{cache:'no-store'})
    .then(function(r){return r.json();})
    .then(function(data){ _updateConflictTabBadge(data.count||0); })
    .catch(function(){});
}

// Captures the latest successful rebase context so push-failure flows can
// offer a one-click "reset to rebase base + keep HEAD + force push" recovery.
var _lastRebaseForcePushContext = null;

// ═══════════ Pull + Fetch ═══════════
function doPush(credentials, force, remoteBranch){
  _rememberGitOp('push', function(){ doPush(null, !!force, remoteBranch); });
  var gpgToggle = document.getElementById('gpg-sign-toggle');
  var gpgEnabled = gpgToggle && gpgToggle.checked;

  // If GPG signing is enabled, check for unsigned commits before pushing
  if (gpgEnabled && !doPush._skipResignCheck) {
    // Detect the actual base branch first — never hard-code 'develop'
    apiPost('/api/detect-base', {}, function(baseData) {
      var detectedBase = (baseData && baseData.base) || 'origin/develop';
      apiGet('/api/unsigned-commits?base=' + encodeURIComponent(detectedBase), function(info) {
        if (info.has_unsigned) {
          showModalDouble(
            '🔏 Unsigned Commits Detected',
            'Found <b>' + info.unsigned_count + '</b> unsigned commit(s) out of ' + info.total_count + ' on this branch.<br><br>' +
            'Re-sign all commits with GPG before pushing?<br>' +
            '<span style="font-size:12px;color:#6b7280">(Base detected: <code>' + escapeHtml(detectedBase) + '</code>)</span>',
            '🔏 Re-sign & Push',
            function() {
              addMsg('🔏 Re-signing commits...', 'info');
              apiPost('/api/resign-commits', {base: detectedBase}, function(d) {
                if (d.ok) {
                  addMsg('✅ ' + d.message, 'success');
                  // Now force push since rebase rewrites history
                  doPush._skipResignCheck = true;
                  doPush(credentials, true, remoteBranch);
                  doPush._skipResignCheck = false;
                } else {
                  var resignErr = (d && d.error) || '';
                  addMsg('❌ Re-sign failed: ' + resignErr, 'error');
                  var canAutoFix = /cannot rebase:\s*You have unstaged changes/i.test(resignErr) ||
                                   /Please commit or stash them/i.test(resignErr);
                  if (canAutoFix) {
                    showModalDouble(
                      '🧹 Auto Fix Re-sign Failure',
                      'Detected local changes blocking rebase.<br><br>' +
                      'Run <b>auto stash + re-sign</b>, then push immediately?',
                      '🧹 Auto Fix & Push',
                      function() {
                        addMsg('🧹 Auto-fixing and re-signing commits...', 'info');
                        apiPost('/api/resign-commits-autofix', {base: detectedBase}, function(fix) {
                          if (fix.ok) {
                            addMsg('✅ ' + fix.message, 'success');
                            doPush._skipResignCheck = true;
                            doPush(credentials, true, remoteBranch);
                            doPush._skipResignCheck = false;
                          } else {
                            addMsg('❌ Auto-fix failed: ' + ((fix && fix.error) || ''), 'error');
                          }
                        });
                      },
                      'Close',
                      function() {},
                      'btn-primary',
                      'btn-secondary'
                    );
                  }
                }
              });
            },
            'Skip & Push Anyway',
            function() {
              doPush._skipResignCheck = true;
              doPush(credentials, force, remoteBranch);
              doPush._skipResignCheck = false;
            },
            'btn-primary',
            'btn-secondary'
          );
        } else {
          // All signed, proceed normally
          doPush._skipResignCheck = true;
          doPush(credentials, force, remoteBranch);
          doPush._skipResignCheck = false;
        }
      });
    });
    return;
  }

  var branchEl=document.getElementById('branch-name');
  var branch=(branchEl&&branchEl.textContent)||'?';
  var body=credentials||{};
  if(force) body.force=true;
  if(remoteBranch && remoteBranch !== branch) body.remote_branch=remoteBranch;
  var effectiveRemote=remoteBranch||branch;
  var logDivId='push-log-live';
  var pushLabel=force?'🚀 Force Pushing':'🚀 Pushing';
  var pushDesc=force?'force push (--force-with-lease) to':'push to';

  // Build live log modal
  var logBox='<div id="'+logDivId+'" style="'
    +'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.5;'
    +'padding:12px 14px;border-radius:8px;min-height:140px;max-height:340px;'
    +'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    +'<span style="color:#94a3b8">⏳ Starting '+pushDesc+' origin/'+escapeHtml(effectiveRemote)+'...\n</span></div>';
  showModal(pushLabel+' — <span style="font-size:12px;font-weight:400;color:#94a3b8">origin/'+escapeHtml(effectiveRemote)+'</span>',
    logBox, 'Please wait…', null);
  // Disable close until done
  var closeBtn=document.querySelector('#modal-btns .btn-warning');
  if(closeBtn){closeBtn.disabled=true;closeBtn.style.opacity='0.4';}

  apiPost('/api/push',body,function(data){
    var ld=document.getElementById(logDivId);
    if(!data||!data.jobId){
      if(ld) ld.innerHTML+='<span style="color:#f87171">❌ Failed to start push: '
        +escapeHtml((data&&data.error)||'unknown error')+'</span>\n';
      var cb=document.querySelector('#modal-btns .btn-warning');
      if(cb){cb.disabled=false;cb.style.opacity='';cb.textContent='Close';cb.onclick=closeModal;}
      return;
    }
    var jobId=data.jobId;
    var seenLines=0;
    function poll(){
      var xhr=new XMLHttpRequest();
      xhr.open('GET','/api/push-status?jobId='+encodeURIComponent(jobId));
      xhr.onload=function(){
        var r;
        try{r=JSON.parse(xhr.responseText);}catch(e){setTimeout(poll,600);return;}
        var ld2=document.getElementById(logDivId);
        if(ld2 && r.lines && r.lines.length>seenLines){
          for(var i=seenLines;i<r.lines.length;i++){
            var line=r.lines[i];
            // Colour certain lines
            var col='#e2e8f0';
            var lineBody=line.replace(/^\[\d{2}:\d{2}:\d{2}\] /,''); // strip timestamp for matching
            if(/^─+$/.test(line)) col='#334155';
            else if(/^(error:|fatal:|ERROR:)|\btimed out\b/i.test(lineBody)) col='#f87171';
            else if(/Create a pull request|\[new branch\]|updating local tracking ref/i.test(lineBody)) col='#4ade80';
            else if(/^remote:|^To /i.test(lineBody)) col='#67e8f9';
            else if(/^\$/.test(lineBody)) col='#fbbf24';
            else if(/writing objects|compressing|counting|enumerating/i.test(lineBody)) col='#a5f3fc';
            else if(/Still waiting|⏳/.test(lineBody)) col='#94a3b8';
            else if(/^📦|^🌿|^🚀|^⚠️|^ℹ️/.test(lineBody)) col='#c4b5fd';
            else if(/^\[/.test(line)) col='#94a3b8'; // timestamp prefix dimmed
            ld2.innerHTML+='<span style="color:'+col+'">'+escapeHtml(line)+'</span>\n';
          }
          seenLines=r.lines.length;
          ld2.scrollTop=ld2.scrollHeight;
        }
        if(r.done){
          var ld3=document.getElementById(logDivId);
          if(r.ok){
            if(ld3) ld3.innerHTML+='<span style="color:#4ade80;font-weight:700">✅ Push succeeded!\n</span>';
            addMsg('✅ Push OK','success');
            // Reload log and branch so commit history reflects force-push/rewrite
            _reloadLog(1); loadCurrentBranch();
            // Re-enable close button
            var cbOk=document.querySelector('#modal-btns .btn-warning');
            if(cbOk){cbOk.disabled=false;cbOk.style.opacity='';cbOk.textContent='Close';cbOk.onclick=closeModal;}
          } else if(r.authRequired){
            if(ld3) ld3.innerHTML+='<span style="color:#fbbf24;font-weight:600">\n⚠️ HTTPS authentication failed.\n</span>';
            // Replace modal buttons with action options
            var btnsDiv=document.getElementById('modal-btns');
            btnsDiv.innerHTML='';
            var sshBtn=document.createElement('button');
            sshBtn.className='btn btn-success';
            sshBtn.textContent='🔑 Switch to SSH & Retry';
            sshBtn.onclick=function(){
              sshBtn.disabled=true; sshBtn.textContent='Switching...';
              var ld4=document.getElementById(logDivId);
              if(ld4) ld4.innerHTML+='<span style="color:#94a3b8">⏳ Switching remote to SSH...\n</span>';
              apiPost('/api/switch-remote-ssh',{},function(d){
                if(d.ok){
                  if(ld4) ld4.innerHTML+='<span style="color:#4ade80">✅ Remote switched to: '+escapeHtml(d.newUrl)+'\n🔄 Retrying push...\n</span>';
                  closeModal();
                  setTimeout(function(){ doPush(); },300);
                }else{
                  if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Switch failed: '+escapeHtml(d.error||'')+'</span>\n';
                  sshBtn.disabled=false; sshBtn.textContent='🔑 Switch to SSH & Retry';
                }
              });
            };
            var credBtn=document.createElement('button');
            credBtn.className='btn btn-primary';
            credBtn.textContent='🔐 Enter Credentials';
            credBtn.onclick=function(){ closeModal(); _showPushAuthModal(branch); };
            var clsBtn=document.createElement('button');
            clsBtn.className='btn btn-secondary';
            clsBtn.textContent='Close';
            clsBtn.onclick=closeModal;
            btnsDiv.appendChild(clsBtn);
            btnsDiv.appendChild(credBtn);
            btnsDiv.appendChild(sshBtn);
            return;
          } else {
            var combinedLog=(r.lines||[]).join('\n');
            var isRejectedFetchFirst=/rejected/.test(combinedLog)&&/fetch first/.test(combinedLog);
            var isNonFastForward=/rejected/.test(combinedLog)&&/non-fast-forward/.test(combinedLog);
            var isAnyRejected=isRejectedFetchFirst||isNonFastForward;
            if(ld3) ld3.innerHTML+='<span style="color:#f87171;font-weight:700">\n❌ Push failed!\n</span>';
            addMsg('❌ Push failed','error');
            // Replace modal buttons with context-aware actions
            var btnsDiv2=document.getElementById('modal-btns');
            btnsDiv2.innerHTML='';
            var clsBtn2=document.createElement('button');
            clsBtn2.className='btn btn-secondary';clsBtn2.textContent='Close';clsBtn2.onclick=closeModal;
            btnsDiv2.appendChild(clsBtn2);
            if(isAnyRejected){
              // Detect whether the non-fast-forward is because we just rebased
              var justRebased = isNonFastForward && !isRejectedFetchFirst &&
                                _lastRebaseForcePushContext &&
                                _lastRebaseForcePushContext.branch === branch;

              // Default hint; will be overwritten by diverge-status check below
              var hintMsgId = 'push-fail-hint-'+Date.now();
              var hintHtml = justRebased
                ? '<span style="color:#fbbf24">💡 Rebase rewrites commit history — Force Push is required.\n   Pulling would create duplicate commits. Do NOT pull.\n</span>'
                : '<span style="color:#94a3b8" id="'+hintMsgId+'">🔍 Checking branch status...\n</span>';
              if(ld3) ld3.innerHTML+=hintHtml;

              // Pull & Retry — hidden/secondary when we just rebased (may be updated below)
              var pullRetryBtn=document.createElement('button');
              pullRetryBtn.className= justRebased ? 'btn btn-secondary' : 'btn btn-success';
              pullRetryBtn.textContent='⬇️ Pull & Retry Push';
              if(justRebased){
                pullRetryBtn.title=(L==='zh')
                  ?'Rebase 后不应该 Pull，这会产生重复 commit。请使用 Force Push。'
                  :'After a rebase you should NOT pull — it creates duplicate commits. Use Force Push instead.';
              }

              // Async diverge check — update hint + button styles when result arrives
              if(!justRebased && isNonFastForward){
                apiPost('/api/branch-diverge-status', {remote_branch: effectiveRemote !== branch ? effectiveRemote : null}, function(ds){
                  var hintEl = document.getElementById(hintMsgId);
                  if(!hintEl || !ds) return;
                  if(ds.diverged){
                    // Local was rewritten (rebase/resign) — force push is the answer
                    hintEl.style.color='#fbbf24';
                    hintEl.textContent='💡 Branch is diverged: local has '+(ds.ahead||0)+' commit(s) remote doesn\'t, remote has '+(ds.behind||0)+' the local doesn\'t.\n'
                      +'   This typically means a rebase or resign changed local history. Force Push to update remote.\n'
                      +(ds.ownCommits > 0 ? '   ✅ You have '+ds.ownCommits+' signed commit(s) of your own ready to push.\n' : '');
                    // Promote Force Push, demote Pull
                    forceBtn.className='btn btn-warning';
                    forceBtn.textContent=(L==='zh')?'🚀 Force Push（推荐）':'🚀 Force Push (recommended)';
                    pullRetryBtn.className='btn btn-secondary';
                    pullRetryBtn.title=(L==='zh')
                      ?'分支已分叉，Pull 会产生重复 commit，请使用 Force Push。'
                      :'Branch is diverged — pulling creates duplicate commits. Use Force Push instead.';
                    // Re-order buttons: force first
                    var parent = forceBtn.parentNode;
                    if(parent){ parent.removeChild(forceBtn); parent.insertBefore(forceBtn, pullRetryBtn); }
                  } else if(ds.onlyBehind){
                    hintEl.style.color='#fbbf24';
                    hintEl.textContent='💡 Remote has '+(ds.behind||0)+' new commit(s) your local branch doesn\'t have.\n'
                      +'   Pull first to integrate remote changes, then push.\n';
                  } else {
                    hintEl.style.color='#fbbf24';
                    hintEl.textContent='💡 Push rejected. Check remote for conflicts.\n';
                  }
                });
              }
              pullRetryBtn.onclick=function(){
                pullRetryBtn.disabled=true;pullRetryBtn.textContent='Pulling...';
                var ld4=document.getElementById(logDivId);
                // Pre-flight: check for active rebase or unmerged files before pulling
                apiGet('/api/git-state',function(gs){
                  if(gs && (gs.rebaseInProgress || gs.hasUnmerged)){
                    var detail = gs.rebaseInProgress
                      ? (L==='zh' ? '检测到进行中的 Rebase 状态' : 'An in-progress rebase was detected')
                      : (L==='zh'
                          ? '存在未解决的冲突文件：' + (gs.unmergedFiles||[]).slice(0,3).join(', ')
                          : 'Unmerged conflict files: ' + (gs.unmergedFiles||[]).slice(0,3).join(', '));
                    if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Cannot pull: '+escapeHtml(detail)+'</span>\n';
                    if(ld4) ld4.innerHTML+='<span style="color:#fbbf24">⏳ Aborting leftover rebase state first...\n</span>';
                    apiPost('/api/conflict-reset',{},function(ar){
                      if(ar&&ar.ok){
                        if(ld4) ld4.innerHTML+='<span style="color:#4ade80">✅ Rebase state cleared. Retrying pull...\n</span>';
                        _doPullAndRetry();
                      } else {
                        if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Could not clear state: '+escapeHtml((ar&&ar.error)||'')+'</span>\n';
                        if(ld4) ld4.innerHTML+='<span style="color:#fbbf24">👉 Go to Conflicts tab to resolve, then push manually.\n</span>';
                        pullRetryBtn.disabled=false; pullRetryBtn.textContent='⬇️ Pull & Retry Push';
                        checkConflicts(); loadConflicts();
                      }
                    });
                    return;
                  }
                  _doPullAndRetry();
                });
                function _doPullAndRetry(){
                apiGet('/api/has-uncommitted',function(hasData){
                  var shouldStash=!!(hasData&&hasData.hasChanges);
                  var doPullAndRetry=function(){
                    if(ld4) ld4.innerHTML+='<span style="color:#94a3b8">⏳ Pulling (rebase)...\n</span>';
                    apiPost('/api/pull',{mode:'rebase'},function(pd){
                      if(pd.ok){
                        if(ld4) ld4.innerHTML+='<span style="color:#4ade80">✅ Pull OK — retrying push...\n</span>';
                        closeModal();
                        setTimeout(function(){ doPush(credentials||undefined); },300);
                        return;
                      }
                      var errTxt=pd.error||pd.log||'';
                      if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Pull failed: '+escapeHtml(errTxt)+'</span>\n';
                      if(/CONFLICT|conflict|Automatic merge failed/.test(errTxt||'')){
                        addMsg('⚠️ Pull 发生冲突，请先到 Conflicts 标签页解决后再 Push。','error');
                        checkConflicts();
                        loadConflicts();
                      }
                      pullRetryBtn.disabled=false;pullRetryBtn.textContent='⬇️ Pull & Retry Push';
                    });
                  };
                  if(!shouldStash){doPullAndRetry();return;}
                  var stashMsg='auto-stash-before-pull-retry-'+Date.now();
                  if(ld4) ld4.innerHTML+='<span style="color:#94a3b8">📦 Local changes detected, stashing before pull...\n</span>';
                  apiPost('/api/stash',{message:stashMsg},function(sd){
                    if(!sd.ok){
                      if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Auto-stash failed: '+escapeHtml(sd.error||'')+'</span>\n';
                      pullRetryBtn.disabled=false;pullRetryBtn.textContent='⬇️ Pull & Retry Push';
                      return;
                    }
                    if(ld4) ld4.innerHTML+='<span style="color:#4ade80">✅ Stashed local changes. Continue pulling...\n</span>';
                    doPullAndRetry();
                  });
                }); // closes apiGet has-uncommitted
              } // closes _doPullAndRetry
              }; // closes pullRetryBtn.onclick
              var forceBtn=document.createElement('button');
              forceBtn.className='btn btn-warning';
              forceBtn.textContent='⚠️ Force Push';
              forceBtn.onclick=function(){
                var warningMsg=isNonFastForward&&!isRejectedFetchFirst
                  ?'<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:12px 14px;margin-bottom:10px;color:#7f1d1d">'
                    +'<b>⚠️ You did a git reset --hard (or similar rewrite).</b><br><br>'
                    +'Force push will <b>overwrite the remote branch</b> with your local history.<br>'
                    +'Remote commits newer than your reset point will be <b>permanently lost</b>.<br><br>'
                    +'Only proceed if you are absolutely sure.</div>'
                    +'Proceed with <b>git push --force-with-lease</b>?'
                  :'<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:12px 14px;margin-bottom:10px;color:#7f1d1d">'
                    +'<b>Force push overwrites remote history!</b><br>Remote commits not in your local branch will be lost. Only do this if you are absolutely sure.</div>'
                    +'Proceed with <b>git push --force-with-lease</b>?';
                showModal('⚠️ Force Push Warning', warningMsg,
                  'Force Push',
                  function(){ closeModal(); setTimeout(function(){ doPushForce(); },300); }
                );
              };

              if(isNonFastForward && _lastRebaseForcePushContext &&
                 _lastRebaseForcePushContext.branch === branch &&
                 _lastRebaseForcePushContext.baseBranch){
                var rebuildBtn=document.createElement('button');
                rebuildBtn.className='btn btn-danger';
                rebuildBtn.textContent=(L==='zh')
                  ?'🛠 按 Rebase 基线重建并强推'
                  :'🛠 Rebuild from Rebase Base & Force Push';
                rebuildBtn.onclick=function(){
                  var baseBranch=_lastRebaseForcePushContext.baseBranch;
                                  var gpgOn=(document.getElementById('gpg-sign-toggle')||{}).checked;
                                  var gpgNote=gpgOn
                                    ?(L==='zh'
                                      ?'<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 12px;margin-top:8px;color:#166534;font-size:12px">🔏 GPG 签名已开启 — cherry-pick 会自动附加签名</div>'
                                      :'<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 12px;margin-top:8px;color:#166534;font-size:12px">🔏 GPG signing is ON — the cherry-picked commit will be signed automatically</div>')
                                    :(L==='zh'
                                      ?'<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:8px 12px;margin-top:8px;color:#92400e;font-size:12px">⚠️ GPG 签名未开启 — 如果远端要求签名验证，push 仍会被拒绝。请先在右上角打开 GPG 开关。</div>'
                                      :'<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:8px 12px;margin-top:8px;color:#92400e;font-size:12px">⚠️ GPG signing is OFF — if the remote requires verified signatures, the push will still be rejected. Enable the GPG toggle first.</div>');
                                  var warn=(L==='zh')
                                    ?'<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:12px 14px;margin-bottom:10px;color:#7f1d1d">'
                                      +'<b>⚠️ 将执行重写历史操作</b><br><br>'
                                      +'将按以下步骤自动执行：<br>'
                      +'1) <code>git reset --hard '+escapeHtml(baseBranch)+'</code><br>'
                                      +'2) <code>git cherry-pick 原HEAD</code><br>'
                      +'3) <code>git push --force-with-lease</code><br><br>'
                                      +'仅保留"当前顶部 commit"，其它本地新增 commit 会被移除。'
                                      +'</div>'+gpgNote
                                    :'<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:12px 14px;margin-bottom:10px;color:#7f1d1d">'
                                      +'<b>⚠️ This rewrites history</b><br><br>'
                                      +'It will run:<br>'
                                      +'1) <code>git reset --hard '+escapeHtml(baseBranch)+'</code><br>'
                                      +'2) <code>git cherry-pick previous HEAD</code><br>'
                                      +'3) <code>git push --force-with-lease</code><br><br>'
                                      +'Only the current top commit will be kept; other local extra commits are removed.'
                                      +'</div>'+gpgNote;
                  showModal(
                    (L==='zh')?'🛠 重建并强推':'🛠 Rebuild & Force Push',
                    warn,
                    (L==='zh')?'确认执行':'Proceed',
                    function(){
                      closeModal();
                      addMsg((L==='zh')?'🛠 正在执行重建并强推...':'🛠 Rebuilding branch and force pushing...','info');
                      apiPost('/api/rebase-rebuild-force-push',{
                        base_branch: baseBranch,
                        remote_branch: effectiveRemote
                      },function(rr){
                        if(rr&&rr.ok){
                          addMsg((L==='zh')?'✅ 重建并强推成功':'✅ Rebuild + force push succeeded','success');
                          if(rr.stdout) addMsg('📋 '+rr.stdout,'info',{maxLines:16});
                          _reloadLog(1); loadCurrentBranch(); loadFiles();
                        }else{
                          addMsg((L==='zh'?'❌ 重建并强推失败: ':'❌ Rebuild + force push failed: ')+((rr&&rr.error)||''),'error',{maxLines:16});
                          if(rr&&rr.stdout) addMsg('📋 '+rr.stdout,'info',{maxLines:16});
                        }
                      });
                    }
                  );
                };
                btnsDiv2.appendChild(rebuildBtn);
              }
              if(justRebased){
                // After rebase: Force Push is the correct action — place it first and highlight it
                forceBtn.className='btn btn-warning';
                forceBtn.textContent=(L==='zh')?'🚀 Force Push（推荐）':'🚀 Force Push (recommended)';
                btnsDiv2.appendChild(forceBtn);
                btnsDiv2.appendChild(pullRetryBtn);
              } else {
                btnsDiv2.appendChild(forceBtn);
                btnsDiv2.appendChild(pullRetryBtn);
              }
            }
          }
        } else {
          setTimeout(poll,500);
        }
      };
      xhr.onerror=function(){setTimeout(poll,1000);};
      xhr.send();
    }
    poll();
  });
}

function doPushForce(){
  doPush(null, true);
}

function _showPushAuthModal(branch){
  var html='Push to <b>origin/'+escapeHtml(branch)+'</b> requires authentication.<br><br>'
    +'<label style="font-size:13px;font-weight:600">Username</label><br>'
    +'<input id="push-username" type="text" placeholder="Username" style="width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin:4px 0 10px"><br>'
    +'<label style="font-size:13px;font-weight:600">Password / Token</label><br>'
    +'<input id="push-password" type="password" placeholder="Password or personal access token" style="width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin:4px 0 4px"><br>'
    +'<span style="font-size:11px;color:#6b7280">Tip: use a personal access token instead of your password</span>';
  showModal('🔐 Authentication Required', html, 'Push', function(){
    var u=(document.getElementById('push-username')||{}).value||'';
    var p=(document.getElementById('push-password')||{}).value||'';
    if(!u||!p){addMsg('Username and password are required','error');return;}
    doPush({username:u,password:p});
  });
}

function doManualPush(){
  var branch=(document.getElementById('branch-name').textContent||'').trim();
  var isZh=L==='zh';
  // Fetch remote branches for the selector
  apiGet('/api/branches?page=1&per_page=0', function(bData){
    var remoteList=(bData&&bData.remote||[]).map(function(b){
      return b.name.replace(/^origin\//,'');
    });
    // Deduplicate and sort, current branch first
    var seen={};
    var opts=[branch];
    seen[branch]=true;
    remoteList.forEach(function(n){ if(n&&!seen[n]){seen[n]=true;opts.push(n);} });

    var selHtml='<select id="push-remote-branch-sel" style="width:100%;padding:7px 10px;border:1.5px solid #d1d5db;border-radius:6px;font-size:13px;margin-bottom:8px">';
    opts.forEach(function(n){
      selHtml+='<option value="'+escapeAttr(n)+'"'+(n===branch?' selected':'')+'>'+escapeHtml(n)+(n===branch?' '+t('push_remote_branch_default'):'')+' </option>';
    });
    selHtml+='</select>';
    selHtml+='<div style="margin-bottom:6px;font-size:12px;color:#6b7280">'
      +(isZh?'或输入自定义远端分支名：':'Or type a custom remote branch name:')+'</div>';
    selHtml+='<input id="push-remote-branch-custom" type="text" placeholder="'+escapeAttr(t('push_remote_branch_placeholder'))+'" '
      +'style="width:100%;padding:7px 10px;border:1.5px solid #d1d5db;border-radius:6px;font-size:13px;box-sizing:border-box">';

    var bodyHtml=
      '<div style="margin-bottom:10px;font-size:13px;color:#374151">'
      +(isZh?'本地分支 <b>':'Push local branch <b>')+escapeHtml(branch)+(isZh?'</b> 将推送到远端分支：':'</b> to remote branch:')+'</div>'
      +'<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">'+t('push_remote_branch_label')+'</label>'
      +selHtml
      +'<div style="margin-top:10px;font-size:11px;color:#6b7280">'
      +(isZh?'💡 若自定义名称不为空，优先使用自定义名称。':'💡 If a custom name is entered, it takes priority over the dropdown.')+'</div>';

    showModal(t('push_remote_select_title'), bodyHtml, isZh?'推送':'Push Now', function(){
      var customEl=document.getElementById('push-remote-branch-custom');
      var selEl=document.getElementById('push-remote-branch-sel');
      var customVal=(customEl&&customEl.value||'').trim();
      var selVal=(selEl&&selEl.value||'').trim();
      var remote=sanitizeBranchName(customVal||selVal||branch)||branch;
      doPush({}, false, remote!==branch?remote:undefined);
    });
  });
}

function doForcePush(){
  var branch=(document.getElementById('branch-name').textContent||'').trim();
  showModalDouble(
    t('force_push_title'),
    t('force_push_desc'),
    t('force_push_btn'),
    function(){ doPush({}, true); },
    t('force_push_later'),
    null,
    'btn-danger',
    'btn-secondary'
  );
}

function _showGitLog(label, log){
  if(!log||!log.trim()) return;
  // Filter out SSH post-quantum warnings (not actionable)
  var lines = log.split('\n').filter(function(l){
    return l.indexOf('post-quantum')<0 && l.indexOf('openssh.com/pq')<0;
  });
  var cleaned = lines.join('\n').trim();
  if(cleaned) addMsg('📋 '+label+':\n'+cleaned, 'info');
}

// ═══════════ Streaming live-log modal for fetch / pull ═══════════
function _startGitopStream(op, mode, onDone){
  var branch=(document.getElementById('branch-name')||{textContent:''}).textContent||'?';
  var label = op==='fetch' ? '⬇️ Fetching' : '⬇️ Pulling';
  var uid = op+'-'+Date.now();
  var logDivId = 'gitop-log-'+uid;

  var logBox='<div id="'+logDivId+'" style="'
    +'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.5;'
    +'padding:12px 14px;border-radius:8px;min-height:140px;max-height:340px;'
    +'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    +'<span style="color:#94a3b8">⏳ Starting '+escapeHtml(op)+' from origin/'+escapeHtml(branch)+'...\n</span></div>';

  // Show modal — Cancel & Close are both immediately enabled so user can dismiss any time
  showModal(
    label+' — <span style="font-size:12px;font-weight:400;color:#94a3b8">origin/'+escapeHtml(branch)+'</span>',
    logBox, 'Close', null
  );

  apiPost('/api/gitop-start',{op:op,mode:mode||'merge'},function(startData){
    var ld=document.getElementById(logDivId);
    if(!startData||!startData.jobId){
      if(ld) ld.innerHTML+='<span style="color:#f87171">❌ Failed to start: '+escapeHtml((startData&&startData.error)||'unknown error')+'</span>\n';
      if(onDone) onDone(false,'');
      return;
    }
    var jobId=startData.jobId;
    var seenLines=0;

    function poll(){
      var xhr=new XMLHttpRequest();
      xhr.open('GET','/api/push-status?jobId='+encodeURIComponent(jobId));
      xhr.onload=function(){
        var r;
        try{r=JSON.parse(xhr.responseText);}catch(e){setTimeout(poll,600);return;}
        var ld2=document.getElementById(logDivId); // null if modal was closed
        if(ld2 && r.lines && r.lines.length>seenLines){
          for(var i=seenLines;i<r.lines.length;i++){
            var line=r.lines[i];
            var col='#e2e8f0';
            var lineBody=line.replace(/^\[\d{2}:\d{2}:\d{2}\] /,'');
            if(/^─+$/.test(line)) col='#334155';
            else if(/^(error:|fatal:|ERROR:)|\btimed out\b/i.test(lineBody)) col='#f87171';
            else if(/^remote:|^From |^origin\//i.test(lineBody)) col='#67e8f9';
            else if(/^\$/.test(lineBody)) col='#fbbf24';
            else if(/Already up.to.date/i.test(lineBody)) col='#4ade80';
            else if(/^📦|^🌿|^⬇️/.test(lineBody)) col='#c4b5fd';
            else if(/^\[/.test(line)) col='#94a3b8';
            ld2.innerHTML+='<span style="color:'+col+'">'+escapeHtml(line)+'</span>\n';
          }
          seenLines=r.lines.length;
          ld2.scrollTop=ld2.scrollHeight;
        }
        if(r.done){
          var ld3=document.getElementById(logDivId);
          if(r.ok){
            if(ld3) ld3.innerHTML+='<span style="color:#4ade80;font-weight:700">✅ '+(op==='fetch'?'Fetch':'Pull')+' succeeded!\n</span>';
            addMsg('✅ '+(op==='fetch'?t('fetch_ok'):t('pull_ok')),'success');
          }else{
            if(ld3) ld3.innerHTML+='<span style="color:#f87171;font-weight:700">❌ '+(op==='fetch'?'Fetch':'Pull')+' failed!\n</span>';
            // Page log (always fires even if modal was closed)
            var errTxt=r.error||'';
            if(op==='pull') handlePullErr(errTxt);
            else addMsg('❌ '+t('fetch_fail')+errTxt,'error',{maxLines:10});
          }
          checkConflicts();
          if(r.ok && op==='pull'){
            loadCurrentBranch();
            _reloadLog(1);
            loadFiles();
          }
          if(onDone) onDone(r.ok);
        }else{
          setTimeout(poll,500);
        }
      };
      xhr.onerror=function(){setTimeout(poll,1000);};
      xhr.send();
    }
    poll();
  });
}

function _executePull(mode, onDone){
  _startGitopStream('pull', mode, onDone);
}

function doPull() {
  _rememberGitOp('pull', function(){ doPull(); });
  addMsg(t('pulling'),'info');
  apiGet('/api/has-uncommitted',function(hasData){
    if(hasData&&hasData.hasChanges){
      // Show 3-option dialog: Stash & Pull / Pull Anyway / Cancel
      showModal(
        '🔒 Local Changes Detected',
        '<div style="font-size:14px;line-height:1.7">'
        +'You have uncommitted local changes.<br><br>'
        +'<b>📦 Stash & Pull</b> — saves your changes to stash, pulls, you restore manually from Stash tab.<br>'
        +'<b>⬇️ Pull Anyway</b> — pulls without touching your local changes (may conflict).<br>'
        +'<b>Cancel</b> — do nothing.'
        +'</div>',
        null, null
      );

      var btnsDiv=document.getElementById('modal-btns');
      btnsDiv.innerHTML='';
      var cancelBtn=document.createElement('button');
      cancelBtn.className='btn btn-secondary';cancelBtn.textContent='Cancel';
      cancelBtn.onclick=closeModal;
      var pullBtn=document.createElement('button');
      pullBtn.className='btn btn-primary';pullBtn.textContent='⬇️ Pull Anyway';
      pullBtn.onclick=function(){
        closeModal();
        addMsg('⬇️ Pulling...','info');
        _executePull('rebase',function(){ loadFiles(); });
      };
      var stashBtn=document.createElement('button');
      stashBtn.className='btn btn-warning';stashBtn.textContent='📦 Stash & Pull';
      stashBtn.onclick=function(){
        closeModal();
        addMsg('📦 Stashing local changes before pull...','info');
        apiPost('/api/stash',{},function(stashData){
          if(!stashData.ok){
            addMsg('⚠️ Stash failed: '+(stashData.error||'')+'. Fix local changes first.','error');
            return;
          }
          addMsg('✅ Changes stashed. Pulling...','info');
          _executePull('rebase',function(ok){
            loadFiles();
            if(ok) addMsg('✅ Pull OK. Your stashed changes are in the Stash tab — apply them when ready.','info');
          });
        });
      };
      btnsDiv.appendChild(cancelBtn);
      btnsDiv.appendChild(pullBtn);
      btnsDiv.appendChild(stashBtn);
    } else {
      _executePull('rebase',function(){ loadFiles(); });
    }
  });
}

function doFetch() {
  _rememberGitOp('fetch', function(){ doFetch(); });
  addMsg(t('fetching'),'info');
  _startGitopStream('fetch', null, function(ok){
    if(ok){ loadFiles(); }
  });
}

function handlePullErr(err) {
  if(err.indexOf('CONFLICT')>=0||err.indexOf('conflict')>=0||err.indexOf('Automatic merge failed')>=0){
    addMsg('⚠️ '+t('pull_conflict')+' — 请在 Conflicts 标签页中手动解决冲突','error');
    checkConflicts();
    loadConflicts();
    return;
  }
  if(err.indexOf('overwritten by merge')>=0||err.indexOf('would be overwritten')>=0){
    addMsgWithAction('⚠️ Pull blocked: local file changes conflict with remote. Auto-stash and retry?','error',[
      {label:'Stash & Retry Pull',onClick:function(){
        apiPost('/api/stash',{},function(s){
          if(!s.ok){
            // If stash also fails due to conflict, go directly to conflicts
            if(s.error&&(s.error.indexOf('CONFLICT')>=0||s.error.indexOf('conflict')>=0)){
              addMsg('⚠️ Conflict detected — 请在 Conflicts 标签页中解决','error');
              checkConflicts();
              loadConflicts();
            } else {
              addMsg('Stash failed: '+(s.error||''),'error');
            }
            return;
          }
          _executePull('rebase',function(ok){
            if(!ok){
              // Pull after stash still has conflicts — go to conflicts tab
              checkConflicts();
              loadConflicts();
              return;
            }
            apiPost('/api/stash-pop',{index:0},function(p){
              if(!p.ok){
                addMsg('⚠️ Stash pop conflict — 请在 Conflicts 标签页中解决','error');
                checkConflicts();
                loadConflicts();
              } else {
                addMsg('✅ Restored local changes after pull','ok');
              }
              loadFiles();
            });
          });
        });
      }}
    ]);
  }
  else if(err.indexOf('divergent')>=0||err.indexOf('reconcile')>=0||err.indexOf('Need to specify')>=0){
    addMsgWithAction('Divergent branches detected. Choose strategy:', 'error', [
      {label:'Pull --merge', onClick:function(){_executePull('merge',function(){loadFiles()})}},
      {label:'Pull --rebase', onClick:function(){_executePull('rebase',function(){loadFiles()})}},
      {label:'Pull --ff-only', onClick:function(){_executePull('ff',function(){loadFiles()})}}
    ]);
  }
  else if(err.indexOf('no tracking')>=0||err.indexOf('upstream')>=0||err.indexOf('set-upstream')>=0){
    addMsgWithAction(t('branch_no_upstream'),'error',[{label:t('fix_upstream'),onClick:function(){apiPost('/api/set-upstream',{},function(r){if(r.ok){addMsg(t('upstream_set_ok'),'ok');doPull()}else addMsg(t('upstream_set_fail')+(r.error||''),'error')})}}]);
  }else if(err.indexOf('remote ref')>=0||err.indexOf("couldn't find")>=0){
    addMsg(t('pull_fail')+err,'error');
  }else addMsg(t('pull_fail')+err,'error',{maxLines:10});
}

// ═══════════ Branches ═══════════
var _branchSortField='date';
var _branchSortOrder='desc';
var _allBranchesCache=null;
var _branchSearchTimer=null;
var _branchTab='local';
var _branchTabInit=false;

function _initBranchTab(){
  if(_branchTabInit)return;
  _branchTabInit=true;
  try{var s=localStorage.getItem('git_tool_branch_tab');if(s==='remote')_branchTab='remote';}catch(e){}
}

function _updateBranchTabUI(){
  ['local','remote'].forEach(function(t){
    var btn=document.getElementById('btab-'+t);
    if(!btn)return;
    btn.className='branch-tab-btn'+(t===_branchTab?' active':'');
    btn.setAttribute('aria-selected',t===_branchTab?'true':'false');
  });
}

function switchBranchTab(tab){
  _branchTab=tab;
  try{localStorage.setItem('git_tool_branch_tab',tab);}catch(e){}
  _updateBranchTabUI();
  // reset search when switching tabs
  var si=document.getElementById('branch-search');
  if(si&&si.value){si.value='';var sc=document.getElementById('branch-search-clear');if(sc)sc.style.display='none';}
  if(_allBranchesCache){
    var _bpv=document.getElementById('branches-per-page').value;
    _renderBranchesByTab(_allBranchesCache,1,_bpv===''?20:parseInt(_bpv));
  }else{
    loadBranches(1);
  }
}

function toggleBranchSort(field){
  if(_branchSortField===field){
    _branchSortOrder=_branchSortOrder==='desc'?'asc':'desc';
  }else{
    _branchSortField=field;
    _branchSortOrder='desc';
  }
  if(_allBranchesCache){
    var _bpv=document.getElementById('branches-per-page').value;
    _renderBranchesByTab(_allBranchesCache,1,_bpv===''?20:parseInt(_bpv));
  }else{
    loadBranches(1);
  }
}

function _sortBranches(list){
  var desc=_branchSortOrder==='desc';
  return list.slice().sort(function(a,b){
    if(_branchSortField==='date'){
      return desc?(b.ts-a.ts):(a.ts-b.ts);
    }else{
      var na=a.name||'',nb=b.name||'';
      return desc?nb.localeCompare(na):na.localeCompare(nb);
    }
  });
}

function _branchSortHeader(){
  var ni=_branchSortField==='name'?(_branchSortOrder==='desc'?' ↓':' ↑'):'';
  var di=_branchSortField==='date'?(_branchSortOrder==='desc'?' ↓':' ↑'):'';
  return '<div style="display:flex;gap:16px;padding:6px 14px 4px;border-bottom:1px solid #e5e7eb;margin-bottom:4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.4px">'+
    '<span style="flex:1;cursor:pointer;user-select:none" onclick="toggleBranchSort(\'name\')" title="Sort by name">Name'+ni+'</span>'+
    '<span style="width:160px;cursor:pointer;user-select:none;text-align:right" onclick="toggleBranchSort(\'date\')" title="Sort by date">Last Commit'+di+'</span>'+
    '<span style="width:324px"></span>'+
    '</div>';
}

function loadBranches(page){
  page=page||1;
  switchPage('branches');
  _initBranchTab();
  _updateBranchTabUI();
  document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading branches...</div>';
  document.getElementById('branches-pagination').innerHTML='';
  var _bpv=document.getElementById('branches-per-page').value;var perPage=_bpv===''?20:parseInt(_bpv);
  // Always fetch all — enables client-side tab pagination and correct counts
  fetch(API_BASE+'/api/protected-branches').then(function(r){return r.json();}).catch(function(){return{};}).then(function(pcfg){
    if(pcfg&&pcfg.exact)    _protExact    = pcfg.exact;
    if(pcfg&&pcfg.contains) _protContains = pcfg.contains.map(function(s){return s.toLowerCase();});
    apiGet('/api/branches?page=1&per_page=0',function(data){
      _allBranchesCache=data;
      _updateBranchTabCounts(data);
      _renderBranchesByTab(data,page,perPage);
    });
  });
}

// Cache-only render used by pagination buttons (no network)
function renderBranchPage(page){
  if(!_allBranchesCache){loadBranches(page);return;}
  var _bpv=document.getElementById('branches-per-page').value;var perPage=_bpv===''?20:parseInt(_bpv);
  _renderBranchesByTab(_allBranchesCache,page,perPage);
}

function _updateBranchTabCounts(data){
  var lc=document.getElementById('btab-local-count');
  var rc=document.getElementById('btab-remote-count');
  if(lc) lc.textContent=data.total_local||0;
  if(rc) rc.textContent=data.total_remote||0;
}

function _renderBranchesByTab(data,page,perPage){
  var container=document.getElementById('branches-content');
  var search=(document.getElementById('branch-search')||{value:''}).value.trim().toLowerCase();
  var isLocal=_branchTab==='local';
  var allForTab=_sortBranches(isLocal?(data.local||[]):(data.remote||[]));
  var current=data.current||'';

  // Apply search filter (case-insensitive substring match across all branches in tab)
  var filtered=search?allForTab.filter(function(b){return b.name.toLowerCase().indexOf(search)>=0;}):allForTab;
  var total=filtered.length;
  var totalPages=perPage>0?Math.ceil(total/perPage):1;
  page=Math.max(1,Math.min(page,totalPages||1));
  var pageBranches=perPage>0?filtered.slice((page-1)*perPage,page*perPage):filtered;

  var html=_branchSortHeader();
  if(!pageBranches.length){
    html+='<div class="empty">'+(search?'No branches matching "<b>'+escapeHtml(search)+'</b>" in '+(isLocal?'local':'remote')+' branches':'No '+(isLocal?'local':'remote')+' branches found')+'</div>';
  }else if(isLocal){
    html+='<div class="branch-list">';
    pageBranches.forEach(function(b,bi){
      var isCur=(b.name===current)||(b.name.toLowerCase()===current.toLowerCase());
      var wid='bwrap-l-'+bi;
      var cls=isCur?' branch-item current':' branch-item';
      var nameHtml=search?_highlightBranchMatch(escapeHtml(b.name),search):escapeHtml(b.name);
      var _shortName=b.name.replace(/^origin\//,'');
      var _isProtected=_isBranchProtected(_shortName);
      html+='<div id="'+wid+'">';
      html+='<div class="'+cls+'">';
      html+='<button class="btn-branch-info" onclick="event.stopPropagation();showBranchNamePopover(this,\''+escapeJS(b.name)+'\')" title="Show full name">ⓘ</button>';
      html+='<span class="name" title="'+escapeAttr(b.name)+'">'+nameHtml+'</span>';
      html+='<span class="branch-date">'+escapeHtml(b.date||'')+'</span>';
      if(isCur){
        html+='<div class="branch-actions"><span class="branch-current-badge">✓ Current</span></div>';
        html+='<button class="btn-branch-expand" onclick="event.stopPropagation();toggleBranchExpand(\''+wid+'\')" title="Expand">▶</button>';
      }else{
        html+='<div class="branch-actions">';
        html+='<button class="btn btn-sm btn-compare" onclick="event.stopPropagation();openCompare(\''+escapeJS(b.name)+'\',\'local\')"><span style="line-height:1">⚖️</span><span>Compare</span></button>';
        html+='<button class="btn btn-sm btn-merge" onclick="event.stopPropagation();mergeBranch(\''+escapeJS(b.name)+'\')"><span style="line-height:1">⚡</span><span>Merge</span></button>';
        html+='<button class="btn btn-sm btn-checkout" data-branch="'+escapeAttr(b.name)+'" onclick="return branchCheckoutClick(this)"><span style="line-height:1">✅</span><span>Checkout</span></button>';
        html+='</div>';
        html+='<button class="btn-branch-expand" onclick="event.stopPropagation();toggleBranchExpand(\''+wid+'\')" title="Expand">▶</button>';
      }
      html+='</div>';
      html+='<div class="branch-expand-panel" id="bpanel-l-'+bi+'">';
      if(_isProtected){
        html+='<span style="font-size:12px;color:#f59e0b;flex:1">🔒 Protected branch — rename &amp; delete disabled</span>';
      }else if(isCur){
        html+='<span style="font-size:12px;color:#9ca3af;flex:1">Options</span>';
        html+='<button class="btn-rename-branch" onclick="renameBranch(\''+escapeJS(b.name)+'\')">'+t('rename_branch_btn')+'</button>';
      }else{
        html+='<span style="font-size:12px;color:#9ca3af;flex:1">Danger zone</span>';
        html+='<button class="btn-rename-branch" onclick="renameBranch(\''+escapeJS(b.name)+'\')">'+t('rename_branch_btn')+'</button>';
        html+='<button class="btn-del-branch" onclick="promptDeleteBranch(\''+escapeJS(b.name)+'\',\'local\')">🗑 Delete Branch</button>';
      }
      html+='</div>';
      html+='</div>';
    });
    html+='</div>';
  }else{
    html+='<div class="branch-list">';
    pageBranches.forEach(function(b,bi){
      var wid='bwrap-r-'+bi;
      var nameHtml=search?_highlightBranchMatch(escapeHtml(b.name),search):escapeHtml(b.name);
      var _shortR=b.name.replace(/^origin\//,'');
      html+='<div id="'+wid+'">';
      html+='<div class="branch-item">';
      html+='<button class="btn-branch-info" onclick="event.stopPropagation();showBranchNamePopover(this,\''+escapeJS(b.name)+'\')" title="Show full name">ⓘ</button>';
      html+='<span class="name" title="'+escapeAttr(b.name)+'">'+nameHtml+'</span>';
      html+='<span class="branch-date">'+escapeHtml(b.date||'')+'</span>';
      html+='<div class="branch-actions">';
      html+='<button class="btn btn-sm btn-compare" onclick="event.stopPropagation();openCompare(\''+escapeJS(b.name)+'\',\'remote\')"><span style="line-height:1">⚖️</span><span>Compare</span></button>';
      html+='<button class="btn btn-sm btn-merge" onclick="event.stopPropagation();mergeBranch(\''+escapeJS(b.name)+'\')"><span style="line-height:1">⚡</span><span>Merge</span></button>';
      html+='<button class="btn btn-sm btn-checkout" data-branch="'+escapeAttr(b.name)+'" onclick="return branchCheckoutClick(this)"><span style="line-height:1">✅</span><span>Checkout</span></button>';
      html+='</div>';
      html+='<button class="btn-branch-expand" onclick="event.stopPropagation();toggleBranchExpand(\''+wid+'\')" title="Expand">▶</button>';
      html+='</div>';
      html+='<div class="branch-expand-panel" id="bpanel-r-'+bi+'">';
      if(_isBranchProtected(_shortR)){
        html+='<span style="font-size:12px;color:#f59e0b;flex:1">🔒 Protected branch — delete disabled</span>';
      }else{
        html+='<span style="font-size:12px;color:#9ca3af;flex:1">Danger zone</span>';
        html+='<button class="btn-del-branch" onclick="promptDeleteBranch(\''+escapeJS(b.name)+'\',\'remote\')">🗑 Delete Branch</button>';
      }
      html+='</div>';
      html+='</div>';
    });
    html+='</div>';
  }

  container.innerHTML=html;
  var infoLabel=(isLocal?'Local':'Remote')+': '+(search?filtered.length+' match(es)':total+' total');
  _pagData['branches']={
    totalPages:totalPages, cur:page, loadFn:'renderBranchPage',
    infoHtml:'<span class="page-info">'+infoLabel+'</span>'
  };
  if(_pagExpanded['branches']===undefined)_pagExpanded['branches']=false;
  var pag=document.getElementById('branches-pagination');
  if(!pag)return;
  if(totalPages<=1){pag.innerHTML='';return;}
  pag.innerHTML=_renderSmartPaginationHTML('branches');
}


function sanitizeBranchName(name){
  // Replace whitespace and git-invalid chars with underscore, per git check-ref-format rules
  var s = name
    .replace(/[\s~^:?*\[\\]/g, '_')   // spaces and explicitly forbidden chars
    .replace(/@\{/g, '_')              // @{ sequence
    .replace(/\.\./g, '_')             // consecutive dots
    .replace(/\/\//g, '/')             // consecutive slashes
    .replace(/\.lock$/i, '_lock')      // cannot end with .lock
    .replace(/^[.\-]/, '_')            // cannot start with . or -
    .replace(/\.$/, '_')               // cannot end with .
    .replace(/_+/g, '_');              // collapse multiple underscores
  return s;
}

function createNewBranch(){
  var raw=document.getElementById('new-branch-name').value.trim();
  if(!raw){addMsg(t('enter_branch_name'),'error');return}
  var name=sanitizeBranchName(raw);
  var curName=document.getElementById('branch-name').textContent;
  var nameInfo='<b>'+escapeHtml(name)+'</b>';
  if(name!==raw) nameInfo='<b>'+escapeHtml(name)+'</b><br><small style="color:#facc15">⚠ Renamed from: '+escapeHtml(raw)+'</small>';
  showModal('Create Branch','Create new branch '+nameInfo+'<br><br>Based on: <span style="background:#1e40af;color:#fff;padding:2px 10px;border-radius:99px;font-weight:700">'+escapeHtml(curName)+'</span>','Create',function(){
    apiPost('/api/create-branch',{name:name},function(data){
      if(data.ok){
        document.getElementById('new-branch-name').value='';loadBranches();loadCurrentBranch();
        showModalDouble(
          t('branch_push_title'),
          tf('branch_push_desc',L,{name:name}),
          t('branch_push_btn'),
          function(){ doPush(); },
          t('branch_push_later'),
          null,
          'btn-success',
          'btn-secondary'
        );
      }
      else addMsg(t('create_failed')+(data.error||''),'error');
    });
  });
}

function toggleBranchExpand(wrapId){
  var wrap=document.getElementById(wrapId);
  if(!wrap) return;
  var panel=wrap.querySelector('.branch-expand-panel');
  var arrow=wrap.querySelector('.btn-branch-expand');
  var isOpen=panel&&panel.classList.contains('open');
  // Close all other open panels (accordion)
  document.querySelectorAll('.branch-expand-panel.open').forEach(function(p){
    p.classList.remove('open');
    var a=p.parentElement&&p.parentElement.querySelector('.btn-branch-expand');
    if(a) a.textContent='▶';
  });
  if(!isOpen&&panel){
    panel.classList.add('open');
    if(arrow) arrow.textContent='▼';
  }
}

function renameBranch(branchName){
  var shortName=branchName.replace(/^origin\//,'');
  var isZh=L==='zh';
  var bodyHtml=
    '<p style="margin:0 0 12px;font-size:13px;color:#374151">'
    +(isZh?'当前分支名: ':'Current name: ')
    +'<code style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-weight:700">'+escapeHtml(shortName)+'</code></p>'
    +'<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">'+t('rename_branch_label')+'</label>'
    +'<input id="rename-branch-input" type="text" placeholder="'+escapeAttr(t('rename_branch_placeholder'))+'" '
    +'style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:6px;font-size:13px;box-sizing:border-box" '
    +'value="'+escapeAttr(shortName)+'">'
    +'<p style="margin:8px 0 0;font-size:11px;color:#6b7280">'
    +(isZh?'⚠️ 重命名仅影响本地分支。你可在下一步选择是否同步更新远端。':'⚠️ Rename affects only the local branch. You can optionally sync the remote in the next step.')
    +'</p>';
  showModal(t('rename_branch_title'), bodyHtml, t('rename_branch_confirm'), function(){
    var inputEl=document.getElementById('rename-branch-input');
    var raw=(inputEl&&inputEl.value||'').trim();
    var newName=sanitizeBranchName(raw);
    if(!newName){addMsg(t('enter_branch_name'),'error');return;}
    if(newName===shortName){addMsg(isZh?'新名称与旧名称相同':'New name is the same as the old name','error');return;}
    apiPost('/api/rename-branch',{old_name:shortName,new_name:newName},function(data){
      if(data.ok){
        addMsg(t('rename_branch_ok')+shortName+' → '+newName,'success');
        loadBranches(1);loadCurrentBranch();
        // Offer to update remote
        var desc=tf('rename_remote_desc',L,{old:shortName,new:newName});
        showModalDouble(
          t('rename_remote_title'),
          desc,
          t('rename_push_btn'),
          function(){
            // Delete old remote branch, push new name
            addMsg(isZh?'正在更新远端分支...':'Updating remote branch...','info');
            apiPost('/api/delete-branch',{name:shortName,scope:'remote'},function(delData){
              // Delete may fail if remote didn't exist — that's OK, still push new
              doPush({}, false, newName);
            });
          },
          t('rename_later_btn'),
          null,
          'btn-success',
          'btn-secondary'
        );
      }else{
        addMsg(t('rename_branch_fail')+(data.error||''),'error');
      }
    });
  });
}

function promptDeleteBranch(branchName, defaultScope){
  // Step 1: choose local vs remote
  var isRemoteList=(defaultScope==='remote');
  var shortName=branchName.replace(/^origin\//,'');
  var bodyHtml=
    '<p style="margin:0 0 14px;font-size:13px;color:#374151">Choose what to delete for branch <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-weight:700">'+escapeHtml(shortName)+'</code>:</p>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +'<button onclick="_delBranchScope(\''+escapeJS(branchName)+'\',\'local\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #d1d5db;background:#f9fafb;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:18px">💻</span><div><div style="font-weight:600;color:#111827">Delete Local Branch</div><div style="font-size:11px;color:#6b7280;margin-top:2px">Removes only the local copy. Remote is untouched.</div></div></button>'
    +'<button onclick="_delBranchScope(\''+escapeJS(branchName)+'\',\'remote\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #fca5a5;background:#fff5f5;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:18px">☁️</span><div><div style="font-weight:600;color:#b91c1c">Delete Remote Branch</div><div style="font-size:11px;color:#dc2626;margin-top:2px">⚠️ Permanently removes from the remote server.</div></div></button>'
    +'</div>';
  showModal('🗑 Delete Branch', bodyHtml, null, null);
}

function _delBranchScope(branchName, scope){
  var ov=document.getElementById('modal-overlay');
  if(ov) ov.style.display='none';
  var shortName=branchName.replace(/^origin\//,'');
  if(scope==='remote'){
    // Strong warning confirmation before remote delete
    var warnBody=
      '<div style="background:#fef2f2;border:2px solid #ef4444;border-radius:10px;padding:14px 16px;margin-bottom:14px">'
      +'<div style="font-size:28px;margin-bottom:8px;text-align:center">🚨</div>'
      +'<div style="font-size:14px;font-weight:800;color:#dc2626;margin-bottom:8px;text-align:center;letter-spacing:.3px">IRREVERSIBLE — REMOTE BRANCH WILL BE GONE</div>'
      +'<div style="font-size:13px;color:#7f1d1d;line-height:1.7">'
      +'You are about to delete the remote branch<br>'
      +'<code style="background:#fee2e2;padding:2px 8px;border-radius:4px;font-weight:700;font-size:13px;display:inline-block;margin:4px 0">origin/'+escapeHtml(shortName)+'</code><br>'
      +'from the remote server.<br><br>'
      +'⛔ <strong>This cannot be undone</strong> — once deleted, the remote branch will no longer exist and anyone tracking it will lose access.</div>'
      +'</div>'
      +'<p style="margin:0;font-size:13px;color:#374151;font-weight:600">Are you absolutely sure you want to permanently delete this remote branch?</p>';
    showModal(
      '⚠️ Delete Remote Branch',
      warnBody,
      '🗑 Yes, Delete Remote',
      function(){ _doDeleteRemote(branchName, shortName); }
    );
  }else{
    var localBody=
      '<p style="margin:0 0 10px;font-size:13px;color:#374151">Delete local branch <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-weight:700">'+escapeHtml(shortName)+'</code>?</p>'
      +'<p style="margin:0;font-size:12px;color:#6b7280">The remote branch (if any) will not be affected. Make sure all your commits are pushed or you no longer need them.</p>';
    showModal('🗑 Delete Local Branch', localBody, '🗑 Delete', function(){
      apiPost('/api/delete-branch',{name:shortName,scope:'local'},function(data){
        if(data.ok){
          addMsg('🗑 Local branch "'+shortName+'" deleted','success');
          loadBranches(1);
        } else if(data.not_merged){
          // Branch has unmerged commits — offer force delete
          var forceBody=
            '<div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:10px;padding:12px 14px;margin-bottom:12px">'
            +'<div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:6px">⚠️ Branch not fully merged</div>'
            +'<div style="font-size:12px;color:#78350f;line-height:1.6">'
            +'Branch <code style="background:#fef3c7;padding:1px 5px;border-radius:3px;font-weight:700">'+escapeHtml(shortName)+'</code> contains commits that have <strong>not been merged</strong> into your current branch.<br>'
            +'Deleting it now will <strong>permanently lose those unmerged commits</strong>.</div>'
            +'</div>'
            +'<p style="margin:0;font-size:13px;color:#374151">Force delete anyway? (<code>git branch -D</code>)</p>';
          showModal(
            '⚠️ Force Delete?',
            forceBody,
            '🗑 Force Delete (-D)',
            function(){
              apiPost('/api/delete-branch',{name:shortName,scope:'local',force:true},function(d){
                if(d.ok){addMsg('🗑 Branch "'+shortName+'" force deleted','success');loadBranches(1);}
                else addMsg('❌ Failed: '+(d.error||''),'error');
              });
            }
          );
          // Restyle confirm button to danger (red)
          var fb=document.querySelector('#modal-btns .btn-warning');
          if(fb) fb.className='btn btn-danger';
        } else {
          addMsg('❌ Failed: '+(data.error||''),'error');
        }
      });
    });
  }
}

function _doDeleteRemote(branchName, shortName){
  // Show live log popup
  var logId='del-remote-log';
  var logBox='<div id="'+logId+'" style="'
    +'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.6;'
    +'padding:12px 14px;border-radius:8px;min-height:100px;max-height:280px;'
    +'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    +'<span style="color:#94a3b8">⏳ Deleting remote branch origin/'+escapeHtml(shortName)+'...\n</span></div>';
  showModal('🗑 Deleting Remote Branch — <span style="font-size:12px;font-weight:400;color:#94a3b8">origin/'+escapeHtml(shortName)+'</span>',
    logBox, 'Please wait…', null);
  var closeBtn=document.querySelector('#modal-btns .btn-warning');
  if(closeBtn){closeBtn.disabled=true;closeBtn.style.opacity='0.4';}

  apiPost('/api/delete-branch',{name:branchName,scope:'remote'},function(data){
    var ld=document.getElementById(logId);
    var output=(data.output||data.error||'').trim();
    if(output&&ld){
      output.split('\n').forEach(function(line){
        if(!line.trim()) return;
        var col='#e2e8f0';
        if(/^(error:|fatal:|ERROR:)/i.test(line)) col='#f87171';
        else if(/^remote:|^To /i.test(line)) col='#67e8f9';
        else if(/deleted/i.test(line)) col='#4ade80';
        else if(/hint:/i.test(line)) col='#94a3b8';
        ld.innerHTML+='<span style="color:'+col+'">'+escapeHtml(line)+'</span>\n';
        ld.scrollTop=ld.scrollHeight;
      });
    }
    var cb=document.querySelector('#modal-btns .btn-warning');
    if(data.ok){
      if(ld) ld.innerHTML+='<span style="color:#4ade80;font-weight:700">✅ Remote branch deleted successfully!\n</span>';
      addMsg('🗑 Remote branch "'+shortName+'" deleted','success');
      loadBranches(1);
    }else{
      if(ld) ld.innerHTML+='<span style="color:#f87171;font-weight:700">❌ Failed: '+escapeHtml(data.error||'')+'</span>\n';
    }
    if(cb){cb.disabled=false;cb.style.opacity='';cb.textContent='Close';cb.onclick=closeModal;}
  });
}





function branchCheckoutClick(btn){
  var branchName = btn.getAttribute('data-branch');
  if (!branchName) return false;
  event.stopPropagation();
  checkoutBranch(branchName);
  return false;
}

function checkoutBranch(branchName){
  _showSpinner();
  fetch(API_BASE+'/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({branch:branchName})})
    .then(function(r){return r.json()})
    .then(function(data){
      _hideSpinner();
      if(data.ok){
        var el=document.getElementById('branch-name');
        if(el) el.textContent=branchName;
        addMsg('✅ Switched to ' + branchName, 'success');
        _reloadLog(1); loadFiles(); loadBranches(1);
        setTimeout(function(){ window.location.reload(); }, 800);
      } else {
        var err = data.error || '';
        if (err.indexOf('would be overwritten by checkout') !== -1) {
          _showForceCheckoutModal(branchName, err);
        } else {
          addMsg(t('switch_fail') + err, 'error');
        }
      }
    })
    .catch(function(e){
      _hideSpinner();
      addMsg(t('switch_fail')+(e.message||'network error'),'error');
    });
}

function _showForceCheckoutModal(branchName, errMsg) {
  // Parse affected files from the git error message
  var files = [];
  var lines = errMsg.split('\n');
  var inList = false;
  lines.forEach(function(line) {
    line = line.trim();
    if (line.indexOf('would be overwritten') !== -1) { inList = true; return; }
    if (inList && line && line.indexOf('Please commit') === -1 && line !== 'Aborting') {
      files.push(line);
    }
    if (line.indexOf('Please commit') !== -1) inList = false;
  });

  var fileListHtml = files.length
    ? '<ul style="margin:8px 0 0;padding-left:18px;font-size:11px;font-family:monospace;color:#dc2626;max-height:120px;overflow-y:auto">'
      + files.map(function(f){ return '<li>' + escapeHtml(f) + '</li>'; }).join('')
      + '</ul>'
    : '';

  showModalDouble(
    '⚠️ Checkout Blocked — Local Changes',
    '<p style="margin:0 0 8px;font-size:13px;color:#374151">'
    + 'Git refused to switch to <code style="background:#f3f4f6;padding:1px 5px;border-radius:3px">' + escapeHtml(branchName) + '</code> because these local file changes would be overwritten:</p>'
    + fileListHtml
    + '<div style="margin-top:12px;padding:10px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;font-size:12px;color:#991b1b">'
    + '⚠️ <strong>Force Checkout will DISCARD these local changes permanently.</strong><br>'
    + 'They are NOT stashed — this cannot be undone. Only proceed if you are sure you do not need these changes.'
    + '</div>',
    '🗑 Force Checkout (discard changes)',
    function() {
      _showSpinner();
      fetch(API_BASE+'/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({branch: branchName, force: true})
      }).then(function(r){ return r.json(); }).then(function(data) {
        _hideSpinner();
        if (data.ok) {
          var el = document.getElementById('branch-name');
          if (el) el.textContent = branchName;
          addMsg('✅ Force switched to ' + branchName + ' (local changes discarded)', 'success');
          setTimeout(function(){ window.location.reload(); }, 800);
        } else {
          addMsg('❌ Force checkout failed: ' + (data.error || ''), 'error');
        }
      }).catch(function(e) {
        _hideSpinner();
        addMsg('❌ Force checkout failed: ' + (e.message || ''), 'error');
      });
    },
    null, null,
    'btn-danger'
  );
}

function doCheckout(branchName, hadStash){
  apiPost('/api/checkout',{branch:branchName},function(data){
    if(data.ok){
      apiGet('/api/current-branch',function(bd){
        var branch = bd.branch;
        document.getElementById('branch-name').textContent = branch;
        if(hadStash){
          // Ask user whether to apply stashed changes to new branch
          showModalDouble(
            '📦 Stash detected',
            'Your uncommitted changes were stashed before switching.<br><br>'
            +'<b>Apply stash to <code>'+escapeHtml(branch)+'</code> now?</b><br>'
            +'<span style="font-size:12px;color:#6b7280">If conflicts occur you can resolve them manually.</span>',
            'Apply Stash',
            function(){
              apiPost('/api/stash-pop',{index:0},function(r){
                if(r.ok){
                  addMsg('✅ Switched to '+branch+' and applied stash','success');
                }else{
                  addMsg('⚠️ Switched to '+branch+' but stash apply failed: '+(r.error||''),'error');
                  addMsg('💡 Your changes are safe in stash[0]. Go to Stash tab to apply manually.','info');
                }
                setTimeout(function(){ window.location.reload(); }, 800);
              });
            },
            'Keep in Stash',
            function(){
              addMsg('✅ Switched to '+branch+'. Changes saved in stash[0] — apply from Stash tab when ready.','info');
              setTimeout(function(){ window.location.reload(); }, 800);
            },
            'btn-success','btn-secondary'
          );
        }else{
          addMsg(t('switch_to_branch') + branch, 'success');
          showToast(t('switch_to_branch') + branch, 'ok', 2000);
          setTimeout(function(){ window.location.reload(); }, 1500);
        }
      });
    }else{
      var err = data.error || data.stderr || '';
      if (err.indexOf('would be overwritten by checkout') !== -1) {
        _showForceCheckoutModal(branchName, err);
      } else {
        addMsg(t('switch_fail') + err, 'error');
      }
    }
  });
}

// ═══════════ Merge ═══════════
var _mergeCurrentMode = 'merge';

function mergeBranch(sourceBranch){
  var curBranch=document.getElementById('branch-name').textContent.trim();
  var defaultMsg='Merge branch \''+sourceBranch+'\' into '+curBranch;
  _mergeCurrentMode='merge';

  // ── Mode selector row ──────────────────────────────────────────────
  var html='<div class="merge-mode-selector">'
    +'<div class="merge-mode-tabs">'
    +'<button id="op-btn-merge" class="merge-mode-btn active" onclick="switchMergeMode(\'merge\')">⚡ Merge</button>'
    +'<button id="op-btn-rebase" class="merge-mode-btn" onclick="switchMergeMode(\'rebase\')">🔀 Rebase</button>'
    +'</div>'
    +'<button class="merge-help-btn" onclick="showMergeRebaseHelp()" title="'+(L==='zh'?'Merge 与 Rebase 的区别':'Learn about Merge vs Rebase')+'">?</button>'
    +'</div>';

  // ── Merge content ──────────────────────────────────────────────────
  html+='<div id="op-content-merge">'
    +'<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:10px;padding:14px 16px;margin-bottom:14px">'
    +'<div style="font-size:15px;font-weight:800;color:#b91c1c;margin-bottom:10px">⚠️ '+(L==='zh'?'高风险操作 — 请确认后再继续':'HIGH-RISK OPERATION — Read before continuing!')+'</div>'
    +'<div style="background:rgba(255,255,255,.6);border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:13px;line-height:1.8">'
    +(L==='zh'?'合并: ':'Merging: ')+'<span style="font-family:monospace;background:#fee2e2;color:#7c3aed;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(sourceBranch)+'</span>'
    +' &nbsp;→&nbsp; <span style="font-family:monospace;background:#dbeafe;color:#1d4ed8;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(curBranch)+'</span>'+(L==='zh'?' (当前)':' (current)')
    +'</div>'
    +'<ul style="margin:0 0 12px;padding-left:18px;font-size:13px;color:#7f1d1d;line-height:1.9">'
    +(L==='zh'
      ?'<li><b>'+escapeHtml(sourceBranch)+'</b> 的所有 commit 将被 <b>Squash 合并为一个新 commit</b></li>'
       +'<li>如有冲突，请在 <b>Conflicts 标签页</b> 解决</li>'
       +'<li>请确保本地改动已 <b>commit 或 stash</b></li>'
       +'<li>此操作会修改分支历史 — 请与团队确认</li>'
      :'<li>All commits from <b>'+escapeHtml(sourceBranch)+'</b> will be <b>squashed into one single commit</b></li>'
       +'<li>If conflicts arise, resolve them in the <b>Conflicts tab</b></li>'
       +'<li>Ensure all local changes are <b>committed or stashed</b> first</li>'
       +'<li>This modifies your branch history — coordinate with your team</li>')
    +'</ul>'
    +'</div>'
    +'<label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px">'+(L==='zh'?'Commit 消息':'Commit message')+' <span style="color:#dc2626">*</span></label>'
    +'<textarea id="merge-msg-input" rows="3" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box" placeholder="'+(L==='zh'?'必填 — 描述本次合并带来的内容':'Required — describe what this merge brings in')+'">'+escapeHtml(defaultMsg)+'</textarea>'
    +'</div>';

  // ── Rebase content ─────────────────────────────────────────────────
  html+='<div id="op-content-rebase" style="display:none">'
    +'<div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:10px;padding:14px 16px;margin-bottom:12px">'
    +'<div style="font-size:15px;font-weight:800;color:#1d4ed8;margin-bottom:10px">🔀 Rebase onto '+escapeHtml(sourceBranch)+'</div>'
    +'<div style="background:rgba(255,255,255,.7);border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:13px;line-height:1.8">'
    +(L==='zh'?'变基: ':'Rebasing: ')+'<span style="font-family:monospace;background:#dbeafe;color:#1d4ed8;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(curBranch)+'</span>'+(L==='zh'?' (当前)':' (current)')
    +' &nbsp;→&nbsp; onto <span style="font-family:monospace;background:#f0fdf4;color:#15803d;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(sourceBranch)+'</span>'
    +'</div>'
    +'<ul style="margin:0 0 12px;padding-left:18px;font-size:13px;color:#1e3a8a;line-height:1.9">'
    +(L==='zh'
      ?'<li>你的 commit 将被<b>逐一应用到</b> <code>'+escapeHtml(sourceBranch)+'</code> 的最新代码之上，保持历史线性整洁</li>'
       +'<li>如有冲突，请在 <b>Conflicts 标签页</b> 解决，然后 git rebase --continue</li>'
       +'<li>请确保本地改动已 <b>commit 或 stash</b></li>'
       +'<li>⚠️ 历史会被重写 — 若已推送到远端，需要 <b>Force Push</b></li>'
      :'<li>Your commits will be <b>replayed on top of</b> <code>'+escapeHtml(sourceBranch)+'</code> — keeps history linear and clean</li>'
       +'<li>If conflicts arise, resolve them in the <b>Conflicts tab</b>, then <code>git rebase --continue</code></li>'
       +'<li>Ensure all local changes are <b>committed or stashed</b> first</li>'
       +'<li>⚠️ History is rewritten — if already pushed, you will need to <b>Force Push</b></li>')
    +'</ul>'
    +'</div>'
    +'<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;font-size:13px;color:#92400e">'
    +(L==='zh'
      ?'💡 <b>Feature 分支推荐用法：</b>Rebase 让你的提交历史保持线性整洁，避免多余的 merge commit。'
      :'💡 <b>Recommended for feature branches:</b> Rebase keeps your commit history clean and avoids extra merge commits.')
    +'</div>'
    +'</div>';

  // ── Render modal ───────────────────────────────────────────────────
  document.getElementById('modal-title').innerHTML='⚡🔀 '+t('merge_op_title')
    +' &nbsp;<span style="font-size:12px;font-weight:400;color:#94a3b8">'+escapeHtml(sourceBranch)+' → '+escapeHtml(curBranch)+'</span>';
  document.getElementById('modal-msg').innerHTML=html;

  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var cancelBtn=document.createElement('button');
  cancelBtn.className='btn btn-secondary';
  cancelBtn.textContent='Cancel';
  cancelBtn.onclick=closeModal;
  btnsDiv.appendChild(cancelBtn);

  var confirmBtn=document.createElement('button');
  confirmBtn.id='merge-confirm-btn';
  confirmBtn.className='btn btn-warning';
  confirmBtn.textContent=L==='zh'?'立即 Merge':'Merge Now';
  confirmBtn.onclick=function(){
    if(_mergeCurrentMode==='rebase'){
      closeModal();
      _doRebase(sourceBranch,curBranch);
    }else{
      var msg=(document.getElementById('merge-msg-input')||{value:''}).value.trim();
      if(!msg){addMsg('Merge commit message is required','error');return;}
      closeModal();
      _doMerge(sourceBranch,curBranch,msg);
    }
  };
  btnsDiv.appendChild(confirmBtn);
  document.getElementById('modal-bg').classList.add('show');
}

function switchMergeMode(mode){
  _mergeCurrentMode=mode;
  var mergeBtn=document.getElementById('op-btn-merge');
  var rebaseBtn=document.getElementById('op-btn-rebase');
  var mergeContent=document.getElementById('op-content-merge');
  var rebaseContent=document.getElementById('op-content-rebase');
  var confirmBtn=document.getElementById('merge-confirm-btn');
  if(mode==='merge'){
    mergeBtn.classList.add('active'); rebaseBtn.classList.remove('active');
    mergeContent.style.display=''; rebaseContent.style.display='none';
    confirmBtn.textContent=L==='zh'?'立即 Merge':'Merge Now';
    confirmBtn.className='btn btn-warning';
  }else{
    rebaseBtn.classList.add('active'); mergeBtn.classList.remove('active');
    rebaseContent.style.display=''; mergeContent.style.display='none';
    confirmBtn.textContent=L==='zh'?'立即 Rebase':'Rebase Now';
    confirmBtn.className='btn btn-primary';
  }
}

function showMergeRebaseHelp(){
  var isZh=L==='zh';
  var body='<div class="mrh-section">'
    +'<div class="mrh-badge merge">⚡ Merge'+(isZh?' (Squash Merge)':' — Squash Merge')+'</div>'
    +'<p class="mrh-desc">'+(isZh
      ?'将源分支的<b>所有 commit 合并压缩为一个新 commit</b>，追加到当前分支。<br>历史中会出现一个清晰的 "merge 节点"，方便回溯。'
      :'<b>Combines all commits</b> from the source branch into a single new commit on your current branch.<br>Creates a clear merge boundary in history — easy to see when work was integrated.')
    +'</p>'
    +'<div>'
    +'<span class="mrh-tag good">'+(isZh?'✅ 适合合并 feature → develop/main':'✅ Merging feature → develop/main')+'</span>'
    +'<span class="mrh-tag good">'+(isZh?'✅ 历史保留清晰边界':'✅ Preserves clear history boundary')+'</span>'
    +'<span class="mrh-tag warn">'+(isZh?'⚠️ 会产生额外 merge commit':'⚠️ Creates an extra merge commit')+'</span>'
    +'</div>'
    +'</div>'
    +'<hr class="mrh-divider">'
    +'<div class="mrh-section">'
    +'<div class="mrh-badge rebase">🔀 Rebase</div>'
    +'<p class="mrh-desc">'+(isZh
      ?'将当前分支的 commit <b>逐一"搬运"到源分支的最新节点之上</b>，历史保持线性，没有多余的 merge 节点。<br>相当于"将你的工作建立在最新代码之上"。'
      :'<b>Replays your current branch\'s commits on top</b> of the latest commit on the source branch, creating a linear history with no extra merge commits.<br>Think of it as "re-building your work on top of the latest code".')
    +'</p>'
    +'<div>'
    +'<span class="mrh-tag good">'+(isZh?'✅ 历史线性整洁':'✅ Linear, clean history')+'</span>'
    +'<span class="mrh-tag good">'+(isZh?'✅ 同步 develop 最新代码':'✅ Stay up-to-date with develop')+'</span>'
    +'<span class="mrh-tag warn">'+(isZh?'⚠️ 改写 commit hash，需要 Force Push':'⚠️ Rewrites commits — requires Force Push')+'</span>'
    +'</div>'
    +'</div>'
    +'<hr class="mrh-divider">'
    +'<div class="mrh-rec">'
    +(isZh
      ?'<b>📌 推荐场景：</b><br>'
       +'• 将 feature 分支合并进 develop / main → 用 <b>Merge</b><br>'
       +'• 在 feature 开发中同步 develop 最新代码 → 用 <b>Rebase</b><br>'
       +'• 多人共享分支 → 用 <b>Merge</b>（避免 force push 覆盖他人工作）'
      :'<b>📌 Recommended usage:</b><br>'
       +'• Integrating a feature branch into develop / main → use <b>Merge</b><br>'
       +'• Keeping your feature branch up-to-date with develop → use <b>Rebase</b><br>'
       +'• Shared/collaborative branch → use <b>Merge</b> (avoid force push overwriting others\' work)')
    +'</div>';
  showModal(t('mrh_title'),body,'OK',null);
}

function _doMerge(sourceBranch,curBranch,msg){
  addMsg('🔀 Merging '+sourceBranch+' → '+curBranch+'...','info');
  apiPost('/api/merge',{branch:sourceBranch,message:msg},function(data){
    var logBox='<div style="background:#0f172a;color:#e2e8f0;font-family:monospace;font-size:12px;'
      +'line-height:1.6;padding:12px 14px;border-radius:8px;max-height:260px;overflow-y:auto;white-space:pre-wrap;margin-bottom:12px">'
      +escapeHtml((data.log||'').trim())+'</div>';
    if(data.ok){
      addMsg('✅ Merged '+sourceBranch+' into '+curBranch,'success');
      loadFiles();_reloadLog(1);checkConflicts();
      showModalDouble(
        '✅ Merge succeeded',
        logBox+'<b>Push <code>'+escapeHtml(curBranch)+'</code> to remote now?</b>',
        'Push Now',
        function(){ doPush(); },
        'Later (keep local)',
        null,
        'btn-success','btn-secondary'
      );
    }else if(data.alreadyUpToDate){
      addMsg('ℹ️ Already up to date — no changes to merge from '+sourceBranch,'info');
      showModal('ℹ️ Already Up To Date',
        '<div style="padding:12px 4px;color:#1e40af;font-size:14px">'+
        '✅ <b>'+escapeHtml(curBranch)+'</b> already contains all changes from <b>'+escapeHtml(sourceBranch)+'</b>.<br><br>'+
        'No merge commit was created.</div>',
        'OK', null);
    }else if(data.hasConflict){
      addMsg('⚠️ Merge conflicts detected in '+sourceBranch,'error');
      checkConflicts();
      showModal(
        '⚠️ Merge Conflicts!',
        logBox+'<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:10px 14px;color:#b91c1c;font-weight:600">'
        +'Conflicts detected — go to the <b>Conflicts tab</b> to resolve them before pushing.</div>',
        'Go to Conflicts',
        function(){ loadConflicts(); }
      );
    }else{
      var errMsg=data.error||'';
      var isOverwritten=errMsg.indexOf('overwritten by merge')>=0||errMsg.indexOf('would be overwritten')>=0;
      if(isOverwritten){
        addMsg('❌ '+t('merge_blocked_title')+': '+errMsg.split('\n')[0],'error');
        var stashDesc=t('merge_blocked_desc')
          +'<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:8px 12px;margin-top:10px;font-family:monospace;font-size:11px;color:#78350f;max-height:120px;overflow-y:auto;white-space:pre-wrap">'
          +escapeHtml(errMsg)+'</div>';
        document.getElementById('modal-title').innerHTML=t('merge_blocked_title');
        document.getElementById('modal-msg').innerHTML=stashDesc;
        var btnsDiv2=document.getElementById('modal-btns');
        btnsDiv2.innerHTML='';
        var cancelB=document.createElement('button');
        cancelB.className='btn btn-secondary';cancelB.textContent='Cancel';cancelB.onclick=closeModal;
        btnsDiv2.appendChild(cancelB);
        var stashRetryBtn=document.createElement('button');
        stashRetryBtn.className='btn btn-warning';
        stashRetryBtn.textContent=t('stash_and_retry');
        stashRetryBtn.onclick=function(){
          closeModal();
          showStashDialog(null,function(){ setTimeout(function(){ mergeBranch(sourceBranch); },300); });
        };
        btnsDiv2.appendChild(stashRetryBtn);
        document.getElementById('modal-bg').classList.add('show');
      }else{
        addMsg('❌ Merge failed: '+errMsg,'error');
        showModal('❌ Merge Failed',logBox,'Close',null);
      }
    }
  });
}

function _doRebase(sourceBranch,curBranch){
  // ── After rebase: check for unsigned commits, offer to squash, then push ──
  function checkUnsignedAndPush(logBox){
    apiGet('/api/unsigned-commit-list?base='+encodeURIComponent(sourceBranch),function(info){
      var unsigned=(info&&info.unsigned)||[];
      if(unsigned.length===0){ showForcePushPrompt(logBox); return; }

      // ── Dialog 1: list unsigned commits and ask whether to squash ──
      var rows='';
      unsigned.slice(0,10).forEach(function(c){
        rows+='<tr>'
          +'<td style="font-family:monospace;color:#7c3aed;padding:2px 8px 2px 0;white-space:nowrap">'+escapeHtml(c.short)+'</td>'
          +'<td style="color:#374151;padding:2px 0;line-height:1.4">'+escapeHtml(c.subject)+'</td>'
          +'</tr>';
      });
      var extra=unsigned.length>10
        ?'<tr><td colspan="2" style="color:#6b7280;font-style:italic;padding-top:4px">…and '+(unsigned.length-10)+' more</td></tr>':'';

      var bodyHtml=
        '<div style="background:#fef9c3;border:2px solid #fbbf24;border-radius:10px;padding:14px 16px;margin-bottom:12px">'
        +'<div style="font-size:14px;font-weight:800;color:#92400e;margin-bottom:8px">🔓 '
        +(L==='zh'
          ?'Rebase 后检测到 <b>'+unsigned.length+'</b> 个未签名 commit'
          :'Found <b>'+unsigned.length+'</b> unsigned commit(s) after rebase')
        +'</div>'
        +'<div style="font-size:13px;color:#78350f;margin-bottom:10px;line-height:1.6">'
        +(L==='zh'
          ?'以下 commit 缺少 GPG 签名。你可以将它们 <b>Squash</b> 成一个签名 commit，或直接跳过继续推送。'
          :'The following commits are missing GPG signatures. You can <b>squash</b> them into one signed commit, or skip and push as-is.')
        +'</div>'
        +'<div style="overflow-x:auto;max-height:180px;overflow-y:auto"><table style="font-size:12px;width:100%;border-collapse:collapse">'
        +rows+extra+'</table></div>'
        +'</div>';

      document.getElementById('modal-title').innerHTML='🔓 '+(L==='zh'?'发现未签名 Commits':'Unsigned Commits Detected');
      document.getElementById('modal-msg').innerHTML=bodyHtml;
      var btnsDiv=document.getElementById('modal-btns');
      btnsDiv.innerHTML='';

      var skipBtn=document.createElement('button');
      skipBtn.className='btn btn-secondary';
      skipBtn.textContent=L==='zh'?'跳过，直接推送':'Skip, push as-is';
      skipBtn.onclick=function(){ closeModal(); showForcePushPrompt(logBox); };

      var squashBtn=document.createElement('button');
      squashBtn.className='btn btn-warning';
      squashBtn.textContent=L==='zh'?'✅ Squash 未签名 Commits':'✅ Squash Unsigned Commits';
      squashBtn.onclick=function(){
        closeModal();
        // ── Dialog 2: second confirmation before squashing ──
        var confirmBody=
          '<div style="font-size:14px;line-height:1.7;color:#1e293b">'
          +(L==='zh'
            ?'确认将当前分支 <b>'+escapeHtml(curBranch)+'</b> 上相对 <b>'+escapeHtml(sourceBranch)+'</b> 的所有 commit squash 成 <b>1 个签名 commit</b>？<br><br>'
             +'<span style="color:#ef4444;font-size:12px">⚠️ 此操作将重写分支历史，无法撤销。</span>'
            :'Confirm: squash all commits on <b>'+escapeHtml(curBranch)+'</b> above <b>'+escapeHtml(sourceBranch)+'</b> into <b>1 signed commit</b>?<br><br>'
             +'<span style="color:#ef4444;font-size:12px">⚠️ This rewrites branch history and cannot be undone.</span>')
          +'</div>';
        showModalDouble(
          L==='zh'?'⚠️ 确认 Squash':'⚠️ Confirm Squash',
          confirmBody,
          L==='zh'?'确认 Squash':'Confirm Squash',
          function(){
            addMsg(L==='zh'?'🔀 正在 squash 未签名 commits...':'🔀 Squashing unsigned commits...','info');
            apiPost('/api/squash-unsigned',{base:sourceBranch},function(sq){
              if(sq.ok){
                addMsg((L==='zh'?'✅ Squash 完成: ':'✅ Squash done: ')+(sq.message||''),'success');
                _reloadLog(1);
                showForcePushPrompt(logBox);
              }else{
                addMsg((L==='zh'?'❌ Squash 失败: ':'❌ Squash failed: ')+(sq.error||''),'error');
                showForcePushPrompt(logBox);
              }
            });
          },
          L==='zh'?'取消':'Cancel',
          function(){ showForcePushPrompt(logBox); },
          'btn-danger','btn-secondary'
        );
      };

      btnsDiv.appendChild(skipBtn);
      btnsDiv.appendChild(squashBtn);
      document.getElementById('modal-bg').classList.add('show');
    });
  }

  function showForcePushPrompt(logBox){
    _lastRebaseForcePushContext = {
      baseBranch: sourceBranch,
      branch: curBranch,
      at: Date.now()
    };
    var pushDesc=tf('rebase_push_desc',L,{branch:curBranch});
    showModalDouble(
      t('rebase_ok_title'),
      logBox+'<div style="background:#fff7ed;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;font-size:13px;color:#92400e;margin-bottom:8px">'
      +(L==='zh'?'⚠️ Rebase 重写了 commit 历史，若已推送到远端需要 <b>Force Push</b>。':'⚠️ Rebase rewrites commit history. If you already pushed, you need to <b>Force Push</b>.')
      +'</div><b>'+pushDesc+'</b>',
      L==='zh'?'Force Push 到远端':'Force Push to Remote',
      function(){ doPushForce(); },
      L==='zh'?'稍后手动推送':'Later (push manually)',
      null,
      'btn-warning','btn-secondary'
    );
  }

  function runRebase(stashedBeforeRebase){
    addMsg(t('rebase_progress')+sourceBranch+'...','info');
    apiPost('/api/rebase',{branch:sourceBranch},function(data){
      var logBox='<div style="background:#0f172a;color:#e2e8f0;font-family:monospace;font-size:12px;'
        +'line-height:1.6;padding:12px 14px;border-radius:8px;max-height:260px;overflow-y:auto;white-space:pre-wrap;margin-bottom:12px">'
        +escapeHtml((data.log||'').trim())+'</div>';
      if(data.ok){
        if(data.alreadyUpToDate){
          addMsg(t('rebase_up_to_date'),'info');
          showModal('ℹ️ '+(L==='zh'?'已是最新':'Already Up To Date'),
            '<div style="padding:12px 4px;color:#1e40af;font-size:14px">✅ <b>'+escapeHtml(curBranch)+'</b> '
            +(L==='zh'?'已包含 <b>'+escapeHtml(sourceBranch)+'</b> 的所有最新代码，无需 Rebase。'
              :'is already up to date with <b>'+escapeHtml(sourceBranch)+'</b>. Nothing to rebase.')+'</div>',
            'OK',null);
          return;
        }

        addMsg(t('rebase_ok'),'success');
        loadFiles();_reloadLog(1);checkConflicts();

        if(stashedBeforeRebase){
          showModalDouble(
            L==='zh'?'📦 Rebase 完成，恢复 Stash？':'📦 Rebase done, restore stash?',
            logBox+'<div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:10px 14px;font-size:13px;color:#1e3a8a;margin-bottom:8px">'
            +(L==='zh'
              ?'检测到你在 Rebase 前已自动 Stash 本地改动。建议现在执行 <b>stash pop</b>。'
              :'Your local changes were stashed before rebase. It is recommended to run <b>stash pop</b> now.')
            +'</div>',
            L==='zh'?'现在 Pop Stash':'Pop Stash Now',
            function(){
              apiPost('/api/stash-pop',{index:0},function(popData){
                if(popData.ok){
                  addMsg(L==='zh'?'✅ Stash 已恢复':'✅ Stash restored','success');
                  loadFiles();
                  checkUnsignedAndPush(logBox);
                  return;
                }
                var popErr=popData.error||'';
                var isConflict=popErr.indexOf('CONFLICT')>=0||popErr.toLowerCase().indexOf('conflict')>=0;
                if(isConflict){
                  addMsg(L==='zh'?'⚠️ Stash pop 出现冲突，请到 Conflicts 标签页解决':'⚠️ Stash pop has conflicts — go to Conflicts tab','error');
                  checkConflicts();
                  loadConflicts();
                }else{
                  addMsg((L==='zh'?'❌ Stash pop 失败: ':'❌ Stash pop failed: ')+popErr,'error');
                }
              });
            },
            L==='zh'?'稍后手动处理':'Later',
            function(){ checkUnsignedAndPush(logBox); },
            'btn-primary','btn-secondary'
          );
          return;
        }

        checkUnsignedAndPush(logBox);
      }else if(data.hasConflict || data.rebaseInProgress){
        addMsg(t('rebase_conflict_title')+' '+sourceBranch,'error');
        if(stashedBeforeRebase){
          addMsg(L==='zh'
            ?'ℹ️ 你 Rebase 前的本地改动已在 Stash 中。先解决当前 Rebase 冲突，完成后再 Pop。'
            :'ℹ️ Your pre-rebase local changes are safely in stash. Resolve rebase conflicts first, then pop stash.',
            'info');
        }
        checkConflicts();
        _showRebaseFailureModal(t('rebase_conflict_title'), logBox, true);
      }else{
        var errTxt=(data.error||'');
        var needStashBeforeRebase=/cannot rebase:.*unstaged changes|Please commit or stash them|uncommitted changes/i.test(errTxt);
        if(needStashBeforeRebase){
          addMsg(L==='zh'?'⚠️ Rebase 前需要先 stash 或 commit 本地改动':'⚠️ Rebase requires stashing or committing local changes first','error');
          showModalDouble(
            L==='zh'?'⚠️ 本地改动阻止 Rebase':'⚠️ Local changes block rebase',
            logBox+'<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:10px 14px;color:#92400e;font-size:13px;margin-bottom:8px">'
            +(L==='zh'
              ?'检测到未提交改动。建议先执行 <b>Stash</b>，再自动重试 Rebase。'
              :'Uncommitted local changes detected. Stash first, then retry rebase.')
            +'</div>',
            L==='zh'?'📦 Stash & Retry Rebase':'📦 Stash & Retry Rebase',
            function(){
              var stashMsg='auto-stash-before-rebase-retry-'+Date.now();
              addMsg(L==='zh'?'📦 正在 stash 本地改动...':'📦 Stashing local changes...','info');
              apiPost('/api/stash',{message:stashMsg},function(sd){
                if(!sd.ok){
                  addMsg((L==='zh'?'❌ Stash 失败: ':'❌ Stash failed: ')+(sd.error||''),'error');
                  return;
                }
                addMsg(L==='zh'?'✅ 已 stash，正在重试 Rebase':'✅ Stashed. Retrying rebase','info');
                runRebase(true);
              });
            },
            L==='zh'?'取消':'Cancel',
            null,
            'btn-warning','btn-secondary'
          );
          return;
        }
        addMsg(t('rebase_fail_title')+': '+errTxt,'error');
        showModal(t('rebase_fail_title'),logBox,'Close',null);
      }
    });
  }

  // ── Pre-flight: detect merge commits / foreign commits in branch history ──
  function runWithPreflightCheck(){
    addMsg(L==='zh'?'🔍 正在检查分支历史安全性...':'🔍 Checking branch history safety...','info');
    apiPost('/api/rebase-preflight',{branch:sourceBranch},function(pf){
      var hasRisk=(pf.hasMergeCommits||((pf.foreignCommits||[]).length>0));
      if(!hasRisk){ checkUncommittedAndRebase(); return; }

      // Build warning HTML
      var foreignRows='';
      (pf.foreignCommits||[]).slice(0,8).forEach(function(c){
        foreignRows+='<tr><td style="font-family:monospace;color:#7c3aed;padding:2px 8px 2px 0">'+escapeHtml(c.hash)+'</td>'
          +'<td style="color:#b91c1c;padding:2px 8px 2px 0">'+escapeHtml(c.author)+'</td>'
          +'<td style="color:#374151">'+escapeHtml(c.subject)+'</td></tr>';
      });
      var extraRows=(pf.foreignCommits||[]).length>8
        ?'<tr><td colspan="3" style="color:#6b7280;font-style:italic">… and '+((pf.foreignCommits||[]).length-8)+' more</td></tr>':'';

      var warnHtml='<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:10px;padding:14px 16px;margin-bottom:12px">'
        +'<div style="font-size:14px;font-weight:800;color:#b91c1c;margin-bottom:8px">⚠️ '
        +(L==='zh'?'Rebase 风险：分支历史包含其他人的 commit':'Rebase Risk: Branch contains other authors\' commits')+'</div>'
        +'<div style="font-size:13px;color:#7f1d1d;line-height:1.7;margin-bottom:10px">'
        +(L==='zh'
          ?'当前分支历史中包含 <b>'+((pf.foreignCommits||[]).length)+'</b> 个其他人的 commit（可能是之前执行过 <code>git merge</code> 导致的）。'
           +'直接 Rebase 会把这些 commit <b>重新写入到本分支</b>，导致分支混入他人代码。<br><br>'
           +'<b>推荐做法：</b>使用 <b>Rebuild & Force Push</b>，它会自动识别并只保留属于你的 commit。'
          :'The branch history contains <b>'+((pf.foreignCommits||[]).length)+'</b> commit(s) from other authors '
           +'(likely caused by a previous <code>git merge</code>). A plain rebase will <b>re-apply all of them</b> onto the new base, '
           +'polluting this branch with other people\'s code.<br><br>'
           +'<b>Recommended:</b> Use <b>Rebuild & Force Push</b> — it keeps only YOUR commits.')
        +'</div>'
        +(foreignRows?'<div style="overflow-x:auto;max-height:160px;overflow-y:auto"><table style="font-size:12px;width:100%;border-collapse:collapse">'
          +foreignRows+extraRows+'</table></div>':'')
        +(pf.hasMergeCommits?'<div style="margin-top:8px;font-size:12px;color:#7f1d1d">⚠️ '
          +(L==='zh'?'检测到 merge commit，这是引发该问题的直接原因。':'Merge commit(s) detected in branch — this is the direct cause of the issue.')+'</div>':'')
        +'</div>';

      document.getElementById('modal-title').innerHTML='⚠️ '+(L==='zh'?'Rebase 安全警告':'Rebase Safety Warning');
      document.getElementById('modal-msg').innerHTML=warnHtml;
      var btnsDiv=document.getElementById('modal-btns');
      btnsDiv.innerHTML='';

      var cancelBtn2=document.createElement('button');
      cancelBtn2.className='btn btn-secondary';
      cancelBtn2.textContent='Cancel';
      cancelBtn2.onclick=closeModal;

      var forceBtn=document.createElement('button');
      forceBtn.className='btn btn-danger';
      forceBtn.textContent=L==='zh'?'⚠️ 仍然 Rebase（不推荐）':'⚠️ Rebase Anyway (not recommended)';
      forceBtn.onclick=function(){ closeModal(); checkUncommittedAndRebase(); };

      var rebuildBtn=document.createElement('button');
      rebuildBtn.className='btn btn-warning';
      rebuildBtn.textContent=L==='zh'?'✅ Rebuild & Force Push（推荐）':'✅ Rebuild & Force Push (recommended)';
      rebuildBtn.onclick=function(){
        closeModal();
        var gpgOn=(document.getElementById('gpg-sign-toggle')||{}).checked;
        var gpgNote=gpgOn
          ?(L==='zh'
            ?'<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 12px;margin-top:10px;color:#166534;font-size:12px">🔏 GPG 签名已开启 — cherry-pick 会自动附加签名</div>'
            :'<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 12px;margin-top:10px;color:#166534;font-size:12px">🔏 GPG signing is ON — the cherry-picked commit will be signed automatically</div>')
          :(L==='zh'
            ?'<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:8px 12px;margin-top:10px;color:#92400e;font-size:12px">⚠️ GPG 签名未开启 — 如果远端要求签名验证，push 仍会被拒绝。建议先在右上角打开 GPG 开关再继续。</div>'
            :'<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:8px 12px;margin-top:10px;color:#92400e;font-size:12px">⚠️ GPG signing is OFF — if the remote requires verified signatures the push will still be rejected. Enable the GPG toggle first.</div>');
        var confirmBody=(L==='zh'
          ?'<p style="margin:0 0 6px;font-size:13px;color:#374151">将执行以下操作，仅保留当前 HEAD commit：<br>'
            +'<code>git reset --hard '+escapeHtml(sourceBranch)+'</code><br>'
            +'<code>git cherry-pick HEAD</code><br>'
            +'<code>git push --force-with-lease</code></p>'
          :'<p style="margin:0 0 6px;font-size:13px;color:#374151">This will run:<br>'
            +'<code>git reset --hard '+escapeHtml(sourceBranch)+'</code><br>'
            +'<code>git cherry-pick HEAD</code><br>'
            +'<code>git push --force-with-lease</code><br>'
            +'Only the current HEAD commit is kept.</p>')
          + gpgNote;
        showModal(
          L==='zh'?'🛠 确认 Rebuild & Force Push':'🛠 Confirm Rebuild & Force Push',
          confirmBody,
          L==='zh'?'确认执行':'Proceed',
          function(){
            closeModal();
            addMsg(L==='zh'?'🔨 正在 Rebuild 分支...':'🔨 Rebuilding branch...','info');
            apiPost('/api/rebase-rebuild-force-push',{base_branch:sourceBranch},function(rd){
              if(rd.ok){
                addMsg(L==='zh'?'✅ Rebuild & Force Push 成功，分支已清理干净':'✅ Rebuild & Force Push succeeded — branch is clean','success');
                _reloadLog(1);loadFiles();
              }else{
                addMsg((L==='zh'?'❌ Rebuild 失败: ':'❌ Rebuild failed: ')+(rd.error||''),'error');
              }
            });
          }
        );
      };

      btnsDiv.appendChild(cancelBtn2);
      btnsDiv.appendChild(forceBtn);
      btnsDiv.appendChild(rebuildBtn);
      document.getElementById('modal-bg').classList.add('show');
    });
  }

  function checkUncommittedAndRebase(){
    apiGet('/api/has-uncommitted',function(hasData){
      if(!(hasData&&hasData.hasChanges)){ runRebase(false); return; }
    document.getElementById('modal-title').innerHTML=L==='zh'?'🔒 检测到本地未提交改动':'🔒 Local Changes Detected';
    document.getElementById('modal-msg').innerHTML='<div style="font-size:14px;line-height:1.7">'
      +(L==='zh'
        ?'Rebase 前建议先把当前本地修改保存到 Stash。<br><br><b>📦 Stash & Rebase</b>：先 stash，再 rebase；完成后会提示你 pop。<br><b>🔀 Rebase Anyway</b>：不 stash 直接 rebase（可能失败或冲突）。'
        :'Before rebasing, it is recommended to stash local changes first.<br><br><b>📦 Stash & Rebase</b>: stash first, then rebase; you will be prompted to pop stash afterward.<br><b>🔀 Rebase Anyway</b>: run rebase without stashing (may fail or conflict).')
      +'</div>';
    var btnsDiv=document.getElementById('modal-btns');
    btnsDiv.innerHTML='';
    var cancelBtn=document.createElement('button');
    cancelBtn.className='btn btn-secondary';
    cancelBtn.textContent='Cancel';
    cancelBtn.onclick=closeModal;
    var rebaseBtn=document.createElement('button');
    rebaseBtn.className='btn btn-primary';
    rebaseBtn.textContent=L==='zh'?'🔀 Rebase Anyway':'🔀 Rebase Anyway';
    rebaseBtn.onclick=function(){ closeModal(); runRebase(false); };
    var stashBtn=document.createElement('button');
    stashBtn.className='btn btn-warning';
    stashBtn.textContent=L==='zh'?'📦 Stash & Rebase':'📦 Stash & Rebase';
    stashBtn.onclick=function(){
      closeModal();
      var stashMsg='auto-stash-before-rebase-'+Date.now();
      addMsg(L==='zh'?'📦 正在 stash 本地改动...':'📦 Stashing local changes...','info');
      apiPost('/api/stash',{message:stashMsg},function(sd){
        if(!sd.ok){
          addMsg((L==='zh'?'❌ Stash 失败: ':'❌ Stash failed: ')+(sd.error||''),'error');
          return;
        }
        addMsg(L==='zh'?'✅ 已 stash，本次将继续 Rebase':'✅ Stashed. Continuing rebase','info');
        runRebase(true);
      });
    };
    btnsDiv.appendChild(cancelBtn);
    btnsDiv.appendChild(rebaseBtn);
    btnsDiv.appendChild(stashBtn);
    document.getElementById('modal-bg').classList.add('show');
  });
  } // end checkUncommittedAndRebase

  runWithPreflightCheck();
}

// ═══════════ Rebase failure quick actions ═══════════
function _showRebaseFailureModal(title, logBox, hasConflict){
  var isZh=L==='zh';

  var conflictBar=hasConflict
    ?'<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:10px 14px;color:#b91c1c;font-weight:600;margin-bottom:12px">'
      +(isZh
        ?'检测到冲突 — 请前往 <b>Conflicts 标签页</b> 解决冲突，然后使用下方快速操作继续。'
        :'Conflicts detected — go to the <b>Conflicts tab</b> to resolve them, then use the quick actions below.')
      +'</div>'
    :'';

  var actionsHtml=
    '<div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:14px 16px">'
    +'<div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:6px">'+t('rebase_actions_title')+'</div>'
    +'<div style="font-size:12px;color:#64748b;margin-bottom:12px">'+t('rebase_actions_hint')+'</div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'

    // Abort button
    +'<button onclick="_rebaseAction(\'abort\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #ef4444;background:#fff5f5;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:flex-start;gap:10px">'
    +'<span style="font-size:18px;flex-shrink:0">🛑</span>'
    +'<div><div style="font-weight:700;color:#dc2626">'+t('rebase_abort_btn')+'</div>'
    +'<div style="font-size:11px;color:#6b7280;margin-top:3px;line-height:1.5">'
    +(isZh?'撤销所有 Rebase 进度，恢复到 Rebase 前的状态。':'Undo all rebase progress and restore your branch to its pre-rebase state.')
    +'</div></div></button>'

    // Skip button
    +'<button onclick="_rebaseAction(\'skip\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #f59e0b;background:#fffbeb;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:flex-start;gap:10px">'
    +'<span style="font-size:18px;flex-shrink:0">⏭️</span>'
    +'<div><div style="font-weight:700;color:#b45309">'+t('rebase_skip_btn')+'</div>'
    +'<div style="font-size:11px;color:#6b7280;margin-top:3px;line-height:1.5">'
    +(isZh?'跳过当前冲突提交并继续（被跳过的提交改动将永久丢失）。':'Skip the current conflicting commit and continue (skipped changes are permanently lost).')
    +'</div></div></button>'

    // Continue button (always shown — user may have resolved conflicts externally)
    +'<button onclick="_rebaseAction(\'continue\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #10b981;background:#f0fdf4;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:flex-start;gap:10px">'
    +'<span style="font-size:18px;flex-shrink:0">▶️</span>'
    +'<div><div style="font-weight:700;color:#059669">'+t('rebase_continue_btn')+'</div>'
    +'<div style="font-size:11px;color:#6b7280;margin-top:3px;line-height:1.5">'
    +(isZh?'解决所有冲突并 git add 后继续 Rebase。':'After resolving all conflicts and git add, continue the rebase.')
    +'</div></div></button>'

    +'</div></div>';

  // Build modal with custom buttons
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=logBox+conflictBar+actionsHtml;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';

  if(hasConflict){
    var goConflictsBtn=document.createElement('button');
    goConflictsBtn.className='btn btn-primary';
    goConflictsBtn.textContent=isZh?'去解决冲突':'Go to Conflicts';
    goConflictsBtn.onclick=function(){ closeModal(); loadConflicts(); };
    btnsDiv.appendChild(goConflictsBtn);
  }

  var closeBtn=document.createElement('button');
  closeBtn.className='btn btn-secondary';
  closeBtn.textContent=isZh?'关闭':'Close';
  closeBtn.onclick=closeModal;
  btnsDiv.appendChild(closeBtn);

  document.getElementById('modal-bg').classList.add('show');
}

function _rebaseAction(action){
  var isZh=L==='zh';
  var titleKey='rebase_'+action+'_confirm_title';
  var descKey='rebase_'+action+'_confirm_desc';
  var okKey='rebase_'+action+'_ok';
  var failKey='rebase_'+action+'_fail';
  var endpoint='/api/rebase-'+action;
  var btnClass=action==='abort'?'btn-danger':action==='skip'?'btn-warning':'btn-success';

  document.getElementById('modal-title').innerHTML=t(titleKey);
  document.getElementById('modal-msg').innerHTML='<div style="font-size:13px;color:#374151;line-height:1.7">'+t(descKey)+'</div>';
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';

  var cancelBtn=document.createElement('button');
  cancelBtn.className='btn btn-secondary';
  cancelBtn.textContent=isZh?'取消':'Cancel';
  cancelBtn.onclick=closeModal;
  btnsDiv.appendChild(cancelBtn);

  var confirmBtn=document.createElement('button');
  confirmBtn.className='btn '+btnClass;
  confirmBtn.textContent=t('rebase_confirm_btn');
  confirmBtn.onclick=function(){
    closeModal();
    apiPost(endpoint, {}, function(data){
      if(data.ok){
        addMsg(t(okKey),'success');
        loadFiles(); _reloadLog(1); checkConflicts(); loadCurrentBranch();
        if(action==='continue') checkConflicts();
      }else{
        var errMsg=t(failKey)+(data.error||'');
        addMsg(errMsg,'error');
        if(data.hasConflict){
          checkConflicts();
          showModal(
            isZh?'⚠️ 仍有冲突':'⚠️ Conflicts Remain',
            '<div style="font-size:13px;color:#374151">'
            +(isZh?'Rebase 继续后仍发现冲突，请前往 <b>Conflicts 标签页</b> 继续解决。'
                  :'Conflicts remain after continuing — go to the <b>Conflicts tab</b> to resolve them.')
            +'</div>',
            isZh?'去解决冲突':'Go to Conflicts',
            function(){ loadConflicts(); }
          );
        }else{
          showModal(isZh?'❌ 操作失败':'❌ Action Failed',
            '<div style="font-size:13px;color:#374151">'+escapeHtml(data.error||'Unknown error')+'</div>',
            'Close', null);
        }
      }
    });
  };
  btnsDiv.appendChild(confirmBtn);
  document.getElementById('modal-bg').classList.add('show');
}

// ═══════════ Compare ═══════════
var _cmpLocalBranches=[];
var _cmpRemoteBranches=[];
var _cmpSelSource={base:'remote', head:'remote'};
var _cmpRequestSeq=0;

function _renderCmpSourceButtons(sel){
  var src=_cmpSelSource[sel];
  var prefix=sel==='base'?'cmp-base':'cmp-head';
  document.getElementById(prefix+'-remote').className='btn btn-sm '+(src==='remote'?'btn-primary':'btn-secondary');
  document.getElementById(prefix+'-local').className='btn btn-sm '+(src==='local'?'btn-primary':'btn-secondary');
}

function setCmpSelSource(sel, src){
  _cmpSelSource[sel]=src;
  _renderCmpSourceButtons(sel);
  var selEl=document.getElementById(sel==='base'?'compare-base-sel':'compare-head-sel');
  var cur=selEl.value;
  var list=src==='remote'?_cmpRemoteBranches:_cmpLocalBranches;
  selEl.innerHTML='';
  list.forEach(function(n){
    var o=document.createElement('option');o.value=n;o.textContent=n;
    // Try to keep same branch selected (strip origin/ for matching)
    if(n===cur||n.replace(/^origin\//,'')===(cur||'').replace(/^origin\//,''))o.selected=true;
    selEl.appendChild(o);
  });
  runCompare();
}

function _cmpLocalName(name){
  return (name||'').replace(/^origin\//,'');
}

function _fillSel(selEl, list, prefer){
  selEl.innerHTML='';
  list.forEach(function(n){
    var o=document.createElement('option');o.value=n;o.textContent=n;
    if(n===prefer||n.replace(/^origin\//,'')===(prefer||'').replace(/^origin\//,''))o.selected=true;
    selEl.appendChild(o);
  });
}

function openCompare(headBranch, headSource){
  switchPage('compare');
  apiGet('/api/branches?page=1&per_page=0',function(data){
    _cmpLocalBranches=(data.local||[]).map(function(b){return b.name});
    _cmpRemoteBranches=(data.remote||[]).map(function(b){return b.name});
    var curBranch=document.getElementById('branch-name').textContent.trim();
    _cmpSelSource={base:headSource||'remote',head:'local'};
    _renderCmpSourceButtons('base');
    _renderCmpSourceButtons('head');
    _fillSel(document.getElementById('compare-base-sel'),
      _cmpSelSource.base==='remote'?_cmpRemoteBranches:_cmpLocalBranches, headBranch);
    _fillSel(document.getElementById('compare-head-sel'),
      _cmpSelSource.head==='remote'?_cmpRemoteBranches:_cmpLocalBranches, curBranch);
    runCompare();
  });
}
function swapCompare(){
  var b=document.getElementById('compare-base-sel');
  var h=document.getElementById('compare-head-sel');
  var baseValue=b.value, headValue=h.value;
  var baseSource=_cmpSelSource.base, headSource=_cmpSelSource.head;
  _cmpSelSource.base=headSource;
  _cmpSelSource.head=baseSource;
  _fillSel(b, _cmpSelSource.base==='remote'?_cmpRemoteBranches:_cmpLocalBranches, headValue);
  _fillSel(h, _cmpSelSource.head==='remote'?_cmpRemoteBranches:_cmpLocalBranches, baseValue);
  _renderCmpSourceButtons('base');
  _renderCmpSourceButtons('head');
  runCompare();
}
function runCompare(){
  var base=document.getElementById('compare-base-sel').value;
  var head=document.getElementById('compare-head-sel').value;
  var baseSource=_cmpSelSource.base;
  var headSource=_cmpSelSource.head;
  var requestSeq=++_cmpRequestSeq;
  if(!base||!head)return;
  document.getElementById('compare-summary').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff...</div>';
  document.getElementById('compare-diff-area').innerHTML='';
  document.getElementById('compare-file-sidebar').innerHTML='';
  document.getElementById('compare-merge-btn-wrap').innerHTML='';
  apiGet('/api/compare?base='+encodeURIComponent(base)+'&head='+encodeURIComponent(head)
    +'&base_source='+encodeURIComponent(baseSource)+'&head_source='+encodeURIComponent(headSource),function(data){
    if(requestSeq!==_cmpRequestSeq) return;
    var curBranch=document.getElementById('branch-name').textContent.trim();
    if(data.error){
      document.getElementById('compare-summary').innerHTML=
        '<div style="padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#b91c1c;font-weight:600">'
        +'❌ '+escapeHtml(data.error)+'</div>';
      document.getElementById('compare-file-sidebar').innerHTML='';
      document.getElementById('compare-diff-area').innerHTML='';
      return;
    }

    // ── Summary ──
    var identical=!data.diff||!data.diff.trim();
    var sumHtml='<div style="display:flex;align-items:center;gap:12px;padding:8px 14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;flex-wrap:wrap;font-size:13px">';
    sumHtml+='<span>🅰️ <b style="color:#1d4ed8">'+escapeHtml(base)+'</b></span>';
    sumHtml+='<span style="color:#9ca3af">vs</span>';
    sumHtml+='<span>🅱️ <b style="color:#7c3aed">'+escapeHtml(head)+'</b></span>';
    sumHtml+='<span style="color:#9ca3af;margin-left:4px">│</span>';
    if(identical){
      sumHtml+='<span style="color:#16a34a;font-weight:700">✅ Branch A has no unique changes vs Branch B</span>';
    }else{
      sumHtml+='<span style="color:#374151">📄 <b>'+data.file_count+'</b> file(s)</span>';
      var totalAdd=(data.diff.match(/^\+[^+]/mg)||[]).length;
      var totalDel=(data.diff.match(/^-[^-]/mg)||[]).length;
      if(totalAdd) sumHtml+='<span style="color:#16a34a;font-weight:700">+'+totalAdd+'</span>';
      if(totalDel) sumHtml+='<span style="color:#dc2626;font-weight:700">−'+totalDel+'</span>';
      if(data.commits&&data.commits.length)
        sumHtml+='<span style="color:#6b7280;font-size:12px">'+data.commits.length+' commit(s) unique to Branch A</span>';
      sumHtml+='<span style="font-size:11px;color:#9ca3af;margin-left:4px">🟢 green = A added &nbsp; 🔴 red = A removed</span>';
    }
    sumHtml+='</div>';
    sumHtml+='<div style="margin-top:4px;font-family:monospace;font-size:11px;color:#9ca3af;padding:3px 8px;background:#f1f5f9;border-radius:4px">'
      +'📂 cwd: '+escapeHtml(data.cwd||'?')
      +' &nbsp;│&nbsp; $ '+escapeHtml(data.cmd||'')
      +(data.diff_err?'&nbsp;│&nbsp;<span style="color:#f87171">err: '+escapeHtml(data.diff_err.slice(0,120))+'</span>':'')
      +'</div>';
    document.getElementById('compare-summary').innerHTML=sumHtml;

    // ── Merge button ──
    var mergeWrap=document.getElementById('compare-merge-btn-wrap');
    var headCheckout=_cmpLocalName(head);
    if(!identical&&base!==head){
      var needsCheckout=(headCheckout!==curBranch);
      var mergeBtn=document.createElement('button');
      mergeBtn.className='btn btn-sm';
      mergeBtn.style.cssText='background:#f97316;color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap';
      mergeBtn.innerHTML='⚡ Merge <b>'+escapeHtml(base)+'</b> → <b>'+escapeHtml(head)+'</b>';
      mergeBtn.onclick=function(){
        if(needsCheckout){
          showModalDouble('⚠️ Must be on '+escapeHtml(headCheckout),
            'You are on <b>'+escapeHtml(curBranch)+'</b>. To merge <b>'+escapeHtml(base)+'</b> into <b>'+escapeHtml(head)+'</b> you must first checkout <b>'+escapeHtml(headCheckout)+'</b>.<br><br>Checkout now?',
            'Checkout '+headCheckout,function(){checkoutBranch(headCheckout);},
            'Cancel',null,'btn-primary','btn-secondary');
        }else{
          mergeBranch(base);
        }
      };
      mergeWrap.appendChild(mergeBtn);
    }

    if(identical){
      document.getElementById('compare-file-sidebar').innerHTML='';
      document.getElementById('compare-diff-area').innerHTML='<div class="empty" style="padding:40px;text-align:center">✅ Branch A has no unique changes compared with Branch B.</div>';
      return;
    }

    // ── Split diff by file ──
    var sections=data.diff.split(/(?=^diff --git )/m).filter(function(s){return s.trim()});
    var fileEntries=[];
    sections.forEach(function(section,idx){
      var firstLine=section.split('\n')[0]||'';
      var fm=firstLine.match(/diff --git a\/(.+) b\/.+/);
      var fname=fm?fm[1]:firstLine.replace('diff --git ','');
      var adds=(section.match(/^\+[^+]/mg)||[]).length;
      var dels=(section.match(/^-[^-]/mg)||[]).length;
      fileEntries.push({fname:fname,adds:adds,dels:dels,section:section,id:'cdiff-'+idx});
    });

    // ── Left sidebar: file list ──
    var sideHtml='<div style="padding:8px 0">';
    sideHtml+='<div style="padding:6px 12px;font-size:11px;font-weight:700;color:#6b7280;letter-spacing:.5px;border-bottom:1px solid #f3f4f6">CHANGED FILES ('+fileEntries.length+')</div>';
    fileEntries.forEach(function(f){
      var shortName=f.fname.split('/').pop();
      var dirPart=f.fname.indexOf('/')>=0?f.fname.substring(0,f.fname.lastIndexOf('/')):'';
      sideHtml+='<div class="compare-file-item" onclick="scrollToFileDiff(\''+f.id+'\')" title="'+escapeHtml(f.fname)+'">'
        +'<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#1e40af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escapeHtml(shortName)+'</div>'
        +(dirPart?'<div style="font-size:10px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escapeHtml(dirPart)+'</div>':'')
        +'</div>'
        +(f.adds?'<span style="color:#16a34a;font-size:11px;font-weight:700;margin-left:4px">+'+f.adds+'</span>':'')
        +(f.dels?'<span style="color:#dc2626;font-size:11px;font-weight:700;margin-left:2px">−'+f.dels+'</span>':'')
        +'</div>';
    });
    sideHtml+='</div>';
    document.getElementById('compare-file-sidebar').innerHTML=sideHtml;

    // ── Right: per-file diffs ──
    var diffHtml='';
    fileEntries.forEach(function(f){
      diffHtml+='<div class="compare-diff-section" id="'+f.id+'">'
        +'<div class="compare-diff-header" onclick="toggleCompareDiff(\''+f.id+'-body\')">'
        +'<span style="flex:1;font-family:monospace;font-size:13px;color:#1e40af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+escapeHtml(f.fname)+'">'+escapeHtml(f.fname)+'</span>'
        +(f.adds?'<span class="compare-stat-add" style="margin-left:8px">+'+f.adds+'</span>':'')
        +(f.dels?'<span class="compare-stat-del" style="margin-left:4px">−'+f.dels+'</span>':'')
        +'<span id="'+f.id+'-body-arrow" style="font-size:11px;color:#9ca3af;margin-left:8px">▼</span>'
        +'</div>'
        +'<div class="compare-diff-body" id="'+f.id+'-body">'
        +highlightDiff(f.section)
        +'</div>'
        +'</div>';
    });
    document.getElementById('compare-diff-area').innerHTML=diffHtml;
  });
}
function scrollToFileDiff(id){
  var el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  // Ensure it's open
  var body=document.getElementById(id+'-body');
  if(body&&body.style.display==='none'){toggleCompareDiff(id+'-body');}
}
function toggleCompareDiff(id){
  var el=document.getElementById(id);
  var arrow=document.getElementById(id+'-arrow');
  if(!el)return;
  var hidden=el.style.display==='none';
  el.style.display=hidden?'':'none';
  if(arrow)arrow.textContent=hidden?'▼':'▶';
}

// ═══════════ Stash ═══════════
function loadStash(page){
  page=page||1;
  switchPage('stash');
  document.getElementById('stash-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading stash...</div>';
  document.getElementById('stash-pagination').innerHTML='';
  var _spv=document.getElementById('stash-per-page').value;var perPage=_spv===''?10:parseInt(_spv);
  apiGet('/api/stash-list?page='+page+'&per_page='+perPage,function(data){
    var container=document.getElementById('stash-content');
    if(!data.stashes||!data.stashes.length){container.innerHTML='<div class="empty">'+t('no_stash')+'</div>';return}
    var html='';
    data.stashes.forEach(function(s,idx){
      var globalIdx = (data.page-1)*data.per_page + idx;
      html+='<div class="stash-item" style="flex-wrap:wrap;cursor:pointer" onclick="toggleStashDiff('+globalIdx+')">';
      html+='<span class="file-toggle" id="stash-toggle-'+globalIdx+'">▶</span>';
      html+='<span class="name">'+escapeHtml(s)+'</span>';
      html+='<button class="btn btn-sm btn-success" onclick="event.stopPropagation();popStash('+globalIdx+')">Pop</button>';
      html+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();dropStash('+globalIdx+')">Drop</button>';
      html+='</div>';
      html+='<div class="file-body" id="stash-body-'+globalIdx+'"><div id="stash-diff-'+globalIdx+'" style="padding:12px 16px"></div></div>';
    });
    container.innerHTML=html;
    // Pagination
    var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
    _setSmartPagination('stash', totalPages, data.page, 'loadStash', data.total);
  });
}

function toggleStashDiff(idx){
  var body=document.getElementById('stash-body-'+idx);
  var toggle=document.getElementById('stash-toggle-'+idx);
  var expanded=body.classList.contains('expanded');
  if(expanded){body.classList.remove('expanded');toggle.classList.remove('open');return}
  body.classList.add('expanded');toggle.classList.add('open');
  var diffEl=document.getElementById('stash-diff-'+idx);
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff...</div>';
  apiGet('/api/stash-diff?index='+idx,function(data){
    diffEl.innerHTML='<div class="diff-block">'+highlightDiff(data.diff||'(empty stash)')+'</div>';
  });
}
function popStash(idx){apiPost('/api/stash-pop',{index:idx},function(data){if(data.ok){addMsg(t('stash_pop_ok'),'success');switchPage('main');loadFiles()}else addMsg(t('stash_pop_fail')+(data.error||''),'error')})}
function dropStash(idx){showModal('Delete Stash','Delete this stash? This cannot be undone.','Delete',function(){apiPost('/api/stash-drop',{index:idx},function(data){if(data.ok){addMsg(t('stash_deleted'),'success');loadStash()}else addMsg(t('delete_failed')+(data.error||''),'error')})})}

// ═══════════ Stash dialog (from commit page) ═══════════
function showStashDialog(paths, onSuccess) {
  var inputId = 'stash-msg-input-' + Date.now();
  var fileList = (paths && paths.length)
    ? '<div style="margin-bottom:12px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;max-height:120px;overflow-y:auto">'
        + '<div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:.5px;margin-bottom:4px">FILES TO STASH (' + paths.length + ')</div>'
        + paths.map(function(p){ return '<div style="font-family:monospace;font-size:12px;color:#374151">📄 ' + escapeHtml(p) + '</div>'; }).join('')
        + '</div>'
    : '';
  var body = '<p style="font-size:13px;color:#374151;margin-bottom:10px">' + t('stash_dialog_desc') + '</p>'
    + fileList
    + '<label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px">' + (L==='zh'?'Stash 备注':'Message') + ' <span style="font-size:11px;color:#9ca3af">' + (L==='zh'?'（选填）':'(optional)') + '</span></label>'
    + '<input id="' + inputId + '" type="text" placeholder="' + t('stash_msg_placeholder') + '" '
    + 'style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box">';

  document.getElementById('modal-title').innerHTML = t('stash_dialog_title');
  document.getElementById('modal-msg').innerHTML = body;
  var btnsDiv = document.getElementById('modal-btns');
  btnsDiv.innerHTML = '';

  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = closeModal;
  btnsDiv.appendChild(cancelBtn);

  var stashBtn = document.createElement('button');
  stashBtn.className = 'btn btn-warning';
  stashBtn.textContent = t('do_stash');
  stashBtn.onclick = function() {
    var msgInput = document.getElementById(inputId);
    var msg = msgInput ? msgInput.value.trim() : '';
    closeModal();
    var body = {message: msg};
    if (paths && paths.length) body.paths = paths;
    apiPost('/api/stash', body, function(data) {
      if (data.ok) {
        addMsg('✅ ' + t('stash_ok'), 'success');
        loadFiles();
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        var err = data.error || '';
        if (err.indexOf('No local changes') >= 0 || err.indexOf('nothing to stash') >= 0) {
          addMsg('ℹ️ ' + t('nothing_to_stash'), 'info');
        } else {
          addMsg('❌ ' + t('stash_failed') + err, 'error');
        }
      }
    });
  };
  btnsDiv.appendChild(stashBtn);
  document.getElementById('modal-bg').classList.add('show');
  setTimeout(function() {
    var inp = document.getElementById(inputId);
    if (inp) inp.focus();
  }, 100);
}

// ═══════════ Log page ═══════════
var logDebounceTimer=null;
var logSortOrder='desc'; // 'desc' = newest first, 'asc' = oldest first

function toggleUnsignedFilter(){
  logUnsignedFilter=!logUnsignedFilter;
  var btn=document.getElementById('log-unsigned-btn');
  if(btn){
    if(logUnsignedFilter){
      btn.className='btn btn-sm btn-warning';
      btn.textContent=L==='zh'?'🔓 仅显示未签名 ✕':'🔓 Unsigned Only ✕';
    } else {
      btn.className='btn btn-sm btn-secondary';
      btn.textContent='🔓 Unsigned';
    }
  }
  loadLog(1);
}

var prDebounceTimer=null;
var prState='in_review';
var currentPRData=null;
var _prDiffCache={}; // prNumber -> unified diff text
var _logCommitMap={}; // full-hash -> commit row data
var _commitFileDiffStore={}; // key: "<commit>::<file>" -> file diff text for that commit
var _commitAIPanelState=null;
function onLogSearchInput(){
  var val=document.getElementById('log-search').value;
  document.getElementById('log-search-btn').style.display=val?'inline-block':'none';
  // Prevent stale diff-search timeout from overriding normal commit search rendering.
  clearTimeout(_diffSearchTimer);
  if(!val.trim() && !((document.getElementById('log-code-search')||{value:''}).value||'').trim()){
    _inDiffSearchMode=false;
  }
  clearTimeout(logDebounceTimer);
  logDebounceTimer=setTimeout(function(){loadLog(1)},300);
}
function clearLogSearch(){
  document.getElementById('log-search').value='';
  document.getElementById('log-search-btn').style.display='none';
  clearTimeout(_diffSearchTimer);
  if(!((document.getElementById('log-code-search')||{value:''}).value||'').trim()){
    _inDiffSearchMode=false;
  }
  loadLog(1);
}

function onPRSearchInput(){
  var val=document.getElementById('prs-search').value;
  document.getElementById('prs-search-btn').style.display=val?'inline-block':'none';
  clearTimeout(prDebounceTimer);
  prDebounceTimer=setTimeout(function(){loadPullRequests(1)},300);
}

function clearPRSearch(){
  document.getElementById('prs-search').value='';
  document.getElementById('prs-search-btn').style.display='none';
  loadPullRequests(1);
}

function setPRState(state){
  prState=(state==='merged'||state==='closed')?state:'in_review';
  _updatePRStateTabs();
  loadPullRequests(1);
}

function _updatePRStateTabs(){
  var inBtn=document.getElementById('prs-tab-in-review');
  var mgBtn=document.getElementById('prs-tab-merged');
  var clBtn=document.getElementById('prs-tab-closed');
  if(inBtn){
    inBtn.className='btn btn-sm '+(prState==='in_review'?'btn-primary':'btn-secondary');
  }
  if(mgBtn){
    mgBtn.className='btn btn-sm '+(prState==='merged'?'btn-primary':'btn-secondary');
  }
  if(clBtn){
    clBtn.className='btn btn-sm '+(prState==='closed'?'btn-primary':'btn-secondary');
  }
}

function toggleLogSort(){
  logSortOrder=logSortOrder==='desc'?'asc':'desc';
  _invalidateLogCache();
  loadLog(1);
}

function loadLog(page){
  page=page||1;
  switchPage('log');
  var search=(document.getElementById('log-search')||{}).value||'';
  var codeSearch=((document.getElementById('log-code-search')||{}).value||'').trim();
  var _lpv=(document.getElementById('log-per-page')||{}).value;
  var perPage=_lpv===''?10:parseInt(_lpv);
  var logContent=document.getElementById('log-content');
  var logPag=document.getElementById('log-pagination');

  // Build network URL helper
  function _buildUrl(pg){
    var u='/api/commits?page='+pg+'&per_page='+perPage+'&order='+logSortOrder;
    if(search)u+='&search='+encodeURIComponent(search);
    if(logUnsignedFilter)u+='&unsigned_only=1';
    return u;
  }

  function _applyData(data, fromCache){
    if(!search.trim()&&!codeSearch){_inDiffSearchMode=false;}
    currentLogData=data;
    renderLog(data);
    renderPagination(data);
    if(!fromCache&&data.commits&&data.commits.length){
      showToast('Loaded '+data.commits.length+' commit(s)','ok',2000);
    }
  }

  // Skip cache when searching or filtering
  var useCache = !search.trim() && !codeSearch && !logUnsignedFilter;

  if(!useCache){
    logContent.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commits...</div>';
    logPag.innerHTML='';
    apiGet(_buildUrl(page),function(data){_applyData(data,false);});
    return;
  }

  // ── Cache path ──────────────────────────────────────────────────────────────
  // Try to read cached page for current settings (branch known from cache or current)
  var cachedBranch=_logCache.branch||'';
  _tryRestoreLogCache(cachedBranch, perPage, logSortOrder);

  var cachedPage=_logCache.pages[page];
  if(cachedPage){
    // Render immediately from cache — no spinner
    var cachedData={
      commits:cachedPage,
      total:_logCache.total,
      page:page,
      per_page:perPage,
      order:logSortOrder
    };
    _applyData(cachedData, true);
    // Soft indicator that we're verifying freshness
    var indicator=document.createElement('div');
    indicator.id='log-cache-indicator';
    indicator.style.cssText='font-size:11px;color:#888;text-align:right;padding:2px 8px;';
    indicator.textContent='⚡ From cache — checking for updates...';
    logContent.appendChild(indicator);
  } else {
    logContent.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commits...</div>';
    logPag.innerHTML='';
  }

  // Check HEAD hash — very cheap call
  apiGet('/api/head-hash',function(hd){
    var indicator=document.getElementById('log-cache-indicator');
    var sameHead = hd && hd.hash && _logCache.headHash && hd.hash===_logCache.headHash;
    var sameBranch = hd && hd.branch && hd.branch===_logCache.branch;

    if(sameHead && sameBranch && cachedPage){
      // HEAD unchanged — cache is fresh, done
      if(indicator)indicator.remove();
      return;
    }

    // HEAD changed or no cache — fetch from network
    if(indicator)indicator.textContent='⟳ Updating commits...';
    apiGet(_buildUrl(page),function(data){
      _applyData(data,false);
      // Update cache
      _logCache.branch=hd?hd.branch:_logCache.branch;
      _logCache.headHash=hd?hd.hash:null;
      _logCache.total=data.total||0;
      _logCache.perPage=perPage;
      _logCache.order=logSortOrder;
      // If branch changed, wipe old pages
      if(!sameBranch) _logCache.pages={};
      _logCache.pages[page]=data.commits;
      _saveLogCache();
    });
  });
}

function loadPullRequests(page){
  page=page||1;
  switchPage('prs');
  _updatePRStateTabs();
  document.getElementById('prs-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>'+(L==='zh'?'正在加载拉取请求...':'Loading pull requests...')+'</div>';
  document.getElementById('prs-pagination').innerHTML='';
  var search=document.getElementById('prs-search').value;
  var ppv=document.getElementById('prs-per-page').value;
  var perPage=ppv===''?10:parseInt(ppv,10);
  var url='/api/pull-requests?page='+page+'&per_page='+perPage+'&state='+encodeURIComponent(prState);
  if(search) url+='&search='+encodeURIComponent(search);
  fetch(API_BASE+url).then(function(r){return r.json();}).then(function(data){
    currentPRData=data||{};
    renderPullRequests(currentPRData);
    renderPRPagination(currentPRData);
    if(currentPRData.error){
      addMsg(t('loading_failed')+currentPRData.error,'error');
    }
  }).catch(function(e){
    document.getElementById('prs-content').innerHTML='<div class="empty">'+t('network_err')+escapeHtml(e.message||'')+'</div>';
    document.getElementById('prs-pagination').innerHTML='';
    addMsg(t('network_err')+(e.message||''),'error');
  });
}

function renderPullRequests(data){
  var container=document.getElementById('prs-content');
  var list=(data&&data.pull_requests)||[];
  if(!list.length){container.innerHTML='<div class="empty">'+t('prs_no_match')+'</div>';return}
  var html='<table class="log-table"><thead><tr>';
  html+='<th>PR</th><th>Author</th><th>Date</th><th>Message</th><th>Status</th><th>Actions</th><th style="width:20px"></th>';
  html+='</tr></thead><tbody>';
  list.forEach(function(pr,idx){
    if(pr.head_sha){
      _logCommitMap[pr.head_sha]={
        hash:pr.head_sha, short_hash:(pr.head_sha||'').substring(0,7),
        author:(pr.author_display||pr.author_name||pr.author_login||pr.author||''), date:(pr.updated_at||pr.created_at||''),
        message:pr.title||''
      };
    }
    var date=(pr.merged_at||'')||(pr.updated_at||pr.created_at||'');
    var merged=(pr.state==='merged')||(prState==='merged');
    var closed=(pr.state==='closed')||(prState==='closed');
    var statusCell=
      '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;'
      +(merged
        ?'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;'
        :(closed
          ?'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;'
          :'background:#fffbeb;color:#92400e;border:1px solid #fcd34d;'))
      +'border-radius:20px;padding:3px 10px;white-space:nowrap;cursor:default">'
      +(merged?('✅ '+t('prs_merged')):(closed?('⚪ '+t('prs_closed')):('🟡 '+t('prs_open'))))
      +(pr.is_draft?(' · '+t('prs_draft')):'')
      +'</span>';
    html+='<tr style="cursor:pointer" onclick="togglePRDiff('+Number(pr.number||0)+','+idx+',\''+escapeAttr(pr.head_sha||'')+'\')">';
    html+='<td><span class="log-hash">#'+escapeHtml(String(pr.number||''))+'</span></td>';
    var authorMain=(pr.author_name||pr.author_display||pr.author_login||pr.author||'');
    var authorId=(pr.author_login||pr.author||'').trim();
    var authorSub='';
    if(authorId){
      var mainLower=String(authorMain||'').toLowerCase();
      var idLower=authorId.toLowerCase();
      if(mainLower.indexOf(idLower)===-1){
        authorSub='<div style="margin-top:2px;font-size:11px;color:#64748b">@'+escapeHtml(authorId)+'</div>';
      }
    }
    html+='<td class="log-author"><div>'+escapeHtml(authorMain)+'</div>'+authorSub+'</td>';
    html+='<td class="log-date">'+escapeHtml(date||'')+'</td>';
    html+='<td class="log-msg"><div class="commit-msg-box"><div>'+escapeHtml(pr.title||'')+'</div><div style="margin-top:4px;font-size:11px;color:#64748b">'+escapeHtml((pr.head_ref||'')+' → '+(pr.base_ref||''))+'</div></div></td>';
    html+='<td class="log-status">'+statusCell+'</td>';
    html+='<td class="log-actions">'
      +'<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();window.open(\''+escapeJS(pr.url||'')+'\',\'_blank\')">'+t('prs_view')+'</button>'
      +'<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openPRAIAnalysis('+Number(pr.number||0)+',\''+escapeAttr(pr.head_sha||'')+'\')">🤖 '+_aiCmpText('AI 分析','AI Analysis')+'</button>'
      +'</td>';
    html+='<td style="text-align:center"><span class="file-toggle" id="pr-toggle-'+idx+'">▶</span></td>';
    html+='</tr>';
    html+='<tr id="pr-diff-row-'+idx+'" style="display:none"><td colspan="7" style="padding:0"><div id="pr-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto"></div></td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
}

function renderPRPagination(data){
  var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
  _setSmartPagination('prs', totalPages, data.page, 'loadPullRequests', data.total);
}

function togglePRDiff(prNumber, idx, headSha){
  var row=document.getElementById('pr-diff-row-'+idx);
  var diffEl=document.getElementById('pr-diff-'+idx);
  var toggle=document.getElementById('pr-toggle-'+idx);
  if(!row||!diffEl)return;
  if(row.style.display!=='none'){
    row.style.display='none';
    if(toggle)toggle.classList.remove('open');
    return;
  }
  row.style.display='table-row';
  if(toggle)toggle.classList.add('open');
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>'+(L==='zh'?'正在加载 PR 代码改动...':'Loading PR diff...')+'</div>';
  var key=''+prNumber;
  if(_prDiffCache[key]){
    diffEl.innerHTML='<div class="diff-block">'+highlightPRDiffFiles(_prDiffCache[key],headSha,prNumber)+'</div>';
    return;
  }
  apiGet('/api/pull-request-diff?number='+encodeURIComponent(prNumber),function(data){
    if(!data||!data.ok){
      diffEl.innerHTML='<div class="empty">'+escapeHtml((data&&data.error)||_aiCmpText('加载失败','Load failed'))+'</div>';
      return;
    }
    _prDiffCache[key]=data.diff||'';
    diffEl.innerHTML='<div class="diff-block">'+highlightPRDiffFiles(data.diff||'',headSha,prNumber)+'</div>';
  });
}

function highlightPRDiffFiles(text, headSha, prNumber){
  if(!text)return'';
  var lines=text.split('\n');
  var sections=[];
  var currentSection=null;
  for(var i=0;i<lines.length;i++){
    var line=lines[i];
    var m=line.match(/^diff --git a\/(.*) b\/(.*)/);
    if(m){
      if(currentSection) sections.push(currentSection);
      currentSection={file:m[1], lines:[line]};
      continue;
    }
    if(currentSection) currentSection.lines.push(line);
  }
  if(currentSection) sections.push(currentSection);
  if(!sections.length){
    var h='';
    for(var j=0;j<lines.length;j++) h+='<div style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;padding:1px 8px">'+escapeHtml(lines[j])+'</div>';
    return h;
  }
  var html='';
  sections.forEach(function(sec, si){
    var fileId='pr-diff-file-'+prNumber+'-'+si;
    var fileDiffText=(sec.lines||[]).join('\n');
    if(headSha){
      _commitFileDiffStore[_commitDiffStoreKey(headSha, sec.file)] = fileDiffText;
    }
    html+='<div style="border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;overflow:hidden">';
    html+='<div style="display:flex;align-items:center;padding:8px 14px;background:#f9fafb;cursor:pointer" onclick="toggleDiffFile(\''+fileId+'\',this)">';
    html+='<span class="file-toggle" id="'+fileId+'-toggle">▶</span>';
    html+='<b style="color:#2563eb;flex:1;margin-left:8px">'+escapeHtml(sec.file)+'</b>';
    html+='<span style="font-size:11px;color:#9ca3af">'+sec.lines.length+' lines</span>';
    html+='</div>';
    html+='<div id="'+fileId+'" style="display:none">'+highlightDiff(fileDiffText)+'</div>';
    html+='<div style="padding:4px 14px;border-top:1px solid #e5e7eb;background:#fafafa">';
    html+='<button class="btn btn-sm btn-primary" title="'+escapeAttr(_aiCmpText('分析此文件改动','Analyze this file changes'))+'" onclick="event.stopPropagation();openPRAICompareFile(\''+escapeAttr(sec.file)+'\',\''+escapeAttr(headSha||'')+'\',\''+escapeAttr(prNumber)+'\')">🤖 AI Compare</button>';
    html+='</div></div>';
  });
  return html;
}

function openPRAICompareFile(filePath, headSha, prNumber){
  var key=_commitDiffStoreKey(headSha,filePath);
  var currentDiff=_commitFileDiffStore[key];
  if(!currentDiff){
    addMsg('❌ '+_aiCmpText('请先展开该 PR 的代码改动后再分析文件。','Please expand this PR diff first, then analyze file.'),'error');
    return;
  }
  _openCommitAIComparePanel({mode:'file',filePath:filePath,commitHash:headSha||('pr-'+prNumber),currentDiff:currentDiff});
}

function openPRAIAnalysis(prNumber, headSha){
  var key=''+prNumber;
  var openWithDiff=function(diffText){
    if(!diffText||!diffText.trim()){
      addMsg('❌ '+_aiCmpText('无法加载该 PR 的代码改动。','Cannot load this PR diff.'),'error');
      return;
    }
    _openCommitAIComparePanel({mode:'commit',filePath:'',commitHash:headSha||('pr-'+prNumber),currentDiff:diffText});
  };
  if(_prDiffCache[key]){
    openWithDiff(_prDiffCache[key]);
    return;
  }
  apiGet('/api/pull-request-diff?number='+encodeURIComponent(prNumber),function(data){
    if(!data||!data.ok){
      addMsg('❌ '+((data&&data.error)||_aiCmpText('加载失败','Load failed')),'error');
      return;
    }
    _prDiffCache[key]=data.diff||'';
    openWithDiff(_prDiffCache[key]);
  });
}

function renderLog(data){
  var container=document.getElementById('log-content');
  if(!data.commits||!data.commits.length){container.innerHTML='<div class="empty">'+t('no_match')+'</div>';return}
  _logCommitMap={};
  var sortIcon=logSortOrder==='desc'?' ↓':' ↑';
  var sortTip=logSortOrder==='desc'?'Newest first — click for oldest first':'Oldest first — click for newest first';
  var html='<table class="log-table"><thead><tr>';
  html+='<th style="width:20px"></th>';
  html+='<th>Hash</th><th>Author</th>';
  html+='<th style="cursor:pointer;user-select:none;white-space:nowrap" onclick="toggleLogSort()" title="'+sortTip+'">Date'+sortIcon+'</th>';
  html+='<th>Message</th><th>Status</th><th>Actions</th><th style="width:20px"></th>';
  html+='</tr></thead><tbody>';
  data.commits.forEach(function(c,idx){
    _logCommitMap[c.hash]=c;
    var checked=squashSelected[c.hash]?' checked':'';
    var isRoot=c.is_root?true:false;
    var cbDisabled=isRoot?' disabled title="'+(L==='zh'?'初始 commit 不可参与 Squash':'Initial commit cannot be squashed')+'"':'';
    var rootBadge=isRoot?'<span style="font-size:10px;background:#fef3c7;color:#92400e;border:1px solid #fcd34d;border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:middle">root</span>':'';

    // ── Push status badge ──────────────────────────────────────────────────
    var statusCell;
    var releaseInfo=_renderCommitReleaseInfo(c.release_refs||[]);
    if(c.pushed){
      statusCell=
        '<span title="This commit has been pushed to remote" '
        +'style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;'
        +'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;border-radius:20px;'
        +'padding:3px 10px;white-space:nowrap;cursor:default">'
        +'☁️ Pushed</span>';
    } else {
      statusCell=
        '<span title="This commit has NOT been pushed to remote yet" '
        +'style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;'
        +'background:#fffbeb;color:#92400e;border:1px solid #fcd34d;border-radius:20px;'
        +'padding:3px 10px;white-space:nowrap;cursor:default">'
        +'⏳ Local</span> '
        +'<button class="btn btn-sm" onclick="event.stopPropagation();pushFromLog()" '
        +'title="Push this commit and all pending commits to remote" '
        +'style="font-size:10px;padding:2px 8px;background:linear-gradient(135deg,#6366f1,#4f46e5);'
        +'color:#fff;border:none;border-radius:12px;font-weight:600;cursor:pointer;'
        +'box-shadow:0 1px 4px rgba(79,70,229,.35);margin-left:2px">⬆ Push</button>';
    }
    // ── GPG signature badge ────────────────────────────────────────────────
    var gpg=c.gpg_status||'';
    var gpgBadge='';
    if(gpg==='G'||gpg==='U'||gpg==='X'||gpg==='Y'||gpg==='R'){
      gpgBadge='<span title="GPG signed" style="display:inline-flex;align-items:center;font-size:11px;font-weight:600;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;border-radius:20px;padding:2px 8px;margin-left:4px;white-space:nowrap;cursor:default">🔐 Signed</span>';
    } else if(gpg==='N'||gpg==='B'||gpg==='E'){
      gpgBadge='<span title="No GPG signature" style="display:inline-flex;align-items:center;font-size:11px;font-weight:600;background:#fef9c3;color:#92400e;border:1px solid #fcd34d;border-radius:20px;padding:2px 8px;margin-left:4px;white-space:nowrap;cursor:default">🔓 Unsigned</span>';
    }
    if(gpgBadge) statusCell+=' '+gpgBadge;
    if(releaseInfo){
      statusCell+='<div class="log-release-info">'+releaseInfo+'</div>';
    }

    html+='<tr style="cursor:pointer" onclick="toggleCommitDiff(\''+c.hash+'\','+idx+')"><td><input type="checkbox" class="squash-cb" data-hash="'+c.hash+'"'+checked+cbDisabled+' onclick="event.stopPropagation();toggleSquashSelect(this)"></td>';
    html+='<td>'+_renderLogHashCell(c)+'</td>';
    html+='<td class="log-author">'+escapeHtml(c.author)+'</td>';
    html+='<td class="log-date">'+c.date+'</td>';
    html+='<td class="log-msg">'+_renderCommitMessageCell(c.message,'log-msg-'+idx,rootBadge)+'</td>';
    html+='<td class="log-status" onclick="event.stopPropagation()">'+statusCell+'</td>';
    html+='<td class="log-actions">';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();showResetModal(\''+c.hash+'\',\''+c.short_hash+'\')">Reset</button>';
    html+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();showRevertModal(\''+c.hash+'\',\''+c.short_hash+'\')">Revert</button>';
    html+='<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openCommitAIAnalysis(\''+escapeAttr(c.hash)+'\')" title="'+escapeAttr(_aiCmpText('分析这个 commit 的全部代码改动','Analyze all code changes in this commit'))+'">🤖 '+_aiCmpText('AI 分析','AI Analysis')+'</button>';
    html+='</td>';
    html+='<td style="text-align:center"><span class="file-toggle" id="log-toggle-'+idx+'">▶</span></td>';
    html+='</tr>';
    html+='<tr id="commit-diff-row-'+idx+'" style="display:none"><td colspan="8" style="padding:0"><div id="commit-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto"></div></td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  updateSquashBar();
}

function _renderCommitMessageCell(message,id,badgeHtml){
  var msg=message||'';
  var badge=badgeHtml||'';
  var longMsg=msg.length>90;
  var boxCls='commit-msg-box'+(longMsg?' collapsed':'');
  var html='<div id="'+id+'" class="'+boxCls+'" title="'+escapeAttr(msg)+'">'+escapeHtml(msg)+badge+'</div>';
  if(longMsg){
    html+='<button class="commit-msg-toggle" onclick="event.stopPropagation();toggleCommitMessageExpand(\''+id+'\',this)">'+t('msg_expand')+'</button>';
  }
  return html;
}

function _renderLogHashCell(commit){
  var c=commit||{};
  return '<div class="log-hash-cell">'
    +'<span class="log-hash" data-full="'+escapeAttr(c.hash||'')+'" onclick="event.stopPropagation();toggleHash(this)" title="Click to toggle full hash">'+escapeHtml(c.short_hash||'')+'</span>'
    +'<button class="log-copy-btn" onclick="event.stopPropagation();copyToClipboard(\''+escapeAttr(c.hash||'')+'\')" title="'+escapeAttr(_aiCmpText('复制完整 commit hash','Copy full commit hash'))+'">'+_aiCmpText('📋 复制','📋 Copy')+'</button>'
    +'</div>';
}

function toggleCommitMessageExpand(id,btn){
  var box=document.getElementById(id);
  if(!box||!btn)return;
  var expanded=box.classList.contains('expanded');
  if(expanded){
    box.classList.remove('expanded');
    box.classList.add('collapsed');
    btn.textContent=t('msg_expand');
  }else{
    box.classList.remove('collapsed');
    box.classList.add('expanded');
    btn.textContent=t('msg_collapse');
  }
}

function _renderCommitReleaseInfo(releaseRefs){
  if(!releaseRefs||!releaseRefs.length)return'';
  var shown=releaseRefs.slice(0,2);
  var more=releaseRefs.length-shown.length;
  var html='';
  for(var i=0;i<shown.length;i++){
    html+='<span class="log-release-pill" title="'+escapeAttr(_aiCmpText('包含此提交的发布分支','Release ref containing this commit'))+'">🏷 '+escapeHtml(t('release_in'))+' '+escapeHtml(shown[i])+'</span>';
  }
  if(more>0){
    html+='<span class="log-release-pill">'+escapeHtml(tf('release_more',L,{n:more}))+'</span>';
  }
  return html;
}

/** Push from commit log row — same confirm flow as the top Push button. */
function pushFromLog(){
  doManualPush();
}

/** Copy text to clipboard and show a brief toast. */
function copyToClipboard(text){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){
      showToast('✅ Copied: '+text.substr(0,12)+'…','ok',2000);
    }).catch(function(){ _copyFallback(text); });
  } else { _copyFallback(text); }
}
function _copyFallback(text){
  var ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); showToast('✅ Copied','ok',2000); }
  catch(e){ showToast('❌ Copy failed','error',2000); }
  document.body.removeChild(ta);
}

function toggleCommitDiff(hash,idx){
  var row=document.getElementById('commit-diff-row-'+idx);
  var diffEl=document.getElementById('commit-diff-'+idx);
  var toggle=document.getElementById('log-toggle-'+idx);
  if(row.style.display!=='none'){
    row.style.display='none';
    if(toggle)toggle.classList.remove('open');
    return;
  }
  row.style.display='table-row';
  if(toggle)toggle.classList.add('open');
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff...</div>';
  apiGet('/api/commit-diff?commit='+hash,function(data){
    diffEl.innerHTML='<div class="diff-block">'+highlightDiffFiles(data.diff, hash)+'</div>';
  });
}

function highlightDiffFiles(text, commitHash){
  if(!text)return'';
  var lines=text.split('\n');
  // Parse into file sections
  var sections=[];
  var currentSection=null;
  var i=0;
  while(i<lines.length){
    var line=lines[i];
    var m=line.match(/^diff --git a\/(.*) b\/(.*)/);
    if(m){
      if(currentSection) sections.push(currentSection);
      currentSection={file:m[1], lines:[]};
      i++; continue;
    }
    if(currentSection) currentSection.lines.push(line);
    i++;
  }
  if(currentSection) sections.push(currentSection);
  
  if(!sections.length){
    // No structured diff (common on merge commits) — show raw + lazy file list entry points.
    var fallbackId='commit-ai-fallback-files-'+commitHash.substr(0,7)+'-'+Date.now();
    var h='<div style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;margin-bottom:10px">'
      +'<div style="font-size:12px;color:#475569;margin-bottom:6px">No per-file patch blocks in this commit view. Loading changed-file list…</div>'
      +'<div id="'+fallbackId+'" style="font-size:12px;color:#64748b">Loading files…</div>'
      +'</div>';
    for(var j=0;j<lines.length;j++)
      h+=diffLine(lines[j]);
    setTimeout(function(){ _loadCommitAIEntryFiles(commitHash,fallbackId); },0);
    return h;
  }
  
  var html='';
  sections.forEach(function(sec, si){
    var fileId='diff-file-'+si+'-'+commitHash.substr(0,7);
    var fileDiffText=(sec.lines||[]).join('\n');
    _commitFileDiffStore[_commitDiffStoreKey(commitHash, sec.file)] = fileDiffText;
    html+='<div style="border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;overflow:hidden">';
    html+='<div style="display:flex;align-items:center;padding:8px 14px;background:#f9fafb;cursor:pointer" onclick="toggleDiffFile(\''+fileId+'\',this)">';
    html+='<span class="file-toggle" id="'+fileId+'-toggle">▶</span>';
    html+='<b style="color:#2563eb;flex:1;margin-left:8px">'+escapeHtml(sec.file)+'</b>';
    html+='<span style="font-size:11px;color:#9ca3af">'+sec.lines.length+' lines</span>';
    html+='</div>';
    html+='<div id="'+fileId+'" style="display:none">';
    for(var k=0;k<sec.lines.length;k++)
      html+=diffLine(sec.lines[k]);
    html+='</div>';
    html+='<div style="padding:4px 14px;border-top:1px solid #e5e7eb;background:#fafafa">';
    html+='<button class="btn btn-sm btn-secondary restore-file-btn" title="Restore this file to a specific commit — choose from commit history" data-file="'+escapeAttr(sec.file)+'" onclick="event.stopPropagation();openRestorePage(this.getAttribute(\'data-file\'))">📂 Restore to commit...</button>';
    html+=' <button class="btn btn-sm btn-primary" title="Open AI compare panel for this file" onclick="event.stopPropagation();openCommitAICompare(\''+escapeAttr(sec.file)+'\',\''+escapeAttr(commitHash)+'\')">🤖 AI Compare</button>';
    html+='</div></div>';
  });
  return html;
  
  function diffLine(line){
    var s='<div style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;padding:1px 8px;';
    if(line.charAt(0)==='+')s+='background:#e6ffed;color:#059664';
    else if(line.charAt(0)==='-')s+='background:#ffeef0;color:#dc2626';
    else if(/^(@@|diff|index|commit|Author:|Date:)/.test(line))s+='color:#6b7280';
    s+='">'+escapeHtml(line)+'</div>';
    return s;
  }
}

function _loadCommitAIEntryFiles(commitHash,targetId){
  var el=document.getElementById(targetId);
  if(!el)return;
  apiGet('/api/commit-files?commit='+encodeURIComponent(commitHash),function(data){
    var files=(data&&data.files)||[];
    if(!files.length){
      el.innerHTML='<span style="color:#94a3b8">No changed files found.</span>';
      return;
    }
    var html='';
    for(var i=0;i<files.length;i++){
      var fp=files[i];
      html+='<button class="btn btn-sm btn-primary" style="margin:0 6px 6px 0"'
        +' onclick="event.stopPropagation();openCommitAICompare(\''+escapeAttr(fp)+'\',\''+escapeAttr(commitHash)+'\')">'
        +'🤖 AI Compare '+escapeHtml(fp.split('/').pop())+'</button>';
    }
    el.innerHTML=html;
  });
}

function _commitDiffStoreKey(commitHash, filePath){
  return (commitHash||'')+'::'+(filePath||'');
}

function _parseDiffSectionsForAI(diffText){
  var text=diffText||'';
  var lines=text.split('\n');
  var sections=[];
  var current=null;
  for(var i=0;i<lines.length;i++){
    var line=lines[i];
    var m=line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if(m){
      if(current) sections.push(current);
      current={title:m[2]||m[1], lines:[line]};
      continue;
    }
    if(current){
      current.lines.push(line);
    }
  }
  if(current) sections.push(current);
  return sections;
}

function _renderAIDiffSections(diffText, idPrefix, forcedTitle){
  var text=diffText||'';
  if(!text.trim()){
    return '<div style="padding:10px;color:#94a3b8;font-size:12px">'+_aiCmpText('无可用 diff。','No diff available.')+'</div>';
  }
  var sections=_parseDiffSectionsForAI(text);
  if(!sections.length){
    if(forcedTitle){
      sections=[{title:forcedTitle,lines:text.split('\n')}];
    }else{
      sections=[{title:_aiCmpText('整体改动','Full changes'),lines:text.split('\n')}];
    }
  }
  var html='';
  for(var i=0;i<sections.length;i++){
    var sec=sections[i];
    var bodyId=idPrefix+'-sec-'+i;
    var count=(sec.lines||[]).length;
    html+='<div style="border:1px solid #e5e7eb;border-radius:8px;background:#fff;overflow:hidden;margin-bottom:8px">';
    html+='<div style="display:flex;align-items:center;padding:8px 10px;background:#f8fafc;cursor:pointer" onclick="toggleDiffFile(\''+bodyId+'\',this)">';
    html+='<span class="file-toggle" id="'+bodyId+'-toggle">▶</span>';
    html+='<b style="margin-left:8px;color:#1d4ed8;flex:1;font-size:12px">'+escapeHtml(sec.title||_aiCmpText('未命名文件','Unnamed file'))+'</b>';
    html+='<span style="font-size:11px;color:#94a3b8">'+count+' '+_aiCmpText('行','lines')+'</span>';
    html+='</div>';
    html+='<div id="'+bodyId+'" style="display:none">'+highlightDiff((sec.lines||[]).join('\n'))+'</div>';
    html+='</div>';
  }
  return html;
}

function _buildAIDiffSectionList(diffText, forcedTitle){
  var text=diffText||'';
  if(!text.trim()){
    return [];
  }
  var parsed=_parseDiffSectionsForAI(text);
  if(!parsed.length){
    return [{
      title: forcedTitle || _aiCmpText('整体改动','Full changes'),
      text: text
    }];
  }
  var out=[];
  for(var i=0;i<parsed.length;i++){
    out.push({
      title: parsed[i].title || forcedTitle || _aiCmpText('未命名文件','Unnamed file'),
      text: (parsed[i].lines||[]).join('\n')
    });
  }
  return out;
}

function _renderAIDiffComparisonSections(st){
  if(!st) return '';
  var forcedTitle=st.mode==='file' ? st.filePath : '';
  var currSections=_buildAIDiffSectionList(st.currentDiff||'', forcedTitle);
  var histSections=_buildAIDiffSectionList(st.selectedHistoryDiff||'', forcedTitle);
  var currMap={};
  var histMap={};
  var order=[];
  for(var i=0;i<currSections.length;i++){
    var c=currSections[i];
    if(!currMap[c.title]) order.push(c.title);
    currMap[c.title]=c.text;
  }
  for(var j=0;j<histSections.length;j++){
    var h=histSections[j];
    if(!currMap[h.title] && !histMap[h.title]) order.push(h.title);
    histMap[h.title]=h.text;
  }
  if(!order.length){
    return '<div style="padding:10px;color:#94a3b8;font-size:12px">'+_aiCmpText('无可用 diff。','No diff available.')+'</div>';
  }
  var html='<div style="font-size:11px;color:#64748b;margin-bottom:6px">'+_aiCmpText('按文件分段对比（默认折叠）','Sectioned comparison by file (collapsed by default)')+'</div>';
  if(!st.selectedHistoryDiff){
    html+='<div style="font-size:11px;color:#64748b;margin-bottom:8px">'+_aiCmpText('请在左侧选择历史提交后查看逐段对比。','Select a historical commit on the left to view section-by-section comparison.')+'</div>';
  }
  for(var k=0;k<order.length;k++){
    var title=order[k];
    var curText=currMap[title]||'';
    var oldText=histMap[title]||'';
    var bodyId='commit-ai-cmp-sec-'+k;
    html+='<div style="border:1px solid #e5e7eb;border-radius:8px;background:#fff;overflow:hidden;margin-bottom:8px">';
    html+='<div style="display:flex;align-items:center;padding:8px 10px;background:#f8fafc;cursor:pointer" onclick="toggleDiffFile(\''+bodyId+'\',this)">';
    html+='<span class="file-toggle" id="'+bodyId+'-toggle">▶</span>';
    html+='<b style="margin-left:8px;color:#1d4ed8;flex:1;font-size:12px">'+escapeHtml(title)+'</b>';
    html+='<span style="font-size:10px;color:#64748b;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:1px 6px;margin-right:4px">C '+(curText?curText.split('\n').length:0)+'</span>';
    html+='<span style="font-size:10px;color:#64748b;background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;padding:1px 6px">H '+(oldText?oldText.split('\n').length:0)+'</span>';
    html+='</div>';
    html+='<div id="'+bodyId+'" style="display:none;padding:8px 10px;background:#fff">';
    html+='<div style="font-size:11px;color:#0f766e;margin-bottom:6px;font-weight:700">'+_aiCmpText('当前提交','Current Commit')+'</div>';
    html+=(curText?highlightDiff(curText):('<div style="padding:8px;color:#94a3b8;font-size:12px">'+_aiCmpText('当前提交该 section 无改动','No changes in this section for current commit')+'</div>'));
    html+='<div style="height:8px"></div>';
    html+='<div style="font-size:11px;color:#0369a1;margin-bottom:6px;font-weight:700">'+_aiCmpText('历史提交','Historical Commit')+'</div>';
    html+=(oldText?highlightDiff(oldText):('<div style="padding:8px;color:#94a3b8;font-size:12px">'+_aiCmpText('历史提交该 section 无改动','No changes in this section for historical commit')+'</div>'));
    html+='</div></div>';
  }
  return html;
}

function _renderCommitAIComparisonDiffs(){
  var st=_commitAIPanelState;
  if(!st)return;
  var targetEl=document.getElementById('commit-ai-compare-target');
  var compareEl=document.getElementById('commit-ai-compare-sections');
  if(targetEl){
    if(st.selectedHistoryCommit){
      targetEl.innerHTML=_aiCmpText('对比历史: ','Comparing with: ')+'<code>'
        +escapeHtml(st.selectedHistoryCommit.short_hash||st.selectedHistoryCommit.hash.substring(0,7))
        +'</code>'+(st.selectedHistoryCommit.message?(' · '+escapeHtml(st.selectedHistoryCommit.message)):'');
    }else{
      targetEl.textContent=_aiCmpText('对比历史: 未选择','Comparing with: not selected');
    }
  }
  if(compareEl){
    compareEl.innerHTML=_renderAIDiffComparisonSections(st);
  }
}

function _setProgressBar(rootId, percent, label){
  var bar=document.getElementById(rootId+'-bar');
  var txt=document.getElementById(rootId+'-label');
  if(bar) bar.style.width=Math.max(0,Math.min(100,percent))+'%';
  if(txt && label!=null) txt.textContent=label;
}

function _startAutoProgress(rootId, baseLabel){
  var p=8;
  _setProgressBar(rootId,p,baseLabel+' ('+p+'%)');
  return setInterval(function(){
    p=Math.min(92,p+Math.floor(Math.random()*8)+2);
    _setProgressBar(rootId,p,baseLabel+' ('+p+'%)');
  },220);
}

function _stopAutoProgress(timer, rootId, doneLabel){
  if(timer) clearInterval(timer);
  _setProgressBar(rootId,100,doneLabel||'Done');
}

function _aiLangInstruction(){
  return (L==='zh')
    ? 'Respond in Simplified Chinese only.'
    : 'Respond in English only.';
}

function _aiCmpText(zh, en){
  return L==='zh' ? zh : en;
}

function openCommitAICompare(filePath, commitHash){
  var key=_commitDiffStoreKey(commitHash,filePath);
  var currentDiff=_commitFileDiffStore[key];
  if(!currentDiff){
    apiGet('/api/file-commit-diff?commit='+encodeURIComponent(commitHash)+'&file='+encodeURIComponent(filePath),function(d){
      var fetched=(d&&d.diff)||'';
      if(!fetched.trim()){
        addMsg('❌ Cannot load file diff for this commit/file.','error');
        return;
      }
      _commitFileDiffStore[key]=fetched;
      _openCommitAIComparePanel({mode:'file',filePath:filePath,commitHash:commitHash,currentDiff:fetched});
    });
    return;
  }
  _openCommitAIComparePanel({mode:'file',filePath:filePath,commitHash:commitHash,currentDiff:currentDiff});
}

function openCommitAIAnalysis(commitHash){
  apiGet('/api/commit-diff?commit='+encodeURIComponent(commitHash),function(data){
    var diff=(data&&data.diff)||'';
    if(!diff.trim()){
      addMsg('❌ '+_aiCmpText('无法加载该 commit 的 diff。','Cannot load commit diff.'),'error');
      return;
    }
    _openCommitAIComparePanel({mode:'commit',filePath:'',commitHash:commitHash,currentDiff:diff});
  });
}

function _openCommitAIComparePanel(opts){
  var mode=(opts&&opts.mode)||'file';
  var filePath=(opts&&opts.filePath)||'';
  var commitHash=(opts&&opts.commitHash)||'';
  var currentDiff=(opts&&opts.currentDiff)||'';
  _commitAIPanelState={
    mode:mode,
    filePath:filePath,
    currentCommitHash:commitHash,
    currentDiff:currentDiff,
    selectedHistoryCommit:null,
    selectedHistoryDiff:'',
    historyPage:0,
    historyPerPage:20,
    historyTotal:0,
    historyLoading:false,
    historyDone:false,
    historyItems:[],
    chatHistory:[],
    chatLoading:false
  };

  _setModalLayout({
    maxWidth:'96vw',
    width:'96vw',
    maxHeight:'92vh',
    overflowY:'hidden',
    padding:'16px 18px'
  });

  var cInfo=_logCommitMap[commitHash]||{};
  document.getElementById('modal-title').innerHTML='🤖 '+_aiCmpText('AI 对比面板','AI Compare Panel')
    +' <span style="font-size:12px;font-weight:500;color:#64748b">— '+escapeHtml(mode==='file'?filePath:_aiCmpText('整个 Commit','Entire Commit'))+'</span>';
  document.getElementById('modal-msg').innerHTML=
    '<div id="commit-ai-compare-root" style="height:76vh;display:flex;gap:10px;overflow:hidden">'
      +'<div style="width:31%;min-width:300px;border:1px solid #e5e7eb;border-radius:10px;display:flex;flex-direction:column;overflow:hidden;background:#fff">'
        +'<div style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#0f172a">🕘 '+(mode==='file'?_aiCmpText('文件历史提交','File History Commits'):_aiCmpText('分支历史提交','Branch History Commits'))+'</div>'
        +'<div id="commit-ai-history-progress" style="padding:8px 12px;border-bottom:1px solid #f1f5f9;background:#f8fafc;display:none">'
          +'<div style="height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div id="commit-ai-history-progress-bar" style="height:100%;width:0;background:linear-gradient(90deg,#60a5fa,#2563eb)"></div></div>'
          +'<div id="commit-ai-history-progress-label" style="font-size:11px;color:#64748b;margin-top:4px">'+_aiCmpText('加载中...','Loading...')+'</div>'
        +'</div>'
        +'<div id="commit-ai-history-list" style="flex:1;overflow-y:auto;padding:0"></div>'
      +'</div>'
      +'<div style="width:34%;min-width:320px;border:1px solid #e5e7eb;border-radius:10px;display:flex;flex-direction:column;overflow:hidden;background:#fff">'
        +'<div style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#0f172a">📄 '+_aiCmpText('当前提交 Diff','Current Commit Diff')+'</div>'
        +'<div style="padding:8px 12px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9">'
          +_aiCmpText('当前: ','Current: ')+'<code>'+escapeHtml((cInfo.short_hash||commitHash.substring(0,7)||''))+'</code>'
          +(cInfo.message?(' · '+escapeHtml(cInfo.message)):'')
          +(cInfo.date?('<div style="margin-top:4px">'+_aiCmpText('日期: ','Date: ')+escapeHtml(cInfo.date)+'</div>'):'')
          +'<div id="commit-ai-compare-target" style="margin-top:4px">'+_aiCmpText('对比历史: 未选择','Comparing with: not selected')+'</div>'
        +'</div>'
        +'<div id="commit-ai-current-diff" style="flex:1;overflow-y:auto;padding:10px;background:#fafafa">'
          +'<div id="commit-ai-compare-sections"></div>'
        +'</div>'
        +'<div style="padding:8px 12px;border-top:1px solid #f1f5f9;background:#f8fafc">'
          +'<button id="commit-ai-purpose-btn" class="btn btn-success" style="padding:5px 10px;font-size:12px" onclick="runCurrentCommitPurposeAnalysis()">🎯 '+(mode==='file'?_aiCmpText('分析修改目的与合理性','Analyze purpose & reasonableness'):_aiCmpText('分析该 Commit 目的与合理性','Analyze this commit purpose & reasonableness'))+'</button>'
        +'</div>'
      +'</div>'
      +'<div style="width:35%;min-width:340px;border:1px solid #e5e7eb;border-radius:10px;display:flex;flex-direction:column;overflow:hidden;background:#fff">'
        +'<div style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#0f172a">🤖 '+_aiCmpText('AI 分析结果','AI Analysis Result')+'</div>'
        +'<div style="padding:8px 12px;border-bottom:1px solid #f1f5f9;background:#f8fafc;display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
          +'<button id="commit-ai-run-btn" class="btn btn-primary" style="padding:5px 10px;font-size:12px" onclick="runCommitHistoryAICompare()" disabled>'+_aiCmpText('分析','Analyze')+'</button>'
          +'<span id="commit-ai-selected-info" style="font-size:12px;color:#64748b">'+_aiCmpText('请先在左侧选择一个历史提交','Select one historical commit from left')+'</span>'
        +'</div>'
        +'<div id="commit-ai-analyze-progress" style="padding:8px 12px;border-bottom:1px solid #f1f5f9;background:#f8fafc;display:none">'
          +'<div style="height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div id="commit-ai-analyze-progress-bar" style="height:100%;width:0;background:linear-gradient(90deg,#34d399,#059669)"></div></div>'
          +'<div id="commit-ai-analyze-progress-label" style="font-size:11px;color:#64748b;margin-top:4px">'+_aiCmpText('分析中...','Analyzing...')+'</div>'
        +'</div>'
        +'<div id="commit-ai-result" style="flex:1;overflow-y:auto;padding:12px;color:#0f172a;font-size:13px;line-height:1.7;background:#fff"></div>'
        +'<div style="padding:8px 12px;border-top:1px solid #f1f5f9;background:#f8fafc">'
          +'<div style="font-size:11px;color:#64748b;margin-bottom:6px">'+_aiCmpText('基于当前分析继续追问','Ask follow-up based on current analysis')+'</div>'
          +'<div style="display:flex;gap:8px;align-items:flex-end">'
            +'<textarea id="commit-ai-followup-input" rows="2" placeholder="'+escapeAttr(_aiCmpText('输入补充上下文或问题...','Type extra context or follow-up question...'))+'" style="flex:1;resize:vertical;min-height:54px;max-height:120px;padding:8px 10px;border:1px solid #d1d5db;border-radius:8px;font-size:12px;line-height:1.4;outline:none"></textarea>'
            +'<button id="commit-ai-followup-btn" class="btn btn-primary" style="padding:6px 12px;font-size:12px" onclick="sendCommitAIFollowup()">'+_aiCmpText('发送','Send')+'</button>'
          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>';

  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var closeBtn=document.createElement('button');
  closeBtn.className='btn btn-secondary';
  closeBtn.textContent=_aiCmpText('关闭','Close');
  closeBtn.onclick=closeModal;
  btnsDiv.appendChild(closeBtn);
  document.getElementById('modal-bg').classList.add('show');

  var listEl=document.getElementById('commit-ai-history-list');
  if(listEl){
    listEl.addEventListener('scroll',function(){
      if(!_commitAIPanelState || _commitAIPanelState.historyLoading || _commitAIPanelState.historyDone) return;
      if(listEl.scrollTop+listEl.clientHeight >= listEl.scrollHeight-40){
        _loadMoreCommitAIHistory();
      }
    });
  }
  _commitAIPanelState.chatHistory=[{
    role:'assistant',
    text:(mode==='file'
      ?_aiCmpText('请选择左侧历史提交后点击“分析”，或点击中间底部按钮分析当前提交目的与合理性。分析完成后可在底部继续对话。','Select a historical commit on the left and click "Analyze", or use the middle-bottom button to analyze current commit purpose/reasonableness. After analysis, continue chatting below.')
      :_aiCmpText('请选择左侧历史提交后点击“分析”，对比整个 Commit 的改动；或点击中间底部按钮分析当前 Commit 的目的与合理性。分析完成后可在底部继续对话。','Select a historical commit on the left and click "Analyze" to compare full commit changes; or use the middle-bottom button to analyze current commit purpose/reasonableness. After analysis, continue chatting below.'))
  }];
  _renderCommitAIChat();
  _renderCommitAIComparisonDiffs();
  _loadMoreCommitAIHistory();
}

function _renderCommitAIChat(){
  var st=_commitAIPanelState;
  var result=document.getElementById('commit-ai-result');
  if(!st||!result)return;
  var html='';
  for(var i=0;i<st.chatHistory.length;i++){
    var m=st.chatHistory[i];
    var isUser=m.role==='user';
    html+='<div style="margin-bottom:10px;display:flex;justify-content:'+(isUser?'flex-end':'flex-start')+'">'
      +'<div style="max-width:92%;padding:8px 10px;border-radius:8px;border:1px solid '+(isUser?'#bfdbfe':'#e2e8f0')+';background:'+(isUser?'#eff6ff':'#f8fafc')+'">'
      +'<div style="font-size:11px;color:#64748b;margin-bottom:4px">'+(isUser?_aiCmpText('你','You'):'AI')+'</div>'
      +'<div style="white-space:pre-wrap;line-height:1.65">'+escapeHtml(m.text||'').replace(/\n/g,'<br>')+'</div>'
      +'</div></div>';
  }
  if(st.chatLoading){
    html+='<div class="commit-ai-thinking">'+_aiCmpText('AI 正在思考...','AI is thinking...')+'</div>';
  }
  result.innerHTML=html;
  result.scrollTop=result.scrollHeight;
}

function _appendCommitAIChat(role,text){
  var st=_commitAIPanelState;
  if(!st)return;
  st.chatHistory.push({role:role,text:text||''});
  _renderCommitAIChat();
}

function _renderCommitAIHistoryList(){
  var st=_commitAIPanelState;
  var listEl=document.getElementById('commit-ai-history-list');
  if(!st||!listEl)return;
  if(!st.historyItems.length){
    listEl.innerHTML='<div style="padding:14px;color:#64748b;font-size:12px">'+(st.mode==='file'?_aiCmpText('该文件没有历史提交记录。','No history commits found for this file.'):_aiCmpText('未找到历史提交记录。','No history commits found.'))+'</div>';
    return;
  }
  var html='';
  st.historyItems.forEach(function(c){
    var active=st.selectedHistoryCommit&&st.selectedHistoryCommit.hash===c.hash;
    html+='<div onclick="selectCommitAIHistory(\''+escapeAttr(c.hash)+'\')"'
      +' style="padding:10px 12px;border-bottom:1px solid #f1f5f9;cursor:pointer;background:'+(active?'#eff6ff':'#fff')+'">'
      +'<div style="font-family:monospace;font-size:12px;color:#1d4ed8;font-weight:700">'+escapeHtml(c.short_hash||c.hash.substring(0,7))+'</div>'
      +'<div style="font-size:11px;color:#64748b;margin-top:2px">'+escapeHtml((c.author||'')+' · '+(c.date||''))+'</div>'
      +'<div style="font-size:12px;color:#0f172a;margin-top:4px;line-height:1.45">'+escapeHtml(c.message||'')+'</div>'
      +'</div>';
  });
  if(st.historyLoading){
    html+='<div style="padding:10px 12px;font-size:12px;color:#64748b">'+_aiCmpText('加载更多中…','Loading more…')+'</div>';
  }else if(st.historyDone){
    html+='<div style="padding:10px 12px;font-size:12px;color:#94a3b8">'+_aiCmpText('已加载全部 ','Loaded all ')+st.historyItems.length+_aiCmpText(' 条提交。',' commits.')+'</div>';
  }else{
    html+='<div style="padding:10px 12px;font-size:12px;color:#94a3b8">'+_aiCmpText('向下滚动继续加载 20 条。','Scroll down to load 20 more.')+'</div>';
  }
  listEl.innerHTML=html;
}

function _loadMoreCommitAIHistory(){
  var st=_commitAIPanelState;
  if(!st||st.historyLoading||st.historyDone)return;
  st.historyLoading=true;
  st.historyPage+=1;
  var progressWrap=document.getElementById('commit-ai-history-progress');
  if(progressWrap) progressWrap.style.display='block';
  var timer=_startAutoProgress('commit-ai-history-progress',_aiCmpText('加载历史提交','Loading history commits'));

  var historyUrl=(st.mode==='file')
    ?('/api/file-commits?file='+encodeURIComponent(st.filePath)+'&page='+st.historyPage+'&per_page='+st.historyPerPage)
    :('/api/commits?page='+st.historyPage+'&per_page='+st.historyPerPage+'&order=desc');
  apiGet(historyUrl,function(data){
    _stopAutoProgress(timer,'commit-ai-history-progress',_aiCmpText('历史提交加载完成','History loaded'));
    setTimeout(function(){ if(progressWrap) progressWrap.style.display='none'; },300);
    st.historyLoading=false;
    st.historyTotal=data.total||0;
    var items=data.commits||[];
    for(var i=0;i<items.length;i++) st.historyItems.push(items[i]);
    if(!items.length || st.historyItems.length>=st.historyTotal) st.historyDone=true;
    _renderCommitAIHistoryList();
    if(!st.selectedHistoryCommit && st.historyItems.length){
      selectCommitAIHistory(st.historyItems[0].hash);
    }
  });
}

function selectCommitAIHistory(hash){
  var st=_commitAIPanelState;
  if(!st)return;
  var item=null;
  for(var i=0;i<st.historyItems.length;i++){
    if(st.historyItems[i].hash===hash){ item=st.historyItems[i]; break; }
  }
  if(!item)return;
  st.selectedHistoryCommit=item;
  st.selectedHistoryDiff='';
  _renderCommitAIComparisonDiffs();
  _renderCommitAIHistoryList();
  var runBtn=document.getElementById('commit-ai-run-btn');
  if(runBtn) runBtn.disabled=true;
  var info=document.getElementById('commit-ai-selected-info');
  if(info) info.textContent=_aiCmpText('正在加载选中提交 diff: ','Loading selected commit diff: ')+(item.short_hash||hash.substring(0,7));
  var result=document.getElementById('commit-ai-result');
  if(result) result.innerHTML='<div style="color:#64748b">'+_aiCmpText('正在加载历史提交 diff...','Loading selected historical commit diff...')+'</div>';
  _renderCommitAIComparisonDiffs();

  var diffUrl=(st.mode==='file')
    ?('/api/file-commit-diff?commit='+encodeURIComponent(hash)+'&file='+encodeURIComponent(st.filePath))
    :('/api/commit-diff?commit='+encodeURIComponent(hash));
  apiGet(diffUrl,function(data){
    st.selectedHistoryDiff=(data.diff||'').trim();
    _renderCommitAIComparisonDiffs();
    if(info) info.textContent=_aiCmpText('已选: ','Selected: ')+(item.short_hash||hash.substring(0,7))+' — '+(item.message||'');
    if(runBtn) runBtn.disabled=!st.selectedHistoryDiff;
    if(result){
      if(!st.selectedHistoryDiff){
        result.innerHTML='<div style="color:#64748b">'+(st.mode==='file'?_aiCmpText('所选提交中没有该文件的 diff，请换一个提交。','No file diff found in selected commit. Please choose another commit.'):_aiCmpText('所选提交没有可用 diff，请换一个提交。','No commit diff found in selected commit. Please choose another commit.'))+'</div>';
      }else{
        result.innerHTML='<div style="font-size:12px;color:#0f172a;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;margin-bottom:10px">'
          +_aiCmpText('历史提交 <code>','Historical commit <code>')+escapeHtml(item.short_hash||hash.substring(0,7))+'</code>'+(st.mode==='file'?_aiCmpText(' 已加载。点击<b>分析</b>与当前提交 diff 对比。',' loaded. Click <b>Analyze</b> to compare with current commit diff.'):_aiCmpText(' 已加载。点击<b>分析</b>与当前 Commit 全量 diff 对比。',' loaded. Click <b>Analyze</b> to compare with current commit full diff.'))
          +'</div>';
      }
    }
  });
}

function runCommitHistoryAICompare(){
  var st=_commitAIPanelState;
  if(!st||!st.selectedHistoryCommit||!st.selectedHistoryDiff)return;
  var cfg=(typeof getAIConfig==='function')?getAIConfig():null;
  if(!cfg||!cfg.provider){
    addMsg('❌ '+_aiCmpText('请先在 AI 面板配置 AI provider。','Please configure AI provider first (AI panel).'),'error');
    return;
  }

  var runBtn=document.getElementById('commit-ai-run-btn');
  if(runBtn){ runBtn.disabled=true; runBtn.textContent=_aiCmpText('分析中...','Analyzing...'); }
  _commitAIPanelState.chatLoading=true;
  _renderCommitAIChat();
  var progressWrap=document.getElementById('commit-ai-analyze-progress');
  if(progressWrap) progressWrap.style.display='block';
  var timer=_startAutoProgress('commit-ai-analyze-progress',_aiCmpText('AI 分析中','AI analyzing'));

  var curMeta=_logCommitMap[st.currentCommitHash]||{};
  var oldMeta=st.selectedHistoryCommit||{};
  var targetScope=(st.mode==='file')?('file "'+st.filePath+'"'):'the full commit changes';
  var prompt=
    'Compare these two commit diffs for '+targetScope+'.\n\n'
    +'Current commit:\n'
    +'- hash: '+(curMeta.short_hash||st.currentCommitHash.substring(0,7))+'\n'
    +'- author: '+(curMeta.author||'')+'\n'
    +'- date: '+(curMeta.date||'')+'\n'
    +'- message: '+(curMeta.message||'')+'\n\n'
    +'Historical commit:\n'
    +'- hash: '+(oldMeta.short_hash||oldMeta.hash||'')+'\n'
    +'- author: '+(oldMeta.author||'')+'\n'
    +'- date: '+(oldMeta.date||'')+'\n'
    +'- message: '+(oldMeta.message||'')+'\n\n'
    +'Current commit diff:\n```diff\n'+st.currentDiff.slice(0,9000)+'\n```\n\n'
    +'Historical commit diff:\n```diff\n'+st.selectedHistoryDiff.slice(0,9000)+'\n```\n\n'
    +'Please provide:\n'
    +'1. What changed from historical to current approach\n'
    +'2. Risk/bug differences\n'
    +'3. Regression concerns\n'
    +'4. Improvement suggestions';

  var messages=[
    {role:'system',content:'You are an expert code reviewer. Compare two commit diffs and produce concise, practical findings in markdown. Include section summaries and risk estimates per section. '+_aiLangInstruction()},
    {role:'user',content:prompt}
  ];

  fetch('/api/ai/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({provider:cfg.provider,api_key:cfg.api_key,base_url:cfg.base_url,model:cfg.model,messages:messages})
  })
  .then(function(r){return r.json();})
  .then(function(data){
    if(!data.ok){
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
      if(progressWrap) progressWrap.style.display='none';
      if(runBtn){ runBtn.disabled=false; runBtn.textContent=_aiCmpText('分析','Analyze'); }
      _commitAIPanelState.chatLoading=false;
      _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 请求失败','AI request failed')));
      return;
    }
    _pollCommitAICompareResult(data.jobId,timer,runBtn,progressWrap);
  })
  .catch(function(e){
    _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
    if(progressWrap) progressWrap.style.display='none';
    if(runBtn){ runBtn.disabled=false; runBtn.textContent=_aiCmpText('分析','Analyze'); }
    _commitAIPanelState.chatLoading=false;
    _appendCommitAIChat('assistant','❌ '+(e.message||_aiCmpText('网络错误','Network error')));
  });
}

function runCurrentCommitPurposeAnalysis(){
  var st=_commitAIPanelState;
  if(!st||!st.currentDiff)return;
  var cfg=(typeof getAIConfig==='function')?getAIConfig():null;
  if(!cfg||!cfg.provider){
    addMsg('❌ '+_aiCmpText('请先在 AI 面板配置 AI provider。','Please configure AI provider first (AI panel).'),'error');
    return;
  }

  var purposeBtn=document.getElementById('commit-ai-purpose-btn');
  if(purposeBtn){ purposeBtn.disabled=true; purposeBtn.textContent=_aiCmpText('分析中...','Analyzing...'); }
  _commitAIPanelState.chatLoading=true;
  _renderCommitAIChat();
  var progressWrap=document.getElementById('commit-ai-analyze-progress');
  if(progressWrap) progressWrap.style.display='block';
  var timer=_startAutoProgress('commit-ai-analyze-progress',_aiCmpText('AI 分析中','AI analyzing'));

  var curMeta=_logCommitMap[st.currentCommitHash]||{};
  var prompt=
    'Analyze the purpose and reasonableness of this code change for '+(st.mode==='file'?('file "'+st.filePath+'"'):'the full commit')+'.\n\n'
    +'Commit metadata:\n'
    +'- hash: '+(curMeta.short_hash||st.currentCommitHash.substring(0,7))+'\n'
    +'- author: '+(curMeta.author||'')+'\n'
    +'- date: '+(curMeta.date||'')+'\n'
    +'- message: '+(curMeta.message||'')+'\n\n'
    +'Diff:\n```diff\n'+st.currentDiff.slice(0,10000)+'\n```\n\n'
    +'Please provide:\n'
    +'1. Business logic impact scope (which product flow / user journey / module behavior may change)\n'
    +'2. Impacted classes / methods / code blocks and their business logic intent\n'
    +'3. Whether the implementation is reasonable and why\n'
    +'4. Possible side effects or risks\n'
    +'5. Suggestions to improve robustness/readability\n'
    +'\nOutput format requirements:\n'
    +'- Use markdown sections.\n'
    +'- For each section, add a short summary line.\n'
    +'- For each section, add a risk estimate (Low/Medium/High) with reason.\n'
    +'- Explicitly mark impacted class names and relevant code blocks.';

  var messages=[
    {role:'system',content:'You are an expert senior engineer. Analyze code-change intent and implementation reasonableness. Be concise, practical, and specific. Always include business impact scope and impacted classes/code blocks. '+_aiLangInstruction()},
    {role:'user',content:prompt}
  ];

  fetch('/api/ai/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({provider:cfg.provider,api_key:cfg.api_key,base_url:cfg.base_url,model:cfg.model,messages:messages})
  })
  .then(function(r){return r.json();})
  .then(function(data){
    if(!data.ok){
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
      if(progressWrap) progressWrap.style.display='none';
      if(purposeBtn){ purposeBtn.disabled=false; purposeBtn.textContent='🎯 '+(st.mode==='file'?_aiCmpText('分析修改目的与合理性','Analyze purpose & reasonableness'):_aiCmpText('分析该 Commit 目的与合理性','Analyze this commit purpose & reasonableness')); }
      _commitAIPanelState.chatLoading=false;
      _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 请求失败','AI request failed')));
      return;
    }
    _pollCommitAIPurposeResult(data.jobId,timer,purposeBtn,progressWrap);
  })
  .catch(function(e){
    _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
    if(progressWrap) progressWrap.style.display='none';
    if(purposeBtn){ purposeBtn.disabled=false; purposeBtn.textContent='🎯 '+(st.mode==='file'?_aiCmpText('分析修改目的与合理性','Analyze purpose & reasonableness'):_aiCmpText('分析该 Commit 目的与合理性','Analyze this commit purpose & reasonableness')); }
    _commitAIPanelState.chatLoading=false;
    _appendCommitAIChat('assistant','❌ '+(e.message||_aiCmpText('网络错误','Network error')));
  });
}

function _pollCommitAIPurposeResult(jobId,timer,purposeBtn,progressWrap){
  var st=_commitAIPanelState||{};
  fetch('/api/ai/chat-status?jobId='+jobId)
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.done){
        setTimeout(function(){_pollCommitAIPurposeResult(jobId,timer,purposeBtn,progressWrap);},800);
        return;
      }
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('完成','Completed'));
      setTimeout(function(){ if(progressWrap) progressWrap.style.display='none'; },300);
      if(purposeBtn){ purposeBtn.disabled=false; purposeBtn.textContent='🎯 '+(st.mode==='file'?_aiCmpText('分析修改目的与合理性','Analyze purpose & reasonableness'):_aiCmpText('分析该 Commit 目的与合理性','Analyze this commit purpose & reasonableness')); }
      _commitAIPanelState.chatLoading=false;
      if(!data.ok){
        _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 分析失败','AI analysis failed')));
        return;
      }
      _appendCommitAIChat('assistant',(st.mode==='file'?_aiCmpText('【当前提交目的/合理性分析】\n','[Current commit purpose/reasonableness analysis]\n'):_aiCmpText('【当前 Commit 目的/合理性分析】\n','[Current commit purpose/reasonableness analysis]\n'))+(data.text||''));
    })
    .catch(function(){
      setTimeout(function(){_pollCommitAIPurposeResult(jobId,timer,purposeBtn,progressWrap);},1200);
    });
}

function _pollCommitAICompareResult(jobId,timer,runBtn,progressWrap){
  fetch('/api/ai/chat-status?jobId='+jobId)
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.done){
        setTimeout(function(){_pollCommitAICompareResult(jobId,timer,runBtn,progressWrap);},800);
        return;
      }
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('完成','Completed'));
      setTimeout(function(){ if(progressWrap) progressWrap.style.display='none'; },300);
      if(runBtn){ runBtn.disabled=false; runBtn.textContent=_aiCmpText('分析','Analyze'); }
      _commitAIPanelState.chatLoading=false;
      if(!data.ok){
        _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 分析失败','AI analysis failed')));
        return;
      }
      _appendCommitAIChat('assistant',_aiCmpText('【历史提交对比分析】\n','[Historical commit comparison]\n')+(data.text||''));
    })
    .catch(function(){
      setTimeout(function(){_pollCommitAICompareResult(jobId,timer,runBtn,progressWrap);},1200);
    });
}

function sendCommitAIFollowup(){
  var st=_commitAIPanelState;
  if(!st)return;
  var input=document.getElementById('commit-ai-followup-input');
  var btn=document.getElementById('commit-ai-followup-btn');
  var text=((input&&input.value)||'').trim();
  if(!text)return;
  var cfg=(typeof getAIConfig==='function')?getAIConfig():null;
  if(!cfg||!cfg.provider){
    addMsg('❌ '+_aiCmpText('请先在 AI 面板配置 AI provider。','Please configure AI provider first (AI panel).'),'error');
    return;
  }
  if(input) input.value='';
  _appendCommitAIChat('user',text);
  st.chatLoading=true;
  _renderCommitAIChat();
  if(btn){ btn.disabled=true; btn.textContent=_aiCmpText('发送中...','Sending...'); }
  var progressWrap=document.getElementById('commit-ai-analyze-progress');
  if(progressWrap) progressWrap.style.display='block';
  var timer=_startAutoProgress('commit-ai-analyze-progress',_aiCmpText('AI 对话中','AI chatting'));

  var curMeta=_logCommitMap[st.currentCommitHash]||{};
  var oldMeta=st.selectedHistoryCommit||{};
  var context='Context:\n'
    +(st.mode==='file'?('- file: '+st.filePath+'\n'):'- scope: full commit changes\n')
    +'- current commit: '+(curMeta.short_hash||st.currentCommitHash.substring(0,7))+' '+(curMeta.message||'')+'\n';
  if(st.selectedHistoryCommit){
    context+='- selected history commit: '+(oldMeta.short_hash||oldMeta.hash||'')+' '+(oldMeta.message||'')+'\n';
  }
  context+='\nCurrent commit diff:\n```diff\n'+(st.currentDiff||'').slice(0,4500)+'\n```\n';
  if(st.selectedHistoryDiff){
    context+='\nSelected history diff:\n```diff\n'+(st.selectedHistoryDiff||'').slice(0,4500)+'\n```\n';
  }

  var messages=[{
    role:'system',
    content:'You are continuing an in-context code analysis conversation. Keep continuity with prior analysis and user follow-up context. '+_aiLangInstruction()
  }];
  var turns=st.chatHistory.slice(-12);
  for(var i=0;i<turns.length;i++){
    var t=turns[i];
    if(t.role==='user' || t.role==='assistant'){
      messages.push({role:t.role,content:t.text||''});
    }
  }
  messages.push({role:'user',content:context+'\nUser follow-up:\n'+text});

  fetch('/api/ai/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({provider:cfg.provider,api_key:cfg.api_key,base_url:cfg.base_url,model:cfg.model,messages:messages})
  })
  .then(function(r){return r.json();})
  .then(function(data){
    if(!data.ok){
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
      if(progressWrap) progressWrap.style.display='none';
      st.chatLoading=false;
      _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 请求失败','AI request failed')));
      if(btn){ btn.disabled=false; btn.textContent=_aiCmpText('发送','Send'); }
      return;
    }
    _pollCommitAIFollowupResult(data.jobId,timer,btn,progressWrap);
  })
  .catch(function(e){
    _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('失败','Failed'));
    if(progressWrap) progressWrap.style.display='none';
    st.chatLoading=false;
    _appendCommitAIChat('assistant','❌ '+(e.message||_aiCmpText('网络错误','Network error')));
    if(btn){ btn.disabled=false; btn.textContent=_aiCmpText('发送','Send'); }
  });
}

function _pollCommitAIFollowupResult(jobId,timer,btn,progressWrap){
  fetch('/api/ai/chat-status?jobId='+jobId)
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.done){
        setTimeout(function(){_pollCommitAIFollowupResult(jobId,timer,btn,progressWrap);},800);
        return;
      }
      _stopAutoProgress(timer,'commit-ai-analyze-progress',_aiCmpText('完成','Completed'));
      setTimeout(function(){ if(progressWrap) progressWrap.style.display='none'; },300);
      _commitAIPanelState.chatLoading=false;
      if(btn){ btn.disabled=false; btn.textContent=_aiCmpText('发送','Send'); }
      if(!data.ok){
        _appendCommitAIChat('assistant','❌ '+(data.error||_aiCmpText('AI 分析失败','AI analysis failed')));
        return;
      }
      _appendCommitAIChat('assistant',data.text||'');
    })
    .catch(function(){
      setTimeout(function(){_pollCommitAIFollowupResult(jobId,timer,btn,progressWrap);},1200);
    });
}

function toggleDiffFile(id, header){
  var el=document.getElementById(id);
  var toggle=document.getElementById(id+'-toggle');
  if(el.style.display!=='none'){el.style.display='none';if(toggle)toggle.classList.remove('open');return}
  el.style.display='block';if(toggle)toggle.classList.add('open');
}

function resetFileToCommit(file, commitHash){
  showModal('Reset File','Reset <b>'+escapeHtml(file)+'</b> to commit <b>'+escapeHtml(commitHash.substr(0,7))+'</b>?<br>This will overwrite the current file!','Restore',function(){
    apiPost('/api/reset-file',{file:file,commit:commitHash},function(data){
      if(data.ok)addMsg(t('file_restored')+file,'success');
      else addMsg(t('restore_failed')+(data.error||''),'error');
    });
  });
}

// ═══════════ Restore File Page ═══════════
var _restoreFile=null;
function openRestorePage(file){
  _restoreFile=file;
  switchPage('restore');
  document.getElementById('restore-filepath').textContent=file;
  document.getElementById('restore-result').innerHTML='';
  loadRestoreCommits(1);
}

function loadRestoreCommits(page){
  page=page||1;
  document.getElementById('restore-commits-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commit history for this file...</div>';
  document.getElementById('restore-pagination').innerHTML='';
  var perPage=20;
  apiGet('/api/file-commits?file='+encodeURIComponent(_restoreFile)+'&page='+page+'&per_page='+perPage,function(data){
    var container=document.getElementById('restore-commits-content');
    if(!data.commits||!data.commits.length){
      container.innerHTML='<div class="empty">No commit history found for this file.</div>';
      return;
    }
    var html='<table class="log-table"><thead><tr>';
    html+='<th style="width:20px"></th>';
    html+='<th>Hash</th><th>Author</th><th>Date</th><th>Message</th><th>Action</th>';
    html+='</tr></thead><tbody>';
    data.commits.forEach(function(c,idx){
      html+='<tr style="cursor:pointer" onclick="toggleRestoreDiff(\''+escapeAttr(c.hash)+'\','+idx+')">';
      html+='<td style="text-align:center"><span class="file-toggle" id="restore-toggle-'+idx+'">▶</span></td>';
      html+='<td><span class="log-hash">'+escapeHtml(c.short_hash)+'</span></td>';
      html+='<td class="log-author">'+escapeHtml(c.author)+'</td>';
      html+='<td class="log-date">'+escapeHtml(c.date)+'</td>';
      html+='<td class="log-msg">'+_renderCommitMessageCell(c.message,'restore-msg-'+idx,'')+'</td>';
      html+='<td><button class="btn btn-sm btn-warning" onclick="event.stopPropagation();doRestoreFile(\''+escapeAttr(_restoreFile)+'\',\''+escapeAttr(c.hash)+'\',\''+escapeAttr(c.short_hash)+'\')">Restore to this</button></td>';
      html+='</tr>';
      html+='<tr id="restore-diff-row-'+idx+'" style="display:none"><td colspan="6" style="padding:0">';
      html+='<div id="restore-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto;background:#fafafa;border-top:1px solid #e5e7eb"></div>';
      html+='</td></tr>';
    });
    html+='</tbody></table>';
    container.innerHTML=html;
    var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
    _setSmartPagination('restore', totalPages, data.page, 'loadRestoreCommits', data.total);
  });
}

function toggleRestoreDiff(hash,idx){
  var row=document.getElementById('restore-diff-row-'+idx);
  var diffEl=document.getElementById('restore-diff-'+idx);
  var toggle=document.getElementById('restore-toggle-'+idx);
  if(row.style.display!=='none'){
    row.style.display='none';
    if(toggle)toggle.classList.remove('open');
    return;
  }
  row.style.display='table-row';
  if(toggle)toggle.classList.add('open');
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff for this commit...</div>';
  apiGet('/api/file-commit-diff?commit='+encodeURIComponent(hash)+'&file='+encodeURIComponent(_restoreFile),function(data){
    if(!data.diff||!data.diff.trim()){
      diffEl.innerHTML='<div style="padding:16px;color:#6b7280;font-size:13px">No changes to this file in this commit.</div>';
      return;
    }
    diffEl.innerHTML='<div class="diff-block">'+highlightDiff(data.diff)+'</div>';
  });
}

function doRestoreFile(file,hash,shortHash){
  showModal('Restore File',
    'Restore <b>'+escapeHtml(file)+'</b> to commit <b>'+escapeHtml(shortHash)+'</b>?<br><span style="color:#dc2626;font-size:13px">⚠️ This will overwrite your current working copy of this file.</span>',
    'Restore',function(){
    apiPost('/api/reset-file',{file:file,commit:hash},function(data){
      var res=document.getElementById('restore-result');
      if(data.ok){
        res.innerHTML='<span class="restore-status ok">✓ Restored to '+escapeHtml(shortHash)+'</span>';
        showToast('File restored to '+shortHash,'ok',3000);
        addMsg(t('file_restored')+file+' → '+shortHash,'success');
      }else{
        res.innerHTML='<span class="restore-status err">✗ Restore failed: '+escapeHtml(data.error||'unknown error')+'</span>';
        showToast('Restore failed','err',3000);
        addMsg(t('restore_failed')+(data.error||''),'error');
      }
    });
  });
}

// ═══════════ Branch Search ═══════════

function onBranchSearchInput(){
  var search=document.getElementById('branch-search').value;
  document.getElementById('branch-search-clear').style.display=search?'inline-block':'none';
  clearTimeout(_branchSearchTimer);
  _branchSearchTimer=setTimeout(function(){
    var _bpv=document.getElementById('branches-per-page').value;
    var perPage=_bpv===''?20:parseInt(_bpv);
    if(_allBranchesCache){
      _renderBranchesByTab(_allBranchesCache,1,perPage);
    }else{
      document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Searching...</div>';
      apiGet('/api/branches?page=1&per_page=0',function(data){
        _allBranchesCache=data;
        _updateBranchTabCounts(data);
        _renderBranchesByTab(data,1,perPage);
      });
    }
  },200);
}

function setBranchSearchTag(tag){
  var inp=document.getElementById('branch-search');
  inp.value=tag;
  document.getElementById('branch-search-clear').style.display='inline-block';
  onBranchSearchInput();
}

function clearBranchSearch(){
  document.getElementById('branch-search').value='';
  document.getElementById('branch-search-clear').style.display='none';
  if(_allBranchesCache){
    var _bpv=document.getElementById('branches-per-page').value;
    var perPage=_bpv===''?20:parseInt(_bpv);
    _renderBranchesByTab(_allBranchesCache,1,perPage);
  }else{
    loadBranches(1);
  }
}


function showBranchNamePopover(btn, name) {
  var existing = document.querySelector('.branch-name-popover');
  if (existing) {
    if (existing._triggerBtn === btn) { existing.remove(); return; }
    existing.remove();
  }
  var pop = document.createElement('div');
  pop.className = 'branch-name-popover';
  pop._triggerBtn = btn;
  pop.innerHTML = '<span class="pop-name">'+escapeHtml(name)+'</span>'
    + '<button class="pop-copy" onclick="navigator.clipboard.writeText(\''+escapeJS(name)+'\').then(function(){this.textContent=\'✓ Copied\';}.bind(this))">📋 Copy</button>';
  document.body.appendChild(pop);
  var rect = btn.getBoundingClientRect();
  var popW = 320;
  var left = Math.min(rect.left, window.innerWidth - popW - 8);
  pop.style.top = (rect.bottom + 6) + 'px';
  pop.style.left = Math.max(8, left) + 'px';
  setTimeout(function() {
    function outsideClick(e) {
      if (!pop.contains(e.target) && e.target !== btn) {
        pop.remove();
        document.removeEventListener('click', outsideClick);
      }
    }
    document.addEventListener('click', outsideClick);
  }, 0);
}

function _highlightBranchMatch(escaped,search){
  var lower=escaped.toLowerCase();
  var idx=lower.indexOf(search);
  if(idx<0)return escaped;
  return escaped.substr(0,idx)+'<mark>'+escaped.substr(idx,search.length)+'</mark>'+escaped.substr(idx+search.length);
}

var _diffSearchTimer=null;
var _inDiffSearchMode=false;
function filterCommitDiffs(){
  var search=document.getElementById('log-code-search').value.trim();
  clearTimeout(_diffSearchTimer);
  if(!search){
    // Only restore normal view if we were previously in diff-search mode
    if(_inDiffSearchMode){
      _inDiffSearchMode=false;
      if(currentLogData){renderLog(currentLogData);renderPagination(currentLogData);}
    }
    return;
  }
  _diffSearchTimer=setTimeout(function(){
    _inDiffSearchMode=true;
    document.getElementById('log-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Searching diffs for "'+escapeHtml(search)+'"...</div>';
    document.getElementById('log-pagination').innerHTML='';
    apiGet('/api/search-diff?pattern='+encodeURIComponent(search),function(data){
      if(data.error){addMsg('Diff search error: '+escapeHtml(data.error),'error');return;}
      var fakeData={commits:data.commits,total:data.total,page:1,per_page:data.total||1};
      renderLog(fakeData);
      var pag=document.getElementById('log-pagination');
      if(data.total===0){
        pag.innerHTML='<span class="page-info">No results for "'+escapeHtml(search)+'"</span>';
        showToast('No diff matches found','err',2500);
      }else{
        pag.innerHTML='<span class="page-info">Diff search: <b>'+data.total+'</b> commit(s) matched "'+escapeHtml(search)+'"</span>';
        showToast('Found '+data.total+' commit(s) matching diff','ok',2500);
      }
    });
  },400);
}

function updateSquashBar(){
  var panel=document.getElementById('squash-panel');
  var keys=Object.keys(squashSelected);
  if(!keys.length){panel.style.display='none';return;}
  panel.style.display='block';

  // Count label
  var countEl=document.getElementById('squash-panel-count');
  if(countEl) countEl.textContent=keys.length+(L==='zh'?' 个已选':' selected');

  // Build ordered list of selected commits (by log order if available)
  var orderedHashes=[];
  if(currentLogData&&currentLogData.commits){
    currentLogData.commits.forEach(function(c){if(squashSelected[c.hash])orderedHashes.push(c.hash);});
  }
  // Append any selected commits not in current page
  keys.forEach(function(h){if(orderedHashes.indexOf(h)<0)orderedHashes.push(h);});

  // Detect non-adjacent: find gaps in the log order
  var logHashes=(currentLogData&&currentLogData.commits)?currentLogData.commits.map(function(c){return c.hash;}):[];
  var selPositions=logHashes.map(function(h,i){return squashSelected[h]?i:-1;}).filter(function(i){return i>=0;});
  var nonAdj=false;
  for(var i=1;i<selPositions.length;i++){
    if(selPositions[i]-selPositions[i-1]>1){nonAdj=true;break;}
  }
  var noteEl=document.getElementById('squash-panel-nonadj-note');
  if(noteEl) noteEl.style.display=nonAdj?'block':'none';

  // Squash button state
  var doBtn=document.getElementById('squash-do-btn');
  if(doBtn){
    if(keys.length<2){
      doBtn.disabled=true;
      doBtn.title=L==='zh'?'至少选 2 个 commit':'Select at least 2 commits';
      doBtn.style.opacity='0.45';
    } else {
      doBtn.disabled=false;
      doBtn.title='';
      doBtn.style.opacity='';
    }
  }

  // Render commit rows
  var listEl=document.getElementById('squash-panel-list');
  if(!listEl) return;
  var html='';
  orderedHashes.forEach(function(hash){
    var c=squashCommitCache[hash]||_logCommitMap[hash]||{hash:hash,short_hash:hash.substr(0,7),author:'',message:'',gpg_status:''};
    var gpg=c.gpg_status||'';
    var gpgBadge='';
    if(gpg==='G'||gpg==='U'||gpg==='X'||gpg==='Y'||gpg==='R'){
      gpgBadge='<span class="sp-gpg" style="font-size:10px;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;border-radius:12px;padding:1px 6px">🔐</span>';
    } else if(gpg==='N'||gpg==='B'||gpg==='E'){
      gpgBadge='<span class="sp-gpg" style="font-size:10px;background:#fef9c3;color:#92400e;border:1px solid #fcd34d;border-radius:12px;padding:1px 6px">🔓</span>';
    }
    html+='<div class="squash-panel-item">'
      +'<button class="sp-remove" onclick="removeFromSquash(\''+escapeAttr(hash)+'\')" title="Remove from squash">✕</button>'
      +'<span class="sp-hash">'+escapeHtml(c.short_hash||hash.substr(0,7))+'</span>'
      +gpgBadge
      +'<span class="sp-author">'+escapeHtml(c.author||'')+'</span>'
      +'<span class="sp-msg" title="'+escapeAttr(c.message||'')+'">'+escapeHtml(c.message||'')+'</span>'
      +'</div>';
  });
  if(!html) html='<div style="padding:10px 14px;color:#94a3b8;font-size:12px">'+(L==='zh'?'无选中 commit':'No commits selected')+'</div>';
  listEl.innerHTML=html;
}
function toggleHash(el){
  var full = el.getAttribute('data-full');
  var cur = el.textContent;
  if (cur.length > 10) el.textContent = full.substr(0,7);
  else el.textContent = full;
}
function toggleSquashSelect(cb){
  if(cb.disabled)return;
  var hash=cb.dataset.hash;
  if(cb.checked){
    squashSelected[hash]=true;
    // Cache commit data now so it's available even after page change
    if(_logCommitMap[hash]) squashCommitCache[hash]=_logCommitMap[hash];
  } else {
    delete squashSelected[hash];
    delete squashCommitCache[hash];
  }
  updateSquashBar();
}
function removeFromSquash(hash){
  delete squashSelected[hash];
  delete squashCommitCache[hash];
  var cb=document.querySelector('.squash-cb[data-hash="'+hash+'"]');
  if(cb) cb.checked=false;
  updateSquashBar();
}
function cancelSquash(){
  squashSelected={};
  squashCommitCache={};
  updateSquashBar();
  var msgEl=document.getElementById('squash-msg');
  if(msgEl) msgEl.value='';
  document.querySelectorAll('.squash-cb').forEach(function(cb){cb.checked=false;});
}
// ═══════════ Protected Branch Guard ═══════════
// Config loaded from server — refreshed every time loadBranches() runs
var _protExact = [];    // exact-match names
var _protContains = []; // lowercase keywords — branch name must contain one

function _isBranchProtected(shortName){
  if(!shortName) return false;
  if(_protExact.indexOf(shortName) !== -1) return true;
  var low = shortName.toLowerCase();
  for(var i=0;i<_protContains.length;i++){ if(low.indexOf(_protContains[i]) !== -1) return true; }
  return false;
}
// Used for commit/squash warnings (same rules, same config)
function _isProtectedBranch(name){
  if(!name) return false;
  return _isBranchProtected(name.trim().replace(/^origin\//, ''));
}
function _warnProtectedThenDo(actionKey, callback){
  var branchEl = document.getElementById('branch-name');
  var branch = branchEl ? branchEl.textContent.trim() : '';
  if(!_isProtectedBranch(branch)){ callback(); return; }
  var msgHtml = tf(actionKey, L, {branch: escapeHtml(branch)});
  // Show modal with red-tinted warning styling
  var title = t('protected_branch_title');
  var bg = document.getElementById('modal-bg');
  var box = bg ? bg.querySelector('.modal-box') : null;
  showModal(title, msgHtml, t('proceed_anyway'), function(){
    callback();
  });
  // Tint the modal header red to signal danger
  if(box){
    var h3 = box.querySelector('h3');
    if(h3){ h3.style.color='#dc2626'; h3.style.background='#fef2f2'; h3.style.padding='12px 20px'; h3.style.margin='-20px -20px 16px'; h3.style.borderRadius='12px 12px 0 0'; h3.style.borderBottom='2px solid #fca5a5'; }
    var confirmBtn = box.querySelector('.modal-confirm');
    if(confirmBtn){ confirmBtn.style.background='#dc2626'; confirmBtn.style.borderColor='#b91c1c'; }
  }
}

function doSquash(){
  var keys=Object.keys(squashSelected);
  if(keys.length<2){addMsg(t('select_2_commits'),'error');return}
  var msg=document.getElementById('squash-msg').value.trim();
  if(!msg){addMsg(t('enter_squash_msg'),'error');return}

  // Collect hashes ordered by log (current page first, then any cross-page selections)
  var hashes=[];
  var seen={};
  // First pass: in-page order from currentLogData
  if(currentLogData&&currentLogData.commits){
    currentLogData.commits.forEach(function(c){
      if(squashSelected[c.hash]){hashes.push(c.hash);seen[c.hash]=true;}
    });
  }
  // Second pass: cross-page commits from cache (order by date desc from cache)
  keys.forEach(function(h){if(!seen[h])hashes.push(h);});

  if(hashes.length<2){addMsg(t('select_2_commits'),'error');return;}

  var gpgOn=(document.getElementById('gpg-sign-toggle')||{}).checked;

  _warnProtectedThenDo('protected_branch_squash', function(){
    showModal('Squash',
      tf('squash_confirm',L,{n:hashes.length}),
      'Squash',function(){
        addMsg(L==='zh'?'🔀 正在 Squash...':'🔀 Squashing...','info');
        apiPost('/api/squash-selected',{hashes:hashes,message:msg,gpg_sign:!!gpgOn},function(data){
          if(data.ok){
            squashSelected={};squashCommitCache={};_reloadLog(1);loadFiles();
            addMsg(data.message||t('squash_ok'),'success');
            doForcePush();
          } else {
            addMsg(t('squash_fail')+(data.error||''),'error');
          }
        });
      }
    );
  });
}

function renderPagination(data){
  var pag=document.getElementById('log-pagination');
  var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
  _setSmartPagination('log', totalPages, data.page, 'loadLog', data.total);
}

function showResetModal(hash,shortHash){
  showModalDouble('Reset to '+shortHash,t('reset_desc'),t('reset_soft'),function(){doReset(hash,'soft')},t('reset_hard'),function(){doReset(hash,'hard')});
}
function showRevertModal(hash,shortHash){
  showModalDouble('Revert / Drop '+shortHash,t('revert_or_drop_desc'),
    'Revert',function(){
      apiPost('/api/revert',{commit:hash},function(data){
        if(data.ok){addMsg(t('revert_ok'),'success');_reloadLog(1);loadFiles()}
        else addMsg(t('revert_fail')+(data.error||''),'error');
      });
    },
    'Drop',function(){
      apiPost('/api/drop_commit',{commit:hash},function(data){
        if(data.ok){addMsg(t('drop_ok'),'success');_reloadLog(1);loadFiles()}
        else addMsg(t('drop_fail')+(data.error||''),'error');
      });
    },
    'btn-warning','btn-danger'
  );
}
function doReset(hash,mode){
  apiPost('/api/reset',{commit:hash,mode:mode},function(data){
    if(data.ok){
      addMsg(tf('reset_ok',L,{mode:mode}),'success');
      _reloadLog(1);loadFiles();loadCurrentBranch();
      if(mode==='hard'){
        var branch=(document.getElementById('branch-name')||{}).textContent||'current branch';
        var warn='<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:8px;padding:10px 14px;font-size:13px;color:#92400e;margin-bottom:8px">'
          +(L==='zh'
            ?'⚠️ 这个操作会改写历史。若该分支已推送过，请使用 <b>Force Push</b> 更新远端。'
            :'⚠️ This operation rewrites history. If this branch was already pushed, use <b>Force Push</b> to update remote.')
          +'</div>';
        showModalDouble(
          t('reset_hard_push_title'),
          warn+tf('reset_hard_push_desc',L,{branch:escapeHtml(branch)}),
          t('reset_hard_force_btn'),
          function(){ doPushForce(); },
          t('push_later_btn'),
          null,
          'btn-warning',
          'btn-secondary'
        );
      }
    }
    else addMsg(t('reset_fail')+(data.error||''),'error');
  });
}
function abortMerge(){
  showModal(t('conflict_reset_title'),t('conflict_reset_desc'),'Reset',function(){
    apiPost('/api/abort',{},function(data){
      if(data.ok){addMsg(t('conflict_reset_ok'),'success');loadFiles();checkConflicts();_reloadLog(1)}
      else addMsg(t('no_conflict_abort')+(data.error||''),'info');
    });
  });
}

function showModalDouble(title,msg,btn1Label,btn1Cb,btn2Label,btn2Cb,btn1Class,btn2Class){
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var cancel=document.createElement('button');cancel.className='btn btn-secondary';cancel.textContent='Cancel';cancel.onclick=closeModal;
  var b1=document.createElement('button');b1.className='btn '+(btn1Class||'btn-warning');b1.textContent=btn1Label;b1.onclick=function(){var c=btn1Cb;closeModal();if(c)c()};
  btnsDiv.appendChild(cancel);
  if(btn2Label){
    var b2=document.createElement('button');b2.className='btn '+(btn2Class||'btn-secondary');b2.textContent=btn2Label;b2.onclick=function(){var c=btn2Cb;closeModal();if(c)c()};
    btnsDiv.appendChild(b2);
  }
  btnsDiv.appendChild(b1);
  document.getElementById('modal-bg').classList.add('show');
}

// ═══════════ Conflicts page ═══════════
// conflict state: conflictChoices[filePath] = array of {type:'ours'|'theirs'|'manual'|null, content:string}, indexed by conflict block order
var conflictChoices = {};
var _conflictData = {}; // filePath -> {blocks, raw}

function loadConflicts(){
  switchPage('conflicts');
  fetch(API_BASE+'/api/conflicts',{cache:'no-store'})
    .then(function(r){return r.json();})
    .then(function(data){
    _updateConflictTabBadge(data.count||0);
    if(data.count===0){document.getElementById('conflicts-content').innerHTML='<div class="empty">🎉 '+t('no_conflict')+'</div>';return}
    var html='';
    var mergeTypeLabel=(data.merge_type||'merge').replace('-', ' ');
    html+='<div style="margin-bottom:12px;padding:12px 14px;background:#fff7ed;border:1px solid #fdba74;border-radius:10px">'
      +'<div style="font-weight:700;color:#9a3412;margin-bottom:6px">⚠️ '+data.count+' conflict file'+(data.count===1?'':'s')+' still need action</div>'
      +'<div style="font-size:13px;color:#7c2d12;line-height:1.6">Current step: <b>'+escapeHtml(mergeTypeLabel)+'</b> on <b>'+escapeHtml(data.branch||'?')+'</b> is paused. '
      +'Resolve each file below. After the last conflict is cleared, the tool will prompt you to continue/commit automatically.</div>'
      +'</div>';
    // AI quick-resolve bar at the top
    html+='<div class="ai-analyze-bar">';
    html+='<button class="ai-conflict-btn" onclick="aiQuickAction(\'analyze-conflicts\')">🤖 AI Analyze All Conflicts</button>';
    html+='<button class="ai-conflict-btn" style="background:linear-gradient(135deg,#10b981,#059669)" onclick="aiQuickAction(\'accept-ours\')">⬅️ Accept All Ours</button>';
    html+='<button class="ai-conflict-btn" style="background:linear-gradient(135deg,#3b82f6,#2563eb)" onclick="aiQuickAction(\'accept-theirs\')">➡️ Accept All Theirs</button>';
    html+='</div>';
    for(var i=0;i<data.files.length;i++){
      var fp=data.files[i];
      var extCls=expandedPaths[fp]?' expanded':'';
      var toggleCls=expandedPaths[fp]?' file-toggle open':' file-toggle';
      html+='<div class="conflict-file" id="cf-file-'+i+'">';
      html+='<div class="conflict-header" onclick="toggleConflict(\''+escapeAttr(fp)+'\','+i+')">';
      html+='<span class="'+toggleCls+'" id="cf-toggle-'+i+'">▶</span>';
      html+='<span class="conflict-path">'+escapeHtml(fp)+'</span>';
      if(resolvedConflicts[fp])html+='<span class="resolved-tag">✓ Resolved</span>';
      html+='</div>';
      html+='<div class="conflict-content'+extCls+'" id="conflict-body-'+i+'">';
      html+='<div id="conflict-detail-'+i+'">Click to expand</div>';
      html+='</div></div>';
    }
    document.getElementById('conflicts-content').innerHTML=html;
    // auto-expand first file
    if(data.files.length>0 && !expandedPaths[data.files[0]]) toggleConflict(data.files[0],0);
  }).catch(function(){});
}

function toggleConflict(filePath,idx){
  var body=document.getElementById('conflict-body-'+idx);
  var tog=document.getElementById('cf-toggle-'+idx);
  if(body.classList.contains('expanded')){
    body.classList.remove('expanded');
    if(tog)tog.classList.remove('open');
    delete expandedPaths[filePath];
    return;
  }
  body.classList.add('expanded');
  if(tog)tog.classList.add('open');
  expandedPaths[filePath]=true;
  var detail=document.getElementById('conflict-detail-'+idx);
  detail.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading conflict...</div>';
  apiPost('/api/conflict-detail',{path:filePath},function(data){
    _conflictData[filePath]=data;
    if(!conflictChoices[filePath]){
      // init choices array with nulls for each conflict block
      var numConflicts=0;
      for(var b=0;b<(data.blocks||[]).length;b++) if(data.blocks[b].type==='conflict') numConflicts++;
      conflictChoices[filePath]=new Array(numConflicts).fill(null).map(function(){return{type:null,content:''};});
    }
    renderConflictDetail(filePath, idx, data);
  });
}

// ─── Code editor with live syntax highlighting ────────────────────────────
var _cfEditorTheme=(function(){try{return localStorage.getItem('cf_editor_theme')||'dark';}catch(e){return 'dark';}})();
var _CF_THEMES={
  dark:{bg:'#1e1e2e',text:'#cdd6f4',caret:'#f5c2e7',border:'#5a3d8f',
    kw:'#cba6f7',str:'#a6e3a1',cmt:'#585b70',num:'#fab387',type:'#89dceb',fn:'#89b4fa',dec:'#f38ba8'},
  light:{bg:'#f6f8fa',text:'#24292f',caret:'#0550ae',border:'#8250df',
    kw:'#cf222e',str:'#0a3069',cmt:'#6e7781',num:'#0550ae',type:'#953800',fn:'#8250df',dec:'#116329'}
};
function _cfApplyTheme(wrap,theme){
  var t=_CF_THEMES[theme]||_CF_THEMES.dark;
  var s=wrap.style;
  s.setProperty('--cf-bg',t.bg);s.setProperty('--cf-text',t.text);
  s.setProperty('--cf-caret',t.caret);s.setProperty('--cf-border',t.border);
  s.setProperty('--cf-kw',t.kw);s.setProperty('--cf-str',t.str);
  s.setProperty('--cf-cmt',t.cmt);s.setProperty('--cf-num',t.num);
  s.setProperty('--cf-type',t.type);s.setProperty('--cf-fn',t.fn);
  s.setProperty('--cf-dec',t.dec);
  wrap.dataset.theme=theme;
}
function _cfEdUpdate(hl,ta,lang){
  hl.innerHTML=_synHL(ta.value,lang);
  hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;
}
function _cfEditorInit(wrapId,lang){
  var wrap=document.getElementById(wrapId);
  if(!wrap||wrap.dataset.initialized)return;
  var ta=wrap.querySelector('.cf-editor-ta');
  var hl=wrap.querySelector('.cf-editor-hl');
  if(!ta||!hl)return;
  wrap.dataset.lang=lang||'';
  _cfApplyTheme(wrap,_cfEditorTheme);
  _cfEdUpdate(hl,ta,lang);
  ta.addEventListener('input',function(){_cfEdUpdate(hl,ta,lang);});
  ta.addEventListener('scroll',function(){hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;});
  ta.addEventListener('keydown',function(e){
    if(e.key==='Tab'){
      e.preventDefault();
      var s=ta.selectionStart,end=ta.selectionEnd;
      ta.value=ta.value.slice(0,s)+'  '+ta.value.slice(end);
      ta.selectionStart=ta.selectionEnd=s+2;
      _cfEdUpdate(hl,ta,lang);
    }
  });
  wrap.dataset.initialized='1';
}
function _cfSwitchTheme(theme){
  _cfEditorTheme=theme;
  try{localStorage.setItem('cf_editor_theme',theme);}catch(e){}
  document.querySelectorAll('.cf-editor-wrap').forEach(function(wrap){
    _cfApplyTheme(wrap,theme);
    var ta=wrap.querySelector('.cf-editor-ta');
    var hl=wrap.querySelector('.cf-editor-hl');
    if(ta&&hl)_cfEdUpdate(hl,ta,wrap.dataset.lang||'');
  });
}
// ─── End code editor ──────────────────────────────────────────────────────

// ─── Built-in syntax highlighter (no CDN needed) ───────────────────────────
var _HL_KEYWORDS = {
  swift:    /\b(func|class|struct|enum|protocol|extension|var|let|if|else|guard|return|import|init|self|super|override|public|private|internal|final|static|mutating|throws|try|catch|async|await|for|in|while|switch|case|default|break|continue|nil|true|false|where|typealias|associatedtype|some|any|inout|defer)\b/g,
  kotlin:   /\b(fun|class|object|interface|val|var|if|else|return|import|when|for|in|while|do|is|as|null|true|false|override|data|sealed|companion|private|public|internal|protected|abstract|open|suspend|coroutine|by|init|constructor|this|super|typealias|operator|infix|inline|crossinline|noinline|reified|lateinit|lazy|const)\b/g,
  java:     /\b(class|interface|enum|extends|implements|import|package|public|private|protected|static|final|void|return|if|else|for|while|do|switch|case|default|break|continue|new|this|super|null|true|false|try|catch|finally|throw|throws|abstract|synchronized|volatile|native|transient|instanceof)\b/g,
  python:   /\b(def|class|import|from|if|elif|else|for|while|return|in|not|and|or|is|None|True|False|try|except|finally|raise|with|as|pass|break|continue|lambda|yield|global|nonlocal|del|assert|async|await)\b/g,
  javascript:/\b(function|const|let|var|if|else|return|import|export|default|from|class|extends|new|this|typeof|instanceof|null|undefined|true|false|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|yield|of|in)\b/g,
  typescript:/\b(function|const|let|var|if|else|return|import|export|default|from|class|extends|new|this|typeof|instanceof|null|undefined|true|false|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|yield|of|in|interface|type|enum|namespace|declare|abstract|implements|readonly|private|public|protected|override|as)\b/g,
  go:       /\b(func|package|import|var|const|type|struct|interface|if|else|return|for|range|switch|case|default|break|continue|go|chan|select|defer|make|new|nil|true|false|map|append|len|cap|close|panic|recover|error)\b/g,
  rust:     /\b(fn|let|mut|const|struct|enum|trait|impl|use|pub|mod|if|else|return|for|in|while|loop|match|break|continue|self|super|crate|move|ref|where|async|await|dyn|type|unsafe|extern|static|true|false|None|Some|Ok|Err)\b/g,
  objectivec:/\b(self|super|nil|YES|NO|id|void|int|NSString|NSArray|NSDictionary|NSInteger|CGFloat|BOOL|IBOutlet|IBAction|readonly|readwrite|nonatomic|atomic|strong|weak|copy|assign|retain|release|autoreleasepool|if|else|for|while|return|import|interface|implementation|protocol|property|synthesize|end)\b/g,
  dart:     /\b(void|var|final|const|class|extends|implements|mixin|abstract|interface|import|export|library|part|if|else|for|while|do|switch|case|default|return|break|continue|new|this|super|null|true|false|try|catch|finally|throw|rethrow|async|await|yield|in|is|as|factory|get|set|late|required|dynamic)\b/g,
  cpp:      /\b(auto|class|struct|enum|template|namespace|using|if|else|return|for|while|do|switch|case|default|break|continue|new|delete|this|nullptr|true|false|try|catch|throw|const|static|virtual|override|public|private|protected|inline|explicit|friend|typedef|typename|operator)\b/g,
  c:        /\b(if|else|return|for|while|do|switch|case|default|break|continue|struct|enum|typedef|const|static|void|int|char|float|double|long|short|unsigned|signed|NULL|true|false)\b/g,
  ruby:     /\b(def|class|module|end|if|elsif|else|unless|while|until|for|in|do|begin|rescue|ensure|raise|return|yield|self|nil|true|false|and|or|not|require|include|extend|attr_reader|attr_writer|attr_accessor)\b/g,
  php:      /\b(function|class|interface|extends|implements|namespace|use|return|if|else|elseif|while|for|foreach|switch|case|default|break|continue|new|echo|print|null|true|false|try|catch|finally|throw|public|private|protected|static|abstract|final)\b/g,
  css:      /\b(important|media|keyframes|from|to|root|not|is|where|has|nth-child|hover|focus|active|first-child|last-child|before|after)\b/g,
};
var _HL_COMMENT = {
  swift:{line:['//'],block:['/*','*/']}, kotlin:{line:['//'],block:['/*','*/']},
  java:{line:['//'],block:['/*','*/']}, python:{line:['#']},
  javascript:{line:['//'],block:['/*','*/']}, typescript:{line:['//'],block:['/*','*/']},
  go:{line:['//'],block:['/*','*/']}, rust:{line:['//'],block:['/*','*/']},
  objectivec:{line:['//'],block:['/*','*/']}, dart:{line:['//'],block:['/*','*/']},
  cpp:{line:['//'],block:['/*','*/']}, c:{line:['//'],block:['/*','*/']},
  ruby:{line:['#']}, php:{line:['//','#'],block:['/*','*/']},
};
function _cfLang(fp){
  var ext=(fp||'').split('.').pop().toLowerCase();
  var m={swift:'swift',kt:'kotlin',kts:'kotlin',java:'java',py:'python',
    js:'javascript',jsx:'javascript',ts:'typescript',tsx:'typescript',
    go:'go',rs:'rust',m:'objectivec',mm:'objectivec',dart:'dart',
    cpp:'cpp',cc:'cpp',cxx:'cpp',h:'cpp',hpp:'cpp',c:'c',
    rb:'ruby',php:'php',css:'css',scss:'css',html:'html',
    sh:'bash',bash:'bash',json:'json',md:'md',xml:'xml',yml:'yaml',yaml:'yaml'};
  return m[ext]||'';
}
function _synHL(raw, lang){
  if(!lang||!raw) return '<span>'+escapeHtml(raw||'')+'</span>';
  // tokenize line by line to handle comments correctly
  var cmt=_HL_COMMENT[lang]||{line:[],block:[]};
  var lineC=cmt.line||[]; var blkO=cmt.block&&cmt.block[0]; var blkC=cmt.block&&cmt.block[1];
  var kwRe=_HL_KEYWORDS[lang];
  var strRe=/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
  var numRe=/\b(\d+\.?\d*)\b/g;
  var typeRe=/\b([A-Z][a-zA-Z0-9_]+)/g;
  var fnRe=/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g;
  var decRe=/(@[a-zA-Z_][a-zA-Z0-9_]*)/g;

  var lines=raw.split('\n');
  var inBlock=false;
  var out=lines.map(function(line){
    var esc=function(s){return escapeHtml(s);};
    if(inBlock){
      var ec=line.indexOf(blkC);
      if(ec>=0){inBlock=false;return '<span class="hl-cmt">'+esc(line.slice(0,ec+blkC.length))+'</span>'+_tokenLine(line.slice(ec+blkC.length),lang,kwRe,strRe,numRe,typeRe,fnRe,decRe);}
      return '<span class="hl-cmt">'+esc(line)+'</span>';
    }
    // check line comment
    var lci=-1;
    for(var i=0;i<lineC.length;i++){var p=line.indexOf(lineC[i]);if(p>=0&&(lci<0||p<lci))lci=p;}
    // check block comment open
    var bci=blkO?line.indexOf(blkO):-1;
    if(bci>=0&&(lci<0||bci<lci)){
      var head=line.slice(0,bci);
      var rest=line.slice(bci);
      var ec2=rest.indexOf(blkC,blkO.length);
      if(ec2>=0){return _tokenLine(head,lang,kwRe,strRe,numRe,typeRe,fnRe,decRe)+'<span class="hl-cmt">'+esc(rest.slice(0,ec2+blkC.length))+'</span>'+_tokenLine(rest.slice(ec2+blkC.length),lang,kwRe,strRe,numRe,typeRe,fnRe,decRe);}
      inBlock=true;
      return _tokenLine(head,lang,kwRe,strRe,numRe,typeRe,fnRe,decRe)+'<span class="hl-cmt">'+esc(rest)+'</span>';
    }
    if(lci>=0){return _tokenLine(line.slice(0,lci),lang,kwRe,strRe,numRe,typeRe,fnRe,decRe)+'<span class="hl-cmt">'+esc(line.slice(lci))+'</span>';}
    return _tokenLine(line,lang,kwRe,strRe,numRe,typeRe,fnRe,decRe);
  });
  return out.join('\n');
}
function _tokenLine(line,lang,kwRe,strRe,numRe,typeRe,fnRe,decRe){
  if(!line) return '';
  // chunk the line: extract strings first (they contain anything)
  var parts=[]; var last=0;
  strRe.lastIndex=0;
  var m;
  while((m=strRe.exec(line))!==null){
    if(m.index>last) parts.push({t:'code',s:line.slice(last,m.index)});
    parts.push({t:'str',s:m[0]});
    last=m.index+m[0].length;
  }
  if(last<line.length) parts.push({t:'code',s:line.slice(last)});
  return parts.map(function(p){
    if(p.t==='str') return '<span class="hl-str">'+escapeHtml(p.s)+'</span>';
    var s=escapeHtml(p.s);
    // decorators
    s=s.replace(/(@[a-zA-Z_][a-zA-Z0-9_]*)/g,'<span class="hl-dec">$1</span>');
    // keywords (must come before type/fn to avoid double-wrapping)
    if(kwRe){kwRe.lastIndex=0;s=s.replace(kwRe,'<span class="hl-kw">$1</span>');}
    // type names (CamelCase)
    s=s.replace(/\b([A-Z][a-zA-Z0-9_]+)\b/g,'<span class="hl-type">$1</span>');
    // function calls
    s=s.replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g,'<span class="hl-fn">$1</span>(');
    // numbers
    s=s.replace(/\b(\d+\.?\d*)\b/g,'<span class="hl-num">$1</span>');
    return s;
  }).join('');
}
// ─── End syntax highlighter ────────────────────────────────────────────────

function renderConflictDetail(filePath, fileIdx, data){
  var detail=document.getElementById('conflict-detail-'+fileIdx);

  // ── Binary file: no text blocks, just pick one side ──────────────────────
  if(data.is_binary){
    var ext = filePath.split('.').pop().toLowerCase();
    var icon = ['png','jpg','jpeg','gif','webp','bmp','svg','ico'].indexOf(ext)>=0 ? '🖼️' :
               ['mp4','mov','avi','mkv'].indexOf(ext)>=0 ? '🎬' :
               ['zip','tar','gz','7z'].indexOf(ext)>=0 ? '📦' : '📎';
    var already = resolvedConflicts[filePath];
    detail.innerHTML =
      '<div style="padding:20px;background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;margin:8px 0">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
          '<span style="font-size:28px">'+icon+'</span>' +
          '<div>' +
            '<div style="font-weight:700;font-size:14px;color:#92400e">Binary file — cannot show diff</div>' +
            '<div style="font-size:12px;color:#78350f;margin-top:2px">'+escapeHtml(filePath)+'</div>' +
          '</div>' +
        '</div>' +
        '<p style="font-size:13px;color:#78350f;margin-bottom:16px;line-height:1.6">' +
          'This is a binary file (image, archive, etc). Git cannot merge it automatically.<br>' +
          'Choose which version to keep:' +
        '</p>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
          '<button onclick="resolveBinary(\''+escapeAttr(filePath)+'\','+fileIdx+',\'ours\')" ' +
            'style="flex:1;min-width:160px;padding:12px 16px;border-radius:8px;border:2px solid #10b981;' +
            'background:'+(already==='ours'?'#10b981':'#f0fdf4')+';color:'+(already==='ours'?'#fff':'#065f46')+';' +
            'font-weight:700;font-size:13px;cursor:pointer;transition:all .2s">' +
            '✅ Keep Ours (HEAD)<br>' +
            '<span style="font-size:11px;font-weight:400;opacity:.8">Current branch version</span>' +
          '</button>' +
          '<button onclick="resolveBinary(\''+escapeAttr(filePath)+'\','+fileIdx+',\'theirs\')" ' +
            'style="flex:1;min-width:160px;padding:12px 16px;border-radius:8px;border:2px solid #3b82f6;' +
            'background:'+(already==='theirs'?'#3b82f6':'#eff6ff')+';color:'+(already==='theirs'?'#fff':'#1e40af')+';' +
            'font-weight:700;font-size:13px;cursor:pointer;transition:all .2s">' +
            '🔵 Use Theirs (Incoming)<br>' +
            '<span style="font-size:11px;font-weight:400;opacity:.8">Version being merged in</span>' +
          '</button>' +
        '</div>' +
        (already ? '<div style="margin-top:14px;padding:8px 12px;background:#d1fae5;border-radius:6px;font-size:12px;color:#065f46;font-weight:600">✅ Resolved — using <b>'+already+'</b></div>' : '') +
      '</div>';
    return;
  }

  // ── Text file: original block rendering ──────────────────────────────────
  var blocks = data.blocks || [];
  var lang=_cfLang(filePath);
  var conflictCount=0;
  for(var b=0;b<blocks.length;b++) if(blocks[b].type==='conflict') conflictCount++;

  var html='';
  // Structured file warning — shown at the top before any conflict blocks
  if(data.is_structured){
    html+='<div style="padding:10px 14px;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;margin-bottom:10px;font-size:12px;line-height:1.7;color:#78350f">'
      +'<b>⚠️ Structured File — "Keep Both" is disabled</b><br>'
      +'This file has a strict structured format (Xcode project, plist, or lock file). '
      +'Concatenating both sides would produce an invalid file and corrupt your Xcode project '
      +'(schemas, targets, and build settings would be lost).<br>'
      +'<b>Use ✅ Use HEAD (Ours) or 🔵 Use Theirs</b> to resolve each conflict block safely.'
      +'</div>';
  }
  // Jump bar
  if(conflictCount>0){
    html+='<div class="conflict-jump-bar">';
    html+='<span class="jump-label">⚠️ '+conflictCount+' conflict'+(conflictCount>1?'s':'')+' in this file</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="jumpToConflict(\''+escapeAttr(filePath)+'\','+fileIdx+',\'prev\')">◀ Prev</button>';
    html+='<span id="cf-nav-'+fileIdx+'" style="font-size:12px;color:#6b7280">1/'+conflictCount+'</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="jumpToConflict(\''+escapeAttr(filePath)+'\','+fileIdx+',\'next\')">Next ▶</button>';
    html+='</div>';
  }

  var CTX_LINES = 100; // lines of context to show around each conflict
  var conflictIdx=0;
  for(var b=0;b<blocks.length;b++){
    var block=blocks[b];
    if(block.type==='normal'){
      var lines=block.lines||[];
      var total=lines.length;
      // Determine which portion to show:
      // - block before a conflict: show last CTX_LINES
      // - block after a conflict: show first CTX_LINES
      // - block between two conflicts: show last CTX_LINES from tail (as tail context)
      var nextIsConflict=(b+1<blocks.length&&blocks[b+1].type==='conflict');
      var prevIsConflict=(b>0&&blocks[b-1].type==='conflict');
      var shownLines, hiddenBefore=0, hiddenAfter=0;
      if(prevIsConflict&&!nextIsConflict){
        // trailing context: show first CTX_LINES
        shownLines=lines.slice(0,CTX_LINES);
        hiddenAfter=Math.max(0,total-CTX_LINES);
      } else if(nextIsConflict&&!prevIsConflict){
        // leading context: show last CTX_LINES
        hiddenBefore=Math.max(0,total-CTX_LINES);
        shownLines=lines.slice(hiddenBefore);
      } else if(prevIsConflict&&nextIsConflict){
        // sandwiched between two conflicts: show all (it IS context)
        shownLines=lines; hiddenBefore=0; hiddenAfter=0;
      } else {
        // head or tail (no adjacent conflict): show last CTX_LINES
        hiddenBefore=Math.max(0,total-CTX_LINES);
        shownLines=lines.slice(hiddenBefore);
        hiddenAfter=0;
      }
      var autoOpen=false;
      var bodyClass='conflict-block-normal-body'+(autoOpen?' open':'');
      var arrow=autoOpen?'▼':'▶';
      var truncMsg='';
      if(hiddenBefore>0) truncMsg+='<div style="padding:3px 14px;font-size:11px;color:#9ca3af;background:#f3f4f6;border-bottom:1px solid #e5e7eb">… '+hiddenBefore+' more lines above (scroll file to see) …</div>';
      if(hiddenAfter>0) truncMsg+='<div style="padding:3px 14px;font-size:11px;color:#9ca3af;background:#f3f4f6;border-top:1px solid #e5e7eb">… '+hiddenAfter+' more lines below …</div>';
      html+='<div class="conflict-block-normal">';
      html+='<div class="conflict-block-normal-header" onclick="toggleNormalBlock(this)">'+arrow+' '+total+' lines of context</div>';
      html+='<div class="'+bodyClass+'">';
      html+=truncMsg.split('below')[0]; // top truncation notice
      html+='<pre>'+_synHL(shownLines.join('\n'),lang)+'</pre>';
      if(hiddenAfter>0) html+='<div style="padding:3px 14px;font-size:11px;color:#9ca3af;background:#f3f4f6;border-top:1px solid #e5e7eb">… '+hiddenAfter+' more lines below …</div>';
      html+='</div>';
      html+='</div>';
    } else {
      var ci=conflictIdx;
      var choice=conflictChoices[filePath]&&conflictChoices[filePath][ci];
      var resolvedCls='';
      var statusHtml='<span class="conflict-zone-status">Not resolved</span>';
      if(choice&&choice.type==='ours'){resolvedCls=' resolved-ours';statusHtml='<span class="conflict-zone-status chosen-ours">✅ Using Ours</span>';}
      else if(choice&&choice.type==='theirs'){resolvedCls=' resolved-theirs';statusHtml='<span class="conflict-zone-status chosen-theirs">🔵 Using Theirs</span>';}
      else if(choice&&choice.type==='both'){resolvedCls=' resolved-manual';statusHtml='<span class="conflict-zone-status" style="color:#0891b2;font-weight:600">🔀 Keep Both</span>';}
      else if(choice&&choice.type==='manual'){resolvedCls=' resolved-manual';statusHtml='<span class="conflict-zone-status" style="color:#7c3aed;font-weight:600">✏️ Manual edit</span>';}

      var oursHL=_synHL(block.ours||'(empty)',lang);
      var theirsHL=_synHL(block.theirs||'(empty)',lang);
      // Default manual-edit content: full raw conflict markers so user can see and edit everything
      var rawConflict='<<<<<<< HEAD\n'+(block.ours||'')+'\n=======\n'+(block.theirs||'')+'\n>>>>>>>';
      var initContent=(choice&&choice.type==='manual')?choice.content:rawConflict;

      html+='<div class="conflict-zone'+resolvedCls+'" id="cf-block-'+fileIdx+'-'+ci+'">';
      html+='<div class="conflict-zone-header">';
      html+='<span class="conflict-zone-num">CONFLICT #'+(ci+1)+'</span>';
      html+=statusHtml;
      html+='</div>';
      // Resolved banner — visible when zone has resolved-* class
      var bannerText='';
      if(choice&&choice.type==='ours') bannerText='✅  CONFLICT RESOLVED — Using HEAD (Ours)';
      else if(choice&&choice.type==='theirs') bannerText='✅  CONFLICT RESOLVED — Using Theirs (Incoming)';
      else if(choice&&choice.type==='both') bannerText='✅  CONFLICT RESOLVED — Keeping Both (Ours + Theirs)';
      else if(choice&&choice.type==='manual') bannerText='✅  CONFLICT RESOLVED — Custom Manual Edit';
      html+='<div class="cf-resolved-banner">'+escapeHtml(bannerText)+'</div>';
      html+='<div class="conflict-sides">';
      html+='<div class="conflict-side conflict-side-ours"><h4>⬅ HEAD &nbsp;<span style="font-weight:400;font-size:10px;opacity:.8">(your current branch)</span></h4><pre>'+oursHL+'</pre></div>';
      html+='<div class="conflict-side conflict-side-theirs"><h4>Incoming ➡ &nbsp;<span style="font-weight:400;font-size:10px;opacity:.8">(theirs / merging)</span></h4><pre>'+theirsHL+'</pre></div>';
      html+='</div>';
      html+='<div class="conflict-zone-actions">';
      html+='<button class="btn btn-sm btn-success" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'ours\')">✅ Use HEAD (Ours)</button>';
      html+='<button class="btn btn-sm btn-primary" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'theirs\')">🔵 Use Theirs</button>';
      if(data.is_structured){
        html+='<button class="btn btn-sm" disabled title="Not available for Xcode/plist/lock files — would corrupt the file" style="background:#e5e7eb;color:#9ca3af;border:none;border-radius:6px;cursor:not-allowed;opacity:.7">🚫 Keep Both N/A</button>';
      } else {
        html+='<button class="btn btn-sm" style="background:#0891b2;color:#fff;border:none;border-radius:6px;cursor:pointer" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'both\')">🔀 Keep Both</button>';
      }
      html+='<button class="btn btn-sm btn-secondary" onclick="openManualEdit(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+')">✏️ Edit manually</button>';
      html+='<button class="ai-conflict-btn" onclick="aiAnalyzeConflictBlock(\''+escapeAttr(filePath)+'\','+ci+')">🤖 Ask AI</button>';
      html+='</div>';
      // Manual edit panel — side-by-side reference + live syntax-highlighted editor
      var wrapId='cf-wrap-'+fileIdx+'-'+ci;
      html+='<div id="cf-manual-'+fileIdx+'-'+ci+'" style="display:none;padding:10px 14px;background:#faf5ff;border-top:2px solid #8b5cf6;">';
      html+='<div style="font-size:11px;color:#6b7280;margin-bottom:6px;font-weight:600">📖 Reference (read-only):</div>';
      html+='<div class="cf-manual-ref">';
      html+='<div class="cf-manual-ref-side cf-manual-ref-ours"><h5>⬅ HEAD (yours)</h5><pre>'+oursHL+'</pre></div>';
      html+='<div class="cf-manual-ref-side cf-manual-ref-theirs"><h5>Incoming (theirs) ➡</h5><pre>'+theirsHL+'</pre></div>';
      html+='</div>';
      html+='<div style="display:flex;align-items:center;gap:6px;margin-top:10px;margin-bottom:5px;">';
      html+='<span style="font-size:11px;color:#a78bfa;font-weight:600">✏️ Edit your resolution:</span>';
      html+='<div style="margin-left:auto;display:flex;gap:4px;align-items:center;">';
      html+='<span style="font-size:10px;color:#9ca3af">Theme:</span>';
      html+='<button onclick="_cfSwitchTheme(\'dark\')" title="Catppuccin Dark" style="padding:2px 8px;font-size:10px;border-radius:4px;border:1px solid #5a3d8f;background:#1e1e2e;color:#cba6f7;cursor:pointer;line-height:1.5">🌙 Dark</button>';
      html+='<button onclick="_cfSwitchTheme(\'light\')" title="GitHub Light" style="padding:2px 8px;font-size:10px;border-radius:4px;border:1px solid #d0d7de;background:#f6f8fa;color:#24292f;cursor:pointer;line-height:1.5">☀️ Light</button>';
      html+='</div></div>';
      html+='<div class="cf-editor-wrap" id="'+wrapId+'">';
      html+='<pre class="cf-editor-hl"></pre>';
      html+='<textarea class="cf-editor-ta" id="cf-editor-'+fileIdx+'-'+ci+'" spellcheck="false">'+escapeHtml(initContent)+'</textarea>';
      html+='</div>';
      html+='<button class="btn btn-sm btn-warning" style="margin-top:6px" onclick="saveManualBlock(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+')">💾 Save this block</button>';
      html+='</div>';
      html+='</div>';
      conflictIdx++;
    }
  }

  // Bottom resolve bar
  html+='<div class="conflict-resolve-all">';
  html+='<button class="btn btn-success" onclick="resolveAllBlocks(\''+escapeAttr(filePath)+'\','+fileIdx+')">💾 Save &amp; Resolve File</button>';
  html+='<button class="btn btn-sm btn-secondary" onclick="showRawEdit(\''+escapeAttr(filePath)+'\','+fileIdx+')">📝 Edit raw file</button>';
  html+='<div id="cf-raw-'+fileIdx+'" style="display:none;width:100%;margin-top:10px">';
  html+='<div class="cf-editor-wrap" id="cf-raw-wrap-'+fileIdx+'" style="min-height:240px">';
  html+='<pre class="cf-editor-hl"></pre>';
  html+='<textarea class="cf-editor-ta" id="cf-raw-editor-'+fileIdx+'" spellcheck="false">'+escapeHtml(data.raw||'')+'</textarea>';
  html+='</div>';
  html+='<button class="btn btn-success btn-sm" style="margin-top:6px" onclick="resolveConflictCustom(\''+escapeAttr(filePath)+'\','+fileIdx+')">Save raw &amp; Resolve</button>';
  html+='</div></div>';

  detail.innerHTML=html;
  window._cfCurrentConflict=window._cfCurrentConflict||{};
  window._cfCurrentConflict[fileIdx]=0;
}

function toggleNormalBlock(header){
  var body=header.nextElementSibling;
  if(body.classList.contains('open')){body.classList.remove('open');header.innerHTML=header.innerHTML.replace('▼','▶');}
  else{body.classList.add('open');header.innerHTML=header.innerHTML.replace('▶','▼');}
}

function chooseConflict(filePath, fileIdx, ci, side){
  if(!conflictChoices[filePath]) return;
  var block=_conflictData[filePath].blocks.filter(function(b){return b.type==='conflict'})[ci];
  var content;
  if(side==='ours') content=block.ours||'';
  else if(side==='theirs') content=block.theirs||'';
  else if(side==='both') content=(block.ours||'')+(block.ours&&block.theirs?'\n':'')+(block.theirs||'');
  else content=block.theirs||'';
  conflictChoices[filePath][ci]={type:side,content:content};
  renderConflictDetail(filePath, fileIdx, _conflictData[filePath]);
  var el=document.getElementById('cf-block-'+fileIdx+'-'+ci);
  if(el) el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function openManualEdit(filePath, fileIdx, ci){
  var box=document.getElementById('cf-manual-'+fileIdx+'-'+ci);
  if(!box)return;
  var opening=box.style.display==='none';
  box.style.display=opening?'block':'none';
  if(opening){
    setTimeout(function(){_cfEditorInit('cf-wrap-'+fileIdx+'-'+ci,_cfLang(filePath));},0);
  }
}

function saveManualBlock(filePath, fileIdx, ci){
  var ta=document.getElementById('cf-editor-'+fileIdx+'-'+ci);
  if(!ta) return;
  if(!conflictChoices[filePath]) return;
  conflictChoices[filePath][ci]={type:'manual',content:ta.value};
  renderConflictDetail(filePath, fileIdx, _conflictData[filePath]);
  var el=document.getElementById('cf-block-'+fileIdx+'-'+ci);
  if(el) el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function resolveAllBlocks(filePath, fileIdx){
  // Guard: binary files must use resolveBinary() — this path doesn't apply
  if((_conflictData[filePath]||{}).is_binary){
    showModal('⚠️ Binary File',
      '<p style="margin:0;font-size:14px">This is a binary file. Please use the <b>✅ Keep Ours</b> or <b>🔵 Use Theirs</b> buttons above to resolve it.</p>',
      'OK');
    return;
  }
  var choices=conflictChoices[filePath]||[];
  var blocks=(_conflictData[filePath]||{}).blocks||[];
  var ci=0; var out=[];
  var allResolved=true;
  for(var b=0;b<blocks.length;b++){
    var block=blocks[b];
    if(block.type==='normal'){
      out.push((block.lines||[]).join('\n'));
    } else {
      var choice=choices[ci];
      if(!choice||!choice.type){allResolved=false;break;}
      out.push(choice.content);
      ci++;
    }
  }
  if(!allResolved){
    var unresolved=0;
    for(var i=0;i<choices.length;i++) if(!choices[i]||!choices[i].type) unresolved++;
    var warningBody=
      '<div style="text-align:center;margin-bottom:12px;font-size:36px">⚠️</div>'
      +'<p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#dc2626">'+unresolved+' conflict'+(unresolved===1?'':'s')+' not yet resolved</p>'
      +'<p style="margin:0 0 10px;font-size:13px;color:#374151">Please resolve all conflicts before saving. Unresolved blocks will remain with raw conflict markers (<code style="font-size:11px">&lt;&lt;&lt;&lt;&lt;&lt;&lt; / =======</code>).</p>'
      +'<p style="margin:0;font-size:12px;color:#6b7280">Scroll up to find and resolve the remaining conflicts.</p>';
    showModal('⚠️ Unresolved Conflicts', warningBody, "OK, I'll fix them", function(){
      for(var i=0;i<choices.length;i++){
        if(!choices[i]||!choices[i].type){
          var el=document.getElementById('cf-block-'+fileIdx+'-'+i);
          if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
          break;
        }
      }
    });
    return;
  }
  var content=out.join('\n');
  apiPost('/api/resolve-conflict',{path:filePath,content:content},function(data){
    if(data.ok){
      resolvedConflicts[filePath]=true;
      addMsg(t('conflict_resolved_ok'),'success');
      loadConflicts();checkConflicts();loadFiles();
      if(data.all_resolved){
        setTimeout(function(){showMergeCommitDialog(data.default_msg||'');},500);
      } else {
        _showRemainingConflictGuidance(data,filePath);
      }
    }
    else addMsg(t('op_failed_err')+(data.error||''),'error');
  });
}

function showRawEdit(filePath, fileIdx){
  var box=document.getElementById('cf-raw-'+fileIdx);
  if(!box)return;
  var opening=box.style.display==='none';
  box.style.display=opening?'block':'none';
  if(opening){
    setTimeout(function(){_cfEditorInit('cf-raw-wrap-'+fileIdx,_cfLang(filePath));},0);
  }
}

// ═══════════ Post-resolve commit & push dialog ═══════════
function showMergeCommitDialog(defaultMsg){
  var branchName=(document.getElementById('branch-name')||{textContent:''}).textContent||'';
  var isMergeState=defaultMsg && (defaultMsg.indexOf('Merge')===0 || defaultMsg.indexOf('merge')!==-1 || defaultMsg.indexOf('cherry-pick')!==-1);
  var titleIcon=isMergeState?'🔀':'✅';
  var titleText=isMergeState?t('merge_all_resolved_title'):'All Conflicts Resolved!';
  var descText='All conflict files have been resolved and staged.<br>'
    +'<strong>Commit &amp; Push</strong> to commit and push immediately, or <strong>Commit Only</strong> to commit locally and push manually later.';
  var bodyHtml=
    '<p style="margin:0 0 12px;color:#374151;font-size:13px;line-height:1.5">'+descText+'</p>'
    +'<label style="font-size:12px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px">'+t('commit_msg_label')+'</label>'
    +'<textarea id="merge-complete-msg" rows="4" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box">'+escapeHtml(defaultMsg)+'</textarea>';

  function _doCommit(thenPush){
    var msg=(document.getElementById('merge-complete-msg')||{value:''}).value.trim();
    if(!msg){addMsg('⚠️ '+t('enter_commit_msg_err'),'error');return;}
    apiPost('/api/complete-merge',{message:msg},function(data){
      if(data.ok){
        addMsg('✅ '+t('merge_commit_ok'),'success');
        checkConflicts();   // clear the conflict tab badge
        _reloadLog(1);         // navigate to log tab and show the new commit
        loadFiles();loadCurrentBranch();
        if(thenPush) setTimeout(function(){ doPush(); },400);
      }else{
        addMsg('❌ '+t('merge_commit_fail')+(data.error||''),'error');
      }
    });
  }

  showModalDouble(
    titleIcon+' '+titleText,
    bodyHtml,
    '🚀 Commit & Push',
    function(){ _doCommit(true); },
    '💾 Commit Only',
    function(){ _doCommit(false); },
    'btn-success',
    'btn-secondary'
  );
}

function jumpToConflict(filePath, fileIdx, dir){
  var choices=conflictChoices[filePath]||[];
  var total=choices.length;
  if(total===0) return;
  if(!window._cfCurrentConflict) window._cfCurrentConflict={};
  var cur=window._cfCurrentConflict[fileIdx]||0;
  if(dir==='next') cur=(cur+1)%total;
  else cur=(cur-1+total)%total;
  window._cfCurrentConflict[fileIdx]=cur;
  var nav=document.getElementById('cf-nav-'+fileIdx);
  if(nav) nav.textContent=(cur+1)+'/'+total;
  var el=document.getElementById('cf-block-'+fileIdx+'-'+cur);
  if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
}

function showEditConflict(idx){document.getElementById('conflict-edit-'+idx) && (document.getElementById('conflict-edit-'+idx).style.display='block')}
function _showRemainingConflictGuidance(data, filePath){
  var files=(data.remaining_files||[]).slice(0,3).map(escapeHtml);
  var more=(data.remaining_count||0)-files.length;
  var mergeType=(data.merge_type||'merge').replace('-', ' ');
  var extra=files.length?('<br>Remaining: <b>'+files.join('</b>, <b>')+'</b>'+(more>0?' and '+more+' more':'')+'.'):'';
  addMsg('✅ Resolved '+filePath+'. '+(data.remaining_count||0)+' conflict file'+((data.remaining_count||0)===1?'':'s')+' still remain in '+(data.branch||'this branch')+'.','success');
  showModal(
    '⚠️ '+(data.remaining_count||0)+' conflict file'+((data.remaining_count||0)===1?'':'s')+' remaining',
    'The current <b>'+escapeHtml(mergeType)+'</b> is still paused on <b>'+escapeHtml(data.branch||'?')+'</b>.'+extra
      +'<br><br><b>Next step</b>: resolve the remaining file(s) in the Conflicts tab below. '
      +'When the last one is resolved, the tool will offer the continue/commit action automatically.',
    'Got it'
  );
}
function resolveConflict(filePath,resolution,idx){apiPost('/api/resolve-conflict',{path:filePath,resolution:resolution},function(data){if(data.ok){resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved')+resolution,'success');loadConflicts();checkConflicts();loadFiles();if(data.all_resolved){setTimeout(function(){showMergeCommitDialog(data.default_msg||'');},500);}else{_showRemainingConflictGuidance(data,filePath);}}else addMsg(t('op_failed_err')+(data.error||''),'error')})}

/**
 * Resolve a binary file conflict by choosing ours or theirs.
 * Runs git checkout --ours/--theirs then git add, same as text resolution.
 */
function resolveBinary(filePath, fileIdx, side){
  apiPost('/api/resolve-conflict',{path:filePath,resolution:side},function(data){
    if(data.ok){
      resolvedConflicts[filePath] = side; // store which side was chosen
      addMsg((side==='ours'?'✅ Kept our version of ':'🔵 Using their version of ')+filePath,'success');
      showToast((side==='ours'?'✅ Kept ours':'🔵 Using theirs')+': '+filePath,'ok',2500);
      // Re-render the binary card to show resolved state
      if(_conflictData[filePath]) _conflictData[filePath].is_binary=true;
      var det=document.getElementById('conflict-detail-'+fileIdx);
      if(det) renderConflictDetail(filePath, fileIdx, _conflictData[filePath]||{is_binary:true});
      checkConflicts(); loadFiles();
      loadConflicts();
      if(data.all_resolved){ setTimeout(function(){ showMergeCommitDialog(data.default_msg||''); },500); }
      else{ _showRemainingConflictGuidance(data,filePath); }
    } else {
      addMsg('❌ Failed to resolve binary conflict: '+(data.error||''),'error');
    }
  });
}

function resolveConflictCustom(filePath,fileIdx){
  var ta=document.getElementById('cf-raw-editor-'+fileIdx);
  if(!ta) return;
  apiPost('/api/resolve-conflict',{path:filePath,content:ta.value},function(data){
    if(data.ok){
      resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved_ok'),'success');loadConflicts();checkConflicts();loadFiles();
      if(data.all_resolved){setTimeout(function(){showMergeCommitDialog(data.default_msg||'');},500);}
      else _showRemainingConflictGuidance(data,filePath);
    }
    else addMsg(t('op_failed_err')+(data.error||''),'error');
  });
}

// ═══════════ Click delegate ═══════════
document.addEventListener('click',function(e){
  // Restore file button (delegated)
  var restoreBtn = e.target.closest && e.target.closest('.restore-file-btn');
  if (restoreBtn) {
    e.stopPropagation();
    var file = restoreBtn.getAttribute('data-file');
    openRestorePage(file);
    return;
  }
  
  var cb=e.target.closest&&e.target.closest('.file-cb');
  if(cb){
    e.stopPropagation();
    var path=cb.dataset.path,checked=cb.checked;
    var action=checked?'add':'reset';
    apiPost('/api/toggle',{path:path,action:action},function(data){
      if(data.ok){checkedPaths[path]=checked;addMsg(checked?t('git_added'):t('git_reset'),'success')}
      else{cb.checked=!checked;addMsg(t('op_failed')+': '+(data.error||''),'error')}
    });
    return;
  }
  var header=e.target.closest&&e.target.closest('.file-header');
  if(header){
    var card=header.closest('.file-card');
    if(!card)return;
    var body=card.querySelector('.file-body'),toggle=header.querySelector('.file-toggle');
    if(!body||!toggle)return;
    var path=body.dataset?body.dataset.path:'';
    var isExpanded=body.classList.contains('expanded');
    if(isExpanded){body.classList.remove('expanded');toggle.classList.remove('open');if(path)delete expandedPaths[path]}
    else{body.classList.add('expanded');toggle.classList.add('open');if(path)expandedPaths[path]=true}
    return;
  }
});

// ═══════════ Select All ═══════════
document.getElementById('select-all-cb').addEventListener('change',function(){
  var selectAll=this.checked;
  var allCbs=document.querySelectorAll('.file-cb');
  var done=0,total=allCbs.length,failed=false;
  if(!total)return;
  function finalize(){
    if(!failed)addMsg(selectAll?t('all_selected'):t('all_deselected'),'success');
    else addMsg(t('partial_fail'),'error');
    _filesLastJson=''; // force re-render so individual checkboxes reflect new state
    loadFiles();
  }
  for(var i=0;i<allCbs.length;i++){
    (function(cb,path){
      var action=selectAll?'add':'reset';
      if(selectAll)checkedPaths[path]=true;else delete checkedPaths[path];
      apiPost('/api/toggle',{path:path,action:action},function(data){if(!data.ok)failed=true;done++;if(done===total)finalize()});
    })(allCbs[i],allCbs[i].dataset.path);
  }
});

// ═══════════ Commit page stash button ═══════════
document.getElementById('commit-stash-btn').addEventListener('click', function() {
  var cbs = document.querySelectorAll('.file-cb:checked'), paths = [];
  for (var i = 0; i < cbs.length; i++) paths.push(cbs[i].dataset.path);
  if (!paths.length) {
    addMsg('⚠️ ' + t('stash_select_files'), 'error');
    return;
  }
  showStashDialog(paths);
});

// ═══════════ Commit ═══════════
document.getElementById('commit-btn').addEventListener('click',function(){
  var msg=document.getElementById('msg-input').value.trim();
  if(!msg){addMsg(t('commit_msg_empty'),'error');return}
  var cbs=document.querySelectorAll('.file-cb:checked'),paths=[];
  for(var i=0;i<cbs.length;i++)paths.push(cbs[i].dataset.path);
  if(!paths.length){addMsg(t('select_at_least_one'),'error');return}
  _warnProtectedThenDo('protected_branch_commit', function(){
    _rememberGitOp('commit', function(){ document.getElementById('commit-btn').click(); });
    showModal(t('confirm_commit_title'),
      'Commit message: <b>'+escapeHtml(msg)+'</b><br><br>Files:<br>'+paths.map(escapeHtml).join('<br>'),
      'Confirm Commit',
      function(){
      apiPost('/api/commit',{message:msg,paths:paths},function(data){
        if(data.ok){
          addMsg(t('commit_ok')+': '+(data.stdout||''),'success');
          document.getElementById('msg-input').value='';checkedPaths={};expandedPaths={};loadFiles();
          var branchName=document.getElementById('branch-name').textContent||'';
          setTimeout(function(){
            showModalDouble(
              '🚀 Push to remote?',
              'Commit successful!<br><br>Do you want to push to <b>origin/'+escapeHtml(branchName)+'</b> now?',
              'Push Now',
              function(){ doPush(); },
              'Skip (Local Only)',
              null,
              'btn-success',
              'btn-secondary'
            );
          }, 300);
        }else addMsg(t('commit_fail')+': '+(data.error||''),'error');
      });
        });
    }); // close _warnProtectedThenDo
}); // close addEventListener

// ═══════════ Reset all ═══════════
document.getElementById('reset-btn').addEventListener('click',function(){
  var allCbs=document.querySelectorAll('.file-cb'),failed=false,done=0;
  for(var i=0;i<allCbs.length;i++){
    apiPost('/api/toggle',{path:allCbs[i].dataset.path,action:'reset'},function(data){if(!data.ok)failed=true;done++;if(done===allCbs.length){checkedPaths={};if(!failed){addMsg(t('all_deselected'),'success');loadFiles()}else addMsg(t('partial_fail'),'error')}});
  }
});

// ═══════════ GPG Sign Toggle ═══════════
function toggleGpgSign(enabled) {
  apiPost('/api/gpg-sign', {gpg_sign: enabled}, function(d) {
    if (d.ok) {
      addMsg(enabled ? '🔏 GPG signing enabled' : '🔓 GPG signing disabled', 'success');
    } else {
      addMsg('❌ Failed to toggle GPG sign: ' + (d.error || ''), 'error');
      document.getElementById('gpg-sign-toggle').checked = !enabled;
    }
  });
}
function loadGpgSign() {
  apiGet('/api/gpg-sign', function(d) {
    document.getElementById('gpg-sign-toggle').checked = !!d.gpg_sign;
  });
}

// ═══════════ Init ═══════════
loadCurrentBranch();
loadProjectName();
loadWorktreeLabel();
loadGpgSign();
// Restore last active tab
(function(){
  var saved=null;
  try{saved=localStorage.getItem('git_tool_active_tab');}catch(e){}
  var safeTabs={main:1,branches:1,log:1,prs:1,stash:1,conflicts:1};
  if(saved&&safeTabs[saved]){
    switchPage(saved);
    if(saved==='branches')loadBranches(1);
    else if(saved==='log')loadLog(1);
    else if(saved==='prs')loadPullRequests(1);
    else if(saved==='stash')loadStash();
    else if(saved==='conflicts'){loadFiles();checkConflicts();}
    else{loadFiles();checkConflicts();}
    // Start poller if restoring to commit tab
    if(!saved || saved==='main') _startFilesPoller();
  }else{
    loadFiles();
    checkConflicts();
    _startFilesPoller();
  }
})();

// Position tooltips using fixed coords to avoid overflow clipping
document.querySelectorAll('.git-action-btn').forEach(function(btn){
  var tip=btn.querySelector('.git-action-desc');
  if(!tip)return;
  btn.addEventListener('mouseenter',function(){
    var r=btn.getBoundingClientRect();
    tip.style.left=(r.left+r.width/2)+'px';
    tip.style.top=(r.bottom+6)+'px';
    tip.style.transform='translateX(-50%)';
  });
});

// ═══════════ Git Settings Modal ═══════════
function openGitSettingsModal() {
  var modal = document.getElementById('git-settings-modal');
  var status = document.getElementById('git-settings-status');
  status.textContent = '';
  modal.style.display = 'flex';
  apiGet('/api/network-timeout', function(d) {
    document.getElementById('git-timeout-input').value = d.network_timeout || 120;
  });
  // Populate poll interval (convert ms → seconds for display)
  document.getElementById('git-poll-input').value = _filesPollInterval > 0 ? (_filesPollInterval / 1000) : 0;
}

function closeGitSettingsModal() {
  document.getElementById('git-settings-modal').style.display = 'none';
}

function saveGitSettings() {
  var val = parseInt(document.getElementById('git-timeout-input').value, 10);
  var pollSec = parseFloat(document.getElementById('git-poll-input').value);
  var status = document.getElementById('git-settings-status');
  if (!val || val < 10) {
    status.style.color = '#dc2626';
    status.textContent = t('git_timeout_save_fail') + 'Minimum 10 seconds';
    return;
  }
  if (isNaN(pollSec) || pollSec < 0) {
    status.style.color = '#dc2626';
    status.textContent = 'Auto-refresh interval must be ≥ 0 (0 = disabled)';
    return;
  }
  // Save poll interval to localStorage and apply immediately
  try { localStorage.setItem('git_poll_interval', String(pollSec)); } catch(e) {}
  _filesPollInterval = pollSec * 1000;
  // Restart poller with new interval if on commit tab
  var page = document.getElementById('page-main');
  if (page && page.classList.contains('active')) { _stopFilesPoller(); _startFilesPoller(); }

  apiPost('/api/network-timeout', {network_timeout: val}, function(d) {
    if (d.ok) {
      status.style.color = '#16a34a';
      var pollMsg = pollSec > 0 ? (' · Auto-refresh: ' + pollSec + 's') : ' · Auto-refresh: off';
      status.textContent = tf('git_timeout_saved', L, {n: d.network_timeout}) + pollMsg;
      setTimeout(closeGitSettingsModal, 1400);
    } else {
      status.style.color = '#dc2626';
      status.textContent = t('git_timeout_save_fail') + (d.error || '');
    }
  });
}

var _gitSettingsModal=document.getElementById('git-settings-modal');
if(_gitSettingsModal) _gitSettingsModal.addEventListener('click', function(e) {
  if (e.target === this) closeGitSettingsModal();
});

// ═══════════════════════════════════════════════════════════════
// Git Branch Graph Panel
// ═══════════════════════════════════════════════════════════════
var _graphData = null;
var _graphHighlightLane = null;

function highlightGraphLane(lane, fromLegend) {
  if (fromLegend && _graphHighlightLane === lane) lane = null; // toggle off
  _graphHighlightLane = lane;

  // Collect branch-from parent commit indices for the selected lane
  var bfParentIdxs = new Set();
  if (lane !== null && _graphData) {
    (_graphData.commits || []).forEach(function(c) {
      if (c.lane === lane && c.branch_from != null) {
        bfParentIdxs.add(c.branch_from.idx);
      }
    });
  }

  var wrap = document.getElementById('graph-svg-wrap');
  if (wrap) {
    wrap.querySelectorAll('path[data-lane]').forEach(function(p) {
      if (lane === null) {
        p.style.opacity = '';
        p.style.strokeWidth = '';
      } else {
        var l = parseInt(p.getAttribute('data-lane'));
        var on = (l === lane);
        p.style.opacity = on ? '0.9' : '0.08';
        p.style.strokeWidth = on ? '2.5' : '1.5';
      }
    });
    wrap.querySelectorAll('g[data-idx]').forEach(function(g) {
      var l = parseInt(g.getAttribute('data-lane'));
      var idx = parseInt(g.getAttribute('data-idx'));
      if (lane === null) {
        g.style.opacity = '';
      } else if (l === lane) {
        g.style.opacity = '1';
      } else if (bfParentIdxs.has(idx)) {
        g.style.opacity = '0.85'; // Branch-origin parent: visible, not dimmed
      } else {
        g.style.opacity = '0.18';
      }
    });
    // Show/hide the branch-origin parent rings
    wrap.querySelectorAll('circle.bop-ring').forEach(function(ring) {
      var srcLane = parseInt(ring.getAttribute('data-src-lane'));
      ring.setAttribute('opacity', (lane !== null && srcLane === lane) ? '0.9' : '0');
    });
  }

  document.querySelectorAll('#graph-legend .graph-legend-item').forEach(function(item) {
    var l = parseInt(item.getAttribute('data-lane'));
    item.classList.toggle('graph-legend-active', lane !== null && l === lane);
  });
}


function toggleGraphPanel() {
  var panel = document.getElementById('graph-panel');
  var handle = document.getElementById('graph-resize-handle');
  var isOpen = panel.classList.contains('open');
  if (!isOpen) {
    panel.classList.add('open');
    var btn = document.getElementById('btn-graph-toggle');
    if (btn) btn.classList.add('active');
    if (handle) {
      if (window._graphResizePlaceHandle) window._graphResizePlaceHandle();
      handle.style.display = 'block';
    }
    if (!_graphData) loadGitGraph();
  } else {
    panel.classList.remove('open');
    var btn = document.getElementById('btn-graph-toggle');
    if (btn) btn.classList.remove('active');
    if (handle) handle.style.display = 'none';
  }
  try { localStorage.setItem('graphPanelOpen', String(!isOpen)); } catch(e) {}
}

function _initGraphPanel() {
  // Restore saved width
  try {
    var savedW = parseInt(localStorage.getItem('graphPanelWidth') || '0');
    if (savedW >= 280 && savedW <= 860) {
      document.getElementById('graph-panel').style.width = savedW + 'px';
    }
  } catch(e) {}

  // Init drag-to-resize (must run before open restore so _placeHandle exists)
  _initGraphResize();

  // Restore open state
  try {
    if (localStorage.getItem('graphPanelOpen') === 'true') {
      var panel = document.getElementById('graph-panel');
      panel.classList.add('open');
      var btn = document.getElementById('btn-graph-toggle');
      if (btn) btn.classList.add('active');
      var handle = document.getElementById('graph-resize-handle');
      if (handle) {
        if (window._graphResizePlaceHandle) window._graphResizePlaceHandle();
        handle.style.display = 'block';
      }
      loadGitGraph();
    }
  } catch(e) {}
}

function _initGraphResize() {
  var handle = document.getElementById('graph-resize-handle');
  var panel = document.getElementById('graph-panel');
  if (!handle || !panel) return;

  function _placeHandle() {
    // Position handle flush against the panel's right edge
    handle.style.left = (panel.offsetWidth - 4) + 'px';
  }

  var dragging = false, startX = 0, startW = 0;

  handle.addEventListener('mousedown', function(e) {
    dragging = true;
    startX = e.clientX;
    startW = panel.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var newW = Math.max(280, Math.min(860, startW + (e.clientX - startX)));
    panel.style.width = newW + 'px';
    handle.style.left = (newW - 4) + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    try { localStorage.setItem('graphPanelWidth', String(panel.offsetWidth)); } catch(e) {}
  });

  // Keep handle visible/hidden with panel; reposition on toggle
  window._graphResizePlaceHandle = _placeHandle;
}

function _isStashLabel(s) {
  return s === 'refs/stash' || s.startsWith('refs/stash@') || s === 'stash' || s.startsWith('stash@');
}

function _isNoiseLabel(s) {
  // Filter stash refs and symbolic HEAD pointers (origin/HEAD, upstream/HEAD, etc.)
  return _isStashLabel(s) || s === 'HEAD' || s.endsWith('/HEAD');
}

function loadGitGraph() {
  _graphHighlightLane = null;
  var wrap = document.getElementById('graph-svg-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="loading-bar"><span class="spinner"></span>Loading graph…</div>';
  var legend = document.getElementById('graph-legend');
  if (legend) { legend.style.display = 'none'; legend.innerHTML = ''; }

  _showSpinner();
  fetch(API_BASE + '/api/git-graph')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      _hideSpinner();
      if (!data || !Array.isArray(data.commits)) {
        wrap.innerHTML = '<div style="padding:16px;font-size:12px;color:#dc2626">Graph unavailable</div>';
        return;
      }
      // Client-side noise filtering (stash + origin/HEAD symbolic pointers)
      data.commits.forEach(function(c) {
        c.labels = (c.labels || []).filter(function(l) { return !_isNoiseLabel(l); });
      });
      _graphData = data;
      try { _renderGraphLegend(data); } catch(e) { console.error('legend err', e); }
      try { renderGitGraph(data); } catch(e) {
        console.error('graph render err', e);
        wrap.innerHTML = '<div style="padding:16px;font-size:12px;color:#dc2626">Render error: ' + escapeHtml(e.message) + '</div>';
      }
    })
    .catch(function(e) {
      _hideSpinner();
      wrap.innerHTML = '<div style="padding:16px;font-size:12px;color:#dc2626">Failed: ' + escapeHtml(e.message) + '</div>';
    });
}

function _renderGraphLegend(data) {
  var _C = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#a855f7','#14b8a6','#e11d48'];
  var legend = document.getElementById('graph-legend');
  if (!legend) return;
  // Collect ALL unique branch labels (one entry per label, not one per lane).
  // This ensures branches sharing a lane (e.g. master merged into develop) still appear.
  var seenLabels = new Set();
  var entries = []; // [{lane, label}]
  (data.commits || []).forEach(function(c) {
    var lbs = (c.labels || []).filter(function(l) { return !_isNoiseLabel(l); });
    lbs.forEach(function(lb) {
      if (!seenLabels.has(lb)) {
        seenLabels.add(lb);
        entries.push({lane: c.lane, label: lb});
      }
    });
  });
  if (!entries.length) return;
  legend.style.display = 'flex';
  legend.innerHTML = entries.slice(0, 18).map(function(e) {
    var fullName = e.label;
    var isTrunc = fullName.length > 22;
    var display = isTrunc ? fullName.slice(0, 20) + '…' : fullName;
    return '<div class="graph-legend-item" data-lane="' + e.lane + '" data-fullname="' + escapeHtml(fullName) + '" onclick="highlightGraphLane(' + e.lane + ', true)" title="' + escapeHtml(fullName) + '">'
      + '<span class="graph-legend-dot" style="background:' + _C[e.lane % _C.length] + '"></span>'
      + '<span class="graph-legend-name">' + escapeHtml(display) + '</span>'
      + (isTrunc ? '<span class="gnp-trigger" onclick="event.stopPropagation();showGraphNamePopover(event,\'' + escapeHtml(fullName).replace(/'/g,'\\\'') + '\')" title="Show full name">…</span>' : '')
      + '</div>';
  }).join('');
}

function showGraphNamePopover(event, fullName) {
  var pop = document.getElementById('graph-name-popover');
  var nameEl = document.getElementById('gnp-name');
  if (!pop || !nameEl) return;
  // Toggle off if already showing the same entry
  if (pop.style.display !== 'none' && pop._fullName === fullName) {
    pop.style.display = 'none';
    return;
  }
  nameEl.textContent = fullName;
  pop._fullName = fullName;
  // Position near anchor — show first to measure size
  pop.style.display = 'flex';
  var rect = event.target.getBoundingClientRect();
  var popW = pop.offsetWidth || 240;
  var popH = pop.offsetHeight || 48;
  var left = Math.min(rect.right + 6, window.innerWidth - popW - 8);
  var top = rect.top - 4;
  if (top + popH > window.innerHeight - 8) top = rect.bottom - popH;
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
}

function graphNameCopy() {
  var pop = document.getElementById('graph-name-popover');
  if (!pop || !pop._fullName) return;
  try {
    navigator.clipboard.writeText(pop._fullName).then(function() {
      var btn = pop.querySelector('.gnp-copy');
      if (btn) { btn.textContent = '✓ Copied'; setTimeout(function(){ btn.textContent = '⎘ Copy'; }, 1200); }
    });
  } catch(e) {}
}

// Close popover on any outside click (trigger uses stopPropagation so no double-fire)
document.addEventListener('click', function(e) {
  var pop = document.getElementById('graph-name-popover');
  if (pop && pop.style.display !== 'none' && !pop.contains(e.target)) {
    pop.style.display = 'none';
  }
});

function renderGitGraph(data) {
  var _C = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#a855f7','#14b8a6','#e11d48'];
  var wrap = document.getElementById('graph-svg-wrap');
  if (!wrap) return;
  var commits = (data && data.commits) || [], edges = (data && data.edges) || [];
  if (!commits.length) {
    wrap.innerHTML = '<div style="padding:20px;font-size:12px;color:#9ca3af">No commits found</div>';
    return;
  }

  var ROW_H = 24, LANE_W = 14, PAD_L = 10, PAD_T = 14, DOT_R = 4.5;
  var maxLane = (data && data.max_lane) || 0;
  var svgW = PAD_L * 2 + (maxLane + 1) * LANE_W;
  var svgH = PAD_T * 2 + commits.length * ROW_H;

  function cx(l) { return PAD_L + (l || 0) * LANE_W; }
  function cy(r) { return PAD_T + r * ROW_H; }
  function col(l) { return _C[(l || 0) % _C.length]; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  var parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="'+svgW+'" height="'+svgH+'" style="display:block">'];
  // Transparent background to catch clicks (clears highlight)
  parts.push('<rect width="'+svgW+'" height="'+svgH+'" fill="transparent" onclick="highlightGraphLane(null,false)" style="cursor:default"/>');

  // Draw edges first (rendered behind nodes)
  edges.forEach(function(e) {
    var fr=e[0],fl=e[1],tr=e[2],tl=e[3];
    var x1=cx(fl),y1=cy(fr),x2=cx(tl),y2=cy(tr),stroke=col(fl);
    var d;
    if (fl===tl) {
      d='M'+x1+','+y1+' L'+x2+','+y2;
    } else {
      var half=y1+ROW_H/2, step=y1+ROW_H;
      if (tr===fr+1) {
        d='M'+x1+','+y1+' C'+x1+','+half+' '+x2+','+half+' '+x2+','+y2;
      } else {
        d='M'+x1+','+y1+' C'+x1+','+half+' '+x2+','+half+' '+x2+','+step+' L'+x2+','+y2;
      }
    }
    parts.push('<path data-lane="'+fl+'" d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="1.5" opacity="0.8" style="transition:opacity .15s,stroke-width .15s"/>');
  });

  // Pre-compute which commit indices are branch-from parents, and for which source lane
  var bopMap = {}; // idx → source lane (the lane that branched FROM this commit)
  commits.forEach(function(c) {
    if (c.branch_from != null) bopMap[c.branch_from.idx] = c.lane;
  });

  // Draw commit nodes
  commits.forEach(function(c,i) {
    var x=cx(c.lane), y=cy(i), clr=col(c.lane);
    var lbs = c.labels || [];
    var hasLabel=lbs.length>0, r=hasLabel?5.5:DOT_R;
    var isBranchStart = !!c.branch_from;

    // SVG native tooltip (hover)
    var tipText = (lbs.length ? lbs.join(', ')+'\n' : '') + c.short+' '+c.msg+'\n'+c.author+' · '+c.date;
    if (isBranchStart) {
      var bf = c.branch_from;
      var bfName = (bf.labels && bf.labels.length) ? bf.labels[0] : bf.short;
      tipText += '\n✂ Branched from: ' + bfName + ' (' + bf.date + ')';
    }

    parts.push('<g data-lane="'+c.lane+'" data-idx="'+i+'" onclick="showGraphNodeInfo(event,'+i+')" style="cursor:pointer;transition:opacity .15s">');

    // Branch-origin-parent ring: shown when a child branch is highlighted
    if (i in bopMap) {
      var srcClr = col(bopMap[i]);
      parts.push('<circle class="bop-ring" data-src-lane="'+bopMap[i]+'" cx="'+x+'" cy="'+y+'" r="'+(r+6)+'" fill="none" stroke="'+srcClr+'" stroke-width="2" stroke-dasharray="4,2" opacity="0" style="transition:opacity .15s"/>');
    }
    // Branch-start marker: dashed outer ring on the branch's first commit
    if (isBranchStart) {
      parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+(r+4)+'" fill="none" stroke="'+clr+'" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>');
    }
    // Outer ring: gold for HEAD, colored for branch tips
    if (c.is_head) {
      parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+(r+3)+'" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.85"/>');
    } else if (hasLabel) {
      parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+(r+2.5)+'" fill="none" stroke="'+clr+'" stroke-width="1.5" opacity="0.45"/>');
    }
    parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+clr+'" stroke="#fff" stroke-width="1.5"/>');
    parts.push('<title>'+esc(tipText)+'</title>');
    parts.push('</g>');
  });

  parts.push('</svg>');
  wrap.innerHTML = parts.join('');
}

function showGraphNodeInfo(event, idx) {
  event.stopPropagation();
  var old = document.getElementById('_gntip'); if (old) old.remove();
  var c = _graphData && _graphData.commits && _graphData.commits[idx];
  if (!c) return;

  highlightGraphLane(c.lane, false); // Highlight this commit's lane in legend

  var bfHtml = '';
  if (c.branch_from) {
    var bf = c.branch_from;
    var bfName = (bf.labels && bf.labels.length) ? bf.labels[0] : bf.short;
    bfHtml = '<div class="gnt-branch-from">'
      + '<span class="gnt-bf-icon">✂</span>'
      + '<span class="gnt-bf-info">Branched from <strong>' + escapeHtml(bfName) + '</strong>'
      + ' &nbsp;<span class="gnt-bf-hash">' + escapeHtml(bf.short) + '</span>'
      + ' &nbsp;<span class="gnt-bf-date">' + escapeHtml(bf.date) + '</span></span>'
      + '</div>';
  }

  var tip = document.createElement('div');
  tip.id = '_gntip'; tip.className = 'graph-node-tip';
  tip.innerHTML =
    '<div class="gnt-hash">' + escapeHtml(c.short) + '</div>'
    + '<div class="gnt-msg">' + escapeHtml(c.msg) + '</div>'
    + '<div class="gnt-meta">' + escapeHtml(c.author) + ' · ' + escapeHtml(c.date) + '</div>'
    + (c.labels&&c.labels.length ? '<div class="gnt-labels">'
        + c.labels.map(function(l){return '<span class="gnt-label">'+escapeHtml(l)+'</span>';}).join('')
        + '</div>' : '')
    + bfHtml;
  document.body.appendChild(tip);

  // Position tooltip to the right of the clicked point, within viewport
  var tipW=tip.offsetWidth||244, tipH=tip.offsetHeight||100;
  var left = event.clientX + 14;
  if (left + tipW > window.innerWidth) left = event.clientX - tipW - 14;
  var top = event.clientY - 14;
  if (top + tipH > window.innerHeight) top = window.innerHeight - tipH - 8;
  tip.style.left = Math.max(4, left) + 'px';
  tip.style.top = Math.max(4, top) + 'px';

  // Close on next click anywhere (remove any previous handler first)
  if (showGraphNodeInfo._closeHandler) {
    document.removeEventListener('click', showGraphNodeInfo._closeHandler);
  }
  setTimeout(function() {
    showGraphNodeInfo._closeHandler = function() {
      var el = document.getElementById('_gntip'); if (el) el.remove();
      document.removeEventListener('click', showGraphNodeInfo._closeHandler);
      showGraphNodeInfo._closeHandler = null;
    };
    document.addEventListener('click', showGraphNodeInfo._closeHandler);
  }, 0);
}

_initGraphPanel();

// ═══════════ AI: Analyze Graph ═══════════
function aiAnalyzeGraph() {
  if (!_graphData || !_graphData.commits || !_graphData.commits.length) {
    showToast('Please load the graph first (click ↻)', 'error', 3000);
    return;
  }
  var btn = document.getElementById('btn-ai-graph');
  if (btn) { btn.textContent = '⏳ Analyzing...'; btn.disabled = true; }

  // Build a concise summary of the graph for AI analysis
  var branches = {};
  _graphData.commits.forEach(function(c) {
    (c.labels || []).forEach(function(l) {
      if (!branches[l]) branches[l] = { latest: c.msg, date: c.date, lane: c.lane };
    });
  });
  var summary = 'Branch Graph Summary (latest ' + _graphData.commits.length + ' commits):\n';
  summary += 'Branches:\n';
  Object.keys(branches).forEach(function(b) {
    summary += '  - ' + b + ' (latest: "' + (branches[b].latest || '').substring(0, 60) + '")\n';
  });
  summary += '\nRecent commits:\n';
  _graphData.commits.slice(0, 20).forEach(function(c) {
    var labels = (c.labels || []).length ? ' [' + c.labels.join(', ') + ']' : '';
    summary += '  ' + (c.hash || '').substring(0, 7) + ' ' + (c.msg || '').substring(0, 80) + labels + '\n';
  });

  var cfg = (typeof getAIConfig === 'function') ? getAIConfig() : null;
  if (!cfg || !cfg.provider) {
    showToast('Please configure AI provider first (in AI panel)', 'error', 4000);
    if (btn) { btn.textContent = '🤖 AI Analysis'; btn.disabled = false; }
    return;
  }

  var messages = [
    { role: 'system', content: 'You are a Git expert. Analyze the branch graph summary and provide insights: active branches, merge status, potential issues (stale branches, divergence). Be concise (under 300 words). Use markdown. ' + _aiLangInstruction() },
    { role: 'user', content: summary }
  ];

  fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: cfg.provider, api_key: cfg.api_key, base_url: cfg.base_url, model: cfg.model, messages: messages }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (!data.ok) {
      showToast('AI error: ' + (data.error || ''), 'error', 4000);
      if (btn) { btn.textContent = '🤖 AI Analysis'; btn.disabled = false; }
      return;
    }
    _pollGraphAI(data.jobId, btn);
  })
  .catch(function(e) {
    showToast('AI network error: ' + e.message, 'error', 4000);
    if (btn) { btn.textContent = '🤖 AI Analysis'; btn.disabled = false; }
  });
}

function _pollGraphAI(jobId, btn) {
  fetch('/api/ai/chat-status?jobId=' + jobId)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.done) { setTimeout(function() { _pollGraphAI(jobId, btn); }, 800); return; }
      if (btn) { btn.textContent = '🤖 AI Analysis'; btn.disabled = false; }
      if (data.ok) {
        _showGraphAIResult(data.text);
      } else {
        showToast('AI analysis failed: ' + (data.error || ''), 'error', 4000);
      }
    })
    .catch(function() { setTimeout(function() { _pollGraphAI(jobId, btn); }, 1200); });
}

function _showGraphAIResult(text) {
  var wrap = document.getElementById('graph-svg-wrap');
  if (!wrap) return;
  // Show AI result in a floating panel above the graph
  var existing = document.getElementById('graph-ai-result');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.id = 'graph-ai-result';
  div.style.cssText = 'position:absolute;top:8px;left:8px;right:8px;z-index:20;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px 16px;font-size:12px;color:#e2e8f0;line-height:1.7;max-height:60%;overflow-y:auto;white-space:pre-wrap;box-shadow:0 4px 12px rgba(0,0,0,.3)';
  div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="color:#a78bfa">🤖 AI Graph Analysis</b><button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px">✕</button></div><div>' + escapeHtml(text).replace(/\n/g, '<br>') + '</div>';
  wrap.style.position = 'relative';
  wrap.appendChild(div);
}

// ═══════════ AI: Create Worktree ═══════════
function aiCreateWorktree() {
  // Show input modal instead of system prompt
  var inputId = 'ai-wt-input-' + Date.now();
  var body = '<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">' + t('ai_wt_input_label') + '</label>'
    + '<input type="text" id="' + inputId + '" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;outline:none" placeholder="' + escapeAttr(t('ai_wt_placeholder')) + '" autofocus>';

  document.getElementById('modal-title').innerHTML = t('ai_wt_title');
  document.getElementById('modal-msg').innerHTML = body;
  var btnsDiv = document.getElementById('modal-btns');
  btnsDiv.innerHTML = '';

  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = t('ai_wt_cancel');
  cancelBtn.onclick = closeModal;

  var confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = t('ai_wt_confirm');
  confirmBtn.onclick = function() {
    var inp = document.getElementById(inputId);
    var branch = (inp && inp.value || '').trim();
    if (!branch) { inp.style.borderColor = '#ef4444'; inp.focus(); return; }
    closeModal();
    _doAiCreateWorktree(branch);
  };

  btnsDiv.appendChild(cancelBtn);
  btnsDiv.appendChild(confirmBtn);
  document.getElementById('modal-bg').classList.add('show');

  // Focus input and handle Enter key
  setTimeout(function() {
    var inp = document.getElementById(inputId);
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { confirmBtn.click(); }
      });
    }
  }, 100);
}

function _doAiCreateWorktree(branch) {
  // Show a log modal
  var uid = 'ai-wt-' + Date.now();
  var logDivId = 'ai-wt-log-' + uid;
  var logBox = '<div id="' + logDivId + '" style="'
    + 'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.6;'
    + 'padding:12px 14px;border-radius:8px;min-height:100px;max-height:280px;'
    + 'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    + '</div>';

  showModal(
    '🤖 AI Creating Worktree — <span style="font-size:12px;font-weight:400;color:#a78bfa">' + escapeHtml(branch) + '</span>',
    logBox, 'Close', null
  );

  var ld = document.getElementById(logDivId);
  function log(msg, color) {
    if (!ld) ld = document.getElementById(logDivId);
    if (ld) ld.innerHTML += '<span style="color:' + (color || '#e2e8f0') + '">' + escapeHtml(msg) + '</span>\n';
    if (ld) ld.scrollTop = ld.scrollHeight;
  }

  log('🌿 Branch: ' + branch, '#c4b5fd');
  log('📍 Fetching project path...', '#94a3b8');

  // Step 1: Get current project path
  fetch(API_BASE + '/api/project-path')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var basePath = data.path || '';
      if (!basePath) { log('❌ Cannot determine project path', '#f87171'); return; }

      // Auto-generate worktree path as sibling directory
      var parentDir = basePath.replace(/\/[^/]+\/?$/, '');
      var wtPath = parentDir + '/' + branch.replace(/[^a-zA-Z0-9_.-]/g, '-');

      log('📂 Worktree path: ' + wtPath, '#67e8f9');
      log('⏳ Creating worktree...', '#fbbf24');

      // Step 2: Create worktree
      fetch(API_BASE + '/api/worktree-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: branch, path: wtPath })
      })
      .then(function(r) { return r.json(); })
      .then(function(result) {
        if (result.ok) {
          log('✅ Worktree created successfully!', '#4ade80');
          log('🔄 Switching to new worktree...', '#fbbf24');

          // Step 3: Switch to new worktree
          fetch(API_BASE + '/api/worktree-switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: wtPath })
          })
          .then(function(r) { return r.json(); })
          .then(function(swResult) {
            if (swResult.ok) {
              log('✅ Switched to worktree: ' + branch, '#4ade80');
              log('🎉 Done! Reloading page...', '#4ade80');
              setTimeout(function() { window.location.reload(); }, 1500);
            } else {
              log('⚠️ Created but switch failed: ' + (swResult.error || ''), '#f87171');
              log('You can manually switch from the Worktree panel.', '#94a3b8');
            }
          })
          .catch(function(e) { log('❌ Switch error: ' + e.message, '#f87171'); });
        } else {
          log('❌ Failed: ' + (result.error || 'unknown error'), '#f87171');
          if (result.error && result.error.indexOf('already exists') >= 0) {
            log('💡 Tip: The branch or path already exists. Try a different name.', '#fbbf24');
          }
        }
      })
      .catch(function(e) { log('❌ Network error: ' + e.message, '#f87171'); });
    })
    .catch(function(e) { log('❌ Cannot get project path: ' + e.message, '#f87171'); });
}
