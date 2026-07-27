import {
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { artists, studioWorks } from "../data/studio";

const InksoulArtifactScene = lazy(
  () => import("../components/InksoulArtifactScene"),
);

const featuredWorks = studioWorks.slice(0, 3);

const shopPreviewProducts = [
  {
    name: "Nocturne Ring",
    price: "42 €",
    image: "/images/generated/piercing-nocturne-ring.webp",
    material: "Black titanium",
  },
  {
    name: "Blood Moon",
    price: "58 €",
    image: "/images/generated/piercing-blood-moon.webp",
    material: "Red zircon / steel",
  },
  {
    name: "Twin Thorn",
    price: "36 €",
    image: "/images/generated/piercing-twin-thorn.webp",
    material: "Surgical steel",
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

  return <motion.span style={{ opacity, y }}>{children} </motion.span>;
}

function ScrollStatement() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.78", "end 0.38"],
  });
  const words =
    "Kresba, kontrast, jemný detail a sýty akcent sa stretávajú v návrhoch vytvorených pre konkrétne telo.".split(
      " ",
    );
  const revealScale = 0.74;

  return (
    <section className="statement-section" ref={target}>
      <div className="section-kicker">
        <span>01</span>
        <span>Štúdio</span>
      </div>
      <p className="scroll-statement">
        {words.map((word, index) => {
          const start = (index / words.length) * revealScale;
          const end = Math.min(
            (index / words.length + 0.16) * revealScale,
            revealScale,
          );
          return (
            <RevealWord key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </RevealWord>
          );
        })}
      </p>
      <div className="statement-footnote">
        .INKSOUL. / DADLA / DUKY / WALLA / AUTORSKÉ TETOVANIE
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
        <img src="/images/generated/tattoo-session.jpg" alt="Tetovanie v štúdiu .INKSOUL." />
      </motion.div>
      <div className="hero-shade" />
      <div className="hero-color-wash" aria-hidden="true" />

      <motion.div className="hero-gothic-logo" style={{ y: markY, opacity }}>
        <BrandMark className="brand-mark--hero" />
      </motion.div>

      <div className="hero-topline">
        <span>DADLA · DUKY · WALLA</span>
        <span>TETOVACIE ŠTÚDIO / .INKSOUL.</span>
      </div>

      <div className="hero-bottomline">
        <p>
          Tri tatérske rukopisy v jednom štúdiu.
          <br /> Vyber si autora alebo nám nechaj svoj nápad.
        </p>
        <Link className="magnetic-link" to="/booking">
          <span>Rezervovať konzultáciu</span>
          <i className="thorn-arrow" aria-hidden="true" />
        </Link>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Vstúpiť</span>
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
          <img src="/images/generated/studio-interior.webp" alt="Interiér štúdia .INKSOUL." />
          <div className="expanding-media-overlay" />
          <motion.div className="expanding-copy" style={{ y: copyY }}>
            <small>Tri rukopisy · jeden priestor</small>
            <strong>
              TVOJ NÁPAD.
              <br /> NAŠA KRESBA.
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
      { rootMargin: "0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="artifact-canvas-shell" ref={host}>
      {ready ? (
        <Suspense fallback={<div className="artifact-scene-loader">.INKSOUL.</div>}>
          <InksoulArtifactScene progress={progress} />
        </Suspense>
      ) : (
        <div className="artifact-scene-loader">.INKSOUL.</div>
      )}
    </div>
  );
}

