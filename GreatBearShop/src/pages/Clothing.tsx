import { useState } from 'react'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

function Clothing() {
  const [gender, setGender] = useState('Tous')

  const filteredProducts =
    gender === 'Tous'
      ? products
      : products.filter((product) => product.gender === gender)

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Vêtements</h1>

      <div className="d-flex justify-content-center gap-2 mb-5">
        <button
          className="btn btn-dark"
          onClick={() => setGender('Tous')}
        >
          Tous
        </button>

        <button
          className="btn btn-outline-dark"
          onClick={() => setGender('Femme')}
        >
          Femme
        </button>

        <button
          className="btn btn-outline-dark"
          onClick={() => setGender('Homme')}
        >
          Homme
        </button>
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Clothing