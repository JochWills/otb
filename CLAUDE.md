# On The Bay B&B — project notes for Claude

Static site for a bed & breakfast in Summerstrand, Gqeberha. No build step, no
framework, no server-side code, no package.json — every `.html` file is
hand-maintained directly (including the six files under `rooms/` — see
"Room detail pages" below; they were generated once by a scratch script, but
that script isn't part of the repo and nothing regenerates these files
automatically). See README.md for the human-facing overview (hosting, the
callback form, design notes). This file is context a fresh session won't get
from the code alone.

## Image status — what's real, what's still placeholder

The site launched with generic soft-gradient placeholder images (each has its
filename printed faintly in the corner — that's the tell). Progress replacing
them:

**Done (real photos):**
- `images/hero-2.jpg` — the current hero banner (Sept 2026), a garden-path
  shot leading to the guest cottage, downsampled from
  `images/IMG_3459.HEIC` (8064×6048, kept in place as the archival source —
  not referenced by the site). Built the same way as the original hero: PNG
  intermediate via `sips` (HEIC → PNG, lossless), then Pillow Lanczos
  resample to 1920×1440, JPEG `quality=82`. No rotation fix needed for this
  one — the contact-sheet check came back the right way up.
- `images/hero.jpg` — the **previous** hero photo, deliberately left in
  place (and still referenced by nothing) purely so the owner can revert by
  swapping `index.html`'s `.hero-img` `src` back to it — not a "still
  needs replacing" placeholder like the section below. Downsampled from a
  5120×3840 original (`images/hero-original.jpeg`, also kept, also
  unreferenced). If `hero.jpg` (not `hero-2.jpg`) ever needs rebuilding,
  re-derive from `hero-original.jpeg`, not from a re-export of `hero.jpg`
  itself — avoid compounding resample/recompress passes. Same logic applies
  to `hero-2.jpg` vs. `IMG_3459.HEIC`.
- `images/garden.webp` — real pergola/garden photo (Sept 2026), replacing
  the old `images/garden.jpg` placeholder (deleted). Used in the "Welcome"
  section's `.split-fig`.
- `images/bookbox-wave.webp` — real wave photo (Sept 2026), used as the
  background of every room page's `.bookbox-head` (see "Room cards → room
  detail pages" below for the full story, including why the resize recipe
  for this one specifically isn't the usual plain `im.resize()`). Source:
  `images/asideimage.png`, kept as the archival original.
- Five of six room cards — `king-sofa`, `twin`, `self-catering`,
  `family-unit`, `compact-single`. Reshot twice: an initial Sept 2026 pass
  (Claude sifted a raw phone-photo dump for the best/least-repetitive shots,
  JPEG), then redone the same month at the owner's request once they'd
  picked their own favourites from a second raw dump — that second pass is
  what's live now, exported as WebP (see "Photo processing conventions").
  In both passes photos came from `images/OTB/` (one subfolder per room,
  `Room 1`…`Room 6`, matched to room-type slugs by asking the owner — not
  guessed from the photos). The raw dumps (630MB, then 151MB, both HEIC)
  were deleted after processing, at the owner's request each time — there
  is no archival source for these like `hero-original.jpeg`; a different
  crop/photo needs a fresh export from the owner's phone/cloud backup.
- **`garden-double` was NOT reshot in either pass** — its `Room 4` folder
  was uploaded empty both times, so it still has the pre-Sept-2026 photo set
  (JPEG, `images/rooms/garden-double/1.jpg`…`4.jpg`). A fresh shoot for this
  room is still pending; when photos do arrive, process them the same way
  as the other five (see "Photo processing conventions") and update both
  the homepage card and `rooms/garden-double.html` (see below).

**Still placeholder, needs real photos:** `beach.jpg`, `gallery-1.jpg` …
`gallery-6.jpg`, `og-image.jpg`. Same
swap-in-place approach as the README describes: replace the file, keep the
filename, no HTML/CSS changes needed for those.

## Room cards → room detail pages

Each room card — on the homepage's "Rooms" section (`index.html`, `#rooms`,
still there, unchanged in substance) **and** on the dedicated rooms listing
page (`rooms/index.html`, see below) — is a short teaser that **links to its
own page**, it doesn't open a lightbox itself:

