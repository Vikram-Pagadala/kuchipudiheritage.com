#!/usr/bin/env python3
"""Builds kuchipudiheritage.com as plain static files.

    python3 build.py            -> ../public   (the site to upload)
    python3 build.py --preview  -> ../preview  (flat, self-contained preview)

No dependencies beyond Python 3. Content lives in content/*.html and data.py.
"""
import hashlib
import html
import json
import re
import shutil
import sys
from pathlib import Path

import data as D

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT.parent / "public"
PREVIEW = "--preview" in sys.argv
OUT = ROOT.parent / ("preview" if PREVIEW else "public")
SITE = D.SITE
OG_IMAGE = "/assets/img/og/kuchipudi-heritage-arts-society.jpg"
FESTIVAL_START = "2026-12-25T10:00:00+05:30"

# The picture shown beside the title of each inner page.
PAGE_ART = {
    "/kuchipudi-dance/": "scene",
    "/kuchipudi-history/": "painting",
    "/kuchipudi-gurus/": "fan",
    "/kuchipudi-flag/": "flag",
    "/events/": "poster",
    "/application-for-institutions/": "poster",
}

esc = lambda s: html.escape(str(s), quote=True)


# ---------------------------------------------------------------------------
# URLs
# ---------------------------------------------------------------------------
def url(path):
    """Internal link. Clean root-relative URLs on the live site; flat file
    names in the preview."""
    frag = ""
    if "#" in path:
        path, frag = path.split("#", 1)
        frag = "#" + frag
    if not PREVIEW:
        return path + frag
    if path == "/":
        return "index.html" + frag
    return path.strip("/").replace("/", "-") + ".html" + frag


def asset(rel):
    return ("assets/" if PREVIEW else "/assets/") + rel


def absolute(path):
    return D.DOMAIN + path


# ---------------------------------------------------------------------------
# Pictures
# ---------------------------------------------------------------------------
def pic(key, alt, sizes="100vw", cls="", eager=False, small=False):
    """An <img> for one of the Society's pictures, with a lighter file for
    small screens. `small=True` uses only the lighter file (thumbnails)."""
    im = D.IMAGES[key]
    c = f' class="{cls}"' if cls else ""
    load = ' fetchpriority="high"' if eager else ' loading="lazy" decoding="async"'
    if small:
        return (f'<img src="{asset("img/" + im["small"])}" alt="{esc(alt)}" width="{im["sw"]}" '
                f'height="{im["sh"]}"{c}{load}>')
    return (f'<img src="{asset("img/" + im["src"])}" srcset="{asset("img/" + im["small"])} {im["sw"]}w, '
            f'{asset("img/" + im["src"])} {im["w"]}w" sizes="{sizes}" alt="{esc(alt)}" '
            f'width="{im["w"]}" height="{im["h"]}"{c}{load}>')


def zoom(key, alt, frame_cls="", caption="", sizes="(max-width: 720px) 90vw, 420px"):
    """A picture in a frame that opens larger when pressed."""
    im = D.IMAGES[key]
    box = (f'<a class="frame zoom {frame_cls}" href="{asset("img/" + im["src"])}" '
           f'data-caption="{esc(caption or alt)}">{pic(key, alt, sizes)}</a>')
    if caption:
        return f'<figure class="figure">{box}<figcaption>{caption}</figcaption></figure>'
    return box


def words(text):
    """Wrap each word so the heading can rise into place word by word."""
    return " ".join(f'<span class="w"><span style="--i:{i}">{w}</span></span>' for i, w in enumerate(text.split()))


# ---------------------------------------------------------------------------
# Blocks
# ---------------------------------------------------------------------------
def years(g):
    return f'{g["born"]}–{g["died"]}' if g["died"] else f'Born {g["born"]}'


def guru_alt(g):
    return f'{g["name"]}, Kuchipudi guru ({years(g).replace("Born ", "born ")})'


def block_ticker():
    jatis = ["ta ka dhi mi", "ta ki ta", "ta dhin gi na tom", "ta ka jha nu", "tai ya tai hi", "ta ka dhi mi", "ta ki ta", "ta dhin gi na tom"]
    run = "".join(f"<span>{j}</span>" for j in jatis)
    return f'<div class="ticker" aria-hidden="true"><div class="ticker-track">{run}{run}</div></div>'


def _pcard(g, hidden=False):
    extra = ' aria-hidden="true" tabindex="-1"' if hidden else ""
    return (f'<a class="pcard" href="[[url:/kuchipudi-gurus/#{g["id"]}]]"{extra}>'
            f'<span class="pcard-photo">{pic(g["id"], "" if hidden else guru_alt(g), small=True)}</span>'
            f'<b>{esc(g["name"])}</b><span>{years(g)}</span></a>')


def block_parade():
    """Two rows of portraits moving in opposite directions. Each row holds its
    gurus four times over (three copies hidden from assistive technology), so
    the loop never shows a gap, even on a very wide screen."""
    rows = []
    for i, group in enumerate((D.GURUS[:8], D.GURUS[8:])):
        cards = "".join(_pcard(g) for g in group) + "".join(_pcard(g, hidden=True) for g in group) * 3
        rows.append(f'<div class="parade-row{" rev" if i else ""}">{cards}</div>')
    return f'<div class="parade">{"".join(rows)}</div>'


def block_guru_jump():
    rows = "".join(f'<li><a href="#{g["id"]}">{esc(g["name"])}</a></li>' for g in D.GURUS)
    return f'<ul class="jump">{rows}</ul>'


