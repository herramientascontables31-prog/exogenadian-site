/* ExógenaDIAN — Service Worker (PWA instalable + respaldo offline).
   Estrategia NETWORK-FIRST para TODO: siempre se sirve lo más fresco (deploys frecuentes
   en temporada de renta — jamás una versión vieja), y el caché queda como respaldo
   cuando no hay conexión. Portado del patrón de Deventia, jul-2026. */
'use strict';
var VERSION = 'v1';
var CACHE = 'exogenadian-' + VERSION;

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE && k.indexOf('exogenadian-') === 0) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function offlineFallback(){
  return new Response(
    '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">' +
    '<title>Sin conexión — ExógenaDIAN</title>' +
    '<style>body{font-family:system-ui,Arial,sans-serif;background:#F9FAFB;color:#111827;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px}a{color:#059669}</style>' +
    '<div><h1 style="font-size:1.4rem">Estás sin conexión</h1>' +
    '<p>Las páginas que ya visitaste siguen disponibles. Reintenta cuando vuelva la señal.</p>' +
    '<p><a href="/">Volver al inicio</a></p></div>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return; // no interceptar terceros (GA, APIs)
  e.respondWith(
    fetch(req).then(function(res){
      // Guardar copia fresca como respaldo offline
      if(res && res.status === 200){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){
        if(hit) return hit;
        if(req.mode === 'navigate') return offlineFallback();
        return new Response('', { status: 504 });
      });
    })
  );
});
