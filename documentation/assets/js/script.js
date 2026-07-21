/* ==========================================================
   SEVORA — MAIN.JS
   Sections: Scroll Spy (Active Sidebar), Copy Button, Menu Toggle
   ========================================================== */

(function () {

  var sections = document.querySelectorAll('.doc-section');
  var navLinks = document.querySelectorAll('.sidebar-nav a');
  var sidebar = document.getElementById('sidebar');
  var menuToggle = document.getElementById('menuToggle');

  /* ============ SCROLL SPY (ACTIVE SIDEBAR) ============ */
  function setActive() {
    var pos = window.scrollY + 100;
    var current = sections[0] ? sections[0].id : null;

    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* close mobile menu after navigating */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      sidebar.classList.remove('open');
    });
  });

  /* ============ COPY BUTTON ============ */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');

      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');

        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  });

  /* ============ MENU TOGGLE ============ */
  menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
  });

})();