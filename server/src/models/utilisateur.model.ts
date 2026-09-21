import { ObjectId } from "mongodb";
import { UtilisateurRole } from "../types/utilisateur-role.types.js";
import { Adresse } from "../types/adresse.types.js";

export interface Utilisateur {
  _id?: ObjectId;
  nom: string;
  prenom: string;
  courriel: string;
  motDePasseHash: string;
  role: UtilisateurRole;
  adresse?: Adresse[];
  dateCreation: Date;
}
