




























(function () {
  "use strict";

  var CFG = window.KONF_CONFIG;
  if (!CFG) { console.error("[KONF] No KONF_CONFIG - load konfigurator-config.js before konfigurator.js"); return; }
  var G = window.TNMGuards || null;  

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  


  function tpl(s) {
    var D = CFG.DATY || {};
    return String(s == null ? "" : s)
      .replace(/\{D_ZAJECIA_K\}/g, D.zajeciaK || "")
      .replace(/\{D_POLKOLONIE_K\}/g, D.polkolonieK || "")
      .replace(/\{D_ZAJECIA\}/g, D.zajecia || "")
      .replace(/\{D_POLKOLONIE\}/g, D.polkolonie || "");
  }
  


  function tplRed(t) {
    var D = CFG.DATY || {};
    function b(v) { return '<b class="konf-red">' + esc(v || "") + '</b>'; }
    return esc(String(t == null ? "" : t))
      .replace(/\{D_ZAJECIA_K\}/g, b(D.zajeciaK))
      .replace(/\{D_POLKOLONIE_K\}/g, b(D.polkolonieK))
      .replace(/\{D_ZAJECIA\}/g, b(D.zajecia))
      .replace(/\{D_POLKOLONIE\}/g, b(D.polkolonie));
  }

   
  var qp = new URLSearchParams(location.search);
  var SS = {};
  try { SS = JSON.parse(sessionStorage.getItem("tnm_prefill") || "{}") || {}; } catch (e) { SS = {}; }
  function pf(key) {
    var v = qp.get(key);
    if (v != null && v !== "") return v;
    return (SS[key] != null && SS[key] !== "") ? String(SS[key]) : "";
  }
  var wariant = (function () {
    var k = pf("k");
    



    return (k === "feedback" || k === "polkolonie" || k === "wracam" || k === "diagnostyka" || k === "nowi") ? k : "wracam";
  })();
  var V = CFG.VARIANTS[wariant];
  document.body.setAttribute("data-konf", wariant);

   
  var SUBMISSION_ID = (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : "sid-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  var PAGE_TS = Date.now();  

  







  function scalName(imie, nazwisko) {
    return [String(imie || "").trim(), String(nazwisko || "").trim()].filter(Boolean).join(" ");
  }
  

  function splitName(full) {
    


    var t = String(full || "").replace(/[0-9]/g, "").trim().replace(/\s+/g, " ");
    if (!t) return { imie: "", nazwisko: "" };
    var i = t.indexOf(" ");
    return i < 0 ? { imie: t, nazwisko: "" } : { imie: t.slice(0, i), nazwisko: t.slice(i + 1) };
  }

   
  var state = {
    wariant: wariant,
    source_sid: pf("sid") || null,
    contact: { imie: "", nazwisko: "", imie_nazwisko: "", email: "", telefon: "", cc: "+48" },
    participants: [],    
    active: null,        
    cart: {},            
    resv: {},            
    ocart: {},           
    klub: [],            
     
    

    faktura: { on: false, firma: "", nip: "", ulica: "", kod: "", miejscowosc: "" },
    

    consents: { regulamin: false, rodo: false, wizerunek: false, odwolania: false }  
  };

  


  var rowsZ = {};                  
  





  var artclubSel = {};             
  var polRows = {};                
  var polDzien = {};               
  

  var POL2027 = CFG.POLKOLONIE_2027 || {};
  var POL2027_ON = !!POL2027.enabled;
  var pol2027 = { on: false, n: 1 };
var diagSel = {};               

  

  function newRowsZ() { return { ind: [""], mg: [""], naj: [""], zesp: [""], otw: [{ sku: "", termin: "" }] }; }    
  function newPolRows() { return [""]; }

   
  $("konf-badge").textContent = V.badge;
  $("konf-h1").innerHTML = V.h1;
  $("konf-intro-body").innerHTML = tpl(V.introHTML);
  if (POL2027_ON) {    
    document.querySelectorAll("#konf-intro-body .konf-priv li").forEach(function (li) {
      if (/półkoloni/i.test(li.textContent || "")) li.parentNode.removeChild(li);
    });
  }
  $("konf-dane-intro").innerHTML = V.daneIntro;

   
  var telWrap = $("c-tel-wrap");
  if (G && telWrap && !telWrap.querySelector("select")) {
    telWrap.insertAdjacentHTML("afterbegin", G.ccSelectHTML("intake-phone__cc", state.contact.cc));
  } else if (!G && telWrap && !telWrap.querySelector("select")) {
    telWrap.insertAdjacentHTML("afterbegin", '<select class="intake-phone__cc" aria-label="Prefiks kraju"><option value="+48" selected>+48 (PL)</option></select>');
  }
  if (G) $("sekcja-dane").insertAdjacentHTML("beforeend", G.hpHTML());

  var ccSel = telWrap ? telWrap.querySelector("select") : null;
  if (ccSel) ccSel.addEventListener("change", function () { state.contact.cc = ccSel.value; clearErr("c-tel"); });

  


  var pfName = splitName(pf("p"));
  $("c-imie").value = pfName.imie;
  $("c-nazwisko").value = pfName.nazwisko;
  $("c-email").value = pf("e");
  

  $("c-tel").value = (G && G.phoneFormat) ? G.phoneFormat(pf("tel"), state.contact.cc) : pf("tel");
  state.contact.imie = pfName.imie;
  state.contact.nazwisko = pfName.nazwisko;
  state.contact.imie_nazwisko = scalName(pfName.imie, pfName.nazwisko);
  state.contact.email = pf("e").trim();
  state.contact.telefon = $("c-tel").value;

  






  



  var pfWolacz = (pf("wol") || "").trim();
  if (state.source_sid && (pfWolacz || state.contact.imie_nazwisko)) {
    var R = (CFG.TEKSTY && CFG.TEKSTY.rozpoznanie) || null;
    if (R) {
      var hi = pfWolacz ? R.hiZImieniem.replace("{w}", pfWolacz) : R.hiBezImienia;
      $("konf-recog").innerHTML =
        '<div class="konf-recog">' +
          '<p class="konf-recog__hi">' + esc(hi) + '</p>' +
          '<p>' + esc(R.p1) + '<br>' + esc(R.p2) + '</p>' +
          '<p>' + esc(R.p3) + '</p>' +
        '</div>';
    }
  }

   
  function clearErr(id) { var el = $(id); if (el) el.classList.remove("is-invalid"); var er = $("c-err"); if (er) { er.hidden = true; er.textContent = ""; } }
  function softErr(id, msg) { var el = $(id); if (el) el.classList.add("is-invalid"); var er = $("c-err"); if (er) { er.hidden = false; er.textContent = msg; } }
  

  function syncContactName() {
    state.contact.imie = ($("c-imie").value || "").trim();
    state.contact.nazwisko = ($("c-nazwisko").value || "").trim();
    state.contact.imie_nazwisko = scalName(state.contact.imie, state.contact.nazwisko);
  }
  syncContactName();
  $("c-imie").addEventListener("input", function () { syncContactName(); clearErr("c-imie"); });
  $("c-nazwisko").addEventListener("input", function () { syncContactName(); clearErr("c-nazwisko"); });
  


  $("c-email").addEventListener("input", function () {
    state.contact.email = this.value.trim();
    clearErr("c-email");
    if (!G || G.isEmail(state.contact.email)) {
      



      oznaczWyceneNieaktualna();
      

      if (typeof window.KONF.onStructureChange === "function") window.KONF.onStructureChange();
    }
  });
  


  



  $("c-tel").addEventListener("input", function () {
    state.contact.telefon = this.value;
    clearErr("c-tel");
  });
  $("c-imie").addEventListener("blur", function () {
    if (this.value && G && !G.personNameOk(state.contact.imie)) softErr("c-imie", "Enter a first name (no digits).");
  });
  $("c-nazwisko").addEventListener("blur", function () {
    if (this.value && G && !G.personNameOk(state.contact.nazwisko)) softErr("c-nazwisko", "Enter a last name (no digits).");
  });
  $("c-email").addEventListener("blur", function () { if (this.value && G && !G.isEmail(this.value)) softErr("c-email", "Enter a valid email address."); });
  $("c-tel").addEventListener("blur", function () {
    if (!this.value || !G) return;
    var ph = G.normalizePhone(this.value, state.contact.cc);
    if (!ph.ok) softErr("c-tel", G.phoneMsg(state.contact.cc, this.value));
  });

   
  function validateContact() {
    if (!G) return { ok: true };
    

    if (!G.personNameOk(state.contact.imie)) { softErr("c-imie", "Enter a first name (no digits)."); return { ok: false, field: "c-imie" }; }
    if (!G.personNameOk(state.contact.nazwisko)) { softErr("c-nazwisko", "Enter a last name (no digits)."); return { ok: false, field: "c-nazwisko" }; }
    if (!G.isEmail(state.contact.email)) { softErr("c-email", "Enter a valid email address."); return { ok: false, field: "c-email" }; }
    var ph = G.normalizePhone(state.contact.telefon, state.contact.cc);
    if (!ph.ok) { softErr("c-tel", G.phoneMsg(state.contact.cc, state.contact.telefon)); return { ok: false, field: "c-tel" }; }
    return { ok: true, e164: ph.e164 };
  }

  


  var fkChk = $("f-chk"), fkBox = $("konf-faktura-fields");
  function fErr(id, msg) {
    var el = $(id); if (el) el.classList.add("is-invalid");
    var er = $("f-err"); if (er) { er.hidden = false; er.textContent = msg; }
  }
  function fErrClear() { var er = $("f-err"); if (er) { er.hidden = true; er.textContent = ""; } }
  if (fkChk) fkChk.addEventListener("change", function () {
    state.faktura.on = this.checked;
    if (fkBox) fkBox.hidden = !this.checked;
    if (!this.checked) fErrClear();
  });
  







  var GRUPY_NIP = [3, 2, 2, 3];
  var GRUPY_KOD = [2, 3];
  function grupuj(wart, grupy) {
    var d = String(wart == null ? "" : wart).replace(/[^\d]/g, "");
    var max = grupy.reduce(function (a, b) { return a + b; }, 0);
    d = d.slice(0, max);
    var out = [], i = 0;
    for (var g = 0; g < grupy.length && i < d.length; g++) { out.push(d.slice(i, i + grupy[g])); i += grupy[g]; }
    return out.join("-");
  }
  

  function nalozMaske(el, grupy) {
    var przed = el.value, pos = el.selectionStart;
    var cyfrPrzed = przed.slice(0, pos == null ? przed.length : pos).replace(/[^\d]/g, "").length;
    var po = grupuj(przed, grupy);
    if (po === przed) return;
    el.value = po;
    var licz = 0, nowyPos = po.length;
    for (var i = 0; i < po.length; i++) {
      if (/\d/.test(po[i])) licz++;
      if (licz === cyfrPrzed) { nowyPos = i + 1; break; }
    }
    if (cyfrPrzed === 0) nowyPos = 0;
    try { el.setSelectionRange(nowyPos, nowyPos); } catch (e) {   }
  }
  var MASKI = { "f-nip": GRUPY_NIP, "f-kod": GRUPY_KOD };

  [["f-firma", "firma"], ["f-nip", "nip"], ["f-ulica", "ulica"], ["f-kod", "kod"], ["f-miasto", "miejscowosc"]].forEach(function (pair) {
    var el = $(pair[0]); if (!el) return;
    el.addEventListener("input", function () {
      if (MASKI[pair[0]]) nalozMaske(this, MASKI[pair[0]]);
      state.faktura[pair[1]] = this.value; this.classList.remove("is-invalid"); fErrClear();
    });
     
    if (MASKI[pair[0]]) el.addEventListener("blur", function () {
      nalozMaske(this, MASKI[pair[0]]); state.faktura[pair[1]] = this.value;
    });
  });
  function nipOk(nip) {  
    if (!/^\d{10}$/.test(nip)) return false;
    var w = [6, 5, 7, 2, 3, 4, 5, 6, 7], s = 0;
    for (var i = 0; i < 9; i++) s += w[i] * +nip[i];
    return (s % 11) === +nip[9];
  }
  function validateInvoice() {
    if (!state.faktura.on) return { ok: true };
    var f = state.faktura;
    if (!f.firma.trim()) { fErr("f-firma", "Enter the company name for the invoice."); return { ok: false, field: "f-firma" }; }
    if (!nipOk(f.nip.replace(/[^\d]/g, ""))) { fErr("f-nip", "Enter a valid NIP (10 digits)."); return { ok: false, field: "f-nip" }; }
    if (!f.ulica.trim()) { fErr("f-ulica", "Enter the street and number."); return { ok: false, field: "f-ulica" }; }
    if (!/^\d{2}-\d{3}$/.test(f.kod.trim())) { fErr("f-kod", "Enter the postcode in the format 00-000."); return { ok: false, field: "f-kod" }; }
    if (!f.miejscowosc.trim()) { fErr("f-miasto", "Enter the town or city."); return { ok: false, field: "f-miasto" }; }
    return { ok: true };
  }

   
  var seq = 0;
  

  function todayISO() {
    var n = new Date();
    return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  }
  function wiekZ(dobStr) {  
    if (!dobStr) return null;
    var d = new Date(dobStr + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    var now = new Date();
    var a = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--;
    return (a >= 0 && a <= 120) ? a : null;
  }
  


  function addParticipant(name, wiek, prefilled, dob) {
    var pid = "p" + (++seq);
    var n = splitName(name);
    var d = (dob && /^\d{4}-\d{2}-\d{2}$/.test(String(dob).trim())) ? String(dob).trim() : "";
     
    if (d && d > todayISO()) d = "";
     
    var w = d ? wiekZ(d) : (wiek == null ? null : wiek);
    state.participants.push({ pid: pid, imie: n.imie, nazwisko: n.nazwisko, imie_nazwisko: scalName(n.imie, n.nazwisko),
      dob: d, wiek: (w == null ? null : w), lokalizacje: [], prefilled: !!prefilled });
    state.cart[pid] = {}; state.resv[pid] = {};
    rowsZ[pid] = newRowsZ();
    artclubSel[pid] = {}; polRows[pid] = newPolRows(); polDzien[pid] = { data: "" };
    state.active = pid;
    return pid;
  }
  function removeParticipant(pid) {
    state.participants = state.participants.filter(function (p) { return p.pid !== pid; });
    delete state.cart[pid]; delete state.resv[pid]; delete rowsZ[pid];
    delete artclubSel[pid]; delete polRows[pid]; delete polDzien[pid]; delete diagSel[pid];
    delete zestawDone[pid];
    if (state.active === pid) state.active = state.participants.length ? state.participants[state.participants.length - 1].pid : null;
    renderPeople(); syncPersonForm();
    notifyStructureChange();
  }
  function diagPids() {
    return state.participants.filter(function (p) { return diagSel[p.pid]; })
      .map(function (p) { return p.pid; });
  }
  function activeP() {
    for (var i = 0; i < state.participants.length; i++) if (state.participants[i].pid === state.active) return state.participants[i];
    return null;
  }

  







  pf("u").split(";").forEach(function (tok) {
    tok = tok.trim(); if (!tok) return;
    if (state.participants.length >= (CFG.MAX_OSOB || 10)) return;  
    var parts = tok.split("~");
    var nm = ""; try { nm = decodeURIComponent(parts[0]).trim(); } catch (e) { nm = String(parts[0] || "").trim(); }
    if (!nm) return;
    var w = parts[1] ? parseInt(parts[1], 10) : null;
    var dob = parts[2] ? String(parts[2]).trim() : "";
    addParticipant(nm, Number.isInteger(w) ? w : null, true, dob);
  });
  if (state.participants.length) state.active = state.participants[0].pid;

  var peopleBox = $("konf-people");
  var MAX_OSOB = CFG.MAX_OSOB || 10;  
  function chipLabel(p) { return p.imie_nazwisko || "New person"; }
  function renderPeople() {
    var html = state.participants.map(function (p) {
      return '<button type="button" class="konf-person' + (state.active === p.pid ? " is-on" : "") + '" data-pid="' + p.pid + '" role="tab" aria-selected="' + (state.active === p.pid) + '">' +
        '<span class="konf-person__nm">' + esc(chipLabel(p)) + '</span>' +
        '<span class="konf-person__rm" data-rm="' + p.pid + '" title="Remove person" aria-label="Remove person">&#10005;</span>' +
        '</button>';
    }).join("");
    

    if (state.participants.length < MAX_OSOB) {
      var t = CFG.TEKSTY.osoby || {};
      var lab = state.participants.length ? (t.dodajKolejna || "+ add another person") : (t.dodajPierwsza || "+ Add a person");
      html += '<button type="button" class="konf-addperson" data-add>' + esc(lab) + '</button>';
    }
    peopleBox.innerHTML = html;
    $("konf-people-empty").hidden = state.participants.length > 0;
    renderDiagRows();  
  }

   
  var pImie = $("p-imie"), pNazwisko = $("p-nazwisko"), pDob = $("p-dob"), pForm = $("konf-person-form");
  var locsBox = $("konf-locs");
  function syncPersonForm() {
    var p = activeP();
    pForm.hidden = !p;
    if (!p) return;
    pImie.value = p.imie || "";
    pNazwisko.value = p.nazwisko || "";
    pDob.value = p.dob || "";
    dobSetUI(p.dob || "");
    if (typeof dobClose === "function") dobClose();
    renderLocs();
  }
  

  function onPersonNameInput() {
    var p = activeP(); if (!p) return;
    p.imie = (pImie.value || "").trim();
    p.nazwisko = (pNazwisko.value || "").trim();
    p.imie_nazwisko = scalName(p.imie, p.nazwisko);
    var chip = peopleBox.querySelector('.konf-person[data-pid="' + p.pid + '"] .konf-person__nm');
    if (chip) chip.textContent = chipLabel(p);
    renderDiagRows();  
  }
  pImie.addEventListener("input", onPersonNameInput);
  pNazwisko.addEventListener("input", onPersonNameInput);

  


  function renderLocs() {
    if (!locsBox) return;
    var p = activeP(); if (!p) { locsBox.innerHTML = ""; return; }
    var tiles = (CFG.LOKALIZACJE || []).map(function (l) {
      var on = p.lokalizacje.indexOf(l) >= 0;
      return '<button type="button" class="konf-loc' + (on ? " is-on" : "") + '" data-loc="' + esc(l) + '"' +
        ' aria-pressed="' + (on ? "true" : "false") + '">' + esc(l) + '</button>';
    }).join("");
    if (!tiles) { locsBox.innerHTML = ""; return; }
    

    locsBox.innerHTML = '<span class="konf-locs__lab" id="konf-locs-lab">' + esc(CFG.TEKSTY.lokalizacjeLab) +
      (CFG.TEKSTY.lokalizacjeLab2 ? '<br>' + esc(CFG.TEKSTY.lokalizacjeLab2) : '') + '</span>' +
      '<div class="konf-locs__tiles" role="group" aria-labelledby="konf-locs-lab">' + tiles + '</div>';
  }
  if (locsBox) locsBox.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-loc]"); if (!b) return;
    var p = activeP(); if (!p) return;
    var loc = b.getAttribute("data-loc"), i = p.lokalizacje.indexOf(loc);
    if (i >= 0) p.lokalizacje.splice(i, 1); else p.lokalizacje.push(loc);
    b.classList.toggle("is-on", i < 0);
    b.setAttribute("aria-pressed", i < 0 ? "true" : "false");
  });
  pDob.addEventListener("change", function () {
    var p = activeP(); if (!p) return;
    p.dob = this.value || "";
    var w = wiekZ(p.dob);
    if (w != null) p.wiek = w;
     
    var audN = audOf(p), acs = artclubSel[p.pid] || {};
    Object.keys(acs).forEach(function (sku) {
      var it = SKU_INDEX[sku];
      if (it && it.audience && audN && it.audience !== audN) delete acs[sku];
    });
    

    var rz = rowsZ[p.pid];
    if (rz) ["ind", "mg", "naj", "zesp"].forEach(function (cat) {
      rz[cat] = (rz[cat] || []).map(function (sku) {
        var it = sku ? SKU_INDEX[sku] : null; if (!it) return sku;
        if (it.audience && audN && it.audience !== audN) return "";
        if (cat === "naj" && !najWiekOk(p)) return "";
          if (katZablokowanaDla3do5(cat, p)) return "";    
        return sku;
      });
    });
    notifyStructureChange();
  });

  







  var dobBtn = $("p-dob-btn"), dobVal = $("p-dob-val"), dobPop = $("p-dob-pop"), dobErr = $("p-dob-err");
  var dobD = $("p-dob-d"), dobM = $("p-dob-m"), dobY = $("p-dob-y"), dobOk = $("p-dob-ok"), dobClear = $("p-dob-clear");
  var dobSel = { d: "", m: "", y: "" };
  function dobTO() { return CFG.TEKSTY.osoby; }
  function dobOptHTML(v, txt) { return '<li role="option" aria-selected="false"><button type="button" class="konf-dob__opt" data-v="' + v + '">' + esc(txt) + '</button></li>'; }
  function dobBuildLists() {
    if (!dobD || !dobM || !dobY) return;
    var TO = dobTO(), nowY = new Date().getFullYear(), h = "", i;
    for (i = 1; i <= 31; i++) h += dobOptHTML(String(i).padStart(2, "0"), String(i));
    dobD.innerHTML = h; h = "";
    for (i = 0; i < 12; i++) h += dobOptHTML(String(i + 1).padStart(2, "0"), (TO.dobMiesiace && TO.dobMiesiace[i]) || String(i + 1));
    dobM.innerHTML = h; h = "";
    for (i = nowY; i >= nowY - 120; i--) h += dobOptHTML(String(i), String(i));
    dobY.innerHTML = h;
    if (dobOk) dobOk.textContent = TO.dobGotowe;
    if (dobClear) dobClear.textContent = TO.dobWyczysc;
  }
  function dobMark(list, v) {
    if (!list) return;
    list.querySelectorAll(".konf-dob__opt").forEach(function (b) {
      var on = b.getAttribute("data-v") === v && v !== "";
      b.classList.toggle("is-on", on);
      b.parentNode.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  function dobFmt(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); return m ? m[3] + "/" + m[2] + "/" + m[1] : ""; }
  function dobSetErr(msg) {
    if (dobErr) { dobErr.textContent = msg || ""; dobErr.hidden = !msg; }
    if (dobBtn) dobBtn.classList.toggle("is-invalid", !!msg);
  }
   
  function dobSetUI(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    dobSel = { y: m ? m[1] : "", m: m ? m[2] : "", d: m ? m[3] : "" };
    dobMark(dobD, dobSel.d); dobMark(dobM, dobSel.m); dobMark(dobY, dobSel.y);
    if (dobVal) { dobVal.textContent = m ? dobFmt(iso) : dobTO().dobPlaceholder; dobVal.classList.toggle("is-ph", !m); }
    dobSetErr("");
  }
  function dobPush(iso) {    
    if (pDob.value === iso) return;
    pDob.value = iso; pDob.dispatchEvent(new Event("change"));
  }
   
  function dobCompose() {
    var y = dobSel.y, m = dobSel.m, d = dobSel.d, TO = dobTO();
    if (!y || !m || !d) { dobSetErr(""); if (pDob.value) dobPush(""); if (dobVal) { dobVal.textContent = TO.dobPlaceholder; dobVal.classList.add("is-ph"); } return false; }
    var dim = new Date(+y, +m, 0).getDate();
    if (+d > dim) { dobSetErr(TO.bladDataDzien); dobPush(""); return false; }
    var iso = y + "-" + m + "-" + d;
    if (iso > todayISO()) { dobSetErr(TO.bladDataPrzyszla); dobPush(""); return false; }
    dobSetErr("");
    if (dobVal) { dobVal.textContent = dobFmt(iso); dobVal.classList.remove("is-ph"); }
    dobPush(iso);
    return true;
  }
  function dobScrollTo(list, v) {
    var b = list && v ? list.querySelector('.konf-dob__opt[data-v="' + v + '"]') : null;
    if (b) list.scrollTop = Math.max(0, b.offsetTop - list.clientHeight / 2 + b.offsetHeight / 2);
  }
  function dobOpen() {
    if (!dobPop || !dobBtn) return;
    dobPop.hidden = false; dobBtn.setAttribute("aria-expanded", "true");
    dobScrollTo(dobD, dobSel.d); dobScrollTo(dobM, dobSel.m); dobScrollTo(dobY, dobSel.y || String(new Date().getFullYear() - 10));
    document.addEventListener("keydown", dobOnKey); document.addEventListener("click", dobOnDoc, true);
  }
  function dobClose() {
    if (!dobPop || dobPop.hidden) return;
    dobPop.hidden = true; dobBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", dobOnKey); document.removeEventListener("click", dobOnDoc, true);
  }
  function dobOnKey(ev) { if (ev.key === "Escape") { dobClose(); dobBtn.focus(); } }
  function dobOnDoc(ev) { if (!ev.target.closest("#konf-dob")) dobClose(); }
  if (dobBtn && dobPop) {
    dobBuildLists();
    dobBtn.addEventListener("click", function () { if (dobPop.hidden) dobOpen(); else dobClose(); });
    dobPop.addEventListener("click", function (ev) {
      var b = ev.target.closest(".konf-dob__opt"); if (!b) return;
      var list = b.closest(".konf-dob__list"), v = b.getAttribute("data-v");
      if (list === dobD) dobSel.d = v; else if (list === dobM) dobSel.m = v; else if (list === dobY) dobSel.y = v;
      dobMark(list, v);
       
      if (dobCompose()) setTimeout(dobClose, 120);
    });
    if (dobOk) dobOk.addEventListener("click", function () { dobCompose(); dobClose(); dobBtn.focus(); });
    if (dobClear) dobClear.addEventListener("click", function () { dobSetUI(""); dobPush(""); dobD.scrollTop = 0; dobM.scrollTop = 0; });
  }

  



  var pOk = $("p-ok"), pErrEl = $("p-err");
  function pErrClear() { pImie.classList.remove("is-invalid"); pNazwisko.classList.remove("is-invalid"); if (pErrEl) { pErrEl.hidden = true; pErrEl.textContent = ""; } }
  if (pOk) {
    pOk.textContent = CFG.TEKSTY.osoby.zatwierdz;
    pOk.addEventListener("click", function () {
      var p = activeP(); if (!p) return;
      if (!p.imie) {
        pImie.classList.add("is-invalid");
        if (pErrEl) { pErrEl.hidden = false; pErrEl.textContent = CFG.TEKSTY.osoby.bladImie; }
        pImie.focus();
        return;
      }
       
      if (!p.nazwisko) {
        pNazwisko.classList.add("is-invalid");
        if (pErrEl) { pErrEl.hidden = false; pErrEl.textContent = CFG.TEKSTY.osoby.bladNazwisko || CFG.TEKSTY.osoby.bladImie; }
        pNazwisko.focus();
        return;
      }
      

      if (!p.dob) {
        dobSetErr(CFG.TEKSTY.osoby.bladData);
        if (pErrEl) { pErrEl.hidden = false; pErrEl.textContent = CFG.TEKSTY.osoby.bladData; }
        if (dobBtn) dobBtn.focus();
        return;
      }
      pErrClear();
      var pid = p.pid;
      state.active = null;
      renderPeople(); syncPersonForm();
      var blok = document.querySelector('.konf-zestaw[data-zpid="' + pid + '"]');
      if (blok) blok.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  [pImie, pNazwisko].forEach(function (el) { el.addEventListener("input", pErrClear); });

   
  peopleBox.addEventListener("click", function (ev) {
    var rm = ev.target.closest("[data-rm]");
    if (rm) { ev.stopPropagation(); removeParticipant(rm.getAttribute("data-rm")); return; }
    if (ev.target.closest("[data-add]")) {
      if (state.participants.length >= MAX_OSOB) return;  
      addParticipant("", null, false);
      renderPeople(); syncPersonForm();
      pImie.focus();
      notifyStructureChange();
      return;
    }
    var chip = ev.target.closest("[data-pid]");
    if (chip) {
      state.active = chip.getAttribute("data-pid");
      renderPeople(); syncPersonForm();
    }
  });

  renderPeople();
  syncPersonForm();

  









  function buildPayload(dry) {
    var ph = (G && state.contact.telefon) ? G.normalizePhone(state.contact.telefon, state.contact.cc) : null;
    var payload = {
      dry_run: !!dry,
      flow: "konfigurator",
      wariant: state.wariant,
      submission_id: SUBMISSION_ID,
      source_sid: state.source_sid,
      contact: {
         
        imie_nazwisko: scalName(state.contact.imie, state.contact.nazwisko),
        email: G ? G.normEmail(state.contact.email) : state.contact.email.toLowerCase(),
        telefon: (ph && ph.ok) ? ph.e164 : state.contact.telefon
      },
      paid_items: [],         
      reservation_items: [],  
      klub_tnm: state.klub.slice(),  
      














      answers: {
        imie: state.contact.imie,
        nazwisko: state.contact.nazwisko,
        

        diagnostyka: diagPids().length ? CFG.DIAGNOSTYKA.sku : null,
        diagnostyka_osoby: state.participants.filter(function (p) { return diagSel[p.pid]; })
          .map(function (p) { return p.imie_nazwisko; }).filter(Boolean),
        



        participants: state.participants.map(function (p) {
          return { imie: p.imie, nazwisko: p.nazwisko, imie_nazwisko: p.imie_nazwisko,
            dob: p.dob || null, wiek: p.wiek, status: audOf(p), lokalizacje: p.lokalizacje.slice() };
        })
      },
      

      invoice: state.faktura.on ? {
        firma: state.faktura.firma.trim(),
        nip: state.faktura.nip.replace(/[^\d]/g, ""),
        ulica: state.faktura.ulica.trim(),
        kod: state.faktura.kod.trim(),
        miejscowosc: state.faktura.miejscowosc.trim()
      } : null,
      



      consents: { regulamin: state.consents.regulamin, rodo: state.consents.rodo, wizerunek: state.consents.wizerunek, odwolania: state.consents.odwolania },
      


      meta: {
        locale: (document.documentElement && document.documentElement.lang) || "pl",
        page: location.pathname + location.search,
        


        utm: (typeof tnmUTM === "function") ? tnmUTM() : null,
        referrer: document.referrer || null,
        source_url: location.href,
        landing_url: (typeof tnmLanding === "function") ? tnmLanding() : null
      }
       
      , mkt: window.TNMTrack ? TNMTrack.mkt() : { consent: false, fbp: null, fbc: null, ua: String(navigator.userAgent || "").slice(0, 500) }    
    };
    var paidBySku = {}, resvBySku = {}, byPid = {};
    state.participants.forEach(function (p) { byPid[p.pid] = p; });
    




    function pinfo(pid) {
      var p = byPid[pid];
      return p ? { imie_nazwisko: p.imie_nazwisko, dob: p.dob || null, wiek: p.wiek, status: audOf(p) } : null;
    }
    getCartLines().forEach(function (ln) {
      var bucket = ln.platne ? paidBySku : resvBySku;
      

      var key = ln.sku + "|" + (ln.data || "");
      var e = bucket[key];
      if (!e) { e = bucket[key] = { sku: ln.sku, qty: 0, participants: [], _pids: {} }; }
      e.qty += ln.qty;
      if (ln.uczestnikId && !e._pids[ln.uczestnikId]) { e._pids[ln.uczestnikId] = 1; var pi = pinfo(ln.uczestnikId); if (pi) e.participants.push(pi); }
      if (ln.data) e.data = ln.data;
      

      if (ln.orderLevel) { e.order_level = true; e._osoby = ln.osoby; }
    });
    Object.keys(paidBySku).forEach(function (sku) { var e = paidBySku[sku]; delete e._pids; payload.paid_items.push(e); });
    Object.keys(resvBySku).forEach(function (sku) {
      var e = resvBySku[sku]; delete e._pids;
      if (e.order_level) { e.qty = e._osoby; delete e._osoby; } else { delete e.qty; }
      payload.reservation_items.push(e);
    });
    



    if (!dry) payload.restore_url = (typeof koszykRestoreUrl === "function") ? koszykRestoreUrl() : null;
    return payload;
  }

  


  var serverPricing = null;    
  var serverQuote = null;     



  var pricingStale = false;    
  var liczenieTrwa = false;   



  var dryBlad = "";            
  var lastDryKey = "";
  



  

  function dryKey(p) {
    var mail = (p.contact && p.contact.email) ? String(p.contact.email).toLowerCase() : "";
    var tel = (p.contact && p.contact.telefon) ? String(p.contact.telefon) : "";
    return JSON.stringify(p.paid_items) + "|" + JSON.stringify(p.reservation_items) + "|" + state.wariant + "|" + mail + "|" + tel;
  }
  














   
  function oznaczWyceneNieaktualna() {
    var probe = buildPayload(true);
    if (!probe.paid_items.length) { serverPricing = null; serverQuote = null; pricingStale = false; dryBlad = ""; return; }  
    if (!CFG.DRY_RUN_URL) { console.log("[KONF demo] dry_run payload:", probe); return; }
    

    if (dryKey(probe) === lastDryKey && serverPricing) { pricingStale = false; dryBlad = ""; return; }
    pricingStale = true;
    dryBlad = "";
  }

  





  function przeliczRabaty(done) {
    var cb = (typeof done === "function") ? done : function () {};
    var payload = buildPayload(true);
    if (!payload.paid_items.length) { serverPricing = null; serverQuote = null; pricingStale = false; dryBlad = ""; przerysujPanel(); cb(false); return; }
    if (!CFG.DRY_RUN_URL) { console.log("[KONF demo] dry_run payload:", payload); cb(false); return; }   
    if (liczenieTrwa) { cb(false); return; }    
    var myKey = dryKey(payload);
    liczenieTrwa = true;
    dryBlad = "";
    przerysujPanel();            
    

    if (typeof showKonfWait === "function") showKonfWait("rabaty");
    fetch(CFG.DRY_RUN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (typeof hideKonfWait === "function") hideKonfWait();
        



        if (myKey !== dryKey(buildPayload(true))) { liczenieTrwa = false; przerysujPanel(); cb(false); return; }
        if (j && j.pricing) {
          serverPricing = j.pricing; serverQuote = j.quote || null; lastDryKey = myKey;
          pricingStale = false; liczenieTrwa = false;
          if (typeof window.KONF.onPricing === "function") window.KONF.onPricing(j);  
          cb(!!serverQuote);
        } else {
          


          liczenieTrwa = false; dryBlad = TP.przeliczBlad; przerysujPanel(); cb(false);
        }
      })
      .catch(function () { if (typeof hideKonfWait === "function") hideKonfWait(); liczenieTrwa = false; dryBlad = TP.przeliczBlad; przerysujPanel(); cb(false); });
  }

   
  function wymagaPrzeliczenia() {
    var maPlatne = getCartLines().some(function (ln) { return ln.platne; });
    return !!(maPlatne && CFG.DRY_RUN_URL && (pricingStale || !serverQuote) && !liczenieTrwa);
  }

   
  function przerysujPanel() {
    if (typeof window.KONF.onStructureChange === "function") window.KONF.onStructureChange();
  }
  


  



  function notifyStructureChange() {
    rebuildCart();
    renderZestawy();
    updateArtclubUI();
    oznaczWyceneNieaktualna();    
    if (typeof window.KONF.onStructureChange === "function") window.KONF.onStructureChange();
    koszykZapiszPozniej();        
  }

  

  function cartChanged() {
    rebuildCart();
    oznaczWyceneNieaktualna();    
    if (typeof window.KONF.onStructureChange === "function") window.KONF.onStructureChange();
    koszykZapiszPozniej();        
  }

  










  var T = CFG.TEKSTY;
  var SKU_INDEX = {};                                      
  var KATALOG = { ind: [], mg: [], naj: [], loaded: false, error: false };    

  





  var POL_PCT = (V.polRabatPct != null) ? V.polRabatPct : CFG.POLKOLONIE.rabatPct;
  var POL_CENA = Math.round(CFG.POLKOLONIE.cenaBazowa * 100 * (100 - POL_PCT) / 100) / 100;

   
  function fmtC(v) { return (v % 1 === 0) ? String(v) : v.toFixed(2).replace(".", ","); }
  function round2(v) { return Math.round(v * 100) / 100; }
  var DIAK = { "Ą": "A", "Ć": "C", "Ę": "E", "Ł": "L", "Ń": "N", "Ó": "O", "Ś": "S", "Ź": "Z", "Ż": "Z" };
  function slugSku(n) {
    return n.toUpperCase().replace(/[ĄĆĘŁŃÓŚŹŻ]/g, function (c) { return DIAK[c] || c; })
      .replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
   
  function cleanNazwa(n) {
    return String(n || "").replace(/\(1:1\)/g, " ").replace(/\(małe grupy\)/g, " ")
      .replace(/\s+1:1(\s|$)/g, " ").replace(/\s{2,}/g, " ").trim();
  }
  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  function roman(n) { return ROMAN[n] || String(n); }
  function turnusLabel(t) { return "Session " + roman(parseInt(t.sku.replace(/\D/g, ""), 10)) + " " + t.termin; }
   
  function audOf(p) { if (!p || p.wiek == null) return null; return p.wiek >= 18 ? "Dorosły" : "Dziecko"; }
   
  function najWiekOk(p) { return !!(p && p.wiek != null && p.wiek >= 3 && p.wiek <= 5); }
  





  function katZablokowanaDla3do5(cat, p) { return (cat === "mg" || cat === "zesp") && najWiekOk(p); }
  



  


  function hasKarnetWide(pid) {
    var r = rowsZ[pid]; if (!r) return false;
    if (r.ind.some(Boolean) || r.mg.some(Boolean)) return true;
    return r.zesp.some(function (sku) { var it = sku && SKU_INDEX[sku]; return !!(it && it.x4); });
  }
  function anyKarnetWide() { return state.participants.some(function (p) { return hasKarnetWide(p.pid); }); }
  function isoToDate(iso) { return new Date(iso + "T00:00:00"); }
  function jutro() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 1); return d; }
  function toIso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  









  function turnusVisible(t) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (t.koniec) return now <= isoToDate(t.koniec);
    var m = /(\d{2})\.(\d{2})\.(\d{4})\s*$/.exec(t.termin); if (!m) return true;
    return new Date(+m[3], +m[2] - 1, +m[1]) >= now;
  }
  function turnusSellable(t) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (t.start) return now <= isoToDate(t.start);
    return turnusVisible(t);
  }
  function visibleTurnusy() { return CFG.POLKOLONIE.turnusy.filter(turnusVisible); }
  function sellableTurnusy() { return CFG.POLKOLONIE.turnusy.filter(turnusSellable); }
  function zestawHeading(p) { return V.zestaw.headingTpl.replace("{imie}", chipLabel(p)) + ":"; }

  












  function silnikWycenia(it) { return !!(it && it.silnik); }

   
  function buildSkuIndex() {
    CFG.ZESPOLOWE.forEach(function (it) {
      var karnet4 = it.typ === "karnet4";
      SKU_INDEX[it.sku] = {
        sku: it.sku, typ: karnet4 ? "zespolowe" : "dzien-probny", nazwa: it.nazwa, cykl: it.cykl,
        





        jednostki: (it.jednostki != null && it.jednostki !== "") ? Number(it.jednostki) : 1,
        cena: it.cena, cenaPrzyKarnecie: (it.cenaPrzyKarnecie != null ? it.cenaPrzyKarnecie : null),
        rezerwacja: !!it.rezerwacja, x4: karnet4,
        

        lista: it.lista || it.nazwa, audience: it.audience || "",
        label: karnet4 ? it.nazwa.toUpperCase() + " - 4 lessons" : it.nazwa.toUpperCase() + " - " + it.cykl
      };
    });
    CFG.ARTCLUB.items.forEach(function (it) {
      SKU_INDEX[it.sku] = { sku: it.sku, typ: "artclub", nazwa: it.nazwa, audience: it.audience || "", cena: CFG.ARTCLUB.cena, cenaPrzyKarnecie: CFG.ARTCLUB.cenaPrzyKarnecie, rezerwacja: false, x4: true, label: it.nazwa };
    });
    

    (CFG.OTWARTE ? CFG.OTWARTE.items : []).forEach(function (it) {
      SKU_INDEX[it.sku] = { sku: it.sku, typ: "otwarte", nazwa: it.nazwa, meta: it.meta || "", cena: it.cena,
        rezerwacja: false, silnik: it.sku === "LEKCJA-PROBNA", x4: false,
         
        terminy: it.terminy || null,
        label: it.nazwa + (it.meta ? " - " + it.meta : "") };
    });
    CFG.POLKOLONIE.turnusy.forEach(function (t) {
       
      SKU_INDEX[t.sku] = { sku: t.sku, typ: "polkolonie", nazwa: CFG.POLKOLONIE.label, termin: t.termin, cena: POL_CENA, cenaBazowa: CFG.POLKOLONIE.cenaBazowa, rezerwacja: false, silnik: true, x4: false, label: turnusLabel(t) };
    });
    var dz = CFG.POLKOLONIE.dzienPojedynczy;
     
    SKU_INDEX[dz.sku] = { sku: dz.sku, typ: "polkolonie-dzien", nazwa: "A single day of the day camp", cena: dz.cena, rezerwacja: false, x4: false, label: "A single day of the day camp" };
  }

   
  function loadCatalog() {
    if (!window.fetch) { KATALOG.error = true; return; }
    fetch("../data/content.en.json")
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        var seen = {};
        (j.zajecia || []).forEach(function (rec) {
           
          


          var cat = rec.format === "indywidualnie" ? "ind" : (rec.format === "mała grupa" ? "mg" : (rec.format === "dla najmłodszych (mała grupa)" ? "naj" : null));
          if (!cat) return;
          var nz = cleanNazwa(rec.nazwa_id || rec.nazwa); if (!nz) return;
          





          var aud = rec.audience || "";
          var key = cat + "|" + nz + "|" + aud; if (seen[key]) return; seen[key] = 1;
          

















          var cenaSku = parseInt(String(rec.cena || "").replace(/[^\d]/g, ""), 10);
          if (!cenaSku) cenaSku = (cat === "ind") ? CFG.CENY.INDYWIDUALNE : CFG.CENY.MALA_GRUPA;
          var cena = (rec.cena_lekcji != null && rec.cena_lekcji !== "") ? Number(rec.cena_lekcji) : cenaSku;
          





          














          var sku = (typeof rec.sku === "string" && rec.sku) ? rec.sku : "";
          if (!sku) {
          sku = (cat === "ind" ? "KARNET4-" : "KARNET4-MG-") + slugSku(nz);
          













          var ist = SKU_INDEX[sku];
          if (ist && (ist.cenaSku != null ? ist.cenaSku : ist.cena) !== cenaSku) sku += (aud === "Dorosły" ? "-DOR" : "-DZ");
          }
          










          

          var jedn = parseInt(rec.jednostki, 10) || 1;
          


          var entry = { sku: sku, kat: cat, typ: cat === "ind" ? "karnet-ind" : "karnet-mg", nazwa: nz, lista: rec.nazwa_lista || nz, audience: aud, cena: cena, cenaSku: cenaSku, jedn: jedn, rezerwacja: cat !== "ind", silnik: cat === "ind", x4: true, label: "KARNET " + nz.toUpperCase() + " - 4 lessons" };
          if (!SKU_INDEX[sku]) SKU_INDEX[sku] = entry;
          KATALOG[cat].push(entry);
        });
        

        KATALOG.zesp = j.konfigurator_zespolowe || {};
        KATALOG.ind.sort(function (a, b) { return a.nazwa.localeCompare(b.nazwa, "pl"); });
        KATALOG.naj.sort(function (a, b) { return a.nazwa.localeCompare(b.nazwa, "pl"); });
        KATALOG.mg.sort(function (a, b) { return a.nazwa.localeCompare(b.nazwa, "pl"); });
        KATALOG.loaded = true;
        renderZestawy();
        koszykPoKatalogu();    
      })
      .catch(function (e) { KATALOG.error = true; console.warn("[KONF] content.json unavailable:", e); renderZestawy(); koszykPoKatalogu(); });
  }

   
  















  function normTxt(s) {
    return String(s || "").toLowerCase().replace(/ł/g, "l")
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  



  var PROG_SZUKAJKI = 8;

   
  function comboLiHTML(it, selected) {
     
    if (it.hint) return '<li class="konf-combo__empty konf-combo__hint">' + esc(it.nazwa) + '</li>';
    var on = it.v === selected && it.v !== "";
    var cena = (it.cena != null && it.cena !== "") ? '<span class="konf-combo__pr">' + it.cena + '</span>' : "";
    return '<li role="option" aria-selected="' + on + '">' +
      '<button type="button" class="konf-combo__opt' + (on ? " is-on" : "") + (it.v === "" ? " konf-combo__opt--clear" : "") +
      '" data-copt="' + esc(it.v) + '" data-txt="' + esc(normTxt(it.txt != null ? it.txt : it.nazwa)) + '">' +
      '<span class="konf-combo__nm">' + esc(it.nazwa) + (it.meta ? '<span class="konf-combo__meta">' + esc(it.meta) + '</span>' : "") + '</span>' +
      cena + '</button></li>';
  }

   
  function comboBoxHTML(o) {
    var items = o.items || [];
    var wybrany = null;
    items.forEach(function (it) { if (it.v === o.value && it.v !== "") wybrany = it; });
    var lista = items.map(function (it) { return comboLiHTML(it, o.value); }).join("");
    var szukajka = (o.search != null) ? o.search : (items.length >= PROG_SZUKAJKI);
    return '<div class="konf-combo' + (o.klasa ? " " + o.klasa : "") + '" data-combo="' + esc(o.key) + '">' +
      '<button type="button" class="konf-combo__btn" data-cbtn aria-haspopup="listbox" aria-expanded="false"' +
      (o.disabled ? " disabled" : "") + ' aria-label="' + esc(o.ariaLabel || o.placeholder) + '" title="' + esc(T.szukajka.otworz) + '">' +
      '<span class="konf-combo__val' + (wybrany ? "" : " is-ph") + '">' + esc(wybrany ? wybrany.nazwa : o.placeholder) + '</span>' +
      '<span class="konf-combo__chev" aria-hidden="true"></span></button>' +
      '<div class="konf-combo__panel" hidden>' +
      (szukajka ? '<input type="text" class="konf-combo__search" data-csearch placeholder="' + esc(T.szukajka.placeholder) + '" aria-label="' + esc(T.szukajka.placeholder) + '">' : "") +
      '<ul class="konf-combo__list" role="listbox" aria-label="' + esc(o.ariaLabel || o.placeholder) + '">' +
      lista + '<li class="konf-combo__empty konf-combo__nores" hidden>' + esc(T.szukajka.brak) + '</li>' +
      '</ul></div></div>';
  }

   
  function katalogItems(cat, p, selected) {
    if (!KATALOG.loaded) return [];
    var aud = audOf(p), out = [];
    


    if (katZablokowanaDla3do5(cat, p)) { out.push({ v: "", nazwa: T.zestaw.dla3do5BrakKategorii, hint: true }); return out; }
    function push(e) { out.push({ v: e.sku, nazwa: e.lista || e.nazwa, cena: fmtC(e.cena) + " PLN x " + ((e.jedn || 1) > 1 ? e.jedn + " x 4" : "4") }); }
    if (aud) {
      KATALOG[cat].filter(function (e) { return e.audience === aud; }).forEach(push);
    } else {
      


      out.push({ v: "", nazwa: T.zestaw.brakPublicznosci, hint: true });
    }
     
    if (selected && SKU_INDEX[selected] && !out.some(function (x) { return x.v === selected; })) {
      var selIt = SKU_INDEX[selected];
      out.push({ v: selected, nazwa: selIt.lista || selIt.nazwa, cena: fmtC(selIt.cena) + " PLN x " + ((selIt.jedn || 1) > 1 ? selIt.jedn + " x 4" : "4") });
    }
    return out;
  }

  function comboHTML(p, cat, i, selSku) {
    var items = katalogItems(cat, p, selSku);
    var pre = [];
    if (selSku) pre.push({ v: "", nazwa: "Clear the selection", txt: "" });
    var lista = pre.concat(items.filter(function (x) { return !x.grupa; }));
     
    var html = comboBoxHTML({
      key: cat + "|" + p.pid + "|" + i,
      items: lista, value: selSku,
      placeholder: T.zestaw.selectPlaceholder,
      ariaLabel: cat === "ind" ? T.zestaw.katInd : (cat === "naj" ? T.zestaw.katNaj : T.zestaw.katMg),
      search: cat !== "naj"
    });
    if (!KATALOG.loaded) {
      html = html.replace('<li class="konf-combo__empty konf-combo__nores" hidden>',
        '<li class="konf-combo__empty">' + esc(KATALOG.error ? "We could not load the class list - refresh the page" : "Loading the class list...") +
        '</li><li class="konf-combo__empty konf-combo__nores" hidden>');
    }
    return html;
  }

  















  function zespItems(p, selSku) {
    var aud = audOf(p), out = [];
     
    if (katZablokowanaDla3do5("zesp", p)) { out.push({ v: "", nazwa: T.zestaw.dla3do5BrakKategorii, hint: true }); return out; }
    if (selSku) out.push({ v: "", nazwa: "Clear the selection", txt: "" });
    


    function pushZ(it) {
      var idx = SKU_INDEX[it.sku]; if (!idx) return;
      


      var jm = idx.jednostki || 1;
      var zl = (KATALOG.zesp || {})[it.sku + "|" + (it.audience || "")];
      out.push({ v: it.sku, nazwa: (zl && zl.nazwa_lista) || it.lista || idx.nazwa, cena: fmtC(round2(idx.cena * jm * 4)) + " PLN" });
    }
    if (aud) {
      CFG.ZESPOLOWE.filter(function (it) { return !it.audience || it.audience === aud; }).forEach(pushZ);
    } else {
       
      out.push({ v: "", nazwa: T.zestaw.brakPublicznosci, hint: true });
    }
    if (selSku && SKU_INDEX[selSku] && !out.some(function (x) { return x.v === selSku; })) {
      var selIt = SKU_INDEX[selSku];
      var zs = (KATALOG.zesp || {})[selSku + "|" + (selIt.audience || "")];
      out.push({ v: selSku, nazwa: (zs && zs.nazwa_lista) || selIt.lista || selIt.nazwa, cena: fmtC(round2(selIt.cena * (selIt.jednostki || 1) * 4)) + " PLN" });
    }
    return out;
  }

   
  function otwSkuItems(p, i, selSku) {
    var out = [];
    if (selSku) out.push({ v: "", nazwa: "Clear the selection", txt: "" });
    CFG.OTWARTE.items.forEach(function (o) {
      var idx = SKU_INDEX[o.sku]; if (!idx) return;
      out.push({ v: o.sku, nazwa: idx.label, meta: o.meta, cena: fmtC(idx.cena) + " PLN" });
    });
    return out;
  }

  






  function zajeteTerminy(pid, sku, pomijaneI) {
    var r = rowsZ[pid]; if (!r || !sku) return {};
    var zajete = {};
    r.otw.forEach(function (row, j) {
      if (j === pomijaneI) return;
      if (row.sku === sku && row.termin) zajete[row.termin] = true;
    });
    return zajete;
  }
  function otwTermItems(p, i) {
    var row = rowsZ[p.pid].otw[i] || { sku: "", termin: "" };
    if (!row.sku) return [];
    var it = SKU_INDEX[row.sku];
    var lista = (it && it.terminy) || CFG.OTWARTE.terminy;
    var zajete = zajeteTerminy(p.pid, row.sku, i);
    var out = [];
    if (row.termin) out.push({ v: "", nazwa: "Clear the selection", txt: "" });
    lista.forEach(function (t) {
      if (zajete[t.data] && t.data !== row.termin) return;    
      out.push({ v: t.data, nazwa: t.label });
    });
    return out;
  }

   
  function polItems(p, i, selSku) {
    var out = [];
    if (selSku) out.push({ v: "", nazwa: "Clear the selection", txt: "" });
    sellableTurnusy().forEach(function (t) {
      out.push({ v: t.sku, nazwa: turnusLabel(t), cena: fmtC(POL_CENA) + " zł" });
    });
    return out;
  }

  function filterCombo(panel, q) {
    if (!panel) return;
    var qq = normTxt(q).trim(), any = false;
    panel.querySelectorAll("li").forEach(function (li) {
      if (li.classList.contains("konf-combo__nores")) return;
      if (li.classList.contains("konf-combo__group")) { li.hidden = !!qq; return; }
      var b = li.querySelector("[data-copt]");
      if (!b) return;
      var hit = !qq || (b.getAttribute("data-txt") || "").indexOf(qq) >= 0;
      li.hidden = !hit;
      if (hit && b.getAttribute("data-copt")) any = true;
    });
    var nores = panel.querySelector(".konf-combo__nores");
    

    var maCo = panel.querySelectorAll('[data-copt]:not([data-copt=""])').length > 0;
    if (nores) nores.hidden = any || !maCo;
  }
  function closeCombos(except) {
    document.querySelectorAll(".konf-combo").forEach(function (c) {
      if (except && c === except) return;
      var pnl = c.querySelector(".konf-combo__panel"), btn = c.querySelector("[data-cbtn]");
      if (pnl && !pnl.hidden) pnl.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function selRowHTML(p, cat, i) {
    var pid = p.pid;
    var selSku = rowsZ[pid][cat][i];
    var it = selSku ? SKU_INDEX[selSku] : null;
    var priceTxt, promoHTML = "", cond = false;
    if (cat === "zesp") {
      











      var zBase = it ? it.cena : CFG.CENY.ZESPOLOWE_BAZA;
      if (it) {
        var zJedn = it.jednostki || 1;
        var zDzien = round2(zBase * zJedn);
        var zMies = round2(zDzien * 4);
        priceTxt = fmtC(zMies) + ' PLN' +
          '<span class="konf-item__calc">' + fmtC(zBase) + ' PLN × ' + zJedn +
          (zJedn === 1 ? ' lesson unit' : ' lesson units') + ' × 4 meetings' +
          (zJedn > 1 ? '<br>' + fmtC(zDzien) + ' PLN for one day' : '') + '</span>';
      } else {
         
        priceTxt = esc(T.zestaw.cenaPrzyklad.replace('{n}', fmtC(CFG.CENY_SUGESTIA.zesp)));
      }
    } else {
      var base = it ? it.cena : (cat === "ind" ? CFG.CENY.INDYWIDUALNE : CFG.CENY.MALA_GRUPA);
      var mJedn = (it && it.jedn) || 1;
      var pr = V.zestawPromo || { label: "", pct: 0 };
      if (mJedn > 1) {
        

        var mDzien = round2(base * mJedn), mMies = round2(mDzien * 4);
        priceTxt = fmtC(mMies) + ' PLN' +
          '<span class="konf-item__calc">' + fmtC(base) + ' PLN × ' + mJedn + ' lesson units × 4 meetings' +
          '<br>' + fmtC(mDzien) + ' PLN for one day</span>';
        if (pr.pct) {
          promoHTML = tplRed(pr.label) + '<br><b>' + fmtC(round2(mMies * (100 - pr.pct) / 100)) + ' PLN</b>';
          cond = true;
        }
      } else if (!it) {
         
        priceTxt = esc(T.zestaw.cenaPrzyklad.replace('{n}', fmtC(CFG.CENY_SUGESTIA[cat] || base)));
      } else {
        priceTxt = fmtC(base) + " PLN x 4";
        if (pr.pct) {
          promoHTML = tplRed(pr.label) + '<br><b>' + fmtC(round2(base * (100 - pr.pct) / 100)) + ' PLN x 4</b>';
          cond = true;  
        }
      }
    }
    var rm = i > 0 ? '<button type="button" class="konf-item__rm" data-zrm="' + pid + '|' + cat + '|' + i + '" aria-label="Remove row">&#10005;</button>' : "";
    var tag = (it && it.rezerwacja) ? '<p class="konf-item__tag">' + esc(T.zestaw.rezerwacjaTag) + '</p>' : "";
    var aria = cat === "ind" ? T.zestaw.katInd : (cat === "mg" ? T.zestaw.katMg : (cat === "naj" ? T.zestaw.katNaj : "Group work"));
     
    var picker = (cat === "zesp")
      ? comboBoxHTML({ key: "zesp|" + pid + "|" + i, items: zespItems(p, selSku), value: selSku,
          placeholder: T.zestaw.selectPlaceholderZesp, ariaLabel: "Group work" })
      : comboHTML(p, cat, i, selSku);
    return '<div class="konf-row"><div class="konf-item' + (cond ? " is-cond" : "") + '">' +
      picker +
      '<span class="konf-item__price">' + priceTxt + '</span>' +
      (promoHTML ? promoBoxHTML(promoHTML) : "") +
      rm + '</div>' + tag + '</div>';
  }

  



  function otwRowHTML(p, i) {
    var pid = p.pid;
    var row = rowsZ[pid].otw[i] || { sku: "", termin: "" };
    var it = row.sku ? SKU_INDEX[row.sku] : null;
    var O = CFG.OTWARTE;
    


    var wolne = otwTermItems(p, i);
    var maWolne = wolne.some(function (x) { return x.v !== ""; });
    var rm = i > 0 ? '<button type="button" class="konf-item__rm" data-orm="' + pid + '|' + i + '" aria-label="Remove row">&#10005;</button>' : "";
    var warn = (row.sku && !row.termin)
      ? '<p class="konf-item__tag konf-item__tag--warn">' + esc(maWolne ? O.bladTermin : O.brakWolnychTerminow) + '</p>'
      : "";
    return '<div class="konf-row"><div class="konf-item konf-item--otw">' +
      comboBoxHTML({ key: "otwsku|" + pid + "|" + i, items: otwSkuItems(p, i, row.sku), value: row.sku,
        placeholder: O.selectPlaceholder, ariaLabel: "Type of Let's meet meeting" }) +
      comboBoxHTML({ key: "otwterm|" + pid + "|" + i, items: wolne, value: row.termin,
        placeholder: O.terminPlaceholder, ariaLabel: "Date of the Let's meet meeting",
        klasa: "konf-item__term", disabled: !row.sku || (!maWolne && !row.termin) }) +
      '<span class="konf-item__price">' + (it ? fmtC(it.cena) + " PLN" : "") + '</span>' +
      rm + '</div>' + warn + '</div>';
  }
  



  function otwSectionHTML(p) {
    var O = CFG.OTWARTE;
    return '<section class="konf-box konf-box--otw" data-osec="' + p.pid + '">' +
      '<h2 class="konf-box__h">' + esc(O.heading) + '</h2>' +
      '<p class="konf-box__intro">' + esc(O.nota) + '</p>' +
      rowsZ[p.pid].otw.map(function (_, i) { return otwRowHTML(p, i); }).join("") +
      '<button type="button" class="konf-addrow" data-oadd="' + p.pid + '">' + esc(O.addRow) + '</button>' +
      '</section>';
  }
  function otwIncomplete() {
    return state.participants.some(function (p) {
      var r = rowsZ[p.pid];
      return !!r && r.otw.some(function (row) { return row.sku && !row.termin; });
    });
  }

  






  function revealOtwBrak() {
    var cel = null;
    state.participants.some(function (p) {
      var r = rowsZ[p.pid];
      if (!r) return false;
      return r.otw.some(function (row, i) {
        if (row.sku && !row.termin) { cel = { pid: p.pid, i: i }; return true; }
        return false;
      });
    });
    if (!cel) return false;
    if (V.zestawZwijanie && zestawDone[cel.pid]) { delete zestawDone[cel.pid]; renderZestawy(); }
    closeSheet();
    var combo = document.querySelector('[data-combo="otwterm|' + cel.pid + '|' + cel.i + '"]');
    if (!combo) { failTo("konf-zestawy"); return true; }
    combo.classList.add("is-invalid");
    combo.scrollIntoView({ behavior: "smooth", block: "center" });
    var btn = combo.querySelector("[data-cbtn]");
    if (btn) setTimeout(function () { btn.focus(); }, 350);
    return true;
  }

  






  function promoBoxHTML(inner) {
    return '<span class="konf-item__promo"><span class="konf-item__promo-in">' + inner + '</span></span>';
  }

  function catHTML(p, cat) {
    var label = cat === "ind" ? T.zestaw.katInd : (cat === "mg" ? T.zestaw.katMg : (cat === "naj" ? T.zestaw.katNaj : T.zestaw.katZesp));
    

    if (cat === "naj" && (!KATALOG.loaded || !KATALOG.naj.length)) return "";
    if (cat === "naj" && !najWiekOk(p)) {
      return '<p class="konf-cat">' + esc(label) + ':</p><p class="konf-cat__note">' + esc(T.zestaw.najPozaWiekiem) + '</p>';
    }
    


    var blok35 = katZablokowanaDla3do5(cat, p);
    






    var katNoty = (V.zestaw && V.zestaw.katNoty) || T.zestaw.katNoty || null;
    var nota = blok35 ? T.zestaw.dla3do5BrakKategorii : (katNoty ? (katNoty[cat] || "") : "");
    if (nota && label.slice(-1) !== ":") label += ":";
    var html = '<p class="konf-cat">' + esc(label) + '</p>';
    if (nota) html += '<p class="konf-cat__note">' + esc(nota) + '</p>';
    html += rowsZ[p.pid][cat].map(function (_, i) { return selRowHTML(p, cat, i); }).join("");
    if (!blok35) html += '<button type="button" class="konf-addrow" data-zadd="' + p.pid + '|' + cat + '">' + esc(T.zestaw.addRow) + '</button>';
    return html;
  }

  



  var zestawDone = {};

  

  function zestawBoxHTML(p, introPid) {
    return '<section class="konf-box konf-zestaw" data-zpid="' + p.pid + '">' +
      '<h2 class="konf-box__h">' + esc(zestawHeading(p)) + '</h2>' +
      

      (p.pid === introPid ? '<div class="konf-zintro">' + V.zestaw.introHTML + '</div>' : "") +
      catHTML(p, "ind") + catHTML(p, "mg") + catHTML(p, "naj") + catHTML(p, "zesp") +
      '</section>';
  }

  



  function osobaDoneHTML(p) {
    return '<section class="konf-box konf-zestaw konf-zestaw--done" data-zpid="' + p.pid + '">' +
      '<div class="konf-zdone">' +
      '<div class="konf-zdone__who"><span class="konf-zdone__nm">' + esc(chipLabel(p)) + '</span>' +
      '<span class="konf-zdone__nota">' + esc(T.zestaw.zamknietaNota) + '</span></div>' +
      '<button type="button" class="konf-zdone__edit" data-zedit="' + p.pid + '">' + esc(T.zestaw.edytuj) + '</button>' +
      '</div></section>';
  }

  



  var OSOBA_ORDER_FALLBACK = ["zestaw", "artclub", "otwarte", "polkolonie"];
  function osobaStackHTML(p, introPid) {
    if (V.zestawZwijanie && zestawDone[p.pid]) return osobaDoneHTML(p);
    var order = V.osobaOrder || OSOBA_ORDER_FALLBACK;
    var html = order.map(function (sec) {
      if (sec === "zestaw") return zestawBoxHTML(p, introPid);
      if (sec === "artclub") return artclubHTML(p);
      if (sec === "otwarte") return otwSectionHTML(p);
      if (sec === "polkolonie") return POL2027_ON ? "" : polSectionHTML(p);    
      return "";
    }).join("");
    if (V.zestawZwijanie) {
      html += '<div class="konf-zfoot"><button type="button" class="btn konf-zclose" data-zdone="' + p.pid + '">' + esc(T.zestaw.zamknij) + '</button></div>';
    }
    return '<div class="konf-osoba" data-opid="' + p.pid + '">' + html + '</div>';
  }

  function renderZestawy() {
    var host = $("konf-zestawy"); if (!host) return;
    if (!state.participants.length) {
      host.innerHTML = '<section class="konf-box"><h2 class="konf-box__h">' + esc(T.zestaw.pustyHeading) + '</h2>' +
        '<p class="konf-box__intro">' + esc(T.zestaw.pustyBody) + '</p></section>';
      return;
    }
    var introPid = null;
    for (var i = 0; i < state.participants.length; i++) {
      if (!(V.zestawZwijanie && zestawDone[state.participants[i].pid])) { introPid = state.participants[i].pid; break; }
    }
    host.innerHTML = state.participants.map(function (p) { return osobaStackHTML(p, introPid); }).join("");
  }

  




  function hsub(p) {
    return ' <span class="konf-box__hsub">for ' + esc(chipLabel(p)) + '</span>';
  }
  


  function artclubItemsFor(p) {
    var aud = audOf(p);
    var all = CFG.ARTCLUB.items;
    if (aud) return all.filter(function (it) { return !it.audience || it.audience === aud; });
    var out = [];
    [["Dziecko", T.artclub.grupaDzieci], ["Dorosły", T.artclub.grupaDorosli]].forEach(function (g) {
      var grp = all.filter(function (it) { return it.audience === g[0]; });
      if (grp.length) { out.push({ grupa: g[1] || g[0] }); out = out.concat(grp); }
    });
    all.filter(function (it) { return !it.audience; }).forEach(function (it) { out.push(it); });
    return out;
  }
  function artclubHTML(p) {
    var sel = artclubSel[p.pid] || {};
    var cond = anyKarnetWide();
    var rows = artclubItemsFor(p).map(function (it) {
      if (it.grupa) return '<div class="konf-cat konf-ac__grp">' + esc(it.grupa) + '</div>';
      var on = !!sel[it.sku];
      return '<label class="konf-item konf-item--chk' + (on ? " is-sel" : "") + (cond ? " is-cond" : "") + '">' +
        '<span class="konf-acbox"><input type="checkbox" data-ac="' + p.pid + '|' + it.sku + '"' + (on ? " checked" : "") + '>' +
        '<span class="konf-item__nm">' + esc(it.nazwa) + '</span></span>' +
        '<span class="konf-item__price">' + fmtC(CFG.ARTCLUB.cena) + ' zł</span>' +
        promoBoxHTML(esc(T.artclub.promoLabel) + '<br><b>' + fmtC(CFG.ARTCLUB.cenaPrzyKarnecie) + ' zł</b>') +
        '</label>';
    }).join("");
    return '<section class="konf-box konf-box--artclub" data-acsec="' + p.pid + '">' +
      '<h2 class="konf-box__h">' + esc(T.artclub.heading) + hsub(p) + '</h2>' +
      '<div class="konf-zintro">' + T.artclub.introHTML + '</div>' +
      '<div class="konf-acrows" data-acrows="' + p.pid + '">' + rows + '</div>' +
      '</section>';
  }
  






  function updateArtclubUI() {
    var on = anyKarnetWide();
    document.querySelectorAll("[data-acrows] .konf-item--chk").forEach(function (r) {
      r.classList.toggle("is-cond", on);
    });
  }

  





  function polRowsHTML(p) {
    


    var fut = sellableTurnusy();
    var trwa = visibleTurnusy().filter(function (t) { return !turnusSellable(t); });
    




    var trwaHTML = trwa.map(function (t) {
      return '<p class="konf-note konf-note--trwa"><b>' + esc(t.termin) + '</b> - this session has already started. ' +
        esc(TURNUS_TRWA_MSG.charAt(0).toUpperCase() + TURNUS_TRWA_MSG.slice(1)) +
        '. You can buy a single day of attendance below at any time while the session runs.</p>';
    }).join("");
    if (!fut.length) return '<p class="konf-empty">' + esc(T.polkolonie.brakTurnusow) + '</p>' + trwaHTML;
    var rows = (polRows[p.pid] || newPolRows());
    return rows.map(function (sku, i) {
      var rm = i > 0 ? '<button type="button" class="konf-item__rm" data-polrm="' + p.pid + '|' + i + '" aria-label="Remove entry">&#10005;</button>' : "";
      return '<div class="konf-row"><div class="konf-item is-cond">' +
        comboBoxHTML({ key: "pol|" + p.pid + "|" + i, items: polItems(p, i, sku), value: sku,
          placeholder: T.polkolonie.selectPlaceholder, ariaLabel: "Session date" }) +
        '<span class="konf-item__price">' + fmtC(CFG.POLKOLONIE.cenaBazowa) + ' zł</span>' +
        promoBoxHTML('- ' + POL_PCT + ' %<br><b>' + fmtC(POL_CENA) + ' zł</b>') +
        rm + '</div></div>';
    }).join("") + trwaHTML;
  }

  function polSectionHTML(p) {
    


    var tur = CFG.POLKOLONIE.turnusy;
    var maxIso = tur.length ? (tur[tur.length - 1].koniec || "") : "";
    var dataDnia = (polDzien[p.pid] && polDzien[p.pid].data) || "";
    var maAddBtn = sellableTurnusy().length > 0;
    return '<section class="konf-box konf-box--pol" data-polsec="' + p.pid + '">' +
      '<h2 class="konf-box__h">' + esc(V.polHeading) + hsub(p) + '</h2>' +
      '<p class="konf-box__intro">' + T.polkolonie.introHTML.replace("{pct}", POL_PCT) + '</p>' +
      '<p class="konf-sublabel">' + esc(T.polkolonie.wybierz) + '</p>' +
      '<div class="konf-pol-rows" data-polrows="' + p.pid + '">' + polRowsHTML(p) + '</div>' +
      (maAddBtn ? '<button type="button" class="konf-addrow" data-poladd="' + p.pid + '">' + esc(T.polkolonie.addRow) + '</button>' : "") +
      '<p class="konf-sublabel">' + esc(T.polkolonie.dzienIntro) + '</p>' +
      '<p class="konf-datelabel">' + esc(T.polkolonie.dzienLabel) + '</p>' +
      '<div class="konf-item konf-item--date">' +
      


      '<input type="date" data-poldate="' + p.pid + '"' + (dataDnia ? ' value="' + esc(dataDnia) + '"' : "") +
      ' min="' + toIso(jutro()) + '"' + (maxIso ? ' max="' + maxIso + '"' : "") +
      ' aria-label="Data pojedynczego dnia uczestnictwa - ' + esc(chipLabel(p)) + '">' +
      '<span class="konf-item__price">' + fmtC(CFG.POLKOLONIE.dzienPojedynczy.cena) + ' zł</span>' +
      '</div>' +
      '<p class="intake-err" data-poldateerr="' + p.pid + '" hidden></p>' +
      '</section>';
  }

  


  function polDzienBlad(d) {
    if (isNaN(d.getTime())) return T.polkolonie.bladDzienTydzien;
    var day = d.getDay();
    if (day === 0 || day === 6) return T.polkolonie.bladDzienTydzien;
    if (d < jutro()) return T.polkolonie.bladDzienMin;
    var wTurnusie = CFG.POLKOLONIE.turnusy.some(function (t) {
      return t.start && t.koniec && d >= isoToDate(t.start) && d <= isoToDate(t.koniec);
    });
    if (!wTurnusie) {
      return T.polkolonie.bladDzienTurnus.replace("{terminy}",
        CFG.POLKOLONIE.turnusy.map(function (t) { return t.termin; }).join(" · "));
    }
    return "";
  }
  function onPolDate(input) {
    var pid = input.getAttribute("data-poldate");
    if (!pid || !polDzien[pid]) return;
    var err = document.querySelector('[data-poldateerr="' + pid + '"]');
    var v = input.value || "";
    var msg = v ? polDzienBlad(isoToDate(v)) : "";
    if (msg) {
      input.classList.add("is-invalid");
      if (err) { err.hidden = false; err.textContent = msg; }
      polDzien[pid].data = "";
      cartChanged();
      return;
    }
    input.classList.remove("is-invalid");
    if (err) { err.hidden = true; err.textContent = ""; }
    polDzien[pid].data = v;
    cartChanged();
  }

  



  function diagRowsHTML() {
    var D = CFG.DIAGNOSTYKA;
    if (!state.participants.length) return '<p class="konf-empty">' + esc(D.pustaLista) + '</p>';
    return state.participants.map(function (p) {
      var on = !!diagSel[p.pid];
      return '<label class="konf-item konf-item--chk konf-diag__opt' + (on ? " is-sel" : "") + '">' +
        '<span class="konf-acbox">' +
        '<input type="checkbox" data-diag="' + p.pid + '"' + (on ? " checked" : "") + '>' +
        '<span class="konf-item__nm">' + esc(chipLabel(p)) + '</span></span>' +
        '<span class="konf-item__price">' + esc(D.cenaZero) + '</span>' +
        '</label>';
    }).join("");
  }
  

  function renderDiagRows() {
    var box = $("konf-diag-rows"); if (!box) return;
    box.innerHTML = diagRowsHTML();
  }
  function diagHTML() {
    var D = CFG.DIAGNOSTYKA;
    return '<section class="konf-box konf-box--diag" id="sekcja-diagnostyka" aria-labelledby="konf-diag-h">' +
      '<h2 class="konf-box__h" id="konf-diag-h">' + esc(D.heading) + '</h2>' +
      '<p class="konf-box__intro">' + esc(D.intro) + '</p>' +
      '<p class="konf-box__intro">' + esc(D.intro2) + '</p>' +
      '<p class="konf-diag__lab"><b>' + esc(D.wybierzLab) + '</b></p>' +
      '<div id="konf-diag-rows">' + diagRowsHTML() + '</div>' +
      '<p class="konf-diag__info">' + esc(D.miejsce) + '</p>' +
       
      (D.notaTermin ? '<p class="konf-diag__info">' + esc(D.notaTermin) + '</p>' : '') +
      '</section>';
  }

   
  function klubHTML() {
    return '<section class="konf-box konf-box--klub" id="sekcja-klub" aria-labelledby="konf-klub-h">' +
      '<h2 class="konf-box__h" id="konf-klub-h">' + esc(T.klub.heading) + '</h2>' +
      '<p class="konf-box__intro">' + esc(T.klub.intro) + '</p>' +
      '<div class="konf-chips" id="konf-klub-chips" role="group" aria-label="Zainteresowania Klub TNM">' +
      CFG.KLUB_TNM.zainteresowania.map(function (z) {
        return '<button type="button" class="konf-chip" data-klub="' + esc(z) + '" aria-pressed="false">' + esc(z) + '</button>';
      }).join("") +
      '</div></section>';
  }

  





  function pol2027Osoby(n) {
    var et = POL2027.osobyEtykiety || [];
    return et[n - 1] || String(n);
  }
  function pol2027Label() { return POL2027.koszyk + " - " + pol2027Osoby(pol2027.n); }
  function pol2027HTML() {
    var items = [], i;
    for (i = 1; i <= (POL2027.maxOsob || 5); i++) items.push({ v: String(i), nazwa: pol2027Osoby(i) });
    return '<section class="konf-box konf-box--pol2027" id="sekcja-polkolonie-2027">' +
      '<h2 class="konf-box__h">' + esc(POL2027.heading) + '</h2>' +
      '<p class="konf-box__intro">' + esc(POL2027.intro) + '</p>' +
      '<label class="konf-item konf-item--chk konf-pol2027__chk' + (pol2027.on ? " is-sel" : "") + '">' +
      '<span class="konf-acbox"><input type="checkbox" data-pol2027-on' + (pol2027.on ? " checked" : "") + '>' +
      '<span class="konf-item__nm">' + esc(POL2027.checkbox) + '</span></span></label>' +
      '<div class="konf-pol2027__n"' + (pol2027.on ? "" : " hidden") + '>' +
      '<p class="konf-sublabel">' + esc(POL2027.liczbaLabel) + '</p>' +
      '<div class="konf-item">' + comboBoxHTML({ key: "pol2027|order|0", items: items, value: String(pol2027.n), placeholder: pol2027Osoby(pol2027.n), ariaLabel: POL2027.liczbaLabel, search: false }) + '</div>' +
      '</div></section>';
  }
  function bindPol2027() {
    var sec = $("sekcja-polkolonie-2027"); if (!sec) return;
    sec.addEventListener("change", function (ev) {
      var cb = ev.target.closest("[data-pol2027-on]"); if (!cb) return;
      pol2027.on = !!cb.checked;
      var nb = sec.querySelector(".konf-pol2027__n"); if (nb) nb.hidden = !pol2027.on;
      var row = cb.closest(".konf-item--chk"); if (row) row.classList.toggle("is-sel", pol2027.on);
      cartChanged();
    });
    sec.addEventListener("click", function (ev) {
      var cbtn = ev.target.closest("[data-cbtn]");
      if (cbtn) {
        var combo = cbtn.closest(".konf-combo"), pnl = combo.querySelector(".konf-combo__panel"), willOpen = pnl.hidden;
        closeCombos(combo); pnl.hidden = !willOpen; cbtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
        return;
      }
      var copt = ev.target.closest("[data-copt]"); if (!copt) return;
      var n = parseInt(copt.getAttribute("data-copt"), 10);
      if (n >= 1 && n <= (POL2027.maxOsob || 5)) pol2027.n = n;
      cartChanged();
      sec.outerHTML = pol2027HTML(); bindPol2027();    
    });
  }
  function mountPol2027(host, top) {
    if (!POL2027_ON) return;
    var html = pol2027HTML();
    if (wariant === "polkolonie" && top) { top.innerHTML = html; }
    else {
      var klub = host.querySelector("[data-klub]"); var klubSec = klub ? klub.closest("section") : null;
      if (klubSec) klubSec.insertAdjacentHTML("beforebegin", html); else host.insertAdjacentHTML("beforeend", html);
    }
    bindPol2027();
  }

   
  




  function renderPurchaseSkeleton() {
    var host = $("sekcje-zakupowe"), top = $("sekcja-polkolonie-top");
    if (!host) return;
    host.innerHTML = ""; if (top) top.innerHTML = "";
    V.sectionOrder.forEach(function (s) {
      var html = "";
      if (s === "zestawy") html = '<div class="konf-zestawy" id="konf-zestawy"></div>';
      else if (s === "diagnostyka") html = diagHTML();
      else if (s === "klub") html = klubHTML();
      else return;  
      host.insertAdjacentHTML("beforeend", html);
    });
    mountPol2027(host, top);    
    bindPurchaseEvents();
  }

  function bindPurchaseEvents() {
    var zHost = $("konf-zestawy");
    if (zHost) {
      


      zHost.addEventListener("change", function (ev) {
        

        var acCb = ev.target.closest("[data-ac]");
        if (acCb) {
          var ka = acCb.getAttribute("data-ac").split("|");
          var acSel = artclubSel[ka[0]]; if (!acSel) return;
          if (acCb.checked) acSel[ka[1]] = true; else delete acSel[ka[1]];
          var acRow = acCb.closest(".konf-item--chk"); if (acRow) acRow.classList.toggle("is-sel", acCb.checked);
          cartChanged();
          return;
        }
         
        if (ev.target.closest("[data-poldate]")) { onPolDate(ev.target.closest("[data-poldate]")); return; }
      });
       
      zHost.addEventListener("input", function (ev) {
        var se = ev.target.closest("[data-csearch]"); if (!se) return;
        filterCombo(se.closest(".konf-combo__panel"), se.value);
      });
      zHost.addEventListener("click", function (ev) {
        var add = ev.target.closest("[data-zadd]");
        if (add) {
          var ka = add.getAttribute("data-zadd").split("|");
          if (rowsZ[ka[0]]) { rowsZ[ka[0]][ka[1]].push(""); renderZestawy(); }
          return;
        }
        var rm = ev.target.closest("[data-zrm]");
        if (rm) {
          var kr = rm.getAttribute("data-zrm").split("|");
          if (rowsZ[kr[0]]) { rowsZ[kr[0]][kr[1]].splice(+kr[2], 1); cartChanged(); renderZestawy(); updateArtclubUI(); }
          return;
        }
        var oadd = ev.target.closest("[data-oadd]");
        if (oadd) {
          var pid = oadd.getAttribute("data-oadd");
          if (rowsZ[pid]) { rowsZ[pid].otw.push({ sku: "", termin: "" }); renderZestawy(); }
          return;
        }
        var orm = ev.target.closest("[data-orm]");
        if (orm) {
          var kor = orm.getAttribute("data-orm").split("|");
          if (rowsZ[kor[0]]) { rowsZ[kor[0]].otw.splice(+kor[1], 1); cartChanged(); renderZestawy(); updateArtclubUI(); }
          return;
        }
        

        var padd = ev.target.closest("[data-poladd]");
        if (padd) {
          var pap = padd.getAttribute("data-poladd");
          if (polRows[pap]) { polRows[pap].push(""); renderZestawy(); }
          return;
        }
        var prm = ev.target.closest("[data-polrm]");
        if (prm) {
          var kpr = prm.getAttribute("data-polrm").split("|");
          if (polRows[kpr[0]]) { polRows[kpr[0]].splice(+kpr[1], 1); cartChanged(); renderZestawy(); }
          return;
        }
         
        var zdone = ev.target.closest("[data-zdone]");
        if (zdone) {
          var zdp = zdone.getAttribute("data-zdone");
          zestawDone[zdp] = true;
          renderZestawy();
          var card = document.querySelector('.konf-osoba[data-opid="' + zdp + '"], .konf-zestaw[data-zpid="' + zdp + '"]');
          if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        var zedit = ev.target.closest("[data-zedit]");
        if (zedit) {
          var zep = zedit.getAttribute("data-zedit");
          delete zestawDone[zep];
          renderZestawy();
          var opened = document.querySelector('.konf-osoba[data-opid="' + zep + '"]');
          if (opened) opened.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
         
        var cbtn = ev.target.closest("[data-cbtn]");
        if (cbtn) {
          var combo = cbtn.closest(".konf-combo");
          var pnl = combo.querySelector(".konf-combo__panel");
          var willOpen = pnl.hidden;
          closeCombos(combo);
          pnl.hidden = !willOpen;
          cbtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
          if (willOpen) {
            var se2 = pnl.querySelector("[data-csearch]");
            if (se2) { se2.value = ""; filterCombo(pnl, ""); se2.focus(); }
          }
          return;
        }
        

        var copt = ev.target.closest("[data-copt]");
        if (copt) {
          var ck = copt.closest(".konf-combo").getAttribute("data-combo").split("|");
          var rodzaj = ck[0], cpid = ck[1], ci = +ck[2], val = copt.getAttribute("data-copt");
          var rz = rowsZ[cpid];
          if (rodzaj === "ind" || rodzaj === "mg" || rodzaj === "naj" || rodzaj === "zesp") {
            if (!rz) return;
            rz[rodzaj][ci] = val;
          } else if (rodzaj === "otwsku") {
            if (!rz || !rz.otw[ci]) return;
            rz.otw[ci].sku = val;
            



            if (rz.otw[ci].termin) {
              var itO = val ? SKU_INDEX[val] : null;
              var listO = (itO && itO.terminy) || CFG.OTWARTE.terminy;
              var zaj = zajeteTerminy(cpid, val, ci);
              if (!val || zaj[rz.otw[ci].termin] ||
                  !listO.some(function (t) { return t.data === rz.otw[ci].termin; })) {
                rz.otw[ci].termin = "";
              }
            }
          } else if (rodzaj === "otwterm") {
            if (!rz || !rz.otw[ci]) return;
            rz.otw[ci].termin = val;
          } else if (rodzaj === "pol") {
            if (!polRows[cpid]) return;
            polRows[cpid][ci] = val;
          } else { return; }
          cartChanged();
          renderZestawy();  
          updateArtclubUI();
        }
      });
    }
    

    var diagRows = $("konf-diag-rows");
    if (diagRows) {
      diagRows.addEventListener("change", function (ev) {
        var cb = ev.target.closest("[data-diag]"); if (!cb) return;
        

        var pid = cb.getAttribute("data-diag");
        if (cb.checked) diagSel[pid] = true; else delete diagSel[pid];
        var row = cb.closest(".konf-item--chk"); if (row) row.classList.toggle("is-sel", cb.checked);
        cartChanged();
      });
    }
    var chips = $("konf-klub-chips");
    if (chips) {
      chips.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-klub]"); if (!b) return;
        var z = b.getAttribute("data-klub");
        var ix = state.klub.indexOf(z);
        if (ix >= 0) state.klub.splice(ix, 1); else state.klub.push(z);
        b.classList.toggle("is-on", ix < 0);
        b.setAttribute("aria-pressed", ix < 0 ? "true" : "false");
      });
    }
  }

   
  function rebuildCart() {
    state.cart = {}; state.resv = {}; state.ocart = {};
    state.participants.forEach(function (p) {
      state.cart[p.pid] = {}; state.resv[p.pid] = {};
      var r = rowsZ[p.pid]; if (!r) return;
      ["ind", "mg"].forEach(function (cat) {
        r[cat].forEach(function (sku) { if (sku) state.cart[p.pid][sku] = (state.cart[p.pid][sku] || 0) + 1; });
      });
      r.zesp.forEach(function (sku) {
        if (!sku) return;
        var it = SKU_INDEX[sku];
        if (it && it.rezerwacja) state.resv[p.pid][sku] = true;
        else state.cart[p.pid][sku] = (state.cart[p.pid][sku] || 0) + 1;
      });
    });
    



    state.participants.forEach(function (p) {
      var bucket = state.cart[p.pid]; if (!bucket) return;
      var ac = artclubSel[p.pid] || {};
      Object.keys(ac).forEach(function (sku) { bucket[sku] = (bucket[sku] || 0) + 1; });
      (polRows[p.pid] || []).forEach(function (sku) { if (sku) bucket[sku] = (bucket[sku] || 0) + 1; });
      if (polDzien[p.pid] && polDzien[p.pid].data) bucket[CFG.POLKOLONIE.dzienPojedynczy.sku] = 1;
    });
  }

  





  function getCartLines() {
    var lines = [];
     
    var acCond = anyKarnetWide();
    state.participants.forEach(function (p) {
      var r = rowsZ[p.pid]; if (!r) return;
      ["ind", "mg", "naj"].forEach(function (cat) {
        var cnt = {};
        r[cat].forEach(function (sku) { if (sku) cnt[sku] = (cnt[sku] || 0) + 1; });
        Object.keys(cnt).forEach(function (sku) {
          var it = SKU_INDEX[sku]; if (!it) return;
          

          var kupne = silnikWycenia(it);
          lines.push({ uczestnikId: p.pid, kat: cat, typ: cat === "ind" ? "karnet-ind" : "karnet-mg", sku: sku, produkt: it.nazwa, cenaJedn: it.cena, cenaBazowa: it.cena, x4: true, jedn: it.jedn || 1, qty: cnt[sku], platne: kupne, rezerwacja: !kupne, warunkowa: false });
        });
      });
      var zc = {};
      r.zesp.forEach(function (sku) { if (sku) zc[sku] = (zc[sku] || 0) + 1; });
      Object.keys(zc).forEach(function (sku) {
        var it = SKU_INDEX[sku]; if (!it) return;
        




        lines.push({ uczestnikId: p.pid, typ: "zespolowe", sku: sku, produkt: it.nazwa, cenaJedn: it.cena, cenaBazowa: it.cena, x4: true, jedn: it.jednostki || 1, qty: zc[sku], platne: !it.rezerwacja, rezerwacja: !!it.rezerwacja, warunkowa: false });
      });
      

      var oc = {};
      r.otw.forEach(function (row) {
        if (!row.sku || !row.termin) return;
        var k = row.sku + "|" + row.termin;
        oc[k] = (oc[k] || 0) + 1;
      });
      Object.keys(oc).forEach(function (k) {
        var parts = k.split("|");
        var it = SKU_INDEX[parts[0]]; if (!it) return;
        lines.push({ uczestnikId: p.pid, typ: "otwarte", sku: parts[0], produkt: it.nazwa, cenaJedn: it.cena, cenaBazowa: it.cena, x4: false, qty: oc[k], platne: true, rezerwacja: false, warunkowa: false, data: parts[1] });
      });

      



      var ac = artclubSel[p.pid] || {};
      Object.keys(ac).forEach(function (sku) {
        var it = SKU_INDEX[sku]; if (!it) return;
         
        lines.push({ uczestnikId: p.pid, typ: "artclub", sku: sku, produkt: it.nazwa, cenaJedn: acCond ? CFG.ARTCLUB.cenaPrzyKarnecie : CFG.ARTCLUB.cena, cenaBazowa: CFG.ARTCLUB.cena, x4: true, qty: 1, platne: true, rezerwacja: false, warunkowa: acCond });
      });

       
      var pc = {};
      (polRows[p.pid] || []).forEach(function (sku) { if (sku) pc[sku] = (pc[sku] || 0) + 1; });
      Object.keys(pc).forEach(function (sku) {
        var it = SKU_INDEX[sku]; if (!it) return;
        lines.push({ uczestnikId: p.pid, typ: "polkolonie", sku: sku, produkt: it.label, cenaJedn: POL_CENA, cenaBazowa: CFG.POLKOLONIE.cenaBazowa, x4: false, qty: pc[sku], platne: true, rezerwacja: false, warunkowa: false });
      });
      var dzien = polDzien[p.pid] && polDzien[p.pid].data;
      if (dzien) {
        var dz = CFG.POLKOLONIE.dzienPojedynczy;
        


        lines.push({ uczestnikId: p.pid, typ: "polkolonie-dzien", sku: dz.sku, produkt: "A single day of the day camp", cenaJedn: dz.cena, cenaBazowa: dz.cena, x4: false, qty: 1, platne: true, rezerwacja: false, warunkowa: false, data: dzien });
      }
    });

    


    if (POL2027_ON && pol2027.on) {
      lines.push({ uczestnikId: null, typ: "polkolonie-2027", sku: POL2027.sku, produkt: pol2027Label(), cenaJedn: 0, cenaBazowa: 0, x4: false, qty: 1, osoby: pol2027.n, platne: false, rezerwacja: true, warunkowa: false, orderLevel: true });
    }

    




    diagPids().forEach(function (pid) {
      lines.push({ uczestnikId: pid, typ: "diagnostyka", sku: CFG.DIAGNOSTYKA.sku, produkt: "Diagnostyka | Fundamenty", cenaJedn: 0, cenaBazowa: 0, x4: false, qty: 1, platne: false, rezerwacja: true, warunkowa: false });
    });
    return lines;
  }

  

  function getLocalTotals() {
    var lines = getCartLines(), razem = 0, rez = 0;
    lines.forEach(function (ln) {
      var amt = lineAmount(ln);    
      if (ln.platne) razem += amt; else rez += ln.qty;
    });
    return { razem_grosze: razem, rezerwacje: rez, lines: lines, note: T.wycenaNote };
  }

   
  document.addEventListener("click", function (ev) {
    if (!ev.target.closest(".konf-combo")) closeCombos(null);
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeCombos(null);
  });

   
  buildSkuIndex();
  state.participants.forEach(function (p) { if (!rowsZ[p.pid]) rowsZ[p.pid] = newRowsZ(); });
  renderPurchaseSkeleton();
  renderZestawy();    
  updateArtclubUI();
  rebuildCart();
  loadCatalog();
  


  [pImie, pNazwisko].forEach(function (el) {
    el.addEventListener("input", function () {
      var p = activeP(); if (!p) return;
      var h = document.querySelector('.konf-zestaw[data-zpid="' + p.pid + '"] .konf-box__h');
      if (h) h.textContent = zestawHeading(p);
       
      var nm = document.querySelector('.konf-zestaw[data-zpid="' + p.pid + '"] .konf-zdone__nm');
      if (nm) nm.textContent = chipLabel(p);
    });
  });

   
  window.KONF = {
    state: state,
    config: CFG,
    wariant: wariant,
    V: V,
    submissionId: SUBMISSION_ID,
    pageTs: PAGE_TS,
    esc: esc,
    wiekZ: wiekZ,
    addParticipant: function (name, wiek, prefilled, dob) { var pid = addParticipant(name, wiek, prefilled, dob); renderPeople(); syncPersonForm(); notifyStructureChange(); return pid; },
    removeParticipant: removeParticipant,
    renderPeople: renderPeople,
    syncPersonForm: syncPersonForm,
    validateContact: validateContact,
    buildPayload: buildPayload,
    

    scheduleDryRun: przeliczRabaty,
    przeliczRabaty: przeliczRabaty,
    oznaczWyceneNieaktualna: oznaczWyceneNieaktualna,
    getPricing: function () {
      return {
        serverPricing: serverPricing,
        pricingStale: pricingStale,
        liczenieTrwa: liczenieTrwa,
        blad: dryBlad,
        wymagaPrzeliczenia: wymagaPrzeliczenia()
      };
    },
     
    getCartLines: getCartLines,      
    getLocalTotals: getLocalTotals,  
    skuIndex: SKU_INDEX,             
    katalog: KATALOG,                
    renderZestawy: renderZestawy,    
    onStructureChange: null,  
    onPricing: null           
  };


  



















  var KOSZYK_ON = (CFG.KOSZYK_PAMIEC !== false) && (typeof window !== "undefined");
  var KOSZYK_KEY = "tnm_koszyk_v1";
  var KOSZYK_TTL_MS = ((CFG.KOSZYK_TTL_H != null ? CFG.KOSZYK_TTL_H : 48) * 3600 * 1000);
  var koszykTimer = null, koszykBlokada = false, koszykOdtworzono = false;

  function lsGet() { try { return JSON.parse(localStorage.getItem(KOSZYK_KEY) || "null"); } catch (e) { return null; } }
  function lsSet(o) { try { localStorage.setItem(KOSZYK_KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function koszykWyczysc() { koszykBlokada = true; try { localStorage.removeItem(KOSZYK_KEY); } catch (e) {} }

  function pidIdx(pid) { for (var i = 0; i < state.participants.length; i++) if (state.participants[i].pid === pid) return i + 1; return 0; }

   
  function koszykPozycje() {
    var out = [];
    state.participants.forEach(function (p, ix) {
      var i = ix + 1, r = rowsZ[p.pid] || newRowsZ(), cnt = {};
      function add(sku, data) { if (!sku) return; var k = sku + "|" + (data || ""); cnt[k] = (cnt[k] || 0) + 1; }
      r.ind.forEach(function (s) { add(s); }); r.mg.forEach(function (s) { add(s); }); (r.naj || []).forEach(function (s) { add(s); }); r.zesp.forEach(function (s) { add(s); });
      r.otw.forEach(function (row) { if (row.sku && row.termin) add(row.sku, row.termin); });
      Object.keys(artclubSel[p.pid] || {}).forEach(function (s) { add(s); });
      (polRows[p.pid] || []).forEach(function (s) { add(s); });
      if (polDzien[p.pid] && polDzien[p.pid].data) add(CFG.POLKOLONIE.dzienPojedynczy.sku, polDzien[p.pid].data);
      if (diagSel[p.pid]) add(CFG.DIAGNOSTYKA.sku);
      Object.keys(cnt).forEach(function (k) { var pr = k.split("|"); out.push({ i: i, sku: pr[0], qty: cnt[k], data: pr[1] || null }); });
    });
    return out;
  }
  function koszykSerializuj() {
    return {
      v: 1, wariant: state.wariant, ts: Date.now(),
      contact: { imie: state.contact.imie, nazwisko: state.contact.nazwisko, email: state.contact.email, telefon: state.contact.telefon, cc: state.contact.cc },
      faktura: { on: state.faktura.on, firma: state.faktura.firma, nip: state.faktura.nip, ulica: state.faktura.ulica, kod: state.faktura.kod, miejscowosc: state.faktura.miejscowosc },
      participants: state.participants.map(function (p) { return { imie: p.imie, nazwisko: p.nazwisko, dob: p.dob || "", wiek: p.wiek, lokalizacje: p.lokalizacje.slice() }; }),
      items: koszykPozycje(),
      klub: state.klub.slice()
    };
  }
  function koszykNiepusty(s) { return !!(s.participants.length || s.items.length || s.contact.email || s.contact.imie); }
  function koszykZapisz() {
    if (!KOSZYK_ON || koszykBlokada) return false;
    var s = koszykSerializuj();
    if (!koszykNiepusty(s)) { try { localStorage.removeItem(KOSZYK_KEY); } catch (e) {} return false; }
    return lsSet(s);
  }
  function koszykZapiszPozniej() {
    if (!KOSZYK_ON || koszykBlokada) return;
    if (koszykTimer) clearTimeout(koszykTimer);
    koszykTimer = setTimeout(koszykZapisz, 400);
  }

   
  function koszykParamC(items) {
    return (items || koszykPozycje()).map(function (it) { return it.i + "~" + it.sku + "~" + it.qty + (it.data ? "~" + it.data : ""); }).join(";");
  }
  function koszykRestoreUrl() {
    if (!KOSZYK_ON) return null;
    var u = state.participants.map(function (p) {
      return encodeURIComponent(p.imie_nazwisko || "") + "~" + (p.wiek == null ? "" : p.wiek) + (p.dob ? "~" + p.dob : "");
    }).join(";");
    var q = "k=" + encodeURIComponent(state.wariant);
    if (state.source_sid) q += "&sid=" + encodeURIComponent(state.source_sid);
    if (state.contact.imie_nazwisko) q += "&p=" + encodeURIComponent(state.contact.imie_nazwisko);
    if (state.contact.email) q += "&e=" + encodeURIComponent(state.contact.email);
    if (state.contact.telefon) q += "&tel=" + encodeURIComponent(state.contact.telefon);
    if (u) q += "&u=" + u;
    var c = koszykParamC();
    var base = location.origin + location.pathname;
    var full = base + "?" + q + (c ? "&c=" + encodeURIComponent(c) : "");
    if (full.length > 2048) full = base + "?" + q;    
    return full;
  }

  function koszykParsujC(str) {
    var out = [];
    String(str || "").split(";").forEach(function (tok) {
      var pr = tok.split("~"); if (pr.length < 2) return;
      var i = parseInt(pr[0], 10), qty = pr[2] ? parseInt(pr[2], 10) : 1;
      if (!(i > 0) || !pr[1]) return;
      out.push({ i: i, sku: pr[1], qty: (qty > 0 ? qty : 1), data: (pr[3] && /^\d{4}-\d{2}-\d{2}$/.test(pr[3])) ? pr[3] : null });
    });
    return out;
  }

   
  function koszykWstawPozycje(items) {
    var pominiete = 0;
    var dzSku = CFG.POLKOLONIE.dzienPojedynczy.sku, diagSku = CFG.DIAGNOSTYKA.sku;
    items.forEach(function (it) {
      var p = state.participants[it.i - 1];
      if (!p) { pominiete++; return; }
      var pid = p.pid, r = rowsZ[pid] || (rowsZ[pid] = newRowsZ());
      if (it.sku === diagSku) { diagSel[pid] = true; return; }
      if (it.sku === dzSku) { if (it.data) { polDzien[pid] = { data: it.data }; } else pominiete++; return; }
      var ix = SKU_INDEX[it.sku];
      if (!ix) { pominiete++; return; }
      var aud = audOf(p);
      if (ix.audience && aud && ix.audience !== aud) { pominiete++; return; }    
      function fill(arr, sku, n) { for (var q = 0; q < n; q++) { var slot = arr.indexOf(""); if (slot >= 0) arr[slot] = sku; else arr.push(sku); } }
      if (ix.typ === "karnet-ind") fill(r.ind, it.sku, it.qty);
      else if (ix.typ === "karnet-mg") {
        if (ix.kat === "naj" && !najWiekOk(p)) { pominiete++; return; }    
        

        if (ix.kat !== "naj" && katZablokowanaDla3do5("mg", p)) { pominiete++; return; }
        fill(ix.kat === "naj" ? r.naj : r.mg, it.sku, it.qty);
      }
      else if (ix.typ === "zespolowe" || ix.typ === "dzien-probny") {
        if (katZablokowanaDla3do5("zesp", p)) { pominiete++; return; }    
        fill(r.zesp, it.sku, it.qty);
      }
      else if (ix.typ === "otwarte") {
        if (!it.data) { pominiete++; return; }
        var lista = ix.terminy || CFG.OTWARTE.terminy;
        if (!lista.some(function (t) { return t.data === it.data; })) { pominiete++; return; }
        for (var q = 0; q < it.qty; q++) {
          var slot = -1;
          for (var z = 0; z < r.otw.length; z++) if (!r.otw[z].sku && !r.otw[z].termin) { slot = z; break; }
          if (slot >= 0) r.otw[slot] = { sku: it.sku, termin: it.data }; else r.otw.push({ sku: it.sku, termin: it.data });
        }
      }
      else if (ix.typ === "artclub") { artclubSel[pid] = artclubSel[pid] || {}; artclubSel[pid][it.sku] = true; }
      else if (ix.typ === "polkolonie") { polRows[pid] = polRows[pid] || newPolRows(); fill(polRows[pid], it.sku, it.qty); }
      else pominiete++;
    });
    return pominiete;
  }

  function koszykUstawKontakt(c) {
    if (!c) return;
    var pairs = [["c-imie", "imie"], ["c-nazwisko", "nazwisko"], ["c-email", "email"], ["c-tel", "telefon"]];
    pairs.forEach(function (pr) { var el = $(pr[0]); if (el && c[pr[1]] != null && !el.value) el.value = c[pr[1]]; });
    if (c.cc && ccSel) { ccSel.value = c.cc; state.contact.cc = c.cc; }
    syncContactName();
    state.contact.email = ($("c-email").value || "").trim();
    state.contact.telefon = $("c-tel").value;
  }
  function koszykUstawFakture(f) {
    if (!f || !f.on || !fkChk) return;
    fkChk.checked = true; state.faktura.on = true; if (fkBox) fkBox.hidden = false;
    [["f-firma", "firma"], ["f-nip", "nip"], ["f-ulica", "ulica"], ["f-kod", "kod"], ["f-miasto", "miejscowosc"]].forEach(function (pr) {
      var el = $(pr[0]); if (!el) return; el.value = f[pr[1]] || ""; state.faktura[pr[1]] = el.value;
    });
  }
  function koszykUstawKlub(lista) {
    (lista || []).forEach(function (z) {
      var b = document.querySelector('#konf-klub-chips [data-klub="' + String(z).replace(/"/g, "&quot;") + '"]');
      if (!b) return;
      if (state.klub.indexOf(z) < 0) state.klub.push(z);
      b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
    });
  }
  function nowySubmissionId() {
    SUBMISSION_ID = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "sid-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    if (window.KONF) window.KONF.submissionId = SUBMISSION_ID;
  }
  function fmtCzas(ts) {
    var d = new Date(ts); if (isNaN(d.getTime())) return "";
    function z(n) { return (n < 10 ? "0" : "") + n; }
    return z(d.getDate()) + "." + z(d.getMonth() + 1) + ", " + z(d.getHours()) + ":" + z(d.getMinutes());
  }
  function koszykPasek(tekst, pominiete) {
    var TK = (T && T.koszyk) || {};
    var host = document.getElementById("konf-restore");
    if (!host) {
      host = document.createElement("div"); host.id = "konf-restore"; host.className = "konf-restore"; host.setAttribute("role", "status");
      var dane = $("sekcja-dane"); if (dane && dane.parentNode) dane.parentNode.insertBefore(host, dane); else return;
    }
    host.innerHTML = '<p>' + esc(tekst) + (pominiete ? ' ' + esc(TK.pominiete || "") : '') + '</p>' +
      '<button type="button" class="btn konf-restore__btn" data-cart-reset>' + esc(TK.odNowa || "Start again") + '</button>';
    host.addEventListener("click", function (ev) {
      if (!ev.target.closest("[data-cart-reset]")) return;
      koszykWyczysc();
      try { sessionStorage.removeItem("tnm_prefill"); } catch (e) {}
      location.href = location.pathname + "?k=" + encodeURIComponent(state.wariant);
    });
  }

   
  function koszykPoKatalogu() {
    if (!KOSZYK_ON || koszykOdtworzono) return;
    koszykOdtworzono = true;
    var TK = (T && T.koszyk) || {};
    var cParam = qp.get("c");
    var restoreFlag = qp.get("restore") === "1";
    var maPrefill = !!(qp.get("p") || qp.get("e") || qp.get("u") || qp.get("sid"));
    if (cParam) {
       
      var pom = koszykWstawPozycje(koszykParsujC(cParam));
      nowySubmissionId();
      renderPeople(); syncPersonForm(); notifyStructureChange();
      koszykPasek(TK.przywroconyLink || "", pom);
      return;
    }
    var s = lsGet();
    if (!s || s.v !== 1 || s.wariant !== state.wariant) return;
    if (!s.ts || (Date.now() - s.ts) > KOSZYK_TTL_MS) { try { localStorage.removeItem(KOSZYK_KEY); } catch (e) {} return; }
    if (maPrefill && !restoreFlag) return;               
    if (state.participants.length) return;               
    koszykBlokada = true;                                
    koszykUstawKontakt(s.contact);
    koszykUstawFakture(s.faktura);
    (s.participants || []).forEach(function (sp) {
      if (state.participants.length >= (CFG.MAX_OSOB || 10)) return;
      var pid = addParticipant(scalName(sp.imie, sp.nazwisko), (sp.wiek == null ? null : sp.wiek), false, sp.dob || "");
      var p = state.participants[state.participants.length - 1];
      if (p && p.pid === pid) p.lokalizacje = (sp.lokalizacje || []).filter(function (l) { return (CFG.LOKALIZACJE || []).indexOf(l) >= 0; });
    });
    state.active = null;                                 
    var pom2 = koszykWstawPozycje(s.items || []);
    koszykUstawKlub(s.klub);
    nowySubmissionId();
    koszykBlokada = false;
    renderPeople(); syncPersonForm(); notifyStructureChange();
    koszykPasek((TK.przywrocony || "").replace("{czas}", fmtCzas(s.ts)), pom2);
    koszykZapisz();
  }

   
  if (KOSZYK_ON) {
    document.addEventListener("input", function (ev) { if (ev.target.closest("#sekcja-dane, #sekcja-uczestnicy, #konf-person-form")) koszykZapiszPozniej(); });
    document.addEventListener("click", function (ev) { if (ev.target.closest("[data-loc], [data-klub], #p-ok, [data-rm]")) koszykZapiszPozniej(); });
    document.addEventListener("change", function (ev) { if (ev.target.closest("#p-dob, #f-chk")) koszykZapiszPozniej(); });
  }
  window.KONF.koszyk = { on: KOSZYK_ON, key: KOSZYK_KEY, zapisz: koszykZapisz, serializuj: koszykSerializuj, wyczysc: koszykWyczysc,
    restoreUrl: koszykRestoreUrl, paramC: koszykParamC, parsujC: koszykParsujC, odtworz: koszykPoKatalogu };

  





  var TP = T.podsumowanie;
  var asideEl = $("podsumowanie");

  function fmtZl(gr) {  
    return (gr % 100 === 0 ? String(Math.round(gr / 100)) : (gr / 100).toFixed(2).replace(".", ",")) + " zł";
  }
  function fmtData(iso) {  
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? m[3] + "." + m[2] + "." + m[1] : (iso || "");
  }
  function lineLabel(ln) {
    var base;
    


    if (ln.typ === "karnet-ind") base = T.zestaw.katInd + " | " + ln.produkt;
    else if (ln.typ === "karnet-mg") base = (ln.kat === "naj" ? T.zestaw.katNaj : T.zestaw.katMg) + " | " + ln.produkt;
    else if (ln.typ === "zespolowe") base = T.zestaw.katZesp + " | " + ln.produkt;
    else if (ln.typ === "polkolonie-dzien" || ln.typ === "otwarte") base = ln.produkt + " (" + fmtData(ln.data) + ")";
    else base = ln.produkt;  
    return (ln.qty > 1 ? ln.qty + " x " : "") + base;
  }
  function lineAmount(ln) {  
    

    return Math.round(ln.cenaJedn * 100) * ln.qty * (ln.jedn || 1) * (ln.x4 ? 4 : 1);
  }

  







  function serverBruttoPerSku() {
    var m = {};
    var srv = (serverPricing && !pricingStale) ? serverPricing : null;
    if (!srv || !srv.items) return m;
    srv.items.forEach(function (it) {
      if (!it || !it.sku) return;
      var q = (it.qty != null) ? it.qty : 1;
      var e = m[it.sku] || (m[it.sku] = { brutto: 0, qty: 0, unit: null, unitPo: null });
      e.brutto += (it.unit_grosze || 0) * q;
      e.qty += q;
      

      if (e.unit == null && it.unit_grosze != null) e.unit = it.unit_grosze;
      


      if (e.unitPo == null && it.unit_grosze_po_rabacie != null) e.unitPo = it.unit_grosze_po_rabacie;
    });
    return m;
  }

  









  function renderSumGroups() {
    var box = $("konf-sum-groups"); if (!box) return;
    


    var openState = {};
    box.querySelectorAll("details.konf-sum__os").forEach(function (el) {
      openState[el.getAttribute("data-pid")] = el.open;
    });
    var lines = getCartLines();
    if (!lines.length) { box.innerHTML = '<p class="konf-empty">' + esc(TP.pustyKoszyk) + '</p>'; return; }
    var srvSku = serverBruttoPerSku();
    var html = "";
    var byPidSum = {};
    state.participants.forEach(function (p) { byPidSum[p.pid] = p; });
    



    function kwoty(ln) {
      var e = srvSku[ln.sku];
      var bazaLok = Math.round(ln.cenaBazowa * 100) * ln.qty * (ln.jedn || 1) * (ln.x4 ? 4 : 1);
      if (e && e.unit != null) {
        var baza = e.unit * ln.qty;
        


        if (ln.typ === "artclub") baza = Math.max(baza, bazaLok);
        return { baza: baza, po: (e.unitPo != null ? e.unitPo : e.unit) * ln.qty };
      }
      if (e && e.qty > 0) { var u = Math.round(e.brutto / e.qty); return { baza: u * ln.qty, po: u * ln.qty }; }
      return { baza: bazaLok, po: lineAmount(ln) };
    }
    

    function cenaHTML(k) {
      return (k.baza > k.po)
        ? '<s class="konf-sum__old">' + fmtZl(k.baza) + '</s><span class="konf-sum__sep" aria-hidden="true">|</span>' + fmtZl(k.po)
        : fmtZl(k.po);
    }
    function ktoSuffix(ln) {
      var kto = ln.uczestnikId && byPidSum[ln.uczestnikId] ? chipLabel(byPidSum[ln.uczestnikId]) : "";
      return kto ? " - " + esc(kto) : "";
    }

     
    state.participants.forEach(function (p) {
      var own = lines.filter(function (ln) { return ln.uczestnikId === p.pid && ln.platne; });
      if (!own.length) return;
      var wybrane = own.filter(function (ln) { return ln.typ !== "artclub" && ln.typ !== "otwarte"; });
      var artclub = own.filter(function (ln) { return ln.typ === "artclub"; });
      var poznajmy = own.filter(function (ln) { return ln.typ === "otwarte"; });
      var sumaB = 0, sumaP = 0;
      own.forEach(function (ln) { var k = kwoty(ln); sumaB += k.baza; sumaP += k.po; });
      

      var rola = (audOf(p) === "Dziecko") ? TP.osPodopieczny : TP.osUczestnik;
      var otw = (openState[p.pid] !== undefined) ? openState[p.pid] : true;
      html += '<details class="konf-sum__os"' + (otw ? " open" : "") + ' data-pid="' + p.pid + '">' +
        '<summary class="konf-sum__oshead"><span class="konf-sum__osname">' + esc(rola) + ' ' + esc(chipLabel(p)) + '</span>' +
        '<span class="konf-sum__ossuma">' + fmtZl(sumaP) + '</span><span class="konf-sum__oschev" aria-hidden="true"></span></summary>' +
        '<div class="konf-sum__osbody">';
      if (wybrane.length) {
        html += '<p class="konf-sum__sech">' + esc(TP.osWybrane) + '</p>';
        wybrane.forEach(function (ln, i) {
          html += '<p class="konf-sum__row"><span>' + (i + 1) + '. ' + esc(lineLabel(ln)) + '</span><span>' + cenaHTML(kwoty(ln)) + '</span></p>';
        });
        

        if (wybrane.some(function (ln) { return ln.x4; }))
          html += '<p class="konf-sum__dodnota">' + esc(TP.osWybraneNota) + '</p>';
      }
      if (artclub.length) {
        html += '<p class="konf-sum__sech">' + esc(TP.osArtclub) + '</p>';
        artclub.forEach(function (ln) {
          html += '<p class="konf-sum__row"><span>' + esc(lineLabel(ln)) + '</span><span>' + cenaHTML(kwoty(ln)) +
            ' <span class="konf-sum__meta">' + esc(TP.osArtclubMeta) + '</span></span></p>';
        });
        html += '<p class="konf-sum__dodnota">' + esc(TP.osArtclubNota) + '</p>';
      }
      if (poznajmy.length) {
        html += '<p class="konf-sum__sech">' + esc(TP.osPoznajmy) + '</p>';
        poznajmy.forEach(function (ln) {
          html += '<p class="konf-sum__row"><span>' + esc(lineLabel(ln)) + '</span><span>' + cenaHTML(kwoty(ln)) + '</span></p>';
        });
        html += '<p class="konf-sum__dodnota">' + esc(TP.osPoznajmyNota) + '</p>';
      }
       
      html += '<p class="konf-sum__row konf-sum__row--ossuma"><span>' + esc(TP.osSuma) + '</span><span>' +
        (sumaB > sumaP ? '<s class="konf-sum__old">' + fmtZl(sumaB) + '</s><span class="konf-sum__sep" aria-hidden="true">|</span>' : "") +
        fmtZl(sumaP) + '</span></p>';
      html += '</div></details>';
    });

    

    var order = lines.filter(function (ln) { return ln.platne && ln.uczestnikId === null; });
    if (order.length) {
      html += '<div class="konf-sum__g"><p class="konf-sum__gname">' + esc(TP.grupaZamowienie) + '</p>';
      order.forEach(function (ln) {
        html += '<p class="konf-sum__row"><span>' + esc(lineLabel(ln)) + '</span><span>' + cenaHTML(kwoty(ln)) + '</span></p>';
      });
      html += '</div>';
    }

    

    var oczekujace = lines.filter(function (ln) { return !ln.platne && ln.typ !== "diagnostyka"; });
    if (oczekujace.length) {
      html += '<div class="konf-sum__g konf-sum__g--wait"><p class="konf-sum__gname">' + esc(TP.grupaOczekujace) + '</p>';
      


      var maCeny = false;
      oczekujace.forEach(function (ln) {
        var kb = kwoty(ln).baza;
        var cenaTxt = (kb > 0)
          ? '<span class="konf-sum__oczek">' + fmtZl(kb) + '<span class="konf-sum__meta">' + esc(TP.oczekDzis) + '</span></span>'
          : esc(TP.oczekDzis);
        if (kb > 0) maCeny = true;
        html += '<p class="konf-sum__row"><span>' + esc(lineLabel(ln)) + ktoSuffix(ln) + '</span><span>' + cenaTxt + '</span></p>';
      });
      html += '<p class="konf-sum__dodnota">' + esc(TP.grupaOczekujaceNota) + (maCeny && TP.oczekCenyNota ? " " + esc(TP.oczekCenyNota) : "") + '</p></div>';
    }
     
    var diag = lines.filter(function (ln) { return ln.typ === "diagnostyka"; });
    if (diag.length) {
      var DD = CFG.DIAGNOSTYKA.dodatkowe;
      html += '<div class="konf-sum__g konf-sum__g--dod"><p class="konf-sum__gname">' + esc(DD.heading) + '</p>';
      diag.forEach(function (ln) {
        html += '<p class="konf-sum__row"><span>' + esc(DD.linia) + ktoSuffix(ln) + '</span><span></span></p>';
      });
      html += '<p class="konf-sum__dodnota">' + esc(DD.nota) + '</p></div>';
    }
    box.innerHTML = html;
  }

  



  function renderSumTotals() {
    var box = $("konf-sum-tot"); if (!box) return;
    var loc = getLocalTotals();
    var srv = (serverPricing && !pricingStale) ? serverPricing : null;
    var pay = srv ? srv.total_grosze : loc.razem_grosze;
    





    var razem = (srv && srv.total_brutto_grosze != null) ? srv.total_brutto_grosze : loc.razem_grosze;
    


    var subEl = document.querySelector(".konf-sum__sub");
    if (subEl) subEl.textContent = srv ? TP.sub : TP.subPrzed;
    var html = '<p class="konf-sum__row konf-sum__row--razem"><span>' + esc(TP.razem) + '</span><span>' + fmtZl(razem) + '</span></p>';
    if (srv && srv.discounts && srv.discounts.length) {
      srv.discounts.forEach(function (d) {
        html += '<p class="konf-sum__row konf-sum__row--rabat"><span>' + esc(d.label || d.code || V.rabatRowLabel) + '</span><span>-' + fmtZl(d.amount_grosze) + '</span></p>';
      });
    } else if (!srv && !pricingStale && loc.razem_grosze > 0 && V.rabatRowLabel) {
      







      html += '<p class="konf-sum__row konf-sum__row--rabat"><span>' + esc(V.rabatRowLabel) + '</span><span>' + esc(TP.rabatDemoWartosc) + '</span></p>';
    }
    if (loc.rezerwacje > 0) {
      html += '<p class="konf-sum__row konf-sum__row--rez"><span>' + esc(TP.rezerwacja) + '</span><span>' + loc.rezerwacje + '</span></p>';
      html += '<p class="konf-sum__reznota">' + esc(TP.rezerwacjaNota) + '</p>';
    }
    


    if (liczenieTrwa) html += '<p class="konf-sum__stale">' + esc(TP.przeliczamy) + '</p>';
    if (dryBlad) html += '<p class="konf-sum__stale">' + esc(dryBlad) + '</p>';
    


    var payHTML = (srv && razem > pay)
      ? '<s class="konf-sum__old">' + fmtZl(razem) + '</s><span class="konf-sum__sep" aria-hidden="true">|</span>' + fmtZl(pay)
      : fmtZl(pay);
    html += '<p class="konf-sum__pay"><span>' + esc(TP.placisz) + '</span><span>' + payHTML + '</span></p>';
    



     
    if (srv && srv.items_odrzucone && srv.items_odrzucone.length) {
      var odrz = srv.items_odrzucone.map(function (o) { return o.sku; }).join(", ");
      html += '<p class="konf-sum__stale">Some items are not available in this order (' + esc(odrz) + ') - we do not include them in the amount. Remove them from the cart or write to: jestem@thenoisemakers.pl</p>';
    }
    html += '<p class="konf-sum__note">' + esc(TP.finalNote) + '</p>';
    box.innerHTML = html;
    var barAmt = $("konf-bar-total");
    if (barAmt) barAmt.textContent = fmtZl(pay);
  }

  function renderSummary() { renderSumGroups(); renderSumTotals(); }

   
  function renderRabatyBlock() {
    var box = $("konf-sum-rabaty"); if (!box) return;
    




    if (!V.sumRabaty) { box.innerHTML = ""; return; }
    











    var przyw = null;
    



    var items = przyw
      ? przyw.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("")
      : (CFG.RABATY[wariant] || []).filter(function (r) { return !(POL2027_ON && r.pol); }).map(function (r) {
       
      return '<li>' + esc(tpl(r.label)) + (r.nota ? '<span class="konf-sum__rnota">' + esc(tpl(r.nota)) + '</span>' : "") + '</li>';
    }).join("");
    box.innerHTML =
      '<div class="konf-sum__rabaty">' +
      '<p class="konf-sum__rh">' + esc(V.sumRabaty.heading) + '</p>' +
       
      '<button type="button" class="konf-acc__btn" aria-expanded="false" aria-controls="konf-sum-racc"><span>' + esc(V.sumRabaty.heading) + '</span><span class="konf-acc__chev" aria-hidden="true"></span></button>' +
      '<div class="konf-sum__racc" id="konf-sum-racc">' +
      '<p class="konf-sum__rintro">' + esc(V.sumRabaty.intro) + '</p>' +
      '<ul class="konf-sum__rlist">' + items + '</ul>' +
      '</div></div>';
  }

   
  function renderConsentsBlock() {
    var box = $("konf-consents"); if (!box) return;
    

    var rows = CFG.ZGODY.map(function (z) {
      return '<label class="konf-consent" data-zgrow="' + z.id + '">' +
        '<input type="checkbox" data-zg="' + z.id + '"' + (state.consents[z.id] ? " checked" : "") +
        (z.wymagana ? ' required aria-required="true"' : "") + '>' +
        '<span>' + esc(z.tekst) + (z.wymagana ? '<span class="req" aria-hidden="true">*</span>' : "") + '</span></label>';
    }).join("");
    


    



    var ODW = window.TNMLegal && window.TNMLegal.odwolania;
    var odwHTML = ODW
      ? '<div class="konf-odw">' +
        '<p class="konf-odw__txt">' + esc(ODW.tekst) + '</p>' +
        '<label class="konf-consent" data-zgrow="odwolania">' +
        '<input type="checkbox" data-zg="odwolania"' + (state.consents.odwolania ? " checked" : "") + ' required aria-required="true">' +
        '<span>' + esc(ODW.zgoda) + '<span class="req" aria-hidden="true">*</span></span></label>' +
        '</div>'
      : "";
    box.innerHTML =
      '<div class="konf-consents">' + rows + '</div>' +
      odwHTML +
      (window.TNMLegal ? window.TNMLegal.note(["regulamin", "prywatnosc"]) : "") +
      '<p class="konf-consents__legend">* consents required to place the order</p>' +
      '<p class="intake-err" id="konf-sum-err" hidden role="status"></p>' +
      '<button type="button" class="btn konf-buy" id="konf-buy" aria-describedby="konf-sum-err">' +
      esc(TP.cta) + ' <span class="arr" aria-hidden="true">&gt;</span></button>';
    box.addEventListener("change", function (ev) {
      var cb = ev.target.closest("[data-zg]"); if (!cb) return;
      state.consents[cb.getAttribute("data-zg")] = cb.checked;
      var lab = cb.closest(".konf-consent"); if (lab) lab.classList.remove("is-invalid");
      clearSumErr();
      syncBuyState();
    });
    box.addEventListener("click", function (ev) {
      if (ev.target.closest("#konf-buy")) submitOrder();
    });
    syncBuyState();
  }

  


  function consentsOk() { return !!(state.consents.regulamin && state.consents.rodo && state.consents.odwolania); }
  function syncBuyState() {
    var btn = $("konf-buy"); if (!btn) return;
    var waiting = !consentsOk();
    btn.classList.toggle("is-waiting", waiting);
    btn.setAttribute("aria-disabled", waiting ? "true" : "false");
  }
  

  function blockOnConsents() {
    if (consentsOk()) return false;
    sumErr(TP.bledy.zgody);
    markConsents();
    var first = null;
    CFG.ZGODY.some(function (z) {
      if (!z.wymagana || state.consents[z.id]) return false;
      first = document.querySelector('[data-zgrow="' + z.id + '"] input'); return true;
    });
    if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { first.focus(); }, 250); }
    return true;
  }

  function sumErr(msg) { var el = $("konf-sum-err"); if (el) { el.hidden = false; el.textContent = msg; } }
  function clearSumErr() { var el = $("konf-sum-err"); if (el) { el.hidden = true; el.textContent = ""; } }
  function markConsents() {
    CFG.ZGODY.concat([{ id: "odwolania", wymagana: true }]).forEach(function (z) {
      if (!z.wymagana || state.consents[z.id]) return;
      var lab = document.querySelector('[data-zgrow="' + z.id + '"]');
      if (lab) lab.classList.add("is-invalid");
    });
  }

   
  function failTo(sectionId, fieldId) {
    closeSheet();
    var sec = $(sectionId);
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    if (fieldId) { var f = $(fieldId); if (f) setTimeout(function () { f.focus(); }, 350); }
  }

  function submitOrder() {
     
    var hpScope = $("sekcja-dane") || document;
    if (G && G.hpFilled(hpScope)) { sumErr(TP.bledy.antybot); failTo("sekcja-dane"); return; }
    if (G && (Date.now() - PAGE_TS) < G.MIN_MS) { sumErr(TP.bledy.zaSzybko); return; }
    clearSumErr();
    

    if (blockOnConsents()) return;
    var vc = validateContact();
    if (!vc.ok) { failTo("sekcja-dane", vc.field); return; }
     
    var vi = validateInvoice();
    if (!vi.ok) { failTo("sekcja-dane", vi.field); return; }
    if (!state.participants.length) { sumErr(TP.bledy.uczestnik); failTo("sekcja-uczestnicy"); return; }
    if (state.participants.some(function (p) { return !p.imie_nazwisko; })) { sumErr(TP.bledy.imiona); failTo("sekcja-uczestnicy"); return; }
     
    

    if (otwIncomplete()) { sumErr(CFG.OTWARTE.bladTermin); if (!revealOtwBrak()) failTo("konf-zestawy"); return; }
    if (!getCartLines().length) { sumErr(TP.bledy.pozycje); return; }

    


    var maPlatne = getCartLines().some(function (ln) { return ln.platne; });
    if (maPlatne && CFG.DRY_RUN_URL && (pricingStale || !serverQuote)) {
      






      if (liczenieTrwa) { sumErr(TP.bledy.wycenaWToku); return; }
      var kwotaNaEkranie = getLocalTotals().razem_grosze;
      przeliczRabaty(function (ok) {
        if (!ok) return;    
        if (serverPricing && serverPricing.total_grosze !== kwotaNaEkranie) {
          sumErr(TP.bledy.kwotaZmieniona);
          return;
        }
        submitOrder();      
      });
      return;
    }

    var payload = buildPayload(false);
    if (maPlatne && serverQuote) payload.quote = serverQuote;    
    payload.context_json = JSON.stringify(payload);  

    if (!CFG.SUBMIT_URL) {  
      console.log("[KONF demo] submit payload:", payload);
      openTyp();
      return;
    }
     
    var btn = $("konf-buy"); if (btn) btn.disabled = true;
    showKonfWait();    
    fetch(CFG.SUBMIT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.j && res.j.checkout_url) {
          if (window.TNMTrack) {    
            TNMTrack("checkout_start", { value: (serverPricing && serverPricing.total_grosze != null) ? serverPricing.total_grosze / 100 : null, currency: "PLN", num_items: payload.paid_items.reduce(function (n, it) { return n + (it.qty || 1); }, 0), contents: payload.paid_items.map(function (it) { return { id: it.sku, quantity: it.qty || 1 }; }), submission_id: payload.submission_id });
            TNMTrack.go(res.j.checkout_url); return;
          }
          location.href = res.j.checkout_url; return;    
        }
        hideKonfWait();    
        if (btn) btn.disabled = false;
        if (res.j && res.j.reserved) { koszykWyczysc(); openTyp(); return; }                
        



        if (res.status === 409 && res.j && (res.j.error === "quote_stale" || res.j.error === "quote_required")) {
          if (res.j.pricing) serverPricing = res.j.pricing;
          if (res.j.quote) { serverQuote = res.j.quote; pricingStale = false; lastDryKey = dryKey(buildPayload(true)); }
          renderSummary(); renderRabatyBlock();
          var POWODY_MSG = {
            deadline_minal: "The previous quote has expired",
            grupa_zmieniona: "The price has changed",
            katalog_zmieniony: "The price list has been updated in the meantime",
            reguly_zmienione: "The price list has been updated in the meantime",
            cena_zmieniona: "The price has changed"
          };
          var pw = (res.j.powody && res.j.powody[0]) || "";
          sumErr((POWODY_MSG[pw] || "The quote has changed") + " - check the new amount in the summary and click „" + TP.cta + "\u201d again.");
          return;
        }
        if (res.status === 409 && res.j && res.j.error === "sold_out") {
          var wolne = (res.j.available != null) ? res.j.available : 0;
          sumErr(wolne > 0
            ? "For the date you chose there are " + wolne + (wolne === 1 ? " miejsce" : " miejsca") + " - change the number of people or choose another session."
            : "The date you chose has just filled up. Choose another - we are refreshing availability.");
          przeliczRabaty(); return;    
        }
        if (res.status === 400 && res.j && res.j.error === "consents_required") { sumErr(TP.bledy.zgody); markConsents(); return; }
        if (res.status === 400 && res.j && res.j.error === "invalid_sku") {
          

          sumErr("One of the items you chose is not yet available to buy online. Write to us: jestem@thenoisemakers.pl - we will finish the sign-up together.");
          return;
        }
        



        if (res.status === 400 && res.j && res.j.error === "pol_dzien_invalid_date") {
          sumErr(T.polkolonie.bladDzienTurnus.replace("{terminy}",
            CFG.POLKOLONIE.turnusy.map(function (t) { return t.termin; }).join(" · ")));
          return;
        }
        if (res.status === 400 && res.j && res.j.error === "turnus_unavailable") {
          sumErr("The session you chose is no longer available for sign-up - choose another date.");
           
          renderZestawy(); przeliczRabaty();    
          return;
        }
        if (res.status === 400 && res.j && res.j.error === "invalid_invoice") {
          sumErr("Check the invoice details - the NIP must have 10 digits.");
          var fn = $("f-nip"); if (fn) fn.classList.add("is-invalid");
          return;
        }
        









        if (res.status === 502) { sumErr("We could not create the payment. Refresh the page and place the order again - clicking once more will not help on its own. If the error comes back, write to: jestem@thenoisemakers.pl"); return; }
        sumErr("We could not place the order. Try again or write to: jestem@thenoisemakers.pl");
      })
      .catch(function () {
        hideKonfWait();
        if (btn) btn.disabled = false;
        



        sumErr("We could not place the order. Check your connection and refresh the page - then try again. If the error comes back, write to: jestem@thenoisemakers.pl");
      });
  }


  














  function showKonfWait(mode) {
    var rab = (mode === "rabaty");
    window.TNMWait.show({
      title: rab ? TP.waitRabatyTitle : TP.waitZamowienieTitle,
      sub: rab ? TP.waitRabatySub : TP.waitZamowienieSub,
      timeout: rab ? 30000 : 60000,
      onTimeout: function () {
        if (rab) { liczenieTrwa = false; dryBlad = TP.przeliczBlad; przerysujPanel(); return; }
        var b = $("konf-buy"); if (b) b.disabled = false;
        sumErr("Processing is taking longer than usual. If the payment page does not open in a moment, click again or write to us: jestem@thenoisemakers.pl");
      }
    });
  }
  function hideKonfWait() { window.TNMWait.hide(); }

   
  var typLastFocus = null;
  function openTyp() {
    closeSheet();
    var m = $("konf-typ"); if (!m) return;
    typLastFocus = document.activeElement;
    m.classList.add("open");
    document.body.classList.add("konf-modal-lock");
    var x = $("konf-typ-close"); if (x) x.focus();
  }
  function closeTyp() {
    var m = $("konf-typ"); if (!m || !m.classList.contains("open")) return;
    m.classList.remove("open");
    document.body.classList.remove("konf-modal-lock");
    if (typLastFocus && typLastFocus.focus) typLastFocus.focus();
  }

   
  var mqSheet = window.matchMedia("(max-width:1180px)");
  var sheetLastFocus = null;
  function sheetOpen() { return document.body.classList.contains("konf-sheet-open"); }
  function openSheet() {
    if (!mqSheet.matches || sheetOpen()) return;
    sheetLastFocus = document.activeElement;
    document.body.classList.add("konf-sheet-open");
    asideEl.setAttribute("role", "dialog");
    asideEl.setAttribute("aria-modal", "true");
    asideEl.scrollTop = 0;
    var x = $("konf-sheet-close"); if (x) x.focus();
  }
  function closeSheet() {
    if (!sheetOpen()) return;
    document.body.classList.remove("konf-sheet-open");
    asideEl.removeAttribute("role");
    asideEl.removeAttribute("aria-modal");
    if (sheetLastFocus && sheetLastFocus.focus) sheetLastFocus.focus();
  }

  


  function wrapIntroPriv() {
    var ul = document.querySelector("#konf-intro-body .konf-priv");
    if (!ul) return;
    var wrap = document.createElement("div");
    wrap.className = "konf-privacc";
    ul.parentNode.insertBefore(wrap, ul);
    wrap.innerHTML = '<button type="button" class="konf-acc__btn" aria-expanded="false" aria-controls="konf-privacc-body"><span>' + esc(TP.przywilejeToggle) + '</span><span class="konf-acc__chev" aria-hidden="true"></span></button>';
    var body = document.createElement("div");
    body.className = "konf-privacc__body";
    body.id = "konf-privacc-body";
    body.appendChild(ul);
    wrap.appendChild(body);
  }

   
  function bindEtap3Events() {
    var barBtn = $("konf-bar-open");
    if (barBtn) barBtn.addEventListener("click", openSheet);
    var shX = $("konf-sheet-close");
    if (shX) shX.addEventListener("click", closeSheet);
    var typ = $("konf-typ");
    if (typ) {
      typ.addEventListener("click", function (ev) { if (ev.target === typ) closeTyp(); });
      var tx = $("konf-typ-close"); if (tx) tx.addEventListener("click", closeTyp);
    }
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") return;
      if (typ && typ.classList.contains("open")) { closeTyp(); return; }
      if (sheetOpen()) closeSheet();
    });
    

     
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest(".konf-acc__btn"); if (!b) return;
      var bodyEl = $(b.getAttribute("aria-controls")); if (!bodyEl) return;
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", open ? "false" : "true");
      bodyEl.classList.toggle("is-open", !open);
    });
     
    var onMq = function (e) { if (!e.matches) closeSheet(); };
    if (mqSheet.addEventListener) mqSheet.addEventListener("change", onMq);
    else if (mqSheet.addListener) mqSheet.addListener(onMq);
    


    [pImie, pNazwisko].forEach(function (el0) {
      el0.addEventListener("input", function () {
        var p = activeP(); if (!p) return;
        var el = document.querySelector('.konf-sum__gname[data-pid="' + p.pid + '"]');
        if (el) el.textContent = chipLabel(p);
      });
    });
  }

   
  document.body.classList.add("konf-js");  
  wrapIntroPriv();
  renderRabatyBlock();
  renderConsentsBlock();
  renderSummary();
  bindEtap3Events();
  window.KONF.onStructureChange = renderSummary;                  
  


  window.KONF.onPricing = function () { renderSummary(); renderRabatyBlock(); };       

  



  document.addEventListener("DOMContentLoaded", function () {
    var nl = document.querySelector('#site-footer input[type="email"]:not([aria-label])');
    if (nl) nl.setAttribute("aria-label", "Email address for the ARTletter newsletter");
  });
})();
