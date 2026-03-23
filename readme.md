# Sito romantico personale

Questo progetto e un sito statico pensato per essere eseguito in locale, senza database e senza backend.

## Struttura

- `index.html`: struttura della pagina
- `styles.css`: stile romantico, elegante e responsive
- `script.js`: password lato frontend, gallery e rendering della lettera
- `site-data.js`: contenuti locali da personalizzare
- `assets/photos/`: immagini della gallery

## Come usarlo

1. Apri `site-data.js` e modifica:
   - `password`
   - `siteTitle`
   - `heroSubtitle`
   - `heroQuote`
   - `gallery`
   - `letter`
2. Sostituisci i file in `assets/photos/` con le tue foto e aggiorna i percorsi in `site-data.js`.
3. Avvia un server statico locale oppure apri `index.html` nel browser.

## Esempio rapido con server locale

Se hai Python installato:

```bash
python3 -m http.server 8000
```

Poi apri `http://localhost:8000`.

## Nota sulla password

La protezione e volutamente semplice e tutta lato frontend, adatta a un sito personale condiviso in privato. Non e una soluzione di sicurezza forte, perche la password resta leggibile nei file locali del progetto.
