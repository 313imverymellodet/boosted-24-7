export const SITE = "https://www.boostdetroit247.com";
export const OG_IMAGE = `${SITE}/images/detroit-skyline.jpg`;

export const PHONE = "3137717521";
export const PHONE_DISPLAY = "(313) 771-7521";
export const PHONE_HREF = `tel:${PHONE}`;
export const PHONE_E164 = "+1-313-771-7521";

export const STRIPE_LINKS = {
  metro: "https://buy.stripe.com/eVqaEXftF8cs1WSc6Y2cg01",
  outside: "https://buy.stripe.com/fZu7sLdlxdwMgRM5IA2cg02",
  latenight: "https://buy.stripe.com/7sYeVddlxfEUcBw3As2cg03",
  custom: "https://buy.stripe.com/9B628rgxJcsIdFA4Ew2cg00",
};

export const stripeUrlFor = (tier, phone) => {
  if (!tier || !tier.stripeUrl) return null;
  const digits = (phone || "").replace(/\D/g, "");
  return digits ? `${tier.stripeUrl}?client_reference_id=${digits}` : tier.stripeUrl;
};

export const LEAD_EMAIL = "mello@boostdetroit247.com";
export const LEAD_FORM_ENDPOINT = `https://formsubmit.co/ajax/${LEAD_EMAIL}`;

