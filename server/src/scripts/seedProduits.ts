
import "dotenv/config";
import { MongoClient } from "mongodb";
import type { Produit } from "../models/produit.model.js";

const STOCK_INITIAL = 10;

const maintenant = new Date();

/**
 * Création d'un produit avec les champs communs.
 */
function creerProduit(
  produit: Omit<Produit, "_id" | "actif" | "dateCreation" | "dateModification">,
): Omit<Produit, "_id"> {
  return {
    ...produit,
    actif: true,
    dateCreation: maintenant,
    dateModification: maintenant,
  };
}

const produits: Omit<Produit, "_id">[] = [

  // =====================================
  // VÊTEMENTS - FEMME
  // =====================================

  creerProduit({
    nom: "T-shirt classique",
    description: "T-shirt • Femme • Kotn",
    categorie: "vetement",
    prix: 29.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/kotn-tshirt.png"],
    caracteristiques: { marque: "Kotn", genre: "Femme" },
  }),

  creerProduit({
    nom: "Haut à manches longues",
    description: "Hauts • Femme • Aritzia",
    categorie: "vetement",
    prix: 39.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/aritzia-top.png"],
    caracteristiques: { marque: "Aritzia", genre: "Femme" },
  }),

  creerProduit({
    nom: "Chandail classique",
    description: "Chandails • Femme • Roots",
    categorie: "vetement",
    prix: 59.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/roots-sweater.png"],
    caracteristiques: { marque: "Roots", genre: "Femme" },
  }),

  creerProduit({
    nom: "Hoodie",
    description: "Hoodies • Femme • tentree",
    categorie: "vetement",
    prix: 69.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/tentree-hoodie.png"],
    caracteristiques: { marque: "tentree", genre: "Femme" },
  }),

  creerProduit({
    nom: "Pantalon décontracté",
    description: "Pantalons • Femme • Frank And Oak",
    categorie: "vetement",
    prix: 64.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/frankandoak-pants.png"],
    caracteristiques: { marque: "Frank And Oak", genre: "Femme" },
  }),

  creerProduit({
    nom: "Jeans taille haute",
    description: "Jeans • Femme • Aritzia",
    categorie: "vetement",
    prix: 79.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/aritzia-jeans.png"],
    caracteristiques: { marque: "Aritzia", genre: "Femme" },
  }),

  creerProduit({
    nom: "Robe décontractée",
    description: "Robes • Femme • tentree",
    categorie: "vetement",
    prix: 74.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/tentree-dress.png"],
    caracteristiques: { marque: "tentree", genre: "Femme" },
  }),

  creerProduit({
    nom: "Jupe midi",
    description: "Jupes • Femme • Aritzia",
    categorie: "vetement",
    prix: 54.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/aritzia-skirt.png"],
    caracteristiques: { marque: "Aritzia", genre: "Femme" },
  }),

  creerProduit({
    nom: "Veste légère",
    description: "Vestes • Femme • tentree",
    categorie: "vetement",
    prix: 89.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/tentree-jacket.png"],
    caracteristiques: { marque: "tentree", genre: "Femme" },
  }),

  creerProduit({
    nom: "Manteau d'hiver",
    description: "Manteaux • Femme • Mackage",
    categorie: "vetement",
    prix: 149.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/women/mackage-coat.png"],
    caracteristiques: { marque: "Mackage", genre: "Femme" },
  }),

  // =====================================
  // VÊTEMENTS - HOMME
  // =====================================

  creerProduit({
    nom: "T-shirt classique",
    description: "T-shirts • Homme • Kotn",
    categorie: "vetement",
    prix: 29.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/kotn-tshirt.png"],
    caracteristiques: { marque: "Kotn", genre: "Homme" },
  }),

  creerProduit({
    nom: "Chemise en coton",
    description: "Chemises • Homme • Frank And Oak",
    categorie: "vetement",
    prix: 49.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/frankandoak-shirt.png"],
    caracteristiques: { marque: "Frank And Oak", genre: "Homme" },
  }),

  creerProduit({
    nom: "Chandail classique",
    description: "Chandails • Homme • Roots",
    categorie: "vetement",
    prix: 59.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/roots-sweater.png"],
    caracteristiques: { marque: "Roots", genre: "Homme" },
  }),

  creerProduit({
    nom: "Hoodie classique",
    description: "Hoodies • Homme • Roots",
    categorie: "vetement",
    prix: 69.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/roots-hoodie.png"],
    caracteristiques: { marque: "Roots", genre: "Homme" },
  }),

  creerProduit({
    nom: "Pantalon décontracté",
    description: "Pantalons • Homme • Kotn",
    categorie: "vetement",
    prix: 64.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/kotn-pants.png"],
    caracteristiques: { marque: "Kotn", genre: "Homme" },
  }),

  creerProduit({
    nom: "Jeans coupe droite",
    description: "Jeans • Homme • Frank And Oak",
    categorie: "vetement",
    prix: 79.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/frankandoak-jeans.png"],
    caracteristiques: { marque: "Frank And Oak", genre: "Homme" },
  }),

  creerProduit({
    nom: "Shorts",
    description: "Shorts • Homme • tentree",
    categorie: "vetement",
    prix: 44.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/tentree-shorts.png"],
    caracteristiques: { marque: "tentree", genre: "Homme" },
  }),

  creerProduit({
    nom: "Veste légère",
    description: "Vestes • Homme • Arc'teryx",
    categorie: "vetement",
    prix: 99.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/arcteryx-jacket.png"],
    caracteristiques: { marque: "Arc'teryx", genre: "Homme" },
  }),

  creerProduit({
    nom: "Parka d'hiver",
    description: "Manteaux • Homme • Canada Goose",
    categorie: "vetement",
    prix: 159.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/canadagoose-parka.png"],
    caracteristiques: { marque: "Canada Goose", genre: "Homme" },
  }),

  creerProduit({
    nom: "T-shirt graphique",
    description: "T-shirts • Homme • Roots",
    categorie: "vetement",
    prix: 34.99,
    stock: STOCK_INITIAL,
    images: ["/images/clothing/men/roots-graphic-tshirt.png"],
    caracteristiques: { marque: "Roots", genre: "Homme" },
  }),

  // =====================================
  // LIVRES
  // =====================================

  creerProduit({
    nom: "Rôdeur Mortel tome 1: La métamorphose",
    categorie: "livre",
    prix: 19.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Rodeur_Mortel.jpg"],
    caracteristiques: {
      auteur: "Mel Gosselin",
      isbn: "9782897628697",
      maisonEdition: "Michel Quintin",
      anneePublication: 2024,
      nombrePages: 224,
    },
  }),

  creerProduit({
    nom: "5150, rue des ormes",
    categorie: "livre",
    prix: 14.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/5150_rue_des_ormes.jpg"],
    caracteristiques: {
      auteur: "Patrick Senécal",
      isbn: "9782922145519",
      maisonEdition: "Alire",
      anneePublication: 2001,
      nombrePages: 370,
    },
  }),

  creerProduit({
    nom: "Amos Daragon et le porteur de masques",
    categorie: "livre",
    prix: 18.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Amos_Daragon_Le_porteur_de_Masques.jpg"],
    caracteristiques: {
      auteur: "Bryan Perro",
      isbn: "9782898083549",
      maisonEdition: "ADA",
      anneePublication: 2020,
      nombrePages: 182,
    },
  }),

  creerProduit({
    nom: "Les chevaliers d'emeraude tome 1 le feu dans le ciel",
    categorie: "livre",
    prix: 14.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Les_Chevaliers_d'emeraude_tome_1.jpg"],
    caracteristiques: {
      auteur: "Anne Robillard",
      isbn: "9782981042873",
      maisonEdition: "MORTAGNE ED DE",
      anneePublication: 2010,
      nombrePages: 224,
    },
  }),

  creerProduit({
    nom: "Paris en vrac",
    categorie: "livre",
    prix: 19.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Paris_en_vrac.jpg"],
    caracteristiques: {
      auteur: "Michel Tremblay",
      isbn: "9782760913523",
      maisonEdition: "LEMEAC",
      anneePublication: 2025,
      nombrePages: 136,
    },
  }),

  creerProduit({
    nom: "Aliss",
    categorie: "livre",
    prix: 16.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Aliss.jpg"],
    caracteristiques: {
      auteur: "Patrick Senécal",
      isbn: "9782922145441",
      maisonEdition: "ALIRE",
      anneePublication: 2000,
      nombrePages: 554,
    },
  }),

  creerProduit({
    nom: "La Grande Quête de Jacob Jobin tome 1 l'élu",
    categorie: "livre",
    prix: 8.99,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Jacob_Jobin_tome_1.jpg"],
    caracteristiques: {
      auteur: "Dominique Demers",
      isbn: "9782764429020",
      maisonEdition: "QUEBEC AMERIQUE",
      anneePublication: 2014,
      nombrePages: 310,
    },
  }),

  creerProduit({
    nom: "Le rituel",
    categorie: "livre",
    prix: 19.99,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Le_Rituel.jpg"],
    caracteristiques: {
      auteur: "Dominic Pilon",
      isbn: "9781234567890",
      maisonEdition: "Atypical Films",
      anneePublication: 2026,
      nombrePages: 178,
    },
  }),

  creerProduit({
    nom: "La forêt",
    categorie: "livre",
    prix: 14.99,
    stock: STOCK_INITIAL,
    images: ["/images/livres/La_Foret.jpg"],
    caracteristiques: {
      auteur: "A.J. Lachance",
      isbn: "9781234567891",
      maisonEdition: "Atypical Films",
      anneePublication: 2025,
      nombrePages: 18,
    },
  }),

  creerProduit({
    nom: "Arielle Queen intégrale tome 1",
    categorie: "livre",
    prix: 29.95,
    stock: STOCK_INITIAL,
    images: ["/images/livres/Arielle_Queen_tome_1.jpg"],
    caracteristiques: {
      auteur: "michel j lévesque",
      isbn: "9782897658113",
      maisonEdition: "SCARAB",
      anneePublication: 2022,
      nombrePages: 400,
    },
  }),

  // =====================================
  // SIROPS D'ÉRABLE
  // =====================================

  creerProduit({
    nom: "Sirop d'érable ambré",
    categorie: "sirop-erable",
    prix: 19.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/escuminac-amber.png"],
    caracteristiques: {
      marque: "Escuminac",
      categorieSirop: "Sirop pur",
      couleur: "Ambré",
    },
  }),

  creerProduit({
    nom: "Sirop d'érable doré",
    categorie: "sirop-erable",
    prix: 19.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/escuminac-golden.png"],
    caracteristiques: {
      marque: "Escuminac",
      categorieSirop: "Sirop pur",
      couleur: "Doré",
    },
  }),

  creerProduit({
    nom: "Sirop d'érable foncé",
    categorie: "sirop-erable",
    prix: 19.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/escuminac-dark.png"],
    caracteristiques: {
      marque: "Escuminac",
      categorieSirop: "Sirop pur",
      couleur: "Foncé",
    },
  }),

  creerProduit({
    nom: "Sirop d'érable biologique",
    categorie: "sirop-erable",
    prix: 21.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/cosman-organic.png"],
    caracteristiques: {
      marque: "Cosman & Webb",
      categorieSirop: "Biologique",
      biologique: true,
    },
  }),

  creerProduit({
    nom: "Sirop ambré biologique",
    categorie: "sirop-erable",
    prix: 22.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/cosman-amber.png"],
    caracteristiques: {
      marque: "Cosman & Webb",
      categorieSirop: "Biologique",
      couleur: "Ambré",
      biologique: true,
    },
  }),

  creerProduit({
    nom: "Sirop d'érable pur",
    categorie: "sirop-erable",
    prix: 17.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/turkeyhill-maple.png"],
    caracteristiques: {
      marque: "Turkey Hill",
      categorieSirop: "Sirop pur",
    },
  }),

  creerProduit({
    nom: "Sirop d'érable biologique",
    categorie: "sirop-erable",
    prix: 24.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/canadianheritage-organic.png"],
    caracteristiques: {
      marque: "Canadian Heritage Organics",
      categorieSirop: "Biologique",
      biologique: true,
    },
  }),

  creerProduit({
    nom: "Sirop d'érable en canne",
    categorie: "sirop-erable",
    prix: 12.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/maple-can.png"],
    caracteristiques: {
      marque: "Produit du Québec",
      categorieSirop: "Sirop pur",
    },
  }),

  creerProduit({
    nom: "Coffret découverte érable",
    categorie: "sirop-erable",
    prix: 39.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/escuminac-giftset.png"],
    caracteristiques: {
      marque: "Escuminac",
      categorieSirop: "Coffrets",
    },
  }),

  creerProduit({
    nom: "Coffret de sirops d'érable",
    categorie: "sirop-erable",
    prix: 44.99,
    stock: STOCK_INITIAL,
    images: ["/images/maple/cosman-giftset.png"],
    caracteristiques: {
      marque: "Cosman & Webb",
      categorieSirop: "Coffrets",
    },
  }),
];

