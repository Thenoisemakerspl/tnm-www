























(function () {
  "use strict";

  var GTM_ID = "";    
  if (!GTM_ID) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

   
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function consentNow() {
    try { return (window.TNMConsent && window.TNMConsent.get()) || {}; } catch (e) { return {}; }
  }
  function pushUpdate() {
    var c = consentNow();
    var ads = c.marketing === true ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: c.analytics === true ? "granted" : "denied",
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads
    });
  }

  var loaded = false;
  function loadContainer() {
    if (loaded) return; loaded = true;
    

    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== "dataLayer" ? "&l=" + l : "";
      j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", GTM_ID);
  }

  var adapter = {
    id: "gtm",
    consent: "analytics",
    init: function () { pushUpdate(); loadContainer(); },
    pause:  function () { pushUpdate(); },    
    resume: function () { pushUpdate(); },
    track:  function () {   }
  };

   
  if (window.TNMConsent && typeof window.TNMConsent.onChange === "function") {
    window.TNMConsent.onChange(function () { if (loaded) pushUpdate(); });
  }

  if (window.TNMTrack) window.TNMTrack.use(adapter);
})();
