/* ═══ Aziendale — Asesor Mode (white-label para contadores) ═══
   Cuando el contador activa "modo asesor", los reportes de finanzas
   personales salen con el branding de su firma en el footer.

   Requisitos para que funcione:
   - Usuario PRO (exoPro.check === true)
   - Perfil del contador con nombre + TP/CC (perfilContador.has === true)
   - Flag activo (asesorMode.isOn() === true)

   Uso:
     <script src="shared/perfil-contador.js"></script>
     <script src="shared/asesor-mode.js"></script>
     <script>
       asesorMode.isOn();             // boolean
       asesorMode.set(true|false);    // toggle
       asesorMode.getBranding();      // {nombre, tp, ciudad, ...} | null si no aplica
       asesorMode.footerLine();       // string de una línea para imprimir
       asesorMode.guard(callback);    // ejecuta callback si PRO+perfil; si no, mensaje
     </script>
*/
(function(){
  'use strict';
  var KEY='exogenadian:modo-asesor';

  function isOn(){
    try{ return localStorage.getItem(KEY)==='1'; }catch(e){ return false; }
  }
  function set(v){
    try{
      if(v) localStorage.setItem(KEY,'1');
      else localStorage.removeItem(KEY);
      return true;
    }catch(e){ return false; }
  }
  function getBranding(){
    if(!isOn()) return null;
    if(typeof window.perfilContador==='undefined' || !window.perfilContador.has()) return null;
    var p=window.perfilContador.get();
    return {
      nombre: p.nombre || '',
      tp: p.tp || '',
      cc: p.cc || '',
      ciudad: p.ciudad || '',
      firma: p.firmaNombre || p.empresa || '',
      nit: p.nit || ''
    };
  }
  function footerLine(){
    var b=getBranding();
    if(!b) return '';
    var partes=[];
    if(b.firma) partes.push(b.firma);
    else if(b.nombre) partes.push(b.nombre);
    if(b.nit) partes.push('NIT '+b.nit);
    else if(b.tp) partes.push('TP '+b.tp);
    return partes.length ? 'Asesoría preparada por: '+partes.join(' · ') : '';
  }
  function guard(callback, onFail){
    var hasProfile = (typeof window.perfilContador!=='undefined' && window.perfilContador.has());
    function withPro(isPro){
      if(!isPro){ if(onFail) onFail('pro'); return; }
      if(!hasProfile){ if(onFail) onFail('perfil'); return; }
      callback(getBranding());
    }
    if(window.exoPro && window.exoPro.check) window.exoPro.check().then(withPro);
    else withPro(false);
  }

  window.asesorMode={isOn:isOn,set:set,getBranding:getBranding,footerLine:footerLine,guard:guard};
})();
