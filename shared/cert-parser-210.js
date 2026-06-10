/**
 * ExogenaDIAN — Parser del Certificado de Ingresos y Retenciones (Formulario 220)
 *
 * Lee el texto ya extraído de un PDF (vía pdf.js en el navegador) del Certificado
 * de Ingresos y Retenciones por rentas de trabajo y de pensiones, y devuelve los
 * valores para pre-llenar la cédula de trabajo / pensiones del F210.
 *
 * Diseño robusto frente a la realidad (validado contra certificados reales de
 * varios empleadores):
 *   - Los F220 con etiquetas en texto traen "ETIQUETA.......... VALOR" por línea →
 *     se localiza la etiqueta y se toma el ÚLTIMO número de esa línea. (Confiable.)
 *   - Los F220 "solo valores" (etiquetas en la plantilla, no en el texto) no se
 *     auto-detectan → se exponen TODOS los montos como `candidatos` para que el
 *     contador los asigne a mano (fallback de mapeo manual). NO se inventa nada.
 *   - Normalización de número tolerante: 84,437,000 · 90.309.000 · 98.761.145,50 ·
 *     106,808,000.00 → entero en pesos.
 *
 * Checksum: si hay "Total de ingresos brutos", se verifica contra la suma de los
 * pagos detectados (salarios + honorarios + cesantías + pensiones + otros) para
 * marcar la confianza.
 *
 * NO usa IA. Puro texto → objeto. Sin DOM.
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.certParser210 = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  function norm(s){
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i')
      .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
      .replace(/\s+/g,' ').trim();   // pdf.js inserta espacios múltiples dentro de palabras
  }

  /**
   * Convierte un token de dinero colombiano a entero en pesos.
   * Maneja separador de miles . o , y decimal opcional (1-2 dígitos) . o ,
   *   "84,437,000"     → 84437000
   *   "90.309.000"     → 90309000
   *   "98.761.145,50"  → 98761145
   *   "106,808,000.00" → 106808000
   *   "508.000"        → 508000
   */
  function parsePesos(tok){
    if(tok == null) return 0;
    var s = String(tok).replace(/[^\d.,]/g, '');
    if(!s) return 0;
    // ¿Hay un decimal final de 1-2 dígitos? (sep seguido de 1-2 dígitos al final)
    var dec = s.match(/[.,](\d{1,2})$/);
    var ent = s;
    if(dec){
      // Solo es decimal si el separador NO está formando grupos de 3 (miles).
      // Heurística: si lo que sigue al último separador tiene 1-2 dígitos → decimal.
      ent = s.slice(0, s.length - dec[0].length);
    }
    var n = parseInt(ent.replace(/[.,]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  // Último número "grande" (>=4 dígitos significativos) de una línea.
  function ultimoMontoDeLinea(linea){
    var nums = linea.match(/\d[\d.,]*\d|\d/g) || [];
    for(var i = nums.length - 1; i >= 0; i--){
      var v = parsePesos(nums[i]);
      if(v >= 1000) return v;      // valor real
      if(/^0+$/.test(nums[i].replace(/[.,]/g,''))) return 0; // un "0" explícito
    }
    return null; // sin monto en la línea (la etiqueta y el valor van en líneas separadas)
  }

  // Etiquetas (en texto normalizado) por campo destino. Orden = prioridad.
  var CAMPOS = [
    { key:'salarios',       labels:['pagos por salarios','salarios o emolumentos','salarios y demas pagos','pagos laborales'] },
    { key:'honorarios',     labels:['pagos por honorarios','honorarios, comisiones y servicios','honorarios y compensacion'] },
    { key:'cesantias',      labels:['cesantias e intereses efectivamente pagadas','cesantias e intereses','pagos por cesantias'] },
    { key:'pensiones',      labels:['pensiones de jubilacion','pension de jubilacion','pagos por pensiones'] },
    { key:'totalIngresos',  labels:['total de ingresos brutos','total ingresos brutos'] },
    { key:'aportesSalud',   labels:['aportes obligatorios por salud','aportes obligatorios a salud','aportes obligatorios.{0,25}salud'] },
    { key:'aportesPension', labels:['aportes obl. pension','aportes obligatorios.{0,35}pension','fondos de pensiones y solidaridad'] },
    { key:'afc',            labels:['aportes a cuentas afc','aportes voluntarios a fondos de pensiones','cotizaciones voluntarias rais','cuentas? afc'] },
    { key:'retencion',      labels:['valor retencion fuente por ingresos laborales','valor de la retencion','retencion en la fuente','total retenciones'] }
  ];

  function detectarCampo(lineas, labels){
    for(var i = 0; i < lineas.length; i++){
      var ln = norm(lineas[i]);
      for(var j = 0; j < labels.length; j++){
        if(new RegExp(labels[j]).test(ln)){
          var v = ultimoMontoDeLinea(lineas[i]);
          if(v !== null) return v;
          // valor en la línea siguiente (layout en dos filas)
          if(i+1 < lineas.length){
            var v2 = ultimoMontoDeLinea(lineas[i+1]);
            if(v2 !== null) return v2;
          }
          return 0;
        }
      }
    }
    return null; // etiqueta no encontrada
  }

  // Líneas de identidad / notas legales cuyos números NO son valores del certificado
  // (NIT, cédula, fechas, y los umbrales en UVT del bloque de declaraciones del pie).
  var RE_RUIDO = /\b(nit|cedula|c\.?c\.?|identificacion|documento|formulario|\bdv\b|fecha|expedicion|patrimonio bruto no excedio|ingresos brutos fueron inferiores|compras y consumos|consignaciones bancarias|tarjeta de credito|uvt)\b/;

  // Montos del documento, en orden, para el mapeo manual. Filtra ruido:
  //   - números en líneas de identidad/notas;
  //   - números SIN separador de miles (los NIT/cédula van pelados; los valores
  //     del certificado siempre traen separador: 84,437,000 / 90.309.000).
  function candidatos(lineas){
    var out = [], seen = {};
    lineas.forEach(function(linea){
      if(RE_RUIDO.test(norm(linea))) return;
      var toks = linea.match(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?/g) || []; // solo con separador de miles
      toks.forEach(function(t){
        var v = parsePesos(t);
        if(v >= 10000 && !seen[v]){ seen[v] = 1; out.push(v); }
      });
    });
    return out;
  }

  function parse(textoCrudo){
    var texto = String(textoCrudo || '');
    var lineas = texto.split(/\r?\n/);
    // Si el PDF vino como un solo bloque, partir por las líneas de puntos "....."
    if(lineas.length < 4){
      lineas = texto.split(/(?=[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{8,})/);
    }
    var tn = norm(texto);
    var esF220 = /certificado de ingresos y retenciones|rentas de trabajo y de pensiones|total de ingresos brutos/.test(tn);

    var campos = {};
    var detectados = 0;
    CAMPOS.forEach(function(c){
      var v = detectarCampo(lineas, c.labels);
      campos[c.key] = (v == null ? 0 : v);
      if(v != null && v > 0) detectados++;
    });

    // Pensiones NO son renta de trabajo (van a su cédula). Ingreso de trabajo
    // = total - pensiones, o la suma de pagos laborales si no hay total.
    var sumaPagos = campos.salarios + campos.honorarios + campos.cesantias + campos.pensiones;
    var ingresoTrabajo = campos.totalIngresos > 0
        ? Math.max(0, campos.totalIngresos - campos.pensiones)
        : Math.max(0, campos.salarios + campos.honorarios + campos.cesantias);

    var cuadra = campos.totalIngresos > 0
        ? Math.abs(campos.totalIngresos - sumaPagos) <= Math.max(1000, campos.totalIngresos * 0.01)
        : null;

    var confianza = 'baja';
    if(esF220 && detectados >= 3 && cuadra !== false) confianza = 'alta';
    else if(esF220 && detectados >= 2) confianza = 'media';

    return {
      esF220: esF220,
      detectado: detectados > 0,
      confianza: confianza,
      campos: campos,
      // listo para el motor F210 (cédula de trabajo + pensiones)
      trabajo: {
        ingresos: ingresoTrabajo,
        incrngo: campos.aportesSalud + campos.aportesPension,
        afc: campos.afc,
        retencion: campos.retencion,
        cesantias: campos.cesantias
      },
      pensiones: { ingresos: campos.pensiones },
      checksum: { totalDeclarado: campos.totalIngresos, sumaPagos: sumaPagos, cuadra: cuadra },
      candidatos: candidatos(lineas)
    };
  }

  return { parse: parse, parsePesos: parsePesos };
}));
