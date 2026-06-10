/* shared/balance-loader.js
   Cargador de balance de prueba reutilizable. Extraído del flujo de estadosfinancieros.html.
   Expone window.BalanceLoader con:
     - readFile(file) -> Promise<{rawData, sheetName}>
     - autoDetectHeaderRow(rawData) -> int
     - autoDetectColumns(rawData, headerRow) -> colMap
     - classifyAccount(code, name) -> {clase, seccion, corriente, grupo}
     - processRows(rawData, headerRow, colMap) -> classifiedAccounts[]
     - aggregate(accounts) -> {<grupo>: total, _totals: {activo, pasivo, patrimonio, ...}}
     - mountDropZone(container, opts) -> {reset(), getState()}
     - persist(key, payload), recover(key) -> payload | null
     - utils: norm, toNum, cellStr, fN
   Requiere XLSX (cdnjs) cargado en la página.
*/
(function(global){
'use strict';

/* ─────────────── utils ─────────────── */
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim()}
function cellStr(v){const s=String(v??'').trim();return(s==='undefined'||s==='null'||s==='NaN')?'':s}
function toNum(v){
  if(typeof v==='number')return v;
  if(!v)return 0;
  let s=String(v).replace(/[$\s]/g,'');
  if(s.includes(',')&&s.includes('.')){
    if(s.lastIndexOf(',')>s.lastIndexOf('.'))s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  }else if(s.includes(',')&&!s.includes('.')){
    const p=s.split(',');
    if(p[p.length-1].length<=2)s=s.replace(',','.');
    else s=s.replace(/,/g,'');
  }
  return parseFloat(s)||0;
}
function fN(n){return Math.round(n||0).toLocaleString('es-CO')}

/* ─────────────── columnas conocidas ─────────────── */
const COL_FIELDS=[
  {key:'code',label:'Código Cuenta',required:true,hints:['cuenta','codigo','código','code','account']},
  {key:'name',label:'Nombre Cuenta',required:true,hints:['descripcion','nombre cuenta','descripcion cuenta','cuenta contable','description','nombre']},
  {key:'saldoFin',label:'Saldo Final',required:true,hints:['saldo final','saldo total','saldo actual','final','saldo']},
  {key:'deb',label:'Débitos',required:false,hints:['debito','débito','debitos','débitos','debit','movimiento debito']},
  {key:'cre',label:'Créditos',required:false,hints:['credito','crédito','creditos','créditos','credit','movimiento credito']},
  {key:'saldoIni',label:'Saldo Inicial',required:false,hints:['saldo inicial','saldo anterior','inicial']}
];

/* ─────────────── World Office: Método 1 (árbol con Total NNNN + filas de tercero)
   y Método 2 (cols CODIGO|NOMBRE|TERCERO|...). Aplana a 7 cols estándar.
   Si no detecta patrón WO, devuelve data sin cambios. */
function flattenFixedWidthPUCTree(data){
  if(!data||data.length<5)return data;
  function _fwn(v){return String(v==null?'':v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim()}
  function _fwT(v){if(v==null)return 0;if(typeof v==='number')return v;var s=String(v).replace(/[^\d.,\-]/g,'').replace(/\./g,'').replace(',','.');var n=parseFloat(s);return isFinite(n)?n:0}
  var hdr=-1,cC=-1,nC=-1,dC=-1,sI=-1,dB=-1,cR=-1,sF=-1;
  for(var i=0;i<Math.min(30,data.length);i++){
    var r=data[i];if(!r)continue;
    var cc=-1,nc=-1,dc=-1,si=-1,db=-1,cr=-1,sf=-1;
    for(var j=0;j<r.length;j++){
      var h=_fwn(r[j]);if(!h||h.length>50)continue;
      if(cc<0&&(h==='cuenta'||h==='codigo'))cc=j;
      else if(nc<0&&(h==='nit'||h==='identificacion'||h==='tercero'))nc=j;
      else if(dc<0&&(h==='descripcion'||h==='nombre'||h==='nombre cuenta'||h==='cuenta contable'))dc=j;
      else if(si<0&&(h==='saldo anterior'||h==='saldo inicial'))si=j;
      else if(db<0&&(h==='debitos'||h==='debito'||h==='debe'))db=j;
      else if(cr<0&&(h==='creditos'||h==='credito'||h==='haber'))cr=j;
      else if(sf<0&&(h==='nuevo saldo'||h==='saldo final'||h==='saldo actual'||h==='saldo nuevo'))sf=j;
    }
    if(cc>=0&&nc>=0&&dc>=0&&sf>=0&&(db>=0||cr>=0)){hdr=i;cC=cc;nC=nc;dC=dc;sI=si;dB=db;cR=cr;sF=sf;break}
  }
  if(hdr<0)return data;
  var sig=0,terc=0;
  for(var k=hdr+1;k<Math.min(data.length,hdr+300);k++){
    var rr=data[k];if(!rr)continue;
    var c=String(rr[cC]==null?'':rr[cC]);
    var nit=String(rr[nC]==null?'':rr[nC]).trim();
    if(/^\s*\d{1,2}(?:\s{2,}\d{1,2})*\s*$/.test(c)&&c.indexOf('  ')>0){
      var dg=c.replace(/\s+/g,'');
      if(dg.length===1||dg.length===2||dg.length===4||dg.length===6||dg.length===8)sig++;
    }
    if(!c.trim()&&/\d/.test(nit))terc++;
  }
  if(sig<10||terc<5)return data;
  var bucket={},lastCta=null;
  for(var idx=hdr+1;idx<data.length;idx++){
    var row=data[idx];if(!row)continue;
    var cta=String(row[cC]==null?'':row[cC]);
    var nitR=String(row[nC]==null?'':row[nC]).trim();
    var nm=String(row[dC]==null?'':row[dC]).trim();
    var sIv=sI>=0?_fwT(row[sI]):0,dBv=dB>=0?_fwT(row[dB]):0,cRv=cR>=0?_fwT(row[cR]):0,sFv=sF>=0?_fwT(row[sF]):0;
    var dig=cta.replace(/\s+/g,'');
    if(/^\d+$/.test(dig)){
      if(dig.length===4||dig.length===6||dig.length===8){
        if(!bucket[dig])bucket[dig]={name:nm,sIni:0,deb:0,cre:0,sFin:0,terceros:[]};
        bucket[dig].sIni+=sIv;bucket[dig].deb+=dBv;bucket[dig].cre+=cRv;bucket[dig].sFin+=sFv;
        if(!bucket[dig].name)bucket[dig].name=nm;
        lastCta=dig;
      }else{lastCta=null}
    }else if(!cta.trim()&&/\d/.test(nitR)&&lastCta){
      var nC2=nitR.replace(/\D/g,'');
      if(nC2)bucket[lastCta].terceros.push({nit:nC2,name:nm,sIni:sIv,deb:dBv,cre:cRv,sFin:sFv});
    }
  }
  var flat=[['Código','Nombre Cuenta','NIT','Saldo Inicial','Débitos','Créditos','Saldo Final','Nombre Tercero']];
  for(var code in bucket){
    var b=bucket[code];
    if(b.terceros.length>0){
      for(var t=0;t<b.terceros.length;t++){var tt=b.terceros[t];flat.push([code,b.name,tt.nit,tt.sIni,tt.deb,tt.cre,tt.sFin,tt.name])}
    }else if(code.length===8){
      flat.push([code,b.name,'',b.sIni,b.deb,b.cre,b.sFin,'']);
    }
  }
  if(flat.length<2)return data;
  return flat;
}

function flattenWorldOfficeTree(data){data=flattenFixedWidthPUCTree(data);
  if(!data||data.length<3)return data;
  var fmt='generic',hdrRow=-1,sIniCol=-1,debCol=-1,creCol=-1,sFinCol=-1;
  for(var i=0;i<Math.min(15,data.length);i++){
    var r=data[i];if(!r)continue;
    var c0=norm(cellStr(r[0])),c1=norm(cellStr(r[1])),c2=norm(cellStr(r[2]));
    if(r.length>=8){
      var c3=norm(cellStr(r[3])),c4=norm(cellStr(r[4])),c5=norm(cellStr(r[5])),c6=norm(cellStr(r[6])),c7=norm(cellStr(r[7]));
      if(c0==='codigo'&&c1.indexOf('nombre')>=0&&c2==='debe'&&c3==='haber'&&c4==='debe'&&c5==='haber'&&c6==='debe'&&c7==='haber'){fmt='odoo';hdrRow=i;break}
    }
    if(c0==='codigo'&&c1.indexOf('nombre')>=0&&c2==='tercero'){fmt='wo_metodo2';hdrRow=i;break}
    if(c0==='nivel'&&r.length>=8){
      var sIn=-1,dBn=-1,cRn=-1,sFn=-1;
      for(var kn=0;kn<r.length;kn++){
        var hn=norm(cellStr(r[kn]));if(!hn)continue;
        if(sIn<0&&hn.indexOf('saldo inicial')>=0)sIn=kn;
        else if(dBn<0&&(hn.indexOf('debito')>=0||hn.indexOf('movimiento debito')>=0))dBn=kn;
        else if(cRn<0&&(hn.indexOf('credito')>=0||hn.indexOf('movimiento credito')>=0))cRn=kn;
        else if(sFn<0&&hn.indexOf('saldo final')>=0)sFn=kn;
      }
      if(sFn>=0){fmt='wo_nivel';hdrRow=i;sIniCol=sIn;debCol=dBn;creCol=cRn;sFinCol=sFn;break}
    }
    if(!c0&&c1.indexOf('saldo inicial')>=0){
      var hasTotal=false;
      for(var j=i+1;j<Math.min(data.length,i+80);j++){if(/^Total\s+\d/i.test(cellStr((data[j]||[])[0]))){hasTotal=true;break}}
      if(hasTotal){
        fmt='wo_metodo1';hdrRow=i;
        for(var k=1;k<r.length;k++){
          var h=norm(cellStr(r[k]));if(!h)continue;
          if(sIniCol<0&&h.indexOf('saldo inicial')>=0)sIniCol=k;
          else if(debCol<0&&(h.indexOf('debito')>=0||h==='debe'))debCol=k;
          else if(creCol<0&&(h.indexOf('credito')>=0||h==='haber'))creCol=k;
          else if(sFinCol<0&&h.indexOf('saldo final')>=0)sFinCol=k;
        }
        break;
      }
    }
  }
  if(fmt==='generic')return data;
  var flat=[['Código','Nombre Cuenta','Tercero','Saldo Inicial','Débitos','Créditos','Saldo Final']];
  if(fmt==='odoo'){
    for(var io=hdrRow+1;io<data.length;io++){
      var ro=data[io];if(!ro)continue;
      var co0=cellStr(ro[0]),co1=cellStr(ro[1]);
      var ocode='',oname='';
      if(/^\d+$/.test(co0.replace(/\s/g,''))){ocode=co0.replace(/\s/g,'');oname=co1}
      else if(!co0&&co1){var omm=co1.match(/^(\d+)\s+(.+)$/);if(omm){ocode=omm[1];oname=omm[2].trim()}}
      if(!ocode)continue;
      if(/^(total|procesado|elaborado)/i.test(oname))continue;
      flat.push([ocode,oname,'',toNum(ro[2])-toNum(ro[3]),toNum(ro[4]),toNum(ro[5]),toNum(ro[6])-toNum(ro[7])]);
    }
    return flat;
  }
  if(fmt==='wo_metodo2'){
    // Consolidar por código: si hay agg sin tercero, usarlo (1 fila por código).
    // Si solo hay detalles con NIT, SUMAR todos los detalles (deduplicando filas idénticas)
    // para que los totales reflejen la realidad del balance.
    var groups={};
    for(var i2=hdrRow+1;i2<data.length;i2++){
      var r2=data[i2];if(!r2)continue;
      var code=cellStr(r2[0]).replace(/\s/g,'');
      if(!code||!/^\d+$/.test(code))continue;
      var tercero=cellStr(r2[2]);
      if(!groups[code])groups[code]={agg:[],detalles:[]};
      var row={tercero:tercero,name:cellStr(r2[1]),sIni:toNum(r2[3]),deb:toNum(r2[4]),cre:toNum(r2[5]),sFin:toNum(r2[6])};
      if(tercero)groups[code].detalles.push(row);
      else groups[code].agg.push(row);
    }
    for(var ck in groups){
      var g=groups[ck];
      if(g.agg.length){
        var a=g.agg[0];
        flat.push([ck,a.name,'',a.sIni,a.deb,a.cre,a.sFin]);
      }else if(g.detalles.length){
        var seen={},sI=0,dB=0,cR=0,sF=0,nm='';
        for(var di=0;di<g.detalles.length;di++){
          var d=g.detalles[di];
          var k=d.tercero+'|'+d.sIni+'|'+d.deb+'|'+d.cre+'|'+d.sFin;
          if(seen[k])continue;seen[k]=true;
          sI+=d.sIni;dB+=d.deb;cR+=d.cre;sF+=d.sFin;
          if(!nm)nm=d.name;
        }
        flat.push([ck,nm,'',sI,dB,cR,sF]);
      }
    }
    return flat;
  }
  if(fmt==='wo_nivel'){
    var groupsN={};
    for(var iN=hdrRow+1;iN<data.length;iN++){
      var rN=data[iN];if(!rN)continue;
      if(norm(cellStr(rN[1]))!=='si')continue;
      var codeN=cellStr(rN[2]).replace(/\s/g,'');
      if(!codeN||!/^\d+$/.test(codeN))continue;
      var terceroN=cellStr(rN[4])||cellStr(rN[5]);
      if(!groupsN[codeN])groupsN[codeN]={agg:[],detalles:[]};
      var rowN={tercero:terceroN,name:cellStr(rN[3]),sIni:sIniCol>=0?toNum(rN[sIniCol]):0,deb:debCol>=0?toNum(rN[debCol]):0,cre:creCol>=0?toNum(rN[creCol]):0,sFin:sFinCol>=0?toNum(rN[sFinCol]):0};
      if(terceroN)groupsN[codeN].detalles.push(rowN);
      else groupsN[codeN].agg.push(rowN);
    }
    for(var ckN in groupsN){
      var gN=groupsN[ckN];
      if(gN.detalles.length){
        var seenN={},sIN=0,dBN=0,cRN=0,sFN=0,nmN='';
        for(var dnI=0;dnI<gN.detalles.length;dnI++){
          var dN=gN.detalles[dnI];
          var kN=dN.tercero+'|'+dN.sIni+'|'+dN.deb+'|'+dN.cre+'|'+dN.sFin;
          if(seenN[kN])continue;seenN[kN]=true;
          sIN+=dN.sIni;dBN+=dN.deb;cRN+=dN.cre;sFN+=dN.sFin;
          if(!nmN)nmN=dN.name;
        }
        flat.push([ckN,nmN,'',sIN,dBN,cRN,sFN]);
      }else if(gN.agg.length){
        var aN=gN.agg[0];
        flat.push([ckN,aN.name,'',aN.sIni,aN.deb,aN.cre,aN.sFin]);
      }
    }
    return flat;
  }
  var codeNames={},current=null;
  function _emit(){
    if(!current)return;
    if(current.terceros.length){
      var agg={sIni:0,deb:0,cre:0,sFin:0};
      for(var t=0;t<current.terceros.length;t++){agg.sIni+=current.terceros[t].sIni;agg.deb+=current.terceros[t].deb;agg.cre+=current.terceros[t].cre;agg.sFin+=current.terceros[t].sFin}
      flat.push([current.code,current.name||codeNames[current.code]||'','',agg.sIni,agg.deb,agg.cre,agg.sFin]);
    }
    current=null;
  }
  for(var i3=hdrRow+1;i3<data.length;i3++){
    var r3=data[i3];if(!r3)continue;
    var a=cellStr(r3[0]);if(!a)continue;
    var mt=a.match(/^Total\s+(\d+)\s*(.*)$/i);
    if(mt){
      if(current&&current.code===mt[1]){
        if(!current.terceros.length){
          var sI=sIniCol>=0?toNum(r3[sIniCol]):0,dB=debCol>=0?toNum(r3[debCol]):0,cR=creCol>=0?toNum(r3[creCol]):0,sF=sFinCol>=0?toNum(r3[sFinCol]):0;
          flat.push([current.code,current.name||(mt[2]||'').trim()||codeNames[current.code]||'','',sI,dB,cR,sF]);
          current=null;
        }else{_emit()}
      }
      continue;
    }
    var mh=a.match(/^(\d+)(?:\s+(.+))?$/);
    if(mh){
      if(current)_emit();
      var hcode=mh[1],hname=(mh[2]||'').trim();
      if(hname)codeNames[hcode]=hname;
      current={code:hcode,name:hname||codeNames[hcode]||'',terceros:[]};
      continue;
    }
    if(current){current.terceros.push({sIni:sIniCol>=0?toNum(r3[sIniCol]):0,deb:debCol>=0?toNum(r3[debCol]):0,cre:creCol>=0?toNum(r3[creCol]):0,sFin:sFinCol>=0?toNum(r3[sFinCol]):0})}
  }
  if(current)_emit();
  return flat;
}

/* ─────────────── Multi-nivel "CodCuentaNivelN / Det5" ───────────────
   Formato típico de exports contables con columnas explícitas por nivel del PUC:
   "CodCuentaNivel1" (clase) ... "CodCuentaNivel5" (auxiliar, con código+nombre
   concatenado tipo "13050501 DEUDORES NACIONALES") + "SaldoInicialDet5",
   "TotalDebitosDet5", "TotalCreditosDet5", "SaldoFinalDet5". Aplana a 7 cols
   estándar tomando la columna del nivel más alto disponible y separando
   código y nombre. Si el patrón no se detecta, devuelve data sin cambios. */
function flattenMultiNivelTree(data){
  if(!data||data.length<3)return data;
  var hdrIdx=-1,levels=[],si=-1,db=-1,cr=-1,sf=-1;
  for(var i=0;i<Math.min(10,data.length);i++){
    var r=data[i];if(!r)continue;
    var lv=[],_si=-1,_db=-1,_cr=-1,_sf=-1;
    for(var j=0;j<r.length;j++){
      var h=String(r[j]||'').trim();
      var m=h.match(/^CodCuentaNivel(\d+)$/i);
      if(m){lv.push({n:parseInt(m[1],10),col:j});continue}
      if(_si<0&&/SaldoInicial(Det\d+)?$/i.test(h))_si=j;
      else if(_db<0&&/TotalDebitos(Det\d+)?$/i.test(h))_db=j;
      else if(_cr<0&&/TotalCreditos(Det\d+)?$/i.test(h))_cr=j;
      else if(_sf<0&&/SaldoFinal(Det\d+)?$/i.test(h))_sf=j;
    }
    if(lv.length>=2&&_sf>=0){
      hdrIdx=i;levels=lv.sort(function(a,b){return b.n-a.n});si=_si;db=_db;cr=_cr;sf=_sf;break;
    }
  }
  if(hdrIdx<0)return data;
  var flat=[['Código','Nombre','Tercero','Saldo Inicial','Débitos','Créditos','Saldo Final']];
  var maxLvlCol=levels[0].col;
  for(var i2=hdrIdx+1;i2<data.length;i2++){
    var r2=data[i2];if(!r2)continue;
    // Solo emite hojas (filas con valor en el nivel más detallado); las padres se omiten
    var deepest=String(r2[maxLvlCol]||'').trim();
    if(!deepest)continue;
    var code='',name='';
    var mm=deepest.match(/^(\d{2,})\s+(.+)$/);
    if(mm){code=mm[1];name=mm[2].trim()}
    else if(/^\d{2,}$/.test(deepest))code=deepest;
    else continue;
    flat.push([code,name,'',
      si>=0?toNum(r2[si]):0,
      db>=0?toNum(r2[db]):0,
      cr>=0?toNum(r2[cr]):0,
      sf>=0?toNum(r2[sf]):0
    ]);
  }
  return flat;
}

/* ─────────────── Simit "Balance clasificado" ───────────────
   Formato del software contable Simit: códigos PUC repartidos en cols 0-5
   por nivel jerárquico (clase 1 dígito, grupo 2, cuenta 4, subcuenta 6,
   auxiliar 8). Headers: "Nombre" + "Saldo Anterior" + "Débito" + "Crédito"
   + "Saldo Actual". Aplana a 6 cols estándar. Si el patrón no se detecta,
   devuelve data sin cambios. */
function flattenSimitTree(data){
  if(!data||data.length<5)return data;
  var hdrIdx=-1,sIniCol=-1,debCol=-1,creCol=-1,sFinCol=-1,nameCol=-1;
  for(var i=0;i<Math.min(15,data.length);i++){
    var row=data[i];if(!row)continue;
    var fSI=-1,fDb=-1,fCr=-1,fSF=-1,fNm=-1;
    for(var j=0;j<row.length;j++){
      var h=norm(cellStr(row[j]));if(!h||h.length>40)continue;
      if(fSI<0&&h.indexOf('saldo anterior')>=0)fSI=j;
      else if(fDb<0&&(h==='debito'||h==='debitos'||h.indexOf('debito')>=0))fDb=j;
      else if(fCr<0&&(h==='credito'||h==='creditos'||h.indexOf('credito')>=0))fCr=j;
      else if(fSF<0&&(h.indexOf('saldo actual')>=0||h.indexOf('saldo final')>=0||h.indexOf('nuevo saldo')>=0))fSF=j;
      else if(fNm<0&&h==='nombre')fNm=j;
    }
    if(fSI>=0&&fDb>=0&&fCr>=0&&fNm>=0){
      hdrIdx=i;sIniCol=fSI;debCol=fDb;creCol=fCr;sFinCol=fSF;nameCol=fNm;break;
    }
  }
  if(hdrIdx<0||nameCol<2)return data;
  // Confirma shape "árbol": en >=50% de filas con dato, el código aparece en cols >=1
  var treeRows=0,totalRows=0;
  for(var i2=hdrIdx+1;i2<Math.min(data.length,hdrIdx+50);i2++){
    var r2=data[i2];if(!r2)continue;
    for(var j2=0;j2<nameCol;j2++){
      var v2=cellStr(r2[j2]).replace(/\s/g,'');
      if(/^\d{1,10}$/.test(v2)){totalRows++;if(j2>=1)treeRows++;break}
    }
  }
  if(totalRows<5||treeRows/Math.max(totalRows,1)<0.5)return data;
  var flat=[['Cuenta','Nombre','Saldo Anterior','Débito','Crédito','Saldo Actual']];
  for(var i3=hdrIdx+1;i3<data.length;i3++){
    var r3=data[i3];if(!r3)continue;
    var code='';
    for(var j3=0;j3<nameCol;j3++){
      var v3=cellStr(r3[j3]).replace(/\s/g,'');
      if(/^\d{1,10}$/.test(v3)){code=v3;break}
    }
    if(!code)continue;
    var name=cellStr(r3[nameCol]);
    if(/^(total|procesado|elaborado)/i.test(name))continue;
    flat.push([
      code,name,
      sIniCol>=0?r3[sIniCol]:0,
      debCol>=0?r3[debCol]:0,
      creCol>=0?r3[creCol]:0,
      sFinCol>=0?r3[sFinCol]:0
    ]);
  }
  return flat;
}

/* ─────────────── lectura archivo ─────────────── */
function readFile(file){
  return new Promise(function(resolve,reject){
    if(typeof XLSX==='undefined'){reject(new Error('XLSX no disponible. Asegúrate de cargar la librería xlsx antes de balance-loader.js.'));return}
    var MAX=20*1024*1024;
    if(file.size>MAX){reject(new Error('El archivo excede el límite de 20 MB.'));return}
    var ext=file.name.split('.').pop().toLowerCase();
    if(['xlsx','xls','csv'].indexOf(ext)===-1){reject(new Error('Formato no soportado. Usa Excel (.xlsx, .xls) o CSV.'));return}
    var reader=new FileReader();
    reader.onerror=function(){reject(new Error('Error leyendo el archivo.'))};
    reader.onload=function(e){
      try{
        var wb=XLSX.read(new Uint8Array(e.target.result),{type:'array',cellDates:true});
        if(!wb.SheetNames||!wb.SheetNames.length){reject(new Error('El archivo no tiene hojas de datos.'));return}
        // Reparar !ref malformado (ej. World Office exporta "A1:A44" cuando hay datos hasta H).
        // sheet_to_json honra !ref, así que sin esto el parser ve solo la primera columna.
        for(var _si=0;_si<wb.SheetNames.length;_si++){
          var _ws=wb.Sheets[wb.SheetNames[_si]];if(!_ws)continue;
          try{
            var _minR=Infinity,_minC=Infinity,_maxR=-1,_maxC=-1,_hasCell=false;
            for(var _k in _ws){
              if(!_ws.hasOwnProperty(_k)||_k.charAt(0)==='!')continue;
              var _a=XLSX.utils.decode_cell(_k);_hasCell=true;
              if(_a.r<_minR)_minR=_a.r;if(_a.c<_minC)_minC=_a.c;
              if(_a.r>_maxR)_maxR=_a.r;if(_a.c>_maxC)_maxC=_a.c;
            }
            if(_hasCell){
              var _realRef=XLSX.utils.encode_range({s:{r:_minR,c:_minC},e:{r:_maxR,c:_maxC}});
              if(_ws['!ref']!==_realRef)_ws['!ref']=_realRef;
            }
          }catch(_e){}
        }
        // 1) Si hay hoja "Balance clasificado" (típica de Simit/F110_AG2025_MEGA), prefiérela.
        // 2) Si no, evalúa cada hoja y quédate con la que parezca un balance (tiene cabeceras
        //    tipo "saldo", "débito/crédito", "cuenta" en sus primeras filas y suficientes datos).
        //    Cubre archivos con hojas auxiliares delante (Hoja2, Instrucciones, ExportarAExcel, etc.)
        var sheetName=null;
        for(var sn=0;sn<wb.SheetNames.length;sn++){
          if(/balance\s*clasificado/i.test(wb.SheetNames[sn])){sheetName=wb.SheetNames[sn];break}
        }
        function scoreSheet(name){
          try{
            var s=wb.Sheets[name];
            var d=XLSX.utils.sheet_to_json(s,{header:1,defval:''});
            if(!d||d.length<5)return -1;
            var sc=0,nonEmptyRows=0;
            var hints=['saldo','debito','débito','credito','crédito','cuenta','codigo','código','nombre','tercero','nivel'];
            for(var i=0;i<Math.min(20,d.length);i++){
              var r=d[i];if(!r)continue;
              var has=false;
              for(var k=0;k<r.length;k++){
                var v=String(r[k]||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
                if(!v||v.length>50)continue;
                for(var hi=0;hi<hints.length;hi++){if(v.indexOf(hints[hi])>=0){sc+=2;has=true;break}}
                if(/^\d{2,}/.test(v.replace(/\s/g,'')))sc+=1; // códigos PUC en cualquier col
              }
              if(has||r.some(function(x){return x!==''&&x!=null}))nonEmptyRows++;
            }
            if(nonEmptyRows<5)return -1;
            return sc;
          }catch(e){return -1}
        }
        if(!sheetName){
          var best=-1,bestName=null;
          for(var si=0;si<wb.SheetNames.length;si++){
            var sScore=scoreSheet(wb.SheetNames[si]);
            if(sScore>best){best=sScore;bestName=wb.SheetNames[si]}
          }
          sheetName=bestName||wb.SheetNames[0];
        }
        var sheet=wb.Sheets[sheetName];
        var rawData=XLSX.utils.sheet_to_json(sheet,{header:1,defval:''});
        if(!rawData.length){reject(new Error('El archivo está vacío.'));return}
        rawData=flattenMultiNivelTree(rawData);
        rawData=flattenWorldOfficeTree(rawData);
        rawData=flattenSimitTree(rawData);
        resolve({rawData:rawData,sheetName:sheetName,fileName:file.name});
      }catch(err){reject(err)}
    };
    reader.readAsArrayBuffer(file);
  });
}

/* ─────────────── detección encabezado/columnas ─────────────── */
function hintMatch(cellText,hint){if(cellText.length>50)return false;return cellText===hint||cellText.includes(hint)}

function autoDetectHeaderRow(rawData){
  var bestRow=0,bestScore=0;
  for(var i=0;i<Math.min(20,rawData.length);i++){
    var row=rawData[i];if(!row)continue;
    var rn=row.map(function(c){return norm(cellStr(c))});
    var matched=0;
    for(var f=0;f<COL_FIELDS.length;f++){
      var field=COL_FIELDS[f],found=false;
      for(var k=0;k<rn.length;k++){
        if(!rn[k]||found)continue;
        for(var h=0;h<field.hints.length;h++){if(hintMatch(rn[k],field.hints[h])){found=true;break}}
      }
      if(found)matched++;
    }
    if(matched>bestScore){bestScore=matched;bestRow=i}
  }
  if(bestScore<2){
    for(var ii=0;ii<Math.min(15,rawData.length);ii++){
      var row2=rawData[ii];if(!row2)continue;
      var rn2=row2.map(function(c){return norm(cellStr(c))});
      var allHints=COL_FIELDS.reduce(function(a,f){return a.concat(f.hints)},[]);
      var score=0;
      for(var kk=0;kk<rn2.length;kk++){
        if(!rn2[kk]||rn2[kk].length>50)continue;
        for(var hh=0;hh<allHints.length;hh++){if(rn2[kk].includes(allHints[hh])){score++;break}}
      }
      if(score>=2)return ii;
    }
  }
  return bestRow;
}

function autoDetectColumns(rawData,headerRow){
  var colMap={code:-1,name:-1,saldoFin:-1,deb:-1,cre:-1,saldoIni:-1};
  var row=rawData[headerRow];if(!row)return colMap;
  var headers=row.map(function(c){return norm(cellStr(c))});
  // Pre-pass: si una columna inicia con "codigo"/"código" es code; si inicia con
  // "nombre"/"descripcion" es name. Resuelve "Código cuenta contable" vs
  // "Nombre cuenta contable" (World Office por tercero, caso TA SAS) sin que
  // el hint genérico 'cuenta contable' los confunda.
  for(var pj=0;pj<headers.length;pj++){
    var ph=headers[pj];if(!ph||ph.length>50)continue;
    if(colMap.code===-1 && (ph.indexOf('codigo')===0 || ph.indexOf('código')===0)){
      colMap.code=pj;
    } else if(colMap.name===-1 && (ph.indexOf('nombre')===0 || ph.indexOf('descripcion')===0 || ph.indexOf('descripción')===0)){
      colMap.name=pj;
    }
  }
  var fieldOrder=['saldoIni','saldoFin','name','deb','cre','code'];
  fieldOrder.forEach(function(key){
    var field=COL_FIELDS.find(function(f){return f.key===key});if(!field)return;
    for(var j=0;j<headers.length;j++){
      var h=headers[j];if(!h||h.length>50)continue;
      var taken=Object.keys(colMap).some(function(k){return colMap[k]===j});
      if(taken)continue;
      for(var hi=0;hi<field.hints.length;hi++){if(hintMatch(h,field.hints[hi])){colMap[key]=j;break}}
      if(colMap[key]!==-1)break;
    }
  });
  if(colMap.code===-1){
    for(var j=0;j<headers.length;j++){
      var taken=Object.keys(colMap).some(function(k){return colMap[k]===j});
      if(taken)continue;
      var h=headers[j];
      if(h&&(h==='cuenta'||h.includes('codigo')||h.includes('código')||h.includes('code'))){colMap.code=j;break}
    }
  }
  if(colMap.code===-1){
    var taken0=Object.keys(colMap).some(function(k){return colMap[k]===0});
    if(!taken0)colMap.code=0;
  }
  return colMap;
}

/* ─────────────── clasificación PUC ─────────────── */
function classifyAccount(code,name){
  var c=String(code);
  var n=norm(name||'');
  var c2=c.substring(0,2);
  var c4=c.substring(0,4);
  var clase='',seccion='',corriente='',grupo='';

  if(c.startsWith('1')){
    clase='Activo';
    if(c2==='11'){seccion='Efectivo y equivalentes de efectivo';corriente='Corriente';grupo='efectivo'}
    else if(c2==='12'){
      if(n.includes('largo plazo')||n.includes('permanente')||c4==='1205'){seccion='Inversiones a largo plazo';corriente='No corriente';grupo='inv_lp'}
      else{seccion='Inversiones a corto plazo';corriente='Corriente';grupo='inv_cp'}
    }
    else if(c4==='1399'){seccion='(-) Deterioro de cartera';corriente='Corriente';grupo='deterioro_cartera'}
    else if(c2==='13'){seccion='Deudores comerciales y otras CxC';corriente='Corriente';grupo='cxc'}
    else if(c2==='14'){seccion='Inventarios';corriente='Corriente';grupo='inventarios'}
    else if(c4==='1592'){seccion='(-) Depreciación acumulada';corriente='No corriente';grupo='depreciacion'}
    else if(c2==='15'){seccion='Propiedad, planta y equipo';corriente='No corriente';grupo='ppe'}
    else if(c4==='1698'){seccion='(-) Amortización acumulada';corriente='No corriente';grupo='amortizacion'}
    else if(c2==='16'){seccion='Activos intangibles';corriente='No corriente';grupo='intangibles'}
    else if(c2==='17'){seccion='Diferidos / Otros activos';corriente='Corriente';grupo='diferidos_act'}
    else if(c2==='18'){seccion='Otros activos no corrientes';corriente='No corriente';grupo='otros_act_nc'}
    else if(c2==='19'){seccion='Valorizaciones';corriente='No corriente';grupo='valorizaciones'}
    else{seccion='Otros activos';corriente='Corriente';grupo='otros_act'}
  }
  else if(c.startsWith('2')){
    clase='Pasivo';
    if(c2==='21'){
      if(n.includes('largo plazo')||n.includes('l.p')||n.includes('lp')){seccion='Obligaciones financieras LP';corriente='No corriente';grupo='oblig_fin_lp'}
      else{seccion='Obligaciones financieras CP';corriente='Corriente';grupo='oblig_fin_cp'}
    }
    else if(c2==='22'){seccion='Proveedores';corriente='Corriente';grupo='proveedores'}
    else if(c2==='23'){seccion='Cuentas por pagar';corriente='Corriente';grupo='cxp'}
    else if(c2==='24'){seccion='Impuestos por pagar';corriente='Corriente';grupo='impuestos'}
    else if(c2==='25'){seccion='Obligaciones laborales';corriente='Corriente';grupo='laborales'}
    else if(c2==='26'){seccion='Pasivos estimados / Provisiones';corriente='Corriente';grupo='provisiones'}
    else if(c2==='27'){seccion='Diferidos pasivo';corriente='No corriente';grupo='diferidos_pas'}
    else if(c2==='28'||c2==='29'){seccion='Otros pasivos';corriente='No corriente';grupo='otros_pas'}
    else{seccion='Otros pasivos';corriente='Corriente';grupo='otros_pas_c'}
  }
  else if(c.startsWith('3')){
    clase='Patrimonio';corriente='';
    if(c2==='31'){seccion='Capital social';grupo='capital'}
    else if(c2==='32'){seccion='Superávit de capital';grupo='superavit_cap'}
    else if(c2==='33'){seccion='Reservas';grupo='reservas'}
    else if(c2==='34'){seccion='Revalorización del patrimonio';grupo='revalorizacion'}
    else if(c2==='36'){seccion='Resultado del ejercicio';grupo='resultado_ej'}
    else if(c2==='37'){seccion='Resultados de ejercicios anteriores';grupo='resultados_ant'}
    else if(c2==='38'){seccion='Superávit por valorizaciones';grupo='superavit_val'}
    else{seccion='Otros componentes patrimonio';grupo='otros_pat'}
  }
  else if(c.startsWith('4')){
    clase='Ingreso';corriente='';
    if(c4==='4175'){seccion='(-) Devoluciones, rebajas y descuentos';grupo='dev_ventas'}
    else if(c2==='41'){seccion='Ingresos de actividades ordinarias';grupo='ing_operacionales'}
    else if(c2==='42'){seccion='Otros ingresos';grupo='ing_no_operacionales'}
    else{seccion='Otros ingresos';grupo='otros_ing'}
  }
  else if(c.startsWith('5')){
    clase='Gasto';corriente='';
    // Subgrupos para razones financieras (DEPAM, financieros)
    if(c4==='5160'||c4==='5260'||c4==='5165'||c4==='5265'){seccion='Depreciación y amortización';grupo='depam'}
    else if(c2==='53'&&(c4==='5305'||c.startsWith('5305'))){seccion='Gastos financieros';grupo='gtos_fin'}
    else if(c2==='51'){seccion='Gastos de administración';grupo='gtos_admin'}
    else if(c2==='52'){seccion='Gastos de ventas';grupo='gtos_ventas'}
    else if(c2==='53'){seccion='Otros gastos';grupo='gtos_no_op'}
    else if(c2==='54'){seccion='Impuesto de renta';grupo='imp_renta'}
    else if(c2==='59'){seccion='Ganancias y pérdidas';grupo='gyp'}
    else{seccion='Otros gastos';grupo='otros_gtos'}
  }
  else if(c.startsWith('6')){clase='Costo';corriente='';seccion='Costo de ventas';grupo='costo_ventas'}
  else if(c.startsWith('7')){clase='Costo producción';corriente='';seccion='Costos de producción (transitorio)';grupo='costo_prod'}
  else{clase='Otro';seccion='Sin clasificar';corriente='';grupo='otro'}
  return{clase:clase,seccion:seccion,corriente:corriente,grupo:grupo};
}

/* ─────────────── procesar filas → cuentas clasificadas ─────────────── */
function processRows(rawData,headerRow,colMap){
  var accounts=[];
  var allCodes=new Set();
  for(var i=headerRow+1;i<rawData.length;i++){
    var row=rawData[i];if(!row)continue;
    var code=cellStr(row[colMap.code]).replace(/\s/g,'');
    if(code&&/^\d{2,}$/.test(code))allCodes.add(code);
  }
  function isParent(code){
    var others=Array.from(allCodes);
    for(var k=0;k<others.length;k++){
      var o=others[k];
      if(o!==code&&o.startsWith(code)&&o.length>code.length)return true;
    }
    return false;
  }
  for(var i=headerRow+1;i<rawData.length;i++){
    var row=rawData[i];if(!row)continue;
    var code=cellStr(row[colMap.code]).replace(/\s/g,'');
    if(!code||!/^\d{2,}$/.test(code))continue;
    if(/^(total|procesado|elaborado)/i.test(cellStr(row[colMap.name]||'')))continue;
    if(isParent(code))continue;

    var name=colMap.name>=0?cellStr(row[colMap.name]):'';
    var saldoFin=colMap.saldoFin>=0?toNum(row[colMap.saldoFin]):0;
    var deb=colMap.deb>=0?toNum(row[colMap.deb]):0;
    var cre=colMap.cre>=0?toNum(row[colMap.cre]):0;
    var saldoIni=colMap.saldoIni>=0?toNum(row[colMap.saldoIni]):0;

    if(colMap.saldoFin<0&&saldoFin===0&&(deb!==0||cre!==0)){
      var firstDigit=code[0];
      if(['1','5','6','7'].includes(firstDigit))saldoFin=deb-cre+saldoIni;
      else saldoFin=cre-deb+saldoIni;
    }
    if(saldoFin===0)continue;
    var cls=classifyAccount(code,name);
    accounts.push({
      code:code,name:name,saldoFin:saldoFin,deb:deb,cre:cre,saldoIni:saldoIni,
      clase:cls.clase,seccion:cls.seccion,corriente:cls.corriente,grupo:cls.grupo
    });
  }
  return accounts;
}

/* ─────────────── extracción metadata empresa ─────────────── */
function extractMeta(rawData){
  var meta={empresa:'',nit:''};
  for(var i=0;i<Math.min(10,rawData.length);i++){
    var row=rawData[i];if(!row)continue;
    for(var j=0;j<row.length;j++){
      var cs=String(row[j]||'');
      var m=cs.match(/Compa[ñn][ií]a:\s*([^\n\\]+)/i);
      if(m&&!meta.empresa)meta.empresa=m[1].trim().split('\\n')[0];
    }
    var r0=String(row[0]||'').trim();
    if(/^\d{9}\s*-\s*\d$/.test(r0)&&!meta.nit)meta.nit=r0;
    if(!meta.empresa&&/^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s.]{4,}$/.test(r0)&&!/^(MOV|LIB|REP|TOT|ELA)/i.test(r0)){
      meta.empresa=r0;
    }
  }
  return meta;
}

/* ─────────────── agregación por grupo ─────────────── */
// Devuelve un mapa {grupo: total}. Los grupos con sign negativo en clasificación
// (deterioro_cartera, depreciacion, amortizacion, dev_ventas) conservan el signo
// del balance — la herramienta consumidora decide cómo aplicarlos.
function aggregate(accounts){
  var agg={};
  var raw={activo:0,pasivo:0,patrimonio:0,ingresos:0,gastos:0,costos:0};
  accounts.forEach(function(a){
    var g=a.grupo||'otro';
    agg[g]=(agg[g]||0)+a.saldoFin;
    if(a.clase==='Activo')raw.activo+=a.saldoFin;
    else if(a.clase==='Pasivo')raw.pasivo+=a.saldoFin;
    else if(a.clase==='Patrimonio')raw.patrimonio+=a.saldoFin;
    else if(a.clase==='Ingreso')raw.ingresos+=a.saldoFin;
    else if(a.clase==='Gasto')raw.gastos+=a.saldoFin;
    else if(a.clase==='Costo'||a.clase==='Costo producción')raw.costos+=a.saldoFin;
  });
  // Para presentación: normalizamos a positivos pasivo/patrimonio/ingresos.
  // Algunos balances exportan créditos con signo natural contable (negativo),
  // otros con valor absoluto. Para los totales que mostramos al usuario y para
  // alimentar formularios que esperan positivos, usamos abs.
  agg._totals={
    activo:raw.activo,
    pasivo:Math.abs(raw.pasivo),
    patrimonio:Math.abs(raw.patrimonio),
    ingresos:Math.abs(raw.ingresos),
    gastos:Math.abs(raw.gastos),
    costos:Math.abs(raw.costos)
  };
  agg._raw=raw; // por si algún consumidor necesita los signos crudos
  return agg;
}

/* ─────────────── persistencia (sessionStorage) ─────────────── */
function persist(key,payload){
  try{sessionStorage.setItem('balance_loader__'+key,JSON.stringify(payload));return true}
  catch(e){return false}
}
function recover(key){
  try{var raw=sessionStorage.getItem('balance_loader__'+key);return raw?JSON.parse(raw):null}
  catch(e){return null}
}

/* ─────────────── pipeline completo desde un archivo ─────────────── */
function processFile(file){
  return readFile(file).then(function(res){
    var headerRow=autoDetectHeaderRow(res.rawData);
    var colMap=autoDetectColumns(res.rawData,headerRow);
    var meta=extractMeta(res.rawData);
    var requiredOk=colMap.code>=0&&colMap.name>=0&&colMap.saldoFin>=0;
    var accounts=requiredOk?processRows(res.rawData,headerRow,colMap):[];
    var aggregates=requiredOk?aggregate(accounts):null;
    return {
      ok:requiredOk,
      fileName:res.fileName,
      sheetName:res.sheetName,
      rawData:res.rawData,
      headerRow:headerRow,
      colMap:colMap,
      meta:meta,
      accounts:accounts,
      aggregates:aggregates,
      missing:requiredOk?[]:['code','name','saldoFin'].filter(function(k){return colMap[k]<0})
    };
  });
}

/* ─────────────── UI: dropzone montable ─────────────── */
/*
  mountDropZone(container, {
    label: 'Cargar balance de prueba',
    sublabel: 'XLSX, XLS o CSV',
    storageKey: 'razones_actual',  // si se define, persiste en sessionStorage
    onLoad: function(state){...},  // recibe el state completo (incluyendo aggregates)
    onError: function(err){...}    // opcional
  })
*/
function mountDropZone(container,opts){
  opts=opts||{};
  var label=opts.label||'Cargar balance de prueba';
  var sublabel=opts.sublabel||'Arrastra tu Excel (.xlsx / .xls / .csv) o haz clic para seleccionar';
  var uid='bl_'+Math.random().toString(36).slice(2,8);
  var state=null;

  container.innerHTML=''+
    '<div class="bl-wrap" style="display:flex;flex-direction:column;gap:8px">'+
      '<div class="bl-dz" id="'+uid+'_dz" style="border:2px dashed #cbd5e1;border-radius:10px;padding:22px 18px;text-align:center;cursor:pointer;transition:.2s;background:#fafbfc;position:relative">'+
        '<input type="file" id="'+uid+'_in" accept=".xlsx,.xls,.csv" style="position:absolute;inset:0;opacity:0;cursor:pointer">'+
        '<div style="font-size:1.6rem;line-height:1">📂</div>'+
        '<div style="font-weight:700;color:#1B3A5C;margin-top:4px">'+label+'</div>'+
        '<div style="font-size:.78rem;color:#6b7280;margin-top:2px">'+sublabel+'</div>'+
        '<div id="'+uid+'_name" style="font-family:JetBrains Mono,monospace;font-size:.78rem;color:#059669;margin-top:6px;font-weight:600"></div>'+
      '</div>'+
      '<div id="'+uid+'_status" style="font-size:.78rem;color:#6b7280"></div>'+
      '<div id="'+uid+'_summary" style="display:none;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:10px 12px;font-size:.8rem;color:#065F46"></div>'+
      '<div id="'+uid+'_mapper" style="display:none"></div>'+
    '</div>';

  var dz=document.getElementById(uid+'_dz');
  var input=document.getElementById(uid+'_in');
  var nameEl=document.getElementById(uid+'_name');
  var statusEl=document.getElementById(uid+'_status');
  var summaryEl=document.getElementById(uid+'_summary');
  var mapperEl=document.getElementById(uid+'_mapper');

  function setStatus(msg,color){statusEl.textContent=msg||'';statusEl.style.color=color||'#6b7280'}
  function setSummary(html){if(html){summaryEl.innerHTML=html;summaryEl.style.display='block'}else{summaryEl.style.display='none'}}
  function dragOn(){dz.style.borderColor='#2E75B6';dz.style.background='#D6E4F0'}
  function dragOff(){dz.style.borderColor='#cbd5e1';dz.style.background='#fafbfc'}

  dz.addEventListener('dragover',function(e){e.preventDefault();dragOn()});
  dz.addEventListener('dragleave',dragOff);
  dz.addEventListener('drop',function(e){e.preventDefault();dragOff();if(e.dataTransfer.files.length)handle(e.dataTransfer.files[0])});
  input.addEventListener('change',function(e){if(e.target.files.length)handle(e.target.files[0])});

  function handle(file){
    setStatus('Procesando '+file.name+'…','#1B3A5C');
    setSummary(null);
    nameEl.textContent='';
    processFile(file).then(function(res){
      state=res;
      nameEl.textContent='✓ '+res.fileName;
      if(!res.ok){
        setStatus('No pudimos detectar todas las columnas obligatorias automáticamente: '+res.missing.join(', ')+'. Mapéalas abajo.','#D97706');
        renderMapper(res);
        return;
      }
      mapperEl.style.display='none';mapperEl.innerHTML='';
      setStatus(res.accounts.length+' cuentas clasificadas. Encabezado: fila '+res.headerRow+'.','#059669');
      var t=res.aggregates._totals;
      setSummary(
        '<strong>Balance leído correctamente.</strong> '+
        (res.meta.empresa?('Empresa: '+res.meta.empresa+' · '):'')+
        'Activo: $'+fN(t.activo)+' · Pasivo: $'+fN(t.pasivo)+' · Patrimonio: $'+fN(t.patrimonio)+
        (Math.abs(t.activo-(t.pasivo+t.patrimonio))>1?' <span style="color:#92400E">⚠️ Ecuación contable no cuadra (diferencia $'+fN(t.activo-(t.pasivo+t.patrimonio))+'). Revisa que las cuentas 4xx-6xx estén cerradas o usa estadosfinancieros.html para ajustar.</span>':' ✓ Ecuación OK.')
      );
      if(opts.storageKey)persist(opts.storageKey,{aggregates:res.aggregates,meta:res.meta,fileName:res.fileName,ts:Date.now()});
      if(typeof opts.onLoad==='function')opts.onLoad(res);
    }).catch(function(err){
      console.error('balance-loader:',err);
      setStatus('Error: '+(err.message||err),'#DC2626');
      if(typeof opts.onError==='function')opts.onError(err);
    });
  }

  function renderMapper(res){
    // Selectores simples para las 3 columnas requeridas (code, name, saldoFin).
    var hdr=res.rawData[res.headerRow]||[];
    var optsHtml='<option value="-1">— No asignada —</option>';
    for(var j=0;j<hdr.length;j++){
      var lbl=cellStr(hdr[j]);
      optsHtml+='<option value="'+j+'">'+(lbl?lbl.substring(0,40):'Columna '+(j+1))+'</option>';
    }
    function selFor(key,cur){
      return optsHtml.replace('value="'+cur+'"','value="'+cur+'" selected');
    }
    mapperEl.style.display='block';
    mapperEl.innerHTML=''+
      '<div style="background:#FFF8E1;border:1px solid #FCD34D;border-radius:8px;padding:12px;margin-top:8px">'+
        '<div style="font-weight:700;color:#92400E;margin-bottom:8px;font-size:.85rem">Asigna las columnas obligatorias:</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">'+
          '<label style="font-size:.78rem;font-weight:600;color:#92400E">Código<select id="'+uid+'_m_code" style="width:100%;padding:6px;border:1px solid #FCD34D;border-radius:6px;margin-top:2px">'+selFor('code',res.colMap.code)+'</select></label>'+
          '<label style="font-size:.78rem;font-weight:600;color:#92400E">Nombre<select id="'+uid+'_m_name" style="width:100%;padding:6px;border:1px solid #FCD34D;border-radius:6px;margin-top:2px">'+selFor('name',res.colMap.name)+'</select></label>'+
          '<label style="font-size:.78rem;font-weight:600;color:#92400E">Saldo final<select id="'+uid+'_m_saldoFin" style="width:100%;padding:6px;border:1px solid #FCD34D;border-radius:6px;margin-top:2px">'+selFor('saldoFin',res.colMap.saldoFin)+'</select></label>'+
        '</div>'+
        '<button id="'+uid+'_m_btn" type="button" style="margin-top:10px;padding:8px 16px;background:#2E75B6;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:.85rem">Aplicar mapeo</button>'+
      '</div>';
    document.getElementById(uid+'_m_btn').addEventListener('click',function(){
      var cm={
        code:parseInt(document.getElementById(uid+'_m_code').value),
        name:parseInt(document.getElementById(uid+'_m_name').value),
        saldoFin:parseInt(document.getElementById(uid+'_m_saldoFin').value),
        deb:res.colMap.deb,cre:res.colMap.cre,saldoIni:res.colMap.saldoIni
      };
      if(cm.code<0||cm.name<0||cm.saldoFin<0){setStatus('Faltan columnas obligatorias.','#DC2626');return}
      var accounts=processRows(res.rawData,res.headerRow,cm);
      var aggregates=aggregate(accounts);
      state=Object.assign({},res,{ok:true,colMap:cm,accounts:accounts,aggregates:aggregates,missing:[]});
      mapperEl.style.display='none';
      var t=aggregates._totals;
      setStatus(accounts.length+' cuentas clasificadas tras mapeo manual.','#059669');
      setSummary('<strong>Balance leído.</strong> Activo: $'+fN(t.activo)+' · Pasivo: $'+fN(t.pasivo)+' · Patrimonio: $'+fN(t.patrimonio));
      if(opts.storageKey)persist(opts.storageKey,{aggregates:aggregates,meta:res.meta,fileName:res.fileName,ts:Date.now()});
      if(typeof opts.onLoad==='function')opts.onLoad(state);
    });
  }

  return {
    reset:function(){state=null;nameEl.textContent='';setStatus('');setSummary(null);mapperEl.style.display='none';mapperEl.innerHTML='';input.value=''},
    getState:function(){return state}
  };
}

/* ─────────────── exposición pública ─────────────── */
global.BalanceLoader={
  // utils
  norm:norm,toNum:toNum,cellStr:cellStr,fN:fN,
  // pipeline
  readFile:readFile,
  flattenWorldOfficeTree:flattenWorldOfficeTree,
  flattenSimitTree:flattenSimitTree,
  flattenMultiNivelTree:flattenMultiNivelTree,
  autoDetectHeaderRow:autoDetectHeaderRow,
  autoDetectColumns:autoDetectColumns,
  classifyAccount:classifyAccount,
  processRows:processRows,
  extractMeta:extractMeta,
  aggregate:aggregate,
  processFile:processFile,
  // persistencia
  persist:persist,recover:recover,
  // UI
  mountDropZone:mountDropZone,
  // metadata
  COL_FIELDS:COL_FIELDS,
  VERSION:'1.0.0'
};

})(typeof window!=='undefined'?window:this);
