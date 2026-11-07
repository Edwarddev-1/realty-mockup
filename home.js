(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');

  const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
  // 25% of a 2.5% buyer's-agent fee, rounded to the nearest $50 (same rule as the home page)
  const creditFor = (price) => Math.round((price * 0.025 * 0.25) / 50) * 50;

  /* ---------- Fill the page from the listing in the address ---------- */
  const homes = window.KEYHAVEN_HOMES || [];
  const id = new URLSearchParams(location.search).get('id');
  const index = Math.max(0, homes.findIndex((h) => h.id === id));
  const home = homes[index];
  const next = homes[(index + 1) % homes.length];
  const bind = (key) => $$(`[data-bind="${key}"]`);

  if (home) {
    const city = home.place.split(',')[0];
    document.title = `${home.name}, ${city} · Keyhaven Realty`;
    bind('name').forEach((el) => (el.textContent = home.name));
    bind('place').forEach((el) => (el.textContent = home.place));
    bind('line').forEach((el) => (el.textContent = home.line));
    bind('price').forEach((el) => (el.textContent = money(home.price)));
    bind('credit').forEach((el) => (el.textContent = money(creditFor(home.price))));
    bind('hero').forEach((el) => { el.src = home.hero; });
    bind('facts').forEach((el) => {
      el.innerHTML = home.facts.map(([n, label]) => `<div><dt>${label}</dt><dd>${n}</dd></div>`).join('');
    });
    bind('about').forEach((el) => { el.innerHTML = home.about.map((p) => `<p>${p}</p>`).join(''); });
    bind('features').forEach((el) => { el.innerHTML = home.features.map((f) => `<li>${f}</li>`).join(''); });
    bind('gallery').forEach((el) => {
      const sizes = [[1600, 1000], [900, 1125], [1000, 1000], [1600, 1000]];
      el.innerHTML = home.gallery.map(([src, cap], i) =>
        `<figure class="room room-${'abcd'[i]}"><div class="room-img"><img src="${src}" alt="${cap}" width="${sizes[i][0]}" height="${sizes[i][1]}" loading="lazy" /></div><figcaption>${cap}</figcaption></figure>`).join('');
    });
    bind('mailto').forEach((el) => {
      const body = `We would like to see ${home.name} (${home.place}).\nTwo times that suit us:\n1.\n2.\nOur phone number:`;
      el.href = `mailto:hello@keyhavenrealty.com?subject=${encodeURIComponent('Viewing: ' + home.name)}&body=${encodeURIComponent(body)}`;
    });
    if (next) {
      bind('next').forEach((el) => (el.href = `home.html?id=${next.id}`));
      bind('next-img').forEach((el) => { el.src = next.hero.replace('w=2400', 'w=2000'); });
      bind('next-name').forEach((el) => (el.textContent = `Next, ${next.name}`));
      bind('next-place').forEach((el) => (el.textContent = `${next.place}, ${money(next.price)}`));
    }
  }

  /* ---------- Loan calculator: what the 0.25% discount saves each month ---------- */
  const price = home ? home.price : 8450000;
  const down = $('#down');
  const monthly = (loan, rate) => { const r = rate / 12; return (loan * r) / (1 - Math.pow(1 + r, -360)); };
  const updateLoan = () => {
    const pct = +down.value;
    down.style.setProperty('--fill', `${((pct - down.min) / (down.max - down.min)) * 100}%`);
    const loan = price * (1 - pct / 100);
    const market = monthly(loan, 0.0675);
    const ours = monthly(loan, 0.065);
    $('#down-out').textContent = `${pct}%, ${money(price * pct / 100)}`;
    down.setAttribute('aria-valuetext', `${pct}%, ${money(price * pct / 100)}`);
    $('#loan-amount').textContent = money(loan);
    $('#loan-market').textContent = money(market);
    $('#loan-ours').textContent = money(ours);
    $('#loan-saving').textContent = money(market - ours);
  };
  down.addEventListener('input', updateLoan);
  updateLoan();

  /* ---------- Bar and phone menu ---------- */
  const bar = $('#bar');
  const hero = $('.home-hero');
  const toggle = $('.menu-toggle');
  const updateBar = () => bar.classList.toggle('solid', window.scrollY > hero.offsetHeight - 80);
  updateBar();
  window.addEventListener('scroll', updateBar, { passive: true });
  const setMenu = (open) => { bar.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; };
  toggle.addEventListener('click', () => setMenu(!bar.classList.contains('open')));
  $$('.bar-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bar.classList.contains('open')) { setMenu(false); toggle.focus(); } });

  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');

  /* ---------- Arrival ---------- */
  // the headline rises from behind its own edge
  const heading = $('.home-hero h1');
  const headingLine = document.createElement('span');
  headingLine.className = 'rise-line';
  headingLine.append(...heading.childNodes);
  heading.append(headingLine);
  heading.classList.add('rise-mask');
  const barItems = window.matchMedia('(min-width: 681px)').matches ? ['.wordmark', '.bar-links'] : ['.wordmark'];
  const arrival = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.3 } });
  // a photograph that has just travelled here from the last page is already in place
  if (!document.documentElement.classList.contains('kh-morphing')) arrival.from('.hero-photos img', { scale: 1.12, duration: 2.4 }, 0);
  arrival
    .from(headingLine, { yPercent: 105, duration: 1.4 }, 0.1)
    .from('.hero-text p', { y: 24, opacity: 0 }, 0.3)
    .from('.hero-act > *', { y: 24, opacity: 0, stagger: 0.08 }, 0.45)
    .from(barItems, { y: -16, opacity: 0, stagger: 0.06, duration: 1, clearProps: 'transform,opacity' }, 0.2)
    .from('.cta-bar', { opacity: 0, duration: 1 }, 0.32);

  gsap.timeline({ scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.4 } })
    .fromTo('.home-hero', { clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: 'inset(0px 10px 0px 10px round 0px 0px 24px 24px)', ease: 'none' }, 0)
    .to('.hero-photos', { yPercent: 14, ease: 'none' }, 0)
    .to('.hero-foot', { y: -90, opacity: 0, ease: 'none' }, 0);

  /* ---------- The figures count up once ---------- */
  ScrollTrigger.create({
    trigger: '.facts-list', start: 'top 85%', once: true,
    onEnter: () => $$('.facts-list dd').forEach((dd, i) => {
      const text = dd.textContent;
      const end = parseFloat(text.replace(/,/g, ''));
      if (!isFinite(end) || end >= 1900) { gsap.from(dd, { y: 24, opacity: 0, duration: 1, delay: i * 0.08, ease: 'expo.out' }); return; }
      const decimals = (text.split('.')[1] || '').length;
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.4, delay: i * 0.08, ease: 'power3.out',
        onUpdate: () => (dd.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })),
        onComplete: () => (dd.textContent = text) });
    }),
  });

  /* ---------- Entrances ---------- */
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.from(els, { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: 'auto' }),
  });

  /* ---------- Rooms open from a smaller frame as they arrive ---------- */
  $$('.room-img').forEach((el) => {
    const r = getComputedStyle(el).borderTopLeftRadius;
    gsap.fromTo(el, { clipPath: `inset(10% 8% 10% 8% round ${r})` }, {
      clipPath: `inset(0% 0% 0% 0% round ${r})`, clearProps: 'clipPath', duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
    gsap.fromTo($('img', el), { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });

  /* ---------- The next house grows to the full width ---------- */
  const nextRadius = getComputedStyle($('.next-link')).borderTopLeftRadius;
  gsap.fromTo('.next-link', { clipPath: `inset(6% 6% 6% 6% round ${nextRadius})` }, {
    clipPath: `inset(0% 0% 0% 0% round ${nextRadius})`, clearProps: 'clipPath', duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: '.next', start: 'top 85%', once: true },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