```html
<a class="room" href="rooms/king-sofa.html">
  <div class="room-img">
    <img src="images/rooms/king-sofa/1.webp" alt="King room with sofa bed" loading="lazy">
    <span class="room-img-count">9 photos</span>
  </div>
  <div class="room-body">
    <h3>King with sofa bed</h3>
    <p>One king-size bed with a sofa bed suitable for a child under 12. Opens onto its own patio.</p>
    <div class="room-tag">
      <ul class="spec">
        <li><svg ...>...</svg>1 king bed + sofa bed</li>
        ...
      </ul>
      <span class="room-view">View room <span aria-hidden="true">&rarr;</span></span>
    </div>
  </div>
</a>
```

**The whole card is one `<a>`** — clicking anywhere on it (photo, title,
description, specs) goes to the room's page. There's no separate "Enquire"
control on the card any more (there was, briefly; removed at the owner's
request — clicking a card only ever meant "tell me more", the per-card
Enquire shortcut was redundant with the one already on the room's own
page). Because of that, `<h3>` and `.room-view` are **plain text/`<span>`,
not nested `<a>` tags** — the HTML spec doesn't allow anchors inside
anchors, and it used to be one (`.room-img-link`, `<h3><a>`, `.room-actions`
with a second `<a class="link-enq">`) before this simplification. If a
future change needs an independent link *inside* a card again, the whole
card can't stay a single `<a>` — pull it back apart into an image-link +
title-link like the very first version of this pattern, don't just drop a
nested `<a>` in.

The card's visual language (rounded card with hover lift/shadow, `.room-tag`
pairing an icon spec-list with "View room" widening its arrow gap on hover)
was built to match a reference
site's room-card layout the owner pointed to
(relaxedcityliving.co.za/rooms) — colours/type swapped for ours, structure
and interaction kept close to the original (that reference site's own card
is also a single `<a>` with no separate CTA inside it, which is why
dropping our per-card Enquire button actually brought this closer to the
reference, not further from it). It's a deliberate departure from the rest
of the site's flatter, sharper-cornered, shadowless look; that's
intentional, not drift, so don't "fix" it back to match `.btn`/`.gal-item`/
etc. `--r` (the sitewide 3px radius token) is untouched — these cards use
their own 14px radius, scoped to `.room`.

**All 6 cards are meant to end up roughly the same height and the same
background.** `.room-tag` has `margin-top:auto`, so it sits at the bottom
of the card regardless of how long the description or spec list above it
runs — which means one noticeably longer card (more paragraph text, or one
extra spec line) drives the whole row's height (CSS grid stretches every
card in a row to match) and leaves the shorter cards with an ugly gap above
their spec row. `family-unit` hit this twice: a 3-sentence description
where everyone else had 1–2, and a 4-line spec list where everyone else had
3 (plus, at one point, a distinct sand-tinted `.room-feature` background —
since removed; all 6 cards now share the same `--paper` background, at the
owner's request, so there's no lingering visual "this one's special"
signal either). Both fixed the same way, in the (repo-external) generator's
`ROOMS` data: a shorter `"card_body"` and a trimmed `"card_spec"`
(`.get("card_spec", room["spec"])` in `card_helpers.py`'s
`room_card_html()`), each falling back to the full `"body"`/`"spec"` used
on the room's own detail page, which isn't grid-height-constrained the same
way — so the full facts (including "Kitchenette") are still there, just not
on the card. If a future edit makes one card's copy or spec list noticeably
longer than the rest again, same fix: add/shorten a `"card_body"` /
`"card_spec"` rather than letting it stretch the row.

**`.spec` icons are keyed off exact spec text**, not computed — see
`SPEC_ICON` in the (repo-external) generator's `card_helpers.py`. A new
spec line with no matching entry there would need one added; there's no
runtime fallback, the mapping is baked into the HTML at generation time.

The room's own page (`rooms/<slug>.html`) is a banner-hero + two-column
layout, redone (Sept 2026) to match a room detail page on the reference
site the card design was already ported from
(relaxedcityliving.co.za/rooms/city-escape):

