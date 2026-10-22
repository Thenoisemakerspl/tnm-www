 
const FORM_URL = "#formularz";  
const EASYCART_URL = "#easycart";  
const MAKE_WEBHOOK_PARTNERZY = "https://hook.eu1.make.com/hxyyjjaj56w5tmbfqywc674br2f3ec1p";  
const MAKE_WEBHOOK_WAITLIST = "https://hook.eu1.make.com/aak7q5vvpmz0q956smj6lh38psq6bxyv";  




function tnmSubmissionId(){
  try{ if(window.crypto&&crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
  return "sid-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10);
}
 
function tnmUTMFromSearch(){
  try{ const p=new URLSearchParams(location.search), keys=["source","medium","campaign","term","content"], o={}; let any=false;
    keys.forEach(k=>{ const v=p.get("utm_"+k); o[k]=v||null; if(v) any=true; });
    return any?o:null;
  }catch(e){ return null; }
}






const TNM_UTM_KEY="tnm_utm_v1";
function tnmAttribution(){
  try{
    const u=tnmUTMFromSearch();
    if(u){ const rec={utm:u, landing_url:location.href, referrer:document.referrer||null, at:new Date().toISOString()};
      sessionStorage.setItem(TNM_UTM_KEY, JSON.stringify(rec)); return rec; }
    const s=sessionStorage.getItem(TNM_UTM_KEY); return s?JSON.parse(s):null;
  }catch(e){ return tnmUTMFromSearch()?{utm:tnmUTMFromSearch(), landing_url:location.href, referrer:document.referrer||null}:null; }
}
function tnmUTM(){ const a=tnmAttribution(); return (a&&a.utm)||null; }
function tnmLanding(){ const a=tnmAttribution(); return (a&&a.landing_url)||null; }
 
function tnmDropParams(keys){
  try{ const p=new URLSearchParams(location.search); keys.forEach(k=>p.delete(k));
    const qs=p.toString(); history.replaceState(null,"",location.pathname+(qs?"?"+qs:"")+location.hash); }catch(e){}
}
 
function tnmSlug(s){ return deburr(s).replace(/ /g,"-"); }
tnmAttribution();    
function tnmMeta(formId){
  return { form:formId, form_version:"1.1", branch:null, submission_id:tnmSubmissionId(),
    submitted_at:new Date().toISOString(), source_url:location.href,
    page:(location.pathname.split("/").pop()||"index").replace(/\.html$/,"")||"index", locale:"en",
    referrer:document.referrer||null, utm:tnmUTM(), landing_url:tnmLanding() };    
}








const TNMGuards = (function(){
  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
  const CC_OPTIONS = [
    {v:"+48",label:"+48 (PL)"},{v:"+44",label:"+44 (UK)"},{v:"+49",label:"+49 (DE)"},
    {v:"+380",label:"+380 (UA)"},{v:"+1",label:"+1 (US/CA)"},{v:"+33",label:"+33 (FR)"},
    {v:"+39",label:"+39 (IT)"},{v:"+34",label:"+34 (ES)"},{v:"+31",label:"+31 (NL)"},
    {v:"+353",label:"+353 (IE)"},{v:"+420",label:"+420 (CZ)"},{v:"+421",label:"+421 (SK)"},
    {v:"+41",label:"+41 (CH)"},{v:"+43",label:"+43 (AT)"},{v:"+46",label:"+46 (SE)"},{v:"+47",label:"+47 (NO)"}
  ];
   
  const MAXLEN = { name:80, firstname:40, email:254, short:120, long:600, other:60, postal:6, addrnr:10 };
  const HP_NAME = "tnm_z1";  





  const MIN_MS  = 800;        

  function digits(s){ return String(s==null?"":s).replace(/\D/g,""); }

  










  const PHONE_INTL_MIN = 6, PHONE_INTL_MAX = 14;
  function phoneLen(cc){ return (cc||"+48") === "+48" ? 9 : PHONE_INTL_MAX; }
   
  function phoneStrip(raw, cc){
    cc = cc || "+48";
    let d = digits(raw);
    const ccd = cc.replace(/\D/g,"");
    if (d.indexOf("00"+ccd) === 0) d = d.slice(2+ccd.length);
    if (cc === "+48"){
      if (d.length === 11 && d.indexOf("48") === 0) d = d.slice(2);
      if (d.length === 10 && d.indexOf("0") === 0) d = d.slice(1);
      return d;
    }
    if (d.length > ccd.length+6 && d.indexOf(ccd) === 0) d = d.slice(ccd.length);
    return d;
  }
   
  function phoneDigits(raw, cc){ return phoneStrip(raw, cc).slice(0, phoneLen(cc)); }
   
  function phoneFormat(raw, cc){ return phoneDigits(raw, cc).replace(/(\d{3})(?=\d)/g, "$1 "); }
   
  function phoneMsg(cc, d){
    d = digits(d);
    if ((cc||"+48") === "+48"){
      return d.length ? ("Number incomplete - enter 9 digits (entered  "+d.length+").")
                      : "Enter a phone number - 9 digits.";
    }
    return "Enter a valid phone number ("+PHONE_INTL_MIN+"-"+PHONE_INTL_MAX+" digits).";
  }
   
  function normalizePhone(raw, cc){
    cc = cc || "+48";
    const d = phoneStrip(raw, cc);
    if (cc === "+48") return { digits:d, e164: d ? cc+d : "", ok: d.length === 9 };
    return { digits:d, e164: d ? cc+d : "", ok: d.length >= PHONE_INTL_MIN && d.length <= PHONE_INTL_MAX };
  }
  function isEmail(s){ return RE_EMAIL.test(String(s==null?"":s).trim()); }
  function normEmail(s){ return String(s==null?"":s).trim().toLowerCase(); }
   
  function age(v){ const n = parseInt(String(v==null?"":v).trim(),10); return (Number.isInteger(n) && n>=1 && n<=120) ? n : null; }
   
   
  function nameOk(s){ const t=String(s==null?"":s).trim(); if(t.length<2) return false; if(/https?:\/\/|www\./i.test(t)) return false; if((t.match(/\d/g)||[]).length>3) return false; return true; }

  




  function stripDigits(s){ return String(s==null?"":s).replace(/[0-9]/g,""); }
  function hasDigit(s){ return /[0-9]/.test(String(s==null?"":s)); }
   
  function personNameOk(s){ return nameOk(s) && !hasDigit(s); }
  



  function isPersonNameField(el){
    if (!el || el.tagName !== "INPUT") return false;
    const t = (el.getAttribute("type") || "text").toLowerCase();
    if (t !== "text" && t !== "search") return false;
    if (el.hasAttribute("data-allow-digits")) return false;
    if (el.hasAttribute("data-person-name")) return true;
    const ac = (el.getAttribute("autocomplete")||"").toLowerCase();
    if (ac === "given-name" || ac === "family-name" || ac === "name") return true;
    const raw = [el.getAttribute("name"), el.getAttribute("id"),
                 el.getAttribute("data-name"), el.getAttribute("data-cf")].join(" ").toLowerCase();
    return /(^|[^a-z])(imie|imiona|nazwisko)([^a-z]|$)/.test(raw);
  }
   
  function hpHTML(){ return '<div class="tnm-hp" aria-hidden="true"><label>Do not fill in this field<input type="text" name="'+HP_NAME+'" data-hp tabindex="-1" autocomplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"></label></div>'; }
  function hpFilled(scope){ const el=(scope||document).querySelector('[name="'+HP_NAME+'"]'); const t = !!(el && el.value && el.value.trim());   if (t) { try { console.warn('[TNM] honeypot tripped - submit zablokowany', { pole: HP_NAME, dlugosc: el.value.length }); } catch(e){} } return t; }
  function ccSelectHTML(cls, current){
    const cur = current || "+48";
    return '<select class="'+(cls||"")+'" aria-label="Prefiks kraju">'+
      CC_OPTIONS.map(o=>'<option value="'+o.v+'"'+(o.v===cur?' selected':'')+'>'+o.label+'</option>').join('')+'</select>';
  }
  return { RE_EMAIL, CC_OPTIONS, MAXLEN, HP_NAME, MIN_MS, digits, normalizePhone, isEmail, normEmail, age, nameOk, hpHTML, hpFilled, ccSelectHTML,
    PHONE_INTL_MIN, PHONE_INTL_MAX, phoneLen, phoneDigits, phoneFormat, phoneMsg,
    stripDigits, hasDigit, personNameOk, isPersonNameField };
})();
window.TNMGuards = TNMGuards;














(function initPhoneFields(){
  const G = TNMGuards, SEL = 'input[type="tel"]';
  const WRAP = ".pf-phone,.intake-phone,.reg-phone,[data-pf-tel]";

  function wrapOf(input){ return input.closest(WRAP) || input.parentElement || input; }
  function ccSelOf(input){ const w = wrapOf(input); return w ? w.querySelector("select") : null; }
  function ccOf(input){ const s = ccSelOf(input); return (s && s.value) || "+48"; }
  function isRequired(input){ return input.required || input.getAttribute("aria-required") === "true"; }

  function errOf(input, make){
    const w = wrapOf(input);
    let el = w.parentElement ? w.parentElement.querySelector(".tnm-phone-err") : null;
    if (!el && make){
      el = document.createElement("p");
      el.className = "tnm-phone-err";
      el.setAttribute("role","alert");
      w.insertAdjacentElement("afterend", el);
    }
    return el;
  }
  function showErr(input, text){
    const el = errOf(input, true); if (el) el.textContent = text;
    input.classList.add("is-invalid"); input.setAttribute("aria-invalid","true");
  }
  function clearErr(input){
    const el = errOf(input, false); if (el) el.textContent = "";
    input.classList.remove("is-invalid"); input.removeAttribute("aria-invalid");
  }

   
  function reformat(input){
    const cc = ccOf(input), before = input.value, out = G.phoneFormat(before, cc);
    if (out === before) return;
    let caretDigits = null;
    try { if (typeof input.selectionStart === "number") caretDigits = G.digits(before.slice(0, input.selectionStart)).length; }
    catch(e){   }
    input.value = out;
    if (caretDigits != null){
      let seen = 0, pos = out.length;
      if (caretDigits === 0) pos = 0;
      else for (let i=0;i<out.length;i++){
        const ch = out.charCodeAt(i);
        if (ch>=48 && ch<=57){ seen++; if (seen === caretDigits){ pos = i+1; break; } }
      }
      try { input.setSelectionRange(pos,pos); } catch(e){   }
    }
  }
   
  function syncMax(input){
    const n = G.phoneLen(ccOf(input));
    input.setAttribute("maxlength", String(n + Math.floor((n-1)/3)));
  }

  

  function check(input, quiet){
    const cc = ccOf(input), d = G.phoneDigits(input.value, cc);
    if (!d.length){
      if (isRequired(input)){ if(!quiet) showErr(input, G.phoneMsg(cc,"")); return false; }
      clearErr(input); return true;
    }
    if (!G.normalizePhone(input.value, cc).ok){ if(!quiet) showErr(input, G.phoneMsg(cc,d)); return false; }
    clearErr(input); return true;
  }

  function attach(input){
    if (input.dataset.tnmPhone) return;       
    input.dataset.tnmPhone = "1";
    input.setAttribute("inputmode","numeric");
    if (!input.getAttribute("autocomplete")) input.setAttribute("autocomplete","tel-national");

    



    const w = wrapOf(input);
    if (w && w !== input && !w.querySelector("select")){
      const cls = w.classList.contains("intake-phone") ? "intake-phone__cc"
                : w.classList.contains("reg-phone")    ? "reg-cc"
                : w.classList.contains("pf-phone")     ? "pf-cc" : "tnm-cc";
      w.insertAdjacentHTML("afterbegin", G.ccSelectHTML(cls,"+48"));
    }
    syncMax(input);

    


    input.addEventListener("beforeinput", function(e){
      if (!e.inputType || e.inputType.indexOf("delete") === 0) return;
      const ins = e.data == null ? "" : String(e.data);
      if (e.inputType === "insertText" && ins && /\D/.test(ins)){ e.preventDefault(); return; }
      if (ins && G.digits(this.value).length >= G.phoneLen(ccOf(this)) &&
          this.selectionStart === this.selectionEnd){ e.preventDefault(); }
    });
    input.addEventListener("input", function(){ reformat(this); clearErr(this); });
    input.addEventListener("blur",  function(){ check(this); });

    const cs = ccSelOf(input);
    if (cs && !cs.dataset.tnmPhoneCc){
      cs.dataset.tnmPhoneCc = "1";
      cs.addEventListener("change", function(){ syncMax(input); reformat(input); clearErr(input); });
    }
    reformat(input);    
  }

  function scan(root){
    const r = root && root.querySelectorAll ? root : document;
    if (r.matches && r.matches(SEL)) attach(r);
    r.querySelectorAll(SEL).forEach(attach);
  }

  

  document.addEventListener("submit", function(e){
    const form = e.target;
    if (!form || !form.querySelectorAll) return;
    const bad = [];
    form.querySelectorAll(SEL).forEach(function(i){ attach(i); if(!check(i)) bad.push(i); });
    if (bad.length){ e.preventDefault(); e.stopImmediatePropagation(); try{ bad[0].focus(); }catch(err){} }
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ scan(document); });
  else scan(document);
   
  new MutationObserver(function(muts){
    for (let i=0;i<muts.length;i++){
      const added = muts[i].addedNodes;
      for (let j=0;j<added.length;j++) if (added[j].nodeType === 1) scan(added[j]);
    }
  }).observe(document.documentElement, {childList:true, subtree:true});
})();















(function initNameFields(){
  const G = TNMGuards;

   
  function isName(el){
    if (!el || el.nodeType !== 1 || el.tagName !== "INPUT") return false;
    const d = el.dataset.tnmName;
    if (d === "1") return true;
    if (d === "0") return false;
    const yes = G.isPersonNameField(el);
    el.dataset.tnmName = yes ? "1" : "0";
    return yes;
  }

   
  function sanitize(input){
    const before = input.value, out = G.stripDigits(before);
    if (out === before) return false;
    let pos = null;
    try { if (typeof input.selectionStart === "number") pos = G.stripDigits(before.slice(0, input.selectionStart)).length; }
    catch(e){   }
    input.value = out;
    if (pos != null){ try { input.setSelectionRange(pos,pos); } catch(e){} }
    return true;
  }

   
  document.addEventListener("beforeinput", function(e){
    const el = e.target;
    if (!isName(el)) return;
    if (!e.inputType || e.inputType.indexOf("delete") === 0) return;
    const ins = e.data == null ? "" : String(e.data);
    if (e.inputType === "insertText" && ins && G.hasDigit(ins)) e.preventDefault();
  }, true);

  


  document.addEventListener("input", function(e){
    if (isName(e.target)) sanitize(e.target);
  }, true);

  

  function scan(root){
    const r = (root && root.querySelectorAll) ? root : document;
    if (r.matches && r.matches("input") && isName(r)) sanitize(r);
    r.querySelectorAll && r.querySelectorAll("input").forEach(function(i){ if (isName(i)) sanitize(i); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ scan(document); });
  else scan(document);
  new MutationObserver(function(muts){
    for (let i=0;i<muts.length;i++){
      const added = muts[i].addedNodes;
      for (let j=0;j<added.length;j++) if (added[j].nodeType === 1) scan(added[j]);
    }
  }).observe(document.documentElement, {childList:true, subtree:true});

  

  document.addEventListener("submit", function(e){
    const form = e.target;
    if (form && form.querySelectorAll) scan(form);
  }, true);
})();

















(function initTelLinks(){
  if (!window.matchMedia) return;
  var dotyk;
  try { dotyk = window.matchMedia("(pointer: coarse)").matches; } catch(e){ return; }
  if (dotyk) return;    

  function odlinkuj(root){
    const r = (root && root.querySelectorAll) ? root : document;
    const lista = [];
    if (r.matches && r.matches('a[href^="tel:"]')) lista.push(r);
    if (r.querySelectorAll) r.querySelectorAll('a[href^="tel:"]').forEach(function(a){ lista.push(a); });
    lista.forEach(function(a){
      const s = document.createElement("span");
      if (a.className) s.className = a.className;
      

      s.setAttribute("data-tel", (a.getAttribute("href") || "").replace(/^tel:/, ""));
      s.textContent = a.textContent;
      if (a.parentNode) a.parentNode.replaceChild(s, a);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ odlinkuj(document); });
  else odlinkuj(document);
   
  new MutationObserver(function(muts){
    for (let i=0;i<muts.length;i++){
      const added = muts[i].addedNodes;
      for (let j=0;j<added.length;j++) if (added[j].nodeType === 1) odlinkuj(added[j]);
    }
  }).observe(document.documentElement, {childList:true, subtree:true});
})();











const LEGAL = {
  regulamin:  "../regulamin.html",
  prywatnosc: "../polityka-prywatnosci.html",
  cookies:    "../cookies.html"
};
const LEGAL_LABEL = { regulamin:"Terms", prywatnosc:"Privacy Policy", cookies:"Cookies" };




const ADMIN_DANYCH_WWW = "The Art Makers sp. z o.o. (The Noise Makers brand)";


function legalHref(key){ return LEGAL[key] || "#"; }







const LABEL_POLITYKA_W = "Privacy Policy";



const LABEL_COOKIE_SETTINGS = "Cookie settings";
const COOKIE_SETTINGS_LINK = (window.TNMConsent && window.TNMConsent.enabled)
  ? '<button type="button" class="legal__settings" data-consent-open>'+LABEL_COOKIE_SETTINGS+'</button>' : "";

function legalLink(key, label, nowa){
  return '<a href="'+legalHref(key)+'"'+(nowa?' target="_blank" rel="noopener"':'')+'>'+(label||LEGAL_LABEL[key]||key)+'</a>';
}


function legalNoteHTML(keys, wstep){
  const ks = keys && keys.length ? keys : ["regulamin","prywatnosc"];
  return '<p class="legal-note">'+(wstep||"Details:")+' '+ks.map(k=>legalLink(k,null,true)).join(" · ")+'</p>';
}









const ODWOLANIA = {
  tekst: "Group classes cannot be cancelled, 1:1 meetings cannot be cancelled on the day of the class, and an assessment date can be moved up to 3 days before the meeting.",
  zgoda: "I know and accept the cancellation and rescheduling policy."
};
window.TNMLegal = { urls: LEGAL, href: legalHref, link: legalLink, note: legalNoteHTML, odwolania: ODWOLANIA };




const FB_URL = "https://www.facebook.com/noisemakersacademy";

 
 
const CHEV='<svg class="caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6l4 4 4-4"/></svg>';


























const EN_MIRROR = ["404.html","artletter-potwierdzony.html","dni-probne.html","index.html","konfigurator.html",
  "konsultacje-dorosli.html","konsultacje-dzieci.html","konsultacje.html","partnerzy.html",
  "polkolonie-dorosli.html","polkolonie-dzieci.html","polkolonie-feedback.html",
  "polkolonie.html","rejestracja-diagnostyka.html","rejestracja-otwarta.html",
  "strefa-tnm.html","usun-dane.html","wracam.html",
  "wydarzenia.html","wypis.html","zajecia-indywidualne-dorosli.html",
  "zajecia-indywidualne-dzieci.html","zajecia-indywidualne.html",
  "zajecia-zespolowe-dorosli.html","zajecia-zespolowe-dzieci.html","zajecia-zespolowe.html"];
const LANG_TERAZ = (document.documentElement.getAttribute("lang")||"pl").toLowerCase()==="en" ? "en" : "pl";




















const LANG_CZYSTE = {"rejestracja":"strefa-tnm.html", "feedback":"strefa-tnm.html",
  "konfigurator":"konfigurator.html", "wracam":"wracam.html",
  "polkolonie-feedback":"polkolonie-feedback.html", "rejestracja-diagnostyka":"rejestracja-diagnostyka.html",
  


  "dolacz":"rejestracja-otwarta.html"};
const LANG_SEG = location.pathname.split("/").filter(Boolean).pop() || "";
const LANG_STRONA = LANG_SEG.slice(-5)===".html" ? LANG_SEG
  : (LANG_CZYSTE[LANG_SEG] || "index.html");
const LANG_LABEL = LANG_TERAZ==="en" ? "EN" : "PL";
const LANG_HREF_PL = "/" + LANG_STRONA;
const LANG_HREF_EN = EN_MIRROR.indexOf(LANG_STRONA)>-1 ? "/en/"+LANG_STRONA : "/en/index.html";










const NAV = `
<nav class="nav"><div class="nav__inner">
  <a class="nav__logo" href="index.html"><img class="nav__logo-white" src="../assets/img/figma/logo-tnm-white.png?v=20260615" alt="The Noise Makers - Academy of Music"><img class="nav__logo-red" src="../assets/img/logo/logotyp_TNM_czerwony.png?v=20260706" alt="" aria-hidden="true"></a>
  <button class="nav__burger" aria-label="menu">☰</button>
  <div class="nav__menu">
    <div class="nav__overlay-head">
      <img class="nav__overlay-logo" src="../assets/img/figma/logo-tnm-white.png?v=20260615" alt="The Noise Makers">
      <button class="nav__close" aria-label="close menu">&#10005;</button>
    </div>
    




    <div class="nav__item">Children ${CHEV}<div class="nav__drop">
      <a href="zajecia-indywidualne-dzieci.html">Classes</a>
      <a href="zajecia-zespolowe-dzieci.html">Groups</a></div></div>
    <div class="nav__item">Adults ${CHEV}<div class="nav__drop">
      <a href="zajecia-indywidualne-dorosli.html">Classes</a>
      <a href="zajecia-zespolowe-dorosli.html">Groups</a></div></div>
    <a class="nav__item" href="dni-probne.html">Let's meet</a>
    <a class="nav__item" href="konsultacje-dzieci.html">Consultations</a>
    <a class="nav__item" href="partnerzy.html">Partners</a>
    <a class="nav__item" href="wydarzenia.html">Events</a>
    
    
    <div class="nav__item nav__item--lang">${LANG_LABEL} ${CHEV}<div class="nav__drop">
      <a href="${LANG_HREF_PL}" hreflang="pl">PL</a>
      <a href="${LANG_HREF_EN}" hreflang="en">EN</a></div></div>
  </div>
</div></nav>`;






const NAV_KONF = `
<nav class="nav nav--bare"><div class="nav__inner">
  <span class="nav__logo"><img class="nav__logo-white" src="../assets/img/figma/logo-tnm-white.png?v=20260615" alt="The Noise Makers - Academy of Music"></span>
</div></nav>`;

 
 
const IG='<svg viewBox="0 0 36.6667 36.6667"><path d="M10.7405 0.128219C8.78985 0.220253 7.45774 0.531554 6.29319 0.989156C5.08795 1.45886 4.0664 2.08916 3.04999 3.10923C2.03358 4.1293 1.40768 5.15157 0.941273 6.35864C0.489901 7.52575 0.184098 8.85895 0.0979307 10.8107C0.0117632 12.7625 -0.00730368 13.3899 0.00222975 18.3685C0.0117632 23.3471 0.0337634 23.9712 0.128364 25.927C0.221499 27.8773 0.531702 29.209 0.989306 30.3739C1.45974 31.5792 2.08932 32.6003 3.10976 33.6171C4.1302 34.6339 5.15175 35.2583 6.36176 35.7254C7.52777 36.1761 8.86135 36.4833 10.8128 36.5688C12.7642 36.6542 13.3923 36.674 18.3695 36.6645C23.3467 36.6549 23.9733 36.6329 25.9288 36.5402C27.8842 36.4474 29.209 36.135 30.3743 35.6796C31.5795 35.2081 32.6014 34.5796 33.6175 33.5588C34.6335 32.538 35.2591 31.515 35.7251 30.3072C36.1768 29.1412 36.4837 27.8076 36.5684 25.8577C36.6539 23.9008 36.674 23.276 36.6645 18.2981C36.655 13.3202 36.6326 12.6961 36.5398 10.7411C36.4471 8.78598 36.1365 7.45828 35.6793 6.29264C35.2081 5.0874 34.5792 4.06697 33.5592 3.04946C32.5391 2.03196 31.5153 1.40679 30.3079 0.941856C29.1412 0.490487 27.8083 0.182853 25.8569 0.0985193C23.9055 0.0141857 23.2774 -0.00744774 18.2983 0.00208563C13.3193 0.011619 12.696 0.0328857 10.7405 0.128219ZM10.9547 33.2706C9.16716 33.1929 8.19658 32.8959 7.54977 32.6473C6.69323 32.3173 6.08309 31.9183 5.43848 31.28C4.79388 30.6416 4.39787 30.0293 4.06347 29.1746C3.8123 28.5278 3.5098 27.5583 3.4262 25.7708C3.33526 23.8388 3.3162 23.2587 3.30556 18.3641C3.29493 13.4694 3.31363 12.8901 3.39833 10.9574C3.4746 9.17135 3.77343 8.19968 4.02167 7.55325C4.35167 6.69561 4.74914 6.08657 5.38898 5.44234C6.02882 4.7981 6.63933 4.40137 7.49477 4.06697C8.14085 3.8147 9.11032 3.51476 10.8971 3.4297C12.8306 3.33803 13.4099 3.3197 18.3038 3.30906C23.1978 3.29843 23.7786 3.31676 25.7128 3.40183C27.4988 3.47956 28.4709 3.77547 29.1166 4.02517C29.9735 4.35517 30.5833 4.75154 31.2275 5.39247C31.8718 6.03341 32.2689 6.64171 32.6033 7.49898C32.8559 8.14321 33.1558 9.11232 33.2402 10.9002C33.3322 12.8336 33.3531 13.4133 33.3619 18.3069C33.3707 23.2004 33.3535 23.7816 33.2688 25.7136C33.1907 27.5011 32.8944 28.472 32.6454 29.1196C32.3154 29.9757 31.9176 30.5862 31.2774 31.2301C30.6372 31.874 30.0274 32.2707 29.1716 32.6051C28.5263 32.857 27.5557 33.1577 25.7704 33.2427C23.8369 33.3337 23.2576 33.3527 18.3618 33.3634C13.466 33.374 12.8885 33.3542 10.955 33.2706M25.9005 8.53482C25.9013 8.96997 26.031 9.39513 26.2734 9.75653C26.5158 10.1179 26.8599 10.3993 27.2622 10.5652C27.6645 10.731 28.107 10.7738 28.5336 10.6881C28.9603 10.6024 29.3519 10.3922 29.659 10.0839C29.9662 9.77567 30.175 9.38325 30.2591 8.9563C30.3432 8.52935 30.2988 8.08705 30.1315 7.68535C29.9642 7.28364 29.6815 6.94056 29.3192 6.69952C28.9569 6.45847 28.5313 6.33027 28.0961 6.33114C27.5128 6.33231 26.9538 6.56511 26.542 6.97836C26.1303 7.39161 25.8996 7.95146 25.9005 8.53482ZM8.92002 18.3516C8.93029 23.551 13.1529 27.7563 18.3511 27.7464C23.5494 27.7365 27.7577 23.5143 27.7478 18.315C27.7379 13.1156 23.5142 8.90918 18.3152 8.91945C13.1162 8.92972 8.91012 13.153 8.92002 18.3516ZM12.2223 18.345C12.2199 17.1363 12.5759 15.9541 13.2455 14.9478C13.915 13.9414 14.8679 13.1563 15.9837 12.6915C17.0995 12.2268 18.328 12.1033 19.5139 12.3368C20.6999 12.5702 21.7899 13.1501 22.6463 14.0031C23.5027 14.8561 24.0869 15.9438 24.325 17.1288C24.5632 18.3138 24.4446 19.5428 23.9843 20.6604C23.5239 21.778 22.7425 22.734 21.7389 23.4075C20.7352 24.081 19.5543 24.4418 18.3456 24.4442C17.5431 24.4459 16.748 24.2894 16.0059 23.9838C15.2638 23.6782 14.5892 23.2294 14.0205 22.663C13.4519 22.0966 13.0004 21.4238 12.6919 20.6829C12.3833 19.942 12.2237 19.1476 12.2223 18.345Z"/></svg>';
const FB='<svg viewBox="0 0 36.6667 36.5585"><path d="M17.4891 0H19.2089C19.3349 0.0713133 20.2325 0.0933145 20.444 0.115247C21.4091 0.215356 22.3003 0.39417 23.2331 0.654408C29.026 2.26065 33.667 6.59878 35.6599 12.2703C36.1197 13.5705 36.4131 14.8468 36.5744 16.2118C36.6016 16.4407 36.5918 17.074 36.6667 17.2515V19.4858C36.6218 19.6109 36.5735 20.4023 36.5521 20.5944C36.505 21.0291 36.4369 21.4613 36.348 21.8893C35.8032 24.6208 34.6454 27.193 32.9615 29.4118C29.8964 33.4559 25.5338 35.8719 20.5346 36.5585C20.5606 35.6024 20.5363 34.5186 20.5362 33.5534L20.5351 27.6289L20.5346 25.4498C20.5346 24.9665 20.5221 24.4391 20.5633 23.9607C20.938 23.9182 21.9912 23.9415 22.4162 23.945C23.424 23.9532 24.5227 23.9196 25.5223 23.9585C25.5548 23.358 25.8226 22.0915 25.9511 21.4481C26.1518 20.444 26.3088 19.3237 26.5284 18.3398L20.5589 18.3356C20.5281 17.2695 20.4827 15.9835 20.6532 14.935C20.7846 14.1265 21.2104 13.3098 21.913 12.8603C22.9379 12.2044 24.3144 12.2433 25.4905 12.2702C25.9232 12.2801 26.4177 12.2457 26.8354 12.3302C26.7723 11.7894 26.8001 10.8716 26.8002 10.2965C26.7949 9.27428 26.7958 8.25205 26.803 7.22984C23.3463 6.61598 18.7438 6.3111 16.0562 9.07201C13.7764 11.4139 13.873 15.274 13.9476 18.3368L10.1472 18.3364C10.1709 19.4917 10.1495 20.6927 10.1548 21.8521C10.1573 22.4168 10.1904 23.4221 10.1453 23.9533C11.4098 23.9459 12.6744 23.9449 13.9389 23.9505C13.8883 27.9949 13.9946 32.0965 13.9308 36.1384C13.5634 36.0614 13.0661 35.9016 12.7013 35.7873C6.84264 33.8974 2.32378 29.193 0.67108 23.2632C0.432315 22.3903 0.251425 21.5668 0.135085 20.6677C0.102354 20.4148 0.0693694 19.327 0 19.2156V17.5101C0.0893885 17.3392 0.0580519 16.8895 0.0748917 16.6749C0.736187 8.24609 7.58691 1.12665 15.988 0.147581C16.2342 0.118879 17.3801 0.0563735 17.4891 0Z"/></svg>';
const WA='<svg viewBox="0 0 29.3333 29.3333"><path d="M14.7281 0C6.67808 0 0.125502 6.52022 0.122087 14.5341C0.121233 17.0958 0.793993 19.5963 2.07206 21.8003L0 29.3333L7.74271 27.312C9.87624 28.4701 12.2779 29.0801 14.7222 29.081H14.7281C22.7773 29.081 29.3299 22.5599 29.3333 14.546C29.335 10.6623 27.8171 7.01047 25.0594 4.26355C22.3018 1.51578 18.6349 0.0016993 14.7281 0ZM14.7281 26.6263H14.723C12.5451 26.6263 10.4081 26.0426 8.54439 24.9423L8.10129 24.6806L3.50723 25.8804L4.73322 21.4222L4.44465 20.9651C3.22976 19.0415 2.58773 16.818 2.58859 14.5358C2.59115 7.87456 8.03726 2.45549 14.7333 2.45549C17.9758 2.45634 21.0237 3.71467 23.3152 5.99853C25.6075 8.28154 26.8685 11.3173 26.8677 14.5452C26.8651 21.2064 21.419 26.6263 14.7281 26.6263ZM21.3866 17.5784C21.022 17.3966 19.2274 16.5181 18.8928 16.3966C18.5581 16.2751 18.3148 16.2147 18.0714 16.5784C17.8281 16.942 17.1289 17.7602 16.9163 18.0024C16.7037 18.2454 16.4903 18.2751 16.1257 18.0933C15.7612 17.9115 14.5847 17.5274 13.1914 16.2903C12.1063 15.3277 11.3737 14.1382 11.1611 13.7745C10.9486 13.4109 11.1381 13.2146 11.3217 13.0336C11.4856 12.8714 11.6862 12.6097 11.8689 12.3973C12.0516 12.1848 12.1122 12.0336 12.2335 11.7906C12.3547 11.5485 12.2941 11.336 12.2027 11.1542C12.1114 10.9724 11.3814 9.18472 11.0775 8.45742C10.7812 7.74966 10.4807 7.84482 10.2562 7.83378C10.0436 7.82273 9.80026 7.82103 9.55694 7.82103C9.31362 7.82103 8.91833 7.91195 8.58366 8.2756C8.24899 8.63925 7.30644 9.51778 7.30644 11.3054C7.30644 13.0931 8.61439 14.8205 8.79624 15.0626C8.97895 15.3048 11.3695 18.9735 15.0304 20.5462C15.9012 20.9201 16.5808 21.1436 17.111 21.3109C17.9852 21.5871 18.7809 21.548 19.4093 21.4545C20.1102 21.35 21.5684 20.576 21.8724 19.7272C22.1763 18.8792 22.1763 18.1519 22.0849 17.9998C21.9936 17.8486 21.7503 17.7577 21.3857 17.5759L21.3866 17.5784Z"/></svg>';
const PIN='<svg viewBox="0 0 32 32"><path d="M25.3333 13.5756C25.3333 11.0265 24.3422 8.58788 22.5885 6.79431C20.8358 5.00181 18.4655 4.00004 16 4.00004C13.5345 4.00004 11.1642 5.00181 9.41146 6.79431C7.65775 8.58788 6.66673 11.0265 6.66667 13.5756C6.66667 17.2932 9.03315 20.9114 11.6445 23.7305C12.9247 25.1126 14.21 26.2435 15.1758 27.03C15.4885 27.2847 15.7676 27.5012 16 27.6784C16.2324 27.5012 16.5115 27.2847 16.8242 27.03C17.79 26.2435 19.0753 25.1126 20.3555 23.7305C22.9669 20.9114 25.3333 17.2932 25.3333 13.5756ZM28 13.5756C28 18.3427 25.0331 22.6046 22.3112 25.543C20.9251 27.0393 19.5432 28.2555 18.5091 29.0977C17.991 29.5197 17.5565 29.8505 17.25 30.0769C17.097 30.1899 16.9755 30.2772 16.8906 30.3373C16.8482 30.3673 16.8151 30.3913 16.7917 30.4076C16.7799 30.4157 16.7697 30.4212 16.763 30.4258C16.7597 30.4281 16.7573 30.4309 16.7552 30.4323L16.7526 30.4336L16.7513 30.4349L16 30.9467L15.2487 30.4349L15.2474 30.4336L15.2448 30.4323C15.2427 30.4309 15.2403 30.4281 15.237 30.4258C15.2303 30.4212 15.2201 30.4157 15.2083 30.4076C15.1849 30.3913 15.1518 30.3673 15.1094 30.3373C15.0245 30.2772 14.903 30.1899 14.75 30.0769C14.4435 29.8505 14.009 29.5197 13.4909 29.0977C12.4568 28.2555 11.0749 27.0393 9.6888 25.543C6.96687 22.6046 4 18.3427 4 13.5756C4.00006 10.3384 5.25702 7.22774 7.50391 4.92973C9.75192 2.63063 12.8076 1.33337 16 1.33337C19.1924 1.33337 22.2481 2.63063 24.4961 4.92973C26.743 7.22774 27.9999 10.3384 28 13.5756ZM18.6667 13.3333C18.6667 11.8606 17.4728 10.6667 16 10.6667C14.5273 10.6667 13.3334 11.8606 13.3334 13.3333C13.3334 14.8061 14.5273 16 16 16C17.4728 16 18.6667 14.8061 18.6667 13.3333ZM21.3334 13.3333C21.3334 16.2789 18.9455 18.6667 16 18.6667C13.0545 18.6667 10.6667 16.2789 10.6667 13.3333C10.6667 10.3878 13.0545 8 16 8C18.9455 8 21.3334 10.3878 21.3334 13.3333Z"/></svg>';
 
const MAIL='<svg viewBox="0 0 32 32"><path d="M30.6666 5.32666V26.66H1.33331V5.32666H30.6666ZM3.99998 23.9933H28V7.99333H3.99998V23.9933Z"/><path d="M30.1666 7.70162L16 19.0336L1.83331 7.70162L3.49998 5.61829L16 15.6183L28.5 5.61829L30.1666 7.70162Z"/></svg>';















const MAP_EMBED_SRC = "https://www.google.com/maps/d/u/0/embed?mid=1W2FQK9YwZCHYPrj76B6_cto5HtorG-4&ehbc=E20900";
const MAP_ALT   = "Map of Warsaw with The Noise Makers locations marked: Wola, Wilanów, Ursus, Ursynów";
const MAP_TITLE = "Google map with The Noise Makers locations";
const MAP_BTN   = "Turn on the map";
const MAP_NOTE  = "Google displays the map. When you click, the map, the video and the booking calendar turn on across the whole site. We explain how to undo this in Cookies.";
const MAP_STATIC = `<section class="map map--static" data-map-facade>
  <img src="../assets/img/figma/mapa-lokalizacje-tnm.webp" width="1400" height="905" loading="lazy" decoding="async" alt="${MAP_ALT}">
  <div class="map__facade"><button class="btn map__btn" type="button" data-map-consent>${MAP_BTN}</button><p class="map__note">${MAP_NOTE}</p></div>
</section>`;
function mountMap(){
  const sec=document.querySelector("[data-map-facade]"); if(!sec) return;    
  const f=document.createElement("iframe");
  f.src=MAP_EMBED_SRC; f.title=MAP_TITLE; f.loading="lazy"; f.referrerPolicy="no-referrer-when-downgrade";
  sec.removeAttribute("data-map-facade"); sec.classList.remove("map--static"); sec.classList.add("map--live");
  sec.replaceChildren(f);
}
function initMap(){
  const sec=document.querySelector("[data-map-facade]"); if(!sec) return;
  const C=window.TNMConsent;
  if(C && C.enabled && C.get().functional){ mountMap(); return; }
  const btn=sec.querySelector("[data-map-consent]");
  if(btn) btn.addEventListener("click",()=>{
    if(C && C.enabled) C.set({functional:true});    
    mountMap();
  },{once:true});
  if(C) C.onChange(s=>{ if(s.functional) mountMap(); });
}

const FOOTER = `
<footer class="footer" id="formularz">
  <div class="footer__mono"><img class="footer__sygnet" src="../assets/img/figma/logo-tnm-sygnet.png?v=20260616" alt="The Noise Makers" width="118" height="118"></div>
  <div class="footer__top">
    <div class="footer__claim">Feel the he<span class="art">art</span>.</div>
    <div class="footer__social">
      <a href="https://www.instagram.com/thenoisemakers.pl" target="_blank" rel="noopener" aria-label="Instagram">${IG}</a>
      


      ${FB_URL ? `<a href="${FB_URL}" target="_blank" rel="noopener" aria-label="Facebook">${FB}</a>` : ""}
    </div>
  </div>
  <div class="footer__divider"></div>
  <div class="container footer__grid">
    <div>
      <h3>Write to us. We are here.</h3>
      <div class="footer__contact" style="display:flex;flex-direction:column;gap:var(--md)">
        <div class="footer__row">${WA}<a href="tel:+48570111117">+48 570 111 117</a></div>
        <div class="footer__row">${MAIL}<a href="mailto:jestem@thenoisemakers.pl">jestem@thenoisemakers.pl</a></div>
        <div class="footer__row">${PIN}<span>Warsaw - Wola, Wilanów, Ursus, Ursynów</span></div>
      </div>
    </div>
    <div>
      <h3>Want to know what TNM recommends?</h3>
      <p>Join our ARTLetter!<br>You will read about events from the world of culture and art.</p>
      









      <form id="artletter-form" novalidate>
        <div class="footer__subrow">
          <input type="text" name="imie" placeholder="First name" aria-label="First name" autocomplete="given-name" maxlength="40" required>
          <input type="text" name="nazwisko" placeholder="Last name" aria-label="Last name" autocomplete="family-name" maxlength="80" required>
        </div>
        <div class="footer__subrow">
          <input type="email" name="email" placeholder="Enter your email" autocomplete="email" required>
          <button class="footer__sub" type="submit">Subscribe</button>
        </div>
        <label class="footer__consent">
          <input type="checkbox" name="consent_mkt">
          <span>I want to receive the ARTletter at the address given.</span>
        </label>
        <label class="footer__consent">
          <input type="checkbox" name="consent_rodo">
          <span>I agree to my email address being processed for this purpose by ${ADMIN_DANYCH_WWW}.</span>
        </label>
        <p class="pf-msg" data-artletter-msg></p>
      </form>
      <p class="footer__note">You can withdraw your consent at any time. Details in ${legalLink("prywatnosc",LABEL_POLITYKA_W)}.</p>
    </div>
  </div>
</footer>
${MAP_STATIC}
<div class="legal"><div class="container">
  <span class="copy">© 2026 The Noise Makers. All rights reserved.</span>
  

  ${legalLink("prywatnosc")}${legalLink("regulamin")}${legalLink("cookies")}
</div></div>`;



const STICKY = `<a class="sticky-cta" href="${FORM_URL}" data-entry="pinned-pelny"><span class="sticky-cta__main">We are here.</span><span class="sticky-cta__sub">Fill in the form &gt;</span></a>`;






const MODAL = `<div class="modal" id="modal"><button class="modal__close" type="button" aria-label="Zamknij okno">×</button><div class="modal__box"><div id="modal-content"></div></div></div>`;


















const VOUCHER_PHOTO="../assets/img/figma/voucher-muszla.webp";
const VOUCHER_OPTS=[
  {v:"fundamenty",label:"“Fundamentals” assessment",price:"899 zł",
   desc:"A 1:1 assessment that recognises the needs and natural strengths of the recipient and ends with class recommendations."},
  {v:"zajecia1na1",label:"1 session of „1:1 classes”",price:"289 zł",
   desc:"One individual 1:1 meeting with a Tutor matched to the recipient."}
];
function openVoucherModal(){
  const def=VOUCHER_OPTS[0];    
  const checks=VOUCHER_OPTS.map((o,i)=>
    `<button type="button" class="vmodal__check${i===0?" is-on":""}" data-vopt="${o.v}" role="radio" aria-checked="${i===0}">`
    +`<span class="vmodal__box" aria-hidden="true"></span><span class="vmodal__opt">${o.label}</span></button>`).join("");
  openModal(`<div class="vmodal">
    <div class="vmodal__bar"><span class="vmodal__bartitle">Voucher TNM</span></div>
    <div class="vmodal__main">
      <div class="vmodal__panel">
        <div class="vmodal__head">
          <h2 class="vmodal__title">Voucher</h2>
          <p class="vmodal__desc">The TNM Voucher is a special gift that gives someone close to you the chance to share deep, fully present moments during our classes.</p>
        </div>
        <div class="vmodal__choose">
          <span class="vmodal__chooselab">Choose:</span>
          <div class="vmodal__checks" role="radiogroup" aria-label="Wybierz rodzaj vouchera">${checks}</div>
        </div>
        <p class="vmodal__optdesc" data-vopt-desc>${def.desc}</p>
        <div class="vmodal__terms">
          <p>Redemption period:</p>
          <p>The Voucher lets the person you give it to fit the date of the “Fundamentals” Assessment and of the first „Zajęcia 1:1” meeting to their own availability.</p>
          <p>The Voucher can be redeemed within 12 months of the date of purchase.</p>
        </div>
        <div class="vmodal__price" data-vopt-price>${def.price}</div>
      </div>
      <div class="vmodal__media">
        <span class="vmodal__media-bg bw" style="background-image:url('${VOUCHER_PHOTO}')"></span>
        <button class="btn vmodal__buy" type="button" data-voucher-buy>Buy the Voucher ${ARR}</button>
      </div>
    </div>
    <button class="btn vmodal__buy vmodal__buy--pin" type="button" data-voucher-buy>Buy the Voucher ${ARR}</button>
  </div>`,"modal__box--voucher");
}

function mount(){
  


  const isKonf=document.body.classList.contains("konf-page");
  const h=document.getElementById("site-header"); if(h) h.innerHTML=isKonf?NAV_KONF:NAV;
  const f=document.getElementById("site-footer"); if(f){ f.innerHTML=FOOTER;
    

    const lg=f.querySelector(".legal .container"); if(lg&&COOKIE_SETTINGS_LINK) lg.insertAdjacentHTML("beforeend",COOKIE_SETTINGS_LINK);
    








    const mono=f.querySelector(".footer__mono");
    if(mono){
      const paints=el=>{const cs=getComputedStyle(el);
        return cs.display!=="none" && cs.position!=="fixed" && cs.position!=="absolute";};
      let prev=f.previousElementSibling;
      while(prev && !paints(prev)) prev=prev.previousElementSibling;
      const bg=prev?getComputedStyle(prev).backgroundColor:"";
      mono.style.background=(bg && bg!=="rgba(0, 0, 0, 0)" && bg!=="transparent") ? bg : "var(--paper)";
    }
  }
  

  if(f) initArtletterForm();
  if(f) initMap();    
  document.body.insertAdjacentHTML("beforeend",STICKY+MODAL+BOOKING);
  initBooking();
   
   
  const navMenu=document.querySelector(".nav__menu");
  const setMenu=open=>{if(!navMenu)return;navMenu.classList.toggle("open",open);document.body.classList.toggle("nav-lock",open);
    if(!open) document.querySelectorAll(".nav__item.open").forEach(x=>x.classList.remove("open"));};
  document.querySelector(".nav__burger")?.addEventListener("click",()=>{
     
    if(matchMedia("(min-width:992px)").matches){ scrollTo({top:0,behavior:"smooth"}); return; }
    setMenu(!navMenu.classList.contains("open"));  
  });
  document.querySelector(".nav__close")?.addEventListener("click",()=>setMenu(false));
   
  const navEl=document.querySelector(".nav");
   
   
  if(navEl && !isKonf){
    const remPx2=()=>parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
    const COLLAPSE_REM=5;
    const onNavScroll=()=>{ if(!navMenu?.classList.contains("open")) navEl.classList.toggle("nav--collapsed", scrollY > COLLAPSE_REM*remPx2()); };
    onNavScroll();
    addEventListener("scroll",onNavScroll,{passive:true});
  }
   
  navMenu?.querySelectorAll("a[href]").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
   
  document.querySelectorAll(".nav__item").forEach(it=>{
    if(!it.querySelector(".nav__drop")) return;
    it.addEventListener("click",e=>{
      if(e.target.closest(".nav__drop")) return;  
      document.querySelectorAll(".nav__item.open").forEach(x=>{if(x!==it)x.classList.remove("open");});
      it.classList.toggle("open");
    });
  });
  document.addEventListener("click",e=>{
    if(!e.target.closest(".nav__item")) document.querySelectorAll(".nav__item.open").forEach(x=>x.classList.remove("open"));
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
  const modal=document.getElementById("modal");
  

  modal.addEventListener("click",e=>{ if(e.target.closest(".modal__close")) modal.classList.remove("open"); });
  modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open");};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open");});
  













  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-entry]");
    if(!t) return;
    e.preventDefault();
    const fn=ENTRY[t.dataset.entry];
    if(fn){ const ctx=fn(); ctx.trigger=t;
      if(ctx.variant==="B"&&(ctx.next||{}).kind!=="zencal") routeStep2(ctx); else openEntry(ctx); }
  });
   
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-entry-go]")){ e.preventDefault(); routeStep2(currentEntry); }
    if(e.target.closest("[data-entry-close]")){ e.preventDefault(); closeModalBox(); }    
  });
   
   
   
  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-termin]");
    if(t){e.preventDefault();const ctx=ENTRY[(+t.dataset.termin||0)===1?"kons-fundamenty":"kons-poznajmy"]();ctx.trigger=t;openEntry(ctx);}
  });
   
  document.addEventListener("click",e=>{
    const v=e.target.closest("[data-voucher]");
    if(v){e.preventDefault();openVoucherModal();return;}
     
    const opt=e.target.closest("[data-vopt]");
    if(opt){const grp=opt.closest(".vmodal__checks");
      if(grp) grp.querySelectorAll(".vmodal__check").forEach(b=>{const on=b===opt;b.classList.toggle("is-on",on);b.setAttribute("aria-checked",String(on));});
       
      const vo=VOUCHER_OPTS.find(x=>x.v===opt.dataset.vopt), box=opt.closest(".vmodal");
      if(vo&&box){const pr=box.querySelector("[data-vopt-price]"); if(pr) pr.textContent=vo.price;
        const ds=box.querySelector("[data-vopt-desc]"); if(ds) ds.textContent=vo.desc;}
      return;}
     
     
    const buy=e.target.closest("[data-voucher-buy]");
    if(buy){e.preventDefault();
      const sel=document.querySelector(".vmodal__check.is-on");
      routeStep2({next:{kind:"form",schema:"voucher",prefill:{rodzaj:sel?sel.dataset.vopt:null}},thx:{surface:"voucher",button:false}});
      return;}
  });
   
  const sp=new URLSearchParams(location.search);
  const thxParam=sp.get("thx"), tyLegacy=sp.get("ty");
  if(thxParam){ if(thxParam==="konsultacja"&&window.TNMTrack) TNMTrack("schedule",{content_name:"konsultacja"}); openThanks({surface:thxParam, button:(thxParam==="konsultacja")}); tnmDropParams(["thx","ty"]); }    
  else if(tyLegacy){ if(window.TNMTrack) TNMTrack("schedule",{content_name:"konsultacja"}); openThanks({surface:"konsultacja", button:true}); tnmDropParams(["thx","ty"]); }
   
   
   
   
  const formParam=sp.get("form");
  if(formParam==="pelny"||formParam==="skrocony"){
    tnmDropParams(["form"]);
    let formProb=0; const goForm=()=>{ if(window.TNMIntake&&typeof ENTRY!=="undefined"){ routeStep2(ENTRY[formParam==="skrocony"?"home-hero-skrocony":"pinned-pelny"]()); } else if(formProb++<40) setTimeout(goForm,125); };
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(goForm,0)); else setTimeout(goForm,0);
  }
   
   
   
  const umowParam=sp.get("umow");
  if(umowParam==="poznajmy"||umowParam==="fundamenty"){
    tnmDropParams(["umow"]);
    let umowProb=0; const goUmow=()=>{ if(typeof ENTRY!=="undefined"){ openBookingIntro(umowParam==="fundamenty"?"paid":"free"); } else if(umowProb++<40) setTimeout(goUmow,125); };
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(goUmow,0)); else setTimeout(goUmow,0);
  }
   
  document.addEventListener("click",e=>{
    const g=e.target.closest("[data-book-go]");
    if(g){e.preventDefault();document.getElementById("modal")?.classList.remove("open");openBooking(g.dataset.bookGo,{locked:true});}
  });
   
   
   
  const cta=document.querySelector(".sticky-cta");
  if(cta){
    const hero=document.querySelector(".hero,.subhero");
    const show=v=>cta.classList.toggle("show",v);
    if(hero){
      const THRESH_REM=6;  
      const remPx=()=>parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
      const update=()=>{
         
         
        show(hero.getBoundingClientRect().bottom <= -THRESH_REM*remPx());
      };
      update();
      addEventListener("scroll",update,{passive:true});
      addEventListener("resize",update);
    } else { show(true); }  
  }
}
function openModal(html,cls){
  const m=document.getElementById("modal");
  m.querySelector(".modal__box").className="modal__box"+(cls?" "+cls:"");
  document.getElementById("modal-content").innerHTML=html;
  m.classList.add("open");
}
function closeModalBox(){ document.getElementById("modal")?.classList.remove("open"); }















