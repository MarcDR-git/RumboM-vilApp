// Utilidades compartidas por todas las pantallas
(() => {
  const t = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = t;
})();

const A = {
  uid: () => localStorage.getItem('uid'),
  headers() { const h = { 'Content-Type': 'application/json' }, k = localStorage.getItem('token'); if (k) h.Authorization = 'Bearer ' + k; return h; },
  async logout() { try { await A.api('/api/session', 'DELETE'); } catch {} localStorage.removeItem('uid'); localStorage.removeItem('token'); A.go('inicio.html'); },
  async api(url, method = 'GET', body) {
    const r = await fetch(url, { method, headers: A.headers(), body: body && JSON.stringify(body) });
    let d; try { d = await r.json(); } catch { throw new Error('El servidor no reconoce esta acción. Páralo (Ctrl+C) y vuelve a ejecutar npm start.'); }
    if (r.status === 401 && localStorage.getItem('token') && !/login|reset|register/.test(url)) { localStorage.removeItem('token'); localStorage.removeItem('uid'); location.replace('inicio.html'); }
    if (!r.ok) throw new Error(d.error || 'Error');
    return d;
  },
  async user() {
    if (!A.uid()) return null;
    try { const u = await A.api('/api/user/' + A.uid()); A.theme(u.theme); return u; }
    catch { localStorage.removeItem('uid'); localStorage.removeItem('token'); return null; }
  },
  async requireUser() {
    const u = await A.user();
    if (!u) location.replace('inicio.html');
    return u;
  },
  theme(t) { document.documentElement.dataset.theme = t; localStorage.setItem('theme', t); },
  go(url) { document.body.classList.add('out'); setTimeout(() => (location.href = url), 280); },
  avatar(u, cls = '') {
    const bg = u.photo ? `background-image:url(${u.photo})` : '';
    return `<div class="avatar ${cls}" style="border-color:${u.color};${bg}">${u.photo ? '' : u.username[0].toUpperCase()}</div>`;
  },
  // Reduce la foto a 200px para guardarla ligera en la base de datos
  photo(file) {
    return new Promise((ok) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = c.height = 200;
        const s = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 200, 200);
        ok(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = URL.createObjectURL(file);
    });
  },
  toast(msg) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg;
    document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
  },
  colors: ['#f2a541', '#e76f51', '#2f8f9d', '#7b6cd9', '#4caf7a', '#e8598b'],
  globe() {
    const land = '<path d="M20 70q10-20 30-14t12 26-22 20-20-12zM70 110q14-6 22 8t-6 26-20-8zM110 60q20-14 34 0t-6 22-26 4zM140 100q18-4 24 12t-14 18-14-14z"/>';
    return `<svg class="globe" viewBox="0 0 200 200" role="img" aria-label="Globo terráqueo con un avión">
      <defs><clipPath id="gc"><circle cx="100" cy="100" r="64"/></clipPath></defs>
      <circle cx="100" cy="100" r="64" fill="#2f8f9d"/>
      <g clip-path="url(#gc)" fill="#8fd18f"><g class="land">${land}<g transform="translate(100 0)">${land}</g><g transform="translate(200 0)">${land}</g></g></g>
      <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" stroke-width="3"/>
      <ellipse cx="100" cy="100" rx="64" ry="24" fill="none" stroke="#fff" stroke-opacity=".35"/>
      <g class="orbit"><g transform="translate(100 12)"><path fill="#f2a541" stroke="#0e3b4f" stroke-width="1.5" d="M9 0L-5-3-8-10-11-10-8-2-12 0-8 2-11 10-8 10-5 3Z"/></g></g>
    </svg>`;
  },
};

A.lang = localStorage.getItem('lang') || 'es';
A.loc = A.lang === 'en' ? 'en-GB' : 'es-ES';
if (A.lang !== 'es') document.write('<script src="js/i18n.js"><\/script>');

// Efectos: onda al pulsar, y animación al eliminar / editar
document.addEventListener('pointerdown', (e) => {
  const el = e.target.closest('.btn,.tile,.chip,.gear,.tabs button,.day .add'); if (!el) return;
  const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement('span');
  d.className = 'ripple'; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  el.appendChild(d); setTimeout(() => d.remove(), 600);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('button.del'); if (!b || b._go) return;
  const row = b.closest('.card,.entry'), l = b.getAttribute('aria-label') || '';
  if (/^(Eliminar|Quitar)/.test(l)) { e.stopPropagation(); e.preventDefault(); row?.classList.add('removing'); setTimeout(() => { b._go = true; b.click(); }, 260); }
  else if (/^Editar/.test(l)) row?.classList.add('flash');
}, true);

// Botón de ayuda junto al de ajustes en todas las cabeceras
document.addEventListener('DOMContentLoaded', () => {
  const g = document.querySelector('.top .gear'); if (!g || /ayuda\.html$/.test(location.pathname)) return;
  const h = document.createElement('button'); h.className = 'gear'; h.setAttribute('aria-label', 'Ayuda'); h.textContent = '❓'; h.onclick = () => A.go('ayuda.html');
  const w = document.createElement('div'); w.className = 'hbtns'; g.parentNode.insertBefore(w, g); w.append(h, g);
});

// Variante móvil: API local y puente nativo (se cargan después de definir A)
document.write('<script src="js/local-api.js"><\/script><script src="js/native.js"><\/script>');
