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
    <div className="card h-100">
      <div
        style={{
          height: '250px',
          backgroundColor: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>Image du produit</span>
      </div>

      <div className="card-body">
        <p className="text-muted mb-1">
          {livre.titre}
        </p>

        <h5 className="card-title">
          {livre.auteur}
        </h5>

        <p className="card-text text-muted">
          {livre.maison_edition}
        </p>

         <p className="card-text text-muted">
          {livre.annee_publication}
        </p>

         <p className="card-text text-muted">
          {livre.nombre_pages} pages
        </p>

        <p className="fw-bold">
          {livre.prix.toFixed(2)} $
        </p>
        

        <button className="btn btn-dark w-100">
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

export default CarteLivre