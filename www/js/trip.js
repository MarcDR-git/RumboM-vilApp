// Utilidades de viaje
const T = {
  id: () => new URLSearchParams(location.search).get('id'),
  get: () => A.api('/api/trip/' + T.id()),
  save: (t) => A.api('/api/trip/' + t._id, 'PUT', t),
  esc: (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
  map: (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q),
  days(t) { return t.start && t.end ? Math.round((new Date(t.end) - new Date(t.start)) / 864e5) + 1 : 0; },
  // Busca en Wikipedia una imagen fiable. Si ningún resultado coincide con el nombre, devuelve '' (mejor sin imagen que una rara).
  async img(name, hint = '') {
    const words = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    const nw = words(name); if (!nw.length) return '';
    for (const q of [name, (name + ' ' + hint).trim()]) for (const lang of ['es', 'en']) {
      try {
        const r = await fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*&gsrsearch=${encodeURIComponent(q)}`);
        const pages = Object.values((await r.json()).query?.pages || {}).sort((a, b) => a.index - b.index);
        for (const p of pages) {
          const tw = words(p.title), src = p.thumbnail?.source || '';
          const hit = nw.filter((w) => tw.includes(w)).length;
          if (src && hit >= Math.max(1, Math.ceil(nw.length * 0.6)) && p.thumbnail.width >= 200 && !/\.svg|flag|logo|map|escudo|coat|icon/i.test(src)) return src;
        }
      } catch {}
    }
    return '';
  },
};
