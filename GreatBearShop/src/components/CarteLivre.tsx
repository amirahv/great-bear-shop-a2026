type Livre = {
  id: number
  titre: string
  auteur: string
  maison_edition: string
  annee_publication: number
  nombre_pages: number
  prix: number
  image: string
}

type ProductCardProps = {
  livre: Livre
}

function CarteLivre({ livre }: ProductCardProps) {
  return (
    <div className="card h-100 d-flex flex-column">

      {/* IMAGE DU LIVRE */}
      <div
        style={{
          height: '250px',
          backgroundColor: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={livre.image}
          alt={livre.titre}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <p className="text-muted mb-1">
          {livre.auteur}
        </p>

        <h5 className="card-title">
          {livre.titre}
        </h5>

        <p className="card-text text-muted">
          Maison d'édition: {livre.maison_edition}
        </p>

        <p className="card-text text-muted">
          Année de publication: {livre.annee_publication}
        </p>

        <p className="card-text text-muted">
          {livre.nombre_pages} pages
        </p>

        <p className="fw-bold">
          Prix: {livre.prix.toFixed(2)} $
        </p>

        <button className="btn btn-dark w-100 mt-auto">
          Ajouter au panier
        </button>
      </div>

    </div>
  )
}

export default CarteLivre