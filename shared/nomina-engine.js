/* ═══════════════════════════════════════════════════════════════════════════
   Aziendale — Motor de Cálculo de Nómina Mensual
   ═══════════════════════════════════════════════════════════════════════════
   Liquida nómina mensual de uno o varios empleados en relación de dependencia
   ordinaria. Pensado para liquidación masiva desde plantilla Excel.

   ALCANCE — qué cubre y qué NO cubre:
   ✓ Empleado ordinario (no integral, no aprendiz, no ocasional, no dirección)
   ✓ Salario fijo o con HE/recargos en categorías estándar
   ✓ Pagos salariales y no salariales (gravables y no gravables)
   ✓ Aplicación Art. 30 Ley 1393/2010 (40% no salarial al IBC SS)
   ✓ Exoneración Art. 114-1 ET con criterio Concepto DIAN 956/2024
   ✓ Retención Procedimiento 1 con depuración Art. 388 ET
   ✓ Salario integral (Art. 132 CST) — IBC y parafiscales sobre el 70%
   ✓ Provisión mensual de prestaciones (cesantías, intereses, prima, vacaciones)
   ✗ Trabajadores de dirección/confianza/manejo (Art. 162 CST) — v2
   ✗ Aprendices SENA Ley 2466/2025 (régimen propio) — v2
   ✗ Procedimiento 2 retefuente (Art. 386 ET) — v2
   ✗ Pensionados que reingresan, suspensión contrato, ocasionales — fuera

   FUNDAMENTO NORMATIVO:
   · CST  Arts. 127 (salario), 128 (no salariales), 130 (viáticos), 159, 161,
          168, 179, 180, 186-189, 192, 227, 306
   · Ley 100/1993 — SS (Arts. 18, 204)
   · Ley 797/2003 — pensión y fondo solidaridad (Arts. 5, 20)
   · Ley 1393/2010 — Art. 30: pagos no salariales no pueden exceder 40% del
          total remuneración para efectos de IBC en SS
   · Sentencia de Unificación Consejo de Estado (2022): Art. 30 Ley 1393
          aplica SOLO a SS (salud, pensión, ARL); parafiscales rigen por Ley 21/82
   · Ley 1819/2016 — Art. 65 → ET Art. 114-1: exoneración aportes empresa
   · Concepto DIAN 956/2024 — los pagos no constitutivos NO se cuentan al
          tope de 10 SMLMV de la exoneración 114-1
   · Ley 2101/2021 — jornada: 44 h/sem hasta 14-jul-2026, luego 42 h/sem
   · Ley 50/1990 Art. 22 — máx HE: 2 h/día, 12 h/sem
   · Ley 2277/2022 — mantiene Art. 387 ET y Art. 206 num 10
   · ET Arts. 126-1, 126-4, 206 num 10, 383, 387, 388
   · Decreto 1295/1994 + 1607/2002 — ARL niveles
   · Decreto 2943/2013 — incapacidad días 1-2 al 100% empresa
   · Decreto MinTrabajo anual — SMLMV y Auxilio de transporte
   · Resolución DIAN anual — UVT
   · UGPP Concepto Unificado 4 de 2018 — criterios de fiscalización aportes
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Parámetros que cambian cada año ───
   Verificados contra fuente oficial al 2026-05-01.
   ALINEAR con shared/liquidador-engine.js cuando se actualice SMLMV/AUX.
*/
var PARAMS_NOMINA = {
  // SMLMV 2026: Decreto 1469/2025 — actualmente bajo suspensión provisional del
  //   Consejo de Estado pero las liquidaciones hechas con $1.750.905 son válidas
  //   (Auto 12-feb-2026, Decreto transitorio 0159/2026).
  // Aux 2026: Decreto 1470 de 29-dic-2025.
  // UVT 2026: Resolución DIAN 000238 de 15-dic-2025.
  2026: { SMLMV: 1750905, AUX: 249095, UVT: 52374 },
  2025: { SMLMV: 1423500, AUX: 200000, UVT: 49799 },  // Res. DIAN 165/2024
  2024: { SMLMV: 1300000, AUX: 162000, UVT: 47065 },
  2023: { SMLMV: 1160000, AUX: 140606, UVT: 42412 },
};

/* ─── Tipos de empleador para Art. 114-1 ET ─── */
var TIPO_EMPLEADOR = {
  SOCIEDAD:        'SOCIEDAD',         // sociedad mercantil → exonerable
  PN_2_MAS:        'PN_2_MAS',          // persona natural con 2+ empleados → exonerable
  PN_1:            'PN_1',              // persona natural con 1 empleado → NO exonerable
  SIN_ANIMO_LUCRO: 'SIN_ANIMO_LUCRO',   // ESAL → NO exonerable
  OTRO:            'OTRO',              // copropiedad, consorcio sin todos exonerados → NO
};

function tipoEmpleadorEsExonerable(tipo) {
  return tipo === TIPO_EMPLEADOR.SOCIEDAD || tipo === TIPO_EMPLEADOR.PN_2_MAS;
}

/* ─── Constantes que NO varían por año (definidas en leyes) ─── */
var CONST_NOMINA = {
  HORAS_MES: 240,                    // divisor convencional CST para liquidación

  // Aportes empleado (% sobre IBC)
  SALUD_EMPLEADO: 0.04,              // Art. 204 Ley 100/1993 (mod. Ley 1122/2007)
  PENSION_EMPLEADO: 0.04,            // Art. 20 Ley 797/2003

  // Aportes empleador (% sobre IBC)
  SALUD_EMPRESA: 0.085,              // Art. 204 Ley 100/1993
  PENSION_EMPRESA: 0.12,             // Art. 20 Ley 797/2003
  CAJA_COMPENSACION: 0.04,           // Ley 21/1982
  SENA: 0.02,                        // Ley 21/1982
  ICBF: 0.03,                        // Ley 89/1988

  // ARL — Decreto 1295/1994 + Decreto 1607/2002 (clasificación)
  ARL_TARIFAS: { 1: 0.00522, 2: 0.01044, 3: 0.02436, 4: 0.04350, 5: 0.06960 },

  // Recargos y horas extras — Arts. 168, 179, 180 CST.
  // OJO: los DOMINICALES son graduales (Ley 2466/2025: 80% jul-2025, 90%
  // jul-2026, 100% jul-2027) — liquidarEmpleado los toma de
  // shared/jornada-laboral.js por fecha; estos valores son solo FALLBACK
  // (régimen pre-reforma) si ese módulo no está cargado.
  HE_DIURNA: 1.25,
  HE_NOCTURNA: 1.75,
  HE_DOM_DIURNA: 2.00,
  HE_DOM_NOCTURNA: 2.50,
  RECARGO_NOCTURNO: 0.35,
  RECARGO_DOM_DIURNO: 0.75,
  RECARGO_DOM_NOCTURNO: 1.10,

  // Topes IBC (en SMLMV)
  IBC_MIN_SMLMV: 1,                  // Art. 18 Ley 100/1993
  IBC_MAX_SMLMV: 25,                 // Art. 5 Ley 797/2003

  // Auxilio de transporte: aplica si salario ≤ 2 SMLMV (Ley 15/1959)
  TOPE_AUX_SMLMV: 2,

  // Fondo solidaridad pensional (Art. 20 Ley 797/2003)
  FONDO_SOLID_TOPE_SMLMV: 4,

  // Incapacidad EG (Decreto 2943/2013 + Art. 227 CST)
  INCAP_DIAS_EMPRESA: 2,
  INCAP_FACTOR_EPS: 0.6667,

  // Renta exenta laboral (Art. 206 num 10 ET, mod. Ley 2277/2022 art. 7)
  RENTA_EXENTA_PCT: 0.25,
  RENTA_EXENTA_TOPE_UVT_ANUAL: 790,

  // Exoneración Art. 114-1 ET
  TOPE_EXONERACION_SMLMV: 10,

  // Art. 30 Ley 1393/2010: pagos no salariales no pueden exceder 40% del total
  // remuneración para efectos de IBC en seguridad social.
  TOPE_NO_SALARIAL_LEY_1393: 0.40,

  // Topes Art. 387 ET — deducciones mensuales en UVT
  ART_387_DEPENDIENTES_PCT: 0.10,    // 10% del ingreso bruto
  ART_387_DEPENDIENTES_TOPE_UVT: 32,
  ART_387_INTERESES_VIVIENDA_TOPE_UVT: 100,
  ART_387_MEDICINA_PREP_TOPE_UVT: 16,

  // Topes ET aportes voluntarios — Arts. 126-1 y 126-4
  // El total de AFC + voluntarios + obligatorios voluntarios no puede superar
  // el 30% del ingreso laboral (con tope 3.800 UVT/año = ~316 UVT/mes).
  ART_126_TOTAL_PCT_INGRESO: 0.30,
  ART_126_TOTAL_TOPE_UVT_MES: 3800 / 12,  // ~316.67

  // Máximos HE — Ley 50/1990 Art. 22 (referencia para validación)
  HE_MAX_DIA: 2,
  HE_MAX_SEMANA: 12,
  SEMANAS_MES_PROMEDIO: 4.33,

  // Tabla retención salarios (Art. 383 ET, mod. Ley 1819/2016)
  TABLA_RETENCION: [
    { hasta: 95,       tarifa: 0.00, base: 0,    acum: 0 },
    { hasta: 150,      tarifa: 0.19, base: 95,   acum: 0 },
    { hasta: 360,      tarifa: 0.28, base: 150,  acum: (150 - 95) * 0.19 },
    { hasta: 640,      tarifa: 0.33, base: 360,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 },
    { hasta: 945,      tarifa: 0.35, base: 640,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 },
    { hasta: 2300,     tarifa: 0.37, base: 945,  acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 + (945 - 640) * 0.35 },
    { hasta: Infinity, tarifa: 0.39, base: 2300, acum: (150 - 95) * 0.19 + (360 - 150) * 0.28 + (640 - 360) * 0.33 + (945 - 640) * 0.35 + (2300 - 945) * 0.37 },
  ],
};

