import { Op } from "sequelize";
import { getStripe } from "../conf/stripe.ts";
import { Plan, Subscription, User } from "../models/index.ts";
import type { IPlan } from "../models/Plan.ts";
import type { ISubscription } from "../models/Subscription.ts";
import { SubscriptionResponseDto } from "../dtos/subscriptions/SubscriptionResponseDto.ts";
import { HttpError } from "../errors/HttpError.ts";

type SubscriptionWithPlan = ISubscription & { plan: IPlan };

export class SubscriptionService {
    // userId always comes from the token, the price always from the database
    public async createCheckout(userId: number, planId: number): Promise<{ url: string }> {
        const plan = await Plan.findOne({ where: { id: planId, isActive: true } });
        if (!plan || !plan.priceId) {
            throw new HttpError(404, "We couldn't find that plan.");
        }
        const priceId = plan.priceId;

        const active = await Subscription.findOne({ where: { userId, status: "active" } });
        if (active) {
            throw new HttpError(409, "You already have an active subscription.");
        }

        const user = await User.findOne({ where: { id: userId, isActive: true } });
        if (!user) {
            throw new HttpError(404, "We couldn't find your account.");
        }

        // reuse an unfinished checkout instead of piling up pending rows
        let subscription = await Subscription.findOne({ where: { userId, status: "pending" } });
        if (subscription) {
            await subscription.update({ planId: plan.id });
        } else {
            subscription = await Subscription.create({ userId, planId: plan.id });
        }

        // the webhook uses this metadata to find the subscription to activate
        const metadata = { subscriptionId: String(subscription.id), userId: String(userId) };
        const frontendUrl = process.env.FRONTEND_URL ?? "";

        const session = await getStripe().checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: user.email,
            client_reference_id: String(subscription.id),
            metadata,
            subscription_data: { metadata },
            success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/plans`,
        });

        if (!session.url) {
            throw new Error("Stripe did not return a checkout url");
        }
        return { url: session.url };
    }

    // latest subscription that is not an unfinished checkout, or null if there is none
    public async getMine(userId: number): Promise<SubscriptionResponseDto | null> {
        const subscription = (await Subscription.findOne({
            where: { userId, status: { [Op.ne]: "pending" } },
            include: [{ model: Plan, as: "plan" }],
            order: [["createdAt", "DESC"], ["id", "DESC"]],
        })) as SubscriptionWithPlan | null;

        return subscription ? SubscriptionResponseDto.create(subscription) : null;
    }
}
