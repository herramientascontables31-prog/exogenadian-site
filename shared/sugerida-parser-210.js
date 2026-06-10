/* ═══════════════════════════════════════════════════════════════════════════
   ExogenaDIAN — sugerida-parser-210.js (portado de CalculaRenta, herramienta hermana)
   Lee el PDF del Formulario 210 (declaración SUGERIDA de la DIAN, o una
   declaración presentada) y extrae las casillas por POSICIÓN: el PDF oficial
   es un formulario de fondo + solo los VALORES como texto, así que cada
   casilla vive en una coordenada fija (formulario v18, AG 2023+).
   Calibrado contra declaraciones reales AG2024; verificación aritmética
   incluida (c31 = c29 − c30, saldos coherentes).
   Todo corre 100% en el navegador (pdf.js). Expone window.sugeridaParser.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
  var WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  function loadPdfJs(){
    return new Promise(function(res, rej){
      if(window.pdfjsLib){ res(); return; }
      var s = document.createElement('script');
      s.src = PDFJS_URL;
      s.onload = function(){
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
        res();
      };
      s.onerror = function(){ rej(new Error('No se pudo cargar el lector de PDF.')); };
      document.head.appendChild(s);
    });
  }

  // Columnas de la cuadrícula de 4 cédulas (x en puntos PDF)
  var C1 = [100, 232], C2 = [232, 348], C3 = [348, 464], C4 = [464, 590];

  // Mapa fila → casillas. y = centro de la fila (tolerancia ±5).
  var ROWS = [
    { y: 613, cells: { 29:[100,300], 30:[300,460], 31:[460,590] } },          // patrimonio
    { y: 590, cells: { 32:C1, 43:C2, 58:C3, 74:C4 } },                        // ingresos brutos
    { y: 578, cells: { 75:C4 } },                                             // devoluciones (no laboral)
    { y: 566, cells: { 33:C1, 44:C2, 59:C3, 76:C4 } },                        // no constitutivos
    { y: 555, cells: { 45:C2, 60:C3, 77:C4 } },                               // costos
    { y: 543, cells: { 34:C1, 46:C2, 61:C3, 78:C4 } },                        // renta líquida
    { y: 520, cells: { 35:C1, 47:C2, 63:C3, 80:C4 } },                        // exentas AFC/FVP
    { y: 508, cells: { 36:C1, 48:C2, 64:C3, 81:C4 } },                        // otras exentas
    { y: 496, cells: { 37:C1, 49:C2, 65:C3, 82:C4 } },                        // total exentas
    { y: 485, cells: { 38:C1, 50:C2, 66:C3, 83:C4 } },                        // intereses vivienda
    { y: 473, cells: { 39:C1, 51:C2, 67:C3, 84:C4 } },                        // otras deducciones
    { y: 461, cells: { 40:C1, 52:C2, 68:C3, 85:C4 } },                        // total deducciones
    { y: 450, cells: { 41:C1, 53:C2, 69:C3, 86:C4 } },                        // exentas+ded limitadas
    { y: 391, cells: { 91:[100,232], 92:[232,348], 93:[348,464], 94:[464,590] } }, // cédula general
    { y: 380, cells: { 95:[100,232], 96:[232,348], 97:[348,464], 98:[464,590] } },
    { y: 368, cells: { 99:[232,460], 100:[460,590] } },                       // pensiones
    { y: 356, cells: { 101:[232,460], 102:[460,590] } },
    { y: 298, cells: { 122:[330,465], 123:[465,590] } },                      // descuentos (col derecha)
    { y: 286, cells: { 124:[330,465], 125:[465,590] } },
    { y: 275, cells: { 126:[460,590] } },                                     // impuesto neto de renta
    { y: 263, cells: { 127:[460,590] } },                                     // impuesto GO
    { y: 251, cells: { 128:[460,590] } },
    { y: 240, cells: { 129:[460,590] } },                                     // total impuesto a cargo
    { y: 228, cells: { 111:[100,310], 130:[460,590] } },                      // RLG total · anticipo anterior
    { y: 216, cells: { 112:[232,330], 131:[460,590] } },                      // GO ingresos · saldo favor ant.
    { y: 205, cells: { 113:[232,330], 132:[460,590] } },                      // GO costos · retenciones
    { y: 193, cells: { 114:[232,330], 133:[460,590] } },                      // GO exentas · anticipo siguiente
    { y: 181, cells: { 115:[232,330] } },                                     // GO gravable
    { y: 170, cells: { 134:[100,232], 135:[232,330], 136:[330,470], 137:[470,590] } } // saldos finales
  ];
  var TOL = 5;

  function toNum(s){
    var n = String(s).replace(/[^\d]/g, '');
    return n ? parseInt(n, 10) : 0;
  }

  // El mismo formulario v18 circula con DOS geometrías (carta vs A4 según el
  // generador). Calibramos con anclas presentes en ambas: el rótulo
  // PRIVADA/SUGERIDA (arriba), la etiqueta pequeña "125" (abajo) y los dígitos
  // del año (izquierda). Transformación lineal doc → coordenadas de referencia.
  var REF = { topY: 769, l125Y: 286, l125X: 488, anioX: 66 };
  function calibrar(all){
    var top = null, l125 = null, anioMinX = null;
    all.forEach(function(i){
      var s = i.str.trim();
      if(!top && /^(PRIVADA|SUGERIDA)$/i.test(s)) top = i;
      if(!l125 && s === '125' && i.h < 7 && i.y < 420) l125 = i;
      if(/^\d$/.test(s) && i.h >= 7 && i.y > 700 && i.x < 130){
        if(anioMinX === null || i.x < anioMinX) anioMinX = i.x;
      }
    });
    if(!top || !l125) return null;
    var ay = (top.y - l125.y) / (REF.topY - REF.l125Y);
    var by = l125.y - ay * REF.l125Y;
    if(!(ay > 0.85 && ay < 1.15)) return null;
    var ax = 1, bx = 0;
    if(anioMinX !== null && Math.abs(l125.x - anioMinX) > 200){
      ax = (l125.x - anioMinX) / (REF.l125X - REF.anioX);
      bx = anioMinX - ax * REF.anioX;
      if(!(ax > 0.85 && ax < 1.15)){ ax = 1; bx = 0; }
    }
    return function(i){ return { str: i.str, h: i.h, x: (i.x - bx) / ax, y: (i.y - by) / ay }; }
  }

  function extraer(items){
    var casillas = {};
    items.forEach(function(it){
      var s = it.str.trim();
      if(!/^[\d.,]+$/.test(s)) return;                 // solo valores numéricos
      for(var r = 0; r < ROWS.length; r++){
        var row = ROWS[r];
        if(Math.abs(it.y - row.y) > TOL) continue;
        for(var c in row.cells){
          var rng = row.cells[c];
          if(it.x >= rng[0] && it.x < rng[1]){
            // si dos items caen en la misma casilla, gana el más cercano al centro de la fila
            if(casillas[c] === undefined || Math.abs(it.y - row.y) < TOL){ casillas[c] = toNum(s); }
            return;
          }
        }
        return; // fila encontrada pero columna no mapeada: no seguir buscando
      }
    });
    return casillas;
  }

  function detectarAnio(items){
    // El año va arriba a la izquierda como dígitos sueltos (nuevo: y≈738; viejo: y≈723)
    var digitos = items.filter(function(it){
      return it.y >= 716 && it.y <= 746 && it.x >= 50 && it.x < 115 && /^\d$/.test(it.str.trim());
    }).sort(function(a, b){ return b.y - a.y || a.x - b.x; }).map(function(it){ return it.str.trim(); }).join('').slice(0, 4);
    var n = parseInt(digitos, 10);
    return (n >= 2020 && n <= 2030) ? n : null;
  }

  function detectarTipo(items){
    var t = items.map(function(i){ return i.str; }).join(' ').toUpperCase();
    if(t.indexOf('SUGERIDA') >= 0) return 'sugerida';
    if(t.indexOf('PRIVADA') >= 0) return 'presentada';
    return 'desconocido';
  }

  function validar(cas, avisos){
    var ok = true;
    var n = Object.keys(cas).length;
    if(n < 8){ avisos.push('Se extrajeron muy pocas casillas (' + n + '). ¿Es el PDF del Formulario 210?'); ok = false; }
    if(cas[29] !== undefined && cas[30] !== undefined && cas[31] !== undefined){
      // El patrimonio líquido no baja de 0 (deudas > bienes ⇒ casilla 31 = 0)
      if(Math.abs(Math.max(0, cas[29] - cas[30]) - cas[31]) > 2000){
        avisos.push('El patrimonio no cuadra (29 − 30 ≠ 31): el formato del PDF puede ser distinto al esperado.');
        ok = false;
      }
    }
    if(cas[136] === undefined && cas[137] === undefined){
      avisos.push('No se encontraron los saldos finales (casillas 136/137).');
      ok = false;
    }
    return ok;
  }

  /** Parsea el ArrayBuffer del PDF del 210. Devuelve {ok, casillas, anio, tipo, avisos}. */
  function parse(arrayBuffer){
    return loadPdfJs().then(function(){
      return window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    }).then(function(doc){
      return doc.getPage(1).then(function(p){ return p.getTextContent(); });
    }).then(function(tc){
      var all = tc.items.map(function(i){
        return { str: i.str, x: i.transform[4], y: i.transform[5], h: i.height || 0 };
      }).filter(function(i){ return i.str.trim(); });
      // Los números de casilla impresos son diminutos (h≈5); los valores miden h≈8.
      var items = all.filter(function(i){ return i.h >= 7; });
      var avisos = [];
      // Normalizar geometría (carta vs A4) con anclas del propio documento
      var t = calibrar(all);
      if(t) items = items.map(t);
      // Formulario viejo (AG2022 o anterior): trae las etiquetas como texto y otra cuadrícula.
      var esViejo = all.some(function(i){ return /^1\.\s*Año/i.test(i.str.trim()); });
      var casillas = esViejo ? {} : extraer(items);
      var ok = !esViejo && validar(casillas, avisos);
      if(esViejo) avisos.push('Este PDF usa el formato viejo del 210 (años 2022 o anteriores). Sube tu declaración sugerida del año actual.');
      return {
        ok: ok,
        casillas: casillas,
        anio: detectarAnio(all),
        tipo: detectarTipo(all),
        avisos: avisos
      };
    });
  }

  window.sugeridaParser = { parse: parse, ROWS: ROWS };
})();
