/**
 * Mini-nav Suite Exógena — inyecta barra superior con links a los 7 formatos.
 * Uso: agregar <div id="suite-nav"></div> al principio del <body> y
 *      <script src="shared/nav-exogena.js"></script> antes de cerrar </body>.
 * La página actual se resalta automáticamente por window.location.pathname.
 */

/* ─── Disclaimer banner permanente para páginas del Kit Suite ───
   Estas páginas no cargan shared/nav.js, así que inyectamos el banner aquí.
   Si nav.js ya lo inyectó (no es el caso en el Suite), no duplicamos. */
(function(){
  if(document.querySelector('.exo-disclaimer'))return;
  var dCSS=document.createElement('style');
  dCSS.textContent=`
    .exo-disclaimer{position:relative;top:0;left:0;right:0;z-index:49;background:#FFFBEB;color:#78350F;font-family:'Outfit',sans-serif;padding:10px 20px;text-align:center;font-size:.83rem;line-height:1.5;border-bottom:2px solid #F59E0B}
    .exo-disclaimer strong{color:#7C2D12}
    .exo-disclaimer a{color:#92400E;font-weight:700;text-decoration:underline}
    @media(max-width:600px){.exo-disclaimer{font-size:.76rem;padding:8px 12px}}
  `;
  document.head.appendChild(dCSS);
  var d=document.createElement('div');
  d.className='exo-disclaimer';
  d.setAttribute('role','note');
  d.innerHTML='⚠️ <strong>Borrador prediligenciado por algoritmos.</strong> Puede contener errores. El contador público debe revisar cada cifra y firmar antes de presentar a la DIAN. Reportar errores: <a href="mailto:soporte@exogenadian.com">soporte@exogenadian.com</a>';
  document.body.insertAdjacentElement('afterbegin',d);
})();

(function(){
  const container = document.getElementById('suite-nav');
  if(!container) return;
  // Si estamos en la propia suite no renderizamos (evita redundancia)
  const current = (location.pathname.split('/').pop() || '').toLowerCase();
  if(current === 'exogena-suite.html' || current === '') return;
  container.className = 'sn-wrap';

  const items = [
    {href:'exogena-suite.html',     label:'📂 Kit'},
    {href:'exogena.html',           label:'📊 Balance'},
    {href:'exogena-cce.html',       label:'🏢 CCE'},
    {href:'exogena-f1011.html',     label:'F1011'},
    {href:'exogena-f5253.html',     label:'F5253'},
    {href:'exogena-f2275.html',     label:'F2275'},
    {href:'exogena-f1004.html',     label:'F1004'},
    {href:'exogena-f1647.html',     label:'F1647'},
  ];

  const css = `
    .sn-wrap{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:6px 8px;margin-bottom:14px;display:flex;flex-wrap:nowrap;gap:4px;align-items:center;overflow-x:auto;scrollbar-width:thin}
    .sn-wrap::-webkit-scrollbar{height:4px}
    .sn-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
    .sn-label{font-size:.68rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.4px;padding:2px 8px;white-space:nowrap;flex-shrink:0}
    .sn-sep{width:1px;height:18px;background:#E2E8F0;margin:0 4px;flex-shrink:0}
    .sn-item{padding:5px 11px;border-radius:6px;text-decoration:none;transition:all .15s;white-space:nowrap;flex-shrink:0;font-size:.8rem;font-weight:600;color:#475569;border:1px solid transparent}
    .sn-item:hover{background:#fff;border-color:#CBD5E1;color:#1B3A5C}
    .sn-item.active{background:#1B3A5C;color:#fff;border-color:#1B3A5C}
    @media(max-width:640px){.sn-label{display:none}.sn-sep{display:none}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const html = `<span class="sn-label">Kit Exógena</span><span class="sn-sep"></span>` + items.map(it=>{
    const active = current === it.href.toLowerCase() ? ' active' : '';
    return `<a class="sn-item${active}" href="${it.href}">${it.label}</a>`;
  }).join('');
  container.innerHTML = html;
})();
