/* ═══ Aziendale — Motor de exámenes finales ═══
   Quiz client-side: 10 preguntas MCQ random del banco del curso, nota mínima 70%, 3 intentos.

   API:
     exoQuiz.hasBank(courseId)         → boolean
     exoQuiz.isApproved(courseId)      → boolean (algún intento pasó 70%)
     exoQuiz.getBestScore(courseId)    → number 0..10 | null
     exoQuiz.getAttempts(courseId)     → number
     exoQuiz.canRetry(courseId)        → boolean
     exoQuiz.start(courseId, host, onComplete) → monta UI en `host`

   Banco esperado: window.exoQuizBanks[courseId] = [{q, opts:[A,B,C,D], correct:0..3, explanation}, ...]
*/
(function(){
  'use strict';

  var QUESTIONS_PER_EXAM = 10;
  var PASS_THRESHOLD = 0.70;
  var MAX_ATTEMPTS = 3;
  var STORAGE_KEY = 'exo_quiz_attempts';

  // Cursos procedimentales (cómo diligenciar/cargar/operar): la competencia
  // se demuestra haciéndolo, no con trivia MCQ. Sin examen → su certificado y
  // la constancia de ruta no lo gatean. El banco sigue en quiz-banks.js
  // (dormido, reutilizable). Reversible: basta quitar la clave.
  var NO_EXAM = {
    'cargar-exogena-muisca': 1,
    'exogena-claude': 1,
    'auditar-eeff-ia': 1
  };

  function getBanks() { return window.exoQuizBanks || {}; }
  function getBank(courseId) { return getBanks()[courseId] || null; }
  function hasBank(courseId) {
    if (NO_EXAM[courseId]) return false;
    var b = getBank(courseId);
    return Array.isArray(b) && b.length >= QUESTIONS_PER_EXAM;
  }

  function getStored() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function saveAttempt(courseId, attempt) {
    var all = getStored();
    if (!all[courseId]) all[courseId] = [];
    all[courseId].push(attempt);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch(e){}
  }
  function getAttempts(courseId) {
    var all = getStored();
    return (all[courseId] || []).length;
  }
  function isApproved(courseId) {
    var all = getStored();
    var arr = all[courseId] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].passed) return true;
    return false;
  }
  function getBestScore(courseId) {
    var all = getStored();
    var arr = all[courseId] || [];
    if (!arr.length) return null;
    var best = 0;
    for (var i = 0; i < arr.length; i++) if (arr[i].score > best) best = arr[i].score;
    return best;
  }
  function canRetry(courseId) {
    if (isApproved(courseId)) return false;
    return getAttempts(courseId) < MAX_ATTEMPTS;
  }

  function shuffleArray(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  function pickQuestions(bank) {
    return shuffleArray(bank).slice(0, QUESTIONS_PER_EXAM);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function renderIntro(host, courseId, courseName, onStart) {
    var approved = isApproved(courseId);
    var attempts = getAttempts(courseId);
    var best = getBestScore(courseId);

    var html =
      '<div class="quiz-intro" style="max-width:580px;margin:0 auto;text-align:center;padding:32px 24px;background:linear-gradient(135deg,#EFF6FF,#fff);border:2px solid #BFDBFE;border-radius:18px;font-family:Outfit,sans-serif">' +
        '<div style="font-size:2.4rem;line-height:1;margin-bottom:10px">' + (approved ? '&#9989;' : '&#128221;') + '</div>' +
        '<h3 style="font-family:Fraunces,serif;font-size:1.4rem;color:#1E40AF;margin-bottom:6px">Examen final del curso</h3>' +
        '<p style="color:#374151;font-size:.92rem;line-height:1.5;margin-bottom:16px">' + esc(courseName) + '</p>';

    if (approved) {
      html +=
        '<div style="background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:12px;padding:16px;margin-bottom:18px">' +
          '<div style="color:#065F46;font-weight:700;margin-bottom:4px">Examen aprobado &#127942;</div>' +
          '<div style="color:#047857;font-size:.86rem">Mejor puntaje: <strong>' + best + '/' + QUESTIONS_PER_EXAM + '</strong> &middot; ' + attempts + ' intento' + (attempts > 1 ? 's' : '') + '</div>' +
        '</div>' +
        '<button class="quiz-go" style="padding:13px 26px;background:#3B82F6;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:.92rem;cursor:pointer;font-family:inherit">Volver a presentarlo</button>';
    } else if (attempts >= MAX_ATTEMPTS) {
      html +=
        '<div style="background:#FEF2F2;border:1.5px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:8px;text-align:left">' +
          '<div style="color:#991B1B;font-weight:700;margin-bottom:4px">Se acabaron los intentos</div>' +
          '<div style="color:#9F1239;font-size:.86rem">Mejor puntaje: ' + (best || 0) + '/' + QUESTIONS_PER_EXAM + ' &middot; ' + attempts + ' intentos. Repasa los m&oacute;dulos del curso y vuelve cuando est&eacute;s listo. (Si quieres reiniciar el contador, contacta a soporte.)</div>' +
        '</div>';
    } else {
      var queda = MAX_ATTEMPTS - attempts;
      html +=
        '<ul style="text-align:left;color:#374151;font-size:.88rem;line-height:1.65;margin:0 0 16px 18px">' +
          '<li>' + QUESTIONS_PER_EXAM + ' preguntas de selecci&oacute;n m&uacute;ltiple (4 opciones)</li>' +
          '<li>Nota m&iacute;nima para aprobar: <strong>' + Math.round(PASS_THRESHOLD * QUESTIONS_PER_EXAM) + '/' + QUESTIONS_PER_EXAM + '</strong> (' + Math.round(PASS_THRESHOLD * 100) + '%)</li>' +
          '<li>Tienes <strong>' + queda + '</strong> intento' + (queda > 1 ? 's' : '') + ' restante' + (queda > 1 ? 's' : '') + ' (m&aacute;ximo ' + MAX_ATTEMPTS + ')</li>' +
          '<li>Aprobar el examen es requisito para generar el certificado</li>' +
        '</ul>' +
        (best !== null ? '<div style="font-size:.82rem;color:#6B7280;margin-bottom:14px">Tu mejor intento: <strong>' + best + '/' + QUESTIONS_PER_EXAM + '</strong></div>' : '') +
        '<button class="quiz-go" style="padding:14px 28px;background:#3B82F6;color:#fff;border:none;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(59,130,246,.25)">Iniciar examen &rarr;</button>';
    }

    html += '</div>';
    host.innerHTML = html;

    var btn = host.querySelector('.quiz-go');
    if (btn) btn.addEventListener('click', function(){ onStart(); });
  }

  function renderQuiz(host, courseId, courseName, onComplete) {
    var bank = getBank(courseId);
    var questions = pickQuestions(bank);
    var answers = []; // [{questionIdx, selectedOpt}]
    var current = 0;

    function paint() {
      var q = questions[current];
      var html =
        '<div style="max-width:680px;margin:0 auto;padding:24px;background:#fff;border:1.5px solid #E5E7EB;border-radius:16px;font-family:Outfit,sans-serif">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:.82rem;color:#6B7280;font-weight:600">' +
            '<span>' + esc(courseName) + '</span>' +
            '<span>Pregunta ' + (current + 1) + ' de ' + questions.length + '</span>' +
          '</div>' +
          '<div style="height:6px;background:#F3F4F6;border-radius:3px;margin-bottom:24px;overflow:hidden"><div style="height:100%;width:' + ((current + 1) / questions.length * 100).toFixed(0) + '%;background:linear-gradient(90deg,#3B82F6,#60A5FA);border-radius:3px;transition:width .3s"></div></div>' +
          '<h3 style="font-family:Fraunces,serif;font-size:1.15rem;color:#111827;line-height:1.4;margin-bottom:20px">' + esc(q.q) + '</h3>' +
          '<div class="quiz-opts" style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';

      for (var i = 0; i < q.opts.length; i++) {
        html +=
          '<label class="quiz-opt" style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border:1.5px solid #E5E7EB;border-radius:10px;cursor:pointer;transition:all .15s;font-size:.92rem;color:#374151;line-height:1.5" onmouseover="this.style.borderColor=\'#93C5FD\'" onmouseout="this.style.borderColor=this.getAttribute(\'data-selected\')===\'1\'?\'#3B82F6\':\'#E5E7EB\'">' +
            '<input type="radio" name="q' + current + '" value="' + i + '" style="margin-top:3px;flex-shrink:0;cursor:pointer">' +
            '<span>' + esc(q.opts[i]) + '</span>' +
          '</label>';
      }

      html +=
          '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">' +
            (current > 0 ? '<button class="quiz-prev" style="padding:10px 20px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-weight:600;font-size:.88rem;cursor:pointer;font-family:inherit">&larr; Anterior</button>' : '<span></span>') +
            '<button class="quiz-next" disabled style="padding:12px 26px;background:#3B82F6;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:.92rem;cursor:pointer;font-family:inherit;opacity:.4">' + (current === questions.length - 1 ? 'Enviar examen' : 'Siguiente') + ' &rarr;</button>' +
          '</div>' +
        '</div>';
      host.innerHTML = html;

      // Restore previous answer
      var previous = answers[current];
      if (previous != null) {
        var radio = host.querySelector('input[name="q' + current + '"][value="' + previous + '"]');
        if (radio) {
          radio.checked = true;
          var lbl = radio.closest('label');
          if (lbl) { lbl.style.borderColor = '#3B82F6'; lbl.style.background = '#EFF6FF'; lbl.setAttribute('data-selected','1'); }
          host.querySelector('.quiz-next').disabled = false;
          host.querySelector('.quiz-next').style.opacity = '1';
        }
      }

      // Wire radios
      var radios = host.querySelectorAll('input[type="radio"]');
      radios.forEach(function(r){
        r.addEventListener('change', function(){
          answers[current] = parseInt(r.value, 10);
          // Update visual selection
          host.querySelectorAll('.quiz-opt').forEach(function(lbl){
            lbl.style.borderColor = '#E5E7EB';
            lbl.style.background = '#fff';
            lbl.setAttribute('data-selected','0');
          });
          var lbl = r.closest('label');
          if (lbl) { lbl.style.borderColor = '#3B82F6'; lbl.style.background = '#EFF6FF'; lbl.setAttribute('data-selected','1'); }
          host.querySelector('.quiz-next').disabled = false;
          host.querySelector('.quiz-next').style.opacity = '1';
        });
      });

      var nextBtn = host.querySelector('.quiz-next');
      nextBtn.addEventListener('click', function(){
        if (answers[current] == null) return;
        if (current === questions.length - 1) {
          submit();
        } else {
          current++;
          paint();
        }
      });
      var prevBtn = host.querySelector('.quiz-prev');
      if (prevBtn) prevBtn.addEventListener('click', function(){ current--; paint(); });
    }

    function submit() {
      var score = 0;
      for (var i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].correct) score++;
      }
      var passed = score >= Math.round(PASS_THRESHOLD * questions.length);

      var attempt = {
        score: score,
        total: questions.length,
        passed: passed,
        timestamp: Date.now(),
        answers: answers.slice()
      };
      saveAttempt(courseId, attempt);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_completado', { curso: courseId, score: score, passed: passed });
      }

      renderResults(host, courseId, courseName, questions, answers, score, passed, onComplete);
    }

    paint();
  }

  function renderResults(host, courseId, courseName, questions, answers, score, passed, onComplete) {
    var html =
      '<div style="max-width:760px;margin:0 auto;padding:32px 24px;background:#fff;border:2px solid ' + (passed ? '#A7F3D0' : '#FECACA') + ';border-radius:18px;font-family:Outfit,sans-serif">' +
        '<div style="text-align:center;margin-bottom:24px">' +
          '<div style="font-size:3rem;line-height:1;margin-bottom:8px">' + (passed ? '&#127942;' : '&#128221;') + '</div>' +
          '<h3 style="font-family:Fraunces,serif;font-size:1.5rem;color:' + (passed ? '#065F46' : '#991B1B') + ';margin-bottom:6px">' + (passed ? '&iexcl;Aprobaste!' : 'No alcanzaste el m&iacute;nimo') + '</h3>' +
          '<div style="font-size:1.05rem;color:#374151;font-weight:600">Puntaje: <span style="font-size:1.6rem;color:' + (passed ? '#059669' : '#DC2626') + '">' + score + '/' + questions.length + '</span> (' + Math.round(score / questions.length * 100) + '%)</div>' +
        '</div>' +
        '<div style="border-top:1px solid #E5E7EB;padding-top:20px"><h4 style="font-size:.92rem;font-weight:700;color:#374151;margin-bottom:14px">Revisi&oacute;n de respuestas</h4>';

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var ok = answers[i] === q.correct;
      html +=
        '<details style="margin-bottom:10px;padding:12px 14px;background:' + (ok ? '#F0FDF4' : '#FEF2F2') + ';border:1px solid ' + (ok ? '#BBF7D0' : '#FECACA') + ';border-radius:10px">' +
          '<summary style="cursor:pointer;font-size:.88rem;font-weight:600;color:' + (ok ? '#065F46' : '#991B1B') + ';list-style:none;display:flex;justify-content:space-between;gap:10px">' +
            '<span>' + (ok ? '&#9989;' : '&#10060;') + ' Pregunta ' + (i + 1) + ': ' + esc(q.q.length > 80 ? q.q.substring(0, 80) + '...' : q.q) + '</span>' +
          '</summary>' +
          '<div style="margin-top:10px;font-size:.84rem;line-height:1.6">' +
            '<div style="color:#4B5563;margin-bottom:6px"><strong>Tu respuesta:</strong> ' + esc(q.opts[answers[i]] || 'Sin responder') + '</div>' +
            (!ok ? '<div style="color:#065F46;margin-bottom:6px"><strong>Correcta:</strong> ' + esc(q.opts[q.correct]) + '</div>' : '') +
            '<div style="color:#1F2937;padding-top:8px;border-top:1px dashed ' + (ok ? '#86EFAC' : '#FCA5A5') + '"><strong>Explicaci&oacute;n:</strong> ' + esc(q.explanation || '') + '</div>' +
          '</div>' +
        '</details>';
    }
    html += '</div>';

    var remaining = MAX_ATTEMPTS - getAttempts(courseId);
    html +=
      '<div style="margin-top:24px;display:flex;flex-direction:column;gap:10px;align-items:center">';
    if (passed) {
      html += '<button class="quiz-cert" style="padding:14px 30px;background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit;box-shadow:0 6px 18px rgba(5,150,105,.3)">Generar mi certificado &rarr;</button>';
    } else if (remaining > 0) {
      html += '<div style="font-size:.86rem;color:#6B7280">Te quedan <strong>' + remaining + '</strong> intento' + (remaining > 1 ? 's' : '') + '</div>';
      html += '<button class="quiz-retry" style="padding:13px 26px;background:#3B82F6;color:#fff;border:none;border-radius:12px;font-weight:700;font-size:.96rem;cursor:pointer;font-family:inherit">Reintentar examen</button>';
    } else {
      html += '<div style="font-size:.86rem;color:#991B1B;font-weight:600">Se acabaron los intentos. Repasa los m&oacute;dulos y vuelve cuando est&eacute;s listo.</div>';
    }
    html += '</div></div>';

    host.innerHTML = html;

    var certBtn = host.querySelector('.quiz-cert');
    if (certBtn) certBtn.addEventListener('click', function(){
      if (typeof onComplete === 'function') onComplete(true, score);
    });
    var retryBtn = host.querySelector('.quiz-retry');
    if (retryBtn) retryBtn.addEventListener('click', function(){
      start(courseId, host, onComplete);
    });
  }

  function start(courseId, host, onComplete) {
    if (!host) return;
    if (!hasBank(courseId)) {
      host.innerHTML = '<div style="text-align:center;padding:24px;color:#6B7280;font-size:.88rem">Examen pr&oacute;ximamente disponible para este curso.</div>';
      return;
    }
    var courseName = (window.exoCertificado && window.exoCertificado.COURSES && window.exoCertificado.COURSES[courseId])
      ? window.exoCertificado.COURSES[courseId].name : courseId;

    function startActual(){
      renderQuiz(host, courseId, courseName, onComplete);
    }

    // Si ya está aprobado o tiene intentos, mostrar intro primero
    renderIntro(host, courseId, courseName, startActual);
  }

  window.exoQuiz = {
    hasBank: hasBank,
    isApproved: isApproved,
    getBestScore: getBestScore,
    getAttempts: getAttempts,
    canRetry: canRetry,
    start: start,
    PASS_THRESHOLD: PASS_THRESHOLD,
    QUESTIONS_PER_EXAM: QUESTIONS_PER_EXAM,
    MAX_ATTEMPTS: MAX_ATTEMPTS
  };
})();
