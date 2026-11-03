# Keyhaven Realty

Mockup of a premium real estate site: a main page (`index.html`) and a page for each listing (`home.html?id=...`). All names, prices, rates and contact details are sample content.

## Run locally

```bash
python -m http.server 5188
```

Then open http://localhost:5188.

## Deploy on Vercel

Static site with no build step. Import this repo in Vercel, leave the Framework Preset on **Other**, and leave the build command and output directory empty.

Listings live in `homes.js`. Photos load from Unsplash and the footer film is in `assets/` (credit in `assets/credits.json`).
