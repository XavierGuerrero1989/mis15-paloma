import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Hero.css";

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
  // /p/juan-perez -> "Juan Perez"
  const decoded = safeDecode(slug);
  const text = decoded
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

  return text ? titleCase(text) : null;
}

function parseFamily(slug) {
  // /f/yani-y-xavi -> "Yani y Xavi"
  const decoded = safeDecode(slug).toLowerCase();

  const parts = decoded
    .split("-y-")
    .map((p) => p.replace(/[-_]+/g, " ").trim())
    .filter(Boolean)
    .map((p) => titleCase(p));

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function getInviteVerb(isFamily) {
  return isFamily ? "los invito" : "te invito";
}

export default function Hero() {
  const { guestSlug } = useParams();
  const { pathname } = useLocation();

  const isFamily = pathname.startsWith("/f/");
  const invitado = useMemo(() => {
    if (!guestSlug) return null;
    return isFamily ? parseFamily(guestSlug) : parseSingle(guestSlug);
  }, [guestSlug, isFamily]);

  const verbo = useMemo(() => getInviteVerb(isFamily), [isFamily]);

  const saludo = invitado
    ? `Hola ${invitado}, ${verbo} a mis 15`
    : "Te invito a mis 15";

  const HERO_IMAGE = "/hero.jpg";

  return (
    <section className="hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="heroInner">
        <h1 className="heroTitle">{saludo}</h1>
        <div className="heroName">Paloma</div>
      </div>
    </section>
  );
}
