/* ==========================================================================
   99 COMPUTERS — Scripts (optimized)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Smooth scroll WITHOUT hash in the URL
   -------------------------------------------------------------------------- */
function enableHashlessScroll() {
  const headerOffset = 110;

  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      const drawer = document.getElementById('drawer');
      const menuBtn = document.getElementById('menuBtn');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      }

      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Image shimmer → blur-up loader
   -------------------------------------------------------------------------- */
function attachShimmerLoaders(root = document) {
  root.querySelectorAll('.shimmer img').forEach(img => {
    const wrap = img.closest('.shimmer');
    if (!wrap || wrap.dataset.shimmerWired) return;
    wrap.dataset.shimmerWired = '1';

    const finish = () => {
      wrap.classList.add('loaded');
      wrap.classList.remove('shimmer');
    };
    const fail = () => {
      wrap.classList.add('failed');
      wrap.classList.remove('shimmer');
    };

    if (img.complete && img.naturalWidth > 0) {
      requestAnimationFrame(finish);
    } else {
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });
}

window.__attachShimmerLoaders = attachShimmerLoaders;

document.addEventListener('DOMContentLoaded', () => {
  attachShimmerLoaders();
  enableHashlessScroll();
});

/* --------------------------------------------------------------------------
   Theme + mobile menu
   -------------------------------------------------------------------------- */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const updateLabel = () => themeToggle.setAttribute('aria-label', htmlEl.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
updateLabel();

themeToggle.addEventListener('click', (e) => {
  e.preventDefault();
  const n = htmlEl.dataset.theme === 'light' ? 'dark' : 'light';
  htmlEl.dataset.theme = n;
  try { localStorage.setItem('theme', n); } catch (err) {}
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = n === 'light' ? '#f4ead5' : '#060a0f';
  updateLabel();
});

const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');

function setMenu(open) {
  drawer.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  setMenu(!drawer.classList.contains('open'));
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

document.addEventListener('click', (e) => {
  if (!drawer.classList.contains('open')) return;
  if (drawer.contains(e.target) || menuBtn.contains(e.target)) return;
  setMenu(false);
});

/* --------------------------------------------------------------------------
   Contact info
   -------------------------------------------------------------------------- */
const CONTACT = {
  phone: "+254794707522",
  whatsapp: "254794707522",
  email: ""
};

document.getElementById('yr').textContent = new Date().getFullYear();

/* --------------------------------------------------------------------------
   Live clock
   -------------------------------------------------------------------------- */
const t0 = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - t0) / 1e3), p = n => String(n).padStart(2, '0');
  const tcEl = document.getElementById('tc');
  if (tcEl) tcEl.textContent = `${p(s / 3600 | 0)}:${p(s / 60 % 60 | 0)}:${p(s % 60)}`;
}, 1000);

/* --------------------------------------------------------------------------
   Services data
   -------------------------------------------------------------------------- */
const S = [
  ["IT Consultancy", "Professional technology advice and solutions for individuals and businesses.", "#2ec4b6", "#7be0d6", "M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3zM9.5 20h5M10 22h4"],
  ["Computer Sales", "Quality laptops, desktops, and computer accessories.", "#f5a54a", "#ffd08a", "M4 5h16v10H4zM2 19h20M9 15v4M15 15v4"],
  ["Electronics and Home Appliances", "Televisions, smartphones, washing machines, radios, and other electronic products.", "#e8613c", "#f5a54a", "M3 5h18v11H3zM8 20h8M12 16v4M17 9h.01"],
  ["CCTV Installation", "Installation and setup of surveillance cameras for homes, offices, shops, and businesses.", "#ff5a4d", "#f5a54a", "M3 8l12-3 2 5-12 3zM15 13l5 3M8 14l-1 5h6M19 7l2 1"],
  ["IT Support", "Assistance with computer setup, configuration, troubleshooting, maintenance, repair, and other technology needs.", "#2ec4b6", "#f5a54a", "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.2-.7-.7-2.2z"],
  ["Electronics Accessories", "A variety of accessories and supporting equipment for everyday technology use.", "#f5a54a", "#2ec4b6", "M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5"]
];
document.getElementById('svc').innerHTML = S.map((s, i) =>
  `<article class="glass card rv" data-tilt style="--d:${i * .08}s"><div class="ic" style="--a:${s[2]};--b:${s[3]}"><svg viewBox="0 0 24 24"><path d="${s[4]}"/></svg></div><h3>${s[0]}</h3><p>${s[1]}</p></article>`
).join('');

/* --------------------------------------------------------------------------
   Reveal + tilt (tilt only on hover-capable devices)
   -------------------------------------------------------------------------- */
const hasHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), { threshold: 0, rootMargin: '0px 0px -4% 0px' });

function tilt(el) {
  if (!hasHover) return;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((x - .5) * 8) + 'deg');
    el.style.setProperty('--rx', ((.5 - y) * 8) + 'deg');
    el.style.setProperty('--mx', (x * 100) + '%');
    el.style.setProperty('--my', (y * 100) + '%');
  });
  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  });
}

