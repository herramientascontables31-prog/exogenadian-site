/**
 * ExogenaDIAN — Parser robusto reporte exógena DIAN para Persona Natural
 *
 * Refactor Corrección 2: detección semántica por contenido (no por nombres
 * exactos de cabecera). 3 niveles:
 *   N1 — autodetección con confianza > 90% (procesa automático)
 *   N2 — autodetección 70-90% (caller debe confirmar mapping con usuario)
 *   N3 — < 70% (caller debe presentar mapeador manual)
 *
 * Iteración por hojas: si workbook tiene múltiples hojas, el parser elige
 * la que tiene mejor score global (suma de confianzas por columna detectada).
 *
 * Detección flexible de fila de cabecera: busca primera fila con 4+ celdas
 * de texto sumando >30 chars no numéricos Y patrones consistentes en las 3
 * filas siguientes. NO se hardcodea fila 14.
 *
 * Skip de subtotales: filas donde NIT informante está vacío pero Valor está
 * lleno (estructura típica MUISCA). Skip silencioso, no warning.
 *
 * Output igual que antes — { metadata, registros, totales, warnings } —
 * más campos `nivelDeteccion` ('N1'|'N2'|'N3'|'falla'), `confianza` (0-100),
 * `mappingDetectado` (para que UI presente confirmación si N2/N3).
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.parserExogenaPN = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  //  MAPEO_USO_DIAN — fuente PRIMARIA de cédula sugerida
  //  Texto literal de columna "Uso declaración Sugerida" → cédula interna.
  // ──────────────────────────────────────────────────────────────────────────
  var MAPEO_USO_DIAN = {
    'rentas de trabajo':                            'trabajo',
    'rentas de trabajo en relacion laboral':        'trabajo',
    'salarios':                                     'trabajo',
    'rentas de honorarios':                         'honorarios',
    'rentas de honorarios y compensacion':          'honorarios',
    'honorarios y servicios':                       'honorarios',
    'rentas de servicios':                          'honorarios',
    'rentas de capital':                            'capital',
    'capital - intereses':                          'capital',
    'capital - arrendamientos':                     'capital',
    'rentas no laborales':                          'noLaboral',
    'no laborales':                                 'noLaboral',
    'rentas de pensiones':                          'pensiones',
    'pensiones':                                    'pensiones',
    'dividendos y participaciones no gravados':     'dividendos_no_grav',
    'dividendos no gravados':                       'dividendos_no_grav',
    'dividendos y participaciones gravados':        'dividendos_grav',
    'dividendos gravados':                          'dividendos_grav',
    'dividendos':                                   'dividendos_no_grav',
    'ganancias ocasionales':                        'gananciasOcasionales',
    'ganancia ocasional':                           'gananciasOcasionales',
    'ingresos no constitutivos de renta':           'incrngo',
    'aportes obligatorios salud':                   'incrngo_salud',
    'aportes obligatorios pension':                 'incrngo_pension',
    'aportes voluntarios afc':                      'deduccion_avc',
    'aportes a fondos pension voluntaria':          'deduccion_avc',
    'avc - cuenta ahorro fomento construccion':     'deduccion_avc',
    'intereses credito vivienda':                   'deduccion_vivienda',
    'salud prepagada':                              'deduccion_salud_prepag'
  };

  // ──────────────────────────────────────────────────────────────────────────
  //  MAPEO_RENGLON_CEDULA — el reporte ACTUAL del MUISCA ("Declaración sugerida")
  //  ya NO trae frases en la columna "Uso sugerida"; trae R-códigos de renglón
  //  del 210 (R32, R58, R74, R132…). Sin esto, el parser dejaba todo en null →
  //  bucket "otros" → Pro no llenaba las cédulas.
  //
  //  IMPORTANTE: el R-código = número de CASILLA del Formulario 210 (Ley 2277/2022,
  //  AG 2023+). Verificado contra el instructivo oficial DIAN del F210 (Formulario_210
  //  _2024, casillas idénticas en AG 2025). Ej.: casilla 58 = Ingresos brutos rentas
  //  de capital; casilla 43 = Ingresos brutos rentas de trabajo sin relación laboral.
  //  (Una versión previa usaba R39/R63/R70/R82, casillas de un 210 viejo pre-2023 que
  //   en el formulario actual son deducciones/exentas/subtotales, no ingresos.)
  // ──────────────────────────────────────────────────────────────────────────
  var MAPEO_RENGLON_CEDULA = {
    'R32':  'trabajo',                 // Casilla 32 — Ingresos brutos rentas de trabajo
    'R33':  'incrngo',                 // Casilla 33 — INCRNGO rentas de trabajo
    'R43':  'honorarios',              // Casilla 43 — Ingresos brutos rentas de trabajo SIN relación laboral (honorarios)
    'R58':  'capital',                 // Casilla 58 — Ingresos brutos rentas de capital
    'R74':  'noLaboral',               // Casilla 74 — Ingresos brutos rentas no laborales
    'R99':  'pensiones',               // Casilla 99 — Ingresos brutos rentas de pensiones
    'R100': 'incrngo',                 // Casilla 100 — INCRNGO cédula de pensiones
    'R104': 'dividendos_no_grav',      // Casilla 104 — Dividendos y participaciones 2016 y anteriores
    'R107': 'dividendos_no_grav',      // Casilla 107 — Dividendos 2017+ 1a subcédula (num 3 art 49, no gravados)
    'R108': 'dividendos_grav',         // Casilla 108 — Dividendos 2017+ 2a subcédula (par 2 art 49, gravados)
    'R109': 'dividendos_no_grav',      // Casilla 109 — Dividendos y participaciones del exterior
    'R112': 'gananciasOcasionales'     // Casilla 112 — Ingresos por ganancias ocasionales
  };
  // R-códigos que NO son ingreso de cédula: patrimonio (R29/R30), 1% FE (R28),
  // rentas exentas/deducciones de trabajo (R35/R36/R37), donaciones (R123) y
  // retención (R132). Se marcan como 'informativo' para que NO inflen ingresos
  // y aparezcan en el cuadre como "no va como ingreso — revisar en su card / casilla".
  // (R35 y R123 verificados en reportes MUISCA reales AG2024.)
  var RENGLONES_INFORMATIVOS = {
    'R28': 1, 'R29': 1, 'R30': 1, 'R35': 1, 'R36': 1, 'R37': 1, 'R123': 1, 'R132': 1
  };

  // Extrae el primer R-código (R28..R140) de un texto. Acepta "R32 Ingresos…",
  // "Tope 1: ingresos | R32 …", etc.
  function extraerRenglon(texto){
    if(!texto) return null;
    var m = String(texto).match(/\bR\s*(2[0-9]|[3-9][0-9]|1[0-4][0-9])\b/i);
    return m ? ('R' + m[1]) : null;
  }

  // CONCEPTOS catálogo secundario (compat F1001 sintético — raro en práctica)
  var CONCEPTOS = {
    '5001': { descripcion: 'Salarios y demás pagos laborales', cedula: 'trabajo' },
    '5002': { descripcion: 'Honorarios', cedula: 'honorarios' },
    '5003': { descripcion: 'Servicios', cedula: 'honorarios' },
    '5004': { descripcion: 'Arrendamientos', cedula: 'capital' },
    '5005': { descripcion: 'Intereses y rendimientos financieros', cedula: 'capital' },
    '5008': { descripcion: 'Aportes obligatorios pensión', cedula: 'incrngo_pension' },
    '5009': { descripcion: 'Aportes obligatorios salud', cedula: 'incrngo_salud' },
    '5010': { descripcion: 'Dividendos no gravados', cedula: 'dividendos_no_grav' },
    '5011': { descripcion: 'Dividendos gravados', cedula: 'dividendos_grav' },
    '5022': { descripcion: 'Pensiones de jubilación', cedula: 'pensiones' },
    '5044': { descripcion: 'Utilidad enajenación activos fijos', cedula: 'gananciasOcasionales' }
  };

  // ──────────────────────────────────────────────────────────────────────────
  //  Utilidades
  // ──────────────────────────────────────────────────────────────────────────
  function normalizar(txt){
    if(txt == null) return '';
    return String(txt).toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i')
      .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/[ñ]/g,'n')
      .replace(/\s+/g,' ').trim();
  }

  function getCellTextValue(cell){
    if(!cell) return '';
    var v = cell.value;
    if(v == null) return '';
    if(typeof v === 'object' && v.richText) return v.richText.map(function(p){return p.text;}).join('');
    if(typeof v === 'object' && v.text) return v.text;
    if(typeof v === 'object' && v.result != null) return String(v.result);
    return String(v);
  }

  function getCellNumValue(cell){
    if(!cell) return null;
    var v = cell.value;
    if(v == null) return null;
    if(typeof v === 'number') return v;
    if(typeof v === 'object' && typeof v.result === 'number') return v.result;
    var s = String(v).replace(/[.,\s$]/g,'');
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Clasificación heurística (fallback algorítmico, NO IA)
  //  Se usa SOLO cuando el reporte no trae columna "Uso declaración Sugerida".
  //  Antes, en ese caso, TODOS los renglones salían null → el contador
  //  clasificaba todo a mano. Aquí inferimos la cédula con:
  //    1) código de concepto DIAN (5001/5005/…) si aparece en el detalle, y
  //    2) palabras clave en detalle/informante (banco, pensión, arriendo, …).
  //  Devuelve { cedula, fuente } o null. `fuente='heuristica'` permite a la UI
  //  marcar estos renglones como "sugerencia automática, verificar".
  // ──────────────────────────────────────────────────────────────────────────
  var HEURISTICA_KEYWORDS = [
    // El orden importa: las DEDUCCIONES son muy específicas y deben evaluarse
    // ANTES que capital/pensiones, porque comparten palabras ("intereses" de
    // vivienda, "aporte voluntario" en una AFP como Protección/Porvenir).
    // INFORMATIVO va primero: las consignaciones / movimientos bancarios NO son
    // ingreso y NO van en ninguna casilla del 210, pero la DIAN los cruza
    // (formato 1019) y generan alerta si no cuadran con los ingresos. Hay que
    // distinguirlos de los "intereses/rendimientos" que sí son renta de capital.
    { re: /consignacion|movimiento(s)? (debito|credito)|valor total de (los )?movimientos|deposito(s)? bancari|tarjeta(s)? de credito|total adquisiciones consumos|gastos tarjeta credito|compras y avances|ventas con tarjeta|gravamen.*movimiento|4 ?(x|por) ?mil|\bgmf\b/, cedula: 'informativo' },
    // Base de facturación electrónica (de ella sale el 1% deducible c28, ya prellenado por
    // parser-muisca). Viene sin "uso sugerido" → quedaba como pendiente rojo sin serlo.
    { re: /monto total de facturacion|facturacion electronica susceptible|susceptible de beneficio/, cedula: 'informativo' },
    // SALDOS y adquisiciones = patrimonio (c29) o movimientos del año (Tope 4), NO ingreso.
    // Van antes que capital porque el informante suele ser un banco (matchea 'capital' por
    // nombre) y "Saldo cuentas/CDT/inversión" o "Inversiones realizadas" no es renta.
    { re: /^saldo\b|saldo a favor|inversion(es)?.*(realizad|efectuad)|avaluo|adquisicion de bienes|bienes (o derechos|raices|inmuebles)|cuenta por cobrar|aporte.*derecho social/, cedula: 'informativo' },
    { re: /credito de vivienda|hipotecari|intereses (de )?vivienda/,                   cedula: 'deduccion_vivienda' },
    { re: /\bafc\b|\bavc\b|aporte(s)? voluntari|fondo.*pension.*voluntari|fvp\b/,      cedula: 'deduccion_avc' },
    { re: /prepagada|medicina prepagada|poliza de salud/,                              cedula: 'deduccion_salud_prepag' },
    { re: /aporte.*obligatori|seguridad social/,                                       cedula: 'incrngo' },
    { re: /\bpension(es|ado)?\b|mesada|colpensiones|porvenir|proteccion|colfondos|old mutual/, cedula: 'pensiones' },
    { re: /dividendo|participacion(es)?\b/,                                            cedula: 'dividendos_no_grav' },
    { re: /arrendamiento|arriendo|canon|alquiler/,                                     cedula: 'capital' },
    { re: /interes(es)?|rendimiento|financier|banco|bancolombia|davivienda|bbva|fiducia|fondo de inversion|cdt|cuenta de ahorro/, cedula: 'capital' },
    { re: /honorario|servicio(s)? (profesional|tecnico|personal)|comision/,            cedula: 'honorarios' },
    { re: /salario|sueldo|nomina|prestacion(es)? social|cesantia|viatico|bonificacion|laboral/, cedula: 'trabajo' }
  ];

  // Patrones del "uso sugerido" que NUNCA son ingreso de cédula (van a 'informativo').
  // Cubren tanto el formato con rótulo ("Tope 4. Consignaciones…") como el formato que
  // trae el concepto literal en esa columna ("Valor total de los movimientos…", "Saldo…").
  var RE_USO_NO_INGRESO = /^tope\s*[234]\b|consumos?\s*tc|total adquisiciones consumos|gastos? tarjeta cr[eé]dito|tarjeta\s*cr[eé]dito\s*o\s*d[eé]bito|consignaciones\s*e\s*inversiones|valor total de (los )?movimientos|^saldo\b|saldo a favor|inversion(es)?.*(realizad|efectuad)|^cdt\b|avaluo|adquisicion de bienes|cuenta por cobrar|aporte.*derecho social|se usa en renglones como/;

  function clasificarPorHeuristica(detalle, informante){
    var texto = normalizar((detalle || '') + ' ' + (informante || ''));
    if(!texto) return null;

    // 1) Código de concepto DIAN (5001, 5005, …) en el texto
    var mCod = texto.match(/\b(50\d{2})\b/);
    if(mCod && CONCEPTOS[mCod[1]]){
      return { cedula: CONCEPTOS[mCod[1]].cedula, fuente: 'heuristica_concepto' };
    }

    // 2) Palabras clave
    for(var i = 0; i < HEURISTICA_KEYWORDS.length; i++){
      if(HEURISTICA_KEYWORDS[i].re.test(texto)){
        return { cedula: HEURISTICA_KEYWORDS[i].cedula, fuente: 'heuristica_keyword' };
      }
    }
    return null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Detector de rol por columna (señales de contenido — NO nombres de cabecera)
  // ──────────────────────────────────────────────────────────────────────────

  /** Score (0-1) de qué tan probable es que la columna tenga ese rol. */
  var DETECTORES_ROL = {
    nitInformante: function(textValues, numValues){
      // Strings/números enteros de 8-11 dígitos sin decimales.
      // Distinción crítica vs valor (columnas que también pasan 8-11 dígitos):
      //   1) NIT tiene formato distintivo: típicamente es proporcionado como
      //      STRING con puntos (900.123.456) o como número entero exacto.
      //      Un valor monetario en columna numérica es siempre `typeof number`.
      //      Las columnas de NIT en MUISCA suelen tener valores como STRING.
      //   2) Montos en pesos colombianos terminan en "00" o "000" en >80% casos.
      //   3) NITs se repiten en columna informante (mismo empleador en varias
      //      filas). Si >70% son únicos, es columna de valores.
      var stringValues = (textValues || []).filter(function(t){
        return /^\d{8,11}$/.test(String(t || '').replace(/[.,\s$]/g, ''));
      });
      var numStringValues = (numValues || []).filter(function(n){
        return typeof n === 'number' && Number.isInteger(n) && n >= 1e7 && n <= 1e11;
      }).map(function(n){ return String(Math.round(n)); });

      var allNitLike = stringValues.concat(numStringValues);
      if(allNitLike.length === 0) return 0;

      // Heurística 1: si >70% terminan en "00", es columna de valores monetarios
      var terminanEn00 = 0;
      for(var i = 0; i < allNitLike.length; i++){
        if(/00$/.test(allNitLike[i])) terminanEn00++;
      }
      if(terminanEn00 / allNitLike.length > 0.7) return 0;

      // Heurística 2: si >70% son únicos, es valor (NITs informantes repiten)
      if(allNitLike.length >= 4){
        var uniq = {};
        allNitLike.forEach(function(n){ uniq[n] = true; });
        var ratioUnico = Object.keys(uniq).length / allNitLike.length;
        if(ratioUnico > 0.7) return 0;
      }

      // Heurística 3: penalizar columna que contiene SOLO números puros
      // (sin strings) — NITs en MUISCA siempre vienen como string formateado
      // o mezcla; valor monetario viene como número puro de Excel.
      var totalDataRows = (textValues || []).length + (numValues || []).length;
      if(stringValues.length === 0 && numStringValues.length > 0){
        // Solo números puros, sin strings — probablemente valor
        return Math.min(0.4, allNitLike.length / totalDataRows);
      }

      return allNitLike.length / Math.max(1, totalDataRows);
    },
    nombreInformante: function(textValues){
      // Strings 5-80 chars con letras + opcional SAS/LTDA/S.A./S\.A\.S
      if(textValues.length === 0) return 0;
      var matches = 0;
      for(var i = 0; i < textValues.length; i++){
        var t = String(textValues[i] || '').trim();
        if(t.length < 5 || t.length > 100) continue;
        if(!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(t)) continue;
        // Excluir cadenas que parecen NIT puro
        if(/^\d+$/.test(t.replace(/[.,\s]/g, ''))) continue;
        // Bonus si tiene SAS/LTDA/S.A./tiene espacios (varios apellidos)
        var bonus = /\bSAS\b|\bLTDA\b|\bS\.A\.?\b|\bS\.A\.S\.?\b/i.test(t) || /\s/.test(t);
        matches += bonus ? 1.0 : 0.7;
      }
      return Math.min(1.0, matches / textValues.length);
    },
    detalle: function(textValues){
      // Strings descriptivos 10-300 chars con palabras
      if(textValues.length === 0) return 0;
      var matches = 0;
      for(var i = 0; i < textValues.length; i++){
        var t = String(textValues[i] || '').trim();
        if(t.length < 10 || t.length > 300) continue;
        // Tiene varias palabras (>= 2 espacios)
        var words = t.split(/\s+/).length;
        if(words < 3) continue;
        // No es solo número
        if(/^[\d.,$\s]+$/.test(t)) continue;
        matches++;
      }
      return matches / textValues.length;
    },
    valor: function(textValues, numValues){
      // Números > 1.000. La asignación greedy ya prioriza NIT informante primero,
      // entonces si una columna fue asignada a NIT, queda excluida de valor.
      // Aquí solo evitamos columnas claramente uniformes con repetición exacta
      // (NIT del declarante repetido en cada fila → variance = 0).
      if(!numValues || numValues.length === 0) return 0;
      var positivos = numValues.filter(function(n){ return n != null && n > 0; });
      if(positivos.length === 0) return 0;

      // Si TODOS los valores son IDÉNTICOS, es probablemente NIT del declarante
      // (mismo NIT repetido en cada fila). Distinto a uniformidad de magnitud:
      // valores monetarios pueden ser similares pero NO idénticos.
      if(positivos.length >= 3){
        var primerValor = positivos[0];
        var todosIguales = positivos.every(function(n){ return n === primerValor; });
        if(todosIguales) return 0;
      }

      var matches = 0;
      for(var j = 0; j < numValues.length; j++){
        if(numValues[j] != null && numValues[j] > 1000) matches++;
      }
      return matches / numValues.length;
    },
    usoSugerido: function(textValues){
      // Strings descriptivos con keywords normativos da score 1.0,
      // strings 15-200 chars sin keywords da score parcial 0.5 (posible categoría custom)
      if(textValues.length === 0) return 0;
      var keywords = /\b(rentas?|cedula|cédula|dividendos?|pensiones|honorarios|capital|trabajo|ganancias|ocasionales|ingresos?\s+no|ren?glo?n|categoria|categoría)\b/i;
      var matches = 0;
      for(var i = 0; i < textValues.length; i++){
        var t = String(textValues[i] || '').trim();
        if(t.length < 5 || t.length > 250) continue;
        if(keywords.test(t)) matches += 1.0;
        else if(t.length >= 15) matches += 0.5;
      }
      return matches / textValues.length;
    }
  };

  /**
   * Analiza las primeras N filas de datos después de headerRow y clasifica
   * cada columna por rol con score de confianza.
   * Retorna: { mapping: {colNum: {rol, score}}, confianzaGlobal: 0-1 }
   */
  // Detección por NOMBRE de header (autoritativa). El reporte MUISCA estándar trae
  // los rótulos exactos: "Detalle", "Valor", "Uso declaración Sugerida", "NIT",
  // "Nombre/Razón Social". Esto es mucho más robusto que la heurística de score, que
  // se confunde cuando el reporte trae columnas extra (resúmenes "Salarios | 223.569.000").
  function detectarColumnasPorHeader(sheet, headerRow){
    var maxCol = sheet.actualColumnCount || 14;
    var m = {};
    for(var c = 1; c <= maxCol; c++){
      var h = normalizar(getCellTextValue(sheet.getRow(headerRow).getCell(c)));
      if(!h) continue;
      if(!m.detalle && /^detalle$/.test(h)) m.detalle = { col:c, score:0.95 };
      else if(!m.valor && /^valor$/.test(h)) m.valor = { col:c, score:0.95 };
      else if(!m.usoSugerido && /uso\s*declaracion\s*sugerida|^uso\b/.test(h)) m.usoSugerido = { col:c, score:0.95 };
      else if(!m.retencion && /^retencion/.test(h)) m.retencion = { col:c, score:0.9 };
      else if(!m.nitInformante && /^nit$/.test(h)) m.nitInformante = { col:c, score:0.9 }; // 1er "NIT" = informante
      else if(!m.nombreInformante && /^nombre\s*\/\s*razon social$/.test(h)) m.nombreInformante = { col:c, score:0.9 }; // 1er "Nombre/Razón Social" = informante
    }
    // Válido solo si están los 3 críticos para clasificar (detalle + valor + uso).
    if(m.detalle && m.valor && m.usoSugerido) return m;
    return null;
  }

  function detectarColumnasPorContenido(sheet, headerRow, sampleSize){
    // 1) intentar por nombre de header (autoritativo, robusto a columnas extra)
    var porNombre = detectarColumnasPorHeader(sheet, headerRow);
    if(porNombre){
      return { mapping: porNombre, mappingPorColumna: null, confianzaGlobal: 0.92, rowsScanned: 0, fuente: 'header' };
    }
    // 2) fallback: heurística de contenido por score
    sampleSize = sampleSize || 12;
    var maxCol = sheet.actualColumnCount || 12;

    // Recolectar valores de cada columna en las filas de muestreo
    var colValues = {}; // { colNum: { texts: [...], nums: [...] } }
    for(var c = 1; c <= maxCol; c++){
      colValues[c] = { texts: [], nums: [] };
    }

    var rowsScanned = 0;
    var nonEmptyRows = 0;
    for(var r = headerRow + 1; r <= Math.min(sheet.rowCount, headerRow + sampleSize * 2) && rowsScanned < sampleSize; r++){
      var row = sheet.getRow(r);
      if(!row || row.cellCount === 0) continue;
      // Skip filas de subtotales: pocas celdas pobladas
      if(row.cellCount < 3) continue;
      rowsScanned++;
      nonEmptyRows++;
      for(var col = 1; col <= maxCol; col++){
        var cell = row.getCell(col);
        var t = getCellTextValue(cell);
        var n = getCellNumValue(cell);
        if(t) colValues[col].texts.push(t);
        if(n != null) colValues[col].nums.push(n);
      }
    }

    if(nonEmptyRows < 2){
      return { mapping: {}, confianzaGlobal: 0, rowsScanned: rowsScanned };
    }

    // Para cada columna, calcular score por cada rol
    var mapping = {};
    var asignaciones = {}; // rol → {col, score}

    for(var col2 = 1; col2 <= maxCol; col2++){
      var v = colValues[col2];
      if(v.texts.length === 0 && v.nums.length === 0) continue;

      var scores = {};
      for(var rol in DETECTORES_ROL){
        if(DETECTORES_ROL.hasOwnProperty(rol)){
          scores[rol] = DETECTORES_ROL[rol](v.texts, v.nums);
        }
      }
      mapping[col2] = scores;
    }

    // Asignación greedy con tiebreaker de posición:
    // - nitInformante: prefiere col MÁS BAJA (convención MUISCA: col 1-2)
    // - valor:        prefiere col MÁS ALTA (convención MUISCA: col 5-7)
    // - resto: por mayor score
    // Threshold mínimo 0.3 (detalle puede tener filas vacías/cortas)
    var rolesPriorizados = ['nitInformante', 'detalle', 'valor', 'usoSugerido', 'nombreInformante'];
    var thresholds = { nitInformante: 0.5, detalle: 0.4, valor: 0.4, usoSugerido: 0.3, nombreInformante: 0.4 };
    rolesPriorizados.forEach(function(rol){
      var th = thresholds[rol] || 0.5;
      // Recolectar todas las cols candidatas con score >= threshold
      var candidatas = [];
      for(var col3 in mapping){
        if(columnaAsignada(asignaciones, col3)) continue;
        var sc = mapping[col3][rol];
        if(sc >= th) candidatas.push({ col: parseInt(col3), score: sc });
      }
      if(candidatas.length === 0) return;
      // Ordenar: primero por score descendente; si scores empatan dentro de
      // un margen de 0.1, aplicar tiebreaker posicional
      candidatas.sort(function(a, b){
        if(Math.abs(a.score - b.score) < 0.1){
          // nitInformante: prefiere col más baja
          if(rol === 'nitInformante') return a.col - b.col;
          // valor: prefiere col más alta
          if(rol === 'valor') return b.col - a.col;
        }
        return b.score - a.score;
      });
      asignaciones[rol] = { col: candidatas[0].col, score: candidatas[0].score };
    });

    // Confianza global: ponderada según criticidad del rol.
    //   detalle, valor: peso 2.0 c/u — críticos (sin estos el parser no procesa)
    //   nitInformante, nombreInformante: peso 1.0 c/u — útiles para display
    //   usoSugerido: peso 1.0 — usado para clasificación cédula
    // Total weight = 7.0. Si rol falta, su contribución = 0.
    // Mínimo absoluto: detalle + valor presentes (sin esto, confianza = 0).
    var critico = !!(asignaciones.detalle && asignaciones.valor);
    var confianzaGlobal = 0;
    if(critico){
      var pesos = { detalle: 2.0, valor: 2.0, nitInformante: 1.0, nombreInformante: 1.0, usoSugerido: 1.0 };
      var pesoTotal = 7.0;
      var sumaPonderada = 0;
      Object.keys(pesos).forEach(function(rol2){
        if(asignaciones[rol2]){
          sumaPonderada += asignaciones[rol2].score * pesos[rol2];
        }
      });
      confianzaGlobal = sumaPonderada / pesoTotal;
      // Penalización si NO se detectó usoSugerido (formato MUISCA real lo trae)
      if(!asignaciones.usoSugerido){
        confianzaGlobal = Math.min(confianzaGlobal, 0.60);
      }
    }

    return {
      mapping: asignaciones,
      mappingPorColumna: mapping, // todos los scores por columna (para UI N3)
      confianzaGlobal: confianzaGlobal,
      rowsScanned: rowsScanned
    };
  }

  function columnaAsignada(asignaciones, col){
    for(var rol in asignaciones){
      if(asignaciones[rol].col == col) return true;
    }
    return false;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Detección de fila de cabecera flexible (no hardcoded)
  //
  //  Busca primera fila R que cumpla:
  //  - 4+ celdas con texto cuyo total > 30 chars no numéricos
  //  - Las 3 filas siguientes (R+1..R+3) tienen al menos una con 3+ celdas
  //    de datos consistentes (algún número, algún texto largo)
  // ──────────────────────────────────────────────────────────────────────────
  function findHeaderRowFlexible(sheet, maxScan){
    maxScan = maxScan || 25;
    var maxRows = Math.min(sheet.rowCount || maxScan, maxScan);

    var candidates = [];
    for(var r = 1; r <= maxRows; r++){
      var row = sheet.getRow(r);
      if(!row || row.cellCount < 4) continue;

      // Contar celdas con texto y suma de chars no numéricos
      var celdasTexto = 0;
      var charsTexto = 0;
      var palabrasClaveCabecera = 0;
      var keywordsHeader = /\b(nit|nombre|razon|raz[oó]n|detalle|valor|pago|abono|concepto|informaci[oó]n|uso|sugerid|retenci[oó]n|declaraci[oó]n)\b/i;
      row.eachCell({ includeEmpty: false }, function(cell){
        var t = getCellTextValue(cell);
        if(!t) return;
        // Excluir cadenas puramente numéricas
        var sinNum = String(t).replace(/[\d.,\s$]/g, '');
        if(sinNum.length >= 2){
          celdasTexto++;
          charsTexto += sinNum.length;
        }
        if(keywordsHeader.test(t)) palabrasClaveCabecera++;
      });

      if(celdasTexto >= 4 && charsTexto >= 30){
        // Verificar consistencia en filas siguientes
        var siguientesConDatos = 0;
        for(var s = r + 1; s <= Math.min(maxRows + 5, r + 5); s++){
          var ns = sheet.getRow(s);
          if(ns && ns.cellCount >= 3){
            var tieneTexto = false, tieneNum = false;
            ns.eachCell({ includeEmpty: false }, function(cc){
              var nv = getCellNumValue(cc);
              var tv = getCellTextValue(cc);
              if(typeof nv === 'number' && nv > 1000) tieneNum = true;
              if(tv && tv.length > 5 && /[a-zA-Z]/.test(tv)) tieneTexto = true;
            });
            if(tieneTexto || tieneNum) siguientesConDatos++;
          }
        }
        if(siguientesConDatos >= 1){
          // Score: combina chars de cabecera + palabras clave + consistencia
          var score = (celdasTexto * 1.0) + (palabrasClaveCabecera * 1.5) + (siguientesConDatos * 0.5);
          candidates.push({ rowNum: r, score: score, palabrasClave: palabrasClaveCabecera });
        }
      }
    }

    if(candidates.length === 0) return null;
    candidates.sort(function(a, b){ return b.score - a.score; });
    return candidates[0];
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Detector multi-hoja: prueba todas las hojas y elige la con mejor confianza
  // ──────────────────────────────────────────────────────────────────────────
  function detectarMejorHoja(workbook){
    if(!workbook || !workbook.worksheets) return null;
    var resultados = [];
    for(var i = 0; i < workbook.worksheets.length; i++){
      var sh = workbook.worksheets[i];
      var headerInfo = findHeaderRowFlexible(sh, 25);
      if(!headerInfo){
        resultados.push({ sheet: sh, confianza: 0, header: null, mapping: null });
        continue;
      }
      var det = detectarColumnasPorContenido(sh, headerInfo.rowNum, 12);
      resultados.push({
        sheet: sh,
        confianza: det.confianzaGlobal,
        header: headerInfo,
        mapping: det.mapping,
        mappingPorColumna: det.mappingPorColumna,
        rowsScanned: det.rowsScanned
      });
    }
    resultados.sort(function(a, b){ return b.confianza - a.confianza; });
    return resultados.length > 0 ? resultados[0] : null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Determinar nivel de detección según confianza global
  // ──────────────────────────────────────────────────────────────────────────
  function determinarNivel(confianza){
    if(confianza >= 0.90) return 'N1';
    if(confianza >= 0.70) return 'N2';
    if(confianza > 0)     return 'N3';
    return 'falla';
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Mapeo cédula → bucket
  // ──────────────────────────────────────────────────────────────────────────
  function bucketDeCedula(cedula){
    var directos = ['trabajo','honorarios','capital','noLaboral','pensiones',
                    'dividendos_no_grav','dividendos_grav','gananciasOcasionales'];
    if(directos.indexOf(cedula) >= 0){
      if(cedula === 'dividendos_no_grav' || cedula === 'dividendos_grav') return 'dividendos';
      return cedula;
    }
    if(cedula === 'informativo') return 'informativo';
    if(cedula === 'excluir') return 'excluido';
    return 'otros';
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  calcularCuadre — garantiza que TODO el reporte quede contabilizado:
  //  total = clasificado (va al 210) + informativo (no va, se informa) +
  //          excluido (manual) + pendiente (sin clasificar).
  //  Opera sobre objetos {valor, cedulaFinal, excluida} → sirve tanto para los
  //  `registros` del parser como para las `filas` de reconciliación de Pro.
  //  Devuelve además la alerta de consignaciones vs ingresos (cruce DIAN 1019).
  // ──────────────────────────────────────────────────────────────────────────
  var CEDULAS_INGRESO = ['trabajo','honorarios','capital','noLaboral','pensiones',
                         'dividendos_no_grav','dividendos_grav','gananciasOcasionales'];

  // Explica POR QUÉ una fila quedó como 'informativo' y A DÓNDE va realmente.
  // Clave para el contador: distinguir lo que SÍ entra a la declaración (patrimonio,
  // deudas, retención — prellenadas por separado) de lo que de verdad no va (consumos,
  // consignaciones: solo indicadores que la DIAN cruza). El uso sugerido de la DIAN manda.
  function motivoInformativo(f){
    var u = normalizar((f.usoDIANSugerido || '') + ' ' + (f.descripcion || f.concepto || ''));
    // Orden: lo MULTI-renglón/ambiguo (adquisiciones que mencionan varias casillas) primero,
    // luego consumos/consignaciones, y al final los R-código limpios (deuda/retención/FE).
    if(/se usa en renglones como|adquisicion de bienes|avaluo|bienes (o derechos|raices)/.test(u))
      return '→ Adquisición de un BIEN/derecho: normalmente va al PATRIMONIO (casilla 29). Si en el año lo VENDIÓ, evalúa ganancia ocasional o renta no laboral según la posesión. Decide con la escritura/contrato.';
    if(/tope\s*3|consumos?\s*tc|tarjeta\s*cr[eé]dito\s*o\s*d[eé]bito|total adquisiciones consumos/.test(u))
      return 'NO va al 210: consumos con tarjeta — solo indicador que la DIAN cruza (verifica que la capacidad de pago los justifique).';
    if(/tope\s*4|consignaciones|valor total de (los )?movimientos/.test(u))
      return 'NO va al 210: consignaciones/movimientos bancarios — la DIAN los cruza (formato 1019). Deben poder justificarse (traslados, préstamos, dineros de terceros).';
    if(/^saldo|tope\s*2|\br29\b|inversion(es)?.*(realizad|efectuad)|cuenta por cobrar|saldo inversion|aporte.*derecho social/.test(u))
      return '→ SÍ va a la declaración: es un ACTIVO del PATRIMONIO (casilla 29, ya prellenada). Verifica el saldo a 31-dic.';
    if(/\br30\b|deuda|pasivo/.test(u))
      return '→ SÍ va a la declaración: es una DEUDA (casilla 30, ya prellenada con el patrimonio). Verifica el saldo a 31-dic.';
    if(/saldo a favor/.test(u))
      return '→ SÍ va a la declaración: es el SALDO A FAVOR del año anterior (casilla 131, ya prellenada). Confírmalo contra la declaración del año pasado.';
    if(/\br132\b|retencion/.test(u))
      return '→ SÍ va a la declaración: es una RETENCIÓN (casilla 132, ya prellenada). Confirma contra el certificado.';
    if(/\br28\b|factura electr[oó]nica|susceptible de beneficio/.test(u))
      return '→ Base de compras con factura electrónica: el 1% deducible (casilla 28) ya quedó prellenado.';
    if(/promedio|ingreso laboral promedio|cesantia|\br3[67]\b/.test(u))
      return '→ Renta exenta de trabajo / insumo de cesantías (Art. 206-4). Aplícalo desde la asesoría de cesantías si corresponde.';
    return 'Informativo: revisa si corresponde a patrimonio, deuda o retención (van a sus casillas) o a un movimiento que no va al 210.';
  }

  function calcularCuadre(filas){
    var c = {
      total: 0, clasificado: 0, ingresos: 0, informativo: 0, excluido: 0, pendiente: 0,
      conteo: { total: 0, clasificado: 0, informativo: 0, excluido: 0, pendiente: 0 },
      noVanEnDeclaracion: [], // {descripcion, informante, valor, motivo}
      alertas: []
    };
    (filas || []).forEach(function(f){
      var v = Math.round(Number(f.valor) || 0);
      c.total += v; c.conteo.total++;
      var ced = f.cedulaFinal;
      if(f.excluida || ced === 'excluir'){
        c.excluido += v; c.conteo.excluido++;
        c.noVanEnDeclaracion.push({ descripcion: f.descripcion || f.concepto || '', informante: f.informante || '', valor: v, motivo: f.motivoExclusion || 'Excluido manualmente' });
      } else if(ced === 'informativo'){
        c.informativo += v; c.conteo.informativo++;
        c.noVanEnDeclaracion.push({ descripcion: f.descripcion || f.concepto || '', informante: f.informante || '', valor: v, motivo: motivoInformativo(f) });
      } else if(!ced){
        c.pendiente += v; c.conteo.pendiente++;
      } else {
        c.clasificado += v; c.conteo.clasificado++;
        if(CEDULAS_INGRESO.indexOf(ced) >= 0) c.ingresos += v;
      }
    });

    // Cuadre: total debe ser igual a la suma de las partes (tolerancia $1 por redondeo).
    c.suma = c.clasificado + c.informativo + c.excluido + c.pendiente;
    c.cuadra = Math.abs(c.total - c.suma) <= 1;

    // Alerta de pendientes (lo que NO se clasificó y debería).
    if(c.conteo.pendiente > 0){
      c.alertas.push({
        nivel: 'warn',
        mensaje: c.conteo.pendiente + ' registro(s) por $' + c.pendiente.toLocaleString('es-CO') +
                 ' sin clasificar. Asígnalos a una cédula o márcalos informativos/excluidos para cuadrar el reporte.'
      });
    }
    // Alerta de consignaciones vs ingresos (cruce DIAN formato 1019/1020).
    if(c.informativo > 0 && c.ingresos > 0 && c.informativo > c.ingresos * 1.3){
      c.alertas.push({
        nivel: 'dian',
        mensaje: 'Las consignaciones/movimientos informativos ($' + c.informativo.toLocaleString('es-CO') +
                 ') superan ampliamente los ingresos declarables ($' + c.ingresos.toLocaleString('es-CO') +
                 '). La DIAN cruza esto (formato 1019) y puede generar requerimiento. Verifica que estén justificadas (traslados, préstamos, dineros de terceros).'
      });
    } else if(c.informativo > 0){
      c.alertas.push({
        nivel: 'info',
        mensaje: 'Hay $' + c.informativo.toLocaleString('es-CO') + ' en consignaciones/movimientos que NO van en ninguna casilla del 210. Infórmaselo al cliente: la DIAN las cruza y deben poder justificarse.'
      });
    }
    return c;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  parseExogenaPN — función pública
  //
  //  Acepta opciones:
  //    overrideMapping: {nitInformante: col, ...} para casos N3 (manual)
  //    sheetIndex: 0, 1, etc. para forzar hoja específica
  //    skipDetection: true si overrideMapping suficiente
  // ──────────────────────────────────────────────────────────────────────────
  function parseExogenaPN(workbook, options){
    options = options || {};
    var warnings = [];
    var registros = [];
    var totales = {
      porCedula: {
        trabajo: 0, honorarios: 0, capital: 0, noLaboral: 0,
        pensiones: 0, dividendos: 0, gananciasOcasionales: 0, otros: 0
      },
      totalGeneral: 0,
      totalRetencion: 0
    };
    var metadata = {
      sheetCount: 0,
      sheetName: null,
      headerRowDetected: null,
      headerScore: 0,
      formatoDetectado: 'desconocido',
      nivelDeteccion: 'falla',
      confianza: 0,
      mappingDetectado: null,
      totalRegistros: 0,
      // Topes oficiales DIAN (chequeo de obligación de declarar). Tope 2 =
      // patrimonio bruto DECLARADO el año anterior, no suma de activos reportados.
      topes: null,
      patrimonioAnioAnterior: 0
    };

    if(!workbook || !workbook.getWorksheet){
      warnings.push({ tipo: 'parse_error', mensaje: 'Workbook ExcelJS inválido o no proporcionado.' });
      return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
    }
    metadata.sheetCount = (workbook.worksheets && workbook.worksheets.length) || 1;

    // Detección
    var deteccion;
    if(options.sheetIndex != null){
      var sh = workbook.worksheets[options.sheetIndex];
      if(!sh){
        warnings.push({ tipo: 'parse_error', mensaje: 'Hoja ' + options.sheetIndex + ' no existe.' });
        return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
      }
      var hdr = findHeaderRowFlexible(sh, 25);
      var det = hdr ? detectarColumnasPorContenido(sh, hdr.rowNum, 12) : { mapping: {}, confianzaGlobal: 0 };
      deteccion = { sheet: sh, header: hdr, mapping: det.mapping, mappingPorColumna: det.mappingPorColumna, confianza: det.confianzaGlobal };
    } else {
      deteccion = detectarMejorHoja(workbook);
    }

    if(!deteccion || !deteccion.sheet){
      warnings.push({ tipo: 'parse_error', mensaje: 'No se pudo determinar hoja procesable.' });
      return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
    }

    // OVERRIDE MUISCA: la detección flexible a veces elige una fila de aviso como header
    // (caso real: detecta fila 10 en vez de la 14, perdiendo TODOS los ingresos de trabajo).
    // Buscamos en las primeras 25 filas la fila que SÍ trae los rótulos oficiales del MUISCA
    // (Detalle + Valor + Uso declaración Sugerida) y, si existe, mandamos: es la fuente de verdad.
    if(!options.overrideMapping && !options.sheetIndex){
      for(var hr = 1; hr <= Math.min(deteccion.sheet.rowCount, 25); hr++){
        var hm = detectarColumnasPorHeader(deteccion.sheet, hr);
        if(hm){
          deteccion.header = { rowNum: hr, score: 1 };
          deteccion.mapping = hm;
          deteccion.confianza = 0.92;
          deteccion.mappingPorColumna = null;
          break;
        }
      }
    }

    metadata.sheetName = deteccion.sheet.name;
    metadata.headerRowDetected = deteccion.header ? deteccion.header.rowNum : null;
    metadata.headerScore = deteccion.header ? deteccion.header.score : 0;
    metadata.confianza = Math.round((deteccion.confianza || 0) * 100);
    metadata.nivelDeteccion = determinarNivel(deteccion.confianza || 0);

    // Aplicar override si caller pasó mapping manual
    var mapping = options.overrideMapping || (deteccion.mapping || {});
    metadata.mappingDetectado = mapping;
    metadata.mappingPorColumna = deteccion.mappingPorColumna || null;

    if(metadata.nivelDeteccion === 'falla' && !options.overrideMapping){
      warnings.push({
        tipo: 'cabecera_no_detectada',
        mensaje: 'No se pudo detectar estructura del archivo. Usa el mapeador manual para asignar columnas.'
      });
      return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
    }
    // N3: confianza baja, requiere mapeo manual del usuario para procesar
    if(metadata.nivelDeteccion === 'N3' && !options.overrideMapping){
      warnings.push({
        tipo: 'requiere_mapeo_manual',
        mensaje: 'Confianza de autodetección baja (' + metadata.confianza + '%). Esto no parece un reporte exógena DIAN del MUISCA, o tiene una estructura no reconocida. Confirma el mapeo de columnas manualmente.'
      });
      return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
    }
    // N2: procesa pero advierte
    if(metadata.nivelDeteccion === 'N2' && !options.overrideMapping){
      warnings.push({
        tipo: 'verificar_mapping',
        mensaje: 'Autodetección con confianza media (' + metadata.confianza + '%). Verifica que las columnas detectadas sean correctas antes de aplicar reconciliación.'
      });
    }

    // Validar mapeo crítico: detalle + valor son obligatorios
    if(!mapping.detalle || !mapping.valor){
      warnings.push({
        tipo: 'columna_faltante',
        mensaje: 'Faltan columnas críticas (detalle / valor). Sin estas el archivo no es procesable.'
      });
      return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
    }

    // Procesar filas
    var sheet = deteccion.sheet;
    var headerRow = deteccion.header ? deteccion.header.rowNum : 0;
    var startRow = headerRow + 1;
    var endRow = sheet.rowCount;
    var colDetalle = mapping.detalle.col;
    var colValor = mapping.valor.col;
    var colNitInf = mapping.nitInformante ? mapping.nitInformante.col : null;
    var colNombreInf = mapping.nombreInformante ? mapping.nombreInformante.col : null;
    var colUsoSug = mapping.usoSugerido ? mapping.usoSugerido.col : null;
    var colRetencion = mapping.retencion ? mapping.retencion.col : null;

    metadata.formatoDetectado = colUsoSug ? 'consulta_MUISCA' : 'consulta_parcial';

    if(!colUsoSug){
      warnings.push({
        tipo: 'uso_sugerido_no_detectado',
        mensaje: 'No se detectó columna "Uso declaración Sugerida". Se clasifica por heurística (concepto / palabras clave); revisa las sugerencias automáticas antes de aplicar.'
      });
    }

    for(var r = startRow; r <= endRow; r++){
      var row = sheet.getRow(r);
      if(!row || row.cellCount === 0) continue;

      var detalle = String(getCellTextValue(row.getCell(colDetalle))).trim();
      var nitInfo = colNitInf ? String(getCellTextValue(row.getCell(colNitInf))).trim() : '';

      // Filas de Tope (sin NIT informante): chequeo oficial de obligación de declarar.
      // Capturar ANTES de los skips y buscando en toda la fila — el mapeo semántico
      // puede ubicar "detalle" en otra columna y estas filas quedan casi vacías.
      if(!nitInfo){
        for(var tc = 1; tc <= 12; tc++){
          var tm = String(getCellTextValue(row.getCell(tc))).trim().match(/^Tope\s*([1-5])\s*[-–]/i);
          if(!tm) continue;
          if(!metadata.topes) metadata.topes = { ingresos:0, patrimonio:0, consumoTC:0, movimientos:0, compras:0 };
          var TOPE_KEYS = { 1:'ingresos', 2:'patrimonio', 3:'consumoTC', 4:'movimientos', 5:'compras' };
          var tVal = getCellNumValue(row.getCell(colValor)) || 0;
          if(!tVal){ for(var tv = tc + 1; tv <= 12; tv++){ tVal = getCellNumValue(row.getCell(tv)) || 0; if(tVal) break; } }
          metadata.topes[TOPE_KEYS[parseInt(tm[1],10)]] = tVal;
          break;
        }
      }

      if(!detalle) continue;

      // Skip filas de subtotales: NIT informante vacío Y/o solo Detalle+Valor pobladas
      if(colNitInf && !nitInfo){
        // Subtotal — skip silencioso
        continue;
      }

      var valor = getCellNumValue(row.getCell(colValor)) || 0;

      // "Total patrimonio bruto declarado en el año anterior": declaración previa del
      // consultante (base del Tope 2), no un ingreso/activo reportado por tercero.
      var esPatAnt = false;
      for(var pc = 1; pc <= 12; pc++){
        if(/patrimonio bruto declarado en el a/i.test(String(getCellTextValue(row.getCell(pc))))){ esPatAnt = true; break; }
      }
      if(esPatAnt){
        metadata.patrimonioAnioAnterior = valor;
        continue;
      }
      var retencion = colRetencion ? (getCellNumValue(row.getCell(colRetencion)) || 0) : 0;
      var informante = colNombreInf ? String(getCellTextValue(row.getCell(colNombreInf))).trim() : '';
      var usoSugerido = colUsoSug ? String(getCellTextValue(row.getCell(colUsoSug))).trim() : '';

      var cedulaSugerida = null;
      var fuenteCedula = null; // 'uso_dian' | 'heuristica_concepto' | 'heuristica_keyword'
      if(usoSugerido){
        var usoNorm = normalizar(usoSugerido);

        // GUARDA AUTORITATIVA: el "uso sugerido" de la DIAN manda sobre la heurística.
        // Estos conceptos NO son ingreso de cédula (inflan c91 indebidamente):
        //  · Topes 3/4 (consumos TC, consignaciones) — indicadores de obligación.
        //  · SALDOS de cuentas/CDT/inversiones — patrimonio (c29), no renta.
        //  · Inversiones/CDT "realizadas/efectuadas" en el año — movimiento (Tope 4).
        //  · Avalúos, adquisiciones, cuentas por cobrar — patrimonio.
        // Importante: el informante suele ser un banco, lo que engañaba a la heurística
        // (la marcaba 'capital' por el nombre). Se distinguen de "Rendimientos/intereses
        // pagados", que SÍ son renta de capital y NO matchean estos patrones.
        if(RE_USO_NO_INGRESO.test(usoNorm)){
          registros.push({
            fila: r, descripcion: detalle, informante: informante, nitInformante: nitInfo,
            valor: Math.round(valor), retencion: Math.round(retencion),
            usoDIANSugerido: usoSugerido, cedulaSugerida: 'informativo',
            cedulaFinal: 'informativo', fuenteCedula: 'uso_dian'
          });
          continue;
        }

        // EL R-CÓDIGO MANDA PRIMERO: es la señal más específica de la DIAN. Va ANTES
        // del match por frase, porque frases como "...imputables a las rentas de trabajo"
        // (que es R35, una renta EXENTA) engañaban al substring 'rentas de trabajo' y se
        // clasificaban como INGRESO de trabajo, inflando la cédula (caso real Giraldo: +26,5M).
        var renglon = extraerRenglon(usoSugerido);
        if(renglon){
          if(MAPEO_RENGLON_CEDULA[renglon]){
            cedulaSugerida = MAPEO_RENGLON_CEDULA[renglon];
            fuenteCedula = 'renglon_dian';
          } else if(RENGLONES_INFORMATIVOS[renglon]){
            cedulaSugerida = 'informativo';
            fuenteCedula = 'renglon_dian';
          }
        }

        // Si el R-código no resolvió, recurrir al texto del uso sugerido.
        if(!cedulaSugerida){
          cedulaSugerida = MAPEO_USO_DIAN[usoNorm] || null;
          if(!cedulaSugerida){
            var keys = Object.keys(MAPEO_USO_DIAN);
            for(var k = 0; k < keys.length; k++){
              if(usoNorm.indexOf(keys[k]) >= 0){
                cedulaSugerida = MAPEO_USO_DIAN[keys[k]];
                break;
              }
            }
          }
          if(cedulaSugerida) fuenteCedula = 'uso_dian';
        }

        // (compat) algunos formatos sin R-code que el texto tampoco mapeó:
        if(!cedulaSugerida){
          var renglon2 = extraerRenglon(usoSugerido);
          if(renglon2){
            if(MAPEO_RENGLON_CEDULA[renglon2]){
              cedulaSugerida = MAPEO_RENGLON_CEDULA[renglon2];
              fuenteCedula = 'renglon_dian';
            } else if(RENGLONES_INFORMATIVOS[renglon]){
              cedulaSugerida = 'informativo';
              fuenteCedula = 'renglon_dian';
            }
          }
        }

        if(!cedulaSugerida){
          warnings.push({
            tipo: 'uso_dian_no_mapeado',
            mensaje: 'Uso DIAN "' + usoSugerido + '" no está en el mapeo del parser. Asigna cédula manualmente.',
            fila: r
          });
        }
      }

      // Fallback algorítmico (NO IA): si la DIAN no sugirió cédula (reporte sin
      // columna "Uso declaración Sugerida", o uso no mapeado), inferir por
      // concepto/palabras clave. Esto reduce los renglones que el contador debe
      // clasificar a mano. La cédula queda como sugerida (revisable), no forzada.
      if(!cedulaSugerida){
        var heur = clasificarPorHeuristica(detalle, informante);
        if(heur){
          cedulaSugerida = heur.cedula;
          fuenteCedula = heur.fuente;
        }
      }

      registros.push({
        fila: r,
        descripcion: detalle,
        informante: informante,
        nitInformante: nitInfo,
        valor: Math.round(valor),
        retencion: Math.round(retencion),
        usoDIANSugerido: usoSugerido,
        cedulaSugerida: cedulaSugerida,
        cedulaFinal: cedulaSugerida,
        fuenteCedula: fuenteCedula
      });

      var bucket = bucketDeCedula(cedulaSugerida);
      totales.porCedula[bucket] = (totales.porCedula[bucket] || 0) + valor;
      totales.totalGeneral += valor;
      totales.totalRetencion += retencion;
    }

    metadata.totalRegistros = registros.length;
    if(registros.length === 0){
      warnings.push({
        tipo: 'sin_registros',
        mensaje: 'Cabecera detectada en fila ' + headerRow + ' pero sin filas de datos válidos.'
      });
    }

    Object.keys(totales.porCedula).forEach(function(k){ totales.porCedula[k] = Math.round(totales.porCedula[k]); });
    totales.totalGeneral = Math.round(totales.totalGeneral);
    totales.totalRetencion = Math.round(totales.totalRetencion);

    return { metadata: metadata, registros: registros, totales: totales, warnings: warnings };
  }

  return {
    parseExogenaPN: parseExogenaPN,
    MAPEO_USO_DIAN: MAPEO_USO_DIAN,
    MAPEO_RENGLON_CEDULA: MAPEO_RENGLON_CEDULA,
    CONCEPTOS_CATALOGO: CONCEPTOS,
    calcularCuadre: calcularCuadre,
    _internal: {
      findHeaderRowFlexible: findHeaderRowFlexible,
      detectarColumnasPorContenido: detectarColumnasPorContenido,
      detectarMejorHoja: detectarMejorHoja,
      determinarNivel: determinarNivel,
      normalizar: normalizar,
      bucketDeCedula: bucketDeCedula,
      clasificarPorHeuristica: clasificarPorHeuristica,
      extraerRenglon: extraerRenglon,
      MAPEO_RENGLON_CEDULA: MAPEO_RENGLON_CEDULA,
      RENGLONES_INFORMATIVOS: RENGLONES_INFORMATIVOS,
      DETECTORES_ROL: DETECTORES_ROL
    }
  };
}));
