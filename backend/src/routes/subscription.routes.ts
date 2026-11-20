import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.ts";
import { SubscriptionService } from "../services/subscription.service.ts";
import { JwtAdapter } from "../adapters/jwt.adapter.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validateData.ts";
import { checkoutValidator } from "../validators/subscriptions.ts";

const subscriptionController = new SubscriptionController(new SubscriptionService());

export class SubscriptionRoutes {
    static get router(): Router {
        const router = Router();

        // every subscription route needs a valid token
        router.use(authenticate(new JwtAdapter()));
        router.post("/checkout", checkoutValidator, validate, subscriptionController.checkout);
        router.get("/me", subscriptionController.me);

        return router;
    }
}
