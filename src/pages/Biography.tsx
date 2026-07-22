import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import profilePhotoImage from "../assets/Images/Profile_photo.png";
import storeImage from "../assets/Images/Store_image.png";

const process = [
  {
    number: "01",
    title: "Obraz",
    text: "Prinesieš fotku, sen, vetu alebo len zvláštny pocit. Spoločne nájdeme jadro motívu.",
  },
  {
    number: "02",
    title: "Kresba",
    text: "Dadla pripraví autorskú kompozíciu pre konkrétne miesto a pohyb tvojho tela.",
  },
  {
    number: "03",
    title: "Rituál",
    text: "V štúdiu doladíme mierku a detail. Potom obraz pomaly prejde pod kožu.",
  },
  {
    number: "04",
    title: "Život",
    text: "Dostaneš jasné pokyny k hojeniu. Dielo sa ďalej mení spolu s tebou.",
  },
];

export default function Biography() {
  const imageSection = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageSection,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-60, 90]);

  return (
    <main className="biography-page inner-page">
      <section className="bio-hero">
        <div className="bio-hero-image">
          <motion.img
            src={profilePhotoImage}
            alt="DADLA TATS — tatérka a zakladateľka BLACK FISH"
            initial={{ scale: 1.15, filter: "grayscale(1) brightness(.45)" }}
            animate={{ scale: 1, filter: "grayscale(1) brightness(.72)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="bio-hero-type" aria-label="DADLA TATS">
          <span>DADLA</span>
          <span>TATS</span>
        </div>
        <div className="bio-hero-intro">
          <span>Artist / Founder / Image maker</span>
          <p>
            Tetujem obrazy pre ľudí, ktorí si nechcú vybrať z katalógu.
          </p>
        </div>
      </section>

      <section className="bio-manifesto">
        <div className="section-kicker">
          <span>01</span>
          <span>O Dadle</span>
        </div>
        <div>
          <h2>NAJPRV KRESBA.<br />POTOM KOŽA.</h2>
          <p className="bio-lead">
            DADLA TATS pracuje s figurálnymi obrazmi, prírodnými detailmi a surrealistickými
            kompozíciami. Každý motív vzniká ako odpoveď na konkrétne telo a príbeh.
          </p>
          <div className="bio-columns">
            <p>
              BLACK FISH je malé autorské štúdio postavené na pokoji, presnosti a dôvere.
              Žiadny tlak na rýchle rozhodnutie. Žiadna výrobná linka. Pred prvou čiarou musí
              obraz dávať zmysel obom stranám.
            </p>
            <p>
              Výsledkom nie je len tetovanie, ale vizuálny artefakt — trochu temný, trochu
              nežný a dostatočne zvláštny na to, aby zostal osobný.
            </p>
          </div>
        </div>
      </section>

      <section className="bio-studio-image" ref={imageSection}>
        <motion.img
          src={storeImage}
          alt="Atmosféra štúdia BLACK FISH"
          style={{ y: imageY }}
        />
        <div className="bio-studio-caption">
          <span>BLACK FISH STUDIO</span>
          <span>Safe space / sharp work</span>
        </div>
      </section>

      <section className="process-section">
        <div className="section-heading section-heading--compact">
          <div className="section-kicker">
            <span>02</span>
            <span>Proces</span>
          </div>
          <h2>OD SPRÁVY<br />K OBRAZU.</h2>
        </div>
        <div className="process-list">
          {process.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
            >
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bio-cta">
        <span>Niečo ti chodí po rozume?</span>
        <h2>UKÁŽ MI TO.</h2>
        <Link className="magnetic-link magnetic-link--light" to="/booking">
          <span>Naplánovať konzultáciu</span>
          <b>↗</b>
        </Link>
      </section>
    </main>
  );
}
