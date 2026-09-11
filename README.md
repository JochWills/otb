# On The Bay B&B — website redesign

Static site. No build step, no framework, no database. Upload the folder and it runs.

```
index.html      the whole site (single page, anchor nav)
thanks.html     shown after a callback request is sent
styles.css
script.js
favicon.svg
robots.txt
sitemap.xml
images/         all photography
```

---

## 1. Swap in the real photos

The `images/` folder currently holds **soft colour placeholders**, each with its filename
printed faintly in the corner. Replace each file with a real photo, keeping the **same
filename**, and nothing else needs to change.

| File | What goes here | Suggested size |
|---|---|---|
| `hero.jpg` | The strongest wide shot — garden or house exterior | 2000 × 1250 |
| `garden.jpg` | The rose garden, **portrait crop** (it renders tall) | 900 × 1200 |
| `room-king.jpg` | King room with sofa bed | 1200 × 800 |
| `room-twin.jpg` | Twin room | 1200 × 800 |
| `room-family.jpg` | Two-bedroom family unit | 1200 × 800 |
| `room-double.jpg` | Garden double | 1200 × 800 |
| `room-selfcater.jpg` | Self-catering room | 1200 × 800 |
| `room-compact.jpg` | Compact single | 1200 × 800 |
| `breakfast.jpg` | Breakfast / dining | 1200 × 900 |
| `braai.jpg` | Braai and entertainment area | 1200 × 900 |
| `beach.jpg` | The bay / beachfront, **wide crop** (21:9 band) | 1600 × 900 |
| `gallery-1.jpg` … `gallery-6.jpg` | Six mixed shots | 1000 × 750 |
| `og-image.jpg` | Preview image for WhatsApp / Facebook shares | 1200 × 630 |

Gallery positions 1, 4 and 5 render **wide**; 2, 3 and 6 render **square-ish**. Put the
landscape shots in the wide slots.

Save as JPEG at roughly 80% quality and keep each file under about 400 KB. The existing
photos on the old site can be pulled straight out of the browser (right-click → Save image).

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

- **Rooms 4, 5 and 6** — "Garden double", "Self-catering room" and "Compact single" are
  described from the general room copy rather than a per-room page. Confirm the real names,
  bed configurations and which rooms have kitchenettes.
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
- **Structure** — one page. Hero → the house → six rooms → breakfast and braai → what's
  around → gallery → callback → find us. The callback request is reachable from the fixed
  header, the hero, every room card, and its own section.
- **Motion** — one entrance sequence on the hero, and nothing else that isn't a response to
  a click or hover. `prefers-reduced-motion` is respected throughout.
- **Accessibility** — skip link, visible focus rings, labelled form fields, alt text on
  every image, keyboard-operable gallery and menu.
- The WhatsApp button floating bottom-right goes to **083 797 0894**. For a small guest
  house that's usually the highest-converting contact route, which is why it's always on
  screen.
