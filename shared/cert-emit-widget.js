/* ═══ Aziendale — Widget de emisión de certificado por curso ═══
   Uso:
     <div data-cert-widget="iva300"></div>
     <script src="../shared/cert-emit-widget.js"></script>

   Renderiza:
     - Sección con título, input de nombre y botón "Generar certificado"
     - Gate PRO si el curso tiene `pro: true` y el usuario no es PRO
     - Al generar: llama a exoCertificado.generate() y redirige a certificado.html

   Requiere:
     - shared/certificado.js (window.exoCertificado)
     - shared/pro.js (window.exoPro) — opcional, solo si el curso es pro
*/
(function(){
  'use strict';

  function basePath() {
    return window.location.pathname.indexOf('/escuela/') !== -1 ? '../' : '';
  }

  function buildPanel(courseId, course, isPro) {
    var requiresPro = course.pro === true;
    var paying = !requiresPro || isPro;

    var html =
      '<div class="cert-emit-panel" style="max-width:560px;margin:48px auto;background:linear-gradient(135deg,#ECFDF5,#fff);border:2px solid #A7F3D0;border-radius:18px;padding:32px 28px;text-align:center;box-shadow:0 6px 24px rgba(5,150,105,.08)">' +
        '<div style="font-size:2.4rem;line-height:1;margin-bottom:10px">&#127942;</div>' +
        '<h3 style="font-family:Fraunces,\'Times New Roman\',serif;font-size:1.4rem;color:#064E3B;margin-bottom:6px">Tu certificado del curso</h3>' +
        '<p style="color:#374151;font-size:.92rem;line-height:1.5;margin-bottom:18px">' +
          'Al terminar <strong>' + escapeHtml(course.name) + '</strong>, genera tu certificado con código verificable SHA-256. Compártelo en LinkedIn o envíaselo a tu empleador.' +
        '</p>';

    if (!paying) {
      // Gate PRO
      html +=
        '<div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:18px 16px;margin-bottom:18px;text-align:left">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
            '<span style="background:#D97706;color:#fff;font-size:.65rem;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:1px">PRO</span>' +
            '<strong style="color:#92400E;font-size:.92rem">Certificado exclusivo para suscriptores</strong>' +
          '</div>' +
          '<p style="color:#78350F;font-size:.84rem;line-height:1.55;margin:0">Demuestra dominio del curso con un certificado verificable mediante hash criptográfico. Incluido en el plan PRO de Aziendale junto con todas las herramientas profesionales.</p>' +
        '</div>' +
        '<a href="' + basePath() + 'precios.html" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#059669,#047857);color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:.96rem;box-shadow:0 4px 16px rgba(5,150,105,.25)">Ver planes PRO &rarr;</a>' +
        '<p style="margin-top:14px;font-size:.78rem;color:#6B7280">Ya tienes PRO? <a href="javascript:location.reload()" style="color:#059669;font-weight:600;text-decoration:none">Recargar</a></p>';
    } else {
      // PRO confirmado. Verificar si hay examen final y si fue aprobado.
      var hasExam = window.exoQuiz && window.exoQuiz.hasBank(courseId);
      var examPassed = hasExam && window.exoQuiz.isApproved(courseId);

      if (hasExam && !examPassed) {
        // Examen pendiente — requiere aprobar antes de emitir
        var attempts = window.exoQuiz.getAttempts(courseId);
        var canRetry = window.exoQuiz.canRetry(courseId);
        var bestScore = window.exoQuiz.getBestScore(courseId);
        html +=
          '<div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:12px;padding:18px 16px;margin-bottom:18px;text-align:left">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
              '<span style="background:#3B82F6;color:#fff;font-size:.65rem;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:1px">EXAMEN</span>' +
              '<strong style="color:#1E40AF;font-size:.92rem">Aprueba el examen final para emitir tu certificado</strong>' +
            '</div>' +
            '<p style="color:#1D4ED8;font-size:.84rem;line-height:1.55;margin:0">10 preguntas de selecci&oacute;n m&uacute;ltiple. Nota m&iacute;nima 70%. Hasta 3 intentos.' +
            (bestScore !== null ? ' Tu mejor intento: <strong>' + bestScore + '/10</strong>.' : '') +
            '</p>' +
          '</div>' +
          (canRetry ?
            '<button id="cert-exam-btn-' + courseId + '" type="button" style="width:100%;padding:14px;background:#3B82F6;color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;font-family:Outfit,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,.25)">Presentar examen final &rarr;</button>' :
            '<div style="padding:14px;background:#FEF2F2;border:1.5px solid #FECACA;border-radius:12px;font-size:.86rem;color:#991B1B;font-weight:600;text-align:center">Se acabaron los intentos del examen. Repasa los m&oacute;dulos y vuelve cuando est&eacute;s listo.</div>');
      } else {
        // Form normal (con o sin nota de examen aprobado)
        if (examPassed) {
          var score = window.exoQuiz.getBestScore(courseId);
          html +=
            '<div style="background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:10px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:10px;text-align:left">' +
              '<span style="font-size:1.2rem">&#9989;</span>' +
              '<div><div style="color:#065F46;font-size:.82rem;font-weight:700">Examen aprobado</div>' +
              '<div style="color:#047857;font-size:.74rem">Mejor puntaje: ' + score + '/10</div></div>' +
            '</div>';
        }
        html +=
          '<label style="display:block;text-align:left;font-size:.78rem;font-weight:700;color:#065F46;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Tu nombre completo</label>' +
          '<input type="text" id="cert-emit-name-' + courseId + '" placeholder="Ej: María Camila Pérez García" maxlength="80" style="width:100%;padding:13px 16px;border:1.5px solid #A7F3D0;border-radius:10px;font-size:1rem;font-family:Outfit,sans-serif;margin-bottom:14px;background:#fff;box-sizing:border-box">' +
          '<button id="cert-emit-btn-' + courseId + '" type="button" style="width:100%;padding:14px;background:#059669;color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;font-family:Outfit,sans-serif;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(5,150,105,.25)">Generar mi certificado &rarr;</button>' +
          '<p id="cert-emit-err-' + courseId + '" style="display:none;color:#DC2626;font-size:.82rem;margin-top:10px;font-weight:600"></p>' +
          '<p style="margin-top:14px;font-size:.78rem;color:#6B7280">El c&oacute;digo se genera con SHA-256 del nombre+curso+fecha. Verificable desde cualquier equipo. <a href="'+basePath()+'verificar-certificado.html" target="_blank" rel="noopener" style="color:#059669;font-weight:700;text-decoration:underline">¿Cómo se comprueba? &rarr;</a></p>';
      }
    }

    html += '</div>';
    return html;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showError(courseId, msg) {
    var el = document.getElementById('cert-emit-err-' + courseId);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 4000);
  }

  function wireUp(courseId, host) {
    // Botón de examen (si está en modo "examen pendiente")
    var examBtn = document.getElementById('cert-exam-btn-' + courseId);
    if (examBtn) {
      examBtn.addEventListener('click', function() {
        if (!window.exoQuiz) return;
        // Reemplaza el host por el quiz; al completar, re-renderiza el widget
        window.exoQuiz.start(courseId, host, function(passed, score) {
          // El quiz ya guardó el intento en localStorage. Re-renderiza el widget.
          render(host);
          // Si aprobó, hacer scroll al widget para que vea el nuevo estado
          setTimeout(function(){
            try { host.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){}
          }, 100);
        });
      });
      return; // No hay form de nombre todavía
    }

    var btn = document.getElementById('cert-emit-btn-' + courseId);
    var input = document.getElementById('cert-emit-name-' + courseId);
    if (!btn || !input) return;

    function emit() {
      var name = (input.value || '').trim();
      if (name.length < 3) {
        showError(courseId, 'Ingresa tu nombre completo (mínimo 3 caracteres).');
        input.focus();
        return;
      }
      if (name.length > 80) {
        showError(courseId, 'El nombre es demasiado largo.');
        return;
      }
      // Anti-mayúsculas/minúsculas raras: si todo el nombre es lowercase o uppercase, capitaliza
      if (name === name.toLowerCase() || name === name.toUpperCase()) {
        name = name.toLowerCase().split(' ').map(function(p) {
          return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
        }).join(' ');
      }

      btn.disabled = true;
      btn.textContent = 'Generando…';

      if (typeof gtag !== 'undefined') {
        gtag('event', 'cert_emit_click', { curso: courseId });
      }

      window.exoCertificado.generate(courseId, name).catch(function(err) {
        console.error('Error generando certificado:', err);
        showError(courseId, 'No se pudo generar el certificado. Asegúrate de que el sitio se cargue por HTTPS.');
        btn.disabled = false;
        btn.textContent = 'Generar mi certificado →';
      });
    }

    btn.addEventListener('click', emit);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') emit();
    });
  }

  function render(host) {
    var courseId = host.getAttribute('data-cert-widget');
    if (!courseId) return;
    if (!window.exoCertificado || !window.exoCertificado.COURSES) {
      console.error('cert-emit-widget: shared/certificado.js no está cargado');
      return;
    }
    var course = window.exoCertificado.COURSES[courseId];
    if (!course) {
      console.error('cert-emit-widget: courseId no encontrado en COURSES: ' + courseId);
      return;
    }

    function paint(isPro) {
      host.innerHTML = buildPanel(courseId, course, isPro);
      wireUp(courseId, host);
    }

    var requiresPro = course.pro === true;
    if (requiresPro && window.exoPro && window.exoPro.check) {
      // Optimistic: si hay marca local de PRO, pinta como PRO ya (evita parpadeo)
      var optimistic = false;
      try {
        if (window.exoPro.getSaved && window.exoPro.getSaved() != null) optimistic = true;
      } catch(e) {}
      paint(optimistic);
      window.exoPro.check().then(function(isPro) {
        if (isPro !== optimistic) paint(isPro);
      });
    } else if (requiresPro) {
      paint(false);
    } else {
      paint(true);
    }
  }

  /* ═══ Modo programa/ruta: data-cert-program="<slug>" ═══
     Emite la constancia de finalización del programa prog-<slug>.
     Gate: PRO + aprobado el examen de cada curso de la ruta que tenga banco.
     Cursos sin banco no bloquean (no se exige un examen inexistente). */
  function buildProgramPanel(slug, course, isPro) {
    var temaName = String(course.name || '').replace('Programa de formación en ', '');
    var html =
      '<div class="cert-emit-panel" style="max-width:560px;margin:48px auto;background:linear-gradient(135deg,#EEF2FF,#fff);border:2px solid #C7D2FE;border-radius:18px;padding:32px 28px;text-align:center;box-shadow:0 6px 24px rgba(79,70,229,.08)">' +
        '<div style="font-size:2.4rem;line-height:1;margin-bottom:10px">&#127891;</div>' +
        '<h3 style="font-family:Fraunces,\'Times New Roman\',serif;font-size:1.4rem;color:#312E81;margin-bottom:6px">Constancia de finalización de la ruta</h3>' +
        '<p style="color:#374151;font-size:.92rem;line-height:1.5;margin-bottom:18px">' +
          'Al aprobar las evaluaciones finales de los cursos de <strong>' + escapeHtml(temaName) + '</strong>, ' +
          'genera tu constancia verificable (SHA-256). No es un título académico: certifica que completaste el programa de formación.' +
        '</p>';

    if (!isPro) {
      html +=
        '<div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:18px 16px;margin-bottom:18px;text-align:left">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
            '<span style="background:#D97706;color:#fff;font-size:.65rem;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:1px">PRO</span>' +
            '<strong style="color:#92400E;font-size:.92rem">Constancia exclusiva para suscriptores</strong>' +
          '</div>' +
          '<p style="color:#78350F;font-size:.84rem;line-height:1.55;margin:0">La constancia de finalización del programa se incluye en el plan PRO, junto con todas las herramientas profesionales y los certificados de cada curso.</p>' +
        '</div>' +
        '<a href="' + basePath() + 'precios.html" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#4F46E5,#4338CA);color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:.96rem;box-shadow:0 4px 16px rgba(79,70,229,.25)">Ver planes PRO &rarr;</a>' +
        '<p style="margin-top:14px;font-size:.78rem;color:#6B7280">Ya tienes PRO? <a href="javascript:location.reload()" style="color:#4F46E5;font-weight:600;text-decoration:none">Recargar</a></p>' +
        '</div>';
      return html;
    }

    var meta = window.exoCursoMeta;
    var cursos = (meta && meta.cursosDeEsp) ? meta.cursosDeEsp(slug) : [];
    var pending = [];
    for (var i = 0; i < cursos.length; i++) {
      var c = cursos[i];
      if (window.exoQuiz && window.exoQuiz.hasBank(c) && !window.exoQuiz.isApproved(c)) {
        pending.push(c);
      }
    }

    if (pending.length > 0) {
      var items = '';
      for (var j = 0; j < pending.length; j++) {
        var pc = pending[j];
        var nm = (meta && meta.nombreCurso) ? meta.nombreCurso(pc) : pc;
        items += '<li style="margin-bottom:6px"><a href="' + basePath() + 'escuela/' + pc + '.html" style="color:#4338CA;font-weight:600;text-decoration:none">' + escapeHtml(nm) + ' &rarr;</a></li>';
      }
      html +=
        '<div style="background:#EEF2FF;border:1.5px solid #C7D2FE;border-radius:12px;padding:18px 16px;text-align:left">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
            '<span style="background:#4F46E5;color:#fff;font-size:.65rem;font-weight:800;padding:3px 10px;border-radius:100px;letter-spacing:1px">EXÁMENES</span>' +
            '<strong style="color:#3730A3;font-size:.92rem">Te faltan estos exámenes finales</strong>' +
          '</div>' +
          '<p style="color:#4338CA;font-size:.84rem;line-height:1.55;margin:0 0 10px">Apruébalos (70%) en cada curso para emitir la constancia del programa:</p>' +
          '<ul style="margin:0;padding-left:18px;font-size:.88rem;color:#374151">' + items + '</ul>' +
        '</div></div>';
      return html;
    }

    var pid = 'prog-' + slug;
    html +=
      '<label style="display:block;text-align:left;font-size:.78rem;font-weight:700;color:#3730A3;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Tu nombre completo</label>' +
      '<input type="text" id="cert-emit-name-' + pid + '" placeholder="Ej: María Camila Pérez García" maxlength="80" style="width:100%;padding:13px 16px;border:1.5px solid #C7D2FE;border-radius:10px;font-size:1rem;font-family:Outfit,sans-serif;margin-bottom:14px;background:#fff;box-sizing:border-box">' +
      '<button id="cert-emit-btn-' + pid + '" type="button" style="width:100%;padding:14px;background:#4F46E5;color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;font-family:Outfit,sans-serif;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(79,70,229,.25)">Generar mi constancia &rarr;</button>' +
      '<p id="cert-emit-err-' + pid + '" style="display:none;color:#DC2626;font-size:.82rem;margin-top:10px;font-weight:600"></p>' +
      '<p style="margin-top:14px;font-size:.78rem;color:#6B7280">El código se genera con SHA-256 del nombre+programa+fecha. Verificable desde cualquier equipo. <a href="'+basePath()+'verificar-certificado.html" target="_blank" rel="noopener" style="color:#059669;font-weight:700;text-decoration:underline">¿Cómo se comprueba? &rarr;</a></p>' +
      '</div>';
    return html;
  }

  function wireUpProgram(slug, host) {
    var pid = 'prog-' + slug;
    var btn = document.getElementById('cert-emit-btn-' + pid);
    var input = document.getElementById('cert-emit-name-' + pid);
    if (!btn || !input) return;

    function emit() {
      var name = (input.value || '').trim();
      if (name.length < 3) { showError(pid, 'Ingresa tu nombre completo (mínimo 3 caracteres).'); input.focus(); return; }
      if (name.length > 80) { showError(pid, 'El nombre es demasiado largo.'); return; }
      if (name === name.toLowerCase() || name === name.toUpperCase()) {
        name = name.toLowerCase().split(' ').map(function(p) {
          return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
        }).join(' ');
      }
      btn.disabled = true;
      btn.textContent = 'Generando…';
      if (typeof gtag !== 'undefined') gtag('event', 'cert_emit_click', { curso: pid });
      window.exoCertificado.generate(pid, name).catch(function(err) {
        console.error('Error generando constancia:', err);
        showError(pid, 'No se pudo generar la constancia. Asegúrate de que el sitio se cargue por HTTPS.');
        btn.disabled = false;
        btn.textContent = 'Generar mi constancia →';
      });
    }
    btn.addEventListener('click', emit);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') emit(); });
  }

  function renderProgram(host) {
    var slug = host.getAttribute('data-cert-program');
    if (!slug) return;
    if (!window.exoCertificado || !window.exoCertificado.COURSES) {
      console.error('cert-emit-widget: shared/certificado.js no está cargado');
      return;
    }
    var course = window.exoCertificado.COURSES['prog-' + slug];
    if (!course) {
      console.error('cert-emit-widget: programa no encontrado en COURSES: prog-' + slug);
      return;
    }
    function paint(isPro) {
      host.innerHTML = buildProgramPanel(slug, course, isPro);
      wireUpProgram(slug, host);
    }
    if (window.exoPro && window.exoPro.check) {
      var optimistic = false;
      try { if (window.exoPro.getSaved && window.exoPro.getSaved() != null) optimistic = true; } catch (e) {}
      paint(optimistic);
      window.exoPro.check().then(function(isPro) { if (isPro !== optimistic) paint(isPro); });
    } else {
      paint(false);
    }
  }

  function init() {
    var hosts = document.querySelectorAll('[data-cert-widget]');
    for (var i = 0; i < hosts.length; i++) render(hosts[i]);
    var phosts = document.querySelectorAll('[data-cert-program]');
    for (var k = 0; k < phosts.length; k++) renderProgram(phosts[k]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
