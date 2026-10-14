import { useState } from "react";

// Product / category image with a quiet grey placeholder when missing or broken.
export default function Picture({ src, alt = "", ratio = "4 / 5", tone = 0 }) {
  const [broken, setBroken] = useState(false);
  const tones = ["#ecece8", "#e3e4e0", "#f0efeb", "#e8e8e4"];
  const show = src && !broken;

  return (
    <div className="picture" style={{ aspectRatio: ratio, background: tones[tone % tones.length] }}>
      {show && <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />}
    </div>
  );
}
