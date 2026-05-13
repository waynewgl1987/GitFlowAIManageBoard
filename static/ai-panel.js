// ═══════════════════════════════════════════════════════════════════════════
// ai-panel.js — AI Git Assistant panel + provider selector for Git Manage Board
// Completely decoupled submodule: no hard dependencies on app.js internals.
// Uses: /api/ai/copilot-models  /api/ai/test-provider  /api/ai/chat  /api/ai/chat-status
// ═══════════════════════════════════════════════════════════════════════════

// ── Provider definitions ──────────────────────────────────────────────────
var AI_PROVIDERS = {
  copilot:   { name:'GitHub Copilot', baseUrl:'https://api.githubcopilot.com',                         needsKey:false, hint:'🔐 Uses your Copilot CLI session — no API key needed.',  models:[] },
  openai:    { name:'OpenAI',         baseUrl:'https://api.openai.com/v1',                             needsKey:true,  hint:'',  models:['gpt-4.1','gpt-4.1-mini','gpt-4o','gpt-4o-mini','gpt-3.5-turbo','o1-mini'] },
  anthropic: { name:'Anthropic',      baseUrl:'https://api.anthropic.com',                             needsKey:true,  hint:'',  models:['claude-sonnet-4.6','claude-opus-4.7','claude-opus-4.5','claude-haiku-4.5','claude-sonnet-4.5'] },
  deepseek:  { name:'DeepSeek',       baseUrl:'https://api.deepseek.com/v1',                           needsKey:true,  hint:'',  models:['deepseek-chat','deepseek-coder','deepseek-reasoner'] },
  qwen:      { name:'Qwen',           baseUrl:'https://dashscope.aliyuncs.com/compatible-mode/v1',     needsKey:true,  hint:'',  models:['qwen-max','qwen2.5-coder-32b-instruct','qwen-plus','qwen-turbo'] },
  ollama:    { name:'Ollama (Local)', baseUrl:'http://localhost:11434/v1',                              needsKey:false, hint:'🔓 Ollama runs locally — no API key required.', models:['codellama','llama3','mistral','deepseek-coder-v2','qwen2.5-coder'] },
  custom:    { name:'Custom',         baseUrl:'',                                                       needsKey:true,  hint:'',  models:[] },
};

// ── Persisted config ──────────────────────────────────────────────────────
var _aiCfg = (function(){ try{ return JSON.parse(localStorage.getItem('git-ai-cfg')||'{}'); }catch(e){ return {}; } })();

function _saveAiCfg() {
  try { localStorage.setItem('git-ai-cfg', JSON.stringify(_aiCfg)); } catch(e) {}
}

function getAIConfig() {
  return {
    provider: _aiCfg.provider || 'copilot',
    api_key:  _aiCfg.api_key  || '',
    base_url: _aiCfg.base_url || AI_PROVIDERS.copilot.baseUrl,
    model:    _aiCfg.model    || 'claude-sonnet-4.6',
  };
}

// ── Chat history ──────────────────────────────────────────────────────────
var _aiHistory = []; // {role, content, ts}

// ── Panel toggle ──────────────────────────────────────────────────────────
function toggleAIChatPanel() {
  var panel = document.getElementById('ai-chat-panel');
  var fab   = document.getElementById('ai-fab');
  if (!panel) return;
  var isOpen = panel.classList.toggle('open');
  if (fab) {
    fab.classList.toggle('active', isOpen);
    fab.classList.toggle('panel-open', isOpen);
  }
  if (isOpen) {
    _updateAIBadge();
    var inp = document.getElementById('ai-chat-input');
    if (inp) inp.focus();
  }
}

function closeAIChatPanel() {
  var panel = document.getElementById('ai-chat-panel');
  var fab   = document.getElementById('ai-fab');
  if (panel) panel.classList.remove('open');
  if (fab) { fab.classList.remove('active'); fab.classList.remove('panel-open'); }
}

