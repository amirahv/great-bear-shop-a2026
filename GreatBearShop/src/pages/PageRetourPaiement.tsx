import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

type StatutPaiement = "EN_ATTENTE" | "PAYE" | "ECHEC" | "ANNULE" | "EXPIRE";

interface ReponsePaiement {
  message?: string;
  paiement?: {
    statut: StatutPaiement;
  };
}

// Associe chaque statut enregistré au message présenté au client.
const messages: Record<StatutPaiement, { texte: string; couleur: string }> = {
  PAYE: {
    texte: "Paiement réussi ! Votre commande est confirmée.",
    couleur: "success",
  },
  EN_ATTENTE: {
    texte:
      "Le paiement n'est pas encore confirmé. Vous pouvez actualiser son état.",
    couleur: "warning",
  },
  ECHEC: {
    texte: "Le paiement a échoué.",
    couleur: "danger",
  },
  ANNULE: {
    texte: "Le paiement a été annulé.",
    couleur: "warning",
  },
  EXPIRE: {
    texte: "La session de paiement a expiré. Le stock réservé a été libéré.",
    couleur: "warning",
  },
};

function PageRetourPaiement() {
  const [parametres] = useSearchParams();
  const commandeId = parametres.get("commandeId");

  const [statut, setStatut] = useState<StatutPaiement | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    // Empêche une ancienne requête de modifier une page quittée.
    let actif = true;
    const controleur = new AbortController();

    async function verifierPaiement() {
      setChargement(true);
      setErreur("");
      setStatut(null);

      if (!commandeId) {
        setErreur("L'identifiant de la commande est manquant.");
        setChargement(false);
        return;
      }

      try {
        const reponse = await fetch(
          "http://localhost:4000/api/paiements/synchroniser",
          {
            method: "POST",

            // Transmet le cookie de l'utilisateur connecté.
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ commandeId }),
            signal: controleur.signal,
          },
        );

        if (reponse.status === 401) {
          throw new Error(
            "Connectez-vous avec le compte utilisé pour cette commande.",
          );
        }

        const donnees: ReponsePaiement = await reponse.json();

        if (!reponse.ok) {
          throw new Error(
            donnees.message || "Impossible de vérifier le paiement.",
          );
        }

        if (!donnees.paiement) {
          throw new Error("Les informations du paiement sont manquantes.");
        }

        if (actif) {
          // Le statut provient du backend, qui consulte Stripe.
          setStatut(donnees.paiement.statut);
        }
      } catch (error) {
        if (actif) {
          setErreur(
            error instanceof Error
              ? error.message
              : "Impossible de joindre le serveur.",
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void verifierPaiement();

    return () => {
      actif = false;
      controleur.abort();
    };
  }, [commandeId, tentative]);

  const message = statut ? messages[statut] : null;

  return (
    <div className="container py-5">
      <h1 className="mb-4">État du paiement</h1>

      {chargement && <p role="status">Vérification du paiement en cours…</p>}

      {erreur && (
        <div className="alert alert-danger" role="alert">
          {erreur}
        </div>
      )}

      {!chargement && message && (
        <div className={`alert alert-${message.couleur}`} role="status">
          {message.texte}
        </div>
      )}

      <div className="d-flex flex-wrap gap-3">
        {commandeId && (
          <button
            type="button"
            className="btn btn-primary"
            disabled={chargement}
            onClick={() => setTentative((valeur) => valeur + 1)}
          >
            Actualiser l'état
          </button>
        )}

        <Link to="/panier" className="btn btn-outline-secondary">
          Voir mon panier
        </Link>

        {erreur && (
          <Link to="/connexion" className="btn btn-outline-secondary">
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
}

export default PageRetourPaiement;
