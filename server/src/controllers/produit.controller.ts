import type { Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import type { Produit } from "../models/produit.model.js";
import { ObjectId } from "mongodb";

/**
 * Récupère tous les produits actifs dans MongoDB.
 *
 * @param _req - Requête Express. Elle n'est pas utilisée par ce contrôleur.
 * @param res - Réponse Express envoyée au client.
 *
 * auteur: Amir
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

/**
 * Récupère un produit actif à partir de son identifiant MongoDB.
 *
 * @param req - Requête Express contenant l'identifiant dans req.params.id.
 * @param res - Réponse Express envoyée au client.
 *
 * auteur: Amir
 */
export async function obtenirProduitParId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: "L'identifiant du produit est invalide.",
      });
      return;
    }

    const produit = await getDb()
      .collection<Produit>("produits")
      .findOne({
        _id: new ObjectId(id),
        actif: true,
      });

    if (!produit) {
      res.status(404).json({
        message: "Produit introuvable.",
      });
      return;
    }

    res.status(200).json(produit);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);

    res.status(500).json({
      message: "Impossible de récupérer le produit.",
    });
  }
}
