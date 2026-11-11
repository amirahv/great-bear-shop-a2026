import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import { Request, Response } from "express";
import { ItemAchat } from "../models/itemAchat.model.js";
import { Produit } from "../models/produit.model.js";
import { Commande } from "../models/commande.model.js";
import { Collection } from "../types/colllectionNoms.type.js";
import { StatutCommande } from "../types/statutCommande.type.js";
import { Panier } from "../models/panier.model.js";
import { Adresse } from "../types/adresse.type.js";
import { AdresseType } from "../types/adresse-type.type.js";

/**
 * Developpement du controlleur pour la collection "commandes" de la base de données "GreatBearShop"
 *
 * Fonctions:
 *  Create : creerCommande()
 *  Read : obternirCommandeParUtilisateur(), obtenirToutesCommandes()
 *  Update : actualiserStatutCommande()
 *  Delete : supprimerCommande()
 *
 * Note : l'inventaire n'est pas modifie dans ce controller, les fonctions qui actualise l'inventaire seront fait ulterieurment
 *
 * @author Martin Ore Rodriguez
 */

const TAXES_QUEBEC = 0.14975;

// permet d'arrondir le format a 2 decimales
const arrondir = (montant: number): number => Math.round(montant * 100) / 100;

// validation qui s'assure qu'un string ne soit pas vide
const estTextNonVide = (valeur: unknown): valeur is string =>
  typeof valeur === "string" && valeur.trim().length > 0;

// validation qui s'assure qu'un nombre est un entier positif
const estEntierPositif = (valeur: unknown): valeur is number =>
  typeof valeur === "number" && Number.isInteger(valeur) && valeur > 0;

/**
 * Fonction qui valide l'adresse recue dans le body et retourne une adresse validee
 *
 * @param adresse valeur recue dans req.body.destination
 * @returns une adresse qui a ete valide selon notre model ou null si elle n'est pas valide
 *
 * @author Martin Ore Rodriguez
 */
function validerAdresse(adresse: unknown): Adresse | null {
  if (!adresse || typeof adresse !== "object") {
    return null;
  }

  const {
    type,
    noCivic,
    rue,
    numAppartement,
    ville,
    province,
    pays,
    codePostal,
  } = adresse as Record<string, unknown>;

  // validation des champs obligatoires
  if (
    !estEntierPositif(noCivic) ||
    !estTextNonVide(rue) ||
    !estTextNonVide(ville) ||
    !estTextNonVide(province) ||
    !estTextNonVide(pays) ||
    !estTextNonVide(codePostal)
  ) {
    return null;
  }

  // champs optionnels : s'ils sont present, ils doivent etre valides
  // numero d'appertement
  if (numAppartement !== undefined && !estEntierPositif(numAppartement)) {
    return null;
  }
  // le type d'adresse
  if (
    type !== undefined &&
    !Object.values(AdresseType).includes(type as AdresseType)
  ) {
    return null;
  }

  // construction de l'adresse apres les etapes de validation ci-haut
  const adresseValide: Adresse = {
    noCivic,
    rue: rue.trim(),
    ville: ville.trim(),
    province: province.trim(),
    pays: pays.trim(),
    codePostal: codePostal.trim(),
  };

  if (type !== undefined) adresseValide.type = type as AdresseType;
  if (numAppartement !== undefined)
    adresseValide.numAppartement = numAppartement;

  /*
  Ici, l'adresse preferee de l'utilisateur est ignore, car il peut choisir une autre adresse de son choix qui ne figure pas
  parmis les choix deja sauvegarde de celui-ci
  Le frontend envoi un objet de type Adresse, on le valide en backend et on construit notre commande
  */

  return adresseValide;
}

/**
 * API qui permet de creer une nouvelle commande a partir d'un panier d'un utilisateur
 *
 * @param req token qui contient une version Utilisateur public
 * @param res commande cree ou messages d'erreurs
 * @returns commande cree
 *
 * @author Martin Ore Rodriguez
 */
