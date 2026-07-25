import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { artists } from "../data/studio";

export default function Artists() {
  return (
    <main className="artists-page inner-page">
      <section className="artists-hero">
        <div className="page-gothic-wordmark page-gothic-wordmark--artists" aria-hidden="true">
          Tatéri
        </div>
        <div className="inner-hero-meta">
          <span>.INKSOUL. / TETOVACIE ŠTÚDIO</span>
          <span>01—03 / TATÉRI</span>
        </div>
        <h1>
          <span>TRI RUKOPISY.</span>
          <span>JEDNO ŠTÚDIO.</span>
        </h1>
        <p>
          Dadla, Duky a Walla tvoria pod jednou strechou. Každý prináša vlastnú kresbu,
          tempo aj spôsob práce.
        </p>
      </section>

      <section className="artist-index">
        {artists.map((artist, index) => (
          <motion.article
            className="artist-index-card"
            key={artist.slug}
            style={{ "--artist-accent": artist.accent } as CSSProperties}
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.08 }}
          >
            <div className="artist-index-media">
              <img
                src={artist.image}
                alt={`Výber práce — ${artist.name}`}
                style={{ objectPosition: artist.imagePosition }}
              />
              <span>{artist.number}</span>
            </div>
            <div className="artist-index-copy">
              <span>{artist.descriptor}</span>
              <h2>{artist.name}</h2>
              <p>{artist.statement}</p>
              <Link to={`/artists/${artist.slug}`}>
                Profil a práce
                <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="studio-editorial">
        <div className="studio-editorial-media">
          <img src="/images/generated/studio-interior.webp" alt="Interiér štúdia .INKSOUL." />
        </div>
        <div className="studio-editorial-copy">
          <span>Priestor / konzultácia / tetovanie</span>
          <h2>PRIESTOR PRE DOBRÉ TETOVANIE.</h2>
          <p>
            V štúdiu je čas na rozhovor, skúšanie mierky aj pokojné rozhodnutie.
            Tatéra si môžeš vybrať podľa rukopisu alebo nám nechaj nápad a poradíme ti.
          </p>
          <Link className="magnetic-link magnetic-link--light" to="/booking">
            <span>Vybrať tatéra</span>
            <i className="thorn-arrow" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
