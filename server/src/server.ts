import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToMongo } from "./db/mongo.js";

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const port = Number(process.env.PORT) || 4000;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not defined");
}

async function demarrerServeur(): Promise<void> {
  try {
    // Connexion à MongoDB avant de démarrer le serveur.
    await connectToMongo(mongodbUri);

    const app = express();

    // Autorise les requêtes provenant du frontend.
    app.use(cors());

    // Permet à Express de recevoir des données JSON.
    app.use(express.json());

    // Route temporaire pour vérifier le fonctionnement du serveur.
    app.get("/", (_req, res) => {
      res.status(200).json({
        message: "API Great Bear Shop fonctionne!",
      });
    });

    app.listen(port, () => {
      console.log(`Serveur Express démarré sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer le serveur :", error);
    process.exit(1);
  }
}

void demarrerServeur();
