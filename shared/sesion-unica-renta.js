/* ═══ Aziendale — Sesión única en la suite de RENTA (scope 'renta') ═══
   Un dispositivo a la vez por cuenta PRO en renta-personas-naturales.html y
   formato210-pro.html (mismo puesto: abrir cualquiera de las dos lo reclama).

   · Al ABRIR la página (con credencial PRO guardada) se RECLAMA el puesto:
     el dispositivo anterior queda por fuera ("el último en abrir gana").
   · Un timer (10 min) y el volver a la pestaña verifican el puesto; si otro
     dispositivo lo reclamó, se bloquea la página con un aviso y el botón
     "Usar aquí" para retomarla.
   · Usuarios sin credencial guardada (gratis/anónimos): no aplica.
   · Fail-open: red caída o Apps Script sin soporte de scope → nunca bloquea.
   Requiere shared/pro.js (exoPro.session). */
(function(){
  'use strict';
  var SCOPE='renta';
  var CFG=window.SESION_UNICA_CFG||{};          // override solo para tests
  var CHECK_MS=CFG.checkMs||10*60*1000;         // verificación periódica
  var VIS_THROTTLE=CFG.visMs!=null?CFG.visMs:60*1000; // al volver a la pestaña, máx. 1/min
  var ultimaVerif=0, bloqueada=false;

  function tieneCuenta(){
    return !!(window.exoPro && exoPro.getSaved && exoPro.getSaved());
  }

  function overlay(){
    var el=document.getElementById('sesionUnicaOverlay');
    if(el) return el;
    el=document.createElement('div');
    el.id='sesionUnicaOverlay';
    el.setAttribute('role','alertdialog');
    el.style.cssText='position:fixed;inset:0;z-index:999998;background:rgba(15,23,42,.72);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px';
    el.innerHTML='<div style="background:#fff;border-radius:16px;max-width:430px;width:100%;padding:28px;text-align:center;font-family:inherit;box-shadow:0 24px 60px -12px rgba(0,0,0,.35)">'
      +'<div style="font-size:2rem;margin-bottom:8px">🔒</div>'
      +'<h2 style="margin:0 0 8px;font-size:1.15rem;color:#0f172a">Tu cuenta está en uso en otro dispositivo</h2>'
      +'<p style="margin:0 0 18px;color:#475569;font-size:.92rem;line-height:1.5">La suite de renta funciona en <b>un dispositivo a la vez</b>. '
      +'Alguien abrió la herramienta con tu cuenta en otro equipo, así que esta sesión quedó en pausa. '
      +'Si eres tú, puedes retomarla aquí (el otro equipo quedará en pausa).</p>'
      +'<button id="sesionUnicaRetomar" style="background:#059669;color:#fff;border:0;border-radius:12px;padding:12px 26px;font-size:.95rem;font-weight:700;cursor:pointer;width:100%">Usar aquí</button>'
      +'<a href="index.html" style="display:inline-block;margin-top:12px;color:#64748b;font-size:.85rem">Volver al inicio</a>'
      +'</div>';
    document.body.appendChild(el);
    document.getElementById('sesionUnicaRetomar').addEventListener('click', function(){
      var b=this; b.disabled=true; b.textContent='Retomando…';
      exoPro.session(SCOPE, true).then(function(){
        b.disabled=false; b.textContent='Usar aquí';
        desbloquear();
      });
    });
    return el;
  }

  function bloquear(){
    if(bloqueada) return;
    bloqueada=true;
    overlay().style.display='flex';
    if(typeof gtag!=='undefined') gtag('event','sesion_unica_renta_bloqueada');
  }
  function desbloquear(){
    bloqueada=false;
    var el=document.getElementById('sesionUnicaOverlay');
    if(el) el.style.display='none';
  }

  function verificar(){
    if(!tieneCuenta() || bloqueada) return;
    ultimaVerif=Date.now();
    exoPro.session(SCOPE, false).then(function(r){
      if(r && r.valid===false) bloquear();
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    if(!window.exoPro || !exoPro.session) return;
    if(!tieneCuenta()) return;
    // Abrir la página reclama el puesto (expulsa al dispositivo anterior).
    ultimaVerif=Date.now();
    exoPro.session(SCOPE, true);
    setInterval(verificar, CHECK_MS);
    document.addEventListener('visibilitychange', function(){
      if(document.visibilityState==='visible' && (Date.now()-ultimaVerif)>VIS_THROTTLE) verificar();
    });
  });
})();
