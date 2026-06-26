/**
 * Aziendale — Lector del 210 del AÑO ANTERIOR (declaración de renta PN)
 *
 * Lee el PDF del Formulario 210 del año gravable anterior y extrae, para
 * alimentar la conciliación patrimonial (Art. 236-239) y el beneficio de
 * auditoría (Art. 689-3):
 *   - Patrimonio bruto (casilla 29), Deudas (30), Patrimonio líquido (31)
 *   - Impuesto neto de renta (casilla 126)
 *
 * REALIDAD: el 210 oficial trae los valores SEPARADOS de la etiqueta (layout de
 * casillas), por lo que la auto-detección por etiqueta es BEST-EFFORT y a menudo
 * no encuentra el valor. Por eso la UI SIEMPRE ofrece confirmación/asignación
 * manual de los montos detectados. NO se inventa ningún valor.
 *
 * Usa shared/pdf-lines.js (extracción) y shared/cert-parser-210.js (parsePesos).
 */
(function(global){
  'use strict';

  function norm(s){
    return String(s==null?'':s).toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i')
      .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
      .replace(/\s+/g,' ').trim();
  }
  function parsePesos(t){
    if(global.certParser210 && global.certParser210.parsePesos) return global.certParser210.parsePesos(t);
    return parseInt(String(t).replace(/[^\d]/g,''),10) || 0;
  }
  function fmt(n){ return '$ '+Math.round(n||0).toLocaleString('es-CO'); }

  var RE_RUIDO = /\b(nit|cedula|c\.?c\.?|identificacion|documento|formulario|\bdv\b|fecha|direccion|telefono|signatario|verificacion)\b/;

  // Último monto (con separador de miles) de una línea que contenga la etiqueta.
  function porEtiqueta(lineas, labels){
    for(var i=0;i<lineas.length;i++){
      var ln=norm(lineas[i]);
      for(var j=0;j<labels.length;j++){
        if(ln.indexOf(labels[j])>=0){
          var toks=lineas[i].match(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?/g)||[];
          if(toks.length){ var v=parsePesos(toks[toks.length-1]); if(v>=10000) return v; }
        }
      }
    }
    return 0;
  }

  function candidatos(lineas){
    var out=[], seen={};
    lineas.forEach(function(linea){
      if(RE_RUIDO.test(norm(linea))) return;
      (linea.match(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?/g)||[]).forEach(function(t){
        var v=parsePesos(t);
        if(v>=10000 && !seen[v]){ seen[v]=1; out.push(v); }
      });
    });
    return out;
  }

  function parse(lineas){
    var tn=norm(lineas.join(' '));
    return {
      es210: /declaracion de renta y complementario|rentas de trabajo|patrimonio liquido/.test(tn),
      patrimonioBruto:   porEtiqueta(lineas, ['total patrimonio bruto','patrimonio bruto']),
      deudas:            porEtiqueta(lineas, ['total deudas','deudas','pasivos']),
      patrimonioLiquido: porEtiqueta(lineas, ['total patrimonio liquido','patrimonio liquido']),
      impuestoNeto:      porEtiqueta(lineas, ['impuesto neto de renta']),
      candidatos:        candidatos(lineas)
    };
  }

  // Destinos del mapeo manual (claves del objeto que recibe aplicar()).
  var DESTINOS=[['','— ignorar —'],['patrimonioBruto','Patrimonio bruto AG-1'],['deudas','Deudas AG-1'],['patrimonioLiquido','Patrimonio líquido AG-1 (directo)'],['impuestoNeto','Impuesto neto de renta AG-1']];

  function mapaSelect(cands, preselect){
    var opts=DESTINOS.map(function(d){return '<option value="'+d[0]+'">'+d[1]+'</option>';}).join('');
    return cands.map(function(m){
      var sel=preselect[m]||'';
      var o=DESTINOS.map(function(d){return '<option value="'+d[0]+'"'+(d[0]===sel?' selected':'')+'>'+d[1]+'</option>';}).join('');
      return '<div class="live-row"><span class="lbl">'+fmt(m)+'</span><select data-prev-map data-monto="'+m+'" style="font-size:.78rem">'+o+'</select></div>';
    }).join('');
  }

  function render(r, out, aplicar){
    // Pre-asignación best-effort: si un valor detectado coincide con un candidato.
    var pre={};
    if(r.patrimonioBruto)   pre[r.patrimonioBruto]='patrimonioBruto';
    if(r.deudas)            pre[r.deudas]='deudas';
    if(r.patrimonioLiquido && !pre[r.patrimonioLiquido]) pre[r.patrimonioLiquido]='patrimonioLiquido';
    if(r.impuestoNeto)      pre[r.impuestoNeto]='impuestoNeto';
    if(!r.candidatos.length){
      out.innerHTML='<div style="border:1px solid var(--amber);border-radius:10px;padding:10px;background:#FFFBEB;font-size:.82rem">No se encontraron montos en el PDF. Si es un escaneo (imagen), ingrésalos a mano.</div>';
      return;
    }
    var algo = r.patrimonioBruto||r.deudas||r.patrimonioLiquido||r.impuestoNeto;
    var encabezado = algo
      ? 'Detecté algunos valores; revisa la asignación y completa los que falten:'
      : 'Este 210 trae los valores sin etiqueta legible. Asigna cada monto a su casilla del año anterior:';
    out.innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:10px">'
      +'<div style="font-size:.82rem;margin-bottom:6px">'+encabezado+'</div>'
      + mapaSelect(r.candidatos, pre)
      +'<button type="button" data-prev-apply class="btn" style="margin-top:8px">Aplicar al comparativo</button></div>';
    out.querySelector('[data-prev-apply]').addEventListener('click', function(){
      var c={patrimonioBruto:0,deudas:0,patrimonioLiquido:0,impuestoNeto:0};
      out.querySelectorAll('[data-prev-map]').forEach(function(sel){
        if(sel.value) c[sel.value]=(c[sel.value]||0)+parseInt(sel.getAttribute('data-monto'),10);
      });
      aplicar(c);
    });
  }

  function init(opts){
    var input=document.getElementById(opts.fileInputId), out=document.getElementById(opts.resultId);
    if(!input||!out) return;
    input.addEventListener('change', function(){
      var file=input.files&&input.files[0]; if(!file) return;
      out.innerHTML='<span style="color:var(--muted)">Leyendo la declaración del año anterior…</span>';
      global.pdfLines.extraer(file).then(function(lineas){
        render(parse(lineas), out, opts.aplicar);
      }).catch(function(e){
        out.innerHTML='<span style="color:var(--red)">No se pudo leer el PDF: '+((e&&e.message)||'error')+'</span>';
      });
    });
  }

  global.declPrev210 = { parse: parse, init: init };
})(typeof window !== 'undefined' ? window : this);
