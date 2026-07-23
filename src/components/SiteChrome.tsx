import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { label: "Domov", to: "/" },
  { label: "Portfólio", to: "/portfolio" },
  { label: "DADLA TATS", to: "/biography" },
  { label: "Piercing shop", to: "/eshop" },
  { label: "Rezervácia", to: "/booking" },
];

function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = Array.from({ length: 32 }, () => ({ ...pointer }));
    let frame = 0;

    document.documentElement.dataset.customCursor = "true";
    cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    cursor.dataset.visible = "true";

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
      cursor.dataset.hovering = String(
        event.target instanceof Element &&
          Boolean(event.target.closest("a, button, input, textarea, select, [data-cursor]")),
      );
    };

    const hide = () => {
      cursor.dataset.visible = "false";
    };

    const press = () => {
      cursor.dataset.pressed = "true";
    };

    const release = () => {
      cursor.dataset.pressed = "false";
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let x = pointer.x;
      let y = pointer.y;

      trail.forEach((point, index) => {
        point.x += (x - point.x) * 0.34;
        point.y += (y - point.y) * 0.34;
        x = point.x;
        y = point.y;

        if (index === 0) return;
        const previous = trail[index - 1];
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(point.x, point.y);
        context.strokeStyle = `rgba(242, 235, 224, ${0.16 * (1 - index / trail.length)})`;
        context.lineWidth = Math.max(1, 11 * (1 - index / trail.length));
        context.lineCap = "round";
        context.stroke();

        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(point.x, point.y);
        context.strokeStyle = `rgba(181, 15, 29, ${0.82 * (1 - index / trail.length)})`;
        context.lineWidth = Math.max(0.8, 6.5 * (1 - index / trail.length));
        context.stroke();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", hide);
      delete document.documentElement.dataset.customCursor;
    };
  }, []);

  return (
    <>
      <canvas className="cursor-trail" ref={canvasRef} aria-hidden="true" />
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
        <span className="custom-cursor-ring" />
        <span className="custom-cursor-dot" />
      </div>
    </>
  );
}

function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    oscillators: OscillatorNode[];
    gain: GainNode;
  } | null>(null);

  const stopSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    window.setTimeout(() => {
      audio.oscillators.forEach((oscillator) => oscillator.stop());
      void audio.context.close();
    }, 350);
    audioRef.current = null;
  };

  const startSound = () => {
    const context = new AudioContext();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const frequencies = [43.65, 65.41];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const oscillatorGain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 6;
      oscillatorGain.gain.value = index === 0 ? 0.7 : 0.3;
      oscillator.connect(oscillatorGain).connect(filter);
      oscillator.start();
      return oscillator;
    });

    filter.type = "lowpass";
    filter.frequency.value = 180;
    gain.gain.value = 0;
    filter.connect(gain).connect(context.destination);
    gain.gain.setTargetAtTime(0.025, context.currentTime, 0.8);
    audioRef.current = { context, oscillators, gain };
  };

  const toggle = () => {
    if (enabled) stopSound();
    else startSound();
    setEnabled((value) => !value);
  };

  useEffect(() => stopSound, []);

  return (
    <button
      className="sound-toggle"
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Vypnúť ambientný zvuk" : "Zapnúť ambientný zvuk"}
    >
      <span className={enabled ? "sound-bars is-on" : "sound-bars"} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}

export default function SiteChrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    document.body.dataset.menuOpen = String(menuOpen);
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  return (
    <>
      <CursorTrail />

      <header className="site-header">
        <Link className="mini-logo" to="/" aria-label="BLACK FISH — domov">
          <span>Blac<i className="brand-k">K</i></span>
          <span>Fish</span>
        </Link>

        <div className="header-meta" aria-hidden="true">
          Tattoo studio · est. 2024
        </div>

        <div className="header-actions">
          <SoundToggle />
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="main-menu"
            className="menu-overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-watermark" aria-hidden="true">BF</div>
            <div className="menu-list">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 44 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.07 }}
                >
                  <Link
                    className={location.pathname === item.to ? "is-active" : ""}
                    to={item.to}
                  >
                    <small>0{index + 1}</small>
                    <span>{item.label}</span>
                    <i className="thorn-arrow thorn-arrow--menu" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="menu-footer">
              <span>Dadla Tats</span>
              <span>Slovensko · Instagram DM</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
