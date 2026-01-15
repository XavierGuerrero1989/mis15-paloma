import { useEffect, useMemo, useRef, useState } from "react";

import Hero from "../sections/Hero";
import Countdown from "../sections/Countdown";
import Venue from "../sections/Venue";
import Photos from "../sections/Photos";
import Gift from "../sections/Gift";
import DresscodeRsvp from "../sections/DresscodeRsvp";
import FinalQuote from "../sections/FinalQuote";

import "./Invitation.css";

const AUDIO_SRC = "/audio/tema.mp3";

const DECOS = [
  "/deco1.png",
  "/deco2.png",
  "/deco3.png",
  
];

// posiciones (incluyen centro y “medio” de página)
const POSITIONS = [
  "left -40px top -40px",      // esquina sup izq (suave)
  "center top 120px",          // centro arriba
  "center center",             // centro total
  "right -40px center",        // lateral derecho medio
  "left -40px 60%",            // lateral izquierdo medio-bajo
  "center 78%",                // centro abajo
  "right -40px bottom -60px",  // esquina inf der
];

function pickManyDecos(min = 3, max = 5) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

  // elegimos con repetición permitida (sirve si tenés pocas imágenes)
  const picks = Array.from({ length: count }, () => DECOS[Math.floor(Math.random() * DECOS.length)]);

  // elegimos posiciones distintas (hasta donde se pueda)
  const shuffledPos = [...POSITIONS].sort(() => Math.random() - 0.5);
  const pos = shuffledPos.slice(0, count);

  return { picks, pos };
}

export default function Invitation() {
  /* ----- Decoraciones random (3–5) ----- */
  const decoConfig = useMemo(() => pickManyDecos(4, 5), []);
  const bgStyle = useMemo(() => {
    const imgs = decoConfig.picks.map((src) => `url("${src}")`).join(", ");
    const positions = decoConfig.pos.join(", ");

    // tamaños: primero un poco más grande, el resto medianos
    const sizes = decoConfig.picks
      .map((_, i) => (i === 0 ? "min(520px, 82vw)" : "min(420px, 70vw)"))
      .join(", ");

    return {
      "--invite-deco-images": imgs,
      "--invite-deco-positions": positions,
      "--invite-deco-sizes": sizes,
    };
  }, [decoConfig]);

  /* ----- Música ----- */
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  useEffect(() => {
    const savedMuted = localStorage.getItem("invite_music_muted") === "1";
    const savedPaused = localStorage.getItem("invite_music_paused") === "1";

    setIsMuted(savedMuted);

    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.8;
    audio.muted = savedMuted;

    const tryAutoplay = async () => {
      if (savedPaused) return;
      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsUserGesture(false);
      } catch {
        setNeedsUserGesture(true);
        setIsPlaying(false);
      }
    };

    tryAutoplay();
  }, []);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setNeedsUserGesture(false);
      localStorage.setItem("invite_music_paused", "0");
    } catch {
      setNeedsUserGesture(true);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    localStorage.setItem("invite_music_paused", "1");
  };

  const togglePlay = () => (isPlaying ? pause() : play());

  const toggleMute = () => {
    const audio = audioRef.current;
    const next = !isMuted;

    setIsMuted(next);
    if (audio) audio.muted = next;

    localStorage.setItem("invite_music_muted", next ? "1" : "0");
  };

  return (
    <div className="inviteRoot" style={bgStyle}>
      <audio ref={audioRef} src={AUDIO_SRC} />

      <div className="musicControls">
        <button className="musicBtn" onClick={togglePlay} aria-label="Reproducir o pausar música">
          {isPlaying ? "⏸" : "▶️"}
        </button>

        <button className="musicBtn" onClick={toggleMute} aria-label="Silenciar o activar sonido">
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {needsUserGesture && (
        <div className="musicToast">
          <div className="musicToastInner">
            <div className="musicToastText">
              <strong>Música</strong>
              <span>Tocá para activar el tema 🎶</span>
            </div>
            <button className="musicToastBtn" onClick={play}>
              Activar
            </button>
          </div>
        </div>
      )}

      <Hero />
      <Countdown />
      <Venue />
      <Photos />
      <Gift />
      <DresscodeRsvp />
      <FinalQuote />
    </div>
  );
}
