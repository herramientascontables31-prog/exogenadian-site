/* ═══ ExógenaDIAN — Nota Auditor ═══
   Reencuadre de mentalidad en las herramientas de formulario: el resultado lo
   prediligenció un ALGORITMO (no IA) a partir de los datos cargados; el
   contador audita y responde. Calmado, una línea, no bloquea, descartable
   por sesión (reaparece la próxima visita: cadencia de aprendizaje, sin saturar).

   Auto-restringido por pathname a la lista de herramientas de formulario, así
   que es inofensivo aunque se cargue en otra página.

   Uso: <script src="shared/nota-auditor.js"></script>
*/
(function(){
  'use strict';
  if(window.__exoNotaAuditor) return;
  window.__exoNotaAuditor = true;

  // Solo herramientas que prediligencian un formulario DIAN desde el balance.
  var TOOLS = {
    'renta110':1,'renta260':1,'renta-juridica':1,'renta-personas-naturales':1,
    'formato210':1,'formato210-pro':1,
    'iva300':1,'retencion350':1,'formato2516':1,'patrimonio420':1,
    'exogena':1,'exogena-suite':1,'regimen-simple':1,'formato2593':1
  };

  function page(){
    return location.pathname
      .replace(/^\/|\.html$/g,'')
      .replace(/\/+$/,'')
      .replace(/^docs\//,'');
  }
  if(!TOOLS[page()]) return;

  var OFF_KEY='exo_nota_auditor_off';
  try{ if(sessionStorage.getItem(OFF_KEY)) return; }catch(_){}

  function build(){
    if(document.getElementById('exo-nota-auditor')) return;

    var css=document.createElement('style');
    css.textContent=
      '#exo-nota-auditor{position:fixed;left:50%;transform:translateX(-50%) translateY(120%);'+
      'bottom:16px;z-index:9998;max-width:680px;width:calc(100% - 32px);'+
      'background:#fff;border:1px solid #E5E7EB;border-left:4px solid #4F46E5;'+
      'border-radius:12px;box-shadow:0 8px 28px rgba(15,23,42,.12);'+
      'font-family:Outfit,system-ui,sans-serif;display:flex;align-items:flex-start;'+
      'gap:12px;padding:13px 16px;transition:transform .4s cubic-bezier(.22,1,.36,1)}'+
      '#exo-nota-auditor.show{transform:translateX(-50%) translateY(0)}'+
      '#exo-nota-auditor .ic{font-size:1.05rem;line-height:1.4;flex-shrink:0}'+
      '#exo-nota-auditor p{margin:0;font-size:.83rem;line-height:1.5;color:#374151}'+
      '#exo-nota-auditor strong{color:#312E81;font-weight:700}'+
      '#exo-nota-auditor button{flex-shrink:0;align-self:center;background:#EEF2FF;'+
      'color:#4338CA;border:1px solid #C7D2FE;border-radius:8px;padding:7px 13px;'+
      'font-family:inherit;font-size:.78rem;font-weight:700;cursor:pointer;'+
      'white-space:nowrap;transition:background .15s}'+
      '#exo-nota-auditor button:hover{background:#E0E7FF}'+
      '@media(max-width:560px){#exo-nota-auditor{flex-wrap:wrap;gap:8px}'+
      '#exo-nota-auditor button{width:100%}}';
    document.head.appendChild(css);

    var bar=document.createElement('div');
    bar.id='exo-nota-auditor';
    bar.setAttribute('role','note');
    bar.innerHTML=
      '<span class="ic" aria-hidden="true">🔎</span>'+
      '<p>Un <strong>algoritmo</strong> prediligenció esto con lo que cargaste — '+
      'revísalo antes de presentarlo a la DIAN. No te hace más lento: te hace '+
      'el contador que no comete el error.</p>'+
      '<button type="button" aria-label="Entendido, ocultar nota">Entendido</button>';
    document.body.appendChild(bar);

    bar.querySelector('button').addEventListener('click',function(){
      try{ sessionStorage.setItem(OFF_KEY,'1'); }catch(_){}
      bar.classList.remove('show');
      setTimeout(function(){ if(bar.parentNode) bar.parentNode.removeChild(bar); },420);
    });

    // Aparece tras un respiro, no de golpe al cargar.
    setTimeout(function(){ bar.classList.add('show'); }, 1200);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',build);
  }else{
    build();
  }
})();
