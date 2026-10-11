import { ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur.model.js";
import { Adresse } from "../types/adresse.type.js";
import { Request, Response } from "express";
import { getDb } from "../db/mongo.js";
import bcrypt from "bcrypt";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";

/**
 * Developpement du controller pour la collection "utilisateur" dans "GreatBearShop"
 *
 * Fonctions:
 * - CREATE : ajouterUtilisateurClient()
 * - READ : getTousUtilisateurs(), getUtilisateurParId(), getUtilisateurParCourriel()
 * - UPDATE : updateUtilisateurParId()
 * - DELETE : deleteUtilisateurParId()
 *
 * Rappel sur les codes de reponse HTTP :
 * - 200 : OK
 * - 201 : Created
 * - 400 : Bad Request
 * - 404 : Not Found
 * - 409 : Conflict
 * - 500 : Internal Server Error
 *    -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
 *
 * @author Martin Ore Rodriguez
 */

// bloque le retour du mot de passe a partir de la base de donnees
const PROJECTION_SANS_MOT_DE_PASSE = { motDePasseHash: 0 };

// cout processus qui determine la complexite hashage hasher des donnees
const NOMBRE_SALT_ROUNDS = 10;

// validation simple de courriel
const REGEX_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * CREATE
 *
 * API qui permet d'ajouter un nouvel utilisateur client a la collection "utilisateurs"
 *
 * @param req req.body contenant les donnees necessaires pour creer un nouvel utilisateur
 * @param res reponse de l'API
 * @returns nouvel utilisateur cree dans la collection "utilisateurs" ou un message d'erreur
 * @author Martin Ore Rodriguez
 */
export async function ajouterUtilisateurClient(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({
        message: "body request invalide.",
      });
      return;
    }

    const { nom, prenom, courriel, motDePasse, adresse } = req.body as Record<
      string,
      unknown
    >;

    // validation des donnees d'un utilisateur
    if (
      typeof nom !== "string" || // verification donnees nom est un string
      nom.trim() === "" || // verification donnees nom n'est pas vide
      typeof prenom !== "string" ||
      prenom.trim() === "" ||
      typeof courriel !== "string" ||
      !REGEX_COURRIEL.test(courriel.trim()) ||
      typeof motDePasse !== "string" ||
      motDePasse.length < 8
    ) {
      res.status(400).json({
        message: "Donnees utilisateurs invalides.",
      });
      return;
    }

    // validation deja fait dans le if superieur que courriel est un string
    const courrielNormalise = (courriel as string).trim().toLowerCase();

    // on reference la collection "utilisateurs"
    const collectionUtilisateur = getDb().collection("utilisateurs");

    // on s'assure qu'un utilisateur n'existe pas avec ce meme courriel
    const utilisateurExistant = await collectionUtilisateur.findOne({
      courriel: courrielNormalise,
    });
    // si un utilisateur existe deja avec ce courriel, on retourne un message d'erreur
    if (utilisateurExistant) {
      res.status(409).json({
        message: "Un utilisteur existe deja avec ce courriel.",
      });

      return;
    }

    // hashage du mot de passe pour le stocker dans la base de donnees
    const motDePasseHash = await bcrypt.hash(
      motDePasse as string,
      NOMBRE_SALT_ROUNDS,
    );

    const nouvelUtilisateur: Omit<Utilisateur, "_id"> = {
      nom: (nom as string).trim(),
      prenom: (prenom as string).trim(),
      courriel: courrielNormalise,
      motDePasseHash,
      role: UtilisateurRole.CLIENT, // par defaut, le role d'un nouvel utilisateur est "client"
      ...(adresse !== undefined ? { adresse: adresse as Adresse[] } : {}), // ternary operator
      dateCreation: new Date(),
      // TODO : ajouter une partie pour la creation du panier
    };

    // ajout du nouvel utilisateur dans la collection "utilisateurs"
    const resultat = await collectionUtilisateur.insertOne(nouvelUtilisateur);

    // _hash est le mot de passe hashé, on ne veut pas le retourner dans la reponse de l'API
    const { motDePasseHash: _hash, ...utilisateurPublic } = nouvelUtilisateur;

    res.status(201).json({
      _id: resultat.insertedId, // retour du _id insere dans la collection
      ...utilisateurPublic,
    });
  } catch (error) {
    console.error("Erreur lors de la creation de l'utilsiateur: ", error);

    res.status(500).json({
      message: "Impossible de creer l'utilisateur",
    });
  }
}

