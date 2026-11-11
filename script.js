const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const scrollProgress = document.getElementById('scrollProgress');
const siteHeader = document.querySelector('header');
const burger = document.getElementById('burger');
const navlinks = document.getElementById('navlinks');
let lastY = window.scrollY;
let ticking = false;

let docHeight = 0;
function measure() { docHeight = document.documentElement.scrollHeight - window.innerHeight; }

function onScroll() {
  const y = window.scrollY;
  const pct = docHeight > 0 ? Math.min(1, y / docHeight) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${pct})`;
  if (siteHeader) {
    siteHeader.classList.toggle('scrolled', y > 12);
    const menuOpen = navlinks.classList.contains('open');
    const goingDown = y > lastY && y > 240;
    siteHeader.classList.toggle('hide', goingDown && !menuOpen);
  }
  lastY = y;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

function setMenu(open) {
  navlinks.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
burger.setAttribute('aria-expanded', 'false');
burger.addEventListener('click', () => setMenu(!navlinks.classList.contains('open')));
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => {
  if (navlinks.classList.contains('open') && !navlinks.contains(e.target) && !burger.contains(e.target)) setMenu(false);
});
window.addEventListener('resize', () => { if (window.innerWidth > 920) setMenu(false); });
measure();
onScroll();
window.addEventListener('load', () => { measure(); onScroll(); });
window.addEventListener('resize', measure, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

const navAnchors = [...navlinks.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
const sections = navAnchors.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (sections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

['.skills-grid', '.process-grid', '.pricing-grid', '.about-grid', '.contact-split', '.hero-grid'].forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => {
      el.style.setProperty('--d', `${i * 0.08}s`);
    });
  });
});
document.querySelectorAll('.section-head .reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
document.querySelectorAll('.hero .reveal').forEach(el => el.style.setProperty('--d', '.15s'));

const revealEls = document.querySelectorAll('.reveal');
if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => io.observe(el));
}

const codeLines = [
  { text: 'const ', cls: 'kw' }, { text: 'desarrollador', cls: 'prop' }, { text: ' = {\n', cls: '' },
  { text: '  nombre: ', cls: 'prop' }, { text: '"Alejandro Tellez"', cls: 'str' }, { text: ',\n', cls: '' },
  { text: '  especialidad: ', cls: 'prop' }, { text: '"Desarrollo Web"', cls: 'str' }, { text: ',\n', cls: '' },
  { text: '  experiencia: ', cls: 'prop' }, { text: '"Frontend + Backend"', cls: 'str' }, { text: ',\n', cls: '' },
  { text: '  disponibilidad: ', cls: 'prop' }, { text: '"Disponible"', cls: 'str' }, { text: ',\n', cls: '' },
  { text: '  café: ', cls: 'prop' }, { text: '"☕ 100%"', cls: 'str' }, { text: '\n', cls: '' },
  { text: '};', cls: '' }
];
const typeEl = document.getElementById('typewriter');

function typeEffect() {
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  const spans = codeLines.map(seg => {
    const s = document.createElement('span');
    s.className = seg.cls;
    typeEl.appendChild(s);
    return s;
  });
  typeEl.appendChild(cursor);
  if (prefersReduced) { spans.forEach((s, i) => { s.textContent = codeLines[i].text; }); return; }
  let seg = 0, ch = 0;
  (function step() {
    if (seg >= codeLines.length) return;
    ch++;
    spans[seg].textContent = codeLines[seg].text.slice(0, ch);
    if (ch >= codeLines[seg].text.length) { seg++; ch = 0; }
    setTimeout(step, 22);
  })();
}
if (typeEl) setTimeout(typeEffect, 600);

const rotateWords = ['seguro', 'moderno', 'profesional', 'confiable'];
const rotateColors = ['#253745', '#2F6B93', '#11212D', '#4A7FA3'];
const rwEl = document.getElementById('rotateWordInner');
if (rwEl && !prefersReduced) {
  let rwIndex = 0;
  setInterval(() => {
    rwEl.classList.add('rw-out');
    setTimeout(() => {
      rwIndex = (rwIndex + 1) % rotateWords.length;
      rwEl.textContent = rotateWords[rwIndex];
      rwEl.style.color = rotateColors[rwIndex];
      rwEl.classList.remove('rw-out');
      rwEl.classList.add('rw-in');
      requestAnimationFrame(() => requestAnimationFrame(() => rwEl.classList.remove('rw-in')));
    }, 380);
  }, 2400);
}

if (canHover && !prefersReduced) {
  document.querySelectorAll('.skill-card, .process-card, .price-card, .about-card, .terminal, .quality-banner, .contact-form-card, .contact-direct-card').forEach(card => {
    let raf = 0, px = 0, py = 0;
    const paint = () => {
      raf = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((px - rect.left) / rect.width) * 100 + '%');
      card.style.setProperty('--my', ((py - rect.top) / rect.height) * 100 + '%');
    };
    card.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    });
  });

  document.querySelectorAll('.btn, .nav-cta, .cf-submit').forEach(el => {
    el.classList.add('magnetic');
    let raf = null;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${relX * 0.14}px, ${relY * 0.2}px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });

  const meshBlobs = document.querySelectorAll('.bg-mesh span');
  if (meshBlobs.length) {
    let mx = 0, my = 0, tx = 0, ty = 0, running = false;
    const animateMesh = () => {
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      meshBlobs.forEach((blob, i) => {
        const depth = (i + 1) * 6;
        blob.style.translate = `${tx * depth}px ${ty * depth}px`;
      });
      if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) {
        requestAnimationFrame(animateMesh);
      } else {
        running = false;
      }
    };
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!running) { running = true; requestAnimationFrame(animateMesh); }
    }, { passive: true });
  }
}

const heroEl = document.querySelector('.hero');
if (heroEl && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('hero-offscreen', !entry.isIntersecting);
  }).observe(heroEl);
}

const form = document.getElementById('contactForm');
if (form) {
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.closest('.cf-field').classList.remove('invalid'));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fields = ['nombre', 'asunto', 'mensaje'].map(id => document.getElementById(id));
    let firstInvalid = null;
    fields.forEach(f => {
      const empty = !f.value.trim();
      f.closest('.cf-field').classList.toggle('invalid', empty);
      if (empty && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const [nombre, asunto, mensaje] = fields.map(f => f.value.trim());
    const texto =
`Hola Alejandro, te contacto desde tu página web.

Nombre: ${nombre}
Asunto: ${asunto}

Mensaje:
${mensaje}`;

    const url = `https://wa.me/526246121168?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
    form.reset();
  });
}