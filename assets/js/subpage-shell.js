(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const path = location.pathname.toLowerCase();
  const isRules = path.includes('/apv');
  const isApply = path.includes('/solliciteren');

  const shell = `
    <div class="page-noise" aria-hidden="true"></div>
    <div class="cursor-glow" aria-hidden="true"></div>
    <div class="announcement">
      <div class="announcement-track">
        <span class="announce-dot"></span><span>Nederwijk Roleplay</span><i></i><span>FiveM • NL/BE</span><i></i><span>Jouw stad. Jouw verhaal.</span>
      </div>
    </div>
    <header class="site-header" id="top">
      <nav class="nav shell" aria-label="Hoofdnavigatie">
        <a class="brand" href="../" aria-label="Nederwijk Roleplay home"><img src="../assets/images/nederwijk-logo.png" alt="Nederwijk Roleplay" /></a>
        <div class="nav-links" id="primary-nav">
          <a href="../">Home</a>
          <a href="../#over">Over ons</a>
          <a class="${isRules ? 'active' : ''}" href="../apv/">APV</a>
          <a class="${isApply ? 'active' : ''}" href="../solliciteren/">Solliciteren</a>
          <a href="https://Nederwijk-roleplay.tebex.io/" target="_blank" rel="noreferrer" class="nav-store-link">Store <span>↗</span></a>
        </div>
        <div class="nav-actions">
          <a class="outline-btn nav-discord-btn" href="https://discord.gg/Qrs68Z2X9a" target="_blank" rel="noreferrer">
            <img class="discord-brand-icon" src="../assets/images/discord.svg" alt="" aria-hidden="true" />
            Discord
          </a>
          <button class="menu-toggle" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span></button>
        </div>
      </nav>
    </header>`;
  document.body.insertAdjacentHTML('afterbegin', shell);

  const header = $('.site-header');
  const nav = $('#primary-nav');
  const menu = $('.menu-toggle');
  let lastY = scrollY, ticking = false;
  function updateHeader(){
    const y=scrollY; header?.classList.toggle('scrolled',y>42);
    if(y>lastY&&y>280&&!nav?.classList.contains('open')) header?.classList.add('nav-hidden'); else header?.classList.remove('nav-hidden');
    lastY=y;ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateHeader);ticking=true;}},{passive:true});
  menu?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');menu.classList.toggle('open',!!open);menu.setAttribute('aria-expanded',String(!!open));});
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}));

  if (window.matchMedia('(pointer:fine)').matches) {
    const glow=$('.cursor-glow');
    addEventListener('pointermove',e=>{if(glow) glow.style.transform=`translate(${e.clientX-260}px,${e.clientY-260}px)`;},{passive:true});
  }
})();

/* shared page motion */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  // The APV is a long reference document. Keep its content stable instead of
  // animating every section while the user scrolls through the rules.
  if (!document.body.classList.contains('rules-page')) {
    // Other subpages can opt into .nw-reveal in their own markup.
  }
  const els = [...document.querySelectorAll('.nw-reveal')];

  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -28px' });
    els.forEach(el => {
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }

  const video = document.querySelector('.apply-hero-video');
  video?.play().catch(() => document.addEventListener('click', () => video.play().catch(()=>{}), { once:true }));

  if (!reduced && fine) {
    const applyCards = [...document.querySelectorAll('[data-apply-tilt]')];

    // All department cards react to pointer position with their internal blue glow.
    // The hovered card additionally receives the stronger 3D tilt below.
    let glowFrame = 0;
    document.addEventListener('pointermove', e => {
      if (glowFrame) return;
      glowFrame = requestAnimationFrame(() => {
        applyCards.forEach(card => {
          const r = card.getBoundingClientRect();
          const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
          const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
          card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
          card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        });
        glowFrame = 0;
      });
    }, { passive:true });

    applyCards.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - .5) * 5;
        const rx = (.5 - py) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .09;
        const y = (e.clientY - r.top - r.height/2) * .12;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
})();
