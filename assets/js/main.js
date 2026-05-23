/*
 * Geonkuk Kim — site interactions
 * Vanilla JS: theme toggle, mobile nav, scroll-spy, reveal-on-scroll,
 *             staged hero "Welcome" word-by-word animation.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initHeroAnimation();
    initSmoothScroll();
  });

  /* ---------- Theme toggle ---------- */
  function initThemeToggle() {
    var KEY = 'theme';
    var body = document.body;
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    function apply(mode) {
      if (mode === 'dark') {
        body.classList.add('theme-dark');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        body.classList.remove('theme-dark');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    }

    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}

    if (stored === 'dark' || stored === 'light') {
      apply(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      apply('dark');
    } else {
      apply('light');
    }

    btn.addEventListener('click', function () {
      var next = body.classList.contains('theme-dark') ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var nav = document.getElementById('topnav');
    var toggle = document.getElementById('navToggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll spy + nav shadow ---------- */
  function initScrollSpy() {
    var nav = document.getElementById('topnav');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var sections = links
      .map(function (a) {
        var id = a.getAttribute('href').slice(1);
        return { id: id, el: document.getElementById(id), link: a };
      })
      .filter(function (s) { return s.el; });

    function onScroll() {
      if (window.scrollY > 8) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');

      var top = window.scrollY + (nav.offsetHeight || 60) + 40;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.offsetTop <= top) current = sections[i];
      }
      sections.forEach(function (s) {
        if (s === current) s.link.classList.add('active');
        else s.link.classList.remove('active');
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal, .section-head');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero "Welcome..." word-by-word ---------- */
  function initHeroAnimation() {
    var el = document.getElementById('heroTitle');
    if (!el) return;
    var text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';

    var words = text.split(' ');
    var gradientIndexes = [];
    words.forEach(function (w, i) {
      var lower = w.toLowerCase().replace(/[^a-z]/g, '');
      if (lower === 'geonkuk' || lower === "kim's" || lower === 'kims') gradientIndexes.push(i);
    });

    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word' + (gradientIndexes.indexOf(i) !== -1 ? ' gradient' : '');
      span.textContent = word;
      span.style.animationDelay = (0.18 * i + 0.25) + 's';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ---------- Smooth scroll offset for fixed nav ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var nav = document.getElementById('topnav');
        var offset = (nav ? nav.offsetHeight : 0) + 8;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }
})();
