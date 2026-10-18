import { CityPage, NotFound } from "./city.jsx";
import { matchRoute } from "./config.js";
import HomePage from "./home.jsx";

export default function App({ url }) {
  const path = url ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const route = matchRoute(path);
  if (route.page === "home") return <HomePage />;
  if (route.page === "city") return <CityPage city={route.city} />;
  return <NotFound />;
}
