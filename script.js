/* ============================================================
   RESTAURACE NA RŮŽKU — JavaScript
   ============================================================ */

'use strict';

/* ========== 1. NAVBAR SCROLL BEHAVIOR ========== */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call
})();

/* ========== 2. HAMBURGER / MOBILE MENU ========== */
(function () {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!hamburger || !mobileMenu) return;

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMobileMenu();
  });
})();

/* ========== 3. SMOOTH SCROLL for ANCHOR LINKS ========== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ========== 4. INTERSECTION OBSERVER — SCROLL ANIMATIONS ========== */
(function () {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* ========== 5. ANIMATED COUNT-UP NUMBERS ========== */
(function () {
  const counters = document.querySelectorAll('.count[data-target]');
  if (!counters.length) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);

      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));
})();

/* ========== 6. GALLERY STRIP — DRAG TO SCROLL ========== */
(function () {
  const strip = document.getElementById('gallery-strip');
  if (!strip) return;

  let isDown  = false;
  let startX;
  let scrollLeft;

  // Pause auto-scroll animation on user interaction
  function pauseAnimation() {
    strip.classList.add('no-animation');
    strip.style.transform = 'none';
  }

  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    pauseAnimation();
    strip.style.cursor = 'grabbing';
    startX    = e.pageX - strip.offsetLeft;
    scrollLeft = strip.parentElement.scrollLeft;
  });

  strip.addEventListener('mouseleave', () => { isDown = false; strip.style.cursor = 'grab'; });
  strip.addEventListener('mouseup',    () => { isDown = false; strip.style.cursor = 'grab'; });

  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 1.5;
    strip.parentElement.scrollLeft = scrollLeft - walk;
  });

  // Touch events
  let touchStartX = 0;
  strip.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    pauseAnimation();
  }, { passive: true });
})();

/* ========== 7. CONTACT FORM SUBMIT ========== */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name')?.value.trim();
    const contact = document.getElementById('form-contact')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !contact || !message) {
      // Shake the missing fields
      [
        { id: 'form-name',    val: name },
        { id: 'form-contact', val: contact },
        { id: 'form-message', val: message },
      ].forEach(({ id, val }) => {
        if (!val) shakeElement(document.getElementById(id));
      });
      return;
    }

    // Simulate submission
    if (submitBtn) {
      submitBtn.textContent = 'Odesílám...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      showFormSuccess();
    }, 1200);
  });

  function showFormSuccess() {
    // Build success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
      <div style="text-align:center; padding: 2rem 1rem; animation: heroFadeIn 0.5s ease">
        <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--color-amber); margin-bottom:0.75rem;">Zpráva odeslána!</h3>
        <p style="color:rgba(245,240,232,0.6); font-size:0.95rem; line-height:1.7;">Děkujeme za váš zájem. Ozveme se vám co nejdříve — obvykle do 24 hodin.</p>
        <p style="margin-top: 1.5rem; color:rgba(245,240,232,0.5); font-size: 0.85rem;">Nebo nás klidně kontaktujte telefonicky: <a href="tel:+420583445282" style="color:var(--color-amber)">583 445 282</a></p>
      </div>
    `;
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      form.innerHTML = '';
      form.appendChild(successMsg);
      form.style.opacity = '1';
    }, 300);
  }

  function shakeElement(el) {
    if (!el) return;
    el.style.borderColor = '#e05454';
    el.style.boxShadow   = '0 0 0 3px rgba(224,84,84,0.2)';
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ], { duration: 350, easing: 'ease-in-out' });

    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    }, 2000);
  }
})();

/* ========== 8. ACTIVE NAV LINK ON SCROLL ========== */
(function () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = 'var(--color-amber)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));
})();

/* ========== 9. PRELOAD IMAGES ========== */
(function () {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => imgObserver.observe(img));
  }
})();

/* ========== 10. SCROLL PROGRESS BAR ========== */
(function () {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(to right, var(--color-amber), var(--color-terracotta));
    width: 0%;
    z-index: 9999;
    transition: width 0.1s ease;
    pointer-events: none;
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${progress}%`;
  }, { passive: true });
})();
