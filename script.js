const storageKey = "emma-romantic-site-unlocked";

const gate = document.getElementById("gate");
const content = document.getElementById("content");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordMessage = document.getElementById("password-message");
const siteSubtitle = document.getElementById("site-subtitle");
const galleryImage = document.getElementById("gallery-image");
const galleryIndex = document.getElementById("gallery-index");
const galleryCaption = document.getElementById("gallery-caption");
const galleryDescription = document.getElementById("gallery-description");
const galleryDots = document.getElementById("gallery-dots");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const letterBody = document.getElementById("letter-body");
const photoUpload = document.getElementById("photo-upload");
const uploadMessage = document.getElementById("upload-message");
const showGalleryButton = document.getElementById("show-gallery-button");
const gallerySection = document.getElementById("gallery-section");
const editLetterButton = document.getElementById("edit-letter-button");
const letterEditorPanel = document.getElementById("letter-editor-panel");
const letterEditor = document.getElementById("letter-editor");
const saveLetterButton = document.getElementById("save-letter-button");
const resetLetterButton = document.getElementById("reset-letter-button");
const letterEditorMessage = document.getElementById("letter-editor-message");

const config = window.APP_CONFIG;
const galleryItems = Array.isArray(config.gallery) ? [...config.gallery] : [];
const letterStorageKey = "emma-romantic-site-letter";
let currentSlide = 0;

function getSavedLetter() {
  const savedLetter = localStorage.getItem(letterStorageKey);

  if (!savedLetter) {
    return config.letter;
  }

  return savedLetter
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderIntro() {
  document.title = config.siteTitle;
  siteSubtitle.textContent = config.heroSubtitle;
}

function renderLetter(letterParagraphs = getSavedLetter()) {
  letterBody.innerHTML = "";

  letterParagraphs.forEach((paragraph) => {
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
  const item = galleryItems[index];

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
  }, 140);
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
      (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    renderGallery(currentSlide);
  });

  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % galleryItems.length;
    renderGallery(currentSlide);
  });
}

function updateUploadMessage(message) {
  uploadMessage.textContent = message;
}

function updateLetterEditorMessage(message) {
  letterEditorMessage.textContent = message;
}

function toggleLetterEditor() {
  letterEditorPanel.classList.toggle("hidden");
  updateLetterEditorMessage("");

  if (!letterEditorPanel.classList.contains("hidden")) {
    letterEditor.value = getSavedLetter().join("\n");
  }
}

function saveLetterEdits() {
  const paragraphs = letterEditor.value
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    updateLetterEditorMessage("Scrivi almeno un paragrafo prima di salvare.");
    return;
  }

  localStorage.setItem(letterStorageKey, paragraphs.join("\n"));
  renderLetter(paragraphs);
  updateLetterEditorMessage("Lettera aggiornata in questo browser.");
}

function resetLetterEdits() {
  localStorage.removeItem(letterStorageKey);
  letterEditor.value = config.letter.join("\n");
  renderLetter(config.letter);
  updateLetterEditorMessage("Testo originale ripristinato.");
}

function handlePhotoUpload(event) {
  const files = Array.from(event.target.files || []).filter((file) =>
    file.type.startsWith("image/")
  );

  if (!files.length) {
    updateUploadMessage("Nessuna immagine valida selezionata.");
    return;
  }

  const startIndex = galleryItems.length;

  files.forEach((file, fileIndex) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      galleryItems.push({
        src: reader.result,
        alt: file.name,
        title: `Ricordo ${startIndex + fileIndex + 1}`,
        description: `Foto caricata dal tuo dispositivo: ${file.name}`,
      });

      buildGalleryDots();

      if (galleryItems.length === startIndex + 1) {
        currentSlide = startIndex;
        renderGallery(currentSlide);
      }

      updateUploadMessage(
        `${files.length} foto aggiunte in questa sessione del browser.`
      );
    });

    reader.readAsDataURL(file);
  });

  photoUpload.value = "";
}

function init() {
  if (!config || !Array.isArray(config.gallery) || !Array.isArray(config.letter)) {
    passwordMessage.textContent =
      "Configurazione non valida. Controlla il file site-data.js.";
    passwordInput.disabled = true;
    return;
  }

  renderIntro();
  renderLetter();
  buildGalleryDots();
  renderGallery(currentSlide);
  setupGalleryControls();
  photoUpload.addEventListener("change", handlePhotoUpload);
  passwordForm.addEventListener("submit", handlePasswordSubmit);
  showGalleryButton.addEventListener("click", () => {
    gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  editLetterButton.addEventListener("click", toggleLetterEditor);
  saveLetterButton.addEventListener("click", saveLetterEdits);
  resetLetterButton.addEventListener("click", resetLetterEdits);

  if (sessionStorage.getItem(storageKey) === "true") {
    unlockSite();
  } else {
    lockSite();
  }
}

init();
