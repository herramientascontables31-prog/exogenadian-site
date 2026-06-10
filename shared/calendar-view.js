/* ═══ Calendar View — componente compartido oficina + vencimientos ═══
 * Vistas: Anual (12 meses), Mes (uno grande), Semana (7 días detallados).
 *
 * API:
 *   exoCalendar.render(containerId, events, options)
 *
 *   events: [{
 *     fecha: 'YYYY-MM-DD' | Date,
 *     label: 'IVA Bimestral',         // nombre obligación (leyenda/filtro)
 *     color: '#8B5CF6',               // color del dot/chip
 *     group: 'iva_bim',               // id grupo (para filtro)
 *     short: 'IVA',                   // texto corto en chip/badge
 *     periodo: 'Bim 1 (Ene-Feb)',     // descripción adicional
 *     cliente: 'Acme S.A.S.',         // a quién aplica
 *     presentada: false               // opcional, opacidad reducida
 *   }, ...]
 *
 *   options: {
 *     monthsRange: [{y:2026,m:1},...]   // default feb 2026 → ene 2027
 *     showDashboard: true
 *     showLegend: true
 *     showFilters: true
 *     showViewSwitcher: true            // tabs Anual/Mes/Semana
 *     viewMode: 'year' | 'month' | 'week'   // vista inicial (default 'year')
 *     onDayClick: function(events, isoDate) // override del click (year/month)
 *   }
 */
