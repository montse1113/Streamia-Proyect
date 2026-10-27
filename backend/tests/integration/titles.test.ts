import request from "supertest";
import { app } from "../helpers/testApp.ts";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";

afterAll(async () => {
    await sequelizeConnection.disconnect();
});

describe("GET /api/v1/titles", () => {
    it("returns 200 with data and meta", async () => {
        const res = await request(app).get("/api/v1/titles");

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(15);
        expect(res.body.meta).toEqual({
            page: 1,
            limit: 15,
            total: expect.any(Number),
            totalPages: expect.any(Number),
        });
    });

    it("filters by type", async () => {
        const res = await request(app).get("/api/v1/titles?type=series");

        expect(res.status).toBe(200);
        for (const title of res.body.data) {
            expect(title.type).toBe("series");
        }
    });

    it("does not return video urls", async () => {
        const res = await request(app).get("/api/v1/titles");

        expect(res.body.data[0].videoUrl).toBeUndefined();
    });

    it("returns 400 when limit is greater than 50", async () => {
        const res = await request(app).get("/api/v1/titles?limit=500");

        expect(res.status).toBe(400);
        expect(res.body.errors[0].field).toBe("limit");
    });
});

describe("GET /api/v1/titles/:id", () => {
    it("returns 200 with the title", async () => {
        const res = await request(app).get("/api/v1/titles/1");

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(1);
    });

    it("returns 404 when the title does not exist", async () => {
        const res = await request(app).get("/api/v1/titles/999");

        expect(res.status).toBe(404);
    });

    it("returns 400 when the id is not a number", async () => {
        const res = await request(app).get("/api/v1/titles/abc");

        expect(res.status).toBe(400);
    });
});

describe("GET /api/v1/genres", () => {
    it("returns 200 with the genres", async () => {
        const res = await request(app).get("/api/v1/genres");

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});
