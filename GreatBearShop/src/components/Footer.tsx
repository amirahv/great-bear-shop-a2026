
import { Link } from "react-router";
import "./Footer.css";

function Footer() {
  return (
    <footer className="shop-footer">
      <div className="footer-container">

        <div className="footer-column footer-brand">
          <h3>THE GREAT BEAR SHOP</h3>
          <p>Produits canadiens. Qualité locale.</p>
          <p>
            Découvrez le meilleur du Canada
            à travers notre boutique en ligne.
          </p>
        </div>

        <div className="footer-column">
          <h4>Liens rapides</h4>

          <Link to="/">Accueil</Link>
          <Link to="/clothing">Vêtements</Link>
          <Link to="/maple">Sirop d'érable</Link>
          <Link to="/livres">Livres</Link>
          <Link to="/games">Jeux vidéo</Link>
        </div>

        <div className="footer-column">
          <h4>À propos</h4>
          <a href="/#mission">Notre mission</a>
          <a href="/#categories">Produits canadiens</a>
        </div>

        <div className="footer-column">
          <h4>Besoin d'aide ?</h4>
          <p>Service client</p>
          <p>Livraison</p>
          <p>Retours</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 The Great Bear Shop.
          Tous droits réservés.
        </p>

        <p>Fait avec ❤️ au Canada 🇨🇦</p>
      </div>
    </footer>
  );
}

export default Footer;
