/* ═══════════════════════════════════════════════════════════════════════════
   Aziendale — Liquidación MASIVA de Prima de Servicios por Excel
   ═══════════════════════════════════════════════════════════════════════════
   Lógica pura (sin DOM) + generación de plantilla (ExcelJS, con estilo) y
   exportación Excel. Consumido por liquidador-prima.html.

   - Plantilla descargable con encabezados en español, columnas resaltadas en
     amarillo (cargo, contrato, fechas, causa de retiro), moneda en $ y fechas
     DD/MM/AAAA — igual a la plantilla que usa Gestión Humana.
   - Parser/validador que entiende los encabezados en español (y los antiguos
     en inglés) y acepta el auxilio como VALOR o como modo (AUTO/MANUAL/NO).
   - Usa diasTrabajados si viene; si no, cuenta los días por las fechas (360).
   - Cálculo de prima por semestre (Art. 306 CST, Ley 1788/2016).
   - Retención en la fuente sobre la prima — Procedimiento 1, prima liquidada
     de forma INDEPENDIENTE (DUR 1625/2016 art. 1.2.4.1.6; Art. 383 y 206 num 10 ET),
     con desglose explicado paso a paso.

   Reutiliza, si están cargados: dias360 / parseFechaLocal (liquidador-engine.js)
   y PARAMS_NOMINA / CONST_NOMINA (nomina-engine.js). Trae fallbacks propios.
   ═══════════════════════════════════════════════════════════════════════════ */

