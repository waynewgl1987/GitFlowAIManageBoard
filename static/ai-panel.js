// ═══════════════════════════════════════════════════════════════════════════
// ai-panel.js — AI Git Assistant panel + provider selector for Git Manage Board
// Completely decoupled submodule: no hard dependencies on app.js internals.
// Uses: /api/ai/test-provider  /api/ai/chat  /api/ai/chat-status
// ═══════════════════════════════════════════════════════════════════════════

var _t = typeof t === 'function' ? t : function(k) { return k; };
var _tf = typeof tf === 'function' ? tf : function(k, l, r) { return _t(k, l); };

// ── Provider definitions ──────────────────────────────────────────────────
var AI_PROVIDERS = {
  openai:    { name:'OpenAI',         baseUrl:'https://api.openai.com/v1',                             needsKey:true,  hint:'',  models:['gpt-4.1','gpt-4.1-mini','gpt-4o','gpt-4o-mini','gpt-3.5-turbo','o1-mini'] },
  anthropic: { name:'Anthropic',      baseUrl:'https://api.anthropic.com',                             needsKey:true,  hint:'',  models:['claude-sonnet-4.6','claude-opus-4.7','claude-opus-4.5','claude-haiku-4.5','claude-sonnet-4.5'] },
  deepseek:  { name:'DeepSeek',       baseUrl:'https://api.deepseek.com/v1',                           needsKey:true,  hint:'',  models:['deepseek-chat','deepseek-coder','deepseek-reasoner'] },
  qwen:      { name:'Qwen',           baseUrl:'https://dashscope.aliyuncs.com/compatible-mode/v1',     needsKey:true,  hint:'',  models:['qwen-max','qwen2.5-coder-32b-instruct','qwen-plus','qwen-turbo'] },
  ollama:    { name:'Ollama (Local)', baseUrl:'http://localhost:11434/v1',                              needsKey:false, hint:'🔓 Ollama runs locally — no API key required.', models:['codellama','llama3','mistral','deepseek-coder-v2','qwen2.5-coder'] },
  custom:    { name:'Custom',         baseUrl:'',                                                       needsKey:true,  hint:'',  models:[] },
};

// ── Persisted config ──────────────────────────────────────────────────────
var _aiCfg = (function(){ try{ return JSON.parse(localStorage.getItem('git-ai-cfg')||'{}'); }catch(e){ return {}; } })();

// Migrate old single-provider format → new per-provider format
if (_aiCfg.provider && !_aiCfg.providers) {
  var old = _aiCfg;
  _aiCfg = { active: old.provider, panelWidth: old.panelWidth, providers: {} };
  _aiCfg.providers[old.provider] = {
    api_key: old.api_key || '',
    base_url: old.base_url || '',
    model: old.model || ''
  };
}
if (!_aiCfg.active) _aiCfg.active = 'openai';
if (!_aiCfg.providers) _aiCfg.providers = {};

function _saveAiCfg() {
  try { localStorage.setItem('git-ai-cfg', JSON.stringify(_aiCfg)); } catch(e) {}
}

function _getProviderCfg(provider) {
  provider = provider || _aiCfg.active || 'openai';
  var pDef = AI_PROVIDERS[provider] || {};
  var saved = _aiCfg.providers[provider] || {};
  return {
    api_key: saved.api_key != null ? saved.api_key : '',
    base_url: saved.base_url || pDef.baseUrl || '',
    model: saved.model || (pDef.models && pDef.models[0]) || ''
  };
}

function getAIConfig() {
  var active = _aiCfg.active || 'openai';
  var pDef = AI_PROVIDERS[active] || {};
  var saved = _aiCfg.providers[active] || {};
  return {
    provider: active,
    api_key: saved.api_key != null ? saved.api_key : '',
    base_url: saved.base_url || pDef.baseUrl || '',
    model: saved.model || (pDef.models && pDef.models[0]) || 'claude-sonnet-4.6',
  };
}

// ── Chat history ──────────────────────────────────────────────────────────
var _aiHistory = []; // {role, content, ts}

// ── Panel toggle ──────────────────────────────────────────────────────────
function toggleAIChatPanel() {
  var panel = document.getElementById('ai-chat-panel');
  var fabWrap = document.getElementById('ai-fab-wrap');
  var fab   = document.getElementById('ai-fab');
  if (!panel) return;
  var isOpen = panel.classList.toggle('open');
  if (fab) {
    fab.classList.toggle('active', isOpen);
  }
  if (fabWrap) {
    if (isOpen) {
      _applyPanelWidth(_getPanelWidth());
    } else {
      fabWrap.style.right = '';
    }
  }
  if (isOpen) {
    _updateAIBadge();
    var inp = document.getElementById('ai-chat-input');
    if (inp) inp.focus();
  }
}

function closeAIChatPanel() {
  var panel = document.getElementById('ai-chat-panel');
  var fabWrap = document.getElementById('ai-fab-wrap');
  var fab   = document.getElementById('ai-fab');
  if (panel) panel.classList.remove('open');
  if (fab) {
    fab.classList.remove('active');
  }
  if (fabWrap) fabWrap.style.right = '';
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
    showModal(t('ai_model_title'),
      '<div style="font-size:14px;word-break:break-all;line-height:1.7"><b>' + t('ai_provider_label') + '</b> '
      + (AI_PROVIDERS[cfg.provider]?.name || cfg.provider)
      + '<br><b>' + t('ai_model_label') + '</b> ' + cfg.model + '</div>',
      null, null);
  }
}

// ── Provider modal ────────────────────────────────────────────────────────
function openAIProviderModal() {
  var modal = document.getElementById('ai-provider-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  _buildProviderTabs();
  _selectAIProvider(_aiCfg.active, true);
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
    return '<button class="ai-ptab' + (_aiCfg.active === k ? ' active' : '') + '" onclick="_selectAIProvider(\'' + k + '\')">' + v.name + '</button>';
  }).join('');
}

function _selectAIProvider(key, silent) {
  _aiCfg.active = key;
  _saveAiCfg();
  var p = AI_PROVIDERS[key];
  if (!p) return;

  // Tab highlight
  document.querySelectorAll('.ai-ptab').forEach(function(b) {
    b.classList.toggle('active', b.textContent.trim() === p.name);
  });

  // Load provider-specific config
  var cfg = _getProviderCfg(key);

  // API Key
  var apiKeyEl = document.getElementById('ai-api-key');
  if (apiKeyEl) apiKeyEl.value = cfg.api_key || '';

  // Base URL
  document.getElementById('ai-base-url').value = cfg.base_url || p.baseUrl;

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
  var customEl = document.getElementById('ai-model-custom');
  var model = cfg.model || '';

  sel.innerHTML = p.models.map(function(m){ return '<option value="' + m + '">' + m + '</option>'; }).join('') || '<option value="">— enter below —</option>';
  if (model && p.models.indexOf(model) >= 0) {
    sel.value = model;
    if (customEl) customEl.value = '';
  } else if (model) {
    sel.value = '';
    if (customEl) customEl.value = model;
  } else {
    sel.value = p.models[0] || '';
    if (customEl) customEl.value = '';
  }
}

function testAIProvider() {
  var statusEl = document.getElementById('ai-test-status');
  var provider = _aiCfg.active || 'openai';
  var pDef = AI_PROVIDERS[provider] || {};
  var api_key  = (document.getElementById('ai-api-key')?.value || '').trim();
  var base_url = (document.getElementById('ai-base-url')?.value || '').trim();
  var model    = (document.getElementById('ai-model-custom')?.value || '').trim()
               || document.getElementById('ai-model-sel')?.value || '';

  if (pDef.needsKey && !api_key) {
    if (statusEl) { statusEl.textContent = t('ai_key_required') + (pDef.name || provider); statusEl.style.color = '#ef4444'; }
    return;
  }
  if (provider === 'custom' && !(base_url || '').trim()) {
    if (statusEl) { statusEl.textContent = t('ai_base_url_required'); statusEl.style.color = '#ef4444'; }
    return;
  }

  if (statusEl) { statusEl.textContent = t('ai_testing'); statusEl.style.color = '#6b7280'; }

  fetch('/api/ai/test-provider', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ provider: provider, api_key: api_key, base_url: base_url, model: model }),
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if (statusEl) {
      statusEl.textContent = data.ok ? (t('ai_connected')) : (t('ai_error') + (data.error || t('ai_unknown_error')));
      statusEl.style.color = data.ok ? '#10b981' : '#ef4444';
    }
  })
  .catch(function(e){
    if (statusEl) { statusEl.textContent = t('ai_network_error') + e.message; statusEl.style.color = '#ef4444'; }
  });
}

