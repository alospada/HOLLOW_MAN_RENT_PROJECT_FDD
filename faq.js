'use strict';

const searchInput  = document.getElementById('faq-search');
const noResults    = document.getElementById('no-results');
const faqGroups    = document.querySelectorAll('.faq-group');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const allQBtns     = document.querySelectorAll('.faq-q');

function toggleItem(btn) {
  const isOpen   = btn.getAttribute('aria-expanded') === 'true';
  const answerId = btn.getAttribute('aria-controls');
  const answerEl = document.getElementById(answerId);

  btn.closest('.faq-group').querySelectorAll('.faq-q').forEach(other => {
    if (other === btn) return;
    other.setAttribute('aria-expanded', 'false');
    const el = document.getElementById(other.getAttribute('aria-controls'));
    if (el) el.setAttribute('hidden', '');
  });

  const next = !isOpen;
  btn.setAttribute('aria-expanded', String(next));
  next ? answerEl.removeAttribute('hidden') : answerEl.setAttribute('hidden', '');
}

const originalContent = new Map();

function cacheOriginalContent() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const qEl = item.querySelector('.faq-q');
    const aEl = item.querySelector('.faq-a');
    originalContent.set(item, {
      qHTML: qEl ? qEl.innerHTML : '',
      aHTML: aEl ? aEl.innerHTML : '',
    });
  });
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightHTML(html, re) {
  return html.replace(/>([^<]+)</g, (match, text) => '>' + text.replace(re, '<mark>$&</mark>') + '<');
}

function runSearch(query) {
  const q = query.trim().toLowerCase();

  document.querySelectorAll('.faq-item').forEach(item => {
    const orig = originalContent.get(item);
    if (!orig) return;
    const qEl = item.querySelector('.faq-q');
    const aEl = item.querySelector('.faq-a');
    if (qEl) qEl.innerHTML = orig.qHTML;
    if (aEl) aEl.innerHTML = orig.aHTML;
    const newBtn = item.querySelector('.faq-q');
    if (newBtn) newBtn.addEventListener('click', () => toggleItem(newBtn));
  });

  if (!q) {
    document.querySelectorAll('.faq-item').forEach(i => i.style.display = '');
    document.querySelectorAll('.faq-group').forEach(g => g.style.display = '');
    noResults.setAttribute('hidden', '');
    return;
  }

  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  let total = 0;

  document.querySelectorAll('.faq-item').forEach(item => {
    const qEl  = item.querySelector('.faq-q');
    const aEl  = item.querySelector('.faq-a');
    const text = (qEl ? qEl.textContent : '') + ' ' + (aEl ? aEl.textContent : '');

    if (text.toLowerCase().includes(q)) {
      item.style.display = '';
      total++;
      if (qEl) {
        qEl.innerHTML = highlightHTML(qEl.innerHTML, re);
        qEl.addEventListener('click', () => toggleItem(qEl));
      }
      if (aEl) {
        aEl.innerHTML = highlightHTML(aEl.innerHTML, re);
        aEl.removeAttribute('hidden');
        if (qEl) qEl.setAttribute('aria-expanded', 'true');
      }
    } else {
      item.style.display = 'none';
    }
  });

  document.querySelectorAll('.faq-group').forEach(group => {
    const visible = group.querySelectorAll('.faq-item:not([style*="display: none"])');
    group.style.display = visible.length ? '' : 'none';
  });

  noResults[total === 0 ? 'removeAttribute' : 'setAttribute']('hidden', '');
}

function updateSidebarSpy() {
  let current = '';
  faqGroups.forEach(group => {
    if (group.getBoundingClientRect().top <= 120) current = '#' + group.id;
  });
  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

function init() {
  allQBtns.forEach(btn => btn.addEventListener('click', () => toggleItem(btn)));

  cacheOriginalContent();

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(searchInput.value), 200);
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      runSearch('');
      searchInput.blur();
    }
  });

  window.addEventListener('scroll', updateSidebarSpy, { passive: true });
  updateSidebarSpy();

  sidebarLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: 'smooth' });
      }
    });
  });
}

init();
