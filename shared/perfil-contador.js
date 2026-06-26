/* ═══ Aziendale — Perfil del Contador + Libreta de Clientes ═══
   Persistencia local (localStorage) usada por el módulo Certificados.

   Uso:
     <script src="shared/perfil-contador.js"></script>
     <script>
       perfilContador.get();              // {nombre, cc, tp, ...} | null
       perfilContador.set(obj);           // guarda
       perfilContador.has();              // boolean
       perfilContador.clear();

       perfilContador.clientes.list();    // array
       perfilContador.clientes.add(c);    // c sin id, devuelve id
       perfilContador.clientes.update(id, c);
       perfilContador.clientes.remove(id);
       perfilContador.clientes.get(id);
       perfilContador.clientes.MAX_FREE;  // 3
     </script>

   Claves localStorage:
     - exogenadian:perfil-contador
     - exogenadian:libreta-clientes
*/
(function(){
  'use strict';

  var KEY_PERFIL='exogenadian:perfil-contador';
  var KEY_CLIENTES='exogenadian:libreta-clientes';
  var KEY_EMPLEADOS='exogenadian:libreta-empleados';
  var MAX_FREE=3;

  function readJSON(k, fallback){
    try{ var raw=localStorage.getItem(k); return raw?JSON.parse(raw):fallback; }
    catch(e){ return fallback; }
  }
  function writeJSON(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(e){ return false; }
  }
  function uid(){
    return 'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  }

  var perfil={
    get: function(){ return readJSON(KEY_PERFIL, null); },
    set: function(obj){
      var current=readJSON(KEY_PERFIL, {})||{};
      var merged=Object.assign({}, current, obj||{});
      return writeJSON(KEY_PERFIL, merged);
    },
    has: function(){
      var p=readJSON(KEY_PERFIL, null);
      return !!(p && p.nombre && (p.cc || p.tp));
    },
    clear: function(){ localStorage.removeItem(KEY_PERFIL); }
  };

  var clientes={
    MAX_FREE: MAX_FREE,
    list: function(){
      var arr=readJSON(KEY_CLIENTES, []);
      return Array.isArray(arr)?arr:[];
    },
    get: function(id){
      return clientes.list().find(function(c){ return c.id===id; })||null;
    },
    add: function(c){
      var arr=clientes.list();
      var id=uid();
      arr.push(Object.assign({id:id, creado:Date.now()}, c||{}));
      writeJSON(KEY_CLIENTES, arr);
      return id;
    },
    update: function(id, patch){
      var arr=clientes.list();
      var i=arr.findIndex(function(c){ return c.id===id; });
      if(i<0) return false;
      arr[i]=Object.assign({}, arr[i], patch||{}, {id:id});
      writeJSON(KEY_CLIENTES, arr);
      return true;
    },
    remove: function(id){
      var arr=clientes.list().filter(function(c){ return c.id!==id; });
      writeJSON(KEY_CLIENTES, arr);
    },
    count: function(){ return clientes.list().length; },
    canAdd: function(){ return true; }
  };

  /* ── Libreta de empleados (para certificado laboral y futuros) ── */
  var empleados={
    MAX_FREE: MAX_FREE,
    list: function(){
      var arr=readJSON(KEY_EMPLEADOS, []);
      return Array.isArray(arr)?arr:[];
    },
    get: function(id){
      return empleados.list().find(function(e){ return e.id===id; })||null;
    },
    add: function(e){
      var arr=empleados.list();
      var id=uid();
      arr.push(Object.assign({id:id, creado:Date.now()}, e||{}));
      writeJSON(KEY_EMPLEADOS, arr);
      return id;
    },
    update: function(id, patch){
      var arr=empleados.list();
      var i=arr.findIndex(function(e){ return e.id===id; });
      if(i<0) return false;
      arr[i]=Object.assign({}, arr[i], patch||{}, {id:id});
      writeJSON(KEY_EMPLEADOS, arr);
      return true;
    },
    remove: function(id){
      var arr=empleados.list().filter(function(e){ return e.id!==id; });
      writeJSON(KEY_EMPLEADOS, arr);
    },
    count: function(){ return empleados.list().length; },
    canAdd: function(){ return true; }
  };

  window.perfilContador={
    get: perfil.get,
    set: perfil.set,
    has: perfil.has,
    clear: perfil.clear,
    clientes: clientes,
    empleados: empleados,
    KEY_PERFIL: KEY_PERFIL,
    KEY_CLIENTES: KEY_CLIENTES,
    KEY_EMPLEADOS: KEY_EMPLEADOS
  };
})();
