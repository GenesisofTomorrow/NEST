/* ============================================================
   NEST CLUSTER — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ── UTILITIES ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const qs = (el, sel) => el.querySelector(sel);

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('#page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ── NAVBAR: SCROLL BEHAVIOUR ── */
(function initNavScroll() {
  const navbar = $('#navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── PAGE NAVIGATION BAR ── */
(function initPageNav() {
  const pageNav = $('#page-nav');
  const progressFill = $('#page-nav-progress');
  const navItems = $$('.page-nav__item[data-section]');
  if (!pageNav) return;

  // Scroll progress
  const updateProgress = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progressFill) progressFill.style.width = pct.toFixed(1) + '%';
  };

  // Active section highlight
  const sections = navItems.map(item => {
    const id = item.dataset.section;
    return { item, el: document.getElementById(id) };
  }).filter(s => s.el);

  const updateActive = () => {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let current = null;
    sections.forEach(({ item, el }) => {
      const top = el.offsetTop;
      const bot = top + el.offsetHeight;
      if (mid >= top && mid < bot) current = item;
    });
    navItems.forEach(i => i.classList.remove('active'));
    if (current) current.classList.add('active');
  };

  window.addEventListener('scroll', () => {
    updateProgress();
    updateActive();
  }, { passive: true });

  // Click scroll
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.section;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── MOBILE NAV ── */
(function initMobileNav() {
  const hamburger = $('#navbar-hamburger');
  const mobileNav = $('#mobile-nav');
  const overlay = $('#mobile-nav-overlay');
  if (!hamburger || !mobileNav) return;

  const open = () => {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    if (overlay) overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });
  if (overlay) overlay.addEventListener('click', close);
  $$('.mobile-nav__close').forEach(btn => btn.addEventListener('click', close));

  // Mobile dropdown toggles
  $$('.mobile-nav__link[data-toggle]').forEach(link => {
    link.addEventListener('click', () => {
      const subId = link.dataset.toggle;
      const sub = document.getElementById(subId);
      if (sub) sub.classList.toggle('open');
    });
  });
})();

/* ── SEARCH PANEL ── */
(function initSearch() {
  const overlay = $('#search-overlay');
  const input = $('#search-input');
  const closeBtn = $('#search-close');
  const results = $('#search-results');
  const openBtns = $$('[data-search-open]');

  if (!overlay) return;

  const searchData = [
    { type: 'Programme', title: 'Research Grant Programme — FY 2026–27', excerpt: 'Competitive funding for fundamental and applied research. Applications open until June 30, 2026.', href: '#programs' },
    { type: 'Programme', title: 'Startup Incubation Hub — Cohort 4', excerpt: 'Technology-led startups from Northeast India. Seed grants up to ₹50 lakhs per cohort.', href: '#programs' },
    { type: 'Programme', title: 'Rural Science Outreach', excerpt: 'Mobile science labs and vernacular STEM content for rural and tribal communities.', href: '#programs' },
    { type: 'Programme', title: 'Fellowship & Scholar Exchange', excerpt: 'Short-term and long-term fellowships enabling cross-institutional collaboration.', href: '#programs' },
    { type: 'Programme', title: 'Technology Transfer Office', excerpt: 'IP commercialisation, patent filing support, licensing and industry partnerships.', href: '#programs' },
    { type: 'Facility', title: 'Genomics & Life Sciences Laboratory', excerpt: 'High-throughput sequencing, proteomics platforms, BSL-2/3 infrastructure.', href: '#facilities' },
    { type: 'Facility', title: 'High-Performance Computing Cluster', excerpt: 'Petaflop-class computing for climate modelling, AI research and computational chemistry.', href: '#facilities' },
    { type: 'Facility', title: 'Clean Energy Testbed', excerpt: 'Solar, hydro-micro and biomass R&D facilities tailored for northeast topography.', href: '#facilities' },
    { type: 'Facility', title: 'Biodiversity & Ecology Centre', excerpt: 'Field stations, herbaria and molecular labs for NE India biome research.', href: '#facilities' },
    { type: 'Facility', title: 'Remote Sensing & GIS Station', excerpt: 'Satellite data reception and earth observation analytics platform.', href: '#facilities' },
    { type: 'News', title: 'NEST signs MoU with IIT Guwahati and IIIT Manipur', excerpt: 'Joint doctoral programmes in quantum computing and computational sciences.', href: '#news' },
    { type: 'News', title: 'Second cohort of Rural Science Liaisons deployed', excerpt: 'Over 60 trained science communicators embedded across 180 villages.', href: '#news' },
    { type: 'News', title: 'NEST Startup Hub announces ₹12 crore seed fund', excerpt: 'Applications open for deep-tech cohort 3 across agri-tech and clean energy.', href: '#news' },
    { type: 'Region', title: 'Arunachal Pradesh — State Cluster', excerpt: 'Biodiversity, high-altitude research and indigenous knowledge documentation.', href: '#northeast' },
    { type: 'Region', title: 'Manipur — State Cluster', excerpt: 'Biotechnology, traditional textiles technology and medical sciences.', href: '#northeast' },
    { type: 'Region', title: 'Assam — Lead Secretariat', excerpt: 'Headquarters node; biotechnology corridor and IIT Guwahati collaboration hub.', href: '#northeast' },
    { type: 'Page', title: 'About NEST Cluster', excerpt: 'Mission, governance structure, and mandate of the North-Eastern S&T Cluster.', href: '#about' },
    { type: 'Page', title: 'Contact & Enquiries', excerpt: 'Get in touch with the NEST Secretariat for grants, partnerships and general enquiries.', href: '#contact' },
  ];

  const openSearch = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 350);
  };
  const closeSearch = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (results) { results.innerHTML = ''; results.classList.remove('visible'); }
  };

  openBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

  if (input) {
    input.addEventListener('input', debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (!results) return;
      if (q.length < 2) {
        results.innerHTML = '';
        results.classList.remove('visible');
        return;
      }
      const matches = searchData.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.excerpt.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      ).slice(0, 6);

      results.innerHTML = matches.length
        ? matches.map(m => `
          <div class="search-result-item" onclick="window.location='${m.href}'; closeSearchGlobal();">
            <div class="search-result-type">${m.type}</div>
            <div>
              <div class="search-result-title">${highlight(m.title, q)}</div>
              <div class="search-result-excerpt">${highlight(m.excerpt, q)}</div>
            </div>
          </div>`).join('')
        : '<div style="padding:1rem 0;font-size:0.875rem;color:var(--slate);">No results found for that query.</div>';

      results.classList.add('visible');
    }, 200));
  }

  // Quick tags
  $$('.search-panel__quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (input) {
        input.value = tag.textContent;
        input.dispatchEvent(new Event('input'));
      }
    });
  });

  function highlight(text, q) {
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark style="background:var(--gold-pale);color:var(--prussian);">$1</mark>');
  }

  window.closeSearchGlobal = closeSearch;
})();