(function(){
  'use strict';

  var MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var MESES_ABBR = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  var DIAS_SEM = ['L','M','X','J','V','S','D'];
  var DOWS_SHORT = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  var DOWS_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

  function defaultMonthsRange(){
    var months=[];
    for(var i=1;i<=12;i++){
      var y=i<=11?2026:2027;
      var m=i<=11?i:0;
      months.push({y:y,m:m,label:MESES[m]+' '+y});
    }
    return months;
  }

  function esc(s){var d=document.createElement('div');d.textContent=String(s==null?'':s);return d.innerHTML}

  // Devuelve la "cuota/sub-periodo" sin la sigla del tipo. Vacío si periodo == label del tipo.
  // Ej: ("IVA C1","IVA","IVA")="C1"; ("Renta C1","R","Renta")="C1"; ("Exogena","EXO","Exógena")=""
  function noTilde(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  // Expande siglas de cuota/bimestre/mes a texto legible. C1→Cuota 1, B2→Bimestre 2, Abr→Abril.
  var MESES_EXP={Ene:'Enero',Feb:'Febrero',Mar:'Marzo',Abr:'Abril',May:'Mayo',Jun:'Junio',Jul:'Julio',Ago:'Agosto',Sep:'Septiembre',Oct:'Octubre',Nov:'Noviembre',Dic:'Diciembre'};
  function expandCuota(s){
    if(!s)return '';
    var t=String(s).trim();
    var m=t.match(/^C([1-9])$/);if(m)return 'Cuota '+m[1];
    m=t.match(/^B([1-9])$/);if(m)return 'Bimestre '+m[1];
    if(MESES_EXP[t])return MESES_EXP[t];
    return t;
  }
  function cleanCuota(periodo,short,label){
    if(!periodo)return '';
    var p=String(periodo).trim();
    var pn=noTilde(p);
    var lLo=noTilde(label||'');
    var sLo=noTilde(short||'');
    if(lLo && pn===lLo)return '';
    var rest=p;
    if(sLo && pn.indexOf(sLo+' ')===0) rest=p.slice(short.length+1);
    else if(lLo && pn.indexOf(lLo+' ')===0) rest=p.slice(label.length+1);
    return expandCuota(rest);
  }

  function toISO(date){
    if(typeof date==='string')return date.length>=10?date.slice(0,10):date;
    var y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+d;
  }
  function todayISO(){
    var d=new Date();d.setHours(0,0,0,0);
    return toISO(d);
  }
  function parseISO(iso){var p=iso.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
  function diffDays(isoDate){
    var hoy=new Date();hoy.setHours(0,0,0,0);
    var parts=isoDate.split('-');
    var d=new Date(+parts[0],+parts[1]-1,+parts[2]);
    return Math.round((d-hoy)/86400000);
  }

  function indexByDate(events){
    var byDate={};
    events.forEach(function(e){
      var iso=toISO(e.fecha);
      if(!byDate[iso])byDate[iso]=[];
      byDate[iso].push(e);
    });
    return byDate;
  }

  function rangeBounds(monthsRange){
    var first=monthsRange[0],last=monthsRange[monthsRange.length-1];
    return {
      min:new Date(first.y,first.m,1),
      max:new Date(last.y,last.m+1,0)
    };
  }

  function clampDate(d,bounds){
    if(d<bounds.min) return new Date(bounds.min);
    if(d>bounds.max) return new Date(bounds.max);
    return d;
  }

  function renderDashboard(events){
    var prox=null,vencidos=0,semana=0,presentadas=0;
    events.forEach(function(e){
      if(e.presentada){presentadas++;return}
      var d=diffDays(toISO(e.fecha));
      if(d<0) vencidos++;
      else if(d<=7) semana++;
      if(d>=0 && (prox===null||d<prox)) prox=d;
    });
    var totalActivas=events.length-presentadas;
    return '<div class="cv-dash">'+
      '<div class="cv-dash-card cv-dc-blue"><div class="cv-dash-val">'+totalActivas+'</div><div class="cv-dash-label">Obligaciones</div></div>'+
      '<div class="cv-dash-card '+(vencidos?'cv-dc-red':'cv-dc-green')+'"><div class="cv-dash-val">'+vencidos+'</div><div class="cv-dash-label">Vencidas</div></div>'+
      '<div class="cv-dash-card cv-dc-amber"><div class="cv-dash-val">'+semana+'</div><div class="cv-dash-label">Vencen en 7 días</div></div>'+
      '<div class="cv-dash-card cv-dc-purple"><div class="cv-dash-val">'+(prox!==null?prox:'—')+'</div><div class="cv-dash-label">Días al próximo</div></div>'+
      '<div class="cv-dash-card cv-dc-green"><div class="cv-dash-val">'+presentadas+'</div><div class="cv-dash-label">Presentadas</div></div>'+
      '</div>';
  }

  function renderLegend(events){
    var seen={},items=[];
    events.forEach(function(e){
      if(!seen[e.group]){seen[e.group]=1;items.push({group:e.group,label:e.label,color:e.color})}
    });
    if(!items.length)return '';
    var html='<div class="cv-legend">';
    items.forEach(function(i){
      html+='<div class="cv-legend-item"><div class="cv-legend-dot" style="background:'+i.color+'"></div>'+esc(i.label)+'</div>';
    });
    html+='</div>';
    return html;
  }

  function renderFilters(events, activeFilter){
    var counts={},meta={};
    events.forEach(function(e){
      counts[e.group]=(counts[e.group]||0)+1;
      if(!meta[e.group])meta[e.group]={label:e.label,color:e.color}
    });
    var html='<div class="cv-filters"><div class="cv-pill '+(activeFilter==null?'active':'')+'" style="'+(activeFilter==null?'background:#059669;border-color:#059669;color:#fff':'')+'" data-filter="">Todas <span class="cv-fp-count">'+events.length+'</span></div>';
    Object.keys(counts).forEach(function(k){
      var m=meta[k];
      var act=activeFilter===k;
      var style=act?'background:'+m.color+';border-color:'+m.color+';color:#fff':'';
      html+='<div class="cv-pill '+(act?'active':'')+'" style="'+style+'" data-filter="'+esc(k)+'">'+
        '<div class="cv-legend-dot" style="background:'+m.color+'"></div>'+esc(m.label)+' <span class="cv-fp-count">'+counts[k]+'</span></div>';
    });
    html+='</div>';
    return html;
  }

  function renderViewControls(viewMode, viewDate, monthsRange){
    var b=rangeBounds(monthsRange);
    var tabs=[['year','📊 Anual'],['month','📆 Mes'],['week','🗓️ Semana']];
    var html='<div class="cv-view-controls"><div class="cv-tabs">';
    tabs.forEach(function(t){
      html+='<button class="cv-tab'+(viewMode===t[0]?' active':'')+'" data-view="'+t[0]+'">'+t[1]+'</button>';
    });
    html+='</div>';

    var prevDis=false,nextDis=false,label='';
    if(viewMode==='year'){
      var first=monthsRange[0],last=monthsRange[monthsRange.length-1];
      label=MESES_ABBR[first.m]+' '+first.y+' – '+MESES_ABBR[last.m]+' '+last.y;
      prevDis=true;nextDis=true;
    } else if(viewMode==='month'){
      label=MESES[viewDate.getMonth()]+' '+viewDate.getFullYear();
      prevDis=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1)<b.min;
      nextDis=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1)>b.max;
    } else {
      var d=new Date(viewDate);d.setHours(0,0,0,0);
      var dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);
      var end=new Date(d);end.setDate(d.getDate()+6);
      label=d.getDate()+' '+MESES_ABBR[d.getMonth()]+' – '+end.getDate()+' '+MESES_ABBR[end.getMonth()]+' '+end.getFullYear();
      var prevW=new Date(d);prevW.setDate(d.getDate()-7);
      var nextW=new Date(d);nextW.setDate(d.getDate()+7);
      prevDis=prevW<b.min;nextDis=nextW>b.max;
    }
    var navVis=viewMode==='year'?' style="visibility:hidden"':'';
    html+='<div class="cv-nav"'+navVis+'>'+
      '<button class="cv-nav-btn cv-nav-arrow" data-nav="prev"'+(prevDis?' disabled':'')+' aria-label="Anterior">‹</button>'+
      '<span class="cv-view-label">'+esc(label)+'</span>'+
      '<button class="cv-nav-btn cv-nav-arrow" data-nav="next"'+(nextDis?' disabled':'')+' aria-label="Siguiente">›</button>'+
      '<button class="cv-nav-btn" data-nav="today">Hoy</button>'+
      '</div></div>';
    return html;
  }

  function renderYearView(events, monthsRange){
    var byDate=indexByDate(events);
    var todIso=todayISO();
    var html='<div class="cv-grid">';
    monthsRange.forEach(function(mo){
      html+='<div class="cv-month"><div class="cv-mh">'+mo.label+'</div>';
      html+='<div class="cv-dow">'+DIAS_SEM.map(function(d){return '<div>'+d+'</div>'}).join('')+'</div>';
      html+='<div class="cv-days">';
      var first=new Date(mo.y,mo.m,1);
      var dow=(first.getDay()+6)%7;
      var dim=new Date(mo.y,mo.m+1,0).getDate();
      for(var i=0;i<dow;i++) html+='<div class="cv-day empty"></div>';
      for(var d=1;d<=dim;d++){
        var iso=mo.y+'-'+String(mo.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
        var isToday=iso===todIso;
        var evts=byDate[iso];
        var cls='cv-day';
        if(isToday) cls+=' today';
        if(evts && evts.length){
          cls+=' has-ev';
          var colors={};evts.forEach(function(e){colors[e.color]=1});
          var dots=Object.keys(colors).map(function(c){return '<div class="cv-d" style="background:'+c+'"></div>'}).join('');
          var tt='<div class="cv-tt">';
          evts.forEach(function(e){
            var rowCls=e.presentada?'cv-tt-row cv-tt-presentada':'cv-tt-row';
            var clienteTxt=e.cliente?esc(e.cliente):'';
            var cuota=cleanCuota(e.periodo,e.short,e.label);
            var periodoTxt=cuota?'<span style="opacity:.6;font-size:.6rem">'+esc(cuota)+'</span>':'';
            tt+='<div class="'+rowCls+'"><span><span class="cv-tt-obl" style="background:'+e.color+'">'+esc(e.short||'')+'</span>'+clienteTxt+'</span>'+periodoTxt+'</div>';
          });
          tt+='</div>';
          html+='<div class="'+cls+'" data-date="'+iso+'">'+d+'<div class="cv-dots">'+dots+'</div>';
          if(evts.length>2) html+='<span class="cv-ev-count">'+evts.length+'</span>';
          html+=tt+'</div>';
        } else {
          html+='<div class="'+cls+'">'+d+'</div>';
        }
      }
      html+='</div></div>';
    });
    html+='</div>';
    return html;
  }

  function renderMonthView(events, viewDate){
    var byDate=indexByDate(events);
    var todIso=todayISO();
    var y=viewDate.getFullYear(),m=viewDate.getMonth();
    var html='<div class="cv-month-big"><div class="cv-mh-big">'+MESES[m]+' '+y+'</div>';
    html+='<div class="cv-dow-big">'+DOWS_FULL.map(function(d){return '<div>'+d+'</div>'}).join('')+'</div>';
    html+='<div class="cv-days-big">';
    var first=new Date(y,m,1);
    var dow=(first.getDay()+6)%7;
    var dim=new Date(y,m+1,0).getDate();
    for(var i=0;i<dow;i++) html+='<div class="cv-day-big empty"></div>';
    for(var d=1;d<=dim;d++){
      var iso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      var evts=byDate[iso]||[];
      var cls='cv-day-big'+(iso===todIso?' today':'')+(evts.length?' has-ev':'');
      var inner='<div class="cv-day-num">'+d+'</div>';
      if(evts.length){
        inner+='<div class="cv-ev-list">';
        var max=evts.length>3?2:evts.length;
        for(var k=0;k<max;k++){
          var e=evts[k];
          var cls=e.presentada?'cv-ev-chip cv-done':'cv-ev-chip';
          var title=esc((e.label||'')+' — '+(e.cliente||'')+(e.periodo?' ('+e.periodo+')':'')+(e.presentada?' ✓ realizada · clic para ver':' · clic para marcar'));
          var clk=(e.nit&&e.oblId)?' onclick="event.stopPropagation();if(window.openCalConfirmModal)window.openCalConfirmModal(\''+e.nit+'\',\''+e.oblId+'\')"':'';
          if(clk)cls+=' cv-clickable';
          inner+='<div class="'+cls+'" style="background:'+e.color+'" title="'+title+'"'+clk+'>'+esc(e.label||e.short||'')+(e.cliente?' · '+esc(e.cliente):'')+'</div>';
        }
        if(evts.length>max) inner+='<div class="cv-ev-chip cv-ev-more">+'+(evts.length-max)+' más</div>';
        inner+='</div>';
      }
      html+='<div class="'+cls+'" data-date="'+iso+'">'+inner+'</div>';
    }
    html+='</div></div>';
    return html;
  }

  function renderWeekView(events, viewDate){
    var byDate=indexByDate(events);
    var todIso=todayISO();
    var d=new Date(viewDate);d.setHours(0,0,0,0);
    var dow=(d.getDay()+6)%7;
    d.setDate(d.getDate()-dow);
    var html='<div class="cv-week"><div class="cv-week-grid">';
    for(var i=0;i<7;i++){
      var dt=new Date(d);dt.setDate(d.getDate()+i);
      var iso=toISO(dt);
      var isToday=iso===todIso;
      var evts=byDate[iso]||[];
      html+='<div class="cv-week-day">';
      html+='<div class="cv-week-dh'+(isToday?' today':'')+'">'+
        '<span class="cv-dow-name">'+DOWS_SHORT[i]+(isToday?' · Hoy':'')+'</span>'+
        '<span class="cv-dow-num">'+dt.getDate()+'</span>'+
        '<span class="cv-dow-mon">'+MESES_ABBR[dt.getMonth()]+'</span>'+
        '</div>';
      html+='<div class="cv-week-events">';
      if(evts.length){
        evts.forEach(function(e){
          var cls=e.presentada?'cv-week-event cv-done':'cv-week-event';
          // Cuota = periodo sin la sigla redundante. Vacío si el periodo es solo el label del tipo.
          var cuota=cleanCuota(e.periodo,e.short,e.label);
          var ttl=(e.label||'')+' — '+(e.cliente||'')+(cuota?' ('+cuota+')':'')+(e.presentada?' ✓ presentada · clic para ver':' · clic para marcar');
          var clk=(e.nit&&e.oblId)?' onclick="event.stopPropagation();if(window.openCalConfirmModal)window.openCalConfirmModal(\''+e.nit+'\',\''+e.oblId+'\')"':'';
          if(clk)cls+=' cv-clickable';
          html+='<div class="'+cls+'" style="background:'+e.color+'" title="'+esc(ttl)+'"'+clk+'>'+
            '<div class="cv-we-head">'+esc(e.label||e.short||'')+(e.cliente?' · '+esc(e.cliente):'')+'</div>';
          if(cuota) html+='<div class="cv-we-periodo">'+esc(cuota)+'</div>';
          html+='</div>';
        });
      } else {
        html+='<div class="cv-week-empty">Sin vencimientos</div>';
      }
      html+='</div></div>';
    }
    html+='</div></div>';
    return html;
  }

  // ═══ API público ═══
  window.exoCalendar = {
    render: function(containerId, events, options){
      var c=document.getElementById(containerId);
      if(!c)return;
      options=options||{};
      var monthsRange=options.monthsRange||defaultMonthsRange();
      var bounds=rangeBounds(monthsRange);
      var activeFilter=options._activeFilter||null;

      // Init view state (mutates options to persist across re-renders)
      if(!options._viewMode) options._viewMode = options.viewMode || 'year';
      if(!options._viewDate){
        var t=new Date();t.setHours(0,0,0,0);
        options._viewDate=clampDate(t,bounds);
      }

      var filtered=activeFilter?events.filter(function(e){return e.group===activeFilter}):events;

      var html='<div class="cv-root">';
      if(options.showDashboard!==false) html+=renderDashboard(events);
      if(options.showLegend!==false) html+=renderLegend(events);
      if(options.showFilters!==false) html+=renderFilters(events,activeFilter);
      if(options.showViewSwitcher!==false) html+=renderViewControls(options._viewMode,options._viewDate,monthsRange);

      if(options._viewMode==='month') html+=renderMonthView(filtered,options._viewDate);
      else if(options._viewMode==='week') html+=renderWeekView(filtered,options._viewDate);
      else html+=renderYearView(filtered,monthsRange);

      html+='</div>';
      c.innerHTML=html;

      // Filter pills
      if(options.showFilters!==false){
        c.querySelectorAll('.cv-pill').forEach(function(p){
          p.addEventListener('click',function(){
            options._activeFilter=p.getAttribute('data-filter')||null;
            window.exoCalendar.render(containerId,events,options);
          });
        });
      }

      // View tabs
      c.querySelectorAll('.cv-tab').forEach(function(t){
        t.addEventListener('click',function(){
          options._viewMode=t.getAttribute('data-view');
          window.exoCalendar.render(containerId,events,options);
        });
      });

      // Nav buttons (prev/next/today)
      c.querySelectorAll('.cv-nav-btn[data-nav]').forEach(function(btn){
        btn.addEventListener('click',function(){
          if(btn.disabled) return;
          var nav=btn.getAttribute('data-nav');
          var vd=options._viewDate;
          if(nav==='today'){
            var t=new Date();t.setHours(0,0,0,0);
            options._viewDate=clampDate(t,bounds);
          } else if(options._viewMode==='month'){
            options._viewDate=new Date(vd.getFullYear(),vd.getMonth()+(nav==='prev'?-1:1),1);
          } else if(options._viewMode==='week'){
            options._viewDate=new Date(vd.getFullYear(),vd.getMonth(),vd.getDate()+(nav==='prev'?-7:7));
          }
          options._viewDate=clampDate(options._viewDate,bounds);
          window.exoCalendar.render(containerId,events,options);
        });
      });

      // Day click — year/month views: jump to week (unless onDayClick override)
      function dayClickHandler(el){
        var iso=el.getAttribute('data-date');
        if(!iso) return;
        if(typeof options.onDayClick==='function'){
          options.onDayClick(filtered.filter(function(ev){return toISO(ev.fecha)===iso}),iso);
          return;
        }
        options._viewMode='week';
        options._viewDate=parseISO(iso);
        window.exoCalendar.render(containerId,events,options);
      }

      if(options._viewMode==='year'){
        c.querySelectorAll('.cv-day.has-ev').forEach(function(el){
          el.addEventListener('click',function(e){
            if(e.target.closest('.cv-tt')) return;
            dayClickHandler(el);
          });
        });
      } else if(options._viewMode==='month'){
        c.querySelectorAll('.cv-day-big.has-ev').forEach(function(el){
          el.addEventListener('click',function(){dayClickHandler(el)});
        });
      }
    }
  };
})();
