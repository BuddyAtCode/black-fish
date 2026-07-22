import {
  AnimatePresence,
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import headerImage from "../assets/Images/BlackFish_header.svg";
import profilePhotoImage from "../assets/Images/Profile_photo.png";
import tatooGuyImage from "../assets/Images/Tatoo_guy.png";

const FishRelicScene = lazy(() => import("../components/FishRelicScene"));

const featuredWorks = [
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Záhrada, ktorá vidí",
    meta: "Ilustrácia · predlaktie",
    className: "work-card work-card--wide",
  },
  {
    src: tatooGuyImage,
    title: "Pamäť pod kožou",
    meta: "Obrazové tetovanie · rameno",
    className: "work-card work-card--portrait",
  },
  {
    src: profilePhotoImage,
    title: "Nočná anatómia",
    meta: "Autorský motív · detail",
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
    "Netetujeme dekoráciu. Premieňame spomienky, obrazy a zvláštne nápady na diela, ktoré žijú spolu s telom.".split(
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

function Intro() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("blackfish-intro"));

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => {
      sessionStorage.setItem("blackfish-intro", "seen");
      setVisible(false);
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-screen"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={headerImage}
            alt=""
            initial={{ opacity: 0, scale: 0.82, filter: "blur(18px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="intro-progress">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
          <div className="intro-meta">
            <span>Ink / Image / Ritual</span>
            <span>Loading experience</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const opacity = useTransform(scrollYProgress, [0.45, 1], [1, 0]);

  return (
    <section className="hero" ref={target}>
      <motion.div className="hero-media" style={{ scale, y: imageY }}>
        <img src="/images/generated/tattoo-session.jpg" alt="DADLA TATS pri tetovaní" />
      </motion.div>
      <div className="hero-shade" />

      <motion.div className="hero-title" style={{ y: titleY, opacity }} aria-label="Black Fish">
        <span>BLACK</span>
        <span>FISH</span>
      </motion.div>

      <div className="hero-topline">
        <span>DADLA TATS</span>
        <span>Obrazy prenesené na kožu</span>
      </div>

      <div className="hero-bottomline">
        <p>
          Autorské tetovacie štúdio pre ľudí,
          <br /> ktorí nechcú vyzerať ako všetci ostatní.
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
          <img src={tatooGuyImage} alt="Proces tetovania v štúdiu BLACK FISH" />
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

function RelicCanvas({ progress }: { progress: MotionValue<number> }) {
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
    <div className="relic-canvas-shell" ref={host}>
      {ready ? (
        <Suspense fallback={<div className="relic-scene-loader">MATERIALIZING / 02</div>}>
          <FishRelicScene progress={progress} />
        </Suspense>
      ) : (
        <div className="relic-scene-loader">MATERIALIZING / 02</div>
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
          <span>02 / BLACK FISH TOTEM</span>
          <span>PROCEDURAL WEBGL OBJECT</span>
        </div>

        <motion.h2 className="relic-heading" style={{ y: headingY, opacity: headingOpacity }}>
          <span>ANATÓMIA</span>
          <span>INŠTINKTU.</span>
        </motion.h2>

        <RelicCanvas progress={scrollYProgress} />

        <motion.div
          className="relic-annotation relic-annotation--skeleton"
          style={{ opacity: annotationOpacity }}
        >
          <i />
          <span>01 / KOSTRA</span>
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
            Každý návrh kreslí Dadla od nuly. Smer určuje telo, príbeh a napätie medzi
            čiernou plochou a prázdnym miestom.
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

function PortfolioPreview() {
  return (
    <section className="portfolio-preview">
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
      <div className="artist-image-wrap">
        <motion.img
          src={profilePhotoImage}
          alt="DADLA TATS"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="artist-image-label">Artist / Founder</div>
      </div>
      <div className="artist-copy">
        <span className="eyebrow">DADLA TATS</span>
        <h2>
          KRESLÍM TO,
          <br /> ČO NEVIEŠ
          <br /> POVEDAŤ.
        </h2>
        <p>
          Dadla premieňa obrazy, symboly a útržky spomienok na osobné kompozície.
          Výsledok nevzniká výberom zo šablóny, ale rozhovorom a kresbou pre konkrétne telo.
        </p>
        <Link className="text-link" to="/biography">Celý príbeh ↗</Link>
      </div>
    </section>
  );
}

function ShopPreview() {
  return (
    <section className="shop-preview">
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
        <div>
          <img src={headerImage} alt="BLACK FISH" />
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
      <Intro />
      <Hero />
      <ScrollStatement />
      <ExpandingMedia />
      <RelicSection />
      <PortfolioPreview />
      <ArtistPreview />
      <ShopPreview />
      <BookingPreview />
      <Footer />
    </main>
  );
}