window.PrimaMasiva = (function () {

  /* ─── Columnas de la plantilla (orden visible, encabezados en español) ──── */
  var COLUMNAS = [
    { key: 'tipoDocumento', titulo: 'TIPO DE DOCUMENTO', ancho: 17, oblig: true },
    { key: 'documento',     titulo: 'NÚMERO DE DOCUMENTO', ancho: 19, oblig: true },
    { key: 'nombre',        titulo: 'nombre',             ancho: 38, oblig: true },
    { key: 'cargo',         titulo: 'CARGO',              ancho: 22, novedad: true },
    { key: 'tipoContrato',  titulo: 'TIPO DE CONTRATO',   ancho: 18, novedad: true },
    { key: 'fechaInicio',   titulo: 'FECHA DE INGRESO',   ancho: 16, novedad: true, fecha: true, oblig: true },
    { key: 'fechaFin',      titulo: 'FECHA DE RETIRO',    ancho: 16, novedad: true, fecha: true, oblig: true },
    { key: 'causaRetiro',   titulo: 'CAUSA DE RETIRO',    ancho: 22, novedad: true },
    { key: 'salarioBase',   titulo: 'salarioBase',        ancho: 16, money: true, oblig: true },
    { key: 'diasTrabajados',titulo: 'diasTrabajados',     ancho: 14 },
    { key: 'auxTransporte', titulo: 'AUXILIO DE TRANSPORTE', ancho: 20, money: true },
    { key: 'promedioVariable', titulo: 'PROMEDIO VARIABLE', ancho: 18, money: true },
    { key: 'aplicaRetencion',  titulo: 'APLICA RETENCIÓN',  ancho: 16 },
  ];
  var COLS_BASE = COLUMNAS.filter(function (c) { return c.oblig; }).map(function (c) { return c.key; });
  var COLS_ALL = COLUMNAS.map(function (c) { return c.key; });

  /* Aliases de encabezado (normalizados sin tildes/minúsculas) → key interna */
  var ALIAS = {
    'tipo de documento': 'tipoDocumento', 'tipodocumento': 'tipoDocumento', 'tipo doc': 'tipoDocumento', 'tipo documento': 'tipoDocumento',
    'numero de documento': 'documento', 'número de documento': 'documento', 'documento': 'documento', 'cedula': 'documento', 'cédula': 'documento', 'identificacion': 'documento', 'no documento': 'documento', 'nit': 'documento',
    'nombre': 'nombre', 'nombres': 'nombre', 'nombre completo': 'nombre', 'empleado': 'nombre',
    'cargo': 'cargo',
    'tipo de contrato': 'tipoContrato', 'tipocontrato': 'tipoContrato', 'tipo contrato': 'tipoContrato', 'contrato': 'tipoContrato',
    'fecha de ingreso': 'fechaInicio', 'fechaingreso': 'fechaInicio', 'fecha ingreso': 'fechaInicio', 'fechainicio': 'fechaInicio', 'fecha de inicio': 'fechaInicio', 'fecha inicio': 'fechaInicio',
    'fecha de retiro': 'fechaFin', 'fecharetiro': 'fechaFin', 'fecha retiro': 'fechaFin', 'fechafin': 'fechaFin', 'fecha de corte': 'fechaFin', 'fecha corte': 'fechaFin', 'fecha de salida': 'fechaFin',
    'causa de retiro': 'causaRetiro', 'causaretiro': 'causaRetiro', 'causa retiro': 'causaRetiro', 'motivo de retiro': 'causaRetiro', 'motivo retiro': 'causaRetiro',
    'salariobase': 'salarioBase', 'salario base': 'salarioBase', 'salario': 'salarioBase', 'sueldo': 'salarioBase', 'salario basico': 'salarioBase',
    'diastrabajados': 'diasTrabajados', 'dias trabajados': 'diasTrabajados', 'días trabajados': 'diasTrabajados', 'dias': 'diasTrabajados',
    'auxilio de transporte': 'auxTransporte', 'auxtransporte': 'auxTransporte', 'aux transporte': 'auxTransporte', 'auxilio transporte': 'auxTransporte', 'auxtransportemodo': 'auxTransporte', 'auxtransportevalor': 'auxTransporte', 'auxilio': 'auxTransporte',
    'promediovariable': 'promedioVariable', 'promedio variable': 'promedioVariable', 'salario variable': 'promedioVariable', 'variable': 'promedioVariable', 'comisiones': 'promedioVariable',
    'aplicaretencion': 'aplicaRetencion', 'aplica retencion': 'aplicaRetencion', 'aplica retención': 'aplicaRetencion', 'retencion': 'aplicaRetencion', 'retefuente': 'aplicaRetencion',
  };

  var ENUM_TIPODOC = ['CC', 'CE', 'TI', 'PEP', 'PPT', 'PA', 'NIT', 'NUIP', 'RC'];

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
  var RENTA_EXENTA_PCT = 0.25;
  var RENTA_EXENTA_TOPE_UVT_MES = 790 / 12;

  /* ─── Helpers de fecha ─────────────────────────────────────────────────── */
  function _parseFecha(s) {
    if (typeof parseFechaLocal === 'function' && typeof s === 'string' && /^\d{4}-/.test(s)) return parseFechaLocal(s);
    if (s instanceof Date) return s;
    var m = String(s).trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    var d = new Date(s);
    return isNaN(d) ? null : d;
  }
  function _dias360(d1, d2) {
    if (typeof dias360 === 'function') return dias360(d1, d2);
    var g1 = Math.min(d1.getDate(), 30), g2 = Math.min(d2.getDate(), 30);
    return (d2.getFullYear() - d1.getFullYear()) * 360 + (d2.getMonth() - d1.getMonth()) * 30 + (g2 - g1) + 1;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function norm(s) {
    return String(s == null ? '' : s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
  }

  /* ─── Conversores de tipo ──────────────────────────────────────────────── */
  // Acepta "1.423.500,00" (CO), "1,423,500.00" (US), "200000" o número.
  function toNumber(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;
    var s = String(v).trim().replace(/[^\d.,-]/g, '');
    if (!s) return NaN;
    var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.'), dec = null;
    if (lc > -1 && ld > -1) { dec = lc > ld ? ',' : '.'; }
    else if (lc > -1) { var a = s.length - lc - 1; dec = (a > 0 && a < 3 && (s.match(/,/g) || []).length === 1) ? ',' : null; }
    else if (ld > -1) { var b = s.length - ld - 1; dec = (b > 0 && b < 3 && (s.match(/\./g) || []).length === 1) ? '.' : null; }
    if (dec) { var thou = dec === ',' ? '.' : ','; s = s.split(thou).join('').replace(dec, '.'); }
    else { s = s.replace(/[.,]/g, ''); }
    var n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  }
  function toUpper(v) { return v == null ? '' : String(v).trim().toUpperCase(); }
  function toFechaStr(v) {
    if (v == null || v === '') return '';
    if (v instanceof Date) return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
    if (typeof v === 'number') { // serial Excel (días desde 1899-12-30)
      var d = new Date(Math.round((v - 25569) * 86400 * 1000));
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
    }
    var s = String(v).trim();
    var m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/); // DD/MM/YYYY
    if (m) return m[3] + '-' + pad(+m[2]) + '-' + pad(+m[1]);
    return s; // AAAA-MM-DD u otro
  }

  /* ─── Normaliza una fila cruda ─────────────────────────────────────────── */
  function normalizarFila(raw) {
    raw = raw || {};
    var out = {};
    out.tipoDocumento = toUpper(raw.tipoDocumento) || 'CC';
    out.documento = raw.documento != null ? String(raw.documento).trim() : '';
    out.nombre = raw.nombre != null ? String(raw.nombre).trim() : '';
    out.cargo = raw.cargo != null ? String(raw.cargo).trim() : '';
    out.tipoContrato = raw.tipoContrato != null ? String(raw.tipoContrato).trim() : '';
    out.causaRetiro = raw.causaRetiro != null ? String(raw.causaRetiro).trim() : '';
    out.salarioBase = toNumber(raw.salarioBase);
    out.fechaInicio = toFechaStr(raw.fechaInicio);
    out.fechaFin = toFechaStr(raw.fechaFin);
    out.diasTrabajados = (raw.diasTrabajados === '' || raw.diasTrabajados == null) ? null : toNumber(raw.diasTrabajados);
    out.promedioVariable = toNumber(raw.promedioVariable);
    var ret = toUpper(raw.aplicaRetencion);
    out.aplicaRetencion = !(ret === 'NO' || ret === 'N' || ret === 'FALSE' || ret === '0');
    // Auxilio: acepta número (valor manual), AUTO, NO, MANUAL+valor
    var auxRaw = raw.auxTransporte;
    var auxU = toUpper(auxRaw);
    if (auxRaw == null || auxU === '' || auxU === 'AUTO') { out.auxTransporteModo = 'AUTO'; out.auxTransporteValor = 0; }
    else if (auxU === 'NO' || auxU === '0') { out.auxTransporteModo = 'NO'; out.auxTransporteValor = 0; }
    else if (auxU === 'MANUAL') { out.auxTransporteModo = 'MANUAL'; out.auxTransporteValor = 0; }
    else { var n = toNumber(auxRaw); if (!isNaN(n) && n > 0) { out.auxTransporteModo = 'MANUAL'; out.auxTransporteValor = n; } else { out.auxTransporteModo = 'AUTO'; out.auxTransporteValor = 0; } }
    return out;
  }

  function validarFila(f) {
    var e = [];
    if (!f.documento) e.push('falta el número de documento');
    if (!f.nombre) e.push('falta el nombre');
    if (ENUM_TIPODOC.indexOf(f.tipoDocumento) < 0) e.push('tipo de documento inválido (use ' + ENUM_TIPODOC.join('/') + ')');
    if (isNaN(f.salarioBase) || f.salarioBase <= 0) e.push('el salario debe ser un número mayor a 0');
    var fi = _parseFecha(f.fechaInicio), ff = _parseFecha(f.fechaFin);
    if (!f.fechaInicio || !fi || isNaN(fi)) e.push('fecha de ingreso inválida');
    if (!f.fechaFin || !ff || isNaN(ff)) e.push('fecha de retiro inválida');
    if (fi && ff && !isNaN(fi) && !isNaN(ff) && fi > ff) e.push('la fecha de ingreso es posterior a la de retiro');
    if (f.diasTrabajados != null && (isNaN(f.diasTrabajados) || f.diasTrabajados < 0)) e.push('diasTrabajados inválido');
    return e;
  }

  /* ─── AoA (header en fila 0) → filas crudas, con aliases de encabezado ──── */
  function aoaAFilas(aoa) {
    if (!aoa || aoa.length === 0) return { filas: [], errorEsquema: 'La hoja está vacía.' };
    // Detectar fila de encabezado: la primera fila que mapee ≥3 columnas conocidas
    var headerRow = -1, mapCols = null;
    for (var h = 0; h < Math.min(aoa.length, 8); h++) {
      var cand = (aoa[h] || []).map(function (c) { return ALIAS[norm(c)] || null; });
      if (cand.filter(Boolean).length >= 3) { headerRow = h; mapCols = cand; break; }
    }
    if (headerRow < 0) return { filas: [], errorEsquema: 'No se reconocieron las columnas. Descarga la plantilla y no cambies los encabezados.' };
    var faltantes = COLS_BASE.filter(function (k) { return mapCols.indexOf(k) < 0; });
    if (faltantes.length) {
      var nombres = COLUMNAS.filter(function (c) { return faltantes.indexOf(c.key) >= 0; }).map(function (c) { return c.titulo; });
      return { filas: [], errorEsquema: 'Faltan columnas obligatorias: ' + nombres.join(', ') + '.' };
    }
    var filas = [];
    for (var r = headerRow + 1; r < aoa.length; r++) {
      var row = aoa[r];
      if (!row || row.every(function (c) { return c == null || String(c).trim() === ''; })) continue;
      var raw = {};
      mapCols.forEach(function (k, i) { if (k && raw[k] == null) raw[k] = row[i]; });
      if (String(raw.nombre || '').toUpperCase().indexOf('EJEMPLO') === 0) continue;
      filas.push(raw);
    }
    return { filas: filas, errorEsquema: null };
  }

  function procesarAoA(aoa) {
    var p = aoaAFilas(aoa);
    if (p.errorEsquema) return { errorEsquema: p.errorEsquema, filas: [], resumen: null };
    var filas = p.filas.map(function (raw) {
      var f = normalizarFila(raw);
      var errores = validarFila(f);
      return { fila: f, errores: errores, valido: errores.length === 0 };
    });
    var validas = filas.filter(function (r) { return r.valido; }).length;
    return { errorEsquema: null, filas: filas, resumen: { total: filas.length, validas: validas, conErrores: filas.length - validas } };
  }

  /* ─── Base de la prima ─────────────────────────────────────────────────── */
  function calcAux(f, anio) {
    var p = params(anio);
    if (f.auxTransporteModo === 'NO') return 0;
    if (f.auxTransporteModo === 'MANUAL') return f.auxTransporteValor || (f.salarioBase <= p.SMLMV * 2 ? p.AUX : 0);
    return f.salarioBase <= p.SMLMV * 2 ? p.AUX : 0; // AUTO
  }

  /* ─── Retención en la fuente sobre UNA prima (Procedimiento 1) ─────────── */
  function retencionPrima(prima, anio, aplica) {
    var p = params(anio);
    var topeExenta = RENTA_EXENTA_TOPE_UVT_MES * p.UVT;
    var exenta = Math.min(prima * RENTA_EXENTA_PCT, topeExenta);
    var baseGravable = Math.max(0, prima - exenta);
    var baseUVT = baseGravable / p.UVT;
    var retencion = 0, tarifaTramo = 0;
    if (aplica) {
      var tabla = tablaRetencion();
      for (var i = 0; i < tabla.length; i++) {
        if (baseUVT <= tabla[i].hasta) {
          var exceso = Math.max(0, baseUVT - tabla[i].base);
          retencion = Math.round((tabla[i].acum + exceso * tabla[i].tarifa) * p.UVT);
          tarifaTramo = tabla[i].tarifa;
          break;
        }
      }
    }
    return {
      uvt: p.UVT, exenta: Math.round(exenta), baseGravable: Math.round(baseGravable),
      baseUVT: baseUVT, retencion: retencion, tarifaTramo: tarifaTramo, aplica: !!aplica,
      explicacion: explicaRetencion(prima, exenta, baseGravable, baseUVT, retencion, p.UVT, tarifaTramo, aplica),
    };
  }

  function explicaRetencion(prima, exenta, base, baseUVT, ret, uvt, tarifa, aplica) {
    if (!aplica) return 'Retención desactivada para este empleado (columna APLICA RETENCIÓN = NO).';
    var f = function (n) { return '$' + Math.round(n).toLocaleString('es-CO'); };
    var pasos = [];
    pasos.push('1) Prima del semestre: ' + f(prima));
    pasos.push('2) Renta exenta 25% (Art. 206 num 10 ET): −' + f(exenta) +
      (exenta < prima * 0.25 - 1 ? ' (limitada al tope de 65,83 UVT/mes)' : ''));
    pasos.push('3) Base gravable = ' + f(base) + '  →  ' + base.toLocaleString('es-CO') + ' / ' + f(uvt) + ' = ' + baseUVT.toFixed(2) + ' UVT');
    if (baseUVT <= 95) pasos.push('4) La base (' + baseUVT.toFixed(2) + ' UVT) no supera 95 UVT → retención = $0 (Art. 383 ET).');
    else pasos.push('4) Base ' + baseUVT.toFixed(2) + ' UVT cae en el tramo del ' + (tarifa * 100) + '% (tabla Art. 383 ET) → retención = ' + f(ret) + '.');
    return pasos.join('\n');
  }

  /* ─── Una prima por cada semestre calendario que toque [fi,ff] ─────────── */
  function primaPorSemestres(fi, ff, sbl, aplicaRet, diasOverride) {
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
        rows.push({ label: sem.label, anio: y, desde: desde, hasta: hasta, dias: Math.min(180, _dias360(desde, hasta)), pago: sem.pago });
      });
    }
    // Si el usuario dio diasTrabajados y el período cae en UN solo semestre, respétalo.
    if (diasOverride != null && !isNaN(diasOverride) && diasOverride > 0 && rows.length === 1) {
      rows[0].dias = Math.min(180, diasOverride);
      rows[0].diasManual = true;
    }
    rows.forEach(function (r) {
      r.prima = Math.round(sbl * r.dias / 360);
      r.ret = retencionPrima(r.prima, r.anio, aplicaRet);
      r.neto = r.prima - r.ret.retencion;
    });
    return rows;
  }

  function calcularFila(f) {
    var anio = (_parseFecha(f.fechaFin) || new Date()).getFullYear();
    var aux = calcAux(f, anio);
    var sbl = (f.salarioBase || 0) + aux + (f.promedioVariable || 0);
    var fi = _parseFecha(f.fechaInicio), ff = _parseFecha(f.fechaFin);
    var semestres = primaPorSemestres(fi, ff, sbl, f.aplicaRetencion, f.diasTrabajados);
    var totalPrima = 0, totalRet = 0;
    semestres.forEach(function (s) { totalPrima += s.prima; totalRet += s.ret.retencion; });
    return {
      tipoDocumento: f.tipoDocumento, documento: f.documento, nombre: f.nombre, cargo: f.cargo,
      tipoContrato: f.tipoContrato, causaRetiro: f.causaRetiro,
      salarioBase: f.salarioBase, aux: aux, promedioVariable: f.promedioVariable, sbl: sbl,
      fechaInicio: f.fechaInicio, fechaFin: f.fechaFin,
      semestres: semestres, totalPrima: totalPrima, totalRetencion: totalRet, totalNeto: totalPrima - totalRet,
    };
  }

  function calcularTodos(filasValidas) {
    return filasValidas.map(function (r) { return calcularFila(r.fila); });
  }

  /* ─── Descarga genérica de un Blob ─────────────────────────────────────── */
  function descargarBlob(blob, nombre) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
  }

  /* ─── PLANTILLA descargable con estilo (ExcelJS) ───────────────────────── */
  var DARK = 'FF1B3A5C', YELLOW = 'FFFFFF00', WHITE = 'FFFFFFFF', GREY = 'FF6B7280';
  function ejemplos() {
    return [
      { tipoDocumento: 'CC', documento: '1003103689', nombre: 'EJEMPLO 1 — semestre completo', cargo: 'Operario', tipoContrato: 'FIJO',
        fechaInicio: new Date(2026, 0, 1), fechaFin: new Date(2026, 5, 30), causaRetiro: '', salarioBase: 1750905, diasTrabajados: 180, auxTransporte: 249095, promedioVariable: 0, aplicaRetencion: 'SI' },
      { tipoDocumento: 'PPT', documento: '1428386', nombre: 'EJEMPLO 2 — retiro a mitad de semestre', cargo: 'Vendedor', tipoContrato: 'FIJO',
        fechaInicio: new Date(2026, 0, 1), fechaFin: new Date(2026, 4, 17), causaRetiro: 'RENUNCIA VOLUNTARIA', salarioBase: 1750905, diasTrabajados: 137, auxTransporte: 249095, promedioVariable: 0, aplicaRetencion: 'SI' },
      { tipoDocumento: 'CC', documento: '1064489709', nombre: 'EJEMPLO 3 — salario alto con comisiones', cargo: 'Gerente', tipoContrato: 'INDEFINIDO',
        fechaInicio: new Date(2026, 0, 1), fechaFin: new Date(2026, 5, 30), causaRetiro: '', salarioBase: 9000000, diasTrabajados: 180, auxTransporte: 'NO', promedioVariable: 1500000, aplicaRetencion: 'SI' },
    ];
  }

  function descargarPlantilla(ExcelLib) {
    if (typeof ExcelLib === 'undefined' || !ExcelLib) return Promise.reject(new Error('ExcelJS no cargado'));
    var wb = new ExcelLib.Workbook();
    wb.creator = 'Aziendale · exogenadian.com';

    /* Hoja Empleados */
    var ws = wb.addWorksheet('Empleados', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = COLUMNAS.map(function (c) { return { key: c.key, width: c.ancho }; });
    var thin = { style: 'thin', color: { argb: 'FFD0D7DE' } };
    var border = { top: thin, bottom: thin, left: thin, right: thin };

    // Encabezado
    var hr = ws.addRow(COLUMNAS.reduce(function (o, c) { o[c.key] = c.titulo; return o; }, {}));
    hr.height = 30;
    COLUMNAS.forEach(function (c, i) {
      var cell = hr.getCell(i + 1);
      var amarillo = !!c.novedad;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: amarillo ? YELLOW : DARK } };
      cell.font = { bold: true, color: { argb: amarillo ? DARK : WHITE }, size: 9.5 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = border;
    });

    // Filas de ejemplo
    ejemplos().forEach(function (e) {
      var row = ws.addRow(e);
      COLUMNAS.forEach(function (c, i) {
        var cell = row.getCell(i + 1);
        cell.border = border;
        if (c.money && typeof e[c.key] === 'number') cell.numFmt = '"$" #,##0';
        if (c.fecha) cell.numFmt = 'dd/mm/yyyy';
        if (c.key === 'salarioBase' || c.key === 'diasTrabajados') cell.font = { color: { argb: GREY }, italic: true };
      });
      row.getCell(3).font = { italic: true, color: { argb: GREY } }; // nombre ejemplo en gris
    });

    /* Hoja Instrucciones */
    var wi = wb.addWorksheet('Instrucciones');
    wi.columns = [{ width: 108 }];
    var titulo = function (t) { var r = wi.addRow([t]); r.getCell(1).font = { bold: true, color: { argb: DARK }, size: 11 }; };
    var linea = function (t) { wi.addRow([t]); };
    titulo('PLANTILLA DE LIQUIDACIÓN MASIVA DE PRIMA DE SERVICIOS');
    linea('Aziendale · Art. 306 CST · Ley 1788/2016 · Retención: Art. 383 y 206 num 10 ET'); linea('');
    titulo('CÓMO USARLA');
    linea('  1. Borra las filas de EJEMPLO y escribe tus empleados (una fila por empleado).');
    linea('  2. No cambies los encabezados (las columnas amarillas son las novedades del período).');
    linea('  3. Guárdala y súbela en la calculadora de prima → "Liquidación masiva por Excel".');
    linea('  4. Usa este mismo archivo como tu HISTÓRICO: lo actualizas cada semestre y lo vuelves a subir.'); linea('');
    titulo('COLUMNAS');
    linea('  TIPO DE DOCUMENTO    →  CC · CE · TI · PEP · PPT · PA · NIT · NUIP · RC');
    linea('  NÚMERO DE DOCUMENTO  →  Identificación del empleado');
    linea('  nombre               →  Nombre completo');
    linea('  CARGO                →  Cargo (informativo)');
    linea('  TIPO DE CONTRATO     →  FIJO · INDEFINIDO · OBRA O LABOR · etc. (informativo)');
    linea('  FECHA DE INGRESO     →  Inicio del período a liquidar (formato fecha)');
    linea('  FECHA DE RETIRO      →  Fin del período (o 30/06 / 31/12 si sigue activo)');
    linea('  CAUSA DE RETIRO      →  Motivo si aplica (informativo)');
    linea('  salarioBase          →  Salario básico mensual, sin auxilio de transporte');
    linea('  diasTrabajados       →  Días del semestre (opcional). Si lo dejas vacío, se calculan por las fechas (método 360).');
    linea('  AUXILIO DE TRANSPORTE→  Un valor en $ (se usa tal cual) · AUTO (regla legal) · NO (no aplica)');
    linea('  PROMEDIO VARIABLE    →  Promedio mensual de comisiones/horas extra/bonos del semestre');
    linea('  APLICA RETENCIÓN     →  SI · NO (calcula retención en la fuente sobre la prima)'); linea('');
    titulo('CÓMO SE CALCULA');
    linea('  Prima = (salario + auxilio + promedio variable) × días del semestre / 360  (Art. 306 CST).');
    linea('  Retención (Procedimiento 1, prima independiente — DUR 1625/2016 art. 1.2.4.1.6):');
    linea('    Prima − 25% renta exenta (Art. 206 num 10 ET, tope 65,83 UVT/mes) → ubicar en tabla Art. 383 ET.');
    linea('    Si la base no supera 95 UVT, la retención es $0 (la mayoría de primas de salario mínimo).'); linea('');
    titulo('PARÁMETROS 2026');
    linea('  SMLMV: $1.750.905   ·   Auxilio: $249.095   ·   UVT: $52.374 (Res. DIAN 000238/2025).');
    linea('  (Para liquidaciones de 2025 usa salario $1.423.500 y auxilio $200.000; el motor aplica el año de la fecha de retiro.)');
    linea(''); linea('Generado por exogenadian.com — herramienta orientativa, no reemplaza la liquidación oficial.');

    /* Hoja Tabla 383 */
    var wt = wb.addWorksheet('Tabla 383');
    wt.columns = [{ width: 14 }, { width: 14 }, { width: 16 }, { width: 24 }];
    var t0 = wt.addRow(['TABLA DE RETENCIÓN — Art. 383 ET (rangos mensuales en UVT)']);
    t0.getCell(1).font = { bold: true, color: { argb: DARK } };
    wt.addRow([]);
    var th = wt.addRow(['Desde (UVT)', 'Hasta (UVT)', 'Tarifa marginal', 'Impuesto acum. (UVT)']);
    th.eachCell(function (c) { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } }; c.font = { bold: true, color: { argb: WHITE } }; });
    tablaRetencion().forEach(function (t) {
      wt.addRow([t.base, t.hasta === Infinity ? 'en adelante' : t.hasta, (t.tarifa * 100) + '%', Math.round(t.acum * 100) / 100]);
    });
    wt.addRow([]); wt.addRow(['UVT 2026: $52.374 (Resolución DIAN 000238 de 15-dic-2025)']);

    return wb.xlsx.writeBuffer().then(function (buf) {
      descargarBlob(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'plantilla_prima_exogenadian.xlsx');
    });
  }

  /* ─── EXPORTAR resultados a Excel (XLSX) ────────────────────────────────── */
  function fFecha(d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); }

  function exportarExcel(XLSX, resultados, empresa, etiquetaProceso) {
    if (typeof XLSX === 'undefined') throw new Error('XLSX no cargado');
    empresa = empresa || {};
    var wb = XLSX.utils.book_new();

    var det = [[
      'Tipo doc', 'Documento', 'Nombre', 'Cargo', 'Contrato', 'Causa retiro', 'Período', 'Desde', 'Hasta', 'Días',
      'Base prima', 'Prima', 'Renta exenta 25%', 'Base gravable', 'Base (UVT)', 'Retención fuente', 'Neto a pagar', 'Pago máximo',
    ]];
    resultados.forEach(function (r) {
      r.semestres.forEach(function (s) {
        det.push([r.tipoDocumento, r.documento, r.nombre, r.cargo || '', r.tipoContrato || '', r.causaRetiro || '',
          s.label, fFecha(s.desde), fFecha(s.hasta), s.dias, Math.round(r.sbl), s.prima, s.ret.exenta, s.ret.baseGravable,
          Math.round(s.ret.baseUVT * 100) / 100, s.ret.retencion, s.neto, s.pago]);
      });
    });
    var wsDet = XLSX.utils.aoa_to_sheet(det);
    wsDet['!cols'] = [{ wch: 9 }, { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 20 }, { wch: 18 },
      { wch: 11 }, { wch: 11 }, { wch: 6 }, { wch: 13 }, { wch: 13 }, { wch: 14 }, { wch: 13 }, { wch: 10 }, { wch: 14 }, { wch: 13 }, { wch: 20 }];
    wsDet['!freeze'] = { xSplit: 0, ySplit: 1 };

    var res = [['Tipo doc', 'Documento', 'Nombre', 'Cargo', 'Contrato', 'Total prima', 'Total retención', 'Total neto']];
    var tP = 0, tR = 0, tN = 0;
    resultados.forEach(function (r) {
      res.push([r.tipoDocumento, r.documento, r.nombre, r.cargo || '', r.tipoContrato || '', r.totalPrima, r.totalRetencion, r.totalNeto]);
      tP += r.totalPrima; tR += r.totalRetencion; tN += r.totalNeto;
    });
    res.push(['', '', 'TOTALES', '', '', tP, tR, tN]);
    var wsRes = XLSX.utils.aoa_to_sheet(res);
    wsRes['!cols'] = [{ wch: 9 }, { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    wsRes['!freeze'] = { xSplit: 0, ySplit: 1 };

    var port = [
      ['LIQUIDACIÓN MASIVA DE PRIMA DE SERVICIOS'],
      ['Empresa', empresa.nombre || ''], ['NIT', empresa.nit || ''], ['Proceso', etiquetaProceso || ''],
      ['Empleados', resultados.length], ['Total prima', tP], ['Total retención fuente', tR], ['Total neto a pagar', tN],
      [''], ['Art. 306 CST · Ley 1788/2016 · Retención Art. 383 y 206 num 10 ET (Procedimiento 1)'],
      ['Generado por exogenadian.com — herramienta orientativa.'],
    ];
    var wsPort = XLSX.utils.aoa_to_sheet(port);
    wsPort['!cols'] = [{ wch: 24 }, { wch: 40 }];

    XLSX.utils.book_append_sheet(wb, wsPort, 'Resumen general');
    XLSX.utils.book_append_sheet(wb, wsRes, 'Por empleado');
    XLSX.utils.book_append_sheet(wb, wsDet, 'Detalle por semestre');
    XLSX.writeFile(wb, 'prima_masiva' + (etiquetaProceso ? '_' + String(etiquetaProceso).replace(/[^\w-]+/g, '_') : '') + '.xlsx');
  }

  return {
    COLUMNAS: COLUMNAS, COLS_BASE: COLS_BASE, COLS_ALL: COLS_ALL, ENUM_TIPODOC: ENUM_TIPODOC,
    procesarAoA: procesarAoA, normalizarFila: normalizarFila, validarFila: validarFila,
    calcularFila: calcularFila, calcularTodos: calcularTodos, retencionPrima: retencionPrima,
    descargarPlantilla: descargarPlantilla, exportarExcel: exportarExcel,
  };
})();
