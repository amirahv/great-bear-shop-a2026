import { Router } from "express";
import {
  reactiverProduit,
  supprimerProduit,
  modifierProduit,
  ajouterProduit,
  obtenirProduitParId,
  obtenirProduits,
} from "../controllers/produit.controller.js";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";

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
 * Crée un nouveau produit par un administrateur. Le produit est actif par défaut.
 */
produitRouter.post(
  "/",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  ajouterProduit,
);

/**
 * PUT /api/produits/:id
 *
 * Modifie complètement un produit existant par un administrateur.
 */
produitRouter.put(
  "/:id",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  modifierProduit,
);

/**
 * DELETE /api/produits/:id
 *
 * Désactive un produit sans le supprimer définitivement de MongoDB (suppression logique)
 * par un administrateur.
 */
produitRouter.delete(
  "/:id",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  supprimerProduit,
);

/**
 * PATCH /api/produits/:id/reactiver
 *
 * Réactive un produit précédemment désactivé par un administrateur.
 */
produitRouter.patch(
  "/:id/reactiver",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  reactiverProduit,
);

export default produitRouter;
