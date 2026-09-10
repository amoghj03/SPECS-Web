# SPECS — Architecture & structural design portfolio

A complete responsive Vite + React JSX website based on the supplied hand-drawn website flow.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`; preview it with `npm run preview`.

## Included

- Home: fixed, non-scrolling full-screen image carousel with transparent navigation overlaid on top. Clickable slide dots and a compact pause/play control sit in a translucent pill near the bottom edge, with no arrow buttons. Keyboard and touch-swipe navigation remain available; clicking an image opens its project. No headline, content sections, or footer on the landing page.
- Slideshow: automatically advances every 7 seconds, with a 1.8-second crossfade and slow photographic zoom/pan. Includes pause/play. Manual selection pauses autoplay; hover/focus on controls and hidden tabs pause motion. Reduced-motion settings disable autoplay and animation.
- Projects: category filters, search, grid/list toggle, and individual shareable project URLs.
- Contact details: edit `studioContact` in `src/data.js` to set email, phone, address, Google Maps URL, and social profile URLs. Empty fields display coming-soon text; social and map links become active once their URLs are supplied.
- Expertise: a four-figure practice-statistics band, four service offerings with direct, prefilled project-enquiry links, studio news, and a collaborators section.
- Contextual navigation directly beneath the header: Expertise section anchors, People section anchors, and Projects category filters. The row scrolls horizontally on narrow screens.
- Project detail: photography, drawings, sketches, full project facts, accessible image viewer, and next-project navigation.
- People: sample team, practice philosophy, and collaboration approach.
- Contact: validated enquiry form, editable message preview, clipboard copy, and email-app handoff.
- Three journal articles and a useful 404 page.
- Responsive navigation, keyboard focus, image-viewer focus management, reduced-motion support, locally hosted fonts and photos.

## Replace sample content before publication

The user approved the SPECS name and sample content. All project names, details, statistics, partners, team members, journal entries, and stock photographs are illustrative. The interface labels demonstration material. Edit `src/data.js` for project/team/journal content, and `src/App.jsx` for practice statistics, collaborator wordmarks, and contact details.

The email `hello@specs.example` deliberately uses a reserved example domain. Replace it with the real address in `src/App.jsx`. The form prepares a message but does not send, store, or falsely report delivery. For direct submissions, connect the form to your chosen backend or form provider and implement genuine success/error responses.

All plans and sketches are illustrative SVG studies, not drawings of the stock-photographed buildings. Replace the `Drawing` component with actual documentation when available.

## Deployment

Deploy the generated `dist` directory to a static host. BrowserRouter needs all non-asset routes rewritten to `/index.html`; `public/_redirects` provides this for hosts supporting Netlify-style redirects. For other hosts, configure the equivalent SPA fallback.

## Verification

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

See `tests/site.spec.js` for browser checks covering navigation, project search and filtering, galleries, mobile menus, contact validation, and overflow.

With the development server running, `node scripts/capture.mjs` saves desktop and mobile screenshots and waits for every image to load. `DESIGN.md` records the implemented design system.

## Photography

Sample photographs downloaded from Unsplash, served locally from `public/images`. Original image identifiers are documented in `public/images/CREDITS.md`. Font: Manrope, distributed via `@fontsource/manrope`. Interface icons: Lucide.
