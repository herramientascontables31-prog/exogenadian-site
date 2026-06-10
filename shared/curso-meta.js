/* ═══ ExógenaDIAN — Metadatos de cursos y especializaciones ═══
   Define nivel, tiempo de lectura, pre-requisitos y especialización de cada curso.

   El tiempo se mide de forma honesta: minutos de lectura reales calculados
   sobre el conteo de palabras del curso a ~160 palabras/minuto (ritmo de
   lectura técnica con tablas y ejemplos). NO se inventan "horas de curso".
   La práctica con la herramienta es adicional y depende de cada estudiante.

   API:
     exoCursoMeta.get('iva300')              → {nivel, lecturaMin, prereq, esp}
     exoCursoMeta.getEsp('niif')             → {nombre, descripcion, cursos:[...]}
     exoCursoMeta.cursosDeEsp('niif')        → ['niif', 'f2516']
     exoCursoMeta.tiempoLectura('iva300')    → "Lectura ~45 min"
     exoCursoMeta.lecturaTotalEspMin('trib-pj') → minutos totales (número)
     exoCursoMeta.lecturaTotalEsp('trib-pj') → "~8 h de lectura"
     exoCursoMeta.nivelGeneralEsp('niif')    → 'Avanzado'

   Auto-renderiza un mini-panel en cualquier [data-curso-meta="<id>"].
*/
(function(){
  'use strict';

  // ─── Metadatos por curso. lecturaMin = minutos de lectura medidos sobre
  //     el contenido real (palabras ÷ 160 wpm). courseId = exoCertificado.COURSES ───
  var META = {
    'ventas':            { nivel:'Mixto',      lecturaMin:78,  prereq:null, esp:null },
    'ia-automatizacion': { nivel:'Intermedio', lecturaMin:212, prereq:null, esp:'ia' },
    'iva300':            { nivel:'Intermedio', lecturaMin:47,  prereq:null, esp:'iva-dev' },
    'renta110':          { nivel:'Avanzado',   lecturaMin:53,  prereq:'iva300', esp:'trib-pj' },
    'renta-pn-210':      { nivel:'Intermedio', lecturaMin:92,  prereq:'retencion350', esp:'trib-pn' },
    'retencion350':      { nivel:'Intermedio', lecturaMin:57,  prereq:'iva300', esp:'iva-dev' },
    'exogena':           { nivel:'Avanzado',   lecturaMin:119, prereq:'renta110', esp:'trib-pj' },
    'exogena-claude':    { nivel:'Intermedio', lecturaMin:134, prereq:'ia-automatizacion', esp:'ia' },
    'devoluciones':      { nivel:'Intermedio', lecturaMin:54,  prereq:'iva300', esp:'iva-dev' },
    'ingresos-para-terceros': { nivel:'Avanzado', lecturaMin:30, prereq:'renta110', esp:'trib-pj' },
    'sanciones':         { nivel:'Intermedio', lecturaMin:53,  prereq:null, esp:'trib-pj' },
    'nomina':            { nivel:'Intermedio', lecturaMin:69,  prereq:null, esp:'nomina' },
    'derecho-laboral':   { nivel:'Intermedio', lecturaMin:75,  prereq:null, esp:'nomina' },
    'procedimiento':     { nivel:'Avanzado',   lecturaMin:60,  prereq:'sanciones', esp:'trib-pj' },
    'ica':               { nivel:'Básico',     lecturaMin:51,  prereq:null, esp:'rst' },
    'niif':              { nivel:'Avanzado',   lecturaMin:58,  prereq:'contabilidad-basica', esp:'fundamentos' },
    'regimen-simple':    { nivel:'Intermedio', lecturaMin:56,  prereq:null, esp:'rst' },
    'f2516':             { nivel:'Avanzado',   lecturaMin:35,  prereq:'renta110', esp:'trib-pj' },
    'contabilidad-basica':{ nivel:'Básico',    lecturaMin:29,  prereq:null, esp:'fundamentos' },
    'finanzas-no-financieros':{ nivel:'Básico', lecturaMin:21, prereq:null, esp:'fundamentos' },
    'auditar-eeff-ia':   { nivel:'Intermedio', lecturaMin:25,  prereq:'ia-automatizacion', esp:'ia' },
    'cargar-exogena-muisca':{ nivel:'Intermedio', lecturaMin:37, prereq:'exogena', esp:'trib-pj' },
    'finanzas':          { nivel:'Básico',     lecturaMin:58,  prereq:null, esp:null },
    'ia-sin-miedo':      { nivel:'Básico',     lecturaMin:95,  prereq:null, esp:'ia' },
    'desarrollo-contadores':   { nivel:'Avanzado',   lecturaMin:120, prereq:'ia-automatizacion', esp:'ia' },
    'claude-cowork-contadores':{ nivel:'Intermedio', lecturaMin:100, prereq:'ia-automatizacion', esp:'ia' }
  };

  // ─── Especializaciones (tracks). El tiempo total se calcula sumando la
  //     lectura real de los cursos, no se fija a mano ───
  var ESPECIALIZACIONES = {
    'trib-pj': {
      nombre: 'Tributación Personas Jurídicas',
      slug: 'trib-pj',
      descripcion: 'Domina la declaración de renta, retención, exógena, sanciones y procedimiento DIAN para sociedades.',
      icono: '🏢',
      color: '#7C3AED',
      colorBg: '#F5F3FF',
      colorBorder: '#DDD6FE',
      cursos: ['renta110', 'f2516', 'retencion350', 'exogena', 'cargar-exogena-muisca', 'sanciones', 'procedimiento', 'ingresos-para-terceros']
    },
    'trib-pn': {
      nombre: 'Tributación Personas Naturales',
      slug: 'trib-pn',
      descripcion: 'F210 cedular completo, sanciones y procedimiento para PN. Curso más vendido marzo–octubre.',
      icono: '👤',
      color: '#0EA5E9',
      colorBg: '#F0F9FF',
      colorBorder: '#BAE6FD',
      cursos: ['renta-pn-210', 'retencion350', 'sanciones', 'procedimiento']
    },
    'iva-dev': {
      nombre: 'IVA y Devoluciones',
      slug: 'iva-dev',
      descripcion: 'IVA 300 bimestral, retención de IVA, devoluciones DIAN con saldo a favor.',
      icono: '📋',
      color: '#D97706',
      colorBg: '#FFFBEB',
      colorBorder: '#FDE68A',
      cursos: ['iva300', 'retencion350', 'devoluciones']
    },
    'rst': {
      nombre: 'Régimen Simple de Tributación',
      slug: 'rst',
      descripcion: 'RST, ICA consolidado, F2593 bimestral, F260 anual y retenciones aplicables.',
      icono: '⚖️',
      color: '#059669',
      colorBg: '#ECFDF5',
      colorBorder: '#A7F3D0',
      cursos: ['regimen-simple', 'ica', 'retencion350']
    },
    'nomina': {
      nombre: 'Nómina y Derecho Laboral',
      slug: 'nomina',
      descripcion: 'Liquidación, prestaciones, contratos, terminación e indemnizaciones. CST + seguridad social.',
      icono: '💼',
      color: '#DC2626',
      colorBg: '#FEF2F2',
      colorBorder: '#FECACA',
      cursos: ['nomina', 'derecho-laboral']
    },
    'fundamentos': {
      nombre: 'Fundamentos Contables',
      slug: 'fundamentos',
      descripcion: 'La base que todo contador y profesional necesita: contabilidad desde cero, lectura de estados financieros y marco NIIF.',
      icono: '🎓',
      color: '#0D9488',
      colorBg: '#F0FDFA',
      colorBorder: '#99F6E4',
      cursos: ['contabilidad-basica', 'finanzas-no-financieros', 'niif']
    },
    'exogena': {
      nombre: 'Información Exógena',
      slug: 'exogena',
      descripcion: 'Medios magnéticos completos: los formatos del Art. 631 ET, ingresos para terceros, cargue al MUISCA y automatización con IA. La ruta estrella de enero a abril.',
      icono: '🗂️',
      color: '#4F46E5',
      colorBg: '#EEF2FF',
      colorBorder: '#C7D2FE',
      cursos: ['exogena', 'ingresos-para-terceros', 'cargar-exogena-muisca', 'exogena-claude']
    },
    'ia': {
      nombre: 'IA Contable',
      slug: 'ia',
      descripcion: 'Ruta progresiva del contador AI-first: desde perderle el miedo a la IA hasta construir tus propias Skills y software con Claude Code.',
      icono: '🤖',
      color: '#059669',
      colorBg: '#ECFDF5',
      colorBorder: '#A7F3D0',
      cursos: ['ia-sin-miedo', 'ia-automatizacion', 'claude-cowork-contadores', 'exogena-claude', 'auditar-eeff-ia', 'desarrollo-contadores']
    }
  };

  function get(courseId) { return META[courseId] || null; }
  function getEsp(slug) { return ESPECIALIZACIONES[slug] || null; }
  function cursosDeEsp(slug) {
    var esp = ESPECIALIZACIONES[slug];
    return esp ? esp.cursos.slice() : [];
  }

  // ─── Formato honesto del tiempo de lectura ───
  // < 60 min  → "~X min" (redondeado a 5)
  // >= 60 min → "~X h" o "~X,5 h" (redondeado a media hora)
  function fmtLectura(min) {
    if (!min || min <= 0) return '';
    if (min < 60) {
      var r = Math.round(min / 5) * 5;
      if (r < 5) r = 5;
      return '~' + r + ' min';
    }
    var medias = Math.round(min / 30); // número de medias horas
    var h = medias / 2;
    var txt = (h % 1 === 0) ? String(h) : (Math.floor(h) + ',5');
    return '~' + txt + ' h';
  }

  function tiempoLectura(courseId) {
    var m = META[courseId];
    if (!m) return '';
    return 'Lectura ' + fmtLectura(m.lecturaMin);
  }

  function lecturaTotalEspMin(slug) {
    var esp = ESPECIALIZACIONES[slug];
    if (!esp) return 0;
    var total = 0;
    for (var i = 0; i < esp.cursos.length; i++) {
      var m = META[esp.cursos[i]];
      if (m) total += m.lecturaMin;
    }
    return total;
  }

  function lecturaTotalEsp(slug) {
    return fmtLectura(lecturaTotalEspMin(slug)) + ' de lectura';
  }

  // Nivel general: el más alto entre los cursos de la especialización
  function nivelGeneralEsp(slug) {
    var esp = ESPECIALIZACIONES[slug];
    if (!esp) return 'Básico';
    var rank = { 'Básico': 1, 'Intermedio': 2, 'Avanzado': 3 };
    var maxRank = 0, maxNivel = 'Básico';
    for (var i = 0; i < esp.cursos.length; i++) {
      var m = META[esp.cursos[i]];
      if (m && rank[m.nivel] > maxRank) {
        maxRank = rank[m.nivel];
        maxNivel = m.nivel;
      }
    }
    return maxNivel;
  }

  function nombreCurso(courseId) {
    if (window.exoCertificado && window.exoCertificado.COURSES && window.exoCertificado.COURSES[courseId]) {
      return window.exoCertificado.COURSES[courseId].name;
    }
    return courseId;
  }

  function nivelColor(n) {
    return { 'Básico':'#16A34A', 'Intermedio':'#D97706', 'Avanzado':'#DC2626' }[n] || '#6B7280';
  }
  function nivelBg(n) {
    return { 'Básico':'#F0FDF4', 'Intermedio':'#FFFBEB', 'Avanzado':'#FEF2F2' }[n] || '#F3F4F6';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderInline(courseId) {
    var m = META[courseId];
    if (!m) return '';
    var html =
      '<div class="curso-meta-panel" style="display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center;margin:14px 0 6px;font-family:Outfit,DM Sans,sans-serif">' +
        '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:' + nivelBg(m.nivel) + ';color:' + nivelColor(m.nivel) + ';border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase">' +
          '<span style="width:6px;height:6px;background:' + nivelColor(m.nivel) + ';border-radius:50%"></span>' + m.nivel +
        '</span>' +
        '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#F3F4F6;color:#374151;border-radius:100px;font-size:.72rem;font-weight:600" title="Tiempo estimado de lectura del contenido. La práctica con la herramienta es adicional.">' +
          '📖 ' + tiempoLectura(courseId) +
        '</span>';
    if (m.prereq) {
      var prereqName = nombreCurso(m.prereq);
      html += '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#EFF6FF;color:#1D4ED8;border-radius:100px;font-size:.72rem;font-weight:600">' +
                '↩ Pre-requisito: ' + escapeHtml(prereqName) +
              '</span>';
    }
    html += '</div>';
    return html;
  }

  function autoRender() {
    var hosts = document.querySelectorAll('[data-curso-meta]');
    for (var i = 0; i < hosts.length; i++) {
      var courseId = hosts[i].getAttribute('data-curso-meta');
      hosts[i].innerHTML = renderInline(courseId);
    }
  }

  // ─── Siguiente curso de la misma especialización (si existe) ───
  function siguienteCurso(courseId) {
    var m = META[courseId];
    if (!m || !m.esp) return null;
    var esp = ESPECIALIZACIONES[m.esp];
    if (!esp) return null;
    var idx = esp.cursos.indexOf(courseId);
    if (idx < 0 || idx >= esp.cursos.length - 1) return null;
    var nextId = esp.cursos[idx + 1];
    return { id: nextId, nombre: nombreCurso(nextId), esp: m.esp, espNombre: esp.nombre };
  }

  // ─── Detecta el courseId del path actual (/escuela/<id>.html) ───
  function currentCourseId() {
    var path = (window.location.pathname || '').toLowerCase();
    var m = path.match(/\/escuela\/([a-z0-9-]+)\.html?$/);
    return m ? m[1] : null;
  }

  // ─── Reemplaza el botón final "Volver a la Escuela" por el siguiente curso ───
  function autoNextCourse() {
    var courseId = currentCourseId();
    if (!courseId || !META[courseId]) return;
    var next = siguienteCurso(courseId);
    var navs = document.querySelectorAll('.mod-nav');
    if (!navs.length) return;
    var lastNav = navs[navs.length - 1];
    var nextBtn = lastNav.querySelector('a.next');
    if (!nextBtn) return;
    var href = nextBtn.getAttribute('href') || '';
    // Solo si el botón final apunta a escuela.html (= "Volver a la Escuela")
    if (!/(^|\/)\.?\.?\/?escuela\.html(\?|#|$)/i.test(href)) return;

    if (next) {
      nextBtn.setAttribute('href', next.id + '.html');
      nextBtn.removeAttribute('style');
      nextBtn.removeAttribute('onclick');
      nextBtn.textContent = 'Siguiente curso: ' + next.nombre + ' →';
      // Link secundario "o volver a la Escuela"
      if (!lastNav.parentNode.querySelector('.exo-volver-escuela')) {
        var p = document.createElement('p');
        p.className = 'exo-volver-escuela';
        p.style.cssText = 'text-align:center;margin:10px 0 0;font-size:.85rem';
        p.innerHTML = '<a href="../escuela.html" style="color:#6B7280;text-decoration:underline">o volver a la Escuela</a>';
        lastNav.parentNode.insertBefore(p, lastNav.nextSibling);
      }
    }
  }

  // Expose
  window.exoCursoMeta = {
    META: META,
    ESPECIALIZACIONES: ESPECIALIZACIONES,
    get: get,
    getEsp: getEsp,
    cursosDeEsp: cursosDeEsp,
    tiempoLectura: tiempoLectura,
    fmtLectura: fmtLectura,
    lecturaTotalEspMin: lecturaTotalEspMin,
    lecturaTotalEsp: lecturaTotalEsp,
    nivelGeneralEsp: nivelGeneralEsp,
    nombreCurso: nombreCurso,
    renderInline: renderInline,
    siguienteCurso: siguienteCurso,
    currentCourseId: currentCourseId
  };

  function bootstrap() {
    autoRender();
    autoNextCourse();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