- **`.hero.hero--room`** — the same `.hero`/`.hero-img`/`.hero-scrim`
  markup the homepage hero uses, just a shorter modifier (`min-height:min(
  58svh,500px)`, no lede/CTA row, title pinned to the bottom via
  `.hero--room .hero-inner{ display:flex; justify-content:flex-end }`) and
  using the room's own photo #1 as the background image. Because this is a
  real `.hero` element, `script.js`'s header logic (`hasHero =
  !!document.querySelector('.hero')`) now makes the header transparent-
  over-the-photo and solid-on-scroll here too, the same as index.html —
  room pages no longer force `.stuck` immediately the way they did before
  this redesign (there was no hero to be transparent over then).
- Below that, a breadcrumb ("Home / Rooms / *Room title*") and a
  **`.roomlayout`** two-column grid: a sticky **`.bookbox`** on the
  **left** (340px, `position:sticky`) and the description + gallery in
  `.roomlayout-main` on the right. Left, not right, deliberately — the
  thing that actually drives a booking decision reads first, before the
  photos. Collapses to a single column under 900px, box first (it's
  already first in the DOM, so no `order` hack needed), no longer sticky.
- `.bookbox` is the "Check availability" card, redesigned twice in
  Sept 2026 to match owner-supplied mockups — first to a solid-`--ink`
  header with a CSS-drawn wave seam, then to a **real wave photo**:
  - `.bookbox-head`: `.bookbox-head-img` is `images/bookbox-wave.webp`, a
    real ocean photo the owner dropped in (`images/asideimage.png`, kept
    as the archival source, not referenced by the site) that already has
    the wave shape **baked into its own alpha channel** — the owner
    supplied it pre-cut, so there's no CSS clip-path/mask involved at all,
    the wave edge is just wherever the PNG's alpha drops to 0. Resized to
    900px wide for `bookbox-wave.webp`, same WebP pipeline as everything
    else — except plain `im.resize()` on the raw RGBA left a visible dark
    fringe along the cutout edge (Lanczos blending each transparent
    pixel's opaque-but-irrelevant black RGB into the neighbouring opaque
    teal pixels); fixed by alpha-compositing the source over a white
    canvas first (so the RGB feeding the resize is white at the edges,
    not black) and reattaching the original, un-composited alpha
    afterward — see the resize step for the exact recipe if this image
    ever needs rebuilding from `asideimage.png` again.
    Over the photo: the calendar icon, "Check availability" as a serif
    `<h3>`, a small uppercase "Plan your stay" eyebrow, a `.bookbox-head-
    scrim` gradient behind just that text for legibility, and three
    ripple-line squiggles (`.bookbox-head-waves`, plain stroked SVG paths)
    echoing the water lower down.
  - **Two rendering gotchas hit building this, both left as comments in
    the CSS but worth restating here since they're easy to reintroduce:**
    - `.bookbox-head-img`/`.bookbox-head-scrim` must **not** carry a
      negative `z-index`. `.bookbox-head` is `position:relative` without
      its own `z-index`, so it doesn't establish a stacking context —
      children with `z-index:-1`/`-2` paint *behind the element's own
      background*, not just behind its other children, which made the
      photo invisible the first time (page showed a flat `--ink` rectangle
      with only the SVG squiggles visible on top). Fix: no `z-index` on
      either — plain DOM order (img, then scrim, then the text block)
      already paints them correctly back-to-front.
    - `.bookbox-head`'s own `background` has to be `var(--paper)`, not a
      dark fallback colour. The photo's alpha cutout doesn't reveal
      `.bookbox-body` (a separate, later sibling box it doesn't overlap)
      — it reveals **`.bookbox-head`'s own background**, since that's what
      is actually sitting behind the `<img>` inside the same element. With
      `--ink` there (left over from the solid-header version), the cutout
      showed a dark-green band between the surf and the paper body instead
      of blending straight into it — looked exactly like a stray dark
      fringe at first glance, which is what sent troubleshooting toward
      the resize/z-index issues above before the real cause (just the
      wrong background-color on the right element) turned up.
  - `.bookbox-body`: a `dl.bookbox-facts` of icon-led `dt`/`dd` rows built
    from the room's own spec list — labelled by a simple keyword
    heuristic (`sleep` → **Sleeps**, `kitchenette` → **Kitchen**,
    `shower`/`bath`/`en-suite` → **Bathroom**, else → **Bed**), each icon
    sitting in its own `.bookbox-icon` circle badge (reusing the exact
    same bed/people/bathroom/kitchen icon paths as the room-card `.spec`
    icons, just recoloured/recircled for this card). A room with no
    bathroom line in its spec (currently just `self-catering`) simply
    gets no Bathroom row — not invented. Two more rows, **Check-in
    14:00** / **Check-out 10:00** (same for every room, confirmed from
    the booking listings — see README), follow after a solid `.row-stay`
    divider separating "what the room is" from "when you can have it".
    Below the facts: two full-width **pill** buttons (`.bookbox-btn`,
    `border-radius:100px` — deliberately not the sitewide `.btn` shape,
    same "this component gets its own rounder language" precedent as the
    room cards) — solid **"Check dates & book"** (calendar + arrow icons)
    straight to Nightsbridge (`https://book.nightsbridge.com/26870`, new
    tab, same link used sitewide — Nightsbridge doesn't take a per-room
    query param), and outline **"Enquire about this room"** (photo +
    arrow icons) to the callback form (see below). Then a small
    horizontal-rule-flanked WhatsApp icon (`.bookbox-fine-rule`, reusing
    the same speech-bubble path as the floating `.wa-float` button) above
    a **"Prefer WhatsApp?"** line — there's no separate WhatsApp *button*
    here, on purpose: it'd be a third competing CTA redundant with the
    always-on floating icon (see README), so the link is kept but
    de-emphasised to text.
  - **Grid-overflow gotcha, watch for it if this box changes again:** the
    mobile breakpoint (`@media (max-width:900px)`) collapses `.roomlayout`
    to one column. That rule must stay `grid-template-columns:minmax(0,
    1fr)`, **not** a bare `1fr` — a CSS grid item's default `min-width` is
    `auto`, which still honours a deep descendant's intrinsic content
    width (e.g. anything `white-space:nowrap`, like the button text
    briefly was during this redesign), so a bare `1fr` track will grow
    the whole track — and the page — past the viewport into horizontal
    scroll rather than let that descendant wrap. `minmax(0,…)` is what
    actually lets the track shrink below its content.
