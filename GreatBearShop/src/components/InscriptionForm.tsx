/**
 * Ce component presente le formulaire d'inscription au site web et a ete realise par
 *
 * @author Kayla
 *
 */

/**
 * L'integration du backend vers le frontend a ete realise par
 *
 * @author Martin Ore Rodriguez
 *
 * Modifications necessaires apportees :
 *  -> retrait du "username"
 *  -> modification de la nomenclature des attributs d'un Utilisateur pour que ce soit similaire a notre model
 *  -> longueur minimale d'un mot de passe est 8 caracteres (comme definit dans le backend)
 *  -> retrait de l'affichage dans la console
 *  -> ajouts des interfaces necessaires pour la formation des objets json pour le backend
 *  -> ajout de react-hot-toast dependances pour la gestion des erreurs
 *  -> ajout de commentaires
 *  -> ajout des iputs pour le remplissage du formulaire d'adresse
 *
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdresseType } from "../../../server/src/types/adresse-type.type";
import toast, { Toaster } from "react-hot-toast";

// point d'acces au backend
const API_URL = import.meta.env.VITE_API_URL;

// definit l'adresse d'un utilisateur
interface FormulaireAdresse {
  type: AdresseType;
  noCivic: string;
  rue: string;
  numAppartement: string;
  ville: string;
  province: string;
  pays: string;
  codePostal: string;
  isAdresseParDefaut?: boolean;
}

// definit les donnees necessaires pour pouvoir creer un nouvel utilisateur
interface FormulaireUtilisateur {
  nom: string;
  prenom: string;
  courriel: string;
  motDePasse: string;
  adresse?: FormulaireAdresse[];
}

// definit la reponse apres la creation et l'ajout d'un nouvel utilisateur
// version public d'un utilisateur (sans mot de passe)
interface UtilisateurPublic {
  nom: string;
  prenom: string;
  courriel: string;
  role: string;
  adresse?: FormulaireAdresse[];
  dateCreation: string;
}

// permet l'inscription d'un nouvel utilsateur dans la base de donnees
async function InscrireUtilisateur(
  donnees: FormulaireUtilisateur,
): Promise<UtilisateurPublic> {
  const reponse = await fetch(`${API_URL}/api/utilisateurs/ajouter`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(donnees),
  });

  // si les donnees et l'inscription echoue
  const data = await reponse.json().catch(() => null);

  // si on recoit une reponse negative du serveur
  if (!reponse.ok) {
    throw new Error(data?.message ?? "Impossible de de créer le compte.");
  }

  return data as UtilisateurPublic;
}

// Retourne la page d'inscription
function InscriptionForm() {
  const navigate = useNavigate();

  // states des donnees du formulaires
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [courriel, setEmail] = useState("");
  const [motDePasse, setPassword] = useState("");
  const [confirmationMotDePasse, setConfirmPassword] = useState("");

  // informations formulaire pour l'adresse de l'utilisateur
  const [type, setType] = useState(AdresseType.AUTRE);
  const [noCivic, setNoCivic] = useState("");
  const [rue, setRue] = useState("");
  const [numAppartement, setnumAppartement] = useState("");
  const [ville, setVille] = useState("");
  const [province, setProvince] = useState("");
  const [pays, setPays] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [isAdresseParDefaut, setIsAdresseParDefaut] = useState(true);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (motDePasse !== confirmationMotDePasse) {
      //alert("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // on construit les informations pour l'adresse
      const adresse: FormulaireAdresse = {
        type,
        noCivic,
        rue,
        numAppartement,
        ville,
        province,
        pays,
        codePostal,
        isAdresseParDefaut,
      };

      // formulair de l'utilsateur qui contient toutes ses informations
      const formulaire: FormulaireUtilisateur = {
        nom,
        prenom,
        courriel,
        motDePasse,
        adresse: [adresse],
      };

      await InscrireUtilisateur(formulaire);

      // si l'ajout de l'utilisateur est reussi, alors on navigue vers son profil
      navigate("/profil");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Vérifiez les champs saisies.";

      toast.error(message);
    }
  };

  return (
    <div className="container mt-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 mb-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4 text-dark">Créer un compte</h2>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3">
                    <label htmlFor="prenom" className="form-label fw-bold">
                      Prénom
                    </label>

                    <input
                      type="text"
                      id="prenom"
                      className="form-control"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nom" className="form-label fw-bold">
                      Nom
                    </label>

                    <input
                      type="text"
                      id="nom"
                      className="form-control"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Adresse courriel
                  </label>

                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={courriel}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Mot de passe
                  </label>

                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={motDePasse}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />

                  <div className="form-text">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-bold"
                  >
                    Confirmer le mot de passe
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    style={{ fontWeight: "bold" }}
                    value={confirmationMotDePasse}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <h5 className="mt-4 mb-3 text-dark">Adresse</h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-3">
                    <label htmlFor="noCivic" className="form-label fw-bold">
                      No civique
                    </label>

                    <input
                      type="number"
                      min={1}
                      id="noCivic"
                      className="form-control"
                      value={noCivic}
                      onChange={(e) => setNoCivic(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="rue" className="form-label fw-bold">
                      Rue
                    </label>

                    <input
                      type="text"
                      id="rue"
                      className="form-control"
                      value={rue}
                      onChange={(e) => setRue(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      htmlFor="numAppartement"
                      className="form-label fw-bold"
                    >
                      App.
                    </label>

                    <input
                      type="number"
                      min={1}
                      id="numAppartement"
                      className="form-control"
                      value={numAppartement}
                      onChange={(e) => setnumAppartement(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="ville" className="form-label fw-bold">
                      Ville
                    </label>

                    <input
                      type="text"
                      id="ville"
                      className="form-control"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="codePostal" className="form-label fw-bold">
                      Code postal
                    </label>

                    <input
                      type="text"
                      id="codePostal"
                      className="form-control"
                      value={codePostal}
                      onChange={(e) => setCodePostal(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="province" className="form-label fw-bold">
                      Province
                    </label>

                    <input
                      type="text"
                      id="province"
                      className="form-control"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="pays" className="form-label fw-bold">
                      Pays
                    </label>

                    <input
                      type="text"
                      id="pays"
                      className="form-control"
                      value={pays}
                      onChange={(e) => setPays(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <span className="form-label fw-bold d-block">
                      Type d'adresse
                    </span>

                    {Object.values(AdresseType).map((valeur) => (
                      <div
                        className="form-check form-check-inline"
                        key={valeur}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="typeAdresse"
                          id={`typeAdresse-${valeur}`}
                          value={valeur}
                          checked={type === valeur}
                          onChange={() => setType(valeur)}
                        />

                        <label
                          className="form-check-label"
                          htmlFor={`typeAdresse-${valeur}`}
                        >
                          {valeur}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-12 mb-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isAdresseParDefaut"
                      checked={isAdresseParDefaut}
                      onChange={(e) => setIsAdresseParDefaut(e.target.checked)}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="isAdresseParDefaut"
                    >
                      Utiliser comme adresse par défaut
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  S'inscrire
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Vous avez déjà un compte ?{" "}
                <Link to="/connexion" className="text-primary">
                  Se Connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InscriptionForm;
