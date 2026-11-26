
import { useEffect, useState } from "react";
import "./PagePanier.css";
import panierTemporaire, {
  type ArticlePanierDetaille,
} from "../data/panierTemporaire";

const CLE_PANIER = "greatBearPanier";

/**
 * Affiche les articles du panier et permet de modifier leurs quantités
 * ou de les retirer.
 */
function PagePanier() {
  // Récupère le panier sauvegardé ou utilise les articles temporaires.
  const [articles, setArticles] = useState<ArticlePanierDetaille[]>(() => {
    const sauvegarde = localStorage.getItem(CLE_PANIER);

    if (sauvegarde !== null) {
      try {
        return JSON.parse(sauvegarde) as ArticlePanierDetaille[];
      } catch {
        return panierTemporaire;
      }
    }

    return panierTemporaire;
  });

  // Sauvegarde automatiquement chaque modification du panier.
  useEffect(() => {
    localStorage.setItem(CLE_PANIER, JSON.stringify(articles));
  }, [articles]);

  /**
   * Retire un article du panier.
   */
  function retirerArticle(produitId: string) {
    setArticles((articlesActuels) =>
      articlesActuels.filter((article) => article.produitId !== produitId),
    );
  }

  /**
   * Modifie la quantité d'un article et recalcule son montant.
   */
  function modifierQuantite(produitId: string, nouvelleQuantite: number) {
    if (!Number.isSafeInteger(nouvelleQuantite) || nouvelleQuantite < 1) {
      return;
    }

    setArticles((articlesActuels) =>
      articlesActuels.map((article) => {
        if (article.produitId !== produitId) {
          return article;
        }

        const prixEnCentimes =
          article.prixUnitaire !== null
            ? Math.round(article.prixUnitaire * 100)
            : null;

        return {
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

  // Calcule le sous-total global en centimes.
  let sousTotalEnCentimes: number | null = 0;

  for (const article of articles) {
    if (article.totalLigne === null) {
      sousTotalEnCentimes = null;
      break;
    }

    sousTotalEnCentimes += Math.round(article.totalLigne * 100);
  }

  return (
    <div className="page-panier">
      <div className="container py-5">
        <h1 className="mb-4">Le panier</h1>

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

        {articles.length > 0 && (
          <div className="border-top pt-3 mt-4 text-end">
            <p className="fs-5 fw-bold mb-1">
              Sous-total du panier :{" "}
              {sousTotalEnCentimes !== null
                ? `${(sousTotalEnCentimes / 100).toFixed(2)} $`
                : "Non calculable"}
            </p>

            <p className="text-muted mb-0">
              Avant taxes et frais de livraison.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PagePanier;
