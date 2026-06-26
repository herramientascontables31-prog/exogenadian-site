/* ═══ Aziendale — Motor de Cálculo Liquidación Laboral ═══
   Normativa: CST Arts. 249, 306, 186-189, 64 | Ley 52/75 | Normatividad laboral vigente 2025-2026
   Jurisprudencia CSJ, Sala Laboral — criterio reiterado sobre salario variable
*/
/* SMLMV y auxilio de transporte por año, según decretos oficiales.
   Cubre 2010-2026. Si el usuario pide un año fuera de rango, getParams
   usa el extremo más cercano (no silently 2026 como antes). */
var PARAMS = {
  2026: { SMLMV: 1750905, AUX: 249095 },
  2025: { SMLMV: 1423500, AUX: 200000 },
  2024: { SMLMV: 1300000, AUX: 162000 },
  2023: { SMLMV: 1160000, AUX: 140606 },
  2022: { SMLMV: 1000000, AUX: 117172 },
  2021: { SMLMV: 908526,  AUX: 106454 },
  2020: { SMLMV: 877803,  AUX: 102854 },
  2019: { SMLMV: 828116,  AUX: 97032  }, // Dec 2451/2452 de 2018
  2018: { SMLMV: 781242,  AUX: 88211  }, // Dec 2269/2270 de 2017
  2017: { SMLMV: 737717,  AUX: 83140  }, // Dec 2209/2210 de 2016
  2016: { SMLMV: 689455,  AUX: 77700  }, // Dec 2552/2553 de 2015
  2015: { SMLMV: 644350,  AUX: 74000  }, // Dec 2731/2732 de 2014
  2014: { SMLMV: 616000,  AUX: 72000  }, // Dec 3068/3069 de 2013
  2013: { SMLMV: 589500,  AUX: 70500  }, // Dec 2738/2739 de 2012
  2012: { SMLMV: 566700,  AUX: 67800  }, // Dec 4919/4963 de 2011
  2011: { SMLMV: 535600,  AUX: 63600  }, // Dec 033 de 2011 / Dec 4834 de 2010
  2010: { SMLMV: 515000,  AUX: 61500  }  // Dec 5053/5054 de 2009
};

function getParams(y) {
  if (PARAMS[y]) return PARAMS[y];
  // Fuera de rango: usar extremo más cercano y avisar en consola
  // (mejor que silently devolver 2026 que era el bug anterior).
  var anios = Object.keys(PARAMS).map(function(k){return parseInt(k,10);});
  var min = Math.min.apply(null, anios), max = Math.max.apply(null, anios);
  var usar = y < min ? min : (y > max ? max : max);
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('[liquidador] Año '+y+' fuera de tabla SMLMV/AUX — usando '+usar);
  }
  return PARAMS[usar];
}

/* ─── Parseo de fecha en hora LOCAL ───
   new Date("2026-01-01") interpreta el string como UTC medianoche; en
   Colombia (UTC-5) eso retrocede al día anterior y desfasa todos los días.
   Construimos la fecha con componentes locales para evitarlo. */