def block_gurus():
    out = ['<div class="lineage">']
    for g in D.GURUS:
        bio = "".join(f"<p>{p}</p>" for p in g["bio"])
        out.append(
            f'<article class="guru" id="{g["id"]}">'
            f'<div class="guru-photo">{zoom(g["id"], guru_alt(g), "frame-1x1", sizes="(max-width: 720px) 60vw, 280px")}</div>'
            f'<div class="guru-body"><p class="guru-years">{years(g)}</p>'
            f'<h2>{esc(g["name"])}</h2><p class="guru-role">{esc(g["role"])}</p>{bio}</div></article>')
    out.append("</div>")
    return "".join(out)


def block_team():
    out = ['<div class="people">']
    for t in D.TEAM:
        bio = "".join(f"<p>{p}</p>" for p in t["bio"])
        honour = f'<p class="person-honour">{esc(t["honour"])}</p>' if t["honour"] else ""
        alt = f'{t["name"]}, {t["title"]}, Kuchipudi Heritage Arts Society'
        out.append(
            f'<article class="person" id="{t["id"]}">'
            f'<div class="person-photo">{zoom(t["id"], alt, "frame-4x5", sizes="(max-width: 720px) 60vw, 330px")}</div>'
            f'<div class="person-body"><h2>{esc(t["name"])}</h2>'
            f'<p class="person-title">{esc(t["title"])}, Kuchipudi Heritage Arts Society</p>{honour}{bio}</div></article>')
    out.append("</div>")
    return "".join(out)


def block_faces():
    cards = "".join(
        f'<a class="face" href="[[url:/the-team/#{t["id"]}]]">{pic(t["id"], t["name"] + ", " + t["title"], small=True)}'
        f'<span><b>{esc(t["name"])}</b>{esc(t["title"])}</span></a>' for t in D.TEAM)
    return f'<div class="faces">{cards}</div>'


def block_videos(group=None):
    out = ['<div class="videos">']
    for v in D.VIDEOS:
        if group and v["group"] != group:
            continue
        thumb = (f'<img src="{asset("img/videos/" + v["id"] + "-480.webp")}" srcset="{asset("img/videos/" + v["id"] + "-480.webp")} 480w, '
                 f'{asset("img/videos/" + v["id"] + ".webp")} 800w" sizes="(max-width: 600px) 92vw, 360px" alt="" '
                 'width="800" height="450" loading="lazy" decoding="async">')
        embed = "" if PREVIEW else " data-embed"
        note = "Opens on YouTube" if PREVIEW else "Play here, or open on YouTube"
        out.append(
            f'<a class="video" href="https://www.youtube.com/watch?v={v["id"]}" data-yt="{v["id"]}"{embed} rel="noopener">'
            f'<span class="video-frame">{thumb}<span class="video-play" aria-hidden="true"></span></span>'
            f'<span class="video-title">{esc(v["title"])}</span><span class="video-note">{note}</span></a>')
    out.append("</div>")
    return "".join(out)


def block_faq():
    rows = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in D.FAQS)
    return f'<div class="faq">{rows}</div>'


def _flag_figure(ids):
    hots = "".join(
        f'<button class="hot" type="button" data-part="{p["id"]}" aria-pressed="false" '
        f'style="left:{p["x"]}%;top:{p["y"]}%"><span class="visually-hidden">{esc(p["name"])}</span></button>'
        for p in D.FLAG_PARTS if p["id"] in ids)
    im = D.IMAGES["flag"]
    flag = pic("flag", "The Kuchipudi flag, the patakam: a pink banner on a sugarcane pole, painted with the Satyabhama jada",
               "(max-width: 860px) 240px, 330px")
    return f'<div class="flag-figure"><div class="flag-sway">{flag}{hots}</div></div>'


def _flag_parts(ids):
    rows = "".join(f'<div data-part="{p["id"]}"><dt>{esc(p["name"])}</dt><dd>{esc(p["text"])}</dd></div>'
                   for p in D.FLAG_PARTS if p["id"] in ids)
    return f'<dl class="parts">{rows}</dl>'


def block_flag_home():
    ids = ["cloth", "serpent", "stars", "pole"]
    return (
        f'<div class="flagshow">{_flag_figure(ids)}<div class="flag-copy">'
        '<h2 id="flag">A flag for a dance</h2>'
        '<p>Kuchipudi has a flag of its own. The patakam, created in 1974, is a light pink banner hoisted on a stalk of '
        'sugarcane and painted with the Satyabhama jada, the long plait of the heroine of Bhama Kalapam. '
        'Point at a part of the flag to see what it means.</p>'
        f'{_flag_parts(ids)}'
        '<p><a class="link" href="[[url:/kuchipudi-flag/]]">Read the whole meaning of the Kuchipudi flag</a></p>'
        '</div></div>')


def block_flag_full():
    ids = [p["id"] for p in D.FLAG_PARTS]
    return f'<div class="flagshow">{_flag_figure(ids)}<div class="flag-copy">{_flag_parts(ids)}</div></div>'


def _poster(key, alt):
    im = D.IMAGES[key]
    return (f'<a class="poster zoom" href="{asset("img/" + im["src"])}" data-caption="{esc(alt)}">'
            f'{pic(key, alt, "(max-width: 600px) 44vw, 270px")}</a>')


POSTER_EN = "Poster: The International Kuchipudi Dance Confluence, a festival of Kuchipudi heritage, 25 to 27 December 2026"
POSTER_TE = "Telugu poster: Prapancha Kuchipudi Natya Maha Sabhalu, 25 to 27 December 2026"


