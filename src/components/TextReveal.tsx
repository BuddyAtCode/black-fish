import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const revealEase = [0.16, 1, 0.3, 1] as const;

function usePageReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    const reveal = () => {
      observer?.disconnect();
      setReady(true);
    };
    const frame = window.requestAnimationFrame(() => {
      if (document.body.dataset.pageLoading !== "true") {
        reveal();
        return;
      }

      observer = new MutationObserver(() => {
        if (document.body.dataset.pageLoading !== "true") reveal();
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-page-loading"],
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return ready;
}

export function HeroLetterLine({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const pageReady = usePageReady();
  const reduceMotion = useReducedMotion();
  let letterIndex = 0;

  return (
    <span className="hero-letter-line" aria-label={text}>
      {text.split(" ").map((word, wordIndex, words) => {
        const letters = Array.from(word);
        const firstLetterIndex = letterIndex;
        letterIndex += letters.length + 1;

        return (
          <span
            className="hero-letter-word"
            aria-hidden="true"
            key={`${word}-${wordIndex}`}
          >
            {letters.map((letter, index) => (
              <motion.span
                className="hero-letter-glyph"
                key={`${letter}-${index}`}
                initial={
                  reduceMotion
                    ? false
                    : {
                        clipPath: "inset(0 0 100% 0)",
                        opacity: 0,
                        y: "78%",
                      }
                }
                animate={
                  pageReady || reduceMotion
                    ? {
                        clipPath: "inset(0 0 0% 0)",
                        opacity: 1,
                        y: "0%",
                      }
                    : {
                        clipPath: "inset(0 0 100% 0)",
                        opacity: 0,
                        y: "78%",
                      }
                }
                transition={{
                  duration: reduceMotion ? 0.01 : 0.82,
                  delay: reduceMotion
                    ? 0
                    : delay + (firstLetterIndex + index) * 0.035,
                  ease: revealEase,
                }}
              >
                {letter}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 && (
              <span className="hero-letter-space">&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

function ScrollRevealWord({
  children,
  progress,
  range,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const y = useTransform(progress, range, [12, 0]);

  return (
    <motion.span style={reduced ? undefined : { opacity, y }}>
      {children}{" "}
    </motion.span>
  );
}

export function ScrollColorText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const target = useRef<HTMLHeadingElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.82", "end 0.34"],
  });
  const words = text.split(" ");
  const revealScale = 0.74;

  return (
    <h2
      className={`scroll-color-text ${className}`.trim()}
      ref={target}
    >
      {words.map((word, index) => {
        const start = (index / words.length) * revealScale;
        const end = Math.min(
          (index / words.length + 0.16) * revealScale,
          revealScale,
        );

        return (
          <ScrollRevealWord
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            reduced={reduceMotion}
          >
            {word}
          </ScrollRevealWord>
        );
      })}
    </h2>
  );
}
