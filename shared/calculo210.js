/**
 * Aziendale — Motor de calculo Formulario 210 (Renta Personas Naturales)
 *
 * Diseno: motor PURO multi-ano. No accede al DOM. Recibe un `estado`
 * jerarquico y devuelve renglones del 210 + diagnostico del tope Art. 336
 * + liquidacion final.
 *
 * Norma:
 *   - ET (Estatuto Tributario), Ley 2277/2022, DUR 1625/2016 art. 1.2.1.20.4
 *   - El tope Art. 336 num. 3 se aplica a nivel CEDULA GENERAL CONSOLIDADA,
 *     no por subtipo. Las deducciones de Art. 336 num. 3 inc. 2 (72 UVT/dep,
 *     max 4) y num. 5 (1% factura electronica, max 240 UVT) van FUERA del tope.
 */
(function(){
  'use strict';

  var P; // paramsRentaPN — resuelto en runtime
  if(typeof require !== 'undefined'){
    try { P = require('./parametros-renta-pn.js'); } catch(e){ /* navegador */ }
  }
  function getP(){
    return P || (typeof window !== 'undefined' ? window.paramsRentaPN : null);
  }

  // ═══════════════════════════════════════
  //  Helpers
  // ═══════════════════════════════════════
  function maxZero(n){ return n > 0 ? n : 0; }
  function r1k(n){ return Math.round(n / 1000) * 1000; }

  function pesosAUvt(pesos, year){ return getP().pesosAUvt(pesos, year); }
  function uvtAPesos(uvt, year){ return getP().uvtAPesos(uvt, year); }
  function getParams(year){ return getP().getParams(year); }

  // ═══════════════════════════════════════
  //  Tarifas
  // ═══════════════════════════════════════

  /** Impuesto Art. 241 ET sobre base en pesos, segun tabla del ano. */
  function impuestoArt241(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    var rlUvt = pesosAUvt(basePesos, year);
    for(var i=0; i<p.tabla241.length; i++){
      var t = p.tabla241[i];
      if(rlUvt > t.desdeUvt && rlUvt <= t.hastaUvt){
        var impUvt = (rlUvt - t.desdeUvt) * t.tarifa + t.baseUvt;
        return r1k(impUvt * p.uvt);
      }
    }
    return 0;
  }

  /** OBSOLETO (no usar): tarifa fija 15% Art. 242 pre-reforma, derogada por la
   *  Ley 2277/2022. Hoy los dividendos integran la cedula general (Art. 241).
   *  Se conserva solo por compatibilidad historica. */
  function impuestoArt242(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    var baseUvt = pesosAUvt(basePesos, year);
    if(baseUvt <= p.divNoGravadosExentoUvt) return 0;
    var imp = (baseUvt - p.divNoGravadosExentoUvt) * p.divNoGravadosTarifaExceso;
    return r1k(imp * p.uvt);
  }

  /** OBSOLETO (no usar): liquidaba 35% + 15% fijo sobre el neto. Post Ley
   *  2277/2022 el gravado paga 35% (Art. 240) y el neto integra la general
   *  (Art. 241). La liquidacion ya no usa esta funcion. */
  function impuestoArt242_1(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    var imp1 = r1k(basePesos * p.divGravadosTarifaCorporativa);
    var neto = basePesos - imp1;
    var imp2 = impuestoArt242(neto, year);
    return imp1 + imp2;
  }

  /** Impuesto Art. 314 ET — ganancias ocasionales 15%. */
  function impuestoArt314(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    return r1k(basePesos * p.goTarifa);
  }

  /** Impuesto Art. 317 ET — loterias, rifas, apuestas 20%. */
  function impuestoArt317(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    return r1k(basePesos * p.goLoteriasTarifa);
  }

  /** Tarifa marginal del Art. 241 sobre la base en el ultimo peso. */
  function tarifaMarginal(basePesos, year){
    if(basePesos <= 0) return 0;
    var p = getParams(year);
    var rlUvt = pesosAUvt(basePesos, year);
    for(var i=0; i<p.tabla241.length; i++){
      var t = p.tabla241[i];
      if(rlUvt > t.desdeUvt && rlUvt <= t.hastaUvt) return t.tarifa;
    }
    return p.tabla241[p.tabla241.length-1].tarifa;
  }

  // ═══════════════════════════════════════
  //  Subcedulas (cedula general)
  // ═══════════════════════════════════════

  /**
   * Calculo generico de una subcedula.
   * Devuelve renta liquida antes de exentas/deducciones y total exentas+deducciones imputadas.
   *
   * input = {
   *   ingresosBrutos, incrngo, costos,
   *   exenta25Aplica,                          // bool — solo trabajo y honorarios par.5
   *   cesantiasIntereses,                       // solo trabajo
   *   otrasRentasExentas,                       // exentas distintas a la 25%
   *   deduccionesNominales,                     // intereses vivienda, salud prep., AVC+AFC, dep.387
   *   ingresosECE                               // ingresos por entidad controlada exterior
   * }
   */
  function calcularSubcedula(input, year, opts){
    opts = opts || {};
    var p = getParams(year);
    var ing = input.ingresosBrutos || 0;
    var incrngo = input.incrngo || 0;
    var costos = input.costos || 0;
    var ece = input.ingresosECE || 0;
    var ces = input.cesantiasIntereses || 0;          // solo trabajo: ingreso adicional
    var otrasExentas = input.otrasRentasExentas || 0;
    var dedNominales = input.deduccionesNominales || 0;

    // Cesantias e intereses (Art. 206 num. 4): exencion ESCALONADA segun el salario mensual
    // promedio de los ultimos 6 meses. Solo se activa si llega ese dato; si no, comportamiento
    // anterior intacto (las cesantias quedan dentro del ingreso y reciben el 25% generico).
    var cesExenta = 0, modoCesEscala = false, cesSalarioEstimado = false;
    if(ces > 0){
      var salProm = input.salarioPromedio6mUvt;
      // Si no se dio el salario promedio, estimarlo (ingreso laboral / 12) para aplicar la escala
      // Art. 206-4 ET, en vez de caer a un 25% generico (que SUB-exime salarios bajos y SOBRE-exime altos).
      if(salProm == null || isNaN(salProm)){
        salProm = ing > 0 ? (ing / 12) / p.uvt : 0;
        cesSalarioEstimado = true;
      }
      cesExenta = cesantiasExentasArt206_4(ces, salProm, year);
      modoCesEscala = true;
    }

    // Ingreso neto = bruto - INCRNGO - costos (capital y no laboral)
    // Para trabajo: bruto incluye salario + cesantias e intereses. INCRNGO incluye salud y pension.
    var rentaBrutaSubcedula = ing + ces - incrngo - costos;  // con signo (puede ser negativa)
    var ingresoNeto = maxZero(rentaBrutaSubcedula);

    // Renta exenta 25% Art. 206 num. 10 — solo trabajo y honorarios modo trabajo
    var exenta25 = 0;
    if(opts.aplicaExenta25){
      // Art. 206 num. 10 ET (paragrafo): el 25% se calcula DESPUES de detraer del pago laboral
      // los INCRNGO, las DEDUCCIONES y las DEMAS RENTAS EXENTAS. Base = ingresoNeto − deducciones − otras exentas.
      // Si las cesantias van por la escala del num. 4, NO entran en la base del 25% (su exencion es la escala).
      var base25 = maxZero(ingresoNeto - (modoCesEscala ? ces : 0) - dedNominales - otrasExentas);
      exenta25 = r1k(Math.min(
        base25 * p.exentaTrabajo25Pct,
        p.exentaTrabajo25MaxUvt * p.uvt
      ));
    }

    // Total exentas y deducciones imputables a esta subcedula (DENTRO del tope global)
    var exentasYDeducciones = exenta25 + otrasExentas + cesExenta + dedNominales;
    // Verificado contra AyudaRenta DIAN oficial (Formulario!L28/T28/AC28/AJ28, casillas 41/53/69/86):
    // cada subcedula limita lo imputable al MENOR entre lo solicitado, el cupo del tope global, Y
    // la renta liquida de ESA MISMA subcedula (Formulario!L20/T20/AC20/AJ20, casillas 34/46/etc) —
    // no se puede deducir mas de lo que esa subcedula gano. Sin este tope individual, una subcedula
    // con perdida (deducciones > ingreso) "presta" su exceso al pool consolidado y el tope global
    // absorbe deducciones que en realidad no redujeron ningun ingreso real: impuesto de menos.
    var exentasYDeduccionesTope = Math.min(exentasYDeducciones, ingresoNeto);

    // Renta liquida ordinaria de la subcedula (antes de aplicar tope global)
    var rentaLiquidaAntesExentas = maxZero(ingresoNeto + ece);
    // Base del limite del 40% (Art. 336 num. 3 ET): "se hara sobre el resultado de restar de los
    // ingresos brutos por todo concepto los ingresos no constitutivos de renta imputables". Es decir,
    // ingresos - INCRNGO SIN restar los costos/gastos procedentes. Por eso NO se usa la renta liquida
    // (ingresoNeto, que si resta costos): un declarante con costos de capital/no laboral/honorarios
    // tendria un tope del 40% sub-estimado -> se le rechazarian exentas de mas -> impuesto de mas.
    var base40 = maxZero(ing + ces - incrngo) + ece;
    var rentaSinTope = rentaLiquidaAntesExentas - exentasYDeducciones;
    // Perdida liquida de la subcedula (casillas 55/71/88 del 210): es la perdida REAL, cuando
    // los costos + INCRNGO superan los ingresos. NO la generan las exentas/deducciones (esas se
    // limitan en la casilla 92). La perdida se difiere (Art. 147 ET) y NO reduce la c91 en el
    // anio: cada subcedula se piso en 0 para la c91 (ver calcularCedulaGeneral).
    var perdida = rentaBrutaSubcedula < 0 ? -rentaBrutaSubcedula : 0;

    return {
      ingresosBrutos: ing,
      incrngo: incrngo,
      costos: costos,
      ingresoNeto: ingresoNeto,
      ingresosECE: ece,
      exenta25: exenta25,
      cesantiasExenta: cesExenta,
      otrasRentasExentas: otrasExentas,
      deduccionesNominales: dedNominales,
      exentasYDeducciones: exentasYDeducciones,
      exentasYDeduccionesTope: exentasYDeduccionesTope,
      rentaLiquidaAntesExentas: rentaLiquidaAntesExentas,
      base40: base40,
      rentaSubcedula: maxZero(rentaSinTope),
      perdida: perdida
    };
  }

  function calcularSubcedulaTrabajo(input, year){
    return calcularSubcedula({
      ingresosBrutos: input.ingresosBrutos,
      incrngo: input.incrngo,
      costos: 0,
      cesantiasIntereses: input.cesantiasIntereses,
      salarioPromedio6mUvt: input.salarioPromedio6mUvt,
      otrasRentasExentas: input.otrasRentasExentas,
      deduccionesNominales: input.deduccionesNominales,
      ingresosECE: 0
    }, year, { aplicaExenta25: true });
  }

  function calcularSubcedulaHonorarios(input, year){
    // Modo 'rentasTrabajo' (par. 5 Art. 206 ET): aplica exenta 25%, no permite costos
    // Modo 'rentasNoLaborales' (default): no aplica exenta 25%, permite costos
    var modoTrabajo = input.modo === 'rentasTrabajo';
    return calcularSubcedula({
      ingresosBrutos: input.ingresosBrutos,
      incrngo: input.incrngo,
      costos: modoTrabajo ? 0 : (input.costos || 0),
      cesantiasIntereses: 0,
      otrasRentasExentas: input.otrasRentasExentas,
      deduccionesNominales: input.deduccionesNominales,
      ingresosECE: 0
    }, year, { aplicaExenta25: modoTrabajo });
  }

  function calcularSubcedulaCapital(input, year){
    return calcularSubcedula({
      ingresosBrutos: input.ingresosBrutos,
      incrngo: input.incrngo,
      costos: input.costos,
      otrasRentasExentas: input.otrasRentasExentas,
      deduccionesNominales: input.deduccionesNominales,
      ingresosECE: input.ingresosECE
    }, year, { aplicaExenta25: false });
  }

  function calcularSubcedulaNoLaboral(input, year){
    return calcularSubcedula({
      ingresosBrutos: input.ingresosBrutos,
      incrngo: input.incrngo,
      costos: input.costos,
      otrasRentasExentas: input.otrasRentasExentas,
      deduccionesNominales: input.deduccionesNominales,
      ingresosECE: input.ingresosECE
    }, year, { aplicaExenta25: false });
  }

  // ═══════════════════════════════════════
  //  Cedula general consolidada
  //  Tope Art. 336 num. 3 ET aplicado al CONSOLIDADO (DUR 1625/2016 art. 1.2.1.20.4)
  // ═══════════════════════════════════════

  function calcularCedulaGeneral(input, year){
    var p = getParams(year);

    // 1) Calcular subcedulas
    var trabajo = calcularSubcedulaTrabajo(input.trabajo || {}, year);
    var honorarios = calcularSubcedulaHonorarios(input.honorarios || { modo:'rentasNoLaborales' }, year);
    var capital = calcularSubcedulaCapital(input.capital || {}, year);
    var noLaboral = calcularSubcedulaNoLaboral(input.noLaboral || {}, year);

    // 2) Casilla 91: Renta liquida cedular general (antes de exentas y deducciones limitadas)
    //    = suma de las rentas liquidas POSITIVAS de cada subcedula (las perdidas se difieren).
    var sumRentas = trabajo.rentaLiquidaAntesExentas
                  + honorarios.rentaLiquidaAntesExentas
                  + capital.rentaLiquidaAntesExentas
                  + noLaboral.rentaLiquidaAntesExentas;
    // Cada subcedula ya esta pisada en 0 (maxZero): una perdida real de capital/no laboral NO
    // compensa en el anio contra las demas subcedulas (se difiere, Art. 147 ET, y se reporta en
    // las casillas 55/71/88). Por eso la c91 es la suma de las rentas liquidas positivas.
    var c91 = maxZero(sumRentas);

    // 3) Casilla 92: Total exentas y deducciones imputables, limitadas al tope
    //    Tope = min(40% × c91, 1340 UVT, c91)
    // Cada subcedula entra ya capada a su propia renta liquida (exentasYDeduccionesTope, verificado
    // contra AyudaRenta DIAN oficial: casillas 41/53/69/86 = min(solicitado, cupo tope, renta de ESA
    // subcedula)). Sin este tope individual, una subcedula en perdida "prestaria" su exceso al pool.
    var rawDentroTope = trabajo.exentasYDeduccionesTope
                      + honorarios.exentasYDeduccionesTope
                      + capital.exentasYDeduccionesTope
                      + noLaboral.exentasYDeduccionesTope;
    // Base del 40% = suma(ingresos brutos - INCRNGO) de las subcedulas, SIN restar costos (Art. 336-3 ET).
    // No es el 40% de c91, porque c91 si descuenta los costos de capital/no laboral/honorarios.
    var base40Total = trabajo.base40 + honorarios.base40 + capital.base40 + noLaboral.base40;
    var limite40 = r1k(base40Total * p.topeCedularPct);
    var limite1340 = r1k(p.topeCedularUvt * p.uvt);
    var c92 = Math.min(rawDentroTope, limite40, limite1340, c91);
    var excedeTope = rawDentroTope > Math.min(limite40, limite1340);

    // 4) Deducciones FUERA del tope (Art. 336 num. 3 inc. 2 + num. 5)
    // Dependientes (Art. 336 num. 3 inc. 2 ET): entero, piso 0, tope 4.
    var depArt336Num = Math.max(0, Math.min(
      Math.floor(input.dependientesArt336Numero || 0),
      p.dependientesArt336MaxNumero
    ));
    // Decreto 2231/2023 (Art. 1.2.1.20.3 Dcto 1625/2016): los 72 UVT/dependiente aplican SOLO a rentas de
    // trabajo (vinculo laboral u honorarios por servicios personales). No proceden sobre capital ni no laborales,
    // y no pueden exceder la renta de trabajo disponible.
    var honEsTrabajo = !!(input.honorarios && input.honorarios.modo === 'rentasTrabajo');
    var rentaTrabajoDisp = trabajo.rentaSubcedula + (honEsTrabajo ? honorarios.rentaSubcedula : 0);
    var depArt336Valor = rentaTrabajoDisp > 0
      ? Math.min(r1k(depArt336Num * p.dependientesArt336UvtPorDep * p.uvt), rentaTrabajoDisp)
      : 0;

    var fe1Pct = input.facturaElectronica1Pct || 0;
    var fe1PctMax = r1k(p.facturaElectronica1PctMaxUvt * p.uvt);
    var fe1PctAplicado = Math.min(fe1Pct, fe1PctMax);

    // Deducción especial Ley 1715/2014 art. 11 (mod. Ley 2099/2021): 50% del valor
    // de inversión en vehículo eléctrico/híbrido, diferible hasta 15 años, con tope
    // anual del 50% de la RENTA LÍQUIDA CEDULAR (c91), determinada antes de las
    // deducciones especiales y del límite del Art. 336 (Concepto DIAN 013853/2025;
    // "renta líquida" del Art. 26 ET, antes de rentas exentas). Requiere certificación
    // UPME (lo valida el contador). El usuario ingresa el monto a deducir ESTE año.
    var vehElecSolicitado = input.deduccionVehiculoElectrico || 0;
    var vehElecTope = r1k(c91 * 0.5);   // art. 11: máx 50% de la renta líquida cedular (c91)
    var vehElecAplicado = Math.min(vehElecSolicitado, vehElecTope);
    var vehElecDiferible = maxZero(vehElecSolicitado - vehElecAplicado);

    var deduccionesFueraTope = depArt336Valor + fe1PctAplicado + vehElecAplicado;

    // 5) Casilla 93: Renta liquida ordinaria
    var c93 = maxZero(c91 - c92 - deduccionesFueraTope);

    // 6) Casilla 97: Renta liquida gravable (con compensaciones)
    var c97 = maxZero(
      c93
      + (input.rentasGravablesAdicionales || 0)
      - (input.perdidasFiscales || 0)
      - (input.excesoRentaPresuntiva || 0)
    );

    return {
      subcedulas: {
        trabajo: trabajo,
        honorarios: honorarios,
        capital: capital,
        noLaboral: noLaboral
      },
      c91: c91,
      c92: c92,
      c93: c93,
      c97: c97,
      tope: {
        rawDentroTope: rawDentroTope,
        base40: base40Total,
        limite40: limite40,
        limite1340: limite1340,
        excedeTope: excedeTope,
        deduccionesAplicadasDentroTope: c92,
        deduccionesFueraTope: {
          dependientesArt336: depArt336Valor,
          facturaElectronica1Pct: fe1PctAplicado,
          vehiculoElectrico: vehElecAplicado,
          total: deduccionesFueraTope
        },
        vehiculoElectrico: {
          solicitado: vehElecSolicitado,
          aplicado: vehElecAplicado,
          tope50RentaLiquida: vehElecTope,
          diferibleProximosAnios: vehElecDiferible
        }
      }
    };
  }

  // ═══════════════════════════════════════
  //  Cedula pensiones (Art. 337 ET + Art. 206 num. 5)
  //
  // El Art. 206 num. 5 establece tope MENSUAL de 1.000 UVT por mesada.
  // Si el caller provee `mesadas` (array de pagos mensuales), se aplica el
  // tope estricto mensual. Si solo se provee total anual (`ingresosBrutos`),
  // se aplica modo retrocompatible (tope anual 12.000 UVT) y se marca
  // `modoAnualFallback: true` para que el validador advierta.
  // ═══════════════════════════════════════

  function calcularCedulaPensiones(input, year){
    var p = getParams(year);
    var ing = input.ingresosBrutos || 0;
    var incrngo = input.incrngo || 0;
    var topeMes = p.pensionExentaUvtMes * p.uvt;

    // Casilla 101: Ingresos netos
    var c101 = maxZero(ing - incrngo);

    var rentaExenta;
    var modoAnualFallback = false;
    var detalleMesadas = null;

    if(Array.isArray(input.mesadas) && input.mesadas.length > 0){
      // Modo correcto: tope mensual estricto Art. 206 num. 5
      var totalMesadas = 0;
      var exentaPorMesada = 0;
      detalleMesadas = input.mesadas.map(function(m){
        var mesada = Number(m) || 0;
        totalMesadas += mesada;
        var exenta = Math.min(mesada, topeMes);
        exentaPorMesada += exenta;
        return { mesada: mesada, exenta: exenta, gravable: maxZero(mesada - topeMes) };
      });
      // Si el ingreso bruto no incluye los aportes (incrngo aparte), se aplica
      // proporcionalmente la exencion sobre el neto. Para mantenerlo simple:
      // exenta = min(c101, suma_exentas_mensuales).
      rentaExenta = Math.min(c101, exentaPorMesada);
      rentaExenta = r1k(rentaExenta);
    } else {
      // Modo retrocompatible: tope anual (mas generoso de lo legal en mesadas con prima alta)
      var topeAnual = topeMes * 12;
      rentaExenta = r1k(Math.min(c101, topeAnual));
      modoAnualFallback = true;
    }

    var c103 = maxZero(c101 - rentaExenta);

    return {
      ingresosBrutos: ing,
      incrngo: incrngo,
      c101: c101,
      rentaExenta: rentaExenta,
      c103: c103,
      modoAnualFallback: modoAnualFallback,
      detalleMesadas: detalleMesadas
    };
  }

  // ═══════════════════════════════════════
  //  Cesantias exentas Art. 206 num. 4 ET — escala decreciente
  //
  //  Recibe:
  //    cesantiasRecibidas (pesos) — total cesantias + intereses recibidos en el ano
  //    salarioPromedio6mUvt — salario promedio ultimos 6 meses, en UVT/mes
  //
  //  Devuelve la PORCION EXENTA (en pesos), redondeada a miles.
  //  La parte gravable = cesantiasRecibidas - exenta.
  // ═══════════════════════════════════════

  function cesantiasExentasArt206_4(cesantiasRecibidas, salarioPromedio6mUvt, year){
    if(!cesantiasRecibidas || cesantiasRecibidas <= 0) return 0;
    var p = getParams(year);
    var escala = p.escalaCesantiasArt206_4;
    if(!escala || escala.length === 0) return cesantiasRecibidas; // retrocompat

    // Si no se conoce el salario promedio, asumir caso conservador (100% exenta)
    // y dejar al validador advertir. Esto preserva retrocompatibilidad.
    if(salarioPromedio6mUvt == null || isNaN(salarioPromedio6mUvt)) {
      return cesantiasRecibidas;
    }

    for(var i = 0; i < escala.length; i++){
      var t = escala[i];
      if(salarioPromedio6mUvt <= t.hastaUvtMes){
        return r1k(cesantiasRecibidas * t.exentaPct);
      }
    }
    return 0;
  }

  // ═══════════════════════════════════════
  //  Cedula dividendos (Art. 343 ET)
  // ═══════════════════════════════════════

  function calcularCedulaDividendos(input, year){
    // c104: dividendos 2016 y anteriores brutos
    // c105: INCRNGO 2016 y anteriores
    // c106: dividendos 2016 y anteriores netos = max(c104 - c105, 0)
    // c107: 1a subcedula 2017+ (no gravados Art. 49 num. 3) — tributan Art. 242
    // c108: 2a subcedula 2017+ (gravados Art. 49 par. 2) — tributan Art. 242-1
    // c109/c110: dividendos exterior y descuento

    var c104 = input.anteriores2016 || 0;
    var c105 = input.incrngoAnteriores2016 || 0;
    var c106 = maxZero(c104 - c105);
    var c107 = input.noGravados2017 || 0;
    var c108 = input.gravados2017 || 0;
    var c109 = input.exterior || 0;
    var c110 = input.incrngoExterior || 0;

    return {
      c104: c104, c105: c105, c106: c106,
      c107: c107, c108: c108,
      c109: c109, c110: c110
    };
  }

  // ═══════════════════════════════════════
  //  Ganancias ocasionales (Arts. 313 ss. ET)
  // ═══════════════════════════════════════

  function calcularGananciasOcasionales(input, year){
    var p = getParams(year);
    var ing = input.ingresos || 0;
    var costos = input.costos || 0;
    var loterias = input.loterias || 0;
    var gananciaNoLoteria = maxZero(ing - costos);

    // Exencion de la casa/apto de habitacion al venderla (Art. 311-1 ET, mod. Ley 2277/2022 art. 31):
    // primeras 5.000 UVT de la GANANCIA, si se consigno en AFC o se pago la hipoteca de esa misma
    // vivienda (lo valida el contador; el motor solo aplica el tope si input.viviendaHabitacion=true).
    var exVivienda = input.viviendaHabitacion ? Math.min(gananciaNoLoteria, p.goViviendaUrbanaExentaUvt * p.uvt) : 0;

    // Otras exenciones de GO (herencias Art.307, seguros Art.303-1): antes se tomaba tal cual del usuario
    // (riesgo: eximir de mas -> sub-declaracion). Ahora se TOPA segun el tipo.
    // Topes ET (UVT): vivienda urbana causante 13.000 (Art.307-1); inmueble rural 6.500 (Art.307-2);
    // legitimarios/conyuge 3.490 (Art.307-3); no legitimarios/donaciones 2.290 (Art.307-4); seguro vida 3.250 (Art.303-1).
    var TOPES_GO_UVT = { viviendaUrbana:13000, inmuebleRural:6500, legitimario:3490, noLegitimario:2290, seguroVida:3250 };
    var exentaOtras = input.rentasExentas || 0;
    var tipo = input.rentasExentasTipo, avisoExentaGO = null;
    if(exentaOtras > 0 && tipo && TOPES_GO_UVT[tipo]){
      var capGO = r1k(TOPES_GO_UVT[tipo] * p.uvt);
      if(exentaOtras > capGO){ avisoExentaGO = { tipo:tipo, topeUvt:TOPES_GO_UVT[tipo], topePesos:capGO, solicitado:exentaOtras }; exentaOtras = capGO; }
    }
    var exentas = Math.min(gananciaNoLoteria, exVivienda + exentaOtras);

    // Casilla 112: ingresos brutos GO
    var c112 = ing + loterias;
    var c113 = costos;
    var c114 = exentas;
    var c115 = maxZero(c112 - c113 - c114);

    return {
      c112: c112,
      c113: c113,
      c114: c114,
      c115: c115,
      ingresosNoLoterias: ing,
      loterias: loterias,
      exentaVivienda: exVivienda,
      exentaOtrasAplicada: exentaOtras,
      avisoExentaGO: avisoExentaGO
    };
  }

  // ═══════════════════════════════════════
  //  Liquidacion final
  // ═══════════════════════════════════════

  function calcularLiquidacion(estado, cedulas, year){
    var p = getParams(year);
    var liq = estado.liquidacion || {};
    var decl = estado.declarante || {};

    // Casilla 111: Renta liquida gravable total tabla Art. 241
    //   Art. 331 ET (mod. Ley 2277/2022): las rentas liquidas cedulares de
    //   trabajo, capital, no laborales, pensiones Y dividendos (no gravados +
    //   NETO de los gravados) se SUMAN para aplicar la tabla del Art. 241.
    //   Los dividendos 2016 y anteriores (c106) tributan Art. 241 aparte (regimen historico).
    var c98 = (estado.cedulaGeneral && estado.cedulaGeneral.rentaPresuntiva) || 0;
    var baseConPresuntiva = Math.max(cedulas.general.c97, c98);

    // Dividendos GRAVADOS 2017+ (Art. 49 par. 2): primero la tarifa del Art. 240
    // (35%) como impuesto (c119); el NETO resultante (65%) integra la cedula
    // general y tributa con la tabla progresiva del Art. 241 (Art. 242 inc. 2,
    // Ley 2277/2022). Antes se liquidaba 35% + 15% fijo y el neto no integraba
    // — la tarifa fija del 15% (Art. 242 pre-reforma) quedo derogada por la 2277.
    var c108Gravado = cedulas.dividendos.c108 || 0;
    var impGravado35 = r1k(c108Gravado * p.divGravadosTarifaCorporativa); // 35% Art. 240/242-1 → casilla 118
    var netoGravado = maxZero(c108Gravado - impGravado35);               // 65% → cedula general
    var rentaCedularDiv = (cedulas.dividendos.c107 || 0) + netoGravado;
    var c111 = baseConPresuntiva + cedulas.pensiones.c103 + rentaCedularDiv;

    // Casilla 116: Impuesto Art. 241 sobre c111 (general + pensiones + dividendos a tabla)
    var c116 = impuestoArt241(c111, year);

    // Casilla 117: si renta presuntiva supera cedula general, mismo impuesto (no doble)
    var c117 = (c98 > cedulas.general.c97) ? c116 : 0;

    // Casilla 118: Impuesto de la 2a subcedula de dividendos 2017+ GRAVADOS = 35% (Art. 240/242-1).
    //   El template oficial rotula la casilla 118 "Por dividendos y participaciones ano 2017 y
    //   siguientes, 2a subcedula (Art. 240 E.T.)". El neto (65%) ya tributo en c116 via la cedula general.
    var c118 = impGravado35;

    // Casilla 119: Impuesto sobre dividendos y participaciones ANO 2016 y anteriores (tabla Art. 241).
    var c119 = impuestoArt241(cedulas.dividendos.c106, year);

    // Casilla 120: Impuesto sobre dividendos y participaciones recibidas del EXTERIOR (tabla Art. 241).
    var divExt = maxZero(cedulas.dividendos.c109 - cedulas.dividendos.c110);
    var c120 = impuestoArt241(divExt, year);

    // Casilla 121: Total impuesto rentas cedulares
    var c121 = c116 + c118 + c119 + c120;

    // Descuento Art. 254-1 ET (adicionado Ley 2277/2022):
    //   19% × max(0, c107 - 1.090 UVT). Limite implicito vía max(0, c121-c125)
    //   para que c126 no quede negativo (DIAN Concepto 100208192-272/2023).
    //   La base es la renta cedular de dividendos a tabla = no gravados (c107)
    //   + neto de los gravados (ambos integraron la general).
    var rl1090EnPesos = p.divNoGravadosExentoUvt * p.uvt;
    var excesoDividendos = maxZero(rentaCedularDiv - rl1090EnPesos);
    var descuento254_1 = r1k(excesoDividendos * 0.19);

    // Casilla 125: Total descuentos tributarios (Arts. 254, 254-1, 255, 256)
    var c125 = (liq.descuentos || 0) + descuento254_1;

    // Casilla 126: Impuesto neto de renta. El max(0,...) limita el descuento
    // implicitamente: nunca puede dejar c126 negativo.
    var c126 = maxZero(c121 - c125);

    // Casilla 127: Impuesto ganancias ocasionales
    //   = 15% × (c115 - loterias) + 20% × loterias
    var goSinLoterias = maxZero(cedulas.go.c115 - (cedulas.go.loterias || 0));
    var c127 = impuestoArt314(goSinLoterias, year) + impuestoArt317(cedulas.go.loterias || 0, year);

    // Casilla 128: Descuento por impuestos pagados en exterior por GO
    var c128 = liq.descuentoExteriorGO || 0;

    // Casilla 129: Total impuesto a cargo
    var c129 = maxZero(c126 + c127 - c128);

    // El MUISCA aproxima cada casilla al multiplo de mil mas cercano; redondeamos
    // las entradas del usuario para que los saldos finales salgan en miles.
    // Casilla 130: Anticipo del ano anterior pagado
    var c130 = r1k(liq.anticipoPagado || 0);
    // Casilla 131: Saldo a favor ano anterior
    var c131 = r1k(liq.saldoFavorAnoAnterior || 0);
    // Casilla 132: Retenciones del ano
    var c132 = r1k(liq.retencionesAno || 0); // DIAN: aproximar al multiplo de mil

    // Casilla 133: Anticipo ano siguiente (Art. 807 ET)
    //
    // Tarifa segun numero de declaraciones previas:
    //   prev === 0  → 25% (primera declaracion)
    //   prev === 1  → 50% (segunda declaracion)
    //   prev >= 2   → 75% (tercera o posterior)
    //
    // Base (Art. 807 inc. 2): el contribuyente puede aplicar el menor entre:
    //   (a) Metodo simple:    tarifa × c126 (impuesto neto actual)
    //   (b) Metodo promedio:  tarifa × promedio(c126 actual, c126 anterior)
    //
    // El motor por defecto usa metodo simple. La opcion de promedio se ofrece
    // en UI cuando el contribuyente declara por 2da o 3ra+ vez. Para forzar el
    // calculo por promedio: pasar liq.metodoAnticipo = 'promedio' y
    // liq.impuestoNetoAnoAnterior. El motor toma el menor de los dos.
    var prev = decl.declaracionesPrevias || 0;
    var pctAnticipo = prev === 0 ? p.anticipoPctPrimeraVez
                    : prev === 1 ? p.anticipoPctSegundaVez
                    :              p.anticipoPctTerceraOMas;

    var anticipoSimple = r1k(c126 * pctAnticipo);
    var anticipoPromedio = anticipoSimple;
    if(prev >= 1 && liq.impuestoNetoAnoAnterior > 0){
      var promedioImpuesto = (c126 + liq.impuestoNetoAnoAnterior) / 2;
      anticipoPromedio = r1k(promedioImpuesto * pctAnticipo);
    }
    var anticipoBase = (liq.metodoAnticipo === 'simple')
      ? anticipoSimple
      : Math.min(anticipoSimple, anticipoPromedio);
    // Override manual: el contador puede fijar el anticipo (Art. 807 lo permite estimar), incluso en 0.
    var c133 = (liq.metodoAnticipo === 'manual')
      ? maxZero(r1k(liq.anticipoManual || 0))
      : maxZero(anticipoBase - c132);

    // Casilla 134: Saldo a pagar por impuesto
    var totalPagos = c130 + c131 + c132;
    var totalCargo = c129 + c133;
    var saldoImp = totalCargo - totalPagos;
    var c134 = maxZero(saldoImp);

    // Casilla 135: Sancion
    var c135 = liq.sancion || 0;

    // Casilla 136: Total saldo a pagar (incluye sancion)
    var c136 = maxZero(saldoImp + c135);

    // Casilla 137: Total saldo a favor
    var c137 = maxZero(totalPagos - totalCargo - c135);

    return {
      c98: c98, c111: c111,
      c116: c116, c117: c117, c118: c118, c119: c119, c120: c120,
      c121: c121, c125: c125, c126: c126, c127: c127, c128: c128, c129: c129,
      c130: c130, c131: c131, c132: c132, c133: c133,
      c134: c134, c135: c135, c136: c136, c137: c137,
      descuentos: {
        externos: liq.descuentos || 0,
        art254_1: descuento254_1,
        total: c125
      },
      anticipo: {
        pctAplicado: pctAnticipo,
        declaracionesPrevias: prev,
        metodoSimple: anticipoSimple,
        metodoPromedio: anticipoPromedio,
        baseAplicada: anticipoBase,
        valor: c133
      }
    };
  }

  // ═══════════════════════════════════════
  //  Top-level
  // ═══════════════════════════════════════

  function calcular210(estado, year){
    estado = estado || {};
    var pat = estado.patrimonio || {};
    var cg = estado.cedulaGeneral || {};

    // Patrimonio
    var c29 = pat.bruto || 0;
    var c30 = pat.deudas || 0;
    var c31 = maxZero(c29 - c30);

    // Cedulas
    var general = calcularCedulaGeneral(cg, year);
    var pensiones = calcularCedulaPensiones(estado.cedulaPensiones || {}, year);
    var dividendos = calcularCedulaDividendos(estado.cedulaDividendos || {}, year);
    var go = calcularGananciasOcasionales(estado.gananciasOcasionales || {}, year);

    // Liquidacion
    var liq = calcularLiquidacion(estado, {
      general: general, pensiones: pensiones, dividendos: dividendos, go: go
    }, year);

    return {
      year: year,
      patrimonio: { c29: c29, c30: c30, c31: c31 },
      cedulaGeneral: general,
      cedulaPensiones: pensiones,
      cedulaDividendos: dividendos,
      gananciasOcasionales: go,
      liquidacion: liq,
      // Renglones planos para conveniencia
      renglones: {
        c29: c29, c30: c30, c31: c31,
        c91: general.c91, c92: general.c92, c93: general.c93, c97: general.c97,
        c101: pensiones.c101, c103: pensiones.c103,
        c104: dividendos.c104, c105: dividendos.c105, c106: dividendos.c106,
        c107: dividendos.c107, c108: dividendos.c108,
        c112: go.c112, c113: go.c113, c114: go.c114, c115: go.c115,
        c98: liq.c98, c111: liq.c111,
        c116: liq.c116, c118: liq.c118, c119: liq.c119, c120: liq.c120,
        c121: liq.c121, c125: liq.c125, c126: liq.c126, c127: liq.c127, c128: liq.c128, c129: liq.c129,
        c130: liq.c130, c131: liq.c131, c132: liq.c132, c133: liq.c133,
        c134: liq.c134, c135: liq.c135, c136: liq.c136, c137: liq.c137,
        // Casilla específica del descuento Art. 254-1 ET (Ley 2277/2022) — A.3.c
        // El motor calcula esto en liq.descuentos.art254_1; lo exponemos como
        // renglón explícito para que el Excel papel de trabajo lo discrimine
        // del descuento agregado c124 en la Hoja 2.
        c296: (liq.descuentos && liq.descuentos.art254_1) || 0
      }
    };
  }

  // ═══════════════════════════════════════
  //  Export UMD
  // ═══════════════════════════════════════
  var api = {
    // Tarifas
    impuestoArt241: impuestoArt241,
    impuestoArt242: impuestoArt242,
    impuestoArt242_1: impuestoArt242_1,
    impuestoArt314: impuestoArt314,
    impuestoArt317: impuestoArt317,
    tarifaMarginal: tarifaMarginal,
    pesosAUvt: pesosAUvt,
    uvtAPesos: uvtAPesos,
    // Subcedulas
    calcularSubcedulaTrabajo: calcularSubcedulaTrabajo,
    calcularSubcedulaHonorarios: calcularSubcedulaHonorarios,
    calcularSubcedulaCapital: calcularSubcedulaCapital,
    calcularSubcedulaNoLaboral: calcularSubcedulaNoLaboral,
    // Cedulas
    calcularCedulaGeneral: calcularCedulaGeneral,
    calcularCedulaPensiones: calcularCedulaPensiones,
    calcularCedulaDividendos: calcularCedulaDividendos,
    calcularGananciasOcasionales: calcularGananciasOcasionales,
    // Helpers normativos
    cesantiasExentasArt206_4: cesantiasExentasArt206_4,
    // Liquidacion y top-level
    calcularLiquidacion: calcularLiquidacion,
    calcular210: calcular210
  };

  if(typeof module !== 'undefined' && module.exports){
    module.exports = api;
  } else {
    window.cal210 = api;
  }
})();