def block_posters(cls="posters"):
    return f'<div class="{cls}">{_poster("poster-en", POSTER_EN)}{_poster("poster-te", POSTER_TE)}</div>'


def block_countdown():
    return ('<p class="countdown-label">The festival begins in</p>'
            f'<p class="countdown" data-until="{FESTIVAL_START}" hidden></p>')


BLOCKS = {
    "ticker": block_ticker,
    "parade": block_parade,
    "guru_jump": block_guru_jump,
    "gurus": block_gurus,
    "team": block_team,
    "faces": block_faces,
    "videos": lambda: block_videos(),
    "videos_swarnotsavalu": lambda: block_videos("swarnotsavalu"),
    "videos_viswanarthanam": lambda: block_videos("viswanarthanam"),
    "countdown": block_countdown,
    "faq": block_faq,
    "flag_home": block_flag_home,
    "flag_full": block_flag_full,
    "posters": lambda: block_posters("posters"),
    "poster_pair": lambda: block_posters("poster-pair"),
}


# ---------------------------------------------------------------------------
# Token expansion
# ---------------------------------------------------------------------------
def expand(text):
    keep, drop = ("preview", "prod") if PREVIEW else ("prod", "preview")
    text = re.sub(r"\[\[if:%s\]\](.*?)\[\[/if\]\]" % drop, "", text, flags=re.S)
    text = re.sub(r"\[\[if:%s\]\](.*?)\[\[/if\]\]" % keep, r"\1", text, flags=re.S)
    text = re.sub(r"\[\[block:([a-z_]+)\]\]", lambda m: BLOCKS[m.group(1)](), text)
    text = re.sub(r"\[\[h1:([^\]]+)\]\]", lambda m: words(m.group(1)), text)

    def _pic(m):
        p = m.group(1).split("|") + [""] * 5
        return pic(p[0], p[1], p[2] or "100vw", p[3], eager=p[4] == "eager", small=p[4] == "small")
    text = re.sub(r"\[\[pic:([^\]]+)\]\]", _pic, text)

    def _zoom(m):
        p = m.group(1).split("|") + [""] * 4
        return zoom(p[0], p[1], p[2], p[3])
    text = re.sub(r"\[\[zoom:([^\]]+)\]\]", _zoom, text)
    text = re.sub(r"\[\[site:([a-z0-9_]+)\]\]", lambda m: esc(SITE[m.group(1)]), text)
    text = re.sub(r"\[\[url:([^\]]+)\]\]", lambda m: url(m.group(1)), text)
    return text


def smart(markup):
    """Curly quotes in text, leaving tags, scripts and styles alone."""
    out, raw = [], False
    for part in re.split(r"(<[^>]+>)", markup):
        if part.startswith("<"):
            low = part.lower()
            if low.startswith(("<script", "<style")):
                raw = True
            elif low.startswith(("</script", "</style")):
                raw = False
            out.append(part)
        elif raw:
            out.append(part)
        else:
            part = re.sub(r"(\w)'(\w)", "\\1\u2019\\2", part)
            part = re.sub(r"(\w)'(?=[\s,.;:)]|$)", "\\1\u2019", part)
            part = re.sub(r'"([^"]+)"', "\u201c\\1\u201d", part)
            out.append(part)
    return "".join(out)


# ---------------------------------------------------------------------------
# Structured data
# ---------------------------------------------------------------------------
ORG_ID = D.DOMAIN + "/#organization"
WEB_ID = D.DOMAIN + "/#website"


def strip_tags(s):
    return html.unescape(re.sub(r"\[\[url:[^\]]+\]\]", "", re.sub(r"<[^>]+>", "", s)))


def img_abs(key):
    return D.DOMAIN + "/assets/img/" + D.IMAGES[key]["src"]


def org_node():
    return {
        "@type": "Organization",
        "@id": ORG_ID,
        "name": SITE["name"],
        "alternateName": ["KHAS", "Kuchipudi Heritage"],
        "url": D.DOMAIN + "/",
        "logo": {"@type": "ImageObject", "url": img_abs("logo"), "width": 512, "height": 512},
        "image": absolute(OG_IMAGE),
        "description": "A society based in Kuchipudi village, Andhra Pradesh, dedicated to preserving, studying and presenting the Kuchipudi classical dance tradition.",
        "email": SITE["email"],
        "telephone": SITE["phone_e164"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE["street"],
            "addressLocality": "Kuchipudi, " + SITE["locality"],
            "addressRegion": SITE["region"],
            "postalCode": SITE["postcode"],
            "addressCountry": SITE["country"],
        },
        "sameAs": [SITE["youtube"], SITE["instagram"], SITE["facebook"]],
        "knowsAbout": ["Kuchipudi", "Indian classical dance", "Bhama Kalapam", "Yakshagana", "Siddhendra Yogi"],
    }


def breadcrumb_node(page):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": D.DOMAIN + "/"},
             {"@type": "ListItem", "position": 2, "name": page["crumb"], "item": absolute(page["path"])}]
    return {"@type": "BreadcrumbList", "@id": absolute(page["path"]) + "#breadcrumb", "itemListElement": items}


