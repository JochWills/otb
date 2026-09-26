# On The Bay B&B — project notes for Claude

Static site for a bed & breakfast in Summerstrand, Gqeberha. No build step, no
framework, no server-side code, no package.json — every `.html` file is
hand-maintained directly (including the six files under `rooms/` — see
"Room detail pages" below; they were generated once by a scratch script, but
that script isn't part of the repo and nothing regenerates these files
automatically). See README.md for the human-facing overview (hosting, the
design notes). This file is context a fresh session won't get
from the code alone.

## Image status — what's real, what's still placeholder

The site launched with generic soft-gradient placeholder images (each has its
filename printed faintly in the corner — that's the tell). Progress replacing
them:

**Done (real photos):**
- **`images/hero-3.jpg` is the hero the page actually loads** (1448×1086,
  derived from the owner-supplied `images/heronewtest.png` at the same
  size). This entry used to name `hero-2.jpg` and was stale — **check
  `index.html`'s `.hero-img` `src` rather than trusting this list**, since
  the hero has now been swapped three times and the superseded files are
  all still on disk (`hero.jpg`, `hero.jpeg`, `hero-2.jpg`,
  `hero (1).jpeg`, `hero-original.jpeg`), which makes guessing from
  filenames unreliable.

  **Known quality limit:** at 1448px wide it is the site's LCP image and
  it spans `100vw`, so on a 1440px screen at 2x DPR it is upscaled about
  2x and looks soft. Its own source (`heronewtest.png`) is the same size,
  so this can't be fixed by re-exporting — it needs a larger original
  from the owner. Everything else on the site targets 2000px for exactly
  this reason (see "Photo processing conventions").
- `images/hero-2.jpg` — a **superseded** hero (Sept 2026), a garden-path
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
- `images/welcome.webp` — the "Welcome" section's `.split-fig` photo: the
  pergola with its purple creeper, the striped deckchair and the brick
  paving. Owner-supplied re-grade (Sept 2026) of the shot that was there
  before, **named for the section rather than its contents** because that
  is what the owner calls it. Source `_originals/welcome.png`.
  - It **replaced `images/garden.webp`** (1350×1800, 682KB), which was the
    same scene, less saturated, with a paler sky. That file was deleted
    rather than kept — it is in git if the old grade is ever wanted. The
    placeholder before *that* was `images/garden.jpg`, also deleted.
  - Another **1448px export**, like `hero-3.jpg`, `twin/1.webp` and
    `compact-single/1.webp` — four files now, which makes it close to
    certain this is a fixed setting on the owner's export rather than the
    photos. Unlike those three, **it doesn't matter here**: `.split-fig`
    renders about 474 CSS px wide at `--maxw`, so 1086px still covers a
    2x screen with headroom, and the figure is not in the lightbox.
  - Encoded **q82, no resample** — not the q86 the two room photos got.
    q86 was a concession to those being resolution-starved at full-bleed
    hero size; this one isn't, so the standard quality applies. It lands
    at 424KB, over README's ~400KB guidance but inside the 300–450KB band
    CLAUDE.md already documents for foliage-heavy shots, and still 258KB
    lighter than the file it replaced. If that ever needs to come down,
    the lever is resolution (950px would cover 2x exactly), not quality.
  - **The alt text and figcaption both talk about rose bushes, which are
    not in this photo** — they describe the garden as a whole. That
    mismatch predates this swap and was left alone; worth raising with
    the owner rather than silently rewriting their copy.
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
- **`garden-double` was reshot separately, on 26 Sept 2026.** Its `Room 4`
  folder was empty in both earlier passes, so until then it ran on the
  pre-launch JPEG set (`1.jpg`…`4.jpg`, deleted and still in git). The
  owner dropped 7 photos into `_originals/Room 4/`, each supplied **twice**:
  as `N.HEIC` and as an `N.jpeg` re-export at the same 8064×6048. The
  **HEICs were used**, since the JPEGs are an extra lossy generation of the
  same pixels. Both copies are kept there as the archive, unlike the
  earlier room dumps.
  - Same pipeline as the other rooms: HEIC → PNG via `sips`, 2000px long
    edge, WebP q82 `method=6`. **`6.webp` (the bathroom) came through
    sideways** and needed `rotate(-90)`. It is the only portrait photo in
    the set (1500×2000).
  - **`7.webp` (the lattice courtyard) is 728KB**, well over the usual
    band. It was left at q82 on purpose, because the owner asked for high
    quality. Dropping quality barely helps: q75 only saves about 165KB and
    raises mean error from 3.2 to 4.1. The detail really is in the dense
    foliage and brick. It is the last gallery tile, so it only loads lazily.
- `images/gallery-1.webp` … `gallery-6.webp` — the homepage's `#gallery`
  ("A look around") grid, replacing the six soft-gradient placeholders
  (Sept 2026). Source: `images/LookAround/LookAround1.jpg`…`6.jpeg` (owner-
  supplied, kept in place as the archival originals, matching the
  hero/garden/bookbox precedent above rather than the room-photo one, which
  deletes its raw dumps). Processed with the same pipeline as the room
  photos (2000px long edge, WebP `quality=82, method=6`) rather than the
  plain-JPEG one the README used to describe for this file set — these
  photos open in the same `#lb` lightbox the room galleries use, so the
  same "why 2000px" reasoning in "Photo processing conventions" below
  applies to them too, not just to room shots. `ImageOps.exif_transpose()`
  was run before resizing (none of the six actually needed it — all came
  out upright — but cheap insurance, unlike the room photos' HEIC source
  which has no usable orientation tag at all and needs the contact-sheet
  method instead). The six source photos weren't assigned to gallery slots
  in upload order — slots 1, 4 and 5 render as a wide 8:3 crop and 2, 3
  and 6 as 4:3 (see below), so the two naturally panoramic garden-path
  shots and the wide-doorway dining room shot went in the wide slots, and
  the three closer/detail shots (a dresser, a "Welcome" shelf, a patio
  corner) went in the square-ish ones — a crop that fights a photo's own
  framing is the usual way this kind of mosaic ends up looking broken.
- `images/gallery-7.webp` … `gallery-14.webp` — eight more real photos
  (Sept 2026, same day, same owner upload — `images/LookAround/LookAround7
  .jpeg`…`14.jpg`, same archival-source-kept treatment, same WebP pipeline),
  added in a follow-up request specifically so the site had more than 6
  "around the property" shots without crowding the page on load — see
  "'See more photos'" below for how they're revealed, and the mosaic
  pattern note just below that for how they still get the same wide/narrow
  treatment as photos 1–6 despite arriving after the original six-photo
  mosaic was hand-tuned.
- `images/adventuretext.webp` — the "What's around us" photo caption, as
  **owner-supplied lettering artwork rather than live text** (Sept 2026).
  Source `images/adventuretext.png` kept as the archival original. See
  the "What's around us" section below for why it's an image, and for
  the transparent-PNG encoding gotcha it ran into.

**Gallery mosaic pattern.** `.grid-gal-mosaic .gal-item:nth-child(4n+1)`
and `:nth-child(4n)` render wide (2 grid columns, an 8:3 crop); everything
else stays the grid's default 1-column 4:3 tile. In a 3-column grid this
alternates which side of each row the wide tile falls on — tile 1 wide,
2 narrow; 3 narrow, 4 wide; 5 wide, 6 narrow; 7 narrow, 8 wide; and so on,
repeating forever. This replaced an earlier version hardcoded to exactly
`:nth-child(1), :nth-child(4), :nth-child(5)` (correct only for a fixed
6-photo grid) once "See more photos" (below) meant the grid could hold
more than 6 — the `4n`/`4n+1` formula keeps producing the same one-wide-
tile-per-row rhythm no matter how many photos get revealed, instead of
every tile past 6 falling back to a flat, un-mosaicked grid.

**"See more photos" — the homepage gallery only shows 6 photos up front.**
All 14 `.gal-item` buttons are in the DOM from page load (`index.html`'s
`#gal`), but the 8 that aren't among the first 6 carry a plain `hidden`
attribute in the markup, and a `<button id="galMore">See more photos</button>`
sits in a `.gal-more-row` right after the grid. `script.js`'s `#galMore`
click handler un-hides the next 4 still-hidden `.gal-item`s each time it's
clicked (`#gal .gal-item[hidden]`, sliced to 4), and hides the button
itself once none are left. Two clicks exhausts 8 photos (4 + 4). A photo
count that isn't a multiple of 4 still works fine — the last click just
reveals whatever's left, same as the loop's own `.slice(0, 4)` naturally
handles a shorter remainder.

Two things worth knowing if this needs touching again:
- **The lightbox's own photo set is built once at page load from every
  `.gal-item` in the DOM, hidden or not** (`document.querySelectorAll
  ('.gal-item')` doesn't care about the `hidden` attribute or `display`).
  So opening the lightbox on photo 1 and clicking "previous" wraps
  straight to photo 14/14, even if "See more photos" was never clicked —
  this is intentional, not a bug to "fix" by scoping the lightbox to only
  visible tiles. It means the lightbox and the on-page reveal are two
  independent ways to reach the same photos, not one gating the other.
- **`.btn[hidden]` needed an explicit override to actually hide.** `.btn`
  sets `display:inline-flex` in the author stylesheet; the browser's own
  default `[hidden]{ display:none }` rule lives in the *user-agent*
  stylesheet, which always loses ties to an author-stylesheet rule of the
  same specificity, regardless of which one is more "specific-looking" —
  so `galMore.hidden = true` silently did nothing visually until
  `.gal-more-row .btn[hidden]{ display:none }` was added in styles.css to
  re-assert it at author-stylesheet specificity. Worth remembering for any
  future `hidden`-toggled `.btn` elsewhere on the site — the same silent
  failure will happen again without a matching override.

**No placeholders remain.** `og-image.jpg` was the last one (a green
gradient with its own filename printed on it) and was replaced Sept 2026:
1200×630, cropped from `_originals/heronewtest.png` — the hero's own source
— at `top=210` of a full-width 1448×760 slice, so a shared link previews as
the page it opens. Cropped from the PNG source rather than from
`hero-3.jpg` to avoid a second lossy pass.

**Its `og:image` must stay an absolute URL.** It was
`content="images/og-image.jpg"` while all six room pages were already
absolute, which meant the *homepage* — the most-shared page — previewed
with no image at all: Facebook and WhatsApp fetch that URL from their own
servers, where a relative path has nothing to resolve against. There is no
warning and no error; the card just renders bare, so this is only ever
caught by reading the tag or by testing a real share.

`beach.jpg` (a placeholder gradient) and the `.wide-fig` figure that displayed
it — a full-width band under the "What's around us" distances/trips grid —
were removed entirely (Sept 2026) at the owner's request, rather than left
for a future photo swap-in. If a similar wide banner photo is wanted there
again later, it needs new markup, not just a dropped-in file — `.wide-fig`
no longer exists in styles.css.

## Room cards → room detail pages

Each room card — on the homepage's "Rooms" section (`index.html`, `#rooms`,
still there, unchanged in substance) **and** on the dedicated rooms listing
page (`rooms/index.html`, see below) — is a short teaser that **links to its
own page**, it doesn't open a lightbox itself:

```html
<a class="room" href="rooms/king-sofa.html">
  <div class="room-img" data-room-carousel data-slug="king-sofa" data-count="9" data-ext="webp" data-alt="King room with sofa bed">
    <img src="images/rooms/king-sofa/1.webp" alt="King room with sofa bed" loading="lazy">
    <span class="room-badge room-badge--light"><svg ...>...</svg>Private patio</span>
    <div class="room-carousel" aria-hidden="true">
      <button type="button" class="room-carousel-btn room-carousel-prev" aria-label="Previous photo of King with sofa bed">...</button>
      <span class="room-carousel-count">1 / 9</span>
      <button type="button" class="room-carousel-btn room-carousel-next" aria-label="Next photo of King with sofa bed">...</button>
    </div>
  </div>
  <div class="room-body">
    <p class="eyebrow">Room type</p>
    <h3>King with sofa bed</h3>
    <p>One king-size bed with a sofa bed suitable for a child under 12. Opens onto its own patio.</p>
    <div class="room-tag">
      <ul class="spec">
        <li><svg ...>...</svg>1 king bed + sofa bed</li>
        ...
      </ul>
      <span class="room-view">View room <span class="room-view-arrow" aria-hidden="true"><svg ...>...</svg></span></span>
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
with a second `<a class="link-enq">`) before this simplification.
`.room-view`'s trailing arrow is a small `.room-view-arrow` circle
(30px, dark, turns `--rose-deep` and nudges right on card hover) rather
than a bare "→" character — reverted from an even bigger version of this
(a rule stretching across the whole row to a 38px button) the owner tried
and didn't want, back to something closer to the original but with the
circle kept.

**Badge + working photo carousel, added Sept 2026** to match an
owner-supplied mockup: a small feature **badge** top-left of the photo,
and prev/next controls + a "1 / 9" counter that cycle that room's own
`images/rooms/<slug>/` photo set right on the card, in place of the old
static "9 photos" text. This briefly forced the card apart into an
image-link + title-link (a `<button>` isn't valid content inside an `<a>`,
and the carousel needed real buttons) — **reverted at the owner's
request**, who wanted click-anywhere-on-the-card back. The fix: the
carousel buttons stay nested inside the single `<a>` (a real HTML
conformance wart — interactive content inside a hyperlink — kept on
purpose) and their click handlers call `e.stopPropagation()` in
`script.js`, the same trick `.lb-prev`/`.lb-next` already use against the
lightbox `<dialog>`, so a button click never bubbles up to trigger the
card's own navigation. **If a future change needs another *link* (not a
button) inside the card again, this trick won't help** — nested `<a>`s
really do get broken apart by the browser's own parser, unlike nested
buttons — pull the card back apart the way it briefly was, don't try to
stopPropagation a nested anchor.

The carousel is `script.js`'s `data-room-carousel` block: it reads
`data-slug`/`-count`/`-ext`/`-alt` off `.room-img` and rewrites the `<img
src>` + counter text on click, no page reload and no lightbox involved
(it's a separate, much lighter mechanism than the `#lb` lightbox that
powers the *gallery* grids elsewhere).

