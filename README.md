# Stadioner Web Showcase

Static, bilingual landing website for Stadioner featuring news, project highlights, and a storefront handoff.

## Structure
- `index.html` — landing page with hero, featured news, about preview, and shop CTA.
- `news.html` & individual `news-*.html` pages — news archive and detail views generated from shared translation data.
- `about.html`, `contact.html`, `shop.html`, `project-1.html` — dedicated pages for core sections.
- `assets/css/style.css` — global styles with responsive layout rules.
- `assets/js/translations.js` — language dictionary and shared news content.
- `assets/js/main.js` — language toggle handling, SEO meta updates, and dynamic rendering helpers.
- `assets/images` — lightweight SVG placeholders used across the site.

## Usage
Open `index.html` in a modern browser. Language preference is stored in `localStorage` and shared across pages. News cards and article bodies are rendered from the shared dataset so updating `translations.js` automatically refreshes both the landing preview and the archive.
