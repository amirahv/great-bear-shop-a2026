import { ObjectId } from "mongodb";

/**
 * Ce modele represente un item achete par un utilisateur.
 * Dans le modele Commande, il est utilise comme -> achat: ItemAchat[]
 *
 * @author Martin Ore Rodriguez
 */

export interface ItemAchat {
  produitId: ObjectId;
  quantite: number;
  prix: number;
}
