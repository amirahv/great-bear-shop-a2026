import panierTemporaire from "../data/panierTemporaire";

function PagePanier() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Mon panier</h1>

      {panierTemporaire.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        panierTemporaire.map((article) => (
          <div className="card mb-3" key={article.produitId}>
            <div className="card-body">
              <div className="row align-items-center g-3">
                <div className="col-12 col-md-2">
                  {article.images.length > 0 ? (
                    <img
                      src={article.images[0]}
                      alt={article.nom}
                      className="img-fluid"
                      style={{
                        maxHeight: "150px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span className="text-muted">Aucune image</span>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <h2 className="h5">{article.nom}</h2>

                  <p>
                    Prix unitaire :{" "}
                    {article.prixUnitaire !== null
                      ? `${article.prixUnitaire.toFixed(2)} $`
                      : "Prix indisponible"}
                  </p>

                  <p className="mb-0">Quantité : {article.quantite}</p>

                  {!article.disponible && (
                    <p className="text-danger mt-2 mb-0">
                      Article indisponible pour la quantité demandée.
                    </p>
                  )}
                </div>

                <div className="col-12 col-md-4 text-md-end">
                  <p className="fw-bold mb-0">
                    Sous-total :{" "}
                    {article.totalLigne !== null
                      ? `${article.totalLigne.toFixed(2)} $`
                      : "Non calculable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PagePanier;
