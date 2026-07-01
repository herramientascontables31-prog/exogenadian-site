/**
 * Aziendale — ocr-pdf.js
 * OCR de PDFs escaneados, 100% en el navegador (privacidad intacta).
 * Fallback de pdf-lines: cuando un PDF no trae capa de texto (escaneo/foto),
 * renderiza cada página a canvas (pdf.js) y la lee con Tesseract.js (español).
 * Tesseract (~4MB + idioma) se descarga BAJO DEMANDA solo si hace falta.
 *
 * Uso: ocrPdf.extraerLineas(file, onProgress).then(function(lineas){ ... })
 *      onProgress({ pagina, totalPaginas, pct }) — opcional.
 */
(function(global){
  'use strict';

  var TESS_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var MAX_PAGINAS = 4;      // los 210/F220 reales son 1-3 páginas
  var ESCALA = 2.2;         // DPI del render: suficiente para dígitos pequeños

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
      // v5: createWorker(idioma) devuelve un worker ya inicializado
      return global.Tesseract.createWorker('spa');
    }).catch(function(e){ workerP = null; throw e; });
    return workerP;
  }

  // Píldora de progreso auto-contenida (no depende del overlay de cada página)
  function pill(){
    var p = document.getElementById('ocrPill');
    if(p) return p;
    p = document.createElement('div');
    p.id = 'ocrPill';
    p.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:10000;background:#2b567f;color:#fff;padding:10px 16px;border-radius:12px;font-size:.82rem;font-family:inherit;box-shadow:0 8px 24px -8px rgba(20,33,61,.5);display:flex;align-items:center;gap:9px';
    p.innerHTML = '<span style="display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite"></span><span id="ocrPillTxt">Leyendo escaneo…</span>';
    document.body.appendChild(p);
    return p;
  }
  function pillTxt(t){ pill(); var e = document.getElementById('ocrPillTxt'); if(e) e.textContent = t; }
  function pillOff(){ var p = document.getElementById('ocrPill'); if(p) p.remove(); }

  /**
   * Extrae líneas de texto de un PDF escaneado. Contrato idéntico a
   * pdfLines.extraer: resuelve con un array de strings (una por línea).
   */
  function extraerLineas(file, onProgress){
    var avisar = typeof onProgress === 'function' ? onProgress : function(i){ pillTxt('OCR página ' + i.pagina + ' de ' + i.totalPaginas + '…'); };
    pillTxt('Preparando lector OCR (primera vez descarga el idioma)…');
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
                var vp = page.getViewport({ scale: ESCALA });
                var cv = document.createElement('canvas');
                cv.width = vp.width; cv.height = vp.height;
                return page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise.then(function(){
                  return worker.recognize(cv);
                }).then(function(out){
                  var ls = (out && out.data && out.data.lines) || [];
                  ls.forEach(function(l){ var t = (l.text || '').trim(); if(t) lineas.push(t); });
                });
              });
            });
          })(i);
        }
        return cadena.then(function(){ pillOff(); return lineas; });
      });
    }).catch(function(e){ pillOff(); throw e; });
  }

  global.ocrPdf = { extraerLineas: extraerLineas, _esEscaneo: function(lineas){
    // Heurística: un PDF con capa de texto real trae decenas de caracteres
    return (lineas || []).join('').replace(/\s+/g, '').length < 40;
  }};
})(window);
