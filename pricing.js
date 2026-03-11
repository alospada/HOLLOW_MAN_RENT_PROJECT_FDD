'use strict';

var toggleDaily  = document.getElementById('toggle-daily');
var toggleWeekly = document.getElementById('toggle-weekly');
var priceAmounts = document.querySelectorAll('.price-amount');
var priceUnits   = document.querySelectorAll('.price-unit');
var faqButtons   = document.querySelectorAll('.faq-question');

function animatePriceChange(el, text) {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(-6px)';
  setTimeout(function() {
    el.textContent         = 'Rs. ' + text;
    el.style.transition    = 'opacity 0.25s ease, transform 0.25s ease';
    el.style.opacity       = '1';
    el.style.transform     = 'translateY(0)';
  }, 160);
}

function switchPeriod(period) {
  var isWeekly = period === 'weekly';

  if (toggleDaily)  { toggleDaily.classList.toggle('active', !isWeekly);  toggleDaily.setAttribute('aria-pressed', String(!isWeekly)); }
  if (toggleWeekly) { toggleWeekly.classList.toggle('active', isWeekly);  toggleWeekly.setAttribute('aria-pressed', String(isWeekly)); }

  priceAmounts.forEach(function(el) {
    var value = isWeekly ? el.dataset.weekly : el.dataset.daily;
    if (value) animatePriceChange(el, value);
  });

  priceUnits.forEach(function(el) {
    el.textContent = isWeekly ? '/week' : '/day';
  });
}

function toggleFaqItem(btn) {
  var isExpanded = btn.getAttribute('aria-expanded') === 'true';
  var answerEl   = document.getElementById(btn.getAttribute('aria-controls'));

  faqButtons.forEach(function(other) {
    if (other === btn) return;
    other.setAttribute('aria-expanded', 'false');
    var otherAns = document.getElementById(other.getAttribute('aria-controls'));
    if (otherAns) otherAns.setAttribute('hidden', '');
  });

  btn.setAttribute('aria-expanded', String(!isExpanded));
  if (answerEl) {
    isExpanded ? answerEl.setAttribute('hidden', '') : answerEl.removeAttribute('hidden');
  }
}

function init() {
  if (toggleDaily)  toggleDaily.addEventListener('click',  function() { switchPeriod('daily'); });
  if (toggleWeekly) toggleWeekly.addEventListener('click', function() { switchPeriod('weekly'); });
  faqButtons.forEach(function(btn) { btn.addEventListener('click', function() { toggleFaqItem(btn); }); });
}

init();
