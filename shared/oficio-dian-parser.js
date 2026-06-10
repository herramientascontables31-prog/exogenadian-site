/**
 * ExogenaDIAN — Lector de oficios / requerimientos de la DIAN
 *
 * El contador pega (o sube) el oficio persuasivo / emplazamiento / requerimiento
 * que le llegó al contribuyente. Este módulo extrae —con ALGORITMO, no IA— las
 * cifras y conceptos que la DIAN señaló y los mapea a cada cruce de la herramienta,
 * para responder punto por punto a lo que realmente pidieron.
 *
 * Mapea conceptos → id de cruce del motor (auditor-cruces-dian.html):
 *   1 Ingresos Renta vs IVA   2 Ingresos vs FE/terceros   3 Consignaciones
 *   4 Costos vs soportes      5 Costos vs exógena terceros 6 Retenciones
 *   7 Patrimonio              8 IVA/AIU
 */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.OficioDianParser = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function () {
  'use strict';

  function quitarTildes(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  // Monto en pesos colombianos: agrupado por miles, ≥ 1.000.000 (≥2 grupos de .000)
  // o precedido por $. Excluye números de artículo, años, radicados pegados.
  var RX_MONTO = /\$\s?\d{1,3}(?:\.\d{3})+(?:,\d+)?|\b\d{1,3}(?:\.\d{3}){2,}(?:,\d+)?\b/g;
  function montos(seg) {
    var out = [], m;
    RX_MONTO.lastIndex = 0;
    while ((m = RX_MONTO.exec(seg)) !== null) {
      var n = parseInt(m[0].replace(/[^\d]/g, ''), 10);
      if (!isNaN(n) && n >= 1000000) out.push(n);
    }
    return out;
  }

  // Reglas concepto → cruce. El orden importa: lo más específico primero.
  var REGLAS = [
    { id: 5, concepto: 'Costos vs exógena de terceros', test: function (t) { return /(costo|deduc|gasto|compra)/.test(t) && /tercero/.test(t); } },
    { id: 1, concepto: 'Ingresos: Renta vs IVA', test: function (t) { return /ingreso/.test(t) && /(\biva\b|formulario 300|impuesto sobre las ventas)/.test(t); } },
    { id: 3, concepto: 'Consignaciones bancarias vs ingresos', test: function (t) { return /(consignaci|credito(s)? bancario|movimiento(s)? bancario|movimiento(s)? financiero|cuenta(s)? bancaria|deposito(s)? bancario)/.test(t); } },
    { id: 4, concepto: 'Costos y deducciones vs soportes', test: function (t) { return /(costo|deduc|gasto)/.test(t) && /(no soportad|sin soporte|compra(s)? facturada|proveedor|importacion|nomina|documento soporte|factura electronica|radian|771-2|616-1|desconoc|rechaz|improceden|no proceden|glosa)/.test(t); } },
    { id: 6, concepto: 'Retenciones', test: function (t) { return /retencion/.test(t) && !/(costo|deduc|gasto)/.test(t); } },
    { id: 7, concepto: 'Patrimonio', test: function (t) { return /(patrimonio|incremento patrimonial|comparacion patrimonial|activo(s)? omitid|pasivo(s)? inexistente|239-1)/.test(t); } },
    { id: 2, concepto: 'Ingresos vs facturación electrónica / terceros', test: function (t) { return /ingreso/.test(t) && /(factura(cion)? electronica|fe emitida|documentos electronicos|reportad|adicion|adicionar|omitid|omision|no declarad|mayor (valor|ingreso)|subfactura)/.test(t); } }
  ];

  function clasificar(segNorm) {
    for (var i = 0; i < REGLAS.length; i++) { if (REGLAS[i].test(segNorm)) return REGLAS[i]; }
    return null;
  }

  // Segmenta el texto en frases/ítems (por salto de línea o numeración o punto).
  function segmentar(text) {
    var t = text.replace(/\r/g, '');
    // Corta por: saltos de línea; fin de frase (". " antes de mayúscula);
    // numeración ("1." "2)"); viñetas; y etiquetas tipo "Movimientos bancarios:".
    var partes = t.split(/\n+|\.\s+(?=[A-ZÁÉÍÓÚÑ])|(?=\b\d{1,2}[\.\)]\s)|(?=•\s)|(?=- )/);
    return partes.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 12; });
  }

  function meta(text) {
    var out = { numeroOficio: null, tipo: null, anioGravable: null, jurisdiccion: null, impuesto: null };
    var tnorm = quitarTildes(text).toLowerCase();
    if (/requerimiento especial/.test(tnorm)) out.tipo = 'Requerimiento especial';
    else if (/emplazamiento/.test(tnorm) && /no declarar|omiso/.test(tnorm)) out.tipo = 'Emplazamiento por no declarar';
    else if (/emplazamiento/.test(tnorm)) out.tipo = 'Emplazamiento para corregir';
    else if (/liquidacion( oficial)? de aforo|\baforo\b/.test(tnorm)) out.tipo = 'Liquidación de aforo';
    else if (/liquidacion provisional/.test(tnorm)) out.tipo = 'Liquidación provisional';
    else if (/liquidacion (oficial|de revision)/.test(tnorm)) out.tipo = 'Liquidación';
    else if (/pliego de cargos/.test(tnorm)) out.tipo = 'Pliego de cargos';
    else if (/requerimiento (ordinario|de informacion)/.test(tnorm)) out.tipo = 'Requerimiento ordinario de información';
    else if (/persuasiv|invita.*(declarar|corregir)|inconsistencia/.test(tnorm)) out.tipo = 'Oficio persuasivo';
    // Número: prioriza resolución/auto/liquidación, luego oficio/radicado
    var mRes = text.match(/(?:resoluci[oó]n|auto|liquidaci[oó]n|requerimiento)\s*n[°ºo\.]*\s*[:#]?\s*(\d{6,16})/i);
    var mOf = text.match(/(?:oficio|radicado|n[uú]mero|no\.?|n[°º])\s*[:#]?\s*(\d{6,16})/i);
    out.numeroOficio = (mRes && mRes[1]) || (mOf && mOf[1]) || null;
    var mAnio = text.match(/(?:a[ñn]o|per[ií]odo)\s+gravable\s+(20\d\d)/i);
    if (mAnio) out.anioGravable = mAnio[1];
    // Jurisdicción / impuesto (DIAN nacional vs municipal/ICA)
    if (/industria y comercio|\bica\b|reteica|avisos y tableros/.test(tnorm)) { out.jurisdiccion = 'municipal'; out.impuesto = 'ICA'; }
    else if (/impuesto sobre las ventas|\biva\b/.test(tnorm)) { out.jurisdiccion = 'nacional'; out.impuesto = 'IVA'; }
    else if (/impuesto (sobre la |de )?renta/.test(tnorm)) { out.jurisdiccion = 'nacional'; out.impuesto = 'Renta'; }
    else if (/\bdian\b|nacional/.test(tnorm)) { out.jurisdiccion = 'nacional'; }
    else if (/municipio|distrital|alcald[ií]a|secretar[ií]a de hacienda/.test(tnorm)) { out.jurisdiccion = 'municipal'; }
    return out;
  }

  function parse(text) {
    text = text || '';
    var segs = segmentar(text);
    var byId = {};
    segs.forEach(function (seg) {
      var segN = quitarTildes(seg).toLowerCase();
      var regla = clasificar(segN);
      if (!regla) return;
      var ms = montos(seg);
      if (!byId[regla.id]) byId[regla.id] = { cruceId: regla.id, concepto: regla.concepto, montos: [], fragmento: seg.slice(0, 240) };
      byId[regla.id].montos = byId[regla.id].montos.concat(ms);
    });
    var items = Object.keys(byId).map(function (k) {
      var it = byId[k];
      // valorDian = la cifra "externa" que alega la DIAN (la mayor del segmento suele serlo)
      it.valorDian = it.montos.length ? Math.max.apply(null, it.montos) : null;
      return it;
    }).sort(function (a, b) { return a.cruceId - b.cruceId; });
    var m = meta(text);
    return { tipo: m.tipo, numeroOficio: m.numeroOficio, anioGravable: m.anioGravable, jurisdiccion: m.jurisdiccion, impuesto: m.impuesto, items: items, totalDetectado: items.length };
  }

  return { parse: parse, _internal: { montos: montos, clasificar: clasificar, segmentar: segmentar } };
}));