def schema(page):
    here = absolute(page["path"])
    kind = page["schema"]
    page_type = {"team": "AboutPage", "contact": "ContactPage", "gurus": "CollectionPage",
                 "events": "CollectionPage"}.get(kind, "WebPage")
    lead = {"/kuchipudi-history/": "painting", "/kuchipudi-flag/": "flag", "/kuchipudi-dance/": "scene",
            "/events/": "poster-en", "/application-for-institutions/": "poster-en"}.get(page["path"])
    lead_url = img_abs(lead) if lead else absolute(OG_IMAGE)
    webpage = {
        "@type": page_type, "@id": here + "#webpage", "url": here, "name": page["title"],
        "description": page["description"], "inLanguage": "en-IN",
        "isPartOf": {"@id": WEB_ID}, "about": {"@id": ORG_ID},
        "primaryImageOfPage": {"@type": "ImageObject", "url": lead_url},
        "dateModified": D.BUILD_DATE,
    }
    graph = [org_node(),
             {"@type": "WebSite", "@id": WEB_ID, "url": D.DOMAIN + "/", "name": SITE["name"],
              "description": SITE["tagline"], "inLanguage": "en-IN", "publisher": {"@id": ORG_ID}},
             webpage]
    if page["path"] != "/":
        webpage["breadcrumb"] = {"@id": here + "#breadcrumb"}
        graph.append(breadcrumb_node(page))
    if kind.startswith("article"):
        graph.append({
            "@type": "Article", "@id": here + "#article", "headline": page["h1"],
            "description": page["description"], "image": lead_url, "inLanguage": "en-IN",
            "datePublished": D.BUILD_DATE, "dateModified": D.BUILD_DATE,
            "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID},
            "mainEntityOfPage": {"@id": here + "#webpage"},
            "about": {"@type": "Thing", "name": "Kuchipudi", "sameAs": "https://en.wikipedia.org/wiki/Kuchipudi"},
        })
    if kind.endswith("faq"):
        graph.append({
            "@type": "FAQPage", "@id": here + "#faq",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in D.FAQS]})
    if kind == "gurus":
        people = []
        for i, g in enumerate(D.GURUS, 1):
            person = {"@type": "Person", "@id": here + "#" + g["id"], "name": g["name"],
                      "url": here + "#" + g["id"], "birthDate": str(g["born"]),
                      "description": g["role"], "jobTitle": "Kuchipudi guru",
                      "image": img_abs(g["id"]), "knowsAbout": "Kuchipudi"}
            if g["died"]:
                person["deathDate"] = str(g["died"])
            people.append({"@type": "ListItem", "position": i, "item": person})
        graph.append({"@type": "ItemList", "@id": here + "#gurus", "name": "Kuchipudi gurus",
                      "numberOfItems": len(people), "itemListElement": people})
    if kind == "team":
        for t in D.TEAM:
            person = {"@type": "Person", "@id": here + "#" + t["id"], "name": t["schema_name"],
                      "jobTitle": t["title"], "worksFor": {"@id": ORG_ID},
                      "url": here + "#" + t["id"], "image": img_abs(t["id"]),
                      "description": strip_tags(t["bio"][0]), "knowsAbout": "Kuchipudi"}
            if t["awards"]:
                person["award"] = t["awards"]
            graph.append(person)
    if kind == "events":
        graph.append({
            "@type": "DanceEvent", "@id": here + "#confluence-2026",
            "name": "The International Kuchipudi Dance Confluence 2026",
            "alternateName": "Prapancha Kuchipudi Natya Maha Sabhalu (Swabhava – Swaroopa)",
            "description": "Three-day festival of Kuchipudi heritage in Kuchipudi village, Andhra Pradesh, featuring traditional performances, gurus and scholars.",
            "startDate": "2026-12-25T10:00:00+05:30", "endDate": "2026-12-27T22:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {"@type": "Place", "name": "Kuchipudi Village",
                         "address": {"@type": "PostalAddress", "streetAddress": SITE["street"],
                                     "addressLocality": "Kuchipudi, Movva Mandal, Krishna District",
                                     "addressRegion": "Andhra Pradesh", "postalCode": "521136", "addressCountry": "IN"}},
            "organizer": {"@id": ORG_ID}, "image": D.DOMAIN + "/assets/img/kuchipudi-dance-confluence-2026-poster.webp",
        })
        graph.append({
            "@type": "DanceEvent", "@id": here + "#swarnotsavalu",
            "name": "Kuchipudi Natya Pathaka Swarnotsavalu",
            "description": "Three-day international gathering marking fifty years of the Kuchipudi flag.",
            "startDate": "2024-12-27", "endDate": "2024-12-29",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {"@type": "Place", "name": "Kuchipudi village",
                         "address": {"@type": "PostalAddress", "addressLocality": "Kuchipudi, Movva Mandal, Krishna District",
                                     "addressRegion": "Andhra Pradesh", "postalCode": "521136", "addressCountry": "IN"}},
            "organizer": {"@id": ORG_ID}, "image": D.DOMAIN + "/assets/img/videos/HuWoA4w-sdI.webp",
        })
    if page["path"] == "/application-for-institutions/":
        graph.append({
            "@type": "DanceEvent", "@id": here + "#geeta-saaram-natya-vedam-2026",
            "name": "Geeta Saaram Natya Vedam 2026",
            "description": "Official Kuchipudi performance and world record recital event on the final day of the International Kuchipudi Dance Confluence.",
            "startDate": "2026-12-27T10:00:00+05:30", "endDate": "2026-12-27T18:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {"@type": "Place", "name": "Kuchipudi Village",
                         "address": {"@type": "PostalAddress", "streetAddress": SITE["street"],
                                     "addressLocality": "Kuchipudi, Movva Mandal, Krishna District",
                                     "addressRegion": "Andhra Pradesh", "postalCode": "521136", "addressCountry": "IN"}},
            "organizer": {"@id": ORG_ID}, "image": D.DOMAIN + "/assets/img/kuchipudi-dance-confluence-2026-poster.webp",
            "offers": {
                "@type": "Offer",
                "url": here,
                "price": "500",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "validThrough": "2026-11-30T23:59:59+05:30",
                "description": "Registration fee for performers: ₹500 individual performer, ₹400 per student for institutions."
            }
        })
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))


