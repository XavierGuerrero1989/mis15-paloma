import { useEffect, useMemo, useState } from "react";
import "./Countdown.css";

/**
 * Evento:
 * 📅 1 de Mayo 2026
 * 🕘 21:00 hs
 */
const EVENT_START_ISO = "2026-05-01T21:00:00-03:00";

function getDiffParts(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { done: false, days, hours, minutes, seconds };
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const target = useMemo(() => new Date(EVENT_START_ISO), []);
  const [parts, setParts] = useState(() => getDiffParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getDiffParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const fecha = useMemo(
    () =>
      target.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [target]
  );

  return (
    <section id="fecha" className="countdown">
      <div className="container countdownStack">
        {/* CARD FECHA */}
        <div className="countdownCard">
          <div className="countdownIcon" aria-hidden="true">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6l4 2" />
            </svg>
          </div>

          <h2 className="countdownTitle">¿Cuándo?</h2>
          <p className="countdownDate">{fecha}</p>

          <h2 className="countdownTitle">¿A qué hora?</h2>
          <p className="countdownDate">De 21:00 a 05:00 hs</p>
        </div>

        {/* CARD CUENTA REGRESIVA */}
        <div className="countdownCard">
          <h2 className="countdownTitle countdownCenter">Faltan</h2>

          {parts.done ? (
            <div className="countdownDone">¡Es hoy! 🎉</div>
          ) : (
            <div className="countdownGrid">
              <TimeBox label="Días" value={parts.days} />
              <TimeBox label="Horas" value={pad2(parts.hours)} />
              <TimeBox label="Min" value={pad2(parts.minutes)} />
              <TimeBox label="Seg" value={pad2(parts.seconds)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="timeBox">
      <div className="timeValue">{value}</div>
      <div className="timeLabel">{label}</div>
    </div>
  );
}
