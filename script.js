/* =============================================
   RECKONING & REMEMBRANCE — script.js
   ============================================= */

// ── Scrolled nav ──────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', links.classList.contains('open'));
});

// Close mobile nav when a link is clicked
links?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// ── RSVP / Mailchimp Form ─────────────────────
// The form posts to Mailchimp via target="_blank".
// We add client-side validation before allowing submission,
// and show a thank-you panel after the Mailchimp tab opens.
const form    = document.getElementById('mc-embedded-subscribe-form');
const success = document.getElementById('rsvpSuccess');

form?.addEventListener('submit', (e) => {
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#c0392b';
      field.focus();
      valid = false;
    }
  });

  if (!valid) {
    e.preventDefault();
    return;
  }

  // Mailchimp opens in a new tab; show local thank-you after a moment
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 800);
});

// ── Share button ──────────────────────────────
const shareBtn = document.getElementById('shareBtn');

shareBtn?.addEventListener('click', async () => {
  const shareData = {
    title: 'Reckoning & Remembrance',
    text: 'Join the Captain André Cailloux Community Procession in New Orleans — November 13.',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (_) { /* user cancelled */ }
  } else {
    // Fallback: copy link
    navigator.clipboard.writeText(window.location.href).then(() => {
      shareBtn.textContent = 'Link copied!';
      setTimeout(() => { shareBtn.textContent = 'Share This Page'; }, 2500);
    });
  }
});

// ── Smooth anchor offset for fixed nav ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Fade-in on scroll ─────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.history-card, .element-card, .partner-card, .center-info-card, .center-donate-block, .funding-half').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Add fade-in CSS via JS so it degrades gracefully if JS is off
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(18px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-in.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);
