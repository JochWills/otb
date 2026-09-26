# Archival originals — do not upload to the web host

Every file in here is a **source photo**, kept so images on the site can be
rebuilt without asking the owner for another export. **Nothing here is
referenced by the site**, and none of it should ever be uploaded.

It used to live in `images/`, which meant deploying the site also published
32 MB of full-resolution originals at guessable URLs like
`/images/hero-original.jpeg` — downloadable by anyone who tried. Moving it
out of `images/` is what stops that.

## When you deploy

Upload everything **except this folder**.

- **cPanel / FTP** — just don't drag `_originals/` across.
- **GitHub Pages** — excluded automatically. Jekyll skips any folder whose
  name starts with `_`, which is the reason for the underscore.
- **Netlify / Cloudflare Pages / Vercel** — these publish the whole repo by
  default, so add an ignore step. On Netlify, a build command of
  `rm -rf _originals` with a publish directory of `.` is enough.

## What's in here

| File(s) | Rebuilds |
|---|---|
| `heronewtest.png` | `images/hero-3.jpg`, the live hero, and `images/og-image.jpg` |
| `IMG_3459.HEIC`, `hero-original.jpeg`, `hero (1).jpeg`, `hero.jpeg`, `hero.jpg`, `hero-2.jpg` | superseded heroes, kept so the owner can revert |
| `aroundus.jpg` | `images/aroundus.webp` |
| `welcome.png` | `images/welcome.webp`, the Welcome section's pergola photo |
| `adventuretext.png` | `images/adventuretext.webp` |
| `asideimage.png` | `images/bookbox-wave.webp` |
| `LookAround/` | `images/gallery-1..14.webp` |
| `Room 1/` … `Room6/` | the original (pre-reshoot) room photo sets |
| `Room 4/1..7.HEIC` | `images/rooms/garden-double/1..7.webp`, the Sept 2026 reshoot (`6.HEIC` needs rotating 90° clockwise). The matching `N.jpeg` files are the owner's re-exports of the same pixels, so rebuild from the HEICs |
| `Room6/compact-single-1-original.HEIC` | `images/rooms/compact-single/banner.webp`, the Compact room's hero: the 48MP original, rotated 90° clockwise then cropped 2:1 from 26% down |
| `Room6/compact-single-1-new.png` | `images/rooms/compact-single/1.webp`, that room's cards and first gallery tile |
| `room-*.jpg` | retired placeholder room images |

See CLAUDE.md § "Photo processing conventions" for the exact recipe each
one was built with — several have per-file gotchas (transparent-PNG
fringing, HEIC rotation) that are documented there, not here.
