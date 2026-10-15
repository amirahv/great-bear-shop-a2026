
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

// MENU ET FOOTER
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES
import HomePage from "./HomePage";
import Clothing from "./pages/Clothing";
import Maple from "./pages/Maple";

// STRUCTURE COMMUNE À TOUTES LES PAGES
function Layout() {
  return (
    <div className="shop-layout">

      {/* MENU EN HAUT */}
      <Navbar />

      {/* CONTENU DE LA PAGE */}
      <main className="shop-main">
        <Outlet />
      </main>

      {/* FOOTER EN BAS */}
      <Footer />

    </div>
  );
}

// ROUTES
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/clothing",
        element: <Clothing />,
      },
      {
        path: "/maple",
        element: <Maple />,
      },
    ],
  },
]);

// DÉMARRAGE DE L'APPLICATION
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
