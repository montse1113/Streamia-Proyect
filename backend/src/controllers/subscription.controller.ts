import type { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service.ts";
import type { TokenPayload } from "../adapters/jwt.adapter.ts";

export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    // the user id always comes from the token, never from the url or the body
    public checkout = async (req: Request, res: Response) => {
        const { id } = res.locals.user as TokenPayload;
        const checkout = await this.subscriptionService.createCheckout(id, req.body.planId);
        res.status(201).json({ data: checkout });
    };

    public me = async (_req: Request, res: Response) => {
        const { id } = res.locals.user as TokenPayload;
        const subscription = await this.subscriptionService.getMine(id);
        res.json({ data: subscription });
    };
}
