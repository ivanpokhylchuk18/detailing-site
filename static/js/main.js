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

});
