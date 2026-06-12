/* ═══ ExógenaDIAN — Frase Ecard flotante ═══
   Modal verde icónico con frases para contadores colombianos, con botón para
   guardar la imagen lista para Instagram/WhatsApp. Se abre solo bajo demanda
   (escuela/frases-contadores.html); el auto-disparo tras descargas se retiró
   en jun-2026.

   API:
     window.exoFrase.trigger()       — Dispara con frase aleatoria respetando dedupe.
     window.exoFrase.show(textoOpc)  — Fuerza apertura (ignora dedupe). Acepta texto custom.
*/
(function(){
  'use strict';
  if(window.exoFrase)return;

  /* ─── Pool de frases ─── */
  var POOL_EVERGREEN=[
    // Honor del oficio (year-round)
    'Los números no mienten, pero hay que saber escucharlos.',
    'Nadie ve lo que hacemos hasta que dejamos de hacerlo.',
    'No vendemos servicios contables: vendemos noches tranquilas.',
    'Tu trabajo no se nota cuando todo sale bien. Ese es justamente el punto.',
    'Ser contador es una de las pocas profesiones donde la perfección no es opción, es obligación. Y aún así, lo logras.',
    'El cliente no lo va a notar. La DIAN tampoco. Pero tú sostuviste su empresa este mes. Eso vale.',
    'No es suerte. Es disciplina, técnica y aguante. Tres cosas que no se enseñan en un tutorial.',
    // MUISCA y DIAN (year-round)
    'MUISCA es como mi ex: nunca está cuando lo necesito.',
    'El plan B del contador colombiano se llama F5.',
    'Cuando MUISCA funciona el día del vencimiento, desconfío.',
    'La DIAN exige puntualidad con un servidor que no la conoce.',
    'Mi relación con MUISCA: tóxica pero estable.',
    'Dios creó el mundo en 7 días porque no tuvo que conciliar bancos.',
    // Identidad contable (year-round)
    'Los contadores no envejecen: se deprecian.',
    'Mi vida social cabe en una pestaña de Excel.',
    'Mi terapeuta se llama Excel.',
    'Mi vida amorosa: un activo intangible de difícil valoración.',
    // Cliente (year-round)
    'Le ahorré 50 millones en sanciones y se quejó por la cuenta de cobro.',
    '«¿Por qué tan caro si es solo llenar un formulario?» — Por los cinco años que estudié para saber cuál llenar.',
    // Mentalidad auditor (year-round) — reencuadre del oficio
    'El algoritmo prediligencia. Tú revisas, decides y firmas. El que no se puede equivocar eres tú — por eso vales.',
    'Aquí no vienes a que te lo hagan. Vienes a aprender a revisarlo. Esa es la diferencia entre un digitador y un contador.',
    'Doble y triple check no es desconfianza. Es el oficio. Siempre lo fue.',
    'Leer aquí no es perder tiempo: es volverte el que detecta el error antes que la DIAN.',
    'Cambia el chip: no eres el operario del formulario, eres su auditor.',
    'Ninguna herramienta responde ante la DIAN por ti. Por eso la revisas tú.',
    'Soñábamos con dejar de digitar para volver a pensar. Esto es eso — úsalo como contador, no como copista.',
    'El error no es de la herramienta ni tuyo por usarla. Es tuyo solo si lo presentas sin revisar.'
  ];

  var POOL_SEASONAL=[
    // Mayo y cierres (mayo-jul)
    'Mayo 2026 no es un mes: es una prueba de resistencia humana.',
    'Detrás de cada empresa exitosa hay un contador que no duerme en mayo.',
    'Detrás de cada empresa tranquila hay un contador que no durmió.',
    'Mi calendario de mayo: vencimiento, vencimiento, vencimiento, domingo (también vencimiento).',
    'Tengo abiertos: MUISCA, Supersociedades, dos prevalidadores, exógena del cliente y lo que queda de mi paciencia.',
    'Si sobrevives a mayo 2026, te puedes pensionar emocionalmente.',
    'En mayo no se vive, se sobrevive entre cierres.',
    'El cuerpo en mayo: 60% café, 30% estrés, 10% fe en que la DIAN no saque otra resolución.',
    'Si te invitan a un plan en mayo, es porque no te conocen bien.',
    'Mi calendario no tiene meses, tiene vencimientos.',
    'Hoy es mayo. Mañana también. Aguanta.',
    'Exógena, IVA, renta, cierre. Repetir.',
    // Aguante (mayo-jul)
    'Ser contador en Colombia es deporte de alto rendimiento.',
    'Cada obligación entregada a tiempo este mayo es una medalla que nadie ve, pero tú sabes que la ganaste.',
    'Cuando todos hablen de mitad de año en julio, tú recordarás que sostuviste mayo solo.',
    'Si llegas vivo a julio, ya ganaste.',
    'Respira. Cae la página, no tú.',
    'Tú no eres la DIAN. Tú llegas a tiempo.'
  ];

  function activePool(){
    var m=new Date().getMonth();   // 0=ene, 4=mayo, 6=julio
    if(m>=4&&m<=6)return POOL_EVERGREEN.concat(POOL_SEASONAL);
    return POOL_EVERGREEN.slice();
  }

  /* ─── Selección sin repetir ─── */
  var STORAGE_KEY='exo_frase_shown_v1';
  function pickFrase(){
    var pool=activePool();
    var shown=[];
    try{var raw=localStorage.getItem(STORAGE_KEY);if(raw)shown=JSON.parse(raw)||[]}catch(_){}
    var pending=pool.filter(function(q){return shown.indexOf(q)===-1});
    if(!pending.length){shown=[];pending=pool.slice()}
    var pick=pending[Math.floor(Math.random()*pending.length)];
    shown.push(pick);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(shown))}catch(_){}
    return pick;
  }

  /* ─── Estilos del modal ─── */
  function injectStyles(){
    if(document.getElementById('exo-frase-styles'))return;
    var st=document.createElement('style');
    st.id='exo-frase-styles';
    st.textContent=
      '.exo-frase-back{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(6,78,59,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transition:opacity .35s ease}'+
      '.exo-frase-back.on{display:flex;opacity:1}'+
      '.exo-frase-card{position:relative;width:100%;max-width:480px;background:linear-gradient(135deg,#064E3B,#047857);color:#fff;border-radius:22px;padding:48px 36px 32px;box-shadow:0 30px 80px rgba(0,0,0,.45);overflow:hidden;transform:scale(.92) translateY(12px);transition:transform .4s cubic-bezier(.2,.9,.3,1.4)}'+
      '.exo-frase-back.on .exo-frase-card{transform:scale(1) translateY(0)}'+
      '.exo-frase-card::before{content:"\\201C";font-family:Fraunces,Georgia,serif;font-size:14rem;line-height:1;position:absolute;top:-44px;left:8px;color:rgba(255,255,255,.08);font-weight:700;pointer-events:none}'+
      '.exo-frase-card blockquote{font-family:Fraunces,Georgia,serif;font-size:1.55rem;font-weight:600;line-height:1.32;margin:0 0 26px;position:relative;z-index:1;letter-spacing:-.005em}'+
      '.exo-frase-mark{font-family:Outfit,system-ui,sans-serif;font-size:.74rem;font-weight:700;color:#A7F3D0;letter-spacing:.14em;text-transform:uppercase;position:relative;z-index:1;display:flex;align-items:center;gap:8px;margin-bottom:22px}'+
      '.exo-frase-mark::before{content:"";display:inline-block;width:22px;height:1px;background:#6EE7B7}'+
      '.exo-frase-actions{display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1}'+
      '.exo-frase-btn{flex:1;min-width:130px;padding:11px 14px;border-radius:10px;border:none;cursor:pointer;font-family:Outfit,system-ui,sans-serif;font-size:.86rem;font-weight:700;transition:.18s;display:inline-flex;align-items:center;justify-content:center;gap:6px}'+
      '.exo-frase-btn.pri{background:#fff;color:#064E3B}'+
      '.exo-frase-btn.pri:hover{background:#ECFDF5;transform:translateY(-1px)}'+
      '.exo-frase-btn.sec{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.22)}'+
      '.exo-frase-btn.sec:hover{background:rgba(255,255,255,.22)}'+
      '.exo-frase-x{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:1.2rem;cursor:pointer;z-index:2;line-height:1;display:flex;align-items:center;justify-content:center;transition:.15s}'+
      '.exo-frase-x:hover{background:rgba(255,255,255,.22)}'+
      '.exo-frase-hint{font-size:.7rem;color:#A7F3D0;margin-top:14px;text-align:center;letter-spacing:.04em;position:relative;z-index:1;opacity:.75}'+
      '@media(max-width:520px){.exo-frase-card{padding:42px 26px 26px}.exo-frase-card blockquote{font-size:1.28rem}.exo-frase-btn{font-size:.8rem;min-width:0}}';
    document.head.appendChild(st);
  }

  /* ─── DOM del modal ─── */
  var backEl=null,cardEl=null,quoteEl=null;
  function buildModal(){
    if(backEl)return;
    injectStyles();
    backEl=document.createElement('div');
    backEl.className='exo-frase-back';
    backEl.setAttribute('role','dialog');
    backEl.setAttribute('aria-label','Frase para contadores');
    backEl.innerHTML=
      '<div class="exo-frase-card">'+
        '<button class="exo-frase-x" type="button" aria-label="Cerrar">×</button>'+
        '<div class="exo-frase-mark">Para el contador colombiano</div>'+
        '<blockquote class="exo-frase-q"></blockquote>'+
        '<div class="exo-frase-actions">'+
          '<button class="exo-frase-btn pri" data-act="save" type="button">📸 Guardar imagen</button>'+
          '<button class="exo-frase-btn sec" data-act="copy" type="button">📋 Copiar texto</button>'+
        '</div>'+
        '<div class="exo-frase-hint">exogenadian.com</div>'+
      '</div>';
    document.body.appendChild(backEl);
    cardEl=backEl.querySelector('.exo-frase-card');
    quoteEl=backEl.querySelector('.exo-frase-q');
    backEl.addEventListener('click',function(e){if(e.target===backEl)close()});
    backEl.querySelector('.exo-frase-x').addEventListener('click',close);
    backEl.addEventListener('click',function(e){
      var b=e.target.closest('.exo-frase-btn');
      if(!b)return;
      var act=b.getAttribute('data-act');
      var txt=quoteEl.textContent;
      if(act==='copy'){
        var full=txt+' — exogenadian.com';
        if(navigator.clipboard&&navigator.clipboard.writeText){
          navigator.clipboard.writeText(full).then(function(){
            b.textContent='Copiada ✓';
            setTimeout(function(){b.textContent='📋 Copiar texto'},1800);
          });
        }
      }else if(act==='save'){
        saveAsImage(txt,b);
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&backEl.classList.contains('on'))close();
    });
  }

  function open(text){
    buildModal();
    quoteEl.textContent=text;
    requestAnimationFrame(function(){backEl.classList.add('on')});
    document.body.style.overflow='hidden';
    if(window.gtag){try{gtag('event','frase_ecard_shown',{frase:text.slice(0,50)})}catch(_){}}
  }
  function close(){
    if(!backEl)return;
    backEl.classList.remove('on');
    document.body.style.overflow='';
  }

  /* ─── Render canvas para descarga PNG (1080x1080) ─── */
  function saveAsImage(text,btn){
    var SIZE=1080;
    var c=document.createElement('canvas');
    c.width=SIZE;c.height=SIZE;
    var ctx=c.getContext('2d');

    // Gradient background
    var g=ctx.createLinearGradient(0,0,SIZE,SIZE);
    g.addColorStop(0,'#064E3B');
    g.addColorStop(1,'#047857');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,SIZE,SIZE);

    // Decorative quote mark
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.font='900 720px Georgia, serif';
    ctx.textBaseline='top';
    ctx.fillText('“',-40,-180);

    // Brand tag
    ctx.fillStyle='#A7F3D0';
    ctx.font='700 26px "Outfit", system-ui, sans-serif';
    ctx.textBaseline='alphabetic';
    var brandY=180;
    ctx.fillRect(110,brandY-10,40,2);
    ctx.fillText('PARA EL CONTADOR COLOMBIANO',170,brandY);

    // Quote text — wrap to fit
    ctx.fillStyle='#FFFFFF';
    var quoteFontSize=64;
    ctx.font='600 '+quoteFontSize+'px Georgia, serif';
    var maxWidth=SIZE-220;
    var lines=wrapText(ctx,text,maxWidth);
    // si quedan muchas líneas, bajar font-size
    while(lines.length>8&&quoteFontSize>40){
      quoteFontSize-=4;
      ctx.font='600 '+quoteFontSize+'px Georgia, serif';
      lines=wrapText(ctx,text,maxWidth);
    }
    var lineHeight=Math.round(quoteFontSize*1.28);
    var totalHeight=lines.length*lineHeight;
    var startY=Math.round((SIZE-totalHeight)/2)+20;
    lines.forEach(function(ln,i){ctx.fillText(ln,110,startY+i*lineHeight+quoteFontSize)});

    // Footer: divider + brand
    ctx.fillStyle='#6EE7B7';
    ctx.fillRect(110,SIZE-130,60,2);
    ctx.fillStyle='#A7F3D0';
    ctx.font='700 30px "Outfit", system-ui, sans-serif';
    ctx.fillText('exogenadian.com',110,SIZE-90);
    ctx.fillStyle='rgba(255,255,255,.55)';
    ctx.font='400 22px "Outfit", system-ui, sans-serif';
    ctx.fillText('Herramientas contables gratis · Hecho en Colombia',110,SIZE-55);

    c.toBlob(function(blob){
      if(!blob){btn.textContent='Error :(';return}
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a');
      a.href=url;
      a.download='exogenadian-frase-'+Date.now()+'.png';
      document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(url);a.remove()},800);
      btn.textContent='Guardada ✓';
      setTimeout(function(){btn.textContent='📸 Guardar imagen'},1800);
      if(window.gtag){try{gtag('event','frase_ecard_saved')}catch(_){}}
    },'image/png');
  }

  function wrapText(ctx,text,maxWidth){
    var words=text.split(/\s+/);
    var lines=[],cur='';
    for(var i=0;i<words.length;i++){
      var test=cur?cur+' '+words[i]:words[i];
      if(ctx.measureText(test).width<=maxWidth)cur=test;
      else{if(cur)lines.push(cur);cur=words[i]}
    }
    if(cur)lines.push(cur);
    return lines;
  }

  /* ─── API pública ─── */
  var SESSION_KEY='exo_frase_session_v1';
  function trigger(){
    try{if(sessionStorage.getItem(SESSION_KEY))return}catch(_){}
    var text=pickFrase();
    try{sessionStorage.setItem(SESSION_KEY,'1')}catch(_){}
    setTimeout(function(){open(text)},650); // delay para que la descarga arranque primero
  }
  function show(text){
    open(text||pickFrase());
  }

  window.exoFrase={trigger:trigger,show:show,close:close,_pool:activePool};
})();
