// Scroll progress bar + header elevado al hacer scroll
const scrollProgress = document.getElementById('scrollProgress');
const siteHeader = document.querySelector('header');
function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${pct})`;
  if (siteHeader) siteHeader.classList.toggle('scrolled', scrollTop > 12);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById('burger');
const navlinks = document.getElementById('navlinks');
burger.addEventListener('click', () => {
  navlinks.classList.toggle('open');
});
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Typewriter hero
const codeLines = [
  { text: 'const ', cls: 'kw' },{ text: 'desarrollador', cls: 'prop' },{ text: ' = {\n', cls:'' },
  { text: '  nombre: ', cls: 'prop' },{ text: '"Alejandro Téllez"', cls: 'str' },{ text: ',\n', cls:'' },
  { text: '  especialidad: ', cls: 'prop' },{ text: '"Desarrollo Web"', cls: 'str' },{ text: ',\n', cls:'' },
  { text: '  experiencia: ', cls: 'prop' },{ text: '"Frontend + Backend"', cls: 'str' },{ text: ',\n', cls:'' },
  { text: '  disponibilidad: ', cls: 'prop' },{ text: '"Disponible"', cls: 'str' },{ text: ',\n', cls:'' },
  { text: '  café: ', cls: 'prop' },{ text: '"☕ 100%"', cls: 'str' },{ text: '\n', cls:'' },
  { text: '};', cls: '' }
];
const el = document.getElementById('typewriter');

function typeEffect(){
  el.innerHTML = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  const totalChars = codeLines.reduce((sum, seg) => sum + seg.text.length, 0);

  function step(){
    if(i <= totalChars){
      let result = '';
      let remaining = i;
      for(const seg of codeLines){
        if(remaining <= 0) break;
        const take = Math.min(seg.text.length, remaining);
        result += `<span class="${seg.cls}">${seg.text.slice(0, take)}</span>`;
        remaining -= take;
      }
      el.innerHTML = result;
      el.appendChild(cursor);
      i++;
      setTimeout(step, 14);
    }
  }
  step();
}
setTimeout(typeEffect, 500);

// Frase con palabra rotativa
const rotateWords = ['seguro', 'moderno', 'profesional', 'confiable'];
const rotateColors = ['#1638FF', '#0033CC', '#2451FF', '#122FA6'];
const rwEl = document.getElementById('rotateWordInner');
if (rwEl) {
  let rwIndex = 0;
  setInterval(() => {
    rwEl.classList.add('rw-out');
    setTimeout(() => {
      rwIndex = (rwIndex + 1) % rotateWords.length;
      rwEl.textContent = rotateWords[rwIndex];
      rwEl.style.color = rotateColors[rwIndex];
      rwEl.classList.remove('rw-out');
      rwEl.classList.add('rw-in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => rwEl.classList.remove('rw-in'));
      });
    }, 350);
  }, 2000);
}

// Contador animado para las estadísticas de logros
const achieveStats = document.querySelectorAll('.achieve-stats .num');
if (achieveStats.length) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const target = parseInt(raw, 10);
      if (!isNaN(target)) {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 20));
        const suffix = raw.replace(/^[0-9]+/, '');
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = current + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
      }
      statsIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  achieveStats.forEach(el => statsIO.observe(el));
}

// Liquid glass — brillo que sigue el cursor sobre las tarjetas
const glassCards = document.querySelectorAll(
  '.skill-card, .process-card, .price-card, .about-card, .achieve-card, .contact-form-card, .contact-direct-card, .cd-item, .terminal, .quality-banner'
);
glassCards.forEach(card => {
  card.style.position = card.style.position || 'relative';
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// Liquid glass — botones magnéticos
const magneticEls = document.querySelectorAll('.btn, .cf-submit, .nav-cta, .logo-mark');
magneticEls.forEach(el => {
  el.classList.add('magnetic');
  let raf = null;
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const strength = 0.28;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    });
  });
  el.addEventListener('pointerleave', () => {
    if (raf) cancelAnimationFrame(raf);
    el.style.transform = 'translate(0, 0)';
  });
});

// Fondo liquid — los blobs reaccionan levemente al movimiento del mouse
const meshBlobs = document.querySelectorAll('.bg-mesh span');
if (meshBlobs.length) {
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  function animateMesh() {
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;
    meshBlobs.forEach((blob, i) => {
      const depth = (i + 1) * 6;
      blob.style.marginLeft = `${tx * depth}px`;
      blob.style.marginTop = `${ty * depth}px`;
    });
    requestAnimationFrame(animateMesh);
  }
  animateMesh();
}

// Contact form -> mailto
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const mensaje = document.getElementById('mensaje').value;
  const subject = encodeURIComponent('Nuevo proyecto web — ' + nombre);
  const body = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`);
  window.location.href = `mailto:alexitoxnv@gmail.com?subject=${subject}&body=${body}`;
});
