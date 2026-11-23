import type { ProduitCatalogue } from "../types/produit";
import { useState } from "react";

type ProductCardProps = {
  livre: ProduitCatalogue;
};

function CarteLivre({ livre }: ProductCardProps) {
  // Gère l'attente et les messages propres à cette fiche produit.
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  /**
   * Ajoute un exemplaire du livre au panier de l'utilisateur connecté.
   *
   * @author Amir
   */
  async function ajouterAuPanier() {
    if (ajoutEnCours) {
      return;
    }

    setErreur("");
    setMessage("");
    setAjoutEnCours(true);

    try {
      const reponse = await fetch("http://localhost:4000/api/panier/articles", {
        method: "POST",

        // Transmet le cookie d'authentification de l'utilisateur.
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        // Le serveur retrouve le produit et vérifie le stock.
        body: JSON.stringify({
          produitId: livre._id,
          quantite: 1,
        }),
      });

      if (reponse.status === 401) {
        throw new Error("Connectez-vous pour ajouter un article au panier.");
      }

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(
          donnees.message || "Impossible d'ajouter ce livre au panier.",
        );
      }

      // Confirme l'ajout tout en permettant de poursuivre le magasinage.
      setMessage("Un exemplaire a été ajouté à votre panier.");
    } catch (error) {
      setErreur(
        error instanceof Error
          ? error.message
          : "Impossible de joindre le serveur.",
      );
    } finally {
      setAjoutEnCours(false);
    }
  }

  return (
    <div className="card h-100 d-flex flex-column">
      {/* IMAGE DU LIVRE */}
      <div
        style={{
          height: "250px",
          backgroundColor: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Affiche la première image enregistrée pour le produit. */}
        {livre.images.length > 0 ? (
          <img
            src={livre.images[0]}
            alt={livre.nom}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span className="text-muted">Aucune image</span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <p className="text-muted mb-1">
          {livre.caracteristiques.auteur ?? "Auteur non précisé"}
        </p>

        <h5 className="card-title">{livre.nom}</h5>

        <p className="card-text text-muted">
          Maison d'édition:{" "}
          {livre.caracteristiques.maisonEdition ?? "Non précisée"}
        </p>

        <p className="card-text text-muted">
          Année de publication:{" "}
          {livre.caracteristiques.anneePublication ?? "Non précisée"}
        </p>

        <p className="card-text text-muted">
          {livre.caracteristiques.nombrePages ?? "Nombre inconnu de"} pages
        </p>

        <p className="fw-bold">Prix: {livre.prix.toFixed(2)} $</p>

        <button
          type="button"
          className="btn btn-dark w-100 mt-auto"
          disabled={ajoutEnCours || livre.stock <= 0}
          onClick={ajouterAuPanier}
        >
          {livre.stock <= 0
            ? "Rupture de stock"
            : ajoutEnCours
              ? "Ajout en cours…"
              : "Ajouter au panier"}
        </button>

        {/* Affiche le résultat de la demande sur la fiche concernée. */}
        {erreur && (
          <p className="alert alert-danger mt-2 mb-0" role="alert">
            {erreur}
          </p>
        )}

        {message && (
          <p className="alert alert-success mt-2 mb-0" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CarteLivre;
