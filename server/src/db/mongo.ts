import { Collection, Db, MongoClient } from "mongodb";

let mongoClient: MongoClient;
let database: Db | undefined;

export async function connectToMongo(uri: string): Promise<void> {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();

    database = mongoClient.db();

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    throw error;
  }
}

export function getDb(): Db {
  if (!database) {
    throw new Error("MongoDB is not connected. Call connectToMongo() first.");
  }

  return database;
}
