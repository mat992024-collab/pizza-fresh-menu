document.documentElement.dir = 'rtl';
document.documentElement.lang = 'ar';

const $ = id => document.getElementById(id);
let S = JSON.parse(JSON.stringify(window.MENU_DATA || { s: {}, cats: [], prods: [], areas: [] }));
let CONFIG, CATS, PRODS, AREAS, PBY, AREAS_S;
function deriveData() {
  const s = S.s, w = String(s.whatsapp || '');
  CONFIG = { name: s.name, tagline: s.tagline, slogan: s.slogan, logo: s.logo || '', whatsapp: w, whatsappDisplay: w.startsWith('20') ? '0' + w.slice(2) : w, payNumber: s.payNumber || '', currency: 'ج.م' };
  CATS = S.cats; PRODS = S.prods.filter(p => !p[4]); AREAS = S.areas;
  PBY = new Map(PRODS.map(p => [p[0], p]));
  AREAS_S = AREAS.slice().sort((x, y) => x[0].localeCompare(y[0], 'ar'));
}
deriveData();

/* ===== أدوات ===== */
const fmt = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const latin = s => String(s).replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d));
const norm = s => latin(s).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
const store = {
  get(k) { try { return localStorage.getItem('qrmenu.' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('qrmenu.' + k, v); } catch (e) { } }
};

/* ===== رسومات الأصناف ===== */
const ICONS = {
  pizza: '<circle cx="32" cy="32" r="28" fill="#d99a3d"/><circle cx="32" cy="32" r="24" fill="#d8402f"/><circle cx="32" cy="32" r="21" fill="#f5cf6b"/><circle cx="24" cy="25" r="4.5" fill="#b3261e"/><circle cx="40" cy="27" r="4.5" fill="#b3261e"/><circle cx="30" cy="40" r="4.5" fill="#b3261e"/><circle cx="43" cy="40" r="3" fill="#b3261e"/><circle cx="20" cy="37" r="2.5" fill="#5f8f3a"/><circle cx="36" cy="17" r="2.5" fill="#5f8f3a"/><path d="M32 11v42M13.800 21.500l36.400 21M50.200 21.500l-36.400 21" stroke="#c98a2f" stroke-width="1.200" opacity=".55"/>',
  pie: '<rect x="8" y="8" width="48" height="48" rx="10" fill="#d49a3f"/><rect x="12" y="12" width="40" height="40" rx="7" fill="#efc46c"/><path d="M12 12 52 52M52 12 12 52" stroke="#c4862b" stroke-width="1.800" stroke-linecap="round" opacity=".5"/><circle cx="32" cy="32" r="5" fill="#d49a3f"/><circle cx="20" cy="32" r="1.500" fill="#fff4d6"/><circle cx="44" cy="32" r="1.500" fill="#fff4d6"/><circle cx="32" cy="20" r="1.500" fill="#fff4d6"/><circle cx="32" cy="44" r="1.500" fill="#fff4d6"/>',
  pieSweet: '<rect x="8" y="8" width="48" height="48" rx="10" fill="#d49a3f"/><rect x="12" y="12" width="40" height="40" rx="7" fill="#efc46c"/><path d="M15 24c7-6 11 6 18 0s10 6 16 1M15 38c7-6 11 6 18 0s10 6 16 1" stroke="#5a3425" stroke-width="3.200" fill="none" stroke-linecap="round"/><circle cx="20" cy="17" r="1.600" fill="#fff"/><circle cx="34" cy="46" r="1.600" fill="#fff"/><circle cx="47" cy="19" r="1.600" fill="#fff"/>',
  crepe: '<path d="M7 47 32 9l25 38Z" fill="#efc27a" stroke="#c4862b" stroke-width="2.200" stroke-linejoin="round"/><path d="M32 9v38M19 28l13 19M45 28 32 47" stroke="#c4862b" stroke-width="1.600" opacity=".55"/><path d="M24 30l8 17 8-17Z" fill="#f7dd8a"/><circle cx="32" cy="38" r="2" fill="#5f8f3a"/><circle cx="28" cy="33" r="1.600" fill="#5f8f3a"/>',
  crepeSweet: '<path d="M7 47 32 9l25 38Z" fill="#efc27a" stroke="#c4862b" stroke-width="2.200" stroke-linejoin="round"/><path d="M18 36c5-5 8 5 14 0s8 5 14 0M24 24c4-4 6 4 8 0s4 3 6 0" stroke="#5a3425" stroke-width="3.200" fill="none" stroke-linecap="round"/>',
  pasta: '<path d="M7 33h50c0 14-10 24-25 24S7 47 7 33Z" fill="#f4f1ee" stroke="#c4bdb6" stroke-width="2"/><path d="M13 31c4-10 8 4 12-5s8 5 12-4 8 5 13-1M16 26c3-8 7 3 11-4s7 4 11-3" stroke="#efbf45" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="38" cy="22" r="3" fill="#5f8f3a"/>',
  pastaRed: '<path d="M7 33h50c0 14-10 24-25 24S7 47 7 33Z" fill="#f4f1ee" stroke="#c4bdb6" stroke-width="2"/><path d="M13 31c4-10 8 4 12-5s8 5 12-4 8 5 13-1" stroke="#efbf45" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M19 28c4-9 22-9 26 0-4 4-22 4-26 0Z" fill="#c9372c"/><circle cx="32" cy="22" r="2.800" fill="#5f8f3a"/>',
  extra: '<circle cx="32" cy="32" r="26" fill="#f4f1ee" stroke="#c4bdb6" stroke-width="2"/><circle cx="32" cy="32" r="17" fill="none" stroke="#e3ddd6" stroke-width="2"/><circle cx="32" cy="32" r="9" fill="#f5cf6b"/><circle cx="29" cy="29" r="2.500" fill="#fbe8a6"/>',
  plate: '<circle cx="32" cy="32" r="26" fill="#f4f1ee" stroke="#c4bdb6" stroke-width="2"/><circle cx="32" cy="32" r="16" fill="none" stroke="#e3ddd6" stroke-width="2"/><path d="M14 8v18M10 8v10a4 4 0 0 0 8 0V8M50 8c-5 4-5 14 0 18v28" stroke="#8b94a3" stroke-width="2.200" fill="none" stroke-linecap="round" transform="translate(0 0) scale(.9) translate(3 3)"/>',
  can: '<rect x="19" y="8" width="26" height="48" rx="7" fill="#1f5fbf"/><rect x="19" y="8" width="26" height="8" rx="4" fill="#cfd6df"/><rect x="19" y="48" width="26" height="8" rx="4" fill="#cfd6df"/><path d="M19 28c9-7 17 7 26 0v12c-9 7-17-7-26 0Z" fill="#e8eef9"/>'
};
const CAT_ICON = { 1: 'pizza', 2: 'pie', 3: 'pieSweet', 4: 'crepe', 5: 'crepeSweet', 6: 'pasta', 7: 'extra', 8: 'plate', 9: 'pastaRed' };
function iconFor(p) {
  let k = CAT_ICON[p[3]] || 'extra';
  if (p[3] === 7 && /بيبسي|مياه|لتر/.test(p[1])) k = 'can';
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ICONS[k] + '</svg>';
}

/* ===== الحالة ===== */
const cart = new Map();
let mode = 'delivery';

const qtyOf = id => cart.get(id) || 0;
const itemsTotal = () => { let t = 0; cart.forEach((q, id) => t += q * PBY.get(id)[2]); return t; };
const itemsCount = () => { let c = 0; cart.forEach(q => c += q); return c; };
const areaFee = () => { const v = $('f-area').value; return v === '' ? null : AREAS_S[+v][1]; };

/* ===== الواجهة الرئيسية ===== */
function initBrand() {
  $('store-name').textContent = CONFIG.name;
  $('tagline').textContent = CONFIG.tagline;
  const logo = $('logo');
  logo.textContent = ''; logo.classList.toggle('has-img', !!CONFIG.logo);
  if (CONFIG.logo) { const i = document.createElement('img'); i.src = CONFIG.logo; i.alt = CONFIG.name; logo.appendChild(i); }
  else logo.textContent = [...CONFIG.name.replace(/^(مطعم|محل|كافيه)\s+/, '')][0] || 'م';
  const minFee = AREAS.length ? Math.min(...AREAS.map(a => a[1])) : 0;
  $('facts').innerHTML =
    '<li>توصيل إلى <b class="num">' + AREAS.length + '</b> منطقة</li>' +
    '<li>التوصيل يبدأ من <b class="num">' + minFee + '</b> ' + CONFIG.currency + '</li>' +
    '<li>الطلب عبر واتساب <b class="num" style="direction:ltr;unicode-bidi:isolate">' + CONFIG.whatsappDisplay + '</b></li>';
  $('wa-float').href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('السلام عليكم، أريد الاستفسار');
}

function controlHTML(id) {
  const q = qtyOf(id);
  if (!q) return '<button class="add" type="button" data-act="add" data-id="' + id + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M8 2v12M2 8h12"/></svg>أضف للسلة</button>';
  return '<div class="step"><button type="button" data-act="inc" data-id="' + id + '" aria-label="زيادة الكمية">+</button><output aria-live="polite">' + q + '</output><button type="button" data-act="dec" data-id="' + id + '" aria-label="تقليل الكمية">−</button></div>';
}

function renderMenu() {
  const chips = $('chips'), menu = $('menu');
  let ch = '<button class="chip" type="button" data-cat="all">الكل</button>', html = '';
  CATS.forEach(c => {
    const list = PRODS.filter(p => p[3] === c[0]);
    if (!list.length) return;
    ch += '<button class="chip" type="button" data-cat="' + c[0] + '">' + esc(c[1]) + '</button>';
    html += '<section class="cat" id="cat-' + c[0] + '" data-cat="' + c[0] + '"><h2>' + esc(c[1]) + ' <small class="num">' + list.length + ' صنف</small></h2><div class="grid">' +
      list.map(p => '<article class="card" data-id="' + p[0] + '" data-s="' + esc(norm(p[1])) + '"><div class="thumb">' + iconFor(p) + '</div><h3>' + esc(p[1]) + '</h3>' +
        '<div class="row"><span class="price">' + fmt(p[2]) + '<small>' + CONFIG.currency + '</small></span><span data-ctl="' + p[0] + '">' + controlHTML(p[0]) + '</span></div></article>').join('') +
      '</div></section>';
  });
  chips.innerHTML = ch; menu.innerHTML = html;
  chips.firstElementChild && chips.firstElementChild.setAttribute('aria-current', 'true');
  measureBar();
}

function measureBar() { document.documentElement.style.setProperty('--bar-h', $('bar').offsetHeight + 'px'); }

function setActive(catId) {
  $('chips').querySelectorAll('.chip').forEach(b => {
    const on = b.dataset.cat === String(catId);
    if (on) { b.setAttribute('aria-current', 'true'); const box = $('chips'); const target = b.offsetLeft - box.clientWidth / 2 + b.clientWidth / 2; box.scrollTo({ left: target, behavior: 'smooth' }); }
    else b.removeAttribute('aria-current');
  });
}

function startSpy() {}
let curCat = 'all';

function applySearch() {
  const q = norm($('q').value);
  let any = false;
  document.querySelectorAll('section.cat').forEach(sec => {
    let shown = 0;
    const inCat = curCat === 'all' || sec.dataset.cat === curCat;
    sec.querySelectorAll('.card').forEach(card => { const ok = inCat && (!q || card.dataset.s.includes(q)); card.hidden = !ok; if (ok) shown++; });
    sec.hidden = shown === 0; if (shown) any = true;
  });
  $('none').hidden = any;
}

/* ===== السلة ===== */
function setQty(id, q) {
  q = Math.max(0, Math.min(99, q));
  if (q) cart.set(id, q); else cart.delete(id);
  const ctl = document.querySelector('[data-ctl="' + id + '"]');
  if (ctl) {
    const had = ctl.contains(document.activeElement);
    ctl.innerHTML = controlHTML(id);
    if (had) { const b = ctl.querySelector('button'); b && b.focus({ preventScroll: true }); }
  }
  updateBar();
  if (!$('scrim').hidden) { renderCartItems(); renderSummary(); }
}

function updateBar() {
  const c = itemsCount();
  $('cartbar').hidden = c === 0 || !$('scrim').hidden;
  $('cb-count').textContent = c;
  $('cb-total').textContent = fmt(itemsTotal());
  $('wa-float').classList.toggle('up', !$('cartbar').hidden);
}

function renderCartItems() {
  const box = $('cart-items');
  if (!cart.size) { box.innerHTML = '<p class="note" style="margin:0">السلة فارغة. أضف صنفاً من القائمة.</p>'; return; }
  let h = '<h3>الأصناف</h3>';
  cart.forEach((q, id) => {
    const p = PBY.get(id);
    h += '<div class="line"><div><div class="n">' + esc(p[1]) + '</div><div class="s">' + q + ' × ' + fmt(p[2]) + ' = ' + fmt(q * p[2]) + ' ' + CONFIG.currency + '</div></div>' +
      '<div class="step"><button type="button" data-act="inc" data-id="' + id + '" aria-label="زيادة الكمية">+</button><output>' + q + '</output><button type="button" data-act="dec" data-id="' + id + '" aria-label="تقليل الكمية">−</button></div></div>';
  });
  box.innerHTML = h;
}

function renderSummary() {
  const items = itemsTotal();
  $('s-items').textContent = fmt(items);
  let fee = 0;
  if (mode === 'delivery') {
    const f = areaFee();
    $('s-fee-label').textContent = 'مصاريف التوصيل' + (f === null ? '' : ' (' + AREAS_S[+$('f-area').value][0] + ')');
    $('s-fee').textContent = f === null ? 'اختر المنطقة' : fmt(f) + ' ' + CONFIG.currency;
    fee = f || 0;
  } else {
    $('s-fee-label').textContent = 'مصاريف التوصيل';
    $('s-fee').textContent = 'استلام من المحل: 0 ' + CONFIG.currency;
  }
  $('s-total').textContent = fmt(items + fee);
}

/* ===== نافذة السلة ===== */
let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  $('scrim').hidden = false; $('cartbar').hidden = true;
  document.documentElement.style.overflow = 'hidden';
  renderCartItems(); renderSummary(); $('after').hidden = true; hideError();
  $('close-cart').focus({ preventScroll: true });
}
function closeCart() {
  $('scrim').hidden = true; document.documentElement.style.overflow = '';
  updateBar(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}

function setMode(m) {
  mode = m;
  $('delivery-fields').hidden = m !== 'delivery';
  $('pay-cash-label').textContent = m === 'delivery' ? 'نقدي عند التوصيل' : 'نقدي عند الاستلام';
  renderSummary();
}
function payMethod() { return document.querySelector('input[name="pay"]:checked').value; }
function updatePay() { $('proof').hidden = payMethod() === 'cash'; }

function showError(id, msg) {
  const e = $('f-error'); e.textContent = msg; e.hidden = false;
  document.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
  const el = $(id); if (el) { if (el.matches('input,textarea,select')) el.setAttribute('aria-invalid', 'true'); el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}
function hideError() { $('f-error').hidden = true; document.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid')); }

const normPhone = s => { let d = latin(s).replace(/\D/g, ''); if (d.startsWith('0020')) d = d.slice(4); else if (d.startsWith('20') && d.length === 12) d = d.slice(2); if (d.length === 10 && d[0] === '1') d = '0' + d; return d; };

function validate() {
  if (!cart.size) return { id: 'cart-items', msg: 'السلة فارغة. أضف صنفاً واحداً على الأقل.' };
  if ($('f-name').value.trim().length < 2) return { id: 'f-name', msg: 'اكتب اسمك.' };
  if (!/^01[0125]\d{8}$/.test(normPhone($('f-phone').value))) return { id: 'f-phone', msg: 'اكتب رقم موبايل مصري صحيح من 11 رقماً.' };
  if (mode === 'delivery') {
    if (!$('f-address').value.trim()) return { id: 'f-address', msg: 'اكتب عنوان التوصيل.' };
    if ($('f-area').value === '') return { id: 'f-area', msg: 'اختر منطقة التوصيل.' };
  }
  return null;
}

/* ===== الفاتورة ===== */
const p2 = n => String(n).padStart(2, '0');
let lastSig = '', lastInv = '', memSeq = 0;
function invoiceNo(sig) {
  if (sig === lastSig && lastInv) return lastInv;
  const n = Math.max(parseInt(store.get('invSeq') || '0', 10) || 0, memSeq) + 1;
  memSeq = n; store.set('invSeq', String(n));
  lastSig = sig; lastInv = 'inv-' + n;
  return lastInv;
}

function buildMessage() {
  const d = new Date();
  const date = p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear();
  const h = d.getHours(), h12 = h % 12 || 12;
  const time = p2(h12) + ':' + p2(d.getMinutes()) + ' ' + (h < 12 ? 'ص' : 'م');
  const cur = CONFIG.currency;
  const sig = JSON.stringify([...cart]) + mode + $('f-area').value + $('f-name').value + $('f-phone').value;
  const inv = invoiceNo(sig);
  const items = itemsTotal();
  const fee = mode === 'delivery' ? (areaFee() || 0) : 0;
  const pay = { cash: mode === 'delivery' ? 'نقدي عند التوصيل' : 'نقدي عند الاستلام', wallet: 'محفظة إلكترونية', insta: 'إنستا باي' }[payMethod()];
  const bar = '━━━━━━━━━━━━━━';
  const L = [];
  L.push('*' + CONFIG.name + '*');
  L.push(bar);
  L.push('التاريخ: ' + date);
  L.push('الوقت: ' + time);
  L.push('رقم الفاتورة: ' + inv);
  L.push(bar);
  L.push('*بيانات العميل*');
  L.push('الاسم: ' + $('f-name').value.trim());
  if (mode === 'delivery') {
    L.push('العنوان: ' + $('f-address').value.trim().replace(/\s*\n\s*/g, ' - '));
    L.push('منطقة التوصيل: ' + AREAS_S[+$('f-area').value][0]);
  } else {
    L.push('نوع الطلب: استلام من المحل');
  }
  L.push('رقم التليفون: ' + normPhone($('f-phone').value));
  L.push('طريقة الدفع: ' + pay + (payMethod() !== 'cash' && $('f-proof').files.length ? ' (صورة التحويل ستُرسل في المحادثة)' : ''));
  const notes = $('f-notes').value.trim().replace(/\s*\n\s*/g, ' - ');
  if (notes) L.push('ملاحظات: ' + notes);
  L.push(bar);
  L.push('*الأصناف*');
  let i = 0;
  cart.forEach((q, id) => { const p = PBY.get(id); i++; L.push(i + '- ' + p[1] + ' × ' + q + ' = ' + fmt(q * p[2]) + ' ' + cur); });
  L.push(bar);
  L.push('إجمالي الأصناف: ' + fmt(items) + ' ' + cur);
  L.push(mode === 'delivery' ? 'سعر التوصيل: ' + fmt(fee) + ' ' + cur : 'سعر التوصيل: 0 ' + cur + ' (استلام من المحل)');
  L.push('*الإجمالي: ' + fmt(items + fee) + ' ' + cur + '*');
  L.push(bar);
  L.push(CONFIG.slogan);
  return L.join('\n');
}

/* ===== الأحداث ===== */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b) {
    const id = +b.dataset.id, q = qtyOf(id);
    setQty(id, b.dataset.act === 'dec' ? q - 1 : q + 1);
    return;
  }
  const chip = e.target.closest('.chip');
  if (chip) {
    curCat = chip.dataset.cat; setActive(curCat); applySearch();
    const m = $('menu'); if (m.getBoundingClientRect().top < $('bar').offsetHeight) m.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
$('q').addEventListener('input', applySearch);
$('open-cart').addEventListener('click', openCart);
$('close-cart').addEventListener('click', closeCart);
$('scrim').addEventListener('click', e => { if (e.target === $('scrim')) closeCart(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('scrim').hidden) closeCart(); });
document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', () => { setMode(r.value); hideError(); }));
document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener('change', () => { updatePay(); store.set('pay', payMethod()); }));
$('f-area').addEventListener('change', () => { renderSummary(); hideError(); store.set('area', AREAS_S[+$('f-area').value] ? AREAS_S[+$('f-area').value][0] : ''); });
['f-name', 'f-phone', 'f-address'].forEach(id => $(id).addEventListener('input', () => { hideError(); store.set(id, $(id).value); }));

$('f-proof').addEventListener('change', () => {
  const f = $('f-proof').files[0];
  if (!f) { $('preview').hidden = true; return; }
  const old = $('preview-img').src; if (old.startsWith('blob:')) URL.revokeObjectURL(old);
  $('preview-img').src = URL.createObjectURL(f);
  $('preview-name').textContent = f.name;
  $('preview').hidden = false;
});
$('remove-proof').addEventListener('click', () => { $('f-proof').value = ''; $('preview').hidden = true; });

async function copyText(text, fallbackEl) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (err) { if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.value = text; fallbackEl.focus(); fallbackEl.select(); } return false; }
}
$('copy-num').addEventListener('click', async e => { const ok = await copyText(CONFIG.payNumber); e.target.textContent = ok ? 'تم النسخ' : 'انسخ الرقم يدوياً'; setTimeout(() => e.target.textContent = 'نسخ الرقم', 1800); });
$('copy-msg').addEventListener('click', async e => { const ok = await copyText(buildMessage(), $('f-copy')); e.target.textContent = ok ? 'تم نسخ الفاتورة' : 'نص الفاتورة ظاهر بالأسفل'; });

