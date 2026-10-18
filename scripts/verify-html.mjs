import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CITIES, HOME_FAQS, cityPath } from "../src/config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const failures = [];

const fail = (message) => failures.push(message);

const read = (rel) => fs.readFileSync(path.join(dist, rel), "utf8");

function visibleText(html) {
  const body = html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  const text = visibleText(html);
  return text ? text.split(/\s+/).length : 0;
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.map((match) => JSON.parse(match[1]));
}

const pages = [
  { file: "index.html", path: "/", faqs: HOME_FAQS, h1: "STUCK?", price: "$60" },
  ...CITIES.map((city) => ({
    file: `service-areas/${city.slug}/index.html`,
    path: cityPath(city.slug),
    faqs: city.faqs,
    h1: city.name.toUpperCase(),
    price: "$80",
    city,
  })),
];

const canonicalHost = "https://www.boostdetroit247.com";
const imageUrl = `${canonicalHost}/images/detroit-skyline.jpg`;

for (const page of pages) {
  const html = read(page.file);
  const words = wordCount(html);
  const minWords = page.city ? 180 : 400;
  if (words < minWords) fail(`${page.file} has only ${words} visible words (need ${minWords})`);

  const h1 = html.match(/<h1[\s\S]*?<\/h1>/i)?.[0] ?? "";
  if (!h1.includes(page.h1)) fail(`${page.file} h1 missing "${page.h1}"`);

  if (!html.includes(page.price)) fail(`${page.file} missing price ${page.price}`);
  if (!html.includes("(313) 771-7521")) fail(`${page.file} missing phone display`);
  if (!html.includes("tel:3137717521")) fail(`${page.file} missing tel link`);
  if (!/battery/i.test(visibleText(html)) || !/boost/i.test(visibleText(html))) {
    fail(`${page.file} missing battery boost wording`);
  }

  const expectedUrl = page.path === "/" ? `${canonicalHost}/` : `${canonicalHost}${page.path}`;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonical || canonical[1] !== expectedUrl) {
    fail(`${page.file} canonical is ${canonical?.[1] ?? "missing"}, expected ${expectedUrl}`);
  }
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/);
  if (!ogUrl || ogUrl[1] !== expectedUrl) fail(`${page.file} og:url mismatch`);
  if (!html.includes(`property="og:image" content="${imageUrl}"`)) fail(`${page.file} og:image mismatch`);
  if (!html.includes(`name="twitter:image" content="${imageUrl}"`)) fail(`${page.file} twitter:image mismatch`);

  if (html.includes("boosted-24-7.vercel.app")) fail(`${page.file} still points at vercel.app`);
  if (html.includes("unpkg.com") || html.includes("text/babel") || html.includes("react.development")) {
    fail(`${page.file} still loads the in-browser dev React/Babel stack`);
  }
  if (!html.includes('defer src="/whop-pixel.js"') && !html.includes("defer src='/whop-pixel.js'")) {
    fail(`${page.file} Whop pixel is not deferred`);
  }
  if (html.includes("t.whop.tw")) fail(`${page.file} inlines the Whop pixel`);

  const ld = extractJsonLd(html);
  const business = ld.find((block) => {
    const type = block["@type"];
    const types = Array.isArray(type) ? type : [type];
    return types.includes("LocalBusiness");
  });
  if (!business) fail(`${page.file} missing LocalBusiness JSON-LD`);
  else {
    if (business.url !== expectedUrl) fail(`${page.file} JSON-LD url is ${business.url}`);
    if (business.image !== imageUrl) fail(`${page.file} JSON-LD image is ${business.image}`);
  }

  const faq = ld.find((block) => block["@type"] === "FAQPage");
  if (!faq) fail(`${page.file} missing FAQPage JSON-LD`);
  else {
    const entities = faq.mainEntity ?? [];
    if (entities.length !== page.faqs.length) {
      fail(`${page.file} FAQPage has ${entities.length} questions, visible set has ${page.faqs.length}`);
    }
    page.faqs.forEach((item, index) => {
      const entity = entities[index];
      if (!entity || entity.name !== item.q || entity.acceptedAnswer?.text !== item.a) {
        fail(`${page.file} FAQPage item ${index + 1} does not match the visible FAQ`);
      }
      if (!html.includes(item.q) || !html.includes(item.a)) {
        fail(`${page.file} visible HTML is missing FAQ copy: ${item.q}`);
      }
    });
  }

  if (page.city) {
    for (const other of CITIES) {
      if (other.slug === page.city.slug) continue;
      if (!html.includes(`href="${cityPath(other.slug)}"`)) {
        fail(`${page.file} does not link to ${other.slug}`);
      }
    }
    if (!html.includes('href="/"')) fail(`${page.file} does not link home`);
  }
}

