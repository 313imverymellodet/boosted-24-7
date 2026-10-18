import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CITIES, cityPath } from "../src/config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "dist/index.html");
const template = fs.readFileSync(templatePath, "utf8");

if (!template.includes("<!--app-html-->") || !template.includes("<!--head-tags-->")) {
  throw new Error("Prerender placeholders missing from dist/index.html. Vite may have stripped the HTML comments.");
}

const serverEntry = path.join(root, "build/server/entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href);

const routes = ["/", ...CITIES.map((city) => cityPath(city.slug)), "/404"];

for (const route of routes) {
  const { html, head } = render(route);
  if (!html || !html.includes("<h1")) {
    throw new Error(`Route ${route} rendered without an h1`);
  }
  const page = template
    .replace("<!--head-tags-->", head)
    .replace("<!--app-html-->", html);

  const outfile =
    route === "/"
      ? path.join(root, "dist/index.html")
      : route === "/404"
        ? path.join(root, "dist/404.html")
        : path.join(root, "dist", route.replace(/^\//, ""), "index.html");

  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  fs.writeFileSync(outfile, page);
  console.log(`prerendered ${route} -> ${path.relative(root, outfile)} (${html.length} bytes of markup)`);
}
