import { Link } from "react-router";

function Header() {
  return (
    <header
      style={{
        backgroundColor: "#ad9950",
      }}
      className="py-3"
    >
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-dark text-decoration-none">
          <h2 className="mb-0">The Great Bear Shop</h2>
        </Link>

        <nav>
       
          <Link to="/clothing" className="text-white text-decoration-none me-3">
            Vêtements
          </Link>

          <Link to="/livres" className="text-white  text-decoration-none me-3">
            Livres
          </Link>

          <Link to="/connexion" className="text-white text-decoration-none me-3">
            Connexion
          </Link>

          <Link to="/inscription" className="text-white text-decoration-none me-3">
            Inscription
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

