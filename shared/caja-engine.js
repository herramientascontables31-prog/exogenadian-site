/* ═══════════════════════════════════════════════════════════════════════════
   Aziendale — caja-engine.js
   Motor de Flujo de Caja proyectado para pyme colombiana. Puro, sin DOM.
   UMD: en navegador queda en window.CajaEngine; en Node se importa con require().

   Convierte un presupuesto de ingresos/gastos en una tabla de caja fechada:
     1. Cédula de cobros  — ventas → recaudo real, según política de cartera
        (% contado/crédito, días de cobro) y retenciones que le PRACTICAN al
        cliente al pagarle (retefuente/reteICA/reteIVA ~2.5-11%).
     2. Cédula de pagos   — compras/costos → pago real a proveedores, según
        días de pago.
     3. Nómina            — salarios + PILA mensual + estacionalidad real
        (prima jun/dic, cesantías 14-feb, intereses cesantías 31-ene).
     4. Salidas tributarias — vencimientos DIAN/ICA calculados desde el NIT
        vía shared/obligaciones-dian-2026.js (mismo motor que usa Mi Oficina
        Contable). Es el diferenciador: nadie más calendariza esto.
     5. bucketize()       — agrupa todos los eventos fechados en semanas
        (rolling 13 semanas), quincenas o meses, con saldo acumulado.

   Dependencia opcional: window.ObligacionesDIAN (shared/obligaciones-dian-2026.js).
   Si no está cargado, salidasTributarias() devuelve [] silenciosamente (la
   página debe cargarlo antes que este script).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(typeof require === 'function' ? safeRequire() : null);
  else global.CajaEngine = factory(global.ObligacionesDIAN);
  function safeRequire() { try { return require('./obligaciones-dian-2026.js'); } catch (e) { return null; } }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function (ObligacionesDIANInjected) {
  'use strict';

  var MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  /* ═══ Utilidades de fecha (ISO string 'YYYY-MM-DD', sin líos de TZ) ═══ */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateISO(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
  function lastDayOfMonth(y, m) { return new Date(y, m, 0).getDate(); }
  function ymOf(iso) { return iso.slice(0, 7); }
  function addMonths(ym, n) {
    var y = +ym.slice(0, 4), m = +ym.slice(5, 7);
    var total = (y * 12 + (m - 1)) + n;
    return dateISO(Math.floor(total / 12), (total % 12) + 1, 1).slice(0, 7);
  }
  function addDays(iso, n) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return dateISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  function mondayOnOrBefore(iso) {
    var d = new Date(iso + 'T00:00:00');
    var dow = d.getDay(); // 0=domingo..6=sábado
    var back = dow === 0 ? 6 : dow - 1;
    return addDays(iso, -back);
  }
  function labelMes(m, y) { return MESES[m - 1] + ' ' + y; }
  function shortDate(iso) { var p = iso.split('-'); return p[2] + ' ' + MESES[+p[1] - 1]; }
  function maxISO(a, b) { return a > b ? a : b; }
  function minISO(a, b) { return a < b ? a : b; }
  function monthsBetween(fromISO, toISO) {
    var out = [], ym = ymOf(fromISO), stop = ymOf(toISO);
    while (ym <= stop) { out.push(ym); ym = addMonths(ym, 1); }
    return out;
  }

  /* ═══ 1. Cédula de cobros — ventas presupuestadas → recaudo real ═══
     ventasPorMes: [{mes:'YYYY-MM', valor:Number}]
     politica: {pctContado:0-100, diasCredito:Number, pctRetencionPromedio:0-100}
     El % de retención modela lo que el cliente TE retiene al pagarte (no lo
     que tú retienes a terceros — eso va en salidasTributarias). */
  function cedulaCobros(ventasPorMes, politica) {
    politica = politica || {};
    var pctContado = politica.pctContado != null ? politica.pctContado : 100;
    var diasCredito = politica.diasCredito || 0;
    var pctRet = politica.pctRetencionPromedio || 0;
    var out = [];
    (ventasPorMes || []).forEach(function (v) {
      if (!v.valor) return;
      var y = +v.mes.slice(0, 4), m = +v.mes.slice(5, 7);
      var diaMedio = Math.min(15, lastDayOfMonth(y, m));
      var fContado = dateISO(y, m, diaMedio);
      var contado = v.valor * (pctContado / 100);
      var credito = v.valor - contado;
      if (contado > 0) {
        var netoC = contado * (1 - pctRet / 100);
        out.push({ fecha: fContado, concepto: 'Cobro de contado — ventas ' + labelMes(m, y), monto: netoC, grupo: 'ingresos', bruto: contado, retenido: contado - netoC });
      }
      if (credito > 0) {
        var fCredito = addDays(fContado, diasCredito);
        var netoCr = credito * (1 - pctRet / 100);
        out.push({ fecha: fCredito, concepto: 'Cobro de cartera (' + diasCredito + 'd) — ventas ' + labelMes(m, y), monto: netoCr, grupo: 'ingresos', bruto: credito, retenido: credito - netoCr });
      }
    });
    return out;
  }

  /* ═══ 2. Cédula de pagos — compras/costos presupuestados → pago real ═══
     comprasPorMes: [{mes:'YYYY-MM', valor:Number}]  diasPago: Number */
  function cedulaPagos(comprasPorMes, diasPago) {
    diasPago = diasPago || 0;
    var out = [];
    (comprasPorMes || []).forEach(function (v) {
      if (!v.valor) return;
      var y = +v.mes.slice(0, 4), m = +v.mes.slice(5, 7);
      var diaMedio = Math.min(15, lastDayOfMonth(y, m));
      var fecha = addDays(dateISO(y, m, diaMedio), diasPago);
      out.push({ fecha: fecha, concepto: 'Pago a proveedores (' + diasPago + 'd) — ' + labelMes(m, y), monto: -v.valor, grupo: 'proveedores' });
    });
    return out;
  }

  /* ═══ 3. Gastos fijos recurrentes ═══
     items: [{concepto, valor, diaPago}]  mesesISO: array 'YYYY-MM' */
  function gastosFijos(items, mesesISO) {
    var out = [];
    (mesesISO || []).forEach(function (ym) {
      var y = +ym.slice(0, 4), m = +ym.slice(5, 7);
      (items || []).forEach(function (it) {
        if (!it.valor) return;
        var dia = Math.min(it.diaPago || 5, lastDayOfMonth(y, m));
        out.push({ fecha: dateISO(y, m, dia), concepto: it.concepto || 'Gasto fijo', monto: -it.valor, grupo: 'gastos-fijos' });
      });
    });
    return out;
  }

  /* ═══ 4. Nómina — estacionalidad real colombiana ═══
     cfg: {salarioBase:Number (suma salarios base, sin prestaciones), exonerado:bool}
     exonerado = Ley 1819/2016 art.65 (sociedades PJ declarantes de renta con
     <10 SMMLV promedio/trabajador quedan exentas de salud-empleador+SENA+ICBF).
     mesesISO: array 'YYYY-MM' dentro del horizonte. */
  var PILA_RATE_EXONERADO = 0.16522;   // pensión 12% + ARL 0.522% + caja 4%
  var PILA_RATE_NO_EXONERADO = 0.30022; // + salud 8.5% + SENA 2% + ICBF 3%
  function nominaEventos(cfg, mesesISO) {
    cfg = cfg || {};
    if (!cfg.salarioBase) return [];
    var pilaRate = cfg.exonerado !== false ? PILA_RATE_EXONERADO : PILA_RATE_NO_EXONERADO;
    var out = [];
    (mesesISO || []).forEach(function (ym) {
      var y = +ym.slice(0, 4), m = +ym.slice(5, 7);
      var diaPago = lastDayOfMonth(y, m);
      out.push({ fecha: dateISO(y, m, diaPago), concepto: 'Nómina — salarios', monto: -cfg.salarioBase, grupo: 'nomina' });
      var next = addMonths(ym, 1), ny = +next.slice(0, 4), nm = +next.slice(5, 7);
      var diaPila = Math.min(15, lastDayOfMonth(ny, nm));
      out.push({ fecha: dateISO(ny, nm, diaPila), concepto: 'Nómina — seguridad social y parafiscales (PILA)', monto: -(cfg.salarioBase * pilaRate), grupo: 'nomina' });
      if (m === 6) out.push({ fecha: dateISO(y, 6, 30), concepto: 'Nómina — prima de servicios (1er semestre)', monto: -(cfg.salarioBase * 0.5), grupo: 'nomina' });
      if (m === 12) out.push({ fecha: dateISO(y, 12, 20), concepto: 'Nómina — prima de servicios (2do semestre)', monto: -(cfg.salarioBase * 0.5), grupo: 'nomina' });
      if (m === 2) out.push({ fecha: dateISO(y, 2, 14), concepto: 'Nómina — cesantías (consignación al fondo)', monto: -(cfg.salarioBase * 1), grupo: 'nomina' });
      if (m === 1) out.push({ fecha: dateISO(y, 1, 31), concepto: 'Nómina — intereses a las cesantías', monto: -(cfg.salarioBase * 0.12), grupo: 'nomina' });
    });
    return out;
  }

  /* ═══ 5. Salidas tributarias — el diferenciador ═══
     Calendariza retefuente/IVA/renta/ICA vía el NIT, reusando el motor
     shared/obligaciones-dian-2026.js (fuente única con Mi Oficina Contable).

     empresa: {nit, tipo:'PJ'|'PN', granContribuyente:bool,
               ivaRegimen:'no'|'bimestral'|'cuatrimestral', icaMunicipio, rst:bool}
     montos:  {retefuenteMensual, ivaPeriodo, rentaAnual, icaBimestral, rstAnticipo} */
  function salidasTributarias(empresa, montos) {
    var ObligacionesDIAN = (typeof window !== 'undefined' && window.ObligacionesDIAN) || ObligacionesDIANInjected;
    if (!ObligacionesDIAN || !empresa || !empresa.nit) return [];
    montos = montos || {};
    var client = {
      nit: empresa.nit,
      tipo: empresa.tipo || 'PJ',
      granContribuyente: !!empresa.granContribuyente,
      regimen: empresa.ivaRegimen || 'no',
      icaMunicipio: empresa.icaMunicipio || 'none',
      icaDecl: true,
      icaRete: false,
      obligaciones: {
        exogena: false, f2516: false, patrimonio: false, activosExt: false, inc: false,
        renta: !empresa.rst && !!montos.rentaAnual,
        iva: !empresa.rst && empresa.ivaRegimen !== 'no' && !!montos.ivaPeriodo,
        retefte: !!montos.retefuenteMensual,
        rst: !!empresa.rst,
        ica: !!empresa.icaMunicipio && empresa.icaMunicipio !== 'none' && !!montos.icaBimestral
      }
    };
    var obls;
    try { obls = ObligacionesDIAN.buildObligations(client); } catch (e) { return []; }
    var out = [];
    function evt(o, monto, label) {
      if (!o.date || !monto) return;
      out.push({ fecha: ObligacionesDIAN.toISO(o.date), concepto: label, monto: -monto, grupo: 'impuestos' });
    }
    var rentaObls = obls.filter(function (o) { return o.group === 'renta'; });
    rentaObls.forEach(function (o) { evt(o, (montos.rentaAnual || 0) / (rentaObls.length || 1), 'Renta — ' + o.label); });
    obls.filter(function (o) { return o.group === 'iva'; }).forEach(function (o) { evt(o, montos.ivaPeriodo, 'IVA — ' + o.label); });
    obls.filter(function (o) { return o.group === 'ret'; }).forEach(function (o) { evt(o, montos.retefuenteMensual, 'Retención en la fuente — ' + o.label); });
    obls.filter(function (o) { return o.group === 'ica'; }).forEach(function (o) { evt(o, montos.icaBimestral, o.label); });
    obls.filter(function (o) { return o.group === 'rst'; }).forEach(function (o) {
      if (o.label === 'F260 Anual') evt(o, montos.rentaAnual, 'RST — Declaración anual F260');
      else evt(o, montos.rstAnticipo || montos.ivaPeriodo, 'RST — Anticipo ' + o.label);
    });
    return out;
  }

  /* ═══ 6. bucketize — agrupa eventos fechados en periodos con saldo acumulado ═══
     eventos: [{fecha,monto,concepto,grupo}]  (monto>0 ingreso, monto<0 egreso)
     opts: {desde, hasta (ISO), periodicidad:'semanal'|'quincenal'|'mensual', saldoInicial} */
  function buildBucketRanges(desde, hasta, periodicidad) {
    var out = [];
    if (periodicidad === 'semanal') {
      var d = mondayOnOrBefore(desde);
      while (d <= hasta) {
        var fin = addDays(d, 6);
        var finReal = minISO(fin, hasta);
        out.push({ inicio: maxISO(d, desde), fin: finReal, label: 'Sem. ' + shortDate(d) + '–' + shortDate(fin) });
        d = addDays(d, 7);
      }
    } else if (periodicidad === 'quincenal') {
      monthsBetween(desde, hasta).forEach(function (ym) {
        var y = +ym.slice(0, 4), m = +ym.slice(5, 7);
        var q1ini = dateISO(y, m, 1), q1fin = dateISO(y, m, 15);
        var q2ini = dateISO(y, m, 16), q2fin = dateISO(y, m, lastDayOfMonth(y, m));
        if (q1fin >= desde && q1ini <= hasta) out.push({ inicio: maxISO(q1ini, desde), fin: minISO(q1fin, hasta), label: labelMes(m, y) + ' (1-15)' });
        if (q2fin >= desde && q2ini <= hasta) out.push({ inicio: maxISO(q2ini, desde), fin: minISO(q2fin, hasta), label: labelMes(m, y) + ' (16-fin)' });
      });
    } else {
      monthsBetween(desde, hasta).forEach(function (ym) {
        var y = +ym.slice(0, 4), m = +ym.slice(5, 7);
        out.push({ inicio: maxISO(dateISO(y, m, 1), desde), fin: minISO(dateISO(y, m, lastDayOfMonth(y, m)), hasta), label: labelMes(m, y) });
      });
    }
    return out.filter(function (b) { return b.inicio <= b.fin; });
  }

  function bucketize(eventos, opts) {
    opts = opts || {};
    var desde = opts.desde, hasta = opts.hasta;
    var buckets = buildBucketRanges(desde, hasta, opts.periodicidad || 'mensual');
    var saldo = opts.saldoInicial || 0;
    return buckets.map(function (b) {
      var movs = (eventos || []).filter(function (e) { return e.fecha >= b.inicio && e.fecha <= b.fin; });
      var ingresos = movs.filter(function (m) { return m.monto > 0; }).reduce(function (s, m) { return s + m.monto; }, 0);
      var negSum = movs.filter(function (m) { return m.monto < 0; }).reduce(function (s, m) { return s + m.monto; }, 0);
      var egresos = negSum ? -negSum : 0;
      var saldoInicial = saldo;
      var neto = ingresos - egresos;
      saldo += neto;
      return { inicio: b.inicio, fin: b.fin, label: b.label, ingresos: ingresos, egresos: egresos, neto: neto, saldoInicial: saldoInicial, saldoFinal: saldo, movimientos: movs };
    });
  }

  /* Alertas didácticas: agrupa RACHAS consecutivas de saldo negativo en un
     solo aviso (no una caja por semana), con la causa principal de la
     racha y su punto más bajo. */
  function detectarAlertas(buckets) {
    buckets = buckets || [];
    var alertas = [], i = 0;
    while (i < buckets.length) {
      if (buckets[i].saldoFinal < 0) {
        var inicio = i, minB = buckets[i];
        while (i < buckets.length && buckets[i].saldoFinal < 0) {
          if (buckets[i].saldoFinal < minB.saldoFinal) minB = buckets[i];
          i++;
        }
        var fin = i - 1;
        var causa = buckets[inicio].movimientos.filter(function (m) { return m.monto < 0; })
          .sort(function (a, c) { return a.monto - c.monto; })[0];
        alertas.push({
          periodoInicio: buckets[inicio].label,
          periodoFin: buckets[fin].label,
          continuo: fin > inicio,
          saldoMinimo: minB.saldoFinal,
          periodoMinimo: minB.label,
          causaPrincipal: causa ? causa.concepto : null
        });
      } else { i++; }
    }
    return alertas;
  }

  return {
    cedulaCobros: cedulaCobros,
    cedulaPagos: cedulaPagos,
    gastosFijos: gastosFijos,
    nominaEventos: nominaEventos,
    salidasTributarias: salidasTributarias,
    bucketize: bucketize,
    detectarAlertas: detectarAlertas,
    monthsBetween: monthsBetween,
    // expuestos para tests
    _util: { dateISO: dateISO, addMonths: addMonths, addDays: addDays, lastDayOfMonth: lastDayOfMonth, labelMes: labelMes }
  };
}));
