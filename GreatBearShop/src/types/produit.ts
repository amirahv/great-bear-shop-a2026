/**
 * Informations d'un produit reçu depuis l'API.
 * L'identifiant MongoDB est transmis en chaîne de caractères dans le JSON.
 *
 * @author Amir
 */
export interface ProduitCatalogue {
  _id: string;
  nom: string;
  categorie: "livre" | "vetement" | "sirop-erable";
  prix: number;
  stock: number;
  images: string[];

  caracteristiques: {
    auteur?: string;
    maisonEdition?: string;
    anneePublication?: number;
    nombrePages?: number;
  };
}
