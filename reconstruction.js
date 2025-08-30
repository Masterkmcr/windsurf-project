// ==========================================================================
// RECONSTRUCTION JS - Animations et interactions modernes
// ==========================================================================

class ReconstructionApp {
  constructor() {
    this.init();
    this.initThemeToggle();
  }

  init() {
    this.setupScrollAnimations();
    this.setupModalHandlers();
    this.setupSmoothScrolling();
    this.setupHeaderEffects();
    this.setupCardAnimations();
    this.setupFloatingBadges();
    this.setupButtonEffects();
    this.setupParallax();
    this.setupBonusTooltips();
    this.setupActiveNavLink();
    this.setupFAQAccordion();
  }

  // Animations au scroll
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Animation séquentielle pour les cards
          if (entry.target.classList.contains('three-cards')) {
            this.animateCardsSequence(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
      .section-intro,
      .three-cards,
      .card,
      .guarantee-box,
      .testimonial-card,
      .bonus-card,
      .faq-item,
      .enhanced-cta
    `);

    elementsToAnimate.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // Animation séquentielle des cards
  animateCardsSequence(container) {
    const cards = container.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.2}s forwards`;
      }, index * 100);
    });
  }

  // Gestion des modales
  setupModalHandlers() {
    const modal = document.getElementById('docs-modal');
    const openButtons = document.querySelectorAll('[data-open-docs]');
    const closeButtons = document.querySelectorAll('[data-close-docs]');
    const backdrop = document.querySelector('.backdrop');

    // Ouvrir la modale
    openButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(modal);
      });
    });

    // Fermer la modale
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.closeModal(modal);
      });
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.closeModal(modal);
      }
    });
  }

  openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    const content = modal.querySelector('.modal-content');
    content.style.transform = 'scale(0.9) translateY(20px)';
    content.style.opacity = '0';
    
    requestAnimationFrame(() => {
      content.style.transition = 'all 0.3s ease';
      content.style.transform = 'scale(1) translateY(0)';
      content.style.opacity = '1';
    });
  }

  closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.transform = 'scale(0.9) translateY(20px)';
    content.style.opacity = '0';
    
    setTimeout(() => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }, 300);
  }

  // Scroll fluide
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Effets du header
  setupHeaderEffects() {
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Header qui se cache/montre
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      // Effet de transparence
      if (currentScrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // Animations des cards au hover
  setupCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Effet de parallax subtil sur l'image
        const img = card.querySelector('.card-img');
        if (img) {
          img.style.transform = 'scale(1.05)';
          img.style.transition = 'transform 0.4s ease';
        }
        
        // Animation du badge
        const badge = card.querySelector('.highlight-badge');
        if (badge) {
          badge.style.transform = 'scale(1.1) rotate(2deg)';
          badge.style.transition = 'transform 0.3s ease';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.card-img');
        if (img) {
          img.style.transform = 'scale(1)';
        }
        
        const badge = card.querySelector('.highlight-badge');
        if (badge) {
          badge.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });
  }

  // Animation des badges flottants
  setupFloatingBadges() {
    const badges = document.querySelectorAll('.float-badge');
    
    badges.forEach((badge, index) => {
      // Animation de flottement personnalisée
      badge.style.animationDelay = `${index * 0.5}s`;
      
      // Effet de parallax au scroll
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        badge.style.transform = `translateY(${rate * 0.1}px)`;
      });
    });
  }

  // Effets des boutons
  setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Effet de ripple
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      // Effet de pulsation pour les CTA principaux
      if (button.classList.contains('btn-primary')) {
        setInterval(() => {
          button.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.4)';
          setTimeout(() => {
            button.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
          }, 1000);
        }, 3000);
      }
    });
  }

  // Gestion du basculement de thème
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    // Récupérer le thème sauvegardé ou utiliser le thème clair par défaut
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Animation de rotation de l'icône
        if (themeIcon) {
          themeIcon.style.transform = 'rotate(360deg)';
          setTimeout(() => {
            themeIcon.style.transform = '';
          }, 300);
        }
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Mettre à jour l'icône
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
      } else {
        themeIcon.textContent = '🌙';
      }
    }
    
    // Effet de fondu pour la transition
    document.body.style.opacity = '0.95';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 150);
  }

  // Méthode utilitaire pour les animations
  animateElement(element, animation, duration = 600) {
    element.style.animation = `${animation} ${duration}ms ease forwards`;
  }

  // Parallax pour les sections
  setupParallax() {
    // Respecter les préférences d'accessibilité
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heroImg = document.querySelector('.hero-reconstruction .hero-image img');
    const badges = document.querySelectorAll('.float-badge');

    const onScroll = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (heroImg) {
        // Parallax subtil sur l'image du hero
        heroImg.style.transform = `translateY(${Math.min(scrolled * 0.1, 40)}px)`;
      }
      badges.forEach(b => {
        b.style.transform = `translateY(${(scrolled * -0.05).toFixed(2)}px)`;
      });
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial call
    onScroll();
  }

  // Tooltips interactifs pour les cartes Bonus
  setupBonusTooltips() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.bonus-item');
    if (!items.length) return;

    items.forEach(item => {
      const tooltip = item.querySelector('.bonus-tooltip');
      if (!tooltip) return;

      let rafId = null;
      let targetX = 0, targetY = 0;

      const show = () => {
        tooltip.classList.add('visible');
      };
      const hide = () => {
        tooltip.classList.remove('visible');
      };
      const move = (e) => {
        if (reduceMotion) return; // éviter les mouvements inutiles
        targetX = e.offsetX ?? 0;
        targetY = e.offsetY ?? 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Positionner la tooltip par rapport à l'élément bonus
          const rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          tooltip.style.transform = `translate(${x + 16}px, ${y + 16}px)`;
        });
      };

      item.addEventListener('mouseenter', show);
      item.addEventListener('mouseleave', hide);
      item.addEventListener('focusin', show);
      item.addEventListener('focusout', hide);
      item.addEventListener('mousemove', move);
      item.addEventListener('touchstart', show, { passive: true });
      item.addEventListener('touchend', hide);
    });
  }

  // Surbrillance du lien de navigation actif
  setupActiveNavLink() {
    const navLinks = document.querySelectorAll('.site-header .nav a[href^="#"]');
    if (!navLinks.length) return;

    const map = new Map();
    navLinks.forEach(link => {
      const id = link.getAttribute('href');
      const section = id ? document.querySelector(id) : null;
      if (section) map.set(section, link);
    });

    if (!map.size) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

    map.forEach((_, section) => observer.observe(section));
  }

  // Accordéon pour la FAQ (progressive enhancement)
  setupFAQAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const toggle = item.querySelector('.faq-question, h3, button');
      const content = item.querySelector('.faq-answer, .faq-content, p, div');
      if (!toggle || !content) return;

      // État initial
      item.setAttribute('data-open', 'false');
      content.style.maxHeight = '0px';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease';

      const open = () => {
        item.setAttribute('data-open', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      };
      const close = () => {
        item.setAttribute('data-open', 'false');
        content.style.maxHeight = '0px';
      };

      toggle.style.cursor = 'pointer';
      toggle.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-open') === 'true';
        isOpen ? close() : open();
      });
    });
  }
}

