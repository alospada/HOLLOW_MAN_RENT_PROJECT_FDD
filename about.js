'use strict';

function animateCounter(el, duration) {
  duration = duration || 1600;
  var rawText = Array.from(el.childNodes)
    .filter(function(n) { return n.nodeType === Node.TEXT_NODE; })
    .map(function(n) { return n.textContent.trim(); })
    .join('');

  if (!rawText) return;

  var multiplier = 1;
  var numStr = rawText.replace(/[^0-9KM.]/g, '');
  if (numStr.includes('K')) { multiplier = 1000; numStr = numStr.replace('K', ''); }
  if (numStr.includes('M')) { multiplier = 1000000; numStr = numStr.replace('M', ''); }

  var target = parseFloat(numStr) * multiplier;
  if (isNaN(target)) return;

  var isK  = multiplier === 1000;
  var start = performance.now();

  function tick(now) {
    var elapsed  = now - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    var current  = Math.round(eased * target);

    var display;
    if (isK && current >= 1000) {
      display = (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'K';
    } else {
      display = current.toString();
    }

    var textNode = Array.from(el.childNodes).find(function(n) { return n.nodeType === Node.TEXT_NODE; });
    if (textNode) textNode.textContent = display;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(function(el) { observer.observe(el); });
}

function init() {
  initCounters();
}

init();
