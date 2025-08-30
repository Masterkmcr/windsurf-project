// GSAP base
window.addEventListener('DOMContentLoaded', () => {
  // THEME: init from storage or system, then wire toggle
  (function initTheme(){
    const root = document.documentElement;
    root.removeAttribute('data-theme'); // dark is default via :root
  })();

  const { gsap } = window;
  if (!gsap) return;

  // Register plugin only if available
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Accessibility: respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progressive enhancement: animated nav underline (CSS fallback present)
  (function enhanceNavUnderline(){
    const navLinks = document.querySelectorAll('.nav a');
    if (!navLinks.length) return;
    navLinks.forEach(a => {
      // inject underline ink element if not present
      if (!a.querySelector('.ink')){
        const ink = document.createElement('span');
        ink.className = 'ink';
        ink.setAttribute('aria-hidden', 'true');
        a.appendChild(ink);
      }
      if (!prefersReduced){
        const ink = a.querySelector('.ink');
        // animate scaleX on hover/focus
        a.addEventListener('mouseenter', () => gsap.to(ink, { scaleX: 1, duration: 0.22, ease: 'power2.out' }));
        a.addEventListener('mouseleave', () => gsap.to(ink, { scaleX: 0, duration: 0.22, ease: 'power2.in' }));
        a.addEventListener('focus', () => gsap.to(ink, { scaleX: 1, duration: 0.22, ease: 'power2.out' }));
        a.addEventListener('blur', () => gsap.to(ink, { scaleX: 0, duration: 0.22, ease: 'power2.in' }));
      }
    });
  })();

  // Header condense on scroll (with CSS class toggle)
  (function headerCondense(){
    const header = document.querySelector('.site-header');
    if (!header) return;
    const threshold = 80;
    const onScroll = () => {
      if (window.scrollY > threshold) header.classList.add('condensed');
      else header.classList.remove('condensed');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // Smooth anchor scrolling that respects reduced motion and sticky header offset
  (function smoothAnchors(){
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;
    function headerOffset(){
      const h = document.querySelector('.site-header .container');
      return h ? h.getBoundingClientRect().height : 0;
    }
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        if (href.length < 2) return; // ignore # only
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - (headerOffset() + 10);
        if (prefersReduced){
          window.scrollTo(0, y);
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        } else {
          const state = { pos: window.pageYOffset };
          gsap.to(state, {
            pos: y,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: true,
            onUpdate(){ window.scrollTo(0, state.pos); },
            onComplete(){
              target.setAttribute('tabindex', '-1');
              target.focus({ preventScroll: true });
              target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
            }
          });
        }
      });
    });
  })();

  // Button microinteractions (press/hover)
  (function buttonMicro(){
    const buttons = document.querySelectorAll('.btn');
    if (!buttons.length || prefersReduced) return; // keep simple for reduced motion
    buttons.forEach(btn => {
      // quick hover lift already in CSS; add subtle scale feedback on press
      btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.98, duration: 0.08, ease: 'power1.out' }));
      btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1, duration: 0.12, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.12, ease: 'power2.out' }));
      // keyboard accessibility feedback
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ gsap.to(btn, { scale: 0.98, duration: 0.08 }); }});
      btn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' '){ gsap.to(btn, { scale: 1, duration: 0.12 }); }});
    });
  })();

  // Progress bar (optional)
  const bar = document.querySelector('.scroll-progress .bar');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const sh = h.scrollHeight - h.clientHeight;
      const p = sh > 0 ? (st / sh) * 100 : 0;
      bar.style.width = `${p}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // To top button (optional)
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior: 'smooth' }));
  }

  // Hero entrance (Reconstruction hero)
  const heroExists = document.querySelector('.hero-reconstruction');
  if (heroExists) {
    // Prepare for smoother animation
    gsap.set(['.hero-content', '.hero-image', '.hero-image img'], { willChange: 'transform, opacity' });

    const tlHero = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlHero
      // Left column: slide in from left
      .from('.hero-content', { x: -40, opacity: 0, duration: 0.7 })
      .from('.hero-content .tagline', { y: 12, opacity: 0, duration: 0.5 }, '-=0.45')
      .from('.hero-content .sub-headline', { y: 12, opacity: 0, duration: 0.45 }, '-=0.38')
      .from('.hero-benefits li', { y: 12, opacity: 0, duration: 0.4, stagger: 0.07 }, '-=0.34')
      .from('.hero-content .btn', { y: 14, opacity: 0, duration: 0.5 }, '-=0.28')
      // Right column: image slides in from right
      .from('.hero-image', { x: 40, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.hero-image img', { scale: 0.95, duration: 0.6 }, '-=0.55');

    // Emphasis on "En 90 jours"
    gsap.fromTo('.highlight-90',
      { scale: 0.9 },
      { scale: 1.1, duration: 0.9, ease: 'elastic.out(1, 0.6)', transformOrigin: 'left center' }
    );

    // Subtle float for the hero image
    if (!prefersReduced){
      gsap.to('.hero-image img', { y: -8, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
  }

  // Parallax badges
  if (!prefersReduced){
    gsap.to('.floating-badge.badge-1', {
      y: -12, repeat: -1, yoyo: true, duration: 2.4, ease: 'sine.inOut'
    });
    gsap.to('.floating-badge.badge-2', {
      y: 10, repeat: -1, yoyo: true, duration: 2.8, ease: 'sine.inOut'
    });
    gsap.to('.floating-badge.badge-3', {
      y: -8, repeat: -1, yoyo: true, duration: 3.2, ease: 'sine.inOut'
    });
  }

  // Devenir section: reveal cards progressively on scroll
  const devenir = document.querySelector('#devenir .three-cards');
  if (devenir && window.ScrollTrigger) {
    gsap.from('#devenir .card', {
      scrollTrigger: { trigger: '#devenir', start: 'top 75%', once: true },
      y: 28,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.15
    });
  }

  // Floating hero badges orbit animation
  (function initHeroBadges(){
    const section = document.querySelector('.hero-reconstruction');
    if (!section) return;
    const wrapper = section.querySelector('.float-badges');
    const img = section.querySelector('.hero-image img');
    if (!wrapper || !img) return;

    const badges = Array.from(wrapper.querySelectorAll('.float-badge'));
    if (!badges.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = window.matchMedia('(max-width: 640px)');
    let activeTweens = [];

    function clearAnims(){
      activeTweens.forEach(t => t.kill());
      activeTweens = [];
      gsap.killTweensOf([wrapper, ...badges]);
      gsap.set(wrapper, { clearProps: 'transform' });
      badges.forEach(el => {
        el.style.transform = '';
        el.style.removeProperty('will-change');
        gsap.set(el, { clearProps: 'x,y,opacity,scale' });
      });
    }

    function layout(){
      if (smallScreen.matches) { clearAnims(); return; }
      const rect = img.getBoundingClientRect();
      // Radius outside the image so badges do not touch/cover it
      const margin = 48; // px outside the image edge
      const r = Math.max(rect.width, rect.height) / 2 + margin;
      const n = badges.length;
      badges.forEach((el, i) => {
        const angle = (i / n) * 360;
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${r}px) rotate(${-angle}deg)`;
        el.style.willChange = 'transform';
      });
    }

    function animate(){
      if (smallScreen.matches) { return; }
      // Only vertical bobbing, no rotation of the group
      const intro = gsap.fromTo(badges, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power1.out' });
      activeTweens.push(intro);
      badges.forEach((el, i) => {
        const amp = prefersReduced.matches ? 4 : 8; // vertical amplitude
        const dur = 2 + (i % 3) * 0.3;
        const tween = gsap.to(el, { y: i % 2 ? amp : -amp, duration: dur, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        activeTweens.push(tween);
      });
    }

    if (img.complete) { layout(); animate(); }
    else { img.addEventListener('load', () => { layout(); animate(); }, { once: true }); }

    window.addEventListener('resize', () => { layout(); });
    smallScreen.addEventListener('change', () => { layout(); animate(); });
    prefersReduced.addEventListener('change', () => { clearAnims(); animate(); });
  })();

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
        // Position each badge on a circle around the image center; keep text upright
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${state.r}px) rotate(${-angle}deg)`;
        el.style.willChange = 'transform';
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
  // Documents modal: open/close with accessibility
  (function initDocsModal(){
    const openBtn = document.querySelector('[data-open-docs]');
    const modal = document.getElementById('docs-modal');
    if (!openBtn || !modal) return;
    const closeEls = modal.querySelectorAll('[data-close-docs]');
    let lastFocused = null;

    function open(){
      lastFocused = document.activeElement;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // focus heading or close button
      const focusable = modal.querySelector('.modal-close') || modal.querySelector('h3, h2, h1');
      focusable && focusable.focus();
      document.addEventListener('keydown', onKeyDown);
    }
    function close(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKeyDown);
      // restore focus
      lastFocused && lastFocused.focus();
    }
    function onKeyDown(e){
      if (e.key === 'Escape') close();
    }

    openBtn.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
    closeEls.forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); close(); }));
  })();

  // Modal: Formulaire d'inscription
  (function initInscriptionModal(){
    const openBtns = document.querySelectorAll('[data-open-inscription]');
    const modal = document.getElementById('inscription-modal');
    if (!modal) return;
    const backdrop = modal.querySelector('[data-close-inscription]');
    const closeBtns = modal.querySelectorAll('[data-close-inscription]');
    const form = document.getElementById('inscription-form');
    const selectClasse = modal.querySelector('#classe-actuelle');
    const sectionRadios = modal.querySelectorAll('input[name="section"]');

    const classesFR = ["6e","5e","4e","3e","Seconde","Première","Terminale"];
    const classesEN = ["Form 1","Form 2","Form 3","Form 4","Form 5","Lower Sixth","Upper Sixth"];

    function populateClasses(section){
      if (!selectClasse) return;
      const opts = section === 'en' ? classesEN : classesFR;
      // Reset options with placeholder
      selectClasse.innerHTML = '';
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.selected = true;
      ph.textContent = '— Sélectionner —';
      selectClasse.appendChild(ph);
      opts.forEach(v => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v;
        selectClasse.appendChild(o);
      });
    }

    function open(){
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // focus first field
      const first = modal.querySelector('input, textarea, button');
      first && first.focus();
      // Ensure classes are populated according to default/selected section
      const checked = modal.querySelector('input[name="section"]:checked');
      populateClasses(checked ? checked.value : 'fr');
    }
    function close(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closeBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); close(); }));
    // close on ESC
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) close(); });

    // Change classes when section changes
    sectionRadios.forEach(r => r.addEventListener('change', () => {
      const val = r.value;
      if (r.checked) populateClasses(val);
    }));

    if (form){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const classe = (data.classe_actuelle || '').trim();
        const link = resolveWhatsappLink(classe);
        // Build/Show confirmation dialog
        showConfirmDialog({
          message: "Félicitations! Votre inscription a bien été prise en compte. Vous allez être redirigé vers le groupe WhatsApp adéquat.",
          onConfirm: async (controls) => {
            // Prepare payload
            const payload = Object.fromEntries(new FormData(form).entries());
            // Optional: include timestamp
            payload._submitted_at = new Date().toISOString();
            try{
              controls.setLoading(true);
              await postToAppsScript(payload);
              // Success -> redirect
              if (link){ window.location.href = link; }
              // Reset and close modal afterward
              form.reset();
              const fr = modal.querySelector('#section-fr');
              if (fr) fr.checked = true;
              populateClasses('fr');
              close();
            }catch(err){
              controls.setLoading(false);
              alert('Erreur lors de l\'envoi du formulaire: ' + err.message + '\nVérifiez votre connexion ou les autorisations du script Google.');
            }
          }
        });
      });
    }

    function resolveWhatsappLink(classe){
      // Normalize accents/case
      const c = (classe || '').toLowerCase();
      // French mappings
      const linkA = 'https://chat.whatsapp.com/KwSn3NXz1iRCD7kJ2LkJFH'; // 6e -> 4e
      const linkB = 'https://chat.whatsapp.com/HZhd4lCLzzvAX2wNY07fGP'; // 3e -> Seconde
      const linkC = 'https://chat.whatsapp.com/KbNUaQMRHfSKXGKuV9QrQB'; // Première -> Terminale
      if (["6e","6ème","6eme","form 1"].some(x => c.includes(x))) return linkA;
      if (["5e","5ème","5eme","form 2"].some(x => c.includes(x))) return linkA;
      if (["4e","4ème","4eme","form 3"].some(x => c.includes(x))) return linkA;
      if (["3e","3ème","3eme","form 4"].some(x => c.includes(x))) return linkB;
      if (["seconde","2nde","2nd","form 5"].some(x => c.includes(x))) return linkB;
      if (["première","1ère","1ere","lower sixth"].some(x => c.includes(x))) return linkC;
      if (["terminale","upper sixth"].some(x => c.includes(x))) return linkC;
      // Default fallback
      return linkB;
    }

    function showConfirmDialog({ message, onConfirm }){
      // If already exists, remove before showing a fresh one
      const existing = modal.querySelector('.confirm-backdrop');
      if (existing) existing.remove();
      const backdrop = document.createElement('div');
      backdrop.className = 'confirm-backdrop';
      backdrop.setAttribute('role','dialog');
      backdrop.setAttribute('aria-modal','true');
      const card = document.createElement('div');
      card.className = 'confirm-card';
      const text = document.createElement('p');
      text.className = 'confirm-text';
      text.textContent = message;
      const actions = document.createElement('div');
      actions.className = 'confirm-actions';
      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.textContent = 'Confirmer';
      const controls = {
        setLoading(is){
          if (is){
            confirmBtn.disabled = true; cancelBtn.disabled = true;
            confirmBtn.dataset.originalText = confirmBtn.textContent;
            confirmBtn.textContent = 'Envoi en cours...';
          }else{
            confirmBtn.disabled = false; cancelBtn.disabled = false;
            confirmBtn.textContent = confirmBtn.dataset.originalText || 'Confirmer';
          }
        },
        close(){ backdrop.remove(); }
      };
      confirmBtn.addEventListener('click', async () => {
        // Keep backdrop while processing; let handler remove it on success
        onConfirm && onConfirm(controls);
      });
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-ghost';
      cancelBtn.textContent = 'Annuler';
      cancelBtn.addEventListener('click', () => backdrop.remove());
      actions.appendChild(confirmBtn);
      actions.appendChild(cancelBtn);
      card.appendChild(text);
      card.appendChild(actions);
      backdrop.appendChild(card);
      // Place inside modal-content for stacking
      const content = modal.querySelector('.modal-content') || modal;
      content.appendChild(backdrop);
      // Focus confirm
      confirmBtn.focus();
    }

    // Google Apps Script endpoint POST helper
    async function postToAppsScript(payload){
      const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFp87uwBqLbM8SJICmYkZB8COiLkgs0ZMDUj2pEdPXRoKZcGpy61mN5AztpxgO6k1M/exec';
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // Try to parse JSON if possible; if CORS prevents reading, proceed on status OK
      let data = null;
      try { data = await res.json(); } catch(e) { /* ignore parse errors */ }
      if (!res.ok || (data && data.ok === false)){
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(msg);
      }
      return data;
    }
  })();
});