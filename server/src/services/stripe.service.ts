import "dotenv/config";
import Stripe from "stripe";

const cleSecrete = process.env.STRIPE_SECRET_KEY;

if (!cleSecrete) {
  throw new Error(
    "La variable STRIPE_SECRET_KEY est manquante dans le fichier .env.",
  );
}

export const stripe = new Stripe(cleSecrete);
