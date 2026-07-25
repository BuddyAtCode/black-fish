import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

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
  let letterIndex = 0;

  return (
    <span
      className="hero-letter-line"
      data-ready={pageReady}
      aria-label={text}
    >
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
              <span
                className="hero-letter-glyph"
                key={`${letter}-${index}`}
                style={{
                  transitionDelay: `${
                    delay + (firstLetterIndex + index) * 0.035
                  }s`,
                }}
              >
                {letter}
              </span>
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
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const y = useTransform(progress, range, [12, 0]);

  return <motion.span style={{ opacity, y }}>{children} </motion.span>;
}

export function ScrollColorText({
  text,
  className = "",
  targetRef,
}: {
  text: string;
  className?: string;
  targetRef?: RefObject<HTMLElement>;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const target = targetRef ?? headingRef;
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const words = text.split(" ");
  const revealScale = 0.62;

  return (
    <h2
      className={`scroll-color-text ${className}`.trim()}
      ref={headingRef}
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
          >
            {word}
          </ScrollRevealWord>
        );
      })}
    </h2>
  );
}
