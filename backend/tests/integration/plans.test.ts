import request from "supertest";
import { app } from "../helpers/testApp.ts";
import { Plan } from "../../src/models/index.ts";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";

const inactiveName = `Inactive_${Date.now()}`;

beforeAll(async () => {
    await Plan.create({ name: inactiveName, price: 1, maxQuality: "SD", maxScreens: 1, isActive: false });
});

afterAll(async () => {
    await Plan.destroy({ where: { name: inactiveName } });
    await sequelizeConnection.disconnect();
});

describe("GET /api/v1/plans", () => {
    it("returns 200 with the plans without a token", async () => {
        const res = await request(app).get("/api/v1/plans");

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            maxQuality: expect.any(String),
            maxScreens: expect.any(Number),
        });
    });

    it("does not return inactive plans or the Stripe price id", async () => {
        const res = await request(app).get("/api/v1/plans");

        const names = res.body.data.map((plan: { name: string }) => plan.name);
        expect(names).not.toContain(inactiveName);
        expect(res.body.data[0].priceId).toBeUndefined();
    });
});