function getParamsNomina(anio) {
  return PARAMS_NOMINA[anio] || PARAMS_NOMINA[2026];
}

/* ─── Salario por hora — Art. 161 CST + práctica reiterada
   El divisor sigue la jornada máxima vigente (Ley 2101/2021): 220 h/mes con
   44 h/sem hasta el 14-jul-2026, 210 h/mes con 42 h/sem desde el 15-jul-2026.
   Lo resuelve shared/jornada-laboral.js por fecha (fallback: CONST 240 si el
   módulo no está cargado). El salario mensual NO se reduce por la reducción
   de jornada (parágrafo Art. 3 Ley 2101/2021) — por eso la hora se ENCARECE.
*/
function divisorHorasMes() {
  if (typeof jornadaLaboral !== 'undefined') return jornadaLaboral.getParams().horasMes;
  return CONST_NOMINA.HORAS_MES;
}
function salarioHora(salarioBase) {
  return salarioBase / divisorHorasMes();
}

/* ─── Salario por día = salario / 30 — convención CST */
function salarioDia(salarioBase) {
  return salarioBase / 30;
}

/* ─── Auxilio de transporte — Decreto MinTrabajo + Ley 15/1959 Art. 2
   Aplica solo a empleados que devenguen hasta 2 SMLMV.
   No es factor salarial (Art. 7 Ley 1/1963).
   Modos: AUTO (regla automática), MANUAL (subsidio especial pactado),
          NO (salario integral o causal de no aplicación).
*/
function calcAuxTransporte(salarioBase, modo, valorManual, anio) {
  var p = getParamsNomina(anio);
  if (modo === 'NO') return 0;
  if (modo === 'MANUAL') return valorManual || 0;
  return salarioBase <= p.SMLMV * CONST_NOMINA.TOPE_AUX_SMLMV ? p.AUX : 0;
}

/* ─── Hora extra o recargo — Art. 168, 179, 180 CST */
function calcExtraOrRecargo(salarioBase, horas, factor) {
  return Math.round(salarioHora(salarioBase) * factor * (horas || 0));
}

/* ─── Vacaciones disfrutadas — Arts. 186-189 + 192 CST
   Día = salario base / 30 (sin auxilio de transporte).
*/
function calcVacaciones(salarioBase, dias) {
  return Math.round(salarioDia(salarioBase) * (dias || 0));
}

/* ─── Incapacidad por enfermedad general (EG)
   Decreto 2943/2013: días 1-2 al 100% empresa; del día 3 al 66.67% EPS
   (Art. 227 CST). Piso legal: el auxilio diario no puede ser inferior al
   SMLMV diario (Art. 207 Ley 100; reiterado por Mintrabajo) — se aplica
   cuando se pasa `anio`. Para minisalarios la incapacidad termina pagando
   el mínimo aunque el 66.67% sea menor.
*/
function calcIncapacidad(salarioBase, dias, anio) {
  dias = dias || 0;
  var diaSal = salarioDia(salarioBase);
  var diasEmpresa = Math.min(dias, CONST_NOMINA.INCAP_DIAS_EMPRESA);
  var diasEps = Math.max(dias - CONST_NOMINA.INCAP_DIAS_EMPRESA, 0);
  var diaEps = diaSal * CONST_NOMINA.INCAP_FACTOR_EPS;
  if (anio) {
    var pisoDia = getParamsNomina(anio).SMLMV / 30;
    if (diaEps < pisoDia) diaEps = pisoDia;       // subsidio no inferior al SMLMV diario
  }
  return Math.round(diaSal * diasEmpresa + diaEps * diasEps);
}

/* ─── Incapacidad por accidente de trabajo / enfermedad laboral (ATEL)
   Decreto 1295/1994: la ARL paga el 100% del IBC desde el día 1.
*/
function calcIncapacidadLaboral(salarioBase, dias) {
  return Math.round(salarioDia(salarioBase) * (dias || 0));
}

/* ─── Licencia remunerada al 100% (maternidad 18 sem, paternidad 2 sem, luto
   5 días hábiles). Se liquida sobre el salario diario; maternidad/paternidad
   las reembolsa la EPS, el luto lo asume el empleador (Art. 1 Ley 1280/2009).
*/
function calcLicenciaRemunerada(salarioBase, dias) {
  return Math.round(salarioDia(salarioBase) * (dias || 0));
}

/* ─── Provisión mensual de prestaciones sociales ───
   Factores convencionales: cesantías 8,33% (1/12), intereses sobre cesantías
   1% (12% anual del 8,33%), prima 8,33%, vacaciones 4,17% (15 días / 360).
   Base cesantías/prima = salario + auxilio de transporte + constitutivos
   variables. Base vacaciones = salario constitutivo SIN auxilio (Art. 192 CST).
   La causación mensual de la nómina provisiona estos pasivos aunque se paguen
   después; alimenta el asiento contable. */
function calcProvisiones(baseConAux, baseSinAux) {
  baseConAux = baseConAux || 0;
  baseSinAux = baseSinAux || 0;
  var ces  = Math.round(baseConAux * 0.0833);
  var intC = Math.round(baseConAux * 0.0100);
  var prima = Math.round(baseConAux * 0.0833);
  var vac  = Math.round(baseSinAux * 0.0417);
  return {
    cesantias: ces, intereses: intC, prima: prima, vacaciones: vac,
    total: ces + intC + prima + vac,
  };
}

