/* ============================================================
   NiFTi — nifti.js
   Top Bar · Theme · Sidebar · Reveals · Network Canvas · SoS
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. STICKY TOP BAR SCROLL ────────────────────────────── */
  const topBar = document.getElementById('topBar');
  if (topBar) {
    function updateTopBar() {
      topBar.classList.toggle('solid', window.scrollY > 40);
    }
    window.addEventListener('scroll', updateTopBar, { passive: true });
    updateTopBar();
  }

  /* ── 1b. MOBILE NAV TOGGLE ──────────────────────────────── */
  window.toggleMobileNav = function () {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      toggleSidebar();
      return;
    }
    var links = document.getElementById('tbLinks');
    if (!links) return;
    links.classList.toggle('open');
  };

  /* ── 1c. DARK / LIGHT THEME TOGGLE ─────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nifti-theme', theme);
    var icon = document.getElementById('themeIcon');
    if (icon) {
      if (theme === 'light') {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
      } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      }
    }
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  var savedTheme = localStorage.getItem('nifti-theme') || 'dark';
  applyTheme(savedTheme);

  /* ── 2a. SIDEBAR TOGGLE (interior pages) ────────────────── */
  window.toggleSidebar = function () {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sbOverlay');
    const toggle   = document.getElementById('sbToggle');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible', isOpen);
    if (toggle) toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  /* ── 2b. LEGACY MOBILE MENU TOGGLE (home page only) ─────── */
  window.toggleMenu = function (btn) {
    const links = document.getElementById('navlinks');
    if (!links) return;
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open ? '&#10005;' : '&#8801;';
  };

  /* ── 3. REVEAL ON SCROLL ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger siblings slightly
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal'))
              : [];
            const idx = siblings.indexOf(entry.target);
            const delay = idx >= 0 ? idx * 70 : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ── 3b. ACTIVE NAV HIGHLIGHTING ────────────────────────── */
  (function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    // Top bar links
    document.querySelectorAll('.tb-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path) a.classList.add('active');
    });
    // Sidebar links
    document.querySelectorAll('.sb-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  })();

  /* ── 3c. COUNT-UP ANIMATION FOR IMPACT METRICS ──────────── */
  (function () {
    var metricEls = document.querySelectorAll('.bc-metric .val');
    if (!metricEls.length) return;

    function countUp(el) {
      var raw = el.textContent.trim();
      var suffix = raw.replace(/[\d]/g, ''); // e.g. '+' or ''
      var target = parseInt(raw.replace(/\D/g, ''), 10);
      if (isNaN(target)) return;
      var duration = target > 100 ? 1600 : 900;
      var start = null;
      var from = target > 100 ? target - 80 : 0;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(from + (target - from) * ease);
        el.textContent = current + (progress < 1 ? '' : suffix);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var metricObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          metricObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    metricEls.forEach(function (el) { metricObs.observe(el); });
  })();

  /* ── 3d. HERO PARALLAX (desktop only) ───────────────────── */
  (function () {
    // Skip on touch / mobile devices to avoid layout issues
    if (window.matchMedia('(hover: none)').matches) return;
    var heroContent = document.querySelector('.hero-inner');
    if (!heroContent) return;
    window.addEventListener('scroll', function () {
      heroContent.style.transform = 'translateY(' + window.scrollY * 0.14 + 'px)';
    }, { passive: true });
  })();

  /* ── 4. NETWORK CANVAS (hero, index.html) ────────────────── */
  const canvas = document.getElementById('netcanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const CYAN = [47, 183, 201];
    let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
    const NODE_N    = 55;
    const LINK_DIST = 145;
    const SPEED     = 0.28;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function mkNode() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * SPEED,
        vy: (Math.random() - .5) * SPEED,
        r: Math.random() * 1.8 + 1,
      };
    }

    function init() {
      resize();
      nodes = Array.from({ length: NODE_N }, mkNode);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},${alpha})`;
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const glow = dm < 120 ? (1 - dm / 120) * .55 : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},${0.35 + glow * .5})`;
        ctx.fill();
      });
    }

    function update() {
      nodes.forEach((n) => {
        // Gentle mouse repulsion
        const dmx = n.x - mouse.x;
        const dmy = n.y - mouse.y;
        const dm  = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 100 && dm > 0) {
          const f = (100 - dm) / 100 * 0.012;
          n.vx += (dmx / dm) * f;
          n.vy += (dmy / dm) * f;
        }

        // Speed clamp
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > SPEED * 2.4) { n.vx *= .96; n.vy *= .96; }

        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges
        if (n.x < 0)  { n.x = 0;  n.vx = Math.abs(n.vx); }
        if (n.x > W)  { n.x = W;  n.vx = -Math.abs(n.vx); }
        if (n.y < 0)  { n.y = 0;  n.vy = Math.abs(n.vy); }
        if (n.y > H)  { n.y = H;  n.vy = -Math.abs(n.vy); }
      });
    }

    let raf;
    function loop() {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function handleMouse(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function clearMouse() { mouse.x = -9999; mouse.y = -9999; }

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', clearMouse);

    window.addEventListener('resize', () => {
      resize();
      nodes = Array.from({ length: NODE_N }, mkNode);
    });

    init();
    loop();

    // Pause when not visible (perf)
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!raf) loop();
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    });
    heroObs.observe(canvas);
  }

  /* ── 5. SYSTEM-OF-SYSTEMS DIAGRAM ───────────────────────────
     Now rendered as inline SVG in about.html — no JS needed.
     This block is kept as a stub in case a dynamic version
     is added in future.                                        */
  const sosEl = document.getElementById('sosDiagram');
  if (sosEl && sosEl.children.length === 0) {
    // Fallback: only runs if SVG is missing from HTML
    const systems = [
      { label: 'Weather',        icon: '◈' },
      { label: 'Major Events',   icon: '◈' },
      { label: 'Energy Grid',    icon: '◈' },
      { label: 'Telecoms',       icon: '◈' },
      { label: 'Adjacent Roads', icon: '◈' },
      { label: 'Public Transit', icon: '◈' },
    ];

    const ns   = 'http://www.w3.org/2000/svg';
    const SVG  = document.createElementNS(ns, 'svg');
    SVG.setAttribute('viewBox', '0 0 430 430');
    SVG.setAttribute('aria-label', 'System of systems diagram');

    const cx = 215, cy = 215;
    const OR = 165;  // orbit radius
    const N  = systems.length;
    const CYAN_HEX   = '#2FB7C9';
    const CYAN_DIM   = 'rgba(47,183,201,0.18)';
    const TEXT_LIGHT = '#94AABF';

    // Defs: radial glow
    const defs = document.createElementNS(ns, 'defs');
    const grad = document.createElementNS(ns, 'radialGradient');
    grad.setAttribute('id', 'hubGlow');
    grad.setAttribute('cx', '50%'); grad.setAttribute('cy', '50%'); grad.setAttribute('r', '50%');
    const s0 = document.createElementNS(ns, 'stop');
    s0.setAttribute('offset', '0%'); s0.setAttribute('stop-color', CYAN_HEX); s0.setAttribute('stop-opacity', '.22');
    const s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '100%'); s1.setAttribute('stop-color', CYAN_HEX); s1.setAttribute('stop-opacity', '0');
    grad.appendChild(s0); grad.appendChild(s1); defs.appendChild(grad);
    SVG.appendChild(defs);

    // Outer glow
    const glowCirc = document.createElementNS(ns, 'circle');
    glowCirc.setAttribute('cx', cx); glowCirc.setAttribute('cy', cy);
    glowCirc.setAttribute('r', '90'); glowCirc.setAttribute('fill', 'url(#hubGlow)');
    SVG.appendChild(glowCirc);

    systems.forEach((sys, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + OR * Math.cos(angle);
      const ny = cy + OR * Math.sin(angle);

      // Spoke line
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', nx); line.setAttribute('y2', ny);
      line.setAttribute('stroke', CYAN_DIM); line.setAttribute('stroke-width', '1');
      SVG.appendChild(line);

      // Node circle
      const nc = document.createElementNS(ns, 'circle');
      nc.setAttribute('cx', nx); nc.setAttribute('cy', ny);
      nc.setAttribute('r', '22');
      nc.setAttribute('fill', 'rgba(14,25,39,.85)');
      nc.setAttribute('stroke', CYAN_HEX); nc.setAttribute('stroke-width', '1.2');
      nc.setAttribute('stroke-opacity', '.55');
      SVG.appendChild(nc);

      // Node label
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', nx);
      const lines = sys.label.split(' ');
      const lineH = 11;
      const startY = ny - (lines.length - 1) * lineH / 2 + 1;
      lines.forEach((word, wi) => {
        const tspan = document.createElementNS(ns, 'tspan');
        tspan.setAttribute('x', nx);
        tspan.setAttribute('dy', wi === 0 ? `${startY - ny}` : `${lineH}`);
        tspan.textContent = word;
        txt.appendChild(tspan);
      });
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('font-family', "'IBM Plex Mono', monospace");
      txt.setAttribute('font-size', '8.5');
      txt.setAttribute('letter-spacing', '0.04em');
      txt.setAttribute('fill', TEXT_LIGHT);
      txt.setAttribute('text-transform', 'uppercase');
      SVG.appendChild(txt);
    });

    // Hub ring
    const hubRing = document.createElementNS(ns, 'circle');
    hubRing.setAttribute('cx', cx); hubRing.setAttribute('cy', cy);
    hubRing.setAttribute('r', '52');
    hubRing.setAttribute('fill', 'rgba(14,25,39,.92)');
    hubRing.setAttribute('stroke', CYAN_HEX); hubRing.setAttribute('stroke-width', '1.8');
    SVG.appendChild(hubRing);

    // Hub label
    const hubTxt = document.createElementNS(ns, 'text');
    hubTxt.setAttribute('x', cx); hubTxt.setAttribute('y', cy - 6);
    hubTxt.setAttribute('text-anchor', 'middle');
    hubTxt.setAttribute('font-family', "'Space Grotesk', sans-serif");
    hubTxt.setAttribute('font-weight', '700');
    hubTxt.setAttribute('font-size', '18');
    hubTxt.setAttribute('fill', '#ffffff');
    hubTxt.textContent = 'NiFTi';
    SVG.appendChild(hubTxt);

    const hubSub = document.createElementNS(ns, 'text');
    hubSub.setAttribute('x', cx); hubSub.setAttribute('y', cy + 12);
    hubSub.setAttribute('text-anchor', 'middle');
    hubSub.setAttribute('font-family', "'IBM Plex Mono', monospace");
    hubSub.setAttribute('font-size', '7.5');
    hubSub.setAttribute('letter-spacing', '.12em');
    hubSub.setAttribute('fill', CYAN_HEX);
    hubSub.textContent = 'HUB';
    SVG.appendChild(hubSub);

    sosEl.appendChild(SVG);

    // Subtle rotation animation
    let angle = 0;
    function rotateSos() {
      angle += 0.002;
      SVG.style.transform = `rotate(${angle}rad)`;
      SVG.style.transformOrigin = `${cx}px ${cy}px`;
      requestAnimationFrame(rotateSos);
    }
    rotateSos();
  }

})();
