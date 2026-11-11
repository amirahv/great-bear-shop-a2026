import { ObjectId } from "mongodb";
import { ItemAchat } from "../models/itemAchat.model.js";
import { getDb } from "../db/mongo.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { Produit } from "../models/produit.model.js";

/**
 * Service qui gere les quantites en inventaire de la collection "produits"
 *
 * Fonctions :
 *  -> retirerStock() : retire du stock les quantites achetees (tout ou rien)
 *  -> remettreStock() : remet en stock les quantites (annulation, echec de la commande)
 *
 * @author Martin Ore Rodriguez
 */

export type ResultatRetraitStock =
  | { success: true }
  | { success: false; produitId: ObjectId };

/**
 * Retire du stock la quantite de chaque item achete
 *
 * Chaque decrement n'est fait que si le stock est suffisant pour un produit achete
 * Si le stock est insuffisant, aucune commande passee, tous les produits achetes sont remis dans l'inventaire
 *
 * @param items les items d'une commande (commande.achat)
 * @returns type ResultatRetraitStock du premier produit en rupture de stock
 *
 * @author Martin Ore Rodriguez
 */
export async function retirerStock(
  items: ItemAchat[],
): Promise<ResultatRetraitStock> {
  const produits = getDb().collection<Produit>(Collection.PRODUITS);

  // items dont le stock a deja ete retire, pour pouvoir les remettre en cas d'echec de transaction/paiement
  const itemsRetires: ItemAchat[] = [];

  // on traverse tous les items se trouvant dans la liste achat : ItemAchat[] d'une commande
  for (const item of items) {
    // on trouve le produit specifique s'il reste le stock necessaire, puis on decremente le stock
    const resultat = await produits.updateOne(
      { _id: item.produitId, stock: { $gte: item.quantite } },
      { $inc: { stock: -item.quantite } },
    );

    // si aucun produit trouve : produit inexistant ou stock insuffisant
    if (resultat.matchedCount === 0) {
      await remettreStock(itemsRetires);

      return { success: false, produitId: item.produitId };
    }

    itemsRetires.push(item);
  }

  return { success: true };
}

/**
 * Remet en stock la quantite de chaque item
 * Utilise lors de l'annulation d'une commande ou si la creation de la commande echoue
 *
 * @param items les items a remettre dans l'inventaire
 *
 * @author Martin Ore Rodriguez
 */
export async function remettreStock(items: ItemAchat[]): Promise<void> {
  // si le stock du tout premier item est insuffisant, alors on sort de la fonction
  if (items.length === 0) {
    return;
  }

  await getDb()
    .collection<Produit>(Collection.PRODUITS)
    .bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { _id: item.produitId },
          update: { $inc: { stock: item.quantite } },
        },
      })),
    );
}
