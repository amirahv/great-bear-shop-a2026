
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import mapleProducts from "../data/mapleProducts";
import MapleProductCard from "../components/MapleProductCard";
import { obtenirProduits } from "../services/api";
import type { ProduitAPI } from "../services/api";

function Maple() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("Tous");
  const [apiProducts, setApiProducts] = useState<ProduitAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenirProduits()
      .then((data) => {
        setApiProducts(data.filter((p) => p.categorie === "sirop-erable"));
      })
      .catch(() => setError("Impossible de charger les produits."))
      .finally(() => setLoading(false));
  }, []);

  const products = apiProducts.map((product, index) => {
    const brand = product.caracteristiques.marque ?? "";
    const productCategory =
      product.caracteristiques.categorieSirop ??
      (product.caracteristiques.biologique ? "Biologique" : "Sirop pur");

    const normalize = (value: string) =>
      value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const localProduct = mapleProducts.find(
      (p) =>
        p.brand === brand &&
        normalize(p.name) === normalize(product.nom)
    );

    return {
      id: index,
      productId: product._id,
      name: product.nom,
      brand,
      category: productCategory,
      price: product.prix,
      image: localProduct?.image ?? mapleProducts[index]?.image ?? "",
    };
  });

  const filteredProducts =
    category === "Tous"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Sirop d'érable</h1>

      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
        {["Tous", "Sirop pur", "Biologique", "Coffrets"].map((option) => (
          <button
            key={option}
            type="button"
            className={
              category === option ? "btn btn-dark" : "btn btn-outline-dark"
            }
            onClick={() => setCategory(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {loading && <p className="text-center">Chargement des produits...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
              <MapleProductCard
                product={product}
                onDetails={(id) => navigate(`/produit/${id}`)}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="text-center">Aucun produit disponible.</p>
      )}
    </div>
  );
}

export default Maple;
