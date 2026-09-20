import type { ObjectId } from "mongodb";

export type CategorieProduit = "livre" | "vetement" | "sirop-erable";

export interface CaracteristiquesProduit {
  // Livre
  auteur?: string;
  isbn?: string;
  maisonEdition?: string;
  anneePublication?: number;
  nombrePages?: number;

  // Vêtement
  marque?: string;
  taillesDisponibles?: string[];
  couleursDisponibles?: string[];
  genre?: string;
  matiere?: string;

  // Sirop d’érable
  format?: string;
  regionProduction?: string;
  couleur?: string;
  categorieSirop?: string;
  biologique?: boolean;
}

export interface Produit {
  _id?: ObjectId;
  nom: string;
  description?: string;
  categorie: CategorieProduit;
  prix: number;
  stock: number;
  images: string[];
  caracteristiques: CaracteristiquesProduit;
  actif: boolean;
  dateCreation: Date;
  dateModification: Date;
}
