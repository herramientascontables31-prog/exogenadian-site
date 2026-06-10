/**
 * ExogenaDIAN — Catálogo de certificados para verificar vs reporte exógena (Renta PN)
 *
 * El reporte exógena DIAN es PUNTO DE PARTIDA, no verdad — la propia DIAN
 * advierte que puede actualizarse. Este módulo genera, después de cargar el
 * reporte, un checklist contextual con:
 *
 *   1) Por cada registro reportado: el certificado original que lo respalda
 *      (Form 220 para salarios, certificado del banco para intereses, etc.)
 *      con cita normativa.
 *
 *   2) "Faltantes sistemáticos" — conceptos que casi NUNCA están completos
 *      en el reporte y que el contador debe pedir aparte (cesantías retiradas,
 *      intereses vivienda, salud prepagada, dependientes, ganancias ocasionales,
 *      bienes en el exterior).
 *
 * NO copia redacciones de Actualícese / GlobalContable / Gerencie. Solo cita
 * artículos del ET y resoluciones DIAN como base.
 *
 * API:
 *   certificadosRentaPN.getCertificadoParaConcepto(codigo)
 *   certificadosRentaPN.getCertificadoParaCedula(cedula)
 *   certificadosRentaPN.FALTANTES_SISTEMICOS
 *   certificadosRentaPN.analizarReconciliacion(filas) → { porRegistro, faltantesSistemicos }
 */
