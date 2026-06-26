/**
 * Aziendale — Parametros Renta Personas Naturales (Formulario 210)
 *
 * Fuente normativa:
 *   - Estatuto Tributario Nacional (ET)
 *   - Ley 2277 de 2022 (vigente desde AG 2023)
 *   - DUR 1625 de 2016
 *
 * Resoluciones DIAN UVT:
 *   - UVT 2024: Res. 000187/2023-11-28  $47.065
 *   - UVT 2025: Res. 000193/2024-11-22  $49.799
 *   - UVT 2026: Res. 000238/2025-12-15  $52.374
 *
 * Las tarifas y topes en UVT no cambian entre AG 2024 y AG 2026 (Ley 2277/2022).
 * Solo varia el valor de la UVT, el SMLMV y el auxilio de transporte.
 */
(function(){
  'use strict';

  // === Tabla Art. 241 ET (modificada Ley 2277/2022, vigente AG 2023+) ===
  // baseUvt = impuesto acumulado en UVT al inicio del tramo
  // formula tramo: imp = (rlUvt - desdeUvt) * tarifa + baseUvt
  // baseUvt acumulada EXACTA (formula matematica exacta):
  //   1.090 -> 0
  //   1.700 -> (1700-1090)*0.19 = 115.9
  //   4.100 -> 115.9 + (4100-1700)*0.28 = 115.9 + 672 = 787.9
  //   8.670 -> 787.9 + (8670-4100)*0.33 = 787.9 + 1508.1 = 2296.0
  //  18.970 -> 2296 + (18970-8670)*0.35 = 2296 + 3605 = 5901.0
  //  31.000 -> 5901 + (31000-18970)*0.37 = 5901 + 4451.1 = 10352.1
  // Usamos los sumandos FIJOS del texto del Art. 241 (116 / 788 / 2.296 / 5.901 /
  // 10.352 UVT): son los que aplica el MUISCA. Verificado jun-2026 contra el motor
  // de CalculaRenta (auditado vs 37 declaraciones reales); los teoricos continuos
  // (115,9 / 787,9 / 10.352,1) daban ~$5.000 de diferencia por declaracion.
  var TABLA_241 = [
    { desdeUvt: 0,     hastaUvt: 1090,     tarifa: 0.00, baseUvt: 0,       descripcion: '0%' },
    { desdeUvt: 1090,  hastaUvt: 1700,     tarifa: 0.19, baseUvt: 0,       descripcion: '19%' },
    { desdeUvt: 1700,  hastaUvt: 4100,     tarifa: 0.28, baseUvt: 116,   descripcion: '28%' },
    { desdeUvt: 4100,  hastaUvt: 8670,     tarifa: 0.33, baseUvt: 788,   descripcion: '33%' },
    { desdeUvt: 8670,  hastaUvt: 18970,    tarifa: 0.35, baseUvt: 2296,    descripcion: '35%' },
    { desdeUvt: 18970, hastaUvt: 31000,    tarifa: 0.37, baseUvt: 5901,    descripcion: '37%' },
    { desdeUvt: 31000, hastaUvt: Infinity, tarifa: 0.39, baseUvt: 10352, descripcion: '39%' }
  ];

  function buildAnio(uvt, smlmv, aux, notas){
    return {
      uvt: uvt,
      smlmv: smlmv,
      auxTransporte: aux,

      // === Tope general cedula general (Art. 336 num. 3 ET, mod. Ley 2277/2022) ===
      // Tope = min(40% renta liquida cedular, 1.340 UVT)
      // Nota: el formato210.html v anterior usaba 5.040 UVT (regla Ley 1819/2016).
      // Desde AG 2023 (Ley 2277/2022) el tope correcto es 1.340 UVT.
      topeCedularUvt: 1340,
      topeCedularPct: 0.40,

      // === Rentas exentas DENTRO del tope ===
      exentaTrabajo25Pct: 0.25,            // Art. 206 num. 10 ET (Ley 2277/2022): tope ANUAL 790 UVT
      exentaTrabajo25MaxUvt: 790,
      pensionExentaUvtMes: 1000,           // Art. 206 num. 5 ET: tope MENSUAL 1.000 UVT por mesada (no anual)

      // === Escala cesantias Art. 206 num. 4 ET ===
      // Si salario promedio ultimos 6 meses (en UVT/mes) <= hastaUvtMes => cesantia exenta * exentaPct
      // Aplica en orden: el primer tramo cuyo limite NO se exceda determina la tarifa.
      escalaCesantiasArt206_4: [
        { hastaUvtMes: 350, exentaPct: 1.00 },
        { hastaUvtMes: 410, exentaPct: 0.90 },
        { hastaUvtMes: 470, exentaPct: 0.80 },
        { hastaUvtMes: 530, exentaPct: 0.60 },
        { hastaUvtMes: 590, exentaPct: 0.40 },
        { hastaUvtMes: 650, exentaPct: 0.20 },
        { hastaUvtMes: Infinity, exentaPct: 0.00 }
      ],

      // === Deducciones DENTRO del tope (Arts. 119, 387 ET) ===
      interesesViviendaMaxUvt: 1200,       // Art. 119 ET
      saludPrepagadaMaxUvt: 192,           // Art. 387 ET
      dependientesArt387Pct: 0.10,         // Art. 387 num. 2 ET
      dependientesArt387MaxUvtMes: 32,
      dependientesArt387MaxUvtAnual: 384,
      avcAfcMaxPct: 0.30,                  // Arts. 126-1, 126-4 ET
      avcAfcMaxUvt: 3800,

      // === Deducciones FUERA del tope (Art. 336 ET, mod. Ley 2277/2022) ===
      // Estas se restan despues de aplicar el tope, no compiten contra el 40%.
      facturaElectronica1PctMaxUvt: 240,   // Art. 336 num. 5 ET (1% de compras con FE)
      dependientesArt336UvtPorDep: 72,     // Art. 336 num. 3 inc. 2 ET
      dependientesArt336MaxNumero: 4,      // hasta 4 dependientes => max 288 UVT

      // === Tabla Art. 241 ET ===
      tabla241: TABLA_241,

      // === Dividendos (Arts. 242, 242-1 ET, mod. Ley 2277/2022) ===
      divNoGravadosExentoUvt: 1090,        // Art. 254-1: descuento sobre el exceso de 1.090 UVT
      divNoGravadosTarifaExceso: 0.19,     // 19% sobre el exceso de 1.090 UVT (Art. 254-1, Ley 2277/2022; el 15% pre-reforma quedo derogado)
      divGravadosTarifaCorporativa: 0.35,  // Art. 242-1: 35% sobre dividendo, luego el neto integra la general (Art. 241)

      // === Ganancias ocasionales (Arts. 313 ss. ET) ===
      goTarifa: 0.15,                      // Art. 314 ET (mod. Ley 2277/2022)
      goLoteriasTarifa: 0.20,              // Art. 317 ET
      goViviendaUrbanaExentaUvt: 5000,     // Art. 311-1 ET (mod. Ley 2277/2022 art. 32): primeras 5.000 UVT, con condiciones AFC/hipoteca
      goSegurosVidaExentaUvt: 12500,       // Art. 303-1 ET
      goHerenciasViviendaExentaUvt: 13000, // Art. 307 num. 1 ET
      goHerenciasOtrosExentaUvt: 6500,     // Art. 307 num. 2 ET

      // === Anticipo renta (Art. 807 ET) ===
      anticipoPctPrimeraVez: 0.25,
      anticipoPctSegundaVez: 0.50,
      anticipoPctTerceraOMas: 0.75,

      notas: notas || []
    };
  }

  var PARAMS = {
    2024: buildAnio(47065, 1300000, 162000, [
      'AG 2024 declarado en 2025',
      'Res. DIAN 000044/2024 mod. 000120/2024 prescribe F210 AG 2024'
    ]),
    2025: buildAnio(49799, 1423500, 200000, [
      'AG 2025 declarado en 2026',
      'Res. DIAN prescripcion F210 AG 2025: verificar a fecha de implementacion'
    ]),
    2026: buildAnio(52374, 1750905, 249095, [
      'UVT 2026 prescrita por Res. DIAN 000238/2025-12-15',
      'AG 2026 se declara en 2027'
    ])
  };

  function getParams(year){
    var p = PARAMS[year];
    if(!p) throw new Error('Ano fiscal no soportado: ' + year + '. Anos validos: ' + Object.keys(PARAMS).join(', '));
    return p;
  }

  function pesosAUvt(pesos, year){
    return pesos / getParams(year).uvt;
  }

  function uvtAPesos(uvt, year){
    return Math.round(uvt * getParams(year).uvt);
  }

  // Redondeo a miles, regla administrativa DIAN
  function redondearMiles(n){
    return Math.round(n / 1000) * 1000;
  }

  var api = {
    PARAMS: PARAMS,
    TABLA_241: TABLA_241,
    getParams: getParams,
    pesosAUvt: pesosAUvt,
    uvtAPesos: uvtAPesos,
    redondearMiles: redondearMiles
  };

  if(typeof module !== 'undefined' && module.exports){
    module.exports = api;
  } else {
    window.paramsRentaPN = api;
  }
})();
