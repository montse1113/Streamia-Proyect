import Stripe from "stripe";

let stripe: Stripe | null = null;

// created on first use, so the app and the tests can start without the key
export function getStripe(): Stripe {
    if (!stripe) {
        const { STRIPE_SECRET_KEY } = process.env;
        if (!STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not defined");
        }
        stripe = new Stripe(STRIPE_SECRET_KEY);
    }
    return stripe;
}
