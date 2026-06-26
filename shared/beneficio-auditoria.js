/**
 * Aziendale — Beneficio de auditoría (Art. 689-3 ET)
 *
 * Determina si una declaración de renta PN puede acogerse al beneficio de
 * auditoría (firmeza reducida a 6 ó 12 meses) comparando el impuesto neto de
 * renta del año gravable contra el del año inmediatamente anterior.
 *
 * Norma:
 *   - Art. 689-3 ET, prorrogado por el Art. 69 de la Ley 2294 de 2023 para los
 *     años gravables 2024, 2025 y 2026.
 *   - Firmeza 6 meses si el impuesto neto de renta se incrementa ≥ 35% frente
 *     al del año anterior; 12 meses si el incremento es ≥ 25% (y < 35%).
 *   - NO procede si el impuesto neto de renta del año BASE (anterior) es inferior
 *     a 71 UVT.
 *   - Requisitos adicionales (no calculables aquí, se advierten): presentación
 *     oportuna y pago total dentro de los plazos.
 *
 * Puro: no toca el DOM.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.beneficioAuditoria = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  var MIN_UVT_BASE = 71;       // Art. 689-3: impuesto neto año base ≥ 71 UVT
  var PCT_6_MESES  = 0.35;     // ≥35% → firmeza 6 meses
  var PCT_12_MESES = 0.25;     // ≥25% → firmeza 12 meses

  /**
   * @param impuestoNetoActual   c126 del año que se declara
   * @param impuestoNetoAnterior c126 del año inmediatamente anterior
   * @param uvtBase              valor de la UVT del año BASE (anterior)
   * @returns {{
   *   evaluable, aplica, meses, incrementoPct, minBasePesos, baseSuficiente,
   *   faltaParaIncremento, mensaje, requisitos:[]
   * }}
   */
  function evaluar(impuestoNetoActual, impuestoNetoAnterior, uvtBase){
    var act = Math.max(0, impuestoNetoActual || 0);
    var ant = Math.max(0, impuestoNetoAnterior || 0);
    var minBase = Math.round(MIN_UVT_BASE * (uvtBase || 0));
    var requisitos = [
      'Presentar la declaración dentro del plazo (oportuna).',
      'Pagar el total dentro de los plazos fijados por el Gobierno.'
    ];

    if(ant <= 0){
      return { evaluable:false, aplica:false, meses:null, incrementoPct:null, minBasePesos:minBase,
        baseSuficiente:null, faltaParaIncremento:null,
        mensaje:'Ingresa el impuesto neto de renta del año anterior (c126 AG-1) para evaluar el beneficio de auditoría.',
        requisitos:requisitos };
    }

    var baseSuficiente = ant >= minBase;
    var incrementoPct = (act - ant) / ant;
    var meta12 = ant * (1 + PCT_12_MESES);
    var meta6  = ant * (1 + PCT_6_MESES);

    if(!baseSuficiente){
      return { evaluable:true, aplica:false, meses:null, incrementoPct:incrementoPct, minBasePesos:minBase,
        baseSuficiente:false, faltaParaIncremento:null,
        mensaje:'No procede: el impuesto neto del año anterior (' + fmt(ant) + ') es inferior a 71 UVT (' + fmt(minBase) + '). El Art. 689-3 exige una base mínima.',
        requisitos:requisitos };
    }

    var meses = null;
    if(incrementoPct >= PCT_6_MESES) meses = 6;
    else if(incrementoPct >= PCT_12_MESES) meses = 12;

    if(meses){
      return { evaluable:true, aplica:true, meses:meses, incrementoPct:incrementoPct, minBasePesos:minBase,
        baseSuficiente:true, faltaParaIncremento:0,
        mensaje:'La declaración puede acogerse al beneficio de auditoría: firmeza en ' + meses + ' meses (incremento del impuesto neto: ' + (incrementoPct*100).toFixed(1) + '%).',
        requisitos:requisitos };
    }

    // No alcanza el 25% — cuánto impuesto neto adicional haría falta
    var faltaParaIncremento = Math.max(0, Math.ceil(meta12) - act);
    return { evaluable:true, aplica:false, meses:null, incrementoPct:incrementoPct, minBasePesos:minBase,
      baseSuficiente:true, faltaParaIncremento:faltaParaIncremento,
      mensaje:'Aún no aplica: el incremento es ' + (incrementoPct*100).toFixed(1) + '% (mínimo 25%). El impuesto neto debería llegar a ' + fmt(Math.ceil(meta12)) + ' para firmeza de 12 meses, o ' + fmt(Math.ceil(meta6)) + ' para 6 meses.',
      requisitos:requisitos };
  }

  function fmt(n){ return '$ ' + Math.round(n||0).toLocaleString('es-CO'); }

  return { evaluar: evaluar, MIN_UVT_BASE: MIN_UVT_BASE, PCT_6_MESES: PCT_6_MESES, PCT_12_MESES: PCT_12_MESES };
}));