The feature badges (`.room-badge`, alternating `--light`/`--dark` pill
styling down the row purely for visual rhythm, not tied to meaning) are
short, defensible, feature-based lines the owner should feel free to
edit — **not** verified marketing claims like "most popular" (no booking
data backs that up), so each one describes something already true of the
room's own spec instead: king-sofa "Private patio", twin "Flexible
option" (it really does convert between 2 singles and a king+single),
family-unit "Great for families", garden-double "Garden views",
self-catering "Self-catering", compact-single "Solo & short stays".

A small wave-doodle watermark low in each `.room-body` (`.room-body::after`,
an inline SVG data-URI, ~5% opacity) echoes the same ripple motif as
`.bookbox-head-waves` on the room detail pages — pure decoration, `z-index`
places it behind the card's own text.

The card's visual language (rounded card with hover lift/shadow, `.room-tag`
pairing an icon spec-list with "View room" widening its arrow gap on hover)
was built to match a reference site's room-card layout the owner pointed to
(relaxedcityliving.co.za/rooms) — colours/type swapped for ours, structure
and interaction kept close to the original (that reference site's own card
is also a single `<a>` with no separate CTA inside it). The badge/carousel
addition above is a departure from that reference (it doesn't have either),
sourced from a second, separate mockup the owner supplied instead. Both are
a deliberate departure from the rest of the site's flatter, sharper-cornered,
shadowless look; that's intentional, not drift, so don't "fix" it back to
match `.btn`/`.gal-item`/etc. `--r` (the sitewide 3px radius token) is
untouched — these cards use their own 14px radius, scoped to `.room`.

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

    **The `dd` values are serif at weight 500** (Sept 2026), matching
    `.cb-card-value` in `#contact` rather than the bold sans they were.
    At 700 the sans read as app UI next to the muted sans labels, and it
    clashed with the serif "Check availability" heading sitting directly
    above it in the same card. Two details in that rule are
    load-bearing:
    - **`text-wrap:balance`.** Two values are long enough to wrap in the
      340px sidebar — `twin`'s "2 singles, or king + single" and
      `family-unit`'s "King, double or twin beds". Right-aligned and
      unbalanced, the first stranded "single" alone on line 2, which
      reads as a mistake rather than a line break. Balance splits them
      evenly instead. **Any new value past roughly 22 characters wraps
      here too** — check it rather than assuming.
    - **An explicit `line-height:1.3`.** The inherited body line-height
      left a wrapped two-line value looking like two separate facts.

    Verified across all six room pages at 1440/901/390.
    Below the facts: two full-width **pill** buttons (`.bookbox-btn`,
    `border-radius:100px` — deliberately not the sitewide `.btn` shape,
    same "this component gets its own rounder language" precedent as the
    room cards) — solid **"Check dates & book"** (calendar + arrow icons)
    straight to Nightsbridge (`https://book.nightsbridge.com/26870`, new
    tab, same link used sitewide — Nightsbridge doesn't take a per-room
    query param). There is **no "Enquire about this room" button** and no
    form for one to go to (see "Contact section"). Then a small
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
  - **`.roomlayout-aside` is capped at `max-width:440px` in that same
    stacked state**, and that cap is load-bearing rather than taste.
    Uncapped, the card took the whole column — **809px wide at an
    899px viewport, against the 340px it's designed as** — and it does
    not survive that: `.bookbox-head`'s `aspect-ratio:900/301` ties the
    wave photo's height to the card's width, so the banner grew from
    ~114px to 270px and dominated the page, while the `.bookbox-facts`
    rows (`justify-content:space-between`) stranded each label at the
    far left and its value at the far right with a void between. The
    crossover at 900/901px used to be a 340→809 jump and is now
    340→440. Desktop is untouched — the cap lives inside the
    `max-width:900px` block.

    Worth generalising: **`aspect-ratio` turns a width problem into a
    height problem.** Any component sized that way needs a width cap
    wherever it stops being width-constrained by its parent, because
    nothing else will stop it. Squashing the header's height instead is
    the tempting fix and it's the wrong one — it re-opens the
    `object-fit:cover` crop bug documented on `.bookbox-head` itself,
    where the wave line rides up through the "Plan your stay" subtitle.
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
  count, same as the homepage gallery's own `4n`/`4n+1` mosaic pattern
  does now (see "Gallery mosaic pattern" above; scoped to its own
  `.grid-gal-mosaic` modifier class on `#gallery`'s grid), rather than the
  flat `.grid-gal-uniform` modifier this replaced (removed, no longer used
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
independently. Changing a room's photo *count* means updating *all three*:
the card's `.room-img` `data-count` (and its initial `.room-carousel-count`
text, "1 / N") in `index.html`, the same pair in `rooms/index.html`, and the
full `<div class="grid-gal grid-gal-feature">` list in `rooms/<slug>.html`
(plus that page's `.hero-img` `src`/`alt` if photo #1 changed — it's the
room's hero banner now, not a small intro figure). The card's own `<img
src>` only ever needs to point at `1.<ext>` — the carousel derives every
other photo's path from that at click-time, it doesn't need a full list on
the card. There's no shared data source between any of these — the two
card instances and the one generator script that originally wrote them
(see below) all just happen to agree today because they were written from
the same data at the same time, not because anything enforces it going
forward.

- Photos live under `images/rooms/<slug>/1.webp, 2.webp, ...` — one folder
  per room type, numbered in display order, all WebP now. Current counts:
  `king-sofa` 9, `twin` 6, `family-unit` 11, `garden-double` 7,
  `self-catering` 7, `compact-single` 4.

  **`twin/1.webp` and `compact-single/1.webp` are below the 2000px
  convention.** Both were replaced Sept 2026 from owner-supplied `1.png`
  files capped at 1448px on the long edge, so both lost resolution:
  `twin` 2000×1500 → 1448×1086, `compact-single` 1500×2000 → 1086×1448.
  Encoded WebP q86 with **no resample** (already under 2000).

  **`compact-single` no longer uses `1.webp` for its hero** (see "Compact
  room's banner is an exception" just below), so for that room the
  1086px limit only affects its two cards and the first gallery tile,
  which render small. `twin/1.webp` still drives the twin's hero, which is
  the demanding job: a **full-width hero banner**, where 1448px is
  upscaled on any wide or 2x screen. Same 1448px export ceiling as `hero-3.jpg` — it appears to be
  the owner's export setting, not the photos, so ask for a larger export
  rather than assuming it's the best available. **Don't "fix" it by
  upscaling**: that adds bytes and no detail. Both previous versions are
  in git if sharpness ever matters more than the new framing.

  q86 rather than the usual q82 precisely because they're
  resolution-starved: at 1:1 the two were indistinguishable on the twin
  photo, so the extra ~39KB buys encode headroom rather than visible
  quality. Don't generalise q86 to photos that aren't resolution-limited.

  **Replacing a photo #1 is never just the file.** Each is referenced
  four times with `width`/`height` attributes that must be updated with
  it (homepage card, rooms listing card, room page hero, room page
  gallery) — stale attributes reserve the wrong box and reintroduce the
  layout shift those attributes exist to prevent. (`compact-single`'s hero
  is the exception and is not one of these references — it uses
  `banner.webp`, below — so replacing its photo #1 touches only four.)

- **Compact room's banner is an exception (Sept 2026).** Its photo is
  **portrait**, and the hero is a short, wide box (`min-height:min(58svh,
  500px)`, so ~2.9:1 at 1440px). `object-fit:cover` on a portrait image
  there discards roughly 70% of the frame and upscales a 1086px file to
  the full width, which is what looked soft. So this one room's hero uses
  its **own landscape crop, `images/rooms/compact-single/banner.webp`**,
  and every other place (both room cards, the first gallery tile) still
  uses the portrait `1.webp`.
  - **Built from the 48MP original**, not from `1.webp`: the owner's
    `1.HEIC` (8064×6048, iPhone, no usable orientation tag, so it came
    through sideways and needed `rotate(-90)` before anything else),
    archived as `_originals/Room6/compact-single-1-original.HEIC`. Rotated
    to 6048×8064, cropped to a **2:1 band** starting 26% down (6048×3024),
    then resized **once** to **2880×1440** (Lanczos, from a lossless PNG,
    so no compounding passes) and saved WebP **q88**, 369KB. 2880 is
    exactly what a 1440px screen needs at 2x. Mean pixel error against the
    lossless resize is 1.2/255 in the busiest patch; at 1:1 the lattice,
    curtain print and lamp are indistinguishable.
  - **q88, not the usual q82**, because "keep the original quality" was
    the brief and it is one file. Don't generalise it.
  - **The 26% start was chosen by rendering, not by eye on the source.**
    Five positions (22/24/26/30/34%) were put in the real hero: 30% and
    34% lose the headboard, 22% leaves a half-cut wall plate behind the
    logo, and 26% keeps the whole headboard, both lamps and the patio door.
  - **`.hero-img--left{ object-position:30% center }` is only for narrow
    screens.** Wider than 2:1 the crop's whole width shows and only the
    vertical position matters (already set by the crop). Narrower — tablets
    and phones — `cover` trims the *sides*, and the bed sits left of this
    photo's centre: centred, a phone slices the headboard in half. 30% keeps
    the cushion, lamp and nightstand in frame. This class replaced
    `.hero-img--top{ object-position:center 42% }`, which was tuned to the
    old portrait crop and now has no users (deleted).
  - **If the banner is ever re-cropped, re-check at ~390 and ~768px wide**
    as well as desktop; the horizontal value is what breaks.
  - The room page's `og:image` still points at the portrait `1.webp`. A
    share preview is 1.91:1, so `banner.webp` would suit it better; left
    alone because it wasn't asked for.
- Slugs → room type: `king-sofa`, `twin`, `family-unit`, `garden-double`,
  `self-catering`, `compact-single` — **note the last one's guest-facing
  name is "Compact room", not "Compact single"** (renamed Sept 2026, owner's
  request, see "Copy the owner has corrected"). **Its page and URL were
  renamed too: `rooms/compact-room.html`, served at `/rooms/compact-room`**
  (owner: "it's still compact-single.html"). Only the *image folder*
  `images/rooms/compact-single/` — and so the `data-slug="compact-single"`
  on its two cards, which is how the carousel finds that folder — kept the
  old name, because it is never visible to a guest. Nothing was live at the
  old URL, so no redirect exists; if the site is ever deployed with
  `/rooms/compact-single` already indexed, add a 301. Matched to the six
  listed room types by asking the property owner to identify each `Room N` folder, not
  guessed from the photos.

  **The owner refers to rooms by `Room N`, not by slug**, so a request
  like "replace Room 1's photo" needs that mapping. Confirmed so far:
  - **`Room 1` = `twin`**
  - **`Room 4` = `garden-double`** (checked against a contact sheet, Sept
    2026, when its reshoot arrived: same aloe painting, same kitchenette)
  - **`Room 6` = `compact-single`**

  Both were confirmed Sept 2026 by rendering a contact sheet of all six
  live `1.*` photos and matching the dropped file against it by eye — the
  quickest reliable check, and worth repeating for the remaining four
  rather than guessing from the number. **Confirm before overwriting**:
  silently writing to the wrong room's folder is the failure mode here,
  and it looks exactly like success.
- Room pages live at `rooms/<slug>.html` **on disk** and are served at
  `/rooms/<slug>` (see "Clean URLs" below). They sit one level down from
  the site root, so every internal reference on them is `../`-prefixed
  (`../styles.css`, `../images/...`, `../`, `../script.js`) — except links
  to the rooms listing page or another room page, which are siblings and
  are written `./` (the listing) and `<slug>` (a room), with no extension.

### Rooms listing page (`rooms/index.html`)

A dedicated rooms index, separate from both the homepage's `#rooms` section
and the individual `rooms/<slug>.html` pages — added so the header/footer
**"Rooms" nav link** could point somewhere more room-focused than an anchor
scroll. On `index.html` and every `rooms/*.html` page, `<a href="...">Rooms
</a>` now points here (`rooms/` from the root, `./` from inside `rooms/`)
instead of `#rooms`. The homepage's own `#rooms`
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

### Clean URLs — no `.html` in any link (Sept 2026)

Every internal link, canonical, `og:url`, JSON-LD `url`, sitemap `<loc>` and
is written **without `.html`**: `/rooms/twin`, not
`/rooms/twin.html`. The files on disk keep their names — only the URLs
changed. Shapes to use:

| Target | From the root | From `rooms/` |
|---|---|---|
| Home | `./` | `../` |
| Home section | `#contact` | `../#contact` |
| Rooms listing | `rooms/` | `./` |
| A room | `rooms/twin` | `twin` |

**The listing is `rooms/` with a trailing slash, never `rooms`.** Relative
links resolve against the *directory* of the current URL, so `/rooms`
(no slash) would make `../styles.css` resolve one level too high.

**A server has to make these URLs work, and `.htaccess` (repo root) does it
for Apache/cPanel.** Netlify, Cloudflare Pages and GitHub Pages serve
`/foo` from `foo.html` on their own and ignore that file; nginx needs
`try_files $uri $uri.html $uri/ =404;`. What it does, all verified against
a real Apache 2.4 with `mod_rewrite` (28 URL cases, redirect chains, and a
browser click-through of 33 navigation checks at 1440 and 390):
- `/rooms/twin` is served from `rooms/twin.html`.
- `/rooms/twin.html`, `/index.html` and `/rooms/index.html` 301 to
  `/rooms/twin`, `/` and `/rooms/` in **one hop**, so every page has one URL.
  Query strings survive (`/index.html?room=x` → `/?room=x`).
- Unknown URLs are a real 404.

**Three things that will bite:**
1. **`.htaccess` is a hidden file.** Finder drag-and-drop, many FTP clients
   and cPanel's File Manager skip dotfiles by default. If it doesn't
   arrive, **every link except the homepage 404s.** After deploying,
   open `/rooms/twin` first.
2. **It replaces WordPress's `.htaccess`** if this is deployed over the old
   site in `public_html`. WordPress's rules send every request to
   `index.php`, which will not exist.
3. **The trailing-slash guard in rule 3 (`^(.*[^/])$`) is load-bearing.**
   The first version was `^(.+)$` and returned a **500** for any page with a
   trailing slash, e.g. `/rooms/twin/`: Apache resolves that as the file
   `rooms/twin` with a path-info of `/`, the `.html` existence check passes,
   the URL is rewritten to `rooms/twin/.html`, resolves the same way, and loops until
   Apache stops at 10 internal redirects. Nothing looked wrong on the
   URLs people normally use, so it only showed up by testing the
   trailing-slash variants. If the rules are ever edited, re-test those.

**Local preview:** `python3 -m http.server` does **not** map `/foo` to
`foo.html`, so every link except the homepage 404s under it, and opening the
files straight from disk (`file://`) can't work at all. Use any server with
clean-URL support (e.g. `npx serve`, or Netlify/Cloudflare's dev server).

### Header nav

Order: **Home / Rooms / Around us / Gallery / Get in touch / Find us**,
then a "Book Now" button. It follows the homepage's own section order, so
an anchor nav doesn't jump around relative to the page.

**The phone number is gone from the header** (Sept 2026, owner's
request) — `.head-tel` and its mobile `display:none` override were
deleted from styles.css too, not left as dead rules. The number still
appears in the `#contact` section's contact card, the footer and the
JSON-LD.

**"Get in touch" → `#contact` was added in its place**, matching the
wording the footer and room pages already used for that section. Like
everything else in this header, it is **hand-written on all 9 pages**
(index + the 8 under `rooms/`) with no shared source — and the path
differs by location: `#contact` on index.html, `../#contact`
everywhere under `rooms/`.

**Watch the width when adding another item.** Per the note on the
1024px breakpoint below, this nav is tight: at 1025px (the narrowest
desktop width) there is about 31px between the last link and the "Book
Now" button, and a link wrapping mid-word makes the header grow into the
hero. Removing the phone number roughly paid for this new link, so the
budget is no better than it was. Measure at 1025px, not just at 1440px.

**Editing gotcha:** the header nav and the footer nav contain the same
`Gallery` / `Find us` links at the same indentation, so a plain
find-and-replace hits both. Scope any edit to the slice between
`<nav class="nav" id="nav"` and its closing `</nav>`.

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

## Contact section (`#contact`) — there is no form

**The callback form was scrapped for good (Sept 2026, owner's request —
"we won't need it").** It had been hidden since earlier that month and was
kept commented-out for restoring; that is now all gone: the `<form>` and its
commented-out "Request a callback" heading/lede in `index.html`, the form's
CSS (`.cb-form`, `.f-row`, `.field*`, `.opt`, `.honey`, `.btn-block`), the
`#f-room` / `#f-in` / `#f-out` logic in `script.js`, and **`thanks.html`**,
its success page. Contact is phone, WhatsApp or email only. **Don't
reinstate any of it without asking**; git history has all of it if that is
ever wanted, but note it posted to FormSubmit, which was never activated
(that needs a one-time email confirmation), so it never actually delivered
anything.

**The section's id was renamed `callback` → `contact`** (Sept 2026, owner's
request). For a while after the form was scrapped it deliberately kept
`id="callback"` even though nothing was called back any more — the nav,
every footer and every room page link to it, and renaming meant touching
all 9 pages for no visible gain, so it was left alone as churn nobody had
asked for. The owner then asked for it anyway, so it's `id="contact"` now,
and all 9 pages' `href="#contact"` / `href="../#contact"` were updated with
it. **If this file still says `#callback` anywhere else, that's stale** —
the id and every link to it were changed in one pass, nothing was meant to
be left half-migrated.

`.cb-intro` (the contact cards + "Good to know" facts) is the section's only
content. The contact list and the facts (a `<ul class="cb-direct">` and a
`<div>` wrapping the `cb-gk` heading + facts list, both inside a `.cb-cols`
wrapper) sit **side by side** as a two-column grid.

**`cb--solo` no longer exists.** That modifier meant "the form is hidden, so
collapse to one column"; with the form gone for good it was folded into
`.cb` itself (single column, `.cb .cb-intro`, `.cb .cb-cols`, …) rather than
left as a modifier for something that isn't there. Verified layout-neutral:
every element's rect compared before and after at 11 widths from 360 to
1920px, 165 rects, zero differences. **A lesson from doing that check:** the
first "after" run showed a ~300px difference at desktop, which was not the
layout — it was Chrome reusing a cached `styles.css` against the new
markup. A geometry snapshot must disable the cache
(`Network.setCacheDisabled`) or it measures a stylesheet from the past.

**Two bugs were found in this grid (Sept 2026) and both are easy to
reintroduce:**
- Its tracks are `minmax(0,1fr)`, **not** a bare `1fr`. A grid item's
  default `min-width` is `auto`, which honours its content's min-content
  width — the phone numbers in `.cb-direct` and the `dt`/`dd` rows in
  `.facts` couldn't shrink, so the tracks blew the grid (and the whole
  page) past the viewport into **horizontal scroll on phones**, ~507px
  of content in a 390px viewport. Exactly the same gotcha already
  documented for `.roomlayout`'s mobile rule; see "Room cards" above.
  The page had no other horizontal-overflow source, so this made every
  page on a phone scroll sideways — worth re-checking `scrollWidth`
  against the viewport after any grid change, since nothing about the
  section itself looks wrong on desktop.
- It stacks below **760px** (two blocks at ~170px each is not a layout),
  and **that media query has to sit after the `.cb-gk` / `.cb-direct`
  margin rules in the file, not next to the `.cb-cols` grid declaration
  where it logically belongs.** Those rules are equally specific, so at
  equal specificity the later one wins regardless of the media query —
  placing the query first left "Good to know" jammed against the contact
  row above it, still carrying the `margin-top:0` that only makes sense
  in the side-by-side layout.

The heading and lede read "Get in touch" / "Phone, WhatsApp or email us…".
They were reworded from "Request a callback" / "Leave your details and…"
because the original explicitly promised a form. The nav and footer links
that point at this section were reworded to "Get in touch" to match, on 9
live lines across 8 files.

**The section was rebuilt to an owner-supplied mockup (Sept 2026)** and
is now the most componentised part of the homepage:
- **`.cb-card`** — each contact method is a bordered, rounded pill
  containing a circular icon badge, a small uppercase label, the value in
  serif, and a trailing arrow. The `<a>` fills the card, so the whole
  pill is the hit target rather than just the number. Link text reads
  "Phone / 041 583 3190" in DOM order, so the label is genuinely useful
  to a screen reader — only the icon and arrow are `aria-hidden`.
- **`.cb-facts`** — "Good to know" keeps the sitewide `.facts` dl but
  adds a circular icon badge inside each `dt` and an uppercase label.
  The badges reuse the exact `rgba(28,58,49,.08)` circle treatment
  already used by `.dist-icon` and `.bookbox-icon`.
- **The column divider is a `border-left` on `.cb-col--facts`**, not a
  separate element, so it stretches to whichever column is taller.
  Below 760px the columns stack and that border has to be removed — a
  left border on a full-width block draws a stray vertical line down the
  page.
- **`.cb-signoff`** — "We look forward to hearing from you", a
  rule-flanked script line (same construction as `.dist-more`, but
  centred rather than trailing, so it reads as a sign-off for the whole
  section).
- **`.cb-card-value--sm`** (the email) is `clamp(.84rem,3.3vw,--t-0)`,
  fluid rather than fixed. At a fixed size the address wrapped
  mid-string on phones ("…co.z / a"), which reads as a typo rather than
  a line break. Verified one line from 360px up; 320px wraps to two but
  without overflow. `overflow-wrap:anywhere` stays as a last-resort
  guard if the address ever changes.
- **`.cb-band` halves the section's bottom padding**
  (`clamp(40px,5vw,70px)` against `--band`'s 64–124px). The sign-off
  already sits a long way down, so a full `--band` underneath it as well
  left a visible slab of empty colour. Top padding stays `--band` so the
  section still opens in the same rhythm as every other one — the
  asymmetry is deliberate.

**The section is left-aligned, not centred.** `.cb .cb-intro` has
`margin:0` (it was `margin:0 auto`), at the owner's request — it now
starts at the same gutter as every other section heading instead of
floating as a centred block. The `max-width:800px` stays: without it the
contact list and facts stretch the full shell and the two-column pairing
below them falls apart.

## "What's around us" section

Redesigned (Sept 2026) from a dark `.band-deep` band to a light `.band-
paper` one, against an owner-supplied mockup. `.band-deep`/`.sec-head-
light` stay defined in styles.css (small, harmless) in case a future dark
band wants them, but nothing on the site uses either any more — grep
before assuming they're dead weight worth deleting, in case that's
changed by the time this is read.

- **`.around-photo` bleeds to the viewport's right edge and is flush
  with the top of the band.** This has been through four shapes, each
  one owner-approved at the time, so check the current state before
  assuming any given value is a considered choice rather than a
  leftover:
  1. a `.around-top` grid column contained inside `.shell`;
  2. full-bleed right (`right:0`, `width:min(62vw,1400px)`,
     `top:var(--band)`), from a second mockup;
  3. pulled back off the bleed — `left:50%` and a right edge level with
     `.shell`'s margin — plus `top:0` and less padding above the
     eyebrow, from a screenshot markup ("in line with the right margin
     of the section, not all the way to the end of the page");
  4. **current**: back to full-bleed right at the owner's request ("the
     picture can go to the edge of the page"), keeping #3's `top:0` and
     reduced padding, and with the wave redrawn to clone a new mockup
     (see the clip-path entry below — that redraw is the substantive
     part of this change, not the bleed).

  Note #3 → #4 reversed #2 → #3 on the bleed specifically. The owner
  changed their mind after seeing both; neither is "wrong", so don't
  treat the current one as settled law either.

  Structurally it's a **sibling of `.shell`**, not a grid item inside it
  — `<section class="around">` → `<figure class="around-photo">` then
  `<div class="shell">`. Two independent reasons, both load-bearing: it
  has to escape `.shell`'s width cap to reach the viewport edge, and it
  has to sit *above* `.shell`'s own top padding, which a child of
  `.shell` structurally cannot do.
  - **`top:0`** puts the photo level with the band's colour boundary.
    An absolutely positioned element's `top` ignores its container's
    padding entirely, which is exactly what's wanted — the photo starts
    at the section's edge while the text below still gets normal
    padding.
  - **`left:max(38%, calc((100% - var(--maxw)) / 2 + var(--maxw) * 0.38))`**
    is the only genuinely non-obvious value here — the `38%` is the
    brief's "roughly the right 60-65% of the section", but the `max()`
    around it is load-bearing. A bare `38%` keeps sliding right forever
    as the window grows while `.shell` stays capped at `--maxw` and
    centred, so the gap between the text column and the photo *shrinks*
    on wide screens — measured ~490px at 1440px down to ~310px at
    3000px, i.e. it gets worse exactly where there's most room. The
    `max()` pins the left edge to 38% of `.shell`'s own content box once
    `--maxw` kicks in (`(100% - --maxw)/2` is `.shell`'s left offset,
    plus 38% of its width), making the relationship constant above
    ~1330px. Below that `.shell` is gutter-bound rather than
    `--maxw`-bound, the first term underestimates, and the plain `38%`
    wins. **If this is ever simplified back to a bare percentage, the
    wide-screen regression comes straight back and is easy to miss,
    because it only shows above the width most people test at.**
  - **`.around`'s `padding-top` is halved** (`clamp(36px,4.5vw,62px)`,
    roughly half `--band`, same vw factor) — directly requested ("make
    the amount of white padding space above the 'Location' eyebrow
    less"), and it only works *because* of `top:0`: with the photo
    pinned above the padding, shrinking the padding pulls the text up
    without moving the photo.  The bottom keeps the standard `--band`.
  - **`.around-top .sec-head{min-height}` reserves vertical space for
    the photo** so `.around-grid` below can't collide with it. It needs
    to be at least (photo height − `.around`'s padding-top), and since
    the wave bottoms out at the very bottom of the photo's box (it runs
    off the right edge *as* the bottom edge, rather than tapering away
    to the left), the **full** height has to be cleared — an earlier
    version only reserved part of it, which was correct for the old
    taper-to-the-left wave and would overlap now. Hence its current
    shape, `clamp(140px, calc(16.5vw - 55px), 305px)`: the photo's own
    `16.5vw` less roughly the `4.5vw` padding above it. Deliberately a
    few px generous at every width rather than exact — over-reserving
    adds a little air, under-reserving overlaps. **Re-derive it whenever
    the photo's height clamp changes**, which, per the entry below, now
    happens whenever the clip path is retraced.

  The mobile breakpoint drops all of this back to a plain full-width
  block ahead of the text (`position:relative` — *not* `static`, see the
  callout below — `width:100%`, `top`/`left`/`right` all `auto`) and
  undoes the desktop-only compensations with it: `.around`'s
  `padding-top` goes to **0**, not `var(--band)`, so the photo stays flush
  with the colour boundary as on desktop. (It was `--band` — the "nothing
  is pinned above it any more" reasoning — and left a ~64px+ strip of
  empty paper above the photo that the owner flagged as a white gap,
  Sept 2026. The photo's own `margin-bottom` spaces the text below.) and
  `.sec-head` drops both `min-height` and `max-width`
  (nothing to reserve space under or stay clear of). DOM order alone
  (the `<figure>` comes before `<div class="shell">` in index.html) puts
  the photo above the text on mobile with no extra CSS.
- **Mobile gotcha: `.around-photo` needs `position:relative`, not
  `static`, even though it's back in normal document flow there.**
  `.around-photo-caption` is `position:absolute` against it — drop to
  `static` and the caption falls through to the next positioned ancestor
  up the tree instead (`.around{position:relative}`, the whole section),
  which relocated it to float in the empty cream space above the photo
  the first time this was tried, since the section's own top edge sits
  well above where the photo actually renders on mobile. Any similar
  photo-with-overlaid-caption pattern needs the same care: an element's
  positioned-ness (not just its top/left) matters to everything absolutely
  positioned against it.
- **The photo panel's wavy edge is a `clip-path:url(#aroundWave)`**,
  where `#aroundWave` is a `<clipPath clipPathUnits="objectBoundingBox">`
  defined inline in index.html at the top of the `<section>` (a
  `width="0" height="0"` SVG, so it renders nothing itself and only
  serves as a definition target). `objectBoundingBox` units (0–1 on both
  axes) are what let one hand-authored path scale to `.around-photo`'s
  actual rendered box at any viewport instead of needing a pixel-space
  path per breakpoint. The path is a full closed shape through the box's
  own corners, so the top and right edges render flush and only the
  left/bottom boundary curves.

  **The structural point, and what several versions of this got wrong:
  the curve does not taper away down the left edge and leave a straight
  bottom.** It sweeps down from the top-left corner and then *becomes*
  the photo's bottom edge, rolling — trough, crest, second trough — as
  it runs off the right edge of the page. That is what reads as water; a
  diagonal cut with a flat bottom reads as a torn corner. If this ever
  looks wrong again, check that structural property first, before
  touching control points.

  Three segments: the wave face down to the first and deepest **trough
  at (0.46,1)**; up to the **crest at (0.70,0.87)**; then into a second,
  shallower trough that **runs off the right edge at (1,0.945)** rather
  than resolving on screen — the water carries on past the page. The
  second swell is easy to miss and is most of what makes it read as
  moving water rather than a single scoop.

  **Two rules keep this smooth, and matching tangents is necessary but
  NOT sufficient** — this is the most useful thing in this section and
  it cost several rounds to learn:
  1. **Split segments only at the curve's own extrema.** At a trough or
     crest the tangent is horizontal on both sides, so the join is
     unambiguous and curvature is naturally near-symmetric across it. A
     join placed mid-curve is only tangent-continuous; curvature still
     jumps, and the eye reads that jump as a flat spot.
  2. **Match curvature across each join, not just tangent direction.** A
     version with *exactly* continuous tangents at every join still drew
     a complaint that it "isn't nicely rounded in some parts";
     measuring it showed a 130% curvature jump at one join and 57%/35%
     at others. Re-tuning to near-zero fixed it with no change to the
     overall shape. Current: 0% at both joins, with peak curvature
     varying only 1.5x across the whole path (0.59–0.87).

  A third, lesser rule: keep each segment's three control-polygon legs
  similar in length. A leg much shorter than its neighbours crams that
  segment's curvature into a tight bend at one end (one bad version had
  legs of 0.26 / 0.39 / 0.13, and the short leg is exactly where it
  pinched).

  **The clip path is only half the shape; `.around-photo`'s aspect ratio
  is the other half.** `objectBoundingBox` normalises to the box, so the
  path stretches with it — a squatter box visibly steepens the descent,
  and this was once the entire reason a correct path still didn't match
  the reference. Tuned at ~3.5:1, which is why the photo's `height`
  clamp holds roughly that across the desktop range rather than being
  picked to look good on its own. **Changing the height is changing the
  wave.**

  The clip is applied to the `<img>`, not to `.around-photo`:
  `.around-photo-caption` is a child of the same `<figure>`, so clipping
  the container would clip the caption too.

  **Revision history — a different failure mode each time.** All of
  these looked plausible as coordinates and only revealed themselves on
  screen, so check this in a browser, never against a mental model of
  the numbers:
  - v1: small in-out wobbles → read as a **scalloped** edge.
  - v2: a single sharp reversal → read as a **bulge/cove**.
  - v3: softened that reversal's amplitude.
  - v4: first control point pulled too far sideways out of the corner →
    top-left read as a **round scoop bitten out**, like a big
    border-radius rather than water.
  - v5: near-vertical exit from the corner, monotonic curvature. Clean,
    approved at the time, but a diagonal-with-flat-bottom.
  - v6: rolling-crest structure, but invented rather than traced, and
    paired with a 2.9:1 box that stretched it vertically.
  - v7: traced off the owner's reference + the aspect fix. Tangent-
    continuous everywhere and still looked lumpy — this is the one that
    produced rule 2 above.
  - v8: curvature-matched, then reworked into the two rolling swells.
  - v9: a full rebuild to a written brief the owner passed on (a large
    concave scoop in the upper left pulling back before the bottom wave,
    lowest point at 70%, photo 430–500px tall, plus separate tablet and
    mobile clip paths). **Built, reviewed and rejected — reverted to
    v8.** Worth knowing before re-proposing anything in that direction:
    the owner has now seen it rendered and did not want it. If it is
    ever revisited, the two non-obvious findings from building it were
    (a) making the scoop's maximum an actual anchor point forces a
    vertical tangent and a join at the tightest part of the curve, which
    measured 32.6 peak curvature and looked pinched — let the maximum
    fall inside one smooth cubic instead; and (b) at 430–500px the photo
    is tall enough that the `.sec-head` reservation below must grow with
    it or the photo runs straight through "Worth the drive".

  There's no build step generating any of this; edit the `d=` attribute
  directly in index.html.
- **`.around-photo`'s height is set with `height`, not `min-height`** —
  worth remembering, this one is a real gotcha, independent of the
  full-bleed rework above. With only a `min-height` on an otherwise-
  unconstrained box, a browser can fall back to the `<img>`'s own
  intrinsic aspect ratio for sizing purposes (`object-fit:cover` alone
  doesn't give the box an independent height) — with `aroundus.webp` at
  roughly 1.63:1, that made an early version of this panel balloon to
  ~395px tall against a ~646px-wide column, towering over the ~206px-tall
  text block beside it. The explicit `height:clamp(...)` sidesteps the
  image's own aspect ratio entirely and keeps the panel close to the text
  column's own height, matching the mockup's tighter proportions — this
  remains true now that the photo is absolutely positioned rather than a
  grid item, since `height:clamp(...)` is what both the desktop absolute
  box and the `.around-top .sec-head` spacer's `min-height` are tuned to
  match. The clamp is now `clamp(320px,30vw,480px)` — the ~430–500px the
  owner's written brief asked for, at desktop widths. It has been
  retuned five times, and the lesson from all five is the same: **this
  number is a function of the box's width and the clip path's tuned
  aspect, not of the text block's height.** Earlier values were picked
  by eye ("too tall", "too small", "reads smaller in a narrower box")
  and each one silently distorted the wave, because `objectBoundingBox`
  stretches the path to whatever aspect the box ends up with. Check the
  measured aspect against the path's tuned aspect, not whether the
  height "looks right" on its own.

  **When the height changes, `.around-top .sec-head`'s `min-height` must
  change with it** — it reserves the vertical space that keeps
  `.around-grid` from colliding with the photo. That reservation used to
  be a third hand-tuned clamp approximating "photo height minus section
  padding", and when the photo grew from ~264px to ~432px it silently
  under-reserved and the photo ran straight through the "Worth the
  drive" heading below it. It now restates the photo's height clamp and
  the section's padding-top clamp verbatim and subtracts them
  (`calc(clamp(...) - clamp(...) + 8px)`), so it tracks both
  automatically. **Keep those two clamps identical to the real ones.**

- **`images/aroundus.webp` is the real photo** (Sept 2026, owner-supplied
  — Ironman cyclists on the coast road, matching the section's own
  Ironman-focused lede copy). Source: `images/aroundus.jpg`, kept as the
  archival original, same WebP pipeline as everything else (long edge
  under 2000px already, so no resize needed, just quality-82 re-encode).
  This replaced a Pillow-generated green-gradient placeholder that
  briefly lived at `images/around.jpg` (deleted once the real photo
  arrived, not kept — nothing else referenced that filename). If this
  photo ever needs replacing, keep it landscape-ish — `object-fit:cover`
  on `.around-photo-img` means a portrait source would get cropped hard —
  and re-check the `height:clamp(...)` above still reads correctly, since
  that's tuned against this specific photo's crop, not derived from it.
- **The photo caption is owner-supplied lettering ARTWORK, not live
  text** — `images/adventuretext.webp`, white-on-transparent, with the
  wording, the two-line stagger, the tilt and the underline swoosh all
  baked into the image. It sits in the `<figcaption>` as a plain `<img>`
  whose `alt` carries the wording ("Adventure is close by"), since the
  image *is* the text.

  This replaced a live-text version (Sacramento, two staggered `<span>`s,
  an inline-SVG underline, `transform:rotate(-4deg)`) which the owner
  had iterated on several times. The reason for the swap: their
  reference used a heavier brush script than Sacramento, and matching it
  as live text meant adding a fourth font family to a site that already
  loads three. Supplying the artwork sidesteps that. **The old text
  rules (`.around-photo-caption-line`, `.around-photo-squiggle`) were
  deleted rather than left behind** — git history has them if it ever
  goes back to live text.

  Consequences worth knowing:
  - **`--script` is still live** — `.dist-more` ("More to explore") in
    this same section uses it. Don't assume the token or the Google
    Fonts `family=Sacramento` param is dead weight now.
  - The caption is sized by **width** (`min(30%, 300px)` of the photo)
    with `height:auto`, and positioned in **percentages** rather than
    `em` — it no longer has a font-size to key off. Checked to sit
    inside the photo at 390/620/950/1100/1440/1920/2560.
  - It carries `filter:drop-shadow(...)`, **not `box-shadow`**. The
    artwork is transparent apart from the strokes, so `box-shadow` would
    draw a rectangle around the whole image box; `drop-shadow` follows
    the letterforms. It does the same job the live version's
    `text-shadow` did — the photo behind it is bright in places.

  **Processing note, and a real gotcha for any similar artwork:** the
  source `images/adventuretext.png` (kept as the archival original, same
  as `aroundus.jpg`) had **black RGB under its fully-transparent
  pixels**. Encoding that straight to lossy WebP bleeds the black into
  the white strokes through the YUV conversion and leaves a grey fringe
  — the same failure mode already documented for `bookbox-wave.webp`,
  arriving by a different route. It was flooded with white first and the
  original alpha reattached. It's also saved **lossless** (`lossless=True`,
  not the usual `quality=82`): for flat line art the lossless file came
  out only ~6% larger (166KB vs 157KB) and has no edge artefacts at all,
  so the usual lossy trade-off doesn't apply here. It was trimmed to its
  alpha bounding box (plus 6px) so the CSS sizing isn't padding-
  dependent — 1665x889, aspect 1.873.

- **`.around-top .sec-head`'s width is DERIVED from `.around-grid`, not
  eyeballed** — `calc((100% - var(--around-gap)) * .45)`, which
  reproduces that grid's left column (`.9fr` of `.9fr 1.1fr`, i.e.
  0.9/2.0 = 45% of what's left after the gap). The owner asked for the
  lede to "span the same width as the Close by section", and this makes
  it exact at every viewport rather than approximately right at one —
  verified identical to the pixel at 950/1100/1280/1440/1600/1920/2560.

  `--around-gap` exists as a variable purely so the grid and this
  calculation can't drift apart. **If `.around-grid`'s tracks ever
  change from `.9fr 1.1fr`, the `.45` here has to change with them** —
  that's one decision expressed in two places, which is the unavoidable
  cost of the lede not being a grid item itself.

  This *also* has to keep the lede clear of `.around-photo`, which is
  absolutely positioned and which nothing here accounts for
  automatically (`.lede`'s own sitewide `max-width:60ch` is wide enough
  to run clean underneath it — that was the original bug this cap was
  added for, before it became a width match). The column width happens
  to clear the photo comfortably everywhere checked (121–180px of
  slack), **but that is a verified coincidence, not something the
  formula guarantees.** Re-measure against the clip boundary if the
  photo's `left`, height or clip path changes. Previous values, for
  reference: `460px` → `min(460px,32vw)` → `min(540px,37vw)` → the
  current derived form; every one of those needed re-measuring when the
  photo moved.

  Below 900px the mobile block sets `max-width:none` — the layout is
  stacked single-column there, so matching a "column" is meaningless and
  `.lede`'s own 60ch measure takes over. That's why the lede is
  deliberately *narrower* than the full column at tablet widths (677px
  vs 738px at 820px): 60ch is a readability guard, not a mismatch to
  fix.

- **`.around-top .lede` is `1.1875rem`, off the type scale on purpose.**
  The owner asked for "a little bit smaller" than the sitewide `.lede`
  (`--t-1`, 1.3125rem). The next step down the scale, `--t-0`
  (1.0625rem), is plain body size and loses the lede's role as an
  intro, so this sits between the two. If the scale itself is ever
  revised, this is a deliberate exception, not an oversight.

- **`.around-top`'s `margin-bottom` is small on purpose**
  (`clamp(10px,1.2vw,18px)`, down from `clamp(16px,2vw,28px)`) — the
  owner asked for "Close by" and "Worth the drive" to come up. Most of
  that lift actually came from the lede getting wider and smaller (fewer,
  shorter lines), since at mid widths the text block's own height is
  what pushes the grid down, not the reservation. **Above ~1600px the
  reservation IS the floor** and the grid sits as high as it safely can
  (26px below the photo: 8px of built-in air plus this margin). Don't
  shrink the reservation to gain more — that's what keeps the photo off
  "Worth the drive".

- **The "Close by" list icons are hand-drawn line icons** (beach
  umbrella, airplane, graduation cap, flag, elephant), same stroke
  conventions as the rest of the site's inline SVGs
  (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width` ~1.6,
  round caps/joins, no fill) sized down inside a `.dist-icon` circle
  badge that reuses the exact same treatment as `.bookbox-icon` on the
  room detail pages (`rgba(28,58,49,.08)` circle, `--ink` icon colour).
  **They render at 18px** — that, not the 24-unit viewBox, is the size
  every decision here has to be judged at.

  **The elephant has been through three versions and the airport two**,
  and the arc of both is the same lesson, so don't re-litigate it:
  - Elephant v1 followed real anatomy (ear/head/trunk/legs/eye) and was
    illegible noise at 18px. v2 cut it to two strokes (one arc for
    head+ear, one curl for the trunk) — legible, but the owner read it
    as an abstract hook rather than an animal, which is the failure
    mode on the other side of the same trade-off. **v3 (current)** is a
    front-facing head: two ear arcs, a closed head shape, and a trunk
    hanging from the centre drawn at `stroke-width:2.4` against the
    outline's 1.6. Front-on wins because it's symmetric — a side view
    needs legs and a body to read as an elephant, and neither survives
    18px. The ears are deliberately oversized relative to the head:
    **the ears are the whole tell**, so they get the space.
  - Airport v1 was the generic paper-plane/"send" glyph, which reads as
    email far more often than as flight. **v2 (current)** is a top-down
    airplane silhouette drawn as an outline at the set's own 1.6 stroke.
  - **Tusks and eyes were both built and rejected.** They test fine
    large and turn to smudge at 18px — exactly what happened to
    elephant v1. Same for the chunkier `stroke-width:1.8` plane and a
    filled (rather than outlined) one: both legible, but heavier than
    the four icons they sit beside, so the set stopped looking like a
    set.

  **How to judge a replacement: render it at 18px in the circle badge
  and look at it.** All of the rejected versions above looked correct
  as coordinates and correct at large sizes — every one of them was
  only caught on screen at real size, next to the other four icons.
  There's a throwaway harness pattern for this worth rebuilding:
  a page showing each candidate at 18px, at ~58px, and dropped into a
  real `.dist` row, all at once.
- **The chevron next to each "Close by" row's distance is decorative** —
  the `<li>`s aren't links (no confirmed destination URL exists for "the
  beachfront" or "golf courses and sports stadiums" as a single place),
  and it would be inventing an unverified link to make them one just to
  match the chevron's own affordance.

  **There are now no links at all in this section.** A small
  `.trips-explore` link ("Explore the area" → `#contact`) used to sit
  opposite the "Worth the drive" heading; it was **removed Sept 2026 at
  the owner's request** and its CSS deleted with it. Don't reinstate it
  — and if something like it is ever wanted again, note that the reason
  it pointed at `#contact` was that this site has no area-guide page to
  link to, so the same problem comes back with it.
- **The chips pills are filled-on-light** (`background:var(--chalk)`, no
  border), changed from outline-on-dark when the band went light. Same
  `.chips`/`.chips-group`/`.chips-group-label` markup and grouping (main
  "Worth the drive" list, then "Beaches & watersports", then "Trails &
  biking").

  **Roughly half the chips are real external links and half are plain
  place names** — 11 and 10 respectively. That difference used to be
  invisible until you hovered, which gave nobody a reason to hover in
  the first place. Linked chips now carry a **small outbound arrow** and
  slightly stronger text colour, so it reads at rest, and the whole pill
  fills `--ink` on hover/focus.
  - The arrow is a masked pseudo-element (`.chips a::after`, an inline
    SVG data-URI behind `mask`), not an `<svg>` per link — it inherits
    `currentColor` that way and keeps 11 SVGs out of the markup.
  - It's a **bare diagonal arrow, not the usual box-with-arrow outbound
    glyph**: at this size the box collapses into noise. Same lesson as
    the `.dist-icon` elephant — under ~20px, drop detail rather than
    shrink it.
  - Sized `.85em` (≈11px rendered). It was first set at `.66em` (≈9px)
    and the owner called it slightly too small, so don't shrink it back
    for tidiness — it's sized to be legible, not to match the text's
    optical weight. Pill heights are unaffected either way (30px), since
    the line-height governs them.
  - `.chips li:has(a)` hands its padding to the `<a>` so the **whole
    pill is the hit target**, not just the words. No fallback is needed:
    without `:has()` the `<li>` simply keeps its own padding and the
    chip still works, just with a smaller hit area.
  - `.chips-group + .chips-group-label` has `margin-top:2.4em` against
    the chips' own `.85em`. The two used to be near-equal (1.6em vs
    1.4em), which made each label read as a trailing caption on the
    group *above* it rather than a heading for the one below.

## "Welcome" section (#stay)

Rebuilt Sept 2026 to an owner-supplied mockup. Order in the text column:
eyebrow → heading → **wave flourish** → **uppercase subtitle** → three
body paragraphs → **4-up icon fact row** → **script sign-off**. The photo
column (`.split-fig`) was untouched, except that on mobile (≤900px) its
photo is a 16:10 window onto the 3:4 portrait, so `object-position` there is
`center 8%` rather than centred. The owner steered it by eye:
60%, 72% (deckchair, pot and paving, little creeper), then "much higher" —
8%, the full creeper in flower with sky above. **"Lower"/"higher" meant
where the window sits on the photo** (0% top, 100% bottom), not the picture
moving in its frame; it was read the wrong way round twice (42%, then 22%)
before that was clear. If it is asked again, confirm which way rather than guessing.

**The mockup had a solid "Book Your Stay" button on the sign-off row and
the owner asked for it to be left out.** Don't add a CTA back here without
asking — the hero's "Check availability" and the header's "Book Now"
already cover that intent higher up the page. A `<!-- -->` note sits where
it would have gone.

- **`.welcome-facts` replaced a `<dl class="facts">`, and is a `<ul>` on
  purpose.** The mockup drops the labels ("Grading", "Breakfast",
  "Parking", "Internet") and leads with the value, so "3-star / Bed &
  breakfast" is one phrase in two weights rather than a term and its
  definition. `.facts` is **not** dead — still 12 uses elsewhere
  (`.cb-facts`, `rooms/index.html`'s `.guide`), so don't delete its rules.
- Four columns above 620px, 2×2 below. The `@media` block **must stay
  after** the `li:first-child` border reset: both selectors are
  `(0,2,1)`-specific, and at equal specificity the later rule wins
  regardless of the media query. That exact trap already bit `.cb-gk`
  once (see "Contact section"). In the 2-column state the reset moves to
  `li:nth-child(odd)`, so the border clears on the first cell of *every*
  row rather than only the very first.
- **The bed icon here is NOT the room-card `.spec` bed.** That one reads
  fine at 15px beside the words "1 king bed", but alone in a 44px badge
  at 21px it reads as a **flag** — its pillow rectangle and mattress box
  merge into a bracket-and-pole shape. Redrawn as headboard post +
  pillow + mattress curving down to the foot. Four candidates were
  rendered at 21px in the real badge next to the cup/car/Wi-Fi icons
  before picking; that harness is the one described under "Close by"
  icons, and it is the only way this kind of failure shows up. The cup,
  car and Wi-Fi icons ARE reused verbatim (from `.cb-facts` and the
  amenities ribbon) and all three survive the size fine.
- **`.welcome-sub` is deliberately not `.eyebrow`.** `.eyebrow` is the
  small label *above* a heading and is reused on all six room cards and
  the chips-group labels; giving it a second, larger role below a heading
  would mean any future change to it silently hit those too.
- **The heading is scaled up from the sitewide `.h-sec`**
  (`clamp(2.15rem,4.95vw,3.55rem)` against `1.9rem/4.2vw/3rem`) so its
  lines come out the same width as `.welcome-sub` below it, which the
  owner asked for: at the top of the clamp "On The Bay" is ~253px
  against the subtitle's 252px. **The two can only match at desktop** —
  `.welcome-sub` is a fixed rem size with fixed letter-spacing, so it is
  252px at *every* viewport, while the heading scales with its clamp. At
  390px the heading lines are ~153px and the subtitle is still 252px.
  Matching there too would need either a ~57px heading on a 350px column
  or a subtitle too small to read, so it was left.
- **The two-line break ("Welcome to / On The Bay") is made by the markup**:
  `<h2 class="h-sec"><span>Welcome to</span> <span>On The Bay</span></h2>`
  with `.split-text .h-sec span{display:block;white-space:nowrap}`. It is
  most of what gives the wave flourish below it the right proportion.
  **It used to be `max-width:8.5ch` and that was wrong on a real phone**
  (owner screenshot, Sept 2026: "Welcome / to On The / Bay"). 8.5ch sat in
  a measured window between "Welcome to" (7.41ch) and "Welcome to On"
  (9.69ch) and was verified at 360–1920px in headless Chrome — but `ch` is
  the width of a "0", and how a "0" compares with the letters shifts with
  the font actually rendered (fallback while Fraunces loads, optical-size
  handling, Safari), so the window moved and closed on that device. A cap
  that tight is a bet on font metrics. Explicit lines aren't: each is
  ~175px at the smallest size against a ~320px column, so `nowrap` has ~2x
  headroom. **Lesson: don't force a line break with a `ch`-measured window
  in Chrome and call it verified across devices.** If the wording changes,
  the spans change with it; nothing needs re-measuring.
- **All three Welcome paragraphs are plain `<p>`s — the first is NOT a
  `.lede`** (owner, Sept 2026: "all this text the same styling and size").
  It was `class="lede"` with a `.split-text .lede{font-size:1.15rem}`
  override, which made it visibly bigger, taller-leaded and narrower
  (60ch vs 66ch) than the two below it. Both the class and that rule are
  gone. Don't restore a lede here; if one is wanted, it's a design change.
- **`.welcome-signoff` needs `max-width:none`.** It's a `<p>`, and the
  base `p` rule caps every paragraph at 66ch, which would stop its
  trailing rule short of the column edge. It is the third near-identical
  rule-flanked script line on the site (`.dist-more` trails right,
  `.cb-signoff` is centred and flanked both sides); they're kept separate
  rather than folded into a utility because each is tuned to its own
  section's size and spacing.

## Section background colours

The homepage alternates strictly, top to bottom: hero, then
**paper / linen / paper / linen / paper / linen**, then the dark footer.
`#stay` paper, `#rooms` linen, `#around` paper, `#gallery` linen,
`#contact` paper, `#find` linen. Keep it alternating if a section is
ever added or reordered — two same-coloured bands in a row have no
visible seam *and* double their `padding-block` where they meet (the
mistake already documented for `rooms/index.html`'s intro).

**`--chalk` is warm linen `#F1ECE1`.** Two things made the value before
it (`#EFF2EA`, a cool grey-green) weak, both measurable rather than
matters of taste: every other accent on the site is warm (`--rose` gold,
`--sand`, `--rose-tint`), so the cool grey-green was the single cold
note; and it sat almost exactly level with `--rose-tint` in luminance
(ΔL 0.016), so that seam barely registered. `#F1ECE1` separates from
both neighbours (ΔL 0.101 from `--paper`, 0.021 from `--rose-tint`) and
keeps **10.49:1** contrast for `--ink` text.

**Four replacements were tried in one sitting (Sept 2026) and all four
were reverted back to this.** Worth reading before proposing a fifth —
each failed for a different, reusable reason:

| Tried | Why it went |
|---|---|
| `#CED8E8` | hue **217°** — the periwinkle end of blue; reads lavender, not ocean |
| `#E2EFF3` | a correct soft ocean blue (hue 194°, between true blue and the site's `--sea` at 176°); dropped when the brief changed to yellow |
| `#F5ECBC` | hue **51°** — the green side of yellow; "too lemony" |
| `#FCE8AC` | hue 45°, the owner's own `#FEE18A` softened; correct to the brief, but the owner preferred the original linen |

The transferable parts:
- **Judge a candidate by hue first.** For a yellow here, `--rose` (the
  B&B's gold) is 42° and reads as the reference point: past ~48° goes
  lemon, under ~40° goes orange. For a blue, past ~205° goes violet.
- **A yellow `--chalk` adds a constraint a neutral one doesn't have:**
  `.btn` / "Book Now" is `--rose` gold, so a gold button on a chalk band
  is then separated by lightness alone. `#FCE8AC` kept ΔL 0.177 there.
- **`rooms/index.html` stacks `.band-chalk` directly on `.band-rose`, so
  check that seam by RENDERING it, never by comparing luminance.** The
  blue values sat ΔL 0.018 from `--rose-tint` — which the paragraph
  above would call invisible — and the seam read perfectly well, because
  cool-meets-warm is a hue boundary. A same-hue yellow has no such
  escape route, and two of the yellow candidates genuinely did fade out
  there.

**`--chalk` is NOT only a background.** It is also:
- the light **text** colour on `.site-foot` and `.band-deep`;
- the fill of the `.chips` pills on the `#around` band;
- the `.nav-dropdown` hover/current background;
- the fill of the `.cb-card` contact cards.

All five were checked after the change. The name "chalk" is now a little
off for a warm linen — renaming it (and `.band-chalk`, which appears in
three markup files) was deliberately left alone as churn the owner
didn't ask for, but it's the obvious tidy-up if this area is touched
again.

**`#contact` moved from `.band-rose` to `.band-paper` and `#find` from
`.band-paper` to `.band-chalk`** at the same time, which is what makes
the alternation above come out even. `.band-rose` is **not** dead —
`rooms/index.html`'s closing CTA still uses it. Knock-on: `.cb-card`'s
fill had been `rgba(255,255,255,.35)`, tuned against the warm rose band;
on `--paper` that is all but invisible, so the cards now take a solid
`--chalk` fill and brighten to white on hover. **Any component tuned
against a specific band colour needs re-checking when its section
moves** — a translucent white is the classic one to miss.

## Section eyebrows

Every section heading on the homepage opens with a small uppercase label
and a short trailing rule — `<p class="eyebrow eyebrow-rule">`. Current
labels: **The house** (`#stay`), **Accommodation** (`#rooms`),
**Location** (`#around`), **Gallery** (`#gallery`), **Contact**
(`#contact`), **Directions** (`#find`). The hero is deliberately left
out: its `.hero-place` ("Summerstrand, Gqeberha") already does the same
orienting job in the same position.

**`.eyebrow-rule` is a separate, opt-in class on top of `.eyebrow`, and
that separation matters.** `.eyebrow` is also used for smaller labels
that must stay plain — "Room type" on all six room cards, "About the
room" on the room detail pages, and the `.chips-group-label` headings
("Beaches & watersports", "Trails & biking"). Restyling `.eyebrow`
itself, or scoping the rule to something like `.sec-head .eyebrow`,
would put a trailing line inside every room card. Verified after the
change: 6 section eyebrows have the rule, and the 6 card labels + 2
chips labels do not.

Two of the six sections (`#stay`, `#contact`) have no `.sec-head`
wrapper — their heading sits directly in `.split-text` / `.cb-intro` —
which is the other reason the class is applied per-element rather than
inherited from a wrapper.

The rule's colour is `--line`, a *translucent* ink
(`rgba(28,58,49,.15)`), so it reads correctly on the paper, chalk and
rose-tint bands without a per-band variant. A dark band would need one;
nothing uses `.band-deep` any more, but that's the trap if it returns.

**Not added to `rooms/index.html` or the room detail pages** — those
open with a breadcrumb, which already orients the reader in that
position, and the room pages' "About the room" eyebrow is a
content label rather than a section marker. Worth raising with the owner
rather than assuming either way.

## Fixed header and anchor links

The header is `position:fixed`, so any `#anchor` jump has to stop
`--head-h` short of the target or the section lands behind it. **One
token, `--head-h: 76px`, drives both `.head-inner`'s `min-height` and
`html`'s `scroll-padding-top`** — they must agree exactly, and keeping
them as one value is the whole point.

This was three independent hand-set numbers (a 76px header, 88px
desktop `scroll-padding-top`, 74px mobile) and every nav link landed
visibly off: **12px of the previous section showing through on
desktop, 2px of the target tucked under the header below 1024px.** The
mobile override is gone entirely — the header is the same height at
every width, so there was never a reason for a second value. If the
header's height changes, change `--head-h` and nothing else.

No extra breathing room is added on top of `--head-h` deliberately:
every target is a `.band` with its own `var(--band)` of top padding, so
landing the section edge flush under the header still leaves its
content clear.

**Anchors arriving from another page: FIXED (Sept 2026), and the cause
was not what this file previously said it was.**

Loading `/#contact` cold — what the footer links and every
room page's "Get in touch" do — used to land ~86px off, while in-page
nav clicks were exact. This file blamed lazy images and prescribed
giving them `width`/`height`. **That was wrong.** Every image now has
intrinsic dimensions and, measured immediately afterwards, the drift was
still exactly 86px.

The real cause is the **webfont swap**. The Google Fonts stylesheet loads
with `display=swap`, so first paint uses Georgia/Helvetica fallback
metrics, under which the hero measures **1000px tall against Fraunces and
Karla's 882px**. The browser computes the fragment scroll against the
taller layout and never recomputes, so everything below the hero slides
up 118px underneath the scroll position. Confirmed by blocking
`fonts.gstatic.com` at the network layer and measuring both states —
worth reusing, since it separates font-driven shift from image-driven
shift in one step, which guessing from a screenshot cannot.

The fix is in `script.js`: on a load that carries a fragment, re-apply
`scrollIntoView()` once `document.fonts.ready` resolves. Two details in
there are load-bearing:
- **It cancels on real user input** (`wheel`/`touchstart`/`keydown`/
  `pointerdown`), not on a scroll event. A scroll listener would also
  catch the browser's own fragment scroll and the correction itself, so
  it would cancel every time. Scrolling the page out from under someone
  who has started reading is worse than landing slightly off.
- **It suspends `scroll-behavior:smooth`** around the call. Left on, the
  correction animates several hundred px and reads as a glitch.

Verified flush (0px) for `#contact`/`#find`/`#rooms`/`#around`/
`#gallery` cold at 390/900/1440, **and** in-page clicks still flush at
390/1440 — check both, since this bug is exactly the kind that gets
"fixed" by breaking the other path. Do not pad `--head-h`.

**Still outstanding (cosmetic, not a bug):** that 118px hero shift is
real CLS whatever the anchor does. Properly fixing it means
`size-adjust`/`ascent-override` on a fallback `@font-face` so the
fallback occupies the same space, or `display=optional` at the cost of
first-time visitors seeing Georgia. Neither was done.

## Copy the owner has corrected — do not reinstate

Facts changed on the owner's say-so, against what the old site or their
public listings claim. An older source will still contradict these, so
treat this list as the authority rather than "fixing" the page back.

- **No braai, anywhere guest-facing** (Sept 2026). There is no shared
  braai or entertainment area, and the site must not say there is. A
  braai can be laid on by special request, but the owner does not want
  it advertised, because it sets an expectation they'd then have to
  carry. Removed from two places, and **both matter**: the
  Welcome paragraph in `index.html` (a `<!-- -->` note sits where it
  was) and the `"Braai facilities"` entry in the JSON-LD
  `amenityFeature` list. (A third, a placeholder in the callback form,
  went when the form was scrapped.) **Structured data is advertising**: it's how
  search engines surface an amenity, so a claim removed from the prose
  but left in the JSON-LD is still a live claim.
- **Room 6 is a "Compact room" with one double bed, and "single" is not
  mentioned for it** (Sept 2026). It was "Compact single" with a
  "Single or double bed" spec line; the owner said it is just a double bed
  and asked for the word to go. Changed in **33 places over 8 pages**: the
  spec lines (now "1 double bed", matching garden-double's wording), the
  name in titles, headings, breadcrumbs, both card sets, the Rooms
  dropdown on every page, the "other rooms" pills, and every alt text and
  carousel `aria-label`. **Do not "fix" it back from Nightsbridge or the old
  site**, both of which will still say "Compact single". The URL slug
  `compact-single` survives only as the image folder / carousel `data-slug`
  (see the slug note above); the page itself is `compact-room`.
  The Twin room's "single" (it genuinely has single beds) is unrelated and
  correct.
- **Activities are arranged, not just suggested.** The `#around` lede
  reads "we arrange activities for guests on request — safaris, sea
  trips, scuba diving and other outdoor adventures." It previously
  hedged ("happy to advise on or arrange"); the owner confirmed they
  genuinely arrange these, so the hedge went.
- **Breakfast is R130 per person, on request** (Sept 2026, up from R110).
  Stated in **two** places on `index.html` and easy to half-fix: the
  `.facts` list in the Welcome section, and the `.cb-facts` "Good to know"
  list in `#contact`. Their own public booking listings still say R110,
  so an audit against those will look like it has found a bug here.
  README.md § 2 used to carry this as an unconfirmed item; it isn't one
  any more.
- **Nelson Mandela University is 2 km away, not 9 km** (Sept 2026). The
  9 km came from the old site / listings, which presumably measured to a
  different campus — **NMU's South Campus is in Summerstrand itself**,
  about 2 km from the house by road. The `.dist` row's `<small>` now says
  "South Campus" for exactly this reason: NMU also has a Missionvale
  campus ~20 km away, and an unqualified "Nelson Mandela University —
  2 km" would be wrong for anyone heading there. If the distance is ever
  revisited, name the campus rather than averaging them.

## Image dimensions, and `_originals/`

**Every `<img>` on every page carries `width` and `height` attributes** set
to the file's real intrinsic pixel size (Sept 2026). They are not styling —
CSS still decides the rendered size in every case — they exist so the
browser can reserve the right box before the bytes arrive. Previously none
of the 83 images had them, which caused two visible problems:

- the page visibly reflowed as photos loaded;
- **the known cross-page anchor bug**: `/#contact` arriving cold
  (from a footer link or a room page) landed ~86px off, because the browser
  computed the fragment scroll while the hero was still collapsing. One fix,
  both symptoms. See "Fixed header and anchor links" — the warning there
  about *not* padding `--head-h` still stands; this was always the right fix.

**Two rules for keeping this true:**
1. **`img{ height:auto }` in styles.css is load-bearing, not tidiness.**
   With width/height attributes present, `max-width:100%` shrinks the width
   on a narrow container while the height attribute stays at the photo's
   full value — the image stretches. `height:auto` is what restores the
   ratio. Every rule that sets a real height (`.hero-img`,
   `.bookbox-head-img`, `.around-photo-img`) is a class selector and still
   wins over it.
2. **A new or replaced photo needs its attributes updated with it.** A
   stale pair is worse than none — it reserves a box of the wrong shape.
   `<img id="lbImg">` is deliberately the one exception: it has no `src`
   until the lightbox opens, and `.lb img` sizes it `auto`/`auto`.

Adding these was verified layout-neutral by dumping every element's
bounding box at 7 page/width combinations before and after: identical
except `position:fixed` elements, whose rects move with scroll position.
Worth reusing that technique rather than eyeballing screenshots — the
gallery's lazy images make pixel diffs noisy enough to hide a real change.

**`_originals/` (repo root) holds every source photo and must never be
uploaded.** These files used to sit in `images/`, where deploying the site
also published 32 MB of full-resolution originals at guessable URLs
(`/images/hero-original.jpeg` and so on). The leading underscore is
deliberate: GitHub Pages skips `_`-prefixed folders automatically. Other
hosts need an explicit ignore — see `_originals/README.md`, which also maps
each source file to the image it rebuilds. **Nothing in the site references
it**, so a broken-link check is what proves a move like this was safe.

## Worth flagging to the owner

**Resolved (Sept 2026): the kitchenette mismatch.** The **Garden double**
and **King with sofa bed** copy didn't mention a kitchenette, although
both rooms' photos clearly show one. Both now say so everywhere they're
described: both card sets, the room page's body text, `meta description`
and `og:description`, plus a **Kitchen / Included** row in `.bookbox-facts`,
placed between Sleeps and Bathroom to match `family-unit`. On the cards the
kitchenette went into the body sentence, **not** a fourth `.spec` line.
A fourth line on one card stretches its whole grid row (see "All 6 cards
are meant to end up roughly the same height"). Both rows were measured
afterwards and stayed level.

Also resolved: the Welcome photo's alt text and figcaption described
"over ninety rose bushes", which are not in that photo. Both now describe
what is actually shown.

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

For anything going out as plain JPEG (nothing on the site is any more):
capped at 1100px long edge, sips `formatOptions
normal`, targeting 40–115KB. `sips -Z <N>` scales to fit *and* upscales if
the source is smaller than `<N>` — check source dimensions first.

## Deployment

No CI, no build. Static host of any kind (Netlify, Cloudflare Pages,
GitHub Pages, plain cPanel). See README.md § Hosting. Room pages are plain
files under `rooms/`, so they deploy the same way as everything else — no
routing config needed.
