/* ═══ ExógenaDIAN — Constructor de Hoja de Vida (motor) ═══
   Estado único cvData + render derivado (la hoja se reconstruye entera en cada cambio).
   El FORMULARIO no se re-renderiza por tecla (preserva el foco); solo cambia al
   agregar/quitar/mover items. 100% client-side, sin dependencias.

   API:  CVBuilder.init();   // llamar tras DOM listo
   La página (hoja-de-vida.html) provee el markup; este módulo cablea todo.
*/
(function(){
  'use strict';
  if(window.CVBuilder) return;

  var STORE_KEY='exogenadian:cv-data-v1';
  var raf=null;

  // ─── Utilidades ───
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function uid(){return 'i'+Math.random().toString(36).slice(2,9);}
  function getByPath(o,p){return p.split('.').reduce(function(a,k){return a==null?a:a[k];},o);}
  function setByPath(o,p,v){var ks=p.split('.'),last=ks.pop();
    var t=ks.reduce(function(a,k){return a[k]||(a[k]={});},o); t[last]=v;}
  var MESES_ABBR=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  function fmtMes(yyyymm){
    if(!yyyymm) return '';
    var p=String(yyyymm).split('-');
    if(p.length<2) return yyyymm;
    var m=parseInt(p[1],10);
    return (MESES_ABBR[m-1]||'')+' '+p[0];
  }
  function rango(ini,fin,actual){
    var a=fmtMes(ini), b=actual?'Actualidad':fmtMes(fin);
    if(!a && !b) return '';
    return esc(a||'?')+' — '+esc(b||'?');
  }

  // ─── Estado ───
  function emptyCV(){return {
    meta:{idioma:'es',version:1},
    personal:{nombre:'',titular:'',foto:'',email:'',telefono:'',ciudad:'',pais:'Colombia',linkedin:'',portafolio:''},
    resumen:'',
    experiencia:[{id:uid(),cargo:'',empresa:'',ciudad:'',inicio:'',fin:'',actual:false,logros:['']}],
    educacion:[{id:uid(),titulo:'',institucion:'',ciudad:'',inicio:'',fin:'',estado:''}],
    habilidades:[],
    idiomas:[],
    certificaciones:[],
    referencias:[]
  };}

  var state={
    cvData:emptyCV(),
    template:'ats',
    branding:{accent:'#1B3A5C',font:'DM Sans',density:'normal'}
  };

  var FONTS={
    'DM Sans':"'DM Sans','Segoe UI',sans-serif",
    'Inter':"'Inter','Segoe UI',sans-serif",
    'Source Serif Pro':"'Source Serif Pro','Georgia',serif",
    'Georgia':"Georgia,'Times New Roman',serif",
    'Lato':"'Lato','Segoe UI',sans-serif"
  };
  var GFONT={'DM Sans':'DM+Sans:wght@400;500;600;700;800','Inter':'Inter:wght@400;500;600;700;800',
    'Source Serif Pro':'Source+Serif+Pro:wght@400;600;700','Lato':'Lato:wght@400;700;900','Georgia':null};
  function ensureFont(name){var slug=GFONT[name];if(!slug)return;var id='cvfont-'+name.replace(/\s+/g,'-');
    if($(id))return;var l=document.createElement('link');l.id=id;l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family='+slug+'&display=swap';document.head.appendChild(l);}

  // ─── Definición de secciones repetibles (DRY) ───
  var SECTIONS={
    experiencia:{titulo:'Experiencia laboral', singular:'experiencia', logros:true, fields:[
      {k:'cargo',label:'Cargo',ph:'Analista contable'},
      {k:'empresa',label:'Empresa',ph:'Comercializadora ABC S.A.S.'},
      {k:'ciudad',label:'Ciudad',ph:'Bogotá',half:true},
      {k:'inicio',label:'Inicio',type:'month',half:true},
      {k:'fin',label:'Fin',type:'month',half:true},
    ], actualToggle:true},
    educacion:{titulo:'Educación', singular:'estudio', fields:[
      {k:'titulo',label:'Título',ph:'Contaduría Pública'},
      {k:'institucion',label:'Institución',ph:'Universidad Nacional'},
      {k:'ciudad',label:'Ciudad',ph:'Bogotá',half:true},
      {k:'estado',label:'Estado',ph:'Graduado / En curso',half:true},
      {k:'inicio',label:'Inicio',type:'month',half:true},
      {k:'fin',label:'Fin',type:'month',half:true},
    ]},
    habilidades:{titulo:'Habilidades', singular:'habilidad', fields:[
      {k:'nombre',label:'Habilidad',ph:'NIIF / Excel avanzado'},
      {k:'nivel',label:'Nivel (0–5, opcional)',type:'number',ph:'4',half:true},
    ]},
    idiomas:{titulo:'Idiomas', singular:'idioma', fields:[
      {k:'idioma',label:'Idioma',ph:'Inglés',half:true},
      {k:'nivel',label:'Nivel',ph:'B2 / Intermedio',half:true},
    ]},
    certificaciones:{titulo:'Certificaciones y cursos', singular:'certificación', fields:[
      {k:'nombre',label:'Nombre',ph:'Especialización en Tributaria PJ'},
      {k:'entidad',label:'Entidad',ph:'ExógenaDIAN — Escuela',half:true},
      {k:'ano',label:'Año',ph:'2026',half:true},
    ]},
    referencias:{titulo:'Referencias', singular:'referencia', fields:[
      {k:'nombre',label:'Nombre',ph:'Carlos Gómez'},
      {k:'cargo',label:'Cargo',ph:'Gerente Financiero',half:true},
      {k:'empresa',label:'Empresa',ph:'ABC S.A.S.',half:true},
      {k:'telefono',label:'Teléfono',ph:'300 123 4567',half:true},
      {k:'email',label:'Email',ph:'carlos@abc.com',half:true},
    ]}
  };

  // ═══════════════ RENDER DE LA HOJA (cvData -> HTML) ═══════════════
  function ph(txt){return '<span class="cv-placeholder">'+esc(txt)+'</span>';}

  function blockHeader(cv){
    var p=cv.personal;
    var contacto=[];
    if(p.email) contacto.push('<span>✉ '+esc(p.email)+'</span>');
    if(p.telefono) contacto.push('<span>☎ '+esc(p.telefono)+'</span>');
    var loc=[p.ciudad,p.pais].filter(Boolean).join(', ');
    if(loc) contacto.push('<span>📍 '+esc(loc)+'</span>');
    if(p.linkedin) contacto.push('<span>in '+esc(p.linkedin.replace(/^https?:\/\/(www\.)?/,''))+'</span>');
    if(p.portafolio) contacto.push('<span>🔗 '+esc(p.portafolio.replace(/^https?:\/\/(www\.)?/,''))+'</span>');
    return '<div class="cv-name">'+(p.nombre?esc(p.nombre):ph('Tu nombre'))+'</div>'+
      '<div class="cv-headline">'+(p.titular?esc(p.titular):ph('Tu cargo o título profesional'))+'</div>'+
      '<div class="cv-contact">'+(contacto.join('')||ph('email · teléfono · ciudad'))+'</div>';
  }

  var BLOCKS={
    resumen:function(cv){
      if(!cv.resumen) return '';
      return '<div class="cv-block cv-resumen"><div class="cv-block-title">Perfil profesional</div>'+
        '<p>'+esc(cv.resumen)+'</p></div>';
    },
    experiencia:function(cv,o){
      if(!cv.experiencia.length) return '';
      var items=cv.experiencia.map(function(e){
        var logros=(e.logros||[]).filter(function(l){return l && l.trim();});
        var ul=logros.length?('<ul>'+logros.map(function(l){return '<li>'+esc(l)+'</li>';}).join('')+'</ul>'):'';
        return '<div class="cv-entry">'+
          '<div class="cv-entry-head"><div><span class="cv-entry-title">'+(e.cargo?esc(e.cargo):ph('Cargo'))+'</span>'+
          (e.empresa?(' · <span class="cv-entry-org">'+esc(e.empresa)+'</span>'):'')+'</div>'+
          '<span class="cv-entry-date">'+rango(e.inicio,e.fin,e.actual)+'</span></div>'+
          (e.ciudad?('<div class="cv-entry-sub">'+esc(e.ciudad)+'</div>'):'')+ul+'</div>';
      }).join('');
      return '<div class="cv-block"><div class="cv-block-title">Experiencia</div>'+
        '<div'+((o&&o.timeline)?' class="cv-timeline"':'')+'>'+items+'</div></div>';
    },
    educacion:function(cv){
      if(!cv.educacion.length) return '';
      var items=cv.educacion.map(function(e){
        return '<div class="cv-entry"><div class="cv-entry-head">'+
          '<div><span class="cv-entry-title">'+(e.titulo?esc(e.titulo):ph('Título'))+'</span>'+
          (e.institucion?(' · <span class="cv-entry-org">'+esc(e.institucion)+'</span>'):'')+'</div>'+
          '<span class="cv-entry-date">'+rango(e.inicio,e.fin,false)+'</span></div>'+
          ([e.ciudad,e.estado].filter(Boolean).join(' · ')?('<div class="cv-entry-sub">'+esc([e.ciudad,e.estado].filter(Boolean).join(' · '))+'</div>'):'')+'</div>';
      }).join('');
      return '<div class="cv-block"><div class="cv-block-title">Educación</div>'+items+'</div>';
    },
    habilidades:function(cv){
      if(!cv.habilidades.length) return '';
      var anyBar=cv.habilidades.some(function(h){return Number(h.nivel)>0;});
      var body;
      if(anyBar){
        body=cv.habilidades.map(function(h){
          var n=Math.max(0,Math.min(5,Number(h.nivel)||0));
          return '<div style="margin:4px 0"><div style="font-size:9pt;font-weight:600">'+(h.nombre?esc(h.nombre):ph('Habilidad'))+'</div>'+
            (n>0?('<div class="cv-bar"><i style="width:'+(n/5*100)+'%"></i></div>'):'')+'</div>';
        }).join('');
      } else {
        body='<div class="cv-skills-wrap">'+cv.habilidades.map(function(h){
          return '<span class="cv-chip">'+(h.nombre?esc(h.nombre):ph('Habilidad'))+'</span>';}).join('')+'</div>';
      }
      return '<div class="cv-block"><div class="cv-block-title">Habilidades</div>'+body+'</div>';
    },
    idiomas:function(cv){
      if(!cv.idiomas.length) return '';
      return '<div class="cv-block"><div class="cv-block-title">Idiomas</div>'+
        cv.idiomas.map(function(i){return '<div class="cv-entry-sub" style="display:flex;justify-content:space-between">'+
          '<span style="font-weight:600">'+(i.idioma?esc(i.idioma):ph('Idioma'))+'</span><span>'+esc(i.nivel||'')+'</span></div>';}).join('')+'</div>';
    },
    certificaciones:function(cv){
      if(!cv.certificaciones.length) return '';
      return '<div class="cv-block"><div class="cv-block-title">Certificaciones</div>'+
        cv.certificaciones.map(function(c){return '<div class="cv-entry-sub" style="margin:2px 0">'+
          '<span style="font-weight:600">'+(c.nombre?esc(c.nombre):ph('Certificación'))+'</span>'+
          ([c.entidad,c.ano].filter(Boolean).join(', ')?(' — '+esc([c.entidad,c.ano].filter(Boolean).join(', '))):'')+'</div>';}).join('')+'</div>';
    },
    referencias:function(cv){
      if(!cv.referencias.length) return '';
      return '<div class="cv-block"><div class="cv-block-title">Referencias</div>'+
        cv.referencias.map(function(r){return '<div class="cv-entry" style="margin-bottom:6px">'+
          '<div class="cv-entry-title" style="font-size:10pt">'+(r.nombre?esc(r.nombre):ph('Nombre'))+'</div>'+
          '<div class="cv-entry-sub">'+esc([r.cargo,r.empresa].filter(Boolean).join(', '))+'</div>'+
          '<div class="cv-entry-sub">'+esc([r.telefono,r.email].filter(Boolean).join(' · '))+'</div></div>';}).join('')+'</div>';
    }
  };

  function foto(cv,cls){return cv.personal.foto?('<img class="cv-foto'+(cls?' '+cls:'')+'" src="'+cv.personal.foto+'" alt="foto">'):'';}

  function oneColumn(cv,o){
    o=o||{};
    // La foto se muestra en TODAS las plantillas de una columna si el usuario la subió.
    var f=cv.personal.foto?foto(cv):'';
    return '<div class="cv-header" style="display:flex;gap:14px;align-items:center;'+(o.center?'justify-content:center;text-align:center':'')+'">'+
      f+'<div style="flex:1">'+blockHeader(cv)+'</div></div>'+
      BLOCKS.resumen(cv)+BLOCKS.experiencia(cv,o)+BLOCKS.educacion(cv)+
      BLOCKS.habilidades(cv)+BLOCKS.idiomas(cv)+BLOCKS.certificaciones(cv)+BLOCKS.referencias(cv);
  }

  function twoColumn(cv){
    var aside='<div class="cv-aside">'+
      foto(cv)+
      '<div class="cv-name">'+(cv.personal.nombre?esc(cv.personal.nombre):ph('Tu nombre'))+'</div>'+
      '<div class="cv-headline">'+(cv.personal.titular?esc(cv.personal.titular):ph('Tu cargo'))+'</div>'+
      asideContact(cv)+
      BLOCKS.habilidades(cv)+BLOCKS.idiomas(cv)+BLOCKS.certificaciones(cv)+
      '</div>';
    var main='<div class="cv-main">'+
      BLOCKS.resumen(cv)+BLOCKS.experiencia(cv)+BLOCKS.educacion(cv)+BLOCKS.referencias(cv)+'</div>';
    return aside+main;
  }
  function asideContact(cv){
    var p=cv.personal,c=[];
    if(p.email)c.push('<span>✉ '+esc(p.email)+'</span>');
    if(p.telefono)c.push('<span>☎ '+esc(p.telefono)+'</span>');
    var loc=[p.ciudad,p.pais].filter(Boolean).join(', ');
    if(loc)c.push('<span>📍 '+esc(loc)+'</span>');
    if(p.linkedin)c.push('<span>in '+esc(p.linkedin.replace(/^https?:\/\/(www\.)?/,''))+'</span>');
    if(p.portafolio)c.push('<span>🔗 '+esc(p.portafolio.replace(/^https?:\/\/(www\.)?/,''))+'</span>');
    if(!c.length) return '';
    return '<div class="cv-block"><div class="cv-block-title">Contacto</div><div class="cv-contact">'+c.join('')+'</div></div>';
  }

  var TEMPLATES={
    ats:function(cv){return oneColumn(cv,{});},
    minimalista:function(cv){return oneColumn(cv,{center:true});},
    cronologico:function(cv){return oneColumn(cv,{timeline:true,photo:true});},
    ejecutivo:function(cv){return oneColumn(cv,{photo:true});},
    creativo:function(cv){return oneColumn(cv,{photo:true});},
    moderno:function(cv){return twoColumn(cv);}
  };

  function render(){
    var sheet=$('cvSheet');
    if(!sheet) return;
    sheet.className='cv-sheet tpl-'+state.template+' density-'+state.branding.density;
    sheet.style.setProperty('--cv-accent',state.branding.accent);
    sheet.style.setProperty('--cv-font',FONTS[state.branding.font]||FONTS['DM Sans']);
    var fn=TEMPLATES[state.template]||TEMPLATES.ats;
    sheet.innerHTML=fn(state.cvData)+
      '<div class="cv-wm">hecho con exogenadian.com</div>';
    updatePageMeter();
    try{ document.dispatchEvent(new CustomEvent('cv-render',{detail:{cvData:state.cvData,template:state.template}})); }catch(e){}
  }
  function scheduleRender(){ if(raf)return; raf=requestAnimationFrame(function(){raf=null;render();autosave();}); }

  // ─── Contador de páginas ───
  function updatePageMeter(){
    var sheet=$('cvSheet'),meter=$('cvPageMeter');
    if(!sheet||!meter) return;
    var pxPerMM=sheet.getBoundingClientRect().width/210;
    var pageH=297*pxPerMM;
    var pages=Math.max(1,Math.ceil(sheet.scrollHeight/pageH - 0.02));
    var warn=pages>2;
    meter.className='cv-pagemeter '+(warn?'warn':'ok');
    meter.textContent=(warn?'⚠ ':'')+pages+(pages===1?' página':' páginas');
    meter.title=warn?'Más de 2 páginas: considera resumir. Para la mayoría de cargos 1–2 páginas es lo ideal.':'Extensión adecuada.';
  }

  // ═══════════════ FORMULARIO ═══════════════
  function bindStatic(){
    document.querySelectorAll('[data-cv]').forEach(function(el){
      var path=el.getAttribute('data-cv');
      var cur=getByPath(state.cvData,path);
      if(cur!=null) el.value=cur;
      el.addEventListener('input',function(){ setByPath(state.cvData,path,el.value); scheduleRender(); });
    });
  }

  // construye el formulario de UN item repetible
  function itemForm(secKey,item,idx){
    var def=SECTIONS[secKey];
    var rows='',pend=null;
    def.fields.forEach(function(fl){
      var inputEl;
      var val=item[fl.k]==null?'':item[fl.k];
      if(fl.type==='number'){
        inputEl='<input type="number" min="0" max="5" data-f="'+fl.k+'" value="'+esc(val)+'" placeholder="'+esc(fl.ph||'')+'">';
      } else {
        inputEl='<input type="'+(fl.type||'text')+'" data-f="'+fl.k+'" value="'+esc(val)+'" placeholder="'+esc(fl.ph||'')+'">';
      }
      var cell='<div><label>'+esc(fl.label)+'</label>'+inputEl+'</div>';
      if(fl.half){
        if(pend){ rows+='<div class="cv-row2">'+pend+cell+'</div>'; pend=null; }
        else pend=cell;
      } else {
        if(pend){ rows+='<div class="cv-row2">'+pend+'<div></div></div>'; pend=null; }
        rows+=cell;
      }
    });
    if(pend) rows+='<div class="cv-row2">'+pend+'<div></div></div>';

    if(def.actualToggle){
      rows+='<label class="cv-check"><input type="checkbox" data-f="actual" '+(item.actual?'checked':'')+'> Trabajo actual (sin fecha de fin)</label>';
    }
    if(def.logros){
      var logros=(item.logros&&item.logros.length)?item.logros:[''];
      var lr=logros.map(function(l,i){
        return '<div class="cv-logro-row"><textarea data-logro="'+i+'" placeholder="Logro o responsabilidad (empieza con verbo: lideré, reduje, implementé…)">'+esc(l)+'</textarea>'+
          '<button type="button" class="cv-icon-btn del" data-logro-del="'+i+'" aria-label="Quitar logro">✕</button></div>';
      }).join('');
      rows+='<label>Logros / responsabilidades</label><div class="cv-logros">'+lr+
        '<button type="button" class="cv-add-btn" data-logro-add="1" style="margin-top:4px">+ Agregar logro</button></div>';
    }

    return '<fieldset class="cv-item" data-id="'+item.id+'">'+
      '<div class="cv-item-head"><span class="cv-item-num">'+esc(def.singular)+' '+(idx+1)+'</span>'+
      '<span class="cv-item-actions">'+
        '<button type="button" class="cv-icon-btn" data-move="-1" aria-label="Subir">↑</button>'+
        '<button type="button" class="cv-icon-btn" data-move="1" aria-label="Bajar">↓</button>'+
        '<button type="button" class="cv-icon-btn del" data-del="1" aria-label="Eliminar">🗑</button>'+
      '</span></div>'+rows+'</fieldset>';
  }

  function renderSection(secKey){
    var cont=$('sec-'+secKey);
    if(!cont) return;
    var arr=state.cvData[secKey]||[];
    cont.innerHTML=arr.map(function(it,i){return itemForm(secKey,it,i);}).join('')||
      '<p class="cv-hint">Sin '+esc(SECTIONS[secKey].singular)+'s. Agrega una abajo.</p>';
  }

  function newItem(secKey){
    var base={id:uid()};
    SECTIONS[secKey].fields.forEach(function(f){base[f.k]='';});
    if(SECTIONS[secKey].actualToggle) base.actual=false;
    if(SECTIONS[secKey].logros) base.logros=[''];
    return base;
  }

  function bindSection(secKey){
    var cont=$('sec-'+secKey);
    if(!cont) return;
    // edición de campos (delegado) — NO re-renderiza el form, solo la hoja
    cont.addEventListener('input',function(e){
      var fs=e.target.closest('[data-id]'); if(!fs) return;
      var item=state.cvData[secKey].find(function(x){return x.id===fs.dataset.id;});
      if(!item) return;
      if(e.target.dataset.f){
        item[e.target.dataset.f]=e.target.value;
      } else if(e.target.dataset.logro!=null){
        item.logros[+e.target.dataset.logro]=e.target.value;
      }
      scheduleRender();
    });
    cont.addEventListener('change',function(e){
      if(e.target.dataset.f==='actual'){
        var fs=e.target.closest('[data-id]');
        var item=state.cvData[secKey].find(function(x){return x.id===fs.dataset.id;});
        if(item){ item.actual=e.target.checked; scheduleRender(); }
      }
    });
    // botones (delegado) — sí re-renderiza el form de la sección
    cont.addEventListener('click',function(e){
      var btn=e.target.closest('button'); if(!btn) return;
      var fs=e.target.closest('[data-id]'); if(!fs) return;
      var arr=state.cvData[secKey];
      var idx=arr.findIndex(function(x){return x.id===fs.dataset.id;});
      if(idx<0) return;
      if(btn.dataset.del){ arr.splice(idx,1); }
      else if(btn.dataset.move){ var to=idx+(+btn.dataset.move);
        if(to>=0&&to<arr.length){ var t=arr[idx];arr[idx]=arr[to];arr[to]=t; } }
      else if(btn.dataset.logroAdd){ arr[idx].logros.push(''); }
      else if(btn.dataset.logroDel!=null){ arr[idx].logros.splice(+btn.dataset.logroDel,1);
        if(!arr[idx].logros.length) arr[idx].logros=['']; }
      else return;
      renderSection(secKey); scheduleRender();
    });
    // botón Agregar (fuera del contenedor de items)
    var add=document.querySelector('[data-add="'+secKey+'"]');
    if(add) add.addEventListener('click',function(){
      state.cvData[secKey].push(newItem(secKey));
      renderSection(secKey); scheduleRender();
      var last=cont.querySelector('.cv-item:last-child input'); if(last) last.focus();
    });
  }

  // ─── Personalización (acento/fuente/densidad) + foto ───
  var SWATCHES=['#1B3A5C','#0F766E','#7C3AED','#B91C1C','#B45309','#111827','#2E75B6','#9D174D'];
  function bindBranding(){
    var sw=$('cvSwatches');
    if(sw){
      sw.innerHTML=SWATCHES.map(function(c){return '<span class="cv-swatch'+(c===state.branding.accent?' active':'')+'" data-color="'+c+'" style="background:'+c+'" title="'+c+'"></span>';}).join('');
      sw.addEventListener('click',function(e){
        var s=e.target.closest('[data-color]'); if(!s) return;
        state.branding.accent=s.dataset.color;
        if($('cvAccent')) $('cvAccent').value=s.dataset.color;
        sw.querySelectorAll('.cv-swatch').forEach(function(x){x.classList.toggle('active',x.dataset.color===s.dataset.color);});
        scheduleRender();
      });
    }
    var acc=$('cvAccent');
    if(acc){ acc.value=state.branding.accent;
      acc.addEventListener('input',function(){state.branding.accent=acc.value;
        if(sw) sw.querySelectorAll('.cv-swatch').forEach(function(x){x.classList.remove('active');});
        scheduleRender();}); }
    var fs=$('cvFont');
    if(fs){ fs.value=state.branding.font;
      fs.addEventListener('change',function(){state.branding.font=fs.value;ensureFont(fs.value);scheduleRender();}); }
    var de=$('cvDensity');
    if(de){ de.value=state.branding.density;
      de.addEventListener('change',function(){state.branding.density=de.value;scheduleRender();}); }
  }

  function bindPhoto(){
    var inp=$('cvFoto'); if(!inp) return;
    inp.addEventListener('change',function(){
      var file=inp.files&&inp.files[0]; if(!file) return;
      var r=new FileReader();
      r.onload=function(){
        var img=new Image();
        img.onload=function(){
          var max=320, w=img.width,h=img.height;
          var sc=Math.min(1,max/Math.max(w,h));
          var cw=Math.round(w*sc), ch=Math.round(h*sc);
          var cv=document.createElement('canvas'); cv.width=cw; cv.height=ch;
          cv.getContext('2d').drawImage(img,0,0,cw,ch);
          state.cvData.personal.foto=cv.toDataURL('image/jpeg',0.82);
          var prev=$('cvFotoPrev'); if(prev){prev.src=state.cvData.personal.foto;prev.style.display='block';}
          var rm=$('cvFotoRemove'); if(rm) rm.style.display='inline-flex';
          scheduleRender();
        };
        img.src=r.result;
      };
      r.readAsDataURL(file);
    });
    var rm=$('cvFotoRemove');
    if(rm) rm.addEventListener('click',function(){
      state.cvData.personal.foto=''; inp.value='';
      var prev=$('cvFotoPrev'); if(prev) prev.style.display='none';
      rm.style.display='none'; scheduleRender();
    });
  }

  // ─── Plantilla ───
  function bindTemplate(){
    var sel=$('cvTemplate');
    if(sel){ sel.value=state.template;
      sel.addEventListener('change',function(){state.template=sel.value;render();autosave();}); }
  }

  // ─── Importar perfil del contador ───
  function bindImportPerfil(){
    var btn=$('cvImportPerfil'); if(!btn) return;
    if(!(window.perfilContador && perfilContador.get)){ btn.style.display='none'; return; }
    var p=perfilContador.get()||{};
    if(!p.nombre){ btn.style.display='none'; return; }
    btn.addEventListener('click',function(){
      var per=state.cvData.personal;
      if(p.nombre) per.nombre=p.nombre;
      if(p.email) per.email=p.email;
      if(p.ciudad) per.ciudad=p.ciudad;
      if(p.telefono||p.celular) per.telefono=p.telefono||p.celular;
      if(p.tarjeta_profesional && !per.titular) per.titular='Contador(a) Público(a) — T.P. '+p.tarjeta_profesional;
      bindStaticReload(); scheduleRender();
      (window.exoToast&&exoToast.success?exoToast.success:alert)('Datos de tu perfil cargados');
    });
  }
  function bindStaticReload(){
    document.querySelectorAll('[data-cv]').forEach(function(el){
      var v=getByPath(state.cvData,el.getAttribute('data-cv')); if(v!=null) el.value=v;
    });
  }

  // ─── Persistencia ───
  function autosave(){
    try{
      state.cvData.meta.actualizado=Date.now();
      localStorage.setItem(STORE_KEY,JSON.stringify({cvData:state.cvData,template:state.template,branding:state.branding}));
    }catch(e){/* cuota llena (p.ej. foto grande): ignorar */}
  }
  function load(){
    try{
      var raw=localStorage.getItem(STORE_KEY); if(!raw) return false;
      var d=JSON.parse(raw);
      if(d.cvData){ state.cvData=Object.assign(emptyCV(),d.cvData);
        // asegurar arrays e ids
        ['experiencia','educacion','habilidades','idiomas','certificaciones','referencias'].forEach(function(k){
          if(!Array.isArray(state.cvData[k])) state.cvData[k]=[];
          state.cvData[k].forEach(function(it){ if(!it.id) it.id=uid();
            if(k==='experiencia'&&!Array.isArray(it.logros)) it.logros=[''];});
        });
      }
      if(d.template&&TEMPLATES[d.template]) state.template=d.template;
      if(d.branding) state.branding=Object.assign(state.branding,d.branding);
      return true;
    }catch(e){ return false; }
  }
  function reset(){
    if(!confirm('¿Borrar toda la hoja de vida y empezar de cero?')) return;
    try{localStorage.removeItem(STORE_KEY);}catch(e){}
    state.cvData=emptyCV(); state.template='ats'; state.branding={accent:'#1B3A5C',font:'DM Sans',density:'normal'};
    initForm(); render(); autosave();
  }

  function initForm(){
    bindStaticReload();
    Object.keys(SECTIONS).forEach(renderSection);
    if($('cvFotoPrev')&&state.cvData.personal.foto){ $('cvFotoPrev').src=state.cvData.personal.foto; $('cvFotoPrev').style.display='block'; if($('cvFotoRemove'))$('cvFotoRemove').style.display='inline-flex'; }
    if($('cvTemplate')) $('cvTemplate').value=state.template;
    if($('cvAccent')) $('cvAccent').value=state.branding.accent;
    if($('cvFont')) $('cvFont').value=state.branding.font;
    if($('cvDensity')) $('cvDensity').value=state.branding.density;
  }

  function init(){
    load();
    ensureFont(state.branding.font);
    bindStatic();
    Object.keys(SECTIONS).forEach(function(k){ renderSection(k); bindSection(k); });
    bindBranding(); bindPhoto(); bindTemplate(); bindImportPerfil();
    var rb=$('cvReset'); if(rb) rb.addEventListener('click',reset);
    initForm();
    render();
    window.addEventListener('resize',function(){ if(raf)return; raf=requestAnimationFrame(function(){raf=null;updatePageMeter();}); });
  }

  window.CVBuilder={
    init:init,
    getData:function(){return state.cvData;},
    getState:function(){return state;},
    // usado por cv-import (fase 3): reemplaza datos y refresca todo
    setData:function(cv){ state.cvData=Object.assign(emptyCV(),cv); initForm(); render(); autosave(); }
  };
})();
