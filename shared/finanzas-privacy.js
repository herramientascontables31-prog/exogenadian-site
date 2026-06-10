/**
 * ExogenaDIAN — Finanzas Privacy + Backup
 *
 * Modulo unificado para herramientas de finanzas personales:
 *  - Badge de privacidad (verde, expandible)
 *  - Backup completo descargable (JSON con todos los datos fp:*)
 *  - Restaurar desde backup
 *  - Borrar todos los datos
 *  - Auto-save de formularios (helper para tools sin persistencia)
 *
 * Carga: <script src="shared/finanzas-privacy.js"></script>
 * Auto-monta el badge si existe <div id="privacyBadgeMount"></div>.
 *
 * API publica:
 *   FinanzasPrivacy.list()                    -> [{key, sizeKB, savedAt}]
 *   FinanzasPrivacy.exportAll()               -> descarga JSON
 *   FinanzasPrivacy.importAll(fileOrJson)     -> Promise<{restored, errors}>
 *   FinanzasPrivacy.clearAll()                -> borra todo fp:*
 *   FinanzasPrivacy.mountBadge(selector)      -> monta badge en selector
 *   FinanzasPrivacy.autoSave(formId, key)     -> guarda inputs del form en localStorage al cambiar
 *   FinanzasPrivacy.autoLoad(formId, key)     -> restaura inputs al cargar
 */
