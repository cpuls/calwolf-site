(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-navigation');

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  if (header && toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (header.classList.contains('nav-open') && !header.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Reconfirm incoming anchor positions after late-loading images settle.
  window.addEventListener('load', function () {
    if (!window.location.hash) return;
    var target = document.querySelector(window.location.hash);
    if (target) {
      window.requestAnimationFrame(function () {
        target.scrollIntoView({ block: 'start' });
      });
    }
  });
})();
