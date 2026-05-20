/* ═══════════════════════════════════════════
   McArthur — shared JS
═══════════════════════════════════════════ */
'use strict';

/* ── SVG icons ── */
const ICO = {
  needle: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="5" x2="20" y2="26"/><path d="M16 9 20 5l4 4"/><ellipse cx="20" cy="31" rx="6" ry="3"/><path d="M14 31q-2 4 1.5 5Q20 37.5 24.5 36q3.5-1 1.5-5"/></svg>`,
  leaf:   `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 36c0 0-13-9-13-21 0-7 5-11 13-11s13 4 13 11c0 12-13 21-13 21z"/><line x1="20" y1="36" x2="20" y2="19"/><path d="M20 21Q13 16 11 9"/></svg>`,
  shield: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 34 9v11c0 9-7 15-14 17-7-2-14-8-14-17V9z"/><path d="M13 20l5.5 5.5L27 15"/></svg>`
};

/* ── default data ── */
const DEFAULTS = {
  hero: {
    brand: 'McArthur',
    eye:   'eyebrow',
    tag:   'tagline',
    cta:   'tekst przycisku CTA',
    img:   'Photoroom_20250315_101115.jpeg'
  },
  about: {
    title: 'O marce',
    d1: 'opis marki — akapit 1',
    d2: 'opis marki — akapit 2',
    vals: [
      { ico: 'needle', h: 'tytuł wartości', p: 'opis wartości' },
      { ico: 'leaf',   h: 'tytuł wartości', p: 'opis wartości' },
      { ico: 'shield', h: 'tytuł wartości', p: 'opis wartości' }
    ]
  },
  coll: {
    title: 'Kolekcja',
    items: [
      { id:1, img:'Photoroom_20250315_100958.jpeg',                                                                                                                                                                                                                          name:'nazwa produktu', desc:'opis produktu' },
      { id:2, img:'aHR0cHM6Ly9zdGF0aWMuY29udmVydGlzZXIuY29tL21lZGlhL3Byb2R1Y3RfaW1hZ2VzLzIwNy9mOWYwNWQxMGRkMWNlMWI1OWJhZTBkN2RkYzBjNWYxNS9lNGZjMGY3NzBhYTg4YTU2ZDY5YjIxMGMzM2Y2ODJhY2MxY2Y5MmQ5LmpwZw.jpg', name:'nazwa produktu', desc:'opis produktu' },
      { id:3, img:'Photoroom_20250315_101115.jpeg',                                                                                                                                                                                                                          name:'nazwa produktu', desc:'opis produktu' }
    ]
  },
  cont: {
    title: 'Kontakt',
    addr:  'adres',
    tel:   'numer telefonu',
    mail:  'adres e-mail',
    hrs:   'godziny otwarcia'
  }
};

/* ── persistence ── */
function saveData(d) {
  try { localStorage.setItem('mca_v4', JSON.stringify(d)); } catch(e) {}
}
function loadData() {
  try {
    const s = localStorage.getItem('mca_v4');
    if (!s) return deepCopy(DEFAULTS);
    const d = JSON.parse(s);
    const b = deepCopy(DEFAULTS);
    if (d.hero)  Object.assign(b.hero,  d.hero);
    if (d.about) {
      Object.assign(b.about, d.about);
      if (Array.isArray(d.about.vals)) b.about.vals = d.about.vals;
    }
    if (d.coll) {
      Object.assign(b.coll, d.coll);
      if (Array.isArray(d.coll.items)) b.coll.items = d.coll.items;
    }
    if (d.cont)  Object.assign(b.cont, d.cont);
    return b;
  } catch(e) { return deepCopy(DEFAULTS); }
}
function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

const DATA = loadData();

