/* ═══ ExógenaDIAN — Templates de constitución S.A.S. ═══
   Genera HTML de los estatutos y cartas de aceptación a partir del state
   del wizard crear-sas.html. Redacciones originales basadas en Ley 1258/2008,
   Decreto 410/1971 (Código de Comercio) y Decreto 2020/2009.

   API:
     sasTemplates.estatutos(state) → string HTML
     sasTemplates.cartas(state)    → string HTML (1 carta por administrador)
*/
(function(){
  'use strict';
  var H=window.certHelpers;

  function esc(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function fmtCOP(n){ return H?H.formatCOP(n||0):('$'+(n||0).toLocaleString('es-CO')); }
  function letras(n){ return H?H.numeroALetras(n||0):''; }
  function fechaLarga(yyyymmdd){
    if(!yyyymmdd) return '—';
    return H?H.formatFechaLarga(yyyymmdd):yyyymmdd;
  }

  function razonCompleta(s){
    var r=(s.sociedad.razon||'').trim();
    return r ? (r+' S.A.S.') : '[Razón Social] S.A.S.';
  }

  // ── Estatutos ──
  function estatutos(s){
    if(!s || !s.sociedad) return '<p style="color:#9CA3AF">Llena el wizard para ver los estatutos.</p>';

    var razon=razonCompleta(s);
    var ciudad=s.sociedad.municipio_nombre||'[Ciudad]';
    var direccion=s.sociedad.direccion||'[Dirección]';
    var sigla=(s.sociedad.sigla||'').trim();

    var vigenciaTexto = s.sociedad.vigencia==='definida' && s.sociedad.vigencia_fecha
      ? 'tendrá una duración determinada hasta el '+fechaLarga(s.sociedad.vigencia_fecha)+', salvo que los accionistas decidan disolverla anticipadamente o prorrogarla'
      : 'tendrá una duración indefinida, salvo decisión en contrario adoptada por la asamblea de accionistas en los términos de los presentes estatutos y la ley';

    var objetoTexto = s.sociedad.objeto==='detallado' && (s.sociedad.objeto_detalle||'').trim()
      ? 'tendrá por objeto el desarrollo de las siguientes actividades principales: '+esc(s.sociedad.objeto_detalle.trim())+'. Para el cumplimiento de su objeto, la sociedad podrá ejecutar todos los actos y celebrar todos los contratos directamente relacionados con el mismo y los que tengan por finalidad ejercer los derechos o cumplir las obligaciones que de él se deriven'
      : 'podrá realizar cualquier actividad civil o comercial lícita, en los términos del numeral 5 del artículo 5 de la Ley 1258 de 2008. Para el desarrollo de cualquier actividad que escoja, la sociedad podrá celebrar todos los actos y contratos relacionados con la misma y los que tengan por finalidad ejercer los derechos o cumplir las obligaciones que de ella se deriven';

    var ciiu = s.sociedad.ciiu ? ' Su actividad principal corresponde al código CIIU '+esc(s.sociedad.ciiu)+' (Resolución DANE — CIIU Rev. 4 A.C.).' : '';

    var cap=s.capital;
    var totalAccionesAut = cap.nominal>0?Math.round(cap.autorizado/cap.nominal):0;
    var totalAccionesSus = cap.nominal>0?Math.round(cap.suscrito/cap.nominal):0;
    var totalAccionesPag = cap.nominal>0?Math.round(cap.pagado/cap.nominal):0;
    var saldoPagar = cap.suscrito - cap.pagado;

    // Lista de accionistas (preámbulo y firmas)
    var accionistasList = (s.socios||[]).filter(function(x){return x.nombre || x.id;});
    var accionistasPreambulo = accionistasList.length
      ? accionistasList.map(function(x, i){
          var pct = totalAccionesSus>0 ? ((x.acciones||0)*100/totalAccionesSus).toFixed(2) : '0.00';
          return '<li><strong>'+esc(x.nombre)+'</strong>, identificado(a) con el documento N° '+esc(x.id)+', titular de '+(x.acciones||0).toLocaleString('es-CO')+' acciones (equivalente al '+pct+'% del capital suscrito)</li>';
        }).join('')
      : '<li style="color:#9CA3AF">Aún no has agregado accionistas (paso 3)</li>';

    // Tabla de aportes
    var aportesRows = accionistasList.length
      ? accionistasList.map(function(x){
          var aporte = (x.acciones||0) * (cap.nominal||0);
          return '<tr><td>'+esc(x.nombre||'—')+'</td><td>'+esc(x.id||'—')+'</td><td class="num">'+(x.acciones||0).toLocaleString('es-CO')+'</td><td class="num">'+fmtCOP(aporte)+'</td></tr>';
        }).join('')
      : '<tr><td colspan="4" style="text-align:center;color:#9CA3AF">— Sin accionistas registrados —</td></tr>';

    // Cláusulas opcionales
    var clausulasOpcionales = '';
    if(s.opciones.preferencia){
      clausulasOpcionales += clausula('Derecho de preferencia en la suscripción',
        'Cuando la sociedad emita nuevas acciones, los accionistas tendrán derecho preferente para suscribirlas en proporción a las que ya posean en el capital suscrito al momento de la emisión, en los términos del artículo 38 de la Ley 1258 de 2008. La asamblea fijará el plazo y las condiciones del ejercicio del derecho. Solo podrá suprimirse este derecho mediante decisión adoptada con el voto favorable de la totalidad de las acciones suscritas.');
    }
    if(s.opciones.negociacion){
      var anos = s.opciones.negociacion_anos||5;
      clausulasOpcionales += clausula('Restricciones a la negociación de las acciones',
        'Las acciones emitidas por la sociedad no podrán ser negociadas durante un término de '+anos+' año(s) contados a partir de la fecha de su emisión, de conformidad con el artículo 13 de la Ley 1258 de 2008. Vencido este término las acciones serán de libre negociación, salvo que la asamblea acuerde una nueva restricción dentro de los límites que establece la ley. La negociación realizada en contravención a esta cláusula carecerá de efectos.');
    }
    if(s.opciones.arbitraje){
      clausulasOpcionales += clausula('Cláusula compromisoria',
        'Las diferencias que ocurran entre los accionistas, entre éstos y la sociedad o entre los accionistas y los administradores, con ocasión del contrato social o por las actividades sociales, serán resueltas por un tribunal de arbitramento administrado por el Centro de Arbitraje y Conciliación de la Cámara de Comercio del domicilio principal. El tribunal estará compuesto por árbitros designados conforme al reglamento del centro, fallará en derecho y el laudo será definitivo.');
    }
    if(s.opciones.exclusion){
      clausulasOpcionales += clausula('Causales de exclusión',
        'La asamblea, mediante decisión adoptada por la mayoría absoluta de las acciones suscritas, podrá excluir a un accionista cuando éste: (i) no pague las cuotas suscritas en los plazos y condiciones acordados; (ii) realice actos de competencia desleal con la sociedad; (iii) viole gravemente los deberes establecidos en estos estatutos o en la ley. La exclusión se hará previa audiencia del accionista, quien tendrá derecho a recibir el reembolso del valor de sus acciones determinado por peritos.');
    }

    // ─ Construcción del documento ─
    var html = '';
    html += '<h1>Estatutos sociales — '+esc(razon)+(sigla?' ('+esc(sigla)+')':'')+'</h1>';
    html += '<p class="cert-fecha" style="text-align:center;font-style:italic;color:#444;font-size:10pt">Documento privado de constitución — '+esc(ciudad)+', '+fechaLarga(s.meta.fecha)+'</p>';

    html += '<p class="preambulo">'+(accionistasList.length>1?'Los suscritos':'El suscrito')+', '+(accionistasList.length>1?'cuyas identidades se relacionan a continuación':'cuya identidad se relaciona a continuación')+', actuando '+(accionistasList.length>1?'todos':'')+' en nuestro propio nombre y manifestando expresamente nuestra voluntad de constituir una sociedad por acciones simplificada, hemos acordado celebrar el presente acto '+(accionistasList.length>1?'plurilateral':'unilateral')+' de constitución, el cual se rige por la <strong>Ley 1258 de 2008</strong>, las normas del Código de Comercio aplicables a la sociedad anónima y las demás disposiciones legales que resulten compatibles, con sujeción a las siguientes cláusulas:</p>';

    html += '<ul style="margin:0 0 14pt 16pt;padding:0">'+accionistasPreambulo+'</ul>';

    // TÍTULO I
    html += '<h2 class="art" style="text-align:center;text-transform:uppercase;letter-spacing:.5px">Título I — Disposiciones Generales</h2>';

    html += clausula('Forma y régimen', 'La sociedad que por este acto se constituye es una <strong>sociedad por acciones simplificada</strong>, de naturaleza comercial, regulada por las disposiciones de la Ley 1258 de 2008, los presentes estatutos y, en lo no previsto en ellos, por las normas legales aplicables a la sociedad anónima y las disposiciones generales del Código de Comercio que resulten compatibles con el régimen propio de la SAS.');

    html += clausula('Razón social', 'La sociedad girará bajo la denominación <strong>'+esc(razon)+'</strong>'+(sigla?' y podrá identificarse con la sigla <strong>'+esc(sigla)+'</strong>':'')+'. La denominación se utilizará en todos los actos y contratos que celebre la sociedad, así como en los documentos sociales en general.');

    html += clausula('Domicilio principal', 'El domicilio principal de la sociedad es la ciudad de <strong>'+esc(ciudad)+'</strong>, República de Colombia, en la dirección <strong>'+esc(direccion)+'</strong>. Por decisión de la asamblea de accionistas la sociedad podrá crear sucursales, agencias o establecimientos en cualquier lugar del país o del exterior.');

    html += clausula('Duración', 'La sociedad '+vigenciaTexto+'.');

    html += clausula('Objeto social', 'La sociedad '+objetoTexto+'.'+ciiu);

    // TÍTULO II
    html += '<h2 class="art" style="text-align:center;text-transform:uppercase;letter-spacing:.5px">Título II — Capital y Acciones</h2>';

    html += clausula('Capital autorizado, suscrito y pagado',
      'El capital de la sociedad se divide en <strong>capital autorizado</strong>, <strong>capital suscrito</strong> y <strong>capital pagado</strong>, con las siguientes cifras al momento de la constitución:'+
      '<table style="margin-top:6pt"><thead><tr><th>Concepto</th><th class="num">Valor</th><th class="num">N° de acciones</th></tr></thead><tbody>'+
        '<tr><td>Capital autorizado</td><td class="num">'+fmtCOP(cap.autorizado)+'</td><td class="num">'+totalAccionesAut.toLocaleString('es-CO')+'</td></tr>'+
        '<tr><td>Capital suscrito</td><td class="num">'+fmtCOP(cap.suscrito)+'</td><td class="num">'+totalAccionesSus.toLocaleString('es-CO')+'</td></tr>'+
        '<tr><td>Capital pagado</td><td class="num">'+fmtCOP(cap.pagado)+'</td><td class="num">'+totalAccionesPag.toLocaleString('es-CO')+'</td></tr>'+
        '<tr><td>Valor nominal por acción</td><td class="num">'+fmtCOP(cap.nominal)+'</td><td class="num">—</td></tr>'+
      '</tbody></table>'+
      '<p style="margin-top:6pt">Las acciones serán <strong>ordinarias y nominativas</strong>, salvo que la asamblea acuerde la creación de clases especiales en los términos del artículo 10 de la Ley 1258 de 2008.</p>');

    if(saldoPagar>0){
      html += clausula('Forma y términos de pago del capital',
        'El saldo del capital suscrito pendiente de pago, equivalente a <strong>'+fmtCOP(saldoPagar)+'</strong>, será cancelado por los accionistas dentro de los <strong>dos (2) años</strong> siguientes a la fecha de suscripción, en los términos del artículo 9 de la Ley 1258 de 2008. La asamblea podrá fijar plazos menores y modalidades específicas de pago para cada accionista.');
    } else {
      html += clausula('Forma y términos de pago del capital',
        'El capital suscrito al momento de la constitución se encuentra <strong>íntegramente pagado</strong>, conforme al detalle de aportes que se relaciona más adelante. Para futuras suscripciones la asamblea fijará los plazos y condiciones de pago, los cuales no podrán exceder de dos (2) años contados desde la fecha de suscripción (Art. 9 Ley 1258 de 2008).');
    }

    html += clausula('Aportes individuales',
      'Los aportes realizados por cada accionista al capital suscrito de la sociedad son los siguientes:'+
      '<table style="margin-top:6pt"><thead><tr><th>Accionista</th><th>Documento</th><th class="num">Acciones</th><th class="num">Valor del aporte</th></tr></thead><tbody>'+aportesRows+'</tbody></table>'+
      '<p style="margin-top:6pt;font-size:10pt">Los aportes en especie, si los hay, han sido valorados de común acuerdo por los accionistas, quienes responderán solidariamente por dicho avalúo durante un plazo de dos (2) años, contados desde la fecha de inscripción del documento de constitución en el registro mercantil, conforme al artículo 7 de la Ley 1258 de 2008.</p>');

    // TÍTULO III - Órganos
    html += '<h2 class="art" style="text-align:center;text-transform:uppercase;letter-spacing:.5px">Título III — Órganos Sociales</h2>';

    html += clausula('Estructura orgánica',
      'La dirección, administración y representación de la sociedad estarán a cargo de los siguientes órganos: (i) la <strong>asamblea de accionistas</strong>, como órgano supremo; '+
      (s.admon.jd.enabled?'(ii) la <strong>junta directiva</strong>, como órgano colegiado de administración; (iii) ':'(ii) ')+
      'el <strong>representante legal</strong>, como órgano de representación y administración'+
      (s.admon.rf.enabled?'; y (iv) el <strong>revisor fiscal</strong>, como órgano de fiscalización':'')+
      '. La asamblea podrá modificar la estructura administrativa con sujeción al artículo 17 de la Ley 1258 de 2008.');

    html += clausula('Asamblea de accionistas',
      'La asamblea está conformada por todos los accionistas reunidos con el quórum y en las condiciones establecidas en los presentes estatutos. Se reunirá ordinariamente una vez al año dentro de los tres (3) primeros meses del año calendario y extraordinariamente cuando sea convocada por el representante legal'+
      (s.admon.jd.enabled?', la junta directiva':'')+
      ', el revisor fiscal (cuando lo haya) o un número plural de accionistas que represente al menos la quinta parte del capital suscrito. La convocatoria se hará por comunicación escrita dirigida a la dirección registrada de cada accionista, con una antelación mínima de cinco (5) días hábiles, salvo que la totalidad de los accionistas se encuentre presente o representada, caso en el cual podrán deliberar y decidir válidamente sin necesidad de convocatoria previa.');

    if(s.admon.jd.enabled){
      var princ=(s.admon.jd.principales||'').split('\n').filter(function(l){return l.trim();});
      var supl=(s.admon.jd.suplentes||'').split('\n').filter(function(l){return l.trim();});
      var listaJD = '<ul style="margin:6pt 0 0 18pt"><li><strong>Principales:</strong></li>'+
        princ.map(function(l){return '<li style="margin-left:12pt">'+esc(l)+'</li>';}).join('') +
        (supl.length?'<li style="margin-top:4pt"><strong>Suplentes:</strong></li>'+supl.map(function(l){return '<li style="margin-left:12pt">'+esc(l)+'</li>';}).join(''):'')+
        '</ul>';
      html += clausula('Junta directiva',
        'La sociedad tendrá una junta directiva integrada por '+princ.length+' miembros principales'+(supl.length?' y '+supl.length+' suplente(s)':'')+'. Se reunirá ordinariamente al menos una vez por trimestre y extraordinariamente cuando sea convocada por el presidente, el representante legal o cualquiera de sus miembros. Sus decisiones se adoptarán por mayoría simple de los miembros presentes. Para el período inicial se designan las siguientes personas:'+listaJD);
    }

    var rl=s.admon.rl;
    var supBlock = s.admon.suplente.enabled
      ? ' La sociedad tendrá además un <strong>suplente del representante legal</strong>, '+esc(s.admon.suplente.nombre||'[Suplente]')+', identificado(a) con cédula de ciudadanía N° '+esc(s.admon.suplente.cc||'—')+', quien reemplazará al principal en sus faltas absolutas, temporales o accidentales con las mismas facultades.'
      : '';
    html += clausula('Representación legal',
      'La representación legal de la sociedad estará a cargo de un representante legal designado por la asamblea de accionistas. Para el período inicial se designa a <strong>'+esc(rl.nombre||'[RL]')+'</strong>, identificado(a) con cédula de ciudadanía N° '+esc(rl.cc||'—')+'.'+supBlock+
      ' El representante legal tendrá las siguientes facultades: ejecutar los actos y celebrar los contratos comprendidos dentro del objeto social y los conexos con el mismo; nombrar y remover empleados; constituir mandatarios judiciales y extrajudiciales; representar a la sociedad ante autoridades administrativas y judiciales; y, en general, todas las atribuciones que le correspondan como administrador conforme a la ley y los presentes estatutos. Para los actos que excedan de '+fmtCOP((cap.suscrito||100000000)*0.5)+' o el equivalente al cincuenta por ciento (50%) del capital suscrito, requerirá autorización previa de la asamblea de accionistas.');

    if(s.admon.rf.enabled){
      var rf=s.admon.rf;
      html += clausula('Revisor fiscal',
        'La sociedad tendrá un revisor fiscal nombrado por la asamblea de accionistas, con sujeción a las funciones y responsabilidades previstas en los artículos 207 y siguientes del Código de Comercio. Para el período inicial se designa a <strong>'+esc(rf.nombre||'[RF]')+'</strong>, identificado(a) con cédula de ciudadanía N° '+esc(rf.cc||'—')+', Contador(a) Público(a) con Tarjeta Profesional N° <strong>'+esc(rf.tp||'—')+'</strong> expedida por la Junta Central de Contadores. El revisor fiscal no podrá tener vínculos económicos, laborales o de parentesco con la sociedad o sus administradores en los términos del artículo 205 del Código de Comercio.');
    }

    // TÍTULO IV - Disolución y liquidación
    html += '<h2 class="art" style="text-align:center;text-transform:uppercase;letter-spacing:.5px">Título IV — Disolución y Liquidación</h2>';

    html += clausula('Causales de disolución',
      'La sociedad se disolverá por las causales previstas en el artículo 34 de la Ley 1258 de 2008 y, en lo no regulado, por las causales aplicables a la sociedad anónima conforme al Código de Comercio. La asamblea, mediante decisión adoptada con el voto favorable de las tres cuartas partes (3/4) del capital suscrito, podrá disolver la sociedad anticipadamente.');

    html += clausula('Liquidación',
      'La liquidación se sujetará a las reglas establecidas en el Código de Comercio para la liquidación de la sociedad anónima. La asamblea designará uno o varios liquidadores y, en su caso, sus suplentes. Mientras no se haga el nombramiento, asumirá las funciones de liquidador el representante legal vigente al momento de la disolución.');

    // TÍTULO V - Disposiciones varias y opcionales
    html += '<h2 class="art" style="text-align:center;text-transform:uppercase;letter-spacing:.5px">Título V — Disposiciones Varias</h2>';

    html += clausulasOpcionales;

    html += clausula('Distribución de utilidades',
      'Las utilidades líquidas que arroje el ejercicio social, debidamente aprobadas por la asamblea con base en estados financieros de fin de ejercicio, se distribuirán entre los accionistas en proporción a sus aportes pagados, una vez efectuadas las apropiaciones legales y estatutarias. La sociedad no estará obligada a constituir reserva legal en los términos del artículo 452 del Código de Comercio, salvo decisión expresa de la asamblea que así lo disponga.');

    html += clausula('Remisión',
      'En lo no previsto en los presentes estatutos, la sociedad se regirá por las disposiciones de la Ley 1258 de 2008, las normas legales aplicables a la sociedad anónima y, en general, las normas del Código de Comercio y demás disposiciones legales pertinentes.');

    // FIRMAS
    html += '<h2 class="art" style="margin-top:24pt">Firmas de los accionistas constituyentes</h2>';
    html += '<p style="font-size:10pt;color:#555;margin-bottom:14pt">En constancia de lo anterior, se firma el presente documento en '+esc(s.meta.lugar||ciudad)+', a los '+fechaLarga(s.meta.fecha)+'. Las firmas que aquí se consignan deberán ser autenticadas ante notario para efectos del registro mercantil, en los términos del artículo 5 de la Ley 1258 de 2008.</p>';

    if(accionistasList.length){
      accionistasList.forEach(function(x, i){
        html += '<div style="margin-top:24pt;page-break-inside:avoid">'+
          '<div style="border-top:1pt solid #111;width:70mm;padding-top:4pt;font-weight:700">'+esc(x.nombre)+'</div>'+
          '<div style="font-size:9.5pt;color:#444">C.C. / NIT '+esc(x.id||'—')+'</div>'+
          '<div style="font-size:9.5pt;color:#444">Acciones suscritas: '+(x.acciones||0).toLocaleString('es-CO')+'</div>'+
          '</div>';
      });
    } else {
      html += '<p style="color:#9CA3AF;font-style:italic">— Aún no has agregado accionistas (paso 3) —</p>';
    }

    return html;
  }

  function clausula(titulo, cuerpo){
    return '<h2 class="art">'+esc(titulo)+'</h2><p>'+cuerpo+'</p>';
  }

  // ── Cartas de aceptación ──
  function cartas(s){
    if(!s || !s.admon) return '<p style="color:#9CA3AF">Llena el wizard para ver las cartas.</p>';

    var razon=razonCompleta(s);
    var ciudad=s.sociedad.municipio_nombre||'[Ciudad]';
    var fecha=fechaLarga(s.meta.fecha);

    var cartas=[];
    if(s.admon.rl.nombre || s.admon.rl.cc){
      cartas.push(carta(s.admon.rl, 'Representante Legal Principal', razon, ciudad, fecha));
    }
    if(s.admon.suplente.enabled){
      cartas.push(carta(s.admon.suplente, 'Suplente del Representante Legal', razon, ciudad, fecha));
    }
    if(s.admon.jd.enabled){
      var princ=(s.admon.jd.principales||'').split('\n').filter(function(l){return l.trim();});
      var supl=(s.admon.jd.suplentes||'').split('\n').filter(function(l){return l.trim();});
      princ.forEach(function(linea){
        var parts=parseLinea(linea);
        cartas.push(carta(parts, 'Miembro Principal de la Junta Directiva', razon, ciudad, fecha));
      });
      supl.forEach(function(linea){
        var parts=parseLinea(linea);
        cartas.push(carta(parts, 'Miembro Suplente de la Junta Directiva', razon, ciudad, fecha));
      });
    }
    if(s.admon.rf.enabled){
      var rf={nombre:s.admon.rf.nombre, cc:s.admon.rf.cc, tp:s.admon.rf.tp};
      cartas.push(carta(rf, 'Revisor Fiscal', razon, ciudad, fecha, true));
    }

    if(cartas.length===0){
      return '<p style="color:#9CA3AF;text-align:center;margin-top:40pt">Cuando designes administradores en el paso 4, las cartas de aceptación aparecerán aquí.</p>';
    }
    return cartas.join('<div class="carta-separator"></div>');
  }

  function parseLinea(linea){
    // Acepta "Ana López, CC 1.045.678.901" o "Ana López 1045678901"
    var m=linea.match(/^([^,]+?)(?:[,\s]+(?:CC|C\.C\.|cédula|cedula)?\s*([\d\.]+))?$/i);
    if(m) return {nombre:(m[1]||'').trim(), cc:((m[2]||'').replace(/[^\d]/g,'')||'')};
    return {nombre:linea.trim(), cc:''};
  }

  function carta(pers, cargo, razon, ciudad, fecha, esContador){
    var nombre=pers.nombre||'[Nombre]';
    var cc=pers.cc||'—';
    var tpLine = esContador && pers.tp ? '<div>Tarjeta Profesional N° '+esc(pers.tp)+' — Junta Central de Contadores</div>' : '';

    return '<h1 style="font-size:13pt">Carta de Aceptación de Cargo</h1>'+
      '<p class="cert-fecha" style="text-align:right;margin-bottom:14pt">'+esc(ciudad)+', '+fecha+'</p>'+
      '<p>Señores</p>'+
      '<p><strong>'+esc(razon)+'</strong><br>'+esc(ciudad)+'</p>'+
      '<p style="margin-top:14pt">Asunto: <strong>Aceptación de cargo de '+esc(cargo)+'</strong></p>'+
      '<p style="margin-top:14pt">El(la) suscrito(a), <strong>'+esc(nombre)+'</strong>, identificado(a) con cédula de ciudadanía N° '+esc(cc)+', mayor de edad y domiciliado(a) en '+esc(ciudad)+', por medio de la presente comunicación manifiesta de manera libre y voluntaria que <strong>acepta el cargo de '+esc(cargo)+'</strong> de la sociedad <strong>'+esc(razon)+'</strong>, designación que le fue conferida en el documento privado de constitución de la sociedad de fecha '+fecha+'.</p>'+
      '<p>En virtud de lo dispuesto en el artículo 163 del Código de Comercio, el(la) suscrito(a) declara bajo la gravedad del juramento que <strong>no se encuentra incurso(a) en causales de inhabilidad o incompatibilidad</strong> que le impidan ejercer el cargo, ni en las prohibiciones señaladas en los artículos 22 y 23 de la Ley 222 de 1995 sobre los deberes de los administradores. Manifiesta así mismo que ejercerá el cargo con la diligencia de un buen hombre de negocios, actuando de buena fe, con lealtad y observando los deberes de cuidado, fidelidad y reserva inherentes a la función.</p>'+
      (esContador ? '<p>En su condición de Contador(a) Público(a) con Tarjeta Profesional vigente, declara conocer y se compromete a observar los principios y normas establecidos en la Ley 43 de 1990 y en el Código de Ética del Contador Público, así como las disposiciones de la Ley 1314 de 2009 y los marcos técnicos contables vigentes.</p>' : '')+
      '<p style="margin-top:14pt">En constancia de lo anterior, firma el(la) suscrito(a):</p>'+
      '<div style="margin-top:30pt">'+
        '<div style="border-top:1pt solid #111;width:70mm;padding-top:4pt;font-weight:700">'+esc(nombre)+'</div>'+
        '<div style="font-size:9.5pt;color:#444">C.C. '+esc(cc)+'</div>'+
        tpLine+
      '</div>';
  }

  window.sasTemplates={
    estatutos: estatutos,
    cartas: cartas
  };
})();