const ARR='<span class="arr" aria-hidden="true">&gt;</span>';
const ICO_STAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.2l2.7 5.5 6 .9-4.35 4.2 1.03 6L12 17.9 6.62 19.8l1.03-6L3.3 9.6l6-.9z"/></svg>';
 
const EASYCART={ lekcja:EASYCART_URL, zespol:EASYCART_URL, polkolonie:EASYCART_URL, voucher:EASYCART_URL };
 






const WELCOME_ZENCAL_INTRO=["We are here to hear your voice.","We are glad we will soon meet you."];
const WELCOME_ZENCAL_FREE=WELCOME_ZENCAL_INTRO.concat(["Fill in a short form before the POZNAJMY SIĘ | (1:1) online conversation and reserve a date that suits you."]);
const WELCOME_ZENCAL_PAID=WELCOME_ZENCAL_INTRO.concat(["Fill in a short form before your FUNDAMENTY | Assessment (1:1) offline meeting and book a time that suits you."]);
 
const WELCOME_ZENCAL_OUTRO="See you soon!";
const WELCOME_ZENCAL_CTA="Continue to book the meeting";

let currentEntry=null;    
let pendingThx=null;      

function entryCharsHTML(chars){
  return (chars||[]).filter(c=>c&&isData(c.text)).map(c=>
    `<div class="lcchar"><span class="lcchar__ico">${c.icon||ICO_STAR}</span><span>${c.text}</span></div>`).join("");
}
 
