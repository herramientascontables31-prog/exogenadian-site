/* ═══ ExógenaDIAN — Estatuto Tributario: capa de valor propia ═══
   Para cada artículo destacado: explicación "en simple", concordancias (remisiones),
   herramientas del portal que lo aplican y, cuando corresponde, una tabla curada
   (las tarifas que la fuente publica como imagen y no quedan en el texto).
   Redacción y selección 100% ExógenaDIAN — no reproduce anotaciones de terceros.
   Datos verificados contra normativa vigente (Leyes 1819/2016, 2010/2019, 2155/2021, 2277/2022). */
(function(){
// Tabla de retención en la fuente por salarios y pensiones — art. 383 (vigente Ley 2010/2019).
var TABLA_383 =
  '<table><caption>Tabla del artículo 383 — la base se expresa en UVT (rangos vigentes).</caption>'+
  '<thead><tr><th>Rango en UVT</th><th>Tarifa marginal</th><th>Impuesto en UVT</th></tr></thead><tbody>'+
  '<tr><td>Desde 0 hasta 95</td><td>0%</td><td>0</td></tr>'+
  '<tr><td>&gt;95 hasta 150</td><td>19%</td><td>(Ingreso en UVT − 95) × 19%</td></tr>'+
  '<tr><td>&gt;150 hasta 360</td><td>28%</td><td>(Ingreso − 150) × 28% + 10</td></tr>'+
  '<tr><td>&gt;360 hasta 640</td><td>33%</td><td>(Ingreso − 360) × 33% + 69</td></tr>'+
  '<tr><td>&gt;640 hasta 945</td><td>35%</td><td>(Ingreso − 640) × 35% + 162</td></tr>'+
  '<tr><td>&gt;945 hasta 2.300</td><td>37%</td><td>(Ingreso − 945) × 37% + 268</td></tr>'+
  '<tr><td>&gt;2.300 en adelante</td><td>39%</td><td>(Ingreso − 2.300) × 39% + 770</td></tr>'+
  '</tbody></table>';
// Tabla del impuesto de renta de personas naturales residentes — art. 241 (renta líquida cedular general + pensiones).
var TABLA_241 =
  '<table><caption>Tabla del artículo 241 — base (renta líquida gravable) en UVT.</caption>'+
  '<thead><tr><th>Rango en UVT</th><th>Tarifa marginal</th><th>Impuesto en UVT</th></tr></thead><tbody>'+
  '<tr><td>Desde 0 hasta 1.090</td><td>0%</td><td>0</td></tr>'+
  '<tr><td>&gt;1.090 hasta 1.700</td><td>19%</td><td>(Base − 1.090) × 19%</td></tr>'+
  '<tr><td>&gt;1.700 hasta 4.100</td><td>28%</td><td>(Base − 1.700) × 28% + 116</td></tr>'+
  '<tr><td>&gt;4.100 hasta 8.670</td><td>33%</td><td>(Base − 4.100) × 33% + 788</td></tr>'+
  '<tr><td>&gt;8.670 hasta 18.970</td><td>35%</td><td>(Base − 8.670) × 35% + 2.296</td></tr>'+
  '<tr><td>&gt;18.970 hasta 31.000</td><td>37%</td><td>(Base − 18.970) × 37% + 5.901</td></tr>'+
  '<tr><td>&gt;31.000 en adelante</td><td>39%</td><td>(Base − 31.000) × 39% + 10.352</td></tr>'+
  '</tbody></table>';

window.ET_ENRIQUECIDO = {
  // ── Disposiciones generales ──
  '1':{simple:'Define cuándo nace la obligación de pagar un impuesto: al realizarse el hecho que la ley señala como generador. Es la base de todo el sistema.',concordancias:['2','792']},
  '2':{simple:'Contribuyente es quien realiza el hecho gravado. No confundir con el agente retenedor o el responsable de recaudar.',concordancias:['3','4','792']},

  // ── Libro I · Renta ──
  '5':{simple:'La renta, las ganancias ocasionales y sus complementarios son un solo impuesto. Por eso una sola declaración los liquida.',concordancias:['6','26','299']},
  '9':{simple:'Las personas naturales residentes tributan sobre su renta de fuente mundial; las no residentes, solo sobre la de fuente nacional.',concordancias:['10','24','25']},
  '10':{simple:'Eres residente fiscal si permaneces más de 183 días en el país en 365 días, o por vínculos familiares/económicos. La residencia define qué rentas declaras.',concordancias:['9','24'],herramientas:['renta-personas-naturales.html']},
  '12':{simple:'Las sociedades nacionales tributan sobre renta mundial; las extranjeras, sobre la de fuente nacional.',concordancias:['20','240'],herramientas:['renta-juridica.html']},
  '26':{simple:'La fórmula madre de la renta: ingresos − devoluciones − ingresos no constitutivos − costos − deducciones = renta líquida, sobre la que se aplica la tarifa.',concordancias:['27','178','188'],herramientas:['renta-juridica.html','renta-personas-naturales.html']},
  '27':{simple:'Define cuándo se entiende recibido un ingreso (causación). Para no obligados a llevar contabilidad, por regla general cuando se recibe efectivamente.',concordancias:['28','26']},
  '45':{simple:'Las indemnizaciones por daño emergente del seguro no son renta (no enriquecen, reponen). El lucro cesante sí es gravado.',concordancias:['26'],herramientas:['renta-personas-naturales.html']},
  '47':{simple:'Los gananciales (lo que recibe un cónyuge por liquidación de la sociedad conyugal) no son renta ni ganancia ocasional.',concordancias:['299']},
  '48':{simple:'Los dividendos y participaciones no son ingreso gravado para el socio en la parte que ya tributó en cabeza de la sociedad. Se calcula con el art. 49.',concordancias:['49','242'],herramientas:['retencion-dividendos.html']},
  '49':{simple:'Procedimiento para determinar qué parte de los dividendos va como no gravada. Clave para distribuir utilidades sin doble tributación.',concordancias:['48','242'],herramientas:['retencion-dividendos.html']},
  '107':{simple:'La regla reina de las deducciones: un gasto es deducible si tiene relación de causalidad con la actividad, y es necesario y proporcional. Pilar de toda defensa de costos.',concordancias:['108','771-2','177-1'],herramientas:['renta-juridica.html']},
  '115':{simple:'Qué impuestos pagados son deducibles (industria y comercio, predial) y cuáles dan descuento. El GMF es deducible al 50%.',concordancias:['115-1','254'],herramientas:['renta-juridica.html']},
  '177-2':{simple:'No son deducibles los pagos a quienes no estén inscritos como responsables de IVA cuando debían estarlo. Refuerza la formalidad.',concordancias:['107','771-2']},
  '188':{simple:'Renta presuntiva: piso mínimo de renta. Hoy su tarifa es 0%, pero el artículo sigue vigente para reglas de transición y compensación.',concordancias:['189','191'],herramientas:['renta-juridica.html']},
  '206':{simple:'Las rentas de trabajo exentas, numeral por numeral. La estrella es el numeral 10: el 25% de los pagos laborales exento, hasta 790 UVT al año. Ojo a los límites del art. 336.',concordancias:['206-1','383','336','388'],herramientas:['renta-personas-naturales.html','retencion-fuente.html']},
  '206-1':{simple:'Renta exenta especial de servidores diplomáticos y consulares. No es la exención laboral general (esa es el numeral 10 del 206).',concordancias:['206']},
  '235-2':{simple:'Lista taxativa de rentas exentas vigentes (economía naranja derogada, energía, campo, vivienda VIS, CAN, etc.). Si no está aquí, por regla general no es exenta.',concordancias:['206','240'],herramientas:['renta-juridica.html']},
  '240':{simple:'Tarifa general de renta de personas jurídicas: 35%. Trae sobretasas (financiero +5, hidroeléctricas, hidrocarburos/carbón por precios) y la tasa mínima de tributación (TTD 15%).',concordancias:['240-1','241','115'],herramientas:['renta-juridica.html']},
  '240-1':{simple:'Tarifa de usuarios industriales de zona franca: 20% (con condiciones de plan de internacionalización). Combina con la tasa mínima del art. 240.',concordancias:['240'],herramientas:['renta-juridica.html']},
  '241':{tabla:TABLA_241,simple:'Tarifa progresiva del impuesto de renta de personas naturales residentes, sobre la renta líquida gravable cedular (general y de pensiones) en UVT.',concordancias:['242','330','335','336'],herramientas:['renta-personas-naturales.html']},
  '242':{simple:'Tarifa de los dividendos para personas naturales residentes: hoy entran a la tabla del art. 241 con un descuento. Cambió con la Ley 2277/2022.',concordancias:['49','241','245'],herramientas:['retencion-dividendos.html']},
  '245':{simple:'Tarifa de dividendos para sociedades y personas no residentes (20%).',concordancias:['242','246'],herramientas:['retencion-dividendos.html']},
  '254':{simple:'Descuento por impuestos pagados en el exterior, para evitar doble tributación internacional sobre las mismas rentas.',concordancias:['255','259'],herramientas:['renta-juridica.html']},
  '256':{simple:'Descuento por inversiones en ciencia, tecnología e innovación (CTeI).',concordancias:['255','257','258']},
  '257':{simple:'Descuento por donaciones a entidades sin ánimo de lucro del régimen especial.',concordancias:['125','258','356']},
  '258':{simple:'Límite conjunto de los descuentos de los arts. 255, 256 y 257: no pueden exceder el 25% del impuesto.',concordancias:['254','259']},
  '260-1':{simple:'Régimen de precios de transferencia: las operaciones con vinculados del exterior deben pactarse a precios de mercado (principio de plena competencia).',concordancias:['260-2','260-5','260-7']},
  '299':{simple:'Qué es ganancia ocasional: ingresos por hechos no ordinarios (venta de activos fijos poseídos +2 años, herencias, loterías). Tributa aparte de la renta.',concordancias:['300','303','311','313'],herramientas:['renta-personas-naturales.html']},
  '300':{simple:'Ganancia ocasional por venta de activos fijos poseídos dos años o más. Si se poseyeron menos, es renta ordinaria.',concordancias:['299','90']},
  '303':{simple:'Cómo se valoran las herencias, legados y donaciones para ganancia ocasional.',concordancias:['302','307']},
  '311-1':{simple:'Ganancia ocasional exenta por la venta de la casa o apartamento de habitación, hasta el tope en UVT y con destinación de los recursos.',concordancias:['300','307']},
  '313':{simple:'Tarifa de ganancia ocasional para sociedades: 15%.',concordancias:['314','299']},
  '314':{simple:'Tarifa de ganancia ocasional para personas naturales residentes: 15%.',concordancias:['313','316','317'],herramientas:['renta-personas-naturales.html']},
  '317':{simple:'Tarifa de ganancia ocasional por loterías, rifas y apuestas: 20%.',concordancias:['304','402']},
  '329':{simple:'Define quiénes determinan su renta por el sistema cedular (personas naturales residentes).',concordancias:['330','335']},
  '330':{simple:'Determinación cedular: la renta de las personas naturales se separa en cédula general, de pensiones y de dividendos, cada una con sus reglas.',concordancias:['331','335','337','342'],herramientas:['renta-personas-naturales.html']},
  '331':{simple:'Cómo se suman las cédulas (rentas líquidas) para llegar a la renta líquida gravable total.',concordancias:['330','335']},
  '335':{simple:'Ingresos de la cédula general (rentas de trabajo, de capital y no laborales).',concordancias:['336','103','340'],herramientas:['renta-personas-naturales.html']},
  '336':{simple:'Cómo se depura la cédula general. Aquí vive el límite del 40% (y 1.340 UVT) a rentas exentas y deducciones — el cálculo que más errores genera.',concordancias:['335','206','387'],herramientas:['renta-personas-naturales.html']},
  '337':{simple:'Cédula de pensiones: las pensiones son exentas hasta 1.000 UVT mensuales; el exceso tributa.',concordancias:['206','330','206-1'],herramientas:['renta-personas-naturales.html']},
  '342':{simple:'Ingresos de la cédula de dividendos y participaciones.',concordancias:['343','242','49'],herramientas:['retencion-dividendos.html']},
  '356':{simple:'Régimen tributario especial de las ESAL: tributan al 20% sobre el beneficio neto, exento si se reinvierte en el objeto social.',concordancias:['357','358','359','364-3'],herramientas:['renta-juridica.html']},
  '359':{simple:'Objeto social que deben tener las entidades sin ánimo de lucro para pertenecer al régimen especial.',concordancias:['356','364-3']},
  '364-3':{simple:'Causales de exclusión del régimen tributario especial de las ESAL.',concordancias:['356','364-1']},

  // ── Libro II · Retención en la fuente ──
  '365':{simple:'Faculta al Gobierno para fijar retenciones. Su parágrafo 2 es la base de la autorretención especial de renta.',concordancias:['366','368'],herramientas:['retencion350.html']},
  '368':{simple:'Quiénes son agentes de retención: las personas jurídicas y naturales con cierto patrimonio o ingresos, entidades públicas, etc.',concordancias:['369','375'],herramientas:['retencion350.html']},
  '383':{tabla:TABLA_383,simple:'La tabla de retención por salarios y pensiones. La base depurada se lleva a UVT y se ubica en el rango. El parágrafo 2 la extiende a honorarios de independientes (rentas de trabajo).',concordancias:['384','385','386','388','206','336'],herramientas:['retencion-fuente.html','salario-neto.html']},
  '384':{simple:'Tarifa mínima de retención para empleados (procedimiento adicional). Hoy de aplicación limitada, pero vigente.',concordancias:['383','388']},
  '388':{simple:'Cómo se depura la base de retención de rentas de trabajo: ingresos − INCRNGO − deducciones − rentas exentas, con el límite del 40%.',concordancias:['383','387','336'],herramientas:['retencion-fuente.html']},
  '392':{simple:'Retención por honorarios, comisiones, servicios y arrendamientos. Las tarifas las fija el reglamento (DUR 1625/2016).',concordancias:['401','383'],herramientas:['retencion350.html','retencion-compras.html']},
  '401':{simple:'Retención por compras y otros ingresos tributarios. Base de la mayoría de retenciones en compras de bienes.',concordancias:['392','437-2'],herramientas:['retencion-compras.html','retencion350.html']},
  '408':{simple:'Retención sobre pagos al exterior (intereses, regalías, servicios técnicos, consultoría). Tarifas según el concepto.',concordancias:['406','124'],herramientas:['retencion350.html']},

  // ── Libro III · IVA ──
  '420':{simple:'El hecho generador del IVA: venta de bienes corporales muebles e inmuebles, prestación de servicios, importaciones y juegos de suerte y azar.',concordancias:['421','424','437','468'],herramientas:['iva300.html']},
  '424':{simple:'Lista de bienes EXCLUIDOS de IVA (no causan impuesto y no dan derecho a descontable). Distintos de los exentos (tarifa 0%).',concordancias:['476','477','468'],herramientas:['iva300.html']},
  '426':{simple:'Servicio de restaurante y bar: excluido de IVA pero gravado con impuesto al consumo (INC).',concordancias:['512-1','424'],herramientas:['impuesto-consumo.html']},
  '437':{simple:'Quiénes son responsables del IVA. Su parágrafo 3 define a los "no responsables" (antes "régimen simplificado"): umbral de 3.500 UVT y otras condiciones.',concordancias:['437-1','437-2','420'],herramientas:['iva300.html']},
  '437-2':{simple:'Agentes de retención del IVA (ReteIVA): entidades públicas, grandes contribuyentes, quienes contratan con no domiciliados, etc.',concordancias:['437','401','615-1'],herramientas:['retencion350.html','retencion-compras.html']},
  '447':{simple:'Base gravable del IVA en la venta y prestación de servicios: el valor total de la operación, incluyendo gastos accesorios.',concordancias:['448','458','468']},
  '458':{simple:'Base gravable del IVA en las importaciones.',concordancias:['447','459']},
  '468':{simple:'Tarifa general del IVA: 19%.',concordancias:['468-1','468-3','420'],herramientas:['iva300.html']},
  '468-1':{simple:'Bienes gravados a la tarifa del 5%.',concordancias:['468','468-3'],herramientas:['iva300.html']},
  '476':{simple:'Servicios EXCLUIDOS de IVA (salud, educación, transporte público de pasajeros, intereses, etc.). Lista taxativa.',concordancias:['424','420'],herramientas:['iva300.html']},
  '477':{simple:'Bienes EXENTOS de IVA: tarifa 0% pero con derecho a impuestos descontables y devolución. Carne, leche, huevos, libros, etc.',concordancias:['481','424','489'],herramientas:['iva300.html']},
  '481':{simple:'Bienes y servicios exentos con derecho a devolución bimestral (exportaciones, etc.).',concordancias:['477','489','850'],herramientas:['iva300.html']},
  '485':{simple:'Impuestos descontables: el IVA pagado en compras que se resta del IVA generado en ventas. Corazón del cálculo del IVA a pagar.',concordancias:['488','496','771-2'],herramientas:['iva300.html']},
  '496':{simple:'Oportunidad para solicitar los impuestos descontables: el bimestre de la causación o uno de los tres siguientes.',concordancias:['485','488'],herramientas:['iva300.html']},
  '512-1':{simple:'Impuesto nacional al consumo (INC): restaurantes, telefonía, vehículos. Tarifas del 4%, 8% y 16% según el bien o servicio.',concordancias:['426','512-13'],herramientas:['impuesto-consumo.html']},

  // ── Libro IV · Timbre ──
  '519':{simple:'Impuesto de timbre: hoy con tarifa general del 0% salvo casos puntuales (p. ej. enajenación de inmuebles según rango). Revisa la última reforma.',concordancias:['514','530']},

  // ── Libro V · Procedimiento y sanciones ──
  '555-2':{simple:'El Registro Único Tributario (RUT): mecanismo único para identificar y clasificar a los contribuyentes ante la DIAN.',concordancias:['555','562'],herramientas:['consultanit.html']},
  '580':{simple:'Cuándo una declaración se tiene por NO presentada (sin firma, sin pago de la retención, etc.). Errores que cuestan caro.',concordancias:['579','588','650']},
  '588':{simple:'Corrección de declaraciones que aumentan el impuesto o disminuyen el saldo a favor. Plazo y sanción (art. 644).',concordancias:['589','644','714']},
  '589':{simple:'Corrección que disminuye el impuesto o aumenta el saldo a favor (a favor del contribuyente).',concordancias:['588','714']},
  '631':{simple:'La norma madre de la información exógena: faculta a la DIAN a pedir información de terceros (formatos 1001, 1003, 1007, 1008…).',concordancias:['631-3','651','623'],herramientas:['exogena.html']},
  '634':{simple:'Intereses moratorios: se causan sobre los impuestos pagados tarde, a la tasa de usura menos algunos puntos. Base del cálculo de mora.',concordancias:['635','814'],herramientas:['intereses.html']},
  '639':{simple:'Sanción mínima: ninguna sanción puede ser inferior a 10 UVT (salvo excepciones).',concordancias:['640','641'],herramientas:['sanciones-dian.html']},
  '640':{simple:'Principios de las sanciones: gradualidad, proporcionalidad, lesividad y favorabilidad. Permite reducir sanciones por buen comportamiento.',concordancias:['639','641','647'],herramientas:['sanciones-dian.html']},
  '641':{simple:'Sanción por extemporaneidad antes del emplazamiento: 5% del impuesto por mes o fracción (tope 100%).',concordancias:['642','640','643'],herramientas:['sanciones-dian.html']},
  '643':{simple:'Sanción por no declarar, liquidada por la DIAN sobre ingresos, consignaciones o patrimonio según el impuesto.',concordancias:['641','716'],herramientas:['sanciones-dian.html']},
  '644':{simple:'Sanción por corrección: 10% del mayor valor si se corrige antes del emplazamiento; 20% después.',concordancias:['588','640'],herramientas:['sanciones-dian.html']},
  '647':{simple:'Configuración de la inexactitud: omitir ingresos, incluir costos inexistentes, etc. Es la sanción más temida en fiscalización.',concordancias:['648','640','714'],herramientas:['sanciones-dian.html','auditor-cruces-dian.html']},
  '648':{simple:'Cuantía de la sanción por inexactitud: 100% del mayor impuesto (200% en abuso, 160% en activos omitidos). Reducible por el art. 640.',concordancias:['647','640'],herramientas:['sanciones-dian.html']},
  '651':{simple:'Sanción por no enviar información o enviarla con errores (exógena): hasta 15.000 UVT, graduada según el daño. Reducible si se subsana.',concordancias:['631','640'],herramientas:['sanciones-dian.html','exogena.html']},
  '684':{simple:'Amplias facultades de fiscalización e investigación de la DIAN: verificar, cruzar información, citar y exigir.',concordancias:['686','688','631']},
  '689-3':{simple:'Beneficio de auditoría: si aumentas tu impuesto neto de renta frente al año anterior, tu declaración queda en firme en 6 o 12 meses. Vigente y prorrogado.',concordancias:['714'],herramientas:['renta-juridica.html','renta-personas-naturales.html']},
  '705':{simple:'Plazo para que la DIAN notifique el requerimiento especial (regla general, antes de la firmeza).',concordancias:['706','714']},
  '714':{simple:'Firmeza de la declaración: por regla general 3 años desde el vencimiento o la presentación. Después la DIAN ya no puede revisarla.',concordancias:['705','689-3','147'],herramientas:['renta-juridica.html']},
  '742':{simple:'Las decisiones de la DIAN deben fundarse en pruebas. Apertura del régimen probatorio.',concordancias:['743','744','771-2']},
  '771-2':{simple:'La prueba de costos, deducciones e IVA descontable: exige factura con requisitos (arts. 617 y 618). Sin soporte válido, se rechaza el gasto.',concordancias:['617','618','107','771-5'],herramientas:['renta-juridica.html','contabilizar-fe.html']},
  '771-5':{simple:'Bancarización: para que un pago sea aceptado fiscalmente debe canalizarse por medios financieros. Los pagos en efectivo tienen límites de reconocimiento.',concordancias:['771-2','107']},
  '793':{simple:'Responsabilidad solidaria por el pago del tributo (socios, herederos, representantes en ciertos casos).',concordancias:['794','798']},
  '817':{simple:'Prescripción de la acción de cobro: 5 años. Vencido el plazo, la deuda ya no es exigible.',concordancias:['818','714']},
  '850':{simple:'Derecho a la devolución y/o compensación de saldos a favor y pagos en exceso.',concordancias:['815','481','489'],herramientas:['iva300.html']},
  '868':{simple:'La UVT (Unidad de Valor Tributario): la medida que actualiza cada año todas las cifras del Estatuto. La DIAN fija su valor por resolución antes de cada año.',concordancias:['868-1'],herramientas:['uvt.html']},
  '868-1':{simple:'Reexpresó en UVT los valores que antes estaban en pesos. Por eso casi todo el Estatuto habla en UVT.',concordancias:['868'],herramientas:['uvt.html']},
  '869':{simple:'Abuso en materia tributaria: la DIAN puede recaracterizar operaciones artificiosas hechas solo para reducir impuestos. La sanción por inexactitud sube al 200%.',concordancias:['869-1','869-2','648']},

  // ── Libro VI · GMF (4x1000) ──
  '870':{simple:'El Gravamen a los Movimientos Financieros (GMF o 4x1000): impuesto sobre las transacciones financieras (retiros, traslados).',concordancias:['871','872','879'],herramientas:['renta-juridica.html']},
  '871':{simple:'Hecho generador del GMF: la disposición de recursos de cuentas corrientes, de ahorro o de depósito.',concordancias:['870','872']},
  '872':{simple:'Tarifa del GMF: 4 por mil (0,4%). Es deducible de renta en el 50%.',concordancias:['870','115']},
  '879':{simple:'Exenciones del GMF: los retiros de cuentas de ahorro hasta el tope mensual marcado en UVT, entre otras.',concordancias:['872','871']},

  // ── Libro VIII · Régimen Simple (SIMPLE) ──
  '903':{simple:'Crea el Régimen Simple de Tributación (SIMPLE): un modelo opcional que reemplaza renta e integra INC e ICA, con declaración anual y anticipos bimestrales.',concordancias:['905','906','908'],herramientas:['regimen-simple.html','formato2593.html']},
  '904':{simple:'Hecho generador y base gravable del SIMPLE: la totalidad de los ingresos brutos ordinarios y extraordinarios.',concordancias:['903','908'],herramientas:['regimen-simple.html']},
  '905':{simple:'Quiénes pueden ser del SIMPLE: personas naturales o jurídicas con ingresos brutos inferiores a 100.000 UVT y que cumplan las condiciones.',concordancias:['906','903'],herramientas:['regimen-simple.html']},
  '906':{simple:'Quiénes NO pueden optar por el SIMPLE (ciertas actividades, vinculaciones, condiciones). Léelo antes de inscribir a un cliente.',concordancias:['905','903'],herramientas:['regimen-simple.html']},
  '908':{simple:'Tarifas del SIMPLE: dependen del grupo de actividad económica y del nivel de ingresos. Sustituyen el impuesto de renta.',concordancias:['903','904','910'],herramientas:['regimen-simple.html','formato2593.html']},
  '910':{simple:'Declaración anual y anticipos bimestrales del SIMPLE mediante el recibo electrónico.',concordancias:['908','911'],herramientas:['formato2593.html','regimen-simple.html']},
  '911':{simple:'En el SIMPLE no te practican retención de renta (con excepciones) y hay reglas especiales de autorretención.',concordancias:['908','910'],herramientas:['regimen-simple.html']}
};
})();
