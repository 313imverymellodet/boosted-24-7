import { useState } from "react";
import { PHONE_DISPLAY, PHONE_HREF, tiers } from "./config.js";
import {
  AreaLinks,
  ClosingCTA,
  FaqList,
  Footer,
  LiveDot,
  Mono,
  PayModal,
  StickyAction,
  Tag,
  TopBar,
} from "./ui.jsx";

const outsideTier = tiers.find((tier) => tier.id === "outside");

export function CityPage({ city }) {
  const [payTier, setPayTier] = useState(null);

  return (
    <div className="app">
      <TopBar />
      <main>
        <section className="hero city-hero">
          <div className="hero-grid">
            <div className="hero-left">
              <nav className="breadcrumb mono" aria-label="Breadcrumb">
                <a href="/">HOME</a>
                <span className="dim">/</span>
                <span>{city.name.toUpperCase()}</span>
              </nav>
              <div className="hero-meta">
                <Mono className="dim">SERVICE AREA · EXTENDED ZONE</Mono>
                <Mono>
                  <LiveDot size={6} /> &nbsp; 24/7
                </Mono>
              </div>
              <h1 className="display">
                <span className="line">{city.name.toUpperCase()}</span>
                <span className="line accent">BATTERY BOOST.</span>
              </h1>
              <div className="hero-sub">
                <p>{city.lede}</p>
              </div>
              <div className="hero-ctas">
                <a href={PHONE_HREF} className="btn btn-rust">
                  <span className="btn-label">CALL NOW</span>
                  <span className="btn-sub mono">{PHONE_DISPLAY}</span>
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => setPayTier(outsideTier)}>
                  <span className="btn-label">PAY $80 NOW</span>
                  <span className="btn-sub mono">SECURE CHECKOUT</span>
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-num">~{city.eta}<span className="stat-unit">MIN</span></div>
                  <div className="stat-label mono">INDICATIVE ETA</div>
                </div>
                <div className="stat">
                  <div className="stat-num">$80<span className="stat-unit">FLAT</span></div>
                  <div className="stat-label mono">EXTENDED ZONE</div>
                </div>
                <div className="stat">
                  <div className="stat-num">24<span className="stat-unit">/7</span></div>
                  <div className="stat-label mono">ON SHIFT, ALWAYS</div>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="readout-card">
                <Mono className="dim">SELECTED ZONE</Mono>
                <div className="readout-name">{city.name.toUpperCase()}</div>
                <div className="readout-stat">
                  <div>
                    <Mono className="dim">BOARD ETA</Mono>
                    <div className="big-num">
                      ~{city.eta}
                      <span className="big-unit mono">MIN</span>
                    </div>
                  </div>
                  <div>
                    <Mono className="dim">TIER</Mono>
                    <div className="tier-pill">
                      <Tag color="bone">OUTSIDE · $80</Tag>
                    </div>
                  </div>
                </div>
                <p className="tier-note" style={{ borderBottom: "none", marginBottom: 16 }}>
                  Indicative. Call for a live ETA. Detroit city limits stay $60.
                </p>
                <a href={PHONE_HREF} className="btn btn-rust btn-block">
                  <span className="btn-label">DISPATCH TO {city.name.toUpperCase()}</span>
                  <span className="btn-sub mono">{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="city-body">
          <div className="section-head">
            <Mono className="dim">§ 01 / ON THE GROUND</Mono>
            <h2 className="section-title city-section-title">
              WHAT YOU GET<br />
              <span className="accent">IN {city.name.toUpperCase()}.</span>
            </h2>
          </div>
          <div className="city-prose">
            {city.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="city-facts">
              {city.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="faq" id="faq">
          <div className="section-head">
            <Mono className="dim">§ 02 / FAQ</Mono>
            <h2 className="section-title city-section-title">
              {city.name.toUpperCase()}<br />
              <span className="accent">FAQ.</span>
            </h2>
          </div>
          <FaqList items={city.faqs} />
        </section>

        <section className="areas">
          <div className="section-head">
            <Mono className="dim">§ 03 / ALSO COVERED</Mono>
            <h2 className="section-title">
              OTHER<br />
              <span className="accent">CITIES.</span>
            </h2>
            <p className="section-lede">
              The rest of the extended zone is the same $80 flat rate. Detroit city limits stay $60.
            </p>
          </div>
          <AreaLinks currentSlug={city.slug} />
        </section>

        <ClosingCTA onPay={() => setPayTier(outsideTier)} price={80} kicker="§ 04 / NOW WHAT" />
      </main>
      <Footer />
      <StickyAction onPay={() => setPayTier(outsideTier)} payLabel="PAY $80" />
      {payTier && <PayModal tier={payTier} onClose={() => setPayTier(null)} />}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="app">
      <TopBar />
      <main>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-left">
              <Mono className="dim">§ 404</Mono>
              <h1 className="display">
                <span className="line">OFF THE</span>
                <span className="line accent">MAP.</span>
              </h1>
              <p className="hero-sub">
                That page isn't on the board. The crew is still on shift — call {PHONE_DISPLAY} or head back to Detroit dispatch.
              </p>
              <div className="hero-ctas">
                <a href="/" className="btn btn-rust">
                  <span className="btn-label">BACK TO DISPATCH</span>
                  <span className="btn-sub mono">BOOSTED 24/7</span>
                </a>
                <a href={PHONE_HREF} className="btn btn-ghost">
                  <span className="btn-label">CALL NOW</span>
                  <span className="btn-sub mono">{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
