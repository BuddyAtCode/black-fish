import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

const loaderEase = [0.76, 0, 0.24, 1] as const;
const assetTimeout = 20000;

const imageAssets = [
  "/images/generated/tattoo-session.jpg",
  "/images/generated/tattoo-botanical-eye.webp",
  "/images/generated/tattoo-abstract-forearm.webp",
  "/images/generated/studio-interior.webp",
  "/images/generated/piercing-collection.jpg",
  "/images/generated/piercing-nocturne-ring.webp",
  "/images/generated/piercing-blood-moon.webp",
  "/images/generated/piercing-twin-thorn.webp",
  "/images/generated/piercing-orbit-chain.webp",
  "/images/generated/piercing-ritual-bar.webp",
  "/images/generated/piercing-void-spike.webp",
];

const fontAssets = [
  '400 16px "Bodoni Moda SC"',
  '500 16px "Bodoni Moda SC"',
  '800 16px "Grenze Gotisch"',
  '400 16px "IBM Plex Mono"',
  '500 16px "IBM Plex Mono"',
  '400 16px "Space Grotesk"',
  '500 16px "Space Grotesk"',
  '600 16px "Space Grotesk"',
  '700 16px "Space Grotesk"',
  '400 16px "UnifrakturMaguntia"',
];

type ProgressListener = (progress: number) => void;

let preloadPromise: Promise<void> | null = null;
let preloadProgress = 0;
const progressListeners = new Set<ProgressListener>();

function reportProgress(progress: number) {
  preloadProgress = progress;
  progressListeners.forEach((listener) => listener(progress));
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      image.decode().then(resolve).catch(resolve);
    };
    image.onerror = () => reject(new Error(`Failed to preload ${src}`));
    image.src = src;
  });
}

async function preloadFile(src: string) {
  const response = await fetch(src, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed to preload ${src}`);
  await response.arrayBuffer();
}

function withTimeout(task: Promise<unknown>) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, assetTimeout);
    task
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(timeout);
        resolve();
      });
  });
}

function startPreloading() {
  if (preloadPromise) return preloadPromise;

  const tasks: Array<() => Promise<unknown>> = [
    ...imageAssets.map((src) => () => preloadImage(src)),
    ...fontAssets.map((font) => () => document.fonts.load(font)),
    () => preloadFile("/models/inksoul-skull.glb"),
    () => import("./InksoulArtifactScene"),
  ];

  let completed = 0;
  preloadPromise = Promise.all(
    tasks.map(async (task) => {
      await withTimeout(Promise.resolve().then(() => task()));
      completed += 1;
      reportProgress(Math.round((completed / tasks.length) * 100));
    }),
  ).then(() => {
    reportProgress(100);
  });

  return preloadPromise;
}

export default function PageLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.dataset.pageLoading = "true";

    const start = performance.now();
    const minimumDuration = reduceMotion ? 280 : 1500;
    let exitTimeout = 0;
    let cancelled = false;

    const handleProgress = (nextProgress: number) => {
      if (!cancelled) setProgress(nextProgress);
    };
    progressListeners.add(handleProgress);
    handleProgress(preloadProgress);

    startPreloading().then(() => {
      if (cancelled) return;
      const remaining = Math.max(0, minimumDuration - (performance.now() - start));
      exitTimeout = window.setTimeout(
        () => setVisible(false),
        remaining + (reduceMotion ? 40 : 220),
      );
    });

    return () => {
      cancelled = true;
      progressListeners.delete(handleProgress);
      window.clearTimeout(exitTimeout);
      delete document.body.dataset.pageLoading;
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        delete document.body.dataset.pageLoading;
      }}
    >
      {visible && (
        <motion.div
          className="page-loader"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: reduceMotion ? 0.18 : 1.05, ease: loaderEase }}
        >
          <div className="page-loader-grid" />

          <motion.div
            className="page-loader-topline"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.6,
              delay: reduceMotion ? 0 : 0.12,
            }}
          >
            <span>.INKSOUL. / TETOVACIE ŠTÚDIO</span>
            <span>DADLA · DUKY · WALLA</span>
          </motion.div>

          <motion.div
            className="page-loader-mark"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.95,
              delay: reduceMotion ? 0 : 0.2,
              ease: loaderEase,
            }}
          >
            <motion.div
              className="loader-brand-wrap"
              initial={{ opacity: 0, scale: 0.78, filter: "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{
                duration: reduceMotion ? 0.01 : 1,
                delay: reduceMotion ? 0 : 0.16,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <BrandMark className="brand-mark--loader" />
            </motion.div>
          </motion.div>

          <motion.div
            className="page-loader-tagline"
            initial={{ opacity: 0, letterSpacing: "0.42em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.8,
              delay: reduceMotion ? 0 : 0.66,
            }}
          >
            Tetovacie štúdio / traja tatéri
          </motion.div>

          <div className="page-loader-progress">
            <div className="page-loader-progress-meta">
              <span>Načítavame štúdio</span>
              <strong>{String(progress).padStart(3, "0")}</strong>
            </div>
            <div className="page-loader-progress-track">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
