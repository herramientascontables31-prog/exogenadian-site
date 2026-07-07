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
  // Los nombres de archivo los elige el usuario: se escapan antes de pintarlos.
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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

  /* Registro de documentos cargados en la sesión (doc R3: "que muestre cuáles se
     cargaron"). Cada entrada: {nombre, campos|null, aplicado}. */
  var _docs = [];

  function render(r, out, aplicar, nombreDoc, cruce){
    if(r.detectado && (r.confianza==='alta'||r.confianza==='media')){
      var c=r.campos, chk=r.checksum;
      var filas=[['Salarios',c.salarios],['Honorarios',c.honorarios],['Cesantías',c.cesantias],['Pensiones',c.pensiones],['Aporte salud',c.aportesSalud],['Aporte pensión',c.aportesPension],['AFC / voluntarios',c.afc],['Retención',c.retencion]]
        .filter(function(x){return x[1]>0;})
        .map(function(x){return '<div class="live-row"><span class="lbl">'+x[0]+'</span><span class="val">'+fmt(x[1])+'</span></div>';}).join('');
      var badge=r.confianza==='alta'?'<span class="live-tag green">Confianza alta</span>':'<span class="live-tag amber">Revisa</span>';
      var chkHtml = chk.cuadra===true ? '<div style="font-size:.74rem;color:var(--green2)">✔ El total de ingresos cuadra con la suma de pagos.</div>'
                  : chk.cuadra===false ? '<div style="font-size:.74rem;color:var(--amber)">⚠ El total ('+fmt(chk.totalDeclarado)+') no cuadra con la suma de pagos ('+fmt(chk.sumaPagos)+'). Revisa antes de aplicar.</div>' : '';
      // Cruce certificado vs exógena (doc R3): "en la exógena estaba este valor, en el
      // certificado este — es mejor que tomes lo certificado o aclararlo con el cliente".
      var cruceHtml = '';
      if(typeof cruce === 'function'){
        try{
          var difs = cruce(c) || [];
          if(difs.length){
            cruceHtml = '<div style="margin-top:8px;padding:8px 10px;background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;font-size:.76rem;color:#78350F;line-height:1.5">' +
              '<strong>⚖ Certificado vs exógena:</strong><ul style="margin:4px 0 0 16px;padding:0">' +
              difs.map(function(d){ return '<li><b>'+d.campo+'</b>: certificado '+fmt(d.cert)+' · exógena '+fmt(d.exo)+'. '+d.msg+'</li>'; }).join('') +
              '</ul>El certificado es el documento del tercero: normalmente pesa más que el reporte — o aclara la diferencia con el cliente antes de presentar.</div>';
          } else {
            cruceHtml = '<div style="margin-top:8px;font-size:.74rem;color:var(--green2)">✔ Los valores del certificado cuadran con lo que trae la exógena.</div>';
          }
        }catch(_){}
      }
      out.innerHTML='<div style="border:1px solid var(--green2);border-radius:10px;padding:10px;background:#F0FDF4">'
        +(nombreDoc?'<div style="font-size:.74rem;font-weight:700;color:var(--pri);margin-bottom:4px">📎 '+esc(nombreDoc)+'</div>':'')
        +'<div style="margin-bottom:6px">'+badge+' Detecté estos valores en el certificado:</div>'+filas+chkHtml+cruceHtml
        +'<button type="button" data-cert-apply class="btn" style="margin-top:8px">Aplicar al formulario (tomar lo certificado)</button>'
        +'<button type="button" data-cert-manual class="btn-sec" style="margin-top:8px;margin-left:6px">Asignar manualmente</button></div>';
      out.querySelector('[data-cert-apply]').addEventListener('click', function(){
        aplicar(c);
        var d = _docs.filter(function(x){ return x.nombre === nombreDoc; })[0];
        if(d) d.aplicado = true;
        var btn = out.querySelector('[data-cert-apply]');
        if(btn){ btn.disabled = true; btn.textContent = '✓ Aplicado al formulario'; }
      });
      out.querySelector('[data-cert-manual]').addEventListener('click', function(){
        out.innerHTML='<div style="border:1px solid var(--border);border-radius:10px;padding:10px">'+(nombreDoc?'<div style="font-size:.74rem;font-weight:700;color:var(--pri);margin-bottom:4px">📎 '+esc(nombreDoc)+'</div>':'')+mapeoManualHtml(r.candidatos)+'</div>';
        bindManual(out, aplicar);
      });
    } else {
      out.innerHTML='<div style="border:1px solid var(--amber);border-radius:10px;padding:10px;background:#FFFBEB">'
        +(nombreDoc?'<div style="font-size:.74rem;font-weight:700;color:var(--pri);margin-bottom:4px">📎 '+esc(nombreDoc)+'</div>':'')
        +'<div style="font-size:.82rem;margin-bottom:6px">No pude leer las etiquetas automáticamente (este certificado trae los valores sin texto de etiqueta). Asigna cada monto a su casilla:</div>'
        + mapeoManualHtml(r.candidatos)+'</div>';
      bindManual(out, aplicar);
    }
  }

  function renderLista(listaEl){
    if(!listaEl) return;
    if(!_docs.length){ listaEl.innerHTML=''; return; }
    listaEl.innerHTML = '<div style="font-size:.74rem;font-weight:700;color:var(--muted);margin:8px 0 4px">DOCUMENTOS CARGADOS (' + _docs.length + ')</div>' +
      _docs.map(function(d){
        return '<div style="display:flex;justify-content:space-between;gap:8px;font-size:.78rem;padding:3px 0;border-bottom:1px dashed #eef2f7">' +
          '<span>📎 ' + esc(d.nombre) + '</span>' +
          '<span style="white-space:nowrap;color:' + (d.aplicado ? 'var(--green2)' : (d.error ? 'var(--red)' : 'var(--amber)')) + ';font-weight:700">' +
          (d.aplicado ? '✓ aplicado' : (d.error ? '✕ no se pudo leer' : '● leído, sin aplicar')) + '</span></div>';
      }).join('');
  }

  /* Multi-documento (doc R3): procesa TODOS los archivos seleccionados, uno tras otro.
     Cada documento obtiene su propio panel de confirmación + el cruce vs exógena. */
  function init(opts){
    var input=document.getElementById(opts.fileInputId);
    var out=document.getElementById(opts.resultId);
    if(!input || !out) return;
    var listaEl = opts.listaId ? document.getElementById(opts.listaId) : null;
    input.addEventListener('change', function(){
      var files = Array.prototype.slice.call(input.files || []);
      if(!files.length) return;
      files.forEach(function(file){
        var panel = document.createElement('div');
        panel.style.marginTop = '8px';
        panel.innerHTML = '<span style="color:var(--muted)">Leyendo ' + esc(file.name) + '…</span>';
        out.appendChild(panel);
        var reg = { nombre: file.name, aplicado: false, error: false };
        _docs.push(reg);
        extraerTexto(file).then(function(texto){
          if(!global.certParser210){ panel.innerHTML='<span style="color:var(--red)">Falta el parser del certificado.</span>'; reg.error = true; renderLista(listaEl); return; }
          render(global.certParser210.parse(texto), panel, opts.aplicar, file.name, opts.cruce);
          renderLista(listaEl);
        }).catch(function(e){
          reg.error = true;
          panel.innerHTML='<span style="color:var(--red)">No se pudo leer ' + esc(file.name) + ': '+((e&&e.message)||'error')+'</span>';
          renderLista(listaEl);
        });
      });
      input.value = ''; // permite volver a cargar el mismo archivo
    });
  }

  global.certUI210 = { init: init, fmt: fmt, docs: function(){ return _docs; } };
})(typeof window !== 'undefined' ? window : this);
