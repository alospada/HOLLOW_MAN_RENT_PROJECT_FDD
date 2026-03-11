'use strict';

(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobile-menu');
  if (!navbar || !hamburger || !mobileMenu) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu(open) {
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    hamburger.classList.toggle('is-open', open);
    open ? mobileMenu.removeAttribute('hidden') : mobileMenu.setAttribute('hidden', '');
  }

  hamburger.addEventListener('click', () => {
    openMenu(hamburger.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('click', (e) => {
    if (hamburger.getAttribute('aria-expanded') === 'true'
        && !hamburger.contains(e.target)
        && !mobileMenu.contains(e.target)) {
      openMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) openMenu(false);
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('.mob-link')) openMenu(false);
  });
})();

(function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(entry.target.parentElement.children)
                            .filter(c => c.hasAttribute('data-reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 90, 360);

      setTimeout(() => entry.target.classList.add('revealed'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();
