# Kuchipudi Heritage Arts Society

Official website and digital portal for **Kuchipudi Heritage Arts Society** — preserving, presenting, and celebrating the classical Indian dance form originating from the historic Kuchipudi village, Andhra Pradesh, India.

🌐 **Website:** [kuchipudiheritage.com](https://kuchipudiheritage.com/)

---

## 🎭 Overview

A modern, fast, and accessible static website representing the timeless tradition of Kuchipudi. The platform provides comprehensive educational resources on Kuchipudi history, repertoire, the 15 legendary gurus, the Kuchipudi flag symbolism, and an online registration portal for institutions and performers for **Geeta Saaram Natya Vedam 2026**.

### Key Pages & Features
- **Home (`public/index.html`)**: Society mission, traditional curtain (*tera*) entrance animation, festival countdown to 25 December 2026, and guru highlights.
- **Kuchipudi Dance (`public/kuchipudi-dance/index.html`)**: Complete guide to Kuchipudi dance origins, Natyashastra foundation, expressions (*Abhinaya*), and movements.
- **History (`public/kuchipudi-history/index.html`)**: Chronological journey tracing Siddhendra Yogi, the Bhagavata Melas, court patronage, and the 20th-century renaissance.
- **Legendary Gurus (`public/kuchipudi-gurus/index.html`)**: Biographies and portraits honoring 15 master gurus of the Kuchipudi tradition.
- **The Kuchipudi Flag (`public/kuchipudi-flag/index.html`)**: Interactive component explaining the sacred symbols and cultural significance of the Kuchipudi *Patakam*.
- **Events & Confluence (`public/events/index.html`)**: Details, schedules, and video archives for the Kuchipudi Dance Confluence and upcoming programs.
- **Institution & Performer Application (`public/application-for-institutions/index.html`)**: Multi-step registration and application gateway for individual artists, dance academies, and gurus for Geeta Saaram Natya Vedam 2026.
- **The Team (`public/the-team/index.html`)**: Leadership, executive committee, and patrons of the Society.
- **Contact (`public/contact-us/index.html`)**: Village headquarters, office location, telephone, and official correspondence channels.

---

## 🛠️ Tech Stack

- **HTML5 & Vanilla CSS3**: Semantic HTML, custom CSS variables, responsive typography, and accessible animation controls.
- **Vanilla JavaScript**: Interactive curtain reveal, smooth page transitions, dynamic countdown timer, modal viewers, and registration workflows.
- **Self-Hosted Typography**: Zero external Google Font dependencies; self-hosts **Tiro Telugu** and **Anek Telugu** under SIL Open Font License.
- **Python Static Site Generator**: Lightweight build engine (`src/build.py` & `src/data.py`) validating HTML structure, heading hierarchy, links, and SEO metadata.
- **SEO & Performance**: JSON-LD Schema markup, Open Graph tags, XML sitemap, `robots.txt`, and optimized WebP photography.

---

## 📁 Project Structure

```text
kuchipudiheritage.com/
├── public/                                # Production static website (deployable root)
│   ├── application-for-institutions/      # Institution application page
│   ├── assets/
│   │   ├── css/                           # site.css design system & animations
│   │   ├── fonts/                         # Self-hosted Tiro & Anek Telugu fonts
│   │   ├── img/                           # Optimized WebP images (gurus, team, posters)
│   │   └── js/                            # site.js interactions & motion logic
│   ├── contact-us/                        # Contact information & directions
│   ├── events/                            # Dance Confluence & festival schedules
│   ├── kuchipudi-dance/                   # History & repertoire overview
│   ├── kuchipudi-flag/                    # Kuchipudi Patakam symbolism
│   ├── kuchipudi-gurus/                   # 15 master gurus tribute
│   ├── kuchipudi-history/                 # Detailed historical timeline
│   ├── privacy-policy/                    # Privacy policy
│   ├── terms-and-conditions/              # Terms and conditions
│   ├── the-team/                          # Society leadership & organizing team
│   ├── .htaccess                          # Apache / cPanel redirect and caching rules
│   ├── _headers                           # Security & cache headers for Netlify/Cloudflare
│   ├── _redirects                         # Canonical 301 redirects
│   ├── index.html                         # Home page
│   ├── 404.html                           # Custom 404 error page
│   ├── robots.txt                         # Search engine crawler directives
│   ├── site.webmanifest                   # PWA manifest
│   └── sitemap.xml                        # Search engine XML sitemap
├── src/                                   # Source files & build generator
│   ├── content/                           # Page content templates
│   ├── build.py                           # Python build and validation script
│   └── data.py                            # Centralized site data and metadata
├── .gitignore                             # Git ignore rules
├── LICENSE                                # Apache 2.0 License
├── package.json                           # Development scripts
└── README.md                              # Project documentation
```

---

## 🚀 Quick Start & Development

### Local Preview
Run the local static server:

```bash
npm start
# or: python3 -m http.server -d public 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your browser.

### Rebuilding from Source
To update shared components (navigation, footer, guru data) and recompile `public/`:

```bash
npm run build
# or: cd src && python3 build.py
```

---

## 📍 Society Details

- **Address:** D.No. 2-86, Kuchipudi Village, Movva Mandal, Krishna District, Andhra Pradesh 521136, India
- **Phone:** +91 90322 28439
- **Email:** info.kuchipudiheritage@gmail.com
- **Festival:** Geeta Saaram Natya Vedam — 25 December 2026, 10:00 AM IST

---

## 📄 License

This project is licensed under the [Apache 2.0 License](LICENSE).
