/**
 * ExogenaDIAN — Canonicalización de inputs para hash de auditoría
 *
 * Construye una representación determinística (string JSON con claves ordenadas
 * recursivamente, sin espacios) del estado del wizard + año gravable + UVT del
 * año + versión del motor. El hash SHA-256 de este string es el "Hash de inputs"
 * que aparece en la carátula del Excel papel de trabajo.
 *
 * Propiedad clave: mismo input + mismo motor = mismo hash. Detecta cambios de
 * datos pero NO se invalida por cambios cosméticos (formato, fecha de
 * exportación, orden de inserción de claves).
 *
 * Uso:
 *   const c = canonicalizeInputs.canonicalize(estado, year, paramsDelAño);
 *   const h = await sha256Hex(c); // browser usa crypto.subtle, node usa node:crypto
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.canonicalizeInputs = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  /** Versión del motor + UI. Subir manualmente cuando cambie la lógica de cálculo. */
  var MOTOR_VERSION = 'v2025.1';

  /** Recorre el objeto y devuelve uno nuevo con claves ordenadas alfabéticamente. */
  function canonicalizar(obj){
    if(obj === null || obj === undefined) return null;
    if(typeof obj !== 'object') return obj;
    if(Array.isArray(obj)) return obj.map(canonicalizar);
    var keys = Object.keys(obj).sort();
    var result = {};
    for(var i = 0; i < keys.length; i++){
      result[keys[i]] = canonicalizar(obj[keys[i]]);
    }
    return result;
  }

  /**
   * Construye el string canónico para hashear.
   * @param {object} estado - Estado del wizard (output de construirEstado().estado)
   * @param {number} year - Año gravable
   * @param {object} params - Parámetros del año (output de paramsRentaPN.getParams)
   * @returns {string} JSON canónico
   */
  function canonicalize(estado, year, params){
    var input = {
      motorVersion: MOTOR_VERSION,
      year: year,
      uvt: (params && typeof params.uvt === 'number') ? params.uvt : null,
      estado: estado
    };
    return JSON.stringify(canonicalizar(input));
  }

  return {
    canonicalize: canonicalize,
    MOTOR_VERSION: MOTOR_VERSION,
    _internal: { canonicalizar: canonicalizar }
  };
}));
