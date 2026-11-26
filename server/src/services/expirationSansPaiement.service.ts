import type { Filter } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { preparerReservationCommande } from "./reservationCommande.service.js";

const DELAI_SANS_PAIEMENT_MS = 15 * 60 * 1000;

/**
 * Clôture les commandes abandonnées avant toute préparation Stripe.
 *
 * @author Amir
 */
export async function expirerCommandesSansPaiement(): Promise<void> {
  const commandes = getDb().collection<Commande>(Collection.COMMANDES);

  const filtre: Filter<Commande> = {
    statut: StatutCommande.RECU,
    "paiement.statut": "EN_ATTENTE",
    etatReservation: {
      $in: ["EN_COURS", "RESERVEE"],
    },
    dateAchat: {
      $lte: new Date(Date.now() - DELAI_SANS_PAIEMENT_MS),
    },

    // Ces deux champs doivent être absents :
    // aucune préparation Stripe ne doit avoir commencé.
    "paiement.stripeSessionId": { $exists: false },
    "paiement.stripeDateExpiration": { $exists: false },
  };

  const candidates = await commandes
    .find(filtre, { projection: { _id: 1 } })
    .toArray();

  for (const commande of candidates) {
    try {
      // Réévalue les conditions : un paiement a pu commencer
      // depuis la lecture de la liste.
      const resultat = await commandes.updateOne(
        { ...filtre, _id: commande._id },
        {
          $set: {
            statut: StatutCommande.ANNULEE,
            "paiement.statut": "EXPIRE",
            etatReservation: "LIBERATION_EN_COURS",
            dateModification: new Date(),
          },
        },
      );

      if (resultat.matchedCount === 1) {
        // Termine la libération avec les traces de stock existantes.
        await preparerReservationCommande(commande._id);

        console.log(
          `Commande sans paiement expirée : ${commande._id.toHexString()}`,
        );
      }
    } catch (error) {
      // L'état enregistré permet au service de récupération de réessayer.
      console.error(
        `Expiration impossible pour la commande ${commande._id.toHexString()} :`,
        error,
      );
    }
  }
}
