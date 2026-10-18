import { useEffect, useState } from "react";
import { CITIES, HOME_FAQS, PHONE_DISPLAY, PHONE_HREF, cityPath, tiers } from "./config.js";
import {
  AreaLinks,
  ClosingCTA,
  CustomPayLink,
  FaqList,
  Footer,
  LiveDot,
  Mono,
  PayModal,
  StickyAction,
  Stripe,
  Tag,
  TopBar,
} from "./ui.jsx";

const Hero = ({ onPay }) => (
  <section className="hero" data-screen-label="Hero">
    <div className="hero-grid">
      <div className="hero-left">
        <div className="hero-meta">
          <Mono className="dim">§ 01 / DISPATCH</Mono>
          <Mono>
            <LiveDot size={6} /> &nbsp; LIVE
          </Mono>
        </div>

        <h1 className="display">
          <span className="line">STUCK?</span>
          <span className="line accent">
            WE GOT
            <br />
            YOU.
          </span>
        </h1>

        <div className="hero-sub">
          <p>
            Dead battery in Detroit Metro? A boosted truck is already nearby.
            Average response: <strong>~20 minutes</strong>, day or night,
            flat-rate honest pricing.
          </p>
        </div>

        <div className="hero-ctas">
          <a href={PHONE_HREF} className="btn btn-rust">
            <span className="btn-label">CALL NOW</span>
            <span className="btn-sub mono">{PHONE_DISPLAY}</span>
          </a>
          <button type="button" className="btn btn-ghost" onClick={onPay}>
            <span className="btn-label">PAY ONLINE</span>
            <span className="btn-sub mono">FROM $60</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">~20<span className="stat-unit">MIN</span></div>
            <div className="stat-label mono">AVG RESPONSE</div>
          </div>
          <div className="stat">
            <div className="stat-num">24<span className="stat-unit">/7</span></div>
            <div className="stat-label mono">ON SHIFT, ALWAYS</div>
          </div>
          <div className="stat">
            <div className="stat-num">$60<span className="stat-unit">FLAT</span></div>
            <div className="stat-label mono">DETROIT METRO</div>
          </div>
        </div>

        <ul className="hero-guarantees" aria-label="Service guarantees">
          <li><span className="g-mark" aria-hidden="true">+</span><Mono>BOOST DOESN'T TAKE? FREE DIAGNOSTIC</Mono></li>
          <li><span className="g-mark" aria-hidden="true">+</span><Mono>NO MEMBERSHIP · NO HIDDEN FEES</Mono></li>
          <li><span className="g-mark" aria-hidden="true">+</span><Mono>REAL HUMANS · NOT A CALL CENTER</Mono></li>
        </ul>
      </div>

      <div className="hero-right">
        <DispatchPanel />
      </div>
    </div>

    <div className="hero-marquee">
      <div className="marquee-track">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="marquee-row">
            <Mono>DOWNTOWN</Mono> <em>·</em>
            <Mono>CORKTOWN</Mono> <em>·</em>
            <Mono>MIDTOWN</Mono> <em>·</em>
            <Mono>BELLE ISLE</Mono> <em>·</em>
            <Mono>RIVERFRONT</Mono> <em>·</em>
            <Mono>SOUTHFIELD</Mono> <em>·</em>
            <Mono>WARREN</Mono> <em>·</em>
            <Mono>STERLING HEIGHTS</Mono> <em>·</em>
            <Mono>LIVONIA</Mono> <em>·</em>
            <Mono>WESTLAND</Mono> <em>·</em>
          </span>
        ))}
      </div>
    </div>
  </section>
);