/* ─── Exceso Ley 1393/2010 Art. 30
   Si los pagos NO salariales superan el 40% del total remuneración, el exceso
   suma al IBC para EFECTOS DE SEGURIDAD SOCIAL (salud, pensión, ARL, fondo
   solid). NO suma al IBC de parafiscales (SENA/ICBF/Caja) según Sentencia de
   Unificación CE 2022 — los parafiscales rigen por Ley 21/82 (solo lo
   constitutivo de salario).
   Aux transporte y alimentación entregados por mera liberalidad NO se cuentan
   en el cálculo del 40% (Art. 128 CST).
*/
function calcExcesoLey1393(devengoSalarial, devengoNoSalarial) {
  devengoSalarial = devengoSalarial || 0;
  devengoNoSalarial = devengoNoSalarial || 0;
  var totalRemuneracion = devengoSalarial + devengoNoSalarial;
  if (totalRemuneracion <= 0) return 0;
  var tope = totalRemuneracion * CONST_NOMINA.TOPE_NO_SALARIAL_LEY_1393;
  return Math.max(0, devengoNoSalarial - tope);
}

/* ─── Aplica topes a IBC (1-25 SMLMV) — Art. 18 Ley 100/93 + Art. 5 Ley 797/03.
   En periodos parciales (ingreso/retiro a mitad de mes, días < 30) el piso y
   el techo se prorratean por los días reportados: el mínimo legal se aplica
   proporcionalmente al período inferior a un mes (Decreto 1833/2016 + reglas
   PILA; confirmado Actualícese 2026). Mes completo (dias=30) → sin cambio. */
function aplicarTopesIBC(valor, anio, dias) {
  var p = getParamsNomina(anio);
  var f = (dias != null && dias > 0 && dias < 30) ? dias / 30 : 1;
  return Math.max(Math.round(p.SMLMV * CONST_NOMINA.IBC_MIN_SMLMV * f),
                   Math.min(Math.round(p.SMLMV * CONST_NOMINA.IBC_MAX_SMLMV * f), valor));
}

/* ─── IBC genérico (legacy) — usado por tests y consumidores antiguos.
   IBC = devengado − aux transporte − no salariales no constitutivos
*/
function calcIBC(totalDevengado, auxTransporte, noConstitutivo, anio, dias) {
  return aplicarTopesIBC(totalDevengado - auxTransporte - (noConstitutivo || 0), anio, dias);
}

/* ─── Fondo de solidaridad pensional — Art. 20 Ley 797/2003 */
function calcFondoSolidaridad(ibc, anio) {
  var p = getParamsNomina(anio);
  var smlmvs = ibc / p.SMLMV;
  if (smlmvs <= CONST_NOMINA.FONDO_SOLID_TOPE_SMLMV) return 0;
  var tasa = 0.01;
  if (smlmvs > 20) tasa = 0.020;
  else if (smlmvs > 19) tasa = 0.018;
  else if (smlmvs > 18) tasa = 0.016;
  else if (smlmvs > 17) tasa = 0.014;
  else if (smlmvs > 16) tasa = 0.012;
  return Math.round(ibc * tasa);
}

/* ─── Deducciones Art. 387 ET (depuración para retención fuente)
   Recibe ingreso bruto sin aux transporte y un objeto deducciones con:
     · dependientes (boolean): aplica 10% del ingreso, máx 32 UVT
     · interesesVivienda: pesos/mes, tope 100 UVT
     · medicinaPrepagada: pesos/mes, tope 16 UVT
     · aportesAFC: pesos/mes (Art. 126-4 ET) — incluye en tope 30% / 316 UVT
     · pensionVoluntaria: pesos/mes (Art. 126-1 ET) — incluye en tope 30% / 316 UVT
   Devuelve { dependientes, interesesVivienda, medicinaPrepagada,
              afc, pensionVoluntaria, total }
*/
function calcDeduccionesArt387(ingresoSinAux, deducciones, anio) {
  var p = getParamsNomina(anio);
  var d = deducciones || {};

  var depDependientes = d.dependientes
    ? Math.min(ingresoSinAux * CONST_NOMINA.ART_387_DEPENDIENTES_PCT,
               CONST_NOMINA.ART_387_DEPENDIENTES_TOPE_UVT * p.UVT)
    : 0;
  var depInteresesViv = Math.min(d.interesesVivienda || 0,
                                  CONST_NOMINA.ART_387_INTERESES_VIVIENDA_TOPE_UVT * p.UVT);
  var depMedicinaPrep = Math.min(d.medicinaPrepagada || 0,
                                  CONST_NOMINA.ART_387_MEDICINA_PREP_TOPE_UVT * p.UVT);

  // Aportes voluntarios + AFC (Arts. 126-1 y 126-4 ET): no son técnicamente
  // del Art. 387 sino "renta exenta" antes del 25%, pero por simplicidad
  // aquí los tratamos como deducción del ingreso. Tope conjunto: 30% del
  // ingreso laboral, máx ~316.67 UVT/mes (3.800 UVT/año).
  var solicitadoVol = (d.aportesAFC || 0) + (d.pensionVoluntaria || 0);
  var topePctIngreso = ingresoSinAux * CONST_NOMINA.ART_126_TOTAL_PCT_INGRESO;
  var topeAbsoluto = CONST_NOMINA.ART_126_TOTAL_TOPE_UVT_MES * p.UVT;
  var deduccionVol = Math.min(solicitadoVol, topePctIngreso, topeAbsoluto);

  // Distribución proporcional entre AFC y pensión voluntaria si hay tope
  var afc = 0, pensionVol = 0;
  if (solicitadoVol > 0) {
    afc        = Math.round(deduccionVol * (d.aportesAFC || 0) / solicitadoVol);
    pensionVol = Math.round(deduccionVol * (d.pensionVoluntaria || 0) / solicitadoVol);
  }

  var total = depDependientes + depInteresesViv + depMedicinaPrep + afc + pensionVol;

  return {
    dependientes: Math.round(depDependientes),
    interesesVivienda: Math.round(depInteresesViv),
    medicinaPrepagada: Math.round(depMedicinaPrep),
    afc: afc,
    pensionVoluntaria: pensionVol,
    total: Math.round(total),
  };
}

/* ─── Retención en la fuente salarial — Procedimiento 1
   Art. 383 ET (mod. Ley 1819/2016) — tabla mensual en UVT.
   Base depurada (Art. 388 ET):
     ingreso laboral
       − aportes obligatorios (salud, pensión, fondo solid)
       − deducciones Art. 387 (dependientes, vivienda, prepagada, AFC, voluntarios)
       − renta exenta laboral 25% (Art. 206 num 10, máx 790 UVT/año = 65,83 UVT/mes)
*/
function calcRetencionFuente(ingresoSinAux, deduccionSalud, deduccionPension,
                              fondoSolidaridad, deducciones, anio) {
  var p = getParamsNomina(anio);

  var aportesObligatorios = deduccionSalud + deduccionPension + fondoSolidaridad;
  var ded387 = calcDeduccionesArt387(ingresoSinAux, deducciones, anio);

  var subtotal = ingresoSinAux - aportesObligatorios - ded387.total;
  if (subtotal <= 0) return 0;

  // Renta exenta 25% (tope 790 UVT/año = 65,83 UVT/mes — Ley 2277/2022)
  var rentaExenta = Math.min(subtotal * CONST_NOMINA.RENTA_EXENTA_PCT,
                              CONST_NOMINA.RENTA_EXENTA_TOPE_UVT_ANUAL * p.UVT / 12);
  var baseGravable = subtotal - rentaExenta;
  if (baseGravable <= 0) return 0;

  var baseUVT = baseGravable / p.UVT;
  for (var i = 0; i < CONST_NOMINA.TABLA_RETENCION.length; i++) {
    var rango = CONST_NOMINA.TABLA_RETENCION[i];
    if (baseUVT <= rango.hasta) {
      var exceso = Math.max(0, baseUVT - rango.base);
      return Math.round((rango.acum + exceso * rango.tarifa) * p.UVT);
    }
  }
  return 0;
}

