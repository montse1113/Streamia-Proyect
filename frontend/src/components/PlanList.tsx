import type { Plan } from '../types/plan'
import { PlanCard } from './PlanCard'

interface PlanListProps {
  plans: Plan[]
}

// Shows the list of plans it receives
export function PlanList({ plans }: PlanListProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard plan={plan} />
        </li>
      ))}
    </ul>
  )
}
