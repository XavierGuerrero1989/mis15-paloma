import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { db } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import "./RsvpModal.css";

export default function RsvpModal({ open, onClose, guestSlug }) {
  const safeSlug = useMemo(
    () => (guestSlug || "invitado").toLowerCase(),
    [guestSlug]
  );

  const [form, setForm] = useState({
    nombreCompleto: "",
    asiste: "si", // "si" | "no"
    personas: 1,
    vegetariano: false,
    celiaco: false,
    otros: "",
    temaTitulo: "",
    temaAutor: "",
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" }); // type: "ok" | "err"

  const isAsiste = form.asiste === "si";

  // Reset cuando abre
  useEffect(() => {
    if (!open) return;
    setStatus({ type: "", msg: "" });
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Bloquear scroll del body mientras el modal está abierto (mejora UX y evita “saltos”)
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validate() {
    const nombre = form.nombreCompleto.trim();
    if (nombre.length < 5) return "Ingresá tu nombre y apellido completos.";

    if (isAsiste) {
      const n = Number(form.personas);
      if (!Number.isFinite(n) || n < 1 || n > 20)
        return "Cantidad de personas inválida (1 a 20).";
    }

    // Tema sugerido opcional, pero si completan uno pedimos el otro
    const t = form.temaTitulo.trim();
    const a = form.temaAutor.trim();
    if ((t && !a) || (!t && a))
      return "Si sugerís un tema, completá autor y título.";

    return "";
  }

  async function handleSave(e) {
    e.preventDefault();
    if (saving) return;

    const err = validate();
    if (err) {
      setStatus({ type: "err", msg: err });
      return;
    }

    setSaving(true);
    setStatus({ type: "", msg: "" });

    try {
      const ref = doc(db, "rsvps", safeSlug);

      const payload = {
        guestSlug: safeSlug,
        nombreCompleto: form.nombreCompleto.trim(),
        asiste: isAsiste,
        personas: isAsiste ? Number(form.personas) : 0,
        restricciones: {
          vegetariano: !!form.vegetariano,
          celiaco: !!form.celiaco,
          otros: form.otros.trim() || "",
        },
        temaSugerido: {
          titulo: form.temaTitulo.trim() || "",
          autor: form.temaAutor.trim() || "",
        },
        updatedAt: serverTimestamp(),
        // Si es la primera vez, guardamos createdAt (merge + campo condicional)
        createdAt: serverTimestamp(),
      };

      // merge:true -> evita duplicados, actualiza el mismo doc por slug
      await setDoc(ref, payload, { merge: true });

      setStatus({ type: "ok", msg: "¡Listo! Tu confirmación fue guardada." });

      // opcional: cerrar solo después de 1.2s
      setTimeout(() => onClose?.(), 1200);
    } catch (error) {
      setStatus({
        type: "err",
        msg: "No pudimos guardar la confirmación. Revisá tu conexión e intentá de nuevo.",
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  // ✅ Portal: el modal se monta en <body> y no lo tapa ningún section (FinalQuote, etc.)
  return createPortal(
    <div className="rsvpOverlay" onMouseDown={onClose}>
      <div className="rsvpModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rsvpHeader">
          <h3 className="rsvpTitle">Confirmación</h3>
          <button className="rsvpClose" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form className="rsvpForm" onSubmit={handleSave}>
          <label className="rsvpLabel">
            Nombre y apellido
            <input
              className="rsvpInput"
              value={form.nombreCompleto}
              onChange={(e) => setField("nombreCompleto", e.target.value)}
              placeholder="Ej: Lucía Pérez"
              autoComplete="name"
            />
          </label>

          <div className="rsvpRow">
            <label className="rsvpLabel">
              ¿Asistís?
              <select
                className="rsvpInput"
                value={form.asiste}
                onChange={(e) => setField("asiste", e.target.value)}
              >
                <option value="si">Sí, voy</option>
                <option value="no">No voy a poder</option>
              </select>
            </label>

            <label className="rsvpLabel">
              Personas
              <input
                className="rsvpInput"
                type="number"
                min={1}
                max={20}
                disabled={!isAsiste}
                value={form.personas}
                onChange={(e) => setField("personas", e.target.value)}
              />
            </label>
          </div>

          <div className="rsvpDivider" />

          <div className="rsvpLabel">Alimentación (opcional)</div>
          <div className="rsvpChecks">
            <label className="rsvpCheck">
              <input
                type="checkbox"
                checked={form.vegetariano}
                onChange={(e) => setField("vegetariano", e.target.checked)}
              />
              Vegetariano/a
            </label>

            <label className="rsvpCheck">
              <input
                type="checkbox"
                checked={form.celiaco}
                onChange={(e) => setField("celiaco", e.target.checked)}
              />
              Celíaco/a
            </label>
          </div>

          <label className="rsvpLabel">
            Otros / Alergias (opcional)
            <input
              className="rsvpInput"
              value={form.otros}
              onChange={(e) => setField("otros", e.target.value)}
              placeholder="Ej: sin lactosa"
            />
          </label>

          <div className="rsvpDivider" />

          <div className="rsvpLabel">Sugerí un tema para la fiesta (opcional)</div>
          <div className="rsvpRow">
            <label className="rsvpLabel">
              Título
              <input
                className="rsvpInput"
                value={form.temaTitulo}
                onChange={(e) => setField("temaTitulo", e.target.value)}
                placeholder="Ej: Blinding Lights"
              />
            </label>

            <label className="rsvpLabel">
              Autor
              <input
                className="rsvpInput"
                value={form.temaAutor}
                onChange={(e) => setField("temaAutor", e.target.value)}
                placeholder="Ej: The Weeknd"
              />
            </label>
          </div>

          {status.msg ? (
            <div className={`rsvpStatus ${status.type === "ok" ? "ok" : "err"}`}>
              {status.msg}
            </div>
          ) : null}

          <button className="rsvpSubmit" type="submit" disabled={saving}>
            {saving ? "GUARDANDO..." : "GUARDAR"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
