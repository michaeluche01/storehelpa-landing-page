/**
 * Storehelpa — Landing Page Interactivity (storehelpa.com)
 * -----------------------------------------------------------------
 * 1. Interactive Motion-Graphics App Showcase (auto-advance, 3D tilt,
 *    synchronized callouts, keyboard nav, fullscreen lightbox).
 * 2. Interactive 5-Role Permission Console.
 * 3. Interactive Offline -> Reconnect Sync Simulator.
 * 4. Scroll reveal observer (unobserves immediately for zero overhead).
 * 5. Accessible FAQ accordion + mobile nav.
 * 6. Onboarding / Waitlist form wired to Google Sheets Apps Script.
 */

const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyaz18p8ZrwxXalanAh9fWblAy8eIi6dPRcAwOC5_3HMQAKb200BheUldudCnORSwNh/exec';

async function submitToWaitlist({ email, business }) {
  const res = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      email,
      business,
      source: window.location.hostname || 'storehelpa.com',
    }),
  });

  if (!res.ok) {
    throw new Error('Request failed with status ' + res.status);
  }

  const result = await res.json();
  if (!result.ok) {
    throw new Error(result.error || 'Submission was rejected.');
  }
  return result;
}

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // 1. Scroll Reveal (IntersectionObserver — unobserve immediately)
  // =====================================================================
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  // =====================================================================
  // 2. Mobile Navigation Drawer
  // =====================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  // =====================================================================
  // 3. Interactive Motion-Graphics App Showcase
  // =====================================================================
  const SLIDES = [
    {
      tag: '01 · OVERVIEW',
      route: '/overview',
      url: 'app.storehelpa.com/overview',
      status: 'Live PWA · Synced',
      caption: '01 / Overview — Live Branch Dashboard (app.storehelpa.com/overview)',
      img: '/assets/screens/overview.png',
      title: 'Your branch pulse, refreshed automatically.',
      desc: "See today's gross sales, net sales, transaction count, and average basket at a glance — alongside 7- and 30-day trends, clocked-in staff, active devices, and pending sync status.",
      points: [
        'Role-aware metrics: Cashiers see own sales; Owners see full branch figures.',
        'Export any chart or table to CSV or Excel-compatible .xls in one tap.',
        'Isolated Practice Shop mode lets staff train without touching live books.',
      ],
      callouts: [
        'Live Sales, Net Sales & Avg Sale',
        '1-Click CSV & Excel (.xls) Export',
        '3 / 3 Registered Devices · Sync Center',
      ],
    },
    {
      tag: '02 · POINT OF SALE',
      route: '/sell',
      url: 'app.storehelpa.com/sell',
      status: 'Offline-Ready POS',
      caption: '02 / Point of Sale — Scan-First Checkout (app.storehelpa.com/sell)',
      img: '/assets/screens/pos-sell.jpg',
      title: 'Fast barcode checkout built for busy counters.',
      desc: 'Scan unit or carton codes with a USB/Bluetooth scanner or phone camera, or drive the till straight from the keyboard with F2–F8 shortcuts. Hold carts, split tenders, and print 58mm/80mm receipts.',
      points: [
        'F2 search, F4 charge, F6 hold, F8 new cart — zero mouse hunting.',
        'Record cash with change, bank transfer, POS terminal, or split tenders.',
        'Held carts resume across shared counter devices; VAT calculates cleanly.',
      ],
      callouts: [
        'F2 Search · F4 Charge · F6 Hold · F8 New',
        'HID Barcode Scanner + Phone Camera',
        'Cash, Transfer, POS & Split Payments',
      ],
    },
    {
      tag: '03 · STOCK CONTROL',
      route: '/stock',
      url: 'app.storehelpa.com/stock',
      status: 'Movement Ledger',
      caption: '03 / Stock Control — Movement-Backed Inventory (app.storehelpa.com/stock)',
      img: '/assets/screens/inventory.png',
      title: 'Stock is the sum of every recorded movement.',
      desc: 'Ten focused stock modules keep every shelf honest — receive deliveries with carton aliases, log reasoned adjustments, run partial stock-takes, print labels, and catch low-stock or expiring batches early.',
      points: [
        'Dedicated tabs: Products, Receive, Adjust, Count, Suppliers, Labels & Alerts.',
        'FEFO allocation sells earliest-expiry batches first and blocks expired stock.',
        'Cost prices and margins stay automatically hidden from Cashiers.',
      ],
      callouts: [
        '10 Dedicated Stock Modules',
        'Sum of Every Recorded Movement',
        'FEFO Expiry & Low-Stock Alerts',
      ],
    },
    {
      tag: '04 · TEAM & RULES',
      route: '/attendance',
      url: 'app.storehelpa.com/attendance',
      status: 'Immutable Shifts',
      caption: '04 / Team Attendance & Shift Rules (app.storehelpa.com/attendance)',
      img: '/assets/screens/attendance.png',
      title: 'Accountable shifts and till guardrails, built in.',
      desc: 'Clock events cannot be edited after the fact. Owners and Managers set branch-wide rules that block selling below zero stock, require clock-in before selling, and lock discounts above a limit behind a PIN.',
      points: [
        'Immutable shift clock-ins and clock-outs tied to each registered workstation.',
        'Discounts above the cashier limit require an Owner or Manager PIN.',
        'Export filtered team attendance history to CSV in one click.',
      ],
      callouts: [
        'Immutable Clock-In / Clock-Out Log',
        'Block Below-Zero Sales by Default',
        'Owner PIN on Above-Limit Discounts',
      ],
    },
  ];

  const showcaseSection = document.getElementById('showcase');
  const chapterTabs = Array.from(document.querySelectorAll('.chapter-tab'));
  const thumbCards = Array.from(document.querySelectorAll('.thumb-card'));
  const slideFrames = Array.from(document.querySelectorAll('.screen-slide'));
  const stageUrl = document.getElementById('stage-url');
  const stageStatus = document.getElementById('stage-status');
  const viewportSheen = document.getElementById('viewport-sheen');
  const inspectorTag = document.getElementById('inspector-tag');
  const inspectorRoute = document.getElementById('inspector-route');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');
  const inspectorPoints = document.getElementById('inspector-points');
  const calloutEls = Array.from(document.querySelectorAll('.callout-pill'));
  const playToggleBtn = document.getElementById('showcase-play-toggle');
  const prevBtn = document.getElementById('showcase-prev');
  const nextBtn = document.getElementById('showcase-next');
  const appWindow = document.getElementById('app-window');
  const appViewport = document.getElementById('app-viewport');

  let activeSlide = 0;
  let isPlaying = !prefersReducedMotion;
  let isZoomed = false;
  let slideTimer = null;
  const SLIDE_MS = 3600;
  let remainingMs = SLIDE_MS;
  let timerStartedAt = 0;

  function renderSlide(nextIndex, { triggerSheen = true } = {}) {
    const prevIndex = activeSlide;
    activeSlide = (nextIndex + SLIDES.length) % SLIDES.length;
    const data = SLIDES[activeSlide];

    // Update frames
    slideFrames.forEach((frame, idx) => {
      frame.classList.remove('is-active', 'is-leaving');
      if (idx === activeSlide) {
        frame.classList.add('is-active');
      } else if (idx === prevIndex && prevIndex !== activeSlide) {
        frame.classList.add('is-leaving');
      }
    });

    // Trigger subtle glass sheen pass
    if (triggerSheen && viewportSheen && !prefersReducedMotion) {
      viewportSheen.classList.remove('is-sweeping');
      void viewportSheen.offsetWidth;
      viewportSheen.classList.add('is-sweeping');
    }

    // Update tabs (restart progress animation cleanly)
    chapterTabs.forEach((tab, idx) => {
      const isActive = idx === activeSlide;
      tab.classList.remove('is-active');
      tab.setAttribute('aria-selected', String(isActive));
      if (isActive) {
        void tab.offsetWidth;
        tab.classList.add('is-active');
      }
    });

    // Update filmstrip
    thumbCards.forEach((thumb, idx) => {
      thumb.classList.toggle('is-active', idx === activeSlide);
    });

    // Update chrome + inspector copy
    if (stageUrl) stageUrl.textContent = data.url;
    if (stageStatus) {
      const statusSpan = stageStatus.querySelector('span:last-child');
      if (statusSpan) statusSpan.textContent = data.status;
    }
    if (inspectorTag) inspectorTag.textContent = data.tag;
    if (inspectorRoute) inspectorRoute.textContent = data.route;
    if (inspectorTitle) inspectorTitle.textContent = data.title;
    if (inspectorDesc) inspectorDesc.textContent = data.desc;
    if (inspectorPoints) {
      inspectorPoints.innerHTML = data.points.map((pt) => `<li>${pt}</li>`).join('');
    }

    // Stagger callout pills
    calloutEls.forEach((pill, i) => {
      pill.classList.remove('is-visible');
      const label = pill.querySelector(`[data-callout="${i}"]`);
      if (label && data.callouts[i]) label.textContent = data.callouts[i];
      requestAnimationFrame(() => {
        requestAnimationFrame(() => pill.classList.add('is-visible'));
      });
    });

    // Update lightbox if open
    if (lightbox && !lightbox.hidden) {
      syncLightbox();
    }

    remainingMs = SLIDE_MS;
    scheduleNextSlide();
  }

  function pauseTimer() {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
      const elapsed = Date.now() - timerStartedAt;
      remainingMs = Math.max(250, remainingMs - elapsed);
    }
  }

  function scheduleNextSlide() {
    clearTimeout(slideTimer);
    slideTimer = null;
    if (!isPlaying || isZoomed) return;
    timerStartedAt = Date.now();
    slideTimer = setTimeout(() => {
      slideTimer = null;
      renderSlide(activeSlide + 1);
    }, remainingMs);
  }

  function updatePlayUi() {
    if (!playToggleBtn || !showcaseSection) return;
    const paused = !isPlaying || isZoomed;
    showcaseSection.classList.toggle('showcase-stage-paused', paused);
    playToggleBtn.setAttribute('aria-pressed', String(!isPlaying));
    playToggleBtn.setAttribute('aria-label', isPlaying ? 'Pause auto-tour' : 'Resume auto-tour');
    const iconPause = playToggleBtn.querySelector('.icon-pause');
    const iconPlay = playToggleBtn.querySelector('.icon-play');
    if (iconPause) iconPause.hidden = !isPlaying;
    if (iconPlay) iconPlay.hidden = isPlaying;
  }

  chapterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      renderSlide(Number(tab.dataset.slide));
    });
  });

  thumbCards.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      renderSlide(Number(thumb.dataset.thumb));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => renderSlide(activeSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderSlide(activeSlide + 1));

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      updatePlayUi();
      if (isPlaying) {
        scheduleNextSlide();
      } else {
        pauseTimer();
      }
    });
  }

  // Subtle GPU 3D perspective tilt on pointer devices
  if (appWindow && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    appWindow.addEventListener('pointermove', (e) => {
      const rect = appWindow.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      appWindow.style.setProperty('--ry', (px * 4.5).toFixed(2) + 'deg');
      appWindow.style.setProperty('--rx', (-py * 3.5).toFixed(2) + 'deg');
    });
    appWindow.addEventListener('pointerleave', () => {
      appWindow.style.setProperty('--rx', '0deg');
      appWindow.style.setProperty('--ry', '0deg');
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const stageExpandBtn = document.getElementById('stage-expand');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  function syncLightbox() {
    const data = SLIDES[activeSlide];
    if (lightboxImg) {
      lightboxImg.src = data.img;
      lightboxImg.alt = data.caption;
    }
    if (lightboxCaption) lightboxCaption.textContent = data.caption;
  }

  function openLightbox() {
    if (!lightbox) return;
    isZoomed = true;
    pauseTimer();
    syncLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    updatePlayUi();
  }

  function closeLightbox() {
    if (!lightbox) return;
    isZoomed = false;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    updatePlayUi();
    scheduleNextSlide();
  }

  if (stageExpandBtn) stageExpandBtn.addEventListener('click', openLightbox);
  if (appViewport) appViewport.addEventListener('click', openLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => renderSlide(activeSlide - 1, { triggerSheen: false }));
  if (lightboxNext) lightboxNext.addEventListener('click', () => renderSlide(activeSlide + 1, { triggerSheen: false }));
  document.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') renderSlide(activeSlide + 1, { triggerSheen: false });
      if (e.key === 'ArrowLeft') renderSlide(activeSlide - 1, { triggerSheen: false });
    }
  });

  updatePlayUi();
  scheduleNextSlide();

  // =====================================================================
  // 4. Interactive 5-Role Governance Console
  // =====================================================================
  const ROLES = {
    owner: {
      badge: 'FULL CONTROL + OWNER PIN',
      title: 'Owner',
      summary:
        'Full visibility across sales, stock costs, margins, cash reconciliation, team shifts, immutable reports, and registered-device governance.',
      allow: [
        'Configure shift, VAT, zero-stock & cashier discount rules',
        'Authorize Close Day variances & reopenings with Owner PIN',
        'Generate frozen reports, invite staff & revoke devices',
      ],
      guard: [
        'Original sales & closed snapshots can never be edited',
        'Every approval logs actor, timestamp & registered device',
        'Reopening a closed day always appends a new revision',
      ],
    },
    manager: {
      badge: 'BRANCH OPERATIONS',
      title: 'Manager',
      summary:
        'Runs daily branch operations — approves stock/cash requests, manages inventory receiving and counts, reviews team shifts, and generates branch reports.',
      allow: [
        'Approve staff requisitions, stock adjustments & returns',
        'Generate numbered Day/Month snapshots & export CSV/.xls',
        'Configure shift start, overselling & discount limits',
      ],
      guard: [
        'Close Day cash variances & reopenings still require Owner PIN',
        'Cannot alter historical receipts or delete audit history',
        'Every branch write is scoped strictly to their assigned branch',
      ],
    },
    cashier: {
      badge: 'FAST COUNTER CHECKOUT',
      title: 'Cashier',
      summary:
        'Focused selling workspace built for speed at the counter — scan products, hold and resume carts, record full payments, and clock in/out cleanly.',
      allow: [
        'Sell via barcode scanner, camera or F2–F8 keyboard shortcuts',
        'Hold & resume carts, print 58mm/80mm receipts & share via WhatsApp',
        'Submit stock or cash requests & view own-sales summary',
      ],
      guard: [
        'Zero access to Reports, Audit, Expenses, or cost/profit figures',
        'Discounts above branch limit require an Owner/Manager PIN',
        'Blocked from selling when clocked out or day is locked (if enabled)',
      ],
    },
    storekeeper: {
      badge: 'STOCKROOM & RECEIVING',
      title: 'Storekeeper',
      summary:
        'Dedicated stock control role for receiving supplier deliveries, managing carton aliases, running stock-takes, printing shelf labels, and fulfilling stock requests.',
      allow: [
        'Receive stock with supplier invoice, batch & expiry dates',
        'Run cycle stock-takes, print barcode labels & track alerts',
        'Fulfil approved staff stock requests with full traceability',
      ],
      guard: [
        'Cannot issue cash payouts or edit closed financial days',
        'Adjustments require a logged reason & cannot go below available stock',
        'Full ledger trail ties every unit change to actor & device',
      ],
    },
    auditor: {
      badge: 'READ-ONLY VERIFICATION',
      title: 'Auditor',
      summary:
        'Independent oversight with complete read-only access to dashboards, saved report snapshots, cash/expense timelines, team attendance, and the full audit log.',
      allow: [
        'Inspect saved Day, Month & Year report snapshots unchanged',
        'Print A4 sheets & export complete filtered CSV / .xls records',
        'Verify every actor, timestamp & device across the Audit log',
      ],
      guard: [
        'Strictly read-only — zero ability to sell, adjust stock or edit settings',
        'Cannot generate, delete, or alter snapshots or shift records',
        'Clean separation between operators and financial reviewers',
      ],
    },
  };

  const rolePills = Array.from(document.querySelectorAll('.role-pill'));
  const roleBadge = document.getElementById('role-badge');
  const roleTitle = document.getElementById('role-title');
  const roleSummary = document.getElementById('role-summary');
  const roleAllow = document.getElementById('role-allow');
  const roleGuard = document.getElementById('role-guard');

  rolePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.role;
      const data = ROLES[key];
      if (!data) return;

      rolePills.forEach((p) => {
        const active = p === pill;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-selected', String(active));
      });

      if (roleBadge) roleBadge.textContent = data.badge;
      if (roleTitle) roleTitle.textContent = data.title;
      if (roleSummary) roleSummary.textContent = data.summary;
      if (roleAllow) roleAllow.innerHTML = data.allow.map((item) => `<li>${item}</li>`).join('');
      if (roleGuard) roleGuard.innerHTML = data.guard.map((item) => `<li>${item}</li>`).join('');
    });
  });

  // =====================================================================
  // 5. Interactive Offline -> Reconnect Simulator
  // =====================================================================
  const simBtn = document.getElementById('sim-offline-btn');
  const simBtnLabel = document.getElementById('sim-btn-label');
  const archStage = document.getElementById('arch-stage');
  const archBadge = document.getElementById('arch-state-badge');
  const archNote = document.getElementById('arch-state-note');
  const archLocal = document.getElementById('arch-local-status');
  const archQueue = document.getElementById('arch-queue-count');
  const archCloud = document.getElementById('arch-cloud-status');
  const pipeLabel2 = document.getElementById('pipe-label-2');

  let isSimulatedOffline = false;
  let reconnectTimer = null;

  if (simBtn && archStage) {
    simBtn.addEventListener('click', () => {
      clearTimeout(reconnectTimer);
      isSimulatedOffline = !isSimulatedOffline;
      simBtn.setAttribute('aria-pressed', String(isSimulatedOffline));

      if (isSimulatedOffline) {
        archStage.setAttribute('data-state', 'offline');
        if (simBtnLabel) simBtnLabel.textContent = 'Reconnect network';
        if (archBadge) archBadge.textContent = 'OFFLINE · SELLING CONTINUES LOCALLY';
        if (archNote) archNote.textContent = 'Internet dropped — 3 new sales & 1 stock movement saved safely in IndexedDB. Zero counter interruption.';
        if (archLocal) archLocal.textContent = 'IndexedDB · Writing offline';
        if (archQueue) archQueue.textContent = '4 pending · Waiting for link';
        if (archCloud) archCloud.textContent = 'Unreachable · Paused safely';
        if (pipeLabel2) pipeLabel2.textContent = 'Link paused';
      } else {
        archStage.setAttribute('data-state', 'reconnecting');
        if (simBtnLabel) simBtnLabel.textContent = 'Syncing outbox…';
        if (archBadge) archBadge.textContent = 'RECONNECTED · REPLAYING IDEMPOTENT COMMANDS';
        if (archNote) archNote.textContent = 'Connection restored — Sync Center replays the 4 queued commands safely without duplicating stock or sales.';
        if (archQueue) archQueue.textContent = 'Replaying 4 commands…';
        if (archCloud) archCloud.textContent = 'Verifying & converging…';
        if (pipeLabel2) pipeLabel2.textContent = 'Replaying safely';

        reconnectTimer = setTimeout(() => {
          archStage.setAttribute('data-state', 'online');
          if (simBtnLabel) simBtnLabel.textContent = 'Simulate network drop';
          if (archBadge) archBadge.textContent = 'ONLINE · REAL-TIME SYNC ACTIVE';
          if (archNote) archNote.textContent = 'All 4 offline records acknowledged and converged cleanly with api.storehelpa.com.';
          if (archLocal) archLocal.textContent = 'IndexedDB · Active';
          if (archQueue) archQueue.textContent = '0 pending · All synced';
          if (archCloud) archCloud.textContent = 'Connected · Converged';
          if (pipeLabel2) pipeLabel2.textContent = 'HTTPS / Cursor pull';
        }, 1600);
      }
    });
  }

  // =====================================================================
  // 6. Accessible FAQ Accordion
  // =====================================================================
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));
  faqTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;

      faqTriggers.forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(other.getAttribute('aria-controls') || '');
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  // =====================================================================
  // 7. Onboarding Form Submission
  // =====================================================================
  const forms = document.querySelectorAll('[data-waitlist-form]');
  const statusEl = document.getElementById('form-status');

  function setLoading(form, isLoading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const label = btn.querySelector('.btn-label');
    const loading = btn.querySelector('.btn-loading');
    btn.disabled = isLoading;
    if (label) label.hidden = isLoading;
    if (loading) loading.hidden = !isLoading;
  }

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.className = 'form-status status-' + type;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const businessInput = form.querySelector('input[name="business"]');
      const email = emailInput ? emailInput.value.trim() : '';
      const business = businessInput ? businessInput.value.trim() : '';

      if (!isValidEmail(email)) {
        showStatus("That email doesn't look right — please check it and try again.", 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      setLoading(form, true);
      try {
        await submitToWaitlist({ email, business });
        showStatus("Request received! We'll reach out shortly with your Storehelpa setup details.", 'success');
        form.reset();
      } catch (err) {
        console.error('[Storehelpa] Onboarding request failed:', err);
        showStatus('Something went wrong on our end — please try again or email hello@storehelpa.com.', 'error');
      } finally {
        setLoading(form, false);
      }
    });
  });

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
