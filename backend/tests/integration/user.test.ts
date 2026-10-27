import request from "supertest";
import { app } from "../helpers/testApp.ts";
import { JwtAdapter } from "../../src/adapters/jwt.adapter.ts";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";

// tokens for the seed users of schema.sql (1 = admin, 2 = customer)
const jwtAdapter = new JwtAdapter();
let adminToken: string;
let customerToken: string;

beforeAll(async () => {
    adminToken = await jwtAdapter.sign({ id: 1, role: "admin" });
    customerToken = await jwtAdapter.sign({ id: 2, role: "customer" });
});

afterAll(async () => {
    await sequelizeConnection.disconnect();
});

describe("GET /api/v1/users/me", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/v1/users/me");

        expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
        const res = await request(app).get("/api/v1/users/me").set("Authorization", "Bearer invalid.token");

        expect(res.status).toBe(401);
    });

    it("returns the user of the token", async () => {
        const res = await request(app).get("/api/v1/users/me").set("Authorization", `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(2);
        expect(res.body.data.password).toBeUndefined();
    });
});

describe("GET /api/v1/admin/users", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/v1/admin/users");

        expect(res.status).toBe(401);
    });

    it("returns 403 for a customer", async () => {
        const res = await request(app).get("/api/v1/admin/users").set("Authorization", `Bearer ${customerToken}`);

        expect(res.status).toBe(403);
    });

    it("returns 200 for an admin", async () => {
        const res = await request(app).get("/api/v1/admin/users").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});
