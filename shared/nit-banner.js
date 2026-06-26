/* ═══ Aziendale — NIT Next-Step Banner ═══
   Banner post-consulta NIT que sugiere el próximo paso contextual y
   (opcionalmente) hace nudge de upgrade a PRO según cantidad de
   consultas en la sesión.

   Uso:
     <div id="nitBannerContainer" class="hidden"></div>
     <script src="shared/nit-banner.js"></script>

     // En consulta exitosa (individual o masiva):
     if (window.nitBanner) nitBanner.onQuerySuccess('individual');
     // o:
     if (window.nitBanner) nitBanner.onQuerySuccess('bulk');

   TODO(revisar cada 1-2 meses según calendario fiscal DIAN):
     Copy actual = exógena PJ y PN (vigente may-jun 2026, vencimientos
     14 may - 12 jun). En jun-oct→ renta PN/IVA/retefuente;
     nov-dic→ cierre/EEFF. Si este banner demuestra conversión medible,
     evaluar expandir a tabla seasonal (spec en memoria interna
     project_seasonal_js_spec.md).
*/
(function () {
  'use strict';

  var COUNTER_KEY = 'nit_query_count_session';
  var CONTAINER_ID = 'nitBannerContainer';

  // Config hardcoded para temporada actual (mayo-junio 2026 — exógena PJ y PN)
  var BANNER = {
    headline: '¿Ya tenés los NITs? Armá tu exógena DIAN en minutos',
    subline: 'Vencimientos PJ y PN: 14 mayo al 12 junio — Resolución 000227/2025',
    ctaLabel: 'Abrir Exógena DIAN',
    ctaHref: 'exogena-suite.html',
    ctaTool: 'exogena-suite'
  };

  function getCount() {
    return parseInt(sessionStorage.getItem(COUNTER_KEY) || '0', 10) || 0;
  }

  function incrementCount() {
    var c = getCount() + 1;
    try { sessionStorage.setItem(COUNTER_KEY, String(c)); } catch (e) { /* storage full */ }
    return c;
  }

  // Nivel de nudge PRO: 0=sin nudge, 1=ver planes (sin precio), 2=activar con precio
  function nudgeLevel(count) {
    if (count >= 10) return 2;
    if (count >= 5) return 1;
    return 0;
  }

  function nudgeHtml(level) {
    if (level === 1) {
      return '<div style="margin-top:14px;padding:12px 16px;background:#FFFBEB;border:1.5px solid #FEF3C7;border-left:4px solid #F59E0B;border-radius:10px;font-size:.86rem;color:#92400E;line-height:1.5">' +
        '<strong>Ya consultaste 5+ NITs en esta sesión.</strong> ' +
        'Con PRO subís a 250 NITs masivos diarios con enriquecimiento DIAN MUISCA. ' +
        '<a href="precios.html" onclick="if(window.exoTrack&&exoTrack.ctaClick)exoTrack.ctaClick(\'nit_banner_pro_nudge\',\'precios\')" style="color:#92400E;font-weight:700;text-decoration:underline">Ver planes →</a>' +
        '</div>';
    }
    if (level === 2) {
      return '<div style="margin-top:14px;padding:16px 20px;background:#FFFBEB;border:2px solid #F59E0B;border-radius:12px;font-size:.9rem;color:#92400E;line-height:1.55">' +
        '<strong>Llevás 10+ NITs en esta sesión.</strong> Activá PRO y evitá el límite diario.<br>' +
        '<span style="font-size:.85rem">Mensual <strong>$49.900</strong> · Trimestre <strong>$89.900</strong> · Anual <strong>$179.900</strong> (= $14.992/mes)</span>' +
        '<div style="margin-top:10px"><a href="precios.html" onclick="if(window.exoTrack&&exoTrack.ctaClick)exoTrack.ctaClick(\'nit_banner_pro_nudge\',\'precios\')" style="display:inline-block;padding:8px 20px;background:#F59E0B;color:#fff;font-weight:700;font-size:.88rem;text-decoration:none;border-radius:8px">Activar PRO →</a></div>' +
        '</div>';
    }
    return '';
  }

  function render(isPro, count) {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    var html = '<div class="card" style="margin-top:8px;padding:20px 24px;background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:14px">' +
      '<div style="display:flex;align-items:center;gap:6px;font-size:.72rem;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">' +
      '<span>🔥</span> Próximo paso' +
      '</div>' +
      '<h3 style="font-size:1.1rem;font-weight:700;color:#064E3B;margin-bottom:4px">' + BANNER.headline + '</h3>' +
      '<p style="font-size:.82rem;color:#065F46;margin-bottom:14px">' + BANNER.subline + '</p>' +
      '<a href="' + BANNER.ctaHref + '" ' +
      'onclick="if(window.exoTrack&&exoTrack.ctaClick)exoTrack.ctaClick(\'nit_banner_primary\',\'' + BANNER.ctaTool + '\')" ' +
      'style="display:inline-flex;align-items:center;gap:6px;padding:11px 22px;background:#059669;color:#fff;font-weight:600;font-size:.92rem;text-decoration:none;border-radius:10px;transition:background .2s" ' +
      'onmouseover="this.style.background=\'#047857\'" onmouseout="this.style.background=\'#059669\'">' +
      BANNER.ctaLabel + ' →' +
      '</a>';

    // Nudge PRO solo si NO es PRO
    if (!isPro) {
      html += nudgeHtml(nudgeLevel(count));
    }

    html += '</div>';
    container.innerHTML = html;
    container.classList.remove('hidden');
  }

  // Dispara desde consultarSingle() o consultarBulk() tras éxito
  function onQuerySuccess(type) {
    var count = incrementCount();

    // Check PRO: primero uso window.IS_PRO (sync), luego refresh async con exoPro
    var isPro = !!window.IS_PRO;
    render(isPro, count);

    // Refresh asíncrono si exoPro está disponible y aún no se chequeó
    if (window.exoPro && typeof exoPro.check === 'function' && !window.IS_PRO) {
      exoPro.check().then(function (pro) {
        if (pro !== isPro) render(!!pro, count);
      }).catch(function () { /* silencioso */ });
    }
  }

  // Exportar API global
  window.nitBanner = {
    onQuerySuccess: onQuerySuccess,
    getCount: getCount
  };
})();