function parseFechaLocal(s) {
  if (s instanceof Date) return s;
  if (typeof s === 'string') {
    var p = s.split('T')[0].split('-');
    if (p.length === 3) return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  return new Date(s);
}

/* ─── Días laborados entre dos fechas (método 360, conteo INCLUSIVO) ───
   La liquidación colombiana cuenta el período de forma inclusiva: un
   trabajador del 1-ene al 30-jun laboró 180 días (6 meses), y del 1-ene
   al 31-dic, 360 días. Por eso se suma 1 a la diferencia 30/360. */
function dias360(d1, d2) {
  var y1=d1.getFullYear(), m1=d1.getMonth()+1, dd1=Math.min(d1.getDate(),30);
  var y2=d2.getFullYear(), m2=d2.getMonth()+1, dd2=Math.min(d2.getDate(),30);
  return (y2-y1)*360 + (m2-m1)*30 + (dd2-dd1) + 1;
}

/* Días reales entre fechas */
function diasReales(d1, d2) {
  return Math.round((d2-d1)/(1000*60*60*24));
}

/* ─── Período en texto ─── */
function periodoTexto(d1, d2) {
  var total = dias360(d1, d2);
  var a = Math.floor(total/360);
  var m = Math.floor((total%360)/30);
  var d = total%30;
  var t = '';
  if (a>0) t += a + (a===1?' año':' años');
  if (m>0) t += (t?', ':'') + m + (m===1?' mes':' meses');
  if (d>0) t += (t?' , ':'') + d + (d===1?' día':' días');
  return t || '0 días';
}

/* ─── Salario Base Liquidación ─── */
function calcularSBL(salario, auxTransporte, esIntegral, esVariable, promedioVariable) {
  if (esIntegral) return Math.round(salario * 0.7);
  var base = salario;
  if (esVariable) base = salario + (promedioVariable || 0);
  if (auxTransporte > 0) base += auxTransporte;
  return Math.round(base);
}

function sblVacaciones(salario, esIntegral) {
  if (esIntegral) return Math.round(salario * 0.7);
  return salario;
}

/* ─── Auxilio de transporte proporcional ─── */
function auxProporcional(aux, dias) {
  return Math.round(aux * dias / 360);
}

/* ─── Cesantías Art. 249 CST ─── */
function calcCesantias(sbl, dias) {
  return Math.round(sbl * dias / 360);
}

/* ─── Intereses sobre cesantías — Ley 52/75 ─── */
function calcIntereses(cesantias, dias) {
  return Math.round(cesantias * dias * 0.12 / 360);
}

/* ─── Prima de servicios Art. 306 CST ─── */
function calcPrima(sbl, diasSemestre) {
  return Math.round(sbl * diasSemestre / 360);
}

/* ─── Vacaciones Art. 186-189 CST ─── */
function calcVacaciones(salBasico, diasTrabajados, diasDisfrutados) {
  var diasDerecho = Math.round(diasTrabajados * 15 / 360 * 100) / 100;
  var diasPendientes = Math.max(0, diasDerecho - (diasDisfrutados || 0));
  var valor = Math.round(salBasico * diasPendientes / 30);
  return { diasDerecho: diasDerecho, diasDisfrutados: diasDisfrutados||0, diasPendientes: diasPendientes, valor: valor };
}

/* ─── Indemnización Art. 64 CST ─── */
function calcIndemnizacion(causa, tipoContrato, salario, diasTrabajados, esIntegral, fechaFin, fechaVencimiento) {
  var noAplica = ['renuncia','justa_causa','mutuo_acuerdo','vencimiento'];
  if (noAplica.indexOf(causa) >= 0) {
    var razones = {
      renuncia: 'Renuncia voluntaria — no genera indemnización',
      justa_causa: 'Despido con justa causa (Art. 62 CST) — no genera indemnización',
      mutuo_acuerdo: 'Terminación por mutuo acuerdo — no genera indemnización',
      vencimiento: 'Vencimiento del término pactado — no genera indemnización'
    };
    return { aplica: false, causa: razones[causa], dias: 0, valor: 0 };
  }

  var base = esIntegral ? Math.round(salario * 0.7) : salario;
  var diario = base / 30;
  var anios = Math.floor(diasTrabajados / 360);
  var fraccion = diasTrabajados % 360;

  // Contrato fijo u obra
  if (tipoContrato === 'fijo') {
    if (!fechaVencimiento || fechaFin >= fechaVencimiento) {
      return { aplica: false, causa: 'Contrato fijo ya vencido — no aplica indemnización', dias: 0, valor: 0 };
    }
    var diasRestantes = diasReales(fechaFin, fechaVencimiento);
    var valor = diario * diasRestantes;
    return { aplica: true, causa: 'Despido sin justa causa — contrato fijo', dias: diasRestantes, valor: Math.round(valor),
      formula: 'Salarios restantes hasta vencimiento (Art. 64 CST)' };
  }
  if (tipoContrato === 'obra') {
    // Estimación por defecto — Art. 64 CST: indemnización = salario del tiempo restante de la obra
    var diasEstimado = 60;
    var valor2 = diario * diasEstimado;
    return { aplica: true, causa: 'Despido sin justa causa — obra o labor', dias: diasEstimado, valor: Math.round(valor2),
      formula: 'Salarios hasta fin estimado de obra (Art. 64 CST — ajustar según duración real)' };
  }

  // Contrato indefinido
  var p = getParams(fechaFin ? fechaFin.getFullYear() : 2026);
  var umbral10 = p.SMLMV * 10;
  var diasIndem, formula;

  if (base < umbral10) {
    // Caso A: < 10 SMLMV
    if (anios < 1) {
      diasIndem = 30;
      formula = '30 días (primer año o fracción < 1 año)';
    } else {
      var adicionales = anios - 1;
      var fracDias = fraccion > 0 ? (20 * fraccion / 360) : 0;
      diasIndem = 30 + (20 * adicionales) + fracDias;
      formula = '30 + (20 × ' + adicionales + ' años)' + (fraccion > 0 ? ' + (20 × ' + fraccion + '/360)' : '');
    }
  } else {
    // Caso B: >= 10 SMLMV
    if (anios < 1) {
      diasIndem = 20;
      formula = '20 días (primer año o fracción — salario ≥ 10 SMLMV)';
    } else {
      var adic = anios - 1;
      var fracD = fraccion > 0 ? (15 * fraccion / 360) : 0;
      diasIndem = 20 + (15 * adic) + fracD;
      formula = '20 + (15 × ' + adic + ' años)' + (fraccion > 0 ? ' + (15 × ' + fraccion + '/360)' : '');
    }
  }

  return { aplica: true, causa: 'Despido sin justa causa — contrato indefinido', dias: Math.round(diasIndem*100)/100,
    valor: Math.round(diario * diasIndem), formula: formula };
}

/* ─── Días del semestre en curso ─── */
function diasSemestreActual(fechaFin) {
  var m = fechaFin.getMonth(); // 0-11
  var inicioSem;
  if (m < 6) {
    inicioSem = new Date(fechaFin.getFullYear(), 0, 1);
  } else {
    inicioSem = new Date(fechaFin.getFullYear(), 6, 1);
  }
  return dias360(inicioSem, fechaFin);
}

/* ─── Días del año en curso ─── */
function diasAnioActual(fechaInicio, fechaFin) {
  var inicioAnio = new Date(fechaFin.getFullYear(), 0, 1);
  var desde = fechaInicio > inicioAnio ? fechaInicio : inicioAnio;
  return dias360(desde, fechaFin);
}

/* ─── LIQUIDACIÓN COMPLETA ─── */
function liquidar(d) {
  var fi = parseFechaLocal(d.fechaInicio);
  var ff = parseFechaLocal(d.fechaFin);
  var anioFin = ff.getFullYear();
  var p = getParams(anioFin);

  // Modalidad de pago: 'mensual' (default) o 'jornal' (pago por día)
  var modalidad = d.modalidadPago === 'jornal' ? 'jornal' : 'mensual';
  var jornal = d.jornal || 0;
  var diasEfectivos = d.diasEfectivos || 0;

  // Si es jornal: salario mensual equivalente = jornal × 30
  var salario = modalidad === 'jornal' ? Math.round(jornal * 30) : d.salario;
  var esIntegral = modalidad === 'jornal' ? false : d.tipoSalario === 'integral';
  var esVariable = d.esVariable && d.promedioVariable > 0;

  // Auxilio de transporte
  var auxTrans = 0;
  if (!esIntegral && salario <= p.SMLMV * 2) {
    auxTrans = p.AUX;
  }

  // Días
  var diasCalendario = dias360(fi, ff);
  var diasTotal, diasAnio, diasSem;

  if (modalidad === 'jornal' && diasEfectivos > 0) {
    // En modo jornal (empleada doméstica por días) se asume liquidación final
    // sobre todo el período trabajado, sin topes semestrales o anuales:
    // las prestaciones son proporcionales al total de días efectivos.
    diasTotal = diasEfectivos;
    diasAnio = diasEfectivos;
    diasSem = diasEfectivos;
  } else {
    diasTotal = diasCalendario;
    diasAnio = diasAnioActual(fi, ff);
    diasSem = diasSemestreActual(ff);
    // Ajustar si el contrato empezó después del inicio del semestre
    var inicioSem = ff.getMonth() < 6 ? new Date(anioFin,0,1) : new Date(anioFin,6,1);
    if (fi > inicioSem) diasSem = dias360(fi, ff);
    // Ajustar si empezó después del inicio del año
    var inicioAnio = new Date(anioFin,0,1);
    if (fi > inicioAnio) diasAnio = diasTotal;
  }

  // Detección trabajador ocasional (Art. 6 CST)
  var esOcasional = modalidad === 'jornal' && diasTotal < 30;

  // SBL
  var sblCesPrima = calcularSBL(salario, auxTrans, esIntegral, esVariable, d.promedioVariable);
  var sblVac = sblVacaciones(salario, esIntegral);

  // Prestaciones
  var cesantias = calcCesantias(sblCesPrima, diasAnio);
  var intereses = calcIntereses(cesantias, diasAnio);
  var prima = calcPrima(sblCesPrima, diasSem);
  // Vacaciones: 3 modos
  var vac;
  if (d.vacMode === 'pendientes') {
    // Usuario ingresó directamente los días pendientes
    var diasPend = d.diasVacPendientes || 0;
    var diasDer = Math.round(diasTotal * 15 / 360 * 100) / 100;
    vac = { diasDerecho: diasDer, diasDisfrutados: Math.max(0, diasDer - diasPend), diasPendientes: diasPend, valor: Math.round(sblVac * diasPend / 30) };
  } else if (d.vacMode === 'ninguna') {
    // No ha salido a vacaciones → todo pendiente
    vac = calcVacaciones(sblVac, diasTotal, 0);
  } else {
    // Modo por defecto: días disfrutados
    vac = calcVacaciones(sblVac, diasTotal, d.diasVacDisfrutados || 0);
  }

  // Salario proporcional último mes / pago por jornal
  var diaDelMes, salDiario, salProporcional, auxProp;
  if (modalidad === 'jornal') {
    // En jornal: el "salario proporcional" = jornal × días del último período pagado
    // Por simplicidad, asumimos que se está liquidando todo (no hay último mes pendiente)
    // pero permitimos mostrarlo como jornal × días efectivos del último período
    diaDelMes = 0;
    salDiario = jornal;
    salProporcional = 0;
    auxProp = 0;
  } else {
    diaDelMes = ff.getDate();
    salDiario = (esIntegral ? Math.round(salario*0.7) : salario) / 30;
    salProporcional = Math.round(salDiario * diaDelMes);
    auxProp = auxTrans > 0 ? Math.round(auxTrans * diaDelMes / 30) : 0;
  }

  // Indemnización
  var fv = d.fechaVencimiento ? parseFechaLocal(d.fechaVencimiento) : null;
  var indem = calcIndemnizacion(d.causa, d.tipoContrato, salario, diasTotal, esIntegral, ff, fv);

  // Deducciones
  var anticipos = d.anticiposCesantias || 0;
  var prestamos = d.prestamos || 0;

  // Totales
  var subtotal = cesantias + intereses + prima + vac.valor + salProporcional + auxProp;
  if (indem.aplica) subtotal += indem.valor;
  var deducciones = anticipos + prestamos;
  var total = subtotal - deducciones;

  return {
    empleado: d.empleado || '',
    empleador: d.empleador || '',
    nitEmpleador: d.nitEmpleador || '',
    cargo: d.cargo || '',
    tipoContrato: d.tipoContrato,
    causa: d.causa,
    fechaInicio: fi,
    fechaFin: ff,
    diasTotal: diasTotal,
    diasCalendario: diasCalendario,
    diasAnio: diasAnio,
    diasSemestre: diasSem,
    periodoTexto: periodoTexto(fi, ff),
    modalidad: modalidad,
    jornal: jornal,
    diasEfectivos: diasEfectivos,
    esOcasional: esOcasional,
    salario: salario,
    esIntegral: esIntegral,
    auxTransporte: auxTrans,
    auxProporcional: auxProp,
    sblCesPrima: sblCesPrima,
    sblVac: sblVac,
    cesantias: cesantias,
    intereses: intereses,
    prima: prima,
    vacaciones: vac,
    salProporcional: salProporcional,
    salDiario: salDiario,
    diaDelMes: diaDelMes,
    indemnizacion: indem,
    anticipos: anticipos,
    prestamos: prestamos,
    subtotal: subtotal,
    deducciones: deducciones,
    total: total,
    anioLiq: anioFin,
    params: p,
    normativa: getNormativa(indem.aplica, esIntegral, esVariable, modalidad === 'jornal', esOcasional)
  };
}

function getNormativa(hayIndem, integral, variable, esJornal, esOcasional) {
  var n = ['Art. 249 CST — Cesantías','Ley 52/1975 — Intereses sobre cesantías',
    'Arts. 186-189 CST — Vacaciones'];
  if (esJornal) {
    n.push('Ley 1788/2016 — Prima de servicios para trabajadoras del servicio doméstico');
    n.push('Sentencia C-871/2014 — Igualdad de derechos prestacionales del servicio doméstico');
    n.push('Decreto 824/1988 — Régimen especial de trabajadores del servicio doméstico');
    n.push('Decreto 2616/2013 — Cotización por días al sistema de seguridad social');
    n.push('Art. 133 CST — Salario estipulado por días (jornal)');
  } else {
    n.push('Art. 306 CST — Prima de servicios');
  }
  if (hayIndem) n.push('Art. 64 CST — Indemnización por despido sin justa causa');
  if (integral) n.push('Art. 132 CST — Salario integral');
  if (variable) n.push('Jurisprudencia CSJ, Sala Laboral — criterio reiterado sobre salario variable');
  n.push('Normatividad laboral vigente 2025-2026');
  return n;
}

/* ─── Formato COP ─── */
function fCOP(n) {
  if (n == null || isNaN(n)) return '$0';
  return '$' + Math.round(n).toLocaleString('es-CO');
}

function fNum(n) {
  return Math.round(n).toLocaleString('es-CO');
}
