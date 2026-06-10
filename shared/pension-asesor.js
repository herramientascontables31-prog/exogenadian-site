/**
 * ExogenaDIAN — Asesor pensional con reglas normativas verificadas
 *
 * Motor de reglas que recibe los datos del cotizante + resultado del
 * cálculo y devuelve un dictamen ordenado por severidad. Cada hallazgo
 * incluye la cita normativa exacta (ley + artículo) verificada
 * manualmente contra el texto oficial.
 *
 * Severidades:
 *   alerta     — bloqueante o requisito no cumplido
 *   riesgo     — situación que puede reducir la mesada
 *   sugerencia — acción recomendada para mejorar
 *   info       — confirmación o contexto normativo
 *
 * Datos de entrada (d):
 *   sexo: 'H' | 'M'
 *   edad: número (actual)
 *   edadMeta: número
 *   semanasActuales: número
 *   semanasFinales: número (proyectadas)
 *   salario: número COP (actual)
 *   ibl: número COP (proyectado)
 *   tasa: número 0-1
 *   mesada: número COP
 *   regime: 'ley797' | 'reforma'
 *   fondoActual?: string (opcional)
 *   fechaInicioCotizacion?: string YYYY-MM (opcional)
 */
(function(global, factory){
  if(typeof module !== 'undefined' && module.exports){
    module.exports = factory();
  } else {
    global.PensionAsesor = factory();
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function(){
  'use strict';

  var SMLMV = 1750905;        // 2026
  var UVT_2026 = 49799;       // Resolución DIAN 000193/2025
  var EDAD_H = 62, EDAD_M = 57;
  var SEM_MIN = 1300, SEM_MAX = 1800;
  var TRANS_H = 750, TRANS_M = 1000;
  var PILAR1_LIM_SMLMV = 2.3;

  function fCOP(v){ return '$' + Math.round(v).toLocaleString('es-CO'); }
  function fSMLMV(v){ return (v/SMLMV).toFixed(2)+' SMLMV'; }

  // ──────────────────────────────────────────────────────────────────
  //  REGLAS — orden lógico, ordenamiento por severidad al final
  // ──────────────────────────────────────────────────────────────────
  var REGLAS = [
    // ── 1. Régimen aplicable ──────────────────────────────────────
    {
      id: 'transicion-cumplida',
      cond: function(d){
        var u = d.sexo==='H' ? TRANS_H : TRANS_M;
        return d.semanasActuales >= u;
      },
      hallazgo: function(d){
        var u = d.sexo==='H' ? TRANS_H : TRANS_M;
        return {
          severidad: 'info',
          titulo: 'Régimen de transición — Ley 797 aplicable',
          descripcion: 'A la fecha de corte tenías '+d.semanasActuales.toLocaleString('es-CO')+' semanas, sobre el umbral de '+u+' para '+(d.sexo==='H'?'hombres':'mujeres')+'. Mantienes el cálculo clásico de Colpensiones (RPM) con la fórmula del Acto Legislativo 01/2005.',
          accion: 'Conserva tu afiliación a Colpensiones. Si te trasladas a RAIS pierdes la transición de forma irrevocable.',
          normas: [
            { ley: 'Ley 2381/2024', articulo: 'art. 76', resumen: 'Régimen de transición: cotizantes con ≥750 (H) / 1000 (M) semanas al 1-jul-2025 conservan Ley 797.' }
          ]
        };
      }
    },

    {
      id: 'transicion-perdida-margen',
      cond: function(d){
        var u = d.sexo==='H' ? TRANS_H : TRANS_M;
        return d.semanasActuales < u && d.semanasActuales >= u - 50;
      },
      hallazgo: function(d){
        var u = d.sexo==='H' ? TRANS_H : TRANS_M;
        var falta = (u - d.semanasActuales).toFixed(2);
        return {
          severidad: 'alerta',
          titulo: 'Régimen de transición perdido por margen estrecho ('+falta+' semanas)',
          descripcion: 'Tu reporte muestra '+d.semanasActuales.toFixed(2)+' semanas; el umbral para entrar a transición Ley 797 era '+u+' al 1-jul-2025. Pagos realizados en junio/julio 2025 que aparecen "aplicados al periodo declarado" pueden contar para esa fecha de corte si revisas con Colpensiones.',
          accion: 'Solicita por escrito a Colpensiones (PAC o portal) el recálculo de semanas con corte exacto 1-jul-2025. Si la inclusión de pagos en mora o mal aplicados te suma las '+falta+' semanas faltantes, conservas la fórmula Ley 797.',
          normas: [
            { ley: 'Ley 2381/2024', articulo: 'art. 76', resumen: 'Régimen de transición.' },
            { ley: 'Ley 100/1993', articulo: 'art. 24', resumen: 'Acciones de cobro y mora del empleador. Las semanas no se pierden por mora ajena al cotizante.' }
          ]
        };
      }
    },

    // ── 2. Requisito semanas mínimas ──────────────────────────────
    {
      id: 'cumple-semanas-min',
      cond: function(d){ return d.semanasFinales >= SEM_MIN; },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Cumples las 1.300 semanas mínimas',
          descripcion: 'A tu edad meta proyectas '+Math.round(d.semanasFinales).toLocaleString('es-CO')+' semanas, por encima del mínimo legal de '+SEM_MIN+'.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 9', resumen: 'Modifica Ley 100/1993 art. 33: requisito de 1.300 semanas para pensión de vejez en RPM.' }
          ]
        };
      }
    },

    {
      id: 'no-cumple-semanas-min',
      cond: function(d){ return d.semanasFinales < SEM_MIN; },
      hallazgo: function(d){
        var faltan = SEM_MIN - d.semanasFinales;
        var anos = (faltan/52).toFixed(1);
        return {
          severidad: 'alerta',
          titulo: 'No alcanzas las 1.300 semanas mínimas',
          descripcion: 'A tu edad meta tendrías '+Math.round(d.semanasFinales).toLocaleString('es-CO')+' semanas. Te faltan '+Math.round(faltan)+' semanas (≈ '+anos+' años) para acceder a pensión de vejez ordinaria.',
          accion: 'Tres caminos: (a) cotizar '+anos+' años más antes de pensionarte; (b) acceder a BEPS si tu IBC promedio es <1 SMLMV; (c) reclamar indemnización sustitutiva al cumplir la edad.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 9', resumen: '1.300 semanas mínimas para vejez RPM.' },
            { ley: 'Ley 100/1993', articulo: 'art. 37', resumen: 'Indemnización sustitutiva: devolución de aportes con rendimientos a quien no cumple requisitos.' },
            { ley: 'Decreto 295/2017', articulo: 'art. 1', resumen: 'BEPS: beneficio económico periódico para personas con ingreso inferior a 1 SMLMV.' }
          ]
        };
      }
    },

    // ── 3. Requisito edad ────────────────────────────────────────
    {
      id: 'cumple-edad',
      cond: function(d){
        var min = d.sexo==='H' ? EDAD_H : EDAD_M;
        return d.edadMeta >= min;
      },
      hallazgo: function(d){
        var min = d.sexo==='H' ? EDAD_H : EDAD_M;
        return {
          severidad: 'info',
          titulo: 'Cumples la edad mínima de pensión',
          descripcion: 'Tu edad meta de '+d.edadMeta+' años está sobre el mínimo de '+min+' para '+(d.sexo==='H'?'hombres':'mujeres')+'.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 9 num. 1', resumen: 'Edad mínima vejez: 62 años hombres, 57 años mujeres.' }
          ]
        };
      }
    },

    {
      id: 'no-cumple-edad',
      cond: function(d){
        var min = d.sexo==='H' ? EDAD_H : EDAD_M;
        return d.edadMeta < min;
      },
      hallazgo: function(d){
        var min = d.sexo==='H' ? EDAD_H : EDAD_M;
        return {
          severidad: 'alerta',
          titulo: 'Edad meta insuficiente',
          descripcion: 'Tu edad meta de '+d.edadMeta+' años está por debajo del mínimo legal de '+min+' para '+(d.sexo==='H'?'hombres':'mujeres')+'. La pensión de vejez no se puede solicitar antes.',
          accion: 'Ajusta tu edad meta a '+min+' o más. Pensión anticipada solo aplica para invalidez, riesgo profesional o regímenes especiales (alto riesgo, magisterio, FFMM).',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 9 num. 1', resumen: 'Edad mínima vejez: 62/57.' }
          ]
        };
      }
    },

    // ── 4. Tasa de reemplazo ─────────────────────────────────────
    {
      id: 'tasa-reemplazo-baja-ibl-alto',
      cond: function(d){ return d.semanasFinales >= SEM_MIN && d.tasa <= 0.62 && (d.ibl/SMLMV) > 4; },
      hallazgo: function(d){
        return {
          severidad: 'riesgo',
          titulo: 'Tasa de reemplazo en mínimos por IBL alto',
          descripcion: 'Tu IBL proyectado de '+fCOP(d.ibl)+' ('+fSMLMV(d.ibl)+') aplica una tasa de '+(d.tasa*100).toFixed(1)+'%. La fórmula reduce 0,50% por cada SMLMV que el IBL exceda al primero, hasta el piso de 55%.',
          accion: 'Cotizar más de '+SEM_MIN+' semanas suma 1,5% por cada bloque de 50 semanas extra hasta '+SEM_MAX+' (tope 80%). Es la única vía RPM para subir la tasa con IBL alto.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 10', resumen: 'Modifica Ley 100/1993 art. 34: r = 65,5% − 0,5% × (IBL/SMLMV − 1) + 1,5% por cada 50 semanas sobre 1.300, mín. 55%, máx. 80%.' }
          ]
        };
      }
    },

    {
      id: 'tasa-reemplazo-maxima',
      cond: function(d){ return d.tasa >= 0.795 && d.semanasFinales >= SEM_MIN; },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Tasa de reemplazo en su tope (80%)',
          descripcion: 'Tu fórmula RPM aplica el máximo legal del 80% gracias al bono por semanas adicionales. Cotizar más allá de 1.800 semanas no incrementa la tasa.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 10', resumen: 'Tope 80% en la tasa de reemplazo RPM.' }
          ]
        };
      }
    },

    // ── 5. Pilar 1 topado en Reforma ──────────────────────────────
    {
      id: 'pilar1-topado-reforma',
      cond: function(d){ return d.regime === 'reforma' && (d.ibl/SMLMV) > PILAR1_LIM_SMLMV; },
      hallazgo: function(d){
        var exc = d.ibl - SMLMV*PILAR1_LIM_SMLMV;
        return {
          severidad: 'riesgo',
          titulo: 'Excedente sobre 2,3 SMLMV va al pilar complementario (RAIS)',
          descripcion: 'Tu IBL de '+fCOP(d.ibl)+' supera el techo del pilar contributivo Colpensiones (2,3 SMLMV = '+fCOP(SMLMV*PILAR1_LIM_SMLMV)+'). El excedente de '+fCOP(exc)+' va a tu cuenta individual en una AFP, y la mesada de esa porción depende del saldo capitalizado y del retorno del fondo, no de fórmula RPM.',
          accion: 'Esto convierte tu pensión en mixta. La rentabilidad real del portafolio (típicamente moderado o alto riesgo en pensión) determina la mesada del Pilar 2. Revisa tu multifondo y considera moderado/alto riesgo si te faltan ≥10 años.',
          normas: [
            { ley: 'Ley 2381/2024', articulo: 'art. 24 num. 2', resumen: 'Pilar contributivo complementario (RAIS) para ingresos sobre 2,3 SMLMV.' },
            { ley: 'Decreto 1107/2025', articulo: 'arts. 6-9', resumen: 'Reglamenta la transferencia automática del excedente al pilar complementario.' }
          ]
        };
      }
    },

    // ── 6. Decisiones RPM vs RAIS ────────────────────────────────
    {
      id: 'traslado-rais-conviene',
      cond: function(d){
        var anosFaltan = d.edadMeta - d.edad;
        return anosFaltan >= 10 && (d.salario/SMLMV) > 4 && d.regime === 'ley797';
      },
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'Evalúa traslado a RAIS (fondo privado)',
          descripcion: 'Con IBC de '+fSMLMV(d.salario)+' y '+(d.edadMeta-d.edad)+' años por cotizar, el RAIS suele dar mesada más alta porque la fórmula RPM Ley 797 castiga IBL altos (tasa cercana al 55% mínimo). En RAIS la mesada depende del saldo capitalizado, no de la fórmula.',
          accion: 'Solicita la doble asesoría obligatoria (Colpensiones + AFP) antes de decidir. El traslado es irrevocable salvo causales del Decreto 3995/2008. Asegúrate de hacerlo con ≥10 años para la edad de pensión, no después.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 13 lit. e', resumen: 'Libertad de escogencia: último traslado entre regímenes solo si faltan ≥10 años para la edad de pensión.' },
            { ley: 'Ley 1748/2014', articulo: 'art. 2', resumen: 'Doble asesoría obligatoria del afiliado por las dos administradoras antes del traslado.' },
            { ley: 'Decreto 3995/2008', articulo: 'art. 3', resumen: 'Causales excepcionales de reversión del traslado.' }
          ]
        };
      }
    },

    {
      id: 'traslado-rpm-conviene',
      cond: function(d){
        var anosFaltan = d.edadMeta - d.edad;
        return anosFaltan >= 10 && (d.salario/SMLMV) <= 1.5 && d.fondoActual && d.fondoActual !== 'colpensiones';
      },
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'Evalúa traslado a Colpensiones (RPM)',
          descripcion: 'Con IBC cercano a 1 SMLMV, la fórmula RPM Ley 797 te garantiza tasa máxima cercana al 80%. En RAIS, con saldo bajo, podrías terminar dependiendo del Fondo de Garantía de Pensión Mínima (1.150 semanas en RAIS).',
          accion: 'Pide doble asesoría. RPM da pensión mínima garantizada (1 SMLMV) si cumples las 1.300 semanas, sin riesgo de mercado.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 13 lit. e', resumen: 'Traslado solo si faltan ≥10 años.' },
            { ley: 'Ley 100/1993', articulo: 'art. 65', resumen: 'Garantía de pensión mínima en RAIS: requiere 1.150 semanas y no haber superado 25 SMLMV de capital.' }
          ]
        };
      }
    },

    // ── 7. Aportes voluntarios ────────────────────────────────────
    {
      id: 'aporte-voluntario-pension',
      cond: function(d){ return true; }, // siempre aplicable
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'Aporte voluntario a pensión obligatoria (AVPO)',
          descripcion: 'Puedes aportar voluntariamente sobre el 16% obligatorio. En RAIS suma directo a tu cuenta individual; en RPM no incrementa la mesada futura (RPM tiene fórmula fija) pero sí aplica beneficio tributario.',
          accion: 'Aplicable sobre todo si estás en RAIS y tienes capacidad de ahorro. Beneficio tributario: el aporte se descuenta de la base de retención y de renta, dentro del límite agregado de rentas exentas y deducciones.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 64', resumen: 'Aportes voluntarios al pilar obligatorio en RAIS aumentan la cuenta individual.' },
            { ley: 'ET', articulo: 'art. 126-1', resumen: 'Aportes voluntarios y a fondos de pensiones voluntarias: descontables como renta exenta hasta el menor entre 30% del ingreso laboral o 3.800 UVT/año.' }
          ]
        };
      }
    },

    {
      id: 'cuenta-afc',
      cond: function(d){ return d.salario > SMLMV*2; },
      hallazgo: function(d){
        var topeUVT = 3800 * UVT_2026;
        return {
          severidad: 'sugerencia',
          titulo: 'Cuenta AFC para ahorro pensional con beneficio tributario',
          descripcion: 'Las cuentas AFC (Ahorro para el Fomento de la Construcción) permiten descontar de la base de renta hasta el 30% del ingreso laboral, máximo '+fCOP(topeUVT)+' al año (3.800 UVT 2026). Sirven para vivienda o pensión.',
          accion: 'Abre AFC en cualquier banco. Mantenlas mínimo 10 años o úsalas para vivienda; retiro anticipado pierde el beneficio tributario y reintegra la retención.',
          normas: [
            { ley: 'ET', articulo: 'art. 126-4', resumen: 'AFC: depósitos descontables hasta 30% del ingreso, máx. 3.800 UVT, mantenimiento 10 años o aplicación a vivienda.' },
            { ley: 'DUR 1.625/2016', articulo: 'art. 1.2.1.18.39', resumen: 'Reglamenta los retiros y pérdida de beneficio.' }
          ]
        };
      }
    },

    // ── 8. Fidelidad / bono semanas ──────────────────────────────
    {
      id: 'cotizar-mas-bono-semanas',
      cond: function(d){
        // Aplica en ambos regímenes: en Ley 797 sobre el IBL completo, en Reforma 2381 sobre el Pilar 1
        return d.semanasFinales >= SEM_MIN && d.semanasFinales < SEM_MAX && d.tasa < 0.795;
      },
      hallazgo: function(d){
        var bloquesRestantes = Math.floor((SEM_MAX - d.semanasFinales)/50);
        var ganMax = bloquesRestantes * 1.5;
        return {
          severidad: 'sugerencia',
          titulo: 'Cotizar más allá de 1.300 semanas sube tu tasa hasta '+ganMax.toFixed(1)+' puntos',
          descripcion: 'Cada 50 semanas adicionales sobre 1.300 suman 1,5% a la tasa de reemplazo, hasta el tope de 1.800 semanas (80%). A tu proyección actual de '+Math.round(d.semanasFinales)+' semanas te quedan '+bloquesRestantes+' bloques aprovechables.',
          accion: 'Si tu salud y empleabilidad lo permiten, extender la vida laboral ≈ '+(((SEM_MAX-d.semanasFinales)/52).toFixed(1))+' años te lleva al tope de 80%.',
          normas: [
            { ley: 'Ley 797/2003', articulo: 'art. 10', resumen: 'Bono de 1,5% por cada 50 semanas sobre 1.300, hasta 1.800 (tope 80%).' }
          ]
        };
      }
    },

    // ── 9. BEPS / indemnización sustitutiva ──────────────────────
    {
      id: 'beps-aplicable',
      cond: function(d){ return d.semanasFinales < SEM_MIN && (d.salario/SMLMV) <= 1; },
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'BEPS — Beneficios Económicos Periódicos',
          descripcion: 'Si tu IBC promedio es inferior a 1 SMLMV y no alcanzas las 1.300 semanas, BEPS te ofrece un anualidad vitalicia inferior al SMLMV pero estable, con subsidio del 20% del Estado sobre lo ahorrado.',
          accion: 'Vinculación voluntaria a través de Colpensiones (es la administradora de BEPS). Los aportes pueden ser desde $5.000.',
          normas: [
            { ley: 'Ley 1328/2009', articulo: 'art. 87', resumen: 'Crea BEPS como mecanismo de protección a la vejez para personas de ingresos inferiores al SMLMV.' },
            { ley: 'Decreto 295/2017', articulo: 'arts. 1-4', resumen: 'Reglamenta BEPS: requisitos, subsidio del 20%, conversión a anualidad vitalicia.' }
          ]
        };
      }
    },

    {
      id: 'indemnizacion-sustitutiva',
      cond: function(d){ return d.semanasFinales < SEM_MIN; },
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'Indemnización sustitutiva si no alcanzas la pensión',
          descripcion: 'Si llegas a la edad mínima ('+(d.sexo==='H'?EDAD_H:EDAD_M)+' años) sin las 1.300 semanas y manifiestas no seguir cotizando, Colpensiones te devuelve los aportes con rendimientos. Es un pago único, no pensión vitalicia.',
          accion: 'Solicítala en Colpensiones cuando cumplas la edad. Es incompatible con BEPS y con seguir cotizando para alcanzar pensión: tienes que decidir uno.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 37', resumen: 'Indemnización sustitutiva en RPM: devolución de aportes con rendimientos al cumplir edad sin semanas suficientes.' },
            { ley: 'Decreto 1730/2001', articulo: 'art. 3', resumen: 'Procedimiento y monto.' }
          ]
        };
      }
    },

    // ── 10. Pensión familiar ─────────────────────────────────────
    {
      id: 'pension-familiar-opcion',
      cond: function(d){ return d.semanasFinales < SEM_MIN; },
      hallazgo: function(d){
        return {
          severidad: 'sugerencia',
          titulo: 'Pensión familiar — sumar semanas con tu cónyuge',
          descripcion: 'Si tú y tu cónyuge/compañero(a) permanente individualmente no alcanzan las 1.300 semanas, pueden sumarlas en una pensión familiar de un solo SMLMV. Aplica solo en RPM y solo para personas en SISBEN niveles 1, 2 o 3.',
          accion: 'Reúne soportes de unión marital de hecho de mínimo 5 años o matrimonio. Solicita en Colpensiones.',
          normas: [
            { ley: 'Ley 1580/2012', articulo: 'arts. 1-2', resumen: 'Crea la pensión familiar para uniones acreditadas en SISBEN 1-3, con suma de semanas y mesada de 1 SMLMV.' },
            { ley: 'Decreto 288/2014', articulo: 'art. 1', resumen: 'Reglamenta requisitos y procedimiento.' }
          ]
        };
      }
    },

    // ── 11. Mesada mínima/máxima ─────────────────────────────────
    {
      id: 'mesada-en-minimo-legal',
      cond: function(d){
        return d.semanasFinales >= SEM_MIN && Math.abs(d.mesada - SMLMV) < 5000;
      },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Mesada en el piso legal de 1 SMLMV',
          descripcion: 'La fórmula arroja una mesada inferior al SMLMV; se aplica el piso constitucional. Esto suele pasar con IBL muy bajos cerca del SMLMV.',
          normas: [
            { ley: 'Constitución', articulo: 'art. 48', resumen: 'Ningún pensionado recibirá mesada inferior al SMLMV.' },
            { ley: 'Ley 100/1993', articulo: 'art. 35', resumen: 'Mesada mínima 1 SMLMV; mesada máxima 25 SMLMV.' }
          ]
        };
      }
    },

    {
      id: 'mesada-en-maximo-legal',
      cond: function(d){ return d.mesada >= SMLMV*25 - 1000; },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Mesada topada en 25 SMLMV',
          descripcion: 'La mesada se aplica con el tope legal máximo de 25 SMLMV ('+fCOP(SMLMV*25)+'). Aportes que excedan este IBL no aumentan la pensión, pero sí pueden destinarse a pensión voluntaria con beneficio tributario.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 35', resumen: 'Tope mesada 25 SMLMV.' }
          ]
        };
      }
    },

    // ── 12. Estabilidad laboral pre-pensionado ────────────────────
    {
      id: 'pre-pensionado-estabilidad',
      cond: function(d){ return (d.edadMeta - d.edad) <= 3 && d.semanasActuales >= (SEM_MIN - 156); },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Estabilidad laboral reforzada por estatus de pre-pensionado',
          descripcion: 'Estás a 3 años o menos de cumplir tu edad de pensión y cerca de las 1.300 semanas. La jurisprudencia constitucional reconoce el fuero de pre-pensionado: tu empleador no puede despedirte sin justa causa o sin autorización del Inspector del Trabajo, salvo despido reforzado calificado.',
          accion: 'Si te despiden, tutelas por reintegro y pago de salarios procediente. Si renuncias por presión, pierdes la protección.',
          normas: [
            { ley: 'Ley 790/2002', articulo: 'art. 12', resumen: 'Retén social: protección de pre-pensionados en procesos de reestructuración del Estado, ampliada por jurisprudencia al sector privado.' },
            { ley: 'Sentencia T-638/2016', articulo: '—', resumen: 'Corte Constitucional: el fuero de pre-pensionado aplica también al sector privado cuando faltan ≤3 años.' }
          ]
        };
      }
    },

    // ── 13. Solicitud — recordatorio ─────────────────────────────
    {
      id: 'solicitud-no-automatica',
      cond: function(d){ return d.semanasFinales >= SEM_MIN; },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'La pensión no es automática — debe solicitarse',
          descripcion: 'Cumplir requisitos no inicia la pensión. Debes radicar la solicitud en Colpensiones (RPM) o tu AFP (RAIS) cuando cumplas edad y semanas. Antes de eso, la pensión queda "causada pero no reconocida" y no se paga retroactivo.',
          accion: 'Radica la solicitud apenas cumplas, idealmente con 3-6 meses de anticipación para evitar interrupciones en ingresos.',
          normas: [
            { ley: 'Ley 100/1993', articulo: 'art. 33 par. 4', resumen: 'La pensión se paga desde la fecha de causación pero requiere solicitud expresa.' }
          ]
        };
      }
    },

    // ── 14. Régimen Reforma — info general ──────────────────────
    {
      id: 'regimen-reforma-aplicable',
      cond: function(d){
        var u = d.sexo==='H' ? TRANS_H : TRANS_M;
        return d.semanasActuales < u && d.regime === 'reforma';
      },
      hallazgo: function(d){
        return {
          severidad: 'info',
          titulo: 'Te aplica la Reforma Pensional Ley 2381/2024',
          descripcion: 'Como no alcanzaste el régimen de transición, tu pensión se calcula bajo el sistema de pilares: pilar contributivo Colpensiones hasta 2,3 SMLMV + pilar complementario RAIS sobre el excedente.',
          accion: 'La reglamentación sigue evolucionando. Mantente informado sobre actualizaciones del Decreto 1107/2025 y normas de desarrollo.',
          normas: [
            { ley: 'Ley 2381/2024', articulo: 'arts. 22-25', resumen: 'Pilares del Sistema Integral de Protección a la Vejez: solidario, semicontributivo, contributivo, voluntario.' },
            { ley: 'Decreto 1107/2025', articulo: '—', resumen: 'Reglamenta la implementación inicial de la Reforma Pensional.' }
          ]
        };
      }
    }
  ];

  // ──────────────────────────────────────────────────────────────────
  //  API pública
  // ──────────────────────────────────────────────────────────────────
  function evaluar(d){
    var hallazgos = [];
    for(var i=0; i<REGLAS.length; i++){
      var r = REGLAS[i];
      try {
        if(r.cond(d)){
          var h = r.hallazgo(d);
          h.id = r.id;
          hallazgos.push(h);
        }
      } catch(e){ /* regla rota: skip silencioso */ }
    }
    var ord = { alerta:0, riesgo:1, sugerencia:2, info:3 };
    hallazgos.sort(function(a,b){
      var oa = ord[a.severidad]; if(oa === undefined) oa = 9;
      var ob = ord[b.severidad]; if(ob === undefined) ob = 9;
      return oa - ob;
    });
    return hallazgos;
  }

  return {
    evaluar: evaluar,
    _reglas: REGLAS,
    _const: { SMLMV: SMLMV, UVT_2026: UVT_2026, EDAD_H: EDAD_H, EDAD_M: EDAD_M, SEM_MIN: SEM_MIN, SEM_MAX: SEM_MAX, TRANS_H: TRANS_H, TRANS_M: TRANS_M, PILAR1_LIM_SMLMV: PILAR1_LIM_SMLMV }
  };
}));
