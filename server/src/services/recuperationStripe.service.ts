import type Stripe from "stripe";
import type { WithId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { stripe } from "./stripe.service.js";
import { confirmerPaiement } from "./confirmationPaiement.service.js";
import { libererReservationExpiree } from "./expirationPaiement.service.js";

/**
 * Retrouve une session existante sans en créer une nouvelle.
 *
 * @author Amir
 */
async function retrouverSession(
  commande: WithId<Commande>,
): Promise<Stripe.Checkout.Session | undefined> {
  const paiement = commande.paiement;

  if (paiement?.stripeSessionId) {
    return stripe.checkout.sessions.retrieve(paiement.stripeSessionId);
  }

  const expiration = paiement?.stripeDateExpiration;

  if (!(expiration instanceof Date) || !Number.isFinite(expiration.getTime())) {
    throw new Error("Date d'expiration Stripe invalide.");
  }

  const reference = commande._id.toHexString();
  const fin = Math.floor(expiration.getTime() / 1000);

  let trouvee: Stripe.Checkout.Session | undefined;

  // Stripe accepte une expiration située au maximum 24 h après création.
  // Cette fenêtre couvre les sessions créées avec notre expiration fixe.
  for await (const session of stripe.checkout.sessions.list({
    created: {
      gte: Math.max(0, fin - 24 * 60 * 60),
      lte: fin,
    },
    limit: 100,
  })) {
    if (
      session.client_reference_id !== reference ||
      session.metadata?.commandeId !== reference
    ) {
      continue;
    }

    if (trouvee) {
      throw new Error(
        "Plusieurs sessions Stripe correspondent à cette commande.",
      );
    }

    trouvee = session;
  }

  return trouvee;
}

/**
 * Rattache les sessions manquantes et actualise les paiements en attente.
 *
 * @author Amir
 */
export async function recupererPaiementsStripe(): Promise<void> {
  const commandes = getDb().collection<Commande>(Collection.COMMANDES);

  const aTraiter = await commandes
    .find({
      $or: [
        {
          // Paiements encore en attente.
          statut: StatutCommande.RECU,
          "paiement.statut": "EN_ATTENTE",
          "paiement.stripeDateExpiration": { $type: "date" },
          $or: [
            { etatReservation: "RESERVEE" },
            { etatReservation: { $exists: false } },
          ],
        },
        {
          // Paiement enregistré, mais panier pas encore terminé.
          statut: { $ne: StatutCommande.ANNULEE },
          "paiement.statut": "PAYE",
          "paiement.panierActualise": { $ne: true },
          "paiement.stripeSessionId": {
            $type: "string",
            $ne: "",
          },
        },
      ],
    })
    .toArray();

  for (const commande of aTraiter) {
    try {
      const paiement = commande.paiement;

      if (paiement?.statut === "PAYE" && paiement.stripeSessionId) {
        // Termine le panier en conservant la date de paiement.
        await confirmerPaiement(
          paiement.stripeSessionId,
          paiement.datePaiement ?? new Date(),
        );
        continue;
      }
      const session = await retrouverSession(commande);

      if (!session) {
        const expiration = commande.paiement?.stripeDateExpiration;

        if (expiration && expiration.getTime() <= Date.now()) {
          console.error(
            `Aucune session Stripe retrouvée pour ${commande._id.toHexString()} : stock conservé, vérification requise.`,
          );
        }

        continue;
      }

      const reference = commande._id.toHexString();
      const montantAttendu = Math.round(commande.prixTotalApresTaxes * 100);

      // Vérifie que la session appartient bien à cette commande.
      if (
        session.mode !== "payment" ||
        session.client_reference_id !== reference ||
        session.metadata?.commandeId !== reference ||
        session.currency !== "cad" ||
        !Number.isSafeInteger(montantAttendu) ||
        montantAttendu <= 0 ||
        session.amount_total !== montantAttendu
      ) {
        throw new Error("La session Stripe ne correspond pas à la commande.");
      }

      // La commande doit être encore en attente.
      // Une autre session ne doit pas avoir été enregistrée entre-temps.
      const resultat = await commandes.updateOne(
        {
          _id: commande._id,
          statut: StatutCommande.RECU,
          "paiement.statut": "EN_ATTENTE",
          $or: [
            {
              "paiement.stripeSessionId": {
                $exists: false,
              },
            },
            {
              "paiement.stripeSessionId": session.id,
            },
          ],
        },
        {
          $set: {
            "paiement.stripeSessionId": session.id,
            dateModification: new Date(),
          },
        },
      );

      if (resultat.matchedCount === 0) {
        continue;
      }

      if (session.payment_status === "paid") {
        await confirmerPaiement(session.id, new Date());
      } else if (
        session.status === "expired" &&
        session.payment_status === "unpaid"
      ) {
        await libererReservationExpiree(session.id);
      }
    } catch (error) {
      console.error(
        `Récupération Stripe impossible pour ${commande._id.toHexString()} :`,
        error,
      );
    }
  }
}
