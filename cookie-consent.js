/* =============================================
   Cookie consent banner — gates Google Analytics
   Shows once; remembers the choice in localStorage.
   Accept  → grants GA analytics_storage
   Decline → leaves it denied (no analytics cookies)
   ============================================= */
(function () {
  var KEY = 'cookie-consent';

  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === 'accepted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  }

  var chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch (e) {}
  if (chosen) return; // already decided — don't show again

  function build() {
    var bar = document.createElement('div');
    bar.className = 'cookie-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.innerHTML =
      '<p class="cookie-consent__text">We use cookies for Google Analytics to understand site traffic. ' +
      'You can accept or decline.</p>' +
      '<div class="cookie-consent__actions">' +
        '<button type="button" class="cookie-consent__btn cookie-consent__btn--decline">Decline</button>' +
        '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept">Accept</button>' +
      '</div>';

    function dismiss() {
      bar.classList.remove('cookie-consent--visible');
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 320);
    }
    bar.querySelector('.cookie-consent__btn--accept').addEventListener('click', function () {
      store('accepted'); dismiss();
    });
    bar.querySelector('.cookie-consent__btn--decline').addEventListener('click', function () {
      store('declined'); dismiss();
    });

    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('cookie-consent--visible'); });
  }

  if (document.body) {
    build();
  } else {
    document.addEventListener('DOMContentLoaded', build);
  }
})();