// --- Carousel Enfants ---
(function() {
  const section = document.querySelector('#enfants-carousel');
  if (!section) return;

  const track = section.querySelector('.carousel-track');
  const items = Array.from(section.querySelectorAll('.carousel-item'));
  const btnPrev = section.querySelector('[data-prev]');
  const btnNext = section.querySelector('[data-next]');
  const dotsContainer = section.querySelector('[data-dots]');

  if (!track || items.length === 0) return;

  // Create dots
  const dots = items.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Aller à la diapo ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsContainer && dotsContainer.appendChild(b);
    return b;
  });

  let index = 0;
  let autoTimer = null;
  const AUTO_DELAY = 4000;

  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
  }

  function goTo(i) {
    index = (i + items.length) % items.length;
    update();
    restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  btnNext && btnNext.addEventListener('click', next);
  btnPrev && btnPrev.addEventListener('click', prev);

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(next, AUTO_DELAY);
  }
  function stopAutoplay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }
  function restartAutoplay() { startAutoplay(); }

  // Pause on hover
  section.addEventListener('mouseenter', stopAutoplay);
  section.addEventListener('mouseleave', startAutoplay);

  // Swipe support
  let startX = 0;
  let isDown = false;
  track.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.clientX;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointerup', (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  });

  // Init
  update();
  startAutoplay();
})();

// Styles CSS additionnels pour les animations JS
const additionalStyles = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .site-header {
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card-img {
    transition: transform 0.4s ease;
  }
  
  .highlight-badge {
    transition: transform 0.3s ease;
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-on-scroll.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-on-scroll,
    .card-img,
    .highlight-badge,
    .site-header {
      transition: none;
      animation: none;
    }
    
    .float-badge {
      animation: none;
    }
  }
  
  /* Bonus tooltip minimal styling */
  .bonus-item { position: relative; }
  .bonus-tooltip {
    position: absolute;
    top: 0; left: 0;
    transform: translate(16px, 16px);
    background: rgba(15, 23, 42, 0.95);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    border-radius: 12px;
    padding: 12px 14px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 10;
  }
  .bonus-tooltip.visible {
    opacity: 1;
    pointer-events: auto;
  }
  
  /* Lien actif de navigation */
  .site-header .nav a.active {
    color: var(--primary-color);
  }
`;

// Injecter les styles additionnels
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  new ReconstructionApp();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
  // Recalculer les positions si nécessaire
  const badges = document.querySelectorAll('.float-badge');
  badges.forEach(badge => {
    // Repositionner les badges flottants sur mobile
    if (window.innerWidth < 768) {
      badge.style.position = 'static';
      badge.style.display = 'inline-block';
      badge.style.margin = '0.5rem';
    } else {
      badge.style.position = 'absolute';
      badge.style.display = 'block';
      badge.style.margin = '0';
    }
  });
});

// Performance: Utiliser requestAnimationFrame pour les animations de scroll
let ticking = false;

function updateScrollAnimations() {
  // Animations de scroll optimisées
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollAnimations);
    ticking = true;
  }
});
