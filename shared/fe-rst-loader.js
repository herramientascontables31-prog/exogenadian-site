/* ═══════════════════════════════════════════════════════════
   FE-RST-LOADER — Carga listado FE/RADIAN MUISCA y agrupa por bimestre
   Usado en formato2593.html (1 bimestre) y renta260.html (6 bimestres).

   Normativa Régimen Simple aplicable:
   - Art. 904 ET: ingreso bruto = ordinarios + extraordinarios del periodo.
   - Art. 905 ET: tope 100.000 UVT/año.
   - Art. 908 par. 6: ganancias ocasionales NO van por SIMPLE.
   - Art. 911 ET: anticipo bimestral sobre ingresos brutos del bimestre.
   - Art. 915 ET: IVA RST se presenta anual (F260) y bimestral (F2593).
   - Notas crédito emitidas reducen ingreso bruto (devoluciones).

   Asume XLSX (SheetJS) cargado en la página.
   ═══════════════════════════════════════════════════════════ */
(function(global){
  'use strict';

  var UVT_2026 = 52374;
  var UVT_2025 = 49799;
  var UVT_2024 = 47065;

  function norm(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[\n\r\t]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function toNum(v){
    if(typeof v==='number')return v;
    if(!v)return 0;
    var s=String(v).replace(/[$\s]/g,'');
    var neg=false;
    if(/^\(.+\)$/.test(s)){neg=true;s=s.slice(1,-1);}
    if(s.indexOf(',')>=0&&s.indexOf('.')>=0){
      if(s.lastIndexOf(',')>s.lastIndexOf('.'))s=s.replace(/\./g,'').replace(',','.');
      else s=s.replace(/,/g,'');
    }else if(s.indexOf(',')>=0&&s.indexOf('.')<0){
      var p=s.split(',');
      if(p[p.length-1].length<=2)s=s.replace(',','.');
      else s=s.replace(/,/g,'');
    }
    var n=parseFloat(s)||0;
    return neg?-n:n;
  }
  function cellStr(v){
    var s=String(v==null?'':v).trim();
    if(s==='undefined'||s==='null'||s==='NaN')return'';
    if(/^\d+\.\d*$/.test(s))s=s.split('.')[0];
    return s;
  }
  // Tolerante a Date, serial Excel, ISO, dd-mm-yyyy, dd/mm/yyyy.
  // El listado MUISCA suele venir con strings dd-mm-yyyy que new Date() no parsea bien.
  function parseFlexDate(raw){
    if(raw==null||raw==='')return null;
    if(raw instanceof Date)return isNaN(raw.getTime())?null:raw;
    if(typeof raw==='number'){
      var d=new Date(Math.round((raw-25569)*86400*1000));
      return isNaN(d.getTime())?null:d;
    }
    var s=String(raw).trim();
    if(!s)return null;
    if(/^\d{4}-\d{2}-\d{2}/.test(s)){var d2=new Date(s);return isNaN(d2.getTime())?null:d2;}
    var m=s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
    if(m){
      var dd=parseInt(m[1],10),mm=parseInt(m[2],10),yyyy=parseInt(m[3],10);
      if(mm>12&&dd<=12){var t=dd;dd=mm;mm=t;}
      if(dd<1||dd>31||mm<1||mm>12)return null;
      var hh=m[4]?parseInt(m[4],10):0,mi=m[5]?parseInt(m[5],10):0,ss=m[6]?parseInt(m[6],10):0;
      var d3=new Date(yyyy,mm-1,dd,hh,mi,ss);
      return isNaN(d3.getTime())?null:d3;
    }
    var d4=new Date(s);
    return isNaN(d4.getTime())?null:d4;
  }
  function bimestreDeFecha(d){
    if(!d||!(d instanceof Date)||isNaN(d.getTime()))return 0;
    return Math.floor(d.getMonth()/2)+1; // 0-indexed mes → bim 1..6
  }
  // Detecta NC/ND por código DIAN (91/92), texto ("nota crédito", "NC"), o IVA negativo.
  function detectNota(tipo,codTipo){
    var t=norm(tipo);
    var cs=String(codTipo||'').trim();
    if(cs==='91')return{esNota:true,esND:false};
    if(cs==='92')return{esNota:false,esND:true};
    if(t.indexOf('nota')>=0&&(t.indexOf('credit')>=0||/\bnc\b/.test(t)||/\bcr\b/.test(t)))return{esNota:true,esND:false};
    if(t.indexOf('nota')>=0&&(t.indexOf('debit')>=0||/\bnd\b/.test(t)))return{esNota:false,esND:true};
    if(/^nc\b/.test(t)||/\bnota\s*credit/.test(t))return{esNota:true,esND:false};
    if(/^nd\b/.test(t)||/\bnota\s*debit/.test(t))return{esNota:false,esND:true};
    return{esNota:false,esND:false};
  }

  function emptyBimAgg(){
    var arr=[];
    for(var i=1;i<=6;i++){
      arr.push({bim:i,baseFac:0,baseNc:0,ivaFac:0,ivaNc:0,base:0,iva:0,count:0});
    }
    return arr;
  }

  /* Parsea un workbook (ya leído por SheetJS) y devuelve resumen por bimestre.
     opciones:
       - nitDeclarante (string): si el archivo no trae columna "Grupo" Emitido/Recibido,
         se compara con este NIT para clasificar.
       - anoEsperado (number, opcional): filtra por año (descarta filas de otros años).
  */
  function parseWorkbook(wb, opts){
    opts = opts || {};
    var rawData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1, defval:''});
    if(!rawData||rawData.length<2){
      return {ok:false, error:'Archivo vacío o sin datos.'};
    }

    // Detectar fila de headers en primeras 8 filas
    var hdr=0;
    for(var i=0;i<Math.min(8,rawData.length);i++){
      var row=rawData[i]; if(!row) continue;
      var rn=row.map(function(c){return norm(cellStr(c));});
      if(rn.some(function(h){return h.indexOf('tipo de documento')>=0||h.indexOf('cufe')>=0||h.indexOf('folio')>=0||h.indexOf('nit emisor')>=0;})){
        hdr=i; break;
      }
    }
    var headers = rawData[hdr].map(function(c){return norm(cellStr(c));});

    function findIva(){
      var idx=headers.findIndex(function(h){return h==='iva';});
      if(idx>=0)return idx;
      idx=headers.findIndex(function(h){return /^(valor|total)?\s*iva$/.test(h);});
      if(idx>=0)return idx;
      return headers.findIndex(function(h){return h.indexOf('iva')>=0&&h.indexOf('rete')<0&&h.indexOf('reteiva')<0&&h.indexOf('base')<0;});
    }
    function findTotal(){
      var idx=headers.findIndex(function(h){return h==='total';});
      if(idx>=0)return idx;
      return headers.findIndex(function(h){return h==='total factura'||h==='valor total'||h==='total documento'||h.indexOf('total ')===0;});
    }
    var col={
      tipo: headers.findIndex(function(h){return h.indexOf('tipo de documento')>=0||h==='tipo'||h.indexOf('tipo doc')>=0;}),
      codTipo: headers.findIndex(function(h){return h.indexOf('codigo')>=0&&h.indexOf('tipo')>=0;}),
      folio: headers.findIndex(function(h){return h.indexOf('folio')>=0||h.indexOf('numero')>=0||h==='consecutivo';}),
      fecha: headers.findIndex(function(h){return h.indexOf('fecha emision')>=0||h.indexOf('fecha')>=0;}),
      nitEmisor: headers.findIndex(function(h){return h.indexOf('nit emisor')>=0;}),
      nitReceptor: headers.findIndex(function(h){return h.indexOf('nit receptor')>=0;}),
      iva: findIva(),
      total: findTotal(),
      grupo: headers.findIndex(function(h){return h.indexOf('grupo')>=0;})
    };

    if(col.nitEmisor<0||col.nitReceptor<0||col.iva<0||col.total<0){
      return {ok:false, error:'No se detectaron columnas requeridas (NIT emisor, NIT receptor, IVA, Total). Verifica el archivo del MUISCA.'};
    }
    if(col.fecha<0){
      return {ok:false, error:'Falta la columna de fecha — no se puede repartir por bimestre. Descarga del MUISCA "Reporte de documentos electrónicos" con fecha de emisión.'};
    }

    var nitDec = (opts.nitDeclarante||'').replace(/[^\d]/g,'');
    var emitidos = { count:0, baseFac:0, baseNc:0, ivaFac:0, ivaNc:0, base:0, iva:0, byBim: emptyBimAgg() };
    var recibidos = { count:0, baseFac:0, baseNc:0, ivaFac:0, ivaNc:0, base:0, iva:0 };
    var totalDocs=0, sinFecha=0, fueraDeAno=0, omitidosNomina=0;
    var anosVistos = {};

    for(var r=hdr+1; r<rawData.length; r++){
      var row=rawData[r]; if(!row||row.length===0)continue;
      var tipo=cellStr(row[col.tipo]);
      var nitEmis=cellStr(row[col.nitEmisor]);
      if(!tipo&&!nitEmis)continue;
      var tipoN=norm(tipo);
      // Excluir nómina electrónica: en RST no es ingreso ni gasto deducible vía SIMPLE.
      if(tipoN.indexOf('nomina')>=0){ omitidosNomina++; continue; }
      var codTipo = col.codTipo>=0?cellStr(row[col.codTipo]):'';
      var fecha = parseFlexDate(row[col.fecha]);
      if(!fecha){ sinFecha++; continue; }
      var ano = fecha.getFullYear();
      anosVistos[ano] = (anosVistos[ano]||0) + 1;
      if(opts.anoEsperado && ano !== opts.anoEsperado){ fueraDeAno++; continue; }

      var flags = detectNota(tipo, codTipo);
      var ivaRaw = toNum(row[col.iva]);
      var totalRaw = toNum(row[col.total]);
      // IVA negativo sin tipo detectado → tratar como NC (defensivo, algunos MUISCA traen NCs sin código).
      if(ivaRaw<0 && !flags.esNota && !flags.esND) flags.esNota=true;

      var iva = Math.abs(ivaRaw);
      var total = Math.abs(totalRaw);
      var base = Math.max(0, total - iva); // base sin IVA (ingreso bruto del SIMPLE)
      var bim = bimestreDeFecha(fecha);

      // Determinar emitido/recibido
      var grupoRaw = col.grupo>=0?norm(cellStr(row[col.grupo])):'';
      var esEmitido = false;
      if(grupoRaw){ esEmitido = grupoRaw.indexOf('emit')>=0; }
      else if(nitDec){
        esEmitido = String(cellStr(row[col.nitEmisor])).replace(/[^\d]/g,'') === nitDec;
      }else{
        // Sin pista: asumir emitido si no hay receptor (defensivo).
        esEmitido = true;
      }

      totalDocs++;
      if(esEmitido){
        emitidos.count++;
        if(flags.esNota){
          emitidos.baseNc += base; emitidos.ivaNc += iva;
          if(bim>=1&&bim<=6){
            emitidos.byBim[bim-1].baseNc += base;
            emitidos.byBim[bim-1].ivaNc += iva;
            emitidos.byBim[bim-1].count++;
          }
        }else{
          emitidos.baseFac += base; emitidos.ivaFac += iva;
          if(bim>=1&&bim<=6){
            emitidos.byBim[bim-1].baseFac += base;
            emitidos.byBim[bim-1].ivaFac += iva;
            emitidos.byBim[bim-1].count++;
          }
        }
      }else{
        recibidos.count++;
        if(flags.esNota){ recibidos.baseNc += base; recibidos.ivaNc += iva; }
        else { recibidos.baseFac += base; recibidos.ivaFac += iva; }
      }
    }

    // Totales netos por bimestre y globales
    emitidos.base = emitidos.baseFac - emitidos.baseNc;
    emitidos.iva = emitidos.ivaFac - emitidos.ivaNc;
    for(var b=0;b<6;b++){
      emitidos.byBim[b].base = emitidos.byBim[b].baseFac - emitidos.byBim[b].baseNc;
      emitidos.byBim[b].iva = emitidos.byBim[b].ivaFac - emitidos.byBim[b].ivaNc;
    }
    recibidos.base = recibidos.baseFac - recibidos.baseNc;
    recibidos.iva = recibidos.ivaFac - recibidos.ivaNc;

    // Año dominante (el que más documentos aporte)
    var anoDom = null, maxC = 0;
    Object.keys(anosVistos).forEach(function(k){
      if(anosVistos[k] > maxC){ maxC = anosVistos[k]; anoDom = parseInt(k,10); }
    });

    var warnings = [];
    if(sinFecha>0) warnings.push(sinFecha+' documento(s) sin fecha — se descartaron del reparto bimestral.');
    if(fueraDeAno>0) warnings.push(fueraDeAno+' documento(s) de otro año fueron filtrados.');
    if(omitidosNomina>0) warnings.push(omitidosNomina+' documento(s) de nómina electrónica omitidos (no son ingreso del SIMPLE).');
    var anosKeys = Object.keys(anosVistos).map(function(k){return parseInt(k,10);}).filter(function(x){return !isNaN(x);});
    if(!opts.anoEsperado && anosKeys.length>1){
      warnings.push('El listado mezcla varios años ('+anosKeys.sort().join(', ')+'). Filtra el archivo o usa el año dominante.');
    }

    return {
      ok: true,
      total: totalDocs,
      emitidos: emitidos,
      recibidos: recibidos,
      ano: anoDom,
      anosVistos: anosVistos,
      warnings: warnings
    };
  }

  function parseFile(file, opts){
    return new Promise(function(resolve, reject){
      if(!file) return reject(new Error('Sin archivo.'));
      var MAX = 30*1024*1024;
      if(file.size > MAX) return reject(new Error('El archivo excede 30 MB.'));
      var ext = (file.name||'').split('.').pop().toLowerCase();
      if(['xlsx','xls','csv'].indexOf(ext)<0) return reject(new Error('Formato no soportado: .'+ext+'. Solo Excel o CSV.'));
      if(typeof XLSX === 'undefined') return reject(new Error('Falta cargar SheetJS (XLSX) en la página.'));
      var reader = new FileReader();
      reader.onload = function(e){
        try{
          var wb = XLSX.read(new Uint8Array(e.target.result), {type:'array', cellDates:true});
          var res = parseWorkbook(wb, opts||{});
          if(!res.ok) return reject(new Error(res.error||'Error parseando archivo.'));
          resolve(res);
        }catch(err){ reject(err); }
      };
      reader.onerror = function(){ reject(new Error('Error leyendo archivo.')); };
      reader.readAsArrayBuffer(file);
    });
  }

  // Calcula UVT del año (acepta número directo o usa tabla)
  function uvtDelAno(ano){
    if(ano===2026) return UVT_2026;
    if(ano===2025) return UVT_2025;
    if(ano===2024) return UVT_2024;
    return UVT_2026;
  }

  global.FeRstLoader = {
    parseFile: parseFile,
    parseWorkbook: parseWorkbook,
    uvtDelAno: uvtDelAno,
    UVT_2026: UVT_2026,
    UVT_2025: UVT_2025,
    UVT_2024: UVT_2024,
    bimestreDeFecha: bimestreDeFecha
  };
})(typeof window!=='undefined'?window:this);
