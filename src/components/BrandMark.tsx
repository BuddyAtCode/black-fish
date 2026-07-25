type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      className={["brand-mark", className].filter(Boolean).join(" ")}
      aria-label=".INKSOUL."
    >
      <span className="brand-mark__dot" aria-hidden="true">.</span>
      <span className="brand-mark__ink" aria-hidden="true">INK</span>
      <span className="brand-mark__soul" aria-hidden="true">SOUL</span>
      <span className="brand-mark__dot" aria-hidden="true">.</span>
    </span>
  );
}