$('send').addEventListener('click', e => {
  const v = validate();
  if (v) { e.preventDefault(); showError(v.id, v.msg); return; }
  hideError();
  const msg = buildMessage();
  $('send').href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  $('after').hidden = false; $('f-copy').hidden = true; $('copy-msg').textContent = 'نسخ نص الفاتورة';
});

/* ===== البدء ===== */
function init() {
  refreshAll();
  ['f-name', 'f-phone', 'f-address'].forEach(id => { const v = store.get(id); if (v) $(id).value = v; });
  const a = store.get('area'); if (a) { const i = AREAS_S.findIndex(x => x[0] === a); if (i >= 0) $('f-area').value = String(i); }
  const pm = store.get('pay'); if (pm) { const r = document.querySelector('input[name="pay"][value="' + pm + '"]'); if (r) { r.checked = true; } }
  setMode('delivery'); updatePay(); updateBar(); startSpy();
  window.addEventListener('resize', () => { measureBar(); startSpy(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureBar(); startSpy(); });
}
/* ===== الإدارة والنشر ===== */
let dirty = false, busy = false, adminTab = 'settings', pendingDel = null, prodFilter = 'all', prodQ = '', showNewProd = false;

const adminOn = () => { try { return sessionStorage.getItem('qrmenu.admin') === '1'; } catch (e) { return false; } };
function syncAdminBar() { $('admin-bar').hidden = !adminOn(); $('admin-dirty').hidden = !dirty; }
function setAdminOn(v) { try { if (v) sessionStorage.setItem('qrmenu.admin', '1'); else sessionStorage.removeItem('qrmenu.admin'); } catch (e) { } syncAdminBar(); }
const lock = on => { document.documentElement.style.overflow = on ? 'hidden' : ''; };
const nextId = list => list.reduce((m, x) => Math.max(m, x[0]), 0) + 1;
function updatePub() {
  $('adm-publish').disabled = !dirty || busy;
  const el = $('adm-status'); el.className = 'note';
  el.textContent = busy ? 'جارٍ النشر…' : dirty ? 'توجد تعديلات غير منشورة.' : 'لا توجد تعديلات.';
}
function say(msg, ok) { const el = $('adm-status'); el.textContent = msg; el.className = ok ? 'okmsg' : 'note'; clearTimeout(say.t); say.t = setTimeout(updatePub, 4000); }
function markDirty() { dirty = true; updatePub(); syncAdminBar(); }

/* ----- الألوان من الشعار ----- */
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
function lum(h) { const [r, g, b] = hex2rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; }
const mixHex = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * t)); };
function applyTheme() {
  const a = S.s.accent || '#c42d25';
  const inkL = lum(a) > .45 ? '#1b1b1b' : '#ffffff';
  const ad = lum(a) < .3 ? mixHex(a, '#ffffff', .12) : mixHex(a, '#ffffff', .1);
  const inkD = lum(ad) > .45 ? '#14110f' : '#ffffff';
  let st = $('app-theme');
  if (!st) { st = document.createElement('style'); st.id = 'app-theme'; document.body.appendChild(st); }
  st.textContent = ':root{--accent:' + a + ';--accent-ink:' + inkL + '}' +
    '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--accent:' + ad + ';--accent-ink:' + inkD + '}}' +
    ':root[data-theme="dark"]{--accent:' + ad + ';--accent-ink:' + inkD + '}';
}
function dominantColor(ctx, w, h) {
  const d = ctx.getImageData(0, 0, w, h).data, B = 12;
  const bins = Array.from({ length: B }, () => ({ w: 0, n: 0, r: 0, g: 0, b: 0 }));
  const step = Math.max(1, Math.floor(d.length / 4 / 8000)) * 4;
  for (let i = 0; i < d.length; i += step) {
    if (d[i + 3] < 128) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn;
    if (!dl) continue;
    const l = (mx + mn) / 510, s = dl / (255 - Math.abs(mx + mn - 255));
    if (s < .3 || l > .88 || l < .14) continue;
    const hh = mx === r ? ((g - b) / dl + 6) % 6 : mx === g ? (b - r) / dl + 2 : (r - g) / dl + 4;
    const k = Math.min(B - 1, Math.floor(hh / 6 * B)), bn = bins[k];
    bn.w += s; bn.n++; bn.r += r; bn.g += g; bn.b += b;
  }
  let best = null; bins.forEach(b => { if (b.n && (!best || b.w > best.w)) best = b; });
  return best ? rgb2hex([best.r / best.n, best.g / best.n, best.b / best.n]) : null;
}
function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
async function drawToCanvas(src, max) {
  const img = await loadImage(src);
  const k = Math.min(1, max / Math.max(img.width, img.height)), w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h);
  return { c, x, w, h };
}
async function onLogo(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  try {
    const { c, x, w, h } = await drawToCanvas(url, 360);
    S.s.logo = c.toDataURL('image/png');
    const col = dominantColor(x, w, h);
    if (col) { S.s.accent = col; say('تم رفع الشعار وأخذ اللون الأساسي منه. يمكنك تعديل اللون.', true); } else say('تم رفع الشعار. لم أجد لوناً واضحاً فيه، اختر اللون يدوياً.', false);
    applyTheme(); markDirty(); renderTab();
  } catch (e) { say('تعذر قراءة الصورة. جرّب ملف PNG أو JPG.', false); }
  URL.revokeObjectURL(url);
}
async function colorFromLogo() {
  if (!S.s.logo) return;
  try {
    const { x, w, h } = await drawToCanvas(S.s.logo, 360);
    const col = dominantColor(x, w, h);
    if (!col) return say('لم أجد لوناً واضحاً في الشعار.', false);
    S.s.accent = col; applyTheme(); markDirty(); renderTab(); say('تم أخذ اللون من الشعار.', true);
  } catch (e) { say('تعذر تحليل الشعار.', false); }
}

