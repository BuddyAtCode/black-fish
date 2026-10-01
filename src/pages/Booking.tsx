import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HeroLetterLine } from "../components/TextReveal";
import { artists, getArtist } from "../data/studio";
import type { ArtistSlug } from "../data/studio";
import { createPortal } from "react-dom";
import useDialog from "../components/useDialog";
import { createSlots, instagramUrls } from "../data/booking";

type Slot = ReturnType<typeof createSlots>[number];

export default function Booking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialArtist = getArtist(searchParams.get("artist") ?? "")?.slug ?? artists[0].slug;
  const selectedArtist = initialArtist;
  const slots = useMemo(() => createSlots(selectedArtist), [selectedArtist]);
  const [selectedDay, setSelectedDay] = useState(slots[0].id);
  const [selectedTime, setSelectedTime] = useState(slots[0].times[0]);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const dialogRef = useDialog(submitted, () => setSubmitted(false));
  const activeArtist = getArtist(selectedArtist) ?? artists[0];
  const activeDay = slots.find((slot) => slot.id === selectedDay) ?? slots[0];

  useEffect(() => {
    setSelectedDay(slots[0].id);
    setSelectedTime(slots[0].times[0]);
  }, [slots]);

  const selectArtist = (artist: ArtistSlug) => {
    setSearchParams({ artist }, { replace: true });
  };

  const selectDay = (slot: Slot) => {
    setSelectedDay(slot.id);
    setSelectedTime(slot.times[0]);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`Ahoj, mám záujem o konzultáciu — ${activeArtist.name}.\nOrientačný termín: ${activeDay.date}. ${activeDay.month} o ${selectedTime}\nMeno: ${data.get("name")}\nKontakt: ${data.get("contact")}\nNápad: ${data.get("idea")}\nUmiestnenie: ${data.get("placement") || "dohodneme spolu"}\nVeľkosť: ${data.get("size") || "dohodneme spolu"}`);
    setCopyStatus("");
    setSubmitted(true);
  };

  return (
    <main className="booking-page inner-page">
      <section className="booking-hero">
        <div className="inner-hero-meta">
          <span>.INKSOUL. / REZERVÁCIA</span>
          <span>UKÁŽKA REZERVÁCIE</span>
        </div>
        <h1>
          <HeroLetterLine text="S KÝM CHCEŠ" />
          <HeroLetterLine text="TVORIŤ?" delay={0.1} />
        </h1>
        <p>
          Pozri si rukopisy, vyber orientačný termín konzultácie a napíš nám,
          čo by si chcel alebo chcela tetovať.
        </p>
        <p className="demo-notice">Kalendár je ukážkový. Skutočnú dostupnosť a rezerváciu potvrdí tatér cez Instagram.</p>
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
            <span>02 / {activeArtist.name} / konzultácia</span>
            <span>Ukážkové termíny</span>
          </div>
          <div className="calendar-days">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.id}
                className={selectedDay === slot.id ? "is-selected" : ""}
                aria-pressed={selectedDay === slot.id}
                aria-label={`${slot.day} ${slot.date}. ${slot.month}`}
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
                aria-pressed={selectedTime === time}
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
            <span>Pripraviť správu pre tatéra</span>
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

      {createPortal(<AnimatePresence>
        {submitted && (
          <motion.div
            className="booking-success"
            ref={dialogRef}
            tabIndex={-1}
            data-lenis-prevent
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
              <h2 id="success-title">POĎME SA<br />DOHODNÚŤ.</h2>
              <p>
                Skopíruj správu a pošli ju cez Instagram. Termín bude rezervovaný až po potvrdení tatérom.
              </p>
              <textarea className="booking-summary" aria-label="Správa pre tatéra" value={summary} readOnly rows={6} onFocus={(event) => event.currentTarget.select()} />
              <div className="booking-success-actions">
                <button type="button" onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(summary);
                    setCopyStatus("Správa skopírovaná.");
                  } catch {
                    setCopyStatus("Označ a skopíruj správu z poľa vyššie.");
                  }
                }}>Skopírovať správu</button>
                <a href={instagramUrls[activeArtist.slug]} target="_blank" rel="noreferrer">Otvoriť Instagram — {activeArtist.name}</a>
              </div>
              <p role="status">{copyStatus}</p>
              <button type="button" onClick={() => setSubmitted(false)}>Späť na formulár</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </main>
  );
}
