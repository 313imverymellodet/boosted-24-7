import { useEffect, useState } from "react";
import {
  CITIES,
  PHONE_DISPLAY,
  PHONE_HREF,
  STRIPE_LINKS,
  cityPath,
  stripeUrlFor,
  submitLead,
} from "./config.js";

export const Stripe = ({ className = "", height = 8 }) => (
  <div
    className={className}
    style={{
      height,
      background:
        "repeating-linear-gradient(45deg, var(--caution) 0 12px, var(--ink) 12px 24px)",
    }}
  />
);

export const Mono = ({ children, className = "", style = {} }) => (
  <span className={"mono " + className} style={style}>
    {children}
  </span>
);

export const Tag = ({ children, color = "rust", filled = false }) => (
  <span
    className="mono"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 8px",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      border: `1px solid var(--${color})`,
      background: filled ? `var(--${color})` : "transparent",
      color: filled ? "var(--ink)" : `var(--${color})`,
      fontWeight: 600,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

export const LiveDot = ({ size = 8, color = "var(--rust)" }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 0 4px ${color}33`,
      animation: "pulse 1.6s ease-in-out infinite",
    }}
  />
);

export const useDetroitClock = () => {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return "--:--:--";
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Detroit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return fmt.format(now);
};

export const TopBar = () => {
  const time = useDetroitClock();
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <span className="mono dim">DET ·</span>
          <span className="mono">{time}</span>
          <span className="mono dim hide-mobile"> · 42.3314° N, 83.0458° W</span>
        </div>
        <div className="topbar-right">
          <span className="mono dim hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <LiveDot size={6} color="#27c46b" />
            ON SHIFT · CREWS AVAILABLE
          </span>
          <a href={PHONE_HREF} className="topbar-call">
            <span className="mono">CALL {PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
      <Stripe height={4} />
    </div>
  );
};

export const FaqList = ({ items }) => (
  <div className="faq-list">
    {items.map((item) => (
      <article key={item.q} className="faq-item">
        <h3>{item.q}</h3>
        <p>{item.a}</p>
      </article>
    ))}
  </div>
);

export const AreaLinks = ({ currentSlug }) => (
  <nav className="area-strip" aria-label="Service areas">
    <span className="mono dim">EXTENDED ZONE · $80</span>
    {CITIES.map((city) =>
      city.slug === currentSlug ? (
        <span key={city.slug} aria-current="page">
          {city.name} battery boost
        </span>
      ) : (
        <a key={city.slug} href={cityPath(city.slug)}>
          {city.name} battery boost
        </a>
      )
    )}
  </nav>
);

export const ClosingCTA = ({ onPay, price = 60, kicker = "§ 05 / NOW WHAT" }) => (
  <section className="closing" data-screen-label="Closing CTA">
    <div className="closing-inner">
      <Mono className="dim">{kicker}</Mono>
      <h2 className="closing-title">
        STUCK
        <br />
        <span className="accent">RIGHT NOW?</span>
      </h2>
      <p className="closing-sub">
        Don't wait it out. Call or pay — either gets a rig rolling toward you in under five minutes.
      </p>
      <div className="closing-ctas">
        <a href={PHONE_HREF} className="btn btn-rust btn-lg">
          <span className="btn-label">CALL {PHONE_DISPLAY}</span>
          <span className="btn-sub mono">FASTEST DISPATCH</span>
        </a>
        <button className="btn btn-bone btn-lg" type="button" onClick={onPay}>
          <span className="btn-label">PAY ONLINE FIRST</span>
          <span className="btn-sub mono">FROM ${price} · STRIPE / VENMO / CASHAPP</span>
        </button>
      </div>
    </div>
    <Stripe height={6} />
  </section>
);

export const Footer = () => (
  <footer className="footer" data-screen-label="Footer">
    <div className="footer-grid">
      <div>
        <a href="/" className="footer-brand">
          BOOSTED <span className="accent">24/7</span>
        </a>
        <p className="footer-tag">
          Motor City roadside boosts. Honest pricing, real humans, no membership trap.
        </p>
      </div>
      <div>
        <Mono className="dim">DISPATCH</Mono>
        <ul className="footer-list">
          <li><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></li>
          <li>Detroit Metro · 24/7</li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <Mono className="dim">PAY</Mono>
        <ul className="footer-list">
          <li>Card · Stripe</li>
          <li>CashApp · Venmo · Apple Pay</li>
        </ul>
      </div>
      <div>
        <Mono className="dim">COVERAGE</Mono>
        <ul className="footer-list">
          <li>Primary · Downtown, Corktown, Midtown, Belle Isle, Riverfront · $60</li>
          {CITIES.map((city) => (
            <li key={city.slug}>
              <a href={cityPath(city.slug)}>{city.name} · $80</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="footer-base">
      <Mono className="dim">© 2026 BOOSTED 24/7 · DETROIT, MI</Mono>
      <Mono className="dim">DETROIT'S TRUSTED 24/7 ROADSIDE BOOST</Mono>
    </div>
  </footer>
);

export const PayModal = ({ tier, onClose }) => {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  if (!tier) return null;

  return (
    <div className="modal-shell" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <div className="modal-head">
          <div>
            <Mono className="dim">SECURE CHECKOUT · STEP {step + 1} / 2</Mono>
            <div className="modal-title" id="pay-title">
              {tier.price !== null ? (
                <>
                  PAY <span className="accent">${tier.price}</span> · {tier.label}
                </>
              ) : (
                <>LATE NIGHT · QUOTE ON CALL</>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">×</button>
        </div>

        <Stripe height={3} />

        {step === 0 && (
          <div className="modal-body">
            <div className="form-row">
              <Mono className="dim">YOUR LOCATION</Mono>
              <input
                className="input"
                placeholder="Street address or nearest cross-streets"
                aria-label="Your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-row">
              <Mono className="dim">PHONE</Mono>
              <input
                className="input"
                placeholder="(313) ___ - ____"
                aria-label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-row">
              <Mono className="dim">PAYMENT</Mono>
              <div className="pay-methods-info">
                <Mono>STRIPE CHECKOUT</Mono>
                <Mono className="dim">CARD · APPLE PAY · CASH APP PAY</Mono>
                <Mono className="dim" style={{ marginTop: 6 }}>VENMO &amp; CASH ACCEPTED IN-PERSON</Mono>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-rust btn-block"
              onClick={() => {
                submitLead({
                  _subject: `Boost lead — ${tier.label}${tier.price !== null ? ` · $${tier.price}` : " · Late Night"}`,
                  tier: tier.label,
                  price: tier.price !== null ? `$${tier.price}` : "Variable (late night)",
                  location,
                  customer_phone: phone,
                });
                setStep(1);
              }}
              disabled={!location || !phone}
            >
              <span className="btn-label">CONTINUE TO PAY{tier.price ? ` $${tier.price}` : ""}</span>
              <span className="btn-sub mono">SECURE · ENCRYPTED</span>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="modal-body">
            <div className="confirm">
              <div className="confirm-row">
                <Mono className="dim">DISPATCH TO</Mono>
                <span>{location}</span>
              </div>
              <div className="confirm-row">
                <Mono className="dim">CALLBACK</Mono>
                <span>{phone}</span>
              </div>
              <div className="confirm-row">
                <Mono className="dim">TIER</Mono>
                <span>{tier.label}</span>
              </div>
              <div className="confirm-row confirm-total">
                <Mono className="dim">TOTAL</Mono>
                <span className="big">{tier.price !== null ? `$${tier.price}.00` : "Quote on call"}</span>
              </div>
            </div>

            <div className="confirm-note">
              <Mono className="dim">NEXT</Mono>
              <p>You'll be handed off to Stripe to pay securely. After payment, a crew calls you back within minutes to confirm pickup.</p>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                <span className="btn-label">← BACK</span>
              </button>
              <a
                href={stripeUrlFor(tier, phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rust"
              >
                <span className="btn-label">
                  {tier.price !== null ? `PAY $${tier.price} NOW` : "PAY LATE NIGHT FEE"}
                </span>
                <span className="btn-sub mono">SECURE · STRIPE</span>
              </a>
            </div>

            <div className="confirm-callfallback">
              <Mono className="dim">PREFER TO TALK FIRST?</Mono>
              <a href={PHONE_HREF} className="mono callfallback-link">
                CALL {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const StickyAction = ({ onPay, payLabel = "PAY $60" }) => (
  <div className="sticky-action">
    <a href={PHONE_HREF} className="btn btn-rust btn-flex">
      <span className="btn-label">CALL NOW</span>
    </a>
    <button type="button" className="btn btn-bone btn-flex" onClick={onPay}>
      <span className="btn-label">{payLabel}</span>
    </button>
  </div>
);

export const CustomPayLink = () => (
  <div className="pricing-custom">
    <Mono className="dim">SOMETHING DIFFERENT?</Mono>
    <a
      href={STRIPE_LINKS.custom}
      target="_blank"
      rel="noopener noreferrer"
      className="pricing-custom-link mono"
    >
      PAY A CUSTOM AMOUNT →
    </a>
  </div>
);
