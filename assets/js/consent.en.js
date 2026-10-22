





























(function () {
  "use strict";

  const CONSENT_ENABLED = true;           
  const CONSENT_POLICY  = "0-zastepcza";  
  const CONSENT_KEY     = "tnm_consent_v1";
  const PIXEL_LIVE      = false;          
  const ANALYTICS_CATEGORY = true;        
  const BANNER_PHOTO    = "../assets/img/figma/tnm-members.webp";    
  const BANNER_LOGO     = "../assets/img/logo/sygnet-red-square-white.png";

   
  const T_TITLE      = "Before you settle in";
  const T_LEAD       = "Hi, this is The Noise Makers.";
  

  const T_BODY_3     = 'We turn on analytics and marketing only when you agree to them. The booking calendar, our video recordings and the map are also waiting for your “yes”.';
  const T_BODY_2     = 'We turn on marketing tools only when you agree to them. The booking calendar, our video recordings and the map are also waiting for your “yes”.';
  const T_BODY_NOPX  = 'The booking calendar, our video recordings and the map turn on only after your “yes”.';
  const T_LINK_COOK  = "Cookies";
  const T_LINK_PRIV  = "Privacy Policy";
   
  const detailsWide   = (cook, priv) => `Details in ${cook} and ${priv}.`;
  const T_ACCEPT     = "I agree to cookies";
  const T_REJECT     = "Only essential";
  const T_SETTINGS   = "Choose my settings";
  const T_CLOSE_ARIA = "Close without deciding";
  const T_LOGO_ALT   = "The Noise Makers";
   
  const T_P_TITLE    = "Cookie settings";
  const T_P_INTRO    = "You turn on only what you want. We save your choice in this browser.";
  const T_P_NEC      = "Essential";
  const T_P_NEC_ST   = "always on";    
  const T_P_NEC_D    = "They remember your choice in this window and let you send a form. Without them the site does not work.";
  const T_P_FUN      = "Functional: booking calendar, video and map";
  const T_P_FUN_D    = "The ZenCal calendar, where you pick a date, the Wistia player, where you watch our recordings, and the Google map with our locations. Each of them saves its own data in your browser.";
  const T_P_ANA      = "Analytics";
  const T_P_ANA_D    = "Visit statistics (Google Analytics through Google Tag Manager). They help us understand which pages you read and where you pause.";
  const T_P_MKT      = "Marketing";
  const T_P_MKT_D    = "The Meta pixel. It lets us know whether our ads reach people who are looking for classes like ours.";
  const T_ON         = "on";
  const T_OFF        = "off";
  const T_SAVE       = "Save";
  const T_BACK       = "Back";
   
  const T_VIDEO_ARIA = "Turn on video";

  const CATS = ANALYTICS_CATEGORY ? ["functional", "analytics", "marketing"] : ["functional", "marketing"];

  

  const CSS_VERSION = "20260911";
  (function linkCss() {
    try {
      if (document.querySelector('link[data-consent-css]')) return;
      const me = document.currentScript && document.currentScript.src;
      const href = me ? me.replace(/\/js\/consent(\.en)?\.js(\?.*)?$/, "/css/consent.css?v=" + CSS_VERSION) : "../assets/css/consent.css?v=" + CSS_VERSION;
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; l.setAttribute("data-consent-css", "1");
      (document.head || document.documentElement).appendChild(l);
    } catch (e) {   }
  })();

   
  let memory = null;
  function readRaw() {
    for (const st of [tryStore("localStorage"), tryStore("sessionStorage")]) {
      if (!st) continue;
      try { const v = st.getItem(CONSENT_KEY); if (v) return v; } catch (e) {   }
    }
    return memory;
  }
  function writeRaw(v) {
    memory = v;
    for (const st of [tryStore("localStorage"), tryStore("sessionStorage")]) {
      if (!st) continue;
      try { st.setItem(CONSENT_KEY, v); return; } catch (e) {   }
    }
  }
  function tryStore(name) { try { return window[name]; } catch (e) { return null; } }

  function readState() {
    const raw = readRaw();
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      if (!s || s.v !== 1 || s.policy !== CONSENT_POLICY) return null;    
      const out = {};
      CATS.forEach(c => { out[c] = !!s[c]; });
      return out;
    } catch (e) { return null; }
  }

  let listeners = [];
  function emit(state) { listeners.forEach(fn => { try { fn(state); } catch (e) { console.error("TNMConsent onChange:", e); } }); }

   
  function get() {
    if (!CONSENT_ENABLED) {
      const off = { functional: true, decided: true, enabled: false };
      CATS.forEach(c => { if (c !== "functional") off[c] = false; });
      return off;
    }
    const s = readState();
    const out = { decided: !!s, enabled: true };
    CATS.forEach(c => { out[c] = s ? !!s[c] : false; });
    return out;
  }
  


  function set(opts) {
    const cur = readState() || {};
    const s = { v: 1, policy: CONSENT_POLICY, ts: new Date().toISOString() };
    CATS.forEach(c => { s[c] = (opts && Object.prototype.hasOwnProperty.call(opts, c)) ? !!opts[c] : !!cur[c]; });
    writeRaw(JSON.stringify(s));
    closeBanner();
    emit(get());
    return get();
  }
  function all(v) { const o = {}; CATS.forEach(c => { o[c] = v; }); return o; }
  function open() {
    

    if (!CONSENT_ENABLED) { console.info("TNMConsent.open(): CONSENT_ENABLED=false"); return; }
    openBanner("settings");
  }
  function onChange(fn) { if (typeof fn === "function") listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn); }; }

  window.TNMConsent = { get, set, open, onChange, enabled: CONSENT_ENABLED, policy: CONSENT_POLICY, categories: CATS.slice() };

   
  let lastFocus = null;
  function legalHref(key, fallback) {
    const L = window.TNMLegal && window.TNMLegal.urls;
    return (L && L[key]) || fallback;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function bodyText() {
    if (!PIXEL_LIVE && !ANALYTICS_CATEGORY) return T_BODY_NOPX;
    return ANALYTICS_CATEGORY ? T_BODY_3 : T_BODY_2;
  }
  function mediaHTML() {
    return '<div class="thxcard__media cbanner__media">' +
      '<span class="thxcard__media-bg bw" role="img" aria-label="' + T_LOGO_ALT + '" style="background-image:url(\'' + BANNER_PHOTO + '\')"></span>' +
      '<span class="thxcard__logo"><img src="' + BANNER_LOGO + '" alt="' + T_LOGO_ALT + '" width="64" height="64"></span>' +
      '</div>';
  }
  function mainViewHTML() {
    const cook = '<a href="' + esc(legalHref("cookies", "../cookies.html")) + '" target="_blank" rel="noopener">' + T_LINK_COOK + '</a>';
    const priv = '<a href="' + esc(legalHref("prywatnosc", "../polityka-prywatnosci.html")) + '" target="_blank" rel="noopener">' + T_LINK_PRIV + '</a>';
    return '<div class="thxcard__body cbanner__body">' +
        '<h2 class="thxcard__title cbanner__title" id="consent-title" tabindex="-1">' + T_TITLE + '</h2>' +
        '<div class="thxcard__text cbanner__text" id="consent-desc"><p>' + T_LEAD + ' ' + bodyText() + '</p><p>' + detailsWide(cook, priv) + '</p></div>' +
      '</div>' +
      '<div class="cbanner__actions">' +
        '<button class="btn cbanner__btn" type="button" data-consent="accept">' + T_ACCEPT + '</button>' +
        '<button class="btn cbanner__btn" type="button" data-consent="reject">' + T_REJECT + '</button>' +
        '<button class="btn cbanner__btn" type="button" data-consent="settings">' + T_SETTINGS + '</button>' +
      '</div>';
  }
  function rowHTML(cat, name, desc, on) {
    return '<div class="cbanner__row">' +
      '<div class="cbanner__rowhead">' +
        '<span class="cbanner__rowname" id="consent-row-' + cat + '">' + name + '</span>' +
        '<button class="cbanner__switch" type="button" role="switch" aria-checked="' + (on ? "true" : "false") + '" aria-labelledby="consent-row-' + cat + '" data-consent-cat="' + cat + '">' +
          '<span class="cbanner__knob" aria-hidden="true"></span><span class="cbanner__state">' + (on ? T_ON : T_OFF) + '</span>' +
        '</button>' +
      '</div>' +
      '<p class="cbanner__rowdesc">' + desc + '</p>' +
    '</div>';
  }
  function settingsViewHTML() {
    const cur = get();
    let rows = '<div class="cbanner__row cbanner__row--fixed">' +
        '<div class="cbanner__rowhead"><span class="cbanner__rowname">' + T_P_NEC + '</span><span class="cbanner__state cbanner__state--fixed">' + T_P_NEC_ST + '</span></div>' +
        '<p class="cbanner__rowdesc">' + T_P_NEC_D + '</p></div>';
    rows += rowHTML("functional", T_P_FUN, T_P_FUN_D, cur.functional);
    if (ANALYTICS_CATEGORY) rows += rowHTML("analytics", T_P_ANA, T_P_ANA_D, cur.analytics);
    rows += rowHTML("marketing", T_P_MKT, T_P_MKT_D, cur.marketing);
    return '<div class="thxcard__body cbanner__body cbanner__body--settings">' +
        '<h2 class="thxcard__title cbanner__title" id="consent-title" tabindex="-1">' + T_P_TITLE + '</h2>' +
        '<div class="thxcard__text cbanner__text" id="consent-desc"><p>' + T_P_INTRO + '</p></div>' +
        '<div class="cbanner__rows">' + rows + '</div>' +
      '</div>' +
      '<div class="cbanner__actions cbanner__actions--settings">' +
        '<button class="btn cbanner__btn" type="button" data-consent="save">' + T_SAVE + '</button>' +
        '<button class="cbanner__back" type="button" data-consent="back">' + T_BACK + '</button>' +
      '</div>';
  }
  function bannerHTML(view) {
    return '<div class="consent cbanner" id="consent" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-desc" data-view="' + view + '">' +
      '<button class="cbanner__close" type="button" data-consent="close" aria-label="' + T_CLOSE_ARIA + '"><span aria-hidden="true">&#10005;</span></button>' +
      '<div class="cbanner__card" role="document">' +
        mediaHTML() +
        (view === "settings" ? settingsViewHTML() : mainViewHTML()) +
      '</div></div>';
  }
  function focusables(root) {
    return [...root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  }
  function onKeydown(e) {
    const m = document.getElementById("consent"); if (!m) return;
    if (e.key === "Escape") { closeBanner(); return; }        
    if (e.key !== "Tab") return;
    const f = focusables(m); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function renderView(view) {
    const m = document.getElementById("consent"); if (!m) return;
    const card = m.querySelector(".cbanner__card");
    card.innerHTML = mediaHTML() + (view === "settings" ? settingsViewHTML() : mainViewHTML());
    m.setAttribute("data-view", view);
    wire(m);
    const first = m.querySelector(view === "settings" ? "#consent-title" : '[data-consent="accept"]');
    if (first) first.focus({ preventScroll: true });
  }
  function wire(m) {
    const q = sel => m.querySelector(sel);
    const on = (sel, fn) => { const el = q(sel); if (el) el.addEventListener("click", fn); };
    on('[data-consent="accept"]',   () => set(all(true)));
    on('[data-consent="reject"]',   () => set(all(false)));
    on('[data-consent="settings"]', () => renderView("settings"));
    on('[data-consent="back"]',     () => renderView("main"));
    on('[data-consent="close"]',    () => closeBanner());           
    on('[data-consent="save"]', () => {
      const o = {};
      m.querySelectorAll("[data-consent-cat]").forEach(sw => { o[sw.getAttribute("data-consent-cat")] = sw.getAttribute("aria-checked") === "true"; });
      set(o);
    });
    m.querySelectorAll("[data-consent-cat]").forEach(sw => {
      sw.addEventListener("click", () => {
        const next = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", next ? "true" : "false");
        const st = sw.querySelector(".cbanner__state"); if (st) st.textContent = next ? T_ON : T_OFF;
      });
    });
  }
  function openBanner(view) {
    view = view || "main";
    const existing = document.getElementById("consent");
    if (existing) { renderView(view); return; }
    lastFocus = document.activeElement;
    document.body.insertAdjacentHTML("beforeend", bannerHTML(view));
    const m = document.getElementById("consent");
    wire(m);
    document.body.classList.add("consent-lock");
    document.addEventListener("keydown", onKeydown);
    requestAnimationFrame(() => {
      m.classList.add("is-open");
      const first = m.querySelector(view === "settings" ? "#consent-title" : '[data-consent="accept"]');
      if (first) first.focus({ preventScroll: true });
    });
  }
  function closeBanner() {
    const m = document.getElementById("consent"); if (!m) return;
    document.removeEventListener("keydown", onKeydown);
    document.body.classList.remove("consent-lock");
    m.remove();
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {   } }
  }
  

  document.addEventListener("click", function (e) {
    const t = e.target && e.target.closest && e.target.closest("[data-consent-open]");
    if (!t) return;
    e.preventDefault();
    open();
  });

  




  const WISTIA_PLAYER = "https://fast.wistia.com/player.js";
  const WISTIA_EMBED  = "https://fast.wistia.com/embed/";
  let wistiaPlayerAppended = false;
  const wistiaEmbedAppended = {};
  function appendScript(src, type) {
    const s = document.createElement("script");
    s.src = src; s.async = true; if (type) s.type = type;
    document.head.appendChild(s);
  }
  function mountWistia(facade, autoplay) {
    const id = facade.getAttribute("media-id"); if (!id) return;
    if (!wistiaPlayerAppended) { wistiaPlayerAppended = true; appendScript(WISTIA_PLAYER); }
    if (!wistiaEmbedAppended[id]) { wistiaEmbedAppended[id] = true; appendScript(WISTIA_EMBED + id + ".js", "module"); }
    const player = document.createElement("wistia-player");
    player.setAttribute("media-id", id);
    player.setAttribute("aspect", facade.getAttribute("data-aspect") || "0.5625");
    player.setAttribute("rounded-player", "0");
    player.setAttribute("do-not-track", "");
    if (autoplay) player.setAttribute("autoplay", "");
    facade.replaceWith(player);
     
    if (window.TNMTrack) { try { window.TNMTrack("video_start", { media_id: id, autoplay: !!autoplay }); } catch (e) {} }
  }
  function mountAllWistia(autoplayFacade) {
    document.querySelectorAll("[data-wistia-facade]").forEach(f => mountWistia(f, f === autoplayFacade));
  }
  function initWistia() {
    const facades = document.querySelectorAll("[data-wistia-facade]");
    if (!facades.length) return;
    


    if (CONSENT_ENABLED && get().functional) { mountAllWistia(null); return; }
    facades.forEach(f => {
      const btn = f.querySelector("[data-wistia-play]");
      if (btn && !btn.getAttribute("aria-label")) btn.setAttribute("aria-label", T_VIDEO_ARIA);
      (btn || f).addEventListener("click", () => {
        if (CONSENT_ENABLED) set({ functional: true });    
        mountAllWistia(f);
      }, { once: true });
    });
    onChange(s => { if (s.functional && document.querySelector("[data-wistia-facade]")) mountAllWistia(null); });
  }

   
  document.addEventListener("DOMContentLoaded", function () {
    if (CONSENT_ENABLED && !get().decided) openBanner("main");
    initWistia();
  });
})();