const DispatchPanel = () => {
  const [eta, setEta] = useState(18);
  const [crews, setCrews] = useState(7);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setEta((e) => Math.max(14, Math.min(24, e + (Math.random() < 0.5 ? -1 : 1))));
      setCrews((c) => Math.max(5, Math.min(9, c + (Math.random() < 0.5 ? -1 : 1))));
      setPulse((p) => p + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dispatch">
      <div className="dispatch-head">
        <Mono className="dim">DISPATCH BOARD</Mono>
        <Mono style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LiveDot size={6} color="#27c46b" /> LIVE
        </Mono>
      </div>

      <div className="dispatch-readout">
        <div className="readout-row">
          <Mono className="dim">ETA TO YOU</Mono>
          <div className="readout-val">
            <span key={pulse + "e"} className="flip">{eta}</span>
            <span className="readout-unit mono">MIN</span>
          </div>
        </div>
        <div className="readout-row">
          <Mono className="dim">CREWS ON ROAD</Mono>
          <div className="readout-val">
            <span key={pulse + "c"} className="flip">{crews}</span>
            <span className="readout-unit mono">RIGS</span>
          </div>
        </div>
        <div className="readout-row">
          <Mono className="dim">QUEUE</Mono>
          <div className="readout-val">
            <span className="flip">0</span>
            <span className="readout-unit mono">CALLS AHEAD</span>
          </div>
        </div>
      </div>

      <div className="dispatch-bars">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bar-row">
            <Mono className="dim" style={{ width: 56 }}>RIG-{String(i + 1).padStart(2, "0")}</Mono>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${20 + ((i * 13 + pulse * 7) % 75)}%`,
                  background: i % 3 === 0 ? "var(--rust)" : "var(--bone)",
                }}
              />
            </div>
            <Mono className="dim">
              {i % 3 === 0 ? "ON CALL" : i % 4 === 0 ? "RETURN" : "READY"}
            </Mono>
          </div>
        ))}
      </div>

      <div className="dispatch-foot">
        <Mono className="dim">INDICATIVE · CALL FOR LIVE ETA</Mono>
        <Mono>v.24.7</Mono>
      </div>
    </div>
  );
};

const Pricing = ({ onPay }) => (
  <section className="pricing" data-screen-label="Pricing">
    <div className="section-head">
      <Mono className="dim">§ 02 / PRICING</Mono>
      <h2 className="section-title">
        FLAT RATES.<br />
        <span className="accent">NO SURPRISES.</span>
      </h2>
      <p className="section-lede">
        Three tiers, no membership, no fine print. Pay before, pay after — whatever's easier when you're stranded.
      </p>
    </div>

    <div className="tier-grid">
      {tiers.map((t) => (
        <article key={t.id} className={"tier " + (t.popular ? "tier-popular" : "")}>
          {t.popular && (
            <div className="tier-flag">
              <Tag color="rust" filled>MOST CALLED</Tag>
            </div>
          )}

          <header className="tier-head">
            <Mono className="dim tier-id">TIER · {t.id.toUpperCase()}</Mono>
            <div className="tier-label">{t.label}</div>
          </header>

          <div className="tier-price">
            {t.price !== null ? (
              <>
                <span className="price-sign">$</span>
                <span className="price-num">{t.price}</span>
              </>
            ) : (
              <span className="price-num price-num-sm">VARIABLE</span>
            )}
            <span className="price-unit mono">{t.unit}</span>
          </div>

          <p className="tier-note">
            {t.id === "outside" ? (
              <>
                Extended coverage area ·{" "}
                {CITIES.map((city, index) => (
                  <span key={city.slug}>
                    {index > 0 ? ", " : null}
                    <a href={cityPath(city.slug)}>{city.name}</a>
                  </span>
                ))}
              </>
            ) : (
              t.note
            )}
          </p>

          <ul className="tier-feat">
            {t.features.map((f) => (
              <li key={f}>
                <span className="bullet">+</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={"btn " + (t.popular ? "btn-rust" : "btn-bone")}
            onClick={() => onPay(t)}
          >
            <span className="btn-label">{t.cta}</span>
            <span className="btn-sub mono">SECURE CHECKOUT</span>
          </button>
        </article>
      ))}
    </div>

    <div className="pricing-foot">
      <div className="pf-item">
        <Mono className="dim">NO MEMBERSHIP</Mono>
        <span>Pay-per-use only. Period.</span>
      </div>
      <div className="pf-item">
        <Mono className="dim">PAYMENT</Mono>
        <span>Card · CashApp · Venmo · Apple Pay · Stripe</span>
      </div>
      <div className="pf-item">
        <Mono className="dim">GUARANTEE</Mono>
        <span>Boost doesn't take? We diagnose, free.</span>
      </div>
    </div>

    <CustomPayLink />
  </section>
);

const zones = [
  { id: "downtown", name: "Downtown", x: 540, y: 460, primary: true, eta: 14 },
  { id: "corktown", name: "Corktown", x: 470, y: 440, primary: true, eta: 16 },
  { id: "midtown", name: "Midtown", x: 500, y: 390, primary: true, eta: 17 },
  { id: "belle", name: "Belle Isle", x: 615, y: 445, primary: true, eta: 19 },
  { id: "rivfront", name: "Riverfront", x: 555, y: 495, primary: true, eta: 15 },
  { id: "south", name: "Southfield", slug: "southfield", x: 280, y: 280, primary: false, eta: 24 },
  { id: "warren", name: "Warren", slug: "warren", x: 540, y: 230, primary: false, eta: 22 },
  { id: "sterling", name: "Sterling Hts.", slug: "sterling-heights", x: 600, y: 160, primary: false, eta: 26 },
  { id: "livonia", name: "Livonia", slug: "livonia", x: 165, y: 360, primary: false, eta: 28 },
  { id: "westland", name: "Westland", slug: "westland", x: 145, y: 430, primary: false, eta: 27 },
];

const Coverage = () => {
  const [active, setActive] = useState("downtown");
  const activeZ = zones.find((z) => z.id === active);

  return (
    <section className="coverage" data-screen-label="Coverage">
      <div className="section-head">
        <Mono className="dim">§ 03 / COVERAGE</Mono>
        <h2 className="section-title">
          WE KNOW EVERY<br />
          <span className="accent">BLOCK.</span>
        </h2>
        <p className="section-lede">
          Crews stationed across Detroit Metro. Tap a zone for the live ETA — no zip-code lottery, no "we'll see who's nearby."
        </p>
      </div>

      <div className="map-wrap">
        <div className="map-frame">
          <div className="map-frame-head">
            <Mono className="dim">DETROIT METRO · SVC GRID</Mono>
            <Mono className="dim">SCALE 1 : 28K</Mono>
          </div>

          <svg className="map" viewBox="0 0 760 580" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" fill="none" stroke="#2a2723" strokeWidth="0.5" />
              </pattern>
              <pattern id="gridLg" width="160" height="160" patternUnits="userSpaceOnUse">
                <path d="M160 0 L0 0 0 160" fill="none" stroke="#3a3530" strokeWidth="0.6" />
              </pattern>
            </defs>

            <rect width="760" height="580" fill="#141311" />
            <rect width="760" height="580" fill="url(#grid)" />
            <rect width="760" height="580" fill="url(#gridLg)" />

            <path
              d="M 0 540 Q 200 510 380 540 T 760 530 L 760 580 L 0 580 Z"
              fill="#0a0a09"
              stroke="#3a3530"
              strokeWidth="0.8"
            />
            <text x="650" y="565" className="map-label" fill="#5a544d">DETROIT RIVER</text>

            <line x1="0" y1="190" x2="760" y2="190" stroke="#3a3530" strokeWidth="1.2" strokeDasharray="2 4" />
            <text x="10" y="184" className="map-label" fill="#6b6660">8 MILE RD</text>

            <line x1="0" y1="320" x2="760" y2="280" stroke="#3a3530" strokeWidth="1" />
            <text x="10" y="316" className="map-label" fill="#5a544d">I-94</text>

            <line x1="540" y1="0" x2="500" y2="580" stroke="#3a3530" strokeWidth="1" />
            <text x="544" y="60" className="map-label" fill="#5a544d">I-75</text>

            <line x1="320" y1="0" x2="500" y2="580" stroke="#3a3530" strokeWidth="0.8" />
            <text x="365" y="60" className="map-label" fill="#5a544d">M-10</text>

            <polygon
              points="420,360 660,400 640,520 460,540 410,470"
              fill="#d6391911"
              stroke="#d63919"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="450" y="380" className="map-label-lg" fill="#d63919">PRIMARY ZONE · ~20 MIN</text>

            <polygon
              points="80,140 660,90 720,330 480,560 90,490"
              fill="none"
              stroke="#6b6660"
              strokeWidth="0.8"
              strokeDasharray="2 6"
            />
            <text x="100" y="158" className="map-label" fill="#8a847c">EXTENDED ZONE · ~25 MIN</text>

            {activeZ && (
              <g>
                <line
                  x1={activeZ.x - 24}
                  y1={activeZ.y}
                  x2={activeZ.x + 24}
                  y2={activeZ.y}
                  stroke="var(--bone)"
                  strokeWidth="0.6"
                />
                <line
                  x1={activeZ.x}
                  y1={activeZ.y - 24}
                  x2={activeZ.x}
                  y2={activeZ.y + 24}
                  stroke="var(--bone)"
                  strokeWidth="0.6"
                />
              </g>
            )}

            {zones.map((z) => {
              const isActive = z.id === active;
              const color = z.primary ? "#d63919" : "#ecead8";
              return (
                <g
                  key={z.id}
                  onClick={() => setActive(z.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(z.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${z.name} zone, ${z.eta} minute ETA, ${z.primary ? "primary tier $60" : "extended tier $80"}`}
                  aria-pressed={isActive}
                  style={{ cursor: "pointer" }}
                  className="zone-pin"
                >
                  {isActive && (
                    <circle
                      cx={z.x}
                      cy={z.y}
                      r="14"
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      className="pin-pulse"
                    />
                  )}
                  <circle cx={z.x} cy={z.y} r={isActive ? 5 : 3.5} fill={color} />
                  <text
                    x={z.x + 10}
                    y={z.y + 4}
                    className={"map-pin-label " + (isActive ? "active" : "")}
                    fill={isActive ? "var(--bone)" : z.primary ? "#d63919" : "#a8a298"}
                    fontWeight={isActive ? 700 : 500}
                  >
                    {z.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="map-frame-foot">
            <Mono className="dim">N ↑ · 42.33° N · 83.05° W</Mono>
            <Mono className="dim">CLICK A ZONE</Mono>
          </div>
        </div>

        <aside className="map-side">
          <div className="readout-card">
            <Mono className="dim">SELECTED ZONE</Mono>
            <div className="readout-name">{activeZ.name.toUpperCase()}</div>
            <div className="readout-stat">
              <div>
                <Mono className="dim">CURRENT ETA</Mono>
                <div className="big-num">
                  ~{activeZ.eta}
                  <span className="big-unit mono">MIN</span>
                </div>
              </div>
              <div>
                <Mono className="dim">TIER</Mono>
                <div className="tier-pill">
                  {activeZ.primary ? <Tag color="rust" filled>METRO · $60</Tag> : <Tag color="bone">OUTSIDE · $80</Tag>}
                </div>
              </div>
            </div>
            <a href={PHONE_HREF} className="btn btn-rust btn-block">
              <span className="btn-label">DISPATCH TO {activeZ.name.toUpperCase()}</span>
              <span className="btn-sub mono">{PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="zone-list">
            <div className="zl-head">
              <Mono className="dim">PRIMARY ZONE</Mono>
              <Mono className="dim">~20 MIN · $60</Mono>
            </div>
            {zones.filter((z) => z.primary).map((z) => (
              <button
                type="button"
                key={z.id}
                onClick={() => setActive(z.id)}
                className={"zl-row " + (z.id === active ? "zl-active" : "")}
              >
                <span className="zl-dot" style={{ background: "var(--rust)" }} />
                <span className="zl-name">{z.name}</span>
                <Mono className="dim">~{z.eta}M</Mono>
              </button>
            ))}
            <div className="zl-head" style={{ marginTop: 18 }}>
              <Mono className="dim">EXTENDED ZONE</Mono>
              <Mono className="dim">~25 MIN · $80</Mono>
            </div>
            {zones.filter((z) => !z.primary).map((z) => (
              <div className="zl-line" key={z.id}>
                <button
                  type="button"
                  onClick={() => setActive(z.id)}
                  className={"zl-row " + (z.id === active ? "zl-active" : "")}
                >
                  <span className="zl-dot" style={{ background: "var(--bone)" }} />
                  <span className="zl-name">{z.name}</span>
                  <Mono className="dim">~{z.eta}M</Mono>
                </button>
                <a className="zl-more mono" href={cityPath(z.slug)}>
                  {z.name} page
                </a>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <AreaLinks />
    </section>
  );
};

const Skyline = () => (
  <section className="skyline" data-screen-label="Skyline interstitial">
    <div className="skyline-inner">
      <div className="skyline-left">
        <div className="skyline-meta">
          <LiveDot size={6} color="#27c46b" />
          <Mono>ON THE ROAD · ALL NIGHT</Mono>
        </div>
        <h2 className="skyline-title">
          BORN<br />
          IN THE <span className="accent">D.</span>
        </h2>
        <p className="skyline-sub">
          We aren't a callcenter routing you to whoever's closest. We're a Detroit-owned crew working Detroit streets — RenCen to 8 Mile, Belle Isle to Westland.
        </p>
        <div className="skyline-stat-row">
          <div className="stat">
            <div className="stat-num">2K<span className="stat-unit">+</span></div>
            <div className="stat-label mono">BOOSTS DELIVERED</div>
          </div>
          <div className="stat">
            <div className="stat-num">365<span className="stat-unit">DAYS</span></div>
            <div className="stat-label mono">NEVER CLOSED</div>
          </div>
          <div className="stat">
            <div className="stat-num">0<span className="stat-unit">FEES</span></div>
            <div className="stat-label mono">HIDDEN. EVER.</div>
          </div>
        </div>
      </div>
      <div className="skyline-right">
        <div className="skyline-tag">
          <Mono className="dim">DISPATCH HQ</Mono>
          <div className="skyline-tag-body">
            Trucks stationed across Metro Detroit — never more than a few minutes from any zone we cover.
          </div>
        </div>
        <div className="skyline-credit">PHOTO · DETROIT RIVERFRONT, 02:14 AM</div>
      </div>
    </div>
  </section>
);

const Faq = () => (
  <section className="faq" id="faq" data-screen-label="FAQ">
    <div className="section-head">
      <Mono className="dim">§ 04 / FAQ</Mono>
      <h2 className="section-title">
        QUESTIONS.<br />
        <span className="accent">STRAIGHT ANSWERS.</span>
      </h2>
      <p className="section-lede">
        Pricing, coverage, hours, and what happens if the boost doesn't take.
      </p>
    </div>
    <FaqList items={HOME_FAQS} />
  </section>
);

export default function HomePage() {
  const [payTier, setPayTier] = useState(null);
  const openPay = (tier) => setPayTier(tier || tiers[0]);

  return (
    <div className="app">
      <TopBar />
      <main>
        <Hero onPay={() => openPay()} />
        <Pricing onPay={openPay} />
        <Coverage />
        <Skyline />
        <Faq />
        <ClosingCTA onPay={() => openPay()} />
      </main>
      <Footer />
      <StickyAction onPay={() => openPay()} />
      {payTier && <PayModal tier={payTier} onClose={() => setPayTier(null)} />}
    </div>
  );
}
