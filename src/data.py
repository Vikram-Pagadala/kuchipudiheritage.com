"""Site data for kuchipudiheritage.com.

Everything that appears on more than one page lives here: the society's
details, the navigation, the gurus, the team, the videos and the image map.
Edit this file, then run `python3 build.py`.
"""

DOMAIN = "https://kuchipudiheritage.com"
BUILD_DATE = "2026-10-29"

# Google Search Console verification meta tag content string (e.g., "abcdef123456...").
# If provided, it is automatically injected into the <head> of every page.
GOOGLE_SITE_VERIFICATION = ""

# Google Analytics 4 Measurement ID (e.g., "G-XXXXXXXXXX").
# If provided, the official gtag.js snippet is automatically included on every page.
GOOGLE_ANALYTICS_ID = ""

SITE = {
    "name": "Kuchipudi Heritage Arts Society",
    "short": "KHAS",
    "tagline": "The Tradition of Kuchipudi",
    "telugu": "కూచిపూడి నాట్య సంప్రదాయం",
    "email": "info.kuchipudiheritage@gmail.com",
    "phone_display": "+91\u00a090322\u00a028439",
    "phone_e164": "+919032228439",
    "phone2_display": "+91\u00a090635\u00a055159",
    "phone2_e164": "+919063555159",
    "street": "D.No. 2-86, Kuchipudi Village",
    "locality": "Movva Mandal, Krishna District",
    "region": "Andhra Pradesh",
    "postcode": "521136",
    "country": "IN",
    "youtube": "https://www.youtube.com/@kuchipudiheritagearts",
    "instagram": "https://www.instagram.com/kuchipudiheritageartssociety",
    "facebook": "https://www.facebook.com/people/Kuchipudi-Heritage-Art/pfbid0PHTXqFvZAUFDsqjEG7LvZJNfMkNMHByBgGVBeqjNyTVfqS7WndK71v1ovR2iwKp2l/",
    "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15321.347794436957!2d80.89974539509453!3d16.254492301231974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a49fc0d9594a6dd%3A0x4f7925f7abedb617!2sKuchipudi%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1772650173107!5m2!1sen!2sin",
    "map_link": "https://www.google.com/maps/search/?api=1&query=Kuchipudi%2C+Andhra+Pradesh+521136",
    "form_contact": "https://docs.google.com/forms/d/e/1FAIpQLSfO5uIRnvvzaH6ED335cjgRL7En7ym0QX1mv3JYFHO8xRx5KQ/viewform",
    "form_apply": "https://docs.google.com/forms/d/e/1FAIpQLSebRwzgDCnEYNIoeZ276u0tYRk-G3wjFHrr8T5-PkLPUd8Vfw/viewform",
}

# Header navigation, in order. The last entry is drawn as the button.
NAV = [
    ("/kuchipudi-dance/", "Kuchipudi dance"),
    ("/kuchipudi-history/", "History"),
    ("/kuchipudi-gurus/", "Gurus"),
    ("/kuchipudi-flag/", "The flag"),
    ("/events/", "Events"),
    ("/the-team/", "The team"),
    ("/contact-us/", "Contact"),
]
NAV_BUTTON = ("/application-for-institutions/", "Apply")

