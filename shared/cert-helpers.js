/* ═══ Aziendale — Helpers comunes del módulo Certificados ═══
   Funciones puras compartidas por los 6 generadores.

   Uso:
     <script src="shared/cert-helpers.js"></script>
     certHelpers.numeroALetras(3500000);  → "TRES MILLONES QUINIENTOS MIL"
     certHelpers.formatCOP(3500000);       → "$3.500.000"
     certHelpers.formatFechaLarga('2026-04-30');  → "30 de abril de 2026"
     certHelpers.esc('<a>');               → "&lt;a&gt;"
     certHelpers.parseCOP('3.500.000');    → 3500000
     certHelpers.diaMesAno(date);          → {dia, mes, ano}  (mes en letras)
*/
(function(){
  'use strict';

  var UNI=['','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE','DIEZ','ONCE','DOCE','TRECE','CATORCE','QUINCE','DIECISÉIS','DIECISIETE','DIECIOCHO','DIECINUEVE','VEINTE','VEINTIUNO','VEINTIDÓS','VEINTITRÉS','VEINTICUATRO','VEINTICINCO','VEINTISÉIS','VEINTISIETE','VEINTIOCHO','VEINTINUEVE'];
  var DEC=['','','','TREINTA','CUARENTA','CINCUENTA','SESENTA','SETENTA','OCHENTA','NOVENTA'];
  var CEN=['','CIENTO','DOSCIENTOS','TRESCIENTOS','CUATROCIENTOS','QUINIENTOS','SEISCIENTOS','SETECIENTOS','OCHOCIENTOS','NOVECIENTOS'];
  var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function centenas(n){
    if(n===0) return '';
    if(n===100) return 'CIEN';
    if(n<30) return UNI[n];
    if(n<100){
      var d=Math.floor(n/10), u=n%10;
      return u? DEC[d]+' Y '+UNI[u] : DEC[d];
    }
    var c=Math.floor(n/100), r=n%100;
    return r? CEN[c]+' '+centenas(r) : CEN[c];
  }
  function miles(n){
    if(n===0) return '';
    if(n===1) return 'MIL';
    if(n<1000) return centenas(n)+' MIL';
    var m=Math.floor(n/1000), r=n%1000;
    var milesPart;
    if(m===1) milesPart='MIL';
    else if(m===21) milesPart='VEINTIÚN MIL';                    // RAE: con tilde (palabra única aguda)
    else milesPart=centenas(m).replace(/ Y UNO$/,' Y UN')+' MIL'; // 31, 41…: "TREINTA Y UN MIL" sin tilde
    return r? milesPart+' '+centenas(r) : milesPart;
  }
  function numeroALetras(n){
    n=Math.floor(Math.abs(Number(n)||0));
    if(n===0) return 'CERO';
    if(n>=1000000000000) return n.toLocaleString('es-CO');
    if(n<1000) return centenas(n);
    if(n<1000000) return miles(n);
    var mill=Math.floor(n/1000000), r=n%1000000;
    var pre=(mill===1)?'UN MILLÓN':centenas(mill)+' MILLONES';
    if(r===0) return pre;
    return pre+' '+(r<1000?centenas(r):miles(r));
  }

  function parseCOP(s){
    var num=parseInt(String(s||'').replace(/[^\d]/g,''),10);
    return isNaN(num)?0:num;
  }
  function formatCOP(n){
    var num=parseCOP(n);
    if(num<=0) return '$0';
    return '$'+num.toLocaleString('es-CO');
  }

  function formatFechaLarga(yyyymmdd){
    if(!yyyymmdd) return '';
    var p=String(yyyymmdd).split('-');
    if(p.length!==3) return yyyymmdd;
    var d=parseInt(p[2],10), m=parseInt(p[1],10), y=p[0];
    if(isNaN(d)||isNaN(m)) return yyyymmdd;
    return d+' de '+MESES[m-1]+' de '+y;
  }

  function diaMesAno(yyyymmdd){
    var p=String(yyyymmdd||'').split('-');
    if(p.length!==3) return {dia:'',mes:'',ano:''};
    var d=parseInt(p[2],10), m=parseInt(p[1],10);
    return {dia:d, mes:MESES[m-1]||'', ano:p[0]};
  }

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  /* ═══ Listener helper: aplica formato miles a un input numérico ═══
     - Acepta solo dígitos
     - Muestra 3.500.000 mientras escribe
     - Devuelve el número limpio en data-raw
  */
  function bindMonedaInput(el, onChange){
    if(!el) return;
    el.addEventListener('input', function(){
      var raw=el.value.replace(/[^\d]/g,'');
      if(raw){
        el.value=parseInt(raw,10).toLocaleString('es-CO');
      } else {
        el.value='';
      }
      el.dataset.raw=raw||'0';
      if(typeof onChange==='function') onChange(parseCOP(raw));
    });
    if(el.value){
      el.dataset.raw=String(parseCOP(el.value));
    }
  }

  /* ═══ Branding del certificado (PRO) ═══ */
  var KEY_BRANDING='exogenadian:cert-branding';
  var DEFAULT_BRANDING={color:'#1B3A5C', font:'DM Sans'};
  var FONTS={
    'DM Sans':"'DM Sans','Segoe UI',sans-serif",
    'Inter':"'Inter','Segoe UI',sans-serif",
    'Source Serif Pro':"'Source Serif Pro','Times New Roman',serif",
    'Georgia':"Georgia,'Times New Roman',serif"
  };
  var GOOGLE_FONT_SLUGS={
    'DM Sans':'DM+Sans:wght@400;500;600;700;800',
    'Inter':'Inter:wght@400;500;600;700;800',
    'Source Serif Pro':'Source+Serif+Pro:wght@400;600;700',
    'Georgia':null
  };

  function brandingGet(){
    try{
      var raw=localStorage.getItem(KEY_BRANDING);
      if(!raw) return Object.assign({}, DEFAULT_BRANDING);
      var b=JSON.parse(raw)||{};
      return {
        color: /^#[0-9A-Fa-f]{6}$/.test(b.color)?b.color:DEFAULT_BRANDING.color,
        font: FONTS[b.font]?b.font:DEFAULT_BRANDING.font
      };
    }catch(e){ return Object.assign({}, DEFAULT_BRANDING); }
  }
  function brandingSet(b){
    try{
      var current=brandingGet();
      var merged=Object.assign({}, current, b||{});
      localStorage.setItem(KEY_BRANDING, JSON.stringify(merged));
      return true;
    }catch(e){ return false; }
  }
  function brandingClear(){ try{ localStorage.removeItem(KEY_BRANDING); }catch(e){} }
  function brandingFontFamily(name){ return FONTS[name]||FONTS['DM Sans']; }
  function brandingFontList(){ return Object.keys(FONTS); }

  function ensureFontLoaded(name){
    var slug=GOOGLE_FONT_SLUGS[name];
    if(!slug) return;
    var id='cert-font-'+name.replace(/\s+/g,'-');
    if(document.getElementById(id)) return;
    var link=document.createElement('link');
    link.id=id; link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family='+slug+'&display=swap';
    document.head.appendChild(link);
  }

  function brandingApply(sheetEl, _isProIgnored){
    // Color y tipografía son gratis: aplica siempre lo que el usuario guardó.
    if(!sheetEl) return;
    var b=brandingGet();
    sheetEl.style.setProperty('--cert-primary', b.color);
    sheetEl.style.setProperty('--cert-font-family', brandingFontFamily(b.font));
    ensureFontLoaded(b.font);
  }

  function autoApplyBranding(){
    var sheet=document.querySelector('.cert-sheet');
    if(!sheet) return;
    brandingApply(sheet);
  }

  // Inyecta el panel de personalización (color + fuente) al final del .cert-form.
  // Color y tipografía son GRATIS. Aplican en pantalla y en el PDF imprimible (Ctrl+P).
  function injectBrandingPanel(){
    var form=document.querySelector('.cert-form');
    if(!form || form.querySelector('.cert-branding-panel')) return;
    var sheet=document.querySelector('.cert-sheet');
    var b=brandingGet();
    var fontOpts=Object.keys(FONTS).map(function(name){
      var labelMap={'DM Sans':'DM Sans (sans moderno)','Inter':'Inter (sans neutro)','Source Serif Pro':'Source Serif Pro (serifa moderna)','Georgia':'Georgia (serifa clásica)'};
      return '<option value="'+name+'"'+(name===b.font?' selected':'')+'>'+(labelMap[name]||name)+'</option>';
    }).join('');
    var html=
      '<details class="cert-branding-panel" style="margin-top:14px;border-top:1px solid #E5E7EB;padding-top:10px">'+
        '<summary style="cursor:pointer;font-weight:700;font-size:.82rem;color:#374151;text-transform:uppercase;letter-spacing:.3px;display:flex;align-items:center;justify-content:space-between;gap:8px">'+
          '<span>🎨 Personalización del certificado</span>'+
        '</summary>'+
        '<div style="margin-top:8px">'+
          '<label style="margin-top:6px">Color del membrete</label>'+
          '<input type="color" class="cb-color" value="'+b.color+'" style="height:36px;padding:3px;cursor:pointer">'+
          '<label style="margin-top:8px">Tipografía</label>'+
          '<select class="cb-font">'+fontOpts+'</select>'+
          '<div style="display:flex;gap:6px;margin-top:10px">'+
            '<button type="button" class="cb-save" style="flex:1;padding:7px 10px;background:#1B3A5C;color:#fff;border:none;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">Guardar</button>'+
            '<button type="button" class="cb-reset" style="flex:1;padding:7px 10px;background:#fff;color:#374151;border:1px solid #D1D5DB;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">Restablecer</button>'+
          '</div>'+
        '</div>'+
      '</details>';
    form.insertAdjacentHTML('beforeend', html);

    var panel=form.querySelector('.cert-branding-panel');
    var colInput=panel.querySelector('.cb-color');
    var fontSel=panel.querySelector('.cb-font');
    var saveBtn=panel.querySelector('.cb-save');
    var resetBtn=panel.querySelector('.cb-reset');
    function previewLive(){
      if(!sheet) return;
      sheet.style.setProperty('--cert-primary', colInput.value);
      sheet.style.setProperty('--cert-font-family', brandingFontFamily(fontSel.value));
      ensureFontLoaded(fontSel.value);
    }
    colInput.addEventListener('input', previewLive);
    fontSel.addEventListener('change', previewLive);
    saveBtn.addEventListener('click', function(){
      brandingSet({color:colInput.value, font:fontSel.value});
      (window.exoToast||{success:alert}).success('Personalización guardada');
    });
    resetBtn.addEventListener('click', function(){
      brandingClear();
      colInput.value=DEFAULT_BRANDING.color;
      fontSel.value=DEFAULT_BRANDING.font;
      previewLive();
      if(sheet) brandingApply(sheet);
      (window.exoToast||{success:alert}).success('Personalización restablecida');
    });
  }

  // Marca visualmente los botones de "Descargar Word" como PRO cuando el usuario es gratis.
  function annotateWordButtons(isPro){
    if(isPro) return;
    var btns=Array.prototype.filter.call(document.querySelectorAll('button'), function(b){
      var on=b.getAttribute('onclick')||'';
      return /Descargar.{0,3}Word/i.test(b.textContent||'') ||
             /descargarWord|descargarActivo|downloadAsWord/.test(on);
    });
    btns.forEach(function(b){
      if(b.dataset.proAnnotated) return;
      b.dataset.proAnnotated='1';
      b.title='La descarga en Word es PRO. Usa Ctrl/⌘ + P para guardar como PDF gratis.';
      var badge=document.createElement('span');
      badge.textContent='PRO';
      badge.style.cssText='display:inline-block;background:#1B3A5C;color:#fff;font-size:.6rem;font-weight:700;padding:1px 6px;border-radius:999px;margin-left:6px;letter-spacing:.3px;vertical-align:middle';
      b.appendChild(badge);
    });
  }

  function bootBranding(){
    autoApplyBranding();
    injectBrandingPanel();
    if(window.exoPro && window.exoPro.check){
      window.exoPro.check().then(function(isPro){ annotateWordButtons(isPro); });
    } else {
      annotateWordButtons(false);
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', bootBranding);
  } else {
    bootBranding();
  }

  /* ═══ Descarga Word ═══
     Genera .doc (HTML con MIME application/msword) — sin dependencias externas.
     Word, LibreOffice y Google Docs lo abren correctamente.
     Solo PRO: usuarios gratis pueden imprimir como PDF con Ctrl/⌘ + P.
  */
  function downloadAsWord(sheetEl, filename){
    if(!sheetEl) return;
    // Fallback optimista contra race condition: en cada cert hay un
    // exoPro.check().then(isPro => sheet.setAttribute('data-pro','1')) que
    // es async. Si el usuario PRO clickea "Descargar Word" antes de que
    // resuelva (primera visita, latencia de red), data-pro queda sin
    // setear y la descarga falla mostrando el toast "es PRO" a un
    // usuario que SÍ es PRO. Aplica el mismo patrón optimista que ya
    // documentamos para las IA: si hay email/key guardado en localStorage,
    // asumimos PRO y seteamos data-pro al vuelo.
    var isPro=sheetEl.getAttribute('data-pro')==='1';
    if(!isPro && window.exoPro && typeof exoPro.getSaved==='function'){
      try{ if(exoPro.getSaved()){ isPro=true; sheetEl.setAttribute('data-pro','1'); } }catch(_){}
    }
    if(!isPro){
      var msg='La descarga en Word es PRO. Usa Ctrl/⌘ + P para guardar como PDF gratis. Activa PRO en exogenadian.com/pro.html';
      if(window.exoToast && exoToast.info){ exoToast.info(msg); }
      else { alert(msg); }
      return;
    }
    var b=brandingGet();
    var fontStack=brandingFontFamily(b.font)+',"Calibri",sans-serif';
    var primary=b.color;

    // CSS mínimo embebido (Word respeta lo básico). Las imágenes base64 funcionan desde Word 2007.
    var css = '@page{size:A4;margin:25mm 22mm}'+
      'body{font-family:'+fontStack+';font-size:11pt;line-height:1.55;color:#111}'+
      'h1{font-size:14pt;font-weight:bold;text-align:center;letter-spacing:.5px;text-transform:uppercase;margin:0 0 14pt}'+
      'h2{font-size:11pt;font-weight:bold;margin:18pt 0 6pt}'+
      'p{margin:0 0 10pt;text-align:justify}'+
      'strong{font-weight:bold}'+
      'table{width:100%;border-collapse:collapse;margin:8pt 0 12pt;font-size:10.5pt}'+
      'table th,table td{border:1px solid #888;padding:6pt 8pt;text-align:left}'+
      'table th{background:#F3F4F6;font-weight:bold}'+
      '.num{text-align:right}'+
      '.cert-membrete{border-bottom:1.5pt solid '+primary+';padding-bottom:10pt;margin-bottom:18pt}'+
      '.cert-membrete-info .nombre{font-weight:bold;font-size:12.5pt}'+
      '.cert-membrete-info .sub{font-size:9.5pt;color:#444;margin-top:2pt}'+
      '.cert-fecha{margin-bottom:18pt}'+
      '.cert-firma{margin-top:30pt;padding-top:16pt}'+
      '.cert-firma img{max-height:60pt}'+
      '.cert-firma .firma-linea{display:inline-block;width:200pt;border-top:1pt solid #111;margin-top:14pt;padding-top:4pt;font-weight:bold}'+
      '.cert-firma .firma-datos{font-size:10pt;line-height:1.5}'+
      '.cert-marca-agua{margin-top:30pt;text-align:center;font-size:8.5pt;color:#9CA3AF;font-style:italic;border-top:.5pt solid #E5E7EB;padding-top:10pt}';

    // Clonar el sheet y quitar marca de agua (solo PRO descarga, así que no necesita la marca)
    var clone=sheetEl.cloneNode(true);
    var wm=clone.querySelector('.cert-marca-agua');
    if(wm) wm.remove();
    var sheetHTML=clone.outerHTML;

    var html='<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'+
      '<head><meta charset="utf-8"><title>'+esc(filename)+'</title>'+
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->'+
      '<style>'+css+'</style></head><body>'+sheetHTML+'</body></html>';

    var blob=new Blob(['﻿', html], {type:'application/msword'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;
    a.download=(filename||'certificado')+'.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 100);
  }

  // Si el select solo tiene la opción placeholder ("Llenar manualmente"),
  // oculta el select+label porque no hay nada que elegir.
  function hideEmptySelect(selectId){
    var sel=document.getElementById(selectId);
    if(!sel) return;
    if(sel.options.length<=1){
      sel.style.display='none';
      var lbl=document.querySelector('label[for="'+selectId+'"]');
      if(lbl) lbl.style.display='none';
    }
  }

  // Auto-oculta selects de libreta vacíos en cada cert.
  // Corre en next tick para dar tiempo al IIFE inline a poblar el select.
  function autoHideEmptyLibretaSelects(){
    ['cliSelect','empSelect'].forEach(hideEmptySelect);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(autoHideEmptyLibretaSelects,0); });
  } else {
    setTimeout(autoHideEmptyLibretaSelects,0);
  }

  window.certHelpers={
    numeroALetras: numeroALetras,
    formatCOP: formatCOP,
    parseCOP: parseCOP,
    formatFechaLarga: formatFechaLarga,
    diaMesAno: diaMesAno,
    esc: esc,
    bindMonedaInput: bindMonedaInput,
    downloadAsWord: downloadAsWord,
    hideEmptySelect: hideEmptySelect,
    MESES: MESES
  };

  window.certBranding={
    get: brandingGet,
    set: brandingSet,
    clear: brandingClear,
    apply: brandingApply,
    fontList: brandingFontList,
    fontFamily: brandingFontFamily,
    ensureFontLoaded: ensureFontLoaded,
    DEFAULT: DEFAULT_BRANDING,
    KEY: KEY_BRANDING
  };
})();