function saveAIProvider() {
  var provider = _aiCfg.active || 'openai';
  var api_key  = (document.getElementById('ai-api-key')?.value || '').trim();
  var base_url = (document.getElementById('ai-base-url')?.value || '').trim();
  var model    = (document.getElementById('ai-model-custom')?.value || '').trim()
               || document.getElementById('ai-model-sel')?.value || 'claude-sonnet-4.6';
  _aiCfg.providers[provider] = { api_key: api_key, base_url: base_url, model: model };
  _saveAiCfg();
  _updateAIBadge();
  closeAIProviderModal();
  _appendSysMsg(t('ai_provider_saved') + (AI_PROVIDERS[provider]?.name || provider) + ' · ' + model);
}

// ── Chat rendering ────────────────────────────────────────────────────────
function _renderMarkdown(text, fileLang) {
  // Code blocks with syntax highlighting — process line-by-line to avoid comment early-exit bug
  var result = text.replace(/```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g, function(_, fence, code) {
    var lang = (fence || fileLang || '').toLowerCase().trim();
    var langMap = { javascript:'js', typescript:'ts', python:'py', python3:'py', golang:'go',
      kotlin:'kt', ruby:'rb', rust:'rust', shell:'sh', bash:'sh', zsh:'sh',
      'c++':'c', 'c#':'cs', html:'html', css:'css', json:'json', jsx:'js', tsx:'ts' };
    var normLang = langMap[lang] || lang;
    var isDark = _diffTheme !== 'light';
    // Highlight line by line so comment early-exit doesn't kill subsequent lines
    var codeHtml = code.trim().split('\n').map(function(line) {
      return _syntaxHighlight(line, normLang, isDark) || _escHtml(line);
    }).join('\n');
    var langLabel = normLang ? '<span class="code-block-lang">' + _escHtml(normLang) + '</span>' : '';
    return '<pre>'
      + (langLabel ? '<span class="code-block-header">' + langLabel + '</span>' : '')
      + '<span class="code-block-body">' + codeHtml + '</span>'
      + '</pre>';
  });
  // Inline code
  result = result.replace(/`([^`]+)`/g, function(_, c) { return '<code>' + _escHtml(c) + '</code>'; });
  // Bold
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Headings
  result = result
    .replace(/^### (.+)$/gm, '<strong style="font-size:12px;display:block;margin:10px 0 3px;color:#4338ca">$1</strong>')
    .replace(/^## (.+)$/gm, '<strong style="font-size:13px;display:block;margin:12px 0 4px;color:#3730a3">$1</strong>')
    .replace(/^# (.+)$/gm, '<strong style="font-size:14px;display:block;margin:14px 0 5px;color:#312e81">$1</strong>');
  // Lists
  result = result
    .replace(/^(\d+)\. (.+)$/gm, '<div style="margin:2px 0 2px 14px;font-size:12px">$1. $2</div>')
    .replace(/^[-*] (.+)$/gm, '<div style="margin:2px 0 2px 10px;font-size:12px">• $1</div>');
  // Newlines
  result = result.replace(/\n/g, '<br>');
  return result;
}

function _escHtml(s) {
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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

function _appendErrorMsg(role, content, meta, originalPrompt) {
  _aiHistory.push({ role: role, content: content });
  var hist = document.getElementById('ai-chat-history');
  if (!hist) return;
  var div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  var bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.textContent = content;
  div.appendChild(bubble);
  if (meta) {
    var m = document.createElement('div');
    m.className = 'ai-meta';
    m.textContent = meta;
    div.appendChild(m);
  }
  // Add copy/retry actions if there's an original prompt
  if (originalPrompt) {
    var tFn = typeof t === 'function' ? t : function(k) { return k; };
    var actions = document.createElement('div');
    actions.className = 'ai-error-actions';
    var copyBtn = document.createElement('button');
    copyBtn.className = 'ai-error-action-btn';
    copyBtn.textContent = tFn('err_copy_prompt');
    copyBtn.onclick = (function(text) { return function() {
      navigator.clipboard.writeText(text).then(function() {
        copyBtn.textContent = tFn('err_copied');
        setTimeout(function() { copyBtn.textContent = tFn('err_copy_prompt'); }, 1800);
      }).catch(function() {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = tFn('err_copied');
        setTimeout(function() { copyBtn.textContent = tFn('err_copy_prompt'); }, 1800);
      });
    }; })(originalPrompt);
    var retryBtn = document.createElement('button');
    retryBtn.className = 'ai-error-action-btn ai-error-action-btn--retry';
    retryBtn.textContent = tFn('err_retry');
    retryBtn.onclick = (function(text) { return function() {
      div.remove();
      _sendToAI(text);
    }; })(originalPrompt);
    actions.appendChild(copyBtn);
    actions.appendChild(retryBtn);
    div.appendChild(actions);
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
  div.innerHTML = '<div class="ai-thinking"><div class="ai-dots"><span></span><span></span><span></span></div><span>' + t('ai_thinking') + '</span></div>';
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
        _appendErrorMsg('assistant', t('ai_error') + (data.error || t('ai_unknown_error')), null, userText);
        if (sendBtn) sendBtn.disabled = false;
        return;
      }
      _pollChatJob(data.jobId, sendBtn, userText);
    })
    .catch(function(e){
      _removeThinking();
      _appendErrorMsg('assistant', t('ai_network_error') + e.message, null, userText);
      if (sendBtn) sendBtn.disabled = false;
    });
  });
}

function _pollChatJob(jobId, sendBtn, userText) {
  fetch('/api/ai/chat-status?jobId=' + jobId)
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.done) {
        setTimeout(function(){ _pollChatJob(jobId, sendBtn, userText); }, 800);
        return;
      }
      _removeThinking();
      if (sendBtn) sendBtn.disabled = false;
      var cfg = getAIConfig();
      var meta = (AI_PROVIDERS[cfg.provider]?.name || cfg.provider) + ' · ' + cfg.model;
      if (data.ok) {
        _appendMsg('assistant', data.text, meta);
      } else {
        _appendErrorMsg('assistant', '❌ ' + (data.error || t('ai_llm_failed')), meta, userText);
      }
    })
    .catch(function(){
      setTimeout(function(){ _pollChatJob(jobId, sendBtn, userText); }, 1200);
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
            _appendSysMsg(t('ai_no_conflicts'));
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
          _appendSysMsg(t('ai_clean_tree'));
        } else {
          var summary = files.map(function(f){ return (f.status||'?') + '  ' + f.path; }).join('\n');
          _sendToAI('Explain this git status output and tell me what actions I should take:\n\n' + summary);
        }
      });

  } else if (action === 'explain-diff') {
    _sendToAI('Explain what has changed in the current branch compared to the base branch, and summarize the impact of these changes.');

  } else if (action === 'recent-commits') {
    fetch('/api/commits?page=1&per_page=7')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var commits = data.commits || [];
        if (!commits.length) {
          _appendSysMsg(t('ai_no_commits'));
        } else {
          var summary = commits.map(function(c){
            return '• ' + (c.short_hash || c.hash || '?') + '  ' + (c.message || '') + '  (' + (c.author || '') + ', ' + (c.date || '') + ')';
          }).join('\n');
          _sendToAI('Here are the most recent commits on this branch:\n\n' + summary + '\n\nBriefly summarize what was recently worked on. Highlight any patterns, risks, or things I should be aware of.');
        }
      })
      .catch(function(){
        _sendToAI('Summarize the recent git commit history for this branch and identify any patterns or concerns.');
      });

  } else if (action === 'stash-help') {
    fetch('/api/stash')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var list = data.stash || [];
        if (!list.length) {
          _appendSysMsg(t('ai_stash_empty'));
        } else {
          var summary = list.slice(0, 8).map(function(s){ return '• ' + s.ref + ': ' + s.message; }).join('\n');
          _sendToAI('I have these stashed changes:\n\n' + summary + '\n\nExplain what each stash is likely for, and recommend which ones I should apply, drop, or keep. Give me the git commands to manage them.');
        }
      })
      .catch(function(){
        _sendToAI('Explain how git stash works and when I should use it vs. creating a branch.');
      });

  } else if (action === 'clean-branch') {
    _sendToAI('Based on my current branch "' + branch + '" and the current git status, what should I clean up? Suggest any untracked files to add to .gitignore, stale local branches to delete, or other housekeeping. Provide the exact git commands.');

  } else if (action === 'abort-merge') {
    _confirmConflictAction(
      '🛑 Abort Merge / Rebase',
      '⚠️ <b>This will abort the current merge/rebase/cherry-pick</b> and reset to the state before it started.<br><br>'
      + '• Your working tree changes will be <b>preserved</b><br>'
      + '• Conflict markers will be removed<br>'
      + '• You will return to the previous branch tip<br><br>'
      + 'Are you sure you want to abort?',
      function(){
        fetch('/api/abort', { method: 'POST', headers: {'Content-Type':'application/json'}, body: '{}' })
          .then(function(r){ return r.json(); })
          .then(function(data){
            if (data.ok) {
              _appendSysMsg(t('ai_merge_aborted'));
              if (typeof checkConflicts === 'function') checkConflicts();
              if (typeof loadFiles === 'function') loadFiles();
            } else {
              _appendSysMsg(t('ai_abort_failed') + (data.error || t('ai_no_merge')));
            }
          })
          .catch(function(e){ _appendSysMsg('❌ Network error: ' + e.message); });
      }
    );
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
        _appendSysMsg(t('ai_no_conflicts_resolve'));
        return;
      }
      var sideLabel = side === 'ours' ? '⬅️ HEAD (ours)' : side === 'theirs' ? '➡️ Theirs (incoming)' : '🔀 Both';
      _appendSysMsg(tf('ai_resolving', null, {n: files.length}) + sideLabel + '…');
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
        var msg = tf('ai_resolved', null, {ok: ok, total: files.length});
        if (fail) {
          msg += tf('ai_skipped', null, {skip: fail});
          // Show per-file errors so users know why structured files were skipped
          for (var ri = 0; ri < results.length; ri++) {
            if (!results[ri].ok && results[ri].error) {
              _appendSysMsg('⚠️ ' + files[ri] + ': ' + results[ri].error.split('.')[0] + '.');
            }
          }
        }
        _appendSysMsg(msg + '.');

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
    _appendSysMsg(t('ai_conflict_not_loaded'));
    if (!document.getElementById('ai-chat-panel').classList.contains('open')) toggleAIChatPanel();
    return;
  }
  var cblocks = data.blocks.filter(function(b){ return b.type === 'conflict'; });
  var block = cblocks[blockIdx];
  if (!block) {
    _appendSysMsg(tf('ai_conflict_block_not_found', null, {idx: blockIdx+1}));
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

// ── Panel width & resize ──────────────────────────────────────────────────
var _DEFAULT_PANEL_WIDTH = 972;
var _currentDiffData = null; // {commit, short_hash, author, date, message, files, total_added, total_removed}
var _diffTheme = localStorage.getItem('diff-theme') || 'dark';
var _analyzingIdx = null;   // index of file currently being analyzed
var _analyzedIdx = null;    // index of the last completed analysis

function _getPanelWidth() {
  return parseInt(_aiCfg.panelWidth) || _DEFAULT_PANEL_WIDTH;
}

function _applyPanelWidth(w) {
  var panel = document.getElementById('ai-chat-panel');
  if (!panel) return;
  var maxW = window.innerWidth - 60;
  var clamped = Math.max(320, Math.min(parseInt(w) || _DEFAULT_PANEL_WIDTH, maxW));
  panel.style.width = clamped + 'px';
  var fabWrap = document.getElementById('ai-fab-wrap');
  if (fabWrap && panel.classList.contains('open')) {
    fabWrap.style.right = (clamped + 12) + 'px';
  }
}

function _setPanelWidth(w, save) {
  var maxW = window.innerWidth - 60;
  var clamped = Math.max(320, Math.min(parseInt(w) || _DEFAULT_PANEL_WIDTH, maxW));
  if (save) {
    _aiCfg.panelWidth = clamped;
    _saveAiCfg();
  }
  _applyPanelWidth(clamped);
  var inp = document.getElementById('ai-width-input');
  if (inp) inp.value = clamped;
}

function onWidthInputChange(val) {
  _setPanelWidth(parseInt(val) || _DEFAULT_PANEL_WIDTH, true);
}

function initPanelResize() {
  var panel = document.getElementById('ai-chat-panel');
  var handle = document.getElementById('ai-resize-handle');
  if (!panel || !handle) return;

  _setPanelWidth(_getPanelWidth(), false);

  var dragging = false;
  handle.addEventListener('mousedown', function(e) {
    dragging = true;
    handle.classList.add('dragging');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var w = window.innerWidth - e.clientX;
    _applyPanelWidth(w);
    var inp = document.getElementById('ai-width-input');
    var maxW = window.innerWidth - 60;
    if (inp) inp.value = Math.max(320, Math.min(parseInt(w), maxW));
  });
  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    var p = document.getElementById('ai-chat-panel');
    if (p) {
      var w = parseInt(p.style.width) || _DEFAULT_PANEL_WIDTH;
      _aiCfg.panelWidth = w;
      _saveAiCfg();
    }
  });
  window.addEventListener('resize', function() {
    _setPanelWidth(_getPanelWidth(), false);
  });
}

