export type ArticlePanier = {
  produitId: string;
  nom: string;
  prix: number;
  quantite: number;
};

const panierTemporaire: ArticlePanier[] = [
  {
    produitId: "livre-1",
    nom: "Rôdeur Mortel tome 1 : La métamorphose",
    prix: 19.95,
    quantite: 1,
  },
  {
    produitId: "livre-2",
    nom: "5150, rue des ormes",
    prix: 14.95,
    quantite: 2,
  },
];

export default panierTemporaire;
