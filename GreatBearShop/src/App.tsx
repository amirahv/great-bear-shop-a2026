import { useState } from 'react'
import Clothing from './pages/Clothing'
import Livres from './pages/PageLivre'

function App() {
  const [page, setPage] = useState('clothing')

  return (
    <>
      {/* Navigation temporaire */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">
            The Great Bear Shop
          </span>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => setPage('clothing')}
            >
              Vêtements
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => setPage('livres')}
            >
              Livres
            </button>
          </div>
        </div>
      </nav>

      {/* Affichage de la page sélectionnée */}
      {page === 'clothing' && <Clothing />}
      {page === 'livres' && <Livres />}
    </>
  )
}

export default App