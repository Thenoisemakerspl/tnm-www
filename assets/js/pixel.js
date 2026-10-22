


























(function () {
  "use strict";

  var VIEWCONTENT_PAGES = false;    
  var PIXEL_ID = "877324031431860";    
  if (!PIXEL_ID) return;

  function loadBase() {
    if (window.fbq) return;
     
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  }

  function clean(o) { Object.keys(o).forEach(function (k) { if (o[k] == null) delete o[k]; }); return o; }

   
  var MAP = {
    page_view: null,    
    content_view: function (p) {
      

      if (p.content_category === "strona" && !VIEWCONTENT_PAGES) return null;
      return { event: "ViewContent", params: clean({
        content_name: p.content_name, content_category: p.content_category,
        content_ids: p.content_ids, content_type: p.content_ids ? "product" : null
      }) };
    },
    lead_submit: function (p) {
      return { event: "Lead", params: clean({ content_name: p.form, content_category: "form" }), eventId: p.submission_id };
    },
    schedule: function (p) {
      return { event: "Schedule", params: clean({ content_name: p.content_name || "konsultacja" }) };
    },
    checkout_start: function (p) {
      return { event: "InitiateCheckout", params: clean({
        value: p.value, currency: p.currency || "PLN", num_items: p.num_items, contents: p.contents
      }), eventId: p.submission_id };
    }
  };

  var adapter = {
    id: "meta",
    consent: "marketing",
    init: function () {
      loadBase();
      






      window.fbq("init", PIXEL_ID);
      window.fbq("consent", "grant");
      window.fbq("track", "PageView");
    },
    pause:  function () { if (window.fbq) window.fbq("consent", "revoke"); },
    resume: function () { if (window.fbq) window.fbq("consent", "grant"); },
    track: function (name, p) {
      var m = MAP[name]; if (!m) return;
      var r = m(p || {}); if (!r) return;
      if (r.eventId) window.fbq("track", r.event, r.params, { eventID: String(r.eventId) });
      else window.fbq("track", r.event, r.params);
    }
  };

  if (window.TNMTrack) window.TNMTrack.use(adapter);
})();
