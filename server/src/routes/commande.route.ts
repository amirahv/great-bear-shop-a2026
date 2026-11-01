import { Router } from "express";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";
import {
  creerCommande,
  obtenirCommandeParUtilisateurId,
  obtenirToutesCommandes,
  actualiserStatutCommande,
  supprimerCommande,
} from "../controllers/commande.controller.js";

/**
 * Definition des routes pour le controller des Commandes
 *
 * @author Martin Ore Rodriguez
 */

const commandeRouter = Router();

/**
 * POST /api/commandes/creerComandes
 *
 * Creation d'une nouvelle commande
 */
commandeRouter.post(
  "/creerCommandes",
  authenticateToken,
  requireRole(UtilisateurRole.CLIENT),
  creerCommande,
);

/**
 * GET /api/commandes/commandeUtilisateur
 *
 * Permet de recuperer toutes les commandes passees pour un utilisateur specifique
 */
commandeRouter.get(
  "/commandeUtilisateur",
  authenticateToken,
  requireRole(UtilisateurRole.CLIENT),
  obtenirCommandeParUtilisateurId,
);

/**
 * GET /api/commandes/toutesLesCommandes
 *
 * Permet de recuperer toutes les commandes passees par tous les utilisateurs
 */
commandeRouter.get(
  "/toutesLesCommandes",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  obtenirToutesCommandes,
);

/**
 * PATCH /api/commandes/actualiserStatut
 *
 * Permet de mofifier le statut d'une commande specifique
 * Le nouvel statut doit etre passe dansle body de la requete
 */
commandeRouter.patch(
  "/actualiserStatut",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  actualiserStatutCommande,
);

/**
 * DELETE /api/commandes/supprimerCommande/:id
 *
 * Permet de supprimer une commande specfique par son identifiant
 */
commandeRouter.delete(
  "/supprimerCommande/:id",
  authenticateToken,
  requireRole(UtilisateurRole.ADMIN),
  supprimerCommande,
);

export default commandeRouter;
