import type { Request, Response } from "express";
import { PlanService } from "../services/plan.service.ts";

export class PlanController {
    constructor(private readonly planService: PlanService) {}

    public list = async (_req: Request, res: Response) => {
        const plans = await this.planService.listActive();
        res.json({ data: plans });
    };
}
