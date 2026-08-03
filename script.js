/* =============================================
   RECKONING & REMEMBRANCE — script.js
   ============================================= */

// ── Rotating pull quote (random per visit) ────
(function () {
  const quotes = document.querySelectorAll('.pull-quote-section [data-quote]');
  if (quotes.length > 1) {
    const pick = Math.floor(Math.random() * quotes.length);
    quotes.forEach((q, i) => { q.style.display = i === pick ? '' : 'none'; });
  }
})();

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
// The "March With Us" form is Mailchimp's official embed; validation and
// submission are handled by Mailchimp's mc-validate.js / mc-sms-phone.js
// (loaded next to the form), so no custom handler is needed here.

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
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(22px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Cards
document.querySelectorAll('.history-card, .partner-card, .center-info-card, .hist-figure').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Section headings and intros
document.querySelectorAll('.section-eyebrow, .section-title, .section-intro, .pull-quote, .hero-logo-img, .history-lead').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Stagger history timeline cards
document.querySelectorAll('.history-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

// ── Sticky RSVP button ────────────────────────
const stickyRsvp = document.getElementById('stickyRsvp');
const heroEl     = document.getElementById('hero');
const rsvpEl     = document.getElementById('rsvp');

// Show after hero leaves view
const heroWatcher = new IntersectionObserver(([entry]) => {
  stickyRsvp?.classList.toggle('visible', !entry.isIntersecting);
}, { threshold: 0 });

// Hide when RSVP section is visible
const rsvpWatcher = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) stickyRsvp?.classList.remove('visible');
}, { threshold: 0.3 });

if (heroEl) heroWatcher.observe(heroEl);
if (rsvpEl) rsvpWatcher.observe(rsvpEl);
