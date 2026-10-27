import request from "supertest";
import { app } from "../helpers/testApp.ts";
import { User } from "../../src/models/index.ts";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";

const email = `test_${Date.now()}@streamia.test`;
const password = "Password123";

afterAll(async () => {
    await User.destroy({ where: { email } });
    await sequelizeConnection.disconnect();
});

describe("POST /api/v1/auth/register", () => {
    it("creates a customer and does not return the password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "Test", lastName: "User", email, password, role: "admin" });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe(email);
        expect(res.body.user.role).toBe("customer");
        expect(res.body.user.password).toBeUndefined();
    });

    it("returns 409 when the email is already registered", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "Test", lastName: "User", email, password });

        expect(res.status).toBe(409);
    });

    it("returns 400 with the invalid fields", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "", lastName: "User", email: "not-an-email", password: "short" });

        expect(res.status).toBe(400);
        const fields = res.body.errors.map((error: { field: string }) => error.field);
        expect(fields).toEqual(expect.arrayContaining(["name", "email", "password"]));
    });

    it("returns 400 when the body is not valid JSON", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .set("Content-Type", "application/json")
            .send("{\"email\": ");

        expect(res.status).toBe(400);
    });
});

describe("POST /api/v1/auth/login", () => {
    it("returns a token and the user", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ email, password });

        expect(res.status).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
        expect(res.body.user.email).toBe(email);
        expect(res.body.user.password).toBeUndefined();
    });

    it("returns 401 with a wrong password", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ email, password: "Wrong1234" });

        expect(res.status).toBe(401);
    });

    it("returns 400 when the email is missing", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ password });

        expect(res.status).toBe(400);
    });
});