/* ----- الدخول ----- */
async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s.trim().toLowerCase()));
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}
function loginErr(m) { const e = $('adm-login-err'); e.textContent = m; e.hidden = !m; }
function openLogin() { loginErr(''); $('adm-login').hidden = false; lock(true); $('adm-email').focus(); }
function closeLogin() { $('adm-login').hidden = true; lock(!$('admin').hidden || !$('scrim').hidden); }
async function loginGo() {
  loginErr('');
  const email = $('adm-email').value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return loginErr('اكتب إيميل صحيح.');
  let h;
  try { h = await sha(email); } catch (e) { return loginErr('هذا المتصفح لا يدعم التحقق من الإيميل.'); }
  let first = false;
  if (S.s.adminHash) {
    if (h !== S.s.adminHash) return loginErr('هذا الإيميل غير مسجل كمدير.');
  } else {
    S.s.adminHash = h; first = true; markDirty();
  }
  closeLogin(); setAdminOn(true); openAdmin();
  if (first) say('تم تسجيل إيميل المدير. اضغط نشر التعديلات لحفظه.', true);
}
async function onMail(v) {
  v = v.trim(); if (!v) return;
  if (!/^\S+@\S+\.\S+$/.test(v)) return say('الإيميل غير صحيح.', false);
  try { S.s.adminHash = await sha(v); markDirty(); say('تم تغيير إيميل المدير. اضغط نشر التعديلات.', true); renderTab(); } catch (e) { say('تعذر حفظ الإيميل في هذا المتصفح.', false); }
}

