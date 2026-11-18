import type { Plan } from '../types/plan'
import { PlanCard } from './PlanCard'

interface PlanListProps {
  plans: Plan[]
}

// Shows the list of plans it receives
export function PlanList({ plans }: PlanListProps) {
  return (
    <ul>
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard plan={plan} />
        </li>
      ))}
    </ul>
  )
}
