import { Utilisateur } from "../models/utilisateur.model.js";

/**
 * Permet d'ajouter la propriete "user" a l'objet Request d'Express
 *
 * Permet d'ajouter le middleware JWT apres verification du token
 * Permet d'acceder a l'utilisateur connecte dans les routes protegees
 *
 * @author Martin Ore Rodriguez
 */

declare global {
  namespace Express {
    interface Request {
      user?: Utilisateur;
    }
  }
}