(function () {
  'use strict';

  var PREFIX = 'fp:';
  var APP_NAME = 'ExogenaDIAN — Finanzas Personales';

  // ───────────────────────────────────────────
  //  Helpers internos
  // ───────────────────────────────────────────
  function isStorageAvailable() {
    try {
      localStorage.setItem('__fp_test__', '1');
      localStorage.removeItem('__fp_test__');
      return true;
    } catch (e) { return false; }
  }

  function listKeys() {
    if (!isStorageAvailable()) return [];
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) keys.push(k);
    }
    return keys;
  }

  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    return (n / 1024).toFixed(1) + ' KB';
  }

  function fmtDate(ts) {
    if (!ts) return 'sin fecha';
    try {
      var d = new Date(ts);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return 'fecha inválida'; }
  }

  function safeParse(raw) {
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }

  function downloadBlob(content, filename, mime) {
    var blob = new Blob([content], { type: mime || 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 0);
  }

  // ───────────────────────────────────────────
  //  API: list / export / import / clear
  // ───────────────────────────────────────────
  function list() {
    return listKeys().map(function (k) {
      var raw = localStorage.getItem(k);
      var parsed = safeParse(raw);
      var ts = (parsed && parsed.t) || null;
      return {
        key: k.replace(PREFIX, ''),
        fullKey: k,
        sizeBytes: raw ? raw.length : 0,
        sizeFmt: fmtBytes(raw ? raw.length : 0),
        savedAt: ts,
        savedAtFmt: fmtDate(ts)
      };
    }).sort(function (a, b) { return (b.savedAt || 0) - (a.savedAt || 0); });
  }

  function exportAll() {
    var keys = listKeys();
    if (keys.length === 0) {
      _toast('No hay datos guardados que respaldar', 'info');
      return false;
    }
    var data = {};
    keys.forEach(function (k) {
      var raw = localStorage.getItem(k);
      var parsed = safeParse(raw);
      data[k] = parsed || raw;
    });
    var payload = {
      app: APP_NAME,
      version: 1,
      exportedAt: new Date().toISOString(),
      keysCount: keys.length,
      data: data
    };
    var stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(
      JSON.stringify(payload, null, 2),
      'exogenadian-finanzas-respaldo-' + stamp + '.json',
      'application/json'
    );
    _toast('Respaldo descargado — ' + keys.length + ' registros', 'success');
    if (typeof gtag !== 'undefined') gtag('event', 'finanzas_backup_export', { keys: keys.length });
    return true;
  }

  function importAll(fileOrJson) {
    return new Promise(function (resolve, reject) {
      function process(text) {
        var payload;
        try { payload = JSON.parse(text); }
        catch (e) { reject(new Error('Archivo inválido (no es JSON)')); return; }
        if (!payload || !payload.data || typeof payload.data !== 'object') {
          reject(new Error('Estructura inválida: falta el campo data'));
          return;
        }
        var restored = 0, errors = [];
        Object.keys(payload.data).forEach(function (k) {
          if (k.indexOf(PREFIX) !== 0) {
            errors.push('Clave ignorada (prefijo no fp:): ' + k);
            return;
          }
          try {
            var v = payload.data[k];
            // Si trae estructura {v, t}, guardar como JSON; si es texto raw, igual
            localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
            restored++;
          } catch (e) {
            errors.push(k + ': ' + e.message);
          }
        });
        _toast('Restaurados ' + restored + ' registros' + (errors.length ? ' (' + errors.length + ' errores)' : ''), 'success');
        if (typeof gtag !== 'undefined') gtag('event', 'finanzas_backup_import', { restored: restored, errors: errors.length });
        resolve({ restored: restored, errors: errors });
      }
      if (typeof fileOrJson === 'string') {
        process(fileOrJson);
      } else if (fileOrJson && fileOrJson instanceof File) {
        var reader = new FileReader();
        reader.onload = function (e) { process(e.target.result); };
        reader.onerror = function () { reject(new Error('Error leyendo el archivo')); };
        reader.readAsText(fileOrJson);
      } else {
        reject(new Error('Tipo de entrada no soportado'));
      }
    });
  }

  function clearAll(confirmFn) {
    var keys = listKeys();
    if (keys.length === 0) {
      _toast('No hay datos que borrar', 'info');
      return false;
    }
    var doConfirm = confirmFn || function (msg) { return confirm(msg); };
    if (!doConfirm('¿Borrar tus ' + keys.length + ' registros guardados?\n\nEsta acción NO se puede deshacer. Si quieres conservar tus datos, descarga primero el respaldo.')) {
      return false;
    }
    keys.forEach(function (k) { localStorage.removeItem(k); });
    _toast('Borrados ' + keys.length + ' registros', 'success');
    if (typeof gtag !== 'undefined') gtag('event', 'finanzas_backup_clear', { keys: keys.length });
    setTimeout(function () { location.reload(); }, 800);
    return true;
  }

  function _toast(msg, type) {
    if (typeof exoToast === 'function') exoToast(msg, type);
    else console.log('[' + (type || 'info') + ']', msg);
  }

  // ───────────────────────────────────────────
  //  Auto-save / Auto-load para herramientas
  // ───────────────────────────────────────────
  function autoSave(formIdOrEl, storageKey, opts) {
    opts = opts || {};
    var form = typeof formIdOrEl === 'string' ? document.getElementById(formIdOrEl) || document.querySelector(formIdOrEl) : formIdOrEl;
    if (!form) { console.warn('autoSave: form no encontrado', formIdOrEl); return; }
    var debounceMs = opts.debounce || 600;
    var timer;

    function snapshot() {
      var data = {};
      var inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function (el) {
        if (!el.id && !el.name) return;
        var key = el.id || el.name;
        if (el.type === 'checkbox' || el.type === 'radio') data[key] = el.checked;
        else data[key] = el.value;
      });
      try {
        localStorage.setItem(PREFIX + storageKey, JSON.stringify({ v: data, t: Date.now() }));
        if (opts.onSave) opts.onSave(data);
      } catch (e) { console.warn('autoSave fail', e); }
    }

    form.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(snapshot, debounceMs);
    });
    form.addEventListener('change', function () {
      clearTimeout(timer);
      timer = setTimeout(snapshot, 100);
    });
    return { snapshot: snapshot };
  }

  function autoLoad(formIdOrEl, storageKey) {
    var form = typeof formIdOrEl === 'string' ? document.getElementById(formIdOrEl) || document.querySelector(formIdOrEl) : formIdOrEl;
    if (!form) return null;
    var raw = localStorage.getItem(PREFIX + storageKey);
    if (!raw) return null;
    var wrap = safeParse(raw);
    if (!wrap || !wrap.v) return null;
    var data = wrap.v;
    Object.keys(data).forEach(function (key) {
      var el = form.querySelector('#' + CSS.escape(key)) || form.querySelector('[name="' + key + '"]');
      if (!el) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!data[key];
      else el.value = data[key];
    });
    return { savedAt: wrap.t, data: data };
  }

  // ───────────────────────────────────────────
  //  Badge UI — pildora verde con panel expandible
  // ───────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById('fpPrivacyStyles')) return;
    var s = document.createElement('style');
    s.id = 'fpPrivacyStyles';
    s.textContent = ''+
      '.fp-pb{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#ECFDF5;color:#047857;border:1.5px solid #A7F3D0;border-radius:100px;font-size:.78rem;font-weight:700;cursor:pointer;font-family:inherit;transition:.2s}'+
      '.fp-pb:hover{background:#D1FAE5;border-color:#34D399;transform:translateY(-1px)}'+
      '.fp-pb .fp-pb-dot{width:7px;height:7px;background:#10B981;border-radius:50%;animation:fpPulse 2.4s infinite}'+
      '@keyframes fpPulse{0%,100%{opacity:1}50%{opacity:.4}}'+
      '.fp-modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);z-index:9998;opacity:0;pointer-events:none;transition:opacity .25s}'+
      '.fp-modal-bg.show{opacity:1;pointer-events:auto}'+
      '.fp-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-45%);background:#fff;border-radius:18px;width:min(560px,92vw);max-height:88vh;overflow-y:auto;z-index:9999;opacity:0;pointer-events:none;transition:all .25s;box-shadow:0 24px 60px rgba(0,0,0,.25);font-family:Outfit,DM Sans,sans-serif}'+
      '.fp-modal.show{opacity:1;pointer-events:auto;transform:translate(-50%,-50%)}'+
      '.fp-modal-head{padding:22px 26px 16px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}'+
      '.fp-modal-head h3{font-size:1.1rem;font-weight:800;color:#064E3B;margin-bottom:4px;display:flex;align-items:center;gap:8px}'+
      '.fp-modal-head p{font-size:.84rem;color:#6B7280;line-height:1.5}'+
      '.fp-modal-close{background:none;border:none;color:#9CA3AF;font-size:1.4rem;cursor:pointer;padding:0;line-height:1;flex-shrink:0;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;transition:.15s}'+
      '.fp-modal-close:hover{background:#F3F4F6;color:#374151}'+
      '.fp-modal-body{padding:18px 26px}'+
      '.fp-modal-section{margin-bottom:18px}'+
      '.fp-modal-section h4{font-size:.78rem;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}'+
      '.fp-promesas{display:flex;flex-direction:column;gap:6px}'+
      '.fp-promesa{display:flex;gap:10px;font-size:.86rem;color:#374151;line-height:1.5}'+
      '.fp-promesa .ic{flex-shrink:0;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:.7rem;font-weight:800}'+
      '.fp-promesa.ok .ic{background:#D1FAE5;color:#065F46}'+
      '.fp-promesa.no .ic{background:#FEE2E2;color:#991B1B}'+
      '.fp-data-list{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;font-size:.82rem;color:#374151;max-height:160px;overflow-y:auto}'+
      '.fp-data-list .fp-empty{color:#9CA3AF;font-style:italic;text-align:center;padding:8px 0}'+
      '.fp-data-list .fp-item{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #E5E7EB;font-size:.78rem}'+
      '.fp-data-list .fp-item:last-child{border-bottom:none}'+
      '.fp-data-list .fp-item .fp-k{font-weight:600;color:#064E3B;font-family:JetBrains Mono,monospace}'+
      '.fp-data-list .fp-item .fp-meta{color:#6B7280;font-size:.7rem}'+
      '.fp-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}'+
      '.fp-actions button{padding:10px 12px;border:1.5px solid #E5E7EB;background:#fff;color:#374151;font-size:.82rem;font-weight:600;border-radius:8px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:.15s}'+
      '.fp-actions button:hover{border-color:#10B981;background:#ECFDF5;color:#047857}'+
      '.fp-actions .fp-danger:hover{border-color:#DC2626;background:#FEF2F2;color:#991B1B}'+
      '.fp-modal-foot{padding:16px 26px;background:#F9FAFB;border-top:1px solid #E5E7EB;border-radius:0 0 18px 18px;text-align:center}'+
      '.fp-modal-foot a{font-size:.82rem;color:#047857;font-weight:600;text-decoration:none}'+
      '.fp-modal-foot a:hover{text-decoration:underline}'+
      '.fp-input-file{display:none}'+
      '@media(max-width:600px){.fp-actions{grid-template-columns:1fr}.fp-modal-head{padding:18px 20px 14px}.fp-modal-body{padding:14px 20px}.fp-modal-foot{padding:14px 20px}}';
    document.head.appendChild(s);
  }

  function mountBadge(selector) {
    _injectStyles();
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.innerHTML = '<button type="button" class="fp-pb" id="fpBadge"><span class="fp-pb-dot"></span>🔒 Tus datos no salen de tu navegador</button>';
    el.querySelector('#fpBadge').addEventListener('click', _openModal);
  }

  function _openModal() {
    _injectStyles();
    var bg = document.getElementById('fpModalBg') || _buildModal();
    bg.classList.add('show');
    document.getElementById('fpModal').classList.add('show');
    _renderDataList();
    if (typeof gtag !== 'undefined') gtag('event', 'finanzas_privacy_open', {});
  }

  function _closeModal() {
    var bg = document.getElementById('fpModalBg');
    var md = document.getElementById('fpModal');
    if (bg) bg.classList.remove('show');
    if (md) md.classList.remove('show');
  }

  function _buildModal() {
    var bg = document.createElement('div');
    bg.id = 'fpModalBg';
    bg.className = 'fp-modal-bg';
    bg.addEventListener('click', _closeModal);
    document.body.appendChild(bg);

    var md = document.createElement('div');
    md.id = 'fpModal';
    md.className = 'fp-modal';
    md.addEventListener('click', function (e) { e.stopPropagation(); });
    md.innerHTML = ''+
      '<div class="fp-modal-head">'+
        '<div>'+
          '<h3>🔒 Tu privacidad — auditable, no promesa</h3>'+
          '<p>Toda tu información financiera vive solo en este navegador. No tenemos servidor que la reciba.</p>'+
        '</div>'+
        '<button type="button" class="fp-modal-close" id="fpClose">&times;</button>'+
      '</div>'+
      '<div class="fp-modal-body">'+
        '<div class="fp-modal-section">'+
          '<h4>Lo que NO hacemos con tus datos</h4>'+
          '<div class="fp-promesas">'+
            '<div class="fp-promesa no"><div class="ic">×</div><div>No los guardamos en ningún servidor.</div></div>'+
            '<div class="fp-promesa no"><div class="ic">×</div><div>No los enviamos por API a ningún tercero.</div></div>'+
            '<div class="fp-promesa no"><div class="ic">×</div><div>No los compartimos con bancos, aseguradoras ni anunciantes.</div></div>'+
            '<div class="fp-promesa no"><div class="ic">×</div><div>No te pedimos correo para usar las herramientas.</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="fp-modal-section">'+
          '<h4>Lo que SÍ hacemos</h4>'+
          '<div class="fp-promesas">'+
            '<div class="fp-promesa ok"><div class="ic">✓</div><div>Guardamos en localStorage de tu navegador (clave <code style="background:#F3F4F6;padding:1px 4px;border-radius:3px;font-size:.8em">fp:*</code>) para que no pierdas datos al cerrar la pestaña.</div></div>'+
            '<div class="fp-promesa ok"><div class="ic">✓</div><div>Trackeamos en Google Analytics solo eventos genéricos (qué herramienta abriste, qué archivo descargaste). Nunca los <em>números</em> que ingresaste.</div></div>'+
            '<div class="fp-promesa ok"><div class="ic">✓</div><div>Te dejamos descargar respaldo, restaurar o borrar todo cuando quieras.</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="fp-modal-section">'+
          '<h4 id="fpDataTitle">Tus datos guardados ahora</h4>'+
          '<div class="fp-data-list" id="fpDataList"></div>'+
          '<div class="fp-actions">'+
            '<button type="button" id="fpExport">📥 Descargar respaldo</button>'+
            '<button type="button" id="fpImport">📤 Restaurar respaldo</button>'+
            '<button type="button" class="fp-danger" id="fpClear" style="grid-column:1/-1">🗑️ Borrar todos mis datos</button>'+
          '</div>'+
          '<input type="file" class="fp-input-file" id="fpFileInput" accept="application/json">'+
        '</div>'+
      '</div>'+
      '<div class="fp-modal-foot">'+
        '<a href="/privacidad-finanzas.html">Ver política completa →</a>'+
      '</div>';
    document.body.appendChild(md);
    document.getElementById('fpClose').addEventListener('click', _closeModal);
    document.getElementById('fpExport').addEventListener('click', exportAll);
    document.getElementById('fpClear').addEventListener('click', function () { clearAll(); });
    document.getElementById('fpImport').addEventListener('click', function () {
      document.getElementById('fpFileInput').click();
    });
    document.getElementById('fpFileInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      importAll(f).then(function () {
        setTimeout(function () { location.reload(); }, 1200);
      }).catch(function (err) {
        _toast('Error: ' + err.message, 'error');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') _closeModal();
    });
    return bg;
  }

  function _renderDataList() {
    var box = document.getElementById('fpDataList');
    if (!box) return;
    var items = list();
    var title = document.getElementById('fpDataTitle');
    if (title) title.textContent = 'Tus datos guardados ahora (' + items.length + ')';
    if (items.length === 0) {
      box.innerHTML = '<div class="fp-empty">Aún no has guardado nada. Cuando uses cualquier herramienta y guardes, lo verás aquí.</div>';
      return;
    }
    box.innerHTML = items.map(function (it) {
      return '<div class="fp-item">'+
        '<span class="fp-k">' + it.key + '</span>'+
        '<span class="fp-meta">' + it.sizeFmt + ' · ' + it.savedAtFmt + '</span>'+
      '</div>';
    }).join('');
  }

  // ───────────────────────────────────────────
  //  Auto-mount: si existe #privacyBadgeMount, renderiza ahí.
  //  Si NO, monta un pill flotante en bottom-right.
  // ───────────────────────────────────────────
  function _autoMount() {
    if (window.FP_PRIVACY_NOAUTO === true) return; // opt-out global
    var el = document.getElementById('privacyBadgeMount');
    if (el) {
      mountBadge(el);
      return;
    }
    if (!document.body) return;
    var c = document.createElement('div');
    c.id = 'privacyBadgeMount';
    c.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:100';
    document.body.appendChild(c);
    mountBadge(c);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoMount);
  } else { _autoMount(); }

  // ───────────────────────────────────────────
  //  Export
  // ───────────────────────────────────────────
  window.FinanzasPrivacy = {
    list: list,
    exportAll: exportAll,
    importAll: importAll,
    clearAll: clearAll,
    mountBadge: mountBadge,
    autoSave: autoSave,
    autoLoad: autoLoad,
    openModal: _openModal
  };
})();
