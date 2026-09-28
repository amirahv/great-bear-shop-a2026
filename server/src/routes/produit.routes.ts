import { Router } from "express";
import {
  supprimerProduit,
  modifierProduit,
  ajouterProduit,
  obtenirProduitParId,
  obtenirProduits,
} from "../controllers/produit.controller.js";

const produitRouter = Router();

/**
 * GET /api/produits
 *
 * Retourne la liste de tous les produits actifs.
 */
produitRouter.get("/", obtenirProduits);

/**
 * GET /api/produits/:id
 *
 * Retourne un produit actif à partir de son identifiant MongoDB.
 */
produitRouter.get("/:id", obtenirProduitParId);

/**
 * POST /api/produits
 *
 * Crée un nouveau produit.
 */
produitRouter.post("/", ajouterProduit);

/**
 * PUT /api/produits/:id
 *
 * Modifie complètement un produit existant.
 */
produitRouter.put("/:id", modifierProduit);

/**
 * DELETE /api/produits/:id
 *
 * Désactive un produit sans le supprimer définitivement de MongoDB (suppression logique).
 */
produitRouter.delete("/:id", supprimerProduit);

export default produitRouter;
