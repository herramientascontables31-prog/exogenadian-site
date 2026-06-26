/* ═══ Aziendale — Google Drive sync ═══
   Sincroniza un blob JSON contra Google Drive del propio usuario.
   100% client-side (sin backend). Scope `drive.file` (solo archivos
   creados por la app — no toca otros archivos del Drive del user).

   Uso:
     await ExoDrive.init('TU_CLIENT_ID_GOOGLE.apps.googleusercontent.com');
     ExoDrive.onStatusChange(s => console.log('estado:', s));

     ExoDrive.connect();           // Abre OAuth popup
     ExoDrive.disconnect();        // Revoca y borra estado local
     ExoDrive.isConnected();       // true/false

     await ExoDrive.save('mi-negocio.json', {datos: ...});
     const obj = await ExoDrive.load('mi-negocio.json');
     await ExoDrive.list();        // lista archivos en la carpeta

   Estados: 'desconectado' | 'conectando' | 'conectado' | 'sincronizando' | 'error'
*/
(function(){
  'use strict';
  if(window.ExoDrive)return;

  const FOLDER_NAME='Aziendale';
  const TOKEN_KEY='exo_drive_token_v1';
  const FOLDER_KEY='exo_drive_folder_v1';

  let CLIENT_ID=null;
  let tokenClient=null;
  let accessToken=null;
  let tokenExpiry=0;
  let folderId=null;
  let statusListeners=[];
  let estado='desconectado';
  let userEmail=null;

  function setEstado(e){estado=e;statusListeners.forEach(fn=>{try{fn(e)}catch(_){}});}

  function loadToken(){
    try{
      const raw=localStorage.getItem(TOKEN_KEY);if(!raw)return null;
      const t=JSON.parse(raw);
      if(t.exp&&t.exp<Date.now())return null;  // expirado
      return t;
    }catch(_){return null;}
  }
  function saveToken(t){localStorage.setItem(TOKEN_KEY,JSON.stringify(t));}
  function clearToken(){localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(FOLDER_KEY);}

  // Carga el script GIS de Google si no está
  function loadGIS(){
    return new Promise((resolve,reject)=>{
      if(window.google&&window.google.accounts){return resolve();}
      const s=document.createElement('script');
      s.src='https://accounts.google.com/gsi/client';
      s.async=true;s.defer=true;
      s.onload=()=>resolve();
      s.onerror=()=>reject(new Error('No se pudo cargar Google Identity Services'));
      document.head.appendChild(s);
    });
  }

  async function init(clientId){
    if(!clientId||clientId.indexOf('apps.googleusercontent.com')<0){
      console.warn('[ExoDrive] CLIENT_ID no configurado. Pasa un ID válido de Google Cloud Console.');
      return false;
    }
    CLIENT_ID=clientId;
    await loadGIS();
    tokenClient=google.accounts.oauth2.initTokenClient({
      client_id:CLIENT_ID,
      scope:'https://www.googleapis.com/auth/drive.file',
      callback:'',  // se asigna por petición
    });
    // Restaurar sesión previa si hay token vigente
    const saved=loadToken();
    if(saved){
      accessToken=saved.token;tokenExpiry=saved.exp;folderId=saved.folder||null;userEmail=saved.email||null;
      setEstado('conectado');
    }
    return true;
  }

  function isConnected(){
    return !!(accessToken&&tokenExpiry>Date.now());
  }

  // Pide token (popup OAuth si no hay sesión, silencioso si sí)
  function requestToken(prompt){
    return new Promise((resolve,reject)=>{
      if(!tokenClient)return reject(new Error('ExoDrive no inicializado. Llama a init(clientId).'));
      tokenClient.callback=(resp)=>{
        if(resp.error){setEstado('error');return reject(new Error(resp.error));}
        accessToken=resp.access_token;
        tokenExpiry=Date.now()+(resp.expires_in*1000)-30000;  // -30s margen
        saveToken({token:accessToken,exp:tokenExpiry,folder:folderId,email:userEmail});
        resolve(accessToken);
      };
      tokenClient.requestAccessToken({prompt:prompt||'consent'});
    });
  }

  async function connect(){
    setEstado('conectando');
    try{
      await requestToken('consent');
      // Obtener email del usuario
      try{
        const r=await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{Authorization:'Bearer '+accessToken}});
        if(r.ok){const u=await r.json();userEmail=u.email;saveToken({token:accessToken,exp:tokenExpiry,folder:folderId,email:userEmail});}
      }catch(_){}
      await ensureFolder();
      setEstado('conectado');
      return true;
    }catch(e){setEstado('error');throw e;}
  }

  function disconnect(){
    if(accessToken&&window.google&&google.accounts&&google.accounts.oauth2){
      google.accounts.oauth2.revoke(accessToken,()=>{});
    }
    accessToken=null;tokenExpiry=0;folderId=null;userEmail=null;
    clearToken();
    setEstado('desconectado');
  }

  // Asegura que la carpeta Aziendale existe en el Drive del user
  async function ensureFolder(){
    if(folderId)return folderId;
    const cached=localStorage.getItem(FOLDER_KEY);
    if(cached){folderId=cached;return folderId;}
    // Buscar carpeta existente
    const q="mimeType='application/vnd.google-apps.folder' and name='"+FOLDER_NAME+"' and trashed=false";
    const r=await api('/files?q='+encodeURIComponent(q)+'&fields=files(id,name)');
    if(r.files&&r.files.length){
      folderId=r.files[0].id;
      localStorage.setItem(FOLDER_KEY,folderId);
      return folderId;
    }
    // Crear carpeta
    const created=await api('/files',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:FOLDER_NAME,mimeType:'application/vnd.google-apps.folder'})
    });
    folderId=created.id;
    localStorage.setItem(FOLDER_KEY,folderId);
    saveToken({token:accessToken,exp:tokenExpiry,folder:folderId,email:userEmail});
    return folderId;
  }

  // Wrapper fetch contra Drive API con auto-renovación de token
  async function api(path,opts){
    if(!isConnected())await requestToken('');  // refresh silencioso
    opts=opts||{};
    opts.headers=Object.assign({Authorization:'Bearer '+accessToken},opts.headers||{});
    const r=await fetch('https://www.googleapis.com/drive/v3'+path,opts);
    if(r.status===401){
      // Token expiró → reintenta una vez
      await requestToken('');
      opts.headers.Authorization='Bearer '+accessToken;
      const r2=await fetch('https://www.googleapis.com/drive/v3'+path,opts);
      if(!r2.ok)throw new Error('Drive API '+r2.status);
      return r2.json();
    }
    if(!r.ok){
      const err=await r.text();
      throw new Error('Drive API '+r.status+': '+err.slice(0,200));
    }
    return r.json();
  }

  async function findFile(name){
    await ensureFolder();
    const q="name='"+name.replace(/'/g,"\\'")+"' and '"+folderId+"' in parents and trashed=false";
    const r=await api('/files?q='+encodeURIComponent(q)+'&fields=files(id,name,modifiedTime,size)');
    return (r.files&&r.files[0])||null;
  }

  async function save(name,data){
    return saveRaw(name,'application/json',typeof data==='string'?data:JSON.stringify(data));
  }

  // Guarda texto plano (README.md u otros). MimeType configurable.
  async function saveText(name,content,mimeType){
    return saveRaw(name,mimeType||'text/plain',content);
  }

  // Guarda binario (blob u arraybuffer). Para Excel/PDF.
  async function saveBinary(name,blob,mimeType){
    if(blob instanceof ArrayBuffer)blob=new Blob([blob]);
    setEstado('sincronizando');
    try{
      await ensureFolder();
      const existing=await findFile(name);
      const metadata={name,mimeType:mimeType||'application/octet-stream'};
      if(!existing)metadata.parents=[folderId];
      const boundary='-------ExoDriveBoundary'+Date.now();
      // Necesitamos enviar metadata como JSON + cuerpo binario en multipart
      const head='--'+boundary+'\r\n'+
        'Content-Type: application/json\r\n\r\n'+
        JSON.stringify(metadata)+'\r\n'+
        '--'+boundary+'\r\n'+
        'Content-Type: '+(mimeType||'application/octet-stream')+'\r\n\r\n';
      const tail='\r\n--'+boundary+'--';
      const body=new Blob([head,blob,tail]);
      const url=existing
        ? 'https://www.googleapis.com/upload/drive/v3/files/'+existing.id+'?uploadType=multipart&fields=id,modifiedTime'
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime';
      const method=existing?'PATCH':'POST';
      const r=await fetch(url,{
        method,
        headers:{Authorization:'Bearer '+accessToken,'Content-Type':'multipart/related; boundary='+boundary},
        body
      });
      if(!r.ok){const t=await r.text();throw new Error('Drive saveBinary '+r.status+': '+t.slice(0,200));}
      const meta=await r.json();
      setEstado('conectado');
      return meta;
    }catch(e){
      setEstado('error');
      throw e;
    }
  }

  // Internal: save raw text/json (no binary)
  async function saveRaw(name,mimeType,body){
    setEstado('sincronizando');
    try{
      await ensureFolder();
      const existing=await findFile(name);
      const metadata={name,mimeType};
      if(!existing)metadata.parents=[folderId];
      const boundary='-------ExoDriveBoundary'+Date.now();
      const multipart='--'+boundary+'\r\n'+
        'Content-Type: application/json\r\n\r\n'+
        JSON.stringify(metadata)+'\r\n'+
        '--'+boundary+'\r\n'+
        'Content-Type: '+mimeType+'\r\n\r\n'+
        body+'\r\n--'+boundary+'--';
      const url=existing
        ? 'https://www.googleapis.com/upload/drive/v3/files/'+existing.id+'?uploadType=multipart&fields=id,modifiedTime'
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime';
      const method=existing?'PATCH':'POST';
      const r=await fetch(url,{
        method,
        headers:{Authorization:'Bearer '+accessToken,'Content-Type':'multipart/related; boundary='+boundary},
        body:multipart
      });
      if(!r.ok){const t=await r.text();throw new Error('Drive saveRaw '+r.status+': '+t.slice(0,200));}
      const meta=await r.json();
      setEstado('conectado');
      return meta;
    }catch(e){
      setEstado('error');
      throw e;
    }
  }

  async function load(name){
    setEstado('sincronizando');
    try{
      const file=await findFile(name);
      if(!file){setEstado('conectado');return null;}
      if(!isConnected())await requestToken('');
      const r=await fetch('https://www.googleapis.com/drive/v3/files/'+file.id+'?alt=media',{
        headers:{Authorization:'Bearer '+accessToken}
      });
      if(!r.ok)throw new Error('Drive load '+r.status);
      const txt=await r.text();
      setEstado('conectado');
      try{return {data:JSON.parse(txt),modifiedTime:file.modifiedTime,id:file.id};}
      catch(_){return {data:txt,modifiedTime:file.modifiedTime,id:file.id};}
    }catch(e){
      setEstado('error');
      throw e;
    }
  }

  async function list(){
    await ensureFolder();
    const r=await api('/files?q=%27'+folderId+"%27+in+parents+and+trashed=false&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime+desc");
    return r.files||[];
  }

  window.ExoDrive={
    init,connect,disconnect,isConnected,
    save,saveText,saveBinary,load,list,
    onStatusChange:(fn)=>{statusListeners.push(fn);try{fn(estado)}catch(_){}},
    getStatus:()=>estado,
    getUserEmail:()=>userEmail,
  };
})();
