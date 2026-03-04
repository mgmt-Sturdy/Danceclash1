// Always open from top on load/refresh/back-forward
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', () => window.scrollTo(0, 0));
window.addEventListener('load', () => window.scrollTo(0, 0));

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

for (const link of document.querySelectorAll('.site-nav a')) {
  link.addEventListener('click', () => {
    document.querySelectorAll('.site-nav a').forEach((l) => l.classList.remove('is-active'));
    link.classList.add('is-active');
    nav?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('on'), delay);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = String(i * 90);
  observer.observe(el);
});

const formatCompact = (n, withPlus = false) => {
  const abs = Math.abs(n);
  let out;
  if (abs >= 1_000_000) out = `${(n / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  else if (abs >= 1_000) out = `${(n / 1_000).toFixed(2).replace(/\.00$/, '')}K`;
  else out = `${Math.round(n)}`;
  return withPlus ? `${out}+` : out;
};

const animateCount = (el, target, format = 'number') => {
  const duration = 1500;
  let start = null;

  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);

    if (format === 'compact') el.textContent = formatCompact(value, false);
    else if (format === 'compactPlus') el.textContent = formatCompact(value, true);
    else el.textContent = String(value);

    if (progress < 1) requestAnimationFrame(step);
  };

  el.textContent = '0';
  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const format = el.dataset.format || 'number';
    animateCount(el, target, format);
    statObserver.unobserve(el);
  });
}, { threshold: 0.65 });

document.querySelectorAll('[data-count]').forEach((el) => statObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const progress = document.querySelector('.scroll-progress');
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = `${p}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
let heroIndex = 0;
if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
  }, 1500);
}

window.addEventListener('scroll', () => {
  const heroParallax = document.querySelector('.hero-slide.active');
  if (!heroParallax) return;
  const y = Math.min(window.scrollY * 0.08, 26);
  heroParallax.style.transform = `scale(1.08) translateY(${y}px)`;
}, { passive: true });


