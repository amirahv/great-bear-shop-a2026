import { Collection, ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur.model.js";
import { Adresse } from "../types/adresse.type.js";
import { Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import bcrypt from "bcrypt";

/**
 * Developpement du controller pour la collection "utilisateur" dans "GreatBearShop"
 * Fonctions : CRUD
 * @author Martin Ore Rodriguez
 */

// le mot de passe hash ne doit jamais etre retourne cote client
const PROJECTION_SANS_MOT_DE_PASSE = { motdePasseHash: 0 };

// cost factor qui determine la complexite processeur pour hasher les donnees
const NOMBRE_SALT_ROUNDS = 10;

// validation simple de courriel
const REGEX_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// verifie qu'une valeur est une adresse valide
function estAdresseValide() {}

//Create
// export async function createUtilisateur(
//   collection: Collection<Utilisateur>,
//   utilisateur: Utilisateur,
// ) {
//   await collection.insertOne(utilisateur);
// }

// Create
export async function ajouterUtilisateur(
  req: Request,
  res: Response,
): Promise<void> {
  // TODO : verifier quelle valeurs inclure dans le Create
}

// READ
// Fonction qui retourne tous les utilisateurs de la collection "utilisateurs"
// TODO : definir quelles informations sont a retourner!!
export async function getUtilisateurs(
  collection: Collection<Utilisateur>,
): Promise<Utilisateur[]> {
  return await collection.find().toArray();
}

// READ
// Fonction qui retourne un utilisateur specifique par son Id
// TODO : definir quelles donnees doivent etre retournees
export async function getUtilsiateurParId(
  collection: Collection<Utilisateur>,
  id: string,
): Promise<Omit<Utilisateur, "motDePasseHash"> | null> {
  if (!ObjectId.isValid(id)) return null;

  return await collection.findOne(
    { _id: new ObjectId(id) },
    { projection: { motDePasseHash: 0 } },
  );
}

// UPDATE
// fonction qui actualise l'information d'un utilisateur
export async function actualiserUtilisateur(
  collection: Collection<Utilisateur>,
  id: string,
  nouvelUtilisateur: Utilisateur,
) {
  if (!ObjectId.isValid(id)) return null;

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: nouvelUtilisateur },
  );
}

// DELETE
// Fonction qui supprime un utilsiateur par son Id
// export async function supprimerUtilisateur(
//   collection: Collection<Utilisateur>,
//   id: string,
// ) {
//   await collection.deleteOne({ _id: new Object(id) });
// }
export function supprimerUtilisateur(
  req: Request,
  res: Response,
): Promise<void> {}
