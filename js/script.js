// script.js - nav behavior: dropdowns, mobile toggle, scroll shadow
(function(){
  const header = document.getElementById('siteHeader');
  const dropdownParents = Array.from(document.querySelectorAll('.has-dropdown'));
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  /* ---------- Scroll shadow ---------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 6) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  /* ---------- Desktop dropdown interaction ---------- */
  dropdownParents.forEach(parent => {
    const btn = parent.querySelector('button');
    const panel = parent.querySelector('.dropdown');
    if (!btn || !panel) return;

    // keep track of close timer to avoid micro-gap disappearance
    let closeTimer = null;
    const CLOSE_DELAY = 180;

    const open = () => {
      clearTimeout(closeTimer);
      parent.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      panel.setAttribute('aria-hidden','false');
    };
    const close = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        parent.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        panel.setAttribute('aria-hidden','true');
      }, CLOSE_DELAY);
    };

    // mouse interactions
    parent.addEventListener('mouseenter', open);
    parent.addEventListener('mouseleave', close);
    panel.addEventListener('mouseenter', open);
    panel.addEventListener('mouseleave', close);

    // keyboard/focus accessibility
    btn.addEventListener('focus', open);
    parent.addEventListener('focusout', (ev) => {
      if (!parent.contains(ev.relatedTarget)) close();
    });

    // on small screens, click toggles handled elsewhere (mobile)
    btn.addEventListener('click', (ev) => {
      // if desktop size, prevent native action and toggle
      if (window.innerWidth > 720) {
        ev.preventDefault();
        if (parent.classList.contains('open')) close();
        else open();
      }
    });
  });

  /* ---------- Mobile menu toggle ---------- */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  /* mobile accordion behavior */
  document.querySelectorAll('.mobile-accordion .acc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.mobile-accordion');
      if (!li) return;
      li.classList.toggle('open');
    });
  });

  /* ensure logo never overlaps nav items:
     we used grid with fixed center column (logo width) so left/right never flow under center.
     No additional code needed here. */

  /* ---------- Accessibility: close menus on outside click ---------- */
  document.addEventListener('click', (ev) => {
    if (ev.target.closest('.has-dropdown')) return;
    dropdownParents.forEach(parent => {
      parent.classList.remove('open');
      const btn = parent.querySelector('button');
      const panel = parent.querySelector('.dropdown');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.setAttribute('aria-hidden', 'true');
    });
  });

  /* ---------- Prevent accidental overlap or resize of logo ---------- */
  const logo = document.getElementById('siteLogo');
  if (logo) {
    // set explicit width based on CSS var (keeps consistent)
    const updateLogoWidth = () => {
      const style = getComputedStyle(document.documentElement);
      const w = style.getPropertyValue('--logo-width') || '';
      if (w) logo.style.width = w.trim();
    };
    window.addEventListener('resize', updateLogoWidth);
    updateLogoWidth();
  }

})();