# ---------------------------------------------------------------------------
# Layout
# ---------------------------------------------------------------------------
def logo_img(size_class=""):
    im = D.IMAGES["logo"]
    return (f'<img src="{asset("img/" + im["small"])}" alt="" width="{im["sw"]}" height="{im["sh"]}" decoding="async">')


def header(page):
    def item(path, label, cls=""):
        cur = ' aria-current="page"' if path == page.get("path") else ""
        c = f' class="{cls}"' if cls else ""
        return f'<li><a href="{url(path)}"{c}{cur}>{label}</a></li>'
    links = "".join(item(p, l) for p, l in D.NAV) + item(*D.NAV_BUTTON, cls="nav-button")
    note = ('<div class="preview-note"><div class="wrap">Preview. The map, the forms and the video players '
            'are switched off here and work on the live site.</div></div>') if PREVIEW else ""
    tera = (f'<div class="tera" aria-hidden="true"><i></i><i></i><b>{logo_img()}</b></div>'
            if page.get("path") == "/" else "")
    return (
        tera + '<a class="skip" href="#main">Skip to content</a>' + note +
        '<header class="site-header"><div class="wrap site-header-inner">'
        f'<a class="brand" href="{url("/")}"><span class="brand-mark">{logo_img()}</span>'
        f'<span class="brand-name">{SITE["name"]}<small>{SITE["tagline"]}</small></span></a>'
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>'
        f'<nav class="nav" id="site-nav" aria-label="Main"><ul>{links}</ul></nav>'
        '</div></header>')


def footer():
    def lst(items):
        return "".join(f'<li><a href="{url(p)}">{l}</a></li>' for p, l in items)
    return (
        '<footer class="site-footer"><div class="wrap footer-grid">'
        '<div class="footer-brand">'
        f'<span class="footer-logo">{logo_img()}</span>'
        f'<p class="footer-name">{SITE["name"]}</p>'
        f'<p>{SITE["tagline"]}</p>'
        f'<address>{SITE["street"]},<br>{SITE["locality"]},<br>{SITE["region"]} {SITE["postcode"]}, India</address>'
        f'<p><a href="tel:{SITE["phone_e164"]}">{SITE["phone_display"]}</a><br>'
        f'<a href="mailto:{SITE["email"]}">{SITE["email"]}</a></p></div>'
        '<nav aria-label="About Kuchipudi"><h2>Kuchipudi</h2><ul>'
        + lst([("/kuchipudi-dance/", "Kuchipudi dance"), ("/kuchipudi-history/", "History of Kuchipudi"),
               ("/kuchipudi-gurus/", "Kuchipudi gurus"), ("/kuchipudi-flag/", "The Kuchipudi flag")]) +
        '</ul></nav><nav aria-label="The Society"><h2>The Society</h2><ul>'
        + lst([("/the-team/", "The team"), ("/events/", "Events"),
               ("/application-for-institutions/", "Application for institutions"), ("/contact-us/", "Contact us")]) +
        '</ul></nav><nav aria-label="Follow us"><h2>Follow</h2><ul>'
        f'<li><a href="{SITE["youtube"]}" rel="noopener">YouTube</a></li>'
        f'<li><a href="{SITE["instagram"]}" rel="noopener">Instagram</a></li>'
        f'<li><a href="{SITE["facebook"]}" rel="noopener">Facebook</a></li>'
        '</ul></nav></div>'
        '<div class="wrap footer-base">'
        f'<span>© 2026 {SITE["name"]}</span>'
        f'<span><a href="{url("/privacy-policy/")}">Privacy Policy</a><a href="{url("/terms-and-conditions/")}">Terms and Conditions</a></span>'
        '<span>Designed and maintained by Vikram Pagadala, Premam Productions</span>'
        '</div></footer>')


def page_art(page):
    kind = PAGE_ART.get(page["path"])
    if kind == "scene":
        return ('<div class="page-art"><div class="arch">'
                + pic("scene", "Painting of Kuchipudi dancers before a temple, from the Society's festival poster", "310px", eager=True)
                + '</div></div>')
    if kind == "painting":
        return ('<div class="page-art"><div class="arch">'
                + pic("painting", "Painting of Siddhendra Yogi dancing", "310px", eager=True) + '</div></div>')
    if kind == "flag":
        return '<div class="page-art page-art-flag">' + pic("flag", "The Kuchipudi flag", "190px", small=True) + '</div>'
    if kind == "poster":
        return '<div class="page-art page-art-poster">' + pic("poster-en", POSTER_EN, "240px", small=True) + '</div>'
    if kind == "fan":
        trio = ("vempati-chinna-satyam", "vedantam-rattaiah-sarma", "sobha-naidu")
        by = {g["id"]: g for g in D.GURUS}
        return ('<div class="page-art page-art-fan">'
                + "".join(pic(k, by[k]["name"], "160px", small=True) for k in trio) + '</div>')
    return ""


