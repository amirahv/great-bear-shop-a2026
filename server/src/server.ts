import { config } from "dotenv";
import { connectToMongo } from "./db/mongo.js";

config();
//console.log(process.env.MONGODB_URI); permet de valider la connexion a la base de donnees

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

await connectToMongo(uri);