// ── Mode switching (chat / diff) ──────────────────────────────────────────
var _aiCurrentMode = 'chat';

function switchAIMode(mode) {
  _aiCurrentMode = mode;
  var chatBody = document.getElementById('ai-chat-body');
  var diffWrap = document.getElementById('diff-viewer-wrap');
  var tabChat  = document.getElementById('ai-tab-chat');
  var tabDiff  = document.getElementById('ai-tab-diff');

  if (mode === 'diff') {
    if (chatBody) chatBody.style.display = 'none';
    if (diffWrap) { diffWrap.style.display = 'flex'; diffWrap.style.flexDirection = 'column'; }
    if (tabChat) tabChat.classList.remove('active');
    if (tabDiff) tabDiff.classList.add('active');
  } else {
    if (chatBody) chatBody.style.display = 'flex';
    if (diffWrap) diffWrap.style.display = 'none';
    if (tabChat) tabChat.classList.add('active');
    if (tabDiff) tabDiff.classList.remove('active');
  }
}

// ── Commit diff loader ────────────────────────────────────────────────────
function loadLatestCommitDiff() {
  var infoEl = document.getElementById('diff-commit-info');
  var filesEl = document.getElementById('diff-files-pane');
  var analyzeAllBtn = document.getElementById('diff-analyze-all-btn');
  if (infoEl) infoEl.innerHTML = '<span style="color:#6b7280;font-size:12px">⏳ ' + t('ai_diff_loading') + '</span>';
  if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state"><div class="diff-loading-dots"><span></span><span></span><span></span></div>' + t('ai_diff_fetching') + '</div>';
  if (analyzeAllBtn) analyzeAllBtn.style.display = 'none';

  fetch('/api/latest-commit-diff')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.ok) {
        _currentDiffData = null;
        if (infoEl) infoEl.innerHTML = '<span style="color:#ef4444;font-size:12px">❌ ' + _escHtml(data.error || t('ai_diff_fail_load')) + '</span>';
        if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state" style="color:#ef4444">' + t('ai_diff_fail_load') + '</div>';
        return;
      }
      _currentDiffData = data;
      _analyzingIdx = null;
      _analyzedIdx = null;
      _renderDiffCommitInfo(data);
      _renderDiffFileSections(data);
      closeDiffAnalysisPane();
      if (analyzeAllBtn) analyzeAllBtn.style.display = '';
    })
    .catch(function(e) {
      _currentDiffData = null;
      if (infoEl) infoEl.innerHTML = '<span style="color:#ef4444;font-size:12px">❌ ' + t('ai_diff_network_error') + '</span>';
      if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state" style="color:#ef4444">' + t('ai_diff_network_error') + ': ' + _escHtml(e.message) + '</div>';
    });
}

function _renderDiffCommitInfo(data) {
  var el = document.getElementById('diff-commit-info');
  if (!el) return;
  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
    + '<span class="diff-commit-hash">' + _escHtml(data.short_hash || (data.commit || '').slice(0,7)) + '</span>'
    + '<span class="diff-commit-msg">' + _escHtml(data.message || '') + '</span>'
    + '</div>'
    + '<div class="diff-commit-meta">'
    + _escHtml(data.author || '') + ' · ' + _escHtml(data.date || '')
    + ' · <span class="diff-stat-add">+' + (data.total_added || 0) + '</span>'
    + ' <span class="diff-stat-del">-' + (data.total_removed || 0) + '</span>'
    + ' · ' + (data.files ? data.files.length : 0) + ' file(s)'
    + '</div>';
}

