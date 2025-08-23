// GSAP base
window.addEventListener('DOMContentLoaded', () => {
  // THEME: init from storage or system, then wire toggle
  (function initTheme(){
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    let theme = saved || (systemLight ? 'light' : 'dark');
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme'); // dark is default via :root

    const btn = document.querySelector('.theme-toggle');
    const logoImgs = document.querySelectorAll('.ph-logo img');
    const applyLogo = () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      // Brand logos
      if (logoImgs && logoImgs.length > 0){
        logoImgs.forEach(img => {
          img.src = isLight ? 'images/logo_white.png' : 'images/logo.png';
          img.alt = 'Logo';
        });
      }
      // Partner logos: swap only the requested ones (including duplicates in carousel)
      const partner1Imgs = document.querySelectorAll('.logos [data-label="Logo partenaire 1"] img');
      const partner2Imgs = document.querySelectorAll('.logos [data-label="Logo partenaire 2"] img');
      if (partner1Imgs && partner1Imgs.length){
        partner1Imgs.forEach(img => { img.src = isLight ? 'images/part1_white.png' : 'images/part1.png'; });
      }
      if (partner2Imgs && partner2Imgs.length){
        partner2Imgs.forEach(img => { img.src = isLight ? 'images/part2.png' : 'images/part2_black.png'; });
      }
    };
    const setIcon = () => { btn && (btn.textContent = (root.getAttribute('data-theme') === 'light' ? '☀️' : '🌙')); };
    applyLogo();
    setIcon();
    if (btn){
      btn.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        if (isLight){
          root.removeAttribute('data-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
        applyLogo();
        setIcon();
      });
    }
  })();
  const { gsap } = window;
  if (!gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  // Progress bar
  const bar = document.querySelector('.scroll-progress .bar');
  const onScroll = () => {
    const h = document.documentElement;
    const st = h.scrollTop || document.body.scrollTop;
    const sh = h.scrollHeight - h.clientHeight;
    const p = (st / sh) * 100;
    bar.style.width = `${p}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // To top button
  const toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) toTop.classList.add('show');
    else toTop.classList.remove('show');
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior: 'smooth' }));

  // Hero entrance (updated for stacked layout)
  gsap.from('.hero-copy > *', { y: 30, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' });
  gsap.from('.ph-hero', { y: 40, opacity:0, duration: .9, delay: .2, ease: 'power3.out' });
  gsap.from('.hero-cta', { y: 24, opacity:0, duration: .8, delay: .25, ease: 'power3.out' });
  gsap.from('.floating-badge', { y: -10, opacity:0, duration: .8, stagger: .15, delay:.3, ease: 'power2.out' });

  // Parallax badges
  gsap.to('.floating-badge.badge-1', {
    y: -12, repeat: -1, yoyo: true, duration: 2.4, ease: 'sine.inOut'
  });
  gsap.to('.floating-badge.badge-2', {
    y: 10, repeat: -1, yoyo: true, duration: 2.8, ease: 'sine.inOut'
  });
  gsap.to('.floating-badge.badge-3', {
    y: -8, repeat: -1, yoyo: true, duration: 3.2, ease: 'sine.inOut'
  });

  // Insert interstitial CTAs after each section with varied phrasing
  // insertInterstitialCTAs();

//   function insertInterstitialCTAs(){
//     const phrasesById = {
//       probleme: "On clarifie la méthode, vous rejoignez ?",
//       solution: "Cette approche vous parle ? Rejoignez le challenge !",
//       resultats: "Prêt(e) à viser ces résultats ?",
//       preuves: "Convaincu(e) par les témoignages ?",
//     };
//     const generic = [
//       "Envie de participer et progresser ?",
//       "On commence ensemble dès aujourd’hui ?",
//       "Votre enfant mérite un cadre motivant—participez !",
//       "Rejoignez le Challenge et passez à l’action",
//     ];
//     let gi = 0;
//     const sections = document.querySelectorAll('.section');
//     sections.forEach((sec) => {
//       const id = sec.getAttribute('id') || '';
//       const msg = phrasesById[id] || generic[(gi++) % generic.length];
//       const wrapper = document.createElement('div');
//       wrapper.className = 'section-cta';
//       wrapper.innerHTML = `
//         <div class="container">
//           <div class="wrap">
//             <span class="msg">${msg} <span class="highlight">Participez maintenant</span></span>
//             <a class="btn btn-primary" href="#cta">Participer</a>
//           </div>
//         </div>`;
//       sec.insertAdjacentElement('afterend', wrapper);
//     });
//   }

  // Section reveals (including interstitial CTAs)
  const sections = document.querySelectorAll('.section, .cta, .section-cta');
  sections.forEach(sec => {
    gsap.from(sec.querySelectorAll('.section-intro, .grid-2 > *, .cards .card, .timeline-item, .stats .stat, .testimonials .testimonial, .logos > div, .cta-copy, .cta-actions, .section-cta .wrap, .section-cta .btn'), {
      scrollTrigger: { trigger: sec, start: 'top 75%' },
      y: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out'
    });
  });

  // Counters
  const counters = document.querySelectorAll('.stat-value');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target || '0', 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounter(el, target, 1.2)
    });
  });

  // Impact card: slam-in effect on scroll
  const impact = document.querySelector('.impact-card');
  if (impact) {
    impact.style.transformOrigin = '50% 50%';
    gsap.set(impact, { willChange: 'transform, box-shadow, filter' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: impact,
        start: 'top 70%',
        once: true
      }
    });

    tl.fromTo(impact,
      { y: 80, scale: 0.85, rotation: -2, opacity: 0, filter: 'blur(6px)' },
      { y: 0, scale: 1.02, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.6)' }
    )
    // quick punch
    .to(impact, { scale: 1.06, duration: 0.1, ease: 'power2.inOut' })
    .to(impact, { scale: 1, duration: 0.18, ease: 'power2.out' })
    // shadow flash
    .to(impact, { boxShadow: '0 22px 60px rgba(0,0,0,0.45)', duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<')
    // subtle shake
    .to(impact, { x: -6, duration: 0.06, yoyo: true, repeat: 3, ease: 'power1.inOut' });
  }

  function animateCounter(el, target, duration = 1.2) {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        let v = Math.floor(obj.val);
        el.textContent = v.toLocaleString('fr-FR');
      }
    });
  }

  // Promesses: wheel-style orbit (only if explicitly enabled with .wheel)
  initPromessesWheel();

  function initPromessesWheel(){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const list = document.querySelector('#promesses .promises');
    if (!list) return;
    if (!list.classList.contains('wheel')) return; // keep static grid by default
    const items = Array.from(list.querySelectorAll('li'));
    if (items.length === 0) return;

    const state = { w: 0, h: 0, cx: 0, cy: 0, r: 0 };

    function measure(){
      const rect = list.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      state.cx = state.w / 2;
      state.cy = state.h / 2;
      const maxItem = items.reduce((m, el) => Math.max(m, el.getBoundingClientRect().height), 0) || 44;
      state.r = Math.max(40, Math.min(state.w, state.h) / 2 - maxItem * 0.7);
    }

    function layoutCircle(){
      measure();
      const step = (Math.PI * 2) / items.length;
      items.forEach((el, i) => {
        const angle = i * step;
        const x = state.cx + state.r * Math.cos(angle);
        const y = state.cy + state.r * Math.sin(angle);
        gsap.set(el, { x, y, xPercent: -50, yPercent: -50, willChange: 'transform' });
      });
    }

    layoutCircle();

    let spinTween = null;
    let counterTween = null;

    if (!reduce){
      // Rotate the whole wheel
      spinTween = gsap.to(list, { rotation: 360, transformOrigin: '50% 50%', ease: 'none', duration: 30, repeat: -1 });
      // Keep text upright by counter-rotating each card
      counterTween = gsap.to(items, { rotation: "-=360", ease: 'none', duration: 30, repeat: -1 });
    }

    // Pause/resume on hover of any item
    items.forEach((el) => {
      el.addEventListener('mouseenter', () => { spinTween && spinTween.pause(); counterTween && counterTween.pause(); });
      el.addEventListener('mouseleave', () => { spinTween && spinTween.resume(); counterTween && counterTween.resume(); });
    });

    // One-time sheen sequencing: trigger on the item in front as the wheel turns
    if (!reduce && spinTween){
      const n = items.length;
      const segment = 360 / n;
      let lastIdx = -1;
      const norm = (d) => { d = d % 360; return d < 0 ? d + 360 : d; };
      const frontIndexFromRotation = (rot) => {
        // angle at top is 270deg; initial item i at angle i*segment
        const k = Math.round((270 - rot) / segment);
        return ((k % n) + n) % n;
      };
      const triggerSheen = (el) => {
        el.classList.add('sheen-once');
        setTimeout(() => { el.classList.remove('sheen-once'); }, 1100);
      };
      spinTween.eventCallback('onUpdate', () => {
        const rot = norm(gsap.getProperty(list, 'rotation') || 0);
        const idx = frontIndexFromRotation(rot);
        if (idx !== lastIdx){
          lastIdx = idx;
          triggerSheen(items[idx]);
        }
      });
    }

    window.addEventListener('resize', () => { layoutCircle(); });
  }
});