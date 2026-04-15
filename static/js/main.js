/* ============================================
   IVAN DETAIL CO. — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  function animateTrail() {
    trailX += (parseFloat(cursor.style.left || 0) - trailX) * 0.12;
    trailY += (parseFloat(cursor.style.top  || 0) - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .service-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(2)';
      cursor.style.background = 'rgba(232,25,44,0.5)';
      cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--red)';
      cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });


  // ── Navbar Scroll ─────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  // ── Mobile Menu ───────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ── Hero Line Reveals ─────────────────────
  document.querySelectorAll('.line-reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });


  // ── Scroll-triggered AOS ──────────────────
  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('aos-visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));


  // ── Stat Counter Animation ────────────────
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start    = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));


  // ── Smooth Scroll ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });


  // ───────────────────────────────────────────
  // ⭐ FETCH BOOKED DATES FROM BACKEND
  // ───────────────────────────────────────────
  async function getBookedDates() {
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbyD-GjASwFTY-yYU0LHa0QUdaFuY0kYmd2rghOeJDAkx0FQSgtD-7Kf75FG8Cb_ztnv/exec?booked_dates=true");
      const data = await res.json();
      return data.booked || [];
    } catch (err) {
      console.error("Failed to load booked dates:", err);
      return [];
    }
  }


  // ── Form Submission ───────────────────────
  const form = document.getElementById('bookingForm');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    const fd = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: fd
      });

      const data = await response.json();

      if (data.success) {
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      successMsg.style.display = 'none';
      errorMsg.style.display = 'block';
      errorMsg.textContent = error.message || 'Something went wrong. Please try again.';
    } finally {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });


  // ── Input Focus Effects ───────────────────
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
    .forEach(input => {
      input.addEventListener('focus',  () => input.parentElement.classList.add('focused'));
      input.addEventListener('blur',   () => input.parentElement.classList.remove('focused'));
    });


  // ── Active Nav Link on Scroll ─────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
    });
  }, { passive: true });


  // ── Custom Calendar Widget ───────────────
  const calWrapper  = document.getElementById('calWrapper');
  const calDisplay  = document.getElementById('calDisplay');
  const calHidden   = document.getElementById('calHidden');
  const calDropdown = document.getElementById('calDropdown');
  const calDays     = document.getElementById('calDays');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calPrev     = document.getElementById('calPrev');
  const calNext     = document.getElementById('calNext');

  if (calWrapper) {
    let calYear, calMonth, bookedDates = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    function toISO(d) {
      return d.toISOString().split('T')[0];
    }

    function renderCal() {
      const months = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
      calMonthLabel.textContent = months[calMonth] + ' ' + calYear;
      calDays.innerHTML = '';
      const first = new Date(calYear, calMonth, 1).getDay();
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
      for (let i = 0; i < first; i++) {
        const blank = document.createElement('span');
        blank.classList.add('cal-day', 'cal-day--empty');
        calDays.appendChild(blank);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(calYear, calMonth, d);
        date.setHours(0,0,0,0);
        const iso = toISO(date);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = d;
        btn.classList.add('cal-day');
        if (date < tomorrow) {
          btn.classList.add('cal-day--past');
          btn.disabled = true;
        } else if (bookedDates.includes(iso)) {
          btn.classList.add('cal-day--booked');
          btn.disabled = true;
          btn.title = 'Already booked';
        } else {
          btn.classList.add('cal-day--avail');
          btn.addEventListener('click', () => {
            calHidden.value = iso;
            const display = new Date(calYear, calMonth, d);
            calDisplay.value = display.toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});
            calDropdown.classList.remove('open');
            calDisplay.classList.remove('cal-display--open');
          });
        }
        if (calHidden.value === iso) btn.classList.add('cal-day--selected');
        calDays.appendChild(btn);
      }
    }

    function openCal() {
      const now = new Date();
      calYear  = calYear  || now.getFullYear();
      calMonth = calMonth !== undefined ? calMonth : now.getMonth();
      renderCal();
      calDropdown.classList.toggle('open');
      calDisplay.classList.toggle('cal-display--open');
    }

    calDisplay.addEventListener('click', openCal);

    calPrev.addEventListener('click', () => {
      calMonth--;
      if (calMonth < 0) { calMonth = 11; calYear--; }
      renderCal();
    });
    calNext.addEventListener('click', () => {
      calMonth++;
      if (calMonth > 11) { calMonth = 0; calYear++; }
      renderCal();
    });

    document.addEventListener('click', (e) => {
      if (!calWrapper.contains(e.target)) {
        calDropdown.classList.remove('open');
        calDisplay.classList.remove('cal-display--open');
      }
    });

    // Load booked dates and re-render
    getBookedDates().then(dates => {
      bookedDates = dates;
      if (calDropdown.classList.contains('open')) renderCal();
    });
  }


  // ── Reviews System ───────────────────────
  // Fetches verified reviews from your NEW separate Google Sheet,
  // builds a star-rating summary, and renders a carousel.
  // 🔁 REPLACE THIS URL WITH YOUR NEW REVIEWS-ONLY SCRIPT URL
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4UhyXhXp1zzM-KYGmlOl5H2-DOfMswuBTymVesLDUgaMQwilNT_OC78m6HAbroN0p/exec";

  async function loadReviews() {
    const carousel   = document.getElementById('reviewsCarousel');
    const loading    = document.getElementById('reviewsLoading');
    const empty      = document.getElementById('reviewsEmpty');
    const dotsWrap   = document.getElementById('rnavDots');
    const prevBtn    = document.getElementById('rnavPrev');
    const nextBtn    = document.getElementById('rnavNext');
    if (!carousel) return;

    let reviews = [];
    try {
      const res  = await fetch(APPS_SCRIPT_URL + '?get_reviews=true');
      const data = await res.json();
      reviews = (data.reviews || []).filter(r => r.approved !== false);
    } catch (e) {
      console.warn('Reviews fetch failed:', e);
    }

    // Remove loader
    loading && loading.remove();

    if (!reviews.length) {
      empty && (empty.style.display = 'block');
      document.getElementById('rnavPrev') && (document.getElementById('rnavPrev').style.display = 'none');
      document.getElementById('rnavNext') && (document.getElementById('rnavNext').style.display = 'none');
      return;
    }

    // ── Build summary stats ────────────────────
    const total  = reviews.length;
    const avg    = reviews.reduce((s, r) => s + (r.rating || 5), 0) / total;
    const counts = [0,0,0,0,0]; // index 0 = 1-star, 4 = 5-star
    reviews.forEach(r => { const s = Math.round(r.rating || 5); if (s>=1&&s<=5) counts[s-1]++; });

    const avgEl = document.getElementById('avgRating');
    const starsEl = document.getElementById('summaryStars');
    const countEl = document.getElementById('reviewCount');
    if (avgEl) avgEl.textContent = avg.toFixed(1);
    if (starsEl) starsEl.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
    if (countEl) countEl.textContent = total;

    // Animate rating bars
    const bars = document.querySelectorAll('#reviewsBars .rbar-fill');
    bars.forEach((bar, i) => {
      const starNum = 5 - i; // bars go 5→1
      const cnt = counts[starNum - 1];
      const pct = total ? Math.round((cnt / total) * 100) : 0;
      bar.closest('.rbar-row').querySelector('.rbar-n').textContent = cnt;
      setTimeout(() => { bar.style.width = pct + '%'; }, 200 + i * 60);
    });

    // ── Build carousel cards ───────────────────
    const VISIBLE = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    let currentSlide = 0;
    const totalSlides = Math.ceil(total / VISIBLE);

    function starsHTML(n) {
      const full = Math.round(n || 5);
      return '<span class="t-stars">' + '★'.repeat(full) + '<span style="opacity:.3">' + '★'.repeat(5-full) + '</span></span>';
    }

    function renderSlide(idx) {
      carousel.innerHTML = '';
      const start = idx * VISIBLE;
      for (let i = start; i < Math.min(start + VISIBLE, total); i++) {
        const r = reviews[i];
        const initial = (r.name || 'A').charAt(0).toUpperCase();
        const relTime = r.time_ago || r.date || '';
        const card = document.createElement('div');
        card.className = 'testimonial-card t-card-anim';
        card.innerHTML = `
          <div class="t-card-top">
            ${starsHTML(r.rating)}
            <span class="t-source" title="Verified Google Review">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </span>
          </div>
          <p class="t-text">"${escapeHTML(r.review || r.text || '')}"</p>
          <div class="t-author">
            <div class="t-avatar">${initial}</div>
            <div>
              <div class="t-name">${escapeHTML(r.name || 'Customer')}</div>
              <div class="t-vehicle">${escapeHTML(r.vehicle || relTime || 'Verified Customer')}</div>
            </div>
          </div>`;
        carousel.appendChild(card);
        // Trigger animation
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('t-card-visible')));
      }

      // Update dots
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'rnav-dot' + (i === idx ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
        dot.addEventListener('click', () => { currentSlide = i; renderSlide(i); });
        dotsWrap.appendChild(dot);
      }

      prevBtn.disabled = (idx === 0);
      nextBtn.disabled = (idx === totalSlides - 1);
    }

    prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; renderSlide(currentSlide); }});
    nextBtn.addEventListener('click', () => { if (currentSlide < totalSlides - 1) { currentSlide++; renderSlide(currentSlide); }});

    // Swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0 && currentSlide < totalSlides - 1) { currentSlide++; renderSlide(currentSlide); }
        if (dx > 0 && currentSlide > 0) { currentSlide--; renderSlide(currentSlide); }
      }
    }, { passive: true });

    renderSlide(0);
  }

  function escapeHTML(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadReviews();


  // ── FAQ Toggle ───────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Open clicked if it wasn't already open
      if (!isOpen) item.classList.add('open');
    });
  });


  // ── Back to Top ───────────────────────────
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ── Gallery lightbox (simple) ─────────────
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-overlay span')?.textContent || 'Photo';
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;cursor:zoom-out;padding:2rem;
      `;
      const imgClone = document.createElement('img');
      imgClone.src   = img.src;
      imgClone.alt   = label;
      imgClone.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:8px;object-fit:contain;';
      overlay.appendChild(imgClone);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });


  // ───────────────────────────────────────────
  // ⭐ NEW: REVIEW SUBMISSION MODAL LOGIC
  // ───────────────────────────────────────────
  const modal = document.getElementById('reviewModal');
  const openBtns = document.querySelectorAll('#openReviewBtn, #emptyReviewBtn');
  const closeBtn = document.getElementById('closeReviewModal');
  const reviewForm = document.getElementById('customerReviewForm');
  const modalMsg = document.getElementById('reviewModalMsg');

  function openModal() {
    if (modal) modal.style.display = 'block';
  }
  function closeModal() {
    if (modal) modal.style.display = 'none';
    if (modalMsg) modalMsg.innerHTML = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(reviewForm);
      formData.append('action', 'submit_review');

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          modalMsg.innerHTML = '<span style="color:#6bcf7f;">✓ Thank you! Your review will appear shortly.</span>';
          reviewForm.reset();
          setTimeout(() => {
            closeModal();
            // Optionally reload reviews after a few seconds
            setTimeout(() => loadReviews(), 2000);
          }, 2000);
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        modalMsg.innerHTML = '<span style="color:var(--red);">❌ Error submitting review. Please try again or contact us.</span>';
        console.error(err);
      }
    });
  }

});