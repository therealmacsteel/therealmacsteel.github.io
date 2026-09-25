/* Mac Steel studio — progressive enhancement only. Every page is complete without JS.
   No trackers, no cookies, no third-party scripts. */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  // reveal on scroll
  var els = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // pointer glow on tiles (desktop only)
  if (matchMedia('(hover:hover)').matches) {
    d.querySelectorAll('.tile').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // rail arrows
  d.querySelectorAll('[data-rail]').forEach(function (nav) {
    var rail = d.getElementById(nav.getAttribute('data-rail'));
    if (!rail) return;
    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        rail.scrollBy({ left: (b.dataset.dir === 'prev' ? -1 : 1) * rail.clientWidth * 0.85, behavior: 'smooth' });
      });
    });
  });

  // clip filters
  var fl = d.querySelector('[data-filter-for]');
  if (fl) {
    var grid = d.getElementById(fl.getAttribute('data-filter-for'));
    fl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      fl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var p = b.dataset.p;
      grid.querySelectorAll('[data-p]').forEach(function (c) { c.hidden = !(p === 'all' || c.dataset.p === p); });
    });
  }

  // live refresh: numbers carry data-live="<feed>.<key>" and are already rendered at build time
  var live = d.querySelectorAll('[data-live]');
  if (live.length && window.fetch) {
    var feeds = {};
    live.forEach(function (el) { feeds[el.dataset.live.split('.')[0]] = 1; });
    Object.keys(feeds).forEach(function (f) {
      fetch('/data/' + f + '.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j) return;
        d.querySelectorAll('[data-live^="' + f + '."]').forEach(function (el) {
          var k = el.dataset.live.split('.')[1], v = j[k];
          if (v === null || v === undefined) return;
          var fmt = el.dataset.fmt;
          if (fmt === 'pct') v = (Math.round(v * 1000) / 10) + '%';
          else if (fmt === 'spct') v = (v > 0 ? '+' : '') + v + '%';
          else if (fmt === 'int') v = Number(v).toLocaleString();
          el.textContent = v;
        });
        var ts = d.querySelector('[data-updated="' + f + '"]');
        if (ts && j.generated_at) ts.textContent = new Date(j.generated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
      }).catch(function () {});
    });
  }
})();
