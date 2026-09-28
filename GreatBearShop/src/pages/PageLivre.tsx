import { useState } from 'react'
import livres from '../data/livres'
import CarteLivre from '../components/CarteLivre'

function PageLivre() {


  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Livres</h1>

      

      <div className="row g-4">
       <div className="col-12 col-sm-6 col-lg-3" key={livres.id}>
            <CarteLivre livre={livres} />
          </div>
      </div>
    </div>
  )
}

export default PageLivre