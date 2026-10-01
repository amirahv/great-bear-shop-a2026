import { Link } from "react-router";
import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-small-title">THE GREAT BEAR SHOP</p>

            <h1>
              Découvrez le meilleur
              <br />
              du Canada
            </h1>

            <p className="hero-description">
              Découvrez une sélection de produits canadiens,
              des vêtements aux produits d'érable.
            </p>

            <a href="#categories" className="hero-button">
              Découvrir nos produits
            </a>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="categories-section" id="categories">

        <div className="section-heading">
          <p className="section-label">MAGASINER</p>
          <h2>Nos catégories</h2>
          <p>
            Découvrez les différentes catégories de produits
            disponibles sur The Great Bear Shop.
          </p>
        </div>

        <div className="categories-grid">

          {/* VÊTEMENTS */}
          <Link to="/clothing" className="category-card">
            <div className="category-image clothing-category">
              <div className="category-overlay">
                <span>MODE CANADIENNE</span>
                <h3>Vêtements</h3>
                <p>Découvrir →</p>
              </div>
            </div>
          </Link>

          {/* SIROP D'ÉRABLE */}
          <Link to="/maple" className="category-card">
            <div className="category-image maple-category">
              <div className="category-overlay">
                <span>100 % CANADIEN</span>
                <h3>Sirop d'érable</h3>
                <p>Découvrir →</p>
              </div>
            </div>
          </Link>

          {/* LIVRES */}
          <Link to="/livres" className="category-card">
            <div className="category-image books-category">
              <div className="category-overlay">
                <span>CULTURE</span>
                <h3>Livres</h3>
                <p>Découvrir →</p>
              </div>
            </div>
          </Link>

          {/* JEUX VIDÉO */}
          <Link to="/games" className="category-card">
            <div className="category-image games-category">
              <div className="category-overlay">
                <span>DIVERTISSEMENT</span>
                <h3>Jeux vidéo</h3>
                <p>Découvrir →</p>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* SECTION CANADA */}
      <section className="canadian-section">
        <div className="canadian-content">

          <p className="section-label">NOTRE MISSION</p>

          <h2>
            Acheter canadien,
            <br />
            soutenir local
          </h2>

          <p>
            The Great Bear Shop met en valeur des produits canadiens
            afin d'offrir une alternative locale pour vos achats en ligne.
          </p>

          <a href="#categories" className="secondary-button">
            Explorer la boutique
          </a>

        </div>

        <div className="canadian-symbol">
          <span>🍁</span>
          <p>Produits canadiens</p>
        </div>
      </section>

    </main>
  );
}

export default HomePage;