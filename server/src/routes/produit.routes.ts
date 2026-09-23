import { Router } from "express";
import { obtenirProduits } from "../controllers/produit.controller.js";

const produitRouter = Router();

/**
 * GET /api/produits
 *
 * Retourne la liste de tous les produits actifs.
 *
 * auteur: Amir
 */
produitRouter.get("/", obtenirProduits);

export default produitRouter;
