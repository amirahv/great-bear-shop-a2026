import type { Request, Response } from "express";
import { MongoServerError, ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { ArticlePanier, Panier } from "../models/panier.model.js";
import type { Produit } from "../models/produit.model.js";

type DonneesArticlePanier = {
  produitId: string;
  quantite: number;
};

/**
 * Vérifie les données reçues pour un article du panier.
 *
 * @param valeur - Données à vérifier.
 * @returns true si le produitId et la quantité sont valides.
 * @author Amir
 */
function estDonneesArticlePanierValides(
  valeur: unknown,
): valeur is DonneesArticlePanier {
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) {
    return false;
  }

  const donnees = valeur as Record<string, unknown>;

  return (
    typeof donnees.produitId === "string" &&
    ObjectId.isValid(donnees.produitId) &&
    typeof donnees.quantite === "number" &&
    Number.isSafeInteger(donnees.quantite) &&
    donnees.quantite > 0
  );
}

/**
 * Récupère le panier de l'utilisateur connecté.
 *
 * L'identifiant doit être fourni par le middleware
 * d'authentification dans res.locals.utilisateurId.
 *
 * @param _req - Requête Express.
 * @param res - Réponse Express envoyée au client.
 * @author Amir
 */
export async function obtenirPanier(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId: unknown = res.locals.utilisateurId;

    if (typeof utilisateurId !== "string" || !ObjectId.isValid(utilisateurId)) {
      res.status(401).json({
        message: "Vous devez être connecté pour consulter votre panier.",
      });
      return;
    }

    const panier = await getDb()
      .collection<Panier>("paniers")
      .findOne({
        utilisateurId: new ObjectId(utilisateurId),
      });

    if (!panier) {
      res.status(404).json({
        message: "Aucun panier trouvé pour cet utilisateur.",
      });
      return;
    }

    res.status(200).json(panier);
  } catch (error) {
    console.error("Erreur lors de la récupération du panier :", error);

    res.status(500).json({
      message: "Impossible de récupérer le panier.",
    });
  }
}

/**
 * Ajoute un produit au panier de l'utilisateur connecté.
 * Si le produit est déjà présent, augmente sa quantité.
 * Crée le panier si nécessaire.
 *
 * @param req - Requête contenant produitId et quantite dans req.body.
 * @param res - Réponse contenant l'identifiant utilisateur dans res.locals.
 * @author Amir
 */
export async function ajouterArticlePanier(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId: unknown = res.locals.utilisateurId;

    if (typeof utilisateurId !== "string" || !ObjectId.isValid(utilisateurId)) {
      res.status(401).json({
        message: "Vous devez être connecté pour modifier votre panier.",
      });
      return;
    }

    const donnees: unknown = req.body;

    if (!estDonneesArticlePanierValides(donnees)) {
      res.status(400).json({
        message: "Le produitId ou la quantité est invalide.",
      });
      return;
    }

    const produitId = new ObjectId(donnees.produitId);
    const proprietaireId = new ObjectId(utilisateurId);

    // Vérifie que le produit existe et qu'il est actif.
    const produit = await getDb()
      .collection<Produit>("produits")
      .findOne({ _id: produitId, actif: true });

    if (!produit) {
      res.status(404).json({
        message: "Produit introuvable ou indisponible.",
      });
      return;
    }

    const collectionPaniers = getDb().collection<Panier>("paniers");
    const panier = await collectionPaniers.findOne({
      utilisateurId: proprietaireId,
    });

    // Copie les articles pour conserver l'état initial du panier.
    const articles: ArticlePanier[] = panier
      ? panier.articles.map((article) => ({ ...article }))
      : [];

    const articleExistant = articles.find((article) =>
      article.produitId.equals(produitId),
    );

    const quantiteFinale =
      (articleExistant ? articleExistant.quantite : 0) + donnees.quantite;

    // Vérifie la quantité totale, y compris celle déjà dans le panier.
    if (
      !Number.isSafeInteger(quantiteFinale) ||
      quantiteFinale > produit.stock
    ) {
      res.status(400).json({
        message: "La quantité demandée dépasse le stock disponible.",
      });
      return;
    }

    // Met à jour la quantité si l'article existe, sinon ajoute un nouvel article.
    if (articleExistant) {
      articleExistant.quantite = quantiteFinale;
    } else {
      articles.push({
        produitId,
        quantite: donnees.quantite,
      });
    }

    const maintenant = new Date();

    if (!panier) {
      const nouveauPanier: Panier = {
        utilisateurId: proprietaireId,
        articles,
        dateModification: maintenant,
      };

      const resultat = await collectionPaniers.insertOne(nouveauPanier);

      // Retourne le panier nouvellement créé avec l'identifiant généré par MongoDB.
      res.status(201).json({
        ...nouveauPanier,
        _id: resultat.insertedId,
      });
      return;
    }

    // Met à jour seulement si les articles n'ont pas changé entre-temps.
    const resultat = await collectionPaniers.updateOne(
      {
        _id: panier._id,
        articles: panier.articles,
      },
      {
        $set: {
          articles,
          dateModification: maintenant,
        },
      },
    );

    /**
     * Si aucun document n'a été mis à jour (resultat.matchedCount === 0), cela signifie que le panier a été modifié
     * par une autre requête entre le moment où nous l'avons lu et celui où nous avons tenté de le mettre à jour.
     * Dans ce cas, nous renvoyons un code 409 (Conflict) pour indiquer au client qu'il doit réessayer.
     */
    if (resultat.matchedCount === 0) {
      res.status(409).json({
        message: "Le panier a changé. Veuillez réessayer.",
      });
      return;
    }

    res.status(200).json({
      ...panier,
      articles,
      dateModification: maintenant,
    });
  } catch (error) {
    // Deux demandes peuvent tenter de créer le même panier simultanément.
    if (error instanceof MongoServerError && error.code === 11000) {
      res.status(409).json({
        message: "Le panier vient d'être créé. Veuillez réessayer.",
      });
      return;
    }

    console.error("Erreur lors de l'ajout au panier :", error);

    res.status(500).json({
      message: "Impossible d'ajouter l'article au panier.",
    });
  }
}
