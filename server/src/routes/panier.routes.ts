import { Router } from "express";
import {
  obtenirPanier,
  ajouterArticlePanier,
  modifierQuantiteArticle,
  retirerArticlePanier,
} from "../controllers/panier.controller.js";
import { authenticateToken } from "../middleware/jwt.middleware.js";

const panierRouter = Router();

/**
 * GET /api/panier
 *
 * Récupère le panier de l'utilisateur connecté.
 * Le middleware authenticateToken valide le jeton
 * et place l'utilisateur dans req.user.
 */
panierRouter.get("/", authenticateToken, obtenirPanier);

/**
 * POST /api/panier/articles
 *
 * Ajoute un article au panier de l'utilisateur connecté.
 * Le middleware authenticateToken place l'utilisateur dans req.user.
 */
panierRouter.post("/articles", authenticateToken, ajouterArticlePanier);

/**
 * PATCH /api/panier/articles/:produitId
 *
 * Modifie la quantité d'un article dans le panier de l'utilisateur connecté.
 */
panierRouter.patch(
  "/articles/:produitId",
  authenticateToken,
  modifierQuantiteArticle,
);

/**
 * DELETE /api/panier/articles/:produitId
 *
 * Retire un article du panier de l'utilisateur connecté.
 * L'identifiant de l'utilisateur doit être fourni par le middleware
 * d'authentification dans res.locals.utilisateurId.//////////////////////////attend Martin
 */
panierRouter.delete("/articles/:produitId", retirerArticlePanier);

export default panierRouter;
