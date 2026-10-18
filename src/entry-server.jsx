import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { renderHead } from "./seo.js";

export function render(url) {
  const html = renderToString(
    <StrictMode>
      <App url={url} />
    </StrictMode>
  );
  return { html, head: renderHead(url) };
}
