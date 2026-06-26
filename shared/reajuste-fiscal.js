/**
 * Aziendale — Reajuste fiscal del costo de activos fijos (Art. 70 ET)
 *
 * El Art. 70 ET permite (de forma VOLUNTARIA) ajustar el costo fiscal de los
 * bienes muebles e inmuebles con carácter de activos fijos, en el porcentaje
 * que fija anualmente el Gobierno (Art. 868 ET) por decreto.
 *
 * Porcentajes verificados (fuente: decretos reglamentarios):
 *   - AG 2025: 5.81%  (Decreto 449 de 2026)
 *   - AG 2024: 10.97% (Decreto 128 de 2024)
 * Para años anteriores el reajuste es acumulativo; usar la tabla histórica
 * oficial (no se incluyen aquí porcentajes sin verificar).
 *
 * Efecto: el mayor valor por reajuste incrementa el costo fiscal (y el valor
 * patrimonial) del activo, y el costo base para ganancia ocasional al venderlo.
 * NO genera renta por sí mismo.
 *
 * Puro: no toca el DOM.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.reajusteFiscal = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  // Porcentaje de reajuste por año gravable (solo años con decreto verificado).
  var PCT = {
    2024: 10.97,
    2025: 5.81
  };

  function porcentaje(year){ return PCT[year] != null ? PCT[year] : null; }

  /**
   * Reajusta un costo fiscal aplicando el porcentaje del año indicado.
   * @param costoFiscal  costo fiscal vigente del activo (ya con reajustes previos)
   * @param year         año gravable cuyo porcentaje se aplica (default 2025)
   * @returns {{ pct, costoOriginal, costoReajustado, mayorValor, year, verificado }}
   */
  function reajustar(costoFiscal, year){
    year = year || 2025;
    var pct = porcentaje(year);
    var costo = Math.max(0, costoFiscal || 0);
    if(pct == null){
      return { pct:null, costoOriginal:costo, costoReajustado:costo, mayorValor:0, year:year, verificado:false };
    }
    var mayorValor = Math.round(costo * pct / 100);
    return {
      pct: pct,
      costoOriginal: costo,
      costoReajustado: costo + mayorValor,
      mayorValor: mayorValor,
      year: year,
      verificado: true
    };
  }

  return { reajustar: reajustar, porcentaje: porcentaje, PCT: PCT };
}));
