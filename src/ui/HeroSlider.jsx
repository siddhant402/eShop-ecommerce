import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MAX_SLIDES = 12;
const DELAY_MS = 4000;

// Evenly spaced pick so every category is represented.
function pick(products) {
  const withImage = (products ?? []).filter((p) => p.image);
  if (withImage.length <= MAX_SLIDES) return withImage;
  const step = withImage.length / MAX_SLIDES;
  return Array.from({ length: MAX_SLIDES }, (_, i) => withImage[Math.floor(i * step)]);
}

export default function HeroSlider({ products }) {
  const slides = useMemo(() => pick(products), [products]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (slides.length < 2 || paused || reduced) return undefined;
    const timer = setInterval(() => setIndex((n) => (n + 1) % slides.length), DELAY_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused, reduced]);

  if (slides.length === 0) {
    return <div className="hero__image"><span>Hero image</span></div>;
  }

  return (
    <div
      className="hero__image hero__slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((p, i) => (
        <Link
          key={p.id}
          to={`/product/${p.id}`}
          className={`slide ${i === index ? "slide--on" : ""}`}
          tabIndex={i === index ? 0 : -1}
          aria-hidden={i !== index}
        >
          <img src={p.image} alt={p.name} loading={i < 2 ? "eager" : "lazy"} />
          <span className="slide__caption">{p.name}</span>
        </Link>
      ))}
      {slides.length > 1 && (
        <div className="dots">
          {slides.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`dot ${i === index ? "dot--on" : ""}`}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