# ---------------------------------------------------------------------------
# Pages: path, source fragment, SEO title, meta description, H1, breadcrumb
# label, schema type, sitemap priority.
# ---------------------------------------------------------------------------
PAGES = [
    {
        "path": "/",
        "file": "home.html",
        "title": "Kuchipudi Heritage Arts Society: Traditional Kuchipudi Dance",
        "description": "Kuchipudi Heritage Arts Society preserves and presents traditional Kuchipudi dance from Kuchipudi village, Andhra Pradesh. History, gurus, the flag and events.",
        "crumb": "Home",
        "schema": "home",
        "priority": "1.0",
        "layout": "home",
    },
    {
        "path": "/kuchipudi-dance/",
        "file": "kuchipudi-dance.html",
        "title": "Kuchipudi Dance: Origin, Features, Costume and Repertoire",
        "description": "What Kuchipudi dance is, which state it comes from and what sets it apart: nritta, nritya and natya, the Tarangam plate dance, costume, music and repertoire.",
        "h1": "Kuchipudi dance: the classical dance-drama of Andhra Pradesh",
        "lede": "Kuchipudi is one of the eight classical dances of India. It comes from Kuchipudi, a village in the Krishna district of Andhra Pradesh, and carries the village's name. It began as a dance-drama performed by troupes of men, and today it is danced both as drama and as a solo recital.",
        "crumb": "Kuchipudi dance",
        "schema": "article+faq",
        "priority": "0.9",
        "layout": "article",
    },
    {
        "path": "/kuchipudi-history/",
        "file": "kuchipudi-history.html",
        "title": "History of Kuchipudi Dance: Siddhendra Yogi to Today",
        "description": "The history and origin of Kuchipudi dance: Siddhendra Yogi and Bhama Kalapam, the village of performer families, the solo form, classical status and today.",
        "h1": "The history of Kuchipudi dance",
        "lede": "Kuchipudi grew out of the dance-dramas of the Telugu country. A saint-poet, Siddhendra Yogi, gave it a founding work. A village of performer families kept it for three hundred years. Gurus of the twentieth century carried it from the village square to the concert stage.",
        "crumb": "History",
        "schema": "article",
        "priority": "0.9",
        "layout": "article",
    },
    {
        "path": "/kuchipudi-gurus/",
        "file": "kuchipudi-gurus.html",
        "title": "Kuchipudi Gurus and Legendary Dancers of the Tradition",
        "description": "Profiles of fifteen legendary Kuchipudi gurus and dancers, from Chinta Venkataramayya to Vempati Chinna Satyam, Vedantam Satyanarayana Sarma and Sobha Naidu.",
        "h1": "Kuchipudi gurus: fifteen masters who carried the tradition",
        "lede": "Kuchipudi passes from teacher to student. These fifteen gurus and performers, listed in order of birth from 1860 to 1954, shaped the dance-drama, created the solo form and took Kuchipudi from its village to the world.",
        "crumb": "Gurus",
        "schema": "gurus",
        "priority": "0.9",
        "layout": "wide",
    },
    {
        "path": "/kuchipudi-flag/",
        "file": "kuchipudi-flag.html",
        "title": "The Kuchipudi Flag (Patakam): Meaning and Symbolism",
        "description": "The Kuchipudi flag, or patakam, was created in 1974. See what its pink cloth, sugarcane pole and Satyabhama jada stand for, and how its 50th year was marked.",
        "h1": "The Kuchipudi flag: what the patakam means",
        "lede": "Kuchipudi has a flag of its own. The patakam, created in 1974, is a light pink banner hoisted on a stalk of sugarcane and painted with the Satyabhama jada, the long plait worn by the heroine of Bhama Kalapam. Every part of it carries a meaning.",
        "crumb": "The flag",
        "schema": "article",
        "priority": "0.8",
        "layout": "article",
    },
    {
        "path": "/events/",
        "file": "events.html",
        "title": "Kuchipudi Dance Confluence 2026 and Kuchipudi Festivals",
        "description": "The International Kuchipudi Dance Confluence, 25 to 27 December 2026, Geeta Saaram Natya Vedam, and recordings of the Kuchipudi Pathaka Swarnotsavalu.",
        "h1": "Kuchipudi events and festivals",
        "lede": "The Society brings gurus, performers, scholars and rasikas together in Kuchipudi village and abroad. Next is the International Kuchipudi Dance Confluence, from 25 to 27 December 2026.",
        "crumb": "Events",
        "schema": "events",
        "priority": "0.8",
        "layout": "wide",
    },
    {
        "path": "/the-team/",
        "file": "the-team.html",
        "title": "Our Team and Advisory Board | Kuchipudi Heritage Arts",
        "description": "Meet the gurus and scholars who lead Kuchipudi Heritage Arts Society: Pasumarthy Ramalinga Sastry, Vedantam Raghava, Dr. Kiran Vedantam and Dr. Chalapathi Rao.",
        "h1": "The people behind Kuchipudi Heritage Arts Society",
        "lede": "The Society is led by artists and scholars from Kuchipudi village. Governance, artistic leadership and advisory oversight are kept distinct, so that every initiative is transparent and accountable.",
        "crumb": "The team",
        "schema": "team",
        "priority": "0.7",
        "layout": "wide",
    },
    {
        "path": "/contact-us/",
        "file": "contact-us.html",
        "title": "Contact Kuchipudi Heritage Arts Society, Kuchipudi Village",
        "description": "Contact Kuchipudi Heritage Arts Society at Kuchipudi village, Movva mandal, Krishna district, Andhra Pradesh. Call +91 90322 28439 or send an inquiry online.",
        "h1": "Contact Kuchipudi Heritage Arts Society",
        "lede": "Write, call or visit us in Kuchipudi village. For collaborations, media requests and event information, the inquiry form reaches the right person fastest.",
        "crumb": "Contact",
        "schema": "contact",
        "priority": "0.6",
        "layout": "wide",
    },
    {
        "path": "/application-for-institutions/",
        "file": "application-for-institutions.html",
        "title": "Geeta Saaram Natya Vedam 2026: Application for Institutions",
        "description": "Kuchipudi artists and institutions can register for Geeta Saaram Natya Vedam 2026, the world record event. Review terms and submit online registration.",
        "h1": "Geeta Saaram Natya Vedam 2026: application for institutions",
        "lede": "Kuchipudi teachers and institutions are invited to enter their students for Geeta Saaram Natya Vedam 2026. Applications close on 30 November 2026.",
        "crumb": "Apply",
        "schema": "page",
        "priority": "0.8",
        "layout": "wide",
    },
    {
        "path": "/privacy-policy/",
        "file": "privacy-policy.html",
        "title": "Privacy Policy | Kuchipudi Heritage Arts Society",
        "description": "How Kuchipudi Heritage Arts Society collects, uses, stores and protects your personal information, and the rights you have under Indian data protection law.",
        "h1": "Privacy Policy",
        "crumb": "Privacy Policy",
        "schema": "page",
        "priority": "0.2",
        "layout": "legal",
    },
    {
        "path": "/terms-and-conditions/",
        "file": "terms-and-conditions.html",
        "title": "Terms and Conditions | Kuchipudi Heritage Arts Society",
        "description": "The terms and conditions that govern use of the Kuchipudi Heritage Arts Society website, including content ownership, liability and governing law.",
        "h1": "Terms and Conditions",
        "crumb": "Terms and Conditions",
        "schema": "page",
        "priority": "0.2",
        "layout": "legal",
    },
]