- `.roomlayout-main` has the description (`<p class="eyebrow">About the
  room</p>` + the same body paragraph used elsewhere for this room) and a
  **`Photos`**-labelled gallery: every photo for the room in a
  `.grid-gal.grid-gal-feature` grid, using the **same shared lightbox**
  (`#lb` + `script.js`) that powers the homepage's own `#gallery` grid —
  `script.js` just wires up whatever `.gal-item` buttons exist on the
  current page, so none of this needed new JS. `.grid-gal-feature` makes
  just the first photo a 2×2 feature tile (`.gal-item:first-child{
  grid-column:span 2; grid-row:span 2 }`, ported from the reference site's
  own `.gallery button:first-child` rule) — generalising to any photo
  count, unlike the homepage gallery's 1st/4th/5th-span mosaic (hand-tuned
  for exactly 6 photos, and now scoped to its own `.grid-gal-mosaic`
  modifier class on `#gallery`'s grid — see next paragraph) or the flat
  `.grid-gal-uniform` modifier this replaced (removed, no longer used
  anywhere).
  **`.grid-gal-feature` explicitly resets every tile** (`grid-column:span
  1; grid-row:span 1`, 4/3 aspect) before re-applying the span to
  `:first-child` — it can't just rely on `.gal-item`'s own defaults,
  because the homepage's `.gal-item:nth-child(1/4/5)` mosaic rules used to
  be unscoped `.grid-gal` defaults and would otherwise leak into *every*
  `.grid-gal` on the site, room pages included (this actually happened —
  first ship of this gallery had photos #1, #4 and #5 on every room page
  incorrectly forced wide with an 8/3 crop from the homepage's rule, not
  the intended 2×2 square feature tile — fixed by scoping the mosaic rules
  to `.grid-gal-mosaic`, which only `index.html`'s `#gallery` div carries,
  instead of leaving them as a `.grid-gal` default every other page has to
  fight). If a third gallery layout is ever needed, give it its own
  modifier class the same way rather than adding more unscoped
  `.gal-item:nth-child(n)` rules.
- Below `.roomlayout`, in its own section: the other five rooms as plain
  link pills (`.room-more`/`.room-more-link`), unchanged by this redesign.

