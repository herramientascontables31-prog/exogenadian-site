/**
 * Aziendale — Parametros Finanzas Personales
 *
 * Vigente: 2026-06  (actualizar al certificarse cada nuevo IBC SuperFin)
 *
 * Fuentes:
 *   UVT 2026:        Res. DIAN 000238 / 2025-12-15        $52.374
 *   SMLMV 2026:      Decreto MinTrabajo                   $1.750.905
 *   Aux. transporte: Decreto MinTrabajo                   $249.095
 *   IBC consumo:     SuperFin cert. 2026-05-29 (jun 2026) 19,19% E.A.
 *   Tasa usura:      1,5 × IBC (vigente 1-30 jun 2026)    28,79% E.A.
 *   Vivienda:        Decreto 583 de 2025-05-28 (mod. Decreto 1077/2015)
 *   Retef. rend.:    ET arts. 395-396, DUR 1625/2016
 *
 * Patron: leer parametro -> ParametrosFinanzas.P.<grupo>.<clave>
 *         o usar helpers ParametrosFinanzas.uvtToCop(uvts), .clasificarVivienda(v)...
 */
window.ParametrosFinanzas = (function () {
  'use strict';

  var P = {
    vigencia: '2026-06',

    // === Valores oficiales 2026 ===
    uvt:           52374,
    smlmv:         1750905,
    auxTransporte: 249095,

    // === Tasas E.A. — SuperFinanciera junio 2026 (cert. 2026-05-29) y referencias de mercado ===
    tasas: {
      ibcConsumo:        19.19,   // credito de consumo y ordinario
      usuraConsumo:      28.79,   // 1,5 x IBC
      vehiculoPromedio:  19.00,   // promedio bancos grandes (referencia)
      viviendaVis:       12.47,   // SuperFin segmento VIS — verificar
      viviendaNoVis:     12.26,   // SuperFin segmento No VIS — verificar
      fnaSocial:          7.00,   // FNA programa social
      cdtPromedio:       10.50,   // CDT 12 meses, varia mucho por banco
      cuentaAhorro:       4.00,   // referencia conservadora
      ficModerado:       11.00    // FIC riesgo moderado, referencia
    },

    // === Vivienda — Decreto 583 de 2025-05-28 ===
    vivienda: {
      topeVipSmlmv:           90,
      topeVisSmlmv:          135,
      topeVisSmlmvGrandes:   150,    // ciudades > 1M habitantes
      financiaMaxVisPct:      80,    // % maximo financiable VIS
      financiaMaxNoVisPct:    70,    // % maximo financiable No VIS
      cuotaMaxIngresoPct:     40     // primera cuota / ingreso familiar
    },

    // === Auto — buena practica 20/4/10 (NO es ley) ===
    auto: {
      inicialMinPct:          20,
      plazoMaxAnios:           4,
      cuotaMaxIngresoPct:     10     // cuota + seguro + mantto / ingreso
    },

    // === Retefuente sobre rendimientos financieros (ET 395-396) ===
    // TODO: confirmar que el umbral 7 UVT aplica al rendimiento mensual.
    //       Ver Decreto 1625/2016 art. 1.2.4.4.10 antes de publicar costo-oportunidad.html
    retefuenteRendimientos: {
      tarifaCdtPct:        4.00,   // CDT, intereses prestamos
      tarifaAhorrosPct:    7.00,   // cuentas de ahorro
      umbralUvtMes:           7    // por verificar
    },

    // === Reglas de prudencia (didacticas, no legales) ===
    prudencia: {
      ratioCuotaConsumoMaxPct:     30,   // alerta auditor de deudas
      ratioCuotaConsumoCriticoPct: 35,   // estado apagando incendios
      fondoEmergenciaMesesMin:      3,
      fondoEmergenciaMesesIdeal:    6,
      ahorroMinIngresoPct:         10,
      regla503020: { necesidades: 50, deseos: 30, ahorroDeuda: 20 }
    }
  };

  // === Helpers de conversion ===
  function uvtToCop(uvts)     { return Math.round((uvts || 0) * P.uvt); }
  function copToUvt(cop)      { return (cop || 0) / P.uvt; }
  function smlmvToCop(n)      { return Math.round((n || 0) * P.smlmv); }
  function copToSmlmv(cop)    { return (cop || 0) / P.smlmv; }

  // === Clasificacion VIS/VIP/No VIS ===
  // esCiudadGrande = Bogota, Medellin, Cali, Barranquilla, Cartagena, Bucaramanga, etc.
  function clasificarVivienda(valorCop, esCiudadGrande) {
    var enSmlmv = copToSmlmv(valorCop);
    var topeVis = esCiudadGrande ? P.vivienda.topeVisSmlmvGrandes : P.vivienda.topeVisSmlmv;
    if (enSmlmv <= P.vivienda.topeVipSmlmv) return 'VIP';
    if (enSmlmv <= topeVis)                  return 'VIS';
    return 'NO_VIS';
  }

  // === Cuota maxima permitida por la regla del 40% (Decreto 583/2025) ===
  function cuotaMaxVivienda(ingresoFamiliarMensual) {
    return Math.round((ingresoFamiliarMensual || 0) * P.vivienda.cuotaMaxIngresoPct / 100);
  }

  // === % maximo financiable segun clasificacion ===
  function pctFinanciable(clasificacion) {
    return clasificacion === 'NO_VIS'
      ? P.vivienda.financiaMaxNoVisPct
      : P.vivienda.financiaMaxVisPct;
  }

  // === Conversion tasa E.A. <-> mensual nominal ===
  function eaAMensual(eaPct) {
    return (Math.pow(1 + (eaPct || 0) / 100, 1 / 12) - 1) * 100;
  }
  function mensualAEa(mensualPct) {
    return (Math.pow(1 + (mensualPct || 0) / 100, 12) - 1) * 100;
  }

  return {
    P: P,
    uvtToCop: uvtToCop,
    copToUvt: copToUvt,
    smlmvToCop: smlmvToCop,
    copToSmlmv: copToSmlmv,
    clasificarVivienda: clasificarVivienda,
    cuotaMaxVivienda: cuotaMaxVivienda,
    pctFinanciable: pctFinanciable,
    eaAMensual: eaAMensual,
    mensualAEa: mensualAEa
  };
})();
