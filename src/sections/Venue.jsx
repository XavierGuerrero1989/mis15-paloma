import "./Venue.css";

const VENUE_OFICIALNAME = "GOLF CLUB EVENTOS";
const VENUE_NAME = "Salón Golf";
const VENUE_ADDRESS = "Ruta de la Tradición 9051 (Cno de Cintura)";
const VENUE_EXTRA = "Con estacionamiento";
const MAPS_URL =
  "https://www.google.com/maps/place/Golf+Club+Eventos/@-34.7314389,-58.5068279,16z/data=!4m6!3m5!1s0x95bccef8ac7acf83:0x308e92157265a081!8m2!3d-34.7316579!4d-58.5018332!16s%2Fg%2F119vhyrmj!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDExMS4wIKXMDSoASAFQAw%3D%3D";

export default function Venue() {
  return (
    <section className="venue" id="lugar">
      <div className="container">
        <div className="venueCard">
          <div className="venueIcon" aria-hidden="true">
            {/* Ícono ubicación outline */}
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
              {/* pin */}
              <path d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z" />
              {/* punto */}
              <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            </svg>
          </div>

          <h2 className="venueTitle">¿Dónde?</h2>

          <p className="venueName">{VENUE_OFICIALNAME}</p>
          <p className="venueName">{VENUE_NAME}</p>
          <p className="venueAddress">{VENUE_ADDRESS}</p>
          <p className="venueExtra">{VENUE_EXTRA}</p>

          <div className="venueActions">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="venueBtn"
            >
              VER EN GOOGLE MAPS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
