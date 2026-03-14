/* ============================================
   WHONVITE — Doctor Who Invitation
   Interactive Scroll Experience
   ============================================ */

(function () {
  'use strict';

  // --- Canvas Starfield with Twinkling & Shooting Stars ---
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, stars, shootingStars;
    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 150 : 400;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 2,
          size: Math.random() * 2 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth: Math.random() * 3 + 1, // parallax depth layer
        });
      }
      shootingStars = [];
    }

    function spawnShootingStar() {
      if (shootingStars.length > 2) return;
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        angle: (Math.random() * 0.4 + 0.2) * Math.PI, // ~36-108 degrees
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      });
    }

    let scrollY = 0;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / width - 0.5) * 2;
        targetMouseY = (e.clientY / height - 0.5) * 2;
      });
    }

    let frameCount = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      // Draw stars
      for (const star of stars) {
        const parallaxY = scrollY * star.depth * -0.03;
        const mouseOffsetX = mouseX * star.depth * 8;
        const mouseOffsetY = mouseY * star.depth * 5;
        const drawX = star.x + mouseOffsetX;
        let drawY = (star.y + parallaxY + mouseOffsetY) % (height * 2);
        if (drawY < 0) drawY += height * 2;
        if (drawY > height) continue;

        // Twinkling
        const twinkle = Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.baseAlpha + twinkle * 0.25;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, alpha)})`;
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, alpha * 0.08)})`;
          ctx.fill();
        }
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha = 1 - (s.life / s.maxLife);

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.6, `rgba(200, 220, 255, ${s.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
      }

      // Occasionally spawn shooting stars
      if (Math.random() < 0.008) spawnShootingStar();

      requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createStars();
    });
  }

  // --- Floating Cosmic Particles ---
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 20 : 50;

    let width, height, particles;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.3,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.15 - 0.05,
          alpha: Math.random() * 0.3 + 0.05,
          hue: Math.random() > 0.7 ? 200 : (Math.random() > 0.5 ? 45 : 280), // cyan, gold, or purple
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
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

  // --- Scroll-Driven Gradient Overlay ---
  function initGradientOverlay() {
    const overlay = document.getElementById('gradient-overlay');
    if (!overlay) return;

    const sectionColors = [
      { id: 'hero', color: 'rgba(0, 0, 0, 0)' },
      { id: 'the-doctor', color: 'rgba(244, 197, 66, 0.04)' },
      { id: 'the-tardis', color: 'rgba(0, 59, 111, 0.06)' },
      { id: 'regeneration', color: 'rgba(244, 197, 66, 0.05)' },
      { id: 'companions', color: 'rgba(232, 152, 90, 0.04)' },
      { id: 'villains', color: 'rgba(192, 57, 43, 0.05)' },
      { id: 'why-it-matters', color: 'rgba(108, 52, 131, 0.06)' },
      { id: 'invitation', color: 'rgba(0, 180, 216, 0.04)' },
    ];

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const match = sectionColors.find(s => s.id === entry.target.id);
            if (match) {
              overlay.style.background = `radial-gradient(ellipse at center, ${match.color} 0%, transparent 70%)`;
              overlay.style.opacity = '1';
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionColors.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) sectionObserver.observe(el);
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
    initStarfield();
    initParticles();
    initHero();
    initObserver();
    initProgressBar();
    initGradientOverlay();
    initBlinkEasterEgg();
    initCTA();
  });
})();
