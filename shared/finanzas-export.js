/**
 * ExogenaDIAN — Exports Finanzas Personales (PDF + Excel)
 *
 * Patron calcado de liquidador-export.js. Cualquier calculadora del modulo
 * de finanzas personales lo invoca pasando un payload uniforme:
 *
 *   exportFinanzasPDF({
 *     titulo:     'Salario neto mensual',
 *     slug:       'salario-neto',
 *     subtitulo:  'Procedimiento 1 — vigente 2026',
 *     inputs:     [['Salario bruto', '$5.000.000'], ['Dependientes', '1']],
 *     resultados: [['Salud (4%)', '-$200.000'], ['Pensión (4%)', '-$200.000']],
 *     destacado:  { label: 'NETO A RECIBIR', valor: '$4.275.000' },
 *     interpretacion: 'Tu salario neto es el 85,5% del bruto...',
 *     fuente:     'ET arts. 383, 387 | UVT 2026 = $52.374'
 *   });
 *
 * exportFinanzasExcel(opts) recibe el mismo payload y produce un .xlsx.
 *
 * Dependencias globales: jsPDF + jsPDF-AutoTable (ya cargados en el resto del
 * sitio), ExcelJS para Excel, exoToast para errores.
 */
(function () {
  'use strict';

  // === Paleta navy/verde, identica al liquidador y al resto del sitio ===
  var COLOR_NAVY    = [27, 58, 92];
  var COLOR_GREEN   = [5, 150, 105];
  var COLOR_GRAY    = [107, 114, 128];
  var COLOR_BORDER  = [226, 232, 240];
  var COLOR_ALT     = [249, 250, 251];

  function _setFill(doc, rgb)   { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
  function _setText(doc, rgb)   { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }

  function _section(doc, M, cw, y, title) {
    doc.setFillColor(240, 242, 245); doc.rect(M, y - 4, cw, 8, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); _setText(doc, COLOR_NAVY);
    doc.text(title, M + 3, y + 1);
    _setText(doc, [0, 0, 0]); doc.setFont('helvetica', 'normal');
  }

  function _toast(msg, kind) {
    if (typeof window.exoToast === 'function') window.exoToast(msg, kind || 'error');
    else alert(msg);
  }

  // === PDF ===
  window.exportFinanzasPDF = function (opts) {
    opts = opts || {};
    var doc;
    try {
      var J = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (!J) { _toast('jsPDF no cargó. Recarga la página.'); return; }
      doc = new J('p', 'mm', 'letter');
    } catch (e) { _toast('Error PDF: ' + e.message); return; }

    var W = 216, M = 18, cw = W - 2 * M, y = 18;

    // Header navy
    _setFill(doc, COLOR_NAVY); doc.rect(0, 0, W, 40, 'F');
    _setText(doc, [255, 255, 255]); doc.setFontSize(15); doc.setFont('helvetica', 'bold');
    doc.text(opts.titulo || 'Finanzas Personales — ExógenaDIAN', M, y); y += 8;
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    var sub = (opts.subtitulo || '') + (opts.subtitulo ? '  |  ' : '') +
              'Generado: ' + new Date().toLocaleDateString('es-CO');
    doc.text(sub, M, y);
    y += 17; _setText(doc, [0, 0, 0]);

    // 1. Inputs
    if (opts.inputs && opts.inputs.length) {
      _section(doc, M, cw, y, '1. DATOS INGRESADOS'); y += 8;
      doc.autoTable({
        startY: y, margin: { left: M, right: M }, theme: 'plain',
        body: opts.inputs,
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80, textColor: COLOR_GRAY },
          1: { cellWidth: cw - 80, halign: 'right' }
        },
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: COLOR_BORDER, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: COLOR_ALT }
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // 2. Resultados (tabla con cabecera)
    if (opts.resultados && opts.resultados.length) {
      _section(doc, M, cw, y, '2. RESULTADO'); y += 6;
      doc.autoTable({
        startY: y, margin: { left: M, right: M }, theme: 'grid',
        head: [['Concepto', 'Valor']], body: opts.resultados,
        headStyles: { fillColor: COLOR_NAVY, fontSize: 8, fontStyle: 'bold', halign: 'center', cellPadding: 3 },
        styles: { fontSize: 8.5, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.2 },
        columnStyles: { 0: { cellWidth: cw * 0.6 }, 1: { halign: 'right', fontStyle: 'bold' } },
        alternateRowStyles: { fillColor: COLOR_ALT },
        didParseCell: function (d) {
          if (d.section !== 'body') return;
          var t = String(d.cell.raw || '');
          if (t.indexOf('(-)') >= 0) d.cell.styles.textColor = [220, 38, 38];
        }
      });
      y = doc.lastAutoTable.finalY + 4;
    }

    // 3. Destacado (banner verde con el numero grande)
    if (opts.destacado) {
      if (y > 240) { doc.addPage(); y = 20; }
      _setFill(doc, COLOR_GREEN); doc.rect(M, y, cw, 14, 'F');
      _setText(doc, [255, 255, 255]); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text(opts.destacado.label || '', M + 3, y + 6);
      doc.setFontSize(13); doc.text(opts.destacado.valor || '', W - M - 3, y + 9, { align: 'right' });
      _setText(doc, [0, 0, 0]); doc.setFont('helvetica', 'normal');
      y += 20;
    }

    // 4. Interpretacion (parrafo)
    if (opts.interpretacion) {
      if (y > 250) { doc.addPage(); y = 20; }
      _section(doc, M, cw, y, '3. INTERPRETACIÓN'); y += 6;
      doc.setFontSize(9); _setText(doc, [60, 60, 60]);
      var lines = doc.splitTextToSize(opts.interpretacion, cw);
      doc.text(lines, M, y);
      y += lines.length * 4 + 4;
    }

    // Pie
    doc.setFontSize(6.5); _setText(doc, [160, 160, 160]);
    doc.text((opts.fuente || '') + '  |  ExógenaDIAN — finanzas-personales', M, 270);
    doc.text('Cálculo de referencia con fines didácticos. No constituye asesoría financiera.', M, 274);

    var slug = (opts.slug || 'finanzas') + '_' + new Date().toISOString().slice(0, 10);
    try { doc.save(slug + '.pdf'); }
    catch (e) { _toast('Error guardando PDF: ' + e.message); }
  };

  // === Excel ===
  window.exportFinanzasExcel = function (opts) {
    opts = opts || {};
    if (!window.ExcelJS) { _toast('ExcelJS no cargó.'); return; }

    try {
      var wb = new ExcelJS.Workbook(); wb.created = new Date();
      var sheetName = (opts.titulo || 'Finanzas').substring(0, 28);
      var ws = wb.addWorksheet(sheetName);
      ws.columns = [{ width: 42 }, { width: 24 }];

      var hF = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A5C' } };
      var wF = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      var gF = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
      var bdr = {
        top:    { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left:   { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right:  { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Titulo
      ws.mergeCells('A1:B1');
      var c1 = ws.getCell('A1');
      c1.value = opts.titulo || 'Finanzas Personales — ExógenaDIAN';
      c1.fill = hF; c1.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
      c1.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(1).height = 28;

      ws.mergeCells('A2:B2');
      ws.getCell('A2').value = (opts.subtitulo ? opts.subtitulo + ' — ' : '') +
                                new Date().toLocaleDateString('es-CO');
      ws.getCell('A2').font = { italic: true, color: { argb: 'FF6B7280' }, size: 9 };
      ws.addRow([]);

      function addSection(title) {
        var rw = ws.addRow([title, '']);
        ws.mergeCells('A' + rw.number + ':B' + rw.number);
        rw.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F2F5' } };
        rw.getCell(1).font = { bold: true, color: { argb: 'FF1B3A5C' }, size: 10 };
      }

      function addRow(label, value, style) {
        var rw = ws.addRow([label, value]);
        rw.getCell(1).font = { bold: true, size: 9, color: { argb: 'FF6B7280' } };
        if (typeof value === 'number') {
          rw.getCell(2).numFmt = '#,##0';
          rw.getCell(2).alignment = { horizontal: 'right' };
        }
        rw.eachCell(function (c) { c.border = bdr; });
        if (style === 'destacado') {
          rw.eachCell(function (c) { c.fill = gF; });
          rw.getCell(2).font = { bold: true, size: 11, color: { argb: 'FF065F46' } };
        }
        if (style === 'negativo') {
          rw.getCell(2).font = { bold: true, size: 10, color: { argb: 'FFDC2626' } };
        }
      }

      if (opts.inputs && opts.inputs.length) {
        addSection('DATOS INGRESADOS');
        opts.inputs.forEach(function (r) { addRow(r[0], r[1]); });
        ws.addRow([]);
      }

      if (opts.resultados && opts.resultados.length) {
        addSection('RESULTADO');
        opts.resultados.forEach(function (r) {
          var lab = String(r[0] || '');
          var style = lab.indexOf('(-)') >= 0 ? 'negativo' : null;
          addRow(r[0], r[1], style);
        });
      }

      if (opts.destacado) {
        ws.addRow([]);
        addRow(opts.destacado.label, opts.destacado.valor, 'destacado');
      }

      if (opts.interpretacion) {
        ws.addRow([]); addSection('INTERPRETACIÓN');
        var ir = ws.addRow([opts.interpretacion, '']);
        ws.mergeCells('A' + ir.number + ':B' + ir.number);
        ir.getCell(1).alignment = { wrapText: true, vertical: 'top' };
        ir.height = 60;
      }

      ws.addRow([]);
      ws.addRow(['Fuente: ' + (opts.fuente || ''), '']);
      ws.addRow(['Cálculo de referencia con fines didácticos. No constituye asesoría financiera.', '']);

      var slug = (opts.slug || 'finanzas') + '_' + new Date().toISOString().slice(0, 10);
      wb.xlsx.writeBuffer().then(function (buf) {
        var b = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = slug + '.xlsx';
        document.body.appendChild(a); a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 0);
      });
    } catch (e) { _toast('Error Excel: ' + e.message); }
  };

  // === Helper de formato (defensivo: si liquidador-engine.js no está cargado) ===
  if (typeof window.fCOP !== 'function') {
    window.fCOP = function (n) {
      if (n == null || isNaN(n)) return '$0';
      return '$' + Math.round(n).toLocaleString('es-CO');
    };
  }
  if (typeof window.fNum !== 'function') {
    window.fNum = function (n) { return Math.round(n || 0).toLocaleString('es-CO'); };
  }

  // ════════════════════════════════════════════════════════════════
  //  REPORTE DIDÁCTICO — la versión rica
  // ════════════════════════════════════════════════════════════════
  /**
   * Genera un PDF didáctico de 5+ páginas con:
   *   - Portada: hero + frase icónica
   *   - Cálculo paso a paso
   *   - Lectura honesta (narrativa con 3 aha cards)
   *   - Plan accionable a 3 horizontes (30d / 12m / 5y) + 3-5 consejos
   *   - Anexo: anual real + frase para nevera + recursos
   *
   * Payload (todos los campos son opcionales — el reporte se adapta):
   *
   *   exportFinanzasReporte({
   *     titulo: 'Salario Neto Colombia 2026',
   *     slug: 'salario-neto',
   *     subtitulo: 'Tu reporte personalizado',
   *
   *     hero: {
   *       label: 'Te queda al bolsillo',
   *       valor: '$4.350.000',
   *       subvalor: 'de un bruto de $5.000.000 (87% real)'
   *     },
   *
   *     fraseHero: {
   *       texto: 'Tu sueldo bruto es ficción.\nTu neto es la verdad.',
   *       autor: 'Adaptación — ExógenaDIAN'
   *     },
   *
   *     inputs: [['Salario bruto', '$5.000.000'], ...],
   *     resultados: [['(-) Salud', '-$200.000'], ...],
   *
   *     narrativa: 'Te entran $5M de bruto pero solo $4.35M...',
   *
   *     ahas: [
   *       { num: '13,0%', label: 'se evapora antes de verlo', tipo: 'bad' },
   *       { num: '$3M/año', label: 'en retefuente + FSP', tipo: 'bad' },
   *       { num: '$3M/año', label: 'si aportas AFC, vuelve a ti', tipo: 'good' }
   *     ],
   *
   *     plan: {
   *       p30: 'Activa AFC con tu fondo de pensiones — basta el formulario...',
   *       p12m: 'Maximiza al 30% del bruto. Eso es ~$1.5M/mes...',
   *       p5y: 'Tendrás $90M en cuenta AFC + ahorro retención $15M...'
   *     },
   *
   *     consejos: [
   *       { titulo: 'Activa AFC', desc: '...', impacto: '+$X/mes' },
   *       ...
   *     ],
   *
   *     anexo: {
   *       titulo: 'Tu sueldo anual real',
   *       items: [['Sueldos × 12', '$50.4M'], ...],
   *       total: { label: 'Total año', valor: '$72M' }
   *     },
   *
   *     fraseNevera: {
   *       texto: 'La libertad financiera no es una cantidad de plata.\nEs la capacidad de decir "no".',
   *       autor: 'Morgan Housel — La psicología del dinero'
   *     },
   *
   *     fuente: 'ET arts. 383, 387, 126-1, 126-4 | UVT 2026 = $52.374'
   *   });
   */
  window.exportFinanzasReporte = function (opts) {
    opts = opts || {};
    var doc;
    try {
      var J = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (!J) { _toast('jsPDF no cargó. Recarga la página.'); return; }
      doc = new J('p', 'mm', 'letter');
    } catch (e) { _toast('Error PDF: ' + e.message); return; }

    var W = 216, H = 279, M = 18, cw = W - 2 * M;
    var pageNum = 0, totalPages = 0;

    // ═══ Helpers de dibujo ═══
    function newPage() {
      doc.addPage();
      pageNum++;
    }
    function addFooter() {
      doc.setFontSize(7); _setText(doc, [160, 160, 160]); doc.setFont('helvetica', 'normal');
      doc.text('exogenadian.com  ·  Reporte didáctico — referencia educativa, no asesoría financiera.', M, H - 8);
      doc.text('Tus datos no salieron de tu navegador. Este PDF se generó offline.', M, H - 5);
      _setText(doc, [0, 0, 0]);
    }
    function wrapText(txt, maxWidth, fontSize) {
      doc.setFontSize(fontSize || 10);
      return doc.splitTextToSize(String(txt || ''), maxWidth);
    }

    // ═══ PÁGINA 1 — PORTADA ═══
    pageNum = 1;
    // Top brand bar
    _setFill(doc, COLOR_NAVY); doc.rect(0, 0, W, 6, 'F');
    _setText(doc, [255, 255, 255]); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
    doc.text('EXÓGENADIAN — FINANZAS PERSONALES', M, 4.2);
    doc.text(new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(), W - M, 4.2, { align: 'right' });
    _setText(doc, [0, 0, 0]);

    // Title
    var y = 30;
    doc.setFont('times', 'bold'); doc.setFontSize(26); _setText(doc, COLOR_NAVY);
    var tit = wrapText(opts.titulo || 'Tu reporte', cw, 26);
    doc.text(tit, M, y);
    y += tit.length * 10 + 2;

    // Subtitle
    if (opts.subtitulo) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); _setText(doc, COLOR_GRAY);
      var sb = wrapText(opts.subtitulo, cw, 11);
      doc.text(sb, M, y);
      y += sb.length * 5;
    }

    // Hero box (verde grande con la cifra principal)
    if (opts.hero) {
      y += 14;
      var hh = 38;
      _setFill(doc, COLOR_GREEN); doc.rect(M, y, cw, hh, 'F');
      // Decorative circle
      doc.setFillColor(255, 255, 255);
      doc.setGState && doc.setGState(new doc.GState({ opacity: 0.06 }));
      doc.circle(W - M - 18, y + 12, 22, 'F');
      doc.setGState && doc.setGState(new doc.GState({ opacity: 1 }));

      _setText(doc, [255, 255, 255]); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(String(opts.hero.label || '').toUpperCase(), M + 6, y + 9);
      doc.setFont('times', 'bold'); doc.setFontSize(28);
      doc.text(String(opts.hero.valor || ''), M + 6, y + 22);
      if (opts.hero.subvalor) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.text(String(opts.hero.subvalor), M + 6, y + 30);
      }
      _setText(doc, [0, 0, 0]);
      y += hh + 12;
    }

    // Frase hero (la frase icónica)
    if (opts.fraseHero) {
      y += 4;
      _setFill(doc, [240, 248, 244]); doc.rect(M, y, cw, 50, 'F');
      // Comilla decorativa enorme
      doc.setFont('times', 'bold'); doc.setFontSize(80); _setText(doc, [200, 220, 210]);
      doc.text('"', M + 4, y + 30);
      // Texto de la frase
      doc.setFont('times', 'italic'); doc.setFontSize(15); _setText(doc, COLOR_NAVY);
      var fraseLines = wrapText(opts.fraseHero.texto, cw - 24, 15);
      var startY = y + 18 - (fraseLines.length - 1) * 4;
      doc.text(fraseLines, M + 16, startY);
      // Autor
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); _setText(doc, COLOR_GREEN);
      doc.text('— ' + (opts.fraseHero.autor || ''), M + 16, y + 44);
      _setText(doc, [0, 0, 0]);
      y += 56;
    }

    // Footer portada
    doc.setFontSize(7); _setText(doc, [120, 120, 120]); doc.setFont('helvetica', 'italic');
    doc.text('Reporte personalizado generado a partir de los datos que ingresaste.', M, H - 18);
    doc.text('Página 1 — Portada', M, H - 14);
    addFooter();
    _setText(doc, [0, 0, 0]);

    // ═══ PÁGINA 2 — CÁLCULO PASO A PASO ═══
    newPage();
    y = 22;
    doc.setFont('times', 'bold'); doc.setFontSize(18); _setText(doc, COLOR_NAVY);
    doc.text('Tu cálculo paso a paso', M, y);
    y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); _setText(doc, COLOR_GRAY);
    doc.text('Cómo se llegó a tu cifra. Cada renglón es una norma del Estatuto Tributario aplicada.', M, y);
    y += 8;

    // Inputs
    if (opts.inputs && opts.inputs.length) {
      _section(doc, M, cw, y, '1. DATOS INGRESADOS'); y += 8;
      doc.autoTable({
        startY: y, margin: { left: M, right: M }, theme: 'plain',
        body: opts.inputs,
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80, textColor: COLOR_GRAY },
          1: { cellWidth: cw - 80, halign: 'right' }
        },
        styles: { fontSize: 9, cellPadding: 2.8, lineColor: COLOR_BORDER, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: COLOR_ALT }
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // Resultados
    if (opts.resultados && opts.resultados.length) {
      _section(doc, M, cw, y, '2. CÁLCULO'); y += 6;
      doc.autoTable({
        startY: y, margin: { left: M, right: M }, theme: 'grid',
        head: [['Concepto', 'Valor']], body: opts.resultados,
        headStyles: { fillColor: COLOR_NAVY, fontSize: 8.5, fontStyle: 'bold', halign: 'center', cellPadding: 3 },
        styles: { fontSize: 9, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.2 },
        columnStyles: { 0: { cellWidth: cw * 0.62 }, 1: { halign: 'right', fontStyle: 'bold' } },
        alternateRowStyles: { fillColor: COLOR_ALT },
        didParseCell: function (d) {
          if (d.section !== 'body') return;
          var t = String(d.cell.raw || '');
          if (t.indexOf('(-)') >= 0 || t.indexOf('(−)') >= 0) d.cell.styles.textColor = [220, 38, 38];
        }
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // Destacado (mismo banner verde de la portada, pero más compacto aquí)
    if (opts.hero) {
      if (y > 240) { newPage(); y = 22; }
      _setFill(doc, COLOR_GREEN); doc.rect(M, y, cw, 16, 'F');
      _setText(doc, [255, 255, 255]); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text((opts.hero.label || '').toUpperCase(), M + 4, y + 7);
      doc.setFontSize(14); doc.setFont('times', 'bold');
      doc.text(String(opts.hero.valor || ''), W - M - 4, y + 11, { align: 'right' });
      _setText(doc, [0, 0, 0]); doc.setFont('helvetica', 'normal');
      y += 22;
    }
    addFooter();

    // ═══ PÁGINA 3 — LECTURA HONESTA + AHA CARDS ═══
    if (opts.narrativa || (opts.ahas && opts.ahas.length)) {
      newPage(); y = 22;
      doc.setFont('times', 'bold'); doc.setFontSize(18); _setText(doc, COLOR_NAVY);
      doc.text('Lectura honesta de tus números', M, y);
      y += 8;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); _setText(doc, COLOR_GRAY);
      doc.text('Lo que la cuenta dice, traducido al castellano. Sin moralismo.', M, y);
      y += 10;

      // Narrativa
      if (opts.narrativa) {
        _setFill(doc, [240, 250, 245]); doc.setDrawColor(5, 150, 105); doc.setLineWidth(0.6);
        var narrLines = wrapText(opts.narrativa, cw - 12, 10);
        var nh = narrLines.length * 5 + 12;
        doc.rect(M, y, cw, nh, 'FD');
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); _setText(doc, [40, 40, 40]);
        doc.text(narrLines, M + 6, y + 8);
        y += nh + 8;
        _setText(doc, [0, 0, 0]);
      }

      // 3 Aha cards en grid
      if (opts.ahas && opts.ahas.length) {
        _section(doc, M, cw, y, 'CIFRAS QUE NO PUEDES IGNORAR'); y += 8;
        var ahas = opts.ahas.slice(0, 3);
        var cardW = (cw - 4 * (ahas.length - 1)) / ahas.length;
        ahas.forEach(function (a, i) {
          var x = M + i * (cardW + 4);
          var bg = a.tipo === 'bad' ? [254, 242, 242] : (a.tipo === 'good' ? [236, 253, 245] : [249, 250, 251]);
          var fg = a.tipo === 'bad' ? [185, 28, 28] : (a.tipo === 'good' ? [5, 150, 105] : COLOR_NAVY);
          var brd = a.tipo === 'bad' ? [254, 202, 202] : (a.tipo === 'good' ? [167, 243, 208] : COLOR_BORDER);
          _setFill(doc, bg); doc.setDrawColor(brd[0], brd[1], brd[2]); doc.setLineWidth(0.5);
          doc.rect(x, y, cardW, 30, 'FD');
          doc.setFont('times', 'bold'); doc.setFontSize(18); _setText(doc, fg);
          doc.text(String(a.num || ''), x + cardW / 2, y + 14, { align: 'center' });
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); _setText(doc, COLOR_GRAY);
          var lblLines = wrapText(a.label || '', cardW - 6, 8);
          doc.text(lblLines.slice(0, 2), x + cardW / 2, y + 20, { align: 'center' });
        });
        y += 36;
        _setText(doc, [0, 0, 0]);
      }

      addFooter();
    }

    // ═══ PÁGINA 4 — PLAN ACCIONABLE ═══
    if (opts.plan || (opts.consejos && opts.consejos.length)) {
      newPage(); y = 22;
      doc.setFont('times', 'bold'); doc.setFontSize(18); _setText(doc, COLOR_NAVY);
      doc.text('Tu plan accionable', M, y);
      y += 8;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); _setText(doc, COLOR_GRAY);
      doc.text('Lo que tu resultado dispara, ordenado por impacto en tu bolsillo.', M, y);
      y += 12;
      _setText(doc, [0, 0, 0]);

      // Plan a 3 horizontes
      if (opts.plan) {
        var horizontes = [
          { l: '30 DÍAS', t: opts.plan.p30, c: [254, 243, 199], b: [251, 191, 36] },
          { l: '12 MESES', t: opts.plan.p12m, c: [219, 234, 254], b: [59, 130, 246] },
          { l: '5 AÑOS', t: opts.plan.p5y, c: [220, 252, 231], b: [34, 197, 94] }
        ].filter(function (h) { return h.t; });
        horizontes.forEach(function (h) {
          var lines = wrapText(h.t, cw - 28, 9.5);
          var hh = Math.max(18, lines.length * 4.2 + 8);
          _setFill(doc, h.c); doc.setDrawColor(h.b[0], h.b[1], h.b[2]); doc.setLineWidth(0.6);
          doc.rect(M, y, cw, hh, 'FD');
          // Tag horizonte
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); _setText(doc, [80, 50, 0]);
          doc.text(h.l, M + 4, y + 6);
          // Texto
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); _setText(doc, [40, 40, 40]);
          doc.text(lines, M + 24, y + 6.5);
          y += hh + 4;
          _setText(doc, [0, 0, 0]);
        });
        y += 4;
      }

      // Consejos personalizados
      if (opts.consejos && opts.consejos.length) {
        if (y > 200) { newPage(); y = 22; }
        _section(doc, M, cw, y, 'CONSEJOS PARA TU SITUACIÓN'); y += 8;
        opts.consejos.slice(0, 5).forEach(function (c, i) {
          var descLines = wrapText(c.desc || '', cw - 18, 9);
          var ch = Math.max(14, descLines.length * 4 + 10);
          if (y + ch > H - 25) { newPage(); y = 22; }
          // Numero circular
          _setFill(doc, COLOR_GREEN); doc.circle(M + 4, y + 4, 3.2, 'F');
          _setText(doc, [255, 255, 255]); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
          doc.text(String(i + 1), M + 4, y + 5.2, { align: 'center' });
          // Titulo
          _setText(doc, COLOR_NAVY); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
          doc.text(c.titulo || '', M + 12, y + 5);
          if (c.impacto) {
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); _setText(doc, COLOR_GREEN);
            doc.text(c.impacto, W - M - 2, y + 5, { align: 'right' });
          }
          // Descripcion
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9); _setText(doc, [70, 70, 70]);
          doc.text(descLines, M + 12, y + 10);
          y += ch + 2;
          _setText(doc, [0, 0, 0]);
        });
      }
      addFooter();
    }

    // ═══ PÁGINA 5 — ANEXO + FRASE FINAL + RECURSOS ═══
    if (opts.anexo || opts.fraseNevera) {
      newPage(); y = 22;
      doc.setFont('times', 'bold'); doc.setFontSize(18); _setText(doc, COLOR_NAVY);
      doc.text('Para llevarte', M, y);
      y += 12;

      // Anexo (tabla)
      if (opts.anexo) {
        _section(doc, M, cw, y, (opts.anexo.titulo || 'ANEXO').toUpperCase()); y += 6;
        doc.autoTable({
          startY: y, margin: { left: M, right: M }, theme: 'plain',
          body: opts.anexo.items || [],
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: cw * 0.7, textColor: COLOR_GRAY },
            1: { cellWidth: cw * 0.3, halign: 'right' }
          },
          styles: { fontSize: 9, cellPadding: 2.5, lineColor: COLOR_BORDER, lineWidth: 0.15 },
          alternateRowStyles: { fillColor: COLOR_ALT }
        });
        y = doc.lastAutoTable.finalY + 4;
        if (opts.anexo.total) {
          _setFill(doc, COLOR_NAVY); doc.rect(M, y, cw, 12, 'F');
          _setText(doc, [255, 255, 255]); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
          doc.text(opts.anexo.total.label || 'Total', M + 4, y + 7);
          doc.setFontSize(13); doc.setFont('times', 'bold');
          doc.text(String(opts.anexo.total.valor || ''), W - M - 4, y + 8, { align: 'right' });
          _setText(doc, [0, 0, 0]); doc.setFont('helvetica', 'normal');
          y += 18;
        }
      }

      // Frase para la nevera
      if (opts.fraseNevera) {
        if (y > 200) { newPage(); y = 22; }
        y += 4;
        _setFill(doc, COLOR_NAVY); doc.rect(M, y, cw, 50, 'F');
        // Comilla decorativa
        doc.setFont('times', 'bold'); doc.setFontSize(70); _setText(doc, [50, 80, 110]);
        doc.text('"', M + 4, y + 28);
        // Texto frase
        doc.setFont('times', 'italic'); doc.setFontSize(13); _setText(doc, [255, 255, 255]);
        var fnLines = wrapText(opts.fraseNevera.texto, cw - 24, 13);
        doc.text(fnLines, M + 16, y + 18);
        // Autor
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); _setText(doc, [167, 243, 208]);
        doc.text('— ' + (opts.fraseNevera.autor || ''), M + 16, y + 44);
        // Tag corner
        doc.setFontSize(6.5); _setText(doc, [167, 243, 208]); doc.setFont('helvetica', 'bold');
        doc.text('PARA COLGAR EN LA NEVERA', W - M - 4, y + 6, { align: 'right' });
        _setText(doc, [0, 0, 0]);
        y += 56;
      }

      // Recursos
      if (y < H - 50) {
        y += 4;
        _section(doc, M, cw, y, 'RECURSOS QUE TE PUEDEN SERVIR'); y += 7;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); _setText(doc, [70, 70, 70]);
        var recursos = [
          '• Curso completo de Finanzas Personales (10 módulos, gratis): exogenadian.com/escuela/finanzas.html',
          '• 47 frases icónicas para Instagram: exogenadian.com/escuela/frases-finanzas.html',
          '• Plantilla Excel de presupuesto (7 hojas formuladas): exogenadian.com/presupuesto-personal.html',
          '• Hub completo de finanzas (8 calculadoras): exogenadian.com/finanzas.html',
          '• Privacidad detallada — cómo respaldar tus datos: exogenadian.com/privacidad-finanzas.html'
        ];
        recursos.forEach(function (r) {
          var lines = wrapText(r, cw - 6, 9);
          doc.text(lines, M + 2, y);
          y += lines.length * 4.2 + 1;
        });
        _setText(doc, [0, 0, 0]);
      }

      // Fuente legal
      if (opts.fuente && y < H - 18) {
        y = Math.max(y, H - 22);
        doc.setFontSize(7); _setText(doc, COLOR_GRAY); doc.setFont('helvetica', 'italic');
        var fLines = wrapText('Fuente normativa: ' + opts.fuente, cw, 7);
        doc.text(fLines, M, y);
        _setText(doc, [0, 0, 0]);
      }

      addFooter();
    }

    // Numeración de páginas final
    var nPages = doc.internal.pages.length - 1;
    for (var i = 1; i <= nPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7); _setText(doc, [160, 160, 160]); doc.setFont('helvetica', 'normal');
      doc.text('Página ' + i + ' de ' + nPages, W - M, H - 8, { align: 'right' });
      _setText(doc, [0, 0, 0]);
    }

    var slug = (opts.slug || 'finanzas') + '-reporte_' + new Date().toISOString().slice(0, 10);
    try { doc.save(slug + '.pdf'); }
    catch (e) { _toast('Error guardando PDF: ' + e.message); }
    if (typeof gtag !== 'undefined') gtag('event', 'reporte_didactico_descargado', { tool: opts.slug || 'unknown' });
  };
})();