**Three places to update, not one.** The homepage card, the `rooms/index.html`
listing card, and the room's own page all reference the same photo set
independently. Changing a room's photos means updating *all three*: the
card thumbnail `src` + `.room-img-count` text in `index.html`, the same pair
in `rooms/index.html`, and the full `<div class="grid-gal grid-gal-feature">`
list in `rooms/<slug>.html` (plus that page's `.hero-img` `src`/`alt` if
photo #1 changed — it's the room's hero banner now, not a small intro
figure). There's no shared data source between them — the two card
instances and the one generator script that originally wrote them (see
below) all just happen to agree today because they were written from the
same data at the same time, not because anything enforces it going forward.

- Photos live under `images/rooms/<slug>/1.webp, 2.webp, ...` (still `.jpg`
  for `garden-double`, see above) — one folder per room type, numbered in
  display order. Current counts: `king-sofa` 9, `twin` 6, `family-unit` 11,
  `garden-double` 4, `self-catering` 7, `compact-single` 4.
- Slugs → room type: `king-sofa`, `twin`, `family-unit`, `garden-double`,
  `self-catering`, `compact-single` — matched to the six listed room types
  by asking the property owner to identify each `Room N` folder, not
  guessed from the photos.
- Room pages live at `rooms/<slug>.html` (one level down from the site
  root), so every internal reference on them is `../`-prefixed
  (`../styles.css`, `../images/...`, `../index.html`, `../script.js`) —
  except links to the rooms listing page or another room page, which are
  siblings in the same folder and just `index.html` / `<slug>.html`.
- "Enquire about this room" on a room page links to
  `../index.html?room=<Room+Name>#callback` (space-as-`+`, matching
  `application/x-www-form-urlencoded`). `script.js` reads that `room` query
  param via `URLSearchParams` on load and preselects it in the `#f-room`
  dropdown, using the same `selectRoomOption()` helper. The option text
  must match exactly (it's a plain text match against `<select>` option
  text, e.g. `"King with sofa bed"`).

### Rooms listing page (`rooms/index.html`)

A dedicated rooms index, separate from both the homepage's `#rooms` section
and the individual `rooms/<slug>.html` pages — added so the header/footer
**"Rooms" nav link** could point somewhere more room-focused than an anchor
scroll. On `index.html` and every `rooms/*.html` page, `<a href="...">Rooms
</a>` now points here (`rooms/index.html` from the root, plain `index.html`
from inside `rooms/`) instead of `#rooms`. The homepage's own `#rooms`
section (`id="rooms"` on that `<section>`) is untouched and still there —
the anchor target still exists, it's just no longer what the nav link goes
to; each room detail page's own breadcrumb ("Home / Rooms / *Room title*")
also links its "Rooms" segment here rather than back to the homepage
section.

Structure: breadcrumb ("Home / Rooms") + intro + the six room cards all
share **one** `<section class="band band-paper page-top">` — `.page-top`
is the one surviving user of the flat-140px fixed-header-clearance trick
(`.room-top`, used by individual room pages, dropped it once those pages
got their own `.hero--room` banner to sit under the header instead — see
above) — deliberately one
separate `<section>`s (both `band-paper`, so no visible colour seam), which
looked fine in markup but doubled `.band`'s `padding-block` where they met
— `--band` (64–124px) of bottom padding on the intro section stacked with
another `--band` of top padding on the cards section, ~130–250px of dead
air between the lede and the first card row that had no visual reason to
be there. Padding doesn't collapse like margin does, so two adjacent
same-background bands is *never* the right way to add breathing room
between an intro and what follows it — use `.sec-head`'s own
`margin-bottom` (already `clamp(36px,5vw,64px)`) for that, or increase it,
rather than reaching for a second section. After the cards: a "Not sure
which one?" section (`<dl class="facts guide">`, one
guest-scenario-to-room mapping per row, all six rooms used exactly once,
phrased directly from each room's own existing copy/specs — not invented)
→ a closing CTA band (`.band-rose`, `.cta-band`) with "Request a callback"
/ WhatsApp. No lightbox markup on this page — the cards link out rather
than open one, so there's no `.gal-item` to power.

### "Rooms" nav dropdown