export async function creerCommande(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const utilisateurId = req.user?._id;

    // validation de l'id en parametre
    if (!utilisateurId) {
      res.status(401).json({
        message: "Utilisateur non authentifié",
      });

      return;
    }

    // l'adresse de livraison choisie par l'utilisateur est envoyee dans le body
    const destination = validerAdresse(req.body?.destination);

    // on valide que la destination as Adresse respecte notre model et qu'elle ne soit pas vide
    if (!destination) {
      res.status(400).json({
        message: "L'adresse de livraison est manquante ou invalide",
      });

      return;
    }

    // acces a notre DB
    const db = getDb();

    // on recupere le panier pour un utilisateur
    const panier = await db
      .collection<Panier>(Collection.PANIERS)
      .findOne({ utilisateurId });

    if (!panier) {
      res.status(404).json({
        message: "Panier introuvable",
      });

      return;
    }

    if (panier.articles.length === 0) {
      res.status(400).json({
        message: "Le panier est vide",
      });

      return;
    }

    // on recupere les id de chaque produit dans le panier
    const produitIds = panier.articles.map((article) => article.produitId);

    // on recupere le prix de chacun des produits dans le panier
    const produits = await db
      .collection<Produit>(Collection.PRODUITS)
      .find({ _id: { $in: produitIds } }, { projection: { prix: 1 } })
      .toArray();

    // on cree un dictionnaire <produitId, prix>
    const prixParProduit = new Map<string, number>(
      produits.map((produit) => [produit._id.toString(), produit.prix]),
    );

    // attribut d'une commande, contient tous les elements achete
    const achat: ItemAchat[] = [];

    for (const article of panier.articles) {
      // on recupere le prix du produit se trouvant dans le panier a partir du dictionnaire prixParProduit<>
      const prix = prixParProduit.get(article.produitId.toString());

      if (prix === undefined) {
        res.status(404).json({
          message: `Produit introuvable: ${article.produitId.toString()}`,
        });

        return;
      }

      // on construit un objet contenant les informations pour le type itemAchat dans le modele commande
      achat.push({
        produitId: article.produitId,
        quantite: article.quantite,
        prix,
      });
    }

    // Array.reduce() =comme= iter.sum()
    const prixTotalAvantTaxes = arrondir(
      achat.reduce((total, item) => total + item.prix * item.quantite, 0),
    );

    const prixTotalApresTaxes = arrondir(
      prixTotalAvantTaxes * (1 + TAXES_QUEBEC),
    );

    // date de la creation de la commmande, premiere modification
    const maintenant = new Date();

    // nouvelle commande construite
    const nouvelleCommande: Commande = {
      utilisateurId,
      achat,
      destination,
      statut: StatutCommande.RECU,
      prixTotalAvantTaxes,
      prixTotalApresTaxes,
      dateAchat: maintenant,
      dateModification: maintenant,
    };

    // nouvelle commande ajoutee a la base de donnee
    const resultat = await db
      .collection<Commande>(Collection.COMMANDES)
      .insertOne(nouvelleCommande);

    // on vide le panier d'un utilisateur apres avoir confirme l'achat
    await db.collection<Panier>(Collection.PANIERS).updateOne(
      { _id: panier._id },
      {
        $set: {
          articles: [],
          dateModification: new Date(),
        },
      },
    );

    res.status(201).json({
      message: "Commande cree avec succes",
      commande: { ...nouvelleCommande, _id: resultat.insertedId },
    });
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
    const utilisateurId = req.user?._id;

    if (!utilisateurId) {
      res.status(400).json({
        message: "Utilisateur non authentifie",
      });

      return;
    }

    const commande = await getDb()
      .collection<Commande>(Collection.COMMANDES)
      .find({ utilisateurId })
      .toArray();

    if (commande.length === 0) {
      res.status(404).json({
        message: "Aucune commande trouvée pour cet utilisateur",
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
 * READ
 *
 * API qui retourne la liste complete des commandes passees
 *
 * @param req rien en param ou en body
 * @param res liste des commandes ou message d'erreur
 *
 * @author Martin Ore Rodriguez
 */
export async function obtenirToutesCommandes(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const commandes = await getDb()
      .collection<Commande>(Collection.COMMANDES)
      .find()
      .toArray();

    if (commandes.length === 0) {
      res.status(404).json({
        message: "Aucune commande trouvee",
      });

      return;
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

    // le nouveau statut se trouve dans le body du request
    const nouveauStatut = req.body.statut;

    // verification que le nouveau statut soit valide et qu'ils soit compris parmis les choix possible
    if (!Object.values(StatutCommande).includes(nouveauStatut)) {
      res.status(400).json({
        message: "Statut invalide",
      });

      return;
    }

    const resultat = await getDb()
      .collection<Commande>(Collection.COMMANDES)
      .updateOne(
        { _id: new ObjectId(commandeId.toString()) },
        {
          $set: {
            statut: nouveauStatut,
            dateModification: new Date(),
          },
        },
      );

    // matchedCount === 0 signifie qu'aucune commande ne porte cet id
    // donc, la commande n'a pas ete creee
    if (resultat.matchedCount === 0) {
      res.status(404).json({
        message: "Commande introuvable",
      });

      return;
    }

    res.status(200).json({
      message: "Statut de la commande actualise",
    });
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
 *
 * @author Martin Ore Rodriguez
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
      .collection<Commande>(Collection.COMMANDES)
      .deleteOne({ _id: new ObjectId(commandeId.toString()) });

    // aucune commande trouvee pour la supprimer
    if (resultat.deletedCount === 0) {
      res.status(404).json({
        message: "Commande introuvable",
      });

      return;
    }

    res.status(200).json({
      message: "Commande supprimee avec succes",
    });
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