/* ── helpers ── */
function g(id)    { return document.getElementById(id); }
function esc(s)   { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function set(id,v){ const el=g(id); if(el) el.textContent=v; }
function src(id,v){ const el=g(id); if(el) el.src=v; }
function cnt(n)   { return n+(n===1?' model':n<5?' modele':' modeli'); }

/* ── apply data to DOM ── */
function applyData() {
  const { hero, about, coll, cont } = DATA;
  // brand everywhere
  document.querySelectorAll('[data-brand]').forEach(el => el.textContent = hero.brand);
  // hero (index only)
  set('h-eye', hero.eye); set('h-sub', hero.tag); set('h-cta-lbl', hero.cta); src('h-img', hero.img);
  // about
  set('ab-title', about.title); set('ab-d1', about.d1); set('ab-d2', about.d2);
  renderVals();
  // collection
  set('cl-title', coll.title); renderColl();
  // contact
  set('ct-title', cont.title); set('ct-addr', cont.addr);
  set('ct-tel', cont.tel); set('ct-mail', cont.mail); set('ct-hrs', cont.hrs);
}

function renderVals() {
  const el = g('vals'); if (!el) return;
  el.innerHTML = DATA.about.vals.map(v => `
    <div class="value">
      <div class="value__ico">${ICO[v.ico]||ICO.shield}</div>
      <h3 class="value__h">${esc(v.h)}</h3>
      <p class="value__p">${esc(v.p)}</p>
    </div>`).join('');
}

function renderColl() {
  const el = g('cl-grid'); if (!el) return;
  const lim = el.dataset.limit ? +el.dataset.limit : Infinity;
  const items = DATA.coll.items.slice(0, lim);
  el.innerHTML = items.map(it => `
    <article class="card fi-in">
      <div class="card__img"><img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy"></div>
      <div class="card__body">
        <h3 class="card__name">${esc(it.name)}</h3>
        <p class="card__desc">${esc(it.desc)}</p>
      </div>
    </article>`).join('');
  set('cl-cnt', cnt(DATA.coll.items.length));
  observeFade();
}

/* ── nav ── */
function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const map  = { 'index.html':'home', 'o-marce.html':'omarce', 'kolekcja.html':'kolekcja', 'kontakt.html':'kontakt' };
  const cur  = map[path] || 'home';
  document.querySelectorAll('.nav__list a[data-p]').forEach(a => {
    if (a.dataset.p === cur) a.classList.add('active');
  });

  const ham = g('ham'), mob = g('mob');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const o = ham.classList.toggle('open');
      mob.classList.toggle('open', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open'); mob.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  window.addEventListener('scroll', () => {
    const d = document.documentElement;
    const b = g('bar');
    if (b) b.style.width = (window.scrollY / (d.scrollHeight - d.clientHeight) * 100) + '%';
  }, { passive: true });
}

/* ── fade-in ── */
const fadeIO = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); fadeIO.unobserve(e.target); } });
}, { threshold: .1 });
function observeFade() {
  document.querySelectorAll('.fi-in:not(.vis)').forEach(el => fadeIO.observe(el));
}

