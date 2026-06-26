/* ═══ Aziendale — Normograma Tributario: base de normas ═══
   Generado por scripts/normograma-import.js con verificación multiagente contra fuentes oficiales.
   NO editar a mano: regenerar con node scripts/normograma-import.js <json> "<corte>" */
window.NORMOGRAMA = {
 "corte": "10 de junio de 2026",
 "normas": [
  {
   "id": "decreto_0240_2026",
   "tipo": "decreto",
   "numero": "0240",
   "anio": 2026,
   "titulo": "Decreto Legislativo 0240 de 2026: alivios de sanciones e intereses y conciliación por la emergencia",
   "resumen": "Expedido el 12 de marzo de 2026 bajo la emergencia económica del Decreto 150 de 2026. En procedimiento: pago de obligaciones en mora a 31-dic-2025 con interés reducido del 4,5% anual y solo el 15% de la sanción (plazo 30-abr-2026), y conciliación contencioso-administrativa con petición ante la DIAN hasta el 30-jun-2026, pagando el 15% o el 20% de sanciones e intereses según la instancia del proceso.",
   "aplica": "Morosos y litigantes con demandas presentadas antes del 31-dic-2025; a 10-jun-2026 el plazo de pago con reducción ya venció (30-abr-2026) y la solicitud de conciliación solo está abierta hasta el 30-jun-2026.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva",
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "alivios",
    "conciliacion",
    "sanciones",
    "emergencia",
    "intereses"
   ],
   "estado": "vigente",
   "nota_vigencia": "Decreto legislativo de estado de emergencia: sujeto a control automático de constitucionalidad ante la Corte (a 10-jun-2026 sin fallo definitivo conocido); verificar el fallo antes de aplicar beneficios pendientes.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0240_2026.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=273176"
  },
  {
   "id": "resolucion_dian_000012_2026",
   "tipo": "resolucion",
   "numero": "000012",
   "anio": 2026,
   "titulo": "Resolución DIAN 000012 de 2026 — Prórroga para grandes contribuyentes y ajustes de formatos (AG2025)",
   "resumen": "Expedida el 29 de abril de 2026 en plena temporada de exógena: prorrogó el plazo de los grandes contribuyentes con NIT terminado en 1, 2 y 3 (al 14, 15 y 19 de mayo de 2026), flexibilizó la casilla de fecha de pago en varios formatos y agregó campos sobre enajenación de acciones no listadas, exigibles solo desde el AG2027.",
   "aplica": "Reportantes de exógena del AG2025; la prórroga cubrió únicamente a grandes contribuyentes con NIT terminado en 1, 2 o 3.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "gran-contribuyente",
    "persona-juridica",
    "persona-natural",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "prórrogas",
    "plazos",
    "formatos",
    "grandes contribuyentes",
    "exogena",
    "prorroga"
   ],
   "estado": "vigente",
   "nota_vigencia": "Los nuevos campos sobre enajenación de acciones o aportes solo serán exigibles desde el año gravable 2027.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0012_2026.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_0175_2025",
   "tipo": "decreto",
   "numero": "0175",
   "anio": 2025,
   "titulo": "Decreto Legislativo 0175 de 2025 — IVA del 19% a juegos de suerte y azar online (conmoción interior Catatumbo)",
   "resumen": "Decreto legislativo de la conmoción interior del Catatumbo: gravó con IVA del 19% los juegos de suerte y azar operados por internet, incluidos los prestados desde el exterior a usuarios en Colombia, además de subir el timbre al 1% y gravar petróleo y carbón. Sus medidas tributarias rigieron hasta el 31 de diciembre de 2025.",
   "aplica": "Operadores de apuestas online y sus usuarios durante 2025; clave para cierres contables de ese año y para las devoluciones del exceso recaudado que ordenó la Corte.",
   "impuestos": [
    "iva",
    "timbre"
   ],
   "perfiles": [
    "persona-juridica",
    "no-residente",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [
    "tecnologia",
    "mineria-energia"
   ],
   "temas": [
    "juegos de azar online",
    "conmoción interior",
    "vigencia temporal",
    "conmocion interior",
    "tarifas",
    "contratos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Exequible de forma condicionada por la Sentencia C-431 de 2025 (salvo el parágrafo 5 del art. 1); sus medidas perdieron vigencia el 31 de diciembre de 2025.",
   "importancia": "clave",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30054519"
  },
  {
   "id": "decreto_0572_2025",
   "tipo": "decreto",
   "numero": "0572",
   "anio": 2025,
   "titulo": "Decreto 0572 de 2025 — Rebaja de bases mínimas y alza de autorretenciones (suspensión provisional revocada)",
   "resumen": "Desde junio de 2025 redujo las bases mínimas de retención (compras: de 27 a 10 UVT; servicios: de 4 a 2 UVT) y elevó tarifas de autorretención por actividad económica para acelerar recaudo. El Consejo de Estado suspendió provisionalmente sus arts. 2 a 8 en mayo de 2026 y regresaron transitoriamente las bases anteriores, pero en junio de 2026 revocó esa suspensión: el decreto recupera vigencia plena y sus bases…",
   "aplica": "Agentes de retención y autorretenedores: durante junio de 2026 siguen operando las bases previas (27 UVT compras, 4 UVT servicios); desde julio de 2026 vuelven a regir las bases reducidas y las tarifas de autorretención del decreto.",
   "impuestos": [
    "retefuente",
    "autorretencion",
    "renta-pj",
    "renta-pn",
    "rst",
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "independiente",
    "regimen-simple",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "bases minimas",
    "10 uvt",
    "2 uvt",
    "suspension provisional",
    "recaudo anticipado",
    "retencion en la fuente"
   ],
   "estado": "modificada",
   "nota_vigencia": "Los arts. 2 a 8 fueron suspendidos provisionalmente por el Consejo de Estado (auto del 7 de mayo de 2026; DIAN Comunicado 070 del 8 de mayo de 2026) y mientras duró la medida aplicaron las bases y tarifas anteriores del Decreto 1625 de 2016. A comienzos de junio de 2026 el Consejo de Estado revocó e",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0572_2025.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=260016"
  },
  {
   "id": "resolucion_dian_000227_2025",
   "tipo": "resolucion",
   "numero": "000227",
   "anio": 2025,
   "titulo": "Resolución DIAN 000227 de 2025 — Resolución Única en materia tributaria, aduanera y cambiaria",
   "resumen": "Resolución Única que compila en un solo cuerpo la normatividad dispersa en resoluciones DIAN anteriores. A la fecha está expedida su Parte 1 (asuntos tributarios), que incluye las reglas del reporte de conciliación fiscal (formato 2516); las partes aduanera y cambiaria se incorporan por etapas. Las resoluciones nuevas la modifican a ella.",
   "aplica": "Punto de entrada para ubicar la regla DIAN vigente sobre obligaciones formales asociadas a la renta PJ, como el reporte de conciliación fiscal.",
   "impuestos": [
    "renta-pj",
    "procedimiento",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente",
    "persona-natural",
    "esal",
    "empleador",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "compilacion",
    "conciliacion fiscal",
    "obligaciones formales",
    "compilación",
    "obligados",
    "formatos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por la Resolución 000246 de 2025 en los obligados al formato 2516.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Paginas/Resolucion-000227-del-23092025.aspx"
  },
  {
   "id": "resolucion_dian_000238_2025",
   "tipo": "resolucion",
   "numero": "000238",
   "anio": 2025,
   "titulo": "Resolución DIAN 000238 de 2025 — Fija la UVT de 2026 en $52.374",
   "resumen": "Fijó la UVT de 2026 en $52.374, con la variación del IPC de ingresos medios de 5,17% certificada por el DANE (octubre 2024 a octubre 2025). Técnicamente modifica el art. 1.2.1 de la Resolución Única 000227 de 2025. Con esta cifra se calculan en 2026 la sanción mínima, los topes y las bases de retención expresadas en UVT.",
   "aplica": "Toda cifra tributaria de 2026 expresada en UVT: sanciones, bases mínimas de retención, topes de facturación y de obligación de declarar.",
   "impuestos": [
    "retefuente",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "empleador",
    "independiente",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "uvt",
    "bases minimas",
    "2026",
    "parametros",
    "sancion-minima"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0238_2025.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000238%20de%2015-12-2025.Pdf"
  },
  {
   "id": "sentencia_c072_2025",
   "tipo": "sentencia",
   "numero": "C-072",
   "anio": 2025,
   "titulo": "Sentencia C-072 de 2025 — Facultades extraordinarias aduaneras de la Ley 2277",
   "resumen": "Declaró inexequibles, con efectos diferidos al 20 de junio de 2026, el Art. 68 de la Ley 2277 de 2022 (facultades extraordinarias al Presidente para expedir el régimen sancionatorio aduanero) y el Decreto Ley 920 de 2023 dictado con ellas: un régimen de ese alcance es materia de código y solo puede expedirlo el Congreso.",
   "aplica": "Importadores, exportadores y agencias de aduana: el régimen sancionatorio del Decreto Ley 920 de 2023 rige solo mientras el Congreso legisla o vence el plazo diferido.",
   "impuestos": [
    "aduanero",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "aduanero",
    "sanciones",
    "facultades-extraordinarias",
    "efectos-diferidos",
    "facultades extraordinarias",
    "reserva de ley"
   ],
   "estado": "vigente",
   "nota_vigencia": "A junio de 2026 el plazo diferido está por vencer: si el Congreso no expide el nuevo régimen, el Decreto Ley 920 de 2023 pierde vigencia el 20 de junio de 2026.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-072_2025.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30054649"
  },
  {
   "id": "concepto_dian_006038_2024",
   "tipo": "concepto",
   "numero": "006038",
   "anio": 2024,
   "titulo": "Concepto DIAN 006038 de 2024 — Adición sobre tasa mínima de tributación",
   "resumen": "Guía operativa de la DIAN para la tasa mínima del parágrafo 6 del art. 240 ET: cómo calcular el impuesto depurado (ID), la utilidad depurada (UD) y el impuesto a adicionar (IA) para que la tasa efectiva de las personas jurídicas no quede por debajo del 15%, sin ampliar la base gravable del impuesto.",
   "aplica": "Cierre fiscal y declaración de renta de sociedades: todo cálculo de TTD e impuesto a adicionar pasa por este concepto.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tasa minima",
    "anticipo",
    "doctrina",
    "ttd",
    "impuesto a adicionar",
    "tarifas"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_6038_2024.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_659_2024",
   "tipo": "decreto",
   "numero": "659",
   "anio": 2024,
   "titulo": "Decreto 659 de 2024 - Reforma al régimen aduanero (declaración anticipada y controles)",
   "resumen": "Reforma amplia al Decreto 1165 de 2019: vuelve obligatoria la declaración anticipada de importación (presentada y aceptada con una antelación mínima de 48 horas a la llegada de la mercancía), refuerza la trazabilidad de la carga y la lucha contra el contrabando, y ajusta las obligaciones de ingreso a zonas francas.",
   "aplica": "Importadores y exportadores, zonas francas, transportadores y agencias de aduanas que deben ajustar sus procesos a la declaración anticipada y a los nuevos controles.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "declaracion anticipada",
    "contrabando",
    "trazabilidad",
    "zonas francas"
   ],
   "estado": "vigente",
   "nota_vigencia": "Expedido el 22 de mayo de 2024 (Diario Oficial 52.764); entró a regir 15 días comunes después de su publicación, y las disposiciones sobre declaración anticipada obligatoria rigen cuando entren en funcionamiento los servicios informáticos electrónicos que las soportan.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0659_2024.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30051667"
  },
  {
   "id": "resolucion_dian_000180_2024",
   "tipo": "resolucion",
   "numero": "000180",
   "anio": 2024,
   "titulo": "Resolución DIAN 000180 de 2024 - Información cambiaria vigente ante la DIAN",
   "resumen": "Norma base vigente de la información cambiaria ante la DIAN: obliga a IMC, titulares de cuentas de compensación y concesionarios de correos a reportar sus operaciones de cambio con numerales cambiarios, datos de documentos aduaneros y plazos de legalización (formatos 1059 a 1067). Derogó la Resolución 4083 de 1999.",
   "aplica": "Si maneja cuenta de compensación o es IMC, esta resolución define qué reporta a la DIAN; su incumplimiento se sanciona con el Decreto-Ley 2245 de 2011.",
   "impuestos": [
    "cambiario",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "informacion exogena cambiaria",
    "cuentas de compensacion",
    "numerales cambiarios",
    "formatos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada y adicionada por la Resolución DIAN 000204 de 2025, que le incorporó la Parte 2 con las especificaciones técnicas de los formatos, y modificada por la Resolución DIAN 000230 de 2025, que prorrogó los plazos de entrega de la información: los períodos hasta el primer trimestre de 2026 venci",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0180_2024.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2229_2023",
   "tipo": "decreto",
   "numero": "2229",
   "anio": 2023,
   "titulo": "Decreto 2229 de 2023 — Calendario permanente de plazos tributarios",
   "resumen": "El decreto de plazos que rige 2025 y 2026: desde 2024 fijó el calendario en días hábiles en lugar de fechas exactas, por eso no se expidió decreto nuevo a fines de 2025. Renta de grandes contribuyentes en 3 cuotas (feb/abr/jun), personas jurídicas en 2 cuotas (may/jul), renta de naturales de agosto a octubre según los dos últimos dígitos del NIT.",
   "aplica": "Todos los contribuyentes: de aquí salen los vencimientos 2026 de renta AG2025, IVA, retención, patrimonio, activos en el exterior y SIMPLE.",
   "impuestos": [
    "renta-pj",
    "procedimiento",
    "renta-pn",
    "iva",
    "retefuente",
    "inc",
    "patrimonio",
    "rst"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente",
    "persona-natural",
    "independiente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "plazos",
    "calendario tributario",
    "cuotas",
    "vencimientos",
    "calendario",
    "dias-habiles"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2229_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=227310"
  },
  {
   "id": "decreto_920_2023",
   "tipo": "decreto",
   "numero": "920",
   "anio": 2023,
   "titulo": "Decreto Ley 920 de 2023 - Régimen sancionatorio y de decomiso aduanero",
   "resumen": "Decreto ley que contiene el régimen sancionatorio y de decomiso en materia aduanera: catálogo de infracciones por tipo de usuario, sanciones de multa, suspensión y cancelación, causales de aprehensión y el procedimiento administrativo aplicable. Fue expedido con las facultades del artículo 68 de la Ley 2277 de 2022.",
   "aplica": "Todo usuario aduanero expuesto a multas, aprehensión o decomiso de mercancías: importadores, exportadores, agencias de aduanas, transportadores y depósitos.",
   "impuestos": [
    "aduanero",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "decomiso",
    "aprehension",
    "procedimiento"
   ],
   "estado": "vigente",
   "nota_vigencia": "Declarado inexequible por consecuencia en la Sentencia C-072 de 2025, con efectos diferidos: rige hasta el 20 de junio de 2026. El Congreso aprobó a comienzos de junio de 2026 el proyecto de la nueva ley sancionatoria aduanera que lo reemplazará (PL 312/331 de 2025), pendiente de sanción presidencia",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0920_2023.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000022_2023",
   "tipo": "resolucion",
   "numero": "000022",
   "anio": 2023,
   "titulo": "Resolución DIAN 000022 de 2023 — Prescribe el formulario 110",
   "resumen": "Prescribe el formulario 110 de declaración de renta y complementario para personas jurídicas y asimiladas (y personas naturales no residentes), aplicable desde el año gravable 2022 y fracción 2023 en adelante. Incorporó las casillas derivadas de la Ley 2277, incluida la tasa mínima de tributación.",
   "aplica": "Toda PJ declarante de renta: es el formato oficial del F110 que se diligencia en el MUISCA y sigue aplicando para el año gravable 2025.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "formulario 110",
    "casillas",
    "declaracion"
   ],
   "estado": "vigente",
   "nota_vigencia": "El formulario no ha sido sustituido para el año gravable 2025.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0022_2023.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000162_2023",
   "tipo": "resolucion",
   "numero": "000162",
   "anio": 2023,
   "titulo": "Resolución DIAN 000162 de 2023 — Marco de exógena del año gravable 2024 y siguientes",
   "resumen": "Marco de la exógena desde el año gravable 2024: define obligados (retenedores, personas y entidades según topes de ingresos, mandatarios, consorcios, convenios de cooperación internacional), el contenido y especificaciones de los formatos 1001, 1003, 1005, 1006, 1007, 1008, 1009 y 2276, entre otros, y los plazos anuales.",
   "aplica": "Quien deba reportar exógena nacional del año gravable 2024 en adelante; sus reglas continúan vigentes, ya compiladas, para AG2025 y AG2026.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal",
    "empleador",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "obligados",
    "formatos",
    "plazos",
    "convenios de cooperación",
    "exogena"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por la Resolución 000188 de 2024 y compilada en el Título 3 de la Resolución Única 000227 de 2025.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0162_2023.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000165_2023",
   "tipo": "resolucion",
   "numero": "000165",
   "anio": 2023,
   "titulo": "Resolución DIAN 000165 de 2023 - Marco vigente del sistema de facturación electrónica",
   "resumen": "Marco operativo vigente de la facturación: reglas de expedición de la factura electrónica, anexo técnico 1.9, documento equivalente electrónico (incluido el tiquete POS), proveedores tecnológicos y calendarios de implementación por tipo de documento. Reemplazó a la Resolución 000042 de 2020 como norma central del sistema.",
   "aplica": "Todos los obligados a facturar: define cómo se expide, valida y transmite cada documento del sistema de facturación.",
   "impuestos": [
    "facturacion-electronica",
    "iva",
    "inc",
    "rst"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "anexo tecnico",
    "pos",
    "documento equivalente electronico",
    "5 uvt",
    "proveedores tecnologicos",
    "factura electronica"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por las Resoluciones 000008, 000119 y 000189 de 2024 y 000202 de 2025; derogó la Resolución 000042 de 2020. La Resolución Única DIAN 000227 de 2025 la recompiló como Título 5 de la compilación normativa de la DIAN, manteniendo su contenido vigente.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0165_2023.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000165%20de%2001-11-2023.pdf"
  },
  {
   "id": "sentencia_c_489_2023",
   "tipo": "sentencia",
   "numero": "C-489",
   "anio": 2023,
   "titulo": "Sentencia C-489 de 2023 — Deducibilidad de regalías restablecida",
   "resumen": "Tumbó la prohibición de deducir regalías en renta para el sector extractivo (parágrafo 1 del art. 19 de la Ley 2277). La Corte la consideró confiscatoria, por gravar utilidades inexistentes, y discriminatoria entre quienes pagan regalías en dinero y en especie. Las regalías volvieron a ser deducibles como costo de la actividad.",
   "aplica": "Empresas de petróleo, gas y minería: las regalías son deducibles en sus declaraciones de renta; argumento clave en litigios del sector.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "regalias",
    "deducciones",
    "inexequibilidad",
    "capacidad contributiva"
   ],
   "estado": "vigente",
   "nota_vigencia": "La Corte negó en 2024 el incidente de impacto fiscal que pedía el Ministerio de Hacienda; la sentencia conserva plenos efectos.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-489_2023.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30050350"
  },
  {
   "id": "sentencia_c_540_2023",
   "tipo": "sentencia",
   "numero": "C-540",
   "anio": 2023,
   "titulo": "Sentencia C-540 de 2023: caída de las tarifas del SIMPLE para profesiones liberales",
   "resumen": "Por violar la equidad tributaria, la Corte tumbó el tope de 12.000 UVT para servicios profesionales (inciso 2, num. 2, art. 905 ET) y los numerales 4 y 5 del art. 908 ET junto con los numerales 4 y 5 de su parágrafo 4, que daban trato más gravoso a consultoría y profesiones liberales frente a educación y salud. Revivió las tarifas de la Ley 2155 de 2021.",
   "aplica": "Profesionales, consultores y empresas de educación y salud en el SIMPLE: desde diciembre de 2023 vuelven al tope de 100.000 UVT y a las tarifas del numeral 3 del art. 908 (versión Ley 2155).",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [
    "servicios",
    "salud",
    "educacion"
   ],
   "temas": [
    "inexequibilidad",
    "tarifas",
    "equidad tributaria",
    "profesiones liberales",
    "simple",
    "equidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "La DIAN precisó sus efectos operativos en los Conceptos 24 [000978] y 823 [006999] de 2024: aplica hacia futuro, sin recálculo de anticipos anteriores.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-540_2023.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30050542"
  },
  {
   "id": "sentencia_c384_2023",
   "tipo": "sentencia",
   "numero": "C-384",
   "anio": 2023,
   "titulo": "Sentencia C-384 de 2023 — Zonas francas: protección de usuarios calificados antes de la Ley 2277",
   "resumen": "La Corte Constitucional declaró exequible de forma condicionada el nuevo régimen de renta de zonas francas (art. 11, Ley 2277 de 2022): por buena fe y confianza legítima, quienes cumplían las condiciones de usuario industrial antes del 13 de diciembre de 2022 siguen con la tarifa única del 20% del régimen de la Ley 1819 de 2016.",
   "aplica": "Usuarios industriales de zona franca calificados antes del 13 de diciembre de 2022: no están obligados al esquema mixto 20%/35% ni al plan de internacionalización.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "confianza legitima",
    "tarifas",
    "corte constitucional"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-384_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_0106_2022",
   "tipo": "concepto",
   "numero": "0106",
   "anio": 2022,
   "titulo": "Concepto Unificado DIAN 0106 de 2022 - Obligación de facturar y sistema de factura electrónica",
   "resumen": "Doctrina oficial consolidada de la DIAN sobre todo el sistema de facturación: quién debe facturar, requisitos, documentos equivalentes, notas crédito y rechazos, venta de activos fijos, facturación de talonario como contingencia y funcionamiento de cada documento electrónico. Revocó la doctrina dispersa anterior.",
   "aplica": "Contadores y facturadores que necesiten la posición oficial de la DIAN frente a casos concretos de facturación; es citable en respuestas a requerimientos.",
   "impuestos": [
    "facturacion-electronica",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "obligacion de facturar",
    "notas credito",
    "contingencia",
    "facturacion",
    "documento soporte"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado y aclarado en múltiples oportunidades entre 2022 y 2025 para incorporar los cambios de la Resolución 000165 de 2023 y sus modificatorias.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0000106_2022.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Documents/Concepto-Unificado-Factura-Electronica-100202208-106-RAD-911428.pdf"
  },
  {
   "id": "ley_2277_2022",
   "tipo": "ley",
   "numero": "2277",
   "anio": 2022,
   "titulo": "Ley 2277 de 2022 — Reforma tributaria para la igualdad y la justicia social",
   "resumen": "Reforma de igualdad y justicia social. En retención: limitó la renta exenta del 25% a 790 UVT anuales y apretó la depuración de rentas de trabajo, elevó la retención sobre dividendos a personas naturales residentes (marginal del 15% sobre lo que exceda 1.090 UVT) y creó la tributación por presencia económica significativa con retención del 10%.",
   "aplica": "Empleadores y pagadores que depuran retención laboral, sociedades que decretan dividendos y quienes pagan a plataformas del exterior con PES.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "patrimonio",
    "procedimiento",
    "iva",
    "inc",
    "saludables",
    "retefuente",
    "facturacion-electronica",
    "exogena",
    "rst",
    "gmf",
    "timbre",
    "carbono"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "independiente",
    "regimen-simple",
    "empleador",
    "no-residente",
    "esal"
   ],
   "sectores": [
    "zonas-francas",
    "turismo-hoteles",
    "agro"
   ],
   "temas": [
    "reforma tributaria",
    "tasa minima",
    "sobretasa",
    "dividendos",
    "limite 40%",
    "ganancias ocasionales"
   ],
   "estado": "modificada",
   "nota_vigencia": "La Corte declaró inexequible la no deducibilidad de regalías (C-489/23) y condicionó la tarifa de zonas francas (C-384/23).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_2277_2022.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=199883"
  },
  {
   "id": "circular_dcip_83_2021",
   "tipo": "circular",
   "numero": "DCIP-83",
   "anio": 2021,
   "titulo": "Circular Reglamentaria Externa DCIP-83 Banco de la República - Procedimientos de operaciones de cambio",
   "resumen": "Manual operativo vigente del régimen cambiario (Asunto 10: procedimientos aplicables a las operaciones de cambio). Regula la declaración de cambio con datos mínimos, los numerales cambiarios, el registro y reporte mensual de las cuentas de compensación y los trámites de inversión y endeudamiento externo ante el Emisor.",
   "aplica": "Guía diaria de quien canaliza divisas: cómo suministrar la declaración de cambio, legalizar operaciones y mover una cuenta de compensación.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "declaracion de cambio",
    "numerales cambiarios",
    "cuentas de compensacion",
    "procedimientos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Reemplazó a la DCIN-83 desde el 1 de septiembre de 2021; el Banco la actualiza varias veces al año (última modificación conocida: 16 de diciembre de 2025).",
   "importancia": "clave",
   "url_dian": "",
   "url_alt": "https://www.banrep.gov.co/es/normatividad/regulacion-operaciones-cambiarias/compendios-dcin-83-dcip-83"
  },
  {
   "id": "decreto_1881_2021",
   "tipo": "decreto",
   "numero": "1881",
   "anio": 2021,
   "titulo": "Decreto 1881 de 2021 - Arancel de Aduanas",
   "resumen": "Arancel de aduanas vigente desde el 1 de enero de 2022: adopta la nomenclatura de la VII Enmienda del Sistema Armonizado (Decisión 885 de la CAN), conserva los desdoblamientos nacionales y fija los gravámenes ad valorem por subpartida. Es la base para clasificar mercancía y liquidar los tributos aduaneros.",
   "aplica": "Importadores y agencias de aduanas: toda declaración de importación exige clasificar la mercancía en una subpartida de este arancel y aplicar su gravamen.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "arancel",
    "nomenclatura",
    "clasificacion arancelaria",
    "gravamenes"
   ],
   "estado": "modificada",
   "nota_vigencia": "La nomenclatura y los gravámenes se ajustan periódicamente mediante decretos modificatorios puntuales del Gobierno.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1881_2021.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/clp/contenidos.dll/Decretos/30043713"
  },
  {
   "id": "estatuto_art_631_5",
   "tipo": "estatuto",
   "numero": "Arts. 631-5 y 631-6",
   "anio": 2021,
   "titulo": "ET Arts. 631-5 y 631-6 — Beneficiario final y Registro Único de Beneficiarios Finales (RUB)",
   "resumen": "Define al beneficiario final como la persona natural que posee el 5% o más del capital o de los beneficios de una entidad, o que ejerce control por otros medios, y crea el RUB ante la DIAN, donde sociedades, ESAL y estructuras sin personería deben identificar a esas personas y actualizar el dato cuando cambie.",
   "aplica": "Sociedades nacionales, establecimientos permanentes, ESAL, propiedades horizontales y estructuras sin personería (fiducias, fondos). No reportar, reportar con errores o no actualizar el RUB se sanciona vía art. 658-3 ET.",
   "impuestos": [
    "procedimiento",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "esal",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "beneficiario final",
    "rub",
    "registro",
    "obligaciones formales"
   ],
   "estado": "modificada",
   "nota_vigencia": "Redacción vigente dada por los artículos 16 y 17 de la Ley 2155 de 2021, que sustituyó la versión original de la Ley 1819 de 2016; reglamentados por la Resolución DIAN 000164 de 2021.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "ley_2155_2021",
   "tipo": "ley",
   "numero": "2155",
   "anio": 2021,
   "titulo": "Ley 2155 de 2021 — Ley de Inversión Social",
   "resumen": "Entre sus medidas, creó el art. 616-5 del ET: la DIAN puede determinar el impuesto de renta mediante una factura oficial basada en información exógena y facturación electrónica. Si el contribuyente no está de acuerdo, debe presentar su propia declaración dentro de los dos meses siguientes para que la factura pierda fuerza. Esa regla vive hoy en el art. 719-3 del ET.",
   "aplica": "Personas naturales omisas o no declarantes a quienes la DIAN les expida factura del impuesto sobre la renta; antecedente de la declaración sugerida.",
   "impuestos": [
    "renta-pj",
    "facturacion-electronica",
    "procedimiento",
    "renta-pn",
    "rst",
    "iva",
    "patrimonio"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente",
    "persona-natural",
    "independiente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "beneficio auditoria",
    "facturacion",
    "factura de renta",
    "omisos",
    "determinacion oficial"
   ],
   "estado": "modificada",
   "nota_vigencia": "Parcialmente ajustada por la Ley 2277 de 2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_2155_2021.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=170902"
  },
  {
   "id": "resolucion_dian_000013_2021",
   "tipo": "resolucion",
   "numero": "000013",
   "anio": 2021,
   "titulo": "Resolución DIAN 000013 de 2021 - Documento soporte de pago de nómina electrónica",
   "resumen": "Creó dentro del sistema de facturación el documento soporte de pago de nómina electrónica y su anexo técnico: documento mensual que el empleador genera y transmite a la DIAN por los pagos laborales, único soporte válido de costos y deducciones de nómina en renta y de impuestos descontables asociados.",
   "aplica": "Empleadores que sean facturadores electrónicos y quieran deducir su nómina: deben transmitir el documento dentro de los 10 primeros días del mes siguiente al pago.",
   "impuestos": [
    "facturacion-electronica",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "empleador",
    "persona-juridica",
    "persona-natural",
    "esal",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "nomina electronica",
    "anexo tecnico",
    "costos y deducciones",
    "plazos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Calendario y reglas ajustados por las Resoluciones 000037 y 000063 de 2021.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0013_2021.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1165_2019",
   "tipo": "decreto",
   "numero": "1165",
   "anio": 2019,
   "titulo": "Decreto 1165 de 2019 - Régimen de Aduanas (estatuto aduanero)",
   "resumen": "Estatuto aduanero colombiano: compila en un solo decreto los regímenes de importación, exportación y tránsito, la obligación aduanera, declarantes y agencias de aduanas, garantías, valoración y zonas con tratamiento especial. Es la norma de cabecera de cualquier operación de comercio exterior.",
   "aplica": "Cualquier persona natural o jurídica que importe, exporte o intervenga en la cadena logística: declarantes, agencias de aduanas, transportadores, depósitos y operadores de comercio exterior.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "importaciones",
    "exportaciones",
    "obligacion aduanera",
    "valoracion aduanera"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado, entre otros, por los Decretos 360 de 2021 y 659 de 2024; sus títulos de sanciones y decomiso fueron reemplazados por el Decreto Ley 920 de 2023 a raíz de la Sentencia C-441 de 2021.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1165_2019.htm",
   "url_alt": ""
  },
  {
   "id": "ley_2010_2019",
   "tipo": "ley",
   "numero": "2010",
   "anio": 2019,
   "titulo": "Ley 2010 de 2019 — Ley de crecimiento económico",
   "resumen": "De aquí sale la tabla progresiva del art. 383 ET que hoy se usa para retener sobre salarios, y la regla que permite aplicarla a honorarios de personas naturales que no vinculan dos o más trabajadores. Además suavizó la ineficacia del art. 580-1 ET y ajustó la retención sobre dividendos creada por la Ley 1943 de 2018.",
   "aplica": "Empleadores que calculan retención laboral e independientes que contratan máximo un trabajador y piden la tabla del art. 383.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "procedimiento",
    "inc",
    "retefuente",
    "facturacion-electronica",
    "rst"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "independiente",
    "no-residente",
    "regimen-simple",
    "empleador",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "renta presuntiva",
    "dividendos",
    "descuentos",
    "tarifas",
    "cedula general",
    "reforma tributaria"
   ],
   "estado": "modificada",
   "nota_vigencia": "Varias disposiciones modificadas o superadas por las leyes 2155 de 2021 y 2277 de 2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_2010_2019.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000046_2019",
   "tipo": "resolucion",
   "numero": "000046",
   "anio": 2019,
   "titulo": "Resolución DIAN 000046 de 2019 - Reglamenta el Decreto 1165 de 2019",
   "resumen": "Resolución reglamentaria del estatuto aduanero: baja a detalle operativo los trámites (formalidades de las declaraciones, plazos, requisitos de los usuarios, manejo de carga y servicios informáticos electrónicos). En la práctica se consulta en paralelo con el Decreto 1165 para cualquier trámite ante la DIAN.",
   "aplica": "Usuarios aduaneros que adelantan trámites ante la DIAN: importadores, exportadores, agencias de aduanas, depósitos y transportadores.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tramites",
    "declaraciones",
    "plazos",
    "usuarios aduaneros"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada en numerosas ocasiones por resoluciones DIAN posteriores; debe leerse junto con los cambios introducidos al estatuto por el Decreto 659 de 2024.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0046_2019.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_0481_2018",
   "tipo": "concepto",
   "numero": "0481",
   "anio": 2018,
   "titulo": "Concepto General Unificado DIAN 0481 de 2018: ESAL y donaciones",
   "resumen": "Doctrina oficial unificada sobre ESAL, RTE y donaciones tras la Ley 1819: calificación y permanencia, actividades meritorias, beneficio neto y su exención, distribución indirecta de excedentes, registro web, cooperativas, ONG extranjeras y el descuento por donaciones. Primera fuente para resolver dudas interpretativas.",
   "aplica": "Contadores y revisores fiscales de ESAL: doctrina citable ante la DIAN en calificación, permanencia, excedentes y donaciones.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "donaciones",
    "beneficio neto",
    "registro web"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por doctrina posterior: el Oficio 30909 de 2018 (descriptor 3.4.1 sobre entidades religiosas, confirmando el resto) y el Concepto General Unificado 0418 de 2022 (libros de contabilidad en propiedad horizontal). Ninguno lo deroga.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0000481_2018.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Documents/CU-ESAL-100208221-481.pdf"
  },
  {
   "id": "resolucion_banrep_1_2018",
   "tipo": "resolucion",
   "numero": "Externa 1",
   "anio": 2018,
   "titulo": "Resolución Externa 1 de 2018 Banco de la República - Estatuto cambiario vigente",
   "resumen": "Estatuto cambiario vigente, expedido por la Junta del Banco de la República. Define las operaciones de canalización obligatoria (importaciones, exportaciones, endeudamiento externo, inversiones internacionales, avales y derivados), los intermediarios del mercado cambiario autorizados y las cuentas de compensación.",
   "aplica": "Toda persona o empresa que mueva divisas con el exterior: indica qué operaciones deben pasar por un IMC o por una cuenta de compensación registrada.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "estatuto cambiario",
    "canalizacion",
    "cuentas de compensacion",
    "imc"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por varias resoluciones externas posteriores de la Junta; el Banco de la República publica el compendio actualizado.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_banrepublica_jd-0001_2018.htm",
   "url_alt": "https://www.banrep.gov.co/es/normatividad/compendios/resolucion-externa-1-2018"
  },
  {
   "id": "decreto_2150_2017",
   "tipo": "decreto",
   "numero": "2150",
   "anio": 2017,
   "titulo": "Decreto 2150 de 2017: reglamento del Régimen Tributario Especial",
   "resumen": "Reglamentó el nuevo RTE de la Ley 1819: requisitos y anexos de la solicitud de calificación y permanencia, actualización anual, registro web y comentarios de la sociedad civil, memoria económica para ingresos superiores a 160.000 UVT, donaciones y su certificación, y reglas para cooperativas y copropiedades.",
   "aplica": "ESAL, cooperativas y copropiedades comerciales o mixtas: todo trámite y cálculo del RTE se rige por este decreto, compilado en el DUR 1625 de 2016.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "calificación",
    "registro web",
    "memoria económica",
    "donaciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "El Consejo de Estado (sentencia 23692 de 2020) anuló el aparte que negaba a las cooperativas la exoneración de aportes del art. 114-1 ET.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2150_2017.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1625_2016",
   "tipo": "decreto",
   "numero": "1625",
   "anio": 2016,
   "titulo": "Decreto 1625 de 2016 — Decreto Único Reglamentario en materia tributaria (DUR)",
   "resumen": "Compila toda la reglamentación de retención en la fuente: bases mínimas en UVT, tarifas por concepto (compras, servicios, honorarios, arrendamientos, rendimientos), procedimientos de retención laboral y la autorretención especial de renta (Libro 1, Parte 2, Títulos 4 y 6). Es el texto que se consulta para saber la tarifa puntual aplicable hoy.",
   "aplica": "Referencia operativa diaria de cualquier agente retenedor o autorretenedor: aquí están las bases y tarifas vigentes de cada concepto.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "retefuente",
    "procedimiento",
    "iva",
    "inc",
    "autorretencion",
    "facturacion-electronica",
    "rst",
    "exogena",
    "patrimonio",
    "gmf",
    "timbre",
    "carbono",
    "saludables"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "independiente",
    "empleador",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "reglamentacion",
    "compilacion",
    "plazos",
    "depuracion",
    "reglamentación",
    "devoluciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "Se actualiza permanentemente con cada decreto reglamentario que lo modifica o adiciona.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1625_2016.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2201_2016",
   "tipo": "decreto",
   "numero": "2201",
   "anio": 2016,
   "titulo": "Decreto 2201 de 2016 — Reglamenta la autorretención especial del impuesto de renta",
   "resumen": "Desarrolla el parágrafo 2 del art. 365 ET (arts. 1.2.6.6 a 1.2.6.11 del DUR): obliga a autorretenerse a las sociedades nacionales y asimiladas exoneradas de aportes parafiscales por el art. 114-1 ET, con tarifas originales entre 0,40% y 1,60% según actividad CIIU, declarables en el formulario 350. Reemplazó la autorretención del CREE desde el 1 de enero de 2017.",
   "aplica": "Sociedades nacionales contribuyentes de renta exoneradas de aportes sobre trabajadores que ganan menos de 10 SMMLV; se liquida sobre el ingreso bruto mensual.",
   "impuestos": [
    "autorretencion",
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "autorretencion especial",
    "ciiu",
    "exoneracion parafiscales",
    "formulario 350"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sus tarifas fueron sustituidas por los Decretos 0261 de 2023 y 0242 de 2024 y luego por el Decreto 572 de 2025. Este último fue suspendido provisionalmente el 7 de mayo de 2026, pero el Consejo de Estado revocó la suspensión el 2 de junio de 2026 y sus tarifas recobran aplicación desde el primer día",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2201_2016.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1819_2016",
   "tipo": "ley",
   "numero": "1819",
   "anio": 2016,
   "titulo": "Ley 1819 de 2016 — Reforma tributaria estructural",
   "resumen": "Además de los cambios sustantivos, reescribió la parte procedimental del ET: rediseñó el art. 640 para consagrar la favorabilidad, gradualidad, proporcionalidad y lesividad sancionatorias, bajó la inexactitud general del 160% al 100%, redefinió la firmeza (714), las sanciones de exógena y devoluciones improcedentes, y simplificó la cláusula antiabuso. Es la base del régimen sancionatorio actual.",
   "aplica": "Referencia obligada para liquidar cualquier sanción tributaria posterior a 2017 y para invocar favorabilidad sobre hechos anteriores.",
   "impuestos": [
    "renta-pj",
    "iva",
    "procedimiento",
    "renta-pn",
    "inc",
    "retefuente",
    "autorretencion",
    "exogena",
    "carbono"
   ],
   "perfiles": [
    "persona-juridica",
    "esal",
    "persona-natural",
    "independiente",
    "gran-contribuyente",
    "no-residente",
    "empleador"
   ],
   "sectores": [
    "mineria-energia",
    "transporte"
   ],
   "temas": [
    "conciliacion fiscal",
    "niif",
    "esal",
    "ece",
    "sistema cedular",
    "reforma tributaria"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por las reformas de 2019, 2021 y 2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1819_2016.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1068_2015",
   "tipo": "decreto",
   "numero": "1068",
   "anio": 2015,
   "titulo": "Decreto 1068 de 2015 - DUR Hacienda: cambios internacionales e inversiones (Libro 2, Parte 17)",
   "resumen": "Decreto Único Reglamentario del sector Hacienda. Su Libro 2, Parte 17 concentra la reglamentación cambiaria: definición de operaciones de cambio, residencia para fines cambiarios y el régimen general de la inversión de capital del exterior en Colombia y de las inversiones colombianas en el exterior.",
   "aplica": "Consulta obligada para registrar inversión extranjera, definir la residencia cambiaria y conocer los derechos cambiarios del inversionista.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "decreto unico",
    "inversion extranjera",
    "residencia cambiaria",
    "compilacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "El régimen de inversiones internacionales de la Parte 17 fue sustituido integralmente por el Decreto 119 de 2017.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1068_2015.htm",
   "url_alt": "https://www.banrep.gov.co/sites/default/files/reglamentacion/archivos/decreto_1068_2015.pdf"
  },
  {
   "id": "ley_1715_2014",
   "tipo": "ley",
   "numero": "1715",
   "anio": 2014,
   "titulo": "Ley 1715 de 2014 — Incentivos tributarios a energías renovables no convencionales",
   "resumen": "Paquete de incentivos para inversiones en fuentes no convencionales de energía (FNCE) y gestión eficiente: deducción en renta del 50% de la inversión aplicable en hasta 15 años, depreciación acelerada, exclusión de IVA y exención de aranceles para equipos y servicios del proyecto, previa certificación de la UPME.",
   "aplica": "Declarantes de renta (sociedades o personas naturales) que inviertan en proyectos solares, eólicos, biomasa, PCH u otras FNCE certificados por la UPME.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "energias renovables",
    "deducciones",
    "exclusion iva",
    "upme"
   ],
   "estado": "modificada",
   "nota_vigencia": "Ampliada por la Ley 1955 de 2019 (deducción a 15 años) y por la Ley 2099 de 2021 (hidrógeno verde y azul, almacenamiento y medición inteligente).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1715_2014.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1609_2013",
   "tipo": "ley",
   "numero": "1609",
   "anio": 2013,
   "titulo": "Ley 1609 de 2013 - Ley Marco de Aduanas",
   "resumen": "Ley marco de aduanas: fija los principios y criterios generales (seguridad jurídica, favorabilidad, eficiencia) a los que se sujeta el Gobierno al expedir la regulación aduanera. Es el fundamento del Decreto 1165 de 2019. La Corte tumbó la habilitación para que el Gobierno definiera sanciones y decomiso.",
   "aplica": "Gobierno y usuarios aduaneros: define los límites dentro de los cuales se expide y aplica toda la regulación aduanera del país.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "ley marco",
    "principios",
    "reserva de ley"
   ],
   "estado": "modificada",
   "nota_vigencia": "El numeral 4 del artículo 5 fue declarado inexequible por la Sentencia C-441 de 2021: las sanciones y el decomiso aduanero tienen reserva de ley.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1609_2013.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2245_2011",
   "tipo": "decreto",
   "numero": "2245",
   "anio": 2011,
   "titulo": "Régimen sancionatorio y procedimiento administrativo cambiario de la DIAN",
   "resumen": "Régimen sancionatorio y procedimiento administrativo cambiario de la DIAN. Tipifica las infracciones con multas en UVT: no canalizar divisas, errores u omisiones en la declaración de cambio, no registrar o no reportar la cuenta de compensación, no conservar soportes. Responsabilidad objetiva y cinco años para formular cargos.",
   "aplica": "Todo importador, exportador o titular de cuenta de compensación investigado por la DIAN por infracciones al régimen cambiario de su competencia.",
   "impuestos": [
    "procedimiento",
    "cambiario"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "regimen cambiario",
    "sanciones",
    "comercio exterior",
    "infracciones",
    "infraccion cambiaria",
    "uvt"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2245_2011.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=69833"
  },
  {
   "id": "estatuto_art_771_5",
   "tipo": "estatuto",
   "numero": "Art. 771-5",
   "anio": 2010,
   "titulo": "ET Art. 771-5 — Medios de pago para la aceptación de costos, deducciones, pasivos e impuestos descontables (bancarización)",
   "resumen": "Condiciona el reconocimiento fiscal de costos, deducciones, pasivos e IVA descontable al uso de canales financieros. Del efectivo solo se acepta el menor entre el 40% de lo pagado (tope 40.000 UVT) y el 35% del total de costos y deducciones, y ningún pago individual en efectivo que supere 100 UVT se acepta fiscalmente.",
   "aplica": "Todo contribuyente de renta o responsable de IVA que pague costos o gastos en efectivo. La DIAN lo invoca de forma rutinaria en requerimientos para rechazar costos sin soporte bancario.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "bancarizacion",
    "efectivo",
    "deducciones",
    "iva descontable",
    "fiscalizacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por la Ley 1430 de 2010 y modificado por la Ley 1739 de 2014; la Ley 1819 de 2016 redefinió la gradualidad (plena desde 2021) y fijó en el parágrafo 2 el límite individual de 100 UVT para pagos en efectivo.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c160_1998",
   "tipo": "sentencia",
   "numero": "C-160",
   "anio": 1998,
   "titulo": "Sentencia C-160 de 1998, Corte Constitucional — Sin daño no hay sanción por no informar",
   "resumen": "La Corte condicionó la sanción por no enviar información: los errores u omisiones solo son sancionables si causan daño a la labor de fiscalización de la DIAN, y la multa debe ser proporcional a ese daño. Es la defensa de fondo clásica frente a pliegos de cargos por exógena con errores meramente formales.",
   "aplica": "Cualquier reportante en discusión con la DIAN por errores en sus formatos: exige que la administración demuestre el daño y gradúe la sanción.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "daño",
    "proporcionalidad",
    "sanciones",
    "jurisprudencia"
   ],
   "estado": "vigente",
   "nota_vigencia": "Condicionamiento aplicable también al artículo 651 vigente; criterio reiterado por la jurisprudencia del Consejo de Estado.",
   "importancia": "clave",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/1998/C-160-98.htm"
  },
  {
   "id": "decreto_1735_1993",
   "tipo": "decreto",
   "numero": "1735",
   "anio": 1993,
   "titulo": "Decreto 1735 de 1993 - Operaciones de cambio y residencia cambiaria",
   "resumen": "Definió qué es una operación de cambio y quién es residente para efectos cambiarios: personas naturales que habitan en Colombia, entidades públicas y personas jurídicas domiciliadas en el país, incluidas sucursales de sociedades extranjeras. Su contenido fue llevado al Decreto Único 1068 de 2015.",
   "aplica": "Determina si usted es residente cambiario y si su operación (importar, exportar, invertir, endeudarse en divisas) debe pasar por el mercado cambiario.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "residencia cambiaria",
    "operaciones de cambio",
    "definiciones"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Compilado en el Decreto 1068 de 2015 (arts. 2.17.1.1 y ss.); la definición de residencia fue reescrita por el Decreto 119 de 2017.",
   "importancia": "clave",
   "url_dian": "",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=75392"
  },
  {
   "id": "ley_9_1991",
   "tipo": "ley",
   "numero": "9",
   "anio": 1991,
   "titulo": "Ley 9 de 1991 - Ley marco de cambios internacionales",
   "resumen": "Ley marco del régimen cambiario: fija los criterios que el Gobierno y la Junta del Banco de la República deben seguir para regular los cambios internacionales. Ordena canalizar ciertas operaciones por el mercado cambiario, permite la tenencia de divisas y es la base legal de todo el sistema cambiario colombiano.",
   "aplica": "Cualquier residente que importe, exporte, reciba inversión extranjera o se endeude en divisas: aquí nace la obligación de canalizar esas operaciones.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "ley marco",
    "canalizacion",
    "mercado cambiario",
    "divisas"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sigue vigente como ley marco; varios artículos fueron ajustados o desarrollados por la Ley 31 de 1992 y la regulación de la Junta del Banco de la República.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0009_1991.htm",
   "url_alt": ""
  },
  {
   "id": "estatuto_tributario",
   "tipo": "estatuto",
   "numero": "624",
   "anio": 1989,
   "titulo": "Estatuto Tributario (Decreto 624 de 1989)",
   "resumen": "Marco del que nacen todos los calendarios: el Gobierno fija lugares y plazos de las declaraciones (art. 579), la presentación virtual es obligatoria para quienes señale la DIAN y hacerlo por otro medio equivale a no presentar (art. 579-2), el art. 580 lista cuándo una declaración se tiene por no presentada y el art. 800 remite el pago a los plazos del reglamento.",
   "aplica": "Todo contribuyente, responsable o agente de retención que presenta declaraciones ante la DIAN.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "retefuente",
    "procedimiento",
    "gmf",
    "timbre",
    "patrimonio",
    "rst"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "regimen-simple",
    "empleador",
    "independiente",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "renta",
    "tarifas",
    "deducciones",
    "procedimiento",
    "compilacion",
    "iva"
   ],
   "estado": "modificada",
   "nota_vigencia": "Reformado de manera recurrente; últimas reformas estructurales: leyes 1819 de 2016, 2010 de 2019, 2155 de 2021 y 2277 de 2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_107",
   "tipo": "estatuto",
   "numero": "Art. 107",
   "anio": 1989,
   "titulo": "ET Art. 107 — Expensas necesarias deducibles",
   "resumen": "Regla general de deducibilidad: los gastos deben tener relación de causalidad con la actividad productora de renta y ser necesarios y proporcionados según criterio comercial. El Consejo de Estado unificó su lectura en la sentencia 21329 de 2020 con una visión amplia de la causalidad.",
   "aplica": "Cualquier sociedad que pretenda deducir un gasto en su declaración de renta; es el primer filtro antes de las reglas especiales de cada deducción.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "deducciones",
    "causalidad",
    "necesidad",
    "proporcionalidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "Alcance unificado por el Consejo de Estado, Sección Cuarta, sentencia de unificación 21329 del 26 de noviembre de 2020.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_19",
   "tipo": "estatuto",
   "numero": "Art. 19",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 19: contribuyentes del Régimen Tributario Especial",
   "resumen": "Las asociaciones, fundaciones y corporaciones sin ánimo de lucro son por regla general contribuyentes del régimen ordinario; solo entran al RTE si la DIAN las califica previa solicitud. Exige objeto social de actividad meritoria, acceso de la comunidad y que ni los aportes ni los excedentes se reembolsen o distribuyan.",
   "aplica": "Fundaciones, asociaciones y corporaciones constituidas en Colombia que quieran tributar al 20% con posibilidad de exención del excedente reinvertido.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "calificación",
    "actividades meritorias",
    "excedentes"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto vigente dado por el artículo 140 de la Ley 1819 de 2016.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_19_4",
   "tipo": "estatuto",
   "numero": "Art. 19-4",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 19-4: cooperativas en el Régimen Tributario Especial",
   "resumen": "Las cooperativas y demás entidades vigiladas por la Supersolidaria pertenecen al RTE por mandato legal: no piden calificación, solo actualizan el registro web. Tributan al 20% sobre el excedente determinado según la normativa cooperativa y el impuesto se toma del fondo de educación y solidaridad de la Ley 79 de 1988.",
   "aplica": "Cooperativas, federaciones, instituciones auxiliares del cooperativismo y mutuales vigiladas por la Superintendencia de la Economía Solidaria.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "cooperativas",
    "excedentes",
    "tarifa 20%"
   ],
   "estado": "vigente",
   "nota_vigencia": "Adicionado por la Ley 1819 de 2016 (transición de tarifa 10%-15%-20% entre 2017 y 2019, hoy agotada).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_206",
   "tipo": "estatuto",
   "numero": "Art. 206",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 206 — Rentas exentas de trabajo y de pensiones",
   "resumen": "Lista las rentas laborales exentas: el 25% de los pagos laborales (numeral 10, hoy con techo anual de 790 UVT), pensiones hasta 1.000 UVT mensuales —incluidas las del exterior desde 2023—, cesantías e intereses según ingreso, indemnizaciones por maternidad y gastos de representación de ciertos cargos.",
   "aplica": "Asalariados, pensionados y trabajadores independientes con rentas de trabajo; el 25% exento también puede restarse en la base de retención mensual.",
   "impuestos": [
    "renta-pn",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "independiente",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "rentas exentas",
    "pensiones",
    "25% exento",
    "cesantias"
   ],
   "estado": "modificada",
   "nota_vigencia": "Numerales 5 y 10 modificados por la Ley 2277 de 2022: tope de 790 UVT al 25% exento y exención extendida a pensiones del exterior.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_235_2",
   "tipo": "estatuto",
   "numero": "Art. 235-2",
   "anio": 1989,
   "titulo": "Rentas exentas sectoriales de personas jurídicas (ET, Art. 235-2)",
   "resumen": "Lista las rentas exentas de sociedades. Tras la Ley 2277 de 2022 sobreviven, entre otras, la asociada a vivienda de interés social (utilidad en la venta de predios para proyectos VIS/VIP y en la primera enajenación de estas viviendas) y la venta de energía eléctrica generada con fuentes renovables por empresas generadoras, conforme a los requisitos de cada numeral.",
   "aplica": "Sociedades en proyectos VIS/VIP y generadores de energía con fuentes renovables que cumplan los requisitos de cada numeral; quienes consolidaron las exenciones derogadas antes de la Ley 2277 de 2022 las conservan por el término originalmente otorgado.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "construccion",
    "mineria-energia"
   ],
   "temas": [
    "rentas exentas",
    "vis",
    "energias renovables",
    "economia naranja",
    "derogatorias"
   ],
   "estado": "modificada",
   "nota_vigencia": "El art. 96 de la Ley 2277 de 2022 derogó los numerales 1 (economía naranja), 2 (desarrollo del campo), 5 (plantaciones forestales) y 6 (transporte fluvial de bajo calado), además de los literales c) y d) del numeral 4; quien consolidó su situación jurídica antes conserva la exención por el término o",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_240",
   "tipo": "estatuto",
   "numero": "Art. 240",
   "anio": 1989,
   "titulo": "ET Art. 240 — Tarifa general de renta PJ, sobretasas y tasa mínima de tributación",
   "resumen": "Fija la tarifa general de renta para sociedades en 35%. Tras la Ley 2277 de 2022 suma puntos adicionales para el sector financiero, hidrocarburos y carbón (según precios) y generadoras hidroeléctricas, e introduce la tasa mínima de tributación del 15% sobre la utilidad depurada (TTD).",
   "aplica": "Sociedades nacionales y extranjeras con renta gravable en Colombia; revisar sobretasas si pertenece al sector financiero o extractivo y calcular siempre la TTD.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "financiero",
    "mineria-energia"
   ],
   "temas": [
    "tarifas",
    "sobretasa",
    "tasa minima"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por el art. 10 de la Ley 2277 de 2022 (sobretasas sectoriales y tasa mínima de tributación del parágrafo 6).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_240_1",
   "tipo": "estatuto",
   "numero": "Art. 240-1",
   "anio": 1989,
   "titulo": "ET Art. 240-1 — Tarifa de renta para usuarios de zona franca",
   "resumen": "Tarifa del 20% en renta para usuarios industriales de zona franca, pero desde 2024 solo sobre la utilidad ligada a las exportaciones pactadas en el plan de internacionalización suscrito con MinCIT; la porción restante tributa al 35%. Usuarios comerciales tributan al 35% y zonas francas costa afuera y otras especiales conservan el 20% pleno.",
   "aplica": "Usuarios industriales y comerciales de zonas francas que quieran conservar la tarifa preferencial del 20% en el impuesto de renta.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "tarifas",
    "zonas francas",
    "internacionalizacion",
    "exportaciones",
    "plan de internacionalizacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por la Ley 2277 de 2022; la Sentencia C-384 de 2023 lo inaplicó para usuarios con condiciones cumplidas antes del 13-dic-2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_241",
   "tipo": "estatuto",
   "numero": "Art. 241",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 241 — Tarifa del impuesto de renta para personas naturales residentes",
   "resumen": "Tabla progresiva en UVT con tarifas marginales del 0% al 39%: los primeros 1.090 UVT de renta líquida no pagan impuesto y de ahí en adelante cada rango tributa más. Se aplica a la suma de las rentas líquidas de la cédula general, pensiones y, desde 2023, también a los dividendos de residentes.",
   "aplica": "Toda persona natural residente que liquide impuesto en el formulario 210; es la tabla con la que se calcula el impuesto básico de renta.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "uvt",
    "progresividad",
    "dividendos"
   ],
   "estado": "modificada",
   "nota_vigencia": "La Ley 2277 de 2022 integró los dividendos a esta tabla (con descuento del art. 254-1) sin cambiar los rangos.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_462_1",
   "tipo": "estatuto",
   "numero": "Art. 462-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Art. 462-1 — Base gravable especial AIU",
   "resumen": "En los servicios integrales de aseo y cafetería, vigilancia autorizada por la Supervigilancia, servicios temporales autorizados por MinTrabajo y los prestados por CTA y precooperativas, el IVA, la retención de renta y el ICA se liquidan solo sobre el AIU (administración, imprevistos y utilidad), que no puede ser inferior al 10% del contrato.",
   "aplica": "Empresas de aseo, cafetería, vigilancia y servicios temporales, y a quienes las contratan, para facturar y practicar retenciones sobre la base AIU.",
   "impuestos": [
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica",
    "esal"
   ],
   "sectores": [
    "servicios"
   ],
   "temas": [
    "aiu",
    "base gravable",
    "aseo y vigilancia",
    "servicios temporales",
    "vigilancia",
    "aseo"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto vigente dado por la Ley 1607 de 2012; aunque el artículo menciona la tarifa del 16%, desde la Ley 1819 de 2016 aplica la tarifa general del 19% según doctrina DIAN.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_600",
   "tipo": "estatuto",
   "numero": "Art. 600",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Art. 600 — Periodo gravable del IVA",
   "resumen": "Fija la periodicidad del IVA: bimestral para grandes contribuyentes, responsables con ingresos brutos al 31 de diciembre del año anterior iguales o superiores a 92.000 UVT y quienes operan con bienes de los arts. 477 y 481; cuatrimestral para los demás. Las declaraciones presentadas en periodicidad equivocada conservan efectos legales y el error es corregible, según el Consejo de Estado.",
   "aplica": "Cada año debe recalcular con los ingresos del año anterior si presenta el formulario 300 cada 2 o cada 4 meses; el régimen simple declara IVA anual consolidado.",
   "impuestos": [
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "periodicidad",
    "formulario 300",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "La periodicidad anual fue eliminada por la Ley 1819 de 2016. El Consejo de Estado (sentencias 25406 de 2022 y 25666 de 2024) anuló la regla reglamentaria y la doctrina DIAN que dejaban 'sin efecto legal' las declaraciones presentadas en periodicidad errada; ver Concepto DIAN 3404 de 2025 sobre su co",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_631",
   "tipo": "estatuto",
   "numero": "Art. 631",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 631 — Para estudios y cruces de información",
   "resumen": "Faculta al Director de la DIAN para pedir a contribuyentes y no contribuyentes los datos de sus operaciones con terceros (pagos, ingresos, retenciones, cuentas por cobrar y por pagar, IVA, socios) con fines de cruces y estudios. Es la base legal de la exógena: cada resolución anual que la prescribe se apoya en este artículo.",
   "aplica": "Todo obligado a reportar exógena nacional: personas naturales y jurídicas, entidades públicas y privadas, contribuyentes y no contribuyentes que cumplan los topes o calidades de la resolución anual.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "obligados",
    "cruces de información",
    "facultades dian",
    "resolución anual"
   ],
   "estado": "modificada",
   "nota_vigencia": "El parágrafo 3, modificado por el artículo 139 de la Ley 1607 de 2012, exige definir el contenido y características técnicas de la información (la resolución anual) con mínimo dos meses de anterioridad al último día del año gravable anterior a aquel por el cual se solicita.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_651",
   "tipo": "estatuto",
   "numero": "Art. 651",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 651 — Sanción por no enviar información o enviarla con errores",
   "resumen": "Castiga no reportar la información exógena, hacerlo tarde o con errores: 1% de las sumas no informadas y 0,7% de las reportadas con error, con tope de 7.500 UVT. Subsanar voluntariamente antes del pliego de cargos reduce la sanción al 10%. La Corte (C-160/98) exige que el error cause daño y que la multa sea proporcional.",
   "aplica": "Obligados a reportar exógena nacional (Resolución de cada año gravable): personas jurídicas, naturales con topes de ingresos, entidades públicas y financieras.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "reducción de sanciones",
    "uvt",
    "desconocimiento de costos",
    "exogena",
    "informacion tributaria"
   ],
   "estado": "modificada",
   "nota_vigencia": "Redacción vigente dada por la Ley 2277 de 2022; condicionado por la Sentencia C-160 de 1998 (sin daño no hay sanción).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_689_3",
   "tipo": "estatuto",
   "numero": "Art. 689-3",
   "anio": 1989,
   "titulo": "ET Art. 689-3 — Beneficio de auditoría",
   "resumen": "La declaración de renta queda en firme en 6 meses si el impuesto neto crece 35% frente al año anterior, o en 12 meses si crece 25%, siempre que el impuesto del año previo sea de al menos 71 UVT y la declaración se presente y pague a tiempo. Cubre los años gravables 2022 a 2026.",
   "aplica": "PJ y PN que puedan incrementar su impuesto neto de renta y quieran acortar la firmeza de su declaración; excluye a quienes gocen de ciertos beneficios fiscales.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "beneficio auditoria",
    "firmeza",
    "fiscalizacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por la Ley 2155 de 2021 y prorrogado para los años gravables 2024 a 2026 por el art. 69 de la Ley 2294 de 2023.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_800_1",
   "tipo": "estatuto",
   "numero": "Art. 800-1",
   "anio": 1989,
   "titulo": "Obras por impuestos por convenio con títulos negociables (ET, Art. 800-1)",
   "resumen": "Permite a contribuyentes con ingresos brutos de 33.610 UVT o más celebrar convenios con entidades públicas nacionales para ejecutar proyectos en municipios ZOMAC, PDET y otros territorios priorizados, recibiendo a cambio Títulos para la Renovación del Territorio (TRT) con los que pagan hasta el 50% de su impuesto de renta.",
   "aplica": "Personas naturales y jurídicas obligadas a llevar contabilidad con ingresos brutos iguales o superiores a 33.610 UVT en el año anterior.",
   "impuestos": [
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "obras por impuestos",
    "zomac",
    "pdet",
    "trt"
   ],
   "estado": "modificada",
   "nota_vigencia": "Creado por la Ley 2010 de 2019; el art. 294 de la Ley 2294 de 2023 (PND 2022-2026) modificó el inciso segundo sobre el objeto de los convenios.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_292_3_298_8",
   "tipo": "estatuto",
   "numero": "Arts. 292-3 a 298-8",
   "anio": 1989,
   "titulo": "Impuesto al patrimonio (ET, Arts. 292-3 a 298-8)",
   "resumen": "Impuesto permanente desde 2023 sobre patrimonios líquidos iguales o superiores a 72.000 UVT a 1° de enero de cada año. Tarifas marginales del 0,5% y 1%, más un tramo del 1,5% que solo aplica hasta el año gravable 2026. Se declara y paga cada año en el formulario 420.",
   "aplica": "Personas naturales y sucesiones ilíquidas (residentes por patrimonio mundial) y sociedades extranjeras no declarantes de renta con bienes en Colombia distintos de acciones y cuentas por cobrar.",
   "impuestos": [
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "no-residente",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "patrimonio liquido",
    "tarifas",
    "uvt",
    "residencia fiscal"
   ],
   "estado": "vigente",
   "nota_vigencia": "Creado como permanente por la Ley 2277 de 2022; el Decreto 1474 de 2025, que bajaba el umbral a $2.000 millones, fue declarado inexequible (C-079 de 2026), así que en 2026 rigen las reglas originales.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_299_317",
   "tipo": "estatuto",
   "numero": "Arts. 299-317",
   "anio": 1989,
   "titulo": "Ganancias ocasionales (ET, Arts. 299-317)",
   "resumen": "Régimen de ganancias ocasionales: utilidad en venta de activos fijos poseídos dos años o más, herencias, legados, donaciones y premios. Desde 2023 la tarifa general es del 15% (antes 10%) y la de loterías, rifas y apuestas sigue en 20%. Conserva exenciones como las primeras 5.000 UVT en venta de casa de habitación.",
   "aplica": "Personas naturales y jurídicas, residentes o no, que reciban herencias, donaciones o premios, o vendan activos fijos poseídos por dos años o más.",
   "impuestos": [
    "renta-pn",
    "renta-pj"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "ganancias ocasionales",
    "herencias",
    "venta de activos",
    "loterias",
    "exenciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "Tarifas de los Arts. 313, 314 y 316 elevadas al 15% por la Ley 2277 de 2022 desde el año gravable 2023.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_329_343",
   "tipo": "estatuto",
   "numero": "Arts. 329-343",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 329 a 343 — Determinación cedular del impuesto de renta de personas naturales",
   "resumen": "Columna vertebral del impuesto de renta de residentes: tres cédulas (general, pensiones y dividendos) que se depuran por separado. El art. 336 limita rentas exentas y deducciones de la cédula general al 40% de los ingresos netos sin pasar de 1.340 UVT, y permite la deducción de 72 UVT por dependiente.",
   "aplica": "Personas naturales residentes y sucesiones ilíquidas de causantes residentes que declaran renta en el formulario 210.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "sistema cedular",
    "depuracion",
    "rentas exentas",
    "limite 40%",
    "cedula general"
   ],
   "estado": "modificada",
   "nota_vigencia": "Arts. 331, 336 y otros modificados por la Ley 2277 de 2022 (límite de 1.340 UVT y deducción por dependientes).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_356_364_6",
   "tipo": "estatuto",
   "numero": "Arts. 356 a 364-6",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Título VI Libro I: Régimen Tributario Especial",
   "resumen": "Núcleo sustantivo del RTE: tarifa única del 20% sobre el beneficio neto, exención cuando se reinvierte en la actividad meritoria, lista de actividades meritorias (art. 359), prohibición de distribuir excedentes directa o indirectamente, registro web con comentarios ciudadanos, memoria económica y causales de exclusión.",
   "aplica": "ESAL calificadas en el RTE y, en lo pertinente, cooperativas del art. 19-4. Es el bloque que define cómo tributan y qué las saca del régimen.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "beneficio neto",
    "actividades meritorias",
    "registro web",
    "exclusión",
    "distribución indirecta"
   ],
   "estado": "modificada",
   "nota_vigencia": "Arts. 356-2 y 364-5 modificados por la Ley 2277 de 2022; la sentencia C-022 de 2020 retiró la identificación del donante del registro web público.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_365_370",
   "tipo": "estatuto",
   "numero": "Arts. 365-370",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 365 a 370 — Facultad de establecer retenciones y agentes de retención",
   "resumen": "Columna vertebral del sistema: autoriza al Gobierno a fijar retenciones para recaudar el impuesto de renta de forma anticipada (art. 365), define quiénes son agentes de retención (art. 368), obliga a retener a personas naturales comerciantes con ingresos o patrimonio superiores a 30.000 UVT (art. 368-2) y señala los pagos no sujetos (art. 369).",
   "aplica": "Cualquier empresa, entidad o persona natural que pague costos o gastos y deba determinar si está obligada a practicar retención en la fuente.",
   "impuestos": [
    "retefuente",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "agentes de retencion",
    "anticipo del impuesto",
    "pagos no sujetos",
    "30000 uvt"
   ],
   "estado": "vigente",
   "nota_vigencia": "El parágrafo 2 del art. 365, añadido por la Ley 1819 de 2016, creó la autorretención especial que desarrolla el Decreto 2201 de 2016.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_375_382",
   "tipo": "estatuto",
   "numero": "Arts. 375-382",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 375 a 382 — Obligaciones del agente retenedor y certificados",
   "resumen": "Concentra los deberes de quien retiene: practicar la retención (art. 375), consignar lo retenido en los plazos oficiales (art. 376), declarar mensualmente (art. 382) y expedir certificados: el de ingresos y retenciones por pagos laborales (art. 378) y el certificado por otros conceptos (art. 381). Incumplirlos genera sanciones y responsabilidad directa.",
   "aplica": "Todo agente de retención de renta: define qué debe hacer cada mes y qué certificados debe entregar a sus proveedores y empleados al inicio de cada año.",
   "impuestos": [
    "retefuente",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "obligaciones del agente",
    "certificados de retencion",
    "declaracion mensual",
    "consignacion"
   ],
   "estado": "vigente",
   "nota_vigencia": "Se complementa con el art. 580-1 ET: la declaración de retención presentada sin pago total puede quedar ineficaz.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_383_388",
   "tipo": "estatuto",
   "numero": "Arts. 383-388",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 383 a 388 — Retención en la fuente sobre rentas de trabajo",
   "resumen": "Regula la retención mensual a empleados e independientes: tabla progresiva en UVT del art. 383 (0% a 39%), procedimiento 1 que aplica la tabla mes a mes (art. 385), procedimiento 2 con porcentaje fijo recalculado semestralmente (art. 386) y la depuración de la base del art. 388 (ingresos no gravados, deducciones y rentas exentas con límite del 40%).",
   "aplica": "Empleadores y contratantes que pagan salarios u honorarios a personas naturales, y trabajadores que quieren verificar su retención mensual.",
   "impuestos": [
    "retefuente",
    "renta-pn"
   ],
   "perfiles": [
    "empleador",
    "persona-natural",
    "independiente",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "retencion en la fuente",
    "procedimiento 1 y 2",
    "tabla 383",
    "depuracion",
    "rentas de trabajo",
    "dependientes"
   ],
   "estado": "modificada",
   "nota_vigencia": "Art. 383 modificado por la Ley 2277 de 2022 y reglamentado por el Decreto 2231 de 2023 (opción de costos y gastos para independientes).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_392_401",
   "tipo": "estatuto",
   "numero": "Arts. 392-401",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 392 a 401 — Conceptos y tarifas de retención sobre pagos ordinarios",
   "resumen": "Es el catálogo legal de conceptos de retención del régimen ordinario: honorarios, comisiones y servicios (art. 392), rendimientos financieros (arts. 395-397), enajenación de activos fijos de personas naturales al 1% (art. 398) y otros ingresos tributarios, que cubren compras y arrendamientos (art. 401). Las tarifas y bases puntuales en UVT las desarrolla el DUR 1625 de 2016.",
   "aplica": "Quien paga honorarios, servicios, comisiones, arrendamientos, rendimientos o compras y necesita ubicar el concepto y la tarifa de retención correcta.",
   "impuestos": [
    "retefuente",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "honorarios",
    "servicios",
    "compras",
    "arrendamientos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Las bases mínimas del Decreto 572 de 2025 (10 UVT compras y 2 UVT servicios) fueron suspendidas provisionalmente por el Consejo de Estado (auto del 7 de mayo de 2026, regresando transitoriamente a 27 y 4 UVT), pero el auto del 2 de junio de 2026 revocó esa suspensión: las bases del Decreto 572 vuelv",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_420_428",
   "tipo": "estatuto",
   "numero": "Arts. 420-428",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 420 a 428 — Hecho generador del IVA y bienes excluidos",
   "resumen": "Núcleo del IVA: grava la venta de bienes corporales muebles e inmuebles, los servicios, las importaciones y los juegos de suerte y azar (salvo loterías y los operados solo por internet). El art. 424 lista los bienes excluidos, el 426 deja los restaurantes en el INC y el 428 las importaciones que no causan IVA.",
   "aplica": "Primer filtro para cualquier negocio: define si lo que vende está gravado, excluido o por fuera del IVA, y si un restaurante factura IVA o INC.",
   "impuestos": [
    "iva",
    "inc"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "hecho generador",
    "bienes excluidos",
    "restaurantes",
    "importaciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "Listas de excluidos reorganizadas por las Leyes 1819 de 2016, 1943 de 2018 y 2010 de 2019.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_437_1_437_3",
   "tipo": "estatuto",
   "numero": "Arts. 437-1 a 437-3",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 437-1 a 437-3 — Retención en la fuente de IVA (reteIVA)",
   "resumen": "Crea la retención del IVA: tarifa general del 15% del impuesto, que puede llegar hasta el 50% según reglamento y al 100% en servicios contratados con no residentes (art. 437-1); lista taxativa de agentes retenedores como entidades estatales, grandes contribuyentes designados y quienes contraten con extranjeros (art. 437-2); y responsabilidad por lo retenido (art. 437-3).",
   "aplica": "Entidades públicas, grandes contribuyentes, responsables designados por la DIAN y cualquier empresa que contrate servicios gravados con no residentes.",
   "impuestos": [
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "gran-contribuyente",
    "persona-juridica",
    "no-residente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "reteiva",
    "agentes de retencion",
    "servicios desde el exterior",
    "tarifa 15%"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 437-2 ha sido adicionado por las Leyes 1819 de 2016 y 2010 de 2019, entre otras, para incluir nuevos agentes como los responsables que compran a contribuyentes del SIMPLE.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_437_437_2",
   "tipo": "estatuto",
   "numero": "Arts. 437 a 437-2",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 437 a 437-2 — Responsables, no responsables y retención de IVA",
   "resumen": "Define quiénes responden por el IVA y los requisitos para no ser responsable (parágrafo 3: ingresos inferiores a 3.500 UVT, un solo establecimiento, sin franquicia, entre otros). Los arts. 437-1 y 437-2 regulan la retención de IVA (regla general del 15%) y los agentes retenedores: entidades estatales, grandes contribuyentes y pagos a no residentes.",
   "aplica": "Para saber si debe facturar IVA, si le retienen o debe retener IVA, y para tramitar el paso de responsable a no responsable ante la DIAN.",
   "impuestos": [
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "no-residente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "responsables",
    "no responsables",
    "retención de iva",
    "umbrales uvt"
   ],
   "estado": "vigente",
   "nota_vigencia": "La Ley 2010 de 2019 derogó el art. 499 y trasladó los no responsables al parágrafo 3 del art. 437.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_468_476",
   "tipo": "estatuto",
   "numero": "Arts. 468 a 476",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 468 a 476 — Tarifas del IVA y servicios excluidos",
   "resumen": "Tarifas del IVA: general del 19% (art. 468) y del 5% para los bienes y servicios listados (arts. 468-1 y 468-3). El art. 476 enumera los servicios excluidos: salud, educación, transporte público, arrendamiento de vivienda y servicios públicos domiciliarios, entre otros.",
   "aplica": "Para clasificar cada producto o servicio en 19%, 5% o excluido antes de parametrizar la facturación y diligenciar el formulario 300.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "servicios excluidos",
    "tarifa 5%"
   ],
   "estado": "vigente",
   "nota_vigencia": "Tarifa general del 19% desde la Ley 1819 de 2016; el listado del art. 476 fue reorganizado por la Ley 2010 de 2019.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_477_481",
   "tipo": "estatuto",
   "numero": "Arts. 477 a 481",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 477 a 481 — Bienes y servicios exentos de IVA",
   "resumen": "Bienes exentos (tarifa 0% con derecho a impuestos descontables): carnes, leche y huevos, entre otros (art. 477). El art. 481 da tratamiento exento con devolución bimestral a las exportaciones de bienes y servicios. La diferencia con lo excluido es que aquí el IVA pagado en la cadena se recupera.",
   "aplica": "Exportadores y productores de bienes exentos: define si el IVA de sus compras se descuenta y se pide en devolución o se convierte en mayor costo.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "bienes exentos",
    "exportaciones",
    "devoluciones",
    "tarifa cero"
   ],
   "estado": "vigente",
   "nota_vigencia": "Listados ajustados por las Leyes 1819 de 2016 y 2010 de 2019.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_5_364",
   "tipo": "estatuto",
   "numero": "Arts. 5-364",
   "anio": 1989,
   "titulo": "ET Libro Primero (Arts. 5 a 364): impuesto sobre la renta y complementarios",
   "resumen": "Núcleo del impuesto de renta: sujetos, ingresos, costos, deducciones, rentas exentas, tarifas de PJ y PN, dividendos, ganancias ocasionales y régimen especial de las ESAL. Las leyes 1819 de 2016, 2010 de 2019 y 2277 de 2022 reescribieron buena parte del libro (cédulas, tasa mínima, sobretasas).",
   "aplica": "Todo declarante de renta, persona jurídica o natural, residente o no; es la base para liquidar los formularios 110 y 210.",
   "impuestos": [
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "depuracion",
    "tarifas",
    "dividendos",
    "ganancias-ocasionales",
    "esal"
   ],
   "estado": "modificada",
   "nota_vigencia": "La Ley 2277 de 2022 introdujo la tasa mínima del 15% (Art. 240 par. 6), sobretasas sectoriales y una nueva tributación de dividendos.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_512_1_512_22",
   "tipo": "estatuto",
   "numero": "Arts. 512-1 a 512-22",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 512-1 a 512-22 — Impuesto nacional al consumo (INC)",
   "resumen": "Régimen del INC: telefonía móvil, navegación y datos, vehículos y aerodinos, y servicio de restaurantes y bares al 8%. Incluye los no responsables de INC (art. 512-13, ingresos inferiores a 3.500 UVT) y el impuesto a las bolsas plásticas (arts. 512-15 y 512-16). El INC no genera descontables: es mayor costo para quien lo paga.",
   "aplica": "Restaurantes, bares, cafeterías y comercios que entregan bolsas plásticas: define si cobran INC del 8%, si pueden ser no responsables y cómo facturarlo.",
   "impuestos": [
    "inc"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "regimen-simple"
   ],
   "sectores": [
    "comercio",
    "servicios",
    "turismo-hoteles"
   ],
   "temas": [
    "restaurantes y bares",
    "bolsas plásticas",
    "no responsables",
    "tarifa 8%"
   ],
   "estado": "vigente",
   "nota_vigencia": "El INC de bienes inmuebles (art. 512-22) fue declarado inexequible por la Sentencia C-593 de 2019.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_513_1_513_13",
   "tipo": "estatuto",
   "numero": "Arts. 513-1 a 513-13",
   "anio": 1989,
   "titulo": "Impuestos saludables: bebidas azucaradas y ultraprocesados (ET, Arts. 513-1 a 513-13)",
   "resumen": "Impuestos saludables vigentes desde el 1°-nov-2023: uno a bebidas azucaradas ultraprocesadas, con tarifa en pesos por 100 ml según los gramos de azúcar (ajustable anualmente), y otro del 20% desde 2025 a comestibles ultraprocesados con exceso de sodio, azúcares añadidos o grasas saturadas. Son monofásicos.",
   "aplica": "Productores e importadores de bebidas azucaradas y comestibles ultraprocesados; se causa en la primera venta o en la importación. Cobija también a contribuyentes del SIMPLE.",
   "impuestos": [
    "saludables"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "bebidas azucaradas",
    "ultraprocesados",
    "tarifas",
    "monofasico"
   ],
   "estado": "vigente",
   "nota_vigencia": "Avalados por la Corte Constitucional en las Sentencias C-435 de 2023 y C-006 de 2026.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_555_869",
   "tipo": "estatuto",
   "numero": "Arts. 555-869",
   "anio": 1989,
   "titulo": "ET Libro Quinto (Arts. 555 a 869): procedimiento tributario y sanciones",
   "resumen": "Las reglas de juego frente a la DIAN: RUT, deberes formales, sistema de facturación (Art. 616-1), firmeza de las declaraciones (Art. 714), requerimientos y liquidaciones oficiales, régimen sancionatorio (Arts. 634 a 682), recursos, cobro coactivo, devoluciones y la UVT (Art. 868).",
   "aplica": "Todo contribuyente o informante en cualquier actuación ante la DIAN: fiscalización, sanciones, discusión y devoluciones.",
   "impuestos": [
    "procedimiento",
    "facturacion-electronica"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "firmeza",
    "sanciones",
    "fiscalizacion",
    "devoluciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "El Art. 616-1 (sistema de facturación) fue reescrito por la Ley 2155 de 2021; el beneficio de auditoría vive en el Art. 689-3.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_615_618",
   "tipo": "estatuto",
   "numero": "Arts. 615-618",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 615 a 618: obligación de facturar y sistema de facturación",
   "resumen": "Núcleo legal de la facturación: toda persona que venda bienes o preste servicios debe expedir factura (615). El 616-1 define el sistema de facturación (factura electrónica con validación previa, documentos equivalentes y demás documentos electrónicos), el 616-2 los no obligados, el 617 los requisitos y el 618 el deber de exigirla.",
   "aplica": "Todo el que venda bienes o preste servicios en Colombia, sea o no contribuyente, salvo los expresamente exceptuados (art. 616-2 ET y reglamento).",
   "impuestos": [
    "facturacion-electronica",
    "iva",
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "obligacion de facturar",
    "requisitos",
    "validacion previa",
    "pos",
    "no obligados"
   ],
   "estado": "modificada",
   "nota_vigencia": "El art. 616-1 fue reescrito por las Leyes 2010 de 2019 y 2155 de 2021; el art. 616-5 (factura del impuesto de renta) fue derogado por la Ley 2277 de 2022.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_634_640",
   "tipo": "estatuto",
   "numero": "Arts. 634-640",
   "anio": 1989,
   "titulo": "Intereses moratorios y principios del régimen sancionatorio (favorabilidad)",
   "resumen": "Fija los intereses de mora por pago tardío (tasa de usura menos 2 puntos, liquidación diaria) y el art. 640 consagra lesividad, proporcionalidad, gradualidad y favorabilidad: la sanción puede reducirse al 50% o 75% según antecedentes del contribuyente y quién la liquide, y la norma sancionatoria más benigna aplica aun a hechos anteriores.",
   "aplica": "Todo el que liquide sanciones o intereses ante la DIAN: la reducción del art. 640 se aplica directamente en el recibo o la declaración, sin pedir permiso.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "intereses moratorios",
    "favorabilidad",
    "gradualidad",
    "sanciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 640 fue creado por la Ley 1819 de 2016 (art. 282) y es transversal a todas las sanciones tributarias.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_641_650",
   "tipo": "estatuto",
   "numero": "Arts. 641-650",
   "anio": 1989,
   "titulo": "Sanciones sobre declaraciones: extemporaneidad, no declarar, corrección e inexactitud",
   "resumen": "Bloque sancionatorio central: extemporaneidad del 5% del impuesto por mes antes de emplazamiento y 10% después (arts. 641-642), sanción por no declarar (643), sanción de corrección del 10% o 20% (644), aritméticos (646) y la inexactitud (647-648) con tarifa general del 100% de la diferencia y hasta 200% en casos graves como activos omitidos.",
   "aplica": "Cualquier declarante que presente tarde, corrija aumentando impuesto, omita declarar o incluya datos inexactos en declaraciones administradas por la DIAN.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "extemporaneidad",
    "inexactitud",
    "correcciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "Tarifas y conductas de inexactitud redefinidas por la Ley 1819 de 2016; se combinan con las reducciones del art. 640.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_652_657",
   "tipo": "estatuto",
   "numero": "Arts. 652-657",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 652 a 657: sanciones por facturación y clausura",
   "resumen": "Régimen sancionatorio del facturador: 1% del valor de las operaciones por expedir factura sin requisitos (652), sanción por no facturar que puede llegar a clausura (652-1), constancia de no expedición (653) y cierre del establecimiento por tres días por no facturar, facturar sin los requisitos legales o usar sistemas electrónicos que evidencien supresión de ingresos o doble facturación (657).",
   "aplica": "Obligados a facturar que no expidan factura o documento equivalente, lo hagan sin requisitos o usen POS por encima del tope sin expedir factura electrónica.",
   "impuestos": [
    "facturacion-electronica",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "clausura",
    "no facturar",
    "requisitos"
   ],
   "estado": "modificada",
   "nota_vigencia": "El art. 657 (clausura) fue reestructurado por el art. 290 de la Ley 1819 de 2016 y su parágrafo modificado por el art. 111 de la Ley 2010 de 2019; la clausura puede sustituirse por sanción pecuniaria si el contribuyente se acoge y paga la multa (parágrafo 6).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_703_714",
   "tipo": "estatuto",
   "numero": "Arts. 703-714",
   "anio": 1989,
   "titulo": "Requerimiento especial, liquidación de revisión y firmeza de las declaraciones",
   "resumen": "Es la columna del proceso de fiscalización: la DIAN debe notificar requerimiento especial antes de modificar una declaración, el contribuyente tiene 3 meses para responder, y la liquidación de revisión llega dentro de los 6 meses siguientes. El art. 714 fija la firmeza general en 3 años (5 con pérdidas fiscales o precios de transferencia).",
   "aplica": "Todo declarante fiscalizado: define hasta cuándo puede la DIAN cuestionar tu declaración y qué etapas y plazos debe respetar antes de liquidarte oficialmente.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "firmeza",
    "requerimiento especial",
    "fiscalizacion",
    "plazos",
    "liquidacion de revision"
   ],
   "estado": "vigente",
   "nota_vigencia": "Firmeza general de 3 años desde la Ley 1819 de 2016; 5 años para declaraciones con pérdidas según la Ley 2010 de 2019 (art. 117).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_850_865",
   "tipo": "estatuto",
   "numero": "Arts. 850 a 865",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 850 a 865 — Devoluciones y compensaciones de saldos a favor",
   "resumen": "Regula la devolución de saldos a favor de renta e IVA y de pagos en exceso o de lo no debido: solicitud dentro del término de firmeza, devolución dentro de los 50 días siguientes (20 con garantía), rechazo e inadmisión (857), devolución con TIDIS y reconocimiento de intereses cuando la DIAN se demora (863). Incluye la devolución automática para contribuyentes de bajo riesgo.",
   "aplica": "Exportadores, productores de bienes exentos, retenidos en exceso y cualquier contribuyente con saldo a favor en renta o IVA que quiera recuperar su plata.",
   "impuestos": [
    "iva",
    "procedimiento",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "devoluciones",
    "compensaciones",
    "saldos a favor",
    "devolución automática",
    "plazos",
    "tidis"
   ],
   "estado": "vigente",
   "nota_vigencia": "La devolución automática se incorporó al art. 855 con las Leyes 1943 de 2018 y 2010 de 2019 y fue reglamentada por el Decreto 963 de 2020.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_870_881",
   "tipo": "estatuto",
   "numero": "Arts. 870-881",
   "anio": 1989,
   "titulo": "ET Libro Sexto (Arts. 870 a 881): gravamen a los movimientos financieros",
   "resumen": "Regula el 4x1.000 sobre la disposición de recursos en cuentas corrientes, de ahorro y depósitos. El Art. 879 lista las exenciones, incluida la de 350 UVT mensuales que desde dic-2024 puede repartirse entre varias cuentas sin marcar una sola (Art. 881-1). El 50% del GMF pagado es deducible en renta.",
   "aplica": "Usuarios del sistema financiero y cooperativo; los bancos lo recaudan como responsables. La exención de 350 UVT mensuales cobija cuentas de personas naturales.",
   "impuestos": [
    "gmf"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "4x1000",
    "exenciones",
    "sistema-financiero",
    "deducibilidad",
    "sistema financiero"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por la Ley 2277 de 2022 en la operación de la exención de 350 UVT (Art. 879 num. 1).",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_9_10",
   "tipo": "estatuto",
   "numero": "Arts. 9-10",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 9 y 10 — Residencia fiscal de las personas naturales",
   "resumen": "Define quién es residente fiscal: permanencia de más de 183 días (continuos o discontinuos) en cualquier lapso de 365, criterio que aplica a nacionales y extranjeros. Para nacionales colombianos hay criterios adicionales: cónyuge o hijos dependientes residentes en el país, o el 50% de sus ingresos, activos o bienes en Colombia. El residente tributa sobre renta mundial y patrimonio global; el no residente, solo…",
   "aplica": "Colombianos en el exterior, extranjeros que pasan temporadas largas en el país y cualquier persona que deba definir si declara renta mundial.",
   "impuestos": [
    "renta-pn",
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "residencia fiscal",
    "183 dias",
    "renta mundial",
    "no residentes"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto vigente desde la Ley 1607 de 2012; los convenios para evitar la doble imposición pueden alterar el resultado caso a caso.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_903_916",
   "tipo": "estatuto",
   "numero": "Arts. 903-916",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Libro VIII: impuesto unificado bajo el Régimen Simple de Tributación (SIMPLE)",
   "resumen": "Regula el régimen simple de tributación. En materia de plazos exige una declaración anual consolidada con calendario propio y anticipos bimestrales obligatorios mediante recibo electrónico (art. 910), distintos de la declaración de IVA anual del SIMPLE. Las fechas concretas las desarrolla el reglamento (hoy Decreto 2229 de 2023).",
   "aplica": "Personas naturales y jurídicas inscritas en el RST: deben cumplir el anticipo bimestral además de la declaración anual.",
   "impuestos": [
    "rst",
    "renta-pj",
    "renta-pn",
    "iva",
    "inc"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "requisitos",
    "anticipos",
    "base gravable",
    "exclusiones",
    "simple"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sustituido por la Ley 2010 de 2019 y retocado por las Leyes 2155 de 2021 y 2277 de 2022; la Sentencia C-540 de 2023 tumbó apartes de los arts. 905 y 908 y revivió las tarifas de la Ley 2155.",
   "importancia": "clave",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_079_2026",
   "tipo": "sentencia",
   "numero": "C-079",
   "anio": 2026,
   "titulo": "Sentencia C-079 de 2026 — Caída del paquete tributario de la emergencia y devoluciones",
   "resumen": "Declaró inexequible el Decreto Legislativo 1474 de 2025 y, con él, todo el paquete tributario de la emergencia. Ordenó que esos impuestos no se declaren, liquiden ni cobren, y que la DIAN devuelva lo pagado a quien demuestre el pago efectivo, aplicando los mecanismos legales existentes.",
   "aplica": "Contribuyentes que alcanzaron a pagar tributos del Decreto 1474 de 2025 (patrimonio ampliado, IVA a juegos online, hidrocarburos): tienen derecho a devolución.",
   "impuestos": [
    "patrimonio",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "inexequibilidad",
    "devoluciones",
    "emergencia economica"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/comunicados/Comunicado-15-Abril-15-de-2026.pdf"
  },
  {
   "id": "concepto_dian_002687_2025",
   "tipo": "concepto",
   "numero": "002687 (int. 303)",
   "anio": 2025,
   "titulo": "Concepto General DIAN 002687 de 2025 – Impuesto de timbre por el Decreto Legislativo 0175 de 2025",
   "resumen": "Fijó cómo operó el timbre del 1% reactivado por el Decreto 0175 de 2025: causación, contratos de cuantía indeterminada, documentos otorgados antes del 22-feb-2025 y aplicación en el tiempo de la nueva tarifa. Varias de sus tesis fueron reconsideradas o adicionadas por conceptos posteriores durante 2025.",
   "aplica": "Referencia para revisar contratos y pagos de 2025 sujetos al timbre del 1% y para atender fiscalizaciones sobre ese periodo.",
   "impuestos": [
    "timbre",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "timbre",
    "causacion",
    "cuantia indeterminada",
    "conmocion interior"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado y parcialmente reconsiderado por conceptos de 2025 (entre ellos 004803 y 009085); la tarifa del 1% solo rigió hasta el 31-dic-2025.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_2687_2025.htm",
   "url_alt": "https://www.dian.gov.co/Contribuyentes-Plus/Documents/7-CONCEPTO-002687-int-303-05032025.pdf"
  },
  {
   "id": "decreto_0771_2025",
   "tipo": "decreto",
   "numero": "0771",
   "anio": 2025,
   "titulo": "Decreto 0771 de 2025 — Interés presunto 2025 y componente inflacionario AG 2024",
   "resumen": "Fija el rendimiento mínimo presunto del 9,25% anual para préstamos en dinero entre sociedades y sus socios durante 2025, y los porcentajes del componente inflacionario del AG 2024: el 50,88% de los rendimientos financieros de personas naturales no obligadas a llevar contabilidad no constituye renta ni ganancia ocasional.",
   "aplica": "Declaraciones de renta AG 2024 y AG 2025: sociedades con préstamos de o hacia socios y personas naturales sin contabilidad con rendimientos o gastos financieros.",
   "impuestos": [
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "interes presunto",
    "componente inflacionario",
    "prestamos socios",
    "rendimientos financieros"
   ],
   "estado": "vigente",
   "nota_vigencia": "Decreto anual: aplica al AG 2024 (componente inflacionario) y al año 2025 (interés presunto); el periodo siguiente lo fija un nuevo decreto.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0771_2025.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=260699"
  },
  {
   "id": "decreto_1474_2025",
   "tipo": "decreto",
   "numero": "1474",
   "anio": 2025,
   "titulo": "Decreto Legislativo 1474 de 2025 — Medidas tributarias de la emergencia económica (inexequible)",
   "resumen": "Paquete tributario de la emergencia económica de dic-2025: bajaba el umbral del impuesto al patrimonio a 40.000 UVT (alrededor de $2.000 millones) con tarifas marginales de hasta 5%, gravaba con IVA del 19% los juegos en línea, creaba un impuesto del 1% a la extracción de hidrocarburos y carbón y subía tributos a licores y cigarrillos. La Corte lo tumbó completo.",
   "aplica": "Ninguna obligación es exigible hoy: la DIAN no puede cobrar esos tributos y debe devolver lo pagado a quien acredite el pago efectivo.",
   "impuestos": [
    "iva",
    "inc",
    "patrimonio",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "emergencia económica",
    "iva licores",
    "juegos de azar online",
    "devoluciones",
    "emergencia economica",
    "inexequibilidad"
   ],
   "estado": "derogada",
   "nota_vigencia": "Declarado inexequible en su totalidad por la Sentencia C-079 del 15 de abril de 2026, tras la caída de la emergencia económica (Sentencia C-075 de 2026 sobre el Decreto 1390 de 2025); la Corte ordenó a la DIAN devolver lo recaudado durante su vigencia.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%201474%20DEL%2029%20DE%20DICIEMBRE%20DE%202025.pdf"
  },
  {
   "id": "resolucion_dian_000202_2025",
   "tipo": "resolucion",
   "numero": "000202",
   "anio": 2025,
   "titulo": "Resolución DIAN 000202 de 2025 - Datos del comprador y facturación en sitio de servicios públicos",
   "resumen": "Modificación de la Resolución 000165 de 2023: limita los datos exigibles al comprador que pide factura a su nombre (nombre o razón social, tipo y número de identificación y correo electrónico), da hasta 48 horas a las empresas de servicios públicos domiciliarios para generar y transmitir el documento equivalente electrónico cuando facturan en sitio con dificultades técnicas, y restringe el documento equivalente…",
   "aplica": "Todos los facturadores electrónicos en cuanto a los datos que el cajero puede pedirle al cliente; las reglas de facturación en sitio y de cobros aplican a las empresas de servicios públicos domiciliarios.",
   "impuestos": [
    "facturacion-electronica",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "datos del comprador",
    "plazos",
    "habeas data",
    "servicios publicos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 000165 de 2023; posteriormente la Resolución Única DIAN 000227 del 23 de septiembre de 2025 compiló el marco del sistema de facturación en su Título 5.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0202_2025.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000204_2025",
   "tipo": "resolucion",
   "numero": "000204",
   "anio": 2025,
   "titulo": "Resolución DIAN 000204 de 2025 - Especificaciones técnicas de la exógena cambiaria",
   "resumen": "Adicionó la Parte 2 a la Resolución 000180 de 2024 con las especificaciones técnicas de nueve formatos de exógena cambiaria (importaciones, exportaciones, endeudamiento externo, servicios y ausencia de operaciones), de presentación trimestral con calendario escalonado. Derogó las Resoluciones 000161 de 2021 y 000494 de 2022.",
   "aplica": "Define los archivos XML, formatos y plazos trimestrales que IMC y titulares de cuentas de compensación deben cumplir hoy al reportar información cambiaria a la DIAN.",
   "impuestos": [
    "cambiario",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "informacion exogena cambiaria",
    "formatos",
    "plazos",
    "cuentas de compensacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Los plazos del calendario que introdujo (artículo 2.2.5 de la Resolución 000180 de 2024) fueron prorrogados por la Resolución DIAN 000230 de 2025: la información hasta el primer trimestre de 2026 venció en enero y abril de 2026, y desde el segundo trimestre de 2026 se retoma el calendario trimestral",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0204_2025.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000233_2025",
   "tipo": "resolucion",
   "numero": "000233",
   "anio": 2025,
   "titulo": "Resolución DIAN 000233 de 2025 – ajustes a la exógena dentro de la Resolución Única",
   "resumen": "Expedida el 30 de octubre de 2025, ajustó el Título 3 de la Resolución Única: depuración de información, racionalización de reportes y cambios de formatos. La mayoría de ajustes aplica al AG2025 que se entrega en 2026 y otros solo desde el AG2026. Un error formal de su art. 3 fue corregido por la Resolución 000237 de 2025.",
   "aplica": "Reportantes de exógena AG2025 y AG2026: confirma qué versión de cada formato te corresponde antes de armar los XML.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "exogena",
    "formatos",
    "plazos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Corregida por la Resolución 000237 de 2025; parte de sus cambios solo rige desde el año gravable 2026.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0233_2025.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000246_2025",
   "tipo": "resolucion",
   "numero": "000246",
   "anio": 2025,
   "titulo": "Resolución DIAN 000246 de 2025 — Amplía obligados al formato 2516 (AG2025)",
   "resumen": "Amplía los obligados al reporte de conciliación fiscal (formato 2516 v9) desde el año gravable 2025: quienes consoliden o combinen estados financieros de filiales o subsidiarias, o estén inscritos como grupo empresarial o en situación de control, lo presentan sin importar su nivel de ingresos.",
   "aplica": "Matrices y controlantes que consolidan estados financieros, además de las PJ con ingresos brutos fiscales ≥45.000 UVT; se presenta antes de la declaración de renta.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "formato 2516",
    "conciliacion fiscal",
    "grupos empresariales",
    "tasa minima"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 000227 de 2025; busca controlar la tasa mínima de tributación en grupos.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0246_2025.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_431_2025",
   "tipo": "sentencia",
   "numero": "C-431",
   "anio": 2025,
   "titulo": "Sentencia C-431 de 2025 — Exequibilidad condicionada de los tributos de la conmoción interior",
   "resumen": "Avaló los tributos del Decreto 175 de 2025 (timbre al 1%, IVA del 19% a juegos de azar online e impuesto especial a hidrocarburos y carbón), pero declaró inexequible el parágrafo 5 del art. 1, limitó el recaudo a los gastos de la conmoción avalados en la C-381 de 2025 y ordenó devolver a prorrata los excesos recaudados.",
   "aplica": "Quienes pagaron timbre o IVA de juegos online en 2025: define la validez de esos tributos y abre la puerta a devoluciones de excesos.",
   "impuestos": [
    "timbre",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "conmocion interior",
    "control constitucional",
    "devoluciones",
    "timbre"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2025/c-431-25.htm"
  },
  {
   "id": "sentencia_ce_28920_2025",
   "tipo": "sentencia",
   "numero": "28920",
   "anio": 2025,
   "titulo": "Providencia 28920 de 2025, Consejo de Estado – Suspensión parcial del concepto DIAN de tasa mínima (TTD)",
   "resumen": "Al resolver la súplica sobre el Concepto 202 (006038) de 2024, levantó la suspensión del numeral 12 pero mantuvo suspendido el numeral 20: el impuesto a adicionar (IA) de la tasa mínima no integra el impuesto básico de renta para calcular los dividendos no gravados del art. 49 ET, pues ello carece de sustento legal.",
   "aplica": "Sociedades que calculan utilidades susceptibles de distribuirse como no gravadas: no deben sumar el IA al impuesto básico del art. 49.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tasa minima",
    "dividendos",
    "suspension provisional",
    "articulo 49"
   ],
   "estado": "vigente",
   "nota_vigencia": "Providencia del 3 de julio de 2025; es una medida cautelar mientras se decide de fondo la nulidad del concepto.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/11001-03-27-000-2024-00037-00(28920)_20250703.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_004637_2024",
   "tipo": "concepto",
   "numero": "004637 (int. 154)",
   "anio": 2024,
   "titulo": "Concepto DIAN 004637 de 2024 – Efectos de la sentencia C-540 de 2023 en el régimen SIMPLE (4ª adición)",
   "resumen": "Aterrizó los efectos de la C-540 de 2023 en el SIMPLE: las profesiones liberales y los servicios de consultoría y científicos regresan al tope general de 100.000 UVT y a las tarifas revividas de la Ley 2155 de 2021, y precisa la situación de quienes habían salido del régimen por el tope de 12.000 UVT.",
   "aplica": "Profesionales independientes y firmas de servicios que evalúan entrar o permanecer en el SIMPLE desde el año gravable 2023.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "independiente",
    "persona-natural"
   ],
   "sectores": [
    "servicios"
   ],
   "temas": [
    "simple",
    "profesiones liberales",
    "tarifas",
    "sujetos pasivos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Desarrolla la sentencia C-540 de 2023, que revivió las tarifas del art. 42 de la Ley 2155 de 2021 para servicios profesionales.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_4637_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_016291_2024",
   "tipo": "concepto",
   "numero": "016291 (int. 713)",
   "anio": 2024,
   "titulo": "Concepto DIAN 016291 de 2024 – Presencia económica significativa (15ª adición al Concepto General de renta PJ)",
   "resumen": "Adición dedicada a la presencia económica significativa (PES): qué significa mostrar precios en pesos colombianos en plataformas digitales (sitios web o aplicaciones visibles para clientes en Colombia) y cómo se suman los umbrales de ingresos y de clientes entre vinculados ('de manera agregada') para establecer si un no residente queda sujeto al impuesto sobre la renta por PES, evitando la fragmentación…",
   "aplica": "Plataformas y vendedores del exterior con clientes en Colombia, y asesores que evalúan si un no residente quedó cubierto por PES.",
   "impuestos": [
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "no-residente",
    "persona-juridica"
   ],
   "sectores": [
    "tecnologia"
   ],
   "temas": [
    "pes",
    "economia digital",
    "no residentes",
    "umbrales"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_16291_2024.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_0047_2024",
   "tipo": "decreto",
   "numero": "0047",
   "anio": 2024,
   "titulo": "Decreto 0047 de 2024 — Plan de internacionalización y anual de ventas de zonas francas",
   "resumen": "Reglamenta el parágrafo 6 del art. 240-1 del ET: define cómo los usuarios industriales acuerdan con MinCIT el plan de internacionalización y anual de ventas con topes de ingresos en el territorio nacional, condición para liquidar renta con la tarifa mixta 20%/35%. Para 2025 en adelante, el plan se solicita a más tardar el 30 de septiembre del año anterior.",
   "aplica": "Usuarios industriales de zona franca que quieran conservar la tarifa preferencial del 20% sobre sus ingresos por exportaciones.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "plan de internacionalizacion",
    "plazos",
    "tarifas"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0047_2024.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=228510"
  },
  {
   "id": "resolucion_dian_000031_2024",
   "tipo": "resolucion",
   "numero": "000031",
   "anio": 2024,
   "titulo": "Resolución DIAN 000031 de 2024 — Prescribe el formulario 350 de retenciones en la fuente",
   "resumen": "Adopta el formulario 350 que rige desde el 1 de agosto de 2024 para declarar mensualmente retenciones y autorretenciones. Novedades: separa las retenciones practicadas a personas naturales y jurídicas, desagrega casillas para hidrocarburos, carbón y demás productos mineros, e incorpora la retención a contribuyentes con presencia económica significativa.",
   "aplica": "Todo agente retenedor o autorretenedor obligado a presentar la declaración mensual de retenciones; el diligenciamiento sigue el instructivo de esta resolución.",
   "impuestos": [
    "retefuente",
    "autorretencion",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "formulario 350",
    "declaracion mensual",
    "casillas",
    "pes"
   ],
   "estado": "vigente",
   "nota_vigencia": "La DIAN mantuvo esta misma versión del formulario para los periodos 2025 y siguientes.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0031_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000044_2024",
   "tipo": "resolucion",
   "numero": "000044",
   "anio": 2024,
   "titulo": "Resolución DIAN 000044 de 2024 — Prescribe el formulario 210 para el año gravable 2023 y siguientes",
   "resumen": "Adopta el formulario 210 de declaración de renta de personas naturales residentes y sucesiones ilíquidas de causantes residentes, con sus casillas e instructivo, aplicable desde el año gravable 2023 en adelante. La DIAN dispone el formulario en forma virtual en su página web para diligenciamiento y presentación electrónica.",
   "aplica": "Personas naturales residentes que declaran en el formulario 210, incluido el año gravable 2025 que vence entre agosto y octubre de 2026.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "formulario 210",
    "prescripcion de formularios",
    "instructivo"
   ],
   "estado": "modificada",
   "nota_vigencia": "Instructivo ajustado por la Resolución DIAN 000120 de 2024 (cálculo del límite del 40% con rentas de capital y no laborales); posteriormente compilada en la Resolución DIAN 227 de 2025.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0044_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000081_2024",
   "tipo": "resolucion",
   "numero": "000081",
   "anio": 2024,
   "titulo": "Resolución DIAN 000081 de 2024: formulario 2593 de anticipos bimestrales del SIMPLE",
   "resumen": "Prescribió el formulario 2593 'Recibo electrónico SIMPLE' para liquidar y pagar los anticipos bimestrales del régimen desde el año gravable 2024, ya ajustado a los efectos de la Sentencia C-540 de 2023 (tarifas revividas de la Ley 2155) y a la exención de anticipos para ingresos inferiores a 3.500 UVT.",
   "aplica": "Contribuyentes del SIMPLE obligados a liquidar anticipos bimestrales; se diligencia y paga electrónicamente en el MUISCA dentro de los plazos del DUR.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "formularios",
    "anticipos",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Aplica para los anticipos del año gravable 2024 y siguientes.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0081_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000187_2024",
   "tipo": "resolucion",
   "numero": "000187",
   "anio": 2024,
   "titulo": "Resolución DIAN 000187 de 2024: formulario 260 de declaración anual del SIMPLE",
   "resumen": "Prescribió el formulario 260 'Declaración anual consolidada' del SIMPLE para el año gravable 2024 y siguientes. Incorpora la situación de quienes quedaron exentos de anticipos por ingresos inferiores a 3.500 UVT, una sección para la fracción de año siguiente y campos estadísticos de género.",
   "aplica": "Todos los contribuyentes del SIMPLE presentan en este formulario su declaración anual consolidada del impuesto unificado, con el IVA anual cuando corresponda.",
   "impuestos": [
    "rst",
    "iva"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "formularios",
    "declaracion anual",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Aplica para la declaración anual del año gravable 2024 y siguientes.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0187_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000188_2024",
   "tipo": "resolucion",
   "numero": "000188",
   "anio": 2024,
   "titulo": "Resolución DIAN 000188 de 2024 — Ajustes a la exógena para el año gravable 2025",
   "resumen": "Modificó la Resolución 000162 de 2023 de cara al AG2025: sumó reportantes nuevos (por ejemplo, quienes vendan acciones no listadas en bolsa por más de 5.000 UVT al año), ajustó formatos de pagos, donaciones e inversiones y alineó los vencimientos al esquema de días hábiles. Su texto vive hoy dentro de la Resolución Única.",
   "aplica": "Reportantes de exógena del AG2025, que se entrega en 2026; consulta las reglas ya compiladas en la Resolución Única 000227 de 2025.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "uvt",
    "obligados",
    "plazos",
    "formatos",
    "exogena"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sus ajustes quedaron incorporados en la Resolución Única 000227 de 2025.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0188_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000193_2024",
   "tipo": "resolucion",
   "numero": "000193",
   "anio": 2024,
   "titulo": "Resolución DIAN 000193 de 2024 – UVT del año 2025: $49.799",
   "resumen": "Fijó la UVT de 2025 en $49.799, aplicando la variación del IPC de ingresos medios certificada por el DANE (5,81%). Sigue siendo cifra de referencia en 2026: con la UVT de 2025 se miden los topes para declarar renta de personas naturales del AG2025, la sanción mínima de ese año y las bases expresadas en UVT de 2025.",
   "aplica": "Cifras del AG2025: con esta UVT se calculan los topes de la renta de personas naturales que se presenta entre agosto y octubre de 2026.",
   "impuestos": [
    "procedimiento",
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "uvt",
    "parametros",
    "topes"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Compilada como artículo 1.2.2 de la Resolución Única 000227 de 2025; el valor de $49.799 sigue siendo la UVT aplicable a las cifras del año gravable 2025 (la UVT 2026 se fijó modificando la Resolución Única con la Resolución 000238 de 2025).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0193_2024.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000193%20de%2004-12-2024.pdf"
  },
  {
   "id": "resolucion_dian_000200_2024",
   "tipo": "resolucion",
   "numero": "000200",
   "anio": 2024,
   "titulo": "Resolución DIAN 000200 de 2024 — Calificación de grandes contribuyentes para 2025 y 2026",
   "resumen": "Califica los grandes contribuyentes para los años 2025 y 2026 según los criterios de la Resolución 1253 de 2022. De esa calidad dependen los plazos especiales de renta y exógena del Decreto 2229 de 2023 y la condición de agente de retención de IVA del artículo 437-2 numeral 1 del ET. La Resolución 248 de 2025 ajustó el listado.",
   "aplica": "Entidades calificadas como grandes contribuyentes y quienes les facturan (retención de IVA); marca el calendario de cuotas de renta y de exógena GC.",
   "impuestos": [
    "renta-pj",
    "iva",
    "retefuente",
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "gran-contribuyente",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "grandes contribuyentes",
    "calificacion",
    "reteiva",
    "plazos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por la Resolución 000248 del 31 de diciembre de 2025, que retiró y agregó entidades al listado para 2026.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0200_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_001328_2023",
   "tipo": "concepto",
   "numero": "001328 (int. 165)",
   "anio": 2023,
   "titulo": "Concepto General DIAN 001328 de 2023 – Procedimiento tributario y aduanero con motivo de la Ley 2277 de 2022",
   "resumen": "Resolvió las dudas de procedimiento que dejó la reforma: tasa de interés moratoria reducida, reducción transitoria de sanciones, saneamiento de declaraciones de retención ineficaces y de IVA presentadas en periodo equivocado, y la nueva sanción de exógena del art. 651 ET con aplicación del principio de favorabilidad.",
   "aplica": "Defensa del contribuyente en sanciones, intereses y saneamiento de declaraciones; clave al liquidar sanciones de exógena con favorabilidad.",
   "impuestos": [
    "procedimiento",
    "retefuente",
    "iva",
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "favorabilidad",
    "ineficacia",
    "intereses moratorios"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado durante 2023 por conceptos posteriores (entre ellos 003206, 003896 y 006300). Varias tesis se refieren a beneficios transitorios de la Ley 2277 que vencieron el 30-jun-2023; el resto sigue siendo doctrina aplicable.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1328_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_003966_2023",
   "tipo": "concepto",
   "numero": "003966 (int. 416)",
   "anio": 2023,
   "titulo": "Concepto General DIAN 003966 [416] de 2023 — Renta de personas naturales con motivo de la Ley 2277 de 2022",
   "resumen": "Doctrina oficial unificada sobre los cambios de la Ley 2277 en renta PN: cómo opera el límite de 1.340 UVT, el techo del 25% exento, la deducción por dependientes, la tributación de dividendos con el descuento del 19% y la depuración de la base de retención. Ha recibido varias adiciones que resuelven casos puntuales.",
   "aplica": "Contadores y declarantes que necesiten la posición vinculante de la DIAN al aplicar la reforma de 2022 en declaraciones desde el año gravable 2023.",
   "impuestos": [
    "renta-pn",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "independiente",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "doctrina dian",
    "limite 40%",
    "dividendos",
    "dependientes",
    "doctrina",
    "rentas de trabajo"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado en varias oportunidades; la quinta adición es el Concepto 152 del 5 de marzo de 2024 (deducción por dependientes y retención sobre rentas de trabajo no laborales).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_3966_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_006363_2023",
   "tipo": "concepto",
   "numero": "006363 (int. 618)",
   "anio": 2023,
   "titulo": "Concepto General DIAN 006363 de 2023 — Renta PJ tras la Ley 2277",
   "resumen": "Concepto general de la DIAN sobre el impuesto de renta de personas jurídicas con motivo de la Ley 2277 de 2022: sede efectiva de administración, presencia económica significativa, deducciones, descuentos, puntos adicionales de tarifa y tasa mínima de tributación. Doctrina base desde 2023.",
   "aplica": "Contadores y PJ que necesiten la posición oficial de la DIAN sobre cómo aplicar los cambios de la reforma de 2022 en la liquidación de renta.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "tasa minima",
    "sede efectiva",
    "deducciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado y aclarado por conceptos posteriores, entre ellos el 6038 de 2024 sobre tasa mínima y anticipo.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_6363_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_006365_2023",
   "tipo": "concepto",
   "numero": "006365 (int. 619)",
   "anio": 2023,
   "titulo": "Concepto General DIAN 006365 de 2023 – Impuesto al patrimonio creado por la Ley 2277 de 2022",
   "resumen": "Doctrina general del impuesto al patrimonio permanente: hecho generador (patrimonio líquido igual o superior a 72.000 UVT al 1 de enero), sujetos pasivos incluyendo no residentes y entidades extranjeras con bienes en Colombia, base gravable, regla especial de valoración de acciones y exclusión de las primeras 12.000 UVT de la vivienda de habitación.",
   "aplica": "Personas naturales y estructuras del exterior que deben evaluar cada enero si superan el umbral y cómo valorar sus activos.",
   "impuestos": [
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "patrimonio",
    "base gravable",
    "valoracion de acciones",
    "no residentes"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por los Conceptos 008692 y 010268 de 2023; sigue siendo la doctrina base del impuesto al patrimonio de la Ley 2277 de 2022.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_6365_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_131_2023",
   "tipo": "concepto",
   "numero": "100208192-131",
   "anio": 2023,
   "titulo": "Concepto General DIAN 100208192-131 de 2023: el SIMPLE tras la Ley 2277 de 2022",
   "resumen": "Doctrina oficial marco sobre los cambios de la Ley 2277 de 2022 al SIMPLE: desde qué año aplicaban los nuevos topes y tarifas, con qué UVT se medía el límite de 12.000 UVT para profesiones liberales y cómo se computan los ingresos brutos. Ha recibido varias adiciones, incluida una cuarta en marzo de 2024.",
   "aplica": "Guía de interpretación para contadores y contribuyentes del SIMPLE; debe leerse junto con la C-540 de 2023, que dejó sin efecto el tope de 12.000 UVT que el concepto explicaba.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "tarifas",
    "tope de ingresos",
    "vigencias"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado en varias oportunidades (p. ej. Oficio 100208192-154 de 2024); los apartes sobre el límite de 12.000 UVT perdieron base por la Sentencia C-540 de 2023.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_0977_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_1328_2023",
   "tipo": "concepto",
   "numero": "1328",
   "anio": 2023,
   "titulo": "Concepto General DIAN 1328 (int. 165) de 2023 — Procedimiento tributario tras la Ley 2277 de 2022",
   "resumen": "Concepto general de procedimiento tributario expedido tras la Ley 2277 de 2022. En exógena aclara que las multas más bajas del nuevo artículo 651 se aplican, por favorabilidad, a faltas cometidas antes del 13 de diciembre de 2022, salvo situaciones jurídicas consolidadas, y desarrolla la reducción transitoria que venció el 1 de abril de 2023.",
   "aplica": "Reportantes con sanciones del artículo 651 en curso o por autoliquidar respecto de periodos anteriores a la reforma de 2022.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "favorabilidad",
    "sanciones",
    "doctrina dian"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado y aclarado por los Conceptos DIAN 3206, 3896, 6300 y 7087 de 2023; verificar la doctrina posterior sobre el punto concreto antes de citarlo.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1328_2023.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_3744_2023",
   "tipo": "concepto",
   "numero": "3744 (int. 383)",
   "anio": 2023,
   "titulo": "Concepto DIAN 3744 de 2023 — Concepto general de los impuestos saludables",
   "resumen": "Concepto general de los impuestos saludables: precisa responsables, hecho generador monofásico, base gravable, manejo de donaciones y retiros, exportaciones no gravadas y cómo leer la información nutricional para saber si un producto queda gravado. Ha recibido varias adiciones desde 2023.",
   "aplica": "Productores, importadores y comercializadores de bebidas azucaradas y ultraprocesados que deban clasificar su portafolio frente al impuesto.",
   "impuestos": [
    "saludables"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "base gravable",
    "responsables",
    "ultraprocesados"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado en varias oportunidades, entre ellas el Concepto 6482 (int. 217) de 2024.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_3744_2023.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1103_2023",
   "tipo": "decreto",
   "numero": "1103",
   "anio": 2023,
   "titulo": "Decreto 1103 de 2023 – Reglamentación de la tributación de dividendos tras la Ley 2277 de 2022",
   "resumen": "Reglamentó parcialmente los arts. 242, 242-1, 245 y 246 ET, modificados por la Ley 2277, armonizando el tratamiento de los dividendos distribuidos desde 2023: retención en la fuente para personas naturales residentes según el nuevo régimen, tarifa del 20% para no residentes, retención trasladable del 10% para sociedades nacionales (imputable al beneficiario final) y transición para utilidades de 2016 y anteriores.",
   "aplica": "Sociedades que decretan dividendos y socios que los reciben: define la retención aplicable según el año de las utilidades y el tipo de socio.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "dividendos",
    "retencion trasladable",
    "tarifas",
    "transicion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1103_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=213810"
  },
  {
   "id": "decreto_2231_2023",
   "tipo": "decreto",
   "numero": "2231",
   "anio": 2023,
   "titulo": "Decreto 2231 de 2023 — Reglamento de retención y depuración de rentas de trabajo tras la Ley 2277",
   "resumen": "Reglamenta los arts. 206, 331, 336 y 383 ET reformados: el independiente que declara por escrito y bajo juramento que no imputará costos ni deducciones puede pedir la tabla del art. 383 y el 25% exento; si solicita costos, se le retiene con las tarifas de los arts. 392 y 401. También aterriza la deducción por dependientes (72 UVT) en la retención mensual.",
   "aplica": "Pagadores de honorarios y servicios personales a personas naturales, y contratistas independientes que eligen su esquema de retención en cada cuenta de cobro.",
   "impuestos": [
    "retefuente",
    "renta-pn"
   ],
   "perfiles": [
    "independiente",
    "empleador",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "retencion en la fuente",
    "independientes",
    "costos y gastos",
    "dependientes",
    "rentas de trabajo",
    "juramento"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica y sustituye artículos del DUR 1625 de 2016; rige desde su publicación en el Diario Oficial el 22 de diciembre de 2023.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2231_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=227330"
  },
  {
   "id": "sentencia_c_384_2023",
   "tipo": "sentencia",
   "numero": "C-384",
   "anio": 2023,
   "titulo": "Sentencia C-384 de 2023 — Tarifa de zonas francas condicionada",
   "resumen": "Exequibilidad condicionada de la tarifa mixta de zonas francas (art. 11, Ley 2277): el esquema 20%/35% atado al plan de internacionalización no puede aplicarse a usuarios que ya habían cumplido las condiciones de la tarifa del 20% antes del 13 de diciembre de 2022, por confianza legítima.",
   "aplica": "Usuarios industriales de zona franca calificados antes del 13-dic-2022: conservan la tarifa del 20% sobre la totalidad de su renta gravable.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "tarifas",
    "confianza legitima"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-384_2023.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2023/c-384-23.htm"
  },
  {
   "id": "sentencia_c489_2023",
   "tipo": "sentencia",
   "numero": "C-489",
   "anio": 2023,
   "titulo": "Sentencia C-489 de 2023 — Deducibilidad de regalías en renta",
   "resumen": "Declaró inexequible el parágrafo 1 del Art. 19 de la Ley 2277 de 2022, que prohibía deducir las regalías pagadas por explotar recursos naturales no renovables: gravar un gasto como si fuera utilidad viola la equidad tributaria y discrimina entre regalías en dinero y en especie. Las regalías volvieron a ser deducibles.",
   "aplica": "Empresas extractivas (petróleo, gas, minería) que pagan regalías por recursos no renovables; rige desde su expedición en noviembre de 2023.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "regalias",
    "deducciones",
    "equidad-tributaria"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sus efectos fueron suspendidos temporalmente en 2024 mientras se estudiaba un incidente de impacto fiscal que la Corte negó en junio de 2024; la sentencia quedó en firme.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-489_2023.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30050350"
  },
  {
   "id": "sentencia_c540_2023",
   "tipo": "sentencia",
   "numero": "C-540",
   "anio": 2023,
   "titulo": "Sentencia C-540 de 2023 — Topes y tarifas del SIMPLE para profesiones liberales",
   "resumen": "Tumbó el tope de 12.000 UVT y las tarifas más gravosas que la Ley 2277 de 2022 impuso en el régimen SIMPLE a los servicios profesionales, de consultoría y científicos, por trato desigual frente a educación y salud, que conservaban 100.000 UVT. Estos contribuyentes recuperaron el tope general y las tarifas de la Ley 2155.",
   "aplica": "Profesionales independientes y firmas de servicios profesionales inscritas o aspirantes al régimen SIMPLE.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "independiente",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [
    "servicios"
   ],
   "temas": [
    "simple",
    "igualdad",
    "tarifas"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-540_2023.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30050542"
  },
  {
   "id": "sentencia_ce_26924_2023",
   "tipo": "sentencia",
   "numero": "26924",
   "anio": 2023,
   "titulo": "Sentencia 26924 de 2023, Consejo de Estado – No todo error en exógena es sancionable",
   "resumen": "Cambió la regla en sanciones de exógena: no todo error al reportar genera sanción. Solo los errores de contenido que dañen a la administración o a terceros, o que obstaculicen la fiscalización, justifican la sanción del art. 651 ET; las inconsistencias formales se analizan caso a caso bajo lesividad y proporcionalidad.",
   "aplica": "Defensa frente a pliegos de cargos por errores en información exógena: exige a la DIAN demostrar el daño antes de sancionar.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "exogena",
    "lesividad",
    "proporcionalidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sección Cuarta, sentencia del 9 de marzo de 2023; retomó la doctrina anterior a 2016 sobre errores no lesivos.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/25000-23-37-000-2019-00801-01(26924)_20230309.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_0086_2022",
   "tipo": "concepto",
   "numero": "0086",
   "anio": 2022,
   "titulo": "Concepto General Unificado DIAN 0086 (907919) de 2022 - Régimen sancionatorio cambiario",
   "resumen": "Concepto general unificado de la DIAN sobre el régimen sancionatorio y el procedimiento cambiario del Decreto-Ley 2245 de 2011: definiciones, responsabilidad objetiva, infracciones por declaración de cambio, importaciones, exportaciones y cuentas de compensación, prescripción, sanción reducida y recursos.",
   "aplica": "Primera fuente doctrinal para preparar respuestas a requerimientos, actos de formulación de cargos o resoluciones sancionatorias cambiarias de la DIAN.",
   "impuestos": [
    "cambiario",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "sanciones",
    "procedimiento",
    "cuentas de compensacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por el Oficio DIAN 1553 de 2023 (cobro de las obligaciones cambiarias) y por el Oficio DIAN 14400 de 2025 (uniones temporales como sujetos sancionables). Su expedición revocó pronunciamientos doctrinales cambiarios anteriores, entre ellos el Oficio 904510 de 2021.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/concepto_cambiario_dian_0000086_2022.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000085_2022",
   "tipo": "resolucion",
   "numero": "000085",
   "anio": 2022,
   "titulo": "Resolución DIAN 000085 de 2022 - RADIAN: registro de la factura electrónica como título valor",
   "resumen": "Desarrolla el RADIAN, registro donde se inscriben y consultan los eventos de la factura electrónica título valor: aceptación, endoso, mandato, pago, limitaciones. Expide su anexo técnico y establece que la transferencia de los derechos económicos solo surte efectos cuando la operación queda registrada.",
   "aplica": "Tenedores, endosantes y compradores de facturas (factoring), proveedores tecnológicos y sistemas de negociación: sin registro en RADIAN no hay circulación válida.",
   "impuestos": [
    "facturacion-electronica"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "regimen-simple",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "radian",
    "titulo valor",
    "endoso",
    "eventos",
    "anexo tecnico"
   ],
   "estado": "vigente",
   "nota_vigencia": "Desarrolla el Decreto 1154 de 2020 y el art. 616-1 ET; reemplazó el esquema inicial de la Resolución 000015 de 2021.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0085_2022.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_269_2022",
   "tipo": "sentencia",
   "numero": "C-269",
   "anio": 2022,
   "titulo": "Sentencia C-269 de 2022 - Exequibilidad del régimen sancionatorio cambiario DIAN",
   "resumen": "La Corte Constitucional declaró exequibles el artículo 30 de la Ley 1430 de 2010 y el Decreto-Ley 2245 de 2011: el Congreso sí podía delegar en el Presidente la expedición del régimen sancionatorio cambiario que aplica la DIAN. Blindó la base legal de las sanciones cambiarias actuales.",
   "aplica": "Cierra la discusión sobre la validez constitucional del régimen sancionatorio cambiario: no prosperan defensas basadas en la invalidez del Decreto-Ley 2245 de 2011.",
   "impuestos": [
    "cambiario",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "constitucionalidad",
    "sanciones",
    "facultades extraordinarias"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/C-269_2022.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30044470"
  },
  {
   "id": "decreto_360_2021",
   "tipo": "decreto",
   "numero": "360",
   "anio": 2021,
   "titulo": "Decreto 360 de 2021 - Ajustes al Decreto 1165 de 2019 (garantías y usuarios)",
   "resumen": "Paquete de 148 artículos que ajustó el estatuto aduanero: aclaró las obligaciones de los usuarios, flexibilizó el valor asegurado de las garantías, creó la figura del usuario aduanero con trámite simplificado y eliminó prohibiciones a las agencias de aduanas para prestar otros servicios logísticos.",
   "aplica": "Usuarios aduaneros con garantías constituidas, agencias de aduanas y empresas que aspiren a la figura de trámite simplificado.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "garantias",
    "usuarios aduaneros",
    "agencias de aduanas",
    "facilitacion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0360_2021.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30041558"
  },
  {
   "id": "ley_2099_2021",
   "tipo": "ley",
   "numero": "2099",
   "anio": 2021,
   "titulo": "Ley 2099 de 2021 — Transición energética: ampliación de los incentivos de la Ley 1715",
   "resumen": "Extendió los beneficios tributarios de la Ley 1715 de 2014 al hidrógeno verde y azul, al almacenamiento de energía y a los sistemas de medición inteligente, y ajustó el procedimiento de certificación. Mantiene la deducción del 50%, la exclusión de IVA, la exención arancelaria y la depreciación acelerada para estos proyectos.",
   "aplica": "Inversionistas en hidrógeno verde o azul, almacenamiento, eficiencia energética y FNCE que tramiten el certificado de la UPME.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "transicion energetica",
    "hidrogeno",
    "energias renovables",
    "deducciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_2099_2021.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000164_2021",
   "tipo": "resolucion",
   "numero": "000164",
   "anio": 2021,
   "titulo": "Resolución DIAN 000164 de 2021 — Reglamenta el Registro Único de Beneficiarios Finales (RUB) y el SIESPJ",
   "resumen": "Pone a operar el RUB: define quiénes reportan, el formato electrónico, la responsabilidad 55 en el RUT, los criterios para identificar al beneficiario final y la obligación de actualizar el registro cuando cambie la información. También crea el sistema de identificación de estructuras sin personería jurídica (SIESPJ). El plazo inicial venció el 31 de julio de 2023.",
   "aplica": "Personas jurídicas, ESAL y estructuras sin personería obligadas a inscribirse en el RUB; el representante legal responde por el reporte inicial y sus actualizaciones.",
   "impuestos": [
    "procedimiento",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "esal",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "rub",
    "beneficiario final",
    "rut",
    "plazos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por las Resoluciones DIAN 000037 y 001240 de 2022 (plazos), 000108 de 2023, 000196 de 2024 y 000219 de 2025.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0164_2021.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000167_2021",
   "tipo": "resolucion",
   "numero": "000167",
   "anio": 2021,
   "titulo": "Resolución DIAN 000167 de 2021 - Documento soporte electrónico con no obligados a facturar",
   "resumen": "Implementa la transmisión electrónica del documento soporte en compras a sujetos no obligados a expedir factura, con su anexo técnico y notas de ajuste. Permite generarlo por operación (el mismo día) o acumulado semanal por proveedor, y exige denominación expresa, datos del vendedor y del adquirente.",
   "aplica": "Facturadores electrónicos que compran a personas que no facturan (arrendadores personas naturales, pequeños proveedores): sin este documento transmitido, el costo o gasto no procede.",
   "impuestos": [
    "facturacion-electronica",
    "renta-pj",
    "renta-pn",
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "documento soporte",
    "no obligados",
    "anexo tecnico",
    "costos y deducciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "La doctrina DIAN advierte que generarlo fuera de los plazos del art. 2 invalida su efecto fiscal como soporte.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0167_2021.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c441_2021",
   "tipo": "sentencia",
   "numero": "C-441",
   "anio": 2021,
   "titulo": "Sentencia C-441 de 2021 - Reserva de ley en sanciones y decomiso aduanero",
   "resumen": "Tumbó el numeral 4 del artículo 5 de la Ley 1609 de 2013: el régimen sancionatorio y el decomiso aduanero no podían regularse por decreto con base en una ley marco. Difirió los efectos al 20 de junio de 2023 y originó la cadena que llevó al Decreto Ley 920 de 2023 y luego a la Sentencia C-072 de 2025.",
   "aplica": "Contexto obligado para entender la inestabilidad jurídica del régimen sancionatorio aduanero desde 2021 y la defensa en procesos en curso.",
   "impuestos": [
    "aduanero",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "reserva de ley",
    "decomiso"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su plazo venció sin que el Congreso legislara; el vacío se llenó con el Decreto Ley 920 de 2023, a su vez declarado inexequible por la C-072 de 2025.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-441_2021.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2021/C-441-21.htm"
  },
  {
   "id": "decreto_0829_2020",
   "tipo": "decreto",
   "numero": "0829",
   "anio": 2020,
   "titulo": "Decreto 829 de 2020 — Procedimiento de los incentivos de energías renovables (Ley 1715)",
   "resumen": "Reglamenta el acceso a los beneficios de la Ley 1715 de 2014: centraliza en la UPME la evaluación y expedición del certificado que habilita la deducción del 50% en renta, la exclusión de IVA, la exención de arancel y la depreciación acelerada, y precisa qué inversiones y servicios califican en proyectos FNCE y de eficiencia energética.",
   "aplica": "Inversionistas en proyectos de energías renovables o eficiencia energética que necesiten el certificado UPME para usar los beneficios tributarios.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "iva",
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "energias renovables",
    "certificado upme",
    "deducciones",
    "exclusion iva"
   ],
   "estado": "modificada",
   "nota_vigencia": "Incorporado al DUR 1625 de 2016. Los artículos sobre deducción en renta y depreciación acelerada que adicionó (1.2.1.18.70 a 1.2.1.18.79) fueron sustituidos por el Decreto 895 de 2022, que reglamentó las modificaciones de la Ley 2099 de 2021; consultar esa norma para el régimen actual.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0829_2020.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1091_2020",
   "tipo": "decreto",
   "numero": "1091",
   "anio": 2020,
   "titulo": "Decreto 1091 de 2020: reglamentación vigente del SIMPLE",
   "resumen": "Reglamentó el SIMPLE bajo la Ley 2010 de 2019 e incorporó al DUR 1625 de 2016 las reglas que rigen desde 2020: condiciones para optar, exclusiones, liquidación de anticipos en el F2593, declaración anual consolidada, devoluciones de saldos y coordinación del componente ICA con los municipios.",
   "aplica": "Todo contribuyente del SIMPLE desde el año gravable 2020: es la reglamentación de fondo que desarrolla el Libro VIII del ET en el día a día.",
   "impuestos": [
    "rst",
    "iva"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "reglamentacion",
    "anticipos",
    "ica consolidado",
    "exclusiones"
   ],
   "estado": "vigente",
   "nota_vigencia": "Reincorporó al DUR, con ajustes por la Ley 2010 de 2019, las reglas que traía el Decreto 1468 de 2019.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1091_2020.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=137830"
  },
  {
   "id": "decreto_1154_2020",
   "tipo": "decreto",
   "numero": "1154",
   "anio": 2020,
   "titulo": "Decreto 1154 de 2020 - Circulación de la factura electrónica como título valor",
   "resumen": "Reglamenta la circulación electrónica de la factura electrónica de venta como título valor (modifica el Decreto 1074 de 2015): aceptación expresa o tácita a los 3 días hábiles de recibida, endoso electrónico en propiedad, procuración o garantía, y registro de eventos en el RADIAN administrado por la DIAN.",
   "aplica": "Emisores que negocian sus facturas, empresas de factoring y pagadores: la aceptación tácita por silencio de 3 días convierte la factura en título ejecutable.",
   "impuestos": [
    "facturacion-electronica"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "radian",
    "titulo valor",
    "endoso",
    "aceptacion tacita",
    "factoring"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su operación técnica en el RADIAN se desarrolla en la Resolución DIAN 000085 de 2022.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30039720"
  },
  {
   "id": "decreto_358_2020",
   "tipo": "decreto",
   "numero": "358",
   "anio": 2020,
   "titulo": "Decreto 358 de 2020 - Reglamento general de la factura de venta y documentos equivalentes",
   "resumen": "Reglamentó los arts. 511, 615, 616-1, 616-2, 616-4, 617, 618, 618-2 y 771-2 del ET sustituyendo el capítulo de facturación del DUR 1625 de 2016. Define los 13 documentos equivalentes, los sujetos no obligados a facturar y las condiciones de expedición y entrega de la factura electrónica.",
   "aplica": "Todos los facturadores; es donde se consulta si un documento (tiquete POS, boleta, extracto, peaje) vale como equivalente y quién está exceptuado de facturar.",
   "impuestos": [
    "facturacion-electronica",
    "iva",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "documentos equivalentes",
    "no obligados",
    "reglamento"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sus reglas operan compiladas en el Decreto 1625 de 2016 y se desarrollan operativamente en la Resolución DIAN 000165 de 2023.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0358_2020.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_963_2020",
   "tipo": "decreto",
   "numero": "963",
   "anio": 2020,
   "titulo": "Decreto 963 de 2020 — Devolución automática de saldos a favor de renta e IVA",
   "resumen": "Reglamenta la devolución y compensación automática de saldos a favor de renta e IVA (arts. 850 y 855 del ET): los contribuyentes de bajo riesgo, con más del 85% de sus costos, gastos o impuestos descontables soportados en factura electrónica con validación previa, reciben la devolución dentro de los 15 días hábiles siguientes a la solicitud.",
   "aplica": "Exportadores y responsables con saldos a favor: requisitos concretos para acceder a la devolución exprés en lugar del trámite ordinario de 50 días.",
   "impuestos": [
    "iva",
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "devolución automática",
    "saldos a favor",
    "factura electrónica"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sustituyó artículos del Decreto 1625 de 2016 (DUR), donde quedó compilado.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0963_2020.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30039555"
  },
  {
   "id": "resolucion_dian_000038_2020",
   "tipo": "resolucion",
   "numero": "000038",
   "anio": 2020,
   "titulo": "Implementación de la notificación electrónica en la DIAN",
   "resumen": "Desarrolla los arts. 563 a 566-1 ET: la DIAN notifica sus actos enviando copia al correo reportado en el RUT o a la dirección procesal electrónica. La notificación se entiende surtida en la fecha de envío, pero los términos para responder o impugnar empiezan a correr 5 días después de la entrega del correo.",
   "aplica": "Todo administrado con correo registrado en el RUT: revisar ese buzón es crítico porque allí llegan requerimientos, sanciones y liquidaciones con plazos en curso.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "notificacion electronica",
    "rut",
    "plazos",
    "debido proceso"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0038_2020.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000080_2020",
   "tipo": "resolucion",
   "numero": "000080",
   "anio": 2020,
   "titulo": "Resolución DIAN 000080 de 2020 — Instrumento de Firma Electrónica (IFE) autogenerable",
   "resumen": "Reglamenta el Instrumento de Firma Electrónica (IFE) de la DIAN en su versión autogenerable: el usuario la genera y renueva él mismo desde el portal, sin cita ni preguntas de seguridad, con vigencia de 3 años. Con esta firma se suscriben las declaraciones y trámites que se presentan virtualmente. Modifica la Resolución 70 de 2016.",
   "aplica": "Personas naturales que firman declaraciones o trámites virtuales ante la DIAN, a nombre propio o como representantes legales, contadores o revisores fiscales.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "firma electronica",
    "tramites virtuales",
    "muisca",
    "presentacion virtual"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 70 de 2016; complementa la Resolución 12761 de 2011 sobre obligados a presentar declaraciones virtualmente.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0080_2020.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000114_2020",
   "tipo": "resolucion",
   "numero": "000114",
   "anio": 2020,
   "titulo": "Resolución DIAN 000114 de 2020 — Adopta la Clasificación de Actividades Económicas CIIU Rev. 4 A.C. (2020)",
   "resumen": "Adopta para efectos tributarios, aduaneros y cambiarios la Clasificación de Actividades Económicas CIIU Rev. 4 A.C. (2020) del DANE, vigente desde el 1 de enero de 2021. Es la tabla de códigos de actividad económica del RUT, de la que dependen, entre otras, las tarifas de autorretención especial a título de renta.",
   "aplica": "Todos los inscritos en el RUT: al inscribirse, actualizar la actividad económica o determinar la tarifa de autorretención especial según el código CIIU.",
   "impuestos": [
    "procedimiento",
    "autorretencion",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "ciiu",
    "rut",
    "actividad economica",
    "autorretencion"
   ],
   "estado": "vigente",
   "nota_vigencia": "Rige desde el 1 de enero de 2021; derogó la Resolución 139 de 2012.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0114_2020.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_022_2020",
   "tipo": "sentencia",
   "numero": "C-022",
   "anio": 2020,
   "titulo": "Sentencia C-022 de 2020: identidad del donante fuera del registro web",
   "resumen": "La Corte Constitucional declaró inexequible que el registro web público del RTE exigiera publicar la identificación del donante (art. 364-5 ET): la medida era innecesaria y desproporcionada frente al derecho a la intimidad. El monto, la destinación y el plazo proyectado de la donación sí siguen siendo públicos.",
   "aplica": "ESAL al diligenciar el registro web: no deben publicar nombres de donantes; los demás datos de cada donación sí se publican.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "registro web",
    "donantes",
    "intimidad",
    "inexequibilidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2020/C-022-20.htm"
  },
  {
   "id": "sentencia_ce_21329_2020",
   "tipo": "sentencia",
   "numero": "21329 (2020CE-SUJ-4-005)",
   "anio": 2020,
   "titulo": "Sentencia de unificación CE 21329 de 2020 — Alcance del art. 107 ET",
   "resumen": "El Consejo de Estado, Sección Cuarta, unificó el alcance de causalidad, necesidad y proporcionalidad de las expensas deducibles: la causalidad no exige que el gasto produzca ingresos de forma directa, basta su injerencia en la actividad generadora de renta valorada con criterio comercial.",
   "aplica": "Defensa de deducciones ante la DIAN y en sede judicial: precedente de unificación para sustentar la deducibilidad de gastos bajo el art. 107 del ET.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "deducciones",
    "expensas",
    "unificacion jurisprudencial"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/25000-23-37-000-2013-00443-01(21329)ce-suj-4-005.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_ce_23692_2020",
   "tipo": "sentencia",
   "numero": "23692",
   "anio": 2020,
   "titulo": "Consejo de Estado, sentencia 23692 de 2020: cooperativas y exoneración del 114-1",
   "resumen": "Anuló apartes del DUR (introducidos por el Decreto 2150 de 2017) que excluían a las cooperativas de la exoneración de aportes parafiscales y salud del art. 114-1 ET. Como pertenecen al RTE por ley y no requieren calificación, sí acceden a la exoneración; el reglamento excedió la potestad reglamentaria.",
   "aplica": "Cooperativas empleadoras: pueden aplicar la exoneración del art. 114-1 sobre trabajadores que devenguen menos de 10 SMMLV.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "cooperativas",
    "aportes parafiscales",
    "nulidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "Anuló las expresiones '19-4' y 'y 1.2.1.5.2.1' del artículo 1.2.1.5.4.9 del DUR 1625 de 2016.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30054190"
  },
  {
   "id": "ley_1955_2019",
   "tipo": "ley",
   "numero": "1955",
   "anio": 2019,
   "titulo": "Ley 1955 de 2019 — ZESE (art. 268) y otros incentivos del PND 2018-2022",
   "resumen": "Su art. 268 creó las Zonas Económicas y Sociales Especiales (La Guajira, Norte de Santander, Arauca, Armenia y Quibdó): tarifa de renta del 0% los primeros 5 años y del 50% de la general los 5 siguientes para sociedades acogidas que generaran empleo. También llevó la deducción de la Ley 1715 a 15 años y creó el crédito fiscal del 256-1.",
   "aplica": "Sociedades que se acogieron a la ZESE dentro de la ventana legal (cerrada en 2022 para los territorios originales) y conservan el beneficio por su término de 10 años.",
   "impuestos": [
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "zese",
    "tarifas",
    "empleo",
    "plan nacional de desarrollo"
   ],
   "estado": "modificada",
   "nota_vigencia": "El PND fue sucedido por la Ley 2294 de 2023, pero el art. 268 (ZESE) sigue vigente; ya no hay ventana para nuevos acogimientos, solo ejecución del beneficio.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1955_2019.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=93970"
  },
  {
   "id": "sentencia_c481_2019",
   "tipo": "sentencia",
   "numero": "C-481",
   "anio": 2019,
   "titulo": "Sentencia C-481 de 2019, Corte Constitucional — Inexequibilidad de la Ley 1943 de 2018",
   "resumen": "La Corte Constitucional tumbó completa la Ley de Financiamiento por violar los principios de publicidad y consecutividad: la plenaria de Cámara votó sin conocer el texto aprobado por el Senado. Difirió los efectos al 1 de enero de 2020 para evitar un vacío fiscal, lo que permitió expedir la Ley 2010 de 2019.",
   "aplica": "Explica por qué la Ley 1943 solo aplicó en 2019 y por qué existe la Ley 2010 de 2019; precedente clave sobre vicios de trámite en reformas tributarias.",
   "impuestos": [
    "renta-pn",
    "renta-pj",
    "procedimiento",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "inexequibilidad",
    "vicios de tramite",
    "vigencia de normas",
    "vicios de trámite",
    "transición normativa",
    "control-constitucional"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sus efectos diferidos explican la transición Ley 1943 (AG 2019) → Ley 2010 (AG 2020 en adelante).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-481_2019.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2019/C-481-19.htm"
  },
  {
   "id": "resolucion_dian_000019_2018",
   "tipo": "resolucion",
   "numero": "000019",
   "anio": 2018,
   "titulo": "Resolución DIAN 000019 de 2018: formato 5245 y servicio informático del RTE",
   "resumen": "Prescribió el formato 5245 (Solicitud Régimen Tributario Especial) y sus anexos (formatos 2530 a 2533), y habilitó el servicio informático SIE-RTE para los procesos virtuales de calificación, readmisión, permanencia y actualización de las ESAL del art. 19 y las cooperativas del art. 19-4 ET.",
   "aplica": "Toda entidad que solicite ingresar, readmitirse o permanecer en el RTE: estos formatos se diligencian por los servicios en línea de la DIAN.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "formato 5245",
    "registro web",
    "trámites"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0019_2018.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000019%20de%2028-03-2018.pdf"
  },
  {
   "id": "decreto_119_2017",
   "tipo": "decreto",
   "numero": "119",
   "anio": 2017,
   "titulo": "Decreto 119 de 2017 - Régimen vigente de inversiones internacionales y residencia cambiaria",
   "resumen": "Reescribió dentro del Decreto 1068 de 2015 el régimen general de inversiones internacionales: nueva definición de residencia para fines cambiarios, modalidades de inversión extranjera directa y de portafolio, derechos cambiarios del inversionista y registro de la inversión ante el Banco de la República.",
   "aplica": "Empresas que reciben capital extranjero y residentes que invierten en el exterior; desde 2017 define quién es residente para efectos cambiarios.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "inversion extranjera",
    "residencia cambiaria",
    "registro",
    "portafolio"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0119_2017.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30030313"
  },
  {
   "id": "decreto_1998_2017",
   "tipo": "decreto",
   "numero": "1998",
   "anio": 2017,
   "titulo": "Decreto 1998 de 2017 — Conciliación fiscal (formato 2516)",
   "resumen": "Reglamenta la conciliación fiscal del art. 772-1 del ET: obliga a llevar un control de detalle de las diferencias entre las cifras contables NIIF y las fiscales, y a reportarlas en el formato 2516, anexo del formulario 110. Sin la conciliación, la contabilidad pierde valor probatorio.",
   "aplica": "PJ contribuyentes de renta obligadas a llevar contabilidad; el reporte 2516 se presenta virtualmente cuando los ingresos brutos fiscales son ≥45.000 UVT.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "conciliacion fiscal",
    "formato 2516",
    "niif",
    "prueba contable"
   ],
   "estado": "vigente",
   "nota_vigencia": "Sustituyó la Parte 7 del Libro 1 del DUR 1625 de 2016.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1998_2017.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2250_2017",
   "tipo": "decreto",
   "numero": "2250",
   "anio": 2017,
   "titulo": "Decreto 2250 de 2017 — Reglamentación del sistema cedular de la Ley 1819 de 2016",
   "resumen": "Primer reglamento de la cedulación: definió cómo clasificar los ingresos en cada cédula, el manejo de costos y gastos, la realización de las cesantías, el tratamiento de los aportes obligatorios y voluntarios a pensión y salud, y las reglas de los dividendos según el año de las utilidades. Quedó compilado en el DUR 1625.",
   "aplica": "Personas naturales residentes y quienes preparan sus declaraciones; varias de sus definiciones (cesantías, aportes) siguen aplicándose hoy.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "sistema cedular",
    "cesantias",
    "aportes pension",
    "dividendos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Varios artículos compilados fueron sustituidos por decretos posteriores, en especial el Decreto 2231 de 2023 tras la Ley 2277.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2250_2017.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=85058"
  },
  {
   "id": "decreto_2147_2016",
   "tipo": "decreto",
   "numero": "2147",
   "anio": 2016,
   "titulo": "Decreto 2147 de 2016 - Régimen de zonas francas",
   "resumen": "Régimen general de zonas francas: requisitos y trámite para declararlas, calificación de usuarios operadores, industriales y comerciales, compromisos de inversión y empleo, y operación aduanera de entrada y salida de mercancías. Es la regulación operativa que complementa el régimen tributario de la Ley 1004 de 2005.",
   "aplica": "Usuarios operadores, industriales y comerciales de zonas francas, y empresas que evalúan instalarse en una para operar con beneficios aduaneros.",
   "impuestos": [
    "aduanero",
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "usuarios industriales",
    "declaratoria",
    "inversion",
    "compromisos de inversion",
    "regimen aduanero"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por el Decreto 278 de 2021, que simplificó trámites y actualizó definiciones, y posteriormente por los Decretos 1317 de 2025 y 216 de 2026; los Títulos II y III fueron derogados parcialmente por el artículo 774 del Decreto 1165 de 2019.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2147_2016.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30030246"
  },
  {
   "id": "estatuto_arts_882_893",
   "tipo": "estatuto",
   "numero": "Arts. 882 a 893",
   "anio": 2016,
   "titulo": "ET Arts. 882 a 893 — Régimen de Entidades Controladas del Exterior (ECE), Libro Séptimo",
   "resumen": "Régimen de transparencia fiscal para residentes que controlan entidades del exterior: si un residente tiene el 10% o más en una ECE (sociedad, fideicomiso o fondo controlado desde Colombia), las rentas pasivas de esa entidad (dividendos, intereses, regalías, arriendos, ciertas ventas) se gravan aquí el mismo año en que se generan, sin esperar su distribución.",
   "aplica": "Residentes fiscales colombianos, personas naturales o jurídicas, con participación directa o indirecta igual o superior al 10% en entidades del exterior que controlen.",
   "impuestos": [
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "ece",
    "rentas pasivas",
    "transparencia fiscal",
    "beps",
    "inversiones exterior"
   ],
   "estado": "vigente",
   "nota_vigencia": "Libro Séptimo adicionado por la Ley 1819 de 2016 (BEPS Acción 3); sin reformas estructurales posteriores.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2420_2015",
   "tipo": "decreto",
   "numero": "2420",
   "anio": 2015,
   "titulo": "Decreto 2420 de 2015 — Decreto Único Reglamentario de las normas de contabilidad, información financiera y aseguramiento (DUR contable)",
   "resumen": "Compila en un solo decreto los marcos técnicos contables de los tres grupos (NIIF plenas, NIIF para pymes y contabilidad simplificada de microempresas) y las normas de aseguramiento de la información. Es el marco bajo el cual se preparan los estados financieros de los que parte la depuración fiscal de renta.",
   "aplica": "Preparadores de información financiera de los grupos 1, 2 y 3. Es la referencia contable detrás del F110, el formato 2516 y la conciliación fiscal del Decreto 1998 de 2017.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "esal",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "niif",
    "grupos contables",
    "estados financieros",
    "dur contable"
   ],
   "estado": "modificada",
   "nota_vigencia": "Actualizado en múltiples ocasiones para incorporar enmiendas NIIF (Decretos 2496/2015, 2483/2018, 2270/2019, 1670/2021 y 1271/2024, entre otros).",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30030273"
  },
  {
   "id": "ley_1762_2015",
   "tipo": "ley",
   "numero": "1762",
   "anio": 2015,
   "titulo": "Ley 1762 de 2015 - Ley Anticontrabando",
   "resumen": "Endurece las penas por contrabando, favorecimiento y fraude aduanero, los conecta con el lavado de activos y la evasión fiscal, y crea herramientas de coordinación entre DIAN, Polfa y Fiscalía. Elevó el contrabando a delito fuente de lavado y reforzó la responsabilidad de quien comercializa mercancía ilegal.",
   "aplica": "Comerciantes e importadores: comprar o vender mercancía de contrabando acarrea responsabilidad penal, además de las consecuencias aduaneras sobre la mercancía.",
   "impuestos": [
    "aduanero",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "contrabando",
    "sanciones",
    "lavado de activos",
    "delitos"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1762_2015.htm",
   "url_alt": ""
  },
  {
   "id": "estatuto_art_607",
   "tipo": "estatuto",
   "numero": "Art. 607",
   "anio": 2014,
   "titulo": "ET Art. 607 — Declaración anual de activos en el exterior (formulario 160)",
   "resumen": "Crea la declaración anual de activos en el exterior (formulario 160) para contribuyentes de renta cuyos activos fuera del país superen 2.000 UVT a 1 de enero. Los activos que pasen de 3.580 UVT se detallan uno a uno con jurisdicción y valor patrimonial; los demás se reportan agregados por jurisdicción. Se presenta junto con la declaración de renta.",
   "aplica": "Personas naturales residentes y jurídicas contribuyentes de renta (y del SIMPLE desde 2023) con activos en el exterior por más de 2.000 UVT. Presentarla tarde causa la sanción del par. 1 del art. 641 ET.",
   "impuestos": [
    "renta-pn",
    "renta-pj",
    "rst",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "activos exterior",
    "formulario 160",
    "obligaciones formales",
    "sanciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "Adicionado por la Ley 1739 de 2014; la Ley 2010 de 2019 fijó el umbral de 2.000 UVT y la Ley 2277 de 2022 extendió la obligación a los regímenes sustitutivos de renta (SIMPLE).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1607_2012",
   "tipo": "ley",
   "numero": "1607",
   "anio": 2012,
   "titulo": "Ley 1607 de 2012 — Reforma tributaria: creación del INC y de la base AIU",
   "resumen": "Reforma que creó el impuesto nacional al consumo (restaurantes, telefonía, vehículos) y la base gravable especial AIU del art. 462-1 del ET, redujo el abanico de tarifas de IVA y reorganizó los periodos de declaración. Buena parte de su articulado de IVA fue reescrito por las reformas posteriores.",
   "aplica": "Origen legal del INC y del AIU; útil para entender por qué los restaurantes salieron del IVA y cómo nació la base mínima del 10% en servicios de aseo y vigilancia.",
   "impuestos": [
    "iva",
    "inc",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "inc",
    "aiu",
    "tarifas",
    "reforma tributaria",
    "cree",
    "iman-imas"
   ],
   "estado": "modificada",
   "nota_vigencia": "Varias de sus reglas de IVA fueron reescritas por las Leyes 1819 de 2016, 1943 de 2018 y 2010 de 2019.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1607_2012.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_3568_2011",
   "tipo": "decreto",
   "numero": "3568",
   "anio": 2011,
   "titulo": "Decreto 3568 de 2011 - Operador Económico Autorizado (OEA)",
   "resumen": "Crea el Operador Económico Autorizado en Colombia: estatus voluntario y gratuito que la DIAN otorga a empresas seguras de la cadena de suministro internacional, con beneficios como menos inspecciones físicas, atención prioritaria y reducción de garantías. La autorización es indefinida mientras se cumplan las condiciones.",
   "aplica": "Exportadores, importadores y demás eslabones de la cadena de comercio exterior que quieran acreditarse como operadores confiables ante la DIAN.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "oea",
    "facilitacion",
    "seguridad",
    "beneficios"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado y adicionado parcialmente por el Decreto 1894 de 2015.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_3568_2011.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/1531456"
  },
  {
   "id": "ley_1314_2009",
   "tipo": "ley",
   "numero": "1314",
   "anio": 2009,
   "titulo": "Ley 1314 de 2009 — Convergencia a normas internacionales de contabilidad, información financiera y aseguramiento (NIIF)",
   "resumen": "Ley marco de la convergencia contable: ordena adoptar en Colombia estándares internacionales de contabilidad, información financiera y aseguramiento (NIIF/NIA), asigna la regulación a MinHacienda y MinComercio con apoyo técnico del CTCP, y cobija a toda persona obligada a llevar contabilidad.",
   "aplica": "Todo obligado a llevar contabilidad. En renta importa porque el art. 21-1 ET toma los marcos NIIF como punto de partida de la base fiscal de los obligados a contabilidad.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "esal",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "niif",
    "contabilidad",
    "marcos tecnicos",
    "conciliacion fiscal"
   ],
   "estado": "vigente",
   "nota_vigencia": "Desarrollada por el Decreto 2420 de 2015 (DUR contable); su efecto fiscal se canaliza por el art. 21-1 ET desde la Ley 1819 de 2016.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1677255"
  },
  {
   "id": "ley_1231_2008",
   "tipo": "ley",
   "numero": "1231",
   "anio": 2008,
   "titulo": "Ley 1231 de 2008 - La factura como título valor",
   "resumen": "Unificó la factura como título valor negociable, modificando los arts. 772 a 779 del Código de Comercio. La factura aceptada por el comprador (expresa o tácitamente) presta mérito ejecutivo y puede circular por endoso, lo que habilita el factoring como financiación para mipymes.",
   "aplica": "Vendedores y prestadores de servicios que negocien sus facturas (factoring) y compradores que las aceptan; es la base comercial sobre la que opera el RADIAN.",
   "impuestos": [
    "facturacion-electronica"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "titulo valor",
    "factoring",
    "endoso",
    "merito ejecutivo"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada por la Ley 1676 de 2013 (factoring y garantías mobiliarias); la circulación electrónica de la factura título valor la reglamenta el Decreto 1154 de 2020.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1675804"
  },
  {
   "id": "ley_1004_2005",
   "tipo": "ley",
   "numero": "1004",
   "anio": 2005,
   "titulo": "Ley 1004 de 2005 - Régimen tributario de zonas francas",
   "resumen": "Define la zona franca y su finalidad de atraer inversión y empleo, y fija su régimen tributario especial: tarifa de renta preferencial para usuarios industriales (hoy 20% condicionada) y exención de IVA en ventas desde el territorio aduanero nacional a usuarios industriales. Es el pilar fiscal del régimen franco.",
   "aplica": "Usuarios industriales de bienes y servicios de zonas francas y sus proveedores ubicados en el territorio aduanero nacional.",
   "impuestos": [
    "aduanero",
    "renta-pj",
    "iva"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "tarifa renta",
    "exencion iva"
   ],
   "estado": "modificada",
   "nota_vigencia": "La Ley 2277 de 2022 condicionó la tarifa del 20% de los usuarios industriales al cumplimiento de un plan de internacionalización y umbrales de ingresos por exportación.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1004_2005.htm",
   "url_alt": ""
  },
  {
   "id": "circular_dcin_83_2004",
   "tipo": "circular",
   "numero": "DCIN-83",
   "anio": 2004,
   "titulo": "Circular Reglamentaria Externa DCIN-83 Banco de la República",
   "resumen": "Circular del Banco de la República que durante años fue el manual operativo del régimen cambiario: declaración de cambio, numerales cambiarios, registro de cuentas de compensación e inversiones internacionales. Expedida en diciembre de 2004, recibió decenas de modificaciones hasta su reemplazo.",
   "aplica": "Referencia para operaciones de cambio canalizadas antes de septiembre de 2021; los procedimientos actuales están en la DCIP-83.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "declaracion de cambio",
    "numerales cambiarios",
    "procedimientos",
    "historia normativa"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Sustituida por la Circular Reglamentaria Externa DCIP-83 a partir del 1 de septiembre de 2021.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.banrep.gov.co/es/normatividad/regulacion-operaciones-cambiarias/compendios-dcin-83-dcip-83"
  },
  {
   "id": "decision_can_578_2004",
   "tipo": "ley",
   "numero": "578",
   "anio": 2004,
   "titulo": "Decisión 578 de 2004 (Comunidad Andina) — Régimen para evitar la doble tributación y prevenir la evasión fiscal",
   "resumen": "Norma supranacional de la CAN, de aplicación directa y preferente en Colombia, Bolivia, Ecuador y Perú. Adopta el criterio de la fuente: la renta solo tributa en el país donde se genera y los demás miembros deben tratarla como exonerada. Cubre renta y patrimonio: beneficios empresariales, servicios, dividendos, regalías.",
   "aplica": "Empresas y personas con operaciones, inversiones o pagos entre Colombia y Bolivia, Ecuador o Perú; define si procede retención por pagos al exterior dentro de la CAN.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "retefuente",
    "patrimonio"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "doble tributacion",
    "pais de la fuente",
    "pagos al exterior",
    "can",
    "convenios"
   ],
   "estado": "vigente",
   "nota_vigencia": "Norma comunitaria de aplicación directa y preferente sobre la ley interna entre Colombia, Bolivia, Ecuador y Perú; no requirió ley aprobatoria.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.dian.gov.co/normatividad/convenios/Convenios_Tributarios_Internacionales/Comunidad-Andina-de-Naciones-2004.pdf"
  },
  {
   "id": "ley_675_2001",
   "tipo": "ley",
   "numero": "675",
   "anio": 2001,
   "titulo": "Ley 675 de 2001: régimen de propiedad horizontal",
   "resumen": "Regula la propiedad horizontal y su persona jurídica sin ánimo de lucro. Su art. 33 le da la calidad de no contribuyente de impuestos nacionales, pero desde la Ley 1819 el art. 19-5 ET exceptúa a las copropiedades comerciales o mixtas que explotan áreas comunes, que tributan renta por esas rentas.",
   "aplica": "Administradores y contadores de copropiedades residenciales, comerciales y mixtas: define la naturaleza jurídica y el punto de partida tributario.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "propiedad horizontal",
    "no contribuyente",
    "áreas comunes"
   ],
   "estado": "modificada",
   "nota_vigencia": "El art. 19-5 ET (Ley 1819 de 2016) limitó el alcance de su artículo 33 para copropiedades comerciales o mixtas.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4162"
  },
  {
   "id": "ley_633_2000",
   "tipo": "ley",
   "numero": "633",
   "anio": 2000,
   "titulo": "Ley 633 de 2000 — Creación del GMF como impuesto permanente",
   "resumen": "Convirtió el gravamen a los movimientos financieros en impuesto permanente y lo codificó en los Arts. 870 a 881 del ET con tarifa inicial del 3x1.000, elevada después al 4x1.000 por las Leyes 863 de 2003 y 1111 de 2006. Definió hecho generador, causación, base gravable, sujetos pasivos y el sistema de exenciones que todavía estructura el tributo.",
   "aplica": "Todo usuario del sistema financiero; bancos y cooperativas actúan como responsables del recaudo.",
   "impuestos": [
    "gmf"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "4x1000",
    "hecho generador",
    "exenciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sus artículos del ET han sido retocados por reformas posteriores: la Ley 863 de 2003 y la Ley 1111 de 2006 llevaron la tarifa al 4x1.000, y la última modificación relevante es la Ley 2277 de 2022 en materia de exenciones (Art. 881-1).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0633_2000.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=6285"
  },
  {
   "id": "sentencia_c_160_1998",
   "tipo": "sentencia",
   "numero": "C-160",
   "anio": 1998,
   "titulo": "Corte Constitucional: la sanción por no informar exige daño y proporcionalidad",
   "resumen": "Condicionó la constitucionalidad del art. 651 ET: no todo error en la información reportada a la DIAN es sancionable; debe demostrarse que el error o la omisión causó daño y la multa debe ser proporcional a ese daño. La carga de probar el daño recae en principio en la administración.",
   "aplica": "Defensa frente a pliegos de cargos por exógena: si el error no impidió la gestión de la DIAN ni causó perjuicio, no procede la sanción. Sigue vigente tras las reformas al 651.",
   "impuestos": [
    "procedimiento",
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "exogena",
    "sanciones",
    "proporcionalidad",
    "jurisprudencia",
    "daño"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su condicionamiento se mantiene aplicable al art. 651 incluso tras las modificaciones de las Leyes 1819 de 2016 y 2277 de 2022.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/1998/C-160-98.htm"
  },
  {
   "id": "ley_31_1992",
   "tipo": "ley",
   "numero": "31",
   "anio": 1992,
   "titulo": "Ley 31 de 1992 - Banco de la República como autoridad cambiaria",
   "resumen": "Ley orgánica del Banco de la República. Asigna a su Junta Directiva la condición de autoridad cambiaria del país: por eso quien expide las resoluciones externas y circulares que regulan el mercado de divisas es la Junta del Emisor, no el Congreso ni la DIAN.",
   "aplica": "Clave para entender quién dicta las reglas cambiarias que usted debe cumplir: las resoluciones externas y circulares reglamentarias del Banco de la República.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "banco de la republica",
    "autoridad cambiaria",
    "competencias"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sigue vigente como ley del Emisor; algunos apartes han sido declarados inexequibles o condicionados por la Corte Constitucional y la Ley 1328 de 2009 derogó un parágrafo del artículo 53, sin afectar el papel de la Junta como autoridad cambiaria.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0031_1992.htm",
   "url_alt": ""
  },
  {
   "id": "ley_7_1991",
   "tipo": "ley",
   "numero": "7",
   "anio": 1991,
   "titulo": "Ley 7 de 1991 - Ley Marco de Comercio Exterior",
   "resumen": "Ley marco del comercio exterior: ordena los criterios generales que rigen importaciones y exportaciones, creó el Ministerio de Comercio Exterior, el Consejo Superior de Comercio Exterior y el Banco de Comercio Exterior. Sigue siendo la base institucional de la política comercial y de sus instrumentos de promoción.",
   "aplica": "Importadores, exportadores y operadores que usan instrumentos de promoción del comercio exterior (sistemas especiales importación-exportación, financiación de Bancóldex).",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "comercio exterior",
    "institucionalidad",
    "ley marco"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sus referencias institucionales se entienden hoy respecto del Ministerio de Comercio, Industria y Turismo y los organismos que sucedieron a los creados en 1991.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0007_1991.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_114_1",
   "tipo": "estatuto",
   "numero": "Art. 114-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 114-1: exoneración de aportes parafiscales y salud",
   "resumen": "Exonera de aportes a SENA, ICBF y salud por trabajadores que ganen menos de 10 SMMLV. Las ESAL que requieren calificación en el RTE quedan por fuera del beneficio; las cooperativas del art. 19-4 sí acceden, según lo definió el Consejo de Estado al anular el aparte reglamentario que las excluía.",
   "aplica": "ESAL y cooperativas empleadoras al liquidar nómina: define quién paga o no parafiscales y aporte patronal a salud sobre salarios bajos.",
   "impuestos": [
    "rst",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "regimen-simple",
    "empleador",
    "persona-juridica",
    "persona-natural",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "parafiscales",
    "nomina",
    "exoneracion",
    "aportes parafiscales",
    "exoneración",
    "nómina"
   ],
   "estado": "vigente",
   "nota_vigencia": "Adicionado por la Ley 1819 de 2016; el parágrafo 3 del art. 903 del ET extiende la exoneración a los contribuyentes del SIMPLE.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_115",
   "tipo": "estatuto",
   "numero": "Art. 115",
   "anio": 1989,
   "titulo": "ET Art. 115 — Deducción de impuestos, tasas y contribuciones",
   "resumen": "Permite deducir el 100% de los impuestos, tasas y contribuciones pagados con relación a la actividad (ICA, predial, etc.), salvo renta y patrimonio; el GMF solo es deducible al 50%. Desde 2023 el ICA ya no puede tomarse como descuento del 50% y la prohibición de deducir regalías fue retirada por la Corte.",
   "aplica": "Sociedades que pagan ICA, predial, GMF u otros tributos vinculados a su actividad; sector extractivo frente a la deducción de regalías (C-489 de 2023).",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "deducciones",
    "ica",
    "gmf",
    "regalias"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por la Ley 2277 de 2022; el parágrafo que prohibía deducir regalías fue declarado inexequible por la Sentencia C-489 de 2023.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_19_5",
   "tipo": "estatuto",
   "numero": "Art. 19-5",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 19-5: copropiedades que explotan áreas comunes",
   "resumen": "Las propiedades horizontales de uso comercial o mixto que explotan económicamente sus áreas comunes (parqueaderos, vallas, arriendo de zonas) son contribuyentes de renta del régimen ordinario por esas rentas. Las copropiedades de uso exclusivamente residencial conservan la calidad de no contribuyentes.",
   "aplica": "Centros comerciales, edificios de oficinas y copropiedades mixtas que arriendan o explotan sus zonas comunes.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "propiedad horizontal",
    "áreas comunes",
    "régimen ordinario"
   ],
   "estado": "vigente",
   "nota_vigencia": "Adicionado por la Ley 1819 de 2016 y reglamentado en el DUR 1625 de 2016 por el Decreto 2150 de 2017.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_240_par_5",
   "tipo": "estatuto",
   "numero": "Art. 240 Par. 5",
   "anio": 1989,
   "titulo": "Tarifa del 15% para hotelería, parques temáticos, ecoturismo y agroturismo (ET, Art. 240 Par. 5)",
   "resumen": "Tarifa de renta del 15% durante 10 años para las rentas de nuevos hoteles, remodelaciones o ampliaciones cuyo valor no sea inferior al 50% del valor de adquisición del inmueble, y para parques temáticos, de ecoturismo y agroturismo, cumpliendo condiciones de ubicación, entrega del proyecto y operación directa. No cobija moteles ni residencias.",
   "aplica": "Sociedades que construyan, remodelen o amplíen hoteles y parques temáticos y operen directamente el servicio, sin rendimiento garantizado.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "turismo-hoteles"
   ],
   "temas": [
    "tarifas",
    "hoteleria",
    "turismo",
    "parques tematicos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Redacción actual dada por el art. 10 de la Ley 2277 de 2022, que reemplazó la tarifa del 9% de regímenes hoteleros anteriores.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_242",
   "tipo": "estatuto",
   "numero": "Art. 242",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 242 — Tarifa de dividendos para personas naturales residentes",
   "resumen": "Desde el año gravable 2023 los dividendos no gravados se suman a la base de la tabla del art. 241 y dan derecho al descuento del art. 254-1, equivalente al 19% de la parte que exceda 1.090 UVT. Los dividendos repartidos como gravados (parágrafo 2 del art. 49) pagan primero la tarifa de sociedades y luego la tabla personal.",
   "aplica": "Socios y accionistas personas naturales residentes que reciben dividendos o participaciones de sociedades nacionales.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "dividendos",
    "tarifas",
    "descuento 19%",
    "doble tributacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por la Ley 2277 de 2022, que eliminó la tarifa del 10% y llevó los dividendos a la tabla marginal del art. 241.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_242_1",
   "tipo": "estatuto",
   "numero": "Art. 242-1",
   "anio": 1989,
   "titulo": "ET Art. 242-1 — Retención sobre dividendos entre sociedades nacionales",
   "resumen": "Retención trasladable del 10% sobre dividendos que una sociedad nacional distribuye a otra sociedad nacional. No es impuesto definitivo para la sociedad receptora: se traslada al beneficiario final persona natural residente o inversionista del exterior, quien la imputa en su declaración.",
   "aplica": "Sociedades nacionales que decretan o reciben dividendos de otras sociedades nacionales; clave en grupos empresariales con distribuciones en cascada.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "dividendos",
    "retencion trasladable",
    "grupos empresariales"
   ],
   "estado": "modificada",
   "nota_vigencia": "Tarifa elevada del 7,5% al 10% por la Ley 2277 de 2022.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_387",
   "tipo": "estatuto",
   "numero": "Art. 387",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 387 — Deducciones que reducen la base de retención por rentas de trabajo",
   "resumen": "Permite restar de la base mensual de retención: intereses de crédito de vivienda (hasta 100 UVT/mes), pagos de medicina prepagada o seguros de salud (hasta 16 UVT/mes) y el 10% de los ingresos por dependientes (hasta 32 UVT/mes). Estas mismas deducciones se usan después en la declaración anual.",
   "aplica": "Asalariados e independientes a quienes se les retiene con la tabla del art. 383, y empleadores o pagadores que depuran la base mensual.",
   "impuestos": [
    "renta-pn",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "empleador",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "deducciones",
    "dependientes",
    "vivienda",
    "medicina prepagada",
    "base de retencion"
   ],
   "estado": "vigente",
   "nota_vigencia": "Convive con la deducción adicional de 72 UVT por dependiente del art. 336 (Ley 2277 de 2022), que es independiente y compatible.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_555_2",
   "tipo": "estatuto",
   "numero": "Art. 555-2",
   "anio": 1989,
   "titulo": "Registro Único Tributario (RUT)",
   "resumen": "El RUT es el mecanismo único para identificar, ubicar y clasificar a quienes tienen obligaciones administradas por la DIAN. La inscripción es requisito previo al inicio de la actividad económica. No inscribirse, no actualizarlo o no exhibirlo cuando se exige acarrea las sanciones del art. 658-3 (clausura o multas en UVT).",
   "aplica": "Toda persona natural o jurídica con obligaciones ante la DIAN: declarantes, responsables de IVA, agentes de retención, importadores y usuarios aduaneros.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "rut",
    "registro",
    "obligaciones formales",
    "identificacion"
   ],
   "estado": "vigente",
   "nota_vigencia": "Reglamentado en el Decreto 1625 de 2016; el Decreto-Ley 2106 de 2019 habilitó trámites virtuales y la inscripción de oficio.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_580_1",
   "tipo": "estatuto",
   "numero": "Art. 580-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Art. 580-1 — Ineficacia de la declaración de retención presentada sin pago total",
   "resumen": "La declaración de retención en la fuente presentada sin pago total no produce efecto legal alguno, sin necesidad de acto que lo declare. Produce efectos si el pago total se hace a más tardar dentro de los 2 meses siguientes al vencimiento, o si el agente es titular de un saldo a favor compensable igual o superior a dos veces el valor de la retención a cargo, generado antes de presentar la declaración, solicitando…",
   "aplica": "Agentes de retención (renta, IVA, timbre): empresas, empleadores y demás obligados a retener. Una retención 'presentada' sin pago es como no presentada.",
   "impuestos": [
    "retefuente",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal",
    "empleador"
   ],
   "sectores": [],
   "temas": [
    "ineficacia",
    "pago total",
    "formulario 350",
    "sanciones",
    "retencion en la fuente"
   ],
   "estado": "vigente",
   "nota_vigencia": "Flexibilizado por la Ley 2010 de 2019, que dio el plazo de dos meses para pagar y conservar la eficacia de la declaración.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_616_1",
   "tipo": "estatuto",
   "numero": "Art. 616-1",
   "anio": 1989,
   "titulo": "ET Art. 616-1 — Sistema de facturación como soporte fiscal",
   "resumen": "Define el sistema de facturación (factura electrónica y documentos equivalentes) y lo convierte en requisito de control: sin factura electrónica válida o documento soporte, los costos y deducciones del comprador quedan expuestos a rechazo en la declaración de renta.",
   "aplica": "Toda sociedad que compre o venda bienes y servicios; revisar que los soportes de costos y gastos del año sean facturas electrónicas o documentos soporte válidos.",
   "impuestos": [
    "renta-pj",
    "facturacion-electronica",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "soportes",
    "factura electronica",
    "deducciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado por la Ley 2155 de 2021 y desarrollado por las resoluciones DIAN del sistema de facturación (entre ellas la 000165 de 2023).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_631_1",
   "tipo": "estatuto",
   "numero": "Art. 631-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 631-1 — Estados financieros consolidados de grupos empresariales",
   "resumen": "Obliga a los grupos económicos y empresariales inscritos en el registro mercantil a remitir a la DIAN, a más tardar el 30 de junio de cada año, sus estados financieros consolidados con sus anexos. El reporte lo presenta la matriz o controlante y su incumplimiento se castiga con la sanción del artículo 651.",
   "aplica": "Matrices o controlantes de grupos económicos y empresariales registrados en las cámaras de comercio; el reporte se entrega en el formato 1034.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "grupos empresariales",
    "estados financieros consolidados",
    "formato 1034"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_638",
   "tipo": "estatuto",
   "numero": "Art. 638",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 638 — Prescripción de la facultad sancionatoria",
   "resumen": "Cuando la sanción por no informar se impone en resolución independiente, el pliego de cargos debe notificarse dentro de los dos años siguientes a la presentación de la declaración de renta del año en que ocurrió la irregularidad. Vencido ese plazo, la facultad de la DIAN para sancionar prescribe.",
   "aplica": "Defensa de cualquier reportante de exógena sancionado: lo primero es verificar si el pliego de cargos se notificó dentro del término.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "prescripción",
    "pliego de cargos",
    "sanciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_640",
   "tipo": "estatuto",
   "numero": "Art. 640",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 640 — Gradualidad y proporcionalidad de las sanciones",
   "resumen": "Ordena aplicar lesividad, proporcionalidad, gradualidad y favorabilidad a todas las sanciones tributarias. Sin reincidencia y cumpliendo sus condiciones, la multa del artículo 651 puede rebajarse al 50% o al 75% del monto liquidado, rebaja que según la doctrina de la DIAN concurre con las reducciones propias del 651.",
   "aplica": "Cualquier sancionado por no enviar información, enviarla con errores o de forma extemporánea, al autoliquidar la multa o discutirla ante la DIAN.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "gradualidad",
    "proporcionalidad",
    "favorabilidad",
    "reducción de sanciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "Redacción vigente dada por la Ley 1819 de 2016.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_670",
   "tipo": "estatuto",
   "numero": "Art. 670",
   "anio": 1989,
   "titulo": "Sanción por devolución o compensación improcedente",
   "resumen": "Si la DIAN devolvió o compensó un saldo a favor que luego rechaza o disminuye, el contribuyente debe reintegrar las sumas más intereses moratorios, y paga sanción del 10% del valor devuelto en exceso si corrige voluntariamente, o del 20% si lo determina la administración. Usar documentos falsos eleva la sanción al 100%.",
   "aplica": "Quien pidió devolución o compensación de saldos a favor en renta o IVA y su declaración es luego modificada oficialmente o corregida.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "devoluciones",
    "sanciones",
    "saldos a favor",
    "reintegro"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto vigente con la redacción de la Ley 1819 de 2016 (art. 293).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_771_2",
   "tipo": "estatuto",
   "numero": "Art. 771-2",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 771-2: la factura como soporte de costos y deducciones",
   "resumen": "Condiciona la procedencia de costos, deducciones e impuestos descontables a que la operación esté soportada en factura con los requisitos de los arts. 617 y 618 ET o en documento equivalente. Es la norma que conecta la facturación con la depuración de renta e IVA del comprador.",
   "aplica": "Cualquier contribuyente que pretenda restar costos, gastos o IVA descontable: sin factura electrónica o documento equivalente válido del proveedor, el soporte se rechaza.",
   "impuestos": [
    "facturacion-electronica",
    "renta-pj",
    "renta-pn",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "soporte fiscal",
    "costos y deducciones",
    "impuestos descontables"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_868",
   "tipo": "estatuto",
   "numero": "Arts. 868 y 868-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 868 y 868-1 – la UVT y su reajuste anual",
   "resumen": "Crea la UVT como unidad estándar de las cifras tributarias y ordena a la DIAN reajustarla cada año con la variación del IPC de ingresos medios certificada por el DANE, mediante resolución previa al inicio del año. El art. 868-1 reexpresa en UVT los valores absolutos del Estatuto: topes, sanciones y bases se actualizan automáticamente.",
   "aplica": "Sustento legal del valor anual de la UVT con el que se miden topes para declarar, sanción mínima y bases de retención.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "uvt",
    "parametros",
    "ipc"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_125_257",
   "tipo": "estatuto",
   "numero": "Arts. 125-1 a 125-5, 257 y 257-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario: donaciones a ESAL y descuento tributario del 25%",
   "resumen": "Las donaciones a ESAL del RTE y a no contribuyentes de los arts. 22 y 23 dan un descuento en renta del 25% del valor donado, sujeto a certificación del donatario y a los requisitos de los arts. 125-1 y 125-2. Donar a una ESAL que no esté en el RTE no genera beneficio y es ingreso gravado para quien recibe (art. 125-5).",
   "aplica": "Empresas y personas naturales donantes, y ESAL receptoras que expiden la certificación; el descuento se usa con los límites del art. 258 ET.",
   "impuestos": [
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "esal",
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "donaciones",
    "descuento tributario",
    "certificación"
   ],
   "estado": "vigente",
   "nota_vigencia": "El exceso de descuento por donaciones puede tomarse en el periodo gravable siguiente conforme al art. 258 ET.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_22_23",
   "tipo": "estatuto",
   "numero": "Arts. 22 y 23",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 22 y 23: entidades no contribuyentes",
   "resumen": "Lista las entidades no contribuyentes de renta: las del art. 22 (Nación, entidades territoriales, resguardos, juntas de acción comunal) ni siquiera declaran; las del art. 23 (sindicatos, asociaciones gremiales, fondos de empleados, iglesias reconocidas, partidos) presentan declaración de ingresos y patrimonio.",
   "aplica": "Entidades públicas, sindicatos, iglesias, partidos políticos y demás listadas: no pagan renta pero varias deben declarar ingresos y patrimonio.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "no contribuyentes",
    "ingresos y patrimonio",
    "iglesias"
   ],
   "estado": "vigente",
   "nota_vigencia": "El texto vigente del art. 22 fue dado por el art. 83 de la Ley 2010 de 2019, que incluyó a las juntas de acción comunal como no contribuyentes no declarantes; el del art. 23 proviene de la Ley 1819 de 2016.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_236_239_1",
   "tipo": "estatuto",
   "numero": "Arts. 236-239-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 236 a 239-1 — Renta por comparación patrimonial y activos omitidos",
   "resumen": "Si el patrimonio líquido crece más de lo que explican la renta y las ganancias declaradas, la diferencia se grava como renta especial. El art. 239-1 convierte los activos omitidos y pasivos inexistentes que detecte la DIAN en fiscalización en renta líquida gravable del período objeto de revisión, y el mayor impuesto genera además la sanción por inexactitud agravada.",
   "aplica": "Declarantes cuyo patrimonio aumentó entre un año y otro; es uno de los cruces automáticos más usados por la DIAN en requerimientos.",
   "impuestos": [
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "comparacion patrimonial",
    "activos omitidos",
    "fiscalizacion",
    "justificacion patrimonial"
   ],
   "estado": "vigente",
   "nota_vigencia": "Se complementa con el delito de omisión de activos del art. 434A del Código Penal para montos altos.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_249_260",
   "tipo": "estatuto",
   "numero": "Arts. 249-260",
   "anio": 1989,
   "titulo": "ET Arts. 249-260 — Descuentos tributarios en renta",
   "resumen": "Bloque de descuentos que restan directamente del impuesto: impuestos pagados en el exterior (254), 25% de inversiones ambientales (255), 30% de inversiones en I+D+i (256), 25% de donaciones a entidades del RTE (257) e IVA de activos fijos reales productivos (258-1). El art. 259 les pone tope frente al impuesto básico.",
   "aplica": "Sociedades con rentas del exterior, inversiones ambientales o en I+D+i, donaciones a ESAL o compras de activos fijos productivos con IVA.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "descuentos",
    "donaciones",
    "iva activos fijos",
    "impuestos exterior"
   ],
   "estado": "modificada",
   "nota_vigencia": "Reorganizado por la Ley 2277 de 2022; desde 2023 el ICA dejó de ser descontable (derogatoria del par. 1 del art. 115).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_256_256_1",
   "tipo": "estatuto",
   "numero": "Arts. 256 y 256-1",
   "anio": 1989,
   "titulo": "Incentivos por inversión en ciencia, tecnología e innovación (ET, Arts. 256 y 256-1)",
   "resumen": "El art. 256 da un descuento en renta del 30% de la inversión en proyectos de investigación, desarrollo tecnológico o innovación calificados por el CNBT. El 256-1 da a las mipymes un crédito fiscal del 50% de esas inversiones o de la vinculación de doctores, convertible en TIDIS cuando supera 1.000 UVT.",
   "aplica": "Empresas que inviertan en proyectos I+D+i calificados por el CNBT; el crédito fiscal del 256-1 es exclusivo de micro, pequeñas y medianas empresas.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "tecnologia"
   ],
   "temas": [
    "descuentos tributarios",
    "credito fiscal",
    "i+d+i",
    "mipymes",
    "tidis"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 256 fue modificado por la Ley 1955 de 2019 y adicionado por las Leyes 2069 de 2020 y 2130 de 2021; el 256-1 fue creado por el art. 168 de la Ley 1955 de 2019 y reglamentado por el Decreto 1011 de 2020.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_260_1_260_11",
   "tipo": "estatuto",
   "numero": "Arts. 260-1 a 260-11",
   "anio": 1989,
   "titulo": "ET Arts. 260-1 a 260-11 — Régimen de precios de transferencia",
   "resumen": "Las operaciones con vinculados del exterior, vinculados en zona franca o terceros en jurisdicciones no cooperantes deben pactarse como entre independientes (plena competencia). Exige declaración informativa y documentación comprobatoria (informe local, maestro y país por país) según topes.",
   "aplica": "PJ con operaciones con vinculados del exterior o en jurisdicciones no cooperantes; topes generales: patrimonio bruto ≥100.000 UVT o ingresos brutos ≥61.000 UVT.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "precios de transferencia",
    "vinculados",
    "plena competencia",
    "documentacion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_261_286",
   "tipo": "estatuto",
   "numero": "Arts. 261-286",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 261 a 286 — Patrimonio bruto, deudas y valor patrimonial de los activos",
   "resumen": "Reglas para declarar el patrimonio: qué bienes integran el patrimonio bruto, cómo se valoran inmuebles (mayor entre costo y avalúo catastral para no obligados a llevar contabilidad), vehículos, acciones y depósitos, y qué deudas se pueden restar para llegar al patrimonio líquido. Es la base del control de la DIAN sobre incrementos no justificados.",
   "aplica": "Declarantes de renta que diligencian la sección de patrimonio del formulario 210 y contribuyentes del impuesto al patrimonio.",
   "impuestos": [
    "renta-pn",
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "patrimonio",
    "valor patrimonial",
    "deudas",
    "activos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Varios artículos fueron ajustados por la Ley 1819 de 2016 para alinear el valor patrimonial con los marcos contables.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_299_318",
   "tipo": "estatuto",
   "numero": "Arts. 299-317",
   "anio": 1989,
   "titulo": "ET Arts. 299-317 — Ganancias ocasionales de personas jurídicas",
   "resumen": "Impuesto complementario de ganancias ocasionales: grava utilidades en venta de activos fijos poseídos dos años o más, liquidación de sociedades y otros ingresos extraordinarios. Para sociedades la tarifa subió del 10% al 15% desde 2023; loterías, rifas y apuestas mantienen el 20%.",
   "aplica": "Sociedades que vendan activos fijos con más de dos años de posesión o reciban utilidades extraordinarias por fuera del giro ordinario del negocio.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "ganancias ocasionales",
    "tarifas",
    "venta de activos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Tarifa del art. 313 elevada al 15% por la Ley 2277 de 2022. El art. 318 que cerraba el título fue derogado por la Ley 1111 de 2006.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_365_419",
   "tipo": "estatuto",
   "numero": "Arts. 365-419",
   "anio": 1989,
   "titulo": "ET Libro Segundo (Arts. 365 a 419): retención en la fuente",
   "resumen": "Regula el recaudo anticipado del impuesto: quiénes son agentes de retención, conceptos y tarifas (laborales, honorarios, compras, dividendos, pagos al exterior), y las obligaciones de declarar, consignar y certificar. Es la información que la DIAN cruza contra la exógena y la factura electrónica.",
   "aplica": "Agentes de retención (PJ, entidades públicas y PN comerciantes con los topes del Art. 368-2) y beneficiarios de pagos sujetos a retención.",
   "impuestos": [
    "retefuente",
    "autorretencion"
   ],
   "perfiles": [
    "persona-juridica",
    "empleador",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "agentes-retencion",
    "tarifas",
    "certificados"
   ],
   "estado": "modificada",
   "nota_vigencia": "Las bases y tarifas operativas se reglamentan en el DUR 1625 de 2016; la Ley 2277 de 2022 modificó la retención sobre dividendos.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_406_419",
   "tipo": "estatuto",
   "numero": "Arts. 406-419",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 406 a 419 — Retención por pagos al exterior",
   "resumen": "Régimen de retención sobre pagos a no residentes y sociedades extranjeras sin domicilio en Colombia: obligación de retener (art. 406), tarifas del art. 408 (20% general para intereses, regalías, honorarios y servicios técnicos, entre otras) y reglas especiales por concepto. La retención es, en general, el impuesto definitivo del no residente.",
   "aplica": "Empresas colombianas que giran al exterior por servicios, regalías, intereses, asistencia técnica o compran a plataformas extranjeras con presencia económica significativa.",
   "impuestos": [
    "retefuente",
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "no-residente",
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "pagos al exterior",
    "no residentes",
    "presencia economica significativa",
    "convenios"
   ],
   "estado": "vigente",
   "nota_vigencia": "La Ley 2277 de 2022 añadió al art. 408 la retención del 10% por pagos a no residentes con presencia económica significativa (PES) en Colombia.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_420_513",
   "tipo": "estatuto",
   "numero": "Arts. 420-513",
   "anio": 1989,
   "titulo": "ET Libro Tercero (Arts. 420 a 513): IVA e impuesto nacional al consumo",
   "resumen": "Define hecho generador, bienes y servicios excluidos y exentos, tarifas, responsables y no responsables, IVA descontable y períodos de declaración; incluye el INC (Arts. 512-1 y siguientes). La Ley 1819 de 2016 llevó la tarifa general al 19% y las leyes 1943 y 2010 reorganizaron a los responsables.",
   "aplica": "Responsables de IVA e INC, y no responsables que deben vigilar los topes de 3.500 UVT del parágrafo 3 del Art. 437.",
   "impuestos": [
    "iva",
    "inc"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "exclusiones",
    "responsables",
    "iva-descontable"
   ],
   "estado": "modificada",
   "nota_vigencia": "El INC fue creado por la Ley 1607 de 2012; la categoría de 'no responsables' reemplazó al régimen simplificado desde la Ley 1943 de 2018.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_483_498",
   "tipo": "estatuto",
   "numero": "Arts. 483 a 498",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Arts. 483 a 498 — Determinación del IVA e impuestos descontables",
   "resumen": "Reglas para depurar el IVA por pagar: impuesto generado menos descontables. Solo es descontable el IVA de costos y gastos imputables a operaciones gravadas o exentas (arts. 485 y 488); con ingresos mixtos se aplica proporcionalidad (art. 490) y los descontables deben imputarse dentro de la oportunidad del art. 496.",
   "aplica": "Para liquidar bien el formulario 300: qué IVA de compras se descuenta, cómo prorratear cuando hay ingresos excluidos y hasta cuándo imputar descontables.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "impuestos descontables",
    "proporcionalidad",
    "depuración",
    "saldos a favor"
   ],
   "estado": "vigente",
   "nota_vigencia": "Las reglas de oportunidad del art. 496 fueron ampliadas por la Ley 1819 de 2016.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_519_554",
   "tipo": "estatuto",
   "numero": "Arts. 519-554",
   "anio": 1989,
   "titulo": "Impuesto de timbre nacional (ET, Arts. 519-554)",
   "resumen": "Marco del impuesto de timbre. La tarifa general del Art. 519 está en 0% desde 2010, pero la Ley 2277 de 2022 dejó gravada la enajenación de inmuebles desde 20.000 UVT (1,5% y 3%) y subsisten timbres fijos para ciertas actuaciones. Durante 2025 la tarifa general subió temporalmente al 1% por el Decreto 175.",
   "aplica": "Otorgantes, giradores y aceptantes de documentos públicos o privados; notarios y demás agentes de retención de timbre. Hoy pesa sobre todo en escrituras de inmuebles de alto valor.",
   "impuestos": [
    "timbre"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "inmuebles",
    "agentes de retencion",
    "documentos"
   ],
   "estado": "vigente",
   "nota_vigencia": "La tarifa general volvió a 0% el 1°-ene-2026 al expirar el Decreto Legislativo 175 de 2025; sigue el timbre de inmuebles sobre 20.000 UVT (Ley 2277 de 2022).",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_565_570",
   "tipo": "estatuto",
   "numero": "Arts. 565-570",
   "anio": 1989,
   "titulo": "Formas de notificación de las actuaciones de la DIAN",
   "resumen": "Regula cómo se notifican requerimientos, liquidaciones oficiales, resoluciones sancionatorias y demás actos: notificación electrónica, personal, por correo a la dirección del RUT, por aviso o por publicación. El art. 566-1 hace de la notificación electrónica la vía preferente cuando el contribuyente reportó correo en el RUT.",
   "aplica": "Cualquier contribuyente o usuario aduanero/cambiario que reciba actos administrativos de la DIAN; clave mantener actualizado el correo del RUT.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "notificaciones",
    "notificacion electronica",
    "debido proceso",
    "rut"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 566-1 fue desarrollado por la Resolución DIAN 38 de 2020: los términos para responder corren 5 días después de la entrega del correo.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_588_590",
   "tipo": "estatuto",
   "numero": "Arts. 588-590",
   "anio": 1989,
   "titulo": "Corrección voluntaria de las declaraciones tributarias",
   "resumen": "El contribuyente puede corregir sus declaraciones dentro de los 3 años siguientes al vencimiento del plazo para declarar y antes del requerimiento especial, liquidando la sanción de corrección si aumenta el impuesto. El art. 589 regula las correcciones que disminuyen el valor a pagar y el 590 las correcciones provocadas por la DIAN.",
   "aplica": "Cualquier declarante que detecte errores en renta, IVA, retención u otros impuestos nacionales y quiera corregir antes de que actúe la DIAN.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "correcciones",
    "plazos",
    "sancion por correccion",
    "declaraciones"
   ],
   "estado": "modificada",
   "nota_vigencia": "El art. 107 de la Ley 2010 de 2019 amplió el término de corrección del art. 588 de 2 a 3 años, alineándolo con la firmeza general del art. 714.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_592_594_3",
   "tipo": "estatuto",
   "numero": "Arts. 592-594-3",
   "anio": 1989,
   "titulo": "Estatuto Tributario, arts. 592 a 594-3 — Personas naturales no obligadas a declarar renta",
   "resumen": "Fija los topes que liberan de declarar: ingresos brutos inferiores a 1.400 UVT, patrimonio bruto bajo 4.500 UVT y, según el art. 594-3, consumos con tarjeta, compras totales y consignaciones bancarias que no superen 1.400 UVT cada uno. Basta superar un solo tope para quedar obligado.",
   "aplica": "Cualquier persona natural que quiera saber si debe presentar declaración de renta por el año gravable; los topes se miden en UVT del año declarado.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "obligados a declarar",
    "topes",
    "uvt",
    "consignaciones"
   ],
   "estado": "vigente",
   "nota_vigencia": "La declaración presentada por un no obligado produce efectos legales (art. 6 ET) y puede generar saldo a favor por retenciones.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_631_633",
   "tipo": "estatuto",
   "numero": "Arts. 631-633",
   "anio": 1989,
   "titulo": "ET Arts. 631 a 633: información exógena tributaria",
   "resumen": "Base legal de la exógena: la DIAN puede pedir información de terceros para cruces y fiscalización. El parágrafo 3 del art. 631 obliga a expedir la resolución que define obligados, contenido y plazos con al menos dos meses de antelación al cierre del año gravable anterior al reportado, garantía de que las reglas se conocen a tiempo.",
   "aplica": "Personas y entidades señaladas cada año como reportantes de exógena (reglas hoy compiladas en la Resolución Única 000227 de 2025).",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "reportes",
    "sanciones",
    "resolucion-anual",
    "exogena",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Las condiciones de cada año gravable se fijan mediante resolución DIAN expedida al amparo de estos artículos.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_689_2_689_3",
   "tipo": "estatuto",
   "numero": "Arts. 689-2 y 689-3",
   "anio": 1989,
   "titulo": "Beneficio de auditoría: firmeza anticipada de la declaración de renta",
   "resumen": "La declaración de renta queda en firme en solo 6 meses si el impuesto neto crece al menos 35% frente al año anterior, o en 12 meses si crece 25%, siempre que el impuesto del año previo sea de mínimo 71 UVT y la declaración se presente y pague oportunamente. No aplica a quienes gocen de beneficios tributarios por su ubicación en zona geográfica y se pierde si se usan retenciones inexistentes; si se liquidan pérdidas…",
   "aplica": "Declarantes de renta (PJ y PN) que puedan aumentar el impuesto neto y quieran blindar su declaración contra revisión de la DIAN.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "firmeza",
    "beneficio de auditoria",
    "renta",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 689-3 (Ley 2155 de 2021) fue prorrogado por la Ley 2294 de 2023 para los años gravables 2024, 2025 y 2026.",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_720_741",
   "tipo": "estatuto",
   "numero": "Arts. 720-741",
   "anio": 1989,
   "titulo": "Recursos contra los actos de la DIAN: reconsideración",
   "resumen": "Contra liquidaciones oficiales y resoluciones sancionatorias procede el recurso de reconsideración dentro de los 2 meses siguientes a la notificación. La DIAN tiene 1 año para resolverlo; si no lo hace, opera el silencio administrativo positivo a favor del contribuyente. Agotada esta vía se abre la demanda ante lo contencioso.",
   "aplica": "Quien recibió una liquidación oficial o sanción y quiere discutirla en sede administrativa antes de ir a juicio; los plazos son perentorios.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "recursos",
    "reconsideracion",
    "silencio positivo",
    "via gubernativa"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_817_849",
   "tipo": "estatuto",
   "numero": "Arts. 817-849",
   "anio": 1989,
   "titulo": "Prescripción de la acción de cobro y proceso administrativo de cobro coactivo",
   "resumen": "La acción de cobro prescribe en 5 años contados desde la exigibilidad de la obligación (art. 817). La DIAN cobra directamente sin juez: mandamiento de pago, excepciones del deudor (art. 831), medidas cautelares como embargos y secuestros, remate de bienes. La facilidad de pago y la demanda interrumpen o suspenden términos.",
   "aplica": "Deudores morosos de obligaciones administradas por la DIAN; conocer las excepciones y la prescripción es la defensa principal frente a un mandamiento de pago.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "cobro coactivo",
    "prescripcion",
    "embargos",
    "mandamiento de pago"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "alta",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "ley_79_1988",
   "tipo": "ley",
   "numero": "79",
   "anio": 1988,
   "titulo": "Ley 79 de 1988: legislación cooperativa",
   "resumen": "Marco legal del cooperativismo: define qué es una cooperativa, su constitución, los fondos sociales obligatorios y la aplicación de excedentes (art. 54). Es la base sobre la que el art. 19-4 ET determina el excedente fiscal y ordena tomar el impuesto de renta del fondo de educación y solidaridad.",
   "aplica": "Cooperativas y organismos de segundo y tercer grado; referencia obligada para liquidar la renta del sector solidario en el RTE.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "cooperativas",
    "excedentes",
    "fondos sociales"
   ],
   "estado": "modificada",
   "nota_vigencia": "Complementada y parcialmente modificada por la Ley 454 de 1998.",
   "importancia": "alta",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=1625669"
  },
  {
   "id": "sentencia_c_006_2026",
   "tipo": "sentencia",
   "numero": "C-006",
   "anio": 2026,
   "titulo": "Sentencia C-006 de 2026 — Exclusiones de los impuestos saludables ajustadas a la Constitución",
   "resumen": "Declaró exequibles, por decisión unánime (7 votos), los apartes demandados de los arts. 513-1 y 513-6 ET (impuestos saludables de la Ley 2277 sobre bebidas ultraprocesadas azucaradas y comestibles ultraprocesados), frente a una demanda que alegaba trato inequitativo por las exclusiones de ciertos productos de origen animal. La Corte concluyó que las exclusiones obedecen a criterios técnicos objetivos y que el fin…",
   "aplica": "Productores e importadores de bebidas azucaradas y ultraprocesados: refuerza la solidez constitucional de estos impuestos y de sus exclusiones.",
   "impuestos": [
    "saludables"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "exclusiones",
    "equidad tributaria",
    "ultraprocesados",
    "impuestos saludables",
    "exequibilidad",
    "salud publica"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30056067"
  },
  {
   "id": "sentencia_c_075_2026",
   "tipo": "sentencia",
   "numero": "C-075",
   "anio": 2026,
   "titulo": "Sentencia C-075 de 2026 — Inexequibilidad de la emergencia económica de diciembre de 2025",
   "resumen": "Tumbó la declaratoria del estado de emergencia económica (Decreto 1390 de 2025): la crisis fiscal invocada tras hundirse la ley de financiamiento era estructural y previsible, no sobreviniente, y debía tramitarse por el Congreso. Con su caída quedaron sin piso los decretos tributarios expedidos a su amparo.",
   "aplica": "Contexto obligatorio para entender por qué los impuestos de la emergencia (patrimonio ampliado, IVA a juegos online, hidrocarburos) no rigen en 2026.",
   "impuestos": [
    "procedimiento",
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "emergencia economica",
    "control constitucional",
    "estados de excepcion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/comunicados/Comunicado-14-Abril-9-de-2026.pdf"
  },
  {
   "id": "concepto_dian_10196_2025",
   "tipo": "concepto",
   "numero": "10196 (int. 1147)",
   "anio": 2025,
   "titulo": "Concepto DIAN 10196 de 2025 — Exención del GMF en varias cuentas (Art. 881-1 ET)",
   "resumen": "Aclara cómo opera la exención del 4x1.000 tras el Art. 881-1 del ET: desde el 13-dic-2024 una persona natural puede repartir las 350 UVT mensuales exentas entre varias cuentas de ahorro, depósitos electrónicos o tarjetas prepago, incluso de distintas entidades, sin marcar una única cuenta.",
   "aplica": "Personas naturales con varias cuentas y entidades financieras que deben operar el sistema de control y verificación del Art. 881-1 del ET.",
   "impuestos": [
    "gmf"
   ],
   "perfiles": [
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "4x1000",
    "exenciones",
    "doctrina"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_10196_2025.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_2687_2025",
   "tipo": "concepto",
   "numero": "2687 (int. 303)",
   "anio": 2025,
   "titulo": "Concepto DIAN 2687 de 2025 — Concepto general del impuesto de timbre (Decreto 175 de 2025)",
   "resumen": "Concepto general de la DIAN sobre el timbre reactivado al 1% por el Decreto 175 de 2025: causación pago a pago en contratos de cuantía indeterminada, umbral de 6.000 UVT, agentes de retención y articulación de la tarifa temporal con las reglas de los Arts. 519 y 522 del ET.",
   "aplica": "Útil hoy para revisar el cierre de 2025: los contratos firmados o pagados ese año pueden seguir generando discusiones de timbre en fiscalización.",
   "impuestos": [
    "timbre"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "contratos",
    "agentes de retencion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Reconsiderado parcialmente por el Concepto 4803 (int. 493) de 2025; su norma base perdió vigencia el 31-dic-2025.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_2687_2025.htm",
   "url_alt": "https://www.dian.gov.co/Contribuyentes-Plus/Documents/7-CONCEPTO-002687-int-303-05032025.pdf"
  },
  {
   "id": "concepto_dian_4803_2025",
   "tipo": "concepto",
   "numero": "4803 (int. 493)",
   "anio": 2025,
   "titulo": "Concepto DIAN 4803 de 2025 — Timbre en contratos de cuantía indeterminada",
   "resumen": "Ajustó la doctrina del timbre para contratos de cuantía indeterminada suscritos antes del Decreto 175 de 2025: los pagos anteriores al 22-feb-2025 conservan tarifa 0% y los posteriores causan el 1% hasta el 31-dic-2025, siempre que se superen 6.000 UVT y se cumplan los Arts. 519 y 522 del ET.",
   "aplica": "Empresas con contratos de tracto sucesivo o cuantía indeterminada que estuvieron vigentes durante 2025; soporte para revisar las retenciones de timbre practicadas.",
   "impuestos": [
    "timbre"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "cuantia indeterminada",
    "tarifas"
   ],
   "estado": "vigente",
   "nota_vigencia": "Doctrina sobre una tarifa temporal que expiró el 31-dic-2025.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_4803_2025.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000237_2025",
   "tipo": "resolucion",
   "numero": "000237",
   "anio": 2025,
   "titulo": "Resolución DIAN 000237 de 2025 – corrección de yerro formal en los ajustes de exógena",
   "resumen": "Corrigió un error formal de la Resolución 000233 de 2025: aclaró que solo se modificaban los incisos del artículo sobre reporte de pagos, abonos en cuenta y retenciones de la Resolución Única, y no el artículo completo, cuyos parágrafos permanecen vigentes. Evita lecturas equivocadas sobre el alcance de los cambios al reporte de pagos.",
   "aplica": "Reportantes de exógena que aplican los ajustes de la Resolución 000233 de 2025 en los reportes de pagos y retenciones.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "exogena",
    "correccion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0237_2025.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_099_2025",
   "tipo": "sentencia",
   "numero": "C-099",
   "anio": 2025,
   "titulo": "Sentencia C-099 de 2025 — Impuesto a plásticos cubre la importación de bienes empacados",
   "resumen": "Amplió el impuesto a plásticos de un solo uso en importaciones: tumbó la expresión 'para consumo propio' del Art. 51 de la Ley 2277 de 2022, de modo que también queda gravada la importación de bienes que llegan envasados, embalados o empacados en plásticos de un solo uso.",
   "aplica": "Importadores de mercancía que viene empacada en plásticos de un solo uso: desde esta sentencia su operación queda cubierta por el tributo.",
   "impuestos": [
    "carbono",
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "plasticos de un solo uso",
    "importaciones",
    "impuestos verdes"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-099_2025.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2025/c-099-25.htm"
  },
  {
   "id": "concepto_dian_001816_2024",
   "tipo": "concepto",
   "numero": "001816 (int. 48)",
   "anio": 2024,
   "titulo": "Concepto DIAN 001816 de 2024 – Estimación de costos y gastos en la cédula general de personas naturales",
   "resumen": "Adición al concepto general de renta de personas naturales que explica la estimación de costos y gastos de la cédula general: tope indicativo del 60% de los ingresos brutos en rentas de trabajo no laborales y la posibilidad de declarar montos superiores si están soportados en factura electrónica o documentos equivalentes.",
   "aplica": "Independientes y rentistas que imputan costos contra rentas de trabajo no laborales en su declaración de renta.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "cedula general",
    "costos y gastos",
    "soportes",
    "factura electronica"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1816_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_14119_2024",
   "tipo": "concepto",
   "numero": "014119 (int. 577)",
   "anio": 2024,
   "titulo": "Concepto DIAN 14119 de 2024 — Los beneficios hoteleros no se transfieren con el establecimiento",
   "resumen": "La DIAN concluye que la exención hotelera de la Ley 788 de 2002 es un beneficio personal e intransferible: no pasa al nuevo propietario cuando se vende el hotel. Quien adquiera el establecimiento debe cumplir por sí mismo los requisitos vigentes si pretende aplicar la tarifa especial del 15% del art. 240 del ET.",
   "aplica": "Compradores y vendedores de hoteles con beneficios tributarios en curso, y operadores que evalúan la tarifa del 15%.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "turismo-hoteles"
   ],
   "temas": [
    "hoteleria",
    "rentas exentas",
    "tarifas",
    "doctrina dian"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_14119_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_4689_2024",
   "tipo": "concepto",
   "numero": "004689 (int. 544)",
   "anio": 2024,
   "titulo": "Concepto DIAN 4689 de 2024 — Exclusividad de actividades para la tarifa del 20% en zona franca",
   "resumen": "La DIAN precisa que el usuario industrial de zona franca solo accede a la tarifa preferencial del 20% si desarrolla exclusivamente las actividades para las que fue calificado o autorizado, además de suscribir y cumplir el plan de internacionalización con MinCIT; los ingresos por actividades ajenas rompen la exclusividad.",
   "aplica": "Usuarios industriales de zona franca con ingresos mixtos o actividades adicionales a las autorizadas en su calificación.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "exclusividad",
    "tarifas",
    "doctrina dian"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_4689_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_6999_2024",
   "tipo": "concepto",
   "numero": "823 [006999]",
   "anio": 2024,
   "titulo": "Concepto DIAN 823 [006999] de 2024: efectos temporales de la C-540 de 2023 en el SIMPLE",
   "resumen": "Precisa que las tarifas revividas por la Sentencia C-540 de 2023 (numeral 3 del art. 908 ET, versión Ley 2155 de 2021) aplican desde el 5 de diciembre de 2023 hacia futuro: los anticipos liquidados antes con las normas declaradas inexequibles no se recalculan y conservan validez.",
   "aplica": "Contribuyentes del SIMPLE de los antiguos grupos 4 y 5 (educación, salud, profesiones liberales) que deban definir qué tarifa aplicar a cada bimestre de 2023 y siguientes.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica",
    "independiente"
   ],
   "sectores": [
    "servicios",
    "salud",
    "educacion"
   ],
   "temas": [
    "doctrina",
    "tarifas",
    "efectos en el tiempo"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://cijuf.org.co/normatividad/concepto/2024/concepto-823006999.html"
  },
  {
   "id": "concepto_dian_978_2024",
   "tipo": "concepto",
   "numero": "24 [000978]",
   "anio": 2024,
   "titulo": "Concepto DIAN 24 [000978] de 2024: tarifas y anticipos tras la Sentencia C-540 de 2023",
   "resumen": "Tercera adición al Concepto General del SIMPLE (977 [131] de 2023) sobre cómo declarar y pagar después de la C-540 de 2023: los servicios profesionales y de consultoría vuelven a las tarifas del numeral 3 del art. 908 ET en la versión de la Ley 2155 de 2021, y así deben liquidarse los anticipos bimestrales y la declaración anual.",
   "aplica": "Profesiones liberales y consultores del SIMPLE que necesiten soporte doctrinal de qué tabla de tarifas usar en el F2593 y el F260 desde diciembre de 2023.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "independiente",
    "persona-juridica"
   ],
   "sectores": [
    "servicios"
   ],
   "temas": [
    "doctrina",
    "tarifas",
    "anticipos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Complementado por el Concepto 823 [006999] de 2024 sobre los efectos temporales de la sentencia.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_0978_2024.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_0242_2024",
   "tipo": "decreto",
   "numero": "0242",
   "anio": 2024,
   "titulo": "Decreto 0242 de 2024 — Ajuste de tarifas de retención y autorretención para minería e hidrocarburos",
   "resumen": "Sustituyó los arts. 1.2.4.10.12 y 1.2.6.8 del DUR: redujo la retención sobre divisas provenientes de exportación de hidrocarburos, carbón y demás productos mineros, y reajustó las tarifas de autorretención especial por CIIU en un rango de 0,55% a 2,60%, para proteger la liquidez de esas compañías y reducir devoluciones.",
   "aplica": "Exportadores de hidrocarburos, carbón y minerales, y en general autorretenedores que consultan la tabla de tarifas vigente por actividad económica.",
   "impuestos": [
    "autorretencion",
    "retefuente",
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "mineria-energia"
   ],
   "temas": [
    "tarifas",
    "exportaciones",
    "divisas",
    "ciiu"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sus tablas fueron sustituidas por el Decreto 572 de 2025 y recobraron aplicación temporal desde el 8 de mayo de 2026 por la suspensión provisional que decretó el Consejo de Estado; sin embargo, esa suspensión fue revocada el 2 de junio de 2026 y las tarifas del Decreto 572 vuelven a regir desde el p",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0242_2024.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=235270"
  },
  {
   "id": "resolucion_dian_000008_2024",
   "tipo": "resolucion",
   "numero": "000008",
   "anio": 2024,
   "titulo": "Resolución DIAN 000008 de 2024 - Nuevos plazos del documento equivalente electrónico",
   "resumen": "Primera modificación de la Resolución 000165 de 2023: cambió el art. 23 y el parágrafo del art. 62 para reprogramar el calendario de implementación del documento equivalente electrónico, empezando por el tiquete POS electrónico según calidades del contribuyente durante 2024.",
   "aplica": "Comercios y prestadores que migran del POS de papel al tiquete POS electrónico y demás documentos equivalentes electrónicos.",
   "impuestos": [
    "facturacion-electronica",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "plazos",
    "pos electronico",
    "calendarios"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 000165 de 2023; calendarios posteriormente ajustados de nuevo por la Resolución 000119 de 2024.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0008_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000119_2024",
   "tipo": "resolucion",
   "numero": "000119",
   "anio": 2024,
   "titulo": "Resolución DIAN 000119 de 2024 - Ajustes a equivalentes electrónicos, tiquetes aéreos e idiomas",
   "resumen": "Modifica la Resolución 000165 de 2023: amplía plazos de implementación del documento equivalente electrónico para servicios públicos, transporte de pasajeros y extractos; permite transmitir tiquetes aéreos vendidos por GDS dentro de 48 horas; y flexibiliza idiomas y monedas en la representación gráfica.",
   "aplica": "Empresas de servicios públicos, transporte de pasajeros, entidades que expiden extractos y aerolíneas/agencias que venden por sistemas de distribución global.",
   "impuestos": [
    "facturacion-electronica",
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "servicios",
    "transporte",
    "financiero"
   ],
   "temas": [
    "plazos",
    "tiquetes aereos",
    "representacion grafica",
    "documento equivalente electronico"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 000165 de 2023.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0119_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000120_2024",
   "tipo": "resolucion",
   "numero": "000120",
   "anio": 2024,
   "titulo": "Resolución DIAN 000120 de 2024 — Modifica el instructivo del formulario 210 (Res. 000044 de 2024)",
   "resumen": "Modifica el instructivo del formulario 210 prescrito por la Resolución 000044 de 2024: precisa que las rentas de capital y no laborales entran en el cálculo del límite del 40% (máximo 1.340 UVT) de rentas exentas y deducciones del artículo 336 del ET, y anuncia la herramienta de diligenciamiento asistido 'Usuario no experto'.",
   "aplica": "Personas naturales residentes que declaran renta en el formulario 210 desde el AG 2023; la versión vigente del 210 se lee junto con la Resolución 000044 de 2024.",
   "impuestos": [
    "renta-pn"
   ],
   "perfiles": [
    "persona-natural",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "formulario 210",
    "instructivo",
    "limite 40%",
    "rentas exentas"
   ],
   "estado": "vigente",
   "nota_vigencia": "Complementa la Resolución 000044 de 2024, que prescribió el formulario 210 vigente desde el AG 2023 y siguientes.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0120_2024.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000189_2024",
   "tipo": "resolucion",
   "numero": "000189",
   "anio": 2024,
   "titulo": "Resolución DIAN 000189 de 2024 - Profesionales de divisas y pequeños acueductos",
   "resumen": "Modifica la Resolución 000165 de 2023 en dos frentes sectoriales: exige a los profesionales de compra y venta de divisas incluir en la factura electrónica datos de tasa de cambio y moneda, y permite que pequeños prestadores de acueducto, alcantarillado y aseo (menos de 2.500 suscriptores, sin ánimo de lucro) sigan con documento equivalente físico.",
   "aplica": "Casas y profesionales de cambio de divisas y pequeños prestadores comunitarios de servicios públicos domiciliarios.",
   "impuestos": [
    "facturacion-electronica",
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "esal"
   ],
   "sectores": [
    "financiero",
    "servicios"
   ],
   "temas": [
    "divisas",
    "servicios publicos",
    "documento equivalente"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica la Resolución 000165 de 2023.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0189_2024.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c488_2024",
   "tipo": "sentencia",
   "numero": "C-488",
   "anio": 2024,
   "titulo": "Sentencia C-488 de 2024 — Tasa mínima de tributación avalada",
   "resumen": "Declaró exequible el cálculo de la tasa mínima del 15% (Art. 240 par. 6 ET): partir de la utilidad contable para llegar a la utilidad depurada no viola la capacidad contributiva, y el trato a los grupos que consolidan estados financieros está justificado. Junto con la C-219 de 2024, blindó la TTD frente a las demandas.",
   "aplica": "PJ contribuyentes de renta sujetas al cálculo de la tasa de tributación depurada (TTD) en el formulario 110.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tasa-minima",
    "ttd",
    "capacidad-contributiva"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-488_2024.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_165_2023",
   "tipo": "concepto",
   "numero": "100208192-165",
   "anio": 2023,
   "titulo": "Concepto General de la DIAN sobre procedimiento tributario y aduanero (Ley 2277 de 2022)",
   "resumen": "Doctrina oficial que resuelve las dudas de aplicación de los cambios procedimentales de la Ley 2277: alcance del saneamiento de retenciones ineficaces (art. 78), tasa de interés transitoria (art. 91), reducción transitoria de sanciones (art. 93) y la nueva sanción de exógena con favorabilidad. Tuvo adiciones posteriores en 2023.",
   "aplica": "Contadores y abogados que necesiten la posición vinculante de la DIAN sobre los alivios y cambios procedimentales de la reforma de 2022.",
   "impuestos": [
    "procedimiento",
    "retefuente",
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "alivios",
    "ineficacia",
    "exogena",
    "favorabilidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "Adicionado por oficios posteriores de 2023 (entre ellos el Oficio 3896 de 2023); los beneficios transitorios que interpreta ya expiraron.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1328_2023.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Documents/Concepto-General-materia-procedimiento-tributario-y-aduanero-motivo-Ley-2277-2022.pdf"
  },
  {
   "id": "decreto_0261_2023",
   "tipo": "decreto",
   "numero": "0261",
   "anio": 2023,
   "titulo": "Decreto 0261 de 2023 — Aumento de tarifas de autorretención especial por actividad CIIU",
   "resumen": "Sustituyó el art. 1.2.6.8 del DUR y elevó las tarifas de autorretención especial de renta para la generalidad de actividades económicas, con incrementos especialmente fuertes para extracción de petróleo, carbón y demás productos mineros, como mecanismo de recaudo anticipado del impuesto.",
   "aplica": "Autorretenedores del Decreto 2201 de 2016: deben ubicar su código CIIU en la tabla para conocer la tarifa mensual aplicable.",
   "impuestos": [
    "autorretencion",
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "tarifas",
    "ciiu",
    "autorretencion especial"
   ],
   "estado": "modificada",
   "nota_vigencia": "El Decreto 0242 de 2024 redujo varias de sus tarifas del sector minero-energético. Con la suspensión provisional del Decreto 572 de 2025 (7 de mayo de 2026) sus tablas recobraron aplicación temporal, pero el Consejo de Estado revocó esa suspensión el 2 de junio de 2026: las tarifas del Decreto 572 v",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0261_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=204483"
  },
  {
   "id": "decreto_2039_2023",
   "tipo": "decreto",
   "numero": "2039",
   "anio": 2023,
   "titulo": "Decreto 2039 de 2023 – Reglamentación de la presencia económica significativa (PES)",
   "resumen": "Reglamentó la tributación por presencia económica significativa del art. 20-3 ET, vigente desde el 1-ene-2024: umbral de ingresos brutos de 31.300 UVT o más por operaciones con clientes en Colombia, interacción deliberada y sistemática con 300.000 o más clientes o usuarios, y la opción del no residente entre declarar renta al 3% sobre ingresos brutos con anticipos bimestrales del 2% o la retención del 10% del art. 40",
   "aplica": "No residentes con ventas digitales o de bienes a clientes en Colombia y los pagadores que deben evaluar la retención del 10%.",
   "impuestos": [
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "no-residente",
    "persona-juridica"
   ],
   "sectores": [
    "tecnologia"
   ],
   "temas": [
    "pes",
    "economia digital",
    "anticipo bimestral",
    "registro rut"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2039_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=225690"
  },
  {
   "id": "ley_2294_2023",
   "tipo": "ley",
   "numero": "2294",
   "anio": 2023,
   "titulo": "Ley 2294 de 2023 — Plan Nacional de Desarrollo 2022-2026",
   "resumen": "El Plan Nacional de Desarrollo 2022-2026 modificó el art. 800-1 del ET (art. 294): amplió los convenios de obras por impuestos a proyectos de agua, energía, salud y educación públicas, bienes públicos rurales y vivienda rural de interés social en municipios ZOMAC y PDET, articulándolos con obras por regalías.",
   "aplica": "Contribuyentes que estructuren convenios de obras por impuestos bajo el art. 800-1 en territorios ZOMAC, PDET y demás priorizados por el PND.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "beneficio auditoria",
    "firmeza",
    "plan de desarrollo",
    "beneficio de auditoria",
    "plan nacional de desarrollo",
    "obras por impuestos"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_2294_2023.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=209510"
  },
  {
   "id": "resolucion_dian_000071_2023",
   "tipo": "resolucion",
   "numero": "000071",
   "anio": 2023,
   "titulo": "Resolución DIAN 000071 de 2023 — Prescribe el formulario 420 del impuesto al patrimonio",
   "resumen": "Prescribe el formulario 420 para declarar el impuesto al patrimonio del año gravable 2023 y siguientes. Se diligencia y presenta virtualmente con firma electrónica por quienes posean patrimonio líquido igual o superior a 72.000 UVT al 1 de enero, incluidas ciertas sociedades extranjeras no declarantes de renta.",
   "aplica": "Personas naturales, sucesiones ilíquidas y sociedades extranjeras sujetas al impuesto al patrimonio; el 420 sigue vigente para la declaración que se presenta en mayo de 2026.",
   "impuestos": [
    "patrimonio"
   ],
   "perfiles": [
    "persona-natural",
    "no-residente",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "formulario 420",
    "patrimonio liquido",
    "declaracion anual"
   ],
   "estado": "vigente",
   "nota_vigencia": "Formulario vigente para el AG 2023 y siguientes, incluida la declaración de 2026.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0071_2023.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_435_2023",
   "tipo": "sentencia",
   "numero": "C-435",
   "anio": 2023,
   "titulo": "Sentencia C-435 de 2023 — Aval constitucional a los impuestos saludables",
   "resumen": "Primera defensa de los impuestos saludables: declaró constitucional el diseño del tributo a bebidas azucaradas y ultraprocesados creado por la Ley 2277 de 2022, al encontrarlo un impuesto correctivo legítimo que busca desestimular consumos nocivos para la salud y proteger especialmente a los niños.",
   "aplica": "Productores e importadores que cuestionaban el tributo: el impuesto quedó en firme y sigue siendo exigible.",
   "impuestos": [
    "saludables"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "bebidas azucaradas",
    "control constitucional",
    "salud publica"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2023/c-435-23.htm"
  },
  {
   "id": "sentencia_c_506_2023",
   "tipo": "sentencia",
   "numero": "C-506",
   "anio": 2023,
   "titulo": "Sentencia C-506 de 2023 — Sujeto pasivo del impuesto a plásticos de un solo uso",
   "resumen": "Depuró el impuesto a plásticos de un solo uso: retiró del Art. 50 de la Ley 2277 de 2022 expresiones que chocaban con el Art. 51, dejando claro que el sujeto pasivo es quien fabrica, ensambla o remanufactura envases, embalajes o empaques plásticos para venderlos, o quien los importa.",
   "aplica": "Fabricantes e importadores de envases, embalajes y empaques plásticos de un solo uso; la tarifa del tributo es de 0,00005 UVT por gramo.",
   "impuestos": [
    "carbono"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "plasticos de un solo uso",
    "impuestos verdes",
    "sujeto pasivo"
   ],
   "estado": "vigente",
   "nota_vigencia": "Complementada por la Sentencia C-099 de 2025 en materia de importaciones.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-506_2023.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2023/c-506-23.htm"
  },
  {
   "id": "decreto_2487_2022",
   "tipo": "decreto",
   "numero": "2487",
   "anio": 2022,
   "titulo": "Decreto 2487 de 2022 – plazos tributarios del año 2023",
   "resumen": "Fijó lugares y plazos de las obligaciones tributarias del año 2023 (renta AG2022, IVA, retención y demás) sustituyendo artículos del DUR 1625 de 2016, con vencimientos escalonados por el último dígito del NIT. Fue el último decreto de plazos anual con fechas exactas antes del cambio de modelo a días hábiles.",
   "aplica": "Valor histórico: sirve para verificar vencimientos de 2023 en discusiones de extemporaneidad o fiscalizaciones de ese año.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn",
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "plazos",
    "calendario"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Esquema reemplazado por el Decreto 2229 de 2023; sus calendarios quedaron agotados.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2487_2022.htm",
   "url_alt": ""
  },
  {
   "id": "ley_2238_2022",
   "tipo": "ley",
   "numero": "2238",
   "anio": 2022,
   "titulo": "Ley 2238 de 2022 — Extensión de la ZESE al Distrito de Buenaventura",
   "resumen": "Extendió el régimen ZESE del art. 268 de la Ley 1955 de 2019 al Distrito de Buenaventura: tarifa de renta del 0% por 5 años y del 50% de la general por 5 más para sociedades nuevas o existentes que se acogieran dentro del plazo legal. La Ley 2240 de 2022 hizo lo propio para Barrancabermeja. El art. 96 de la Ley 2277 de 2022 recortó la ventana de acogimiento hasta el 31 de diciembre de 2024.",
   "aplica": "Sociedades de Buenaventura que se acogieron al régimen a más tardar el 31 de diciembre de 2024 (plazo recortado por el art. 96 de la Ley 2277 de 2022); hoy solo ejecutan el beneficio, la ventana de entrada ya cerró.",
   "impuestos": [
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "zese",
    "buenaventura",
    "tarifas",
    "empleo"
   ],
   "estado": "modificada",
   "nota_vigencia": "El plazo original de acogimiento era de 3 años (hasta julio de 2025), pero el art. 96 de la Ley 2277 de 2022 lo limitó al 31 de diciembre de 2024. Quienes ingresaron conservan el beneficio por su término de 10 años.",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "http://www.secretariasenado.gov.co/senado/basedoc/ley_2238_2022.html"
  },
  {
   "id": "resolucion_dian_001092_2022",
   "tipo": "resolucion",
   "numero": "001092",
   "anio": 2022,
   "titulo": "Resolución DIAN 001092 de 2022 - Calendario del tope de 5 UVT para el tiquete POS",
   "resumen": "Fijó el calendario para hacer exigible el tope de 5 UVT (sin incluir impuestos) por documento POS ordenado por la Ley 2155 de 2021: grandes contribuyentes desde el 1 de febrero de 2023, declarantes de renta desde el 1 de abril, no declarantes desde el 1 de mayo y demás sujetos desde el 1 de junio de 2023.",
   "aplica": "Comercios con POS: toda venta que supere 5 UVT exige factura electrónica. El calendario ya se agotó, el tope rige para todos.",
   "impuestos": [
    "facturacion-electronica",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "5 uvt",
    "pos",
    "calendarios"
   ],
   "estado": "vigente",
   "nota_vigencia": "Calendario cumplido: desde el 1 de junio de 2023 el tope de 5 UVT aplica a todos los grupos; la regla quedó integrada a la Resolución 000165 de 2023.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_1092_2022.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_001255_2022",
   "tipo": "resolucion",
   "numero": "001255",
   "anio": 2022,
   "titulo": "Resolución DIAN 001255 de 2022 — Exógena del año gravable 2023",
   "resumen": "Estableció el grupo de obligados a suministrar exógena por el año gravable 2023 (reportada en 2024), con el contenido, las características técnicas de los formatos y los plazos de entrega. Es la norma de referencia para cualquier fiscalización o sanción asociada a los reportes de ese año.",
   "aplica": "Personas naturales y jurídicas, entidades públicas y agentes retenedores que cumplieron topes o calidades por el año gravable 2023.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "obligados",
    "formatos",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su ámbito se limita al año gravable 2023; para AG2024 en adelante rige el marco hoy compilado en la Resolución 000227 de 2025.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_1255_2022.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_305_2022",
   "tipo": "sentencia",
   "numero": "C-305",
   "anio": 2022,
   "titulo": "Sentencia C-305 de 2022 - Facturación del impuesto sobre la renta condicionada",
   "resumen": "La Corte Constitucional declaró exequible de forma condicionada la factura del impuesto sobre la renta (art. 14 de la Ley 2155 de 2021, art. 616-5 ET): el contribuyente conserva el derecho a presentar declaración privada conforme a su realidad económica, y al hacerlo la factura de la DIAN pierde fuerza ejecutoria.",
   "aplica": "Antecedente clave sobre los límites de la determinación oficial con datos de factura electrónica: la información del sistema no reemplaza la autodeclaración del contribuyente.",
   "impuestos": [
    "facturacion-electronica",
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "factura de renta",
    "determinacion oficial",
    "debido proceso"
   ],
   "estado": "vigente",
   "nota_vigencia": "El art. 616-5 ET que condicionó fue luego derogado por la Ley 2277 de 2022; la regla jurisprudencial sigue orientando los mecanismos de facturación oficial.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-305_2022.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/Relatoria/2022/C-305-22.htm"
  },
  {
   "id": "concepto_dian_901006_2021",
   "tipo": "concepto",
   "numero": "901006",
   "anio": 2021,
   "titulo": "Oficio DIAN 901006 de 2021 — El AIU del 462-1 no aplica a contratos de construcción",
   "resumen": "La DIAN aclara que la base gravable especial AIU del art. 462-1 del ET cubre únicamente los servicios allí listados (aseo y cafetería integrales, vigilancia, temporales y CTA). Los contratos de construcción no entran en esa norma: su base de IVA se rige por la regla propia del DUR 1625 de 2016 (art. 1.3.1.7.9, honorarios o utilidad del constructor).",
   "aplica": "Constructores y contratantes que liquidan IVA sobre contratos de obra, y empresas de servicios que confirman si su actividad califica para base AIU.",
   "impuestos": [
    "iva",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "construccion",
    "servicios"
   ],
   "temas": [
    "aiu",
    "construccion",
    "base gravable",
    "doctrina dian"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_901006_2021.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_904510_2021",
   "tipo": "concepto",
   "numero": "904510",
   "anio": 2021,
   "titulo": "Oficio DIAN 904510 de 2021 - Infracción cambiaria continuada",
   "resumen": "Doctrina DIAN sobre la infracción cambiaria continuada: exige un mismo infractor, una misma norma violada, conducta idéntica y unidad de propósito entre los distintos actos. Aclara que el simple incumplimiento de plazos del régimen cambiario no constituye, por sí solo, infracción continuada.",
   "aplica": "Útil al responder pliegos de cargos cambiarios con múltiples operaciones: define cuándo varios hechos se sancionan como una sola infracción. Hoy debe citarse a través del Concepto General Unificado 0086 de 2022, que recogió esta doctrina.",
   "impuestos": [
    "cambiario",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "infraccion continuada",
    "sanciones",
    "doctrina"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Revocado con la expedición del Concepto General Unificado en materia cambiaria DIAN 0086 (907919) del 22 de junio de 2022, que unificó la doctrina cambiaria; los elementos de la infracción continuada quedaron recogidos en ese concepto.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_904510_2021.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_0278_2021",
   "tipo": "decreto",
   "numero": "0278",
   "anio": 2021,
   "titulo": "Decreto 278 de 2021 — Modernización del régimen de zonas francas (zonas francas 4.0)",
   "resumen": "Modificó el Decreto 2147 de 2016 para flexibilizar el régimen (zonas francas 4.0): habilita el reconocimiento de activos intangibles como parte de los compromisos de inversión, permite acreditar el cumplimiento con inversiones ejecutadas desde la solicitud de declaratoria (hasta el 20% del compromiso), abre la figura a concesiones aeroportuarias y férreas, autoriza comercio electrónico y teletrabajo parcial…",
   "aplica": "Empresas que tramitan declaratorias o prórrogas de zonas francas y usuarios que acreditan compromisos de inversión y empleo.",
   "impuestos": [
    "aduanero",
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "intangibles",
    "infraestructura",
    "tramites"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0278_2021.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30041448"
  },
  {
   "id": "decreto_278_2021",
   "tipo": "decreto",
   "numero": "278",
   "anio": 2021,
   "titulo": "Decreto 278 de 2021 - Modernización del régimen de zonas francas",
   "resumen": "Modernizó el régimen de zonas francas: simplificó los trámites de declaratoria y calificación de usuarios, actualizó definiciones, reorganizó la Comisión Intersectorial y permitió que hasta el 50% del personal de los usuarios industriales de servicios trabaje por fuera del área declarada mediante teletrabajo.",
   "aplica": "Zonas francas declaradas y aspirantes a declaratoria; usuarios industriales de servicios interesados en trabajo remoto parcial.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "zonas-francas"
   ],
   "temas": [
    "zonas francas",
    "tramites",
    "teletrabajo"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0278_2021.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30041448"
  },
  {
   "id": "resolucion_dian_000063_2021",
   "tipo": "resolucion",
   "numero": "000063",
   "anio": 2021,
   "titulo": "Resolución DIAN 000063 de 2021 - Calendario definitivo de la nómina electrónica",
   "resumen": "Reprogramó la entrada en vigencia de la nómina electrónica: habilitación desde el 18 de agosto de 2021 y cuatro grupos según número de empleados, desde los de más de 250 (generación desde el 1 de septiembre de 2021) hasta los empleadores con 10 o menos trabajadores (desde el 1 de diciembre de 2021).",
   "aplica": "Todos los empleadores obligados a nómina electrónica; sirve para ubicar desde qué mes cada empleador quedó obligado a transmitir.",
   "impuestos": [
    "facturacion-electronica",
    "renta-pj"
   ],
   "perfiles": [
    "empleador",
    "persona-juridica",
    "persona-natural",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "nomina electronica",
    "calendarios",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Modifica las Resoluciones 000013 y 000037 de 2021. Las Resoluciones 000151 de 2021 y 000028 de 2022 dieron luego un plazo especial a los empleadores de 1 a 10 trabajadores, que cerraron la implementación en 2022; el calendario ya se agotó y la obligación rige plenamente.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0063_2021.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000124_2021",
   "tipo": "resolucion",
   "numero": "000124",
   "anio": 2021,
   "titulo": "Resolución DIAN 000124 de 2021 — Exógena del año gravable 2022",
   "resumen": "Prescribió la exógena del año gravable 2022 (reportada en 2023): obligados, topes de ingresos, contenido y especificaciones de los formatos 1001, 1003, 1005 a 1010 y 2276, entre otros, y los plazos de entrega. Sigue siendo el referente si la DIAN fiscaliza o sanciona los reportes de ese periodo.",
   "aplica": "Personas naturales y jurídicas, entidades públicas y agentes retenedores que cumplieron topes o calidades por el año gravable 2022.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "obligados",
    "formatos",
    "plazos"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificada parcialmente por la Resolución 000052 de 2023. Su ámbito se limita al año gravable 2022; el marco actual está compilado en la Resolución 000227 de 2025.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0124_2021.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000161_2021",
   "tipo": "resolucion",
   "numero": "000161",
   "anio": 2021,
   "titulo": "Resolución DIAN 000161 de 2021 - Exógena cambiaria en XML (formatos 1059 a 1070 y 2728)",
   "resumen": "Reguló la información exógena cambiaria en XML (formatos 1059 a 1070 y 2728) que IMC, concesionarios de correos y titulares de cuentas de compensación presentaban trimestralmente a la DIAN. Tuvo varias prórrogas y ajustes técnicos antes de ser reemplazada por el nuevo esquema de 2024-2025.",
   "aplica": "Aplicó a los reportes de información cambiaria y de endeudamiento externo presentados a la DIAN entre 2022 y la transición al esquema de la Resolución 000180 de 2024.",
   "impuestos": [
    "cambiario",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "informacion exogena cambiaria",
    "formatos",
    "cuentas de compensacion",
    "plazos"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogada por la Resolución DIAN 000204 de 2025; antes fue modificada por las Resoluciones 000494 de 2022, 000103 de 2024 y 000399 de 2024.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0161_2021.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c_066_2021",
   "tipo": "sentencia",
   "numero": "C-066",
   "anio": 2021,
   "titulo": "Sentencia C-066 de 2021: exequibilidad del diseño del SIMPLE",
   "resumen": "La Corte avaló la estructura del SIMPLE de la Ley 2010 de 2019 frente a cargos de equidad y justicia tributaria: la base gravable sobre ingresos brutos y las tarifas progresivas por nivel de ingresos y actividad empresarial son constitucionales, pues el régimen es voluntario y busca la formalización.",
   "aplica": "Respaldo jurisprudencial del régimen: útil para defender la legalidad de liquidar el SIMPLE sobre ingresos brutos sin depurar costos y gastos.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "base gravable",
    "equidad tributaria",
    "exequibilidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-066_2021.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30041606"
  },
  {
   "id": "decreto_1090_2020",
   "tipo": "decreto",
   "numero": "1090",
   "anio": 2020,
   "titulo": "Decreto 1090 de 2020 - Exención de arancel en tráfico postal y envíos urgentes (de minimis USD 200)",
   "resumen": "Adicionó un parágrafo al artículo 261 del Decreto 1165 de 2019: los envíos que llegan por la red postal oficial o por courier bajo la modalidad de tráfico postal y envíos urgentes, con valor FOB de hasta USD 200, no pagan arancel. Beneficio pactado en acuerdos comerciales (en la práctica, envíos desde Estados Unidos).",
   "aplica": "Personas y empresas que reciben compras internacionales de bajo valor por correo o courier bajo la modalidad de tráfico postal y envíos urgentes.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "trafico postal",
    "de minimis",
    "arancel",
    "compras internacionales"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1090_2020.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30039654"
  },
  {
   "id": "decreto_1147_2020",
   "tipo": "decreto",
   "numero": "1147",
   "anio": 2020,
   "titulo": "Decreto 1147 de 2020 — Reglamento de obras por impuestos por convenio (art. 800-1 ET)",
   "resumen": "Reglamenta la modalidad de convenios de obras por impuestos: postulación y aprobación de proyectos, suscripción del convenio con la entidad nacional competente, emisión de los Títulos para la Renovación del Territorio (TRT) y su uso para pagar hasta el 50% del impuesto de renta del contribuyente.",
   "aplica": "Personas naturales y jurídicas obligadas a llevar contabilidad con ingresos de 33.610 UVT o más que ejecuten proyectos vía convenio del art. 800-1.",
   "impuestos": [
    "renta-pj",
    "renta-pn",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "obras por impuestos",
    "convenios",
    "trt",
    "zomac"
   ],
   "estado": "modificada",
   "nota_vigencia": "Incorporado al DUR 1625 de 2016 (Título 6, Parte 6, Libro 1). Modificado por el Decreto 1208 de 2022, que ajustó la reglamentación a la ampliación de beneficiarios del mecanismo dispuesta por el artículo 34 de la Ley 2155 de 2021.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1147_2020.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=138890"
  },
  {
   "id": "decreto_1457_2020",
   "tipo": "decreto",
   "numero": "1457",
   "anio": 2020,
   "titulo": "Decreto 1457 de 2020 — Reglamenta la retención en la fuente sobre dividendos y participaciones",
   "resumen": "Reglamenta los arts. 242, 242-1, 245 y 246-1 ET: cómo practicar la retención sobre dividendos según el tipo de socio (persona natural residente, sociedad nacional, no residente), la procedencia de las utilidades y los regímenes especiales como las Compañías Holding Colombianas y el SIMPLE, para utilidades de 2017 en adelante distribuidas desde 2020.",
   "aplica": "Sociedades que decretan dividendos y deben definir tarifa de retención según el beneficiario, y socios que verifican la retención trasladable.",
   "impuestos": [
    "retefuente",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "no-residente",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "dividendos",
    "participaciones",
    "retencion trasladable",
    "holding"
   ],
   "estado": "modificada",
   "nota_vigencia": "Las tarifas legales que reglamenta fueron modificadas por la Ley 2277 de 2022 (retención marginal del 15% a personas naturales residentes sobre dividendos que excedan 1.090 UVT), y el Decreto 1103 de 2023 ajustó los artículos del DUR sobre retención de dividendos para las distribuciones realizadas d",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1457_2020.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000019_2020",
   "tipo": "resolucion",
   "numero": "000019",
   "anio": 2020,
   "titulo": "Resolución DIAN 000019 de 2020 — Prescripción del formulario 300 de IVA",
   "resumen": "Prescribe el formulario 300 para la declaración del impuesto sobre las ventas del año gravable 2020 y siguientes, que se presenta por los servicios informáticos de la DIAN con instrumento de firma electrónica. No se ha prescrito un formulario nuevo, por lo que sigue siendo la base del formulario 300 que se usa en 2026.",
   "aplica": "Es la versión oficial del formulario 300 que se diligencia hoy; referencia para validar casillas y renglones antes de presentar.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "formulario 300",
    "firma electrónica",
    "declaración"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su contenido fue compilado en la Resolución Única DIAN 000227 de 2025 (art. 1.2.2.18). En 2025 la DIAN ajustó casillas del formulario 300 para el IVA de juegos de suerte y azar online del Decreto Legislativo 175 de 2025, medida que perdió vigencia el 31 de diciembre de 2025.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0019_2020.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000019%20de%2010-03-2020.pdf"
  },
  {
   "id": "resolucion_dian_000042_2020",
   "tipo": "resolucion",
   "numero": "000042",
   "anio": 2020,
   "titulo": "Resolución DIAN 000042 de 2020 - Antiguo marco de la factura electrónica (derogado)",
   "resumen": "Fue el marco operativo de la factura electrónica con validación previa entre 2020 y 2023: calendarios de implementación, requisitos, anexo técnico y proveedores tecnológicos. La Resolución 000165 de 2023 la derogó y la reemplazó como reglamento único del sistema.",
   "aplica": "Solo como referencia histórica: facturas y habilitaciones del periodo 2020-2023 se rigieron por ella. Para operar hoy, remitirse a la Resolución 000165 de 2023.",
   "impuestos": [
    "facturacion-electronica",
    "iva"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "marco anterior",
    "anexo tecnico",
    "calendarios"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogada por el art. 70 de la Resolución 000165 de 2023; sus arts. 13 y 36 conservaron efectos solo durante la transición al documento equivalente electrónico.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0042_2020.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1468_2019",
   "tipo": "decreto",
   "numero": "1468",
   "anio": 2019,
   "titulo": "Decreto 1468 de 2019: primera reglamentación del SIMPLE",
   "resumen": "Primer decreto reglamentario del impuesto unificado creado por la Ley 1943 de 2018, incorporado al DUR 1625 de 2016. Desarrolló inscripción, exclusión, anticipos bimestrales, tratamiento del IVA y articulación con el ICA. Al caer la Ley 1943, sus reglas fueron reexpedidas con ajustes por el Decreto 1091 de 2020.",
   "aplica": "Relevancia principalmente histórica (año gravable 2019); la reglamentación operativa vigente es la del Decreto 1091 de 2020 dentro del DUR.",
   "impuestos": [
    "rst"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "reglamentacion",
    "anticipos",
    "inscripcion"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Sus disposiciones en el DUR fueron sustituidas por el Decreto 1091 de 2020 tras la inexequibilidad de la Ley 1943 de 2018.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1468_2019.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=99372"
  },
  {
   "id": "decreto_2112_2019",
   "tipo": "decreto",
   "numero": "2112",
   "anio": 2019,
   "titulo": "Decreto 2112 de 2019 — Reglamento del régimen ZESE",
   "resumen": "Reglamenta el art. 268 de la Ley 1955 de 2019: condiciones para acogerse a la ZESE (desarrollar la actividad principal en el territorio, aumento mínimo de empleo directo), la aplicación de la tarifa 0% y 50% en renta y en retención en la fuente, y el reporte anual de información para conservar el beneficio.",
   "aplica": "Sociedades acogidas a la ZESE en La Guajira, Norte de Santander, Arauca, Armenia, Quibdó, Buenaventura y Barrancabermeja, durante sus 10 años de beneficio.",
   "impuestos": [
    "renta-pj",
    "retefuente"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "zese",
    "empleo",
    "retenciones",
    "reporte anual"
   ],
   "estado": "modificada",
   "nota_vigencia": "Modificado y adicionado por el Decreto 1606 de 2020 (ajustes del art. 147 de la Ley 2010 de 2019). Las ventanas para acogerse como nueva sociedad ya cerraron en todas las ZESE, incluidas las de Buenaventura y Barrancabermeja (Leyes 2238 y 2240 de 2022).",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2112_2019.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=103372"
  },
  {
   "id": "sentencia_c_481_2019",
   "tipo": "sentencia",
   "numero": "C-481",
   "anio": 2019,
   "titulo": "Sentencia C-481 de 2019: inexequibilidad de la Ley 1943 de 2018",
   "resumen": "La Corte Constitucional declaró inexequible toda la Ley 1943 de 2018 por vicios de procedimiento en su formación, difiriendo los efectos al 1 de enero de 2020. Obligó al Congreso a expedir la Ley 2010 de 2019, que volvió a darle piso legal al SIMPLE sin interrumpir su aplicación en 2019.",
   "aplica": "Contexto jurídico del SIMPLE: explica por qué el año gravable 2019 se rigió por la Ley 1943 y desde 2020 por la Ley 2010.",
   "impuestos": [
    "rst",
    "procedimiento"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "inexequibilidad",
    "vicios de tramite",
    "efectos diferidos"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-481_2019.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c235_2019",
   "tipo": "sentencia",
   "numero": "C-235",
   "anio": 2019,
   "titulo": "Sentencia C-235 de 2019 — Hoteles: situaciones jurídicas consolidadas de la exención de la Ley 788 de 2002",
   "resumen": "La Corte Constitucional condicionó la Ley 1819 de 2016: los hoteleros que cumplieron entre 2003 y 2016 los requisitos de la exención de 30 años por nuevos hoteles o remodelaciones (art. 207-2 del ET) tienen una situación jurídica consolidada y conservan el beneficio por todo el término, pese al cambio de régimen a tarifa del 9%.",
   "aplica": "Hoteles construidos, remodelados o ampliados entre el 1 de enero de 2003 y el 29 de diciembre de 2016 que acreditaron los requisitos de la Ley 788 de 2002.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "turismo-hoteles"
   ],
   "temas": [
    "hoteleria",
    "rentas exentas",
    "situacion juridica consolidada",
    "corte constitucional"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-235_2019.htm",
   "url_alt": ""
  },
  {
   "id": "sentencia_c593_2019",
   "tipo": "sentencia",
   "numero": "C-593",
   "anio": 2019,
   "titulo": "Sentencia C-593 de 2019 — Corte Constitucional: cae el INC de bienes inmuebles",
   "resumen": "Tumbó el impuesto nacional al consumo del 2% sobre la enajenación de bienes inmuebles (art. 512-22 del ET, creado por la Ley 1943 de 2018) por desconocer la capacidad contributiva y la equidad tributaria. El tributo dejó de cobrarse desde el 5 de diciembre de 2019 y no fue revivido por leyes posteriores.",
   "aplica": "Las ventas de inmuebles desde diciembre de 2019 no causan INC; sustento para objetar cobros o liquidaciones que todavía lo incluyan.",
   "impuestos": [
    "inc"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "construccion"
   ],
   "temas": [
    "inc inmuebles",
    "capacidad contributiva",
    "inexequibilidad"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-593_2019.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2019/c-593-19.htm"
  },
  {
   "id": "concepto_dian_30909_2018",
   "tipo": "concepto",
   "numero": "30909",
   "anio": 2018,
   "titulo": "Oficio DIAN 30909 de 2018: adición al Concepto Unificado de ESAL",
   "resumen": "Resuelve una solicitud de reconsideración del Concepto Unificado 0481 de 2018: confirma la doctrina sobre ONG extranjeras, actualización anual de directivos, límite del 30% del gasto anual para remunerar directivos, inversiones a más de un año y el carácter de descuento (25%) de las donaciones, y adiciona el descriptor 3.4.1 sobre personas jurídicas eclesiásticas con actividades meritorias, que deben cumplir…",
   "aplica": "ESAL con dudas puntuales sobre remuneración de directivos, organizaciones religiosas, inversiones patrimoniales o donaciones.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "directivos",
    "donaciones",
    "entidades religiosas"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_30909_2018.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1943_2018",
   "tipo": "ley",
   "numero": "1943",
   "anio": 2018,
   "titulo": "Ley 1943 de 2018 — Ley de financiamiento (declarada inexequible)",
   "resumen": "Creó el régimen SIMPLE, el impuesto al consumo de bienes inmuebles, los regímenes de megainversiones y CHC, redujo gradualmente la tarifa de renta PJ y reorganizó los responsables de IVA. Rigió solo durante 2019: la Corte la declaró inexequible por vicios de trámite con efectos desde el 1 de enero de 2020.",
   "aplica": "Solo para situaciones consolidadas del año gravable 2019; para 2020 en adelante su contenido fue reexpedido por la Ley 2010 de 2019.",
   "impuestos": [
    "renta-pn",
    "renta-pj",
    "procedimiento",
    "iva",
    "inc",
    "rst"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "regimen-simple"
   ],
   "sectores": [],
   "temas": [
    "cedula general",
    "inexequibilidad",
    "reforma tributaria",
    "no responsables",
    "plurifásico",
    "creacion del regimen"
   ],
   "estado": "derogada",
   "nota_vigencia": "Inexequible desde el 1 de enero de 2020 (Sentencia C-481 de 2019); la Ley 2010 de 2019 reprodujo casi todo su contenido.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1943_2018.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_000051_2018",
   "tipo": "resolucion",
   "numero": "000051",
   "anio": 2018,
   "titulo": "Resolución DIAN 000051 de 2018 — IVA de prestadores de servicios desde el exterior",
   "resumen": "Establece el procedimiento para que los prestadores de servicios desde el exterior responsables de IVA en Colombia cumplan sus obligaciones: inscripción simplificada en el RUT, declaración y pago bimestral con instrumento de firma electrónica y conversión a pesos con la TRM vigente al día de presentación de la declaración.",
   "aplica": "Plataformas y empresas extranjeras que venden servicios digitales a clientes colombianos que no están obligados a practicar retención de IVA.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "no-residente",
    "persona-juridica"
   ],
   "sectores": [
    "tecnologia"
   ],
   "temas": [
    "servicios desde el exterior",
    "rut",
    "declaración bimestral",
    "plataformas digitales"
   ],
   "estado": "vigente",
   "nota_vigencia": "Su contenido fue compilado en la Resolución Única DIAN 000227 de 2025 (Resolución Única en Materia Tributaria, Aduanera y Cambiaria), donde sigue aplicable.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0051_2018.htm",
   "url_alt": "https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000051%20de%2019-10-2018.pdf"
  },
  {
   "id": "sentencia_c117_2018",
   "tipo": "sentencia",
   "numero": "C-117",
   "anio": 2018,
   "titulo": "Sentencia C-117 de 2018 — Corte Constitucional: sin IVA para productos de higiene menstrual",
   "resumen": "Declaró inconstitucional el IVA del 5% sobre toallas higiénicas y tampones creado por la Ley 1819 de 2016, por resultar regresivo y discriminatorio contra la mujer, y ordenó darles tratamiento de bienes exentos. El legislador recogió después esa regla en los listados de beneficio del Estatuto.",
   "aplica": "Comercializadores de productos de higiene menstrual: sustento del tratamiento sin IVA en la cadena y de las devoluciones asociadas.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [
    "comercio"
   ],
   "temas": [
    "equidad de género",
    "bienes exentos",
    "control constitucional"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/c-117_2018.htm",
   "url_alt": "https://www.corteconstitucional.gov.co/relatoria/2018/C-117-18.htm"
  },
  {
   "id": "decreto_1650_2017",
   "tipo": "decreto",
   "numero": "1650",
   "anio": 2017,
   "titulo": "Decreto 1650 de 2017 — Reglamento del régimen ZOMAC (arts. 236 y 237 Ley 1819)",
   "resumen": "Define qué municipios integran las zonas más afectadas por el conflicto armado (anexo con el listado oficial), los montos mínimos de inversión y empleo por tamaño de empresa y actividad, y las condiciones para que las nuevas sociedades apliquen las tarifas progresivas de renta del régimen ZOMAC.",
   "aplica": "Sociedades nuevas que instalen su domicilio principal y desarrollen toda su actividad en municipios ZOMAC y quieran las tarifas reducidas hasta 2027.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "zomac",
    "municipios",
    "inversion minima",
    "empleo"
   ],
   "estado": "vigente",
   "nota_vigencia": "Incorporado al DUR 1625 de 2016.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1650_2017.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_1915_2017",
   "tipo": "decreto",
   "numero": "1915",
   "anio": 2017,
   "titulo": "Decreto 1915 de 2017 — Reglamento de obras por impuestos en ZOMAC (art. 238 Ley 1819)",
   "resumen": "Reglamenta la modalidad original de obras por impuestos: banco de proyectos administrado por la ART, manifestación de interés del contribuyente, constitución de fiducia para depositar el valor del impuesto, ejecución del proyecto e interventoría, y reglas cuando el impuesto a cargo supera o no el monto invertido.",
   "aplica": "Personas jurídicas con ingresos brutos de 33.610 UVT o más que destinen hasta el 50% de su impuesto de renta a proyectos viabilizados en municipios ZOMAC.",
   "impuestos": [
    "renta-pj",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "obras por impuestos",
    "zomac",
    "fiducia",
    "banco de proyectos"
   ],
   "estado": "vigente",
   "nota_vigencia": "Incorporado al DUR 1625 de 2016 (Título 5, Parte 6, Libro 1).",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1915_2017.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=84354"
  },
  {
   "id": "decreto_2120_2017",
   "tipo": "decreto",
   "numero": "2120",
   "anio": 2017,
   "titulo": "Decreto 2120 de 2017 — Reglamentación de precios de transferencia",
   "resumen": "Desarrolla dentro del DUR 1625 el régimen de precios de transferencia: contenido y plazos del informe local, el informe maestro y el informe país por país, tratamiento de operaciones con commodities, servicios intragrupo, acuerdos de costos compartidos y reestructuraciones empresariales.",
   "aplica": "PJ sujetas al régimen de precios de transferencia que deban preparar documentación comprobatoria o pertenezcan a grupos multinacionales con reporte país por país.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "precios de transferencia",
    "documentacion",
    "pais por pais"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2120_2017.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_926_2017",
   "tipo": "decreto",
   "numero": "926",
   "anio": 2017,
   "titulo": "Decreto 926 de 2017 — No causación del impuesto al carbono por carbono neutralidad",
   "resumen": "Reglamenta la no causación del impuesto al carbono para quien certifique ser carbono neutro: el comprador del combustible presenta al responsable la declaración de verificación y el soporte de cancelación de reducciones o remociones de emisiones (créditos de carbono) que respaldan la cantidad solicitada.",
   "aplica": "Empresas que adquieren combustibles fósiles y compensan emisiones con créditos de carbono certificados; productores e importadores que validan esas solicitudes.",
   "impuestos": [
    "carbono"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [
    "mineria-energia",
    "transporte"
   ],
   "temas": [
    "carbono neutro",
    "creditos de carbono",
    "no causacion"
   ],
   "estado": "modificada",
   "nota_vigencia": "Tras la Ley 2277 de 2022 la no causación por carbono neutralidad dejó de cubrir el 100% del impuesto; revisar la reglamentación vigente en el DUR.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0926_2017.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=81936"
  },
  {
   "id": "decreto_1894_2015",
   "tipo": "decreto",
   "numero": "1894",
   "anio": 2015,
   "titulo": "Decreto 1894 de 2015 - Ajustes al régimen del Operador Económico Autorizado",
   "resumen": "Modificó el Decreto 3568 de 2011: organizó las categorías de autorización OEA (seguridad y facilitación, y seguridad y facilitación sanitaria), amplió los tipos de usuario que pueden acceder y precisó condiciones, requisitos mínimos y beneficios para los operadores de comercio exterior autorizados.",
   "aplica": "Empresas que tramitan o conservan la autorización OEA en cualquiera de sus categorías.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "oea",
    "categorias",
    "requisitos"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1894_2015.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30020035"
  },
  {
   "id": "ley_1739_2014",
   "tipo": "ley",
   "numero": "1739",
   "anio": 2014,
   "titulo": "Ley 1739 de 2014 — Impuesto a la riqueza y sobretasa al CREE",
   "resumen": "Reforma de ajuste: creó el impuesto a la riqueza (2015-2018), la sobretasa al CREE, la primera normalización tributaria de activos omitidos y la declaración anual de activos en el exterior; aplazó el desmonte del GMF. Casi todas sus medidas eran temporales y ya se agotaron.",
   "aplica": "Valor principalmente histórico: origen de la declaración de activos en el exterior y de las normalizaciones que se repitieron en 2019, 2020 y 2022.",
   "impuestos": [
    "patrimonio",
    "renta-pj",
    "renta-pn",
    "gmf"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "riqueza",
    "normalizacion",
    "activos-exterior"
   ],
   "estado": "modificada",
   "nota_vigencia": "Sus impuestos temporales se agotaron y el CREE fue eliminado por la Ley 1819 de 2016; la declaración de activos en el exterior (Art. 607 ET) sigue vigente.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1739_2014.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_925_2013",
   "tipo": "decreto",
   "numero": "925",
   "anio": 2013,
   "titulo": "Decreto 925 de 2013 - Registros y licencias de importación (VUCE)",
   "resumen": "Regula los registros y licencias de importación que se tramitan por la Ventanilla Única de Comercio Exterior (VUCE): cuándo se exigen, vigencia de seis meses, plazos de las entidades para resolver (tres días hábiles en licencia previa) y responsabilidad del importador o su agencia por la información presentada.",
   "aplica": "Importadores de bienes sujetos a registro o licencia previa (usados, controlados o con restricciones) y las agencias de aduanas o apoderados que tramitan por VUCE.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "licencia previa",
    "registro de importacion",
    "vuce",
    "plazos"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0925_2013.htm",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=1191327"
  },
  {
   "id": "resolucion_dian_12761_2011",
   "tipo": "resolucion",
   "numero": "12761",
   "anio": 2011,
   "titulo": "Resolución DIAN 12761 de 2011 – obligados a declarar virtualmente",
   "resumen": "Señala quiénes deben presentar declaraciones y diligenciar recibos de pago por los Servicios Informáticos Electrónicos de la DIAN con firma electrónica: grandes contribuyentes, usuarios aduaneros, notarios, consorcios, intermediarios cambiarios y demás listados. Presentar en papel estando obligado a lo virtual deja la declaración como no presentada.",
   "aplica": "Obligados a presentación virtual: ten la firma electrónica activa con anticipación, porque sin ella no hay forma de declarar a tiempo.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "gran-contribuyente",
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "presentacion-virtual",
    "firma-electronica",
    "plazos"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Modificada por las Resoluciones 19 de 2012, 21 de 2017 y 139 de 2023; su articulado fue compilado en la Resolución Única 000227 de 2025, que es donde hoy se consulta el universo de declarantes virtuales que desarrolla el art. 579-2 del ET.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_12761_2011.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1430_2010",
   "tipo": "ley",
   "numero": "1430",
   "anio": 2010,
   "titulo": "Ley 1430 de 2010 — Adición del artículo 631-3 del ET (información con relevancia tributaria)",
   "resumen": "Su artículo 17 adicionó el artículo 631-3 al Estatuto Tributario: el Director de la DIAN puede señalar las especificaciones de la información con relevancia tributaria que deben entregar contribuyentes y no contribuyentes. Es uno de los soportes legales que cita cada resolución anual de exógena.",
   "aplica": "Sustento normativo general de la exógena; útil para entender el alcance de las facultades de la DIAN al diseñar formatos y exigir datos.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "facultades dian",
    "relevancia tributaria"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1430_2010.htm",
   "url_alt": ""
  },
  {
   "id": "ley_1066_2006",
   "tipo": "ley",
   "numero": "1066",
   "anio": 2006,
   "titulo": "Normalización de la cartera pública y reglas de cobro",
   "resumen": "Ordena a las entidades públicas, incluida la DIAN, gestionar y cobrar eficientemente su cartera: reglamentos internos de cartera, condiciones de las facilidades de pago, causación de intereses moratorios sobre obligaciones tributarias (modificó el art. 635 ET) y depuración de obligaciones incobrables.",
   "aplica": "Deudores de obligaciones fiscales en mora: de aquí derivan la tasa de interés moratorio tributaria y las reglas generales de los acuerdos de pago.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "cartera",
    "intereses moratorios",
    "facilidades de pago",
    "cobro"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_1066_2006.htm",
   "url_alt": ""
  },
  {
   "id": "resolucion_dian_9147_2006",
   "tipo": "resolucion",
   "numero": "9147",
   "anio": 2006,
   "titulo": "Resolución DIAN 9147 de 2006 - Primera exógena cambiaria",
   "resumen": "Primera gran resolución de información exógena cambiaria: fijó el contenido, las características técnicas y los plazos trimestrales de los reportes de información cambiaria y de endeudamiento externo a cargo de IMC, concesionarios de correos y titulares de cuentas de compensación.",
   "aplica": "Histórica: rigió los reportes cambiarios trimestrales ante la DIAN entre 2006 y 2021.",
   "impuestos": [
    "cambiario",
    "exogena"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "informacion exogena cambiaria",
    "cuentas de compensacion",
    "plazos",
    "historia normativa"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogada desde el 1 de enero de 2022 por el artículo 9 de la Resolución DIAN 000161 de 2021.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_9147_2006.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_4400_2004",
   "tipo": "decreto",
   "numero": "4400",
   "anio": 2004,
   "titulo": "Decreto 4400 de 2004: antiguo reglamento del RTE",
   "resumen": "Reglamentaba el art. 19 y el Título VI del Libro I del ET antes de la Ley 1819: definía egresos procedentes, beneficio neto y la destinación de excedentes bajo las reglas anteriores. Hoy solo sirve para discusiones sobre periodos gravables 2016 y anteriores.",
   "aplica": "Casos históricos: fiscalizaciones o litigios de la DIAN sobre años gravables anteriores a la entrada del régimen de la Ley 1819 de 2016.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "régimen anterior",
    "beneficio neto",
    "egresos procedentes"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Sustituido en la práctica por el Decreto 2150 de 2017, que reescribió la reglamentación del RTE dentro del DUR 1625 de 2016.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_4400_2004.htm",
   "url_alt": ""
  },
  {
   "id": "concepto_dian_00001_2003",
   "tipo": "concepto",
   "numero": "00001 (Unificado de IVA)",
   "anio": 2003,
   "titulo": "Concepto Unificado del Impuesto sobre las Ventas 00001 de 2003 — DIAN",
   "resumen": "Doctrina unificada de la DIAN sobre el IVA: causación, responsables, bases gravables, servicios excluidos, impuestos descontables y procedimiento. Aunque varias tesis fueron anuladas por el Consejo de Estado o superadas por reformas posteriores, sigue siendo el punto de partida doctrinal en discusiones con la administración.",
   "aplica": "Útil para sustentar respuestas a requerimientos cuando la norma es ambigua; siempre verificar que el aparte citado no haya sido anulado o superado.",
   "impuestos": [
    "iva"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "doctrina",
    "causación",
    "servicios",
    "descontables"
   ],
   "estado": "modificada",
   "nota_vigencia": "Apartes anulados por el Consejo de Estado y tesis superadas por las reformas de 2012 a 2019; conserva valor doctrinal en lo no modificado.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0000001_2003.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2080_2000",
   "tipo": "decreto",
   "numero": "2080",
   "anio": 2000,
   "titulo": "Decreto 2080 de 2000 - Antiguo régimen de inversiones internacionales",
   "resumen": "Antiguo régimen general de inversiones internacionales: inversión de capital del exterior en Colombia e inversiones colombianas en el exterior, con sus modalidades y registro ante el Banco de la República. Fue compilado en el Decreto 1068 de 2015 y su régimen se reescribió por completo en 2017.",
   "aplica": "Referencia para inversiones registradas antes de 2017; el régimen actual está en el Decreto 1068 de 2015 reformado por el Decreto 119 de 2017.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "inversion extranjera",
    "registro",
    "historia normativa"
   ],
   "estado": "sustituida",
   "nota_vigencia": "Compilado en el Decreto Único 1068 de 2015; el régimen de inversiones fue sustituido integralmente por el Decreto 119 de 2017.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2080_2000.htm",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=75434"
  },
  {
   "id": "resolucion_banrep_8_2000",
   "tipo": "resolucion",
   "numero": "Externa 8",
   "anio": 2000,
   "titulo": "Resolución Externa 8 de 2000 Banco de la República - Anterior estatuto cambiario",
   "resumen": "Anterior estatuto cambiario de la Junta del Banco de la República: durante casi dos décadas reguló la canalización de divisas, la declaración de cambio, los intermediarios del mercado cambiario y las cuentas de compensación, hasta ser reemplazada en 2018.",
   "aplica": "Referencia para analizar operaciones e infracciones cambiarias ocurridas antes del 25 de mayo de 2018.",
   "impuestos": [
    "cambiario"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "no-residente"
   ],
   "sectores": [],
   "temas": [
    "estatuto cambiario",
    "canalizacion",
    "historia normativa"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogada por el artículo 109 de la Resolución Externa 1 de 2018, salvo una vigencia transitoria que expiró el 31 de diciembre de 2018.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_banrepublica_0008_2000.htm",
   "url_alt": "https://www.banrep.gov.co/sites/default/files/reglamentacion/archivos/re_8_2000_compendio.pdf"
  },
  {
   "id": "decreto_2685_1999",
   "tipo": "decreto",
   "numero": "2685",
   "anio": 1999,
   "titulo": "Decreto 2685 de 1999 - Antiguo Estatuto Aduanero (derogado)",
   "resumen": "Estatuto aduanero que rigió el comercio exterior colombiano por dos décadas. Está derogado desde el 1 de agosto de 2019, pero sigue siendo referencia para operaciones y procesos iniciados bajo su vigencia y para entender la evolución del régimen sancionatorio y de los regímenes de importación.",
   "aplica": "Operaciones, regímenes y procesos aduaneros iniciados antes de agosto de 2019 que se siguen rigiendo por la norma anterior.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "estatuto anterior",
    "derogatoria",
    "transicion"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogado desde el 1 de agosto de 2019 por el artículo 774 del Decreto 1165 de 2019.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_2685_1999.htm",
   "url_alt": ""
  },
  {
   "id": "ley_527_1999",
   "tipo": "ley",
   "numero": "527",
   "anio": 1999,
   "titulo": "Ley 527 de 1999 - Comercio electrónico, mensajes de datos y firmas digitales",
   "resumen": "Reconoce plena validez jurídica y probatoria a los mensajes de datos y a las firmas digitales. Es el cimiento legal que permite que la factura electrónica, la nómina electrónica y los demás documentos del sistema de facturación existan como documentos con efectos legales sin papel.",
   "aplica": "Base transversal para todo emisor y receptor de documentos electrónicos del sistema de facturación; rara vez se cita sola, pero sostiene la validez del XML firmado.",
   "impuestos": [
    "facturacion-electronica",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "mensajes de datos",
    "firma digital",
    "validez probatoria"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0527_1999.htm",
   "url_alt": ""
  },
  {
   "id": "ley_454_1998",
   "tipo": "ley",
   "numero": "454",
   "anio": 1998,
   "titulo": "Ley 454 de 1998: marco de la economía solidaria",
   "resumen": "Organiza la economía solidaria: define las organizaciones del sector y crea la Superintendencia de la Economía Solidaria. La vigilancia de la Supersolidaria es justamente el criterio que usa el art. 19-4 ET para que cooperativas y mutuales pertenezcan al RTE por ministerio de la ley, sin calificación previa.",
   "aplica": "Cooperativas, fondos de empleados y asociaciones mutuales: determina quién es 'sector solidario vigilado' para efectos del art. 19-4 ET.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal"
   ],
   "sectores": [],
   "temas": [
    "economía solidaria",
    "supersolidaria",
    "vigilancia"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=3433"
  },
  {
   "id": "decreto_1092_1996",
   "tipo": "decreto",
   "numero": "1092",
   "anio": 1996,
   "titulo": "Decreto-Ley 1092 de 1996 - Anterior régimen sancionatorio cambiario DIAN",
   "resumen": "Antiguo régimen sancionatorio y procedimiento administrativo cambiario de la DIAN, modificado por el Decreto-Ley 1074 de 1999. Rigió las investigaciones cambiarias por quince años hasta su derogatoria expresa en 2011.",
   "aplica": "Solo relevante para procesos cambiarios iniciados antes de la entrada en vigencia del Decreto-Ley 2245 de 2011.",
   "impuestos": [
    "cambiario",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "procedimiento",
    "historia normativa"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogado por el artículo 43 del Decreto-Ley 2245 de 2011, junto con el Decreto-Ley 1074 de 1999.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1092_1996.htm",
   "url_alt": ""
  },
  {
   "id": "ley_170_1994",
   "tipo": "ley",
   "numero": "170",
   "anio": 1994,
   "titulo": "Ley 170 de 1994 - Aprueba el Acuerdo de la OMC (incluye valoración aduanera)",
   "resumen": "Aprobó el Acuerdo que creó la Organización Mundial del Comercio y sus anexos, entre ellos el Acuerdo de Valoración del GATT de 1994: de allí sale el método del valor de transacción con el que se determina la base de los tributos aduaneros en Colombia, desarrollado por la Decisión 571 de la CAN y el Decreto 1165 de 2019.",
   "aplica": "Importadores y autoridades aduaneras: obliga a valorar la mercancía por el valor de transacción y limita los aranceles a los niveles consolidados ante la OMC.",
   "impuestos": [
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "valoracion aduanera",
    "omc",
    "gatt",
    "valor de transaccion"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/ley_0170_1994.htm",
   "url_alt": ""
  },
  {
   "id": "decreto_2116_1992",
   "tipo": "decreto",
   "numero": "2116",
   "anio": 1992,
   "titulo": "Decreto 2116 de 1992 - Reparto de la vigilancia cambiaria (DIAN, Supersociedades, Superfinanciera)",
   "resumen": "Suprimió la Superintendencia de Cambios y repartió la vigilancia del régimen: a la DIAN le corresponde el control cambiario de importaciones y exportaciones de bienes y servicios, sus gastos asociados y su financiación; a la Supersociedades, la inversión internacional y el endeudamiento externo de empresas; a la hoy Superfinanciera, los IMC.",
   "aplica": "Define ante qué entidad responde por una infracción cambiaria: DIAN si la operación es de comercio exterior, Supersociedades si es inversión o deuda externa.",
   "impuestos": [
    "cambiario",
    "aduanero"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "competencias",
    "vigilancia",
    "dian",
    "supersociedades"
   ],
   "estado": "vigente",
   "nota_vigencia": "Las funciones que asignó a la antigua Superintendencia Bancaria las ejerce hoy la Superintendencia Financiera.",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30030668"
  },
  {
   "id": "decreto_1746_1991",
   "tipo": "decreto",
   "numero": "1746",
   "anio": 1991,
   "titulo": "Decreto 1746 de 1991 - Régimen sancionatorio cambiario de la Supersociedades",
   "resumen": "Régimen sancionatorio y procedimiento administrativo cambiario que hoy aplica la Superintendencia de Sociedades a las infracciones de su competencia (inversión internacional y endeudamiento externo). Permite multas de hasta el 200% del monto de la infracción comprobada, bajo responsabilidad objetiva.",
   "aplica": "Empresas con inversión extranjera o créditos externos sin registrar o mal reportados: esas sanciones no las impone la DIAN sino la Supersociedades con este decreto.",
   "impuestos": [
    "cambiario",
    "procedimiento"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "sanciones",
    "supersociedades",
    "inversion extranjera",
    "endeudamiento externo"
   ],
   "estado": "modificada",
   "nota_vigencia": "Lo aplica la Supersociedades por la distribución de competencias del Decreto 2116 de 1992; su estructura actual viene del Decreto 1736 de 2020 modificado por el Decreto 1380 de 2021.",
   "importancia": "media",
   "url_dian": "",
   "url_alt": "https://www.suin-juriscol.gov.co/viewDocument.asp?id=1343393"
  },
  {
   "id": "et_art_19_2",
   "tipo": "estatuto",
   "numero": "Art. 19-2",
   "anio": 1989,
   "titulo": "Estatuto Tributario, art. 19-2: cajas de compensación familiar",
   "resumen": "Las cajas de compensación familiar son contribuyentes de renta únicamente sobre los ingresos de actividades industriales, comerciales y financieras distintas de la inversión de su patrimonio y ajenas a salud, educación, recreación y desarrollo social. No pertenecen al RTE ni son ESAL calificables.",
   "aplica": "Cajas de compensación familiar respecto de sus negocios comerciales o financieros gravados.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "esal",
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "cajas de compensación",
    "ingresos gravados"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto vigente dado por la Ley 1819 de 2016.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_459",
   "tipo": "estatuto",
   "numero": "Art. 459",
   "anio": 1989,
   "titulo": "Estatuto Tributario Art. 459 - Base gravable del IVA en las importaciones",
   "resumen": "Fija la base gravable del IVA en las importaciones: el valor aduanero de la mercancía más los derechos de arancel. Por eso un error en la clasificación arancelaria o en la valoración aduanera arrastra también el IVA liquidado en la declaración de importación y puede derivar en requerimientos posteriores.",
   "aplica": "Importadores que liquidan IVA en la declaración de importación, incluso si no son responsables de IVA en sus operaciones internas.",
   "impuestos": [
    "iva",
    "aduanero"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "iva importaciones",
    "base gravable",
    "arancel",
    "valoracion aduanera"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_632",
   "tipo": "estatuto",
   "numero": "Art. 632",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículo 632 — Deber de conservar informaciones y pruebas",
   "resumen": "Exige conservar la contabilidad, los soportes y las informaciones que respaldan lo declarado y lo reportado en exógena, y exhibirlos cuando la DIAN los pida. La conservación debe cubrir al menos el término de firmeza de la declaración del periodo, pues sobre esos soportes se resuelven los cruces.",
   "aplica": "Contribuyentes y no contribuyentes obligados a llevar contabilidad o a atender requerimientos de información de la administración tributaria.",
   "impuestos": [
    "exogena",
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "conservación de soportes",
    "firmeza",
    "fiscalización"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_814",
   "tipo": "estatuto",
   "numero": "Art. 814",
   "anio": 1989,
   "titulo": "Facilidades (acuerdos) de pago con la DIAN",
   "resumen": "Permite al deudor pactar con la DIAN el pago de impuestos, sanciones e intereses hasta en 5 años, ofreciendo garantías (bienes, fianzas, codeudores). En deudas menores pueden concederse plazos cortos sin garantía. El incumplimiento deja sin efecto la facilidad y reactiva el cobro coactivo por el saldo total.",
   "aplica": "Contribuyentes en mora que no pueden pagar de contado y quieren frenar embargos: la facilidad suspende el proceso de cobro mientras se cumpla.",
   "impuestos": [
    "procedimiento"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "regimen-simple",
    "esal",
    "independiente"
   ],
   "sectores": [],
   "temas": [
    "facilidades de pago",
    "cobro",
    "garantias",
    "mora"
   ],
   "estado": "vigente",
   "nota_vigencia": "La Ley 1066 de 2006 ajustó las condiciones de las facilidades y la gestión de la cartera pública.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_art_911",
   "tipo": "estatuto",
   "numero": "Art. 911",
   "anio": 1989,
   "titulo": "Estatuto Tributario, Art. 911 — Retención en la fuente y régimen SIMPLE",
   "resumen": "Los contribuyentes del régimen simple de tributación no están sujetos a retención en la fuente ni obligados a practicar retenciones ni autorretenciones, con excepción de las correspondientes a pagos laborales. Cuando un contribuyente del SIMPLE paga compras de bienes o servicios, el tercero receptor del pago que sea contribuyente del régimen ordinario y agente retenedor de renta debe actuar como autorretenedor…",
   "aplica": "Inscritos en el SIMPLE y sus proveedores del régimen ordinario: cuando un SIMPLE les paga, el vendedor del régimen ordinario se autorretiene a título de renta en lugar de que el SIMPLE le practique retención.",
   "impuestos": [
    "rst",
    "retefuente",
    "autorretencion"
   ],
   "perfiles": [
    "regimen-simple",
    "persona-juridica",
    "persona-natural"
   ],
   "sectores": [],
   "temas": [
    "regimen simple",
    "autorretencion del receptor del pago",
    "pagos laborales"
   ],
   "estado": "vigente",
   "nota_vigencia": "Texto sustituido por la Ley 1943 de 2018 y reexpedido por la Ley 2010 de 2019 tras la inexequibilidad de aquella.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_188_193",
   "tipo": "estatuto",
   "numero": "Arts. 188-193",
   "anio": 1989,
   "titulo": "ET Arts. 188-193 — Renta presuntiva",
   "resumen": "Sistema que presume que el patrimonio líquido del año anterior produce una renta mínima gravable. La Ley 2010 de 2019 redujo el porcentaje gradualmente hasta dejarlo en 0% desde el año gravable 2021, así que hoy no genera impuesto, aunque el esquema sigue formalmente en el ET.",
   "aplica": "Referencia histórica y para litigios de años anteriores a 2021; las PJ ya no liquidan renta presuntiva pero el sistema sigue mencionado en el F110.",
   "impuestos": [
    "renta-pj"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "renta presuntiva",
    "patrimonio liquido",
    "tarifas"
   ],
   "estado": "modificada",
   "nota_vigencia": "Porcentaje en 0% desde el año gravable 2021 por la Ley 2010 de 2019.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_235_3_235_4",
   "tipo": "estatuto",
   "numero": "Arts. 235-3 y 235-4",
   "anio": 1989,
   "titulo": "Régimen de megainversiones y su estabilidad tributaria (ET, Arts. 235-3 y 235-4) — derogado",
   "resumen": "Otorgaba a megainversiones (30 millones de UVT y 400 empleos) tarifa de renta del 27%, depreciación en 2 años, sin renta presuntiva ni impuesto al patrimonio, y contratos de estabilidad hasta por 20 años. Fue derogado por la Ley 2277 de 2022; solo siguen amparados quienes firmaron contrato de estabilidad antes de la derogatoria.",
   "aplica": "Hoy solo es relevante para inversionistas que alcanzaron a suscribir contrato de estabilidad tributaria de megainversión: conservan las condiciones pactadas por su término.",
   "impuestos": [
    "renta-pj",
    "patrimonio"
   ],
   "perfiles": [
    "persona-juridica",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "megainversiones",
    "estabilidad tributaria",
    "derogatorias"
   ],
   "estado": "derogada",
   "nota_vigencia": "Derogados por el art. 96 de la Ley 2277 de 2022; los contratos de estabilidad ya suscritos mantienen sus beneficios durante el plazo contratado.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_623_629_1",
   "tipo": "estatuto",
   "numero": "Arts. 623 a 629-1",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículos 623 a 629-1 — Información de entidades específicas",
   "resumen": "Bloque de deberes de información a cargo de entidades puntuales: vigiladas por la Superfinanciera (cuentas, CDT, tarjetas), cámaras de comercio (sociedades creadas y liquidadas), bolsas de valores y comisionistas, aportes parafiscales, Registraduría, notarios (enajenaciones) y quienes elaboran facturas.",
   "aplica": "Entidades financieras, cámaras de comercio, bolsas, comisionistas de bolsa, notarios y elaboradores de facturación, según el artículo que cubra su actividad.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-juridica"
   ],
   "sectores": [],
   "temas": [
    "entidades financieras",
    "notarios",
    "cámaras de comercio",
    "reportes especiales"
   ],
   "estado": "vigente",
   "nota_vigencia": "",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_631_2_631_3",
   "tipo": "estatuto",
   "numero": "Arts. 631-2 y 631-3",
   "anio": 1989,
   "titulo": "Estatuto Tributario, artículos 631-2 y 631-3 — Valores, plazos y especificaciones de la información",
   "resumen": "Dejan en cabeza del Director de la DIAN la definición, vía resolución, de los valores, datos, plazos y obligados de la información de los artículos 623, 623-2, 628, 629, 629-1 y 631 (631-2) y de las especificaciones de la información con relevancia tributaria de contribuyentes y no contribuyentes (631-3). Sustentan los formatos y sus versiones.",
   "aplica": "Marco habilitante que cobija a todos los reportantes de exógena: de aquí salen las cuantías mínimas, los formatos y las especificaciones técnicas de cada año gravable.",
   "impuestos": [
    "exogena"
   ],
   "perfiles": [
    "persona-natural",
    "persona-juridica",
    "gran-contribuyente",
    "esal"
   ],
   "sectores": [],
   "temas": [
    "formatos",
    "cuantías",
    "especificaciones técnicas"
   ],
   "estado": "vigente",
   "nota_vigencia": "El artículo 631-3 fue adicionado por el artículo 17 de la Ley 1430 de 2010.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  },
  {
   "id": "et_arts_869_869_2",
   "tipo": "estatuto",
   "numero": "Arts. 869 a 869-2",
   "anio": 1989,
   "titulo": "Abuso en materia tributaria (cláusula general antiabuso)",
   "resumen": "El art. 869 faculta a la DIAN para recaracterizar o desconocer los efectos de operaciones que, sin razón o propósito económico aparente, busquen un provecho tributario (eliminar, reducir o diferir impuestos). El art. 869-1 fija el procedimiento especial con emplazamiento previo y 3 meses para responder, y el 869-2 le da la facultad adicional de desconocer el velo corporativo de las entidades usadas en la conducta…",
   "aplica": "Reorganizaciones, ventas entre vinculados y estructuras cuyo único sentido sea el ahorro fiscal; la DIAN debe seguir el procedimiento especial para aplicarla.",
   "impuestos": [
    "procedimiento",
    "renta-pj",
    "renta-pn"
   ],
   "perfiles": [
    "persona-juridica",
    "persona-natural",
    "gran-contribuyente"
   ],
   "sectores": [],
   "temas": [
    "abuso",
    "antiabuso",
    "recaracterizacion",
    "planeacion fiscal"
   ],
   "estado": "vigente",
   "nota_vigencia": "Redacción vigente desde la Ley 1819 de 2016, que simplificó la figura creada por la Ley 1607 de 2012.",
   "importancia": "media",
   "url_dian": "https://normograma.dian.gov.co/dian/compilacion/docs/estatuto_tributario.htm",
   "url_alt": ""
  }
 ]
};
