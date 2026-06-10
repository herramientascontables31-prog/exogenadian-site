/* ExógenaDIAN — Error tracker
 *
 * Captura errores TÉCNICOS del navegador y los envía al backend para que
 * podamos arreglarlos. NO captura datos personales, contenido de archivos
 * cargados ni valores de inputs — solo el mensaje de error de JavaScript,
 * la URL de la herramienta y el navegador.
 *
 * Privacidad:
 *   - Throttle por sesión: cada error idéntico se reporta UNA vez por sesión.
 *   - Opt-out total: localStorage.setItem('exo_no_track','1').
 *   - Async + try/catch: si el endpoint cae, la página sigue funcionando.
 */
(function(){
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try { if (localStorage.getItem('exo_no_track') === '1') return; } catch(_) { return; }

  var ENDPOINT = 'https://dian-proxy-337146111457.southamerica-east1.run.app/api/error-log';
  var SEEN_KEY = '_exo_err_seen';
  var MAX_STACK = 1000;
  var MAX_MESSAGE = 400;

  // Tool name = nombre del HTML sin extensión
  function getTool(){
    var p = (location.pathname || '').replace(/\/$/, '');
    var last = p.split('/').pop() || 'index';
    return last.replace(/\.html?$/, '') || 'index';
  }

  // Signature del error para deduplicar (sin payload variable)
  function sig(type, msg, file, line){
    return type + '|' + (msg||'').slice(0,120) + '|' + (file||'').slice(-40) + ':' + (line||0);
  }

  function alreadySent(s){
    try {
      var raw = sessionStorage.getItem(SEEN_KEY);
      var seen = raw ? JSON.parse(raw) : {};
      if (seen[s]) return true;
      seen[s] = 1;
      // Cap a 50 firmas distintas por sesión para no llenar sessionStorage
      var keys = Object.keys(seen);
      if (keys.length > 50) { delete seen[keys[0]]; }
      sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
      return false;
    } catch(_) { return false; }
  }

  function send(payload){
    try {
      var body = JSON.stringify(payload);
      // sendBeacon es ideal: no bloquea unload ni rinde error si falla
      if (navigator.sendBeacon){
        var blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(ENDPOINT, blob);
        return;
      }
      // Fallback: fetch keepalive
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
        mode: 'cors'
      }).catch(function(){});
    } catch(_) {}
  }

  // ¿El error viene de nuestro código (mismo origin) o de una extensión/script externo?
  // Chrome a veces atribuye errores de extensiones al document padre, pero el stack los expone.
  function esNuestroError(filename, stack, message){
    var blob = (filename || '') + '\n' + (stack || '') + '\n' + (message || '');
    // Patrones típicos de extensiones / scripts externos / inyecciones
    if (/(?:chrome|moz|safari|edge|ms-browser)-extension:\/\//i.test(blob)) return false;
    if (/^(?:webkit|moz|chrome)-masked-url:\/\//i.test(filename||'')) return false;
    // Funciones que sabemos NO son nuestras (lista de bots y extensiones conocidas)
    var ajenos = [
      'cargarData', 'Cookiebot', 'gtag is not defined', 'fbq is not defined',
      'ResizeObserver loop', 'Script error.', '__gCrWeb', 'Sentry', 'webkit.messageHandlers',
      'inpage.js', 'evmAsk', 'walletconnect', 'metamask', 'phantom',
      'instantSearchSDKJSBridge', 'EmbeddedDashboard'
    ];
    for (var i=0; i<ajenos.length; i++){
      if (message && message.indexOf(ajenos[i]) >= 0) return false;
    }
    // Si el filename apunta a un dominio externo (que no es nuestro ni vacío), filtrar
    if (filename){
      try {
        var u = new URL(filename, location.href);
        if (u.hostname && u.hostname !== location.hostname && !u.hostname.endsWith('exogenadian.com')) return false;
      } catch(_){}
    }
    return true;
  }

  function report(type, message, stack, filename, lineNo, colNo){
    try {
      message = String(message || '').slice(0, MAX_MESSAGE);
      stack = stack ? String(stack).slice(0, MAX_STACK) : '';
      filename = String(filename || '').slice(0, 200);

      // Filtrar errores que sabemos vienen de extensiones / scripts externos
      if (type === 'js_error' && !esNuestroError(filename, stack, message)) return;

      var s = sig(type, message, filename, lineNo);
      if (alreadySent(s)) return;

      send({
        v: 1,
        ts: new Date().toISOString(),
        tool: getTool(),
        path: location.pathname,
        type: type,
        message: message,
        stack: stack,
        filename: filename,
        lineNo: lineNo || 0,
        colNo: colNo || 0,
        ua: (navigator.userAgent || '').slice(0, 200),
        lang: (navigator.language || '').slice(0, 10),
        screen: (screen.width||0) + 'x' + (screen.height||0),
        viewport: (window.innerWidth||0) + 'x' + (window.innerHeight||0)
      });
    } catch(_) {}
  }

  // 1) JS errors (sintaxis, runtime, etc.)
  window.addEventListener('error', function(e){
    if (e && e.error){
      report('js_error', e.message, e.error.stack, e.filename, e.lineno, e.colno);
    } else if (e && e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')){
      // Recurso (imagen/script/css) que falló al cargar
      report('resource_error', (e.target.tagName||'') + ' falló: ' + (e.target.src || e.target.href || ''), '', e.target.src || e.target.href, 0, 0);
    } else if (e){
      report('js_error', e.message || 'unknown', '', e.filename, e.lineno, e.colno);
    }
  }, true);

  // 2) Promesas no manejadas
  window.addEventListener('unhandledrejection', function(e){
    var r = e && e.reason;
    var msg = r && r.message ? r.message : (typeof r === 'string' ? r : 'unhandled rejection');
    var stack = r && r.stack ? r.stack : '';
    report('unhandled_rejection', msg, stack, '', 0, 0);
  });

  // 3) Fetch fails (network errors, CORS, 5xx). No tocamos los 4xx esperables.
  if (typeof window.fetch === 'function'){
    var origFetch = window.fetch.bind(window);
    window.fetch = function(input, init){
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      return origFetch(input, init).then(function(resp){
        if (resp && resp.status >= 500){
          report('fetch_5xx', resp.status + ' ' + (resp.statusText||'') + ' ' + url, '', url, 0, 0);
        }
        return resp;
      }).catch(function(err){
        // Solo reportar errores reales de red — no abortar la promesa
        if (url && url.indexOf(ENDPOINT) === -1){
          report('fetch_failed', (err && err.message) || 'network error: ' + url, (err && err.stack) || '', url, 0, 0);
        }
        throw err;
      });
    };
  }

  // 4) Manual: window.exoReportError(msg) por si una herramienta quiere
  // reportar un caso concreto (ej. archivo Excel sin encabezado detectado).
  window.exoReportError = function(msg, extra){
    report('manual', msg, extra ? JSON.stringify(extra).slice(0,500) : '', location.pathname, 0, 0);
  };
})();
