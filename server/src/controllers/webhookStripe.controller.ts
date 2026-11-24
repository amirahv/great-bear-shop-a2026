import type { Request, Response } from "express";
import type Stripe from "stripe";
import { stripe } from "../services/stripe.service.js";
import { confirmerPaiement } from "../services/confirmationPaiement.service.js";

/**
 * Reçoit les événements Stripe et vérifie leur signature.
 * Cette route utilise la signature Stripe, sans cookie de connexion.
 *
 * @author Amir
 */
export async function recevoirWebhookStripe(
  req: Request,
  res: Response,
): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.get("stripe-signature");

  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET est manquant.");
    res.sendStatus(500);
    return;
  }

  if (!signature || !Buffer.isBuffer(req.body)) {
    res.status(400).json({
      message: "Signature ou corps du webhook invalide.",
    });
    return;
  }

  let evenement: Stripe.Event;

  try {
    // Vérifie la signature avec le corps brut reçu.
    evenement = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch {
    res.status(400).json({
      message: "Signature Stripe invalide.",
    });
    return;
  }

  try {
    if (
      evenement.type === "checkout.session.completed" ||
      evenement.type === "checkout.session.async_payment_succeeded"
    ) {
      await confirmerPaiement(
        evenement.data.object.id,
        new Date(evenement.created * 1000),
      );
    }

    res.status(200).json({ recu: true });
  } catch (error) {
    console.error(`Erreur du webhook Stripe ${evenement.id} :`, error);

    // Signale l'échec du traitement pour permettre une nouvelle livraison.
    res.sendStatus(500);
  }
}
