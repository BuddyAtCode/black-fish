import { motion, useScroll } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { HeroLetterLine, ScrollColorText } from "../components/TextReveal";
import { artists, getArtist } from "../data/studio";

export default function ArtistProfile() {
  const introRevealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introRevealProgress } = useScroll({
    target: introRevealRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });
  const { artistSlug } = useParams();
  const artist = getArtist(artistSlug);

  if (!artist) return <Navigate to="/artists" replace />;

  const currentIndex = artists.findIndex((item) => item.slug === artist.slug);
  const nextArtist = artists[(currentIndex + 1) % artists.length];
  const artistStyle = { "--artist-accent": artist.accent } as CSSProperties;

  return (
    <main className="artist-page inner-page" style={artistStyle}>
      <section className="artist-profile-hero">
        <div className="artist-profile-media">
          <motion.img
            key={artist.slug}
            src={artist.image}
            alt={`Profil — ${artist.name}`}
            style={{ objectPosition: artist.imagePosition }}
            initial={{ scale: 1.12, filter: "grayscale(1) brightness(.5)" }}
            animate={{ scale: 1, filter: "grayscale(.18) brightness(.72)" }}
            transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="artist-profile-shade" />
        <div className="artist-profile-meta">
          <span>.INKSOUL. / TATÉR {artist.number}</span>
          <span>{artist.descriptor}</span>
        </div>
        <div className="artist-profile-name">
          <span>{artist.number}</span>
          <h1>
            <HeroLetterLine text={artist.name} />
          </h1>
          <p>{artist.statement}</p>
        </div>
      </section>

      <section className="artist-profile-intro">
        <div className="artist-profile-reveal-track" ref={introRevealRef}>
          <div className="artist-profile-reveal-sticky">
            <div className="section-kicker">
              <span>{artist.number}</span>
              <span>Rukopis</span>
            </div>
            <ScrollColorText
              text={artist.intro}
              progress={introRevealProgress}
            />
          </div>
        </div>
        <div className="artist-profile-body">
          <div className="artist-profile-columns">
            <p>{artist.paragraphs[0]}</p>
            <p>{artist.paragraphs[1]}</p>
          </div>
          <div className="artist-profile-details">
            {artist.details.map((detail) => <span key={detail}>{detail}</span>)}
          </div>
        </div>
      </section>

      <section className="artist-profile-gallery" aria-label={`Práce — ${artist.name}`}>
        {artist.gallery.map((work, index) => (
          <motion.figure
            key={`${artist.slug}-${work.src}-${index}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.75, delay: index * 0.08 }}
          >
            <img
              src={work.src}
              alt={`Práca ${index + 1} — ${artist.name}`}
              style={{ objectPosition: work.position }}
            />
            <figcaption>
              <span>0{index + 1}</span>
              <span>{artist.name} / .INKSOUL.</span>
            </figcaption>
          </motion.figure>
        ))}
      </section>

      <section className="artist-profile-cta">
        <div>
          <span>Konzultácia / návrh / termín</span>
          <h2>MÁŠ NÁPAD?</h2>
        </div>
        <Link className="magnetic-link magnetic-link--light" to={`/booking?artist=${artist.slug}`}>
          <span>Vybrať termín</span>
          <i className="thorn-arrow" aria-hidden="true" />
        </Link>
        <Link className="next-artist-link" to={`/artists/${nextArtist.slug}`}>
          Ďalší profil / {nextArtist.name}
        </Link>
      </section>
    </main>
  );
}
