// Lista genérica (sitios y hoteles): formulario plegable, edición, filtro, imagen y menores
const Lists = {
  async init(cfg) {
    const u = await A.requireUser(); if (!u) return;
    const t = await T.get(); t[cfg.key] = t[cfg.key] || [];
    const $ = (s) => document.querySelector(s), val = (k) => $('#f_' + k).value.trim();
    let edit = -1, open = false, q = '', tag = '';
    $('#h').textContent = cfg.title;
    $('#form').insertAdjacentHTML('beforebegin', '<button class="btn wide" id="new">＋ Crear</button>' + (cfg.filter
      ? '<div class="stack" id="flt"><input id="q" type="search" placeholder="Buscar por nombre"><nav class="legtabs" id="tags"></nav></div>' : ''));
    $('#form').innerHTML = cfg.fields.map((f) => `<label>${f.label}` + (f.type === 'textarea'
      ? `<textarea id="f_${f.k}" rows="2"></textarea>` : `<input id="f_${f.k}" type="${f.type || 'text'}">`) + '</label>').join('')
      + (cfg.img ? '<label>Imagen (se busca sola; si no hay una fiable, súbela tú)<input type="file" id="f_img" accept="image/*"></label>' : '')
      + (cfg.minors ? '<label style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="hasm" style="width:20px;height:20px"> Hay menores en el viaje</label><div class="stack" id="mbox" hidden><div class="stack" id="ages"></div><button type="button" class="btn ghost" id="addm">＋ Añadir menor</button></div>' : '')
      + (cfg.extra ? `<button class="btn ghost wide" id="extra">${cfg.extra.label}</button>` : '')
      + '<button class="btn wide" id="add">Añadir</button><button class="btn ghost wide" id="cancel">Cancelar</button>';
    const addAge = (v = '') => $('#ages').insertAdjacentHTML('beforeend', `<input class="age" type="number" min="0" max="17" placeholder="Edad del menor" value="${T.esc(v)}">`);
    if (cfg.minors) {
      $('#hasm').onchange = () => { $('#mbox').hidden = !$('#hasm').checked; if ($('#hasm').checked && !$('#ages').children.length) addAge(); };
      $('#addm').onclick = () => addAge();
    }
    const fill = (it) => {
      cfg.fields.forEach((f) => ($('#f_' + f.k).value = it ? it[f.k] ?? '' : f.def ? f.def(t) : ''));
      if (cfg.img) $('#f_img').value = '';
      if (cfg.minors) { const m = it?.minors || []; $('#ages').innerHTML = ''; $('#hasm').checked = m.length > 0; $('#mbox').hidden = !m.length; m.forEach((a) => addAge(a)); }
    };
    const view = () => {
      const empty = !t[cfg.key].length;
      $('#form').hidden = !(open || empty); $('#new').hidden = open || empty; if (cfg.filter) $('#flt').hidden = empty;
      $('#cancel').hidden = empty && edit < 0; $('#add').textContent = edit >= 0 ? 'Guardar cambios' : 'Añadir';
    };
    const tags = () => {
      const m = new Map(); t[cfg.key].forEach((x) => { const l = (x.location || '').trim(); if (l && !m.has(l.toLowerCase())) m.set(l.toLowerCase(), l); });
      if (tag && !m.has(tag)) tag = '';
      $('#tags').innerHTML = m.size ? ['', ...m.keys()].map((k) => `<button class="chip ${k === tag ? 'on' : ''}" data-tag="${T.esc(k)}">${k ? T.esc(m.get(k)) : 'Todas'}</button>`).join('') : '';
    };
    const render = () => {
      const all = t[cfg.key].map((it, i) => ({ it, i }));
      const shown = all.filter(({ it }) => (!q || it.name.toLowerCase().includes(q)) && (!tag || (it.location || '').trim().toLowerCase() === tag));
      $('#list').innerHTML = shown.length ? shown.map(({ it, i }) => `<div class="card item">
        ${cfg.img ? `<div class="thumb" style="background-image:url('${T.esc(it.image)}')">${it.image ? '' : cfg.icon || '📍'}</div>` : ''}
        <div class="grow"><b>${T.esc(it.name)}</b>${cfg.line(it)}
        <a class="link" target="_blank" href="${T.map(it.name)}">📍 Ver en Google Maps</a></div>
        <div><button class="del" data-e="${i}" aria-label="Editar">✏️</button><button class="del" data-i="${i}" aria-label="Eliminar">🗑️</button></div></div>`).join('')
        : all.length ? '<p class="muted">Sin resultados.</p>' : '';
      if (cfg.filter) tags(); view();
    };
    if (cfg.filter) {
      $('#q').oninput = (e) => { q = e.target.value.trim().toLowerCase(); render(); };
      $('#tags').onclick = (e) => { const b = e.target.closest('[data-tag]'); if (!b) return; tag = b.dataset.tag === tag ? '' : b.dataset.tag; render(); };
    }
    $('#new').onclick = () => { edit = -1; open = true; fill(); view(); };
    $('#cancel').onclick = () => { edit = -1; open = false; fill(); view(); };
    if (cfg.extra) $('#extra').onclick = () => { const v = {}; cfg.fields.forEach((f) => (v[f.k] = val(f.k))); window.open(cfg.extra.url(v, t), '_blank'); };
    $('#list').onclick = async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.e !== undefined) { edit = +b.dataset.e; open = true; fill(t[cfg.key][edit]); view(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      if (b.dataset.i !== undefined) { t[cfg.key].splice(+b.dataset.i, 1); await T.save(t); render(); }
    };
    $('#add').onclick = async () => {
      if (!val('name')) return A.toast('Escribe un nombre');
      const it = {}, old = edit >= 0 ? t[cfg.key][edit] : null; cfg.fields.forEach((f) => (it[f.k] = val(f.k)));
      if (cfg.minors) it.minors = $('#hasm').checked ? [...document.querySelectorAll('.age')].map((i) => i.value.trim()).filter(Boolean) : [];
      if (cfg.img) {
        const file = $('#f_img').files[0];
        if (file) { it.image = await A.photo(file); it.imgSrc = 'manual'; }
        else if (old && old.imgSrc === 'manual') { it.image = old.image; it.imgSrc = 'manual'; }
        else { it.image = await T.img(it.name, it.location); it.imgSrc = 'auto'; }
      }
      edit >= 0 ? (t[cfg.key][edit] = it) : t[cfg.key].push(it);
      await T.save(t); edit = -1; open = false; fill(); render();
    };
    fill(); render();
  },
};
