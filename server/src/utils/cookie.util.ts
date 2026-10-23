import { Response } from "express";

/**
 * Module qui permet d'associer un token creer pour un utilisateur a la res: Response
 * a partir de l'appel initial
 *
 * @author Martin Ore Rodriguez
 */

const DUREE_COOKIE_MS = parseInt(process.env.COOKIE_MAX_AGE as string);

/**
 * Fonction qui associe le token creer a la reponse https/http
 *
 * @param res Response de la fonction d'appel initiale
 * @param token token cree dans la fonction d'appel initiale
 */
export function envoyerCookieToken(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: DUREE_COOKIE_MS,
  });
}
