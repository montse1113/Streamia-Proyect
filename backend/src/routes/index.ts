import { Router } from "express";

export class AppRoutes {
  static get router(): Router {
    const router = Router();

    router.get("/v1/health", (_req, res) => {
      res.json({ status: "ok" });
    });

    return router;
  }
}