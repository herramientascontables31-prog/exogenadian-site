/* ═══ ExógenaDIAN — Shared Navigation Component ═══
   Uso:
     Paginas principales (index, blog):
       <div id="nav-container" data-variant="full"></div>
       <script src="shared/nav.js"></script>

     Paginas de herramientas:
       <div id="nav-container"></div>
       <script src="shared/nav.js"></script>
*/
(function(){
  'use strict';

  /* ═══ Banner unificado: vencimientos + disclaimer en una sola barra ═══ */
  (function(){
    if(localStorage.getItem('exo_banner_modulos_2026_05')) return;
    var bannerCSS=document.createElement('style');
    bannerCSS.textContent=`
      .exo-announce{position:relative;top:0;left:0;right:0;z-index:50;background:#0A0F1E;color:#E2E8F0;font-family:'Outfit',sans-serif;padding:9px 20px 7px;border-bottom:2px solid #22C55E}
      .exo-announce-row{display:flex;align-items:center;justify-content:center;gap:12px;font-size:.88rem;flex-wrap:wrap}
      .exo-announce-text{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;text-align:center}
      .exo-announce-cta{display:inline-flex;align-items:center;gap:5px;background:#22C55E;color:#0A0F1E;padding:5px 14px;border-radius:8px;font-weight:700;font-size:.8rem;text-decoration:none;transition:all .2s;white-space:nowrap}
      .exo-announce-cta:hover{background:#16A34A;color:#fff;transform:translateY(-1px)}
      .exo-announce-x{background:none;border:none;color:#64748B;font-size:1.15rem;cursor:pointer;padding:2px 6px;margin-left:6px;transition:color .2s;flex-shrink:0;line-height:1}
      .exo-announce-x:hover{color:#fff}
      .exo-announce-sub{font-size:.72rem;color:#94A3B8;text-align:center;margin-top:4px;line-height:1.4}
      .exo-announce-sub strong{color:#E2E8F0}
      .exo-announce-sub a{color:#86EFAC;text-decoration:underline}
      @media(max-width:600px){.exo-announce{padding:7px 12px 5px}.exo-announce-row{font-size:.78rem;gap:8px}.exo-announce-cta{padding:4px 10px;font-size:.74rem}.exo-announce-sub{font-size:.66rem}}
    `;
    document.head.appendChild(bannerCSS);
    var banner=document.createElement('div');
    banner.className='exo-announce';
    banner.setAttribute('role','region');
    banner.setAttribute('aria-label','Anuncio y disclaimer');
    banner.innerHTML=
      '<div class="exo-announce-row">'+
        '<span class="exo-announce-text">🎉 Nuevo: <strong>20 documentos contables</strong> + <strong>35 prompts IA</strong> — gratis</span>'+
        '<a href="'+P+'certificados.html" class="exo-announce-cta" onclick="if(typeof exoTrack!==\'undefined\')exoTrack.ctaClick(\'banner_modulos\',\'certificados\')">Ver herramientas →</a>'+
        '<button class="exo-announce-x" aria-label="Cerrar anuncio" onclick="this.parentElement.parentElement.remove();localStorage.setItem(\'exo_banner_modulos_2026_05\',\'1\')">&times;</button>'+
      '</div>'+
      '<div class="exo-announce-sub">Cuenta de cobro · ingresos PN · no obligación renta · aportes SS · laboral · EEFF · capital SAS · RUP · NIA 210 — con descarga PDF y Word. <a href="'+P+'prompts.html">Ver prompts →</a> · <strong>Borrador prediligenciado por algoritmos</strong> — el contador verifica y firma.</div>';
    document.body.insertAdjacentElement('afterbegin',banner);
  })();

  /* ─── Security: inject CSP meta tag if not present ───
     frame-ancestors no funciona en <meta> (solo via header HTTP), lo omitimos
     para evitar warnings en consola. object-src y base-uri sí son válidos. */
  if(!document.querySelector('meta[http-equiv="Content-Security-Policy"]')){
    var csp=document.createElement('meta');
    csp.httpEquiv='Content-Security-Policy';
    csp.content="object-src 'none'; base-uri 'self'";
    document.head.appendChild(csp);
  }

  var APPS_SCRIPT_URL='https://script.google.com/macros/s/AKfycbwT5ofExiwOKKLnBlwH6Uqhs4cdDpaieSiLn2dYf5D-6yPIdJ_9XEWeIGYyq1ViNKiasQ/exec';
  var container=document.getElementById('nav-container');
  var variant=(container&&container.getAttribute('data-variant'))||'full';
  var page=location.pathname.split('/').pop()||'index.html';

  /* ─── Tutoriales contextual: si la página tiene tutorial dedicado, el botón
        cambia su label y href para llevar directo a SU tutorial. Si no tiene,
        queda genérico hacia el hub. En el hub mismo se oculta. ─── */
  var TUTORIAL_MAP={
    'exogena.html':{href:'tutoriales/exogena.html',label:'Tutorial Exógena'},
    'exogena-suite.html':{href:'tutoriales/exogena.html',label:'Tutorial Exógena'},
    'renta-juridica.html':{href:'tutoriales/f110.html',label:'Tutorial F110'},
    'renta110.html':{href:'tutoriales/f110.html',label:'Tutorial F110'},
    'iva300.html':{href:'tutoriales/f300.html',label:'Tutorial F300'},
    'impuesto-consumo.html':{href:'tutoriales/f310.html',label:'Tutorial F310'},
    'retencion350.html':{href:'tutoriales/f350.html',label:'Tutorial F350'},
    'conciliacion.html':{href:'tutoriales/conciliacion.html',label:'Tutorial Conciliación'},
    'formato2516.html':{href:'tutoriales/f2516.html',label:'Tutorial F2516'},
    'renta-personas-naturales.html':{href:'tutoriales/f210.html',label:'Tutorial F210'},
    'formato210-pro.html':{href:'tutoriales/f210.html',label:'Tutorial F210'}
  };
  var _tutMatch=TUTORIAL_MAP[page];
  var _tutHref=_tutMatch?_tutMatch.href:'tutoriales.html';
  var _tutLabel=_tutMatch?_tutMatch.label:'Tutoriales';
  var _showTutBtn=(page!=='tutoriales.html');

  /* ─── Path prefix: si la página está en subcarpeta (ej. /escuela/finanzas.html),
        anteponer '../' a los hrefs relativos del nav para evitar 404s ─── */
  var _segs=location.pathname.split('/').filter(function(s){return s;});
  var _depth=Math.max(0,_segs.length-1);
  var P=_depth>0?new Array(_depth+1).join('../'):'';
  function H(href){
    if(!href)return href;
    if(/^(https?:|\/\/|\/|#|mailto:|tel:|javascript:|\.\.?\/)/.test(href))return href;
    return P+href;
  }

  /* ─── HTML del botón Tutoriales (contextual). Vacío en el hub. ─── */
  var _tutorialBtnReducida=!_showTutBtn?'':
    '    <a href="'+P+_tutHref+'" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid #FFEDD5;border-radius:8px;background:#FFF7ED;font-size:.82rem;font-weight:600;color:#EA580C;text-decoration:none;transition:all .15s;white-space:nowrap" onmouseover="this.style.background=\'#FFEDD5\';this.style.borderColor=\'#F97316\'" onmouseout="this.style.background=\'#FFF7ED\';this.style.borderColor=\'#FFEDD5\'">📚 '+_tutLabel+'</a>';
  var _tutorialBtnCompleta=!_showTutBtn?'':
    '    <a href="'+P+_tutHref+'" class="nav-tutoriales-cta" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#fff;color:#EA580C;border:2px solid #FED7AA;border-radius:12px;font-size:.88rem;font-weight:700;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor=\'#F97316\';this.style.background=\'#FFF7ED\'" onmouseout="this.style.borderColor=\'#FED7AA\';this.style.background=\'#fff\'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'+_tutLabel+'</a>';

  /* ─── Load Outfit font for full nav if not already present ─── */
  if(!document.querySelector('link[href*="Outfit"]')){
    var fontLink=document.createElement('link');
    fontLink.rel='stylesheet';
    fontLink.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);
  }

  /* ─── Mega-menu CSS (injected once) ─── */
  var megaCSS=document.createElement('style');
  megaCSS.textContent=`
    /* ===== FULL NAV BASE ===== */
    nav#nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 28px;background:rgba(255,255,255,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.04);transition:all .3s;font-family:'Outfit',sans-serif}
    nav#nav.scrolled{box-shadow:0 1px 20px rgba(0,0,0,.06)}
    .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#111827;font-weight:800;font-size:1.15rem;letter-spacing:-.02em;flex-shrink:0;white-space:nowrap}
    .logo-mark{width:34px;height:34px;background:linear-gradient(135deg,#059669,#34D399);border-radius:10px;display:grid;place-items:center;color:#fff;font-size:.85rem;font-weight:900;flex-shrink:0}
    .logo small{font-weight:400;font-size:.65rem;color:#9CA3AF;display:block;margin-top:-2px;letter-spacing:.04em;white-space:nowrap}
    .nav-links{display:flex;gap:18px;align-items:center;flex-wrap:nowrap}
    .nav-links>a{text-decoration:none;color:#6B7280;font-size:.88rem;font-weight:500;transition:color .2s;font-family:'Outfit',sans-serif;white-space:nowrap;flex-shrink:0}
    .nav-links>a:hover{color:#111827}
    .nav-dropdown{position:relative;flex-shrink:0}
    .nav-dropdown-toggle{display:inline-flex;align-items:center;gap:5px;text-decoration:none;color:#6B7280;font-size:.88rem;font-weight:500;transition:color .2s;cursor:pointer;background:none;border:none;font-family:'Outfit',sans-serif;padding:0;white-space:nowrap}
    .nav-dropdown-toggle:hover{color:#111827}
    .nav-dropdown-toggle svg{width:14px;height:14px;transition:transform .2s}
    .nav-dropdown.open .nav-dropdown-toggle svg{transform:rotate(180deg)}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border-radius:12px;font-family:'Outfit',sans-serif;font-weight:600;font-size:1rem;text-decoration:none;transition:all .2s;cursor:pointer;border:none;white-space:nowrap}
    .btn-green{background:#059669;color:#fff}
    .btn-green:hover{background:#047857;transform:translateY(-1px);box-shadow:0 25px 60px -12px rgba(5,150,105,.15)}
    .btn-sm{padding:8px 16px;font-size:.82rem;border-radius:10px}
    .nav-ia-cta,.nav-tutoriales-cta,.nav-escuela-cta{white-space:nowrap;flex-shrink:0}
    .nav-pro-login{display:flex;align-items:stretch;flex-shrink:0;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;height:34px;transition:all .2s}
    .nav-pro-login:focus-within{border-color:#10B981;background:#fff;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
    .nav-pro-login input{padding:0 10px;border:none;background:transparent;font-size:.78rem;font-family:inherit;width:140px;text-align:left;color:#374151;outline:none}
    .nav-pro-login input::placeholder{color:#9CA3AF}
    .nav-pro-login button{padding:0 14px;background:#059669;color:#fff!important;border:none;font-size:.75rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .15s}
    .nav-pro-login button:hover{background:#047857}
    .hamburger{display:none;background:none;border:none;font-size:1.5rem;cursor:pointer;padding:8px;color:#374151;flex-shrink:0;z-index:101}
    @media(max-width:1200px){
      nav#nav{padding:12px 24px;gap:14px}
      .nav-links{gap:14px}
      .logo small{display:none}
    }
    @media(max-width:1080px){
      nav#nav{padding:12px 20px;flex-wrap:nowrap}
      .hamburger{display:block!important}
      .nav-links{display:none;position:absolute;top:100%;left:0;right:0;width:100%;background:#fff;padding:16px 20px;flex-direction:column;gap:12px;border-top:1px solid #E5E7EB;box-shadow:0 8px 20px rgba(0,0,0,.08);z-index:100;max-height:80vh;overflow-y:auto;flex-wrap:wrap}
      .nav-links.open{display:flex}
      .nav-pro-login{width:100%;justify-content:space-between}
      .nav-pro-login input{flex:1}
      .logo small{display:block}
    }
    /* ===== MEGA MENU ===== */
    .mega-menu{display:none;position:fixed;top:70px;left:50%;transform:translateX(-50%);background:var(--white,#fff);border:1.5px solid var(--gray-200,#E5E7EB);border-radius:16px;padding:18px 22px;width:980px;max-width:calc(100vw - 32px);max-height:calc(100vh - 90px);overflow-y:auto;box-shadow:0 16px 48px rgba(0,0,0,.12);z-index:200}
    .nav-dropdown.open .mega-menu{display:block}
    /* "Ver más": el resto del grupo se despliega en el sitio, con scroll propio */
    .mega-rest{display:none;max-height:210px;overflow-y:auto;margin-top:3px;padding-top:4px;border-top:1px dashed var(--gray-100,#F3F4F6)}
    .mega-rest.open{display:block}
    /* Grilla de grupos (catálogo): 3 columnas, cada celda = 1 grupo con sus populares */
    .mega-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px 22px}
    .mega-group h6{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-400,#9CA3AF);margin:0 0 7px;padding:0 6px;display:flex;align-items:center;gap:6px}
    .mega-group a{display:block;padding:5px 8px;border-radius:8px;text-decoration:none;color:var(--gray-600,#4B5563);font-size:.81rem;font-weight:500;transition:all .15s;line-height:1.3}
    .mega-group a:hover{background:var(--green-50,#ECFDF5);color:var(--green-700,#047857)}
    .mega-mas{color:#059669!important;font-weight:700!important;font-size:.74rem!important;margin-top:1px}
    .mega-foot{display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--gray-100,#F3F4F6);margin-top:14px;padding-top:13px}
    .mega-foot a{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:10px;text-decoration:none;font-size:.8rem;font-weight:700;color:#374151;background:var(--gray-100,#F3F4F6);transition:background .15s}
    .mega-foot a:hover{background:var(--gray-200,#E5E7EB)}
    /* Compat: estilos viejos de .mega-col (por si alguna página aún los usa) */
    .mega-col h6{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--gray-400,#9CA3AF);margin-bottom:10px;padding:0 8px}
    .mega-col a{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;text-decoration:none;color:var(--gray-600,#4B5563);font-size:.8rem;font-weight:500;transition:all .15s;white-space:normal;line-height:1.3;overflow:hidden}
    .mega-col a:hover{background:var(--green-50,#ECFDF5);color:var(--green-700,#047857)}
    .mega-col a .dd-icon{width:28px;height:28px;border-radius:7px;display:grid;place-items:center;font-size:.8rem;flex-shrink:0}
    .mega-col .mega-divider{height:1px;background:var(--gray-100,#F3F4F6);margin:6px 10px}

    /* ===== TOOL NAV DROPDOWN CATEGORIES ===== */
    .tn-cat{position:relative}
    .tn-cat-btn{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:.82rem;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
    .tn-cat-btn:hover,.tn-cat.open .tn-cat-btn{background:#ECFDF5;border-color:#059669;color:#047857}
    .tn-cat-btn svg{width:12px;height:12px;transition:transform .2s}
    .tn-cat.open .tn-cat-btn svg{transform:rotate(180deg)}
    .tn-dd{display:none;position:absolute;top:calc(100% + 6px);left:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:6px;min-width:200px;max-width:calc(100vw - 20px);box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:200}
    .tn-cat:nth-last-child(-n+3) .tn-dd{left:auto;right:0}
    .tn-cat.open .tn-dd{display:block}
    .tn-dd a{display:block;padding:7px 12px;border-radius:6px;text-decoration:none;color:#4B5563;font-size:.82rem;font-weight:500;transition:all .12s;white-space:nowrap}
    .tn-dd a:hover{background:#ECFDF5;color:#047857}
    .tn-hamburger{display:none;background:none;border:none;font-size:1.3rem;cursor:pointer;padding:6px;color:#374151;flex-shrink:0}

    /* ===== TOOL NAV MOBILE ===== */
    @media(max-width:768px){
      .tn-hamburger{display:block}
      .ed-nav #navLinks{display:none;width:100%;padding-top:8px;border-top:1px solid #e2e8f0;margin-top:8px}
      .ed-nav #navLinks.open{display:flex;flex-wrap:wrap;gap:6px}
      .tn-dd{position:static;box-shadow:none;border:none;padding:2px 0 2px 8px;min-width:auto}
      .tn-cat.open .tn-dd{display:block}
    }

    /* ===== MOBILE MEGA ===== */
    @media(max-width:900px){
      .mega-menu{position:static;transform:none;min-width:auto;width:auto;box-shadow:none;border:none;padding:8px 0 8px 8px;margin-top:4px}
      .nav-dropdown.open .mega-menu{display:block}
      .mega-grid{grid-template-columns:1fr 1fr;gap:10px 14px}
      .mega-group{border-bottom:1px solid var(--gray-100,#F3F4F6);padding-bottom:8px}
      .mega-foot{flex-direction:column}
      .mega-col{border-bottom:1px solid var(--gray-100,#F3F4F6);padding-bottom:8px}
      .mega-col:last-child{border-bottom:none}
    }

    /* ===== IA BUTTON GLOW ===== */

    /* ===== SKIP LINK ===== */
    .skip-link{position:absolute;top:-100%;left:16px;background:#059669;color:#fff;padding:8px 16px;border-radius:0 0 8px 8px;font-size:.85rem;font-weight:600;z-index:9999;text-decoration:none;transition:top .2s}
    .skip-link:focus{top:0}

    /* ===== FOCUS VISIBLE ===== */
    *:focus-visible{outline:2px solid #10B981;outline-offset:2px;border-radius:4px}

    /* ===== LOADING OVERLAY ===== */
    .exo-loading{position:fixed;inset:0;background:rgba(255,255,255,.85);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9998;opacity:0;pointer-events:none;transition:opacity .2s}
    .exo-loading.active{opacity:1;pointer-events:auto}
    .exo-loading .spinner{width:40px;height:40px;border:4px solid #E5E7EB;border-top-color:#059669;border-radius:50%;animation:exoSpin .8s linear infinite}
    .exo-loading .spinner-text{margin-top:12px;font-size:.9rem;color:#374151;font-weight:500}
    @keyframes exoSpin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(megaCSS);

  /* ─── Skip link (accessibility) ─── */
  var skipLink='<a href="#main" class="skip-link">Ir al contenido</a>';

  /* ─── Tool nav (compact bar for tool pages) ─── */
  var chevron='<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>';
  var toolNav=skipLink+
  '<nav class="ed-nav" role="navigation" aria-label="Navegación de herramientas" style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;font-family:Outfit,DM Sans,sans-serif;flex-wrap:wrap">'+
  '  <a href="'+P+'index.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:#1a1a2e;font-weight:800;font-size:.95rem;flex-shrink:0">'+
  '    <div style="width:28px;height:28px;background:linear-gradient(135deg,#059669,#34D399);border-radius:7px;display:grid;place-items:center;color:#fff;font-size:.7rem;font-weight:900">E</div>'+
  '    ExógenaDIAN'+
  '  </a>'+
  '  <button class="tn-hamburger" aria-expanded="false" aria-label="Abrir menú" onclick="var nl=document.getElementById(\'navLinks\');nl.classList.toggle(\'open\');this.setAttribute(\'aria-expanded\',nl.classList.contains(\'open\'))">☰</button>'+
  '  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap" id="navLinks">'+
       /* Tributarias */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)">Tributarias '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'exogena-suite.html">📂 Kit Exógena</a>'+
  '        <a href="'+P+'renta-juridica.html">📑 Renta 110 / 2516</a>'+
  '        <a href="'+P+'renta-personas-naturales.html">📊 Renta PN F210</a>'+
  '        <a href="'+P+'regimen-simple.html">⚖️ Régimen Simple (RST)</a>'+
  '        <a href="'+P+'iva300.html">📋 IVA 300</a>'+
  '        <a href="'+P+'impuesto-consumo.html">🍽️ Impuesto al Consumo F310</a>'+
  '        <a href="'+P+'retencion350.html">🧮 Retención 350</a>'+
  '        <a href="'+P+'retencion-dividendos.html">💰 Retención Dividendos</a>'+
  '        <a href="'+P+'patrimonio420.html">🏛️ Impuesto al Patrimonio F420</a>'+
  '      </div>'+
  '    </div>'+
       /* Financieras */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)">Financieras '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'finanzas.html">💸 Finanzas Personales</a>'+
  '        <a href="'+P+'oficina.html">📋 Mi Oficina Contable</a>'+
  '        <a href="'+P+'tablero.html">🗂️ Tablero de Equipo</a>'+
  '        <a href="'+P+'eeff-hub.html"><strong>📄 Kit Estados Financieros</strong></a>'+
  '        <a href="'+P+'conciliacion.html">🏦 Conciliación</a>'+
  '        <a href="'+P+'credito.html">🏦 Simulador Crédito</a>'+
  '      </div>'+
  '    </div>'+
       /* Sanciones */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)">Sanciones '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'sanciones.html">⚖️ Sanciones Exógena</a>'+
  '        <a href="'+P+'sanciones-dian.html">⚖️ Sanciones DIAN</a>'+
  '        <a href="'+P+'intereses.html">% Intereses de Mora</a>'+
  '      </div>'+
  '    </div>'+
       /* Laboral */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)">Laboral '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'liquidador.html">👷 Liquidador Laboral</a>'+
  '        <a href="'+P+'costoreal.html">💰 Costo Empleado</a>'+
  '        <a href="'+P+'formato220.html">📄 Certificado F220</a>'+
  '        <a href="'+P+'retencion-fuente.html">💰 Retención por Salarios</a>'+
  '        <a href="'+P+'empleo.html">💼 Preparación Empleo</a>'+
  '      </div>'+
  '    </div>'+
       /* Consultas */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)">Consultas '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'consultanit.html">🔍 Consulta NIT DIAN</a>'+
  '        <a href="'+P+'certificados.html">📜 Certificados</a>'+
  '        <a href="'+P+'crear-sas.html">🏛️ Crear S.A.S. — Wizard</a>'+
  '        <a href="'+P+'vencimientos.html">📅 Calendario Tributario</a>'+
  '        <a href="'+P+'normograma.html">📚 Normograma Tributario</a>'+
  '        <a href="'+P+'uvt.html">🔢 Conversor UVT</a>'+
  '        <a href="'+P+'estatutos.html">🏛️ Estatutos Municipales</a>'+
  '      </div>'+
  '    </div>'+
       /* IA dropdown */
  '    <div class="tn-cat"><button class="tn-cat-btn" onclick="toggleTnCat(this)" style="background:linear-gradient(135deg,#059669,#10B981);color:#fff;border-color:transparent;font-weight:800;box-shadow:0 2px 10px rgba(5,150,105,.25)">✨ IA '+chevron+'</button>'+
  '      <div class="tn-dd">'+
  '        <a href="'+P+'ia-analisis-balance.html">🛡️ Auditor DIAN</a>'+
  '        <a href="'+P+'ia-chat-et.html">📖 Estatuto Tributario</a>'+
  '        <a href="'+P+'ia-respuesta-requerimiento.html">📝 Requerimientos</a>'+
  '        <a href="'+P+'prompts.html">💡 Librería de Prompts</a>'+
  '        <a href="'+P+'ia.html" style="font-weight:700;color:#059669">✨ Ver todas</a>'+
  '      </div>'+
  '    </div>'+
       /* Tutoriales link contextual */
  _tutorialBtnReducida+
       /* Escuela link */
  '    <a href="'+P+'escuela.html" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid #FFEDD5;border-radius:8px;background:#FFF7ED;font-size:.82rem;font-weight:600;color:#EA580C;text-decoration:none;transition:all .15s;white-space:nowrap" onmouseover="this.style.background=\'#FFEDD5\';this.style.borderColor=\'#F97316\'" onmouseout="this.style.background=\'#FFF7ED\';this.style.borderColor=\'#FFEDD5\'">📖 Escuela</a>'+
       /* Precios CTA */
  '    <a href="'+P+'precios.html" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:linear-gradient(135deg,#F59E0B,#EAB308);color:#fff;border-radius:8px;font-size:.82rem;font-weight:700;text-decoration:none;transition:all .2s;white-space:nowrap;box-shadow:0 2px 8px rgba(245,158,11,.3)" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(245,158,11,.45)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(245,158,11,.3)\'">💰 Precios</a>'+
  '  </div>'+
  '  <div style="display:flex;align-items:center;gap:6px;padding:5px 12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;font-size:.75rem;font-weight:600;color:#047857;flex-shrink:0;white-space:nowrap" title="Tu archivo se procesa 100% en tu navegador. Nunca se env\u00eda a ning\u00fan servidor.">'+
  '    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink:0"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/></svg>'+
  '    100% en tu equipo'+
  '  </div>'+
  '</nav>';

  /* AUTO-CATALOGO:START */
var MEGA_MENU_HTML='<div class="mega-grid"><div class="mega-group"><h6>📂 Exógena</h6><a href="exogena.html">Exógena desde balance</a><a href="exogena-desde-fe.html">Exógena desde FE</a><a href="exogena-suite.html">Kit Exógena</a><div class="mega-rest"><a href="exogenas-distritales.html">Exógenas distritales (ICA)</a><a href="prevalidador.html">Prevalidador</a></div><a class="mega-mas" href="#" onclick="var r=this.previousElementSibling,o=r.classList.toggle(\'open\');this.textContent=o?\'Ver menos ↑\':\'Ver las 5 →\';return false">Ver las 5 →</a></div><div class="mega-group"><h6>📑 Renta y declaraciones</h6><a href="auditor-cruces-dian.html">Auditor de Cruces DIAN</a><a href="formato2516.html">Conciliación Fiscal F2516</a><a href="regimen-simple.html">Régimen Simple (RST)</a><a href="renta-juridica.html">Renta F110</a><a href="renta-personas-naturales.html">Renta PN F210</a></div><div class="mega-group"><h6>📋 IVA y Retención</h6><a href="iva300.html">IVA 300</a><a href="retencion350.html">Retención 350</a><a href="retencion-compras.html">Calculadora retenciones en compras</a><div class="mega-rest"><a href="decreto240.html">Decreto 240 — Interés moratorio</a><a href="impuesto-consumo.html">Impuesto al Consumo F310</a><a href="patrimonio420.html">Impuesto al Patrimonio F420</a><a href="retencion-dividendos.html">Retención dividendos</a><a href="retencion-fuente.html">Retención por salarios</a></div><a class="mega-mas" href="#" onclick="var r=this.previousElementSibling,o=r.classList.toggle(\'open\');this.textContent=o?\'Ver menos ↑\':\'Ver las 8 →\';return false">Ver las 8 →</a></div><div class="mega-group"><h6>📊 Contabilidad y EEFF</h6><a href="conciliacion.html">Conciliación Bancaria</a><a href="contabilizar-fe.html">Contabilizar desde FE</a><a href="eeff-hub.html">Kit Estados Financieros</a></div><div class="mega-group"><h6>👷 Laboral y nómina</h6><a href="liquidador.html">Liquidador Laboral</a><a href="nomina-masiva.html">Nómina por Excel</a><a href="salario-neto.html">Salario Neto</a><a href="empleo.html">Preparación Empleo</a><div class="mega-rest"><a href="formato220.html">Certificado F220</a><a href="comparador-laboral-prestacion.html">Comparador laboral vs prestación de servicios</a><a href="costoreal.html">Costo Empleado</a></div><a class="mega-mas" href="#" onclick="var r=this.previousElementSibling,o=r.classList.toggle(\'open\');this.textContent=o?\'Ver menos ↑\':\'Ver las 7 →\';return false">Ver las 7 →</a></div><div class="mega-group"><h6>✨ IA Contable</h6><a href="ia-asistente.html">Asistente Contable IA</a><a href="ia-chat-et.html">Estatuto Tributario (chat)</a><a href="ia-respuesta-requerimiento.html">Responder requerimiento</a><a href="prompts.html">Librería de Prompts</a></div><div class="mega-group"><h6>🔍 Consultas y trámites</h6><a href="oficina.html">Mi Oficina Contable</a><a href="consultanit.html">Consulta NIT DIAN</a><a href="vencimientos.html">Calendario Tributario</a><a href="tablero.html">Tablero de Equipo</a><div class="mega-rest"><a href="consultamasiva.html">Consulta NIT masiva</a><a href="uvt.html">Conversor UVT</a><a href="crear-sas.html">Crear S.A.S. (wizard)</a><a href="estatutos.html">Estatutos Municipales</a></div><a class="mega-mas" href="#" onclick="var r=this.previousElementSibling,o=r.classList.toggle(\'open\');this.textContent=o?\'Ver menos ↑\':\'Ver las 8 →\';return false">Ver las 8 →</a></div><div class="mega-group"><h6>⚖️ Sanciones y mora</h6><a href="intereses.html">Intereses de mora</a><a href="sanciones-dian.html">Sanciones DIAN</a><a href="sanciones.html">Sanciones Exógena</a></div><div class="mega-group"><h6>📜 Documentos y certificados</h6><a href="certificados.html">Certificados (hub)</a><a href="contrato-laboral.html">Contratos (laboral y servicios)</a><a href="derecho-peticion.html">Derecho de petición</a><div class="mega-rest"><a href="acta-asamblea-eeff.html">Acta de asamblea</a><a href="contrato-prestacion-servicios.html">Contrato prestación de servicios</a><a href="informe-gestion.html">Informe de gestión</a><a href="proyecto-distribucion-utilidades.html">Proyecto distribución utilidades</a></div><a class="mega-mas" href="#" onclick="var r=this.previousElementSibling,o=r.classList.toggle(\'open\');this.textContent=o?\'Ver menos ↑\':\'Ver las 7 →\';return false">Ver las 7 →</a></div></div><div class="mega-foot"><a href="finanzas.html">💰 Finanzas personales</a><a href="empleo.html">💼 Empleo y Hoja de Vida</a><a href="escuela.html">🎓 Escuela</a><a href="sitemap.html">🗺️ Mapa completo</a></div>';
/* AUTO-CATALOGO:END */

  /* ─── Full nav (index.html, blog.html — mega-menu + PRO + hamburger) ─── */
  var fullNav=skipLink+
  '<nav id="nav" role="navigation" aria-label="Navegación principal">'+
  '  <a href="'+P+'index.html" class="logo">'+
  '    <div class="logo-mark">E</div>'+
  '    <div>ExógenaDIAN<small>Portal Contable \u00b7 IA</small></div>'+
  '  </a>'+
  '  <div class="nav-links" id="navLinks">'+
       /* Links directos de alto tráfico */
  '    <a href="'+P+'exogena-suite.html">Exógena</a>'+
  '    <a href="'+P+'renta-juridica.html">Renta F110</a>'+
  '    <a href="'+P+'renta-personas-naturales.html">Renta PN F210</a>'+
  '    <a href="'+P+'sitemap.html">🗺️ Mapa</a>'+
       /* Mega-menu dropdown */
  '    <div class="nav-dropdown" id="navDropdown">'+
  '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true" aria-label="Abrir menú de herramientas" onclick="var dd=document.getElementById(\'navDropdown\');dd.classList.toggle(\'open\');this.setAttribute(\'aria-expanded\',dd.classList.contains(\'open\'))">'+
  '        Herramientas <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>'+
  '      </button>'+
  '      <div class="mega-menu">'+MEGA_MENU_HTML+'</div>'+
  '    </div>'+
       /* IA CTA */
  '    <a href="'+P+'ia.html" class="nav-ia-cta" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:linear-gradient(135deg,#059669,#10B981);color:#fff;border-radius:12px;font-size:.88rem;font-weight:800;text-decoration:none;transition:all .2s;box-shadow:0 3px 12px rgba(5,150,105,.25);letter-spacing:.02em">✨ IA</a>'+
       /* Tutoriales CTA contextual */
  _tutorialBtnCompleta+
       /* Escuela CTA */
  '    <a href="'+P+'escuela.html" class="nav-escuela-cta" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:linear-gradient(135deg,#EA580C,#F97316);color:#fff;border-radius:12px;font-size:.88rem;font-weight:800;text-decoration:none;transition:all .2s;box-shadow:0 3px 12px rgba(234,88,12,.35);letter-spacing:.02em"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>Escuela</a>'+
       /* Precios CTA */
  '    <a href="'+P+'precios.html" class="nav-precios-cta" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:linear-gradient(135deg,#F59E0B,#EAB308);color:#fff;border-radius:12px;font-size:.88rem;font-weight:800;text-decoration:none;transition:all .2s;box-shadow:0 3px 12px rgba(245,158,11,.35);letter-spacing:.02em">💰 Precios</a>'+
       /* PRO Login */
  '    <div id="proNavLogin" class="nav-pro-login">'+
  '      <input type="email" id="proNavKey" placeholder="Email PRO">'+
  '      <button onclick="activarProNav()">Activar</button>'+
  '    </div>'+
  '    <div id="proNavActive" style="display:none;align-items:center;gap:8px;flex-shrink:0">'+
  '      <span style="background:#D1FAE5;color:#047857;padding:4px 12px;border-radius:20px;font-size:.78rem;font-weight:700">PRO</span>'+
  '      <a href="#" onclick="cerrarProNav();return false" style="font-size:.7rem;color:#9CA3AF;text-decoration:none">salir</a>'+
  '    </div>'+
  '  </div>'+
  '  <button class="hamburger" id="hamburger" aria-expanded="false" aria-label="Abrir menú" onclick="var nl=document.getElementById(\'navLinks\');nl.classList.toggle(\'open\');this.setAttribute(\'aria-expanded\',nl.classList.contains(\'open\'))">☰</button>'+
  '</nav>';

  /* ─── Inject ─── */
  var html=(variant==='full')?fullNav:toolNav;
  if(container){
    container.outerHTML=html;
  }else{
    document.body.insertAdjacentHTML('afterbegin',html);
  }

  /* ─── Path prefix fix: si estamos en subcarpeta (/escuela/, /blog/, etc),
        prepender ../ a hrefs relativos del nav para evitar 404s ─── */
  var pathSegs = location.pathname.split('/').filter(function(s){ return s; });
  var depth = Math.max(0, pathSegs.length - 1);
  if (depth > 0) {
    var prefix = new Array(depth + 1).join('../');
    var navAreas = document.querySelectorAll('header[role="banner"], nav, [data-nav-fix], #nav-banner, #nav-tool, #nav-container ~ *');
    // Más simple: barrer TODOS los <a> que vivan dentro de los primeros 1000 caracteres del body
    // y solo procesar los que aún tengan paths relativos sin prefijo.
    document.querySelectorAll('a[href]').forEach(function(a){
      // Solo procesar links del nav (los que estén ANTES del primer <main> o contenido principal)
      // Detección simple: el link debe ser hermano/descendiente de un nav o estar al inicio del body
      var inNav = false;
      var p = a.parentElement;
      while (p && p !== document.body) {
        if (p.tagName === 'NAV' || p.tagName === 'HEADER' || p.classList.contains('nav-tool') || p.id === 'nav-banner') { inNav = true; break; }
        p = p.parentElement;
      }
      if (!inNav) return;
      var href = a.getAttribute('href');
      if (!href) return;
      // Saltar absolutas, anchors, schemes especiales y rutas que ya tengan ../
      if (/^(https?:|\/\/|\/|#|mailto:|tel:|javascript:|\.\.?\/)/.test(href)) return;
      a.setAttribute('href', prefix + href);
    });
  }

  /* ─── Add body padding for fixed nav on tool pages ─── */
  if(variant==='full'&&page!=='index.html'&&page!=='blog.html'&&page!==''){
    document.body.style.paddingTop='64px';
  }

  /* ─── Tool nav dropdown toggle ─── */
  window.toggleTnCat=function(btn){
    var cat=btn.parentElement;
    var wasOpen=cat.classList.contains('open');
    // Close all other dropdowns
    document.querySelectorAll('.tn-cat.open').forEach(function(c){c.classList.remove('open')});
    if(!wasOpen)cat.classList.add('open');
  };
  // Close tool nav dropdowns on outside click
  document.addEventListener('click',function(e){
    if(!e.target.closest('.tn-cat')){
      document.querySelectorAll('.tn-cat.open').forEach(function(c){c.classList.remove('open')});
    }
  });
  // Close on Escape
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      document.querySelectorAll('.tn-cat.open').forEach(function(c){c.classList.remove('open')});
    }
  });

  /* ─── Highlight current page ─── */
  var links=document.querySelectorAll('#navLinks a[href]');
  links.forEach(function(a){
    var href=a.getAttribute('href');
    if(href===page||(page===''&&href==='index.html')){
      a.style.color='#059669';
      a.style.fontWeight='700';
    }
  });
  // Also highlight in mega-menu and tool nav dropdowns
  var ddLinks=document.querySelectorAll('.mega-col a[href], .tn-dd a[href]');
  ddLinks.forEach(function(a){
    if(a.getAttribute('href')===page){
      a.style.color='#059669';
      a.style.fontWeight='700';
      a.style.background='#ECFDF5';
      // Also highlight parent category button
      var cat=a.closest('.tn-cat');
      if(cat){var btn=cat.querySelector('.tn-cat-btn');if(btn){btn.style.borderColor='#059669';btn.style.color='#047857'}}
    }
  });

  /* ─── Event listeners (full nav only) ─── */
  if(variant==='full'){
    // Close dropdown on outside click
    document.addEventListener('click',function(e){
      var dd=document.getElementById('navDropdown');
      if(dd&&!dd.contains(e.target)){dd.classList.remove('open')}
    });
    // Close mobile menu on link click
    document.querySelectorAll('#navLinks a').forEach(function(a){
      a.addEventListener('click',function(){
        document.getElementById('navLinks').classList.remove('open');
      });
    });
    // Close on Escape key
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        var dd=document.getElementById('navDropdown');
        if(dd){dd.classList.remove('open');var btn=dd.querySelector('.nav-dropdown-toggle');if(btn){btn.setAttribute('aria-expanded','false');btn.focus()}}
        var nl=document.getElementById('navLinks');
        var hb=document.getElementById('hamburger');
        if(nl&&nl.classList.contains('open')){nl.classList.remove('open');if(hb){hb.setAttribute('aria-expanded','false');hb.focus()}}
      }
    });
    // Scroll effect
    window.addEventListener('scroll',function(){
      var nav=document.getElementById('nav');
      if(nav){nav.classList.toggle('scrolled',window.scrollY>20)}
    });
  }

  /* ─── PRO Nav Functions (uses shared/pro.js if available, standalone fallback) ─── */
  function showProActive(){
    var login=document.getElementById('proNavLogin');
    var active=document.getElementById('proNavActive');
    if(login)login.style.display='none';
    if(active)active.style.display='flex';
    if(typeof window.onProStatusChange==='function')window.onProStatusChange(true);
  }

  function showProLogin(){
    var login=document.getElementById('proNavLogin');
    var active=document.getElementById('proNavActive');
    var sub=document.getElementById('proNavSubscribe');
    if(login)login.style.display='flex';
    if(active)active.style.display='none';
    if(sub)sub.style.display='none';
    if(typeof window.onProStatusChange==='function')window.onProStatusChange(false);
  }

  function _navLoadingShow(msg){
    var ov=document.getElementById('exoNavLoading');
    if(!ov){
      ov=document.createElement('div');
      ov.id='exoNavLoading';
      ov.className='exo-loading';
      ov.innerHTML='<div class="spinner"></div><div class="spinner-text">'+(msg||'Verificando...')+'</div>';
      document.body.appendChild(ov);
    } else {
      var t=ov.querySelector('.spinner-text');if(t)t.textContent=msg||'Verificando...';
    }
    requestAnimationFrame(function(){ov.classList.add('active')});
  }
  function _navLoadingHide(){
    var ov=document.getElementById('exoNavLoading');
    if(ov)ov.classList.remove('active');
  }

  window.activarProNav=function(){
    var el=document.getElementById('proNavKey');
    if(!el)return;
    var key=el.value.trim().toLowerCase();
    if(!key){if(typeof exoToast!=='undefined')exoToast('Ingresa tu email PRO','warning');return}
    var btn=el.nextElementSibling;
    var btnText=btn?btn.textContent:'';
    if(btn){btn.textContent='Verificando...';btn.disabled=true}
    el.disabled=true;
    _navLoadingShow('Verificando suscripci\u00f3n...');
    var t0=Date.now();
    var done=function(){
      var el2=document.getElementById('exoNavLoading');
      var elapsed=Date.now()-t0;
      var wait=elapsed<700?700-elapsed:0;
      setTimeout(function(){
        _navLoadingHide();
        if(el)el.disabled=false;
        if(btn){btn.textContent=btnText;btn.disabled=false}
      },wait);
    };
    // Use shared module if available
    if(window.exoPro){
      window.exoPro.activate(key).then(function(valid){
        if(valid){showProActive()}
        else if(typeof exoToast!=='undefined'){exoToast('No se encontr\u00f3 suscripci\u00f3n activa para este email','warning')}
      }).catch(function(){if(typeof exoToast!=='undefined')exoToast('Error al verificar. Intenta de nuevo.','error')}).finally(done);
      return;
    }
    // Standalone fallback
    var url=APPS_SCRIPT_URL+'?action=validateEmail&email='+encodeURIComponent(key);
    fetch(url).then(function(r){return r.json()}).then(function(d){
      if(d.valid){
        localStorage.setItem('exogenadian_pro_email',key);
        showProActive();
      }else if(typeof exoToast!=='undefined'){
        exoToast(d.message||'No se encontr\u00f3 suscripci\u00f3n activa para este email','warning');
      }
    }).catch(function(){if(typeof exoToast!=='undefined')exoToast('Error al verificar. Intenta de nuevo.','error')}).finally(done);
  };

  window.cerrarProNav=function(){
    if(window.exoPro){
      window.exoPro.clearPro();
    } else {
      localStorage.removeItem('exogenadian_pro_email');
      localStorage.removeItem('exogenadian_pro_key');
    }
    showProLogin();
  };

  // Auto-restore PRO from localStorage (with server validation if pro.js loaded)
  var savedPro=localStorage.getItem('exogenadian_pro_email')||localStorage.getItem('exogenadian_pro_key');
  // Also check old keys for backward compat
  if(!savedPro){
    var oldKey=localStorage.getItem('proKey');
    if(oldKey){
      savedPro=oldKey;
      // Migrate
      if(oldKey.includes('@')){localStorage.setItem('exogenadian_pro_email',oldKey)}
      else{localStorage.setItem('exogenadian_pro_key',oldKey)}
      localStorage.removeItem('proKey');
      localStorage.removeItem('proName');
    }
  }
  if(savedPro){
    if(window.exoPro){
      window.exoPro.check().then(function(valid){
        if(valid){showProActive()}else{showProLogin()}
      });
    } else {
      showProActive();
    }
  }

  /* ─── Barra de compatibilidad (tool pages only) ─── */
  if(variant!=='full'){
    var SKIP_COMPAT=['ia.html','ia-asistente.html','ia-chat-et.html','ia-analisis-balance.html','ia-respuesta-requerimiento.html','ia-resumen-declaracion.html','404.html','terminos.html','politica-privacidad.html'];
    if(SKIP_COMPAT.indexOf(page)===-1){
      var compat=document.createElement('div');
      compat.style.cssText='padding:12px 20px;text-align:center;font-size:.78rem;color:#64748B;border-top:1px solid #e2e8f0;background:#f9fafb;font-family:Outfit,DM Sans,sans-serif';
      compat.innerHTML='Compatible con <strong>Siigo</strong> · <strong>World Office</strong> · <strong>Helisa</strong> · <strong>Alegra</strong> · <strong>MidaSoft</strong> · <strong>ZEUS</strong> · <strong>Contai</strong> · <strong>SAP</strong> &mdash; <a href="'+P+'precios.html" style="color:#059669;font-weight:600;text-decoration:none">Ver planes PRO &rarr;</a>';
      var mainEl=document.querySelector('main')||document.querySelector('#main');
      if(mainEl&&mainEl.nextSibling)mainEl.parentNode.insertBefore(compat,mainEl.nextSibling);
      else document.body.appendChild(compat);
    }
  }

  /* ─── Standard footer disclaimer (all pages without footer, after DOM ready) ─── */
  function _injectFooter(){
    if(document.querySelector('footer'))return;
    var stdFooter=document.createElement('footer');
    stdFooter.style.cssText='padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:.78rem;color:#6b7280;line-height:1.7;font-family:Outfit,sans-serif';
    stdFooter.innerHTML='<div style="max-width:720px;margin:0 auto"><strong style="color:#92400E">\u26A0\uFE0F Ex\u00F3genaDIAN es una herramienta de prediligenciamiento.</strong> Sus algoritmos pueden contener errores u omisiones. <strong>No reemplazan al contador p\u00FAblico.</strong> Verifica cada cifra antes de presentar a la DIAN.<br><span style="color:#9ca3af">Reportar errores o dudas: <a href="mailto:soporte@exogenadian.com" style="color:#059669;font-weight:600">soporte@exogenadian.com</a> \u00B7 <a href="https://wa.me/573054559574" style="color:#059669;font-weight:600">WhatsApp +57 305 455 9574</a></span><br><span style="color:#9ca3af">\u00A9 2026 Aziendale S.A.S. \u00B7 <a href="'+P+'terminos.html" style="color:#9ca3af">T\u00E9rminos</a> \u00B7 <a href="'+P+'politica-privacidad.html" style="color:#9ca3af">Privacidad</a></span></div>';
    document.body.appendChild(stdFooter);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_injectFooter)}
  else{_injectFooter()}

  /* ─── Site index: usado por breadcrumbs y buscador ─── */
  var SITE_INDEX={
    /* Tributarias */
    'renta-juridica.html':{title:'Renta Personas Jurídicas',cat:'Tributarias',tags:'F110 renta sociedades PJ declaración'},
    'renta110.html':{title:'Renta F110',cat:'Tributarias',tags:'F110 renta jurídica declaración'},
    'iva300.html':{title:'IVA F300',cat:'Tributarias',tags:'F300 IVA declaración bimestral cuatrimestral'},
    'impuesto-consumo.html':{title:'Impuesto al Consumo F310',cat:'Tributarias',tags:'F310 INC impuesto consumo restaurantes bares 8% telefonía móvil 4% bolsas plásticas vehículos Art 512-1 ET Art 512-2 ET'},
    'retencion350.html':{title:'Retención F350',cat:'Tributarias',tags:'F350 retención fuente retefuente reteiva reteica'},
    'formato2516.html':{title:'Conciliación Fiscal F2516',cat:'Tributarias',tags:'F2516 conciliación contable fiscal anexo'},
    'formato2593.html':{title:'Régimen Simple F2593',cat:'Tributarias',tags:'F2593 SIMPLE RST anual consolidado'},
    'calculadora-regimen.html':{title:'Comparador de regímenes',cat:'Tributarias',tags:'comparador SIMPLE ordinario tarifa decisión'},
    'formato220.html':{title:'Certificado F220',cat:'Tributarias',tags:'F220 certificado ingresos retenciones empleado salario'},
    'patrimonio420.html':{title:'Patrimonio F420',cat:'Tributarias',tags:'F420 impuesto patrimonio anual'},
    'renta260.html':{title:'Régimen Simple F260',cat:'Tributarias',tags:'F260 SIMPLE bimestral anticipo'},
    'regimen-simple.html':{title:'Régimen Simple',cat:'Tributarias',tags:'SIMPLE RST tarifa anticipo'},
    'renta-personas-naturales.html':{title:'Renta PN — Hub F210',cat:'Tributarias',tags:'F210 renta personas naturales hub liquidador clientes calendario vencimientos PRO'},
    'formato210-pro.html':{title:'Renta F210 — Modo Profesional',cat:'Tributarias',tags:'F210 renta natural cédula PRO multi-cédula exógena Excel asesor papel trabajo dividendos ganancias ocasionales'},
    /* Exógena */
    'exogena.html':{title:'Exógena desde balance',cat:'Exógena',tags:'1001 1003 1005 1006 1007 1008 1009 1010 1012 2276 medios magnéticos balance prueba'},
    'exogena-suite.html':{title:'Kit Exógena (suite)',cat:'Exógena',tags:'kit suite formatos 18 todos'},
    'exogena-desde-fe.html':{title:'Exógena desde reporte FE del MUISCA',cat:'Exógena',tags:'F1001 F1005 F1006 facturación electrónica RADIAN MUISCA documentos electrónicos sin balance pre-llenar'},
    'exogena-cce.html':{title:'CCE — Consorcios y UT',cat:'Exógena',tags:'5247 5248 5249 5250 5251 5252 consorcio unión temporal joint venture mandato'},
    'exogena-f1004.html':{title:'F1004 Descuentos',cat:'Exógena',tags:'1004 descuentos tributarios 8303 8334 GMF donaciones'},
    'exogena-f1011.html':{title:'F1011 Multi-bloque',cat:'Exógena',tags:'1011 PPYE rentas exentas costos especiales IVA exclusiones exentas tarifa 5%'},
    'exogena-f1647.html':{title:'F1647 Ingresos para terceros',cat:'Exógena',tags:'1647 ingresos terceros mandatario inmobiliaria'},
    'exogena-f2275.html':{title:'F2275 INCRNGO',cat:'Exógena',tags:'2275 INCRNGO ingresos no constitutivos renta ganancia ocasional'},
    'exogena-f5253.html':{title:'F5253 Beneficiarios efectivos',cat:'Exógena',tags:'5253 UBO beneficiarios efectivos finales'},
    'prevalidador.html':{title:'Prevalidador',cat:'Exógena',tags:'prevalidador validar XML errores'},
    /* Sanciones y cálculo */
    'sanciones.html':{title:'Sanciones Exógena Art. 651',cat:'Sanciones y cálculo',tags:'651 sanción exógena multa reducción'},
    'sanciones-dian.html':{title:'Sanciones DIAN',cat:'Sanciones y cálculo',tags:'sanción DIAN extemporánea corrección'},
    'intereses.html':{title:'Intereses de mora',cat:'Sanciones y cálculo',tags:'intereses mora 635 usura tributaria calculadora'},
    'retencion-fuente.html':{title:'Retención por salarios',cat:'Sanciones y cálculo',tags:'retención salarios procedimiento 1 2 dependientes Art 387'},
    'retencion-dividendos.html':{title:'Retención dividendos',cat:'Sanciones y cálculo',tags:'242 245 dividendos sociedades naturales 254-1'},
    'uvt.html':{title:'Conversor UVT',cat:'Sanciones y cálculo',tags:'UVT conversor pesos histórico tabla'},
    /* Auxiliares y consulta */
    'consultanit.html':{title:'Consulta de NIT',cat:'Auxiliares',tags:'NIT consulta DIAN razón social DV verificación'},
    'consultamasiva.html':{title:'Consulta NIT masiva',cat:'Auxiliares',tags:'NIT masiva múltiple bulk DV'},
    'eeff-hub.html':{title:'Kit Estados Financieros',cat:'Auxiliares',tags:'hub kit suite eeff estados financieros NIIF certificaciones acta dictamen distribucion utilidades informe gestion trend razones dashboard'},
    'certificado-representacion-admin.html':{title:'Carta de Representación de la Administración (NIA 580)',cat:'Certificados',tags:'NIA 580 representaciones administracion auditoria aseveraciones management letter'},
    'certificado-hechos-posteriores.html':{title:'Certificación de Hechos Posteriores al Cierre',cat:'Certificados',tags:'NIC 10 seccion 32 hechos posteriores eventos subsecuentes ajustan no ajustan'},
    'certificado-negocio-en-marcha.html':{title:'Certificación de Negocio en Marcha (Going Concern)',cat:'Certificados',tags:'NIC 1.25 seccion 3.8 going concern continuidad 12 meses banco proveedor licitacion incertidumbre'},
    'estadosfinancieros.html':{title:'Estados Financieros NIIF',cat:'Auxiliares',tags:'EEFF NIIF balance ESF ERI patrimonio flujo notas'},
    'trend-financiero.html':{title:'Trend Financiero',cat:'Auxiliares',tags:'trend tendencia mensual balance pyg evolucion sparkline'},
    'razones-financieras.html':{title:'Razones Financieras',cat:'Auxiliares',tags:'razones indicadores liquidez endeudamiento rentabilidad ROE ROA EBITDA actividad rotación cartera'},
    'analisis-vertical-horizontal.html':{title:'Análisis Vertical y Horizontal',cat:'Auxiliares',tags:'análisis vertical horizontal variaciones materiales comparativo año'},
    'dashboard.html':{title:'Panel Financiero',cat:'Auxiliares',tags:'dashboard indicadores ratios liquidez rentabilidad'},
    'conciliacion.html':{title:'Conciliación Bancaria',cat:'Auxiliares',tags:'conciliación bancaria extracto libro auxiliar'},
    'contabilizar-fe.html':{title:'Contabilizar desde FE del MUISCA',cat:'Auxiliares',tags:'contabilizar facturación electrónica MUISCA libro diario asientos plano contable Helisa World Office Siigo Loggro CSV PUC maestro terceros retefuente ReteIVA ReteICA'},
    /* 'mi-contabilidad.html' (antes micro.html) oculto hasta lanzamiento oficial */
    'vencimientos.html':{title:'Calendario Tributario',cat:'Auxiliares',tags:'calendario vencimientos plazos DIAN renta IVA retención'},
    'estatutos.html':{title:'Estatutos Municipales',cat:'Auxiliares',tags:'ICA municipios estatutos tarifa'},
    'normograma.html':{title:'Normograma Tributario',cat:'Auxiliares',tags:'normograma normas leyes decretos resoluciones conceptos sentencias vigencia DIAN'},
    'costoreal.html':{title:'Costo Empleado',cat:'Auxiliares',tags:'costo empleado real laboral nómina prestaciones'},
    'liquidador.html':{title:'Liquidador Laboral — Hub',cat:'Auxiliares',tags:'liquidación laboral hub calculadoras documentos cursos nómina'},
    'liquidador-domestica.html':{title:'Liquidación empleada doméstica',cat:'Auxiliares',tags:'liquidación empleada doméstica servicio doméstico por días jornal Ley 1788 2016 Sentencia C-871 2014 Decreto 824 prima cesantías vacaciones indemnización'},
    'liquidador-general.html':{title:'Liquidación laboral general',cat:'Auxiliares',tags:'liquidación contrato trabajo general cesantías intereses prima vacaciones indemnización Art 64 CST Ley 50 1990 Ley 789 2002 renuncia despido sin justa causa'},
    'liquidador-horas.html':{title:'Horas extras y recargos',cat:'Auxiliares',tags:'horas extras recargo nocturno dominical festivo 25 35 75 100 150 Art 168 179 CST Ley 50 1990 jornada Ley 2101 2021'},
    'liquidador-prestaciones.html':{title:'Cesantías, prima y vacaciones por separado',cat:'Auxiliares',tags:'calculadora cesantías intereses prima vacaciones por separado SBL salario base liquidación Art 249 306 186 CST Ley 52 1975'},
    'liquidador-pension.html':{title:'Liquidador de pensión Colombia',cat:'Auxiliares',tags:'calcular pensión Colpensiones RPM Ley 797 2003 IBL tasa reemplazo Reforma Pensional 2381 2024 sistema pilares RAIS vejez semanas cotizadas'},
    'comparador-laboral-prestacion.html':{title:'Comparador laboral vs prestación de servicios',cat:'Auxiliares',tags:'comparador contrato laboral prestación servicios costo empleador honorarios IBC 40 retefuente Art 383 ET exoneración 114-1'},
    'tasas-equivalentes.html':{title:'Convertidor de tasas equivalentes',cat:'Financieras',tags:'convertidor tasas equivalentes EA NMV NMA EM efectiva nominal vencida anticipada interés financiero'},
    'retencion-compras.html':{title:'Calculadora retenciones en compras',cat:'Auxiliares',tags:'calculadora retención compras renta IVA ICA autorretención Art 437-1 ET reteIVA 15 reteICA Decreto 1123 2024 CIIU'},
    'sitemap.html':{title:'Mapa del sitio — todas las herramientas',cat:'Auxiliares',tags:'mapa sitio sitemap directorio todas las herramientas catálogo navegación filtros gratis PRO IA cursos'},
    'nomina-masiva.html':{title:'Liquidador de nómina por Excel',cat:'Auxiliares',tags:'nómina masiva mensual cierre liquidación varios empleados Excel desprendibles IBC retefuente parafiscales aportes empresa Art 114-1 ET Ley 1393 2010 horas extras recargos Concepto DIAN 956 2024'},
    'credito.html':{title:'Simulador Crédito',cat:'Auxiliares',tags:'crédito simulador cuota interés amortización'},
    'certificado.html':{title:'Certificaciones Contables',cat:'Auxiliares',tags:'certificación laboral aportes ingresos PN'},
    'certificados.html':{title:'Certificados',cat:'Auxiliares',tags:'certificación laboral aportes ingresos PN informe gestión acta asamblea distribución utilidades socios Art 49 derecho petición modelo'},
    'empleo.html':{title:'Preparación para el Empleo',cat:'Auxiliares',tags:'empleo hoja de vida CV curriculum entrevista trabajo preparacion ATS plantillas cursos'},
    'hoja-de-vida.html':{title:'Constructor de Hoja de Vida (CV)',cat:'Auxiliares',tags:'hoja de vida CV curriculum vitae plantillas ATS moderna minimalista cronologica PDF Word foto chequeo ATS vista previa'},
    'entrevista.html':{title:'Guía de Entrevista de Trabajo',cat:'Auxiliares',tags:'entrevista trabajo preguntas respuestas metodo STAR negociacion salarial banderas rojas contador'},
    'derecho-peticion.html':{title:'Derecho de Petición',cat:'Auxiliares',tags:'derecho petición Colombia Ley 1755 2015 Art 23 EPS pensión Colpensiones servicios públicos laboral Mintrabajo modelo formato información copias'},
    'informe-gestion.html':{title:'Informe de Gestión',cat:'Auxiliares',tags:'informe gestión Ley 222 1995 articulo 47 propiedad intelectual Ley 603 facturas Ley 1676 representante legal asamblea'},
    'certificado-socios-art49.html':{title:'Certificado a socios Art. 49 ET',cat:'Auxiliares',tags:'dividendos gravado no gravado articulo 49 ET socio accionista retención'},
    'proyecto-distribucion-utilidades.html':{title:'Proyecto distribución utilidades',cat:'Auxiliares',tags:'distribución utilidades reserva legal articulo 452 código comercio dividendos socios'},
    'acta-asamblea-eeff.html':{title:'Acta asamblea ordinaria',cat:'Auxiliares',tags:'acta asamblea ordinaria aprobación EEFF dictamen revisor fiscal informe gestión distribución utilidades'},
    'verificar-certificado.html':{title:'Verificar certificado',cat:'Auxiliares',tags:'verificar certificado validar autenticidad'},
    'oficina.html':{title:'Mi Oficina Contable',cat:'Auxiliares',tags:'oficina clientes panel contadores gestión'},
    'tablero.html':{title:'Tablero de Equipo',cat:'Auxiliares',tags:'tablero equipo tareas pendientes asignar responsable calendario proyectos colaborar kanban'},
    /* Finanzas Personales */
    'finanzas.html':{title:'Finanzas Personales — Diagnóstico',cat:'Financieras',tags:'finanzas personales diagnóstico semáforo presupuesto ahorro deudas'},
    'salario-neto.html':{title:'Salario neto Colombia',cat:'Financieras',tags:'salario neto bruto retención salud pensión integral AFC voluntaria'},
    'pyg-personal.html':{title:'PyG personal',cat:'Financieras',tags:'PyG personal estado resultados presupuesto 50/30/20 mensual ingresos gastos'},
    'auditor-deudas.html':{title:'Auditor de deudas',cat:'Financieras',tags:'auditor deudas tasa promedio ponderada intereses tarjetas usura ratio cuota ingreso'},
    'salir-de-deudas.html':{title:'Plan salida de deudas',cat:'Financieras',tags:'salir deudas avalancha bola de nieve plan amortización abono extra'},
    'fondo-emergencia.html':{title:'Fondo de emergencia y desempleo',cat:'Financieras',tags:'fondo emergencia desempleo imprevistos ahorro meses reserva'},
    'puedo-comprar-carro.html':{title:'¿Puedo comprar carro?',cat:'Financieras',tags:'comprar carro 20/4/10 TCO costo total propiedad SOAT impuesto vehicular depreciación'},
    'capacidad-hipotecaria.html':{title:'Capacidad hipotecaria',cat:'Financieras',tags:'capacidad hipotecaria vivienda VIS no VIS Decreto 583 cuota 40% UVR'},
    'costo-oportunidad.html':{title:'Costo de oportunidad',cat:'Financieras',tags:'costo oportunidad inversión retefuente CDT FIC posponer lujos'},
    'compounding.html':{title:'Interés compuesto',cat:'Financieras',tags:'interés compuesto inversión ahorro mensual proyección inflación retefuente'},
    'escuela/finanzas.html':{title:'Escuela de Finanzas Personales',cat:'Financieras',tags:'escuela finanzas personales lecciones presupuesto deuda vivienda carro'},
    /* Aprende e IA */
    'escuela.html':{title:'Escuela Contable',cat:'Aprende',tags:'escuela cursos formación gratis exógena renta IVA retención'},
    'blog.html':{title:'Blog',cat:'Aprende',tags:'blog artículos novedades reforma tributaria'},
    'tutoriales.html':{title:'Tutoriales — Cómo usar el sitio',cat:'Aprende',tags:'tutoriales paso a paso guía manual cómo usar capturas operativo'},
    'tutoriales/exogena.html':{title:'Tutorial: generar exógena',cat:'Aprende',tags:'tutorial exógena DIAN paso a paso balance prueba 10 formatos prevalidador'},
    'tutoriales/f110.html':{title:'Tutorial: armar F110',cat:'Aprende',tags:'tutorial F110 renta jurídica paso a paso 63 reglas no deducibles cruce DIAN'},
    'tutoriales/f300.html':{title:'Tutorial: armar F300',cat:'Aprende',tags:'tutorial F300 IVA paso a paso prorrateo casillas bimestral'},
    'tutoriales/f310.html':{title:'Tutorial: armar F310 INC',cat:'Aprende',tags:'tutorial F310 INC impuesto consumo restaurantes bares telefonia paso a paso balance listado MUISCA tarifa 8% 4%'},
    'tutoriales/f350.html':{title:'Tutorial: armar F350',cat:'Aprende',tags:'tutorial F350 retención fuente paso a paso 2365 conceptos terceros'},
    'tutoriales/conciliacion.html':{title:'Tutorial: conciliación bancaria',cat:'Aprende',tags:'tutorial conciliación bancaria paso a paso extracto auxiliar tolerancia'},
    'tutoriales/f2516.html':{title:'Tutorial: armar F2516',cat:'Aprende',tags:'tutorial F2516 conciliación fiscal NIIF paso a paso 7 hojas prevalidador'},
    'tutoriales/f210.html':{title:'Tutorial: armar F210',cat:'Aprende',tags:'tutorial F210 renta personas naturales cédula general trabajo honorarios capital pensiones dividendos GO anticipo paso a paso'},
    'ia.html':{title:'Hub IA',cat:'IA',tags:'IA hub inteligencia artificial herramientas'},
    'ia-asistente.html':{title:'Asistente Contable IA',cat:'IA',tags:'IA asistente contable ayuda preguntas'},
    'ia-chat-et.html':{title:'Chat con el Estatuto Tributario',cat:'IA',tags:'IA ET estatuto tributario chat artículos'},
    'ia-respuesta-requerimiento.html':{title:'Responder requerimiento',cat:'IA',tags:'IA requerimiento DIAN respuesta defensa'},
    /* Comercial */
    'precios.html':{title:'Precios PRO',cat:'Comercial',tags:'precios PRO suscripción Wompi pago'},
    'gracias.html':{title:'Gracias por suscribirte',cat:'Comercial',tags:'gracias suscripción confirmación'},
    'terminos.html':{title:'Términos y condiciones',cat:'Comercial',tags:'términos condiciones legal'},
    'politica-privacidad.html':{title:'Política de privacidad',cat:'Comercial',tags:'privacidad datos personales habeas data'}
  };

  function _injectBreadcrumb(){
    if(page==='index.html'||page===''||page==='404.html')return;
    if(location.pathname.indexOf('/escuela/')>=0)return;
    if(document.querySelector('.exo-breadcrumb'))return;
    var info=SITE_INDEX[page];
    if(!info)return;
    var bcCSS=document.createElement('style');
    bcCSS.textContent=`
      .exo-breadcrumb{font-family:'Outfit',sans-serif;font-size:.82rem;color:#6B7280;padding:10px 24px;background:#FAFAF9;border-bottom:1px solid #E7E5E4;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .exo-breadcrumb a{color:#6B7280;text-decoration:none;transition:color .15s}
      .exo-breadcrumb a:hover{color:#059669}
      .exo-breadcrumb .bc-sep{color:#D6D3D1;font-size:.85rem}
      .exo-breadcrumb .bc-current{color:#1C1917;font-weight:600}
      @media(max-width:600px){.exo-breadcrumb{font-size:.74rem;padding:8px 14px;gap:6px}}
    `;
    document.head.appendChild(bcCSS);
    var bc=document.createElement('nav');
    bc.className='exo-breadcrumb';
    bc.setAttribute('aria-label','Migas de pan');
    bc.innerHTML='<a href="'+P+'index.html">Inicio</a><span class="bc-sep">›</span><span>'+info.cat+'</span><span class="bc-sep">›</span><span class="bc-current">'+info.title+'</span>';
    var navEl=document.getElementById('nav')||document.querySelector('nav#nav');
    if(navEl&&navEl.parentNode){navEl.parentNode.insertBefore(bc,navEl.nextSibling)}
    else{document.body.insertAdjacentElement('afterbegin',bc)}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_injectBreadcrumb)}
  else{_injectBreadcrumb()}

  /* ─── Buscador global (Ctrl+K / / para abrir) ─── */
  function _injectSearch(){
    if(document.getElementById('exoSearchModal'))return;
    var sCSS=document.createElement('style');
    sCSS.textContent=`
      .exo-search-trigger{display:inline-flex;align-items:center;gap:6px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;padding:6px 12px 6px 10px;font-family:'Outfit',sans-serif;font-size:.82rem;color:#6B7280;cursor:pointer;transition:all .15s;flex-shrink:0;height:34px}
      .exo-search-trigger:hover{background:#fff;border-color:#10B981;color:#111827}
      .exo-search-trigger svg{width:14px;height:14px;flex-shrink:0}
      .exo-search-trigger kbd{background:#fff;border:1px solid #E5E7EB;border-radius:4px;padding:1px 6px;font-size:.7rem;color:#9CA3AF;font-family:'JetBrains Mono',monospace;margin-left:4px}
      @media(max-width:1080px){.exo-search-trigger span.label,.exo-search-trigger kbd{display:none}.exo-search-trigger{padding:6px 10px;height:34px}}
      .exo-search-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);z-index:1000;display:none;align-items:flex-start;justify-content:center;padding:60px 20px 20px}
      .exo-search-overlay.open{display:flex}
      .exo-search-modal{background:#fff;width:100%;max-width:560px;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden;font-family:'Outfit',sans-serif;animation:exoSearchIn .15s ease-out}
      @keyframes exoSearchIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      .exo-search-input-wrap{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #E5E7EB}
      .exo-search-input-wrap svg{width:18px;height:18px;color:#9CA3AF;flex-shrink:0}
      .exo-search-input-wrap input{flex:1;border:none;outline:none;font-size:1rem;font-family:inherit;color:#111827;background:transparent}
      .exo-search-input-wrap input::placeholder{color:#9CA3AF}
      .exo-search-close{background:none;border:none;color:#9CA3AF;font-size:.78rem;cursor:pointer;padding:4px 8px;border-radius:4px;font-family:inherit}
      .exo-search-close:hover{background:#F3F4F6;color:#374151}
      .exo-search-results{max-height:400px;overflow-y:auto;padding:6px 0}
      .exo-search-result{display:flex;align-items:center;gap:10px;padding:10px 18px;text-decoration:none;color:inherit;cursor:pointer;border-left:3px solid transparent;transition:background .1s}
      .exo-search-result:hover,.exo-search-result.active{background:#F0FDF4;border-left-color:#10B981}
      .exo-search-result-info{flex:1;min-width:0}
      .exo-search-result-title{font-size:.92rem;font-weight:600;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .exo-search-result-cat{font-size:.74rem;color:#6B7280;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
      .exo-search-empty{padding:30px 18px;text-align:center;color:#9CA3AF;font-size:.88rem}
      .exo-search-footer{padding:8px 18px;background:#FAFAF9;border-top:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;font-size:.72rem;color:#9CA3AF;gap:12px;flex-wrap:wrap}
      .exo-search-footer kbd{background:#fff;border:1px solid #D6D3D1;border-radius:3px;padding:1px 5px;font-size:.66rem;font-family:'JetBrains Mono',monospace;color:#6B7280}
      @media(max-width:600px){.exo-search-overlay{padding:0}.exo-search-modal{max-width:100%;height:100%;border-radius:0;display:flex;flex-direction:column}.exo-search-results{flex:1;max-height:none}}
    `;
    document.head.appendChild(sCSS);

    function _placeTrigger(){
      var navLinks=document.getElementById('navLinks');
      var navEl=document.getElementById('nav');
      if(document.getElementById('exoSearchTrigger'))return;
      var btn=document.createElement('button');
      btn.id='exoSearchTrigger';
      btn.className='exo-search-trigger';
      btn.setAttribute('aria-label','Buscar herramientas');
      btn.innerHTML='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="6"/><path d="m13.5 13.5 4 4"/></svg><span class="label">Buscar</span>';
      btn.onclick=function(){_openSearch()};
      if(navLinks){
        var firstCta=navLinks.querySelector('.nav-ia-cta')||navLinks.querySelector('.nav-tutoriales-cta')||navLinks.querySelector('.nav-escuela-cta');
        if(firstCta){navLinks.insertBefore(btn,firstCta)}else{navLinks.insertBefore(btn,navLinks.firstChild)}
      }else if(navEl){
        navEl.insertBefore(btn,navEl.querySelector('.hamburger')||null);
      }
    }

    var modal=document.createElement('div');
    modal.className='exo-search-overlay';
    modal.id='exoSearchModal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-label','Buscador');
    modal.innerHTML=
      '<div class="exo-search-modal" role="document">'+
        '<div class="exo-search-input-wrap">'+
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="6"/><path d="m13.5 13.5 4 4"/></svg>'+
          '<input id="exoSearchInput" type="search" placeholder="Buscar herramienta, formato, calculadora..." autocomplete="off">'+
          '<button class="exo-search-close" aria-label="Cerrar">Esc</button>'+
        '</div>'+
        '<div class="exo-search-results" id="exoSearchResults" role="listbox"></div>'+
        '<div class="exo-search-footer">'+
          '<span><kbd>↑</kbd> <kbd>↓</kbd> navegar &middot; <kbd>Enter</kbd> abrir</span>'+
          '<span>56+ herramientas</span>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);

    var input=modal.querySelector('#exoSearchInput');
    var resultsEl=modal.querySelector('#exoSearchResults');
    var closeBtn=modal.querySelector('.exo-search-close');
    var activeIdx=0;

    function _render(filtered){
      activeIdx=0;
      if(!filtered.length){
        resultsEl.innerHTML='<div class="exo-search-empty">Sin resultados. Prueba con &ldquo;ex&oacute;gena&rdquo;, &ldquo;sanci&oacute;n&rdquo;, &ldquo;UVT&rdquo;...</div>';
        return;
      }
      resultsEl.innerHTML=filtered.slice(0,8).map(function(r,i){
        return '<a class="exo-search-result'+(i===0?' active':'')+'" href="'+r.url+'" data-idx="'+i+'" role="option">'+
          '<div class="exo-search-result-info">'+
            '<div class="exo-search-result-title">'+r.title+'</div>'+
            '<div class="exo-search-result-cat">'+r.cat+'</div>'+
          '</div>'+
          '<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M5 10h10m0 0-4-4m4 4-4 4"/></svg>'+
        '</a>';
      }).join('');
    }

    function _filter(q){
      q=(q||'').toLowerCase().trim();
      var arr=[];
      for(var k in SITE_INDEX){
        var v=SITE_INDEX[k];
        if(!q){arr.push({url:k,title:v.title,cat:v.cat,score:0});continue}
        var hay=(v.title+' '+v.cat+' '+(v.tags||'')+' '+k).toLowerCase();
        var idx=hay.indexOf(q);
        if(idx<0)continue;
        var titleMatch=v.title.toLowerCase().indexOf(q)>=0?100:0;
        var catMatch=v.cat.toLowerCase().indexOf(q)>=0?20:0;
        arr.push({url:k,title:v.title,cat:v.cat,score:titleMatch+catMatch-idx});
      }
      arr.sort(function(a,b){return b.score-a.score});
      return arr;
    }

    function _setActive(idx){
      var items=resultsEl.querySelectorAll('.exo-search-result');
      if(!items.length)return;
      items.forEach(function(el){el.classList.remove('active')});
      activeIdx=Math.max(0,Math.min(idx,items.length-1));
      items[activeIdx].classList.add('active');
      items[activeIdx].scrollIntoView({block:'nearest'});
    }

    input.addEventListener('input',function(){_render(_filter(input.value))});

    input.addEventListener('keydown',function(e){
      var items=resultsEl.querySelectorAll('.exo-search-result');
      if(e.key==='ArrowDown'){e.preventDefault();_setActive(activeIdx+1)}
      else if(e.key==='ArrowUp'){e.preventDefault();_setActive(activeIdx-1)}
      else if(e.key==='Enter'){
        e.preventDefault();
        if(items[activeIdx])window.location.href=items[activeIdx].href;
      }else if(e.key==='Escape'){_closeSearch()}
    });

    modal.addEventListener('click',function(e){
      if(e.target===modal)_closeSearch();
    });
    closeBtn.addEventListener('click',_closeSearch);

    document.addEventListener('keydown',function(e){
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
        e.preventDefault();_openSearch();
      }else if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){
        e.preventDefault();_openSearch();
      }else if(e.key==='Escape'&&modal.classList.contains('open')){_closeSearch()}
    });

    function _openSearch(){
      modal.classList.add('open');
      _render(_filter(''));
      setTimeout(function(){input.focus();input.select()},50);
    }
    function _closeSearch(){
      modal.classList.remove('open');
      input.value='';
    }
    window._exoOpenSearch=_openSearch;

    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(document.getElementById('navLinks')||document.getElementById('nav')||tries>20){
        clearInterval(iv);
        _placeTrigger();
      }
    },150);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_injectSearch)}
  else{_injectSearch()}

  /* ═══ Frase ecard — carga diferida del script global ═══ */
  (function(){
    if(window.exoFrase||window.__exoFraseLoading)return;
    window.__exoFraseLoading=true;
    var ns=document.querySelector('script[src*="nav.js"]');
    var base=ns?ns.getAttribute('src').replace(/nav\.js.*$/,''):'shared/';
    var s=document.createElement('script');
    s.src=base+'frase-ecard.js';
    s.async=true;
    document.head.appendChild(s);
  })();

  /* ═══ Auto-tracking de uso (GA4) ═══
     Captura por delegación clicks en botones de descarga/generación en TODAS las
     herramientas, sin tener que instrumentar cada una. Emite eventos consistentes:
       tool_descarga {tool, formato, label}  — Excel/Word/PDF/HTML/CSV
       tool_generar  {tool, label}           — generar/calcular/procesar/liquidar
     Convive con los gtag('event',...) manuales que ya existen en algunas tools
     (nombres distintos, no se duplican). Permite comparar uso entre herramientas
     y saber qué formato de descarga prefieren los usuarios. */
  (function(){
    if(window.__exoAutoTrack)return; window.__exoAutoTrack=true;
    function toolName(){
      var p=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'');
      return p||'index';
    }
    function detectFormat(t){
      if(/excel|xlsx|\.xls/.test(t))return 'excel';
      if(/word|\.docx|\.doc/.test(t))return 'word';
      if(/pdf|imprimir/.test(t))return 'pdf';
      if(/\bhtml\b|dashboard html/.test(t))return 'html';
      if(/\bcsv\b/.test(t))return 'csv';
      return '';
    }
    document.addEventListener('click',function(e){
      try{
        var el=e.target&&e.target.closest&&e.target.closest('button,a');
        if(!el)return;
        var txt=(el.textContent||'').trim().toLowerCase();
        if(!txt||txt.length>60)return;
        var esDescarga=/descarg|exportar|imprimir|\.pdf|\.xlsx|\.docx|generar word|generar excel/.test(txt);
        var esGenerar=/generar|calcular|procesar|liquidar|construir/.test(txt);
        if(!esDescarga&&!esGenerar)return;
        if(typeof gtag!=='function')return;
        if(esDescarga){
          gtag('event','tool_descarga',{tool:toolName(),formato:detectFormat(txt)||'na',label:txt.slice(0,40)});
        } else {
          gtag('event','tool_generar',{tool:toolName(),label:txt.slice(0,40)});
        }
      }catch(err){}
    },true);
  })();

})();
