export type ArticlePanierDetaille = {
  produitId: string;
  nom: string;
  images: string[];
  quantite: number;
  prixUnitaire: number | null;
  totalLigne: number | null;
  disponible: boolean;
};

const panierTemporaire: ArticlePanierDetaille[] = [
  {
    produitId: "livre-1",
    nom: "Rôdeur Mortel tome 1 : La métamorphose",
    images: ["/images/livres/Rodeur_Mortel.jpg"],
    quantite: 1,
    prixUnitaire: 19.95,
    totalLigne: 19.95,
    disponible: true,
  },
  {
    produitId: "livre-2",
    nom: "5150, rue des ormes",
    images: ["/images/livres/5150_rue_des_ormes.jpg"],
    quantite: 2,
    prixUnitaire: 14.95,
    totalLigne: 29.9,
    disponible: true,
  },
];

export default panierTemporaire;
