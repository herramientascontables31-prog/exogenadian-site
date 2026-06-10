/**
 * ExogenaDIAN — Storage local para Finanzas Personales
 *
 * Persistencia sin login: todo vive en localStorage del navegador del usuario.
 * Si el usuario quiere mover datos a otro dispositivo: exportar JSON e importar.
 *
 * Claves namespaced con prefijo `fp:` para no chocar con otros modulos.
 *   fp:diagnostico        -> ultimo diagnostico (estado, ratios, fecha)
 *   fp:pyg:YYYY-MM        -> PyG mensual
 *   fp:deudas             -> array auditor de deudas
 *   fp:plan-pago          -> estrategia (avalancha/bola-nieve) + abono extra
 *   fp:perfil             -> personas a cargo, ciudad, ingreso de referencia
 *
 * Cada valor se guarda como { v: <dato>, t: <timestamp ms> } para poder mostrar
 * "guardado hace X minutos" sin parsear el dato del usuario.
 */
window.FinanzasStore = (function () {
  'use strict';

  var PREFIX = 'fp:';

  function isAvailable() {
    try {
      var k = '__fp_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  function _wrap(value) { return { v: value, t: Date.now() }; }

  function setRaw(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(_wrap(value)));
      return true;
    } catch (e) {
      console.warn('FinanzasStore.set', key, e);
      return false;
    }
  }

  function getRaw(key) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('FinanzasStore.get', key, e);
      return null;
    }
  }

  // Devuelve solo el valor (sin metadatos). Es el get que va a usar el 95% de los call sites.
  function get(key) {
    var w = getRaw(key);
    return w ? w.v : null;
  }

  function getMeta(key) {
    var w = getRaw(key);
    return w ? { savedAt: new Date(w.t) } : null;
  }

  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); return true; }
    catch (e) { return false; }
  }

  // Lista todas las claves bajo el prefijo (opcionalmente filtra por subprefijo).
  // Util para listar todos los PyG mensuales: list('pyg:') -> ['pyg:2026-01', 'pyg:2026-02', ...]
  function list(subprefix) {
    var out = [];
    var search = PREFIX + (subprefix || '');
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(search) === 0) {
        out.push(k.substring(PREFIX.length));
      }
    }
    return out.sort();
  }

  function clearAll() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) keys.push(k);
    }
    keys.forEach(function (k) { localStorage.removeItem(k); });
    return keys.length;
  }

  // === Export / import JSON (para que el usuario lleve sus datos a otro navegador) ===
  function exportAll() {
    var dump = {
      app: 'ExogenaDIAN/finanzas-personales',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {}
    };
    list().forEach(function (k) {
      dump.data[k] = getRaw(k);
    });
    return dump;
  }

  function downloadJSON(filename) {
    var dump = exportAll();
    var blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || ('finanzas-personales-' + new Date().toISOString().slice(0, 10) + '.json');
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 0);
  }

  function importAll(jsonObj) {
    if (!jsonObj || !jsonObj.data || typeof jsonObj.data !== 'object') {
      throw new Error('Archivo inválido: falta el bloque "data".');
    }
    var n = 0;
    Object.keys(jsonObj.data).forEach(function (k) {
      try {
        localStorage.setItem(PREFIX + k, JSON.stringify(jsonObj.data[k]));
        n++;
      } catch (e) { console.warn('FinanzasStore.importAll', k, e); }
    });
    return n;
  }

  // Atajos para los modelos mas comunes — opcional, evita typos en las claves.
  var keys = {
    diagnostico: 'diagnostico',
    pygMes:      function (yyyymm) { return 'pyg:' + yyyymm; },
    deudas:      'deudas',
    planPago:    'plan-pago',
    perfil:      'perfil'
  };

  return {
    isAvailable: isAvailable,
    set: setRaw,
    get: get,
    getMeta: getMeta,
    remove: remove,
    list: list,
    clear: clearAll,
    exportAll: exportAll,
    downloadJSON: downloadJSON,
    importAll: importAll,
    keys: keys
  };
})();
