import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./GreetingCard.css";

function safeDecode(slug) {
  if (!slug) return "";
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function titleCase(str) {
  return str
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function parseSingle(slug) {
  const decoded = safeDecode(slug);
  return titleCase(
    decoded
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40)
  );
}

function parseFamily(slug) {
  const decoded = safeDecode(slug).toLowerCase();
  const parts = decoded
    .split("-y-")
    .map((p) => titleCase(p.replace(/[-_]+/g, " ").trim()));

  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return parts.join(", ");
}

export default function GreetingCard() {
  const { guestSlug } = useParams();
  const { pathname } = useLocation();

  const isFamily = pathname.startsWith("/f/");

  const invitado = useMemo(() => {
    if (!guestSlug) return "hola";
    return isFamily ? parseFamily(guestSlug) : parseSingle(guestSlug);
  }, [guestSlug, isFamily]);

  return (
    <section className="greeting">
      <div className="container">
        <div className="greetingCard">
          <p className="greetingText">
            Hola <strong>{invitado}</strong>,{" "}
            {isFamily ? "los invito" : "te invito"} a mi fiesta!
          </p>
        </div>
      </div>
    </section>
  );
}
