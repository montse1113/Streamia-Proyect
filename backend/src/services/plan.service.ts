import { Plan } from "../models/index.ts";
import { PlanResponseDto } from "../dtos/plans/PlanResponseDto.ts";

export class PlanService {
    public async listActive() {
        const plans = await Plan.findAll({ where: { isActive: true }, order: [["price", "ASC"]] });
        return plans.map((plan) => PlanResponseDto.create(plan));
    }
}
