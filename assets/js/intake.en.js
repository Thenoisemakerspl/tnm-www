






















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
    .map((t) => ({ v: t.sku, label: t.termin + "  ·  1 499 zł / child" }));
   
  function polOptsWithAvail() {
    return POLKOLONIE_TURNUSY.filter(turnusFuture).map((t) => {
      const a = AVAIL && AVAIL[t.sku];
      let label = t.termin + "  ·  1 499 zł / child";
      let off = false;
      if (a) {
        if (a.wolne <= 0) { label += "  ·  NO PLACES LEFT"; off = true; }
        else if (a.wolne <= 4) label += "  ·  only " + a.wolne + (a.wolne === 1 ? " miejsce" : " miejsca");
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
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ].map((d) => ({ v: d.toLowerCase().slice(0, 3), label: d }));

  const FORMULA = [
    { v: "indywidualne", label: "One-to-one classes" },
    { v: "grupowe", label: "Group classes" }
  ];

  



  const JEZYK = [
    { v: "polski", label: "polski" },
    { v: "angielski", label: "angielski" },
    { v: "niemiecki", label: "niemiecki" }
  ];

  




  






   
  const withInne = (arr) => arr.concat([{ v: "inne", label: "Other" }]);

   
  const mergeName = (imie, nazwisko) =>
    [String(imie == null ? "" : imie).trim(), String(nazwisko == null ? "" : nazwisko).trim()]
      .filter(Boolean).join(" ");

   
   
  const CONTACT1 = [
    { name: "imie", label: "First name", type: "text", required: true, placeholder: "Joanna" },
    { name: "nazwisko", label: "Last name", type: "text", required: true, placeholder: "Kowalska" },
    { name: "telefon", label: "Phone number", type: "phone", required: true, placeholder: "512 345 678" },
    { name: "email", label: "E-mail", type: "email", required: true, placeholder: "example@example.com" }
  ];

   
  const DLA_KOGO = [
    { v: "adult", label: "For myself (adult)" },
    { v: "child", label: "For my child" }
  ];

  




   
  const OBSZARY_A = [
    { v: "muz_instrument", label: "music classes - learning to play instruments" },
    { v: "muz_kompozycja", label: "music classes - composition, production, conducting, music" },
    { v: "sceniczne", label: "stage classes - musical, dance, acting, singing" },
    { v: "slowo", label: "expression through words - writing books, journalism" },
    { v: "wizualne", label: "expression through images - painting, drawing, comics, photography" },
    { v: "emocje", label: "classes around emotions - emotion regulation, relaxation concert, yoga" },
    { v: "ruch", label: "classes around movement - dance, intuitive dance" },
    { v: "rozmowy", label: "meetings about art and music - where to go? what and when to see and listen to?" },
    { v: "duza_grupa", label: "the energy of a large group - sing in a choir, act in a show and a musical, express yourself through dance and movement in a large group" },
    { v: "glos", label: "classes in voice awareness - voice training, presentation workshops, breath, exercises that regulate and focus" }
  ];
   
  const OBSZARY_B = [
    { v: "muz_instrument", label: "music classes - learning to play instruments and singing" },
    { v: "muz_kompozycja", label: "music classes - composition, production, conducting, music" },
    { v: "sceniczne", label: "stage classes - musical, dance, acting" },
    { v: "slowo", label: "expression through words - writing books, journalism" },
    { v: "wizualne", label: "expression through images - painting, drawing, comics, photography" },
    { v: "emocje", label: "classes around emotions - emotion regulation, breath, sensory play, meditation, yoga" },
    { v: "duza_grupa", label: "the energy of a large group - sing in a choir" },
    { v: "ruch", label: "classes around movement - dance, intuitive dance" }
  ];

  const INSTRUMENTY = ["Piano", "Guitar", "Violin", "Drums", "Saxophone", "Handpan", "Ukulele"]
    .map((x) => ({ v: x.toLowerCase(), label: x }));

  


  const EDU_EMO_A = [
    { v: "oddech", label: "Breath and concentration" },
    { v: "emocje_medytacja", label: "Releasing emotions + meditation" },
    { v: "joga", label: "Yoga" },
    { v: "muzykoterapia", label: "Music therapy" },
    { v: "harmonizacja", label: "Classes with instruments - harmonising the body" },
    { v: "relaksacja", label: "Events - Relaxation" },
    { v: "ruch_potrzeby", label: "Movement - listen to your needs" },
    { v: "malarstwo_intuicyjne", label: "Intuitive painting" },
    { v: "uwaznosc_1na1", label: "A 1:1 meeting of mindfulness for yourself" }
  ];
  const EDU_EMO_B = [
    { v: "oddech", label: "Breath and concentration" },
    { v: "emocje_medytacja", label: "Releasing emotions + meditation" },
    { v: "joga", label: "Yoga with the sounds of instruments" },
    { v: "muzykoterapia", label: "Music therapy" },
    { v: "harmonizacja", label: "Classes with instruments - harmonising the body" },
    { v: "sensoryka", label: "Sensory play" },
    { v: "regulacja_oddech", label: "Emotion regulation with breathing techniques" },
    { v: "ja_i_emocje_1na1", label: "1:1 meetings - “Me and my emotions”" }
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
    { v: "tyg_09_12", label: "on weekdays: 09:00 - 12:00" },
    { v: "tyg_12_14", label: "on weekdays: 12:00 - 14:00" },
    { v: "tyg_14_16", label: "on weekdays: 14:00 - 16:00" },
    { v: "tyg_16_18", label: "on weekdays: 16:00 - 18:00" },
    { v: "tyg_18_21", label: "on weekdays: 18:00 - 21:00" },
    { v: "wknd_poranki", label: "weekend: mornings" },
    { v: "wknd_popol", label: "weekend: afternoons" }
  ];
  const GODZINY_B = [
    { v: "tyg_09_14", label: "on weekdays: 09:00 - 14:00" },
    { v: "tyg_14_16", label: "on weekdays: 14:00 - 16:00" },
    { v: "tyg_16_18", label: "on weekdays: 16:00 - 18:00" },
    { v: "tyg_18_20", label: "on weekdays: 18:00 - 20:00" },
    { v: "wknd_poranne", label: "weekend: mornings" },
    { v: "wknd_popol", label: "weekend: afternoons" }
  ];

   
  const MOTYWACJA_A = [
    { v: "pasja", label: "Growing passions" },
    { v: "relaks", label: "Relaxation | Rest" },
    { v: "czas_ze_soba", label: "Time with yourself | Self-awareness" },
    { v: "grupa_zabawa", label: "Joy and great fun in a larger group" },
    { v: "poznanie_sztuki", label: "Discovering Music - Art" }
  ];
  const MOTYWACJA_B = [
    { v: "pasja", label: "Growing passions" },
    { v: "edukacja_art", label: "Professional artistic education" },
    { v: "emocje", label: "Working with emotions" },
    { v: "grupa_zabawa", label: "Joy and great fun in a larger group" },
    { v: "poznanie_sztuki", label: "Discovering Music - Art" }
  ];
  const ZAJECIA_WYBOR = [
    { v: "muzyka_1na1", label: "MUSIC classes (1:1) - instruments, production, vocals" },
    { v: "muzyka_male", label: "MUSIC classes (Small groups) - music, visual arts, movement" },
    { v: "scena_male", label: "STAGE classes (Small groups) - dance, acting, vocals" },
    { v: "slowo_male", label: "WORD classes (Small groups) - writing books, poetry, screenplays, journals" },
    { v: "emocje", label: "EMOTIONS classes (1:1 + Small groups) - growth through art, self-awareness, emotions, I see myself" },
    { v: "scena_zespol", label: "STAGE classes (Ensemble) - a big group, joy, satisfaction, singing, acting, musical" },
    { v: "klub", label: "TNM | CLUB - Meetings about art and music, organised outings together" }
  ];
  const DZIELNICE = ["Mokotów", "Praga", "Sadyba", "Wawer", "Wilanów", "Wola", "Ursus", "Ursynów"]
    .map((x) => ({ v: x.toLowerCase().replace(/ó/g, "o").replace(/ł/g, "l"), label: x }));

  



  const GODZINY_HERO = [
    { v: "tyg_09_12", label: "Weekdays: 09:00 - 12:00" },
    { v: "tyg_12_14", label: "Weekdays: 12:00 - 14:00" },
    { v: "tyg_14_16", label: "Weekdays: 14:00 - 16:00" },
    { v: "tyg_16_18", label: "Weekdays: 16:00 - 18:00" },
    { v: "tyg_18_20", label: "Weekdays: 18:00 - 20:00" },
    { v: "wknd_poranki", label: "Weekend: mornings" },
    { v: "wknd_popol", label: "Weekend: afternoons" },
    { v: "wknd_wieczory", label: "Weekend: evenings" }
  ];

  


  const ZAJECIA_DZIECKO_HERO = [
    { v: "muz_instrument", label: "Music classes - learning to play instruments and singing" },
    { v: "muz_kompozycja", label: "Music classes - composition, production, conducting, music" },
    { v: "sceniczne", label: "Stage classes - musical, dance, acting" },
    { v: "slowo", label: "Expression through words - writing books, journalism" },
    { v: "wizualne", label: "Expression through images - painting, drawing, comics, photography" },
    { v: "ruch", label: "Movement classes - intuitive dance, dance" },
    { v: "emocje", label: "Emotions - emotion regulation, relaxation, sensory play, yoga, relaxation session" },
    { v: "rozmowy", label: "Conversations about art and music - an engaging, broad look at art and music (meetings)" }
  ];

  


  const DIAGNOSTYKA_HERO = [
    { v: "fundamenty", label: "“Fundamentals” - 1:1 session" },
    { v: "poznajmy", label: "“Let's meet” - Online appointment" }
  ];
   
  const DIAGNOSTYKA_PELNY = [
    { v: "fundamenty", label: "1:1 assessment - “Fundamentals” (offline)" },
    { v: "poznajmy", label: "1:1 call - “Let's meet” (online)" }
  ];

  









  const ADMIN_DANYCH = "The Art Makers sp. z o.o. (The Noise Makers brand)";
  const CONSENT_TEXT = "I agree to the processing of my personal data (and my child's data, where applicable) by " + ADMIN_DANYCH + " for the purpose of contact and matching classes. Giving your data is voluntary. I have the right to access my data, to correct it, to delete it and to withdraw my consent at any time. Details in the Privacy Policy.";
  const CONSENT_MKT = "I agree to receive the ARTletter newsletter (information about classes, events and news) at the email address given, and to the processing of my data for this purpose by " + ADMIN_DANYCH + ". I can withdraw my consent at any time. Details in the Privacy Policy.";

  

  const FORM_ENDING = {
    title: "Thank you for sending the sign-up form.",
    paragraphs: [
      "We have received your answers to our questions. Over the next 72 h we will look into your needs and come back to you with our recommended solutions.",
      "Now take a deep breath and relax. We will take care of choosing the next steps on your growth path. And you will make the decision.",
      "Growing a passion is joy and satisfaction. That is exactly what the TNM team cares for.",
      "We will come back to you very soon.",
      "If you want to add another person, we are here."
    ],
    cta: { label: "Add another person", action: "restart" }
  };

  





  






  const waitlistSteps = (typ) => [
    { key: "rola", label: "For whom", type: "single", required: true, autoRola: true,
      title: "Who are you signing up?", options: [
        { v: "adult", label: "For myself (adult)" },
        { v: "child", label: "For a child" }
      ] },
    { key: "kontakt", label: "Your details", type: "fields", required: true,
      title: "Your details (Person signing up | Guardian)",
      help: "Leave us your contact details (the person signing up). We will come back to you first with news.",
      fields: CONTACT1 },
    { key: "uczestnik", label: "Participant", type: "fields", required: true,
      title: "Student | Participant details",
      help: typ === "zespolowe"
        ? "Give us the details of the participant who will be attending our ensemble classes. That way we will match the classes better."
        : "Give us the details of the participant who will be attending our small group classes. That way we will match the classes better.",
      showWhen: { key: "rola", eq: "child" },
      fields: [
        { name: "imie_uczestnika", label: "First name", type: "text", required: true, placeholder: "Antoni" },
        { name: "nazwisko_uczestnika", label: "Last name", type: "text", required: true, placeholder: "Kowalski" },
        { name: "data_uczestnika", label: "Date of birth", type: "date", required: true, max: "today" }
      ] },
    { key: "zgoda", label: "Consent", type: "consent", required: true,
      title: "Consent to data processing", consentLabel: CONSENT_TEXT }
  ];

  






  const GRUPA_ENDING = {
    child: [
      "We are glad we will soon meet your child and guide them into discovering their passion.",
      "There will be lots of joy, smiles, energy and a wonderful group.",
      "Exciting times ahead!",
      "See you soon."
    ],
    adult: [
      "We are glad we will soon meet you in class.",
      "This adventure is an experience full of life, joy and energy in a larger group.",
      "So get ready for your power and self-expression.",
      "Exciting times ahead!",
      "See you soon."
    ]
  };

  





  const SCHEMAS = {
    hero: {
      id: "hero-skrocony",
      version: "2.1",
      masthead: "Sign-up form",
      aside: {
        eyebrow: "Free · a few minutes",
        title: "We are here to hear your voice.",
        text: "No commitment - we come back to you with a proposal, usually within 72 h."
      },
       
      intro: {
        image: "../assets/img/figma/form-intro-jestesmy.webp?v=20260706",
        title: "We are here to hear your voice.",
        sub: "Answer a few questions,<br>and we will match the right classes and Tutors for you. Shall we begin?",
        button: "I am in, let's start!",
        note: "Takes 5 minutes"
      },
      




      ending: FORM_ENDING,
      steps: [
        




        { key: "rola", section: "For whom", label: "For whom", type: "single", required: true, setsBranch: true, autoRola: true,
          title: "Let's start with the key question: who are you looking for classes for?",
          help: "Our offer includes classes for children and for adults. Decide below:",
          options: [
            { v: "adult", label: "For myself (adult classes)" },
            { v: "child", label: "For my child (children's classes)" }
          ] },
        { key: "kontakt", section: "Contact details", label: "Contact details", type: "fields", required: true,
          title: "Now we ask you for your contact details.",
          help: "Fill in your details so we can come back to you with the right class offer.",
          fields: CONTACT1 },

         
        { branch: "adult", section: "Preferences", key: "a_urodziny", label: "Date of birth", type: "date", required: true,
          title: "Give us your date of birth", help: "This will help us match the right classes for you.", max: "today" },
        { branch: "adult", section: "Preferences", key: "a_forma", label: "Class format", type: "multi", required: true,
          title: "What class format are you looking for?", options: FORMULA },
        { branch: "adult", section: "Preferences", key: "a_motywacja", label: "Motivation", type: "multi", required: true,
          title: "What is your motivation for joining our classes?", help: "You can select several.", options: MOTYWACJA_A },
        { branch: "adult", section: "Preferences", key: "a_zajecia", label: "Classes", type: "multi", required: false,
          title: "Which classes would you like to take part in?", help: "You can select several.", options: ZAJECIA_WYBOR },
        { branch: "adult", section: "Preferences", key: "a_zajecia_open", label: "Choice of classes", type: "long", required: false,
          title: "If you know which classes you want to join, write below:", placeholder: "Your message..." },
        { branch: "adult", section: "Availability", key: "a_dni", label: "Days", type: "multi", required: true,
          title: "Which days can you attend classes?", help: "Choose the days that work for you so we can match the proposed class times to your needs.", options: DAYS },
         
        { branch: "adult", section: "Availability", key: "a_godziny", label: "Hours", type: "multi", required: true,
          title: "Which times work for you?", help: "Choose the time ranges that work for you for the chosen classes on the days you selected.", options: GODZINY_HERO },
        { branch: "adult", section: "Availability", key: "a_start", label: "Start date", type: "date", required: true,
          title: "When would you like to start classes?", help: "Give a start date that works for you.", min: "today" },
        { branch: "adult", section: "Availability", key: "a_lokalizacja", label: "Location", type: "multi", required: true,
          title: "Which location works for you?", help: "Choose the districts that work for you from the list below (you can select several):", options: DZIELNICE },
        { branch: "adult", section: "Availability", key: "a_uwagi", label: "Notes", type: "long", required: false,
          title: "Is there anything else we should know before we recommend classes for you?", placeholder: "Your message..." },

         
        { branch: "child", section: "Preferences", key: "b_dziecko", label: "Child's details", type: "fields", required: true,
          title: "Give us your child's details as well.", help: "These details will help us match the classes to their needs.",
          fields: [
             
             
            { name: "imie_dziecka", label: "First name", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_dziecka", label: "Last name", type: "text", required: true, placeholder: "Kowalski" },
            { name: "wiek_dziecka", label: "Age", type: "text", required: true, placeholder: "Np. 7" },
            { name: "jednostka_eduk", label: "The educational setting they currently attend", type: "text", required: false, placeholder: "E.g. nursery / school" }
          ] },
        { branch: "child", section: "Preferences", key: "b_urodziny", label: "Child's date of birth", type: "date", required: true,
          title: "Give us your child's date of birth.", help: "We will match the right group for them.", max: "today" },
        { branch: "child", section: "Preferences", key: "b_forma", label: "Class format", type: "multi", required: true,
          title: "What class format are you looking for?", options: FORMULA },
        { branch: "child", section: "Preferences", key: "b_motywacja", label: "Motivation", type: "multi", required: true,
          title: "What is your motivation for signing your child up for classes?", help: "You can select several.", options: MOTYWACJA_B },
         
        { branch: "child", section: "Preferences", key: "b_zajecia", label: "Child's classes", type: "multi", required: false,
          title: "Which classes would you like your child to take part in?", help: "You can select several answers.", options: ZAJECIA_DZIECKO_HERO },
        { branch: "child", section: "Preferences", key: "b_zajecia_open", label: "Choice of classes", type: "long", required: false,
          title: "Which classes do you want to sign your child up for?", help: "If you have already made your choice, write it below.", placeholder: "Your message..." },
        { branch: "child", section: "Availability", key: "b_dni", label: "Days", type: "multi", required: true,
          title: "Which days can your child attend classes?", help: "Choose the days that work for you both so we can propose the right classes.", options: DAYS },
        

        { branch: "child", section: "Availability", key: "b_godziny", label: "Hours", type: "multi", required: false,
          title: "Which times work for you?", help: "Choose the time ranges that work for you both for the chosen classes on the days you selected.", options: GODZINY_HERO },
        { branch: "child", section: "Availability", key: "b_start", label: "Start date", type: "date", required: true,
          title: "When would you like to start classes?", help: "Give a start date that works for you.", min: "today" },
        { branch: "child", section: "Availability", key: "b_lokalizacja", label: "Location", type: "multi", required: true,
          title: "Which location works for you?", help: "Choose the districts that work for you from the list below (you can select several):", options: DZIELNICE },
        { branch: "child", section: "Availability", key: "b_uwagi", label: "Notes", type: "long", required: false,
          title: "Is there anything else we should know before we recommend classes for you both?", help: "You know your child best and you know what matters about them. We will take it into account when matching classes.", placeholder: "Your message..." },

        


        { key: "diagnostyka", section: "Availability", label: "Diagnostic meeting", type: "single", required: false,
          title: "Would you like to book a diagnostic meeting?", help: "Choose the type of meeting.", options: DIAGNOSTYKA_HERO },

         
        { key: "zgoda", section: "Consent", label: "Consent", type: "consent", required: true,
          title: "Consent to data processing", consentLabel: CONSENT_TEXT }
      ]
    },

    


    pelny: {
      id: "pelny",
      version: "1.2",
      masthead: "Sign-up form",
      aside: {
        eyebrow: "Expression of interest",
        title: "We are here to hear your voice.",
        text: "The more you tell us, the better the match. We come back with a proposal within 72 h."
      },
      intro: {
        title: "We are here to hear your voice.",
        sub: "Answer a few questions,<br>and we will match the right classes and Tutors for you. Shall we begin?",
        button: "I am in, let's start!",
        note: "Takes 5 minutes"
      },
      ending: FORM_ENDING,
      steps: [
         
        { key: "rola", section: "Choice", label: "For whom", type: "single", required: true, setsBranch: true, autoRola: true,
          title: "Let's start with the key question: who are you looking for classes for?",
          help: "Our offer includes classes for children and for adults. Decide below:",
          options: DLA_KOGO },

         
        { branch: "adult", section: "Contact", key: "a_kontakt", label: "Contact details", type: "fields", required: true,
          title: "Your contact details", help: "Leave us your details so we can come back with a proposal.", fields: CONTACT1 },
        { branch: "adult", section: "About you", key: "a_intro", label: "About you", type: "statement",
          title: "Let us get to know you and your needs.",
          text: "<p>A few questions about what you are looking for - they help us match classes and a Tutor for you.</p>" },
        { branch: "adult", section: "About you", key: "a_formula", label: "Format", type: "multi", required: true,
          title: "What class format are you looking for?", help: "You can select several.", options: FORMULA },
        { branch: "adult", section: "About you", key: "a_urodziny", label: "Date of birth", type: "date", required: true,
          title: "Give us your date of birth", max: "today" },
        { branch: "adult", section: "About you", key: "a_obszary", label: "Areas", type: "multi", required: true,
          title: "Below is a list of the artistic areas we teach in. Point us to your interests - we will ask for more in the next steps.",
          help: "Select the areas that interest you. Even if you are not sure what they mean, follow your intuition. Maybe a completely new area will draw you in.",
          options: OBSZARY_A },
        { branch: "adult", section: "About you", key: "a_instrumenty", label: "Instruments", type: "multi", required: true, other: true,
          title: "Below is a list of musical instruments. Would you like to develop through playing one of them?",
          help: "Select the instruments you are interested in.",
          options: withInne(INSTRUMENTY), showWhen: { key: "a_obszary", includes: "muz_instrument" } },
        { branch: "adult", section: "About you", key: "a_eduemo", label: "Emotional education", type: "multi", required: true,
          title: "At TNM we also run classes in emotional education. If you feel that is for you - choose specific directions from the list below.",
          help: "You can select several.", options: EDU_EMO_A },
        { branch: "adult", section: "About you", key: "a_doswiadczenie", label: "Experience", type: "long", required: false,
          title: "Do you have experience in the interests you selected earlier?", placeholder: "E.g. 3 years of playing the guitar..." },
        { branch: "adult", section: "About you", key: "a_dni", label: "Available days", type: "multi", required: true,
          title: "Which days can you attend classes?",
          help: "Choose the days that work for you so we can match the proposed class times to your needs.", options: DAYS },
        { branch: "adult", section: "About you", key: "a_godziny", label: "Hours", type: "multi", required: true,
          title: "Which times work for you?",
          help: "Give the time ranges that work for you for the chosen classes. You can select several answers.",
          options: GODZINY_A },
        { branch: "adult", section: "About you", key: "a_start", label: "Start date", type: "date", required: true,
          title: "When would you like to start classes?", min: "today" },
        { branch: "adult", section: "About you", key: "a_pewnosc", label: "Confidence", type: "scale", required: true,
          title: "How would you describe your confidence in the artistic directions you chose in the previous questions?",
          help: "Scale from 1 (I am not sure) to 7 (yes, I am sure about my choice).",
          min: 1, max: 7, low: "Not sure", high: "Very sure" },
        { branch: "adult", section: "About you", key: "a_uwagi", label: "Notes", type: "long", required: false,
          title: "Is there anything else you feel we should hear before we match classes for you?", placeholder: "Your message..." },

         
        { branch: "child", section: "Contact", key: "b_kontakt", label: "Contact details", type: "fields", required: true,
          title: "Your contact details", help: "Details of the person signing up (Parent/Guardian). We will use these details for the registration.", fields: CONTACT1 },  
        { branch: "child", section: "About your child", key: "b_intro", label: "About your child", type: "statement",
          title: "Tell us about your child.",
          text: "<p>A few basic details so we can match the classes well.</p>" },
        { branch: "child", section: "About your child", key: "b_dziecko", label: "Child's details", type: "fields", required: true,
          title: "Your child's details", fields: [
             
             
            { name: "imie_dziecka", label: "Child's first name", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_dziecka", label: "Child's last name", type: "text", required: true, placeholder: "Kowalski" },
            { name: "data_dziecka", label: "Child's date of birth", type: "date", required: true, max: "today" }
          ] },
        { branch: "child", section: "About your child", key: "b_jezyk", label: "Language of classes", type: "multi", required: true, other: true,
          title: "In which language would you like the classes to be taught?", help: "You can select several.", options: JEZYK.concat([{ v: "inne", label: "Other" }]) },  
        { branch: "child", section: "About your child", key: "b_szkola", label: "School", type: "single", required: true, other: true,
          title: "Which school / nursery does your child attend?", options: withInne(SZKOLY) },
        { branch: "child", section: "Needs", key: "b_intro2", label: "Needs", type: "statement",
          title: "Tell us about your child's needs.",
          text: "<p>These answers will help us choose the right format, areas and Tutors.</p>" },
        { branch: "child", section: "Needs", key: "b_formula", label: "Format", type: "multi", required: true,
          title: "What class format are you looking for, for your child?",
          help: "If your child has specific preferences, choose one option below. If both work, tick both.", options: FORMULA },
        { branch: "child", section: "Needs", key: "b_obszary", label: "Areas", type: "multi", required: true,
          title: "Below is a list of the artistic and emotional areas we teach in. Point to the ones close to your child.",  
          help: "You can select several.", options: OBSZARY_B },
        { branch: "child", section: "Needs", key: "b_instrumenty", label: "Instruments", type: "multi", required: true, other: true,
          title: "Below is a list of musical instruments. Select the ones that might interest your child.",
          help: "You can select several.",
          options: withInne(INSTRUMENTY), showWhen: { key: "b_obszary", includes: "muz_instrument" } },
        { branch: "child", section: "Needs", key: "b_eduemo", label: "Emotional education", type: "multi", required: false,
          title: "At TNM we also run classes in emotional education. If you feel they might be helpful for your child - choose specific directions from the list below.",  
          help: "You can select several directions.", options: EDU_EMO_B },
        


        { branch: "child", section: "Needs", key: "b_zapis_zajecia", label: "Classes to join", type: "long", required: false,
          title: "Are there classes you would like to sign your child up for?",
          help: "If you know which classes you want to sign up for, list them below.", placeholder: "Your choice:" },
        { branch: "child", section: "Needs", key: "b_doswiadczenie", label: "Experience", type: "long", required: false,
          title: "Does your child have experience with the classes you selected?", placeholder: "E.g. half a year of playing the piano..." },
        { branch: "child", section: "Needs", key: "b_pewnosc", label: "Confidence", type: "scale", required: true,
          title: "Do you feel the class directions you chose earlier respond well to your child's needs?",
          help: "Scale from 1 (I am not sure) to 7 (yes, I am sure). This answer will let us recommend additional areas that develop your child.",
          min: 1, max: 7, low: "Not sure", high: "Very sure" },
        { branch: "child", section: "Needs", key: "b_start", label: "Start date", type: "date", required: true,
          title: "When can your child start classes?", min: "today" },
        { branch: "child", section: "Needs", key: "b_dni", label: "Available days", type: "multi", required: true,
          title: "Which days can your child attend classes?",
          help: "If weekends are possible, tick those days too.", options: DAYS },
        { branch: "child", section: "Needs", key: "b_godziny", label: "Hours", type: "multi", required: true,
          title: "Which times work best for your child's classes?",
          help: "Select the best options for your child.", options: GODZINY_B },
        { branch: "child", section: "Needs", key: "b_uwagi", label: "Notes", type: "long", required: false,
          title: "Is there anything else you would like to share with us before we match the classes?",
          help: "Does your child have any diagnoses, or is there anything else we should know so that we can match classes better?",  
          placeholder: "Your message..." },
        


        { branch: "child", section: "Needs", key: "diagnostyka", label: "Diagnostic meeting", type: "single", required: false,
          title: "Would you like to book a diagnostic meeting?",
          help: "If you have doubts about choosing the right classes, we are here to support you. Choose a tool:",
          options: DIAGNOSTYKA_PELNY },

         
        { key: "zgoda", section: "Consent", label: "Consent", type: "consent", required: true,
          title: "Consent to data processing", consentLabel: CONSENT_TEXT }
      ]
    },

    


    "zajecia-1na1": {
      id: "zajecia-1na1",
      version: "1.1",
      masthead: "Sign-up for 1:1 classes",
       
       
      hidden: [
        { key: "prowadzacy", param: "prowadzacy", label: "Chosen Tutor" },
        { key: "zajecie", param: "zajecie", label: "Class (from the card)" }
      ],
      aside: {
        eyebrow: "One-to-one classes",
        title: "Leave a submission - we will match the 1:1 details.",
        text: "Leave your details and preferences, no strings attached. We will reach out with a recommendation."
      },
      intro: {
        title: "Leave a submission - we will match the 1:1 details.",
        sub: "A few questions and your contact details.<br>We will come back with a Tutor and a time to recommend.",
        button: "Let's go",
        note: "Takes 2 minutes"
      },
      




      ending: {
        title: "Thank you for signing up for classes.",
        paragraphs: [
          "We are glad we will soon meet you at our classes.",
          "These classes are time focused on your needs, growth, progress and the relationship built with a carefully matched Tutor.",
          "Your time for yourself and for growing your passions gives you a chance to feel fulfilled and satisfied. That is how it will be, very soon.",
          "See you soon."
        ]
      },
      steps: [
        { key: "rola", label: "For whom", type: "single", required: true, autoRola: true,
          title: "Who are you looking for classes for?", options: [
            { v: "adult", label: "For myself (adult)" },
            { v: "child", label: "For a child" }
          ] },
        { key: "kontakt", label: "Contact details", type: "fields", required: true,
          title: "Basic contact details", help: "We will come back to these details with a recommendation.", fields: CONTACT1 },
        { key: "uczestnik", label: "Participant details", type: "fields", required: false,
          title: "Participant details", showWhen: { key: "rola", eq: "child" }, fields: [
             
            { name: "imie_uczestnika", label: "Participant's first name", type: "text", required: false, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Participant's surname", type: "text", required: false, placeholder: "Kowalski" },
            { name: "data_uczestnika", label: "Participant's date of birth", type: "date", required: false, max: "today" }
          ] },
        { key: "preferencje", label: "Preferences", type: "text", required: false,
          title: "Preferred days / times?", placeholder: "E.g. Tue/Thu afternoons" },
        { key: "cel", label: "Goal", type: "long", required: false,
          title: "What do you want to develop? What is your goal?", placeholder: "E.g. learning the piano from scratch" },
        { key: "zgoda", label: "Consent", type: "consent", required: true,
          title: "Consent to data processing", consentLabel: CONSENT_TEXT }
      ]
    },

    


    waitlist: {
      id: "waitlist",
      version: "1.1",
      masthead: "Waiting list",
      hidden: [{ key: "zapis_na", param: "zapis", label: "Signing up for" }],
      aside: {
        eyebrow: "Waiting list",
        title: "Sign up for the waiting list.",
        text: "We will let you know when sign-ups open. Leave your details - we will reach out first."
      },
      intro: {
        title: "Sign up for the waiting list.",
        sub: "Leave your contact details,<br>and we will let you know the moment sign-ups open.",
        button: "Signing up",
        note: "Takes a minute"
      },
      ending: {
        title: "You are on the list",
        paragraphs: [
          "Thanks! We have added you to the waiting list.",
          "We will reach out as soon as sign-ups open - you will be first.",
          "Talk soon!"
        ]
      },
      steps: [
        { key: "rola", label: "For whom", type: "single", required: true, autoRola: true,
          title: "Who are you signing up?", options: [
            { v: "adult", label: "For myself" },
            { v: "child", label: "For a child" }
          ] },
        { key: "liczba_dzieci", label: "Number of children", type: "number", required: false, min: 1, max: 10, default: 1,
          title: "For how many children?", showWhen: { key: "rola", eq: "child" } },
        { key: "kontakt", label: "Contact details", type: "fields", required: true,
          title: "Basic contact details", fields: CONTACT1 },
        { key: "uczestnik", label: "Participant", type: "fields", required: false,
          title: "Participant details (or who this is for)", fields: [
            { name: "imie_uczestnika", label: "First name", type: "text", required: false, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Last name", type: "text", required: false, placeholder: "Kowalski" }
          ] },
        { key: "zgoda", label: "Consent", type: "consent", required: true,
          title: "Consent to data processing", consentLabel: CONSENT_TEXT }
      ]
    },

    












    newsletter: {
      id: "newsletter",
      version: "1.1",
      masthead: "ARTletter",
      aside: {
        eyebrow: "Newsletter",
        title: "Sign up for the ARTletter.",
        text: "Art, music and our news straight to your inbox. No spam - only what is worth your attention."
      },
      intro: {
        title: "Sign up for the ARTletter.",
        sub: "Leave your email,<br>and we will keep you posted on classes, events and news.",
        button: "Signing up",
        note: "Takes a moment"
      },
      ending: {
        title: "Almost there",
        paragraphs: [
          "Thanks! We have sent you an email with a confirmation link.",
          "Click the link in the message to finish signing up for the ARTletter.",
          "Talk soon!"
        ]
      },
      steps: [
        { key: "kontakt", label: "Details", type: "fields", required: true,
          title: "Leave us your email", fields: [
            { name: "email", label: "E-mail", type: "email", required: true, placeholder: "example@example.com" },
            { name: "imie", label: "First name", type: "text", required: false, placeholder: "Joanna" }
          ] },
        { key: "zgoda", label: "Consent", type: "consent", required: true, consentKind: "mkt",
          title: "Marketing consent", consentLabel: CONSENT_MKT }
      ]
    },

    




    


    "waitlist-male-grupy": {
      id: "waitlist-male-grupy",
      version: "1.3",
      masthead: "Small group - waiting list",
      thxAlt: "Small group classes at The Noise Makers",
      hidden: [
        { key: "typ_zajec", param: "typ", label: "Type of classes", default: "male-grupy" },
        { key: "zajecie", param: "zajecie", label: "Class" },
         
        { key: "audience", param: "audience", label: "Audiencja" }
      ],
      aside: {
        eyebrow: "Small groups · waiting list",
        title: "Sign up for the waiting list.",
        text: "You will be the first to know when sign-ups open."
      },
      intro: {
        title: "Sign up for the waiting list.",
        sub: "Small group classes are starting soon.<br>Leave your contact details and we will be in touch the moment sign-ups open.",
        button: "Signing up",
        note: "Takes a minute"
      },
      ending: {
        title: "Thank you for signing up for a small group.",
        paragraphsByRola: GRUPA_ENDING
      },
      steps: waitlistSteps("male-grupy")
    },
    "waitlist-zespolowe": {
      id: "waitlist-zespolowe",
      version: "1.3",
      masthead: "Groups - waiting list",
      thxAlt: "Group work at The Noise Makers",
      hidden: [
        { key: "typ_zajec", param: "typ", label: "Type of classes", default: "zespolowe" },
        { key: "zajecie", param: "zajecie", label: "Class" },
         
        { key: "audience", param: "audience", label: "Audiencja" }
      ],
      aside: {
        eyebrow: "Groups · waiting list",
        title: "Sign up for the waiting list.",
        text: "You will be the first to know when enrolment opens."
      },
      intro: {
        title: "Sign up for the waiting list.",
        sub: "Sign-ups for the ensembles are starting soon.<br>Leave your contact details and we will be in touch the moment sign-ups open.",
        button: "Signing up",
        note: "Takes a minute"
      },
      ending: {
        title: "Thank you for signing up for ensemble classes.",
        paragraphsByRola: GRUPA_ENDING
      },
      steps: waitlistSteps("zespolowe")
    },

    








    polkolonie: {
      id: "polkolonie",
      version: "1.0",
      checkout: true,
      masthead: "Day camp sign-ups",
      hidden: [{ key: "turnus_hint", param: "turnusHint", label: "Session (from the card)", transient: true }],
      aside: {
        eyebrow: "Day camp · Royal Wilanów",
        title: "Sign your child up for a holiday full of art.",
        text: "Monday - Friday, 9:00-16:00. Materials and the care of the TNM team are included in the class price."
      },
      intro: {
        image: "../assets/img/figma/polkolonie/polkolonie-card-wakacje.webp",
        title: "Sign your child up for a day camp.",
        sub: "Choose a session, give your children's details<br>and continue to payment. The place is reserved as soon as payment goes through.",
        button: "Signing up my child",
        note: "Takes 3 minutes"
      },
      


      ending: {
        title: "We have your submission.",
        paragraphs: [
          "Thank you. We will reply by email with confirmation and session sign-up details.",
          "If you want to ask right away, write to jestem@thenoisemakers.pl.",
          "See you soon."
        ]
      },
      steps: [
        { key: "turnus", label: "Session", type: "single", required: true,
          title: "Choose a session", help: "Monday - Friday, 9:00-16:00, Royal Wilanów. Price per session, per child.",
          options: POLKOLONIE_OPTS },
        { key: "liczba_dzieci", label: "Number of children", type: "number", required: false, min: 1, max: 6, default: 1,
          title: "How many children are you signing up?", help: "You will give each child's details in the next step." },
        { key: "kontakt", label: "Payer's details", type: "fields", required: true,
          title: "Payer's details (parent / guardian)", help: "We will send the sign-up and payment confirmation to this contact.", fields: CONTACT1 },
        { key: "dzieci", label: "Children's details", type: "children", required: true,
          title: "Participants' details", help: "A day camp means all-day care - these details help us look after every child." },
        { key: "zgody", label: "Consents and payment", type: "checkout", required: true,
          title: "Summary and consents", help: "Check your order and accept the consents to continue to payment." }
      ]
    },

    





    voucher: {
      id: "voucher",
      version: "1.0",
      checkout: true,
      masthead: "Diagnostic Voucher",
      hidden: [{ key: "rodzaj", param: "rodzaj", label: "Type of voucher" }],
      aside: {
        eyebrow: "Voucher · gift",
        title: "Care for those close to you. Gift a meeting at The Noise Makers.",
        text: "We will send the voucher code to your email - you pass it on to the recipient, and they arrange the date."
      },
      intro: {
        title: "Gift a Voucher.",
        sub: "Tell us who the gift is for,<br>leave your details and continue to payment. You will get the code by email.",
        button: "Order a voucher",
        note: "Takes 2 minutes"
      },
      ending: {
        title: "We have your submission.",
        paragraphs: ["Thank you. We will reply by email with a confirmation.", "See you soon."]
      },
      steps: [
        







        { key: "dla_kogo", label: "For whom", type: "single", required: true,
          title: "Who is this gift for?", options: [
            { v: "dorosly", label: "For an adult (18 and over)" },
            { v: "dziecko", label: "For a child (under 18)" }
          ] },
         
         
        { key: "obdarowany", label: "Recipient details", type: "fields", required: true,
          title: "Recipient's details",
          



          help: "We will issue the voucher for this person. The code will reach you by email - you are the one handing it over. A gift for a child can be collected by their parent or guardian.",
          fields: [
            { name: "imie_obdarowanego", label: "First name", type: "text", required: true, placeholder: "Anna" },
            { name: "nazwisko_obdarowanego", label: "Last name", type: "text", required: true, placeholder: "Kowalska" },
            

            { name: "email_obdarowanego", label: "Recipient's email (optional)",
              type: "email", required: false, placeholder: "jesli znasz" }
          ] },
        { key: "kontakt", label: "Your details", type: "fields", required: true,
          title: "Buyer's details", help: "We will send the voucher code and purchase confirmation to this address.", fields: CONTACT1 },
        { key: "zgody", label: "Consents and payment", type: "checkout", required: true,
          title: "Summary and consents", help: "Check your order and accept the consents to continue to payment." }
      ]
    },

    













    "dni-probne": {
      id: "dni-probne",
      version: "1.0",
      checkout: true,
      masthead: "Reserve your spot",
      hidden: [
        { key: "sku", param: "sku", label: "Class SKU" },
        { key: "termin", param: "termin", label: "Day (ISO)" },
        { key: "zajecie", param: "zajecie", label: "Class (id)" },
        { key: "dp_nazwa", param: "dpNazwa", label: "Classes" },
        { key: "audience", param: "audience", label: "Audiencja" },
        { key: "dp_cena", param: "dpCena", label: "Price (display)", transient: true },
        

        { key: "poziom", param: "poziom", label: "Level" }
      ],
      aside: {
        eyebrow: "Trial Days · Let's meet",
        title: "Reserve your spot at a trial class.",
        text: "You will get the payment link straight away and by email (valid for 24 hours). The place is reserved once payment goes through."
      },
       
       
      ending: {
        title: "We have your booking.",
        paragraphs: [
          "Thank you. We have sent the payment link by email. Once it is paid, you will get a confirmation and the practical details.",
          "If you want to ask right away, write to jestem@thenoisemakers.pl.",
          "See you soon."
        ]
      },
      steps: [
        




        { key: "kontakt", label: "Contact details", type: "fields", required: true,
          title: "Now we ask you for your contact details.",
          help: "Details of the person signing up (for a child: Parent / Guardian). We will register the booking to these details and send the payment link to this address.",
          fields: CONTACT1 },
        { key: "uczestnik", label: "Child's details", type: "fields", required: true,
          title: "Give us your child's details as well.", help: "With this information we will match the class better to the participant's needs.",
          showWhen: { key: "audience", eq: "Dziecko" }, fields: [
            { name: "imie_uczestnika", label: "First name", type: "text", required: true, placeholder: "Antoni" },
            { name: "nazwisko_uczestnika", label: "Last name", type: "text", required: true, placeholder: "Kowalski" },
            { name: "data_uczestnika", label: "Date of birth", type: "date", required: true, max: "today" }
          ] },
        { key: "zgody", label: "Consents and payment", type: "checkout", required: true,
          title: "Summary and consents", help: "Check your booking and accept the consents to continue to payment." }
      ]
    }
  };

  













  const VOUCHER_WARIANTY = {
    fundamenty:  { sku: "VOUCHER-DIAG", cena: 899, nazwa: "Voucher - “Fundamentals” 1:1 session" },
    zajecia1na1: { sku: "VOUCHER-1NA1", cena: 289, nazwa: "Voucher - one 1:1 class" }
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
    if (s === "dorosli" || s === "dorosly" || s === "adults") return "adult";
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

  

  const THANK_PHOTO = "../assets/img/figma/thx/thx-kobieta-wprost.webp";  
  

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
  



  const THANK_LOGO = "../assets/img/logo/sygnet-red-square-white.png";

  


  

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
        <img class="intake__logo" src="../assets/img/figma/logo-tnm-white.png?v=20260616" alt="The Noise Makers">
        <span class="intake__title" id="intake-title">Application form</span>
        <button class="intake__close" type="button" data-intake-close aria-label="Zamknij okno">${ICO_X}</button>
      </div>
      <div class="intake__body">${BODY_SPLIT}</div>
      <div class="intake__foot"><span class="intake__feel">Feel the he<span class="art">art</span>.</span></div>
      <div class="tnm-hp" aria-hidden="true"><label>Do not fill in this field<input type="text" name="tnm_z1" data-hp tabindex="-1" autocomplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"></label></div>
      <div class="intake-paywait" role="status" aria-live="polite" hidden>
        <div class="intake-paywait__box">
          <span class="intake-paywait__mark" aria-hidden="true"><img src="../assets/img/logo/sygnet-red-square-white.png" alt="" width="96" height="96"></span>
          <p class="intake-paywait__title">Preparing your payment</p>
          <p class="intake-paywait__text">This usually takes under half a minute. Please keep this window open - we will take you to the secure payment page in a moment.</p>
          <p class="intake-paywait__late">Almost there, your payment is still being prepared.</p>
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
      nodes = [{ label: "Start" }, { label: state.schema.steps[0].label }, { label: "The path will choose itself", ghost: true }];
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
        <p class="intake-kid__h">Child ${i + 1}${arr.length > 1 ? " z " + arr.length : ""}</p>
        <div class="intake-fields">
          <label class="intake-field"><span class="intake-field__lab">First name<span class="req">*</span></span>
            <input type="text" maxlength="40" data-child="${i}" data-cf="imie" value="${esc(c.imie || "")}" placeholder="Antoni" autocomplete="off"></label>
          <label class="intake-field"><span class="intake-field__lab">Surname<span class="req">*</span></span>
            <input type="text" maxlength="60" data-child="${i}" data-cf="nazwisko" value="${esc(c.nazwisko || "")}" placeholder="Kowalski" autocomplete="off"></label>
          <label class="intake-field"><span class="intake-field__lab">Date of birth<span class="req">*</span></span>
            <input type="date" data-child="${i}" data-cf="dob" value="${esc(c.dob)}" max="${today()}"></label>
          <label class="intake-field intake-field--solo"><span class="intake-field__lab">Health, allergies, anything important<span class="req">*</span></span>
            <textarea data-child="${i}" data-cf="health" maxlength="600" rows="3" placeholder="e.g. nut allergy, asthma. If none - type &quot;none&quot;.">${esc(c.health)}</textarea></label>
        </div>
        <button type="button" class="intake-consent intake-consent--kid${c.art9 ? " is-on" : ""}" data-art9="${i}" role="checkbox" aria-checked="${c.art9}">
          <span class="intake-consent__box">${c.art9 ? CHECK : ""}</span>
          <span class="intake-consent__txt">I consent to the processing of information about my child's health - only so that we can give them safe care at the day camp. This is a separate consent, required by law.<span class="req">*</span></span>
        </button>
      </div>`).join("") + "</div>";
  }

  

   
   
  

  








  const DP_TERMIN_IND = "Date arranged individually";
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
          <div class="intake-sumbox__row"><span>Class</span><b>${esc(a.dp_nazwa || a.zajecie || "-")}</b></div>
          <div class="intake-sumbox__row"><span>Day</span><b>${esc(/^LEKCJA-PROBNA/i.test(String(a.sku || "")) ? DP_TERMIN_IND : dpDataLabel(a.termin))}</b></div>
          <div class="intake-sumbox__row"><span>Level</span><b>${esc(a.poziom || "-")}</b></div>
          <div class="intake-sumbox__row"><span>Participant</span><b>${esc(ucz || "-")}</b></div>
          <div class="intake-sumbox__row intake-sumbox__row--tot"><span>To pay</span><b>${kwota}</b></div>
          <p class="intake-sumbox__note">The final amount is confirmed on the secure payment page.</p>
        </div>` +
        mcRow("regulamin", "I accept the sales terms and refund policy of The Noise Makers.", true) +
        mcRow("rodo", esc(CONSENT_TEXT), true) +
        legalNote(["regulamin", "prywatnosc"]);
    }
    if (state.schema && state.schema.id === "voucher") {
      const vw = voucherWariant();
      return `<div class="intake-sumbox">
          <div class="intake-sumbox__row"><span>${esc(vw.nazwa)}</span><b>${vw.cena.toLocaleString("pl-PL")} zł</b></div>
          <div class="intake-sumbox__row"><span>For</span><b>${esc(state.answers.obdarowany || "-")}</b></div>
          <div class="intake-sumbox__row intake-sumbox__row--tot"><span>To pay</span><b>${vw.cena.toLocaleString("pl-PL")} zł</b></div>
          <p class="intake-sumbox__note">We will send the voucher code to your email right after payment. Valid for 12 months.</p>
        </div>` +
        mcRow("regulamin", "I accept the sales terms and refund policy of The Noise Makers.", true) +
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
        <div class="intake-sumbox__row"><span>Session</span><b>${esc(t ? t.termin : "-")}</b></div>
        <div class="intake-sumbox__row"><span>Children</span><b>${n}${kids.length ? " · " + esc(kids.map((k) => (k.imie_nazwisko || "?").split(/\s+/)[0]).join(", ")) : ""}</b></div>
        <div class="intake-sumbox__row intake-sumbox__row--tot"><span>Total to pay</span><b>${zl(total)}</b></div>
        <p class="intake-sumbox__note">The final amount to pay is confirmed by the secure payment page.</p>
      </div>` +
      mc("regulamin", "I accept the sales terms and refund policy of The Noise Makers.", true) +
      mc("rodo", esc(CONSENT_TEXT), true) +
      mc("wizerunek", "I agree to the making of marketing materials that include the image of the people entered here. These materials serve above all educational purposes for our Students. (Optional consent)", false)   +
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
    const nextTxt = isLast ? (state.schema.checkout ? "Continue to payment" : "Send your submission") : "Next";
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
        

        <p class="intake-pending" id="intake-pending" role="status" hidden>We are processing your submission - please wait a few seconds for confirmation.</p>
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
        <img class="intake-splash__img" src="${intro.image || "../assets/img/figma/form-intro-jestesmy.webp?v=20260706"}" alt="">
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
      return { msg: "Fill in the field next to Other.", el: document.querySelector(`[data-other="${step.key}"]`) };
    }
    return null;
  }
  function validateStep(step) {
    const stage = document.getElementById("intake-stage");
    if (step.type === "statement") return null;
    if (step.type === "number") return null;  
    if (step.type === "single") {
      if (step.required && !state.answers[step.key]) return { msg: "Select one option to continue." };
      return otherErr(step);
    }
    if (step.type === "multi") {
      const a = state.answers[step.key];
      if (step.required && (!Array.isArray(a) || !a.length)) return { msg: "Select at least one option." };
      return otherErr(step);
    }
    if (step.type === "scale") {
      if (step.required && state.answers[step.key] == null) return { msg: "Choose a value on the scale." };
      return null;
    }
    if (step.type === "consent") {
      if (state.answers[step.key] !== true) return { msg: "To send your submission, please tick the consent." };
      return null;
    }
    const NG = window.TNMGuards;    
    if (step.type === "children") {
      const arr = childrenArr(step);
      for (let i = 0; i < arr.length; i++) {
        const c = arr[i], who = "dziecka " + (i + 1);
        const inp = (cf) => stage.querySelector(`[data-child="${i}"][data-cf="${cf}"]`);
        if ((c.imie || "").trim().length < 2) return { msg: `Enter the first name of ${who}.`, el: inp("imie") };
        if ((c.nazwisko || "").trim().length < 2) return { msg: `Enter the surname of ${who}.`, el: inp("nazwisko") };
        


        if (NG && NG.hasDigit(c.imie)) return { msg: `The first name of ${who} cannot contain digits.`, el: inp("imie") };
        if (NG && NG.hasDigit(c.nazwisko)) return { msg: `The surname of ${who} cannot contain digits.`, el: inp("nazwisko") };
        if (!c.dob) return { msg: `Enter the date of birth of ${who}.`, el: inp("dob") };
        if (!(c.health || "").trim()) return { msg: `Fill in the health information for ${who} (if there is none, write "brak").`, el: inp("health") };
        if (c.art9 !== true) return { msg: `Tick the consent to processing the health information of ${who} - without it we cannot accept a child for the day camp.` };
      }
      return null;
    }
    if (step.type === "checkout") {
      if (state.answers.zgoda_regulamin !== true) return { msg: "Accept the terms to continue to payment." };
      if (state.answers.zgoda_rodo !== true) return { msg: "We need your consent to data processing to complete the sign-up." };
      return null;
    }
    if (step.type === "fields") {
      for (const f of step.fields) {
        const v = (state.answers[f.name] || "").trim();
        const inp = stage.querySelector(`[data-name="${f.name}"]`);
        if (f.required && !v) return { msg: `Fill in the „${f.label}" field.`, el: inp };
         
        if (v && NG && NG.isPersonNameField(inp) && NG.hasDigit(v)) return { msg: `The „${f.label}" field cannot contain digits.`, el: inp };
        if (v && f.type === "email" && !RE_EMAIL.test(v)) return { msg: "Enter a valid email address.", el: inp };
        if (v && f.type === "phone") {
          const cc = state.answers[f.name + "_cc"] || "+48";
          const ph = window.TNMGuards ? window.TNMGuards.normalizePhone(v, cc) : { ok: digits(v).length >= 9 };
           
          if (!ph.ok) return { msg: (window.TNMGuards && window.TNMGuards.phoneMsg) ? window.TNMGuards.phoneMsg(cc, v)
            : (cc === "+48" ? "Phone number: enter exactly 9 digits." : "Enter a valid phone number."), el: inp };
        }
      }
      return null;
    }
     
    const v = (state.answers[step.key] || "").trim();
    const inp = stage.querySelector("[data-key]");
    if (step.required && !v) return { msg: step.type === "date" ? "Choose a date to continue." : "Fill in this field to continue.", el: inp };
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
      locale: "en",
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
        if (ot) answers_labeled[step.title + " - Other"] = ot;
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
      answers_labeled["For whom"] = state.answers.rola === "child" ? "For a child" : "For myself (adult)";
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
            showErr("This day is no longer available. Go back to the catalogue and choose a date from the list.");
            navBusy(false); return;
          }
          if (!r0.ok || !j0 || !j0.quote || !j0.quote.hash) throw new Error("no quote");
          q = j0.quote;
        } catch (e1) {
          showErr("We could not count the bookings. Try again or write to jestem@thenoisemakers.pl.");
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
           
          showErr("There are no places left for this class. Choose another level or write to jestem@thenoisemakers.pl.");
          navBusy(false);
          return;
        }
        if (state.schema.id === "dni-probne" && r.status === 409 && j && j.error === "quote_stale") {
          showErr("The quote has changed. Click “Continue to payment” once more to refresh it.");
          navBusy(false);
          return;
        }
        if (r.status === 409 && j && j.error === "sold_out") {
           
          const av = j.available != null ? j.available : 0;
          showErr(av > 0
            ? "Only " + av + (av === 1 ? " miejsce" : " miejsca") + ", and you are signing up " + (j.requested || "more") + " children. Reduce the number of children or choose another session."
            : "This session has just filled up. Choose another date - we have updated availability.");
          fetchAvailability();
          navBusy(false);
          return;
        }
        if (r.status === 400 && j && j.error === "consents_required") {
          showErr("Tick the required consents to continue to payment.");
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
        showErr("We could not start the payment. Try again or write to jestem@thenoisemakers.pl.");
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
        console.log("[intake " + state.schema.id + "] payload (DEMO - no webhook):", payload);
        await new Promise((res) => setTimeout(res, 250));
      }
      renderEnding();
    } catch (e) {
      showErr("Something went wrong while sending. Write to jestem@thenoisemakers.pl.");
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
