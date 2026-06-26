/**
 * Aziendale — UI compartida para importar el Certificado de Ingresos y
 * Retenciones (F220) en el F210 (Pro y Express).
 *
 * Hace el trabajo común: cargar pdf.js bajo demanda, extraer el texto
 * reconstruyendo líneas por coordenada Y, parsear con cert-parser-210.js y
 * renderizar el panel (auto-detección o mapeo manual). Lo específico de cada
 * página (a qué inputs van los valores) lo provee el callback `aplicar(campos)`.
 *
 * Uso:
 *   certUI210.init({ fileInputId:'certFile', resultId:'certResultado',
 *                    aplicar: function(campos){ ...llenar inputs y recalcular... } });
 *
 * `campos` = { salarios, honorarios, cesantias, pensiones, aportesSalud,
 *              aportesPension, retencion, afc }
 */
(function(global){
  'use strict';

  function fmt(n){ return '$ '+Math.round(n||0).toLocaleString('es-CO'); }

  var DESTINOS = [['','— ignorar —'],['salarios','Salarios'],['honorarios','Honorarios'],['cesantias','Cesantías'],['aportesSalud','Aporte salud (INCRNGO)'],['aportesPension','Aporte pensión (INCRNGO)'],['retencion','Retención'],['pensiones','Pensiones'],['afc','AFC / voluntarios']];

  // PDF → texto, reconstruyendo líneas por Y (vía shared/pdf-lines.js).
  function extraerTexto(file){
    return global.pdfLines.extraer(file).then(function(lineas){ return lineas.join('\n'); });
  }

  function mapeoManualHtml(cands){
    if(!cands || !cands.length) return '<span style="color:var(--muted)">No se encontraron montos en el PDF.</span>';
    var opts=DESTINOS.map(function(d){return '<option value="'+d[0]+'">'+d[1]+'</option>';}).join('');
    var rows=cands.map(function(m,i){
      return '<div class="live-row"><span class="lbl">'+fmt(m)+'</span><select data-cert-map data-monto="'+m+'" style="font-size:.78rem">'+opts+'</select></div>';
    }).join('');
    return rows+'<button type="button" data-cert-apply-manual class="btn" style="margin-top:8px">Aplicar selección</button>';
  }

  function bindManual(out, aplicar){
    var btn=out.querySelector('[data-cert-apply-manual]');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var c={salarios:0,honorarios:0,cesantias:0,pensiones:0,aportesSalud:0,aportesPension:0,retencion:0,afc:0};
      out.querySelectorAll('[data-cert-map]').forEach(function(sel){
        if(sel.value) c[sel.value]=(c[sel.value]||0)+parseInt(sel.getAttribute('data-monto'),10);
      });
      aplicar(c);
    });
  }

  function render(r, out, aplicar){
    if(r.detectado && (r.confianza==='alta'||r.confianza==='media')){
      var c=r.campos, chk=r.checksum;
      var filas=[['Salarios',c.salarios],['Honorarios',c.honorarios],['Cesantías',c.cesantias],['Pensiones',c.pensiones],['Aporte salud',c.aportesSalud],['Aporte pensión',c.aportesPension],['AFC / voluntarios',c.afc],['Retención',c.retencion]]
        .filter(function(x){return x[1]>0;})
        .map(function(x){return '<div class="live-row"><span class="lbl">'+x[0]+'</span><span class="val">'+fmt(x[1])+'</span></div>';}).join('');
      var badge=r.confianza==='alta'?'<span class="live-tag green">Confianza alta</span>':'<span class="live-tag amber">Revisa</span>';
      var chkHtml = chk.cuadra===true ? '<div style="font-size:.74rem;color:var(--green2)">✔ El total de ingresos cuadra con la suma de pagos.</div>'
                  : chk.cuadra===false ? '<div style="font-size:.74rem;color:var(--amber)">⚠ El total ('+fmt(chk.totalDeclarado)+') no cuadra con la suma de pagos ('+fmt(chk.sumaPagos)+'). Revisa antes de aplicar.</div>' : '';
      out.innerHTML='<div style="border:1px solid var(--green2);border-radius:10px;padding:10px;background:#F0FDF4">'
        +'<div style="margin-bottom:6px">'+badge+' Detecté estos valores en el certificado:</div>'+filas+chkHtml
        +'<button type="button" data-cert-apply class="btn" style="margin-top:8px">Aplicar al formulario</button>'
        +'<button type="button" data-cert-manual class="btn-sec" style="margin-top:8px;margin-left:6px">Asignar manualmente</button></div>';
      out.querySelector('[data-cert-apply]').addEventListener('click', function(){ aplicar(c); });
      out.querySelector('[data-cert-manual]').addEventListener('click', function(){
        out.innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:10px">'+mapeoManualHtml(r.candidatos)+'</div>';
        bindManual(out, aplicar);
      });
    } else {
      out.innerHTML='<div style="border:1px solid var(--amber);border-radius:10px;padding:10px;background:#FFFBEB">'
        +'<div style="font-size:.82rem;margin-bottom:6px">No pude leer las etiquetas automáticamente (este certificado trae los valores sin texto de etiqueta). Asigna cada monto a su casilla:</div>'
        + mapeoManualHtml(r.candidatos)+'</div>';
      bindManual(out, aplicar);
    }
  }

  function init(opts){
    var input=document.getElementById(opts.fileInputId);
    var out=document.getElementById(opts.resultId);
    if(!input || !out) return;
    input.addEventListener('change', function(){
      var file=input.files && input.files[0];
      if(!file) return;
      out.innerHTML='<span style="color:var(--muted)">Leyendo el certificado…</span>';
      extraerTexto(file).then(function(texto){
        if(!global.certParser210){ out.innerHTML='<span style="color:var(--red)">Falta el parser del certificado.</span>'; return; }
        render(global.certParser210.parse(texto), out, opts.aplicar);
      }).catch(function(e){
        out.innerHTML='<span style="color:var(--red)">No se pudo leer el PDF: '+((e&&e.message)||'error')+'</span>';
      });
    });
  }

  global.certUI210 = { init: init, fmt: fmt };
})(typeof window !== 'undefined' ? window : this);