function StudioSignature() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 1], [0, 1, 1, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.46, 0.62, 0.94], [0, 1, 1]);

  return (
    <section className="relic-section studio-signature" ref={target}>
      <div className="relic-sticky">
        <div className="relic-grid" aria-hidden="true" />

        <div className="relic-meta">
          <span>02 / .INKSOUL. STUDIO</span>
          <span>DADLA · DUKY · WALLA</span>
        </div>

        <motion.h2 className="relic-heading" style={{ y: headingY, opacity: headingOpacity }}>
          <span>TRI RUKOPISY.</span>
          <span>JEDEN PRIESTOR.</span>
        </motion.h2>

        <div className="studio-signature-names" aria-hidden="true">
          {artists.map((artist) => <span key={artist.slug}>{artist.name}</span>)}
        </div>

        <motion.div className="relic-description" style={{ opacity: copyOpacity }}>
          <p>
            Dadla, Duky a Walla prinášajú do štúdia vlastnú kresbu a spôsob práce.
            Spája ich dôraz na kompozíciu, čisté prevedenie a pokojný proces.
          </p>
          <Link to="/artists">
            Spoznať tatérov
            <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="relic-progress" aria-hidden="true">
          <motion.i style={{ scaleY: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

function ExperienceJourney() {
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
      <StudioSignature />
      <PortfolioPreview />
      <ArtistsPreview />
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
        whileInView={{ opacity: 0.16 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2 }}
      >
        Archív
      </motion.div>
      <div className="section-heading">
        <div className="section-kicker">
          <span>03</span>
          <span>Vybrané práce</span>
        </div>
        <h2>
          VYBRANÉ
          <br /> TETOVANIA.
        </h2>
        <Link to="/portfolio">
          Celé portfólio
          <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
        </Link>
      </div>

      <div className="work-grid">
        {featuredWorks.map((work, index) => {
          const artist = artists.find((item) => item.slug === work.artist);
          return (
            <motion.figure
              className={`work-card ${index === 0 ? "work-card--wide" : index === 1 ? "work-card--portrait" : "work-card--small"}`}
              key={work.number}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, delay: index * 0.08 }}
            >
              <div className="work-image">
                <img src={work.src} alt={work.title} style={{ objectPosition: work.position }} />
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <figcaption>
                <strong>{work.title}</strong>
                <small>{artist?.name} / .INKSOUL.</small>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}

function ArtistsPreview() {
  return (
    <section className="artists-preview">
      <div className="artists-preview-head">
        <div className="section-kicker">
          <span>04</span>
          <span>Tatéri</span>
        </div>
        <h2>MENÁ ZA<br />.INKSOUL.</h2>
        <p>
          Každý profil ukazuje vlastný rukopis, práce a samostatné voľné termíny.
        </p>
      </div>

      <div className="artists-preview-grid">
        {artists.map((artist, index) => (
          <motion.article
            key={artist.slug}
            style={{ "--artist-accent": artist.accent } as CSSProperties}
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.08 }}
          >
            <Link to={`/artists/${artist.slug}`}>
              <div className="artists-preview-media">
                <img
                  src={artist.image}
                  alt={`Profil — ${artist.name}`}
                  style={{ objectPosition: artist.imagePosition }}
                />
              </div>
              <div className="artists-preview-name">
                <span>{artist.number}</span>
                <h3>{artist.name}</h3>
                <i className="thorn-arrow" aria-hidden="true" />
              </div>
              <p>{artist.descriptor}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ShopPreview() {
  return (
    <section className="shop-preview">
      <div className="shop-preview-meta">
        <span>05 / PIERCING SHOP</span>
        <span>TITÁN / CHIRURGICKÁ OCEĽ</span>
      </div>

      <motion.h2
        className="shop-preview-title"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>DETAIL</span>
        <span>PRE TELO.</span>
      </motion.h2>

      <div className="shop-product-track">
        {shopPreviewProducts.map((product, index) => (
          <motion.article
            className="shop-product-card"
            key={product.name}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.8,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="shop-product-media">
              <img src={product.image} alt={product.name} />
              <span>0{index + 1} / LIMITOVANÝ KUS</span>
            </div>
            <div className="shop-product-info">
              <div>
                <strong>{product.name}</strong>
                <span>{product.material}</span>
              </div>
              <b>{product.price}</b>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="shop-preview-footer">
        <p>
          Piercingy z titánu a chirurgickej ocele. Veľkosť a vhodné umiestnenie
          spolu doladíme v štúdiu.
        </p>
        <Link className="shop-preview-cta" to="/eshop">
          <span>Otvoriť shop</span>
          <i className="thorn-arrow" aria-hidden="true" />
        </Link>
      </div>

      <div className="shop-preview-wordmark" aria-hidden="true">Piercing</div>
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
        <span>06 / Konzultácie</span>
        <h2>VYBER SI<br />TATÉRA.</h2>
        <p>
          Pozri si rukopisy, vyber voľný termín a opíš nám svoju predstavu.
        </p>
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
          <span>Vybrať termín</span>
          <i className="thorn-arrow" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-marquee" aria-hidden="true">
        <span>.INKSOUL. · DADLA · DUKY · WALLA · TETOVACIE ŠTÚDIO · </span>
        <span>.INKSOUL. · DADLA · DUKY · WALLA · TETOVACIE ŠTÚDIO · </span>
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <BrandMark className="brand-mark--footer" />
        </div>
        <div className="footer-links">
          <Link to="/portfolio">Portfólio</Link>
          <Link to="/artists">Tatéri</Link>
          <Link to="/eshop">Piercing shop</Link>
          <Link to="/booking">Rezervácia</Link>
        </div>
        <div className="footer-contact">
          <span>Instagram doplníme</span>
          <span>Adresa doplníme</span>
          <span>© {new Date().getFullYear()} .INKSOUL.</span>
          <a
            className="footer-credit"
            href="https://paulmacaronn.com/"
            target="_blank"
            rel="noreferrer"
          >
            Made by PAULMA CARONN
          </a>
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
      <ExperienceJourney />
      <ShopPreview />
      <BookingPreview />
      <Footer />
    </main>
  );
}