/* ----- اللوحة ----- */
function openAdmin() { $('admin').hidden = false; lock(true); renderTab(); updatePub(); $('adm-close').focus({ preventScroll: true }); }
function closeAdmin() { $('admin').hidden = true; lock(!$('scrim').hidden); pendingDel = null; refreshAll(); }

function fld(label, key, val, type) {
  return '<div class="field"><label for="adm-s-' + key + '">' + label + '</label><input id="adm-s-' + key + '" data-s="' + key + '" type="' + (type || 'text') + '" value="' + esc(val || '') + '"></div>';
}
function catOpts(sel, withAll) {
  return (withAll ? '<option value="all"' + (sel === 'all' ? ' selected' : '') + '>كل الأقسام</option>' : '') +
    S.cats.map(c => '<option value="' + c[0] + '"' + (String(sel) === String(c[0]) ? ' selected' : '') + '>' + esc(c[1]) + '</option>').join('');
}
function delBtns(kind, key, ask, extra) {
  return ask
    ? (extra || '') + '<button class="mini danger" data-a="' + kind + '-del-ok" data-id="' + key + '" type="button">تأكيد الحذف</button><button class="mini" data-a="del-no" type="button">إلغاء</button>'
    : '<button class="mini danger" data-a="' + kind + '-del" data-id="' + key + '" type="button">حذف</button>';
}

