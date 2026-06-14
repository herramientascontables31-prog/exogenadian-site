/* ═══════════════════════════════════════════════════════════════════════════
   ExógenaDIAN — Validador de Plantilla de Nómina Masiva
   ═══════════════════════════════════════════════════════════════════════════
   Pure logic (no DOM): parsea filas crudas del Excel, normaliza tipos y valida
   cada fila. Testable en node. Consumido por nomina-masiva.html.

   Convierte "SI"/"NO" → boolean, strings numéricos → number, normaliza
   mayúsculas en enums. Devuelve para cada fila: el objeto normalizado,
   las advertencias de validación y un flag `valido`.
   ═══════════════════════════════════════════════════════════════════════════ */

var NOMINA_VALIDATOR = (function() {

  // Columnas obligatorias y avanzadas (mismas que la plantilla descargable)
  var COLS_BASE = [
    'cedula', 'nombre', 'salarioBase', 'diasTrabajados', 'auxTransporteModo',
    'nivelARL', 'tipoEmpleador', 'heDiurnas', 'heNocturnas', 'recargoNocturno',
    'diasVacaciones', 'otrosDescuentos',
  ];
  var COLS_AVANZADAS = [
    'auxTransporteValor', 'heDomDiurnas', 'heDomNocturnas', 'recargoDomDiurno',
    'recargoDomNocturno', 'diasIncapacidad', 'bonificaciones', 'comisiones',
    'noSalarialGravable', 'noSalarialNoGravable',
    'depDependientes', 'interesesVivienda', 'medicinaPrepagada',
    // Datos bancarios (opcionales) — para el archivo de dispersión bancaria
    'banco', 'tipoCuenta', 'numeroCuenta',
    // Salario integral (opcional, SI/NO)
    'salarioIntegral',
    // Incapacidad laboral (ATEL) y licencia remunerada (maternidad/paternidad/luto)
    'diasIncapLaboral', 'diasLicencia',
  ];
  var COLS_ALL = COLS_BASE.concat(COLS_AVANZADAS);

  var ENUM_AUX_MODO = ['AUTO', 'MANUAL', 'NO'];
  var ENUM_TIPO_EMPLEADOR = ['SOCIEDAD', 'PN_2_MAS', 'PN_1', 'SIN_ANIMO_LUCRO', 'OTRO'];
  var ENUM_SI_NO = ['SI', 'NO', 'S', 'N', 'YES', 'TRUE', 'FALSE'];

  // Campos numéricos (todos los demás de COLS_ALL)
  var CAMPOS_NUMERICOS = [
    'salarioBase', 'diasTrabajados', 'nivelARL',
    'heDiurnas', 'heNocturnas', 'recargoNocturno',
    'diasVacaciones', 'otrosDescuentos',
    'auxTransporteValor', 'heDomDiurnas', 'heDomNocturnas',
    'recargoDomDiurno', 'recargoDomNocturno', 'diasIncapacidad',
    'bonificaciones', 'comisiones',
    'noSalarialGravable', 'noSalarialNoGravable',
    'interesesVivienda', 'medicinaPrepagada',
    'diasIncapLaboral', 'diasLicencia',
  ];

  /* ─── Helpers ─── */
  function toNumber(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;
    var s = String(v).trim().replace(/[\s$,]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '');
    var n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  }

  function toBool(v) {
    if (typeof v === 'boolean') return v;
    if (v == null || v === '') return false;
    var s = String(v).trim().toUpperCase();
    return s === 'SI' || s === 'S' || s === 'YES' || s === 'TRUE' || s === '1';
  }

  function toUpperEnum(v) {
    if (v == null) return '';
    return String(v).trim().toUpperCase();
  }

  /* ─── Normaliza una fila cruda (objeto con valores tal cual del Excel)
        a un objeto con tipos correctos para el engine. ─── */
  function normalizarFila(raw) {
    raw = raw || {};
    var out = {};

    // Cedula y nombre como strings
    out.cedula = raw.cedula != null ? String(raw.cedula).trim() : '';
    out.nombre = raw.nombre != null ? String(raw.nombre).trim() : '';

    // Enums en mayúscula
    out.auxTransporteModo = toUpperEnum(raw.auxTransporteModo);
    out.tipoEmpleador = toUpperEnum(raw.tipoEmpleador);

    // Booleano depDependientes
    out.depDependientes = toBool(raw.depDependientes);

    // Datos bancarios (opcionales) — passthrough como string para dispersión
    out.banco = raw.banco != null ? String(raw.banco).trim() : '';
    out.tipoCuenta = toUpperEnum(raw.tipoCuenta);  // AHORRO / CORRIENTE
    out.numeroCuenta = raw.numeroCuenta != null ? String(raw.numeroCuenta).trim() : '';

    // Salario integral (opcional)
    out.salarioIntegral = toBool(raw.salarioIntegral);

    // Numéricos
    for (var i = 0; i < CAMPOS_NUMERICOS.length; i++) {
      var k = CAMPOS_NUMERICOS[i];
      out[k] = toNumber(raw[k]);
    }

    // diasTrabajados default 30 si vacío o cero (interpretamos 0 como "no especificado")
    if (out.diasTrabajados == null || out.diasTrabajados === 0 || isNaN(out.diasTrabajados)) {
      out.diasTrabajados = 30;
    }

    // anio default 2026
    out.anio = raw.anio ? toNumber(raw.anio) : 2026;

    // Estructura para el engine: deducciones agrupadas
    out.deducciones = {
      dependientes: out.depDependientes,
      interesesVivienda: out.interesesVivienda || 0,
      medicinaPrepagada: out.medicinaPrepagada || 0,
      aportesAFC: 0,           // no en plantilla v1
      pensionVoluntaria: 0,    // no en plantilla v1
    };

    return out;
  }

  /* ─── Valida una fila normalizada. Devuelve array de mensajes (vacío = OK). ─── */
  function validarFila(fila, idx) {
    var errores = [];
    var prefix = 'Fila ' + (idx != null ? (idx + 1) : '?') + ': ';

    if (!fila.cedula) errores.push(prefix + 'cédula vacía');
    if (!fila.nombre) errores.push(prefix + 'nombre vacío');

    if (!fila.salarioBase || fila.salarioBase <= 0)
      errores.push(prefix + 'salarioBase debe ser mayor que cero');

    if (fila.diasTrabajados < 1 || fila.diasTrabajados > 30)
      errores.push(prefix + 'diasTrabajados debe estar entre 1 y 30');

    if (ENUM_AUX_MODO.indexOf(fila.auxTransporteModo) < 0)
      errores.push(prefix + 'auxTransporteModo debe ser AUTO, MANUAL o NO (recibido: "' + fila.auxTransporteModo + '")');

    if (fila.auxTransporteModo === 'MANUAL' && (!fila.auxTransporteValor || fila.auxTransporteValor <= 0))
      errores.push(prefix + 'auxTransporteValor requerido cuando modo es MANUAL');

    if (fila.nivelARL < 1 || fila.nivelARL > 5 || fila.nivelARL !== Math.floor(fila.nivelARL))
      errores.push(prefix + 'nivelARL debe ser entero 1-5');

    if (ENUM_TIPO_EMPLEADOR.indexOf(fila.tipoEmpleador) < 0)
      errores.push(prefix + 'tipoEmpleador debe ser SOCIEDAD, PN_2_MAS, PN_1, SIN_ANIMO_LUCRO u OTRO (recibido: "' + fila.tipoEmpleador + '")');

    // Validar que valores numéricos no sean NaN ni negativos
    var camposNoNeg = [
      'heDiurnas', 'heNocturnas', 'recargoNocturno', 'diasVacaciones', 'otrosDescuentos',
      'heDomDiurnas', 'heDomNocturnas', 'recargoDomDiurno', 'recargoDomNocturno',
      'diasIncapacidad', 'bonificaciones', 'comisiones',
      'noSalarialGravable', 'noSalarialNoGravable',
      'interesesVivienda', 'medicinaPrepagada',
      'diasIncapLaboral', 'diasLicencia',
    ];
    for (var i = 0; i < camposNoNeg.length; i++) {
      var k = camposNoNeg[i];
      if (isNaN(fila[k])) errores.push(prefix + k + ' no es un número válido');
      else if (fila[k] < 0) errores.push(prefix + k + ' no puede ser negativo');
    }

    if (fila.diasIncapacidad + fila.diasVacaciones > 30)
      errores.push(prefix + 'diasIncapacidad + diasVacaciones no puede exceder 30');

    return errores;
  }

  /* ─── Convierte AoA (array of arrays con header en fila 0) a filas crudas. ─── */
  function aoaAFilasCrudas(aoa) {
    if (!aoa || aoa.length === 0) return { filas: [], errorEsquema: 'Hoja vacía' };
    var headers = aoa[0].map(function(h) { return h != null ? String(h).trim() : ''; });

    // Verificar que estén las columnas base
    var faltantes = [];
    for (var i = 0; i < COLS_BASE.length; i++) {
      if (headers.indexOf(COLS_BASE[i]) < 0) faltantes.push(COLS_BASE[i]);
    }
    if (faltantes.length > 0) {
      return {
        filas: [],
        errorEsquema: 'Columnas obligatorias faltantes: ' + faltantes.join(', ')
                      + '. Descarga la plantilla de nuevo.',
      };
    }

    // Construir filas crudas
    var filas = [];
    for (var r = 1; r < aoa.length; r++) {
      var row = aoa[r];
      // Saltar filas completamente vacías
      var algo = false;
      for (var c = 0; c < row.length; c++) {
        if (row[c] != null && row[c] !== '') { algo = true; break; }
      }
      if (!algo) continue;

      var raw = {};
      for (var c2 = 0; c2 < headers.length; c2++) {
        if (headers[c2]) raw[headers[c2]] = row[c2];
      }
      filas.push(raw);
    }

    return { filas: filas, errorEsquema: null };
  }

  /* ─── Pipeline completo: AoA → filas normalizadas + errores ─── */
  function procesarAoA(aoa) {
    var p = aoaAFilasCrudas(aoa);
    if (p.errorEsquema) {
      return { errorEsquema: p.errorEsquema, filas: [], resumen: null };
    }

    var resultado = p.filas.map(function(raw, idx) {
      var fila = normalizarFila(raw);
      var errores = validarFila(fila, idx);
      return { fila: fila, errores: errores, valido: errores.length === 0 };
    });

    var totalFilas = resultado.length;
    var filasValidas = resultado.filter(function(r) { return r.valido; }).length;
    var totalErrores = resultado.reduce(function(s, r) { return s + r.errores.length; }, 0);

    return {
      errorEsquema: null,
      filas: resultado,
      resumen: {
        total: totalFilas,
        validas: filasValidas,
        conErrores: totalFilas - filasValidas,
        totalErrores: totalErrores,
      },
    };
  }

  /* ─── Revisión "Pulso": anomalías sobre la nómina YA calculada ───
        Recibe los resultados del engine (liquidarNominaMasiva) y el SMLMV
        vigente. Devuelve [{ nivel:'alta'|'media'|'info', i, msg }]. Es lógica
        pura para detectar errores típicos antes de pagar/transmitir. */
  function revisionPulso(resultados, smlmv) {
    var issues = [];
    smlmv = smlmv || 1750905;
    (resultados || []).forEach(function(r, i) {
      var ref = 'Fila ' + (i + 1) + ' (' + (r.nombre || r.cedula || '?') + '): ';
      var dias = r.diasTrabajados || 30;
      var mesCompleto = dias >= 30;

      if (r.netoPagar < 0)
        issues.push({ nivel: 'alta', i: i, msg: ref + 'neto a pagar NEGATIVO — las deducciones superan el devengado.' });
      if (mesCompleto && r.salarioBase < smlmv)
        issues.push({ nivel: 'alta', i: i, msg: ref + 'salario de mes completo por debajo del SMLMV.' });
      if (mesCompleto && r.ibcSS < smlmv)
        issues.push({ nivel: 'alta', i: i, msg: ref + 'IBC de seguridad social menor a 1 SMLMV (sub-cotización, riesgo UGPP).' });
      if (r.salarioBase > 0 && r.salarioBase <= smlmv * 2 && r.auxTransporte === 0)
        issues.push({ nivel: 'media', i: i, msg: ref + 'devenga ≤ 2 SMLMV pero sin auxilio de transporte — verifica si aplica (modo NO).' });
      if (r.salarioBase > smlmv * 25)
        issues.push({ nivel: 'info', i: i, msg: ref + 'salario supera 25 SMLMV — el IBC quedó topado en 25 SMLMV.' });
      if (r.salarioBase >= smlmv * 13 && !r.esIntegral)
        issues.push({ nivel: 'info', i: i, msg: ref + 'salario ≥ 13 SMLMV — evalúa si debería pactarse salario integral (Art. 132 CST).' });
      if (r.warnings && r.warnings.length)
        r.warnings.forEach(function(w) { issues.push({ nivel: 'media', i: i, msg: ref + w }); });
    });
    return issues;
  }

  /* ═══ SELF-TESTS ═══ */
  function selfTest() {
    var pass = 0, fail = 0, errors = [];
    function eq(a, b, msg) {
      if (a === b) pass++;
      else { fail++; errors.push(msg + ': esperaba ' + b + ', obtuvo ' + a); }
    }
    function truthy(v, msg) { eq(!!v, true, msg); }
    function falsy(v, msg) { eq(!!v, false, msg); }

    // ─── toNumber ───
    eq(toNumber(1000), 1000, 'toNumber: numero plain');
    eq(toNumber('1000'), 1000, 'toNumber: string simple');
    eq(toNumber('1.000.000'), 1000000, 'toNumber: formato colombiano puntos miles');
    eq(toNumber('$1,750,905'), 1750905, 'toNumber: formato US con comas');
    eq(toNumber(''), 0, 'toNumber: vacío → 0');
    eq(toNumber(null), 0, 'toNumber: null → 0');
    truthy(isNaN(toNumber('abc')), 'toNumber: texto inválido → NaN');

    // ─── toBool ───
    eq(toBool('SI'), true, 'toBool: SI');
    eq(toBool('si'), true, 'toBool: si lowercase');
    eq(toBool('NO'), false, 'toBool: NO');
    eq(toBool(''), false, 'toBool: vacío');
    eq(toBool(true), true, 'toBool: pass-through bool');

    // ─── normalizarFila ───
    var raw = {
      cedula: 1010101010, nombre: '  Juan ', salarioBase: '1.750.905',
      diasTrabajados: '', auxTransporteModo: 'auto', nivelARL: '1',
      tipoEmpleador: 'sociedad', heDiurnas: 0, heNocturnas: 0,
      recargoNocturno: 0, diasVacaciones: 0, otrosDescuentos: 0,
      depDependientes: 'NO',
    };
    var n = normalizarFila(raw);
    eq(n.cedula, '1010101010', 'normaliza: cédula → string');
    eq(n.nombre, 'Juan', 'normaliza: trim nombre');
    eq(n.salarioBase, 1750905, 'normaliza: salario formato CO');
    eq(n.diasTrabajados, 30, 'normaliza: diasTrabajados vacío → 30');
    eq(n.auxTransporteModo, 'AUTO', 'normaliza: enum mayúscula');
    eq(n.tipoEmpleador, 'SOCIEDAD', 'normaliza: tipoEmp mayúscula');
    eq(n.depDependientes, false, 'normaliza: NO → false');

    // ─── validarFila ───
    var raw1 = {
      cedula: '1', nombre: 'Test', salarioBase: 1750905, diasTrabajados: 30,
      auxTransporteModo: 'AUTO', nivelARL: 1, tipoEmpleador: 'SOCIEDAD',
      heDiurnas: 0, heNocturnas: 0, recargoNocturno: 0,
      diasVacaciones: 0, otrosDescuentos: 0,
    };
    var f1 = normalizarFila(raw1);
    eq(validarFila(f1, 0).length, 0, 'valida: fila correcta sin errores');

    // Cedula vacía
    var f2 = normalizarFila({ ...raw1, cedula: '' });
    truthy(validarFila(f2, 0).length > 0, 'valida: cédula vacía → error');

    // Salario cero
    var f3 = normalizarFila({ ...raw1, salarioBase: 0 });
    truthy(validarFila(f3, 0).some(function(e){ return e.indexOf('salarioBase') >= 0; }),
           'valida: salario 0 → error');

    // Modo enum inválido
    var f4 = normalizarFila({ ...raw1, auxTransporteModo: 'XYZ' });
    truthy(validarFila(f4, 0).some(function(e){ return e.indexOf('auxTransporteModo') >= 0; }),
           'valida: enum aux inválido');

    // MANUAL sin valor
    var f5 = normalizarFila({ ...raw1, auxTransporteModo: 'MANUAL', auxTransporteValor: 0 });
    truthy(validarFila(f5, 0).some(function(e){ return e.indexOf('auxTransporteValor') >= 0; }),
           'valida: MANUAL sin valor → error');

    // tipoEmpleador inválido
    var f6 = normalizarFila({ ...raw1, tipoEmpleador: 'COOPERATIVA' });
    truthy(validarFila(f6, 0).some(function(e){ return e.indexOf('tipoEmpleador') >= 0; }),
           'valida: tipoEmp inválido → error');

    // Días vacaciones + incapacidad > 30
    var f7 = normalizarFila({ ...raw1, diasVacaciones: 20, diasIncapacidad: 15 });
    truthy(validarFila(f7, 0).some(function(e){ return e.indexOf('exceder 30') >= 0; }),
           'valida: vac + incap > 30 → error');

    // ─── aoaAFilasCrudas ───
    var aoaOk = [
      COLS_BASE.concat(COLS_AVANZADAS),
      ['1','Test',1750905,30,'AUTO',1,'SOCIEDAD',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'NO',0,0],
      ['','','','','','','','','','','','','','','','','','','','','','','','',''], // vacía → skip
    ];
    var procOk = aoaAFilasCrudas(aoaOk);
    eq(procOk.errorEsquema, null, 'aoa OK: sin error de esquema');
    eq(procOk.filas.length, 1, 'aoa OK: skip fila vacía');

    // Falta columna obligatoria
    var aoaMal = [['cedula','nombre'], ['1','x']];
    var procMal = aoaAFilasCrudas(aoaMal);
    truthy(procMal.errorEsquema, 'aoa: detecta columnas faltantes');

    // ─── Pipeline completo ───
    var pipeline = procesarAoA(aoaOk);
    eq(pipeline.errorEsquema, null, 'pipeline: sin error');
    eq(pipeline.filas.length, 1, 'pipeline: 1 fila');
    eq(pipeline.filas[0].valido, true, 'pipeline: fila válida');
    eq(pipeline.resumen.total, 1, 'pipeline resumen total');
    eq(pipeline.resumen.validas, 1, 'pipeline resumen válidas');

    // Pipeline con error
    var aoaErr = [
      COLS_BASE.concat(COLS_AVANZADAS),
      ['','Test',-1,30,'XYZ',9,'COOP',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'NO',0,0],
    ];
    var pipelineErr = procesarAoA(aoaErr);
    eq(pipelineErr.errorEsquema, null, 'pipeline err: esquema OK');
    eq(pipelineErr.filas[0].valido, false, 'pipeline err: fila no válida');
    truthy(pipelineErr.filas[0].errores.length >= 4, 'pipeline err: múltiples errores');

    // ─── revisionPulso ───
    var SM = 1750905;
    var pl1 = revisionPulso([{ nombre:'A', diasTrabajados:30, salarioBase:1000000, ibcSS:1000000, auxTransporte:0, netoPagar:900000 }], SM);
    truthy(pl1.some(function(x){ return x.nivel==='alta' && /SMLMV/.test(x.msg); }), 'pulso: salario < SMLMV alta');
    var pl2 = revisionPulso([{ nombre:'B', diasTrabajados:30, salarioBase:SM, ibcSS:SM, auxTransporte:249095, netoPagar:1600000 }], SM);
    eq(pl2.length, 0, 'pulso: SMLMV con aux → sin alertas');
    var pl3 = revisionPulso([{ nombre:'C', diasTrabajados:30, salarioBase:2000000, ibcSS:2000000, auxTransporte:0, netoPagar:1800000 }], SM);
    truthy(pl3.some(function(x){ return x.nivel==='media' && /auxilio/.test(x.msg); }), 'pulso: ≤2 SMLMV sin aux → media');
    var pl4 = revisionPulso([{ nombre:'D', diasTrabajados:30, salarioBase:SM, ibcSS:SM, auxTransporte:249095, netoPagar:-5000 }], SM);
    truthy(pl4.some(function(x){ return x.nivel==='alta' && /NEGATIVO/.test(x.msg); }), 'pulso: neto negativo alta');

    console.log('NominaValidator selftest: ' + pass + ' ✓  ' + fail + ' ✗');
    if (fail > 0) errors.forEach(function(e){ console.error('  ✗ ' + e); });
    return { pass: pass, fail: fail, errors: errors };
  }

  return {
    COLS_BASE: COLS_BASE,
    COLS_AVANZADAS: COLS_AVANZADAS,
    COLS_ALL: COLS_ALL,
    ENUM_AUX_MODO: ENUM_AUX_MODO,
    ENUM_TIPO_EMPLEADOR: ENUM_TIPO_EMPLEADOR,
    toNumber: toNumber,
    toBool: toBool,
    normalizarFila: normalizarFila,
    validarFila: validarFila,
    aoaAFilasCrudas: aoaAFilasCrudas,
    procesarAoA: procesarAoA,
    revisionPulso: revisionPulso,
    selfTest: selfTest,
  };

})();

if (typeof window !== 'undefined') {
  window.NominaValidator = NOMINA_VALIDATOR;
}
if (typeof module !== 'undefined') {
  module.exports = NOMINA_VALIDATOR;
}
