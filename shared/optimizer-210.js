/**
 * ExogenaDIAN — Optimizador de beneficios F210 (Renta PN)
 *
 * Calcula cuánto puede BAJAR el impuesto un declarante aportando a un fondo de
 * pensión voluntaria / cuenta AFC, respetando los topes legales:
 *   - Tope específico AFC/AVC: min(30% del ingreso, 3.800 UVT)  (Arts. 126-1, 126-4 ET)
 *   - Tope global cédula general: 40% / 1.340 UVT  (Art. 336 num. 3 ET, Ley 2277/2022)
 *
 * Es 100% determinístico (NO usa IA): reusa el motor puro `cal210.calcular210`,
 * escanea la curva impuesto-vs-aporte y devuelve el "knee": el aporte MÁS PEQUEÑO
 * que ya captura casi todo el ahorro (no tiene sentido aportar de más).
 *
 * Pensado como herramienta de ASESORÍA del contador: "si su cliente aporta $X a
 * su fondo voluntario antes del cierre, ahorra $Y en renta".
 *
 * Motor: `window.cal210` (calculo210.js) · Parámetros: `window.paramsRentaPN`.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory(
      typeof require !== 'undefined' ? require('./calculo210.js') : null,
      typeof require !== 'undefined' ? require('./parametros-renta-pn.js') : null
    );
  } else {
    global.optimizador210 = factory(global.cal210, global.paramsRentaPN);
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(cal210Inj, paramsInj){
  'use strict';

  function getCal210(){ return cal210Inj || (typeof window !== 'undefined' ? window.cal210 : null); }
  function getParams(){ return paramsInj || (typeof window !== 'undefined' ? window.paramsRentaPN : null); }

  function clone(o){ return JSON.parse(JSON.stringify(o)); }

  // Recalcula el impuesto agregando `extraAfc` a las deducciones de la subcédula
  // de trabajo. El motor aplica el tope global del 40%/1.340 UVT por su cuenta.
  function impuestoCon(estado, year, extraAfc){
    var cal = getCal210();
    if(!cal) throw new Error('optimizador210: motor cal210 no disponible');
    var e = clone(estado || {});
    e.cedulaGeneral = e.cedulaGeneral || {};
    e.cedulaGeneral.trabajo = e.cedulaGeneral.trabajo || {};
    e.cedulaGeneral.trabajo.deduccionesNominales =
      (e.cedulaGeneral.trabajo.deduccionesNominales || 0) + Math.max(0, extraAfc || 0);
    var r = cal.calcular210(e, year).renglones;
    return { c126: r.c126, c129: r.c129, c134: r.c134, c137: r.c137 };
  }

  /**
   * Analiza el escenario y devuelve el aporte óptimo + curva de simulación.
   * @param estado  estado jerárquico esperado por cal210.calcular210
   * @param year    año fiscal (2024/2025/2026)
   * @param opts    { steps: nº de puntos de la curva (default 40) }
   */
  function analizar(estado, year, opts){
    opts = opts || {};
    var P = getParams();
    if(!P) throw new Error('optimizador210: paramsRentaPN no disponible');
    var par = P.getParams(year), uvt = par.uvt;
    var cg = (estado && estado.cedulaGeneral) || {};
    var ingreso = ((cg.trabajo && cg.trabajo.ingresosBrutos) || 0)
                + ((cg.honorarios && cg.honorarios.ingresosBrutos) || 0)
                + ((cg.capital && cg.capital.ingresosBrutos) || 0)
                + ((cg.noLaboral && cg.noLaboral.ingresosBrutos) || 0);

    // Tope específico AFC/AVC adicional (Arts. 126-1/126-4): min(30% ingreso, 3.800 UVT).
    // Tomado de los parámetros del año, no hardcodeado.
    var afcPct = par.avcAfcMaxPct || 0.30;
    var afcUvt = par.avcAfcMaxUvt || 3800;
    var afcMax = Math.max(0, Math.min(afcPct * ingreso, afcUvt * uvt));

    var actual = impuestoCon(estado, year, 0);

    // Escaneo de la curva impuesto vs aporte
    var steps = opts.steps || 40, curva = [], minImp = actual.c129;
    var stepSize = afcMax / steps;
    for(var i = 0; i <= steps; i++){
      var ap = Math.round(stepSize * i);
      var imp = impuestoCon(estado, year, ap);
      curva.push({
        aporte: ap, impuesto: imp.c129,
        saldoPagar: imp.c134, saldoFavor: imp.c137,
        ahorro: Math.max(0, actual.c129 - imp.c129)
      });
      if(imp.c129 < minImp) minImp = imp.c129;
    }

    // "Knee": el aporte más pequeño que ya queda a <= $1.000 del mínimo impuesto.
    var optAporte = 0;
    for(var j = 0; j < curva.length; j++){
      if(curva[j].impuesto <= minImp + 1000){ optAporte = curva[j].aporte; break; }
    }
    var opt = impuestoCon(estado, year, optAporte);
    var ahorro = Math.max(0, actual.c129 - opt.c129);

    return {
      ingreso: Math.round(ingreso),
      afcMax: Math.round(afcMax),
      actual: actual,
      optimo: { aporte: optAporte, impuesto: opt.c129, saldoPagar: opt.c134, saldoFavor: opt.c137 },
      ahorro: ahorro,
      curva: curva,
      yaOptimo: ahorro < 1000 || actual.c129 === 0,
      sinImpuesto: actual.c129 === 0
    };
  }

  return { analizar: analizar, impuestoCon: impuestoCon };
}));
