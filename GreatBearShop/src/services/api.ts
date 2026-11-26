
const API_URL = "http://localhost:4000";

export interface ProduitAPI {
  _id: string;
  nom: string;
  description?: string;
  categorie: "livre" | "vetement" | "sirop-erable";
  prix: number;
  stock: number;
  images: string[];

  caracteristiques: {
    // Vêtements
    marque?: string;
    genre?: string;
    taillesDisponibles?: string[];
    couleursDisponibles?: string[];
    matiere?: string;

    // Livres
    auteur?: string;
    isbn?: string | number;
    maisonEdition?: string;
    anneePublication?: number;
    nombrePages?: number;

    // Sirop d'érable
    categorieSirop?: string;
    couleur?: string;
    biologique?: boolean;
    format?: string;
    regionProduction?: string;
  };
}

export async function obtenirProduits(): Promise<ProduitAPI[]> {
  const response = await fetch(`${API_URL}/api/produits`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les produits");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.value ?? [];
}

export async function obtenirProduitParId(id: string): Promise<ProduitAPI> {
  const response = await fetch(`${API_URL}/api/produits/${id}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les détails du produit");
  }

  return await response.json();
}