/* ─── Aplicabilidad exoneración Art. 114-1 ET
   Ley 1819/2016 Art. 65 — empleadores SOCIEDADES y PNs CON 2+ EMPLEADOS están
   exonerados del 8.5% salud + 2% SENA + 3% ICBF por cada empleado que devengue
   MENOS de 10 SMLMV.
   PN con 1 solo empleado, ESALes, copropiedades con act mercantil → NO aplica.
   Pensión empresa (12%), ARL y Caja Compensación SIEMPRE se pagan.

   IMPORTANTE — Concepto DIAN 956 de 2024:
   Para verificar el tope de 10 SMLMV NO se cuentan los pagos no constitutivos
   de salario. Solo se cuenta el ingreso CONSTITUTIVO (salario + bonificaciones
   constitutivas + HE + recargos + comisiones + vacaciones + incapacidades).
*/
function aplicaExoneracion114_1(ingresoConstitutivo, tipoEmpleador, anio) {
  if (!tipoEmpleadorEsExonerable(tipoEmpleador)) return false;
  var p = getParamsNomina(anio);
  return ingresoConstitutivo < p.SMLMV * CONST_NOMINA.TOPE_EXONERACION_SMLMV;
}

/* ─── Validación de horas extras — Ley 50/1990 Art. 22
   Devuelve array de warnings si las horas extras del mes superan el máximo
   permitido (2 h/día · días trabajados, o 12 h/sem · 4.33 sem).
   No es un cálculo, es alerta: el empleador puede ser sancionado por exceder.
*/
function validarHorasExtras(novedades, diasTrabajados) {
  var nov = novedades || {};
  var totalHE = (nov.heDiurnas || 0) + (nov.heNocturnas || 0)
              + (nov.heDomDiurnas || 0) + (nov.heDomNocturnas || 0);
  var dias = diasTrabajados || 30;
  var topeDiario = CONST_NOMINA.HE_MAX_DIA * dias;
  var topeSemanal = CONST_NOMINA.HE_MAX_SEMANA * CONST_NOMINA.SEMANAS_MES_PROMEDIO;

  var warnings = [];
  if (totalHE > topeDiario) {
    warnings.push('HE totales (' + totalHE + 'h) exceden el máximo de 2h/día × ' +
                  dias + ' días = ' + topeDiario + 'h (Art. 22 Ley 50/1990)');
  }
  if (totalHE > topeSemanal) {
    warnings.push('HE totales (' + totalHE + 'h) exceden el máximo de 12h/sem × 4.33 ≈ ' +
                  Math.round(topeSemanal) + 'h/mes (Art. 22 Ley 50/1990)');
  }
  return warnings;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIQUIDACIÓN MENSUAL DE UN EMPLEADO
   ═══════════════════════════════════════════════════════════════════════════
   datos = {
     cedula, nombre, anio,
     salarioBase: number,                  // salario constitutivo mensual
     diasTrabajados: number (default 30),
     auxTransporteModo: 'AUTO'|'MANUAL'|'NO',
     auxTransporteValor: number (si MANUAL),
     nivelARL: 1..5,
     tipoEmpleador: 'SOCIEDAD'|'PN_2_MAS'|'PN_1'|'SIN_ANIMO_LUCRO'|'OTRO',
   }
   novedades = {
     // Constitutivos (afectan IBC SS y parafiscales) — todos en pesos
     bonificaciones, comisiones, otrosDevengados,
     // Constitutivos en HORAS — Arts. 168/179/180 CST
     heDiurnas, heNocturnas, heDomDiurnas, heDomNocturnas,
     recargoNocturno, recargoDomDiurno, recargoDomNocturno,
     // Constitutivos calculados a partir de días
     diasVacaciones, diasIncapacidad,
     // No salariales (NO IBC parafiscales; IBC SS solo lo que exceda 40% Ley 1393)
     noSalarialGravable,    // gravable para retefuente, no para IBC
     noSalarialNoGravable,  // ni retefuente ni IBC (viáticos, alimentación, etc.)
     // Deducciones
     libranza, embargo, otrosDescuentos,
     // Deducciones especiales para retefuente (Arts. 387, 126-1, 126-4 ET)
     deducciones: {
       dependientes: bool, interesesVivienda, medicinaPrepagada,
       aportesAFC, pensionVoluntaria
     }
   }
*/
function liquidarEmpleadoNomina(datos, novedades) {
  var anio = datos.anio || 2026;
  var dias = datos.diasTrabajados != null ? datos.diasTrabajados : 30;
  var nov = novedades || {};
  var p = getParamsNomina(anio);

  // Salario integral (Art. 132 CST): mínimo 13 SMLMV (10 salario + 30% factor
  // prestacional). IBC y base de parafiscales = 70% (Art. 18 Ley 100, Art. 49
  // Ley 789/2002). No causa auxilio de transporte ni provisión de prestaciones
  // (ya incluidas en el factor del 30%). Nunca exonera (siempre ≥ 10 SMLMV).
  var esIntegral = datos.tipoSalario === 'INTEGRAL' || datos.salarioIntegral === true;

  // ─── Cálculos base ───
  var salBase = Math.round(datos.salarioBase * dias / 30);

  var auxBase = esIntegral ? 0 : calcAuxTransporte(datos.salarioBase, datos.auxTransporteModo || 'AUTO',
                                    datos.auxTransporteValor, anio);
  var auxTransporte = Math.round(auxBase * dias / 30);

  var sh = salarioHora(datos.salarioBase);
  // Factores dominicales por fecha (Ley 2466/2025 gradual) vía jornada-laboral.js.
  // La nómina masiva liquida el mes en curso → fecha de hoy.
  var _jl = (typeof jornadaLaboral !== 'undefined') ? jornadaLaboral.getParams() : null;
  var fHEDD = _jl ? _jl.factores.HEDD : CONST_NOMINA.HE_DOM_DIURNA;
  var fHEND = _jl ? _jl.factores.HEND : CONST_NOMINA.HE_DOM_NOCTURNA;
  var fRDD  = _jl ? (_jl.factores.RDD - 1) : CONST_NOMINA.RECARGO_DOM_DIURNO;
  var fRDN  = _jl ? (_jl.factores.RDN - 1) : CONST_NOMINA.RECARGO_DOM_NOCTURNO;
  var heDigVal     = Math.round(sh * CONST_NOMINA.HE_DIURNA          * (nov.heDiurnas || 0));
  var heNocVal     = Math.round(sh * CONST_NOMINA.HE_NOCTURNA        * (nov.heNocturnas || 0));
  var heDomDigVal  = Math.round(sh * fHEDD * (nov.heDomDiurnas || 0));
  var heDomNocVal  = Math.round(sh * fHEND * (nov.heDomNocturnas || 0));
  var recNocVal    = Math.round(sh * CONST_NOMINA.RECARGO_NOCTURNO   * (nov.recargoNocturno || 0));
  var recDomDigVal = Math.round(sh * fRDD * (nov.recargoDomDiurno || 0));
  var recDomNocVal = Math.round(sh * fRDN * (nov.recargoDomNocturno || 0));

  var vacacionesVal = calcVacaciones(datos.salarioBase, nov.diasVacaciones);
  var incapacidadVal = calcIncapacidad(datos.salarioBase, nov.diasIncapacidad, anio);
  var incapLaboralVal = calcIncapacidadLaboral(datos.salarioBase, nov.diasIncapLaboral);
  var licenciaVal = calcLicenciaRemunerada(datos.salarioBase, nov.diasLicencia);

  // Provisiones de prestaciones (causación) se calculan más abajo, una vez se
  // conoce el devengado constitutivo y el auxilio de transporte.

  var bonificaciones = nov.bonificaciones || 0;
  var comisiones = nov.comisiones || 0;
  var otrosDevengados = nov.otrosDevengados || 0;

  var noSalGravable = nov.noSalarialGravable || 0;
  var noSalNoGravable = nov.noSalarialNoGravable || 0;

  // ─── Devengado constitutivo (factor salarial — Art. 127 CST) ───
  // Excluye aux transporte y todo lo no salarial.
  var devengoConstitutivo = salBase
    + heDigVal + heNocVal + heDomDigVal + heDomNocVal
    + recNocVal + recDomDigVal + recDomNocVal
    + vacacionesVal + incapacidadVal + incapLaboralVal + licenciaVal
    + bonificaciones + comisiones + otrosDevengados;

  var totalNoSalarial = noSalGravable + noSalNoGravable;
  var totalDevengado = devengoConstitutivo + auxTransporte + totalNoSalarial;

  // ─── Provisión de prestaciones (causación mensual) ───
  // Base sin las vacaciones/incapacidad ya pagadas en el mes (esas no se
  // re-provisionan). Cesantías/prima incluyen aux transporte; vacaciones no.
  var provBase = Math.max(0, devengoConstitutivo - vacacionesVal - incapacidadVal - incapLaboralVal - licenciaVal);
  // El salario integral ya incluye las prestaciones en su factor del 30% → no se provisiona.
  var provisiones = esIntegral
    ? { cesantias: 0, intereses: 0, prima: 0, vacaciones: 0, total: 0 }
    : calcProvisiones(provBase + auxTransporte, provBase);

  // ─── IBC con ajuste Ley 1393/2010 ───
  // Para SS: IBC nominal (constitutivo) + exceso del 40% no salarial sobre total
  var excesoLey1393 = calcExcesoLey1393(devengoConstitutivo, totalNoSalarial);
  // Base del IBC: en salario integral es el 70% del devengado constitutivo.
  var baseIBC = esIntegral ? Math.round(devengoConstitutivo * 0.70) : devengoConstitutivo;
  var ibcSS = aplicarTopesIBC(baseIBC + excesoLey1393, anio, dias);
  // Para parafiscales (SENA/ICBF/Caja): solo lo constitutivo (Ley 21/82 + Sentencia CE 2022);
  // en integral también sobre el 70% (Art. 49 Ley 789/2002).
  var ibcParafiscales = aplicarTopesIBC(baseIBC, anio, dias);

  // ─── Deducciones empleado (sobre IBC SS) ───
  var deduccionSalud = Math.round(ibcSS * CONST_NOMINA.SALUD_EMPLEADO);
  var deduccionPension = Math.round(ibcSS * CONST_NOMINA.PENSION_EMPLEADO);
  var fondoSolidaridad = calcFondoSolidaridad(ibcSS, anio);

  // Retención fuente: ingreso = constitutivo + no salarial gravable (no aux, no no-grav)
  var ingresoRetefuente = devengoConstitutivo + noSalGravable;
  var retencionFuente = calcRetencionFuente(
    ingresoRetefuente, deduccionSalud, deduccionPension, fondoSolidaridad,
    nov.deducciones, anio
  );

  var libranza = nov.libranza || 0;
  var embargo = nov.embargo || 0;
  var otrosDesc = nov.otrosDescuentos || 0;

  var totalDeducciones = deduccionSalud + deduccionPension + fondoSolidaridad
    + retencionFuente + libranza + embargo + otrosDesc;

  var netoPagar = totalDevengado - totalDeducciones;

  // ─── Aportes empresa ───
  // Concepto DIAN 956/2024: el tope 10 SMLMV se calcula sobre el constitutivo,
  // sin incluir no salariales ni aux transporte. Usamos devengoConstitutivo.
  var ingresoConstitutivoMes = Math.round(devengoConstitutivo * 30 / Math.max(dias, 1));
  // ↑ proyectamos a mes completo: si trabajó 15 días la regla de 10 SMLMV sigue
  // mirando el salario PACTADO mensual, no el efectivamente devengado en días.
  // En la práctica usamos el salarioBase mensual completo:
  ingresoConstitutivoMes = datos.salarioBase + bonificaciones + comisiones
    + heDigVal + heNocVal + heDomDigVal + heDomNocVal
    + recNocVal + recDomDigVal + recDomNocVal;

  var exonerado = aplicaExoneracion114_1(ingresoConstitutivoMes, datos.tipoEmpleador, anio);

  var aporteEmpSalud   = exonerado ? 0 : Math.round(ibcSS * CONST_NOMINA.SALUD_EMPRESA);
  var aporteEmpPension = Math.round(ibcSS * CONST_NOMINA.PENSION_EMPRESA);
  var tarifaArl = CONST_NOMINA.ARL_TARIFAS[datos.nivelARL] || CONST_NOMINA.ARL_TARIFAS[1];
  var aporteArl        = Math.round(ibcSS * tarifaArl);
  var aporteCajaComp   = Math.round(ibcParafiscales * CONST_NOMINA.CAJA_COMPENSACION);
  var aporteSena       = exonerado ? 0 : Math.round(ibcParafiscales * CONST_NOMINA.SENA);
  var aporteIcbf       = exonerado ? 0 : Math.round(ibcParafiscales * CONST_NOMINA.ICBF);

  var totalAportesEmpresa = aporteEmpSalud + aporteEmpPension + aporteArl
    + aporteCajaComp + aporteSena + aporteIcbf;

  var costoTotalEmpresa = totalDevengado + totalAportesEmpresa;

  // ─── Validaciones (warnings, no errores) ───
  var warnings = validarHorasExtras(nov, dias);
  if (esIntegral && datos.salarioBase < p.SMLMV * 13) {
    warnings.push('Salario integral por debajo del mínimo legal de 13 SMLMV ('
      + (p.SMLMV * 13).toLocaleString('es-CO') + ') — Art. 132 CST.');
  }

  return {
    cedula: datos.cedula || '',
    nombre: datos.nombre || '',
    diasTrabajados: dias,
    esIntegral: esIntegral,

    // Devengados — desagregados
    salarioBase: salBase,
    auxTransporte: auxTransporte,
    heDigVal: heDigVal, heNocVal: heNocVal,
    heDomDigVal: heDomDigVal, heDomNocVal: heDomNocVal,
    recNocVal: recNocVal, recDomDigVal: recDomDigVal, recDomNocVal: recDomNocVal,
    vacacionesVal: vacacionesVal,
    incapacidadVal: incapacidadVal,
    incapLaboralVal: incapLaboralVal,
    licenciaVal: licenciaVal,
    bonificaciones: bonificaciones, comisiones: comisiones,
    otrosDevengados: otrosDevengados,
    noSalarialGravable: noSalGravable,
    noSalarialNoGravable: noSalNoGravable,
    devengoConstitutivo: devengoConstitutivo,
    totalNoSalarial: totalNoSalarial,
    totalDevengado: totalDevengado,

    // Provisión de prestaciones (causación)
    provisiones: provisiones,

    // IBCs y exceso Ley 1393
    excesoLey1393: excesoLey1393,
    ibcSS: ibcSS,
    ibcParafiscales: ibcParafiscales,
    ibc: ibcSS,  // alias legacy

    // Deducciones empleado
    deduccionSalud: deduccionSalud,
    deduccionPension: deduccionPension,
    fondoSolidaridad: fondoSolidaridad,
    retencionFuente: retencionFuente,
    libranza: libranza, embargo: embargo, otrosDesc: otrosDesc,
    totalDeducciones: totalDeducciones,

    // Neto
    netoPagar: netoPagar,

    // Aportes empresa
    exoneracion114_1: exonerado,
    aporteEmpSalud: aporteEmpSalud,
    aporteEmpPension: aporteEmpPension,
    aporteArl: aporteArl,
    aporteCajaComp: aporteCajaComp,
    aporteSena: aporteSena,
    aporteIcbf: aporteIcbf,
    totalAportesEmpresa: totalAportesEmpresa,

    costoTotalEmpresa: costoTotalEmpresa,

    // Warnings
    warnings: warnings,
  };
}

/* ─── Liquidación masiva: array plano de filas Excel → array de resultados ─── */
function liquidarNominaMasiva(filas) {
  return filas.map(function(emp) {
    var datos = {
      cedula: emp.cedula, nombre: emp.nombre, anio: emp.anio,
      salarioBase: emp.salarioBase,
      salarioIntegral: emp.salarioIntegral,
      tipoSalario: emp.tipoSalario,
      diasTrabajados: emp.diasTrabajados,
      auxTransporteModo: emp.auxTransporteModo,
      auxTransporteValor: emp.auxTransporteValor,
      nivelARL: emp.nivelARL,
      tipoEmpleador: emp.tipoEmpleador,
    };
    var novedades = {
      heDiurnas: emp.heDiurnas, heNocturnas: emp.heNocturnas,
      heDomDiurnas: emp.heDomDiurnas, heDomNocturnas: emp.heDomNocturnas,
      recargoNocturno: emp.recargoNocturno,
      recargoDomDiurno: emp.recargoDomDiurno,
      recargoDomNocturno: emp.recargoDomNocturno,
      diasVacaciones: emp.diasVacaciones,
      diasIncapacidad: emp.diasIncapacidad,
      diasIncapLaboral: emp.diasIncapLaboral,
      diasLicencia: emp.diasLicencia,
      bonificaciones: emp.bonificaciones,
      comisiones: emp.comisiones,
      otrosDevengados: emp.otrosDevengados,
      noSalarialGravable: emp.noSalarialGravable,
      noSalarialNoGravable: emp.noSalarialNoGravable,
      libranza: emp.libranza, embargo: emp.embargo,
      otrosDescuentos: emp.otrosDescuentos,
      deducciones: emp.deducciones,
    };
    return liquidarEmpleadoNomina(datos, novedades);
  });
}

/* ═══ SELF-TESTS — corre con: NominaEngine.nominaSelfTest() ═══ */
function nominaSelfTest() {
  var pass = 0, fail = 0, errors = [];
  function eq(a, b, msg) {
    if (a === b) pass++;
    else { fail++; errors.push(msg + ': esperaba ' + b + ', obtuvo ' + a); }
  }
  function near(a, b, msg, tol) {
    tol = tol || 1;
    if (Math.abs(a - b) <= tol) pass++;
    else { fail++; errors.push(msg + ': esperaba ~' + b + ', obtuvo ' + a); }
  }
  function truthy(v, msg) { eq(!!v, true, msg); }
  function falsy(v, msg) { eq(!!v, false, msg); }

  var P26 = PARAMS_NOMINA[2026];
  var SMLMV = P26.SMLMV, AUX = P26.AUX;

  // ─── Helpers básicos ───
  near(salarioHora(SMLMV), SMLMV / 240, 'salarioHora SMLMV');
  near(salarioDia(SMLMV), SMLMV / 30, 'salarioDia SMLMV');

  // ─── Aux transporte ───
  eq(calcAuxTransporte(SMLMV, 'AUTO', 0, 2026), AUX, 'aux SMLMV AUTO');
  eq(calcAuxTransporte(SMLMV * 2, 'AUTO', 0, 2026), AUX, 'aux 2 SMLMV AUTO (límite)');
  eq(calcAuxTransporte(SMLMV * 3, 'AUTO', 0, 2026), 0, 'aux > 2 SMLMV AUTO');
  eq(calcAuxTransporte(SMLMV, 'NO', 0, 2026), 0, 'aux NO');
  eq(calcAuxTransporte(SMLMV, 'MANUAL', 150000, 2026), 150000, 'aux MANUAL');

  // ─── IBC ───
  eq(calcIBC(SMLMV + AUX, AUX, 0, 2026), SMLMV, 'IBC = devengado − aux');
  eq(calcIBC(SMLMV * 30, 0, 0, 2026), SMLMV * 25, 'IBC tope 25 SMLMV');
  eq(calcIBC(800000, 100000, 0, 2026), SMLMV, 'IBC piso 1 SMLMV');

  // ─── Fondo solidaridad ───
  eq(calcFondoSolidaridad(SMLMV * 3, 2026), 0, 'fondo solid <4 SMLMV');
  eq(calcFondoSolidaridad(SMLMV * 4, 2026), 0, 'fondo solid =4 SMLMV');
  eq(calcFondoSolidaridad(SMLMV * 5, 2026), Math.round(SMLMV * 5 * 0.01), 'fondo solid 1%');
  eq(calcFondoSolidaridad(SMLMV * 22, 2026), Math.round(SMLMV * 22 * 0.02), 'fondo solid 2%');

  // ─── Incapacidad ───
  eq(calcIncapacidad(1200000, 1), 40000, 'incap 1 día');
  eq(calcIncapacidad(1200000, 2), 80000, 'incap 2 días');
  eq(calcIncapacidad(1200000, 5), Math.round(40000 * 2 + 40000 * 0.6667 * 3), 'incap 5 días (sin piso)');
  // Con piso del SMLMV diario (anio): para salario alto el 66.67% manda; para
  // mini-salario el piso del SMLMV diario sube el subsidio.
  var diaSM = SMLMV / 30;
  eq(calcIncapacidad(SMLMV, 5, 2026), Math.round(diaSM * 2 + diaSM * 3), 'incap 5 días SMLMV → piso = 100% mínimo');
  eq(calcIncapacidadLaboral(3000000, 4), Math.round(3000000 / 30 * 4), 'incap laboral ATEL 100% × 4 días');
  eq(calcLicenciaRemunerada(3000000, 14), Math.round(3000000 / 30 * 14), 'licencia 14 días 100%');

  // ─── Ley 1393/2010 — Art. 30 ───
  // Caso 1: no salarial = 0 → no exceso
  eq(calcExcesoLey1393(2000000, 0), 0, 'Ley 1393: sin no salariales');
  // Caso 2: no salarial 30% < 40% → no exceso
  eq(calcExcesoLey1393(700000, 300000), 0, 'Ley 1393: 30% no salarial');
  // Caso 3: no salarial 50% > 40% → exceso = 50% - 40% = 10% del total
  // total = 1.000.000, no salarial = 500.000, tope = 400.000, exceso = 100.000
  eq(calcExcesoLey1393(500000, 500000), 100000, 'Ley 1393: 50% genera exceso');
  // Caso 4: solo no salarial (raro pero válido): exceso = total - 40%
  eq(calcExcesoLey1393(0, 1000000), 600000, 'Ley 1393: 100% no salarial');

  // ─── Tipo empleador ───
  truthy(tipoEmpleadorEsExonerable(TIPO_EMPLEADOR.SOCIEDAD), 'tipoEmp: SOCIEDAD exonera');
  truthy(tipoEmpleadorEsExonerable(TIPO_EMPLEADOR.PN_2_MAS), 'tipoEmp: PN_2_MAS exonera');
  falsy(tipoEmpleadorEsExonerable(TIPO_EMPLEADOR.PN_1), 'tipoEmp: PN_1 NO exonera');
  falsy(tipoEmpleadorEsExonerable(TIPO_EMPLEADOR.SIN_ANIMO_LUCRO), 'tipoEmp: ESAL NO exonera');
  falsy(tipoEmpleadorEsExonerable(TIPO_EMPLEADOR.OTRO), 'tipoEmp: OTRO NO exonera');

  // ─── Exoneración 114-1 con Concepto DIAN 956/2024 ───
  // Empleado con salario 8 SMLMV constitutivo + 5 SMLMV no salarial: total 13,
  // pero solo el constitutivo cuenta para tope 10 → SÍ exonerado
  truthy(aplicaExoneracion114_1(SMLMV * 8, TIPO_EMPLEADOR.SOCIEDAD, 2026),
         'exon 114-1: 8 SMLMV constitutivo (DIAN 956)');
  // Empleado 12 SMLMV constitutivo: NO exonerado
  falsy(aplicaExoneracion114_1(SMLMV * 12, TIPO_EMPLEADOR.SOCIEDAD, 2026),
        'exon 114-1: 12 SMLMV constitutivo');
  // PN_1 nunca exonera
  falsy(aplicaExoneracion114_1(SMLMV * 5, TIPO_EMPLEADOR.PN_1, 2026),
        'exon 114-1: PN_1 nunca');

  // ─── Validación HE ───
  // 30 días, 50h HE → excede semanal (12 × 4.33 ≈ 52) pero no diario (60)
  var w50 = validarHorasExtras({ heDiurnas: 50 }, 30);
  eq(w50.length, 0, 'HE 50h en 30 días: no warning');
  // 30 días, 70h HE → excede semanal y diario
  var w70 = validarHorasExtras({ heDiurnas: 70 }, 30);
  truthy(w70.length >= 1, 'HE 70h en 30 días: warning');

  // ─── Liquidación SMLMV ───
  var r = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 1, anio: 2026 }, {}
  );
  eq(r.totalDevengado, SMLMV + AUX, 'devengado SMLMV');
  eq(r.devengoConstitutivo, SMLMV, 'constitutivo SMLMV');
  eq(r.ibcSS, SMLMV, 'IBC SS SMLMV');
  eq(r.ibcParafiscales, SMLMV, 'IBC parafis SMLMV');
  eq(r.deduccionSalud, Math.round(SMLMV * 0.04), 'salud 4%');
  eq(r.deduccionPension, Math.round(SMLMV * 0.04), 'pensión 4%');
  eq(r.fondoSolidaridad, 0, 'fondo solid SMLMV = 0');
  eq(r.retencionFuente, 0, 'retefuente SMLMV = 0');
  eq(r.netoPagar, r.totalDevengado - r.totalDeducciones, 'neto = dev − ded');

  // ─── Exoneración con tipoEmpleador SOCIEDAD ───
  var rExon = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 1,
      tipoEmpleador: 'SOCIEDAD', anio: 2026 }, {}
  );
  truthy(rExon.exoneracion114_1, 'exon flag con SOCIEDAD');
  eq(rExon.aporteEmpSalud, 0, 'exon: salud empresa = 0');
  eq(rExon.aporteSena, 0, 'exon: SENA = 0');
  eq(rExon.aporteIcbf, 0, 'exon: ICBF = 0');
  truthy(rExon.aporteEmpPension > 0, 'exon: pensión empresa SIGUE');
  truthy(rExon.aporteCajaComp > 0, 'exon: caja comp SIGUE');
  truthy(rExon.aporteArl > 0, 'exon: ARL SIGUE');

  // ─── PN_1 con bajo salario: NO exonera ───
  var rPN1 = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 1,
      tipoEmpleador: 'PN_1', anio: 2026 }, {}
  );
  falsy(rPN1.exoneracion114_1, 'PN_1: NO exonera aunque bajo salario');
  truthy(rPN1.aporteEmpSalud > 0, 'PN_1: salud empresa se paga');
  truthy(rPN1.aporteSena > 0, 'PN_1: SENA se paga');

  // ─── Empleado >= 10 SMLMV constitutivo: NO exonera ───
  var rAlto = liquidarEmpleadoNomina(
    { salarioBase: SMLMV * 10, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'SOCIEDAD', anio: 2026 }, {}
  );
  falsy(rAlto.exoneracion114_1, '>=10 SMLMV: no exonera');
  truthy(rAlto.aporteEmpSalud > 0, '>=10 SMLMV: salud empresa se paga');

  // ─── Concepto DIAN 956/2024: 8 SMLMV constitutivo + 5 SMLMV no sal → exonera ───
  var rDian956 = liquidarEmpleadoNomina(
    { salarioBase: SMLMV * 8, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'SOCIEDAD', anio: 2026 },
    { noSalarialGravable: SMLMV * 5 }
  );
  truthy(rDian956.exoneracion114_1, 'DIAN 956: 8 const + 5 no sal → exonera');

  // ─── Ley 1393 incrementa IBC SS pero no parafiscales ───
  // salario 5M constitutivo + 5M no salarial = 10M total. Tope 40% = 4M.
  // Exceso = 5M - 4M = 1M. IBC SS = 5M + 1M = 6M. IBC parafiscales = 5M.
  var r1393 = liquidarEmpleadoNomina(
    { salarioBase: 5000000, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'PN_1', anio: 2026 },
    { noSalarialGravable: 5000000 }
  );
  eq(r1393.excesoLey1393, 1000000, 'Ley 1393: exceso = 1M');
  eq(r1393.ibcSS, 6000000, 'Ley 1393: IBC SS = 6M');
  eq(r1393.ibcParafiscales, 5000000, 'Ley 1393: IBC parafis = 5M (sin exceso)');
  eq(r1393.aporteEmpPension, Math.round(6000000 * 0.12), 'Ley 1393: pensión sobre IBC SS');
  eq(r1393.aporteCajaComp, Math.round(5000000 * 0.04), 'Ley 1393: caja sobre IBC parafis');

  // ─── ARL niveles ───
  var rArl5 = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 5,
      tipoEmpleador: 'PN_1', anio: 2026 }, {}
  );
  eq(rArl5.aporteArl, Math.round(SMLMV * 0.0696), 'ARL nivel 5');

  // ─── HE diurna 2h ───
  var rHE = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'PN_1', anio: 2026 },
    { heDiurnas: 2 }
  );
  eq(rHE.heDigVal, Math.round(SMLMV / 240 * 1.25 * 2), 'HE diurna 2h');

  // ─── HE dom nocturna 3h ───
  var rDomNoc = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'PN_1', anio: 2026 },
    { heDomNocturnas: 3 }
  );
  eq(rDomNoc.heDomNocVal, Math.round(SMLMV / 240 * 2.5 * 3), 'HE dom noc 3h');

  // ─── Recargo dom diurno 8h (75%) ───
  var rRecDom = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'NO', nivelARL: 1,
      tipoEmpleador: 'PN_1', anio: 2026 },
    { recargoDomDiurno: 8 }
  );
  eq(rRecDom.recDomDigVal, Math.round(SMLMV / 240 * 0.75 * 8), 'rec dom diurno 8h');

  // ─── 15 días trabajados ───
  var rMed = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 1,
      tipoEmpleador: 'PN_1', diasTrabajados: 15, anio: 2026 }, {}
  );
  eq(rMed.salarioBase, Math.round(SMLMV * 15 / 30), 'salario 15 días');
  eq(rMed.auxTransporte, Math.round(AUX * 15 / 30), 'aux 15 días');
  eq(rMed.ibcSS, Math.round(SMLMV * 15 / 30), 'IBC SS piso prorrateado mes parcial (15 días)');

  // ─── 10 días trabajados (caso reportado): IBC, salud y pensión prorrateados ───
  var r10 = liquidarEmpleadoNomina(
    { salarioBase: SMLMV, auxTransporteModo: 'AUTO', nivelARL: 1,
      tipoEmpleador: 'PN_1', diasTrabajados: 10, anio: 2026 }, {}
  );
  var ibc10 = Math.round(SMLMV * 10 / 30);
  eq(r10.salarioBase, ibc10, 'salario 10 días prorrateado');
  eq(r10.ibcSS, ibc10, 'IBC SS 10 días prorrateado (no piso 1 SMLMV pleno)');
  eq(r10.deduccionSalud, Math.round(ibc10 * 0.04), 'salud 4% sobre IBC prorrateado 10 días');
  eq(r10.deduccionPension, Math.round(ibc10 * 0.04), 'pensión 4% sobre IBC prorrateado 10 días');

  // ─── Costo total empresa ───
  eq(r.costoTotalEmpresa, r.totalDevengado + r.totalAportesEmpresa, 'costo total empresa');

  // ─── Salario integral (Art. 132 CST) ───
  var SI = SMLMV * 14; // 14 SMLMV, válido (≥13)
  var rInt = liquidarEmpleadoNomina(
    { salarioBase: SI, tipoSalario: 'INTEGRAL', nivelARL: 1, tipoEmpleador: 'SOCIEDAD', anio: 2026 }, {}
  );
  truthy(rInt.esIntegral, 'integral: flag esIntegral');
  eq(rInt.auxTransporte, 0, 'integral: sin auxilio de transporte');
  eq(rInt.ibcSS, Math.round(SI * 0.70), 'integral: IBC SS = 70%');
  eq(rInt.ibcParafiscales, Math.round(SI * 0.70), 'integral: IBC parafiscales = 70%');
  eq(rInt.provisiones.total, 0, 'integral: sin provisión de prestaciones');
  falsy(rInt.exoneracion114_1, 'integral: nunca exonera (≥10 SMLMV)');
  eq(rInt.deduccionSalud, Math.round(Math.round(SI * 0.70) * 0.04), 'integral: salud 4% sobre 70%');
  // Integral por debajo de 13 SMLMV → warning
  var rIntBajo = liquidarEmpleadoNomina(
    { salarioBase: SMLMV * 5, tipoSalario: 'INTEGRAL', nivelARL: 1, tipoEmpleador: 'SOCIEDAD', anio: 2026 }, {}
  );
  truthy(rIntBajo.warnings.some(function(w){ return /13 SMLMV/.test(w); }), 'integral < 13 SMLMV → warning');

  // ─── Provisiones de prestaciones ───
  var prov = calcProvisiones(SMLMV + AUX, SMLMV);
  eq(prov.cesantias, Math.round((SMLMV + AUX) * 0.0833), 'provisión cesantías 8.33%');
  eq(prov.prima, Math.round((SMLMV + AUX) * 0.0833), 'provisión prima 8.33%');
  eq(prov.intereses, Math.round((SMLMV + AUX) * 0.01), 'provisión intereses 1%');
  eq(prov.vacaciones, Math.round(SMLMV * 0.0417), 'provisión vacaciones 4.17% (sin aux)');
  // El SMLMV con aux transporte trae provisiones en el resultado
  truthy(r.provisiones && r.provisiones.total > 0, 'liquidación incluye provisiones');
  eq(r.provisiones.cesantias, Math.round((SMLMV + AUX) * 0.0833), 'provisión cesantías en liquidación SMLMV');

  // ─── Deducciones Art. 387 ───
  var ded = calcDeduccionesArt387(SMLMV * 5, { dependientes: true }, 2026);
  near(ded.dependientes, Math.min(SMLMV * 5 * 0.10, 32 * P26.UVT), 'Art 387 dependientes', 1);
  var dedTope = calcDeduccionesArt387(SMLMV * 50,
    { dependientes: true, interesesVivienda: 999999999, medicinaPrepagada: 999999999 }, 2026);
  near(dedTope.interesesVivienda, 100 * P26.UVT, 'Art 387 vivienda tope 100 UVT', 1);
  near(dedTope.medicinaPrepagada, 16 * P26.UVT, 'Art 387 prepagada tope 16 UVT', 1);

  // ─── Liquidación masiva ───
  var masivo = liquidarNominaMasiva([
    { cedula: '1', nombre: 'T1', salarioBase: SMLMV, auxTransporteModo: 'AUTO',
      nivelARL: 1, tipoEmpleador: 'SOCIEDAD', anio: 2026 },
    { cedula: '2', nombre: 'T2', salarioBase: SMLMV * 5, auxTransporteModo: 'NO',
      nivelARL: 3, tipoEmpleador: 'PN_1', anio: 2026 },
  ]);
  eq(masivo.length, 2, 'masivo: 2 filas');
  eq(masivo[0].cedula, '1', 'masivo: cedula fila 1');
  truthy(masivo[1].fondoSolidaridad > 0, 'masivo: fila 2 fondo solid > 0');
  truthy(masivo[0].exoneracion114_1, 'masivo: SOCIEDAD exonera');
  falsy(masivo[1].exoneracion114_1, 'masivo: PN_1 no exonera');

  console.log('NominaEngine selftest: ' + pass + ' ✓  ' + fail + ' ✗');
  if (fail > 0) errors.forEach(function(e){ console.error('  ✗ ' + e); });
  return { pass: pass, fail: fail, errors: errors };
}

