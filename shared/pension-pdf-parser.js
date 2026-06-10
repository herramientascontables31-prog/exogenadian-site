/**
 * ExogenaDIAN — Parser de extractos de pensión (Colpensiones + AFPs)
 *
 * Detecta automáticamente el fondo desde el contenido del PDF y extrae:
 *   semanas cotizadas, IBC promedio últimos 12 meses, sexo, edad
 *
 * Fase 1: Colpensiones (RPM) — formato HLM oficial, parser completo.
 * Fase 2: Porvenir, Protección, Colfondos, Skandia (RAIS) — pendientes de
 *         samples reales de "Extracto de cuenta individual obligatoria".
 *
 * pdf.js se carga lazy desde unpkg solo al primer uso para no inflar la
 * página. Manejo de PDFs cifrados: el caller pasa el password por opciones.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.PensionPDFParser = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  var PDFJS_VER = '4.0.379';
  var PDFJS_BASE = 'https://unpkg.com/pdfjs-dist@' + PDFJS_VER + '/build/';
  var pdfjsLib = null;

  function loadPdfJs(){
    if(pdfjsLib) return Promise.resolve(pdfjsLib);
    return import(PDFJS_BASE + 'pdf.min.mjs').then(function(mod){
      pdfjsLib = mod;
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.min.mjs';
      return pdfjsLib;
    });
  }

  function normalizar(s){
    return (s||'').replace(/ /g,' ').replace(/\s+/g,' ').trim();
  }
  function quitarTildes(s){
    return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'');
  }

  // ──────────────────────────────────────────────────────────────────
  //  Detector de fondo
  // ──────────────────────────────────────────────────────────────────
  function detectFondo(text){
    var t = quitarTildes(text).toLowerCase();
    if(/colpensiones|extracto de semanas cotizadas/.test(t)) return 'colpensiones';
    if(/porvenir/.test(t) && /cuenta individual|pension obligatoria|extracto de cuenta/.test(t)) return 'porvenir';
    if(/proteccion s\.?a\.?/.test(t) && /pension obligatoria|cuenta individual/.test(t)) return 'proteccion';
    if(/colfondos/.test(t)) return 'colfondos';
    if(/skandia/.test(t) && /pension/.test(t)) return 'skandia';
    return 'desconocido';
  }

  var FONDOS_NOMBRE = {
    colpensiones: 'Colpensiones',
    porvenir: 'Porvenir',
    proteccion: 'Protección',
    colfondos: 'Colfondos',
    skandia: 'Skandia',
    desconocido: 'fondo no reconocido'
  };

  // ──────────────────────────────────────────────────────────────────
  //  Parser Colpensiones (HLM)
  //
  //  Layout conocido del HLM:
  //    p1: encabezado + nombre + dirección + texto narrativo +
  //        "1.1. Resumen de semanas cotizadas" con fila resumen
  //        "X,XX  Y,YY  Z,ZZ  W,WW" donde X = total cotizadas (semanas),
  //        Y = años equiv, Z = otra columna, W = otra columna.
  //    p2: continuación tabla por empleador
  //    p3: detalle mensual con tabla de IBC reportado por empleador y
  //        datos personales (sexo, fecha nacimiento, cédula)
  // ──────────────────────────────────────────────────────────────────
  function parseColpensiones(text){
    var clean = quitarTildes(text);
    var out = { fondo:'colpensiones', semanas:null, sexo:null, edad:null, ibc:null, ibcMeses:0, nombre:null };

    // Total semanas: buscar el primer número con formato "XXX,XX" inmediatamente
    // antes de "1.1. Resumen de semanas cotizadas". Layout: "749,71 14,58 550,29 10,70 1.1. Resumen..."
    var mSem = clean.match(/(\d{1,4}(?:\.\d{3})*,\d{2})\s+\d{1,3},\d{2}[\s\d.,]{0,40}1\.1\.\s*Resumen\s+de\s+semanas/i);
    if(mSem){
      out.semanas = parseFloat(mSem[1].replace(/\./g,'').replace(',','.'));
    }

    // Sexo
    if(/Masculino/i.test(clean)) out.sexo = 'H';
    else if(/Femenino/i.test(clean)) out.sexo = 'M';

    // Fecha de nacimiento "12 / Jun / 1987" → edad actual
    var meses = {ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
    var mNac = clean.match(/(\d{1,2})\s*\/\s*([A-Za-z]{3})\s*\/\s*(\d{4})/);
    if(mNac){
      var mIdx = meses[mNac[2].toLowerCase()];
      if(mIdx !== undefined){
        var fnac = new Date(parseInt(mNac[3]), mIdx, parseInt(mNac[1]));
        var hoy = new Date();
        var edad = hoy.getFullYear() - fnac.getFullYear();
        var antesCumple = (hoy.getMonth() < mIdx) || (hoy.getMonth()===mIdx && hoy.getDate() < parseInt(mNac[1]));
        if(antesCumple) edad--;
        out.edad = edad;
      }
    }

    // Nombre: línea con "JUAN ESTEBAN HOYOS SALAZAR" — entre "pensiones" y "CL "/dirección.
    // Heurística: tomar línea con 3+ palabras en mayúsculas justo después de "pensiones\n".
    var mNom = clean.match(/Extracto\s+de\s+semanas\s+cotizadas\s+a\s+pensiones\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{8,80}?)\s{2,}/);
    if(mNom) out.nombre = normalizar(mNom[1]);

    // IBC reportado: tabla detalle página 3
    // Patrón típico: "<NIT> <RAZON SOCIAL> <YYYYMM> <DD/MM/YYYY> $X,XXX,XXX $X,XXX,XXX <DD> Pago aplicado"
    // Capturamos el primer monto (IBC reportado) que sigue a la fecha DD/MM/YYYY.
    var rxIBC = /\d{1,2}\/\d{1,2}\/\d{4}\s*\$?([\d.,]+)\s*\$?[\d.,]+\s+\d{1,2}\s+Pago\s+aplicado/g;
    var ibcs = [];
    var match;
    while((match = rxIBC.exec(clean)) !== null){
      var n = parseInt(match[1].replace(/[.,]/g,''));
      if(!isNaN(n) && n > 100000) ibcs.push(n); // > 100k pesos (filtra ruido)
    }
    if(ibcs.length){
      var ult12 = ibcs.slice(-12);
      out.ibc = Math.round(ult12.reduce(function(a,b){return a+b;},0) / ult12.length);
      out.ibcMeses = ult12.length;
    }

    return out;
  }

  // ──────────────────────────────────────────────────────────────────
  //  Stubs para AFPs — Fase 2
  // ──────────────────────────────────────────────────────────────────
  function parsePorvenir(text){ return { fondo:'porvenir', soportado:false }; }
  function parseProteccion(text){ return { fondo:'proteccion', soportado:false }; }
  function parseColfondos(text){ return { fondo:'colfondos', soportado:false }; }
  function parseSkandia(text){ return { fondo:'skandia', soportado:false }; }

  var PARSERS = {
    colpensiones: parseColpensiones,
    porvenir: parsePorvenir,
    proteccion: parseProteccion,
    colfondos: parseColfondos,
    skandia: parseSkandia
  };

  // ──────────────────────────────────────────────────────────────────
  //  API pública
  // ──────────────────────────────────────────────────────────────────
  /**
   * Carga PDF y extrae texto. Si está cifrado y no se pasa password,
   * rechaza con error code 'password_required'. Si password es incorrecto,
   * rechaza con 'password_invalid'.
   */
  function extractText(file, password){
    return loadPdfJs().then(function(lib){
      return file.arrayBuffer().then(function(ab){
        var task = lib.getDocument({
          data: ab,
          password: password || ''
        });
        return task.promise;
      });
    }).then(function(pdf){
      var pages = [];
      for(var i=1; i<=pdf.numPages; i++){
        pages.push(pdf.getPage(i).then(function(p){
          return p.getTextContent().then(function(c){
            return c.items.map(function(it){return it.str;}).join(' ');
          });
        }));
      }
      return Promise.all(pages).then(function(texts){
        return { text: texts.join('\n'), numPages: pdf.numPages };
      });
    }).catch(function(err){
      var name = err && err.name || '';
      if(name === 'PasswordException'){
        if(err.code === 1) return Promise.reject({ code:'password_required', message:'PDF cifrado, requiere contraseña.' });
        return Promise.reject({ code:'password_invalid', message:'Contraseña incorrecta.' });
      }
      return Promise.reject({ code:'pdf_error', message: err && err.message || 'No se pudo leer el PDF.' });
    });
  }

  /**
   * Parsea PDF de pensión: extrae texto, detecta fondo, ejecuta parser.
   * Retorna: { fondo, fondoNombre, datos:{semanas,sexo,edad,ibc,...}, soportado, rawText? }
   */
  function parse(file, password){
    return extractText(file, password).then(function(r){
      var fondo = detectFondo(r.text);
      var parser = PARSERS[fondo];
      var datos = parser ? parser(r.text) : null;
      return {
        fondo: fondo,
        fondoNombre: FONDOS_NOMBRE[fondo],
        datos: datos,
        soportado: !!(datos && datos.soportado !== false && (datos.semanas != null || datos.ibc != null)),
        numPages: r.numPages
      };
    });
  }

  return {
    parse: parse,
    extractText: extractText,
    detectFondo: detectFondo,
    fondosNombre: FONDOS_NOMBRE,
    _internal: { parseColpensiones: parseColpensiones }
  };
}));
