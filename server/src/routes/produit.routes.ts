import { Router } from "express";
import { obtenirProduits } from "../controllers/produit.controller.js";

const produitRouter = Router();

produitRouter.get("/", obtenirProduits);

export default produitRouter;
