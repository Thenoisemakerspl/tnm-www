

























(function () {
  "use strict";

  var EVENTS = ["page_view", "content_view", "lead_submit", "lead_form_start", "schedule", "checkout_start",
                "checkout_return", "purchase", "scroll", "contact_click", "video_start"];
  var adapters = [];
  var started = {};    
  var paused  = {};    

   
  var page = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
  var lang = /^\/en\//.test(location.pathname) ? "en" : "pl";
  var PAGE = {
    page: page,
    locale: lang,
    page_path: location.pathname,
    page_url: location.href.split("#")[0],
    page_title: document.title || ""
  };

  function consent() {
    try { return (window.TNMConsent && window.TNMConsent.get()) || {}; } catch (e) { return {}; }
  }
  function allowed(a) { return consent()[a.consent] === true; }

  function sync(a) {
    var ok = allowed(a);
    if (ok && !started[a.id]) {
      started[a.id] = true;
      try { a.init(); } catch (e) { console.error("[TNMTrack] init " + a.id, e); }
      return;
    }
    if (started[a.id] && !ok && !paused[a.id]) {
      paused[a.id] = true;
      if (typeof a.pause === "function") { try { a.pause(); } catch (e) {} }
      return;
    }
    if (started[a.id] && ok && paused[a.id]) {
      paused[a.id] = false;
      if (typeof a.resume === "function") { try { a.resume(); } catch (e) {} }
    }
  }

  function TNMTrack(name, params) {
    params = params || {};
    var row = Object.assign({ event: name }, PAGE, params);
    if (row.form && !row.form_name) row.form_name = row.form;    
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(row);
    } catch (e) {}
    adapters.forEach(function (a) {
      if (!started[a.id] || paused[a.id] || !allowed(a)) return;
      try { a.track(name, row); } catch (e) { console.error("[TNMTrack] " + a.id, e); }
    });
  }

  TNMTrack.use = function (a) {
    if (!a || !a.id || typeof a.init !== "function" || typeof a.track !== "function") return;
    adapters.push(a);
    sync(a);
  };
  TNMTrack.active = function () {
    return adapters.filter(function (a) { return started[a.id] && !paused[a.id] && allowed(a); })
                   .map(function (a) { return a.id; });
  };
  TNMTrack.events = EVENTS.slice();
  TNMTrack.page = PAGE;

  

  function cookie(n) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  TNMTrack.mkt = function () {
    var c = consent();
    var fbc = cookie("_fbc");
    if (!fbc) {
      try {
        var id = new URLSearchParams(location.search).get("fbclid");
        if (id) fbc = "fb.1." + Date.now() + "." + id;    
      } catch (e) {}
    }
    var ua = navigator.userAgent || "";
    return {
      consent: c.marketing === true,
      fbp: cookie("_fbp"),
      fbc: fbc,
      ua: ua.length > 500 ? ua.slice(0, 500) : ua    
    };
  };

  

  TNMTrack.go = function (url) {
    if (TNMTrack.active().length) setTimeout(function () { location.href = url; }, 150);
    else location.href = url;
  };

  if (window.TNMConsent && typeof window.TNMConsent.onChange === "function") {
    window.TNMConsent.onChange(function () { adapters.forEach(sync); });
  }
  window.TNMTrack = TNMTrack;

   
  TNMTrack("page_view", {});

  

  var PAGES_VIEW = { "zajecia-indywidualne-dzieci": 1, "zajecia-indywidualne-dorosli": 1, "zajecia-zespolowe-dzieci": 1, "zajecia-zespolowe-dorosli": 1,
                     "konsultacje-dzieci": 1, "konsultacje-dorosli": 1, "dni-probne": 1, "wydarzenia": 1, "wracam": 1, "partnerzy": 1 };
  if (PAGES_VIEW[page]) TNMTrack("content_view", { content_name: page, content_category: "strona" });

  


  document.addEventListener("input", function (e) {
    try {
      var el = e.target; if (!el || !el.closest) return;
      var root = el.closest("[data-form-name]"); if (!root || root.getAttribute("data-lead-started")) return;
      root.setAttribute("data-lead-started", "1");
      TNMTrack("lead_form_start", { form: root.getAttribute("data-form-name"), content_name: root.getAttribute("data-content-name") || null });
    } catch (err) {}
  }, true);

  

  (function () {
    var fired = {};
    var THRESH = [25, 50, 75];
    var ticking = false;
    function measure() {
      ticking = false;
      var doc = document.documentElement;
      var max = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0) - window.innerHeight;
      if (max <= 0) return;
      var pct = (window.pageYOffset || doc.scrollTop || 0) / max * 100;
      THRESH.forEach(function (t) {
        if (pct >= t && !fired[t]) { fired[t] = true; TNMTrack("scroll", { scroll_depth: t }); }
      });
    }
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      (window.requestAnimationFrame || setTimeout)(measure);
    }, { passive: true });
  })();

  


  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = String(a.getAttribute("href") || "");
    var kind = /^tel:/i.test(href) ? "phone" : (/^mailto:/i.test(href) ? "email" : null);
    if (!kind) return;
    TNMTrack("contact_click", { contact_type: kind, target: href.replace(/^(tel|mailto):/i, "").split("?")[0] });
  }, true);
})();
