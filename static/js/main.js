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

    // Collect form data as object
    const formData = {
      first_name: form.first_name.value.trim(),
      last_name:  form.last_name.value.trim(),
      phone:      form.phone.value.trim(),
      email:      form.email.value.trim(),
      vehicle:    form.vehicle.value.trim(),
      date:       form.date.value,
      service:    form.service.value,
      notes:      form.notes.value.trim(),
    };

    try {
      const fd = new FormData(form);

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
      // Reset button
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


  // ── Min date for date picker ──────────────
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }


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
      // Only open if it's a real image (not placeholder)
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
