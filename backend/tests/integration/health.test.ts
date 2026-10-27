import request from "supertest";
import { app } from "../helpers/testApp.ts";

describe("GET /api/v1/health", () => {
    it("returns 200 and status ok", async () => {
        const res = await request(app).get("/api/v1/health");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});