function ghPanel() {
  const g = ghDefaults();
  const f = (k, label, type, ph) => '<div class="field"><label for="adm-gh-' + k + '">' + label + '</label><input id="adm-gh-' + k + '" data-gh="' + k + '" type="' + type + '" dir="ltr" autocomplete="off" placeholder="' + (ph || '') + '" value="' + esc(g[k] || '') + '"></div>';
  return '<div class="panel"><h3>النشر على GitHub</h3><p class="note" style="margin-top:0">زر "نشر التعديلات" يحفظ البيانات في ملف data/menu.js داخل المستودع. تُحفظ هذه البيانات في هذا المتصفح فقط.</p>' +
    f('owner', 'اسم المالك (username)', 'text', 'my-user') + f('repo', 'اسم المستودع', 'text', 'pizza-fresh-menu') + f('branch', 'الفرع', 'text', 'main') + f('token', 'الرمز (Fine-grained token بصلاحية Contents: Read and write)', 'password', 'github_pat_...') +
    '<div class="acts"><button class="mini" data-a="gh-dl" type="button">تنزيل menu.js (رفع يدوي)</button></div></div>';
}
function tabSettings() {
  const s = S.s, wa = '0' + String(s.whatsapp).replace(/^20/, '');
  return '<div class="panel"><h3>بيانات المحل</h3>' + fld('اسم المحل', 'name', s.name) + fld('الوصف تحت الاسم', 'tagline', s.tagline) + fld('الجملة في آخر الفاتورة', 'slogan', s.slogan) + '</div>' +
    '<div class="panel"><h3>واتساب والدفع</h3>' + fld('رقم واتساب الكاشير (يستقبل الطلبات)', 'whatsapp', wa, 'tel') + fld('رقم التحويل (محفظة / إنستا باي)', 'payNumber', s.payNumber, 'tel') + '</div>' +
    '<div class="panel"><h3>الشعار والألوان</h3><div class="acts">' +
    '<div class="logo-prev">' + (s.logo ? '<img src="' + s.logo + '" alt="الشعار">' : '<span class="note">لا يوجد</span>') + '</div>' +
    '<div class="field" style="flex:1;min-width:180px"><label for="adm-logo">رفع الشعار</label><input id="adm-logo" type="file" accept="image/*"></div>' +
    (s.logo ? '<button class="mini danger" data-a="logo-del" type="button">حذف الشعار</button>' : '') + '</div>' +
    '<div class="acts" style="margin-top:12px"><label for="adm-accent" class="lbl">اللون الأساسي</label><input class="swatch" id="adm-accent" type="color" value="' + esc(s.accent) + '">' +
    '<button class="mini" data-a="logo-color" type="button"' + (s.logo ? '' : ' disabled') + '>استخراج اللون من الشعار</button></div></div>' +
    ghPanel() +
    '<div class="panel"><h3>دخول المدير</h3><p class="note" style="margin-top:0">' + (s.adminHash ? 'إيميل المدير مسجل.' : 'لم يُسجَّل إيميل بعد.') + ' لتغييره اكتب الإيميل الجديد ثم انشر التعديلات. هذا الإيميل لا يمنع أحداً من فتح لوحة الإدارة، والحماية الفعلية هي رمز GitHub الذي لا يملكه إلا أنت.</p>' +
    '<div class="field"><label for="adm-mail">إيميل المدير الجديد</label><input id="adm-mail" type="text" inputmode="email" dir="ltr"></div></div>';
}
function tabCats() {
  const rows = S.cats.map((c, i) => {
    const n = S.prods.filter(p => p[3] === c[0]).length, ask = pendingDel === 'c' + c[0];
    return '<div class="arow"><div class="r2"><input class="in" data-cn="' + i + '" value="' + esc(c[1]) + '" aria-label="اسم القسم"><span class="cnt num">' + n + ' صنف</span></div><div class="acts">' +
      '<button class="mini" data-a="cat-up" data-i="' + i + '" type="button"' + (i === 0 ? ' disabled' : '') + '>↑ أعلى</button>' +
      '<button class="mini" data-a="cat-down" data-i="' + i + '" type="button"' + (i === S.cats.length - 1 ? ' disabled' : '') + '>↓ أسفل</button>' +
      delBtns('cat', c[0], ask, '<span class="note">سيُحذف القسم و' + n + ' صنف.</span>') + '</div></div>';
  }).join('');
  return '<div class="panel"><h3>الأقسام</h3>' + (rows || '<p class="note">لا توجد أقسام.</p>') +
    '<div class="r2" style="margin-top:10px"><input class="in" id="adm-newcat" placeholder="اسم قسم جديد" aria-label="اسم قسم جديد"><button class="primary" data-a="cat-add" type="button">إضافة</button></div></div>';
}
function tabProds() {
  return '<div class="panel"><div class="r2"><select class="in" id="adm-pf" aria-label="تصفية بالقسم">' + catOpts(prodFilter, true) + '</select><button class="mini" data-a="prod-new" type="button">+ صنف جديد</button></div>' +
    '<input class="in" id="adm-pq" placeholder="بحث في الأصناف" aria-label="بحث في الأصناف" value="' + esc(prodQ) + '" style="margin-top:8px"></div><div id="adm-plist"></div>';
}
function renderProdList() {
  const box = $('adm-plist'); if (!box) return;
  const q = norm(prodQ);
  const list = S.prods.filter(p => (prodFilter === 'all' || String(p[3]) === String(prodFilter)) && (!q || norm(p[1]).includes(q)));
  let h = '';
  if (showNewProd) {
    h += '<div class="arow"><input class="in" id="adm-np-name" placeholder="اسم الصنف" aria-label="اسم الصنف الجديد"><div class="r3"><input class="in" id="adm-np-price" type="number" inputmode="decimal" min="0" step="any" placeholder="السعر" aria-label="سعر الصنف الجديد"><select class="in" id="adm-np-cat" aria-label="قسم الصنف الجديد">' +
      catOpts(prodFilter === 'all' ? (S.cats[0] || [''])[0] : prodFilter) + '</select></div><div class="acts"><button class="primary" data-a="prod-add" type="button">إضافة الصنف</button><button class="mini" data-a="prod-new-x" type="button">إلغاء</button></div></div>';
  }
  h += '<p class="note">عرض ' + list.length + ' من ' + S.prods.length + ' صنف</p>';
  h += list.map(p => '<div class="arow" data-pid="' + p[0] + '"><input class="in" data-p="name" value="' + esc(p[1]) + '" aria-label="اسم الصنف">' +
    '<div class="r3"><input class="in" data-p="price" type="number" inputmode="decimal" min="0" step="any" value="' + p[2] + '" aria-label="السعر"><select class="in" data-p="cat" aria-label="القسم">' + catOpts(p[3]) + '</select></div>' +
    '<div class="acts"><label class="tg"><input type="checkbox" data-p="hidden"' + (p[4] ? ' checked' : '') + '> مخفي عن الزبائن</label>' + delBtns('prod', p[0], pendingDel === 'p' + p[0]) + '</div></div>').join('');
  box.innerHTML = h;
}
function tabAreas() {
  const rows = S.areas.map((a, i) => '<div class="arow"><div class="r3"><input class="in" data-an="' + i + '" value="' + esc(a[0]) + '" aria-label="اسم المنطقة"><input class="in" data-af="' + i + '" type="number" inputmode="decimal" min="0" step="any" value="' + a[1] + '" aria-label="رسوم التوصيل"></div><div class="acts">' + delBtns('area', i, pendingDel === 'a' + i) + '</div></div>').join('');
  return '<div class="panel"><h3>مناطق التوصيل</h3><p class="note" style="margin-top:0">الاسم ثم رسوم التوصيل بالجنيه.</p>' + rows +
    '<div class="r3" style="margin-top:10px"><input class="in" id="adm-na-name" placeholder="منطقة جديدة" aria-label="اسم منطقة جديدة"><input class="in" id="adm-na-fee" type="number" inputmode="decimal" min="0" step="any" placeholder="الرسوم" aria-label="رسوم المنطقة الجديدة"></div>' +
    '<div class="acts" style="margin-top:8px"><button class="primary" data-a="area-add" type="button">إضافة المنطقة</button></div></div>';
}
function renderTab() {
  document.querySelectorAll('#adm-tabs .chip').forEach(b => { if (b.dataset.tab === adminTab) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  $('adm-body').innerHTML = { settings: tabSettings, cats: tabCats, prods: tabProds, areas: tabAreas }[adminTab]();
  if (adminTab === 'prods') renderProdList();
}

function setSetting(k, v) {
  v = String(v).trim();
  if (k === 'whatsapp') {
    const p = normPhone(v);
    if (!/^01[0125]\d{8}$/.test(p)) { say('رقم واتساب غير صحيح. اكتب 11 رقماً يبدأ بـ 01.', false); return renderTab(); }
    S.s.whatsapp = '20' + p.slice(1);
  } else if (k === 'name') {
    if (!v) return renderTab();
    S.s.name = v;
  } else S.s[k] = v;
  markDirty();
}
function onProdField(t) {
  const row = t.closest('[data-pid]'), p = S.prods.find(x => x[0] === +row.dataset.pid); if (!p) return;
  const f = t.dataset.p;
  if (f === 'name') { const v = t.value.trim(); if (v) p[1] = v; else t.value = p[1]; }
  else if (f === 'price') { const n = parseFloat(latin(t.value)); if (n >= 0) p[2] = n; else t.value = p[2]; }
  else if (f === 'cat') { p[3] = +t.value; markDirty(); return renderProdList(); }
  else if (f === 'hidden') p[4] = t.checked ? 1 : 0;
  markDirty();
}

$('adm-body').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.s !== undefined) return setSetting(t.dataset.s, t.value);
  if (t.id === 'adm-logo') return onLogo(t.files[0]);
  if (t.id === 'adm-mail') return onMail(t.value);
  if (t.id === 'adm-pf') { prodFilter = t.value; return renderProdList(); }
  if (t.dataset.cn !== undefined) { const v = t.value.trim(), c = S.cats[+t.dataset.cn]; if (v) { c[1] = v; markDirty(); } else t.value = c[1]; return; }
  if (t.dataset.p) return onProdField(t);
  if (t.dataset.an !== undefined) { const v = t.value.trim(), a = S.areas[+t.dataset.an]; if (v) { a[0] = v; markDirty(); } else t.value = a[0]; return; }
  if (t.dataset.af !== undefined) { const n = parseFloat(latin(t.value)), a = S.areas[+t.dataset.af]; if (n >= 0) { a[1] = n; markDirty(); } else t.value = a[1]; }
});
$('adm-body').addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'adm-pq') { prodQ = t.value; renderProdList(); }
  else if (t.id === 'adm-accent') { S.s.accent = t.value; applyTheme(); markDirty(); }
});
$('adm-body').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, id = +b.dataset.id, i = +b.dataset.i;
  if (a === 'cat-up' || a === 'cat-down') {
    const j = a === 'cat-up' ? i - 1 : i + 1;
    if (S.cats[j]) { [S.cats[i], S.cats[j]] = [S.cats[j], S.cats[i]]; markDirty(); renderTab(); }
  } else if (a === 'cat-del') { pendingDel = 'c' + id; renderTab(); }
  else if (a === 'cat-del-ok') {
    S.cats = S.cats.filter(c => c[0] !== id); S.prods = S.prods.filter(p => p[3] !== id);
    if (String(prodFilter) === String(id)) prodFilter = 'all';
    pendingDel = null; markDirty(); renderTab();
  } else if (a === 'cat-add') {
    const inp = $('adm-newcat'), v = inp.value.trim(); if (!v) return inp.focus();
    S.cats.push([nextId(S.cats), v]); markDirty(); renderTab(); $('adm-newcat').focus();
  } else if (a === 'prod-new') { showNewProd = true; renderProdList(); const n = $('adm-np-name'); n && n.focus(); }
  else if (a === 'prod-new-x') { showNewProd = false; renderProdList(); }
  else if (a === 'prod-add') {
    const name = $('adm-np-name').value.trim(), price = parseFloat(latin($('adm-np-price').value)), cat = +$('adm-np-cat').value;
    if (!name) return $('adm-np-name').focus();
    if (!(price >= 0)) return $('adm-np-price').focus();
    S.prods.push([nextId(S.prods), name, price, cat, 0]); showNewProd = false; markDirty(); renderProdList(); say('تمت إضافة الصنف.', true);
  } else if (a === 'prod-del') { pendingDel = 'p' + id; renderProdList(); }
  else if (a === 'prod-del-ok') { S.prods = S.prods.filter(p => p[0] !== id); pendingDel = null; markDirty(); renderProdList(); }
  else if (a === 'area-add') {
    const n = $('adm-na-name').value.trim(), f = parseFloat(latin($('adm-na-fee').value));
    if (!n) return $('adm-na-name').focus();
    if (!(f >= 0)) return $('adm-na-fee').focus();
    S.areas.push([n, f]); markDirty(); renderTab(); say('تمت إضافة المنطقة.', true);
  } else if (a === 'area-del') { pendingDel = 'a' + id; renderTab(); }
  else if (a === 'area-del-ok') { S.areas.splice(id, 1); pendingDel = null; markDirty(); renderTab(); }
  else if (a === 'del-no') { pendingDel = null; renderTab(); }
  else if (a === 'logo-del') { S.s.logo = ''; markDirty(); renderTab(); }
  else if (a === 'logo-color') colorFromLogo();
});
$('adm-tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; adminTab = b.dataset.tab; pendingDel = null; renderTab(); });

/* ----- النشر على GitHub ----- */
const ghGet = () => { try { return JSON.parse(localStorage.getItem('qrmenu.gh') || '{}'); } catch (e) { return {}; } };
const ghSet = o => { try { localStorage.setItem('qrmenu.gh', JSON.stringify(o)); } catch (e) { } };
function ghDefaults() {
  const g = ghGet();
  if (!g.owner && /\.github\.io$/.test(location.hostname)) { g.owner = location.hostname.split('.')[0]; g.repo = g.repo || location.pathname.split('/')[1] || ''; }
  g.branch = g.branch || 'main';
  return g;
}
function menuFile() {
  const J = x => JSON.stringify(x).replace(/</g, '\\u003c');
  return 'window.MENU_DATA = {\n"s":' + J(S.s) + ',\n"cats":' + J(S.cats) + ',\n"prods":[\n' + S.prods.map(J).join(',\n') + '\n],\n"areas":' + J(S.areas) + '\n};\n';
}
function toB64(text) {
  const bytes = new TextEncoder().encode(text); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function ghFail(st) {
  return ({
    401: 'الرمز (Token) غير صحيح أو منتهي. أنشئ رمزاً جديداً وأدخله في الإعدادات.',
    403: 'الرمز لا يملك صلاحية الكتابة على المستودع. فعّل Contents: Read and write.',
    404: 'لم يُعثر على المستودع أو الفرع. راجع اسم المالك والمستودع والفرع.',
    409: 'تعارض مع نسخة أحدث. أعد المحاولة.',
    422: 'تعذر الحفظ بسبب تعارض في النسخة. أعد المحاولة.'
  })[st] || 'تعذر النشر. تأكد من الاتصال بالإنترنت وأعد المحاولة.';
}
async function publishNow() {
  if (!dirty || busy) return;
  const g = ghDefaults();
  if (!g.owner || !g.repo || !g.token) { adminTab = 'settings'; renderTab(); return say('أدخل بيانات GitHub (المالك، المستودع، الرمز) في الإعدادات أولاً.', false); }
  busy = true; updatePub();
  const api = 'https://api.github.com/repos/' + encodeURIComponent(g.owner) + '/' + encodeURIComponent(g.repo) + '/contents/data/menu.js';
  const H = { Authorization: 'Bearer ' + g.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await fetch(api + '?ref=' + encodeURIComponent(g.branch), { headers: H, cache: 'no-store' });
      let sha;
      if (r.ok) sha = (await r.json()).sha; else if (r.status !== 404) throw { status: r.status };
      const body = { message: 'تحديث المنيو من لوحة الإدارة', content: toB64(menuFile()), branch: g.branch };
      if (sha) body.sha = sha;
      const p = await fetch(api, { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, H), body: JSON.stringify(body) });
      if (p.ok) { dirty = false; busy = false; updatePub(); syncAdminBar(); return say('تم النشر. تظهر التغييرات للزبائن خلال دقيقة تقريباً.', true); }
      if (p.status !== 409 && p.status !== 422) throw { status: p.status };
    }
    throw { status: 409 };
  } catch (err) { busy = false; updatePub(); say(err && err.status ? ghFail(err.status) : ghFail(0), false); }
}
function downloadMenu() {
  const url = URL.createObjectURL(new Blob([menuFile()], { type: 'text/javascript;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'menu.js'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  say('تم تنزيل menu.js. ارفعه إلى مجلد data في المستودع.', true);
}
$('adm-body').addEventListener('change', e => {
  const t = e.target; if (!t.dataset.gh) return;
  const g = ghGet(); g[t.dataset.gh] = t.value.trim(); ghSet(g);
});
$('adm-body').addEventListener('click', e => { if (e.target.closest('[data-a="gh-dl"]')) downloadMenu(); });

/* ----- ربط الأحداث ----- */
$('admin-link').addEventListener('click', () => { if (adminOn()) openAdmin(); else openLogin(); });
$('admin-open').addEventListener('click', openAdmin);
$('admin-logout').addEventListener('click', () => { setAdminOn(false); });
$('adm-close').addEventListener('click', closeAdmin);
$('adm-login-x').addEventListener('click', closeLogin);
$('adm-login-go').addEventListener('click', loginGo);
$('adm-email').addEventListener('keydown', e => { if (e.key === 'Enter') loginGo(); });
$('adm-publish').addEventListener('click', publishNow);
$('admin').addEventListener('click', e => { if (e.target === $('admin')) closeAdmin(); });
$('adm-login').addEventListener('click', e => { if (e.target === $('adm-login')) closeLogin(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('adm-login').hidden) closeLogin(); else if (!$('admin').hidden) closeAdmin();
});
window.addEventListener('beforeunload', e => { if (dirty && !busy) { e.preventDefault(); } });

/* ----- إعادة بناء الصفحة من الحالة ----- */
function fillAreas(prev) {
  $('f-area').innerHTML = '<option value="">اختر المنطقة</option>' + AREAS_S.map((a, i) => '<option value="' + i + '">' + esc(a[0]) + ' — ' + a[1] + ' ' + CONFIG.currency + '</option>').join('');
  if (prev) { const i = AREAS_S.findIndex(a => a[0] === prev); if (i >= 0) $('f-area').value = String(i); }
}
function refreshAll() {
  const prev = ($('f-area').value !== '' && AREAS_S[+$('f-area').value]) ? AREAS_S[+$('f-area').value][0] : null;
  deriveData();
  Array.from(cart.keys()).forEach(id => { if (!PBY.has(id)) cart.delete(id); });
  if (curCat !== 'all' && !CATS.some(c => String(c[0]) === String(curCat))) curCat = 'all';
  applyTheme(); initBrand(); renderMenu(); fillAreas(prev);
  $('paynum').textContent = CONFIG.payNumber; $('wa-show').textContent = CONFIG.whatsappDisplay;
  setActive(curCat); applySearch(); renderSummary(); updateBar(); syncAdminBar();
}

init();
