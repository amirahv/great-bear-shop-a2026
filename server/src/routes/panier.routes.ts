import { Router } from "express";
import {
  obtenirPanier,
  ajouterArticlePanier,
  modifierQuantiteArticle,
} from "../controllers/panier.controller.js";

const panierRouter = Router();

/**
 * GET /api/panier
 *
 * Récupère le panier de l'utilisateur connecté.
 * L'identifiant de l'utilisateur doit être fourni par le middleware
 * d'authentification dans res.locals.utilisateurId.//////////////////////////attend Martin
 */

panierRouter.get("/", obtenirPanier);

/**
 * POST /api/panier/articles
 *
 * Ajoute un article au panier de l'utilisateur connecté.
 * L'identifiant de l'utilisateur doit être fourni par le middleware
 * d'authentification dans res.locals.utilisateurId.////////////////////////attend Martin
 */
panierRouter.post("/articles", ajouterArticlePanier);

/**
 * PATCH /api/panier/articles/:produitId
 *
 * Modifie la quantité d'un article déjà présent dans le panier.
 * L'identifiant de l'utilisateur doit être fourni par le middleware
 * d'authentification dans res.locals.utilisateurId.//////////////////////////attend Martin
 */
panierRouter.patch("/articles/:produitId", modifierQuantiteArticle);

export default panierRouter;
