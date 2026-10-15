
import { useState } from "react";
import { Link, useLocation } from "react-router";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "ACCUEIL", path: "/" },
    { name: "VÊTEMENTS", path: "/clothing" },
    { name: "SIROP D'ÉRABLE", path: "/maple" },
    { name: "LIVRES", path: "/books" },
    { name: "JEUX VIDÉO", path: "/games" },
  ];

  return (
    <>
      <header className="shop-navbar">
        <button
          className="shop-menu-button"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="shop-navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        <Link
          to="/"
          className="shop-logo"
          onClick={() => setIsOpen(false)}
        >
          THE GREAT BEAR SHOP
        </Link>
      </header>

      {isOpen && (
        <div className="shop-menu-overlay" id="shop-navigation">
          <nav className="shop-menu-links">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "shop-menu-link selected"
                    : "shop-menu-link"
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
