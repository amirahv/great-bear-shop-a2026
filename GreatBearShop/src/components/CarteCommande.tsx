type Commande = {
  id: number;
  nom: string;
  description: string;
  quantite: number;
  image: string;
};

type CarteCommandeProps = {
  commande: Commande;
};

function CarteCommande({ commande }: CarteCommandeProps) {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex align-items-center">

        <img
          src={commande.image}
          alt={commande.nom}
          className="me-3"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
          }}
        />

        <div>
          <h5 className="card-title fw-bold">
            {commande.nom}
          </h5>

          <p className="card-text text-muted mb-1">
            {commande.description}
          </p>

          <p className="card-text text-muted">
            Quantité commandée : {commande.quantite}
          </p>
        </div>

      </div>
    </div>
  );
}

export default CarteCommande;