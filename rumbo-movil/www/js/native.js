// Puente nativo (Capacitor): usa la API local, guarda/comparte archivos y abre enlaces en el navegador
(() => {
  const C = window.Capacitor, native = !!(C && C.isNativePlatform && C.isNativePlatform());
  const P = (n) => C && C.Plugins && C.Plugins[n];
  A.api = async function (url, method = 'GET', body) {
    try { return await LocalAPI.handle(method, url, body); }
    catch (e) {
      if (e.status === 401 && localStorage.getItem('token') && !/login|reset|register/.test(url)) { localStorage.removeItem('token'); localStorage.removeItem('uid'); location.replace('inicio.html'); }
      throw e;
    }
  };
  const rawClick = HTMLAnchorElement.prototype.click; A._rawClick = rawClick;
  A.saveFile = async (name, data, mime) => {
    const safe = String(name).replace(/[\\/:*?"<>|]+/g, '_');
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
    if (native && P('Filesystem') && P('Share')) {
      try {
        const b64 = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.readAsDataURL(blob); });
        const f = await P('Filesystem').writeFile({ path: safe, data: b64, directory: 'CACHE' });
        await P('Share').share({ title: safe, url: f.uri, dialogTitle: 'Guardar o compartir archivo' });
      } catch (e) { if (!/cancel/i.test(String((e && e.message) || ''))) A.toast('No se pudo compartir el archivo'); }
      return;
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = safe; document.body.appendChild(a); rawClick.call(a); a.remove();
  };
  // Las descargas por <a download> (exportar, .ics, documentos…) pasan por el menú de compartir del móvil
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && /^blob:/.test(this.href)) { const n = this.download; fetch(this.href).then((r) => r.blob()).then((b) => A.saveFile(n, b)); return; }
    return rawClick.call(this);
  };
  const webOpen = window.open.bind(window);
  const ext = (u) => (native && P('Browser') ? P('Browser').open({ url: u }) : webOpen(u, '_blank'));
  window.open = (u) => { ext(u); return null; };
  document.addEventListener('click', (e) => { const a = e.target.closest('a[target=_blank]'); if (a && native) { e.preventDefault(); ext(a.href); } }, true);
})();
