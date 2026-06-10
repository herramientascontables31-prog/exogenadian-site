/**
 * ExogenaDIAN — Validaciones Formulario 210
 * Solo advertencias. NO bloquean avance del wizard.
 */
(function(){
  'use strict';

  var P;
  if(typeof require !== 'undefined'){
    try { P = require('./parametros-renta-pn.js'); } catch(e){}
  }
  function getP(){ return P || (typeof window !== 'undefined' ? window.paramsRentaPN : null); }

  /**
   * Conciliacion patrimonial:
   *   PatLiq fin = PatLiq ini + INCRNGO + GOneta + RentaLiquida - ImpCargo
   * Si patrimonio declarado > justificable, hay diferencia injustificada
   * (riesgo Art. 236 ET).
   */
  function conciliacionPatrimonial(estado, resultado){
    var patLiqAnt = (estado.patrimonio && estado.patrimonio.patrimonioLiqAnterior) || 0;
    var pat = resultado.patrimonio;
    var general = resultado.cedulaGeneral;
    var go = resultado.gananciasOcasionales;
    var liq = resultado.liquidacion;

    // INCRNGO total de todas las cedulas
    var incrngo =
      (general.subcedulas.trabajo.incrngo || 0) +
      (general.subcedulas.honorarios.incrngo || 0) +
      (general.subcedulas.capital.incrngo || 0) +
      (general.subcedulas.noLaboral.incrngo || 0) +
      ((estado.cedulaPensiones && estado.cedulaPensiones.incrngo) || 0) +
      ((estado.cedulaDividendos && estado.cedulaDividendos.incrngoAnteriores2016) || 0);

    var goNeta = go.c112 - go.c113;
    var rentaCapitalizada = general.c91;
    var impCargo = liq.c129;

    var justificable = patLiqAnt + incrngo + goNeta + rentaCapitalizada - impCargo;
    var declarado = pat.c31;
    var diferencia = declarado - justificable;

    return {
      patLiqAnterior: patLiqAnt,
      incrngoTotal: incrngo,
      goNeta: goNeta,
      rentaCapitalizada: rentaCapitalizada,
      impuestoCargo: impCargo,
      patrimonioJustificable: justificable,
      patrimonioDeclarado: declarado,
      diferencia: diferencia,
      tieneDiferenciaInjustificada: diferencia > 0
    };
  }

  function validar(estado, resultado, year){
    var p = getP().getParams(year);
    var advertencias = [];
    var errores = [];

    // 1) Tope Art. 336 superado
    if(resultado.cedulaGeneral.tope.excedeTope){
      var perdido = resultado.cedulaGeneral.tope.rawDentroTope - resultado.cedulaGeneral.c92;
      advertencias.push({
        codigo: 'TOPE_336_SUPERADO',
        norma: 'Art. 336 num. 3 ET',
        mensaje: 'Las exentas y deducciones imputables superan el tope de min(40%, 1.340 UVT). Se perdieron $' + Math.round(perdido).toLocaleString('es-CO') + ' de beneficio.',
        severidad: 'media'
      });
    }

    // 2) Patrimonio liquido negativo (bruto < deudas)
    if((estado.patrimonio && estado.patrimonio.bruto || 0) < (estado.patrimonio && estado.patrimonio.deudas || 0)){
      advertencias.push({
        codigo: 'PATRIMONIO_NEGATIVO',
        norma: 'Art. 261 ET',
        mensaje: 'Las deudas superan el patrimonio bruto. Verificar soportes (extractos, cartas de saldo).',
        severidad: 'alta'
      });
    }

    // 3) Conciliacion patrimonial
    var concil = conciliacionPatrimonial(estado, resultado);
    if(concil.tieneDiferenciaInjustificada && concil.diferencia > p.uvt * 50){
      advertencias.push({
        codigo: 'PATRIMONIO_INJUSTIFICADO',
        norma: 'Arts. 236, 239-1 ET',
        mensaje: 'Diferencia patrimonial injustificada de $' + Math.round(concil.diferencia).toLocaleString('es-CO') + '. La DIAN puede convertirla en renta liquida gravable. Documentar gastos personales no deducibles.',
        severidad: 'alta'
      });
    }

    // 4) Retenciones desproporcionadas (> 30% ingreso bruto total)
    var ingresoBrutoTotal =
      (resultado.cedulaGeneral.subcedulas.trabajo.ingresosBrutos || 0) +
      (resultado.cedulaGeneral.subcedulas.honorarios.ingresosBrutos || 0) +
      (resultado.cedulaGeneral.subcedulas.capital.ingresosBrutos || 0) +
      (resultado.cedulaGeneral.subcedulas.noLaboral.ingresosBrutos || 0) +
      (resultado.cedulaPensiones.ingresosBrutos || 0);
    var ret = resultado.liquidacion.c132;
    if(ingresoBrutoTotal > 0 && ret > ingresoBrutoTotal * 0.30){
      advertencias.push({
        codigo: 'RETENCIONES_ALTAS',
        norma: 'Verificar certificados',
        mensaje: 'Retenciones representan mas del 30% del ingreso bruto. Verificar certificados.',
        severidad: 'baja'
      });
    }

    // 5) Dependientes Art. 387: si declara mas de los permitidos por ingreso bruto
    if(estado.cedulaGeneral && estado.cedulaGeneral.trabajo){
      var dedNomTrabajo = estado.cedulaGeneral.trabajo.deduccionesNominales || 0;
      var ingTrabajo = estado.cedulaGeneral.trabajo.ingresosBrutos || 0;
      var topeDepArt387 = Math.min(
        ingTrabajo * p.dependientesArt387Pct,
        p.dependientesArt387MaxUvtAnual * p.uvt
      );
      if(dedNomTrabajo > topeDepArt387 * 1.1){ // tolerancia 10% por presencia de otras deducciones
        // Es solo informativa, otras deducciones pueden estar incluidas
      }
    }

    // 6) Aplico exenta 25% trabajo y supero 790 UVT
    var ex25 = resultado.cedulaGeneral.subcedulas.trabajo.exenta25;
    if(ex25 >= p.exentaTrabajo25MaxUvt * p.uvt * 0.99){
      advertencias.push({
        codigo: 'EXENTA_25_TOPE',
        norma: 'Art. 206 num. 10 ET',
        mensaje: 'La exenta del 25% alcanza el tope de 790 UVT. Si el ingreso es alto, verificar si supero ese tope efectivamente.',
        severidad: 'baja'
      });
    }

    // 7) Pensiones modo anual fallback (Art. 206 num. 5 dice tope MENSUAL por mesada)
    if(resultado.cedulaPensiones && resultado.cedulaPensiones.modoAnualFallback){
      var mesadaPromedio = (estado.cedulaPensiones && estado.cedulaPensiones.ingresosBrutos)
        ? (estado.cedulaPensiones.ingresosBrutos / 13) : 0; // estimado con 13 mesadas
      var topeMensual = p.pensionExentaUvtMes * p.uvt;
      if(mesadaPromedio > topeMensual * 0.7){
        advertencias.push({
          codigo: 'PENSION_TOPE_MENSUAL',
          norma: 'Art. 206 num. 5 ET',
          mensaje: 'La exencion de pensiones se aplico con tope ANUAL (12.000 UVT). La norma exige tope MENSUAL (1.000 UVT por mesada). Si hay prima o mesadas extraordinarias que superen $' +
                   Math.round(topeMensual).toLocaleString('es-CO') + '/mes, agrega el desglose mensual en el campo "mesadas" para calculo correcto.',
          severidad: 'media'
        });
      }
    }

    // 8) Cesantias declaradas con salario alto sin escala aplicada
    var cesantiasRecibidas = (estado.cedulaGeneral && estado.cedulaGeneral.trabajo && estado.cedulaGeneral.trabajo.cesantiasIntereses) || 0;
    var ingTrabAnual = (estado.cedulaGeneral && estado.cedulaGeneral.trabajo && estado.cedulaGeneral.trabajo.ingresosBrutos) || 0;
    if(cesantiasRecibidas > 0 && ingTrabAnual > 0){
      var salarioPromMes = ingTrabAnual / 13; // estimado salarial mensual
      var salarioPromUvt = salarioPromMes / p.uvt;
      if(salarioPromUvt > 350){
        advertencias.push({
          codigo: 'CESANTIAS_ESCALA_206_4',
          norma: 'Art. 206 num. 4 ET',
          mensaje: 'Salario promedio estimado ' + Math.round(salarioPromUvt) + ' UVT/mes (> 350 UVT). Las cesantias NO son 100% exentas: aplica escala decreciente (90%/80%/60%/40%/20%/0% segun rango salarial). ' +
                   'Verifica que el monto declarado como cesantias exentas refleje la escala correcta.',
          severidad: 'alta'
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  B.5 — 7 inconsistencias proactivas adicionales
    // ──────────────────────────────────────────────────────────────────────

    var trab = resultado.cedulaGeneral.subcedulas.trabajo;
    var hon  = resultado.cedulaGeneral.subcedulas.honorarios;
    var cap  = resultado.cedulaGeneral.subcedulas.capital;
    var nl   = resultado.cedulaGeneral.subcedulas.noLaboral;

    // B.5 #1 — INCRNGO trabajo bajo (<6% del ingreso bruto)
    if(trab.ingresosBrutos > 0 && trab.incrngo > 0 && (trab.incrngo / trab.ingresosBrutos) < 0.06){
      var esperado = Math.round(trab.ingresosBrutos * 0.08);
      advertencias.push({
        codigo: 'INCRNGO_BAJO',
        norma: 'Art. 55 ET',
        mensaje: 'Salarios $' + Math.round(trab.ingresosBrutos).toLocaleString('es-CO') + ' declarados pero INCRNGO $' +
                 Math.round(trab.incrngo).toLocaleString('es-CO') + '. Aportes obligatorios salud + pensión esperados ≈ 8% = $' +
                 esperado.toLocaleString('es-CO') + '. Verifica que el cliente tenga aportes obligatorios completos.',
        severidad: 'media'
      });
    }

    // B.5 #2 — Variación patrimonial sin justificación (con AG-1 activo)
    var ag = estado.comparativoAGAnterior || {};
    if(ag.activo && ag.patLiquido > 0){
      var patLiqAct = (estado.patrimonio.bruto || 0) - (estado.patrimonio.deudas || 0);
      var variacion = patLiqAct - ag.patLiquido;
      var rentaGravable = resultado.renglones.c97 || 0;
      var goNeta = (resultado.gananciasOcasionales && resultado.gananciasOcasionales.c115) || 0;
      var incrngoTotal = (trab.incrngo || 0) + (hon.incrngo || 0) + (cap.incrngo || 0) + (nl.incrngo || 0);
      var holgura = ag.patLiquido * 0.10; // 10% de margen
      var capacidadCapitalizar = rentaGravable + goNeta + incrngoTotal + holgura;
      if(variacion > capacidadCapitalizar){
        var faltante = variacion - capacidadCapitalizar;
        advertencias.push({
          codigo: 'PATRIMONIO_AG1_INJUSTIFICADO',
          norma: 'Art. 236-237 ET',
          mensaje: 'Patrimonio creció $' + Math.round(variacion).toLocaleString('es-CO') +
                   ' pero la renta gravable + GO + INCRNGO + 10% holgura suman $' +
                   Math.round(capacidadCapitalizar).toLocaleString('es-CO') +
                   '. Hay $' + Math.round(faltante).toLocaleString('es-CO') +
                   ' sin justificar. Revisa: ¿falta declarar algún ingreso? ¿Patrimonio incluye bienes que no son del declarante? ¿Falta registrar deudas?',
          severidad: 'alta'
        });
      }
    }

    // B.5 #3 — Dependientes Art. 387 sin Art. 336 num. 3 inc. 2 (oportunidad de planeación)
    var depArt387 = (estado.cedulaGeneral && estado.cedulaGeneral.dependientesArt387Numero) || 0;
    if(estado.cedulaGeneral){
      // Heurística: si hay deducciones nominales > 0 en trabajo Y no hay Art. 336 num. 3 inc. 2
      var depArt336 = (estado.cedulaGeneral.dependientesArt336Numero) || 0;
      var hayDepArt387 = (resultado.capsAplicados && resultado.capsAplicados.dedDep387 > 0);
      if(hayDepArt387 && depArt336 === 0){
        var ahorroPotencial = Math.min(4, 1) * 72 * p.uvt; // mínimo 1 dependiente
        advertencias.push({
          codigo: 'DEP_ART_336_INC2_NO_USADA',
          norma: 'Art. 336 num. 3 inc. 2 (Ley 2277/2022)',
          mensaje: 'Tienes dependientes declarados (Art. 387). La Ley 2277/2022 agregó una deducción adicional de 72 UVT por dependiente FUERA del tope (Art. 336 num. 3 inc. 2). Coexiste con la del Art. 387. Podrías estar dejando de aprovechar hasta $' +
                   Math.round(4 * 72 * p.uvt).toLocaleString('es-CO') + ' de deducción adicional (4 dep × 72 UVT máx).',
          severidad: 'media'
        });
      }
    }

    // B.5 #4 — Dividendos altos sin descuento Art. 254-1
    var c107 = (resultado.cedulaDividendos && resultado.cedulaDividendos.c107) || 0;
    var descArt254_1 = (resultado.liquidacion && resultado.liquidacion.descuentos && resultado.liquidacion.descuentos.art254_1) || 0;
    if(c107 > 1090 * p.uvt && descArt254_1 === 0){
      advertencias.push({
        codigo: 'DESCUENTO_254_1_NO_APLICADO',
        norma: 'Art. 254-1 ET (Ley 2277/2022)',
        mensaje: 'Dividendos no gravados de $' + Math.round(c107).toLocaleString('es-CO') +
                 ' exceden el tope de 1.090 UVT. Por Ley 2277/2022 aplica descuento del 19% sobre el excedente. ' +
                 'El motor lo aplica automáticamente — verifica c124/c296 del Excel papel de trabajo.',
        severidad: 'media'
      });
    }

    // B.5 #5 — Costos rentas no laborales > 50% sin FE confirmada
    if(nl.ingresosBrutos > 0 && nl.costos > 0){
      var pctCostos = nl.costos / nl.ingresosBrutos;
      if(pctCostos > 0.50){
        advertencias.push({
          codigo: 'COSTOS_NOLAB_SOBRE_50PCT',
          norma: 'Art. 87, 771-2 ET',
          mensaje: 'Costos en rentas no laborales son $' + Math.round(nl.costos).toLocaleString('es-CO') +
                   ' (' + Math.round(pctCostos * 100) + '% del ingreso). Por Art. 87 ET y 771-2 ET, costos sin factura electrónica pueden ser desconocidos por DIAN. Verifica que tengas soporte electrónico para estos gastos.',
          severidad: 'alta'
        });
      }
    }

    // U3 — Costos declarados (cualquier monto) requieren factura electronica
    var totalCostosDeclarados = (nl.costos || 0) + (hon.costos || 0) + (cap.costos || 0);
    if(totalCostosDeclarados > 0){
      advertencias.push({
        codigo: 'COSTOS_REQUIEREN_FE',
        norma: 'Arts. 87, 771-2 ET',
        mensaje: 'Costos declarados $' + Math.round(totalCostosDeclarados).toLocaleString('es-CO') +
                 '. Verifica que cada costo este soportado con factura electronica con NIT del cliente como adquirente. Sin FE la DIAN puede desconocer el costo y aplicar sancion por inexactitud.',
        severidad: 'baja'
      });
    }

    // B.5 #6 — Ganancias ocasionales sin retención reportada
    var go = resultado.gananciasOcasionales;
    if(go && go.c115 > 0){
      var retenciones = resultado.renglones.c132 || 0;
      // Heurística: si no hay retenciones del año Y hay GO, alerta
      if(retenciones === 0){
        advertencias.push({
          codigo: 'GO_SIN_RETENCION',
          norma: 'Art. 311-1, 314 ET',
          mensaje: 'Hay ganancias ocasionales gravables $' + Math.round(go.c115).toLocaleString('es-CO') +
                   ' pero no se reporta retención asociada. Verifica si la retención en la fuente al momento de la enajenación se hizo correctamente, o si aplica alguna exención del Art. 311.',
          severidad: 'media'
        });
      }
    }

    // B.5 #7 — Bienes en exterior sin Formato 160
    // Heurística: si patrimonio bruto > 0 y NO se marcó f160 = 'si', no podemos detectar
    // automáticamente exterior — la advertencia es preventiva si el contador no marcó.
    var f160 = (estado.declarante && estado.declarante.tieneBienesExterior) ||
               (estado.bienesExterior && estado.bienesExterior.tiene);
    if(f160 === false || f160 === 'no' || f160 === undefined){
      // Heurística adicional: si patrimonio bruto es alto (>5.000 UVT) sin marcar exterior, alerta preventiva
      var patBruto = (estado.patrimonio && estado.patrimonio.bruto) || 0;
      if(patBruto > 5000 * p.uvt){
        advertencias.push({
          codigo: 'F160_VERIFICAR',
          norma: 'Art. 607 ET',
          mensaje: 'Patrimonio bruto alto ($' + Math.round(patBruto).toLocaleString('es-CO') + '). ' +
                   'Verifica con el cliente si tiene activos en el exterior. Si supera los topes del Art. 607 ET, ' +
                   'debe presentar Formato 160 (Declaración de activos en el exterior).',
          severidad: 'baja'
        });
      }
    }

    // Score de riesgo
    var altas = advertencias.filter(function(a){ return a.severidad === 'alta'; }).length;
    var medias = advertencias.filter(function(a){ return a.severidad === 'media'; }).length;
    var score = altas > 0 ? 'alto' : medias > 1 ? 'medio' : 'bajo';

    return {
      errores: errores,
      advertencias: advertencias,
      conciliacionPatrimonial: concil,
      scoreRiesgo: score
    };
  }

  var api = {
    validar: validar,
    conciliacionPatrimonial: conciliacionPatrimonial
  };

  if(typeof module !== 'undefined' && module.exports){
    module.exports = api;
  } else {
    window.validaciones210 = api;
  }
})();
