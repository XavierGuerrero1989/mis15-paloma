import "./Hero.css";

export default function Hero() {
  const HERO_IMAGE = "/hero.jpg";

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className="heroInner">
        <h1 className="heroTitle">MIS "XV"</h1>
        <div className="heroName">Paloma</div>
      </div>
    </section>
  );
}
