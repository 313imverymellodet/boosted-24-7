import {
  CITIES,
  HOME_FAQS,
  OG_IMAGE,
  PHONE_E164,
  SITE,
  cityUrl,
  matchRoute,
} from "./config.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOME_TITLE = "Boosted 24/7 — Detroit's 24/7 Roadside Battery Boost · From $60";
const HOME_DESCRIPTION =
  "Dead battery in Detroit? Boosted 24/7 dispatches a truck to you in ~20 minutes, 24 hours a day. Flat-rate $60 inside the city, $80 in the extended area. Honest pricing, no membership.";

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function jsonLd(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function hours() {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS,
      opens: "00:00",
      closes: "23:59",
    },
  ];
}

function offer(name, price, description) {
  return {
    "@type": "Offer",
    name,
    price: String(price),
    priceCurrency: "USD",
    description,
  };
}

function businessLd({ url, description, areaServed, offers }) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    name: "Boosted 24/7",
    image: OG_IMAGE,
    url,
    telephone: PHONE_E164,
    description,
    priceRange: "$60-$80",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Detroit",
      addressRegion: "MI",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "42.3314",
      longitude: "-83.0458",
    },
    areaServed,
    openingHoursSpecification: hours(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Roadside Boost Services",
      itemListElement: offers,
    },
  };
}

function faqLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function socialTags({
  title,
  description,
  url,
  ogTitle = title,
  ogDescription = description,
  twitterTitle = title,
  twitterDescription = description,
}) {
  return [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Boosted 24/7" />`,
    `<meta property="og:title" content="${escapeAttr(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(ogDescription)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:alt" content="Detroit riverfront skyline at night — Boosted 24/7 dispatch territory." />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(twitterTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(twitterDescription)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];
}

function homeHead() {
  const url = `${SITE}/`;
  const tags = socialTags({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url,
    ogTitle: "Boosted 24/7 — Detroit's 24/7 Roadside Battery Boost",
    ogDescription:
      "Stranded in Detroit Metro? A boosted truck is already nearby. ~20-minute response, day or night, $60 flat.",
    twitterTitle: "Boosted 24/7 — Detroit Roadside Battery Boost",
    twitterDescription: "~20-min response, 24/7, $60 flat inside Detroit. No membership.",
  });
  tags.push(
    jsonLd(
      businessLd({
        url,
        description: HOME_DESCRIPTION,
        areaServed: [
          { "@type": "City", name: "Detroit" },
          ...CITIES.map((city) => ({ "@type": "City", name: city.name })),
        ],
        offers: [
          offer(
            "Detroit Metro Boost",
            60,
            "Standard boost inside Detroit city limits, ~20-minute response."
          ),
          offer(
            "Outside City Boost",
            80,
            "Extended coverage — Warren, Southfield, Livonia, Sterling Heights, Westland."
          ),
        ],
      })
    )
  );
  tags.push(jsonLd(faqLd(HOME_FAQS)));
  return tags.join("\n");
}

function cityHead(city) {
  const url = cityUrl(city.slug);
  const tags = socialTags({
    title: city.title,
    description: city.description,
    url,
  });
  tags.push(
    jsonLd(
      businessLd({
        url,
        description: city.description,
        areaServed: [{ "@type": "City", name: city.name }],
        offers: [
          offer(
            `${city.name} Boost`,
            80,
            `Extended-zone battery boost in ${city.name}. Flat $80. Indicative ETA about ${city.eta} minutes; call for a live ETA.`
          ),
        ],
      })
    )
  );
  tags.push(jsonLd(faqLd(city.faqs)));
  tags.push(
    jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: city.name,
          item: url,
        },
      ],
    })
  );
  return tags.join("\n");
}

function notFoundHead() {
  return [
    `<title>Page not found — Boosted 24/7</title>`,
    `<meta name="description" content="That page is not on Boosted 24/7. Call (313) 771-7521 for a Detroit Metro battery boost." />`,
    `<meta name="robots" content="noindex" />`,
  ].join("\n");
}

export function renderHead(url) {
  const route = matchRoute(url);
  if (route.page === "home") return homeHead();
  if (route.page === "city") return cityHead(route.city);
  return notFoundHead();
}
