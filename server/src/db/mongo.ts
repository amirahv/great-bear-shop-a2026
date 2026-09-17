import { Collection, Db, MongoClient } from "mongodb";

let mongoClient: MongoClient;

export async function connectToMongo(uri: string) {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    throw Error("Connection to MongoDB failed, error: ", error as Error);
  }
}