# ---------------------------------------------------------------------------
# Gurus, in order of birth. `died` is None where the old site gave only a
# birth year. Bios are the Society's own text, edited for clarity.
# ---------------------------------------------------------------------------
GURUS = [
    {
        "id": "chinta-venkataramayya",
        "name": "Chinta Venkataramayya",
        "born": 1860, "died": 1949,
        "role": "Sutradhara and founder of the Venkatarama Natya Mandali",
        "bio": [
            "Born to Arundhatamma and Sivaramayya, Chinta Venkataramayya trained under his elder brother Venkataratnam and under Yeleswarapu Narayanappa. He first went on stage at the age of eight and played both male and female characters before becoming a Sutradhara, the principal narrator of the Kuchipudi dance-drama.",
            "He founded the Venkatarama Natya Mandali, a pioneering troupe for training dancers and presenting Kuchipudi. Under his leadership it toured dance-dramas across the region until 1936, among them Prahlada Charitra, Usha Parinayam, Sasirekha Parinayam, Gayopakhyanam, Rama Natakam and Mohini Rukmangada.",
        ],
    },
    {
        "id": "vempati-venkatanarayana",
        "name": "Vempati Venkatanarayana",
        "born": 1871, "died": 1935,
        "role": "Performer of Bhama Kalapam, known as Abhinava Satyabhama",
        "bio": [
            "The son of Punnamma and Kodandaramayya, Vempati Venkatanarayana learned the art from his father. He was known for female roles such as Satyabhama, Dadinamma and the Balinta vesham, and he kept performing until he was sixty. In one celebrated performance he played Dadinamma for three hours while tied to a cot.",
            "His command of tala prastara, the rhythmic footwork, and of facial expression earned him the title Abhinava Satyabhama. He performed Bhama Kalapam more than a thousand times across the Andhra region. Between 1880 and 1930, when drama companies from Dharwad drew large audiences in Andhra, he studied their stage decor and presentation and brought those techniques into Kuchipudi dance-dramas.",
        ],
    },
    {
        "id": "vedantam-lakshminarayana-sastry",
        "name": "Vedantam Lakshminarayana Sastry",
        "born": 1886, "died": 1956,
        "role": "The guru who opened Kuchipudi to solo performance",
        "bio": [
            "The son of Savitramma and Venkatesam, Vedantam Lakshminarayana Sastry learned from Vempati Venkatanarayana and mastered Bhama Kalapam and Golla Kalapam. A scholar of dance, music and rhythm, he is credited with opening the dance-drama tradition to solo performance.",
            "He choreographed solo pieces to ashtapadis, padams, javalis and verses from Krishna Karnamritam and Pushpabana Vilasam, and filled them with sattvika abhinaya. He taught each disciple individually and drew out their particular strengths. His students included Vedantam Jagannadha Sarma, Vempati Peda Satyam, Vempati Chinna Satyam and Ayyanki Tandava Krishna.",
        ],
    },
    {
        "id": "tadepalli-perayya",
        "name": "Tadepalli Perayya",
        "born": 1886, "died": 1942,
        "role": "Guru and Sutradhara",
        "bio": [
            "Born to Gauramma and Subbarayudu, Tadepalli Perayya is remembered above all as a guru. He was admired on stage in Bhama Kalapam and Golla Kalapam, and he was among the first to take Kuchipudi beyond its traditional boundaries.",
            "He taught devadasis from Meduru and Nangigadda, directed their performances and served as Sutradhara himself. Krishnaveni of Nangigadda and Balatripura Sundari of Repalle were among his students. As a Sutradhara he was known for his presence of mind and his rapport with the audience.",
        ],
    },
    {
        "id": "chinta-krishna-murthy",
        "name": "Chinta Krishna Murthy",
        "born": 1912, "died": 1969,
        "role": "Sutradhara of the Venkatarama Natya Mandali",
        "bio": [
            "The son of Annapurnamma and Chinta Venkataramayya, Chinta Krishna Murthy was initiated into dance by his father and learned music from Yeleswarapu Sitaramanjaneyulu. As a child he played Prahlada, Lohitasya, Dharmangada, Lava and Kusa. From the age of fifteen he took hero roles, among them Harischandra, Rama, Lakshmana, Rukmangada, Krishna, Arjuna and Devendra.",
            "Audiences loved his Harischandra and Krishna, his snake-charmer in Bhakta Prahlada and his washerman in Rama Natakam. After his father and his elder brother Rama Murthy, he led the Venkatarama Natya Mandali as its Sutradhara, a role praised by the Harikatha master Adibhatla Narayana Dasu. His troupe kept more than ten dance-dramas in performance.",
        ],
    },
    {
        "id": "vedantam-raghavayya",
        "name": "Vedantam Raghavayya",
        "born": 1919, "died": 1971,
        "role": "Dancer, and the first Kuchipudi artist in professional cinema",
        "bio": [
            "Born to Sitamma and Ramayya, Vedantam Raghavayya trained under Chinta Venkataramayya and also studied music. As a child artist he played Prahlada, Lava, Kusa and Lohitasya. He won wide acclaim in female roles, including Usha, Mohini, Sita, Chandramati, Lilavati and Satyabhama, and his Usha is still spoken of as unsurpassed. Later he played Krishna, Harischandra and Hiranyakasipu.",
            "In 1941 he toured the country with Vempati Peda Satyam and Tandava Krishna. At the invitation of Gudavalli Ramabrahmam he entered cinema, appearing in films including Rytu Bidda, Rukmangada, Mayalokam and Garuda Garvabhangam, and directing dance for films such as Tyagayya and Balaraju. He was the first Kuchipudi artist to work professionally in film.",
        ],
    },
    {
        "id": "vedantam-parvateesam",
        "name": "Vedantam Parvateesam",
        "born": 1920, "died": None,
        "role": "Teacher, writer and creator of the Kuchipudi flag",
        "bio": [
            "Vedantam Parvateesam followed his teachers Chinta Venkataramayya, Vedantam Ramakrishnayya and Vedantam Raghavayya, and learned music from Yeleswarapu Sitaramanjaneyulu. In 1957 he was a founding member of Siddhendra Kalakshetram with Banda Kanakalingeswara Rao, and he served the institution until he retired as its Principal.",
            "Over fifty years he taught many students, including Vedantam Rattaiah Sarma, Yeleswarapu Nageswara Sarma, Chinta Ramamurthy and Pasumarthy Kesava Prasad. On stage he was known as Krishna, Abhimanyu and Chandramati. He was also a writer: his compositions and dance-dramas appeared regularly in Natyakala, the monthly journal of the Andhra Pradesh Sangeet Natak Akademi, Hyderabad. In 1974 he created <a href=\"[[url:/kuchipudi-flag/]]\">the Kuchipudi flag</a>.",
        ],
    },
    {
        "id": "vempati-peda-satyam",
        "name": "Vempati Peda Satyam",
        "born": 1922, "died": 1982,
        "role": "Dancer and choreographer who took Kuchipudi to Madras",
        "bio": [
            "Vempati Peda Satyanarayana, known as Peda Satyam, was born to Sitamma and Subba Rao. He began training at thirteen under Chinta Venkataramayya and took advanced instruction from Vedantam Lakshminarayana Sastry. He also studied Bharatanatyam and Kathakali with Ram Gopal of Bangalore, and painting with Adivi Bapiraju.",
            "He worked first with the Venkatarama Natya Mandali and then with Vedantam Lakshminarayana Sastry's troupe, and for a time he turned to painting. He returned to dance in 1940, performing the Kapali dance in the film Meerabai. With Vedantam Raghavayya and Ayyanki Tandava Krishna he founded Natyasangha and toured the country, and in 1943 he established the Kuchipudi Kala Vignana Kendram in Madras. Working with Raghavayya, he brought new pieces such as Radha Krishna and Siva Parvati into the Kuchipudi repertoire.",
        ],
    },
    {
        "id": "pasumarthi-krishna-murthy",
        "name": "Pasumarthi Krishna Murthy",
        "born": 1927, "died": None,
        "role": "Dancer and dance director for nearly two hundred films",
        "bio": [
            "Born to Adilakshmi and Ramayya, Pasumarthi Krishna Murthy trained under Chinta Venkataramayya and Chinta Ramamurthy. He was known for his abhinaya and for female roles such as Satyabhama, Gollabhama, Usha and Sasirekha, skills he sharpened in his youth with the Chinta troupe. Early in his career he danced solo pieces, including tarangams and sabdams, in the intervals of dance-dramas.",
            "Following Vempati Peda Satyam and Vedantam Raghavayya, he moved to Madras, where he directed dance sequences for nearly two hundred films in Telugu, Tamil, Kannada, Malayalam and Hindi. His choreography blended classical and folk elements, and his comic song sequences were especially popular.",
        ],
    },
    {
        "id": "vempati-chinna-satyam",
        "name": "Vempati Chinna Satyam",
        "born": 1929, "died": 2012,
        "role": "Founder of the Kuchipudi Art Academy, Madras",
        "bio": [
            "Born to Varalakshmamma and Chalamayya, Vempati Chinna Satyam studied with Tadepalli Perayya and Pasumarti Kondala Rayudu, then with his elder cousin Vempati Peda Satyam, and he refined the form under Vedantam Lakshminarayana Sastry. As a child he played Lava, Kusa, Lohitasya and Prahlada. Later he played Satyabhama and Gollabhama, and Shiva in his own Ksheera Sagara Mathanam.",
            "In 1963 he founded the Kuchipudi Art Academy in Madras to win Kuchipudi a respected place among Indian dances, and the academy grew into a leading school of the art. His dance-dramas include Ksheera Sagara Mathanam (1961), Sri Krishna Parijatham, Sakuntalam (1963), Kumara Sambhavam, Chandalika (1966), Vipranarayana, Menaka Viswamitra, Padmavathi Srinivasa Kalyanam (1975), Kalyana Rukmini (1984), Haravilasam (1985) and Sivadhanurbhangam (1992). Padmavathi Srinivasam was produced at the request of the Tirumala Tirupati Devasthanams.",
        ],
    },
    {
        "id": "vedantam-satyanarayana-sarma",
        "name": "Vedantam Satyanarayana Sarma",
        "born": 1934, "died": 2012,
        "role": "Master of stri vesham, the art of playing women's roles",
        "bio": [
            "Born to Subbamma and Venkataratnam, Vedantam Satyanarayana Sarma began under his elder brother Prahlada Sarma and matured under Chinta Krishna Murthy. He studied music with Varanasi Brahmaiah Sastry. He was on stage from the age of seven as Lava and Prahlada, and he went on to play Usha, Sasirekha, Parvati, Devadevi and Mohini. His portrayal of women drew admiration around the world.",
            "A central figure of the Venkatarama Natya Mandali, he performed in Delhi in 1964, led a troupe to Tamil Nadu in 1968, and took part in the Festival of India in Paris in 1985 and in the USA in 1986. He was President of the Venkatarama Natya Mandali from 1969 and Principal of Siddhendra Kalakshetra, Kuchipudi, from 1969 to 1974.",
        ],
    },
    {
        "id": "mahankali-satyanarayana",
        "name": "Mahankali Satyanarayana",
        "born": 1940, "died": 1977,
        "role": "Actor-dancer known for tamasic characters",
        "bio": [
            "The second son of Sriramulu, Mahankali Satyanarayana first learned dance from his father and then from Chinta Venkataramayya, and he studied music with Challapilla Sitaramayya. He made tamasic characters his own, with only Hari Venkatachalapati as a rival.",
            "His Virabahu and Viswamitra were acclaimed. His Banasura and Hiranyakasipu showed characters torn between conflicting emotions, and his Yamadharmaraja displayed his command of the stage. Under the banner of the Mahankali melam he worked with Vedantam Raghavayya, Bhagavatula Suryanarayana, Darbha Venkateswarlu and Vedantam Ramayya.",
        ],
    },
    {
        "id": "uma-rama-rao",
        "name": "Uma Rama Rao",
        "born": 1940, "died": None,
        "role": "Guru, choreographer and co-founder of Lasya Priya",
        "bio": [
            "K. Uma Rama Rao, also known as Uma Maheswari, belongs to the first generation of Kuchipudi gurus from outside the hereditary families, and she was perhaps the first woman to win prominence as a teacher of the form. She learned Kuchipudi from Nataraja Ramakrishna, Vedantam Lakshminarayana Sastry and C.R. Acharyulu, and Bharatanatyam from P.V. Narasimha Rao and K.N. Pakkiriswamy Pillai.",
            "After performing until 1961 she turned to teaching, and she served as a senior lecturer at the Sri Tyagaraja Government College of Music and Dance, Hyderabad. In 1985 she co-founded Lasya Priya to promote classical dance. She created several dance-dramas and features and presented her students in India and abroad, travelling to the UK, West Germany, France, Austria, the Middle East, Hong Kong, the USA and Canada.",
        ],
    },
    {
        "id": "vedantam-rattaiah-sarma",
        "name": "Vedantam Rattaiah Sarma",
        "born": 1943, "died": None,
        "role": "Character actor, choreographer and Principal of Kuchipudi Kalakshetra",
        "bio": [
            "Born to Annapurnamma and Ramayya, Vedantam Rattaiah Sarma trained under Vedantam Parvateesam, Chinta Krishna Murthy and Vempati Chinna Satyam. A noted character actor, he played Hiranyakasipu, Banasura, Aniruddha, Siva, Sri Rama and Srinivasa, and female characters such as Rangasani. In Vempati Chinna Satyam's productions he played Akasaraja, Bhrigu Maharshi and Cholaraja in Padmavathi Srinivasa Kalyanam, among other roles. He also acted in films.",
            "He gave more than two thousand performances in India and abroad. He taught at the Kuchipudi Kalakshetra in Kuchipudi from 1969 and served as its Principal. His choreography includes Prahlada Vijaya Yakshaganam, Girija Kalyanam, Ardhanariswara, Ksheera Sagara Mathanam and Bhama Kalapam.",
        ],
    },
    {
        "id": "sobha-naidu",
        "name": "Sobha Naidu",
        "born": 1954, "died": None,
        "role": "Soloist, choreographer and Principal of the Kuchipudi Art Academy, Hyderabad",
        "bio": [
            "The daughter of Sarojini Devi and K.V. Naidu, Sobha Naidu trained under Vempati Chinna Satyam and was associated with the Kuchipudi Art Academy in Madras from the 1960s. She made her debut in 1969. She was known both as a soloist and for leading roles in Vempati Chinna Satyam's dance-dramas, among them Menaka in Menaka Viswamitra, Mohini in Ksheera Sagara Mathanam and Satyabhama in Sri Krishna Parijatham.",
            "She performed around the world and led cultural delegations to Mexico, Trinidad, Venezuela, Cuba, Kuwait, West Asia, Mauritius, the USA and the USSR. From 1980 she was Principal of the Kuchipudi Art Academy in Hyderabad, where she taught and choreographed dance-dramas including Kalyana Srinivasam (1989) and Sri Krishna Saranam Mama (1993), along with many solo pieces.",
        ],
    },
]