function openEntry(ctx){
  if(!ctx) return;
  currentEntry=ctx;
  if(ctx.track&&window.TNMTrack) TNMTrack("content_view",ctx.track);    
  const A=ctx.variant!=="B";
  const photo=isData(ctx.photo)?ctx.photo:"";
   
  




  const media=`<div class="lcpopup__media">
      <span class="lcpopup__media-bg bw" style="${photo?`background-image:url('${photo}')`:""}"></span>
      <span class="lcpopup__logo"><img src="${THX_LOGO}" alt="The Noise Makers"></span>
      <button class="btn lcpopup__cta" type="button" data-entry-go>${ctx.ctaLabel||"Zapisz się"} ${ARR}</button>
    </div>`;
  let body;
  if(A){
    const chars=entryCharsHTML(ctx.chars);
     
    const priceBlock=(ctx.prices&&ctx.prices.length)
      ? `<div class="lcpopup__prices">`+ctx.prices.map((p,idx)=>`<span class="lcpopup__price-line${idx===ctx.prices.length-1?" lcpopup__price-line--main":""}">${p}</span>`).join("")+`</div>`
      : (isData(ctx.price)?`<div class="lcpopup__price">${ctx.price}</div>`:"");
    const descBlock=isData(ctx.descHTML)?`<div class="lcpopup__rich">${ctx.descHTML}</div>`
      : (isData(ctx.desc)?`<p class="lcpopup__desc">${ctx.desc}</p>`:"");
    body=`<div class="lcpopup__panel">
        <div class="lcpopup__head">
          <h2 class="lcpopup__title">${ctx.title||""}</h2>
          ${descBlock}
        </div>
        ${chars?`<div class="lcpopup__chars">${chars}</div>`:""}
        ${priceBlock}
      </div>`;
  }else{
    const note=ctx.priceNote?`<span class="lcpopup__pricenote">${ctx.priceNote}</span>`:"";
    const price=isData(ctx.price)?`<span class="lcpopup__price">${ctx.price}</span>`:"";
    const pricewrap=(note||price)?`<div class="lcpopup__pricewrap">${note}${price}</div>`:"";
    








     
    const paras=Array.isArray(ctx.desc)?ctx.desc.filter(Boolean):String(ctx.desc||"").split("|").map(t=>t.trim()).filter(Boolean);
    const descBlock=paras.length?paras.map(t=>`<p class="lcpopup__desc">${t}</p>`).join(""):"";
    body=`<div class="lcpopup__panel lcpopup__panel--welcome">
        <div class="lcpopup__head">
          <h2 class="lcpopup__title">${ctx.title||""}</h2>
          ${descBlock}
        </div>
        ${pricewrap}
        <div class="lcpopup__panelcta"><button class="btn" type="button" data-entry-go>${ctx.ctaLabel||"Zapisz się"} ${ARR}</button></div>
        ${isData(ctx.outro)?`<p class="lcpopup__desc lcpopup__outro">${ctx.outro}</p>`:""}
      </div>`;
  }
   
   
  const mediaB=media.replace(/<button class="btn lcpopup__cta"[\s\S]*?<\/button>/,"");
  const inner=A?(body+media):(mediaB+body);
  


  openModal(`<div class="lcpopup lcpopup--${A?"a":"b"}${ctx.surface?` lcpopup--s-${ctx.surface}`:""}">
    <div class="lcpopup__bar"><span class="lcpopup__bartitle">${ctx.mastheadTitle||ctx.title||"Zapisz się"}</span><button class="lcpopup__barx" type="button" data-entry-close aria-label="Zamknij">×</button></div>
    <div class="lcpopup__main">${inner}</div>
    <button class="btn lcpopup__pin" type="button" data-entry-go>${ctx.ctaLabel||"Zapisz się"} ${ARR}</button>
  </div>`,"modal__box--entry");
}



function thxOpts(ctx){
  const t=ctx&&ctx.thx; if(!t||!isData(t.photo)) return null;
  return {thxPhoto:t.photo, thxPhotoAlt:t.zajecieLabel||null};
}

 
function routeStep2(ctx){
  if(!ctx) return;
  closeModalBox();
  const n=ctx.next||{};
  if(n.kind==="zencal"){
    pendingThx=ctx.thx||null;                  
    openBooking(n.key||"free",{locked:true});
  }else if(n.kind==="form"){
    pendingThx=null;                           
     
    const pf=Object.assign({},n.zajecie?{zajecie:n.zajecie}:null,n.prefill||null);
     
    TNMIntake.open(n.schema||"pelny",ctx.trigger||null, Object.keys(pf).length?pf:null, thxOpts(ctx));
  }else if(n.kind==="waitlist"){
    pendingThx=null;                           
     
    TNMIntake.open(n.schema||"waitlist-male-grupy",ctx.trigger||null,{typ_zajec:n.typ,zajecie:n.zajecie,audience:audienceNow()},thxOpts(ctx));
  }else if(n.kind==="easycart"){
    const url=EASYCART[n.product]||EASYCART_URL||"#easycart";
    if(/^https?:/i.test(url)){ pendingThx=ctx.thx||null; location.href=url; }
    else { openThanks(ctx.thx||{surface:"zajecia",button:false}); }  
  }
}

 
const THX_PHOTO="../assets/img/figma/popup-poznajmy/popup-kajetan-a.png";  


















const THX_FIGMA="../assets/img/figma/thx/";
const THX_PHOTO_DZIECI=THX_FIGMA+"thx-zajecia-dzieci.webp";
const THX_PHOTO_DOROSLI=THX_FIGMA+"thx-zajecia-dorosli.webp";


const THX_PHOTO_NEUTRAL=THX_FIGMA+"thx-kobieta-wprost.webp";
const THX_PHOTO_SURFACE={
  formularz:  THX_PHOTO_NEUTRAL,                     
  hero:       THX_PHOTO_NEUTRAL,                     
  konsultacja:THX_PHOTO_NEUTRAL,                     
  polkolonie: THX_FIGMA+"thx-polkolonie.webp",        
  warsztaty:  THX_FIGMA+"thx-warsztaty.webp",         
  voucher:    THX_FIGMA+"thx-voucher.webp",           
  partnerzy:  THX_FIGMA+"thx-partnerzy.webp"          
};
 
const THX_PHOTO_SURFACE_AUD={
  zespoly:  { dzieci:THX_FIGMA+"thx-zespoly-dzieci.webp",  dorosli:THX_FIGMA+"thx-zespoly-dorosli.webp" },   
  zajecia:  { dzieci:THX_PHOTO_DZIECI,                    dorosli:THX_PHOTO_DOROSLI }                      
};


function thxPhoto(surface,aud){
  const pair=surface&&THX_PHOTO_SURFACE_AUD[surface];
  if(pair&&aud&&pair[aud]) return pair[aud];
  if(surface&&THX_PHOTO_SURFACE[surface]) return THX_PHOTO_SURFACE[surface];
  if(aud==="dorosli") return THX_PHOTO_DOROSLI;
  if(aud==="dzieci")  return THX_PHOTO_DZIECI;
  return THX_PHOTO_NEUTRAL;
}