/* ── PORTAL MODAL ── */
(function initPortalModal() {
  const backdrop = $('#portal-modal');
  const openBtns = $$('[data-portal-open]');
  const closeBtns = $$('[data-portal-close]');
  const tabs = $$('.modal__tab');
  if (!backdrop) return;

  const open = () => {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', open));
  closeBtns.forEach(btn => btn.addEventListener('click', close));
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.modal-tab-panel').forEach(p => {
        p.style.display = p.dataset.panel === target ? 'block' : 'none';
      });
    });
  });

  window.openPortalModal = open;
})();

/* ── ADMIN DASHBOARD ── */
(function initAdmin() {
  const shell = $('#admin-shell');
  const publicSite = $('#public-site');
  const enterBtns = $$('[data-admin-enter]');
  const exitBtns = $$('[data-admin-exit]');

  const enter = () => {
    if (publicSite) publicSite.style.display = 'none';
    if (shell) shell.classList.add('active');
    window.scrollTo(0, 0);
    renderDashboard();
  };
  const exit = () => {
    if (publicSite) publicSite.style.display = 'block';
    if (shell) shell.classList.remove('active');
  };

  enterBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); enter(); }));
  exitBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); exit(); }));

  window.enterAdmin = enter;
  window.exitAdmin = exit;
})();

