import type { ObjectId } from "mongodb";

export interface ArticlePanier {
  produitId: ObjectId;
  quantite: number;
}

export interface Panier {
  _id?: ObjectId;
  utilisateurId: ObjectId;
  articles: ArticlePanier[];
  dateModification: Date;
}
