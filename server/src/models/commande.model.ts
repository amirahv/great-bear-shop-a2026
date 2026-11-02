import { ObjectId } from "mongodb";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Adresse } from "../types/adresse.type.js";
import { ItemAchat } from "./itemAchat.model.js";

/**
 * Ce modele represente une commande passe par un utilisateur
 *
 * @author Martin Ore Rodriguez
 */

export interface Commande {
  _id?: ObjectId;
  utilisateurId: ObjectId;
  achat: ItemAchat[];
  destination: Adresse;
  statut: StatutCommande;
  prixTotalAvantTaxes: number;
  prixTotalApresTaxes: number;
  dateAchat: Date;
  dateModification: Date;
}
