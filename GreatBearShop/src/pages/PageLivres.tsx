import livres from '../data/livres'
import CarteLivre from '../components/CarteLivre'

function PageLivres() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-dark">Livres</h1>

      <div className="row g-4">
        {livres.map((livre) => (
          <div className="col-12 col-sm-6 col-lg-3" key={livre.id}>
            <CarteLivre livre={livre} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PageLivres