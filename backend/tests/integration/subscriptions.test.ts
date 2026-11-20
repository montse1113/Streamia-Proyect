import request from "supertest";
import { app } from "../helpers/testApp.ts";
import { JwtAdapter } from "../../src/adapters/jwt.adapter.ts";
import { Plan, Subscription } from "../../src/models/index.ts";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";

// fake Stripe: the tests never call the real API and do not need the secret key
const { createSession } = vi.hoisted(() => ({ createSession: vi.fn() }));
vi.mock("../../src/conf/stripe.ts", () => ({
    getStripe: () => ({ checkout: { sessions: { create: createSession } } }),
}));

const CUSTOMER_ID = 2; // seed customer of schema.sql
const FAKE_URL = "https://checkout.stripe.com/test-session";
let customerToken: string;

beforeAll(async () => {
    customerToken = await new JwtAdapter().sign({ id: CUSTOMER_ID, role: "customer" });
});

beforeEach(async () => {
    createSession.mockReset();
    createSession.mockResolvedValue({ url: FAKE_URL });
    await Subscription.destroy({ where: { userId: CUSTOMER_ID } });
});

afterAll(async () => {
    await Subscription.destroy({ where: { userId: CUSTOMER_ID } });
    await sequelizeConnection.disconnect();
});

describe("POST /api/v1/subscriptions/checkout", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).post("/api/v1/subscriptions/checkout").send({ planId: 2 });

        expect(res.status).toBe(401);
        expect(createSession).not.toHaveBeenCalled();
    });

    it("returns 400 when planId is not valid", async () => {
        const res = await request(app)
            .post("/api/v1/subscriptions/checkout")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ planId: "abc" });

        expect(res.status).toBe(400);
        expect(res.body.errors[0].field).toBe("planId");
        expect(createSession).not.toHaveBeenCalled();
    });

    it("returns 404 when the plan does not exist", async () => {
        const res = await request(app)
            .post("/api/v1/subscriptions/checkout")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ planId: 999 });

        expect(res.status).toBe(404);
        expect(createSession).not.toHaveBeenCalled();
    });

    it("returns 201 with the url and uses the price from the database", async () => {
        const plan = await Plan.findByPk(2);

        const res = await request(app)
            .post("/api/v1/subscriptions/checkout")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ planId: 2, price: 1 }); // a price in the body must be ignored

        expect(res.status).toBe(201);
        expect(res.body.data).toEqual({ url: FAKE_URL });

        const pending = await Subscription.findOne({ where: { userId: CUSTOMER_ID, status: "pending" } });
        expect(pending?.planId).toBe(2);

        // Stripe got the price id from the database, not the price sent in the body
        expect(createSession).toHaveBeenCalledWith(
            expect.objectContaining({
                line_items: [{ price: plan?.priceId, quantity: 1 }],
                metadata: expect.objectContaining({ subscriptionId: String(pending?.id) }),
            }),
        );
    });

    it("returns 409 when the user already has an active subscription", async () => {
        await Subscription.create({ userId: CUSTOMER_ID, planId: 1, status: "active" });

        const res = await request(app)
            .post("/api/v1/subscriptions/checkout")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({ planId: 2 });

        expect(res.status).toBe(409);
        expect(createSession).not.toHaveBeenCalled();
    });
});

describe("GET /api/v1/subscriptions/me", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/v1/subscriptions/me");

        expect(res.status).toBe(401);
    });

    it("returns null when there is only an unfinished checkout", async () => {
        await Subscription.create({ userId: CUSTOMER_ID, planId: 2 });

        const res = await request(app).get("/api/v1/subscriptions/me").set("Authorization", `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toBeNull();
    });

    it("returns the active subscription with its plan and without Stripe ids", async () => {
        await Subscription.create({ userId: CUSTOMER_ID, planId: 3, status: "active", stripeSubsId: "sub_test_123" });

        const res = await request(app).get("/api/v1/subscriptions/me").set("Authorization", `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe("active");
        expect(res.body.data.plan.name).toBe("Premium");
        expect(res.body.data.stripeSubsId).toBeUndefined();
        expect(res.body.data.plan.priceId).toBeUndefined();
    });
});
