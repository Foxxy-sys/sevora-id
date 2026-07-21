/* ==========================================================================
   SAVORE — main.js
   Loading screen, sticky navbar, scroll progress, scroll reveal,
   gallery lightbox, testimonial slider, FAQ accordion, mobile menu,
   menu tabs, reservation form, tasting-line fill.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADING SCREEN ---------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  let progress = 0;
  const progressTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) progress = 100;
    loaderProgress.style.width = progress + '%';
    if (progress >= 100) clearInterval(progressTimer);
  }, 140);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loaderProgress.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 350);
    }, 500);
  });

  /* ---------- STICKY NAVBAR + SCROLL PROGRESS ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');

  /* ---------- TASTING LINE FILL (signature dishes) ---------- */
  /* Declared before onScroll/updateTastingFill are used, to avoid a
     temporal-dead-zone ReferenceError when onScroll() runs immediately. */
  const tastingLine = document.getElementById('tastingLine');
  const tastingFill = document.getElementById('tastingFill');

  function updateTastingFill(){
    if (!tastingLine || !tastingFill) return;
    const rect = tastingLine.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    let visible = vh - rect.top;
    visible = Math.max(0, Math.min(visible, total));
    const pct = total > 0 ? (visible / total) * 100 : 0;
    tastingFill.style.height = pct + '%';
  }

  function onScroll(){
    const scrollY = window.scrollY;
    navbar.classList.toggle('is-scrolled', scrollY > 60);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';

    updateTastingFill();
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- MENU TABS ---------- */
  const menuTabs = document.querySelectorAll('.menu__tab');
  const menuPanels = document.querySelectorAll('.menu__panel');
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('is-active'));
      menuPanels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.menu__panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });

  /* ---------- GALLERY LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.querySelector('img').alt;
      lightbox.classList.add('is-open');
    });
  });
  function closeLightbox(){ lightbox.classList.remove('is-open'); lightboxImg.src=''; }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const sliderDotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDotsWrap.appendChild(dot);
  });
  const dots = sliderDotsWrap.querySelectorAll('span');

  function goToSlide(index){
    currentSlide = (index + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('is-active', i === currentSlide));
    resetAutoplay();
  }
  function resetAutoplay(){
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
  }
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  resetAutoplay();

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.accordion__item').forEach(item => {
    const head = item.querySelector('.accordion__head');
    const body = item.querySelector('.accordion__body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.accordion__item').forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.accordion__body').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- RESERVATION FORM ---------- */
  const reservationForm = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.add('is-visible');
    reservationForm.reset();
    setTimeout(() => formSuccess.classList.remove('is-visible'), 6000);
  });

  /* ---------- SMOOTH ANCHOR OFFSET (for fixed navbar) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1){
        const target = document.querySelector(id);
        if (target){
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top:y, behavior:'smooth' });
        }
      }
    });
  });

});
