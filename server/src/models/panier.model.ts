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
  // Empêche de retirer plusieurs fois les articles pour une même commande.
  commandesPayeesTraitees?: ObjectId[];
}
