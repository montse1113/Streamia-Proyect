import type { Plan } from '../types/plan'
import { PlanCard } from './PlanCard'

interface PlanListProps {
  plans: Plan[]
  onSubscribe: (planId: number) => void
  subscribingId: number | null // id of the plan being sent, or null
}

// shows the list of plans it receives
export function PlanList({ plans, onSubscribe, subscribingId }: PlanListProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard
            plan={plan}
            onSubscribe={onSubscribe}
            isSubscribing={subscribingId === plan.id}
            disabled={subscribingId !== null}
          />
        </li>
      ))}
    </ul>
  )
}