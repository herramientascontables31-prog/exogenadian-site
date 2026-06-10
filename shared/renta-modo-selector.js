/**
 * ExogenaDIAN — Selector de modo unificado para Renta Personas Naturales
 *
 * Coordina los 3 archivos del liquidador F210 (réplica oficial, express,
 * profesional) en una experiencia unificada. Inyecta tabs visuales en la
 * parte superior del .container y, la primera vez, una welcome card que
 * orienta al usuario sobre qué modo elegir.
 *
 * Uso:
 *   <script src="shared/renta-modo-selector.js"></script>
 *
 * El módulo se auto-inicializa en DOMContentLoaded. Detecta el archivo
 * actual por nombre y marca la tab correspondiente como activa.
 *
 * Persistencia (localStorage):
 *   f210_modo_pref       → último modo abierto ('replica' | 'express' | 'pro')
 *   f210_modo_pref_seen  → 'true' una vez el usuario ya eligió o cerró el welcome
 */
(function(){
  'use strict';

  var MODOS = [
    {
      id: 'replica',
      label: '📋 Réplica DIAN',  // 📋
      url: 'formato210.html',
      desc: 'Vista oficial del formulario 210, casillas editables',
      cuandoUsar: 'Para ver el formulario tal como aparece en MUISCA — útil al revisar caso por caso o para imprimir un borrador con la apariencia oficial.'
    },
    // Modo Express retirado jun-2026: fusionado con el Profesional (mismo motor,
    // prefill exógena automático). formato210-express.html queda con banner de redirección.
    {
      id: 'pro',
      label: '🎯 Profesional',  // 🎯
      url: 'formato210-pro.html',
      desc: 'Multi-cédula, prefill exógena, Excel asesor',
      cuandoUsar: 'Caso completo: multi-cédula, dividendos, ganancias ocasionales, conciliación patrimonial. Carga exógena DIAN y exporta Excel papel de trabajo.'
    }
  ];

  var KEY_PREF = 'f210_modo_pref';
  var KEY_SEEN = 'f210_modo_pref_seen';

  function getCurrentModo(){
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    for(var i = 0; i < MODOS.length; i++){
      if(file === MODOS[i].url.toLowerCase()) return MODOS[i].id;
    }
    return 'replica'; // fallback
  }

  function getPref(){
    try { return localStorage.getItem(KEY_PREF); } catch(e){ return null; }
  }
  function setPref(modo){
    try { localStorage.setItem(KEY_PREF, modo); } catch(e){}
  }
  function markSeen(){
    try { localStorage.setItem(KEY_SEEN, 'true'); } catch(e){}
  }
  function isSeen(){
    try { return localStorage.getItem(KEY_SEEN) === 'true'; } catch(e){ return false; }
  }

  function escapeHtml(s){
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTabs(currentId){
    var html = '<nav class="rms-tabs" role="tablist" aria-label="Modos del liquidador F210">';
    MODOS.forEach(function(m){
      var isActive = m.id === currentId;
      var attrs = isActive
        ? 'aria-current="page" aria-selected="true"'
        : 'data-modo="' + m.id + '" aria-selected="false"';
      html += '<a class="rms-tab' + (isActive ? ' active' : '') + '" ' +
              'href="' + m.url + '" ' +
              attrs + ' ' +
              'role="tab">' +
                '<span class="rms-tab-label">' + m.label + '</span>' +
                '<span class="rms-tab-desc">' + escapeHtml(m.desc) + '</span>' +
              '</a>';
    });
    html += '</nav>';
    return html;
  }

  function renderWelcome(){
    var html = '<section class="rms-welcome" aria-labelledby="rms-welcome-title">' +
      '<div class="rms-welcome-head">' +
        '<h2 id="rms-welcome-title">Renta Personas Naturales — elige tu modo</h2>' +
        '<p>Tres vistas del mismo liquidador, según la complejidad del caso. Puedes cambiar de modo en cualquier momento desde las pestañas superiores.</p>' +
      '</div>' +
      '<div class="rms-welcome-grid">';
    MODOS.forEach(function(m){
      html += '<a class="rms-welcome-card" href="' + m.url + '" data-modo="' + m.id + '">' +
        '<div class="rms-welcome-card-label">' + m.label + '</div>' +
        '<div class="rms-welcome-card-desc">' + escapeHtml(m.desc) + '</div>' +
        '<div class="rms-welcome-card-when"><strong>Cuándo usarlo:</strong> ' + escapeHtml(m.cuandoUsar) + '</div>' +
        '<div class="rms-welcome-card-cta">Abrir →</div>' +
        '</a>';
    });
    html += '</div>' +
      '<button type="button" class="rms-welcome-skip" data-action="dismiss">No volver a mostrar</button>' +
      '</section>';
    return html;
  }

  var STYLES = [
    '.rms-tabs{display:flex;gap:6px;padding:8px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:14px;flex-wrap:wrap}',
    '.rms-tab{flex:1;min-width:160px;padding:10px 14px;border:1.5px solid transparent;border-radius:8px;text-decoration:none;color:#6b7280;display:flex;flex-direction:column;gap:3px;transition:all .15s;background:transparent;font-family:inherit}',
    '.rms-tab:hover:not(.active){background:#f5f9ff;color:#1B3A5C;border-color:#B4C6E7}',
    '.rms-tab.active{background:#1B3A5C;color:#fff;border-color:#1B3A5C;pointer-events:none;cursor:default}',
    '.rms-tab-label{font-size:.9rem;font-weight:700}',
    '.rms-tab-desc{font-size:.72rem;opacity:.85;font-weight:400;line-height:1.3}',
    '.rms-tab.active .rms-tab-desc{color:#A7F3D0}',
    '.rms-welcome{background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:22px 24px;margin-bottom:18px}',
    '.rms-welcome-head h2{font-size:1.2rem;color:#1B3A5C;font-weight:700;margin:0 0 4px;font-family:inherit}',
    '.rms-welcome-head p{font-size:.86rem;color:#6b7280;margin:0 0 16px;line-height:1.5}',
    '.rms-welcome-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}',
    '.rms-welcome-card{display:flex;flex-direction:column;gap:8px;padding:16px;border:1.5px solid #e2e8f0;border-radius:10px;text-decoration:none;color:inherit;transition:all .2s;background:#fafbfc}',
    '.rms-welcome-card:hover{border-color:#2E75B6;background:#f5f9ff;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.08)}',
    '.rms-welcome-card-label{font-size:1rem;font-weight:700;color:#1B3A5C}',
    '.rms-welcome-card-desc{font-size:.84rem;color:#374151;line-height:1.45}',
    '.rms-welcome-card-when{font-size:.78rem;color:#374151;line-height:1.5;background:#f3f4f6;padding:8px 10px;border-radius:6px}',
    '.rms-welcome-card-when strong{color:#1B3A5C;display:block;margin-bottom:2px}',
    '.rms-welcome-card-cta{font-size:.84rem;font-weight:600;color:#059669;margin-top:auto;align-self:flex-end}',
    '.rms-welcome-skip{margin-top:14px;background:none;border:none;font-size:.78rem;color:#6b7280;cursor:pointer;text-decoration:underline;font-family:inherit;padding:4px 8px}',
    '.rms-welcome-skip:hover{color:#1B3A5C}',
    '@media print{.rms-tabs,.rms-welcome{display:none!important}}'
  ].join('');

  function injectStyles(){
    if(document.getElementById('rms-styles')) return;
    var s = document.createElement('style');
    s.id = 'rms-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  function dismissWelcome(){
    markSeen();
    var w = document.querySelector('.rms-welcome');
    if(w && w.parentNode) w.parentNode.removeChild(w);
    if(typeof gtag !== 'undefined') gtag('event','renta_welcome_dismissed');
  }

  function init(){
    var container = document.querySelector('.container');
    if(!container) return;

    injectStyles();

    var currentId = getCurrentModo();
    setPref(currentId);

    // Tabs van justo después del header; si no hay header, al principio.
    var headerEl = container.querySelector(':scope > .header');
    var anchor = headerEl ? headerEl.nextSibling : container.firstChild;

    var tabsWrap = document.createElement('div');
    tabsWrap.innerHTML = renderTabs(currentId);
    var tabsNode = tabsWrap.firstChild;
    container.insertBefore(tabsNode, anchor);

    // Tabs: registrar pref al hacer click (la navegación del <a> sigue su curso)
    tabsNode.querySelectorAll('.rms-tab[data-modo]').forEach(function(a){
      a.addEventListener('click', function(){
        setPref(a.getAttribute('data-modo'));
        markSeen();
      });
    });

    // Welcome card: solo la primera vez (cualquier modo). Una vez visto, no vuelve.
    if(!isSeen()){
      var welcomeWrap = document.createElement('div');
      welcomeWrap.innerHTML = renderWelcome();
      var welcomeNode = welcomeWrap.firstChild;
      // Insertar inmediatamente después de las tabs
      container.insertBefore(welcomeNode, tabsNode.nextSibling);

      // Click en cualquier card o en "no volver a mostrar"
      welcomeNode.addEventListener('click', function(e){
        var t = e.target.closest('[data-modo],[data-action="dismiss"]');
        if(!t) return;
        if(t.getAttribute('data-action') === 'dismiss'){
          e.preventDefault();
          dismissWelcome();
          return;
        }
        var modo = t.getAttribute('data-modo');
        if(modo){
          setPref(modo);
          markSeen();
          // dejamos que el <a> navegue normalmente
        }
      });
    }

    if(typeof gtag !== 'undefined') gtag('event','renta_modo_visto', { modo: currentId });
  }

  // API pública mínima por si algún archivo necesita disparar acciones
  window.rentaModoSelector = {
    init: init,
    dismissWelcome: dismissWelcome,
    getCurrentModo: getCurrentModo,
    MODOS: MODOS
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