const THX_LOGO="../assets/img/logo/sygnet-red-square-white.png";
const THX={
  



  konsultacja:{title:"Thank you",paras:["for your answers and for booking a date for our meeting.","We are glad we will soon meet you.","We also ask you to fill in the details that matter to us - they help us prepare well for our arranged meeting and recommend the right classes.","We invite you to:"],button:{label:"Completing the form",intake:"pelny"}},
  formularz:{title:"Thank you",paras:["for your submission. We are already going through your answers.","We will match classes and Tutors to your needs and come back to you with a proposal. We usually reply within 72 hours.","Talk soon!"]},
  warsztaty:{title:"You are on the list.",paras:["Thank you. We have added you to the waiting list for adult workshops.","You will be the first to know when dates appear.","See you soon."]},  
  wydarzenia:{title:"Thank you for your submission",paras:["We are glad you want to be with us when we start hosting events.","We will let you know as soon as new dates appear.","See you soon!"]},  
  polkolonie:{title:"Thank you for your purchase.",paras:["We are glad we will soon meet your child and share a one-of-a-kind holiday together. Exciting times ahead!","See you soon."]},
  zajecia:{title:"Thank you for your purchase.",paras:["We are glad we will soon see you in class. Exciting times ahead!","See you soon."]},    
  zespoly:{title:"Thank you for your purchase.",paras:["We are glad you will soon join the ensemble. Exciting times ahead!","See you soon."]},       
  voucher:{title:"Thank you for buying a Voucher.",paras:[
    "We are glad we will soon meet someone close to you.",
    "We will do our very best so that every step we take together carries joy and the satisfaction of a deeper sense of self through the experience of art.",
    "See you soon.",
    'If a question is still playing inside you with no answer, we are here:<br><a class="thxcard__link" href="mailto:jestem@thenoisemakers.pl">jestem@thenoisemakers.pl</a>'
  ]},
  partnerzy:{title:"Thank you for your interest in working with The Noise Makers.",paras:["We have received your enquiry and will look at it shortly.","We invite you to get to know our space. Creating together gives change and growth more power.",'<a class="thxcard__link" href="https://www.instagram.com/thenoisemakers.pl" target="_blank" rel="noopener">I want to read about you</a>',"Thank you."]}    
};
















const TNM_WAIT_TITLE = "We are processing your enquiry.";
const TNM_WAIT_SUB = "This may take a few seconds.";
window.TNMWait = (function(){
  let timer = null;
  function el(){
    let e = document.getElementById("tnm-wait"); if(e) return e;
    e = document.createElement("div");
    e.id = "tnm-wait"; e.className = "tnm-wait";
    e.setAttribute("role","status"); e.setAttribute("aria-live","polite");
    e.innerHTML = '<div class="tnm-wait__card" aria-busy="true">'
      + '<div class="tnm-wait__anim" aria-hidden="true">'
      + '<span class="tnm-wait__ring"></span><span class="tnm-wait__ring tnm-wait__ring--2"></span>'
      + '<span class="tnm-wait__sygnet">TNM</span></div>'
      + '<p class="tnm-wait__title"></p><p class="tnm-wait__sub"></p></div>';
    document.body.appendChild(e);
    return e;
  }
  

  function show(o){
    o = o || {};
    const e = el();
    const t = e.querySelector(".tnm-wait__title"), s = e.querySelector(".tnm-wait__sub");
    if(t) t.textContent = o.title || TNM_WAIT_TITLE;
    if(s) s.textContent = o.sub || TNM_WAIT_SUB;
    if(timer){ clearTimeout(timer); timer = null; }
    e.classList.add("open");
    document.body.classList.add("tnm-wait-lock");
    const ms = Number(o.timeout) > 0 ? Number(o.timeout) : 30000;
    timer = setTimeout(function(){ hide(); if(typeof o.onTimeout === "function") o.onTimeout(); }, ms);
  }
  

  function hide(){
    if(timer){ clearTimeout(timer); timer = null; }
    const e = document.getElementById("tnm-wait");
    if(e && e.classList.contains("open")){
      e.classList.remove("open");
      document.body.classList.remove("tnm-wait-lock");
    }
  }
  return { show, hide };
})();

function openThanks(thx){
  if(window.TNMWait) TNMWait.hide();    
  thx=thx||{};
  const s=THX[thx.surface]||THX.zajecia;
  const wantBtn=thx.button!==undefined?thx.button:!!s.button;
   
   
  const photo=isData(thx.photo)?thx.photo:thxPhoto(thx.surface,thx.audience||audienceNow());
  const text=s.html?`<p>${s.html}</p>`:(s.paras||[]).map(p=>`<p>${p}</p>`).join("");
  const btn=(wantBtn&&s.button)
    ?`<div class="thxcard__cta"><a class="btn" href="${FORM_URL}" data-intake="${s.button.intake||"pelny"}">${s.button.label} ${ARR}</a></div>`:"";
   
   
  openModal(`<div class="thxcard">
    <div class="thxcard__media">
      <span class="thxcard__media-bg bw" role="img" aria-label="${(isData(thx.photoAlt)?thx.photoAlt:"The Noise Makers")}" style="background-image:url('${photo}')"></span>
      <span class="thxcard__logo"><img src="${THX_LOGO}" alt="The Noise Makers"></span>
    </div>
    <div class="thxcard__body">
      <h2 class="thxcard__title">${s.title}</h2>
      <div class="thxcard__text">${text}</div>
      ${btn}
    </div>
  </div>`,"modal__box--thx");
}




const KONS_PHOTO={
  poznajmy:"../assets/img/figma/konsultacje/dorosli/kons-dorosli-1.png",
  fundamenty:"../assets/img/figma/konsultacje/dorosli/kons-dorosli-2.png",
  napisz:"../assets/img/figma/konsultacje/dorosli/kons-dorosli-3.png"
};
 
 
const KONS_PHOTO_DZIECI={
  poznajmy:"../assets/img/figma/konsultacje/dzieci/kons-dzieci-tile-poznajmy.webp",
  fundamenty:"../assets/img/figma/konsultacje/dzieci/kons-dzieci-tile-fundamenty.webp",
  napisz:"../assets/img/figma/konsultacje/dzieci/kons-dzieci-tile-napisz.webp"
};
const ENTRY={
   
  










  "kons-poznajmy":()=>({variant:"B",mastheadTitle:"Book a meeting",title:"Hi,",desc:WELCOME_ZENCAL_FREE,
    outro:WELCOME_ZENCAL_OUTRO,
    priceNote:"free",price:"0 zł",photo:THX_PHOTO_NEUTRAL,ctaLabel:WELCOME_ZENCAL_CTA,
    next:{kind:"zencal",key:"free"},thx:{surface:"konsultacja",button:true}}),
  "kons-fundamenty":()=>({variant:"B",mastheadTitle:"Book a meeting",title:"Hi,",desc:WELCOME_ZENCAL_PAID,
    outro:WELCOME_ZENCAL_OUTRO,
    priceNote:"paid",price:"899 zł",photo:THX_PHOTO_NEUTRAL,ctaLabel:WELCOME_ZENCAL_CTA,
    next:{kind:"zencal",key:"paid"},thx:{surface:"konsultacja",button:true}}),
   
  "kons-napisz":()=>({variant:"B",mastheadTitle:"Sign-up form",title:"Write to us",
    desc:"Leave us a few details about yourself or your child and we will match classes and Tutors to your needs. We will come back with a proposal.",
    photo:KONS_PHOTO.napisz,ctaLabel:"Sign up",next:{kind:"form",schema:"pelny"},thx:{surface:"formularz",button:false}}),
   
   
  "home-formularz":()=>({variant:"B",mastheadTitle:"Sign-up form",title:"We are here to hear your voice.",
    desc:"Leave us a few details about yourself or your child and we will match classes and Tutors to your needs. We will come back with a proposal.",
    photo:THX_PHOTO,ctaLabel:"Sign up",next:{kind:"form",schema:"pelny"},thx:{surface:"formularz",button:false}}),
   
  "home-hero-skrocony":()=>({variant:"B",mastheadTitle:"Sign-up form",title:"We are here to hear your voice.",
    desc:"Leave us a few details and we will find the right classes and Tutors for you or your child. We will come back with a proposal.",
    photo:THX_PHOTO,ctaLabel:"Sign up",next:{kind:"form",schema:"hero"},thx:{surface:"hero",button:false}}),
   
  "pinned-pelny":()=>({variant:"B",mastheadTitle:"Sign-up form",title:"We are here.",
    desc:"Tell us about yourself or your child - we will match classes and Tutors to your needs and come back with a proposal.",
    photo:THX_PHOTO,ctaLabel:"Sign up",next:{kind:"form",schema:"pelny"},thx:{surface:"hero",button:false}}),
   
  "voucher":()=>({variant:"A",mastheadTitle:"Voucher",title:"Voucher",
    desc:"Take care of your loved ones. Invite someone special to classes or an assessment as a GIFT.",
    chars:[{icon:GIFT_MINI,text:"A flexible gift - the recipient chooses"},{icon:META_ICON.calendar,text:"Valid for 12 months"},{icon:ICO_STAR,text:"Classes 1:1 · “Fundamentals” assessment"}],
    photo:THX_PHOTO,ctaLabel:"Order a VOUCHER",next:{kind:"easycart",product:"voucher"},thx:{surface:"voucher",button:false}})
};
const GIFT_MINI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8s-2.5-5-5-5-2 4 5 5zM12 8s2.5-5 5-5 2 4-5 5z"/></svg>';
 
function lessonEntryCtx(i,kind){
  const chars=[];
  if(isData(i.godz)) chars.push({icon:META_ICON.clock,text:i.godz.replace(/\n/g," · ")});
  if(kind==="polkolonie"){
    if(isData(i.turnus)) chars.push({icon:META_ICON.calendar,text:i.turnus});
    if(isData(i.wiek)) chars.push({icon:META_ICON.person,text:i.wiek+(isData(i.miejsca)?` (${i.miejsca})`:"")});
  }else{
    if(isData(i.dni_daty)) chars.push({icon:META_ICON.calendar,text:i.dni_daty});
    const grupa=isData(i.miejsca)?i.miejsca:prowadzenie(i.format);
    if(grupa) chars.push({icon:META_ICON.person,text:grupa});
  }
  if(isData(i.lokalizacja)) chars.push({icon:META_ICON.pin,text:i.lokalizacja});
  const desc=isData(i.opis_popup)?i.opis_popup:(isData(i.opis)?i.opis:"");
  const photo=isData(i.foto_link)?i.foto_link:(kind==="polkolonie"
    ?"../assets/img/figma/polkolonie/polkolonie-card-wakacje.webp"
    :"../assets/img/zajecia/"+(kind==="zespol"?ZAJ_FALLBACK:zajPhoto(i))+".png");
   
   
  const isMalaGrupa=kind==="lekcja" && /grup/i.test(i.format||"");
  const is1na1=kind==="lekcja" && !isMalaGrupa;    
  const isWaitlist=kind==="zespol"||isMalaGrupa;
  const cta=isWaitlist?"Join the waiting list":(kind==="zespol"?"Join":"Sign up");
  const surface=kind==="zespol"?"zespoly":(kind==="polkolonie"?"polkolonie":"zajecia");
   
   
   
   
   
   
   
  const turnusTrwa=kind==="polkolonie"&&isData(i.turnus)&&!turnusSellable(i.turnus);
  const next=isWaitlist
    ? {kind:"waitlist",schema:(kind==="zespol"?"waitlist-zespolowe":"waitlist-male-grupy"),typ:(kind==="zespol"?"zespolowe":"male-grupy"),zajecie:i.nazwa}
    : is1na1
      ? {kind:"form",schema:"zajecia-1na1",zajecie:i.nazwa_id||i.nazwa}    
      : (turnusTrwa||POL2027)
        ? {kind:"form",schema:"pelny"}    
        : (kind==="polkolonie"&&(i.typ||"Półkolonie")==="Półkolonie")
          ? {kind:"form",schema:"polkolonie",prefill:{turnus_hint:isData(i.turnus)?i.turnus:null}}
          : {kind:"easycart",product:kind==="polkolonie"?"polkolonie":"lekcja"};
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
  let prices=null, descHTML=null;
  if(kind==="zespol"||isMalaGrupa){
    const lekcja=fmtKwota(i.cena_lekcji), laczna=fmtKwota(i.cena_laczna), karnet=fmtKwota(i.cena_karnet);
    const linie=[];
    if(lekcja) linie.push(`A single class ${lekcja}`);
    if(laczna&&laczna!==lekcja) linie.push(`Workshop day ${laczna}`);
    if(karnet) linie.push(`${karnet} / month`);
    prices=linie.length?linie:null;
  }
   
  if(kind==="polkolonie"){
    const paras=[].concat(i.intro||[]).map(p=>`<p>${p}</p>`).join("");
    const list=(i.laczy&&i.laczy.length)?`<p><strong>${i.laczy_label||"To wakacje, które łączą:"}</strong></p><ul>${i.laczy.map(x=>`<li>${x}</li>`).join("")}</ul>`:"";
    const dc=(i.dla_ciebie&&i.dla_ciebie.length)?`<p><strong>${i.dla_ciebie_label||"A dla Ciebie?"}</strong></p>`+i.dla_ciebie.map(p=>`<p>${p}</p>`).join(""):"";
    const rich=paras+list+dc; if(rich) descHTML=rich;
    prices=[]; if(isData(i.rabat)) prices.push(i.rabat); if(isData(i.cena)) prices.push(i.cena);
    if(!prices.length) prices=null;
  }
   
  if(turnusTrwa){
    descHTML=(descHTML||`<p>${desc}</p>`)+`<p class="lcpopup__trwa"><strong>This session has already started</strong> - ${TURNUS_TRWA_MSG}. You can buy a single day of attendance at any point while the session runs.</p>`;
    prices=null;
  }
  

  if(POL2027&&kind==="polkolonie") prices=null;
  




  return {variant:"A",mastheadTitle:fmtNazwa(i),title:fmtNazwa(i),desc,descHTML,prices,chars:chars.slice(0,4),
    track:{content_name:i.nazwa_id||i.nazwa, content_category:kind, audience:audienceNow()},    
    price:(isWaitlist||turnusTrwa||(POL2027&&kind==="polkolonie"))?null:(isData(i.cena)?i.cena:null),photo,    
    ctaLabel:turnusTrwa?"Write to us":cta,
     
    next,thx:{surface,button:false,photo,zajecieLabel:fmtNazwa(i),photoAlt:fmtNazwa(i)}};
}



























const BOOK_LOCALE=(document.documentElement.lang||"pl").toLowerCase().startsWith("en")?"en":"pl";
const BOOK_SLUGS={
  pl:{free:"rozmowa15min",paid:"fundamenty-diagnostyka"},
  


  en:{free:"freeconsultation15min-en",paid:"fundamenty-diagnostyka-en"}
};
const BOOK_EVENTS={
  free:{slug:BOOK_SLUGS[BOOK_LOCALE].free,owner:"the-noise-makers-welcome",type:"t",primary:"#E20900",secondary:"#FFFFFF",contentBg:"#F4EFE8",contentText:"#2E2E2E",textColor:"#2E2E2E",hideDetails:"1",avatar:"../assets/img/figma/logo-tnm-sygnet.png",lang:BOOK_LOCALE,ampm:"0"},
  paid:{slug:BOOK_SLUGS[BOOK_LOCALE].paid,owner:"the-noise-makers-welcome",type:"t",primary:"#E20900",secondary:"#FFFFFF",contentBg:"#F4EFE8",contentText:"#2E2E2E",textColor:"#2E2E2E",hideDetails:"1",avatar:"../assets/img/figma/logo-tnm-sygnet.png",lang:BOOK_LOCALE,ampm:"0"}
};








const BOOK_ZENCAL_SRC="https://app.zencal.io/js/embed.js?v=4.2.2";

























const BOOK_SHADOW_CSS=`
#zencal-embed-booking-view-container{padding:10px 12px 14px !important}
#zencal-embed-booking-view-container [class*="MuiBox-root"]:has(> img){display:none !important}
[class*="date-button-selected"],[class*="hour-list-item-selected"],[class*="hour-list-item-check-icon"]{background:#E20900 !important;color:#ffffff !important;stroke:#ffffff !important}
[class*="hour-list-item"]:not([class*="selected"]):not([class*="check-icon"]){color:#2E2E2E !important}`;
 
function injectBookShadow(host){
  if(!host) return;
  let n=0;
  const iv=setInterval(function(){
    n++;
    const sr=host.shadowRoot;
    if(sr && !sr.querySelector("style[data-tnm-shadow]")){
      const st=document.createElement("style");
      st.setAttribute("data-tnm-shadow","1");
      st.textContent=BOOK_SHADOW_CSS;
      sr.appendChild(st);
    }
    if(n>60) clearInterval(iv);
  },500);
}
const BOOK_ICO_SCREEN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="4" width="19" height="12" rx="1"/><path d="M1.5 20h21"/></svg>';
const BOOK_ICO_PEOPLE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2 19c0-3 2.7-5 6-5s6 2 6 5"/><path d="M15 19c0-2 1.3-3.6 3.4-3.6S22 17 22 19"/></svg>';

const BOOKING=`<div class="booking" id="booking" role="dialog" aria-modal="true" aria-labelledby="booking-title" hidden>
  <div class="booking__card" role="document">
    <div class="booking__crown">
      <img class="booking__logo" src="../assets/img/figma/logo-tnm-white.png?v=20260616" alt="The Noise Makers">
      <span class="booking__title" id="booking-title">Book a meeting</span>
      <button class="booking__close" type="button" data-book-close aria-label="Zamknij okno">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="booking__tabs" role="tablist" aria-label="Rodzaj spotkania">
      <button class="booking-tab" role="tab" id="booktab-free" aria-controls="bookpanel-free" aria-selected="true" data-event="free">
        <span class="booking-tab__ico">${BOOK_ICO_SCREEN}</span>
        <span class="booking-tab__txt"><span class="booking-tab__name">Let's meet</span><span class="booking-tab__meta">15 min · online <span class="badge-soft">Free</span></span></span>
      </button>
      <button class="booking-tab" role="tab" id="booktab-paid" aria-controls="bookpanel-paid" aria-selected="false" data-event="paid">
        <span class="booking-tab__ico">${BOOK_ICO_PEOPLE}</span>
        <span class="booking-tab__txt"><span class="booking-tab__name">„Fundamentals" assessment</span><span class="booking-tab__meta">45 min · at our place <span class="booking-tab__price">899 zł</span></span></span>
      </button>
    </div>
    <div class="booking__body">
      <section class="booking-panel is-active" id="bookpanel-free" role="tabpanel" aria-labelledby="booktab-free">
        <div class="booking-split">
          <div class="booking-aside">
            <div class="booking-aside__lead">
              <h3 class="booking-hero__title">Let's meet</h3>
            </div>
            <dl class="booking-spec">
              <div class="booking-spec__row"><dt>Where</dt><dd>1:1 conversation online</dd></div>
              <div class="booking-spec__row"><dt>Time</dt><dd>15 min</dd></div>
              <div class="booking-spec__row"><dt>Outcome</dt><dd>Initial recommendations</dd></div>
              <div class="booking-spec__row"><dt>Price</dt><dd class="booking-spec__price">Free</dd></div>
            </dl>
            <div class="booking-aside__desc">
              <p class="booking-hero__text">During the conversation we get to know the person joining the classes, which gives us a first sense of what is needed.</p>
              <p class="booking-hero__text">The „Let's meet" conversation also opens the way to a deeper reading of what that person needs, through the 1:1 „Fundamentals" assessment.</p>
            </div>
            <div class="booking-aside__steps">
              <p class="booking-hero__steps-h">Next steps</p>
              <ol class="booking-steps">
                <li>Choose the date and time of the online meeting that suits you.</li>
                <li>Let's talk - answer a few questions from us. It only takes a short while, and it helps us take care of the quality of our meeting.</li>
                <li>Book the meeting.</li>
                <li>We will set up your booking and confirm it.</li>
                <li>You will get an email from TNM confirming the booking and the date, together with the link to the meeting.</li>
              </ol>
              <p class="booking-steps__end">We will meet online soon. Thank you!</p>
            </div>
            <div class="booking-aside__deliver">
              <p class="booking-hero__steps-h">What do you get?</p>
              <p class="booking-deliver__lead">Within 72 h of the conversation you will get from us:</p>
              <ul class="booking-deliver">
                <li>A list of initially recommended classes</li>
                <li>The natural strengths that stand out</li>
              </ul>
            </div>
          </div>
          <div class="booking-stage">
            <div class="booking-embed" data-embed="free"></div>
          </div>
        </div>
      </section>
      <section class="booking-panel" id="bookpanel-paid" role="tabpanel" aria-labelledby="booktab-paid">
        <div class="booking-split">
          <div class="booking-aside">
            <div class="booking-aside__lead">
              <h3 class="booking-hero__title">„Fundamentals" assessment</h3>
            </div>
            




            <dl class="booking-spec">
              <div class="booking-spec__row"><dt>What</dt><dd>1:1 meeting, 45 min</dd></div>
              <div class="booking-spec__row"><dt>Where</dt><dd>Warsaw, Wiertnicza 141</dd></div>
              <div class="booking-spec__row"><dt>Outcome</dt><dd>Recognising natural strengths and challenges</dd></div>
              <div class="booking-spec__row"><dt>Goal</dt><dd>Class and Tutor recommendations</dd></div>
              <div class="booking-spec__row"><dt>Price</dt><dd class="booking-spec__price">899 zł</dd></div>
              



              <div class="booking-spec__row"><dt>Date</dt><dd class="booking-spec__note">You can move the date of the assessment once, and no later than 3 days before the meeting.</dd></div>
            </dl>
            <div class="booking-aside__desc">
              <p class="booking-hero__text">During the meeting and a detailed assessment, we get to know the natural strengths of the person signed up for the assessment.</p>
              <p class="booking-hero__text">Through exercises drawn from psychology, art, general development tools and body movement, we get to know the Student. Their resources and the areas that ask to be noticed.</p>
            </div>
            <div class="booking-aside__steps">
              <p class="booking-hero__steps-h">Next steps</p>
              <ol class="booking-steps">
                <li>Choose the date and time of the meeting that suits you.</li>
                <li>Let's talk - answer a few questions from us. It takes a few minutes, and it lets us prepare for our meeting.</li>
                <li>Book the meeting and make the payment.</li>
                

                <li>We will set up your booking and confirm it once the payment has arrived.</li>
                <li>You will get an email from TNM confirming the booking and the payment.</li>
              </ol>
              <p class="booking-steps__end">We will meet soon at Wiertnicza 141. Thank you!</p>
            </div>
            <div class="booking-aside__deliver">
              <p class="booking-hero__steps-h">What do you get?</p>
              <p class="booking-deliver__lead">Within 7 days of your „Fundamentals" assessment you will get from us:</p>
              <ul class="booking-deliver">
                

                <li>A list of the Student's natural strengths and of the areas that need attention</li>
                <li>A recommended list of classes (areas: psychological, educational, artistic, developmental)</li>
                <li>Recommended Tutors</li>
                <li>Recommended tools that support growth</li>
              </ul>
            </div>
          </div>
          







          




          <div class="booking-stage" data-stage="paid">
            <div class="booking-embed" data-embed="paid"></div>
          </div>
        </div>
      </section>
    </div>
    <div class="booking__foot">
      <span class="booking__feel">Feel the he<span class="art">art</span></span>
    </div>
  </div>
</div>`;

