'use strict';

function init() {
  var currentPage = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.nav-link, .mob-link').forEach(function(link) {
    var href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'home.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

init();
