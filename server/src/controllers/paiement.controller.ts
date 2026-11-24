import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { stripe } from "../services/stripe.service.js";
import { libererReservationExpiree } from "../services/expirationPaiement.service.js";
import { confirmerPaiement } from "../services/confirmationPaiement.service.js";

/**
 * Crée ou retrouve une session Stripe pour une commande en attente.
 * Le montant provient exclusivement de la commande enregistrée.
 *
 * @author Amir
 */
export async function creerSessionPaiement(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId = req.user?._id;

    if (!utilisateurId) {
      res.status(401).json({
        message: "Connectez-vous pour payer votre commande.",
      });
      return;
    }

    const commandeId: unknown = req.body?.commandeId;

    if (typeof commandeId !== "string" || !ObjectId.isValid(commandeId)) {
      res.status(400).json({
        message: "L'identifiant de la commande est invalide.",
      });
      return;
    }

    const adresseFrontend = process.env.FRONTEND_REACT;

    if (!adresseFrontend) {
      throw new Error("La variable FRONTEND_REACT est manquante.");
    }

    const frontend = adresseFrontend.replace(/\/$/, "");
    const identifiant = new ObjectId(commandeId);
    const commandes = getDb().collection<Commande>(Collection.COMMANDES);

    // Vérifie également que la commande appartient à l'utilisateur connecté.
    const commande = await commandes.findOne({
      _id: identifiant,
      utilisateurId,
    });

    if (!commande) {
      res.status(404).json({
        message: "Commande introuvable.",
      });
      return;
    }

    // Permet de reprendre une libération interrompue.
    if (
      commande.paiement?.statut === "EXPIRE" &&
      commande.paiement.stripeSessionId
    ) {
      await libererReservationExpiree(commande.paiement.stripeSessionId);

      res.status(409).json({
        message: "La session a expiré. Le stock réservé a été libéré.",
      });
      return;
    }

    if (
      commande.statut !== StatutCommande.RECU ||
      commande.paiement?.statut !== "EN_ATTENTE"
    ) {
      res.status(409).json({
        message: "Cette commande n'est pas en attente de paiement.",
      });
      return;
    }

    // Stripe attend un montant entier en cents pour le dollar canadien.
    const montantEnCents = Math.round(commande.prixTotalApresTaxes * 100);

    if (!Number.isSafeInteger(montantEnCents) || montantEnCents <= 0) {
      res.status(400).json({
        message: "Le montant de cette commande est invalide.",
      });
      return;
    }

    // Initialise l'expiration une seule fois.
    // La minute supplémentaire laisse une marge au minimum de 30 minutes.
    await commandes.updateOne(
      {
        _id: identifiant,
        utilisateurId,
        statut: StatutCommande.RECU,
        "paiement.statut": "EN_ATTENTE",
        "paiement.stripeDateExpiration": { $exists: false },
      },
      {
        $set: {
          "paiement.stripeDateExpiration": new Date(
            Date.now() + 31 * 60 * 1000,
          ),
        },
      },
    );

    // Relit les informations communes aux éventuelles requêtes simultanées.
    const commandeActualisee = await commandes.findOne({
      _id: identifiant,
      utilisateurId,
      statut: StatutCommande.RECU,
      "paiement.statut": "EN_ATTENTE",
    });

    const paiement = commandeActualisee?.paiement;

    if (!paiement?.stripeDateExpiration) {
      res.status(409).json({
        message: "La commande a changé. Rechargez ses informations.",
      });
      return;
    }

    const referenceCommande = identifiant.toHexString();

    // Retrouve la session existante ou en crée une avec des paramètres fixes.
    const session = paiement.stripeSessionId
      ? await stripe.checkout.sessions.retrieve(paiement.stripeSessionId)
      : await stripe.checkout.sessions.create(
          {
            mode: "payment",
            adaptive_pricing: {
              enabled: false,
            },

            client_reference_id: referenceCommande,

            metadata: {
              commandeId: referenceCommande,
            },

            // Permet aussi d'identifier la commande dans les événements du paiement.
            payment_intent_data: {
              metadata: {
                commandeId: referenceCommande,
              },
            },

            line_items: [
              {
                price_data: {
                  currency: "cad",
                  product_data: {
                    name: `Commande Great Bear Shop ${referenceCommande}`,
                    description: "Montant total, taxes incluses.",
                  },
                  unit_amount: montantEnCents,
                },
                quantity: 1,
              },
            ],

            expires_at: Math.floor(
              paiement.stripeDateExpiration.getTime() / 1000,
            ),

            success_url:
              `${frontend}/paiement/retour` +
              `?commandeId=${referenceCommande}` +
              "&session_id={CHECKOUT_SESSION_ID}",

            cancel_url:
              `${frontend}/paiement/retour` +
              `?commandeId=${referenceCommande}&retour=annule`,
          },
          {
            // Une nouvelle tentative avec les mêmes paramètres retrouve la session.
            idempotencyKey: `commande-${referenceCommande}-checkout-v1`,
          },
        );

    // Enregistre seulement l'identifiant, sans écraser l'état du paiement.
    const resultat = await commandes.updateOne(
      {
        _id: identifiant,
        utilisateurId,
        statut: StatutCommande.RECU,
        "paiement.statut": "EN_ATTENTE",
      },
      {
        $set: {
          "paiement.stripeSessionId": session.id,
          dateModification: new Date(),
        },
      },
    );

    if (resultat.matchedCount === 0) {
      res.status(409).json({
        message: "La commande a changé. Rechargez ses informations.",
      });
      return;
    }

    // Rattrape une expiration survenue avant la réception du webhook.
    if (session.status === "expired") {
      await libererReservationExpiree(session.id);

      res.status(409).json({
        message: "La session a expiré. Le stock réservé a été libéré.",
      });
      return;
    }

    if (session.status !== "open" || !session.url) {
      res.status(409).json({
        message:
          "Cette session est terminée ou expirée. Consultez l'état de la commande.",
      });
      return;
    }

    res.status(200).json({
      commandeId: referenceCommande,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Erreur de création du paiement Stripe :", error);

    // Conserve la commande pour permettre une nouvelle tentative.
    res.status(502).json({
      message: "Impossible de préparer le paiement. Veuillez réessayer.",
    });
  }
}

/**
 * Consulte Stripe pour actualiser le paiement d'une commande.
 * Permet de rattraper une notification manquée.
 *
 * @author Amir
 */
export async function synchroniserPaiement(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId = req.user?._id;

    if (!utilisateurId) {
      res.status(401).json({
        message: "Connectez-vous pour consulter votre paiement.",
      });
      return;
    }

    const commandeId: unknown = req.body?.commandeId;

    if (typeof commandeId !== "string" || !ObjectId.isValid(commandeId)) {
      res.status(400).json({
        message: "L'identifiant de la commande est invalide.",
      });
      return;
    }

    const identifiant = new ObjectId(commandeId);
    const commandes = getDb().collection<Commande>(Collection.COMMANDES);

    // Vérifie que la commande appartient à l'utilisateur connecté.
    const commande = await commandes.findOne({
      _id: identifiant,
      utilisateurId,
    });

    if (!commande) {
      res.status(404).json({
        message: "Commande introuvable.",
      });
      return;
    }

    const sessionId = commande.paiement?.stripeSessionId;

    if (!sessionId) {
      res.status(409).json({
        message: "Cette commande n'a pas de session Stripe.",
      });
      return;
    }

    // Obtient l'état réel auprès de Stripe.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Réutilise les vérifications et protections du webhook.
      await confirmerPaiement(
        session.id,
        commande.paiement?.datePaiement ?? new Date(),
      );
    } else if (
      session.status === "expired" &&
      session.payment_status === "unpaid"
    ) {
      await libererReservationExpiree(session.id);
    }

    const commandeActualisee = await commandes.findOne({
      _id: identifiant,
      utilisateurId,
    });

    if (!commandeActualisee) {
      throw new Error("Commande introuvable après synchronisation.");
    }

    res.status(200).json({
      commandeId: identifiant.toHexString(),
      paiement: commandeActualisee.paiement,
    });
  } catch (error) {
    console.error("Erreur de synchronisation du paiement :", error);

    res.status(502).json({
      message: "Impossible de synchroniser le paiement.",
    });
  }
}
