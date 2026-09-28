import { ObjectId } from "mongodb";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";
import { Adresse } from "../types/adresse.type.js";

// TODO : il faudra definir ce qu'un panier contiendra comme 'ItemPanier'
// --> Voir avec Amir comment il a organise le panier pour definir un ItemPanier

export interface Utilisateur {
  _id?: ObjectId;
  nom: string;
  prenom: string;
  courriel: string;
  motDePasseHash: string;
  role: UtilisateurRole;
  adresse?: Adresse[];
  dateCreation: Date;
  //panier: ItemPanier[]
}
