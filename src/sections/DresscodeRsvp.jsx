import { useParams } from "react-router-dom";
import { useState } from "react";
import RsvpModal from "../components/RsvpModal";
import "./Dresscode.css";

export default function Dresscode() {
  const { guestSlug } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <section className="dresscode" id="dresscode">
      <div className="container">
        <div className="dresscodeCard">
          {/* Imagen (la cargás vos) */}
          <div className="dresscodeImageWrapper">
            <img
              src="/dresscode-placeholder.png"
              alt="Dresscode elegante"
              className="dresscodeImage"
            />
          </div>

          <h2 className="dresscodeTitle">Dress Code</h2>

          <p className="dresscodeText">
            Te invitamos a vestir de manera <strong>elegante</strong>, acompañando el
            espíritu de esta noche tan especial.
          </p>

          <p className="dresscodeNote">
            Para mantener la armonía del evento, te pedimos <strong>NO</strong> utilizar los siguientes
            colores: <strong>blanco, beige, dorado ni plateado</strong>.
          </p>

          <div className="dresscodeActions">
            <button className="dresscodeBtn" onClick={() => setOpen(true)}>
              CONFIRMAR ASISTENCIA
            </button>
          </div>
        </div>
      </div>

      <RsvpModal
        open={open}
        onClose={() => setOpen(false)}
        guestSlug={guestSlug}
      />
    </section>
  );
}

