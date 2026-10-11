/* Kuchipudi Heritage Arts Society: motion and small behaviours.
   Every page reads and works without this file; it only adds movement. */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement, win = window;
  var calm = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = win.matchMedia && win.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* 1. Menu button on small screens */
  var toggle = $(".nav-toggle"), nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    $$("li", nav).forEach(function (li, i) { li.style.setProperty("--i", i); });
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close menu" : "Menu";
    });
  }

  /* 2. Header shadow, hide on the way down, show on the way up; reading progress; back to top */
  var header = $(".site-header");
  var bar = doc.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true"); doc.body.appendChild(bar);
  var top = doc.createElement("button"); top.className = "to-top"; top.type = "button"; top.setAttribute("aria-label", "Back to top"); top.textContent = "↑"; doc.body.appendChild(top);
  top.addEventListener("click", function () { win.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" }); });
  var lastY = win.scrollY, lines = $$(".moments, .lineage"), ticking = false;
  function onScroll() {
    var y = win.scrollY, max = doc.documentElement.scrollHeight - win.innerHeight;
    bar.style.setProperty("--p", max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
    if (header) {
      header.classList.toggle("is-stuck", y > 8);
      var menuOpen = nav && nav.classList.contains("is-open");
      if (!menuOpen && y > 700 && y > lastY + 4) { header.classList.add("is-hidden"); }
      else if (y < lastY - 4 || y < 700) { header.classList.remove("is-hidden"); }
    }
    top.classList.toggle("is-on", y > 900);
    for (var i = 0; i < lines.length; i++) {
      var r = lines[i].getBoundingClientRect();
      if (r.bottom < -200 || r.top > win.innerHeight + 200) { continue; }
      lines[i].style.setProperty("--p", clamp((win.innerHeight * 0.72 - r.top) / r.height, 0, 1).toFixed(4));
    }
    lastY = y; ticking = false;
  }
  win.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  win.addEventListener("resize", onScroll);
  onScroll();

  /* 3. Things rise into place as you reach them. Anything already on screen
        when the page opens is left alone, so the first view is never empty. */
  var revealSel = [
    ".section-head", ".define-copy > *", ".niche", ".triad > div", ".moments > li", ".parade",
    ".flag-figure", ".flag-copy > *", ".parts > div", ".festival-copy > *", ".posters .poster",
    ".poster-pair .poster", ".video", ".quote", ".face", ".reach > *", ".prose > *", ".guru-photo",
    ".guru-body > *", ".person-photo", ".person-body > *", ".message", ".event", ".contact-list > div",
    ".stack > *", ".next a", ".footer-grid > *", ".jump", ".more"
  ].join(",");
  if (!calm && "IntersectionObserver" in win) {
    var all = $$(revealSel).filter(function (el) { return !el.closest(".hero, .page-head, .lightbox"); });
    var set = new Set(all);
    var targets = all.filter(function (el) {
      // keep the innermost candidates only, so nothing is animated twice
      var kids = el.querySelectorAll(revealSel);
      for (var k = 0; k < kids.length; k++) { if (set.has(kids[k])) { return false; } }
      return true;
    });
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.style.setProperty("--d", Math.min(n++, 7));
        e.target.classList.add("rv-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < win.innerHeight * 0.92) { return; }
      el.classList.add("rv");
      if (el.matches(".niche, .posters .poster, .poster-pair .poster, .face")) { el.classList.add("rv-zoom"); }
      if (el.matches(".guru-photo, .person-photo")) { el.classList.add("rv-left"); }
      if (el.matches(".person:nth-child(even) .person-photo")) { el.classList.remove("rv-left"); el.classList.add("rv-right"); }
      io.observe(el);
    });
    // mark timeline dots as their rows arrive, even for rows that were visible at load
    $$(".moments > li").forEach(function (li) { if (!li.classList.contains("rv")) { li.classList.add("rv-in"); } });
    $$(".guru").forEach(function (g) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { g.classList.add("rv-in"); o.disconnect(); } }, { threshold: 0.2 }).observe(g);
    });
  }

  /* 4. Numbers count up */
  $$("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (calm || isNaN(end)) { return; }
    var delay = root.classList.contains("intro") ? 1500 : 1000;
    el.textContent = "0";
    setTimeout(function () {
      var t0 = performance.now(), dur = 1500;
      (function step(t) {
        var k = clamp((t - t0) / dur, 0, 1), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(end * eased));
        if (k < 1) { requestAnimationFrame(step); }
      })(t0);
    }, delay);
  });

  /* 5. The hero follows the pointer a little */
  var stage = $(".hero-stage"), hero = $(".hero");
  if (stage && hero && finePointer && !calm) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      stage.style.setProperty("--px", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      stage.style.setProperty("--py", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
    hero.addEventListener("pointerleave", function () { stage.style.setProperty("--px", 0); stage.style.setProperty("--py", 0); });
  }

  /* 6. Posters tilt towards the pointer */
  if (finePointer && !calm) {
    $$(".poster").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
        card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
  }

  /* 7. Gold dust drifting across the stage */
  var canvas = $(".dust");
  if (canvas && !calm && canvas.getContext) {
    var ctx = canvas.getContext("2d"), motes = [], W = 0, H = 0, running = false, dpr = Math.min(win.devicePixelRatio || 1, 2);
    var size = function () {
      var r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = clamp(Math.round(W * H / 16000), 18, 70);
      while (motes.length < want) { motes.push({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.9, v: 0.12 + Math.random() * 0.38, d: (Math.random() - 0.5) * 0.25, a: Math.random() * 6.28, s: 0.008 + Math.random() * 0.02 }); }
      motes.length = want;
    };
    var draw = function () {
      if (!running) { return; }
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i]; m.y -= m.v; m.x += m.d; m.a += m.s;
        if (m.y < -6) { m.y = H + 6; m.x = Math.random() * W; }
        if (m.x < -6) { m.x = W + 6; } else if (m.x > W + 6) { m.x = -6; }
        ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(m.a));
        ctx.fillStyle = i % 5 === 0 ? "#ED90A3" : "#F1D38A";
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    size(); win.addEventListener("resize", size);
    if ("IntersectionObserver" in win) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting && !doc.hidden;
        if (on && !running) { running = true; requestAnimationFrame(draw); } else if (!on) { running = false; }
      }).observe(canvas);
      doc.addEventListener("visibilitychange", function () { if (doc.hidden) { running = false; } else { size(); running = true; requestAnimationFrame(draw); } });
    } else { running = true; requestAnimationFrame(draw); }
  }

  /* 8. Countdown to the festival. The date is always printed beside it. */
  var clocks = $$("[data-until]");
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tickClocks() {
    var now = Date.now();
    clocks.forEach(function (el) {
      var left = new Date(el.getAttribute("data-until")).getTime() - now;
      if (isNaN(left) || left <= 0) { el.hidden = true; var lab = el.previousElementSibling; if (lab && lab.classList.contains("countdown-label")) { lab.hidden = true; } return; }
      var s = Math.floor(left / 1000), vals = [Math.floor(s / 86400), pad(Math.floor(s % 86400 / 3600)), pad(Math.floor(s % 3600 / 60)), pad(s % 60)];
      var names = ["days", "hours", "minutes", "seconds"];
      if (!el.firstChild) { el.innerHTML = names.map(function (n) { return "<span><b></b>" + n + "</span>"; }).join(""); }
      var cells = el.querySelectorAll("b");
      for (var i = 0; i < 4; i++) {
        var v = String(vals[i]);
        if (cells[i].textContent !== v) { cells[i].textContent = v; if (!calm) { cells[i].classList.remove("tick"); void cells[i].offsetWidth; cells[i].classList.add("tick"); } }
      }
      el.hidden = false;
    });
  }
  if (clocks.length) { tickClocks(); setInterval(tickClocks, 1000); }

  /* 9. Videos: show the cover, load the YouTube player only when asked */
  $$("a.video[data-embed]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("data-yt"), frame = $(".video-frame", a);
      if (!id || !frame || $("iframe", frame)) { return; }
      e.preventDefault();
      var title = $(".video-title", a), f = doc.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = title ? title.textContent : "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin";
      frame.innerHTML = ""; frame.appendChild(f);
    });
  });

  /* 10. Pictures open larger */
  var zooms = $$("a.zoom");
  if (zooms.length && typeof HTMLDialogElement === "function") {
    var box = doc.createElement("dialog"); box.className = "lightbox";
    box.innerHTML = '<img alt=""><p></p><button type="button" aria-label="Close picture">×</button>';
    doc.body.appendChild(box);
    var big = $("img", box), cap = $("p", box);
    box.addEventListener("click", function (e) { if (e.target !== big) { box.close(); } });
    zooms.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var im = $("img", a);
        big.src = a.getAttribute("href"); big.alt = im ? im.alt : "";
        cap.textContent = a.getAttribute("data-caption") || (im ? im.alt : "");
        box.showModal();
      });
    });
  }

  /* 11. The flag: point at a part to read what it means */
  $$(".flagshow").forEach(function (show) {
    var hots = $$(".hot", show), rows = $$(".parts > div", show);
    function pick(id) {
      hots.forEach(function (h) { h.classList.toggle("is-on", h.getAttribute("data-part") === id); h.setAttribute("aria-pressed", h.getAttribute("data-part") === id ? "true" : "false"); });
      rows.forEach(function (r) { r.classList.toggle("is-on", r.getAttribute("data-part") === id); });
    }
    hots.forEach(function (h) {
      var id = h.getAttribute("data-part");
      h.addEventListener("pointerenter", function () { pick(id); });
      h.addEventListener("focus", function () { pick(id); });
      h.addEventListener("click", function () {
        pick(id);
        var row = rows.filter(function (r) { return r.getAttribute("data-part") === id; })[0];
        if (row && row.getBoundingClientRect().top > win.innerHeight - 80) { row.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" }); }
      });
    });
    rows.forEach(function (r) { r.addEventListener("pointerenter", function () { pick(r.getAttribute("data-part")); }); });
    if (rows[0]) { pick(rows[0].getAttribute("data-part")); }
  });

  /* 12. "On this page" follows the reader */
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in win) {
    var byId = {}; tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        tocLinks.forEach(function (a) { a.classList.remove("is-current"); });
        if (byId[e.target.id]) { byId[e.target.id].classList.add("is-current"); }
      });
    }, { rootMargin: "-18% 0px -70% 0px" });
    $$(".prose > h2[id]").forEach(function (h) { spy.observe(h); });
  }

  /* 13. Registration Portal for Geeta Saaram Natya Vedam */
  var regForm = doc.getElementById("registrationForm");
  if (regForm) {
    var regState = {
      currentStep: 1,
      maxStudents: 50,
      studentCount: 1,
      indPrice: 500,
      instPricePerStudent: 400
    };

    function handleTypeChange() {
      var checkedRadio = doc.querySelector('input[name="regType"]:checked');
      if (!checkedRadio) return;
      var type = checkedRadio.value;
      var indFields = doc.getElementById('individual-fields');
      var instFields = doc.getElementById('institution-fields');

      if (type === 'individual') {
        if (indFields) indFields.style.display = 'block';
        if (instFields) instFields.style.display = 'none';
        toggleRequired(indFields, true);
        toggleRequired(instFields, false);
      } else {
        if (indFields) indFields.style.display = 'none';
        if (instFields) instFields.style.display = 'block';
        toggleRequired(instFields, true);
        toggleRequired(indFields, false);
      }
    }

    function toggleRequired(container, isRequired) {
      if (!container) return;
      var inputs = container.querySelectorAll('input, select');
      inputs.forEach(function (inp) {
        if (inp.type !== 'button') {
          inp.required = isRequired;
        }
      });
    }

    function updateProgressBar(step) {
      var progressBar = doc.getElementById('progress-bar');
      if (progressBar) progressBar.style.width = ((step / 3) * 100) + '%';

      doc.querySelectorAll('.step-dot').forEach(function (dot) {
        var dotStep = parseInt(dot.getAttribute('data-step'), 10);
        if (dotStep <= step) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Show (or clear, with no message) the error line of the current step.
    function showError(message) {
      var section = doc.getElementById('step-' + regState.currentStep);
      var box = section && section.querySelector('.form-error');
      if (!box) return;
      box.textContent = message || '';
      box.hidden = !message;
    }

    function escapeHTML(value) {
      return String(value).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function nextStep(step) {
      var currentSection = doc.getElementById('step-' + regState.currentStep);
      if (!currentSection) return;

      var firstInvalid = null;
      if (regState.currentStep === 1) {
        var isChecked = doc.querySelector('input[name="regType"]:checked');
        if (!isChecked) {
          showError('Please select a registration type (Individual or Institution).');
          return;
        }
      } else {
        var inputs = currentSection.querySelectorAll('input[required], select[required]');
        inputs.forEach(function (input) {
          var ok = input.checkValidity();
          input.setAttribute('aria-invalid', ok ? 'false' : 'true');
          if (!ok && !firstInvalid) firstInvalid = input;
        });
      }

      if (firstInvalid) {
        showError('Please fill out all required fields marked with * correctly.');
        firstInvalid.focus();
        return;
      }
      showError('');

      if (step === 3) {
        updatePaymentSummary();
      }

      var prevSec = doc.getElementById('step-' + regState.currentStep);
      var nextSec = doc.getElementById('step-' + step);
      if (prevSec) prevSec.classList.remove('active');
      if (nextSec) nextSec.classList.add('active');

      regState.currentStep = step;
      updateProgressBar(regState.currentStep);

      var portal = doc.getElementById('reg-portal');
      if (portal) portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function prevStep(step) {
      showError('');
      var prevSec = doc.getElementById('step-' + regState.currentStep);
      var nextSec = doc.getElementById('step-' + step);
      if (prevSec) prevSec.classList.remove('active');
      if (nextSec) nextSec.classList.add('active');

      regState.currentStep = step;
      updateProgressBar(regState.currentStep);
    }

    function addStudentRow() {
      var currentRows = doc.querySelectorAll('.student-row').length;
      if (currentRows >= regState.maxStudents) {
        showError('You can only register up to ' + regState.maxStudents + ' students at a time.');
        return;
      }

      var container = doc.getElementById('students-container');
      if (!container) return;
      var rowId = 'student-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

      var rowHTML =
        '<div class="student-row" id="' + rowId + '">' +
          '<div class="input-group name-col">' +
            '<label>Student Name *</label>' +
            '<input type="text" name="studentNames[]" placeholder="e.g. Rahul Kumar" required>' +
          '</div>' +
          '<div class="input-group age-col">' +
            '<label>Age *</label>' +
            '<input type="number" name="studentAges[]" placeholder="e.g. 12" min="6" max="100" required>' +
          '</div>' +
          '<div class="input-group cat-col">' +
            '<label>Category *</label>' +
            '<select name="studentCategories[]" required>' +
              '<option value="" disabled selected>Select Category</option>' +
              '<option value="Vyastha-Nritya Kele: Solos">Vyastha-Nritya Kele: Solos</option>' +
              '<option value="Yugala-Nritya Kele: Duets">Yugala-Nritya Kele: Duets</option>' +
              '<option value="Brindha-Nritya Kele: Group Performances">Brindha-Nritya Kele: Group Performances</option>' +
              '<option value="Kalaapa-Kele: Kalaapa (50 min slots)">Kalaapa-Kele: Kalaapa (50 min slots)</option>' +
              '<option value="Yaksha-Gana Kele: Yakshaganas">Yaksha-Gana Kele: Yakshaganas</option>' +
              '<option value="Nritya-Rupaka: Dance Ballets">Nritya-Rupaka: Dance Ballets</option>' +
              '<option value="Navya-Rupa-Kalpana: New Choreographies">Navya-Rupa-Kalpana: New Choreographies</option>' +
            '</select>' +
          '</div>' +
          (currentRows > 0 ? '<button type="button" class="remove-btn" data-remove="' + rowId + '" title="Remove Student" aria-label="Remove Student">&#128465;&#65039;</button>' : '<div style="width: 42px;"></div>') +
        '</div>';

      container.insertAdjacentHTML('beforeend', rowHTML);
      updateStudentCount();
    }

    function removeStudentRow(rowId) {
      var row = doc.getElementById(rowId);
      if (row) {
        row.remove();
        updateStudentCount();
        showError('');
      }
    }

    function updateStudentCount() {
      var actualCount = doc.querySelectorAll('.student-row').length;
      var countEl = doc.getElementById('current-count');
      if (countEl) countEl.textContent = actualCount;
    }

    function updatePaymentSummary() {
      var checkedRadio = doc.querySelector('input[name="regType"]:checked');
      var type = checkedRadio ? checkedRadio.value : 'individual';
      var typeSpan = doc.getElementById('summary-type');
      var countSpan = doc.getElementById('summary-count');
      var totalSpan = doc.getElementById('summary-total');
      var btnAmount = doc.getElementById('btn-pay-amount');
      var rzpAmount = doc.getElementById('rzp-display-amount');

      var total = 0;
      var previewHTML = '';

      if (type === 'individual') {
        var name = (doc.getElementById('ind-name') || {}).value || '-';
        var age = (doc.getElementById('ind-age') || {}).value || '-';
        var contact = (doc.getElementById('ind-contact') || {}).value || '-';
        var email = (doc.getElementById('ind-email') || {}).value || '-';
        var cat = (doc.getElementById('ind-category') || {}).value || '-';

        previewHTML =
          '<div class="preview-row"><span class="label">Full Name</span><span class="value">' + escapeHTML(name) + '</span></div>' +
          '<div class="preview-row"><span class="label">Age</span><span class="value">' + escapeHTML(age) + '</span></div>' +
          '<div class="preview-row"><span class="label">Contact Number</span><span class="value">' + escapeHTML(contact) + '</span></div>' +
          '<div class="preview-row"><span class="label">Email Address</span><span class="value">' + escapeHTML(email) + '</span></div>' +
          '<div class="preview-row"><span class="label">Dance Category</span><span class="value">' + escapeHTML(cat) + '</span></div>';

        if (typeSpan) typeSpan.textContent = 'Individual';
        if (countSpan) countSpan.textContent = '1';
        total = regState.indPrice;
      } else {
        var instName = (doc.getElementById('inst-name') || {}).value || '-';
        var coord = (doc.getElementById('inst-coordinator') || {}).value || '-';
        var contactI = (doc.getElementById('inst-contact') || {}).value || '-';
        var emailI = (doc.getElementById('inst-email') || {}).value || '-';
        var actualCount = doc.querySelectorAll('.student-row').length;

        previewHTML =
          '<div class="preview-row"><span class="label">Institution</span><span class="value">' + escapeHTML(instName) + '</span></div>' +
          '<div class="preview-row"><span class="label">Coordinator</span><span class="value">' + escapeHTML(coord) + '</span></div>' +
          '<div class="preview-row"><span class="label">Contact Number</span><span class="value">' + escapeHTML(contactI) + '</span></div>' +
          '<div class="preview-row"><span class="label">Email Address</span><span class="value">' + escapeHTML(emailI) + '</span></div>' +
          '<div class="preview-row"><span class="label">Students Registered</span><span class="value">' + actualCount + '</span></div>';

        if (typeSpan) typeSpan.textContent = 'Institution (' + (instName || 'School') + ')';
        if (countSpan) countSpan.textContent = String(actualCount);
        total = actualCount * regState.instPricePerStudent;
      }

      var previewEl = doc.getElementById('preview-container');
      if (previewEl) previewEl.innerHTML = previewHTML;

      if (totalSpan) totalSpan.textContent = '₹' + total;
      if (btnAmount) btnAmount.textContent = '₹' + total;
      if (rzpAmount) rzpAmount.textContent = '₹' + total;
    }

    // PRE-LAUNCH: a stand-in for Razorpay Checkout. Replace before going live
    // (see CLAUDE.md, "Launch checklist").
    function openRazorpayMockup() {
      var modal = doc.getElementById('razorpay-modal');
      if (!modal) return;
      modal.classList.add('active');
      var pay = modal.querySelector('.rzp-pay-btn');
      if (pay) pay.focus();
    }

    function closeRazorpayMockup() {
      var modal = doc.getElementById('razorpay-modal');
      if (modal) modal.classList.remove('active');
    }

    // PRE-LAUNCH: `payload` is built but never sent anywhere, and the
    // reference number is random. Wire this to the real backend before launch.
    function submitForm() {
      closeRazorpayMockup();
      var ref = Math.floor(100000 + Math.random() * 900000);
      var refString = 'KDP-' + ref;

      var checkedRadio = doc.querySelector('input[name="regType"]:checked');
      var type = checkedRadio ? checkedRadio.value : 'individual';
      var payload = {
        type: type,
        referenceId: refString,
        amountPaid: (doc.getElementById('summary-total') || {}).textContent || ''
      };

      if (type === 'individual') {
        payload.studentName = (doc.getElementById('ind-name') || {}).value;
        payload.email = (doc.getElementById('ind-email') || {}).value;
        payload.age = (doc.getElementById('ind-age') || {}).value;
        payload.contact = (doc.getElementById('ind-contact') || {}).value;
        payload.category = (doc.getElementById('ind-category') || {}).value;
      } else {
        payload.institutionName = (doc.getElementById('inst-name') || {}).value;
        payload.coordinator = (doc.getElementById('inst-coordinator') || {}).value;
        payload.email = (doc.getElementById('inst-email') || {}).value;
        payload.contact = (doc.getElementById('inst-contact') || {}).value;

        var students = [];
        doc.querySelectorAll('.student-row').forEach(function (row) {
          var n = row.querySelector('input[name="studentNames[]"]');
          var a = row.querySelector('input[name="studentAges[]"]');
          var c = row.querySelector('select[name="studentCategories[]"]');
          if (n && a && c) {
            students.push({ name: n.value, age: a.value, category: c.value });
          }
        });
        payload.students = students;
      }

      var currentSec = doc.getElementById('step-' + regState.currentStep);
      var successSec = doc.getElementById('step-4');
      if (currentSec) currentSec.classList.remove('active');
      if (successSec) successSec.classList.add('active');

      var progBar = doc.querySelector('.reg-portal-card .progress-bar-container');
      var stepDots = doc.querySelector('.reg-portal-card .steps-indicator');
      if (progBar) progBar.style.display = 'none';
      if (stepDots) stepDots.style.display = 'none';

      var refDisplay = doc.getElementById('random-ref');
      if (refDisplay) refDisplay.textContent = ref;

      var portal = doc.getElementById('reg-portal');
      if (portal) portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function resetRegistrationForm() {
      regForm.reset();
      regState.currentStep = 1;
      var container = doc.getElementById('students-container');
      if (container) container.innerHTML = '';
      addStudentRow();
      handleTypeChange();

      doc.querySelectorAll('.form-step').forEach(function (step) {
        step.classList.remove('active');
      });
      var step1 = doc.getElementById('step-1');
      if (step1) step1.classList.add('active');

      var progBar = doc.querySelector('.reg-portal-card .progress-bar-container');
      var stepDots = doc.querySelector('.reg-portal-card .steps-indicator');
      if (progBar) progBar.style.display = '';
      if (stepDots) stepDots.style.display = '';
      updateProgressBar(1);
    }

    // One listener for every button in the portal and its payment window.
    var regActions = {
      'add-student': addStudentRow,
      'open-payment': openRazorpayMockup,
      'close-payment': closeRazorpayMockup,
      'pay': submitForm,
      'reset': resetRegistrationForm
    };
    doc.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-next], [data-prev], [data-remove], [data-action]');
      if (!btn || !(regForm.contains(btn) || btn.closest('#razorpay-modal'))) return;
      if (btn.hasAttribute('data-next')) nextStep(parseInt(btn.getAttribute('data-next'), 10));
      else if (btn.hasAttribute('data-prev')) prevStep(parseInt(btn.getAttribute('data-prev'), 10));
      else if (btn.hasAttribute('data-remove')) removeStudentRow(btn.getAttribute('data-remove'));
      else if (regActions[btn.getAttribute('data-action')]) regActions[btn.getAttribute('data-action')]();
    });
    regForm.addEventListener('submit', function (e) { e.preventDefault(); });
    doc.addEventListener('keydown', function (e) {
      var modal = doc.getElementById('razorpay-modal');
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeRazorpayMockup();
    });

    // Initialize
    addStudentRow();
    doc.querySelectorAll('input[name="regType"]').forEach(function (radio) {
      radio.addEventListener('change', function () { handleTypeChange(); showError(''); });
    });

    // Handle payment method clicks in Razorpay modal
    doc.querySelectorAll('.rzp-method').forEach(function (method) {
      method.addEventListener('click', function () {
        doc.querySelectorAll('.rzp-method').forEach(function (m) { m.classList.remove('active'); });
        method.classList.add('active');
      });
    });
  }
})();
