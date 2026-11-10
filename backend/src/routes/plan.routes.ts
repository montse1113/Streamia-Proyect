import { Router } from "express";
import { PlanController } from "../controllers/plan.controller.ts";
import { PlanService } from "../services/plan.service.ts";

const planController = new PlanController(new PlanService());

export class PlanRoutes {
    static get router(): Router {
        const router = Router();

        // public: visitors can see the plans before signing up
        router.get("/", planController.list);

        return router;
    }
}
