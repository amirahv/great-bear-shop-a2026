type Jeu = {
  id: number
  titre: string
  developpeur: string
  editeur: string
  console: string
  prix: number
  image: string
}

type ProductCardProps = {
  jeu: Jeu
}

function CarteJeu({ jeu }: ProductCardProps) {
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
          src={jeu.image}
          alt={jeu.titre}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <p className="text-muted mb-1">
          {jeu.console}
        </p>

        <h5 className="card-title">
          {jeu.titre}
        </h5>

        <p className="card-text text-muted">
            Développeur: {jeu.developpeur}
        </p>

        <p className="card-text text-muted">
            Éditeur: {jeu.editeur}
        </p>

        
        <p className="fw-bold">
          Prix: {jeu.prix.toFixed(2)} $
        </p>

        <button className="btn btn-dark w-100 mt-auto">
          Ajouter au panier
        </button>
      </div>

    </div>
  )
}

export default CarteJeu