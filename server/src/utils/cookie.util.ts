import { CookieOptions, Response } from "express";

/**
 * Module qui permet d'associer un token creer pour un utilisateur a la res: Response
 * a partir de l'appel initial
 *
 * @author Martin Ore Rodriguez
 */

// duree de vie du cookie definit dans le fichier .env
const DUREE_COOKIE_MS = parseInt(process.env.COOKIE_MAX_AGE as string);

const OPTIONS_COOKIE: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

/**
 * Fonction qui associe le token creer a la reponse https/http
 *
 * @param res Response de la fonction d'appel initiale
 * @param token token cree dans la fonction d'appel initiale
 *
 * @author Martin Ore Rodriguez
 */
export function envoyerCookieToken(res: Response, token: string) {
  res.cookie("token", token, {
    ...OPTIONS_COOKIE,
    maxAge: DUREE_COOKIE_MS,
  });
}

/**
 * Fonction qui supprime le cookie de l'utilisateur connecte,
 * signifiant sa deconnexion
 *
 * @param res Response de la foncton d'appel initiale
 *
 * @author Martin Ore Rodriguez
 */
export function supprimerCookieToken(res: Response) {
  res.clearCookie("token", OPTIONS_COOKIE);
}
