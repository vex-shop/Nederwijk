(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('.site-header');
  const nav = $('#primary-nav');
  const menu = $('.menu-toggle');
  let lastY = window.scrollY;
  let ticking = false;

  function updateHeader(){
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 42);
    if (y > lastY && y > 280 && !nav?.classList.contains('open')) header?.classList.add('nav-hidden');
    else header?.classList.remove('nav-hidden');
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(updateHeader); ticking = true; } }, {passive:true});

  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menu.classList.toggle('open', Boolean(open));
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('open'); menu?.classList.remove('open'); menu?.setAttribute('aria-expanded','false');
  }));

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced){
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    }), {threshold:.1, rootMargin:'0px 0px -30px'});
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  $$('.faq-item button').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const open = !item.classList.contains('active');
    $$('.faq-item').forEach(x => x.classList.remove('active'));
    if (open) item.classList.add('active');
  }));

  if (!reduced && window.matchMedia('(pointer:fine)').matches){
    const glow = $('.cursor-glow');
    window.addEventListener('pointermove', e => {
      if (!glow) return;
      glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
    }, {passive:true});

    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width - .5;
        const y = (e.clientY-r.top)/r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  const video = $('.legacy-hero-video');
  video?.play().catch(() => document.addEventListener('click', () => video.play().catch(()=>{}), {once:true}));

  const serverUrl = 'https://servers-frontend.fivem.net/api/servers/single/da4pzj';
  async function updateServer(){
    try{
      const res = await fetch(serverUrl, {cache:'no-store'});
      if (!res.ok) throw new Error('server status');
      const json = await res.json();
      const online = json?.Data?.clients ?? 0;
      const max = json?.Data?.sv_maxclients ?? 64;
      $$('.online-count').forEach(el => el.textContent = `${online}/${max}`);
      $$('.server-status-label').forEach(el => el.textContent = 'ONLINE');
    }catch(_){
      $$('.online-count').forEach(el => el.textContent = '--/64');
      $$('.server-status-label').forEach(el => el.textContent = 'SERVER');
    }
  }
  updateServer();
  setInterval(updateServer, 60000);
})();

/* blue motion refresh */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .10;
      const y = (e.clientY - r.top - r.height / 2) * .14;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  document.querySelectorAll('.department-card,.feature-card,.faq-item').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 30}ms`;
  });
})();
