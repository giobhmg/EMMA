const storageKey = "emma-romantic-site-unlocked";

const gate = document.getElementById("gate");
const content = document.getElementById("content");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordMessage = document.getElementById("password-message");
const siteTitle = document.getElementById("site-title");
const siteSubtitle = document.getElementById("site-subtitle");
const heroQuote = document.getElementById("hero-quote");
const galleryImage = document.getElementById("gallery-image");
const galleryIndex = document.getElementById("gallery-index");
const galleryCaption = document.getElementById("gallery-caption");
const galleryDescription = document.getElementById("gallery-description");
const galleryDots = document.getElementById("gallery-dots");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const letterBody = document.getElementById("letter-body");

const config = window.APP_CONFIG;
let currentSlide = 0;

function renderHero() {
  document.title = config.siteTitle;
  siteTitle.textContent = config.siteTitle;
  siteSubtitle.textContent = config.heroSubtitle;
  heroQuote.textContent = config.heroQuote;
}

function renderLetter() {
  letterBody.innerHTML = "";

  config.letter.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    letterBody.appendChild(element);
  });
}

function setActiveDot(index) {
  const dots = galleryDots.querySelectorAll(".gallery__dot");

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function renderGallery(index) {
  const item = config.gallery[index];

  galleryImage.classList.add("is-changing");

  window.setTimeout(() => {
    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
      config.gallery.length
    ).padStart(2, "0")}`;
    galleryCaption.textContent = item.title;
    galleryDescription.textContent = item.description;
    galleryImage.classList.remove("is-changing");
    setActiveDot(index);
  }, 140);
}

function buildGalleryDots() {
  galleryDots.innerHTML = "";

  config.gallery.forEach((item, index) => {
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

function unlockSite() {
  gate.classList.add("hidden");
  content.classList.remove("hidden");
  sessionStorage.setItem(storageKey, "true");
}

function lockSite() {
  content.classList.add("hidden");
  gate.classList.remove("hidden");
  sessionStorage.removeItem(storageKey);
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

function setupGalleryControls() {
  prevButton.addEventListener("click", () => {
    currentSlide =
      (currentSlide - 1 + config.gallery.length) % config.gallery.length;
    renderGallery(currentSlide);
  });

  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % config.gallery.length;
    renderGallery(currentSlide);
  });
}

function init() {
  if (!config || !Array.isArray(config.gallery) || !Array.isArray(config.letter)) {
    passwordMessage.textContent =
      "Configurazione non valida. Controlla il file site-data.js.";
    passwordInput.disabled = true;
    return;
  }

  renderHero();
  renderLetter();
  buildGalleryDots();
  renderGallery(currentSlide);
  setupGalleryControls();
  passwordForm.addEventListener("submit", handlePasswordSubmit);

  if (sessionStorage.getItem(storageKey) === "true") {
    unlockSite();
  } else {
    lockSite();
  }
}

init();