/**
 * Identifie chaque produit pour éviter les doublons.
 * Les vêtements sont distingués par leur marque et leur genre.
 * Les livres sont distingués par leur ISBN.
 * Les sirops sont distingués par leur marque et leur nom.
 */
function filtreProduit(produit: Omit<Produit, "_id">) {
  if (produit.categorie === "vetement") {
    return {
      nom: produit.nom,
      categorie: produit.categorie,
      "caracteristiques.marque": produit.caracteristiques.marque,
      "caracteristiques.genre": produit.caracteristiques.genre,
    };
  }

  if (produit.categorie === "livre") {
    return {
      categorie: produit.categorie,
      "caracteristiques.isbn": produit.caracteristiques.isbn,
    };
  }

  return {
    nom: produit.nom,
    categorie: produit.categorie,
    "caracteristiques.marque": produit.caracteristiques.marque,
  };
}

async function remplirInventaire(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI est introuvable dans le fichier .env");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db();
    const collection = db.collection<Produit>("produits");

    const operations = produits.map((produit) => ({
      updateOne: {
        filter: filtreProduit(produit),
        update: { $setOnInsert: produit },
        upsert: true,
      },
    }));

    const resultat = await collection.bulkWrite(operations);

    console.log("Inventaire rempli avec succès !");
    console.log(`Produits prévus : ${produits.length}`);
    console.log(`Produits ajoutés : ${resultat.upsertedCount}`);
    console.log(`Produits déjà présents : ${resultat.matchedCount}`);
  } catch (error) {
    console.error("Erreur pendant le remplissage de l'inventaire :", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

void remplirInventaire();