const home = read("index.html");
for (const city of CITIES) {
  if (!home.includes(`href="${cityPath(city.slug)}"`)) {
    fail(`homepage does not link to ${city.slug}`);
  }
}

const notFound = read("404.html");
if (!notFound.includes("<h1")) fail("404.html missing h1");
if (!notFound.includes('content="noindex"')) fail("404.html missing noindex");
if (notFound.includes("boosted-24-7.vercel.app")) fail("404.html points at vercel.app");

const robots = read("robots.txt");
if (!robots.includes("Sitemap: https://www.boostdetroit247.com/sitemap.xml")) {
  fail("robots.txt missing sitemap URL");
}
if (!/Allow:\s*\//.test(robots)) fail("robots.txt missing Allow");

const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedLocs = [`${canonicalHost}/`, ...CITIES.map((city) => `${canonicalHost}${cityPath(city.slug)}`)];
if (locs.length !== expectedLocs.length || expectedLocs.some((loc) => !locs.includes(loc))) {
  fail(`sitemap locs ${JSON.stringify(locs)} do not match pages`);
}
if (sitemap.includes("boosted-24-7.vercel.app")) fail("sitemap points at vercel.app");

for (const file of ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "whop-pixel.js", "images/detroit-skyline.jpg"]) {
  const full = path.join(dist, file);
  if (!fs.existsSync(full) || fs.statSync(full).size < 20) fail(`missing or empty ${file}`);
}

const pixel = read("whop-pixel.js");
if (!pixel.includes("https://t.whop.tw") || !pixel.includes("biz_Aw3NKeHA48H63N")) {
  fail("whop-pixel.js lost the tracker");
}

const jsFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js") && full.includes(`${path.sep}assets${path.sep}`)) jsFiles.push(full);
  }
};
walk(dist);
const bundleBytes = jsFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
if (bundleBytes > 400_000) fail(`JS bundle is ${bundleBytes} bytes — expected a production build well under the old 915KB dev payload`);
const bundle = jsFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
if (bundle.includes("react.development") || bundle.includes("unpkg.com")) {
  fail("production bundle still references the development React build");
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const redirect = (vercel.redirects ?? []).find((rule) =>
  (rule.has ?? []).some((cond) => cond.type === "host" && String(cond.value).includes("boosted-24-7"))
);
if (!redirect) fail("vercel.json missing boosted-24-7.vercel.app host redirect");
else if (redirect.permanent !== true) fail("vercel.app redirect is not permanent (308)");
else if (!String(redirect.destination).startsWith("https://www.boostdetroit247.com")) {
  fail("vercel.app redirect destination is wrong");
}

if (failures.length) {
  console.error(`\n${failures.length} HTML check(s) failed:`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Verified ${pages.length} pages plus 404, robots.txt, and sitemap.xml.`);
console.log(`Homepage words: ${wordCount(home)}. Production JS: ${(bundleBytes / 1024).toFixed(1)} KB.`);
for (const page of pages.slice(1)) {
  console.log(`${page.file}: ${wordCount(read(page.file))} words, h1 ok`);
}
