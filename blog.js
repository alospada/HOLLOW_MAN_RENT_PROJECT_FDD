'use strict';

const tabBtns      = document.querySelectorAll('.tab-btn');
const blogGrid     = document.getElementById('blog-grid');
const countNum     = document.getElementById('count-num');
const emptyState   = document.getElementById('empty-state');
const allCards     = blogGrid.querySelectorAll('.post-card');
const nlForm       = document.getElementById('newsletter-form');
const nlInput      = document.getElementById('nl-email');
const nlError      = document.getElementById('nl-error');
const nlSuccess    = document.getElementById('nl-success');
const btnSubscribe = document.getElementById('btn-subscribe');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let activeCategory = 'all';

function applyFilter() {
  let visible = 0;
  allCards.forEach((card, i) => {
    const cat     = card.dataset.cat || '';
    const matches = activeCategory === 'all' || cat === activeCategory;
    if (matches) {
      card.style.display = '';
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = '';
      card.style.animationDelay = `${(visible % 3) * 80}ms`;
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  if (countNum) countNum.textContent = visible;
  if (emptyState) {
    visible === 0
      ? emptyState.removeAttribute('hidden')
      : emptyState.setAttribute('hidden', '');
  }
}

function handleTabClick(btn) {
  tabBtns.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  activeCategory = btn.dataset.cat || 'all';
  applyFilter();
}

async function handleSubscribe(e) {
  e.preventDefault();
  if (nlError)   nlError.textContent = '';
  if (nlSuccess) nlSuccess.setAttribute('hidden', '');

  const email = nlInput ? nlInput.value.trim() : '';
  if (!email || !EMAIL_RE.test(email)) {
    if (nlError) nlError.textContent = 'Please enter a valid email address.';
    return;
  }

  if (btnSubscribe) { btnSubscribe.disabled = true; btnSubscribe.textContent = 'Subscribing…'; }
  await new Promise(r => setTimeout(r, 900));
  if (nlSuccess) nlSuccess.removeAttribute('hidden');
  if (nlInput)   nlInput.value = '';
  if (btnSubscribe) { btnSubscribe.disabled = false; btnSubscribe.textContent = 'Subscribe'; }
}

function init() {
  tabBtns.forEach(btn => btn.addEventListener('click', () => handleTabClick(btn)));
  if (nlForm) nlForm.addEventListener('submit', handleSubscribe);
  applyFilter();
}

init();
