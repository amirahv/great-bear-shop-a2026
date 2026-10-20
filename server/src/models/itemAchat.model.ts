import { ObjectId } from "mongodb";

export interface ItemAchat {
  produitId: ObjectId;
  quantite: number;
  prix: number;
}
