import {
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const BlackFishArtifactScene = lazy(
  () => import("../components/BlackFishArtifactScene"),
);

const featuredWorks = [
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Záhrada, ktorá vidí",
    meta: "Ilustrácia · predlaktie",
    className: "work-card work-card--wide",
  },
  {
    src: "/images/generated/tattoo-botanical-eye.webp",
    title: "Pamäť pod kožou",
    meta: "Blackwork · chrbát",
    className: "work-card work-card--portrait",
  },
  {
    src: "/images/generated/tattoo-abstract-forearm.webp",
    title: "Nočná anatómia",
    meta: "Abstrakcia · predlaktie",
    className: "work-card work-card--small",
  },
];

function RevealWord({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const y = useTransform(progress, range, [12, 0]);

  return (
    <motion.span style={{ opacity, y }}>
      {children}{" "}
    </motion.span>
  );
}

function ScrollStatement() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.78", "end 0.38"],
  });
  const words =
    "Spomienky, obrazy a zvláštne nápady premieňame na tetovania kreslené pre konkrétne telo.".split(
      " ",
    );

  return (
    <section className="statement-section" ref={target}>
      <div className="section-kicker">
        <span>01</span>
        <span>Manifest</span>
      </div>
      <p className="scroll-statement">
        {words.map((word, index) => {
          const start = index / words.length;
          const end = Math.min(start + 0.16, 1);
          return (
            <RevealWord key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </RevealWord>
          );
        })}
      </p>
      <div className="statement-footnote">
        BLACK FISH / DADLA TATS / AUTORSKÉ OBRAZOVÉ TETOVANIA
      </div>
    </section>
  );
}

function Hero() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const opacity = useTransform(scrollYProgress, [0.45, 1], [1, 0]);

  return (
    <section className="hero" ref={target}>
      <motion.div className="hero-media" style={{ scale, y: imageY }}>
        <img src="/images/generated/tattoo-session.jpg" alt="DADLA TATS pri tetovaní" />
      </motion.div>
      <div className="hero-shade" />

      <motion.div
        className="hero-gothic-logo"
        style={{ y: markY, opacity }}
        aria-label="Black Fish"
      >
        <div className="brand-lockup brand-lockup--hero">
          <span>Black</span>
          <span>Fish</span>
        </div>
      </motion.div>

      <div className="hero-topline">
        <span>DADLA TATS</span>
        <span>Obrazy prenesené na kožu</span>
      </div>

      <div className="hero-bottomline">
        <p>
          Dadla navrhuje autorské tetovania
          <br /> podľa tvojho príbehu a tvaru tela.
        </p>
        <Link className="magnetic-link" to="/booking">
          <span>Rezervovať konzultáciu</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll to enter</span>
        <i />
      </div>
    </section>
  );
}

