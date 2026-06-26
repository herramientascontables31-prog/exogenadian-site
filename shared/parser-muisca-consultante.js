/**
 * Aziendale — Parser reporte MUISCA del consultante (PN)
 *
 * Se aplica al XLSX que la DIAN genera cuando uno entra a Usuario Registrado →
 * Consulta de Información Reportada. Estructura fija:
 *
 *   Col A: NIT informante     Col E: Detalle del concepto
 *   Col B: Nombre informante  Col F: Valor (pesos)
 *   Col C: NIT consultado     Col G: "Uso declaración Sugerida" ← KEY
 *   Col D: Nombre consultado  Col H: Información adicional
 *
 * Header en fila 14. Filas 15-19 son TOPES (suman datos). Datos a partir
 * de fila 20.
 *
 * La columna G de la DIAN ya sugiere el renglón del 210 (R32, R74, R29, etc).
 * Aprovechamos esa sugerencia oficial para mapear automáticamente.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){ module.exports = factory(); }
  else { global.parserMuiscaConsultante = factory(); }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  // Renglones del 210 → casilla interna del motor calcular210.
  // Fuente: columna G "Uso declaración Sugerida" del propio reporte MUISCA.
  // El R-código = número de CASILLA del Formulario 210 (Ley 2277/2022, AG 2023+).
  // Verificado contra el instructivo oficial DIAN del F210 (casillas idénticas
  // AG 2024 y AG 2025). Ej.: casilla 58 = Ing. brutos capital; 43 = Ing. brutos
  // honorarios (rentas de trabajo sin relación laboral); 99 = Ing. brutos pensiones.
  var MAPEO_RENGLON = {
    'R28':  'feBaseCompras',           // Fila R28 = COMPRAS con FE (la casilla 28 lleva el 1%, ver abajo)
    'R29':  'patrimonioBruto',         // Casilla 29 — Total patrimonio bruto (Art. 261 ET)
    'R30':  'patrimonioDeudas',        // Casilla 30 — Deudas
    'R32':  'ingTrabajo',              // Casilla 32 — Ingresos brutos rentas de trabajo (Art. 103)
    'R33':  'incrngo',                 // Casilla 33 — INCRNGO rentas de trabajo
    'R35':  'informativo',             // Casilla 35 — Rentas exentas trabajo (AFC/FVP/AVC): no es ingreso
    'R36':  'rentasExentasTrabajo',    // Casilla 36 — Otras rentas exentas de trabajo
    'R37':  'deduccionesTrabajo',      // Casilla 37 — Total rentas exentas de trabajo (informativo)
    'R123': 'informativo',             // Casilla 123 — Donaciones (descuento tributario): no es ingreso
    'R43':  'ingHonorarios',           // Casilla 43 — Ingresos brutos rentas de trabajo SIN relación laboral (honorarios)
    'R58':  'ingCapital',              // Casilla 58 — Ingresos brutos rentas de capital
    'R74':  'ingNoLaboral',            // Casilla 74 — Ingresos brutos rentas no laborales
    'R99':  'ingPensiones',            // Casilla 99 — Ingresos brutos rentas de pensiones
    'R100': 'incrngo',                 // Casilla 100 — INCRNGO cédula de pensiones
    'R104': 'ingDividendos',           // Casilla 104 — Dividendos y participaciones 2016 y anteriores
    'R107': 'ingDividendos',           // Casilla 107 — Dividendos 2017+ 1a subcédula (no gravados)
    'R109': 'ingDividendos',           // Casilla 109 — Dividendos y participaciones del exterior
    'R112': 'gananciasOcasionales',    // Casilla 112 — Ingresos por ganancias ocasionales
    'R132': 'retencionesC132'          // Casilla 132 — Retenciones del año gravable
  };

  function getCellText(cell){
    if(!cell) return '';
    var v = cell.value;
    if(v == null) return '';
    if(typeof v === 'object'){
      if(v.richText) return v.richText.map(function(p){return p.text;}).join('');
      if(v.text) return v.text;
      if(v.result != null) return String(v.result);
      return '';
    }
    return String(v);
  }

  function getCellNum(cell){
    if(!cell) return 0;
    var v = cell.value;
    if(v == null) return 0;
    if(typeof v === 'number') return v;
    if(typeof v === 'object' && typeof v.result === 'number') return v.result;
    var s = String(v).replace(/[.,\s$]/g,'');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  // Detecta primer R### en la celda "Uso declaración Sugerida".
  // Acepta "R32 Ingresos...", "Tope 1. R32...", "Tope 1: ingresos brutos | R32 ...", etc.
  function extraerRenglon(textoUso){
    if(!textoUso) return null;
    // Priorizar Rs específicos (R28-R140). Tomar el primero hallado.
    var m = String(textoUso).match(/R(\d{2,3})/);
    return m ? 'R' + m[1] : null;
  }

  // Clasifica un activo patrimonial por su descripción, para desglosar el patrimonio (c29).
  function tipoBien(d){
    var t = String(d||'').toLowerCase();
    if(/veh[ií]culo|aval[uú]o veh|automotor|motociclet/.test(t)) return 'Vehículo';
    if(/inmueble|predio|bien ra[ií]z|casa|apartament|lote|finca|aval[uú]o catastral/.test(t)) return 'Bien raíz';
    if(/\bcdt\b/.test(t)) return 'CDT';
    if(/fondo|cartera colectiva|inversi[oó]n|acci[oó]n|aporte.*social|derecho social|t[ií]tulo/.test(t)) return 'Inversión / acciones';
    if(/cuenta.*(ahorro|corriente|bancaria)|saldo cuenta|dep[oó]sito/.test(t)) return 'Cuenta bancaria';
    if(/cuenta por cobrar|cuentas por cobrar|cxc|pr[eé]stamo.*favor/.test(t)) return 'Cuenta por cobrar';
    return 'Otro activo';
  }

  function esFormatoMUISCA(sheet){
    // El reporte MUISCA SIEMPRE tiene "Consulta de Información reportada por terceros" en C1 o D1.
    var c1 = getCellText(sheet.getRow(1).getCell(3));
    return /consulta de informaci.+reportada/i.test(c1);
  }

  function parse(workbook){
    var warnings = [];
    var resumen = {
      ingTrabajo: 0,
      incrngo: 0,
      rentasExentasTrabajo: 0,
      deduccionesTrabajo: 0,
      ingHonorarios: 0,
      ingCapital: 0,
      ingNoLaboral: 0,
      ingPensiones: 0,
      ingDividendos: 0,
      gananciasOcasionales: 0,
      patrimonioBruto: 0,
      bienes: [],            // desglose de activos patrimoniales (vehículos, inmuebles, cuentas…)
      patrimonioDeudas: 0,
      retencionesC132: 0,
      fe1Pct: 0,              // = 1% de las compras FE (lo que va en la casilla 28), NO el monto de compras
      feBaseCompras: 0,       // suma de facturas FE tras ajustes (fila R28 del reporte)
      feSusceptible: 0,       // "monto susceptible de beneficio" según la DIAN (base preferida para el 1%)
      ingPromedio6m: 0,       // insumo escala cesantías Art. 206-4 — NO es renta exenta
      saldoFavorAnterior: 0,  // "Total saldo a favor" del AG anterior → casilla 131
      cesantiasIngreso: 0,    // cesantías pagadas/consignadas dentro de ingTrabajo (insumo asesoría 206-4)
      ingDocSoporte: 0,       // ventas reportadas por compradores vía documento soporte (no factura) → ingreso a clasificar
      informativo: 0          // R35/R123 y similares: no van al 210, solo para cuadre
    };
    var metadata = { nit: null, nombre: null, anio: null, fechaCorte: null, registrosProcesados: 0 };
    var detalle = []; // todos los registros para debugging
    // Topes oficiales DIAN (filas 15-19): chequeo de obligación de declarar.
    // Tope 2 = patrimonio bruto DECLARADO el año anterior, no suma de activos reportados.
    var topes = null;
    var patrimonioAnioAnterior = 0;

    if(!workbook || !workbook.worksheets || !workbook.worksheets.length){
      warnings.push({ tipo:'error', mensaje:'Workbook vacío o inválido.' });
      return { metadata: metadata, resumen: resumen, detalle: detalle, warnings: warnings, topes: topes, patrimonioAnioAnterior: patrimonioAnioAnterior };
    }

    var sheet = workbook.worksheets[0];
    if(!esFormatoMUISCA(sheet)){
      warnings.push({
        tipo:'formato_no_reconocido',
        mensaje:'El archivo no parece ser el reporte MUISCA "Consulta de Información reportada por terceros". Verifica que descargaste el archivo correcto de muisca.dian.gov.co.'
      });
      return { metadata: metadata, resumen: resumen, detalle: detalle, warnings: warnings, topes: topes, patrimonioAnioAnterior: patrimonioAnioAnterior };
    }

    // Metadata (filas 2-8)
    metadata.fechaCorte = getCellText(sheet.getRow(3).getCell(3));
    metadata.anio       = getCellText(sheet.getRow(4).getCell(3));
    metadata.nit        = getCellText(sheet.getRow(7).getCell(3));
    metadata.nombre     = getCellText(sheet.getRow(8).getCell(3));

    // Topes (col E "Tope N - X", col F valor). Rango flexible por si la DIAN corre filas.
    var TOPE_KEYS = { 1:'ingresos', 2:'patrimonio', 3:'consumoTC', 4:'movimientos', 5:'compras' };
    for(var tr = 10; tr <= 30; tr++){
      var tRow = sheet.getRow(tr);
      var tm = getCellText(tRow.getCell(5)).match(/^\s*Tope\s*([1-5])\s*[-–]/i);
      if(!tm) continue;
      if(!topes) topes = { ingresos:0, patrimonio:0, consumoTC:0, movimientos:0, compras:0 };
      topes[TOPE_KEYS[parseInt(tm[1],10)]] = getCellNum(tRow.getCell(6));
    }

    // Procesar filas a partir de la 20 (las 15-19 son TOPES informativos, las saltamos).
    var rowCount = sheet.rowCount;
    for(var r = 20; r <= rowCount; r++){
      var row = sheet.getRow(r);
      var nitInformante = getCellText(row.getCell(1));
      var nombreInformante = getCellText(row.getCell(2));
      var detalleConcepto = getCellText(row.getCell(5));
      var valor = getCellNum(row.getCell(6));
      var usoSugerido = getCellText(row.getCell(7));
      var infoAdicional = getCellText(row.getCell(8));

      // Saltar filas vacías o de subtotal
      if(!nitInformante || !valor) continue;

      // "Total patrimonio bruto declarado en el año anterior": no es activo reportado
      // por un tercero — es la declaración previa del consultante (base del Tope 2).
      if(/patrimonio bruto declarado en el a/i.test(detalleConcepto)){
        patrimonioAnioAnterior = valor;
        continue;
      }

      // "Ingreso laboral promedio de los últimos 6 meses": viene marcado R36 pero es el
      // INSUMO de la escala de cesantías del Art. 206-4, no una renta exenta.
      if(/ingreso laboral promedio/i.test(detalleConcepto)){
        resumen.ingPromedio6m += valor;
        continue;
      }

      // "Total saldo a favor": saldo a favor del año anterior sin devolución → casilla 131.
      if(/total saldo a favor/i.test(detalleConcepto)){
        resumen.saldoFavorAnterior += valor;
        continue;
      }

      // "Monto susceptible de beneficio" FE: base que la DIAN ya filtró para el 1% (Art. 336 num. 5).
      if(/susceptible de beneficio/i.test(detalleConcepto)){
        resumen.feSusceptible += valor;
        continue;
      }

      // Documento soporte de adquisiciones a no obligados a facturar: el comprador reportó
      // la compra → para el consultante es un INGRESO que debe clasificar (honorarios/no laboral).
      if(/documentos? soporte de adquisiciones/i.test(detalleConcepto)){
        resumen.ingDocSoporte += valor;
        continue;
      }

      // Marcadores del RUT (responsabilidades) — informativos, sin valor tributario directo.
      if(/responsabilidad\s+\d+\s+RUT/i.test(detalleConcepto)){
        continue;
      }

      var renglon = extraerRenglon(usoSugerido);
      detalle.push({ row: r, nitInformante: nitInformante, nombreInformante: nombreInformante, detalle: detalleConcepto, valor: valor, renglon: renglon, usoSugerido: usoSugerido, infoAdicional: infoAdicional });

      if(!renglon){
        // Fallbacks por texto del uso sugerido — la DIAN no siempre incluye el R-código:
        // aportes obligatorios → INCRNGO (c33); activos con "Tope 2" (vehículos/avalúos) → c29.
        if(/ingresos no constitutivos/i.test(usoSugerido)){
          resumen.incrngo += valor;
          metadata.registrosProcesados++;
          continue;
        }
        if(/tope\s*2/i.test(usoSugerido)){
          resumen.patrimonioBruto += valor;
          resumen.bienes.push({ tipo: tipoBien(detalleConcepto), descripcion: detalleConcepto, valor: valor, informante: nombreInformante });
          metadata.registrosProcesados++;
          continue;
        }
        // Tope 3 (consumos TC) y Tope 4 (movimientos/inversiones): informativos para el
        // chequeo de obligación, no van a casillas — sin warning (ya se muestran en topes).
        if(/tope\s*[34]/i.test(usoSugerido) || /consumos? tc|consignaciones e inversiones/i.test(usoSugerido)){
          resumen.informativo += valor;
          metadata.registrosProcesados++;
          continue;
        }
        warnings.push({
          tipo: 'sin_renglon',
          mensaje: 'Fila ' + r + ': "' + (detalleConcepto||'').slice(0,60) + '" sin sugerencia DIAN. No se pre-llena. Revisa manualmente.'
        });
        continue;
      }

      var bucket = MAPEO_RENGLON[renglon];
      if(!bucket){
        warnings.push({
          tipo: 'renglon_desconocido',
          mensaje: 'Fila ' + r + ': renglón ' + renglon + ' no mapeado por la herramienta. Revisa "' + (detalleConcepto||'').slice(0,60) + '".'
        });
        continue;
      }

      resumen[bucket] = (resumen[bucket] || 0) + valor;
      if(bucket === 'ingTrabajo' && /cesant/i.test(detalleConcepto)) resumen.cesantiasIngreso += valor;
      if(bucket === 'patrimonioBruto') resumen.bienes.push({ tipo: tipoBien(detalleConcepto), descripcion: detalleConcepto, valor: valor, informante: nombreInformante });
      metadata.registrosProcesados++;
    }

    // Casilla 28 = 1% de las compras con FE (Art. 336 num. 5). Base preferida: el monto
    // "susceptible de beneficio" que la DIAN ya filtró; si no viene, las compras R28.
    resumen.fe1Pct = Math.round(0.01 * (resumen.feSusceptible || resumen.feBaseCompras));

    // Redondear a miles (regla administrativa DIAN). 'bienes' es un array → no se redondea.
    Object.keys(resumen).forEach(function(k){
      if(k === 'bienes') return;
      resumen[k] = Math.round(resumen[k] / 1000) * 1000;
    });

    return { metadata: metadata, resumen: resumen, detalle: detalle, warnings: warnings, topes: topes, patrimonioAnioAnterior: patrimonioAnioAnterior };
  }

  /**
   * Construye el `estado` esperado por motor.calcular210() a partir del resumen MUISCA.
   * El usuario puede ajustar manualmente luego.
   */
  function aEstado210(resumen){
    return {
      cedulaGeneral: {
        trabajo: {
          ingresosBrutos: resumen.ingTrabajo || 0,
          incrngo: resumen.incrngo || 0,
          cesantiasIntereses: 0,
          otrasRentasExentas: resumen.rentasExentasTrabajo || 0,
          deduccionesNominales: resumen.deduccionesTrabajo || 0
        },
        honorarios: {
          ingresosBrutos: resumen.ingHonorarios || 0,
          incrngo: 0,
          modo: 'rentasTrabajo'
        },
        capital: { ingresosBrutos: resumen.ingCapital || 0, incrngo: 0 },
        noLaboral: { ingresosBrutos: resumen.ingNoLaboral || 0, incrngo: 0 },
        facturaElectronica1Pct: resumen.fe1Pct || 0
      },
      cedulaPensiones: {
        ingresosBrutos: resumen.ingPensiones || 0,
        incrngo: 0
      },
      cedulaDividendos: {
        ingresosBrutosNoGravados: resumen.ingDividendos || 0
      },
      gananciasOcasionales: {
        ingresos: resumen.gananciasOcasionales || 0
      },
      patrimonio: {
        bruto: resumen.patrimonioBruto || 0,
        deudas: resumen.patrimonioDeudas || 0
      },
      retencionesC132: resumen.retencionesC132 || 0
    };
  }

  return { parse: parse, aEstado210: aEstado210, MAPEO_RENGLON: MAPEO_RENGLON };
}));