// ── Badge (provider/model shown in panel header) ──────────────────────────
function _updateAIBadge() {
  var cfg = getAIConfig();
  var fullText = (AI_PROVIDERS[cfg.provider]?.name || cfg.provider) + ' · ' + cfg.model;
  var el = document.getElementById('ai-header-model');
  var infoBtn = document.getElementById('ai-header-model-info');
  if (el) {
    el.textContent = fullText;
    el.title = fullText;
    // Show info icon if text overflows (checked after next paint)
    if (infoBtn) {
      requestAnimationFrame(function() {
        var overflows = el.scrollWidth > el.offsetWidth + 2;
        infoBtn.style.display = overflows ? '' : 'none';
      });
    }
  }
}

function showAIModelNamePopover() {
  var cfg = getAIConfig();
  var fullText = (AI_PROVIDERS[cfg.provider]?.name || cfg.provider) + ' · ' + cfg.model;
  if (typeof showModal === 'function') {
    showModal('🤖 Current AI Model',
      '<div style="font-size:14px;word-break:break-all;line-height:1.7"><b>Provider:</b> '
      + (AI_PROVIDERS[cfg.provider]?.name || cfg.provider)
      + '<br><b>Model:</b> ' + cfg.model + '</div>',
      null, null);
  }
}

// ── Provider modal ────────────────────────────────────────────────────────
function openAIProviderModal() {
  var modal = document.getElementById('ai-provider-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  _buildProviderTabs();
  var cfg = getAIConfig();
  _selectAIProvider(cfg.provider, true);
  document.getElementById('ai-api-key').value    = cfg.api_key  || '';
  document.getElementById('ai-base-url').value   = cfg.base_url || '';
  document.getElementById('ai-model-custom').value = '';
  document.getElementById('ai-test-status').textContent = '';
}

function closeAIProviderModal() {
  var modal = document.getElementById('ai-provider-modal');
  if (modal) modal.style.display = 'none';
}

function _buildProviderTabs() {
  var el = document.getElementById('ai-provider-tabs');
  if (!el) return;
  el.innerHTML = Object.entries(AI_PROVIDERS).map(function(pair) {
    var k = pair[0], v = pair[1];
    return '<button class="ai-ptab' + (_aiCfg.provider === k ? ' active' : '') + '" onclick="_selectAIProvider(\'' + k + '\')">' + v.name + '</button>';
  }).join('');
}

function _selectAIProvider(key, silent) {
  _aiCfg.provider = key;
  var p = AI_PROVIDERS[key];
  if (!p) return;

  // Tab highlight
  document.querySelectorAll('.ai-ptab').forEach(function(b) {
    b.classList.toggle('active', b.textContent.trim() === p.name);
  });

  // Base URL
  document.getElementById('ai-base-url').value = _aiCfg.base_url || p.baseUrl;

  // Key field visibility
  var keyWrap = document.getElementById('ai-key-wrap');
  if (keyWrap) keyWrap.style.display = p.needsKey ? '' : 'none';

  // Hint
  var hint = document.getElementById('ai-key-hint');
  if (hint) {
    hint.style.display = p.hint ? '' : 'none';
    hint.textContent = p.hint;
  }

  // Model dropdown
  var sel = document.getElementById('ai-model-sel');
  if (key === 'copilot') {
    var FALLBACK = [
      // Claude
      'claude-sonnet-4.6','claude-opus-4.7','claude-opus-4.6','claude-opus-4.5','claude-sonnet-4.5','claude-haiku-4.5',
      // GPT-5 series
      'gpt-5.4','gpt-5.3-codex','gpt-5.2-codex','gpt-5.2','gpt-5.4-mini','gpt-5.4-nano','gpt-5-mini',
      // GPT-4 series
      'gpt-4.1','gpt-4.1-2025-04-14','gpt-4o','gpt-4o-mini',
      // Other
      'gemini-2.5-pro','grok-code-fast-1',
    ];
    sel.innerHTML = '<option value="">⏳ Loading…</option>';
    fetch('/api/ai/copilot-models')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var models = (data.models && data.models.length) ? data.models : FALLBACK;
        sel.innerHTML = models.map(function(m){ return '<option value="' + m + '">' + m + '</option>'; }).join('');
        var saved = _aiCfg.model || 'claude-sonnet-4.6';
        if (models.indexOf(saved) >= 0) sel.value = saved;
      })
      .catch(function(){
        sel.innerHTML = FALLBACK.map(function(m){ return '<option value="' + m + '">' + m + '</option>'; }).join('');
      });
  } else {
    sel.innerHTML = p.models.map(function(m){ return '<option value="' + m + '">' + m + '</option>'; }).join('') || '<option value="">— enter below —</option>';
    var saved = _aiCfg.model;
    if (saved && p.models.indexOf(saved) >= 0) sel.value = saved;
  }
  if (!silent) document.getElementById('ai-model-custom').value = '';
}

