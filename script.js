/* ============================================================
   AURAFX AUTOMOTIVE STUDIO — SHARED SCRIPT
   Scroll reveals · Nav · Hamburger · Particles · Filters
   ============================================================ */

/* ── NAV SCROLL BEHAVIOUR ── */
(function() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER MENU ── */
(function() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('navDrawer');
  if (!btn || !drawer) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── HERO PARTICLES (index only) ── */
(function() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px;
      height:${size}px;
      animation-duration:${8 + Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
      opacity:${0.2 + Math.random()*0.5};
    `;
    container.appendChild(p);
  }
})();

/* ── SERVICE CARD CLICKS (index) ── */
(function() {
  document.querySelectorAll('.svc-card[data-href]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = card.dataset.href;
    });
    card.style.cursor = 'pointer';
  });
})();

/* ── SERVICES PAGE FILTER ── */
(function() {
  const filterBtns = document.querySelectorAll('.svc-filter-btn');
  const categories = document.querySelectorAll('.svc-category');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      categories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.style.display = '';
          cat.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
})();

/* ── PORTFOLIO PAGE FILTER ── */
(function() {
  const filterBtns = document.querySelectorAll('.port-filter-btn');
  const items = document.querySelectorAll('.port-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity    = show ? '1' : '0';
        item.style.transform  = show ? 'scale(1)'   : 'scale(0.95)';
        item.style.transition = 'opacity 0.4s, transform 0.4s';
        item.style.display    = show ? '' : 'none';
        if (show) {
          requestAnimationFrame(() => {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
          });
        }
      });
    });
  });
})();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── CSS ANIMATION KEYFRAME INJECTION ── */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ── PASSIVE PARALLAX (subtle depth on scroll) ── */
(function() {
  const heroStage = document.querySelector('.hero-stage');
  if (!heroStage) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroStage.style.transform = `translateY(${y * 0.25}px) translateY(-50%)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── HERO STAT COUNTER ANIMATION ── */
(function() {
  const stats = document.querySelectorAll('.hero-stat strong');
  if (!stats.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const text = el.textContent;
      const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');
      if (isNaN(num)) return;
      let start = 0;
      const duration = 1400;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = (num < 10 ? (num * ease).toFixed(1) : Math.round(num * ease)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = text;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
})();

/* ── FORM VALIDATION ENHANCEMENT (contact page) ── */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('blur', () => {
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(239,68,68,0.5)';
        field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
      } else {
        field.style.borderColor = 'rgba(34,197,94,0.4)';
        field.style.boxShadow   = '0 0 0 3px rgba(34,197,94,0.08)';
      }
    });
  });
})();

console.log('%cAURAFX Automotive Studio', 'font-family:sans-serif;font-size:18px;font-weight:700;color:#3B82F6;');
console.log('%cPrecision. Protection. Personality.', 'font-family:sans-serif;font-size:12px;color:#6B7280;');