# ---------------------------------------------------------------------------
# The team. Text is the Society's own, lightly edited.
# ---------------------------------------------------------------------------
TEAM = [
    {
        "id": "pasumarthy-ramalinga-sastry",
        "name": "Sri Pasumarthy Ramalinga Sastry",
        "schema_name": "Pasumarthy Ramalinga Sastry",
        "title": "President, Advisory Board",
        "honour": "Sangeet Natak Akademi Awardee (2018)",
        "awards": ["Sangeet Natak Akademi Award (2018)", "Kalaratna (2016)", "Ugadi Puraskaram (2012)"],
        "bio": [
            "Born in 1958 in Kuchipudi village, the cradle of the art, Sri Pasumarthy Ramalinga Sastry is a revered master and senior torchbearer of the tradition. He trained intensively under Gurus Vedantam Parvateesam, Pasumarthy Venugopala Krishna Sarma and Vempati Chinna Satyam, and later took a Diploma in Bharatanatyam from the Kalakshetra Foundation, Chennai.",
            "A performer and choreographer, he has danced across the world and toured the USA several times for workshops and performances. His dance-dramas include <i>Gajaneeyam</i>, <i>Sri Ramakatha Saaram</i> and <i>Rasa Leela</i>. As a guru he has shaped generations of artists who are now known in their own right.",
            "His work has been honoured with the Sangeet Natak Akademi Award (2018), and with the Kalaratna (2016) and the Ugadi Puraskaram (2012) from the Government of Andhra Pradesh. As President of the Advisory Board he guides the Society with his experience, keeping it rooted in tradition while it shapes the future of Kuchipudi.",
        ],
    },
    {
        "id": "vedantam-venkata-rama-raghava",
        "name": "Vedantam Venkata Rama Raghava",
        "schema_name": "Vedantam Venkata Rama Raghava",
        "title": "Artistic Director",
        "honour": None,
        "awards": [],
        "bio": [
            "Raghava comes from Kuchipudi village in Krishna district and belongs to the Vedantam family, one of the hereditary families entrusted with the Kuchipudi tradition. He is the son of Guru <a href=\"[[url:/kuchipudi-gurus/#vedantam-rattaiah-sarma]]\">Vedantam Rattaiah Sarma</a>, and he received gurukula-style training under his father and under <a href=\"[[url:/kuchipudi-gurus/#vempati-chinna-satyam]]\">Vempati Chinna Satyam</a>, <a href=\"[[url:/kuchipudi-gurus/#vedantam-satyanarayana-sarma]]\">Vedantam Satyanarayana Sarma</a> and Smt. <a href=\"[[url:/kuchipudi-gurus/#sobha-naidu]]\">Sobha Naidu</a>.",
            "He trained during a pivotal period in the evolution of Kuchipudi and commands both the traditional village bani and the codified Vempati style. He holds Bachelor's and Master's degrees in Kuchipudi from Sri Potti Sreeramulu Telugu University.",
            "A performer, choreographer and teacher, he is known for his expertise in the Yakshagana repertoire and for his portrayal of both male and female roles. His choreography is grounded in sahitya, tala structure and dramatic expression. As Artistic Director he guides the Society's artistic vision, so that its programming stays rooted in parampara while it speaks to audiences today.",
        ],
    },
    {
        "id": "kiran-vedantam",
        "name": "Dr. Kiran Vedantam",
        "schema_name": "Kiran Vedantam",
        "title": "President and Founder",
        "honour": None,
        "awards": [],
        "bio": [
            "Dr. Kiran Vedantam is a trained practitioner of Bharatanatyam and Kuchipudi, a scholar, and the Founder and President of Kuchipudi Heritage. Her foundation was laid under Guru Bhagavatula Venkata Rama Sarma, from whom she received formal training in both forms, grounded in discipline, repertoire and traditional pedagogy.",
            "She continued her advanced study of Kuchipudi under Vedantam Venkata Naga Chalapathi Rao, deepening her understanding of the style, technique and expressive grammar of the form. She holds Diplomas in both Bharatanatyam and Kuchipudi.",
            "Dr. Kiran also holds a Master's degree and a PhD in Commerce and Business Management, and she brings long experience of organisational governance and institutional development. That background shapes her vision for Kuchipudi Heritage: an institution dedicated to the preservation, scholarship and global advancement of Kuchipudi through structured programming, research, curated festivals and educational outreach.",
        ],
    },
    {
        "id": "vedantam-venkata-naga-chalapathi-rao",
        "name": "Dr. Vedantam Venkata Naga Chalapathi Rao",
        "schema_name": "Vedantam Venkata Naga Chalapathi Rao",
        "title": "Secretary",
        "honour": "Sangeet Natak Akademi Bismillah Khan Yuva Puraskar Awardee",
        "awards": ["Ustad Bismillah Khan Yuva Puraskar, Sangeet Natak Akademi (2006)"],
        "bio": [
            "Dr. Vedantam Chalapathi Rao comes from the Vedantam family of Kuchipudi, known for its natya parampara. He was initiated into dance at the age of five by his father, Guru <a href=\"[[url:/kuchipudi-gurus/#vedantam-rattaiah-sarma]]\">Vedantam Rattaiah Sarma</a>, and was further taught by <a href=\"[[url:/kuchipudi-gurus/#vempati-chinna-satyam]]\">Vempati Chinna Satyam</a>, <a href=\"[[url:/kuchipudi-gurus/#vedantam-satyanarayana-sarma]]\">Vedantam Satyanarayana Sarma</a>, and his uncles Vedantam Raghavayya and Vedantam Radhesyam.",
            "A master of <i>stri vesham</i>, the traditional art of playing women's roles, he is equally powerful in masculine roles such as Hiranyakasipu and Bali Chakravarthy. He holds a postgraduate degree and is a gold-medal research scholar of Potti Sreeramulu Telugu University.",
            "In 2006 he became the first Kuchipudi artist to receive the Sangeet Natak Akademi's Bismillah Khan Yuva Puraskar. He has toured the USA with more than seventy performances, and China and Japan with the ICCR, and he has danced at festivals including Khajuraho and Ananya. As Secretary he works to preserve the purity of the Kuchipudi tradition and to guide its scholarly and artistic future.",
        ],
    },
]