function _renderDiffFileSections(data) {
  var el = document.getElementById('diff-files-pane');
  if (!el) return;
  if (!data.files || !data.files.length) {
    el.innerHTML = '<div class="diff-empty-state">' + t('ai_diff_empty_commit') + '</div>';
    _applyDiffTheme();
    _refreshFileHistBtns();
    return;
  }
  el.innerHTML = '';
  // Use DocumentFragment + createElement to avoid innerHTML parsing issues
  var frag = document.createDocumentFragment();
  data.files.forEach(function(file, idx) {
    var section = document.createElement('div');
    section.className = 'diff-file-section';
    section.id = 'diff-file-section-' + idx;

    // ── Header ──────────────────────────────────────────────────
    var header = document.createElement('div');
    header.className = 'diff-file-header';
    header.addEventListener('click', (function(i) {
      return function() { toggleDiffSection(i); };
    })(idx));

    var chevron = document.createElement('span');
    chevron.className = 'diff-file-chevron';
    chevron.id = 'diff-chevron-' + idx;
    chevron.textContent = '▶';

    var pathSpan = document.createElement('span');
    pathSpan.className = 'diff-file-path';
    pathSpan.title = file.path || '';
    pathSpan.textContent = file.path || '(unknown)';

    var statsSpan = document.createElement('span');
    statsSpan.className = 'diff-file-stats';
    if (file.added) {
      var addSpan = document.createElement('span');
      addSpan.className = 'diff-stat-add';
      addSpan.textContent = '+' + file.added;
      statsSpan.appendChild(addSpan);
      statsSpan.appendChild(document.createTextNode(' '));
    }
    if (file.removed) {
      var delSpan = document.createElement('span');
      delSpan.className = 'diff-stat-del';
      delSpan.textContent = '-' + file.removed;
      statsSpan.appendChild(delSpan);
    }

    var actions = document.createElement('div');
    actions.className = 'diff-file-actions';
    actions.addEventListener('click', function(e) { e.stopPropagation(); });

    var analyzeBtn = document.createElement('button');
    analyzeBtn.className = 'diff-file-btn';
    analyzeBtn.id = 'diff-analyze-btn-' + idx;
    analyzeBtn.textContent = t('ai_analyze_btn');
    analyzeBtn.addEventListener('click', (function(i) {
      return function() { analyzeSingleFileDiff(i); };
    })(idx));

    var histBtn = document.createElement('button');
    histBtn.className = 'diff-file-btn hist-btn';
    histBtn.id = 'diff-hist-btn-' + idx;
    histBtn.textContent = '📋';
    histBtn.style.display = 'none';
    histBtn.addEventListener('click', (function(i) {
      return function() { openFileHistory(i); };
    })(idx));

    var tabBtn = document.createElement('button');
    tabBtn.className = 'diff-file-btn tab-btn';
    tabBtn.textContent = t('ai_tab_btn');
    tabBtn.addEventListener('click', (function(i) {
      return function() { openDiffInTab(i); };
    })(idx));

    actions.appendChild(analyzeBtn);
    actions.appendChild(histBtn);
    actions.appendChild(tabBtn);

    header.appendChild(chevron);
    header.appendChild(pathSpan);
    header.appendChild(statsSpan);
    header.appendChild(actions);

    // ── Diff content (lazy-rendered on first expand) ─────────────
    var content = document.createElement('div');
    content.className = 'diff-file-content';
    content.id = 'diff-file-content-' + idx;
    content.style.display = 'none';
    content.dataset.rendered = '0';

    section.appendChild(header);
    section.appendChild(content);
    frag.appendChild(section);
  });
  el.appendChild(frag);
  _applyDiffTheme();
  _refreshFileHistBtns();
}

function toggleDiffSection(idx) {
  var content = document.getElementById('diff-file-content-' + idx);
  var chevron = document.getElementById('diff-chevron-' + idx);
  var section = document.getElementById('diff-file-section-' + idx);
  if (!content) return;
  var isOpen = content.style.display !== 'none';
  if (!isOpen && content.getAttribute('data-rendered') === '0') {
    // Lazy-render diff code on first open
    var file = _currentDiffData && _currentDiffData.files && _currentDiffData.files[idx];
    if (file) {
      content.innerHTML = _renderDiffCode(file.diff, file.path);
      content.setAttribute('data-rendered', '1');
      _applyDiffTheme();
    }
  }
  content.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(90deg)';
  if (section) section.classList.toggle('open', !isOpen);
}

// ── Syntax Highlighter ────────────────────────────────────────────────────
var _LANG_KW = {
  js:  'async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return static super switch this throw try typeof var void while with yield true false null undefined NaN Infinity',
  ts:  'async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return static super switch this throw try typeof var void while with yield true false null undefined NaN Infinity abstract any as declare enum implements interface keyof namespace never readonly type unknown infer',
  py:  'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield True False None',
  swift: 'as associativity break case catch class continue default defer deinit didSet do else enum extension fallthrough false fileprivate final for func get guard if import in infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol public rethrows return right self Self set some static struct subscript super switch throw throws true try typealias unowned var weak where while willSet',
  go:  'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var true false nil',
  java:'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws transient try var void volatile while true false',
  kt:  'abstract actual annotation as break by catch class companion const constructor continue crossinline data do dynamic else enum expect external final finally for fun if in infix init inline inner interface internal is it lateinit noinline null object open operator out override package private protected public reified return sealed super suspend tailrec this throw true try typealias typeof val var vararg when where while',
  rb:  'BEGIN END alias and begin break case class def defined? do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield',
  rust:'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return Self self static struct super trait true type union unsafe use where while',
  c:   'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while true false NULL nullptr',
  css: 'important',
  sh:  'if then else elif fi for do done while until case esac function in select break continue return exit export local readonly unset echo printf',
};
var _EXT_LANG = {
  js:'js', ts:'ts', jsx:'js', tsx:'ts', mjs:'js', cjs:'js',
  py:'py', pyw:'py', swift:'swift', go:'go',
  java:'java', kt:'kt', kts:'kt', rb:'rb', rs:'rust',
  c:'c', h:'c', cpp:'c', cc:'c', cxx:'c', hpp:'c',
  css:'css', scss:'css', less:'css', sh:'sh', bash:'sh', zsh:'sh',
};

function _detectLang(filePath) {
  if (!filePath) return '';
  var ext = (filePath.split('.').pop() || '').toLowerCase();
  return _EXT_LANG[ext] || '';
}

