import { ObjectId } from "mongodb";

/**
 * @author Martin Ore Rodriguez
 */

export interface ItemAchat {
  produitId: ObjectId;
  quantite: number;
  prix: number;
}
