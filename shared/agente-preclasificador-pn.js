/**
 * ExogenaDIAN — Agente IA pre-clasificador del reporte exógena (Renta PN)
 *
 * Capa opcional sobre `parser-exogena-pn.js`. Cuando el parser deja registros
 * sin `cedulaFinal` (concepto desconocido o ambiguo), este módulo agrupa esos
 * registros y pide al endpoint /api/chat (Cloud Run dian-proxy) que sugiera
 * la cédula correcta usando un prompt con catálogo CERRADO y la regla
 * "no_se" cuando la IA no tenga evidencia suficiente.
 *
 * Diseño:
 *   - El motor del F210 NO se toca.
 *   - El parser tampoco. La IA solo opera sobre registros que el parser
 *     marcó como sin clasificar (`cedulaFinal === null`).
 *   - El usuario puede aceptar, rechazar o ajustar cada sugerencia.
 *   - La sugerencia incluye `confianza` y `razon` (con cita normativa) para
 *     que el contador pueda decidir.
 *
 * NO genera datos:
 *   - Catálogo de cédulas es cerrado (validado contra `cedulaFinal` permitido).
 *   - Si la IA devuelve algo fuera del catálogo, se descarta.
 *   - Si no devuelve JSON parseable, se reporta error sin aplicar nada.
 *
 * Uso típico (en formato210-pro.html):
 *   var pendientes = reconciliacionEstado.filas.filter(function(f){
 *     return !f.cedulaFinal && !f.excluida;
 *   });
 *   agentePreclasificadorPN.clasificar(pendientes).then(function(r){
 *     // r.sugerencias = [{id, cedula, confianza, razon}, ...]
 *   });
 */