let bookEmbedsBuilt=false, bookScriptAppended=false, bookLastFocus=null;





const BOOK_TILE_TITLE='The calendar is waiting for your “yes”';
const BOOK_TILE_TEXT="To choose a date, we turn on the ZenCal calendar. It will save its own settings in your browser: language and view state. One click and you can book.";
const BOOK_TILE_BTN="Turn on the calendar";
const BOOK_TILE_NOTE="We explain how to undo this in Cookies.";
function bookConsentOk(){ return !!(window.TNMConsent && window.TNMConsent.get().functional); }
function bookTileHTML(){
  const cook=(window.TNMLegal&&window.TNMLegal.urls&&window.TNMLegal.urls.cookies)||"../cookies.html";
  return `<div class="consent-tile" data-book-tile>
    <p class="consent-tile__title">${BOOK_TILE_TITLE}</p>
    <p class="consent-tile__text">${BOOK_TILE_TEXT}</p>
    <button class="btn consent-tile__btn" type="button" data-book-consent>${BOOK_TILE_BTN}</button>
    <p class="consent-tile__note t-sm"><a href="${cook}" target="_blank" rel="noopener">${BOOK_TILE_NOTE}</a></p>
  </div>`;
}
function buildBookingTiles(){
  document.querySelectorAll(".booking-embed").forEach(host=>{
    if(host.querySelector("[data-book-tile]")) return;
    host.innerHTML=bookTileHTML();
    host.querySelector("[data-book-consent]").addEventListener("click",()=>{
      const cur=window.TNMConsent.get();
      window.TNMConsent.set({functional:true,marketing:cur.marketing});
      buildBookingEmbeds();
    });
  });
}
if(window.TNMConsent) window.TNMConsent.onChange(s=>{ if(s.functional && document.querySelector("[data-book-tile]")) buildBookingEmbeds(); });
 
