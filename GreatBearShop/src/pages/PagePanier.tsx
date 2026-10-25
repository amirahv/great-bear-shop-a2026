import { useState } from "react";
import "./PagePanier.css";
import panierTemporaire from "../data/panierTemporaire";

/**
 * Affiche les articles du panier et permet de modifier leurs quantités
 * ou de les retirer.
 *
 * Le panier est initialisé avec des données temporaires.
 * Les modifications restent en mémoire et sont perdues au rechargement.
 *
 * @author Amir
 */
function PagePanier() {
  // Conserve les articles affichés et permet d'actualiser l'interface.
  const [articles, setArticles] = useState(panierTemporaire);

  /**
   * Retire un article du panier affiché.
   *
   * @param produitId - Identifiant du produit à retirer.
   * @author Amir
   */
  function retirerArticle(produitId: string) {
    // Crée une nouvelle liste contenant tous les autres articles.
    setArticles((articlesActuels) =>
      articlesActuels.filter((article) => article.produitId !== produitId),
    );
  }

  /**
   * Modifie la quantité d'un article et recalcule son montant.
   * La quantité doit être un entier positif.
   *
   * @param produitId - Identifiant du produit à modifier.
   * @param nouvelleQuantite - Nouvelle quantité souhaitée.
   * @author Amir
   */
  function modifierQuantite(produitId: string, nouvelleQuantite: number) {
    // Refuse les quantités invalides avant de modifier l'état.
    if (!Number.isSafeInteger(nouvelleQuantite) || nouvelleQuantite < 1) {
      return;
    }

    setArticles((articlesActuels) =>
      articlesActuels.map((article) => {
        if (article.produitId !== produitId) {
          return article;
        }

        // Calcule en centimes pour limiter les erreurs d'arrondi monétaires.
        const prixEnCentimes =
          article.prixUnitaire !== null
            ? Math.round(article.prixUnitaire * 100)
            : null;

        return {
          // Copie l'article et remplace sa quantité ainsi que son montant.
          ...article,
          quantite: nouvelleQuantite,
          totalLigne:
            prixEnCentimes !== null
              ? (prixEnCentimes * nouvelleQuantite) / 100
              : null,
        };
      }),
    );
  }

  return (
    <div className="page-panier">
      <div className="container py-5">
        <h1 className="mb-4">Le panier</h1>

        {/* Affiche un message si le panier est vide, sinon la liste des articles. */}
        {articles.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          articles.map((article) => (
            <div className="card mb-3" key={article.produitId}>
              <div className="card-body">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-md-2">
                    {article.images.length > 0 ? (
                      <img
                        src={article.images[0]}
                        alt={article.nom}
                        className="img-fluid"
                        style={{
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span className="text-muted">Aucune image</span>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <h2 className="h5">{article.nom}</h2>

                    <p>
                      Prix unitaire :{" "}
                      {article.prixUnitaire !== null
                        ? `${article.prixUnitaire.toFixed(2)} $`
                        : "Prix indisponible"}
                    </p>

                    {/* Quantité et boutons de modification du panier. */}
                    <div className="d-flex align-items-center gap-2">
                      <span>Quantité :</span>

                      <button
                        type="button"
                        className="btn bouton-panier bouton-quantite"
                        aria-label={`Diminuer la quantité de ${article.nom}`}
                        disabled={article.quantite <= 1}
                        onClick={() =>
                          modifierQuantite(
                            article.produitId,
                            article.quantite - 1,
                          )
                        }
                      >
                        <span className="symbole-quantite" aria-hidden="true">
                          −
                        </span>
                      </button>

                      <span>{article.quantite}</span>

                      <button
                        type="button"
                        className="btn bouton-panier bouton-quantite"
                        aria-label={`Augmenter la quantité de ${article.nom}`}
                        onClick={() =>
                          modifierQuantite(
                            article.produitId,
                            article.quantite + 1,
                          )
                        }
                      >
                        <span className="symbole-quantite" aria-hidden="true">
                          +
                        </span>
                      </button>

                      <button
                        type="button"
                        className="btn bouton-panier bouton-retirer"
                        onClick={() => retirerArticle(article.produitId)}
                      >
                        Retirer
                      </button>
                    </div>

                    {!article.disponible && (
                      <p className="text-danger mt-2 mb-0">
                        Article indisponible pour la quantité demandée.
                      </p>
                    )}
                  </div>

                  <div className="col-12 col-md-4 text-md-end">
                    <p className="fw-bold mb-0">
                      Sous-total :{" "}
                      {article.totalLigne !== null
                        ? `${article.totalLigne.toFixed(2)} $`
                        : "Non calculable"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PagePanier;
