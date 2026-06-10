/* shared/f1004-spec.js
   Spec compartida del Formato 1004 — Descuentos Tributarios Solicitados (DIAN AG 2025).
   Catálogo verificado contra Prevalidador DIAN AG2025 v3.3.0-26 (hoja "Tablas", filas 430-454)
   el 2026-05-01. 25 conceptos oficiales (el antiguo 8330 ICA Art. 115 fue REMOVIDO porque el
   Art. 115 permite la DEDUCCIÓN del impuesto territorial, no un descuento tributario).

   Expone window.F1004Spec con:
     - CONCEPTOS_F1004: array de [code, nombre]
     - TIPOS_DOC_F1004: object {code: nombre}
     - emptyFila(): retorna objeto fila vacío con shape estándar
     - exportToWorksheet(ws, filas, cfg): escribe la hoja Excel con headers + datos

   Reusable desde exogena.html (integración inline en step 4) y exogena-f1004.html
   (standalone, pendiente refactor). Mantener constantes IDÉNTICAS si se modifican. */
(function(global){
'use strict';

const CONCEPTOS_F1004 = [
  ['8303','Descuento tributario por impuestos pagados en el exterior solicitado como descuento por los contribuyentes nacionales que perciban rentas de fuente extranjera. E.T., art. 254.'],
  ['8305','Descuento tributario empresas de servicios públicos domiciliarios que presten servicios de acueducto y alcantarillado. L. 788/2002, art. 104.'],
  ['8316','Descuento tributario por donaciones dirigida a programas de becas o créditos condonables. E.T. Art. 256, Parágrafo 2, num. i)'],
  ['8317','Descuento tributario por inversiones en investigación, desarrollo tecnológico e innovación. E.T., art. 256, modificado L 2277/2022 art 21'],
  ['8318','Descuento por donaciones efectuadas a entidades sin ánimo de lucro pertenecientes al régimen tributario especial. E.T., art. 257, creado L.1819/2016, art. 105.'],
  ['8319','Descuento tributario por donaciones efectuadas a entidades sin ánimo de lucro no contribuyentes de que tratan los artículos 22 y 23 del estatuto tributario. E.T., art. 257, creado L. 1819/2016, art. 1'],
  ['8320','Descuento tributario para inversiones realizadas en control, conservación y mejoramiento del medio ambiente. E.T., Art. 255, creado L. 1819/2016, art. 103.'],
  ['8321','Descuento tributario por donaciones en la red nacional de bibliotecas públicas y biblioteca nacional E.T., art. 257, parágrafo, creado L. 1819/2016, art. 105.'],
  ['8322','Descuento tributario por donaciones a favor del fondo para reparación de víctimas. Art 177, y DUR 1084 de 2015, art. 2.2.10.6.'],
  ['8323','Descuento tributario por impuestos pagados en el exterior por la Entidad controlada del Exterior (ECE). E.T., art.892, adicionado L 1819/2016, art. 139.'],
  ['8324','Descuento tributario por donación a la Corporación General Gustavo Matamoros D’ Costa y demás fundaciones dedicadas a la defensa, protección de derechos humanos. E.T., art 126-2, inciso 1'],
  ['8325','Descuento tributario por donación a organismos de deporte aficionado. E.T., art. 126-2, inciso. 2.'],
  ['8326','Descuento tributario por donación a organismos deportivos y recreativos o culturales personas jurídicas sin ánimo de lucro, E.T., art. 126-2, inciso 3.'],
  ['8327','Descuento tributario por donaciones efectuadas para el apadrinamiento de parques naturales y conservación de bosques naturales. E.T., art. 126-5.'],
  ['8328','Descuento tributario por aportes al sistema general de pensiones a cargo del empleador que sea contribuyente del impuesto unificado bajo el régimen simple de tributación. E.T., art. 903.'],
  ['8329','Descuento tributario por ventas de bienes o servicios realizados a través de los sistemas de tarjetas de crédito y/o débito y otros mecanismos electrónicos de pagos ART. 912 E.T.'],
  ['8331','Descuento tributario por impuesto sobre las ventas en la importación, formación, construcción, o adquisición de activos fijos reales productivos. Art. 258-1 del E.T. En caso de leasing Financiero, rep'],
  ['8332','Descuento tributario por donaciones a favor del fondo para reparación de víctimas. L. 1448/2011, art 177, y DUR 1084 de 2015, art. 2.2.10.6.'],
  ['8333','Descuento para inversiones realizadas en control, conservación y mejoramiento del medio ambiente en actividades turísticas. E.T., art.255, par.2, adicionado L. 2068/2020, art. 42.'],
  ['8334','Descuento por donaciones realizadas a la agencia de emprendimiento e innovación del Gobierno Nacional iNNpulsa. E.T., art.256, par.2, inc. 2, adicionado L. 2069/2020, art. 41.'],
  ['8336','Descuento por donaciones recibidas por el Fondo Nacional de Financiamiento para la Ciencia, la Tecnología y la Innovación, Fondo Francisco José de Caldas, destinadas al financiamiento de Programas y/o'],
  ['8337','Descuento por remuneración correspondiente a la vinculación de personal con título de doctorado en las empresas contribuyentes de renta, E.T., art.158-1, num.iii), modificado L.1955/2019, art. 170.'],
  ['8338','Descuento por donaciones recibidas por intermedio del Icetex, dirigidas a programas de becas que financien la formación y educación de quienes ingresen a la Fuerza Pública. E.T., art. 58-1, num.iv), a'],
  ['8339','Descuento tributario por el gravamen a los movimientos financieros efectivamente pagado y solicitado, art.912 E.T.'],
  ['8340','Descuento tributario por donaciones efectuadas a bancos de alimentos y entidades sin ánimo de lucro, pertenecientes al Régimen Tributario Especial. E.T., Art 257 par. 1, adicionado Ley 2380/2024. No incluir esta información en el concepto 8318'],
];

const TIPOS_DOC_F1004 = {'11':'Registro civil','12':'Tarjeta identidad','13':'Cédula','21':'Tarjeta extranjería','22':'Cédula extranjería','31':'NIT','41':'Pasaporte','42':'Doc extranjero','43':'Sin ID exterior','47':'PEP','48':'PPT'};

function emptyFila(){
  return {concepto:'', tdoc:'31', nid:'', apl1:'', apl2:'', nom1:'', nom2:'', razon:'', direccion:'', dpto:'', mcp:'', pais:'169', correo:'', valorTotal:0, valorSolicitado:0};
}

/* Escribe la hoja Excel '1004' con headers + datos. Mismo formato que el standalone
   exogena-f1004.html (verificado contra Prevalidador V8). El llamador es quien
   provee el worksheet ya creado (wb.addWorksheet('F1004')). */
function exportToWorksheet(ws, filas, cfg){
  if(!ws || !Array.isArray(filas)) return;
  const hdrFill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF1F4E79'}};
  const hdrFont = {bold:true,color:{argb:'FFFFFFFF'},size:10,name:'Arial'};
  const thinBorder = {top:{style:'thin',color:{argb:'FF808080'}},bottom:{style:'thin',color:{argb:'FF808080'}},left:{style:'thin',color:{argb:'FF808080'}},right:{style:'thin',color:{argb:'FF808080'}}};

  ws.addRow(['1004','1004(V-8) - Descuentos Tributarios Solicitados']);
  ws.getRow(1).getCell(1).font = {bold:true,size:12,color:{argb:'FF1F4E79'}};
  ws.getRow(1).getCell(2).font = {bold:true,size:11,color:{argb:'FF1F4E79'}};
  ws.addRow([]);

  const headers = ['Concepto','Tipo doc tercero','Número ID tercero','Primer apellido','Segundo apellido','Primer nombre','Otros nombres','Razón Social','Dirección','Cód dpto','Cód mcp','Cód País','Correo electrónico','Valor descuento total del año','Valor descuento efectivamente solicitado'];
  const hdr = ws.addRow(headers);
  hdr.eachCell(c=>{c.fill=hdrFill;c.font=hdrFont;c.alignment={horizontal:'center',wrapText:true};c.border=thinBorder});
  hdr.height = 40;

  for(const f of filas){
    const isPJ = String(f.tdoc) === '31';
    const row = [
      parseInt(f.concepto)||0,
      parseInt(f.tdoc)||31,
      String(f.nid||''),
      isPJ?'':String(f.apl1||''), isPJ?'':String(f.apl2||''), isPJ?'':String(f.nom1||''), isPJ?'':String(f.nom2||''),
      isPJ?String(f.razon||''):'',
      String(f.direccion||''), String(f.dpto||''), String(f.mcp||''),
      parseInt(f.pais)||169,
      String(f.correo||''),
      Math.round(Number(f.valorTotal)||0),
      Math.round(Number(f.valorSolicitado)||0)
    ];
    const r = ws.addRow(row);
    r.eachCell((c,ci)=>{
      c.font={size:10,name:'Arial'};c.border=thinBorder;
      const v = row[ci-1];
      if(typeof v==='number') c.numFmt = v<100000?'0':'#,##0';
      else c.numFmt = '@';
    });
  }
  ws.columns.forEach((col,i)=>{col.width = Math.min(Math.max((headers[i]||'').length+1, 10), 28)});
}

global.F1004Spec = { CONCEPTOS_F1004, TIPOS_DOC_F1004, emptyFila, exportToWorksheet };
})(typeof window!=='undefined'?window:globalThis);
