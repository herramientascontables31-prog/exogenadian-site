/**
 * Aziendale — Vencimientos Renta Personas Naturales (módulo compartido)
 *
 * Expone el calendario oficial DIAN de cuota única para renta PN AG 2025
 * (declarado en 2026), así como utilidades para consultar por NIT y
 * obligatoriedad de declarar.
 *
 * Fuente normativa:
 *   - Calendario_Tributario_2026.pdf oficial DIAN (verificado contra portal)
 *   - Decreto reglamentario plazos 2026 (calendario)
 *   - Art. 594-3 ET (umbrales de obligación a declarar)
 *   - Resolución DIAN 000193/2024 (UVT 2025: $49.799)
 *
 * Distribución por NIT:
 *   - Renta PN: cuota única según los DOS últimos dígitos del NIT
 *     (50 rangos, del 12-ago-2026 al 26-oct-2026).
 *
 * Importar:
 *   <script src="shared/vencimientos-pn.js"></script>
 *   var info = vencimientosPN.getVencimientoPN('1234567890');
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.vencimientosPN = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  //  Renta PN AG 2025 (declarado en 2026) — cuota única
  //  Fuente: Calendario_Tributario_2026.pdf oficial DIAN
  //  Distribución: 2 últimos dígitos del NIT, 50 rangos contiguos
  // ══════════════════════════════════════════════════════════════════════
  var D_RENTA_PN_2026 = [
    {lo:1,hi:2,d:'2026-08-12'},   {lo:3,hi:4,d:'2026-08-13'},
    {lo:5,hi:6,d:'2026-08-14'},   {lo:7,hi:8,d:'2026-08-18'},
    {lo:9,hi:10,d:'2026-08-19'},  {lo:11,hi:12,d:'2026-08-20'},
    {lo:13,hi:14,d:'2026-08-21'}, {lo:15,hi:16,d:'2026-08-24'},
    {lo:17,hi:18,d:'2026-08-25'}, {lo:19,hi:20,d:'2026-08-26'},
    {lo:21,hi:22,d:'2026-08-27'}, {lo:23,hi:24,d:'2026-08-28'},
    {lo:25,hi:26,d:'2026-08-31'}, {lo:27,hi:28,d:'2026-09-01'},
    {lo:29,hi:30,d:'2026-09-02'}, {lo:31,hi:32,d:'2026-09-03'},
    {lo:33,hi:34,d:'2026-09-04'}, {lo:35,hi:36,d:'2026-09-07'},
    {lo:37,hi:38,d:'2026-09-08'}, {lo:39,hi:40,d:'2026-09-09'},
    {lo:41,hi:42,d:'2026-09-10'}, {lo:43,hi:44,d:'2026-09-11'},
    {lo:45,hi:46,d:'2026-09-14'}, {lo:47,hi:48,d:'2026-09-15'},
    {lo:49,hi:50,d:'2026-09-16'}, {lo:51,hi:52,d:'2026-09-17'},
    {lo:53,hi:54,d:'2026-09-18'}, {lo:55,hi:56,d:'2026-09-21'},
    {lo:57,hi:58,d:'2026-09-22'}, {lo:59,hi:60,d:'2026-09-23'},
    {lo:61,hi:62,d:'2026-09-24'}, {lo:63,hi:64,d:'2026-09-25'},
    {lo:65,hi:66,d:'2026-09-28'}, {lo:67,hi:68,d:'2026-10-01'},
    {lo:69,hi:70,d:'2026-10-02'}, {lo:71,hi:72,d:'2026-10-05'},
    {lo:73,hi:74,d:'2026-10-06'}, {lo:75,hi:76,d:'2026-10-07'},
    {lo:77,hi:78,d:'2026-10-08'}, {lo:79,hi:80,d:'2026-10-09'},
    {lo:81,hi:82,d:'2026-10-13'}, {lo:83,hi:84,d:'2026-10-14'},
    {lo:85,hi:86,d:'2026-10-15'}, {lo:87,hi:88,d:'2026-10-16'},
    {lo:89,hi:90,d:'2026-10-19'}, {lo:91,hi:92,d:'2026-10-20'},
    {lo:93,hi:94,d:'2026-10-21'}, {lo:95,hi:96,d:'2026-10-22'},
    {lo:97,hi:98,d:'2026-10-23'}, {lo:99,hi:100,d:'2026-10-26'}
  ];

  var MESES_ES = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];

  var DIAS_SEM_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  // ══════════════════════════════════════════════════════════════════════
  //  Utilidades de NIT
  // ══════════════════════════════════════════════════════════════════════

  /**
   * Devuelve los 2 últimos dígitos del NIT como número 1..100.
   * "00" se convierte en 100 para que los rangos secuenciales (99-100)
   * funcionen sin caso especial.
   */
  function last2(nit){
    if(nit == null) return null;
    var clean = String(nit).replace(/\D/g, '');
    if(!clean) return null;
    var v = parseInt(clean.slice(-2), 10);
    if(isNaN(v)) return null;
    return v === 0 ? 100 : v;
  }

  function fechaCO(isoDate){
    var p = String(isoDate).split('-');
    if(p.length !== 3) return isoDate;
    return parseInt(p[2], 10) + ' de ' + MESES_ES[parseInt(p[1], 10) - 1] + ' de ' + p[0];
  }

  function fechaCOLargo(isoDate){
    var d = new Date(isoDate + 'T00:00:00');
    return DIAS_SEM_ES[d.getDay()] + ' ' + fechaCO(isoDate);
  }

  function diasEntre(desde, hasta){
    var ms = hasta.getTime() - desde.getTime();
    return Math.round(ms / 86400000);
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Consulta principal por NIT
  // ══════════════════════════════════════════════════════════════════════

  /**
   * @param {string|number} nit
   * @param {number} [year=2026]  Año de presentación (no año gravable)
   * @returns {{
   *   nit: string,
   *   ultimosDosDigitos: number,
   *   fechaIso: string,
   *   fechaFmt: string,
   *   fechaLarga: string,
   *   diasRestantes: number,
   *   vencido: boolean,
   *   rangoLo: number,
   *   rangoHi: number
   * } | null}
   */
  function getVencimientoPN(nit, year){
    year = year || 2026;
    var tabla = year === 2026 ? D_RENTA_PN_2026 : null;
    if(!tabla) return null;

    var v = last2(nit);
    if(v == null) return null;

    for(var i = 0; i < tabla.length; i++){
      var r = tabla[i];
      if(v >= r.lo && v <= r.hi){
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        var fecha = new Date(r.d + 'T00:00:00');
        var dias = diasEntre(hoy, fecha);
        return {
          nit: String(nit),
          ultimosDosDigitos: v,
          fechaIso: r.d,
          fechaFmt: fechaCO(r.d),
          fechaLarga: fechaCOLargo(r.d),
          diasRestantes: dias,
          vencido: dias < 0,
          rangoLo: r.lo,
          rangoHi: r.hi
        };
      }
    }
    return null;
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Obligatoriedad de declarar — AG 2025 (declarado en 2026)
  //  Base: Art. 594-3 ET y decreto reglamentario plazos 2026.
  //  UVT 2025: $49.799 (Res. DIAN 000193/2024).
  // ══════════════════════════════════════════════════════════════════════
  function topesObligacionAG2025(){
    var uvt = 49799;
    return {
      anoGravable: 2025,
      uvt: uvt,
      norma: 'Art. 594-3 ET y Decreto reglamentario plazos 2026',
      // Si el contribuyente supera CUALQUIERA de estos topes a 31-dic-2025,
      // está obligado a declarar renta en 2026.
      topes: [
        {
          id: 'patrimonioBruto',
          concepto: 'Patrimonio bruto a 31 de diciembre de 2025',
          uvt: 4500,
          pesos: 4500 * uvt,
          detalle: 'Suma de todos los bienes y derechos sin restar deudas.'
        },
        {
          id: 'ingresosBrutos',
          concepto: 'Ingresos brutos del año 2025',
          uvt: 1400,
          pesos: 1400 * uvt,
          detalle: 'Salarios, honorarios, pensiones, arrendamientos, intereses, dividendos, ventas, etc.'
        },
        {
          id: 'comprasConsumos',
          concepto: 'Compras y consumos (incluida tarjeta de crédito)',
          uvt: 1400,
          pesos: 1400 * uvt,
          detalle: 'Total acumulado del año por todos los medios de pago.'
        },
        {
          id: 'consignaciones',
          concepto: 'Consignaciones, depósitos o inversiones financieras',
          uvt: 1400,
          pesos: 1400 * uvt,
          detalle: 'Suma de movimientos en cuentas y productos financieros del año.'
        }
      ],
      adicionales: [
        {
          id: 'responsableIVA',
          concepto: 'Ser responsable del IVA al 31 de diciembre de 2025',
          detalle: 'No aplica para inscritos en régimen simple de tributación.'
        },
        {
          id: 'rentasExterior',
          concepto: 'Tener rentas, patrimonio o ingresos en el exterior',
          detalle: 'Residentes fiscales con bienes o rentas fuera de Colombia.'
        }
      ]
    };
  }

  /**
   * Evalúa una respuesta sí/no del contribuyente a cada tope y devuelve
   * si está obligado a declarar.
   *
   * @param {object} respuestas - { patrimonioBruto: bool, ingresosBrutos: bool, ... }
   * @returns {{obligado: boolean, motivos: string[], norma: string}}
   */
  function evaluarObligatoriedad(respuestas){
    var info = topesObligacionAG2025();
    var motivos = [];
    info.topes.forEach(function(t){
      if(respuestas && respuestas[t.id]){
        motivos.push(t.concepto + ' superó los ' + t.uvt.toLocaleString('es-CO') + ' UVT');
      }
    });
    info.adicionales.forEach(function(t){
      if(respuestas && respuestas[t.id]){
        motivos.push(t.concepto);
      }
    });
    return {
      obligado: motivos.length > 0,
      motivos: motivos,
      norma: info.norma
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  //  API pública
  // ══════════════════════════════════════════════════════════════════════
  // Snippet HTML listo para mostrar el vencimiento inline en una herramienta.
  // Devuelve '' si el NIT aún no tiene 2 dígitos útiles.
  function badgeHTML(nit, year){
    var info = getVencimientoPN(nit, year);
    if(!info) return '';
    var color, etiqueta;
    if(info.vencido){ color = '#DC2626'; etiqueta = 'Venció el ' + info.fechaFmt + ' (hace ' + Math.abs(info.diasRestantes) + ' días)'; }
    else if(info.diasRestantes <= 15){ color = '#D97706'; etiqueta = 'Vence el ' + info.fechaFmt + ' · faltan ' + info.diasRestantes + ' días'; }
    else { color = '#059669'; etiqueta = 'Vence el ' + info.fechaFmt + ' · faltan ' + info.diasRestantes + ' días'; }
    return '<span style="font-size:1.05rem">&#128197;</span> <strong style="color:' + color + '">' + etiqueta + '</strong>'
         + '<div style="font-size:.7rem;color:#6b7280;margin-top:2px">Cuota única renta PN AG 2025 · por los 2 últimos dígitos del NIT (' + info.ultimosDosDigitos + ')</div>';
  }

  // Evalúa obligatoriedad a partir de las cifras YA ingresadas en el liquidador
  // (patrimonio bruto, ingresos brutos, consignaciones) y devuelve un snippet HTML.
  // Devuelve '' si aún no hay datos (form vacío) para no afirmar de más.
  function badgeObligatoriedadHTML(cifras, year){
    cifras = cifras || {};
    var pb = cifras.patrimonioBruto || 0, ib = cifras.ingresosBrutos || 0, cg = cifras.consignaciones || 0;
    if(pb <= 0 && ib <= 0 && cg <= 0) return '';
    var t = topesObligacionAG2025(), uvt = t.uvt;
    var ev = evaluarObligatoriedad({
      patrimonioBruto: pb > 4500 * uvt,
      ingresosBrutos:  ib > 1400 * uvt,
      consignaciones:  cg > 1400 * uvt
    });
    var sep = '<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;font-size:.8rem">';
    if(ev.obligado){
      return sep + '<strong style="color:#059669">&#10003; Obligado a declarar renta</strong>'
        + '<div style="color:#6b7280;font-size:.72rem;margin-top:2px">' + ev.motivos.join(' · ') + '. ' + ev.norma + '</div></div>';
    }
    return sep + '<strong style="color:#6b7280">Por ingresos y patrimonio no superaría los topes</strong>'
      + '<div style="color:#6b7280;font-size:.72rem;margin-top:2px">Verifica también consumos con tarjeta, consignaciones, ser responsable de IVA o tener bienes/rentas en el exterior (Art. 594-3 ET).</div></div>';
  }

  return {
    D_RENTA_PN_2026: D_RENTA_PN_2026,
    last2: last2,
    fechaCO: fechaCO,
    fechaCOLargo: fechaCOLargo,
    getVencimientoPN: getVencimientoPN,
    badgeHTML: badgeHTML,
    badgeObligatoriedadHTML: badgeObligatoriedadHTML,
    topesObligacionAG2025: topesObligacionAG2025,
    evaluarObligatoriedad: evaluarObligatoriedad
  };
}));
