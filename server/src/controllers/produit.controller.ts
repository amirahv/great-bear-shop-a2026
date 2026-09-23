import type { Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import type { Produit } from "../models/produit.model.js";

/**
 * Récupère tous les produits actifs dans MongoDB.
 *
 * @param _req - Requête Express. Elle n'est pas utilisée par ce contrôleur.
 * @param res - Réponse Express envoyée au client.
 */
export async function obtenirProduits(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const produits = await getDb()
      .collection<Produit>("produits")
      .find({ actif: true })
      .toArray();

    res.status(200).json(produits);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);

    res.status(500).json({
      message: "Impossible de récupérer les produits.",
    });
  }
}
