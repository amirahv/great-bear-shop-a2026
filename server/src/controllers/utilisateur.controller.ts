import { Collection, ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur.model.js";

/**
 * Developpement du controller pour la collection "utilisateur" dans "GreatBearShop"
 * Fonctions initiales: CRUD
 * @author Martin Ore Rodriguez
 */

/**
 * CREATE
 * Function qui ajoute un nouvel utilisateur dans la collection "utilisateurs"
 * @param collection utilisateurs
 * @param utilisateur nouvel utilisateur a ajouter dans la collection
 */
export async function createUtilisateur(
  collection: Collection<Utilisateur>,
  utilisateur: Utilisateur,
) {
  await collection.insertOne(utilisateur);
}

// READ
// Fonction qui retourne tous les utilisateurs de la collection "utilisateurs"
// definir quelles informations sont a retourner!!
export async function getUtilisateurs(
  collection: Collection<Utilisateur>,
): Promise<Utilisateur[]> {
  return await collection.find().toArray();
}

// READ
// Fonction qui retourne un utilisateur specifique par son Id
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
export async function supprimerUtilisateur(
  collection: Collection<Utilisateur>,
  id: string,
) {
  await collection.deleteOne({ _id: new Object(id) });
}
