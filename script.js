/* ============================================================
   NAVEEN & SUSMIN — WEDDING INVITATION
   ============================================================ */

/* ---------- CONFIGURATION (edit here) ---------- */
const CONFIG = {
  // Countdown target: 4 January 2027, 10:00 AM India time (Asia/Kolkata, UTC+05:30)
  weddingDate: '2027-01-04T10:00:00+05:30',

  // "View Location" links
  ceremonyMapUrl: "https://share.google/Jj4pSTHNWPU1xVkvn",
  receptionMapUrl: "https://www.google.com/search?client=ms-android-samsung-rvo1&hs=5PHW&sca_esv=48580b77739e7a83&hl=en-US&cs=0&sxsrf=AKL5yDiXSDH9ml_EedfcHGQ7UT2SJ0aCrA:1793899464387&kgmid=/g/11f9w5ck50&q=kodenchery+parish+hall&shem=dlvs1,epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/4&kgs=574b13a0994c0f49&utm_source=dlvs1,epsd1,ltae,rimspwouoe,sh/x/loc/uni/m1/4#ebo=0"
};

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- OPEN INVITATION -> HERO TRANSITION ---------- */
  const openSection   = document.getElementById('open');
  const openBtn        = document.getElementById('openBtn');
  const openingVideo   = document.getElementById('openingVideo');
  const openPoster     = document.getElementById('openPoster');
  const heroVideo      = document.getElementById('heroVideo');
  const heroPoster     = document.getElementById('heroPoster');

  let opened = false;

  function primeHeroVideo(){
    // Load and attempt to play the hero video muted; fall back to poster silently.
    heroVideo.load();
    const playPromise = heroVideo.play();
    if (playPromise !== undefined){
      playPromise.then(() => {
        heroVideo.style.opacity = '1';
      }).catch(() => {
        // Autoplay blocked — keep poster visible, try again on first user scroll/tap.
        const retry = () => {
          heroVideo.play().then(() => { heroVideo.style.opacity = '1'; }).catch(()=>{});
          window.removeEventListener('scroll', retry);
          window.removeEventListener('touchstart', retry);
        };
        window.addEventListener('scroll', retry, { once:true, passive:true });
        window.addEventListener('touchstart', retry, { once:true, passive:true });
      });
    }
  }

  function finishOpening(){
    openSection.classList.add('opened');
    setTimeout(() => {
      openSection.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.getElementById('hero').scrollIntoView({ behavior: 'auto' });
    }, 1200);
  }

  function openInvitation(){
    if (opened) return;
    opened = true;

    // Fade the overlay text/button away first, letting the opening video take over the screen.
    openSection.classList.add('revealing');

    openingVideo.style.display = 'block';
    openingVideo.muted = true;
    openingVideo.currentTime = 0;

    const playPromise = openingVideo.play();

    // Prime the hero video partway through the opening clip so it's ready the instant we arrive.
    setTimeout(primeHeroVideo, 3500);

    let settled = false;
    const proceed = () => {
      if (settled) return;
      settled = true;
      finishOpening();
    };

    openingVideo.addEventListener('ended', proceed, { once: true });
    // Safety net in case autoplay of the opening clip is blocked or metadata is slow.
    setTimeout(proceed, 8600);

    if (playPromise !== undefined){
      playPromise.catch(() => {
        // Could not play the opening clip (e.g. blocked) — proceed straight to the hero.
        setTimeout(proceed, 600);
      });
    }
  }

  // Lock scroll until opened (mobile-first single-gesture invitation)
  document.body.style.overflow = 'hidden';
  openBtn.addEventListener('click', openInvitation);
  openBtn.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openInvitation(); });
  openBtn.setAttribute('tabindex', '0');
  openBtn.setAttribute('role', 'button');

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- LIVE COUNTDOWN ---------- */
  const weddingDate = new Date(CONFIG.weddingDate).getTime();
  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');
  const pad = n => String(n).padStart(2, '0');

  function updateCountdown(){
    const now = Date.now();
    let diff = weddingDate - now;
    if (diff < 0) diff = 0;
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins  = Math.floor((diff / (1000*60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);
    if (cdDays)  cdDays.textContent  = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins)  cdMins.textContent  = pad(mins);
    if (cdSecs)  cdSecs.textContent  = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- VENUE MAP LINKS ---------- */
  const ceremonyLink = document.getElementById('ceremonyMapLink');
  if (ceremonyLink && CONFIG.ceremonyMapUrl){
    ceremonyLink.href = CONFIG.ceremonyMapUrl;
  }
  const receptionLink = document.getElementById('receptionMapLink');
  if (receptionLink && CONFIG.receptionMapUrl){
    receptionLink.href = CONFIG.receptionMapUrl;
  }

  const bgMusic     = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function startMusic(){
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicToggle.classList.add('playing');
    }).catch(() => { /* autoplay blocked — user can start via the toggle */ });
    musicToggle.classList.add('show');
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused){
      bgMusic.play().then(() => musicToggle.classList.add('playing')).catch(()=>{});
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  // Start music the moment the guest opens the invitation (counts as a user gesture).
  openBtn.addEventListener('click', startMusic);

});