(function(){
  'use strict';

  // ════════════════════════════════════════════════════════════════════
  //  Mapa concepto DIAN (formato F1001 sintético / "Uso Sugerido") →
  //  certificado original esperado. Las descripciones son redacciones
  //  propias citando ET — no copiadas de cartillas externas.
  // ════════════════════════════════════════════════════════════════════
  var CERTIFICADO_POR_CONCEPTO = {
    '5001': {
      cedula: 'trabajo',
      certificado: 'Certificado de ingresos y retenciones — Formulario 220',
      emisor: 'Empleador o pagador laboral',
      norma: 'Art. 379 ET · Resolución DIAN 000162/2022',
      verificar: 'Que el total de pagos del F220 cuadre con la suma reportada en exógena. Diferencias > 5% requieren aclaración del empleador.',
      omisionesComunes: 'Bonos no salariales del año, comisiones del último mes, prima legal extralegal, indemnizaciones gravadas.'
    },
    '5002': {
      cedula: 'honorarios',
      certificado: 'Certificación de honorarios pagados',
      emisor: 'Cada pagador (NIT informante)',
      norma: 'Art. 26 ET · Decreto 187/1975',
      verificar: 'Cruzar con las facturas electrónicas emitidas por el declarante en el portal DIAN. Confirmar la naturaleza honorarios vs servicios para definir modo trabajo (par. 5 Art. 206) o no laborales.',
      omisionesComunes: 'Honorarios pagados por personas naturales no obligadas a retener; pagos en efectivo sin factura electrónica.'
    },
    '5003': {
      cedula: 'honorarios',
      certificado: 'Certificación de servicios pagados',
      emisor: 'Cada pagador (NIT informante)',
      norma: 'Art. 26 ET',
      verificar: 'Cruzar con facturas electrónicas. Si el declarante vinculó 2 o más trabajadores por más de 90 días, NO aplica modo trabajo del Art. 206 par. 5.',
      omisionesComunes: 'Servicios pagados por personas naturales sin facturar.'
    },
    '5004': {
      cedula: 'capital',
      certificado: 'Contrato de arrendamiento + recibos de consignación',
      emisor: 'Arrendatario / fiducia inmobiliaria',
      norma: 'Art. 26 ET · Art. 338 ET',
      verificar: 'Que los recibos consignados coincidan con el total reportado. Verificar si el inmueble se arrienda directamente o por fiducia (cambia el flujo).',
      omisionesComunes: 'Cánones cobrados en efectivo sin recibo formal; arrendamientos de temporada (vacacional) en plataformas.'
    },
    '5005': {
      cedula: 'capital',
      certificado: 'Certificado financiero anual del banco',
      emisor: 'Entidad bancaria / fiducia / fondo',
      norma: 'Arts. 38, 39, 40, 41 ET (componente inflacionario)',
      verificar: 'Restar el componente inflacionario que NO constituye renta (Art. 38 ET). El banco lo discrimina en el certificado. GMF: 50% es deducible (Art. 115 ET).',
      omisionesComunes: 'Intereses de cuentas en USD u otras divisas; rendimientos de fondos de inversión colectiva.'
    },
    '5006': {
      cedula: 'capital',
      certificado: 'Certificación de regalías o pagos por propiedad intelectual',
      emisor: 'Pagador',
      norma: 'Art. 28 ET · Art. 338 ET',
      verificar: 'Que el contrato de licenciamiento o cesión esté vigente y los pagos coincidan con lo pactado.',
      omisionesComunes: 'Regalías de plataformas digitales internacionales (YouTube, Spotify, Amazon KDP) que pueden no aparecer en exógena.'
    },
    '5008': {
      cedula: 'incrngo',
      certificado: 'Certificado de aportes obligatorios a pensión',
      emisor: 'Fondo de pensiones (AFP) o Colpensiones',
      norma: 'Art. 55 ET (INCRNGO)',
      verificar: 'Que el 4% sobre IBC concuerde con el aporte deducido en el F220 si es asalariado. Confirmar tope IBC (25 SMLMV).',
      omisionesComunes: 'Aportes hechos directamente por independientes que no se reportan en F220.'
    },
    '5009': {
      cedula: 'incrngo',
      certificado: 'Certificado de aportes obligatorios a salud',
      emisor: 'EPS',
      norma: 'Art. 56 ET (INCRNGO)',
      verificar: 'El 4% sobre IBC. Para honorarios incluir Fondo de Solidaridad Pensional (FSP) si IBC > 4 SMLMV.',
      omisionesComunes: 'Aportes a EPS pagados como independiente sin retención en la fuente.'
    },
    '5010': {
      cedula: 'dividendos_no_grav',
      certificado: 'Certificación de dividendos y participaciones — utilidades NO gravadas',
      emisor: 'Sociedad pagadora',
      norma: 'Art. 49 num. 3 ET · Arts. 242, 254-1 ET (Ley 2277/2022)',
      verificar: 'Que la sociedad haya identificado correctamente la utilidad como no gravada (Art. 49). Verificar si supera 1.090 UVT para aplicar tarifa Art. 242 y descuento Art. 254-1 (19% sobre exceso).',
      omisionesComunes: 'Dividendos de sociedades del exterior no reportados en exógena nacional.'
    },
    '5011': {
      cedula: 'dividendos_grav',
      certificado: 'Certificación de dividendos — utilidades GRAVADAS',
      emisor: 'Sociedad pagadora',
      norma: 'Art. 49 par. 2 ET · Art. 242-1 ET',
      verificar: 'Tarifa especial Art. 242-1 (35% corporativo) y luego Art. 242 sobre el neto. La sociedad debe haber retenido en la fuente.',
      omisionesComunes: 'Dividendos en especie no valorados a precio de mercado.'
    },
    '5022': {
      cedula: 'pensiones',
      certificado: 'Certificado de pagos pensionales',
      emisor: 'Colpensiones / AFP / fondo de pensión',
      norma: 'Art. 206 num. 5 ET · Art. 337 ET',
      verificar: 'Identificar la parte exenta (1.000 UVT mensuales / 12.000 UVT anuales). Pensiones por invalidez de origen laboral son exentas en su totalidad.',
      omisionesComunes: 'Pensiones del exterior cobradas en COP que sí son gravables si el beneficiario es residente.'
    },
    '5044': {
      cedula: 'gananciasOcasionales',
      certificado: 'Escritura pública o contrato de venta + certificado de tradición',
      emisor: 'Notaría / declarante',
      norma: 'Arts. 300-303 ET · Art. 314 ET (15%)',
      verificar: 'Verificar tiempo de posesión del activo (>2 años → ganancia ocasional, ≤2 años → renta ordinaria). Para inmuebles, costo fiscal incluye mejoras y reajustes Art. 70 ET.',
      omisionesComunes: 'Ventas de criptoactivos; ventas entre particulares sin escritura.'
    }
  };

  // Mapa de respaldo: si el código no está en CERTIFICADO_POR_CONCEPTO,
  // al menos podemos sugerir algo basados en la cédula.
  var CERTIFICADO_POR_CEDULA = {
    'trabajo': {
      certificado: 'Form 220 (certificado de ingresos y retenciones)',
      emisor: 'Empleador',
      norma: 'Art. 379 ET'
    },
    'honorarios': {
      certificado: 'Facturas electrónicas emitidas + certificación de cada pagador',
      emisor: 'Pagadores y plataforma DIAN de FE',
      norma: 'Art. 26 ET · Art. 87 ET (costos)'
    },
    'capital': {
      certificado: 'Certificado financiero del banco / contrato de arrendamiento',
      emisor: 'Banco, fiducia o arrendatario',
      norma: 'Arts. 38-41, 338 ET'
    },
    'noLaboral': {
      certificado: 'Soporte específico del origen del ingreso',
      emisor: 'Variable según concepto',
      norma: 'Art. 340 ET'
    },
    'pensiones': {
      certificado: 'Certificado de pagos pensionales',
      emisor: 'AFP / Colpensiones',
      norma: 'Art. 206 num. 5 ET · Art. 337 ET'
    },
    'dividendos_no_grav': {
      certificado: 'Certificación de dividendos no gravados (Art. 49 num. 3)',
      emisor: 'Sociedad pagadora',
      norma: 'Art. 242 ET'
    },
    'dividendos_grav': {
      certificado: 'Certificación de dividendos gravados (Art. 49 par. 2)',
      emisor: 'Sociedad pagadora',
      norma: 'Art. 242-1 ET'
    },
    'gananciasOcasionales': {
      certificado: 'Escrituras / contratos / certificado del notario',
      emisor: 'Variable',
      norma: 'Arts. 300-314 ET'
    },
    'incrngo': {
      certificado: 'Certificado de aportes obligatorios SS / soporte del INCRNGO',
      emisor: 'AFP / EPS / pagador',
      norma: 'Arts. 35-57-1 ET'
    },
    'deduccion_salud_prepag': {
      certificado: 'Certificado anual de medicina prepagada o póliza de salud',
      emisor: 'Entidad de medicina prepagada',
      norma: 'Art. 387 lit. b ET (tope 192 UVT/año)'
    },
    'deduccion_vivienda': {
      certificado: 'Certificado anual de intereses pagados — extracto consolidado',
      emisor: 'Banco hipotecario',
      norma: 'Art. 119 ET (tope 1.200 UVT/año)'
    },
    'deduccion_avc': {
      certificado: 'Certificación del fondo de pensiones voluntarias (FVP) o cuenta AFC',
      emisor: 'AFP / fiducia',
      norma: 'Arts. 126-1, 126-4 ET (tope 30% / 3.800 UVT/año)'
    }
  };

  // ════════════════════════════════════════════════════════════════════
  //  Faltantes sistemáticos — conceptos que casi NUNCA están completos
  //  en el reporte exógena. Son los que generan más correcciones.
  // ════════════════════════════════════════════════════════════════════
  var FALTANTES_SISTEMICOS = [
    {
      id: 'cesantias_retiradas',
      titulo: 'Cesantías retiradas en el año',
      explicacion: 'El reporte exógena registra el saldo a 31-dic, pero los retiros del año no siempre se reflejan. El fondo emite un certificado anual independiente.',
      norma: 'Art. 206 num. 4 ET (rentas exentas)',
      pedirAlCliente: 'Certificado de cesantías del fondo (Porvenir, Protección, Colfondos, Fondo Nacional del Ahorro). Discriminar saldo + retiros del año + intereses.',
      cuandoAplica: 'Cualquier asalariado que pudo retirar cesantías para vivienda, educación o desempleo durante el año.',
      severidad: 'media'
    },
    {
      id: 'intereses_vivienda',
      titulo: 'Intereses de crédito de vivienda',
      explicacion: 'Los bancos hipotecarios emiten un certificado consolidado anual con los intereses pagados. El reporte exógena casi nunca lo desagrega correctamente.',
      norma: 'Art. 119 ET — deducción hasta 1.200 UVT/año',
      pedirAlCliente: 'Extracto anual del crédito hipotecario (lo emite el banco en febrero), con desglose intereses / capital / seguros.',
      cuandoAplica: 'Si el declarante tiene crédito hipotecario activo o leasing habitacional sobre vivienda propia.',
      severidad: 'alta'
    },
    {
      id: 'salud_prepagada',
      titulo: 'Pagos a medicina prepagada o pólizas de salud',
      explicacion: 'No siempre se reportan en exógena. La entidad emite certificado anual.',
      norma: 'Art. 387 lit. b ET — tope 192 UVT/año',
      pedirAlCliente: 'Certificado anual de la prepagada (Sura, Colsanitas, Medisanitas, Coomeva, etc.) o de la póliza de salud.',
      cuandoAplica: 'Si el declarante o sus dependientes tienen plan de medicina prepagada o póliza de salud individual.',
      severidad: 'media'
    },
    {
      id: 'aportes_voluntarios',
      titulo: 'Aportes voluntarios a fondos de pensión y AFC',
      explicacion: 'Aportes a Fondos Voluntarios de Pensión (FVP) y cuentas AFC para vivienda — pueden faltar o estar incompletos.',
      norma: 'Arts. 126-1, 126-4 ET — tope 30% del ingreso / 3.800 UVT/año',
      pedirAlCliente: 'Certificación del fondo de pensiones voluntarias o de la fiducia AFC con saldo, aportes del año y movimientos.',
      cuandoAplica: 'Si declara aportes voluntarios o ahorra en producto AFC con beneficio tributario.',
      severidad: 'alta'
    },
    {
      id: 'dependientes',
      titulo: 'Dependientes económicos',
      explicacion: 'Los dependientes NO se reportan en exógena. El contribuyente debe documentar parentesco y dependencia.',
      norma: 'Art. 387 num. 2 ET — 10% del ingreso laboral, máx 384 UVT · Art. 336 num. 3 inc. 2 ET — 72 UVT por dependiente, máx 4 (FUERA del tope)',
      pedirAlCliente: 'Registro civil de hijos < 18 años; certificado de estudios para hijos 18-23; certificación de discapacidad de Medicina Legal o MinSalud para dependientes con discapacidad; certificación de cónyuge / compañero(a) permanente con ingresos < 260 UVT/año.',
      cuandoAplica: 'Si tiene hijos, padres o cónyuge económicamente dependientes.',
      severidad: 'alta'
    },
    {
      id: 'ganancias_ocasionales',
      titulo: 'Ganancias ocasionales',
      explicacion: 'Ventas de activos fijos (inmuebles, vehículos, acciones) poseídos > 2 años, herencias, donaciones, premios — no siempre en exógena.',
      norma: 'Arts. 300-314 ET — tarifa 15% (loterías 20%)',
      pedirAlCliente: 'Escrituras o contratos de compraventa, sucesión liquidada, certificados de premio o lotería, valoración por avalúo si aplica.',
      cuandoAplica: 'Si vendió un activo fijo, recibió herencia, donación, premio o ganó lotería en el año.',
      severidad: 'alta'
    },
    {
      id: 'bienes_exterior',
      titulo: 'Bienes y rentas en el exterior',
      explicacion: 'No están en el reporte exógena nacional. Si superan los topes del Art. 607 ET, requieren declaración informativa Formato 160.',
      norma: 'Art. 261 ET (patrimonio bruto residentes) · Art. 607 ET (Formato 160)',
      pedirAlCliente: 'Estados de cuenta extranjeros, declaración de impuesto exterior, contratos de inversión, escrituras de bienes inmuebles fuera de Colombia.',
      cuandoAplica: 'Si tiene cuentas, inversiones, criptoactivos en exchanges extranjeros, propiedades fuera del país, o recibe rentas del exterior.',
      severidad: 'alta'
    },
    {
      id: 'criptoactivos',
      titulo: 'Criptoactivos y rentas digitales',
      explicacion: 'Las plataformas crypto (Binance, Bitso, Coinbase, etc.) generalmente no reportan a exógena. El contribuyente debe declarar saldo y operaciones.',
      norma: 'Art. 261 ET (patrimonio) · Art. 26 y 314 ET (rentas / GO)',
      pedirAlCliente: 'Reporte anual de la plataforma con saldo a 31-dic, depósitos, retiros y conversiones (compra/venta).',
      cuandoAplica: 'Si tuvo o tiene saldo en cualquier exchange o wallet de criptoactivos.',
      severidad: 'media'
    },
    {
      id: 'donaciones',
      titulo: 'Donaciones a entidades sin ánimo de lucro',
      explicacion: 'Pueden generar descuento tributario si la entidad pertenece al RTE y emite certificación.',
      norma: 'Art. 257 ET — descuento 25% del valor donado',
      pedirAlCliente: 'Certificación de donación de la entidad receptora (debe estar en Régimen Tributario Especial — RTE) con NIT y monto.',
      cuandoAplica: 'Si donó a fundaciones, ONGs, universidades, iglesias, etc., con certificación oficial.',
      severidad: 'baja'
    },
    {
      id: 'patrimonio_inmuebles',
      titulo: 'Avalúo de inmuebles a 31-dic',
      explicacion: 'El patrimonio bruto se valora al mayor entre costo fiscal, avalúo catastral o autoavalúo en IPU.',
      norma: 'Art. 277 ET',
      pedirAlCliente: 'Recibo de impuesto predial 2025 (con avalúo catastral) o autoavalúo presentado. Para vehículos: liquidación de impuesto.',
      cuandoAplica: 'Si tiene inmuebles o vehículos en el patrimonio.',
      severidad: 'media'
    }
  ];

  // ════════════════════════════════════════════════════════════════════
  //  API
  // ════════════════════════════════════════════════════════════════════

  function getCertificadoParaConcepto(codigo){
    if(!codigo) return null;
    var k = String(codigo).trim();
    return CERTIFICADO_POR_CONCEPTO[k] || null;
  }

  function getCertificadoParaCedula(cedula){
    if(!cedula) return null;
    return CERTIFICADO_POR_CEDULA[cedula] || null;
  }

  /**
   * Analiza la tabla de reconciliación y produce un checklist contextual.
   *
   * @param {Array} filas  reconciliacionEstado.filas
   * @returns {{
   *   porRegistro: Array<{id, concepto, informante, valor, certificado}>,
   *   cedulasPresentes: Array<string>,
   *   faltantesSistemicos: Array<{...}>
   * }}
   */
  function analizarReconciliacion(filas){
    if(!Array.isArray(filas)) filas = [];
    var porRegistro = [];
    var cedulasSet = {};

    filas.forEach(function(f){
      if(f.excluida) return;
      var info = getCertificadoParaConcepto(f.concepto)
              || getCertificadoParaCedula(f.cedulaFinal || f.cedulaSugerida);
      if(info){
        porRegistro.push({
          id: f.id,
          concepto: f.concepto,
          informante: f.informante,
          valor: f.valor,
          cedula: info.cedula || f.cedulaFinal || f.cedulaSugerida,
          certificado: info.certificado,
          emisor: info.emisor,
          norma: info.norma,
          verificar: info.verificar || null,
          omisionesComunes: info.omisionesComunes || null
        });
      }
      var ced = f.cedulaFinal || f.cedulaSugerida;
      if(ced) cedulasSet[ced] = true;
    });

    return {
      porRegistro: porRegistro,
      cedulasPresentes: Object.keys(cedulasSet),
      faltantesSistemicos: FALTANTES_SISTEMICOS
    };
  }

  // ════════════════════════════════════════════════════════════════════
  //  Export
  // ════════════════════════════════════════════════════════════════════
  window.certificadosRentaPN = {
    CERTIFICADO_POR_CONCEPTO: CERTIFICADO_POR_CONCEPTO,
    CERTIFICADO_POR_CEDULA: CERTIFICADO_POR_CEDULA,
    FALTANTES_SISTEMICOS: FALTANTES_SISTEMICOS,
    getCertificadoParaConcepto: getCertificadoParaConcepto,
    getCertificadoParaCedula: getCertificadoParaCedula,
    analizarReconciliacion: analizarReconciliacion
  };
})();
