import { getDb } from "../db/mongo.js";
import type { Commande } from "../models/commande.model.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { preparerReservationCommande } from "./reservationCommande.service.js";
import { libererReservationExpiree } from "./expirationPaiement.service.js";

let recuperationEnCours = false;
let minuteur: ReturnType<typeof setInterval> | undefined;

/**
 * Reprend les opérations interrompues avec les services existants.
 *
 * @author Amir
 */
export async function recupererReservationsInterrompues(): Promise<void> {
  // Évite que deux cycles se chevauchent dans ce processus.
  if (recuperationEnCours) {
    return;
  }

  recuperationEnCours = true;

  try {
    const commandes = await getDb()
      .collection<Commande>(Collection.COMMANDES)
      .find(
        {
          $or: [
            {
              etatReservation: "EN_COURS",
              statut: StatutCommande.RECU,
              "paiement.statut": "EN_ATTENTE",
            },
            {
              etatReservation: "LIBERATION_EN_COURS",
              statut: StatutCommande.ANNULEE,
              "paiement.statut": {
                $in: ["ECHEC", "ANNULE", "EXPIRE"],
              },
            },
            {
              statut: StatutCommande.ANNULEE,
              "paiement.statut": "EXPIRE",
              "paiement.stockLibere": { $ne: true },
              "paiement.stripeSessionId": {
                $type: "string",
                $ne: "",
              },
            },
          ],
        },
        { projection: { _id: 1, paiement: 1 } },
      )
      .toArray();

    for (const commande of commandes) {
      try {
        if (
          commande.paiement?.statut === "EXPIRE" &&
          commande.paiement.stripeSessionId
        ) {
          // Vérifie à nouveau l'expiration auprès de Stripe.
          await libererReservationExpiree(commande.paiement.stripeSessionId);
        } else {
          await preparerReservationCommande(commande._id);
        }
      } catch (error) {
        // Une commande en erreur ne bloque pas les autres.
        console.error(
          `Reprise impossible pour la commande ${commande._id.toHexString()} :`,
          error,
        );
      }
    }

    if (commandes.length > 0) {
      console.log(
        `[Réservations] ${commandes.length} commande(s) examinée(s).`,
      );
    }
  } catch (error) {
    console.error(
      "Impossible de rechercher les réservations interrompues :",
      error,
    );
  } finally {
    // Autorise une nouvelle tentative même après une erreur.
    recuperationEnCours = false;
  }
}

/**
 * Lance une première reprise, puis réessaie périodiquement.
 *
 * @author Amir
 */
export function demarrerRecuperationReservations(): void {
  // Empêche de créer plusieurs minuteurs.
  if (minuteur) {
    return;
  }

  minuteur = setInterval(() => {
    void recupererReservationsInterrompues();
  }, 60_000);

  console.log("Récupération automatique des réservations démarrée.");

  void recupererReservationsInterrompues();
}
