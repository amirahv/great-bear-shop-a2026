import { useEffect, useState } from "react";
import CarteLivre from "../components/CarteLivre";
import type { ProduitCatalogue } from "../types/produit";

/**
 * Charge les livres depuis le backend et affiche leurs fiches.
 *
 * @author Amir
 */
function PageLivres() {
  const [livres, setLivres] = useState<ProduitCatalogue[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    // Ignore les résultats si l'utilisateur quitte la page pendant le chargement.
    let actif = true;

    async function chargerLivres() {
      try {
        const reponse = await fetch("http://localhost:4000/api/produits");

        if (!reponse.ok) {
          throw new Error("Impossible de charger les livres.");
        }

        const produits: ProduitCatalogue[] = await reponse.json();

        if (actif) {
          // La route retourne toutes les catégories de produits.
          setLivres(
            produits.filter((produit) => produit.categorie === "livre"),
          );
        }
      } catch (error) {
        if (actif) {
          setErreur(
            error instanceof Error
              ? error.message
              : "Impossible de joindre le serveur.",
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void chargerLivres();

    return () => {
      actif = false;
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#BBBBBB", minHeight: "100vh" }}>
      <div className="container py-5">
        <h1 className="text-center mb-4 text-dark">Livres</h1>

        {chargement ? (
          <p role="status">Chargement des livres…</p>
        ) : erreur ? (
          <p className="alert alert-danger" role="alert">
            {erreur}
          </p>
        ) : livres.length === 0 ? (
          <p>Aucun livre disponible pour le moment.</p>
        ) : (
          <div className="row g-4">
            {livres.map((livre) => (
              <div className="col-12 col-sm-6 col-lg-3" key={livre._id}>
                <CarteLivre livre={livre} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageLivres;
