import { ObjectId } from "mongodb";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Adresse } from "../types/adresse.type.js";
import { ItemAchat } from "./itemAchat.model.js";

/**
 * Informations de paiement associées à une commande.
 *
 * @author Amir
 */
export interface PaiementCommande {
  statut: "EN_ATTENTE" | "PAYE" | "ECHEC" | "ANNULE" | "EXPIRE";

  // Identifie la page de paiement créée chez Stripe.
  stripeSessionId?: string;

  // Identifie le paiement Stripe associé à cette commande.
  stripePaymentIntentId?: string;

  datePaiement?: Date;

  // Conserve une expiration fixe pour les nouvelles tentatives de création.
  stripeDateExpiration?: Date;

  // Indique que les quantités achetées ont été retirées du panier.
  panierActualise?: boolean;

  // Indique que toutes les quantités réservées ont été remises en stock.
  stockLibere?: boolean;
}

/**
 * Ce modele represente une commande passe par un utilisateur
 *
 * @author Martin Ore Rodriguez
 */
export interface Commande {
  _id?: ObjectId;
  utilisateurId: ObjectId;
  // Identifie une tentative d'achat pour retrouver sa commande lors d'un nouvel envoi (Amir).
  cleTentative?: string;
  achat: ItemAchat[];
  destination: Adresse;
  statut: StatutCommande;
  // Suit le paiement indépendamment de la préparation et de la livraison (Amir).
  paiement?: PaiementCommande;
  prixTotalAvantTaxes: number;
  prixTotalApresTaxes: number;
  dateAchat: Date;
  dateModification: Date;
}
