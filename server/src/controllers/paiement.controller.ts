import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { stripe } from "../services/stripe.service.js";

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
