type PlanData = {
    id: number;
    name: string;
    price: string | number;
    maxQuality: string;
    maxScreens: number;
};

// public data of a plan, without the Stripe price id
export class PlanResponseDto {
    private constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly price: number,
        public readonly maxQuality: string,
        public readonly maxScreens: number,
    ) {}

    public static create(plan: PlanData): PlanResponseDto {
        // MySQL returns DECIMAL columns as strings
        return new PlanResponseDto(plan.id, plan.name, Number(plan.price), plan.maxQuality, plan.maxScreens);
    }
}
