import { Router } from "express";
import {
  obtenirPanier,
  ajouterArticlePanier,
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

export default panierRouter;
