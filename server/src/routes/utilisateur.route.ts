import { Router } from "express";
import {
  ajouterUtilisateurClient,
  getTousUtilisateurs,
  getUtilisateurParId,
  getUtilisateurParCourriel,
  updateUtilisateurParId,
  deleteUtilisateurParId,
} from "../controllers/utilisateur.controller.js";

const utilisateurRouter = Router();

/**
 * POST /api/utilisateurs/ajouter
 *
 * Crée un nouvel utilisateur client dans la collection "utilisateurs" avec un mot de passe hash et role client
 */
utilisateurRouter.post("/ajouter", ajouterUtilisateurClient);

/**
 * GET /api/utilisateurs/lister
 *
 * Retourne la liste de tous les utilisateurs sans leur mot de passe
 */
utilisateurRouter.get("/lister", getTousUtilisateurs);

/**
 * GET /api/utilisateurs/chercher/:id
 *
 * Retourne un utilisateur spécifique trouvé par son identifiant MongoDB sans son mot de passe
 */
utilisateurRouter.get("/chercher/:id", getUtilisateurParId);

/**
 * GET /api/utilisateurs/chercher/courriel
 *
 * Retourne un utilisateur spécifique trouvé par son courriel dans la collection "utilisateurs" sans son mot de passe
 */
utilisateurRouter.get("/chercher/:courriel", getUtilisateurParCourriel);

/**
 * PUT /api/utilisateurs/actualiser/:id
 *
 * Met à jour un utilisateur spécifique trouvé par son identifiant MongoDB
 */
utilisateurRouter.put("/actualiser/:id", updateUtilisateurParId);

/**
 * DELETE /api/utilisateurs/supprimer/:id
 *
 * Supprime un utilisateur spécifique trouvé par son identifiant MongoDB
 */
utilisateurRouter.delete("/supprimer/:id", deleteUtilisateurParId);

export default utilisateurRouter;