export const submitLead = async (payload) => {
  try {
    const body = {
      _subject: payload._subject || "New form submission — boosted-24-7",
      _captcha: "false",
      _template: "table",
      _replyto: payload.phone || "",
      submitted_at: new Date().toLocaleString("en-US", { timeZone: "America/Detroit" }),
      source_url: typeof window !== "undefined" ? window.location.href : "",
      ...payload,
    };
    const res = await fetch(LEAD_FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (e) {
    console.warn("Lead notification failed:", e);
    return false;
  }
};

export const tiers = [
  {
    id: "metro",
    label: "DETROIT METRO",
    price: 60,
    unit: "/JUMP",
    note: "Standard service inside Detroit city limits",
    popular: true,
    features: [
      "20-minute average response",
      "Flat rate · no surcharges",
      "All major payment methods",
      "Pro technician on every call",
    ],
    cta: "PAY $60 NOW",
    stripeUrl: STRIPE_LINKS.metro,
  },
  {
    id: "outside",
    label: "OUTSIDE CITY",
    price: 80,
    unit: "/JUMP",
    note: "Extended coverage area",
    features: [
      "25-minute average response",
      "Same flat-rate honesty",
      "All major payment methods",
      "Pro technician on every call",
    ],
    cta: "PAY $80 NOW",
    stripeUrl: STRIPE_LINKS.outside,
  },
  {
    id: "latenight",
    label: "LATE NIGHT",
    price: null,
    unit: "VARIABLE",
    note: "Additional fee for 12 AM – 6 AM dispatch",
    features: [
      "Same fast response",
      "24/7 availability — really",
      "Emergency dispatch only",
      "Quote given on call",
    ],
    cta: "PAY FOR LATE NIGHT",
    stripeUrl: STRIPE_LINKS.latenight,
  },
];

export const HOME_FAQS = [
  {
    q: "How much is a battery boost?",
    a: "Inside Detroit city limits the flat rate is $60 per jump. The extended coverage area — Warren, Southfield, Sterling Heights, Livonia, and Westland — is $80 per jump. Late night dispatch from 12 AM to 6 AM has an additional fee, and the quote is given on the call.",
  },
  {
    q: "Do I need a membership?",
    a: "No. Boosted 24/7 is pay-per-use only. There is no membership and no hidden fees.",
  },
  {
    q: "How fast is the response?",
    a: "Average response is about 20 minutes inside Detroit and about 25 minutes in the extended coverage area, day or night. The zone times on the coverage board are indicative — call for a live ETA.",
  },
  {
    q: "Which areas do you cover?",
    a: "The primary zone is Detroit: Downtown, Corktown, Midtown, Belle Isle, and the Riverfront, at $60. Extended coverage is Southfield, Warren, Sterling Heights, Livonia, and Westland, at $80.",
  },
  {
    q: "How can I pay?",
    a: "Card, Cash App, Venmo, Apple Pay, and Stripe. Pay before or pay after — whatever is easier when you are stranded. A custom amount checkout is available if the listed tiers do not fit.",
  },
  {
    q: "What if the boost does not start the car?",
    a: "If the boost does not take, we diagnose it free.",
  },
  {
    q: "Are you really open all night?",
    a: "Yes. Crews are on shift 24/7. Late night calls between 12 AM and 6 AM include an additional fee that is quoted on the call.",
  },
  {
    q: "Who picks up the phone?",
    a: "Real people, not a call center. Call (313) 771-7521 any time.",
  },
];

const sharedFacts = (city) => [
  `Service: roadside battery boost / jump start`,
  `${city.name} rate: $80 flat per jump (extended zone)`,
  `Detroit city limits: $60 flat per jump`,
  `Indicative ETA: ~${city.eta} minutes — call for a live ETA`,
  `Hours: 24/7. Late night 12 AM–6 AM is quoted on the call`,
  `Phone: (313) 771-7521`,
];

function cityFaqs(city) {
  return [
    {
      q: `How much is a battery boost in ${city.name}?`,
      a: `${city.name} is extended coverage, so the flat rate is $80 per jump. Inside Detroit city limits the flat rate is $60.`,
    },
    {
      q: `How fast can you reach ${city.name}?`,
      a: `The extended zone averages about 25 minutes. Our coverage board lists ${city.name} at an indicative ~${city.eta} minutes. Call for a live ETA.`,
    },
    {
      q: `Do you run overnight in ${city.name}?`,
      a: `Yes. Crews are on shift 24/7. Late-night dispatch from 12 AM to 6 AM has an additional fee, quoted on the call.`,
    },
    {
      q: `Is there a membership for ${city.name} service?`,
      a: `No. Pay-per-use only, with no hidden fees. Pay by card, Cash App, Venmo, Apple Pay, or Stripe, before or after the jump.`,
    },
  ];
}

export const CITIES = [
  {
    slug: "warren",
    name: "Warren",
    eta: 22,
    title: "Battery Boost in Warren, MI — $80 Flat | Boosted 24/7",
    description:
      "Dead battery in Warren? Extended-zone boost is $80 flat, 24/7. Indicative ETA about 22 minutes. Call (313) 771-7521 for a live time.",
    lede: "Warren is on the extended board. The jump is a flat $80 — same outside-city rate as Southfield, Sterling Heights, Livonia, and Westland. The board shows an indicative ETA of about 22 minutes. Call and we'll give you the live ETA.",
    paragraphs: [
      "We're a Detroit-owned battery boost crew. Real people pick up, not a call center. Primary-zone jumps inside Detroit — Downtown, Corktown, Midtown, Belle Isle, and the Riverfront — are $60, with about a 20-minute average. Warren sits outside that zone, so the $80 extended rate applies. Across the extended area the average response is about 25 minutes, day or night.",
      "No membership and no hidden fees. Pay by card, Cash App, Venmo, Apple Pay, or Stripe, before or after the jump. Late night (12 AM – 6 AM) adds a fee we quote on the call. If the boost doesn't take, we diagnose it free.",
      "The times on the coverage board are indicative. Call (313) 771-7521 and a person will confirm the live ETA before a rig rolls.",
    ],
  },
  {
    slug: "southfield",
    name: "Southfield",
    eta: 24,
    title: "Battery Boost in Southfield, MI — $80 Flat | Boosted 24/7",
    description:
      "Southfield battery boost, $80 flat. Boosted 24/7 is on shift day and night. The board shows an indicative ETA of about 24 minutes. Call (313) 771-7521.",
    lede: "Southfield is extended coverage. Flat $80 a jump, crews on shift 24/7, and about a 25-minute average across the extended zone. The board's indicative ETA for Southfield is about 24 minutes. Call (313) 771-7521 for the live number.",
    paragraphs: [
      "The primary zone stays inside Detroit: Downtown, Corktown, Midtown, Belle Isle, and the Riverfront, at $60 and about 20 minutes on average. Southfield is outside the city tier, with Warren, Sterling Heights, Livonia, and Westland.",
      "Pay when you want — before or after. Card, Cash App, Venmo, Apple Pay, or Stripe. No membership. If the boost doesn't take, the diagnostic is free. From midnight to 6 AM there's an extra late-night fee, quoted on the call.",
      "This is a roadside battery boost and jump start. We're not a call center routing you to whoever is closest. Call and a person in Detroit picks up.",
    ],
  },
  {
    slug: "sterling-heights",
    name: "Sterling Heights",
    eta: 26,
    title: "Battery Boost in Sterling Heights, MI — $80 | Boosted 24/7",
    description:
      "Sterling Heights jump start from Boosted 24/7. Extended zone, $80 flat, 24/7. Indicative ETA about 26 minutes. Call (313) 771-7521.",
    lede: "Sterling Heights takes the extended-zone rate: $80 flat per battery boost. We're on shift all night. The coverage board lists an indicative ETA of about 26 minutes here. Call for a live ETA — the board is labeled indicative on purpose.",
    paragraphs: [
      "Same crew as Detroit. Inside the city — Downtown, Corktown, Midtown, Belle Isle, and the Riverfront — the jump is $60. Sterling Heights, like Warren, Southfield, Livonia, and Westland, is $80. Extended-zone average response is about 25 minutes.",
      "You don't need a membership. No hidden fees. Pay with card, Cash App, Venmo, Apple Pay, or Stripe, before or after. 12 AM to 6 AM dispatch includes an additional fee we quote when you call. Boost doesn't take? We diagnose it free.",
      "Phone is (313) 771-7521. Real humans, not a call center, any hour.",
    ],
  },
  {
    slug: "livonia",
    name: "Livonia",
    eta: 28,
    title: "Battery Boost in Livonia, MI — $80 Flat | Boosted 24/7",
    description:
      "Livonia roadside battery boost, $80 flat, no membership. Indicative ETA about 28 minutes — call (313) 771-7521 for the live ETA. On shift 24/7.",
    lede: "Livonia is the far end of the extended board: indicative ETA about 28 minutes, the longest time we list outside Detroit. The flat rate is still $80, and the extended-zone average is about 25 minutes. Those board times are indicative. Call (313) 771-7521 and we'll tell you the live ETA.",
    paragraphs: [
      "Detroit proper — Downtown, Corktown, Midtown, Belle Isle, and the Riverfront — is the $60 primary zone, about 20 minutes on average. Livonia is outside that, with Southfield, Warren, Sterling Heights, and Westland.",
      "24/7, pay-per-use, no membership. Card, Cash App, Venmo, Apple Pay, or Stripe. Pay before or after. Late night from 12 AM to 6 AM is an extra fee, quoted on the call. If the boost doesn't take, the diagnostic is free.",
      "It's a roadside battery boost and jump start. Call and a person answers — not a call center.",
    ],
  },
  {
    slug: "westland",
    name: "Westland",
    eta: 27,
    title: "Battery Boost in Westland, MI — $80 Flat | Boosted 24/7",
    description:
      "Westland battery boost for a flat $80. Boosted 24/7 works out to Westland, 24/7. Indicative ETA about 27 minutes. Call (313) 771-7521.",
    lede: "The crew works Detroit streets from Belle Isle out to Westland. A Westland battery boost is the extended rate, $80 flat. The board shows an indicative ETA of about 27 minutes. Call for the live ETA.",
    paragraphs: [
      "Inside Detroit city limits the jump is $60, about 20 minutes on average: Downtown, Corktown, Midtown, Belle Isle, and the Riverfront. Westland is grouped with Southfield, Warren, Sterling Heights, and Livonia at $80, with about a 25-minute average across that extended zone.",
      "We're local — real humans, not a call center — and we're on shift 24/7. No membership, no hidden fees. Pay by card, Cash App, Venmo, Apple Pay, or Stripe, before or after. Midnight to 6 AM adds a late-night fee we quote on the call.",
      "If the boost doesn't take, we diagnose it free. Call (313) 771-7521.",
    ],
  },
].map((city) => ({
  ...city,
  facts: sharedFacts(city),
  faqs: cityFaqs(city),
}));

export const cityPath = (slug) => `/service-areas/${slug}/`;

export const cityUrl = (slug) => `${SITE}${cityPath(slug)}`;

export function normalizePath(pathname) {
  if (!pathname) return "/";
  let path = String(pathname).split("?")[0].split("#")[0];
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function matchRoute(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return { page: "home" };
  const match = path.match(/^\/service-areas\/([a-z0-9-]+)$/);
  if (match) {
    const city = CITIES.find((item) => item.slug === match[1]);
    if (city) return { page: "city", city };
  }
  return { page: "notfound" };
}
