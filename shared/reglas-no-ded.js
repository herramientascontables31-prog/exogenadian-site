/* ═══════════════════════════════════════════════════════════════
   64 REGLAS DE GASTOS NO DEDUCIBLES — Estatuto Tributario Colombia
   Compartido entre renta110.html y formato2516.html para que
   ambas tools apliquen idénticas reglas de deducibilidad fiscal.

   Cada regla: {id, nom, art, tipo:'no_ded'|'gmf'|'parcial', test(cta,nom),
                pct?: fraccion deducible cuando aplica}
   ═══════════════════════════════════════════════════════════════ */
(function(){
  function normNom(s){return(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}

  const REGLAS_NO_DED=[
    // MULTAS, SANCIONES, INTERESES MORATORIOS (Art. 107, 107-1)
    {id:1,nom:'Multas',art:'107-1',tipo:'no_ded',test:(c,n)=>/multa/.test(n)},
    {id:2,nom:'Sanciones',art:'107-1',tipo:'no_ded',test:(c,n)=>/sancion/.test(n)},
    {id:3,nom:'Intereses de mora',art:'107-1',tipo:'no_ded',test:(c,n)=>/interes.*(mora|moratorio)|mora.*interes/.test(n)},
    {id:4,nom:'Intereses moratorios DIAN',art:'107-1',tipo:'no_ded',test:(c,n)=>c.startsWith('53050504')},
    {id:5,nom:'Sanciones DIAN',art:'107-1',tipo:'no_ded',test:(c,n)=>c.startsWith('53950520')},
    {id:6,nom:'Litigios y demandas',art:'107-1',tipo:'no_ded',test:(c,n)=>/litigio|demanda|proceso judicial/.test(n)},
    {id:7,nom:'Penalidades contractuales',art:'107-1',tipo:'no_ded',test:(c,n)=>/penalidad|clausula penal|indemnizacion por incumpl/.test(n)},
    // GMF / 4x1000 (Art. 115) — 50% deducible
    {id:8,nom:'GMF / 4x1000',art:'115',tipo:'gmf',pct:0.5,test:(c,n)=>/gmf|4.?x.?1000|gravamen.*movimiento|4 por mil/.test(n)},
    {id:9,nom:'GMF por cuenta PUC',art:'115',tipo:'gmf',pct:0.5,test:(c,n)=>c.startsWith('5115')&&/gravamen|gmf|movimiento/.test(n)},
    // DONACIONES (Art. 257)
    {id:10,nom:'Donaciones',art:'257',tipo:'no_ded',test:(c,n)=>/donacion/.test(n)&&!/descuento tributario/.test(n)},
    {id:11,nom:'Donaciones PUC 5395',art:'257',tipo:'no_ded',test:(c,n)=>c.startsWith('539525')},
    // GASTOS NO DEDUCIBLES EXPLICITOS EN NOMBRE
    {id:12,nom:'Gasto marcado no deducible',art:'107',tipo:'no_ded',test:(c,n)=>/no deducible|no deduci/.test(n)},
    // IMPUESTOS NO DEDUCIBLES (Art. 115)
    {id:13,nom:'Impuesto de renta',art:'115',tipo:'no_ded',test:(c,n)=>/impuesto.*renta|provision.*renta|gasto.*impuesto.*renta/.test(n)},
    {id:14,nom:'Impuesto al patrimonio',art:'115',tipo:'no_ded',test:(c,n)=>/impuesto.*patrimonio/.test(n)},
    {id:15,nom:'Impuesto de normalizacion',art:'115',tipo:'no_ded',test:(c,n)=>/normalizacion tributaria/.test(n)},
    {id:16,nom:'Impuesto diferido gasto',art:'115',tipo:'no_ded',test:(c,n)=>/impuesto diferido/.test(n)},
    {id:17,nom:'IVA descontable no procedente',art:'115',tipo:'no_ded',test:(c,n)=>/iva.*no.*deducible|iva.*no.*descontable|iva.*mayor.*valor/.test(n)},
    // PROVISIONES Y DETERIOROS (Art. 105, 145)
    {id:18,nom:'Provision de cartera',art:'145',tipo:'no_ded',test:(c,n)=>/provision.*cartera|deterioro.*cartera/.test(n)&&!/fiscal/.test(n)},
    {id:19,nom:'Provision de inventarios',art:'105',tipo:'no_ded',test:(c,n)=>/provision.*inventario|deterioro.*inventario|obsolescencia/.test(n)},
    {id:20,nom:'Provision de inversiones',art:'105',tipo:'no_ded',test:(c,n)=>/provision.*inversion|deterioro.*inversion/.test(n)},
    {id:21,nom:'Provision de activos biologicos',art:'105',tipo:'no_ded',test:(c,n)=>/provision.*biolog|deterioro.*biolog/.test(n)},
    {id:22,nom:'Provision de intangibles',art:'105',tipo:'no_ded',test:(c,n)=>/provision.*intangible|deterioro.*intangible|amortizacion.*intangible.*contable/.test(n)},
    {id:23,nom:'Provision de PPE',art:'105',tipo:'no_ded',test:(c,n)=>/provision.*propiedad|deterioro.*propiedad|deterioro.*planta|deterioro.*equipo/.test(n)},
    {id:24,nom:'Provision general',art:'105',tipo:'no_ded',test:(c,n)=>/^provision|gasto.*provision/.test(n)&&!/fiscal|deducible/.test(n)},
    {id:25,nom:'Deterioro cuentas por cobrar (contable)',art:'145',tipo:'no_ded',test:(c,n)=>/deterioro.*cuenta.*cobrar|deterioro.*deudor/.test(n)&&!/fiscal/.test(n)},
    // DEPRECIACIONES NO DEDUCIBLES (Art. 128-140)
    {id:26,nom:'Depreciacion exceso vida util fiscal',art:'137',tipo:'no_ded',test:(c,n)=>/depreciacion.*exceso|depreciacion.*no deducible|depreciacion.*contable.*mayor/.test(n)},
    {id:27,nom:'Depreciacion activos revaluados',art:'128',tipo:'no_ded',test:(c,n)=>/depreciacion.*revalua/.test(n)},
    // AMORTIZACIONES NO DEDUCIBLES (Art. 142-143)
    {id:28,nom:'Amortizacion credito mercantil',art:'143',tipo:'no_ded',test:(c,n)=>/amortizacion.*credito.*mercantil|amortizacion.*goodwill|amortizacion.*plusvalia/.test(n)},
    {id:29,nom:'Amortizacion gastos preoperativos exceso',art:'142',tipo:'no_ded',test:(c,n)=>/amortizacion.*preoperativ.*no deducible/.test(n)},
    // GASTOS DE PERIODOS ANTERIORES (Art. 107)
    {id:30,nom:'Gastos de vigencias anteriores',art:'107',tipo:'no_ded',test:(c,n)=>/vigencia.*anterior|periodo.*anterior|ejercicio.*anterior|a[nñ]o.*anterior/.test(n)},
    // GASTOS SIN RELACION DE CAUSALIDAD (Art. 107)
    {id:31,nom:'Gastos personales socios',art:'107',tipo:'no_ded',test:(c,n)=>/gasto.*personal.*socio|gasto.*socio.*personal/.test(n)},
    {id:32,nom:'Gastos suntuarios',art:'107',tipo:'no_ded',test:(c,n)=>/suntuario|lujo.*no.*necesario/.test(n)},
    {id:33,nom:'Gastos de representacion exceso',art:'107-1',tipo:'no_ded',test:(c,n)=>/representacion.*exceso|representacion.*no deducible/.test(n)},
    {id:34,nom:'Gastos recreacion no soportados',art:'107',tipo:'no_ded',test:(c,n)=>/recreacion.*no deducible|bienestar.*no deducible/.test(n)},
    // EXCESO PAGOS LABORALES (Art. 108, 109, 110)
    {id:35,nom:'Bonificaciones no salariales exceso',art:'108',tipo:'no_ded',test:(c,n)=>/bonificacion.*no.*salarial.*exceso|bonificacion.*no deducible/.test(n)},
    {id:36,nom:'Indemnizaciones laborales no deducibles',art:'108',tipo:'no_ded',test:(c,n)=>/indemnizacion.*laboral.*no deducible/.test(n)},
    // COSTOS Y GASTOS SIN FACTURA ELECTRONICA (Art. 771-2, 616-1)
    {id:37,nom:'Gastos sin soporte (factura electronica)',art:'771-2',tipo:'no_ded',test:(c,n)=>/sin.*factura|sin.*soporte|no.*facturado|gasto.*no.*soportado/.test(n)},
    // REGALIAS E INTANGIBLES (Art. 120, 124)
    {id:38,nom:'Regalias a vinculados exterior exceso',art:'124',tipo:'no_ded',test:(c,n)=>/regalia.*vinculado.*exceso|regalia.*no deducible/.test(n)},
    {id:39,nom:'Pagos a paraisos fiscales',art:'124-2',tipo:'no_ded',test:(c,n)=>/paraiso fiscal|jurisdiccion.*no cooperante|pago.*exterior.*no deducible/.test(n)},
    // INTERESES Y GASTOS FINANCIEROS (Art. 117, 118-1)
    {id:40,nom:'Intereses subcapitalizacion',art:'118-1',tipo:'no_ded',test:(c,n)=>/subcapitalizacion|interes.*exceso.*endeudamiento|interes.*vinculado.*exceso/.test(n)},
    {id:41,nom:'Intereses prestamos socios no bancarizados',art:'117',tipo:'no_ded',test:(c,n)=>/interes.*socio.*no deducible|interes.*prestamo.*socio/.test(n)&&/no deducible/.test(n)},
    {id:42,nom:'Intereses usura',art:'884 C.Co',tipo:'no_ded',test:(c,n)=>/interes.*usura|interes.*exceso.*legal/.test(n)},
    {id:43,nom:'Gastos financieros diferencia en cambio no realizada',art:'288',tipo:'no_ded',test:(c,n)=>/diferencia.*cambio.*no realizada|diferencia.*cambio.*contable/.test(n)},
    // GASTOS CON VINCULADOS ECONOMICOS (Art. 260-1 a 260-11)
    {id:44,nom:'Gastos precios de transferencia exceso',art:'260-2',tipo:'no_ded',test:(c,n)=>/precio.*transferencia.*exceso|vinculado.*exceso.*arm/.test(n)},
    // COSTOS Y GASTOS ESTIMADOS (Art. 105)
    {id:45,nom:'Costos estimados o provisionados',art:'105',tipo:'no_ded',test:(c,n)=>/costo.*estimado|costo.*provisionado|provision.*costo/.test(n)&&!/fiscal/.test(n)},
    {id:46,nom:'Pasivos estimados y provisiones',art:'105',tipo:'no_ded',test:(c,n)=>c.startsWith('526')||/^pasivo.*estimado|provision.*no.*fiscal/i.test(n)},
    {id:47,nom:'Provisiones diversas',art:'105',tipo:'no_ded',test:(c,n)=>c.startsWith('5299')&&!/fiscal|deducible/.test(n)},
    // IMPUESTOS ASUMIDOS (Art. 115)
    {id:48,nom:'Impuestos asumidos no deducibles',art:'115',tipo:'no_ded',test:(c,n)=>/impuesto.*asumido|iva.*asumido|iva.*no.*descontable/.test(n)},
    {id:49,nom:'Retencion asumida',art:'115',tipo:'no_ded',test:(c,n)=>/retencion.*asumida.*no deducible/.test(n)},
    {id:50,nom:'ICA no deducible',art:'115',tipo:'no_ded',test:(c,n)=>/ica.*no deducible|industria.*comercio.*no deducible/.test(n)},
    // GASTOS EN EL EXTERIOR (Art. 121, 122, 123, 124)
    {id:51,nom:'Gastos exterior sin retencion',art:'121-123',tipo:'no_ded',test:(c,n)=>/gasto.*exterior.*sin.*retencion|exterior.*no deducible/.test(n)},
    {id:52,nom:'Gastos exterior exceso 15%',art:'122',tipo:'no_ded',test:(c,n)=>/exterior.*exceso.*15|gasto.*exterior.*limite/.test(n)},
    // PERDIDAS EN ACTIVOS (Art. 148, 149)
    {id:53,nom:'Perdida en venta de activos a vinculados',art:'151',tipo:'no_ded',test:(c,n)=>/perdida.*venta.*activo.*vinculado|perdida.*enajenacion.*vinculado/.test(n)},
    {id:54,nom:'Perdida en activos no productivos',art:'148',tipo:'no_ded',test:(c,n)=>/perdida.*activo.*no productivo|perdida.*activo.*personal/.test(n)},
    // BENEFICIOS A EMPLEADOS NIIF (Art. 105)
    {id:55,nom:'Beneficios a empleados largo plazo (NIIF)',art:'105',tipo:'no_ded',test:(c,n)=>/beneficio.*empleado.*largo plazo|beneficio.*post.*empleo|pension.*actuarial/.test(n)},
    {id:56,nom:'Pagos basados en acciones (NIIF)',art:'105',tipo:'no_ded',test:(c,n)=>/pago.*basado.*accion|stock.*option|compensacion.*accion/.test(n)},
    // VALOR RAZONABLE (Art. 105, 28)
    {id:57,nom:'Ajuste valor razonable (no realizado)',art:'105',tipo:'no_ded',test:(c,n)=>/valor razonable.*no realizado|ajuste.*valor razonable|medicion.*valor razonable.*gasto/.test(n)},
    {id:58,nom:'Perdida no realizada inversiones',art:'105',tipo:'no_ded',test:(c,n)=>/perdida.*no realizada|perdida.*valoracion/.test(n)},
    // CUENTAS PUC ESPECIFICAS NO DEDUCIBLES
    {id:59,nom:'Gastos diversos no deducibles (PUC 5395)',art:'107',tipo:'no_ded',test:(c,n)=>c.startsWith('539520')},
    {id:60,nom:'Gastos extraordinarios (PUC 5310)',art:'107',tipo:'no_ded',test:(c,n)=>c.startsWith('5310')&&/extraordinario|no.*recurrente/.test(n)},
    // APORTES PARAFISCALES (Art. 114-1)
    {id:61,nom:'Aportes parafiscales no pagados',art:'114-1',tipo:'no_ded',test:(c,n)=>/parafiscal.*no.*pagado|parafiscal.*no deducible|aportes.*no.*pagado/.test(n)},
    // OTROS
    {id:62,nom:'Gastos de ejercicios futuros',art:'105',tipo:'no_ded',test:(c,n)=>/gasto.*futuro|gasto.*anticip.*no deducible|diferido.*gasto/.test(n)&&/no deducible/.test(n)},
    {id:63,nom:'Ajustes por convergencia NIIF',art:'105',tipo:'no_ded',test:(c,n)=>/convergencia.*niif|ajuste.*niif.*no deducible|efecto.*niif/.test(n)},
    // ── REGLAS POR CODIGO PUC INEQUIVOCO (capturan el caso aunque el nombre de la cuenta sea generico) ──
    // Grupo 54 del PUC (Decreto 2650 y planes NIIF de Siigo/WO/Helisa/MidaSoft) esta reservado
    // EXCLUSIVAMENTE a "Impuesto de renta y complementarios" (5405) e "Impuesto diferido" (5410).
    // El impuesto de renta NO es deducible (Art. 115 ET). Es el error #1 en glosas DIAN.
    {id:64,nom:'Impuesto de renta y complementarios + diferido (grupo PUC 54)',art:'115',tipo:'no_ded',test:(c,n)=>/^54\d/.test(c)}
  ];

  function clasificarDeducibilidad(code,name){
    const n=normNom(name);
    for(const r of REGLAS_NO_DED){if(r.test(code,n))return r}
    return null;
  }

  // Calcula valFiscal a partir de val contable aplicando la regla:
  //   no_ded → 0
  //   gmf → val × pct (default 50%)
  //   sin regla → val (deducible 100%)
  function calcularValFiscal(code,name,val){
    const r=clasificarDeducibilidad(code,name);
    if(!r)return val;
    if(r.tipo==='no_ded')return 0;
    if(r.tipo==='gmf')return Math.round(val*(r.pct||0.5));
    return val;
  }

  // Expone API global
  window.REGLAS_NO_DED=REGLAS_NO_DED;
  window.normNom_red=normNom;
  window.clasificarDeducibilidad=clasificarDeducibilidad;
  window.calcularValFiscalDeduc=calcularValFiscal;
})();