# ---------------------------------------------------------------------------
# Videos on the Society's YouTube channel (titles as published there).
# ---------------------------------------------------------------------------
VIDEOS = [
    {"id": "HuWoA4w-sdI", "title": "Kuchipudi Pathaka Swarnotsavalu, day 1", "group": "swarnotsavalu"},
    {"id": "3-TpPydl1S8", "title": "Kuchipudi Pathaka Swarnotsavalu, day 2", "group": "swarnotsavalu"},
    {"id": "i_nu7Uwi2Po", "title": "Kuchipudi Pathaka Swarnotsavalu, day 3", "group": "swarnotsavalu"},
    {"id": "5Er26b8eqTI", "title": "Kuchipudi Viswa Narthanam: USA, Canada, UK and UAE", "group": "viswanarthanam"},
]

# ---------------------------------------------------------------------------
# Images. Every picture on the site comes from the Society's own website.
# `src` is the full-size file under /assets/img/, `small` a lighter version
# for phones and thumbnails. `old` is the address the picture had on the
# WordPress site, so that address can be redirected to the new file.
# ---------------------------------------------------------------------------
WP = "https://kuchipudiheritage.com/wp-content/uploads"


def _im(src, w, h, small, sw, old):
    return {"src": src, "w": w, "h": h, "small": small, "sw": sw, "sh": round(sw * h / w), "old": f"{WP}/{old}"}


