/* ═══ Aziendale — Gate de descarga PRO ═══
   Uso:
     <script src="shared/pro.js"></script>
     <script src="shared/pro-gate.js"></script>
     ...
     async function descargarExcel(){
       if(!(await exoProGate('F1004'))) return;
       // ...resto de la descarga
     }
   Devuelve true si el usuario es PRO, false si no (y muestra modal).
*/
(function(){
  'use strict';

  function showModal(formato){
    if(document.getElementById('exoProGateOverlay'))return;
    var ov=document.createElement('div');
    ov.id='exoProGateOverlay';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Outfit,system-ui,sans-serif';
    ov.innerHTML='<div style="background:#fff;border-radius:16px;padding:32px;max-width:460px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)">'+
      '<div style="font-size:2.5rem;margin-bottom:12px">🔒</div>'+
      '<h3 style="font-family:Fraunces,serif;font-size:1.35rem;color:#111827;margin-bottom:8px;font-weight:700">Descarga del Excel requiere PRO</h3>'+
      '<p style="color:#6B7280;font-size:.9rem;margin-bottom:22px">La generación del Excel <strong>'+formato+'</strong> listo para Prevalidador es una función PRO. La calculadora y la vista previa son gratis.</p>'+
      '<a href="precios.html" style="display:inline-flex;align-items:center;gap:6px;padding:13px 32px;background:#059669;color:#fff;border-radius:12px;font-weight:700;font-size:.95rem;text-decoration:none">Desbloquear con PRO — desde $49.900/mes</a>'+
      '<div style="margin-top:18px;padding-top:14px;border-top:1px solid #E5E7EB;font-size:.78rem;color:#9CA3AF">¿Ya tienes PRO? <a href="precios.html" style="color:#059669;font-weight:600;text-decoration:none">Activar suscripción →</a></div>'+
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.remove()});
    var esc=function(e){if(e.key==='Escape'){ov.remove();document.removeEventListener('keydown',esc)}};
    document.addEventListener('keydown',esc);
    if(typeof gtag==='function')gtag('event','pro_gate_shown',{formato:formato||'desconocido'});
  }

  window.exoProGate=async function(formato){
    if(typeof window.exoPro==='undefined'){
      // pro.js no cargado — fallback: enviar a precios
      location.href='precios.html';
      return false;
    }
    try{
      var ok=await window.exoPro.check();
      if(!ok){ showModal(formato||'de esta herramienta'); return false; }
      return true;
    }catch(e){
      showModal(formato||'de esta herramienta');
      return false;
    }
  };
})();