/**
 * READ
 *
 * API qui retourne tous les utilisateurs de la collection "utilisateurs" sans le mot de passe
 *
 * @param req aucune requete n'est necessaire pour cette API, elle retourne tous les utilisateurs
 * @param res liste des utilisateurs de la collection "utilisateurs" sans le mot de passe
 * @author Martin Ore Rodriguez
 */
export async function getTousUtilisateurs(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // on recupere la collection "utilisateurs" et on exclut le mot de passe dans la projection
    const collectionUtilisateur = await getDb()
      .collection("utilisateurs")
      .find({}, { projection: PROJECTION_SANS_MOT_DE_PASSE })
      .toArray();

    // retourne la liste des utilisateurs dans la reponse de l'API
    res.status(200).json(collectionUtilisateur);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] getTousUtilisateurs ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de recuperer les utilisateurs",
    });
  }
}

// READ un utilisateur specifique par son Id MongoDB
/**
 * READ
 *
 * API qui retourne un utilisateur specifique trouve par son ObjectId de la collection "utilisateurs" sans son mot de passe
 *
 * @param req id de l'utilisateur a recuperer dans req.params.id
 * @param res l'utilisateur trouve dans la collection "utilisateurs" sans son mot de passe ou un message d'erreur si l'utilisateur n'est pas trouve
 * @returns l'utilisateur trouve ou un message d'erreur si l'utilisateur n'existe pas
 * @author Martin Ore Rodriguez
 */
export async function getUtilisateurParId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // on recupere l'id de l'utilisateur a partir des parametres de la requete
    const id = req.params.id;

    // validation de l'id pour s'assurer qu'il est un ObjectId valide
    if (!ObjectId.isValid(id.toString())) {
      res.status(400).json({
        message: "Identifiant non valide",
      });
      return;
    }

    // recuperation de l'utilisateur sans son mot de passe
    const utilisateur = await getDb()
      .collection("utilisateurs")
      .findOne(
        { _id: new ObjectId(id.toString()) },
        { projection: PROJECTION_SANS_MOT_DE_PASSE },
      );

    // si l'utilisateur n'est pas trouve, on retourne un message d'erreur
    if (!utilisateur) {
      res.status(404).json({
        message: "utilisateur introuvable",
      });
      return;
    }

    // on retourne l'utilisateur trouve
    res.status(200).json(utilisateur);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] getUtilisateurParId ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de recuperer l'utilisateur",
    });
  }
}

/**
 * READ
 *
 * API qui retourne un utilisateur specifique trouve par son courriel dans la collection "utilisateurs" sans son mot de passe
 *
 * @param req courriel de l'utilisateur a recuperer dans req.body.courriel
 * @param res l'utilisateur trouve dans la collection "utilisateurs" sans son mot de passe ou un message d'erreur si l'utilisateur n'est pas trouve
 * @returns l'utilisateur trouve ou un message d'erreur si l'utilisateur n'existe pas
 */
export async function getUtilisateurParCourriel(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const couriel = req.body.courriel as string;

    // verification du courriel pour s'assurer qu'il est valide
    if (!couriel || !REGEX_COURRIEL.test(couriel) || couriel.trim() === "") {
      res.status(400).json({
        message: "Courriel invalide",
      });
      return;
    }

    // on cherchera l'utilisateur par son courriel dans la collection "utilisateurs" sans son mot de passe
    const utilisateur = await getDb()
      .collection("utilisateurs")
      .findOne(
        { courriel: couriel.trim().toLowerCase() },
        { projection: PROJECTION_SANS_MOT_DE_PASSE },
      );

    // on s'assure que l'utilisateur existe, sinon on retourne un message d'erreur
    if (!utilisateur) {
      res.status(404).json({
        message: "Utilisateur non trouvé",
      });
      return;
    }

    // on retourne l'utilisateur trouve
    res.status(200).json(utilisateur);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] getUtilisateurParCourriel ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de recuperer l'utilisateur par courriel",
    });
  }
}

