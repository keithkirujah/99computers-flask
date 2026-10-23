/* 99 COMPUTERS: NOVA. Public site. Clean URLs (no hash). No accounts. */
(() => {
const CFG = Object.assign({ demo: false }, window.NOVA_CONFIG);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Aurora + inline SVG sprite */
document.body.insertAdjacentHTML('afterbegin', '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>');
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-x" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></g></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></g></symbol>
<symbol id="i-moon" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"/></g></symbol>
<symbol id="i-device-cctv" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2"/><path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M19 7v7a7 7 0 0 1 -14 0v-7"/><path d="M12 14l.01 0"/></g></symbol>
<symbol id="i-device-laptop" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l18 0"/><path d="M5 7a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8"/></g></symbol>
<symbol id="i-device-tv" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9"/><path d="M16 3l-4 4l-4 -4"/></g></symbol>
<symbol id="i-tool" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"/></g></symbol>
<symbol id="i-bulb" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"/><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"/><path d="M9.7 17l4.6 0"/></g></symbol>
<symbol id="i-usb" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M12 17v-11.5"/><path d="M7 10v3l5 3"/><path d="M12 14.5l5 -2v-2.5"/><path d="M16 10h2v-2h-2l0 2"/><path d="M6 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M10 5.5h4l-2 -2.5l-2 2.5"/></g></symbol>
<symbol id="i-map-pin" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0"/></g></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/></g></symbol>
<symbol id="i-brand-whatsapp" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"/></g></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></g></symbol>
<symbol id="i-shield-check" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/></g></symbol>
<symbol id="i-coin" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/><path d="M12 7v10"/></g></symbol>
<symbol id="i-award" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"/><path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889"/><path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889"/></g></symbol>
<symbol id="i-heart-handshake" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/><path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25"/><path d="M12.5 15.5l2 2"/><path d="M15 13l2 2"/></g></symbol>
<symbol id="i-apps" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M14 7l6 0"/><path d="M17 4l0 6"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/></g></symbol>
<symbol id="i-send" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/></g></symbol>
<symbol id="i-device-speaker" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14"/><path d="M9 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M12 7l0 .01"/></g></symbol>
<symbol id="i-message-circle" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"/></g></symbol>
<symbol id="i-device-desktop" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/></g></symbol>
<symbol id="i-device-mobile" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"/><path d="M11 4h2"/><path d="M12 17v.01"/></g></symbol>
<symbol id="i-printer" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/><path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/></g></symbol>
<symbol id="i-wash-machine" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14"/><path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M8 6h.01"/><path d="M11 6h.01"/><path d="M14 6h2"/><path d="M8 14c1.333 -.667 2.667 -.667 4 0c1.333 .667 2.667 .667 4 0"/></g></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"/></g></symbol>
<symbol id="i-shopping-bag" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304"/><path d="M9 11v-5a3 3 0 0 1 6 0v5"/></g></symbol>
<symbol id="i-arrow-right" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></g></symbol>
<symbol id="i-package" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"/><path d="M12 12l8 -4.5"/><path d="M12 12l0 9"/><path d="M12 12l-8 -4.5"/><path d="M16 5.25l-8 4.5"/></g></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/></g></symbol>
<symbol id="i-menu-2" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/></g></symbol>
</svg>`);

/* storage */
const mem = {};
const DB = {
  get(k, d) { try { const v = localStorage.getItem('n99.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
  set(k, v) { try { localStorage.setItem('n99.' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
};
const toast = m => { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast glass'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = m; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600); };

/* theme */
const root = document.documentElement, tt = $('#themeToggle');
if (tt) {
  const lab = () => tt.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  lab();
  tt.addEventListener('click', () => { const n = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {} const m = $('meta[name=theme-color]'); if (m) m.content = n === 'light' ? '#eaf1ff' : '#050b1a'; lab(); });
}

/* modal */
function modal(html, cls = '') {
  const el = document.createElement('div'); el.className = 'modal';
  el.innerHTML = `<div class="panel glass ${cls}" role="dialog" aria-modal="true">${html}</div>`; document.body.append(el);
  const prev = document.activeElement; let done = false, cb = null;
  const key = e => {
    if (el !== [...document.querySelectorAll('.modal')].pop()) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const f = $$('button,input,select,textarea,a[href]', el).filter(x => !x.disabled && x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  };
  function close() { if (done) return; done = true; el.classList.remove('on'); setTimeout(() => el.remove(), 400); document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus(); if (cb) cb(); }
  document.addEventListener('keydown', key);
  el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) close(); });
  requestAnimationFrame(() => { el.classList.add('on'); const f = $('input,select,textarea', el) || $('button', el); if (f) f.focus(); });
  return { el, close, on: fn => { cb = fn; } };
}

/* helpers */
const SERVICES = ['IT Consultancy', 'Computer Sales', 'Electronics and Home Appliances', 'CCTV Installation', 'IT Support', 'Electronics Accessories'];
const BRANCHES = ["Murang'a", 'Nairobi CBD', 'Kerugoya'];
const markBad = (f, id, msg) => { const el = f.elements[id], w = el.closest('.fld'); w.classList.add('err'); el.setAttribute('aria-invalid', 'true'); w.insertAdjacentHTML('beforeend', `<span class="ferr" role="alert">${msg}</span>`); };
const clearBad = f => { $$('.ferr', f).forEach(x => x.remove()); $$('.fld.err', f).forEach(x => x.classList.remove('err')); $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid')); };
const kes = n => 'KSh ' + Number(n).toLocaleString('en-KE');
const eff = p => p.sale && p.sale < p.price ? p.sale : p.price;
const CATICON = { Laptops: 'device-laptop', Desktops: 'device-desktop', Televisions: 'device-tv', Phones: 'device-mobile', CCTV: 'device-cctv', Printers: 'printer', Sound: 'device-speaker', Appliances: 'wash-machine', Accessories: 'usb' };

/* service request */
async function openRequest(pre = {}) {
  const m = modal(`<button class="ib x-btn" data-close aria-label="Close">${ic('x')}</button><h2>Request a service</h2><p class="sub2">Tell us what you need and which branch suits you. We will call or WhatsApp you back.</p>
  <form novalidate><div class="row2"><div class="fld"><label for="r-n">Your name</label><input id="r-n" name="name" type="text" autocomplete="name" required></div><div class="fld"><label for="r-p">Phone number</label><input id="r-p" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678" required></div></div>
  <div class="row2"><div class="fld"><label for="r-s">Service</label><select id="r-s" name="service">${SERVICES.map(s => `<option${s === pre.service ? ' selected' : ''}>${s}</option>`).join('')}</select></div><div class="fld"><label for="r-b">Branch</label><select id="r-b" name="branch">${BRANCHES.map(s => `<option>${s}</option>`).join('')}</select></div></div>
  <div class="fld"><label for="r-m">Details</label><textarea id="r-m" name="msg" placeholder="For example: 4 cameras for a shop in Kerugoya, with installation.">${esc(pre.msg || '')}</textarea></div>
  <button class="btn p" style="width:100%" type="submit">Send request</button></form>
  <p class="note">Prefer WhatsApp? <a href="https://wa.me/254794707522?text=${encodeURIComponent('Hello 99 COMPUTERS, I would like to make an enquiry.')}" target="_blank" rel="noopener" style="color:var(--sig-t);text-decoration:underline">Chat with us directly</a>.</p>`);
  const f = $('form', m.el);
  f.addEventListener('submit', e => {
    e.preventDefault(); clearBad(f);
    const d = Object.fromEntries(new FormData(f)); let ok = true;
    if (d.name.trim().length < 2) { markBad(f, 'name', 'Enter your name'); ok = false; }
    if (!/^(\+?254|0)[17]\d{8}$/.test(d.phone.replace(/\s/g, ''))) { markBad(f, 'phone', 'Enter a Kenyan mobile number'); ok = false; }
    if (d.msg.trim().length < 10) { markBad(f, 'msg', 'Add a few details (at least 10 characters)'); ok = false; }
    if (!ok) { $('.fld.err input, .fld.err textarea', f).focus(); return; }
    const phone = d.phone.replace(/\s/g, '').replace(/^0/, '+254').replace(/^254/, '+254');
    const text = ['Hello 99 COMPUTERS, I would like to request a service:', '', '• Name: ' + d.name.trim(), '• Phone: ' + phone, '• Service: ' + d.service, '• Branch: ' + d.branch, '• Details: ' + d.msg.trim()].join('\n');
    window.open('https://wa.me/254794707522?text=' + encodeURIComponent(text), '_blank', 'noopener');
    $('.panel', m.el).innerHTML = `<div style="text-align:center;padding:12px 0"><div class="ok-ic">${ic('check')}</div><h2>Request ready</h2><p class="sub2">We have opened WhatsApp with your request. Just tap Send and we will get back to you at ${esc(phone)}.</p><button class="btn p" data-close type="button">Done</button></div>`;
  });
}
document.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return; if (a.dataset.act === 'request') openRequest(); });

/* catalog */
const IDB = {
  db: null,
  open() { return this.db || (this.db = new Promise((res, rej) => { const r = indexedDB.open('n99img', 1); r.onupgradeneeded = () => r.result.createObjectStore('i'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); },
  async tx(mode, fn) { const d = await this.open(); return new Promise((res, rej) => { const t = d.transaction('i', mode); const q = fn(t.objectStore('i')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); },
  async put(blob) { const id = 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); await this.tx('readwrite', s => s.put(blob, id)); return id; },
  get(id) { return this.tx('readonly', s => s.get(id)); }
};
const urlCache = {};
const imgSrc = async ref => {
  if (!ref) return '';
  if (!ref.startsWith('idb:') && !ref.startsWith('http') && !ref.startsWith('/')) return '/' + ref;
  if (!ref.startsWith('idb:')) return ref;
  if (urlCache[ref]) return urlCache[ref];
  try { const b = await IDB.get(ref.slice(4)); return b ? (urlCache[ref] = URL.createObjectURL(b)) : ''; } catch (e) { return ''; }
};

function hydrate(rootEl) {
  $$('img[data-ref]', rootEl).forEach(async im => {
    const wrap = im.closest('.pimg,.sh,.main,.tn,.thumbimg');
    im.addEventListener('load', () => { wrap?.classList.remove('failed'); wrap?.classList.add('loaded'); }, { once: true });
    im.addEventListener('error', () => { if (im.getAttribute('src')) wrap?.classList.add('failed'); }, { once: true });
    const s = await imgSrc(im.dataset.ref);
    if (s) { im.src = s; } else { wrap?.classList.add('failed'); }
  });
}

const Catalog = {
  async load() {
    try {
      // THE FIX: Appended ?v= timestamp forces all browsers to bypass cache and fetch the latest version instantly
      const r = await fetch('/catalog.json?v=' + Date.now(), { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (j && Array.isArray(j.products)) return { products: j.products, cats: Array.isArray(j.categories) && j.categories.length ? j.categories : null };
      }
    } catch (e) {}
    return { products: [], cats: null };
  },
  list(cats, products) {
    const base = cats && cats.length ? cats.map(c => ({ name: c.name, specs: c.specs || [] })) : [];
    const have = new Set(base.map(c => c.name.toLowerCase()));
    [...new Set(products.map(p => p.cat))].filter(n => n && !have.has(n.toLowerCase())).forEach(n => base.push({ name: n, specs: [] }));
    return base;
  }
};

/* SEO Product Schema Injection */
function injectProductSEO(p) {
  const existing = document.getElementById('product-seo');
  if (existing) existing.remove();

  const siteUrl = "https://www.99computers.co.ke";
  const productUrl = siteUrl + '/shop/p/' + p.id;
  
  // Ensure we use the effective price (sale price if applicable)
  const finalPrice = p.sale && p.sale < p.price ? p.sale : p.price;
  
  // Image fallback if no images exist
  const imgArray = (p.images && p.images.length) ? p.images.map(img => {
    return img.startsWith('http') ? img : siteUrl + (img.startsWith('/') ? '' : '/') + img;
  }) : [siteUrl + '/images/1.jpeg'];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.name,
    "image": imgArray,
    "description": p.desc || 'Available at 99 COMPUTERS. IT solutions, electronics, and security systems in Kenya.',
    "brand": {
      "@type": "Brand",
      "name": p.brand || "99 COMPUTERS"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "KES",
      "price": finalPrice,
      "availability": p.qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "99 COMPUTERS"
      }
    }
  };

  const s = document.createElement('script');
  s.id = 'product-seo';
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
}

/* ===================== SITE ===================== */
if (document.body.dataset.page === 'site') {
  $$('[data-words]').forEach(h => { h.setAttribute('aria-label', h.textContent); h.innerHTML = h.textContent.split(' ').map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(' '); });
  $('#yr').textContent = new Date().getFullYear();

  /* nav */
  const nav = $('.nav'), links = $('.links'), as = $$('a', links);
  const pillTo = a => { if (!a) { links.style.setProperty('--o', 0); return; } links.style.setProperty('--x', a.offsetLeft + 'px'); links.style.setProperty('--w', a.offsetWidth + 'px'); links.style.setProperty('--o', 1); };
  let tick = false;
  const onScroll = () => { tick = false; nav.classList.toggle('s', scrollY > 20); nav.style.setProperty('--p', Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  as.forEach(a => { a.addEventListener('pointerenter', () => pillTo(a)); a.addEventListener('focus', () => pillTo(a)); });
  links.addEventListener('pointerleave', () => pillTo($('.on', links)));
  const sheet = $('#sheet'), mb = $('#menuBtn');
  const setMenu = o => { sheet.classList.toggle('on', o); mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); mb.innerHTML = ic(o ? 'x' : 'menu-2'); };
  mb.addEventListener('click', e => { e.stopPropagation(); setMenu(!sheet.classList.contains('on')); });
  document.addEventListener('click', e => { if (!sheet.contains(e.target) || e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* branches */
  const CAMS = [
    { n: "Murang'a", sub: 'Main branch', url: 'https://maps.app.goo.gl/FHAN5yE1pPPzXfvG9?g_st=iwb' },
    { n: 'Nairobi CBD', sub: 'Superior Towers, Moi Avenue', url: 'https://www.google.com/maps/search/?api=1&query=Superior+Towers+Moi+Avenue+Nairobi' },
    { n: 'Kerugoya', sub: 'Kerugoya Town, Kirinyaga', url: 'https://www.google.com/maps/search/?api=1&query=Kerugoya+Town+Kirinyaga' }
  ];
  const isOpen = () => { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); const g = t => p.find(x => x.type === t).value; const h = +g('hour') + +g('minute') / 60; return g('weekday') !== 'Sun' && h >= 8 && h < 18; };
  const open = isOpen();
  $('#brows').innerHTML = CAMS.map(c => `<a class="brow" href="${c.url}" target="_blank" rel="noopener"><span class="dot ${open ? 'on' : ''}"></span><span><b>${c.n}</b><small>${c.sub}</small></span>${ic('arrow-up-right')}</a>`).join('');
  $$('[data-open]').forEach(e => e.textContent = open ? 'Open now' : 'Closed now');
  $$('.dot[data-st]').forEach(d => d.classList.toggle('on', open));

  /* hero parallax + glass */
  if (matchMedia('(hover: hover) and (min-width: 1101px)').matches && !reduce) {
    const items = $$('.cl');
    document.addEventListener('pointermove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; items.forEach(c => { const d = +c.dataset.d || 1; c.style.setProperty('--tx', x * 26 * d + 'px'); c.style.setProperty('--ty', y * 20 * d + 'px'); }); });
  }
  document.addEventListener('pointermove', e => { const g = e.target.closest && e.target.closest('.glass'); if (!g) return; const r = g.getBoundingClientRect(); g.style.setProperty('--mx', e.clientX - r.left + 'px'); g.style.setProperty('--my', e.clientY - r.top + 'px'); }, { passive: true });

  /* static content */
  const S = [
    ['IT Consultancy', 'Professional technology advice and solutions for individuals and businesses.', 'bulb', 'var(--blue)'],
    ['Computer Sales', 'Quality laptops, desktops, and computer accessories.', 'device-laptop', 'var(--teal)'],
    ['Electronics and Home Appliances', 'Televisions, smartphones, washing machines, radios, and other electronic products.', 'device-tv', 'var(--sig)'],
    ['CCTV Installation', 'Installation and setup of surveillance cameras for homes, offices, shops, and businesses.', 'device-cctv', 'var(--teal)'],
    ['IT Support', 'Assistance with computer setup, configuration, troubleshooting, maintenance, repair, and other technology needs.', 'tool', 'var(--sig)'],
    ['Electronics Accessories', 'A variety of accessories and supporting equipment for everyday technology use.', 'usb', 'var(--blue)']
  ];
  $('#svc').innerHTML = S.map((s, i) => `<article class="glass hv svc rv" style="--h:${s[3]};--d:${i * .07}s"><span class="ico">${ic(s[2])}</span><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('');
  const TILES = [
    ['Laptops', 'Laptops', 'Business, student, and everyday laptops from trusted brands.', '/images/3.jpeg', 'Laptop'],
    ['Desktops', 'Desktop Computers', 'Complete desktop systems, towers, and all-in-ones.', '/images/4.jpeg', 'Desktop computer'],
    ['Televisions', 'Televisions', 'Smart TVs, LED screens, and home entertainment displays.', '/images/5.jpeg', 'Television'],
    ['CCTV', 'CCTV & Security', 'Cameras, DVRs, and complete surveillance kits for any property.', '/images/6.jpeg', 'CCTV camera'],
    ['Sound', 'Sound Systems', 'Speakers, subwoofers, amplifiers, and home audio setups.', '/images/7.jpeg', 'Sound system'],
    ['Accessories', 'Accessories', 'Keyboards, mice, chargers, cables, and everyday essentials.', '/images/8.jpeg', 'Accessories']
  ];
  $('#tiles').innerHTML = TILES.map((p, i) => `<a class="glass hv prod rv" href="/shop/c/${p[0]}" style="--d:${i * .07}s"><div class="slot sh"><span class="chip">${p[0]}</span><img src="${p[3]}" alt="${p[4]}" loading="lazy" decoding="async" width="480" height="320"></div><div class="meta"><strong>${p[1]}</strong><small>${p[2]}</small></div></a>`).join('');
  $$('.sh img, .fig img, .mos img').forEach(im => { const w = im.closest('.sh, .fig, .ph'), ok = () => { w.classList.add('loaded'); w.classList.remove('sh'); }, bad = () => { w.classList.add('failed'); w.classList.remove('sh'); }; if (im.complete && im.naturalWidth) ok(); else if (im.complete) bad(); else { im.addEventListener('load', ok, { once: true }); im.addEventListener('error', bad, { once: true }); } });

  /* shop */
  let CAT = [], CL = [], ready = false; const st = { c: 'All', q: '', s: 'feat' };
  const keyline = p => { const g = re => { const s = (p.specs || []).find(x => re.test(x[0])); return s ? s[1] : ''; }; return [g(/processor|cpu/i), g(/memory|ram/i), g(/storage|ssd|hdd/i)].filter(Boolean).join(' · ') || (p.specs && p.specs[0] ? p.specs[0][0] + ': ' + p.specs[0][1] : ''); };

  const abs = ref => {
    if (!ref) return '';
    if (ref.startsWith('idb:') || ref.startsWith('http') || ref.startsWith('/')) return ref;
    return '/' + ref;
  };

  const media = (p, i = 0) => {
    if (!p.images || !p.images[i]) return ic(CATICON[p.cat] || 'package');
    const ref = p.images[i];
    const isIdb = ref.startsWith('idb:');
    const src = isIdb ? '' : abs(ref);
    return `<img data-ref="${esc(ref)}" ${src ? `src="${esc(src)}"` : ''} alt="${esc(p.name)}" loading="lazy" decoding="async">`;
  };

  function card(p, i = 0) {
    const out = p.qty <= 0, pct = p.sale && p.sale < p.price ? Math.round(100 * (1 - p.sale / p.price)) : 0;
    const bdg = out ? '<span class="bdg gr">Out of stock</span>' : pct ? `<span class="bdg">Save ${pct}%</span>` : p.qty <= 3 ? `<span class="bdg gr">Only ${p.qty} left</span>` : '';
    const imgs = p.images || [];
    const hasMultiple = imgs.length > 1;

    let imgHtml = '';
    if (!imgs.length) {
      imgHtml = ic(CATICON[p.cat] || 'package');
    } else {
      imgHtml = imgs.map((r, idx) => {
        const isIdb = r.startsWith('idb:');
        const src = isIdb ? '' : abs(r);
        const active = idx === 0 ? ' active' : '';
        return `<img data-ref="${esc(r)}" ${src ? `src="${esc(src)}"` : ''} alt="${esc(p.name)}" class="${active}" ${idx > 0 ? 'loading="lazy"' : ''} decoding="async">`;
      }).join('');
    }

    return `<a class="glass hv pc rv" href="/shop/p/${esc(p.id)}" style="--d:${Math.min(i, 8) * .05}s"><div class="pimg ${hasMultiple ? 'multi' : ''} ${imgs.length ? '' : 'noimg'}" data-multi="${hasMultiple ? '1' : '0'}">${imgHtml}${bdg}</div><div class="pb"><small>${esc(p.cat)}${p.brand ? ' · ' + esc(p.brand) : ''}</small><h3>${esc(p.name)}</h3><span class="ks">${esc(keyline(p))}</span><span class="pr"><b>${kes(eff(p))}</b>${pct ? `<s>${kes(p.price)}</s>` : ''}</span></div></a>`;
  }
  
  function filtered() {
    const q = st.q.toLowerCase();
    let l = CAT.filter(p => (st.c === 'All' || p.cat === st.c) && (!q || [p.name, p.brand, p.cat, p.desc, ...(p.specs || []).map(s => s[1])].join(' ').toLowerCase().includes(q)));
    if (st.s === 'lo') l.sort((a, b) => eff(a) - eff(b)); else if (st.s === 'hi') l.sort((a, b) => eff(b) - eff(a)); else if (st.s === 'new') l.sort((a, b) => b.created - a.created); else l.sort((a, b) => (b.featured | 0) - (a.featured | 0) || b.created - a.created);
    return l;
  }

  function startImageCycling() {
    if (reduce) return;
    setInterval(() => {
      $$('.pimg.multi').forEach(el => {
        if (el.matches(':hover')) return;
        const imgs = $$('img', el);
        if (imgs.length < 2) return;
        let cur = imgs.findIndex(i => i.classList.contains('active'));
        if (cur === -1) cur = 0;
        imgs[cur].classList.remove('active');
        cur = (cur + 1) % imgs.length;
        imgs[cur].classList.add('active');
      });
    }, 3500);
  }

  function renderShop() {
    const order = CL.map(c => c.name.toLowerCase()), rank = n => { const i = order.indexOf(n.toLowerCase()); return i < 0 ? 99 : i; }, cats = [...new Set(CAT.map(p => p.cat))].sort((x, y) => rank(x) - rank(y) || x.localeCompare(y));
    $('#chips').innerHTML = ['All', ...cats].map(c => `<button class="cp" type="button" data-c="${esc(c)}" aria-pressed="${c === st.c}">${esc(c)} <small>${c === 'All' ? CAT.length : CAT.filter(p => p.cat === c).length}</small></button>`).join('');
    const l = filtered();
    $('#pgrid').innerHTML = l.map(card).join('') || `<div class="empty glass" style="grid-column:1/-1;padding:48px">${CAT.length ? 'No products match your search. Try another word or category.' : 'Our catalogue is being updated. Please check back soon, or message us on WhatsApp.'}</div>`;
    $('#pcount').textContent = `${l.length} product${l.length === 1 ? '' : 's'}`;
    hydrate($('#pgrid'));
    $$('#pgrid .rv').forEach(el => requestAnimationFrame(() => el.classList.add('in')));
  }
  function renderFeatured() {
    const f = CAT.filter(p => p.featured && p.qty > 0), l = (f.length ? f : [...CAT].sort((a, b) => b.created - a.created)).slice(0, 4);
    $('#featured').innerHTML = l.map(card).join(''); hydrate($('#featured')); $$('#featured .rv').forEach(el => requestAnimationFrame(() => el.classList.add('in')));
    $('#featwrap').hidden = !l.length;
  }
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    st.c = b.dataset.c;
    const newPath = st.c === 'All' ? '/shop' : '/shop/c/' + encodeURIComponent(st.c);
    history.replaceState(null, '', newPath);
    renderShop();
  });
  $('#psearch').addEventListener('input', e => { st.q = e.target.value; renderShop(); });
  $('#psort').addEventListener('change', e => { st.s = e.target.value; renderShop(); });

  function openProduct(id) {
    const p = CAT.find(x => x.id === id);
    if (!p) { toast('That product is no longer available'); go('/shop'); return; }

    // Inject Product Schema for Google
    injectProductSEO(p);

    const imgs = p.images || [];
    if (imgs[0] && !imgs[0].startsWith('idb:')) { new Image().src = abs(imgs[0]); }

    const out = p.qty <= 0, pct = p.sale && p.sale < p.price ? Math.round(100 * (1 - p.sale / p.price)) : 0;
    const share = location.origin + '/shop/p/' + p.id;
    const wa = kind => {
      const lines = [
        kind === 'buy' ? 'Hello 99 COMPUTERS, I would like to buy this:' : 'Hello 99 COMPUTERS, I would like to ask about this:',
        '',
        p.name + (p.brand ? ' (' + p.brand + ')' : ''),
        'Price: ' + kes(eff(p)),
        ...(p.specs || []).slice(0, 4).map(s => '• ' + s[0] + ': ' + s[1]),
        '',
        share
      ];
      return 'https://wa.me/254794707522?text=' + encodeURIComponent(lines.join('\n').trim());
    };

    const m = modal(`<button class="ib x-btn" data-close aria-label="Close">${ic('x')}</button><div class="pd"><div class="gal"><div class="main pimg loaded" id="pmain">${media(p)}</div>${imgs.length > 1 ? `<div class="th">${imgs.map((r, i) => `<button type="button" data-i="${i}" data-ref="${esc(r)}" aria-label="Photo ${i + 1}" aria-pressed="${i === 0}"><img data-ref="${esc(r)}" ${r.startsWith('idb:') ? '' : `src="${esc(abs(r))}"`} alt=""></button>`).join('')}</div>` : ''}</div>
      <div class="info"><small class="mute">${esc(p.cat)}${p.brand ? ' · ' + esc(p.brand) : ''}</small><h2>${esc(p.name)}</h2><div class="pr big"><b>${kes(eff(p))}</b>${pct ? `<s>${kes(p.price)}</s><span class="bdg" style="position:static">Save ${pct}%</span>` : ''}</div>
      <p class="stk ${out ? 'o' : p.qty <= 3 ? 'l' : 'k'}">${out ? 'Out of stock' : p.qty <= 3 ? 'Only ' + p.qty + ' left' : 'In stock'}</p>${p.desc ? `<p class="pdesc">${esc(p.desc)}</p>` : ''}
      ${(p.specs || []).length ? `<h3>Specifications</h3><dl class="specs">${p.specs.map(s => `<div><dt>${esc(s[0])}</dt><dd>${esc(s[1])}</dd></div>`).join('')}</dl>` : ''}
      <div class="btns"><a class="btn p" href="${wa('buy')}" target="_blank" rel="noopener">${ic('brand-whatsapp')}Buy now</a><a class="btn" href="${wa('ask')}" target="_blank" rel="noopener">${ic('message-circle')}Inquire</a></div><p class="hint" style="margin-top:12px">Buy now and Inquire open WhatsApp with this product ready to send. Prices are in KSh.</p></div></div>`, 'xl');

    hydrate(m.el);
    setTimeout(() => { m.el.querySelectorAll('.pimg').forEach(el => { const img = el.querySelector('img'); if (img && img.complete && img.naturalWidth > 0) { el.classList.remove('failed'); el.classList.add('loaded'); } }); }, 500);

    m.on(() => { 
      if (location.pathname.startsWith('/shop/p/')) history.replaceState(null, '', '/shop'); 
      // Clean up product schema when modal closes to avoid SEO confusion
      const seo = document.getElementById('product-seo');
      if (seo) seo.remove();
    });

    m.el.addEventListener('click', async e => {
      const t = e.target.closest('.th button'); if (!t) return;
      m.el.querySelectorAll('.th button').forEach(b => b.setAttribute('aria-pressed', b === t));
      const ref = t.dataset.ref;
      const s = await imgSrc(ref);
      const main = m.el.querySelector('#pmain');
      if (main) {
        main.classList.remove('failed');
        main.classList.add('loaded');
        main.innerHTML = s ? `<img src="${esc(s)}" alt="${esc(p.name)}" decoding="async">` : ic(CATICON[p.cat] || 'package');
      }
    });
  }

  /* ---------- ROUTER ---------- */
  const PAGES = ['home', 'shop', 'services', 'about', 'why', 'contact'];
  let cur = null;

  function parsePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    const pg = parts[0] && PAGES.includes(parts[0]) ? parts[0] : 'home';
    const kind = parts[1] || '';
    const arg = decodeURIComponent(parts.slice(2).join('/') || '');
    return { pg, kind, arg };
  }

  function route() {
    const { pg, kind, arg } = parsePath();
    if (pg !== cur) {
      $$('.pg').forEach(s => s.classList.toggle('on', s.dataset.pg === pg));
      as.forEach(a => {
        const t = (a.getAttribute('href') || '').replace(/^\//, '').split('/')[0] || 'home';
        a.classList.toggle('on', t === pg);
      });
      pillTo($('.on', links));
      cur = pg;
      scrollTo(0, 0);
      onScroll();
    }
    if (pg === 'shop') {
      if (kind === 'c') { st.c = arg || 'All'; renderShop(); }
      else if (!kind) { st.c = 'All'; renderShop(); }
      if (kind === 'p' && ready && !$('.modal.on')) openProduct(arg);
    }
    document.body.classList.add('routed');
  }

  function go(path) {
    if (!path.startsWith('/')) path = '/' + path.replace(/^#/, '');
    if (path === location.pathname) { route(); return; }
    history.pushState({}, '', path);
    route();
  }
  window.__go = go;

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href') || '';
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
    const top = href.replace(/^\//, '').split('/')[0];
    if (!PAGES.includes(top) && top !== '') return;
    e.preventDefault();
    setMenu(false);
    go(href);
  });

  addEventListener('popstate', route);

  /* counters + reveal */
  const count = el => { const n = +el.dataset.n; if (reduce) { el.textContent = n; return; } const t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); $$('[data-n]', e.target).forEach(count); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => io.observe(el));
  setTimeout(() => $$('.rv').forEach(e => e.classList.add('in')), 3500);

  /* Boot */
  startImageCycling();
  const initial = parsePath();
  Catalog.load().then(({ products, cats }) => {
    CAT = products;
    CL = Catalog.list(cats, products);
    ready = true;
    renderFeatured();
    renderShop();
    route();
    if (initial.pg === 'shop' && initial.kind === 'p' && initial.arg) {
      setTimeout(() => { if (!$('.modal.on')) openProduct(initial.arg); }, 100);
    }
  }).catch(() => { ready = true; route(); });
  
  setTimeout(() => { if (!document.body.classList.contains('routed')) { ready = true; route(); } }, 2500);
}

