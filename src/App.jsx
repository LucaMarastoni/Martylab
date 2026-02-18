import { useEffect, useMemo, useRef, useState } from "react";
import { filters, privacyCards, products } from "./data/gallery";

const withBase = (path) => `${import.meta.env.BASE_URL}${path}`;
const fakeReviews = [
  {
    id: 1,
    name: "Elisa R.",
    context: "Insegna in legno per atelier",
    text: "Lavoro pulitissimo e super personale. Dal bozzetto al pezzo finale, effetto wow garantito.",
    rating: 5
  },
  {
    id: 2,
    name: "Marco e Giulia",
    context: "Set bicchieri personalizzati",
    text: "Tempi rispettati e incisione elegante. In tavola hanno fatto davvero la differenza.",
    rating: 5
  },
  {
    id: 3,
    name: "Luca T.",
    context: "Targa metallo custom",
    text: "Dettagli precisi e ottima resa dal vivo. Risultato molto sopra le aspettative.",
    rating: 5
  }
];

function KineticTitle() {
  const words = ["Oggetti", "Unici", "Incisi", "A", "Mano"];

  return (
    <h1 className="hero__title" aria-label="Oggetti unici incisi a mano">
      {words.map((word, wordIndex) => (
        <span className="hero__word" key={word} style={{ "--word-delay": `${wordIndex * 120}ms` }}>
          {word.split("").map((char, index) => (
            <span className="hero__char" key={`${word}-${index}`} style={{ "--char-delay": `${index * 36}ms` }}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function ReviewShowcase({ reducedMotion }) {
  const [activeReview, setActiveReview] = useState(0);
  const currentReview = fakeReviews[activeReview];

  useEffect(() => {
    if (reducedMotion || fakeReviews.length <= 1) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % fakeReviews.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className="hero-reviews" aria-label="Recensioni clienti">
      <div className="hero-reviews__head">
        <span className="hero-reviews__stars" aria-hidden="true">
          ★★★★★
        </span>
        <span className="hero-reviews__score">4.9 media clienti</span>
      </div>

      <div className="hero-reviews__viewport">
        <article key={currentReview.id} className="hero-review">
          <p className="hero-review__text">“{currentReview.text}”</p>
          <p className="hero-review__rating" aria-label={`${currentReview.rating} stelle su 5`}>
            {"★".repeat(currentReview.rating)}
            {"☆".repeat(5 - currentReview.rating)}
          </p>
          <p className="hero-review__meta">
            <strong>{currentReview.name}</strong>
            <span>Acquisto: {currentReview.context}</span>
          </p>
        </article>
      </div>

      <div className="hero-reviews__dots" role="tablist" aria-label="Seleziona recensione">
        {fakeReviews.map((review, index) => (
          <button
            key={review.id}
            type="button"
            className={`hero-reviews__dot ${index === activeReview ? "is-active" : ""}`}
            aria-label={`Mostra recensione ${index + 1}`}
            aria-current={index === activeReview}
            onClick={() => setActiveReview(index)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [condensedHeader, setCondensedHeader] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [filterBarScrollable, setFilterBarScrollable] = useState(false);
  const filterBarRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setCondensedHeader((window.scrollY || window.pageYOffset || 0) > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lockScroll = lightboxItem || privacyOpen;
    document.body.style.overflow = lockScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxItem, privacyOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (lightboxItem) {
        setLightboxItem(null);
      }
      if (privacyOpen) {
        setPrivacyOpen(false);
      }
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxItem, menuOpen, privacyOpen]);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }
    return products.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar) {
      return undefined;
    }

    const updateScrollable = () => {
      setFilterBarScrollable(bar.scrollWidth - bar.clientWidth > 12);
    };

    updateScrollable();
    window.addEventListener("resize", updateScrollable);
    const timerId = window.setTimeout(updateScrollable, 120);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("resize", updateScrollable);
    };
  }, []);

  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar || reducedMotion || !filterBarScrollable) {
      return undefined;
    }

    let rafId = null;
    let lastFrame = 0;
    let direction = 1;
    let pauseUntil = performance.now() + 1200;
    const speed = 16; // px per second

    const maxScroll = () => Math.max(0, bar.scrollWidth - bar.clientWidth);

    const nudgePause = () => {
      pauseUntil = performance.now() + 2200;
    };

    const tick = (timestamp) => {
      if (!lastFrame) {
        lastFrame = timestamp;
      }

      const distance = maxScroll();
      const deltaSeconds = (timestamp - lastFrame) / 1000;
      lastFrame = timestamp;

      if (distance > 2 && timestamp >= pauseUntil) {
        bar.scrollLeft += direction * speed * deltaSeconds;

        if (bar.scrollLeft >= distance - 0.5) {
          bar.scrollLeft = distance;
          direction = -1;
          pauseUntil = timestamp + 1100;
        } else if (bar.scrollLeft <= 0.5) {
          bar.scrollLeft = 0;
          direction = 1;
          pauseUntil = timestamp + 1100;
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    bar.addEventListener("pointerdown", nudgePause, { passive: true });
    bar.addEventListener("wheel", nudgePause, { passive: true });
    bar.addEventListener("touchstart", nudgePause, { passive: true });
    bar.addEventListener("mouseenter", nudgePause, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      bar.removeEventListener("pointerdown", nudgePause);
      bar.removeEventListener("wheel", nudgePause);
      bar.removeEventListener("touchstart", nudgePause);
      bar.removeEventListener("mouseenter", nudgePause);
    };
  }, [filterBarScrollable, reducedMotion]);

  const onCardTilt = (event) => {
    if (reducedMotion) {
      return;
    }
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${offsetY * -8}deg`);
    card.style.setProperty("--tilt-y", `${offsetX * 10}deg`);
    card.style.setProperty("--flash-x", `${(offsetX + 0.5) * 100}%`);
    card.style.setProperty("--flash-y", `${(offsetY + 0.5) * 100}%`);
  };

  const resetCardTilt = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--flash-x", "50%");
    card.style.setProperty("--flash-y", "50%");
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className={`site-header ${condensedHeader ? "is-condensed" : ""}`}>
        <div className="container site-header__inner">
          <a href="#vetrina" className="logo" onClick={() => setMenuOpen(false)}>
            Marty Lab
          </a>
          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((state) => !state)}
          >
            <span className="menu-toggle__line" />
            <span className="sr-only">Apri o chiudi menu</span>
          </button>
          <nav id="site-nav" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navigazione principale">
            <a href="#vetrina" onClick={() => setMenuOpen(false)}>
              Vetrina
            </a>
            <a href="#galleria" onClick={() => setMenuOpen(false)}>
              Galleria
            </a>
            <a href="#contatti" onClick={() => setMenuOpen(false)}>
              Contatti
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="vetrina" className="hero section">
          <div className="hero__media" aria-hidden="true">
            <video
              className="hero__video"
              autoPlay={!reducedMotion}
              loop={!reducedMotion}
              muted
              playsInline
              preload="metadata"
              poster={withBase("assets/img/metallo4.jpeg")}
            >
              <source src={withBase("assets/vid/hero.mp4")} type="video/mp4" />
            </video>
          </div>
          <div className="hero__veil" aria-hidden="true" />
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="hero__eyebrow">Produzioni in evidenza</p>
              <KineticTitle />
              <p className="hero__subtitle">
                Materia, luce e incisioni d&apos;autore: ogni pezzo racconta una storia irripetibile, disegnata a mano.
              </p>
              <div className="hero__metrics" aria-hidden="true">
                <span>Legno • Metallo • Vetro • Tessuto</span>
                <span>Handmade in Verona</span>
              </div>
              <div className="hero__actions">
                <a href="#galleria" className="btn">
                  Esplora la galleria
                </a>
                <a href="#contatti" className="btn btn--ghost">
                  Contatta Anna
                </a>
              </div>
              <ReviewShowcase reducedMotion={reducedMotion} />
            </div>
          </div>
        </section>

        <section id="galleria" className="section">
          <div className="container">
            <header className="section-head">
              <h2>Galleria</h2>
              <p>Filtra per materiale e scorri subito tutte le lavorazioni.</p>
            </header>

            <div className={`filter-bar-wrap ${filterBarScrollable ? "is-scrollable" : ""}`}>
              <div ref={filterBarRef} className="filter-bar" role="group" aria-label="Filtra prodotti per categoria">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`filter-btn ${activeFilter === filter.id ? "is-active" : ""}`}
                    aria-pressed={activeFilter === filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {filterBarScrollable && (
                <span className="filter-bar-hint" aria-hidden="true">
                  Scorri →
                </span>
              )}
            </div>

            <div className="products-grid">
              {visibleProducts.map((item) => (
                <article
                  key={item.id}
                  className="product-card"
                  tabIndex={0}
                  role="button"
                  aria-label={`Apri immagine categoria ${item.categoryTitle}`}
                  onClick={() => setLightboxItem(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setLightboxItem(item);
                    }
                  }}
                  onMouseMove={onCardTilt}
                  onMouseLeave={resetCardTilt}
                >
                  <img src={withBase(`assets/img/${item.image}`)} alt={item.alt} loading="lazy" decoding="async" />
                  <div className="product-card__meta">
                    <span>{item.categoryTitle}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contatti" className="section contact">
          <div className="container contact__grid">
            <div className="contact__intro">
              <h2>Contatta Anna</h2>
              <p>
                Dal concept alla consegna: supporto su materiali, incisione, stampa e finitura, con preventivo
                personalizzato.
              </p>
              <ul>
                <li>Campionature rapide su vetro, metallo, legno e tessuto.</li>
                <li>Personalizzazioni per eventi, brand e regali unici.</li>
                <li>Appuntamenti in studio su richiesta a Verona.</li>
              </ul>
              <div className="contact__actions">
                <a className="btn" href="mailto:brizzianna83@gmail.com">
                  Scrivi una mail
                </a>
                <a className="btn btn--ghost" href="tel:+393482384828">
                  Chiama subito
                </a>
              </div>
            </div>

            <aside className="contact-card">
              <h3>Info e ordini</h3>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:brizzianna83@gmail.com">brizzianna83@gmail.com</a>
                  </dd>
                </div>
                <div>
                  <dt>Telefono</dt>
                  <dd>
                    <a href="tel:+393482384828">+39 348 238 4828</a>
                  </dd>
                </div>
                <div>
                  <dt>Studio</dt>
                  <dd>Verona, Italia</dd>
                </div>
                <div>
                  <dt>Disponibilita</dt>
                  <dd>Lun-Ven, 10:00-18:00</dd>
                </div>
              </dl>
              <p className="contact-card__note">Risposta media: entro 24 ore lavorative.</p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__content">
          <p>&copy; {currentYear} Marty Lab. Tutti i diritti riservati.</p>
          <button type="button" className="footer-link" onClick={() => setPrivacyOpen(true)}>
            Privacy e condizioni
          </button>
          <a className="footer-credit" href="https://lucamarastoni.eu" target="_blank" rel="noreferrer">
            Realizzato da Luca Marastoni Digital Solutions
          </a>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href="https://wa.me/393482384828"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apri chat WhatsApp con Anna"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3 29l6.78-1.78a12.76 12.76 0 0 0 6.22 1.6h.01c7.07 0 12.8-5.73 12.8-12.8 0-3.4-1.32-6.59-3.72-8.99A12.72 12.72 0 0 0 16 3.2zm0 23.22h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.03 1.06 1.08-3.93-.26-.4a10.59 10.59 0 0 1-1.7-5.76c0-5.86 4.77-10.62 10.64-10.62 2.84 0 5.52 1.11 7.53 3.13a10.56 10.56 0 0 1 3.11 7.49c0 5.86-4.77 10.62-10.58 10.62zm5.83-7.97c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.22.32-.86 1.05-1.05 1.27-.2.22-.4.24-.72.08-.32-.16-1.36-.5-2.6-1.6a9.8 9.8 0 0 1-1.8-2.23c-.19-.32 0-.5.15-.66.14-.14.32-.36.48-.54.16-.18.22-.32.32-.54.1-.22.05-.4-.03-.56-.08-.16-.74-1.78-1.01-2.44-.26-.62-.52-.54-.74-.55h-.63c-.2 0-.54.08-.82.4-.28.32-1.08 1.05-1.08 2.56 0 1.5 1.1 2.95 1.25 3.15.16.2 2.16 3.3 5.24 4.63.73.32 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.9-.78 2.17-1.54.27-.76.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38z"
          />
        </svg>
      </a>

      {lightboxItem && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setLightboxItem(null)}>
          <div className="modal__inner" onClick={(event) => event.stopPropagation()}>
            <button className="modal__close" type="button" onClick={() => setLightboxItem(null)} aria-label="Chiudi">
              &times;
            </button>
            <img src={withBase(`assets/img/${lightboxItem.image}`)} alt={lightboxItem.alt} />
            <p>{lightboxItem.caption}</p>
          </div>
        </div>
      )}

      {privacyOpen && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setPrivacyOpen(false)}>
          <div className="modal__inner modal__inner--privacy" onClick={(event) => event.stopPropagation()}>
            <button className="modal__close" type="button" onClick={() => setPrivacyOpen(false)} aria-label="Chiudi">
              &times;
            </button>
            <h3>Privacy Policy</h3>
            <p>
              Trasparenza totale: scopri come vengono raccolti, usati e protetti i dati personali quando invii una
              richiesta.
            </p>
            <div className="privacy-grid">
              {privacyCards.map((card) => (
                <article key={card.title}>
                  <h4>{card.title}</h4>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
            <p className="privacy-note">Ultimo aggiornamento: 1 giugno 2024.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
