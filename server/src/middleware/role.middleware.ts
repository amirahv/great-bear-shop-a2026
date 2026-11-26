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
 * P1: Corriger le contrôle des rôles.
 * Le changement essentiel est le return; après le refus 403.
 * Sans lui, le programme poursuivait son exécution jusqu’à next().
 *
 * Autorise l'accès uniquement aux utilisateurs possédant un rôle permis.
 *
 * @author Amir
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
        message: "Accès refusé",
      });

      // Arrête le traitement : le contrôleur ne doit pas être exécuté.
      return;
    }

    // Continue uniquement si l'utilisateur possède un rôle autorisé.
    next();
  };
}
