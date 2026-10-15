
import { useState } from "react";
import { Link } from "react-router";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Clothing.css";

function Clothing() {
  const [gender, setGender] = useState("Tous");

  const filteredProducts =
    gender === "Tous"
      ? products
      : products.filter((product) => product.gender === gender);

  return (
    <div className="clothing-page">

      
      <main className="container clothing-main">

        {/* TITRE */}
        <div className="clothing-header">
          <h1>Vêtements</h1>
          <p>
            Découvrez notre collection de vêtements
            de marques canadiennes.
          </p>
        </div>

        {/* FILTRES */}
        <div className="clothing-filters">
          {["Tous", "Femme", "Homme"].map((option) => (
            <button
              key={option}
              type="button"
              className={
                gender === option
                  ? "clothing-filter active"
                  : "clothing-filter"
              }
              aria-pressed={gender === option}
              onClick={() => setGender(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* PRODUITS */}
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default Clothing;
