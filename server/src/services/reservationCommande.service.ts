import type { ObjectId, WithId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { reserverProduit, libererProduit } from "./reservationStock.service.js";

/**
 * Termine une réservation ou reprend une libération interrompue.
 * Utilise exclusivement les quantités de la commande enregistrée.
 *
 * @author Amir
 */
export async function preparerReservationCommande(
  commandeId: ObjectId,
): Promise<WithId<Commande>> {
  const commandes = getDb().collection<Commande>(Collection.COMMANDES);
  let commande = await commandes.findOne({ _id: commandeId });

  if (!commande) {
    throw new Error("Commande introuvable.");
  }

  // Les anciennes commandes ont utilisé l'ancien service de stock.
  if (!commande.etatReservation) {
    return commande;
  }

  // Regroupe les lignes correspondant au même produit.
  const articles = new Map<string, { produitId: ObjectId; quantite: number }>();

  for (const achat of commande.achat) {
    const cle = achat.produitId.toHexString();
    const quantite = (articles.get(cle)?.quantite ?? 0) + achat.quantite;

    if (
      !Number.isSafeInteger(achat.quantite) ||
      achat.quantite < 1 ||
      !Number.isSafeInteger(quantite)
    ) {
      throw new Error("La commande contient une quantité invalide.");
    }

    articles.set(cle, {
      produitId: achat.produitId,
      quantite,
    });
  }

  if (commande.etatReservation === "EN_COURS") {
    let toutReserve = true;

    for (const article of articles.values()) {
      const resultat = await reserverProduit(
        commandeId,
        article.produitId,
        article.quantite,
      );

      if (resultat !== "RESERVE") {
        toutReserve = false;
        break;
      }
    }

    // Une autre requête peut avoir terminé ou annulé la préparation.
    await commandes.updateOne(
      {
        _id: commandeId,
        statut: StatutCommande.RECU,
        "paiement.statut": "EN_ATTENTE",
        etatReservation: "EN_COURS",
      },
      {
        $set: toutReserve
          ? {
              etatReservation: "RESERVEE",
              dateModification: new Date(),
            }
          : {
              etatReservation: "LIBERATION_EN_COURS",
              statut: StatutCommande.ANNULEE,
              "paiement.statut": "ECHEC",
              dateModification: new Date(),
            },
      },
    );
  }

  commande = await commandes.findOne({ _id: commandeId });

  if (!commande) {
    throw new Error("Commande introuvable après la réservation.");
  }

  if (
    commande.etatReservation === "LIBERATION_EN_COURS" &&
    commande.statut === StatutCommande.ANNULEE &&
    commande.paiement?.statut !== "PAYE"
  ) {
    // Répéter cette libération ne restitue pas deux fois le stock.
    for (const article of articles.values()) {
      await libererProduit(commandeId, article.produitId, article.quantite);
    }

    await commandes.updateOne(
      {
        _id: commandeId,
        statut: StatutCommande.ANNULEE,
        "paiement.statut": { $ne: "PAYE" },
        etatReservation: "LIBERATION_EN_COURS",
      },
      {
        $set: {
          etatReservation: "LIBEREE",
          "paiement.stockLibere": true,
          dateModification: new Date(),
        },
      },
    );
  }

  const resultat = await commandes.findOne({ _id: commandeId });

  if (!resultat) {
    throw new Error("Commande introuvable après sa préparation.");
  }

  return resultat;
}