def page_head(page):
    lede = f'<p class="lede">{page["lede"]}</p>' if page.get("lede") else ""
    return (
        '<div class="page-head"><div class="wrap page-head-inner"><div class="page-head-copy">'
        f'<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{url("/")}">Home</a></li>'
        f'<li aria-current="page">{page["crumb"]}</li></ol></nav>'
        f'<h1>{words(page["h1"])}</h1>{lede}</div>{page_art(page)}</div></div>')


def toc(body):
    heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
    rows = "".join(f'<li><a href="#{i}">{re.sub(r"<[^>]+>", "", t)}</a></li>' for i, t in heads)
    return f'<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>{rows}</ol></nav>'


def body_for(page):
    frag = expand((ROOT / "content" / page["file"]).read_text(encoding="utf-8"))
    layout = page["layout"]
    if layout == "home":
        inner = frag
    elif layout == "article":
        inner = (page_head(page) + '<div class="wrap article"><article class="prose">' + frag +
                 '</article><aside class="article-aside">' + toc(frag) + '</aside></div>')
    elif layout == "legal":
        inner = page_head(page) + '<div class="wrap"><div class="legal">' + frag + '</div></div>'
    else:
        inner = page_head(page) + '<div class="wrap wide">' + frag + '</div>'
    return smart(header(page) + f'<main id="main">{inner}</main>' + footer())


FONT_FACES = """
@font-face{font-family:"Tiro Telugu";font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/tiro-telugu-telugu-400-normal.woff2) format("woff2");unicode-range:U+0951-0952,U+0964-0965,U+0C00-0C7F,U+1CDA,U+1CF2,U+200C-200D,U+25CC}
@font-face{font-family:"Tiro Telugu";font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/tiro-telugu-latin-ext-400-normal.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Tiro Telugu";font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/tiro-telugu-latin-400-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Tiro Telugu";font-style:italic;font-weight:400;font-display:swap;src:url(../fonts/tiro-telugu-latin-ext-400-italic.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Tiro Telugu";font-style:italic;font-weight:400;font-display:swap;src:url(../fonts/tiro-telugu-latin-400-italic.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Anek Telugu";font-style:normal;font-weight:100 800;font-display:swap;src:url(../fonts/anek-telugu-latin-ext-wght-normal.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Anek Telugu";font-style:normal;font-weight:100 800;font-display:swap;src:url(../fonts/anek-telugu-latin-wght-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
""".strip()

GOOGLE_FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
                'family=Anek+Telugu:wght@400..700&amp;family=Tiro+Telugu:ital@0;1&amp;display=swap">')

CSS = (PUBLIC / "assets/css/site.css").read_text(encoding="utf-8")
JS = (PUBLIC / "assets/js/site.js").read_text(encoding="utf-8")
VERSION = hashlib.sha1((CSS + JS).encode()).hexdigest()[:8]

# Runs before the page paints. Marks that script is available and, on the
# first visit of a session to the home page, asks for the opening curtain.
BOOT = 'document.documentElement.className+=" js";'
BOOT_HOME = (BOOT + 'try{if(!sessionStorage.getItem("kh-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)'
             '{document.documentElement.className+=" intro";sessionStorage.setItem("kh-seen","1")}}catch(e){}')


def ascii_safe(markup):
    """Write every non-ASCII character as a numeric reference, so the page
    reads correctly whatever character set the host announces."""
    return "".join(c if ord(c) < 128 else f"&#{ord(c)};" for c in markup)


def document(page, body, noindex=False):
    title, desc = esc(page["title"]), esc(page["description"])
    home = page.get("path") == "/"
    boot = BOOT_HOME if home else BOOT
    if PREVIEW:
        body = ascii_safe(body)
        # The home page is published without a document shell (the host adds
        # one), so it starts with its own <title> and <style>.
        head_bits = f'{GOOGLE_FONTS}<style>{CSS}</style><script>{boot}</script>'
        tail = f"<script>{JS}</script>"
        if home:
            return f'<title>{esc(SITE["name"])}</title>\n{head_bits}\n{body}\n{tail}\n'
        return ('<!doctype html>\n<html lang="en-IN">\n<head>\n<meta charset="utf-8">\n'
                '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                f'<title>{title}</title>\n'
                '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>\n'
                f'{head_bits}\n</head>\n<body>\n{body}\n{tail}\n</body>\n</html>\n')
    here = absolute(page["path"]) if page.get("path") else ""
    robots = "noindex, follow" if noindex else "index, follow, max-image-preview:large, max-snippet:-1"
    canonical = "" if noindex else f'<link rel="canonical" href="{here}">\n'
    og = "" if noindex else (
        f'<meta property="og:type" content="{"article" if page["schema"].startswith("article") else "website"}">\n'
        f'<meta property="og:site_name" content="{esc(SITE["name"])}">\n'
        f'<meta property="og:title" content="{title}">\n'
        f'<meta property="og:description" content="{desc}">\n'
        f'<meta property="og:url" content="{here}">\n'
        f'<meta property="og:image" content="{absolute(OG_IMAGE)}">\n'
        '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
        f'<meta property="og:image:alt" content="{esc(SITE["name"])}: {esc(SITE["tagline"])}">\n'
        '<meta property="og:locale" content="en_IN">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<script type="application/ld+json">{schema(page)}</script>\n')
    scene = D.IMAGES["scene"]
    preload_hero = (f'<link rel="preload" as="image" href="/assets/img/{scene["src"]}" '
                    f'imagesrcset="/assets/img/{scene["small"]} {scene["sw"]}w, /assets/img/{scene["src"]} {scene["w"]}w" '
                    'imagesizes="(max-width: 900px) 84vw, 520px" fetchpriority="high">\n') if home else ""
    gsc_meta = (f'<meta name="google-site-verification" content="{D.GOOGLE_SITE_VERIFICATION}">\n'
                if getattr(D, "GOOGLE_SITE_VERIFICATION", "") else
                '<!-- Google Search Console: paste your verification meta tag on the next line -->\n')
    ga_snippet = ((f'<!-- Google Analytics 4 -->\n'
                   f'<script async src="https://www.googletagmanager.com/gtag/js?id={D.GOOGLE_ANALYTICS_ID}"></script>\n'
                   f'<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag("js",new Date());gtag("config","{D.GOOGLE_ANALYTICS_ID}");</script>\n')
                  if getattr(D, "GOOGLE_ANALYTICS_ID", "") else '')
    return (
        '<!doctype html>\n<html lang="en-IN">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{title}</title>\n<meta name="description" content="{desc}">\n'
        f'{canonical}<meta name="robots" content="{robots}">\n'
        f'{gsc_meta}{ga_snippet}'
        '<meta name="theme-color" content="#24101A">\n'
        '<link rel="icon" href="/favicon.ico" sizes="32x32">\n'
        '<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">\n'
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
        '<link rel="manifest" href="/site.webmanifest">\n'
        '<link rel="preload" href="/assets/fonts/tiro-telugu-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n'
        '<link rel="preload" href="/assets/fonts/anek-telugu-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>\n'
        f'{preload_hero}'
        f'<link rel="stylesheet" href="/assets/css/site.css?v={VERSION}">\n'
        f'<script>{boot}</script>\n'
        f'<script src="/assets/js/site.js?v={VERSION}" defer></script>\n'
        f'{og}</head>\n<body>\n{body}\n</body>\n</html>\n')


