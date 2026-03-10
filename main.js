/* =====================================================
   ATELIER DES MONTS — main.js
   ===================================================== */
(function() {
  'use strict';

  // ── Curseur personnalisé ─────────────────────────────
  const cursor = document.getElementById('admCursor');
  const ring   = document.getElementById('admCursorRing');

  if (cursor && ring && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      setTimeout(() => {
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
      }, 80);
    });
    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; });
    });
  }

  // ── Nav scroll ───────────────────────────────────────
  const nav = document.getElementById('admNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Menu burger ──────────────────────────────────────
  const burger = document.getElementById('admBurger');
  const menu   = document.getElementById('admMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Fermer sur clic lien
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll reveal ────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(r => observer.observe(r));
  }

  // ── Formulaire de contact (AJAX) ─────────────────────
  const form = document.getElementById('admContactForm');
  if (form && typeof ADM !== 'undefined') {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn     = form.querySelector('button[type="submit"]');
      const msgEl   = form.querySelector('#admFormMsg');
      const nonce   = form.querySelector('#adm_nonce_field');

      // Validation basique
      const email = form.querySelector('[name="email"]').value;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMsg(msgEl, 'Merci de saisir un email valide.', 'error');
        return;
      }

      btn.classList.add('loading');
      btn.disabled = true;
      msgEl.className = 'adm-form-msg';
      msgEl.textContent = '';

      const data = new FormData(form);
      data.append('action', 'adm_contact');
      data.append('nonce',   nonce ? nonce.value : '');

      try {
        const res  = await fetch(ADM.ajaxUrl, { method: 'POST', body: data });
        const json = await res.json();
        if (json.success) {
          showMsg(msgEl, '✓ Message envoyé ! Je vous réponds sous 48h.', 'success');
          form.reset();
        } else {
          showMsg(msgEl, json.data || 'Une erreur est survenue.', 'error');
        }
      } catch(err) {
        showMsg(msgEl, 'Erreur de connexion. Réessayez ou appelez directement.', 'error');
      } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
      }
    });
  }

  function showMsg(el, text, type) {
    el.textContent  = text;
    el.className    = 'adm-form-msg ' + type;
  }

  // ── Smooth scroll liens internes ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (nav ? nav.offsetHeight : 72) + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
