/**
 * Aziendale — ocr-pdf.js (v2, jul-2026)
 * OCR de soportes 100% en el navegador (privacidad intacta): PDFs escaneados
 * Y FOTOS (jpg/png/webp — lo que el cliente manda por WhatsApp).
 *
 * Afinado para documentos tributarios colombianos:
 *   - Preprocesado: reescalado a ~1700px, escala de grises + estiramiento de
 *     contraste (los escaneos grises y las fotos con sombra son la norma).
 *   - Corrección de montos post-OCR: en tokens numéricos, O→0, l/I→1, B→8
 *     (errores clásicos de OCR que dañan cifras en pesos).
 *   - Tesseract.js (español) se descarga BAJO DEMANDA solo si hace falta.
 *
 * Uso: ocrPdf.extraerLineas(file, onProgress) → Promise<string[]>
 *      Acepta application/pdf o image/*. onProgress({pagina,totalPaginas,pct}).
 */
(function(global){
  'use strict';

  var TESS_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var MAX_PAGINAS = 6;          // certificados y 210 reales: 1-4 páginas
  var ANCHO_OBJETIVO = 1700;    // ~200dpi carta: suficiente para dígitos pequeños

  var tessP = null, workerP = null;

  function cargarScript(src){
    return new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = function(){ rej(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  function cargarPdfJs(){
    if(global.pdfjsLib) return Promise.resolve();
    return cargarScript(PDFJS_URL).then(function(){
      try{ global.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; }catch(e){}
    });
  }

  function cargarTesseract(){
    if(global.Tesseract) return Promise.resolve();
    if(tessP) return tessP;
    tessP = cargarScript(TESS_URL).catch(function(e){ tessP = null; throw e; });
    return tessP;
  }

  function getWorker(){
    if(workerP) return workerP;
    workerP = cargarTesseract().then(function(){
      return global.Tesseract.createWorker('spa');
    }).then(function(w){
      // Conservar espacios entre palabras: mantiene "ETIQUETA   VALOR" separable
      return Promise.resolve(w.setParameters({ preserve_interword_spaces: '1' }))
        .then(function(){ return w; }, function(){ return w; });
    }).catch(function(e){ workerP = null; throw e; });
    return workerP;
  }

  /* Preprocesado del canvas: grises + estiramiento de contraste (percentiles
     2-98). Fotos con sombra y escaneos lavados son el caso común; el contraste
     plano es la causa #1 de dígitos mal leídos. */
  function preprocesar(cv){
    try{
      var g = cv.getContext('2d');
      var img = g.getImageData(0, 0, cv.width, cv.height);
      var d = img.data, n = d.length;
      var hist = new Uint32Array(256), i, y;
      for(i = 0; i < n; i += 4){
        y = (d[i] * 299 + d[i+1] * 587 + d[i+2] * 114) / 1000 | 0;
        d[i] = d[i+1] = d[i+2] = y;
        hist[y]++;
      }
      var total = n / 4, acc = 0, p2 = 0, p98 = 255;
      for(i = 0; i < 256; i++){ acc += hist[i]; if(acc >= total * 0.02){ p2 = i; break; } }
      acc = 0;
      for(i = 255; i >= 0; i--){ acc += hist[i]; if(acc >= total * 0.02){ p98 = i; break; } }
      var rango = Math.max(1, p98 - p2);
      for(i = 0; i < n; i += 4){
        y = ((d[i] - p2) * 255 / rango) | 0;
        if(y < 0) y = 0; else if(y > 255) y = 255;
        d[i] = d[i+1] = d[i+2] = y;
      }
      g.putImageData(img, 0, 0);
    }catch(e){ /* canvas tainted u otro: OCR igual sobre el original */ }
    return cv;
  }

  /* Corrección de montos: solo dentro de tokens que YA son casi-numéricos.
     "$1.234.5OO" → "$1.234.500". Nunca toca palabras normales. */
  function corregirMontos(linea){
    return linea.replace(/[$]?[\d.,OolIB|]{4,}/g, function(tok){
      var dig = (tok.match(/\d/g) || []).length;
      var sos = (tok.match(/[OolIB|]/g) || []).length;
      if(dig < 3 || sos === 0 || sos > dig) return tok; // mayormente letras: no tocar
      return tok.replace(/[Oo]/g, '0').replace(/[lI|]/g, '1').replace(/B/g, '8');
    });
  }

  function reconocerCanvas(worker, cv, lineas){
    return worker.recognize(preprocesar(cv)).then(function(out){
      var ls = (out && out.data && out.data.lines) || [];
      ls.forEach(function(l){
        var t = (l.text || '').trim();
        if(t) lineas.push(corregirMontos(t));
      });
    });
  }

  // Píldora de progreso auto-contenida
  function pill(){
    var p = document.getElementById('ocrPill');
    if(p) return p;
    p = document.createElement('div');
    p.id = 'ocrPill';
    p.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:10000;background:#2b567f;color:#fff;padding:10px 16px;border-radius:12px;font-size:.82rem;font-family:inherit;box-shadow:0 8px 24px -8px rgba(20,33,61,.5);display:flex;align-items:center;gap:9px';
    p.innerHTML = '<span style="display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite"></span><span id="ocrPillTxt">Leyendo documento…</span>';
    document.body.appendChild(p);
    return p;
  }
  function pillTxt(t){ pill(); var e = document.getElementById('ocrPillTxt'); if(e) e.textContent = t; }
  function pillOff(){ var p = document.getElementById('ocrPill'); if(p) p.remove(); }

  function esImagen(file){
    return /^image\//.test(file.type || '') || /\.(jpe?g|png|webp|bmp)$/i.test(file.name || '');
  }

  function canvasDesdeImagen(file){
    return new Promise(function(res, rej){
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function(){
        URL.revokeObjectURL(url);
        // Reescalar fotos chicas al ancho objetivo (las de WhatsApp llegan comprimidas)
        var f = im.naturalWidth < ANCHO_OBJETIVO ? ANCHO_OBJETIVO / im.naturalWidth : 1;
        if(f > 3) f = 3; // no inflar más de 3x: no inventa nitidez
        var cv = document.createElement('canvas');
        cv.width = Math.round(im.naturalWidth * f);
        cv.height = Math.round(im.naturalHeight * f);
        var g = cv.getContext('2d');
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        g.drawImage(im, 0, 0, cv.width, cv.height);
        res(cv);
      };
      im.onerror = function(){ URL.revokeObjectURL(url); rej(new Error('No se pudo leer la imagen')); };
      im.src = url;
    });
  }

  /**
   * Extrae líneas de texto de un PDF escaneado O una foto/imagen.
   * Contrato idéntico a pdfLines.extraer: resuelve con array de strings.
   */
  function extraerLineas(file, onProgress){
    var avisar = typeof onProgress === 'function' ? onProgress : function(i){ pillTxt('OCR página ' + i.pagina + ' de ' + i.totalPaginas + '…'); };
    pillTxt('Preparando lector OCR (la primera vez descarga el idioma)…');

    if(esImagen(file)){
      return Promise.all([getWorker(), canvasDesdeImagen(file)]).then(function(rs){
        avisar({ pagina: 1, totalPaginas: 1, pct: 10 });
        var lineas = [];
        return reconocerCanvas(rs[0], rs[1], lineas).then(function(){ pillOff(); return lineas; });
      }).catch(function(e){ pillOff(); throw e; });
    }

    return Promise.all([cargarPdfJs(), getWorker()]).then(function(rs){
      var worker = rs[1];
      return file.arrayBuffer().then(function(buf){
        return global.pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function(pdf){
        var n = Math.min(pdf.numPages, MAX_PAGINAS);
        var lineas = [];
        var cadena = Promise.resolve();
        for(var i = 1; i <= n; i++){
          (function(pag){
            cadena = cadena.then(function(){
              avisar({ pagina: pag, totalPaginas: n, pct: Math.round(((pag - 1) / n) * 100) });
              return pdf.getPage(pag).then(function(page){
                var vp1 = page.getViewport({ scale: 1 });
                // Escala dinámica: apuntar al ancho objetivo (min 2.2, máx 3.2)
                var esc = Math.max(2.2, Math.min(3.2, ANCHO_OBJETIVO / Math.max(1, vp1.width)));
                var vp = page.getViewport({ scale: esc });
                var cv = document.createElement('canvas');
                cv.width = vp.width; cv.height = vp.height;
                return page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise.then(function(){
                  return reconocerCanvas(worker, cv, lineas);
                });
              });
            });
          })(i);
        }
        return cadena.then(function(){ pillOff(); return lineas; });
      });
    }).catch(function(e){ pillOff(); throw e; });
  }

  global.ocrPdf = {
    extraerLineas: extraerLineas,
    esImagen: esImagen,
    _corregirMontos: corregirMontos,
    _esEscaneo: function(lineas){
      return (lineas || []).join('').replace(/\s+/g, '').length < 40;
    }
  };
})(window);