NOT_FOUND = {
    "title": "Page not found | Kuchipudi Heritage Arts Society",
    "description": "This page could not be found on the Kuchipudi Heritage Arts Society website.",
    "schema": "page",
}


def not_found_body():
    inner = (
        '<div class="wrap lost"><h1>We could not find that page</h1>'
        '<p class="lede">The address may have changed when the site was rebuilt. These pages are a good place to start again.</p>'
        '<ul class="jump">' + "".join(f'<li><a href="{url(p)}">{l}</a></li>' for p, l in D.NAV) + '</ul>'
        f'<p><a class="btn" href="{url("/")}">Go to the home page</a></p></div>')
    return smart(header({}) + f'<main id="main">{inner}</main>' + footer())


# ---------------------------------------------------------------------------
# Server files
# ---------------------------------------------------------------------------
def write(rel, text):
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def image_redirects():
    """Old WordPress image URLs -> their new home, so image search keeps them."""
    seen, rows = set(), []
    for key, im in D.IMAGES.items():
        old = im["old"].replace(D.DOMAIN, "")
        if key in ("scene", "poster-thumb") or old in seen:
            continue
        seen.add(old)
        rows.append((old, "/assets/img/" + im["src"]))
    return rows


def htaccess():
    lines = [
        "# kuchipudiheritage.com  (Apache / cPanel hosting)",
        "ErrorDocument 404 /404.html",
        "Options -Indexes",
        "",
        "<IfModule mod_rewrite.c>",
        "RewriteEngine On",
        "# one address only: https, without www",
        "RewriteCond %{HTTPS} !=on",
        "RewriteCond %{HTTP:X-Forwarded-Proto} !https",
        "RewriteRule ^ https://kuchipudiheritage.com%{REQUEST_URI} [L,R=301]",
        "RewriteCond %{HTTP_HOST} ^www\\.kuchipudiheritage\\.com$ [NC]",
        "RewriteRule ^ https://kuchipudiheritage.com%{REQUEST_URI} [L,R=301]",
        "# /page/index.html -> /page/",
        "RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?] [NC]",
        "RewriteRule ^ /%1 [L,R=301]",
        "</IfModule>",
        "",
        "# old WordPress addresses",
    ]
    for old, new in D.REDIRECTS:
        lines.append(f"RedirectMatch 301 ^{re.escape(old.rstrip('/'))}/?$ {new}")
    lines.append("# old WordPress image addresses")
    for old, new in image_redirects():
        lines.append(f"RedirectMatch 301 ^{re.escape(old)}$ {new}")
    lines += [
        "RedirectMatch 301 ^/wp-(admin|login\\.php).*$ /",
        "",
        "<IfModule mod_expires.c>",
        "ExpiresActive On",
        'ExpiresByType text/html "access plus 10 minutes"',
        'ExpiresByType text/css "access plus 1 year"',
        'ExpiresByType application/javascript "access plus 1 year"',
        'ExpiresByType text/javascript "access plus 1 year"',
        'ExpiresByType font/woff2 "access plus 1 year"',
        'ExpiresByType image/png "access plus 1 month"',
        'ExpiresByType image/jpeg "access plus 1 month"',
        'ExpiresByType image/webp "access plus 1 month"',
        "</IfModule>",
        "",
        "<IfModule mod_deflate.c>",
        "AddOutputFilterByType DEFLATE text/html text/css application/javascript text/javascript application/json application/xml text/plain",
        "</IfModule>",
        "",
        "<IfModule mod_headers.c>",
        'Header always set X-Content-Type-Options "nosniff"',
        'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
        'Header always set X-Frame-Options "SAMEORIGIN"',
        'Header always set Strict-Transport-Security "max-age=31536000"',
        "</IfModule>",
        "",
        "AddType font/woff2 .woff2",
        "AddType image/webp .webp",
        "AddType application/manifest+json .webmanifest",
        "",
    ]
    return "\n".join(lines)