(function(){
  'use strict';

  var API_BASE = 'https://dian-proxy-337146111457.southamerica-east1.run.app';
  var ENDPOINT_CHAT = '/api/chat';
  var TIMEOUT_MS = 45000;
  // El backend (dian-proxy/chat.py) limita cada mensaje a 4000 chars. El prompt
  // base comprimido pesa ~900 chars; dejamos margen para ~12 registros por lote.
  var MAX_REGISTROS_POR_LOTE = 12;
  var MAX_CONTENT_CHARS = 3900; // tope duro por debajo del límite del backend

  // Catálogo CERRADO. Coincide con valores válidos de `cedulaFinal` y los
  // identificadores que usa el motor de cálculo (calculo210.js).
  var CATALOGO_CEDULAS = [
    { id: 'trabajo',                desc: 'Salarios, comisiones, prestaciones sociales, viáticos, gastos de representación. Art. 103 ET, Art. 335-336 ET.' },
    { id: 'honorarios',             desc: 'Honorarios, servicios personales, comisiones de independientes. Art. 26 y 340 ET.' },
    { id: 'capital',                desc: 'Intereses, rendimientos financieros, arrendamientos, regalías, explotación propiedad intelectual. Art. 338 ET.' },
    { id: 'noLaboral',              desc: 'Ingresos que NO encajan en trabajo, honorarios, capital ni pensiones (ej. enajenación activos no fijos < 2 años, indemnizaciones gravadas). Art. 340 ET.' },
    { id: 'pensiones',              desc: 'Pensiones de jubilación, invalidez, vejez, sobrevivientes. Art. 337 ET.' },
    { id: 'dividendos_no_grav',     desc: 'Dividendos y participaciones distribuidos como NO gravados (utilidades 49 num. 3 ET).' },
    { id: 'dividendos_grav',        desc: 'Dividendos y participaciones distribuidos como GRAVADOS (utilidades 49 par. 2 ET).' },
    { id: 'gananciasOcasionales',   desc: 'Venta activos fijos poseídos > 2 años, herencias, legados, donaciones, premios, loterías. Arts. 300-314 ET.' },
    { id: 'incrngo',                desc: 'Ingresos no constitutivos de renta ni ganancia ocasional (aportes obligatorios salud y pensión, indemnizaciones no gravadas). Arts. 35-57-1 ET.' },
    { id: 'deduccion_salud_prepag', desc: 'Pagos por medicina prepagada o pólizas de salud. Art. 387 lit. b ET (tope 192 UVT/año).' },
    { id: 'deduccion_vivienda',     desc: 'Intereses de crédito hipotecario para vivienda del declarante. Art. 119 ET (tope 1.200 UVT/año).' },
    { id: 'deduccion_avc',          desc: 'Aportes voluntarios a fondos privados de pensión (FVP) y cuentas AFC / AVC. Arts. 126-1 y 126-4 ET (tope 30% / 3.800 UVT).' },
    { id: 'excluir',                desc: 'Registro que NO debe ir en la declaración (duplicado, error de exógena, valor nulo, concepto irrelevante).' }
  ];

  var IDS_VALIDAS = {};
  CATALOGO_CEDULAS.forEach(function(c){ IDS_VALIDAS[c.id] = true; });
  IDS_VALIDAS['no_se'] = true; // valor especial cuando la IA duda

  // ════════════════════════════════════════════════════════════════════
  //  Construcción del prompt
  // ════════════════════════════════════════════════════════════════════

  // Prompt comprimido: el backend corta cada mensaje en 4000 chars. La versión
  // anterior (catálogo + reglas verbosas) pesaba ~3.471 chars y con 4+ registros
  // pasaba el límite → 422. Esta base pesa ~950 chars. Los códigos/pistas van
  // como tags cortos, no como párrafos. El catálogo CERRADO se valida igual en
  // validarSugerencias(), así que comprimir el texto no relaja el control.
  function construirPrompt(registros){
    var registrosCompactos = registros.map(function(r){
      return {
        id: r.id,
        concepto: r.concepto || '',
        descripcion: r.descripcion || '',
        informante: r.informante || '',
        nit: r.nit || '',
        valor: r.valor || 0
      };
    });

    return [
      'Clasificador de exógena DIAN → cédulas del Formulario 210 (renta persona natural, Colombia). Para CADA registro elige UNA clave del catálogo o "no_se".',
      'CATÁLOGO (clave: pistas): trabajo: salarios 5001 | honorarios: servicios 5002/5003 | capital: intereses, arriendos, regalías, bancos/fiducias, 5004/5005 | noLaboral: otros art.340 | pensiones: 5022 | dividendos_no_grav: 5010 | dividendos_grav: 5011 | gananciasOcasionales: venta activos fijos >2a, herencias, premios, 5044 | incrngo: aportes oblig. salud/pensión 5008/5009 | deduccion_salud_prepag: medicina prepagada | deduccion_vivienda: intereses hipotecario | deduccion_avc: AFC/FVP | excluir: duplicado/error/nulo | no_se: sin evidencia suficiente.',
      'REGLAS: responde SOLO JSON (sin markdown ni texto extra). Usa exclusivamente claves del catálogo. Si dudas → "no_se". confianza realista 0.5–0.95 (nunca 1.0). razon: 1 frase con cita del ET (máx 20 palabras).',
      'FORMATO: {"sugerencias":[{"id":"<id>","cedula":"<clave>","confianza":<0..1>,"razon":"<frase>"}]}',
      'REGISTROS:',
      JSON.stringify(registrosCompactos, null, 0)
    ].join('\n');
  }

  // ════════════════════════════════════════════════════════════════════
  //  Llamada al endpoint con timeout y manejo de errores
  // ════════════════════════════════════════════════════════════════════

  function llamarEndpointChat(prompt){
    return new Promise(function(resolve, reject){
      var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = setTimeout(function(){
        if(controller) controller.abort();
        reject(new Error('Timeout: la IA no respondió en ' + (TIMEOUT_MS/1000) + 's'));
      }, TIMEOUT_MS);

      fetch(API_BASE + ENDPOINT_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          page: 'agente-preclasificador-pn',
          page_name: 'Pre-clasificador F210'
        }),
        signal: controller ? controller.signal : undefined
      }).then(function(resp){
        if(!resp.ok){
          clearTimeout(timer);
          return resp.text().then(function(t){
            reject(new Error('Endpoint respondió ' + resp.status + ': ' + (t || 'sin cuerpo')));
          });
        }
        // Streaming SSE — acumular toda la respuesta
        var reader = resp.body.getReader();
        var decoder = new TextDecoder();
        var fullText = '';
        var buffer = '';

        function readChunk(){
          reader.read().then(function(result){
            if(result.done){
              clearTimeout(timer);
              resolve(fullText);
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for(var i = 0; i < lines.length; i++){
              var line = lines[i];
              if(line.indexOf('data: ') !== 0) continue;
              var payload = line.slice(6);
              if(payload === '[DONE]') continue;
              try {
                var data = JSON.parse(payload);
                if(data && typeof data.text === 'string') fullText += data.text;
                else if(data && typeof data.content === 'string') fullText += data.content;
              } catch(e){ /* línea no-JSON, ignorar */ }
            }
            readChunk();
          }).catch(function(err){
            clearTimeout(timer);
            reject(err);
          });
        }
        readChunk();
      }).catch(function(err){
        clearTimeout(timer);
        if(err && err.name === 'AbortError') return; // ya rechazado por timeout
        reject(err);
      });
    });
  }

  // ════════════════════════════════════════════════════════════════════
  //  Parseo y validación de respuesta IA
  // ════════════════════════════════════════════════════════════════════

  function extraerJSON(texto){
    if(!texto) throw new Error('IA devolvió respuesta vacía');
    // Limpiar fences markdown si los hay
    var limpio = String(texto).replace(/```json/gi, '').replace(/```/g, '').trim();
    var inicio = limpio.indexOf('{');
    var fin = limpio.lastIndexOf('}');
    if(inicio < 0 || fin < 0 || fin <= inicio){
      throw new Error('IA no devolvió JSON parseable');
    }
    var slice = limpio.substring(inicio, fin + 1);
    return JSON.parse(slice);
  }

  /**
   * Filtra y normaliza sugerencias: descarta cédulas fuera del catálogo,
   * confianzas inválidas y registros no solicitados.
   */
  function validarSugerencias(json, idsSolicitados){
    if(!json || !Array.isArray(json.sugerencias)){
      return { sugerencias: [], descartadas: [], error: 'Formato de respuesta inválido' };
    }
    var idsSet = {};
    idsSolicitados.forEach(function(id){ idsSet[id] = true; });

    var validas = [];
    var descartadas = [];

    json.sugerencias.forEach(function(s){
      if(!s || typeof s !== 'object'){ descartadas.push({razon:'no es objeto'}); return; }
      if(!idsSet[s.id]){ descartadas.push({id:s.id, razon:'id no solicitado'}); return; }
      if(!IDS_VALIDAS[s.cedula]){ descartadas.push({id:s.id, razon:'cédula fuera de catálogo: ' + s.cedula}); return; }
      var conf = parseFloat(s.confianza);
      if(isNaN(conf) || conf < 0 || conf > 1) conf = 0.5;
      validas.push({
        id: String(s.id),
        cedula: s.cedula,
        confianza: conf,
        razon: String(s.razon || '').slice(0, 200)
      });
    });

    return { sugerencias: validas, descartadas: descartadas };
  }

  // ════════════════════════════════════════════════════════════════════
  //  API pública
  // ════════════════════════════════════════════════════════════════════

  /**
   * Clasifica un lote de registros sin cédula.
   * @param {Array} registros - filas con {id, concepto, descripcion, informante, nit, valor}
   * @returns {Promise<{sugerencias, descartadas, error?}>}
   */
  function clasificar(registros){
    if(!Array.isArray(registros) || registros.length === 0){
      return Promise.resolve({ sugerencias: [], descartadas: [] });
    }
    if(registros.length > MAX_REGISTROS_POR_LOTE){
      // Procesar en lotes serializados (el endpoint puede tener rate limit)
      var lotes = [];
      for(var i = 0; i < registros.length; i += MAX_REGISTROS_POR_LOTE){
        lotes.push(registros.slice(i, i + MAX_REGISTROS_POR_LOTE));
      }
      return lotes.reduce(function(p, lote){
        return p.then(function(acc){
          return clasificar(lote).then(function(r){
            return {
              sugerencias: acc.sugerencias.concat(r.sugerencias || []),
              descartadas: acc.descartadas.concat(r.descartadas || []),
              error: acc.error || r.error
            };
          });
        });
      }, Promise.resolve({ sugerencias: [], descartadas: [] }));
    }

    var ids = registros.map(function(r){ return r.id; });
    var prompt = construirPrompt(registros);

    // Guard por tamaño real: si aun con pocos registros el prompt supera el tope
    // del backend (descripciones largas), partir el lote por la mitad. Evita el
    // 422 "String should have at most 4000 characters" en cualquier caso.
    if(prompt.length > MAX_CONTENT_CHARS && registros.length > 1){
      var mitad = Math.ceil(registros.length / 2);
      return clasificar(registros.slice(0, mitad)).then(function(a){
        return clasificar(registros.slice(mitad)).then(function(b){
          return {
            sugerencias: (a.sugerencias || []).concat(b.sugerencias || []),
            descartadas: (a.descartadas || []).concat(b.descartadas || []),
            error: a.error || b.error
          };
        });
      });
    }

    return llamarEndpointChat(prompt).then(function(texto){
      var json = extraerJSON(texto);
      return validarSugerencias(json, ids);
    }).catch(function(err){
      return {
        sugerencias: [],
        descartadas: [],
        error: (err && err.message) || 'Error desconocido al consultar IA'
      };
    });
  }

  // Export
  window.agentePreclasificadorPN = {
    clasificar: clasificar,
    CATALOGO_CEDULAS: CATALOGO_CEDULAS,
    _construirPrompt: construirPrompt, // para testing
    _validarSugerencias: validarSugerencias // para testing
  };
})();
