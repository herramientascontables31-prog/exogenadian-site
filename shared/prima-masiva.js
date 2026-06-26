/* ═══════════════════════════════════════════════════════════════════════════
   Aziendale — Liquidación MASIVA de Prima de Servicios por Excel
   ═══════════════════════════════════════════════════════════════════════════
   Lógica pura (sin DOM) + generación de plantilla y exportación Excel.
   Consumido por liquidador-prima.html.

   - Plantilla descargable bonita (tipo de documento, ejemplos, instrucciones,
     tabla de retención).
   - Parser/validador de filas (mismo shape que nomina-masiva-validator).
   - Cálculo de prima por semestre (Art. 306 CST, Ley 1788/2016).
   - Retención en la fuente sobre la prima — Procedimiento 1, prima liquidada
     de forma INDEPENDIENTE (DUR 1625/2016 art. 1.2.4.1.6; Art. 383 y 206 num 10 ET),
     con desglose explicado paso a paso.

   Reutiliza, si están cargados: dias360 / parseFechaLocal (liquidador-engine.js)
   y PARAMS_NOMINA / CONST_NOMINA (nomina-engine.js). Trae fallbacks propios.
   ═══════════════════════════════════════════════════════════════════════════ */

window.PrimaMasiva = (function () {

  /* ─── Columnas de la plantilla ─────────────────────────────────────────── */
  var COLS_BASE = ['tipoDocumento', 'documento', 'nombre', 'salarioBase', 'fechaInicio', 'fechaFin'];
  var COLS_OPC  = ['cargo', 'auxTransporteModo', 'auxTransporteValor', 'promedioVariable', 'aplicaRetencion'];
  var COLS_ALL  = COLS_BASE.concat(COLS_OPC);

  var ENUM_TIPODOC   = ['CC', 'CE', 'TI', 'PEP', 'PPT', 'PA', 'NIT', 'NUIP', 'RC'];
  var ENUM_AUX_MODO  = ['AUTO', 'MANUAL', 'NO'];
  var ENUM_SI_NO     = ['SI', 'NO', 'S', 'N'];

  /* ─── Parámetros de respaldo (si no están los engines) ─────────────────── */
  var FALLBACK = {
    2026: { SMLMV: 1750905, AUX: 249095, UVT: 52374 },
    2025: { SMLMV: 1423500, AUX: 200000, UVT: 49799 },
    2024: { SMLMV: 1300000, AUX: 162000, UVT: 47065 },
  };
  function params(anio) {
    if (typeof PARAMS_NOMINA !== 'undefined' && PARAMS_NOMINA[anio]) return PARAMS_NOMINA[anio];
    if (typeof PARAMS_NOMINA !== 'undefined' && PARAMS_NOMINA[2026]) return PARAMS_NOMINA[2026];
    return FALLBACK[anio] || FALLBACK[2026];
  }
  // Tabla retención Art. 383 ET (mensual, en UVT). Reusa la del engine si existe.
  function tablaRetencion() {
    if (typeof CONST_NOMINA !== 'undefined' && CONST_NOMINA.TABLA_RETENCION) return CONST_NOMINA.TABLA_RETENCION;
    return [
      { hasta: 95,  tarifa: 0.00, base: 0,    acum: 0 },
      { hasta: 150, tarifa: 0.19, base: 95,   acum: 0 },
      { hasta: 360, tarifa: 0.28, base: 150,  acum: (150 - 95) * 0.19 },
      { hasta: 640, tarifa: 0.33, base: 360,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 },
      { hasta: 945, tarifa: 0.35, base: 640,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 },
      { hasta: 2300,tarifa: 0.37, base: 945,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 + (945 - 640) * 0.35 },
      { hasta: Infinity, tarifa: 0.39, base: 2300, acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 + (945 - 640) * 0.35 + (2300 - 945) * 0.37 },
    ];
  }
  var RENTA_EXENTA_PCT = 0.25;            // Art. 206 num 10 ET
  var RENTA_EXENTA_TOPE_UVT_MES = 790 / 12; // 790 UVT/año = 65,83 UVT/mes (Ley 2277/2022)

  /* ─── Helpers de fecha (fallback si no está liquidador-engine) ─────────── */
  function _parseFecha(s) {
    if (typeof parseFechaLocal === 'function') return parseFechaLocal(s);
    if (s instanceof Date) return s;
    var m = String(s).trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    var d = new Date(s);
    return isNaN(d) ? null : d;
  }
  function _dias360(d1, d2) {
    if (typeof dias360 === 'function') return dias360(d1, d2);
    var g1 = d1.getDate(), g2 = d2.getDate();
    if (g1 === 31) g1 = 30;
    if (g2 === 31) g2 = 30;
    return (d2.getFullYear() - d1.getFullYear()) * 360 + (d2.getMonth() - d1.getMonth()) * 30 + (g2 - g1) + 1;
  }

  /* ─── Conversores de tipo ──────────────────────────────────────────────── */
  function toNumber(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;
    var s = String(v).trim().replace(/[\s$,]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '');
    var n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  }
  function toUpper(v) { return v == null ? '' : String(v).trim().toUpperCase(); }
  // Acepta Date, número serial de Excel, o string YYYY-MM-DD / DD-MM-YYYY.
  function toFechaStr(v) {
    if (v == null || v === '') return '';
    if (v instanceof Date) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
    if (typeof v === 'number') { // serial Excel (días desde 1899-12-30)
      var d = new Date(Math.round((v - 25569) * 86400 * 1000));
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
    }
    var s = String(v).trim();
    var m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/); // DD-MM-YYYY o DD/MM/YYYY
    if (m) return m[3] + '-' + pad(+m[2]) + '-' + pad(+m[1]);
    return s; // se asume YYYY-MM-DD
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ─── Normaliza una fila cruda del Excel ───────────────────────────────── */
  function normalizarFila(raw) {
    raw = raw || {};
    var out = {};
    out.tipoDocumento = toUpper(raw.tipoDocumento) || 'CC';
    out.documento = raw.documento != null ? String(raw.documento).trim() : '';
    out.nombre = raw.nombre != null ? String(raw.nombre).trim() : '';
    out.cargo = raw.cargo != null ? String(raw.cargo).trim() : '';
    out.salarioBase = toNumber(raw.salarioBase);
    out.fechaInicio = toFechaStr(raw.fechaInicio);
    out.fechaFin = toFechaStr(raw.fechaFin);
    out.auxTransporteModo = toUpper(raw.auxTransporteModo) || 'AUTO';
    out.auxTransporteValor = toNumber(raw.auxTransporteValor);
    out.promedioVariable = toNumber(raw.promedioVariable);
    var ret = toUpper(raw.aplicaRetencion);
    out.aplicaRetencion = !(ret === 'NO' || ret === 'N' || ret === 'FALSE' || ret === '0');
    return out;
  }

  /* ─── Valida una fila normalizada → array de errores (strings) ─────────── */
  function validarFila(f) {
    var e = [];
    if (!f.documento) e.push('documento vacío');
    if (!f.nombre) e.push('nombre vacío');
    if (ENUM_TIPODOC.indexOf(f.tipoDocumento) < 0) e.push('tipoDocumento inválido (use ' + ENUM_TIPODOC.join('/') + ')');
    if (isNaN(f.salarioBase) || f.salarioBase <= 0) e.push('salarioBase debe ser un número mayor a 0');
    if (ENUM_AUX_MODO.indexOf(f.auxTransporteModo) < 0) e.push('auxTransporteModo inválido (AUTO/MANUAL/NO)');
    if (f.auxTransporteModo === 'MANUAL' && (!f.auxTransporteValor || f.auxTransporteValor <= 0))
      e.push('auxTransporteValor requerido cuando el modo es MANUAL');
    var fi = _parseFecha(f.fechaInicio), ff = _parseFecha(f.fechaFin);
    if (!f.fechaInicio || !fi) e.push('fechaInicio inválida (use AAAA-MM-DD)');
    if (!f.fechaFin || !ff) e.push('fechaFin inválida (use AAAA-MM-DD)');
    if (fi && ff && fi > ff) e.push('fechaInicio posterior a fechaFin');
    return e;
  }

  /* ─── AoA (header en fila 0) → filas crudas ────────────────────────────── */
  function aoaAFilas(aoa) {
    if (!aoa || aoa.length === 0) return { filas: [], errorEsquema: 'La hoja está vacía.' };
    var headers = aoa[0].map(function (h) { return h != null ? String(h).trim() : ''; });
    var faltantes = COLS_BASE.filter(function (c) { return headers.indexOf(c) < 0; });
    if (faltantes.length) {
      return { filas: [], errorEsquema: 'Faltan columnas obligatorias: ' + faltantes.join(', ') +
        '. Descarga la plantilla y no cambies los nombres de las columnas.' };
    }
    var filas = [];
    for (var r = 1; r < aoa.length; r++) {
      var row = aoa[r];
      if (!row || row.every(function (c) { return c == null || String(c).trim() === ''; })) continue;
      var raw = {};
      headers.forEach(function (h, i) { if (h) raw[h] = row[i]; });
      // Saltar filas de ejemplo (documento empieza por "EJEMPLO")
      if (String(raw.nombre || '').toUpperCase().indexOf('EJEMPLO') === 0) continue;
      filas.push(raw);
    }
    return { filas: filas, errorEsquema: null };
  }

  /* ─── Pipeline: AoA → filas normalizadas + errores + resumen ───────────── */
  function procesarAoA(aoa) {
    var p = aoaAFilas(aoa);
    if (p.errorEsquema) return { errorEsquema: p.errorEsquema, filas: [], resumen: null };
    var filas = p.filas.map(function (raw) {
      var f = normalizarFila(raw);
      var errores = validarFila(f);
      return { fila: f, errores: errores, valido: errores.length === 0 };
    });
    var validas = filas.filter(function (r) { return r.valido; }).length;
    return {
      errorEsquema: null,
      filas: filas,
      resumen: { total: filas.length, validas: validas, conErrores: filas.length - validas },
    };
  }

  /* ─── Base de la prima ─────────────────────────────────────────────────── */
  function calcAux(f, anio) {
    var p = params(anio);
    if (f.auxTransporteModo === 'NO') return 0;
    if (f.auxTransporteModo === 'MANUAL') return f.auxTransporteValor || 0;
    return f.salarioBase <= p.SMLMV * 2 ? p.AUX : 0; // AUTO
  }

  /* ─── Retención en la fuente sobre UNA prima (Procedimiento 1, independiente)
        Devuelve el valor y el desglose para explicarlo. ─────────────────── */
  function retencionPrima(prima, anio, aplica) {
    var p = params(anio);
    var topeExenta = RENTA_EXENTA_TOPE_UVT_MES * p.UVT;
    var exenta = Math.min(prima * RENTA_EXENTA_PCT, topeExenta);
    var baseGravable = Math.max(0, prima - exenta);
    var baseUVT = baseGravable / p.UVT;
    var retencion = 0, tarifaTramo = 0, baseTramoUVT = 0;
    if (aplica) {
      var tabla = tablaRetencion();
      for (var i = 0; i < tabla.length; i++) {
        if (baseUVT <= tabla[i].hasta) {
          var exceso = Math.max(0, baseUVT - tabla[i].base);
          retencion = Math.round((tabla[i].acum + exceso * tabla[i].tarifa) * p.UVT);
          tarifaTramo = tabla[i].tarifa;
          baseTramoUVT = tabla[i].base;
          break;
        }
      }
    }
    return {
      uvt: p.UVT, exenta: Math.round(exenta), baseGravable: Math.round(baseGravable),
      baseUVT: baseUVT, retencion: retencion, tarifaTramo: tarifaTramo, baseTramoUVT: baseTramoUVT,
      aplica: !!aplica,
      // Explicación legible
      explicacion: explicaRetencion(prima, exenta, baseGravable, baseUVT, retencion, p.UVT, tarifaTramo, aplica),
    };
  }

  function explicaRetencion(prima, exenta, base, baseUVT, ret, uvt, tarifa, aplica) {
    if (!aplica) return 'Retención desactivada para este empleado (columna aplicaRetencion = NO).';
    var f = function (n) { return '$' + Math.round(n).toLocaleString('es-CO'); };
    var pasos = [];
    pasos.push('1) Prima del semestre: ' + f(prima));
    pasos.push('2) Renta exenta 25% (Art. 206 num 10 ET): −' + f(exenta) +
      (exenta < prima * 0.25 - 1 ? ' (limitada al tope de 65,83 UVT/mes)' : ''));
    pasos.push('3) Base gravable = ' + f(base) + '  →  ' + base.toLocaleString('es-CO') + ' / ' +
      f(uvt) + ' = ' + baseUVT.toFixed(2) + ' UVT');
    if (baseUVT <= 95) {
      pasos.push('4) La base (' + baseUVT.toFixed(2) + ' UVT) no supera 95 UVT → retención = $0 (Art. 383 ET).');
    } else {
      pasos.push('4) Base ' + baseUVT.toFixed(2) + ' UVT cae en el tramo del ' + (tarifa * 100) +
        '% (tabla Art. 383 ET) → retención = ' + f(ret) + '.');
    }
    return pasos.join('\n');
  }

  /* ─── Una prima por cada semestre calendario que toque [fi,ff] ─────────── */
  function primaPorSemestres(fi, ff, sbl, aplicaRet) {
    var rows = [];
    for (var y = fi.getFullYear(); y <= ff.getFullYear(); y++) {
      var sems = [
        { ini: new Date(y, 0, 1), fin: new Date(y, 5, 30),  label: '1.er sem ' + y + ' (ene–jun)', pago: '30 de junio de ' + y },
        { ini: new Date(y, 6, 1), fin: new Date(y, 11, 31), label: '2.º sem ' + y + ' (jul–dic)',  pago: '20 de diciembre de ' + y },
      ];
      sems.forEach(function (sem) {
        var desde = fi > sem.ini ? fi : sem.ini;
        var hasta = ff < sem.fin ? ff : sem.fin;
        if (desde > hasta) return;
        var dias = Math.min(180, _dias360(desde, hasta));
        var prima = Math.round(sbl * dias / 360);
        var ret = retencionPrima(prima, y, aplicaRet);
        rows.push({
          label: sem.label, anio: y, desde: desde, hasta: hasta, dias: dias,
          prima: prima, pago: sem.pago, ret: ret, neto: prima - ret.retencion,
        });
      });
    }
    return rows;
  }

  /* ─── Calcula una fila completa ────────────────────────────────────────── */
  function calcularFila(f) {
    var anio = (_parseFecha(f.fechaFin) || new Date()).getFullYear();
    var aux = calcAux(f, anio);
    var sbl = (f.salarioBase || 0) + aux + (f.promedioVariable || 0);
    var fi = _parseFecha(f.fechaInicio), ff = _parseFecha(f.fechaFin);
    var semestres = primaPorSemestres(fi, ff, sbl, f.aplicaRetencion);
    var totalPrima = 0, totalRet = 0;
    semestres.forEach(function (s) { totalPrima += s.prima; totalRet += s.ret.retencion; });
    return {
      tipoDocumento: f.tipoDocumento, documento: f.documento, nombre: f.nombre, cargo: f.cargo,
      salarioBase: f.salarioBase, aux: aux, promedioVariable: f.promedioVariable, sbl: sbl,
      fechaInicio: f.fechaInicio, fechaFin: f.fechaFin,
      semestres: semestres, totalPrima: totalPrima, totalRetencion: totalRet,
      totalNeto: totalPrima - totalRet,
    };
  }

  function calcularTodos(filasValidas) {
    return filasValidas.map(function (r) { return calcularFila(r.fila); });
  }

  /* ─── PLANTILLA descargable ────────────────────────────────────────────── */
  function descargarPlantilla(XLSX) {
    if (typeof XLSX === 'undefined') throw new Error('XLSX no cargado');

    var headers = COLS_ALL.slice();
    var ejemplos = [
      { tipoDocumento: 'CC', documento: '1010101010', nombre: 'EJEMPLO 1 — salario mínimo, semestre completo',
        salarioBase: 1750905, fechaInicio: '2026-01-01', fechaFin: '2026-06-30',
        cargo: 'Auxiliar', auxTransporteModo: 'AUTO', auxTransporteValor: 0, promedioVariable: 0, aplicaRetencion: 'SI' },
      { tipoDocumento: 'CC', documento: '2020202020', nombre: 'EJEMPLO 2 — salario alto con comisiones (causa retención)',
        salarioBase: 9000000, fechaInicio: '2026-01-01', fechaFin: '2026-06-30',
        cargo: 'Gerente comercial', auxTransporteModo: 'NO', auxTransporteValor: 0, promedioVariable: 1500000, aplicaRetencion: 'SI' },
      { tipoDocumento: 'CE', documento: '3030303030', nombre: 'EJEMPLO 3 — ingreso a mitad de semestre',
        salarioBase: 2200000, fechaInicio: '2026-03-15', fechaFin: '2026-06-30',
        cargo: 'Vendedor', auxTransporteModo: 'AUTO', auxTransporteValor: 0, promedioVariable: 0, aplicaRetencion: 'SI' },
    ];

    // Hoja 1: Empleados
    var aoa = [headers].concat(ejemplos.map(function (e) {
      return headers.map(function (h) { return e[h] != null ? e[h] : ''; });
    }));
    var ws1 = XLSX.utils.aoa_to_sheet(aoa);
    ws1['!cols'] = headers.map(function (h) {
      if (h === 'nombre') return { wch: 46 };
      if (h === 'cargo') return { wch: 22 };
      if (h === 'salarioBase' || h === 'auxTransporteValor' || h === 'promedioVariable') return { wch: 16 };
      if (h === 'fechaInicio' || h === 'fechaFin') return { wch: 13 };
      if (h === 'auxTransporteModo') return { wch: 17 };
      return { wch: 14 };
    });
    ws1['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Hoja 2: Instrucciones
    var ins = [
      ['PLANTILLA DE LIQUIDACIÓN MASIVA DE PRIMA DE SERVICIOS'],
      ['Aziendale · Art. 306 CST · Ley 1788/2016 · Retención: Art. 383 y 206 num 10 ET'],
      [''],
      ['CÓMO USARLA'],
      ['  1. Borra las filas de EJEMPLO y escribe tus empleados (una fila por empleado).'],
      ['  2. No cambies los nombres ni el orden de las columnas.'],
      ['  3. Guarda el archivo y súbelo en la calculadora de prima → "Liquidación masiva por Excel".'],
      ['  4. Guarda este mismo archivo como tu HISTÓRICO: cada semestre lo actualizas y vuelves a subir.'],
      [''],
      ['COLUMNAS OBLIGATORIAS'],
      ['  tipoDocumento   →  CC | CE | TI | PEP | PPT | PA | NIT | NUIP | RC'],
      ['  documento       →  Número de identificación (texto)'],
      ['  nombre          →  Nombre completo del empleado'],
      ['  salarioBase     →  Salario básico mensual, sin auxilio de transporte'],
      ['  fechaInicio     →  Primer día del período a liquidar (AAAA-MM-DD). Semestre completo: 2026-01-01 o 2026-07-01'],
      ['  fechaFin        →  Último día trabajado del período (AAAA-MM-DD). Semestre completo: 2026-06-30 o 2026-12-31'],
      [''],
      ['COLUMNAS OPCIONALES'],
      ['  cargo               →  Cargo del empleado (solo informativo / histórico)'],
      ['  auxTransporteModo   →  AUTO (regla legal automática) | MANUAL (valor especial) | NO (no aplica). Default AUTO'],
      ['  auxTransporteValor  →  Valor del auxilio, SOLO si el modo es MANUAL'],
      ['  promedioVariable    →  Promedio mensual de comisiones/horas extra/bonificaciones del semestre'],
      ['  aplicaRetencion     →  SI | NO. Default SI. Calcula retención en la fuente sobre la prima'],
      [''],
      ['CÓMO SE CALCULA LA PRIMA'],
      ['  Prima = (salario + auxilio de transporte + promedio variable) × días del semestre / 360'],
      ['  Art. 306 CST (Ley 1788/2016): 30 días de salario al año, por semestres.'],
      ['  El auxilio de transporte SÍ entra a la base de la prima cuando el empleado lo devenga (≤ 2 SMLMV).'],
      [''],
      ['CÓMO SE CALCULA LA RETENCIÓN EN LA FUENTE SOBRE LA PRIMA (Procedimiento 1)'],
      ['  La prima mínima legal de servicios del sector privado se liquida de forma INDEPENDIENTE'],
      ['  (no se suma al salario del mes) — DUR 1625/2016, art. 1.2.4.1.6.'],
      ['  Paso 1: Prima del semestre.'],
      ['  Paso 2: Resta el 25% de renta exenta (Art. 206 num 10 ET), con tope de 65,83 UVT/mes.'],
      ['  Paso 3: La base gravable resultante se divide por la UVT y se ubica en la tabla del Art. 383 ET.'],
      ['  Paso 4: Si la base no supera 95 UVT, la retención es $0. (La mayoría de primas de salario mínimo dan $0.)'],
      [''],
      ['PARÁMETROS APLICADOS — AÑO 2026'],
      ['  SMLMV: $1.750.905   ·   Auxilio transporte: $249.095   ·   UVT: $52.374 (Res. DIAN 000238/2025)'],
      [''],
      ['Generado por exogenadian.com — herramienta orientativa, no reemplaza la liquidación oficial.'],
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(ins);
    ws2['!cols'] = [{ wch: 104 }];

    // Hoja 3: Tabla retención Art. 383 (referencia)
    var tabla = tablaRetencion();
    var ref = [['TABLA DE RETENCIÓN EN LA FUENTE — Art. 383 ET (rangos mensuales en UVT)'], [''],
      ['Desde (UVT)', 'Hasta (UVT)', 'Tarifa marginal', 'Impuesto acumulado (UVT)']];
    tabla.forEach(function (t) {
      ref.push([t.base, t.hasta === Infinity ? 'en adelante' : t.hasta,
        (t.tarifa * 100) + '%', Math.round(t.acum * 100) / 100]);
    });
    ref.push(['']); ref.push(['UVT 2026: $52.374 (Resolución DIAN 000238 de 15-dic-2025)']);
    var ws3 = XLSX.utils.aoa_to_sheet(ref);
    ws3['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 24 }];

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Empleados');
    XLSX.utils.book_append_sheet(wb, ws2, 'Instrucciones');
    XLSX.utils.book_append_sheet(wb, ws3, 'Tabla 383');
    XLSX.writeFile(wb, 'plantilla_prima_exogenadian.xlsx');
  }

  /* ─── EXPORTAR resultados a Excel ──────────────────────────────────────── */
  function fFecha(d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); }

  function exportarExcel(XLSX, resultados, empresa, etiquetaProceso) {
    if (typeof XLSX === 'undefined') throw new Error('XLSX no cargado');
    empresa = empresa || {};
    var wb = XLSX.utils.book_new();

    // Hoja Detalle: una fila por (empleado × semestre)
    var det = [[
      'Tipo doc', 'Documento', 'Nombre', 'Cargo', 'Período', 'Desde', 'Hasta', 'Días',
      'Base prima', 'Prima', 'Renta exenta 25%', 'Base gravable', 'Base (UVT)', 'Retención fuente', 'Neto a pagar', 'Pago máximo',
    ]];
    resultados.forEach(function (r) {
      r.semestres.forEach(function (s) {
        det.push([
          r.tipoDocumento, r.documento, r.nombre, r.cargo || '', s.label,
          fFecha(s.desde), fFecha(s.hasta), s.dias,
          Math.round(r.sbl), s.prima, s.ret.exenta, s.ret.baseGravable,
          Math.round(s.ret.baseUVT * 100) / 100, s.ret.retencion, s.neto, s.pago,
        ]);
      });
    });
    var wsDet = XLSX.utils.aoa_to_sheet(det);
    wsDet['!cols'] = [{ wch: 9 }, { wch: 14 }, { wch: 30 }, { wch: 18 }, { wch: 18 },
      { wch: 11 }, { wch: 11 }, { wch: 6 }, { wch: 14 }, { wch: 14 }, { wch: 15 },
      { wch: 14 }, { wch: 11 }, { wch: 15 }, { wch: 14 }, { wch: 22 }];
    wsDet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Hoja Resumen: una fila por empleado
    var res = [['Tipo doc', 'Documento', 'Nombre', 'Cargo', 'Total prima', 'Total retención', 'Total neto']];
    var tP = 0, tR = 0, tN = 0;
    resultados.forEach(function (r) {
      res.push([r.tipoDocumento, r.documento, r.nombre, r.cargo || '', r.totalPrima, r.totalRetencion, r.totalNeto]);
      tP += r.totalPrima; tR += r.totalRetencion; tN += r.totalNeto;
    });
    res.push(['', '', 'TOTALES', '', tP, tR, tN]);
    var wsRes = XLSX.utils.aoa_to_sheet(res);
    wsRes['!cols'] = [{ wch: 9 }, { wch: 14 }, { wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    wsRes['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Hoja Portada
    var port = [
      ['LIQUIDACIÓN MASIVA DE PRIMA DE SERVICIOS'],
      ['Empresa', empresa.nombre || ''],
      ['NIT', empresa.nit || ''],
      ['Proceso', etiquetaProceso || ''],
      ['Empleados', resultados.length],
      ['Total prima', tP],
      ['Total retención fuente', tR],
      ['Total neto a pagar', tN],
      [''],
      ['Art. 306 CST · Ley 1788/2016 · Retención Art. 383 y 206 num 10 ET (Procedimiento 1)'],
      ['Generado por exogenadian.com — herramienta orientativa.'],
    ];
    var wsPort = XLSX.utils.aoa_to_sheet(port);
    wsPort['!cols'] = [{ wch: 24 }, { wch: 40 }];

    XLSX.utils.book_append_sheet(wb, wsPort, 'Resumen general');
    XLSX.utils.book_append_sheet(wb, wsRes, 'Por empleado');
    XLSX.utils.book_append_sheet(wb, wsDet, 'Detalle por semestre');

    var fname = 'prima_masiva' + (etiquetaProceso ? '_' + String(etiquetaProceso).replace(/[^\w-]+/g, '_') : '') + '.xlsx';
    XLSX.writeFile(wb, fname);
  }

  return {
    COLS_BASE: COLS_BASE, COLS_OPC: COLS_OPC, COLS_ALL: COLS_ALL,
    ENUM_TIPODOC: ENUM_TIPODOC,
    procesarAoA: procesarAoA, normalizarFila: normalizarFila, validarFila: validarFila,
    calcularFila: calcularFila, calcularTodos: calcularTodos, retencionPrima: retencionPrima,
    descargarPlantilla: descargarPlantilla, exportarExcel: exportarExcel,
  };
})();
