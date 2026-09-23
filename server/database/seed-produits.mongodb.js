// Sélectionne la base de données du projet.
use("great-bear-shop");

// Crée la collection seulement si elle n'existe pas déjà.
if (!db.getCollectionNames().includes("produits")) {
  db.createCollection("produits");
}

// Index utilisé pour filtrer rapidement les produits par catégorie et état.
db.produits.createIndex({
  categorie: 1,
  actif: 1,
});

// Index utilisé pour effectuer des recherches textuelles.
db.produits.createIndex({
  nom: "text",
  description: "text",
});

// Ajoute le livre seulement s'il n'existe pas déjà.
db.produits.updateOne(
  { nom: "Le plongeur" },
  {
    $setOnInsert: {
      nom: "Le plongeur",
      description: "Roman québécois de Stéphane Larue.",
      categorie: "livre",
      prix: 24.95,
      stock: 15,
      images: [],
      caracteristiques: {
        auteur: "Stéphane Larue",
        maisonEdition: "Le Quartanier",
        anneePublication: 2016,
        nombrePages: 576,
      },
      actif: true,
      dateCreation: new Date(),
      dateModification: new Date(),
    },
  },
  { upsert: true },
);

// Ajoute le vêtement seulement s'il n'existe pas déjà.
db.produits.updateOne(
  { nom: "Chandail classique canadien" },
  {
    $setOnInsert: {
      nom: "Chandail classique canadien",
      description: "Chandail confortable fabriqué au Canada.",
      categorie: "vetement",
      prix: 49.99,
      stock: 25,
      images: [],
      caracteristiques: {
        marque: "Great Bear",
        taillesDisponibles: ["S", "M", "L", "XL"],
        couleursDisponibles: ["rouge", "noir"],
        genre: "unisexe",
        matiere: "coton",
      },
      actif: true,
      dateCreation: new Date(),
      dateModification: new Date(),
    },
  },
  { upsert: true },
);

// Ajoute le sirop seulement s'il n'existe pas déjà.
db.produits.updateOne(
  { nom: "Sirop d'érable ambré" },
  {
    $setOnInsert: {
      nom: "Sirop d'érable ambré",
      description: "Sirop d'érable produit au Québec.",
      categorie: "sirop-erable",
      prix: 14.5,
      stock: 40,
      images: [],
      caracteristiques: {
        format: "540 ml",
        regionProduction: "Québec",
        couleur: "ambré",
        categorieSirop: "goût riche",
        biologique: true,
      },
      actif: true,
      dateCreation: new Date(),
      dateModification: new Date(),
    },
  },
  { upsert: true },
);

// Affiche les produits présents après l'initialisation.
db.produits.find({});