/* ══════════════════════════════════════════
   ADMIN PANEL
══════════════════════════════════════════ */
function initAdmin() {
  /* inject panel HTML */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="adm-ov" id="adm-ov"></div>
    <aside class="adm" id="adm">
      <div class="adm__head">
        <span class="adm__title">Panel admina</span>
        <button class="adm__close" id="adm-x" title="Zamknij">
          <svg fill="none" viewBox="0 0 15 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <line x1="2" y1="2" x2="13" y2="13"/><line x1="13" y1="2" x2="2" y2="13"/>
          </svg>
        </button>
      </div>
      <div class="adm__tabs">
        <button class="adm__tab on"  data-tab="hero">Hero</button>
        <button class="adm__tab"     data-tab="about">O marce</button>
        <button class="adm__tab"     data-tab="coll">Kolekcja</button>
        <button class="adm__tab"     data-tab="cont">Kontakt</button>
      </div>
      <div class="adm__body">
        <div class="pane on" id="tab-hero">
          <div class="fg"><label class="fl">Nazwa marki</label><input type="text" class="fi" id="a-brand"></div>
          <div class="fg"><label class="fl">Eyebrow</label><input type="text" class="fi" id="a-eye"></div>
          <div class="fg"><label class="fl">Tagline</label><input type="text" class="fi" id="a-tag"></div>
          <div class="fg"><label class="fl">Tekst przycisku CTA</label><input type="text" class="fi" id="a-cta"></div>
          <div class="fg"><label class="fl">URL zdjęcia hero</label><input type="url" class="fi" id="a-img" placeholder="https://…"></div>
        </div>
        <div class="pane" id="tab-about">
          <div class="fg"><label class="fl">Tytuł sekcji</label><input type="text" class="fi" id="a-ab-title"></div>
          <div class="fg"><label class="fl">Akapit 1</label><textarea class="fi" id="a-ab-d1" rows="4"></textarea></div>
          <div class="fg"><label class="fl">Akapit 2</label><textarea class="fi" id="a-ab-d2" rows="4"></textarea></div>
          <div class="fdiv"></div>
          <div id="a-vals"></div>
        </div>
        <div class="pane" id="tab-coll">
          <div class="fg"><label class="fl">Tytuł sekcji</label><input type="text" class="fi" id="a-cl-title"></div>
          <div class="fdiv"></div>
          <div id="a-cl-items"></div>
          <button class="btn-add" id="a-cl-add">+ Dodaj produkt</button>
        </div>
        <div class="pane" id="tab-cont">
          <div class="fg"><label class="fl">Tytuł sekcji</label><input type="text" class="fi" id="a-ct-title"></div>
          <div class="fg"><label class="fl">Adres</label><textarea class="fi" id="a-ct-addr" rows="3"></textarea></div>
          <div class="fg"><label class="fl">Telefon</label><input type="text" class="fi" id="a-ct-tel"></div>
          <div class="fg"><label class="fl">E-mail</label><input type="email" class="fi" id="a-ct-mail"></div>
          <div class="fg"><label class="fl">Godziny otwarcia</label><textarea class="fi" id="a-ct-hrs" rows="3"></textarea></div>
        </div>
      </div>
    </aside>

  `);

  const panel = g('adm'), ov = g('adm-ov');

  function openAdm()  { panel.classList.add('open'); ov.classList.add('open'); fillAdm(); }
  function closeAdm() { panel.classList.remove('open'); ov.classList.remove('open'); }

  /* triggers */
  /* floating button removed — use Ctrl+Shift+A or triple-click year */
  g('adm-x').addEventListener('click', closeAdm);
  ov.addEventListener('click', closeAdm);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); openAdm(); }
    if (e.key === 'Escape') closeAdm();
  });
  /* triple-click year */
  let yc = 0, yt;
  const yr = g('ft-year');
  if (yr) yr.addEventListener('click', () => {
    yc++; clearTimeout(yt);
    if (yc >= 3) { yc = 0; openAdm(); return; }
    yt = setTimeout(() => yc = 0, 600);
  });

  /* tab switching */
  document.querySelectorAll('.adm__tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.adm__tab').forEach(x => x.classList.remove('on'));
      document.querySelectorAll('.pane').forEach(x => x.classList.remove('on'));
      t.classList.add('on');
      g('tab-' + t.dataset.tab).classList.add('on');
    });
  });

  /* ── hero bindings ── */
  bnd('a-brand', v => { DATA.hero.brand = v; document.querySelectorAll('[data-brand]').forEach(el => el.textContent = v); });
  bnd('a-eye',   v => { DATA.hero.eye = v;   set('h-eye', v); });
  bnd('a-tag',   v => { DATA.hero.tag = v;   set('h-sub', v); });
  bnd('a-cta',   v => { DATA.hero.cta = v;   set('h-cta-lbl', v); });
  bnd('a-img',   v => { DATA.hero.img = v;   src('h-img', v); });
  /* ── about bindings ── */
  bnd('a-ab-title', v => { DATA.about.title = v; set('ab-title', v); });
  bnd('a-ab-d1',    v => { DATA.about.d1    = v; set('ab-d1', v); });
  bnd('a-ab-d2',    v => { DATA.about.d2    = v; set('ab-d2', v); });
  /* ── collection ── */
  bnd('a-cl-title', v => { DATA.coll.title = v; set('cl-title', v); });
  g('a-cl-add').addEventListener('click', () => {
    DATA.coll.items.push({ id: Date.now(), img: '', name: 'Nowy model', desc: '' });
    renderColl(); fillAdmColl(); saveData(DATA);
  });
  /* ── contact bindings ── */
  bnd('a-ct-title', v => { DATA.cont.title = v; set('ct-title', v); });
  bnd('a-ct-addr',  v => { DATA.cont.addr  = v; set('ct-addr', v); });
  bnd('a-ct-tel',   v => { DATA.cont.tel   = v; set('ct-tel', v); });
  bnd('a-ct-mail',  v => { DATA.cont.mail  = v; set('ct-mail', v); });
  bnd('a-ct-hrs',   v => { DATA.cont.hrs   = v; set('ct-hrs', v); });
}

function bnd(id, fn) {
  const el = g(id); if (!el) return;
  el.addEventListener('input', () => { fn(el.value); saveData(DATA); });
}

function fillAdm() {
  const { hero, about, coll, cont } = DATA;
  g('a-brand').value    = hero.brand;
  g('a-eye').value      = hero.eye;
  g('a-tag').value      = hero.tag;
  g('a-cta').value      = hero.cta;
  g('a-img').value      = hero.img;
  g('a-ab-title').value = about.title;
  g('a-ab-d1').value    = about.d1;
  g('a-ab-d2').value    = about.d2;
  fillAdmVals();
  g('a-cl-title').value = coll.title;
  fillAdmColl();
  g('a-ct-title').value = cont.title;
  g('a-ct-addr').value  = cont.addr;
  g('a-ct-tel').value   = cont.tel;
  g('a-ct-mail').value  = cont.mail;
  g('a-ct-hrs').value   = cont.hrs;
}

function fillAdmVals() {
  const c = g('a-vals'); if (!c) return;
  const opts = ['needle', 'leaf', 'shield'];
  c.innerHTML = DATA.about.vals.map((v, i) => `
    <div>
      <p class="fsub">Wartość ${i + 1}</p>
      <div class="fg">
        <label class="fl">Ikona</label>
        <select class="fi" data-vi="${i}">
          ${opts.map(o => `<option${v.ico === o ? ' selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="fg"><label class="fl">Tytuł</label><input type="text" class="fi" data-vt="${i}" value="${esc(v.h)}"></div>
      <div class="fg"><label class="fl">Tekst</label><textarea class="fi" data-vp="${i}" rows="3">${esc(v.p)}</textarea></div>
      ${i < DATA.about.vals.length - 1 ? '<div class="fdiv"></div>' : ''}
    </div>`).join('');

  const reV = () => { renderVals(); saveData(DATA); };
  c.querySelectorAll('[data-vi]').forEach(el => el.addEventListener('change', () => { DATA.about.vals[+el.dataset.vi].ico = el.value; reV(); }));
  c.querySelectorAll('[data-vt]').forEach(el => el.addEventListener('input',  () => { DATA.about.vals[+el.dataset.vt].h   = el.value; reV(); }));
  c.querySelectorAll('[data-vp]').forEach(el => el.addEventListener('input',  () => { DATA.about.vals[+el.dataset.vp].p   = el.value; reV(); }));
}

function fillAdmColl() {
  const c = g('a-cl-items'); if (!c) return;
  c.innerHTML = DATA.coll.items.map((it, i) => `
    <div class="ac">
      <div class="ac__head">
        <span class="ac__num">Produkt ${i + 1}</span>
        <button class="btn-del" data-del="${it.id}">Usuń</button>
      </div>
      <div class="fg"><label class="fl">URL zdjęcia</label><input type="url" class="fi" data-ci="${it.id}" value="${esc(it.img)}" placeholder="https://…"></div>
      <div class="fg"><label class="fl">Nazwa</label><input type="text" class="fi" data-cn="${it.id}" value="${esc(it.name)}"></div>
      <div class="fg"><label class="fl">Opis</label><textarea class="fi" data-cd="${it.id}" rows="2">${esc(it.desc)}</textarea></div>
    </div>`).join('');

  c.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
    DATA.coll.items = DATA.coll.items.filter(x => x.id !== +btn.dataset.del);
    renderColl(); fillAdmColl(); saveData(DATA);
  }));
  c.querySelectorAll('[data-ci]').forEach(el => el.addEventListener('input', () => {
    const it = DATA.coll.items.find(x => x.id === +el.dataset.ci);
    if (it) { it.img  = el.value; renderColl(); saveData(DATA); }
  }));
  c.querySelectorAll('[data-cn]').forEach(el => el.addEventListener('input', () => {
    const it = DATA.coll.items.find(x => x.id === +el.dataset.cn);
    if (it) { it.name = el.value; renderColl(); saveData(DATA); }
  }));
  c.querySelectorAll('[data-cd]').forEach(el => el.addEventListener('input', () => {
    const it = DATA.coll.items.find(x => x.id === +el.dataset.cd);
    if (it) { it.desc = el.value; renderColl(); saveData(DATA); }
  }));
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const yr = g('ft-year');
  if (yr) yr.textContent = new Date().getFullYear();
  initNav();
  applyData();
  initAdmin();
  observeFade();
});
