/* ============================================
   WHONVITE — Doctor Who Invitation
   Interactive Scroll Experience
   ============================================ */

(function () {
  'use strict';

  // --- Star Generation ---
  function generateStars(count, layer) {
    const shadows = [];
    const w = window.innerWidth;
    const h = window.innerHeight * 2;
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * w);
      const y = Math.floor(Math.random() * h);
      const size = layer === 'small' ? 1 : layer === 'medium' ? 1.5 : 2;
      const alpha = (Math.random() * 0.5 + 0.5).toFixed(2);
      shadows.push(`${x}px ${y}px 0 ${size}px rgba(255, 255, 255, ${alpha})`);
    }
    return shadows.join(', ');
  }

  function initStars() {
    const isMobile = window.innerWidth < 768;
    const small = document.querySelector('.stars-small');
    const medium = document.querySelector('.stars-medium');
    const large = document.querySelector('.stars-large');

    if (small) small.style.boxShadow = generateStars(isMobile ? 80 : 200, 'small');
    if (medium) medium.style.boxShadow = generateStars(isMobile ? 40 : 100, 'medium');
    if (large) large.style.boxShadow = generateStars(isMobile ? 15 : 40, 'large');
  }

  // --- Intersection Observer for Section Visibility ---
  function initObserver() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  // --- Parallax Starfield ---
  function initParallax() {
    const small = document.querySelector('.stars-small');
    const medium = document.querySelector('.stars-medium');
    const large = document.querySelector('.stars-large');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (small) small.style.transform = `translateY(${scrollY * -0.02}px)`;
          if (medium) medium.style.transform = `translateY(${scrollY * -0.05}px)`;
          if (large) large.style.transform = `translateY(${scrollY * -0.1}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Scroll Progress Bar ---
  function initProgressBar() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
      });
    });
  }

  // --- DON'T BLINK Easter Egg ---
  function initBlinkEasterEgg() {
    const angel = document.querySelector('.angel-silhouette');
    if (!angel) return;

    let blinkCount = 0;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;

      const villainsSection = document.querySelector('#villains');
      if (!villainsSection) return;

      const rect = villainsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        blinkCount++;
        if (blinkCount === 1) {
          angel.classList.add('closer');
        } else if (blinkCount >= 2) {
          angel.classList.add('closest');
        }
      }
    });
  }

  // --- CTA Button Flash ---
  function initCTA() {
    const button = document.getElementById('say-yes');
    const flash = document.getElementById('flash-overlay');
    const postYes = document.getElementById('post-yes');
    if (!button || !flash || !postYes) return;

    button.addEventListener('click', () => {
      flash.classList.add('flash-active');
      button.style.display = 'none';

      setTimeout(() => {
        postYes.classList.remove('hidden');
        postYes.classList.add('shown');
      }, 800);

      setTimeout(() => {
        flash.classList.remove('flash-active');
      }, 1500);
    });
  }

  // --- Hero section auto-visible ---
  function initHero() {
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('visible');
  }

  // --- Initialize Everything ---
  document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initHero();
    initObserver();
    initParallax();
    initProgressBar();
    initBlinkEasterEgg();
    initCTA();
  });

  // Regenerate stars on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initStars, 300);
  });
})();