/* ── DASHBOARD RENDERING ── */
let dashboardRendered = false;

function renderDashboard() {
  if (dashboardRendered) return;
  dashboardRendered = true;

  renderBarChart();
  renderGeoChart();
  renderLiveFeed();
  animateKPIs();
}

function renderBarChart() {
  const container = $('#traffic-bar-chart');
  if (!container || container.children.length) return;
  const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  const vals   = [22, 26, 29, 24, 33, 36, 34, 40, 33, 39, 47, 48];
  const max = Math.max(...vals);
  months.forEach((m, i) => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    const bar = document.createElement('div');
    bar.className = 'bar-col__bar' + (i === 11 ? ' is-current' : '');
    bar.style.height = '0px';
    bar.dataset.val = vals[i] + 'k';
    const lbl = document.createElement('div');
    lbl.className = 'bar-col__label';
    lbl.textContent = m;
    col.appendChild(bar);
    col.appendChild(lbl);
    container.appendChild(col);
    setTimeout(() => {
      bar.style.transition = 'height 0.8s cubic-bezier(0,0,0.2,1)';
      bar.style.height = Math.round((vals[i] / max) * 130) + 'px';
    }, 100 + i * 50);
  });
}

function renderGeoChart() {
  const container = $('#geo-chart');
  if (!container || container.children.length) return;
  const data = [
    ['Assam', 36], ['Meghalaya', 14], ['Manipur', 11],
    ['Nagaland', 9], ['Arunachal', 9], ['Mizoram', 8],
    ['Tripura', 8], ['Sikkim', 5]
  ];
  data.forEach(([state, pct]) => {
    const row = document.createElement('div');
    row.className = 'geo-row';
    row.innerHTML = `
      <span class="geo-row__state">${state}</span>
      <div class="geo-row__track"><div class="geo-row__fill" data-pct="${pct}"></div></div>
      <span class="geo-row__pct">${pct}%</span>`;
    container.appendChild(row);
  });
  setTimeout(() => {
    $$('.geo-row__fill').forEach(el => { el.style.width = el.dataset.pct + '%'; });
  }, 300);
}

