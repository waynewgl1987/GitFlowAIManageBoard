// ═══════════ i18n ═══════════
var L = (localStorage.getItem('git_tool_lang') || 'en');
var T = {
  select_all: {en:'Select / Deselect All', zh:'全选 / 取消全选'},
  confirm_commit: {en:'Confirm Commit', zh:'确认 Commit'},
  deselect_all: {en:'Deselect All', zh:'全部取消'},
  refresh: {en:'Refresh', zh:'刷新'},
  back: {en:'Back', zh:'返回'},
  branches_title: {en:'Branches', zh:'分支列表'},
  stash_title: {en:'Stash List', zh:'Stash 列表'},
  conflicts_title: {en:'Conflict Resolution', zh:'冲突解决'},
  log_title: {en:'Commit Log', zh:'提交记录'},
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
  revert_title: {en:'Revert', zh:'撤销'},
  revert_desc: {en:'Creates a new commit that undoes this commit. History is preserved.', zh:'创建一个新commit撤销该commit，不丢失历史。'},
  squash_confirm: {en:'Squash {n} commits into one?', zh:'将 {n} 个commit合并为1个？'},
  squash_ok: {en:'Squash successful!', zh:'Squash 成功！'},
  squash_fail: {en:'Squash failed: ', zh:'Squash 失败: '},
  reset_ok: {en:'Reset ({mode}) successful', zh:'Reset ({mode}) 成功'},
  reset_fail: {en:'Reset failed: ', zh:'Reset 失败: '},
  revert_ok: {en:'Revert successful', zh:'Revert 成功'},
  revert_fail: {en:'Revert failed: ', zh:'Revert 失败: '},
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
  squash_root_error: {en:'Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.', zh:'无法 Squash：选中的最旧提交是初始 commit（没有父节点），请取消勾选它。'},
  force_push_title: {en:'🎉 Squash Successful!', zh:'🎉 Squash 成功！'},
  force_push_desc: {en:'Squash rewrites commit history. To update the remote branch you must <b>force push</b> (<code>--force-with-lease</code>).<br><br>Force push now?', zh:'Squash 会改写提交历史，远端分支需要使用 <b>force push</b>（<code>--force-with-lease</code>）才能更新。<br><br>现在立即执行吗？'},
  force_push_btn: {en:'Force Push Now', zh:'立即 Force Push'},
  force_push_later: {en:'Later', zh:'稍后手动操作'},
  squash_tip: {en:'💡 Tip: Check 2 or more commit checkboxes to merge them into one commit (Squash)', zh:'💡 提示：勾选 2 个或以上 commit 的 checkbox，可将它们合并为一个新 commit（Squash）'},
  create_branch_btn: {en:'+ Create Branch', zh:'+ 新建分支'},
  new_branch_placeholder: {en:'New branch name...', zh:'新分支名...'},
  branch_search_placeholder: {en:'Search branches (fuzzy)...', zh:'搜索分支（模糊匹配）...'},
  log_search_placeholder: {en:'Search hash / author / message...', zh:'搜索 hash / 作者 / 消息...'},
  code_search_placeholder: {en:'Search code in diffs...', zh:'搜索代码变更...'},
  squash_msg_placeholder: {en:'New commit message...', zh:'合并后的新 commit 消息...'},
  restore_page_title: {en:'Restore File to Commit', zh:'还原文件到指定 Commit'},
  restore_page_desc: {en:'Select a commit below to restore this file to that version. This will overwrite your current working copy.', zh:'选择一个 commit，将当前文件还原到该版本（会覆盖当前工作区文件）。'},
  back_to_log: {en:'← Back to Log', zh:'← 返回 Commit Log'},
  tab_commit: {en:'Commit', zh:'提交'},
  tab_branches: {en:'Branches', zh:'分支'},
  tab_log: {en:'Commit Log', zh:'提交日志'},
  tab_conflicts: {en:'Conflicts', zh:'冲突'},
  tab_stash: {en:'Stash', zh:'暂存'},
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

function switchLang(lang) {
  L = lang;
  localStorage.setItem('git_tool_lang', lang);
  var sel = document.getElementById('lang-sel');
  if (sel) sel.value = lang;
  applyI18n();
  var active = document.querySelector('.page.active');
  if (active) {
    var id = active.id;
    if (id === 'page-main') loadFiles();
    else if (id === 'page-branches') loadBranches(1);
    else if (id === 'page-stash') loadStash();
    else if (id === 'page-conflicts') loadConflicts();
    else if (id === 'page-log') loadLog(1);
    else if (id === 'page-msglog') loadMsgLog(1);
  }
}

function applyI18n() {
  var els = document.querySelectorAll('[data-i18n]');
  for (var i=0; i<els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    el.textContent = t(key);
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

// Init
(function(){
  try {
    var sel = document.getElementById('lang-sel');
    if (sel) sel.value = L;
    applyI18n();
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
var currentLogData = null;

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
  if(section==='branches')loadBranches(1);
  else if(section==='log')loadLog(1);
  else if(section==='stash')loadStash(1);
}

function escapeHtml(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escapeAttr(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function addMsg(msg, cls) {
  cls=cls||'info';
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  div.innerHTML='<span class="msg-text">'+escapeHtml(msg)+'</span><span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span>';
  area.appendChild(div);
}

function addMsgWithAction(msg, cls, actions) {
  cls=cls||'info';
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  var btnHtml='';
  actions.forEach(function(a){
    btnHtml+=' <button class="btn btn-sm btn-primary" onclick="dismissMsg(\''+id+'\');('+a.onClick.toString()+')()" style="margin-left:6px">'+escapeHtml(a.label)+'</button>';
  });
  div.innerHTML='<span class="msg-text">'+escapeHtml(msg)+'</span>'+btnHtml+'<span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span>';
  area.appendChild(div);
}

function updateMsgCount(){
  var el = document.querySelector('.msg-log-bar span[data-i18n="msg_count"]');
  if (el) el.textContent = tf('msg_count', L, {n: msgLog.length});
}
function dismissMsg(id){var el=document.getElementById(id);if(el)el.remove()}

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
  var totalPages=Math.ceil(total/perPage);
  var start=(page-1)*perPage;
  var items=msgLog.slice(start,start+perPage).reverse();
  var container=document.getElementById('msglog-content');
  if(!items.length){container.innerHTML='<div class="empty">No messages</div>';return}
  var html='<table class="log-table"><thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead><tbody>';
  items.forEach(function(m){
    var cls=m.type==='error'?'color:#dc2626':m.type==='success'?'color:#059664':'color:#6b7280';
    html+='<tr><td style="font-size:12px;color:#9ca3af;white-space:nowrap">'+escapeHtml(m.time)+'</td><td style="'+cls+'">'+m.type+'</td><td style="font-size:13px">'+escapeHtml(m.text)+'</td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  // pagination
  var pag=document.getElementById('msglog-pagination');
  if(totalPages<=1){pag.innerHTML='';return}
  var phtml='<span class="page-info">Total '+total+'</span>';
  for(var i=1;i<=totalPages;i++){
    var cl=(i===page)?' page-num active':' page-num';
    phtml+='<span class="'+cl+'" onclick="loadMsgLog('+i+')">'+i+'</span>';
  }
  pag.innerHTML=phtml;
}

function clearMsgLog() {
  showModal(t('confirm_clear_msg'), t('confirm_clear_msg'), 'Clear', function(){
    msgLog=[];
    updateMsgCount();
    addMsg(t('msg_cleared'),'success');
    loadMsgLog(1);
  });
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

function closeModal() {
  document.getElementById('modal-bg').classList.remove('show');
  modalCallback=null;
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
  var tabMap={main:'commit',branches:'branches',stash:'stash',conflicts:'conflicts',log:'log',msglog:'log',restore:'log'};
  var tabId='tab-'+(tabMap[name]||name);
  var activeTab=document.getElementById(tabId);
  if(activeTab)activeTab.classList.add('active');
  if(name==='main')loadFiles();
  // Persist tab so refresh restores same page
  try{localStorage.setItem('git_tool_active_tab',name);}catch(e){}
}

function apiGet(path,cb){
  _showSpinner();
  fetch(API_BASE+path).then(function(r){return r.json()}).then(function(d){_hideSpinner();cb(d)}).catch(function(e){_hideSpinner();addMsg(t('network_err')+e.message,'error')})
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
    html+='<div class="file-card" data-index="'+idx+'"><div class="file-header">';
    html+='<span class="cb-wrap"><input type="checkbox" data-path="'+attrPath+'" class="file-cb"'+checked+'></span>';
    html+='<span class="'+toggleCls+'">▶</span>';
    html+='<span class="file-path">'+safePath+'</span>';
    html+='<span style="color:#9ca3af;font-size:12px">('+lineCount+' '+t('lines')+')</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();ignoreFile(\''+attrPath+'\')" title="Discard changes for this file">Ignore</button>';
    html+='</div>';
    if(diffHtml){html+='<div class="'+bodyCls+'"><div class="diff-block">'+diffHtml+'</div></div>'}
    html+='</div>';
  });
  list.innerHTML=html;
}

function loadFiles(){apiGet('/api/files',function(data){renderFiles(data.files)})}

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

function checkConflicts(){
  apiGet('/api/conflicts',function(data){
    var tab=document.getElementById('tab-conflicts');
    if(data.count>0){
      tab.textContent='Conflicts ('+data.count+')';
      tab.style.background='#fee2e2';tab.style.color='#991b1b';
    }else{
      tab.textContent='Conflicts';
      tab.style.background='';tab.style.color='';
    }
  });
}

// ═══════════ Pull + Fetch ═══════════
function doPush(credentials, force){
  var branchEl=document.getElementById('branch-name');
  var branch=(branchEl&&branchEl.textContent)||'?';
  var body=credentials||{};
  if(force) body.force=true;
  var logDivId='push-log-live';
  var pushLabel=force?'🚀 Force Pushing':'🚀 Pushing';
  var pushDesc=force?'force push (--force-with-lease) to':'push to';

  // Build live log modal
  var logBox='<div id="'+logDivId+'" style="'
    +'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.5;'
    +'padding:12px 14px;border-radius:8px;min-height:140px;max-height:340px;'
    +'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    +'<span style="color:#94a3b8">⏳ Starting '+pushDesc+' origin/'+escapeHtml(branch)+'...\n</span></div>';
  showModal(pushLabel+' — <span style="font-size:12px;font-weight:400;color:#94a3b8">origin/'+escapeHtml(branch)+'</span>',
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
            else if(/^error:|fatal:|ERROR|timed out/i.test(lineBody)) col='#f87171';
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
            loadLog(1); loadCurrentBranch();
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
              if(isNonFastForward&&!isRejectedFetchFirst){
                if(ld3) ld3.innerHTML+='<span style="color:#fbbf24">💡 Local branch is behind remote (e.g. after git reset --hard).\n   Use Force Push to overwrite remote, or Pull to sync first.\n</span>';
              }else{
                if(ld3) ld3.innerHTML+='<span style="color:#fbbf24">💡 Remote has new commits. Pull first, then push.\n</span>';
              }
              var pullRetryBtn=document.createElement('button');
              pullRetryBtn.className='btn btn-success';
              pullRetryBtn.textContent='⬇️ Pull & Retry Push';
              pullRetryBtn.onclick=function(){
                pullRetryBtn.disabled=true;pullRetryBtn.textContent='Pulling...';
                var ld4=document.getElementById(logDivId);
                if(ld4) ld4.innerHTML+='<span style="color:#94a3b8">⏳ Pulling (rebase)...\n</span>';
                apiPost('/api/pull',{mode:'rebase'},function(pd){
                  if(pd.ok){
                    if(ld4) ld4.innerHTML+='<span style="color:#4ade80">✅ Pull OK — retrying push...\n</span>';
                    closeModal();
                    setTimeout(function(){ doPush(credentials||undefined); },300);
                  }else{
                    if(ld4) ld4.innerHTML+='<span style="color:#f87171">❌ Pull failed: '+escapeHtml(pd.error||pd.log||'')+'</span>\n';
                    pullRetryBtn.disabled=false;pullRetryBtn.textContent='⬇️ Pull & Retry Push';
                  }
                });
              };
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
              btnsDiv2.appendChild(forceBtn);
              btnsDiv2.appendChild(pullRetryBtn);
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
  showModalDouble(
    '🚀 Push to remote?',
    'Push local commits on <b>'+escapeHtml(branch)+'</b> to <b>origin/'+escapeHtml(branch)+'</b>?<br><br><span style="font-size:12px;color:#6b7280">Only commits that are not yet on remote will be pushed.</span>',
    'Push Now',
    function(){ doPush(); },
    'Cancel',
    null,
    'btn-success',
    'btn-secondary'
  );
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
            else if(/^error:|fatal:|ERROR|timed out/i.test(lineBody)) col='#f87171';
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
            else addMsg('❌ '+t('fetch_fail')+errTxt,'error');
          }
          checkConflicts();
          if(r.ok && op==='pull') loadCurrentBranch();
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
  addMsg(t('fetching'),'info');
  _startGitopStream('fetch', null, function(ok){
    if(ok){ loadFiles(); }
  });
}

function handlePullErr(err) {
  if(err.indexOf('overwritten by merge')>=0||err.indexOf('would be overwritten')>=0){
    addMsgWithAction('⚠️ Pull blocked: local file changes conflict with remote. Auto-stash and retry?','error',[
      {label:'Stash & Retry Pull',onClick:function(){
        apiPost('/api/stash',{},function(s){
          if(!s.ok){addMsg('Stash failed: '+(s.error||''),'error');return}
          _executePull('rebase',function(){
            apiPost('/api/stash-pop',{index:0},function(p){
              if(!p.ok)addMsg('Stash pop conflict — check Conflicts tab','error');
              else addMsg('✅ Restored local changes after pull','ok');
              loadFiles();
            });
          });
        });
      }}
    ]);
  }
  else if(err.indexOf('CONFLICT')>=0||err.indexOf('conflict')>=0){addMsg(t('pull_conflict'),'error');checkConflicts()}
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
  }else addMsg(t('pull_fail')+err,'error');
}

// ═══════════ Branches ═══════════
var _branchSortField='date';
var _branchSortOrder='desc';
var _allBranchesCache=null;
var _branchSearchTimer=null;

function toggleBranchSort(field){
  if(_branchSortField===field){
    _branchSortOrder=_branchSortOrder==='desc'?'asc':'desc';
  }else{
    _branchSortField=field;
    _branchSortOrder='desc';
  }
  // Re-render with current data (no network call needed)
  var search=document.getElementById('branch-search').value.trim().toLowerCase();
  if(search&&_allBranchesCache){
    _renderFilteredBranches(search);
  }else if(!search){
    // reload to re-render with sort
    loadBranches(document.querySelector('#branches-pagination .page-num.active')?parseInt(document.querySelector('#branches-pagination .page-num.active').textContent):1);
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
    '<span style="width:294px"></span>'+
    '</div>';
}

function loadBranches(page){
  page=page||1;
  switchPage('branches');
  document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading branches...</div>';
  document.getElementById('branches-pagination').innerHTML='';
  var _bpv=document.getElementById('branches-per-page').value;var perPage=_bpv===''?20:parseInt(_bpv);
  var url='/api/branches?page='+page+'&per_page='+perPage;
  apiGet(url,function(data){
    var container=document.getElementById('branches-content');
    var sortedLocal=_sortBranches(data.local||[]);
    var sortedRemote=_sortBranches(data.remote||[]);
    var html=_branchSortHeader();
    html+='<div class="branch-list"><h3>Local Branches ('+data.total_local+')</h3>';
    sortedLocal.forEach(function(b,bi){
      var isCur=(b.name===data.current);
      var wid='bwrap-l-'+bi;
      var cls=isCur?' branch-item current':' branch-item';
      html+='<div id="'+wid+'">';
      html+='<div class="'+cls+'">';
      html+='<span class="name">'+escapeHtml(b.name)+'</span>';
      html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
      if(isCur){
        html+='<div style="width:294px;display:flex;justify-content:flex-end">';
        html+='<span style="display:inline-flex;align-items:center;justify-content:center;width:90px;padding:4px 0;border-radius:99px;font-size:12px;font-weight:700;letter-spacing:.3px;'
          +'background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;'
          +'box-shadow:0 0 0 2px rgba(99,102,241,.3),0 2px 8px rgba(29,78,216,.35)">✓ Current</span>';
        html+='</div>';
      }else{
        html+='<div style="width:294px;display:flex;gap:6px;justify-content:flex-end">';
        html+='<button class="btn btn-sm" style="width:90px;background:#0ea5e9;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();openCompare(\''+escapeAttr(b.name)+'\',\'local\')">⚖️ Compare</button>';
        html+='<button class="btn btn-sm" style="width:90px;background:#f97316;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();mergeBranch(\''+escapeAttr(b.name)+'\')">⚡ Merge</button>';
        html+='<button class="btn btn-sm" style="width:90px;background:#6366f1;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">✅ Checkout</button>';
        html+='</div>';
        html+='<button class="btn-branch-expand" onclick="event.stopPropagation();toggleBranchExpand(\''+wid+'\')" title="Expand">▶</button>';
      }
      html+='</div>';
      if(!isCur){
        html+='<div class="branch-expand-panel" id="bpanel-l-'+bi+'">';
        html+='<span style="font-size:12px;color:#9ca3af;flex:1">Danger zone</span>';
        html+='<button class="btn-del-branch" onclick="promptDeleteBranch(\''+escapeAttr(b.name)+'\',\'local\')">🗑 Delete Branch</button>';
        html+='</div>';
      }
      html+='</div>';
    });
    html+='</div><div class="branch-list"><h3>Remote Branches ('+data.total_remote+')</h3>';
    sortedRemote.forEach(function(b,bi){
      var wid='bwrap-r-'+bi;
      html+='<div id="'+wid+'">';
      html+='<div class="branch-item">';
      html+='<span class="name">'+escapeHtml(b.name)+'</span>';
      html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
      html+='<div style="width:294px;display:flex;gap:6px;justify-content:flex-end">';
      html+='<button class="btn btn-sm" style="width:90px;background:#0ea5e9;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();openCompare(\''+escapeAttr(b.name)+'\',\'remote\')">⚖️ Compare</button>';
      html+='<button class="btn btn-sm" style="width:90px;background:#f97316;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();mergeBranch(\''+escapeAttr(b.name)+'\')">⚡ Merge</button>';
      html+='<button class="btn btn-sm" style="width:90px;background:#6366f1;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">✅ Checkout</button>';
      html+='</div>';
      html+='<button class="btn-branch-expand" onclick="event.stopPropagation();toggleBranchExpand(\''+wid+'\')" title="Expand">▶</button>';
      html+='</div>';
      html+='<div class="branch-expand-panel" id="bpanel-r-'+bi+'">';
      html+='<span style="font-size:12px;color:#9ca3af;flex:1">Danger zone</span>';
      html+='<button class="btn-del-branch" onclick="promptDeleteBranch(\''+escapeAttr(b.name)+'\',\'remote\')">🗑 Delete Branch</button>';
      html+='</div>';
      html+='</div>';
    });
    html+='</div>';
    container.innerHTML=html;
    var pag=document.getElementById('branches-pagination');
    var totalPages=perPage>0?Math.ceil(data.total_remote/perPage):1;
    if(totalPages<=1){pag.innerHTML='';return}
    var phtml='<span class="page-info">Remote: '+data.total_remote+' total</span>';
    for(var i=1;i<=totalPages;i++){var cl=(i===data.page)?' page-num active':' page-num';phtml+='<span class="'+cl+'" onclick="loadBranches('+i+')">'+i+'</span>'}
    pag.innerHTML=phtml;
  });
}

function createNewBranch(){
  var name=document.getElementById('new-branch-name').value.trim();
  if(!name){addMsg(t('enter_branch_name'),'error');return}
  var curName=document.getElementById('branch-name').textContent;
  showModal('Create Branch','Create new branch <b>'+escapeHtml(name)+'</b><br><br>Based on: <span style="background:#1e40af;color:#fff;padding:2px 10px;border-radius:99px;font-weight:700">'+escapeHtml(curName)+'</span>','Create',function(){
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

function promptDeleteBranch(branchName, defaultScope){
  // Step 1: choose local vs remote
  var isRemoteList=(defaultScope==='remote');
  var shortName=branchName.replace(/^origin\//,'');
  var bodyHtml=
    '<p style="margin:0 0 14px;font-size:13px;color:#374151">Choose what to delete for branch <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-weight:700">'+escapeHtml(shortName)+'</code>:</p>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +'<button onclick="_delBranchScope(\''+escapeAttr(branchName)+'\',\'local\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #d1d5db;background:#f9fafb;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:18px">💻</span><div><div style="font-weight:600;color:#111827">Delete Local Branch</div><div style="font-size:11px;color:#6b7280;margin-top:2px">Removes only the local copy. Remote is untouched.</div></div></button>'
    +'<button onclick="_delBranchScope(\''+escapeAttr(branchName)+'\',\'remote\')" style="padding:10px 14px;border-radius:8px;border:1.5px solid #fca5a5;background:#fff5f5;cursor:pointer;text-align:left;font-size:13px;display:flex;align-items:center;gap:8px">'
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
    showModalDouble(
      '⚠️ Delete Remote Branch',
      warnBody,
      '🗑 Yes, Delete Remote',
      function(){ _doDeleteRemote(branchName, shortName); },
      'Cancel',
      null,
      'btn-danger',
      'btn-secondary'
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
          showModalDouble(
            '⚠️ Force Delete?',
            forceBody,
            '🗑 Force Delete (-D)',
            function(){
              apiPost('/api/delete-branch',{name:shortName,scope:'local',force:true},function(d){
                if(d.ok){addMsg('🗑 Branch "'+shortName+'" force deleted','success');loadBranches(1);}
                else addMsg('❌ Failed: '+(d.error||''),'error');
              });
            },
            'Cancel', null, 'btn-danger', 'btn-secondary'
          );
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
        if(/^error:|fatal:|ERROR/i.test(line)) col='#f87171';
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





function checkoutBranch(branchName){
  apiGet('/api/has-uncommitted',function(data){
    if(data.hasChanges){
      showModal(t('stash_switched'),t('stash_prompt')+branchName+'?',t('stash_switched'),function(){
        apiPost('/api/stash',{},function(stashData){
          doCheckout(branchName, true);  // true = had stash
        });
      });
    }else doCheckout(branchName, false);
  });
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
    }else addMsg(t('switch_fail')+(data.error||data.stderr||''),'error');
  });
}

// ═══════════ Merge ═══════════
function mergeBranch(sourceBranch){
  var curBranch=document.getElementById('branch-name').textContent.trim();
  var defaultMsg='Merge branch \''+sourceBranch+'\' into '+curBranch;
  var warnBox='<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:10px;padding:14px 16px;margin-bottom:14px">'
    +'<div style="font-size:15px;font-weight:800;color:#b91c1c;margin-bottom:10px">⚠️ HIGH-RISK OPERATION — Read before continuing!</div>'
    +'<div style="background:#fff3;border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:13px;line-height:1.8">'
    +'Merging: <span style="font-family:monospace;background:#fee2e2;color:#7c3aed;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(sourceBranch)+'</span>'
    +' &nbsp;→&nbsp; <span style="font-family:monospace;background:#dbeafe;color:#1d4ed8;padding:1px 7px;border-radius:4px;font-weight:700">'+escapeHtml(curBranch)+'</span> (current)'
    +'</div>'
    +'<ul style="margin:0 0 12px;padding-left:18px;font-size:13px;color:#7f1d1d;line-height:1.9">'
    +'<li>All commits from <b>'+escapeHtml(sourceBranch)+'</b> will be <b>squashed into one single commit</b></li>'
    +'<li>If conflicts arise, you must resolve them in the <b>Conflicts tab</b></li>'
    +'<li>Ensure all local changes are <b>committed or stashed</b> first</li>'
    +'<li>This modifies your branch history — coordinate with your team</li>'
    +'</ul>'
    +'</div>'
    +'<label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Commit message <span style="color:#dc2626">*</span></label>'
    +'<textarea id="merge-msg-input" rows="3" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box" placeholder="Required — describe what this merge brings in">'+escapeHtml(defaultMsg)+'</textarea>';
  showModal(
    '🚨 Confirm Merge',
    warnBox,
    'Merge Now',
    function(){
      var msg=(document.getElementById('merge-msg-input')||{value:''}).value.trim();
      if(!msg){addMsg('Merge commit message is required','error');return;}
      addMsg('🔀 Merging '+sourceBranch+' → '+curBranch+'...','info');
      apiPost('/api/merge',{branch:sourceBranch,message:msg},function(data){
        var logBox='<div style="background:#0f172a;color:#e2e8f0;font-family:monospace;font-size:12px;'
          +'line-height:1.6;padding:12px 14px;border-radius:8px;max-height:260px;overflow-y:auto;white-space:pre-wrap;margin-bottom:12px">'
          +escapeHtml((data.log||'').trim())+'</div>';
        if(data.ok){
          addMsg('✅ Merged '+sourceBranch+' into '+curBranch,'success');
          loadFiles();loadLog(1);checkConflicts();
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
          addMsg('❌ Merge failed: '+(data.error||''),'error');
          showModal('❌ Merge Failed',logBox,'Close',null);
        }
      });
    }
  );
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
    var pag=document.getElementById('stash-pagination');
    if(totalPages<=1){pag.innerHTML='';return}
    var phtml='<span class="page-info">Total '+data.total+'</span>';
    for(var i=1;i<=totalPages;i++){
      var cl=(i===data.page)?' page-num active':' page-num';
      phtml+='<span class="'+cl+'" onclick="loadStash('+i+')">'+i+'</span>';
    }
    pag.innerHTML=phtml;
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

// ═══════════ Log page ═══════════
var logDebounceTimer=null;
var logSortOrder='desc'; // 'desc' = newest first, 'asc' = oldest first
function onLogSearchInput(){
  var val=document.getElementById('log-search').value;
  document.getElementById('log-search-btn').style.display=val?'inline-block':'none';
  clearTimeout(logDebounceTimer);
  logDebounceTimer=setTimeout(function(){loadLog(1)},300);
}
function clearLogSearch(){document.getElementById('log-search').value='';document.getElementById('log-search-btn').style.display='none';loadLog(1)}

function toggleLogSort(){
  logSortOrder=logSortOrder==='desc'?'asc':'desc';
  loadLog(1);
}

function loadLog(page){
  page=page||1;
  switchPage('log');
  document.getElementById('log-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commits...</div>';
  document.getElementById('log-pagination').innerHTML='';
  var search=document.getElementById('log-search').value;
  var _lpv=document.getElementById('log-per-page').value;var perPage=_lpv===''?10:parseInt(_lpv);
  var url='/api/commits?page='+page+'&per_page='+perPage+'&order='+logSortOrder;
  if(search)url+='&search='+encodeURIComponent(search);
  apiGet(url,function(data){
    currentLogData=data;
    renderLog(data);
    renderPagination(data);
    if(data.commits&&data.commits.length)showToast('Loaded '+data.commits.length+' commit(s)','ok',2000);
  });
}

function renderLog(data){
  var container=document.getElementById('log-content');
  if(!data.commits||!data.commits.length){container.innerHTML='<div class="empty">'+t('no_match')+'</div>';return}
  var sortIcon=logSortOrder==='desc'?' ↓':' ↑';
  var sortTip=logSortOrder==='desc'?'Newest first — click for oldest first':'Oldest first — click for newest first';
  var html='<table class="log-table"><thead><tr>';
  html+='<th style="width:20px"></th>';
  html+='<th>Hash</th><th>Author</th>';
  html+='<th style="cursor:pointer;user-select:none;white-space:nowrap" onclick="toggleLogSort()" title="'+sortTip+'">Date'+sortIcon+'</th>';
  html+='<th>Message</th><th>Actions</th><th style="width:20px"></th>';
  html+='</tr></thead><tbody>';
  data.commits.forEach(function(c,idx){
    var checked=squashSelected[c.hash]?' checked':'';
    var isRoot=c.is_root?true:false;
    var cbDisabled=isRoot?' disabled title="'+(L==='zh'?'初始 commit 不可参与 Squash':'Initial commit cannot be squashed')+'"':'';
    var rootBadge=isRoot?'<span style="font-size:10px;background:#fef3c7;color:#92400e;border:1px solid #fcd34d;border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:middle">root</span>':'';
    html+='<tr style="cursor:pointer" onclick="toggleCommitDiff(\''+c.hash+'\','+idx+')"><td><input type="checkbox" class="squash-cb" data-hash="'+c.hash+'"'+checked+cbDisabled+' onclick="event.stopPropagation();toggleSquashSelect(this)"></td>';
    html+='<td><span class="log-hash" data-full="'+c.hash+'" onclick="event.stopPropagation();toggleHash(this)" title="Click to toggle full hash">'+c.short_hash+'</span></td>';
    html+='<td class="log-author">'+escapeHtml(c.author)+'</td>';
    html+='<td class="log-date">'+c.date+'</td>';
    html+='<td class="log-msg" title="'+escapeAttr(c.message)+'">'+escapeHtml(c.message)+rootBadge+'</td>';
    html+='<td class="log-actions">';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();showResetModal(\''+c.hash+'\',\''+c.short_hash+'\')">Reset</button>';
    html+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();showRevertModal(\''+c.hash+'\',\''+c.short_hash+'\')">Revert</button>';
    html+='</td>';
    html+='<td style="text-align:center"><span class="file-toggle" id="log-toggle-'+idx+'">▶</span></td>';
    html+='</tr>';
    html+='<tr id="commit-diff-row-'+idx+'" style="display:none"><td colspan="7" style="padding:0"><div id="commit-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto"></div></td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  updateSquashBar();
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
    // No structured diff, show raw
    var h='';
    for(var j=0;j<lines.length;j++)
      h+=diffLine(lines[j]);
    return h;
  }
  
  var html='';
  sections.forEach(function(sec, si){
    var fileId='diff-file-'+si+'-'+commitHash.substr(0,7);
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
      html+='<td class="log-msg" title="'+escapeAttr(c.message)+'">'+escapeHtml(c.message)+'</td>';
      html+='<td><button class="btn btn-sm btn-warning" onclick="event.stopPropagation();doRestoreFile(\''+escapeAttr(_restoreFile)+'\',\''+escapeAttr(c.hash)+'\',\''+escapeAttr(c.short_hash)+'\')">Restore to this</button></td>';
      html+='</tr>';
      html+='<tr id="restore-diff-row-'+idx+'" style="display:none"><td colspan="6" style="padding:0">';
      html+='<div id="restore-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto;background:#fafafa;border-top:1px solid #e5e7eb"></div>';
      html+='</td></tr>';
    });
    html+='</tbody></table>';
    container.innerHTML=html;
    var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
    var pag=document.getElementById('restore-pagination');
    if(totalPages<=1){pag.innerHTML='<span class="page-info">'+data.total+' commit(s) total</span>';return;}
    var phtml='<span class="page-info">'+data.total+' total</span>';
    for(var i=1;i<=totalPages;i++){var cl=(i===data.page)?' page-num active':' page-num';phtml+='<span class="'+cl+'" onclick="loadRestoreCommits('+i+')">'+i+'</span>';}
    pag.innerHTML=phtml;
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
    if(!search.trim()){
      _allBranchesCache=null;
      loadBranches(1);
      return;
    }
    if(_allBranchesCache){
      _renderFilteredBranches(search.trim().toLowerCase());
    }else{
      document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading all branches...</div>';
      apiGet('/api/branches?page=1&per_page=0',function(data){
        _allBranchesCache=data;
        _renderFilteredBranches(search.trim().toLowerCase());
      });
    }
  },200);
}

function _renderFilteredBranches(search){
  var data=_allBranchesCache;
  var allBranches=[];
  (data.local||[]).forEach(function(b){allBranches.push({name:b.name,date:b.date,ts:b.ts,type:'local'})});
  (data.remote||[]).forEach(function(b){allBranches.push({name:b.name,date:b.date,ts:b.ts,type:'remote'})});
  var filtered=allBranches.filter(function(b){return b.name.indexOf(search)>=0});
  filtered=_sortBranches(filtered);
  var container=document.getElementById('branches-content');
  if(!filtered.length){
    container.innerHTML='<div class="empty">No branches matching "'+escapeHtml(search)+'"</div>';
    document.getElementById('branches-pagination').innerHTML='<span class="page-info">0 results</span>';
    return;
  }
  var html=_branchSortHeader();
  html+='<div class="branch-list"><h3>Results for "'+escapeHtml(search)+'" ('+filtered.length+')</h3>';
  filtered.forEach(function(b){
    var isCur=b.name===data.current;
    var cls=isCur?' branch-item current':' branch-item';
    html+='<div class="'+cls+'">';
    html+='<span style="font-size:11px;padding:1px 6px;border-radius:99px;margin-right:6px;background:'+(b.type==='local'?'#dbeafe':'#e0f2fe')+';color:'+(b.type==='local'?'#1e40af':'#0369a1')+'">'+b.type+'</span>';
    html+='<span class="name">'+_highlightBranchMatch(escapeHtml(b.name),search)+'</span>';
    html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
    if(isCur){
      html+='<span style="display:inline-flex;align-items:center;justify-content:center;width:90px;padding:4px 0;border-radius:99px;font-size:12px;font-weight:700;letter-spacing:.3px;'
        +'background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;'
        +'box-shadow:0 0 0 2px rgba(99,102,241,.3),0 2px 8px rgba(29,78,216,.35)">✓ Current</span>';
    }else{
      html+='<div style="display:flex;gap:6px;flex-shrink:0">';
      html+='<button class="btn btn-sm" style="width:90px;background:#0ea5e9;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();openCompare(\''+escapeAttr(b.name)+'\',\''+(b.type==='local'?'local':'remote')+'\')">⚖️ Compare</button>';
      html+='<button class="btn btn-sm" style="width:90px;background:#f97316;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();mergeBranch(\''+escapeAttr(b.name)+'\')">⚡ Merge</button>';
      html+='<button class="btn btn-sm" style="width:90px;background:#6366f1;color:#fff;border:none;cursor:pointer;border-radius:6px;font-size:12px;font-weight:600;padding:5px 0" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">✅ Checkout</button>';
      html+='</div>';
    }
    html+='</div>';
  });
  html+='</div>';
  container.innerHTML=html;
  document.getElementById('branches-pagination').innerHTML='<span class="page-info">'+filtered.length+' match(es) for "'+escapeHtml(search)+'"</span>';
}

function _highlightBranchMatch(escaped,search){
  var lower=escaped.toLowerCase();
  var idx=lower.indexOf(search);
  if(idx<0)return escaped;
  return escaped.substr(0,idx)+'<mark>'+escaped.substr(idx,search.length)+'</mark>'+escaped.substr(idx+search.length);
}

function setBranchSearchTag(tag){
  var inp=document.getElementById('branch-search');
  inp.value=tag;
  document.getElementById('branch-search-clear').style.display='inline-block';
  _allBranchesCache=null;
  onBranchSearchInput();
}

function clearBranchSearch(){
  document.getElementById('branch-search').value='';
  document.getElementById('branch-search-clear').style.display='none';
  _allBranchesCache=null;
  loadBranches(1);
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
  var bar=document.getElementById('squash-bar');
  bar.style.display=Object.keys(squashSelected).length>=2?'flex':'none';
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
  if(cb.checked)squashSelected[hash]=true;else delete squashSelected[hash];
  updateSquashBar();
}
function cancelSquash(){squashSelected={};updateSquashBar();document.getElementById('squash-msg').value='';if(currentLogData)renderLog(currentLogData)}
// ═══════════ Protected Branch Guard ═══════════
var _PROTECTED_BRANCHES = ['develop','release','main','master'];
function _isProtectedBranch(name){
  if(!name) return false;
  var n = name.trim().toLowerCase();
  return _PROTECTED_BRANCHES.some(function(p){ return n === p || n.indexOf(p) === 0 || n.indexOf('/'+p) >= 0; });
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
  var hashes=[];
  if(currentLogData&&currentLogData.commits){currentLogData.commits.forEach(function(c){if(squashSelected[c.hash])hashes.push(c.hash)})}
  if(hashes.length<2)return;
  var fromHash=hashes[hashes.length-1],toHash=hashes[0];
  _warnProtectedThenDo('protected_branch_squash', function(){
    showModal('Squash',tf('squash_confirm',L,{n:hashes.length})+'<br>From: '+fromHash.substr(0,7)+' To: '+toHash.substr(0,7),'Squash',function(){
      apiPost('/api/squash',{from:fromHash,to:toHash,message:msg},function(data){
        if(data.ok){
          squashSelected={};loadLog(1);loadFiles();
          // Squash rewrites history — offer force push immediately
          doForcePush();
        }
        else addMsg(t('squash_fail')+(data.error||''),'error');
      });
    });
  });
}

function renderPagination(data){
  var pag=document.getElementById('log-pagination');
  var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
  if(totalPages<=1){pag.innerHTML='';return}
  var html='<span class="page-info">Total '+data.total+'</span>';
  for(var i=1;i<=totalPages;i++){var cls=(i===data.page)?' page-num active':' page-num';html+='<span class="'+cls+'" onclick="loadLog('+i+')">'+i+'</span>'}
  pag.innerHTML=html;
}

function showResetModal(hash,shortHash){
  showModalDouble('Reset to '+shortHash,t('reset_desc'),t('reset_soft'),function(){doReset(hash,'soft')},t('reset_hard'),function(){doReset(hash,'hard')});
}
function showRevertModal(hash,shortHash){
  showModal('Revert '+shortHash,t('revert_desc'),'Revert',function(){
    apiPost('/api/revert',{commit:hash},function(data){
      if(data.ok){addMsg(t('revert_ok'),'success');loadLog(1);loadFiles()}
      else addMsg(t('revert_fail')+(data.error||''),'error');
    });
  });
}
function doReset(hash,mode){
  apiPost('/api/reset',{commit:hash,mode:mode},function(data){
    if(data.ok){addMsg(tf('reset_ok',L,{mode:mode}),'success');loadLog(1);loadFiles();loadCurrentBranch()}
    else addMsg(t('reset_fail')+(data.error||''),'error');
  });
}
function abortMerge(){
  showModal(t('conflict_reset_title'),t('conflict_reset_desc'),'Reset',function(){
    apiPost('/api/abort',{},function(data){
      if(data.ok){addMsg(t('conflict_reset_ok'),'success');loadFiles();checkConflicts();loadLog(1)}
      else addMsg(t('no_conflict_abort')+(data.error||''),'info');
    });
  });
}

function showModalDouble(title,msg,btn1Label,btn1Cb,btn2Label,btn2Cb,btn1Class,btn2Class){
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var b1=document.createElement('button');b1.className='btn '+(btn1Class||'btn-warning');b1.textContent=btn1Label;b1.onclick=function(){var c=btn1Cb;closeModal();if(c)c()};
  var b2=document.createElement('button');b2.className='btn '+(btn2Class||'btn-secondary');b2.textContent=btn2Label;b2.onclick=function(){var c=btn2Cb;closeModal();if(c)c()};
  btnsDiv.appendChild(b2);btnsDiv.appendChild(b1);
  document.getElementById('modal-bg').classList.add('show');
}

// ═══════════ Conflicts page ═══════════
// conflict state: conflictChoices[filePath] = array of {type:'ours'|'theirs'|'manual'|null, content:string}, indexed by conflict block order
var conflictChoices = {};
var _conflictData = {}; // filePath -> {blocks, raw}

function loadConflicts(){
  switchPage('conflicts');
  apiGet('/api/conflicts',function(data){
    if(data.count===0){document.getElementById('conflicts-content').innerHTML='<div class="empty">🎉 '+t('no_conflict')+'</div>';return}
    var html='';
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
  });
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
  var blocks=data.blocks||[];
  var lang=_cfLang(filePath);
  var conflictCount=0;
  for(var b=0;b<blocks.length;b++) if(blocks[b].type==='conflict') conflictCount++;

  var html='';
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
      else if(choice&&choice.type==='manual'){resolvedCls=' resolved-manual';statusHtml='<span class="conflict-zone-status" style="color:#7c3aed;font-weight:600">✏️ Manual edit</span>';}

      var oursHL=_synHL(block.ours||'(empty)',lang);
      var theirsHL=_synHL(block.theirs||'(empty)',lang);
      var initContent=(choice&&choice.type==='manual')?choice.content:(block.ours||block.theirs||'');

      html+='<div class="conflict-zone'+resolvedCls+'" id="cf-block-'+fileIdx+'-'+ci+'">';
      html+='<div class="conflict-zone-header">';
      html+='<span class="conflict-zone-num">CONFLICT #'+(ci+1)+'</span>';
      html+=statusHtml;
      html+='</div>';
      // Resolved banner — visible when zone has resolved-* class
      var bannerText='';
      if(choice&&choice.type==='ours') bannerText='✅  CONFLICT RESOLVED — Using HEAD (Ours)';
      else if(choice&&choice.type==='theirs') bannerText='✅  CONFLICT RESOLVED — Using Theirs (Incoming)';
      else if(choice&&choice.type==='manual') bannerText='✅  CONFLICT RESOLVED — Custom Manual Edit';
      html+='<div class="cf-resolved-banner">'+escapeHtml(bannerText)+'</div>';
      html+='<div class="conflict-sides">';
      html+='<div class="conflict-side conflict-side-ours"><h4>⬅ HEAD &nbsp;<span style="font-weight:400;font-size:10px;opacity:.8">(your current branch)</span></h4><pre>'+oursHL+'</pre></div>';
      html+='<div class="conflict-side conflict-side-theirs"><h4>Incoming ➡ &nbsp;<span style="font-weight:400;font-size:10px;opacity:.8">(theirs / merging)</span></h4><pre>'+theirsHL+'</pre></div>';
      html+='</div>';
      html+='<div class="conflict-zone-actions">';
      html+='<button class="btn btn-sm btn-success" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'ours\')">✅ Use HEAD (Ours)</button>';
      html+='<button class="btn btn-sm btn-primary" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'theirs\')">🔵 Use Theirs</button>';
      html+='<button class="btn btn-sm btn-secondary" onclick="openManualEdit(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+')">✏️ Edit manually</button>';
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
  conflictChoices[filePath][ci]={type:side,content:side==='ours'?(block.ours||''):(block.theirs||'')};
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
        // This file is resolved but other conflict files remain — tell the user
        addMsg('✅ File resolved. Resolve remaining conflict files to commit.','success');
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
  // Detect if we're in a merge/rebase/cherry-pick state via the default msg hint
  var isMergeState=defaultMsg && (defaultMsg.indexOf('Merge')===0 || defaultMsg.indexOf('merge')!==-1 || defaultMsg.indexOf('cherry-pick')!==-1);
  var titleIcon=isMergeState?'🔀':'✅';
  var titleText=isMergeState?t('merge_all_resolved_title'):'All Conflicts Resolved!';
  var descText=isMergeState
    ? t('merge_all_resolved_desc')
    : 'All conflict files have been resolved and staged. Commit these changes now?';
  var bodyHtml=
    '<p style="margin:0 0 12px;color:#374151;font-size:13px">'+descText+'</p>'
    +'<label style="font-size:12px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px">'+t('commit_msg_label')+'</label>'
    +'<textarea id="merge-complete-msg" rows="4" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box">'+escapeHtml(defaultMsg)+'</textarea>';
  showModal(titleIcon+' '+titleText, bodyHtml, t('commit_now_btn'), function(){
    var msg=(document.getElementById('merge-complete-msg')||{value:''}).value.trim();
    if(!msg){addMsg('⚠️ '+t('enter_commit_msg_err'),'error');return;}
    apiPost('/api/complete-merge',{message:msg},function(data){
      if(data.ok){
        addMsg('✅ '+t('merge_commit_ok'),'success');
        loadLog(1);loadFiles();loadCurrentBranch();
        setTimeout(function(){
          showModalDouble(
            '🚀 '+t('push_after_merge_title'),
            t('push_after_merge_desc').replace('{branch}',escapeHtml(branchName)),
            t('push_now_btn'),
            function(){ doPush(); },
            t('push_later_btn'),
            null,
            'btn-success',
            'btn-secondary'
          );
        },400);
      }else{
        addMsg('❌ '+t('merge_commit_fail')+(data.error||''),'error');
      }
    });
  });
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
function resolveConflict(filePath,resolution,idx){apiPost('/api/resolve-conflict',{path:filePath,resolution:resolution},function(data){if(data.ok){resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved')+resolution,'success');loadConflicts();checkConflicts();loadFiles();if(data.all_resolved){setTimeout(function(){showMergeCommitDialog(data.default_msg||'');},500);}}else addMsg(t('op_failed_err')+(data.error||''),'error')})}
function resolveConflictCustom(filePath,fileIdx){
  var ta=document.getElementById('cf-raw-editor-'+fileIdx);
  if(!ta) return;
  apiPost('/api/resolve-conflict',{path:filePath,content:ta.value},function(data){
    if(data.ok){
      resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved_ok'),'success');loadConflicts();checkConflicts();loadFiles();
      if(data.all_resolved){setTimeout(function(){showMergeCommitDialog(data.default_msg||'');},500);}
      else addMsg('✅ File resolved. Resolve remaining conflict files to commit.','success');
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
  function finalize(){if(!failed)addMsg(selectAll?t('all_selected'):t('all_deselected'),'success');else addMsg(t('partial_fail'),'error');loadFiles()}
  for(var i=0;i<allCbs.length;i++){
    (function(cb,path){
      var action=selectAll?'add':'reset';
      if(selectAll)checkedPaths[path]=true;else delete checkedPaths[path];
      apiPost('/api/toggle',{path:path,action:action},function(data){if(!data.ok)failed=true;done++;if(done===total)finalize()});
    })(allCbs[i],allCbs[i].dataset.path);
  }
});

// ═══════════ Commit ═══════════
document.getElementById('commit-btn').addEventListener('click',function(){
  var msg=document.getElementById('msg-input').value.trim();
  if(!msg){addMsg(t('commit_msg_empty'),'error');return}
  var cbs=document.querySelectorAll('.file-cb:checked'),paths=[];
  for(var i=0;i<cbs.length;i++)paths.push(cbs[i].dataset.path);
  if(!paths.length){addMsg(t('select_at_least_one'),'error');return}
  _warnProtectedThenDo('protected_branch_commit', function(){
    showModal(t('confirm_commit_title'),
      'Commit message: <b>'+escapeHtml(msg)+'</b><br><br>Files:<br>'+paths.map(escapeHtml).join('<br>'),
      'Confirm Commit',
      function(){
      addMsg(t('stashing_pulling'),'info');
      apiPost('/api/stash',{},function(stashData){
        if(!stashData.ok){addMsg(t('stash_failed')+(stashData.error||''),'error');return}
        apiPost('/api/pull',{mode:'merge'},function(pullData){
          if(!pullData.ok){
            addMsg(t('pull_fail')+(pullData.error||''),'error');
            checkConflicts();
            apiPost('/api/stash-pop',{index:0},function(){loadFiles()});
            return;
          }
          addMsg(t('pull_ok_pop'),'info');
          apiPost('/api/stash-pop',{index:0},function(popData){
            if(!popData.ok){
              addMsg(t('stash_conflict'),'error');
              checkConflicts();
              loadFiles();
              return;
            }
            loadFiles();
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
        });
      });
    }); // close showModal
  }); // end _warnProtectedThenDo
}); // close addEventListener

// ═══════════ Reset all ═══════════
document.getElementById('reset-btn').addEventListener('click',function(){
  var allCbs=document.querySelectorAll('.file-cb'),failed=false,done=0;
  for(var i=0;i<allCbs.length;i++){
    apiPost('/api/toggle',{path:allCbs[i].dataset.path,action:'reset'},function(data){if(!data.ok)failed=true;done++;if(done===allCbs.length){checkedPaths={};if(!failed){addMsg(t('all_deselected'),'success');loadFiles()}else addMsg(t('partial_fail'),'error')}});
  }
});

// ═══════════ Init ═══════════
loadCurrentBranch();
loadProjectName();
// Restore last active tab
(function(){
  var saved=null;
  try{saved=localStorage.getItem('git_tool_active_tab');}catch(e){}
  var safeTabs={main:1,branches:1,log:1,stash:1,conflicts:1};
  if(saved&&safeTabs[saved]){
    switchPage(saved);
    if(saved==='branches')loadBranches(1);
    else if(saved==='log')loadLog(1);
    else if(saved==='stash')loadStash();
    else if(saved==='conflicts'){loadFiles();checkConflicts();}
    else{loadFiles();checkConflicts();}
  }else{
    loadFiles();
    checkConflicts();
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