function wire(root = document) {
  root.querySelectorAll('.rv:not([data-w])').forEach(el => { el.dataset.w = 1; io.observe(el); });
  root.querySelectorAll('[data-tilt]:not([data-t])').forEach(el => { el.dataset.t = 1; tilt(el); });
}
wire();
setTimeout(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')), 2500);

/* --------------------------------------------------------------------------
   Products — 6 cards with shimmer placeholders
   -------------------------------------------------------------------------- */
const PRODUCTS = [
  { tag: "Laptops",      title: "Laptops",              caption: "Business, student, and everyday laptops from trusted brands.",       img: "images/3.jpeg", alt: "Laptop" },
  { tag: "Desktops",     title: "Desktop Computers",    caption: "Complete desktop systems, towers, and all-in-ones.",                img: "images/4.jpeg", alt: "Desktop computer" },
  { tag: "Televisions",  title: "Televisions",          caption: "Smart TVs, LED screens, and home entertainment displays.",          img: "images/5.jpeg", alt: "Television" },
  { tag: "CCTV",         title: "CCTV & Security",      caption: "Cameras, DVRs, and complete surveillance kits for any property.",   img: "images/6.jpeg", alt: "CCTV camera" },
  { tag: "Sound",        title: "Sound Systems",        caption: "Speakers, subwoofers, amplifiers, and home audio setups.",          img: "images/7.jpeg", alt: "Sound system" },
  { tag: "Accessories",  title: "Accessories",          caption: "Keyboards, mice, chargers, cables, and everyday essentials.",       img: "images/8.jpeg", alt: "Accessories" }
];

const prodEl = document.getElementById('prod');
prodEl.innerHTML = PRODUCTS.map((p, i) => `
  <figure class="prod rv" data-tilt style="--d:${i * .08}s">
    <div class="slot shimmer">
      <span class="chip">${p.tag}</span>
      <img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async" width="480" height="320">
    </div>
    <figcaption class="meta">
      <strong>${p.title}</strong>
      <small>${p.caption}</small>
    </figcaption>
  </figure>
`).join('');

wire(prodEl);
window.__attachShimmerLoaders(prodEl);
setTimeout(() => prodEl.querySelectorAll('.rv').forEach(e => e.classList.add('in')), 1200);

/* --------------------------------------------------------------------------
   SEO — JSON-LD structured data
   -------------------------------------------------------------------------- */
(function injectSEO() {
  const siteUrl = "https://www.99computers.co.ke";
  const PHONE = "+254794707522";
  const WHATSAPP = "+254794707522";
  const EMAIL = "info@99computers.co.ke";

  const branches = [
    {
      city: "Murang'a",
      region: "Murang'a County",
      name: "99 COMPUTERS — Murang'a (Main Branch)",
      mapUrl: "https://maps.app.goo.gl/FHAN5yE1pPPzXfvG9"
    },
    {
      city: "Nairobi",
      region: "Nairobi County",
      name: "99 COMPUTERS — Nairobi CBD",
      street: "Superior Towers, Moi Avenue",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Superior+Towers+Moi+Avenue+Nairobi"
    },
    {
      city: "Kerugoya",
      region: "Kirinyaga County",
      name: "99 COMPUTERS — Kerugoya",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Kerugoya+Town+Kirinyaga"
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl + "/#organization",
        "name": "99 COMPUTERS",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": siteUrl + "/images/1.jpeg"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": PHONE,
            "contactType": "customer service",
            "areaServed": "KE",
            "availableLanguage": ["English", "Swahili"]
          },
          {
            "@type": "ContactPoint",
            "telephone": WHATSAPP,
            "contactType": "WhatsApp customer support",
            "areaServed": "KE"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        "url": siteUrl,
        "name": "99 COMPUTERS",
        "publisher": { "@id": siteUrl + "/#organization" },
        "inLanguage": "en-KE"
      },
      ...branches.map((b, i) => ({
        "@type": "LocalBusiness",
        "@id": siteUrl + "/#branch-" + i,
        "name": b.name,
        "parentOrganization": { "@id": siteUrl + "/#organization" },
        "description": "IT consultancy, computer and laptop sales, electronics, repair and support, and professional CCTV installation.",
        "url": siteUrl,
        "image": siteUrl + "/images/1.jpeg",
        "telephone": PHONE,
        "email": EMAIL,
        "priceRange": "KSh",
        "currenciesAccepted": "KES",
        "paymentAccepted": "Cash, M-Pesa, Card",
        "areaServed": { "@type": "Country", "name": "Kenya" },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "KE",
          "addressLocality": b.city,
          "addressRegion": b.region,
          ...(b.street ? { "streetAddress": b.street } : {})
        },
        "hasMap": b.mapUrl,
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Products & Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Consultancy" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Laptops & Desktop Computers" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Televisions & Electronics" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV Installation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Support & Repair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Electronics Accessories" } }
          ]
        }
      }))
    ]
  };

  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
})();