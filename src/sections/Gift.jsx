import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./Gift.css";

const CBU_RAW = "0070152130004032235091";
const ALIAS = "ANALIA.OLAGUE";

function formatCbu(cbu) {
  // Legible, sin “cortar feo”. Copiamos el RAW igual.
  return cbu.replace(/(.{4})/g, "$1 ").trim();
}

export default function Gift() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const CBU_DISPLAY = useMemo(() => formatCbu(CBU_RAW), []);

  // Bloquear scroll + ESC para cerrar
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copiado ✅`);
      setTimeout(() => setToast(""), 1600);
    } catch {
      setToast("No se pudo copiar 😕");
      setTimeout(() => setToast(""), 1600);
    }
  }

  const modal = open ? (
    <div
      className="giftModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Datos bancarios"
      onMouseDown={(e) => {
        // click afuera cierra
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="giftModalShell">
        <div className="giftModalInner">
          <button
            className="giftModalClose"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="giftModalTopIcon" aria-hidden="true">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 L14 8 L20 10 L14 12 L12 18 L10 12 L4 10 L10 8 Z" />
            </svg>
          </div>

          <h3 className="giftModalTitle">Datos bancarios</h3>
          <p className="giftModalSub">
            Si querés hacer una transferencia, acá están los datos:
          </p>

          <div className="giftBankBox">
            <div className="giftBankRow">
              <div className="giftBankMeta">
                <div className="giftBankLabel">CBU</div>
                <div className="giftBankValue mono">{CBU_DISPLAY}</div>
              </div>
              <button
                className="giftCopyBtn"
                onClick={() => copy(CBU_RAW, "CBU")}
                type="button"
              >
                Copiar
              </button>
            </div>

            <div className="giftBankDivider" />

            <div className="giftBankRow">
              <div className="giftBankMeta">
                <div className="giftBankLabel">ALIAS</div>
                <div className="giftBankValue">{ALIAS}</div>
              </div>
              <button
                className="giftCopyBtn"
                onClick={() => copy(ALIAS, "Alias")}
                type="button"
              >
                Copiar
              </button>
            </div>
          </div>

          {toast ? <div className="giftToast">{toast}</div> : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className="gift" id="regalo">
      <div className="container">
        <div className="giftCard">
          <div className="giftOrnament" aria-hidden="true">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 L14 8 L20 10 L14 12 L12 18 L10 12 L4 10 L10 8 Z" />
            </svg>
          </div>

          <h2 className="giftTitle">Este día es más lindo con vos</h2>

          <p className="giftText">
            Compartir este momento juntos es lo que realmente importa.
            <br />
            Si aun así querés hacerme un regalo, podés hacerlo a través de una
            transferencia.
          </p>

          <div className="giftActions">
            <button className="giftBtn" onClick={() => setOpen(true)}>
              VER DATOS BANCARIOS
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Portal: asegura que NADA (Dresscode) lo tape */}
      {open ? createPortal(modal, document.body) : null}
    </section>
  );
}