/* SEO JSON-LD (Organization, WebSite, LocalBusiness) */
if (document.body.dataset.page === 'site') {
(function injectSEO() {
  const siteUrl = "https://www.99computers.co.ke";
  const PHONE = "+254794707522";
  const WHATSAPP = "+254794707522";
  const EMAIL = "info@99computers.co.ke";
  const branches = [
    { city: "Murang'a", region: "Murang'a County", name: "99 COMPUTERS — Murang'a (Main Branch)", mapUrl: "https://maps.app.goo.gl/FHAN5yE1pPPzXfvG9" },
    { city: "Nairobi", region: "Nairobi County", name: "99 COMPUTERS — Nairobi CBD", street: "Superior Towers, Moi Avenue", mapUrl: "https://www.google.com/maps/search/?api=1&query=Superior+Towers+Moi+Avenue+Nairobi" },
    { city: "Kerugoya", region: "Kirinyaga County", name: "99 COMPUTERS — Kerugoya", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kerugoya+Town+Kirinyaga" }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": siteUrl + "/#organization", "name": "99 COMPUTERS", "url": siteUrl, "logo": { "@type": "ImageObject", "url": siteUrl + "/images/1.jpeg" }, "contactPoint": [
        { "@type": "ContactPoint", "telephone": PHONE, "contactType": "customer service", "areaServed": "KE", "availableLanguage": ["English", "Swahili"] },
        { "@type": "ContactPoint", "telephone": WHATSAPP, "contactType": "WhatsApp customer support", "areaServed": "KE" }
      ]},
      { "@type": "WebSite", "@id": siteUrl + "/#website", "url": siteUrl, "name": "99 COMPUTERS", "publisher": { "@id": siteUrl + "/#organization" }, "inLanguage": "en-KE" },
      ...branches.map((b, i) => ({
        "@type": "LocalBusiness", "@id": siteUrl + "/#branch-" + i, "name": b.name, "parentOrganization": { "@id": siteUrl + "/#organization" },
        "description": "IT consultancy, computer and laptop sales, electronics, repair and support, and professional CCTV installation.",
        "url": siteUrl, "image": siteUrl + "/images/1.jpeg", "telephone": PHONE, "email": EMAIL,
        "priceRange": "KSh", "currenciesAccepted": "KES", "paymentAccepted": "Cash, M-Pesa, Card",
        "areaServed": { "@type": "Country", "name": "Kenya" },
        "address": { "@type": "PostalAddress", "addressCountry": "KE", "addressLocality": b.city, "addressRegion": b.region, ...(b.street ? { "streetAddress": b.street } : {}) },
        "hasMap": b.mapUrl,
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "08:00", "closes": "18:00" }],
        "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Products & Services", "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Consultancy" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laptops & Desktop Computers" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Televisions & Electronics" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Support & Repair" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electronics Accessories" } }
        ]}
      }))
    ]
  };
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(schema); document.head.appendChild(s);
})();
}
})();