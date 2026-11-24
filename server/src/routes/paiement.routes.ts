import { Router } from "express";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import {
  creerSessionPaiement,
  synchroniserPaiement,
} from "../controllers/paiement.controller.js";

const paiementRouter = Router();

// Prépare la page de paiement d'une commande.
paiementRouter.post("/session", authenticateToken, creerSessionPaiement);

// Vérifie auprès de Stripe l'état du paiement d'une commande.
paiementRouter.post("/synchroniser", authenticateToken, synchroniserPaiement);

export default paiementRouter;
