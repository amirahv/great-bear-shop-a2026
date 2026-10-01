import { BrowserRouter, Routes, Route } from 'react-router'

import Clothing from './pages/Clothing'
import PageLivres from './pages/PageLivres'

function App() {
  return (
    <BrowserRouter>

      <Routes>

    

        <Route path="/clothing" element={<Clothing />} />

        <Route path="/PageLivres" element={<PageLivres />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App