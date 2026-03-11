'use strict';

const searchInput   = document.getElementById('search-input');
const filterType    = document.getElementById('filter-type');
const filterFuel    = document.getElementById('filter-fuel');
const filterSort    = document.getElementById('filter-sort');
const btnReset      = document.getElementById('btn-reset');
const btnResetEmpty = document.getElementById('btn-reset-empty');
const vehicleGrid   = document.getElementById('vehicle-grid');
const countNum      = document.getElementById('count-num');
const emptyState    = document.getElementById('empty-state');
const modalOverlay  = document.getElementById('modal-overlay');
const modalClose    = document.getElementById('modal-close');
const modalImg      = document.getElementById('modal-img');
const modalType     = document.getElementById('modal-type');
const modalPrice    = document.getElementById('modal-price');
const modalCarName  = document.getElementById('modal-car-name');
const modalSpecs    = document.getElementById('modal-specs');
const allCards      = vehicleGrid.querySelectorAll('.v-card');

function getFilters() {
  return {
    query: searchInput.value.trim().toLowerCase(),
    type:  filterType.value,
    fuel:  filterFuel.value,
    sort:  filterSort.value,
  };
}

function cardMatches(card, { query, type, fuel }) {
  const name   = (card.dataset.name || '').toLowerCase();
  const cType  = card.dataset.type  || '';
  const cFuel  = card.dataset.fuel  || '';
  return (!query || name.includes(query))
      && (type === 'all' || cType === type)
      && (fuel === 'all' || cFuel === fuel);
}

function sortCards(cards, sortKey) {
  cards.sort((a, b) => {
    if (sortKey === 'price-asc')  return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortKey === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
    if (sortKey === 'name-asc')   return (a.dataset.name || '').localeCompare(b.dataset.name || '');
    return 0;
  });
}

function applyFilters() {
  const filters = getFilters();
  const cardArr = Array.from(allCards);
  const visible = cardArr.filter(c =>  cardMatches(c, filters));
  const hidden  = cardArr.filter(c => !cardMatches(c, filters));

  sortCards(visible, filters.sort);

  visible.forEach((card, i) => {
    card.style.display = '';
    card.style.animationDelay = `${i * 0.07}s`;
    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = '';
  });

  hidden.forEach(card => { card.style.display = 'none'; });

  if (countNum) countNum.textContent = visible.length;

  visible.forEach(card => vehicleGrid.appendChild(card));

  if (emptyState) {
    visible.length === 0
      ? emptyState.removeAttribute('hidden')
      : emptyState.setAttribute('hidden', '');
  }
}

function resetFilters() {
  searchInput.value = '';
  filterType.value  = 'all';
  filterFuel.value  = 'all';
  filterSort.value  = 'default';
  applyFilters();
  searchInput.focus();
}

function openModal(card) {
  if (!modalOverlay) return;
  const img = card.querySelector('.v-img');
  if (modalImg)     { modalImg.src = img ? img.src : ''; modalImg.alt = img ? img.alt : ''; }
  if (modalCarName) modalCarName.textContent = card.dataset.name || '';
  if (modalType)    modalType.textContent    = card.dataset.type || '';
  if (modalPrice)   modalPrice.textContent   = 'Rs. ' + Number(card.dataset.price).toLocaleString() + '/day';

  if (modalSpecs) {
    const specs = card.querySelectorAll('.v-spec');
    modalSpecs.innerHTML = '';
    specs.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.textContent.trim();
      modalSpecs.appendChild(li);
    });
  }

  modalOverlay.removeAttribute('hidden');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (modalClose) modalClose.focus();
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.setAttribute('hidden', '');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function init() {
  searchInput.addEventListener('input', applyFilters);
  filterType.addEventListener('change', applyFilters);
  filterFuel.addEventListener('change', applyFilters);
  filterSort.addEventListener('change', applyFilters);
  if (btnReset)      btnReset.addEventListener('click', resetFilters);
  if (btnResetEmpty) btnResetEmpty.addEventListener('click', resetFilters);

  allCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); } });
  });

  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  applyFilters();
}

init();