IMAGES = {
    "logo": _im("logo-512.webp", 512, 512, "logo-160.webp", 160, "2024/03/logo.png"),
    "painting": _im("siddhendra-yogi-painting.webp", 800, 621, "siddhendra-yogi-painting-480.webp", 480, "2024/03/portrait_of_siddhendra_yogi.jpeg"),
    "scene": _im("kuchipudi-dancers-temple-art.webp", 1024, 696, "kuchipudi-dancers-temple-art-640.webp", 640, "2024/01/1.jpg"),
    "flag": _im("kuchipudi-flag-patakam.webp", 782, 1590, "kuchipudi-flag-patakam-half.webp", 391, "2024/04/flag-png.png"),
    "poster-en": _im("kuchipudi-dance-confluence-2026-poster.webp", 1024, 1536, "kuchipudi-dance-confluence-2026-poster-512.webp", 512, "2024/01/1.jpg"),
    "poster-thumb": _im("kuchipudi-dance-confluence-2026-poster-512.webp", 512, 768, "kuchipudi-dance-confluence-2026-poster-160.webp", 160, "2024/01/1.jpg"),
    "poster-te": _im("kuchipudi-dance-confluence-2026-poster-telugu.webp", 1024, 1536, "kuchipudi-dance-confluence-2026-poster-telugu-512.webp", 512, "2024/01/2.jpg"),
}
_GURU_OLD = {
    "chinta-venkataramayya": "2024/03/chinta-venkataramayya-1.png",
    "vempati-venkatanarayana": "2024/03/vempati-venkatanarayana.png",
    "vedantam-lakshminarayana-sastry": "2024/03/vedantam-lakshminarayana-sastry.png",
    "tadepalli-perayya": "2024/03/tadepalli-perayya.png",
    "chinta-krishna-murthy": "2024/04/10.chinta-krishna-murthy-1.png",
    "vedantam-raghavayya": "2024/03/vedantam-raghavayya.png",
    "vedantam-parvateesam": "2024/04/vedantam-parvatisam.png",
    "vempati-peda-satyam": "2024/03/vempati-peda-satyanarayana.png",
    "pasumarthi-krishna-murthy": "2024/03/pasumarti-krishna-murthy.png",
    "vempati-chinna-satyam": "2024/04/11.vempati-china-satyam.png",
    "vedantam-satyanarayana-sarma": "2024/04/vedantam-satyanarayana-sarma.png",
    "mahankali-satyanarayana": "2024/03/mahankali-satyanarayana.png",
    "uma-rama-rao": "2024/03/k.-uma-rama-rao.png",
    "vedantam-rattaiah-sarma": "2024/04/13.vedantam-rattaiah-sarma.png",
    "sobha-naidu": "2024/03/sobha-naidu.png",
}
for _k, _old in _GURU_OLD.items():
    IMAGES[_k] = _im(f"gurus/{_k}.webp", 800, 800, f"gurus/{_k}-400.webp", 400, _old)
