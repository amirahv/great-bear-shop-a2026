import { useState } from 'react'
import Clothing from './pages/Clothing'
import Maple from './pages/Maple'

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
              onClick={() => setPage('maple')}
            >
              Sirop d'érable
            </button>
          </div>
        </div>
      </nav>

      {/* Affichage de la page sélectionnée */}
      {page === 'clothing' && <Clothing />}
      {page === 'maple' && <Maple />}
    </>
  )
}

export default App