function _syntaxHighlight(rawText, lang, isDark) {
  if (!rawText || !lang) return _escHtml(rawText);
  var kwStr = _LANG_KW[lang];
  if (!kwStr) return _escHtml(rawText);
  // Skip highlighting for very long lines (minified code) to avoid performance issues
  if (rawText.length > 500) return _escHtml(rawText);

  var C = isDark ? {
    kw: '#569cd6', str: '#ce9178', cmt: '#6a9955', num: '#b5cea8',
    type: '#4ec9b0', fn: '#dcdcaa', prop: '#9cdcfe', dec: '#c586c0', op: '#d4d4d4'
  } : {
    kw: '#9b2393', str: '#c41a16', cmt: '#5c6e74', num: '#1c00cf',
    type: '#3a60a0', fn: '#5c1a8a', prop: '#0b4f79', dec: '#826900', op: '#555555'
  };

  var kwSet = {};
  kwStr.split(' ').forEach(function(k) { if (k) kwSet[k] = true; });

  var cmtStart = { js:'//','ts':'//','go':'//','java':'//','kt':'//','swift':'//','c':'//','rust':'//','py':'#','rb':'#','sh':'#','css':'/*' };
  var lineComment = cmtStart[lang] || null;

  var rules = [];
  if (lineComment === '//') {
    rules.push({ re: /\/\/[^\n]*/, type: 'cmt' });
    rules.push({ re: /\/\*[\s\S]*?\*\//, type: 'cmt' });
  } else if (lineComment === '#') {
    rules.push({ re: /#[^\n]*/, type: 'cmt' });
  } else if (lineComment === '/*') {
    rules.push({ re: /\/\*[\s\S]*?\*\//, type: 'cmt' });
  }
  rules.push({ re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/, type: 'str' });
  rules.push({ re: /\b0x[0-9a-fA-F]+[uUlL]*\b|\b\d+\.?\d*(?:[eE][+-]?\d+)?[fFdDlL]?\b/, type: 'num' });
  rules.push({ re: /@[a-zA-Z_]\w*/, type: 'dec' });
  rules.push({ re: /[a-zA-Z_$][a-zA-Z0-9_$]*/, type: 'ident' });

  var text = rawText;
  var len = text.length;
  var result = '';
  var pos = 0;

  while (pos < len) {
    var best = null, bestIdx = len, bestType = '';
    for (var r = 0; r < rules.length; r++) {
      var reSource = rules[r].re.source;
      var re = new RegExp(reSource, 'g');
      re.lastIndex = 0;
      var sub = text.slice(pos);
      var m = re.exec(sub);
      if (m && (pos + m.index) < bestIdx) {
        best = m; bestIdx = pos + m.index; bestType = rules[r].type;
      }
    }
    if (!best) { result += _escHtml(text.slice(pos)); break; }
    if (bestIdx > pos) result += _escHtml(text.slice(pos, bestIdx));
    var matchText = best[0];
    var color = null;
    if (bestType === 'cmt') color = C.cmt;
    else if (bestType === 'str') color = C.str;
    else if (bestType === 'num') color = C.num;
    else if (bestType === 'dec') color = C.dec;
    else if (bestType === 'ident') {
      if (kwSet[matchText]) color = C.kw;
      else if (/^[A-Z]/.test(matchText)) color = C.type;
      else if (text.slice(bestIdx + matchText.length).match(/^\s*\(/)) color = C.fn;
      else if (bestIdx > 0 && text[bestIdx - 1] === '.') color = C.prop;
    }
    if (color) result += '<span style="color:' + color + '">' + _escHtml(matchText) + '</span>';
    else result += _escHtml(matchText);
    pos = bestIdx + matchText.length;
    if (bestType === 'cmt') { result += _escHtml(text.slice(pos)); break; }
  }
  return result;
}

function _renderDiffCode(diffText, filePath) {
  if (!diffText) return '<div style="color:#6b7280;padding:8px;font-size:11px">No diff content</div>';
  var lang = _detectLang(filePath || '');
  var isDark = _diffTheme !== 'light';
  var lines = diffText.split('\n');
  var html = '<div class="diff-code-block">';
  var lineNum = { old: 0, new: 0 };

  lines.forEach(function(line) {
    var cls = 'context';
    var numDisplay = '';

    if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++')) {
      cls = 'file-header';
    } else if (line.startsWith('@@')) {
      cls = 'hunk';
      var m = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (m) { lineNum.old = parseInt(m[1]) - 1; lineNum.new = parseInt(m[2]) - 1; }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      cls = 'add'; lineNum.new++; numDisplay = lineNum.new;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      cls = 'del'; lineNum.old++; numDisplay = lineNum.old;
    } else if (!line.startsWith('diff') && !line.startsWith('index') && !line.startsWith('---') && !line.startsWith('+++')) {
      lineNum.old++; lineNum.new++; numDisplay = lineNum.new;
    }

    var contentHtml;
    if (lang && (cls === 'add' || cls === 'del' || cls === 'context')) {
      var pfx = (cls === 'add' || cls === 'del') ? line[0] : '';
      var codeText = pfx ? line.slice(1) : line;
      contentHtml = (pfx ? _escHtml(pfx) : '') + _syntaxHighlight(codeText, lang, isDark);
    } else {
      contentHtml = _escHtml(line);
    }

    html += '<div class="diff-line ' + cls + '">'
      + '<span class="diff-line-num">' + (numDisplay || '') + '</span>'
      + '<span class="diff-line-content">' + contentHtml + '</span>'
      + '</div>';
  });

  html += '</div>';
  return html;
}

// ── Diff AI analysis ──────────────────────────────────────────────────────
var _diffAnalysisHistory = []; // [{key, title, text, ts}]
var _progressTimerID = null;
var _progressStart = 0;
var _currentAnalysis = null; // {title, text, lang, reBtn} — for theme re-render

function _startProgressTimer(contentEl) {
  _stopProgressTimer();
  _progressStart = Date.now();
  _progressTimerID = setInterval(function() {
    var sec = Math.floor((Date.now() - _progressStart) / 1000);
    var timerEl = contentEl && contentEl.querySelector('.progress-timer');
    if (timerEl) timerEl.textContent = sec + 's';
  }, 1000);
}

function _stopProgressTimer() {
  if (_progressTimerID) { clearInterval(_progressTimerID); _progressTimerID = null; }
}

function _analysisThinkingHTML(msg) {
  return '<div class="diff-analysis-thinking">'
    + '<div class="progress-row">'
    + '<div class="ai-dots"><span></span><span></span><span></span></div>'
    + '<span class="progress-text">' + msg + '</span>'
    + '<span class="progress-timer">0s</span>'
    + '</div>'
    + '<div class="diff-analysis-progress-bar"><div class="diff-analysis-progress-fill"></div></div>'
    + '</div>';
}

function _setAnalyzingFile(idx) {
  _analyzingIdx = idx;
  document.querySelectorAll('.diff-file-section').forEach(function(s) {
    s.classList.remove('analyzing', 'analyzed');
  });
  if (idx !== null && idx !== undefined) {
    var sec = document.getElementById('diff-file-section-' + idx);
    if (sec) sec.classList.add('analyzing');
  }
}

function _restoreAnalyzeStates() {
  document.querySelectorAll('.diff-file-section').forEach(function(s) {
    s.classList.remove('analyzing', 'analyzed');
  });
  if (_analyzingIdx !== null && _analyzingIdx !== undefined) {
    var sec = document.getElementById('diff-file-section-' + _analyzingIdx);
    if (sec) sec.classList.add('analyzing');
  } else if (_analyzedIdx !== null && _analyzedIdx !== undefined) {
    var sec2 = document.getElementById('diff-file-section-' + _analyzedIdx);
    if (sec2) sec2.classList.add('analyzed');
  }
}

function showDiffAnalysisPane(title, html) {
  var pane = document.getElementById('diff-analysis-pane');
  var titleEl = document.getElementById('diff-analysis-title');
  var contentEl = document.getElementById('diff-analysis-content');
  if (!pane || !contentEl) return;
  if (titleEl) titleEl.textContent = '🤖 ' + title;
  contentEl.innerHTML = html;
  pane.style.display = 'flex';
  pane.style.flexDirection = 'column';
}

function closeDiffAnalysisPane() {
  var pane = document.getElementById('diff-analysis-pane');
  if (pane) pane.style.display = 'none';
  _stopProgressTimer();
  document.querySelectorAll('.diff-file-section').forEach(function(s) {
    s.classList.remove('analyzing', 'analyzed');
  });
}

function _saveAnalysisHistory(key, title, text) {
  // keep max 20 entries, newest first
  _diffAnalysisHistory.unshift({
    key: key, title: title, text: text,
    ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
  if (_diffAnalysisHistory.length > 20) _diffAnalysisHistory.pop();
  _refreshFileHistBtns();
}

function _refreshFileHistBtns() {
  if (!_currentDiffData || !_currentDiffData.files) return;
  _currentDiffData.files.forEach(function(file, idx) {
    var btn = document.getElementById('diff-hist-btn-' + idx);
    if (!btn) return;
    var hasHistory = _diffAnalysisHistory.some(function(entry) { return entry.key === file.path; });
    btn.style.display = hasHistory ? '' : 'none';
  });
}

function _showDiffHistoryEntry(entry) {
  var fileLang = entry.key ? _detectLang(entry.key) : '';
  showDiffAnalysisPane(entry.title,
    '<div style="font-size:10px;color:#9ca3af;margin-bottom:8px;padding:0 2px">📋 From history · ' + _escHtml(entry.ts) + '</div>'
    + '<div class="diff-analysis-bubble">' + _renderMarkdown(entry.text, fileLang) + '</div>');
}

function _removeDiffHistPopup() {
  var existing = document.querySelector('.diff-hist-popup');
  if (existing) {
    if (typeof existing._cleanup === 'function') existing._cleanup();
    existing.remove();
  }
}

function _makeDiffHistPopupDraggable(popup, header) {
  var dragging = false;
  var offsetX = 0;
  var offsetY = 0;

  function onMove(e) {
    if (!dragging) return;
    var maxLeft = Math.max(12, window.innerWidth - popup.offsetWidth - 12);
    var maxTop = Math.max(12, window.innerHeight - popup.offsetHeight - 12);
    popup.style.left = Math.max(12, Math.min(e.clientX - offsetX, maxLeft)) + 'px';
    popup.style.top = Math.max(12, Math.min(e.clientY - offsetY, maxTop)) + 'px';
  }

  function onUp() {
    dragging = false;
  }

  function onDown(e) {
    if (e.target.closest('.diff-hist-popup-close')) return;
    dragging = true;
    var rect = popup.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  }

  header.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);

  popup._dragCleanup = function() {
    header.removeEventListener('mousedown', onDown);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
}

function _openDiffHistoryPopup(title, entries, onSelect) {
  _removeDiffHistPopup();

  var popup = document.createElement('div');
  popup.className = 'diff-hist-popup';
  popup.style.left = Math.max(20, Math.round((window.innerWidth - 380) / 2)) + 'px';
  popup.style.top = Math.max(20, Math.round((window.innerHeight - 320) / 2)) + 'px';
  popup.style.height = '320px';

  popup.innerHTML = '<div class="diff-hist-popup-header">'
    + '<div class="diff-hist-popup-title">📋 ' + _escHtml(title) + '</div>'
    + '<button class="diff-hist-popup-close" type="button">✕</button>'
    + '</div>'
    + '<div class="diff-hist-popup-body"></div>';

  var body = popup.querySelector('.diff-hist-popup-body');
  if (!entries.length) {
    body.innerHTML = '<div class="diff-hist-popup-empty">No history yet</div>';
  } else {
    entries.forEach(function(entry) {
      var item = document.createElement('div');
      item.className = 'diff-hist-popup-item';
      item.innerHTML = '<div class="diff-hist-popup-item-title">' + _escHtml(entry.title) + '</div>'
        + '<div class="diff-hist-popup-item-time">' + _escHtml(entry.ts) + '</div>';
      item.onclick = function() {
        closePopup();
        onSelect(entry);
      };
      body.appendChild(item);
    });
  }

  function closePopup() {
    _removeDiffHistPopup();
  }

  popup.querySelector('.diff-hist-popup-close').onclick = function(e) {
    e.stopPropagation();
    closePopup();
  };

  document.body.appendChild(popup);
  _makeDiffHistPopupDraggable(popup, popup.querySelector('.diff-hist-popup-header'));

  var onOutsideClick = function(e) {
    if (!popup.contains(e.target)) closePopup();
  };
  var onEscape = function(e) {
    if (e.key === 'Escape') closePopup();
  };

  popup._cleanup = function() {
    document.removeEventListener('mousedown', onOutsideClick);
    document.removeEventListener('keydown', onEscape);
    if (typeof popup._dragCleanup === 'function') popup._dragCleanup();
  };

  setTimeout(function() {
    document.addEventListener('mousedown', onOutsideClick);
  }, 0);
  document.addEventListener('keydown', onEscape);
}

function openFileHistory(idx) {
  if (!_currentDiffData || !_currentDiffData.files) return;
  var file = _currentDiffData.files[idx];
  if (!file) return;

  var entries = _diffAnalysisHistory.filter(function(entry) {
    return entry.key === file.path;
  });

  if (!entries.length) {
    alert('No history for this file yet');
    return;
  }

  _openDiffHistoryPopup(file.path, entries, function(entry) {
    _showDiffHistoryEntry(entry);
  });
}

function _applyDiffTheme() {
  var isLight = _diffTheme === 'light';
  // Diff code blocks
  document.querySelectorAll('.diff-file-content').forEach(function(el) {
    el.classList.toggle('theme-light', isLight);
  });
  // Analysis pane code blocks
  var analysisPane = document.getElementById('diff-analysis-pane');
  if (analysisPane) analysisPane.classList.toggle('theme-light', isLight);
  // Toggle button label
  var btn = document.getElementById('diff-theme-btn');
  if (btn) btn.textContent = isLight ? t('ai_diff_dark') : t('ai_diff_light');
}

function toggleDiffTheme() {
  _diffTheme = _diffTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('diff-theme', _diffTheme);
  if (_currentDiffData) {
    _renderDiffFileSections(_currentDiffData);
    _restoreAnalyzeStates(); // re-apply analyzing/analyzed highlights after re-render
  } else {
    _applyDiffTheme();
  }
  // Re-render analysis content if visible (updates code block colors)
  if (_currentAnalysis) {
    var pane = document.getElementById('diff-analysis-pane');
    if (pane && pane.style.display !== 'none') {
      var html = (_currentAnalysis.reBtn || '')
        + '<div class="diff-analysis-bubble">'
        + _renderMarkdown(_currentAnalysis.text, _currentAnalysis.lang)
        + '</div>';
      var contentEl = document.getElementById('diff-analysis-content');
      if (contentEl) contentEl.innerHTML = html;
    }
  }
}

function _diffAIRequest(prompt, onResult) {
  var cfg = getAIConfig();
  var messages = [
    { role: 'system', content: 'You are an expert code reviewer. Analyze the provided git diff and give concise, actionable insights. Highlight important changes, potential bugs, security issues, and improvement suggestions. Use markdown formatting.' },
    { role: 'user', content: prompt }
  ];

  fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: cfg.provider, api_key: cfg.api_key, base_url: cfg.base_url, model: cfg.model, messages: messages }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (!data.ok) { onResult(null, data.error || 'AI request failed'); return; }
    _pollDiffAnalysis(data.jobId, onResult);
  })
  .catch(function(e) { onResult(null, 'Network error: ' + e.message); });
}

function _pollDiffAnalysis(jobId, onResult) {
  fetch('/api/ai/chat-status?jobId=' + jobId)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.done) { setTimeout(function() { _pollDiffAnalysis(jobId, onResult); }, 800); return; }
      if (data.ok) { onResult(data.text, null); }
      else { onResult(null, data.error || 'AI analysis failed'); }
    })
    .catch(function() { setTimeout(function() { _pollDiffAnalysis(jobId, onResult); }, 1200); });
}

function analyzeSingleFileDiff(idx) {
  if (!_currentDiffData || !_currentDiffData.files) return;
  var file = _currentDiffData.files[idx];
  if (!file) return;

  var btn = document.getElementById('diff-analyze-btn-' + idx);
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  // Highlight selected file
  _setAnalyzingFile(idx);

  var shortName = file.path.split('/').pop();
  var fileLang = _detectLang(file.path);
  var thinkingHTML = _analysisThinkingHTML('Analyzing ' + shortName + '…');
  showDiffAnalysisPane(shortName, thinkingHTML);
  var contentEl = document.getElementById('diff-analysis-content');
  _startProgressTimer(contentEl);

  var commitInfo = 'Commit: ' + (_currentDiffData.short_hash || '') + ' — ' + (_currentDiffData.message || '');
  var prompt = 'Analyze this git diff for file "' + file.path + '":\n\n'
    + commitInfo + '\n\n'
    + 'Changes: +' + file.added + ' -' + file.removed + ' lines\n\n'
    + '```diff\n' + (file.diff || '').slice(0, 6000) + '\n```\n\n'
    + 'Please provide:\n1. Summary of what changed\n2. Potential issues or bugs\n3. Code quality observations\n4. Security concerns (if any)\n5. Suggestions for improvement';

  _diffAIRequest(prompt, function(text, err) {
    _stopProgressTimer();
    if (btn) { btn.textContent = '🔄 Re-analyze'; btn.disabled = false; }
    // Switch from "analyzing" to "analyzed"
    _analyzingIdx = null;
    _analyzedIdx = idx;
    var sec = document.getElementById('diff-file-section-' + idx);
    if (sec) { sec.classList.remove('analyzing'); sec.classList.add('analyzed'); }
    if (err) {
      showDiffAnalysisPane(shortName, '<div style="color:#ef4444;padding:8px;font-size:12px">❌ ' + _escHtml(err) + '</div>');
    } else {
      _saveAnalysisHistory(file.path, shortName, text);
      var reAnalyzeBtn = '<button onclick="analyzeSingleFileDiff(' + idx + ')" style="margin-bottom:10px;font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-weight:600">🔄 Re-analyze</button>';
      _currentAnalysis = { title: shortName, text: text, lang: fileLang, reBtn: reAnalyzeBtn };
      showDiffAnalysisPane(shortName, reAnalyzeBtn + '<div class="diff-analysis-bubble">' + _renderMarkdown(text, fileLang) + '</div>');
    }
  });
}

function analyzeAllDiff() {
  if (!_currentDiffData || !_currentDiffData.files || !_currentDiffData.files.length) {
    showDiffAnalysisPane('All Files', '<div style="color:#6b7280;padding:8px;font-size:12px">No diff data loaded. Click 🔄 Refresh first.</div>');
    return;
  }
  var data = _currentDiffData;
  var filesSummary = data.files.map(function(f) {
    return '- ' + f.path + ' (+' + f.added + '/-' + f.removed + ')';
  }).join('\n');

  var totalDiff = data.files.map(function(f) {
    return '### ' + f.path + '\n```diff\n' + (f.diff || '').slice(0, 1000) + '\n```';
  }).join('\n\n');
  if (totalDiff.length > 8000) totalDiff = totalDiff.slice(0, 8000) + '\n... (truncated)';

  var prompt = 'Review this entire commit:\n\n'
    + 'Commit: ' + (data.short_hash || '') + ' — ' + (data.message || '') + '\n'
    + 'Author: ' + (data.author || '') + ' · ' + (data.date || '') + '\n'
    + 'Files changed (' + data.files.length + '):\n' + filesSummary + '\n\n'
    + 'Diffs:\n\n' + totalDiff + '\n\n'
    + 'Provide a comprehensive code review including:\n'
    + '1. Overall summary of changes\n'
    + '2. Key findings per file\n'
    + '3. Potential bugs or issues\n'
    + '4. Security considerations\n'
    + '5. Code quality & best practices\n'
    + '6. Suggestions for improvement';

  var thinkingHTML = _analysisThinkingHTML('Analyzing all ' + data.files.length + ' file(s)…');
  showDiffAnalysisPane('Full Commit Review', thinkingHTML);
  var contentEl = document.getElementById('diff-analysis-content');
  _startProgressTimer(contentEl);
  _setAnalyzingFile(null); // no single file selected

  var btn = document.getElementById('diff-analyze-all-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Analyzing…'; }

  _diffAIRequest(prompt, function(text, err) {
    _stopProgressTimer();
    if (btn) { btn.disabled = false; btn.textContent = t('ai_diff_analyze_all'); }
    if (err) {
      showDiffAnalysisPane('All Files', '<div style="color:#ef4444;padding:8px;font-size:12px">❌ ' + _escHtml(err) + '</div>');
    } else {
      _saveAnalysisHistory('__all__', 'Full Commit Review', text);
      var reBtn = '<button onclick="analyzeAllDiff()" style="margin-bottom:10px;font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-weight:600">🔄 Re-analyze All</button>';
      _currentAnalysis = { title: 'Full Commit Review', text: text, lang: '', reBtn: reBtn };
      showDiffAnalysisPane('Full Commit Review', reBtn + '<div class="diff-analysis-bubble">' + _renderMarkdown(text) + '</div>');
    }
  });
}

function openDiffInTab(idx) {
  if (!_currentDiffData || !_currentDiffData.files) return;
  var file = _currentDiffData.files[idx];
  if (!file) return;
  try {
    sessionStorage.setItem('diff-tab-data', JSON.stringify({
      filePath: file.path,
      diff: file.diff,
      added: file.added,
      removed: file.removed,
      commitInfo: {
        hash: _currentDiffData.commit,
        short_hash: _currentDiffData.short_hash,
        message: _currentDiffData.message,
        author: _currentDiffData.author,
        date: _currentDiffData.date,
      },
    }));
  } catch(e) {}
  window.open('/static/diff-tab.html', '_blank');
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
  initPanelResize();
  _updateAIBadge();
  _applyDiffTheme();
  // Show welcome message
  _appendSysMsg('👋 AI Git Assistant ready. Ask anything about your git repo, use the quick actions below, or switch to 📊 Diff for the latest commit review.');
  // Show FAB bubble after short delay
  setTimeout(function() {
    var bubble = document.getElementById('ai-fab-bubble');
    if (bubble && !localStorage.getItem('ai-fab-bubble-dismissed')) {
      bubble.classList.add('visible');
      setTimeout(function() { bubble.classList.remove('visible'); }, 7000);
    }
  }, 1200);
});

// ── FAB bubble ────────────────────────────────────────────────────────────
function hideFabBubble() {
  var bubble = document.getElementById('ai-fab-bubble');
  if (bubble) bubble.classList.remove('visible');
  try { localStorage.setItem('ai-fab-bubble-dismissed', '1'); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function() {
  var fab = document.getElementById('ai-fab');
  if (fab) {
    fab.addEventListener('mouseenter', function() {
      var bubble = document.getElementById('ai-fab-bubble');
      var panel = document.getElementById('ai-chat-panel');
      if (bubble && panel && !panel.classList.contains('open')) bubble.classList.add('visible');
    });
    fab.addEventListener('mouseleave', function() {
      var bubble = document.getElementById('ai-fab-bubble');
      if (bubble) bubble.classList.remove('visible');
    });
  }
});

// ── Commit Picker Modal ───────────────────────────────────────────────────
var _commitPickerPage = 1;
var _commitPickerPerPage = 30;
var _commitPickerTotal = 0;
var _commitPickerSearch = '';
var _commitPickerSearchTimer = null;
var _commitPickerPagesExpanded = false;

function openCommitPickerModal() {
  var modal = document.getElementById('commit-picker-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  _commitPickerPage = 1;
  _commitPickerSearch = '';
  _commitPickerPagesExpanded = false;
  var searchEl = document.getElementById('commit-picker-search');
  if (searchEl) {
    searchEl.value = '';
    searchEl.placeholder = typeof t === 'function' ? t('commit_picker_search_ph') : '🔍 Search hash / author / message...';
  }
  _applyCommitPickerI18n();
  _loadCommitPickerPage();
}

function _applyCommitPickerI18n() {
  var tFn = typeof t === 'function' ? t : function(k) { return k; };
  var titleEl = document.getElementById('commit-picker-title-text');
  var subtitleEl = document.getElementById('commit-picker-subtitle-text');
  var cancelEl = document.getElementById('commit-picker-cancel-btn');
  if (titleEl) titleEl.textContent = tFn('commit_picker_title');
  if (subtitleEl) subtitleEl.textContent = tFn('commit_picker_subtitle');
  if (cancelEl) cancelEl.textContent = tFn('commit_picker_cancel');
}

function closeCommitPickerModal() {
  var modal = document.getElementById('commit-picker-modal');
  if (modal) modal.style.display = 'none';
}

function onCommitPickerSearch() {
  clearTimeout(_commitPickerSearchTimer);
  _commitPickerSearchTimer = setTimeout(function() {
    _commitPickerSearch = (document.getElementById('commit-picker-search') || {}).value || '';
    _commitPickerPage = 1;
    _commitPickerPagesExpanded = false;
    _loadCommitPickerPage();
  }, 320);
}

function _loadCommitPickerPage() {
  var listEl = document.getElementById('commit-picker-list');
  var statusEl = document.getElementById('commit-picker-status');
  var tFn = typeof t === 'function' ? t : function(k) { return k; };
  if (listEl) listEl.innerHTML = '<div class="commit-picker-loading"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span> ' + tFn('commit_picker_loading') + '</div>';
  var url = '/api/commits?page=' + _commitPickerPage + '&per_page=' + _commitPickerPerPage;
  if (_commitPickerSearch) url += '&search=' + encodeURIComponent(_commitPickerSearch);
  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var commits = data.commits || [];
      _commitPickerTotal = data.total || commits.length;
      var totalTxt = typeof tf === 'function'
        ? tf('commit_picker_total', (typeof L !== 'undefined' ? L : 'en'), {n: _commitPickerTotal})
        : ('Total ' + _commitPickerTotal + ' records');
      if (statusEl) statusEl.textContent = totalTxt;
      _renderCommitPickerList(commits);
      _renderCommitPickerPagination();
    })
    .catch(function(e) {
      var errTxt = (typeof tFn === 'function' ? tFn('commit_picker_load_fail') : 'Load failed: ') + _escHtml(e.message);
      if (listEl) listEl.innerHTML = '<div class="commit-picker-empty">❌ ' + errTxt + '</div>';
    });
}

function _renderCommitPickerList(commits) {
  var listEl = document.getElementById('commit-picker-list');
  if (!listEl) return;
  var tFn = typeof t === 'function' ? t : function(k) { return k; };
  if (!commits.length) {
    listEl.innerHTML = '<div class="commit-picker-empty">' + tFn('commit_picker_empty') + '</div>';
    return;
  }
  listEl.innerHTML = '';
  var analyzeTxt = tFn('commit_picker_analyze_btn');
  commits.forEach(function(c) {
    var item = document.createElement('div');
    item.className = 'commit-picker-item';
    item.innerHTML =
      '<div class="commit-picker-item-hash">' + _escHtml(c.short_hash || (c.hash || '').slice(0,7)) + '</div>'
      + '<div class="commit-picker-item-body">'
      + '<div class="commit-picker-item-msg">' + _escHtml(c.message || '') + '</div>'
      + '<div class="commit-picker-item-meta">'
      + '<span class="cpi-author">👤 ' + _escHtml(c.author || '') + '</span>'
      + '<span class="cpi-date">🕐 ' + _escHtml(c.date || '') + '</span>'
      + '</div>'
      + '</div>'
      + '<button class="commit-picker-select-btn">' + _escHtml(analyzeTxt) + '</button>';
    item.querySelector('.commit-picker-select-btn').onclick = (function(hash, msg) {
      return function() {
        closeCommitPickerModal();
        analyzeCommitVsHead(hash, msg);
      };
    })(c.hash || c.short_hash, c.message || '');
    listEl.appendChild(item);
  });
}

// ── Smart windowed pagination (never overflows) ───────────────────────────
function _buildSmartPageList(current, total, expanded) {
  if (total <= 1) return [];
  var WINDOW = 2; // pages around current
  var EDGE = 2;   // always show first N and last N
  if (expanded) {
    // show all pages
    var all = [];
    for (var i = 1; i <= total; i++) all.push(i);
    return all;
  }
  var visible = {};
  // edges
  for (var e = 1; e <= Math.min(EDGE, total); e++) visible[e] = true;
  for (var e = Math.max(1, total - EDGE + 1); e <= total; e++) visible[e] = true;
  // window around current
  for (var w = Math.max(1, current - WINDOW); w <= Math.min(total, current + WINDOW); w++) visible[w] = true;

  var result = [];
  var sorted = Object.keys(visible).map(Number).sort(function(a,b){return a-b;});
  for (var s = 0; s < sorted.length; s++) {
    if (s > 0 && sorted[s] - sorted[s-1] > 1) result.push('...');
    result.push(sorted[s]);
  }
  return result;
}

function _renderCommitPickerPagination() {
  var el = document.getElementById('commit-picker-pagination');
  if (!el) return;
  var totalPages = _commitPickerPerPage > 0 ? Math.ceil(_commitPickerTotal / _commitPickerPerPage) : 1;
  if (totalPages <= 1) { el.innerHTML = ''; return; }

  var tFn = typeof t === 'function' ? t : function(k) { return k; };
  var tfFn = typeof tf === 'function' ? tf : function(k) { return k; };
  var lang = typeof L !== 'undefined' ? L : 'en';

  var pageList = _buildSmartPageList(_commitPickerPage, totalPages, _commitPickerPagesExpanded);
  var hasGap = pageList.some(function(p) { return p === '...'; });

  // Build DOM via event delegation to avoid inline onclick scope issues
  el.innerHTML = '';
  var inner = document.createElement('div');
  inner.className = 'cppag-inner';

  function makeBtn(label, page, cls, disabled) {
    var btn = document.createElement('button');
    btn.className = 'cppag-btn' + (cls ? ' ' + cls : '');
    btn.textContent = label;
    if (disabled) btn.disabled = true;
    if (page !== null && !disabled) {
      btn.addEventListener('click', function() {
        _commitPickerPage = page;
        _commitPickerPagesExpanded = false;
        _loadCommitPickerPage();
      });
    }
    return btn;
  }

  // Prev
  inner.appendChild(makeBtn('‹', _commitPickerPage - 1, 'cppag-nav', _commitPickerPage <= 1));

  // Page buttons
  pageList.forEach(function(p) {
    if (p === '...') {
      var dots = document.createElement('span');
      dots.className = 'cppag-dots';
      dots.textContent = '…';
      inner.appendChild(dots);
    } else {
      var btn = makeBtn(String(p), p, p === _commitPickerPage ? 'active' : '', false);
      inner.appendChild(btn);
    }
  });

  // Expand/collapse button
  if (hasGap && !_commitPickerPagesExpanded) {
    var expandBtn = document.createElement('button');
    expandBtn.className = 'cppag-btn cppag-expand';
    expandBtn.textContent = tfFn('pag_expand', lang, {n: totalPages});
    expandBtn.addEventListener('click', function() {
      _commitPickerPagesExpanded = true;
      _renderCommitPickerPagination();
    });
    inner.appendChild(expandBtn);
  } else if (_commitPickerPagesExpanded && totalPages > 10) {
    var colBtn = document.createElement('button');
    colBtn.className = 'cppag-btn cppag-expand';
    colBtn.textContent = tFn('pag_collapse');
    colBtn.addEventListener('click', function() {
      _commitPickerPagesExpanded = false;
      _renderCommitPickerPagination();
    });
    inner.appendChild(colBtn);
  }

  // Next
  inner.appendChild(makeBtn('›', _commitPickerPage + 1, 'cppag-nav', _commitPickerPage >= totalPages));

  el.appendChild(inner);
}

// ── Analyze selected commit vs HEAD ──────────────────────────────────────
function analyzeCommitVsHead(commitHash, commitMsg) {
  var tFn = typeof t === 'function' ? t : function(k) { return k; };
  switchAIMode('diff');
  var infoEl = document.getElementById('diff-commit-info');
  var filesEl = document.getElementById('diff-files-pane');
  var analyzeAllBtn = document.getElementById('diff-analyze-all-btn');
  if (infoEl) infoEl.innerHTML = '<span style="color:#6b7280;font-size:12px">⏳ Loading diff…</span>';
  if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state"><div class="diff-loading-dots"><span></span><span></span><span></span></div>Fetching diff…</div>';
  if (analyzeAllBtn) analyzeAllBtn.style.display = 'none';

  fetch('/api/commit-diff-compare?base=' + encodeURIComponent(commitHash) + '&head=HEAD')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.ok) {
        if (infoEl) infoEl.innerHTML = '<span style="color:#ef4444;font-size:12px">❌ ' + _escHtml(data.error || 'Failed to load diff') + '</span>';
        if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state" style="color:#ef4444">Failed to load diff.</div>';
        return;
      }
      _currentDiffData = data;
      _analyzingIdx = null;
      _analyzedIdx = null;
      var compareBadgeText = tFn('diff_compare_mode');
      var fromText = tFn('diff_compare_from');
      if (infoEl) {
        infoEl.innerHTML =
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
          + '<span class="diff-compare-badge">' + _escHtml(compareBadgeText) + '</span>'
          + '<span class="diff-commit-hash" style="background:rgba(245,158,11,.15);color:#b45309">' + _escHtml(data.base_short_hash || commitHash.slice(0,7)) + '</span>'
          + '<span style="color:#9ca3af;font-size:12px">→</span>'
          + '<span class="diff-commit-hash">HEAD ' + _escHtml(data.short_hash || '') + '</span>'
          + '<span class="diff-commit-msg">' + _escHtml(data.message || '') + '</span>'
          + '</div>'
          + '<div class="diff-commit-meta">'
          + '<span style="color:#b45309;font-size:11px">' + _escHtml(fromText) + _escHtml(data.base_message || commitMsg || '') + '</span>'
          + ' · <span class="diff-stat-add">+' + (data.total_added || 0) + '</span>'
          + ' <span class="diff-stat-del">-' + (data.total_removed || 0) + '</span>'
    + ' · ' + tf('ai_diff_files_count', null, {n: (data.files ? data.files.length : 0)})
          + '</div>';
      }
      _renderDiffFileSections(data);
      closeDiffAnalysisPane();
      if (analyzeAllBtn) analyzeAllBtn.style.display = '';
    })
    .catch(function(e) {
      if (infoEl) infoEl.innerHTML = '<span style="color:#ef4444;font-size:12px">❌ Network error</span>';
      if (filesEl) filesEl.innerHTML = '<div class="diff-empty-state" style="color:#ef4444">Network error: ' + _escHtml(e.message) + '</div>';
    });
}

// Close commit picker on backdrop click / Escape
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('commit-picker-modal');
  if (modal) {
    modal.addEventListener('mousedown', function(e) {
      if (e.target === modal) closeCommitPickerModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') closeCommitPickerModal();
    });
  }
});
