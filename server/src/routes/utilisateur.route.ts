import { Router } from "express";
import {
  ajouterUtilisateurClient,
  getTousUtilisateurs,
  getUtilisateurParId,
  getUtilisateurParCourriel,
  updateUtilisateurParId,
  deleteUtilisateurParId,
} from "../controllers/utilisateur.controller.js";
import { login, logout } from "../controllers/authentication.controller.js";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";

/**
 * Definition des routes pour le controller des Utilisateurs
 *
 * @author Martin Ore Rodriguez
 */

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
 * L'utilisateur doit etre connecte et doit etre un ADMIN pour utiliser l'API
 */
utilisateurRouter.get(
  "/lister",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  getTousUtilisateurs,
);

/**
 * GET /api/utilisateurs/chercher/identifiant/:id
 *
 * Retourne un utilisateur spécifique trouvé par son identifiant MongoDB sans son mot de passe
 * L'utilisateur doit etre connecte et doit etre un ADMIN pour utiliser l'API
 */
utilisateurRouter.get(
  "/chercher/identifiant/:id",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  getUtilisateurParId,
);

/**
 * GET /api/utilisateurs/chercher/courriel/:courriel
 *
 * Retourne un utilisateur spécifique trouvé par son courriel dans la collection "utilisateurs" sans son mot de passe
 * L'utilisateur doit etre connecte et doit etre un ADMIN pour utiliser l'API
 */
utilisateurRouter.get(
  "/chercher/courriel/:courriel",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  getUtilisateurParCourriel,
);

/**
 * PUT /api/utilisateurs/actualiser/:id
 *
 * Met à jour un utilisateur spécifique trouvé par son identifiant MongoDB
 * L'utilisateur doit etre connecte et doit etre un CLIENT pour utiliser l'API
 */
utilisateurRouter.put(
  "/actualiser/:id",
  authenticateToken,
  requireRole(UtilisateurRole.CLIENT),
  updateUtilisateurParId,
);

/**
 * DELETE /api/utilisateurs/supprimer/:id
 *
 * Supprime un utilisateur spécifique trouvé par son identifiant MongoDB
 * L'utilisateur doit etre connecte et doit etre un ADMIN pour utiliser l'API
 */
utilisateurRouter.delete(
  "/supprimer/:id",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  deleteUtilisateurParId,
);

/**
 * POST /api/utilisateurs/login
 *
 * Valide la concordance entre courriel et mot de passe. Si valide, renvoie le token et permet la connexion
 */
utilisateurRouter.post("/login", login);

/**
 * POST /api/utilisateurs/logout
 *
 * Deconnexion de l'utilisateur et suppression du token de l'utilisateur
 */
utilisateurRouter.post("/logout", logout);

export default utilisateurRouter;
