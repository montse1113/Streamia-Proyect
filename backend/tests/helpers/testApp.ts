import { Server } from "../../src/server.ts";
import { AppRoutes } from "../../src/routes/index.ts";

// same app as in app.ts but without listen(), so supertest can use it
export const app = new Server({ port: 0, routes: AppRoutes.router, frontendUrl: "" }).app;
