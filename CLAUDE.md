# Kuchipudi Heritage Arts Society website

## Project status: PRE-LAUNCH (not live)

The site is **not live yet**. kuchipudiheritage.com is the planned domain, but
nothing here is deployed or taking real registrations. Some parts are
deliberately placeholders until launch. Do **not** report the items in the
launch checklist below as bugs, and do not "fix" them without the owner
asking: most of them need payment keys, a backend, account IDs, or decisions
from the Society.

When the site goes live, work through the checklist, then update this
section (and the status note in README.md).

## Launch checklist (deliberately left for go-live)

Registration portal (`/application-for-institutions/`)
- [ ] **Payment is a mock.** The "Pay via Razorpay" button opens a fake
      window (`#razorpay-modal`, `openRazorpayMockup()` in
      `public/assets/js/site.js`). Replace it with real Razorpay Checkout.
      This needs a Razorpay account, key ID, and a server to create orders
      and verify payment signatures. Never trust the payment result in the browser alone.
- [ ] **Registrations are not saved.** `submitForm()` builds a `payload` and
      throws it away. The `KDP-xxxxxx` reference is random. Send the payload to
      a backend (or a Google Sheet / Apps Script) after payment is verified,
      and get the reference from there.
- [ ] Remove the test-mode markers once the above is real: the
      `.reg-test-note` paragraph and the "This was a test run" success text in
      `src/content/application-for-institutions.html`, the `.reg-test-note`
      CSS, and the "Test mode" footer of the modal.
- [ ] Fallback option: `SITE["form_apply"]` in `src/data.py` is a Google Form
      for applications. It is currently unused. Linking to it is the quickest
      way to launch if the payment integration is not ready.
- [ ] Fees (₹500 individual, ₹400 per student) are hard-coded in
      `regState` in `site.js`, in the page copy, and in the DanceEvent
      schema in `src/build.py`. Confirm them with the Society, and keep the three in sync.

Policies (need the Society's input, not code changes)
- [ ] **Refund policy.** There is none anywhere on the site. Add one to
      `terms-and-conditions.html` before taking payments.
- [ ] **Privacy policy** (`src/content/privacy-policy.html`) is a generic
      draft. It describes donations, PAN details, newsletters, PayPal, and
      analytics cookies that the site doesn't have. It also doesn't cover what
      registration actually collects: names, ages of children, phone numbers,
      emails, and student lists. Rewrite it to match reality.

Accounts and hosting
- [ ] `GOOGLE_ANALYTICS_ID` and `GOOGLE_SITE_VERIFICATION` in `src/data.py`
      are empty on purpose. Fill them in at launch.
- [ ] Add a Content-Security-Policy header in `src/build.py` (`HEADERS` and
      `htaccess()`). Inline `onclick` handlers have already been removed, so a
      CSP is possible. It must allow Google Maps and Google Forms iframes,
      YouTube embeds, Razorpay Checkout, and gtag. Test it on the real host.
- [ ] Decide the host (Netlify/Cloudflare `_headers`/`_redirects`, or
      Apache/cPanel `.htaccess`. Both are generated) and point DNS.
- [ ] After launch, submit `sitemap.xml` in Search Console.

## How the code is laid out

- `src/content/*.html`: page bodies. `src/data.py`: shared data (society
  details, nav, gurus, team, videos, images, FAQs). `src/build.py`: builds
  everything into `public/` and runs checks (titles, descriptions, one h1,
  alt text, missing images, broken links/anchors, valid JSON-LD).
- `public/` is the deployable site **and** holds the source of truth for
  `assets/` (CSS, JS, fonts, images). Edit `public/assets/css/site.css` and
  `public/assets/js/site.js` directly. Edit pages in `src/content/`, never in
  `public/*/index.html` (those are overwritten by the build).
- Build: `npm run build` (or `cd src && python3 build.py`). It must end with
  "All checks passed." Preview build: `python3 build.py --preview` →
  `preview/`.
- Local server: `npm start` → http://localhost:8000.

## Event facts (keep consistent across pages)

- International Kuchipudi Dance Confluence: 25 to 27 December 2026. The home page
  countdown targets 25 Dec 10:00 IST (`FESTIVAL_START` in `build.py`).
- Geeta Saaram Natya Vedam: 27 December 2026, reporting 10:00 AM (final
  day of the Confluence).
- Applications close: 30 November 2026. Minimum age: 6.
