# Daycem Bhar — Portfolio

A premium, fully responsive software engineering portfolio built with vanilla HTML/CSS/JS — no build step, no dependencies, ready to deploy as-is.

## What's inside

```
index.html              All page content
css/
  tokens.css             Design tokens — colors, type scale, spacing, shadows
  base.css                Reset, typography, layout utilities, buttons, cards
  nav.css                  Preloader + navigation (desktop & mobile drawer)
  hero.css                  Hero section + portrait treatment
  about.css                  About, stats strip, certifications
  skills.css                  Skills grid with animated proficiency bars
  experience.css                Timeline
  projects.css                   Project cards, carousels, QA stats card
  cv.css                           CV download block + toast
  contact.css                       Contact section, footer, lightbox
  responsive.css                     Cross-cutting responsive overrides
js/
  main.js                 All interactivity: preloader, nav, reveal animations,
                           counters, carousels, lightbox, project filter,
                           CV download tracking
assets/
  cv/Daycem_Bhar_CV.pdf   Your resume — swap this file to update the download
  images/profile/         Hero portrait
  images/internmatch/     InternMatch project screenshots (13 images)
  images/smartterre/      Smart Terre project screenshots (8 images)
```

## Deploying to GitHub Pages (replacing your current site)

1. Replace the contents of your `Daycembhar.com` repo with everything in this folder (keep the folder structure — `index.html` at the root, `css/`, `js/`, `assets/` as siblings).
2. Commit and push to the branch GitHub Pages serves from (usually `main` or `gh-pages`).
3. Your site will be live at the same URL: `https://daycembhar2.github.io/Daycembhar.com/`

No build step required — it's static HTML/CSS/JS.

## Updating content later

- **CV file**: replace `assets/cv/Daycem_Bhar_CV.pdf` with a new PDF of the same filename, or update the `href`/`download` attributes in `index.html` (search for `Daycem_Bhar_CV.pdf`, two occurrences) if you rename it.
- **Adding FindTounsi screenshots**: once you have them, swap the placeholder block in `index.html` (search for `PROJECT 04 / 04`) for a full carousel card like InternMatch/Smart Terre — copy the `.proj-card` markup pattern and point the `<img>` tags at new files in `assets/images/findtounsi/`.
- **Skill bar percentages**: in `index.html`, search for `--pct:` — each skill row has an inline `style="--pct:NN%"` you can adjust.
- **Colors**: every color in the site is a CSS variable defined in `css/tokens.css` — change `--c-sand`, `--c-ink`, `--c-paper`, etc. once and it updates everywhere.

## CV download tracking

Downloads are tracked client-side in `localStorage` (key `db_portfolio_cv_downloads`), incremented on every click of either CV button, and shown live in the "Get the full picture" section. This is per-browser/per-device — it does **not** sync across visitors or devices, since there's no backend. If you later want a true global download counter across all visitors, that requires a small backend or a service like a serverless counter API; flag it if you want help wiring that up.

## Browser support

Built with standard CSS Grid/Flexbox, IntersectionObserver, and `localStorage` — works in all current evergreen browsers (Chrome, Firefox, Safari, Edge). No IE11 support.
