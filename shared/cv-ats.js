/* ═══ ExógenaDIAN — Chequeo ATS de la Hoja de Vida ═══
   Análisis heurístico 100% local (sin IA, instantáneo): puntúa la HV,
   da recomendaciones accionables y compara contra una vacante pegada.
   Escucha el evento 'cv-render' que dispara CVBuilder y se actualiza en vivo.
*/
(function(){
  'use strict';
  if(window.CVAts) return;

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function norm(s){return String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();}

  var ACCION=('lidere liderar implemente implementar reduje reducir aumente aumentar gestione gestionar '+
    'disene disenar coordine coordinar automatice automatizar optimice optimizar desarrolle desarrollar '+
    'cree crear dirigi dirigir supervise supervisar negocie negociar logre lograr mejore mejorar ahorre '+
    'ahorrar ejecute ejecutar analice analizar elabore elaborar presente presentar capacite capacitar '+
    'resolvi resolver identifique identificar controle controlar concilie conciliar audite auditar '+
    'implanté planee planear organice organizar lance lanzar construi construir aumento incremente '+
    'incrementar establecimiento establecer gane ganar consegui conseguir').split(/\s+/);
  var ACCION_SET={}; ACCION.forEach(function(v){ACCION_SET[v]=1;});
  var STOP=('de la el en y a los las un una para con por que del se su sus al lo como mas o es son e u '+
    'me mi te tu si no ya muy entre sobre desde hasta cuando donde quien cual este esta estos estas '+
    'the and for con sin sera segun cada todo toda todos todas otro otra').split(/\s+/);
  var STOP_SET={}; STOP.forEach(function(w){STOP_SET[w]=1;});

  function allLogros(cv){
    var out=[];
    (cv.experiencia||[]).forEach(function(e){ (e.logros||[]).forEach(function(l){ if(l&&l.trim()) out.push(l.trim()); }); });
    return out;
  }
  function cvText(cv){
    var p=cv.personal||{}, parts=[p.titular,cv.resumen];
    (cv.experiencia||[]).forEach(function(e){parts.push(e.cargo,e.empresa);(e.logros||[]).forEach(function(l){parts.push(l);});});
    (cv.educacion||[]).forEach(function(e){parts.push(e.titulo,e.institucion);});
    (cv.habilidades||[]).forEach(function(h){parts.push(h.nombre);});
    (cv.idiomas||[]).forEach(function(i){parts.push(i.idioma);});
    (cv.certificaciones||[]).forEach(function(c){parts.push(c.nombre,c.entidad);});
    return norm(parts.filter(Boolean).join(' '));
  }
  function tokens(text){
    var t=norm(text).match(/[a-z0-9ñ]+/g)||[];
    var seen={},out=[];
    t.forEach(function(w){ if(w.length<4||STOP_SET[w]||/^\d+$/.test(w)) return; if(!seen[w]){seen[w]=1;out.push(w);} });
    return out;
  }

  function pages(){
    var m=$('cvPageMeter'); if(!m) return 1;
    var n=parseInt((m.textContent||'').replace(/\D/g,''),10); return n>0?n:1;
  }

  // ─── Análisis ───
  function analyze(cv,template){
    var checks=[], score=0;
    function add(pts,max,status,label,msg){ checks.push({status:status,label:label,msg:msg}); score+=pts; return pts; }
    var p=cv.personal||{};

    // Contacto (15)
    var emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email||'');
    var contactoN=(emailOk?1:0)+(p.telefono?1:0)+((p.ciudad||p.pais)?1:0);
    if(contactoN===3) add(15,15,'ok','Datos de contacto completos','Email válido, teléfono y ubicación presentes.');
    else add(contactoN*5,15,contactoN>=2?'warn':'fail','Datos de contacto','Falta: '+[!emailOk?'email válido':'', !p.telefono?'teléfono':'', !(p.ciudad||p.pais)?'ciudad':''].filter(Boolean).join(', ')+'.');

    // Nombre + titular (10)
    if(p.nombre && p.titular) add(10,10,'ok','Nombre y titular profesional','Tienes nombre y un cargo/título visible arriba.');
    else add(p.nombre?5:0,10,'warn','Nombre y titular','Agrega tu '+(!p.nombre?'nombre':'cargo o título profesional (headline)')+'.');

    // Resumen (15: 8 presencia + 7 longitud)
    var rw=(cv.resumen||'').trim().split(/\s+/).filter(Boolean).length;
    if(!rw) add(0,15,'fail','Perfil profesional','Escribe un resumen de 2–4 líneas. Es lo primero que leen.');
    else if(rw>=40&&rw<=120) add(15,15,'ok','Perfil profesional','Buena longitud ('+rw+' palabras).');
    else add(10,15,'warn','Perfil profesional',rw<40?('Muy corto ('+rw+' palabras). Apunta a 40–120.'):('Muy largo ('+rw+' palabras). Resume a 40–120.'));

    // Experiencia (15)
    var expOk=(cv.experiencia||[]).filter(function(e){return e.cargo&&e.empresa;});
    if(expOk.length>=1) add(15,15,'ok','Experiencia laboral',expOk.length+' cargo(s) con empresa.');
    else add(0,15,'fail','Experiencia laboral','Agrega al menos una experiencia con cargo y empresa.');

    // Educación (8)
    if((cv.educacion||[]).some(function(e){return e.titulo;})) add(8,8,'ok','Educación','Incluida.');
    else add(0,8,'warn','Educación','Agrega tu formación académica.');

    // Habilidades (7)
    var hN=(cv.habilidades||[]).filter(function(h){return h.nombre;}).length;
    if(hN>=3) add(7,7,'ok','Habilidades',hN+' habilidades listadas.');
    else add(hN*2,7,'warn','Habilidades','Lista al menos 3 habilidades clave (tienes '+hN+').');

    // Verbos de acción (15)
    var logros=allLogros(cv);
    if(!logros.length){ add(0,15,'fail','Logros con verbos de acción','Tus experiencias no tienen logros. Agrega viñetas que empiecen con un verbo.'); }
    else {
      var conVerbo=logros.filter(function(l){var w=norm(l).match(/[a-zñ]+/);return w&&ACCION_SET[w[0]];}).length;
      var pct=Math.round(conVerbo/logros.length*100);
      if(pct>=60) add(15,15,'ok','Logros con verbos de acción',pct+'% empiezan con verbo de acción.');
      else add(Math.round(pct/60*15),15,'warn','Logros con verbos de acción',pct+'% usan verbo de acción. Empieza tus viñetas con: lideré, reduje, implementé, aumenté… Evita "responsable de".');
    }

    // Cuantificación (10)
    if(logros.length){
      var conNum=logros.filter(function(l){return /\d|%|\$/.test(l);}).length;
      var pctN=Math.round(conNum/logros.length*100);
      if(pctN>=30) add(10,10,'ok','Logros cuantificados',pctN+'% incluyen números o %.');
      else add(Math.round(pctN/30*10),10,'warn','Logros cuantificados','Solo '+pctN+'% tienen cifras. Agrega métricas: "reduje 30%", "$50M", "5 días".');
    }

    // Formato amigable con ATS (5)
    var riesgos=[];
    if(template==='moderno') riesgos.push('la plantilla de 2 columnas puede confundir a algunos lectores ATS de portales (usa Clásico ATS para esos casos)');
    if(p.foto) riesgos.push('la foto puede ser rechazada por filtros automáticos y procesos anónimos');
    if(pages()>2) riesgos.push('tu HV supera 2 páginas; intenta resumir');
    if(!riesgos.length) add(5,5,'ok','Formato amigable con ATS','Una columna, sin foto, extensión adecuada.');
    else add(2,5,'warn','Formato amigable con ATS','Para portales con filtro automático: '+riesgos.join('; ')+'.');

    return {score:Math.max(0,Math.min(100,Math.round(score))), checks:checks};
  }

  function keywords(cv,vacante){
    if(!vacante||!vacante.trim()) return null;
    var want=tokens(vacante).slice(0,60);
    var have=cvText(cv);
    var matched=[],missing=[];
    want.forEach(function(w){ (have.indexOf(w)>=0?matched:missing).push(w); });
    var cov=want.length?Math.round(matched.length/want.length*100):0;
    return {cov:cov, matched:matched, missing:missing.slice(0,18)};
  }

  // ─── Pintado ───
  function paint(){
    if(!(window.CVBuilder&&CVBuilder.getData)) return;
    var st=CVBuilder.getState?CVBuilder.getState():{template:'ats'};
    var cv=CVBuilder.getData();
    var r=analyze(cv,st.template);
    var ring=$('cvAtsScore'), bar=$('cvAtsBar'), list=$('cvAtsList');
    if(ring){ ring.textContent=r.score; }
    var color=r.score>=80?'#10B981':(r.score>=50?'#F59E0B':'#EF4444');
    var lbl=r.score>=80?'Excelente':(r.score>=50?'Mejorable':'Necesita trabajo');
    if(bar){ bar.style.background='conic-gradient('+color+' '+(r.score*3.6)+'deg,#E5E7EB 0)'; }
    if($('cvAtsLabel')){ $('cvAtsLabel').textContent=lbl; $('cvAtsLabel').style.color=color; }
    if(list){
      list.innerHTML=r.checks.map(function(c){
        var ic=c.status==='ok'?'✓':(c.status==='warn'?'!':'✕');
        return '<li class="ats-'+c.status+'"><span class="ats-ic">'+ic+'</span><div><b>'+esc(c.label)+'</b>'+
          (c.status!=='ok'?('<span>'+esc(c.msg)+'</span>'):'')+'</div></li>';
      }).join('');
    }
    // keywords
    var va=$('cvVacante'); var kw=keywords(cv, va?va.value:'');
    var kwBox=$('cvKwResult');
    if(kwBox){
      if(!kw){ kwBox.innerHTML='<p class="cv-hint">Pega arriba el texto de una vacante para ver qué palabras clave te faltan.</p>'; }
      else{
        var col=kw.cov>=60?'#10B981':(kw.cov>=35?'#F59E0B':'#EF4444');
        kwBox.innerHTML='<div class="ats-kwcov" style="color:'+col+'">Coincidencia con la vacante: '+kw.cov+'%</div>'+
          (kw.missing.length?('<div class="cv-hint" style="margin:6px 0 3px">Palabras de la vacante que NO están en tu HV (agrégalas si aplican a tu perfil):</div>'+
            '<div class="ats-chips">'+kw.missing.map(function(w){return '<span class="ats-chip miss">'+esc(w)+'</span>';}).join('')+'</div>'):
            '<div class="cv-hint" style="margin-top:6px">¡Bien! Cubres las palabras clave detectadas.</div>');
      }
    }
  }
  var t=null;
  function schedule(){ if(t)return; t=setTimeout(function(){t=null;paint();},120); }

  function init(){
    if(!$('cvAtsPanel')) return;
    document.addEventListener('cv-render',schedule);
    var va=$('cvVacante'); if(va) va.addEventListener('input',schedule);
    paint();
  }

  window.CVAts={init:init, analyze:analyze, repaint:paint};
})();