The header's "Rooms" link (on every page — `index.html` and all 7
`rooms/*.html` pages) is a `.nav-item` wrapping a real link
(`.nav-trigger`, still goes straight to `rooms/index.html` on click) plus
a `.nav-dropdown` listing all six rooms, revealed on `:hover`/
`:focus-within` (CSS only, no JS). Each room's own page marks itself
`aria-current="page"` in its own dropdown entry. Since hover doesn't exist
on touch, the `@media (max-width:760px)` block resets `.nav-dropdown` to
`position:static` and always-visible — it just renders as an indented
sub-list under "Rooms" in the slide-down mobile menu instead of a floating
panel. **Two more places to update if a room is ever renamed/added/
removed**, on top of the "three places" already listed above for cards:
the `.nav-dropdown` list is hand-written on **all 8 pages**, not
generated — there's no shared data source for it either.

## Worth flagging to the owner

Room copy vs. photos don't fully line up and are worth a quick owner check
before launch (separate from the four items already listed in the README):
- The **Garden double** card's copy doesn't mention a kitchenette, but its
  (still-unreplaced) photos show a full kitchenette with sink and stovetop.
- The **King with sofa bed** card's copy doesn't mention a kitchenette
  either, but its real photos (`images/rooms/king-sofa/5.webp`) show a full
  kitchenette with an induction stovetop and sink — same mismatch as
  garden-double.
- The **Self-catering room** card's photos do show a kitchenette nook
  (microwave, kettle, sink) consistent with its "light meal" copy — no
  action needed, just noting it's confirmed rather than assumed.

## Photo processing conventions

No ImageMagick installed; the pipeline is sips (macOS built-in) + Python
Pillow. **sips alone can't write WebP** (`Can't write format:
org.webmproject.webp`), so the room/garden photos go through two steps:

1. `sips -s format png <src.HEIC> --out <tmp.png>` — lossless intermediate,
   full resolution. (Going HEIC → JPEG → WebP would compound two lossy
   passes; PNG in between avoids that.)
2. Pillow: open the PNG, resize with `Image.LANCZOS` to a 2000px long edge,
   save as WebP with `quality=82, method=6`.

Why 2000px: the lightbox (`.lb` in styles.css) displays images up to
**1100 CSS px** wide. On any 2x-DPR screen (most modern laptops/phones)
that's 2200 physical px — a source capped at 1100 actual px (the old
convention) gets upscaled and looks soft. 2000px covers 2x displays with
headroom; going higher (for 3x) would push typical file sizes well past
300–400KB for not much visible gain at normal viewing distance. Room photos
at this size land mostly 100–250KB, occasionally 300–450KB for
detail/foliage-heavy shots (a patio shot with dense plants hit 424KB) —
noticeably heavier than the old ~40–115KB JPEG target, and that's an
accepted trade-off for lightbox sharpness, not a bug.

**Rotation gotcha, check every batch:** photos from at least one iPhone in
use here (`IMG_xxxx.HEIC`, model "iPhone 17 Pro Max") come through with no
usable EXIF orientation tag (`mdls kMDItemOrientation` reads `1`/normal even
when the framed content is clearly sideways) — `sips` has nothing to
auto-correct, so a meaningful fraction of any batch (roughly a third, last
time) comes out rotated 90°. There's no shortcut for this: after the first
conversion pass, build small contact-sheet grids (PIL, thumbnail each
result into one big labelled grid image) and eyeball every photo — sideways
ones all needed the same `im.rotate(-90, expand=True)` (rotate clockwise)
in both batches so far, applied before the resize/WebP-encode step (not as
a re-rotation of an already-encoded WebP, to avoid a second lossy pass).
Re-check with a fresh contact sheet after fixing.

For anything still going out as plain JPEG (there's currently nothing left
that is, but if `garden-double` gets reshot before someone updates this
pipeline for it too): capped at 1100px long edge, sips `formatOptions
normal`, targeting 40–115KB. `sips -Z <N>` scales to fit *and* upscales if
the source is smaller than `<N>` — check source dimensions first.

## Deployment

No CI, no build. Static host of any kind (Netlify, Cloudflare Pages,
GitHub Pages, plain cPanel). See README.md § Hosting. Room pages are plain
files under `rooms/`, so they deploy the same way as everything else — no
routing config needed.
