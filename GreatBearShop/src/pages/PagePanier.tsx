import { useEffect, useState } from "react";
import "./PagePanier.css";
import type { ArticlePanierDetaille } from "../data/panierTemporaire";

/**
 * Affiche le panier de l'utilisateur connecté à partir des données du backend.
 *
 * @author Amir
 */
function PagePanier() {
  const [articles, setArticles] = useState<ArticlePanierDetaille[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  // Affiche les erreurs de modification sans masquer le panier.
  const [erreurModification, setErreurModification] = useState("");
  // Désactive les boutons pendant une modification du panier.
  const [modificationEnCours, setModificationEnCours] = useState(false);

  useEffect(() => {
    let actif = true;

    /**
     * Récupère le panier associé au cookie de connexion du navigateur.
     * Un utilisateur sans panier est affiché avec une liste vide.
     *
     * @author Amir
     */
    async function chargerPanier() {
      try {
        const reponse = await fetch("http://localhost:4000/api/panier", {
          credentials: "include",
        });

        if (reponse.status === 401) {
          throw new Error("Connectez-vous pour consulter votre panier.");
        }

        // Le backend retourne 404 si cet utilisateur n'a pas encore de panier.
        if (reponse.status === 404) {
          if (actif) {
            setArticles([]);
          }
          return;
        }

        const donnees = await reponse.json();

        if (!reponse.ok) {
          throw new Error(
            donnees.message || "Impossible de charger le panier.",
          );
        }

        if (actif) {
          setArticles(donnees.articles);
        }
      } catch (error) {
        if (actif) {
          setErreur(
            error instanceof Error
              ? error.message
              : "Impossible de charger le panier.",
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void chargerPanier();

    return () => {
      actif = false;
    };
  }, []); // Lance l'effet au montage du composant.

  /**
   * Supprime un article dans le panier de l'utilisateur connecté.
   * Actualise l'affichage après la confirmation du serveur.
   *
   * @param produitId - Identifiant du produit à retirer.
   * @author Amir
   */
  async function retirerArticle(produitId: string) {
    if (modificationEnCours) {
      return;
    }

    setErreurModification("");
    setModificationEnCours(true);

    try {
      const reponse = await fetch(
        `http://localhost:4000/api/panier/articles/${encodeURIComponent(produitId)}`,
        {
          method: "DELETE",

          // Envoie le cookie permettant au serveur d'identifier l'utilisateur.
          credentials: "include",
        },
      );

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(donnees.message || "Impossible de retirer l'article.");
      }

      // Retire l'article affiché uniquement si le serveur confirme la suppression.
      // Le sous-total est recalculé lors du nouvel affichage du composant.
      setArticles((articlesActuels) =>
        articlesActuels.filter((article) => article.produitId !== produitId),
      );
    } catch (error) {
      // Conserve les articles affichés lorsque la suppression échoue.
      setErreurModification(
        error instanceof Error
          ? error.message
          : "Impossible de joindre le serveur.",
      );
    } finally {
      setModificationEnCours(false);
    }
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

  // Additionne les montants des articles en centimes.
  // Si un montant manque, le sous-total ne peut pas être calculé.
  let sousTotalEnCentimes: number | null = 0;

  for (const article of articles) {
    if (article.totalLigne === null) {
      sousTotalEnCentimes = null;
      break;
    }

    sousTotalEnCentimes += Math.round(article.totalLigne * 100);
  }

  if (chargement) {
    return <p className="container py-5">Chargement du panier…</p>;
  }

  if (erreur) {
    return (
      <div className="container py-5">
        <p className="alert alert-danger" role="alert">
          {erreur}
        </p>
      </div>
    );
  }

  return (
    <div className="page-panier">
      <div className="container py-5">
        <h1 className="mb-4">Le panier</h1>

        {/* Conserve le panier visible pour permettre une nouvelle tentative. */}
        {erreurModification && (
          <p className="alert alert-danger" role="alert">
            {erreurModification}
          </p>
        )}

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
                        disabled={modificationEnCours || article.quantite <= 1}
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
                        disabled={modificationEnCours}
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
                        disabled={modificationEnCours}
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
        {/* Sous-total global, affiché uniquement si le panier contient des articles. */}
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
