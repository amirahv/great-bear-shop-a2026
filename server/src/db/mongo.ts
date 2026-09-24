import { Collection, Db, MongoClient } from "mongodb";
import { Utilisateur } from "../models/utilisateur.model.js";

let mongoClient: MongoClient;

export async function connectToMongo(uri: string): Promise<void> {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    throw error;
  }
}

// Permet d'acceder a la base de donnees GreatBearShop
export function getGreatBearShopDb(): Db {
  return mongoClient.db("GreatBearShop");
}

// Reference la collection "utilisateurs" dans la bd GreatBearShop
export function getUtilisateurs(): Collection<Utilisateur> {
  return getGreatBearShopDb().collection("utilisateurs");
}
