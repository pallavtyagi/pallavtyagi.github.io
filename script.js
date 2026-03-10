// ── Dark mode ──
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return null; // let CSS prefers-color-scheme handle it
}

function applyTheme(theme) {
  if (theme) {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
}

function toggleTheme() {
  const isDark = root.getAttribute('data-theme') === 'dark' ||
    (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', toggleTheme);

// ── Fade in on scroll ──
const fadeEls = document.querySelectorAll('.fade');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 40);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
fadeEls.forEach(el => fadeObserver.observe(el));

// ── Stagger children ──
const staggerEls = document.querySelectorAll('.stagger-children');
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = (i * 60) + 'ms';
      });
      entry.target.classList.add('in');
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
staggerEls.forEach(el => staggerObserver.observe(el));

// ── Sticky nav visibility ──
const siteNav = document.getElementById('siteNav');
const hero = document.querySelector('.hero');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    siteNav.classList.toggle('visible', !entry.isIntersecting);
  });
}, { threshold: 0.1 });
navObserver.observe(hero);

// ── Nav active state ──
const navLinks = siteNav.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObserver.observe(s));

// ── Back to top ──
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Scroll progress + back-to-top ──
const scrollProgress = document.getElementById('scrollProgress');
let ticking = false;

function onScroll() {
  const sy    = window.scrollY;
  const maxSy = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollProgress) {
    scrollProgress.style.width = (sy / maxSy * 100) + '%';
  }

  backToTop.classList.toggle('visible', sy > 400);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

onScroll();
