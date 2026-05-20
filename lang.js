// ============================================================
//  lang.js — Global Language Toggle System
//  Har page mein sirf ek line se kaam karta hai:
//  <script src="lang.js"></script>
//
//  Kisi bhi element mein yeh do attributes lagao:
//    data-en="English text"
//    data-ru="Roman Urdu text"
//  Bas! Automatic toggle hoga.
// ============================================================

(function () {

  // ── 1. TOGGLE BUTTON CSS inject karo ──────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #langToggleBtn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      background: rgba(10,10,15,0.92);
      border: 1px solid rgba(0,229,160,0.35);
      border-radius: 100px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-family: 'Space Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #00e5a0;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
      backdrop-filter: blur(12px);
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      user-select: none;
    }
    #langToggleBtn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(0,229,160,0.2);
      border-color: rgba(0,229,160,0.6);
    }
    #langToggleBtn:active { transform: scale(0.96); }
    #langToggleBtn .lang-icon { font-size: 18px; }
    #langToggleBtn .lang-label { letter-spacing: 0.5px; }
    #langToggleBtn .lang-arrow {
      font-size: 16px;
      transition: transform 0.3s;
      display: inline-block;
    }

    /* Text change hone par flash effect */
    .lang-flash {
      animation: langFlash 0.35s ease both;
    }
    @keyframes langFlash {
      0%   { opacity: 1; }
      30%  { opacity: 0.2; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // ── 2. CURRENT LANGUAGE localStorage se lo ────────────────
  //    Default: 'ru' (Roman Urdu) — aap chahein to 'en' kar sakte ho
  let currentLang = localStorage.getItem('siteLang') || 'ru';

  // ── 3. TOGGLE BUTTON banao ────────────────────────────────
  function createButton() {
    const btn = document.createElement('button');
    btn.id = 'langToggleBtn';
    btn.title = 'Language Toggle / Zaban Badlo';
    btn.innerHTML = `
      <span class="lang-icon">🌐</span>
      <span class="lang-label" id="langBtnLabel">${currentLang === 'en' ? 'Roman Urdu' : 'English'}</span>
      <span class="lang-arrow">⇄</span>
    `;
    btn.addEventListener('click', toggleLanguage);
    document.body.appendChild(btn);
  }

  // ── 4. APPLY LANGUAGE — saare data-en / data-ru elements update ──
  function applyLanguage(lang) {
    // Saare elements dhundo jinke paas data-en aur data-ru dono hain
    const elements = document.querySelectorAll('[data-en][data-ru]');

    elements.forEach(el => {
      const newText = lang === 'en' ? el.dataset.en : el.dataset.ru;

      // Flash animation
      el.classList.remove('lang-flash');
      void el.offsetWidth; // reflow trick — animation restart ke liye
      el.classList.add('lang-flash');

      // innerHTML ya textContent? Check karo
      // Agar element mein sirf text hai to textContent, warna innerHTML
      if (el.dataset.html === 'true') {
        el.innerHTML = newText;
      } else {
        el.textContent = newText;
      }
    });

    // Button label update karo (opposite language dikhao)
    const label = document.getElementById('langBtnLabel');
    if (label) {
      label.textContent = lang === 'en' ? 'Roman Urdu' : 'English';
    }
  }

  // ── 5. TOGGLE FUNCTION ────────────────────────────────────
  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    localStorage.setItem('siteLang', currentLang); // Save karo
    applyLanguage(currentLang);

    // Arrow spin animation
    const arrow = document.querySelector('#langToggleBtn .lang-arrow');
    if (arrow) {
      arrow.style.transform = 'rotate(180deg)';
      setTimeout(() => arrow.style.transform = 'rotate(0deg)', 300);
    }
  }

  // ── 6. PAGE LOAD par run karo ─────────────────────────────
  function init() {
    createButton();
    applyLanguage(currentLang);
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ============================================================
//  FUTURE PAGE MEIN KAISE USE KAREIN?
//  ─────────────────────────────────
//  STEP 1: </body> se pehle yeh line paste karo:
//    <script src="lang.js"></script>
//
//  STEP 2: Jis bhi element ka text change karna ho, yeh likho:
//    <h2 data-en="My Projects" data-ru="Mere Projects">Mere Projects</h2>
//    <a href="#" data-en="Contact Me" data-ru="Mujhse Milo">Mujhse Milo</a>
//    <p data-en="Hello world" data-ru="Salam duniya">Salam duniya</p>
//
//  STEP 3: Agar element mein HTML tags bhi hain (jaise <br> <strong>):
//    data-html="true" bhi add karo:
//    <h1 data-html="true"
//        data-en="My<br>Portfolio"
//        data-ru="Mera<br>Portfolio">
//      Mera<br>Portfolio
//    </h1>
//
//  BAS! Toggle button automatically neeche-right corner mein aayega.
// ============================================================
