/* Runs in <head> on both pages: photographs that fade in once decoded, and the page-to-page photo morph. */
(() => {
  const $ = (s) => document.querySelector(s);
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: (k) => { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  /* ---------- Photographs: nothing pops in; each one fades up when it is ready to paint ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth) return;
      img.classList.add('photo-fade', 'is-loading');
      const show = () => img.classList.remove('is-loading');
      img.addEventListener('load', () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(show), { once: true });
      img.addEventListener('error', show, { once: true });
    });
  });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('onpagereveal' in window)) return;

  /* ---------- The clicked photograph carries through to the next page ---------- */
  const idOf = (url) => new URL(url, location.href).searchParams.get('id');
  const isHome = (url) => new URL(url, location.href).pathname.endsWith('home.html');
  const frameFor = (id) => {
    const link = [...document.querySelectorAll('.frame-link')].find((a) => idOf(a.href) === id);
    return link && link.querySelector('.frame-img');
  };
  const inView = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  };

  const named = [];
  const name = (el, n) => { if (el) { el.style.viewTransitionName = n; named.push(el); } };
  const clear = () => named.splice(0).forEach((el) => { el.style.viewTransitionName = ''; });
  const nameHero = () => {
    name($('.hero-photos'), 'listing-photo');
    name($('.hero-scrim'), 'home-scrim');
    name($('.hero-foot'), 'home-foot');
  };

  if (store.get('kh-morph')) document.documentElement.classList.add('kh-morphing');

  // leaving a page: name what travels, and leave a note for the page that receives it
  window.addEventListener('pageswap', (e) => {
    clear();
    if (!e.viewTransition || !e.activation) return;
    const to = e.activation.entry.url;
    const type = e.activation.navigationType;
    let morph = null;
    if (type === 'push' && isHome(to) && !isHome(location.href)) {
      const frame = frameFor(idOf(to));
      if (inView(frame)) { name(frame, 'listing-photo'); morph = 'hero'; }
    } else if (type === 'push' && isHome(to) && isHome(location.href)) {
      const next = $('.next-link');
      if (inView(next) && idOf(next.href) === idOf(to)) { name(next, 'listing-photo'); morph = 'hero'; }
    } else if (type === 'traverse' && !isHome(to) && isHome(location.href)) {
      if (inView($('.hero-photos'))) { nameHero(); morph = 'frame:' + idOf(location.href); }
    }
    if (morph) { name($('#bar'), 'site-bar'); store.set('kh-morph', morph); }
  });

  // arriving on a page: name the matching element before the first frame is painted
  window.addEventListener('pagereveal', (e) => {
    clear();
    const morph = store.get('kh-morph');
    store.del('kh-morph');
    if (!e.viewTransition || !morph) return;
    if (morph === 'hero') nameHero();
    else {
      const frame = frameFor(morph.slice(6));
      if (inView(frame)) name(frame, 'listing-photo');
    }
    name($('#bar'), 'site-bar');
    e.viewTransition.finished.then(clear, clear);
  });

  /* ---------- Fetch the next page's photograph as soon as someone reaches for the link ---------- */
  const fetched = new Set();
  const reach = (e) => {
    const link = e.target.closest && e.target.closest('a[href*="home.html?id="]');
    const home = link && (window.KEYHAVEN_HOMES || []).find((h) => h.id === idOf(link.href));
    if (!home || fetched.has(home.id)) return;
    fetched.add(home.id);
    new Image().src = home.hero;
  };
  ['pointerover', 'pointerdown', 'focusin'].forEach((type) => document.addEventListener(type, reach, { passive: true }));
})();
