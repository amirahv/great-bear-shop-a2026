import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import type { Produit } from "../models/produit.model.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { stripe } from "./stripe.service.js";

/**
 * Clôture une commande dont la session Stripe a expiré sans paiement.
 * Remet les quantités réservées en stock sans modifier le panier.
 *
 * @author Amir
 */
export async function libererReservationExpiree(
  sessionId: string,
): Promise<void> {
  // Vérifie l'état auprès de Stripe avant de toucher au stock.
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status !== "expired" || session.payment_status !== "unpaid") {
    throw new Error("Cette session n'est pas expirée et impayée.");
  }

  const commandeId = session.metadata?.commandeId;

  // Ignore les sessions de test créées en dehors de notre application.
  if (!commandeId) {
    return;
  }

  if (!ObjectId.isValid(commandeId)) {
    throw new Error("Identifiant de commande invalide.");
  }

  const identifiant = new ObjectId(commandeId);

  if (session.client_reference_id !== identifiant.toHexString()) {
    throw new Error("Référence de commande Stripe incohérente.");
  }

  const commandes = getDb().collection<Commande>(Collection.COMMANDES);

  // Clôture une commande en attente ou reprend une libération interrompue.
  // Une commande payée ne correspond pas à ce filtre.
  const commande = await commandes.findOneAndUpdate(
    {
      _id: identifiant,
      "paiement.stripeSessionId": session.id,
      $or: [
        {
          statut: StatutCommande.RECU,
          "paiement.statut": "EN_ATTENTE",
        },
        {
          statut: StatutCommande.ANNULEE,
          "paiement.statut": "EXPIRE",
        },
      ],
    },
    {
      $set: {
        statut: StatutCommande.ANNULEE,
        "paiement.statut": "EXPIRE",
        dateModification: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  if (!commande) {
    throw new Error("La commande ne permet pas cette libération.");
  }

  if (commande.paiement?.stockLibere) {
    return;
  }

  const produits = getDb().collection<Produit>(Collection.PRODUITS);

  // Regroupe les quantités réservées par produit.
  const quantites = new Map<string, number>();

  for (const achat of commande.achat) {
    const produitId = achat.produitId.toHexString();

    quantites.set(produitId, (quantites.get(produitId) ?? 0) + achat.quantite);
  }

  for (const [produitId, quantite] of quantites) {
    const identifiantProduit = new ObjectId(produitId);

    // La quantité et le repère sont enregistrés ensemble sur le produit.
    const resultat = await produits.updateOne(
      {
        _id: identifiantProduit,
        reservationsLiberees: { $ne: identifiant },
      },
      {
        $inc: { stock: quantite },
        $addToSet: {
          reservationsLiberees: identifiant,
        },
      },
    );

    if (resultat.matchedCount === 0) {
      const dejaLibere = await produits.findOne({
        _id: identifiantProduit,
        reservationsLiberees: identifiant,
      });

      if (!dejaLibere) {
        throw new Error(
          `Produit introuvable pendant la libération : ${produitId}`,
        );
      }
    }
  }

  // Confirme la fin seulement lorsque tous les produits ont été traités.
  await commandes.updateOne(
    {
      _id: identifiant,
      "paiement.statut": "EXPIRE",
      "paiement.stripeSessionId": session.id,
    },
    {
      $set: {
        "paiement.stockLibere": true,
        dateModification: new Date(),
      },
    },
  );
}