function testAIProvider() {
  var statusEl = document.getElementById('ai-test-status');
  var provider = _aiCfg.provider || 'copilot';
  var pDef = AI_PROVIDERS[provider] || {};
  var api_key  = (document.getElementById('ai-api-key')?.value || '').trim();
  var base_url = (document.getElementById('ai-base-url')?.value || '').trim();
  var model    = (document.getElementById('ai-model-custom')?.value || '').trim()
               || document.getElementById('ai-model-sel')?.value || '';

  if (pDef.needsKey && !api_key) {
    if (statusEl) { statusEl.textContent = '❌ API key required for ' + (pDef.name || provider); statusEl.style.color = '#ef4444'; }
    return;
  }
  if (provider === 'custom' && !(base_url || '').trim()) {
    if (statusEl) { statusEl.textContent = '❌ Base URL required for Custom provider'; statusEl.style.color = '#ef4444'; }
    return;
  }

  if (statusEl) { statusEl.textContent = '🔄 Testing…'; statusEl.style.color = '#6b7280'; }

  fetch('/api/ai/test-provider', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ provider: provider, api_key: api_key, base_url: base_url, model: model }),
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if (statusEl) {
      statusEl.textContent = data.ok ? ('✅ ' + (data.message || 'Connected')) : ('❌ ' + (data.error || 'Failed'));
      statusEl.style.color = data.ok ? '#10b981' : '#ef4444';
    }
  })
  .catch(function(e){
    if (statusEl) { statusEl.textContent = '❌ Network error: ' + e.message; statusEl.style.color = '#ef4444'; }
  });
}

function saveAIProvider() {
  var provider = _aiCfg.provider || 'copilot';
  var api_key  = (document.getElementById('ai-api-key')?.value || '').trim();
  var base_url = (document.getElementById('ai-base-url')?.value || '').trim();
  var model    = (document.getElementById('ai-model-custom')?.value || '').trim()
               || document.getElementById('ai-model-sel')?.value || 'claude-sonnet-4.6';
  _aiCfg = { provider: provider, api_key: api_key, base_url: base_url, model: model };
  _saveAiCfg();
  _updateAIBadge();
  closeAIProviderModal();
  _appendSysMsg('✅ Provider saved: ' + (AI_PROVIDERS[provider]?.name || provider) + ' · ' + model);
}

