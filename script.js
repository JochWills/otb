/* On The Bay B&B — interactions */
(function () {
  'use strict';

  /* one orchestrated entrance on load */
  requestAnimationFrame(function () { document.body.classList.add('ready'); });

  /* header turns solid as soon as the page moves — except on pages with no
     tall .hero banner to scroll past (e.g. the room pages), which stay solid */
  var head = document.getElementById('siteHead');
  if (head) {
    var hasHero = !!document.querySelector('.hero');
    if (hasHero) {
      var ticking = false;
      var setState = function () {
        head.classList.toggle('stuck', window.scrollY > 56);
        ticking = false;
      };
      setState();
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(setState); }
      }, { passive: true });
    } else {
      head.classList.add('stuck');
    }
  }

  /* mobile menu */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* arriving from a room page's (or the rooms listing page's) "Enquire
     about this room" link — index.html?room=Room+Name#callback — preselects
     that room in the callback form's dropdown */
  var select = document.getElementById('f-room');
  var selectRoomOption = function (wanted) {
    if (!select || !wanted) return;
    Array.prototype.forEach.call(select.options, function (o) {
      if (o.text.trim() === wanted) select.value = o.value || o.text;
    });
  };
  selectRoomOption(new URLSearchParams(window.location.search).get('room'));

  /* leaving date can never precede arriving date */
  var inp = document.getElementById('f-in');
  var out = document.getElementById('f-out');
  if (inp && out) {
    var today = new Date().toISOString().slice(0, 10);
    inp.min = today;
    out.min = today;
    inp.addEventListener('change', function () {
      out.min = inp.value || today;
      if (out.value && out.value < out.min) out.value = out.min;
    });
  }

  /* lightbox — powers any .gal-item grid on the page (the homepage gallery,
     and each room page's own photo grid), with prev/next through that grid */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbCount = document.getElementById('lbCount');
  if (lb && lbImg && typeof lb.showModal === 'function') {
    var lbSet = [];
    var lbIndex = 0;

    var render = function () {
      var item = lbSet[lbIndex];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt || '';
      var multi = lbSet.length > 1;
      if (lbPrev) lbPrev.hidden = !multi;
      if (lbNext) lbNext.hidden = !multi;
      if (lbCount) {
        lbCount.hidden = !multi;
        lbCount.textContent = multi ? (lbIndex + 1) + ' / ' + lbSet.length : '';
      }
    };
    var open = function (set, index) {
      if (!set || !set.length) return;
      lbSet = set;
      lbIndex = index || 0;
      render();
      lb.showModal();
    };
    var step = function (delta) {
      if (lbSet.length < 2) return;
      lbIndex = (lbIndex + delta + lbSet.length) % lbSet.length;
      render();
    };

    /* gallery grid — one shared set so viewers can page through all of them */
    var galItems = document.querySelectorAll('.gal-item');
    var gallerySet = Array.prototype.map.call(galItems, function (item) {
      var img = item.querySelector('img');
      return { src: item.getAttribute('data-full'), alt: img ? img.alt : '' };
    });
    galItems.forEach(function (item, i) {
      item.addEventListener('click', function () { open(gallerySet, i); });
    });

    if (lbClose) lbClose.addEventListener('click', function () { lb.close(); });
    if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  /* "See more photos" — the homepage gallery ships every photo in the DOM
     up front (so the lightbox set above already includes all of them,
     letting prev/next page through the full set from photo 1), but only
     the first 6 start visible. Each click un-hides the next 4. */
  var galMore = document.getElementById('galMore');
  if (galMore) {
    galMore.addEventListener('click', function () {
      var hiddenItems = document.querySelectorAll('#gal .gal-item[hidden]');
      Array.prototype.forEach.call(Array.prototype.slice.call(hiddenItems, 0, 4), function (item) {
        item.hidden = false;
      });
      if (!document.querySelector('#gal .gal-item[hidden]')) galMore.hidden = true;
    });
  }

  /* room-card photo carousel — cycles that room's own photo set right on
     the card (homepage and the rooms listing page both use this same
     markup) without navigating away or opening the lightbox. The whole
     card is a single <a> (click-anywhere is wanted back), so these
     prev/next <button>s sit nested inside it — invalid content-model-wise,
     but harmless in practice as long as their clicks never reach the
     anchor: stopPropagation() below is what stops a button click from
     also triggering the card's own navigation, the same trick used
     against the lightbox <dialog> by .lb-prev/.lb-next. */
  var roomCarousels = document.querySelectorAll('[data-room-carousel]');
  roomCarousels.forEach(function (box) {
    var count = parseInt(box.getAttribute('data-count'), 10) || 1;
    if (count < 2) return;
    var ext = box.getAttribute('data-ext');
    var altBase = box.getAttribute('data-alt') || '';
    var img = box.querySelector('img');
    var countEl = box.querySelector('.room-carousel-count');
    if (!img) return;
    var dir = img.getAttribute('src').split('/').slice(0, -1).join('/');
    var current = 1;
    var render = function () {
      img.src = dir + '/' + current + '.' + ext;
      img.alt = altBase ? altBase + ' — photo ' + current : '';
      if (countEl) countEl.textContent = current + ' / ' + count;
    };
    var prev = box.querySelector('.room-carousel-prev');
    var next = box.querySelector('.room-carousel-next');
    if (prev) prev.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      current = current === 1 ? count : current - 1;
      render();
    });
    if (next) next.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      current = current === count ? 1 : current + 1;
      render();
    });
  });

  /* re-apply a fragment scroll once webfonts have settled.

     Landing on index.html#callback cold — which is what the footer links
     and every room page's "Get in touch" do — used to leave the section
     ~86px above where it belongs. The cause is NOT scroll maths and NOT
     lazy images (every <img> now carries width/height, and fixing that
     alone changed nothing here): it's the webfont swap. The stylesheet
     loads with display=swap, so the first paint uses Georgia/Helvetica
     fallback metrics, which make the hero 1000px tall against Fraunces
     and Karla's 882px. The browser computes the fragment scroll against
     the taller layout and never recomputes once the fonts arrive, so
     everything below the hero has quietly moved up 118px underneath it.

     Verified by blocking fonts.gstatic.com and measuring both states.

     Deliberately NOT fixed by padding --head-h: in-page nav clicks are
     already exact, and inflating the offset would break those to paper
     over this. */
  var hash = window.location.hash;
  if (hash.length > 1) {
    var target = null;
    try { target = document.querySelector(hash); } catch (e) { target = null; }
    if (target && document.fonts && document.fonts.ready) {
      /* Only real input counts as "the visitor took over" — a scroll
         listener would also catch the browser's own fragment scroll and
         the correction below, and then never fire. Yanking the page out
         from under someone who has started reading is worse than landing
         slightly off, so any of these cancels the correction. */
      var owned = false;
      var claim = function () { owned = true; };
      ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
        window.addEventListener(ev, claim, { passive: true, once: true });
      });

      document.fonts.ready.then(function () {
        requestAnimationFrame(function () {
          if (owned) return;
          /* html has scroll-behavior:smooth, which would animate this and
             read as a glitch — a load-time correction should be invisible.
             Suspend it rather than relying on behavior:'instant', which is
             newer than the rest of what this file assumes. */
          var root = document.documentElement;
          var prev = root.style.scrollBehavior;
          root.style.scrollBehavior = 'auto';
          target.scrollIntoView();          /* honours scroll-padding-top */
          root.style.scrollBehavior = prev;
        });
      });
    }
  }

  /* footer year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
