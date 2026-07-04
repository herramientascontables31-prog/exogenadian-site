/* ═══ Aziendale — Temporada Renta PN 2026 (promo contextual) ═══
   Tarjeta descartable que dirige desde las herramientas más usadas
   hacia el liquidador Renta 210 PN y el plan PRO de temporada.

   Uso:  <script defer src="shared/renta-season.js"></script>
   - Copy contextual según la página (ver MENSAJES).
   - Mini-consulta de vencimiento por 2 últimos dígitos
     (carga shared/vencimientos-pn.js bajo demanda).
   - Se oculta sola al terminar la temporada (26-oct-2026) y si el
     usuario la descarta (localStorage).
*/
(function(){
  'use strict';
  var LS_KEY = 'exo_renta_season_2026_tools_dismissed';
  var SEASON_END = new Date('2026-10-26T23:59:59');

  var hoy = new Date();
  if (hoy > SEASON_END) return;                       // temporada terminada
  try { if (localStorage.getItem(LS_KEY)) return; } catch(e){}

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (page === 'renta-personas-naturales.html' || page.indexOf('formato210') === 0) return;

  var MENSAJES = {
    'exogena.html': 'Esta misma exógena es el insumo de la renta de tus clientes persona natural: súbela al liquidador y el <strong>formulario 210 sale prediligenciado</strong>.',
    'renta110.html': '¿También declaras personas naturales? El <strong>210 se prediligencia desde la exógena del cliente</strong>, igual que este 110 desde el balance.',
    'consultanit.html': '¿Ese NIT es persona natural? Mira cuándo le vence la renta y <strong>prepárale el 210 desde su exógena</strong>.',
    'vencimientos.html': 'Renta PN AG 2025: cuota única del <strong>12 de agosto al 26 de octubre</strong>, por los 2 últimos dígitos. El 210 se prediligencia desde la exógena del cliente.',
    'estadosfinancieros.html': 'Cerraste los EEFF — ahora viene la renta. Para tus clientes persona natural, el <strong>210 se prediligencia desde su exógena</strong>.',
    'iva300.html': 'Entre IVA e IVA llega la temporada grande: renta PN del 12 de agosto al 26 de octubre. <strong>El 210 sale prediligenciado desde la exógena</strong>.',
    'retencion350.html': 'La 350 es mensual, pero la temporada grande ya tiene fecha: renta PN desde el 12 de agosto. <strong>El 210 sale prediligenciado desde la exógena</strong>.',
    'sanciones.html': 'La mejor sanción es la que no se causa: la renta PN vence del <strong>12 de agosto al 26 de octubre</strong>. Prepara cada 210 con tiempo.',
    'conciliacion.html': 'Bancos conciliados, ¿renta lista? Para tus clientes persona natural el <strong>210 se prediligencia desde su exógena</strong>.',
    'dashboard.html': 'Se viene la temporada de renta de personas naturales: el <strong>210 se prediligencia desde la exógena de cada cliente</strong>.'
  };
  var msg = MENSAJES[page] || 'Se viene la temporada de renta de personas naturales: el <strong>210 se prediligencia desde la exógena de tu cliente</strong>.';

  var css = document.createElement('style');
  css.textContent =
    '.exo-season{position:relative;max-width:1100px;margin:36px auto 28px;padding:22px 24px;background:linear-gradient(150deg,#fff 0%,#ECFDF5 100%);border:1.5px solid #6EE7B7;border-radius:18px;box-shadow:0 10px 34px rgba(5,150,105,.10);font-family:"Outfit",sans-serif}' +
    '.exo-season-tag{display:inline-flex;align-items:center;gap:7px;font-size:.7rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#047857;background:#D1FAE5;padding:4px 12px;border-radius:100px;margin-bottom:10px}' +
    '.exo-season-tag .dotp{width:7px;height:7px;border-radius:50%;background:#10B981;animation:exoSeasonPulse 2s infinite}' +
    '@keyframes exoSeasonPulse{0%,100%{opacity:1}50%{opacity:.35}}' +
    '.exo-season-grid{display:flex;gap:22px;align-items:center;flex-wrap:wrap}' +
    '.exo-season-txt{flex:1;min-width:250px}' +
    '.exo-season-txt p{margin:0;font-size:.95rem;color:#374151;line-height:1.6}' +
    '.exo-season-txt p strong{color:#065F46}' +
    '.exo-season-venc{display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid #A7F3D0;border-radius:14px;padding:10px 14px}' +
    '.exo-season-venc input{width:64px;text-align:center;font-family:"Outfit",monospace;font-size:1.35rem;font-weight:800;color:#064E3B;border:2px solid #A7F3D0;border-radius:10px;padding:6px 4px;letter-spacing:.08em}' +
    '.exo-season-venc input:focus{outline:none;border-color:#059669}' +
    '.exo-season-venc input::placeholder{color:#6EE7B7}' +
    '.exo-season-venc-out{font-size:.78rem;color:#6B7280;line-height:1.45;min-width:150px;max-width:200px}' +
    '.exo-season-venc-out strong{display:block;color:#111827;font-size:.85rem}' +
    '.exo-season-ctas{display:flex;flex-direction:column;gap:8px}' +
    '.exo-season-cta{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 22px;border-radius:11px;font-weight:700;font-size:.88rem;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .2s}' +
    '.exo-season-cta.main{background:linear-gradient(135deg,#047857,#059669);color:#fff;box-shadow:0 4px 14px rgba(5,150,105,.28)}' +
    '.exo-season-cta.main:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(5,150,105,.38)}' +
    '.exo-season-cta.pro{background:#fff;color:#047857;border:1.5px solid #6EE7B7;font-size:.8rem;padding:8px 18px}' +
    '.exo-season-cta.pro:hover{background:#ECFDF5}' +
    '.exo-season-x{position:absolute;top:10px;right:12px;background:none;border:none;color:#6EE7B7;font-size:1.25rem;line-height:1;cursor:pointer;padding:4px 6px;transition:color .2s}' +
    '.exo-season-x:hover{color:#064E3B}' +
    '@media(max-width:720px){.exo-season{margin:28px 14px;padding:18px 16px}.exo-season-grid{gap:14px}.exo-season-ctas{flex-direction:row;flex-wrap:wrap}}';
  document.head.appendChild(css);

  var card = document.createElement('aside');
  card.className = 'exo-season';
  card.setAttribute('aria-label', 'Temporada de renta personas naturales');
  card.innerHTML =
    '<button class="exo-season-x" aria-label="Ocultar durante la temporada" title="Ocultar">&times;</button>' +
    '<span class="exo-season-tag"><span class="dotp"></span>Temporada de renta &middot; AG 2025</span>' +
    '<div class="exo-season-grid">' +
      '<div class="exo-season-txt"><p>' + msg + '</p></div>' +
      '<div class="exo-season-venc">' +
        '<input inputmode="numeric" maxlength="12" placeholder="&middot;&middot;" autocomplete="off" aria-label="2 últimos dígitos de la cédula o NIT">' +
        '<div class="exo-season-venc-out">Escribe los 2 &uacute;ltimos d&iacute;gitos de la c&eacute;dula y te digo cu&aacute;ndo vence.</div>' +
      '</div>' +
      '<div class="exo-season-ctas">' +
        '<a class="exo-season-cta main" href="renta-personas-naturales.html">Preparar renta 210 &rarr;</a>' +
        '<a class="exo-season-cta pro" href="precios.html">PRO temporada &middot; $89.900/trim</a>' +
      '</div>' +
    '</div>';

  function track(accion, extra){
    try { if (typeof gtag !== 'undefined') gtag('event', 'renta_season_card', Object.assign({ accion: accion, pagina: page }, extra || {})); } catch(e){}
  }

  function bind(){
    card.querySelector('.exo-season-x').addEventListener('click', function(){
      card.remove();
      try { localStorage.setItem(LS_KEY, '1'); } catch(e){}
      track('descartar');
    });
    card.querySelector('.exo-season-cta.main').addEventListener('click', function(){ track('preparar_210'); });
    card.querySelector('.exo-season-cta.pro').addEventListener('click', function(){ track('pro_temporada'); });

    var inp = card.querySelector('.exo-season-venc input');
    var out = card.querySelector('.exo-season-venc-out');
    var loading = false, consultado = false, pendiente = null;
    function ensureLib(cb){
      if (typeof vencimientosPN !== 'undefined') return cb();
      pendiente = cb;
      if (loading) return;
      loading = true;
      var s = document.createElement('script');
      s.src = 'shared/vencimientos-pn.js';
      s.onload = function(){ if (pendiente) pendiente(); };
      document.head.appendChild(s);
    }
    inp.addEventListener('input', function(){
      var v = inp.value.replace(/\D/g, '');
      if (v !== inp.value) inp.value = v;
      if (v.length < 2) {
        out.innerHTML = v.length === 1 ? 'Un d&iacute;gito m&aacute;s&hellip;' : 'Escribe los 2 &uacute;ltimos d&iacute;gitos de la c&eacute;dula y te digo cu&aacute;ndo vence.';
        return;
      }
      ensureLib(function(){
        if (typeof vencimientosPN === 'undefined') return;
        var info = vencimientosPN.getVencimientoPN(v, 2026);
        if (!info) return;
        var color = info.vencido ? '#BE123C' : (info.diasRestantes <= 15 ? '#B45309' : '#047857');
        var resto = info.vencido ? 'venci&oacute; hace ' + Math.abs(info.diasRestantes) + ' d&iacute;as' : 'faltan ' + info.diasRestantes + ' d&iacute;as';
        out.innerHTML = '<strong>' + info.fechaLarga + '</strong><span style="color:' + color + ';font-weight:700">' + resto + '</span>';
        if (!consultado) { consultado = true; track('vencimetro', { digitos: info.ultimosDosDigitos }); }
      });
    });
  }

  function insert(){
    var foot = document.querySelector('footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(card, foot);
    else (document.querySelector('main') || document.body).appendChild(card);
    bind();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert);
  else insert();
})();
