/**
 * Aziendale — pdf-lines.js
 * Utilidad compartida: carga pdf.js bajo demanda (CDN) y extrae el texto de un
 * PDF reconstruyendo las LÍNEAS por coordenada Y, de modo que "ETIQUETA … VALOR"
 * quede en una sola línea (pdf.js separa los items y mete espacios extra).
 * Devuelve un array de líneas. El PDF se procesa 100% en el navegador.
 *
 * Uso: pdfLines.extraer(file).then(function(lineas){ ... })
 */
(function(global){
  'use strict';

  function cargarPdfJs(){
    return new Promise(function(res, rej){
      if(global.pdfjsLib) return res(global.pdfjsLib);
      var s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload=function(){ try{ global.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }catch(e){} res(global.pdfjsLib); };
      s.onerror=function(){ rej(new Error('No se pudo cargar el lector de PDF')); };
      document.head.appendChild(s);
    });
  }

  function extraer(file){
    return cargarPdfJs().then(function(){ return file.arrayBuffer(); }).then(function(buf){
      return global.pdfjsLib.getDocument({data:buf}).promise;
    }).then(function(pdf){
      var ps=[]; for(var i=1;i<=pdf.numPages;i++) ps.push(pdf.getPage(i));
      return Promise.all(ps);
    }).then(function(pages){
      return Promise.all(pages.map(function(p){ return p.getTextContent(); }));
    }).then(function(contents){
      var lineas=[];
      contents.forEach(function(c){
        var porY={};
        c.items.forEach(function(it){
          var y=Math.round((it.transform&&it.transform[5])||0);
          (porY[y]=porY[y]||[]).push([it.transform?it.transform[4]:0, it.str]);
        });
        Object.keys(porY).map(Number).sort(function(a,b){return b-a;}).forEach(function(y){
          lineas.push(porY[y].sort(function(a,b){return a[0]-b[0];}).map(function(p){return p[1];}).join(' '));
        });
      });
      return lineas;
    });
  }

  /* Fallback OCR (jul-2026): si el PDF no trae capa de texto (escaneo o foto),
     leerlo con Tesseract vía ocr-pdf.js — solo se descarga si hace falta.
     El contrato no cambia: resuelve con las líneas, vengan de donde vengan. */
  function extraerConOcr(file){
    return extraer(file).then(function(lineas){
      var sinTexto = lineas.join('').replace(/\s+/g,'').length < 40;
      if(!sinTexto || !global.ocrPdf) return lineas;
      if(typeof global.exoToast === 'function') global.exoToast('El PDF parece un escaneo (sin texto). Leyéndolo con OCR — puede tardar un momento la primera vez…', 'info');
      return global.ocrPdf.extraerLineas(file).catch(function(e){
        console.warn('OCR falló:', e);
        return lineas; // devolver lo que había: el caller muestra su mensaje de "sin montos"
      });
    });
  }

  global.pdfLines = { extraer: extraerConOcr, extraerSinOcr: extraer, cargarPdfJs: cargarPdfJs };
})(typeof window !== 'undefined' ? window : this);
