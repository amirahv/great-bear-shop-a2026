import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import { MyTokenPayload } from "../interfaces/tokenPayload.interface.js";
import { ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur.model.js";
import { Collection } from "../types/colllectionNoms.type.js";

/**
 * Fonction qui va valider que l'id de l'utilisateur hash dans le jwt correspond bel et bien a un utilisateur de la collection
 *  Rappel reponse HTTPS :
 *    -> 401 : unauthorized
 *
 * @param req associe l'utilisateur identifie au Request
 * @param res message d'erreur si token non authentifie
 * @param next continuite de l'appel de l'API
 *
 * @author Martin Ore Rodriguez
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies.token;

  // verfication que le token est present dans la requete
  if (!token) {
    res.status(401).json({
      message: "Token manquant",
    });

    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as MyTokenPayload;

    // on recupere l'utilisateur sans son mot de passe
    const utilisateur = await getDb()
      .collection<Utilisateur>(Collection.UTILISATEURS)
      .findOne(
        { _id: new ObjectId(decoded.id) },
        { projection: { motDePasseHash: 0 } },
      );

    if (!utilisateur) {
      res.status(401).json({
        message: "Utilisateur introuvable",
      });

      return;
    }

    req.user = utilisateur;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
}
