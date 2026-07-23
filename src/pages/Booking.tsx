import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Slot = {
  id: string;
  day: string;
  date: string;
  month: string;
  times: string[];
};

const createSlots = (): Slot[] => {
  const offsets = [3, 6, 9, 13, 17];
  return offsets.map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
      id: date.toISOString().slice(0, 10),
      day: new Intl.DateTimeFormat("sk-SK", { weekday: "short" }).format(date),
      date: String(date.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("sk-SK", { month: "short" }).format(date),
      times: offset % 2 ? ["10:00", "14:30"] : ["11:30", "16:00"],
    };
  });
};

export default function Booking() {
  const slots = useMemo(createSlots, []);
  const [selectedDay, setSelectedDay] = useState(slots[0].id);
  const [selectedTime, setSelectedTime] = useState(slots[0].times[0]);
  const [submitted, setSubmitted] = useState(false);
  const activeDay = slots.find((slot) => slot.id === selectedDay) ?? slots[0];

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
          <span>BLACK FISH / OPEN CHAIR</span>
          <span>DEMO BOOKING SYSTEM</span>
        </div>
        <h1>
          <span>TVÔJ OBRAZ</span>
          <span>ZAČÍNA TU.</span>
        </h1>
        <p>
          Vyber orientačný termín konzultácie a opíš predstavu. Potvrdenie zatiaľ dokončíme
          cez Instagram DM.
        </p>
      </section>

      <section className="booking-system">
        <div className="calendar-panel">
          <div className="calendar-heading">
            <span>Najbližšie voľné konzultácie</span>
            <span><i /> Live availability</span>
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
        </div>

        <form className="booking-form" onSubmit={submit}>
          <label>
            <span>01 / Ako sa voláš?</span>
            <input name="name" required placeholder="Meno a priezvisko" />
          </label>
          <label>
            <span>02 / Kde ťa nájdeme?</span>
            <input name="contact" required placeholder="Instagram alebo e-mail" />
          </label>
          <label>
            <span>03 / Čo máš v hlave?</span>
            <textarea
              name="idea"
              required
              rows={4}
              placeholder="Motív, nálada, príbeh, miesto na tele..."
            />
          </label>
          <div className="booking-form-row">
            <label>
              <span>04 / Umiestnenie</span>
              <input name="placement" placeholder="Predlaktie" />
            </label>
            <label>
              <span>05 / Veľkosť</span>
              <input name="size" placeholder="cca 15 cm" />
            </label>
          </div>
          <button className="booking-submit" type="submit">
            <span>Odoslať nezáväzný dopyt</span>
            <i className="thorn-arrow" aria-hidden="true" />
          </button>
          <small className="form-disclaimer">
            Formulár zatiaľ slúži ako ukážka. Zadané údaje sa po odoslaní zahodia.
          </small>
        </form>
      </section>

      <section className="booking-faq">
        <span>Predtým, než napíšeš</span>
        <div>
          <h2>PRINES NÁPAD.<br />DADLA MU DÁ TVAR.</h2>
          <p>
            Pošli referencie, ktoré vystihujú náladu, kompozíciu alebo detail. Dadla z nich
            pripraví vlastný návrh pre tvoje telo.
          </p>
          <Link to="/portfolio">
            Pozrieť rukopis Dadly
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
              initial={{ scale: 0.86, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <span>REQUEST / PREVIEW</span>
              <h2 id="success-title">OBRAZ JE<br />NA CESTE.</h2>
              <p>
                V ostrej verzii by teraz Dadla dostala tvoj dopyt. Zatiaľ jej môžeš napísať
                priamo cez Instagram DM.
              </p>
              <button type="button" onClick={() => setSubmitted(false)}>Späť na web</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