function buildBookingEmbeds(){
  if(bookEmbedsBuilt) return;
  if(!bookConsentOk()){ buildBookingTiles(); return; }    
  bookEmbedsBuilt=true;
  Object.keys(BOOK_EVENTS).forEach(key=>{
    const ev=BOOK_EVENTS[key], host=document.querySelector(`.booking-embed[data-embed="${key}"]`);
    if(!host) return;
    const embed=document.createElement("div");
    embed.className="zencal-embed";
    embed.setAttribute("data-type",ev.type);
    embed.setAttribute("data-owner",ev.owner);
    embed.setAttribute("data-slug",ev.slug);
    embed.setAttribute("data-primary",ev.primary);
    embed.setAttribute("data-secondary",ev.secondary);
    embed.setAttribute("data-content-bg",ev.contentBg);      
    embed.setAttribute("data-content-text",ev.contentText);  
    embed.setAttribute("data-text-color",ev.textColor);      
    embed.setAttribute("data-hide-details",ev.hideDetails);  
    embed.setAttribute("data-avatar",ev.avatar);             
    embed.setAttribute("data-lang",ev.lang);
    embed.setAttribute("data-ampm",ev.ampm);
    host.innerHTML=""; host.appendChild(embed);
    injectBookShadow(embed);    
  });
  if(!bookScriptAppended){
    bookScriptAppended=true;
    const s=document.createElement("script");
    s.async=true; s.src=BOOK_ZENCAL_SRC;    
    document.body.appendChild(s);
  }
}
function selectBookingTab(key){
  const m=document.getElementById("booking"); if(!m) return;
  m.querySelectorAll(".booking-tab").forEach(t=>t.setAttribute("aria-selected",t.dataset.event===key?"true":"false"));
  m.querySelectorAll(".booking-panel").forEach(p=>p.classList.toggle("is-active",p.id===`bookpanel-${key}`));
  m.querySelector(".booking__body").scrollTop=0;
}
function bookFocusables(card){
  return [...card.querySelectorAll('button,[href],input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])')]
    .filter(el=>el.offsetParent!==null||el.tagName==="IFRAME");
}
function onBookKeydown(e){
  const m=document.getElementById("booking"); if(!m) return;
  if(e.key==="Escape"){closeBooking();return;}
  if(e.key!=="Tab") return;
  const f=bookFocusables(m.querySelector(".booking__card")); if(!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
function openBooking(key,opts={}){
  const m=document.getElementById("booking"); if(!m) return;
  bookLastFocus=document.activeElement;
  if(key) selectBookingTab(key);
   
  m.classList.toggle("booking--locked",!!opts.locked);
  buildBookingEmbeds();             
  m.hidden=false; void m.offsetWidth; m.classList.add("is-open");
  document.body.style.overflow="hidden";
  document.addEventListener("keydown",onBookKeydown);
  m.querySelector("[data-book-close]")?.focus();
}


















function openBookingIntro(type){
  const ctx=ENTRY[type==="paid"?"kons-fundamenty":"kons-poznajmy"]();
  openEntry(ctx);
}






function openBookingThanks(type){
  openThanks({surface:"konsultacja",button:true});
}
function closeBooking(){
  const m=document.getElementById("booking"); if(!m) return;
  m.classList.remove("is-open");
  document.body.style.overflow="";
  document.removeEventListener("keydown",onBookKeydown);
  let fallback;
  const done=()=>{clearTimeout(fallback);m.hidden=true;m.removeEventListener("transitionend",done);};
  m.addEventListener("transitionend",done);
  fallback=setTimeout(done,400);    
  if(bookLastFocus&&bookLastFocus.focus) bookLastFocus.focus();
}


function openTerminModal(active=0){ openBookingIntro(active===1?"paid":"free"); }
function initBooking(){
  const m=document.getElementById("booking"); if(!m) return;
  m.addEventListener("click",e=>{ if(e.target.closest("[data-book-close]")) closeBooking(); });  
  



  m.querySelectorAll(".booking-tab").forEach(t=>t.addEventListener("click",()=>selectBookingTab(t.dataset.event)));
}

async function loadData(){
  const r=await fetch("../data/content.en.json"); return r.json();
}
function isData(v){return v && v!=="[NO DATA]";}





function fmtKwota(n){
  if(n===null||n===undefined||n==="") return null;
  const v=Number(n); if(!isFinite(v)) return null;
  return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" zł";
}

 
function renderTeam(data, el){
  


  el.innerHTML = data.zespol.filter(t=>t.name && t.img && !t._off).map(t=>`
    <div class="person-card" data-name="${t.name}">
      <div class="person-card__img bw" style="background-image:url('${t.img}')"></div>
      <div class="person-card__info">
        <div class="person-card__nr">
          <h3>${t.name.replace(/\s+/g," ").trim()}</h3>
          <div class="person-card__role">${t.rola_krotka||""}</div>
        </div>
        ${isData(t.cytat)?`<p class="person-card__quote">${t.cytat.replace(/[„"]/g,"")}</p>`:""}
        <span class="person-card__more">More <span aria-hidden="true">&rsaquo;</span></span>
      </div>
    </div>`).join("");
  el.querySelectorAll(".person-card").forEach(c=>c.onclick=()=>{
    const t=data.zespol.find(x=>x.name===c.dataset.name);
    openTeamPopup(t);
  });
  

  const who=new URLSearchParams(location.search).get("osoba");
  if(who){ tnmDropParams(["osoba"]); const w=tnmSlug(who);
    const t=data.zespol.find(x=>x.name&&x.img&&!x._off&&tnmSlug(x.slug||x.name)===w); if(t) openTeamPopup(t); }
}




const ICO_USER='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="7" r="3.2"/><path d="M4.5 20c0-3.3 3.2-5.4 7.5-5.4s7.5 2.1 7.5 5.4"/></svg>';
const ICO_GROUP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8.5" cy="8" r="2.8"/><circle cx="16.5" cy="8.5" r="2.3"/><path d="M2.5 19c0-2.8 2.6-4.6 6-4.6s6 1.8 6 4.6"/><path d="M14.8 14.9c2.7.1 4.7 1.7 4.7 4.1"/></svg>';
function openTeamPopup(t){
  if(window.TNMTrack) TNMTrack("content_view",{content_name:t.slug||t.name, content_category:"osoba"});    
  const bio=isData(t.bio)?t.bio:(isData(t.zajecia_long_popup)&&t.zajecia_long_popup!==t.rola_krotka?t.zajecia_long_popup:"");
   
  const quote=isData(t.cytat_popup)?t.cytat_popup:(isData(t.cytat)?t.cytat:"");
  const indyw=isData(t.zajecia_indywidualne)?t.zajecia_indywidualne:null;
  const grup=isData(t.zajecia_grupowe)?t.zajecia_grupowe:null;
  const fallbackRole=(!indyw&&!grup&&t.rola_krotka)?t.rola_krotka:null;
   
   
   
   
  const popupImg=isData(t.img_popup)?t.img_popup:(isData(t.foto_popup_link)?t.foto_popup_link:(t.img||""));
   
   
   
  openModal(`<div class="tpopup">
    <div class="tpopup__bar"><span class="tpopup__barlabel">Let's meet</span><button type="button" class="tpopup__barx" aria-label="Zamknij">&times;</button></div>
    <div class="tpopup__panel">
      <h2 class="tpopup__name">${t.name.trim()}</h2>
      <div class="tpopup__row">
        ${quote?`<p class="tpopup__quote">${quote.replace(/[„"]/g,"").replace(/\n/g,"<br>")}</p>`:`<p class="tpopup__quote muted"></p>`}
        <div class="tpopup__chars">
          ${indyw?`<div class="tchar">${ICO_USER}<div><strong>One-to-one classes</strong><span>${indyw}</span></div></div>`:""}
          ${grup?`<div class="tchar">${ICO_GROUP}<div><strong>Group classes</strong><span>${grup}</span></div></div>`:""}
          ${fallbackRole?`<div class="tchar">${ICO_USER}<div><strong>Classes</strong><span>${fallbackRole}</span></div></div>`:""}
        </div>
      </div>
      ${bio?`<div class="tpopup__bio">${bio.split(/\n\n+/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join("")}</div>`:""}
    </div>
    <div class="tpopup__media bw" style="background-image:url('${popupImg}');background-position:${isData(t.foto_pos)?t.foto_pos:"center 30%"}"></div>
    



    




    ${(indyw||grup)?`<div class="tpopup__cta"><a class="btn" href="${FORM_URL}" data-intake="zajecia-1na1" data-prowadzacy="${t.name.trim()}" data-thx-photo="${popupImg}">Sign up <span aria-hidden="true">&gt;</span></a></div>`:""}
  </div>`,"modal__box--team");
  document.querySelector(".tpopup__barx")?.addEventListener("click",closeModalBox);
}

function renderOpinie(data, el, key){
  let ops=((key?data[key]:data.opinie)||[]).filter(o=>isData(o.cytat));
  if(!ops.length){
     
    const sample={cytat:"The teachers at the TNM school are really kind. In every class I get to learn something new. There is no stress when you do not know something - your teacher will do their best to help you. What I love is that I can choose the pieces I want to play. In class I can also film music videos and learn music production.",
      autor:"Borys",rola:"TNM Student",foto_link:"../assets/img/zespol/zespol_adam-woch.webp"};
    ops=[sample,sample,sample];
  }
  

  el.innerHTML=ops.map(o=>`
    <div class="op-card">
      <div class="op-card__body">
        <p class="op-card__quote">${o.cytat}</p>
        <p class="op-card__author">${o.autor||""}${o.rola?`,<br>${o.rola}`:""}</p>
      </div>
      <div class="op-card__logo"><img src="../assets/img/figma/logo-tnm-white.png?v=20260615" alt="The Noise Makers"></div>
      <div class="op-card__media bw" style="${o.foto_link&&isData(o.foto_link)?`background-image:url('${o.foto_link}')`:''}"></div>
    </div>`).join("");
}








function kblockItems(items){
  if(!items||!items.length) return "";
  return `
        <div class="kblock__items">${items.map(i=>`<div class="kblock__item"><h3 class="kblock__h3">${i.h3}</h3><p>${(i.body||"").replace(/\n/g,"<br>")}</p></div>`).join("")}</div>`;
}
function renderKonsultacjeValues(data, el, key){
  const blocks=data[key||"konsultacje_values"]||[];   
  el.innerHTML=blocks.map(b=>`
    <div class="kblock${b.side==="left"?" kblock--alt":""}">
      <div class="kblock__text">
        <span class="eyebrow">${b.badge}</span>${b.h2?`
        <h2 class="kblock__h2">${b.h2}</h2>`:""}${b.body?`
        <div class="kblock__body">${(b.body||"").split(/\n\n+/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join("")}</div>`:""}${kblockItems(b.items)}
      </div>
      <div class="kblock__media bw"${isData(b.img)?` style="background-image:url('${b.img}')"`:""}></div>
    </div>`).join("");
}




 
const KONS_TILES=[
  {key:"kons-poznajmy", title:"“Let's meet” - Online appointment", cta:"Choose your date", fotoKey:"poznajmy",
   desc:"During the conversation we get to know the person joining the classes, which gives us a first sense of what is needed.",
   chars:[{i:"pin",t:"1:1 online call"},{i:"clock",t:"15 min"},{i:"star",t:"Outcome: initial recommendations"}]},
  


  {key:"kons-fundamenty", title:"“Fundamentals” - 1:1 session", cta:"Choose your date", fotoKey:"fundamenty",
   desc:"During the meeting and a detailed assessment, we get to know the natural strengths of the person signed up for the assessment.",
   chars:[{i:"person",t:"What: 1:1 in-person meeting, 45 min"},
          {i:"pin",t:"Where: Warsaw, Wiertnicza 141"},
          {i:"star",t:"Outcome: recognising natural strengths and challenges"},
          {i:"calendar",t:"Goal: class and Tutor recommendations"}]},
  {key:"kons-napisz", title:"“Write to us” - Form", cta:"Fill in the form", fotoKey:"napisz",
   desc:"Fill in a short form and we will match classes and Tutors to your needs and come back with a proposal.",
   chars:[{i:"pin",t:"Fill in online"},{i:"clock",t:"up to 5 min"},{i:"star",t:"Outcome: TNM recommendations - email"}]}
];
function renderKonsultacjeTiles(el, aud){
  if(!el) return;
  const ph = aud==="dzieci" ? KONS_PHOTO_DZIECI : KONS_PHOTO;   
  const ico={pin:META_ICON.pin,clock:META_ICON.clock,star:ICO_STAR,person:META_ICON.person,calendar:META_ICON.calendar};
  el.innerHTML=KONS_TILES.map(t=>`<article class="zcard zcard--kons">
    <div class="zcard__text">
      <h3 class="zcard__title">${t.title}</h3>
      <p class="zcard__desc">${t.desc}</p>
      <div class="zcard__meta">
        ${t.chars.map(c=>`<span class="zmeta">${ico[c.i]}<span>${c.t}</span></span>`).join("")}
      </div>
    </div>
    <div class="zcard__media">
      <span class="zcard__media-bg bw" style="background-image:url('${ph[t.fotoKey]}')"></span>
      <button class="btn zcard__btn" type="button" data-entry="${t.key}">${t.cta} <span aria-hidden="true">&gt;</span></button>
    </div>
  </article>`).join("");
}

function initCarousels(root=document){
  root.querySelectorAll("[data-carousel]").forEach(c=>{
    const track=c.querySelector(".carousel__track");
    const step=()=>Math.max(280,track.firstElementChild?.getBoundingClientRect().width+26||300);
    c.querySelector("[data-prev]")?.addEventListener("click",()=>track.scrollBy({left:-step(),behavior:"smooth"}));
    c.querySelector("[data-next]")?.addEventListener("click",()=>track.scrollBy({left:step(),behavior:"smooth"}));
  });
}

 
function renderOffer(data, grid, introEl, aud){
  const v=(data.oferta||{})[aud];
  if(!v){grid.innerHTML="";return;}
  if(introEl) introEl.textContent=v.intro;
  grid.classList.toggle("offer-grid--2", v.cards.length===2);
  grid.innerHTML=v.cards.map(c=>`
    <a class="offer-card" href="${c.href}">
      <span class="offer-card__bg bw" style="background-image:url('${c.img}')"></span>
      <span class="offer-card__title">${c.title}</span>
      <span class="badge-tag">${c.badge}</span></a>`).join("");
}

 
const META_ICON={
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 2.5V7M16 2.5V7"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21.5s-7-6.6-7-11.5a7 7 0 1114 0c0 4.9-7 11.5-7 11.5z"/><circle cx="12" cy="9.5" r="2.4"/></svg>'
};


const ZAJ_PHOTOS=["aktorstwo-1-1__1ngaus96","band-maa-grupa__10411kyN","bas__1E-ZGhkV","dubbing-maa-grupa__1HOGVt1q","dyrygentura-1-1__1U26I1Gd","dyrygentura-maa-grupa__1OhYDht6","flet-1-1__11lqerD2","fotografia__1C2ZJt7z","gitara-elektryczna__18de4XGz","gitara-klasyczna__1hnZPPZR","jazz__1Vhjjee8","malarstwo-wiedza-o-kierunkach-i-malarzach__1eb9j7v_","medytacja__1A6G2rSP","modern__1TTDXOHB","muzyka-fortepian__12rsOZ1u","muzykoterapia__1HOlSG1m","perkusja-1-1__12RpDc5E","perkusja-maa-grupa__1Vhh80Wn","pisanie-ksiazek-dziennikow-maa-grupa__1hf51u80","pisanie-piosenek-praca-z-tekstem-mala-grupa__1OUFYt8S","produkcja-muzyczna-1-1__1j9VhxBv","produkcja-muzyczna-maa-grupa__1-P9lihX","rysunek-karykatura__1JpXWYOU","rytm-ruch-flow-dla-najmodszych-maa-grupa__1JZ8OtKM","saksofon__1hPJJR5R","sensoryka-maa-grupa__1I35k-__","skrzypce-1-1__1wuuk3ZS","tworzenie-komiksow-maa-grupa__1KsYbu0D","tworzenie-scenariuszy-maa-grupa__1uhJbz9e","ukulele-maa-grupa__1lcxnIf0","ukulele__12-JfVvT","wokal-1-1__1jePFrXx","wokal-maa-grupa__1pJQA3FC","zespoy-instrumentalne-mala-grupa__1E16EtMX"];
const ZAJ_FALLBACK="zajecia-mae-grupy-jak-nie-ma-zdjecia__1JU3KvhS";
function deburr(s){return (s||"").toLowerCase()
  .replace(/[ąàâ]/g,"a").replace(/[ćč]/g,"c").replace(/[ęèê]/g,"e").replace(/ł/g,"l")
  .replace(/ń/g,"n").replace(/[óòô]/g,"o").replace(/[śš]/g,"s").replace(/[żź]/g,"z")
  .replace(/[^a-z0-9]+/g," ").trim();}
const STOP=new Set(["i","w","z","do","dla","na","praca","grupa","grupie","grupowe","male","mala","maa","najmodszych","indywidualnie","indywidualne","jak","nie","ma","zdjecia","1","o"]);
function tokens(s){return deburr(s).split(" ").filter(t=>t&&!STOP.has(t));}
function zajPhoto(z){
  const want=tokens(z.nazwa_id||z.nazwa);    
  if(!want.length) return ZAJ_FALLBACK;
  let best=null,bestScore=0;
  for(const f of ZAJ_PHOTOS){
    const ft=new Set(tokens(f.split("__")[0]));
    let s=0; for(const w of want) if(ft.has(w)) s++;
    if(s>bestScore){bestScore=s;best=f;}
  }
  return bestScore>=1?best:ZAJ_FALLBACK;
}
function prowadzenie(fmt){
  const f=(fmt||"").toLowerCase();
  if(f.includes("indyw")&&f.includes("grup")) return "Taught one-to-one / in a small group";
  if(f.includes("indyw")) return "Taught one-to-one";
  if(f.includes("grup")) return "Classes in a small group";
  return "Taught one-to-one / in a small group";
}














const RE_FMT_MG=/\s*[-–—]?\s*\(?\s*(?:ma[łl][ae] grup[ay]|small groups?)\s*\)?/gi;
function fmtNazwa(i){
  const raw=String((i&&i.nazwa)||"");    
  const base=raw.replace(RE_FMT_MG," ").replace(/\s{2,}/g," ").trim();
  return /ma[łl][ae] grup/i.test((i&&i.format)||"") ? base+" (small group)" : base;
}





function catCard(i,idx){
  const czas=isData(i.godz)?i.godz:"Time [NO DATA]";
  const grupa=isData(i.miejsca)?i.miejsca:prowadzenie(i.format);
  const lok=isData(i.lokalizacja)?i.lokalizacja:"Location [NO DATA]";
  const photo=isData(i.foto_link)?i.foto_link:"../assets/img/zajecia/"+zajPhoto(i)+".png";
  return `<article class="zcard">
    <div class="zcard__text">
      <h3 class="zcard__title">${fmtNazwa(i)}</h3>
      ${isData(i.opis)?`<p class="zcard__desc">${i.opis}</p>`:`<p class="zcard__desc muted">Description [NO DATA]</p>`}
      <div class="zcard__meta">
        <span class="zmeta">${META_ICON.clock}<span>${czas}</span></span>
        <span class="zmeta">${META_ICON.person}<span>${grupa}</span></span>
        <span class="zmeta">${META_ICON.pin}<span>${lok}</span></span>
      </div>
      

    </div>
    <div class="zcard__media">
      <span class="zcard__media-bg bw" style="background-image:url('${photo}')"></span>
      <button class="btn zcard__btn" type="button" data-popup="${idx}">Sign up <span aria-hidden="true">&gt;</span></button>
    </div>
  </article>`;
}



function zespCard(i,idx){
  const czas=isData(i.godz)?i.godz.replace(/\n/g,"<br>"):"Schedule [NO DATA]";
  const miejsca=isData(i.miejsca)?i.miejsca:"Places [NO DATA]";
  const termin=isData(i.dni_daty)?i.dni_daty:"Date [NO DATA]";
  const lok=isData(i.lokalizacja)?i.lokalizacja:"Location [NO DATA]";
  const photo=isData(i.foto_link)?i.foto_link:"../assets/img/zajecia/"+ZAJ_FALLBACK+".png";
  return `<article class="zcard zcard--zesp" data-idx="${idx}">
    <div class="zcard__text">
      <h3 class="zcard__title">${i.nazwa}</h3>
      <div class="zcard__meta">
        <span class="zmeta">${META_ICON.clock}<span>${czas}</span></span>
        <span class="zmeta">${META_ICON.person}<span>${miejsca}</span></span>
        <span class="zmeta">${META_ICON.calendar}<span>${termin}</span></span>
        <span class="zmeta">${META_ICON.pin}<span>${lok}</span></span>
      </div>
      

    </div>
    <div class="zcard__media">
      <span class="zcard__media-bg bw" style="background-image:url('${photo}')"></span>
      <button class="btn zcard__btn" type="button" data-popup="${idx}">Find out more <span aria-hidden="true">&gt;</span></button>
    </div>
  </article>`;
}



function openZespPopup(i){
   
   
  const params=readFilterParams();
  const wiek=params.wiek||[];
  const termin=[...(params.dni||[]),...(params.godz||[]),...(params.pora||[])];
  const roFrame=(arr,empty)=>arr.length
    ? `<div class="zsel__frame">${arr.map(v=>`<span class="zsel__opt zsel__opt--ro"><span class="zsel__box zsel__box--on"></span>${v}</span>`).join("")}</div>`
    : `<div class="zsel__frame muted">${empty}</div>`;
  const desc=isData(i.opis_popup)?i.opis_popup:(isData(i.opis)?i.opis:null);
  openModal(`<div class="zpopup">
    <div class="zpopup__panel">
      <h2 class="zpopup__name">${fmtNazwa(i)}</h2>
      ${desc?`<p class="zpopup__desc">${desc}</p>`:`<p class="zpopup__desc muted">Description [NO DATA] - content from the client.</p>`}
      <div class="zpopup__sels">
        <div class="zsel"><span class="zsel__label">Age group:</span>${roFrame(wiek,"Dowolna")}</div>
        <div class="zsel"><span class="zsel__label">Date:</span>${roFrame(termin,"Dowolny termin")}</div>
      </div>
      <div class="zpopup__prices">
        ${(i.cennik_popup||[]).map(c=>`<span>${c}</span>`).join("")}
        <span class="zpopup__price-main">${isData(i.cena)?i.cena:"Cena [BRAK DANYCH]"}</span>
      </div>
    </div>
    <div class="zpopup__media bw" style="background-image:url('${isData(i.foto_link)?i.foto_link:""}')">
      <a class="btn" href="${EASYCART_URL}">Sign up <span aria-hidden="true">&gt;</span></a>
    </div>
  </div>`,"modal__box--zesp");
}

const CATS=["all","MUZYKA","SŁOWO","SCENA","RUCH","OBRAZ","EMOCJE","DIALOG"];    












const CAT_LABEL={all:"All",MUZYKA:"Music",OBRAZ:"Image",SŁOWO:"Word",SCENA:"Stage",RUCH:"Movement",EMOCJE:"Emotions",DIALOG:"Dialogue"};


const catsOf=z=>(z.kategorie&&z.kategorie.length)?z.kategorie:[z.kategoria];














const FWIEK_OPTS=["3-5 years","5-6 years","7-9 years","9-11 years","12-14 years","14-16 years","16-18 years"];







const LOKAL_OPTS=["Sadyba","Wawer","Praga","Wilanów - Royal Wilanów","Wilanów - Wiertnicza 141","Wola","Ursus","Ursynów"];  
window.TNMLokalizacje=LOKAL_OPTS;




const ETY_POZ_1="Początkujący (0 - 1 roku praktyki)";
const ETY_POZ_2="Średnio zaawansowany (1 - 5 lat praktyki)";
const ETY_POZ_3="Zaawansowany (powyżej 5 lat praktyki)";
const ETY_POZ_4="Professional (studies, professional activity)";
const FPOZIOM_OPTS=[ETY_POZ_1,ETY_POZ_2,ETY_POZ_3,ETY_POZ_4];
 


const FDNI_OPTS=["dni tygodnia (poniedziałek - piątek)","weekend (sobota - niedziela)"];
const ETY_DNI_1="Weekdays (Monday - Friday)";
const ETY_DNI_2="Weekend (Saturday - Sunday)";
const FDNI_SHOW={[FDNI_OPTS[0]]:ETY_DNI_1,[FDNI_OPTS[1]]:ETY_DNI_2};
const FGODZ_OPTS=["7:00 - 10:00","10:00 - 12:00","12:00 - 14:00","14:00 - 16:00","16:00 - 18:00","18:00 - 20:00","20:00 - 22:00"];
const mWiek=(z,o)=>Array.isArray(z.f_wiek)?z.f_wiek.some(w=>String(w).trim()===o):null;






























const LOKAL_Z_POLA=[
  {re:/royal/i,                       lok:"Wilanów - Royal Wilanów"},
  {re:/edison|wiertnicz/i,            lok:"Wilanów - Wiertnicza 141"},
  {re:/ursyn[oó]w/i,                  lok:"Ursynów"},
  {re:/\bursus\b|regu[lł]y/i,         lok:"Ursus"},    
  {re:/\bwol[ai]\b/i,                 lok:"Wola"}
];




const LOK_KAZDA=/wiele lokalizacji|multiple locations|^all$/i;
const LOK_BEZ_STALEGO_MIEJSCA=/ustalana indywidualnie|do ustalenia|arranged individually/i;
const mLokal=(z,o)=>{
  if(Array.isArray(z.f_lokal)) return z.f_lokal.includes(o);    
  const lok=String(z.lokalizacja||"").trim();
  if(!lok) return null;
  if(LOK_KAZDA.test(lok)) return true;
  if(LOK_BEZ_STALEGO_MIEJSCA.test(lok)) return null;
  for(const m of LOKAL_Z_POLA) if(m.re.test(lok)) return m.lok===o;
  return null;    
};
const mPoziom=(z,o)=>Array.isArray(z.f_poziom)?z.f_poziom.some(p=>String(p).trim()===o):null;    
const mDni=(z,o)=>Array.isArray(z.f_dni)?z.f_dni.includes(o):(isData(z.f_dni)?z.f_dni===o:null);
const mGodz=(z,o)=>Array.isArray(z.f_godz)?z.f_godz.includes(o):(isData(z.f_godz)?z.f_godz===o:null);
function filterGroupsFor(kind, aud){
  




  const grpLokal ={id:"lokal", label:"Class locations",        opts:LOKAL_OPTS,  match:mLokal};    
  const grpWiek  ={id:"wiek",  label:"Age group",        opts:FWIEK_OPTS,  match:mWiek};
  const grpPoziom={id:"poziom",label:"Level", opts:FPOZIOM_OPTS,match:mPoziom};
  const grpDni   ={id:"dni",   label:"Class days",            opts:FDNI_OPTS,   match:mDni, show:FDNI_SHOW};
  const grpGodz  ={id:"godz",  label:"Class time",        opts:FGODZ_OPTS,  match:mGodz};
  if(kind==="zespol"){
     
    const groups=[grpLokal];
    if(aud!=="Dorosły") groups.push(grpWiek);
    groups.push(grpPoziom,grpDni,grpGodz);
    return groups;
  }
   
  const groups=[
    {id:"forma",label:"Type of classes",opts:["1:1","small groups"],
     match:(z,o)=>{const f=(z.format||"").toLowerCase();if(!f)return null;return o==="1:1"?f.includes("indyw"):f.includes("grup");}},
    grpLokal
  ];
   
  if(aud!=="Dorosły") groups.push(grpWiek);
  groups.push(grpPoziom,grpDni,grpGodz);    
  return groups;
}
function sidebarHTML(groups){
  return groups.map(g=>`<div class="fgroup" data-g="${g.id}">`+
    (g.label?`<span class="fgroup__label">${g.label}</span>`:"")+
    g.opts.map(o=>`<label class="fopt"><input type="checkbox" value="${o.replace(/"/g,'&quot;')}"><span class="fbox"></span>${(g.show&&g.show[o])||o}</label>`).join("")+    
  `</div>`).join("")+
   
  `<div class="fbtns"><button class="fbtn fbtn--go" type="button" id="clear-filters">Clear filters</button></div>`;
}



const FILTER_KEYS=["forma","wiek","poziom","turnus","dni","godz","lokal"];    
function readFilterParams(){
  const p=new URLSearchParams(location.search), out={};
  for(const k of FILTER_KEYS){const v=p.getAll(k); if(v.length) out[k]=v;}
  return out;
}
function writeFilterParams(sideEl){
  const p=new URLSearchParams(location.search);
  FILTER_KEYS.forEach(k=>p.delete(k));
  sideEl.querySelectorAll(".fgroup[data-g]").forEach(g=>{
    g.querySelectorAll("input:checked").forEach(i=>p.append(g.dataset.g,i.value));
  });
  const qs=p.toString();
  history.replaceState(null,"",(qs?`?${qs}`:location.pathname)+location.hash);
}
function applyFilterParamsToSidebar(sideEl){
  const params=readFilterParams();
  sideEl.querySelectorAll(".fgroup[data-g]").forEach(g=>{
    const vals=params[g.dataset.g]||[];
    if(vals.length) g.querySelectorAll("input").forEach(i=>{ if(vals.includes(i.value)) i.checked=true; });
  });
}












const ETY_FILTRUJ="Filter";
const ETY_FILTRY="Filters";
const ETY_ZAMKNIJ_FILTRY="Close filters";
function setupFilterDrawer(){
  const sideEl=document.querySelector(".catalog .cat-side");
  const mainEl=document.querySelector(".catalog .cat-main");
  if(!sideEl||!mainEl) return;
  const listEl=mainEl.querySelector("#catalog");
  








  let bar=mainEl.querySelector(".cat-bottombar");
  if(!bar){
    bar=document.createElement("div");
    bar.className="cat-bottombar";
    if(listEl) listEl.insertAdjacentElement("beforebegin",bar); else mainEl.appendChild(bar);
  }
  let trigger=mainEl.querySelector(".cat-filter-trigger");
  if(!trigger){
    trigger=document.createElement("button");
    trigger.type="button"; trigger.className="cat-filter-trigger";
    trigger.innerHTML=ETY_FILTRUJ+' <span class="cat-filter-trigger__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M6 12h12M10 18h4"/></svg></span>';
  }
  if(trigger.parentElement!==bar) bar.appendChild(trigger);
   
  if(!bar.querySelector(".cat-bottombar__cta")){
    bar.insertAdjacentHTML("beforeend",
      '<a class="cat-bottombar__cta" href="'+FORM_URL+'" data-entry="pinned-pelny">Fill in the form <span aria-hidden="true">&gt;</span></a>');
  }
  if(!sideEl.querySelector(".cat-side__drawerhead")){
    sideEl.insertAdjacentHTML("afterbegin",
      '<div class="cat-side__drawerhead"><span class="cat-side__drawertitle">'+ETY_FILTRY+'</span>'+
      '<button type="button" class="cat-side__drawerclose" aria-label="'+ETY_ZAMKNIJ_FILTRY+'">&#10005;</button></div>');
  }
  const open=v=>{sideEl.classList.toggle("is-open",v);document.body.classList.toggle("nav-lock",v);};
  trigger.onclick=()=>open(true);
  sideEl.querySelector(".cat-side__drawerclose").onclick=()=>open(false);
   
  sideEl.querySelector("#apply-filters")?.addEventListener("click",()=>{
    if(window.matchMedia("(max-width:767px)").matches) open(false);
  });
   
  window.addEventListener("resize",()=>{ if(!window.matchMedia("(max-width:767px)").matches) open(false); });
}




function tnmDeepLinkItem(list, kind, keyFn){
  const want=new URLSearchParams(location.search).get("zajecie"); if(!want) return;
  tnmDropParams(["zajecie"]);
  const w=tnmSlug(want); const it=list.find(i=>tnmSlug(keyFn(i))===w);
  if(it) openEntry(lessonEntryCtx(it, kind));
}
function mountCatalog(data, aud, opts={}){
  const items=opts.items||(data.zajecia||[]);
  const cardFn=opts.cardFn||catCard;
  const all=items.filter(z=>z.audience===aud);
  const listEl=document.getElementById("catalog");
  const emptyEl=document.getElementById("cat-empty");
  const tabsEl=document.getElementById("cat-tabs");
  const sideEl=document.getElementById("side-filters");
  let cat="all";

   
  document.querySelectorAll("#aud-toggle button").forEach(b=>b.classList.toggle("active",b.dataset.aud===aud));

   
  const present=new Set(all.flatMap(catsOf));
  tabsEl.innerHTML=CATS.filter(c=>c==="all"||present.has(c))
    .map(c=>`<button class="cat-tab${c===cat?" active":""}" data-c="${c}">${CAT_LABEL[c]}</button>`).join("");

   
  


  const groups=filterGroupsFor(opts.entryKind||"lekcja", aud).filter(g=>g.opts.some(o=>all.some(z=>g.match(z,o)===false)));
  sideEl.innerHTML=sidebarHTML(groups);
  applyFilterParamsToSidebar(sideEl);  
  const checked=()=>{
    const out=[];
    sideEl.querySelectorAll(".fgroup").forEach(gEl=>{
      const g=groups.find(x=>x.id===gEl.dataset.g);
      gEl.querySelectorAll("input:checked").forEach(i=>out.push({g,o:i.value}));
    });
    return out;
  };
  function draw(){
    writeFilterParams(sideEl);  
    const act=checked();
    const list=all.filter(z=>{
      if(cat!=="all"&&!catsOf(z).includes(cat)) return false;
      if(!act.length) return true;
       
      const perG=new Map();
      for(const {g,o} of act){const m=g.match(z,o);if(m===null)continue;perG.set(g.id,perG.get(g.id)===true||m);}
      for(const v of perG.values()) if(v===false) return false;
      return true;
    });
    listEl.innerHTML=list.map((z,k)=>cardFn(z,items.indexOf(z))).join("");
    emptyEl.hidden=list.length>0;
    tabsEl.querySelectorAll(".cat-tab").forEach(b=>b.classList.toggle("active",b.dataset.c===cat));
     
    listEl.querySelectorAll("[data-popup]").forEach(b=>b.onclick=()=>openEntry(lessonEntryCtx(items[+b.dataset.popup],opts.entryKind||"lekcja")));
    if(opts.onDraw) opts.onDraw(listEl,items);
  }
   
   
  tabsEl.querySelectorAll(".cat-tab").forEach(b=>b.onclick=()=>{cat=b.dataset.c;draw();
    b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});});
  sideEl.querySelectorAll("input").forEach(i=>i.onchange=draw);   
  sideEl.querySelector("#clear-filters").onclick=()=>{
    sideEl.querySelectorAll("input").forEach(i=>i.checked=false);cat="all";draw();};
  draw();
  setupFilterDrawer();
  tnmDeepLinkItem(all, opts.entryKind||"lekcja", i=>i.nazwa_id||i.nazwa);    
}

 
function mountZespoly(data, aud){
  mountCatalog(data, aud, {items:data.zespoly||[], cardFn:zespCard, entryKind:"zespol"});
}






















const DP_AUD=[["Dorosły","Adults"],["Dziecko","Children"]];    


const DP_CTA_OFF=false;
const DP_CTA_NOTA=`<p class="lcpopup__desc dp-nota">Online reservations will open soon. Until then, write to us: <a href="mailto:jestem@thenoisemakers.pl">jestem@thenoisemakers.pl</a></p>`;



function dpNext(i){
  return {kind:"form",schema:"dni-probne",zajecie:i.nazwa_id||i.nazwa,prefill:{sku:i.sku,dp_nazwa:i.nazwa,audience:i.audience,dp_cena:i.cena}};
}




function dpJedenNaJeden(i){ return /^LEKCJA-PROBNA/i.test(String(i&&i.sku||"")); }    
function dpRodzina(i){ return String(i.rodzina||i.nazwa||"").trim(); }
function dpPozIdx(i){ const k=FPOZIOM_OPTS.indexOf(String(i.poziom||"")); return k<0?9:k; }
function dpRodzIdx(g){ const k=DP_ORDER.findIndex(re=>re.test(String((g.warianty[0]||{}).sku||""))); return k<0?9:k; }
function dpGrupuj(items,aud){
  const kolejnosc=[], wg={};
  items.filter(i=>i.audience===aud).forEach(i=>{
    const k=deburr(dpRodzina(i)).toLowerCase();
    if(!wg[k]){ wg[k]={rodzina:dpRodzina(i),audience:aud,warianty:[],jeden:dpJedenNaJeden(i)}; kolejnosc.push(wg[k]); }
    wg[k].warianty.push(i);
  });
  kolejnosc.forEach(g=>g.warianty.sort((a,b)=>dpPozIdx(a)-dpPozIdx(b)));
  return kolejnosc.sort((a,b)=>dpRodzIdx(a)-dpRodzIdx(b));
}






function dpPoziomy(g){
  if(g.jeden) return FPOZIOM_OPTS.slice();
  const ma={}; g.warianty.forEach(v=>{ if(isData(v.poziom)) ma[String(v.poziom)]=1; });
  return FPOZIOM_OPTS.filter(p=>ma[p]).concat(Object.keys(ma).filter(p=>FPOZIOM_OPTS.indexOf(p)<0));
}
function dpWariant(g,poziom){
  if(g.jeden) return g.warianty[0];
  return g.warianty.find(v=>String(v.poziom||"")===String(poziom))||g.warianty[0];
}






const DP_DNI=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DP_M01="January";  const DP_M02="February";    const DP_M03="March";
const DP_M04="April";  const DP_M05="May";      const DP_M06="June";
const DP_M07="July";     const DP_M08="August";  const DP_M09="September";
const DP_M10="October"; const DP_M11="November"; const DP_M12="December";
const DP_MIES=[DP_M01,DP_M02,DP_M03,DP_M04,DP_M05,DP_M06,DP_M07,DP_M08,DP_M09,DP_M10,DP_M11,DP_M12];
const DP_LUB="or";
const DP_MIEJSC="places";
const DP_MIEJSC_NOTA="(choose your level)";
const DP_DZIEN_IND="Day arranged individually";       
const DP_TRWANIE_1NA1="45 min";                           


const DP_START_KARTA="Classes start: 10:10";
const DP_ADR_1="The Noise Makers";
const DP_ADR_2="Ul. Wiertnicza 141";
const DP_ADR_3="02-952 Warszawa";
const DP_TYT="Trial Day";                              




const DP_TYT_1NA1="Trial Day 1:1 Lessons | Your choice (instrument of your choice, vocals, other one-to-one classes)";
const DP_MASTHEAD="Join";                               
const DP_LAB_TERMIN="Date:";
const DP_LAB_POZIOM="Level:";
const DP_CENA_LEKCJA="Single class";
const DP_CENA_DZIEN="Workshop day";
const DP_CTA_KARTA="Sign up";
function dpPl(w){ return LANG_TERAZ==="pl"?String(w).toLowerCase():String(w); }







const DP_1NA1_BEZ_DATY=false;
function dpTerminWysylany(g,wybrany,pierwszy){
  if(!g.jeden) return wybrany||pierwszy||null;
  return DP_1NA1_BEZ_DATY?null:(pierwszy||null);
}
function dpTytul(g){ return g.jeden?DP_TYT_1NA1:(DP_TYT+" | "+String(g.rodzina).toUpperCase()); }





function dpTerminy(i){
  return String(i.termin||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=>{
    const m=/(\d{2})\.(\d{2})\.(\d{4})/.exec(t);
    if(!m) return {label:t,value:t};
    const d=new Date(+m[3],+m[2]-1,+m[1]);
    return {label:`${m[1]}.${m[2]}.${m[3]} (${dpPl(DP_DNI[d.getDay()])})`,value:`${m[3]}-${m[2]}-${m[1]}`};
  });
}




function dpTerminKarta(i){
  const t=dpTerminy(i); if(!t.length) return "";
  const rozbite=t.map(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.value)?x.value.split("-").map(Number):null);
  const pelne=t.map(x=>x.label).join(", ");
  if(rozbite.some(x=>!x)) return pelne;
  const rok=rozbite[0][0], mies=rozbite[0][1];
  if(!rozbite.every(x=>x[0]===rok&&x[1]===mies)) return pelne;
  

  const czlony=rozbite.map(([r,m,d])=>`${d} ${dpPl(DP_MIES[m-1])} ${r} (${dpPl(DP_DNI[new Date(r,m-1,d).getDay()])})`);
  return czlony.join(" "+dpPl(DP_LUB)+" ");
}





