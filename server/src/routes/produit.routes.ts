import { Router } from "express";
import {
  obtenirProduitParId,
  obtenirProduits,
} from "../controllers/produit.controller.js";

const produitRouter = Router();

/**
 * GET /api/produits
 *
 * Retourne la liste de tous les produits actifs.
 *
 * auteur: Amir
 */
produitRouter.get("/", obtenirProduits);

/**
 * GET /api/produits/:id
 *
 * Retourne un produit actif à partir de son identifiant MongoDB.
 *
 * auteur: Amir
 */
produitRouter.get("/:id", obtenirProduitParId);

export default produitRouter;
