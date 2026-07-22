import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const loaderEase = [0.76, 0, 0.24, 1] as const;

export default function PageLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.dataset.pageLoading = "true";

    const start = performance.now();
    const progressDuration = reduceMotion ? 180 : 1650;
    let frame = 0;

    const updateProgress = (now: number) => {
      const elapsed = Math.min((now - start) / progressDuration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) frame = requestAnimationFrame(updateProgress);
    };

    frame = requestAnimationFrame(updateProgress);
    const timeout = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 450 : 2050,
    );

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
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
            <span>BLACK FISH / DADLA TATS</span>
            <span>TATTOO STUDIO · EST. 2024</span>
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
            <motion.img
              src="/blackfish-mark.svg"
              alt=""
              initial={{ opacity: 0, scale: 0.78, filter: "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{
                duration: reduceMotion ? 0.01 : 1,
                delay: reduceMotion ? 0 : 0.16,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </motion.div>

          <motion.div
            className="page-loader-ritual"
            initial={{ opacity: 0, letterSpacing: "0.42em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.8,
              delay: reduceMotion ? 0 : 0.66,
            }}
          >
            Ink / Image / Ritual
          </motion.div>

          <div className="page-loader-progress">
            <div className="page-loader-progress-meta">
              <span>Pripravujeme obraz</span>
              <strong>{String(progress).padStart(3, "0")}</strong>
            </div>
            <div className="page-loader-progress-track">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduceMotion ? 0.12 : 1.65,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