/* ═══ Exportación global (browser) ═══ */
if (typeof window !== 'undefined') {
  window.NominaEngine = {
    PARAMS_NOMINA: PARAMS_NOMINA,
    CONST_NOMINA: CONST_NOMINA,
    TIPO_EMPLEADOR: TIPO_EMPLEADOR,
    getParamsNomina: getParamsNomina,
    salarioHora: salarioHora,
    salarioDia: salarioDia,
    calcAuxTransporte: calcAuxTransporte,
    calcExtraOrRecargo: calcExtraOrRecargo,
    calcVacaciones: calcVacaciones,
    calcIncapacidad: calcIncapacidad,
    calcIncapacidadLaboral: calcIncapacidadLaboral,
    calcLicenciaRemunerada: calcLicenciaRemunerada,
    calcProvisiones: calcProvisiones,
    calcExcesoLey1393: calcExcesoLey1393,
    aplicarTopesIBC: aplicarTopesIBC,
    calcIBC: calcIBC,
    calcFondoSolidaridad: calcFondoSolidaridad,
    calcDeduccionesArt387: calcDeduccionesArt387,
    calcRetencionFuente: calcRetencionFuente,
    aplicaExoneracion114_1: aplicaExoneracion114_1,
    tipoEmpleadorEsExonerable: tipoEmpleadorEsExonerable,
    validarHorasExtras: validarHorasExtras,
    liquidarEmpleadoNomina: liquidarEmpleadoNomina,
    liquidarNominaMasiva: liquidarNominaMasiva,
    nominaSelfTest: nominaSelfTest,
  };
}