function ExpandingMedia() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0.05, 0.45], [0.58, 1]);
  const radius = useTransform(scrollYProgress, [0.05, 0.45], [44, 0]);
  const copyY = useTransform(scrollYProgress, [0.2, 0.62], [90, -90]);

  return (
    <section className="expanding-section" ref={target}>
      <div className="expanding-sticky">
        <motion.div className="expanding-media" style={{ scale, borderRadius: radius }}>
          <img
            src="/images/generated/studio-interior.webp"
            alt="Interiér štúdia BLACK FISH"
          />
          <div className="expanding-media-overlay" />
          <motion.div className="expanding-copy" style={{ y: copyY }}>
            <small>Ručne kreslené · osobne navrhnuté</small>
            <strong>
              TVOJ NÁPAD.
              <br /> JEJ RUKOPIS.
            </strong>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ArtifactCanvas({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="artifact-canvas-shell" ref={host}>
      {ready ? (
        <Suspense fallback={<div className="artifact-scene-loader">MATERIALIZING / 02</div>}>
          <BlackFishArtifactScene progress={progress} />
        </Suspense>
      ) : (
        <div className="artifact-scene-loader">MATERIALIZING / 02</div>
      )}
    </div>
  );
}

function RelicSection() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 1], [0, 1, 1, 0]);
  const annotationOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.28, 0.72, 0.9],
    [0, 1, 1, 0],
  );
  const copyOpacity = useTransform(scrollYProgress, [0.46, 0.62, 0.94], [0, 1, 1]);

  return (
    <section className="relic-section" ref={target}>
      <div className="relic-sticky">
        <div className="relic-grid" aria-hidden="true" />

        <div className="relic-meta">
          <span>02 / BLACK FISH RELIC</span>
          <span>SCANNED FORM / WEBGL</span>
        </div>

        <motion.h2 className="relic-heading" style={{ y: headingY, opacity: headingOpacity }}>
          <span>ANATÓMIA</span>
          <span>INŠTINKTU.</span>
        </motion.h2>

        <motion.div
          className="relic-annotation relic-annotation--skull"
          style={{ opacity: annotationOpacity }}
        >
          <i />
          <span>01 / RELIC</span>
        </motion.div>
        <motion.div
          className="relic-annotation relic-annotation--needle"
          style={{ opacity: annotationOpacity }}
        >
          <i />
          <span>02 / IHLA</span>
        </motion.div>

        <motion.div className="relic-description" style={{ opacity: copyOpacity }}>
          <p>
            Dadla začína každý motív kresbou. Pri návrhu pracuje s tvarom tela, tvojím
            príbehom a tým, ako bude tetovanie pôsobiť v pohybe.
          </p>
          <Link to="/biography">Spoznaj Dadlu ↗</Link>
        </motion.div>

        <div className="relic-instruction">
          <span>SCROLL / ROTÁCIA</span>
          <span>KURZOR / POHĽAD</span>
        </div>

        <div className="relic-progress" aria-hidden="true">
          <motion.i style={{ scaleY: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

function ArtifactJourney() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  return (
    <div className="artifact-journey" ref={target}>
      <div className="artifact-stage">
        <ArtifactCanvas progress={scrollYProgress} />
        <div className="artifact-stage-vignette" />
      </div>
      <RelicSection />
      <PortfolioPreview />
      <ArtistPreview />
    </div>
  );
}

function PortfolioPreview() {
  return (
    <section className="portfolio-preview">
      <motion.div
        className="gothic-wordmark gothic-wordmark--portfolio"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.18 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2 }}
      >
        Portfolio
      </motion.div>
      <div className="section-heading">
        <div className="section-kicker">
          <span>03</span>
          <span>Vybrané práce</span>
        </div>
        <h2>
          KOŽA JE
          <br /> GALÉRIA.
        </h2>
        <Link to="/portfolio">Pozrieť celé portfólio ↗</Link>
      </div>

      <div className="work-grid">
        {featuredWorks.map((work, index) => (
          <motion.figure
            className={work.className}
            key={work.title}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.85, delay: index * 0.08 }}
          >
            <div className="work-image">
              <img src={work.src} alt={work.title} />
              <span aria-hidden="true">0{index + 1}</span>
            </div>
            <figcaption>
              <strong>{work.title}</strong>
              <small>{work.meta}</small>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function ArtistPreview() {
  return (
    <section className="artist-preview">
      <motion.div
        className="gothic-wordmark gothic-wordmark--biography"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2 }}
      >
        Biography
      </motion.div>
      <div className="artist-image-wrap">
        <motion.img
          src="/images/generated/dadla-portrait.webp"
          alt="Atmosférický portrét tatérky v štúdiu BLACK FISH"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="artist-image-label">Artist / Founder</div>
      </div>
      <div className="artist-copy">
        <span className="eyebrow">Dadla Tats</span>
        <h2>
          OBRAZ, KTORÝ
          <br /> SADNE TVOJMU
          <br /> TELU.
        </h2>
        <p>
          Dadla pracuje s obrazmi, symbolmi a útržkami spomienok. Na konzultácii spolu
          prejdete motív, miesto aj mierku. Potom nakreslí kompozíciu priamo pre tvoje telo.
        </p>
        <Link className="text-link" to="/biography">Celý príbeh ↗</Link>
      </div>
    </section>
  );
}

function ShopPreview() {
  return (
    <section className="shop-preview">
      <motion.div
        className="gothic-wordmark gothic-wordmark--store"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2 }}
      >
        Store
      </motion.div>
      <div className="shop-copy">
        <div className="section-kicker">
          <span>04</span>
          <span>Objects</span>
        </div>
        <h2>PIERCING<br />AFTER DARK.</h2>
        <p>
          Vybrané kúsky z titánu a chirurgickej ocele. Malé objekty s ostrým charakterom.
        </p>
        <Link className="magnetic-link magnetic-link--light" to="/eshop">
          <span>Vstúpiť do shopu</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </div>
      <div className="shop-image">
        <img src="/images/generated/piercing-collection.jpg" alt="Kolekcia piercingov BLACK FISH" />
        <div className="shop-stamp">DROP / 001</div>
      </div>
    </section>
  );
}

function BookingPreview() {
  const slots = [
    { day: "12", month: "AUG", time: "14:30" },
    { day: "16", month: "AUG", time: "10:00" },
    { day: "22", month: "AUG", time: "16:00" },
  ];

  return (
    <section className="booking-preview">
      <div className="booking-title">
        <span>05 / Open chair</span>
        <h2>MÁŠ OBRAZ<br />V HLAVE?</h2>
        <p>Pošli ho ďalej. Prvý kontakt zatiaľ riešime cez Instagram DM.</p>
      </div>
      <div className="slot-list">
        {slots.map((slot) => (
          <div className="slot" key={`${slot.day}-${slot.time}`}>
            <span className="slot-status"><i /> voľné</span>
            <strong>{slot.day}</strong>
            <span>{slot.month}</span>
            <b>{slot.time}</b>
          </div>
        ))}
        <Link className="slot-cta" to="/booking">
          <span>Otvoriť kalendár</span>
          <b>↗</b>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-marquee" aria-hidden="true">
        <span>BLACK FISH · SKIN AS CANVAS · DADLA TATS · </span>
        <span>BLACK FISH · SKIN AS CANVAS · DADLA TATS · </span>
      </div>
      <div className="footer-inner">
        <div className="footer-brand" aria-label="BLACK FISH">
          <span>Black</span>
          <span>Fish</span>
        </div>
        <div className="footer-links">
          <Link to="/portfolio">Portfólio</Link>
          <Link to="/biography">DADLA TATS</Link>
          <Link to="/eshop">Shop</Link>
          <Link to="/booking">Rezervácia</Link>
        </div>
        <div className="footer-contact">
          <span>Instagram príde čoskoro</span>
          <span>Slovensko</span>
          <span>© {new Date().getFullYear()} BLACK FISH</span>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <main className="landing-page">
      <Hero />
      <ScrollStatement />
      <ExpandingMedia />
      <ArtifactJourney />
      <ShopPreview />
      <BookingPreview />
      <Footer />
    </main>
  );
}
