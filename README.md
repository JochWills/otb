# On The Bay B&B — website redesign

Static site. No build step, no framework, no database. Upload the folder and it runs.

```
index.html      the main site (single page, anchor nav)
thanks.html     shown after a callback request is sent
rooms/          rooms listing page (index.html), plus one page per room
styles.css
script.js
favicon.svg
robots.txt
sitemap.xml
images/         all photography
```

---

## 1. Swap in the real photos

The `images/` folder started out with **soft colour placeholders**, each with its filename
printed faintly in the corner. Most are done now; one file still needs a real photo
dropped in.

**Done:**
- `hero.jpg` and `garden.jpg` (now `garden.webp`) — real photos.
- Five of the six room cards — each has its own folder of real photos under
  `images/rooms/<room>/1.webp, 2.webp, ...` (still `.jpg` for `garden-double`, which is
  still pending its reshoot — see CLAUDE.md). Each room card on the homepage links through
  to its own page under `rooms/` with a full photo gallery and more detail; clicking a
  gallery photo (on the homepage's own "A look around" gallery, or on any room page) opens
  a lightbox with all of that grid's shots.
- `gallery-1.webp` … `gallery-14.webp` — the homepage's own "A look around" gallery, real
  photos of the house/garden (Sept 2026, from `images/LookAround/`, kept in place as the
  archival source). Same WebP pipeline as the room photos (see CLAUDE.md § Photo processing
  conventions) rather than the plain JPEG this section used to suggest — these open in the
  same lightbox as the room photos, so they get the same 2000px/quality-82 treatment for
  sharpness on 2x screens. One tile per row of 3 renders **wide**, alternating sides
  (tiles 1, 4, 5, 8, 9… — see CLAUDE.md for the exact pattern), the rest **square-ish** —
  photos were assigned to slots by which crop suited their framing, not
  upload order. Only the first 6 show on page load; a **"See more photos"** button reveals
  the rest 4 at a time (see CLAUDE.md § Image status for exactly how — worth reading before
  touching this grid, there's a non-obvious CSS specificity gotcha around hiding `.btn`
  elements that bit this once already).
- `images/aroundus.webp` — the "What's around us" section's photo panel (Sept 2026 redesign,
  see CLAUDE.md), owner-supplied Ironman cyclists on the coast road. Source:
  `images/aroundus.jpg`, kept as the archival original. Replaced a generated-gradient
  placeholder that briefly stood in its place under the filename `around.jpg` (deleted once
  the real photo arrived).

**Still placeholder — replace the file, keep the filename, nothing else changes:**

| File | What goes here | Suggested size |
|---|---|---|
| `og-image.jpg` | Preview image for WhatsApp / Facebook shares | 1200 × 630 |

Save as JPEG at roughly 80% quality and keep each file under about 400 KB. The existing
photos on the old site can be pulled straight out of the browser (right-click → Save image).

To add more photos to an existing room, drop them into that room's `images/rooms/<room>/`
folder as the next number, **then update up to three places**: the room's own gallery grid
in `rooms/<room>.html`, and (if it's a new photo #1) the thumbnail on that room's card on
the homepage (`index.html`) and on the rooms listing page (`rooms/index.html`). See
CLAUDE.md for the full convention — there's no shared data source between them, so each
needs editing by hand.

---

## 2. Point the callback form somewhere real

The form currently posts to **FormSubmit**, which is free and needs no account:

```html
<form action="https://formsubmit.co/info@onthebaybandb.co.za" method="POST">
```

Submit the form once after the site goes live. FormSubmit emails
`info@onthebaybandb.co.za` a one-time activation link — click it, and every submission
from then on lands in that inbox. Nothing else to configure.

If you'd rather use Formspree, Netlify Forms or a PHP handler, change the `action`
attribute and delete the four hidden `_` fields.

The `_next` field sends people to `thanks.html` after submitting. Update that URL if the
site is hosted on a different domain.

---

## 3. Things to confirm with the owner before going live

I built this from the copy and details on the current site plus their public listings.
Four items are worth a quick check:

- **Room copy vs. the real photos** — which photo folder belongs to which room type has
  been confirmed with the owner, but the written descriptions haven't been checked against
  the photos themselves. In particular: the Garden double's copy doesn't mention a
  kitchenette but its photos show a full one (sink + stovetop); the Self-catering room's
  photos show a smaller kitchenette nook than that. Worth a quick owner check — see
  CLAUDE.md for detail.
- **Check-in from 14:00, check-out by 10:00** — taken from their booking listings, not
  their own site.
- **Breakfast at R110 per person**, not served 16 December – 7 January.
- **The fax number** is still on the contact list. Most guest houses have dropped theirs;
  worth asking whether to keep it.

The COVID-19 section from the old site has been removed entirely, as asked.

---

## 4. Hosting

Drop the folder into any static host — Netlify, Cloudflare Pages, Vercel, GitHub Pages, or
straight into `public_html` on cPanel shared hosting. There is no server-side code.

Two external things load over the network:

- Google Fonts (Fraunces + Karla). If they're blocked the site falls back to Georgia and
  Helvetica and still looks fine.
- A Google Maps embed in the "Find us" section.

---

## Design notes

- **Palette** — deep garden green `#1C3A31`, chalk `#EFF2EA`, sand `#E7DCCA`, rose
  `#A83B54`, sea `#4F8F8B`. Drawn from the two things that actually define the place: an
  English rose garden and the bay behind it.
- **Type** — Fraunces for headings, Karla for everything else.
- **Room cards** — rounded, shadowed cards that lift on hover, with an
  icon-led spec list. Styled after
  another local guest house's room-card layout (relaxedcityliving.co.za/rooms)
  at the owner's request, so they read a little softer than the rest of the
  site's flatter, sharp-cornered look — that contrast is intentional.
- **Structure** — one main page, plus a page per room. Hero → the house → six rooms →
  breakfast and braai → what's around → gallery → callback → find us. Each room card links
  to its own page (`rooms/<room>.html`) with a full gallery and more detail. The callback
  request is reachable from the fixed header, every room card and room page, and its own
  section. The hero's own two buttons point elsewhere — "See rooms" scrolls to the room
  grid, "Check availability" opens the Nightsbridge booking site in a new tab.
- **Motion** — one entrance sequence on the hero, and nothing else that isn't a response to
  a click or hover. `prefers-reduced-motion` is respected throughout.
- **Accessibility** — skip link, visible focus rings, labelled form fields, alt text on
  every image, keyboard-operable gallery and menu.
- The WhatsApp button floating bottom-right goes to **083 797 0894**. For a small guest
  house that's usually the highest-converting contact route, which is why it's always on
  screen.
