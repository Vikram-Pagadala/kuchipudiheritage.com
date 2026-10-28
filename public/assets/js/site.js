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

  /* 14. Inquiry form on the contact page */
  var inqForm = doc.getElementById("inquiryForm");
  if (inqForm) {
    var inqDone = doc.getElementById("inquiry-done");
    var inqError = $(".form-error", inqForm);
    var inqFields = ["inq-name", "inq-email", "inq-topic", "inq-message"];
    function inqFail(msg, el) {
      inqError.textContent = msg; inqError.hidden = false;
      if (el) { el.setAttribute("aria-invalid", "true"); el.focus(); }
    }
    inqForm.addEventListener("submit", function (e) {
      e.preventDefault();
      inqError.hidden = true;
      $$("[aria-invalid]", inqForm).forEach(function (el) { el.removeAttribute("aria-invalid"); });
      if (inqForm.elements.website.value) { return; } // honeypot: bots fill it in
      var f = {};
      inqFields.forEach(function (id) { f[id] = doc.getElementById(id); });
      if (!f["inq-name"].value.trim()) { return inqFail("Please enter your name.", f["inq-name"]); }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f["inq-email"].value.trim())) { return inqFail("Please enter a valid email address.", f["inq-email"]); }
      if (!f["inq-topic"].value) { return inqFail("Please choose a topic.", f["inq-topic"]); }
      if (f["inq-message"].value.trim().length < 10) { return inqFail("Please write a short message (at least 10 characters).", f["inq-message"]); }
      // PRE-LAUNCH: `payload` is built but never sent anywhere. Wire this to the
      // real backend (or a Google Sheet / Apps Script) before launch.
      var payload = {
        name: f["inq-name"].value.trim(), email: f["inq-email"].value.trim(),
        phone: inqForm.elements.phone.value.trim(), topic: f["inq-topic"].value,
        message: f["inq-message"].value.trim()
      };
      void payload;
      inqForm.hidden = true; $(".reg-test-note", doc.getElementById("inquiry-card")).hidden = true; inqDone.hidden = false;
    });
    doc.addEventListener("click", function (e) {
      if (!e.target.closest('[data-inquiry="reset"]')) { return; }
      inqForm.reset(); inqForm.hidden = false; inqDone.hidden = true;
      $(".reg-test-note", doc.getElementById("inquiry-card")).hidden = false;
    });
  }

  /* 15. The dancer on the home stage: a one-minute Kuchipudi performance.
     A jointed figure in full costume is drawn in SVG and moved through a
     timeline of named poses and facial expressions (abhinaya). Feet always
     stay on the floor: the hips drop as the knees bend. */
  var arch = $(".hero-stage .arch");
  if (arch) {
    var NS = "http://www.w3.org/2000/svg", GROUND = 322, CX = 150, LOOP = 60;
    var C = { skin: "#DCA176", neck: "#CF9165", shade: "#A8693F", hair: "#1C0F10", alta: "#B8232B", lip: "#A9343B",
              kohl: "#140A0A", iris: "#3A2216", brass: "#D9A53A", deep: "#6B0F2B", gold: "#E3B651" };
    var SKIN = "url(#kd-skin)", GOLD = "url(#kd-gold)", PINK = "url(#kd-pink)", SILK = "url(#kd-silk)";
    var rad = function (d) { return d * Math.PI / 180; };
    var V = function (side, deg, len) { return [side * Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len]; };
    var add2 = function (a, b) { return [a[0] + b[0], a[1] + b[1]]; };
    var pt = function (p) { return p[0].toFixed(2) + " " + p[1].toFixed(2); };
    var lerp = function (a, b, u) { return a + (b - a) * u; };
    var mix = function (a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };
    var norm = function (a) { var l = Math.sqrt(a[0] * a[0] + a[1] * a[1]) || 1; return [a[0] / l, a[1] / l]; };
    function el(tag, attrs, parent) {
      var e = doc.createElementNS(NS, tag);
      for (var k in attrs) { e.setAttribute(k, attrs[k]); }
      if (parent) { parent.appendChild(e); }
      return e;
    }
    function shape(parent, d, attrs) { attrs.d = d; return el("path", attrs, parent); }
    // A tapered, round-ended limb through the points p with widths w.
    function limb(p, w) {
      var n = p.length, Lp = [], Rp = [], i, d, d1, d2;
      for (i = 0; i < n; i++) {
        d = norm([p[Math.min(i + 1, n - 1)][0] - p[Math.max(i - 1, 0)][0], p[Math.min(i + 1, n - 1)][1] - p[Math.max(i - 1, 0)][1]]);
        if (i > 0 && i < n - 1) {
          d1 = norm([p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]]); d2 = norm([p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]]);
          d = Math.abs(d1[0] + d2[0]) + Math.abs(d1[1] + d2[1]) < 0.2 ? d1 : norm([d1[0] + d2[0], d1[1] + d2[1]]);
        }
        Lp.push([p[i][0] - d[1] * w[i] / 2, p[i][1] + d[0] * w[i] / 2]);
        Rp.push([p[i][0] + d[1] * w[i] / 2, p[i][1] - d[0] * w[i] / 2]);
      }
      var d0 = norm([p[1][0] - p[0][0], p[1][1] - p[0][1]]), dE = norm([p[n - 1][0] - p[n - 2][0], p[n - 1][1] - p[n - 2][1]]);
      var s = "M" + pt(Lp[0]);
      for (i = 1; i < n; i++) { s += " L" + pt(Lp[i]); }
      s += " Q" + pt([p[n - 1][0] + dE[0] * w[n - 1] * 0.7, p[n - 1][1] + dE[1] * w[n - 1] * 0.7]) + " " + pt(Rp[n - 1]);
      for (i = n - 2; i >= 0; i--) { s += " L" + pt(Rp[i]); }
      return s + " Q" + pt([p[0][0] - d0[0] * w[0] * 0.7, p[0][1] - d0[1] * w[0] * 0.7]) + " " + pt(Lp[0]) + "Z";
    }
    function part(a, b, u0, u1) { return [mix(a, b, u0), mix(a, b, u1)]; }

    /* ---- the figure ---- */
    var svg = el("svg", { viewBox: "30 40 240 300", "class": "dancer-svg", preserveAspectRatio: "xMidYMax meet", focusable: "false" });
    var defs = el("defs", {}, svg);
    function grad(id, kind, attrs, stops) {
      var gr = el(kind, attrs, defs); gr.setAttribute("id", id);
      stops.forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] == null ? 1 : s[2] }, gr); });
    }
    grad("kd-skin", "linearGradient", { x1: 0, y1: 0, x2: 1, y2: 0 }, [[0, "#EBBA8F"], [1, "#C4865A"]]);
    grad("kd-face", "radialGradient", { cx: .42, cy: .36, r: .72 }, [[0, "#F3CAA3"], [.65, "#DCA176"], [1, "#BF8052"]]);
    grad("kd-silk", "linearGradient", { x1: 0, y1: 0, x2: 0, y2: 1 }, [[0, "#C42747"], [1, "#7A0E26"]]);
    grad("kd-pink", "linearGradient", { x1: 0, y1: 0, x2: 1, y2: 0 }, [[0, "#F8BCC9"], [.5, "#EE95A8"], [1, "#D9728B"]]);
    grad("kd-gold", "linearGradient", { x1: 0, y1: 0, x2: 1, y2: 1 }, [[0, "#FCE7A8"], [.5, "#E3B651"], [1, "#B07B1C"]]);
    grad("kd-glow", "radialGradient", { cx: .5, cy: .55, r: .5 }, [[0, "#F1D38A", .38], [1, "#F1D38A", 0]]);
    el("ellipse", { cx: CX, cy: 205, rx: 118, ry: 150, fill: "url(#kd-glow)" }, svg);
    var g = el("g", {}, svg);
    var shadow = el("ellipse", { cy: GROUND + 1, rx: 34, ry: 4.5, fill: "rgba(0,0,0,.22)" }, g);
    var plate = el("g", {}, g);
    var plateOuter = el("ellipse", { fill: GOLD, stroke: C.deep, "stroke-width": 1.1 }, plate);
    var plateInner = el("ellipse", { fill: "#F6DB93", opacity: ".6" }, plate);

    // legs: silk trousers with gold cuffs, alta-edged feet and rows of ghungroo
    var legs = [0, 1].map(function () {
      return { leg: el("path", { fill: PINK, stroke: "#B85A72", "stroke-width": .5 }, g),
               fold: el("path", { fill: "none", stroke: "#C9607A", "stroke-width": .7, opacity: ".6" }, g),
               cuff: el("path", { fill: GOLD }, g), foot: el("g", {}, g), bells: el("g", {}, g) };
    });
    legs.forEach(function (l) {
      shape(l.foot, "M-4 -1 C-5 2 -4.4 4.6 -2 5 L9.6 5 C11.6 5 12.4 3.2 10.8 2.2 C7.6 1 3.6 -.6 2.4 -2Z", { fill: SKIN, stroke: C.alta, "stroke-width": .9 });
      shape(l.foot, "M6.4 5 L6.6 2.2 M8.4 5 L8.6 2.6", { stroke: C.shade, "stroke-width": .35, opacity: ".7" });
      [-4.2, -1.4, 1.4, 4.2].forEach(function (x) {
        el("circle", { cx: x, cy: -2.4, r: 1.35, fill: C.brass, stroke: C.deep, "stroke-width": .3 }, l.bells);
        el("circle", { cx: x + 1.4, cy: .2, r: 1.35, fill: C.brass, stroke: C.deep, "stroke-width": .3 }, l.bells);
      });
    });

    var neck = el("path", { fill: "none", stroke: C.neck, "stroke-width": 9, "stroke-linecap": "round" }, g);

    // trunk, drawn upright about the hips and turned with the lean
    var body = el("g", {}, g);
    shape(body, "M-15 -14 C-18 -6 -19 2 -18 7 L18 7 C19 2 18 -6 15 -14Z", { fill: PINK });
    shape(body, "M-19 -66 C-20 -56 -16 -47 -13 -38 C-11 -30 -11.5 -22 -13.5 -14 L13.5 -14 C11.5 -22 11 -30 13 -38 C16 -47 20 -56 19 -66 Q0 -72 -19 -66Z", { fill: SKIN });
    shape(body, "M-.7 -27 Q0 -25.4 .7 -27", { fill: "none", stroke: C.shade, "stroke-width": .7 });
    shape(body, "M-19.5 -66.5 Q0 -72.5 19.5 -66.5 C20 -58 18 -50 15 -42 Q7.5 -38.6 0 -41 Q-7.5 -38.6 -15 -42 C-18 -50 -20 -58 -19.5 -66.5Z", { fill: SILK });
    shape(body, "M-8.5 -69.6 Q0 -55.5 8.5 -69.6Z", { fill: SKIN });
    shape(body, "M-8.5 -69.6 Q0 -55.5 8.5 -69.6", { fill: "none", stroke: C.gold, "stroke-width": 1.2 });
    shape(body, "M-15 -42 Q-7.5 -38.6 0 -41 Q7.5 -38.6 15 -42", { fill: "none", stroke: C.gold, "stroke-width": 2 });
    shape(body, "M-13 -52 Q-7.5 -44.5 -2 -50 M2 -50 Q7.5 -44.5 13 -52", { fill: "none", stroke: "#4A0716", "stroke-width": .9, opacity: ".45" });
    shape(body, "M11 -67.5 L18.5 -65 L-4 -15 L-11.5 -15Z", { fill: PINK, stroke: C.gold, "stroke-width": 1 });
    shape(body, "M-14 -19 Q0 -15.5 14 -19 L14.5 -12.5 Q0 -9 -14.5 -12.5Z", { fill: GOLD, stroke: "#8A5A10", "stroke-width": .5 });
    el("circle", { cx: 0, cy: -13.4, r: 2.5, fill: C.alta, stroke: C.gold, "stroke-width": .8 }, body);
    shape(body, "M-6.5 -71 Q0 -64.5 6.5 -71", { fill: "none", stroke: C.gold, "stroke-width": 2.2 });
    shape(body, "M-9 -69.5 Q-6 -50 0 -48.5 Q6 -50 9 -69.5", { fill: "none", stroke: C.gold, "stroke-width": 1.3 });
    el("circle", { cx: 0, cy: -47.2, r: 2.6, fill: GOLD, stroke: C.deep, "stroke-width": .5 }, body);
    el("circle", { cx: 0, cy: -47.2, r: 1.1, fill: C.alta }, body);

    // the pleated fan of the costume, opening as the knees part
    var fan = el("path", { fill: SILK, stroke: C.deep, "stroke-width": .6, "stroke-linejoin": "round" }, g);
    var pleats = el("path", { fill: "none", stroke: C.gold, "stroke-width": .8, opacity: ".55" }, g);
    var hem = el("path", { fill: "none", stroke: C.gold, "stroke-width": 3.2 }, g);

    // arms: half sleeves, armlets (vanki) and bangles; hands hold the mudras
    var arms = [0, 1].map(function () {
      return { skin: el("path", { fill: SKIN }, g), sleeve: el("path", { fill: SILK }, g), edge: el("path", { fill: GOLD }, g),
               armlet: el("path", { fill: GOLD }, g), bangle: el("path", { fill: GOLD }, g), bangle2: el("path", { fill: C.alta }, g) };
    });
    var hands = [0, 1].map(function () {
      var root = el("g", {}, g), mushti = el("g", {}, root), pataka = el("g", {}, root), padma = el("g", {}, root);
      shape(mushti, "M0 -3.3 C3 -4 6 -4.2 7.8 -3.4 C9.4 -2.6 9.6 2.6 7.8 3.4 C6 4.2 3 4 0 3.3Z", { fill: SKIN });
      shape(mushti, "M7.4 -2.6 L7.4 2.6 M5.6 -2.9 Q6.6 -1.4 5.6 0 Q6.6 1.4 5.6 2.9", { fill: "none", stroke: C.shade, "stroke-width": .45 });
      shape(mushti, "M2.6 -3.6 C4.8 -2.2 6 -.6 6.4 1.2", { fill: "none", stroke: C.shade, "stroke-width": .6 });
      shape(pataka, "M0 -3 C3 -3.6 6 -3.6 8 -3.3 L14 -2.4 C15.6 -2.2 16.4 -1 16.4 0 C16.4 1 15.6 2.2 14 2.4 L8 3.2 C6 3.5 3 3.5 0 3Z", { fill: SKIN });
      shape(pataka, "M14.2 -2.4 C15.6 -2.2 16.4 -1 16.4 0 C16.4 1 15.6 2.2 14.2 2.4Z", { fill: C.alta });
      shape(pataka, "M8.5 -1.2 L15.4 -1.1 M8.5 .6 L15.8 .6 M8.3 2 L14.8 2", { fill: "none", stroke: C.shade, "stroke-width": .4 });
      shape(pataka, "M1.5 -2.8 C3.5 -5 6.5 -5.4 8.2 -4 C7 -3.4 5 -3.2 3 -2.6Z", { fill: SKIN, stroke: C.shade, "stroke-width": .35 });
      el("circle", { cx: 4.2, cy: 0, r: 1.5, fill: C.alta, opacity: ".55" }, pataka);
      shape(padma, "M0 -3.4 C3 -4.2 6 -4.4 7.5 -3.6 L7.5 3.6 C6 4.4 3 4.2 0 3.4Z", { fill: SKIN });
      [[-62, -3.2, 6, 1.9], [-30, -1.8, 7.2, 1.7], [-4, -.2, 7.8, 1.7], [22, 1.5, 7.2, 1.6], [48, 3, 6.2, 1.5]].forEach(function (f) {
        var a = rad(f[0]), x2 = 7 + Math.cos(a) * f[2], y2 = f[1] + Math.sin(a) * f[2];
        shape(padma, "M7 " + f[1] + " Q" + pt([7 + Math.cos(a) * f[2] * .6, f[1] + Math.sin(a) * f[2] * .6 - .6]) + " " + pt([x2, y2]),
              { fill: "none", stroke: C.skin, "stroke-width": f[3], "stroke-linecap": "round" });
        el("circle", { cx: x2.toFixed(2), cy: y2.toFixed(2), r: f[3] * .45, fill: C.alta }, padma);
      });
      el("circle", { cx: 3.8, cy: 0, r: 1.5, fill: C.alta, opacity: ".55" }, padma);
      return { root: root, shapes: [mushti, pataka, padma] };
    });

    // head: jasmine, hair with the sun and moon ornaments, jewellery and a face that acts
    var head = el("g", {}, g), j;
    for (j = 0; j < 11; j++) {
      var an = rad(196 + j * 14.8);
      el("circle", { cx: (Math.cos(an) * 18.4).toFixed(2), cy: (-2 + Math.sin(an) * 18.4).toFixed(2), r: 2.2, fill: "#FFFDF4", stroke: "#D9D0B8", "stroke-width": .3 }, head);
    }
    [-1, 1].forEach(function (s) { el("ellipse", { cx: s * 12.6, cy: 0, rx: 2.2, ry: 3.6, fill: C.skin }, head); });
    shape(head, "M0 -16 C8 -16 12.6 -10 12.6 -2.5 C12.6 6 8.6 13 0 16.2 C-8.6 13 -12.6 6 -12.6 -2.5 C-12.6 -10 -8 -16 0 -16Z", { fill: "url(#kd-face)" });
    var cheeks = [-1, 1].map(function (s) { return el("ellipse", { cx: s * 7.2, cy: 4.4, rx: 3, ry: 1.9, fill: "#E2725F" }, head); });
    shape(head, "M-13.6 2 C-15.4 -12 -8.6 -19.6 0 -19.6 C8.6 -19.6 15.4 -12 13.6 2 C13 -2 12.6 -6 11.4 -8.6 C9 -12.4 4.6 -13.4 0 -12.6 C-4.6 -13.4 -9 -12.4 -11.4 -8.6 C-12.6 -6 -13 -2 -13.6 2Z", { fill: C.hair });
    shape(head, "M-11 -8.4 Q-6 -13.2 0 -12.4 Q6 -13.2 11 -8.4", { fill: "none", stroke: C.gold, "stroke-width": .9 });
    shape(head, "M0 -19.4 L0 -12", { stroke: C.gold, "stroke-width": .7 });
    el("circle", { cx: 0, cy: -11.2, r: 1.7, fill: GOLD, stroke: "#8A5A10", "stroke-width": .3 }, head);
    el("ellipse", { cx: 0, cy: -9.3, rx: .9, ry: 1.2, fill: C.alta }, head);
    el("circle", { cx: 8.6, cy: -15.4, r: 3, fill: GOLD, stroke: "#8A5A10", "stroke-width": .4 }, head);
    el("circle", { cx: 8.6, cy: -15.4, r: 1.3, fill: C.alta }, head);
    shape(head, "M-11.2 -17.6 A3.2 3.2 0 1 0 -6 -13.2 A2.6 2.6 0 1 1 -11.2 -17.6Z", { fill: GOLD, stroke: "#8A5A10", "stroke-width": .3 });
    var brows = [0, 1].map(function () { return el("path", { fill: "none", stroke: C.hair, "stroke-width": 1.15, "stroke-linecap": "round" }, head); });
    var eyes = [-1, 1].map(function (s, k) {
      var e = { s: s };
      e.crease = el("path", { fill: "none", stroke: C.shade, "stroke-width": .5, opacity: ".55" }, head);
      e.white = el("path", { fill: "#FBF5EC" }, head);
      e.clip = el("path", {}, el("clipPath", { id: "kd-eye" + k }, defs));
      e.iris = el("g", {}, el("g", { "clip-path": "url(#kd-eye" + k + ")" }, head));
      el("circle", { r: 2.05, fill: C.iris }, e.iris);
      el("circle", { r: .95, fill: "#050303" }, e.iris);
      el("circle", { cx: .6, cy: -.6, r: .5, fill: "#fff" }, e.iris);
      e.upper = el("path", { fill: "none", stroke: C.kohl, "stroke-width": 1.15, "stroke-linecap": "round", "stroke-linejoin": "round" }, head);
      e.lower = el("path", { fill: "none", stroke: C.kohl, "stroke-width": .55 }, head);
      return e;
    });
    shape(head, "M-.6 -1.5 Q-1.2 3.5 -2.3 5.6 Q-1.2 6.9 0 6.5 Q1.2 6.9 2.3 5.6", { fill: "none", stroke: C.shade, "stroke-width": .7, "stroke-linecap": "round" });
    el("circle", { cx: 2.7, cy: 6.4, r: 1.7, fill: "none", stroke: C.gold, "stroke-width": .55 }, head);
    el("circle", { cx: 2.7, cy: 8.1, r: .55, fill: "#fff" }, head);
    el("circle", { cx: 0, cy: -6.8, r: 1.05, fill: "#B3121E" }, head);
    var mouth = { open: el("path", { fill: "#4A1416" }, head), teeth: el("path", { fill: "#FBF5EC" }, head),
                  upper: el("path", { fill: C.lip }, head), lower: el("path", { fill: "#BC4A50" }, head) };
    shape(head, "M-3 14 Q0 15.4 3 14", { fill: "none", stroke: C.shade, "stroke-width": .5, opacity: ".5" });
    [-1, 1].forEach(function (s) {
      var jh = el("g", { transform: "translate(" + s * 12.8 + " 3)" }, head);
      el("circle", { r: 1.2, fill: GOLD }, jh);
      shape(jh, "M-2.4 5.6 Q-2.4 1.6 0 1.6 Q2.4 1.6 2.4 5.6Z", { fill: GOLD, stroke: "#8A5A10", "stroke-width": .3 });
      [-1.6, 0, 1.6].forEach(function (x) { el("circle", { cx: x, cy: 6.4, r: .55, fill: "#fff" }, jh); });
    });
    var pot = el("g", {}, head);
    el("ellipse", { cx: 0, cy: -29, rx: 10.5, ry: 9.5, fill: GOLD, stroke: C.deep, "stroke-width": .9 }, pot);
    shape(pot, "M-7 -30 Q0 -25 7 -30", { fill: "none", stroke: C.deep, "stroke-width": .8 });
    el("rect", { x: -5.5, y: -41.5, width: 11, height: 5, rx: 2, fill: GOLD, stroke: C.deep, "stroke-width": .6 }, pot);
    el("ellipse", { cx: 0, cy: -46.5, rx: 2.6, ry: 4.6, fill: "#FFD27A" }, pot);
    el("ellipse", { cx: 0, cy: -45.6, rx: 1.1, ry: 2.2, fill: "#FFF4D0" }, pot);

    var host = doc.createElement("div"); host.className = "dancer";
    host.setAttribute("aria-hidden", "true");
    host.appendChild(svg);
    arch.appendChild(host);
    var cap = doc.createElement("p"); cap.className = "dance-cap"; arch.appendChild(cap);
    var btn = doc.createElement("button"); btn.type = "button"; btn.className = "dance-toggle";
    arch.parentNode.appendChild(btn);

    function face(q, blink) {
      var open = Math.max(.04, q.eo * blink);
      eyes.forEach(function (e) {
        var s = e.s, cx = s * 5.4, cy = -2.4, up = 2.6 * open, lo = 1.3 * Math.min(open, 1.1);
        var a = [cx - s * 3.4, cy + .3], b = [cx + s * 3.6, cy - .3];
        var top = " Q" + pt([cx - s * .4, cy - up * 1.25]) + " ", bot = " Q" + pt([cx, cy + lo * 1.3]) + " ";
        var d = "M" + pt(a) + top + pt(b) + bot + pt(a) + "Z";
        e.white.setAttribute("d", d); e.clip.setAttribute("d", d);
        e.upper.setAttribute("d", "M" + pt(a) + top + pt(b) + " L" + pt([b[0] + s * 2, b[1] - 1.3]));
        e.lower.setAttribute("d", "M" + pt(a) + bot + pt(b));
        e.crease.setAttribute("d", "M" + pt([a[0], a[1] - 1.2 - up * .45]) + " Q" + pt([cx - s * .4, cy - up * 1.25 - 1.9]) + " " + pt([b[0], b[1] - 1.4]));
        e.iris.setAttribute("transform", "translate(" + pt([cx + q.gz * 1.3, cy - .2 + q.gy * .7]) + ")");
      });
      brows.forEach(function (b, k) {
        var s = k ? 1 : -1;
        b.setAttribute("d", "M" + pt([s * 2.4, -6.4 - q.br * 1.1 - q.bi * 1.4]) + " Q" + pt([s * 6.2, -10 - q.br * 1.5 - q.bi * .3]) + " " + pt([s * 10.2, -6.9 - q.br * .8]));
      });
      var w = 3.6 + q.sm * .8, Ly = 9.6 - q.sm * 1.3, yT = 9.8 + q.sm * .45, mo = Math.max(0, q.mo), yB = yT + mo * 3;
      var Lc = pt([-w, Ly]), Rc = pt([w, Ly]);
      var arc = function (y) { return " Q" + pt([0, 2 * y - Ly]) + " "; };
      mouth.upper.setAttribute("d", "M" + Lc + " Q" + pt([-w * .5, 8]) + " " + pt([0, 8.7]) + " Q" + pt([w * .5, 8]) + " " + Rc + arc(yT) + Lc + "Z");
      mouth.open.setAttribute("d", mo > .04 ? "M" + Lc + arc(yT) + Rc + arc(yB) + Lc + "Z" : "");
      mouth.teeth.setAttribute("d", mo > .15 ? "M" + Lc + arc(yT) + Rc + arc(yT + Math.min(mo * 3, 1.3)) + Lc + "Z" : "");
      mouth.lower.setAttribute("d", "M" + Lc + arc(yB) + Rc + arc(yB + 1.8) + Lc + "Z");
      cheeks.forEach(function (c) { c.setAttribute("opacity", (.16 + .14 * Math.max(0, q.sm)).toFixed(2)); });
    }

    function draw(q, blink) {
      var L = { thigh: 56, shin: 56, torso: 70, upper: 34, fore: 30 };
      var reach = function (t, k) { return L.thigh * Math.cos(rad(t)) + L.shin * Math.cos(rad(t - k)); };
      var hipY = GROUND - 4 - Math.max(reach(q.tl, q.kl), reach(q.tr, q.kr));
      var hip = [CX + q.sx, hipY], ln = rad(q.lean), cs = Math.cos(ln), sn = Math.sin(ln), sides = [-1, 1];
      var R = function (p) { return [hip[0] + p[0] * cs - p[1] * sn, hipY + p[0] * sn + p[1] * cs]; };
      var thigh = [q.tl, q.tr], bend = [q.kl, q.kr], knees = [];
      shadow.setAttribute("cx", hip[0].toFixed(1));
      sides.forEach(function (sd, i) {
        var top = [hip[0] + sd * 8, hipY - 4], l = legs[i];
        var knee = knees[i] = add2(top, V(sd, thigh[i], L.thigh)), ankle = add2(knee, V(sd, thigh[i] - bend[i], L.shin));
        l.leg.setAttribute("d", limb([top, knee, ankle], [15, 11.5, 8]));
        l.fold.setAttribute("d", "M" + pt(mix(top, knee, .25)) + " L" + pt(knee) + " L" + pt(mix(knee, ankle, .78)));
        l.cuff.setAttribute("d", limb(part(knee, ankle, .8, .96), [9.6, 9.4]));
        l.foot.setAttribute("transform", "translate(" + pt(ankle) + ") scale(" + sd + " 1)");
        l.bells.setAttribute("transform", "translate(" + pt(ankle) + ")");
      });
      body.setAttribute("transform", "translate(" + pt(hip) + ") rotate(" + q.lean.toFixed(2) + ")");
      var spread = Math.abs(knees[1][0] - knees[0][0]) / 2, fw = Math.max(18, spread * 0.75) + q.flare * 36;
      var by = Math.min(hipY + 58, GROUND - 8), fanTop = hipY - 6, i, pd = "";
      fan.setAttribute("d", "M" + pt([hip[0] - 9, fanTop]) + " L" + pt([hip[0] + 9, fanTop]) + " L" + pt([hip[0] + fw, by]) + " Q" + pt([hip[0], by + 9]) + " " + pt([hip[0] - fw, by]) + "Z");
      for (i = 0; i < 7; i++) { pd += "M" + pt([hip[0] + (i - 3) * 2.6, fanTop + 2]) + " L" + pt([hip[0] + (i - 3) * fw / 3.2, by + 2]) + " "; }
      pleats.setAttribute("d", pd);
      hem.setAttribute("d", "M" + pt([hip[0] - fw + 1.5, by - 1.4]) + " Q" + pt([hip[0], by + 7.4]) + " " + pt([hip[0] + fw - 1.5, by - 1.4]));
      // neck and head
      var N = R([0, -70]), hd = ln + rad(q.head) * 0.6, H = [N[0] + 27 * Math.sin(hd) + q.hs, N[1] - 27 * Math.cos(hd)];
      neck.setAttribute("d", "M" + pt(N) + " L" + pt(mix(N, H, .62)));
      head.setAttribute("transform", "translate(" + pt(H) + ") rotate(" + (q.head + q.lean * 0.5).toFixed(2) + ") scale(.92)");
      pot.setAttribute("opacity", q.pot.toFixed(2));
      face(q, blink);
      // arms and the hand shapes (mudras)
      var S = [R([-19, -65]), R([19, -65])], A = [q.al, q.ar], E = [q.el, q.er], Hs = [q.hl, q.hr];
      sides.forEach(function (sd, k) {
        var elbow = add2(S[k], V(sd, A[k], L.upper)), wrist = add2(elbow, V(sd, A[k] + E[k], L.fore)), a = arms[k];
        a.skin.setAttribute("d", limb([S[k], elbow, wrist], [8.4, 6.2, 4.6]));
        a.sleeve.setAttribute("d", limb(part(S[k], elbow, 0, .42), [11, 9.4]));
        a.edge.setAttribute("d", limb(part(S[k], elbow, .38, .46), [9.8, 9.5]));
        a.armlet.setAttribute("d", limb(part(S[k], elbow, .66, .74), [7.2, 7]));
        a.bangle.setAttribute("d", limb(part(elbow, wrist, .8, .9), [5.8, 5.6]));
        a.bangle2.setAttribute("d", limb(part(elbow, wrist, .9, .96), [5.4, 5.2]));
        var u = norm([wrist[0] - elbow[0], wrist[1] - elbow[1]]), v = sd < 0 ? [u[1], -u[0]] : [-u[1], u[0]];
        hands[k].root.setAttribute("transform", "matrix(" + [u[0], u[1], v[0], v[1], wrist[0] - u[0], wrist[1] - u[1]].map(function (x) { return x.toFixed(3); }).join(" ") + ")");
        var m = Math.round(Hs[k]);
        hands[k].shapes.forEach(function (s, n) { s.setAttribute("display", n === m ? "inline" : "none"); });
      });
      // the brass plate of the Tarangam
      plate.setAttribute("opacity", q.plate.toFixed(2));
      [plateOuter, plateInner].forEach(function (e, k) {
        e.setAttribute("cx", hip[0].toFixed(1)); e.setAttribute("cy", (GROUND + 2).toFixed(1));
        e.setAttribute("rx", k ? 38 : 46); e.setAttribute("ry", k ? 4.5 : 7);
      });
      // a turn: the figure narrows and flips as it spins about its own axis
      var sc = Math.cos(rad(q.spin));
      if (Math.abs(sc) < 0.38) { sc = sc < 0 ? -0.38 : 0.38; }   // seen side-on, a body still has depth
      g.setAttribute("transform", "translate(" + CX + " 0) scale(" + sc.toFixed(3) + " 1) translate(" + (-CX) + " 0)");
    }

    /* ---- the choreography: 60 seconds of moves and expressions ----
       Face: br brows up, bi inner brows up (sorrow), eo eyes open, sm smile,
       mo mouth open, gz/gy where the eyes look. */
    var D = { sx: 0, lean: 0, head: 0, hs: 0, gz: 0, gy: 0, br: 0, bi: 0, eo: 1, sm: .4, mo: 0,
              tl: 3, kl: 0, tr: 3, kr: 0, al: 12, el: 8, ar: 12, er: 8, hl: 1, hr: 1, spin: 0, plate: 0, pot: 0, flare: 0 };
    function M() {
      var r = {}, i, k;
      for (k in D) { r[k] = D[k]; }
      for (i = 0; i < arguments.length; i++) { for (k in arguments[i]) { r[k] = arguments[i][k]; } }
      return r;
    }
    var NAM = { al: 25, el: 216, ar: 25, er: 216, sm: .6, eo: .9 };     // hands joined at the chest, serene
    var MAN = { tl: 48, kl: 48, tr: 48, kr: 48 };                       // araimandi, the half-sit
    var HALF = { tl: 30, kl: 30, tr: 30, kr: 30 };
    var WIDE = { tl: 36, kl: 22, tr: 36, kr: 22 };
    var KATI = { al: 70, el: 230, ar: 70, er: 230, hl: 0, hr: 0 };       // fists at the waist
    var VEERA = { br: -.35, eo: 1.15, sm: .25 };
    var SRINGARA = { br: .25, eo: .72, sm: .8 };
    var HASYA = { sm: 1, mo: .45, eo: .95 };
    var TAR = { tl: 20, kl: 0, tr: 20, kr: 0, plate: 1, pot: 1, al: 138, el: 55, ar: 138, er: 55, eo: .62, gy: .9, sm: .45, br: .1 };
    var KF = [];
    function key(t, p, name, lin) { KF.push({ t: t, p: p, name: name || "", lin: !!lin }); }
    key(0, M(NAM), "Namaskaram");
    key(2, M(NAM, { head: 12, eo: .35, gy: .9 }));
    key(3.5, M(NAM));
    key(4.2, M(MAN, KATI, VEERA), "Araimandi");
    key(7.5, M(MAN, KATI, VEERA, { head: 6, gz: 1 }));
    var tri = { al: 95, el: 10, ar: 150, er: 40, hr: 2 }, tri2 = { al: 150, el: 40, ar: 95, er: 10, hl: 2 };
    key(8.5, M(HALF, tri, SRINGARA, { lean: -10, sx: -8, head: -14, hs: -4, gz: -1 }), "Tribhanga");
    key(10.5, M(HALF, tri2, SRINGARA, { lean: 10, sx: 8, head: 14, hs: 4, gz: 1 }));
    key(12.5, M(HALF, tri, SRINGARA, { lean: -10, sx: -8, head: -14, hs: -4, gz: -1 }));
    var b, odd, hs, joy = { sm: .9, mo: .18, eo: 1.05 };
    for (b = 0; b < 16; b++) {                                         // tattu adavu: stamps and lifts on the beat
      odd = b % 2; hs = odd ? 5 : -5;
      key(14 + b * 0.5, M(MAN, KATI, joy, { hs: hs, head: hs, gz: odd ? .8 : -.8 }), b ? "" : "Tattu adavu");
      key(14.25 + b * 0.5, M(MAN, KATI, joy, odd ? { tr: 8, kr: 105 } : { tl: 8, kl: 105 }, { hs: hs, head: hs, sx: odd ? 4 : -4, gz: odd ? .8 : -.8 }));
    }
    key(22.2, M(MAN, { al: 80, el: 200, ar: 80, er: 200, sm: .5 }), "Hasta mudras");
    key(24, M(MAN, { al: 110, el: 150, ar: 110, er: 150, hl: 2, hr: 2, head: 6, br: 1, bi: .3, eo: 1.3, mo: .55, sm: .1, gy: -.6 }), "Adbhuta: wonder");
    key(26, M(MAN, { al: 140, el: 90, ar: 140, er: 90, hl: 2, hr: 2, head: -6, br: .1, bi: 1, eo: .75, sm: -.5, gy: .6 }), "Karuna: compassion");
    key(28, M(MAN, { al: 60, el: -40, ar: 60, er: -40, hl: 0, hr: 0, br: -.6, eo: 1.2, sm: -.1 }), "Veera: courage");
    key(29.5, M(MAN, { al: 90, el: 0, ar: 90, er: 0 }));
    key(30.5, M(WIDE, HASYA, { al: 90, el: 0, ar: 90, er: 0 }), "Hasya: joy");
    key(32.5, M(WIDE, HASYA, { al: 160, el: 10, ar: 30, er: 0, hl: 2, lean: 8, sx: 6, head: 10, hs: 4, gz: 1 }));
    key(34.5, M(WIDE, HASYA, { al: 30, el: 0, ar: 160, er: 10, hr: 2, lean: -8, sx: -6, head: -10, hs: -4, gz: -1 }));
    var turn = { al: 95, el: 0, ar: 95, er: 0, hl: 2, hr: 2, sm: .8, eo: .95 };
    key(36, M(turn), "Bhramari, the spin");
    key(37, M(turn, { flare: 1 }));
    key(43, M(turn, { flare: 1, spin: 360 * 6 }), "", true);
    key(43.8, M(turn, { spin: 360 * 6 }));
    key(44.8, M(TAR), "Tarangam");
    for (b = 0; b < 11; b++) {                                         // rocking on the rim of the plate
      var sd = b % 2 ? -1 : 1;
      key(45.8 + b * 0.75, M(TAR, { sx: sd * 12, lean: sd * 7, head: sd * 10, hs: sd * 5 }, sd > 0 ? { tl: 20, kl: 80 } : { tr: 20, kr: 80 }));
    }
    key(54.4, M(TAR));
    key(55.8, M(NAM), "Pranamam");
    key(57.6, M(NAM, { head: 16, lean: 3, eo: .05 }));
    key(59, M(NAM));
    key(60, M(NAM));

    function pose(T) {
      var i = 0, a, b2, u, q = {}, k;
      while (i < KF.length - 2 && KF[i + 1].t <= T) { i++; }
      a = KF[i]; b2 = KF[i + 1];
      u = Math.min(1, Math.max(0, (T - a.t) / (b2.t - a.t)));
      if (!b2.lin) { u = u * u * (3 - 2 * u); }
      for (k in D) { q[k] = lerp(a.p[k], b2.p[k], u); }
      for (var j = 0; j <= i + 1; j++) { if (KF[j].name && KF[j].t <= T) { q.name = KF[j].name; } }
      return q;
    }

    /* ---- playback: runs only while it is on screen and the viewer has not paused it ---- */
    var T = 0, last = 0, raf = 0, onScreen = true, paused = calm, shown = "";
    function frame(now) {
      var dt = Math.min(0.1, (now - last) / 1000);
      last = now; T = (T + dt) % LOOP;
      show(); raf = requestAnimationFrame(frame);
    }
    function show() {
      var ph = T % 3.9, blink = ph < .16 ? Math.abs(ph - .08) / .08 : 1;
      var q = pose(T); draw(q, blink);
      if (q.name !== shown) { shown = q.name; cap.textContent = shown; }
    }
    function sync() {
      var run = !paused && onScreen && !doc.hidden;
      if (run && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
      btn.textContent = paused ? "▶" : "❚❚";
      btn.setAttribute("aria-label", paused ? "Play the dance" : "Pause the dance");
    }
    btn.addEventListener("click", function () { paused = !paused; sync(); });
    doc.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in win) {
      new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(arch);
    }
    show(); sync();
  }
})();
