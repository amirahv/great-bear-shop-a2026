import { Router } from "express";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import { creerSessionPaiement } from "../controllers/paiement.controller.js";

const paiementRouter = Router();

/**
 * POST /api/paiements/session
 * Prépare le paiement d'une commande appartenant à l'utilisateur connecté.
 *
 * @author Amir
 */
paiementRouter.post("/session", authenticateToken, creerSessionPaiement);

export default paiementRouter;
