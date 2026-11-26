import type { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Produit } from "../models/produit.model.js";
import { Collection } from "../types/colllectionNoms.type.js";

export type ResultatReservationProduit = "RESERVE" | "INDISPONIBLE" | "LIBERE";

function verifierQuantite(quantite: number): void {
  if (!Number.isSafeInteger(quantite) || quantite < 1) {
    throw new Error("La quantité à réserver ou libérer est invalide.");
  }
}

/**
 * Réserve un produit une seule fois pour une commande.
 * La quantité doit provenir de la commande enregistrée et rester identique.
 *
 * @author Amir
 */
export async function reserverProduit(
  commandeId: ObjectId,
  produitId: ObjectId,
  quantite: number,
): Promise<ResultatReservationProduit> {
  verifierQuantite(quantite);

  const produits = getDb().collection<Produit>(Collection.PRODUITS);

  // Le retrait et sa trace sont enregistrés ensemble sur le produit.
  const resultat = await produits.updateOne(
    {
      _id: produitId,
      actif: true,
      stock: { $gte: quantite },
      reservationsEffectuees: { $ne: commandeId },
      reservationsLiberees: { $ne: commandeId },
    },
    {
      $inc: { stock: -quantite },
      $addToSet: { reservationsEffectuees: commandeId },
      $set: { dateModification: new Date() },
    },
  );

  if (resultat.matchedCount === 1) {
    return "RESERVE";
  }

  // Le stock peut être nul parce que cette commande l'a déjà réservé.
  const produit = await produits.findOne({ _id: produitId });

  if (produit?.reservationsLiberees?.some((id) => id.equals(commandeId))) {
    return "LIBERE";
  }

  if (produit?.reservationsEffectuees?.some((id) => id.equals(commandeId))) {
    return "RESERVE";
  }

  return "INDISPONIBLE";
}

/**
 * Libère un produit sans restituer deux fois la même quantité.
 * Appeler après la clôture de la commande, avec sa quantité enregistrée.
 *
 * @author Amir
 */
export async function libererProduit(
  commandeId: ObjectId,
  produitId: ObjectId,
  quantite: number,
): Promise<void> {
  verifierQuantite(quantite);

  const produits = getDb().collection<Produit>(Collection.PRODUITS);

  // Bloque une réservation tardive si le produit n'a pas été réservé.
  // Aucune quantité n'est ajoutée dans ce cas.
  const sansRetrait = await produits.updateOne(
    {
      _id: produitId,
      reservationsEffectuees: { $ne: commandeId },
      reservationsLiberees: { $ne: commandeId },
    },
    {
      $addToSet: { reservationsLiberees: commandeId },
      $set: { dateModification: new Date() },
    },
  );

  // Restitue uniquement une réservation réellement effectuée.
  const avecRetrait = await produits.updateOne(
    {
      _id: produitId,
      reservationsEffectuees: commandeId,
      reservationsLiberees: { $ne: commandeId },
    },
    {
      $inc: { stock: quantite },
      $addToSet: { reservationsLiberees: commandeId },
      $set: { dateModification: new Date() },
    },
  );

  if (sansRetrait.matchedCount === 1 || avecRetrait.matchedCount === 1) {
    return;
  }

  // Vérifie si une autre exécution a déjà terminé la libération.
  const dejaLibere = await produits.findOne({
    _id: produitId,
    reservationsLiberees: commandeId,
  });

  if (!dejaLibere) {
    throw new Error(
      `Impossible de libérer le produit : ${produitId.toHexString()}`,
    );
  }
}
