import { useEffect, useMemo, useRef, useState } from "react";
import "./Photos.css";

const PHOTOS = Array.from({ length: 10 }, (_, i) => `/photo${i + 1}.jpeg`);

export default function Photos() {
  const carouselRef = useRef(null);
  const itemRefs = useRef([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [index, setIndex] = useState(0);

  const total = useMemo(() => PHOTOS.length, []);

  // Detecta interacción (touch + mouse) y pausa
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let resumeTimer;

    const pause = () => {
      setIsInteracting(true);
      clearTimeout(resumeTimer);
    };

    const resumeLater = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => setIsInteracting(false), 2200);
    };

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeLater, { passive: true });
    el.addEventListener("mousedown", pause);
    el.addEventListener("mouseup", resumeLater);
    el.addEventListener("mouseleave", resumeLater);

    return () => {
      clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeLater);
      el.removeEventListener("mousedown", pause);
      el.removeEventListener("mouseup", resumeLater);
      el.removeEventListener("mouseleave", resumeLater);
    };
  }, []);

  // Auto-scroll por pasos (snap-friendly)
  useEffect(() => {
    if (isInteracting) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 2800); // velocidad del carrusel (ajustable)

    return () => clearInterval(id);
  }, [isInteracting, total]);

  // Cuando cambia el index, desplazamos SOLO el carrusel
useEffect(() => {
  const carousel = carouselRef.current;
  const item = itemRefs.current[index];
  if (!carousel || !item) return;

  const carouselRect = carousel.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  const offset =
    itemRect.left -
    carouselRect.left -
    carousel.clientWidth / 2 +
    item.clientWidth / 2;

  carousel.scrollBy({
    left: offset,
    behavior: "smooth",
  });
}, [index]);


  return (
    <section className="photos" id="fotos">
      <div className="container">
        <div className="photosCard">
          <h2 className="photosTitle">Momentos</h2>

          <div className="photosCarousel" ref={carouselRef}>
            {PHOTOS.map((src, idx) => (
              <div
                className="photoItem"
                key={idx}
                ref={(el) => (itemRefs.current[idx] = el)}
              >
                <img src={src} alt={`Foto ${idx + 1}`} />
              </div>
            ))}
          </div>

          {/* puntitos opcionales (queda lindo) */}
          <div className="photosDots" aria-hidden="true">
            {PHOTOS.map((_, i) => (
              <span key={i} className={`dot ${i === index ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
