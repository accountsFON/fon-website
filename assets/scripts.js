/* Five One Nine Marketing - Shared Scripts */
/* Safari-hardened, premium section animations */

// ─── Init ───
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMobile = window.innerWidth < 768;

// Safari fix: refresh ScrollTrigger after full page load (images, fonts, etc.)
window.addEventListener('load', () => {
  ScrollTrigger.refresh(true);
});

// ─── Reduced Motion: show everything immediately ───
if (prefersReducedMotion) {
  document.querySelectorAll('.ds-reveal, .stagger-grid > *, .hero-el, .hero-word, .hero-stat, .narrative-p').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// ─── Section Reveal (premium entrance) ───
if (!prefersReducedMotion) {
  gsap.utils.toArray('.ds-reveal').forEach(section => {
    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h2');
    const subtext = section.querySelector('h2 + p');
    const children = [eyebrow, heading, subtext].filter(Boolean);

    ScrollTrigger.create({
      trigger: section,
      start: isMobile ? 'top 92%' : 'top 85%',
      once: true,
      onEnter: () => {
        // Section container fades in
        gsap.to(section, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        // Heading group staggers in with slight delay
        if (children.length > 0) {
          gsap.fromTo(children,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
          );
        }
      }
    });
  });

  // Card stagger
  gsap.utils.toArray('.stagger-grid').forEach(grid => {
    ScrollTrigger.create({
      trigger: grid,
      start: isMobile ? 'top 92%' : 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(grid.children, {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          stagger: isMobile ? 0.08 : 0.1
        });
      }
    });
  });
}

// ─── Safety fallback (Safari + slow connections) ───
// Short timeout to catch any elements ScrollTrigger missed
function forceShowHidden() {
  document.querySelectorAll('.ds-reveal, .stagger-grid > *, .narrative-p, .hero-el, .hero-word, .hero-stat').forEach(el => {
    if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    }
  });
}
setTimeout(forceShowHidden, 2500);
// Extra fallback on load event for Safari which fires scroll events late
window.addEventListener('load', () => setTimeout(forceShowHidden, 1500));

// ─── Narrative Flow (paragraph stagger) ───
if (!prefersReducedMotion) {
  document.querySelectorAll('.narrative-p').forEach(p => {
    gsap.set(p, { opacity: 0, y: 16 });
  });
  document.querySelectorAll('.narrative-flow').forEach(flow => {
    const paragraphs = flow.querySelectorAll('.narrative-p');
    ScrollTrigger.create({
      trigger: flow,
      start: isMobile ? 'top 90%' : 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(paragraphs, {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.2
        });
      }
    });
  });
}

// ─── Stat Counter ───
document.querySelectorAll('[data-stats]').forEach(statsBar => {
  ScrollTrigger.create({
    trigger: statsBar,
    start: isMobile ? 'top 90%' : 'top 80%',
    once: true,
    onEnter: () => {
      statsBar.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (prefersReducedMotion) {
          el.textContent = prefix + (decimals ? target.toFixed(decimals) : target) + suffix;
          return;
        }
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + (decimals ? obj.val.toFixed(decimals) : Math.round(obj.val)) + suffix;
          }
        });
      });
    }
  });
});

// ─── RoughNotation (general annotations - scroll triggered) ───
const annotationConfigs = {
  circle:    { type: 'circle', color: '#F57F5B', strokeWidth: 2, padding: 8, animationDuration: 1200 },
  underline: { type: 'underline', color: '#F57F5B', strokeWidth: 3, padding: 2, animationDuration: 800 },
  box:       { type: 'box', color: '#F57F5B', strokeWidth: 2, padding: 4, animationDuration: 800 },
};
const annotations = [];

document.querySelectorAll('[data-annotate]').forEach(el => {
  const cfg = annotationConfigs[el.dataset.annotate];
  if (!cfg) return;
  const opts = Object.assign({}, cfg);
  if (el.dataset.annotateColor) opts.color = el.dataset.annotateColor;
  const a = RoughNotation.annotate(el, opts);
  annotations.push({ annotation: a, element: el });
  if (prefersReducedMotion) { a.show(); return; }
  ScrollTrigger.create({
    trigger: el,
    start: isMobile ? 'top 85%' : 'top 75%',
    once: true,
    onEnter: () => { setTimeout(() => a.show(), 400); }
  });
});

// ─── Hero Annotation (fires from GSAP timeline, not scroll) ───
let heroAnnotation = null;
const heroEmphasis = document.getElementById('hero-emphasis');
if (heroEmphasis) {
  const heroType = heroEmphasis.dataset.heroAnnotate;
  const heroCfg = annotationConfigs[heroType];
  if (heroCfg) {
    heroAnnotation = RoughNotation.annotate(heroEmphasis, Object.assign({}, heroCfg));
  }
}

// ─── Mobile Nav ───
const menuBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}
if (closeBtn && mobileMenu) {
  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// ─── Hero Entrance (home page only) ───
function initHeroEntrance() {
  const heroEls = document.querySelectorAll('.hero-el');
  const heroWords = document.querySelectorAll('.hero-word');
  const heroStat = document.querySelector('.hero-stat');

  if (prefersReducedMotion) {
    heroEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    heroWords.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    if (heroStat) { heroStat.style.opacity = '1'; heroStat.style.transform = 'none'; }
    if (heroAnnotation) heroAnnotation.show();
    return;
  }

  const tl = gsap.timeline();
  gsap.set('.hero-el, .hero-word', { opacity: 0, y: 12 });
  if (heroStat) gsap.set(heroStat, { opacity: 0, scale: 0.95 });

  // Eyebrow
  if (heroEls[0]) tl.to(heroEls[0], { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.15);

  // Headline words
  heroWords.forEach((word, i) => {
    tl.to(word, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 0.4 + i * 0.12);
  });

  // Annotation after words
  if (heroAnnotation) {
    tl.call(() => heroAnnotation.show(), null, 1.3);
  }

  // Subheadline
  if (heroEls[1]) tl.to(heroEls[1], { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.5);

  // CTAs
  if (heroEls[2]) tl.to(heroEls[2], { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.9);

  // Trust bar
  if (heroEls[3]) tl.to(heroEls[3], { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 2.2);

  // Stat card / right composition
  if (heroStat) tl.to(heroStat, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, 0.5);
}

if (document.querySelector('.hero-word')) {
  // Use requestAnimationFrame to ensure DOM is painted before animating
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initHeroEntrance();
    });
  });
}

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
if (navbar) {
  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }
  });
}

// Final refresh after everything is set up
requestAnimationFrame(() => ScrollTrigger.refresh(true));
