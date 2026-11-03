(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';


  /* ---------- Phone menu ---------- */
  const bar = $('#bar');
  const toggle = $('.menu-toggle');
  const setMenu = (open) => { bar.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; };
  toggle.addEventListener('click', () => setMenu(!bar.classList.contains('open')));
  $$('.bar-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bar.classList.contains('open')) { setMenu(false); toggle.focus(); } });
  barOnScroll();
  creditCalculator();
  footerFilm();

  /* ---------- Hero: three homes crossfade, the caption and the switch follow ---------- */
  const heroImgs = $$('.hero-photos img');
  const listing = $('.listing');
  const switches = $$('.listing-switch button');
  let heroIndex = 0;
  let heroTimer;
  const showHome = (i) => {
    heroImgs[heroIndex].classList.remove('is-on');
    heroIndex = i;
    const img = heroImgs[heroIndex];
    img.classList.add('is-on');
    if (window.gsap) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 7.5, ease: 'none' });
    switches.forEach((b, j) => b.setAttribute('aria-pressed', String(j === heroIndex)));
    listing.classList.add('swap');
    setTimeout(() => {
      $('.listing-name').textContent = img.dataset.name;
      $('.listing-price').textContent = img.dataset.price;
      $('.listing-credit').textContent = `≈ ${img.dataset.credit} back to you at closing`;
      listing.classList.remove('swap');
    }, 450);
  };
  const startHero = () => { if (!reduce && !heroTimer) heroTimer = setInterval(() => showHome((heroIndex + 1) % heroImgs.length), 6000); };
  const stopHero = () => { clearInterval(heroTimer); heroTimer = null; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stopHero() : startHero()));
  // choosing a home shows it at once and restarts the six-second rhythm from there
  switches.forEach((b, i) => b.addEventListener('click', () => {
    if (i !== heroIndex) showHome(i);
    stopHero();
    startHero();
  }));
  startHero();

  /* ---------- Statement words ---------- */
  const statement = $('.statement');
  statement.innerHTML = statement.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');

  /* ---------- How it works: which moment is active ---------- */
  const moments = $$('.moment');
  const frames = $$('.how-frame img');
  const setMoment = (i) => moments.forEach((m, j) => m.classList.toggle('is-active', j === i));

  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');

  /* ---------- Arrival: the name, then the curtain lifts (first visit in a session only) ---------- */
  let seen = false;
  try { seen = sessionStorage.getItem('kh-arrived') === '1'; sessionStorage.setItem('kh-arrived', '1'); } catch (e) {}
  if (!seen) {
    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = '<span>Keyhaven</span>';
    document.body.append(curtain);
    gsap.timeline({ onComplete: () => curtain.remove() })
      .from('.curtain span', { yPercent: 60, opacity: 0, duration: 0.5, ease: 'expo.out' })
      .to('.curtain', { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, 0.45);
  }

  /* ---------- Hero on load and on leave ---------- */
  gsap.fromTo(heroImgs[0], { scale: 1.08 }, { scale: 1, duration: 7.5, ease: 'none' });
  gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.3 } })
    .from('.hero h1', { y: 48 }, 0.1)
    .from('.hero-text p', { y: 24, opacity: 0 }, 0.3)
    .from('.hero-act > *', { y: 24, opacity: 0, stagger: 0.08 }, 0.4)
    .from(['.wordmark', '.bar-links'], { y: -16, opacity: 0, stagger: 0.06, duration: 1 }, 0.2)
    .from('.cta-bar', { opacity: 0, duration: 1 }, 0.32);

  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .fromTo('.hero', { clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: 'inset(0px 10px 0px 10px round 0px 0px 24px 24px)', ease: 'none' }, 0)
    .to('.hero-photos', { yPercent: 16, ease: 'none' }, 0)
    .to('.hero-foot', { y: -90, opacity: 0, ease: 'none' }, 0)
    .to('.hero-scrim', { opacity: 1.4, ease: 'none' }, 0);

  /* ---------- Entrances: heading, text, picture, staggered ---------- */
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  /* ---------- Intro: words darken with the scroll, the photograph opens from below ---------- */
  gsap.to('.statement .w', {
    color: '#14171a', stagger: 0.08, ease: 'none',
    scrollTrigger: { trigger: '.statement', start: 'top 82%', end: 'bottom 50%', scrub: true },
  });
  gsap.fromTo('.intro-photo', { clipPath: 'inset(100% 0% 0% 0% round 14px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.3, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.intro-photo', start: 'top 90%', once: true },
  });
  gsap.fromTo('.intro-photo img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.intro-photo', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* the second intro photograph drifts slower than the first, like prints hung at different depths */
  gsap.fromTo('.intro-photo-b', { y: 120 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'bottom top', scrub: true } });

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 681px)', phone: '(max-width: 680px)' }, (ctx) => {
    const { desktop } = ctx.conditions;

    /* How it works: held for two screens, photographs wipe upward between moments */
    gsap.set(frames.slice(1), { clipPath: 'inset(100% 0 0 0)' });
    const how = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.how-stage', start: 'top top', end: () => '+=' + window.innerHeight * 1.6, scrub: 0.8, pin: true, anticipatePin: 1,
        onUpdate: (st) => setMoment(st.progress < 0.36 ? 0 : st.progress < 0.7 ? 1 : 2),
      },
    });
    how
      .to('.how-track span', { scaleX: 1, duration: 3 }, 0)
      .fromTo(frames[0], { scale: 1.15 }, { scale: 1, duration: 1.2 }, 0)
      .to(frames[1], { clipPath: 'inset(0% 0 0 0)', duration: 0.6 }, 0.85)
      .fromTo(frames[1], { scale: 1.2 }, { scale: 1, duration: 1.2 }, 0.85)
      .to(frames[2], { clipPath: 'inset(0% 0 0 0)', duration: 0.6 }, 1.9)
      .fromTo(frames[2], { scale: 1.2 }, { scale: 1, duration: 1.1 }, 1.9);

    /* Homes: frames arrive one after another, then drift at their own speeds */
    gsap.from('.frame', {
      y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: '.run', start: 'top 80%' },
    });
    if (desktop) {
      $$('.frame[data-speed]').forEach((f) => gsap.to(f, {
        yPercent: () => +f.dataset.speed * -100, ease: 'none',
        scrollTrigger: { trigger: '.homes', start: 'top bottom', end: 'bottom top', scrub: true },
      }));
    }
    /* each listing photograph opens from a smaller frame as it arrives */
    $$('.frame-img, .keep-photo, .contact-photo').forEach((el) => gsap.fromTo(el,
      { clipPath: 'inset(8% 8% 8% 8% round 14px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    gsap.fromTo('.frame-lifted img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.frame-lifted', start: 'top bottom', end: 'bottom 40%', scrub: true } });

    /* Map: pans as you pass; pins land from left to right */
    gsap.fromTo(['.near-photo', '.pins'], { y: () => -window.innerHeight * 0.05 }, { y: () => window.innerHeight * 0.05, ease: 'none', scrollTrigger: { trigger: '.map-frame', start: 'top bottom', end: 'bottom top', scrub: true } });
    const pins = $$('.pin').filter((p) => p.offsetParent).sort((a, b) => a.offsetLeft - b.offsetLeft);
    gsap.from(pins, { y: -36, opacity: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.07, scrollTrigger: { trigger: '.map-frame', start: 'top 55%' } });

    /* Footer: the photograph settles, the letters of the name rise one by one */
    gsap.fromTo('.footer-photo', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.footer-name .ch', {
      yPercent: 100, opacity: 0, ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: '.footer', start: 'top 70%', end: 'bottom bottom', scrub: true },
    });
  });

  // trigger points move when the display font arrives; measure again once it has
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());

  /* ---------- helpers ---------- */
  // The coast loop plays only while the footer is on screen.
  function footerFilm() {
    const film = $('.footer-film');
    if (!film || reduce) return;
    const check = () => {
      const r = film.getBoundingClientRect();
      const near = r.top < window.innerHeight + 200 && r.bottom > -200;
      if (near && film.paused) {
        if (film.preload === 'none') { film.preload = 'auto'; film.load(); }
        film.play().catch(() => {});
      } else if (!near && !film.paused) film.pause();
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function barOnScroll() {
    const bar = $('#bar');
    const hero = $('.hero');
    const footer = $('.footer');
    const update = () => {
      const pastHero = window.scrollY > hero.offsetHeight - 80;
      const inFooter = footer.getBoundingClientRect().top < 80;
      bar.classList.toggle('solid', pastHero && !inFooter);
      bar.classList.toggle('away', inFooter);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    // split the footer name so each letter can rise on its own
    const name = $('.footer-name');
    name.innerHTML = [...name.textContent].map((c) => `<span class="ch">${c}</span>`).join('');
  }

  function creditCalculator() {
    const input = $('#price');
    const priceOut = $('#price-out');
    const creditOut = $('#credit-out');
    const fmt = (v) => '$' + Math.round(v).toLocaleString('en-US');
    // 25% of a 2.5% buyer's-agent fee, rounded to the nearest $50
    const update = () => {
      const price = +input.value;
      priceOut.textContent = fmt(price);
      creditOut.textContent = fmt(Math.round((price * 0.025 * 0.25) / 50) * 50);
    };
    input.addEventListener('input', update);
    update();
  }
})();
