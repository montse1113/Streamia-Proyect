import { Router } from "express";
import { AuthRoutes } from "./auth.routes.ts";

export class AppRoutes {
  static get router(): Router {
    const router = Router();

    router.get("/v1/health", (_req, res) => {
      res.json({ status: "ok" });
    });
    router.use("/v1/auth", AuthRoutes.router);

    return router;
  }
}