import "./Gift.css";

export default function Gift() {
  return (
    <section className="gift" id="regalo">
      <div className="container">
        <div className="giftCard">
          {/* <div className="giftOrnament">✧</div> */}

          <div className="giftOrnament">
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
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
            <button className="giftBtn">
              VER DATOS BANCARIOS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
