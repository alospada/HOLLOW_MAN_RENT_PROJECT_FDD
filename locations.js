'use strict';

var locSearch  = document.getElementById('loc-search');
var locGrid    = document.getElementById('locations-grid');
var countNum   = document.getElementById('count-num');
var emptyState = document.getElementById('empty-state');
var allCards   = locGrid ? locGrid.querySelectorAll('.loc-card') : [];

function filterLocations() {
  var query = locSearch.value.trim().toLowerCase();
  var visible = 0;

  allCards.forEach(function(card, i) {
    var keywords = (card.dataset.name || '').toLowerCase();
    var matches  = !query || keywords.includes(query);
    if (matches) {
      card.style.display = '';
      card.style.animationDelay = (visible * 80) + 'ms';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  if (countNum)   countNum.textContent = visible;
  if (emptyState) {
    visible === 0
      ? emptyState.removeAttribute('hidden')
      : emptyState.setAttribute('hidden', '');
  }
}

function init() {
  if (!locSearch) return;

  var debounceTimer;
  locSearch.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filterLocations, 180);
  });

  locSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      locSearch.value = '';
      filterLocations();
      locSearch.blur();
    }
  });

  filterLocations();
}

init();
