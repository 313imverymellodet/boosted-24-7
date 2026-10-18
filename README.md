# Boosted 24/7

Detroit Metro 24/7 roadside battery boost. Production site: https://www.boostdetroit247.com

The site is a Vite + React app prerendered to static HTML at build time, so the homepage and service-area pages ship with real content (not an empty `<div id="root">`).

```bash
npm install
npm run dev      # local preview
npm run build    # production build + prerender + HTML checks
npm run preview  # serve dist/
```

Service-area pages live at `/service-areas/{warren,southfield,sterling-heights,livonia,westland}/`.