/**
 * UPDATE
 *
 * API qui met a jour un utilisateur de la collection "utilisateurs" par son ObjectId
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateUtilisateurParId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    // verification de l'id pour s'assurer qu'il est un ObjectId valide
    if (!ObjectId.isValid(id.toString())) {
      res.status(400).json({
        message: "Identifiant non valide",
      });
      return;
    }

    const { nom, prenom, courriel, motDePasse, adresse } = req.body as Record<
      string,
      unknown
    >;

    const updateFields: Partial<Utilisateur> = {};

    // validation des champs a mettre a jour

    if (nom !== undefined) {
      if (typeof nom !== "string" || nom.trim() === "") {
        res.status(400).json({
          message: "Nom invalide",
        });
        return;
      }
      updateFields.nom = nom.trim();
    }

    if (prenom !== undefined) {
      if (typeof prenom !== "string" || prenom.trim() === "") {
        res.status(400).json({
          message: "Prenom invalide",
        });
        return;
      }
      updateFields.prenom = prenom.trim();
    }

    if (courriel !== undefined) {
      if (
        typeof courriel !== "string" ||
        !REGEX_COURRIEL.test(courriel.trim())
      ) {
        res.status(400).json({
          message: "Courriel invalide",
        });
        return;
      }
      updateFields.courriel = courriel.trim().toLowerCase();
    }

    if (motDePasse !== undefined) {
      if (typeof motDePasse !== "string" || motDePasse.length < 8) {
        res.status(400).json({
          message: "Mot de passe invalide",
        });
        return;
      }
      const motDePasseHash = await bcrypt.hash(motDePasse, NOMBRE_SALT_ROUNDS);
      updateFields.motDePasseHash = motDePasseHash;
    }

    if (adresse !== undefined) {
      if (!Array.isArray(adresse)) {
        res.status(400).json({
          message: "Adresse invalide",
        });
        return;
      }
      updateFields.adresse = adresse as Adresse[];
    }

    // si aucun champ n'est fourni pour la mise a jour, on retourne un message d'erreur
    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({
        message: "Aucun champ a mettre a jour",
      });
      return;
    }

    const utilisateur = req.params.id; // utilisateur a mettre a jour
    const collectionUtilisateur = getDb().collection("utilisateurs");

    if (updateFields.courriel) {
      const existant = await collectionUtilisateur.findOne({
        courriel: updateFields.courriel,
        _id: { $ne: new ObjectId(utilisateur.toString()) },
      });

      if (existant) {
        res.status(409).json({
          message: "Un utilisateur existe deja avec ce courriel",
        });
        return;
      }
    }

    // mise a jour de l'utilisateur
    const resultat = await collectionUtilisateur.updateOne(
      { _id: new ObjectId(utilisateur.toString()) },
      { $set: updateFields },
    );

    // si aucun utilisateur n'a ete mis a jour, on retourne un message d'erreur
    if (resultat.matchedCount === 0) {
      res.status(404).json({
        message: "Utilisateur introuvable",
      });
      return;
    }

    res.status(200).json({
      message: "Utilisateur mis a jour avec succes",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] updateUtilisateurParId() ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de mettre a jour l'utilisateur",
    });
  }
}

/**
 * DELETE
 *
 * API qui supprime un utilisateur de la collection "utilisateurs" par son ObjectId (hard delete)
 *
 * @param req id de l'utilisateur a supprimer dans req.params.id
 * @param res message de confirmation de suppression ou un message d'erreur si l'utilisateur n'est pas trouve
 * @returns confirmation ou message d'erreur si l'utilisateur n'existe pas
 * @author Martin Ore Rodriguez
 */
export async function deleteUtilisateurParId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id.toString())) {
      res.status(400).json({
        message: "Identifiant non valide",
      });
      return;
    }

    const resultat = await getDb()
      .collection("utilisateurs")
      .deleteOne({
        _id: new ObjectId(id.toString()),
      });

    if (resultat.deletedCount === 0) {
      res.status(404).json({
        message: "Utilisateur introuvable",
      });
      return;
    }

    res.status(200).json({
      message: "Utilisateur supprime avec succes",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] deleteUtilisateurParId() ->`,
      error,
    );

    res.status(500).json({
      message: "Impossible de supprimer l'utilisateur",
    });
  }
}
