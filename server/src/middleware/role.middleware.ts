import { NextFunction, Request, Response } from "express";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";

/**
 * Fonction qui permet de donner acces a la prochaine etape de la route si le role de l'utilisateur
 * concorde avec celui donneen parametre
 *
 * rappel hhtps response :
 *  - 401 : unauthorized
 *  - 403 : forbidden
 *
 * @param rolesAutorises liste de tous les roles existants possible
 * @returns acces a la fonction suivante: next()
 *
 * @author Martin Ore Rodriguez
 */

/**
 * Fonction qui permet de valider l'authentification de l'utilisateur et l'acces a des routes APIs selon ron role
 *
 * @param rolesAutorises table de roles possibles
 * @returns next()
 *
 * @author Martin Ore Rodriguez
 */
export function requireRole(...rolesAutorises: UtilisateurRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: "Non authentifié",
      });
      return;
    }
    if (!rolesAutorises.includes(req.user.role)) {
      res.status(403).json({
        mesage: "Accès refusé",
      });
    }

    next();
  };
}
