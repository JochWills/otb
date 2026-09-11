/* On The Bay B&B — interactions */
(function () {
  'use strict';

  /* one orchestrated entrance on load */
  requestAnimationFrame(function () { document.body.classList.add('ready'); });

  /* header turns solid as soon as the page moves */
  var head = document.getElementById('siteHead');
  if (head) {
    var ticking = false;
    var setState = function () {
      head.classList.toggle('stuck', window.scrollY > 56);
      ticking = false;
    };
    setState();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(setState); }
    }, { passive: true });
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

  /* "Enquire about this room" → scroll to the form and preselect the room */
  var select = document.getElementById('f-room');
  document.querySelectorAll('.link-enq').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wanted = btn.getAttribute('data-room');
      if (select) {
        Array.prototype.forEach.call(select.options, function (o) {
          if (o.text.trim() === wanted) select.value = o.value || o.text;
        });
      }
      var target = document.getElementById('callback');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var name = document.getElementById('f-name');
      if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 550);
    });
  });

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

  /* lightbox — gallery grid and per-room photo sets, with prev/next */
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

    /* per-room thumbnails — each room gets its own photo set */
    document.querySelectorAll('.room-img-btn').forEach(function (btn) {
      var photos;
      try { photos = JSON.parse(btn.getAttribute('data-photos') || '[]'); } catch (e) { photos = []; }
      var alt = btn.getAttribute('data-alt') || '';
      var set = photos.map(function (src) { return { src: src, alt: alt }; });
      btn.addEventListener('click', function () { open(set, 0); });
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

  /* footer year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
