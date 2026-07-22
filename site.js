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

  var feedbackForm = document.querySelector('[data-formspree]');
  if (feedbackForm && window.fetch) {
    var formStatus = feedbackForm.querySelector('.form-status');
    var submitButton = feedbackForm.querySelector('button[type="submit"]');
    var defaultButtonText = submitButton ? submitButton.textContent : '';

    feedbackForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!feedbackForm.reportValidity()) return;

      if (formStatus) {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }

      fetch(feedbackForm.action, {
        method: 'POST',
        body: new FormData(feedbackForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (!response.ok) {
          return response.json().catch(function () { return {}; }).then(function (data) {
            var message = 'We could not send your feedback. Please try again.';
            if (data && data.errors && data.errors.length) {
              message = data.errors.map(function (item) { return item.message; }).join(' ');
            }
            throw new Error(message);
          });
        }
        feedbackForm.reset();
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thanks—your feedback has been sent.';
        }
      }).catch(function (error) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = error.message || 'We could not send your feedback. Please try again.';
        }
      }).finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
      });
    });
  }

})();
