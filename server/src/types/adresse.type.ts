import { AdresseType } from "./adresse-type.type.js";

export interface Adresse {
  type?: AdresseType;
  noCivic: number;
  rue: string;
  numAppartement?: number;
  ville: string;
  province: string;
  pays: string;
  codePostal: string;
  isAdresseParDefaut?: boolean;
}
