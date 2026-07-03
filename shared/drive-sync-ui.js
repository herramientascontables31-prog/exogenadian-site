/* ═══ Aziendale — Drive Sync UI Helper ═══
   Wrapper sobre ExoDrive (shared/drive-sync.js) que monta automáticamente:
     • Botón "☁️ Conectar Drive" (toggle)
     • Banner de status (verde/ámbar/rojo)
     • Auto-save debounced cada cambio
     • Carga inicial desde Drive con resolución de conflicto por timestamp

   Uso (1 sola llamada desde cada tool):
     ExoDriveUI.attach({
       clientId: 'xxx.apps.googleusercontent.com',
       fileName: 'oficina-clientes.json',  // en carpeta Aziendale
       buttonContainer: '#barraHeader',    // selector donde inyectar el botón
       bannerContainer: '#barraHeader',    // (opcional, usa buttonContainer si no)
       // Cómo obtener los datos a guardar — debe devolver un objeto JSON-able
       getData: () => ({ clientes: [...], estado: {...}, ts: Date.now() }),
       // Cómo aplicar datos que vienen de Drive (escribe localStorage, re-renderiza)
       setData: (obj) => { localStorage.setItem('oficina_clientes', JSON.stringify(obj.clientes)); render(); },
       // Devuelve timestamp local en ms (para resolver conflicto)
       getLocalTs: () => parseInt(localStorage.getItem('oficina_last_save')||'0'),
       // Opcional: nombre amigable de la herramienta para toasts/banners
       toolName: 'Mi Oficina Contable'
     });

   Después, en cada cambio que quieras sincronizar:
     ExoDriveUI.scheduleSave();   // debounced 2.5s

   También puedes:
     ExoDriveUI.forceSync();      // fuerza save+load (botón "Sincronizar ahora")
     ExoDriveUI.isConnected();    // boolean
*/
(function(){
  'use strict';
  if(window.ExoDriveUI)return;

  let CONFIG=null;
  let saveTimer=null;
  let driveDisponible=false;
  let pendingSave=false;
  let listenersMontados=false;
  let syncing=false;              // hay una fusión/carga en curso
  let lastRemoteModified=null;    // modifiedTime del archivo la última vez que lo vimos/escribimos
  const POLL_MS=60000;            // cada 60s revisa si otro equipo escribió

  async function attach(cfg){
    if(!cfg||!cfg.clientId||!cfg.fileName||!cfg.getData||!cfg.setData){
      console.warn('[ExoDriveUI] config incompleta — necesita clientId, fileName, getData, setData');return;
    }
    CONFIG=Object.assign({getLocalTs:()=>Date.now(),toolName:'esta herramienta'},cfg);
    if(typeof ExoDrive==='undefined'){console.warn('[ExoDriveUI] ExoDrive no cargado — incluye shared/drive-sync.js antes');return;}

    // Placeholder check
    if(!CONFIG.clientId||CONFIG.clientId.indexOf('REEMPLAZAR')>=0||CONFIG.clientId.indexOf('apps.googleusercontent.com')<0){
      console.warn('[ExoDriveUI] CLIENT_ID no configurado para',CONFIG.fileName);
      // No mostrar botón
      return;
    }

    driveDisponible=await ExoDrive.init(CONFIG.clientId);
    if(!driveDisponible)return;

    montarUI();
    ExoDrive.onStatusChange(s=>pintar(s));

    // Flush del guardado pendiente al ocultar/cerrar la pestaña: el debounce de
    // 2.5s antes se perdía si el usuario editaba y cerraba rápido → ese cambio
    // nunca subía a Drive. Best-effort (visibilitychange 'hidden' es fiable).
    if(!listenersMontados){
      listenersMontados=true;
      document.addEventListener('visibilitychange',function(){
        if(document.visibilityState==='hidden')flushSave();
        else pollTick(); // al volver a la pestaña, chequea cambios de otro equipo
      });
      window.addEventListener('pagehide',flushSave);
      // Re-chequeo periódico (solo tools con fusión): trae cambios de otros
      // equipos sin que el usuario recargue. pollTick decide si hay algo nuevo.
      if(typeof CONFIG.merge==='function')setInterval(pollTick,POLL_MS);
    }

    // Si ya estaba conectado de sesión previa → cargar de Drive
    if(ExoDrive.isConnected()){
      pintar('conectado');
      await cargarSiCorresponde(true);
    } else {
      // El token dura ~1h. Si venció pero el usuario ya autorizó antes en este
      // navegador, resume() lo renueva sin popup para que la bajada-al-abrir sí
      // ocurra. Si Google exige interacción, queda desconectado (sin ruido).
      const reconecto=await ExoDrive.resume();
      if(reconecto){
        pintar('conectado');
        await cargarSiCorresponde(true);
      } else {
        pintar('desconectado');
      }
    }
  }

  function montarUI(){
    const btnCont=document.querySelector(CONFIG.buttonContainer)||document.body;
    // Si ya hay un botón con id reservado, no duplicar
    if(document.getElementById('exoDriveBtn'))return;
    const btn=document.createElement('button');
    btn.id='exoDriveBtn';
    btn.type='button';
    btn.title='Sincronizar con tu Google Drive';
    btn.onclick=toggle;
    btn.style.cssText='padding:8px 14px;border:1.5px solid #E5E7EB;background:#fff;color:#1F2937;font-family:inherit;font-size:.82rem;font-weight:600;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:.15s;margin-left:6px';
    btn.innerHTML='<span id="exoDriveIco">☁️</span> <span id="exoDriveTxt">Conectar Drive</span>';
    btnCont.appendChild(btn);

    // Banner abajo del botón (en el container que se le indique)
    const bnCont=CONFIG.bannerContainer?document.querySelector(CONFIG.bannerContainer):null;
    if(bnCont){
      const ex=document.getElementById('exoDriveBanner');if(ex)ex.remove();
      const bn=document.createElement('div');
      bn.id='exoDriveBanner';
      bn.style.cssText='display:none;width:100%;margin-top:10px;padding:9px 13px;border-radius:8px;font-size:.82rem;line-height:1.4;display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid';
      bnCont.appendChild(bn);
    }
  }

  function pintar(s){
    const btn=document.getElementById('exoDriveBtn');
    if(!btn)return;
    const ico=document.getElementById('exoDriveIco');
    const txt=document.getElementById('exoDriveTxt');
    const bn=document.getElementById('exoDriveBanner');
    const email=ExoDrive.getUserEmail&&ExoDrive.getUserEmail();
    if(s==='conectado'){
      btn.style.background='#ECFDF5';btn.style.borderColor='#6EE7B7';btn.style.color='#065F46';
      ico.textContent='✓';
      txt.textContent=email?email.split('@')[0]:'Drive ✓';
      if(bn){bn.style.display='flex';bn.style.background='#ECFDF5';bn.style.borderColor='#6EE7B7';bn.style.color='#065F46';
        bn.innerHTML='<span style="font-size:1rem">☁️</span><span style="flex:1"><strong>Sincronizado con Drive</strong>'+(email?' ('+email+')':'')+' — '+CONFIG.fileName+' en carpeta <code style="background:#fff;padding:1px 5px;border-radius:3px">Aziendale</code></span>';}
    } else if(s==='sincronizando'){
      btn.style.background='#FFFBEB';btn.style.borderColor='#FCD34D';btn.style.color='#92400E';
      ico.textContent='⏳';txt.textContent='Sincronizando...';
    } else if(s==='conectando'){
      btn.style.background='#FFFBEB';btn.style.borderColor='#FCD34D';btn.style.color='#92400E';
      ico.textContent='⏳';txt.textContent='Conectando...';
    } else if(s==='error'){
      btn.style.background='#FEE2E2';btn.style.borderColor='#F87171';btn.style.color='#991B1B';
      ico.textContent='⚠';txt.textContent='Error Drive';
      if(bn){bn.style.display='flex';bn.style.background='#FEE2E2';bn.style.borderColor='#F87171';bn.style.color='#991B1B';
        bn.innerHTML='<span>⚠</span><span style="flex:1">Error sincronizando. Tus datos están guardados en este navegador. Vuelve a conectar.</span>';}
    } else { // desconectado
      btn.style.background='#fff';btn.style.borderColor='#E5E7EB';btn.style.color='#1F2937';
      ico.textContent='☁️';txt.textContent='Conectar Drive';
      if(bn)bn.style.display='none';
    }
  }

  async function toggle(){
    if(!driveDisponible)return;
    if(ExoDrive.isConnected()){
      if(!confirm('¿Desconectar Google Drive?\n\nTu data en Drive queda intacta, solo dejas de sincronizar automáticamente en este navegador.'))return;
      ExoDrive.disconnect();
      if(typeof exoToast==='function')exoToast('Drive desconectado','info');
    } else {
      try{
        await ExoDrive.connect();
        if(typeof exoToast==='function')exoToast('✓ Conectado con tu Drive — sincronizando...','success');
        await cargarSiCorresponde(false);
      }catch(e){
        if(typeof exoToast==='function')exoToast('Error conectando Drive: '+e.message,'error');
      }
    }
  }

  async function cargarSiCorresponde(silencioso){
    if(!ExoDrive.isConnected()||syncing)return;
    syncing=true;
    try{
      const r=await ExoDrive.load(CONFIG.fileName);
      const localTs=CONFIG.getLocalTs();
      const localTieneData=localTs>0;
      if(!r){
        // No hay archivo en Drive → sube el local si existe
        if(localTieneData){
          const meta=await ExoDrive.save(CONFIG.fileName,CONFIG.getData());
          if(meta&&meta.modifiedTime)lastRemoteModified=meta.modifiedTime;
          if(!silencioso&&typeof exoToast==='function')exoToast('✓ Tu data local se subió a Drive','success');
        }
        // Crear README la primera vez (no existe)
        await asegurarReadme();
        return;
      }
      lastRemoteModified=r.modifiedTime||lastRemoteModified;
      const remoto=r.data;
      // FUSIÓN (si la tool la provee): combina Drive + local elemento por
      // elemento en vez de que "el último snapshot gane" y borre lo del otro
      // equipo. Con 3 dispositivos, sus listas divergen; sin fusión, cada carga
      // pisaba a la anterior y se perdían clientes. El resultado fusionado se
      // sube para que todos los equipos converjan al mismo estado.
      if(typeof CONFIG.merge==='function'){
        // Respaldo de seguridad UNA sola vez por equipo, antes de la primera
        // fusión: si algún caso borde hiciera algo raro, la lista previa de este
        // equipo queda recuperable en Drive. La fusión ya es no-destructiva; esto
        // es solo un cinturón de seguridad extra.
        await ensurePreMergeBackup();
        const fusion=CONFIG.merge(remoto,CONFIG.getData());
        CONFIG.setData(fusion);
        const meta=await ExoDrive.save(CONFIG.fileName,fusion);
        if(meta&&meta.modifiedTime)lastRemoteModified=meta.modifiedTime; // no reaccionar a nuestra propia escritura
        if(!silencioso&&typeof exoToast==='function')exoToast('✓ Sincronizado con tu Drive','success');
        await asegurarReadme();
        return;
      }
      // Fallback histórico (tools sin merge): última escritura gana, por timestamp.
      const remotoTs=(remoto&&remoto.ts)||0;
      if(remotoTs>localTs){
        // Drive es más nuevo → reemplaza local
        CONFIG.setData(remoto);
        if(!silencioso&&typeof exoToast==='function')exoToast('✓ Datos cargados desde tu Drive','success');
      } else if(localTs>remotoTs){
        // Local es más nuevo → sube
        await ExoDrive.save(CONFIG.fileName,CONFIG.getData());
        if(!silencioso&&typeof exoToast==='function')exoToast('✓ Tu data local se subió a Drive','success');
      } else if(!silencioso&&typeof exoToast==='function'){
        exoToast('✓ Drive y local ya están iguales','info');
      }
      await asegurarReadme();
    }catch(e){
      console.error('[ExoDriveUI] cargarSiCorresponde:',e);
    }finally{
      syncing=false;
    }
  }

  // ─── Respaldo pre-fusión (una vez por equipo) ───
  async function ensurePreMergeBackup(){
    const KEY='exo_premerge_backup_'+CONFIG.fileName;
    if(localStorage.getItem(KEY))return;              // ya se hizo
    let local;try{local=CONFIG.getData();}catch(_){local=null;}
    const hayAlgo=local&&((local.clientes&&local.clientes.length)||Object.keys(local).length>1);
    try{
      if(hayAlgo){
        const name=CONFIG.fileName.replace(/\.json$/i,'')+'.backup-pre-merge.json';
        await ExoDrive.save(name,{savedAt:Date.now(),note:'Respaldo automático de la lista de este equipo antes de la primera fusión multi-dispositivo. Puedes borrarlo si todo quedó bien.',data:local});
      }
      localStorage.setItem(KEY,'1');
    }catch(e){
      // No bloquear la sincronización por un fallo de respaldo.
      console.warn('[ExoDriveUI] no se pudo crear respaldo pre-fusión:',e);
    }
  }

  // ─── Re-chequeo periódico: trae cambios de OTROS equipos sin recargar ───
  async function pollTick(){
    if(!driveDisponible||!ExoDrive.isConnected())return;
    if(typeof CONFIG.merge!=='function')return;        // solo tools con fusión (no-destructiva)
    if(document.visibilityState!=='visible')return;    // pestaña en segundo plano: no gastar cuota
    if(syncing||pendingSave)return;                    // hay algo en curso: no pisar
    // No interrumpir al usuario si está editando en un modal.
    if(document.querySelector('.modal-overlay.open, dialog[open], [aria-modal="true"]'))return;
    try{
      const st=await ExoDrive.stat(CONFIG.fileName);
      const mt=st&&st.modifiedTime;
      // Solo bajar si el archivo cambió desde la última vez que lo vimos/escribimos
      // (es decir, otro equipo escribió). Si es igual, no hay nada nuevo.
      if(!mt||mt===lastRemoteModified)return;
      await cargarSiCorresponde(true);
    }catch(_){/* silencioso: es un chequeo de fondo */}
  }

  // ─── README.md en la carpeta — solo se crea si no existe ───
  async function asegurarReadme(){
    try{
      const r=await ExoDrive.load('README.md').catch(()=>null);
      if(r)return; // ya existe
      const contenido='# Aziendale — Tus datos sincronizados\n\n'+
        'Esta carpeta contiene los datos de las herramientas de **exogenadian.com**\n'+
        'que has elegido sincronizar con tu Google Drive personal.\n\n'+
        '## 📂 Archivos en esta carpeta\n\n'+
        '- **micro-data.json** — Mi Contabilidad (movimientos contables del negocio)\n'+
        '- **oficina-clientes.json** — Mi Oficina Contable (CRM de clientes y obligaciones DIAN)\n'+
        '- **README.md** — este archivo (explicativo)\n\n'+
        '## 📦 Snapshots (respaldos semanales en Excel)\n\n'+
        'En la subcarpeta `snapshots/` se guardan automáticamente respaldos\n'+
        'en formato Excel (humano legible) cada 7 días. Los puedes abrir con\n'+
        'Excel, Google Sheets o Numbers.\n\n'+
        '## ⚠️ NO BORRES estos archivos\n\n'+
        'Son tu data contable. Si los borras manualmente, perderás la información\n'+
        'al cerrar el navegador.\n\n'+
        'Si los necesitas mover: mantén la estructura de la carpeta `Aziendale/`\n'+
        'en tu Drive y las herramientas web los seguirán encontrando.\n\n'+
        '## 🔒 Privacidad\n\n'+
        'NADIE en exogenadian.com tiene acceso a estos archivos — están en TU Drive\n'+
        'personal. Nosotros nunca los vemos, no los almacenamos, no los procesamos\n'+
        'en servidor. La autorización OAuth que diste es para que TU navegador escriba\n'+
        'aquí — solo aquí, no en ningún otro lugar de tu Drive.\n\n'+
        '---\n\n'+
        'Generado automáticamente · '+new Date().toLocaleDateString('es-CO')+'\n'+
        'https://exogenadian.com\n';
      await ExoDrive.saveText('README.md',contenido,'text/markdown');
    }catch(e){console.warn('[ExoDriveUI] no se pudo crear README:',e);}
  }

  // ─── Snapshot Excel semanal — solo si han pasado >=7 días desde el último ───
  // Cada tool puede registrar un generador de snapshot via CONFIG.snapshotXlsx()
  // que debe devolver un Blob xlsx. Se sube a `snapshots/{toolName}-{YYYY-MM-DD}.xlsx`
  async function chequearSnapshotSemanal(){
    if(!ExoDrive.isConnected())return;
    if(!CONFIG.snapshotXlsx)return; // tool no provee snapshot
    const KEY='exo_drive_lastsnap_'+CONFIG.fileName;
    const last=parseInt(localStorage.getItem(KEY)||'0',10);
    const dias=(Date.now()-last)/86400000;
    if(dias<7)return;
    try{
      const blob=await CONFIG.snapshotXlsx();
      if(!blob)return;
      const fecha=new Date().toISOString().slice(0,10);
      const safeName=(CONFIG.toolName||'snapshot').toLowerCase().replace(/[^\w]/g,'-').slice(0,30);
      const nombre='snapshots/'+safeName+'-'+fecha+'.xlsx';
      await ExoDrive.saveBinary(nombre,blob,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      localStorage.setItem(KEY,String(Date.now()));
      console.log('[ExoDriveUI] snapshot semanal creado:',nombre);
    }catch(e){console.warn('[ExoDriveUI] error snapshot:',e);}
  }

  function scheduleSave(){
    if(!driveDisponible||!ExoDrive.isConnected())return;
    pendingSave=true;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(async()=>{
      pendingSave=false;
      try{
        const meta=await ExoDrive.save(CONFIG.fileName,CONFIG.getData());
        if(meta&&meta.modifiedTime)lastRemoteModified=meta.modifiedTime; // nuestra propia escritura: que el poll no la confunda con cambio ajeno
        // Después de cada save exitoso, chequea si toca snapshot semanal
        chequearSnapshotSemanal();
      }catch(e){
        pendingSave=true; // no se subió → sigue pendiente para el próximo flush
        console.error('[ExoDriveUI] save:',e);
      }
    },2500);
  }

  // Sube ya lo pendiente (al ocultar/cerrar la pestaña) sin esperar el debounce.
  function flushSave(){
    if(!pendingSave||!driveDisponible||!ExoDrive.isConnected())return;
    clearTimeout(saveTimer);
    pendingSave=false;
    try{
      const p=ExoDrive.save(CONFIG.fileName,CONFIG.getData());
      if(p&&p.then)p.then(function(meta){if(meta&&meta.modifiedTime)lastRemoteModified=meta.modifiedTime;}).catch(function(){});
    }catch(_){}
  }

  async function forceSync(){
    if(!driveDisponible)return;
    if(!ExoDrive.isConnected())return toggle();
    await cargarSiCorresponde(false);
  }

  window.ExoDriveUI={
    attach,
    scheduleSave,
    forceSync,
    isConnected:()=>!!(driveDisponible&&ExoDrive.isConnected()),
  };
})();
