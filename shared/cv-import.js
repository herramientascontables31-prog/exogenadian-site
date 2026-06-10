/* ═══ ExógenaDIAN — Mejora tu HV con IA ═══
   Lee la HV actual (PDF o texto), pide a la IA reescribir los logros y
   devolver JSON mapeable a cvData, y precarga el constructor.
   One-shot (sin historial) para minimizar consumo. PRO + límite gratis diario.
   Backend: /api/chat (streaming SSE), el mismo del asistente Exa.
*/
(function(){
  'use strict';
  if(window.CVImport) return;

  var API_URL='https://dian-proxy-337146111457.southamerica-east1.run.app/api/chat';
  var KEY_FREE='exogenadian_ia_usage';                 // contador diario compartido (free)
  var KEY_PRO='exogenadian_ia_usage_pro_hojadevida';
  var MAX_FREE=3, MAX_PRO=50, MAX_CHARS=7000;

  function $(id){return document.getElementById(id);}
  var isPro=false, busy=false;

  // ─── Límite diario ───
  function lk(){return isPro?KEY_PRO:KEY_FREE;}
  function maxN(){return isPro?MAX_PRO:MAX_FREE;}
  function today(){return new Date().toISOString().slice(0,10);}
  function usage(){var d={};try{d=JSON.parse(localStorage.getItem(lk())||'{}');}catch(e){}
    if(d.date!==today())return{count:0,max:maxN()};return{count:d.count||0,max:maxN()};}
  function consume(){var d={};try{d=JSON.parse(localStorage.getItem(lk())||'{}');}catch(e){}
    if(d.date!==today()){d.date=today();d.count=0;} d.count=(d.count||0)+1;
    try{localStorage.setItem(lk(),JSON.stringify(d));}catch(e){}}
  function refreshUsage(){
    var u=usage(), rem=Math.max(0,u.max-u.count), el=$('cvAiUsage');
    if(!el) return;
    if(isPro){ el.innerHTML='<span style="color:#059669;font-weight:700">PRO</span> · '+rem+' de '+u.max+' usos hoy'; }
    else { el.innerHTML=rem+' de '+u.max+' mejoras <b>gratis</b> hoy'+(rem===0?' — <a href="precios.html">desbloquea con PRO</a>':''); }
    if(rem===0 && !isPro){ el.classList.add('limit-banner'); } else { el.classList.remove('limit-banner'); }
  }

  // ─── Lectura del archivo ───
  function readFile(file){
    return new Promise(function(res,rej){
      var ext=(file.name.split('.').pop()||'').toLowerCase();
      if(ext==='pdf'){
        if(!window.PensionPDFParser){ rej('No se pudo cargar el lector de PDF. Pega el texto.'); return; }
        PensionPDFParser.extractText(file).then(function(r){ res((r&&r.text)||''); })
          .catch(function(){ rej('No pude leer el PDF (¿está protegido o escaneado?). Pega el texto.'); });
      } else if(ext==='txt'){
        var fr=new FileReader(); fr.onload=function(){res(String(fr.result||''));}; fr.onerror=function(){rej('No pude leer el archivo.');}; fr.readAsText(file);
      } else { rej('Formato no soportado. Sube un PDF o pega el texto.'); }
    });
  }

  // ─── Prompt e IA ───
  function buildMessages(text){
    var schema='{"personal":{"nombre":"","titular":"","email":"","telefono":"","ciudad":"","pais":"Colombia","linkedin":"","portafolio":""},'+
      '"resumen":"","experiencia":[{"cargo":"","empresa":"","ciudad":"","inicio":"","fin":"","actual":false,"logros":[""]}],'+
      '"educacion":[{"titulo":"","institucion":"","ciudad":"","inicio":"","fin":"","estado":""}],'+
      '"habilidades":[{"nombre":""}],"idiomas":[{"idioma":"","nivel":""}],"certificaciones":[{"nombre":"","entidad":"","ano":""}]}';
    var prompt='Eres un experto en selección de personal en Colombia. A partir del TEXTO de una hoja de vida, '+
      'devuelve ÚNICAMENTE un JSON válido (sin markdown ni explicaciones) con esta forma exacta:\n'+schema+'\n'+
      'Reglas: NO inventes datos de contacto, empresas, títulos ni fechas que no estén en el texto. '+
      'Mejora la redacción de cada logro: empiézalo con un verbo de acción (lideré, reduje, implementé, aumenté…) '+
      'y agrega una métrica solo si el texto la menciona. Fechas en formato "YYYY-MM" cuando sea posible. '+
      'Si un dato no existe, deja "" o []. No incluyas nada fuera del JSON.\n\nTEXTO:\n<<<\n'+text.slice(0,MAX_CHARS)+'\n>>>';
    return [{role:'user',content:prompt}];
  }

  function callIA(text){
    var ctrl=new AbortController();
    var to=setTimeout(function(){ctrl.abort();},60000);
    return fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages:buildMessages(text),page:null,page_name:null,page_state:null}),
      signal:ctrl.signal
    }).then(function(resp){
      clearTimeout(to);
      if(!resp.ok) return resp.json().catch(function(){return{};}).then(function(e){throw (e.error||('Error del servidor ('+resp.status+')'));});
      var ct=(resp.headers.get('content-type')||'').toLowerCase();
      if(ct.indexOf('application/json')!==-1){ return resp.json().then(function(j){ if(j.error) throw j.error; throw 'Respuesta inesperada del servidor.'; }); }
      if(!resp.body||!resp.body.getReader) throw 'Tu navegador no soporta streaming.';
      var reader=resp.body.getReader(), dec=new TextDecoder(), buf='', full='';
      function pump(){
        return reader.read().then(function(r){
          if(r.done) return full;
          buf+=dec.decode(r.value,{stream:true});
          var lines=buf.split('\n'); buf=lines.pop()||'';
          for(var i=0;i<lines.length;i++){ var ln=lines[i]; if(ln.indexOf('data: ')!==0) continue;
            var d; try{d=JSON.parse(ln.slice(6));}catch(e){continue;}
            if(d.type==='text'&&d.text) full+=d.text;
            else if(d.type==='error') throw (d.error||'Error del asistente.');
            else if(d.type==='done') return full;
          }
          return pump();
        });
      }
      return pump();
    });
  }

  // ─── Parseo y saneo ───
  function extractJSON(s){
    if(!s) return null;
    s=s.replace(/```json/gi,'').replace(/```/g,'');
    var a=s.indexOf('{'), b=s.lastIndexOf('}');
    if(a<0||b<0) return null;
    try{ return JSON.parse(s.slice(a,b+1)); }catch(e){ return null; }
  }
  function uid(){return 'i'+Math.random().toString(36).slice(2,9);}
  function str(v){return v==null?'':String(v);}
  function arr(v){return Array.isArray(v)?v:[];}
  function sanitize(j){
    var p=j.personal||{};
    return {
      meta:{idioma:'es',version:1},
      personal:{nombre:str(p.nombre),titular:str(p.titular),foto:'',email:str(p.email),
        telefono:str(p.telefono),ciudad:str(p.ciudad),pais:str(p.pais)||'Colombia',
        linkedin:str(p.linkedin),portafolio:str(p.portafolio)},
      resumen:str(j.resumen),
      experiencia:arr(j.experiencia).map(function(e){e=e||{};return{id:uid(),cargo:str(e.cargo),empresa:str(e.empresa),
        ciudad:str(e.ciudad),inicio:str(e.inicio),fin:str(e.fin),actual:!!e.actual,
        logros:(arr(e.logros).map(str).filter(Boolean).length?arr(e.logros).map(str):[''])};}),
      educacion:arr(j.educacion).map(function(e){e=e||{};return{id:uid(),titulo:str(e.titulo),institucion:str(e.institucion),
        ciudad:str(e.ciudad),inicio:str(e.inicio),fin:str(e.fin),estado:str(e.estado)};}),
      habilidades:arr(j.habilidades).map(function(h){h=h||{};return{id:uid(),nombre:str(h.nombre||h),nivel:''};}).filter(function(h){return h.nombre;}),
      idiomas:arr(j.idiomas).map(function(i){i=i||{};return{id:uid(),idioma:str(i.idioma||i),nivel:str(i.nivel)};}).filter(function(i){return i.idioma;}),
      certificaciones:arr(j.certificaciones).map(function(c){c=c||{};return{id:uid(),nombre:str(c.nombre||c),entidad:str(c.entidad),ano:str(c.ano)};}).filter(function(c){return c.nombre;}),
      referencias:[]
    };
  }

  function setStatus(msg,type){
    var el=$('cvAiStatus'); if(!el) return;
    el.textContent=msg||'';
    el.style.color=type==='err'?'#B91C1C':(type==='ok'?'#059669':'#6B7280');
  }

  // ─── Flujo principal ───
  function run(){
    if(busy) return;
    var u=usage();
    if(u.count>=u.max){ refreshUsage(); setStatus(isPro?'Alcanzaste el máximo de hoy.':'Llegaste al límite gratis de hoy. Desbloquea con PRO.','err'); return; }
    var text=($('cvAiText')&&$('cvAiText').value||'').trim();
    if(text.length<40){ setStatus('Pega el texto de tu HV (o sube un PDF) — necesito algo de contenido.','err'); return; }
    if(!confirm('La IA va a reescribir tu HV y REEMPLAZAR el contenido actual del constructor. ¿Continuar?')) return;
    busy=true; var btn=$('cvAiBtn'); if(btn){btn.disabled=true;}
    setStatus('Analizando y mejorando tu HV… (puede tardar unos segundos)');
    callIA(text).then(function(full){
      var j=extractJSON(full);
      if(!j) throw 'La IA no devolvió un formato válido. Intenta de nuevo o revisa el texto.';
      var cv=sanitize(j);
      if(!cv.experiencia.length && !cv.resumen && !cv.personal.nombre) throw 'No pude extraer información de la HV. Revisa el texto pegado.';
      consume();
      if(window.CVBuilder && CVBuilder.setData) CVBuilder.setData(cv);
      refreshUsage();
      setStatus('✓ Listo: tu HV fue mejorada y cargada. Revísala y ajústala a tu gusto.','ok');
      (window.exoToast&&exoToast.success?exoToast.success:function(){})('HV mejorada con IA');
    }).catch(function(err){
      var m=(typeof err==='string')?err:(err&&err.message)||'No se pudo completar. Intenta de nuevo.';
      if(err&&err.name==='AbortError') m='La IA tardó demasiado. Intenta con un texto más corto.';
      setStatus(m,'err');
    }).then(function(){ busy=false; var b=$('cvAiBtn'); if(b){b.disabled=false;} });
  }

  function init(){
    if(!$('cvAiPanel')) return;
    var hasSaved=(window.exoPro&&exoPro.getSaved&&exoPro.getSaved());
    isPro=!!hasSaved;
    refreshUsage();
    if(window.exoPro&&exoPro.check){ exoPro.check().then(function(p){ isPro=!!p; refreshUsage(); }); }
    var f=$('cvAiFile');
    if(f) f.addEventListener('change',function(){
      var file=f.files&&f.files[0]; if(!file) return;
      if(file.size>20*1024*1024){ setStatus('El archivo supera 20 MB.','err'); f.value=''; return; }
      setStatus('Leyendo '+file.name+'…');
      readFile(file).then(function(t){ if($('cvAiText')) $('cvAiText').value=t.slice(0,MAX_CHARS); setStatus(t.trim()?'Texto cargado. Pulsa "Mejorar".':'No encontré texto en el archivo.', t.trim()?'':'err'); })
        .catch(function(e){ setStatus(typeof e==='string'?e:'No pude leer el archivo.','err'); });
      f.value='';
    });
    var btn=$('cvAiBtn'); if(btn) btn.addEventListener('click',run);
    window.addEventListener('ia-pro-activated',function(){ isPro=true; refreshUsage(); });
  }

  window.CVImport={init:init};
})();
