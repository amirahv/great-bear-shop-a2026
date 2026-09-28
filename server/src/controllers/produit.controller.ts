import type { Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import type { CategorieProduit, Produit } from "../models/produit.model.js";
import { ObjectId } from "mongodb";

/**
 * Vérifie si une valeur correspond à une catégorie de produit acceptée.
 *
 * @param valeur - Valeur à vérifier.
 * @returns true si la valeur est une catégorie valide.
 *
 * @auteur Amir
 */
function estCategorieProduit(valeur: unknown): valeur is CategorieProduit {
  const categoriesValides: CategorieProduit[] = [
    "livre",
    "vetement",
    "sirop-erable",
  ];

  return (
    typeof valeur === "string" &&
    categoriesValides.some((categorie) => categorie === valeur)
  );
}

/**
 * Récupère tous les produits actifs dans MongoDB.
 *
 * @param _req - Requête Express. Elle n'est pas utilisée par ce contrôleur.
 * @param res - Réponse Express envoyée au client.
 *
 * @auteur Amir
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
 * @auteur Amir
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

/**
 * Crée un nouveau produit dans MongoDB.
 *
 * Les champs techniques actif, dateCreation et dateModification
 * sont ajoutés automatiquement par le serveur.
 *
 * @param req - Requête Express contenant le nouveau produit dans req.body.
 * @param res - Réponse Express envoyée au client.
 *
 * @auteur Amir
 */
export async function ajouterProduit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({
        message: "Le corps de la requête doit être un objet JSON.",
      });
      return;
    }

    const {
      nom,
      description,
      categorie,
      prix,
      stock,
      images,
      caracteristiques,
    } = req.body as Record<string, unknown>;

    if (!estCategorieProduit(categorie)) {
      res.status(400).json({
        message: "La catégorie du produit est invalide.",
      });
      return;
    }

    if (
      typeof nom !== "string" ||
      nom.trim() === "" ||
      (description !== undefined && typeof description !== "string") ||
      typeof prix !== "number" ||
      !Number.isFinite(prix) ||
      prix < 0 ||
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Array.isArray(images) ||
      !images.every((image) => typeof image === "string") ||
      !caracteristiques ||
      typeof caracteristiques !== "object" ||
      Array.isArray(caracteristiques)
    ) {
      res.status(400).json({
        message: "Les données du produit sont invalides.",
      });
      return;
    }

    const maintenant = new Date();

    // Utiliser toutes les propriétés de Produit, sauf _id.
    const nouveauProduit: Omit<Produit, "_id"> = {
      nom: nom.trim(),
      description:
        typeof description === "string" ? description.trim() : undefined,
      categorie,
      prix,
      stock,
      images: images as string[],
      caracteristiques: caracteristiques as Produit["caracteristiques"],
      actif: true,
      dateCreation: maintenant,
      dateModification: maintenant,
    };

    const resultat = await getDb()
      .collection<Produit>("produits")
      .insertOne(nouveauProduit);

    res.status(201).json({
      _id: resultat.insertedId,
      // ... copie toutes les propriétés de nouveauProduit dans la réponse.
      ...nouveauProduit,
    });
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);

    res.status(500).json({
      message: "Impossible de créer le produit.",
    });
  }
}
