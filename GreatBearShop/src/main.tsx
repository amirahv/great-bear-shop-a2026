import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

import HomePage from "./HomePage.tsx";
import Clothing from "./pages/Clothing.tsx";
import Livres from "./pages/PageLivres.tsx";
import Connexion from "./pages/PageConnexion";
import Inscription from "./pages/PageInscription.tsx";

import { createBrowserRouter, RouterProvider } from "react-router";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/clothing",
    element: <Clothing />,
  },
  {
    path: "/livres",
    element: <Livres />,
  },

  {
    path: "/connexion",
    element: <Connexion />,
  },

  {
    path: "/inscription",
    element: <Inscription />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);