import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../db/mongo.js";
import { Utilisateur } from "../models/utilisateur.model.js";
import { MyTokenPayload } from "../interfaces/tokenPayload.interface.js";
import { Collection } from "../types/colllectionNoms.type.js";

/**
 * Ce script permet de :
 *  -> creerToken() : creer un token pour un utilisateur et retourne le token signe
 *  -> authentitiferUtilisateur() : retourn le token et l'utilisateur public (sans mot de passe)
 *
 * @author Martin Ore Rodriguez
 */

const DUREE_TOKEN = "1h";

/**
 * fonction qui permet de creer un token pour un utilisateur
 *
 * @param utilisateur objet Utilisateur
 * @returns le token signe : string
 *
 * @author Martin Ore Rodriguez
 */
export function creerToken(utilisateur: Utilisateur): string {
  // ce qui etre contenu dans un token
  const payload: MyTokenPayload = {
    id: utilisateur._id!.toString(),
    role: utilisateur.role,
  };

  // creation du token signe
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: DUREE_TOKEN,
  });
}

/**
 * fonction qui retourne le token et l'utilisateur (sans son mot de passe)
 *
 * @param courriel
 * @param motDePasse
 * @returns le token et l'utilisateur public si les identifiants sont valides (courriel et mot de passe)
 *
 * @author Martin Ore Rodriguez
 */
export async function authentifierUtilisateur(
  courriel: string,
  motDePasse: string,
) {
  const utilisateur = await getDb()
    .collection<Utilisateur>(Collection.UTILISATEURS)
    .findOne({ courriel: courriel.trim().toLowerCase() });

  // verification si le courriel de l'utilisateur existe dans la DB
  if (!utilisateur) {
    return null;
  }

  // comparaison entre le mot de passe fourni et celui provenant de la DB qui est encrypte
  const isMotDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.motDePasseHash,
  );

  if (!isMotDePasseValide) {
    return null;
  }

  // _hash : on retire cet element d'utilisateur
  // ...utilisateurPublic : on ramene toutes les autres informations
  const { motDePasseHash: _hash, ...utilisateurPublic } = utilisateur;

  return {
    token: creerToken(utilisateur), // token en soit
    utilisateur: utilisateurPublic, // un utilisateur sans son mot de passe
  };
}
