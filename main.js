// Hero slider
(function () {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots   = slider.querySelectorAll('.hero-slider__dot');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 8000);
  }

  slider.querySelector('.hero-slider__arrow--next')?.addEventListener('click', () => { next(); startTimer(); });
  slider.querySelector('.hero-slider__arrow--prev')?.addEventListener('click', () => { prev(); startTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startTimer(); }));

  startTimer();
})();

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav drawer
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
  mobileNav?.classList.add('open');
  mobileOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav?.classList.remove('open');
  mobileOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
mobileOverlay?.addEventListener('click', closeMobileNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

// Fade-up on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Treatment quiz
(function () {
  const results = {
    // [q1, q2, q3] → treatment
    pain:        { chronic: { back: 'osteo',   legs: 'deep',    whole: 'deep',    spine: 'osteo'   },
                   acute:   { back: 'sports',  legs: 'sports',  whole: 'sports',  spine: 'osteo'   },
                   stiff:   { back: 'deep',    legs: 'deep',    whole: 'swedish', spine: 'osteo'   },
                   none:    { back: 'deep',    legs: 'sports',  whole: 'swedish', spine: 'osteo'   } },
    tension:     { chronic: { back: 'deep',    legs: 'deep',    whole: 'deep',    spine: 'osteo'   },
                   acute:   { back: 'deep',    legs: 'sports',  whole: 'deep',    spine: 'deep'    },
                   stiff:   { back: 'deep',    legs: 'deep',    whole: 'swedish', spine: 'deep'    },
                   none:    { back: 'swedish', legs: 'swedish', whole: 'swedish', spine: 'swedish' } },
    relax:       { chronic: { back: 'swedish', legs: 'swedish', whole: 'swedish', spine: 'osteo'   },
                   acute:   { back: 'swedish', legs: 'swedish', whole: 'swedish', spine: 'swedish' },
                   stiff:   { back: 'deep',    legs: 'swedish', whole: 'swedish', spine: 'swedish' },
                   none:    { back: 'swedish', legs: 'swedish', whole: 'swedish', spine: 'swedish' } },
    performance: { chronic: { back: 'sports',  legs: 'sports',  whole: 'sports',  spine: 'osteo'   },
                   acute:   { back: 'sports',  legs: 'sports',  whole: 'sports',  spine: 'sports'  },
                   stiff:   { back: 'sports',  legs: 'sports',  whole: 'sports',  spine: 'sports'  },
                   none:    { back: 'sports',  legs: 'sports',  whole: 'sports',  spine: 'sports'  } },
  };

  const treatments = {
    deep:    { icon: '💆', tag: 'Best for tension & pain', title: 'Deep Tissue Massage',
               desc: 'Targets the deeper muscle layers to relieve chronic tension, reduce pain, and restore full movement. Ideal for persistent aches and postural issues.',
               link: 'deep-tissue.html' },
    swedish: { icon: '🛁', tag: 'Best for relaxation',    title: 'Swedish Massage',
               desc: 'Long, flowing strokes improve circulation and melt away stress. The perfect treatment if you need genuine rest and full-body relaxation.',
               link: 'swedish-massage.html' },
    sports:  { icon: '🏃', tag: 'Best for performance',   title: 'Sports Massage',
               desc: 'Advanced techniques designed for active people — accelerate recovery, prevent injury, and keep your body performing at its best.',
               link: 'sports-massage.html' },
    osteo:   { icon: '🦴', tag: 'Best for structural care', title: 'Osteopathy',
               desc: 'A holistic whole-body approach that looks beyond symptoms to address the root cause of pain and dysfunction through hands-on structural treatment.',
               link: 'osteopathy.html' },
  };

  let ans = {};
  const progressBar = document.getElementById('quizProgress');
  const counter     = document.getElementById('quizCounter');

  function showStep(id) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');

    if (id === 'quizStep1') { progressBar.style.width = '33%';  counter.textContent = 'Question 1 of 3'; counter.style.display = ''; }
    if (id === 'quizStep2') { progressBar.style.width = '66%';  counter.textContent = 'Question 2 of 3'; counter.style.display = ''; }
    if (id === 'quizStep3') { progressBar.style.width = '100%'; counter.textContent = 'Question 3 of 3'; counter.style.display = ''; }
    if (id === 'quizResult') { counter.style.display = 'none'; showResult(); }
  }

  function showResult() {
    const key = results[ans.q1]?.[ans.q2]?.[ans.q3] || 'deep';
    const t   = treatments[key];
    document.getElementById('quizResultIcon').textContent  = t.icon;
    document.getElementById('quizResultTag').textContent   = t.tag;
    document.getElementById('quizResultTitle').textContent = t.title;
    document.getElementById('quizResultDesc').textContent  = t.desc;
    const bookBtn = document.querySelector('.quiz-result__actions .btn-primary');
    if (bookBtn) bookBtn.href = t.link;
  }

  document.querySelectorAll('#quizStep1 .quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => { ans.q1 = btn.dataset.val; showStep('quizStep2'); });
  });
  document.querySelectorAll('#quizStep2 .quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => { ans.q2 = btn.dataset.val; showStep('quizStep3'); });
  });
  document.querySelectorAll('#quizStep3 .quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => { ans.q3 = btn.dataset.val; showStep('quizResult'); });
  });
  document.getElementById('quizRestart')?.addEventListener('click', () => {
    ans = {};
    progressBar.style.width = '33%';
    showStep('quizStep1');
  });
})();

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Cookie banner
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('yk_cookies')) return;

  // Slight delay so it slides up after page load
  setTimeout(() => banner.classList.add('show'), 800);

  function dismiss() {
    banner.classList.remove('show');
    banner.addEventListener('transitionend', () => banner.remove(), { once: true });
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('yk_cookies', 'accepted');
    dismiss();
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('yk_cookies', 'declined');
    dismiss();
  });
})();

// Set active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage) a.classList.add('active');
  else a.classList.remove('active');
});
