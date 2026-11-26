import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import type { Panier } from "../models/panier.model.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { stripe } from "./stripe.service.js";

/**
 * Vérifie le paiement auprès de Stripe et actualise la commande et le panier.
 * Supporte les notifications répétées pour une même session.
 *
 * @author Amir
 */
export async function confirmerPaiement(
  sessionId: string,
  dateEvenement: Date,
): Promise<void> {
  // Consulte Stripe pour obtenir l'état actuel du paiement.
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const commandeId = session.metadata?.commandeId;

  // Ignore les sessions de test qui ne viennent pas de notre application.
  if (!commandeId) {
    return;
  }

  if (!ObjectId.isValid(commandeId)) {
    throw new Error("Identifiant de commande Stripe invalide.");
  }

  // Certains moyens de paiement ne sont pas confirmés immédiatement.
  if (session.payment_status !== "paid") {
    return;
  }

  const identifiant = new ObjectId(commandeId);
  const commandes = getDb().collection<Commande>(Collection.COMMANDES);

  const commande = await commandes.findOne({ _id: identifiant });

  if (!commande) {
    throw new Error("Commande du paiement introuvable.");
  }

  const montantAttendu = Math.round(commande.prixTotalApresTaxes * 100);

  // Vérifie le lien avec la commande, la devise et le montant payé.
  if (
    session.mode !== "payment" ||
    session.client_reference_id !== identifiant.toHexString() ||
    session.currency !== "cad" ||
    !Number.isSafeInteger(montantAttendu) ||
    session.amount_total !== montantAttendu ||
    (commande.paiement?.stripeSessionId &&
      commande.paiement.stripeSessionId !== session.id)
  ) {
    throw new Error("Le paiement ne correspond pas à la commande.");
  }

  const paiementStripeId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paiementStripeId) {
    throw new Error("Identifiant du paiement Stripe manquant.");
  }

  // Confirme uniquement une commande encore en attente.
  // Une notification répétée ne remplace pas la première date de paiement.
  await commandes.updateOne(
    {
      _id: identifiant,
      statut: { $ne: StatutCommande.ANNULEE },
      "paiement.statut": "EN_ATTENTE",
      $or: [
        { "paiement.stripeSessionId": { $exists: false } },
        { "paiement.stripeSessionId": session.id },
      ],
    },
    {
      $set: {
        "paiement.statut": "PAYE",
        "paiement.stripeSessionId": session.id,
        "paiement.stripePaymentIntentId": paiementStripeId,
        "paiement.datePaiement": dateEvenement,
        dateModification: new Date(),
      },
    },
  );

  const commandePayee = await commandes.findOne({
    _id: identifiant,
    statut: { $ne: StatutCommande.ANNULEE },
    "paiement.statut": "PAYE",
    "paiement.stripeSessionId": session.id,
  });

  if (!commandePayee) {
    throw new Error("La commande ne permet pas de confirmer ce paiement.");
  }

  if (commandePayee.paiement?.panierActualise) {
    return;
  }

  const paniers = getDb().collection<Panier>(Collection.PANIERS);
  const quantitesAchetees = new Map<string, number>();

  for (const achat of commandePayee.achat) {
    const produitId = achat.produitId.toHexString();

    quantitesAchetees.set(
      produitId,
      (quantitesAchetees.get(produitId) ?? 0) + achat.quantite,
    );
  }

  let panierTraite = false;

  // Réessaie si une autre requête modifie les articles entre la lecture et l'écriture.
  for (let tentative = 0; tentative < 3; tentative++) {
    const panier = await paniers.findOne({
      utilisateurId: commandePayee.utilisateurId,
    });

    if (
      !panier ||
      panier.commandesPayeesTraitees?.some((id) => id.equals(identifiant))
    ) {
      panierTraite = true;
      break;
    }

    // Soustrait les quantités achetées et conserve le surplus éventuel.
    const articlesRestants = panier.articles
      .map((article) => ({
        ...article,
        quantite: Math.max(
          0,
          article.quantite -
            (quantitesAchetees.get(article.produitId.toHexString()) ?? 0),
        ),
      }))
      .filter((article) => article.quantite > 0);

    // Les articles et le repère de traitement sont enregistrés ensemble.
    const resultat = await paniers.updateOne(
      {
        _id: panier._id,
        articles: panier.articles,
        commandesPayeesTraitees: { $ne: identifiant },
      },
      {
        $set: {
          articles: articlesRestants,
          dateModification: new Date(),
        },
        $addToSet: {
          commandesPayeesTraitees: identifiant,
        },
      },
    );

    if (resultat.matchedCount === 1) {
      panierTraite = true;
      break;
    }
  }

  if (!panierTraite) {
    throw new Error("Le panier a changé pendant sa mise à jour.");
  }

  await commandes.updateOne(
    {
      _id: identifiant,
      "paiement.statut": "PAYE",
      "paiement.stripeSessionId": session.id,
    },
    {
      $set: {
        "paiement.panierActualise": true,
      },
    },
  );

  // Le stock a déjà été réservé lors de la création de la commande.
}