// ── Chat rendering ────────────────────────────────────────────────────────
function _renderMarkdown(text) {
  // Minimal markdown: code blocks, inline code, bold
  return text
    .replace(/```([\s\S]*?)```/g, function(_, code){ return '<pre>' + _escHtml(code.trim()) + '</pre>'; })
    .replace(/`([^`]+)`/g, function(_, c){ return '<code>' + _escHtml(c) + '</code>'; })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function _escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _appendMsg(role, content, meta) {
  _aiHistory.push({ role: role, content: content });
  var hist = document.getElementById('ai-chat-history');
  if (!hist) return;
  var div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  var bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  if (role === 'assistant') {
    bubble.innerHTML = _renderMarkdown(content);
  } else if (role === 'system') {
    bubble.textContent = content;
  } else {
    bubble.textContent = content;
  }
  div.appendChild(bubble);
  if (meta) {
    var m = document.createElement('div');
    m.className = 'ai-meta';
    m.textContent = meta;
    div.appendChild(m);
  }
  hist.appendChild(div);
  hist.scrollTop = hist.scrollHeight;
}

function _appendSysMsg(text) {
  _appendMsg('system', text);
}

function _showThinking() {
  var hist = document.getElementById('ai-chat-history');
  if (!hist) return null;
  var div = document.createElement('div');
  div.className = 'ai-msg assistant';
  div.id = 'ai-thinking-indicator';
  div.innerHTML = '<div class="ai-thinking"><div class="ai-dots"><span></span><span></span><span></span></div><span>Thinking…</span></div>';
  hist.appendChild(div);
  hist.scrollTop = hist.scrollHeight;
  return div;
}

function _removeThinking() {
  var el = document.getElementById('ai-thinking-indicator');
  if (el) el.remove();
}

// ── Send message ──────────────────────────────────────────────────────────
function sendAIMessage() {
  var inp = document.getElementById('ai-chat-input');
  if (!inp) return;
  var text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  inp.style.height = '';
  _sendToAI(text);
}

function _sendToAI(userText, systemExtra) {
  var cfg = getAIConfig();
  _appendMsg('user', userText);

  var sendBtn = document.getElementById('ai-send-btn');
  if (sendBtn) sendBtn.disabled = true;
  _showThinking();

  // Gather live page context, then send
  _gatherPageContext(function(freshCtx) {
    var systemPrompt = _buildSystemPrompt(freshCtx) + (systemExtra || '');
    var messages = [{ role: 'system', content: systemPrompt }];

    // Include last 10 turns of history (excluding current)
    var history = _aiHistory.slice(0, -1).slice(-10);
    for (var i = 0; i < history.length; i++) {
      var h = history[i];
      if (h.role === 'user' || h.role === 'assistant') {
        messages.push({ role: h.role, content: h.content });
      }
    }
    messages.push({ role: 'user', content: userText });

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: cfg.provider,
        api_key:  cfg.api_key,
        base_url: cfg.base_url,
        model:    cfg.model,
        messages: messages,
      }),
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.ok) {
        _removeThinking();
        _appendMsg('assistant', '❌ Error: ' + (data.error || 'Unknown error'));
        if (sendBtn) sendBtn.disabled = false;
        return;
      }
      _pollChatJob(data.jobId, sendBtn);
    })
    .catch(function(e){
      _removeThinking();
      _appendMsg('assistant', '❌ Network error: ' + e.message);
      if (sendBtn) sendBtn.disabled = false;
    });
  });
}

function _pollChatJob(jobId, sendBtn) {
  fetch('/api/ai/chat-status?jobId=' + jobId)
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.done) {
        setTimeout(function(){ _pollChatJob(jobId, sendBtn); }, 800);
        return;
      }
      _removeThinking();
      if (sendBtn) sendBtn.disabled = false;
      var cfg = getAIConfig();
      var meta = (AI_PROVIDERS[cfg.provider]?.name || cfg.provider) + ' · ' + cfg.model;
      if (data.ok) {
        _appendMsg('assistant', data.text, meta);
      } else {
        _appendMsg('assistant', '❌ ' + (data.error || 'LLM call failed'), meta);
      }
    })
    .catch(function(){
      setTimeout(function(){ _pollChatJob(jobId, sendBtn); }, 1200);
    });
}

// ── System prompt (context-aware) ────────────────────────────────────────
function _buildSystemPrompt(freshCtx) {
  var branch      = (document.getElementById('branch-name')       || {}).textContent || 'unknown';
  var activePage  = (document.querySelector('.page.active')        || {}).id || '';
  var projectName = (document.getElementById('project-banner-name')|| {}).textContent || '';
  var remote      = (document.getElementById('project-banner-remote')|| {}).textContent || '';

  var ctx = 'You are an expert Git assistant embedded in a Git management board.\n';
  ctx += 'Project: ' + projectName + '\n';
  ctx += 'Remote: '  + remote      + '\n';
  ctx += 'Current branch: ' + branch + '\n';
  ctx += 'Current page: '   + activePage + '\n';
  ctx += 'Respond concisely and in the same language the user writes in.\n';
  ctx += 'When showing code or git commands, use markdown code blocks.\n';
  ctx += 'Focus on practical, actionable advice.\n';

  // ── Rendered DOM content of the active page ──
  var pageEl = document.getElementById(activePage);
  if (pageEl) {
    var domText = (pageEl.innerText || '').trim();
    if (domText) {
      ctx += '\n--- CURRENT PAGE CONTENT (' + activePage + ') ---\n';
      ctx += domText.slice(0, 2500) + '\n';
    }
  }

  // ── Fresh API data (pre-fetched async) ──
  if (freshCtx) ctx += freshCtx;

  // ── Conflict data (structured) ──
  if (activePage === 'page-conflicts' && typeof _conflictData !== 'undefined') {
    var files = Object.keys(_conflictData);
    if (files.length > 0) {
      ctx += '\n--- ACTIVE CONFLICTS ---\n';
      ctx += 'Conflicting files: ' + files.join(', ') + '\n';
      files.slice(0, 3).forEach(function(fp) {
        var d = _conflictData[fp];
        if (!d || !d.blocks) return;
        var cblocks = d.blocks.filter(function(b){ return b.type === 'conflict'; });
        if (cblocks.length === 0) return;
        ctx += '\nFile: ' + fp + ' (' + cblocks.length + ' conflict(s))\n';
        cblocks.slice(0, 3).forEach(function(b, i) {
          ctx += 'Conflict #' + (i+1) + ':\n<<<<<<< HEAD (ours)\n' + (b.ours||'') + '\n=======\n' + (b.theirs||'') + '\n>>>>>>> (theirs)\n';
        });
      });
    }
  }

  return ctx;
}

// ── Async page-context collector ──────────────────────────────────────────
function _gatherPageContext(cb) {
  var activePage = (document.querySelector('.page.active') || {}).id || '';
  var pending = 0;
  var ctx = '';

  function done() { if (--pending <= 0) cb(ctx); }

  // Always fetch current git status
  pending++;
  fetch('/api/files')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var files = data.files || [];
      if (files.length) {
        ctx += '\n--- GIT STATUS (live) ---\n';
        ctx += files.map(function(f){ return (f.status||'?') + '  ' + f.path; }).join('\n') + '\n';
      }
      done();
    })
    .catch(done);

  // Fetch stash list if on stash page
  if (activePage === 'page-stash') {
    pending++;
    fetch('/api/stash')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var list = data.stash || [];
        if (list.length) {
          ctx += '\n--- STASH LIST ---\n';
          ctx += list.slice(0,10).map(function(s){ return s.ref + ': ' + s.message; }).join('\n') + '\n';
        }
        done();
      })
      .catch(done);
  }

  // Fetch conflict list if on conflicts page
  if (activePage === 'page-conflicts') {
    pending++;
    fetch('/api/conflicts')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var cfiles = data.files || [];
        if (cfiles.length) {
          ctx += '\n--- CONFLICT FILES ---\n' + cfiles.join('\n') + '\n';
        }
        done();
      })
      .catch(done);
  }

  // If nothing pending, return immediately
  if (pending === 0) cb(ctx);
}

// ── Quick actions ─────────────────────────────────────────────────────────
function aiQuickAction(action) {
  var branch = (document.getElementById('branch-name') || {}).textContent || 'unknown';
  var activePage = (document.querySelector('.page.active') || {}).id || '';

  if (action === 'analyze-conflicts') {
    if (typeof _conflictData === 'undefined' || Object.keys(_conflictData).length === 0) {
      // Try to fetch conflict list first
      fetch('/api/conflicts')
        .then(function(r){ return r.json(); })
        .then(function(data){
          if (!data.count) {
            _appendSysMsg('✅ No conflicts found in the current repository.');
          } else {
            _sendToAI('Please analyze the current git conflicts and suggest the best resolution strategy for each one. Explain the differences between the ours (HEAD) and theirs (incoming) sides.');
          }
        });
    } else {
      _sendToAI('Please analyze all the current git conflicts shown in the context. For each conflict, explain what changed on each side and recommend the best resolution strategy.');
    }

  } else if (action === 'accept-ours') {
    _confirmConflictAction(
      '⬅️ Accept All Ours (HEAD)',
      '⚠️ <b>This will overwrite ALL conflicts</b> in every conflicted file with your local HEAD version.<br><br>'
      + '• The incoming (theirs) changes will be <b>discarded entirely</b><br>'
      + '• All conflicted files will be staged automatically<br>'
      + '• This action <b>cannot be undone</b> without resetting<br><br>'
      + 'Are you sure you want to accept ALL ours?',
      function(){ _acceptAllConflicts('ours'); }
    );

  } else if (action === 'accept-theirs') {
    _confirmConflictAction(
      '➡️ Accept All Theirs (Incoming)',
      '⚠️ <b>This will overwrite ALL conflicts</b> in every conflicted file with the incoming version.<br><br>'
      + '• Your local HEAD changes in conflicts will be <b>discarded entirely</b><br>'
      + '• All conflicted files will be staged automatically<br>'
      + '• This action <b>cannot be undone</b> without resetting<br><br>'
      + 'Are you sure you want to accept ALL theirs?',
      function(){ _acceptAllConflicts('theirs'); }
    );

  } else if (action === 'accept-both') {
    _confirmConflictAction(
      '🔀 Accept Both (Ours + Theirs)',
      '⚠️ <b>This will merge ALL conflicts</b> by keeping both sides for every conflicted file.<br><br>'
      + '• HEAD (ours) content will appear <b>first</b>, followed by incoming (theirs)<br>'
      + '• You may need to review the result for logical correctness<br>'
      + '• All conflicted files will be staged automatically<br><br>'
      + 'Are you sure you want to keep both sides for ALL conflicts?',
      function(){ _acceptAllConflicts('both'); }
    );

  } else if (action === 'analyze-branch') {
    _sendToAI('Analyze the current state of branch "' + branch + '". What is the typical purpose of this branch in a gitflow workflow? What should I be careful about when working here?');

  } else if (action === 'suggest-commit') {
    // Fetch uncommitted changes and ask for commit message
    fetch('/api/files')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var files = (data.files || []).map(function(f){ return (f.status || '?') + ' ' + f.path; }).join('\n');
        _sendToAI('Based on these changed files, suggest a concise and descriptive git commit message following conventional commits format:\n\n' + (files || '(no files listed)'));
      })
      .catch(function(){
        _sendToAI('Suggest a git commit message for my current staged changes.');
      });

  } else if (action === 'git-status') {
    fetch('/api/files')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var files = (data.files || []);
        if (!files.length) {
          _appendSysMsg('✅ Working tree is clean — no uncommitted changes.');
        } else {
          var summary = files.map(function(f){ return (f.status||'?') + '  ' + f.path; }).join('\n');
          _sendToAI('Explain this git status output and tell me what actions I should take:\n\n' + summary);
        }
      });

  } else if (action === 'explain-diff') {
    _sendToAI('Explain what has changed in the current branch compared to the base branch, and summarize the impact of these changes.');
  }
}

// ── One-click resolve all conflicts (ours or theirs) ─────────────────────
function _confirmConflictAction(title, bodyHtml, onConfirm) {
  if (typeof showModal === 'function') {
    showModal(
      title,
      '<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px 14px;font-size:13px;line-height:1.7;color:#374151">'
      + bodyHtml + '</div>',
      '✅ Yes, Proceed',
      onConfirm
    );
  } else {
    if (confirm(title + '\n\n(See UI for details)')) onConfirm();
  }
}

function _acceptAllConflicts(side) {
  fetch('/api/conflicts')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var files = data.files || [];
      if (!files.length) {
        _appendSysMsg('✅ No conflicts to resolve.');
        return;
      }
      var sideLabel = side === 'ours' ? '⬅️ HEAD (ours)' : side === 'theirs' ? '➡️ Theirs (incoming)' : '🔀 Both';
      _appendSysMsg('⏳ Resolving ' + files.length + ' file(s) using ' + sideLabel + '…');
      var resolution = side === 'both' ? 'both' : side;
      var promises = files.map(function(fp){
        return fetch('/api/resolve-conflict', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ path: fp, resolution: resolution }),
        }).then(function(r){ return r.json(); });
      });
      Promise.all(promises).then(function(results){
        var ok = results.filter(function(r){ return r.ok; }).length;
        var fail = results.length - ok;
        _appendSysMsg('✅ Resolved ' + ok + '/' + files.length + ' file(s)' + (fail ? ' (' + fail + ' failed)' : '') + '.');

        // Refresh conflict tab badge (doesn't switch page)
        if (typeof checkConflicts === 'function') checkConflicts();

        // Only reload conflict list if user is already on the conflicts page
        var activePage = (document.querySelector('.page.active') || {}).id;
        if (activePage === 'page-conflicts' && typeof loadConflicts === 'function') loadConflicts();
        if (typeof loadFiles === 'function') loadFiles();

        // If all resolved, show commit+push dialog after a short delay
        var allResolved = results.some(function(r){ return r.all_resolved; });
        if (allResolved) {
          var defaultMsg = (results.find(function(r){ return r.default_msg; }) || {}).default_msg || '';
          setTimeout(function(){
            if (typeof showMergeCommitDialog === 'function') showMergeCommitDialog(defaultMsg);
          }, 400);
        }
      });
    })
    .catch(function(e){ _appendSysMsg('❌ Failed to fetch conflicts: ' + e.message); });
}

// ── Per-conflict AI analyze button (called from app.js) ──────────────────
function aiAnalyzeConflictBlock(filePath, blockIdx) {
  var data = (typeof _conflictData !== 'undefined') ? _conflictData[filePath] : null;
  if (!data || !data.blocks) {
    _appendSysMsg('⚠️ Conflict data not loaded. Please expand the file first.');
    if (!document.getElementById('ai-chat-panel').classList.contains('open')) toggleAIChatPanel();
    return;
  }
  var cblocks = data.blocks.filter(function(b){ return b.type === 'conflict'; });
  var block = cblocks[blockIdx];
  if (!block) {
    _appendSysMsg('⚠️ Conflict block #' + (blockIdx+1) + ' not found.');
    return;
  }
  if (!document.getElementById('ai-chat-panel').classList.contains('open')) toggleAIChatPanel();
  var prompt = 'Analyze this specific conflict in file "' + filePath + '" (conflict #' + (blockIdx+1) + '):\n\n'
    + '<<<<<<< HEAD (my current branch)\n' + (block.ours || '(empty)') + '\n'
    + '=======\n' + (block.theirs || '(empty)') + '\n'
    + '>>>>>>> (incoming)\n\n'
    + 'Which version should I keep, and why? Provide the recommended final code.';
  _sendToAI(prompt);
}

// ── Keyboard shortcut: Enter to send ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('ai-chat-input');
  if (inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIMessage();
      }
    });
    // Auto-resize textarea
    inp.addEventListener('input', function() {
      this.style.height = '';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
  }
  _updateAIBadge();
  // Show welcome message
  _appendSysMsg('👋 AI Git Assistant ready. Ask anything about your git repo, or use the quick actions below.');
});
