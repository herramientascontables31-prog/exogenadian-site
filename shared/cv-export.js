/* ═══ ExógenaDIAN — Exportación de Hoja de Vida ═══
   PDF (gratis, vía print) · Word .doc (PRO) · Página web .html autónoma (PRO).
   Depende de CVBuilder (estado) y de exoPro (gating). 100% client-side.
*/
(function(){
  'use strict';
  if(window.CVExport) return;

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  function isPro(){
    try{ if(window.exoPro){
      if(typeof exoPro.getSaved==='function' && exoPro.getSaved()) return true;
    }}catch(e){}
    return false;
  }
  function requirePro(accion){
    if(isPro()) return true;
    var msg='“'+accion+'” es una función PRO. Usa Ctrl/⌘ + P para guardar como PDF gratis, o activa PRO en exogenadian.com/precios.html';
    (window.exoToast&&exoToast.info?exoToast.info:alert)(msg);
    return false;
  }

  function fileBase(){
    var d=(window.CVBuilder&&CVBuilder.getData)?CVBuilder.getData():{personal:{}};
    var n=(d.personal&&d.personal.nombre)||'hoja-de-vida';
    return ('hoja-de-vida-'+n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  // CSS de plantillas resuelto para export (vars → literales). Cacheado.
  var _cssPromise=null;
  function loadCss(){
    if(_cssPromise) return _cssPromise;
    _cssPromise=fetch('shared/cv-templates.css').then(function(r){return r.ok?r.text():'';}).catch(function(){return '';});
    return _cssPromise;
  }
  function resolveVars(css,st){
    var fonts={'DM Sans':"'DM Sans','Segoe UI',sans-serif",'Inter':"'Inter','Segoe UI',sans-serif",
      'Source Serif Pro':"'Source Serif Pro','Georgia',serif",'Georgia':"Georgia,'Times New Roman',serif",
      'Lato':"'Lato','Segoe UI',sans-serif"};
    var gap=st.branding.density==='compact'?'12px':(st.branding.density==='airy'?'26px':'18px');
    return css.replace(/var\(--cv-accent\)/g,st.branding.accent)
              .replace(/var\(--cv-font\)/g,fonts[st.branding.font]||fonts['DM Sans'])
              .replace(/var\(--cv-gap\)/g,gap);
  }

  function sheetClone(removeWm){
    var sheet=$('cvSheet'); if(!sheet) return null;
    var c=sheet.cloneNode(true);
    if(removeWm){ var w=c.querySelector('.cv-wm'); if(w) w.remove(); }
    return c;
  }
  function gfontLink(name){
    var slug={'DM Sans':'DM+Sans:wght@400;500;600;700;800','Inter':'Inter:wght@400;500;600;700;800',
      'Source Serif Pro':'Source+Serif+Pro:wght@400;600;700','Lato':'Lato:wght@400;700;900'}[name];
    return slug?'<link href="https://fonts.googleapis.com/css2?family='+slug+'&display=swap" rel="stylesheet">':'';
  }

  // ─── PÁGINA WEB autónoma y DINÁMICA (.html) — PRO ───
  // El archivo descargado trae un panel flotante para que quien lo abra cambie
  // color, tipografía y densidad en vivo, con animación de entrada (efecto wow).
  function allGfontLinks(){
    return ['DM Sans','Inter','Lato','Source Serif Pro'].map(gfontLink).join('');
  }
  function webControlsCss(){
    return [
      '.cvx-bar{position:fixed;top:14px;right:14px;z-index:9999;display:flex;align-items:center;gap:8px;',
        'flex-wrap:wrap;max-width:92vw;background:rgba(17,24,39,.92);backdrop-filter:blur(6px);',
        'color:#fff;padding:8px 12px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.25);',
        'font:600 13px/1.2 system-ui,sans-serif;transition:transform .25s,opacity .25s}',
      '.cvx-bar.min{transform:translateY(-120%);opacity:0;pointer-events:none}',
      '.cvx-fab{position:fixed;top:14px;right:14px;z-index:9998;width:44px;height:44px;border-radius:50%;',
        'border:none;background:#1B3A5C;color:#fff;font-size:18px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);display:none}',
      '.cvx-bar .t{opacity:.85;font-weight:700}',
      '.cvx-sw{display:flex;gap:5px}',
      '.cvx-sw i{width:20px;height:20px;border-radius:50%;cursor:pointer;display:inline-block;box-shadow:0 0 0 2px rgba(255,255,255,.25)}',
      '.cvx-sw i:hover{transform:scale(1.15)}',
      '.cvx-bar select,.cvx-bar input[type=color]{font:inherit;border:none;border-radius:7px;padding:4px 6px;background:#fff;color:#111;cursor:pointer}',
      '.cvx-bar input[type=color]{width:30px;height:28px;padding:2px}',
      '.cvx-bar button.act{border:none;border-radius:7px;padding:5px 10px;background:#2E75B6;color:#fff;cursor:pointer;font:inherit}',
      '.cvx-bar button.x{background:transparent;color:#fff;font-size:16px;cursor:pointer;border:none;opacity:.7}',
      '@keyframes cvxUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
      '.cv-sheet .cv-header,.cv-sheet .cv-block{animation:cvxUp .5s ease both}',
      '.cv-sheet .cv-block:nth-child(2){animation-delay:.06s}.cv-sheet .cv-block:nth-child(3){animation-delay:.12s}',
      '.cv-sheet .cv-block:nth-child(4){animation-delay:.18s}.cv-sheet .cv-block:nth-child(5){animation-delay:.24s}',
      '.cv-sheet .cv-block:nth-child(6){animation-delay:.30s}.cv-sheet .cv-block:nth-child(7){animation-delay:.36s}',
      '.cv-sheet .cv-block:nth-child(n+8){animation-delay:.42s}',
      // colapsable: el título de cada sección se puede expandir/contraer
      '.cv-sheet .cv-block-title{cursor:pointer;user-select:none}',
      '.cv-sheet .cv-block-title::after{content:"▾";float:right;font-size:.8em;opacity:.45;margin-left:8px;transition:.2s}',
      '.cv-sheet .cv-block.cvx-collapsed .cv-block-title::after{content:"▸"}',
      '.cv-sheet .cv-block.cvx-collapsed>*:not(.cv-block-title){display:none}',
      '.cv-sheet .cvx-emoji{margin-right:6px}',
      '@media print{.cvx-bar,.cvx-fab{display:none!important}.cv-sheet *{animation:none!important}',
        '.cv-sheet .cv-block.cvx-collapsed>*{display:block!important}.cv-sheet .cv-block-title::after{display:none!important}}'
    ].join('');
  }
  function webControlsHtml(st){
    var sw=['#1B3A5C','#0F766E','#7C3AED','#B91C1C','#B45309','#111827','#2E75B6','#9D174D']
      .map(function(c){return '<i data-c="'+c+'" style="background:'+c+'"></i>';}).join('');
    var fopts=['DM Sans','Inter','Lato','Source Serif Pro','Georgia'].map(function(f){
      return '<option value="'+f+'"'+(f===st.branding.font?' selected':'')+'>'+f+'</option>';}).join('');
    var dopts=[['compact','Compacta'],['normal','Normal'],['airy','Espaciada']].map(function(d){
      return '<option value="'+d[0]+'"'+(d[0]===st.branding.density?' selected':'')+'>'+d[1]+'</option>';}).join('');
    return '<button class="cvx-fab" id="cvxFab" title="Personalizar">🎨</button>'+
      '<div class="cvx-bar" id="cvxBar"><span class="t">Personaliza ✨</span>'+
      '<span class="cvx-sw">'+sw+'</span>'+
      '<input type="color" id="cvxColor" value="'+st.branding.accent+'" title="Color">'+
      '<select id="cvxFont" title="Tipografía">'+fopts+'</select>'+
      '<select id="cvxDensity" title="Densidad">'+dopts+'</select>'+
      '<button class="act" id="cvxToggleAll" title="Expandir/contraer secciones">Contraer</button>'+
      '<button class="act" id="cvxPrint">PDF</button>'+
      '<button class="x" id="cvxMin" title="Ocultar">×</button></div>';
  }
  function webControlsScript(){
    // Se inserta como <scr+ipt> para no cerrar el script externo.
    return '(function(){var s=document.querySelector(".cv-sheet");if(!s)return;'+
      'var F={"DM Sans":"\\u0027DM Sans\\u0027,sans-serif","Inter":"\\u0027Inter\\u0027,sans-serif",'+
      '"Lato":"\\u0027Lato\\u0027,sans-serif","Source Serif Pro":"\\u0027Source Serif Pro\\u0027,serif",'+
      '"Georgia":"Georgia,serif"};'+
      'function $(i){return document.getElementById(i);}'+
      'document.querySelectorAll(".cvx-sw i").forEach(function(e){e.onclick=function(){s.style.setProperty("--cv-accent",e.dataset.c);$("cvxColor").value=e.dataset.c;};});'+
      '$("cvxColor").oninput=function(){s.style.setProperty("--cv-accent",this.value);};'+
      '$("cvxFont").onchange=function(){s.style.setProperty("--cv-font",F[this.value]||F["DM Sans"]);};'+
      '$("cvxDensity").onchange=function(){s.className=s.className.replace(/density-\\w+/,"density-"+this.value);};'+
      '$("cvxPrint").onclick=function(){window.print();};'+
      '$("cvxMin").onclick=function(){$("cvxBar").classList.add("min");$("cvxFab").style.display="block";};'+
      '$("cvxFab").onclick=function(){$("cvxBar").classList.remove("min");$("cvxFab").style.display="none";};'+
      // emojis profesionales por sección + secciones expandibles/contraíbles
      'var EM={perfil:"👤",experiencia:"💼",educacion:"🎓",habilidad:"🛠️",idioma:"🌐",certificac:"📜",referencia:"📇",contacto:"📞"};'+
      'function nrm(t){return t.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase();}'+
      'document.querySelectorAll(".cv-sheet .cv-block-title").forEach(function(tt){'+
      'var k=nrm(tt.textContent),e="";for(var key in EM){if(k.indexOf(key)>=0){e=EM[key];break;}}'+
      'if(e&&!tt.querySelector(".cvx-emoji"))tt.insertAdjacentHTML("afterbegin","<span class=\\"cvx-emoji\\">"+e+"</span>");'+
      'tt.addEventListener("click",function(){tt.parentNode.classList.toggle("cvx-collapsed");});});'+
      'var allColl=false,ta=$("cvxToggleAll");'+
      'if(ta)ta.onclick=function(){allColl=!allColl;document.querySelectorAll(".cv-sheet .cv-block").forEach(function(b){b.classList.toggle("cvx-collapsed",allColl);});ta.textContent=allColl?"Expandir":"Contraer";};'+
      '})();';
  }
  function exportWeb(){
    if(!requirePro('Descargar página web')) return;
    var st=CVBuilder.getState(); var d=st.cvData;
    var clone=sheetClone(true); if(!clone) return;  // sin marca de agua (export PRO limpio)
    loadCss().then(function(css){
      var titulo=(d.personal.nombre||'Hoja de vida')+(d.personal.titular?(' — '+d.personal.titular):'');
      var html='<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'+
        '<meta name="viewport" content="width=device-width,initial-scale=1">'+
        '<title>'+esc(titulo)+'</title>'+
        '<meta name="description" content="'+esc((d.resumen||'').slice(0,150))+'">'+
        allGfontLinks()+
        '<style>'+css+
        'body.cvweb{background:#E9EDF2;margin:0;padding:24px 12px;display:flex;justify-content:center}'+
        '@media print{@page{margin:0}body.cvweb{background:#fff;padding:0}.cv-sheet{box-shadow:none!important}}'+
        '.cv-sheet{margin:0 auto}'+webControlsCss()+
        '</style></head><body class="cvweb">'+
        webControlsHtml(st)+clone.outerHTML+
        '<scr'+'ipt>'+webControlsScript()+'</scr'+'ipt>'+
        '</body></html>';
      downloadBlob(html,fileBase()+'.html','text/html');
      (window.exoToast&&exoToast.success?exoToast.success:function(){})('Página web dinámica descargada. Ábrela, personalízala y compártela.');
    });
  }

  // ─── WORD .doc — PRO ───
  function exportWord(){
    if(!requirePro('Descargar Word')) return;
    var st=CVBuilder.getState();
    var clone=sheetClone(true); if(!clone) return;
    loadCss().then(function(rawCss){
      var css=resolveVars(rawCss,st);
      var bodyHtml;
      // Word ignora grid/flex → la plantilla de 2 columnas se convierte en tabla.
      if(st.template==='moderno'){
        var aside=clone.querySelector('.cv-aside'), main=clone.querySelector('.cv-main');
        bodyHtml='<div class="cv-sheet tpl-moderno density-'+st.branding.density+'">'+
          '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tr>'+
          '<td width="34%" valign="top" bgcolor="'+st.branding.accent+'" style="background:'+st.branding.accent+';color:#fff;padding:14mm 7mm">'+(aside?aside.innerHTML:'')+'</td>'+
          '<td width="66%" valign="top" style="padding:14mm 9mm">'+(main?main.innerHTML:'')+'</td>'+
          '</tr></table></div>';
      } else {
        bodyHtml=clone.outerHTML;
      }
      var html='<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'+
        '<head><meta charset="utf-8"><title>'+esc(fileBase())+'</title>'+
        '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->'+
        '<style>@page{size:A4;margin:0}body{margin:0}'+css+'</style></head><body>'+bodyHtml+'</body></html>';
      downloadBlob('﻿'+html,fileBase()+'.doc','application/msword');
      (window.exoToast&&exoToast.success?exoToast.success:function(){})('Word descargado.');
    });
  }

  function downloadBlob(content,filename,mime){
    var blob=new Blob([content],{type:mime});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a'); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},150);
  }

  function annotatePro(){
    if(isPro()) return;
    ['cvWord','cvWeb'].forEach(function(id){
      var b=$(id); if(!b||b.querySelector('.pro-badge')) return;
      var s=document.createElement('span'); s.className='pro-badge'; s.textContent='PRO'; b.appendChild(s);
    });
  }

  function init(){
    if($('cvPrint')) $('cvPrint').addEventListener('click',function(){window.print();});
    if($('cvWord')) $('cvWord').addEventListener('click',exportWord);
    if($('cvWeb')) $('cvWeb').addEventListener('click',exportWeb);
    annotatePro();
    if(window.exoPro&&exoPro.check) exoPro.check().then(function(p){ if(!p) annotatePro(); });
    window.addEventListener('ia-pro-activated',function(){
      document.querySelectorAll('.cv-btn .pro-badge').forEach(function(x){x.remove();});
    });
  }

  window.CVExport={init:init,word:exportWord,web:exportWeb};
})();
