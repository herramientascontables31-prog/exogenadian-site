/* ═══ Aziendale — Sincronización de la cartera de clientes (cuentas PRO) ═══
   La cartera (localStorage 'oficina_clientes' + 'oficina_estado') sigue al
   contador a cualquier dispositivo donde active su correo PRO:
     · PULL al cargar la página (throttle 5 min por pestaña): si el servidor
       tiene una foto más nueva que la última vista aquí, se aplica y se emite
       'carteraSyncApplied' para que la página re-renderice.
     · PUSH debounced (4 s) al evento 'oficinaClientesUpdated' (lo disparan
       las páginas que escriben la cartera). Nunca sube una foto vacía y
       dedupe por JSON. Gana el último cambio (last-write-wins).
   Gratis/anónimos: no hace nada — su cartera vive solo en este navegador.
   Backend: mailer api/oficina/{sync,backup} (validación PRO dura en el push;
   el pull avisa al buzón del dueño la primera vez que un dispositivo nuevo
   sincroniza). Requiere shared/pro.js. */
(function(){
  'use strict';
  var API=(location.hostname==='localhost'||location.hostname==='127.0.0.1')
    ?'http://localhost:3000':'https://api.exogenadian.com';
  var K_SEEN='oficina_cartera_seen';        // updatedAt del servidor ya aplicado/subido
  var K_LOCALTS='oficina_cartera_localts';  // ts del último cambio local sin subir
  var PULL_THROTTLE=5*60*1000;

  function emailPro(){
    try{
      var v=(window.exoPro&&exoPro.getSaved&&exoPro.getSaved())||'';
      return /@/.test(v)?v.trim().toLowerCase():'';
    }catch(_){ return ''; }
  }
  function device(){
    try{ return (window.exoPro&&exoPro.getDeviceFingerprint&&exoPro.getDeviceFingerprint())||''; }catch(_){ return ''; }
  }
  function ls(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(_){ } }
  function loadClients(){ try{ return JSON.parse(ls('oficina_clientes'))||[]; }catch(_){ return []; } }
  function loadEstado(){ try{ return JSON.parse(ls('oficina_estado'))||{}; }catch(_){ return {}; } }

  /* ── PULL: aplicar la foto del servidor si es más nueva ── */
  function pull(){
    var email=emailPro(); if(!email) return;
    try{
      var last=parseInt(sessionStorage.getItem('cartera_sync_pull')||'0',10);
      if(last && (Date.now()-last)<PULL_THROTTLE) return;
      sessionStorage.setItem('cartera_sync_pull', String(Date.now()));
    }catch(_){ }
    fetch(API+'/api/oficina/sync',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:email, device:device()})
    }).then(function(r){ return r.ok?r.json():null; }).then(function(d){
      if(!d||!d.backup||!Array.isArray(d.backup.clientes)||!d.backup.clientes.length) return;
      var srvTs=Date.parse(d.backup.updatedAt||'')||0;
      var seen=Date.parse(ls(K_SEEN)||'')||0;
      var localTs=parseInt(ls(K_LOCALTS)||'0',10);
      if(srvTs && srvTs<=seen) return;                 // ya tenemos esta foto
      if(localTs && localTs>srvTs){ schedulePush(); return; } // lo local es más nuevo: subir en vez de pisar
      set('oficina_clientes', JSON.stringify(d.backup.clientes));
      if(d.backup.estado) set('oficina_estado', JSON.stringify(d.backup.estado));
      set(K_SEEN, d.backup.updatedAt||new Date().toISOString());
      set(K_LOCALTS,'0');
      try{ document.dispatchEvent(new CustomEvent('carteraSyncApplied',{detail:{clientes:d.backup.clientes.length}})); }catch(_){ }
    }).catch(function(){ /* red caída: la cartera local sigue mandando */ });
  }

  /* ── PUSH: subir la cartera local (debounced, nunca vacía, dedupe) ── */
  var pushTimer=null, lastJson=null;
  function doPush(){
    var email=emailPro(); if(!email) return;
    var clients=loadClients();
    if(!clients.length) return;                         // nunca pisar un respaldo bueno con una foto vacía
    var payload=JSON.stringify({email:email, clients:clients, estado:loadEstado(), device:device()});
    if(payload===lastJson) return;
    fetch(API+'/api/oficina/backup',{
      method:'POST',headers:{'Content-Type':'application/json'},body:payload
    }).then(function(r){ return r.ok?r.json():null; }).then(function(d){
      if(!d||!d.ok) return;
      lastJson=payload;
      if(d.updatedAt) set(K_SEEN, d.updatedAt);
      set(K_LOCALTS,'0');
    }).catch(function(){ /* reintenta en el próximo cambio */ });
  }
  function schedulePush(){
    clearTimeout(pushTimer);
    pushTimer=setTimeout(doPush, 4000);
  }

  document.addEventListener('oficinaClientesUpdated', function(){
    set(K_LOCALTS, String(Date.now()));
    schedulePush();
  });

  document.addEventListener('DOMContentLoaded', function(){
    if(!window.exoPro) return;
    // Solo cuentas PRO válidas (check() cachea 1h; si la red falla es optimista).
    exoPro.check().then(function(ok){ if(ok) pull(); }).catch(function(){});
  });

  window.carteraSync={ pull:pull, push:schedulePush };
})();
