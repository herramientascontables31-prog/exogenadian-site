/* ═══ Calendario Tributario DIAN 2026 — Render in-page ═══
 * Fuente: dian.gov.co/Calendarios/Calendario_Tributario_2026.pdf
 * Uso: <div id="cal-dian-2026"></div> + <script src="shared/calendario-dian-2026.js"></script>
 * Llamar: renderCalendarioDIAN2026('cal-dian-2026');
 */
(function(){
  'use strict';

  // Tabla por último dígito: [d1, d2, d3, d4, d5, d6, d7, d8, d9, d0]
  function digitsRow(label, dates) {
    var html = '<tr><td class="cal-label">'+label+'</td>';
    for(var i=0;i<10;i++){html+='<td class="cal-date">'+dates[i]+'</td>'}
    html+='</tr>';
    return html;
  }
  function digitsHeader(){
    var h='<tr class="cal-header"><th>Hasta</th>';
    var digs=[1,2,3,4,5,6,7,8,9,0];
    for(var i=0;i<10;i++){h+='<th>'+digs[i]+'</th>'}
    h+='</tr>';
    return h;
  }
  function tipoSection(title, subtitle){
    return '<h3 class="cal-section-title">'+title+(subtitle?' <span style="font-weight:400;color:#6B7280;font-size:.85em">'+subtitle+'</span>':'')+'</h3>';
  }
  function tableOpen(){return '<table class="cal-table"><thead>'+digitsHeader()+'</thead><tbody>'}
  function tableClose(){return '</tbody></table>'}

  function tablaMultiCol(grupos, cols){
    // Distribuye la lista en N columnas lado a lado
    cols=cols||3;
    var perCol=Math.ceil(grupos.length/cols);
    var html='<div class="cal-multicol" style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:10px">';
    for(var c=0;c<cols;c++){
      html+='<table class="cal-table cal-table-mini"><thead><tr><th>Últimos 2 dígitos</th><th>Fecha</th></tr></thead><tbody>';
      var slice=grupos.slice(c*perCol,(c+1)*perCol);
      slice.forEach(function(g){html+='<tr><td class="cal-label">'+g[0]+'</td><td class="cal-date">'+g[1]+'</td></tr>'});
      html+='</tbody></table>';
    }
    html+='</div>';
    return html;
  }

  function tablaPN(){
    // Personas Naturales: 50 grupos por 2 dígitos en 3 columnas (~17 por columna)
    var grupos=[
      ['01-02','12 ago'],['03-04','13 ago'],['05-06','14 ago'],['07-08','18 ago'],['09-10','19 ago'],
      ['11-12','20 ago'],['13-14','21 ago'],['15-16','24 ago'],['17-18','25 ago'],['19-20','26 ago'],
      ['21-22','27 ago'],['23-24','28 ago'],['25-26','31 ago'],['27-28','1 sep'],['29-30','2 sep'],
      ['31-32','3 sep'],['33-34','4 sep'],['35-36','7 sep'],['37-38','8 sep'],['39-40','9 sep'],
      ['41-42','10 sep'],['43-44','11 sep'],['45-46','14 sep'],['47-48','15 sep'],['49-50','16 sep'],
      ['51-52','17 sep'],['53-54','18 sep'],['55-56','21 sep'],['57-58','22 sep'],['59-60','23 sep'],
      ['61-62','24 sep'],['63-64','25 sep'],['65-66','28 sep'],['67-68','1 oct'],['69-70','2 oct'],
      ['71-72','5 oct'],['73-74','6 oct'],['75-76','7 oct'],['77-78','8 oct'],['79-80','9 oct'],
      ['81-82','13 oct'],['83-84','14 oct'],['85-86','15 oct'],['87-88','16 oct'],['89-90','19 oct'],
      ['91-92','20 oct'],['93-94','21 oct'],['95-96','22 oct'],['97-98','23 oct'],['99-00','26 oct']
    ];
    return tablaMultiCol(grupos,3);
  }

  function tablaPeriodica6(label, fechas){
    // Para tablas con 6 períodos x últimos dígitos. fechas: array de 6 arrays de 10 fechas
    var periodos=['Ene-Feb','Mar-Abr','May-Jun','Jul-Ago','Sep-Oct','Nov-Dic'];
    var html='<table class="cal-table"><thead>'+digitsHeader()+'</thead><tbody>';
    for(var i=0;i<6;i++){
      html+=digitsRow(periodos[i],fechas[i]);
    }
    html+='</tbody></table>';
    return html;
  }

  window.renderCalendarioDIAN2026=function(containerId){
    var container=document.getElementById(containerId);
    if(!container)return;

    var html='<div class="cal-dian-content">';
    html+='<p class="cal-source">📅 <strong>Calendario Tributario DIAN 2026</strong> · Reproducción del PDF oficial · <a href="https://www.dian.gov.co/Calendarios/Calendario_Tributario_2026.pdf" target="_blank" rel="noopener" style="color:#059669;font-weight:600">Descargar PDF original ↗</a></p>';

    // ─── RENTA - GC ───
    html+=tipoSection('Renta · Grandes contribuyentes');
    html+=tableOpen();
    html+=digitsRow('Pago 1ra cuota — febrero',['10 feb','11 feb','12 feb','13 feb','16 feb','17 feb','18 feb','19 feb','20 feb','23 feb']);
    html+=digitsRow('Declaración y 2da cuota — abril',['13 abr','14 abr','15 abr','16 abr','17 abr','20 abr','21 abr','22 abr','23 abr','24 abr']);
    html+=digitsRow('Pago 3ra cuota — junio',['10 jun','11 jun','12 jun','16 jun','17 jun','18 jun','19 jun','22 jun','23 jun','24 jun']);
    html+=tableClose();

    // ─── RENTA - PJ ───
    html+=tipoSection('Renta · Personas jurídicas');
    html+=tableOpen();
    html+=digitsRow('Declaración y 1ra cuota — mayo',['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may']);
    html+=digitsRow('Pago 2da cuota — julio',['9 jul','10 jul','13 jul','14 jul','15 jul','16 jul','17 jul','21 jul','22 jul','23 jul']);
    html+=tableClose();

    // ─── RENTA - PN ───
    html+=tipoSection('Renta · Personas naturales','(últimos 2 dígitos del NIT)');
    html+=tablaPN();

    // ─── IVA Bimestral ───
    html+=tipoSection('IVA bimestral','(declaración y pago)');
    html+=tablaPeriodica6('IVA',[
      ['10 mar','11 mar','12 mar','13 mar','16 mar','17 mar','18 mar','19 mar','20 mar','24 mar'],
      ['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may'],
      ['9 jul','10 jul','13 jul','14 jul','15 jul','16 jul','17 jul','21 jul','22 jul','23 jul'],
      ['9 sep','10 sep','11 sep','14 sep','15 sep','16 sep','17 sep','18 sep','21 sep','22 sep'],
      ['11 nov','12 nov','13 nov','17 nov','18 nov','19 nov','20 nov','23 nov','24 nov','25 nov'],
      ['13 ene/27','14 ene/27','15 ene/27','18 ene/27','19 ene/27','20 ene/27','21 ene/27','22 ene/27','25 ene/27','26 ene/27']
    ]);

    // ─── IVA Cuatrimestral ───
    html+=tipoSection('IVA cuatrimestral');
    html+=tableOpen();
    html+=digitsRow('Cuatri 1 (Ene-Abr) — mayo',['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may']);
    html+=digitsRow('Cuatri 2 (May-Ago) — sep',['9 sep','10 sep','11 sep','14 sep','15 sep','16 sep','17 sep','18 sep','21 sep','22 sep']);
    html+=digitsRow('Cuatri 3 (Sep-Dic) — ene/27',['13 ene/27','14 ene/27','15 ene/27','18 ene/27','19 ene/27','20 ene/27','21 ene/27','22 ene/27','25 ene/27','26 ene/27']);
    html+=tableClose();

    // ─── Retención en la fuente ───
    html+=tipoSection('Retención en la fuente','(declaración y pago mensual)');
    html+='<table class="cal-table"><thead>'+digitsHeader()+'</thead><tbody>';
    var ret=[
      ['Enero — feb',['10 feb','11 feb','12 feb','13 feb','16 feb','17 feb','18 feb','19 feb','20 feb','23 feb']],
      ['Febrero — mar',['10 mar','11 mar','12 mar','13 mar','16 mar','17 mar','18 mar','19 mar','20 mar','24 mar']],
      ['Marzo — abr',['13 abr','14 abr','15 abr','16 abr','17 abr','20 abr','21 abr','22 abr','23 abr','24 abr']],
      ['Abril — may',['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may']],
      ['Mayo — jun',['10 jun','11 jun','12 jun','16 jun','17 jun','18 jun','19 jun','22 jun','23 jun','24 jun']],
      ['Junio — jul',['9 jul','10 jul','13 jul','14 jul','15 jul','16 jul','17 jul','21 jul','22 jul','23 jul']],
      ['Julio — ago',['12 ago','13 ago','14 ago','18 ago','19 ago','20 ago','21 ago','24 ago','25 ago','26 ago']],
      ['Agosto — sep',['9 sep','10 sep','11 sep','14 sep','15 sep','16 sep','17 sep','18 sep','21 sep','22 sep']],
      ['Septiembre — oct',['9 oct','13 oct','14 oct','15 oct','16 oct','19 oct','20 oct','21 oct','22 oct','23 oct']],
      ['Octubre — nov',['11 nov','12 nov','13 nov','17 nov','18 nov','19 nov','20 nov','23 nov','24 nov','25 nov']],
      ['Noviembre — dic',['10 dic','11 dic','14 dic','15 dic','16 dic','17 dic','18 dic','21 dic','22 dic','23 dic']],
      ['Diciembre — ene/27',['13 ene/27','14 ene/27','15 ene/27','18 ene/27','19 ene/27','20 ene/27','21 ene/27','22 ene/27','25 ene/27','26 ene/27']]
    ];
    ret.forEach(function(r){html+=digitsRow(r[0],r[1])});
    html+=tableClose();

    // ─── RST anual ───
    html+=tipoSection('Régimen Simple · Declaración anual');
    html+='<table class="cal-table cal-table-rst-anual"><thead><tr><th>Tipo</th><th>1-2</th><th>3-4</th><th>5-6</th><th>7-8</th><th>9-0</th></tr></thead><tbody>';
    html+='<tr><td class="cal-label">Consolidada renta (F260) — abril</td><td class="cal-date">20 abr</td><td class="cal-date">21 abr</td><td class="cal-date">22 abr</td><td class="cal-date">23 abr</td><td class="cal-date">24 abr</td></tr>';
    html+='<tr><td class="cal-label">Consolidada IVA — febrero</td><td class="cal-date">16 feb</td><td class="cal-date">17 feb</td><td class="cal-date">18 feb</td><td class="cal-date">19 feb</td><td class="cal-date">20 feb</td></tr>';
    html+=tableClose();

    // ─── RST anticipo bimestral ───
    html+=tipoSection('Régimen Simple · Anticipo bimestral (F2593)');
    html+=tablaPeriodica6('RST',[
      ['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may'],
      ['10 jun','11 jun','12 jun','16 jun','17 jun','18 jun','19 jun','22 jun','23 jun','24 jun'],
      ['9 jul','10 jul','13 jul','14 jul','15 jul','16 jul','17 jul','21 jul','22 jul','23 jul'],
      ['9 sep','10 sep','11 sep','14 sep','15 sep','16 sep','17 sep','18 sep','21 sep','22 sep'],
      ['11 nov','12 nov','13 nov','17 nov','18 nov','19 nov','20 nov','23 nov','24 nov','25 nov'],
      ['13 ene/27','14 ene/27','15 ene/27','18 ene/27','19 ene/27','20 ene/27','21 ene/27','22 ene/27','25 ene/27','26 ene/27']
    ]);

    // ─── Patrimonio ───
    html+=tipoSection('Patrimonio (F420)');
    html+=tableOpen();
    html+=digitsRow('1ra cuota — mayo',['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may']);
    html+=tableClose();
    html+='<p class="cal-fixed-date"><strong>2da cuota:</strong> 14 sep 2026 (independientemente del NIT)</p>';

    // ─── Activos en el exterior ───
    html+=tipoSection('Activos en el exterior (F160)');
    html+=tableOpen();
    html+=digitsRow('Grandes contribuyentes — abril',['13 abr','14 abr','15 abr','16 abr','17 abr','20 abr','21 abr','22 abr','23 abr','24 abr']);
    html+=digitsRow('Personas jurídicas — mayo',['12 may','13 may','14 may','15 may','19 may','20 may','21 may','22 may','25 may','26 may']);
    html+=tableClose();
    html+='<p class="cal-fixed-date">Personas naturales y RST: mismas fechas que renta personas naturales (12 ago a 26 oct, según últimos 2 dígitos).</p>';

    // ─── Exógena ───
    html+=tipoSection('Información exógena (Res. 000227/2025 mod. Res. 000012/2026)');
    html+=tableOpen();
    html+=digitsRow('Grandes contribuyentes — may',['14 may','15 may','19 may','5 may','6 may','7 may','8 may','11 may','12 may','13 may']);
    html+=tableClose();
    html+='<p style="margin:6px 0 0;font-size:.78rem;color:#92400E">Prórroga Res. DIAN 000012/2026: GC con NIT terminado en 1, 2 y 3 → 14, 15 y 19 may (antes 28-29 abr / 4 may). Dígitos 4-0 sin cambio.</p>';
    html+='<p style="margin:10px 0 6px;font-size:.82rem;color:#374151;font-weight:600">Personas jurídicas / naturales (últimos 2 dígitos del NIT)</p>';
    var exogPJ=[
      ['01-05','14 may'],['06-10','15 may'],['11-15','19 may'],['16-20','20 may'],['21-25','21 may'],
      ['26-30','22 may'],['31-35','25 may'],['36-40','26 may'],['41-45','27 may'],['46-50','28 may'],
      ['51-55','29 may'],['56-60','1 jun'],['61-65','2 jun'],['66-70','3 jun'],['71-75','4 jun'],
      ['76-80','5 jun'],['81-85','9 jun'],['86-90','10 jun'],['91-95','11 jun'],['96-00','12 jun']
    ];
    html+=tablaMultiCol(exogPJ,2);

    // ─── Otros ───
    html+=tipoSection('Otras obligaciones · fechas fijas');
    html+='<table class="cal-table cal-table-fijas"><thead><tr><th>Obligación</th><th>Fecha</th></tr></thead><tbody>';
    html+='<tr><td>Plásticos de un solo uso (presentación y pago)</td><td>13 feb 2026</td></tr>';
    html+='<tr><td>PES — Presencia Económica Significativa (anual)</td><td>23 abr 2026</td></tr>';
    html+='<tr><td>Precios de transferencia · Documentación + informe local/maestro</td><td>9-22 sep (según NIT)</td></tr>';
    html+='<tr><td>Precios de transferencia · Informe país por país</td><td>15 dic 2026</td></tr>';
    html+='<tr><td>RUB — Registro Beneficiarios Finales (4 actualizaciones)</td><td>2 feb · 4 may · 3 ago · 3 nov</td></tr>';
    html+=tableClose();

    html+=tipoSection('PES, Carbono, Bebidas azucaradas, Plásticos','(bimestral · pagos anticipados)');
    html+='<table class="cal-table"><thead><tr><th>Período</th><th>Vence</th></tr></thead><tbody>';
    html+='<tr><td>Ene-Feb</td><td>13 mar 2026</td></tr>';
    html+='<tr><td>Mar-Abr</td><td>15 may 2026</td></tr>';
    html+='<tr><td>May-Jun</td><td>14 jul 2026</td></tr>';
    html+='<tr><td>Jul-Ago</td><td>14 sep 2026</td></tr>';
    html+='<tr><td>Sep-Oct</td><td>17 nov 2026</td></tr>';
    html+='<tr><td>Nov-Dic</td><td>18 ene 2027</td></tr>';
    html+=tableClose();

    html+=tipoSection('Gasolina y ACPM','(declaración mensual y pago)');
    html+='<table class="cal-table"><thead><tr><th>Mes</th><th>Vence</th></tr></thead><tbody>';
    var gas=[['Enero','13 feb'],['Febrero','13 mar'],['Marzo','16 abr'],['Abril','15 may'],['Mayo','16 jun'],['Junio','14 jul'],['Julio','18 ago'],['Agosto','14 sep'],['Septiembre','15 oct'],['Octubre','17 nov'],['Noviembre','15 dic'],['Diciembre','18 ene/27']];
    gas.forEach(function(g){html+='<tr><td>'+g[0]+'</td><td>'+g[1]+'</td></tr>'});
    html+=tableClose();

    html+='<p class="cal-footer">Fuente oficial: <a href="https://www.dian.gov.co/Paginas/CalendarioTributario.aspx" target="_blank" rel="noopener">dian.gov.co/Paginas/CalendarioTributario.aspx</a></p>';
    html+='</div>';

    container.innerHTML=html;
  };
})();
