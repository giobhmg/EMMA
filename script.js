const accessStorageKey = "emma-romantic-site-unlocked";

const config = window.APP_CONFIG || {};
const page = document.body.dataset.page;

const gate = document.getElementById("gate");
const content = document.getElementById("content");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordMessage = document.getElementById("password-message");

function isUnlocked() {
  return sessionStorage.getItem(accessStorageKey) === "true";
}

function unlockSite() {
  sessionStorage.setItem(accessStorageKey, "true");
  gate.classList.add("hidden");
  content.classList.remove("hidden");
}

function lockSite() {
  sessionStorage.removeItem(accessStorageKey);
  content.classList.add("hidden");
  gate.classList.remove("hidden");
}

function handlePasswordSubmit(event) {
  event.preventDefault();
  const submittedPassword = passwordInput.value.trim();

  if (submittedPassword === config.password) {
    passwordMessage.textContent = "Password corretta. Benvenuta.";
    unlockSite();
    passwordForm.reset();
    return;
  }

  passwordMessage.textContent = "Password non corretta. Riprova con calma.";
}

function renderLetterPage() {
  const siteTitle = document.getElementById("site-title");
  const siteSubtitle = document.getElementById("site-subtitle");
  const heroQuote = document.getElementById("hero-quote");
  const letterBody = document.getElementById("letter-body");

  document.title = config.siteTitle;
  siteTitle.textContent = config.siteTitle;
  siteSubtitle.textContent = config.heroSubtitle;
  heroQuote.textContent = config.heroQuote;
  letterBody.innerHTML = "";

  config.letter.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    letterBody.appendChild(element);
  });
}

function renderGalleryPage() {
  const galleryIntro = document.getElementById("gallery-intro");
  const galleryImage = document.getElementById("gallery-image");
  const galleryIndex = document.getElementById("gallery-index");
  const gallerySpecialLabel = document.getElementById("gallery-special-label");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryDescription = document.getElementById("gallery-description");
  const galleryDots = document.getElementById("gallery-dots");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const surpriseArea = document.getElementById("gallery-surprise");
  const surpriseButton = document.getElementById("surprise-button");

  const galleryItems = Array.isArray(config.gallery) ? [...config.gallery] : [];
  const surpriseItem = config.surprise || null;
  let currentSlide = 0;
  let isShowingSurprise = false;

  function createPlaceholderImage(title) {
    const safeTitle = title
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f9ddd6"/>
            <stop offset="100%" stop-color="#d4a0ab"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="900" rx="42" fill="url(#bg)"/>
        <circle cx="940" cy="170" r="120" fill="rgba(255,255,255,0.22)"/>
        <circle cx="240" cy="720" r="180" fill="rgba(255,255,255,0.14)"/>
        <text x="600" y="430" text-anchor="middle" font-size="72" font-family="Georgia, serif" fill="#5f3342">${safeTitle}</text>
        <text x="600" y="505" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" fill="#6e5058">Copia qui la foto reale dentro assets/photos</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function setActiveDot(index) {
    galleryDots.querySelectorAll(".gallery__dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function updateSurpriseButton() {
    const shouldShow =
      !isShowingSurprise &&
      Boolean(surpriseItem) &&
      currentSlide === galleryItems.length - 1;

    surpriseArea.classList.toggle("hidden", !shouldShow);
  }

  function renderItem(item, options = {}) {
    const { indexText = "", activeDotIndex = null, isSpecial = false } = options;

    if (!item) {
      return;
    }

    galleryImage.classList.add("is-changing");

    window.setTimeout(() => {
      galleryImage.onerror = () => {
        galleryImage.onerror = null;
        galleryImage.src = createPlaceholderImage(item.title);
      };
      galleryImage.src = item.src;
      galleryImage.alt = item.alt;
      galleryIndex.textContent = indexText;
      galleryCaption.textContent = item.title;
      galleryDescription.textContent = item.description;
      gallerySpecialLabel.classList.toggle("hidden", !isSpecial);
      galleryImage.classList.remove("is-changing");

      if (activeDotIndex === null) {
        setActiveDot(-1);
      } else {
        setActiveDot(activeDotIndex);
      }
    }, 120);
  }

  function renderGallery(index) {
    const item = galleryItems[index];

    isShowingSurprise = false;
    renderItem(item, {
      indexText: `${String(index + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`,
      activeDotIndex: index,
      isSpecial: false,
    });
    updateSurpriseButton();
  }

  function renderSurprise() {
    if (!surpriseItem) {
      return;
    }

    isShowingSurprise = true;
    renderItem(surpriseItem, {
      indexText: "Speciale",
      activeDotIndex: null,
      isSpecial: true,
    });
    surpriseArea.classList.add("hidden");
  }

  function buildGalleryDots() {
    galleryDots.innerHTML = "";

    galleryItems.forEach((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery__dot";
      dot.setAttribute("aria-label", `Apri la foto ${index + 1}: ${item.title}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        renderGallery(currentSlide);
      });
      galleryDots.appendChild(dot);
    });
  }

  document.title = `${config.siteTitle} | Foto`;
  galleryIntro.textContent = config.galleryIntro;
  buildGalleryDots();
  renderGallery(currentSlide);

  prevButton.addEventListener("click", () => {
    if (isShowingSurprise) {
      renderGallery(currentSlide);
      return;
    }

    currentSlide = (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    renderGallery(currentSlide);
  });

  nextButton.addEventListener("click", () => {
    if (isShowingSurprise) {
      currentSlide = 0;
      renderGallery(currentSlide);
      return;
    }

    currentSlide = (currentSlide + 1) % galleryItems.length;
    renderGallery(currentSlide);
  });

  if (surpriseButton) {
    surpriseButton.addEventListener("click", renderSurprise);
  }
}

function init() {
  if (
    !config.password ||
    !Array.isArray(config.letter) ||
    !Array.isArray(config.gallery)
  ) {
    passwordMessage.textContent =
      "Configurazione non valida. Controlla il file site-data.js.";
    passwordInput.disabled = true;
    return;
  }

  passwordForm.addEventListener("submit", handlePasswordSubmit);

  if (page === "letter") {
    renderLetterPage();
  }

  if (page === "gallery") {
    renderGalleryPage();
  }

  if (isUnlocked()) {
    unlockSite();
  } else {
    lockSite();
  }
}

init();
