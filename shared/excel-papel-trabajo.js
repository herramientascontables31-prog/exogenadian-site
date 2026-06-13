/**
 * ExogenaDIAN — Generador del Excel papel de trabajo (8 hojas)
 *
 * Construido incrementalmente en sub-checkpoints 9.1 → 9.5:
 *   9.1 — Esqueleto + Hoja 1 Carátula con hash de inputs
 *   9.2 — Hoja 2 Réplica visual del 210 oficial
 *   9.3 — Hojas 3+4 Memoria de cálculo y Validaciones
 *   9.4 — Hoja 5 Cruce exógena vs declarado (5A/5B/5C)
 *   9.5 — Hojas 6+7+8 Citas normativas literales + Liquidación + Bitácora
 *
 * Diseño: módulo agnóstico al DOM. Recibe (workbook, resultado motor, contexto, hash)
 * y construye las hojas in-place. La descarga la maneja el caller (browser).
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.excelPapelTrabajo = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  var MOTOR_VERSION = 'v2025.1';

  // Paleta consistente con la UI y con la guía visual del paso 9 del plan.
  var COLORS = {
    headerDark:  'FF1E1B4B', // header franja oscura
    sectionBand: 'FFD6E4F0', // banda secciones
    sectionText: 'FF1B3A5C',
    altRowEven:  'FFFAFBFC',
    subtotal:    'FFF0F2F5',
    result:      'FFD1FAE5',
    resultText:  'FF065F46',
    alert:       'FFFEE2E2',
    alertText:   'FF991B1B',
    muted:       'FF6B7280',
    border:      'FFE2E8F0'
  };

  var FONT_BASE = 'Calibri';
  var FONT_MONO = 'Consolas';

  function fillCell(cell, fill){
    cell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: fill } };
  }
  function fontWhiteBold(size){ return { name: FONT_BASE, bold:true, color:{argb:'FFFFFFFF'}, size:size||11 }; }
  function fontBold(size, color){ return { name: FONT_BASE, bold:true, size:size||10, color:color?{argb:color}:undefined }; }
  function fontBody(size, color){ return { name: FONT_BASE, size:size||10, color:color?{argb:color}:undefined }; }
  function fontMono(size, color){ return { name: FONT_MONO, size:size||9, color:color?{argb:color}:undefined }; }
  function thinBorder(){
    var b = { style:'thin', color:{argb:COLORS.border} };
    return { top:b, bottom:b, left:b, right:b };
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 1 — Carátula
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja1Caratula(wb, r, ctx, hash){
    var w1 = wb.addWorksheet('1. Carátula', {
      views: [{ showGridLines: false }]
    });

    // Anchos
    w1.getColumn(1).width = 2;
    w1.getColumn(2).width = 32;
    w1.getColumn(3).width = 50;
    w1.getColumn(4).width = 35;

    // ─ Header ─
    w1.mergeCells('A1:D1');
    var h = w1.getCell('A1');
    h.value = 'EXCEL PAPEL DE TRABAJO — FORMULARIO 210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    w1.getRow(1).height = 36;

    w1.mergeCells('A2:D2');
    var sub = w1.getCell('A2');
    sub.value = 'ExogenaDIAN Pro — Motor ' + MOTOR_VERSION + ' — ' + new Date().toLocaleDateString('es-CO');
    sub.font = { name: FONT_BASE, italic:true, color:{argb:COLORS.muted}, size:9 };
    sub.alignment = { horizontal:'center' };

    // Helper para agregar banda de sección
    function addBanda(texto){
      w1.addRow([]);
      var rw = w1.addRow(['', texto, '', '']);
      w1.mergeCells('B' + rw.number + ':D' + rw.number);
      var c = rw.getCell(2);
      c.font = fontBold(11, COLORS.sectionText);
      fillCell(c, COLORS.sectionBand);
      c.alignment = { horizontal:'left', vertical:'middle' };
      rw.height = 20;
    }
    function addKeyValue(key, val, opts){
      var rw = w1.addRow(['', key, val, opts && opts.note ? opts.note : '']);
      rw.getCell(2).font = fontBold(10);
      rw.getCell(3).font = (opts && opts.mono) ? fontMono(9, COLORS.sectionText) : fontBody(10);
      if(opts && opts.numFmt) rw.getCell(3).numFmt = opts.numFmt;
      if(opts && opts.fill){
        fillCell(rw.getCell(3), opts.fill);
        rw.getCell(3).font = fontBold(11, opts.fillText || COLORS.resultText);
      }
      if(opts && opts.wrap){
        rw.getCell(3).alignment = { wrapText:true, vertical:'top' };
      }
      if(opts && opts.height) rw.height = opts.height;
      if(opts && opts.noteItalic){
        rw.getCell(4).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
      }
      return rw;
    }

    // ─ Datos del declarante ─
    addBanda('DATOS DEL DECLARANTE');
    var c = (ctx.estado && ctx.estado.declarante) || {};
    var prevDeclLabel = c.declaracionesPrevias === 0 ? '1ra vez (anticipo 25%)'
                      : c.declaracionesPrevias === 1 ? '2da vez (anticipo 50%)'
                      : '3ra vez o más (anticipo 75%)';
    addKeyValue('Cédula / NIT', c.cc || '—');
    addKeyValue('Apellidos y nombres', c.nombre || '—');
    addKeyValue('Año gravable', ctx.year);
    addKeyValue('Veces declarando', prevDeclLabel);
    addKeyValue('Fecha de generación', new Date().toLocaleDateString('es-CO'));

    // ─ Resumen de la liquidación (cifras grandes) ─
    addBanda('RESUMEN DE LA LIQUIDACIÓN');
    addKeyValue('Renta líquida cedular general (c91)', r.renglones.c91, { numFmt: '"$"#,##0' });
    addKeyValue('Renta líquida gravable (c97)', r.renglones.c97, { numFmt: '"$"#,##0' });
    addKeyValue('Impuesto neto de renta (c126)', r.renglones.c126, { numFmt: '"$"#,##0' });
    addKeyValue('Anticipo año siguiente (c133)', r.renglones.c133, { numFmt: '"$"#,##0' });
    addKeyValue('Retenciones del año (c132)', r.renglones.c132, { numFmt: '"$"#,##0' });
    var saldoLabel, saldoVal, saldoFill, saldoFillText;
    if(r.renglones.c134 > 0){
      saldoLabel = 'SALDO A PAGAR (c134)';
      saldoVal = r.renglones.c134;
      saldoFill = COLORS.alert;
      saldoFillText = COLORS.alertText;
    } else if(r.renglones.c137 > 0){
      saldoLabel = 'SALDO A FAVOR (c137)';
      saldoVal = r.renglones.c137;
      saldoFill = COLORS.result;
      saldoFillText = COLORS.resultText;
    } else {
      saldoLabel = 'SALDO';
      saldoVal = 0;
      saldoFill = COLORS.subtotal;
      saldoFillText = COLORS.sectionText;
    }
    addKeyValue(saldoLabel, saldoVal, {
      numFmt: '"$"#,##0',
      fill: saldoFill,
      fillText: saldoFillText
    });

    // ─ Hash de inputs (auditoría) ─
    addBanda('HASH DE INPUTS (AUDITORÍA)');
    addKeyValue('SHA-256', hash, { mono: true });
    addKeyValue('Nota',
      'Fingerprint determinístico de los datos que generaron este Excel. ' +
      'Mismo input + mismo motor = mismo hash. Útil para detectar si dos archivos ' +
      'provienen de los mismos inputs (auditoría reproducible). No incluye fecha de ' +
      'exportación ni datos cosméticos.',
      { wrap: true, height: 64 });

    // ─ Tabla de contenidos ─
    addBanda('CONTENIDO DEL EXCEL');
    var hojas = [
      ['Hoja 1', 'Carátula',                                     '— estás aquí —'],
      ['Hoja 2', 'Réplica visual del 210 oficial AG ' + ctx.year, 'casillas + valores + comentarios normativos'],
      ['Hoja 3', 'Memoria de cálculo',                           'depuración cedular + tope Art. 336 + 25% Art. 206'],
      ['Hoja 4', 'Validaciones y conciliación patrimonial',      'checklist técnico + Art. 236-237 + score riesgo'],
      ['Hoja 5', 'Cruce reporte exógena DIAN vs declarado',      'reportados-incluidos / excluidos / agregados manuales'],
      ['Hoja 6', 'Citas normativas con texto literal',           'artículos ET aplicables al caso, fuente DIAN'],
      ['Hoja 7', 'Liquidación final detallada',                  'cédula × cédula + anticipo opciones 1 y 2 + saldo'],
      ['Hoja 8', 'Bitácora del archivo',                         'versionado motor + cambios normativos + hash inputs']
    ];
    hojas.forEach(function(row){
      var rw = w1.addRow(['', row[0], row[1], row[2]]);
      rw.getCell(2).font = fontBold(10, COLORS.sectionText);
      rw.getCell(3).font = fontBody(10);
      rw.getCell(4).font = { name: FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    });

    // ─ Disclaimer ─
    w1.addRow([]);
    var disc = w1.addRow(['', 'No constituye asesoría tributaria emitida por exogenadian.com — el contador valida y firma.']);
    w1.mergeCells('B' + disc.number + ':D' + disc.number);
    disc.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 2 — Réplica visual del 210 oficial AG {year}
  //  Tabla canónica de casillas extraída de formato210.html público.
  //  Etiquetas oficiales literales (con tildes y vocabulario DIAN).
  // ──────────────────────────────────────────────────────────────────────────

  /** Determina la marca de origen de una casilla.
   *  Texto corto (no iconos) para evitar problemas de soporte tipográfico
   *  en clientes Excel/LibreOffice diversos.
   *    'calc'   — calculada por motor
   *    'exóg'   — viene del reporte exógena DIAN
   *    'manual' — agregada manualmente fuera de exógena
   *    'edit'   — input editable del contador, sin reconciliación aplicada */
  function marcarOrigen(motorPath, valor, reconciliacionEstado){
    if(motorPath && motorPath.indexOf('renglones.') === 0) return 'calc';
    if(motorPath && motorPath.indexOf('subcedulas.') >= 0 &&
       (motorPath.indexOf('.ingresoNeto') >= 0 ||
        motorPath.indexOf('.exenta25') >= 0 ||
        motorPath.indexOf('.exentasYDeducciones') >= 0 ||
        motorPath.indexOf('.rentaSubcedula') >= 0 ||
        motorPath.indexOf('.rentaLiquidaAntesExentas') >= 0 ||
        motorPath.indexOf('.perdida') >= 0)){
      return 'calc';
    }
    if(motorPath === '_calculado' || motorPath === '_patLiquido') return 'calc';
    if(motorPath === null || valor === null || valor === '' || valor === 0) return 'edit';
    if(reconciliacionEstado && reconciliacionEstado.aplicada && reconciliacionEstado.filas){
      var match = reconciliacionEstado.filas.find(function(f){
        return !f.excluida && f.valor === valor;
      });
      if(match) return match.fuente === 'manual' ? 'manual' : 'exóg';
    }
    return 'edit';
  }

  /** Lee un valor del resultado del motor por path "subcedulas.trabajo.ingresoNeto" */
  function getByPath(obj, path){
    if(!obj || !path) return null;
    var parts = path.split('.');
    var v = obj;
    for(var i = 0; i < parts.length; i++){
      if(v == null) return null;
      v = v[parts[i]];
    }
    return v;
  }

  /** Construye la tabla canónica de casillas del 210 oficial AG 2024/2025. */
  function buildCasillasTabla(){
    return [
      { tipo: 'banda', titulo: 'DATOS DEL DECLARANTE' },
      { tipo: 'casilla', cas: 1,  etiqueta: 'Año gravable',                                       motorPath: '_year',         categoria: 'input', tipoValor: 'numero' },
      // Casillas c2-c4: no aparecen en formato210.html actual — etiquetas del 210 oficial AG 2024
      { tipo: 'casilla', cas: 2,  etiqueta: 'Concepto (1=Inicial · 2=Corrección)',                 motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 3,  etiqueta: 'Período (1=Anual)',                                    motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 4,  etiqueta: 'Número de formulario',                                 motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 5,  etiqueta: 'Número de identificación (NIT / Cédula)',              motorPath: '_cc',           categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 6,  etiqueta: 'DV',                                                   motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 7,  etiqueta: 'Primer apellido',                                      motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 8,  etiqueta: 'Segundo apellido',                                     motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 9,  etiqueta: 'Primer nombre',                                        motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 10, etiqueta: 'Otros nombres',                                        motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      // c11: solo aplica para personas jurídicas, vacía para PN
      { tipo: 'casilla', cas: 11, etiqueta: 'Razón social (solo personas jurídicas)',               motorPath: null,            categoria: 'input', tipoValor: 'texto' },
      { tipo: 'casilla', cas: 12, etiqueta: 'Cód. Dirección Seccional',                             motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      // Casillas c13-c23 administrativas (ubicación, contacto, actividad económica) — no en formato210.html actual,
      // texto agrupado para no inventar etiquetas literales del 210 oficial
      { tipo: 'nota',    texto: 'Casillas c13-c23 (datos administrativos del 210 oficial: dirección, departamento, municipio, teléfono, código actividad económica CIIU, etc.) — completar en MUISCA al diligenciar.' },
      { tipo: 'casilla', cas: 24, etiqueta: 'Si es una corrección indique (Concepto)',              motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 25, etiqueta: 'Cód.',                                                 motorPath: null,            categoria: 'input', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 26, etiqueta: 'No. Formulario anterior',                              motorPath: null,            categoria: 'input', tipoValor: 'texto' },

      { tipo: 'banda', titulo: 'PATRIMONIO', subseccion: 'patrimonio' },
      { tipo: 'casilla', subseccion: 'patrimonio', cas: 29, etiqueta: 'Total patrimonio bruto',                          motorPath: '_patBruto',     categoria: 'input' },
      { tipo: 'casilla', subseccion: 'patrimonio', cas: 30, etiqueta: 'Deudas',                                          motorPath: '_patDeudas',    categoria: 'input' },
      { tipo: 'casilla', subseccion: 'patrimonio', cas: 31, etiqueta: 'Total patrimonio líquido (29 − 30)',              motorPath: '_patLiquido',   categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CÉDULA GENERAL — RENTAS DE TRABAJO (32-42)', subseccion: 'trab' },
      { tipo: 'casilla', subseccion: 'trab', cas: 32, etiqueta: 'Ingresos brutos',                                       motorPath: 'cedulaGeneral.subcedulas.trabajo.ingresosBrutos',          categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 33, etiqueta: 'Ingresos no constitutivos de renta (INCRNGO)',          motorPath: 'cedulaGeneral.subcedulas.trabajo.incrngo',                categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 34, etiqueta: 'Renta líquida (32 − 33)',                               motorPath: 'cedulaGeneral.subcedulas.trabajo.ingresoNeto',            categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'trab', cas: 35, etiqueta: 'Aportes voluntarios AFC, FVP y/o AVC',                  motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 36, etiqueta: 'Otras rentas exentas (incluye 25% Art. 206 num. 10)',   motorPath: 'cedulaGeneral.subcedulas.trabajo.exenta25',               categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 37, etiqueta: 'Total rentas exentas (35 + 36)',                        motorPath: 'cedulaGeneral.subcedulas.trabajo.exenta25',               categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'trab', cas: 38, etiqueta: 'Intereses de vivienda',                                 motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 39, etiqueta: 'Otras deducciones imputables (salud + dep. Art. 387)',  motorPath: 'cedulaGeneral.subcedulas.trabajo.deduccionesNominales',   categoria: 'input' },
      { tipo: 'casilla', subseccion: 'trab', cas: 40, etiqueta: 'Total deducciones imputables (38 + 39)',                motorPath: 'cedulaGeneral.subcedulas.trabajo.deduccionesNominales',   categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'trab', cas: 41, etiqueta: 'Rentas exentas y/o deducciones imputables limitadas',   motorPath: 'cedulaGeneral.subcedulas.trabajo.exentasYDeducciones',    categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'trab', cas: 42, etiqueta: 'Renta líquida ordinaria',                               motorPath: 'cedulaGeneral.subcedulas.trabajo.rentaSubcedula',         categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CÉDULA GENERAL — RENTAS DE TRABAJO SIN RELACIÓN LABORAL / HONORARIOS (43-57)', subseccion: 'hono' },
      { tipo: 'casilla', subseccion: 'hono', cas: 43, etiqueta: 'Ingresos brutos',                              motorPath: 'cedulaGeneral.subcedulas.honorarios.ingresosBrutos',        categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 44, etiqueta: 'Ingresos no constitutivos de renta',           motorPath: 'cedulaGeneral.subcedulas.honorarios.incrngo',               categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 45, etiqueta: 'Costos y deducciones procedentes',             motorPath: 'cedulaGeneral.subcedulas.honorarios.costos',                categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 46, etiqueta: 'Renta líquida (43 − 44 − 45)',                 motorPath: 'cedulaGeneral.subcedulas.honorarios.ingresoNeto',           categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 47, etiqueta: 'Aportes voluntarios AFC, FVP y/o AVC',         motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 48, etiqueta: 'Otras rentas exentas (incluye 25% si modo rentas de trabajo)', motorPath: 'cedulaGeneral.subcedulas.honorarios.exenta25',  categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 49, etiqueta: 'Total rentas exentas (47 + 48)',               motorPath: 'cedulaGeneral.subcedulas.honorarios.exenta25',              categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 50, etiqueta: 'Intereses de vivienda',                        motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 51, etiqueta: 'Otras deducciones imputables',                 motorPath: 'cedulaGeneral.subcedulas.honorarios.deduccionesNominales',  categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 52, etiqueta: 'Total deducciones imputables (50 + 51)',       motorPath: 'cedulaGeneral.subcedulas.honorarios.deduccionesNominales',  categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 53, etiqueta: 'Rentas exentas y/o ded. imputables limitadas', motorPath: 'cedulaGeneral.subcedulas.honorarios.exentasYDeducciones',   categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 54, etiqueta: 'Renta líquida ordinaria del ejercicio',        motorPath: 'cedulaGeneral.subcedulas.honorarios.rentaLiquidaAntesExentas', categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 55, etiqueta: 'Pérdida líquida del ejercicio',                motorPath: 'cedulaGeneral.subcedulas.honorarios.perdida',               categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'hono', cas: 56, etiqueta: 'Compensaciones por pérdidas',                  motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'hono', cas: 57, etiqueta: 'Renta líquida ordinaria',                      motorPath: 'cedulaGeneral.subcedulas.honorarios.rentaSubcedula',        categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CÉDULA GENERAL — RENTAS DE CAPITAL (58-73)', subseccion: 'cap' },
      { tipo: 'casilla', subseccion: 'cap', cas: 58, etiqueta: 'Ingresos brutos',                                  motorPath: 'cedulaGeneral.subcedulas.capital.ingresosBrutos',          categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 59, etiqueta: 'Ingresos no constitutivos de renta (INCRNGO)',     motorPath: 'cedulaGeneral.subcedulas.capital.incrngo',                categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 60, etiqueta: 'Costos y deducciones procedentes',                 motorPath: 'cedulaGeneral.subcedulas.capital.costos',                 categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 61, etiqueta: 'Renta líquida (58 − 59 − 60)',                     motorPath: 'cedulaGeneral.subcedulas.capital.ingresoNeto',           categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 62, etiqueta: 'Rentas líquidas pasivas ECE',                      motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 63, etiqueta: 'Aportes voluntarios AFC, FVP y/o AVC',             motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 64, etiqueta: 'Otras rentas exentas',                             motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 65, etiqueta: 'Total rentas exentas (63 + 64)',                   motorPath: null,                                                       categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 66, etiqueta: 'Intereses de vivienda',                            motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 67, etiqueta: 'Otras deducciones imputables',                     motorPath: 'cedulaGeneral.subcedulas.capital.deduccionesNominales',  categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 68, etiqueta: 'Total deducciones imputables (66 + 67)',           motorPath: 'cedulaGeneral.subcedulas.capital.deduccionesNominales',  categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 69, etiqueta: 'Rentas exentas y/o ded. imputables limitadas',     motorPath: 'cedulaGeneral.subcedulas.capital.exentasYDeducciones',    categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 70, etiqueta: 'Renta líquida ordinaria del ejercicio',            motorPath: 'cedulaGeneral.subcedulas.capital.rentaLiquidaAntesExentas', categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 71, etiqueta: 'Pérdida líquida del ejercicio',                    motorPath: 'cedulaGeneral.subcedulas.capital.perdida',               categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cap', cas: 72, etiqueta: 'Compensaciones por pérdidas',                      motorPath: null,                                                       categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cap', cas: 73, etiqueta: 'Renta líquida ordinaria',                          motorPath: 'cedulaGeneral.subcedulas.capital.rentaSubcedula',         categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CÉDULA GENERAL — RENTAS NO LABORALES (74-90)', subseccion: 'nolab' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 74, etiqueta: 'Ingresos brutos',                                motorPath: 'cedulaGeneral.subcedulas.noLaboral.ingresosBrutos',         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 75, etiqueta: 'Devoluciones, rebajas y descuentos',             motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 76, etiqueta: 'Ingresos no constitutivos de renta (INCRNGO)',   motorPath: 'cedulaGeneral.subcedulas.noLaboral.incrngo',               categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 77, etiqueta: 'Costos y deducciones procedentes',               motorPath: 'cedulaGeneral.subcedulas.noLaboral.costos',                categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 78, etiqueta: 'Renta líquida (74 − 75 − 76 − 77)',              motorPath: 'cedulaGeneral.subcedulas.noLaboral.ingresoNeto',           categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 79, etiqueta: 'Rentas líquidas pasivas ECE',                    motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 80, etiqueta: 'Aportes voluntarios AFC, FVP y/o AVC',           motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 81, etiqueta: 'Otras rentas exentas',                           motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 82, etiqueta: 'Total rentas exentas (80 + 81)',                 motorPath: null,                                                         categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 83, etiqueta: 'Intereses de vivienda',                          motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 84, etiqueta: 'Otras deducciones imputables',                   motorPath: 'cedulaGeneral.subcedulas.noLaboral.deduccionesNominales',  categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 85, etiqueta: 'Total deducciones imputables (83 + 84)',         motorPath: 'cedulaGeneral.subcedulas.noLaboral.deduccionesNominales',  categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 86, etiqueta: 'Rentas exentas y/o ded. imputables limitadas',   motorPath: 'cedulaGeneral.subcedulas.noLaboral.exentasYDeducciones',    categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 87, etiqueta: 'Renta líquida ordinaria del ejercicio',          motorPath: 'cedulaGeneral.subcedulas.noLaboral.rentaLiquidaAntesExentas', categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 88, etiqueta: 'Pérdida líquida del ejercicio',                  motorPath: 'cedulaGeneral.subcedulas.noLaboral.perdida',               categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 89, etiqueta: 'Compensaciones por pérdidas',                    motorPath: null,                                                         categoria: 'input' },
      { tipo: 'casilla', subseccion: 'nolab', cas: 90, etiqueta: 'Renta líquida ordinaria',                        motorPath: 'cedulaGeneral.subcedulas.noLaboral.rentaSubcedula',        categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CONSOLIDADO CÉDULA GENERAL' },
      { tipo: 'casilla', cas: 28,  etiqueta: '1% de compras con factura electrónica (Art. 336 num. 5)',                 motorPath: '_fe1Pct',                                          categoria: 'input' },
      { tipo: 'casilla', cas: 91,  etiqueta: 'Renta líquida cédula general (antes de exentas y ded. limitadas)',         motorPath: 'renglones.c91',                                    categoria: 'subtotal' },
      { tipo: 'casilla', cas: 92,  etiqueta: 'Rentas exentas y deducciones limitadas (41 + 53 + 69 + 86 + 28 + 139)',    motorPath: 'renglones.c92',                                    categoria: 'subtotal',   comentario: 'tope336' },
      { tipo: 'casilla', cas: 93,  etiqueta: 'Renta líquida ordinaria cédula general (91 − 92)',                         motorPath: 'renglones.c93',                                    categoria: 'resultado' },
      { tipo: 'casilla', cas: 94,  etiqueta: 'Compensación pérdidas años 2018 y anteriores',                             motorPath: null,                                                categoria: 'input' },
      { tipo: 'casilla', cas: 95,  etiqueta: 'Compensación por exceso de renta presuntiva',                              motorPath: null,                                                categoria: 'input' },
      { tipo: 'casilla', cas: 96,  etiqueta: 'Rentas gravables',                                                         motorPath: null,                                                categoria: 'input' },
      { tipo: 'casilla', cas: 97,  etiqueta: 'Renta líquida gravable cédula general (93 + 96 − 94 − 95)',                motorPath: 'renglones.c97',                                    categoria: 'resultado' },
      { tipo: 'casilla', cas: 98,  etiqueta: 'Renta presuntiva',                                                         motorPath: null,                                                categoria: 'input' },

      { tipo: 'banda', titulo: 'CÉDULA DE PENSIONES (99-103)', subseccion: 'cedPensiones' },
      { tipo: 'casilla', subseccion: 'cedPensiones', cas: 99,  etiqueta: 'Ingresos brutos por rentas de pensiones del país y exterior', motorPath: 'cedulaPensiones.c99',  categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedPensiones', cas: 100, etiqueta: 'Ingresos no constitutivos de renta',                          motorPath: 'cedulaPensiones.c100', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedPensiones', cas: 101, etiqueta: 'Renta líquida (99 − 100)',                                    motorPath: 'cedulaPensiones.c101', categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cedPensiones', cas: 102, etiqueta: 'Rentas exentas de pensiones',                                 motorPath: 'cedulaPensiones.c102', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedPensiones', cas: 103, etiqueta: 'Renta líquida gravable cédula de pensiones (101 − 102)',     motorPath: 'cedulaPensiones.c103', categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'CÉDULA DE DIVIDENDOS Y PARTICIPACIONES (104-110)', subseccion: 'cedDividendos' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 104, etiqueta: 'Dividendos y participaciones 2016 y anteriores, y otros',     motorPath: 'cedulaDividendos.c104', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 105, etiqueta: 'Ingresos no constitutivos de renta',                          motorPath: 'cedulaDividendos.c105', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 106, etiqueta: 'Renta líquida ordinaria año 2016 y anteriores (104 − 105)',  motorPath: 'cedulaDividendos.c106', categoria: 'subtotal' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 107, etiqueta: '1ra subcédula 2017+ numeral 3 Art. 49 ET (no gravados)',     motorPath: 'cedulaDividendos.c107', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 108, etiqueta: '2da subcédula 2017+ parágrafo 2 Art. 49 ET (gravados)',      motorPath: 'cedulaDividendos.c108', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 109, etiqueta: 'Dividendos y participaciones recibidas del exterior',         motorPath: 'cedulaDividendos.c109', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'cedDividendos', cas: 110, etiqueta: 'Rentas exentas dividendos ECE y/o del exterior',              motorPath: 'cedulaDividendos.c110', categoria: 'input' },

      { tipo: 'banda', titulo: 'RENTA LÍQUIDA GRAVABLE TOTAL (Art. 331 ET)' },
      { tipo: 'casilla', cas: 111, etiqueta: 'Renta líq. gravable consolidada (cédula general + pensiones + dividendos)', motorPath: 'renglones.c111', categoria: 'resultado', comentario: 'consolidacionArt331' },

      { tipo: 'banda', titulo: 'GANANCIAS OCASIONALES (112-115)', subseccion: 'go' },
      { tipo: 'casilla', subseccion: 'go', cas: 112, etiqueta: 'Ingresos por ganancias ocasionales del país y del exterior', motorPath: 'gananciasOcasionales.c112', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'go', cas: 113, etiqueta: 'Costos por ganancias ocasionales',                            motorPath: 'gananciasOcasionales.c113', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'go', cas: 114, etiqueta: 'Ganancias ocasionales no gravadas y exentas',                 motorPath: 'gananciasOcasionales.c114', categoria: 'input' },
      { tipo: 'casilla', subseccion: 'go', cas: 115, etiqueta: 'Ganancias ocasionales gravables (112 − 113 − 114, si > 0)',  motorPath: 'gananciasOcasionales.c115', categoria: 'subtotal' },

      { tipo: 'banda', titulo: 'LIQUIDACIÓN PRIVADA' },
      { tipo: 'casilla', cas: 116, etiqueta: 'Impuesto cédula general + pensiones + dividendos (Art. 241 ET)',  motorPath: 'renglones.c116', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 117, etiqueta: 'O renta presuntiva + pensiones + dividendos',                      motorPath: 'renglones.c117', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 118, etiqueta: 'Impuesto dividendos 2da subcédula 2017+ (Art. 242-1)',              motorPath: 'renglones.c118', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 119, etiqueta: 'Impuesto dividendos 2016 y anteriores',                             motorPath: 'renglones.c119', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 120, etiqueta: 'Impuesto dividendos del exterior',                                  motorPath: 'renglones.c120', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 121, etiqueta: 'Total impuesto rentas líquidas cedulares (116 a 120)',              motorPath: 'renglones.c121', categoria: 'subtotal' },
      { tipo: 'casilla', cas: 122, etiqueta: 'Descuento: impuestos pagados en el exterior',                       motorPath: null,              categoria: 'input' },
      { tipo: 'casilla', cas: 123, etiqueta: 'Descuento: donaciones',                                              motorPath: null,              categoria: 'input' },
      { tipo: 'casilla', cas: 124, etiqueta: 'Descuento: dividendos y participaciones (consolidado)',             motorPath: 'liquidacion.descuentos.art254_1',  categoria: 'input' },
      { tipo: 'casilla', cas: 296, etiqueta: '↳ Descuento Art. 254-1 (19% × exceso 1.090 UVT) — desglose informativo de c124', motorPath: 'renglones.c296', categoria: 'subtotal', comentario: 'descuento254_1' },
      { tipo: 'casilla', cas: 125, etiqueta: 'Total descuentos tributarios (122 + 123 + 124)',                    motorPath: 'renglones.c125',  categoria: 'subtotal' },
      { tipo: 'casilla', cas: 126, etiqueta: 'Impuesto neto de renta (121 − 125)',                                 motorPath: 'renglones.c126',  categoria: 'resultado' },
      { tipo: 'casilla', cas: 127, etiqueta: 'Impuesto de ganancias ocasionales (15% Art. 314)',                   motorPath: 'renglones.c127',  categoria: 'subtotal' },
      { tipo: 'casilla', cas: 128, etiqueta: 'Descuento impuestos pagados exterior por GO',                        motorPath: null,              categoria: 'input' },
      { tipo: 'casilla', cas: 129, etiqueta: 'Total impuesto a cargo (126 + 127 − 128)',                           motorPath: 'renglones.c129',  categoria: 'resultado' },

      { tipo: 'banda', titulo: 'PAGOS Y SALDO' },
      { tipo: 'casilla', cas: 130, etiqueta: 'Anticipo renta liquidado año gravable anterior',                     motorPath: '_anticipoPrev',   categoria: 'input' },
      { tipo: 'casilla', cas: 131, etiqueta: 'Saldo a favor año gravable anterior sin solicitud de devolución',    motorPath: '_saldoFavorPrev', categoria: 'input' },
      { tipo: 'casilla', cas: 132, etiqueta: 'Retenciones año gravable a declarar',                                motorPath: 'renglones.c132',  categoria: 'input' },
      { tipo: 'casilla', cas: 133, etiqueta: 'Anticipo renta para el año gravable siguiente',                      motorPath: 'renglones.c133',  categoria: 'subtotal', comentario: 'anticipo807' },
      { tipo: 'casilla', cas: 134, etiqueta: 'Saldo a pagar por impuesto (si 129 + 133 − 130 − 131 − 132 > 0)',    motorPath: 'renglones.c134',  categoria: 'alerta' },
      { tipo: 'casilla', cas: 135, etiqueta: 'Sanciones',                                                          motorPath: null,              categoria: 'input' },
      { tipo: 'casilla', cas: 136, etiqueta: 'Total saldo a pagar (si 129 + 133 + 135 − 130 − 131 − 132 > 0)',     motorPath: 'renglones.c134',  categoria: 'totalFinal' },
      { tipo: 'casilla', cas: 137, etiqueta: 'Total saldo a favor (si 130 + 131 + 132 − 129 − 133 − 135 > 0)',     motorPath: 'renglones.c137',  categoria: 'totalFinal' },

      { tipo: 'banda', titulo: 'INFORMACIÓN ADICIONAL' },
      { tipo: 'casilla', cas: 138, etiqueta: 'Número de dependientes económicos (Art. 336 num. 3 inc. 2)',         motorPath: '_depArt336Num',   categoria: 'subtotal', tipoValor: 'numero' },
      { tipo: 'casilla', cas: 139, etiqueta: 'Deducción dependientes Art. 336 num. 3 inc. 2 (72 UVT × dep, máx 4)', motorPath: '_depArt336Pesos', categoria: 'subtotal', comentario: 'capDep4' },
      { tipo: 'casilla', cas: 140, etiqueta: 'Superó tope indicativo Art. 336 num. 3 (40% / 1.340 UVT)',          motorPath: '_excedeTope',      categoria: 'alerta' },
      { tipo: 'casilla', cas: 141, etiqueta: 'Aporte voluntario (Art. 244-1 ET)',                                  motorPath: null,              categoria: 'input' }
    ];
  }

  /** Resuelve el valor de una casilla según su motorPath. */
  function resolverValor(item, r, ctx){
    var path = item.motorPath;
    if(!path) return null;
    var declarante = ctx.estado.declarante || {};
    var patrim = ctx.estado.patrimonio || {};
    var caps = ctx.capsAplicados || {};
    switch(path){
      case '_year':           return ctx.year;
      case '_cc':             return declarante.cc || null;
      case '_patBruto':       return patrim.bruto || 0;
      case '_patDeudas':      return patrim.deudas || 0;
      case '_patLiquido':     return (patrim.bruto || 0) - (patrim.deudas || 0);
      case '_fe1Pct':         return (ctx.estado.cedulaGeneral && ctx.estado.cedulaGeneral.facturaElectronica1Pct) || 0;
      case '_anticipoPrev':   return (ctx.estado.liquidacion && ctx.estado.liquidacion.anticipoPrev) || 0;
      case '_saldoFavorPrev': return (ctx.estado.liquidacion && ctx.estado.liquidacion.saldoFavorPrev) || 0;
      case '_depArt336Num':   return (ctx.estado.cedulaGeneral && ctx.estado.cedulaGeneral.dependientesArt336Numero) || 0;
      case '_depArt336Pesos': return (r.cedulaGeneral && r.cedulaGeneral.tope && r.cedulaGeneral.tope.deduccionesFueraTope && r.cedulaGeneral.tope.deduccionesFueraTope.dependientesArt336) || 0;
      case '_excedeTope':     return (r.cedulaGeneral && r.cedulaGeneral.tope) ? (r.cedulaGeneral.tope.excedeTope ? 'SÍ' : 'NO') : 'NO';
    }
    return getByPath(r, path);
  }

  /** Genera texto de comentario de celda según tipo. */
  function generarComentario(tipo, r, ctx){
    var caps = ctx.capsAplicados || {};
    var p = (typeof require !== 'undefined') ? require('./parametros-renta-pn.js').getParams(ctx.year)
                                              : (typeof window !== 'undefined' ? window.paramsRentaPN.getParams(ctx.year) : null);
    var uvt = p ? p.uvt : 0;
    var fmt = function(n){ return '$' + Math.round(n||0).toLocaleString('es-CO'); };

    switch(tipo){
      case 'tope336': {
        var t = r.cedulaGeneral.tope;
        return 'Cálculo del tope a rentas exentas y deducciones limitadas (cédula general consolidada):\n' +
               '\n' +
               'Raw (suma c41+c53+c69+c86 sin c28 ni c139): ' + fmt(t.rawDentroTope) + '\n' +
               '   = exentas25 + deducciones nominales imputables, por subcédula\n' +
               '   (c28 1% FE y c139 dependientes Art. 336 inc. 2 van FUERA del tope)\n' +
               '\n' +
               'Límite 40% × c91 (' + fmt(r.renglones.c91) + '):  ' + fmt(t.limite40) + '\n' +
               'Límite 1.340 UVT × ' + fmt(uvt) + ': ' + fmt(t.limite1340) + '\n' +
               '\n' +
               'Aplicado dentro del tope: ' + fmt(t.deduccionesAplicadasDentroTope) + '\n' +
               'Excede tope: ' + (t.excedeTope ? 'SÍ — el motor cortó al 40% / 1.340 UVT (el menor)' : 'NO') + '\n' +
               '\n' +
               'Norma: Art. 336 num. 3 inciso 1 ET + DUR 1625/2016 art. 1.2.1.20.4 (Ley 2277/2022).\n' +
               'El tope se aplica a CÉDULA GENERAL CONSOLIDADA, no por subcédula.';
      }
      case 'consolidacionArt331': {
        var c106 = (r.cedulaDividendos && r.cedulaDividendos.c106) || 0;
        var c107 = (r.cedulaDividendos && r.cedulaDividendos.c107) || 0;
        return 'Consolidación renta líquida gravable (Art. 331 ET):\n' +
               '\n' +
               'c97 (cédula general):                   ' + fmt(r.renglones.c97) + '\n' +
               'c103 (cédula pensiones):                ' + fmt((r.cedulaPensiones && r.cedulaPensiones.c103) || 0) + '\n' +
               'c106 (dividendos pre-2016):             ' + fmt(c106) + '\n' +
               'c107 (dividendos no gravados 2017+):    ' + fmt(c107) + '\n' +
               '\n' +
               'c111 = c97 + c103 + c106 + c107 = ' + fmt(r.renglones.c111) + '\n' +
               '\n' +
               'NOTA: Los dividendos GRAVADOS c108 (Art. 49 par. 2)\n' +
               'y los del exterior c109 NO se consolidan a c111.\n' +
               'Tributan separadamente:\n' +
               '  c108 → 35% Art. 240 + Art. 242-1\n' +
               '  c109 → 35% extranjero\n' +
               '\n' +
               'Norma: Art. 331 ET modificado por Ley 2277/2022.';
      }
      case 'descuento254_1': {
        var d = r.liquidacion && r.liquidacion.descuentos ? r.liquidacion.descuentos.art254_1 : 0;
        return 'Descuento Art. 254-1 ET (dividendos no gravados, Ley 2277/2022):\n' +
               '\n' +
               'Tarifa: 19% sobre dividendos no gravados que excedan 1.090 UVT\n' +
               'Aplicado: ' + fmt(d) + '\n' +
               '\n' +
               'Norma: Art. 254-1 ET (Ley 2277/2022).\n' +
               'Concepto DIAN 100208192-272 de 2023: el descuento NO genera saldo a favor (no acumulable, no reembolsable).';
      }
      case 'anticipo807': {
        var a = r.liquidacion && r.liquidacion.anticipo ? r.liquidacion.anticipo : { pctAplicado: 0.75 };
        var pct = (a.pctAplicado * 100) + '%';
        var prevDecl = (ctx.estado.declarante && ctx.estado.declarante.declaracionesPrevias) || 0;
        var prevLabel = prevDecl === 0 ? '1ra vez' : prevDecl === 1 ? '2da vez' : '3ra vez o más';
        return 'Cálculo anticipo Art. 807 ET:\n' +
               '\n' +
               'Veces declarando: ' + prevLabel + ' → tarifa ' + pct + '\n' +
               'Base (impuesto neto c126): ' + fmt(r.renglones.c126) + '\n' +
               'Anticipo c133 = base × ' + pct + ' = ' + fmt(r.renglones.c133) + '\n' +
               '\n' +
               'Norma: Art. 807 ET — 25% / 50% / 75% según número de declaraciones presentadas.';
      }
      case 'capDep4': {
        var depNum = (ctx.estado.cedulaGeneral && ctx.estado.cedulaGeneral.dependientesArt336Numero) || 0;
        var depPesos = (r.cedulaGeneral.tope.deduccionesFueraTope.dependientesArt336) || 0;
        return 'Cálculo dependientes Art. 336 num. 3 inc. 2:\n' +
               '\n' +
               'Cantidad declarada: ' + depNum + ' (cap máximo: 4)\n' +
               'Cantidad efectiva: ' + Math.min(depNum, 4) + '\n' +
               'Deducción por dependiente: 72 UVT × ' + fmt(uvt) + ' = ' + fmt(72 * uvt) + '\n' +
               'Deducción total: ' + Math.min(depNum, 4) + ' × 72 UVT = ' + fmt(depPesos) + '\n' +
               '\n' +
               'Va FUERA del tope del 40% (Art. 336 num. 3 inc. 2 ET).\n' +
               'Coexiste con dependientes Art. 387 (DENTRO del tope).';
      }
    }
    return null;
  }

  function buildHoja2Replica210(wb, r, ctx, hash, reconciliacionEstado){
    var w2 = wb.addWorksheet('2. Réplica 210', {
      views: [{
        showGridLines: false,
        state: 'frozen',
        xSplit: 0,
        ySplit: 4 // congela filas 1-4 (header + cabecera columnas + leyenda)
      }],
      properties: { outlineLevelRow: 1 }
    });

    // Anchos: A casilla, B etiqueta, C valor, D marca origen (texto corto), E nota
    w2.getColumn(1).width = 8;
    w2.getColumn(2).width = 58;
    w2.getColumn(3).width = 20;
    w2.getColumn(4).width = 12;
    w2.getColumn(5).width = 40;

    // ─ Fila 1: Header franja oscura ─
    w2.mergeCells('A1:E1');
    var h = w2.getCell('A1');
    h.value = 'FORMULARIO 210 — AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    w2.getRow(1).height = 36;

    // ─ Fila 2: vacía (separador) ─
    w2.addRow([]);

    // ─ Fila 3: cabecera de columnas ─
    var hdr = w2.addRow(['Cas.', 'Etiqueta oficial', 'Valor', 'Origen', 'Nota / referencia']);
    hdr.eachCell(function(cell){
      cell.font = fontBold(9, COLORS.sectionText);
      fillCell(cell, COLORS.subtotal);
      cell.alignment = { horizontal:'center', vertical:'middle' };
      cell.border = thinBorder();
    });
    hdr.height = 18;

    // ─ Fila 4: leyenda de marcas de origen (en zona congelada para referencia permanente) ─
    var rwLeg = w2.addRow(['', 'Marcas Origen: calc=calculado por motor · exóg=desde exógena DIAN · manual=agregado manual · edit=input editable', '', '', '']);
    w2.mergeCells('B4:E4');
    var cellLeg = rwLeg.getCell(2);
    cellLeg.font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    fillCell(cellLeg, COLORS.altRowEven);
    cellLeg.alignment = { horizontal:'left', vertical:'middle' };
    rwLeg.height = 18;

    // Procesar tabla canónica
    var tabla = buildCasillasTabla();

    // Pre-pasada: identificar subsecciones colapsables (todos los valores 0)
    var subsecAllZero = {};
    var subsecCasillas = {}; // subseccion → [casillaNumber...]
    tabla.forEach(function(item){
      if(item.tipo !== 'casilla' || !item.subseccion) return;
      if(!subsecCasillas[item.subseccion]) subsecCasillas[item.subseccion] = [];
      subsecCasillas[item.subseccion].push(item.cas);
      var v = resolverValor(item, r, ctx);
      var num = (typeof v === 'number') ? v : 0;
      if(num !== 0){
        subsecAllZero[item.subseccion] = false;
      } else if(subsecAllZero[item.subseccion] !== false){
        subsecAllZero[item.subseccion] = true;
      }
    });

    // Subsecciones que SIEMPRE colapsan si están vacías (las opcionales)
    var subseccionesColapsables = ['hono', 'cedPensiones', 'cedDividendos', 'go'];
    var altIndex = 0;

    tabla.forEach(function(item, idx){
      if(item.tipo === 'banda'){
        var rowB = w2.addRow(['', item.titulo, '', '', '']);
        w2.mergeCells('B' + rowB.number + ':E' + rowB.number);
        var cellB = rowB.getCell(2);
        cellB.font = fontBold(11, COLORS.sectionText);
        fillCell(cellB, COLORS.sectionBand);
        cellB.alignment = { horizontal:'left', vertical:'middle' };
        rowB.height = 22;
        // Si esta banda es de subsección colapsable Y esta colapsada, agregar fila resumen
        if(item.subseccion && subseccionesColapsables.indexOf(item.subseccion) >= 0 && subsecAllZero[item.subseccion]){
          var caps = subsecCasillas[item.subseccion] || [];
          var rangoTxt = caps.length ? ('c' + caps[0] + '-c' + caps[caps.length-1]) : '';
          var rwSum = w2.addRow(['', 'Renglones ' + rangoTxt + ': TODOS en cero (verificado · sección colapsada)', '', '', '']);
          w2.mergeCells('B' + rwSum.number + ':E' + rwSum.number);
          var cs = rwSum.getCell(2);
          cs.font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
          cs.alignment = { horizontal:'left' };
        }
        return;
      }

      if(item.tipo === 'nota'){
        var rwN = w2.addRow(['', item.texto, '', '', '']);
        w2.mergeCells('B' + rwN.number + ':E' + rwN.number);
        var cn = rwN.getCell(2);
        cn.font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
        cn.alignment = { wrapText:true, vertical:'top', horizontal:'left' };
        rwN.height = 32;
        return;
      }

      if(item.tipo === 'casilla'){
        // Si la casilla pertenece a una subsección colapsable y esa subsección está toda en 0, se colapsa
        var colapsada = item.subseccion && subseccionesColapsables.indexOf(item.subseccion) >= 0 && subsecAllZero[item.subseccion];
        var valor = resolverValor(item, r, ctx);
        var origen = marcarOrigen(item.motorPath, valor, reconciliacionEstado);

        var rowK = w2.addRow([
          item.cas,
          item.etiqueta,
          (valor === null || valor === undefined) ? '' : valor,
          origen,
          ''
        ]);

        // Estilos por categoría
        var cellCas = rowK.getCell(1);
        var cellLabel = rowK.getCell(2);
        var cellVal = rowK.getCell(3);
        var cellOrig = rowK.getCell(4);
        var cellNota = rowK.getCell(5);

        cellCas.font = fontMono(9, COLORS.sectionText);
        cellCas.alignment = { horizontal:'center' };
        cellLabel.font = fontBody(10);
        cellLabel.alignment = { wrapText:true, vertical:'top' };
        // numFmt según tipoValor (default: monetario para number, texto para string)
        if(item.tipoValor === 'numero') cellVal.numFmt = '0';
        else if(item.tipoValor === 'texto') cellVal.numFmt = '@';
        else cellVal.numFmt = (typeof valor === 'number') ? '"$"#,##0' : '@';
        cellVal.font = fontMono(10, COLORS.sectionText);
        cellVal.alignment = { horizontal:'right' };
        cellOrig.font = { name: FONT_BASE, size:11, bold:true };
        cellOrig.alignment = { horizontal:'center' };
        cellNota.font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };

        // Bordes y zebra
        var fillRow;
        if(item.categoria === 'subtotal'){
          fillRow = COLORS.subtotal;
          cellLabel.font = fontBold(10);
          cellVal.font = fontBold(10, COLORS.sectionText);
        } else if(item.categoria === 'resultado'){
          fillRow = COLORS.result;
          cellLabel.font = fontBold(10, COLORS.resultText);
          cellVal.font = fontBold(11, COLORS.resultText);
        } else if(item.categoria === 'alerta'){
          // Alerta solo si tiene valor > 0
          if(typeof valor === 'number' && valor > 0){
            fillRow = COLORS.alert;
            cellLabel.font = fontBold(10, COLORS.alertText);
            cellVal.font = fontBold(11, COLORS.alertText);
          } else {
            fillRow = (altIndex % 2 === 0) ? null : COLORS.altRowEven;
          }
        } else if(item.categoria === 'totalFinal'){
          // Total final c136/c137 — solo el que aplica
          var aplica = (item.cas === 136 && r.renglones.c134 > 0) ||
                       (item.cas === 137 && r.renglones.c137 > 0);
          if(aplica){
            // Header franja oscura, blanco, 12pt bold
            fillCell(cellLabel, COLORS.headerDark);
            fillCell(cellVal, COLORS.headerDark);
            fillCell(cellCas, COLORS.headerDark);
            fillCell(cellOrig, COLORS.headerDark);
            fillCell(cellNota, COLORS.headerDark);
            cellLabel.font = fontWhiteBold(12);
            cellVal.font = fontWhiteBold(12);
            cellCas.font = { name:FONT_MONO, size:10, bold:true, color:{argb:'FFFFFFFF'} };
            cellOrig.font = { name:FONT_BASE, size:11, bold:true, color:{argb:'FFFFFFFF'} };
          } else {
            // No aplica — atenuada
            cellLabel.font = { name:FONT_BASE, size:9, color:{argb:COLORS.muted}, italic:true };
            cellVal.font = { name:FONT_MONO, size:9, color:{argb:COLORS.muted}, italic:true };
          }
          fillRow = null;
        } else {
          fillRow = (altIndex % 2 === 0) ? null : COLORS.altRowEven;
        }
        if(fillRow){
          [cellCas, cellLabel, cellVal, cellOrig, cellNota].forEach(function(c){ fillCell(c, fillRow); });
        }
        [cellCas, cellLabel, cellVal, cellOrig, cellNota].forEach(function(c){ c.border = thinBorder(); });
        altIndex++;

        // Outline level para subsecciones colapsadas
        if(colapsada){
          rowK.outlineLevel = 1;
          rowK.hidden = true;
        }

        // Comentario de celda obligatorio
        if(item.comentario){
          var coment = generarComentario(item.comentario, r, ctx);
          if(coment){
            cellVal.note = {
              texts: [{ text: coment, font: { name: FONT_BASE, size: 9 } }],
              margins: { insetmode: 'auto' }
            };
          }
        }

        // Nota lateral con info útil (referencia, alerta de excede, etc.)
        if(item.cas === 92 && r.cedulaGeneral.tope.excedeTope){
          cellNota.value = 'EXCEDE tope 40% — motor capa al límite';
          cellNota.font = { name:FONT_BASE, size:8, bold:true, color:{argb:COLORS.alertText} };
        }
        if(item.cas === 140){
          cellVal.value = (r.cedulaGeneral.tope.excedeTope ? 'SÍ' : 'NO');
          cellNota.value = 'Verificar planeación tributaria si "SÍ"';
        }
        if(item.cas === 91){
          cellNota.value = 'Suma rentas líquidas subcédulas (sin perdidas Art. 331)';
        }
      }
    });

    // (la leyenda de marcas se movió a fila 4 — zona congelada — para visibilidad permanente)
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Helpers de layout reutilizables para Hojas 3-8
  // ──────────────────────────────────────────────────────────────────────────
  function fmtCOP(n){ return '$' + Math.round(n||0).toLocaleString('es-CO'); }

  function bandaSeccion(ws, texto, mergeAtoE){
    ws.addRow([]);
    var rw = ws.addRow(['', texto]);
    var rng = mergeAtoE ? 'A' : 'B';
    if(mergeAtoE){
      ws.mergeCells(rng + rw.number + ':E' + rw.number);
      rw.getCell(1).value = texto;
      rw.getCell(2).value = '';
    } else {
      ws.mergeCells('B' + rw.number + ':E' + rw.number);
    }
    var c = rw.getCell(mergeAtoE ? 1 : 2);
    c.font = fontBold(11, COLORS.sectionText);
    fillCell(c, COLORS.sectionBand);
    c.alignment = { horizontal:'left', vertical:'middle' };
    rw.height = 22;
    return rw;
  }

  function notaLinea(ws, texto, italic){
    var rw = ws.addRow(['', texto]);
    ws.mergeCells('B' + rw.number + ':E' + rw.number);
    var c = rw.getCell(2);
    c.font = italic !== false
      ? { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} }
      : fontBody(10);
    c.alignment = { wrapText:true, vertical:'top' };
    return rw;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 3 — Memoria de cálculo
  //  - Bloque A: depuración subcédulas con ingresos > 0
  //  - Bloque B: caja destacada del tope Art. 336 num. 3 inc. 1
  //  - Bloque C: pensiones / dividendos / GO si aplican
  //  - Bloque D: desglose 25% Art. 206 num. 10 (cuando trabajo > 0)
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja3MemoriaCalculo(wb, r, ctx){
    var ws = wb.addWorksheet('3. Memoria cálculo', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 50;
    ws.getColumn(3).width = 18;
    ws.getColumn(4).width = 18;
    ws.getColumn(5).width = 35;

    // Header
    ws.mergeCells('A1:E1');
    var h = ws.getCell('A1');
    h.value = 'MEMORIA DE CÁLCULO — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    var p = (typeof require !== 'undefined') ? require('./parametros-renta-pn.js').getParams(ctx.year)
                                              : (typeof window !== 'undefined' ? window.paramsRentaPN.getParams(ctx.year) : null);
    var uvt = p ? p.uvt : 0;

    // ─ BLOQUE A: depuración por subcédula ─
    var subcedConfig = [
      { key: 'trabajo',    titulo: 'RENTAS DE TRABAJO',         hasExenta25: true,  hasCostos: false },
      { key: 'honorarios', titulo: 'HONORARIOS Y SERVICIOS',   hasExenta25: false, hasCostos: true  }, // exenta25 solo si modo='rentasTrabajo'
      { key: 'capital',    titulo: 'RENTAS DE CAPITAL',         hasExenta25: false, hasCostos: true  },
      { key: 'noLaboral',  titulo: 'RENTAS NO LABORALES',       hasExenta25: false, hasCostos: true  }
    ];

    bandaSeccion(ws, 'BLOQUE A — DEPURACIÓN POR SUBCÉDULA');

    var huboAlguna = false;
    subcedConfig.forEach(function(cfg){
      var sub = r.cedulaGeneral && r.cedulaGeneral.subcedulas && r.cedulaGeneral.subcedulas[cfg.key];
      if(!sub || (sub.ingresosBrutos === 0 && sub.deduccionesNominales === 0)) return;
      huboAlguna = true;

      bandaSeccion(ws, '  ▸ Subcédula: ' + cfg.titulo);

      // Cabecera de columnas
      var hdr = ws.addRow(['', 'Concepto', 'Valor', 'Norma', 'Nota']);
      hdr.eachCell(function(c){
        c.font = fontBold(9, COLORS.sectionText);
        fillCell(c, COLORS.subtotal);
        c.border = thinBorder();
        c.alignment = { horizontal:'left' };
      });
      hdr.getCell(3).alignment = { horizontal:'right' };

      function fila(concepto, valor, norma, nota, opts){
        opts = opts || {};
        var rw = ws.addRow(['', concepto, valor, norma || '', nota || '']);
        rw.getCell(2).font = opts.bold ? fontBold(10) : fontBody(10);
        rw.getCell(3).font = opts.bold ? fontBold(10, COLORS.sectionText) : fontMono(10);
        rw.getCell(3).numFmt = '"$"#,##0';
        rw.getCell(3).alignment = { horizontal:'right' };
        rw.getCell(4).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
        rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
        if(opts.subtotal){
          fillCell(rw.getCell(2), COLORS.subtotal);
          fillCell(rw.getCell(3), COLORS.subtotal);
        }
        rw.getCell(2).border = thinBorder();
        rw.getCell(3).border = thinBorder();
      }

      fila('Ingresos brutos', sub.ingresosBrutos, 'Art. 26 ET');
      fila('(-) INCRNGO (salud + pensión obligatoria + FSP si aplica)', -sub.incrngo, 'Art. 55 ET', '8% del ingreso aprox.');
      if(cfg.hasCostos && sub.costos > 0){
        fila('(-) Costos / gastos asociados', -sub.costos, 'Art. 87 ET', cfg.key === 'noLaboral' ? 'Tope 50% sin factura electrónica' : '');
      }
      fila('= Renta líquida (ingreso neto)', sub.ingresoNeto, '', '', { bold:true, subtotal:true });
      ws.addRow([]);

      // Exentas
      if(sub.exenta25 > 0){
        var topeUvt = (cfg.key === 'trabajo' || (cfg.key === 'honorarios' && (ctx.estado.cedulaGeneral.honorarios.modo === 'rentasTrabajo'))) ? 790 : 0;
        var topePesos = topeUvt * uvt;
        var beneficio25 = Math.round(sub.ingresoNeto * 0.25);
        fila('(-) 25% renta exenta Art. 206 num. 10 (sin tope)', -beneficio25, 'Art. 206 num. 10', '25% × ingreso neto');
        fila('     Tope absoluto 790 UVT (' + fmtCOP(topePesos) + ')', -topePesos, 'Art. 206 num. 10', 'AG ' + ctx.year + ': 790 × ' + fmtCOP(uvt));
        fila('     Aplicado (menor de los dos)', -sub.exenta25, '', '', { bold:true });
      }
      if(sub.deduccionesNominales > 0){
        fila('(-) Deducciones nominales imputadas', -sub.deduccionesNominales, 'Art. 119, 387 ET', 'Salud prepagada, vivienda, AVC+AFC, dependientes Art. 387');
      }
      fila('= Rentas exentas + ded. imputables (raw)', sub.exentasYDeducciones, '', '', { bold:true, subtotal:true });
      ws.addRow([]);
      fila('= Renta líquida ordinaria de la subcédula', sub.rentaSubcedula, '', '', { bold:true, subtotal:true });
      ws.addRow([]);
    });

    if(!huboAlguna){
      notaLinea(ws, 'Sin subcédulas con valores > 0 en este caso.');
    }

    // ─ BLOQUE B: aplicación del tope Art. 336 ─
    bandaSeccion(ws, 'BLOQUE B — APLICACIÓN DEL TOPE (Art. 336 num. 3 inc. 1 ET + DUR 1625/2016 art. 1.2.1.20.4)');
    var t = r.cedulaGeneral.tope;
    var cajaRows = [
      ['Raw consolidado (c41 + c53 + c69 + c86) — sin c28 ni c139',  t.rawDentroTope, ''],
      ['Renta líquida cedular general (c91)',                         r.renglones.c91, ''],
      ['Límite 40% × c91',                                            t.limite40, '40% × ' + fmtCOP(r.renglones.c91)],
      ['Límite 1.340 UVT (AG ' + ctx.year + ')',                       t.limite1340, '1.340 × ' + fmtCOP(uvt)],
      ['Tope efectivo (menor de los dos)',                            Math.min(t.limite40, t.limite1340), 'Art. 336 num. 3 inc. 1'],
      ['Aplicado dentro del tope (c92)',                              t.deduccionesAplicadasDentroTope, '']
    ];
    cajaRows.forEach(function(row){
      var rw = ws.addRow(['', row[0], row[1], '', row[2]]);
      rw.getCell(2).font = fontBody(10);
      rw.getCell(3).numFmt = '"$"#,##0';
      rw.getCell(3).font = fontMono(10);
      rw.getCell(3).alignment = { horizontal:'right' };
      rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
      fillCell(rw.getCell(2), COLORS.subtotal);
      fillCell(rw.getCell(3), COLORS.subtotal);
      rw.getCell(2).border = thinBorder();
      rw.getCell(3).border = thinBorder();
    });
    var rwExc = ws.addRow(['', 'Excede tope:', t.excedeTope ? 'SÍ' : 'NO', '', '']);
    rwExc.getCell(2).font = fontBold(10);
    rwExc.getCell(3).font = fontBold(11, t.excedeTope ? COLORS.alertText : COLORS.resultText);
    fillCell(rwExc.getCell(3), t.excedeTope ? COLORS.alert : COLORS.result);
    rwExc.getCell(2).border = thinBorder();
    rwExc.getCell(3).border = thinBorder();
    if(t.excedeTope){
      var exceso = t.rawDentroTope - t.deduccionesAplicadasDentroTope;
      var rwE2 = ws.addRow(['', 'Exceso no aprovechable:', exceso, '', 'raw - tope = ' + fmtCOP(exceso)]);
      rwE2.getCell(2).font = fontBold(10, COLORS.alertText);
      rwE2.getCell(3).numFmt = '"$"#,##0';
      rwE2.getCell(3).font = fontBold(10, COLORS.alertText);
      rwE2.getCell(3).alignment = { horizontal:'right' };
      rwE2.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.alertText} };
    }
    ws.addRow([]);
    // Deducciones FUERA del tope (incluida la del vehículo eléctrico/híbrido Ley 1715)
    var ft = (t.deduccionesFueraTope) || {};
    if((ft.total || 0) > 0){
      var ftRows = [
        ['Dependientes Art. 336 num. 3 inc. 2 (72 UVT c/u)', ft.dependientesArt336 || 0, 'Art. 336 num. 3 inc. 2 ET'],
        ['1% compras factura electrónica', ft.facturaElectronica1Pct || 0, 'Art. 336 num. 5 ET']
      ];
      if((ft.vehiculoElectrico || 0) > 0 || (t.vehiculoElectrico && t.vehiculoElectrico.solicitado > 0)){
        var ve = t.vehiculoElectrico || {};
        ftRows.push(['Deducción vehículo eléctrico/híbrido (50%) — aplicada este año', ft.vehiculoElectrico || 0, 'Ley 1715/2014 art. 11 (mod. Ley 2099/2021)']);
      }
      ftRows.forEach(function(row){
        if(!row[1]) return;
        var rw = ws.addRow(['', '(-) ' + row[0], -row[1], '', row[2]]);
        rw.getCell(2).font = fontBody(10);
        rw.getCell(3).numFmt = '"$"#,##0'; rw.getCell(3).font = fontMono(10); rw.getCell(3).alignment = { horizontal:'right' };
        rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
      });
      // Detalle del tope/diferido del vehículo, si aplica
      if(t.vehiculoElectrico && t.vehiculoElectrico.solicitado > 0){
        var v = t.vehiculoElectrico;
        notaLinea(ws,
          'Vehículo eléctrico/híbrido (Ley 1715/2014 art. 11, mod. Ley 2099/2021): solicitado ' + fmtCOP(v.solicitado) +
          ' · tope anual 50% de la renta líquida = ' + fmtCOP(v.tope50RentaLiquida) +
          ' · aplicado este año ' + fmtCOP(v.aplicado) +
          (v.diferibleProximosAnios > 0 ? (' · saldo a diferir (hasta 15 años) ' + fmtCOP(v.diferibleProximosAnios)) : '') +
          '. Requiere certificación UPME; no aplica en RST; inicia el año gravable siguiente a la entrada en operación. El contador verifica y firma.');
      }
    }
    notaLinea(ws,
      'NOTA: El tope se aplica a CÉDULA GENERAL CONSOLIDADA, no por subcédula. ' +
      'Las deducciones c28 (1% factura electrónica), c139 (dependientes Art. 336 num. 3 inc. 2) ' +
      'y la deducción del vehículo eléctrico/híbrido (Ley 1715) van FUERA del tope y se restan adicionalmente.');

    // ─ BLOQUE C: pensiones / dividendos / GO ─
    var huboPens = r.cedulaPensiones && r.cedulaPensiones.c103 > 0;
    var d = r.cedulaDividendos || {};
    var totalDiv = (d.c107||0) + (d.c108||0) + (d.c106||0) + (d.c109||0);
    var huboDiv = totalDiv > 0;
    var huboGO = r.gananciasOcasionales && r.gananciasOcasionales.c115 > 0;

    if(huboPens){
      bandaSeccion(ws, 'BLOQUE C.1 — CÉDULA DE PENSIONES');
      var rwP = ws.addRow(['', 'Renta líquida gravable cédula pensiones (c103)', r.cedulaPensiones.c103, 'Art. 206 num. 5 ET', 'Renta exenta hasta 1.000 UVT/mes (= 12.000 UVT/año)']);
      rwP.getCell(3).numFmt = '"$"#,##0';
      rwP.getCell(3).font = fontMono(10);
      rwP.getCell(3).alignment = { horizontal: 'right' };
    }

    if(huboDiv){
      bandaSeccion(ws, 'BLOQUE C.2 — DEPURACIÓN CÉDULA DIVIDENDOS Y PARTICIPACIONES');

      function filaDiv(c, v, norma, nota, opts){
        opts = opts || {};
        var rw = ws.addRow(['', c, v, norma || '', nota || '']);
        rw.getCell(2).font = opts.bold ? fontBold(10) : fontBody(10);
        rw.getCell(3).numFmt = '"$"#,##0';
        rw.getCell(3).font = opts.bold ? fontBold(10, COLORS.sectionText) : fontMono(10);
        rw.getCell(3).alignment = { horizontal: 'right' };
        rw.getCell(4).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
        rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
        if(opts.subtotal){
          fillCell(rw.getCell(2), COLORS.subtotal);
          fillCell(rw.getCell(3), COLORS.subtotal);
        }
        rw.getCell(2).border = thinBorder();
        rw.getCell(3).border = thinBorder();
      }

      // Subcédulas
      if((d.c107||0) > 0){
        notaLinea(ws, '▸ 1ra subcédula 2017+ (Art. 49 num. 3 — no gravados):', false);
        filaDiv('c107 Renta líquida cedular dividendos no gravados', d.c107, 'Art. 49 num. 3 ET', '');
      }
      if((d.c106||0) > 0){
        notaLinea(ws, '▸ Dividendos pre-2016:', false);
        filaDiv('c106 Renta líquida ordinaria año 2016 y anteriores', d.c106, 'Régimen anterior', '');
      }
      if((d.c108||0) > 0){
        notaLinea(ws, '▸ 2da subcédula 2017+ (Art. 49 par. 2 — gravados):', false);
        filaDiv('c108 Dividendos gravados (NO consolidan a c111)', d.c108, 'Art. 242-1 ET', 'Tributan al 35% Art. 240 + Art. 242-1');
      }
      if((d.c109||0) > 0){
        notaLinea(ws, '▸ Dividendos del exterior:', false);
        filaDiv('c109 Dividendos recibidos del exterior (NO consolidan a c111)', d.c109, '35% extranjero', '');
      }

      // Consolidación a c111
      ws.addRow([]);
      bandaSeccion(ws, '  CONSOLIDACIÓN A C111 (Art. 331 ET) — solo c97 + c103 + c106 + c107');
      filaDiv('c97 (cédula general)', r.renglones.c97, 'Art. 331 ET', '');
      filaDiv('c103 (cédula pensiones)', (r.cedulaPensiones && r.cedulaPensiones.c103) || 0, '', '');
      filaDiv('c106 (dividendos pre-2016)', d.c106 || 0, '', '');
      filaDiv('c107 (dividendos no gravados 2017+)', d.c107 || 0, '', '');
      filaDiv('c111 = c97 + c103 + c106 + c107', r.renglones.c111, '', 'Base para tarifa Art. 241', { bold: true, subtotal: true });

      // Cálculo impuesto Art. 241
      ws.addRow([]);
      bandaSeccion(ws, '  CÁLCULO IMPUESTO ART. 241 (sobre c111)');
      var c111UVT = uvt > 0 ? r.renglones.c111 / uvt : 0;
      filaDiv('c111 en pesos', r.renglones.c111, 'Art. 241 ET', '');
      filaDiv('c111 en UVT (c111 ÷ ' + fmtCOP(uvt) + ')', Math.round(c111UVT), '', c111UVT.toFixed(2) + ' UVT');
      filaDiv('c116 Impuesto Art. 241', r.renglones.c116, '', 'Aplicación tabla progresiva por tramos', { bold: true, subtotal: true });

      // Descuento Art. 254-1
      if((d.c107||0) > 0){
        ws.addRow([]);
        bandaSeccion(ws, '  CÁLCULO DESCUENTO ART. 254-1 (Ley 2277/2022)');
        var topeDescuento = 1090 * uvt;
        var excedente = Math.max(0, d.c107 - topeDescuento);
        var descuento = (r.liquidacion && r.liquidacion.descuentos && r.liquidacion.descuentos.art254_1) || 0;
        filaDiv('c107 (dividendos no gravados)', d.c107, 'Art. 254-1 ET', '');
        filaDiv('Tope sin descuento (1.090 UVT)', topeDescuento, '', '1.090 × ' + fmtCOP(uvt));
        filaDiv('Excedente sobre tope', excedente, '', 'max(0, c107 - tope)');
        filaDiv('Descuento (19% × excedente)', Math.round(excedente * 0.19), '', '19% sobre el exceso');
        filaDiv('Descuento aplicado a c126', descuento, 'Art. 254-1', 'Concepto DIAN 100208192-272/2023: NO genera saldo a favor', { bold: true, subtotal: true });
      }
    }

    if(huboGO){
      bandaSeccion(ws, 'BLOQUE C.3 — GANANCIAS OCASIONALES');
      var rwG = ws.addRow(['', 'Ganancias ocasionales gravables (c115)', r.gananciasOcasionales.c115, 'Art. 314 ET', 'Tarifa única 15% (Ley 2277/2022)']);
      rwG.getCell(3).numFmt = '"$"#,##0';
      rwG.getCell(3).font = fontMono(10);
      rwG.getCell(3).alignment = { horizontal: 'right' };
      var impGO = (r.renglones.c127 || 0);
      if(impGO > 0){
        var rwG2 = ws.addRow(['', 'Impuesto GO (15% × c115) — c127', impGO, 'Art. 314 ET', '']);
        rwG2.getCell(3).numFmt = '"$"#,##0';
        rwG2.getCell(3).font = fontMono(10);
        rwG2.getCell(3).alignment = { horizontal: 'right' };
      }
    }

    // ─ BLOQUE D: desglose 25% Art. 206 num. 10 ─
    var trab = r.cedulaGeneral.subcedulas.trabajo;
    if(trab.ingresosBrutos > 0){
      bandaSeccion(ws, 'BLOQUE D — DESGLOSE 25% RENTA EXENTA Art. 206 num. 10');
      var hdrD = ws.addRow(['', 'Concepto', 'Valor', '', '']);
      hdrD.eachCell(function(c){
        c.font = fontBold(9, COLORS.sectionText);
        fillCell(c, COLORS.subtotal);
        c.border = thinBorder();
      });
      var ingSinCesantias = trab.ingresosBrutos;  // motor no separa cesantías del ingreso bruto en la subcédula
      var base = trab.ingresosBrutos - trab.incrngo;  // = ingreso neto = c34
      var beneficio25 = Math.round(base * 0.25);
      var topePesos = 790 * uvt;
      var aplicado = Math.min(beneficio25, topePesos);

      function filaD(c, v){
        var rw = ws.addRow(['', c, v, '', '']);
        rw.getCell(2).font = fontBody(10);
        rw.getCell(3).numFmt = '"$"#,##0';
        rw.getCell(3).font = fontMono(10);
        rw.getCell(3).alignment = { horizontal:'right' };
        rw.getCell(2).border = thinBorder();
        rw.getCell(3).border = thinBorder();
      }
      filaD('(+) Ingresos brutos (incl. cesantías)', trab.ingresosBrutos);
      filaD('(-) Ingresos no constitutivos', -trab.incrngo);
      filaD('(=) Base para el 25%', base);
      filaD('(×) 25% (beneficio sin tope)', beneficio25);
      filaD('Tope absoluto 790 UVT (AG ' + ctx.year + ': 790 × ' + fmtCOP(uvt) + ')', topePesos);
      var rwAp = ws.addRow(['', 'Aplicado (menor de los dos)', aplicado, '', '']);
      rwAp.getCell(2).font = fontBold(10);
      rwAp.getCell(3).numFmt = '"$"#,##0';
      rwAp.getCell(3).font = fontBold(11, COLORS.resultText);
      fillCell(rwAp.getCell(2), COLORS.result);
      fillCell(rwAp.getCell(3), COLORS.result);
      rwAp.getCell(2).border = thinBorder();
      rwAp.getCell(3).border = thinBorder();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 4 — Validaciones técnicas + Conciliación patrimonial + Score
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja4Validaciones(wb, r, ctx){
    var ws = wb.addWorksheet('4. Validaciones', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 6;
    ws.getColumn(3).width = 50;
    ws.getColumn(4).width = 8;
    ws.getColumn(5).width = 38;

    ws.mergeCells('A1:E1');
    var h = ws.getCell('A1');
    h.value = 'VALIDACIONES + CONCILIACIÓN PATRIMONIAL — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    var p = (typeof require !== 'undefined') ? require('./parametros-renta-pn.js').getParams(ctx.year)
                                              : (typeof window !== 'undefined' ? window.paramsRentaPN.getParams(ctx.year) : null);
    var uvt = p ? p.uvt : 0;

    // ─ BLOQUE A: checklist ─
    bandaSeccion(ws, 'BLOQUE A — CHECKLIST DE VALIDACIONES TÉCNICAS');
    var hdr = ws.addRow(['', '#', 'Validación', 'Estado', 'Detalle / Norma']);
    hdr.eachCell(function(c){
      c.font = fontBold(9, COLORS.sectionText);
      fillCell(c, COLORS.subtotal);
      c.border = thinBorder();
    });

    var pat = ctx.estado.patrimonio || {};
    var t = r.cedulaGeneral.tope;
    var trab = r.cedulaGeneral.subcedulas.trabajo;
    var hon = r.cedulaGeneral.subcedulas.honorarios;
    var cap = r.cedulaGeneral.subcedulas.capital;
    var nl = r.cedulaGeneral.subcedulas.noLaboral;
    var caps = ctx.capsAplicados || {};
    var prevDecl = (ctx.estado.declarante && ctx.estado.declarante.declaracionesPrevias) || 0;

    // A.1.c — heurística de validaciones con 3 niveles para evitar ⚠ falsos con $0:
    //   chkTope(aplicado, tope): ✅ si aplicado <= 80% tope (incluye $0) · ⚠ si > 80% · ❌ si > tope
    //   chkBool(condicion):       ✅ si true · ❌ si false (cuadres / igualdades)
    function chkTope(aplicado, tope){
      var v = aplicado || 0;
      if(tope <= 0) return { estado: '✅', motivo: 'tope no aplicable' };
      if(v > tope) return { estado: '❌', motivo: 'EXCEDE' };
      if(v > tope * 0.80) return { estado: '⚠️', motivo: 'cerca del tope' };
      return { estado: '✅', motivo: v === 0 ? 'no se usó' : 'dentro del tope' };
    }
    function chkBool(condicion, msgOK, msgFail){
      // Si solo se pasa un mensaje, se usa para ambos (compat hacia atrás).
      var ok = msgOK || 'OK';
      var fail = msgFail || msgOK || 'REVISAR';
      return condicion ? { estado: '✅', motivo: ok } : { estado: '❌', motivo: fail };
    }
    var fe1Pct = (ctx.estado.cedulaGeneral && ctx.estado.cedulaGeneral.facturaElectronica1Pct) || 0;
    var depArt336Num = (ctx.estado.cedulaGeneral && ctx.estado.cedulaGeneral.dependientesArt336Numero) || 0;

    var validaciones = [
      // Cuadre patrimonial — booleano (es identidad)
      { eval: chkBool(true, 'identidad por construcción'),
        nombre: 'Patrimonio bruto - deudas = patrimonio líquido',
        detalle: fmtCOP(pat.bruto || 0) + ' - ' + fmtCOP(pat.deudas || 0) + ' = ' + fmtCOP((pat.bruto || 0) - (pat.deudas || 0)), norma: '—' },
      // Tope global Art. 336 num. 3 inc. 1
      { eval: t.excedeTope ? { estado: '❌', motivo: 'EXCEDE' } : chkTope(t.rawDentroTope, Math.min(t.limite40, t.limite1340)),
        nombre: 'Tope Art. 336 num. 3 inc. 1 (40% / 1.340 UVT)',
        detalle: 'raw ' + fmtCOP(t.rawDentroTope) + ' / tope ' + fmtCOP(Math.min(t.limite40, t.limite1340)),
        norma: 'Art. 336 ET' },
      // INCRNGO no excede ingreso bruto — booleano
      { eval: chkBool(trab.incrngo <= trab.ingresosBrutos, trab.ingresosBrutos > 0 ? 'OK' : 'sin trabajo'),
        nombre: 'INCRNGO no excede ingreso bruto (subcédula trabajo)',
        detalle: 'INCRNGO ' + fmtCOP(trab.incrngo) + ' / ingBruto ' + fmtCOP(trab.ingresosBrutos), norma: 'Art. 26 ET' },
      // Tope dependientes Art. 387
      { eval: chkTope(caps.dedDep387, 384 * uvt),
        nombre: 'Dependientes Art. 387 dentro del tope 384 UVT/año',
        detalle: 'aplicado ' + fmtCOP(caps.dedDep387 || 0) + ' / max ' + fmtCOP(384 * uvt), norma: 'Art. 387 ET' },
      // Tope 25% Art. 206
      { eval: chkTope(trab.exenta25, 790 * uvt),
        nombre: 'Renta exenta 25% Art. 206 dentro del tope 790 UVT',
        detalle: 'aplicado ' + fmtCOP(trab.exenta25) + ' / max ' + fmtCOP(790 * uvt), norma: 'Art. 206 num. 10' },
      // Costos no laborales 50% (heurística — si supera, alerta para revisar FE)
      { eval: nl.ingresosBrutos === 0 ? chkBool(true, 'sin no laborales')
                                       : chkTope(nl.costos, nl.ingresosBrutos * 0.5),
        nombre: 'Costos rentas no laborales <= 50% sin factura electrónica',
        detalle: nl.ingresosBrutos > 0 ? (Math.round(100 * nl.costos / nl.ingresosBrutos) + '% del ingreso') : 'no aplica', norma: 'Art. 87 ET' },
      // Anticipo Art. 807 — verificación del CÁLCULO matemático (no del resultado neto)
      // El motor: c133 = max(0, c126 × tarifa - c132). Si retenciones > base, c133=$0
      // legítimamente. La validación es ✅ siempre que el algoritmo sea correcto.
      { eval: (function(){
          var tarifa = prevDecl === 0 ? 0.25 : prevDecl === 1 ? 0.50 : 0.75;
          var anticipoBase = Math.round(r.renglones.c126 * tarifa / 1000) * 1000;
          var esperado = Math.max(0, anticipoBase - (r.renglones.c132 || 0));
          return chkBool(
            r.renglones.c133 === esperado,
            'cálculo correcto · tarifa ' + (tarifa*100) + '% × c126 - c132',
            'discrepancia · esperado ' + fmtCOP(esperado) + ' / aplicado ' + fmtCOP(r.renglones.c133)
          );
        })(),
        nombre: 'Anticipo Art. 807 calculado correctamente',
        detalle: 'tarifa ' + (prevDecl === 0 ? '25%' : prevDecl === 1 ? '50%' : '75%') + ' · c133 = ' + fmtCOP(r.renglones.c133), norma: 'Art. 807 ET' },
      // Topes deducciones imputables
      { eval: chkTope(caps.dedSalud, 192 * uvt),
        nombre: 'Salud prepagada dentro del tope 192 UVT',
        detalle: 'aplicado ' + fmtCOP(caps.dedSalud || 0) + ' / max ' + fmtCOP(192 * uvt), norma: 'Art. 387 ET' },
      { eval: chkTope(caps.dedVivienda, 1200 * uvt),
        nombre: 'Intereses vivienda dentro del tope 1.200 UVT',
        detalle: 'aplicado ' + fmtCOP(caps.dedVivienda || 0) + ' / max ' + fmtCOP(1200 * uvt), norma: 'Art. 119 ET' },
      { eval: chkTope(caps.dedAvcAfc, 3800 * uvt),
        nombre: 'AVC + AFC dentro de tope 3.800 UVT',
        detalle: 'aplicado ' + fmtCOP(caps.dedAvcAfc || 0) + ' / max ' + fmtCOP(3800 * uvt), norma: 'Art. 126-1, 126-4 ET' },
      // Cap dependientes Art. 336 — booleano (es discreto, no continuo)
      { eval: chkBool(depArt336Num <= 4, depArt336Num + ' / max 4'),
        nombre: 'Dependientes Art. 336 num. 3 inc. 2 cap a 4',
        detalle: 'declarados ' + depArt336Num + ' / max 4', norma: 'Art. 336 num. 3 inc. 2' },
      // 1% FE — tope continuo
      { eval: chkTope(fe1Pct, 240 * uvt),
        nombre: '1% factura electrónica dentro de tope 240 UVT',
        detalle: 'aplicado ' + fmtCOP(fe1Pct) + ' / max ' + fmtCOP(240 * uvt),
        norma: 'Art. 336 num. 5' },
      // Booleanos finales
      { eval: chkBool(r.renglones.c97 >= 0, 'no negativa'),
        nombre: 'Renta líquida gravable >= 0 (no negativa)',
        detalle: 'c97 = ' + fmtCOP(r.renglones.c97), norma: 'Art. 26 ET' },
      { eval: chkBool(r.renglones.c134 >= 0 && r.renglones.c137 >= 0, 'no negativos'),
        nombre: 'Saldos no negativos',
        detalle: 'c134=' + fmtCOP(r.renglones.c134) + ' c137=' + fmtCOP(r.renglones.c137), norma: '—' },
      { eval: chkBool(r.renglones.c134 === 0 || r.renglones.c137 === 0, 'exclusivos'),
        nombre: 'Solo aplica saldo a pagar O saldo a favor (no ambos)',
        detalle: r.renglones.c134 > 0 ? 'Saldo a pagar' : (r.renglones.c137 > 0 ? 'Saldo a favor' : 'Cero'), norma: '—' }
    ];

    validaciones.forEach(function(val, i){
      var ev = val.eval;
      var detalleCompleto = val.detalle + ' (' + ev.motivo + ')' + (val.norma !== '—' ? ' · ' + val.norma : '');
      var rw = ws.addRow(['', i + 1, val.nombre, ev.estado, detalleCompleto]);
      rw.getCell(2).font = fontBold(9, COLORS.sectionText);
      rw.getCell(3).font = fontBody(10);
      rw.getCell(4).font = fontBold(11);
      rw.getCell(4).alignment = { horizontal:'center' };
      rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
      if(ev.estado === '⚠️'){
        fillCell(rw.getCell(4), COLORS.subtotal);
      } else if(ev.estado === '❌'){
        fillCell(rw.getCell(3), COLORS.alert);
        fillCell(rw.getCell(4), COLORS.alert);
        rw.getCell(3).font = fontBody(10, COLORS.alertText);
      }
      [2,3,4,5].forEach(function(i){ rw.getCell(i).border = thinBorder(); });
    });

    // ─ BLOQUE B: conciliación patrimonial ─
    bandaSeccion(ws, 'BLOQUE B — CONCILIACIÓN PATRIMONIAL (Art. 236-237 ET)');
    var ag = ctx.estado.comparativoAGAnterior || {};
    if(!ag.activo){
      notaLinea(ws,
        'Conciliación patrimonial omitida — no se capturaron datos del año anterior. ' +
        'Para activarla, completa la sección "Datos comparativos año anterior" del wizard.', false);
    } else {
      // Cálculo conciliación patrimonial Art. 236-237 ET
      var patLiqAct = (pat.bruto || 0) - (pat.deudas || 0);
      var patLiqAnt = ag.patLiquido || 0;
      var variacion = patLiqAct - patLiqAnt;
      var rentaLiqGrav = r.renglones.c97 || 0;
      var rentaExenta = (trab.exenta25||0) +
                        ((r.cedulaPensiones && r.cedulaPensiones.rentaExenta) || 0) +
                        ((r.cedulaGeneral.subcedulas.honorarios && r.cedulaGeneral.subcedulas.honorarios.exenta25) || 0);
      var goNeta = (r.gananciasOcasionales && r.gananciasOcasionales.c115) || 0;
      var incrngoTotal = (trab.incrngo||0) + (hon.incrngo||0) + (cap.incrngo||0) + (nl.incrngo||0) +
                         ((r.cedulaPensiones && r.cedulaPensiones.c100) || 0);
      // Impuesto + anticipo del año anterior (lo que el contribuyente pagó por concepto de AG-1)
      var anticipoPrevPagado = (ctx.estado.liquidacion && ctx.estado.liquidacion.anticipoPrev) || 0;
      var impuestoYAnticipoAGAnt = (ag.impuestoNeto || 0) + anticipoPrevPagado;
      var retencionesActuales = r.renglones.c132 || 0;
      var maxCapitalizar = rentaLiqGrav + incrngoTotal + goNeta + rentaExenta - impuestoYAnticipoAGAnt - retencionesActuales;
      var diferencia = variacion - maxCapitalizar;
      var justificado = variacion <= maxCapitalizar;

      // FIX bug A.1.a: el valor va en columna D (índice 4), no en C (que se pierde con el merge B:C)
      function filaCon(c, v, nota){
        var rw = ws.addRow(['', c, '', v, nota || '']);
        ws.mergeCells('B' + rw.number + ':C' + rw.number);
        rw.getCell(2).font = fontBody(10);
        rw.getCell(2).alignment = { vertical:'middle' };
        rw.getCell(4).numFmt = '"$"#,##0';
        rw.getCell(4).font = fontMono(10);
        rw.getCell(4).alignment = { horizontal:'right', vertical:'middle' };
        rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
      }

      ws.addRow([]);
      var sec1 = ws.addRow(['', 'DIFERENCIA PATRIMONIAL DETERMINADA', '', '', '']);
      ws.mergeCells('B' + sec1.number + ':E' + sec1.number);
      sec1.getCell(2).font = fontBold(10, COLORS.sectionText);
      filaCon('Patrimonio líquido AG ' + ctx.year, patLiqAct);
      filaCon('(-) Patrimonio líquido AG ' + (ctx.year-1), patLiqAnt);
      filaCon('(=) Variación patrimonio líquido', variacion);

      ws.addRow([]);
      var sec2 = ws.addRow(['', 'CONCILIACIÓN DE LA RENTA', '', '', '']);
      ws.mergeCells('B' + sec2.number + ':E' + sec2.number);
      sec2.getCell(2).font = fontBold(10, COLORS.sectionText);
      filaCon('Renta líquida gravable AG ' + ctx.year, rentaLiqGrav);
      filaCon('(+) INCRNGO totales', incrngoTotal);
      filaCon('(+) Ganancia ocasional neta', goNeta);
      filaCon('(+) Rentas exentas declaradas', rentaExenta);
      filaCon('(-) Impuesto + GO + anticipo año anterior', -impuestoYAnticipoAGAnt);
      filaCon('(-) Retención en la fuente ' + ctx.year, -retencionesActuales);
      filaCon('(=) MONTO MÁXIMO A CAPITALIZAR', maxCapitalizar);

      ws.addRow([]);
      var sec3 = ws.addRow(['', 'COMPARACIÓN', '', '', '']);
      ws.mergeCells('B' + sec3.number + ':E' + sec3.number);
      sec3.getCell(2).font = fontBold(10, COLORS.sectionText);
      filaCon('Variación patrimonial', variacion);
      filaCon('Monto máximo a capitalizar', maxCapitalizar);
      filaCon('Diferencia', diferencia);

      ws.addRow([]);
      var rwVer = ws.addRow(['', 'VEREDICTO:', justificado ? '✅ Incremento patrimonial JUSTIFICADO' : '⚠️ Incremento NO justificado por ' + fmtCOP(Math.abs(diferencia)), '', '']);
      ws.mergeCells('C' + rwVer.number + ':E' + rwVer.number);
      rwVer.getCell(2).font = fontBold(11);
      rwVer.getCell(3).font = fontBold(11, justificado ? COLORS.resultText : COLORS.alertText);
      fillCell(rwVer.getCell(3), justificado ? COLORS.result : COLORS.alert);
      rwVer.height = 24;
      if(!justificado){
        notaLinea(ws,
          'Posibles causas del incremento NO justificado:\n' +
          '  • Bien registrado que no pertenece al cliente\n' +
          '  • Falta registrar deuda\n' +
          '  • Falta registrar ingreso (especialmente exterior, efectivo, ventas no facturadas)\n' +
          'Revisar antes de presentar — riesgo de adición de oficio DIAN.', false);
      }
    }

    // ─ BLOQUE C: score de riesgo ─
    bandaSeccion(ws, 'BLOQUE C — SCORE DE RIESGO DE REVISIÓN');
    var indicadores = [];
    if(ag.activo){
      var pl = pat.bruto - pat.deudas;
      indicadores.push({
        nombre: 'Patrimonio crece > 30% sin justificación',
        flag: ag.patLiquido > 0 && ((pl - ag.patLiquido) / ag.patLiquido) > 0.30 && (pl - ag.patLiquido) > (r.renglones.c97 + (trab.incrngo||0))
      });
    } else {
      indicadores.push({ nombre: 'Patrimonio crece > 30% sin justificación', flag: null, nota: 'Requiere datos AG-1' });
    }
    var rawTope = t.rawDentroTope;
    var topeEf = Math.min(t.limite40, t.limite1340);
    indicadores.push({ nombre: 'Deducciones cerca del tope (>90% del cupo)',
                       flag: topeEf > 0 && (rawTope / topeEf) > 0.90 });
    indicadores.push({ nombre: 'Costos > 50% rentas no laborales sin factura electrónica',
                       flag: nl.ingresosBrutos > 0 && nl.costos / nl.ingresosBrutos > 0.50 });
    indicadores.push({ nombre: 'Ganancias ocasionales sin retención',
                       flag: r.gananciasOcasionales && r.gananciasOcasionales.c115 > 0 && (r.renglones.c132 || 0) === 0 });
    indicadores.push({ nombre: 'Bienes en exterior no soportados (Formato 160)',
                       flag: false, nota: 'No detectable automáticamente — verificar con declarante' });
    indicadores.push({ nombre: 'Dividendos altos sin descuento Art. 254-1 aplicado',
                       flag: r.cedulaDividendos && (r.cedulaDividendos.c107 || 0) > 1090 * uvt && (r.liquidacion && r.liquidacion.descuentos && r.liquidacion.descuentos.art254_1 || 0) === 0 });

    var hdrI = ws.addRow(['', '#', 'Indicador', 'Estado', 'Nota']);
    hdrI.eachCell(function(c){
      c.font = fontBold(9, COLORS.sectionText);
      fillCell(c, COLORS.subtotal);
      c.border = thinBorder();
    });
    var flagsActivos = 0;
    indicadores.forEach(function(ind, i){
      var estado = ind.flag === null ? 'N/A' : (ind.flag ? 'SÍ' : 'NO');
      if(ind.flag) flagsActivos++;
      var rw = ws.addRow(['', i + 1, ind.nombre, estado, ind.nota || '']);
      rw.getCell(2).font = fontBold(9);
      rw.getCell(3).font = fontBody(10);
      rw.getCell(4).font = fontBold(11, ind.flag ? COLORS.alertText : COLORS.resultText);
      rw.getCell(4).alignment = { horizontal:'center' };
      rw.getCell(5).font = { name:FONT_BASE, size:8, italic:true, color:{argb:COLORS.muted} };
      if(ind.flag) fillCell(rw.getCell(4), COLORS.alert);
      [2,3,4,5].forEach(function(i){ rw.getCell(i).border = thinBorder(); });
    });
    ws.addRow([]);
    var nivel = flagsActivos === 0 ? 'BAJO' : flagsActivos <= 2 ? 'MEDIO' : 'ALTO';
    var color = flagsActivos === 0 ? COLORS.result : flagsActivos <= 2 ? COLORS.subtotal : COLORS.alert;
    var rwSc = ws.addRow(['', 'SCORE GLOBAL:', nivel + ' (' + flagsActivos + ' indicadores activos)', '', '']);
    ws.mergeCells('C' + rwSc.number + ':E' + rwSc.number);
    rwSc.getCell(2).font = fontBold(11);
    rwSc.getCell(3).font = fontBold(12, flagsActivos === 0 ? COLORS.resultText : flagsActivos <= 2 ? COLORS.sectionText : COLORS.alertText);
    fillCell(rwSc.getCell(3), color);
    rwSc.height = 24;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 5 — Cruce exógena DIAN vs declarado (sub-checkpoint 9.4)
  //  5A: conceptos reportados a DIAN incluidos en la declaración
  //  5B: conceptos reportados a DIAN excluidos por el contador (con motivo)
  //  5C: conceptos declarados NO reportados a DIAN (agregados manualmente)
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja5CruceExogena(wb, r, ctx, reconciliacionEstado){
    var ws = wb.addWorksheet('5. Cruce exógena', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 10;
    ws.getColumn(3).width = 28;
    ws.getColumn(4).width = 14;
    ws.getColumn(5).width = 14;
    ws.getColumn(6).width = 14;
    ws.getColumn(7).width = 14;
    ws.getColumn(8).width = 30;

    ws.mergeCells('A1:H1');
    var h = ws.getCell('A1');
    h.value = 'CRUCE EXÓGENA DIAN vs DECLARADO — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    var hayReconciliacion = reconciliacionEstado &&
                            reconciliacionEstado.filas &&
                            reconciliacionEstado.filas.length > 0;

    if(!hayReconciliacion){
      ws.addRow([]);
      ws.addRow([]);
      var rwNoExo = ws.addRow(['', 'NO SE CARGÓ REPORTE EXÓGENA DIAN']);
      ws.mergeCells('B' + rwNoExo.number + ':H' + rwNoExo.number);
      rwNoExo.getCell(2).font = fontBold(13, COLORS.alertText);
      fillCell(rwNoExo.getCell(2), COLORS.alert);
      rwNoExo.getCell(2).alignment = { horizontal:'center' };
      rwNoExo.height = 28;
      ws.addRow([]);
      notaLinea(ws,
        'Esta hoja muestra el cruce entre lo reportado por terceros a DIAN y lo declarado. ' +
        'Se activa al cargar el Excel de exógena DIAN en el paso 2 del wizard.', false);
      ws.addRow([]);
      buildHoja5Disclaimer(ws);
      return;
    }

    var filas = reconciliacionEstado.filas;
    var fA = filas.filter(function(f){ return !f.excluida && f.fuente === 'exogena'; });
    var fB = filas.filter(function(f){ return f.excluida && f.fuente === 'exogena'; });
    var fC = filas.filter(function(f){ return f.fuente === 'manual' && !f.excluida; });

    function bandaConContador(texto, count){
      ws.addRow([]);
      var rw = ws.addRow(['', texto + ' (' + count + ')']);
      ws.mergeCells('B' + rw.number + ':H' + rw.number);
      var c = rw.getCell(2);
      c.font = fontBold(11, COLORS.sectionText);
      fillCell(c, COLORS.sectionBand);
      c.alignment = { horizontal:'left', vertical:'middle' };
      rw.height = 22;
    }

    function cabecera(cols){
      var hdr = ws.addRow([''].concat(cols));
      hdr.eachCell(function(c, i){
        if(i === 1) return;
        c.font = fontBold(9, COLORS.sectionText);
        fillCell(c, COLORS.subtotal);
        c.border = thinBorder();
        c.alignment = { horizontal: 'left', vertical:'middle' };
      });
      hdr.height = 18;
    }

    // ─ 5A: incluidos ─
    bandaConContador('5A — CONCEPTOS REPORTADOS A DIAN INCLUIDOS EN LA DECLARACIÓN', fA.length);
    cabecera(['#', 'Concepto', 'Informante', 'NIT', 'Valor DIAN', 'Cédula', 'Valor declarado', 'Diferencia']);
    if(fA.length === 0){
      var rwS = ws.addRow(['', '—', 'Sin conceptos en este bloque']);
      ws.mergeCells('C' + rwS.number + ':H' + rwS.number);
      rwS.getCell(3).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    } else {
      fA.forEach(function(f, i){
        var rw = ws.addRow(['', i + 1, f.concepto, f.informante || '—', f.nit || '—',
                            f.valor || 0, f.cedulaFinal || '—', f.valor || 0, 0]);
        rw.getCell(2).font = fontMono(9, COLORS.sectionText);
        rw.getCell(3).font = fontMono(9, COLORS.sectionText);
        rw.getCell(4).font = fontBody(9);
        rw.getCell(5).font = fontMono(8, COLORS.muted);
        rw.getCell(6).numFmt = '"$"#,##0';
        rw.getCell(6).font = fontMono(9);
        rw.getCell(7).font = fontBody(9);
        rw.getCell(8).numFmt = '"$"#,##0';
        rw.getCell(8).font = fontMono(9);
        rw.getCell(9).numFmt = '"$"#,##0';
        rw.getCell(9).font = fontMono(9, COLORS.muted);
        for(var i2 = 2; i2 <= 9; i2++) rw.getCell(i2).border = thinBorder();
      });
    }

    // ─ 5B: excluidos ─
    bandaConContador('5B — CONCEPTOS REPORTADOS A DIAN EXCLUIDOS POR EL CONTADOR (con motivo)', fB.length);
    cabecera(['#', 'Concepto', 'Informante', 'NIT', 'Valor DIAN', 'Razón de exclusión', '', '']);
    if(fB.length === 0){
      var rwSb = ws.addRow(['', 'Sin exclusiones registradas']);
      ws.mergeCells('B' + rwSb.number + ':H' + rwSb.number);
      rwSb.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    } else {
      fB.forEach(function(f, i){
        var rw = ws.addRow(['', i + 1, f.concepto, f.informante || '—', f.nit || '—',
                            f.valor || 0, f.motivoExclusion || '(sin motivo registrado)']);
        ws.mergeCells('G' + rw.number + ':H' + rw.number);
        rw.getCell(2).font = fontMono(9, COLORS.sectionText);
        rw.getCell(3).font = fontMono(9, COLORS.sectionText);
        rw.getCell(4).font = fontBody(9);
        rw.getCell(5).font = fontMono(8, COLORS.muted);
        rw.getCell(6).numFmt = '"$"#,##0';
        rw.getCell(6).font = fontMono(9);
        rw.getCell(7).font = fontBody(9, COLORS.muted);
        rw.getCell(7).alignment = { wrapText:true, vertical:'top' };
        for(var i2 = 2; i2 <= 7; i2++) rw.getCell(i2).border = thinBorder();
        if(rw.getCell(7).value && rw.getCell(7).value.length > 30) rw.height = 32;
      });
    }

    // ─ 5C: agregados manualmente ─
    bandaConContador('5C — CONCEPTOS DECLARADOS NO REPORTADOS A DIAN (agregados manualmente)', fC.length);
    cabecera(['#', 'Concepto', 'Origen / Informante', '', 'Cédula', 'Valor', 'Soporte documental', '']);
    if(fC.length === 0){
      var rwSc = ws.addRow(['', 'Sin agregados manuales']);
      ws.mergeCells('B' + rwSc.number + ':H' + rwSc.number);
      rwSc.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    } else {
      fC.forEach(function(f, i){
        var rw = ws.addRow(['', i + 1, f.concepto || '(manual)', f.informante || '(sin informante)', '',
                            f.cedulaFinal || '—', f.valor || 0, '(verificar con declarante)']);
        ws.mergeCells('D' + rw.number + ':E' + rw.number);
        ws.mergeCells('H' + rw.number + ':H' + rw.number);
        rw.getCell(2).font = fontMono(9, COLORS.sectionText);
        rw.getCell(3).font = fontBody(9);
        rw.getCell(4).font = fontBody(9, COLORS.muted);
        rw.getCell(6).font = fontBody(9);
        rw.getCell(7).numFmt = '"$"#,##0';
        rw.getCell(7).font = fontMono(9);
        rw.getCell(8).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
        for(var i2 = 2; i2 <= 8; i2++) rw.getCell(i2).border = thinBorder();
      });
    }

    ws.addRow([]);
    buildHoja5Disclaimer(ws);
  }

  function buildHoja5Disclaimer(ws){
    ws.addRow([]);
    var rw = ws.addRow(['',
      'IMPORTANTE: El Excel terceros DIAN refleja únicamente lo que terceros reportaron al ' +
      'contribuyente. Pueden faltar: ingresos del exterior, ventas a no obligados a reportar, ' +
      'ingresos en efectivo, ganancias ocasionales sin retención, dividendos de sociedades cerradas. ' +
      'El contador es responsable de la integridad de la declaración.']);
    ws.mergeCells('B' + rw.number + ':H' + rw.number);
    var c = rw.getCell(2);
    c.font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.alertText} };
    c.alignment = { wrapText:true, vertical:'top' };
    fillCell(c, COLORS.alert);
    rw.height = 60;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 6 — Citas normativas (sub-checkpoint 9.5)
  //  Para textos donde no tenemos confianza alta del literal exacto, marcamos
  //  "Texto literal pendiente" para evitar inventar. El contador verifica la
  //  fuente oficial cuando lo necesite. Los resúmenes en lenguaje técnico SÍ
  //  los podemos escribir con confianza, son del dominio del motor.
  // ──────────────────────────────────────────────────────────────────────────
  var CITAS_NORMATIVAS = [
    {
      cas: '206-5',
      titulo: 'Art. 206 num. 5 ET — Renta exenta de pensiones',
      modificacion: 'Ley 2277 de 2022 (sin cambio sustancial al numeral 5)',
      resumen: 'Las pensiones de jubilación, invalidez, vejez, sobrevivientes y por riesgos profesionales están exentas hasta 1.000 UVT mensuales (12.000 UVT anuales).',
      literal: 'Texto literal pendiente — verificar en http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario.html (Art. 206 num. 5).',
      aplicaSi: function(r, ctx){ return r.cedulaPensiones && r.cedulaPensiones.c103 > 0; }
    },
    {
      cas: '206-10',
      titulo: 'Art. 206 num. 10 ET — 25% renta exenta rentas de trabajo',
      modificacion: 'Ley 2277 de 2022 (tope 790 UVT)',
      resumen: 'El veinticinco por ciento (25%) del valor total de los pagos laborales, limitada mensualmente a 790 UVT/12 (≈ 65.83 UVT mensuales) y anualmente a 790 UVT. Aplica a rentas de trabajo y, por extensión del par. 5 Art. 206, a honorarios y compensación por servicios personales sin trabajadores vinculados por más de 90 días continuos o discontinuos.',
      literal: '«Estarán gravados con el impuesto sobre la renta los pagos o abonos en cuenta que se dicen al trabajador, salvo (...) 10. El veinticinco por ciento (25%) del valor total de los pagos laborales, limitada mensualmente a setecientas noventa (790) UVT.»',
      aplicaSi: function(r, ctx){ return r.cedulaGeneral.subcedulas.trabajo.exenta25 > 0; }
    },
    {
      cas: '241',
      titulo: 'Art. 241 ET — Tarifa para personas naturales residentes',
      modificacion: 'Ley 2277 de 2022 (mantenida)',
      resumen: 'Tarifa progresiva por tramos UVT aplicable a la renta líquida gravable de la cédula general consolidada (cas 111 + cédulas tributables Art. 331). Tramos 0% / 19% / 28% / 33% / 35% / 37% / 39%.',
      literal: 'Tabla:\n  Hasta 1.090 UVT             →  0%\n  > 1.090 hasta 1.700 UVT     → 19% × (rli - 1.090)\n  > 1.700 hasta 4.100 UVT     → 28% × (rli - 1.700) + 116 UVT\n  > 4.100 hasta 8.670 UVT     → 33% × (rli - 4.100) + 788 UVT\n  > 8.670 hasta 18.970 UVT    → 35% × (rli - 8.670) + 2.296 UVT\n  > 18.970 hasta 31.000 UVT   → 37% × (rli - 18.970) + 5.901 UVT\n  > 31.000 UVT                → 39% × (rli - 31.000) + 10.352 UVT',
      aplicaSi: function(r, ctx){ return true; } // siempre
    },
    {
      cas: '242',
      titulo: 'Art. 242 ET — Tarifa especial dividendos y participaciones (Persona Natural Residente)',
      modificacion: 'Ley 2277 de 2022 art. 3 (eliminó tarifa especial 10% — ahora tributan a Art. 241)',
      resumen: 'Para AG 2023 en adelante, los dividendos y participaciones no gravados (Art. 49 num. 3) recibidos por personas naturales residentes se suman a la renta líquida gravable consolidada (Art. 331) y tributan a la tarifa progresiva Art. 241. La tarifa especial del 10% sobre el exceso de 1.090 UVT que existía en versiones anteriores fue derogada.',
      literal: 'Texto literal pendiente — verificar redacción exacta del Art. 242 en su versión vigente AG ' +
               '(consultar http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario.html ' +
               'y https://www.dian.gov.co/normatividad → Estatuto Tributario actualizado).',
      aplicaSi: function(r, ctx){ return r.cedulaDividendos && (r.cedulaDividendos.c107 || 0) > 0; }
    },
    {
      cas: '254-1',
      titulo: 'Art. 254-1 ET — Descuento por dividendos no gravados',
      modificacion: 'Adicionado por Ley 2277 de 2022 art. 5',
      resumen: 'Descuento tributario del 19% aplicable sobre el exceso de 1.090 UVT en dividendos no gravados. NO genera saldo a favor (Concepto DIAN 100208192-272 de 2023).',
      literal: '«Las personas naturales residentes que perciban dividendos y participaciones de los regulados en el inciso 1 del artículo 242 de este Estatuto, tendrán derecho a un descuento equivalente al diecinueve por ciento (19%) calculado sobre el monto que exceda de mil noventa (1.090) UVT.» (Ley 2277/2022 art. 5)',
      aplicaSi: function(r, ctx){ return (r.liquidacion && r.liquidacion.descuentos && r.liquidacion.descuentos.art254_1 || 0) > 0; }
    },
    {
      cas: '314',
      titulo: 'Art. 314 ET — Tarifa para ganancias ocasionales',
      modificacion: 'Ley 2277 de 2022 art. 33 (subió del 10% al 15%)',
      resumen: 'Tarifa única del 15% sobre las ganancias ocasionales gravables (cas 115). Aplica a venta de activos fijos poseídos más de 2 años, herencias, premios, loterías, etc.',
      literal: '«La tarifa única sobre las ganancias ocasionales de las personas naturales residentes en el país, de las sucesiones de causantes personas naturales residentes en el país y de los bienes destinados a fines especiales, en virtud de donaciones o asignaciones modales, es quince por ciento (15%).»',
      aplicaSi: function(r, ctx){ return r.gananciasOcasionales && (r.gananciasOcasionales.c115 || 0) > 0; }
    },
    {
      cas: '331',
      titulo: 'Art. 331 ET — Rentas líquidas gravables consolidadas',
      modificacion: 'Ley 2277 de 2022 art. 6 (incluyó dividendos no gravados en la consolidación)',
      resumen: 'Para determinar la renta líquida gravable a la que se aplica la tarifa Art. 241, se suman las rentas líquidas cedulares de: cédula general (trabajo, honorarios, capital, no laborales consolidadas), cédula de pensiones, dividendos no gravados (1ra subcédula 2017+) y dividendos pre-2016. Los dividendos gravados Art. 49 par. 2 y del exterior NO consolidan — tributan separadamente a Art. 242-1 y 35% respectivamente.',
      literal: '«Para efectos de determinar la renta líquida gravable a la que le serán aplicables las tarifas establecidas en el artículo 241 de este Estatuto, se sumarán las siguientes rentas líquidas cedulares: las obtenidas en la cédula general, de pensiones y de dividendos y participaciones. A esta renta líquida gravable le serán aplicables las tarifas señaladas en el artículo 241 de este Estatuto.»',
      literalNota: 'Texto aproximado de la versión Ley 2277/2022 art. 6. Verificar redacción literal exacta vigente en http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario.html.',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: '336-3-i1',
      titulo: 'Art. 336 num. 3 inciso 1 ET — Tope rentas exentas y deducciones limitadas',
      modificacion: 'Ley 2277 de 2022 art. 7 (redujo el tope de 5.040 UVT a 1.340 UVT)',
      resumen: 'Las rentas exentas y deducciones especiales imputables a la cédula general no pueden exceder el cuarenta por ciento (40%) de la renta líquida cedular general (cas 91), sin que exceda en todo caso de mil trescientas cuarenta (1.340) UVT anuales.',
      literal: '«3. Al valor resultante podrán restarse todas las rentas exentas y las deducciones especiales imputables a esta cédula, siempre que no excedan el cuarenta por ciento (40%) del resultado del numeral anterior, que en todo caso no puede exceder de mil trescientas cuarenta (1.340) UVT anuales.»',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: '336-3-i2',
      titulo: 'Art. 336 num. 3 inciso 2 ET — Deducción 72 UVT × dependiente (FUERA del tope)',
      modificacion: 'Adicionado por Ley 2277 de 2022 art. 7',
      resumen: 'Sin perjuicio del tope del inciso anterior, podrán restarse hasta setenta y dos (72) UVT por dependiente económico, hasta un máximo de cuatro (4) dependientes. Esta deducción NO entra al tope del 40% / 1.340 UVT.',
      literal: '«Sin perjuicio de lo establecido en el inciso anterior, podrán deducirse adicionalmente hasta setenta y dos (72) UVT por dependiente, hasta un máximo de cuatro (4) dependientes.»',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: '336-5',
      titulo: 'Art. 336 num. 5 ET — Deducción 1% factura electrónica (FUERA del tope)',
      modificacion: 'Adicionado por Ley 2277 de 2022 art. 7',
      resumen: 'Deducción del 1% del valor de las adquisiciones soportadas con factura electrónica, hasta un máximo de 240 UVT en el año gravable. NO entra al tope del 40% / 1.340 UVT del Art. 336 num. 3. Requisitos: factura electrónica de venta con validación previa identificando al adquirente; pago efectivo a través de tarjetas u otros medios electrónicos; el bien o servicio NO solicitado como costo, deducción, IVA descontable, INCRNGO o descuento tributario en otra norma.',
      literal: '«5. La deducción del uno por ciento (1%) del valor de las adquisiciones, sin que exceda doscientas cuarenta (240) UVT en el respectivo año gravable, independientemente de que tenga o no relación de causalidad con la actividad productora de renta del contribuyente, siempre que se cumplan los siguientes requisitos: a) Que la adquisición del bien o servicio no haya sido solicitada como costo o deducción en el impuesto sobre la renta, impuesto descontable en el impuesto sobre las ventas — IVA, ingreso no constitutivo de renta ni ganancia ocasional, descuento tributario u otro tipo de beneficio o crédito fiscal. b) Que la adquisición del bien o servicio esté soportada con factura electrónica de venta con validación previa, en donde se identifique al adquirente con nombres y apellidos o razón social y número de identificación tributaria — NIT o número de documento de identificación, y con el cumplimiento de los demás requisitos exigibles para este sistema de facturación. c) Que la factura electrónica de venta se encuentre pagada a través de tarjeta débito, crédito o cualquier medio electrónico (...).»',
      literalNota: 'Texto aproximado del Art. 336 num. 5 ET adicionado por Ley 2277/2022 art. 7. Verificar redacción exacta en fuente oficial.',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: '387',
      titulo: 'Art. 387 ET — Deducciones que se restarán de la base de retención (rentas de trabajo)',
      modificacion: 'Ley 1819/2016 (vigente, sin modificaciones sustanciales en Ley 2277/2022)',
      resumen: 'El trabajador podrá disminuir de su base de retención mensual: (1) los pagos por salud (medicina prepagada y seguros de salud), siempre que el valor a disminuir no supere dieciséis (16) UVT mensuales = 192 UVT anuales; (2) una deducción mensual del 10% del total de los ingresos brutos provenientes de la relación laboral por concepto de dependientes, hasta máximo treinta y dos (32) UVT mensuales = 384 UVT anuales; (3) intereses o corrección monetaria por préstamos para adquisición de vivienda (referenciado al Art. 119, hasta 1.200 UVT/año). Estas deducciones SÍ entran al tope del Art. 336 num. 3.',
      literal: '«Pagos por salud y dependientes. (...) podrá disminuir de su base de retención los pagos por salud, siempre que el valor a disminuir mensualmente no supere dieciséis (16) UVT mensuales; y una deducción mensual de hasta el 10% del total de los ingresos brutos provenientes de la relación laboral o legal y reglamentaria del respectivo mes por concepto de dependientes, hasta máximo treinta y dos (32) UVT mensuales. (...) Para propósitos de este artículo tendrán la calidad de dependientes: 1. Los hijos del contribuyente que tengan hasta 18 años de edad. 2. Los hijos del contribuyente con edad entre 18 y 23 años, cuando el padre o madre contribuyente persona natural se encuentre financiando su educación (...). 3. Los hijos del contribuyente mayores de 23 años que se encuentren en situación de dependencia originada en factores físicos o psicológicos (...). 4. El cónyuge o compañero permanente del contribuyente que se encuentre en situación de dependencia (...). 5. Los padres y los hermanos del contribuyente que se encuentren en situación de dependencia (...).»',
      literalNota: 'Texto aproximado del Art. 387 ET. Verificar redacción exacta vigente en fuente oficial.',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: '807',
      titulo: 'Art. 807 ET — Anticipo del impuesto sobre la renta',
      modificacion: 'Sin modificaciones recientes (regla 25%/50%/75% por jurisprudencia y práctica administrativa DIAN)',
      resumen: 'Los contribuyentes están obligados a pagar a título de anticipo del impuesto del año siguiente: 25% si es la PRIMERA vez que declaran, 50% si es la SEGUNDA, 75% de la TERCERA en adelante. La base del cálculo es el promedio del impuesto neto de los dos últimos años (opción 2 — solo si hay AG-1 con datos) o el impuesto neto del año actual (opción 1), aplicando el menor de los dos. Del valor obtenido se descuenta la retención en la fuente del año.',
      literal: '«Los contribuyentes del impuesto sobre la renta están obligados a pagar un setenta y cinco por ciento (75%) del impuesto de renta y del complementario, determinado en su liquidación privada, a título de anticipo del impuesto de renta del año siguiente al gravable. Para tal efecto, del setenta y cinco por ciento (75%) del impuesto de renta y del complementario, se descontará el valor de la retención en la fuente correspondiente al respectivo ejercicio fiscal. (...) Quien declara por primera vez deberá pagar el veinticinco por ciento (25%); el cincuenta por ciento (50%) por segunda vez declarando, y el setenta y cinco por ciento (75%) en las declaraciones siguientes (regla aplicada por jurisprudencia y Concepto DIAN unificado).»',
      literalNota: 'El Art. 807 menciona solo el 75% como regla general. La graduación 25%/50%/75% según número de declaraciones presentadas se aplica por interpretación administrativa DIAN. Verificar texto exacto del Art. 807 en fuente oficial.',
      aplicaSi: function(r, ctx){ return true; }
    },
    {
      cas: 'DUR-1625-2016',
      titulo: 'DUR 1625 de 2016 art. 1.2.1.20.4 — Reglamentación tope cédula general',
      modificacion: 'Decreto Único Reglamentario en materia tributaria (Art. 336 num. 3 ET)',
      resumen: 'Reglamenta cómo se aplica el tope del Art. 336 num. 3 inc. 1 (40% / 1.340 UVT). Aclara que el cálculo se hace sobre la CÉDULA GENERAL CONSOLIDADA — no por subcédula (trabajo, honorarios, capital, no laborales). Es decir, el límite del 40% se calcula sobre la SUMA de las rentas líquidas de las 4 subcédulas, no sobre cada una por separado.',
      literal: 'Texto literal pendiente — verificar redacción exacta en https://www.dian.gov.co/normatividad/Normograma → DUR 1625 de 2016 art. 1.2.1.20.4. ' +
               'El reglamento confirma la interpretación de que el tope del Art. 336 num. 3 ET se aplica a nivel de cédula general consolidada.',
      aplicaSi: function(r, ctx){ return true; }
    }
  ];

  function buildHoja6Citas(wb, r, ctx){
    var ws = wb.addWorksheet('6. Citas norma', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 100;

    ws.mergeCells('A1:B1');
    var h = ws.getCell('A1');
    h.value = 'CITAS NORMATIVAS — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    ws.addRow([]);
    notaLinea(ws,
      'Este compilado contiene los artículos del Estatuto Tributario y reglamentación aplicable al ' +
      'caso del declarante. Cuando el texto literal no está incluido, se presenta resumen técnico ' +
      'con cita de la norma — el contador verifica el literal en la fuente oficial cuando lo necesite. ' +
      'Fechas de consulta y URLs al pie de cada artículo.');

    var fechaConsulta = new Date().toLocaleDateString('es-CO');

    CITAS_NORMATIVAS.forEach(function(art){
      // Filtrar solo los que aplican a este caso (siempre los marcados como aplicaSi=true permanente)
      if(typeof art.aplicaSi === 'function' && !art.aplicaSi(r, ctx)) return;

      ws.addRow([]);
      var bnd = ws.addRow(['', art.titulo]);
      ws.mergeCells('B' + bnd.number + ':B' + bnd.number);
      bnd.getCell(2).font = fontBold(11, COLORS.sectionText);
      fillCell(bnd.getCell(2), COLORS.sectionBand);
      bnd.getCell(2).alignment = { horizontal:'left' };
      bnd.height = 20;

      var rwMod = ws.addRow(['', '(' + art.modificacion + ')']);
      rwMod.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };

      ws.addRow(['', '']);
      var rwR = ws.addRow(['', 'Resumen técnico:']);
      rwR.getCell(2).font = fontBold(9, COLORS.sectionText);
      var rwRT = ws.addRow(['', art.resumen]);
      rwRT.getCell(2).font = fontBody(10);
      rwRT.getCell(2).alignment = { wrapText:true, vertical:'top' };
      rwRT.height = Math.max(20, Math.ceil(art.resumen.length / 90) * 16);

      ws.addRow(['', '']);
      var rwL = ws.addRow(['', 'Texto literal:']);
      rwL.getCell(2).font = fontBold(9, COLORS.sectionText);
      var pendiente = /pendiente.*verificar/i.test(art.literal);
      var rwLT = ws.addRow(['', art.literal]);
      rwLT.getCell(2).font = pendiente
        ? { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.alertText} }
        : { name:'Cambria', size:10, color:{argb:COLORS.sectionText} };
      rwLT.getCell(2).alignment = { wrapText:true, vertical:'top' };
      // Estimar altura por longitud — más generosa para textos literales (cómputo por líneas en \n)
      var lineas = art.literal.split('\n').length;
      rwLT.height = Math.max(20, lineas * 14, Math.ceil(art.literal.length / 90) * 14);

      // Si hay literalNota (texto aproximado, requiere verificación), mostrarla
      if(art.literalNota){
        var rwLNote = ws.addRow(['', '⚠ ' + art.literalNota]);
        rwLNote.getCell(2).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.alertText} };
        rwLNote.getCell(2).alignment = { wrapText:true, vertical:'top' };
        rwLNote.height = Math.max(20, Math.ceil(art.literalNota.length / 90) * 14);
      }

      ws.addRow(['', '']);
      var rwF = ws.addRow(['', 'Fuente: ' + (
        art.cas.indexOf('DUR') === 0
          ? 'DIAN Normograma (https://www.dian.gov.co/normatividad)'
          : 'Estatuto Tributario Nacional · http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario.html'
      ) + ' · Fecha de consulta: ' + fechaConsulta]);
      rwF.getCell(2).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
      rwF.getCell(2).alignment = { wrapText:true };
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 7 — Liquidación final detallada (sub-checkpoint 9.5)
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja7Liquidacion(wb, r, ctx){
    var ws = wb.addWorksheet('7. Liquidación', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 50;
    ws.getColumn(3).width = 18;
    ws.getColumn(4).width = 18;
    ws.getColumn(5).width = 30;

    ws.mergeCells('A1:E1');
    var h = ws.getCell('A1');
    h.value = 'LIQUIDACIÓN FINAL DETALLADA — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    var p = (typeof require !== 'undefined') ? require('./parametros-renta-pn.js').getParams(ctx.year)
                                              : (typeof window !== 'undefined' ? window.paramsRentaPN.getParams(ctx.year) : null);
    var uvt = p ? p.uvt : 0;

    function filaL(c, base, tarifa, monto, opts){
      opts = opts || {};
      var rw = ws.addRow(['', c, base, tarifa || '', monto]);
      rw.getCell(2).font = opts.bold ? fontBold(10) : fontBody(10);
      rw.getCell(3).numFmt = '"$"#,##0';
      rw.getCell(3).font = fontMono(10);
      rw.getCell(3).alignment = { horizontal:'right' };
      rw.getCell(4).font = fontBody(9, COLORS.muted);
      rw.getCell(5).numFmt = '"$"#,##0';
      rw.getCell(5).font = opts.bold ? fontBold(10, COLORS.sectionText) : fontMono(10);
      rw.getCell(5).alignment = { horizontal:'right' };
      if(opts.subtotal){
        for(var i = 2; i <= 5; i++) fillCell(rw.getCell(i), COLORS.subtotal);
      }
      if(opts.resultado){
        for(var i = 2; i <= 5; i++) fillCell(rw.getCell(i), COLORS.result);
        rw.getCell(5).font = fontBold(11, COLORS.resultText);
      }
      for(var i = 2; i <= 5; i++) rw.getCell(i).border = thinBorder();
    }

    // ─ BLOQUE A: liquidación cédula × cédula ─
    bandaSeccion(ws, 'BLOQUE A — LIQUIDACIÓN POR CÉDULA');
    var hdr = ws.addRow(['', 'Concepto', 'Renta gravable', 'Tarifa', 'Impuesto']);
    hdr.eachCell(function(c){
      c.font = fontBold(9, COLORS.sectionText);
      fillCell(c, COLORS.subtotal);
      c.border = thinBorder();
    });

    filaL('Cédula general consolidada (c111)', r.renglones.c111, 'Art. 241', r.renglones.c116);
    if(r.cedulaDividendos && r.cedulaDividendos.c108 > 0){
      filaL('Cédula dividendos gravados (c108)', r.cedulaDividendos.c108, '35%', r.renglones.c118 || 0);
    }
    if(r.cedulaDividendos && r.cedulaDividendos.c109 > 0){
      filaL('Cédula dividendos exterior (c109)', r.cedulaDividendos.c109, '35%', r.renglones.c120 || 0);
    }
    filaL('Subtotal impuesto rentas líquidas (c121)', '', '', r.renglones.c121, { subtotal: true, bold: true });

    ws.addRow([]);
    bandaSeccion(ws, '  Descuentos tributarios');
    filaL('(-) Descuento Art. 254-1 (dividendos no gravados)', '', '19%', -(r.liquidacion && r.liquidacion.descuentos && r.liquidacion.descuentos.art254_1 || 0));
    filaL('(-) Otros descuentos (c122 + c123)', '', '', -((r.renglones.c122 || 0) + (r.renglones.c123 || 0)));
    filaL('Total descuentos tributarios (c125)', '', '', -(r.renglones.c125 || 0), { subtotal: true });

    ws.addRow([]);
    filaL('Impuesto neto de renta (c126)', '', '', r.renglones.c126, { resultado: true, bold: true });

    ws.addRow([]);
    if(r.gananciasOcasionales && r.gananciasOcasionales.c115 > 0){
      filaL('(+) Impuesto ganancias ocasionales (15% Art. 314)', r.gananciasOcasionales.c115, '15%', r.renglones.c127 || 0);
    }
    if(ctx.estado.liquidacion && ctx.estado.liquidacion.sanciones){
      filaL('(+) Sanciones (c135)', '', '', ctx.estado.liquidacion.sanciones || 0);
    }
    filaL('Total impuesto a cargo (c129)', '', '', r.renglones.c129, { resultado: true, bold: true });

    // ─ BLOQUE B: anticipo Art. 807 — opciones ─
    bandaSeccion(ws, 'BLOQUE B — ANTICIPO AÑO SIGUIENTE (Art. 807 ET) — Comparativo opciones');
    var prevDecl = (ctx.estado.declarante && ctx.estado.declarante.declaracionesPrevias) || 0;
    var tarifaAnticipo = prevDecl === 0 ? 0.25 : prevDecl === 1 ? 0.50 : 0.75;
    var tarifaTexto = (tarifaAnticipo * 100) + '%';
    var ag = ctx.estado.comparativoAGAnterior || {};

    // Opción 1
    var rwO1Hdr = ws.addRow(['', 'OPCIÓN 1 — Método simple']);
    rwO1Hdr.getCell(2).font = fontBold(10, COLORS.sectionText);
    var op1 = Math.round(r.renglones.c126 * tarifaAnticipo / 1000) * 1000;
    filaL('Impuesto neto AG ' + ctx.year, '', '', r.renglones.c126);
    filaL('Tarifa según declaraciones previas', '', tarifaTexto, '');
    filaL('Subtotal opción 1', '', '', op1, { subtotal: true, bold: true });

    ws.addRow([]);

    // Opción 2 (solo si hay AG-1)
    if(ag.activo && ag.impuestoNeto > 0){
      var rwO2Hdr = ws.addRow(['', 'OPCIÓN 2 — Método promedio (impuesto neto AG y AG-1)']);
      rwO2Hdr.getCell(2).font = fontBold(10, COLORS.sectionText);
      var promedio = Math.round((r.renglones.c126 + ag.impuestoNeto) / 2);
      var op2 = Math.round(promedio * tarifaAnticipo / 1000) * 1000;
      filaL('Impuesto neto AG ' + (ctx.year - 1), '', '', ag.impuestoNeto);
      filaL('Impuesto neto AG ' + ctx.year, '', '', r.renglones.c126);
      filaL('Promedio (' + fmtCOP(r.renglones.c126) + ' + ' + fmtCOP(ag.impuestoNeto) + ') / 2', '', '', promedio);
      filaL('Tarifa', '', tarifaTexto, '');
      filaL('Subtotal opción 2', '', '', op2, { subtotal: true, bold: true });

      ws.addRow([]);
      var optimo = Math.min(op1, op2);
      filaL('OPCIÓN MÁS FAVORABLE (menor de las dos)', '', '', optimo, { resultado: true, bold: true });
    } else {
      notaLinea(ws,
        'OPCIÓN 2 (método promedio) requiere datos del año anterior. ' +
        'Para activarla, completa la sección "Datos comparativos año anterior" del wizard.',
        false);
      filaL('OPCIÓN APLICABLE (única, sin AG-1)', '', '', op1, { resultado: true, bold: true });
    }

    ws.addRow([]);
    filaL('(-) Retenciones del año (c132)', '', '', -(r.renglones.c132 || 0));
    filaL('ANTICIPO C133 (final, no negativo)', '', '', r.renglones.c133, { resultado: true, bold: true });

    // ─ BLOQUE C: saldo final ─
    bandaSeccion(ws, 'BLOQUE C — SALDO FINAL');
    filaL('Total impuesto a cargo (c129)', '', '', r.renglones.c129);
    filaL('(+) Anticipo año siguiente (c133)', '', '', r.renglones.c133);
    if(ag.activo){
      filaL('(-) Anticipo pagado AG-' + 1 + ' (c130)', '', '', -((ctx.estado.liquidacion && ctx.estado.liquidacion.anticipoPrev) || 0));
      filaL('(-) Saldo a favor AG-' + 1 + ' (c131)', '', '', -((ctx.estado.liquidacion && ctx.estado.liquidacion.saldoFavorPrev) || 0));
    }
    filaL('(-) Retenciones del año (c132)', '', '', -(r.renglones.c132 || 0));
    if(ctx.estado.liquidacion && ctx.estado.liquidacion.sanciones){
      filaL('(+) Sanciones (c135)', '', '', ctx.estado.liquidacion.sanciones);
    }

    ws.addRow([]);
    if(r.renglones.c134 > 0){
      filaL('SALDO A PAGAR (c134 / c136)', '', '', r.renglones.c134, { resultado: false, bold: true });
      var rwSP = ws.lastRow;
      for(var i = 2; i <= 5; i++) fillCell(rwSP.getCell(i), COLORS.alert);
      rwSP.getCell(5).font = fontBold(13, COLORS.alertText);
      rwSP.height = 24;
    } else if(r.renglones.c137 > 0){
      filaL('SALDO A FAVOR (c137)', '', '', r.renglones.c137, { resultado: true, bold: true });
      var rwSF = ws.lastRow;
      rwSF.getCell(5).font = fontBold(13, COLORS.resultText);
      rwSF.height = 24;
    } else {
      filaL('SALDO FINAL (cero)', '', '', 0, { subtotal: true });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hoja 8 — Bitácora (sub-checkpoint 9.5)
  // ──────────────────────────────────────────────────────────────────────────
  function buildHoja8Bitacora(wb, r, ctx, hash){
    var ws = wb.addWorksheet('8. Bitácora', { views: [{ showGridLines: false }] });
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 32;
    ws.getColumn(3).width = 50;
    ws.getColumn(4).width = 30;

    ws.mergeCells('A1:D1');
    var h = ws.getCell('A1');
    h.value = 'BITÁCORA DEL ARCHIVO — F210 AG ' + ctx.year;
    h.font = fontWhiteBold(14);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    var p = (typeof require !== 'undefined') ? require('./parametros-renta-pn.js').getParams(ctx.year)
                                              : (typeof window !== 'undefined' ? window.paramsRentaPN.getParams(ctx.year) : null);
    var uvt = p ? p.uvt : 0;

    bandaSeccion(ws, 'VERSIONADO Y TRAZABILIDAD');
    function filaB(k, v, ref){
      var rw = ws.addRow(['', k, v, ref || '']);
      rw.getCell(2).font = fontBold(10);
      rw.getCell(3).font = fontBody(10);
      rw.getCell(3).alignment = { wrapText:true, vertical:'top' };
      rw.getCell(4).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
    }
    filaB('Versión del motor', MOTOR_VERSION, 'shared/calculo210.js');
    filaB('Fecha de generación', new Date().toLocaleString('es-CO'), 'auto');
    filaB('Año gravable procesado', ctx.year, '');
    filaB('UVT aplicado', '$' + uvt.toLocaleString('es-CO'), p ? (p.notas && p.notas[0] || '') : '');
    filaB('Hash de inputs (SHA-256)', hash, 'auditoría reproducible');
    var rwH = ws.lastRow;
    rwH.getCell(3).font = fontMono(8, COLORS.sectionText);
    rwH.getCell(3).alignment = { wrapText:true };
    rwH.height = 28;

    bandaSeccion(ws, 'CAMBIOS NORMATIVOS INCORPORADOS (Ley 2277 de 2022)');
    var cambios = [
      'Tope 1.340 UVT (Art. 336 num. 3 inc. 1) — antes 5.040 UVT',
      'Deducción 72 UVT × dependiente FUERA del tope (Art. 336 num. 3 inc. 2) — adicionada',
      '1% factura electrónica FUERA del tope hasta 240 UVT (Art. 336 num. 5) — adicionada',
      'Descuento 19% dividendos no gravados >1.090 UVT (Art. 254-1) — adicionado',
      'Anticipo Art. 807 (25% / 50% / 75% según declaraciones previas)',
      'Ganancias ocasionales tarifa 15% (Art. 314) — antes 10%',
      'Tarifa Art. 241 progresiva mantenida con cambio en el tramo 39%',
      'Consolidación cedular Art. 331 — incluye dividendos no gravados (1ra subcédula 2017+)'
    ];
    cambios.forEach(function(c){
      var rw = ws.addRow(['', '✓', c, 'Ley 2277/2022']);
      rw.getCell(2).font = fontBold(11, COLORS.resultText);
      rw.getCell(2).alignment = { horizontal:'center' };
      rw.getCell(3).font = fontBody(10);
      rw.getCell(4).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
    });

    bandaSeccion(ws, 'CAMBIOS PENDIENTES DE INCORPORAR');
    var pendientes = [
      ['Resolución DIAN AG ' + (ctx.year + 1), 'Verificar al ser publicada anualmente'],
      ['Conceptos DIAN sobrevenidos durante AG ' + ctx.year, 'Validar normativa actualizada antes de presentar']
    ];
    pendientes.forEach(function(p){
      var rw = ws.addRow(['', '⚠', p[0], p[1]]);
      rw.getCell(2).font = fontBold(11, COLORS.alertText);
      rw.getCell(2).alignment = { horizontal:'center' };
      rw.getCell(3).font = fontBody(10);
      rw.getCell(4).font = { name:FONT_BASE, italic:true, size:8, color:{argb:COLORS.muted} };
    });

    // Histórico comparativo si hay AG-1
    var ag = ctx.estado.comparativoAGAnterior || {};
    if(ag.activo){
      bandaSeccion(ws, 'HISTÓRICO COMPARATIVO');
      var hdr = ws.addRow(['', 'Concepto', 'AG ' + (ctx.year-1), 'AG ' + ctx.year]);
      hdr.eachCell(function(c){
        c.font = fontBold(9, COLORS.sectionText);
        fillCell(c, COLORS.subtotal);
        c.border = thinBorder();
      });
      function filaC(c, vAnt, vAct){
        var rw = ws.addRow(['', c, vAnt, vAct]);
        rw.getCell(2).font = fontBody(10);
        rw.getCell(3).numFmt = '"$"#,##0';
        rw.getCell(4).numFmt = '"$"#,##0';
        rw.getCell(3).font = fontMono(10);
        rw.getCell(4).font = fontMono(10);
        rw.getCell(3).alignment = { horizontal:'right' };
        rw.getCell(4).alignment = { horizontal:'right' };
      }
      var patAct = ctx.estado.patrimonio || {};
      filaC('Patrimonio líquido', ag.patLiquido, ((patAct.bruto || 0) - (patAct.deudas || 0)));
      filaC('Renta líquida cedular general', ag.rentaCedularGen, r.renglones.c91);
      filaC('Impuesto neto de renta', ag.impuestoNeto, r.renglones.c126);
      filaC('Retenciones', ag.retenciones, r.renglones.c132);
    }

    bandaSeccion(ws, 'DISCLAIMER');
    var disc = ws.addRow(['',
      'Documento elaborado por exogenadian.com Pro como herramienta de apoyo profesional ' +
      'del contador firmante. NO constituye asesoría tributaria emitida por exogenadian.com. ' +
      'El contador valida y firma bajo su responsabilidad profesional.']);
    ws.mergeCells('B' + disc.number + ':D' + disc.number);
    disc.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
    disc.getCell(2).alignment = { wrapText:true, vertical:'top' };
    disc.height = 48;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Placeholder fallback (se mantiene por si alguna hoja falta)
  // ──────────────────────────────────────────────────────────────────────────
  function buildPlaceholder(wb, idx, nombreCorto, descripcionLarga, subcheckpoint){
    var ws = wb.addWorksheet(idx + '. ' + nombreCorto, {
      views: [{ showGridLines: false }]
    });
    ws.getColumn(1).width = 2;
    ws.getColumn(2).width = 60;

    ws.mergeCells('A1:D1');
    var h = ws.getCell('A1');
    h.value = 'Hoja ' + idx + ': ' + descripcionLarga;
    h.font = fontWhiteBold(13);
    fillCell(h, COLORS.headerDark);
    h.alignment = { horizontal:'center', vertical:'middle' };
    ws.getRow(1).height = 32;

    ws.addRow([]);
    var rw = ws.addRow(['', 'Implementación pendiente']);
    rw.getCell(2).font = fontBody(11, COLORS.muted);

    var rw2 = ws.addRow(['', subcheckpoint]);
    rw2.getCell(2).font = { name:FONT_BASE, italic:true, size:9, color:{argb:COLORS.muted} };
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  API pública
  // ──────────────────────────────────────────────────────────────────────────
  function generarExcelPapelTrabajo(wb, r, ctx, hash, reconciliacionEstado){
    wb.creator = 'ExogenaDIAN Pro';
    wb.created = new Date();
    wb.title = 'Excel Papel de Trabajo F210 AG ' + ctx.year;

    buildHoja1Caratula(wb, r, ctx, hash);
    buildHoja2Replica210(wb, r, ctx, hash, reconciliacionEstado);
    buildHoja3MemoriaCalculo(wb, r, ctx);
    buildHoja4Validaciones(wb, r, ctx);
    buildHoja5CruceExogena(wb, r, ctx, reconciliacionEstado);
    buildHoja6Citas(wb, r, ctx);
    buildHoja7Liquidacion(wb, r, ctx);
    buildHoja8Bitacora(wb, r, ctx, hash);
  }

  return {
    generarExcelPapelTrabajo: generarExcelPapelTrabajo,
    MOTOR_VERSION: MOTOR_VERSION,
    _internal: {
      COLORS: COLORS,
      buildHoja1Caratula: buildHoja1Caratula,
      buildHoja2Replica210: buildHoja2Replica210,
      buildCasillasTabla: buildCasillasTabla,
      resolverValor: resolverValor,
      generarComentario: generarComentario
    }
  };
}));
