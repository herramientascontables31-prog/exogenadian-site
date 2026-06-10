/**
 * ExogenaDIAN — Jornada laboral y recargos POR FECHA (chokepoint único).
 *
 * Dos leyes cambian los recargos/jornada de forma gradual:
 *   · Ley 2101/2021 (reducción de jornada — afecta el DIVISOR de la hora):
 *       hasta 14-jul-2023: 48 h/sem (240 h/mes)
 *       15-jul-2023:       47 h/sem (235 h/mes)
 *       15-jul-2024:       46 h/sem (230 h/mes)
 *       15-jul-2025:       44 h/sem (220 h/mes)
 *       15-jul-2026:       42 h/sem (210 h/mes)  ← definitiva
 *   · Ley 2466/2025 — reforma laboral (vigente 25-jun-2025):
 *       recargo dominical/festivo (Art. 179 CST): 75% → 80% (1-jul-2025)
 *         → 90% (1-jul-2026) → 100% (1-jul-2027)
 *       jornada nocturna desde las 7:00 p.m. (antes 9:00 p.m.) a partir del
 *         25-dic-2025 (6 meses después de la vigencia de la ley)
 *
 * NO cambian: HE diurna 25%, HE nocturna 75%, recargo nocturno 35% (Art. 168 CST).
 *
 * Consumidores: liquidador-horas.html, shared/nomina-engine.js (nomina-masiva).
 * Verificado 2026-06-09 contra Función Pública (Ley 2466), Actualícese y PwC.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.jornadaLaboral = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  // Acepta Date, 'YYYY-MM-DD' o nada (hoy). Devuelve 'YYYY-MM-DD' comparable.
  function iso(fecha){
    if(typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) return fecha.slice(0,10);
    var d = (fecha instanceof Date) ? fecha : new Date();
    var m = String(d.getMonth()+1), dd = String(d.getDate());
    return d.getFullYear() + '-' + (m.length<2?'0':'')+m + '-' + (dd.length<2?'0':'')+dd;
  }

  function getParams(fecha){
    var f = iso(fecha);

    // Recargo dominical/festivo — Art. 179 CST mod. Ley 2466/2025
    var dom;
    if(f < '2025-07-01') dom = 0.75;
    else if(f < '2026-07-01') dom = 0.80;
    else if(f < '2027-07-01') dom = 0.90;
    else dom = 1.00;

    // Jornada máxima — Ley 2101/2021 (divisor mensual = h/sem × 5)
    var hSem;
    if(f >= '2026-07-15') hSem = 42;
    else if(f >= '2025-07-15') hSem = 44;
    else if(f >= '2024-07-15') hSem = 46;
    else if(f >= '2023-07-15') hSem = 47;
    else hSem = 48;
    var hMes = hSem * 5;

    // Inicio de la jornada nocturna — Ley 2466/2025 (aplica desde 25-dic-2025)
    var nocturnoDesde = (f >= '2025-12-25') ? 19 : 21;

    return {
      fecha: f,
      dominicalPct: dom,
      horasSemana: hSem,
      horasMes: hMes,
      nocturnoDesde: nocturnoDesde,
      nocturnoHasta: 6,
      // Factores multiplicadores sobre la hora ordinaria (1 = hora simple).
      factores: {
        HED:  1.25,            // hora extra diurna (Art. 168 CST)
        HEN:  1.75,            // hora extra nocturna (Art. 168 CST)
        HEDD: 1 + dom + 0.25,  // HE dominical/festivo diurna
        HEND: 1 + dom + 0.75,  // HE dominical/festivo nocturna
        RDD:  1 + dom,         // hora dominical/festivo ordinaria diurna
        RN:   1.35,            // hora con recargo nocturno (Art. 168 CST)
        RDN:  1 + dom + 0.35   // hora dominical/festivo ordinaria nocturna
      },
      // Solo el recargo (sin la hora base) — para motores que pagan el recargo aparte.
      recargos: {
        HED: 0.25, HEN: 0.75, RN: 0.35,
        RDD: dom, RDN: dom + 0.35,
        HEDD: dom + 1.25 + 0,  // no usado: preferir factores
        domPct: dom
      }
    };
  }

  function horaLabel(h){
    if(h === 19) return '7:00 p.m.';
    if(h === 21) return '9:00 p.m.';
    if(h === 6)  return '6:00 a.m.';
    return h + ':00';
  }

  function pct(x){ return Math.round(x*100) + ' %'; }

  function resumen(p){
    p = p || getParams();
    return p.horasSemana + ' h/semana (divisor ' + p.horasMes + ' h/mes) · dominical/festivo +' +
      pct(p.dominicalPct) + ' · nocturno desde las ' + horaLabel(p.nocturnoDesde);
  }

  return { getParams: getParams, resumen: resumen, horaLabel: horaLabel, pct: pct };
}));