function dpChars(g){
  const i=g.warianty[0], c=[];
  if(g.jeden){
    c.push({icon:META_ICON.calendar,text:DP_DZIEN_IND});
    c.push({icon:META_ICON.clock,text:DP_TRWANIE_1NA1});
  }else{
    const t=dpTerminKarta(i); if(t) c.push({icon:META_ICON.calendar,text:t});
    c.push({icon:META_ICON.clock,text:DP_START_KARTA});
  }
  c.push({icon:META_ICON.pin,text:DP_ADR_1+"<br>"+DP_ADR_2+"<br>"+DP_ADR_3});
  if(!g.jeden&&isData(i.miejsca)) c.push({icon:META_ICON.person,text:i.miejsca+" "+dpPl(DP_MIEJSC)+" "+DP_MIEJSC_NOTA});
  return c;
}
function dpPhoto(i){ return isData(i.foto_link)?i.foto_link:"../assets/img/zajecia/"+ZAJ_FALLBACK+".png"; }
function dpCard(g,idx){
  const i=g.warianty[0];
  const chars=dpChars(g).map(c=>`<span class="zmeta">${c.icon}<span>${c.text}</span></span>`).join("");
  const desc=String(isData(i.opis)?i.opis:(isData(i.opis_popup)?i.opis_popup:"")).split(/\n/)[0].trim();    
  return `<article class="zcard zcard--dp" data-aud="${g.audience}" data-idx="${idx}">
    <div class="zcard__text">
      <h3 class="zcard__title">${dpTytul(g)}</h3>
      ${desc?`<p class="zcard__desc">${desc}</p>`:""}
      <div class="zcard__meta">${chars}</div>
    </div>
    <div class="zcard__media">
      <span class="zcard__media-bg bw" style="background-image:url('${dpPhoto(i)}')"></span>
      <button class="btn zcard__btn" type="button" data-popup="${idx}">${DP_CTA_KARTA} <span aria-hidden="true">&gt;</span></button>
    </div>
  </article>`;
}
 
const DP_LOKALIZACJA_HTML=`<p class="lcpopup__desc dp-lok"><strong>Trial days location:</strong><br>The Noise Makers<br>ul. Wiertnicza 141<br>02-952 Warszawa</p>
<p class="lcpopup__desc dp-lok">Regular classes will also take place at other The Noise Makers locations.</p>`;
 
const DP_START_HTML=`<p class="lcpopup__desc dp-lok"><strong>Class start time:</strong> 10:10</p>`;


function dpWyborHTML(nazwa,label,opcje){
  const id="lab-"+nazwa;
  return `<div class="dp-wybor"><span class="dp-wybor__label" id="${id}">${label}</span>
    <div class="dp-wybor__box" role="radiogroup" aria-labelledby="${id}">`+
    opcje.map((o,k)=>`<label class="fopt"><input type="radio" name="${nazwa}" value="${o.value}"${k===0?" checked":""}><span class="fbox fbox--radio"></span>${o.label}</label>`).join("")+
    `</div></div>`;
}



function dpCeny(g,v){
  const glowna=fmtKwota(v.cena), lekcja=fmtKwota(v.cena_lekcji);
  if(!glowna) return [];
  if(g.jeden||!lekcja||String(v.cena)===String(v.cena_lekcji)) return [glowna];
  return [DP_CENA_LEKCJA+" "+lekcja, DP_CENA_DZIEN+" "+glowna];
}
function dpEntryCtx(g){
  const i=g.warianty[0];
  const akapit=t=>String(t).split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean);
  const paras=[].concat(isData(i.opis)?akapit(i.opis):[], isData(i.opis_popup)?akapit(i.opis_popup):[]);
  const terminy=dpTerminy(i), poziomy=dpPoziomy(g);
  const bloki=[];
  if(!g.jeden&&terminy.length) bloki.push(dpWyborHTML("dp-termin",DP_LAB_TERMIN,terminy.map(t=>({value:t.value,label:t.label}))));
  if(poziomy.length)           bloki.push(dpWyborHTML("dp-poziom",DP_LAB_POZIOM,poziomy.map(p=>({value:p,label:p}))));
  const v=dpWariant(g,poziomy[0]);
  return {
    dpGrupa:g,
    mastheadTitle:DP_MASTHEAD,
    title:dpTytul(g),
    descHTML:paras.map(t=>`<p class="lcpopup__desc">${t}</p>`).join("")+(g.jeden?"":DP_START_HTML)+DP_LOKALIZACJA_HTML+bloki.join("")+(DP_CTA_OFF?DP_CTA_NOTA:""),
    photo:dpPhoto(i),
    prices:dpCeny(g,v),
    ctaLabel:DP_CTA_KARTA,
    surface:"dni-probne",
    thx:{surface:"zajecia",button:false},
    next:(function(){
      const n=dpNext(v);
      n.prefill=Object.assign({},n.prefill,{
        dp_nazwa:dpTytul(g),
        termin:dpTerminWysylany(g,null,terminy.length?terminy[0].value:null),
        poziom:poziomy.length?poziomy[0]:null
      });
      return n;
    })(),
    track:{content_name:v.nazwa_id||v.nazwa,content_category:"dni-probne",audience:g.audience}
  };
}


function dpOdswiez(){
  const g=currentEntry&&currentEntry.dpGrupa;
  if(!g||!currentEntry.next) return;
  const box=document.getElementById("modal");
  const poz=box&&box.querySelector('input[name="dp-poziom"]:checked');
  const ter=box&&box.querySelector('input[name="dp-termin"]:checked');
  const v=dpWariant(g,poz?poz.value:null);
  const n=dpNext(v);
  currentEntry.next.zajecie=n.zajecie;
  currentEntry.next.prefill=Object.assign({},currentEntry.next.prefill,n.prefill,{
    dp_nazwa:dpTytul(g),
    termin:dpTerminWysylany(g,ter?ter.value:null,(dpTerminy(v)[0]||{}).value||null),
    poziom:poz?poz.value:null
  });
   
  const ceny=dpCeny(g,v), linie=box?box.querySelectorAll(".lcpopup__price-line"):[];
  if(linie.length===ceny.length) linie.forEach((el,k)=>{ el.textContent=ceny[k]; });
}
function dpZaznacz(nazwa,wartosc){
  if(!isData(wartosc)) return false;
  let trafione=false;
  document.querySelectorAll('#modal input[name="'+nazwa+'"]').forEach(el=>{
    if(el.value===String(wartosc)){ el.checked=true; trafione=true; }
  });
  return trafione;
}
function dpOpen(g,wybor){
  openEntry(dpEntryCtx(g));
  const w=wybor||{};
  let ruszone=false;
  if(dpZaznacz("dp-poziom",w.poziom)) ruszone=true;
  if(!g.jeden&&dpZaznacz("dp-termin",w.termin)) ruszone=true;
  if(ruszone) dpOdswiez();
  if(DP_CTA_OFF) document.querySelectorAll(".lcpopup [data-entry-go]").forEach(b=>{ b.disabled=true; b.setAttribute("aria-disabled","true"); });
}





const DP_ORDER=[/^OTWARTY-MUSICAL/i,/^OTWARTY-CHOR/i,/^OTWARTY-SPEKTAKL/i,/^LEKCJA-PROBNA/i];
function mountDniProbne(data){
  const items=(data.dni_probne||[]).filter(i=>i.aktywne!==false);
  document.addEventListener("change",e=>{
    if(!e.target||!currentEntry||!currentEntry.dpGrupa) return;
    if(e.target.name==="dp-termin"||e.target.name==="dp-poziom") dpOdswiez();
  });
  const listEl=document.getElementById("catalog");
  const emptyEl=document.getElementById("cat-empty");
  const tabsEl=document.getElementById("cat-tabs");
  const params=new URLSearchParams(location.search);
  const dla=(params.get("dla")||"").toLowerCase();
  let aud=/^(dorosli|adults)$/.test(dla)?"Dorosły":"Dziecko";
  let grupy=[];
  tabsEl.innerHTML=DP_AUD.map(([k,label])=>`<button class="cat-tab${k===aud?" active":""}" type="button" data-aud="${k}">${label}</button>`).join("");
  function draw(){
    grupy=dpGrupuj(items,aud);
    listEl.innerHTML=grupy.map((g,k)=>dpCard(g,k)).join("");
    emptyEl.hidden=grupy.length>0;
    tabsEl.querySelectorAll(".cat-tab").forEach(b=>b.classList.toggle("active",b.dataset.aud===aud));
    listEl.querySelectorAll("[data-popup]").forEach(b=>b.onclick=()=>dpOpen(grupy[+b.dataset.popup]));
  }
  function grupaZ(it){ return grupy.find(g=>g.warianty.indexOf(it)>=0)||null; }
  tabsEl.querySelectorAll(".cat-tab").forEach(b=>b.onclick=()=>{
    aud=b.dataset.aud;
    const u=new URL(location.href); u.searchParams.set("dla",aud==="Dorosły"?"dorosli":"dzieci"); history.replaceState(null,"",u);
    draw(); b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
  });
  draw();
  




  const kup=params.get("kup")==="1", terminZ=params.get("termin")||"", skuZ=(params.get("sku")||"").trim().toUpperCase();
  const want=params.get("zajecie");
  function wejdz(it){
    if(!it) return;
    if(it.audience!==aud){ aud=it.audience; draw(); }
    const g=grupaZ(it); if(!g) return;
    const termin=(!g.jeden&&/^\d{4}-\d{2}-\d{2}$/.test(terminZ)&&dpTerminy(it).some(t=>t.value===terminZ))?terminZ:null;
    dpOpen(g,{poziom:it.poziom,termin:termin});
    if(kup&&!DP_CTA_OFF&&currentEntry&&currentEntry.next) routeStep2(currentEntry);
  }
  if(!want&&skuZ){ tnmDropParams(["sku","termin","kup"]); wejdz(items.find(i=>String(i.sku||"").toUpperCase()===skuZ)); }
  if(want){ tnmDropParams(["zajecie","termin","kup"]); const w=tnmSlug(want);
    wejdz(items.find(i=>i.audience===aud&&tnmSlug(i.nazwa_id||i.nazwa)===w)); }
}




const ICON_SOUP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11.5h18a9 9 0 01-18 0z"/><path d="M3.5 11.5h17"/><path d="M8 7c0-1 .9-1.4 0-2.6M12 7c0-1 .9-1.4 0-2.6M16 7c0-1 .9-1.4 0-2.6"/></svg>';
function polkCard(i,idx){
  const photo=isData(i.foto_link)?i.foto_link:"../assets/img/figma/polkolonie/polkolonie-card-wakacje.webp";
  return `<article class="zcard zcard--polk" data-typ="${i.typ||"Półkolonie"}">
    <div class="zcard__text">
      <h3 class="zcard__title">${i.nazwa}${i.miesiac?` <span class="zcard__title-mut">| ${i.miesiac}</span>`:""}</h3>
      <div class="zcard__meta">
        <span class="zmeta">${META_ICON.clock}<span>${isData(i.godz)?i.godz:"9:00 - 17:00"}</span></span>
        <span class="zmeta">${META_ICON.calendar}<span>${isData(i.turnus)?i.turnus:"Termin [BRAK DANYCH]"}</span></span>
        <span class="zmeta">${ICON_SOUP}<span>${isData(i.wyzywienie)?i.wyzywienie:"Zdrowe wyżywienie (3 posiłki)"}</span></span>
        <span class="zmeta">${META_ICON.person}<span>${isData(i.wiek)?i.wiek:"3-5 lat"}${isData(i.miejsca)?` (${i.miejsca})`:""}</span></span>
        <span class="zmeta">${META_ICON.pin}<span>${isData(i.lokalizacja)?i.lokalizacja:"Royal Wilanów"}</span></span>
      </div>
      
    </div>
    <div class="zcard__media">
      <span class="zcard__media-bg bw" style="background-image:url('${photo}')"></span>
      ${turnusSellable(i.turnus)
        ? `<button class="btn zcard__btn" type="button" data-polk="${idx}">Sign up <span aria-hidden="true">&gt;</span></button>`
        : `<p class="zcard__trwa">This session is already running - ${TURNUS_TRWA_MSG}. You can buy a single day of attendance at any point during the session.</p>`}
    </div>
  </article>`;
}


function openPolkPopup(i){
  const info=[["Date",i.turnus],["Hours",i.godz],["Meals",i.wyzywienie],
    ["Age",isData(i.wiek)?i.wiek+(isData(i.miejsca)?` (${i.miejsca})`:""):null],["Location",i.lokalizacja]]
    .filter(([,v])=>isData(v));
  openModal(`<div class="zpopup">
    <div class="zpopup__panel">
      <h2 class="zpopup__name">${i.nazwa}${i.miesiac?` | ${i.miesiac}`:""}</h2>
      ${isData(i.opis_popup)?`<p class="zpopup__desc">${i.opis_popup}</p>`:""}
      <div class="zpopup__sels">
        ${info.map(([k,v])=>`<div class="zsel"><span class="zsel__label">${k}:</span><span class="zsel__val">${v}</span></div>`).join("")}
      </div>
      <div class="zpopup__prices">
        <span class="zpopup__price-main">${isData(i.cena)?i.cena:"Cena [BRAK DANYCH]"}</span>
      </div>
    </div>
    <div class="zpopup__media bw" style="background-image:url('${isData(i.foto_link)?i.foto_link:""}')">
      <a class="btn" href="${EASYCART_URL}">Sign up <span aria-hidden="true">&gt;</span></a>
    </div>
  </div>`,"modal__box--zesp");
}
const POLK_WIEK=["3-5 years","6-14 years"];   
const POLK_DNI=["Week","Weekend"];         
const POLK_TURNUSY=["29.06 - 03.07.2026","06.07 - 10.07.2026","13.07 - 17.07.2026","20.07 - 24.07.2026","27.07 - 31.07.2026","03.08 - 07.08.2026","10.08 - 14.08.2026","17.08 - 21.08.2026","24.08 - 28.08.2026"];







function turnusFuture(termin){
  const m=/(\d{2})\.(\d{2})\.(\d{4})\s*$/.exec(String(termin||""));
  if(!m) return true;
  const today=new Date(); today.setHours(0,0,0,0);
  return new Date(+m[3],+m[2]-1,+m[1])>=today;
}









function turnusStart(termin){
  const m=/(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})\.(\d{4})\s*$/.exec(String(termin||""));
  if(!m) return null;
  const [,d1,m1,,m2,y]=m;
  const rok=(+m1>+m2)?(+y-1):+y;
  return new Date(rok,+m1-1,+d1);
}





const POL2027=!!(window.TNM_FLAGS&&window.TNM_FLAGS.POLKOLONIE_2027);
function turnusSellable(termin){
  if(POL2027) return true;
  return turnusSellableWgKalendarza(termin);
}
function turnusSellableWgKalendarza(termin){
  const s=turnusStart(termin);
  if(!s) return true;
  const today=new Date(); today.setHours(0,0,0,0);
  return today<=s;
}
 
const TURNUS_TRWA_MSG="contact us to join a session already in progress";


