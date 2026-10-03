// API local: misma interfaz que el servidor de Rumbo, pero guardando todo en IndexedDB del propio teléfono.
(() => {
  const STORES = ['users', 'trips', 'lists', 'docs', 'sessions'];
  let dbp;
  const open = () => (dbp ||= new Promise((ok, err) => {
    const r = indexedDB.open('rumbo', 1);
    r.onupgradeneeded = () => STORES.forEach((n) => r.result.createObjectStore(n, { keyPath: '_id' }));
    r.onsuccess = () => ok(r.result); r.onerror = () => err(r.error);
  }));
  const tx = async (s, mode, fn) => { const d = await open();
    return new Promise((ok, err) => { const t = d.transaction(s, mode), rq = fn(t.objectStore(s)); t.oncomplete = () => ok(rq.result); t.onerror = t.onabort = () => err(t.error); }); };
  const DB = { get: (s, id) => tx(s, 'readonly', (st) => st.get(id)), all: (s) => tx(s, 'readonly', (st) => st.getAll()),
    put: (s, o) => tx(s, 'readwrite', (st) => st.put(o)), del: (s, id) => tx(s, 'readwrite', (st) => st.delete(id)) };

  const enc = new TextEncoder();
  const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  const rnd = (n = 8) => hex(crypto.getRandomValues(new Uint8Array(n)));
  const hash = async (pw, salt) => hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']), 256));
  const normCode = (c) => String(c || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const newCode = () => { const c = rnd(5).toUpperCase(); return c.slice(0, 5) + '-' + c.slice(5); };
  const pub = (u) => ({ _id: u._id, username: u.username, color: u.color, photo: u.photo, theme: u.theme });
  const fail = (status, message) => Object.assign(new Error(message), { status });
  const clone = (o) => (o === undefined ? o : JSON.parse(JSON.stringify(o)));
  const newSession = async (uid) => { const token = rnd(24); await DB.put('sessions', { _id: token, uid, createdAt: Date.now() }); return token; };
  const auth = async () => {
    const tk = localStorage.getItem('token'), s = tk && (await DB.get('sessions', tk));
    if (!s || Date.now() - s.createdAt > 30 * 864e5) throw fail(401, 'Sesión caducada: inicia sesión de nuevo');
    return s.uid;
  };
  const selfOnly = (id, uid) => { if (id !== uid) throw fail(403, 'Sin permiso'); };
  const trip = async (id, uid) => { const t = await DB.get('trips', id); if (!t || t.owner !== uid) throw fail(404, 'Viaje no encontrado'); return t; };
  const doc = async (id, uid) => { const d = await DB.get('docs', id); if (!d) throw fail(404, 'Documento no encontrado'); await trip(d.tripId, uid); return d; };
  const list = async (id, uid) => { const l = await DB.get('lists', id); if (!l || l.owner !== uid) throw fail(404, 'Tema no encontrado'); return l; };
  const cleanItems = (arr) => arr.slice(0, 500).map((i) => ({
    id: String(i.id || rnd(4)).slice(0, 20), name: String(i.name || '').slice(0, 120), desc: String(i.desc || '').slice(0, 1000),
    link: /^https?:\/\//i.test(i.link || '') ? String(i.link).slice(0, 500) : '',
    cost: i.cost === '' || i.cost == null ? '' : Number(i.cost) || 0,
    image: typeof i.image === 'string' && (i.image.startsWith('data:image/') || /^https?:\/\/[^\s'"()<>]{1,500}$/i.test(i.image)) ? i.image : '',
    done: !!i.done }));

  const routes = [], ID = '([^/]+)';
  const R = (m, re, fn, open) => routes.push({ m, re: new RegExp('^' + re + '$'), fn, open });

  R('POST', '/api/register', async (_, b) => {
    const name = (b.username || '').trim();
    if (!name || !b.password || b.password.length < 4) throw fail(400, 'Usuario y contraseña (mínimo 4 caracteres) obligatorios');
    if ((await DB.all('users')).some((u) => u.username === name)) throw fail(409, 'Ese nombre de usuario ya existe');
    const salt = rnd(16), rsalt = rnd(16), code = newCode();
    const u = { _id: rnd(8), username: name, salt, hash: await hash(b.password, salt), rsalt, rhash: await hash(normCode(code), rsalt),
      color: b.color || '#f2a541', photo: b.photo || '', theme: 'light', createdAt: Date.now() };
    await DB.put('users', u);
    return { ...pub(u), token: await newSession(u._id), recoveryCode: code };
  }, true);
  R('POST', '/api/login', async (_, b) => {
    const u = (await DB.all('users')).find((x) => x.username === (b.username || '').trim());
    if (!u || (await hash(b.password || '', u.salt)) !== u.hash) throw fail(401, 'Usuario o contraseña incorrectos');
    return { ...pub(u), token: await newSession(u._id) };
  }, true);
  R('POST', '/api/reset', async (_, b) => {
    if (!b.password || b.password.length < 4) throw fail(400, 'La nueva contraseña necesita al menos 4 caracteres');
    const u = (await DB.all('users')).find((x) => x.username === (b.username || '').trim());
    if (!u || !u.rhash || (await hash(normCode(b.code), u.rsalt)) !== u.rhash) throw fail(401, 'Usuario o código incorrectos');
    const salt = rnd(16), rsalt = rnd(16), nc = newCode();
    Object.assign(u, { salt, hash: await hash(b.password, salt), rsalt, rhash: await hash(normCode(nc), rsalt) });
    await DB.put('users', u);
    for (const s of await DB.all('sessions')) if (s.uid === u._id) await DB.del('sessions', s._id);
    return { recoveryCode: nc };
  }, true);
  R('DELETE', '/api/session', async () => { const tk = localStorage.getItem('token'); if (tk) await DB.del('sessions', tk); return { ok: true }; });
  R('POST', '/api/recovery-code', async (_, b, uid) => {
    const u = await DB.get('users', uid), rsalt = rnd(16), code = newCode();
    Object.assign(u, { rsalt, rhash: await hash(normCode(code), rsalt) }); await DB.put('users', u); return { recoveryCode: code };
  });
  R('GET', '/api/user/' + ID, async ([id], b, uid) => { selfOnly(id, uid); const u = await DB.get('users', uid); if (!u) throw fail(404, 'No existe'); return pub(u); });
  R('PUT', '/api/user/' + ID, async ([id], b, uid) => {
    selfOnly(id, uid); const u = await DB.get('users', uid);
    for (const k of ['username', 'color', 'photo', 'theme']) if (b[k] !== undefined) u[k] = b[k];
    if (!String(u.username).trim()) throw fail(400, 'Nombre vacío');
    if ((await DB.all('users')).some((x) => x._id !== uid && x.username === u.username)) throw fail(409, 'Ese nombre de usuario ya existe');
    await DB.put('users', u); return pub(u);
  });

  R('GET', '/api/trips/' + ID, async ([id], b, uid) => { selfOnly(id, uid); return (await DB.all('trips')).filter((t) => t.owner === uid); });
  R('POST', '/api/trips', async (_, b, uid) => {
    const title = (b.title || '').trim(); if (!title) throw fail(400, 'Pon un título al viaje');
    const t = { _id: rnd(8), owner: uid, title, country: '', destinos: [], start: '', end: '', flights: { out: {}, back: {} }, places: [], hotels: [], plan: [], createdAt: Date.now() };
    await DB.put('trips', t); return t;
  });
  R('POST', '/api/trips/import/' + ID, async ([id], b, uid) => {
    selfOnly(id, uid); const ts = Array.isArray(b.trips) ? b.trips.slice(0, 200) : []; let n = 0;
    for (const t of ts) { if (!t || typeof t !== 'object') continue; const { _id, ...rest } = t; await DB.put('trips', { ...rest, _id: rnd(8), owner: uid }); n++; }
    for (const l of Array.isArray(b.lists) ? b.lists.slice(0, 100) : [])
      await DB.put('lists', { _id: rnd(8), owner: uid, title: String(l.title || 'Tema').slice(0, 80), items: cleanItems(Array.isArray(l.items) ? l.items : []), createdAt: Date.now() });
    return { imported: n };
  });
  R('GET', '/api/trip/' + ID, async ([id], b, uid) => trip(id, uid));
  R('PUT', '/api/trip/' + ID, async ([id], b, uid) => { const t = await trip(id, uid); const { _id, owner, ...set } = b; Object.assign(t, set); await DB.put('trips', t); return t; });
  R('DELETE', '/api/trip/' + ID, async ([id], b, uid) => {
    await trip(id, uid); for (const d of await DB.all('docs')) if (d.tripId === id) await DB.del('docs', d._id);
    await DB.del('trips', id); return { ok: true };
  });
  R('POST', '/api/trip/' + ID + '/duplicate', async ([id], b, uid) => {
    const { _id, ...copy } = await trip(id, uid); const t = { ...copy, _id: rnd(8), owner: uid, title: copy.title + ' (copia)', createdAt: Date.now() };
    await DB.put('trips', t); return t;
  });

  R('POST', '/api/docs', async (_, b, uid) => {
    await trip(b.tripId, uid);
    if (!b.data || !b.name) throw fail(400, 'Archivo vacío');
    if (!/^(application\/pdf|image\/)/.test(b.type || '')) throw fail(400, 'Solo PDF o imágenes');
    const size = Math.floor((b.data.length * 3) / 4); if (size > 10 * 1024 * 1024) throw fail(413, 'Máximo 10 MB por archivo');
    const d = { _id: rnd(12), tripId: b.tripId, name: String(b.name).slice(0, 120), type: b.type, size, data: b.data, createdAt: Date.now() };
    await DB.put('docs', d); const { data, ...meta } = d; return meta;
  });
  R('GET', '/api/docs/' + ID, async ([id], b, uid) => { await trip(id, uid);
    return (await DB.all('docs')).filter((d) => d.tripId === id).map(({ data, ...d }) => d).sort((a, c) => c.createdAt - a.createdAt); });
  R('DELETE', '/api/doc/' + ID, async ([id], b, uid) => { await doc(id, uid); await DB.del('docs', id); return { ok: true }; });

  R('GET', '/api/lists', async (_, b, uid) => (await DB.all('lists')).filter((l) => l.owner === uid).sort((a, c) => a.createdAt - c.createdAt));
  R('POST', '/api/lists', async (_, b, uid) => {
    const title = (b.title || '').trim(); if (!title) throw fail(400, 'Pon un título al tema');
    const l = { _id: rnd(8), owner: uid, title: title.slice(0, 80), items: [], createdAt: Date.now() }; await DB.put('lists', l); return l;
  });
  R('GET', '/api/list/' + ID, async ([id], b, uid) => list(id, uid));
  R('PUT', '/api/list/' + ID, async ([id], b, uid) => {
    const l = await list(id, uid);
    if (typeof b.title === 'string' && b.title.trim()) l.title = b.title.trim().slice(0, 80);
    if (Array.isArray(b.items)) l.items = cleanItems(b.items);
    await DB.put('lists', l); return l;
  });
  R('DELETE', '/api/list/' + ID, async ([id], b, uid) => { await list(id, uid); await DB.del('lists', id); return { ok: true }; });

  // Compartir con otros usuarios necesita un servidor: en la app móvil se comparte por archivo
  R('GET', '/api/shares/' + ID, async () => []);
  R('POST', '/api/shares', async () => { throw fail(400, 'Compartir con otros usuarios necesita un servidor. Usa «Compartir archivo».'); });

  const handle = async (method, url, body) => {
    const path = String(url).split('?')[0];
    for (const r of routes) {
      if (r.m !== method) continue; const m = r.re.exec(path); if (!m) continue;
      const uid = r.open ? null : await auth();
      return clone(await r.fn(m.slice(1), clone(body) || {}, uid));
    }
    throw fail(404, 'Ruta no encontrada');
  };
  const docBlob = async (id) => {
    const d = await doc(id, await auth()), bin = atob(d.data), u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type: d.type });
  };
  globalThis.LocalAPI = { handle, docBlob };
})();
