import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import useDialog from "../components/useDialog";
import { Link } from "react-router-dom";
import { HeroLetterLine } from "../components/TextReveal";
import { artists, studioWorks } from "../data/studio";
import type { ArtistSlug, StudioWork } from "../data/studio";

type Filter = "all" | ArtistSlug;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Všetko" },
  ...artists.map((artist) => ({ value: artist.slug, label: artist.name })),
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selectedWork, setSelectedWork] = useState<StudioWork | null>(null);
  const dialogRef = useDialog(Boolean(selectedWork), () => setSelectedWork(null));
  const visibleWorks =
    activeFilter === "all"
      ? studioWorks
      : studioWorks.filter((work) => work.artist === activeFilter);

  return (
    <main className="portfolio-page inner-page">
      <section className="inner-hero portfolio-hero">
        <div
          className="page-gothic-wordmark page-gothic-wordmark--portfolio"
          aria-hidden="true"
        >
          Archív
        </div>
        <div className="inner-hero-meta">
          <span>.INKSOUL. / PORTFÓLIO</span>
          <span>001—009 / DADLA · DUKY · WALLA</span>
        </div>
        <h1>
          <HeroLetterLine text="VYBRANÉ" />
          <HeroLetterLine text="TETOVANIA." delay={0.1} />
        </h1>
        <p>
          Práce troch tatérov pod jednou strechou. Filter ti ukáže rukopis každého z nich.
        </p>
        <div className="portfolio-hero-mark" aria-hidden="true">✣</div>
      </section>

      <section className="portfolio-content">
        <div className="portfolio-filters" aria-label="Filtrovať portfólio podľa tatéra">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              className={activeFilter === filter.value ? "is-active" : ""}
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div className="portfolio-masonry" layout>
          <AnimatePresence mode="popLayout">
            {visibleWorks.map((work, index) => {
              const artist = artists.find((item) => item.slug === work.artist);
              return (
                <motion.figure
                  layout
                  className={`portfolio-item ${work.size}`}
                  key={work.number}
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.65, delay: Math.min(index * 0.05, 0.25) }}
                >
                  <button className="portfolio-work-open" type="button" onClick={() => setSelectedWork(work)} aria-label={`Zväčšiť: ${work.title}`}>
                    <div className="portfolio-item-image">
                      <img
                        src={work.src}
                        alt={work.title}
                        loading={index > 2 ? "lazy" : "eager"}
                        style={{ objectPosition: work.position }}
                      />
                      <span>{work.number}</span>
                      <b aria-hidden="true">
                        ZVÄČŠIŤ
                        <i className="thorn-arrow thorn-arrow--inline" />
                      </b>
                    </div>
                  </button>
                    <figcaption>
                      <strong>{work.title}</strong>
                      <Link to={`/artists/${work.artist}`}>Profil — {artist?.name}</Link>
                    </figcaption>
                </motion.figure>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="portfolio-cta">
        <p>Vieš, ktorý rukopis ti sedí?</p>
        <h2>VYBER SI<br />TATÉRA.</h2>
        <Link className="magnetic-link magnetic-link--light" to="/artists">
          <span>Profily tatérov</span>
          <i className="thorn-arrow" aria-hidden="true" />
        </Link>
      </section>
      {createPortal(<AnimatePresence>
        {selectedWork && (
          <motion.div className="portfolio-lightbox" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="work-title" tabIndex={-1} data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" onClick={() => setSelectedWork(null)}>Zavrieť ×</button>
            <img src={selectedWork.src} alt={selectedWork.title} />
            <div>
              <h2 id="work-title">{selectedWork.title}</h2>
              <Link to={`/artists/${selectedWork.artist}`}>Profil — {artists.find((artist) => artist.slug === selectedWork.artist)?.name}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </main>
  );
}
