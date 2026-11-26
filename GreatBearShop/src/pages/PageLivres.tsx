
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import livres from "../data/livres";
import CarteLivre from "../components/CarteLivre";
import { obtenirProduits } from "../services/api";
import type { ProduitAPI } from "../services/api";

function PageLivres() {
  const navigate = useNavigate();

  const [apiBooks, setApiBooks] = useState<ProduitAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenirProduits()
      .then((data) => {
        setApiBooks(data.filter((p) => p.categorie === "livre"));
      })
      .catch(() => setError("Impossible de charger les livres."))
      .finally(() => setLoading(false));
  }, []);

  const books = apiBooks.map((product, index) => {
    const isbn = String(product.caracteristiques.isbn ?? "");

    const localBook = livres.find(
      (book) => String(book.isbn) === isbn
    );

    return {
      id: index,
      productId: product._id,
      titre: product.nom,
      auteur: product.caracteristiques.auteur ?? "",
      maison_edition: product.caracteristiques.maisonEdition ?? "",
      annee_publication: product.caracteristiques.anneePublication ?? 0,
      nombre_pages: product.caracteristiques.nombrePages ?? 0,
      prix: product.prix,
      image: localBook?.image ?? "",
    };
  });

  return (
    <div style={{ backgroundColor: "#BBBBBB", minHeight: "100vh" }}>
      <div className="container py-5">
        <h1 className="text-center mb-4 text-dark">Livres</h1>

        {loading && <p className="text-center">Chargement des livres...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            {books.map((livre) => (
              <div className="col-12 col-sm-6 col-lg-3" key={livre.id}>
                <CarteLivre
                  livre={livre}
                  onDetails={(id) => navigate(`/produit/${id}`)}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <p className="text-center">Aucun livre disponible.</p>
        )}
      </div>
    </div>
  );
}

export default PageLivres;
