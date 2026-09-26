// loads chunk files then evals
(async function(){
  const n = 2;
  let code = '';
  for (let i = 0; i < n; i++) {
    const r = await fetch('editor-chunk-' + i + '.js');
    code += await r.text();
  }
  const s = document.createElement('script');
  s.textContent = code;
  document.body.appendChild(s);
})();
