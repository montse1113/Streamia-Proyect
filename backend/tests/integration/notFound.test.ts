import request from "supertest";
import { app } from "../helpers/testApp.ts";

describe("unknown API routes", () => {
    it("returns 404 with a JSON message", async () => {
        const res = await request(app).get("/api/v1/nothing");

        expect(res.status).toBe(404);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body).toEqual({ message: "We couldn't find what you were looking for." });
    });
});
