import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import { Request, Response } from "express";
import { ItemAchat } from "../models/itemAchat.model.js";
import { Produit } from "../models/produit.model.js";
import { Commande } from "../models/commande.model.js";

/**
 * Developpement du controlleur pour la collection "commandes" de la base de données "GreatBearShop"
 *
 * Fonctions:
 * Create : creerCommande()
 * Read :
 * Update :
 * Delete :
 *
 * @author Martin Ore Rodriguez
 */

// CREATE
// creation d'une commande a partir du panier d'un utilisateur
export async function creerCommande(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId = req.params.utilisateurId;

    // validation de l'id en parametre
    if (!ObjectId.isValid(utilisateurId.toString())) {
      res.status(400).json({
        message: "L'identifiant de l'utilisateur n'est pas valide",
      });
      return;
    }

    // on recupere le panier de l'utilisateur desire
    const utilisateur = await getDb()
      .collection("utilisateurs")
      .findOne(
        { _id: new ObjectId(utilisateurId.toString()) },
        { projection: { panier: 1 } },
      );

    // validation que le panier de l'utilisateur existe dans la base de donnees
    if (!utilisateur || utilisateur.panier.lenght() === 0) {
      res.status(404).json({
        message: "Utilisateur ou panier introuvable",
      });
      return;
    }

    const collectionProduit = getDb().collection<Produit>("produits");

    // TODO : revoir comment un item panier a ete developpe par Amir
    const achat = await Promise.all(
      utilisateur.panier.map(async (item: ItemAchat) => {
        const prix = await collectionProduit.findOne(
          { _id: item.produitId },
          { projection: { prix: 1 } },
        );
      }),
    );

    // methode en standby!!!! Pour continuer, il faut parler avec Amir
  } catch (error) {
    console.error(`[${new Date().toISOString()}] creerCommande() ->`, error);

    res.status(500).json({
      message: "Impossible de creer la commande",
    });
  }
}

/**
 * READ
 *
 * API qui accede a toutes les commandes passees pour un utilisateur specifique
 *
 * @param req ID de l'utilisateur
 * @param res array contenant les commandes ou un message d'erreur
 * @returns message d'erreur lorsque les validations echoues
 *
 * @author Martin Ore Rodriguez
 */
export async function obtenirCommandeParUtilisateurId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId = req.params.id;

    if (!ObjectId.isValid(utilisateurId.toString())) {
      res.status(400).json({
        message: "Identifiant non valide",
      });

      return;
    }

    const commande = await getDb()
      .collection<Commande>("commandes")
      .find({ _id: new ObjectId(utilisateurId.toString()) })
      .toArray();

    if (commande.length === 0) {
      res.status(404).json({
        message: "Panier vide",
      });

      return;
    }

    // retourne le array contenant toutes les commandes passees
    res.status(200).json(commande);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] obtenirCommandeParUtilisateurId() ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de retrouver la commande passee",
    });
  }
}

/**
 * Read
 *
 * API qui retourne la liste complete des commandes passees
 *
 * @param req rien en param ou en body
 * @param res liste des commandes ou message d'erreur
 *
 * @author Martin Ore Rodriguez
 */
export async function obtenirTousCommandes(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const commandes = await getDb()
      .collection<Commande>("commandes")
      .find()
      .toArray();

    if (commandes.length === 0) {
      res.status(404).json({
        message: "Aucune commande trouvee",
      });
    }

    res.status(200).json(commandes);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] obtenirTousCommande() -> `,
      error,
    );

    res.status(500).json({
      message: "Impossible de retrouver les commandes passees",
    });
  }
}

/**
 * UPDATE
 *
 * API qui actualise le statut d'une commande
 *
 * @param req Id d'une commande et le nouveau statut
 * @param res confirmation de l'actualisation ou message d'erreur
 * @returns message d'erreur lorsque l'id n'est pas valide
 *
 * @author Martin Ore Rodriguez
 */
export async function actualiserStatutCommande(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const commandeId = req.body.commandeId;

    if (!ObjectId.isValid(commandeId.toString())) {
      res.status(400).json({
        message: "Identifiant invalide",
      });

      return;
    }

    const nouveauStatut = req.body.statut;

    const resultat = await getDb()
      .collection<Commande>("commandes")
      .updateOne(
        { _id: commandeId },
        {
          $set: {
            statut: nouveauStatut,
            dateModification: new Date(),
          },
        },
      );

    if (resultat.modifiedCount === 2) {
      res.status(200).json({
        message: "Statut de la commande actualise",
      });
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] actualiserStatutCommande() -> `,
      error,
    );

    res.status(500).json({
      message: "Impossible d'actualiser une commande",
    });
  }
}

/**
 * DELETE
 *
 * API qui supprime une commande a partir de son identifiant
 *
 * @param req identifiant d'une commande
 * @param res confirmation de la commande supprimee ou message d'erreur
 * @returns message d'erreur lorsque les validations echoues
 */
export async function supprimerCommande(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const commandeId = req.params.id;

    if (!ObjectId.isValid(commandeId.toString())) {
      res.status(400).json({
        message: "Identifiant invalide",
      });
      return;
    }

    const resultat = await getDb()
      .collection<Commande>("commandes")
      .deleteOne({ _id: new ObjectId(commandeId.toString()) });

    if (resultat.deletedCount === 1) {
      res.status(200).json({
        message: "Commande supprimee avec succes",
      });
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] supprimerCommande() -> `,
      error,
    );

    res.status(500).json({
      message: "Impossible de supprimer la commande",
    });
  }
}
