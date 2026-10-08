import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Panier } from "../models/panier.model.js";

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
