






















(function () {
  "use strict";

  


   
   
   
   
   
   
  const WAITLIST_GRUPY_WEBHOOK = "https://hook.eu1.make.com/aak7q5vvpmz0q956smj6lh38psq6bxyv";  
  const MAKE_WEBHOOKS = {
    "hero-skrocony": "https://hook.eu1.make.com/7qm5plx3763akk58hr34gfmpgkb7cby3",  
    "pelny": "https://hook.eu1.make.com/0yyygtxrt25bp835iuh2nklkjxmbggnx",          
    "zajecia-1na1": "https://hook.eu1.make.com/oyzdpp782knvbhwen7gmp51pxaxn6c6u",  
    "waitlist": "",       
    "waitlist-male-grupy": WAITLIST_GRUPY_WEBHOOK,  
    "waitlist-zespolowe": WAITLIST_GRUPY_WEBHOOK,   
    "newsletter": "https://hook.eu1.make.com/qvfd9ym3h2cnj3dhwmpmkne5ysb33as1"      
  };

  






  const SCS_HOOK = "https://hook.eu1.make.com/l3yngqomkib5w3be246t17ekbfur8smn";
   
   
  const SCS_LIVE = true;
   
  const SAV_HOOK = "https://hook.eu1.make.com/oeex8llaid88mu4f1brxfn9x8i8gbsu8";
  let AVAIL = null;  
  function fetchAvailability() {
    return fetch(SAV_HOOK).then((r) => r.json()).then((j) => { AVAIL = (j && j.availability) || null; return AVAIL; }).catch(() => null);
  }
  

  const POLKOLONIE_TURNUSY = [
    { sku: "POL-01", termin: "29.06 - 03.07.2026" }, { sku: "POL-02", termin: "06.07 - 10.07.2026" },
    { sku: "POL-03", termin: "13.07 - 17.07.2026" }, { sku: "POL-04", termin: "20.07 - 24.07.2026" },
    { sku: "POL-05", termin: "27.07 - 31.07.2026" }, { sku: "POL-06", termin: "03.08 - 07.08.2026" },
    { sku: "POL-07", termin: "10.08 - 14.08.2026" }, { sku: "POL-08", termin: "17.08 - 21.08.2026" },
    { sku: "POL-09", termin: "24.08 - 28.08.2026" }
  ];
  const POLKOLONIE_CENA = 1499;
   
  function turnusFuture(t) {
    const m = t.termin.match(/(\d{2})\.(\d{2})\.(\d{4})\s*$/);
    if (!m) return true;
    return new Date(+m[3], +m[2] - 1, +m[1], 23, 59) >= new Date();
  }
  const POLKOLONIE_OPTS = POLKOLONIE_TURNUSY.filter(turnusFuture)
    .map((t) => ({ v: t.sku, label: t.termin + "  ·  1 499 zł / dziecko" }));
   
  function polOptsWithAvail() {
    return POLKOLONIE_TURNUSY.filter(turnusFuture).map((t) => {
      const a = AVAIL && AVAIL[t.sku];
      let label = t.termin + "  ·  1 499 zł / dziecko";
      let off = false;
      if (a) {
        if (a.wolne <= 0) { label += "  ·  BRAK MIEJSC"; off = true; }
        else if (a.wolne <= 4) label += "  ·  zostały " + a.wolne + (a.wolne === 1 ? " miejsce" : " miejsca");
      }
      return { v: t.sku, label: label, off: off };
    });
  }

   
  const ICO_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
   
  const CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  const CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  const ICO_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>';
  const CARET = '<svg class="intake-phone__caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6l4 4 4-4"/></svg>';
   
  const FLAG_PL = '<svg class="intake-phone__flag" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" rx="2" fill="#fff"/><path d="M0 7h20v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7z" fill="#dc143c"/></svg>';

   
  const DAYS = [
    "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"
  ].map((d) => ({ v: d.toLowerCase().slice(0, 3), label: d }));

  const FORMULA = [
    { v: "indywidualne", label: "Zajęcia indywidualne" },
    { v: "grupowe", label: "Zajęcia grupowe" }
  ];

  



  const JEZYK = [
    { v: "polski", label: "polski" },
    { v: "angielski", label: "angielski" },
    { v: "niemiecki", label: "niemiecki" }
  ];

  




  






   
  const withInne = (arr) => arr.concat([{ v: "inne", label: "Inne" }]);

   
  const mergeName = (imie, nazwisko) =>
    [String(imie == null ? "" : imie).trim(), String(nazwisko == null ? "" : nazwisko).trim()]
      .filter(Boolean).join(" ");

   
   
  const CONTACT1 = [
    { name: "imie", label: "Imię", type: "text", required: true, placeholder: "Joanna" },
    { name: "nazwisko", label: "Nazwisko", type: "text", required: true, placeholder: "Kowalska" },
    { name: "telefon", label: "Numer telefonu", type: "phone", required: true, placeholder: "512 345 678" },
    { name: "email", label: "E-mail", type: "email", required: true, placeholder: "nazwa@przyklad.com" }
  ];

   
  const DLA_KOGO = [
    { v: "adult", label: "Dla siebie (dorosły)" },
    { v: "child", label: "Dla mojego dziecka" }
  ];

  




   
  const OBSZARY_A = [
    { v: "muz_instrument", label: "zajęcia muzyczne - nauka gry na instrumentach" },
    { v: "muz_kompozycja", label: "zajęcia muzyczne - kompozycja, produkcja, dyrygentura, muzyka" },
    { v: "sceniczne", label: "zajęcia sceniczne - musical, taniec, aktorstwo, śpiew" },
    { v: "slowo", label: "ekspresja słowna - pisanie książek, dziennikarstwo" },
    { v: "wizualne", label: "ekspresja wizualna - malarstwo, rysunek, komiks, fotografia" },
    { v: "emocje", label: "zajęcia z zakresu emocji - regulacja emocjonalna, koncert relaksacyjny, joga" },
    { v: "ruch", label: "zajęcia z zakresu ruchu - taniec, taniec intuicyjny" },
    { v: "rozmowy", label: "spotkania o sztuce i muzyce - gdzie pójść? co i kiedy zobaczyć i posłuchać?" },
    { v: "duza_grupa", label: "energia dużej grupy - zaśpiewaj w chórze, zagraj w spektaklu i musicalu, wyraź się poprzez taniec i ruch w dużej grupie" },
    { v: "glos", label: "zajęcia ze świadomości głosu - emisja głosu, warsztaty z prezentacji, oddech, ćwiczenia regulujące i koncentrujące" }
  ];
   
  const OBSZARY_B = [
    { v: "muz_instrument", label: "zajęcia muzyczne - nauka gry na instrumentach oraz śpiew" },
    { v: "muz_kompozycja", label: "zajęcia muzyczne - kompozycja, produkcja, dyrygentura, muzyka" },
    { v: "sceniczne", label: "zajęcia sceniczne - musical, taniec, aktorstwo" },
    { v: "slowo", label: "ekspresja słowna - pisanie książek, dziennikarstwo" },
    { v: "wizualne", label: "ekspresja wizualna - malarstwo, rysunek, komiks, fotografia" },
    { v: "emocje", label: "zajęcia z zakresu emocji - regulacja emocjonalna, oddech, sensoryka, medytacja, joga" },
    { v: "duza_grupa", label: "energia dużej grupy - zaśpiewaj w chórze" },
    { v: "ruch", label: "zajęcia z zakresu ruchu - taniec, taniec intuicyjny" }
  ];

  const INSTRUMENTY = ["Pianino", "Gitara", "Skrzypce", "Perkusja", "Saksofon", "Handpan", "Ukulele"]
    .map((x) => ({ v: x.toLowerCase(), label: x }));

  


  const EDU_EMO_A = [
    { v: "oddech", label: "Oddech i koncentracja" },
    { v: "emocje_medytacja", label: "Uwalnianie emocji + medytacja" },
    { v: "joga", label: "Joga" },
    { v: "muzykoterapia", label: "Muzykoterapia" },
    { v: "harmonizacja", label: "Zajęcia z instrumentami - harmonizacja ciała" },
    { v: "relaksacja", label: "Wydarzenia - Relaksacja" },
    { v: "ruch_potrzeby", label: "Ruch - wsłuchaj się w swoje potrzeby" },
    { v: "malarstwo_intuicyjne", label: "Malarstwo intuicyjne" },
    { v: "uwaznosc_1na1", label: "Spotkanie 1:1 z uważności na siebie" }
  ];
  const EDU_EMO_B = [
    { v: "oddech", label: "Oddech i koncentracja" },
    { v: "emocje_medytacja", label: "Uwalnianie emocji + medytacja" },
    { v: "joga", label: "Joga z dźwiękami instrumentów" },
    { v: "muzykoterapia", label: "Muzykoterapia" },
    { v: "harmonizacja", label: "Zajęcia z instrumentami - harmonizacja ciała" },
    { v: "sensoryka", label: "Sensoryka" },
    { v: "regulacja_oddech", label: "Regulacja emocji z technikami oddechu" },
    { v: "ja_i_emocje_1na1", label: "Spotkania 1:1 - „Ja i moje emocje”" }
  ];

  




  const SZKOLY = [
    "American School of Warsaw (ASW)",
    "British Primary School of Wilanów (BSW)",
    "EDISON International School",
    "Einstein",
    "International American School of Warsaw (IAS)",
    "International European School",
    "Liceum Artes Liberales (LAL)",
    "Niepubliczna Szkoła Podstawowa „Trampoline”",
    "Thames British School",
    "The British School Warsaw",
    "SP nr 169 Warszawa",
    "SP nr 358 Warszawa",
    "SP nr 400 Warszawa"
  ].map((x) => ({ v: x.toLowerCase().replace(/[^a-z0-9ąćęłńóśżź]+/g, "_").replace(/^_|_$/g, ""), label: x }));

  






  const GODZINY_A = [
    { v: "tyg_09_12", label: "w tygodniu: przedział 09:00 - 12:00" },
    { v: "tyg_12_14", label: "w tygodniu: przedział 12:00 - 14:00" },
    { v: "tyg_14_16", label: "w tygodniu: przedział 14:00 - 16:00" },
    { v: "tyg_16_18", label: "w tygodniu: przedział 16:00 - 18:00" },
    { v: "tyg_18_21", label: "w tygodniu: przedział 18:00 - 21:00" },
    { v: "wknd_poranki", label: "weekend: poranki" },
    { v: "wknd_popol", label: "weekend: popołudnia" }
  ];
  const GODZINY_B = [
    { v: "tyg_09_14", label: "w tygodniu: przedział 09:00 - 14:00" },
    { v: "tyg_14_16", label: "w tygodniu: przedział 14:00 - 16:00" },
    { v: "tyg_16_18", label: "w tygodniu: przedział 16:00 - 18:00" },
    { v: "tyg_18_20", label: "w tygodniu: przedział 18:00 - 20:00" },
    { v: "wknd_poranne", label: "weekend: poranki" },
    { v: "wknd_popol", label: "weekend: popołudnia" }
  ];

   
  const MOTYWACJA_A = [
    { v: "pasja", label: "Rozwój pasji" },
    { v: "relaks", label: "Relaks | Wypoczynek" },
    { v: "czas_ze_soba", label: "Czas ze sobą | Świadomość siebie" },
    { v: "grupa_zabawa", label: "Radość i świetna zabawa w większej grupie" },
    { v: "poznanie_sztuki", label: "Poznanie Muzyki - Sztuki" }
  ];
  const MOTYWACJA_B = [
    { v: "pasja", label: "Rozwój pasji" },
    { v: "edukacja_art", label: "Profesjonalna edukacja artystyczna" },
    { v: "emocje", label: "Praca z emocjami" },
    { v: "grupa_zabawa", label: "Radość i świetna zabawa w większej grupie" },
    { v: "poznanie_sztuki", label: "Poznanie Muzyki - Sztuki" }
  ];
  const ZAJECIA_WYBOR = [
    { v: "muzyka_1na1", label: "Zajęcia MUZYKA (1:1) - instrumenty, produkcja, wokal" },
    { v: "muzyka_male", label: "Zajęcia MUZYKA (Małe grupy) - muzyka, sztuki wizualne, ruch" },
    { v: "scena_male", label: "Zajęcia SCENA (Małe grupy) - taniec, aktorstwo, wokal" },
    { v: "slowo_male", label: "Zajęcia SŁOWO (Małe grupy) - pisanie książek, poezji, scenariuszy, dzienników" },
    { v: "emocje", label: "Zajęcia EMOCJE (1:1 + Małe grupy) - rozwój poprzez sztukę, świadomość siebie, emocje, widzę siebie" },
    { v: "scena_zespol", label: "Zajęcia SCENA (Zespołowe) - duża grupa, radość, satysfakcja, śpiew, aktorstwo, musical" },
    { v: "klub", label: "TNM | KLUB - Spotkania o sztuce i o muzyce, zorganizowane wspólne wyjścia" }
  ];
  const DZIELNICE = ["Mokotów", "Praga", "Sadyba", "Wawer", "Wilanów", "Wola", "Ursus", "Ursynów"]
    .map((x) => ({ v: x.toLowerCase().replace(/ó/g, "o").replace(/ł/g, "l"), label: x }));

  



  const GODZINY_HERO = [
    { v: "tyg_09_12", label: "W tygodniu: przedział 09:00 - 12:00" },
    { v: "tyg_12_14", label: "W tygodniu: przedział 12:00 - 14:00" },
    { v: "tyg_14_16", label: "W tygodniu: przedział 14:00 - 16:00" },
    { v: "tyg_16_18", label: "W tygodniu: przedział 16:00 - 18:00" },
    { v: "tyg_18_20", label: "W tygodniu: przedział 18:00 - 20:00" },
    { v: "wknd_poranki", label: "Weekend: poranki" },
    { v: "wknd_popol", label: "Weekend: popołudnia" },
    { v: "wknd_wieczory", label: "Weekend: wieczory" }
  ];

  


  const ZAJECIA_DZIECKO_HERO = [
    { v: "muz_instrument", label: "Zajęcia muzyczne - nauka gry na instrumentach oraz śpiew" },
    { v: "muz_kompozycja", label: "Zajęcia muzyczne - kompozycja, produkcja, dyrygentura, muzyka" },
    { v: "sceniczne", label: "Zajęcia sceniczne - musical, taniec, aktorstwo" },
    { v: "slowo", label: "Ekspresja słowna - pisanie książek, dziennikarstwo" },
    { v: "wizualne", label: "Ekspresja wizualna - malarstwo, rysunek, komiks, fotografia" },
    { v: "ruch", label: "Zajęcia ruchowe - taniec intuicyjny, taniec" },
    { v: "emocje", label: "Emocje - regulacja emocji, relaksacja, sensoryka, joga, sesja relaksacyjna" },
    { v: "rozmowy", label: "Rozmowy o sztuce i muzyce - ciekawie i ogólnie o sztuce i muzyce (spotkania)" }
  ];

  


  const DIAGNOSTYKA_HERO = [
    { v: "fundamenty", label: "„Fundamenty” - Diagnostyka 1:1" },
    { v: "poznajmy", label: "„Poznajmy się” - Rozmowa on-line" }
  ];
   
  const DIAGNOSTYKA_PELNY = [
    { v: "fundamenty", label: "Diagnostyka 1:1 - „Fundamenty” (offline)" },
    { v: "poznajmy", label: "Rozmowa 1:1 - „Poznajmy się” (online)" }
  ];

  









  const ADMIN_DANYCH = "The Art Makers sp. z o.o. (marka The Noise Makers)";
  const CONSENT_TEXT = "Wyrażam zgodę na przetwarzanie moich danych osobowych (oraz danych mojego dziecka - jeśli dotyczy) przez " + ADMIN_DANYCH + " w celu kontaktu i doboru zajęć. Podanie danych jest dobrowolne. Mam prawo dostępu do danych, ich sprostowania, usunięcia oraz cofnięcia zgody w dowolnym momencie. Szczegóły w Polityce prywatności.";
  const CONSENT_MKT = "Wyrażam zgodę na otrzymywanie newslettera ARTletter (informacje o zajęciach, wydarzeniach i nowościach) na podany adres e-mail oraz na przetwarzanie moich danych w tym celu przez " + ADMIN_DANYCH + ". Zgodę mogę wycofać w każdej chwili. Szczegóły w Polityce prywatności.";

  

  const FORM_ENDING = {
    title: "Dziękujemy za wysłany formularz zgłoszeniowy.",
    paragraphs: [
      "Otrzymaliśmy Twoje odpowiedzi na zadane przez nas pytania. W ciągu nadchodzących 72 h przeanalizujemy Twoje potrzeby i wrócimy do Ciebie z rekomendowanymi przez nas rozwiązaniami.",
      "Teraz weź głęboki oddech i zrelaksuj się. To my zajmiemy się doborem kolejnych kroków na ścieżce rozwoju. A Ty podejmiesz decyzję.",
      "Rozwój pasji to radość i satysfakcja. O to właśnie dba zespół TNM.",
      "Wrócimy do Ciebie już wkrótce.",
      "Jeśli chcesz zgłosić kolejną osobę, Jesteśmy."
    ],
    cta: { label: "Zgłoś kolejną osobę", action: "restart" }
  };

  





  






  const waitlistSteps = (typ) => [
    { key: "rola", label: "Dla kogo", type: "single", required: true, autoRola: true,
      title: "Dla kogo chcesz się zapisać?", options: [
        { v: "adult", label: "Dla siebie (dorosły)" },
        { v: "child", label: "Dla dziecka" }
      ] },
    { key: "kontakt", label: "Twoje dane", type: "fields", required: true,
      title: "Twoje dane (Osoba zapisująca | Opiekun)",
      help: "Podaj nam swoje dane kontaktowe (osoba zapisująca). Wrócimy do Ciebie w pierwszej kolejności z informacją.",
      fields: CONTACT1 },
    { key: "uczestnik", label: "Uczestnik", type: "fields", required: true,
      title: "Dane Podopiecznej | Podopiecznego",
      help: typ === "zespolowe"
        ? "Podaj nam dane uczestnika, który będzie uczęszczać na nasze zajęcia zespołowe. Dzięki temu lepiej dobierzemy zajęcia."
        : "Podaj nam dane uczestnika, który będzie uczęszczać na nasze zajęcia w małej grupie. Dzięki temu lepiej dobierzemy zajęcia.",
      showWhen: { key: "rola", eq: "child" },
      fields: [
        { name: "imie_uczestnika", label: "Imię", type: "text", required: true, placeholder: "Antoni" },
        { name: "nazwisko_uczestnika", label: "Nazwisko", type: "text", required: true, placeholder: "Kowalski" },
        { name: "data_uczestnika", label: "Data urodzenia", type: "date", required: true, max: "today" }
      ] },
    { key: "zgoda", label: "Zgoda", type: "consent", required: true,
      title: "Zgoda na przetwarzanie danych", consentLabel: CONSENT_TEXT }
  ];

  






  const GRUPA_ENDING = {
    child: [
      "Cieszymy się, że już wkrótce poznamy Twoje dziecko i wprowadzimy je w odkrywanie pasji.",
      "Będzie dużo radości, uśmiechu, energii a także cudownej grupy.",
      "Będzie się działo!",
      "Do zobaczenia."
    ],
    adult: [
      "Cieszymy się, że już wkrótce poznamy Ciebie podczas zajęć.",
      "Przygoda ta, to doświadczenie pełne życia, radości i energii w większej grupie.",
      "Zatem przygotuj się na swój power i wyrażanie siebie.",
      "Będzie się działo!",
      "Do zobaczenia."
    ]
  };

  





  const SCHEMAS = {
    hero: {
      id: "hero-skrocony",
      version: "2.1",
      masthead: "Formularz zgłoszeniowy",
      aside: {
        eyebrow: "Bezpłatnie · kilka minut",
        title: "Jesteśmy tu, by usłyszeć Twój głos.",
        text: "Bez zobowiązań - wracamy do Ciebie z propozycją, zwykle w ciągu 72 h."
      },
       
      intro: {
        image: "assets/img/figma/form-intro-jestesmy.webp?v=20260706",
        title: "Jesteśmy tu, by usłyszeć Twój głos.",
        sub: "Odpowiedz nam na kilka pytań,<br>a my dobierzemy dla Ciebie odpowiednie zajęcia i Prowadzących. Zaczynamy?",
        button: "Jestem, zaczynajmy!",
        note: "Zajmuje 5 minut"
      },
      




      ending: FORM_ENDING,
      steps: [
        




        { key: "rola", section: "Dla kogo", label: "Dla kogo", type: "single", required: true, setsBranch: true, autoRola: true,
          title: "Zacznijmy od kluczowego pytania: Dla kogo szukasz zajęć?",
          help: "W naszej ofercie znajdziesz zajęcia dla dzieci i dla dorosłych. Zdecyduj poniżej:",
          options: [
            { v: "adult", label: "Dla siebie (zajęcia dla dorosłych)" },
            { v: "child", label: "Dla mojego dziecka (zajęcia dla dzieci)" }
          ] },
        { key: "kontakt", section: "Dane kontaktowe", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Teraz prosimy Ciebie o Twoje dane kontaktowe.",
          help: "Uzupełnij swoje dane, abyśmy mogli wrócić do Ciebie z odpowiednią ofertą zajęć.",
          fields: CONTACT1 },

         
        { branch: "adult", section: "Preferencje", key: "a_urodziny", label: "Data urodzenia", type: "date", required: true,
          title: "Podaj nam swoją datę urodzenia", help: "Pomoże to nam dobrać odpowiednie zajęcia dla Ciebie.", max: "today" },
        { branch: "adult", section: "Preferencje", key: "a_forma", label: "Forma zajęć", type: "multi", required: true,
          title: "Jakiej formy zajęć poszukujesz?", options: FORMULA },
        { branch: "adult", section: "Preferencje", key: "a_motywacja", label: "Motywacja", type: "multi", required: true,
          title: "Jaka jest Twoja motywacja dołączając na nasze zajęcia?", help: "Możesz zaznaczyć kilka.", options: MOTYWACJA_A },
        { branch: "adult", section: "Preferencje", key: "a_zajecia", label: "Zajęcia", type: "multi", required: false,
          title: "W jakich zajęciach chcesz wziąć udział?", help: "Możesz zaznaczyć kilka.", options: ZAJECIA_WYBOR },
        { branch: "adult", section: "Preferencje", key: "a_zajecia_open", label: "Wybór zajęć", type: "long", required: false,
          title: "Jeśli wiesz na jakie zajęcia chcesz dołączyć, napisz poniżej:", placeholder: "Twoja wiadomość..." },
        { branch: "adult", section: "Dostępność", key: "a_dni", label: "Dni", type: "multi", required: true,
          title: "W jakie dni możesz uczestniczyć w zajęciach?", help: "Wybierz te dni które są dla Ciebie możliwe, abyśmy mogli dopasować do Twoich potrzeb proponowane godziny zajęć.", options: DAYS },
         
        { branch: "adult", section: "Dostępność", key: "a_godziny", label: "Godziny", type: "multi", required: true,
          title: "W jakich godzinach?", help: "Wybierz przedział godzin, które będą dogodne dla Ciebie na wybrane zajęcia w podanych dniach.", options: GODZINY_HERO },
        { branch: "adult", section: "Dostępność", key: "a_start", label: "Od kiedy", type: "date", required: true,
          title: "Od kiedy chcesz rozpocząć zajęcia?", help: "Podaj możliwy dla Ciebie termin rozpoczęcia zajęć.", min: "today" },
        { branch: "adult", section: "Dostępność", key: "a_lokalizacja", label: "Lokalizacja", type: "multi", required: true,
          title: "Jaka lokalizacja jest dla Ciebie odpowiednia?", help: "Wybierz dzielnice odpowiadające Tobie z poniższej listy (możesz wybrać kilka dzielnic):", options: DZIELNICE },
        { branch: "adult", section: "Dostępność", key: "a_uwagi", label: "Uwagi", type: "long", required: false,
          title: "Czy jest coś jeszcze co powinniśmy wiedzieć zanim zarekomendujemy Tobie zajęcia?", placeholder: "Twoja wiadomość..." },

         
        { branch: "child", section: "Preferencje", key: "b_dziecko", label: "Dane dziecka", type: "fields", required: true,
          title: "Podaj nam także dane Twojego dziecka.", help: "Dzięki tym informacjom lepiej dobierzemy zajęcia do jego potrzeb.",
          fields: [
             
             
            { name: "imie_dziecka", label: "Imię", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_dziecka", label: "Nazwisko", type: "text", required: true, placeholder: "Kowalski" },
            { name: "wiek_dziecka", label: "Wiek", type: "text", required: true, placeholder: "Np. 7" },
            { name: "jednostka_eduk", label: "Jednostka edukacyjna, do której uczęszcza obecnie", type: "text", required: false, placeholder: "Np. przedszkole / szkoła" }
          ] },
        { branch: "child", section: "Preferencje", key: "b_urodziny", label: "Data urodzenia dziecka", type: "date", required: true,
          title: "Podaj nam datę urodzenia Twojego dziecka.", help: "Dobierzemy dla niego odpowiednią grupę.", max: "today" },
        { branch: "child", section: "Preferencje", key: "b_forma", label: "Forma zajęć", type: "multi", required: true,
          title: "Jakiej formy zajęć poszukujesz?", options: FORMULA },
        { branch: "child", section: "Preferencje", key: "b_motywacja", label: "Motywacja", type: "multi", required: true,
          title: "Jaka jest Twoja motywacja zapisania Twojego dziecka na zajęcia?", help: "Możesz zaznaczyć kilka.", options: MOTYWACJA_B },
         
        { branch: "child", section: "Preferencje", key: "b_zajecia", label: "Zajęcia dziecka", type: "multi", required: false,
          title: "W jakich zajęciach chcesz aby wzięło udział Twoje dziecko?", help: "Możesz zaznaczyć kilka odpowiedzi.", options: ZAJECIA_DZIECKO_HERO },
        { branch: "child", section: "Preferencje", key: "b_zajecia_open", label: "Wybór zajęć", type: "long", required: false,
          title: "Na jakie zajęcia chcesz zapisać swoje dziecko?", help: "Jeśli masz już swój wybór, napisz poniżej.", placeholder: "Twoja wiadomość..." },
        { branch: "child", section: "Dostępność", key: "b_dni", label: "Dni", type: "multi", required: true,
          title: "W jakie dni Twoje dziecko może uczestniczyć w zajęciach?", help: "Wybierz te dni które są dla Was możliwe, abyśmy mogli zaproponować odpowiednie zajęcia.", options: DAYS },
        

        { branch: "child", section: "Dostępność", key: "b_godziny", label: "Godziny", type: "multi", required: false,
          title: "W jakich godzinach?", help: "Wybierz przedział godzin, które będą dogodne dla Was na wybrane zajęcia w podanych dniach.", options: GODZINY_HERO },
        { branch: "child", section: "Dostępność", key: "b_start", label: "Od kiedy", type: "date", required: true,
          title: "Od kiedy chcesz rozpocząć zajęcia?", help: "Podaj możliwy dla Ciebie termin rozpoczęcia zajęć.", min: "today" },
        { branch: "child", section: "Dostępność", key: "b_lokalizacja", label: "Lokalizacja", type: "multi", required: true,
          title: "Jaka lokalizacja jest dla Ciebie odpowiednia?", help: "Wybierz dzielnice odpowiadające Tobie z poniższej listy (możesz wybrać kilka dzielnic):", options: DZIELNICE },
        { branch: "child", section: "Dostępność", key: "b_uwagi", label: "Uwagi", type: "long", required: false,
          title: "Czy jest coś jeszcze co powinniśmy wiedzieć zanim zarekomendujemy Wam zajęcia?", help: "To Ty znasz swoje dziecko najlepiej i wiesz co jest ważną informacją o nim. Uwzględnimy to przy doborze zajęć.", placeholder: "Twoja wiadomość..." },

        


        { key: "diagnostyka", section: "Dostępność", label: "Spotkanie diagnostyczne", type: "single", required: false,
          title: "Czy chcesz umówić się na spotkanie diagnostyczne?", help: "Wybierz rodzaj spotkania.", options: DIAGNOSTYKA_HERO },

         
        { key: "zgoda", section: "Zgoda", label: "Zgoda", type: "consent", required: true,
          title: "Zgoda na przetwarzanie danych", consentLabel: CONSENT_TEXT }
      ]
    },

    


    pelny: {
      id: "pelny",
      version: "1.2",
      masthead: "Formularz zgłoszeniowy",
      aside: {
        eyebrow: "Zgłoszenie zainteresowania",
        title: "Jesteśmy tu, by usłyszeć Twój głos.",
        text: "Im więcej nam powiesz, tym trafniejszy dobór. Wracamy z propozycją w ciągu 72 h."
      },
      intro: {
        title: "Jesteśmy tu, by usłyszeć Twój głos.",
        sub: "Odpowiedz nam na kilka pytań,<br>a my dobierzemy dla Ciebie odpowiednie zajęcia i Prowadzących. Zaczynamy?",
        button: "Jestem, zaczynajmy!",
        note: "Zajmuje 5 minut"
      },
      ending: FORM_ENDING,
      steps: [
         
        { key: "rola", section: "Wybór", label: "Dla kogo", type: "single", required: true, setsBranch: true, autoRola: true,
          title: "Zacznijmy od kluczowego pytania: Dla kogo szukasz zajęć?",
          help: "W naszej ofercie znajdziesz zajęcia dla dzieci i dla dorosłych. Zdecyduj poniżej:",
          options: DLA_KOGO },

         
        { branch: "adult", section: "Kontakt", key: "a_kontakt", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Twoje dane kontaktowe", help: "Zostaw nam kontakt, abyśmy mogli wrócić z propozycją.", fields: CONTACT1 },
        { branch: "adult", section: "O Tobie", key: "a_intro", label: "O Tobie", type: "statement",
          title: "Pozwól nam poznać Ciebie i Twoje potrzeby.",
          text: "<p>Kilka pytań o to, czego szukasz - dzięki nim dobierzemy zajęcia i Prowadzących pod Ciebie.</p>" },
        { branch: "adult", section: "O Tobie", key: "a_formula", label: "Formuła", type: "multi", required: true,
          title: "Jakiej formy zajęć poszukujesz?", help: "Możesz zaznaczyć kilka.", options: FORMULA },
        { branch: "adult", section: "O Tobie", key: "a_urodziny", label: "Data urodzenia", type: "date", required: true,
          title: "Podaj nam swoją datę urodzenia", max: "today" },
        { branch: "adult", section: "O Tobie", key: "a_obszary", label: "Obszary", type: "multi", required: true,
          title: "Poniżej znajdziesz listę obszarów artystycznych, w których prowadzimy zajęcia. Wskaż nam Twoje zainteresowania, a w następnych krokach dopytamy o więcej.",
          help: "Zaznacz interesujące Cię obszary. Nawet jeśli dokładnie nie wiesz co oznaczają, kieruj się intuicją. Może właśnie całkowicie nowy obszar Cię przyciągnie.",
          options: OBSZARY_A },
        { branch: "adult", section: "O Tobie", key: "a_instrumenty", label: "Instrumenty", type: "multi", required: true, other: true,
          title: "Poniżej znajdziesz listę instrumentów muzycznych. Czy chciałbyś rozwijać się poprzez grę na którymś z nich?",
          help: "Zaznacz interesujące Cię instrumenty.",
          options: withInne(INSTRUMENTY), showWhen: { key: "a_obszary", includes: "muz_instrument" } },
        { branch: "adult", section: "O Tobie", key: "a_eduemo", label: "Edukacja emocjonalna", type: "multi", required: true,
          title: "Prowadzimy w ramach TNM także zajęcia z zakresu edukacji emocjonalnej. Jeśli uznasz, że to coś dla Ciebie - wybierz konkretne kierunki z listy poniżej.",
          help: "Możesz zaznaczyć kilka.", options: EDU_EMO_A },
        { branch: "adult", section: "O Tobie", key: "a_doswiadczenie", label: "Doświadczenie", type: "long", required: false,
          title: "Czy masz doświadczenie w zakresie wcześniej wybranych zainteresowań?", placeholder: "Np. 3 lata gry na gitarze..." },
        { branch: "adult", section: "O Tobie", key: "a_dni", label: "Dostępne dni", type: "multi", required: true,
          title: "W jakie dni możesz uczestniczyć w zajęciach?",
          help: "Wybierz te dni które są dla Ciebie możliwe, abyśmy mogli dopasować do Twoich potrzeb proponowane godziny zajęć.", options: DAYS },
        { branch: "adult", section: "O Tobie", key: "a_godziny", label: "Godziny", type: "multi", required: true,
          title: "W jakich godzinach?",
          help: "Podaj przedział godzin, które będą dogodne dla Ciebie na wybrane zajęcia. Możesz zaznaczyć kilka odpowiedzi.",
          options: GODZINY_A },
        { branch: "adult", section: "O Tobie", key: "a_start", label: "Od kiedy", type: "date", required: true,
          title: "Od kiedy chcesz rozpocząć zajęcia?", min: "today" },
        { branch: "adult", section: "O Tobie", key: "a_pewnosc", label: "Pewność", type: "scale", required: true,
          title: "Jak określasz swoją pewność, co do wyboru kierunków artystycznych w poprzednich pytaniach?",
          help: "Skala od 1 (nie mam pewności) do 7 (tak, mam pewność co do swojego wyboru).",
          min: 1, max: 7, low: "Niepewny", high: "Bardzo pewny" },
        { branch: "adult", section: "O Tobie", key: "a_uwagi", label: "Uwagi", type: "long", required: false,
          title: "Czy jest coś jeszcze, co czujesz, że powinniśmy usłyszeć przed doborem zajęć dla Ciebie?", placeholder: "Twoja wiadomość..." },

         
        { branch: "child", section: "Kontakt", key: "b_kontakt", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Twoje dane kontaktowe", help: "Dane osoby zapisującej (Rodzic/ Opiekun). Na te dane dokonana będzie rejestracja.", fields: CONTACT1 },  
        { branch: "child", section: "O dziecku", key: "b_intro", label: "O dziecku", type: "statement",
          title: "Opowiedz nam o Twoim dziecku.",
          text: "<p>Kilka podstawowych informacji, żebyśmy dobrze dobrali zajęcia.</p>" },
        { branch: "child", section: "O dziecku", key: "b_dziecko", label: "Dane dziecka", type: "fields", required: true,
          title: "Dane Twojego dziecka", fields: [
             
             
            { name: "imie_dziecka", label: "Imię dziecka", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_dziecka", label: "Nazwisko dziecka", type: "text", required: true, placeholder: "Kowalski" },
            { name: "data_dziecka", label: "Data urodzenia dziecka", type: "date", required: true, max: "today" }
          ] },
        { branch: "child", section: "O dziecku", key: "b_jezyk", label: "Język zajęć", type: "multi", required: true, other: true,
          title: "W jakim języku chcesz aby prowadzone były zajęcia?", help: "Możesz zaznaczyć kilka.", options: JEZYK.concat([{ v: "inne", label: "Inny" }]) },  
        { branch: "child", section: "O dziecku", key: "b_szkola", label: "Szkoła", type: "single", required: true, other: true,
          title: "Do której szkoły / przedszkola uczęszcza Twoje dziecko?", options: withInne(SZKOLY) },
        { branch: "child", section: "Potrzeby", key: "b_intro2", label: "Potrzeby", type: "statement",
          title: "Zapoznaj nas z potrzebami Twojego dziecka.",
          text: "<p>Te odpowiedzi pomogą nam dobrać formułę, obszary i Prowadzących.</p>" },
        { branch: "child", section: "Potrzeby", key: "b_formula", label: "Formuła", type: "multi", required: true,
          title: "Jakiej formuły zajęć poszukujesz dla Twojego dziecka?",
          help: "Jeśli Twoje dziecko ma konkretne preferencje, wybierz jedną opcję poniżej. Jeśli obie są odpowiednie, zaznacz obie.", options: FORMULA },
        { branch: "child", section: "Potrzeby", key: "b_obszary", label: "Obszary", type: "multi", required: true,
          title: "Poniżej znajdziesz listę obszarów artystycznych - emocjonalnych, w których prowadzimy zajęcia. Wskaż te, które są bliskie Twojemu dziecku.",  
          help: "Możesz zaznaczyć kilka.", options: OBSZARY_B },
        { branch: "child", section: "Potrzeby", key: "b_instrumenty", label: "Instrumenty", type: "multi", required: true, other: true,
          title: "Poniżej znajdziesz listę instrumentów muzycznych. Zaznacz te, które mogą być interesujące dla Twojego dziecka.",
          help: "Możesz zaznaczyć kilka.",
          options: withInne(INSTRUMENTY), showWhen: { key: "b_obszary", includes: "muz_instrument" } },
        { branch: "child", section: "Potrzeby", key: "b_eduemo", label: "Edukacja emocjonalna", type: "multi", required: false,
          title: "W ramach TNM prowadzimy także zajęcia z zakresu edukacji emocjonalnej. Jeśli uznasz, że mogą być one pomocne dla Twojego dziecka - wybierz konkretne kierunki z listy poniżej.",  
          help: "Możesz zaznaczyć kilka kierunków.", options: EDU_EMO_B },
        


        { branch: "child", section: "Potrzeby", key: "b_zapis_zajecia", label: "Zajęcia do zapisu", type: "long", required: false,
          title: "Czy są zajęcia, na które chcesz zapisać swoje dziecko?",
          help: "Jeśli znasz odpowiedź na jakie zajęcia chcesz dokonać zapisu, wypisz je poniżej.", placeholder: "Twój wybór to:" },
        { branch: "child", section: "Potrzeby", key: "b_doswiadczenie", label: "Doświadczenie", type: "long", required: false,
          title: "Czy Twoje dziecko ma doświadczenie w zajęciach, które zostały przez Ciebie zaznaczone?", placeholder: "Np. pół roku gry na pianinie..." },
        { branch: "child", section: "Potrzeby", key: "b_pewnosc", label: "Pewność", type: "scale", required: true,
          title: "Czy czujesz, że wybrane wcześniej kierunki zajęć dobrze odpowiadają na potrzeby Twojego dziecka?",
          help: "Skala od 1 (nie mam pewności) do 7 (tak, mam pewność). Ta odpowiedź pozwoli nam zarekomendować dodatkowe obszary rozwijające Twoje dziecko.",
          min: 1, max: 7, low: "Niepewny", high: "Bardzo pewny" },
        { branch: "child", section: "Potrzeby", key: "b_start", label: "Od kiedy", type: "date", required: true,
          title: "Od kiedy Twoje dziecko może rozpocząć zajęcia?", min: "today" },
        { branch: "child", section: "Potrzeby", key: "b_dni", label: "Dostępne dni", type: "multi", required: true,
          title: "W jakie dni Twoje dziecko może uczestniczyć w zajęciach?",
          help: "Jeśli weekendy są możliwe, zaznacz również te dni.", options: DAYS },
        { branch: "child", section: "Potrzeby", key: "b_godziny", label: "Godziny", type: "multi", required: true,
          title: "Które godziny są najlepszym czasem na zajęcia Twojego dziecka?",
          help: "Zaznacz najlepsze dla Twojego dziecka opcje.", options: GODZINY_B },
        { branch: "child", section: "Potrzeby", key: "b_uwagi", label: "Uwagi", type: "long", required: false,
          title: "Czy jest coś jeszcze, czym chcesz się z nami podzielić, przed doborem zajęć?",
          help: "Czy Twoje dziecko posiada diagnozy bądź czy powinniśmy poznać inne dane, które pozwolą nam lepiej dobrać zajęcia?",  
          placeholder: "Twoja wiadomość..." },
        


        { branch: "child", section: "Potrzeby", key: "diagnostyka", label: "Spotkanie diagnostyczne", type: "single", required: false,
          title: "Czy chcesz umówić się na spotkanie diagnostyczne?",
          help: "Jeśli posiadasz wątpliwości w kwestii trafnego wyboru zajęć, jesteśmy po to aby Ciebie wesprzeć. Wybierz narzędzie:",
          options: DIAGNOSTYKA_PELNY },

         
        { key: "zgoda", section: "Zgoda", label: "Zgoda", type: "consent", required: true,
          title: "Zgoda na przetwarzanie danych", consentLabel: CONSENT_TEXT }
      ]
    },

    


    "zajecia-1na1": {
      id: "zajecia-1na1",
      version: "1.1",
      masthead: "Zgłoszenie na zajęcia 1:1",
       
       
      hidden: [
        { key: "prowadzacy", param: "prowadzacy", label: "Wybrany prowadzący" },
        { key: "zajecie", param: "zajecie", label: "Zajęcie (z karty)" }
      ],
      aside: {
        eyebrow: "Zajęcia indywidualne",
        title: "Zostaw zgłoszenie - dobierzemy szczegóły 1:1.",
        text: "Zostaw kontakt i preferencje, bez zobowiązań. Odezwiemy się z rekomendacją."
      },
      intro: {
        title: "Zostaw zgłoszenie - dobierzemy szczegóły 1:1.",
        sub: "Kilka pytań i kontakt.<br>Wrócimy z rekomendacją Prowadzącego i terminu.",
        button: "Zaczynajmy!",
        note: "Zajmuje 2 minuty"
      },
      




      ending: {
        title: "Dziękujemy za zapis na zajęcia.",
        paragraphs: [
          "Cieszymy się, że już wkrótce poznamy Ciebie podczas naszych zajęć.",
          "Zajęcia te to czas skupiony na Twoich potrzebach, rozwoju, postępach i budowanej relacji z odpowiednio dobranym Prowadzącym.",
          "Twój czas dla siebie i rozwoju pasji daje Tobie możliwość poczucia spełnienia i satysfakcji. Tak właśnie będzie już wkrótce.",
          "Do zobaczenia."
        ]
      },
      steps: [
        { key: "rola", label: "Dla kogo", type: "single", required: true, autoRola: true,
          title: "Dla kogo szukasz zajęć?", options: [
            { v: "adult", label: "Dla siebie (dorosły)" },
            { v: "child", label: "Dla dziecka" }
          ] },
        { key: "kontakt", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Podstawowe dane kontaktowe", help: "Na te dane wrócimy z rekomendacją.", fields: CONTACT1 },
        { key: "uczestnik", label: "Dane uczestnika", type: "fields", required: false,
          title: "Dane uczestnika", showWhen: { key: "rola", eq: "child" }, fields: [
             
            { name: "imie_uczestnika", label: "Imię uczestnika", type: "text", required: false, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Nazwisko uczestnika", type: "text", required: false, placeholder: "Kowalski" },
            { name: "data_uczestnika", label: "Data urodzenia uczestnika", type: "date", required: false, max: "today" }
          ] },
        { key: "preferencje", label: "Preferencje", type: "text", required: false,
          title: "Preferowane dni / godziny?", placeholder: "Np. wt/czw popołudnia" },
        { key: "cel", label: "Cel", type: "long", required: false,
          title: "Co chcesz rozwijać? Jaki jest Twój cel?", placeholder: "Np. gra na pianinie od podstaw" },
        { key: "zgoda", label: "Zgoda", type: "consent", required: true,
          title: "Zgoda na przetwarzanie danych", consentLabel: CONSENT_TEXT }
      ]
    },

    


    waitlist: {
      id: "waitlist",
      version: "1.1",
      masthead: "Lista oczekujących",
      hidden: [{ key: "zapis_na", param: "zapis", label: "Na co zapis" }],
      aside: {
        eyebrow: "Lista oczekujących",
        title: "Zapisz się na listę oczekujących.",
        text: "Damy znać, gdy ruszą zapisy. Zostaw kontakt - odezwiemy się w pierwszej kolejności."
      },
      intro: {
        title: "Zapisz się na listę oczekujących.",
        sub: "Zostaw kontakt,<br>a damy znać, gdy tylko ruszą zapisy.",
        button: "Zapisuję się",
        note: "Zajmuje minutę"
      },
      ending: {
        title: "Jesteś na liście",
        paragraphs: [
          "Dzięki! Zapisaliśmy Cię na listę oczekujących.",
          "Odezwiemy się, gdy tylko ruszą zapisy - w pierwszej kolejności.",
          "Do usłyszenia!"
        ]
      },
      steps: [
        { key: "rola", label: "Dla kogo", type: "single", required: true, autoRola: true,
          title: "Dla kogo chcesz się zapisać?", options: [
            { v: "adult", label: "Dla siebie" },
            { v: "child", label: "Dla dziecka" }
          ] },
        { key: "liczba_dzieci", label: "Ile dzieci", type: "number", required: false, min: 1, max: 10, default: 1,
          title: "Dla ilu dzieci?", showWhen: { key: "rola", eq: "child" } },
        { key: "kontakt", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Podstawowe dane kontaktowe", fields: CONTACT1 },
        { key: "uczestnik", label: "Uczestnik", type: "fields", required: false,
          title: "Dane uczestnika (lub dla kogo)", fields: [
            { name: "imie_uczestnika", label: "Imię", type: "text", required: false, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Nazwisko", type: "text", required: false, placeholder: "Kowalski" }
          ] },
        { key: "zgoda", label: "Zgoda", type: "consent", required: true,
          title: "Zgoda na przetwarzanie danych", consentLabel: CONSENT_TEXT }
      ]
    },

    












    newsletter: {
      id: "newsletter",
      version: "1.1",
      masthead: "ARTletter",
      aside: {
        eyebrow: "Newsletter",
        title: "Zapisz się do ARTlettera.",
        text: "Sztuka, muzyka i nasze nowości prosto do Twojej skrzynki. Bez spamu - tylko to, co warte uwagi."
      },
      intro: {
        title: "Zapisz się do ARTlettera.",
        sub: "Zostaw e-mail,<br>a damy znać o zajęciach, wydarzeniach i nowościach.",
        button: "Zapisuję się",
        note: "Zajmuje chwilę"
      },
      ending: {
        title: "Prawie gotowe",
        paragraphs: [
          "Dzięki! Wysłaliśmy do Ciebie e-mail z linkiem potwierdzającym.",
          "Kliknij link w wiadomości, aby dokończyć zapis do ARTlettera.",
          "Do usłyszenia!"
        ]
      },
      steps: [
        { key: "kontakt", label: "Dane", type: "fields", required: true,
          title: "Zostaw nam e-mail", fields: [
            { name: "email", label: "E-mail", type: "email", required: true, placeholder: "nazwa@przyklad.com" },
            { name: "imie", label: "Imię", type: "text", required: false, placeholder: "Joanna" }
          ] },
        { key: "zgoda", label: "Zgoda", type: "consent", required: true, consentKind: "mkt",
          title: "Zgoda marketingowa", consentLabel: CONSENT_MKT }
      ]
    },

    




    


    "waitlist-male-grupy": {
      id: "waitlist-male-grupy",
      version: "1.3",
      masthead: "Mała grupa - lista oczekujących",
      thxAlt: "Zajęcia w małej grupie w The Noise Makers",
      hidden: [
        { key: "typ_zajec", param: "typ", label: "Typ zajęć", default: "male-grupy" },
        { key: "zajecie", param: "zajecie", label: "Zajęcie" },
         
        { key: "audience", param: "audience", label: "Audiencja" }
      ],
      aside: {
        eyebrow: "Małe grupy · lista oczekujących",
        title: "Zapisz się na listę oczekujących.",
        text: "Powiadomimy Cię w pierwszej kolejności, gdy ruszą zapisy."
      },
      intro: {
        title: "Zapisz się na listę oczekujących.",
        sub: "Zajęcia w małych grupach ruszają już niedługo.<br>Zostaw kontakt, a odezwiemy się, gdy tylko otworzymy zapisy.",
        button: "Zapisuję się",
        note: "Zajmuje minutę"
      },
      ending: {
        title: "Dziękujemy za zapis do małej grupy.",
        paragraphsByRola: GRUPA_ENDING
      },
      steps: waitlistSteps("male-grupy")
    },
    "waitlist-zespolowe": {
      id: "waitlist-zespolowe",
      version: "1.3",
      masthead: "Zespoły - lista oczekujących",
      thxAlt: "Zajęcia zespołowe w The Noise Makers",
      hidden: [
        { key: "typ_zajec", param: "typ", label: "Typ zajęć", default: "zespolowe" },
        { key: "zajecie", param: "zajecie", label: "Zajęcie" },
         
        { key: "audience", param: "audience", label: "Audiencja" }
      ],
      aside: {
        eyebrow: "Zespoły · lista oczekujących",
        title: "Zapisz się na listę oczekujących.",
        text: "Powiadomimy Cię w pierwszej kolejności, gdy ruszy nabór."
      },
      intro: {
        title: "Zapisz się na listę oczekujących.",
        sub: "Nabór do zespołów rusza już niedługo.<br>Zostaw kontakt, a odezwiemy się, gdy tylko otworzymy zapisy.",
        button: "Zapisuję się",
        note: "Zajmuje minutę"
      },
      ending: {
        title: "Dziękujemy za zapis na zajęcia zespołowe.",
        paragraphsByRola: GRUPA_ENDING
      },
      steps: waitlistSteps("zespolowe")
    },

    








    polkolonie: {
      id: "polkolonie",
      version: "1.0",
      checkout: true,
      masthead: "Zapisy na półkolonie",
      hidden: [{ key: "turnus_hint", param: "turnusHint", label: "Turnus (z karty)", transient: true }],
      aside: {
        eyebrow: "Półkolonie · Royal Wilanów",
        title: "Zapisz dziecko na wakacje pełne sztuki.",
        text: "Poniedziałek - piątek, 9:00-16:00. W cenie zajęcia, materiały i opieka zespołu TNM."
      },
      intro: {
        image: "assets/img/figma/polkolonie/polkolonie-card-wakacje.webp",
        title: "Zapisz dziecko na półkolonie.",
        sub: "Wybierz turnus, podaj dane dzieci<br>i przejdź do płatności. Miejsce jest zarezerwowane od razu po opłaceniu.",
        button: "Zapisuję dziecko",
        note: "Zajmuje 3 minuty"
      },
      


      ending: {
        title: "Mamy Twoje zgłoszenie.",
        paragraphs: [
          "Dziękujemy. Odezwiemy się mailowo z potwierdzeniem i szczegółami zapisu na turnus.",
          "Jeśli chcesz dopytać od razu, napisz na jestem@thenoisemakers.pl.",
          "Do zobaczenia."
        ]
      },
      steps: [
        { key: "turnus", label: "Turnus", type: "single", required: true,
          title: "Wybierz turnus", help: "Poniedziałek - piątek, 9:00-16:00, Royal Wilanów. Cena za turnus, za dziecko.",
          options: POLKOLONIE_OPTS },
        { key: "liczba_dzieci", label: "Liczba dzieci", type: "number", required: false, min: 1, max: 6, default: 1,
          title: "Ile dzieci zapisujesz?", help: "Dane każdego dziecka podasz w kolejnym kroku." },
        { key: "kontakt", label: "Dane płatnika", type: "fields", required: true,
          title: "Dane płatnika (rodzica / opiekuna)", help: "Na ten kontakt wyślemy potwierdzenie zapisu i płatności.", fields: CONTACT1 },
        { key: "dzieci", label: "Dane dzieci", type: "children", required: true,
          title: "Dane uczestników", help: "Półkolonie to opieka przez cały dzień - te informacje pozwalają nam zadbać o każde dziecko." },
        { key: "zgody", label: "Zgody i płatność", type: "checkout", required: true,
          title: "Podsumowanie i zgody", help: "Sprawdź zamówienie i zaakceptuj zgody, żeby przejść do płatności." }
      ]
    },

    





    voucher: {
      id: "voucher",
      version: "1.0",
      checkout: true,
      masthead: "Voucher Diagnostyczny",
      hidden: [{ key: "rodzaj", param: "rodzaj", label: "Rodzaj vouchera" }],
      aside: {
        eyebrow: "Voucher · prezent",
        title: "Zadbaj o bliskich. Podaruj spotkanie w The Noise Makers.",
        text: "Kod vouchera wyślemy na Twój e-mail - przekazujesz go obdarowanej osobie, a ona umawia termin."
      },
      intro: {
        title: "Podaruj Voucher.",
        sub: "Podaj, dla kogo jest prezent,<br>zostaw swoje dane i przejdź do płatności. Kod dostaniesz mailem.",
        button: "Zamawiam voucher",
        note: "Zajmuje 2 minuty"
      },
      ending: {
        title: "Mamy Twoje zgłoszenie.",
        paragraphs: ["Dziękujemy. Odezwiemy się mailowo z potwierdzeniem.", "Do zobaczenia."]
      },
      steps: [
        







        { key: "dla_kogo", label: "Dla kogo", type: "single", required: true,
          title: "Dla kogo jest ten prezent?", options: [
            { v: "dorosly", label: "Dla osoby dorosłej (18 lat i więcej)" },
            { v: "dziecko", label: "Dla dziecka (poniżej 18 lat)" }
          ] },
         
         
        { key: "obdarowany", label: "Dane obdarowanego", type: "fields", required: true,
          title: "Dane osoby obdarowanej",
          



          help: "Wypiszemy voucher na tę osobę. Kod trafi do Ciebie mailem - Ty go wręczasz. Prezent dla dziecka może odebrać jego rodzic lub opiekun.",
          fields: [
            { name: "imie_obdarowanego", label: "Imię", type: "text", required: true, placeholder: "Anna" },
            { name: "nazwisko_obdarowanego", label: "Nazwisko", type: "text", required: true, placeholder: "Kowalska" },
            

            { name: "email_obdarowanego", label: "E-mail osoby obdarowanej (opcjonalnie)",
              type: "email", required: false, placeholder: "jesli znasz" }
          ] },
        { key: "kontakt", label: "Twoje dane", type: "fields", required: true,
          title: "Dane kupującego", help: "Na ten adres wyślemy kod vouchera i potwierdzenie zakupu.", fields: CONTACT1 },
        { key: "zgody", label: "Zgody i płatność", type: "checkout", required: true,
          title: "Podsumowanie i zgody", help: "Sprawdź zamówienie i zaakceptuj zgody, żeby przejść do płatności." }
      ]
    },

    













    "dni-probne": {
      id: "dni-probne",
      version: "1.0",
      checkout: true,
      masthead: "Rezerwacja wstępu",
      hidden: [
        { key: "sku", param: "sku", label: "SKU zajęć" },
        { key: "termin", param: "termin", label: "Dzień (ISO)" },
        { key: "zajecie", param: "zajecie", label: "Zajęcia (id)" },
        { key: "dp_nazwa", param: "dpNazwa", label: "Zajęcia" },
        { key: "audience", param: "audience", label: "Audiencja" },
        { key: "dp_cena", param: "dpCena", label: "Cena (prezentacja)", transient: true },
        

        { key: "poziom", param: "poziom", label: "Poziom zaawansowania" }
      ],
      aside: {
        eyebrow: "Dni Próbne · Poznajmy się",
        title: "Zarezerwuj wstęp na zajęcia próbne.",
        text: "Link do płatności dostaniesz od razu i mailem (ważny 24 godziny). Miejsce jest zarezerwowane po opłaceniu."
      },
       
       
      ending: {
        title: "Mamy Twoją rezerwację.",
        paragraphs: [
          "Dziękujemy. Link do płatności wysłaliśmy mailem. Po opłaceniu dostaniesz potwierdzenie i szczegóły organizacyjne.",
          "Jeśli chcesz dopytać od razu, napisz na jestem@thenoisemakers.pl.",
          "Do zobaczenia."
        ]
      },
      steps: [
        




        { key: "kontakt", label: "Dane kontaktowe", type: "fields", required: true,
          title: "Teraz prosimy Ciebie o Twoje dane kontaktowe.",
          help: "Dane osoby zapisującej (dla dziecka: Rodzic / Opiekun). Na te dane dokonana będzie rejestracja i na ten adres wyślemy link do płatności.",
          fields: CONTACT1 },
        { key: "uczestnik", label: "Dane dziecka", type: "fields", required: true,
          title: "Podaj nam także dane Twojego dziecka.", help: "Dzięki tym informacjom lepiej dobierzemy zajęcia do potrzeb uczestnika.",
          showWhen: { key: "audience", eq: "Dziecko" }, fields: [
            { name: "imie_uczestnika", label: "Imię", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Nazwisko", type: "text", required: true, placeholder: "Kowalski" },
            { name: "data_uczestnika", label: "Data urodzenia", type: "date", required: true, max: "today" }
          ] },
        { key: "zgody", label: "Zgody i płatność", type: "checkout", required: true,
          title: "Podsumowanie i zgody", help: "Sprawdź rezerwację i zaakceptuj zgody, żeby przejść do płatności." }
      ]
    }
  };

  













  const VOUCHER_WARIANTY = {
    fundamenty:  { sku: "VOUCHER-DIAG", cena: 899, nazwa: "Voucher - Diagnostyka „Fundamenty”" },
    zajecia1na1: { sku: "VOUCHER-1NA1", cena: 289, nazwa: "Voucher - jedne zajęcia 1:1" }
  };
  const VOUCHER_DOMYSLNY = "fundamenty";
  


  const voucherWariant = () => VOUCHER_WARIANTY[state.answers.rodzaj] || VOUCHER_WARIANTY[VOUCHER_DOMYSLNY];

   
  const state = { schema: null, phase: "intro", idx: 0, branch: null, answers: {}, lastFocus: null };

   
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function resolveDate(v) { return v === "today" ? today() : v; }
  function letter(i) { return String.fromCharCode(65 + i); }

  




  const MERGED_NAMES = [
    { target: "imie_nazwisko", from: ["imie", "nazwisko"] },
    { target: "imie_nazwisko_dziecka", from: ["imie_dziecka", "nazwisko_dziecka"] },
    { target: "imie_nazwisko_uczestnika", from: ["imie_uczestnika", "nazwisko_uczestnika"] },
    { target: "obdarowany", from: ["imie_obdarowanego", "nazwisko_obdarowanego"] }
  ];
  function syncMergedNames() {
    MERGED_NAMES.forEach((m) => {
      const a = state.answers[m.from[0]], b = state.answers[m.from[1]];
      if (a == null && b == null) return;           
      const merged = mergeName(a, b);
      if (merged) state.answers[m.target] = merged;
      else delete state.answers[m.target];
    });
  }

  





  function phoneMask(digits, cc) {
    const G = window.TNMGuards;
    if (G && G.phoneFormat) return G.phoneFormat(digits, cc);
    const d = String(digits || "").replace(/\D/g, "");
    return d.slice(0, cc && cc !== "+48" ? 14 : 9).replace(/(\d{3})(?=\d)/g, "$1 ");
  }
  function phoneMaxDigits(cc) {
    const G = window.TNMGuards;
    return (G && G.phoneLen) ? G.phoneLen(cc) : (cc && cc !== "+48" ? 14 : 9);
  }
   
  function ccSelect(name, cur) {
    const G = window.TNMGuards;
    const opts = (G && G.CC_OPTIONS) || [{ v: "+48", label: "+48 (PL)" }];
    cur = cur || "+48";
    return '<select class="intake-phone__cc" data-cc="' + esc(name) + '" aria-label="Prefiks kraju">' +
      opts.map((o) => '<option value="' + esc(o.v) + '"' + (o.v === cur ? " selected" : "") + ">" + esc(o.label) + "</option>").join("") +
      "</select>";
  }
   
  function condMet(step) {
    if (!step.showWhen) return true;
    const w = step.showWhen, v = state.answers[w.key];
    if (w.includes != null) return Array.isArray(v) ? v.indexOf(w.includes) !== -1 : v === w.includes;
    if (w.eq != null) return v === w.eq;
    return true;
  }
   
  function activeSteps() {
    return state.schema.steps.filter((s) =>
      (!s.branch || s.branch === state.branch) &&
      


      !(s.autoRola && state.autoRola) &&
      condMet(s));
  }

  





  function rolaFromAudience(v) {
    const s = String(v == null ? "" : v).trim().toLowerCase();
    if (s === "child" || s === "adult") return s;
    if (s === "dzieci" || s === "dziecko") return "child";
    if (s === "dorosli" || s === "dorosly" || s === "dorośli") return "adult";
    return null;
  }
  function detectRola(trigger) {
    const d = (trigger && trigger.dataset) || {};
    return rolaFromAudience(d.rola)
      || rolaFromAudience(d.audience)
      || rolaFromAudience(state.answers.audience)
      || rolaFromAudience(/-dzieci(\.html)?$/.test(location.pathname) ? "dzieci"
        : /-dorosli(\.html)?$/.test(location.pathname) ? "dorosli" : "");
  }

  

  const THANK_PHOTO = "assets/img/figma/thx/thx-kobieta-wprost.webp";  
  

  function legalNote(keys) {
    return (window.TNMLegal && window.TNMLegal.note) ? window.TNMLegal.note(keys) : "";
  }
  



  function endingPhoto(schema, answers) {
     
    if (state.thxPhoto) return state.thxPhoto;
    const rola = (answers && answers.rola) || null;
    const aud = rola === "adult" ? "dorosli"
      : rola === "child" ? "dzieci"
      : (window.TNMThx && window.TNMThx.audienceNow ? window.TNMThx.audienceNow() : null);
    




    const id = (schema && schema.id) || "";
    const surface = /polkolonie/.test(id) ? "polkolonie"
      : /voucher/.test(id) ? "voucher"
      : /zespolowe/.test(id) ? "zespoly"
       
      : /male-grupy/.test(id) ? "zespoly"
      : /1na1|zajecia/.test(id) ? "zajecia"
       
      : /hero|pelny/.test(id) ? "formularz"
      : null;
    if (window.TNMThx && window.TNMThx.photo) return window.TNMThx.photo(surface, aud);
    return THANK_PHOTO;
  }
  



  const THANK_LOGO = "assets/img/logo/sygnet-red-square-white.png";

  


  

  const BODY_SPLIT = `<div class="intake-split">
          <aside class="intake-aside">
            <div class="intake-aside__head">
              <span class="intake-aside__eyebrow" id="intake-eyebrow"></span>
              <h3 class="intake-aside__masthead" id="intake-aside-head"></h3>
            </div>
            <p class="intake-aside__text" id="intake-aside-text"></p>
            <div class="intake-aside__status">
              <p class="intake-status-h">Kolejne kroki</p>
              <ol class="intake-timeline" id="intake-timeline"></ol>
            </div>
          </aside>
          <div class="intake-stage">
            <div class="intake-stage__inner" id="intake-stage" tabindex="-1"></div>
          </div>
        </div>`;
  

  const SHELL = `<div class="intake" id="intake" role="dialog" aria-modal="true" aria-labelledby="intake-title" hidden>
    <button class="intake__scrimx" type="button" data-intake-close aria-label="Zamknij okno">${ICO_X}</button>
    <div class="intake__card" role="document">
      <div class="intake__crown">
        <img class="intake__logo" src="assets/img/figma/logo-tnm-white.png?v=20260616" alt="The Noise Makers">
        <span class="intake__title" id="intake-title">Formularz zgłoszeniowy</span>
        <button class="intake__close" type="button" data-intake-close aria-label="Zamknij okno">${ICO_X}</button>
      </div>
      <div class="intake__body">${BODY_SPLIT}</div>
      <div class="intake__foot"><span class="intake__feel">feel the he<span class="art">ART</span></span></div>
      <div class="tnm-hp" aria-hidden="true"><label>Nie wypełniaj tego pola<input type="text" name="tnm_z1" data-hp tabindex="-1" autocomplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"></label></div>
      <div class="intake-paywait" role="status" aria-live="polite" hidden>
        <div class="intake-paywait__box">
          <span class="intake-paywait__mark" aria-hidden="true"><img src="assets/img/logo/sygnet-red-square-white.png" alt="" width="96" height="96"></span>
          <p class="intake-paywait__title">Przygotowujemy płatność</p>
          <p class="intake-paywait__text">To zwykle trwa kilkanaście sekund. Nie zamykaj tego okna - za chwilę przeniesiemy Cię na bezpieczną stronę płatności.</p>
          <p class="intake-paywait__late">Jeszcze chwila, płatność wciąż się przygotowuje.</p>
        </div>
      </div>
    </div>
  </div>`;

  



  function hasBranching() { return state.schema.steps.some((s) => s.setsBranch); }
  function sectionOrder(steps) {
    const order = [];
    steps.forEach((s) => { const n = s.section || s.label; if (order.indexOf(n) === -1) order.push(n); });
    return order;
  }
  function renderTimeline() {
    const ol = document.getElementById("intake-timeline");
    if (!ol) return;
    const steps = activeSteps();
    const useSections = steps.some((s) => s.section);
    let nodes;  
    if (hasBranching() && !state.branch) {
      nodes = [{ label: "Start" }, { label: state.schema.steps[0].label }, { label: "Ścieżka dobierze się sama", ghost: true }];
    } else if (useSections) {
      nodes = [{ label: "Start" }].concat(sectionOrder(steps).map((n) => ({ label: n })));
    } else {
      nodes = [{ label: "Start" }].concat(steps.map((s) => ({ label: s.label })));
    }
     
    let curIdx = state.idx;  
    if (useSections && state.phase === "steps") {
      const cur = steps[state.idx];
      curIdx = cur ? sectionOrder(steps).indexOf(cur.section || cur.label) : 0;
    }
    ol.innerHTML = nodes.map((it, i) => {
      let cls = "intake-tl";
      if (it.ghost) cls += " is-ghost";
      else if (i === 0) cls += state.phase === "intro" ? " is-active" : " is-done";
      else if (state.phase === "ending") cls += " is-done";
      else if (state.phase === "intro") cls += " is-upcoming";
      else if (state.phase === "steps") {
        if (hasBranching() && !state.branch) cls += (i === 1) ? " is-active" : " is-upcoming";
        else { const si = i - 1; cls += si < curIdx ? " is-done" : si === curIdx ? " is-active" : " is-upcoming"; }
      } else cls += " is-upcoming";
      const num = it.ghost ? "" : i;
      return `<li class="${cls}"><span class="intake-tl__n">${num}</span><span class="intake-tl__lab">${esc(it.label)}</span></li>`;
    }).join("");
  }

   
  function optionsHTML(step) {
    const sel = state.answers[step.key];
    const isMulti = step.type === "multi";
    const on = (v) => isMulti ? (Array.isArray(sel) && sel.indexOf(v) !== -1) : sel === v;
    let html = `<div class="intake-opts" role="${isMulti ? "group" : "radiogroup"}" aria-label="${esc(step.title)}">` +
      step.options.map((o, i) =>
        `<button type="button" class="intake-opt${on(o.v) ? " is-on" : ""}${o.off ? " is-off" : ""}" data-val="${esc(o.v)}" role="${isMulti ? "checkbox" : "radio"}" aria-checked="${on(o.v)}"${o.off ? ' aria-disabled="true"' : ""}>` +
        `<span class="intake-opt__badge">${letter(i)}</span><span class="intake-opt__label">${esc(o.label)}</span></button>`
      ).join("") + `</div>`;
     
    if (step.other) {
      const inneOn = on("inne");
      const ov = esc(state.answers[step.key + "_inne"] || "");
      html += `<div class="intake-other${inneOn ? " is-show" : ""}" data-other-wrap="${esc(step.key)}">` +
        `<input type="text" maxlength="60" data-other="${esc(step.key)}" value="${ov}" placeholder="Wpisz, co masz na myśli..." aria-label="Doprecyzuj: Inne"></div>`;
    }
    return html;
  }

   
  function fieldsHTML(fields) {
    return `<div class="intake-fields">` + fields.map((f) => {
      const req = f.required ? '<span class="req">*</span>' : "";
      const val = esc(state.answers[f.name] || "");
      const lab = `<span class="intake-field__lab">${esc(f.label)}${req}</span>`;
      if (f.type === "phone") {
        const cc = state.answers[f.name + "_cc"] || "+48";
         
        const shown = esc(phoneMask(state.answers[f.name] || "", cc));
        return `<label class="intake-field">${lab}` +
          `<span class="intake-phone">${ccSelect(f.name, cc)}` +
          `<input type="tel" inputmode="numeric" maxlength="15" data-name="${f.name}" value="${shown}" placeholder="${esc(f.placeholder || "")}" autocomplete="tel"></span></label>`;
      }
      const t = f.type === "email" ? "email" : f.type === "date" ? "date" : "text";
      const dateAttr = f.type === "date" ? ((f.max ? ` max="${resolveDate(f.max)}"` : "") + (f.min ? ` min="${resolveDate(f.min)}"` : "")) : "";
      const ml = f.maxlength || (f.type === "email" ? 254 : f.type === "date" ? 0 : 80);  
      const mlAttr = ml ? ` maxlength="${ml}"` : "";
      const ac = f.type === "email" ? ' autocomplete="email"' : t === "text" ? ' autocomplete="off"' : "";
      return `<label class="intake-field">${lab}<input type="${t}" data-name="${f.name}" value="${val}" placeholder="${esc(f.placeholder || "")}"${dateAttr}${mlAttr}${ac}></label>`;
    }).join("") + `</div>`;
  }

  


  function childrenArr(step) {
    const n = Math.max(1, parseInt(state.answers.liczba_dzieci, 10) || 1);
    let arr = Array.isArray(state.answers[step.key]) ? state.answers[step.key] : [];
     
     
    while (arr.length < n) arr.push({ imie: "", nazwisko: "", imie_nazwisko: "", dob: "", health: "", art9: false });
    if (arr.length > n) arr = arr.slice(0, n);
    arr.forEach((c) => { c.imie_nazwisko = mergeName(c.imie, c.nazwisko); });
    state.answers[step.key] = arr;
    return arr;
  }
  function childrenHTML(step) {
    const arr = childrenArr(step);
    const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>';
    return '<div class="intake-kids">' + arr.map((c, i) =>
      `<div class="intake-kid" data-kid="${i}">
        <p class="intake-kid__h">Dziecko ${i + 1}${arr.length > 1 ? " z " + arr.length : ""}</p>
        <div class="intake-fields">
          <label class="intake-field"><span class="intake-field__lab">Imię<span class="req">*</span></span>
            <input type="text" maxlength="40" data-child="${i}" data-cf="imie" value="${esc(c.imie || "")}" placeholder="Antoni" autocomplete="off"></label>
          <label class="intake-field"><span class="intake-field__lab">Nazwisko<span class="req">*</span></span>
            <input type="text" maxlength="60" data-child="${i}" data-cf="nazwisko" value="${esc(c.nazwisko || "")}" placeholder="Kowalski" autocomplete="off"></label>
          <label class="intake-field"><span class="intake-field__lab">Data urodzenia<span class="req">*</span></span>
            <input type="date" data-child="${i}" data-cf="dob" value="${esc(c.dob)}" max="${today()}"></label>
          <label class="intake-field intake-field--solo"><span class="intake-field__lab">Zdrowie, alergie, ważne informacje<span class="req">*</span></span>
            <textarea data-child="${i}" data-cf="health" maxlength="600" rows="3" placeholder="np. alergia na orzechy, astma. Jeśli nic - wpisz &quot;brak&quot;.">${esc(c.health)}</textarea></label>
        </div>
        <button type="button" class="intake-consent intake-consent--kid${c.art9 ? " is-on" : ""}" data-art9="${i}" role="checkbox" aria-checked="${c.art9}">
          <span class="intake-consent__box">${c.art9 ? CHECK : ""}</span>
          <span class="intake-consent__txt">Wyrażam zgodę na przetwarzanie informacji o zdrowiu dziecka - wyłącznie po to, aby zapewnić mu bezpieczną opiekę na półkoloniach. Zgoda osobna, wymagana prawem.<span class="req">*</span></span>
        </button>
      </div>`).join("") + "</div>";
  }

  

   
   
  

  








  const DP_TERMIN_IND = "Termin ustalany indywidualnie";
  function dpDataLabel(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    return m ? m[3] + "." + m[2] + "." + m[1] : String(iso || "-");
  }
  



  function dpFlatPayload(payload, dry) {
    const a = state.answers, c = payload.contact || {};
    const child = a.audience === "Dziecko";
    const imie = child ? (a.imie_uczestnika || "").trim() : (c.imie || "").trim();
    const nazwisko = child ? (a.nazwisko_uczestnika || "").trim() : (c.nazwisko || "").trim();
    const part = { imie: imie, nazwisko: nazwisko, imie_nazwisko: mergeName(imie, nazwisko), status: child ? "Dziecko" : "Dorosły" };
    if (child) part.dob = a.data_uczestnika || null;
    





    if (a.poziom) part.poziom = String(a.poziom);
    return {
      dry_run: !!dry, flow: "konfigurator", wariant: "dni-probne",
      submission_id: payload.meta.submission_id, source_sid: null,
      contact: Object.assign({}, c, { imie_nazwisko: c.imie_nazwisko || mergeName(c.imie, c.nazwisko) }),
      paid_items: [{ sku: String(a.sku || ""), qty: 1, data: String(a.termin || "").slice(0, 10), participants: [part] }],
      reservation_items: [],
      consents: { regulamin: a.zgoda_regulamin === true, rodo: a.zgoda_rodo === true },
      meta: payload.meta
    };
  }

  function checkoutHTML(step) {
    const CHECKV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>';
    const mcRow = (key, label, req) => {
      const on = state.answers["zgoda_" + key] === true;
      return `<button type="button" class="intake-consent intake-consent--kid${on ? " is-on" : ""}" data-mc="${key}" role="checkbox" aria-checked="${on}">
        <span class="intake-consent__box">${on ? CHECKV : ""}</span>
        <span class="intake-consent__txt">${label}${req ? '<span class="req">*</span>' : ""}</span></button>`;
    };
    


    

    if (state.schema && state.schema.id === "dni-probne") {
      const a = state.answers;
      const ucz = a.audience === "Dziecko"
        ? [a.imie_uczestnika, a.nazwisko_uczestnika].filter(Boolean).join(" ")
        : [a.imie, a.nazwisko].filter(Boolean).join(" ");
      const cena = parseFloat(a.dp_cena);
      const kwota = isFinite(cena) ? cena.toLocaleString("pl-PL") + " zł" : "-";
      return `<div class="intake-sumbox">
          <div class="intake-sumbox__row"><span>Zajęcia</span><b>${esc(a.dp_nazwa || a.zajecie || "-")}</b></div>
          <div class="intake-sumbox__row"><span>Dzień</span><b>${esc(/^LEKCJA-PROBNA/i.test(String(a.sku || "")) ? DP_TERMIN_IND : dpDataLabel(a.termin))}</b></div>
          <div class="intake-sumbox__row"><span>Poziom</span><b>${esc(a.poziom || "-")}</b></div>
          <div class="intake-sumbox__row"><span>Uczestnik</span><b>${esc(ucz || "-")}</b></div>
          <div class="intake-sumbox__row intake-sumbox__row--tot"><span>Do zapłaty</span><b>${kwota}</b></div>
          <p class="intake-sumbox__note">Kwotę do zapłaty ostatecznie potwierdza bezpieczna strona płatności.</p>
        </div>` +
        mcRow("regulamin", "Akceptuję regulamin sprzedaży i zasady zwrotów The Noise Makers.", true) +
        mcRow("rodo", esc(CONSENT_TEXT), true) +
        legalNote(["regulamin", "prywatnosc"]);
    }
    if (state.schema && state.schema.id === "voucher") {
      const vw = voucherWariant();
      return `<div class="intake-sumbox">
          <div class="intake-sumbox__row"><span>${esc(vw.nazwa)}</span><b>${vw.cena.toLocaleString("pl-PL")} zł</b></div>
          <div class="intake-sumbox__row"><span>Dla</span><b>${esc(state.answers.obdarowany || "-")}</b></div>
          <div class="intake-sumbox__row intake-sumbox__row--tot"><span>Do zapłaty</span><b>${vw.cena.toLocaleString("pl-PL")} zł</b></div>
          <p class="intake-sumbox__note">Kod vouchera wyślemy na Twój e-mail zaraz po opłaceniu. Ważny 12 miesięcy.</p>
        </div>` +
        mcRow("regulamin", "Akceptuję regulamin sprzedaży i zasady zwrotów The Noise Makers.", true) +
        mcRow("rodo", esc(CONSENT_TEXT), true) +
        legalNote(["regulamin", "prywatnosc"]);    
    }
    const t = POLKOLONIE_TURNUSY.find((x) => x.sku === state.answers.turnus);
    const kids = Array.isArray(state.answers.dzieci) ? state.answers.dzieci : [];
    const n = kids.length || Math.max(1, parseInt(state.answers.liczba_dzieci, 10) || 1);
    const total = POLKOLONIE_CENA * n;
    const zl = (x) => x.toLocaleString("pl-PL") + " zł";
    const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>';
    const mc = (key, label, req) => {
      const on = state.answers["zgoda_" + key] === true;
      return `<button type="button" class="intake-consent intake-consent--kid${on ? " is-on" : ""}" data-mc="${key}" role="checkbox" aria-checked="${on}">
        <span class="intake-consent__box">${on ? CHECK : ""}</span>
        <span class="intake-consent__txt">${label}${req ? '<span class="req">*</span>' : ""}</span></button>`;
    };
    return `<div class="intake-sumbox">
        <div class="intake-sumbox__row"><span>Turnus</span><b>${esc(t ? t.termin : "-")}</b></div>
        <div class="intake-sumbox__row"><span>Dzieci</span><b>${n}${kids.length ? " · " + esc(kids.map((k) => (k.imie_nazwisko || "?").split(/\s+/)[0]).join(", ")) : ""}</b></div>
        <div class="intake-sumbox__row intake-sumbox__row--tot"><span>Do zapłaty</span><b>${zl(total)}</b></div>
        <p class="intake-sumbox__note">Kwotę do zapłaty ostatecznie potwierdza bezpieczna strona płatności.</p>
      </div>` +
      mc("regulamin", "Akceptuję regulamin sprzedaży i zasady zwrotów The Noise Makers.", true) +
      mc("rodo", esc(CONSENT_TEXT), true) +
      mc("wizerunek", "Zgadzam się z realizacją materiałów marketingowych z uwzględnieniem wizerunku zgłoszonych osób. Materiały te przede wszystkim służą celom edukacyjnym naszym Podopiecznym. (Zgoda opcjonalna)", false)   +
      legalNote(["regulamin", "prywatnosc"]);    
  }

   
  function stepBodyHTML(step) {
    switch (step.type) {
      case "single":
      case "multi":
        return optionsHTML(step);
      case "fields":
        return fieldsHTML(step.fields);
      case "children":
        return childrenHTML(step);
      case "checkout":
        return checkoutHTML(step);
      case "date": {
        const val = esc(state.answers[step.key] || "");
        const mn = step.min ? ` min="${resolveDate(step.min)}"` : "";
        const mx = step.max ? ` max="${resolveDate(step.max)}"` : "";
        return `<div class="intake-fields"><label class="intake-field intake-field--solo"><input type="date" data-key="1" value="${val}"${mn}${mx}></label></div>`;
      }
      case "long": {
        const val = esc(state.answers[step.key] || "");
        const ml = step.maxlength || 600;
        return `<div class="intake-fields"><label class="intake-field intake-field--solo"><textarea data-key="1" maxlength="${ml}" rows="4" placeholder="${esc(step.placeholder || "")}">${val}</textarea></label></div>`;
      }
      case "text": {
        const val = esc(state.answers[step.key] || "");
        const ml = step.maxlength || 120;
        return `<div class="intake-fields"><label class="intake-field intake-field--solo"><input type="text" maxlength="${ml}" data-key="1" value="${val}" placeholder="${esc(step.placeholder || "")}"></label></div>`;
      }
      case "statement":
         
        return step.text ? `<div class="intake-statement">${step.text}</div>` : "";
      case "scale": {
        const sel = state.answers[step.key];
        const min = step.min != null ? step.min : 1, max = step.max != null ? step.max : 7;
        const lo = step.low || "", hi = step.high || "";
        let btns = "";
        for (let n = min; n <= max; n++) {
          const onN = String(sel) === String(n);
          btns += `<button type="button" class="intake-scale__btn${onN ? " is-on" : ""}" data-scale="${n}" aria-pressed="${onN}">${n}</button>`;
        }
        const ends = (lo || hi) ? `<div class="intake-scale__ends"><span>${esc(lo)}</span><span>${esc(hi)}</span></div>` : "";
        return `<div class="intake-scale"><div class="intake-scale__row">${btns}</div>${ends}</div>`;
      }
      case "number": {
        const min = step.min != null ? step.min : 1;
        const cur = state.answers[step.key] != null ? state.answers[step.key] : (step.default != null ? step.default : min);
        return `<div class="intake-number"><button type="button" class="intake-number__btn" data-step="-1" aria-label="Mniej">&minus;</button>` +
          `<span class="intake-number__val" data-numval>${esc(String(cur))}</span>` +
          `<button type="button" class="intake-number__btn" data-step="1" aria-label="Więcej">+</button></div>`;
      }
      case "consent": {
        const on = state.answers[step.key] === true;
        return `<button type="button" class="intake-consent${on ? " is-on" : ""}" data-consent role="checkbox" aria-checked="${on}">` +
          `<span class="intake-consent__box">${on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>' : ""}</span>` +
          `<span class="intake-consent__txt">${esc(step.consentLabel)}</span></button>` +
          


          legalNote(step.consentKind === "mkt" ? ["prywatnosc"] : ["prywatnosc", "regulamin"]);
      }
      default:
        return "";
    }
  }

   
  function renderSteps() {
    const steps = activeSteps();
    const step = steps[state.idx];
     
    if (state.schema && state.schema.id === "polkolonie" && step && step.key === "turnus") {
      step.options = polOptsWithAvail();
    }
     
    if (step.type === "number" && state.answers[step.key] == null) {
      state.answers[step.key] = step.default != null ? step.default : (step.min != null ? step.min : 1);
    }
    const stepNo = state.idx + 1;  
    const isLast = state.idx >= steps.length - 1;
    const noStar = ["fields", "consent", "statement"];
    const req = step.required && noStar.indexOf(step.type) === -1 ? '<span class="req">*</span>' : "";
    const help = step.help ? `<p class="intake-q__help">${step.help}</p>` : "";
    const nextTxt = isLast ? (state.schema.checkout ? "Przechodzę do płatności" : "Wyślij zgłoszenie") : "Dalej";
    const html =
      `<div class="intake-q">
        <div class="intake-q__head"><span class="intake-q__n">${stepNo}</span>
          <div class="intake-q__heading"><h3 class="intake-q__title">${esc(step.title)}${req}</h3>${help}</div>
        </div>
        <div class="intake-q__body">${stepBodyHTML(step)}</div>
        <p class="intake-err" id="intake-err" role="alert" hidden></p>
        



        <div class="intake-nav">
          <button type="button" class="intake-arrow intake-prev" aria-label="Poprzednie pytanie">${CHEV_L}</button>
          <button type="button" class="btn intake-next">${nextTxt}<span class="intake-next__arr" aria-hidden="true">${CHEV_R}</span></button>
        </div>
        

        <p class="intake-pending" id="intake-pending" role="status" hidden>Przetwarzamy Twoje zgłoszenie - poczekaj kilka sekund na potwierdzenie.</p>
      </div>`;
    paintStage(html);
    renderTimeline();
     
    const stage = document.getElementById("intake-stage");
    const f = stage.querySelector(".intake-opt, .intake-scale__btn, .intake-number__btn, input, textarea, .intake-consent")
      || stage.querySelector(".intake-next");
    if (f) try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); }
  }

   
  function renderIntro() {
    state.phase = "intro";
    const intro = state.schema.intro;
    paintStage(
      `<div class="intake-splash">
        <img class="intake-splash__img" src="${intro.image || "assets/img/figma/form-intro-jestesmy.webp?v=20260706"}" alt="">
        <h2 class="intake-splash__title">${intro.title}</h2>
        <p class="intake-splash__sub">${intro.sub}</p>
        <button type="button" class="btn intake-start">${esc(intro.button)}</button>
        <p class="intake-splash__note">${ICO_CLOCK}<span>${esc(intro.note)}</span></p>
      </div>`
    );
    renderTimeline();
    const b = document.querySelector(".intake-start");
    if (b) try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); }
  }

  


  






  function endingParagraphs(e) {
    const by = e && e.paragraphsByRola;
    if (by) {
      const variant = by[state.answers.rola === "child" ? "child" : "adult"];
      if (variant) return variant;
    }
    return e.paragraphs || (e.sub ? [e.sub] : []);
  }

  function renderEnding() {
    state.phase = "ending";
    const e = state.schema.ending;
    const m = document.getElementById("intake");
    m.classList.add("intake--ty");  
    const paras = endingParagraphs(e).map((p) => `<p>${esc(p)}</p>`).join("");
    const photo = (e && e.photo) || endingPhoto(state.schema, state.answers);  
     
    const tail = e.cta
      ? `<div class="intake-ty__cta"><button type="button" class="btn intake-ty__again" data-intake-restart>${esc(e.cta.label)} <span class="intake-ty__arr" aria-hidden="true">${CHEV_R}</span></button></div>`
      : `<p class="intake-ty__feel">feel the he<span class="art">ART</span></p>`;
    const body = document.querySelector(".intake__body");
     
     
    


    const photoAlt = state.thxPhotoAlt || state.schema.thxAlt || "The Noise Makers";
    body.innerHTML = `<div class="intake-ty">
      <div class="intake-ty__media">
        <span class="intake-ty__media-bg bw" role="img" aria-label="${esc(photoAlt)}" style="background-image:url('${photo}')"></span>
        <span class="intake-ty__logo"><img src="${THANK_LOGO}" alt="The Noise Makers"></span>
      </div>
      <div class="intake-ty__body">
        <button type="button" class="intake-ty__x intake-done" aria-label="Zamknij okno">${ICO_X}</button>
        <h2 class="intake-ty__title">${esc(e.title)}</h2>
        <div class="intake-ty__text">${paras}</div>
        ${tail}
      </div>
    </div>`;
    body.scrollTop = 0;
    const x = body.querySelector(".intake-ty__x");
    if (x) try { x.focus({ preventScroll: true }); } catch (e2) { x.focus(); }
  }

   
  function paintStage(html) {
    const el = document.getElementById("intake-stage");
    el.innerHTML = html;
    el.classList.remove("reveal");
    void el.offsetWidth;
    el.classList.add("reveal");
    const body = document.querySelector(".intake__body");
    if (body) body.scrollTop = 0;
  }

   
  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
   
  function otherErr(step) {
    if (!step.other) return null;
    const sel = state.answers[step.key];
    const inneOn = Array.isArray(sel) ? sel.indexOf("inne") !== -1 : sel === "inne";
    if (inneOn && !(state.answers[step.key + "_inne"] || "").trim()) {
      return { msg: "Uzupełnij pole przy opcji Inne.", el: document.querySelector(`[data-other="${step.key}"]`) };
    }
    return null;
  }
  function validateStep(step) {
    const stage = document.getElementById("intake-stage");
    if (step.type === "statement") return null;
    if (step.type === "number") return null;  
    if (step.type === "single") {
      if (step.required && !state.answers[step.key]) return { msg: "Zaznacz jedną z opcji, aby przejść dalej." };
      return otherErr(step);
    }
    if (step.type === "multi") {
      const a = state.answers[step.key];
      if (step.required && (!Array.isArray(a) || !a.length)) return { msg: "Zaznacz co najmniej jedną opcję." };
      return otherErr(step);
    }
    if (step.type === "scale") {
      if (step.required && state.answers[step.key] == null) return { msg: "Wybierz wartość na skali." };
      return null;
    }
    if (step.type === "consent") {
      if (state.answers[step.key] !== true) return { msg: "Aby wysłać zgłoszenie, zaznacz zgodę." };
      return null;
    }
    const NG = window.TNMGuards;    
    if (step.type === "children") {
      const arr = childrenArr(step);
      for (let i = 0; i < arr.length; i++) {
        const c = arr[i], who = "dziecka " + (i + 1);
        const inp = (cf) => stage.querySelector(`[data-child="${i}"][data-cf="${cf}"]`);
        if ((c.imie || "").trim().length < 2) return { msg: `Podaj imię ${who}.`, el: inp("imie") };
        if ((c.nazwisko || "").trim().length < 2) return { msg: `Podaj nazwisko ${who}.`, el: inp("nazwisko") };
        


        if (NG && NG.hasDigit(c.imie)) return { msg: `Imię ${who} nie może zawierać cyfr.`, el: inp("imie") };
        if (NG && NG.hasDigit(c.nazwisko)) return { msg: `Nazwisko ${who} nie może zawierać cyfr.`, el: inp("nazwisko") };
        if (!c.dob) return { msg: `Podaj datę urodzenia ${who}.`, el: inp("dob") };
        if (!(c.health || "").trim()) return { msg: `Uzupełnij informacje o zdrowiu ${who} (jeśli nic - wpisz „brak").`, el: inp("health") };
        if (c.art9 !== true) return { msg: `Zaznacz zgodę na przetwarzanie informacji o zdrowiu ${who} - bez niej nie możemy przyjąć dziecka na półkolonie.` };
      }
      return null;
    }
    if (step.type === "checkout") {
      if (state.answers.zgoda_regulamin !== true) return { msg: "Zaakceptuj regulamin, żeby przejść do płatności." };
      if (state.answers.zgoda_rodo !== true) return { msg: "Potrzebujemy zgody na przetwarzanie danych, żeby zrealizować zapis." };
      return null;
    }
    if (step.type === "fields") {
      for (const f of step.fields) {
        const v = (state.answers[f.name] || "").trim();
        const inp = stage.querySelector(`[data-name="${f.name}"]`);
        if (f.required && !v) return { msg: `Uzupełnij pole „${f.label}".`, el: inp };
         
        if (v && NG && NG.isPersonNameField(inp) && NG.hasDigit(v)) return { msg: `Pole „${f.label}" nie może zawierać cyfr.`, el: inp };
        if (v && f.type === "email" && !RE_EMAIL.test(v)) return { msg: "Podaj poprawny adres e-mail.", el: inp };
        if (v && f.type === "phone") {
          const cc = state.answers[f.name + "_cc"] || "+48";
          const ph = window.TNMGuards ? window.TNMGuards.normalizePhone(v, cc) : { ok: digits(v).length >= 9 };
           
          if (!ph.ok) return { msg: (window.TNMGuards && window.TNMGuards.phoneMsg) ? window.TNMGuards.phoneMsg(cc, v)
            : (cc === "+48" ? "Numer telefonu: podaj dokładnie 9 cyfr." : "Podaj poprawny numer telefonu."), el: inp };
        }
      }
      return null;
    }
     
    const v = (state.answers[step.key] || "").trim();
    const inp = stage.querySelector("[data-key]");
    if (step.required && !v) return { msg: step.type === "date" ? "Wybierz datę, aby przejść dalej." : "Uzupełnij to pole, aby przejść dalej.", el: inp };
    return null;
  }
  function showErr(msg, el) {
    const e = document.getElementById("intake-err");
    if (e) { e.textContent = msg; e.hidden = false; }
    document.querySelectorAll(".intake-stage .is-invalid").forEach((x) => x.classList.remove("is-invalid"));
    if (el) { el.classList.add("is-invalid"); try { el.focus({ preventScroll: true }); } catch (er) { el.focus(); } }
  }
  function clearErr() {
    const e = document.getElementById("intake-err");
    if (e) e.hidden = true;
    document.querySelectorAll(".intake-stage .is-invalid").forEach((x) => x.classList.remove("is-invalid"));
  }

   
  function startSteps() { state.phase = "steps"; state.idx = 0; renderSteps(); }
  function nextStep() {
    if (state.phase === "intro") { startSteps(); return; }
    if (state.phase === "ending") return;
    const steps = activeSteps();
    const step = steps[state.idx];
    const err = validateStep(step);
    if (err) { showErr(err.msg, err.el); return; }
    clearErr();
    if (step.setsBranch) state.branch = state.answers[step.key];  
    const fresh = activeSteps();
    if (state.idx >= fresh.length - 1) { submit(); return; }
    state.idx++;
    renderSteps();
  }
  


  function navBusy(on) {
    document.querySelectorAll(".intake-next, .intake-prev").forEach((b) => (b.disabled = !!on));
    const note = document.getElementById("intake-pending");
    if (note) note.hidden = !on;
    payWait(on);
  }
  







  function payWait(on) {
    try {
      const pw = document.querySelector("#intake .intake-paywait");
      if (pw) pw.hidden = !(on && state.schema && state.schema.id === "dni-probne");
    } catch (e) {   }
  }

  function prevStep() {
    if (state.phase !== "steps") return;
    clearErr();
    if (state.idx <= 0) { if (state.schema.intro) renderIntro(); return; }  
    state.idx--;
    renderSteps();
  }

  


  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return "sid-" + new Date().getTime().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function labelFor(step, v) {
    if (v == null || v === "") return null;
    if (step.options) {
      if (Array.isArray(v)) return v.map((x) => { const o = step.options.find((o) => o.v === x); return o ? o.label : x; });
      const o = step.options.find((o) => o.v === v); return o ? o.label : v;
    }
    return v;
  }
  



  const CONTACT_KEYS = ["imie_nazwisko", "imie", "nazwisko", "telefon", "email"];
  function buildPayload() {
    syncMergedNames();  
    const schema = state.schema, steps = activeSteps();
    const meta = {
      form: schema.id, form_version: schema.version || "1.1",
      branch: state.branch || null, submission_id: uuid(),
      submitted_at: new Date().toISOString(), source_url: location.href,
      page: (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index",
      locale: "pl",
      referrer: document.referrer || null,                                 
      utm: (typeof tnmUTM === "function") ? tnmUTM() : null,               
      landing_url: (typeof tnmLanding === "function") ? tnmLanding() : null,  
      elapsed_ms: state.openedAt ? (Date.now() - state.openedAt) : null,  
      hp: !!(function(){ var h=document.querySelector("#intake [data-hp]"); return h && h.value && h.value.trim(); })(),  
      rola_auto: state.autoRola === true                                  
    };
     
     
    const contact = {}, G = window.TNMGuards;
    CONTACT_KEYS.forEach((k) => {
      if (state.answers[k] == null || state.answers[k] === "") return;
      if (k === "telefon") { const cc = state.answers.telefon_cc || "+48"; contact[k] = G ? (G.normalizePhone(state.answers[k], cc).e164 || null) : state.answers[k]; }
      else if (k === "email") { contact[k] = G ? G.normEmail(state.answers[k]) : state.answers[k]; }
      else contact[k] = state.answers[k];
    });
    


    const cs = schema.steps.find((s) => s.type === "consent");
    let consent = null;
    if (cs) {
      const on = state.answers[cs.key] === true;
      consent = cs.consentKind === "mkt" ? { rodo: false, mkt: on } : { rodo: on, mkt: false };
    }
     
    if (schema.steps.some((s) => s.type === "checkout")) {
      consent = {
        rodo: state.answers.zgoda_rodo === true,
        regulamin: state.answers.zgoda_regulamin === true,
        wizerunek: state.answers.zgoda_wizerunek === true,
        mkt: false
      };
    }
     
    const answers = {}, answers_labeled = {};
    steps.forEach((step) => {
      if (step.type === "consent" || step.type === "statement" || step.type === "checkout") return;  
      if (step.type === "children") {
         
        const arr = Array.isArray(state.answers[step.key]) ? state.answers[step.key] : [];
        answers[step.key] = arr.map((c) => ({
          imie_nazwisko: mergeName(c.imie, c.nazwisko) || (c.imie_nazwisko || "").trim(),  
          imie: (c.imie || "").trim() || null,         
          nazwisko: (c.nazwisko || "").trim() || null,
          dob: c.dob || null,
          health: (c.health || "").trim() || null,
          art9: c.art9 === true
        }));
        answers_labeled[step.title] = arr.map((c) => c.imie_nazwisko).join("; ");
        return;
      }
      if (step.type === "fields") {
        step.fields.forEach((f) => {
          if (CONTACT_KEYS.indexOf(f.name) !== -1) return;  
          const v = state.answers[f.name]; answers[f.name] = v == null ? null : v;
          answers_labeled[f.label] = v == null ? null : v;
        });
        return;
      }
      const v = state.answers[step.key];
      answers[step.key] = v == null ? null : v;
      answers_labeled[step.title] = labelFor(step, v);
       
      if (step.other) {
        const ot = state.answers[step.key + "_inne"];
        answers[step.key + "_inne"] = ot != null && ot !== "" ? ot : null;
        if (ot) answers_labeled[step.title + " - Inne"] = ot;
      }
    });
     
     
     
    (schema.hidden || []).forEach((h) => {
      if (h.transient) return;
      const v = state.answers[h.key];
      answers[h.key] = v == null || v === "" ? null : v;
      answers_labeled[h.label || h.key] = answers[h.key];
    });
    





    if (contact.imie != null) answers.imie = contact.imie;
    if (contact.nazwisko != null) answers.nazwisko = contact.nazwisko;
    



    if (state.autoRola && state.answers.rola && answers.rola == null) {
      answers.rola = state.answers.rola;
      answers_labeled["Dla kogo"] = state.answers.rola === "child" ? "Dla dziecka" : "Dla siebie (dorosły)";
    }
    ["imie_nazwisko_dziecka", "imie_nazwisko_uczestnika"].forEach((k) => {
      if (state.answers[k]) { answers[k] = state.answers[k]; }
    });
    return { meta, consent, contact, answers, answers_labeled };
  }

   
  async function submit() {
    



    const hp = document.querySelector("#intake [data-hp]");
    const minMs = (window.TNMGuards && window.TNMGuards.MIN_MS) || 800;
    const elapsed = state.openedAt ? (Date.now() - state.openedAt) : 99999;
    const hpTripped = !!(hp && hp.value && hp.value.trim());
    if (hpTripped) { try { console.warn("[TNM] honeypot tripped (intake) - submit zablokowany", { dlugosc: hp.value.length }); } catch (e) {} }
    

    const payload = buildPayload();

     
    if (state.schema.checkout) {
      let out = payload;
      if (state.schema.id === "voucher") {
        










        const vw = voucherWariant();
        const imieObd = (state.answers.imie_obdarowanego || "").trim();
        const nazwiskoObd = (state.answers.nazwisko_obdarowanego || "").trim();
        out = {
          dry_run: false, flow: "voucher",
          submission_id: payload.meta.submission_id, source_sid: null,
          contact: payload.contact,
          paid_items: [{
            

            sku: vw.sku,
            qty: 1,
            participants: [{
              

              imie_nazwisko: (state.answers.obdarowany || "").trim(),
              


              imie: imieObd,
              nazwisko: nazwiskoObd,
               
              dla_kogo: state.answers.dla_kogo || null,
              

              email: (state.answers.email_obdarowanego || "").trim()
            }]
          }],
          reservation_items: [],
          consents: { regulamin: state.answers.zgoda_regulamin === true, rodo: state.answers.zgoda_rodo === true, wizerunek: false },
          obdarowany: (state.answers.obdarowany || "").trim(),
          rodzaj: state.answers.rodzaj || null,
          meta: payload.meta
        };
      } else if (state.schema.id === "dni-probne") {
        


        navBusy(true);
        let q = null;
        try {
          const r0 = await fetch(SCS_HOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dpFlatPayload(payload, true)) });
          let j0 = null; try { j0 = await r0.json(); } catch (e0) {}
          if (r0.status === 400 && j0 && j0.error === "otwarty_invalid_date") {
            showErr("Ten dzień nie jest już dostępny. Wróć do katalogu i wybierz termin z listy.");
            navBusy(false); return;
          }
          if (!r0.ok || !j0 || !j0.quote || !j0.quote.hash) throw new Error("no quote");
          q = j0.quote;
        } catch (e1) {
          showErr("Nie udało się policzyć rezerwacji. Spróbuj ponownie albo napisz na jestem@thenoisemakers.pl.");
          navBusy(false); return;
        }
        out = dpFlatPayload(payload, false);
        out.quote = q;
      } else {
        out.dry_run = false;
      }
      













      out.mkt = window.TNMTrack ? TNMTrack.mkt() : { consent: false, fbp: null, fbc: null, ua: String(navigator.userAgent || "").slice(0, 500) };    
      out.context_json = JSON.stringify(out);
      navBusy(true);
      if (!SCS_LIVE || !SCS_HOOK) {
        console.log("[intake " + state.schema.id + "] payload → S-CS (DEMO, SCS_LIVE=false):", out);
        renderEnding();
        return;
      }
      try {
        const r = await fetch(SCS_HOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(out) });
        let j = null; try { j = await r.json(); } catch (e2) {}
        if (state.schema.id === "dni-probne" && r.status === 409 && j && j.error === "sold_out") {
           
          showErr("Na te zajęcia nie ma już wolnych miejsc. Wybierz inny poziom albo napisz na jestem@thenoisemakers.pl.");
          navBusy(false);
          return;
        }
        if (state.schema.id === "dni-probne" && r.status === 409 && j && j.error === "quote_stale") {
          showErr("Wycena się zmieniła. Kliknij „Przechodzę do płatności” jeszcze raz, żeby ją odświeżyć.");
          navBusy(false);
          return;
        }
        if (r.status === 409 && j && j.error === "sold_out") {
           
          const av = j.available != null ? j.available : 0;
          showErr(av > 0
            ? "Na ten turnus zostało tylko " + av + (av === 1 ? " miejsce" : " miejsca") + ", a zapisujesz " + (j.requested || "więcej") + " dzieci. Zmniejsz liczbę dzieci albo wybierz inny turnus."
            : "Ten turnus właśnie się zapełnił. Wybierz inny termin - zaktualizowaliśmy dostępność.");
          fetchAvailability();
          navBusy(false);
          return;
        }
        if (r.status === 400 && j && j.error === "consents_required") {
          showErr("Zaznacz wymagane zgody, żeby przejść do płatności.");
          navBusy(false);
          return;
        }
        if (!r.ok) throw new Error("HTTP " + r.status);
        if (!j || !j.checkout_url) throw new Error("no checkout_url");
        if (window.TNMTrack) {    
          TNMTrack("checkout_start", { value: (j.amount_total != null ? j.amount_total / 100 : null), currency: "PLN", num_items: (out.paid_items || []).reduce((n, it) => n + (it.qty || 1), 0), contents: (out.paid_items || []).map(it => ({ id: it.sku, quantity: it.qty || 1 })), submission_id: out.submission_id || (out.meta && out.meta.submission_id) || null });
          TNMTrack.go(j.checkout_url);
        } else location.href = j.checkout_url;  
      } catch (e) {
        showErr("Nie udało się uruchomić płatności. Spróbuj ponownie albo napisz na jestem@thenoisemakers.pl.");
        navBusy(false);
      }
      return;
    }

    const url = MAKE_WEBHOOKS[state.schema.id] || "";
    navBusy(true);
    try {
      if (url) {
        const r = await fetch(url, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
        if (window.TNMTrack) TNMTrack("lead_submit", { form: payload.meta.form, submission_id: payload.meta.submission_id, page: payload.meta.page, audience: (payload.answers && payload.answers.audience) || null });    
      } else {
        console.log("[intake " + state.schema.id + "] payload (DEMO - brak webhooka):", payload);
        await new Promise((res) => setTimeout(res, 250));
      }
      renderEnding();
    } catch (e) {
      showErr("Coś poszło nie tak przy wysyłce. Napisz na jestem@thenoisemakers.pl.");
      navBusy(false);
    }
  }

   
   
  function syncOther(stage, step) {
    if (!step.other) return;
    const wrap = stage.querySelector(`[data-other-wrap="${step.key}"]`);
    if (!wrap) return;
    const sel = state.answers[step.key];
    const inneOn = Array.isArray(sel) ? sel.indexOf("inne") !== -1 : sel === "inne";
    wrap.classList.toggle("is-show", inneOn);
    if (inneOn) { const inp = wrap.querySelector("input"); if (inp) try { inp.focus({ preventScroll: true }); } catch (e) {} }
  }
  function onStageClick(e) {
    const opt = e.target.closest(".intake-opt");
    if (opt && opt.classList.contains("is-off")) { return; }  
    if (opt) {
      const stage = document.getElementById("intake-stage");
      const step = activeSteps()[state.idx];
      const v = opt.dataset.val;
      if (step.type === "multi") {
        let arr = Array.isArray(state.answers[step.key]) ? state.answers[step.key].slice() : [];
        const at = arr.indexOf(v);
        if (at === -1) arr.push(v); else arr.splice(at, 1);
        state.answers[step.key] = arr;
        opt.classList.toggle("is-on", arr.indexOf(v) !== -1);
        opt.setAttribute("aria-checked", arr.indexOf(v) !== -1);
      } else {
        state.answers[step.key] = v;
        stage.querySelectorAll(".intake-opt").forEach((o) => {
          const on = o === opt;
          o.classList.toggle("is-on", on);
          o.setAttribute("aria-checked", on);
        });
      }
      syncOther(stage, step);
      clearErr();
      return;
    }
    const sc = e.target.closest(".intake-scale__btn");
    if (sc) {
      const stage = document.getElementById("intake-stage");
      const step = activeSteps()[state.idx];
      state.answers[step.key] = sc.dataset.scale;
      stage.querySelectorAll(".intake-scale__btn").forEach((b) => {
        const on = b === sc; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
      });
      clearErr();
      return;
    }
    const nb = e.target.closest(".intake-number__btn");
    if (nb) {
      const stage = document.getElementById("intake-stage");
      const step = activeSteps()[state.idx];
      const delta = parseInt(nb.dataset.step, 10) || 0;
      const min = step.min != null ? step.min : 1, max = step.max != null ? step.max : 99;
      let cur = parseInt(state.answers[step.key], 10);
      if (isNaN(cur)) cur = step.default != null ? step.default : min;
      cur = Math.max(min, Math.min(max, cur + delta));
      state.answers[step.key] = cur;
      const valEl = stage.querySelector("[data-numval]"); if (valEl) valEl.textContent = String(cur);
      clearErr();
      return;
    }
     
    const kidC = e.target.closest("[data-art9]");
    if (kidC) {
      const step = activeSteps()[state.idx];
      const arr = childrenArr(step);
      const i = parseInt(kidC.dataset.art9, 10);
      if (arr[i]) {
        arr[i].art9 = !arr[i].art9;
        kidC.classList.toggle("is-on", arr[i].art9);
        kidC.setAttribute("aria-checked", arr[i].art9);
        kidC.querySelector(".intake-consent__box").innerHTML = arr[i].art9
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>' : "";
      }
      clearErr();
      return;
    }
    const mcC = e.target.closest("[data-mc]");
    if (mcC) {
      const k = "zgoda_" + mcC.dataset.mc;
      const now = !(state.answers[k] === true);
      state.answers[k] = now;
      mcC.classList.toggle("is-on", now);
      mcC.setAttribute("aria-checked", now);
      mcC.querySelector(".intake-consent__box").innerHTML = now
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>' : "";
      clearErr();
      return;
    }
    const consent = e.target.closest(".intake-consent");
    if (consent) {
      const step = activeSteps()[state.idx];
      const now = !(state.answers[step.key] === true);
      state.answers[step.key] = now;
      consent.classList.toggle("is-on", now);
      consent.setAttribute("aria-checked", now);
      consent.querySelector(".intake-consent__box").innerHTML = now
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>' : "";
      clearErr();
      return;
    }
    if (e.target.closest(".intake-start")) { nextStep(); return; }
    


    if (e.target.closest("[data-intake-restart]")) { openIntake(state.which || "pelny", null, null, { noAuto: true }); return; }
    if (e.target.closest(".intake-done")) { closeIntake(); return; }
    if (e.target.closest(".intake-next")) { nextStep(); return; }
    if (e.target.closest(".intake-prev")) { prevStep(); return; }
  }
  function onStageInput(e) {
    const t = e.target;
    const step = activeSteps()[state.idx];
    if (t.dataset && t.dataset.cc != null) { state.answers[t.dataset.cc + "_cc"] = t.value; clearErr(); return; }
     
    if (t.dataset && t.dataset.child != null && t.dataset.cf) {
      const arr = childrenArr(step);
      const i = parseInt(t.dataset.child, 10);
      if (arr[i]) {
        arr[i][t.dataset.cf] = t.value;
         
        arr[i].imie_nazwisko = mergeName(arr[i].imie, arr[i].nazwisko);
      }
      clearErr(); return;
    }
    if (t.dataset && t.dataset.name) {
       
      const f = step.fields && step.fields.find((x) => x.name === t.dataset.name);
      if (f && f.type === "phone") {
        const cc = state.answers[t.dataset.name + "_cc"] || "+48";
        const cleaned = t.value.replace(/\D/g, "").slice(0, phoneMaxDigits(cc));
        state.answers[t.dataset.name] = cleaned;
        const masked = phoneMask(cleaned, cc);
        


        if (masked !== t.value) { t.value = masked; try { t.setSelectionRange(masked.length, masked.length); } catch (err) {   } }
      }
      else state.answers[t.dataset.name] = t.value;
      syncMergedNames();
      clearErr();
    }
    else if (t.dataset && t.dataset.other) { state.answers[t.dataset.other + "_inne"] = t.value; clearErr(); }
    else if (t.dataset && t.dataset.key) { state.answers[step.key] = t.value; clearErr(); }
  }
   
  function onStageKeydown(e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); nextStep(); }
  }

   
  function focusables(card) {
    return [...card.querySelectorAll('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null && !el.hasAttribute("data-hp"));  
  }
  function onKeydown(e) {
    const m = document.getElementById("intake");
    if (!m || m.hidden) return;
    if (e.key === "Escape") { closeIntake(); return; }
    if (e.key !== "Tab") return;
    const f = focusables(m.querySelector(".intake__card"));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openIntake(which, trigger, prefill, opts) {
    const schema = SCHEMAS[which] || SCHEMAS.hero;
    const m = document.getElementById("intake");
    if (!m) return;
    state.schema = schema; state.which = which; state.phase = "intro"; state.idx = 0; state.branch = null; state.answers = {};
    





    state.thxPhoto = (opts && opts.thxPhoto)
      || (trigger && trigger.dataset && trigger.dataset.thxPhoto)
      || null;
     
    state.thxPhotoAlt = (opts && opts.thxPhotoAlt)
      || (trigger && trigger.dataset && (trigger.dataset.thxAlt || trigger.dataset.prowadzacy))
      || null;
    state.openedAt = Date.now();  
    


    try {
      m.setAttribute("data-form-name", schema.id);
      m.setAttribute("data-content-name", (prefill && (prefill.zajecie || prefill.typ_zajec)) || (trigger && trigger.dataset && (trigger.dataset.zapis || trigger.dataset.prowadzacy)) || "");
      m.removeAttribute("data-lead-started");
    } catch (e) {}
     
     
    (schema.hidden || []).forEach((h) => {
      let val = trigger && trigger.dataset && trigger.dataset[h.param] != null ? trigger.dataset[h.param] : null;
      if (val == null && h.default != null) val = h.default;
      state.answers[h.key] = val;
    });
    if (prefill) Object.keys(prefill).forEach((k) => { if (prefill[k] != null && prefill[k] !== "") state.answers[k] = prefill[k]; });
    



    state.autoRola = false;
    const rolaStep = (opts && opts.noAuto) ? null : schema.steps.find((s) => s.autoRola && s.key === "rola");
    if (rolaStep) {
      const auto = detectRola(trigger);
      if (auto) {
        state.answers.rola = auto;
        state.autoRola = true;
        if (rolaStep.setsBranch) state.branch = auto;
      }
    }
     
    if (schema.id === "polkolonie" && state.answers.turnus_hint) {
      const th = String(state.answers.turnus_hint);
      const t = POLKOLONIE_TURNUSY.find((x) => x.termin === th || th.indexOf(x.termin) !== -1);
      if (t && turnusFuture(t)) state.answers.turnus = t.sku;
    }
     
    if (schema.id === "polkolonie") {
      fetchAvailability().then(function () {
        if (!AVAIL) return;
        const cur = state.phase === "steps" && activeSteps()[state.idx];
        if (cur && cur.key === "turnus") renderSteps();
         
        const a = state.answers.turnus && AVAIL[state.answers.turnus];
        if (a && a.wolne <= 0) delete state.answers.turnus;
      });
    }
    state.lastFocus = document.activeElement;
     
    m.classList.remove("intake--ty");
    m.querySelector(".intake__body").innerHTML = BODY_SPLIT;
     
    m.querySelector("#intake-title").textContent = schema.masthead;
    const eb = m.querySelector("#intake-eyebrow"); if (eb) eb.textContent = (schema.aside && schema.aside.eyebrow) || "";
    const hd = m.querySelector("#intake-aside-head"); if (hd) hd.textContent = schema.masthead;
     
    const tx = m.querySelector("#intake-aside-text"); if (tx) tx.textContent = (schema.aside && schema.aside.text) || "";
    if (schema.intro) renderIntro(); else startSteps();  
    payWait(false);  
    m.hidden = false; void m.offsetWidth; m.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
  }
  function closeIntake() {
    const m = document.getElementById("intake");
    if (!m) return;
    m.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    let fallback;
    const done = () => { clearTimeout(fallback); m.hidden = true; m.removeEventListener("transitionend", done); };
    m.addEventListener("transitionend", done);
    fallback = setTimeout(done, 400);
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

   
  function init() {
    if (document.getElementById("intake")) return;
    document.body.insertAdjacentHTML("beforeend", SHELL);
    const m = document.getElementById("intake");
    







    m.addEventListener("click", (e) => { if (e.target.closest("[data-intake-close]")) closeIntake(); });
    




     
    const card = m.querySelector(".intake__card");
    card.addEventListener("click", onStageClick);
    card.addEventListener("input", onStageInput);
    card.addEventListener("keydown", onStageKeydown);
    



    window.addEventListener("pageshow", (e) => { try { if (e.persisted) navBusy(false); } catch (er) {   } });
     
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-intake]");
       
      if (t) { e.preventDefault(); openIntake(t.dataset.intake || "hero", t, null, { thxPhoto: t.dataset.thxPhoto || null }); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

   
  window.TNMIntake = { open: openIntake, close: closeIntake };
})();
