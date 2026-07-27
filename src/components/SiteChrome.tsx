import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";

const navigation = [
  { label: "Domov", to: "/" },
  { label: "Portfólio", to: "/portfolio" },
  { label: "Tatéri", to: "/artists" },
  { label: "Piercing shop", to: "/eshop" },
  { label: "Rezervácia", to: "/booking" },
];

const persistentActions = [
  {
    label: "Shop",
    compactLabel: "Shop",
    eyebrow: "Piercing",
    to: "/eshop",
    variant: "shop",
  },
  {
    label: "Rezervácia",
    compactLabel: "Termín",
    eyebrow: "Voľné termíny",
    to: "/booking",
    variant: "booking",
  },
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
      Zvuk {enabled ? "zap." : "vyp."}
    </button>
  );
}

function getPersistentActionWidths() {
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  return {
    collapsed: rootSize * 3.9,
    expanded: Math.min(rootSize * 12.5, Math.max(rootSize * 10.5, window.innerWidth * 0.13)),
  };
}

function PersistentActionDock({ pathname }: { pathname: string }) {
  const dockRef = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 721px) and (hover: hover)", () => {
      const compact = dock.querySelectorAll<HTMLElement>(".persistent-action-compact");
      const indices = dock.querySelectorAll<HTMLElement>(".persistent-action-index");
      const copies = dock.querySelectorAll<HTMLElement>(".persistent-action-copy");
      const arrows = dock.querySelectorAll<HTMLElement>(".thorn-arrow");
      const speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

      gsap.set(dock, { width: getPersistentActionWidths().collapsed });
      gsap.set(compact, { autoAlpha: 1, x: 0 });
      gsap.set(indices, { autoAlpha: 0, x: 12 });
      gsap.set(copies, { autoAlpha: 0, x: 14 });
      gsap.set(arrows, { autoAlpha: 0 });

      const timeline = gsap
        .timeline({ paused: true, defaults: { overwrite: "auto" } })
        .to(
          dock,
          {
            width: () => getPersistentActionWidths().expanded,
            duration: 0.72 * speed,
            ease: "expo.inOut",
          },
          0,
        )
        .to(
          compact,
          {
            autoAlpha: 0,
            x: -8,
            duration: 0.2 * speed,
            stagger: 0.025 * speed,
            ease: "power2.out",
          },
          0,
        )
        .to(
          indices,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.3 * speed,
            stagger: 0.035 * speed,
            ease: "power3.out",
          },
          0.14 * speed,
        )
        .to(
          copies,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.4 * speed,
            stagger: 0.035 * speed,
            ease: "power3.out",
          },
          0.18 * speed,
        )
        .to(
          arrows,
          {
            autoAlpha: 1,
            duration: 0.28 * speed,
            stagger: 0.035 * speed,
            ease: "power2.out",
          },
          0.26 * speed,
        );

      animationRef.current = timeline;

      const resize = () => {
        timeline.invalidate();
        if (timeline.progress() === 1) {
          gsap.set(dock, { width: getPersistentActionWidths().expanded });
        }
      };

      window.addEventListener("resize", resize, { passive: true });

      return () => {
        window.removeEventListener("resize", resize);
        timeline.kill();
        animationRef.current = null;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <nav
      className="persistent-actions"
      aria-label="Rýchle odkazy"
      ref={dockRef}
      onPointerEnter={() => animationRef.current?.play()}
      onPointerLeave={() => animationRef.current?.reverse()}
      onFocus={() => animationRef.current?.play()}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          animationRef.current?.reverse();
        }
      }}
    >
      {persistentActions.map((action, index) => {
        const active = pathname === action.to;

        return (
          <Link
            className={`persistent-action persistent-action--${action.variant}`}
            to={action.to}
            aria-current={active ? "page" : undefined}
            aria-label={active ? `${action.label} – aktuálna stránka` : action.label}
            key={action.to}
          >
            <span className="persistent-action-compact" aria-hidden="true">
              {action.compactLabel}
            </span>
            <span className="persistent-action-index">0{index + 1}</span>
            <span className="persistent-action-copy">
              <small>{active ? "Práve tu" : action.eyebrow}</small>
              <strong>{action.label}</strong>
            </span>
            <i className="thorn-arrow" aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
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
        <Link className="mini-logo" to="/" aria-label=".INKSOUL. — domov">
          <BrandMark />
        </Link>

        <div className="header-meta" aria-hidden="true">
          Tetovacie štúdio · Dadla · Duky · Walla
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

      <PersistentActionDock pathname={location.pathname} />

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
            <div className="menu-watermark" aria-hidden="true">IS</div>
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
              <span>.INKSOUL.</span>
              <span>Slovensko · Instagram doplníme</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