_TEAM_OLD = {
    "pasumarthy-ramalinga-sastry": "2026/03/sri-pasumarthy-ramalinga-sastry.png",
    "vedantam-venkata-rama-raghava": "2026/03/vedantam-venkata-rama-raghava.png",
    "kiran-vedantam": "2026/03/dr.-kiran-vedantam.png",
    "vedantam-venkata-naga-chalapathi-rao": "2026/03/dr.-vedantam-venkata-naga-chalapathi-rao-1.png",
}
for _k, _old in _TEAM_OLD.items():
    IMAGES[_k] = _im(f"team/{_k}.webp", 800, 1000, f"team/{_k}-400.webp", 400, _old)

# The parts of the flag, as percentages across and down the flag picture.
FLAG_PARTS = [
    {"id": "cloth", "x": 66, "y": 17, "name": "The pink cloth", "short": "Pink cloth",
     "text": "Light pink, the colour of the early morning sun: freshness, hope and new beginnings. Its four sides stand for the four Vedas and the four varnas, because natyam is for everyone."},
    {"id": "serpent", "x": 31.3, "y": 15.6, "name": "Adi Sesha", "short": "Adi Sesha",
     "text": "The great serpent at the head of the plait stands for intelligence and wisdom."},
    {"id": "sun-moon", "x": 30.4, "y": 21, "name": "The sun and the moon", "short": "Sun and moon",
     "text": "The plait is a picture of the universe. The sun and the moon sit just below the serpent."},
    {"id": "stars", "x": 53, "y": 29.2, "name": "The 27 stars", "short": "27 stars",
     "text": "Twenty-seven stars run down the plait, for the 27 nakshatras of Hindu astrology."},
    {"id": "tassel", "x": 84.8, "y": 29, "name": "The balls at the end", "short": "Three worlds",
     "text": "Three large balls close the plait. They stand for the three worlds."},
    {"id": "leaves", "x": 14.5, "y": 6, "name": "The leaves", "short": "Leaves",
     "text": "The leaves on the cane are the sanchari bhavas, the passing moods that colour a performance."},
    {"id": "pole", "x": 11.8, "y": 64, "name": "The sugarcane pole", "short": "Sugarcane pole",
     "text": "A stalk of sugarcane: the sweetness and beauty of Kuchipudi, and the strong, sturdy foundation of the art."},
]

