import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HeroLetterLine } from "../components/TextReveal";
import { artists, getArtist } from "../data/studio";
import type { ArtistSlug } from "../data/studio";

type Slot = {
  id: string;
  day: string;
  date: string;
  month: string;
  times: string[];
};

const artistOffsets: Record<ArtistSlug, number[]> = {
  dadla: [3, 7, 11, 15, 20],
  duky: [4, 8, 12, 16, 22],
  walla: [5, 9, 14, 18, 24],
};

function createSlots(artist: ArtistSlug): Slot[] {
  return artistOffsets[artist].map((offset, index) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
      id: date.toISOString().slice(0, 10),
      day: new Intl.DateTimeFormat("sk-SK", { weekday: "short" }).format(date),
      date: String(date.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("sk-SK", { month: "short" }).format(date),
      times: index % 2 ? ["10:00", "14:30"] : ["11:30", "16:00"],
    };
  });
}

export default function Booking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialArtist = getArtist(searchParams.get("artist") ?? "")?.slug ?? artists[0].slug;
  const [selectedArtist, setSelectedArtist] = useState<ArtistSlug>(initialArtist);
  const slots = useMemo(() => createSlots(selectedArtist), [selectedArtist]);
  const [selectedDay, setSelectedDay] = useState(slots[0].id);
  const [selectedTime, setSelectedTime] = useState(slots[0].times[0]);
  const [submitted, setSubmitted] = useState(false);
  const activeArtist = getArtist(selectedArtist) ?? artists[0];
  const activeDay = slots.find((slot) => slot.id === selectedDay) ?? slots[0];

  useEffect(() => {
    setSelectedDay(slots[0].id);
    setSelectedTime(slots[0].times[0]);
  }, [slots]);

  const selectArtist = (artist: ArtistSlug) => {
    setSelectedArtist(artist);
    setSearchParams({ artist }, { replace: true });
  };

  const selectDay = (slot: Slot) => {
    setSelectedDay(slot.id);
    setSelectedTime(slot.times[0]);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="booking-page inner-page">
      <section className="booking-hero">
        <div className="inner-hero-meta">
          <span>.INKSOUL. / REZERVÁCIA</span>
          <span>VYBER TATÉRA A TERMÍN</span>
        </div>
        <h1>
          <HeroLetterLine text="S KÝM CHCEŠ" />
          <HeroLetterLine text="TVORIŤ?" delay={0.1} />
        </h1>
        <p>
          Pozri si rukopisy, vyber orientačný termín konzultácie a napíš nám,
          čo by si chcel alebo chcela tetovať.
        </p>
      </section>

      <section className="artist-selector" aria-label="Vybrať tatéra">
        <div className="artist-selector-heading">
          <span>01 / Tatér</span>
          <p>Výber môžeš neskôr zmeniť.</p>
        </div>
        <div className="artist-selector-grid">
          {artists.map((artist) => (
            <button
              type="button"
              key={artist.slug}
              className={selectedArtist === artist.slug ? "is-selected" : ""}
              onClick={() => selectArtist(artist.slug)}
              style={{ "--artist-accent": artist.accent } as CSSProperties}
              aria-pressed={selectedArtist === artist.slug}
            >
              <span>{artist.number}</span>
              <strong>{artist.name}</strong>
              <small>{artist.descriptor}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section
        className="booking-system"
        style={{ "--artist-accent": activeArtist.accent } as CSSProperties}
      >
        <div className="calendar-panel">
          <div className="calendar-heading">
            <span>02 / {activeArtist.name} / voľné konzultácie</span>
            <span><i /> Dostupné termíny</span>
          </div>
          <div className="calendar-days">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.id}
                className={selectedDay === slot.id ? "is-selected" : ""}
                onClick={() => selectDay(slot)}
              >
                <small>{slot.day}</small>
                <strong>{slot.date}</strong>
                <span>{slot.month}</span>
              </button>
            ))}
          </div>
          <div className="calendar-times" aria-label="Dostupné časy">
            {activeDay.times.map((time) => (
              <button
                type="button"
                key={time}
                className={selectedTime === time ? "is-selected" : ""}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="calendar-note">
            <span>Vybraný termín</span>
            <strong>{activeDay.date}. {activeDay.month} / {selectedTime}</strong>
          </div>
          <Link className="calendar-artist-link" to={`/artists/${activeArtist.slug}`}>
            Pozrieť profil {activeArtist.name}
            <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
          </Link>
        </div>

        <form className="booking-form" onSubmit={submit}>
          <label>
            <span>03 / Ako sa voláš?</span>
            <input name="name" required placeholder="Meno a priezvisko" />
          </label>
          <label>
            <span>04 / Kde ťa nájdeme?</span>
            <input name="contact" required placeholder="Instagram alebo e-mail" />
          </label>
          <label>
            <span>05 / Čo chceš tetovať?</span>
            <textarea
              name="idea"
              required
              rows={4}
              placeholder="Motív, nálada, referencia, miesto na tele..."
            />
          </label>
          <div className="booking-form-row">
            <label>
              <span>06 / Umiestnenie</span>
              <input name="placement" placeholder="Napríklad predlaktie" />
            </label>
            <label>
              <span>07 / Veľkosť</span>
              <input name="size" placeholder="Napríklad 15 cm" />
            </label>
          </div>
          <button className="booking-submit" type="submit">
            <span>Dokončiť výber</span>
            <i className="thorn-arrow" aria-hidden="true" />
          </button>
          <small className="form-disclaimer">
            Odoslanie zatiaľ neprepája údaje mimo tejto stránky. Potvrdenie termínu
            dokončíme cez Instagram vybraného tatéra.
          </small>
        </form>
      </section>

      <section className="booking-faq">
        <span>Pred konzultáciou</span>
        <div>
          <h2>PRINES NÁPAD.<br />DOLADÍME HO SPOLU.</h2>
          <p>
            Pošli referencie, ktoré vystihujú motív, kompozíciu alebo detail.
            Tatér pripraví vlastný návrh a prispôsobí ho vybranému miestu.
          </p>
          <Link to="/portfolio">
            Pozrieť práce štúdia
            <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {submitted && (
          <motion.div
            className="booking-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 28 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{ "--artist-accent": activeArtist.accent } as CSSProperties}
            >
              <span>.INKSOUL. / {activeArtist.name}</span>
              <h2 id="success-title">TERMÍN MÁŠ<br />VYBRANÝ.</h2>
              <p>
                {activeDay.date}. {activeDay.month} o {selectedTime}. Pre potvrdenie
                napíš {activeArtist.name} cez Instagram. Konkrétny kontakt doplníme.
              </p>
              <button type="button" onClick={() => setSubmitted(false)}>Späť na formulár</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
