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
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryDescription = document.getElementById("gallery-description");
  const galleryDots = document.getElementById("gallery-dots");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  const galleryItems = Array.isArray(config.gallery) ? [...config.gallery] : [];
  let currentSlide = 0;

  function setActiveDot(index) {
    galleryDots.querySelectorAll(".gallery__dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function renderGallery(index) {
    const item = galleryItems[index];

    if (!item) {
      return;
    }

    galleryImage.classList.add("is-changing");

    window.setTimeout(() => {
      galleryImage.src = item.src;
      galleryImage.alt = item.alt;
      galleryIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
        galleryItems.length
      ).padStart(2, "0")}`;
      galleryCaption.textContent = item.title;
      galleryDescription.textContent = item.description;
      galleryImage.classList.remove("is-changing");
      setActiveDot(index);
    }, 120);
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
    currentSlide = (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    renderGallery(currentSlide);
  });

  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % galleryItems.length;
    renderGallery(currentSlide);
  });
}

function init() {
  if (!config.password || !Array.isArray(config.letter) || !Array.isArray(config.gallery)) {
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
