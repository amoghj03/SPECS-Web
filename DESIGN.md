---
name: SPECS
description: An architectural exhibition catalogue in forest green and chalk.
colors:
  green: "#194d40"
  ink: "#23473d"
  muted: "#647168"
  line: "#d4dcd4"
  paper: "#f7f8f4"
  soft: "#e9eee5"
  footer: "#e5ebdf"
  action-hover: "#306452"
  focus: "#538033"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(44px, 5.25vw, 80px)"
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(30px, 3.15vw, 48px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  square: "0"
  circle: "50%"
spacing:
  gutter: "clamp(22px, 4.4vw, 76px)"
  compact: "20px"
  gap: "25px"
  section-gap: "60px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "white"
    rounded: "{rounded.square}"
    padding: "17px 23px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "17px 23px"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "42px"
    height: "42px"
  input:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "15px 0"
  filter:
    textColor: "{colors.muted}"
    padding: "12px 0"
  filter-active:
    textColor: "{colors.green}"
  project-card:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
---

# Design System: SPECS

## Overview

**Creative North Star: "Architectural Exhibition Catalogue"**

Forest green lettering, chalk surfaces, generous image apertures and restrained captions frame the architecture. The interface has an orderly, open character: square photographic compositions, fine rules and circular navigation establish its recurring vocabulary.

This records the implemented direction in `index.html`, `src/styles.css` and `src/App.jsx`; there is no approved image comp. The sample identity is established by `PRODUCT.md`. Page composition and the user sketch's information architecture remain surface concerns.

**Key Characteristics:**

- Large architectural photography with compact factual captions.
- Locally served Manrope with tightly spaced display headings.
- Flat chalk and green surfaces divided by fine rules.
- Square content frames and circular icon actions.

## Colors

The palette pairs deep botanical greens with warm, pale mineral surfaces.

### Primary

Green anchors headings, primary actions and full-width practice sections. Ink is the general text color. Action hover deepens button feedback; focus supplies a distinct keyboard outline.

### Neutral

Paper is the default canvas; soft marks selected icon controls, image placeholders and prepared enquiry panels. Footer supplies a slightly stronger tonal band. Muted supports descriptions and metadata. Line separates navigation tools, facts and adjacent content without enclosing everything in boxes.

## Typography

Manrope is served locally in weights 400, 500, 600 and 700. Display and body share the same family; sample collaborator wordmarks are individual identity treatments, including one Georgia example, not a second editorial type system.

The frontmatter records the home display, section headline, generic title, common body and label roles. Interior page headings use a similar fluid display range; prose is usually 13–15px, with compact 9–12px metadata. Body copy uses generous leading, project narratives stay within 600px, and journal reading columns within 710px. Project card titles use 24px; action links use 13px and weight 600. Numeric indices and practice figures use tabular numerals. Responsive heading and input overrides are part of the implementation, not a strict modular type scale.

## Layout

Project archive: eighteen sample projects use an asymmetric twelve-column photographic mosaic. All alternates wide, narrow, tall, and stacked tiles; Residential, Commercial, Cultural, and Institutional each have a distinct arrangement. Searches with one to three results simplify the layout to avoid gaps. Project names remain visible; location and scope reveal on hover or keyboard focus, with restrained image zoom and an arrow response. Touch and small-screen views show metadata immediately. Tiles link directly to project details; the explicit list view stays linear. `src/projects-mosaic.css` owns the mosaic and its reduced-motion fallback. Photography is stored locally and attributed in `public/images/CREDITS.md`.

Contextual navigation: a right-aligned second row sits directly beneath the main header on Expertise, People, and Projects. Main links use 16px type; section links use 14px type, muted green, 44px minimum targets, and a fine active underline inspired by the project filters. Expertise and People anchors highlight the current section while scrolling. Project categories live in this row and retain search parameters when changed. On narrow screens the row scrolls horizontally; the main menu retains its existing mobile toggle.

Carousel control refinement: no previous/next arrow buttons. Slide markers are 5px dots with an 18px active indicator inside 34px click targets; a 14px pause/play icon retains autoplay control. A compact translucent forest-green pill groups the controls, 4px from the bottom while respecting the device safe area.

Expertise metrics: a visible Stats heading introduces four separate square cards with tabular figures. The first is forest green; the others use pale mineral surfaces, fine borders, and a restrained architectural corner detail. Values remain 12+, 80+, 16+, and 4+. Each counter runs once over 1.6 seconds on entering view, with a cubic ease-out; reduced-motion settings show final values immediately. Assistive technology receives a stable final number. Desktop uses four columns; mobile uses two.

Expertise services: four individually photographed service previews form a two-column gallery, stacking on mobile. Each links to `/expertise/:slug`, with an approach, scope, expected outcome, related services, and a service-prefilled enquiry link. Overview copy stays brief while detail pages support deeper reading. `src/expertise.css` owns these route-specific refinements.

Expertise continuation: News & Articles uses a large lead story alongside two smaller image-and-text articles, with category, date, summary, and reading links. On mobile, stories stack in reading order. The contextual navigation uses the same News & Articles label. A saturated forest-green collaborators band follows, with sample partner wordmarks as the content.

Landing motion: a seven-second automatic slide interval, 2.5-second crossfade, and a 7.5-second restrained zoom/pan. Only the active and outgoing photographs animate. Manual selection pauses autoplay; pause/play provides explicit control. Control hover, carousel keyboard focus, and hidden tabs suspend motion. Reduced-motion preference disables automatic advancement and image motion, preserving manual navigation. Autoplay starts after local images have decoded.

Photography refresh: landing has seven curated slides ordered as pavilion, timber residence, waterfront high-rise overview, landscaped home, light-filled interior, geometric white facade, and a tree-framed residence. The approved second photograph remains unchanged. The high-rise slide uses a wide composition showing complete towers, with no extra animated zoom. Other slides retain restrained 4% to 1% zoom with no lateral translation. Per-slide desktop and mobile focal points preserve the architecture. Services, journal stories, and People use dedicated photography instead of the project cover images. Additional gallery photographs reduce repetition within project details. Unreferenced downloads have been removed from public assets; image provenance remains in `public/images/CREDITS.md`.

The landing route follows the user's clarified 2026-09-10 revision: a fixed `100dvh` shell with photography covering the entire viewport. The transparent navbar overlays the top of the carousel, using white text and a dark gradient behind it for readability. Its 112px desktop / 88px mobile height does not reserve image space. No visible heading, captions, content sections, or footer. Carousel controls float at the bottom, with manual arrows, dots, keyboard navigation, and swipe. `src/Landing.jsx` and `src/landing.css` own this layout. The viewport uses the full width even beyond the interior pages' 1800px cap. Original home layout descriptions below are superseded by this revision; interior-page rules still apply.

Use the shared fluid gutter for horizontal alignment across masthead, photographs, content and footer. The site supports a 320px minimum width and caps the body at 1800px when the viewport reaches 1700px. Desktop sections use asymmetric text grids, two-column project photography and three-column people; the home journal has deliberately staggered images.

At 1000px, gaps and secondary copy contract. At 700px, major text sections, archive projects, people and galleries stack; the journal retains a full-width lead story above two smaller stories, and the small practice section label is hidden. At 480px, navigation becomes an expandable panel and form pairs stack. Breakpoints and motion values are recorded in the sidecar. Let category controls wrap. People photographs use automatic height with their specified aspect ratios, keeping captions below the image.

## Elevation & Depth

Landing image revision: the approved timber residence is first; the dusk glass-and-brick residence is second. Slide three uses a landscape-format, full-height view of the Burj Al Arab with sea and sky around a single tower, no additional zoom, and a tower-centered mobile crop. Slides four and six use landscape-format garden architecture (olive-tree courtyard and glass-fronted garden). Both avoid additional zoom to retain the wider composition. Slides four through seven are unchanged by the ordering revision. Superseded assets are removed from public images and kept in a temporary recovery folder.

Depth comes from photography, tonal surface bands and thin rules. The only CSS box shadow belongs to the expanded mobile navigation; gallery dialogs use a dark backdrop. Photograph captions receive a local gradient for legibility. Cards remain flat, with a small image zoom and circular action-color change on hover.

## Shapes

Photography, content surfaces and full text buttons have square corners. Circles identify icon actions and image-opening controls. Fine, straight borders divide services, project facts and archive controls. The selected slideshow marker elongates into a small rounded dash. Inputs use bottom rules, with a rectangular bordered textarea for the prepared enquiry.

## Components

- **Contact invitations:** Use one shared footer invitation on interior pages. Avoid an additional page-ending contact banner or another contact link in the footer's copyright row. On Contact itself, use a compact copyright-and-brand footer so the enquiry form remains the sole primary action.
- **Actions:** Filled and outlined buttons share compact text, a generous arrow gap and a 50px minimum height. Underlined arrow links move their arrow diagonally on hover. Circular icon buttons use the soft surface on hover; selected archive view buttons use the same fill.
- **Navigation:** The wordmark and small studio descriptor balance a right-aligned link row. Active and hovered links gain a fine underline. The small-screen panel opens below the masthead and closes on route changes or Escape.
- **Filters:** Text controls with counts, a stronger selected label and an underline; the same language switches photography, drawings and sketches. Preserve `aria-pressed` state feedback.
- **Project and journal cards:** Images lead, followed by compact metadata and a title. There is no enclosing card surface. Project images are cropped to 1.42 on desktop and 1.33 on mobile; archive list mode uses a thumbnail with text beside it.
- **Fields:** Persistent labels, transparent backgrounds and bottom borders. Focus strengthens the border and adds the global visible outline. Mobile contact inputs increase to 16px. Validation uses native browser messages; disabled buttons reduce opacity. Prepared enquiries use a soft panel with reviewable text and explicit copy feedback.
- **Media viewer:** A native modal dialog holds contained imagery or drawings, a caption, close action and previous/next controls. It fills the mobile viewport. Escape closes; arrow keys navigate; opening and closing manage focus.
- **Service rows:** Fine rules separate full-width disclosure buttons. Plus/minus icons communicate expansion and descriptive text appears within the row.
- **Next project:** The linked project name leads visually, with the smaller “Next project” label below and a directional arrow alongside.

Most control transitions last 0.2s; photographic hover uses a 0.6s eased zoom, and the featured image uses a 0.65s reveal. Reduced-motion preferences disable animations and transitions and restore immediate scrolling.

## Do's and Don'ts

### Do:

- Do align new sections to the shared fluid gutter.
- Do use square image frames, fine rules and circular icon actions.
- Do retain visible keyboard focus, descriptive media labels and reduced-motion behavior.
- Do keep sample content and illustrative drawings clearly identified.

### Don't:

- Don't add rounded card shells or resting card shadows to the catalogue.
- Don't introduce a competing editorial font family.
- Don't replace functional captions or image controls with decorative overlays.