function polkSidebarHTML(lokOpts){
  const grp=(opts,key,label)=>`<div class="fgroup" data-g="${key}">`+(label?`<span class="fgroup__label">${label}</span>`:"")+opts.map(o=>`<label class="fopt"><input type="checkbox" value="${String(o).replace(/"/g,'&quot;')}"><span class="fbox"></span>${o}</label>`).join("")+`</div>`;
   
  const turnusOpts=POLK_TURNUSY.filter(turnusFuture);
  return grp(lokOpts,"lokal","Location")+grp(POLK_WIEK,"wiek","Age group")+grp(POLK_DNI,"dni","Days of the week")+grp(turnusOpts,"turnus","Selected dates")+
     
    `<div class="fbtns"><button class="fbtn fbtn--go" type="button" id="clear-filters">Clear filters</button></div>`;
}
function mountPolkolonie(data, aud){
   
   
  let items=data.polkolonie||[];
  if(aud) items=items.filter(i=>(i.audience||"Dziecko")===aud);
   
   
   
  const hadPast=items.length;
  items=items.filter(i=>turnusFuture(i.turnus));
  const listEl=document.getElementById("catalog");
  const emptyEl=document.getElementById("cat-empty");
   
  if(hadPast&&!items.length&&emptyEl) emptyEl.textContent="We have no open dates right now. Leave your details and we will let you know when new ones appear.";
  const tabsEl=document.getElementById("cat-tabs");
  const sideEl=document.getElementById("side-filters");
  let typ="all";
  const TYPS=["all","Półkolonie","Workshops"];
  










  const TYP_LABEL={all:"All","Półkolonie":"Półkolonie",Warsztaty:"Workshops"};
  const present=new Set(items.map(i=>i.typ||"Półkolonie"));
   
   
  tabsEl.innerHTML=TYPS.filter(t=>t==="all"||present.has(t))
    .map(t=>`<button class="cat-tab${t===typ?" active":""}" data-c="${t}">${TYP_LABEL[t]||t}</button>`).join("")
    +(aud!=="Dorosły"?`<a class="cat-tab cat-tab--link" href="polkolonie-dorosli.html">Warsztaty</a>`:"");
   
  const lokOpts=[...new Set(items.map(i=>i.lokalizacja).filter(isData).map(s=>String(s).trim()))].sort((a,b)=>a.localeCompare(b,"pl"));
  sideEl.innerHTML=polkSidebarHTML(lokOpts.length?lokOpts:["Royal Wilanów"]);
  applyFilterParamsToSidebar(sideEl);  
  const checkedG=(g)=>[...sideEl.querySelectorAll(`.fgroup[data-g="${g}"] input:checked`)].map(i=>i.value);
  function draw(){
    writeFilterParams(sideEl);  
    const ts=checkedG("turnus"), ws=checkedG("wiek"), loks=checkedG("lokal"), dnis=checkedG("dni");
    const list=items.filter(i=>{
      if(typ!=="all"&&(i.typ||"Półkolonie")!==typ) return false;
      if(ts.length&&!ts.includes(i.turnus)) return false;                                   
      if(ws.length&&isData(i.wiek)&&!ws.includes(i.wiek)) return false;                      
      if(loks.length&&isData(i.lokalizacja)&&!loks.includes(i.lokalizacja)) return false;    
      if(dnis.length&&isData(i.f_dni)&&!dnis.includes(i.f_dni)) return false;                
      return true;
    });
    listEl.innerHTML=list.map((it,k)=>polkCard(it,items.indexOf(it))).join("");
    emptyEl.hidden=list.length>0;
    tabsEl.querySelectorAll("button.cat-tab").forEach(b=>b.classList.toggle("active",b.dataset.c===typ));
    listEl.querySelectorAll("[data-polk]").forEach(b=>b.onclick=()=>openEntry(lessonEntryCtx(items[+b.dataset.polk],"polkolonie")));
  }
  tabsEl.querySelectorAll("button.cat-tab").forEach(b=>b.onclick=()=>{typ=b.dataset.c;draw();
    b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});});
  sideEl.querySelectorAll("input").forEach(i=>i.onchange=draw);   
  sideEl.querySelector("#clear-filters").onclick=()=>{sideEl.querySelectorAll("input").forEach(i=>i.checked=false);draw();};
  draw();
  setupFilterDrawer();
  tnmDeepLinkItem(items, "polkolonie", i=>(i.nazwa||"")+" "+(i.turnus||""));    
}




const FAQ_CHEV='<svg class="faq__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6l4 4 4-4"/></svg>';
function renderFaq(data, el){
  el.innerHTML=(data.faq||[]).map((f,i)=>{
    const has=isData(f.a);
    const ans=has?f.a:"We are working on a full answer. Write to us - we will gladly explain.";
    const open=(f.open||i===0)&&has;  
    return `<details class="faq__item${has?"":" faq__item--soft"}"${open?" open":""}>
      <summary>${f.q}${FAQ_CHEV}</summary>
      <p class="faq__answer">${ans}</p>
    </details>`;
  }).join("");
   
  const reveal=document.getElementById("faq-reveal");
  if(reveal){
    el.hidden=true; reveal.setAttribute("aria-expanded","false");
    reveal.onclick=()=>{const show=el.hidden; el.hidden=!show;
      reveal.setAttribute("aria-expanded",String(show)); reveal.classList.toggle("is-open",show);};
  }
}

 
function renderCatalog(items, el, opts={}){
  const audSel=opts.audience;
  let list=audSel?items.filter(i=>i.audience===audSel):items;
  const cats=[...new Set(list.map(i=>i.kategoria).filter(Boolean))];
  const bar=el.previousElementSibling;
  let active="*";
  function draw(){
    el.innerHTML=list.filter(i=>active==="*"||i.kategoria===active).map(i=>`
      <div class="card"><div class="card__body">
        <span class="card__role">${i.kategoria||""}</span>
        <h3>${i.nazwa}</h3>
        ${i.format?`<p class="card__quote">${i.format}</p>`:""}
        ${isData(i.opis)?`<p class="card__quote">${i.opis}</p>`:`<p class="muted">description [to be completed]</p>`}
      </div></div>`).join("");
  }
  if(bar && bar.classList.contains("filters")){
    bar.innerHTML=`<button class="chip active" data-c="*">Wszystkie</button>`+
      cats.map(c=>`<button class="chip" data-c="${c}">${c}</button>`).join("");
    bar.querySelectorAll(".chip").forEach(ch=>ch.onclick=()=>{
      bar.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
      ch.classList.add("active");active=ch.dataset.c;draw();
    });
  }
  draw();
}

function qsAud(){return new URLSearchParams(location.search).get("aud");}



function audienceNow(){
  const a=qsAud();
  if(a) return /doros/i.test(a)?"dorosli":"dzieci";
  const p=(location.pathname.split("/").pop()||"").toLowerCase();
  if(/doros/.test(p)) return "dorosli";
  if(/dzieci/.test(p)) return "dzieci";
  return null;
}

 
function setSubheroVideo(aud){
  const v=document.getElementById("subhero-video"); if(!v) return;
  const src=`assets/video/web/zajecia-${aud==="Dorosły"?"dorosli":"dzieci"}-1080.mp4`;
  if(!v.getAttribute("src").endsWith(src)){v.src=src;v.play?.().catch(()=>{});}
}





function initPartnerForm(){
  const form=document.getElementById("partner-form"); if(!form) return;
  try{ form.setAttribute("data-form-name","partner-b2b"); }catch(_){}    
  const openedAt=Date.now();                                   
  form.insertAdjacentHTML("afterbegin", TNMGuards.hpHTML());   
   
  const telWrap=form.querySelector('[data-pf-tel]');
  if(telWrap && !telWrap.querySelector("select")) telWrap.insertAdjacentHTML("afterbegin", TNMGuards.ccSelectHTML("pf-cc","+48"));
  const hidden=form.querySelector('input[name="rodzaj_wspolpracy"]');
  const otherWrap=form.querySelector(".pf-other");
  const otherInput=otherWrap?.querySelector("textarea");
  const msg=form.querySelector(".pf-msg");
  const syncOther=()=>{
    const on=(hidden?.value||"").toLowerCase().startsWith("inne");
    if(otherWrap) otherWrap.hidden=!on;
    if(otherInput) otherInput.required=on;
  };
   
  const selW=form.querySelector("[data-pf-select]");
  const selBtn=selW?.querySelector(".pf-select__btn");
  const selPanel=selW?.querySelector(".pf-select__panel");
  const selVal=selW?.querySelector(".pf-select__val");
  if(selW&&selBtn&&selPanel){
    const setOpen=o=>{selPanel.hidden=!o;selBtn.setAttribute("aria-expanded",String(o));selW.classList.toggle("is-open",o);};
    selBtn.addEventListener("click",e=>{e.stopPropagation();setOpen(selPanel.hidden);});
    selPanel.querySelectorAll(".pf-select__opt").forEach(o=>o.addEventListener("click",()=>{
      hidden.value=o.dataset.val;
      if(selVal){selVal.textContent=o.textContent.trim();selVal.classList.add("pf-select__val--set");}
      selPanel.querySelectorAll(".pf-select__opt").forEach(x=>x.classList.toggle("is-sel",x===o));
      setOpen(false); syncOther();
    }));
    document.addEventListener("click",e=>{ if(!selW.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") setOpen(false); });
  }
  syncOther();
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(msg){msg.textContent="";msg.className="pf-msg";}
    const data=Object.fromEntries(new FormData(form).entries());
    const fail=t=>{if(msg){msg.textContent=t;msg.classList.add("pf-msg--err");}};
     
    const elapsed=Date.now()-openedAt;
    const hpTripped=TNMGuards.hpFilled(form);    
     
    if(!TNMGuards.nameOk(data.instytucja_nazwa)) return fail("Enter the name of the institution.");
    if(!TNMGuards.personNameOk(data.osoba_imie)) return fail("Enter the first name of the person signing up (no digits).");
    if(!TNMGuards.personNameOk(data.osoba_nazwisko)) return fail("Enter the last name of the person signing up (no digits).");
    if(!TNMGuards.isEmail(data.osoba_email)) return fail("Enter a valid email address.");
    const cc=(form.querySelector(".pf-cc")&&form.querySelector(".pf-cc").value)||"+48";
    const ph=TNMGuards.normalizePhone(data.osoba_telefon,cc);
    if((data.osoba_telefon||"").trim() && !ph.ok)
      return fail(cc==="+48"?"Phone number: enter exactly 9 digits.":"Enter a valid phone number.");
    if((data.adres_kod||"").trim() && !/^\d{2}-\d{3}$/.test(data.adres_kod.trim()))
      return fail("Postcode in the 00-000 format.");
    if(otherWrap && !otherWrap.hidden && !(data.rodzaj_opis||"").trim())
      return fail("Describe what you need in the field below.");
     
    if(!form.consent_rodo || !form.consent_rodo.checked) return fail("Please tick the consent to data processing.");
    const btn=form.querySelector('[type="submit"]'); if(btn) btn.disabled=true;
    


    TNMWait.show({ onTimeout:()=>{ if(btn) btn.disabled=false;
      fail("Processing is taking longer than usual. Check your inbox in a moment or write to us: jestem@thenoisemakers.pl"); } });
     
    

    const oImie=(data.osoba_imie||"").trim(), oNazwisko=(data.osoba_nazwisko||"").trim();
    const imieNazwisko=[oImie,oNazwisko].filter(Boolean).join(" ");
    const meta=tnmMeta("partner-b2b"); meta.elapsed_ms=elapsed; meta.hp=hpTripped;
    const payload={
      meta:meta,
      consent:{ rodo:true, mkt:false },
      contact:{ imie_nazwisko:imieNazwisko||null, imie:oImie||null, nazwisko:oNazwisko||null,
        stanowisko:(data.osoba_stanowisko||"").trim()||null, email:TNMGuards.normEmail(data.osoba_email)||null, telefon:ph.e164||null },
      instytucja:{ nazwa:(data.instytucja_nazwa||"").trim()||null, zakres:(data.instytucja_zakres||"").trim()||null,
        adres:{ ulica:(data.adres_ulica||"").trim()||null, nr:(data.adres_nr||"").trim()||null, miasto:(data.adres_miasto||"").trim()||null, kod:(data.adres_kod||"").trim()||null } },
      answers:{ rodzaj_wspolpracy:data.rodzaj_wspolpracy||null, rodzaj_opis:(data.rodzaj_opis||"").trim()||null },
      answers_labeled:{ "Rodzaj współpracy":data.rodzaj_wspolpracy||null, "Doprecyzowanie (Inne)":(data.rodzaj_opis||"").trim()||null }
    };
    try{
      if(MAKE_WEBHOOK_PARTNERZY){
        const r=await fetch(MAKE_WEBHOOK_PARTNERZY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
        if(!r.ok) throw new Error("HTTP "+r.status);
        if(window.TNMTrack) TNMTrack("lead_submit",{form:payload.meta&&payload.meta.form, submission_id:payload.meta&&payload.meta.submission_id, page:payload.meta&&payload.meta.page});    
      }else{
        console.log("[partner-form] payload (DEMO - no MAKE_WEBHOOK_PARTNERZY):",payload);
        await new Promise(res=>setTimeout(res,300));
      }
      form.reset(); syncOther();
       
      if(selVal){selVal.textContent="Choose from the list";selVal.classList.remove("pf-select__val--set");}
      selPanel?.querySelectorAll(".pf-select__opt.is-sel").forEach(o=>o.classList.remove("is-sel"));
      if(hidden) hidden.value="";
      openThanks({surface:"partnerzy", button:false});   
    }catch(err){
      fail("Something went wrong. Write to us at jestem@thenoisemakers.pl.");
    }finally{ if(btn) btn.disabled=false; TNMWait.hide(); }    
  });
}
















const MAKE_WEBHOOK_ARTLETTER="https://hook.eu1.make.com/qvfd9ym3h2cnj3dhwmpmkne5ysb33as1";
function initArtletterForm(){
  const form=document.getElementById("artletter-form"); if(!form) return;
  try{ form.setAttribute("data-form-name","artletter"); }catch(_){}    
  const openedAt=Date.now();
  form.insertAdjacentHTML("afterbegin", TNMGuards.hpHTML());    
  const msg=form.querySelector("[data-artletter-msg]");
  const say=(t,err)=>{ if(!msg) return; msg.textContent=t; msg.className="pf-msg"+(err?" pf-msg--err":" pf-msg--ok"); };
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    say("");
    const data=Object.fromEntries(new FormData(form).entries());
    const elapsed=Date.now()-openedAt;
    






    const hpTripped=TNMGuards.hpFilled(form);    
    

    if(!TNMGuards.personNameOk(data.imie))     return say("Enter a first name.",true);
    if(!TNMGuards.personNameOk(data.nazwisko)) return say("Enter a last name.",true);
    if(!TNMGuards.isEmail(data.email)) return say("Enter a valid email address.",true);
    if(!form.consent_mkt.checked)  return say("Please tick the consent to receive the ARTletter.",true);
    if(!form.consent_rodo.checked) return say("Please tick the consent to data processing.",true);
    const btn=form.querySelector('[type="submit"]'); if(btn) btn.disabled=true;
    const meta=tnmMeta("newsletter"); meta.form="newsletter"; meta.elapsed_ms=elapsed; meta.hp=hpTripped;
    




    const imie=(data.imie||"").trim(), nazwisko=(data.nazwisko||"").trim();
    const pelneImie=[imie,nazwisko].filter(Boolean).join(" ");
    const payload={
      meta:meta,
      consent:{ rodo:true, mkt:true },
      contact:{ email:TNMGuards.normEmail(data.email)||null,
                imie_nazwisko:pelneImie||null, imie:imie||null, nazwisko:nazwisko||null },
      answers:{ zrodlo:"stopka-www" },
      answers_labeled:{ "Źródło zapisu":"Stopka strony" }
    };
    try{
      const r=await fetch(MAKE_WEBHOOK_ARTLETTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(!r.ok) throw new Error("HTTP "+r.status);
      if(window.TNMTrack) TNMTrack("lead_submit",{form:payload.meta&&payload.meta.form, submission_id:payload.meta&&payload.meta.submission_id, page:payload.meta&&payload.meta.page});    
      form.reset();
      


      say("Thank you. Check your inbox - we have sent an email confirming your sign-up.");
    }catch(err){ say("Something went wrong. Write to jestem@thenoisemakers.pl.",true); }
    finally{ if(btn) btn.disabled=false; }
  });
}

function initWaitlistForm(opts={}){
  const form=document.getElementById("waitlist-form"); if(!form) return;
   
  const SURF=opts.surface||"warsztaty", METAKEY=opts.metaKey||(SURF+"-waitlist"),
        ZAPIS=opts.zapisNa||"warsztaty-dorosli", ZAPISLBL=opts.zapisLabel||"Adult workshops (waiting list)";
  try{ form.setAttribute("data-form-name",METAKEY); }catch(_){}    
  const openedAt=Date.now();                                   
  form.insertAdjacentHTML("afterbegin", TNMGuards.hpHTML());   
   
   
  const telWrap=form.querySelector('[data-pf-tel]');
  if(telWrap && !telWrap.querySelector("select")) telWrap.insertAdjacentHTML("afterbegin", TNMGuards.ccSelectHTML("pf-cc","+48"));
  const msg=form.querySelector(".pf-msg");
   
  const multi=form.querySelector("[data-wf-multi]");
  const mHidden=multi?.querySelector('input[type="hidden"]');
  const mVal=multi?.querySelector(".pf-select__val");
  const mPanel=multi?.querySelector(".pf-select__panel");
  const selectedInterests=()=>multi?[...mPanel.querySelectorAll(".pf-select__opt.is-sel")].map(o=>o.dataset.val):[];
  if(multi){
    const mBtn=multi.querySelector(".pf-select__btn");
    const setOpen=o=>{mPanel.hidden=!o;mBtn.setAttribute("aria-expanded",String(o));multi.classList.toggle("is-open",o);};
    const sync=()=>{const sel=selectedInterests();if(mHidden)mHidden.value=sel.join(", ");
      if(mVal){mVal.textContent=sel.length?`Wybrano: ${sel.length}`:"Choose from the list";mVal.classList.toggle("pf-select__val--set",sel.length>0);}};
    mBtn.addEventListener("click",e=>{e.stopPropagation();setOpen(mPanel.hidden);});
    mPanel.querySelectorAll(".pf-select__opt").forEach(o=>o.addEventListener("click",()=>{o.classList.toggle("is-sel");sync();}));
    document.addEventListener("click",e=>{if(!multi.contains(e.target))setOpen(false);});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});
    sync();
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(msg){msg.textContent="";msg.className="pf-msg";}
    const data=Object.fromEntries(new FormData(form).entries());
    const fail=t=>{if(msg){msg.textContent=t;msg.classList.add("pf-msg--err");}};
     
    const elapsed=Date.now()-openedAt;
    const hpTripped=TNMGuards.hpFilled(form);    
    if(!TNMGuards.personNameOk(data.imie)) return fail("Enter a first name (no digits).");
    if(!TNMGuards.personNameOk(data.nazwisko)) return fail("Enter a last name (no digits).");
    if(!TNMGuards.isEmail(data.email)) return fail("Enter a valid email address.");
     
    let telefon=null;
    if((data.telefon||"").trim()!==""){
      const cc=(telWrap&&telWrap.querySelector("select")&&telWrap.querySelector("select").value)||"+48";
      const ph=TNMGuards.normalizePhone(data.telefon,cc);
      if(!ph.ok) return fail("The phone number looks incomplete. Correct it or leave the field empty.");
      telefon=ph.e164||null;
    }
     
    if(!form.consent_rodo || !form.consent_rodo.checked) return fail("Please tick the consent to data processing.");
    const btn=form.querySelector('[type="submit"]'); if(btn) btn.disabled=true;
     
    const wImie=(data.imie||"").trim(), wNazwisko=(data.nazwisko||"").trim();
    const imieNazwisko=[wImie,wNazwisko].filter(Boolean).join(" ");
    const interests=selectedInterests();
    const meta=tnmMeta(METAKEY); meta.elapsed_ms=elapsed; meta.hp=hpTripped;
    const payload={
      meta:meta,
      consent:{ rodo:true, mkt:false },
      contact:{ imie_nazwisko:imieNazwisko||null, imie:wImie||null, nazwisko:wNazwisko||null, email:TNMGuards.normEmail(data.email)||null, telefon:telefon },
       
      answers:{ zainteresowania:interests.length?interests:null, zapis_na:ZAPIS, audience:audienceNow() },
      answers_labeled:{ "Zainteresowania":interests.length?interests:null, "Zapis na":ZAPISLBL, "Audiencja":audienceNow() }
    };
    try{
      if(MAKE_WEBHOOK_WAITLIST){
        const r=await fetch(MAKE_WEBHOOK_WAITLIST,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
        if(!r.ok) throw new Error("HTTP "+r.status);
        if(window.TNMTrack) TNMTrack("lead_submit",{form:payload.meta&&payload.meta.form, submission_id:payload.meta&&payload.meta.submission_id, page:payload.meta&&payload.meta.page});    
      }else{ console.log("[waitlist-form] payload (DEMO - no MAKE_WEBHOOK_WAITLIST):",payload); await new Promise(res=>setTimeout(res,300)); }
      form.reset();
      form.querySelectorAll(".pf-select__opt.is-sel").forEach(o=>o.classList.remove("is-sel"));
      if(multi){ const v=multi.querySelector(".pf-select__val"); if(v){v.textContent="Choose from the list";v.classList.remove("pf-select__val--set");} if(mHidden) mHidden.value=""; }
      openThanks({surface:SURF, button:false});   
    }catch(err){ if(msg){msg.textContent="Something went wrong. Write to jestem@thenoisemakers.pl.";msg.classList.add("pf-msg--err");} }
    finally{ if(btn) btn.disabled=false; }
  });
}

document.addEventListener("DOMContentLoaded",mount);



window.TNMThx={photo:thxPhoto,audienceNow};
window.TNM={initArtletterForm,loadData,renderTeam,renderOpinie,renderOffer,initCarousels,mountCatalog,mountZespoly,mountPolkolonie,mountDniProbne,renderFaq,renderCatalog,openModal,openTerminModal,openBooking,closeBooking,openBookingIntro,openBookingThanks,openTeamPopup,openZespPopup,openPolkPopup,openVoucherModal,renderKonsultacjeValues,renderKonsultacjeTiles,openEntry,routeStep2,openThanks,ENTRY,initPartnerForm,initWaitlistForm,qsAud,isData,setSubheroVideo};
