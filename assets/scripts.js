/* Five One Nine Marketing - Shared Scripts */

// ─── Init ───
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Section Reveal (GSAP) ───
if (!prefersReducedMotion) {
  gsap.utils.toArray('.ds-reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
    });
  });
  gsap.utils.toArray('.stagger-grid').forEach(grid => {
    ScrollTrigger.create({
      trigger: grid, start: 'top 88%', once: true,
      onEnter: () => gsap.to(grid.children, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 })
    });
  });
} else {
  document.querySelectorAll('.ds-reveal, .stagger-grid > *, .hero-el, .hero-word, .hero-stat, .narrative-p').forEach(el => {
    el.style.opacity = '1'; el.style.transform = 'none';
  });
}

// Safety fallback
setTimeout(() => {
  document.querySelectorAll('.ds-reveal, .stagger-grid > *, .narrative-p').forEach(el => {
    if (getComputedStyle(el).opacity === '0') { el.style.opacity = '1'; el.style.transform = 'none'; }
  });
}, 4000);

// ─── Narrative Flow (paragraph-by-paragraph reveal) ───
if (!prefersReducedMotion) {
  document.querySelectorAll('.narrative-p').forEach(p => {
    gsap.set(p, { opacity: 0, y: 20 });
  });
  document.querySelectorAll('.narrative-flow').forEach(flow => {
    const paragraphs = flow.querySelectorAll('.narrative-p');
    ScrollTrigger.create({
      trigger: flow, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(paragraphs, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          stagger: 0.25
        });
      }
    });
  });
}

// ─── Stat Counter ───
document.querySelectorAll('[data-stats]').forEach(statsBar => {
  ScrollTrigger.create({
    trigger: statsBar, start: 'top 80%', once: true,
    onEnter: () => {
      statsBar.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (prefersReducedMotion) { el.textContent = prefix + (decimals ? target.toFixed(decimals) : target) + suffix; return; }
        const obj = { val: 0 };
        gsap.to(obj, { val: target, duration: 2, ease: 'power2.out', onUpdate: () => {
          el.textContent = prefix + (decimals ? obj.val.toFixed(decimals) : Math.round(obj.val)) + suffix;
        }});
      });
    }
  });
});

// ─── RoughNotation (general - skips hero annotations) ───
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
    trigger: el, start: 'top 75%', once: true,
    onEnter: () => { setTimeout(() => a.show(), 300); }
  });
});

// ─── Hero Annotation (separate from general - fires from GSAP timeline only) ───
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
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero-el, .hero-word, .hero-stat').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    if (heroAnnotation) heroAnnotation.show();
    return;
  }

  const tl = gsap.timeline();
  gsap.set('.hero-el, .hero-word', { opacity: 0, y: 12 });
  gsap.set('.hero-stat', { opacity: 0, scale: 0.95 });

  // Eyebrow
  const heroEls = document.querySelectorAll('.hero-el');
  if (heroEls[0]) tl.to(heroEls[0], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.2);

  // Headline words (one by one)
  document.querySelectorAll('.hero-word').forEach((word, i) => {
    tl.to(word, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.5 + i * 0.15);
  });

  // RoughNotation circle on emphasis word AFTER all words are visible
  if (heroAnnotation) {
    tl.call(() => heroAnnotation.show(), null, 1.4);
  }

  // Subheadline
  if (heroEls[1]) tl.to(heroEls[1], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 1.6);

  // CTAs
  if (heroEls[2]) tl.to(heroEls[2], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.0);

  // Trust bar
  if (heroEls[3]) tl.to(heroEls[3], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.4);

  // Stat card
  tl.to('.hero-stat', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.6);
}

if (document.querySelector('.hero-word')) {
  setTimeout(initHeroEntrance, 200);
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

ScrollTrigger.refresh();
