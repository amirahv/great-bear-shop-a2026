
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { obtenirProduits } from "../services/api";
import type { ProduitAPI } from "../services/api";
import "./Clothing.css";

function Clothing() {
  const navigate = useNavigate();

  const [gender, setGender] = useState("Tous");
  const [apiProducts, setApiProducts] = useState<ProduitAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDetails = (id: string) => {
    navigate(`/produit/${id}`);
  };

  useEffect(() => {
    obtenirProduits()
      .then((data) => {
        setApiProducts(data.filter((p) => p.categorie === "vetement"));
      })
      .catch(() => {
        setError("Impossible de charger les vêtements.");
      })
      .finally(() => setLoading(false));
  }, []);

  const clothingProducts = apiProducts.map((product, index) => {
    const brand = product.caracteristiques.marque ?? "";
    const productGender = product.caracteristiques.genre ?? "";

    const localProduct = products.find(
      (p) =>
        p.name === product.nom &&
        p.brand === brand &&
        p.gender === productGender
    );

    return {
      id: index,
      productId: product._id,
      name: product.nom,
      brand,
      category: product.description?.split(" • ")[0] ?? "Vêtements",
      gender: productGender,
      price: product.prix,
      image: localProduct?.image ?? "",
    };
  });

  const filteredProducts =
    gender === "Tous"
      ? clothingProducts
      : clothingProducts.filter((product) => product.gender === gender);

  return (
    <div className="clothing-page">
      <main className="container clothing-main">
        <div className="clothing-header">
          <h1>Vêtements</h1>
          <p>
            Découvrez notre collection de vêtements
            de marques canadiennes.
          </p>
        </div>

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

        {loading && <p>Chargement des vêtements...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard
                  product={product}
                  onDetails={handleDetails}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p>Aucun vêtement disponible.</p>
        )}
      </main>
    </div>
  );
}

export default Clothing;
