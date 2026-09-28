import { useState } from "react";
import mapleProducts from "../data/mapleProducts";
import MapleProductCard from "../components/MapleProductCard";

function Maple() {
  const [category, setCategory] = useState("Tous");

  const filteredProducts =
    category === "Tous"
      ? mapleProducts
      : mapleProducts.filter(
          (product) => product.category === category
        );

  return (
    <div className="container py-5">

      {/* Titre */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-dark">
          Sirop d'érable
        </h1>

        <p className="text-muted">
          Découvrez une sélection de produits d'érable canadiens
        </p>
      </div>

      {/* Filtres */}
      <div className="d-flex justify-content-center gap-2 flex-wrap mb-5">

        <button
          className={
            category === "Tous"
              ? "btn btn-dark"
              : "btn btn-outline-dark"
          }
          onClick={() => setCategory("Tous")}
        >
          Tous
        </button>

        <button
          className={
            category === "Sirop pur"
              ? "btn btn-dark"
              : "btn btn-outline-dark"
          }
          onClick={() => setCategory("Sirop pur")}
        >
          Sirop pur
        </button>

        <button
          className={
            category === "Biologique"
              ? "btn btn-dark"
              : "btn btn-outline-dark"
          }
          onClick={() => setCategory("Biologique")}
        >
          Biologique
        </button>

        <button
          className={
            category === "Coffrets"
              ? "btn btn-dark"
              : "btn btn-outline-dark"
          }
          onClick={() => setCategory("Coffrets")}
        >
          Coffrets
        </button>

      </div>

      {/* Produits */}
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3"
            key={product.id}
          >
            <MapleProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default Maple;