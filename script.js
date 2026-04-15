/**
 * RevolTech — Shared Interactivity
 * Pure vanilla JS — no dependencies
 */

/* ─────────────────────────────────────────
   1. NAVBAR GLASS BLUR ON SCROLL
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const toggle = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle(); // initial call in case page loads scrolled
})();

/* ─────────────────────────────────────────
   2. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
───────────────────────────────────────── */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   3. COUNTER ANIMATION (Homepage Stats)
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const raw = el.dataset.target;            // e.g. "48500" or "1200"
    const suffix = el.dataset.suffix || '';   // e.g. "+" or "T"
    const prefix = el.dataset.prefix || '';   // e.g. "৳"
    const target = parseFloat(raw);
    const duration = 2200;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = Math.round(eased * target);

      // Format with commas for large numbers
      const formatted = value >= 1000
        ? value.toLocaleString('en-IN')
        : value.toString();

      el.textContent = prefix + formatted + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // Only start counter when the element enters the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   4. MOBILE SIDEBAR TOGGLE
───────────────────────────────────────── */
(function initSidebarToggle() {
  // Add a hamburger toggle button if sidebar is collapsed (≤768px)
  const sidebar = document.querySelector('.sidebar');
  const appShell = document.querySelector('.app-shell');
  if (!sidebar || !appShell) return;

  // Create toggle button
  const btn = document.createElement('button');
  btn.className = 'sidebar-mobile-toggle';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML = '☰';
  btn.style.cssText = [
    'display:none',
    'position:fixed',
    'top:18px',
    'left:14px',
    'z-index:1100',
    'width:38px',
    'height:38px',
    'border-radius:8px',
    'background:var(--clr-surface-2)',
    'border:1px solid var(--clr-border)',
    'color:var(--clr-white)',
    'font-size:18px',
    'cursor:pointer',
    'align-items:center',
    'justify-content:center',
    'transition:all .2s',
  ].join(';');

  document.body.appendChild(btn);

  function onResize() {
    if (window.innerWidth <= 768) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
      sidebar.classList.remove('sidebar-open');
    }
  }

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
    btn.innerHTML = sidebar.classList.contains('sidebar-open') ? '✕' : '☰';
  });

  // Close sidebar when a link is clicked on mobile
  sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('sidebar-open');
        btn.innerHTML = '☰';
      }
    });
  });

  window.addEventListener('resize', onResize, { passive: true });
  onResize();
})();

/* ─────────────────────────────────────────
   5. ACTIVE SIDEBAR LINK HIGHLIGHT
───────────────────────────────────────── */
(function highlightActiveSidebarLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });
})();

/* ─────────────────────────────────────────
   6. SMOOTH SCROLL FOR ANCHOR LINKS
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─────────────────────────────────────────
   7. NOTIFICATION BELL DEMO (Topbar)
───────────────────────────────────────── */
(function initNotifBell() {
  const bell = document.querySelector('.topbar-notif-btn');
  if (!bell) return;
  bell.addEventListener('click', () => {
    bell.style.transform = 'rotate(20deg)';
    setTimeout(() => { bell.style.transform = ''; }, 200);
  });
})();

/* ─────────────────────────────────────────
   8. HERO PARALLAX (Homepage only)
───────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const orbs = hero.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   9. CATEGORIES CARD TILT (Homepage)
───────────────────────────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.category-card, .stat-card, .admin-kpi').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────
   10. FORM INPUT FLOAT LABEL POLISH
───────────────────────────────────────── */
(function initInputPolish() {
  document.querySelectorAll('.input, .select, .textarea').forEach((el) => {
    el.addEventListener('focus', () => {
      el.closest('.form-group')?.classList.add('focused');
    });
    el.addEventListener('blur', () => {
      el.closest('.form-group')?.classList.remove('focused');
    });
  });
})();
