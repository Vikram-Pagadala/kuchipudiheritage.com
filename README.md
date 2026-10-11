# kuchipudiheritage.com — rebuilt as a static site

A hand-coded replacement for the WordPress site. Plain HTML, one CSS file, one
small JavaScript file, and the Society's own pictures. No WordPress, no
plugins, no database, and nothing to install on the host.

## What is in this folder

| Path | What it is |
| --- | --- |
| `public/` | **The website.** Upload the *contents* of this folder to your host. |
| `SEO-PLAN.md` | The keyword map, what was done on each page, the launch checklist and what to write next. |
| `src/` | The source the site is generated from. Optional. Use it when you want to change the menu, footer or content in one place. |

## Launch in three steps

1. **Upload `public/`** to your host.
   - *Netlify or Cloudflare Pages (free):* drag the `public` folder in. They
     read `_redirects` and `_headers` automatically.
   - *cPanel / Apache hosting:* upload the contents of `public` into
     `public_html`. Make sure the hidden file `.htaccess` is uploaded too.
     It carries the redirects, caching and the HTTPS rule.

2. **Point the domain** `kuchipudiheritage.com` at the new host and turn on
   HTTPS there.

3. **Tell Google.** Follow the launch checklist in `SEO-PLAN.md`: verify the
   site in Google Search Console, submit `https://kuchipudiheritage.com/sitemap.xml`,
   and check that the old addresses redirect.

To look at the site on your own computer first:

```bash
cd public && python3 -m http.server 8000
```

then open http://localhost:8000. (Opening the files by double-clicking will
not work, because the pages use addresses that start at the site root.)

## Pages

| Address | Page |
| --- | --- |
| `/` | Home |
| `/kuchipudi-dance/` | What Kuchipudi dance is (new) |
| `/kuchipudi-history/` | The history of Kuchipudi (new) |
| `/kuchipudi-gurus/` | The 15 gurus. Replaces `/our-lagendary/` |
| `/kuchipudi-flag/` | The Kuchipudi flag, with its parts explained (new) |
| `/events/` | The Dance Confluence, upcoming events and recordings (new) |
| `/the-team/` | The team. Same address as before |
| `/contact-us/` | Contact. Same address as before |
| `/application-for-institutions/` | Geeta Saaram Natya Vedam 2026 application. Same address as before |
| `/privacy-policy/`, `/terms-and-conditions/` | Legal. Same addresses as before |

Old addresses that changed (`/our-lagendary/`, `/contact/`) and the old
WordPress picture addresses are redirected with a permanent (301) redirect.

## The pictures

Every picture on the site comes from the old kuchipudiheritage.com. Nothing
was drawn or generated. They are in `public/assets/img/`:

| Picture | File |
| --- | --- |
| Logo (the statue in its circle) | `logo-512.webp`, `logo-160.webp`, plus the browser icons |
| Painting of Siddhendra Yogi | `siddhendra-yogi-painting.webp` |
| The Kuchipudi flag, cut out from its white background | `kuchipudi-flag-patakam.webp` |
| Festival posters, English and Telugu | `kuchipudi-dance-confluence-2026-poster*.webp` |
| The dancers and temple, cropped from the English poster | `kuchipudi-dancers-temple-art.webp` |
| 15 guru portraits | `gurus/` |
| 4 team portraits | `team/` |
| Covers of your 4 YouTube videos | `videos/` |

Each has a full-size file and a lighter one for phones. They were captured
from the live site at up to 800 to 1200 pixels wide, which is what the layout
needs. If you have the original files at higher resolution and want any of
them sharper, send them and I will swap them in.

To replace a picture, save the new one over the old file with the same name
and size.

## What moves

- **The curtain.** On a visitor's first visit to the home page, a maroon
  curtain parts to reveal the stage, the way a Kuchipudi character enters from
  behind the tera. It plays once per browser session and lasts about a second.
- **Page changes.** Moving between pages, the new page opens from the centre
  like a curtain (Chrome, Edge and Safari; other browsers get a soft fade).
- **Home page.** The title rises in word by word, gold dust drifts across the
  stage, the festival painting slowly zooms, the flag sways on its pole, the
  numbers count up, the gurus pass in two rows, the history line fills as you
  scroll, the posters tilt towards the pointer, and the countdown ticks.
- **Every page.** Sections rise into place as you reach them, pictures open
  larger when pressed, a gold line at the top shows how far you have read, and
  the menu bar tucks away as you scroll down and returns as you scroll up.
- **The flag.** Point at a part of the flag to read what it means.

Visitors who have asked their device to reduce motion get the same pages with
everything still. The site also reads fully with JavaScript switched off.

## Changing the site later

**Small text change:** open the page's `index.html` inside `public/` and edit
the words.

**Anything that repeats** (menu, footer, phone number, a guru's details): edit
the source and rebuild.

```bash
cd src
python3 build.py        # writes ../public
```

- `src/data.py` — the Society's details, the menu, the gurus, the team, the
  videos, the picture list, the parts of the flag, the FAQ, page titles and
  descriptions.
- `src/content/*.html` — the body of each page.
- `src/assets/css/site.css`, `src/assets/js/site.js` — design and motion.
- `src/assets/img/` — the pictures.

The build needs only Python 3. It checks every page as it goes: title and
description length, one `<h1>` per page, no broken internal links, anchors or
pictures, valid structured data.

**Festival date.** The countdown runs to 25 December 2026, 10:00 AM IST. To
change it, edit `FESTIVAL_START` near the top of `src/build.py`.

## Fonts

The site uses Tiro Telugu and Anek Telugu, both under the SIL Open Font
License. The font files are served from the site itself
(`public/assets/fonts/`), so there is no call to Google Fonts.
