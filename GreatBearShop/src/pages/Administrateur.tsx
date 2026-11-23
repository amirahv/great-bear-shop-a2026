import { useState } from "react";
import CarteCommande from "../components/CarteCommande";
import { commandes } from "../data/commandes";

function Administrateur() {
  const [page, setPage] = useState("commandes");

  return (
    <div className="container py-4">

      {/* Boutons de navigation */}
      <div className="d-flex justify-content-between mb-5">

        <button
          className="btn btn-dark"
          onClick={() => setPage("utilisateurs")}
        >
          Liste d'utilisateurs
        </button>

        <button
          className="btn btn-dark"
          onClick={() => setPage("commandes")}
        >
          Historique de Commande
        </button>

        <button
          className="btn btn-dark"
          onClick={() => setPage("inventaire")}
        >
          Modifier l'inventaire
        </button>

      </div>

      {/* Historique des commandes */}
      {page === "commandes" && (
        <div className="bg-white rounded p-4">

          <h5 className="fw-bold mb-4">
            3 dernières commandes
          </h5>

          <div className="row">
            <div className="col-12">

              {commandes.slice(-3).reverse().map((commande) => (
                <CarteCommande
                  key={commande.id}
                  commande={commande}
                />
              ))}

            </div>
          </div>

        </div>
      )}

      {/* Liste d'utilisateurs */}
      {page === "utilisateurs" && (
        <div className="bg-white rounded p-4">
          <h5 className="fw-bold">
            Liste d'utilisateurs
          </h5>
        </div>
      )}

      {/* Modifier l'inventaire */}
      {page === "inventaire" && (
        <div className="bg-white rounded p-4">
          <h5 className="fw-bold">
            Modifier l'inventaire
          </h5>
        </div>
      )}

    </div>
  );
}

export default Administrateur;