/**
 * Aziendale — Parser de declaraciones oficiales DIAN en PDF (F110 / F300 / F350)
 *
 * Hallazgo clave: el PDF oficial diligenciado (el que descarga el contribuyente
 * del MUISCA) vuelca los valores de las casillas EN ORDEN al final del flujo de
 * texto, después del bloque de identificación. Por eso un parser posicional por
 * casilla funciona, y se puede AUTOVALIDAR con las identidades de totales del
 * propio formulario (c44 = Σ36..43, c58 = Σ47..57, c41 = Σ27..40, c107 = c105+c106…).
 * Si por redondeo una casilla en cero se "pierde" en la extracción, el autoalineado
 * prueba pequeños desfases y se queda con el que hace cuadrar los totales.
 *
 * El texto del PDF se obtiene con shared/pension-pdf-parser.js (PensionPDFParser.extractText),
 * que ya carga pdf.js lazy. Este módulo solo mapea texto → casillas.
 *
 * NO usa IA: es algoritmo puro sobre el PDF. El humano confirma/edita las casillas
 * en una grilla antes de cruzar (red de seguridad ante PDFs con layout distinto).
 */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.DianDeclParser = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function () {
  'use strict';

  // ── Orden de casillas tal como aparecen en el flujo de texto ────────────────
  // F110: arranca con datos informativos 33,34,35 y sigue 36..117 (renglón a renglón)
  var ORDER_110 = [33, 34, 35].concat(seq(36, 117));
  // F300: arranca en 27 (ingresos) y sigue hasta 100. Casillas 1..26 son encabezado.
  var ORDER_300 = seq(27, 100);
  // F350 (retención): valores 27..84 aprox. Solo necesitamos totales; mapeo laxo.
  var ORDER_350 = seq(27, 84);

  function seq(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }

  function quitarTildes(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  // ── Detección de formulario ─────────────────────────────────────────────────
  function detectForm(text) {
    var t = quitarTildes(text || '').toLowerCase();
    if (/impuesto sobre las ventas|declaracion del impuesto sobre las ventas|\biva\b/.test(t) && /\b300\b/.test(t)) return '300';
    // F210 (renta personas naturales) ANTES que F110: comparte frases ("patrimonio
    // bruto", "renta liquida gravable") y sin esta rama se parseaba como 110 con
    // las casillas equivocadas. El 210 NO se procesa aquí — su herramienta es el
    // Liquidador 210 PRO (formato210-pro.html).
    if (/cedula general|rentas de trabajo|personas naturales y asimiladas|cedulas? de pensiones/.test(t)) return '210';
    if (/\b21\d{11}\b/.test(text) && !/\b11\d{11}\b/.test(text)) return '210';
    if (/declaracion de renta y complementario|patrimonio bruto|renta liquida gravable/.test(t)) return '110';
    if (/retencion(es)? en la fuente|declaracion de retencion/.test(t)) return '350';
    // Heurística por número grande de formulario: 13 dígitos que empiezan por 30 = IVA
    if (/\b30\d{11}\b/.test(text)) return '300';
    if (/\b11\d{11}\b/.test(text)) return '110';
    return null;
  }

  // ── Tokenización de montos ──────────────────────────────────────────────────
  // Un token es VALOR si es "0" o un número agrupado por miles (con . o ,).
  // Esto excluye NIT (dígitos sueltos espaciados), número de formulario (13 dígitos
  // pegados) y fechas (con / o -).
  function isMoneyTok(tok) {
    if (tok === '0') return true;
    return /^\d{1,3}([.,]\d{3})+$/.test(tok);
  }
  function toNum(tok) {
    if (tok === '0') return 0;
    return parseInt(tok.replace(/[.,]/g, ''), 10) || 0;
  }

  // Devuelve el arreglo de valores (números) del flujo de texto a partir de un anchor.
  function valuesAfter(text, anchorRegex) {
    var idx = 0;
    if (anchorRegex) {
      var m, last = -1, re = new RegExp(anchorRegex.source, anchorRegex.flags.replace('g', '') + 'g');
      while ((m = re.exec(text)) !== null) { last = m.index + m[0].length; }
      if (last >= 0) idx = last;
    }
    var tail = text.slice(idx);
    // Cortar en la firma / sello para no arrastrar basura
    var cut = tail.search(/PRIVADA|Firma del declarante|Espacio exclusivo|981\.|101\. No\. Identificacion/i);
    if (cut > 40) tail = tail.slice(0, cut);
    var toks = tail.split(/\s+/);
    var vals = [];
    for (var i = 0; i < toks.length; i++) {
      if (isMoneyTok(toks[i])) vals.push(toNum(toks[i]));
    }
    return vals;
  }

  // ── Mapeo posicional + autoalineado por totales ─────────────────────────────
  function mapByOrder(vals, order, offset) {
    var c = {};
    for (var i = 0; i < order.length; i++) {
      var v = vals[i + offset];
      c[order[i]] = (typeof v === 'number') ? v : 0;
    }
    return c;
  }

  // Identidades de control por formulario (para validar/autoalinear). Tolerancia en pesos.
  function scoreF110(c) {
    var hits = 0;
    if (close(c[44], c[36] + c[37] + c[38] + c[39] + c[40] + c[41] + c[42] + c[43])) hits++;
    if (close(c[46], c[44] - c[45])) hits++;
    if (close(c[58], c[47] + c[48] + c[49] + c[50] + c[51] + c[52] + c[53] + c[54] + c[55] + c[56] + c[57])) hits++;
    if (close(c[61], c[58] - c[59] - c[60])) hits++;
    if (close(c[67], c[62] + c[63] + c[64] + c[65] + c[66])) hits++;
    if (close(c[107], c[105] + c[106])) hits++;
    return hits;
  }
  function scoreF300(c) {
    var hits = 0;
    var sumIng = 0; for (var k = 27; k <= 40; k++) sumIng += (c[k] || 0);
    if (close(c[41], sumIng)) hits++;
    if (close(c[43], c[41] - c[42])) hits++;
    var sumComp = 0; for (var j = 44; j <= 54; j++) sumComp += (c[j] || 0);
    if (close(c[55], sumComp)) hits++;
    if (close(c[57], c[55] - c[56])) hits++;
    return hits;
  }
  function close(a, b) { return Math.abs((a || 0) - (b || 0)) <= 1000; }

  function autoAlign(vals, order, scorer) {
    var best = { offset: 0, score: -1, casillas: null };
    for (var off = 0; off <= 4 && off < vals.length; off++) {
      var c = mapByOrder(vals, order, off);
      var s = scorer(c);
      if (s > best.score) best = { offset: off, score: s, casillas: c };
    }
    return best;
  }

  // ── Parsers de texto (unit-testables sin pdf.js) ────────────────────────────
  function parseTextF110(text) {
    var vals = valuesAfter(text, /\b11\d{11}\b/); // tras el número de formulario (13 díg, 11…)
    var a = autoAlign(vals, ORDER_110, scoreF110);
    var c = a.casillas || mapByOrder(vals, ORDER_110, 0);
    return {
      form: '110',
      casillas: c,
      derivados: {
        ingresosBrutos: c[58], ingresosNetos: c[61], ingresosOrdinarios: c[47],
        ingresosFinancieros: c[48], otrosIngresos: c[57],
        costos: c[62], totalCostosDeducciones: c[67], nomina: c[33],
        patrimonioBruto: c[44], pasivos: c[45], patrimonioLiquido: c[46],
        retenciones: c[107], rentaLiquidaGravable: c[79], totalImpuestoCargo: c[99],
        saldoPagar: c[113], saldoFavor: c[114]
      },
      validacion: { score: a.score, ok: a.score >= 3, offset: a.offset, totalValores: vals.length }
    };
  }

  function parseTextF300(text) {
    var vals = valuesAfter(text, /\b(Bimestral|Cuatrimestral|Anual)\b/i);
    var a = autoAlign(vals, ORDER_300, scoreF300);
    var c = a.casillas || mapByOrder(vals, ORDER_300, 0);
    return {
      form: '300',
      casillas: c,
      derivados: {
        // Ingresos
        ingresosBrutos: c[41], ingresosNetos: c[43],
        gravadasGeneral: c[28], gravadas5: c[27],
        aiuGravada: c[29],            // base gravable especial AIU
        exportacionBienes: c[30], exportacionServicios: c[31],
        ventasCI: c[32], ventasZF: c[33],
        exentas: c[35], excluidas: c[39], noGravadas: c[40],
        devolucionesVentas: c[42],
        // Compras / IVA
        comprasBrutas: c[55], comprasNetas: c[57],
        ivaGenerado: c[67], ivaPagadoFacturado: c[77], ivaDescontable: c[81],
        retencionesIvaPracticadas: c[85],
        saldoPagar: c[88], saldoFavor: c[89]
      },
      validacion: { score: a.score, ok: a.score >= 2, offset: a.offset, totalValores: vals.length }
    };
  }

  function parseTextF350(text) {
    var vals = valuesAfter(text, /\bMensual\b/i);
    var c = mapByOrder(vals, ORDER_350, 0);
    return { form: '350', casillas: c, derivados: { totalRetenciones: c[84] || c[83] }, validacion: { ok: vals.length > 5, totalValores: vals.length } };
  }

  function parseText(text) {
    var form = detectForm(text);
    if (form === '110') return parseTextF110(text);
    if (form === '300') return parseTextF300(text);
    if (form === '350') return parseTextF350(text);
    if (form === '210') return { form: '210', error: 'Es un F210 (renta personas naturales) — este parser no lo procesa.' };
    return { form: null, error: 'No se reconoció el formulario (¿es un PDF oficial 110/300/350 de la DIAN?).' };
  }

  // ── API de alto nivel: recibe un File PDF ───────────────────────────────────
  function parse(file) {
    if (typeof global.PensionPDFParser === 'undefined' || !global.PensionPDFParser.extractText) {
      return Promise.reject(new Error('Falta shared/pension-pdf-parser.js para leer el PDF.'));
    }
    return global.PensionPDFParser.extractText(file).then(function (r) {
      var out = parseText(r.text || '');
      out.numPages = r.numPages;
      // Metadatos de cabecera
      out.meta = readHeader(r.text || '', out.form);
      return out;
    });
  }

  function readHeader(text, form) {
    var meta = { anio: null, nit: null, razon: null, periodo: null };
    var mAnio = text.match(/(?:^|\s)(20\d\d)(?:\s|$)/);
    if (mAnio) meta.anio = mAnio[1];
    // NIT: secuencia de 9-10 dígitos sueltos espaciados
    var mNit = text.match(/(?:\d\s){8,10}\d/);
    if (mNit) meta.nit = mNit[0].replace(/\s/g, '');
    if (form === '300') {
      var mPer = text.match(/\b(Bimestral|Cuatrimestral|Anual)\b/i);
      if (mPer) meta.periodo = mPer[1];
    }
    return meta;
  }

  return {
    parse: parse,
    parseText: parseText,
    parseTextF110: parseTextF110,
    parseTextF300: parseTextF300,
    parseTextF350: parseTextF350,
    detectForm: detectForm,
    ORDER_110: ORDER_110, ORDER_300: ORDER_300,
    _internal: { valuesAfter: valuesAfter, isMoneyTok: isMoneyTok, autoAlign: autoAlign, scoreF110: scoreF110, scoreF300: scoreF300 }
  };
}));