# Old WordPress URLs that must keep working after the move (301 redirects).
REDIRECTS = [
    ("/our-lagendary/", "/kuchipudi-gurus/"),
    ("/our-legendary/", "/kuchipudi-gurus/"),
    ("/contact/", "/contact-us/"),
    ("/team/", "/the-team/"),
    ("/applications/", "/application-for-institutions/"),
    ("/register/", "/application-for-institutions/"),
    ("/registration/", "/application-for-institutions/"),
    ("/feed/", "/"),
]

# ---------------------------------------------------------------------------
# Questions and answers on the Kuchipudi dance page. The same list feeds the
# visible FAQ and the FAQPage structured data, so the two can never drift.
# ---------------------------------------------------------------------------
FAQS = [
    ("Which state is Kuchipudi dance from?",
     "Kuchipudi is from Andhra Pradesh. It is named after Kuchipudi village, in Movva mandal of Krishna district, where the dance took shape."),
    ("Who is the founder of Kuchipudi dance?",
     "Siddhendra Yogi is honoured as the father of Kuchipudi. He composed Bhama Kalapam, taught it to the Brahmin boys of Kuchipudi village and gave the tradition its form. He is traditionally dated to the 17th century."),
    ("Is Kuchipudi a classical dance?",
     "Yes. Kuchipudi is one of the eight classical dances of India recognised by the Sangeet Natak Akademi. The others are Bharatanatyam, Kathak, Kathakali, Manipuri, Mohiniyattam, Odissi and Sattriya."),
    ("What is the plate dance in Kuchipudi called?",
     "It is called the Tarangam. The dancer stands on the rim of a brass plate and moves it in time to the music, sometimes with a pot of water balanced on the head."),
    ("What is Bhama Kalapam?",
     "Bhama Kalapam is the founding dance-drama of Kuchipudi, composed by Siddhendra Yogi. It tells of Satyabhama, the proud consort of Krishna, and her longing for him when they are apart."),
    ("What is the difference between Kuchipudi and Bharatanatyam?",
     "Kuchipudi comes from Andhra Pradesh and grew out of dance-drama, so its dancers may speak and sing, and it includes the Tarangam on a brass plate. Bharatanatyam comes from Tamil Nadu and grew out of solo temple and court dance, and its dancers do not speak."),
    ("Can women perform Kuchipudi?",
     "Yes. For most of its history Kuchipudi was performed only by men, who played the women's roles too. In the twentieth century gurus such as Vedantam Lakshminarayana Sastry began to teach women, and women now dance Kuchipudi all over the world."),
    ("What language are Kuchipudi songs in?",
     "Mainly Telugu, with some Sanskrit. The music is Carnatic."),
    ("Where is Kuchipudi village?",
     "Kuchipudi village is in Movva mandal of Krishna district, Andhra Pradesh, PIN 521136. The nearest city is Vijayawada."),
]
