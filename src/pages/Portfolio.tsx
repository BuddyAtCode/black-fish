import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import profilePhotoImage from "../assets/Images/Profile_photo.png";
import storeImage from "../assets/Images/Store_image.png";
import tatooGuyImage from "../assets/Images/Tatoo_guy.png";

type Category = "Všetko" | "Figurálne" | "Príroda" | "Surreal";

const works = [
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Záhrada, ktorá vidí",
    category: "Príroda" as Category,
    number: "001",
    size: "is-wide",
    position: "50% 54%",
  },
  {
    src: tatooGuyImage,
    title: "Tiché monštrum",
    category: "Surreal" as Category,
    number: "002",
    size: "is-tall",
    position: "50% 50%",
  },
  {
    src: profilePhotoImage,
    title: "Druhá tvár",
    category: "Figurálne" as Category,
    number: "003",
    size: "is-small",
    position: "72% 42%",
  },
  {
    src: storeImage,
    title: "Čierny kvet",
    category: "Príroda" as Category,
    number: "004",
    size: "is-medium",
    position: "38% 50%",
  },
  {
    src: storeImage,
    title: "Jazva ako ornament",
    category: "Surreal" as Category,
    number: "005",
    size: "is-tall",
    position: "50% 45%",
  },
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Oko v záhrade",
    category: "Figurálne" as Category,
    number: "006",
    size: "is-small",
    position: "25% 70%",
  },
  {
    src: tatooGuyImage,
    title: "Proces / 02:17",
    category: "Figurálne" as Category,
    number: "007",
    size: "is-wide",
    position: "80% 50%",
  },
  {
    src: profilePhotoImage,
    title: "Nočná anatómia",
    category: "Surreal" as Category,
    number: "008",
    size: "is-medium",
    position: "15% 50%",
  },
];

const filters: Category[] = ["Všetko", "Figurálne", "Príroda", "Surreal"];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Category>("Všetko");
  const visibleWorks =
    activeFilter === "Všetko"
      ? works
      : works.filter((work) => work.category === activeFilter);

  return (
    <main className="portfolio-page inner-page">
      <section className="inner-hero portfolio-hero">
        <div className="inner-hero-meta">
          <span>BLACK FISH ARCHIVE</span>
          <span>001—008 / DADLA TATS</span>
        </div>
        <h1>
          OBRAZY
          <br /> POD KOŽOU
        </h1>
        <p>
          Každé telo má inú kompozíciu. Každý obraz vzniká pre jedného človeka
          a existuje iba raz.
        </p>
        <div className="portfolio-hero-mark" aria-hidden="true">✣</div>
      </section>

      <section className="portfolio-content">
        <div className="portfolio-filters" aria-label="Filtrovať portfólio">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? "is-active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div className="portfolio-masonry" layout>
          {visibleWorks.map((work, index) => (
            <motion.figure
              layout
              className={`portfolio-item ${work.size}`}
              key={work.number}
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.65, delay: Math.min(index * 0.06, 0.3) }}
            >
              <div className="portfolio-item-image">
                <img
                  src={work.src}
                  alt={work.title}
                  loading={index > 2 ? "lazy" : "eager"}
                  style={{ objectPosition: work.position }}
                />
                <span>{work.number}</span>
                <b aria-hidden="true">VIEW ↗</b>
              </div>
              <figcaption>
                <strong>{work.title}</strong>
                <span>{work.category} / autorský návrh</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      <section className="portfolio-cta">
        <p>Máš v hlave obraz, ktorý tu ešte nie je?</p>
        <h2>VYTVORME<br />ĎALŠÍ.</h2>
        <Link className="magnetic-link magnetic-link--light" to="/booking">
          <span>Začať konzultáciu</span>
          <b>↗</b>
        </Link>
      </section>
    </main>
  );
}
