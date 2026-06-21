/* ============================================================
   DAYCEM BHAR — PORTFOLIO MAIN JS
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     PRELOADER
     --------------------------------------------------------- */
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    setTimeout(function () {
      preloader.classList.add("is-hidden");
    }, 600);
  });
  // Safety fallback in case 'load' is delayed by slow assets
  setTimeout(function () {
    var preloader = document.getElementById("preloader");
    if (preloader) preloader.classList.add("is-hidden");
  }, 3500);

  /* ---------------------------------------------------------
     NAVIGATION — scroll state, active link, mobile drawer
     --------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");
  var navMobileClose = document.getElementById("navMobileClose");
  var scrim = document.getElementById("scrim");

  function onScrollNav() {
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  function openMobileNav() {
    navMobile.classList.add("is-open");
    scrim.classList.add("is-active");
    navToggle.classList.add("is-active");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileNav() {
    navMobile.classList.remove("is-open");
    scrim.classList.remove("is-active");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      if (navMobile.classList.contains("is-open")) closeMobileNav();
      else openMobileNav();
    });
  }
  if (navMobileClose) navMobileClose.addEventListener("click", closeMobileNav);
  if (scrim) scrim.addEventListener("click", closeMobileNav);

  // Close mobile nav + smooth scroll on link click
  document.querySelectorAll('.nav__mobile-links a, .nav__mobile-foot a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  // Active link highlight on scroll
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  function onScrollActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", href === current);
    });
  }
  window.addEventListener("scroll", onScrollActiveLink, { passive: true });
  onScrollActiveLink();

  /* ---------------------------------------------------------
     SCROLL REVEAL ANIMATIONS
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 150px 0px" }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // Safety net: if a fast/programmatic scroll (or anchor jump) carries an
  // element past the observer before it fires, force-reveal anything that
  // is already on-screen whenever scrolling stops.
  var revealFallbackTimer = null;
  function forceRevealOnScreen() {
    var vh = window.innerHeight;
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh + 200 && r.bottom > -200) {
        el.classList.add("is-visible");
      }
    });
  }
  window.addEventListener("scroll", function () {
    clearTimeout(revealFallbackTimer);
    revealFallbackTimer = setTimeout(forceRevealOnScreen, 120);
  }, { passive: true });
  // Catch anchor-link jumps (instant large position changes)
  window.addEventListener("hashchange", function () {
    setTimeout(forceRevealOnScreen, 300);
  });

  // Skill category bars + timeline dots need their own visibility trigger
  var skillCats = document.querySelectorAll(".skill-cat");
  var skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 150px 0px" }
  );
  skillCats.forEach(function (el) { skillObserver.observe(el); });

  var timelineItems = document.querySelectorAll(".timeline-item");
  var timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 150px 0px" }
  );
  timelineItems.forEach(function (el) { timelineObserver.observe(el); });

  /* ---------------------------------------------------------
     ANIMATED COUNTERS
     --------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    if (isNaN(target)) return;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var value = Math.round(eased * target);
      el.firstChild ? (el.childNodes[0].nodeValue = value) : (el.textContent = value);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.childNodes[0] ? (el.childNodes[0].nodeValue = target) : (el.textContent = target);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-counter]");
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.getAttribute("data-counted") === "1") { counterObserver.unobserve(el); return; }
          el.setAttribute("data-counted", "1");
          // Ensure a text node exists at index 0 to mutate (preserves child <span class="unit">)
          if (!el.childNodes.length || el.childNodes[0].nodeType !== 3) {
            el.insertBefore(document.createTextNode("0"), el.firstChild);
          }
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 150px 0px" }
  );
  counters.forEach(function (el) { counterObserver.observe(el); });

  // Safety net mirroring the reveal fallback above, in case a counter is
  // scrolled past too quickly for the observer to catch it.
  var counterFallbackTimer = null;
  function forceCountersOnScreen() {
    var vh = window.innerHeight;
    document.querySelectorAll("[data-counter]").forEach(function (el) {
      if (el.getAttribute("data-counted") === "1") return;
      var r = el.getBoundingClientRect();
      if (r.top < vh + 200 && r.bottom > -200) {
        el.setAttribute("data-counted", "1");
        if (!el.childNodes.length || el.childNodes[0].nodeType !== 3) {
          el.insertBefore(document.createTextNode("0"), el.firstChild);
        }
        animateCounter(el);
      }
    });
  }
  window.addEventListener("scroll", function () {
    clearTimeout(counterFallbackTimer);
    counterFallbackTimer = setTimeout(forceCountersOnScreen, 120);
  }, { passive: true });

  /* ---------------------------------------------------------
     CAROUSELS (per project gallery)
     --------------------------------------------------------- */
  function initCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var prevBtn = root.querySelector(".carousel__nav--prev");
    var nextBtn = root.querySelector(".carousel__nav--next");
    var dotsWrap = root.querySelector(".carousel__dots");
    var counterCurrent = root.querySelector(".carousel-current");
    var total = slides.length;
    var index = 0;

    if (!total) return;

    // Build dots
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".carousel__dot"));

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
      if (counterCurrent) counterCurrent.textContent = index + 1;
    }

    function goTo(i) {
      index = (i + total) % total;
      render();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

    // Swipe support
    var startX = 0, deltaX = 0, dragging = false;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    track.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      if (deltaX > 40) goTo(index - 1);
      else if (deltaX < -40) goTo(index + 1);
      deltaX = 0;
    });

    // Click image to open lightbox
    slides.forEach(function (slide) {
      var img = slide.querySelector("img");
      if (img) {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", function () {
          openLightbox(img.src, img.alt);
        });
      }
    });

    // Auto-advance (subtle, pauses on hover)
    var autoTimer = null;
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { goTo(index + 1); }, 5000);
    }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    startAuto();

    render();
  }

  document.querySelectorAll(".carousel").forEach(initCarousel);

  /* ---------------------------------------------------------
     LIGHTBOX
     --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-active");
    document.body.style.overflow = "";
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------------------------------------------------------
     PROJECT FILTER
     --------------------------------------------------------- */
  var filterBtns = document.querySelectorAll(".proj-filter__btn");
  var projItems = document.querySelectorAll("[data-category]");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");

      projItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        if (match) {
          item.style.display = "";
          requestAnimationFrame(function () {
            item.style.opacity = "1";
            item.style.transform = "none";
          });
        } else {
          item.style.opacity = "0";
          item.style.transform = "translateY(12px)";
          setTimeout(function () {
            if (item.style.opacity === "0") item.style.display = "none";
          }, 280);
        }
      });
    });
  });
  // Ensure transitions are smooth for filter toggling
  projItems.forEach(function (item) {
    item.style.transition = "opacity 0.32s ease-out, transform 0.32s ease-out";
  });

  /* ---------------------------------------------------------
     CV DOWNLOAD TRACKING (localStorage-backed public counter)
     --------------------------------------------------------- */
  var CV_KEY = "db_portfolio_cv_downloads";
  var CV_LAST_KEY = "db_portfolio_cv_last_download";

  function getDownloadCount() {
    var raw = localStorage.getItem(CV_KEY);
    var n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  function formatTimestamp(ts) {
    var d = new Date(ts);
    var opts = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    try {
      return d.toLocaleString(undefined, opts);
    } catch (e) {
      return d.toString();
    }
  }

  var cvCountEl = document.getElementById("cvDownloadCount");
  var cvLastEl = document.getElementById("cvLastDownload");
  var cvToast = document.getElementById("cvToast");

  function renderCvStats(bump) {
    var count = getDownloadCount();
    if (cvCountEl) {
      cvCountEl.textContent = count;
      if (bump) {
        cvCountEl.classList.remove("is-bumped");
        // force reflow to restart animation
        void cvCountEl.offsetWidth;
        cvCountEl.classList.add("is-bumped");
      }
    }
    var lastTs = localStorage.getItem(CV_LAST_KEY);
    if (cvLastEl) {
      cvLastEl.textContent = lastTs ? formatTimestamp(lastTs) : "—";
    }
  }

  function showCvToast() {
    if (!cvToast) return;
    cvToast.classList.add("is-visible");
    setTimeout(function () { cvToast.classList.remove("is-visible"); }, 2600);
  }

  function recordCvDownload() {
    var count = getDownloadCount() + 1;
    var now = new Date().toISOString();
    try {
      localStorage.setItem(CV_KEY, String(count));
      localStorage.setItem(CV_LAST_KEY, now);
    } catch (e) {
      /* localStorage unavailable — fail silently, download still proceeds */
    }
    renderCvStats(true);
    showCvToast();
  }

  function triggerCvDownload() {
    var link = document.createElement("a");
    link.href = "assets/cv/Daycem_Bhar_CV.pdf";
    link.download = "Daycem_Bhar_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    recordCvDownload();
  }

  var heroDownloadBtn = document.getElementById("downloadCvHero");
  var mainDownloadBtn = document.getElementById("downloadCvMain");

  if (heroDownloadBtn) {
    heroDownloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      triggerCvDownload();
    });
  }
  if (mainDownloadBtn) {
    mainDownloadBtn.addEventListener("click", function () {
      // native download proceeds via href; just record the event
      recordCvDownload();
    });
  }

  renderCvStats(false);

  /* ---------------------------------------------------------
     SMOOTH ANCHOR SCROLL (for browsers without CSS scroll-behavior)
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var hash = link.getAttribute("href");
      if (hash.length < 2) return;
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

})();
