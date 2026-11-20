import { PlanResponseDto } from "../plans/PlanResponseDto.ts";

type SubscriptionData = {
    id: number;
    status: string;
    currentPeriodEnd: Date | null;
    plan: Parameters<typeof PlanResponseDto.create>[0];
};

// never includes Stripe ids
export class SubscriptionResponseDto {
    private constructor(
        public readonly id: number,
        public readonly status: string,
        public readonly currentPeriodEnd: Date | null,
        public readonly plan: PlanResponseDto,
    ) {}

    public static create(subscription: SubscriptionData): SubscriptionResponseDto {
        return new SubscriptionResponseDto(
            subscription.id,
            subscription.status,
            subscription.currentPeriodEnd,
            PlanResponseDto.create(subscription.plan),
        );
    }
}
