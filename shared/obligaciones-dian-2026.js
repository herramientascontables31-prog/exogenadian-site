/* ═══════════════════════════════════════════════════════════════════════════
   ExogenaDIAN — obligaciones-dian-2026.js
   Motor ÚNICO de generación de obligaciones tributarias DIAN 2026 a partir de la
   ficha de un cliente. Fuente de verdad compartida entre:
     • oficina.html  (render del tablero + sync al servidor)
     • mailer/_lib/  (cron del correo diario recalcula cada día — copia idéntica)
     • (futuro) vencimientos.html

   Puro, sin DOM. UMD: en navegador queda en window.ObligacionesDIAN; en Node se
   importa con require().

   PARIDAD DE FECHAS navegador↔servidor (crítico): las fechas se crean con
   `new Date(iso+'T00:00:00')` (hora LOCAL) y se vuelven a serializar con
   getFullYear/getMonth/getDate (también LOCAL). Como creación y serialización usan
   la MISMA zona local, el ida-y-vuelta recupera el ISO original en CUALQUIER zona
   horaria (Bogotá en el browser, UTC en Vercel). NUNCA usar toISOString()/getUTC*
   para serializar estas fechas: rompería la paridad.

   Fuentes: dian.gov.co/Calendarios/Calendario_Tributario_2026.pdf + resoluciones
   municipales ICA. Verificado y sincronizado con oficina.html (jun-2026).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else global.ObligacionesDIAN = factory();
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function () {
  'use strict';

  /* ═══ DIAN 2026 DEADLINE DATA ═══ */
  // arr[0..9] = fechas en orden cronológico (DIAN: NIT 1 vence primero, NIT 0 último).
  // Devolvemos un objeto indexado por último dígito: m[1]=arr[0], …, m[0]=arr[9].
  function dm(arr) {
    var m = {};
    for (var i = 0; i < 10; i++) { m[(i + 1) % 10] = new Date(arr[i] + 'T00:00:00'); }
    return m;
  }
  function _dts(a) { return a.map(function (s) { return new Date(s + 'T00:00:00'); }); }

  var D_RENTA_PJ_1 = dm(['2026-05-12','2026-05-13','2026-05-14','2026-05-15','2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-25','2026-05-26']);
  var D_RENTA_PJ_2 = dm(['2026-07-09','2026-07-10','2026-07-13','2026-07-14','2026-07-15','2026-07-16','2026-07-17','2026-07-21','2026-07-22','2026-07-23']);

  var D_RENTA_GC_1 = dm(['2026-02-10','2026-02-11','2026-02-12','2026-02-13','2026-02-16','2026-02-17','2026-02-18','2026-02-19','2026-02-20','2026-02-23']);
  var D_RENTA_GC_2 = dm(['2026-04-13','2026-04-14','2026-04-15','2026-04-16','2026-04-17','2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24']);
  var D_RENTA_GC_3 = dm(['2026-06-10','2026-06-11','2026-06-12','2026-06-16','2026-06-17','2026-06-18','2026-06-19','2026-06-22','2026-06-23','2026-06-24']);

  var D_IVA_B1 = dm(['2026-03-10','2026-03-11','2026-03-12','2026-03-13','2026-03-16','2026-03-17','2026-03-18','2026-03-19','2026-03-20','2026-03-24']);
  var D_IVA_B2 = dm(['2026-05-12','2026-05-13','2026-05-14','2026-05-15','2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-25','2026-05-26']);
  var D_IVA_B3 = dm(['2026-07-09','2026-07-10','2026-07-13','2026-07-14','2026-07-15','2026-07-16','2026-07-17','2026-07-21','2026-07-22','2026-07-23']);
  var D_IVA_B4 = dm(['2026-09-09','2026-09-10','2026-09-11','2026-09-14','2026-09-15','2026-09-16','2026-09-17','2026-09-18','2026-09-21','2026-09-22']);
  var D_IVA_B5 = dm(['2026-11-11','2026-11-12','2026-11-13','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-23','2026-11-24','2026-11-25']);
  var D_IVA_B6 = dm(['2027-01-13','2027-01-14','2027-01-15','2027-01-18','2027-01-19','2027-01-20','2027-01-21','2027-01-22','2027-01-25','2027-01-26']);

  var ICA_BIMS = ['Bim 1 (Ene-Feb)','Bim 2 (Mar-Abr)','Bim 3 (May-Jun)','Bim 4 (Jul-Ago)','Bim 5 (Sep-Oct)','Bim 6 (Nov-Dic)'];
  var ICA_BOG     = _dts(['2026-04-10','2026-06-12','2026-08-21','2026-10-09','2026-12-11','2027-02-12']);
  var RETEICA_BOG = _dts(['2026-03-20','2026-05-22','2026-07-17','2026-09-18','2026-11-20','2027-01-15']);
  var ICA_CALI = [
    dm(['2026-03-09','2026-03-09','2026-03-10','2026-03-10','2026-03-11','2026-03-11','2026-03-12','2026-03-12','2026-03-13','2026-03-13']),
    dm(['2026-05-11','2026-05-11','2026-05-12','2026-05-12','2026-05-13','2026-05-13','2026-05-14','2026-05-14','2026-05-15','2026-05-15']),
    dm(['2026-07-13','2026-07-13','2026-07-14','2026-07-14','2026-07-15','2026-07-15','2026-07-16','2026-07-16','2026-07-17','2026-07-17']),
    dm(['2026-09-07','2026-09-07','2026-09-08','2026-09-08','2026-09-09','2026-09-09','2026-09-10','2026-09-10','2026-09-11','2026-09-11']),
    dm(['2026-11-09','2026-11-09','2026-11-10','2026-11-10','2026-11-11','2026-11-11','2026-11-12','2026-11-12','2026-11-13','2026-11-13']),
    dm(['2027-01-18','2027-01-18','2027-01-19','2027-01-19','2027-01-20','2027-01-20','2027-01-21','2027-01-21','2027-01-22','2027-01-22'])
  ];
  var ICA_CTG_ANUAL = new Date('2026-05-29T00:00:00');
  var RETEICA_CTG   = _dts(['2026-03-26','2026-05-27','2026-07-29','2026-09-24','2026-11-26','2027-01-28']);
  // VALLEDUPAR — Decreto 1244 del 31-dic-2025. Consolidada anual AG2025 (27-feb) +
  // ICA bimestral fechas únicas (régimen común y GC; el preferencial paga semestral,
  // no modelado) + ReteICA MENSUAL fechas únicas (GC y demás agentes, Arts. 4-5).
  var ICA_VUP_ANUAL = new Date('2026-02-27T00:00:00');
  var ICA_VUP     = _dts(['2026-03-31','2026-05-29','2026-07-30','2026-09-29','2026-11-27','2027-01-29']);
  var RETEICA_VUP = _dts(['2026-02-27','2026-03-27','2026-04-30','2026-05-29','2026-06-26','2026-07-30','2026-08-27','2026-09-29','2026-10-29','2026-11-27','2026-12-29','2027-01-29']);
  var RETEICA_VUP_MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  var RET_ALL = [
    {label:'Ene',d:D_RENTA_GC_1},{label:'Feb',d:D_IVA_B1},{label:'Mar',d:D_RENTA_GC_2},
    {label:'Abr',d:D_IVA_B2},{label:'May',d:D_RENTA_GC_3},
    {label:'Jun',d:dm(['2026-07-09','2026-07-10','2026-07-13','2026-07-14','2026-07-15','2026-07-16','2026-07-17','2026-07-21','2026-07-22','2026-07-23'])},
    {label:'Jul',d:dm(['2026-08-11','2026-08-12','2026-08-13','2026-08-14','2026-08-18','2026-08-19','2026-08-20','2026-08-21','2026-08-24','2026-08-25'])},
    {label:'Ago',d:dm(['2026-09-09','2026-09-10','2026-09-11','2026-09-14','2026-09-15','2026-09-16','2026-09-17','2026-09-18','2026-09-21','2026-09-22'])},
    {label:'Sep',d:dm(['2026-10-13','2026-10-14','2026-10-15','2026-10-16','2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-26'])},
    {label:'Oct',d:dm(['2026-11-11','2026-11-12','2026-11-13','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-23','2026-11-24','2026-11-25'])},
    {label:'Nov',d:dm(['2026-12-10','2026-12-11','2026-12-14','2026-12-15','2026-12-16','2026-12-17','2026-12-18','2026-12-21','2026-12-22','2026-12-23'])},
    {label:'Dic',d:dm(['2027-01-13','2027-01-14','2027-01-15','2027-01-18','2027-01-19','2027-01-20','2027-01-21','2027-01-22','2027-01-25','2027-01-26'])}
  ];

  var EXOG_GC = dm(['2026-05-14','2026-05-15','2026-05-19','2026-05-05','2026-05-06','2026-05-07','2026-05-08','2026-05-11','2026-05-12','2026-05-13']);

  var D_RST_B1 = dm(['2026-05-12','2026-05-13','2026-05-14','2026-05-15','2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-25','2026-05-26']);
  var D_RST_B2 = dm(['2026-06-10','2026-06-11','2026-06-12','2026-06-16','2026-06-17','2026-06-18','2026-06-19','2026-06-22','2026-06-23','2026-06-24']);
  var D_RST_B3 = dm(['2026-07-09','2026-07-10','2026-07-13','2026-07-14','2026-07-15','2026-07-16','2026-07-17','2026-07-21','2026-07-22','2026-07-23']);
  var D_RST_B4 = dm(['2026-09-09','2026-09-10','2026-09-11','2026-09-14','2026-09-15','2026-09-16','2026-09-17','2026-09-18','2026-09-21','2026-09-22']);
  var D_RST_B5 = dm(['2026-11-11','2026-11-12','2026-11-13','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-23','2026-11-24','2026-11-25']);
  var D_RST_B6 = dm(['2027-01-13','2027-01-14','2027-01-15','2027-01-18','2027-01-19','2027-01-20','2027-01-21','2027-01-22','2027-01-25','2027-01-26']);

  var D_RENTA_PN = [
    {lo:1,hi:2,d:'2026-08-12'},{lo:3,hi:4,d:'2026-08-13'},{lo:5,hi:6,d:'2026-08-14'},
    {lo:7,hi:8,d:'2026-08-18'},{lo:9,hi:10,d:'2026-08-19'},{lo:11,hi:12,d:'2026-08-20'},
    {lo:13,hi:14,d:'2026-08-21'},{lo:15,hi:16,d:'2026-08-24'},{lo:17,hi:18,d:'2026-08-25'},
    {lo:19,hi:20,d:'2026-08-26'},{lo:21,hi:22,d:'2026-08-27'},{lo:23,hi:24,d:'2026-08-28'},
    {lo:25,hi:26,d:'2026-08-31'},{lo:27,hi:28,d:'2026-09-01'},{lo:29,hi:30,d:'2026-09-02'},
    {lo:31,hi:32,d:'2026-09-03'},{lo:33,hi:34,d:'2026-09-04'},{lo:35,hi:36,d:'2026-09-07'},
    {lo:37,hi:38,d:'2026-09-08'},{lo:39,hi:40,d:'2026-09-09'},{lo:41,hi:42,d:'2026-09-10'},
    {lo:43,hi:44,d:'2026-09-11'},{lo:45,hi:46,d:'2026-09-14'},{lo:47,hi:48,d:'2026-09-15'},
    {lo:49,hi:50,d:'2026-09-16'},{lo:51,hi:52,d:'2026-09-17'},{lo:53,hi:54,d:'2026-09-18'},
    {lo:55,hi:56,d:'2026-09-21'},{lo:57,hi:58,d:'2026-09-22'},{lo:59,hi:60,d:'2026-09-23'},
    {lo:61,hi:62,d:'2026-09-24'},{lo:63,hi:64,d:'2026-09-25'},{lo:65,hi:66,d:'2026-09-28'},
    {lo:67,hi:68,d:'2026-10-01'},{lo:69,hi:70,d:'2026-10-02'},{lo:71,hi:72,d:'2026-10-05'},
    {lo:73,hi:74,d:'2026-10-06'},{lo:75,hi:76,d:'2026-10-07'},{lo:77,hi:78,d:'2026-10-08'},
    {lo:79,hi:80,d:'2026-10-09'},{lo:81,hi:82,d:'2026-10-13'},{lo:83,hi:84,d:'2026-10-14'},
    {lo:85,hi:86,d:'2026-10-15'},{lo:87,hi:88,d:'2026-10-16'},{lo:89,hi:90,d:'2026-10-19'},
    {lo:91,hi:92,d:'2026-10-20'},{lo:93,hi:94,d:'2026-10-21'},{lo:95,hi:96,d:'2026-10-22'},
    {lo:97,hi:98,d:'2026-10-23'},{lo:99,hi:0,d:'2026-10-26'}
  ];

  var EXOG_PJ = [
    {lo:1,hi:5,d:'2026-05-14'},{lo:6,hi:10,d:'2026-05-15'},{lo:11,hi:15,d:'2026-05-19'},
    {lo:16,hi:20,d:'2026-05-20'},{lo:21,hi:25,d:'2026-05-21'},{lo:26,hi:30,d:'2026-05-22'},
    {lo:31,hi:35,d:'2026-05-25'},{lo:36,hi:40,d:'2026-05-26'},{lo:41,hi:45,d:'2026-05-27'},
    {lo:46,hi:50,d:'2026-05-28'},{lo:51,hi:55,d:'2026-05-29'},{lo:56,hi:60,d:'2026-06-01'},
    {lo:61,hi:65,d:'2026-06-02'},{lo:66,hi:70,d:'2026-06-03'},{lo:71,hi:75,d:'2026-06-04'},
    {lo:76,hi:80,d:'2026-06-05'},{lo:81,hi:85,d:'2026-06-09'},{lo:86,hi:90,d:'2026-06-10'},
    {lo:91,hi:95,d:'2026-06-11'},{lo:96,hi:0,d:'2026-06-12'}
  ];

  var MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  /* ═══ NIT UTILITIES ═══ */
  var DV_WEIGHTS = [3,7,13,17,19,23,29,37,41,43,47,53,59,67,71];
  function calcDV(nit) {
    var digits = String(nit).replace(/\D/g, ''), len = digits.length, sum = 0;
    for (var i = 0; i < len; i++) { sum += parseInt(digits[len - 1 - i], 10) * DV_WEIGHTS[i]; }
    var rem = sum % 11;
    if (rem === 0) return 0;
    if (rem === 1) return 1;
    return 11 - rem;
  }
  function parseNIT(raw) {
    var clean = raw.replace(/[.\-\s]/g, ''), parts = raw.split('-'), dv = null, base = clean;
    if (parts.length === 2 && parts[1].trim().length <= 1) { dv = parts[1].trim(); base = parts[0].replace(/[.\-\s]/g, ''); }
    else if (clean.length > 2) { base = clean; }
    return { base: base, dv: dv };
  }
  function formatNIT(base, dv) {
    var s = String(base), formatted = '', rev = s.split('').reverse();
    for (var i = 0; i < rev.length; i++) { if (i > 0 && i % 3 === 0) formatted = '.' + formatted; formatted = rev[i] + formatted; }
    return formatted + '-' + dv;
  }
  function getLastDigit(nit) { var d = String(nit).replace(/\D/g, ''); return parseInt(d[d.length - 1], 10); }
  function getLast2Digits(nit) { var d = String(nit).replace(/\D/g, ''); if (d.length < 2) return parseInt(d, 10); return parseInt(d.slice(-2), 10); }

  /* ═══ DATE LOOKUP FUNCTIONS ═══ */
  function getDateByLastDigit(arr, nit) { return arr[getLastDigit(nit)]; }

  function getExogenaDate(client) {
    if (client.granContribuyente) return getDateByLastDigit(EXOG_GC, client.nit);
    var l2 = getLast2Digits(client.nit);
    for (var i = 0; i < EXOG_PJ.length; i++) {
      var r = EXOG_PJ[i];
      if (r.hi === 0) { if (l2 >= r.lo || l2 === 0) return new Date(r.d + 'T00:00:00'); }
      else { if (l2 >= r.lo && l2 <= r.hi) return new Date(r.d + 'T00:00:00'); }
    }
    return null;
  }

  function getRentaDates(client) {
    if (client.granContribuyente) {
      return [
        {label:'Renta C1',date:getDateByLastDigit(D_RENTA_GC_1,client.nit)},
        {label:'Renta C2',date:getDateByLastDigit(D_RENTA_GC_2,client.nit)},
        {label:'Renta C3',date:getDateByLastDigit(D_RENTA_GC_3,client.nit)}
      ];
    }
    if (client.tipo === 'PN') return [{label:'Renta',date:lookupByLast2(D_RENTA_PN,client.nit)}];
    return [
      {label:'Renta C1',date:getDateByLastDigit(D_RENTA_PJ_1,client.nit)},
      {label:'Renta C2',date:getDateByLastDigit(D_RENTA_PJ_2,client.nit)}
    ];
  }

  function lookupByLast2(ranges, nit) {
    var v = getLast2Digits(nit);
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      if (r.hi === 0) { if (v >= r.lo || v === 0) return new Date(r.d + 'T00:00:00'); }
      else { if (v >= r.lo && v <= r.hi) return new Date(r.d + 'T00:00:00'); }
    }
    return null;
  }

  function getIVADates(client) {
    if (client.regimen === 'no') return [];
    var periods;
    if (client.regimen === 'cuatrimestral') {
      periods = [
        {label:'IVA C1',dates:D_IVA_B2},
        {label:'IVA C2',dates:D_IVA_B4},
        {label:'IVA C3',dates:D_IVA_B6}
      ];
    } else {
      periods = [
        {label:'IVA B1',dates:D_IVA_B1},{label:'IVA B2',dates:D_IVA_B2},{label:'IVA B3',dates:D_IVA_B3},
        {label:'IVA B4',dates:D_IVA_B4},{label:'IVA B5',dates:D_IVA_B5},{label:'IVA B6',dates:D_IVA_B6}
      ];
    }
    return periods.map(function (p) { return {label:p.label,date:getDateByLastDigit(p.dates,client.nit)}; });
  }

  function getRetDates(client) {
    return RET_ALL.map(function (r) { return {label:'Ret '+r.label,date:getDateByLastDigit(r.d,client.nit)}; });
  }

  function getF2516Date(client) {
    if (client.granContribuyente) return getDateByLastDigit(D_RENTA_GC_1, client.nit);
    return getDateByLastDigit(D_RENTA_PJ_1, client.nit);
  }

  function getRSTDates(client) {
    return [
      {label:'RST B1',date:getDateByLastDigit(D_RST_B1,client.nit)},
      {label:'RST B2',date:getDateByLastDigit(D_RST_B2,client.nit)},
      {label:'RST B3',date:getDateByLastDigit(D_RST_B3,client.nit)},
      {label:'RST B4',date:getDateByLastDigit(D_RST_B4,client.nit)},
      {label:'RST B5',date:getDateByLastDigit(D_RST_B5,client.nit)},
      {label:'RST B6',date:getDateByLastDigit(D_RST_B6,client.nit)}
    ];
  }

  function getF260Date(client) {
    var ld = getLastDigit(client.nit);
    if (ld === 1 || ld === 2) return new Date('2026-04-20T00:00:00');
    if (ld === 3 || ld === 4) return new Date('2026-04-21T00:00:00');
    if (ld === 5 || ld === 6) return new Date('2026-04-22T00:00:00');
    if (ld === 7 || ld === 8) return new Date('2026-04-23T00:00:00');
    return new Date('2026-04-24T00:00:00');
  }

  function getPatrimonioDates(client) {
    return [
      {label:'Patrimonio C1',date:getDateByLastDigit(D_RENTA_PJ_1,client.nit)},
      {label:'Patrimonio C2',date:new Date('2026-09-14T00:00:00')}
    ];
  }

  function getActivosExtDate(client) {
    if (client.granContribuyente) return getDateByLastDigit(D_RENTA_GC_2, client.nit);
    if (client.tipo === 'PN') return lookupByLast2(D_RENTA_PN, client.nit);
    return getDateByLastDigit(D_RENTA_PJ_1, client.nit);
  }

  /* ═══ Build all obligations for a client (devuelve Date, igual que el inline) ═══ */
  function buildObligations(client) {
    var obls = [];
    if (client.obligaciones.exogena) obls.push({id:'exogena',group:'exogena',label:'Exogena',date:getExogenaDate(client),link:'exogena.html',linkText:'Generar'});
    if (client.obligaciones.renta) getRentaDates(client).forEach(function (r) { obls.push({id:'renta_'+r.label.replace(/\s/g,'_').toLowerCase(),group:'renta',label:r.label,date:r.date,link:'renta110.html',linkText:'F110'}); });
    if (client.obligaciones.iva) getIVADates(client).forEach(function (iv) { obls.push({id:'iva_'+iv.label.replace(/\s/g,'_').toLowerCase(),group:'iva',label:iv.label,date:iv.date,link:'iva300.html',linkText:'IVA'}); });
    if (client.obligaciones.retefte) getRetDates(client).forEach(function (r) { obls.push({id:'ret_'+r.label.replace(/\s/g,'_').toLowerCase(),group:'ret',label:r.label,date:r.date,link:'retencion350.html',linkText:'Ret'}); });
    if (client.obligaciones.f2516) obls.push({id:'f2516',group:'f2516',label:'F.2516',date:getF2516Date(client),link:'formato2516.html',linkText:'2516'});
    if (client.obligaciones.rst) {
      getRSTDates(client).forEach(function (r) { obls.push({id:'rst_'+r.label.replace(/\s/g,'_').toLowerCase(),group:'rst',label:r.label,date:r.date,link:'formato2593.html',linkText:'F2593'}); });
      obls.push({id:'f260',group:'rst',label:'F260 Anual',date:getF260Date(client),link:'formato2593.html',linkText:'F260'});
    }
    if (client.obligaciones.patrimonio) getPatrimonioDates(client).forEach(function (p) { obls.push({id:'patri_'+p.label.replace(/\s/g,'_').toLowerCase(),group:'patrimonio',label:p.label,date:p.date,link:'patrimonio420.html',linkText:'F420'}); });
    if (client.obligaciones.activosExt) obls.push({id:'activos_ext',group:'activos',label:'Activos Ext.',date:getActivosExtDate(client),link:null,linkText:'F160'});
    if (client.obligaciones.ica) {
      var icaM = client.icaMunicipio || 'none';
      if (icaM === 'bog') {
        ICA_BOG.forEach(function (d, i) { obls.push({id:'ica_bog_'+i,group:'ica',label:'ICA '+ICA_BIMS[i],date:d,link:null,linkText:'Bogotá'}); });
        RETEICA_BOG.forEach(function (d, i) { obls.push({id:'reteica_bog_'+i,group:'ica',label:'ReteICA '+ICA_BIMS[i],date:d,link:null,linkText:'Bogotá'}); });
      } else if (icaM === 'cali') {
        ICA_CALI.forEach(function (m, i) { obls.push({id:'ica_cali_'+i,group:'ica',label:'ICA/ReteICA '+ICA_BIMS[i],date:getDateByLastDigit(m,client.nit),link:null,linkText:'Cali'}); });
      } else if (icaM === 'ctg') {
        obls.push({id:'ica_ctg_anual',group:'ica',label:'ICA Anual (vig.2025 + ant.40%)',date:ICA_CTG_ANUAL,link:null,linkText:'Cartagena'});
        RETEICA_CTG.forEach(function (d, i) { obls.push({id:'reteica_ctg_'+i,group:'ica',label:'ReteICA '+ICA_BIMS[i],date:d,link:null,linkText:'Cartagena'}); });
      } else if (icaM === 'vup') {
        obls.push({id:'ica_vup_anual',group:'ica',label:'ICA Anual consolidada AG2025',date:ICA_VUP_ANUAL,link:null,linkText:'Valledupar'});
        ICA_VUP.forEach(function (d, i) { obls.push({id:'ica_vup_'+i,group:'ica',label:'ICA '+ICA_BIMS[i],date:d,link:null,linkText:'Valledupar'}); });
        RETEICA_VUP.forEach(function (d, i) { obls.push({id:'reteica_vup_'+i,group:'ica',label:'ReteICA '+RETEICA_VUP_MESES[i],date:d,link:null,linkText:'Valledupar'}); });
      } else {
        obls.push({id:'ica',group:'ica',label:'ICA',date:null,link:null,linkText:'Manual'});
      }
    }
    if (client.obligaciones.inc) {
      var incBims = [
        {label:'INC B1 (Ene-Feb)',dates:D_IVA_B1},{label:'INC B2 (Mar-Abr)',dates:D_IVA_B2},
        {label:'INC B3 (May-Jun)',dates:D_IVA_B3},{label:'INC B4 (Jul-Ago)',dates:D_IVA_B4},
        {label:'INC B5 (Sep-Oct)',dates:D_IVA_B5},{label:'INC B6 (Nov-Dic)',dates:D_IVA_B6}
      ];
      incBims.forEach(function (b) { obls.push({id:'inc_'+b.label.replace(/\s/g,'_').toLowerCase(),group:'inc',label:b.label,date:getDateByLastDigit(b.dates,client.nit),link:null,linkText:'F310'}); });
    }
    return obls;
  }

  /* ═══ Serialización TZ-segura (ver nota de cabecera) ═══ */
  function toISO(d) {
    if (!d) return null;
    if (!(d instanceof Date)) return String(d).slice(0, 10);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function stateKey(nit, oblId) { return String(nit).replace(/\D/g, '') + '_' + oblId; }

  /* ═══ clientToItems — la MISMA transformación que buildItems() de oficina.html.
     Devuelve [{fecha(ISO), cliente, nit, label, group, presentada}].
     opts.from / opts.to (ISO, inclusive): ventana opcional. opts.estado: mapa de presentadas. ═══ */
  function clientToItems(client, opts) {
    opts = opts || {};
    var estado = opts.estado || {};
    var from = opts.from || null, to = opts.to || null;
    var out = [];
    buildObligations(client).forEach(function (o) {
      if (!o.date) return;
      var iso = toISO(o.date);
      if (from && iso < from) return;
      if (to && iso > to) return;
      var nit = String(client.nit || '').replace(/\D/g, '');
      out.push({
        fecha: iso,
        cliente: client.nombre || '',
        nit: nit,
        label: o.label || '',
        group: o.group || '',
        presentada: !!estado[stateKey(nit, o.id)]
      });
    });
    return out;
  }

  /* clientsToItems — para varios clientes (lo que sube oficina.html / recalcula el cron) */
  function clientsToItems(clients, opts) {
    var items = [];
    (clients || []).forEach(function (c) { items = items.concat(clientToItems(c, opts)); });
    return items;
  }

  return {
    buildObligations: buildObligations,
    clientToItems: clientToItems,
    clientsToItems: clientsToItems,
    toISO: toISO,
    stateKey: stateKey,
    calcDV: calcDV,
    parseNIT: parseNIT,
    formatNIT: formatNIT,
    getLastDigit: getLastDigit,
    getLast2Digits: getLast2Digits,
    MESES_CORTO: MESES_CORTO,
    // expuestos por si se necesitan en tests/depuración
    _tables: { D_RENTA_PJ_1:D_RENTA_PJ_1, EXOG_PJ:EXOG_PJ, D_RENTA_PN:D_RENTA_PN }
  };
}));