function renderLiveFeed() {
  const container = $('#live-feed');
  if (!container || container.children.length) return;
  const entries = [
    ['/ — Home', 'Guwahati, Assam', '3s ago', false],
    ['/programs', 'Imphal, Manipur', '11s ago', false],
    ['/facilities', 'Shillong, Meghalaya', '19s ago', false],
    ['/news/mou-iitg', 'Dimapur, Nagaland', '31s ago', true],
    ['/grants/apply', 'Aizawl, Mizoram', '47s ago', true],
    ['/about', 'Agartala, Tripura', '1m 02s ago', true],
    ['/contact', 'Itanagar, Arunachal', '1m 28s ago', true],
  ];
  entries.forEach(([page, loc, time, old]) => {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="feed-item__pulse${old ? ' old' : ''}"></div>
      <div class="feed-item__info">
        <div class="feed-item__page">${page}</div>
        <div class="feed-item__loc">${loc}</div>
      </div>
      <div class="feed-item__time">${time}</div>`;
    container.appendChild(item);
  });
}

function animateKPIs() {
  const kpis = [
    { id: 'kpi-visitors', target: 48312, fmt: v => v.toLocaleString('en-IN') },
    { id: 'kpi-sessions', target: 124680, fmt: v => v.toLocaleString('en-IN') },
  ];
  kpis.forEach(({ id, target, fmt }) => {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = fmt(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── ADMIN NAV ── */
(function initAdminNav() {
  $$('.admin-nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      $$('.admin-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const panel = item.dataset.panel;
      const titleEl = $('#admin-main-title');
      if (titleEl) titleEl.textContent = item.textContent.trim();
      showToast('Panel loaded', panel.charAt(0).toUpperCase() + panel.slice(1) + ' panel is now active.');
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ── MARQUEE TICKER ── */
(function initTicker() {
  const track = $('#ticker-track');
  if (!track) return;
  const items = [
    { label: 'Grant Applications Open', text: 'Research Grant Programme FY 2026–27 — Deadline: June 30, 2026' },
    { label: 'New Deployment', text: 'Second cohort of Rural Science Liaisons deployed across 180 villages in NE India' },
    { label: 'Funding Announcement', text: 'Startup Hub announces ₹12 crore seed fund for Deep-Tech Cohort 3' },
    { label: 'Event', text: 'NEST Annual Science Conclave 2026 — Shillong, Meghalaya — July 14–16' },
    { label: 'Partnership', text: 'MoU signed with IIT Guwahati and IIIT Manipur for joint doctoral programmes' },
    { label: 'Milestone', text: 'Clean Energy Testbed in Sikkim achieves first successful hydrogen storage at altitude' },
    { label: 'Portal Update', text: 'Researcher Portal now available in Assamese, Bodo and Meitei languages' },
  ];
  const doubled = [...items, ...items];
  doubled.forEach(({ label, text }) => {
    const span = document.createElement('span');
    span.className = 'ticker__item';
    span.innerHTML = `<strong>${label}:</strong>${text}<span class="ticker__item-sep"></span>`;
    track.appendChild(span);
  });
})();

/* ── DROPDOWN NAVIGATION ── */
(function initDropdowns() {
  $$('.navbar__link--drop').forEach(link => {
    let closeTimer;
    link.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      link.classList.add('open');
    });
    link.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => link.classList.remove('open'), 120);
    });
  });
})();

/* ── ABOUT DIAGRAM ── */
(function initAboutDiagram() {
  const diagram = $('#about-diagram');
  if (!diagram) return;
  const sizes = [240, 180, 120, 60];
  sizes.forEach((s, i) => {
    const ring = document.createElement('div');
    ring.className = 'about-diagram__ring';
    ring.style.width = s + 'px';
    ring.style.height = s + 'px';
    ring.style.animationDuration = (20 + i * 8) + 's';
    ring.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
    ring.style.animation = `rotateSlow ${20 + i * 8}s linear infinite`;
    if (i % 2 !== 0) ring.style.animationDirection = 'reverse';
    diagram.appendChild(ring);
  });
  const label = document.createElement('div');
  label.className = 'about-diagram__label';
  label.textContent = 'NEST — Cluster Architecture';
  diagram.appendChild(label);
})();

/* ── CONTACT FORM ── */
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message received', 'The NEST Secretariat will respond within 2 working days.');
    form.reset();
  });
})();

/* ── TOAST ── */
function showToast(title, body, duration = 4000) {
  const container = $('#toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<div class="toast__content">
    <div class="toast__title">${title}</div>
    <div class="toast__body">${body}</div>
  </div>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
window.showToast = showToast;

/* ── REPORT ACTIONS ── */
window.generateReport = function() {
  showToast('Report Generated', 'Monthly brief for March 2026 compiled and ready for preview.');
};
window.mailReport = function() {
  showToast('Report Dispatched', 'Monthly brief sent to admin@nestcluster.gov.in — delivery expected in 2 minutes.');
};

/* ── UTILITY: DEBOUNCE ── */
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/* ── MAP STATE HOVER ── */
(function initMapInteraction() {
  $$('.map-legend-item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      const path = document.getElementById('state-' + i);
      if (path) path.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      const path = document.getElementById('state-' + i);
      if (path) path.style.opacity = '';
    });
  });
})();
