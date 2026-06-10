/**
 * ExogenaDIAN — Asesor F210: tips de ahorro cuantificados + riesgo umbral IVA
 * + explicacion de casillas en lenguaje claro (para el PDF entregable al cliente).
 *
 * Portado de CalculaRenta (advisor.js) — herramienta hermana que comparte el
 * MISMO motor window.cal210. Los riesgos UGPP / patrimonial / consignaciones
 * NO viven aqui: ya existen en calcularRiesgos210 (formato210-pro.html).
 *
 * Puro, sin DOM. Usa window.cal210 y window.paramsRentaPN.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.advisor210 = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  function fmt(n){ return '$ ' + (Math.round(n) || 0).toLocaleString('es-CO'); }

  // ── Casillas del 210 explicadas en lenguaje claro (sin jerga) ─────────────
  // Pensadas para el PDF entregable que el contador le da a su cliente.
  var CASILLAS = {
    29:{t:'Patrimonio bruto',x:'El valor de todo lo que tienes a 31 de diciembre: casa, carro, ahorros, inversiones, CDTs. No paga impuesto por si solo.'},
    30:{t:'Deudas',x:'Lo que debes a 31 de diciembre: creditos, hipoteca, tarjetas. Se resta del patrimonio bruto.'},
    31:{t:'Patrimonio liquido',x:'Patrimonio bruto menos deudas. Es tu riqueza neta. La DIAN compara este valor año a año.'},
    91:{t:'Renta liquida cedula general',x:'La suma de tus ingresos netos de trabajo, honorarios, capital y no laborales, antes de aplicar beneficios.'},
    92:{t:'Rentas exentas y deducciones limitadas',x:'Tus beneficios (25% exento, dependientes, vivienda, salud, AFC). La ley los limita al 40% de tu renta o 1.340 UVT, lo que sea menor.'},
    97:{t:'Renta liquida gravable',x:'La base sobre la que se calcula el impuesto, despues de restar los beneficios.'},
    101:{t:'Renta liquida de pensiones',x:'La parte de tu pension que supera el tope exento (1.000 UVT por mesada). Casi siempre es $0.'},
    111:{t:'Renta liquida gravable total',x:'La base final a la que se aplica la tabla de tarifas del Art. 241.'},
    116:{t:'Impuesto sobre la renta',x:'El impuesto que resulta de aplicar la tabla oficial a tu renta gravable.'},
    126:{t:'Impuesto neto de renta',x:'El impuesto despues de restar descuentos tributarios.'},
    127:{t:'Impuesto de ganancias ocasionales',x:'Impuesto del 15% (o 20% en loterias) por ventas de bienes, herencias o premios.'},
    129:{t:'Total impuesto a cargo',x:'El total que te corresponde pagar este año, antes de restar lo que ya te retuvieron.'},
    132:{t:'Retenciones',x:'El impuesto que ya te descontaron durante el año. Se resta de lo que debes.'},
    133:{t:'Anticipo año siguiente',x:'Un adelanto del impuesto del proximo año que la DIAN te pide pagar ahora.'},
    134:{t:'Saldo a pagar',x:'Lo que te falta pagar despues de restar retenciones y anticipos.'},
    137:{t:'Saldo a favor',x:'Dinero que te devuelven porque te retuvieron mas de lo que debias.'}
  };

  // ── Actividades tipicas y si suelen estar GRAVADAS con IVA (servicios) ───
  // Aproximado: el contador confirma. Salud humana y educacion formal suelen
  // estar excluidas/exentas; los servicios profesionales suelen estar gravados.
  var PROFESIONES = [
    {v:'consultoria',  t:'Consultoria / asesoria',            iva:true},
    {v:'ingenieria',   t:'Ingenieria / arquitectura',         iva:true},
    {v:'diseno',       t:'Diseno / publicidad / marketing',   iva:true},
    {v:'software',     t:'Desarrollo de software / TI',       iva:true},
    {v:'juridico',     t:'Servicios juridicos / abogacia',    iva:true},
    {v:'contable',     t:'Contaduria / servicios contables',  iva:true},
    {v:'comercio',     t:'Comercio / venta de bienes',        iva:true},
    {v:'construccion', t:'Construccion / obra',               iva:true},
    {v:'salud',        t:'Salud humana (medico, odontologo)', iva:false},
    {v:'educacion',    t:'Educacion formal',                  iva:false},
    {v:'empleado',     t:'Solo empleado / asalariado',        iva:false},
    {v:'otro',         t:'Otra actividad gravada',            iva:true}
  ];

  function getParams(year){ return window.paramsRentaPN.getParams(year); }

  function marginal(result, year){
    try {
      var base = (result && result.renglones && result.renglones.c111) || 0;
      return (window.cal210 && window.cal210.tarifaMarginal(base, year)) || 0;
    } catch(e){ return 0; }
  }

  /**
   * tips(result, estado, year)
   * Oportunidades de ahorro cuantificadas con la tarifa marginal del cliente.
   * NO incluye AFC/pension voluntaria: de eso se encarga optimizador210.
   * Devuelve [{titulo, detalle, ahorro}] (ahorro 0 = recordatorio sin estimacion).
   */
  function tips(result, estado, year){
    var out = [];
    if(!result || !window.paramsRentaPN) return out;
    var uvt = getParams(year).uvt;
    var R = result.renglones || {};
    var cg = (estado && estado.cedulaGeneral) || {};
    var tasa = marginal(result, year);
    if(tasa <= 0) return out;

    var ingTrab = (cg.trabajo && cg.trabajo.ingresosBrutos) || 0;

    // Honorarios: comparar los dos tratamientos posibles (excluyentes entre si):
    //  - modo rentas de trabajo → 25% exento (par. 5 Art. 206: <2 trabajadores, SIN costos)
    //  - modo no laboral → costos reales deducibles
    var hon = cg.honorarios || {};
    if((hon.ingresosBrutos || 0) > 0 && window.cal210 && estado){
      try {
        var alt = JSON.parse(JSON.stringify(estado));
        alt.cedulaGeneral.honorarios.modo = (hon.modo === 'rentasTrabajo') ? 'rentasNoLaborales' : 'rentasTrabajo';
        var rAlt = window.cal210.calcular210(alt, year).renglones;
        var difModo = (R.c129 || 0) - (rAlt.c129 || 0);
        if(difModo > 100000){
          var haciaTrabajo = alt.cedulaGeneral.honorarios.modo === 'rentasTrabajo';
          out.push({
            titulo: 'Honorarios: conviene cambiar al modo ' + (haciaTrabajo ? 'rentas de trabajo (25% exento)' : 'no laboral (costos reales)'),
            detalle: haciaTrabajo
              ? 'Tratando los honorarios como rentas de trabajo el impuesto a cargo bajaria ' + fmt(difModo) + '. Requisitos del par. 5 Art. 206 ET: haber contratado menos de 2 trabajadores y RENUNCIAR a imputar costos (las opciones son excluyentes: 25% exento O costos).'
              : 'Imputando los costos reales (modo no laboral, en vez del 25% exento) el impuesto a cargo bajaria ' + fmt(difModo) + '. Requiere soportes de los costos; si superan el 60% de los ingresos aplica la casilla 140 y el soporte con factura electronica (Art. 336-1 ET).',
            ahorro: Math.round(difModo)
          });
        }
      } catch(e){}
    }

    // Art. 336-1 ET: tope indicativo de costos del 60% en servicios personales (c45/c43).
    var honCostos = hon.costos || 0;
    if((hon.ingresosBrutos || 0) > 0 && hon.modo !== 'rentasTrabajo' && honCostos > 0){
      var ratioCostos = honCostos / hon.ingresosBrutos;
      if(ratioCostos > 0.60){
        out.push({
          titulo: 'Costos superan el tope indicativo del 60% — casilla 140 obligatoria (Art. 336-1)',
          detalle: 'Los costos imputados (' + fmt(honCostos) + ') son el ' + Math.round(ratioCostos*100) + '% de los ingresos por servicios personales. Hay que MARCAR la casilla 140 y TODOS esos costos deben estar soportados con factura electronica, nomina electronica o documento equivalente electronico; de lo contrario la DIAN puede rechazarlos.',
          ahorro: 0
        });
      } else if(ratioCostos > 0.45){
        out.push({
          titulo: 'Costos bajo el tope indicativo del 60% (Art. 336-1)',
          detalle: 'Los costos imputados son el ' + Math.round(ratioCostos*100) + '% de los ingresos: por debajo del tope indicativo del 60%, NO se exige marcar la casilla 140 ni el soporte pleno con factura electronica. Conserva igualmente los soportes ordinarios de cada costo.',
          ahorro: 0
        });
      }
    }

    // Dependientes Art. 336 num. 3: 72 UVT por dependiente, maximo 4 (rentas de trabajo)
    var depNum = cg.dependientesArt336Numero || 0;
    if(depNum < 4 && ingTrab > 0){
      var valorDep = 72 * uvt * (4 - depNum);
      out.push({
        titulo: 'Dependientes sin registrar (Art. 336 num. 3)',
        detalle: 'Se pueden deducir 72 UVT (' + fmt(72*uvt) + ') por cada dependiente, hasta 4. Este borrador registra ' + depNum + '. Con mas personas a cargo (y su soporte), se podrian deducir hasta ' + fmt(valorDep) + ' adicionales. Ojo: un mismo dependiente solo da lugar a UNA deduccion (10% Art. 387 o 72 UVT), salvo que existan rentas de una relacion laboral, caso en que aplican ambas.',
        ahorro: Math.round(valorDep * tasa)
      });
    }

    // Factura electronica 1% (Art. 336 num. 5): deducible hasta 240 UVT
    var fe = cg.facturaElectronica1Pct || 0;
    if(!fe){
      var topeFE = 240 * uvt;
      out.push({
        titulo: 'Deduccion 1% por factura electronica (Art. 336 num. 5)',
        detalle: 'El 1% de las compras personales con factura electronica y pago electronico es deducible (hasta 240 UVT = ' + fmt(topeFE) + '). Vale la pena reunir los soportes de compras del año.',
        ahorro: Math.round(Math.min(topeFE, (R.c97 || 0) * 0.01) * tasa)
      });
    }

    // Recordatorio: prepagada e intereses de vivienda (si no registro deducciones nominales)
    var dedNom = ((cg.trabajo && cg.trabajo.deduccionesNominales) || 0)
               + ((cg.honorarios && cg.honorarios.deduccionesNominales) || 0);
    if(dedNom === 0){
      out.push({
        titulo: 'Medicina prepagada e intereses de vivienda',
        detalle: 'La medicina prepagada (hasta 16 UVT/mes) y los intereses de credito de vivienda (hasta 1.200 UVT = ' + fmt(1200*uvt) + ') son deducibles y no aparecen registrados en este borrador.',
        ahorro: 0
      });
    }
    return out;
  }

  /**
   * riesgoIVA(estado, year, actividad)
   * Umbral de responsable de IVA: 3.500 UVT en servicios gravados (Art. 437 par. 3 ET).
   * actividad = value de PROFESIONES ('' = no evaluar).
   * Devuelve {nivel, titulo, detalle} o null.
   */
  function riesgoIVA(estado, year, actividad){
    if(!actividad || !window.paramsRentaPN) return null;
    var prof = null;
    for(var i = 0; i < PROFESIONES.length; i++){ if(PROFESIONES[i].v === actividad){ prof = PROFESIONES[i]; break; } }
    if(!prof || !prof.iva) return null;
    var uvt = getParams(year).uvt;
    var cg = (estado && estado.cedulaGeneral) || {};
    var ingServ = ((cg.honorarios && cg.honorarios.ingresosBrutos) || 0)
                + ((cg.noLaboral && cg.noLaboral.ingresosBrutos) || 0);
    var umbral = 3500 * uvt;
    if(ingServ > umbral){
      return { nivel:'alto', titulo:'Podrias estar obligado a ser responsable de IVA',
        detalle:'Tu actividad (' + prof.t + ') esta gravada con IVA y tus ingresos por servicios (' + fmt(ingServ) + ') superan el umbral de 3.500 UVT (' + fmt(umbral) + ') del Art. 437 par. 3 ET. Es probable que debas inscribirte como responsable de IVA y declarar IVA, ademas de la renta. Verificalo segun la actividad economica.' };
    }
    if(ingServ > umbral * 0.85){
      return { nivel:'medio', titulo:'Estas cerca del umbral de responsable de IVA',
        detalle:'Tus ingresos por servicios gravados (' + fmt(ingServ) + ') se acercan al umbral de 3.500 UVT (' + fmt(umbral) + ', Art. 437 par. 3 ET). Si lo superas, tendrias que ser responsable de IVA. Vigilalo en la planeacion del proximo año.' };
    }
    return null;
  }

  return { tips: tips, riesgoIVA: riesgoIVA, CASILLAS: CASILLAS, PROFESIONES: PROFESIONES };
}));
