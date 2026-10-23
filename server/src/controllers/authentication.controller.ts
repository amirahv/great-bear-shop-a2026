import { Request, Response } from "express";
import { authentifierUtilisateur } from "../services/authentication.service.js";
import { envoyerCookieToken } from "../utils/cookie.util.js";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    // ?? -> si le cote gauche est null, alors on utilise le cote droit
    const { courriel, motDePasse } = req.body ?? {};

    // on verifie si courriel et motDePasse ne sont pas vide || null
    if (typeof courriel !== "string" || typeof motDePasse !== "string") {
      res.status(400).json({
        message: "Courriel et mot de passe requis",
      });
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
