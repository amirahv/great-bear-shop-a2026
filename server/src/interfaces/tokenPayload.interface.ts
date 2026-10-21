import { JwtPayload } from "jsonwebtoken";
import { UtilisateurRole } from "../types/utilisateur-role.type.js";

/**
 * Interface qui definit la structure des donnees stockees dans le jwt
 *
 * @author Martin Ore Rodriguez
 */

export interface MyTokenPayload extends JwtPayload {
  id: string;
  role: UtilisateurRole;
}
