/* ============================================================
   AURAFX AUTOMOTIVE STUDIO — CINEMATIC ENGINE v2.0
   Smooth scroll reveals · Parallax · Counters · Nav · Filters
   All animations: transform + opacity only (60fps)
   ============================================================ */

(function() {
  'use strict';

  /* ══════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════ */
  const raf = window.requestAnimationFrame;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /* ══════════════════════════════════════════
     NAV — Scroll glassmorphism
  ══════════════════════════════════════════ */
  const nav = document.getElementById('mainNav');
  if (nav) {
    let lastScroll = 0;
    const onNavScroll = () => {
      const y = window.scrollY;
      if (y > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = y;
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ══════════════════════════════════════════
     HAMBURGER MENU
  ══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('navDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══════════════════════════════════════════
     CINEMATIC SCROLL REVEAL
     IntersectionObserver with proper thresholds
  ══════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ══════════════════════════════════════════
     PARALLAX ENGINE
     Smooth, performant parallax on scroll
     Uses transform only, requestAnimationFrame
  ══════════════════════════════════════════ */
  const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-med, .parallax-fast');
  
  if (parallaxElements.length) {
    let scrollY = window.scrollY;
    let ticking = false;

    const updateParallax = () => {
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const distance = (centerY - viewCenter) / window.innerHeight;

        let speed = 0.05;
        if (el.classList.contains('parallax-med')) speed = 0.1;
        if (el.classList.contains('parallax-fast')) speed = 0.15;

        const offset = distance * speed * window.innerHeight;
        el.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      if (!ticking) {
        raf(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // Initial call
    updateParallax();
  }

  /* ══════════════════════════════════════════
     NUMBER COUNTER ANIMATION
     Smooth count-up when element enters view
  ══════════════════════════════════════════ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1800;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = clamp(elapsed / duration, 0, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = prefix + current + (target > 99 ? '+' : '') + suffix;

            if (progress < 1) {
              raf(animate);
            } else {
              el.textContent = prefix + target + (target > 99 ? '+' : '') + suffix;
            }
          };

          raf(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ══════════════════════════════════════════
     SMOOTH SECTION TRANSITIONS
     Add subtle opacity transition between sections
  ══════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[class*="scene-"]');
  if (sections.length > 1) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      if (!section.classList.contains('scene-immersion')) {
        section.style.opacity = '1'; // Ensure visible, CSS handles the reveal
      }
      sectionObserver.observe(section);
    });
  }

  /* ══════════════════════════════════════════
     SERVICES PAGE — Filter System
  ══════════════════════════════════════════ */
  const svcFilterBtns = document.querySelectorAll('.svc-filter-btn');
  const svcCategories = document.querySelectorAll('.svc-category');
  if (svcFilterBtns.length && svcCategories.length) {
    svcFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        svcFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        svcCategories.forEach(cat => {
          if (filter === 'all' || cat.dataset.category === filter) {
            cat.style.display = '';
            cat.style.opacity = '0';
            cat.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              cat.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
              cat.style.opacity = '1';
              cat.style.transform = 'translateY(0)';
            });
          } else {
            cat.style.opacity = '0';
            cat.style.transform = 'translateY(20px)';
            setTimeout(() => { cat.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════
     PORTFOLIO PAGE — Filter System
  ══════════════════════════════════════════ */
  const portFilterBtns = document.querySelectorAll('.port-filter-btn');
  const portItems = document.querySelectorAll('.port-item');
  if (portFilterBtns.length && portItems.length) {
    portFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        portFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        portItems.forEach((item, i) => {
          const show = filter === 'all' || item.dataset.category === filter;
          if (show) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95) translateY(16px)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            }, i * 60);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════
     PORTFOLIO — Before/After Sliders
  ══════════════════════════════════════════ */
  document.querySelectorAll('[data-slider]').forEach(wrap => {
    const line = wrap.querySelector('.ba-slider-line');
    const before = wrap.querySelector('.ba-img-before');
    if (!line || !before) return;

    let dragging = false;

    const setPosition = (clientX) => {
      const rect = wrap.getBoundingClientRect();
      const pct = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      line.style.left = pct + '%';
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    };

    const onStart = () => { dragging = true; };
    const onEnd = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    line.addEventListener('mousedown', onStart);
    line.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
  });

  /* ══════════════════════════════════════════
     SHOWROOM — Finish Selector
  ══════════════════════════════════════════ */
  const finishTabs = document.querySelectorAll('.finish-tab');
  if (finishTabs.length) {
    const carBody = document.getElementById('carBody');
    const carCabin = document.getElementById('carCabin');
    const carView = document.getElementById('finishCarView');
    const carSvg = document.getElementById('carSvg');
    const finishTitle = document.getElementById('finishTitle');
    const finishDesc = document.getElementById('finishDesc');
    const finishType = document.getElementById('finishType');
    const finishDurability = document.getElementById('finishDurability');
    const finishStart = document.getElementById('finishStart');

    const finishes = {
      blue:   { title:'Original Deep Blue', desc:'A rich deep blue with satin metallic sheen.', type:'Satin Metallic', dur:'5–7 Years', price:'₹35,000+', body:'#1a2d4a', cabin:'#1e3352', bg:'rgba(10,18,35,1)', glow:'rgba(59,130,246,0.25)' },
      matte:  { title:'Matte Black', desc:'Flat, non-reflective black. Aggressive and stealthy.', type:'Matte Vinyl', dur:'5–7 Years', price:'₹35,000+', body:'#0a0a0a', cabin:'#111', bg:'rgba(6,6,8,1)', glow:'rgba(40,40,60,0.3)' },
      red:    { title:'Gloss Red', desc:'Vivid, saturated gloss red that catches every light.', type:'Gloss Vinyl', dur:'5–7 Years', price:'₹37,000+', body:'#c0392b', cabin:'#e74c3c', bg:'rgba(20,6,6,1)', glow:'rgba(220,50,30,0.25)' },
      satin:  { title:'Satin Forest Green', desc:'Military-inspired deep green with satin sheen.', type:'Satin Vinyl', dur:'5–7 Years', price:'₹37,000+', body:'#1a3a2a', cabin:'#1e4030', bg:'rgba(6,14,8,1)', glow:'rgba(30,100,50,0.2)' },
      chrome: { title:'Chrome Silver', desc:'Mirror-effect chrome film. Maximum impact.', type:'Chrome Film', dur:'3–5 Years', price:'₹55,000+', body:'#c0c8d8', cabin:'#d0d8e8', bg:'rgba(10,12,18,1)', glow:'rgba(192,200,216,0.3)' },
      white:  { title:'Satin Pearl White', desc:'Clean premium white with subtle satin finish.', type:'Satin Vinyl', dur:'5–7 Years', price:'₹36,000+', body:'#e0e0e0', cabin:'#eeeeee', bg:'rgba(12,12,14,1)', glow:'rgba(220,220,220,0.2)' },
      shift:  { title:'Colour Shift Chameleon', desc:'Multi-tonal film shifting purple to blue to green.', type:'Chameleon Film', dur:'4–6 Years', price:'₹65,000+', body:'#6B21A8', cabin:'#7c3aed', bg:'rgba(10,6,18,1)', glow:'rgba(107,33,168,0.3)' },
      army:   { title:'Matte Army Green', desc:'Flat military-grade green for SUVs and off-road.', type:'Matte Vinyl', dur:'5–7 Years', price:'₹36,000+', body:'#2d3a1a', cabin:'#3d4e22', bg:'rgba(8,10,6,1)', glow:'rgba(50,70,20,0.25)' },
    };

    finishTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.key;
        const f = finishes[key];
        if (!f) return;

        finishTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (carBody) carBody.setAttribute('fill', f.body);
        if (carCabin) carCabin.setAttribute('fill', f.cabin);
        if (carView) {
          carView.style.background = f.bg;
          carView.style.setProperty('--car-glow', f.glow);
        }
        if (carSvg) carSvg.style.filter = `drop-shadow(0 20px 60px ${f.glow})`;
        if (finishTitle) finishTitle.textContent = f.title;
        if (finishDesc) finishDesc.textContent = f.desc;
        if (finishType) finishType.textContent = f.type;
        if (finishDurability) finishDurability.textContent = f.dur;
        if (finishStart) finishStart.textContent = f.price;
      });
    });
  }

  /* ══════════════════════════════════════════
     CONTACT FORM — Submit Handler
  ══════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formContent = document.getElementById('formContent');
      const formSuccess = document.getElementById('formSuccess');
      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }

  /* ══════════════════════════════════════════
     SMOOTH ANCHOR SCROLL
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════════
     PERFORMANCE — Reduce motion for users who prefer it
  ══════════════════════════════════════════ */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('revealed');
      el.style.transition = 'none';
    });
  }

  /* ══════════════════════════════════════════
     CONSOLE BRANDING
  ══════════════════════════════════════════ */
  console.log('%cAURAFX', 'font-family:sans-serif;font-size:20px;font-weight:800;color:#3B82F6;');
  console.log('%cPrecision. Protection. Personality.', 'font-family:sans-serif;font-size:11px;color:#6B7280;');

})();
