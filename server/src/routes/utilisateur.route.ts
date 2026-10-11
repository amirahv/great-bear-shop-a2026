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
 * GET /api/utilisateurs/
 *
 * Retourne la liste de tous les utilisateurs sans leur mot de passe
 */
utilisateurRouter.get("/", getTousUtilisateurs);

/**
 * GET /api/utilisateurs/:id
 *
 * Retourne un utilisateur spécifique trouvé par son identifiant MongoDB sans son mot de passe
 */
utilisateurRouter.get("/:id", getUtilisateurParId);

/**
 * GET /api/utilisateurs/courriel/:courriel
 *
 * Retourne un utilisateur spécifique trouvé par son courriel dans la collection "utilisateurs" sans son mot de passe
 */
utilisateurRouter.get("/courriel/:courriel", getUtilisateurParCourriel);

/**
 * POST /api/utilisateurs/
 *
 * Crée un nouvel utilisateur client dans la collection "utilisateurs" avec un mot de passe haché
 */
utilisateurRouter.post("/", ajouterUtilisateurClient);

/**
 * PUT /api/utilisateurs/:id
 *
 * Met à jour un utilisateur spécifique trouvé par son identifiant MongoDB
 */
utilisateurRouter.put("/:id", updateUtilisateurParId);

/**
 * DELETE /api/utilisateurs/:id
 *
 * Supprime un utilisateur spécifique trouvé par son identifiant MongoDB
 */
utilisateurRouter.delete("/:id", deleteUtilisateurParId);

export default utilisateurRouter;
