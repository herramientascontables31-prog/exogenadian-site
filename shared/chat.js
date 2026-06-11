/* ═══ ExógenaDIAN — Exa Chat Widget v2 ═══
   Uso:
     <link rel="stylesheet" href="shared/chat.css">
     <script src="shared/chat.js"></script>

   Config (opcional, antes del script):
     window.EXA_CONFIG = { apiUrl: 'https://tu-backend.com' };

   v2: Chat contextual — Exa sabe en qué página estás,
       ofrece ayuda específica y sugiere acciones relevantes.
*/
(function () {
  'use strict';

  var WA = 'https://wa.me/573054559574';
  var BASE = 'https://exogenadian.com';

  // ─── Config ───
  var CFG = Object.assign({
    apiUrl: 'https://dian-proxy-337146111457.southamerica-east1.run.app',
    maxHistory: 10,
    storageKey: 'exa_chat_history',
    whatsapp: WA,
  }, window.EXA_CONFIG || {});

  // ═══════════════════════════════════════════════════════════════
  //  CONTEXTO DE PÁGINA — Exa sabe dónde estás
  // ═══════════════════════════════════════════════════════════════

  var PAGE_CONTEXT = {
    'index': {
      id: 'inicio',
      name: 'Inicio',
      greeting: 'Hola, soy **Exa** — tu asistente contable con IA. Cuéntame qué necesitas hacer y te llevo a la herramienta exacta.',
      suggestions: [
        '¿Cómo genero la exógena?',
        '¿Qué herramientas son gratis?',
        '¿Cuándo vence la exógena?',
        '¿Qué incluye PRO?'
      ],
      placeholder: 'Cuéntame qué necesitas hacer...'
    },
    'exogena': {
      id: 'exogena',
      name: 'Exógena DIAN',
      greeting: 'Estás en el **generador de exógena**. Te puedo ayudar con la carga de tu balance, clasificación de cuentas o cualquier duda sobre los formatos F1001-F2276.',
      suggestions: [
        '¿Qué formato necesito para mi balance?',
        '¿Cómo clasifico gastos de representación?',
        'Error en el NIT de un tercero',
        '¿Qué cuentas van en F1001?'
      ],
      placeholder: 'Pregunta sobre exógena, formatos, clasificación...'
    },
    'iva300': {
      id: 'iva300',
      name: 'Formulario 300 IVA',
      greeting: 'Estás en el **formulario 300 de IVA**. Te ayudo con la clasificación de IVA descontable/generado, tarifas o cualquier casilla del formulario.',
      suggestions: [
        '¿Qué tarifa de IVA aplica a...?',
        '¿Cómo funciona el IVA proporcional?',
        '¿Cuándo soy bimestral vs cuatrimestral?',
        'IVA en servicios del exterior'
      ],
      placeholder: 'Pregunta sobre IVA, tarifas, casillas...'
    },
    'retencion350': {
      id: 'retencion350',
      name: 'Retención 350',
      greeting: 'Estás en el **formulario 350 de retención**. Te ayudo con bases, tarifas de retención o la clasificación de conceptos.',
      suggestions: [
        '¿Cuál es la base para servicios?',
        'Retención a no declarantes',
        '¿Cuándo aplica autorretención?',
        'Tarifa de honorarios personas naturales'
      ],
      placeholder: 'Pregunta sobre retención, bases, tarifas...'
    },
    'renta110': {
      id: 'renta110',
      name: 'Renta 110',
      greeting: 'Estás en la **declaración de renta (F110)**. Te ayudo con rentas exentas, deducciones, depreciación fiscal o cálculo del impuesto.',
      suggestions: [
        '¿Qué gastos son deducibles?',
        'Límite de rentas exentas PN',
        '¿Cómo funciona la depreciación fiscal?',
        'Tasa mínima de tributación 15%'
      ],
      placeholder: 'Pregunta sobre renta, deducciones, impuesto...'
    },
    'estadosfinancieros': {
      id: 'estadosfinancieros',
      name: 'Estados Financieros NIIF',
      greeting: 'Estás en los **estados financieros NIIF**. Te ayudo con clasificación de cuentas, revelaciones, políticas contables o el flujo de efectivo.',
      suggestions: [
        '¿Qué revelaciones son obligatorias?',
        '¿Cómo clasifico un leasing?',
        'Método indirecto del flujo de efectivo',
        'Políticas contables para PYMES'
      ],
      placeholder: 'Pregunta sobre NIIF, revelaciones, estados...'
    },
    'conciliacion': {
      id: 'conciliacion',
      name: 'Conciliación Bancaria',
      greeting: 'Estás en la **conciliación bancaria**. Te ayudo a identificar partidas conciliatorias o diferencias entre tu contabilidad y el extracto.',
      suggestions: [
        '¿Cómo trato cheques pendientes?',
        'Notas débito/crédito no registradas',
        '¿Cada cuánto conciliar?',
        'Diferencias en GMF'
      ],
      placeholder: 'Pregunta sobre conciliación, partidas...'
    },
    'consultanit': {
      id: 'consultanit',
      name: 'Consulta NIT',
      greeting: 'Estás en **consulta NIT**. Te ayudo a verificar información de terceros, razón social, DV o estado del RUT.',
      suggestions: [
        '¿Cómo calculo el dígito de verificación?',
        '¿Qué es un autorretenedor?',
        '¿Cómo verifico un gran contribuyente?',
        'NIT de proveedores ficticios'
      ],
      placeholder: 'Pregunta sobre NIT, RUT, verificación...'
    },
    'vencimientos': {
      id: 'vencimientos',
      name: 'Calendario Tributario',
      greeting: 'Estás en el **calendario de vencimientos 2026**. Te ayudo con fechas específicas según tu tipo de contribuyente y último dígito del NIT.',
      suggestions: [
        '¿Cuándo vence mi exógena?',
        'Vencimiento renta personas naturales',
        '¿Cuándo presento el IVA bimestral?',
        'Fechas de retención mensual'
      ],
      placeholder: 'Pregunta sobre vencimientos, plazos, fechas...'
    },
    'sanciones': {
      id: 'sanciones',
      name: 'Sanciones Exógena',
      greeting: 'Estás en **sanciones por exógena** (Art. 651 ET). Te ayudo a calcular multas, revisar reducciones o entender la gradualidad.',
      suggestions: [
        '¿Cuánto es la multa por no presentar?',
        'Reducción de sanciones Art. 640',
        '¿Puedo corregir sin sanción?',
        'Sanción mínima 2026'
      ],
      placeholder: 'Pregunta sobre sanciones, multas, reducción...'
    },
    'sanciones-dian': {
      id: 'sanciones-dian',
      name: 'Sanciones DIAN',
      greeting: 'Estás en **sanciones DIAN**. Te ayudo con extemporaneidad, inexactitud, correcciones o reducción de sanciones según Art. 640 ET.',
      suggestions: [
        'Sanción por extemporaneidad',
        '¿Cómo funciona el Art. 640?',
        'Sanción por corrección voluntaria',
        'Sanción por inexactitud'
      ],
      placeholder: 'Pregunta sobre sanciones, correcciones...'
    },
    'intereses': {
      id: 'intereses',
      name: 'Intereses de Mora',
      greeting: 'Estás en el **calculador de intereses de mora**. Te ayudo con las tasas vigentes, períodos de cálculo o facilidades de pago.',
      suggestions: [
        '¿Cuál es la tasa de mora actual?',
        '¿Se pagan intereses sobre sanciones?',
        'Art. 634-635 ET',
        'Facilidades de pago DIAN'
      ],
      placeholder: 'Pregunta sobre intereses, mora, tasas...'
    },
    'liquidador': {
      id: 'liquidador',
      name: 'Liquidador Laboral',
      greeting: 'Estás en el **liquidador laboral**. Te ayudo con prestaciones, indemnización, seguridad social o cualquier cálculo laboral.',
      suggestions: [
        '¿Cómo liquido las cesantías?',
        'Indemnización por despido sin justa causa',
        '¿Cuándo pago prima de servicios?',
        'Dotación: ¿quién tiene derecho?'
      ],
      placeholder: 'Pregunta sobre liquidación, prestaciones...'
    },
    'ia': {
      id: 'ia',
      name: 'Herramientas IA',
      greeting: 'Bienvenido a las **herramientas de IA**. Tenemos auditor de balance, chat ET, asistente contable, respuesta a requerimiento, resumen de declaración y detector de errores XML. ¿Cuál necesitas?',
      suggestions: [
        '¿Qué hace el auditor de balance?',
        'Quiero consultar el Estatuto Tributario',
        '¿Cómo respondo un requerimiento DIAN?',
        '¿Cuántas consultas tengo gratis?'
      ],
      placeholder: 'Pregunta sobre las herramientas de IA...'
    },
    'ia-chat-et': {
      id: 'ia-chat-et',
      name: 'Chat ET',
      greeting: 'Estás en el **Chat con el Estatuto Tributario**. Pregúntame por artículos del ET, conceptos DIAN, DUR 1625/2016 o jurisprudencia del Consejo de Estado.',
      suggestions: [
        '¿Qué dice el Art. 107 ET?',
        'Concepto DIAN sobre dependientes',
        'Bancarización 100 UVT',
        'Sentencias sobre exógena errónea'
      ],
      placeholder: 'Cita un artículo o pregunta sobre el ET...'
    },
    'precios': {
      id: 'precios',
      name: 'Precios',
      greeting: 'Estás en la página de **precios**. Te ayudo a entender qué incluye cada plan y cuál te conviene según tu volumen de trabajo.',
      suggestions: [
        '¿Qué incluye el plan gratis?',
        '¿Puedo cancelar en cualquier momento?',
        '¿El pago es seguro?',
        '¿Qué diferencia hay entre mensual y anual?'
      ],
      placeholder: 'Pregunta sobre planes, precios, pagos...'
    },
    'formato2516': {
      id: 'formato2516',
      name: 'F2516 Conciliación Fiscal',
      greeting: 'Estás en el **Formato 2516 (Conciliación Fiscal)**. Te ayudo con la conciliación entre la utilidad contable y la fiscal, partidas reconciliatorias y obligados a presentar.',
      suggestions: [
        '¿Quién está obligado al F2516?',
        'Diferencias contables vs fiscales',
        '¿Cómo manejo el Art. 28 ET?',
        'Plazos para presentar el F2516'
      ],
      placeholder: 'Pregunta sobre F2516, conciliación fiscal...'
    },
    'patrimonio420': {
      id: 'patrimonio420',
      name: 'Patrimonio F420',
      greeting: 'Estás en el **Impuesto al Patrimonio (F420)**. Te ayudo con base gravable, tarifas progresivas, exclusiones y plazos.',
      suggestions: [
        '¿Quién declara patrimonio en 2026?',
        'Tarifa para patrimonio > 239.000 UVT',
        '¿Qué bienes se excluyen?',
        '¿Cómo valoro inmuebles?'
      ],
      placeholder: 'Pregunta sobre patrimonio, F420...'
    },
    'regimen-simple': {
      id: 'regimen-simple',
      name: 'Régimen Simple (RST)',
      greeting: 'Estás en **Régimen Simple de Tributación**. Te ayudo con tarifas por grupo, anticipos bimestrales (F2593), declaración anual (F260) o el simulador Simple vs Ordinario.',
      suggestions: [
        '¿Me conviene el RST?',
        'Tarifas por grupo de actividad',
        '¿Cómo pago el anticipo F2593?',
        'Topes para inscribirse al RST'
      ],
      placeholder: 'Pregunta sobre RST, F2593, F260...'
    },
    'formato2593': {
      id: 'formato2593',
      name: 'F2593 Anticipo RST',
      greeting: 'Estás en el **Formato 2593 (anticipo bimestral del Régimen Simple)**. Te ayudo con el cálculo del anticipo, ingresos brutos y la liquidación.',
      suggestions: [
        '¿Cómo calculo el anticipo?',
        'Vencimientos F2593 2026',
        'Diferencia entre RST y ordinario',
        '¿Qué INC va al F2593?'
      ],
      placeholder: 'Pregunta sobre F2593, anticipo RST...'
    },
    'renta-personas-naturales': {
      id: 'renta-pn',
      name: 'Renta Personas Naturales',
      greeting: 'Estás en **Renta de Personas Naturales (F210)**. Tenemos 3 modos: réplica DIAN, express, profesional. Te ayudo con cédulas, deducciones, dependientes o la tabla del Art. 241.',
      suggestions: [
        '¿Cuál modo de F210 me conviene?',
        'Deducciones por dependientes',
        'Cédula general vs pensiones',
        '¿A qué tabla aplico? Art. 241'
      ],
      placeholder: 'Pregunta sobre renta PN, F210, cédulas...'
    },
    'formato210': {
      id: 'formato210',
      name: 'Formato 210 (Renta PN)',
      greeting: 'Estás en el **Formato 210**. Te ayudo con el llenado réplica, los renglones por cédula y la depuración del impuesto a cargo.',
      suggestions: [
        '¿Qué va en el renglón 32?',
        'Diferencia entre renta exenta y deducción',
        'Aportes voluntarios AFC y FPV',
        '¿Cómo declaro arriendos?'
      ],
      placeholder: 'Pregunta sobre F210, renglones, depuración...'
    },
    'crear-sas': {
      id: 'crear-sas',
      name: 'Crear S.A.S.',
      greeting: 'Estás en el **wizard para crear una S.A.S.** (Ley 1258/2008). Genero estatutos completos y cartas de aceptación. ¿En qué te ayudo?',
      suggestions: [
        '¿Qué necesito para crear una SAS?',
        'Diferencia entre SAS y LTDA',
        '¿Cuánto cuesta el registro mercantil?',
        '¿Necesito revisor fiscal?'
      ],
      placeholder: 'Pregunta sobre SAS, estatutos, constitución...'
    },
    'certificado': {
      id: 'certificado',
      name: 'Certificaciones Contables',
      greeting: 'Estás en las **certificaciones contables**. Tenemos 18 modelos: cuenta de cobro, ingresos PN, no obligación renta, EEFF Art. 37, capital SAS, RUP, dependientes, aportes SS, donaciones y más.',
      suggestions: [
        '¿Qué certificado necesito para un crédito?',
        'Certificado de no obligación renta',
        '¿Cómo justifico costos del Art. 771-2?',
        'Modelo de aceptación NIA 210'
      ],
      placeholder: 'Pregunta sobre certificaciones, modelos...'
    },
    'estatutos': {
      id: 'estatutos',
      name: 'Estatutos Municipales (ICA)',
      greeting: 'Estás en **Estatutos Municipales**. Te ayudo a encontrar la tarifa de ICA por municipio y actividad CIIU.',
      suggestions: [
        'Tarifa ICA Medellín comercio',
        'ICA Bogotá actividad financiera',
        'ICA Cali servicios',
        '¿Qué es el ReteICA?'
      ],
      placeholder: 'Pregunta sobre ICA, tarifas municipales...'
    },
    'finanzas': {
      id: 'finanzas',
      name: 'Finanzas Personales',
      greeting: 'Estás en **Finanzas Personales**. Tenemos calculadoras de salario neto, presupuesto, salud financiera, fondo de emergencia, FIRE, hipoteca, deudas y más.',
      suggestions: [
        '¿Cuánto necesito para mi fondo de emergencia?',
        '¿Cómo armo un presupuesto personal?',
        '¿Qué es FIRE y me conviene?',
        '¿Cómo salgo de deudas?'
      ],
      placeholder: 'Pregunta sobre finanzas personales...'
    },
    'salud-financiera': {
      id: 'salud-financiera',
      name: 'Salud Financiera',
      greeting: 'Estás en el **diagnóstico de salud financiera**. Te ayudo a interpretar tus indicadores: ahorro, deuda/ingreso, fondo de emergencia, libertad financiera.',
      suggestions: [
        '¿Cuál es un buen ratio de ahorro?',
        '¿Cuánta deuda es saludable?',
        '¿Cómo mejoro mi puntaje?',
        'Indicadores de libertad financiera'
      ],
      placeholder: 'Pregunta sobre salud financiera, indicadores...'
    },
    'deudas': {
      id: 'deudas',
      name: 'Auditor de Deudas',
      greeting: 'Estás en el **auditor de deudas**. Te ayudo con estrategias para salir de deudas: avalancha, bola de nieve, refinanciación.',
      suggestions: [
        'Avalancha vs bola de nieve',
        '¿Refinanciar o pagar la más cara?',
        '¿Cuándo declarar insolvencia?',
        '¿Negocio con la entidad financiera?'
      ],
      placeholder: 'Pregunta sobre deudas, estrategias de pago...'
    },
    'salario-neto': {
      id: 'salario-neto',
      name: 'Salario Neto',
      greeting: 'Estás en el **calculador de salario neto**. Te ayudo con descuentos: salud, pensión, retefuente, FSP, dependientes y deducciones.',
      suggestions: [
        '¿Cuánto me queda de un salario de $5M?',
        '¿Cómo bajo mi retención en la fuente?',
        'Aportes voluntarios y AFC',
        'Deducción por dependientes'
      ],
      placeholder: 'Pregunta sobre salario neto, retención...'
    },
    'liquidador-pension': {
      id: 'liquidador-pension',
      name: 'Liquidador Pensión',
      greeting: 'Estás en el **liquidador de pensión** (Ley 797 + Reforma 2381). Sube tu HLM de Colpensiones para autollenar, o ingresa los datos manualmente.',
      suggestions: [
        '¿Cuántas semanas necesito para pensionarme?',
        'IBL vs IBC',
        '¿Mejor Colpensiones o AFP?',
        '¿Qué cambia con la Reforma 2381?'
      ],
      placeholder: 'Pregunta sobre pensión, HLM, semanas...'
    },
    'nomina-masiva': {
      id: 'nomina-masiva',
      name: 'Liquidador de Nómina',
      greeting: 'Estás en el **liquidador de nómina por Excel**. Sube tu plantilla y obtén Excel + desprendibles de pago para todos los empleados.',
      suggestions: [
        '¿Qué formato de Excel acepta?',
        '¿Calcula horas extras y recargos?',
        '¿Genera desprendibles individuales?',
        '¿Es gratis usarlo?'
      ],
      placeholder: 'Pregunta sobre nómina masiva, Excel...'
    },
    'comparador-laboral-prestacion': {
      id: 'comparador-laboral',
      name: 'Comparador Laboral vs Prestación',
      greeting: 'Estás en el **comparador entre contrato laboral y prestación de servicios**. Te ayudo a decidir cuál te conviene contractual y tributariamente.',
      suggestions: [
        '¿Cuál me sale más a mí como empresa?',
        '¿Qué prefiere el trabajador?',
        '¿Riesgos de simular contrato laboral?',
        'Costos ocultos del contrato laboral'
      ],
      placeholder: 'Pregunta sobre laboral vs prestación...'
    },
    'dashboard': {
      id: 'dashboard',
      name: 'Panel Financiero',
      greeting: 'Estás en el **panel financiero**. Te ayudo con ratios, gráficos, análisis de tu balance y P&G.',
      suggestions: [
        '¿Cómo interpreto mi ratio de liquidez?',
        '¿Mi rentabilidad está bien?',
        '¿Qué KPIs son más importantes?',
        'Punto de equilibrio'
      ],
      placeholder: 'Pregunta sobre dashboard, ratios, KPIs...'
    },
    'escuela': {
      id: 'escuela',
      name: 'Escuela Contable IA',
      greeting: 'Estás en la **Escuela Contable IA**. 17 cursos completos, 217 módulos: exógena, exógena con Claude, IVA, retenciones, renta F110, renta PN F210, RST, NIIF, nómina, ICA, sanciones, finanzas, IA para contadores y más. Todo gratis.',
      suggestions: [
        '¿Por dónde empiezo?',
        '¿Hay certificado al terminar?',
        'Curso de IA para contadores',
        'Curso de finanzas personales'
      ],
      placeholder: 'Pregunta sobre la escuela, cursos...'
    },
    'decreto240': {
      id: 'decreto240',
      name: 'Decreto 240 (Intereses)',
      greeting: 'Estás en el **Decreto 0240/2026** (tasa de interés moratorio DIAN). Te ayudo con la tasa vigente y el cálculo día a día.',
      suggestions: [
        '¿Cuál es la tasa actual?',
        '¿Cómo se calculan los intereses?',
        '¿Aplican intereses sobre sanciones?',
        'Facilidades de pago Art. 814 ET'
      ],
      placeholder: 'Pregunta sobre Decreto 240, tasa mora...'
    },
    'uvt': {
      id: 'uvt',
      name: 'UVT',
      greeting: 'Estás en la **tabla de UVT**. UVT 2026 = $52.374. Te ayudo a convertir cualquier valor en UVT o pesos según el año.',
      suggestions: [
        'Convertir 1.000 UVT 2026 a pesos',
        '¿Cuánto vale el UVT por año?',
        'UVT para sanción mínima',
        '¿Cómo se calcula el UVT?'
      ],
      placeholder: 'Pregunta sobre UVT, conversiones...'
    },
    'prompts': {
      id: 'prompts',
      name: 'Prompts Contables',
      greeting: 'Estás en la **biblioteca de prompts contables** para usar con ChatGPT, Claude o Gemini. ¿Buscas alguno en particular?',
      suggestions: [
        'Prompt para clasificar gastos',
        'Prompt para responder requerimiento',
        'Prompt para auditoría',
        '¿Cómo uso estos prompts?'
      ],
      placeholder: 'Pregunta sobre prompts, IA contable...'
    }
  };

  // Detectar página actual
  function detectPage() {
    var path = location.pathname.replace(/^\/|\.html$/g, '').replace(/\/+$/, '') || 'index';
    // Limpiar /docs/ prefix si existe
    path = path.replace(/^docs\//, '');
    // Buscar coincidencia exacta
    if (PAGE_CONTEXT[path]) return PAGE_CONTEXT[path];
    // Subdirectorio (escuela/iva300 → escuela)
    var dir = path.split('/')[0];
    if (PAGE_CONTEXT[dir]) return PAGE_CONTEXT[dir];
    // Prefijo por guion (ia-analisis-balance → ia, certificado-cuenta-cobro → certificado)
    var prefix = path.split('-')[0];
    if (PAGE_CONTEXT[prefix]) return PAGE_CONTEXT[prefix];
    // Fallback al contexto de inicio
    return PAGE_CONTEXT['index'];
  }

  var currentPage = null;
  var isPro = false; // Se actualiza al init con exoPro.check()

  // ─── State ───
  var isOpen = false;
  var isStreaming = false;
  var messages = [];
  var abortCtrl = null;

  // ─── Minimal markdown → HTML ───
  function md(text) {
    if (!text) return '';
    var html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, label, url) {
        if (/^https?:\/\/|^\//.test(url)) return '<a href="' + url + '" target="_blank" rel="noopener">' + label + '</a>';
        return label;
      })
      .replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    html = html.replace(/((?:<li>.*?<\/li>(?:<br>)?)+)/g, '<ul>$1</ul>');
    html = html.replace(/<br><\/ul>/g, '</ul>').replace(/<ul><br>/g, '<ul>');
    return '<p>' + html + '</p>';
  }

  // ─── Load/save/clear history ───
  function loadHistory() {
    try {
      var data = localStorage.getItem(CFG.storageKey);
      if (data) {
        var parsed = JSON.parse(data);
        messages = parsed.filter(function (m) {
          return m && (m.role === 'user' || m.role === 'assistant')
            && typeof m.content === 'string' && m.content.length > 0 && m.content.length <= 4000;
        });
      }
    } catch (e) {
      messages = [];
      localStorage.removeItem(CFG.storageKey);
    }
  }
  function saveHistory() {
    try {
      localStorage.setItem(CFG.storageKey, JSON.stringify(messages.slice(-20)));
    } catch (e) { /* ignore */ }
  }
  function clearHistory() {
    messages = [];
    localStorage.removeItem(CFG.storageKey);
    renderMessages();
  }

  // ─── DOM refs ───
  var panel, messagesEl, inputEl, sendBtn, proBanner;

  // ─── Build UI ───
  function init() {
    currentPage = detectPage();
    loadHistory();

    // Check PRO status — contextual features only for PRO.
    // Optimista: si hay email/clave guardado, asumir PRO YA (no esperar al
    // check async que puede tardar/fallar). El check confirma luego y solo
    // BAJA si el server dice EXPLÍCITAMENTE inválido.
    if (typeof exoPro !== 'undefined') {
      try { if (exoPro.getSaved && exoPro.getSaved()) isPro = true; } catch (e) {}
      if (exoPro.check) {
        exoPro.check().then(function (pro) {
          isPro = pro;
          if (messages.length === 0) renderMessages(); // refresca sugerencias según estado real
        });
      }
    }

    // Inject CSS if not already linked
    if (!document.querySelector('link[href*="chat.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      var isSubpage = location.pathname.split('/').filter(Boolean).length > 0
        && !location.pathname.endsWith('index.html')
        && !location.pathname.endsWith('/');
      link.href = (isSubpage ? '../' : '') + 'shared/chat.css';
      document.head.appendChild(link);
    }

    // FAB
    var fab = document.createElement('button');
    fab.className = 'exa-fab';
    fab.setAttribute('aria-label', 'Abrir asistente Exa');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    fab.onclick = togglePanel;

    // Panel
    panel = document.createElement('div');
    panel.className = 'exa-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat con Exa');
    panel.innerHTML =
      '<div class="exa-header">' +
        '<div class="exa-avatar">E</div>' +
        '<div class="exa-header-info">' +
          '<h3>Exa</h3>' +
          '<span>Asistente contable IA</span>' +
        '</div>' +
        '<button class="exa-clear" aria-label="Nueva conversación" title="Nueva conversación">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' +
        '</button>' +
        '<button class="exa-close" aria-label="Cerrar chat">&times;</button>' +
      '</div>' +
      '<div class="exa-messages"></div>' +
      '<div class="exa-pro-banner" style="display:none">' +
        '<div class="exa-pro-banner-txt">¿Ya pagaste PRO? Actívalo con el correo de tu compra:</div>' +
        '<div class="exa-pro-banner-row">' +
          '<input type="text" inputmode="email" class="exa-pro-email" placeholder="tucorreo@ejemplo.com" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="exa_pro_activacion">' +
          '<button class="exa-pro-activar" type="button">Activar</button>' +
        '</div>' +
        '<div class="exa-pro-banner-msg" style="display:none"></div>' +
        '<div class="exa-pro-banner-help">¿No lo has comprado? <a href="https://exogenadian.com/precios.html" target="_blank" rel="noopener">Ver planes PRO</a></div>' +
      '</div>' +
      '<div class="exa-input-area">' +
        '<textarea class="exa-input" placeholder="' + esc(currentPage.placeholder) + '" rows="1" maxlength="500"></textarea>' +
        '<button class="exa-send" aria-label="Enviar" disabled>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="exa-footer">Exa puede cometer errores · <a href="https://exogenadian.com" target="_blank" rel="noopener">exogenadian.com</a> · <a href="#" class="exa-disable-link" style="color:inherit;opacity:.7">Apagar Exa</a></div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    messagesEl = panel.querySelector('.exa-messages');
    inputEl = panel.querySelector('.exa-input');
    sendBtn = panel.querySelector('.exa-send');

    panel.querySelector('.exa-close').onclick = togglePanel;
    panel.querySelector('.exa-clear').onclick = clearHistory;
    var disableLink = panel.querySelector('.exa-disable-link');
    if(disableLink){
      disableLink.onclick = function(e){
        e.preventDefault();
        if(confirm('¿Apagar Exa en todas las páginas?\n\nPara reactivarlo: navega a cualquier URL del sitio agregando ?exa=on\nEjemplo: https://exogenadian.com/?exa=on')){
          disableExa();
        }
      };
    }
    sendBtn.onclick = sendMessage;
    inputEl.addEventListener('input', function () {
      sendBtn.disabled = !inputEl.value.trim() || isStreaming;
      autoResize();
    });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) togglePanel();
    });

    // ── Banner de activación PRO ──
    // Mucha gente paga la suscripción y luego escribe sin saber cómo activarla.
    // El banner aparece en el chat (presente en todas las páginas) si NO es PRO.
    proBanner = panel.querySelector('.exa-pro-banner');
    var proEmailEl = panel.querySelector('.exa-pro-email');
    var proActivarBtn = panel.querySelector('.exa-pro-activar');
    var proMsgEl = panel.querySelector('.exa-pro-banner-msg');
    function actualizarBannerPro(){
      if(!proBanner) return;
      proBanner.style.display = isPro ? 'none' : '';
    }
    function bannerMsg(txt, tipo){
      if(!proMsgEl) return;
      proMsgEl.style.display = '';
      proMsgEl.textContent = txt;
      proMsgEl.className = 'exa-pro-banner-msg exa-pro-msg-' + (tipo || 'info');
    }
    actualizarBannerPro();
    // Re-evaluar cuando llegue el check async de exoPro
    if (typeof exoPro !== 'undefined' && exoPro.check) {
      exoPro.check().then(function(pro){ isPro = pro; actualizarBannerPro(); });
    }
    // Validación directa contra el Apps Script — fallback si exoPro no cargó en
    // esta página. Replica lo que hace exoPro.activate pero independiente.
    function activarStandalone(val){
      var base = (typeof exoPro !== 'undefined' && exoPro.APPS_SCRIPT_URL) ? exoPro.APPS_SCRIPT_URL : '';
      if(!base) return Promise.reject(new Error('sin endpoint'));
      var url = base + '?action=validateEmail&email=' + encodeURIComponent(val);
      return fetch(url).then(function(r){ return r.json(); }).then(function(d){
        if(d && d.valid){
          try{ localStorage.setItem('exogenadian_pro_email', val);
                localStorage.setItem('exogenadian_pro_activated_at', String(Date.now())); }catch(e){}
          return true;
        }
        return false;
      });
    }
    function activarDesdeBanner(){
      var val = (proEmailEl.value || '').trim().toLowerCase();
      if(!val){ proEmailEl.focus(); bannerMsg('Escribe el correo con el que pagaste.', 'err'); return; }
      if(val.indexOf('@') < 0){ bannerMsg('Eso no parece un correo. Revisa e intenta de nuevo.', 'err'); return; }
      proActivarBtn.disabled = true;
      proActivarBtn.textContent = 'Verificando…';
      bannerMsg('Verificando tu suscripción…', 'info');
      var p = (typeof exoPro !== 'undefined' && exoPro.activate)
        ? exoPro.activate(val)
        : activarStandalone(val);
      p.then(function(valid){
        if(valid){
          isPro = true;
          actualizarBannerPro();
          bannerMsg('✅ ¡PRO activado! Recarga la página para usarlo en toda la herramienta.', 'ok');
          addBubble('assistant', '✅ ¡PRO activado correctamente! Ya puedes descargar los Excel/Word, usar la IA sin límite y todas las funciones PRO. **Recarga la página** (Ctrl+Shift+R) para que se aplique en toda la herramienta.');
        } else {
          bannerMsg('No encontré PRO activo para ese correo.', 'err');
          addBubble('assistant', 'No encontré una suscripción PRO activa para **' + esc(val) + '**.\n\n• Verifica que sea el mismo correo con el que pagaste.\n• Si acabas de pagar, espera unos minutos y reintenta.\n• ¿Sigues con problemas? Escribe a **soporte@exogenadian.com** con tu comprobante.');
        }
      }).catch(function(){
        bannerMsg('Error al verificar. Revisa tu conexión.', 'err');
        addBubble('assistant', 'Hubo un error al verificar la suscripción. Revisa tu conexión e intenta de nuevo, o escribe a **soporte@exogenadian.com** con tu comprobante de pago.');
      }).finally(function(){
        proActivarBtn.disabled = false;
        proActivarBtn.textContent = 'Activar';
      });
    }
    if(proActivarBtn) proActivarBtn.onclick = activarDesdeBanner;
    if(proEmailEl) proEmailEl.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ e.preventDefault(); activarDesdeBanner(); }
    });

    renderMessages();
  }

  // Detecta si el mensaje del usuario es una pregunta sobre activar/usar PRO.
  // Responde localmente (sin gastar la API) y resalta el banner de activación.
  function intentaResponderPro(text){
    var t = (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var esProPregunta =
      /(como|donde|no se|ayuda).*(activ|habilit).*(pro|suscrip|cuenta|premium)/.test(t) ||
      /(activ|habilit).*(pro|suscrip|premium)/.test(t) ||
      /(ya|recien) (pague|pagre|compre|me suscrib|suscribi)/.test(t) ||
      /(soy|somos) pro\b/.test(t) ||
      /(no me|sin) (funciona|sirve|deja|aparece).*(pro|descarg|excel|word)/.test(t) ||
      /pague.*(no|sin).*(funciona|activ|aparec|descarg)/.test(t) ||
      /como (uso|ingreso|entro|accedo).*(pro|premium|suscrip)/.test(t) ||
      /\bclave pro\b|\bcorreo pro\b|\bemail pro\b/.test(t);
    if(!esProPregunta) return false;
    if(isPro){
      addBubble('assistant', 'Tu cuenta ya está **activada como PRO** en este dispositivo ✅. Si una descarga no funciona, recarga la página (Ctrl+Shift+R). ¿Sigues con problemas? Escribe a soporte@exogenadian.com.');
      return true;
    }
    addBubble('assistant',
      'Para activar PRO solo necesitas el **correo con el que pagaste** la suscripción:\n\n' +
      '1. Abre el recuadro **"¿Ya pagaste PRO?"** que está justo abajo de este chat.\n' +
      '2. Escribe tu correo y pulsa **Activar**.\n' +
      '3. Listo: se desbloquean las descargas Excel/Word, la IA sin límite y todo lo PRO.\n\n' +
      'Si todavía no compraste, mira los planes en **[exogenadian.com/precios](https://exogenadian.com/precios.html)**. ' +
      'Si pagaste y no activa, escribe a **soporte@exogenadian.com** con tu comprobante.');
    // Resaltar el banner para que el usuario lo vea
    if(proBanner){
      proBanner.style.display = '';
      proBanner.classList.add('exa-pro-banner-pulse');
      var em = proBanner.querySelector('.exa-pro-email');
      setTimeout(function(){
        try{ em && em.focus(); }catch(e){}
        proBanner.classList.remove('exa-pro-banner-pulse');
      }, 1600);
    }
    return true;
  }

  function autoResize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  }

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    document.querySelector('.exa-fab').classList.toggle('open', isOpen);
    if (isOpen) { inputEl.focus(); scrollToBottom(); }
  }

  function scrollToBottom() {
    requestAnimationFrame(function () { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  // ═══════════════════════════════════════════════════════════════
  //  SUGERENCIAS CONTEXTUALES — botones rápidos según la página
  // ═══════════════════════════════════════════════════════════════

  function renderSuggestions() {
    if (!currentPage.suggestions || !currentPage.suggestions.length) return;
    var wrap = document.createElement('div');
    wrap.className = 'exa-quick-wrap';
    var inner = document.createElement('div');
    inner.className = 'exa-quick';
    currentPage.suggestions.forEach(function (text) {
      var btn = document.createElement('button');
      btn.textContent = text;
      btn.onclick = function () {
        inputEl.value = text;
        sendMessage();
        // Quitar sugerencias después de usar una
        var allWraps = messagesEl.querySelectorAll('.exa-quick-wrap');
        allWraps.forEach(function (w) { w.remove(); });
      };
      inner.appendChild(btn);
    });
    wrap.appendChild(inner);
    messagesEl.appendChild(wrap);
  }

  var GENERIC_GREETING = 'Hola, soy **Exa** \u2014 tu asistente contable. Pregunta lo que necesites sobre normas tributarias, sanciones, vencimientos o herramientas del portal.';
  var GENERIC_PLACEHOLDER = 'Pregunta sobre impuestos, sanciones, ex\u00f3gena...';

  // ─── Render ───
  function renderMessages() {
    if (messages.length === 0) {
      messagesEl.innerHTML = '';
      var greet = document.createElement('div');
      greet.className = 'exa-msg assistant';
      // PRO: greeting contextual de la página. Free: greeting genérico.
      greet.innerHTML = md(isPro ? currentPage.greeting : GENERIC_GREETING);
      messagesEl.appendChild(greet);
      // Solo PRO ve sugerencias contextuales
      if (isPro) renderSuggestions();
      // Actualizar placeholder según PRO
      if (inputEl) inputEl.placeholder = isPro ? currentPage.placeholder : GENERIC_PLACEHOLDER;
      return;
    }

    messagesEl.innerHTML = '';
    messages.forEach(function (m) {
      var div = document.createElement('div');
      div.className = 'exa-msg ' + m.role;
      div.innerHTML = m.role === 'assistant' ? md(m.content) : esc(m.content);
      messagesEl.appendChild(div);
    });
    scrollToBottom();
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function addBubble(role, content) {
    var div = document.createElement('div');
    div.className = 'exa-msg ' + role;
    div.innerHTML = role === 'assistant' ? md(content) : esc(content);
    var w = messagesEl.querySelector('.exa-welcome');
    if (w) w.remove();
    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'exa-typing'; d.id = 'exa-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(d); scrollToBottom();
  }
  function hideTyping() {
    var el = document.getElementById('exa-typing');
    if (el) el.remove();
  }

  function showError(msg) {
    hideTyping();
    var lastBubble = messagesEl.querySelector('.exa-msg.assistant:last-child');
    if (!lastBubble) lastBubble = addBubble('assistant', '');
    lastBubble.innerHTML = '<em style="color:#F87171">' + esc(msg || 'Error inesperado.') + '</em>';
  }

  // ─── Send message ───
  async function sendMessage() {
    var text = (inputEl.value || '').trim();
    if (!text || isStreaming) return;

    isStreaming = true;
    sendBtn.disabled = true;
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Quitar sugerencias al enviar primer mensaje
    var allWraps = messagesEl.querySelectorAll('.exa-quick-wrap');
    allWraps.forEach(function (w) { w.remove(); });

    messages.push({ role: 'user', content: text });
    addBubble('user', text);

    // Pregunta frecuente: cómo activar PRO. Responder localmente (instantáneo,
    // sin gastar la API) y resaltar el banner de activación.
    if (intentaResponderPro(text)) {
      messages.push({ role: 'assistant', content: '(respuesta local: activación PRO)' });
      saveHistory();
      isStreaming = false;
      sendBtn.disabled = !inputEl.value.trim();
      return;
    }

    showTyping();

    var apiMessages = messages.slice(-CFG.maxHistory);

    var fullText = '';
    var isError = false;
    abortCtrl = new AbortController();

    try {
      var timeoutId = setTimeout(function () { if (abortCtrl) abortCtrl.abort(); }, 60000);
      var resp;
      try {
        // page_state: contexto rico de la página actual (estado del validador, paso actual, casillas).
        // Solo se envía si la página lo expone (formato2516.html y renta110.html lo definen).
        // Solo PRO recibe respuestas contextuales — el estado tampoco se envía si free, por privacidad.
        var pageState = null;
        if(isPro && typeof window.exoPageState === 'function'){
          try{ pageState = window.exoPageState(); }catch(e){ pageState = null; }
        }
        resp = await fetch(CFG.apiUrl + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            page: isPro ? currentPage.id : null,
            page_name: isPro ? currentPage.name : null,
            page_state: pageState,
          }),
          signal: abortCtrl.signal,
        });
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr && fetchErr.name === 'AbortError') {
          throw { _type: 'abort' };
        }
        throw { _type: 'network', message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.' };
      }
      clearTimeout(timeoutId);

      var contentType = (resp.headers.get('content-type') || '').toLowerCase();

      if (!resp.ok) {
        var errData = {};
        try { errData = await resp.json(); } catch (e) { /* body no era JSON */ }
        var errMsg = errData.error || 'Error del servidor (' + resp.status + ')';
        if (errData.whatsapp) errMsg += ' Escribenos por [WhatsApp](' + errData.whatsapp + ').';
        throw { _type: 'server', message: errMsg };
      }

      if (contentType.indexOf('application/json') !== -1) {
        var jsonResp = {};
        try { jsonResp = await resp.json(); } catch (e) { /* body corrupto */ }
        if (jsonResp.error) {
          var msg = jsonResp.error;
          if (jsonResp.whatsapp) msg += ' Escribenos por [WhatsApp](' + jsonResp.whatsapp + ').';
          throw { _type: 'server', message: msg };
        }
        throw { _type: 'server', message: 'Respuesta inesperada del servidor.' };
      }

      if (!resp.body || typeof resp.body.getReader !== 'function') {
        throw { _type: 'server', message: 'Tu navegador no soporta streaming. Actualiza tu navegador.' };
      }

      hideTyping();
      var bubble = addBubble('assistant', '');
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      try {
        while (true) {
          var result = await reader.read();
          if (result.done) break;

          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (!line.startsWith('data: ')) continue;
            var data;
            try { data = JSON.parse(line.slice(6)); } catch (e) { continue; }

            if (data.type === 'text' && data.text) {
              fullText += data.text;
              bubble.innerHTML = md(fullText);
              scrollToBottom();
            } else if (data.type === 'error') {
              throw { _type: 'stream', message: data.error || 'Error del asistente.' };
            } else if (data.type === 'done') {
              break;
            }
          }
        }
      } finally {
        try { reader.cancel(); } catch (e) { /* ya cerrado */ }
      }

      if (!fullText) {
        throw { _type: 'stream', message: 'El asistente no generó respuesta. Intenta de nuevo.' };
      }

    } catch (err) {
      isError = true;
      var errorText;

      if (err && err._type === 'abort') {
        errorText = '(Mensaje cancelado)';
      } else if (err && err._type === 'network') {
        errorText = err.message;
      } else if (err && err._type === 'server') {
        errorText = err.message;
      } else if (err && err._type === 'stream') {
        errorText = err.message;
      } else if (err && err.name === 'AbortError') {
        errorText = 'Tiempo de espera agotado. Intenta con una pregunta más corta.';
      } else if (err && err.message) {
        errorText = err.message;
      } else {
        errorText = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
      }

      if (!fullText) {
        showError(errorText);
      }
    }

    if (fullText && !isError) {
      messages.push({ role: 'assistant', content: fullText });
      saveHistory();
      verifyArticles(fullText, bubble);
    } else if (isError) {
      messages.pop();
      saveHistory();
    }

    isStreaming = false;
    sendBtn.disabled = !inputEl.value.trim();
    abortCtrl = null;
  }

  // ─── Verificación de artículos citados ───
  // Tras cada respuesta, los artículos del ET que cite se contrastan contra el
  // índice real (lookup determinista, sin IA ni rate limit). Badge ✓ si todos
  // existen; ⚠ si citó alguno que no está en el ET (posible alucinación).
  function verifyArticles(text, bubble) {
    if (!/(?:Art[íi]culo|Art)\.?\s*\d/i.test(text)) return; // no citó artículos
    fetch(CFG.apiUrl + '/api/ia/verificar-articulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: text.slice(0, 10000) })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.rag_disponible || !d.total_citados) return;
      var badge = document.createElement('div');
      badge.className = 'exa-verify';
      if (d.no_verificados === 0) {
        badge.innerHTML = '✓ ' + d.total_citados + ' artículo' + (d.total_citados !== 1 ? 's' : '') + ' del ET verificado' + (d.total_citados !== 1 ? 's' : '') + ' contra el texto oficial';
        badge.classList.add('ok');
      } else {
        var malos = (d.articulos || []).filter(function (a) { return !a.verificado; }).map(function (a) { return 'Art. ' + a.numero; }).join(', ');
        badge.innerHTML = '⚠ No pude verificar ' + malos + ' en el ET — confírmalo antes de usarlo';
        badge.classList.add('warn');
      }
      bubble.appendChild(badge);
      scrollToBottom();
    }).catch(function () { /* verificación es best-effort, nunca rompe el chat */ });
  }

  // ─── Toggle apagar/encender ───
  // El usuario puede apagar a Exa. Se guarda en localStorage. Para reactivar:
  // (a) abrir DevTools → localStorage.removeItem('exa_chat_disabled')
  // (b) navegar a cualquier URL con ?exa=on
  function isDisabled(){
    try{
      var p = new URLSearchParams(location.search);
      if(p.get('exa') === 'on'){ localStorage.removeItem('exa_chat_disabled'); return false; }
      return localStorage.getItem('exa_chat_disabled') === '1';
    }catch(e){ return false; }
  }
  function disableExa(){
    try{ localStorage.setItem('exa_chat_disabled','1'); }catch(e){}
    var fab = document.querySelector('.exa-fab');
    var pn = document.querySelector('.exa-panel');
    if(fab) fab.remove();
    if(pn) pn.remove();
  }

  // ─── API pública: window.exoChat ───
  // Permite que botones en otras páginas (ej: "🤖 Explicar este error") abran el chat
  // con un mensaje pre-llenado.
  window.exoChat = {
    open: function(){ if(!isOpen) togglePanel(); },
    askWithContext: function(text){
      if(!inputEl){ setTimeout(function(){ window.exoChat.askWithContext(text); }, 100); return; }
      if(!isOpen) togglePanel();
      inputEl.value = text;
      autoResize();
      sendMessage();
    },
    disable: disableExa
  };

  // ─── Init ───
  if (isDisabled()) {
    // Apagado: no inyectar nada
    return;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
