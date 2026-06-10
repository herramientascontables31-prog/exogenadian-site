/* ═══ ExógenaDIAN — Activación PRO inline en el banner de límite de las herramientas IA ═══
   Resuelve el caso: un cliente PRO entra desde un navegador donde no activó (o limpió localStorage)
   y ve "3/3 gratis" sin forma evidente de decir "soy PRO". Este script detecta cuando el banner de
   límite gratis aparece e inyecta un formulario inline con email + botón Activar que llama a
   exoPro.activate(). Si valida, dispara 'ia-pro-activated' y la herramienta se refresca.

   Uso en cada herramienta IA:
     <script src="shared/ia-pro-inline.js"></script>
     <script>
       window.addEventListener('ia-pro-activated', function() {
         isPro = true;
         try { localStorage.removeItem(IA_LIMIT_KEY); } catch(e){}
         updateLimitUI(); // o la función de refresh que use la herramienta
       });
     </script>
*/
(function(){
  'use strict';

  // ─── CSS (inyectado una sola vez) ───
  var STYLE_ID = 'ia-pro-inline-style';
  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.limit-banner.limit-banner-activate{flex-direction:column;align-items:stretch;gap:10px}' +
      '.limit-pro-form{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 0 4px;border-top:1px dashed rgba(127,127,127,.25);margin-top:4px}' +
      '.limit-pro-form .limit-pro-label{font-size:.82rem;color:#9CA3AF;font-weight:600;white-space:nowrap}' +
      '.limit-pro-form input{padding:8px 12px;border:1px solid rgba(127,127,127,.3);border-radius:8px;background:rgba(255,255,255,.04);color:inherit;font:inherit;font-size:.86rem;min-width:200px;outline:none;transition:border-color .15s}' +
      '.limit-pro-form input:focus{border-color:#10B981}' +
      '.limit-pro-form button{padding:8px 16px;border:none;border-radius:8px;background:#059669;color:#fff;font:inherit;font-weight:700;font-size:.84rem;cursor:pointer;transition:background .15s}' +
      '.limit-pro-form button:hover{background:#047857}' +
      '.limit-pro-form button:disabled{opacity:.6;cursor:wait}' +
      '.limit-pro-form .limit-pro-cta{color:#9CA3AF;font-weight:600;text-decoration:underline;font-size:.82rem;white-space:nowrap}' +
      '.limit-pro-form .limit-pro-cta:hover{color:#059669}' +
      '@media(max-width:520px){.limit-pro-form{padding-left:0}.limit-pro-form input{min-width:0;flex:1 1 160px}}';
    document.head.appendChild(s);
  }

  // ─── Detectar banner de "límite gratis" e inyectar form ───
  function looksLikeFreeBanner(el){
    if (!el) return false;
    var txt = (el.textContent || '').toLowerCase();
    return txt.indexOf('gratis') >= 0 || txt.indexOf('desbloquea con pro') >= 0;
  }

  function injectForm(bannerEl){
    if (!bannerEl || bannerEl.querySelector('.limit-pro-form')) return;
    bannerEl.classList.add('limit-banner-activate');
    var formDiv = document.createElement('div');
    formDiv.className = 'limit-pro-form';
    formDiv.innerHTML =
      '<span class="limit-pro-label">¿Ya eres PRO?</span>' +
      '<input type="email" placeholder="tu@email.com" autocomplete="email" inputmode="email">' +
      '<button type="button">Activar en este dispositivo</button>' +
      '<a href="precios.html" class="limit-pro-cta">¿Aún no? Ver Plan PRO &rarr;</a>';
    bannerEl.appendChild(formDiv);

    var input = formDiv.querySelector('input');
    var button = formDiv.querySelector('button');
    var feedback = null;

    function setFeedback(msg, isError){
      if (!feedback){
        feedback = document.createElement('div');
        feedback.style.cssText = 'font-size:.8rem;margin-top:4px;line-height:1.4';
        formDiv.appendChild(feedback);
      }
      feedback.textContent = msg;
      feedback.style.color = isError ? '#EF4444' : '#10B981';
    }

    function activate(){
      var email = (input.value || '').trim().toLowerCase();
      if (!email || email.indexOf('@') < 0 || email.length < 5){
        input.focus();
        input.style.borderColor = '#EF4444';
        setFeedback('Ingresa un email válido', true);
        return;
      }
      input.style.borderColor = '';
      button.textContent = 'Verificando…';
      button.disabled = true;
      input.disabled = true;
      if (typeof exoPro === 'undefined' || !exoPro.activate){
        setFeedback('Error: módulo PRO no disponible. Recarga la página.', true);
        button.textContent = 'Activar en este dispositivo'; button.disabled = false; input.disabled = false;
        return;
      }
      exoPro.activate(email).then(function(valid){
        if (valid){
          setFeedback('✓ PRO activado. Liberando tu cupo…', false);
          // Notificar a la herramienta IA para que refresque su UI con isPro=true
          window.dispatchEvent(new CustomEvent('ia-pro-activated', { detail: { email: email } }));
        } else {
          button.textContent = 'Activar en este dispositivo'; button.disabled = false; input.disabled = false;
          setFeedback('No encontramos una suscripción PRO activa para ese email. Verifica el correo o suscríbete en /precios.', true);
        }
      }).catch(function(){
        button.textContent = 'Activar en este dispositivo'; button.disabled = false; input.disabled = false;
        setFeedback('Error de conexión. Intenta de nuevo.', true);
      });
    }

    button.addEventListener('click', activate);
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); activate(); } });

    // Pre-poblar si hay email guardado en otra clave
    try {
      var saved = (typeof exoPro !== 'undefined' && exoPro.getSaved && exoPro.getSaved()) || '';
      if (saved && saved.indexOf('@') >= 0) input.value = saved;
    } catch(e){}
    setTimeout(function(){ try { input.focus(); } catch(e){} }, 50);
  }

  // ─── Observer sobre #limitBanner ───
  function init(){
    injectStyle();
    var container = document.getElementById('limitBanner');
    if (!container) return;

    function scan(){
      // El banner de límite es típicamente <div class="limit-banner">...</div> dentro de #limitBanner
      var inner = container.querySelector('.limit-banner') || (container.classList.contains('limit-banner') ? container : null);
      if (inner && looksLikeFreeBanner(inner) && !inner.querySelector('.limit-pro-form')){
        injectForm(inner);
      }
    }

    scan();
    var observer = new MutationObserver(scan);
    observer.observe(container, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
