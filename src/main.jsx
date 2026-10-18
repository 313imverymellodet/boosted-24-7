import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const el = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const prerendered = [...el.childNodes].some((node) => node.nodeType === Node.ELEMENT_NODE);

if (prerendered) {
  hydrateRoot(el, app);
} else {
  el.replaceChildren();
  createRoot(el).render(app);
}