def netlify_redirects():
    rows = ["# Netlify and Cloudflare Pages read this file. Apache reads .htaccess instead."]
    for old, new in D.REDIRECTS:
        rows.append(f"{old.rstrip('/')}  {new}  301")
        rows.append(f"{old}  {new}  301")
    for old, new in image_redirects():
        rows.append(f"{old}  {new}  301")
    return "\n".join(rows) + "\n"


HEADERS = """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/assets/css/*
  Cache-Control: public, max-age=31536000, immutable
/assets/js/*
  Cache-Control: public, max-age=31536000, immutable
/assets/img/*
  Cache-Control: public, max-age=2592000
"""


def sitemap():
    rows = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in D.PAGES:
        rows.append(f'  <url><loc>{absolute(p["path"])}</loc><lastmod>{D.BUILD_DATE}</lastmod>'
                    f'<priority>{p["priority"]}</priority></url>')
    rows.append("</urlset>")
    return "\n".join(rows) + "\n"


MANIFEST = json.dumps({
    "name": SITE["name"], "short_name": "Kuchipudi Heritage", "start_url": "/", "display": "browser",
    "background_color": "#FBF6F0", "theme_color": "#24101A",
    "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"}],
}, indent=2)


# ---------------------------------------------------------------------------
# Build and check
# ---------------------------------------------------------------------------
def out_name(page):
    if PREVIEW:
        return url(page["path"])
    return (page["path"].strip("/") + "/index.html").lstrip("/")


def main():
    # The preview is rebuilt from nothing. The live folder is only ever
    # written over, never emptied.
    if PREVIEW and OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    built, problems = {}, []

    for page in D.PAGES:
        doc = document(page, body_for(page))
        built[page["path"]] = doc
        write(out_name(page), doc)
    write("404.html", document(NOT_FOUND, not_found_body(), noindex=True))

    if PREVIEW:
        shutil.copytree(PUBLIC / "assets", OUT / "assets", dirs_exist_ok=True)
        for name in ("favicon.ico", "favicon-96.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
            shutil.copy(PUBLIC / name, OUT / name)
        shutil.rmtree(OUT / "assets/img/og", ignore_errors=True)
    else:
        for stale in ("favicon.svg", "assets/img/hero.png", "hero.png"):
            (OUT / stale).unlink(missing_ok=True)
        if (OUT / "register").exists():
            shutil.rmtree(OUT / "register", ignore_errors=True)
        write("site.webmanifest", MANIFEST)
        write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {D.DOMAIN}/sitemap.xml\n")
        write("sitemap.xml", sitemap())
        write(".htaccess", htaccess())
        write("_redirects", netlify_redirects())
        write("_headers", HEADERS)

    # ---- checks ----
    ids = {path: set(re.findall(r'\sid="([^"]+)"', doc)) for path, doc in built.items()}
    print(f'{"page":34} {"title":>5} {"desc":>5}  h1  imgs  words')
    for page in D.PAGES:
        doc = built[page["path"]]
        t, d = len(page["title"]), len(page["description"])
        h1 = len(re.findall(r"<h1[\s>]", doc))
        text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", doc, flags=re.S)
        words_n = len(re.sub(r"<[^>]+>", " ", text).split())
        imgs = re.findall(r'<img\b[^>]*>', doc)
        print(f'{page["path"]:34} {t:5} {d:5}  {h1:2}  {len(imgs):4}  {words_n}')
        if t > 60:
            problems.append(f'{page["path"]}: title is {t} characters')
        if not 110 <= d <= 160:
            problems.append(f'{page["path"]}: description is {d} characters')
        if h1 != 1:
            problems.append(f'{page["path"]}: {h1} h1 elements')
        if "[[" in doc:
            problems.append(f'{page["path"]}: unexpanded token: ' + doc[doc.index("[["):][:40])
        for m in imgs:
            if " alt=" not in m:
                problems.append(f'{page["path"]}: image without alt')
        for ref in re.findall(r'(?:src|href)="(/?assets/img/[^"]+)"', doc) + \
                [u.split(" ")[0] for s in re.findall(r'srcset="([^"]+)"', doc) for u in s.split(", ")]:
            if not (OUT / ref.lstrip("/")).exists():
                problems.append(f'{page["path"]}: missing picture {ref}')
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', doc, flags=re.S):
            json.loads(block)
        if PREVIEW:
            continue
        for href in re.findall(r'href="([^"]+)"', doc):
            if href.startswith(("http", "mailto:", "tel:", "/assets/")) or href in (
                    "/favicon.ico", "/favicon-96.png", "/apple-touch-icon.png", "/site.webmanifest"):
                continue
            if href.startswith("#"):
                if href[1:] not in ids[page["path"]]:
                    problems.append(f'{page["path"]}: missing anchor {href}')
                continue
            path, _, frag = href.partition("#")
            if path not in built:
                problems.append(f'{page["path"]}: link to unknown page {href}')
            elif frag and frag not in ids[path]:
                problems.append(f'{page["path"]}: link to missing anchor {href}')
    print(f"\nBuilt {len(built) + 1} pages into {OUT}")
    if problems:
        print("\nPROBLEMS")
        for p in sorted(set(problems)):
            print("  -", p)
        sys.exit(1)
    print("All checks passed.")


if __name__ == "__main__":
    main()
