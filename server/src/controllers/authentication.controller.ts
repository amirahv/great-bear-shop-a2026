import { Request, Response } from "express";
import { authentifierUtilisateur } from "../services/authentication.service.js";
import {
  envoyerCookieToken,
  supprimerCookieToken,
} from "../utils/cookie.util.js";

/**
 *
 * @param req le body contient le courriel et le motDePasse entree pour la connexion
 * @param res utilisateur public connecte ou message d'erreur
 * @returns token et une version de l'utilisateur sans son mot de passe
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    // ?? -> si le cote gauche est null, alors on utilise le cote droit, presque comme ternary
    const { courriel, motDePasse } = req.body ?? {};

    // on verifie si courriel et motDePasse sont des strings || null
    if (typeof courriel !== "string" || typeof motDePasse !== "string") {
      res.status(400).json({
        message: "Courriel et mot de passe requis",
      });
      return;
    }

    // appel au service ../services/authentication.service.ts
    // resultat contient : token et utilisateurPublic (sans mot de passe)
    const resultat = await authentifierUtilisateur(courriel, motDePasse);

    // courriel || motDePasse non valide
    if (!resultat) {
      res.status(401).json({
        message: "Courriel ou mot de passe invalide",
      });

      return;
    }

    // association du token au res : Response
    envoyerCookieToken(res, resultat.token);

    res.status(200).json(resultat.utilisateur);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] login() -> `, error);

    res.status(500).json({
      message: "Impossible de se connecter",
    });
  }
}

/**
 * Fonction qui permet la deconnexion d'un utilisateur
 * (pas besoin de await et Promise, car on n'attend pas un retour d'information)
 *
 * @param req Response de l'appel initial
 * @param res message validant la suppression du cookie
 */
export function logout(req: Request, res: Response): void {
  supprimerCookieToken(res);

  res.status(200).json({
    message: "Déconnexion réussie",
  });
}
