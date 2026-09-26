(async function(){
  const a = await (await fetch('editor-b64-a.txt')).text();
  const b = await (await fetch('editor-b64-b.txt')).text();
  const bin = atob(a+b);
  let code;
  try { code = decodeURIComponent(escape(bin)); } catch(e) { code = bin; }
  const s = document.createElement('script');
  s.textContent = code;
  document.body.appendChild(s);
})();
